import React, { useEffect, useRef, useState, useCallback, useId } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import {
  CameraDeviceItem,
  UniversalScannerProps,
  ZoomCapabilitiesState,
} from "./UniversalScanner.types";
import { UniversalScannerHUD } from "./UniversalScannerHUD";
import { triggerScanFeedback } from "./UniversalScannerFeedback";
import {
  IoVideocamOutline,
  IoImageOutline,
  IoKeypadOutline,
  IoCheckmarkOutline,
  IoTrashOutline,
} from "react-icons/io5";
import "./UniversalScanner.scss";

const DEFAULT_SUPPORTED_FORMATS: Html5QrcodeSupportedFormats[] = [
  Html5QrcodeSupportedFormats.QR_CODE,
  Html5QrcodeSupportedFormats.CODE_128,
  Html5QrcodeSupportedFormats.CODE_39,
  Html5QrcodeSupportedFormats.CODE_93,
  Html5QrcodeSupportedFormats.EAN_13,
  Html5QrcodeSupportedFormats.EAN_8,
  Html5QrcodeSupportedFormats.UPC_A,
  Html5QrcodeSupportedFormats.UPC_E,
  Html5QrcodeSupportedFormats.DATA_MATRIX,
  Html5QrcodeSupportedFormats.ITF,
  Html5QrcodeSupportedFormats.CODABAR,
];

const PREFERRED_CAMERA_STORAGE_KEY = "erp_preferred_scanner_camera_id";

export const UniversalScanner: React.FC<UniversalScannerProps> = ({
  onScanSuccess,
  onScanError,
  mode = "single",
  fps = 25,
  beepOnScan = true,
  vibrateOnScan = true,
  disableTorch = false,
  disableZoom = false,
  disableCameraSwitch = false,
  disableFileUpload = false,
  disableManualInput = false,
  formatsToSupport = DEFAULT_SUPPORTED_FORMATS,
  className = "",
  cameraHeight = 360,
}) => {
  const uniqueId = useId().replace(/:/g, "_");
  const readerElementId = `erp-universal-reader-${uniqueId}`;

  // Tabs: 'camera' | 'file' | 'manual'
  const [activeTab, setActiveTab] = useState<"camera" | "file" | "manual">("camera");

  // Scanner status
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasScanSuccessPulse, setHasScanSuccessPulse] = useState<boolean>(false);

  // Cameras
  const [cameras, setCameras] = useState<CameraDeviceItem[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>("");

  // Flash / Torch
  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);
  const [isTorchSupported, setIsTorchSupported] = useState<boolean>(false);

  // Sound
  const [isBeepOn, setIsBeepOn] = useState<boolean>(beepOnScan);

  // Zoom
  const [zoomState, setZoomState] = useState<ZoomCapabilitiesState>({
    min: 1,
    max: 5,
    step: 0.1,
    current: 1,
    isSupported: false,
  });

  // Continuous Scan History
  const [scannedHistory, setScannedHistory] = useState<string[]>([]);
  const lastScannedCodeRef = useRef<{ text: string; time: number } | null>(null);

  // Manual Input State
  const [manualCode, setManualCode] = useState<string>("");

  // Helper apply CSS zoom
  const applyCssZoom = useCallback((zoom: number) => {
    const readerEl = document.getElementById(readerElementId);
    if (!readerEl) return;
    const videoEl = readerEl.querySelector("video");
    if (videoEl) {
      videoEl.style.transform = zoom > 1 ? `scale(${zoom})` : "none";
      videoEl.style.transformOrigin = "center center";
      videoEl.style.transition = "transform 0.15s ease-out";
    }
  }, [readerElementId]);

  // Query track capabilities for Zoom and Torch
  const inspectCapabilities = useCallback((scanner: Html5Qrcode) => {
    try {
      const capabilities = scanner.getRunningTrackCapabilities() as any;
      const cameraCaps = scanner.getRunningTrackCameraCapabilities();

      // Check Torch
      const torchSupported =
        Boolean(capabilities?.torch) ||
        (cameraCaps?.torchFeature && cameraCaps.torchFeature().isSupported());
      setIsTorchSupported(Boolean(torchSupported));

      // Check Zoom
      const zoomSupported =
        Boolean(capabilities?.zoom) ||
        (cameraCaps?.zoomFeature && cameraCaps.zoomFeature().isSupported());

      if (zoomSupported) {
        let min = 1;
        let max = 5;
        let step = 0.1;

        if (capabilities?.zoom) {
          min = capabilities.zoom.min ?? 1;
          max = capabilities.zoom.max ?? 5;
          step = capabilities.zoom.step ?? 0.1;
        } else if (cameraCaps?.zoomFeature) {
          min = cameraCaps.zoomFeature().min();
          max = cameraCaps.zoomFeature().max();
          step = cameraCaps.zoomFeature().step();
        }

        setZoomState({
          min,
          max,
          step,
          current: 1,
          isSupported: true,
        });
      } else {
        // Fallback CSS digital zoom
        setZoomState({
          min: 1,
          max: 3,
          step: 0.5,
          current: 1,
          isSupported: false,
        });
      }
    } catch (err) {
      console.warn("Capabilities inspection notice:", err);
    }
  }, []);

  // Stop scanner safely
  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
      } catch (err) {
        // Ignored during cleanup
      }
      scannerRef.current = null;
    }
    setIsScanning(false);
    setIsTorchOn(false);
  }, []);

  // Handle successful code capture
  const handleDecoded = useCallback(
    (decodedText: string, formatName?: string) => {
      const cleanText = decodedText.trim();
      if (!cleanText) return;

      const now = Date.now();
      // Debounce: tránh trùng mã trong vòng 1.5s
      if (
        lastScannedCodeRef.current &&
        lastScannedCodeRef.current.text === cleanText &&
        now - lastScannedCodeRef.current.time < 1500
      ) {
        return;
      }
      lastScannedCodeRef.current = { text: cleanText, time: now };

      // Phát âm thanh bíp và rung
      triggerScanFeedback(isBeepOn, vibrateOnScan);

      // Hiệu ứng visual pulse
      setHasScanSuccessPulse(true);
      setTimeout(() => setHasScanSuccessPulse(false), 700);

      if (mode === "single") {
        stopScanner();
        onScanSuccess(cleanText, formatName);
      } else {
        setScannedHistory((prev) => [cleanText, ...prev.slice(0, 19)]);
        onScanSuccess(cleanText, formatName);
      }
    },
    [isBeepOn, vibrateOnScan, mode, stopScanner, onScanSuccess]
  );

  // Start scanner with Full HD constraints & native BarcodeDetector
  const startScanner = useCallback(
    async (cameraIdToUse?: string) => {
      await stopScanner();
      setErrorMessage(null);

      const targetCameraId = cameraIdToUse || selectedCameraId;

      try {
        const scanner = new Html5Qrcode(readerElementId, {
          formatsToSupport,
          useBarCodeDetectorIfSupported: true,
          verbose: false,
        });
        scannerRef.current = scanner;

        // Constraints Full HD 1080p cận native
        const videoConstraints: MediaTrackConstraints = {
          width: { ideal: 1920, min: 1280 },
          height: { ideal: 1080, min: 720 },
          frameRate: { ideal: 30, min: 15 },
          facingMode: targetCameraId ? undefined : { ideal: "environment" },
          deviceId: targetCameraId ? { exact: targetCameraId } : undefined,
        };

        const config = {
          fps,
          qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
            const isLandscape = viewfinderWidth > viewfinderHeight;
            const width = Math.floor(Math.min(viewfinderWidth * 0.88, isLandscape ? 540 : 380));
            const height = Math.floor(Math.min(viewfinderHeight * (isLandscape ? 0.75 : 0.55), 280));
            return { width, height };
          },
          aspectRatio: undefined,
          disableFlip: false,
          videoConstraints,
        };

        await scanner.start(
          targetCameraId || { facingMode: "environment" },
          config,
          (decodedText, result) => {
            const formatName = result?.result?.format?.formatName || undefined;
            handleDecoded(decodedText, formatName);
          },
          (errorText) => {
            if (onScanError) onScanError(errorText);
          }
        );

        setIsScanning(true);
        inspectCapabilities(scanner);
      } catch (err: any) {
        console.error("Lỗi khởi tạo camera Full HD:", err);
        setErrorMessage(
          err?.message ||
            "Không thể truy cập camera. Vui lòng cấp quyền máy ảnh và đảm bảo không có ứng dụng khác đang dùng camera."
        );
        setIsScanning(false);
      }
    },
    [stopScanner, selectedCameraId, readerElementId, formatsToSupport, fps, handleDecoded, onScanError, inspectCapabilities]
  );

  // Enumerate cameras on mount
  useEffect(() => {
    let isMounted = true;

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (!isMounted || !devices || devices.length === 0) return;

        const formattedDevices: CameraDeviceItem[] = devices.map((d) => {
          const lower = d.label.toLowerCase();
          const isBack =
            lower.includes("back") ||
            lower.includes("rear") ||
            lower.includes("sau") ||
            lower.includes("environment");
          return {
            id: d.id,
            label: d.label || `Camera ${d.id.slice(0, 5)}...`,
            isBackCamera: isBack,
          };
        });

        setCameras(formattedDevices);

        // Chọn camera ưu tiên: từ localStorage hoặc camera sau đầu tiên
        const savedCam = localStorage.getItem(PREFERRED_CAMERA_STORAGE_KEY);
        const preferred =
          formattedDevices.find((d) => d.id === savedCam) ||
          formattedDevices.find((d) => d.isBackCamera) ||
          formattedDevices[0];

        if (preferred) {
          setSelectedCameraId(preferred.id);
        }
      })
      .catch((err) => {
        console.warn("Không thể liệt kê danh sách camera:", err);
      });

    return () => {
      isMounted = false;
      stopScanner();
    };
  }, [stopScanner]);

  // Start scanner when camera tab is active and camera selected
  useEffect(() => {
    if (activeTab === "camera") {
      const timer = setTimeout(() => {
        startScanner(selectedCameraId);
      }, 150);
      return () => {
        clearTimeout(timer);
        stopScanner();
      };
    } else {
      stopScanner();
    }
  }, [activeTab, selectedCameraId, startScanner, stopScanner]);

  // Handle Zoom change
  const handleChangeZoom = async (newZoom: number) => {
    if (!scannerRef.current) return;
    const clamped = Math.max(zoomState.min, Math.min(zoomState.max, Number(newZoom.toFixed(1))));
    setZoomState((prev) => ({ ...prev, current: clamped }));

    if (zoomState.isSupported) {
      try {
        const cameraCaps = scannerRef.current.getRunningTrackCameraCapabilities();
        if (cameraCaps?.zoomFeature && cameraCaps.zoomFeature().isSupported()) {
          await cameraCaps.zoomFeature().apply(clamped);
        } else {
          await scannerRef.current.applyVideoConstraints({
            advanced: [{ zoom: clamped } as any],
          });
        }
      } catch (err) {
        applyCssZoom(clamped);
      }
    } else {
      applyCssZoom(clamped);
    }
  };

  // Handle Torch toggle
  const handleToggleTorch = async () => {
    if (!scannerRef.current || !isTorchSupported) return;
    const nextState = !isTorchOn;

    try {
      const cameraCaps = scannerRef.current.getRunningTrackCameraCapabilities();
      if (cameraCaps?.torchFeature && cameraCaps.torchFeature().isSupported()) {
        await cameraCaps.torchFeature().apply(nextState);
      } else {
        await scannerRef.current.applyVideoConstraints({
          advanced: [{ torch: nextState } as any],
        });
      }
      setIsTorchOn(nextState);
    } catch (err) {
      console.warn("Lỗi bật/tắt đèn flash:", err);
    }
  };

  // Flip Camera (chuyển đổi nhanh trước/sau)
  const handleFlipCamera = () => {
    if (cameras.length <= 1) return;
    const currentIndex = cameras.findIndex((c) => c.id === selectedCameraId);
    const nextIndex = (currentIndex + 1) % cameras.length;
    const nextCamera = cameras[nextIndex];
    if (nextCamera) {
      localStorage.setItem(PREFERRED_CAMERA_STORAGE_KEY, nextCamera.id);
      setSelectedCameraId(nextCamera.id);
    }
  };

  // Select camera from dropdown
  const handleSelectCamera = (camId: string) => {
    localStorage.setItem(PREFERRED_CAMERA_STORAGE_KEY, camId);
    setSelectedCameraId(camId);
  };

  // File Upload Scan
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileScanner = new Html5Qrcode(`temp-file-scanner-${uniqueId}`, {
        formatsToSupport,
        useBarCodeDetectorIfSupported: true,
        verbose: false,
      });

      const decodedText = await fileScanner.scanFile(file, false);
      fileScanner.clear();
      handleDecoded(decodedText);
    } catch (err) {
      setErrorMessage("Không tìm thấy mã vạch hoặc mã QR hợp lệ trong bức ảnh này.");
    }
  };

  // Submit Manual Input
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      handleDecoded(manualCode.trim());
      setManualCode("");
    }
  };

  return (
    <div className={`universal-scanner ${className}`}>
      {/* Hidden container for file scan temp instances */}
      <div id={`temp-file-scanner-${uniqueId}`} style={{ display: "none" }} />

      {/* 1. Thanh Tab Switcher */}
      {(!disableFileUpload || !disableManualInput) && (
        <div className="universal-scanner__tabs">
          <div className="universal-scanner__tab-group">
            <button
              type="button"
              onClick={() => setActiveTab("camera")}
              className={`universal-scanner__tab-btn ${activeTab === "camera" ? "is-active" : ""}`}
            >
              <IoVideocamOutline size={15} />
              <span>Camera</span>
            </button>

            {!disableFileUpload && (
              <button
                type="button"
                onClick={() => setActiveTab("file")}
                className={`universal-scanner__tab-btn ${activeTab === "file" ? "is-active" : ""}`}
              >
                <IoImageOutline size={15} />
                <span>Tải Ảnh</span>
              </button>
            )}

            {!disableManualInput && (
              <button
                type="button"
                onClick={() => setActiveTab("manual")}
                className={`universal-scanner__tab-btn ${activeTab === "manual" ? "is-active" : ""}`}
              >
                <IoKeypadOutline size={15} />
                <span>Nhập Tay</span>
              </button>
            )}
          </div>

          <div className="universal-scanner__telemetry">
            <span className="pulse-dot" />
            <span>1080p • AI Fast</span>
          </div>
        </div>
      )}

      {/* 2. Vùng hiển thị chính */}
      <div
        className="universal-scanner__viewport"
        style={{ minHeight: typeof cameraHeight === "number" ? `${cameraHeight}px` : cameraHeight }}
      >
        {activeTab === "camera" && (
          <>
            {/* The Live Video Container for Html5Qrcode */}
            <div
              id={readerElementId}
              className="universal-scanner__reader-box"
              style={{ minHeight: typeof cameraHeight === "number" ? `${cameraHeight}px` : cameraHeight }}
            />

            {/* Error Overlay */}
            {errorMessage && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "rgba(3, 7, 18, 0.95)",
                  zIndex: 30,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "20px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    padding: "12px",
                    borderRadius: "50%",
                    background: "rgba(244, 63, 94, 0.15)",
                    color: "#f43f5e",
                    marginBottom: "10px",
                  }}
                >
                  <IoVideocamOutline size={32} />
                </div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#ffffff", marginBottom: "4px" }}>
                  Không thể khởi động Camera
                </div>
                <div style={{ fontSize: "11px", color: "#94a3b8", maxWidth: "260px", marginBottom: "14px" }}>
                  {errorMessage}
                </div>
                <button
                  type="button"
                  onClick={() => startScanner(selectedCameraId)}
                  className="universal-scanner__tab-btn is-active"
                  style={{ padding: "8px 16px" }}
                >
                  Thử lại
                </button>
              </div>
            )}

            {/* Futuristic Enterprise HUD Overlay */}
            {!errorMessage && (
              <UniversalScannerHUD
                cameras={cameras}
                selectedCameraId={selectedCameraId}
                onSelectCamera={handleSelectCamera}
                onFlipCamera={handleFlipCamera}
                isTorchOn={isTorchOn}
                isTorchSupported={isTorchSupported}
                onToggleTorch={handleToggleTorch}
                zoomState={zoomState}
                onChangeZoom={handleChangeZoom}
                isBeepOn={isBeepOn}
                onToggleBeep={() => setIsBeepOn((prev) => !prev)}
                isScanning={isScanning}
                hasScanSuccessPulse={hasScanSuccessPulse}
                disableTorch={disableTorch}
                disableZoom={disableZoom}
                disableCameraSwitch={disableCameraSwitch}
              />
            )}
          </>
        )}

        {/* Tab 2: Upload File */}
        {activeTab === "file" && (
          <div className="universal-scanner__tab-content">
            <div className="universal-scanner__tab-icon universal-scanner__tab-icon--file">
              <IoImageOutline size={32} />
            </div>
            <div className="universal-scanner__tab-title">Chọn ảnh tem mã cần giải mã</div>
            <div className="universal-scanner__tab-desc">
              Hỗ trợ ảnh chụp nhãn tem, mã vạch 1D hoặc mã QR 2D từ thư viện ảnh thiết bị.
            </div>
            <label className="universal-scanner__file-label">
              <span>Chọn Ảnh Từ Thiết Bị</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} />
            </label>
            {errorMessage && (
              <div style={{ marginTop: "12px", fontSize: "11px", color: "#f43f5e" }}>
                {errorMessage}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Manual Input */}
        {activeTab === "manual" && (
          <form onSubmit={handleManualSubmit} className="universal-scanner__tab-content">
            <div className="universal-scanner__tab-icon universal-scanner__tab-icon--manual">
              <IoKeypadOutline size={32} />
            </div>
            <div className="universal-scanner__tab-title">Nhập mã thủ công</div>
            <div className="universal-scanner__tab-desc">
              Dành cho trường hợp tem mác bị rách, xước hoặc camera không nhận diện được.
            </div>
            <div className="universal-scanner__manual-form">
              <input
                type="text"
                autoFocus
                placeholder="Nhập hoặc dán mã tại đây..."
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className="universal-scanner__manual-input"
              />
              <button
                type="submit"
                disabled={!manualCode.trim()}
                className="universal-scanner__manual-submit"
                title="Xác nhận"
              >
                <IoCheckmarkOutline size={18} />
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 3. Lịch sử quét liên tục (chế độ continuous) */}
      {mode === "continuous" && scannedHistory.length > 0 && (
        <div className="universal-scanner__history-tray">
          <div className="universal-scanner__history-header">
            <span>Đã quét ({scannedHistory.length} mã):</span>
            <button type="button" onClick={() => setScannedHistory([])}>
              <IoTrashOutline size={13} />
              <span>Xóa</span>
            </button>
          </div>
          <div className="universal-scanner__history-chips">
            {scannedHistory.map((code, idx) => (
              <span key={`${code}-${idx}`} className="universal-scanner__history-chip">
                {code}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversalScanner;

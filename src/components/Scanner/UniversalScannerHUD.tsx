import React from "react";
import {
  IoCameraReverseOutline,
  IoFlashOutline,
  IoFlashOffOutline,
  IoVolumeHighOutline,
  IoVolumeMuteOutline,
  IoAddOutline,
  IoRemoveOutline,
} from "react-icons/io5";
import { CameraDeviceItem, ZoomCapabilitiesState } from "./UniversalScanner.types";

interface UniversalScannerHUDProps {
  cameras: CameraDeviceItem[];
  selectedCameraId: string;
  onSelectCamera: (cameraId: string) => void;
  onFlipCamera: () => void;
  isTorchOn: boolean;
  isTorchSupported: boolean;
  onToggleTorch: () => void;
  zoomState: ZoomCapabilitiesState;
  onChangeZoom: (zoomValue: number) => void;
  isBeepOn: boolean;
  onToggleBeep: () => void;
  isScanning: boolean;
  hasScanSuccessPulse: boolean;
  disableTorch?: boolean;
  disableZoom?: boolean;
  disableCameraSwitch?: boolean;
}

export const UniversalScannerHUD: React.FC<UniversalScannerHUDProps> = ({
  cameras,
  selectedCameraId,
  onSelectCamera,
  onFlipCamera,
  isTorchOn,
  isTorchSupported,
  onToggleTorch,
  zoomState,
  onChangeZoom,
  isBeepOn,
  onToggleBeep,
  isScanning,
  hasScanSuccessPulse,
  disableTorch = false,
  disableZoom = false,
  disableCameraSwitch = false,
}) => {
  // Mốc zoom nhanh: 1x, 2x, 3x (hoặc tối đa)
  const zoomPresets = React.useMemo(() => {
    if (!zoomState.isSupported && zoomState.max <= 1) return [1, 2, 3];
    const max = Math.min(zoomState.max, 5);
    const presets: number[] = [1];
    if (max >= 2) presets.push(2);
    if (max >= 3) presets.push(3);
    if (max > 3 && max <= 5) presets.push(Math.round(max));
    return presets;
  }, [zoomState]);

  return (
    <div className="universal-scanner__hud">
      {/* 1. Thanh điều khiển phía trên */}
      <div className="universal-scanner__hud-top">
        {/* Nhóm Camera (Lật & Chọn) */}
        <div className="universal-scanner__hud-group">
          {!disableCameraSwitch && cameras.length > 1 && (
            <button
              type="button"
              onClick={onFlipCamera}
              className="universal-scanner__hud-btn"
              title="Đổi camera trước/sau"
            >
              <IoCameraReverseOutline size={16} />
              <span>Lật Cam</span>
            </button>
          )}

          {!disableCameraSwitch && cameras.length > 2 && (
            <select
              value={selectedCameraId}
              onChange={(e) => onSelectCamera(e.target.value)}
              className="universal-scanner__camera-select"
              title="Chọn thiết bị camera cụ thể"
            >
              {cameras.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label || `Camera ${c.id.slice(0, 4)}...`}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Nhóm Flash & Âm Thanh */}
        <div className="universal-scanner__hud-group">
          {!disableTorch && (
            <button
              type="button"
              disabled={!isTorchSupported}
              onClick={onToggleTorch}
              className={`universal-scanner__hud-btn ${
                isTorchOn ? "is-torch-active" : ""
              } ${!isTorchSupported ? "is-disabled" : ""}`}
              title={
                !isTorchSupported
                  ? "Camera không hỗ trợ đèn Flash"
                  : isTorchOn
                  ? "Tắt đèn Flash"
                  : "Bật đèn Flash"
              }
            >
              {isTorchOn ? <IoFlashOutline size={16} /> : <IoFlashOffOutline size={16} />}
              <span>{isTorchOn ? "Flash Bật" : "Flash"}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onToggleBeep}
            className={`universal-scanner__hud-btn ${isBeepOn ? "is-sound-on" : ""}`}
            title={isBeepOn ? "Âm thanh bíp: Bật" : "Âm thanh bíp: Tắt"}
          >
            {isBeepOn ? <IoVolumeHighOutline size={16} /> : <IoVolumeMuteOutline size={16} />}
          </button>
        </div>
      </div>

      {/* 2. Khung ngắm Viewfinder HUD, Laser & 4 Góc Viền */}
      <div className="universal-scanner__hud-center">
        <div className={`universal-scanner__reticle ${hasScanSuccessPulse ? "has-success" : ""}`}>
          {/* 4 Góc ngắm Neon */}
          <div className="universal-scanner__corner universal-scanner__corner--tl" />
          <div className="universal-scanner__corner universal-scanner__corner--tr" />
          <div className="universal-scanner__corner universal-scanner__corner--bl" />
          <div className="universal-scanner__corner universal-scanner__corner--br" />

          {/* Tia laser quét ngang */}
          {isScanning && !hasScanSuccessPulse && <div className="universal-scanner__laser" />}

          {/* Huy hiệu xác nhận bắt mã thành công */}
          {hasScanSuccessPulse && (
            <div className="universal-scanner__success-pill">
              <span>ĐÃ BẮT MÃ THÀNH CÔNG</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Thanh điều khiển phía dưới: Zoom Bar & Hướng dẫn */}
      <div className="universal-scanner__hud-bottom">
        {!disableZoom && (
          <div className="universal-scanner__zoom-container">
            <button
              type="button"
              onClick={() => onChangeZoom(Math.max(zoomState.min, zoomState.current - 0.5))}
              className="universal-scanner__zoom-btn"
              title="Thu nhỏ"
            >
              <IoRemoveOutline size={14} />
            </button>

            <div className="universal-scanner__zoom-pills">
              {zoomPresets.map((preset) => {
                const isActive = Math.abs(zoomState.current - preset) < 0.25;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => onChangeZoom(preset)}
                    className={`universal-scanner__zoom-pill ${isActive ? "is-active" : ""}`}
                  >
                    {preset}x
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => onChangeZoom(Math.min(zoomState.max, zoomState.current + 0.5))}
              className="universal-scanner__zoom-btn"
              title="Phóng to"
            >
              <IoAddOutline size={14} />
            </button>
          </div>
        )}

        <div className="universal-scanner__guide-badge">
          Hướng khung ngắm vào mã Barcode (1D) hoặc mã QR (2D)
        </div>
      </div>
    </div>
  );
};

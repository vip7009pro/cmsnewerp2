import React, { useState } from "react";
import UniversalScanner from "./UniversalScanner";
import { ScannerScanMode } from "./UniversalScanner.types";
import {
  IoQrCodeOutline,
  IoCopyOutline,
  IoTrashOutline,
  IoCheckmarkDoneOutline,
} from "react-icons/io5";
import "./Scanner.scss";

const Scanner: React.FC = () => {
  const [scanResult, setScanResult] = useState<string>("");
  const [format, setFormat] = useState<string>("");
  const [mode, setMode] = useState<ScannerScanMode>("continuous");
  const [history, setHistory] = useState<Array<{ code: string; time: string; format?: string }>>([]);
  const [copied, setCopied] = useState<boolean>(false);

  const handleScanSuccess = (decodedText: string, formatName?: string) => {
    setScanResult(decodedText);
    setFormat(formatName || "Auto-detected");
    const nowStr = new Date().toLocaleTimeString();
    setHistory((prev) => [{ code: decodedText, time: nowStr, format: formatName }, ...prev.slice(0, 49)]);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="erp-scanner-page">
      {/* 1. Header Bar */}
      <div className="erp-scanner-page__header">
        <div className="erp-scanner-page__header-left">
          <div className="erp-scanner-page__icon-box">
            <IoQrCodeOutline size={20} />
          </div>
          <div>
            <h1 className="erp-scanner-page__title">Universal Barcode & QR Code Scanner</h1>
            <p className="erp-scanner-page__subtitle">
              Độ phân giải Full HD cận native • Bắt mã tốc độ cao • Hỗ trợ Zoom & Flash
            </p>
          </div>
        </div>

        <div className="erp-scanner-page__mode-toggle">
          <button
            type="button"
            onClick={() => setMode("single")}
            className={mode === "single" ? "is-active" : ""}
          >
            Quét Đơn
          </button>
          <button
            type="button"
            onClick={() => setMode("continuous")}
            className={mode === "continuous" ? "is-active" : ""}
          >
            Quét Liên Tục
          </button>
        </div>
      </div>

      {/* 2. Main Grid */}
      <div className="erp-scanner-page__body">
        {/* Scanner Component Area */}
        <div className="erp-scanner-page__scanner-card">
          <UniversalScanner
            mode={mode}
            onScanSuccess={handleScanSuccess}
            cameraHeight={380}
          />
        </div>

        {/* Result & Telemetry Panel */}
        <div className="erp-scanner-page__side-panel">
          {/* Latest Result Card */}
          <div className="erp-scanner-page__card">
            <div className="erp-scanner-page__card-header">
              <span>KẾT QUẢ GẦN NHẤT</span>
              {format && <span className="badge-format">{format}</span>}
            </div>

            {scanResult ? (
              <div className="erp-scanner-page__result-box">
                <span className="result-text">{scanResult}</span>
                <button type="button" onClick={() => handleCopy(scanResult)}>
                  {copied ? (
                    <>
                      <IoCheckmarkDoneOutline size={15} color="#34d399" />
                      <span style={{ color: "#34d399" }}>Đã chép</span>
                    </>
                  ) : (
                    <>
                      <IoCopyOutline size={15} />
                      <span>Chép</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="erp-scanner-page__empty-box">
                Chưa có mã nào được quét. Hướng camera vào tem nhãn để bắt mã.
              </div>
            )}
          </div>

          {/* Scanned History List */}
          <div className="erp-scanner-page__card" style={{ flex: 1 }}>
            <div className="erp-scanner-page__card-header">
              <span>LỊCH SỬ QUÉT ({history.length})</span>
              {history.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setHistory([]);
                    setScanResult("");
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#f43f5e",
                    cursor: "pointer",
                    fontSize: "11px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "3px",
                  }}
                >
                  <IoTrashOutline size={13} />
                  <span>Xóa</span>
                </button>
              )}
            </div>

            <div className="erp-scanner-page__history-list">
              {history.length === 0 ? (
                <div style={{ padding: "20px", textAlign: "center", fontSize: "11px", color: "#64748b" }}>
                  Lịch sử trống
                </div>
              ) : (
                history.map((item, idx) => (
                  <div key={`${item.code}-${idx}`} className="erp-scanner-page__history-item">
                    <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                      <span className="item-code">{item.code}</span>
                      <span className="item-time">{item.time}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(item.code)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#94a3b8",
                        cursor: "pointer",
                        padding: "4px",
                      }}
                    >
                      <IoCopyOutline size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scanner;
import React, { useState } from "react";
import UniversalScanner from "../../../components/Scanner/UniversalScanner";
import {
  IoBarcodeOutline,
  IoCopyOutline,
  IoCheckmarkDoneOutline,
} from "react-icons/io5";
import "../../../components/Scanner/Scanner.scss";

const CAMERASCANNER: React.FC = () => {
  const [data, setData] = useState<string>("Chưa quét mã nào");
  const [format, setFormat] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const handleScanSuccess = (code: string, formatName?: string) => {
    setData(code);
    setFormat(formatName || "Auto-detected");
  };

  const handleCopy = () => {
    if (data && data !== "Chưa quét mã nào") {
      navigator.clipboard.writeText(data);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "calc(100vh - 60px)",
        backgroundColor: "#030712",
        padding: "16px 12px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxSizing: "border-box",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: "480px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#0f172a",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "10px 14px",
            borderRadius: "12px",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.4)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "rgba(56, 189, 248, 0.12)",
                border: "1px solid rgba(56, 189, 248, 0.25)",
                color: "#38bdf8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IoBarcodeOutline size={20} />
            </div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#ffffff", letterSpacing: "0.2px" }}>
                MÁY QUÉT MÃ CÔNG NGHIỆP
              </div>
              <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                Barcode 1D & QR 2D • Full HD 1080p
              </div>
            </div>
          </div>
        </div>

        {/* Live Scanner */}
        <div
          style={{
            borderRadius: "16px",
            overflow: "hidden",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow: "0 16px 36px rgba(0, 0, 0, 0.6)",
            background: "#000000",
          }}
        >
          <UniversalScanner
            mode="continuous"
            onScanSuccess={handleScanSuccess}
            cameraHeight={380}
          />
        </div>

        {/* Result Card */}
        <div
          style={{
            background: "#0f172a",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            padding: "12px 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontSize: "10px",
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                fontWeight: 700,
                marginBottom: "2px",
              }}
            >
              KẾT QUẢ QUÉT {format && `• ${format}`}
            </div>
            <div
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: "14px",
                fontWeight: 700,
                color: data !== "Chưa quét mã nào" ? "#34d399" : "#64748b",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {data}
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            disabled={!data || data === "Chưa quét mã nào"}
            style={{
              padding: "7px 12px",
              borderRadius: "8px",
              background: data !== "Chưa quét mã nào" ? "#1e293b" : "#0f172a",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "#e2e8f0",
              cursor: data !== "Chưa quét mã nào" ? "pointer" : "not-allowed",
              opacity: data !== "Chưa quét mã nào" ? 1 : 0.4,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              fontWeight: 600,
              transition: "all 0.2s",
            }}
          >
            {copied ? (
              <>
                <IoCheckmarkDoneOutline size={15} color="#34d399" />
                <span style={{ color: "#34d399" }}>Đã chép</span>
              </>
            ) : (
              <>
                <IoCopyOutline size={15} />
                <span>Sao chép</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CAMERASCANNER;
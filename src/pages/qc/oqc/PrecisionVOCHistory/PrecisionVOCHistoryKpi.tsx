import React from "react";
import QrCode2Icon from "@mui/icons-material/QrCode2";

interface Props {
  lastScannedLot: string;
  matchedCode: string;
  lastScanTime: string;
  useMachineScan: boolean;
}

export const PrecisionVOCHistoryKpi: React.FC<Props> = ({
  lastScannedLot,
  matchedCode,
  lastScanTime,
  useMachineScan,
}) => {
  return (
    <div className="pvoc-kpi">
      {/* Live Scanner Telemetry Strip */}
      <div className="pvoc-telemetry-strip">
        <div className="pvoc-telemetry-strip__left">
          <div className="pvoc-telemetry-strip__item">
            <QrCode2Icon style={{ fontSize: 16, color: "#06b6d4" }} />
            <span className="pvoc-telemetry-strip__label">LẦN QUÉT GẦN NHẤT:</span>
          </div>
          <div className="pvoc-telemetry-strip__item">
            <span className="pvoc-telemetry-strip__label">PROCESS LOT:</span>
            <span className="pvoc-telemetry-strip__lot">{lastScannedLot || "CHƯA QUÉT"}</span>
          </div>
          <div className="pvoc-telemetry-strip__item">
            <span className="pvoc-telemetry-strip__label">MÃ QUY ĐỔI (G_CODE):</span>
            <span className="pvoc-telemetry-strip__code">{matchedCode || "N/A"}</span>
          </div>
          {lastScanTime && (
            <div className="pvoc-telemetry-strip__item">
              <span className="pvoc-telemetry-strip__label">THỜI GIAN:</span>
              <span className="font-mono text-xs">{lastScanTime}</span>
            </div>
          )}
        </div>

        <div className="pvoc-telemetry-strip__right">
          <span className="text-xs text-slate-400">
            {useMachineScan
              ? "⚡ Tự động phân giải Process Lot sang G_NAME_KD & lọc thư viện ảnh sự cố"
              : "⌨️ Chế độ gõ phím thông thường (Enter để lọc)"}
          </span>
        </div>
      </div>
    </div>
  );
};

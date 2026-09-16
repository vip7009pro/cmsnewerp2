import React, { useState, useEffect } from "react";
import moment from "moment";
import { IconButton, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";

interface Props {
  isTvMode: boolean;
  setIsTvMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  isLoading: boolean;
  onReload: () => void;
  useMachineScan: boolean;
}

export const PrecisionVOCHistoryHeader: React.FC<Props> = ({
  isTvMode,
  setIsTvMode,
  isLoading,
  onReload,
  useMachineScan,
}) => {
  const [currentTime, setCurrentTime] = useState(moment().format("HH:mm:ss"));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(moment().format("HH:mm:ss"));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="pvoc-header">
      <div className="pvoc-header__left">
        <span className="pvoc-header__badge-erp">CMS ERP</span>
        <span className="pvoc-header__badge-module">VOC INTELLIGENCE</span>
        <h1 className="pvoc-header__breadcrumb-title">
          04. QC • OQC / LỊCH SỬ KHIẾU NẠI KHÁCH HÀNG (VOC GALLERY)
        </h1>
      </div>

      <div className="pvoc-header__right">
        {/* Live Clock for TV / Production Floor */}
        <div className="pvoc-header__clock" title="Thời gian hệ thống">
          <span>🕒</span>
          <span>{currentTime}</span>
        </div>

        {/* Scanner Readiness Status */}
        <div
          className={`pvoc-header__status-pill ${
            useMachineScan ? "pvoc-header__status-pill--scanning" : ""
          }`}
        >
          <span
            className={`pvoc-header__pulse-dot ${
              useMachineScan ? "pvoc-header__pulse-dot--scanning" : ""
            }`}
          />
          <QrCodeScannerIcon style={{ fontSize: 13 }} />
          <span>{useMachineScan ? "SCANNER READY" : "MANUAL MODE"}</span>
        </div>

        {/* Reload button */}
        <Tooltip title="Tải lại dữ liệu">
          <button
            type="button"
            className="pvoc-header__btn-action"
            onClick={onReload}
            disabled={isLoading}
          >
            <RefreshIcon style={{ fontSize: 14 }} className={isLoading ? "animate-spin" : ""} />
            <span>{isLoading ? "Đang tải..." : "Reload"}</span>
          </button>
        </Tooltip>

        {/* Fullscreen TV Mode toggle */}
        <Tooltip title={isTvMode ? "Thoát toàn màn hình" : "Chế độ TV Command Center"}>
          <button
            type="button"
            className="pvoc-header__btn-action"
            onClick={() => setIsTvMode((prev) => !prev)}
          >
            {isTvMode ? (
              <>
                <FullscreenExitIcon style={{ fontSize: 15 }} />
                <span>Thu nhỏ</span>
              </>
            ) : (
              <>
                <FullscreenIcon style={{ fontSize: 15 }} />
                <span>TV Mode</span>
              </>
            )}
          </button>
        </Tooltip>
      </div>
    </header>
  );
};

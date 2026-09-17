import React from "react";
import { Button, Chip } from "@mui/material";
import { MdTimeline, MdViewAgenda, MdTableChart, MdRefresh, MdFileDownload } from "react-icons/md";
import { FaSyncAlt } from "react-icons/fa";

interface PrecisionPlanStatusHeaderProps {
  totalCount: number;
  viewMode: "cards" | "table";
  onViewModeChange: (mode: "cards" | "table") => void;
  autoRefreshInterval: number; // 0 = off, 30 = 30s, 60 = 60s
  onToggleAutoRefresh: () => void;
  onRefresh: () => void;
  onExportExcel: () => void;
  loading: boolean;
}

export const PrecisionPlanStatusHeader: React.FC<PrecisionPlanStatusHeaderProps> = React.memo(({
  totalCount,
  viewMode,
  onViewModeChange,
  autoRefreshInterval,
  onToggleAutoRefresh,
  onRefresh,
  onExportExcel,
  loading,
}) => {
  const getAutoRefreshLabel = () => {
    if (autoRefreshInterval === 0) return "Tự làm mới: Tắt";
    return `Tự làm mới: ${autoRefreshInterval}s`;
  };

  return (
    <header className="precision-plan-status-header">
      <div className="header-left">
        <div className="header-icon-wrapper">
          <MdTimeline />
        </div>
        <div className="header-title-group">
          <h1 className="header-title">TRẠNG THÁI TIẾN ĐỘ CHỈ THỊ SẢN XUẤT</h1>
          <span className="header-subtitle">
            Giám sát thời gian thực quy trình Xuất Dao, Setting, Xuất Liệu, In Tem &amp; Chốt Báo Cáo
          </span>
        </div>
        <div className="header-chips">
          <Chip
            size="small"
            label={`${totalCount.toLocaleString("en-US")} chỉ thị`}
            variant="outlined"
            className="count-chip"
          />
          <Chip
            size="small"
            icon={<FaSyncAlt style={{ fontSize: 10 }} />}
            label={getAutoRefreshLabel()}
            variant="outlined"
            onClick={onToggleAutoRefresh}
            className={`refresh-chip ${autoRefreshInterval > 0 ? "active" : ""}`}
          />
        </div>
      </div>

      <div className="header-actions">
        {/* Switcher chế độ xem */}
        <div className="view-switcher">
          <button
            className={`switch-btn ${viewMode === "cards" ? "active" : ""}`}
            onClick={() => onViewModeChange("cards")}
          >
            <MdViewAgenda />
            <span>Luồng Thẻ</span>
          </button>
          <button
            className={`switch-btn ${viewMode === "table" ? "active" : ""}`}
            onClick={() => onViewModeChange("table")}
          >
            <MdTableChart />
            <span>Bảng Grid</span>
          </button>
        </div>

        <Button
          size="small"
          variant="outlined"
          color="inherit"
          startIcon={<MdRefresh />}
          disabled={loading}
          onClick={onRefresh}
          className="action-btn"
        >
          Làm mới
        </Button>

        <Button
          size="small"
          variant="outlined"
          color="success"
          startIcon={<MdFileDownload />}
          disabled={totalCount === 0}
          onClick={onExportExcel}
          className="action-btn"
        >
          Xuất Excel
        </Button>
      </div>
    </header>
  );
});

import React from "react";
import { Button, Chip } from "@mui/material";
import { MdOutlinePivotTableChart, MdInsights, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { FaIndustry } from "react-icons/fa";

interface PrecisionDataSxHeaderProps {
  selectbutton: boolean;
  rowCount: number;
  showhidePivotTable: boolean;
  onTogglePivot: () => void;
  showhideDailyYCSX: boolean;
  onToggleDetailYCSX: () => void;
}

export const PrecisionDataSxHeader: React.FC<PrecisionDataSxHeaderProps> = React.memo(({
  selectbutton,
  rowCount,
  onTogglePivot,
  showhideDailyYCSX,
  onToggleDetailYCSX,
}) => {
  return (
    <header className="precision-datasx-header">
      <div className="header-left">
        <div className="header-icon-wrapper">
          <FaIndustry className="header-icon" />
        </div>
        <div className="header-title-group">
          <h1 className="header-title">DỮ LIỆU SẢN XUẤT</h1>
          <span className="header-subtitle">Quản lý Chỉ thị, YCSX &amp; Báo cáo phân tích hao hụt công đoạn</span>
        </div>
        <div className="header-chips">
          <Chip
            size="small"
            label={selectbutton ? "CHẾ ĐỘ CHỈ THỊ" : "CHẾ ĐỘ YCSX"}
            color={selectbutton ? "primary" : "secondary"}
            variant="filled"
            className="mode-chip"
          />
          <Chip
            size="small"
            label={`${rowCount.toLocaleString("en-US")} dòng dữ liệu`}
            variant="outlined"
            className="count-chip"
          />
        </div>
      </div>

      <div className="header-actions">
        {!selectbutton && (
          <Button
            size="small"
            variant={showhideDailyYCSX ? "contained" : "outlined"}
            color="info"
            startIcon={showhideDailyYCSX ? <MdVisibilityOff /> : <MdVisibility />}
            onClick={onToggleDetailYCSX}
            className="action-btn"
          >
            {showhideDailyYCSX ? "ẨN CHI TIẾT" : "HIỆN CHI TIẾT"}
          </Button>
        )}
        <Button
          size="small"
          variant="outlined"
          color="primary"
          startIcon={<MdOutlinePivotTableChart />}
          onClick={onTogglePivot}
          className="action-btn pivot-btn"
        >
          PIVOT TABLE
        </Button>
      </div>
    </header>
  );
});

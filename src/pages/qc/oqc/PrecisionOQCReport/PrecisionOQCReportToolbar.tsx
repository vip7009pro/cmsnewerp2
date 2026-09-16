import React from "react";
import { Checkbox, FormControlLabel, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import BarChartIcon from "@mui/icons-material/BarChart";
import PieChartIcon from "@mui/icons-material/PieChart";
import ViewQuiltIcon from "@mui/icons-material/ViewQuilt";

interface Props {
  fromDate: string;
  toDate: string;
  onFromDateChange: (val: string) => void;
  onToDateChange: (val: string) => void;
  custName: string;
  onCustNameChange: (val: string) => void;
  df: boolean;
  onDfChange: (val: boolean) => void;
  onSearch: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isCMS: boolean;
  loading: boolean;
}

export const PrecisionOQCReportToolbar: React.FC<Props> = ({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  custName,
  onCustNameChange,
  df,
  onDfChange,
  onSearch,
  activeTab,
  onTabChange,
  isCMS,
  loading,
}) => {
  return (
    <div className="poqc-toolbar">
      {/* Row 1: Parameter Filters */}
      <div className="poqc-toolbar__row-filters">
        <div className="poqc-toolbar__filters-left">
          {/* From Date */}
          <div className="poqc-toolbar__field-group">
            <label htmlFor="poqc-from-date">Từ ngày:</label>
            <input
              id="poqc-from-date"
              type="date"
              value={fromDate.slice(0, 10)}
              onChange={(e) => onFromDateChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
            />
          </div>

          {/* To Date */}
          <div className="poqc-toolbar__field-group">
            <label htmlFor="poqc-to-date">Tới ngày:</label>
            <input
              id="poqc-to-date"
              type="date"
              value={toDate.slice(0, 10)}
              onChange={(e) => onToDateChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
            />
          </div>

          {/* Customer */}
          <div className="poqc-toolbar__field-group">
            <label htmlFor="poqc-cust-name">Khách hàng:</label>
            <input
              id="poqc-cust-name"
              type="text"
              placeholder="Nhập tên khách..."
              value={custName}
              onChange={(e) => onCustNameChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
            />
          </div>

          {/* Default Period Checkbox */}
          <FormControlLabel
            style={{ margin: 0 }}
            control={
              <Checkbox
                size="small"
                checked={df}
                onChange={(e) => onDfChange(e.target.checked)}
                style={{ padding: 4, color: "#2563eb" }}
              />
            }
            label={
              <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#334155" }}>
                Mặc định (Default)
              </span>
            }
          />
        </div>

        {/* Search Action */}
        <Button
          variant="contained"
          size="small"
          onClick={onSearch}
          disabled={loading}
          startIcon={<SearchIcon />}
          style={{
            backgroundColor: "#2563eb",
            color: "#ffffff",
            fontWeight: 700,
            fontSize: "0.76rem",
            textTransform: "none",
            minWidth: 90,
          }}
        >
          {loading ? "Đang tra..." : "Tra Cứu"}
        </Button>
      </div>

      {/* Row 2: Segment Switcher Tabs */}
      <div className="poqc-toolbar__row-segments">
        <nav className="poqc-toolbar__segments-nav">
          <button
            type="button"
            className={`poqc-toolbar__tab-btn ${
              activeTab === "all" ? "poqc-toolbar__tab-btn--active" : ""
            }`}
            onClick={() => onTabChange("all")}
          >
            <ViewQuiltIcon style={{ fontSize: 15 }} />
            <span>⊞ Xem Toàn Diện</span>
          </button>

          <button
            type="button"
            className={`poqc-toolbar__tab-btn ${
              activeTab === "ngrate" ? "poqc-toolbar__tab-btn--active" : ""
            }`}
            onClick={() => onTabChange("ngrate")}
          >
            <ShowChartIcon style={{ fontSize: 15 }} />
            <span>📉 Tỷ Lệ Lỗi OQC (OQC NG Rate)</span>
          </button>

          {isCMS && (
            <button
              type="button"
              className={`poqc-toolbar__tab-btn ${
                activeTab === "ppm" ? "poqc-toolbar__tab-btn--active" : ""
              }`}
              onClick={() => onTabChange("ppm")}
            >
              <BarChartIcon style={{ fontSize: 15 }} />
              <span>📊 Inspection PPM (CMS)</span>
            </button>
          )}

          <button
            type="button"
            className={`poqc-toolbar__tab-btn ${
              activeTab === "breakdown" ? "poqc-toolbar__tab-btn--active" : ""
            }`}
            onClick={() => onTabChange("breakdown")}
          >
            <PieChartIcon style={{ fontSize: 15 }} />
            <span>👥 Khách Hàng & Loại SP</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

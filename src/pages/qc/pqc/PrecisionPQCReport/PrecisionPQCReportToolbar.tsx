import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import GridViewIcon from "@mui/icons-material/GridView";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { Autocomplete, Checkbox, TextField, Typography, createFilterOptions } from "@mui/material";
import { CodeListData } from "../../../kinhdoanh/interfaces/kdInterface";

const filterOptions1 = createFilterOptions({
  matchFrom: "any",
  limit: 100,
});

interface PrecisionPQCReportToolbarProps {
  fromDate: string;
  toDate: string;
  onFromDateChange: (val: string) => void;
  onToDateChange: (val: string) => void;
  worstBy: string;
  onWorstByChange: (val: string) => void;
  ngType: string;
  onNgTypeChange: (val: string) => void;
  custName: string;
  onCustNameChange: (val: string) => void;
  codeList: CodeListData[];
  selectedCode: CodeListData | null;
  onSelectCode: (code: CodeListData | null) => void;
  searchCodeArray: string[];
  onRemoveCode: (code: string) => void;
  onClearCodeArray: () => void;
  df: boolean;
  onDfChange: (val: boolean) => void;
  onSearch: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  loading: boolean;
}

export const PrecisionPQCReportToolbar: React.FC<PrecisionPQCReportToolbarProps> = ({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  worstBy,
  onWorstByChange,
  ngType,
  onNgTypeChange,
  custName,
  onCustNameChange,
  codeList,
  selectedCode,
  onSelectCode,
  searchCodeArray,
  onRemoveCode,
  onClearCodeArray,
  df,
  onDfChange,
  onSearch,
  activeTab,
  onTabChange,
  loading,
}) => {
  const tabs = [
    { id: "all", label: "Xem Toàn Diện", icon: <GridViewIcon style={{ fontSize: "0.95rem" }} /> },
    { id: "ppm", label: "Xu Hướng Tỷ Lệ Lỗi PPM", icon: <ShowChartIcon style={{ fontSize: "0.95rem" }} /> },
    { id: "defects", label: "Xu Hướng Khuyết Tật & Sự Cố", icon: <WarningAmberIcon style={{ fontSize: "0.95rem" }} /> },
    { id: "fcost", label: "Chi Phí Tổn Thất F-Cost", icon: <MonetizationOnIcon style={{ fontSize: "0.95rem" }} /> },
  ];

  return (
    <div className="precision-pqc-toolbar">
      {/* Hàng 1: Bộ Lọc Controls */}
      <div className="toolbar-row-filters">
        <div className="filter-item">
          <label>Từ ngày:</label>
          <input type="date" value={fromDate.slice(0, 10)} onChange={(e) => onFromDateChange(e.target.value)} />
        </div>

        <div className="filter-item">
          <label>Tới ngày:</label>
          <input type="date" value={toDate.slice(0, 10)} onChange={(e) => onToDateChange(e.target.value)} />
        </div>

        <div className="filter-item">
          <label>Worst by:</label>
          <select value={worstBy} onChange={(e) => onWorstByChange(e.target.value)}>
            <option value="AMOUNT">AMOUNT</option>
            <option value="QTY">QTY</option>
          </select>
        </div>

        <div className="filter-item">
          <label>NG Type:</label>
          <select value={ngType} onChange={(e) => onNgTypeChange(e.target.value)}>
            <option value="ALL">ALL</option>
            <option value="P">PROCESS</option>
            <option value="M">MATERIAL</option>
          </select>
        </div>

        <div className="filter-item" style={{ minWidth: 200 }}>
          <Autocomplete
            size="small"
            options={codeList}
            filterOptions={filterOptions1}
            getOptionLabel={(option: any) => `${option.G_CODE}: ${option.G_NAME_KD || option.G_NAME}`}
            renderInput={(params) => <TextField {...params} placeholder="Chọn mã sản phẩm..." size="small" />}
            renderOption={(props, option: any) => (
              <Typography style={{ fontSize: "0.7rem" }} {...props}>
                {`${option.G_CODE}: ${option.G_NAME_KD || ""}:${option.G_NAME}`}
              </Typography>
            )}
            value={selectedCode}
            onChange={(_, val) => onSelectCode(val)}
            isOptionEqualToValue={(option: any, value: any) => option.G_CODE === value.G_CODE}
            sx={{ "& .MuiInputBase-root": { fontSize: "0.72rem", height: "28px", width: "190px" } }}
          />
        </div>

        {searchCodeArray.length > 0 && (
          <div className="code-chips-container">
            {searchCodeArray.map((code) => (
              <span key={code} className="code-chip">
                <span>{code}</span>
                <ClearIcon style={{ fontSize: "0.7rem" }} className="chip-remove" onClick={() => onRemoveCode(code)} />
              </span>
            ))}
            <button
              onClick={onClearCodeArray}
              style={{ fontSize: "0.65rem", background: "none", border: "none", color: "#64748b", cursor: "pointer", textDecoration: "underline" }}
            >
              Xóa hết
            </button>
          </div>
        )}

        <div className="filter-item">
          <label>Khách hàng:</label>
          <input
            type="text"
            placeholder="Tên khách hàng..."
            value={custName}
            onChange={(e) => onCustNameChange(e.target.value)}
            style={{ width: 110 }}
          />
        </div>

        <div className="filter-item">
          <label>Mặc định:</label>
          <Checkbox
            size="small"
            checked={df}
            onChange={(e) => onDfChange(e.target.checked)}
            sx={{ padding: "2px" }}
          />
        </div>

        <button className="btn-search" onClick={onSearch} disabled={loading}>
          <SearchIcon style={{ fontSize: "0.95rem" }} />
          <span>Tra Cứu</span>
        </button>
      </div>

      {/* Hàng 2: Segment Navigation Tabs */}
      <div className="toolbar-row-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-tab-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default React.memo(PrecisionPQCReportToolbar);

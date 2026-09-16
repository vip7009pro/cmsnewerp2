import React from "react";
import { Autocomplete, Checkbox, TextField, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { CodeListData } from "../../../../pages/kinhdoanh/interfaces/kdInterface";
import { filterOptions1 } from "./useInspectReportData";

interface Props {
  fromDate: string;
  toDate: string;
  onFromDateChange: (v: string) => void;
  onToDateChange: (v: string) => void;
  worstBy: string;
  onWorstByChange: (v: string) => void;
  ngType: string;
  onNgTypeChange: (v: string) => void;
  codeList: CodeListData[];
  searchCodeArray: string[];
  onSelectCode: (v: CodeListData | null) => void;
  onRemoveCode: (code: string) => void;
  onClearCodes: () => void;
  custName: string;
  onCustNameChange: (v: string) => void;
  df: boolean;
  onDfChange: (v: boolean) => void;
  onSearch: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  loading: boolean;
}

const TABS = [
  { key: "all", label: "⊞ Xem Toàn Diện" },
  { key: "fcost", label: "💰 Chi Phí F-Cost" },
  { key: "nguoihang", label: "👷 Tỉ Lệ Người Hàng" },
  { key: "defects", label: "⚠️ Xu Hướng Khuyết Tật" },
  { key: "worst", label: "🏆 Worst Products" },
];

export const PrecisionInspectReportToolbar: React.FC<Props> = ({
  fromDate, toDate, onFromDateChange, onToDateChange,
  worstBy, onWorstByChange, ngType, onNgTypeChange,
  codeList, searchCodeArray, onSelectCode, onRemoveCode, onClearCodes,
  custName, onCustNameChange, df, onDfChange, onSearch,
  activeTab, onTabChange, loading,
}) => {
  return (
    <div className="pir-toolbar">
      {/* Row 1: Filters */}
      <div className="pir-toolbar__row-filters">
        <div className="pir-toolbar__filters-left">
          <div className="pir-toolbar__field-group">
            <label>Từ ngày:</label>
            <input type="date" value={fromDate.slice(0, 10)} onChange={(e) => onFromDateChange(e.target.value)} />
          </div>
          <div className="pir-toolbar__field-group">
            <label>Đến ngày:</label>
            <input type="date" value={toDate.slice(0, 10)} onChange={(e) => onToDateChange(e.target.value)} />
          </div>
          <div className="pir-toolbar__field-group">
            <label>Worst by:</label>
            <select value={worstBy} onChange={(e) => onWorstByChange(e.target.value)}>
              <option value="QTY">QTY</option>
              <option value="AMOUNT">AMOUNT</option>
            </select>
          </div>
          <div className="pir-toolbar__field-group">
            <label>NG Type:</label>
            <select value={ngType} onChange={(e) => onNgTypeChange(e.target.value)}>
              <option value="ALL">ALL</option>
              <option value="P">PROCESS</option>
              <option value="M">MATERIAL</option>
            </select>
          </div>
          <div className="pir-toolbar__autocomplete">
            <Autocomplete
              size="small"
              disablePortal
              options={codeList}
              filterOptions={filterOptions1}
              getOptionLabel={(option: CodeListData | any) =>
                `${option.G_CODE}: ${option.G_NAME_KD}:${option.G_NAME}`
              }
              renderInput={(params) => <TextField {...params} label="Code hàng" />}
              renderOption={(props, option: any) => (
                <Typography style={{ fontSize: "0.7rem" }} {...props}>
                  {`${option.G_CODE}: ${option.G_NAME_KD}:${option.G_NAME}`}
                </Typography>
              )}
              onChange={(_event: any, newValue: CodeListData | any) => onSelectCode(newValue)}
              isOptionEqualToValue={(option: any, value: any) => option.G_CODE === value.G_CODE}
            />
          </div>
          {searchCodeArray.length > 0 && (
            <div className="pir-toolbar__chip-tags">
              {searchCodeArray.map((code) => (
                <span key={code} className="pir-toolbar__chip" onClick={() => onRemoveCode(code)} title="Click để xóa">
                  {code} ✕
                </span>
              ))}
              <span className="pir-toolbar__chip" onClick={onClearCodes} title="Xóa tất cả" style={{ background: "#fff1f2", color: "#e11d48", borderColor: "rgba(225,29,72,0.2)" }}>
                Xóa hết
              </span>
            </div>
          )}
          <div className="pir-toolbar__field-group">
            <label>Customer:</label>
            <input type="text" value={custName} onChange={(e) => onCustNameChange(e.target.value)} />
          </div>
          <div className="pir-toolbar__field-group">
            <label>Default:</label>
            <Checkbox
              checked={df}
              onChange={(e) => {
                onDfChange(e.target.checked);
                if (!df) onClearCodes();
              }}
              size="small"
              sx={{ padding: "2px" }}
            />
          </div>
          <button
            type="button"
            className="pir-toolbar__btn-search"
            onClick={onSearch}
            disabled={loading}
          >
            <SearchIcon style={{ fontSize: 14 }} />
            <span>{loading ? "Đang tải..." : "Tra Cứu"}</span>
          </button>
        </div>
      </div>

      {/* Row 2: Segment Switcher */}
      <div className="pir-toolbar__segments">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`pir-toolbar__seg-btn ${activeTab === tab.key ? "pir-toolbar__seg-btn--active" : ""}`}
            onClick={() => onTabChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

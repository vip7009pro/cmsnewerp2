import React from "react";
import { Autocomplete, Checkbox, TextField, Typography, createFilterOptions } from "@mui/material";
import { FiSearch, FiLayers, FiCalendar, FiUser, FiTag, FiTrendingUp, FiPieChart, FiDollarSign, FiAlertOctagon } from "react-icons/fi";
import { CodeListData } from "../../../kinhdoanh/interfaces/kdInterface";

interface Props {
  fromDate: string;
  toDate: string;
  onFromDateChange: (v: string) => void;
  onToDateChange: (v: string) => void;
  worstby: string;
  onWorstByChange: (v: string) => void;
  ng_type: string;
  onNgTypeChange: (v: string) => void;
  codeList: CodeListData[];
  searchCodeArray: string[];
  onAddCode: (code: string) => void;
  onClearCodeArray: () => void;
  custName: string;
  onCustNameChange: (v: string) => void;
  df: boolean;
  onDfChange: (v: boolean) => void;
  onSearch: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  loading?: boolean;
}

const filterOptions = createFilterOptions({
  matchFrom: "any",
  limit: 100,
});

export const PrecisionCSReportToolbar: React.FC<Props> = ({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  worstby,
  onWorstByChange,
  ng_type,
  onNgTypeChange,
  codeList,
  searchCodeArray,
  onAddCode,
  onClearCodeArray,
  custName,
  onCustNameChange,
  df,
  onDfChange,
  onSearch,
  activeTab,
  onTabChange,
  loading = false,
}) => {
  return (
    <div className="pcs-toolbar">
      {/* Hàng 1: Filters */}
      <div className="pcs-toolbar__row-filters">
        <div className="pcs-toolbar__filters-left">
          {/* Từ ngày */}
          <div className="pcs-toolbar__field-group">
            <label>Từ ngày:</label>
            <input
              type="date"
              value={fromDate.slice(0, 10)}
              onChange={(e) => onFromDateChange(e.target.value)}
            />
          </div>

          {/* Đến ngày */}
          <div className="pcs-toolbar__field-group">
            <label>Đến ngày:</label>
            <input
              type="date"
              value={toDate.slice(0, 10)}
              onChange={(e) => onToDateChange(e.target.value)}
            />
          </div>

          {/* Worst by */}
          <div className="pcs-toolbar__field-group">
            <label>Worst by:</label>
            <select
              value={worstby}
              onChange={(e) => onWorstByChange(e.target.value)}
            >
              <option value="AMOUNT">AMOUNT ($)</option>
              <option value="QTY">QTY (EA)</option>
            </select>
          </div>

          {/* NG Type */}
          <div className="pcs-toolbar__field-group">
            <label>NG Type:</label>
            <select
              value={ng_type}
              onChange={(e) => onNgTypeChange(e.target.value)}
            >
              <option value="ALL">ALL (Tất cả)</option>
              <option value="P">PROCESS (Công đoạn)</option>
              <option value="M">MATERIAL (Vật liệu)</option>
            </select>
          </div>

          {/* Autocomplete chọn mã hàng */}
          <div className="pcs-toolbar__field-group">
            <label>Mã SP:</label>
            <Autocomplete
              disableCloseOnSelect
              size="small"
              className="pcs-toolbar__autocomplete"
              options={codeList}
              filterOptions={filterOptions}
              getOptionLabel={(option: CodeListData | any) =>
                `${option.G_CODE}: ${option.G_NAME_KD || ""}`
              }
              renderInput={(params) => (
                <TextField {...params} placeholder="Chọn mã hàng..." />
              )}
              renderOption={(props, option: any) => (
                <Typography style={{ fontSize: "0.72rem" }} {...props}>
                  {`${option.G_CODE}: ${option.G_NAME_KD || option.G_NAME}`}
                </Typography>
              )}
              onChange={(_, newValue: CodeListData | any) => {
                if (newValue?.G_CODE) {
                  onAddCode(newValue.G_CODE);
                }
              }}
              isOptionEqualToValue={(option: any, value: any) =>
                option.G_CODE === value.G_CODE
              }
            />
          </div>

          {/* Chip hiển thị số mã hàng đã chọn */}
          {searchCodeArray.length > 0 && (
            <div
              className="pcs-toolbar__code-badge-strip"
              onClick={onClearCodeArray}
              title="Nhấn để xóa toàn bộ mã hàng đã chọn"
            >
              <FiTag size={10} />
              <span>{searchCodeArray.length} mã hàng</span>
              <span>×</span>
            </div>
          )}

          {/* Customer */}
          <div className="pcs-toolbar__field-group">
            <label>Khách hàng:</label>
            <input
              type="text"
              placeholder="Nhập tên KH..."
              value={custName}
              onChange={(e) => onCustNameChange(e.target.value)}
            />
          </div>

          {/* Default Checkbox */}
          <div className="pcs-toolbar__field-group">
            <label style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}>
              <Checkbox
                size="small"
                checked={df}
                onChange={(e) => onDfChange(e.target.checked)}
                sx={{ padding: "2px" }}
              />
              <span>Default</span>
            </label>
          </div>
        </div>

        {/* Nút Tìm kiếm */}
        <button
          type="button"
          className="pcs-toolbar__btn-search"
          onClick={onSearch}
          disabled={loading}
        >
          <FiSearch size={12} />
          <span>{loading ? "Đang Tra..." : "Tra Cứu"}</span>
        </button>
      </div>

      {/* Hàng 2: Segment Switcher 5 Tabs */}
      <div className="pcs-toolbar__row-segments">
        <div className="pcs-toolbar__segments-nav">
          <button
            type="button"
            className={`pcs-toolbar__tab-btn ${activeTab === "all" ? "pcs-toolbar__tab-btn--active" : ""}`}
            onClick={() => onTabChange("all")}
          >
            <FiLayers size={11} />
            <span>⊞ Xem Toàn Diện</span>
          </button>

          <button
            type="button"
            className={`pcs-toolbar__tab-btn ${activeTab === "feedback" ? "pcs-toolbar__tab-btn--active" : ""}`}
            onClick={() => onTabChange("feedback")}
          >
            <FiTrendingUp size={11} />
            <span>⚠️ Phản Hồi Sự Cố</span>
          </button>

          <button
            type="button"
            className={`pcs-toolbar__tab-btn ${activeTab === "breakdown" ? "pcs-toolbar__tab-btn--active" : ""}`}
            onClick={() => onTabChange("breakdown")}
          >
            <FiPieChart size={11} />
            <span>👥 Khách Hàng & PIC</span>
          </button>

          <button
            type="button"
            className={`pcs-toolbar__tab-btn ${activeTab === "saving" ? "pcs-toolbar__tab-btn--active" : ""}`}
            onClick={() => onTabChange("saving")}
          >
            <FiDollarSign size={11} />
            <span>💰 Tiết Kiệm Chi Phí</span>
          </button>

          <button
            type="button"
            className={`pcs-toolbar__tab-btn ${activeTab === "fcost" ? "pcs-toolbar__tab-btn--active" : ""}`}
            onClick={() => onTabChange("fcost")}
          >
            <FiAlertOctagon size={11} />
            <span>📉 Chi Phí F-Cost</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionCSReportToolbar);

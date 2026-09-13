// PrecisionKHOLIEUFilterPanel.tsx - Sidebar bộ lọc bên trái cho Kho Liệu

import React from "react";
import { FiFilter, FiRotateCcw, FiZap } from "react-icons/fi";

interface PrecisionKHOLIEUFilterPanelProps {
  fromdate: string;
  setFromDate: (val: string) => void;
  todate: string;
  setToDate: (val: string) => void;
  m_name: string;
  setM_Name: (val: string) => void;
  m_code: string;
  setM_Code: (val: string) => void;
  codeKD: string;
  setCodeKD: (val: string) => void;
  prod_request_no: string;
  setProd_Request_No: (val: string) => void;
  plan_id: string;
  setPlanID: (val: string) => void;
  rollNo: string;
  setRollNo: (val: string) => void;
  lotncc: string;
  setLOTNCC: (val: string) => void;
  alltime: boolean;
  setAllTime: (val: boolean) => void;
  justbalancecode: boolean;
  setJustBalanceCode: (val: boolean) => void;
  in_nhanh: boolean;
  setInNhanh: (val: boolean) => void;
  isPVN: boolean;
  mode: "NHAP" | "XUAT" | "TON";
  onModeChange: (newMode: "NHAP" | "XUAT" | "TON") => void;
  onLoadData: () => void;
  onUpdateLotNCC: () => void;
  onResetFilters: () => void;
}

const PrecisionKHOLIEUFilterPanel: React.FC<PrecisionKHOLIEUFilterPanelProps> = ({
  fromdate,
  setFromDate,
  todate,
  setToDate,
  m_name,
  setM_Name,
  m_code,
  setM_Code,
  codeKD,
  setCodeKD,
  prod_request_no,
  setProd_Request_No,
  plan_id,
  setPlanID,
  rollNo,
  setRollNo,
  lotncc,
  setLOTNCC,
  alltime,
  setAllTime,
  justbalancecode,
  setJustBalanceCode,
  in_nhanh,
  setInNhanh,
  isPVN,
  mode,
  onModeChange,
  onLoadData,
  onUpdateLotNCC,
  onResetFilters,
}) => {
  return (
    <aside className="precision-kholieu__sidebar" data-purpose="filter-sidebar">
      <div className="precision-kholieu__sidebarScroll">
        {/* Header */}
        <div className="precision-kholieu__sidebarHeader">
          <div className="header-title">
            <FiFilter />
            <span>BỘ LỌC KHO LIỆU</span>
          </div>
          <button
            type="button"
            className="reset-btn"
            onClick={onResetFilters}
            title="Đặt lại bộ lọc mặc định"
          >
            <FiRotateCcw />
            <span>Reset</span>
          </button>
        </div>

        {/* Input Fields */}
        <div className="precision-kholieu__formGroup">
          <label>Từ ngày:</label>
          <input
            type="date"
            value={fromdate.slice(0, 10)}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div className="precision-kholieu__formGroup">
          <label>Tới ngày:</label>
          <input
            type="date"
            value={todate.slice(0, 10)}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <div className="precision-kholieu__formGroup">
          <label>Tên Liệu (M_NAME):</label>
          <input
            type="text"
            placeholder="Nhập tên nguyên vật liệu..."
            value={m_name}
            onChange={(e) => setM_Name(e.target.value)}
          />
        </div>

        <div className="precision-kholieu__formGroup">
          <label>Mã Liệu CMS (M_CODE):</label>
          <input
            type="text"
            placeholder="A123456 / Mã CMS..."
            value={m_code}
            onChange={(e) => setM_Code(e.target.value)}
          />
        </div>

        <div className="precision-kholieu__formGroup">
          <label>Code KD (G_CODE / Model):</label>
          <input
            type="text"
            placeholder="GH63-xxxxxx..."
            value={codeKD}
            onChange={(e) => setCodeKD(e.target.value)}
            style={{ color: "#2563eb", fontWeight: 600 }}
          />
        </div>

        {/* Lưới 2 cột YCSX và PLAN_ID */}
        <div className="precision-kholieu__formGroup--grid2">
          <div className="precision-kholieu__formGroup">
            <label>SỐ YCSX:</label>
            <input
              type="text"
              placeholder="1F80008..."
              value={prod_request_no}
              onChange={(e) => setProd_Request_No(e.target.value)}
            />
          </div>
          <div className="precision-kholieu__formGroup">
            <label>PLAN_ID:</label>
            <input
              type="text"
              placeholder="1F80008A..."
              value={plan_id}
              onChange={(e) => setPlanID(e.target.value)}
            />
          </div>
        </div>

        <div className="precision-kholieu__formGroup">
          <label>STT Cuộn:</label>
          <input
            type="text"
            placeholder="VD: 1-120 hoặc cuộn đơn..."
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
          />
        </div>

        {/* LOT NCC kèm nút UPD LOT NCC */}
        <div className="precision-kholieu__formGroup precision-kholieu__formGroup--lotNcc">
          <label>LOT NCC (Vendor Lot):</label>
          <div className="lot-input-wrapper">
            <input
              type="text"
              placeholder="Nhập Lot NCC..."
              value={lotncc}
              onChange={(e) => setLOTNCC(e.target.value)}
            />
            <button
              type="button"
              className="btn-upd-lot"
              onClick={onUpdateLotNCC}
              title="Cập nhật LOT NCC cho các dòng đã chọn"
            >
              UPD LOT NCC
            </button>
          </div>
        </div>

        {/* Checkbox Group */}
        <div className="precision-kholieu__checkboxGroup">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={alltime}
              onChange={(e) => setAllTime(e.target.checked)}
            />
            <span>All Time (Toàn thời gian)</span>
          </label>

          <label className="checkbox-label checkbox-label--highlight">
            <input
              type="checkbox"
              checked={justbalancecode}
              onChange={(e) => setJustBalanceCode(e.target.checked)}
            />
            <span>Chỉ code có tồn kho (&gt; 0)</span>
          </label>

          {isPVN && (
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={in_nhanh}
                onChange={(e) => setInNhanh(e.target.checked)}
              />
              <span>In nhanh</span>
            </label>
          )}
        </div>

        {/* Nút Load Hero Button */}
        <button
          type="button"
          className="precision-kholieu__btnLoad"
          onClick={onLoadData}
        >
          <FiZap />
          <span>TRA CỨU DỮ LIỆU (LOAD)</span>
        </button>
      </div>

      {/* Dải nút chuyển nhanh chế độ ở đáy sidebar */}
      <div className="precision-kholieu__quickJump">
        <div className="jump-title">Chuyển nhanh chế độ:</div>
        <div className="jump-grid">
          <button
            type="button"
            className={`jump-btn jump-btn--nhap ${mode === "NHAP" ? "active" : ""}`}
            onClick={() => onModeChange("NHAP")}
          >
            DATA NHẬP
          </button>
          <button
            type="button"
            className={`jump-btn jump-btn--xuat ${mode === "XUAT" ? "active" : ""}`}
            onClick={() => onModeChange("XUAT")}
          >
            DATA XUẤT
          </button>
          <button
            type="button"
            className={`jump-btn jump-btn--ton ${mode === "TON" ? "active" : ""}`}
            onClick={() => onModeChange("TON")}
          >
            TỒN LIỆU
          </button>
        </div>
      </div>
    </aside>
  );
};

export default React.memo(PrecisionKHOLIEUFilterPanel);

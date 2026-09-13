// PrecisionKHOTPFilterPanel.tsx - Sidebar bộ lọc tra cứu Kho Thành Phẩm

import React from "react";
import {
  FiSliders,
  FiZap,
  FiInfo,
} from "react-icons/fi";

interface PrecisionKHOTPFilterPanelProps {
  buttonselected: string;
  setbuttonselected: (mode: string) => void;
  fromdate: string;
  setFromDate: (val: string) => void;
  todate: string;
  setToDate: (val: string) => void;
  codeKD: string;
  setCodeKD: (val: string) => void;
  codeCMS: string;
  setCodeCMS: (val: string) => void;
  cust_name: string;
  setCustName: (val: string) => void;
  alltime: boolean;
  setAllTime: (val: boolean) => void;
  capbu: boolean;
  setCapBu: (val: boolean) => void;
  justbalancecode: boolean;
  setJustBalanceCode: (val: boolean) => void;
  onReset: () => void;
  onLoadData: () => void;
}

const PrecisionKHOTPFilterPanel: React.FC<PrecisionKHOTPFilterPanelProps> = ({
  buttonselected,
  setbuttonselected,
  fromdate,
  setFromDate,
  todate,
  setToDate,
  codeKD,
  setCodeKD,
  codeCMS,
  setCodeCMS,
  cust_name,
  setCustName,
  alltime,
  setAllTime,
  capbu,
  setCapBu,
  justbalancecode,
  setJustBalanceCode,
  onReset,
  onLoadData,
}) => {
  return (
    <aside className="precision-khotp__sidebar" data-purpose="filter-sidebar">
      {/* 1. Header Sidebar */}
      <div className="precision-khotp__sidebarHeader">
        <div className="precision-khotp__sidebarTitle">
          <FiSliders />
          <span>BỘ LỌC TRA CỨU</span>
        </div>
        <button
          type="button"
          className="precision-khotp__resetBtn"
          onClick={onReset}
          title="Đặt lại toàn bộ trường lọc"
        >
          Làm mới
        </button>
      </div>

      {/* 2. Nội dung bộ lọc */}
      <div className="precision-khotp__sidebarContent">
        {/* Chế độ xem chính */}
        <div className="precision-khotp__modeSection">
          <label>
            <span>CHẾ ĐỘ XEM (CHỌN):</span>
            <span className="badge-mode">Chế độ chính</span>
          </label>
          <select
            value={buttonselected}
            onChange={(e) => setbuttonselected(e.target.value)}
          >
            <option value="GR">📥 Nhập Kho</option>
            <option value="GI">📤 Xuất Kho</option>
            <option value="GI_PACK">📦 Xuất Pack</option>
            <option value="STOCKG_CODE">📊 Tồn theo G_CODE</option>
            <option value="STOCKG_NAME_KD">🏷️ Tồn theo Code KD</option>
            <option value="STOCKG_TACH">📍 Tồn theo vị trí kho</option>
          </select>
        </div>

        {/* Khung Từ ngày - Tới ngày */}
        <div className="precision-khotp__dateCard">
          <div className="date-row">
            <span>TỪ NGÀY:</span>
            <input
              type="date"
              value={fromdate.slice(0, 10)}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="date-row">
            <span>TỚI NGÀY:</span>
            <input
              type="date"
              value={todate.slice(0, 10)}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>

        {/* Code KD */}
        <div className="precision-khotp__fieldGroup">
          <label>Code KD (Khách Hàng):</label>
          <input
            type="text"
            placeholder="GH63-xxxxxx..."
            value={codeKD}
            onChange={(e) => setCodeKD(e.target.value)}
          />
        </div>

        {/* Code ERP */}
        <div className="precision-khotp__fieldGroup">
          <label>Code ERP Nội Bộ:</label>
          <input
            type="text"
            placeholder="7C123xxx..."
            value={codeCMS}
            onChange={(e) => setCodeCMS(e.target.value)}
          />
        </div>

        {/* Khách hàng */}
        <div className="precision-khotp__fieldGroup">
          <label>Khách Hàng:</label>
          <input
            type="text"
            placeholder="SEVT, SAMSUNG, SDIV..."
            value={cust_name}
            onChange={(e) => setCustName(e.target.value)}
          />
        </div>

        {/* Checkbox Options */}
        <div className="precision-khotp__checkboxGroup">
          <label>
            <input
              type="checkbox"
              checked={alltime}
              onChange={(e) => setAllTime(e.target.checked)}
            />
            <span>All Time (Toàn thời gian)</span>
          </label>

          <label>
            <input
              type="checkbox"
              checked={capbu}
              onChange={(e) => setCapBu(e.target.checked)}
            />
            <span>Tính cả xuất cấp bù</span>
          </label>

          <label className="highlight">
            <input
              type="checkbox"
              checked={justbalancecode}
              onChange={(e) => setJustBalanceCode(e.target.checked)}
            />
            <span>Chỉ hiển thị code có tồn</span>
          </label>
        </div>

        {/* Nút Hero: TRA CỨU DỮ LIỆU (LOAD) */}
        <div style={{ paddingTop: "4px" }}>
          <button
            type="button"
            className="precision-khotp__loadBtn"
            onClick={onLoadData}
          >
            <FiZap />
            <span>TRA CỨU DỮ LIỆU (LOAD)</span>
          </button>
        </div>
      </div>

      {/* 3. Infobox ở đáy Sidebar */}
      <div className="precision-khotp__infobox">
        <div className="info-title">
          <FiInfo />
          <span>Gợi ý thao tác:</span>
        </div>
        Chọn chế độ tương ứng rồi bấm "TRA CỨU DỮ LIỆU" để tải báo cáo nhập xuất tồn kho thành phẩm.
      </div>
    </aside>
  );
};

export default React.memo(PrecisionKHOTPFilterPanel);

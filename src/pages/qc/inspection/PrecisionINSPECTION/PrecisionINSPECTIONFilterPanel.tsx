// PrecisionINSPECTIONFilterPanel.tsx - Sidebar bộ lọc và cụm nút thao tác quy trình Stitch

import React from "react";
import {
  FiFilter,
  FiRotateCcw,
  FiLogIn,
  FiLogOut,
  FiRepeat,
  FiBookOpen,
  FiAlertTriangle,
  FiShield,
  FiCalendar,
  FiTag,
  FiChevronRight,
  FiClock,
} from "react-icons/fi";

interface PrecisionINSPECTIONFilterPanelProps {
  fromdate: string;
  setFromDate: (val: string) => void;
  todate: string;
  setToDate: (val: string) => void;
  codeKD: string;
  setCodeKD: (val: string) => void;
  codeCMS: string;
  setCodeCMS: (val: string) => void;
  empl_name: string;
  setEmpl_Name: (val: string) => void;
  cust_name: string;
  setCustName: (val: string) => void;
  prod_type: string;
  setProdType: (val: string) => void;
  prodrequestno: string;
  setProdRequestNo: (val: string) => void;
  process_lot_no: string;
  setProcess_Lot_No: (val: string) => void;
  id: string;
  setID: (val: string) => void;
  alltime: boolean;
  setAllTime: (val: boolean) => void;
  onReset: () => void;
  activeAction: string;
  onActionNhapKiem: () => void;
  onActionXuatKiem: () => void;
  onActionNhapXuat: () => void;
  onActionNhatKy: () => void;
  onActionChoKiem: () => void;
  onActionPatrol: () => void;
  onActionKHKT: () => void;
  onActionLotHistory: () => void;
}

const PrecisionINSPECTIONFilterPanel: React.FC<PrecisionINSPECTIONFilterPanelProps> = ({
  fromdate,
  setFromDate,
  todate,
  setToDate,
  codeKD,
  setCodeKD,
  codeCMS,
  setCodeCMS,
  empl_name,
  setEmpl_Name,
  cust_name,
  setCustName,
  prod_type,
  setProdType,
  prodrequestno,
  setProdRequestNo,
  process_lot_no,
  setProcess_Lot_No,
  id,
  setID,
  alltime,
  setAllTime,
  onReset,
  activeAction,
  onActionNhapKiem,
  onActionXuatKiem,
  onActionNhapXuat,
  onActionNhatKy,
  onActionChoKiem,
  onActionPatrol,
  onActionKHKT,
  onActionLotHistory,
}) => {
  return (
    <aside className="precision-ins__sidebar" data-purpose="filter-sidebar">
      {/* 1. Header Bộ Lọc */}
      <div className="precision-ins__sidebarHeader">
        <div className="precision-ins__sidebarTitle">
          <FiFilter />
          <span>BỘ LỌC KIỂM TRA</span>
        </div>
        <button
          type="button"
          className="precision-ins__resetBtn"
          onClick={onReset}
          title="Đặt lại các trường lọc"
        >
          <FiRotateCcw />
          <span>Reset</span>
        </button>
      </div>

      {/* 2. Danh Sách Trường Lọc Siêu Gọn */}
      <div className="precision-ins__sidebarFilters">
        {/* Từ ngày */}
        <div className="precision-ins__filterRow">
          <label>Từ ngày:</label>
          <input
            type="date"
            value={fromdate.slice(0, 10)}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        {/* Tới ngày */}
        <div className="precision-ins__filterRow">
          <label>Tới ngày:</label>
          <input
            type="date"
            value={todate.slice(0, 10)}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        {/* Code KD */}
        <div className="precision-ins__filterRow">
          <label>Code KD:</label>
          <input
            type="text"
            placeholder="GH63-xxxxxx"
            value={codeKD}
            onChange={(e) => setCodeKD(e.target.value)}
          />
        </div>

        {/* Code ERP */}
        <div className="precision-ins__filterRow">
          <label>Code ERP:</label>
          <input
            type="text"
            placeholder="7C123xxx"
            value={codeCMS}
            onChange={(e) => setCodeCMS(e.target.value)}
          />
        </div>

        {/* Tên nhân viên */}
        <div className="precision-ins__filterRow">
          <label>Tên nhân viên:</label>
          <input
            type="text"
            placeholder="Nhập tên nhân viên"
            value={empl_name}
            onChange={(e) => setEmpl_Name(e.target.value)}
          />
        </div>

        {/* Khách hàng */}
        <div className="precision-ins__filterRow">
          <label>Khách:</label>
          <input
            type="text"
            placeholder="SEVT, SAMSUNG..."
            value={cust_name}
            onChange={(e) => setCustName(e.target.value)}
          />
        </div>

        {/* Loại SP */}
        <div className="precision-ins__filterRow">
          <label>Loại SP:</label>
          <input
            type="text"
            placeholder="TSP, SMD..."
            value={prod_type}
            onChange={(e) => setProdType(e.target.value)}
          />
        </div>

        {/* Số YCSX */}
        <div className="precision-ins__filterRow">
          <label>Số YCSX:</label>
          <input
            type="text"
            placeholder="1H23456"
            value={prodrequestno}
            onChange={(e) => setProdRequestNo(e.target.value)}
          />
        </div>

        {/* LOT SX */}
        <div className="precision-ins__filterRow">
          <label>LOT SX:</label>
          <input
            type="text"
            placeholder="ED2H3076"
            value={process_lot_no}
            onChange={(e) => setProcess_Lot_No(e.target.value)}
          />
        </div>

        {/* ID */}
        <div className="precision-ins__filterRow">
          <label>ID:</label>
          <input
            type="text"
            placeholder="12345"
            value={id}
            onChange={(e) => setID(e.target.value)}
          />
        </div>

        {/* Checkbox All Time */}
        <div className="precision-ins__filterRow precision-ins__filterRow--checkbox">
          <label>
            <input
              type="checkbox"
              checked={alltime}
              onChange={(e) => setAllTime(e.target.checked)}
            />
            <span>All Time (Toàn thời gian)</span>
          </label>
        </div>
      </div>

      {/* 3. Palette 8 Nút Hành Động Công Nghiệp Stitch */}
      <div className="precision-ins__sidebarActions" data-purpose="workflow-action-buttons">
        {/* NHẬP KIỂM (Emerald) */}
        <button
          type="button"
          className={`precision-ins__actionBtn precision-ins__actionBtn--nhapkiem ${
            activeAction === "nhapkiem" ? "is-active" : ""
          }`}
          onClick={onActionNhapKiem}
        >
          <div className="btn-left">
            <FiLogIn />
            <span>NHẬP KIỂM</span>
          </div>
          <span className="badge-f">F1</span>
        </button>

        {/* XUẤT KIỂM (Amber) */}
        <button
          type="button"
          className={`precision-ins__actionBtn precision-ins__actionBtn--xuatkiem ${
            activeAction === "xuatkiem" ? "is-active" : ""
          }`}
          onClick={onActionXuatKiem}
        >
          <div className="btn-left">
            <FiLogOut />
            <span>XUẤT KIỂM</span>
          </div>
          <span className="badge-f">F2</span>
        </button>

        {/* NHẬP - XUẤT (Cyan) */}
        <button
          type="button"
          className={`precision-ins__actionBtn precision-ins__actionBtn--nhapxuat ${
            activeAction === "nhapxuat" ? "is-active" : ""
          }`}
          onClick={onActionNhapXuat}
        >
          <div className="btn-left">
            <FiRepeat />
            <span>NHẬP - XUẤT</span>
          </div>
          <span className="badge-f">F3</span>
        </button>

        {/* NHẬT KÝ KT (Purple) */}
        <button
          type="button"
          className={`precision-ins__actionBtn precision-ins__actionBtn--nhatky ${
            activeAction === "nhatky" ? "is-active" : ""
          }`}
          onClick={onActionNhatKy}
        >
          <div className="btn-left">
            <FiBookOpen />
            <span>NHẬT KÝ KT</span>
          </div>
          <span className="badge-f">F4</span>
        </button>

        {/* CHỜ KIỂM (Red Alert) */}
        <button
          type="button"
          className={`precision-ins__actionBtn precision-ins__actionBtn--chokiem ${
            activeAction === "chokiem" ? "is-active" : ""
          }`}
          onClick={onActionChoKiem}
        >
          <div className="btn-left">
            <FiAlertTriangle />
            <span>CHỜ KIỂM</span>
          </div>
          <span className="badge-count">18</span>
        </button>

        {/* DATA PATROL (Royal Blue) */}
        <button
          type="button"
          className={`precision-ins__actionBtn precision-ins__actionBtn--patrol ${
            activeAction === "patrol" ? "is-active" : ""
          }`}
          onClick={onActionPatrol}
        >
          <div className="btn-left">
            <FiShield />
            <span>DATA PATROL</span>
          </div>
          <FiChevronRight />
        </button>

        {/* KHKT (KẾ HOẠCH) (Teal) */}
        <button
          type="button"
          className={`precision-ins__actionBtn precision-ins__actionBtn--khkt ${
            activeAction === "khkt" ? "is-active" : ""
          }`}
          onClick={onActionKHKT}
        >
          <div className="btn-left">
            <FiCalendar />
            <span>KHKT (KẾ HOẠCH)</span>
          </div>
          <FiChevronRight />
        </button>

        {/* TEM LOT HISTORY (Bronze/Amber-700) */}
        <button
          type="button"
          className={`precision-ins__actionBtn precision-ins__actionBtn--lothistory ${
            activeAction === "lothistory" ? "is-active" : ""
          }`}
          onClick={onActionLotHistory}
        >
          <div className="btn-left">
            <FiTag />
            <span>TEM LOT HISTORY</span>
          </div>
          <FiClock />
        </button>
      </div>
    </aside>
  );
};

export default React.memo(PrecisionINSPECTIONFilterPanel);

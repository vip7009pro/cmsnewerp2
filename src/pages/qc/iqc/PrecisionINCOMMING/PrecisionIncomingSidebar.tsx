// PrecisionIncomingSidebar.tsx - High-density Left Panel with Tra Data & New Input tabs
import React from "react";
import { AiOutlineSearch, AiFillFileAdd } from "react-icons/ai";
import { FiFilter, FiEdit3 } from "react-icons/fi";
import { useIncomingData } from "./useIncomingData";

interface PrecisionIncomingSidebarProps {
  hook: ReturnType<typeof useIncomingData>;
}

export const PrecisionIncomingSidebar: React.FC<PrecisionIncomingSidebarProps> = ({ hook }) => {
  const {
    activeLeftTab,
    setActiveLeftTab,
    fromdate,
    setFromDate,
    todate,
    setToDate,
    m_name,
    setM_Name,
    m_code,
    setM_Code,
    vendor,
    setVendor,
    vendorLot,
    setVendorLot,
    showAllIncoming,
    setShowAllIncoming,
    handletraIQC1Data,
    inputno,
    setInputNo,
    checkLotNVL,
    nq_qty,
    setNQ_QTY,
    dtc_id,
    setDtc_ID,
    request_empl,
    setrequest_empl,
    checkEMPL_NAME,
    empl_name,
    remark,
    setReMark,
    addRow,
    insertIQC1Table,
  } = hook;

  return (
    <aside className="precision-incoming__sidebar">
      {/* Mode Switcher Tabs */}
      <div className="precision-incoming__sidebar-tabs">
        <button
          className={`precision-incoming__tab-btn ${
            activeLeftTab === "traData" ? "precision-incoming__tab-btn--active-tra" : ""
          }`}
          onClick={() => setActiveLeftTab("traData")}
        >
          <AiOutlineSearch size={13} />
          <span>Tra Data</span>
        </button>
        <button
          className={`precision-incoming__tab-btn ${
            activeLeftTab === "newInput" ? "precision-incoming__tab-btn--active-new" : ""
          }`}
          onClick={() => setActiveLeftTab("newInput")}
        >
          <AiFillFileAdd size={13} />
          <span>New Input</span>
        </button>
      </div>

      {/* Mode 1: Search Filter Panel (TRA DATA) */}
      {activeLeftTab === "traData" && (
        <div className="precision-incoming__sidebar-content">
          <div className="precision-incoming__sidebar-title precision-incoming__sidebar-title--tra">
            <FiFilter size={13} />
            <span>Bộ Lọc Dữ Liệu Incoming</span>
          </div>

          <div className="precision-incoming__form-group">
            <label>Từ ngày:</label>
            <input
              type="date"
              className="font-mono-val"
              value={fromdate.slice(0, 10)}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div className="precision-incoming__form-group">
            <label>Tới ngày:</label>
            <input
              type="date"
              className="font-mono-val"
              value={todate.slice(0, 10)}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <div className="precision-incoming__form-group">
            <label>Tên Liệu:</label>
            <input
              type="text"
              placeholder="VD: SJ-203020HC"
              value={m_name}
              onChange={(e) => setM_Name(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handletraIQC1Data()}
            />
          </div>

          <div className="precision-incoming__form-group">
            <label>Mã Liệu CMS:</label>
            <input
              type="text"
              placeholder="VD: A123456"
              className="font-mono-val"
              value={m_code}
              onChange={(e) => setM_Code(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handletraIQC1Data()}
            />
          </div>

          <div className="precision-incoming__form-group">
            <label>Vendor Name:</label>
            <input
              type="text"
              placeholder="VD: SSJ / KOSTAR"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handletraIQC1Data()}
            />
          </div>

          <div className="precision-incoming__form-group">
            <label>Vendor LOT:</label>
            <input
              type="text"
              placeholder="Số lô nhà cung cấp..."
              className="font-mono-val"
              value={vendorLot}
              onChange={(e) => setVendorLot(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handletraIQC1Data()}
            />
          </div>

          <label className="precision-incoming__checkbox-row">
            <input
              type="checkbox"
              checked={showAllIncoming}
              onChange={(e) => setShowAllIncoming(e.target.checked)}
            />
            <span>Show All (Không lọc ngày)</span>
          </label>

          <div className="precision-incoming__sidebar-actions">
            <button className="precision-incoming__btn precision-incoming__btn--primary" onClick={handletraIQC1Data}>
              <AiOutlineSearch size={14} />
              <span>TRA DATA INCOMING</span>
            </button>
          </div>
        </div>
      )}

      {/* Mode 2: Entry Form (INPUT DATA KIỂM TRA INCOMING) */}
      {activeLeftTab === "newInput" && (
        <div className="precision-incoming__sidebar-content">
          <div className="precision-incoming__sidebar-title precision-incoming__sidebar-title--new">
            <FiEdit3 size={13} />
            <span>Đăng Ký Kiểm Tra Lô Mới</span>
          </div>

          <div className="precision-incoming__form-group">
            <label>LOT NVL ERP:</label>
            <input
              type="text"
              placeholder="VD: 202304190123"
              className="font-mono-val"
              value={inputno}
              onChange={(e) => {
                const val = e.target.value;
                setInputNo(val);
                if (val.length >= 7) {
                  checkLotNVL(val);
                }
              }}
            />
            {m_name && <span className="input-hint">{m_name}</span>}
          </div>

          <div className="precision-incoming__form-group">
            <label>RL NgQuan (Số cuộn ngoại quan):</label>
            <input
              type="number"
              className="font-mono-val"
              value={nq_qty}
              onChange={(e) => setNQ_QTY(Number(e.target.value))}
            />
          </div>

          <div className="precision-incoming__form-group">
            <label>ID TestĐTC:</label>
            <input
              type="number"
              className="font-mono-val"
              value={dtc_id}
              onChange={(e) => setDtc_ID(Number(e.target.value))}
            />
          </div>

          <div className="precision-incoming__form-group">
            <label>Mã IQC (Người kiểm tra):</label>
            <input
              type="text"
              placeholder="VD: NHU1903"
              className="font-mono-val"
              value={request_empl}
              onChange={(e) => {
                const val = e.target.value;
                setrequest_empl(val);
                if (val.length >= 7) {
                  checkEMPL_NAME(val);
                }
              }}
            />
            {empl_name && <span className="input-hint">{empl_name}</span>}
          </div>

          <div className="precision-incoming__form-group">
            <label>Remark (Ghi chú):</label>
            <textarea
              placeholder="Nhập lý do kiểm tra / ghi chú ngoại quan..."
              value={remark}
              onChange={(e) => setReMark(e.target.value)}
            />
          </div>

          <div className="precision-incoming__sidebar-actions">
            <div className="grid-2-actions">
              <button className="precision-incoming__btn precision-incoming__btn--amber" onClick={addRow}>
                <span>+ ADD</span>
              </button>
              <button className="precision-incoming__btn precision-incoming__btn--emerald" onClick={insertIQC1Table}>
                <span>LƯU SAVE</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

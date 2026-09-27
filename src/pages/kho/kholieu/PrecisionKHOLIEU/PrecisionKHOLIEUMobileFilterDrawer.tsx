// PrecisionKHOLIEUMobileFilterDrawer.tsx - Bottom Sheet Filter Drawer Zero-Blur cho Kho Liệu

import React, { useState, useEffect } from "react";
import { FiX, FiFilter, FiRotateCcw, FiCheck, FiCalendar } from "react-icons/fi";
import moment from "moment";

interface PrecisionKHOLIEUMobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  fromdate: string;
  todate: string;
  m_name: string;
  m_code: string;
  codeKD: string;
  prod_request_no: string;
  plan_id: string;
  rollNo: string;
  alltime: boolean;
  justbalancecode: boolean;
  in_nhanh: boolean;
  isPVN: boolean;
  mode: "NHAP" | "XUAT" | "TON";
  onApply: (filters: {
    fromdate: string;
    todate: string;
    m_name: string;
    m_code: string;
    codeKD: string;
    prod_request_no: string;
    plan_id: string;
    rollNo: string;
    alltime: boolean;
    justbalancecode: boolean;
    in_nhanh: boolean;
  }) => void;
  onReset: () => void;
}

const PrecisionKHOLIEUMobileFilterDrawer: React.FC<PrecisionKHOLIEUMobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  fromdate,
  todate,
  m_name,
  m_code,
  codeKD,
  prod_request_no,
  plan_id,
  rollNo,
  alltime,
  justbalancecode,
  in_nhanh,
  isPVN,
  mode,
  onApply,
  onReset,
}) => {
  // Local state bên trong Drawer
  const [localFromDate, setLocalFromDate] = useState(fromdate);
  const [localToDate, setLocalToDate] = useState(todate);
  const [localMName, setLocalMName] = useState(m_name);
  const [localMCode, setLocalMCode] = useState(m_code);
  const [localCodeKD, setLocalCodeKD] = useState(codeKD);
  const [localProdRequestNo, setLocalProdRequestNo] = useState(prod_request_no);
  const [localPlanId, setLocalPlanId] = useState(plan_id);
  const [localRollNo, setLocalRollNo] = useState(rollNo);
  const [localAllTime, setLocalAllTime] = useState(alltime);
  const [localJustBalance, setLocalJustBalance] = useState(justbalancecode);
  const [localInNhanh, setLocalInNhanh] = useState(in_nhanh);

  // Sync khi mở Drawer
  useEffect(() => {
    if (isOpen) {
      setLocalFromDate(fromdate);
      setLocalToDate(todate);
      setLocalMName(m_name);
      setLocalMCode(m_code);
      setLocalCodeKD(codeKD);
      setLocalProdRequestNo(prod_request_no);
      setLocalPlanId(plan_id);
      setLocalRollNo(rollNo);
      setLocalAllTime(alltime);
      setLocalJustBalance(justbalancecode);
      setLocalInNhanh(in_nhanh);
    }
  }, [
    isOpen,
    fromdate,
    todate,
    m_name,
    m_code,
    codeKD,
    prod_request_no,
    plan_id,
    rollNo,
    alltime,
    justbalancecode,
    in_nhanh,
  ]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply({
      fromdate: localFromDate,
      todate: localToDate,
      m_name: localMName,
      m_code: localMCode,
      codeKD: localCodeKD,
      prod_request_no: localProdRequestNo,
      plan_id: localPlanId,
      rollNo: localRollNo,
      alltime: localAllTime,
      justbalancecode: localJustBalance,
      in_nhanh: localInNhanh,
    });
    onClose();
  };

  const handleReset = () => {
    const today = moment().format("YYYY-MM-DD");
    setLocalFromDate(today);
    setLocalToDate(today);
    setLocalMName("");
    setLocalMCode("");
    setLocalCodeKD("");
    setLocalProdRequestNo("");
    setLocalPlanId("");
    setLocalRollNo("");
    setLocalAllTime(false);
    setLocalJustBalance(true);
    setLocalInNhanh(false);
    onReset();
    onClose();
  };

  return (
    <div className="precision-kholieu-drawer-overlay" onClick={onClose}>
      <div className="precision-kholieu-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header Drawer */}
        <div className="drawer-header">
          <div className="drawer-title">
            <FiFilter size={16} style={{ color: "#2563eb" }} />
            <span>Bộ Lọc Kho Liệu ({mode})</span>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            title="Đóng bộ lọc"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Body Form */}
        <div className="drawer-body">
          {/* 1. Khoảng ngày */}
          <div className="drawer-field">
            <div className="drawer-field-header">
              <label className="drawer-label">Khoảng Thời Gian Tra Cứu</label>
              <button
                type="button"
                className={`drawer-quick-toggle ${localAllTime ? "active" : ""}`}
                onClick={() => setLocalAllTime(!localAllTime)}
              >
                {localAllTime ? "All Time ✓" : "All Time"}
              </button>
            </div>
            {!localAllTime && (
              <div className="drawer-date-grid">
                <div className="date-input-group">
                  <span className="date-tag">Từ ngày</span>
                  <input
                    type="date"
                    className="drawer-input"
                    value={localFromDate.slice(0, 10)}
                    onChange={(e) => setLocalFromDate(e.target.value)}
                  />
                </div>
                <div className="date-input-group">
                  <span className="date-tag">Tới ngày</span>
                  <input
                    type="date"
                    className="drawer-input"
                    value={localToDate.slice(0, 10)}
                    onChange={(e) => setLocalToDate(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 2. Tên Vật Liệu */}
          <div className="drawer-field">
            <label className="drawer-label">Tên Liệu (M_NAME)</label>
            <input
              type="text"
              className="drawer-input"
              placeholder="VD: PET 50um, Băng dính..."
              value={localMName}
              onChange={(e) => setLocalMName(e.target.value)}
            />
          </div>

          {/* 3. Mã Liệu CMS */}
          <div className="drawer-field">
            <label className="drawer-label">Mã Liệu CMS (M_CODE)</label>
            <input
              type="text"
              className="drawer-input"
              placeholder="VD: A123456 hoặc mã nội bộ..."
              value={localMCode}
              onChange={(e) => setLocalMCode(e.target.value)}
            />
          </div>

          {/* 4. Code KD (Model) */}
          <div className="drawer-field">
            <label className="drawer-label">Code KD (Model / G_NAME)</label>
            <input
              type="text"
              className="drawer-input"
              placeholder="VD: GH63-xxxxxx..."
              value={localCodeKD}
              onChange={(e) => setLocalCodeKD(e.target.value)}
              style={{ color: "#2563eb", fontWeight: 600 }}
            />
          </div>

          {/* 5. Số YCSX & PLAN ID */}
          <div className="drawer-date-grid">
            <div className="drawer-field">
              <label className="drawer-label">Số YCSX</label>
              <input
                type="text"
                className="drawer-input"
                placeholder="VD: 1F80008..."
                value={localProdRequestNo}
                onChange={(e) => setLocalProdRequestNo(e.target.value)}
              />
            </div>
            <div className="drawer-field">
              <label className="drawer-label">PLAN ID</label>
              <input
                type="text"
                className="drawer-input"
                placeholder="VD: 1F80008A..."
                value={localPlanId}
                onChange={(e) => setLocalPlanId(e.target.value)}
              />
            </div>
          </div>

          {/* 6. STT Cuộn */}
          <div className="drawer-field">
            <label className="drawer-label">STT Cuộn (Roll No)</label>
            <input
              type="text"
              className="drawer-input"
              placeholder="VD: 1-120 hoặc cuộn đơn..."
              value={localRollNo}
              onChange={(e) => setLocalRollNo(e.target.value)}
            />
          </div>

          {/* 7. Checkboxes */}
          <div className="drawer-checkbox-group">
            <label className="drawer-checkbox-item">
              <input
                type="checkbox"
                checked={localJustBalance}
                onChange={(e) => setLocalJustBalance(e.target.checked)}
              />
              <span className="checkbox-text">Chỉ vật liệu có tồn kho (&gt; 0)</span>
            </label>

            {isPVN && (
              <label className="drawer-checkbox-item">
                <input
                  type="checkbox"
                  checked={localInNhanh}
                  onChange={(e) => setLocalInNhanh(e.target.checked)}
                />
                <span className="checkbox-text">In nhanh</span>
              </label>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="drawer-footer">
          <button
            type="button"
            className="btn-drawer-reset"
            onClick={handleReset}
          >
            <FiRotateCcw size={14} />
            <span>Đặt Lại</span>
          </button>

          <button
            type="button"
            className="btn-drawer-apply"
            onClick={handleApply}
          >
            <FiCheck size={16} />
            <span>Áp Dụng Tra Cứu</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionKHOLIEUMobileFilterDrawer);

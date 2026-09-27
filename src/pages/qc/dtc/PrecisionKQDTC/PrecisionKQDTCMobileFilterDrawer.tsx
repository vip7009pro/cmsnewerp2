// PrecisionKQDTCMobileFilterDrawer.tsx - Bottom Sheet Filter Drawer Zero-Blur cho KQDTC

import React, { useState, useEffect } from "react";
import { FiX, FiFilter, FiRotateCcw, FiCheck } from "react-icons/fi";
import moment from "moment";
import { TestListTable } from "../interfaces/qcInterface";

interface PrecisionKQDTCMobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  fromdate: string;
  todate: string;
  alltime: boolean;
  codeKD: string;
  codeCMS: string;
  m_name: string;
  m_code: string;
  testname: string;
  testList: TestListTable[];
  prodrequestno: string;
  testtype: string;
  id: string;
  onApply: (filters: {
    fromdate: string;
    todate: string;
    alltime: boolean;
    codeKD: string;
    codeCMS: string;
    m_name: string;
    m_code: string;
    testname: string;
    prodrequestno: string;
    testtype: string;
    id: string;
  }) => void;
  onReset: () => void;
}

const PrecisionKQDTCMobileFilterDrawer: React.FC<PrecisionKQDTCMobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  fromdate,
  todate,
  alltime,
  codeKD,
  codeCMS,
  m_name,
  m_code,
  testname,
  testList,
  prodrequestno,
  testtype,
  id,
  onApply,
  onReset,
}) => {
  // Local state bên trong Drawer
  const [localFromDate, setLocalFromDate] = useState(fromdate);
  const [localToDate, setLocalToDate] = useState(todate);
  const [localAllTime, setLocalAllTime] = useState(alltime);
  const [localCodeKD, setLocalCodeKD] = useState(codeKD);
  const [localCodeCMS, setLocalCodeCMS] = useState(codeCMS);
  const [localMName, setLocalMName] = useState(m_name);
  const [localMCode, setLocalMCode] = useState(m_code);
  const [localTestName, setLocalTestName] = useState(testname);
  const [localProdRequestNo, setLocalProdRequestNo] = useState(prodrequestno);
  const [localTestType, setLocalTestType] = useState(testtype);
  const [localID, setLocalID] = useState(id);

  // Sync khi mở Drawer
  useEffect(() => {
    if (isOpen) {
      setLocalFromDate(fromdate);
      setLocalToDate(todate);
      setLocalAllTime(alltime);
      setLocalCodeKD(codeKD);
      setLocalCodeCMS(codeCMS);
      setLocalMName(m_name);
      setLocalMCode(m_code);
      setLocalTestName(testname);
      setLocalProdRequestNo(prodrequestno);
      setLocalTestType(testtype);
      setLocalID(id);
    }
  }, [
    isOpen,
    fromdate,
    todate,
    alltime,
    codeKD,
    codeCMS,
    m_name,
    m_code,
    testname,
    prodrequestno,
    testtype,
    id,
  ]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply({
      fromdate: localFromDate,
      todate: localToDate,
      alltime: localAllTime,
      codeKD: localCodeKD,
      codeCMS: localCodeCMS,
      m_name: localMName,
      m_code: localMCode,
      testname: localTestName,
      prodrequestno: localProdRequestNo,
      testtype: localTestType,
      id: localID,
    });
    onClose();
  };

  const handleReset = () => {
    const today = moment().format("YYYY-MM-DD");
    setLocalFromDate(today);
    setLocalToDate(today);
    setLocalAllTime(false);
    setLocalCodeKD("");
    setLocalCodeCMS("");
    setLocalMName("");
    setLocalMCode("");
    setLocalTestName("0");
    setLocalProdRequestNo("");
    setLocalTestType("0");
    setLocalID("");
    onReset();
    onClose();
  };

  return (
    <div className="precision-kqdtc-drawer-overlay" onClick={onClose}>
      <div className="precision-kqdtc-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header Drawer */}
        <div className="drawer-header">
          <div className="drawer-title">
            <FiFilter size={16} style={{ color: "#2563eb" }} />
            <span>Bộ Lọc Kiểm Tra Độ Tin Cậy (ĐTC)</span>
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
              <label className="drawer-label">Khoảng Thời Gian Kiểm Tra</label>
              <button
                type="button"
                className={`drawer-quick-toggle ${localAllTime ? "active" : ""}`}
                onClick={() => setLocalAllTime(!localAllTime)}
              >
                {localAllTime ? "Toàn thời gian ✓" : "All Time"}
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

          {/* 2. Hạng mục test & Phân loại test */}
          <div className="drawer-date-grid">
            <div className="drawer-field">
              <label className="drawer-label">Hạng Mục Test</label>
              <select
                className="drawer-input"
                value={localTestName}
                onChange={(e) => setLocalTestName(e.target.value)}
              >
                <option value="0">ALL (Tất cả)</option>
                {testList.map((item) => (
                  <option key={item.TEST_CODE} value={item.TEST_CODE}>
                    {item.TEST_NAME}
                  </option>
                ))}
              </select>
            </div>
            <div className="drawer-field">
              <label className="drawer-label">Phân Loại Test</label>
              <select
                className="drawer-input"
                value={localTestType}
                onChange={(e) => setLocalTestType(e.target.value)}
              >
                <option value="0">ALL (Mass + Pilot)</option>
                <option value="1">FIRST_LOT</option>
                <option value="2">ECN</option>
                <option value="3">MASS PRODUCTION</option>
                <option value="4">SAMPLE</option>
              </select>
            </div>
          </div>

          {/* 3. Code KD & Code CMS */}
          <div className="drawer-date-grid">
            <div className="drawer-field">
              <label className="drawer-label">Code KD (Model)</label>
              <input
                type="text"
                className="drawer-input font-mono"
                placeholder="VD: GH63-xxxxxx"
                value={localCodeKD}
                onChange={(e) => setLocalCodeKD(e.target.value)}
              />
            </div>
            <div className="drawer-field">
              <label className="drawer-label">Mã ERP (Code CMS)</label>
              <input
                type="text"
                className="drawer-input font-mono"
                placeholder="VD: 7C123xxx"
                value={localCodeCMS}
                onChange={(e) => setLocalCodeCMS(e.target.value)}
              />
            </div>
          </div>

          {/* 4. Tên Vật Liệu & Mã Liệu */}
          <div className="drawer-date-grid">
            <div className="drawer-field">
              <label className="drawer-label">Tên Liệu (M_NAME)</label>
              <input
                type="text"
                className="drawer-input"
                placeholder="VD: SJ-203020HC..."
                value={localMName}
                onChange={(e) => setLocalMName(e.target.value)}
              />
            </div>
            <div className="drawer-field">
              <label className="drawer-label">Mã Liệu (M_CODE)</label>
              <input
                type="text"
                className="drawer-input font-mono"
                placeholder="VD: A123456..."
                value={localMCode}
                onChange={(e) => setLocalMCode(e.target.value)}
              />
            </div>
          </div>

          {/* 5. Số YCSX & DTC ID */}
          <div className="drawer-date-grid">
            <div className="drawer-field">
              <label className="drawer-label">Số YCSX (Lệnh SX)</label>
              <input
                type="text"
                className="drawer-input font-mono"
                placeholder="VD: 1H23456..."
                value={localProdRequestNo}
                onChange={(e) => setLocalProdRequestNo(e.target.value)}
              />
            </div>
            <div className="drawer-field">
              <label className="drawer-label">DTC ID (Mã phiếu)</label>
              <input
                type="text"
                className="drawer-input font-mono"
                placeholder="VD: 12345..."
                value={localID}
                onChange={(e) => setLocalID(e.target.value)}
              />
            </div>
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

export default React.memo(PrecisionKQDTCMobileFilterDrawer);

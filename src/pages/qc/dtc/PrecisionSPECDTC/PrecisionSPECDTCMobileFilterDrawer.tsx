// PrecisionSPECDTCMobileFilterDrawer.tsx - Bottom Sheet Filter Drawer Zero-Blur cho SPECDTC

import React, { useState, useEffect } from "react";
import { FiX, FiFilter, FiRotateCcw, FiCheck } from "react-icons/fi";
import moment from "moment";
import { TestListTable } from "../../interfaces/qcInterface";

interface PrecisionSPECDTCMobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  codeKD: string;
  codeCMS: string;
  m_name: string;
  m_code: string;
  testname: string;
  testlist: TestListTable[];
  prodrequestno: string;
  alltime: boolean;
  onApply: (filters: {
    codeKD: string;
    codeCMS: string;
    m_name: string;
    m_code: string;
    testname: string;
    prodrequestno: string;
    alltime: boolean;
  }) => void;
  onReset: () => void;
}

const PrecisionSPECDTCMobileFilterDrawer: React.FC<PrecisionSPECDTCMobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  codeKD,
  codeCMS,
  m_name,
  m_code,
  testname,
  testlist,
  prodrequestno,
  alltime,
  onApply,
  onReset,
}) => {
  // Local state bên trong Drawer
  const [localCodeKD, setLocalCodeKD] = useState(codeKD);
  const [localCodeCMS, setLocalCodeCMS] = useState(codeCMS);
  const [localMName, setLocalMName] = useState(m_name);
  const [localMCode, setLocalMCode] = useState(m_code);
  const [localTestName, setLocalTestName] = useState(testname);
  const [localProdRequestNo, setLocalProdRequestNo] = useState(prodrequestno);
  const [localAllTime, setLocalAllTime] = useState(alltime);

  // Sync khi mở Drawer
  useEffect(() => {
    if (isOpen) {
      setLocalCodeKD(codeKD);
      setLocalCodeCMS(codeCMS);
      setLocalMName(m_name);
      setLocalMCode(m_code);
      setLocalTestName(testname);
      setLocalProdRequestNo(prodrequestno);
      setLocalAllTime(alltime);
    }
  }, [isOpen, codeKD, codeCMS, m_name, m_code, testname, prodrequestno, alltime]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply({
      codeKD: localCodeKD,
      codeCMS: localCodeCMS,
      m_name: localMName,
      m_code: localMCode,
      testname: localTestName,
      prodrequestno: localProdRequestNo,
      alltime: localAllTime,
    });
    onClose();
  };

  const handleReset = () => {
    setLocalCodeKD("");
    setLocalCodeCMS("");
    setLocalMName("");
    setLocalMCode("");
    setLocalTestName("0");
    setLocalProdRequestNo("");
    setLocalAllTime(false);
    onReset();
    onClose();
  };

  return (
    <div className="precision-specdtc-drawer-overlay" onClick={onClose}>
      <div className="precision-specdtc-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header Drawer */}
        <div className="drawer-header">
          <div className="drawer-title">
            <FiFilter size={16} style={{ color: "#2563eb" }} />
            <span>Bộ Lọc Tiêu Chuẩn Kỹ Thuật (SPEC DTC)</span>
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
          {/* 1. All Time Toggle */}
          <div className="drawer-field">
            <div className="drawer-field-header">
              <label className="drawer-label">Chế Độ Thời Gian</label>
              <button
                type="button"
                className={`drawer-quick-toggle ${localAllTime ? "active" : ""}`}
                onClick={() => setLocalAllTime(!localAllTime)}
              >
                {localAllTime ? "Toàn thời gian ✓" : "All Time"}
              </button>
            </div>
          </div>

          {/* 2. Code KD & Code CMS */}
          <div className="drawer-date-grid">
            <div className="drawer-field">
              <label className="drawer-label">Mã Khách Hàng (Code KD)</label>
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

          {/* 3. Tên Vật Liệu & Mã Liệu */}
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

          {/* 4. Hạng mục test */}
          <div className="drawer-field">
            <label className="drawer-label">Hạng Mục Test</label>
            <select
              className="drawer-input"
              value={localTestName}
              onChange={(e) => setLocalTestName(e.target.value)}
            >
              {testlist.map((item, index) => (
                <option key={index} value={item.TEST_CODE}>
                  {item.TEST_NAME}
                </option>
              ))}
            </select>
          </div>

          {/* 5. Số YCSX */}
          <div className="drawer-field">
            <label className="drawer-label">Số Lệnh Sản Xuất (Số YCSX)</label>
            <input
              type="text"
              className="drawer-input font-mono"
              placeholder="VD: 1H23456..."
              value={localProdRequestNo}
              onChange={(e) => setLocalProdRequestNo(e.target.value)}
            />
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

export default React.memo(PrecisionSPECDTCMobileFilterDrawer);

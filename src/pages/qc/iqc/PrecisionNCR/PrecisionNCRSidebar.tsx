import React from "react";
import moment from "moment";
import { AiOutlineSearch, AiOutlineBarcode, AiOutlineReload, AiOutlinePlus } from "react-icons/ai";
import { PrecisionNCRFormInput } from "./PrecisionNCRFormInput";

import { UseNCRDataReturn } from "./useNCRData";

interface PrecisionNCRSidebarProps {
  ncrData: UseNCRDataReturn;
}

export const PrecisionNCRSidebar: React.FC<PrecisionNCRSidebarProps> = ({ ncrData }) => {
  const {
    isNewRegister,
    setIsNewRegister,
    fromdate,
    setFromDate,
    todate,
    setToDate,
    vendor,
    setVendor,
    m_name,
    setM_Name,
    m_code,
    setM_Code,
    cmsLOT,
    setCMSLOT,
    vendorLot,
    setVendorLot,
    pendingOnly,
    setPendingOnly,
    handletraNCRData,
    cmsLot,
    setCmsLot,
    width_cd,
    ncr_date,
    setNCR_DATE,
    response_date,
    setRESPONSE_DATE,
    defect_title,
    setDefect_Title,
    defect_detail,
    setDefect_Detail,
    iqc_empl,
    setIQC_Empl,
    empl_name,
    remark,
    setReMark,
    checkLotNVL,
    checkEMPL_NAME,
    addRow,
    insertNCRData,
    handleStartNewRegister,
  } = ncrData;
  const onSearch = handletraNCRData;
  const onAddRow = addRow;
  const onSaveData = insertNCRData;
  const onStartNewRegister = handleStartNewRegister;
  const handleResetFilters = () => {
    setFromDate(moment().format("YYYY-MM-DD"));
    setToDate(moment().format("YYYY-MM-DD"));
    setVendor("");
    setM_Name("");
    setM_Code("");
    setCMSLOT("");
    setVendorLot("");
  };

  return (
    <aside className="precision-ncr-sidebar">
      {/* Segmented Switcher Header */}
      <div className="precision-ncr-sidebar__segmented">
        <button
          className={`seg-btn ${!isNewRegister ? "active" : ""}`}
          onClick={() => setIsNewRegister(false)}
        >
          <AiOutlineSearch />
          <span>TRA DATA</span>
        </button>
        <button
          className={`seg-btn ${isNewRegister ? "active" : ""}`}
          onClick={onStartNewRegister}
        >
          <AiOutlinePlus />
          <span>NEW NCR</span>
        </button>
      </div>

      {/* Main Content Body */}
      <div className="precision-ncr-sidebar__content">
        {!isNewRegister ? (
          <>
            {/* Bộ lọc Tra cứu */}
            <div className="form-group">
              <label>TỪ NGÀY:</label>
              <input
                type="date"
                className="font-mono"
                value={fromdate.slice(0, 10)}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>TỚI NGÀY:</label>
              <input
                type="date"
                className="font-mono"
                value={todate.slice(0, 10)}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>TÊN LIỆU (M_NAME):</label>
              <input
                type="text"
                placeholder="SJ-203020HC"
                value={m_name}
                onChange={(e) => setM_Name(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>MÃ LIỆU CMS (M_CODE):</label>
              <input
                type="text"
                className="font-mono"
                placeholder="A123456"
                value={m_code}
                onChange={(e) => setM_Code(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>VENDOR NAME:</label>
              <input
                type="text"
                placeholder="SSJ, JY TECH..."
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>LOT CMS ERP:</label>
              <div className="input-with-action">
                <input
                  type="text"
                  className="font-mono"
                  placeholder="2409040001"
                  value={cmsLOT}
                  onChange={(e) => setCMSLOT(e.target.value)}
                />
                <button
                  className="btn-input-icon"
                  title="Quét Barcode"
                  onClick={() => {
                    const scan = prompt("Quét mã vạch LOT CMS:");
                    if (scan) setCMSLOT(scan.trim());
                  }}
                >
                  <AiOutlineBarcode size={14} />
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>VENDOR LOT (LOT NCC):</label>
              <input
                type="text"
                className="font-mono"
                placeholder="abcxyz123"
                value={vendorLot}
                onChange={(e) => setVendorLot(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={pendingOnly}
                  onChange={(e) => setPendingOnly(e.target.checked)}
                />
                <span>Chỉ hiện NCR Pending</span>
              </label>
            </div>
          </>
        ) : (
          /* Form Đăng ký mới */
          <PrecisionNCRFormInput
            cmsLot={cmsLot}
            setCmsLot={setCmsLot}
            vendorLot={vendorLot}
            setVendorLot={setVendorLot}
            m_name={m_name}
            width_cd={width_cd}
            ncr_date={ncr_date}
            setNCR_DATE={setNCR_DATE}
            response_date={response_date}
            setRESPONSE_DATE={setRESPONSE_DATE}
            defect_title={defect_title}
            setDefect_Title={setDefect_Title}
            defect_detail={defect_detail}
            setDefect_Detail={setDefect_Detail}
            iqc_empl={iqc_empl}
            setIQC_Empl={setIQC_Empl}
            empl_name={empl_name}
            remark={remark}
            setReMark={setReMark}
            checkLotNVL={checkLotNVL}
            checkEMPL_NAME={checkEMPL_NAME}
            onAddRow={onAddRow}
            onSaveData={onSaveData}
          />
        )}
      </div>

      {/* Footer Actions */}
      <div className="precision-ncr-sidebar__footer">
        {!isNewRegister ? (
          <>
            <button className="btn-submit" onClick={onSearch}>
              <AiOutlineSearch size={14} />
              <span>TRA DATA NCR</span>
            </button>
            <button className="btn-secondary" onClick={handleResetFilters}>
              <AiOutlineReload size={12} />
              <span>Làm mới bộ lọc</span>
            </button>
          </>
        ) : (
          <button
            className="btn-secondary"
            onClick={() => setIsNewRegister(false)}
          >
            <AiOutlineSearch size={12} />
            <span>Quay lại Tra Cứu</span>
          </button>
        )}
      </div>
    </aside>
  );
};

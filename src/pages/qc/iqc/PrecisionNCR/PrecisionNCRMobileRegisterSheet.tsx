import React, { useCallback } from "react";
import {
  AiOutlineClose,
  AiOutlineArrowLeft,
  AiOutlinePlus,
  AiOutlineSave,
} from "react-icons/ai";
import { UseNCRDataReturn } from "./useNCRData";

interface PrecisionNCRMobileRegisterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  ncrData: UseNCRDataReturn;
}

export const PrecisionNCRMobileRegisterSheet: React.FC<PrecisionNCRMobileRegisterSheetProps> = ({
  isOpen,
  onClose,
  ncrData,
}) => {
  const handleClose = useCallback(() => {
    ncrData.setIsNewRegister(false);
    onClose();
  }, [ncrData, onClose]);

  if (!isOpen) return null;

  return (
    <div className="precision-ncr-mobile-register-overlay" onClick={handleClose}>
      <div
        className="precision-ncr-mobile-register-sheet"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sheet Header */}
        <div className="register-sheet__header">
          <button className="btn-back" onClick={handleClose}>
            <AiOutlineArrowLeft size={18} />
          </button>
          <h3>Đăng Ký NCR Mới</h3>
          <button className="btn-close-sheet" onClick={handleClose}>
            <AiOutlineClose size={18} />
          </button>
        </div>

        {/* Sheet Body - Mobile-optimized form */}
        <div className="register-sheet__body">
          {/* Section 1: Thông Tin Vật Liệu */}
          <div className="ncr-form-section">
            <div className="ncr-form-section__title">Thông tin vật liệu</div>

            <div className="ncr-form-field">
              <label>LOT NVL ERP</label>
              <input
                type="text"
                className="font-mono"
                placeholder="2304190123"
                value={ncrData.cmsLot}
                onChange={(e) => {
                  const val = e.target.value;
                  ncrData.setCmsLot(val);
                  if (val.length >= 7) {
                    ncrData.checkLotNVL(val);
                  }
                }}
              />
              {ncrData.m_name && (
                <div className="ncr-form-field__lookup">
                  <span className="lookup-tag">{ncrData.m_name}</span>
                  <span className="lookup-tag subtle">W: {ncrData.width_cd}</span>
                </div>
              )}
            </div>

            <div className="ncr-form-field">
              <label>VENDOR LOT</label>
              <input
                type="text"
                className="font-mono"
                placeholder="abcdxyz123"
                value={ncrData.vendorLot}
                onChange={(e) => ncrData.setVendorLot(e.target.value)}
              />
            </div>
          </div>

          {/* Section 2: Thời Gian */}
          <div className="ncr-form-section">
            <div className="ncr-form-section__title">Thời gian</div>
            <div className="ncr-form-row-2col">
              <div className="ncr-form-field">
                <label>Ngày phát hiện</label>
                <input
                  type="date"
                  className="font-mono"
                  value={ncrData.ncr_date}
                  onChange={(e) => ncrData.setNCR_DATE(e.target.value)}
                />
              </div>
              <div className="ncr-form-field">
                <label>Hạn phản hồi</label>
                <input
                  type="date"
                  className="font-mono"
                  value={ncrData.response_date}
                  onChange={(e) => ncrData.setRESPONSE_DATE(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Mô Tả Lỗi */}
          <div className="ncr-form-section">
            <div className="ncr-form-section__title">Mô tả lỗi</div>

            <div className="ncr-form-field">
              <label>Tiêu đề lỗi</label>
              <input
                type="text"
                placeholder="VD: Bong keo, xước cuộn..."
                value={ncrData.defect_title}
                onChange={(e) => ncrData.setDefect_Title(e.target.value)}
              />
            </div>

            <div className="ncr-form-field">
              <label>Chi tiết lỗi</label>
              <textarea
                placeholder="Mô tả cụ thể vị trí và tình trạng..."
                value={ncrData.defect_detail}
                onChange={(e) => ncrData.setDefect_Detail(e.target.value)}
              />
            </div>
          </div>

          {/* Section 4: Người Kiểm Tra & Ghi Chú */}
          <div className="ncr-form-section">
            <div className="ncr-form-section__title">Người kiểm tra</div>

            <div className="ncr-form-field">
              <label>Mã nhân viên IQC</label>
              <input
                type="text"
                className="font-mono"
                placeholder="NHU1903"
                value={ncrData.iqc_empl}
                onChange={(e) => {
                  const val = e.target.value;
                  ncrData.setIQC_Empl(val);
                  if (val.length >= 7) {
                    ncrData.checkEMPL_NAME(val);
                  }
                }}
              />
              {ncrData.empl_name && (
                <div className="ncr-form-field__lookup">
                  <span className="lookup-tag">{ncrData.empl_name}</span>
                </div>
              )}
            </div>

            <div className="ncr-form-field">
              <label>Ghi chú</label>
              <input
                type="text"
                placeholder="Ghi chú thêm..."
                value={ncrData.remark}
                onChange={(e) => ncrData.setReMark(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Sheet Footer - Action Buttons */}
        <div className="register-sheet__footer">
          <button className="btn-add-row" onClick={ncrData.addRow}>
            <AiOutlinePlus size={16} />
            <span>+ ADD DÒNG</span>
          </button>
          <button className="btn-save-ncr" onClick={ncrData.insertNCRData}>
            <AiOutlineSave size={16} />
            <span>LƯU NCR</span>
          </button>
        </div>
      </div>
    </div>
  );
};

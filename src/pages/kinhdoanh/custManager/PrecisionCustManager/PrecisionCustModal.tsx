import React from "react";
import {
  FiBriefcase,
  FiCheck,
  FiFileText,
  FiMapPin,
  FiPhone,
  FiPlus,
  FiRotateCcw,
  FiUserCheck,
  FiX,
  FiZap,
} from "react-icons/fi";
import { CUST_INFO } from "../interfaces/kdInterface";

interface PrecisionCustModalProps {
  isOpen: boolean;
  onClose: () => void;
  custInfo: CUST_INFO;
  onChangeField: (key: string, value: any) => void;
  onAutoGenCode: (companyType: string) => void;
  onClearForm: () => void;
  onSaveAdd: () => void;
  onSaveEdit: () => void;
  isNewMode: boolean;
}

const PrecisionCustModal: React.FC<PrecisionCustModalProps> = ({
  isOpen,
  onClose,
  custInfo,
  onChangeField,
  onAutoGenCode,
  onClearForm,
  onSaveAdd,
  onSaveEdit,
  isNewMode,
}) => {
  if (!isOpen) return null;

  const isKH = custInfo.CUST_TYPE === "KH";

  return (
    <div className="precision-cust__modalOverlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className={`modal-header ${isKH ? "modal-header--kh" : "modal-header--ncc"}`}>
          <div className="header-title-wrap">
            <div className="icon-wrap">
              {isKH ? <FiBriefcase /> : <FiUserCheck />}
            </div>
            <div>
              <div className="title-text">
                {isNewMode
                  ? "THÊM MỚI HỒ SƠ ĐỐI TÁC (TẠO MÃ MỚI)"
                  : `HỒ SƠ ĐỐI TÁC: ${custInfo.CUST_NAME_KD || custInfo.CUST_CD}`}
              </div>
              <div className="subtitle-text">
                {isKH
                  ? "Khách Hàng (Customer Profile Master) • Quản lý pháp nhân & đơn hàng"
                  : "Nhà Cung Cấp (Vendor Partner Profile) • Quản lý vật tư & chuỗi cung ứng"}
              </div>
            </div>
          </div>

          <div className="header-badges">
            <span className="cust-code-badge">
              {custInfo.CUST_CD ? `MÃ: ${custInfo.CUST_CD}` : "CHƯA TẠO MÃ"}
            </span>
            <button
              type="button"
              className="btn-close-modal"
              onClick={onClose}
              title="Đóng modal"
            >
              <FiX size={15} />
            </button>
          </div>
        </div>

        {/* Modal Body Form - 3 Columns */}
        <div className="modal-content-form">
          <div className="form-section-grid">
            {/* Nhóm 1: Định danh & Pháp lý */}
            <div className="form-group-card">
              <div className="group-title group-title--blue">
                <FiFileText size={13} />
                <span>1. Định Danh & Pháp Nhân</span>
              </div>

              <div className="fields-list">
                <div className="field-item">
                  <label className="field-label">
                    <span>Phân loại đối tác</span>
                    <span className="req">*</span>
                  </label>
                  <div className="input-wrap">
                    <select
                      value={custInfo.CUST_TYPE}
                      onChange={(e) => {
                        const newType = e.target.value;
                        onChangeField("CUST_TYPE", newType);
                        if (isNewMode) onAutoGenCode(newType);
                      }}
                    >
                      <option value="KH">🏢 KH - Khách Hàng</option>
                      <option value="NCC">🏭 NCC - Nhà Cung Cấp (Vendor)</option>
                    </select>
                  </div>
                </div>

                <div className="field-item">
                  <label className="field-label">
                    <span>Mã đối tác (CUST_CD)</span>
                    <span className="req">*</span>
                  </label>
                  <div className="input-wrap">
                    <input
                      type="text"
                      placeholder="VD: KH001, NCC002"
                      value={custInfo.CUST_CD}
                      onChange={(e) => onChangeField("CUST_CD", e.target.value.toUpperCase())}
                      style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 700 }}
                    />
                    <button
                      type="button"
                      className="btn-auto-gen"
                      onClick={() => onAutoGenCode(custInfo.CUST_TYPE)}
                      title="Tự động lấy số thứ tự tiếp theo"
                    >
                      ⚡ Tự sinh
                    </button>
                  </div>
                </div>

                <div className="field-item">
                  <label className="field-label">
                    <span>Tên viết tắt (CUST_NAME_KD)</span>
                    <span className="req">*</span>
                  </label>
                  <div className="input-wrap">
                    <input
                      type="text"
                      placeholder="VD: SAMSUNG SEV, D-MAX"
                      value={custInfo.CUST_NAME_KD}
                      onChange={(e) => onChangeField("CUST_NAME_KD", e.target.value)}
                      style={{ fontWeight: 600 }}
                    />
                  </div>
                </div>

                <div className="field-item">
                  <label className="field-label">Tên pháp nhân đầy đủ</label>
                  <div className="input-wrap">
                    <input
                      type="text"
                      placeholder="Công ty TNHH..."
                      value={custInfo.CUST_NAME}
                      onChange={(e) => onChangeField("CUST_NAME", e.target.value)}
                    />
                  </div>
                </div>

                <div className="field-item">
                  <label className="field-label">Mã số thuế (TAX_NO)</label>
                  <div className="input-wrap">
                    <input
                      type="text"
                      placeholder="Mã số thuế doanh nghiệp"
                      value={custInfo.TAX_NO}
                      onChange={(e) => onChangeField("TAX_NO", e.target.value)}
                      style={{ fontFamily: "JetBrains Mono, monospace" }}
                    />
                  </div>
                </div>

                <div className="field-item">
                  <label className="field-label">Trạng thái hoạt động</label>
                  <div className="input-wrap">
                    <select
                      value={custInfo.USE_YN}
                      onChange={(e) => onChangeField("USE_YN", e.target.value)}
                    >
                      <option value="Y">🟢 USE - Đang giao dịch (Mở)</option>
                      <option value="N">🔴 NOT USE - Tạm khóa / Ngưng GD</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Nhóm 2: Người đại diện & Liên hệ */}
            <div className="form-group-card">
              <div className="group-title group-title--indigo">
                <FiPhone size={13} />
                <span>2. Đại Diện & Liên Hệ</span>
              </div>

              <div className="fields-list">
                <div className="field-item">
                  <label className="field-label">Người đại diện / Giám đốc</label>
                  <div className="input-wrap">
                    <input
                      type="text"
                      placeholder="Tên người đại diện pháp luật"
                      value={custInfo.BOSS_NAME}
                      onChange={(e) => onChangeField("BOSS_NAME", e.target.value)}
                    />
                  </div>
                </div>

                <div className="field-item">
                  <label className="field-label">Hotline / Di động (TEL_NO1)</label>
                  <div className="input-wrap">
                    <input
                      type="text"
                      placeholder="Số điện thoại di động"
                      value={custInfo.TEL_NO1}
                      onChange={(e) => onChangeField("TEL_NO1", e.target.value)}
                      style={{ fontFamily: "JetBrains Mono, monospace" }}
                    />
                  </div>
                </div>

                <div className="field-item">
                  <label className="field-label">Số ĐT cố định (CUST_NUMBER)</label>
                  <div className="input-wrap">
                    <input
                      type="text"
                      placeholder="Số máy bàn văn phòng"
                      value={custInfo.CUST_NUMBER}
                      onChange={(e) => onChangeField("CUST_NUMBER", e.target.value)}
                      style={{ fontFamily: "JetBrains Mono, monospace" }}
                    />
                  </div>
                </div>

                <div className="field-item">
                  <label className="field-label">Số Fax (FAX_NO)</label>
                  <div className="input-wrap">
                    <input
                      type="text"
                      placeholder="Số Fax công ty"
                      value={custInfo.FAX_NO}
                      onChange={(e) => onChangeField("FAX_NO", e.target.value)}
                      style={{ fontFamily: "JetBrains Mono, monospace" }}
                    />
                  </div>
                </div>

                <div className="field-item">
                  <label className="field-label">Email liên hệ / Hóa đơn</label>
                  <div className="input-wrap">
                    <input
                      type="email"
                      placeholder="email@doitac.com"
                      value={custInfo.EMAIL}
                      onChange={(e) => onChangeField("EMAIL", e.target.value)}
                      style={{ fontFamily: "JetBrains Mono, monospace" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Nhóm 3: Địa chỉ & Vận chuyển */}
            <div className="form-group-card">
              <div className="group-title group-title--teal">
                <FiMapPin size={13} />
                <span>3. Địa Chỉ & Vận Chuyển</span>
              </div>

              <div className="fields-list">
                <div className="field-item">
                  <label className="field-label">Địa chỉ trụ sở chính (ADDR1)</label>
                  <div className="input-wrap">
                    <input
                      type="text"
                      placeholder="Trụ sở chính hoặc KCN chính"
                      value={custInfo.CUST_ADDR1}
                      onChange={(e) => onChangeField("CUST_ADDR1", e.target.value)}
                    />
                  </div>
                </div>

                <div className="field-item">
                  <label className="field-label">Địa chỉ nhà máy / Xưởng 2</label>
                  <div className="input-wrap">
                    <input
                      type="text"
                      placeholder="Nhà máy số 2 (nếu có)"
                      value={custInfo.CUST_ADDR2}
                      onChange={(e) => onChangeField("CUST_ADDR2", e.target.value)}
                    />
                  </div>
                </div>

                <div className="field-item">
                  <label className="field-label">Địa chỉ kho / Văn phòng 3</label>
                  <div className="input-wrap">
                    <input
                      type="text"
                      placeholder="Kho trung chuyển (nếu có)"
                      value={custInfo.CUST_ADDR3}
                      onChange={(e) => onChangeField("CUST_ADDR3", e.target.value)}
                    />
                  </div>
                </div>

                <div className="field-item">
                  <label className="field-label">Mã bưu chính (POSTAL)</label>
                  <div className="input-wrap">
                    <input
                      type="text"
                      placeholder="Mã bưu điện"
                      value={custInfo.CUST_POSTAL}
                      onChange={(e) => onChangeField("CUST_POSTAL", e.target.value)}
                      style={{ fontFamily: "JetBrains Mono, monospace" }}
                    />
                  </div>
                </div>

                <div className="field-item">
                  <label className="field-label">Ghi chú nghiệp vụ (REMK)</label>
                  <div className="input-wrap">
                    <textarea
                      placeholder="Ghi chú đặc thù giao nhận, công nợ..."
                      value={custInfo.REMK}
                      onChange={(e) => onChangeField("REMK", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <div className="footer-left">
            <button
              type="button"
              className="btn-modal btn-modal--clear"
              onClick={onClearForm}
              title="Xóa trắng form để nhập từ đầu"
            >
              <FiRotateCcw size={13} />
              <span>Làm mới form</span>
            </button>

            <button
              type="button"
              className="btn-modal btn-modal--clear"
              onClick={() => onAutoGenCode(custInfo.CUST_TYPE)}
              title="Sinh mã tự động theo phân loại"
            >
              <FiZap size={13} />
              <span>Sinh mã tự động</span>
            </button>
          </div>

          <div className="footer-right">
            <button
              type="button"
              className="btn-modal btn-modal--close"
              onClick={onClose}
            >
              <FiX size={14} />
              <span>Đóng</span>
            </button>

            {/* Legacy hiển thị đồng thời cả Add và Update */}
            <button
              type="button"
              className="btn-modal btn-modal--add"
              onClick={onSaveAdd}
              title="Lưu hồ sơ đối tác mới vào cơ sở dữ liệu"
            >
              <FiPlus size={15} />
              <span>+ Thêm Mới Đối Tác</span>
            </button>

            <button
              type="button"
              className="btn-modal btn-modal--update"
              onClick={onSaveEdit}
              title="Cập nhật thay đổi hồ sơ đối tác"
            >
              <FiCheck size={15} />
              <span>Cập Nhật Thông Tin</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionCustModal);

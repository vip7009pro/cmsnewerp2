import React, { memo } from "react";
import { FiX, FiEdit, FiSave, FiRefreshCw } from "react-icons/fi";
import DropdownSearch from "../../../../components/MyDropDownSearch/DropdownSearch";
import { CodeListData, CustomerListData } from "../../interfaces/kdInterface";

interface Props {
  open: boolean;
  onClose: () => void;
  selectedID: string;
  customerList: CustomerListData[];
  selectedCust_CD: CustomerListData | null;
  onSelectCustomer: (cust: CustomerListData) => void;
  codeList: CodeListData[];
  selectedCode: CodeListData | null;
  onSelectCode: (code: CodeListData) => void;
  newphanloai: string;
  setNewPhanLoai: (val: string) => void;
  loaisx: string;
  setLoaiSX: (val: string) => void;
  loaixh: string;
  setLoaiXH: (val: string) => void;
  deliverydate: string;
  setNewDeliveryDate: (val: string) => void;
  newycsxqty: number;
  setNewYcsxQty: (val: number) => void;
  newycsxremark: string;
  setNewYcsxRemark: (val: string) => void;
  onUpdate: () => void;
  onClear: () => void;
}

const PrecisionYCSXEditModal: React.FC<Props> = ({
  open,
  onClose,
  selectedID,
  customerList,
  selectedCust_CD,
  onSelectCustomer,
  codeList,
  selectedCode,
  onSelectCode,
  newphanloai,
  setNewPhanLoai,
  loaisx,
  setLoaiSX,
  loaixh,
  setLoaiXH,
  deliverydate,
  setNewDeliveryDate,
  newycsxqty,
  setNewYcsxQty,
  newycsxremark,
  setNewYcsxRemark,
  onUpdate,
  onClear,
}) => {
  if (!open) return null;

  return (
    <div className="precision-ycsx-modal-backdrop" onClick={onClose}>
      <div
        className="precision-ycsx-modal-container"
        style={{ maxWidth: 800 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="title-group">
            <div className="badge-icon">
              <FiEdit />
            </div>
            <div>
              <h3>CẬP NHẬT YÊU CẦU SẢN XUẤT (SỬA YCSX)</h3>
              <p>Mã YCSX: <strong style={{ color: "var(--brand-primary)" }}>{selectedID || "Chưa chọn"}</strong></p>
            </div>
          </div>
          <button className="btn-close" onClick={onClose} title="Đóng modal">
            <FiX />
          </button>
        </div>

        {/* Form Body */}
        <div className="modal-body" style={{ padding: "20px" }}>
          <div className="form-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
            {/* Mã YCSX (Readonly) */}
            <div className="field-group">
              <label>Mã YCSX (PROD_REQUEST_NO):</label>
              <input
                type="text"
                readOnly
                value={selectedID}
                style={{
                  backgroundColor: "var(--bg-card)",
                  color: "var(--brand-primary)",
                  fontWeight: 700,
                  cursor: "not-allowed",
                }}
              />
            </div>

            {/* Khách hàng */}
            <div className="field-group">
              <label>Khách hàng *:</label>
              <DropdownSearch
                label="Chọn khách hàng"
                placeholder="Tìm khách hàng..."
                suggestData={customerList}
                selectedObj={selectedCust_CD}
                setSelectedObj={onSelectCustomer}
                primaryKey="CUST_CD"
                searchFields={["CUST_CD", "CUST_NAME_KD"]}
                displayFormat="CUST_CD-CUST_NAME_KD"
              />
            </div>

            {/* Mã sản phẩm */}
            <div className="field-group" style={{ gridColumn: "span 2" }}>
              <label>Mã Code / Tên sản phẩm *:</label>
              <DropdownSearch
                label="Chọn mã code"
                placeholder="Tìm mã sản phẩm (G_CODE, G_NAME_KD)..."
                suggestData={codeList}
                selectedObj={selectedCode}
                setSelectedObj={onSelectCode}
                primaryKey="G_CODE"
                searchFields={["G_CODE", "G_NAME_KD", "G_NAME"]}
                displayFormat="G_CODE-G_NAME_KD"
              />
            </div>

            {/* Số lượng yêu cầu */}
            <div className="field-group">
              <label>Số lượng yêu cầu (EA) *:</label>
              <input
                type="number"
                min={0}
                value={newycsxqty}
                onChange={(e) => setNewYcsxQty(Number(e.target.value))}
                placeholder="Nhập số lượng..."
                style={{ fontWeight: 700 }}
              />
            </div>

            {/* Ngày giao hàng */}
            <div className="field-group">
              <label>Ngày giao hàng (DELIVERY_DT) *:</label>
              <input
                type="date"
                value={deliverydate ? deliverydate.slice(0, 10) : ""}
                onChange={(e) => setNewDeliveryDate(e.target.value)}
              />
            </div>

            {/* Phân loại hàng */}
            <div className="field-group">
              <label>Phân loại hàng:</label>
              <select
                value={newphanloai}
                onChange={(e) => setNewPhanLoai(e.target.value)}
              >
                <option value="TT">TT (Thông thường)</option>
                <option value="M">M (Mẫu)</option>
                <option value="F">F (First LOT)</option>
                <option value="T">T (Tạm thời)</option>
              </select>
            </div>

            {/* Loại SX */}
            <div className="field-group">
              <label>Loại sản xuất (CODE_55):</label>
              <select
                value={loaisx}
                onChange={(e) => setLoaiSX(e.target.value)}
              >
                <option value="01">01 - Sản xuất thông thường</option>
                <option value="02">02 - Sản xuất mẫu</option>
                <option value="03">03 - Sản xuất bù</option>
                <option value="04">04 - Tách LOT SX</option>
              </select>
            </div>

            {/* Loại XH */}
            <div className="field-group">
              <label>Loại xuất hàng (CODE_50):</label>
              <select
                value={loaixh}
                onChange={(e) => setLoaiXH(e.target.value)}
              >
                <option value="01">01 - Xuất khẩu</option>
                <option value="02">02 - Nội địa</option>
              </select>
            </div>

            {/* Ghi chú */}
            <div className="field-group" style={{ gridColumn: "span 2" }}>
              <label>Ghi chú (REMARK):</label>
              <input
                type="text"
                value={newycsxremark}
                onChange={(e) => setNewYcsxRemark(e.target.value)}
                placeholder="Ghi chú yêu cầu sản xuất..."
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <div className="hint-text">
            <span>* Lưu ý: Cập nhật yêu cầu sản xuất yêu cầu quyền Kinh doanh/Quản trị viên.</span>
          </div>
          <div className="action-btns">
            <button className="btn-secondary" onClick={onClear} title="Đặt lại form">
              <FiRefreshCw /> Reset
            </button>
            <button className="btn-secondary" onClick={onClose}>
              Đóng
            </button>
            <button className="btn-primary" onClick={onUpdate}>
              <FiSave /> Lưu cập nhật
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(PrecisionYCSXEditModal);

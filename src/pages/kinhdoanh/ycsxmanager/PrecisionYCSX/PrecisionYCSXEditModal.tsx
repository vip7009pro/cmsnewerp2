import React, { memo } from "react";
import { FiX, FiEdit, FiSave, FiRefreshCw } from "react-icons/fi";
import { Autocomplete, TextField, createFilterOptions } from "@mui/material";
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
  isCMS?: boolean;
}

const filterCustomerOptions = createFilterOptions<CustomerListData>({
  matchFrom: "any",
  limit: 100,
  stringify: (opt: CustomerListData) =>
    `${opt.CUST_CD || ""} ${opt.CUST_NAME_KD || ""} ${opt.CUST_NAME || ""}`,
});

const filterCodeOptions = createFilterOptions<CodeListData>({
  matchFrom: "any",
  limit: 100,
  stringify: (opt: CodeListData) =>
    `${opt.G_CODE || ""} ${opt.G_NAME_KD || ""} ${opt.G_NAME || ""}`,
});

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
  isCMS = true,
}) => {
  if (!open) return null;

  return (
    <div className="precision-ycsx-modal-backdrop" onClick={onClose}>
      <div
        className="precision-ycsx-modal-container"
        style={{ maxWidth: 920, width: "95vw" }}
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
              <p>
                Mã YCSX: <strong style={{ color: "#2563eb" }}>{selectedID || "Chưa chọn"}</strong>
              </p>
            </div>
          </div>
          <button className="btn-close" onClick={onClose} title="Đóng modal">
            <FiX />
          </button>
        </div>

        {/* Form Body - 3 Cột Cân Đối Chuẩn Stitch */}
        <div className="modal-body" style={{ padding: "16px 20px" }}>
          <div className="precision-ycsx__modalGridForm" style={{ padding: 0 }}>
            {/* Hàng 1: Mã YCSX, Khách hàng, Mã sản phẩm */}
            <div className="precision-ycsx__modalField">
              <label>Mã YCSX (PROD_REQUEST_NO):</label>
              <input
                type="text"
                readOnly
                value={selectedID}
                style={{
                  backgroundColor: "#f8fafc",
                  color: "#2563eb",
                  fontWeight: 700,
                  cursor: "not-allowed",
                  border: "1px solid #cbd5e1",
                }}
              />
            </div>

            <div className="precision-ycsx__modalField">
              <label>Khách hàng *:</label>
              <Autocomplete
                size="small"
                options={customerList}
                filterOptions={filterCustomerOptions}
                isOptionEqualToValue={(opt, val) => opt?.CUST_CD === val?.CUST_CD}
                getOptionLabel={(opt) => {
                  if (!opt) return "";
                  if (typeof opt === "string") return opt;
                  return `${opt.CUST_CD || ""}: ${opt.CUST_NAME_KD || opt.CUST_NAME || ""}`;
                }}
                value={selectedCust_CD}
                onChange={(_, val) => onSelectCustomer(val as CustomerListData)}
                openOnFocus
                autoHighlight
                clearOnEscape
                slotProps={{
                  popper: { sx: { zIndex: 120000 } },
                }}
                noOptionsText="Không tìm thấy khách hàng"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    placeholder="Chọn hoặc gõ mã KH..."
                    variant="outlined"
                  />
                )}
              />
            </div>

            <div className="precision-ycsx__modalField">
              <label>Mã sản phẩm (G_CODE) *:</label>
              <Autocomplete
                size="small"
                options={codeList}
                filterOptions={filterCodeOptions}
                isOptionEqualToValue={(opt, val) => opt?.G_CODE === val?.G_CODE}
                getOptionLabel={(opt) => {
                  if (!opt) return "";
                  if (typeof opt === "string") return opt;
                  return `${opt.G_CODE || ""}: ${opt.G_NAME_KD || opt.G_NAME || ""}`;
                }}
                value={selectedCode}
                onChange={(_, val) => onSelectCode(val as CodeListData)}
                openOnFocus
                autoHighlight
                clearOnEscape
                slotProps={{
                  popper: { sx: { zIndex: 120000 } },
                }}
                noOptionsText="Không tìm thấy mã sản phẩm"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    placeholder="Chọn hoặc gõ G_CODE, G_NAME_KD..."
                    variant="outlined"
                  />
                )}
              />
            </div>

            {/* Hàng 2: Số lượng, Ngày giao, Phân loại hàng */}
            <div className="precision-ycsx__modalField">
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

            <div className="precision-ycsx__modalField">
              <label>Ngày giao hàng (DELIVERY_DT) *:</label>
              <input
                type="date"
                value={deliverydate ? deliverydate.slice(0, 10) : ""}
                onChange={(e) => setNewDeliveryDate(e.target.value)}
              />
            </div>

            <div className="precision-ycsx__modalField">
              <label>Phân loại hàng:</label>
              <select
                value={newphanloai}
                onChange={(e) => setNewPhanLoai(e.target.value)}
              >
                <option value="TT">Hàng Thường (TT)</option>
                <option value="SP">Sample sang FL (SP)</option>
                <option value="RB">Ribbon (RB)</option>
                <option value="HQ">Hàn Quốc (HQ)</option>
                <option value="VN">Việt Nam (VN)</option>
                <option value="AM">Amazon (AM)</option>
                <option value="DL">Đổi LOT (DL)</option>
                <option value="M4">NM4 (M4)</option>
                <option value="GC">Hàng Gia Công (GC)</option>
                <option value="TM">Hàng Thương Mại (TM)</option>
                {!isCMS && <option value="GD">Gia Công Đặc Biệt (GD)</option>}
              </select>
            </div>

            {/* Hàng 3: Loại SX, Loại XH, Ghi chú */}
            <div className="precision-ycsx__modalField">
              <label>Loại sản xuất (CODE_55):</label>
              <select
                value={loaisx}
                onChange={(e) => setLoaiSX(e.target.value)}
              >
                <option value="01">01 - Thông Thường</option>
                <option value="02">02 - SDI</option>
                <option value="03">03 - ETC</option>
                <option value="04">04 - SAMPLE</option>
              </select>
            </div>

            <div className="precision-ycsx__modalField">
              <label>Loại xuất hàng (CODE_50):</label>
              <select
                value={loaixh}
                onChange={(e) => setLoaiXH(e.target.value)}
              >
                <option value="01">01 - GC</option>
                <option value="02">02 - SK</option>
                <option value="03">03 - KD</option>
                <option value="04">04 - VN</option>
                <option value="05">05 - SAMPLE</option>
                <option value="06">06 - Vải bạc 4</option>
                <option value="07">07 - ETC</option>
              </select>
            </div>

            <div className="precision-ycsx__modalField">
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

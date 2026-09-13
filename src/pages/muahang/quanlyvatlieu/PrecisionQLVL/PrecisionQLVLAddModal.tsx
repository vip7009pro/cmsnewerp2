import React from "react";
import { Autocomplete, Button, IconButton, TextField, createFilterOptions } from "@mui/material";
import { FiX, FiEdit3, FiPlusCircle } from "react-icons/fi";
import CustomDialog from "../../../../components/Dialog/CustomDialog";
import { checkBP } from "../../../../api/services/permissionService";
import { getUserData } from "../../../../api/Api";
import { FSC_LIST_DATA, MATERIAL_TABLE_DATA } from "../../interfaces/muaInterface";
import { CustomerListData } from "../../../kinhdoanh/interfaces/kdInterface";

interface PrecisionQLVLAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  materialInfo: MATERIAL_TABLE_DATA;
  onChangeInfo: (keyname: string, value: any) => void;
  customerList: CustomerListData[];
  fscList: FSC_LIST_DATA[];
  onAdd: () => void;
  onUpdate: () => void;
  company: string;
}

const filterOptions = createFilterOptions({
  matchFrom: "any",
  limit: 100,
});

const PrecisionQLVLAddModal: React.FC<PrecisionQLVLAddModalProps> = ({
  isOpen,
  onClose,
  materialInfo,
  onChangeInfo,
  customerList,
  fscList,
  onAdd,
  onUpdate,
  company,
}) => {
  const currentVendor = customerList.find((e) => e.CUST_CD === materialInfo?.CUST_CD);
  const isUpdateMode = Boolean(materialInfo?.M_ID && materialInfo.M_ID > 0);

  return (
    <CustomDialog
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {isUpdateMode ? (
              <FiEdit3 size={16} style={{ color: "#fbbf24" }} />
            ) : (
              <FiPlusCircle size={16} style={{ color: "#38bdf8" }} />
            )}
            <span>
              {isUpdateMode
                ? `Cập Nhật Vật Liệu • #${materialInfo.M_ID} (${materialInfo.M_NAME || "Mã"})`
                : "Thêm Mới Vật Liệu Vào Danh Mục"}
            </span>
          </div>
          <IconButton
            size="small"
            onClick={onClose}
            sx={{ color: "#ffffff", padding: "2px", "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" } }}
            title="Đóng cửa sổ"
          >
            <FiX size={16} />
          </IconButton>
        </div>
      }
      dialogClassName="qlvlMaterialDialog"
      content={
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", padding: "12px 4px", fontSize: 12 }}>
          {/* Cột Trái */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div>
              <label style={{ display: "block", fontWeight: 700, color: "#334155", marginBottom: 3 }}>
                Mã Vật Liệu <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Nhập mã vật liệu (VD: NY-PET-01)"
                value={materialInfo?.M_NAME || ""}
                onChange={(e) => onChangeInfo("M_NAME", e.target.value)}
                style={{
                  width: "100%",
                  height: 30,
                  padding: "0 8px",
                  borderRadius: 5,
                  border: "1px solid #cbd5e1",
                  fontSize: 12,
                  fontFamily: "JetBrains Mono",
                  fontWeight: 600,
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontWeight: 700, color: "#334155", marginBottom: 3 }}>
                Nhà Cung Cấp (Vendor)
              </label>
              <Autocomplete
                size="small"
                disablePortal
                disableClearable
                options={customerList}
                filterOptions={filterOptions}
                isOptionEqualToValue={(option: any, value: any) => option.CUST_CD === value.CUST_CD}
                getOptionLabel={(option: any) =>
                  `${option.CUST_CD ? option.CUST_NAME_KD || "" : "SSJ"}${option.CUST_CD || "0049"}`
                }
                value={
                  currentVendor || {
                    CUST_CD: company === "CMS" ? "0049" : "KH000",
                    CUST_NAME: company === "CMS" ? "SSJ" : "PVN",
                    CUST_NAME_KD: company === "CMS" ? "SSJ" : "PVN",
                  }
                }
                onChange={(_, newValue: any) => {
                  onChangeInfo("CUST_CD", newValue?.CUST_CD || "");
                }}
                renderInput={(params) => (
                  <TextField {...params} sx={{ "& .MuiInputBase-root": { height: 32, fontSize: "0.75rem" } }} />
                )}
              />
            </div>

            <div>
              <label style={{ display: "block", fontWeight: 700, color: "#334155", marginBottom: 3 }}>
                Mô Tả Vật Liệu (DESCR)
              </label>
              <input
                type="text"
                placeholder="Mô tả quy cách, ứng dụng..."
                value={materialInfo?.DESCR || ""}
                onChange={(e) => onChangeInfo("DESCR", e.target.value)}
                style={{
                  width: "100%",
                  height: 30,
                  padding: "0 8px",
                  borderRadius: 5,
                  border: "1px solid #cbd5e1",
                  fontSize: 12,
                }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div>
                <label style={{ display: "block", fontWeight: 700, color: "#334155", marginBottom: 3 }}>
                  Open Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={materialInfo?.SSPRICE ?? ""}
                  onChange={(e) => onChangeInfo("SSPRICE", parseFloat(e.target.value) || 0)}
                  style={{
                    width: "100%",
                    height: 30,
                    padding: "0 8px",
                    borderRadius: 5,
                    border: "1px solid #cbd5e1",
                    fontSize: 12,
                    fontFamily: "JetBrains Mono",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 700, color: "#334155", marginBottom: 3 }}>
                  Origin Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={materialInfo?.CMSPRICE ?? ""}
                  onChange={(e) => onChangeInfo("CMSPRICE", parseFloat(e.target.value) || 0)}
                  style={{
                    width: "100%",
                    height: 30,
                    padding: "0 8px",
                    borderRadius: 5,
                    border: "1px solid #cbd5e1",
                    fontSize: 12,
                    fontFamily: "JetBrains Mono",
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontWeight: 700, color: "#334155", marginBottom: 3 }}>
                Phí Xẻ Slitting ($)
              </label>
              <input
                type="number"
                step="0.001"
                placeholder="0.000"
                value={materialInfo?.SLITTING_PRICE ?? ""}
                onChange={(e) => onChangeInfo("SLITTING_PRICE", parseFloat(e.target.value) || 0)}
                style={{
                  width: "100%",
                  height: 30,
                  padding: "0 8px",
                  borderRadius: 5,
                  border: "1px solid #cbd5e1",
                  fontSize: 12,
                  fontFamily: "JetBrains Mono",
                }}
              />
            </div>
          </div>

          {/* Cột Phải */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div>
                <label style={{ display: "block", fontWeight: 700, color: "#334155", marginBottom: 3 }}>
                  Master Width (mm)
                </label>
                <input
                  type="number"
                  placeholder="VD: 1050"
                  value={materialInfo?.MASTER_WIDTH ?? ""}
                  onChange={(e) => onChangeInfo("MASTER_WIDTH", parseFloat(e.target.value) || 0)}
                  style={{
                    width: "100%",
                    height: 30,
                    padding: "0 8px",
                    borderRadius: 5,
                    border: "1px solid #cbd5e1",
                    fontSize: 12,
                    fontFamily: "JetBrains Mono",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 700, color: "#334155", marginBottom: 3 }}>
                  Roll Length (m)
                </label>
                <input
                  type="number"
                  placeholder="VD: 500"
                  value={materialInfo?.ROLL_LENGTH ?? ""}
                  onChange={(e) => onChangeInfo("ROLL_LENGTH", parseFloat(e.target.value) || 0)}
                  style={{
                    width: "100%",
                    height: 30,
                    padding: "0 8px",
                    borderRadius: 5,
                    border: "1px solid #cbd5e1",
                    fontSize: 12,
                    fontFamily: "JetBrains Mono",
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontWeight: 700, color: "#334155", marginBottom: 3 }}>
                Hạn Sử Dụng (Tháng)
              </label>
              <input
                type="text"
                placeholder="VD: 12 hoặc 24"
                value={materialInfo?.EXP_DATE || ""}
                onChange={(e) => onChangeInfo("EXP_DATE", e.target.value)}
                style={{
                  width: "100%",
                  height: 30,
                  padding: "0 8px",
                  borderRadius: 5,
                  border: "1px solid #cbd5e1",
                  fontSize: 12,
                }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 8 }}>
              <div>
                <label style={{ display: "block", fontWeight: 700, color: "#334155", marginBottom: 3 }}>
                  Chuẩn FSC
                </label>
                <select
                  value={materialInfo?.FSC || "N"}
                  onChange={(e) => {
                    const isY = e.target.value === "Y";
                    onChangeInfo("FSC", e.target.value);
                    if (!isY) onChangeInfo("FSC_CODE", "01");
                  }}
                  style={{
                    width: "100%",
                    height: 30,
                    padding: "0 8px",
                    borderRadius: 5,
                    border: "1px solid #cbd5e1",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  <option value="Y">Y (Đạt FSC)</option>
                  <option value="N">N (Không)</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 700, color: "#334155", marginBottom: 3 }}>
                  Loại FSC Code
                </label>
                <select
                  disabled={materialInfo?.FSC === "N"}
                  value={materialInfo?.FSC_CODE || "01"}
                  onChange={(e) => onChangeInfo("FSC_CODE", e.target.value)}
                  style={{
                    width: "100%",
                    height: 30,
                    padding: "0 8px",
                    borderRadius: 5,
                    border: "1px solid #cbd5e1",
                    fontSize: 12,
                    backgroundColor: materialInfo?.FSC === "N" ? "#f1f5f9" : "#ffffff",
                  }}
                >
                  {fscList.map((ele: FSC_LIST_DATA, index: number) => (
                    <option key={index} value={ele.FSC_CODE}>
                      {ele.FSC_NAME} ({ele.FSC_CODE})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginTop: 8 }}>
              <label
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                  padding: "6px 12px",
                  borderRadius: 6,
                  backgroundColor: materialInfo?.USE_YN !== "N" ? "#ecfdf5" : "#fff1f2",
                  border: `1px solid ${materialInfo?.USE_YN !== "N" ? "#a7f3d0" : "#fecdd3"}`,
                }}
              >
                <input
                  type="checkbox"
                  checked={materialInfo?.USE_YN !== "N"}
                  onChange={(e) => onChangeInfo("USE_YN", e.target.checked ? "Y" : "N")}
                  style={{ width: 15, height: 15 }}
                />
                <span style={{ fontWeight: 700, color: materialInfo?.USE_YN !== "N" ? "#047857" : "#be123c" }}>
                  {materialInfo?.USE_YN !== "N" ? "ĐANG ÁP DỤNG (USE)" : "ĐANG KHÓA (LOCKED)"}
                </span>
              </label>
            </div>
          </div>
        </div>
      }
      actions={
        <div style={{ display: "flex", gap: 8, padding: "8px 16px" }}>
          <Button
            variant="contained"
            size="small"
            sx={{
              fontSize: "0.75rem",
              fontWeight: 700,
              backgroundColor: "#2563eb",
              "&:hover": { backgroundColor: "#1d4ed8" },
            }}
            onClick={() => {
              checkBP(getUserData(), ["MUA", "KETOAN"], ["ALL"], ["ALL"], () => {
                onAdd();
              });
            }}
          >
            Thêm Mới (Add)
          </Button>

          <Button
            variant="contained"
            size="small"
            sx={{
              fontSize: "0.75rem",
              fontWeight: 700,
              backgroundColor: "#f59e0b",
              "&:hover": { backgroundColor: "#d97706" },
            }}
            onClick={() => {
              checkBP(getUserData(), ["MUA", "KETOAN"], ["ALL"], ["ALL"], () => {
                onUpdate();
              });
            }}
          >
            Cập Nhật (Update)
          </Button>
        </div>
      }
    />
  );
};

export default React.memo(PrecisionQLVLAddModal);

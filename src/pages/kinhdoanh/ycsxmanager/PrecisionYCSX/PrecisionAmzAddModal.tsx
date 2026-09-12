import React, { memo } from "react";
import { FiX, FiUploadCloud, FiCheckCircle, FiTrash2, FiInfo, FiLayers, FiFileText } from "react-icons/fi";
import { AiFillAmazonCircle } from "react-icons/ai";
import AGTable from "../../../../components/DataTable/AGTable";
import { getAmazonUploadColumns } from "./PrecisionYCSXColumns";

interface Props {
  open: boolean;
  onClose: () => void;
  prodrequestno: string;
  setProdRequestNo: (v: string) => void;
  id_congviec: string;
  setID_CongViec: (v: string) => void;
  codeKD: string;
  codeCMS: string;
  cavityAmazon: number;
  prod_model: string;
  amz_PL_HANG: string;
  onFindAmazonCodeInfo: (ycsxNo: string) => void;
  uploadExcelJson: any[];
  onUploadFileAmazon: (e: any) => void;
  onUpAmazonData: () => void;
  onCheckDuplicateAMZ: () => void;
  onClearExcel: () => void;
  progressValue: number;
}

const PrecisionAmzAddModal: React.FC<Props> = ({
  open,
  onClose,
  prodrequestno,
  setProdRequestNo,
  id_congviec,
  setID_CongViec,
  codeKD,
  codeCMS,
  cavityAmazon,
  prod_model,
  amz_PL_HANG,
  onFindAmazonCodeInfo,
  uploadExcelJson,
  onUploadFileAmazon,
  onUpAmazonData,
  onCheckDuplicateAMZ,
  onClearExcel,
  progressValue,
}) => {
  if (!open) return null;

  const amzColumns = getAmazonUploadColumns();

  return (
    <div className="precision-ycsx-modal-backdrop" onClick={onClose}>
      <div
        className="precision-ycsx-modal-container"
        style={{ maxWidth: 1000, width: "95vw", height: "88vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="title-group">
            <div className="badge-icon" style={{ background: "rgba(255, 153, 0, 0.15)", color: "#ff9900" }}>
              <AiFillAmazonCircle style={{ fontSize: "22px" }} />
            </div>
            <div>
              <h3>NHẬP DỮ LIỆU AMAZON HÀNG LOẠT (AMZ BULK UPLOAD)</h3>
              <p>Hệ thống tự động phân tách lô 1.000 dòng và kiểm tra tính toàn vẹn dữ liệu barcode</p>
            </div>
          </div>
          <button className="btn-close" onClick={onClose} title="Đóng modal">
            <FiX />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Form Criteria */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1.2fr 2fr",
              gap: "14px",
              padding: "14px",
              backgroundColor: "var(--bg-card)",
              borderRadius: "6px",
              border: "1px solid var(--border-color)",
            }}
          >
            {/* Số Yêu Cầu */}
            <div className="field-group">
              <label style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
                Số Yêu Cầu (YCSX No) *:
              </label>
              <input
                type="text"
                placeholder="Ví dụ: 1F80008..."
                value={prodrequestno}
                onChange={(e) => {
                  setProdRequestNo(e.target.value);
                  onFindAmazonCodeInfo(e.target.value);
                }}
                style={{ fontWeight: 700, color: "var(--brand-primary)" }}
              />
            </div>

            {/* ID Công Việc */}
            <div className="field-group">
              <label style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
                ID Công Việc (Job ID) *:
              </label>
              <input
                type="text"
                placeholder="Ví dụ: CG7607845474986040938..."
                value={id_congviec}
                onChange={(e) => setID_CongViec(e.target.value)}
              />
            </div>

            {/* Thông tin giải mã YCSX */}
            <div
              style={{
                backgroundColor: "var(--bg-body)",
                borderRadius: "4px",
                padding: "8px 12px",
                border: "1px dashed var(--border-color)",
                fontSize: "11px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "6px",
                alignContent: "center",
              }}
            >
              <div>
                <span style={{ color: "var(--text-secondary)" }}>Code KD: </span>
                <strong style={{ color: "var(--success)" }}>{codeKD || "---"}</strong>
              </div>
              <div>
                <span style={{ color: "var(--text-secondary)" }}>Code ERP: </span>
                <strong style={{ color: "var(--brand-primary)" }}>{codeCMS || "---"}</strong>
              </div>
              <div>
                <span style={{ color: "var(--text-secondary)" }}>Model: </span>
                <strong>{prod_model || "---"}</strong>
              </div>
              <div>
                <span style={{ color: "var(--text-secondary)" }}>Cavity AMZ: </span>
                <strong style={{ color: "var(--warning)" }}>{cavityAmazon || 0}</strong>
                {amz_PL_HANG && (
                  <span style={{ marginLeft: 6, fontSize: 10, color: "var(--text-secondary)" }}>
                    ({amz_PL_HANG})
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* File Upload Banner & Actions */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 12px",
              backgroundColor: "#ffffff",
              borderRadius: 6,
              border: "1px solid #e2e8f0",
              gap: 10,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <label
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 14px",
                  borderRadius: 4,
                  border: "1px solid #cbd5e1",
                  cursor: "pointer",
                  fontSize: 11.5,
                  fontWeight: 600,
                  backgroundColor: "#f8fafc",
                  color: "#0f172a",
                  transition: "all 0.15s ease",
                }}
              >
                <FiUploadCloud style={{ fontSize: 15, color: "#2563eb" }} /> Chọn File Excel AMZ
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  style={{ display: "none" }}
                  onChange={onUploadFileAmazon}
                />
              </label>

              <span style={{ fontSize: 11.5, color: "#64748b" }}>
                Tổng số dòng đã nạp:{" "}
                <strong style={{ color: uploadExcelJson.length > 0 ? "#2563eb" : "#0f172a", fontSize: 12 }}>
                  {uploadExcelJson.length.toLocaleString()}
                </strong>
              </span>

              {progressValue > 0 && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: 10,
                    backgroundColor: "#d1fae5",
                    color: "#059669",
                  }}
                >
                  Đã tải lên: {progressValue.toLocaleString()} / {uploadExcelJson.length.toLocaleString()}
                </span>
              )}
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={onCheckDuplicateAMZ}
                disabled={uploadExcelJson.length === 0}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                  fontSize: 11.5,
                  fontWeight: 600,
                  borderRadius: 4,
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  color: uploadExcelJson.length === 0 ? "#94a3b8" : "#475569",
                  cursor: uploadExcelJson.length === 0 ? "not-allowed" : "pointer",
                }}
              >
                <FiCheckCircle size={14} style={{ color: "#10b981" }} /> 1. Kiểm tra trùng
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={onClearExcel}
                disabled={uploadExcelJson.length === 0}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                  fontSize: 11.5,
                  fontWeight: 600,
                  borderRadius: 4,
                  border: "1px solid #fecdd3",
                  background: "#ffffff",
                  color: uploadExcelJson.length === 0 ? "#94a3b8" : "#e11d48",
                  cursor: uploadExcelJson.length === 0 ? "not-allowed" : "pointer",
                }}
              >
                <FiTrash2 size={14} /> Xóa bảng
              </button>

              <button
                type="button"
                className="btn-primary"
                onClick={onUpAmazonData}
                disabled={uploadExcelJson.length === 0}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 16px",
                  fontSize: 11.5,
                  fontWeight: 700,
                  borderRadius: 4,
                  border: "none",
                  cursor: uploadExcelJson.length === 0 ? "not-allowed" : "pointer",
                  background: uploadExcelJson.length === 0 ? "#cbd5e1" : "#2563eb",
                  color: "#ffffff",
                }}
              >
                <FiUploadCloud size={14} /> 2. Bắt đầu Upload Dữ liệu
              </button>
            </div>
          </div>

          {/* Table Preview: Bảng xem trước dữ liệu AMZ chuẩn Stitch */}
          <div className="modal-agtable-wrapper" style={{ flex: 1, minHeight: 380, display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "6px 12px",
                background: "#f8fafc",
                borderBottom: "1px solid #e2e8f0",
                fontSize: 11.5,
                fontWeight: 700,
                color: "#1e293b",
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <FiFileText style={{ color: "#2563eb" }} />
                <span>BẢNG XEM TRƯỚC DỮ LIỆU AMAZON</span>
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    background: uploadExcelJson.length > 0 ? "#2563eb" : "#94a3b8",
                    color: "#ffffff",
                    padding: "1px 7px",
                    borderRadius: 10,
                  }}
                >
                  {uploadExcelJson.length.toLocaleString()} dòng
                </span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 500, color: "#64748b" }}>
                Tự động kiểm tra trùng & phân tách lô 1.000 dòng khi nạp
              </span>
            </div>
            <div style={{ flex: 1, minHeight: 0, height: "100%" }}>
              <AGTable
                data={uploadExcelJson}
                columns={amzColumns}
                showFilter={true}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <div className="hint-text">
            <span>* Lưu ý: Tên file phải chứa chính xác Model sản phẩm và ID công việc để đảm bảo chống nhầm lẫn.</span>
          </div>
          <div className="action-btns">
            <button className="btn-secondary" onClick={onClose}>
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(PrecisionAmzAddModal);

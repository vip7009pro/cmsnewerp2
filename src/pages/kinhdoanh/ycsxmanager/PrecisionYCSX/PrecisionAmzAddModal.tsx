import React, { memo } from "react";
import { FiX, FiUploadCloud, FiCheckCircle, FiTrash2, FiInfo, FiLayers } from "react-icons/fi";
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
              padding: "10px 14px",
              backgroundColor: "var(--bg-card)",
              borderRadius: "6px",
              border: "1px solid var(--border-color)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <label
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 14px",
                  borderRadius: "4px",
                  border: "1px solid var(--border-color)",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: 600,
                  backgroundColor: "var(--bg-body)",
                  color: "var(--text-primary)",
                }}
              >
                <FiUploadCloud style={{ fontSize: "16px", color: "var(--brand-primary)" }} /> Chọn File Excel AMZ
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  style={{ display: "none" }}
                  onChange={onUploadFileAmazon}
                />
              </label>

              <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                Tổng số dòng đã nạp:{" "}
                <strong style={{ color: uploadExcelJson.length > 0 ? "var(--brand-primary)" : "inherit" }}>
                  {uploadExcelJson.length.toLocaleString()}
                </strong>
              </span>

              {progressValue > 0 && (
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(16, 185, 129, 0.15)",
                    color: "var(--success)",
                  }}
                >
                  Đã tải lên: {progressValue.toLocaleString()} / {uploadExcelJson.length.toLocaleString()}
                </span>
              )}
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                className="btn-secondary"
                onClick={onCheckDuplicateAMZ}
                disabled={uploadExcelJson.length === 0}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 12px",
                  fontSize: "12px",
                  borderRadius: "4px",
                  border: "1px solid var(--border-color)",
                  cursor: uploadExcelJson.length === 0 ? "not-allowed" : "pointer",
                }}
              >
                <FiCheckCircle /> Kiểm tra trùng
              </button>

              <button
                className="btn-secondary"
                onClick={onClearExcel}
                disabled={uploadExcelJson.length === 0}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 12px",
                  fontSize: "12px",
                  borderRadius: "4px",
                  border: "1px solid var(--border-color)",
                  cursor: uploadExcelJson.length === 0 ? "not-allowed" : "pointer",
                }}
              >
                <FiTrash2 /> Xóa bảng
              </button>

              <button
                className="btn-primary"
                onClick={onUpAmazonData}
                disabled={uploadExcelJson.length === 0}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 16px",
                  fontSize: "12px",
                  borderRadius: "4px",
                  fontWeight: 600,
                  cursor: uploadExcelJson.length === 0 ? "not-allowed" : "pointer",
                  background: uploadExcelJson.length === 0 ? "var(--border-color)" : "var(--success)",
                }}
              >
                <FiUploadCloud /> Bắt đầu Upload Dữ liệu
              </button>
            </div>
          </div>

          {/* Table Preview */}
          <div
            style={{
              flex: 1,
              minHeight: "260px",
              border: "1px solid var(--border-color)",
              borderRadius: "6px",
              overflow: "hidden",
            }}
          >
            <AGTable
              data={uploadExcelJson}
              columns={amzColumns}
              showFilter={false}
              toolbar={
                <div style={{ fontSize: "11px", fontWeight: 600, padding: "4px 8px" }}>
                  Bảng xem trước dữ liệu AMZ ({uploadExcelJson.length} dòng)
                </div>
              }
            />
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

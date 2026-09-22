import React, { memo } from "react";
import * as XLSX from "xlsx";
import { FiX, FiUploadCloud, FiCheckCircle, FiTrash2, FiInfo, FiLayers, FiFileText } from "react-icons/fi";
import { AiFillAmazonCircle } from "react-icons/ai";
import AGTable from "../../../../components/DataTable/AGTable";
import { useBackdropClose } from "../../utils/useBackdropClose";
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
  onDropFileAmazon: (file: File) => void;
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
  onDropFileAmazon,
  onUpAmazonData,
  onCheckDuplicateAMZ,
  onClearExcel,
  progressValue,
}) => {
  // Viewport mobile (≤768px) — modal dùng nhiều inline style nên phải chuyển dạng mobile ngay tại TSX
  // (CSS class không thể đè inline style)
  const [isMobile, setIsMobile] = React.useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );
  const [isDragOver, setIsDragOver] = React.useState(false);
  const amzFileInputRef = React.useRef<HTMLInputElement>(null);

  // Chỉ đóng khi click hẳn ra ngoài modal (tránh kéo chuột ra ngoài làm tắt modal)
  const backdropProps = useBackdropClose(onClose);

  // Kéo-thả file AMZ (.csv / .xlsx / .xls) từ ngoài vào vùng drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) onDropFileAmazon(file);
  };

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);

    setIsMobile(mediaQuery.matches);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  if (!open) return null;

  const amzColumns = getAmazonUploadColumns();

  const handleDownloadTemplate = () => {
    const worksheet = XLSX.utils.json_to_sheet([{ DATA: "BARCODE_SAMPLE" }]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "AmazonTemplate");
    XLSX.writeFile(workbook, "Amazon_Import_Template.xlsx");
  };

  return (
    <div className="precision-ycsx-modal-backdrop" {...backdropProps}>
      <div
        className="precision-ycsx-modal-container"
        style={{
          maxWidth: isMobile ? "100%" : 1000,
          width: isMobile ? "100%" : "95vw",
          height: isMobile ? "94vh" : "88vh",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="title-group">
            <div className="badge-icon" style={{ background: "rgba(255, 153, 0, 0.15)", color: "#ff9900" }}>
              <AiFillAmazonCircle style={{ fontSize: "22px" }} />
            </div>
            <div>
              <h3 title="Nhập dữ liệu Amazon hàng loạt (AMZ Bulk Upload)">
                {isMobile ? "NHẬP DỮ LIỆU AMZ" : "NHẬP DỮ LIỆU AMAZON HÀNG LOẠT (AMZ BULK UPLOAD)"}
              </h3>
              {!isMobile && (
                <p>Hệ thống tự động phân tách lô 1.000 dòng và kiểm tra tính toàn vẹn dữ liệu barcode</p>
              )}
            </div>
          </div>
          <button className="btn-close" onClick={onClose} title="Đóng modal">
            <FiX />
          </button>
        </div>

        {/* Modal Body */}
        <div
          className="modal-body"
          style={{
            padding: isMobile ? "10px" : "16px",
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? "10px" : "14px",
          }}
        >
          {/* Form Criteria */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "repeat(2, minmax(0, 1fr))" : "1.2fr 1.2fr 2fr",
              gap: isMobile ? "8px" : "14px",
              padding: isMobile ? "8px" : "14px",
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
                gridColumn: isMobile ? "span 2" : "auto",
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
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "stretch" : "center",
              justifyContent: "space-between",
              padding: isMobile ? "8px" : "8px 12px",
              backgroundColor: "#ffffff",
              borderRadius: 6,
              border: "1px solid #e2e8f0",
              gap: isMobile ? 8 : 10,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => amzFileInputRef.current?.click()}
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
                <FiUploadCloud style={{ fontSize: 15, color: "#2563eb" }} /> Chọn File AMZ (.csv, .xlsx, .xls)
              </button>

              <span style={{ fontSize: 11.5, color: "#64748b" }}>
                {isMobile ? "Đã nạp: " : "Tổng số dòng đã nạp: "}
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

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
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
                <FiCheckCircle size={14} style={{ color: "#10b981" }} /> {isMobile ? "Kiểm tra trùng" : "1. Kiểm tra trùng"}
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={handleDownloadTemplate}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                  fontSize: 11.5,
                  fontWeight: 600,
                  borderRadius: 4,
                  border: "1px solid #a7f3d0",
                  background: "#ffffff",
                  color: "#047857",
                }}
              >
                <FiFileText size={14} /> Tải template
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
                <FiUploadCloud size={14} /> {isMobile ? "Upload" : "2. Bắt đầu Upload Dữ liệu"}
              </button>
            </div>
          </div>

          {/* Drop Zone: kéo-thả file AMZ từ ngoài vào modal (.csv / .xlsx / .xls) */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragOver(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragOver(false);
            }}
            onDrop={handleDrop}
            onClick={(e) => {
              // Bấm vào vùng drop để chọn file (trừ khi bấm vào nút bên trong)
              if ((e.target as HTMLElement).closest("button, input")) return;
              amzFileInputRef.current?.click();
            }}
            style={{
              border: `2px dashed ${isDragOver ? "#ff9900" : "#cbd5e1"}`,
              borderRadius: 6,
              padding: isMobile ? "12px 10px" : "16px 14px",
              textAlign: "center",
              background: isDragOver ? "#fff7ed" : "#f8fafc",
              cursor: "pointer",
              transition: "border-color 0.15s ease, background 0.15s ease",
            }}
          >
            <input
              ref={amzFileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              style={{ display: "none" }}
              onChange={onUploadFileAmazon}
            />
            <div
              style={{
                width: 38,
                height: 38,
                margin: "0 auto 6px",
                borderRadius: "50%",
                background: "#fff7ed",
                border: "1px solid #fed7aa",
                color: "#ff9900",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}
            >
              <FiUploadCloud />
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#1e293b" }}>
              Kéo thả file Amazon (.csv, .xlsx, .xls) vào đây hoặc bấm để chọn file
            </div>
            <div style={{ fontSize: 10.5, color: "#64748b", marginTop: 2 }}>
              Tên file phải chứa Model sản phẩm và ID công việc • Đã nạp{" "}
              <strong style={{ color: uploadExcelJson.length > 0 ? "#2563eb" : "#0f172a" }}>
                {uploadExcelJson.length.toLocaleString()}
              </strong>{" "}
              dòng
            </div>
          </div>

          {/* Table Preview: Bảng xem trước dữ liệu AMZ chuẩn Stitch */}
          <div className="modal-agtable-wrapper" style={{ flex: 1, minHeight: isMobile ? 220 : 380, display: "flex", flexDirection: "column" }}>
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
                gap: 6,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
                <FiFileText style={{ color: "#2563eb", flexShrink: 0 }} />
                <span>{isMobile ? "XEM TRƯỚC AMZ" : "BẢNG XEM TRƯỚC DỮ LIỆU AMAZON"}</span>
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    background: uploadExcelJson.length > 0 ? "#2563eb" : "#94a3b8",
                    color: "#ffffff",
                    padding: "1px 7px",
                    borderRadius: 10,
                    flexShrink: 0,
                  }}
                >
                  {uploadExcelJson.length.toLocaleString()} dòng
                </span>
              </div>
              {!isMobile && (
                <span style={{ fontSize: 11, fontWeight: 500, color: "#64748b" }}>
                  Tự động kiểm tra trùng & phân tách lô 1.000 dòng khi nạp
                </span>
              )}
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
          {!isMobile && (
            <div className="hint-text">
              <span>* Lưu ý: Tên file phải chứa chính xác Model sản phẩm và ID công việc để đảm bảo chống nhầm lẫn. Hỗ trợ .csv, .xlsx, .xls.</span>
            </div>
          )}
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

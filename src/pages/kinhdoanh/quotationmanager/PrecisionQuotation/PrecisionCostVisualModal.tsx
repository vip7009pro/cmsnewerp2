import React, { memo } from "react";
import { FiDownload, FiExternalLink, FiFileText, FiX } from "react-icons/fi";
import { CODEDATA } from "../../interfaces/kdInterface";
import CodeVisualLize from "../CodeVisualize/CodeVisualLize";

interface Props {
  open: boolean;
  onClose: () => void;
  selectedCode: CODEDATA;
}

const PrecisionCostVisualModal: React.FC<Props> = ({
  open,
  onClose,
  selectedCode,
}) => {
  if (!open) return null;

  return (
    <div className="stitch-calc__visual-modal">
      <div className="modal-content">
        {/* Modal Header */}
        <div className="modal-header">
          <h4>
            <FiFileText />
            <span>Mô Phỏng Layout Dao Cắt &amp; Bản Vẽ Kỹ Thuật (R&amp;D)</span>
            {selectedCode.G_CODE && (
              <span style={{ fontSize: 11, background: "#1d4ed8", padding: "1px 6px", borderRadius: 4, marginLeft: 6 }}>
                {selectedCode.G_CODE}
              </span>
            )}
          </h4>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        {/* Modal Body: CodeVisualLize Frame */}
        <div className="modal-body">
          {selectedCode.G_CODE ? (
            <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{
                background: "#747576",
                padding: 16,
                borderRadius: 6,
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)",
                width: "100%",
                overflow: "auto",
                display: "flex",
                justifyContent: "center",
                minHeight: 280,
              }}>
                <CodeVisualLize DATA={selectedCode} />
              </div>

              {/* Thông số cơ bản */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(6, 1fr)",
                gap: 8,
                width: "100%",
                background: "#ffffff",
                padding: "8px 12px",
                borderRadius: 6,
                border: "1px solid #e2e8f0",
                fontSize: 11,
              }}>
                <div>
                  <span style={{ color: "#64748b" }}>Rộng:</span> <strong>{selectedCode.G_WIDTH} mm</strong>
                </div>
                <div>
                  <span style={{ color: "#64748b" }}>Dài:</span> <strong>{selectedCode.G_LENGTH} mm</strong>
                </div>
                <div>
                  <span style={{ color: "#64748b" }}>Cột:</span> <strong>{selectedCode.G_C}</strong>
                </div>
                <div>
                  <span style={{ color: "#64748b" }}>Hàng:</span> <strong>{selectedCode.G_C_R}</strong>
                </div>
                <div>
                  <span style={{ color: "#64748b" }}>K/C Cột:</span> <strong>{selectedCode.G_CG} mm</strong>
                </div>
                <div>
                  <span style={{ color: "#64748b" }}>K/C Hàng:</span> <strong>{selectedCode.G_LG} mm</strong>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>
              Vui lòng chọn 1 mã sản phẩm trước để xem mô phỏng dao cắt
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <div style={{ fontSize: 11, color: "#475569" }}>
            Tên SP: <strong>{selectedCode.G_NAME_KD || selectedCode.G_NAME || "Chưa chọn"}</strong>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {selectedCode.G_CODE && (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`/banve/${selectedCode.G_CODE}.pdf`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  fontWeight: 700,
                  color: "#ffffff",
                  background: "#2563eb",
                  textDecoration: "none",
                  padding: "5px 12px",
                  borderRadius: 4,
                  fontSize: 11.5,
                }}
              >
                <span>Mở File Bản Vẽ PDF ({selectedCode.G_CODE}.pdf)</span>
                <FiExternalLink />
              </a>
            )}
            <button
              onClick={onClose}
              style={{
                background: "#f1f5f9",
                border: "1px solid #cbd5e1",
                padding: "5px 14px",
                borderRadius: 4,
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 11.5,
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(PrecisionCostVisualModal);

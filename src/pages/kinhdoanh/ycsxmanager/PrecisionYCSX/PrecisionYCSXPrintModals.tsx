import React, { memo, useRef, useEffect, useState, ReactElement } from "react";
import { useReactToPrint } from "react-to-print";
import { FiPrinter, FiRefreshCw, FiX } from "react-icons/fi";
import { renderBanVe, renderYCSX } from "../../../qlsx/QLSXPLAN/utils/khsxUtils";

interface Props {
  openYCSXPrint: boolean;
  openBanVePrint: boolean;
  onClose: () => void;
  selectedRows: any[];
}

const PrecisionYCSXPrintModals: React.FC<Props> = ({
  openYCSXPrint,
  openBanVePrint,
  onClose,
  selectedRows,
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [renderedContent, setRenderedContent] = useState<Array<ReactElement>>([]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  useEffect(() => {
    if (openYCSXPrint && selectedRows.length > 0) {
      setRenderedContent(renderYCSX(selectedRows));
    } else if (openBanVePrint && selectedRows.length > 0) {
      setRenderedContent(renderBanVe(selectedRows));
    } else {
      setRenderedContent([]);
    }
  }, [openYCSXPrint, openBanVePrint, selectedRows]);

  if (!openYCSXPrint && !openBanVePrint) return null;

  const isYCSX = openYCSXPrint;
  const title = isYCSX ? "XEM VÀ IN YÊU CẦU SẢN XUẤT (YCSX)" : "XEM VÀ IN BẢN VẼ SẢN XUẤT";

  const handleReRender = () => {
    if (isYCSX) {
      setRenderedContent(renderYCSX(selectedRows));
    } else {
      setRenderedContent(renderBanVe(selectedRows));
    }
  };

  return (
    <div className="precision-ycsx-modal-backdrop" onClick={onClose}>
      <div
        className="precision-ycsx-modal-container"
        style={{ maxWidth: 1000, width: "95vw", maxHeight: "92vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="title-group">
            <div className="badge-icon">
              <FiPrinter />
            </div>
            <div>
              <h3>{title}</h3>
              <p>Số lượng bản ghi được chọn để in: <strong>{selectedRows.length}</strong> phiếu</p>
            </div>
          </div>
          <button className="btn-close" onClick={onClose} title="Đóng modal">
            <FiX />
          </button>
        </div>

        {/* Action Toolbar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 16px",
            backgroundColor: "var(--bg-card)",
            borderBottom: "1px solid var(--border-color)",
          }}
        >
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              className="btn-secondary"
              onClick={handleReRender}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                fontSize: "12px",
                borderRadius: "4px",
                border: "1px solid var(--border-color)",
                cursor: "pointer",
                background: "var(--bg-body)",
                color: "var(--text-primary)",
              }}
            >
              <FiRefreshCw /> Tạo lại bản in (Re-render)
            </button>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              className="btn-primary"
              onClick={handlePrint}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 16px",
                fontSize: "12px",
                borderRadius: "4px",
                background: "var(--brand-primary)",
                color: "#fff",
                border: "none",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <FiPrinter /> Tiến hành In (Print)
            </button>
            <button
              className="btn-secondary"
              onClick={onClose}
              style={{
                padding: "6px 12px",
                fontSize: "12px",
                borderRadius: "4px",
                border: "1px solid var(--border-color)",
                cursor: "pointer",
                background: "transparent",
                color: "var(--text-secondary)",
              }}
            >
              Đóng
            </button>
          </div>
        </div>

        {/* Body Render Area */}
        <div
          className="modal-body"
          style={{
            padding: "16px",
            backgroundColor: "var(--bg-body)",
            overflow: "auto",
            maxHeight: "calc(92vh - 150px)",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            ref={printRef}
            style={{
              backgroundColor: "#ffffff",
              color: "#000000",
              padding: "16px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              borderRadius: "4px",
              minWidth: "210mm",
            }}
          >
            {renderedContent.length > 0 ? (
              renderedContent
            ) : (
              <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
                Chưa có dữ liệu bản in. Vui lòng kiểm tra lại dòng được chọn.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(PrecisionYCSXPrintModals);

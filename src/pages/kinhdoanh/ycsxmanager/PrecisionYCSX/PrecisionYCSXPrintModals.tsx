import React, { memo, useRef, useEffect, useState, ReactElement } from "react";
import { useReactToPrint } from "react-to-print";
import {
  FiPrinter,
  FiRefreshCw,
  FiX,
  FiFileText,
  FiAlertCircle,
} from "react-icons/fi";
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

  const isYCSX = openYCSXPrint;
  const isBanVe = openBanVePrint;

  // React-to-print hook with optimized print styles
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: isYCSX ? "YEU_CAU_SAN_XUAT" : "BAN_VE_SAN_XUAT",
    pageStyle: `
      @page {
        size: auto;
        margin: 6mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `,
  });

  // Re-render trigger
  const handleReRender = () => {
    if (isYCSX && selectedRows.length > 0) {
      setRenderedContent(renderYCSX(selectedRows));
    } else if (isBanVe && selectedRows.length > 0) {
      setRenderedContent(renderBanVe(selectedRows));
    } else {
      setRenderedContent([]);
    }
  };

  // Sync rendered content when modal opens or selected rows change
  useEffect(() => {
    if (openYCSXPrint && selectedRows.length > 0) {
      setRenderedContent(renderYCSX(selectedRows));
    } else if (openBanVePrint && selectedRows.length > 0) {
      setRenderedContent(renderBanVe(selectedRows));
    } else {
      setRenderedContent([]);
    }
  }, [openYCSXPrint, openBanVePrint, selectedRows]);

  // Global keyboard shortcuts: Esc to close, Ctrl+P to print
  useEffect(() => {
    if (!openYCSXPrint && !openBanVePrint) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
        e.preventDefault();
        handlePrint();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openYCSXPrint, openBanVePrint, onClose, handlePrint]);

  if (!openYCSXPrint && !openBanVePrint) return null;

  const modalTitle = isYCSX
    ? "XEM VÀ IN YÊU CẦU SẢN XUẤT (YCSX)"
    : "XEM VÀ IN BẢN VẼ SẢN XUẤT";

  const modalSubtitle = isYCSX
    ? `Đã chọn: ${selectedRows.length} lệnh YCSX • Sẵn sàng in biểu mẫu sản xuất tiêu chuẩn`
    : `Đã chọn: ${selectedRows.length} bản vẽ • Sẵn sàng in bản vẽ kỹ thuật & tem kiểm soát`;

  return (
    <div className="precision-ycsx-modal-backdrop" onClick={onClose}>
      <div
        className="precision-ycsx-modal-container precision-ycsx-print-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="title-group">
            <div
              className={`badge-icon ${
                isYCSX ? "badge-icon--blue" : "badge-icon--emerald"
              }`}
            >
              {isYCSX ? <FiPrinter /> : <FiFileText />}
            </div>
            <div>
              <h3>{modalTitle}</h3>
              <p>{modalSubtitle}</p>
            </div>
          </div>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            title="Đóng cửa sổ (Esc)"
          >
            <FiX />
          </button>
        </div>

        {/* Operational Command Bar */}
        <div className="modal-print-toolbar">
          <div className="toolbar-left">
            <div
              className={`print-badge ${
                isYCSX ? "print-badge--blue" : "print-badge--emerald"
              }`}
            >
              <span className="dot" />
              <span>
                {selectedRows.length > 0
                  ? `Sẵn sàng in (${selectedRows.length} phiếu)`
                  : "Chưa chọn bản ghi"}
              </span>
            </div>

            <button
              type="button"
              className="btn-rerender"
              onClick={handleReRender}
              title="Tải lại định dạng và làm mới dữ liệu trang in"
            >
              <FiRefreshCw />
              <span>Tạo lại bản in (Re-render)</span>
            </button>
          </div>

          <div className="toolbar-right">
            {/* HERO PRINT BUTTON - PROMINENT & HIGH CONTRAST */}
            {isYCSX ? (
              <button
                type="button"
                className="btn-print-hero btn-print-hero--ycsx"
                onClick={handlePrint}
                title="Bắt đầu gửi lệnh in biểu mẫu Yêu Cầu Sản Xuất (Ctrl + P)"
              >
                <FiPrinter />
                <span>IN YCSX</span>
                <span className="shortcut-chip">Ctrl+P</span>
              </button>
            ) : (
              <button
                type="button"
                className="btn-print-hero btn-print-hero--banve"
                onClick={handlePrint}
                title="Bắt đầu gửi lệnh in Bản Vẽ Kỹ Thuật (Ctrl + P)"
              >
                <FiPrinter />
                <span>IN BẢN VẼ</span>
                <span className="shortcut-chip">Ctrl+P</span>
              </button>
            )}

            <button
              type="button"
              className="btn-close-action"
              onClick={onClose}
              title="Đóng cửa sổ xem trước"
            >
              <FiX />
              <span>Đóng</span>
            </button>
          </div>
        </div>

        {/* Print Preview Stage */}
        <div className="modal-print-stage">
          <div className="modal-print-sheet">
            {renderedContent.length > 0 ? (
              <div ref={printRef}>{renderedContent}</div>
            ) : (
              <div className="empty-print-state">
                <FiAlertCircle />
                <h4>Chưa có dữ liệu bản in</h4>
                <p>
                  Vui lòng đóng cửa sổ này, tích chọn ít nhất một dòng YCSX trên
                  bảng danh sách chính, sau đó bấm nút{" "}
                  <strong>{isYCSX ? "In YCSX" : "In Bản Vẽ"}</strong> trên thanh
                  công cụ để xem trước và in ấn.
                </p>
                <button
                  type="button"
                  className="btn-close-action"
                  style={{ marginTop: 8 }}
                  onClick={onClose}
                >
                  Quay lại bảng dữ liệu
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(PrecisionYCSXPrintModals);

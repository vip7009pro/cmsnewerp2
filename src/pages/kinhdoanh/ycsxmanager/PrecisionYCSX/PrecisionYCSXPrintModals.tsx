import React, { memo, useCallback, useRef, useEffect, useState, useMemo, ReactElement } from "react";
import { useReactToPrint } from "react-to-print";
import {
  FiPrinter,
  FiRefreshCw,
  FiX,
  FiFileText,
  FiAlertCircle,
} from "react-icons/fi";
import { renderBanVe, renderYCSX } from "../../../qlsx/QLSXPLAN/utils/khsxUtils";
import { useBackdropClose } from "../../utils/useBackdropClose";

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
  // Bộ đếm dùng cho nút "Tạo lại bản in" (buộc tính lại nội dung in).
  const [renderKey, setRenderKey] = useState(0);

  const isYCSX = openYCSXPrint;
  const isBanVe = openBanVePrint;

  /**
   * Bản vẽ là khổ A4 NGANG full-bleed (canvas 297x208mm + 2 logo QC PASS tuyệt đối).
   * Trước đây dùng chung `@page { size: auto; margin: 6mm }` => vùng in chỉ còn
   * 210 - 12 = 198mm chiều cao, nhỏ hơn khối 208mm, nên logo QC PASS ở góc dưới-trái
   * (absolute, không cắt được) bị đẩy trọn sang trang sau.
   * => Với bản vẽ phải dùng khổ A4 landscape + margin 0 và reset margin của body
   * để khối 208mm nằm gọn trong trang 210mm.
   */
  const printPageStyle = useMemo(() => {
    if (isBanVe) {
      return `
        @page {
          size: A4 landscape;
          margin: 0;
        }
        html, body {
          margin: 0 !important;
          padding: 0 !important;
        }
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `;
    }
    return `
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
    `;
  }, [isBanVe]);

  // React-to-print hook with optimized print styles
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: isYCSX ? "YEU_CAU_SAN_XUAT" : "BAN_VE_SAN_XUAT",
    pageStyle: printPageStyle,
  });

  // PERF: nội dung in được TÍNH NGAY TRONG RENDER thay vì setState trong useEffect.
  // Cách cũ gây double render: mở modal -> render trang rỗng -> effect setState ->
  // render LẠI toàn bộ cây khổ A4 (rất nặng khi in nhiều YCSX / nhiều bản vẽ PDF).
  const renderedContent = useMemo<Array<ReactElement>>(() => {
    if (selectedRows.length === 0) return [];
    if (openYCSXPrint) return renderYCSX(selectedRows);
    if (openBanVePrint) return renderBanVe(selectedRows);
    return [];
    // renderKey chỉ dùng để buộc tính lại khi bấm "Tạo lại bản in (Re-render)".
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openYCSXPrint, openBanVePrint, selectedRows, renderKey]);

  // Nút Re-render: chỉ cần tăng key, useMemo ở trên sẽ tự dựng lại nội dung.
  const handleReRender = useCallback(() => {
    setRenderKey((k) => k + 1);
  }, []);

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

  // Chỉ đóng khi click hẳn ra ngoài modal (tránh kéo chuột ra ngoài làm tắt modal)
  const backdropProps = useBackdropClose(onClose);

  if (!openYCSXPrint && !openBanVePrint) return null;

  const modalTitle = isYCSX
    ? "XEM VÀ IN YÊU CẦU SẢN XUẤT (YCSX)"
    : "XEM VÀ IN BẢN VẼ SẢN XUẤT";

  const modalSubtitle = isYCSX
    ? `Đã chọn: ${selectedRows.length} lệnh YCSX • Sẵn sàng in biểu mẫu sản xuất tiêu chuẩn`
    : `Đã chọn: ${selectedRows.length} bản vẽ • Sẵn sàng in bản vẽ kỹ thuật & tem kiểm soát`;

  return (
    <div className="precision-ycsx-modal-backdrop" {...backdropProps}>
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

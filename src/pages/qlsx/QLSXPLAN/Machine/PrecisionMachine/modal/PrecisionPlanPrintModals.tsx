import React from "react";
import { AiFillSave, AiOutlineClose, AiOutlinePrinter, AiOutlineReload } from "react-icons/ai";
import { FaWarehouse } from "react-icons/fa";
import KHOAO from "../../../KHOAO/KHOAO";
import { QLSXPLANDATA } from "../../../interfaces/khsxInterface";

interface PrintModalsProps {
  selectedPlan: QLSXPLANDATA;
  showChiThi: boolean;
  setShowChiThi: (show: boolean) => void;
  showChiThi2: boolean;
  setShowChiThi2: (show: boolean) => void;
  showKhoAo: boolean;
  setShowKhoAo: (show: boolean) => void;
  showYCKT: boolean;
  setShowYCKT: (show: boolean) => void;
  selection: { tabycsx: boolean; tabbanve: boolean };
  setSelection: React.Dispatch<React.SetStateAction<any>>;
  maxLieu: number;
  setMaxLieu: (val: number) => void;
  onSetMaxLieu: () => void;
  onPrint: () => void;
  ycsxprintref: React.RefObject<HTMLDivElement>;
  chithilistrender: any;
  chithilistrender2: any;
  ycsxlistrender: any;
  ycktlistrender: any;
  onRenderChiThi: () => void;
  onRenderChiThi2: () => void;
  onRenderYCSX: () => void;
  onRenderBanVe: () => void;
  onRenderYCKT: () => void;
}

/** Component khung Modal In Ấn chuẩn Google Stitch High-Density Enterprise */
interface PrintModalWrapperProps {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  badgeText?: string;
  onClose: () => void;
  onPrint: () => void;
  onReload?: () => void;
  reloadText?: string;
  isFullWidth?: boolean;
  extraToolbar?: React.ReactNode;
  children: React.ReactNode;
  printRef?: React.RefObject<HTMLDivElement>;
}

const PrintModalWrapper: React.FC<PrintModalWrapperProps> = ({
  isOpen,
  title,
  subtitle,
  badgeText,
  onClose,
  onPrint,
  onReload,
  reloadText = "Nạp Lại Bản In",
  isFullWidth = false,
  extraToolbar,
  children,
  printRef,
}) => {
  if (!isOpen) return null;

  return (
    <div className="precision-print-modal-backdrop" onClick={onClose}>
      <div
        className={`precision-print-modal-window ${
          isFullWidth ? "precision-print-modal-window--full" : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. MODAL HEADER */}
        <div className="precision-print-modal-window__header">
          <div className="modal-title-group">
            <div className="modal-icon-badge">
              <AiOutlinePrinter size={16} />
            </div>
            <div>
              <h2 className="modal-heading">{title}</h2>
              {subtitle && <span className="modal-subtitle">{subtitle}</span>}
            </div>
            {badgeText && <span className="modal-subtag">{badgeText}</span>}
          </div>

          <button
            type="button"
            className="btn-close-print-modal"
            onClick={onClose}
            title="Đóng cửa sổ (Esc)"
          >
            <AiOutlineClose size={16} />
          </button>
        </div>

        {/* 2. ACTION TOOLBAR */}
        <div className="precision-print-modal-window__toolbar">
          <div className="toolbar-left">
            {extraToolbar}

            {onReload && (
              <button
                type="button"
                className="btn-reload-preview"
                onClick={onReload}
                title="Tải lại dữ liệu và nạp lại cấu trúc trang in"
              >
                <AiOutlineReload size={13} className="reload-icon" />
                <span>{reloadText}</span>
              </button>
            )}
          </div>

          <div className="toolbar-right">
            <button
              type="button"
              className="btn-print-action"
              onClick={onPrint}
              title="Kích hoạt lệnh in ấn tới máy in"
            >
              <AiOutlinePrinter size={16} />
              <span>IN BẢN NÀY (PRINT)</span>
            </button>
          </div>
        </div>

        {/* 3. PREVIEW CANVAS (PAPER STAGE) */}
        <div className="precision-print-modal-window__canvas">
          <div className="print-paper-sheet" ref={printRef}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export const PrecisionPlanPrintModals: React.FC<PrintModalsProps> = React.memo(
  ({
    selectedPlan,
    showChiThi,
    setShowChiThi,
    showChiThi2,
    setShowChiThi2,
    showKhoAo,
    setShowKhoAo,
    showYCKT,
    setShowYCKT,
    selection,
    setSelection,
    maxLieu,
    setMaxLieu,
    onSetMaxLieu,
    onPrint,
    ycsxprintref,
    chithilistrender,
    chithilistrender2,
    ycsxlistrender,
    ycktlistrender,
    onRenderChiThi,
    onRenderChiThi2,
    onRenderYCSX,
    onRenderBanVe,
    onRenderYCKT,
  }) => {
    const planBadge =
      selectedPlan?.PLAN_ID && selectedPlan.PLAN_ID !== "XXX"
        ? `PLAN: ${selectedPlan.PLAN_ID}`
        : undefined;

    return (
      <>
        {/* 1. MODAL IN PHIẾU YCSX */}
        <PrintModalWrapper
          isOpen={selection.tabycsx}
          title="XEM TRƯỚC & IN PHIẾU YÊU CẦU SẢN XUẤT (YCSX)"
          subtitle="Phiếu yêu cầu sản xuất tiêu chuẩn lưu trữ và điều phối đơn hàng"
          badgeText={planBadge}
          onClose={() => setSelection((prev: any) => ({ ...prev, tabycsx: false }))}
          onPrint={onPrint}
          onReload={onRenderYCSX}
          reloadText="Nạp Lại YCSX"
          printRef={ycsxprintref}
        >
          {ycsxlistrender}
        </PrintModalWrapper>

        {/* 2. MODAL IN BẢN VẼ KỸ THUẬT */}
        <PrintModalWrapper
          isOpen={selection.tabbanve}
          title="XEM TRƯỚC & IN BẢN VẼ KỸ THUẬT SẢN PHẨM"
          subtitle="Bản vẽ tiêu chuẩn kỹ thuật kích thước và cấu trúc sản phẩm"
          badgeText={selectedPlan?.G_NAME_KD ? `MÃ HÀNG: ${selectedPlan.G_NAME_KD}` : planBadge}
          onClose={() => setSelection((prev: any) => ({ ...prev, tabbanve: false }))}
          onPrint={onPrint}
          onReload={onRenderBanVe}
          reloadText="Nạp Lại Bản Vẽ"
          printRef={ycsxprintref}
        >
          {ycsxlistrender}
        </PrintModalWrapper>

        {/* 3. MODAL KHO ẢO (KHO SX MAIN) */}
        {showKhoAo && (
          <div className="precision-print-modal-backdrop" onClick={() => setShowKhoAo(false)}>
            <div
              className="precision-print-modal-window precision-print-modal-window--full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="precision-print-modal-window__header">
                <div className="modal-title-group">
                  <div className="modal-icon-badge" style={{ background: "#059669" }}>
                    <FaWarehouse size={16} />
                  </div>
                  <div>
                    <h2 className="modal-heading">KHO SẢN XUẤT CHÍNH (KHO ẢO)</h2>
                    <span className="modal-subtitle">Tra cứu tồn kho thực tế, cuộn liệu và điều phối cấp phát</span>
                  </div>
                  {selectedPlan?.PLAN_ID && selectedPlan.PLAN_ID !== "XXX" && (
                    <span className="modal-subtag">NEXT PLAN: {selectedPlan.PLAN_ID}</span>
                  )}
                </div>

                <button
                  type="button"
                  className="btn-close-print-modal"
                  onClick={() => setShowKhoAo(false)}
                  title="Đóng cửa sổ Kho Ảo (Esc)"
                >
                  <AiOutlineClose size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-auto bg-slate-100 p-2 min-h-0">
                <KHOAO NEXT_PLAN={selectedPlan?.PLAN_ID} />
              </div>
            </div>
          </div>
        )}

        {/* 4. MODAL IN CHỈ THỊ SẢN XUẤT 1 */}
        <PrintModalWrapper
          isOpen={showChiThi}
          title="XEM TRƯỚC & IN CHỈ THỊ SẢN XUẤT (MẪU 1)"
          subtitle={`Phiếu chỉ thị cấp phát vật tư và thông số dập máy ${selectedPlan?.PLAN_EQ || ""}`}
          badgeText={planBadge}
          onClose={() => setShowChiThi(false)}
          onPrint={onPrint}
          onReload={onRenderChiThi}
          reloadText="Nạp Lại Chỉ Thị 1"
          printRef={ycsxprintref}
          extraToolbar={
            <div className="max-lieu-control">
              <span className="max-lieu-label">Số dòng / trang:</span>
              <input
                type="number"
                value={maxLieu}
                onChange={(e) => setMaxLieu(Number(e.target.value))}
                min={1}
                max={50}
              />
              <button
                type="button"
                className="btn-save-maxlieu"
                onClick={onSetMaxLieu}
                title="Lưu số dòng in vào hệ thống"
              >
                <AiFillSave size={12} />
                <span>Lưu Dòng</span>
              </button>
            </div>
          }
        >
          {chithilistrender}
        </PrintModalWrapper>

        {/* 5. MODAL IN CHỈ THỊ SẢN XUẤT 2 */}
        <PrintModalWrapper
          isOpen={showChiThi2}
          title="XEM TRƯỚC & IN CHỈ THỊ SẢN XUẤT (MẪU 2)"
          subtitle={`Phiếu chỉ thị cấp phát vật tư mẫu 2 cho máy ${selectedPlan?.PLAN_EQ || ""}`}
          badgeText={planBadge}
          onClose={() => setShowChiThi2(false)}
          onPrint={onPrint}
          onReload={onRenderChiThi2}
          reloadText="Nạp Lại Chỉ Thị 2"
          printRef={ycsxprintref}
          extraToolbar={
            <div className="max-lieu-control">
              <span className="max-lieu-label">Số dòng / trang:</span>
              <input
                type="number"
                value={maxLieu}
                onChange={(e) => setMaxLieu(Number(e.target.value))}
                min={1}
                max={50}
              />
              <button
                type="button"
                className="btn-save-maxlieu"
                onClick={onSetMaxLieu}
                title="Lưu số dòng in vào hệ thống"
              >
                <AiFillSave size={12} />
                <span>Lưu Dòng</span>
              </button>
            </div>
          }
        >
          {chithilistrender2}
        </PrintModalWrapper>

        {/* 6. MODAL IN YÊU CẦU KỸ THUẬT (YCKT) */}
        <PrintModalWrapper
          isOpen={showYCKT}
          title="XEM TRƯỚC & IN YÊU CẦU KỸ THUẬT (YCKT)"
          subtitle="Phiếu yêu cầu kỹ thuật và tiêu chuẩn công đoạn sản xuất"
          badgeText={planBadge}
          onClose={() => setShowYCKT(false)}
          onPrint={onPrint}
          onReload={onRenderYCKT}
          reloadText="Nạp Lại YCKT"
          printRef={ycsxprintref}
        >
          {ycktlistrender}
        </PrintModalWrapper>
      </>
    );
  }
);

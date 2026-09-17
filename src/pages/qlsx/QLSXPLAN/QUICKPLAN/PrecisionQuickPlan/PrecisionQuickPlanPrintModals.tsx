import React, { ReactElement } from "react";
import {
  AiOutlinePrinter,
  AiOutlineClose,
  AiOutlineReload,
  AiOutlineFileText,
  AiOutlinePicture,
} from "react-icons/ai";
import { YCSXTableData } from "../../../../kinhdoanh/interfaces/kdInterface";
import { QLSXPLANDATA } from "../../interfaces/khsxInterface";

interface PrecisionQuickPlanPrintModalsProps {
  selection: any;
  setSelection: (val: any) => void;
  showChiThi: boolean;
  setShowChiThi: (val: boolean) => void;
  showYCKT: boolean;
  setShowYCKT: (val: boolean) => void;
  ycsxlistrender?: any;
  setYCSXListRender: (val: any) => void;
  chithilistrender?: any;
  setChiThiListRender: (val: any) => void;
  ycktlistrender?: any;
  setYCKTListRender: (val: any) => void;
  ycsxdatatablefilter: YCSXTableData[];
  qlsxplandatafilter: React.MutableRefObject<QLSXPLANDATA[]>;
  renderYCSX: (ycsxlist: YCSXTableData[]) => any;
  renderBanVe: (ycsxlist: YCSXTableData[]) => any;
  renderChiThi: (planlist: QLSXPLANDATA[]) => any;
  renderYCKT: (planlist: QLSXPLANDATA[]) => any;
  ycsxprintref: React.RefObject<any>;
  handlePrint: () => void;
}

export const PrecisionQuickPlanPrintModals: React.FC<PrecisionQuickPlanPrintModalsProps> = ({
  selection,
  setSelection,
  showChiThi,
  setShowChiThi,
  showYCKT,
  setShowYCKT,
  ycsxlistrender,
  setYCSXListRender,
  chithilistrender,
  setChiThiListRender,
  ycktlistrender,
  setYCKTListRender,
  ycsxdatatablefilter,
  qlsxplandatafilter,
  renderYCSX,
  renderBanVe,
  renderChiThi,
  renderYCKT,
  ycsxprintref,
  handlePrint,
}) => {
  // 1. Modal In Phiếu YCSX
  const renderYCSXModal = () => {
    if (!selection.tabycsx) return null;
    return (
      <div className="precision-print-modal-backdrop">
        <div className="precision-print-modal-window">
          <div className="precision-print-modal-window__header">
            <div className="modal-title-group">
              <div className="modal-icon-badge">
                <AiOutlineFileText />
              </div>
              <div>
                <h3 className="modal-heading">XEM TRƯỚC PHIẾU YÊU CẦU SẢN XUẤT (YCSX)</h3>
                <span className="modal-subtitle">
                  Đang chọn {ycsxdatatablefilter.length} phiếu để in
                </span>
              </div>
            </div>
            <button
              type="button"
              className="btn-close-print-modal"
              onClick={() => setSelection({ ...selection, tabycsx: false })}
              title="Đóng cửa sổ"
            >
              <AiOutlineClose size={16} />
            </button>
          </div>

          <div className="precision-print-modal-window__toolbar">
            <button
              type="button"
              className="btn-reload-preview"
              onClick={() => setYCSXListRender(renderYCSX(ycsxdatatablefilter))}
            >
              <AiOutlineReload size={14} />
              <span>Tải lại dữ liệu</span>
            </button>

            <button
              type="button"
              className="btn-print-action"
              onClick={handlePrint}
            >
              <AiOutlinePrinter size={16} />
              <span>In Phiếu YCSX</span>
            </button>
          </div>

          <div className="precision-print-modal-window__canvas">
            <div className="print-paper-sheet" ref={ycsxprintref}>
              {ycsxlistrender}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 2. Modal In Bản Vẽ
  const renderBanVeModal = () => {
    if (!selection.tabbanve) return null;
    return (
      <div className="precision-print-modal-backdrop">
        <div className="precision-print-modal-window">
          <div className="precision-print-modal-window__header">
            <div className="modal-title-group">
              <div className="modal-icon-badge" style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" }}>
                <AiOutlinePicture />
              </div>
              <div>
                <h3 className="modal-heading">XEM TRƯỚC BẢN VẼ KỸ THUẬT</h3>
                <span className="modal-subtitle">
                  Đang chọn {ycsxdatatablefilter.length} bản vẽ
                </span>
              </div>
            </div>
            <button
              type="button"
              className="btn-close-print-modal"
              onClick={() => setSelection({ ...selection, tabbanve: false })}
              title="Đóng cửa sổ"
            >
              <AiOutlineClose size={16} />
            </button>
          </div>

          <div className="precision-print-modal-window__toolbar">
            <button
              type="button"
              className="btn-reload-preview"
              onClick={() => setYCSXListRender(renderBanVe(ycsxdatatablefilter))}
            >
              <AiOutlineReload size={14} />
              <span>Tải lại bản vẽ</span>
            </button>

            <button
              type="button"
              className="btn-print-action"
              onClick={handlePrint}
            >
              <AiOutlinePrinter size={16} />
              <span>In Bản Vẽ</span>
            </button>
          </div>

          <div className="precision-print-modal-window__canvas">
            <div className="print-paper-sheet" ref={ycsxprintref}>
              {ycsxlistrender}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 3. Modal In Chỉ Thị Sản Xuất
  const renderChiThiModal = () => {
    if (!showChiThi) return null;
    return (
      <div className="precision-print-modal-backdrop">
        <div className="precision-print-modal-window">
          <div className="precision-print-modal-window__header">
            <div className="modal-title-group">
              <div className="modal-icon-badge" style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}>
                <AiOutlineFileText />
              </div>
              <div>
                <h3 className="modal-heading">XEM TRƯỚC CHỈ THỊ SẢN XUẤT</h3>
                <span className="modal-subtitle">
                  Đang chọn {qlsxplandatafilter.current.length} chỉ thị
                </span>
              </div>
            </div>
            <button
              type="button"
              className="btn-close-print-modal"
              onClick={() => setShowChiThi(false)}
              title="Đóng cửa sổ"
            >
              <AiOutlineClose size={16} />
            </button>
          </div>

          <div className="precision-print-modal-window__toolbar">
            <button
              type="button"
              className="btn-reload-preview"
              onClick={() => setChiThiListRender(renderChiThi(qlsxplandatafilter.current))}
            >
              <AiOutlineReload size={14} />
              <span>Tải lại chỉ thị</span>
            </button>

            <button
              type="button"
              className="btn-print-action"
              onClick={handlePrint}
            >
              <AiOutlinePrinter size={16} />
              <span>In Chỉ Thị</span>
            </button>
          </div>

          <div className="precision-print-modal-window__canvas">
            <div className="print-paper-sheet" ref={ycsxprintref}>
              {chithilistrender}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 4. Modal In Yêu Cầu Kỹ Thuật (YCKT)
  const renderYCKTModal = () => {
    if (!showYCKT) return null;
    return (
      <div className="precision-print-modal-backdrop">
        <div className="precision-print-modal-window">
          <div className="precision-print-modal-window__header">
            <div className="modal-title-group">
              <div className="modal-icon-badge" style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)" }}>
                <AiOutlineFileText />
              </div>
              <div>
                <h3 className="modal-heading">XEM TRƯỚC YÊU CẦU KỸ THUẬT (YCKT)</h3>
                <span className="modal-subtitle">
                  Đang chọn {qlsxplandatafilter.current.length} phiếu YCKT
                </span>
              </div>
            </div>
            <button
              type="button"
              className="btn-close-print-modal"
              onClick={() => setShowYCKT(false)}
              title="Đóng cửa sổ"
            >
              <AiOutlineClose size={16} />
            </button>
          </div>

          <div className="precision-print-modal-window__toolbar">
            <button
              type="button"
              className="btn-reload-preview"
              onClick={() => setYCKTListRender(renderYCKT(qlsxplandatafilter.current))}
            >
              <AiOutlineReload size={14} />
              <span>Tải lại YCKT</span>
            </button>

            <button
              type="button"
              className="btn-print-action"
              onClick={handlePrint}
            >
              <AiOutlinePrinter size={16} />
              <span>In YCKT</span>
            </button>
          </div>

          <div className="precision-print-modal-window__canvas">
            <div className="print-paper-sheet" ref={ycsxprintref}>
              {ycktlistrender}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {renderYCSXModal()}
      {renderBanVeModal()}
      {renderChiThiModal()}
      {renderYCKTModal()}
    </>
  );
};

export default React.memo(PrecisionQuickPlanPrintModals);

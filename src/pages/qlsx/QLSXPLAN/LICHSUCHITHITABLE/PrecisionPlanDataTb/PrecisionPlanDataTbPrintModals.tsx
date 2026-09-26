import React, { ReactElement } from "react";
import {
  AiOutlineClose,
  AiOutlinePrinter,
  AiOutlineReload,
  AiOutlineSchedule,
} from "react-icons/ai";
import Swal from "sweetalert2";
import KHOAO from "../../KHOAO/KHOAO";
import QUICKPLAN2 from "../../QUICKPLAN/QUICKPLAN2";
import QUICKPLAN2_OLD from "../../QUICKPLAN/PLAN_NHANH";
import { getCompany, getUserData } from "../../../../../api/Api";
import { QLSXPLANDATA } from "../../interfaces/khsxInterface";
import { renderChiThi, renderChiThi2 } from "../../utils/khsxUtils";
import { renderBanVe2 } from "./planDataTbPrintRenderers";

interface PrecisionPlanDataTbPrintModalsProps {
  showChiThi: boolean;
  setShowChiThi: (show: boolean) => void;
  showChiThi2: boolean;
  setShowChiThi2: (show: boolean) => void;
  showBV: boolean;
  setShowBV: (show: boolean) => void;
  showkhoao: boolean;
  setShowKhoAo: (show: boolean) => void;
  showQuickPlan: boolean;
  setShowQuickPlan: (show: boolean) => void;
  selectedPlan: QLSXPLANDATA;
  qlsxplandatafilter: any;
  maxLieu: number;
  setMaxLieu: (val: number) => void;
  ycsxprintref: any;
  myComponentRef: any;
  handlePrint: () => void;
  chithilistrender?: ReactElement[];
  chithilistrender2?: ReactElement;
  ycsxlistrender?: ReactElement[];
  setChiThiListRender: (render: ReactElement[]) => void;
  setChiThiListRender2: (render: ReactElement) => void;
  setYCSXListRender: (render: ReactElement[]) => void;
}

export const PrecisionPlanDataTbPrintModals: React.FC<
  PrecisionPlanDataTbPrintModalsProps
> = ({
  showChiThi,
  setShowChiThi,
  showChiThi2,
  setShowChiThi2,
  showBV,
  setShowBV,
  showkhoao,
  setShowKhoAo,
  showQuickPlan,
  setShowQuickPlan,
  selectedPlan,
  qlsxplandatafilter,
  maxLieu,
  setMaxLieu,
  ycsxprintref,
  myComponentRef,
  handlePrint,
  chithilistrender,
  chithilistrender2,
  ycsxlistrender,
  setChiThiListRender,
  setChiThiListRender2,
  setYCSXListRender,
}) => {
    return (
      <>
        {/* 1. Modal Print Chỉ Thị Sản Xuất */}
        {showChiThi && (
          <div className="precision-print-modal-backdrop">
            <div className="precision-print-modal-window">
              <div className="precision-print-modal-window__header">
                <div className="modal-title-group">
                  <div className="modal-icon-badge">
                    <AiOutlinePrinter />
                  </div>
                  <div>
                    <h4 className="modal-heading">IN CHỈ THỊ SẢN XUẤT (PHIẾU CẤP LIỆU)</h4>
                    <span className="modal-subtitle">
                      Đã chọn: {qlsxplandatafilter.current?.length || 0} lệnh dập
                    </span>
                  </div>
                </div>
                <button
                  className="btn-close-print-modal"
                  onClick={() => setShowChiThi(false)}
                  title="Đóng cửa sổ in"
                >
                  <AiOutlineClose />
                </button>
              </div>

              <div className="precision-print-modal-window__toolbar">
                <div className="toolbar-left">
                  <div className="max-lieu-control">
                    <span>Số dòng/trang:</span>
                    <input
                      type="number"
                      value={maxLieu}
                      onChange={(e) => setMaxLieu(Number(e.target.value))}
                    />
                    <button
                      className="btn-set-lieu"
                      onClick={() => {
                        localStorage.setItem("maxLieu", maxLieu.toString());
                        Swal.fire("Thông báo", "Đã lưu số dòng tối đa", "success");
                      }}
                    >
                      Lưu Dòng
                    </button>
                  </div>

                  <button
                    className="btn-reload-preview"
                    onClick={() => {
                      setChiThiListRender(
                        renderChiThi(qlsxplandatafilter.current, myComponentRef)
                      );
                    }}
                    title="Nạp lại cấu trúc phiếu in"
                  >
                    <AiOutlineReload size={14} />
                    Nạp lại bản in
                  </button>
                </div>

                <div className="toolbar-right">
                  <button
                    className="btn-print-action"
                    onClick={() => {
                      if (myComponentRef.current?.handleInternalClick) {
                        myComponentRef.current.handleInternalClick();
                      }
                      handlePrint();
                    }}
                    title="Xuất lệnh in ấn"
                  >
                    <AiOutlinePrinter size={16} />
                    IN BẢN NÀY (PRINT)
                  </button>
                </div>
              </div>

              <div className="precision-print-modal-window__body">
                <div className="print-paper-sheet" ref={ycsxprintref}>
                  {chithilistrender}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Modal Print Chỉ Thị Combo */}
        {showChiThi2 && (
          <div className="precision-print-modal-backdrop">
            <div className="precision-print-modal-window">
              <div className="precision-print-modal-window__header">
                <div className="modal-title-group">
                  <div className="modal-icon-badge">
                    <AiOutlinePrinter />
                  </div>
                  <div>
                    <h4 className="modal-heading">IN CHỈ THỊ SẢN XUẤT COMBO (YCSX GỘP)</h4>
                    <span className="modal-subtitle">
                      Chỉ thị liên kết cùng YCSX • {qlsxplandatafilter.current?.length || 0} công đoạn
                    </span>
                  </div>
                </div>
                <button
                  className="btn-close-print-modal"
                  onClick={() => setShowChiThi2(false)}
                  title="Đóng cửa sổ in"
                >
                  <AiOutlineClose />
                </button>
              </div>

              <div className="precision-print-modal-window__toolbar">
                <div className="toolbar-left">
                  <div className="max-lieu-control">
                    <span>Số dòng/trang:</span>
                    <input
                      type="number"
                      value={maxLieu}
                      onChange={(e) => setMaxLieu(Number(e.target.value))}
                    />
                    <button
                      className="btn-set-lieu"
                      onClick={() => {
                        localStorage.setItem("maxLieu", maxLieu.toString());
                        Swal.fire("Thông báo", "Đã lưu số dòng tối đa", "success");
                      }}
                    >
                      Lưu Dòng
                    </button>
                  </div>

                  <button
                    className="btn-reload-preview"
                    onClick={() => {
                      setChiThiListRender2(
                        renderChiThi2(qlsxplandatafilter.current, myComponentRef)
                      );
                    }}
                    title="Nạp lại cấu trúc phiếu in"
                  >
                    <AiOutlineReload size={14} />
                    Nạp lại bản in 2
                  </button>
                </div>

                <div className="toolbar-right">
                  <button
                    className="btn-print-action"
                    onClick={() => {
                      if (myComponentRef.current?.handleInternalClick) {
                        myComponentRef.current.handleInternalClick();
                      }
                      handlePrint();
                    }}
                    title="Xuất lệnh in ấn"
                  >
                    <AiOutlinePrinter size={16} />
                    IN BẢN NÀY (PRINT)
                  </button>
                </div>
              </div>

              <div className="precision-print-modal-window__body">
                <div className="print-paper-sheet" ref={ycsxprintref}>
                  {chithilistrender2}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Modal Print Bản Vẽ Kỹ Thuật */}
        {showBV && (
          <div className="precision-print-modal-backdrop">
            <div className="precision-print-modal-window precision-print-modal-window--full">
              <div className="precision-print-modal-window__header">
                <div className="modal-title-group">
                  <div className="modal-icon-badge">
                    <AiOutlinePrinter />
                  </div>
                  <div>
                    <h4 className="modal-heading">BẢN VẼ KỸ THUẬT SẢN PHẨM</h4>
                    <span className="modal-subtitle">
                      Xem trước và in bản vẽ • {qlsxplandatafilter.current?.length || 0} bản vẽ
                    </span>
                  </div>
                </div>
                <button
                  className="btn-close-print-modal"
                  onClick={() => setShowBV(false)}
                  title="Đóng cửa sổ bản vẽ"
                >
                  <AiOutlineClose />
                </button>
              </div>

              <div className="precision-print-modal-window__toolbar">
                <div className="toolbar-left">
                  <button
                    className="btn-reload-preview"
                    onClick={() => {
                      setYCSXListRender(renderBanVe2(qlsxplandatafilter.current));
                    }}
                    title="Nạp lại dữ liệu bản vẽ"
                  >
                    <AiOutlineReload size={14} />
                    Render Bản Vẽ
                  </button>
                </div>

                <div className="toolbar-right">
                  <button
                    className="btn-print-action"
                    onClick={handlePrint}
                    title="Xuất lệnh in bản vẽ"
                  >
                    <AiOutlinePrinter size={16} />
                    IN BẢN VẼ (PRINT)
                  </button>
                </div>
              </div>

              <div className="precision-print-modal-window__body">
                <div className="print-paper-sheet" ref={ycsxprintref}>
                  {ycsxlistrender}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. Modal Kho Ảo Sản Xuất */}
        {showkhoao && (
          <div className="precision-print-modal-backdrop">
            <div className="precision-print-modal-window precision-print-modal-window--full">
              <div className="precision-print-modal-window__header">
                <div className="modal-title-group">
                  <div className="modal-icon-badge">
                    <AiOutlineSchedule />
                  </div>
                  <div>
                    <h4 className="modal-heading">KHO ẢO SẢN XUẤT - TRA CỨU TỒN KHO THỰC TẾ</h4>
                    <span className="modal-subtitle">
                      Kế hoạch: {selectedPlan?.PLAN_ID} • {selectedPlan?.G_NAME}
                    </span>
                  </div>
                </div>
                <button
                  className="btn-close-print-modal"
                  onClick={() => setShowKhoAo(false)}
                  title="Đóng Kho Ảo"
                >
                  <AiOutlineClose />
                </button>
              </div>
              <div style={{ flex: "1 1 auto", height: "100%", minHeight: 0, overflow: "hidden" }}>
                <KHOAO NEXT_PLAN={selectedPlan?.PLAN_ID} />
              </div>
            </div>
          </div>
        )}

        {/* 5. Modal Quick Plan Full Screen */}
        {showQuickPlan && (
          <div className="precision-quickplan-modal-backdrop">
            <div className="quickplan-modal-header">
              <span className="modal-title">QUICK PLAN - KẾ HOẠCH NHANH SẢN XUẤT</span>
              <button className="btn-close" onClick={() => setShowQuickPlan(false)}>
                ✕ ĐÓNG
              </button>
            </div>
            <div className="quickplan-modal-body">
              {getCompany() === "CMS" && getUserData()?.EMPL_NO === "NHU1903z" ? (
                <QUICKPLAN2 />
              ) : (
                <QUICKPLAN2_OLD />
              )}
            </div>
          </div>
        )}
      </>
    );
  };

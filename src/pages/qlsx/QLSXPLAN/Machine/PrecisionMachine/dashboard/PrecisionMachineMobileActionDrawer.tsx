import React from "react";
import { BiRefresh } from "react-icons/bi";
import { MdFlashOn } from "react-icons/md";
import { AiOutlineClose, AiOutlineFileExcel } from "react-icons/ai";
import { BsGraphUp } from "react-icons/bs";
import { FiCheckCircle, FiLayers } from "react-icons/fi";
import { MachineKpiData } from "../machineTypes";

interface PrecisionMachineMobileActionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  factory: "NM1" | "NM2";
  onFactoryChange: (f: "NM1" | "NM2") => void;
  selectedPlanDate: string;
  onDateChange: (d: string) => void;
  eq_series: string[];
  selected_eq: string[];
  onToggleEqSeries: (series: string, checked: boolean) => void;
  onRefresh: () => void;
  onAutoDispatch: () => void;
  onExportExcel: () => void;
  kpiData: MachineKpiData;
}

export const PrecisionMachineMobileActionDrawer: React.FC<PrecisionMachineMobileActionDrawerProps> = ({
  isOpen,
  onClose,
  factory,
  onFactoryChange,
  selectedPlanDate,
  onDateChange,
  eq_series,
  selected_eq,
  onToggleEqSeries,
  onRefresh,
  onAutoDispatch,
  onExportExcel,
  kpiData,
}) => {
  if (!isOpen) return null;

  const handleAction = (callback: () => void) => {
    callback();
    onClose();
  };

  const machineRate =
    kpiData.totalMachines > 0
      ? ((kpiData.activeMachines / kpiData.totalMachines) * 100).toFixed(1)
      : "0";

  const progressRate =
    kpiData.totalTargetQty > 0
      ? ((kpiData.completedQty / kpiData.totalTargetQty) * 100).toFixed(1)
      : "0";

  return (
    <div
      className="precision-mobile-drawer-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="precision-mobile-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Header Drawer */}
        <div className="drawer-header">
          <div className="drawer-title">
            <span className="drawer-icon">
              <MdFlashOn size={18} />
            </span>
            <span>TÁC VỤ KẾ HOẠCH SẢN XUẤT</span>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Đóng"
          >
            <AiOutlineClose size={18} />
          </button>
        </div>

        {/* 2. Telemetry & Mini-KPIs Summary */}
        <div className="drawer-kpi-summary">
          <div className="summary-card">
            <div className="card-top">
              <span className="dot dot--green" />
              <span className="card-lbl">Máy Hoạt Động</span>
            </div>
            <div className="card-val">
              {kpiData.activeMachines}/{kpiData.totalMachines}{" "}
              <span className="pct">({machineRate}%)</span>
            </div>
          </div>

          <div className="summary-card">
            <div className="card-top">
              <BsGraphUp size={12} color="#2563eb" />
              <span className="card-lbl">Tiến Độ Kế Hoạch</span>
            </div>
            <div className="card-val">
              {progressRate}%{" "}
              <span className="sub">
                ({(kpiData.completedQty / 1000).toFixed(0)}k/{(kpiData.totalTargetQty / 1000).toFixed(0)}k)
              </span>
            </div>
          </div>
        </div>

        {kpiData.waitingMaterialCount > 0 && (
          <div className="drawer-alert-chip">
            <span>⚠️ {kpiData.waitingMaterialCount} máy chờ cấp NVL:</span>
            <strong>{kpiData.waitingMachineNames.join(", ")}</strong>
          </div>
        )}

        {/* 3. Bộ Điều Khiển: Nhà Máy & Ngày Kế Hoạch */}
        <div className="drawer-section">
          <div className="section-label">
            <FiLayers size={13} />
            <span>NHÀ MÁY & NGÀY KẾ HOẠCH</span>
          </div>

          <div className="factory-row">
            <button
              type="button"
              className={`factory-btn ${factory === "NM1" ? "active" : ""}`}
              onClick={() => onFactoryChange("NM1")}
            >
              Nhà Máy 1 (NM1)
            </button>
            <button
              type="button"
              className={`factory-btn ${factory === "NM2" ? "active" : ""}`}
              onClick={() => onFactoryChange("NM2")}
            >
              Nhà Máy 2 (NM2)
            </button>
          </div>

          <div className="date-row">
            <label htmlFor="mobile-plan-date">Ngày kế hoạch:</label>
            <input
              id="mobile-plan-date"
              type="date"
              value={selectedPlanDate}
              onChange={(e) => onDateChange(e.target.value)}
            />
          </div>
        </div>

        {/* 4. Bộ Lọc Chuyền Máy */}
        <div className="drawer-section">
          <div className="section-label">
            <FiCheckCircle size={13} />
            <span>LỌC THEO DÒNG MÁY (LINE)</span>
          </div>
          <div className="line-chips">
            {eq_series.map((series) => {
              const isChecked = selected_eq.includes(series);
              return (
                <button
                  key={series}
                  type="button"
                  className={`line-chip ${isChecked ? "active" : ""}`}
                  onClick={() => onToggleEqSeries(series, !isChecked)}
                >
                  {series}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Nhóm Nút Tác Vụ ERP */}
        <div className="drawer-section">
          <div className="section-label">
            <MdFlashOn size={13} />
            <span>HÀNH ĐỘNG HỆ THỐNG</span>
          </div>
          <div className="action-buttons-list">
            <button
              type="button"
              className="action-btn action-btn--refresh"
              onClick={() => handleAction(onRefresh)}
            >
              <BiRefresh size={18} />
              <div className="btn-texts">
                <span className="btn-main">Làm Mới Sàn (Refresh PLAN)</span>
                <span className="btn-sub">Cập nhật chỉ thị và trạng thái máy thời gian thực</span>
              </div>
            </button>

            <button
              type="button"
              className="action-btn action-btn--dispatch"
              onClick={() => handleAction(onAutoDispatch)}
            >
              <MdFlashOn size={18} />
              <div className="btn-texts">
                <span className="btn-main">Tự Động Phân Bổ (Auto Dispatch)</span>
                <span className="btn-sub">Cân đối và dàn trải kế hoạch tự động cho các máy</span>
              </div>
            </button>

            <button
              type="button"
              className="action-btn action-btn--excel"
              onClick={() => handleAction(onExportExcel)}
            >
              <AiOutlineFileExcel size={18} />
              <div className="btn-texts">
                <span className="btn-main">Xuất Báo Cáo Kế Hoạch Ra Excel</span>
                <span className="btn-sub">Tải file danh sách chỉ thị theo ngày và nhà máy</span>
              </div>
            </button>
          </div>
        </div>

        {/* 6. Footer Đóng */}
        <div className="drawer-footer">
          <button
            type="button"
            className="btn-drawer-apply"
            onClick={onClose}
          >
            Đóng & Tiếp Tục
          </button>
        </div>
      </div>
    </div>
  );
};

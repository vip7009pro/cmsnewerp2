import React from "react";
import { FiPieChart, FiX } from "react-icons/fi";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { DaoFilmReportPieData } from "../../utils/daoFilmReportUtils";
import { renderPieLabel, renderPieTooltip } from "./PrecisionDaoFilmReportDesktopTop";
import { exportColors, usageColors } from "./useDaoFilmReportData";

interface PrecisionDaoFilmReportMobileChartsModalProps {
  isOpen: boolean;
  onClose: () => void;
  usagePieData: DaoFilmReportPieData[];
  exportPieData: DaoFilmReportPieData[];
  totalUsagePie: number;
  totalExportPie: number;
}

export const PrecisionDaoFilmReportMobileChartsModal: React.FC<
  PrecisionDaoFilmReportMobileChartsModalProps
> = ({
  isOpen,
  onClose,
  usagePieData,
  exportPieData,
  totalUsagePie,
  totalExportPie,
}) => {
  if (!isOpen) return null;

  return (
    <div className="precision-dfr-modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <FiPieChart size={16} className="modal-icon" />
            <span className="modal-title">Biểu Đồ Phân Tích Dao Film</span>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            title="Đóng biểu đồ"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Chart 1: % sử dụng */}
          <div className="mobile-chart-card">
            <div className="chart-card-header">
              <span className="chart-title">Tỉ trọng dao theo % sử dụng</span>
              <span className="chart-badge">Tổng: {totalUsagePie.toLocaleString("en-US")} dao</span>
            </div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Tooltip content={renderPieTooltip} />
                  <Pie
                    data={usagePieData}
                    dataKey="value"
                    nameKey="name"
                    isAnimationActive={false}
                    outerRadius={80}
                    labelLine={false}
                    label={renderPieLabel}
                  >
                    {usagePieData.map((entry, index) => (
                      <Cell
                        key={`m-usage-${entry.name}-${index}`}
                        fill={usageColors[index % usageColors.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Số lần xuất */}
          <div className="mobile-chart-card">
            <div className="chart-card-header">
              <span className="chart-title">Tỉ trọng dao theo số lần xuất</span>
              <span className="chart-badge">Tổng: {totalExportPie.toLocaleString("en-US")} dao</span>
            </div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Tooltip content={renderPieTooltip} />
                  <Pie
                    data={exportPieData}
                    dataKey="value"
                    nameKey="name"
                    isAnimationActive={false}
                    outerRadius={80}
                    labelLine={false}
                    label={renderPieLabel}
                  >
                    {exportPieData.map((entry, index) => (
                      <Cell
                        key={`m-export-${entry.name}-${index}`}
                        fill={exportColors[index % exportColors.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button type="button" className="btn-modal-close" onClick={onClose}>
            Đóng Biểu Đồ
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionDaoFilmReportMobileChartsModal);

import React from "react";
import { AiOutlineFileExcel } from "react-icons/ai";
import { BsGraphUp } from "react-icons/bs";
import { MachineKpiData } from "../machineTypes";

interface KpiProps {
  kpiData: MachineKpiData;
  onExportExcel: () => void;
}

export const PrecisionMachineKpi: React.FC<KpiProps> = React.memo(({ kpiData, onExportExcel }) => {
  const machineRate = kpiData.totalMachines > 0
    ? ((kpiData.activeMachines / kpiData.totalMachines) * 100).toFixed(1)
    : "0";

  const progressRate = kpiData.totalTargetQty > 0
    ? ((kpiData.completedQty / kpiData.totalTargetQty) * 100).toFixed(1)
    : "0";

  return (
    <div className="precision-machine__kpiGroup">
      {/* KPI 1: Máy Hoạt Động */}
      <div className="precision-machine__kpiCard">
        <span className="icon-dot"></span>
        <div className="meta">
          <span className="title">Máy Hoạt Động</span>
          <span className="val">
            {kpiData.activeMachines} / {kpiData.totalMachines} Máy{" "}
            <span className="highlight">({machineRate}%)</span>
          </span>
        </div>
      </div>

      {/* KPI 2: Tiến Độ Kế Hoạch Ngày */}
      <div className="precision-machine__kpiCard">
        <BsGraphUp color="#2563eb" size={14} />
        <div className="meta">
          <span className="title">Tiến Độ Kế Hoạch Ngày</span>
          <span className="val">
            {kpiData.completedQty.toLocaleString("en-US")} /{" "}
            {kpiData.totalTargetQty.toLocaleString("en-US")}{" "}
            <span className="highlight-blue">({progressRate}%)</span>
          </span>
        </div>
      </div>

      {/* KPI 3: Ca làm việc & Cảnh báo máy chờ liệu */}
      <div className="precision-machine__shiftCard">
        <span>{kpiData.currentShift}</span>
        {kpiData.waitingMaterialCount > 0 && (
          <>
            <span className="text-slate-300">|</span>
            <span
              className="alert-chip"
              title={`Danh sách đầy đủ (${kpiData.waitingMaterialCount} máy):\n${kpiData.waitingMachineNames.join(", ")}`}
            >
              ⚠️ {kpiData.waitingMaterialCount} Máy Chờ Liệu (
              {kpiData.waitingMachineNames.length <= 4
                ? kpiData.waitingMachineNames.join(", ")
                : `${kpiData.waitingMachineNames.slice(0, 3).join(", ")} và ${
                    kpiData.waitingMachineNames.length - 3
                  } máy khác`}
              )
            </span>
          </>
        )}
      </div>

      {/* Nút Xuất Excel Kế Hoạch */}
      <button
        type="button"
        onClick={onExportExcel}
        className="p-1 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded border border-slate-200 transition"
        title="Xuất kế hoạch sản xuất ra file Excel"
      >
        <AiOutlineFileExcel size={16} color="#059669" />
      </button>
    </div>
  );
});

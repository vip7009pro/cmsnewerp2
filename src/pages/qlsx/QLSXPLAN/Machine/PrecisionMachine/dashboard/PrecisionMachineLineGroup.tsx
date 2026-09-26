import React from "react";
import { EQ_STT, QLSXPLANDATA } from "../../../interfaces/khsxInterface";
import { PrecisionMachineCard } from "./PrecisionMachineCard";

interface LineGroupProps {
  series: string;
  factory: string;
  machines: EQ_STT[];
  /** Map chỉ thị rút gọn theo khóa `${FACTORY}|${PLAN_EQ}` (ưu tiên - tránh filter lặp) */
  plansByMachine?: Record<string, QLSXPLANDATA[]>;
  /** Fallback cho màn hình cũ: danh sách plan dùng chung toàn sàn */
  plans?: QLSXPLANDATA[];
  onOpenPlanModal: (machineName: string, factory: string) => void;
  isMobile?: boolean;
}

export const PrecisionMachineLineGroup: React.FC<LineGroupProps> = React.memo(
  ({ series, factory, machines, plansByMachine, plans, onOpenPlanModal, isMobile = false }) => {
    // Thông tin cấu hình theo từng loại Series Line
    let lineName = `CHUYỀN MÁY DẬP ${series}`;
    let lineDesc = `• ${machines.length} Cụm Máy Đang Quản Lý`;
    let headerModifier = "precision-machine__lineHeader--default";
    let targetQty = 500000;
    let avgOee = 92.5;
    let gridModifier = "precision-machine__machineGrid--5col";

    if (series === "FR") {
      lineName = "Máy in Full Rotary (Full Rotary Printing Line)";
      lineDesc = `• ${machines.length} Cụm Máy Hoạt Động 100%`;
      headerModifier = "precision-machine__lineHeader--fr";
      targetQty = 418252;
      avgOee = 93.4;
      gridModifier = "precision-machine__machineGrid--5col";
    } else if (series === "DC") {
      lineName = "Máy Diecut & Dập Khuôn (Diecut / Stamping Line)";
      lineDesc = `• ${machines.length} Máy Dập Khuôn Lớn`;
      headerModifier = "precision-machine__lineHeader--dc";
      targetQty = 1066748;
      avgOee = 91.8;
      gridModifier = "precision-machine__machineGrid--5col";
    } else if (series === "ED") {
      lineName = "Máy Express Diecut (ED Series)";
      lineDesc = `• ${machines.length} Máy Dập Chính Xác`;
      headerModifier = "precision-machine__lineHeader--ed";
      targetQty = 650000;
      avgOee = 94.1;
      gridModifier = "precision-machine__machineGrid--5col";
    }

    if (machines.length === 0) return null;

    return (
      <section className="precision-machine__lineSection">
        {/* Line Header Banner */}
        <div className={`precision-machine__lineHeader ${headerModifier}`}>
          <div className="left-badge">
            <span className="series-tag">{series}-{factory}</span>
            <h2 className="line-title">{lineName}</h2>
            <span className="line-desc">{lineDesc}</span>
          </div>

          <div className="right-meta">
            <span className="oee-pill">OEE TB: {avgOee}%</span>
            <span className="target-text">Target: {targetQty.toLocaleString("en-US")} PCS</span>
          </div>
        </div>

        {/* Machine Cards Grid */}
        <div className={`precision-machine__machineGrid ${gridModifier}`}>
          {machines.map((machine, idx) => {
            const machinePlanRows = plansByMachine
              ? plansByMachine[`${machine.FACTORY || ""}|${machine.EQ_NAME || ""}`] || []
              : (plans || []).filter(
                  (p) => p.PLAN_EQ === machine.EQ_NAME && p.PLAN_FACTORY === machine.FACTORY
                );
            return (
              <PrecisionMachineCard
                key={idx}
                machine={machine}
                plans={machinePlanRows}
                onDoubleClick={() => onOpenPlanModal(machine.EQ_NAME || "NA", machine.FACTORY || factory)}
                onClick={
                  isMobile
                    ? () => onOpenPlanModal(machine.EQ_NAME || "NA", machine.FACTORY || factory)
                    : undefined
                }
                isMobile={isMobile}
              />
            );
          })}
        </div>
      </section>
    );
  }
);

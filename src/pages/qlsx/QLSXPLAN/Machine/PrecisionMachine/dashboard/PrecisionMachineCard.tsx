import React from "react";
import Swal from "sweetalert2";
import { EQ_STT, QLSXPLANDATA } from "../../../interfaces/khsxInterface";

interface MachineCardProps {
  machine: EQ_STT;
  plans: QLSXPLANDATA[];
  onDoubleClick: () => void;
}

export const PrecisionMachineCard: React.FC<MachineCardProps> = React.memo(
  ({ machine, plans, onDoubleClick }) => {
    const eqName = machine.EQ_NAME === "ED36" ? "ED36(SP01)" : machine.EQ_NAME || "NA";
    const eqStatus = machine.EQ_STATUS || "STOP";
    const isLive = eqStatus === "MASS";
    const isSetting = eqStatus === "SETTING";
    const isStop = eqStatus === "STOP";
    const isWaitingMaterial = machine.EQ_NAME === "DC07" || (isStop && plans.length > 0);

    // Lọc kế hoạch thuộc máy này
    const machinePlans = plans.filter(
      (p) => p.PLAN_EQ === machine.EQ_NAME && p.PLAN_FACTORY === machine.FACTORY
    );

    // Xác định class trạng thái
    let statusClass = "status-running";
    let statusLabel = "RUNNING";
    if (isLive) {
      statusClass = "status-live";
      statusLabel = "LIVE";
    } else if (isSetting) {
      statusClass = "status-setting";
      statusLabel = "SETTING";
    } else if (isStop) {
      statusClass = "status-stop";
      statusLabel = "STOP";
    }

    // Tốc độ giả lập hoặc thực tế
    const speedText = machine.EQ_NAME?.startsWith("DC") ? "140 RPM" : "135 spm";

    const handleHoiKho = (e: React.MouseEvent) => {
      e.stopPropagation();
      Swal.fire({
        title: `Hối kho cấp liệu cho ${eqName}`,
        text: "Đã gửi thông báo ưu tiên cấp cuộn film cắt tới bộ phận Kho NVL!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    };

    return (
      <div
        className={`precision-machine__card ${
          isLive ? "precision-machine__card--live" : ""
        } ${isWaitingMaterial ? "precision-machine__card--waiting" : ""}`}
        onDoubleClick={onDoubleClick}
        title={`Nhấp đúp để mở Kế hoạch chi tiết máy ${eqName}`}
      >
        <div>
          {/* Header Card */}
          <div className={`card-top ${statusClass}`}>
            <span className="machine-code">{eqName}</span>
            <span className="status-pill">
              <span className="mini-dot"></span>
              {statusLabel}
            </span>
          </div>

          {/* Subcode mã hàng đang chạy */}
          <div className="card-subcode" title={machine.G_NAME || "Chưa có mã hàng"}>
            {machine.CURR_PLAN_ID ? `${machine.CURR_PLAN_ID}_${machine.G_NAME || ""}` : machine.G_NAME || "CHỜ KẾ HOẠCH"}
          </div>

          {/* Danh sách Jobs (Có khả năng cuộn khi máy có nhiều lệnh dập) */}
          <div className="card-jobs card-jobs--scrollable">
            {isWaitingMaterial && machine.EQ_NAME === "DC07" ? (
              // Cảnh báo máy chờ liệu phong cách Stitch (DC07)
              <div className="waiting-material-box">
                <div className="warning-title">⚠️ Thiếu Cuộn Film Cắt</div>
                <div className="warning-lot">Kho đang xuất: #LOT-4019</div>
              </div>
            ) : null}

            {/* Danh sách các Jobs: Mỗi lệnh hiển thị trên 1 dòng duy nhất gọn gàng, rõ ràng */}
            {machinePlans.length > 0 ? (
              machinePlans.map((job, idx) => {
                const isActive = idx === 0;
                return (
                  <div
                    key={job.PLAN_ID || idx}
                    className={`job-row ${isActive ? "job-row--active" : ""}`}
                    title={`Lệnh ${idx + 1}: ${job.PLAN_ID} - ${job.G_NAME_KD || job.G_NAME || ""} - Bước ${job.STEP || 0} - SL: ${(job.PLAN_QTY || 0).toLocaleString("en-US")} PCS`}
                  >
                    <div className="job-single-line">
                      <span className="job-idx">{idx + 1}.</span>
                      <span className="job-name" title={job.G_NAME_KD || job.G_NAME}>
                        {job.G_NAME_KD || job.G_NAME}
                      </span>
                      <span className="job-plan-id">{job.PLAN_ID}</span>
                      <span className="step-badge">B{job.STEP ?? 0}</span>
                      <span className="qty-text">
                        {(job.PLAN_QTY || 0).toLocaleString("en-US")}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-3 text-center text-slate-400 font-mono text-[11px]">
                Chưa có lệnh dập nào
              </div>
            )}
          </div>
        </div>

        {/* Footer Card */}
        <div className="card-footer">
          <span>Tốc độ: {speedText}</span>
          {isWaitingMaterial && machine.EQ_NAME === "DC07" ? (
            <div className="flex items-center gap-1.5">
              <span className="downtime-urgent">Downtime: 14m</span>
              <button type="button" className="urgent-btn" onClick={handleHoiKho}>
                Hối kho ⚡
              </button>
            </div>
          ) : (
            <span className="waiting-count">{machinePlans.length} Lệnh dập</span>
          )}
        </div>
      </div>
    );
  }
);

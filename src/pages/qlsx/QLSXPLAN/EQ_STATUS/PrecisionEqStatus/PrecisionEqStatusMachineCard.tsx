import React, { useMemo } from "react";
import moment from "moment";
import { EQ_STT } from "../../interfaces/khsxInterface";

interface PrecisionEqStatusMachineCardProps {
  data: EQ_STT;
  searchString?: string;
}

export const PrecisionEqStatusMachineCard: React.FC<PrecisionEqStatusMachineCardProps> = React.memo(({
  data,
  searchString = "",
}) => {
  // 1. Kiểm tra filter tìm kiếm
  const isMatchSearch = useMemo(() => {
    if (!searchString.trim()) return true;
    const term = searchString.toLowerCase().trim();
    const gName = (data.G_NAME_KD || "").toLowerCase();
    const eqName = (data.EQ_NAME || "").toLowerCase();
    const planId = (data.CURR_PLAN_ID || "").toLowerCase();
    return gName.includes(term) || eqName.includes(term) || planId.includes(term);
  }, [data.G_NAME_KD, data.EQ_NAME, data.CURR_PLAN_ID, searchString]);

  // 2. Trạng thái máy & thời gian trôi qua
  const eqStatus = data.EQ_STATUS || "STOP";
  const date1 = moment(moment.utc().format("YYYY-MM-DD HH:mm:ss")).utc();
  const date2 = moment.utc(data.UPD_DATE).format("YYYY-MM-DD HH:mm:ss");
  const diffMinutes = date1.diff(date2, "minutes");

  // 3. Thông số quy trình Setting & UPH mục tiêu
  const thisSettingTime =
    data.PROCESS_NUMBER === 1 ? data.Setting1 :
    data.PROCESS_NUMBER === 2 ? data.Setting2 :
    data.PROCESS_NUMBER === 3 ? data.Setting3 : data.Setting4;

  const thisUPH =
    data.PROCESS_NUMBER === 1 ? data.UPH1 :
    data.PROCESS_NUMBER === 2 ? data.UPH2 :
    data.PROCESS_NUMBER === 3 ? data.UPH3 : data.UPH4;

  const planQty = data.PLAN_QTY || 0;
  const resultQty = data.SX_RESULT !== null && data.SX_RESULT !== undefined ? data.SX_RESULT : (data.KQ_SX_TAM || 0);
  const achievRate = planQty > 0 ? Math.round((resultQty / planQty) * 100) : 0;

  // 4. Tính toán Setting thực tế & UPH thực tế
  const datesetting1 = (data.MASS_START_TIME !== null && data.MASS_START_TIME !== undefined)
    ? moment(moment.utc(data.MASS_START_TIME).format("YYYY-MM-DD HH:mm:ss")).utc()
    : moment.utc();
  const datesetting2 = moment.utc(data.SETTING_START_TIME).format("YYYY-MM-DD HH:mm:ss");
  const diffsetting = datesetting1.diff(datesetting2, "minutes");

  const datemass1 = (data.MASS_END_TIME !== null && data.MASS_END_TIME !== undefined)
    ? moment.utc(moment.utc(data.MASS_END_TIME).format("YYYY-MM-DD HH:mm:ss"))
    : moment.utc();
  const datemass2 = moment.utc(data.MASS_START_TIME).format("YYYY-MM-DD HH:mm:ss");
  const diffmass = datemass1.diff(datemass2, "minutes");
  const actualUPH = diffmass > 0 ? Math.round((resultQty / diffmass) * 60) : 0;

  // 5. Target End Time
  let targetEndTime = "N/A";
  if (thisUPH && data.SETTING_START_TIME) {
    const addMinutes = (planQty / thisUPH) * 60 + (thisSettingTime || 0);
    targetEndTime = moment.utc(data.SETTING_START_TIME).add(addMinutes, "minute").format("HH:mm:ss");
  }

  // Tên máy chuẩn
  const displayName =
    data.EQ_NAME === "ED36" && data.FACTORY === "NM2"
      ? "ED36(SP01)"
      : data.EQ_NAME || "---";

  const getStatusClass = () => {
    if (eqStatus === "MASS") return "status-running";
    if (eqStatus === "SETTING") return "status-setting";
    return "status-stop";
  };

  const getStatusLabel = () => {
    if (eqStatus === "MASS") return "RUNNING";
    if (eqStatus === "SETTING") return "SETTING";
    return "STOPPED";
  };

  const getTimerLabel = () => {
    const actTime = data.ACC_TIME ? `(TT: ${Math.round(data.ACC_TIME)}m)` : "";
    if (eqStatus === "MASS") return `Chạy: ${diffMinutes}m ${actTime}`;
    if (eqStatus === "SETTING") return `Setting: ${diffMinutes}m ${actTime}`;
    return `Dừng: ${diffMinutes}m ${actTime}`;
  };

  return (
    <div
      className={`andon-machine-card ${getStatusClass()}`}
      style={{
        opacity: isMatchSearch ? 1 : 0.25,
        filter: isMatchSearch ? "none" : "grayscale(80%)",
      }}
    >
      {/* 1. Header Banner của máy */}
      <div className="card-header-banner">
        <div className="machine-title-left">
          <span className="machine-name-text">{displayName}</span>
          <span className="status-pill-badge">{getStatusLabel()}</span>
        </div>
        <div className="machine-timer-right">
          <span className="downtime-pill">{getTimerLabel()}</span>
        </div>
      </div>

      {/* 2. Thân thẻ máy */}
      <div className="card-body-content">
        {/* Hàng công nhân & sản phẩm */}
        <div className="worker-plan-row">
          <div className="card-employee-box">
            <img
              className="empl-photo"
              src={data.UPD_EMPL ? `/Picture_NS/NS_${data.UPD_EMPL}.jpg` : "/default_avatar.png"}
              alt="NV"
              onError={(e) => {
                // Fallback nếu ảnh không tồn tại
                (e.target as HTMLImageElement).src =
                  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='46' height='52' fill='%2394a3b8'><rect width='100%' height='100%' fill='%23334155'/><text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-size='10'>No Img</text></svg>";
              }}
            />
            <span className="empl-id">{data.UPD_EMPL || "---"}</span>
          </div>

          <div className="plan-details-box">
            <div className="plan-info-pill">
              <span className="plan-label">CT:</span>
              <span>{data.CURR_PLAN_ID || "---"}</span>
              <span className="step-tag">B{data.STEP || 0}</span>
            </div>
            <div className="product-name-text" title={data.G_NAME_KD}>
              {data.G_NAME_KD || "Chưa gán mã hàng"}
            </div>
          </div>
        </div>

        {/* Bảng so sánh Target vs Result */}
        <div className="target-result-grid">
          <div className="col-target">
            <span className="grid-header-cell">Target</span>
            <div className="grid-data-row">
              <span className="row-label">Setting:</span>
              <span className="row-val">{thisSettingTime || 0}m</span>
            </div>
            <div className="grid-data-row">
              <span className="row-label">UPH:</span>
              <span className="row-val">{thisUPH ? thisUPH.toLocaleString("en-US") : "N/A"}</span>
            </div>
            <div className="grid-data-row">
              <span className="row-label">Start:</span>
              <span className="row-val">
                {data.SETTING_START_TIME ? moment.utc(data.SETTING_START_TIME).format("HH:mm") : "N/A"}
              </span>
            </div>
            <div className="grid-data-row">
              <span className="row-label">End:</span>
              <span className="row-val">{targetEndTime}</span>
            </div>
          </div>

          <div className="col-result">
            <span className="grid-header-cell">Result</span>
            <div className="grid-data-row">
              <span className="row-label">Setting:</span>
              <span className="row-val">{diffsetting >= 0 ? `${diffsetting}m` : "0m"}</span>
            </div>
            <div className="grid-data-row">
              <span className="row-label">UPH:</span>
              <span className="row-val">{actualUPH.toLocaleString("en-US")}</span>
            </div>
            <div className="grid-data-row">
              <span className="row-label">Start:</span>
              <span className="row-val">
                {data.SETTING_START_TIME ? moment.utc(data.SETTING_START_TIME).format("HH:mm") : "N/A"}
              </span>
            </div>
            <div className="grid-data-row">
              <span className="row-label">End:</span>
              <span className="row-val">
                {data.MASS_END_TIME ? moment.utc(data.MASS_END_TIME).format("HH:mm") : "Đang chạy"}
              </span>
            </div>
          </div>
        </div>

        {/* Khối 3 số liệu lớn (Plan, Result, Achiev Rate) */}
        <div className="qty-stat-row">
          <div className="qty-stat-box">
            <span className="stat-label">Plan Qty</span>
            <span className="stat-value val-plan">{planQty.toLocaleString("en-US")}</span>
          </div>

          <div className="qty-stat-box">
            <span className="stat-label">Result Qty</span>
            <span className="stat-value val-result">{resultQty.toLocaleString("en-US")}</span>
          </div>

          <div className="qty-stat-box">
            <span className="stat-label">Achiev. Rate</span>
            <span className="stat-value val-rate">{achievRate}%</span>
          </div>
        </div>
      </div>
    </div>
  );
});

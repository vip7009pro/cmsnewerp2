import React, { useMemo } from "react";
import moment from "moment";
import { FiClock, FiMaximize2, FiCpu } from "react-icons/fi";

export interface PatrolCardData {
  CATEGORY: "PQC3" | "DTC" | "INS";
  CUST_NAME_KD?: string;
  DEFECT?: string;
  EQ?: string;
  FACTORY?: string;
  G_NAME_KD?: string;
  INSPECT_QTY?: number;
  INSPECT_NG?: number;
  LINK?: string;
  TIME?: string;
  EMPL_NO?: string;
}

interface PrecisionPatrolCardProps {
  data: PatrolCardData;
  onOpenModal: (data: PatrolCardData) => void;
}

export const PrecisionPatrolCard: React.FC<PrecisionPatrolCardProps> = ({
  data,
  onOpenModal,
}) => {
  // Tính toán thời gian trôi qua
  const diffMinutes = useMemo(() => {
    if (!data.TIME) return 0;
    const now = moment.utc(moment.utc().format("YYYY-MM-DD HH:mm:ss"));
    const eventTime = moment.utc(data.TIME).format("YYYY-MM-DD HH:mm:ss");
    return Math.max(0, now.diff(eventTime, "minutes"));
  }, [data.TIME]);

  // Tính tỷ lệ NG rate (%)
  const { ngPercent, rateClass, barClass } = useMemo(() => {
    const qty = data.INSPECT_QTY || 1;
    const ng = data.INSPECT_NG || 0;
    const percent = Math.min(100, Math.max(0, (ng / qty) * 100));

    let rClass = "rate-green";
    let bClass = "bar-green";

    if (percent > 5) {
      rClass = "rate-red";
      bClass = "bar-red";
    } else if (percent > 2) {
      rClass = "rate-amber";
      bClass = "bar-amber";
    }

    return {
      ngPercent: percent.toFixed(1),
      rateClass: rClass,
      barClass: bClass,
    };
  }, [data.INSPECT_QTY, data.INSPECT_NG]);

  const isUrgent = diffMinutes <= 15;

  const categoryClass =
    data.CATEGORY === "PQC3"
      ? "pqc"
      : data.CATEGORY === "DTC"
      ? "dtc"
      : "ins";

  return (
    <div className="precision-patrol-card" onClick={() => onOpenModal(data)}>
      {/* 1. Top bar: Category, EQ/Factory, Time */}
      <div className="precision-patrol-card__topbar">
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span className={`tag-category ${categoryClass}`}>{data.CATEGORY}</span>
          <span className="tag-eq">
            <FiCpu style={{ verticalAlign: "middle", marginRight: "2px" }} />
            {data.FACTORY ? `${data.FACTORY} • ` : ""}
            {data.EQ || "LINE"}
          </span>
        </div>

        <div className={`tag-time ${isUrgent ? "urgent" : ""}`}>
          {isUrgent && <span className="pulse-dot" />}
          <FiClock size={10} />
          <span>{diffMinutes < 60 ? `${diffMinutes}m ago` : `${Math.floor(diffMinutes / 60)}h ago`}</span>
        </div>
      </div>

      {/* 2. Image box with avatar overlay & zoom button */}
      <div className="precision-patrol-card__image-box">
        <img
          className="defect-img"
          src={data.LINK}
          alt={data.DEFECT || "Ảnh lỗi"}
          onError={(e: any) => {
            e.target.onerror = null;
            e.target.src =
              "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='360' height='180' viewBox='0 0 360 180'><rect width='100%' height='100%' fill='%230f172a'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%2364748b' font-family='sans-serif' font-size='13'>Không có ảnh sự cố</text></svg>";
          }}
        />

        {/* Avatar nhân viên kiểm tra */}
        {data.EMPL_NO && (
          <div className="avatar-badge" title={`Người kiểm tra: ${data.EMPL_NO}`}>
            <img
              src={`/Picture_NS/NS_${data.EMPL_NO}.jpg`}
              alt={data.EMPL_NO}
              onError={(e: any) => {
                e.target.onerror = null;
                e.target.src =
                  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'><rect width='100%' height='100%' fill='%23334155'/><text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' fill='%23ffffff' font-family='sans-serif' font-size='11' font-weight='bold'>QC</text></svg>";
              }}
            />
          </div>
        )}

        <button
          type="button"
          className="zoom-overlay-btn"
          onClick={(e) => {
            e.stopPropagation();
            onOpenModal(data);
          }}
          title="Phóng to ảnh"
        >
          <FiMaximize2 size={10} /> Phóng to
        </button>
      </div>

      {/* 3. Card Body: Title, Customer, Defect, NG Rate Progress */}
      <div className="precision-patrol-card__body">
        <div className="card-row-title">
          <span className="card-code" title={data.G_NAME_KD}>
            {data.G_NAME_KD || "---"}
          </span>
          {data.CUST_NAME_KD && (
            <span className="card-customer" title={data.CUST_NAME_KD}>
              {data.CUST_NAME_KD}
            </span>
          )}
        </div>

        <div className="card-defect" title={data.DEFECT}>
          {data.DEFECT || "Chưa có mô tả hiện tượng lỗi"}
        </div>

        {/* NG Rate Progress Bar */}
        <div className="card-rate-section">
          <div className="rate-header">
            <span className="rate-label">Tỷ lệ lỗi (NG Rate)</span>
            <span className={`rate-value ${rateClass}`}>
              {data.INSPECT_NG}/{data.INSPECT_QTY} ({ngPercent}%)
            </span>
          </div>

          <div className="progress-track">
            <div
              className={`progress-bar ${barClass}`}
              style={{ width: `${Math.min(100, Math.max(2, Number(ngPercent)))}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionPatrolCard);

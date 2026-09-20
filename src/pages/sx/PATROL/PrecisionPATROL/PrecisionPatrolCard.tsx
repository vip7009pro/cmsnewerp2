import React, { useMemo } from "react";
import moment from "moment";
import { FiClock, FiCpu } from "react-icons/fi";

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
  const diffMinutes = useMemo(() => {
    if (!data.TIME) return 0;
    const now = moment.utc(moment.utc().format("YYYY-MM-DD HH:mm:ss"));
    const eventTime = moment.utc(data.TIME).format("YYYY-MM-DD HH:mm:ss");
    return Math.max(0, now.diff(eventTime, "minutes"));
  }, [data.TIME]);

  const { ngPercent, rateClass } = useMemo(() => {
    const qty = data.INSPECT_QTY || 1;
    const ng = data.INSPECT_NG || 0;
    const percent = Math.min(100, Math.max(0, (ng / qty) * 100));

    let rClass = "rate-green";

    if (percent > 5) {
      rClass = "rate-red";
    } else if (percent > 2) {
      rClass = "rate-amber";
    }

    return {
      ngPercent: percent.toFixed(1),
      rateClass: rClass,
    };
  }, [data.INSPECT_QTY, data.INSPECT_NG]);

  const isUrgent = diffMinutes <= 15;

  const categoryClass =
    data.CATEGORY === "PQC3"
      ? "pqc"
      : data.CATEGORY === "DTC"
      ? "dtc"
      : "ins";

  const defectText = data.DEFECT || "Chưa có mô tả hiện tượng lỗi";
  const defectCode = defectText.includes(":") ? defectText.split(":")[0].trim() : defectText.trim();
  const defectDescription = defectText.includes(":") ? defectText.split(":").slice(1).join(":").trim() : "";
  const whitePlaceholderSvg =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='520' height='260' viewBox='0 0 520 260'><rect width='100%' height='100%' fill='%23ffffff'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-family='sans-serif' font-size='13'>Không có ảnh sự cố</text></svg>";

  return (
    <div className="precision-patrol-card" onClick={() => onOpenModal(data)}>
      <div className="precision-patrol-card__image-box">
        <img
          className="defect-img"
          src={data.LINK || whitePlaceholderSvg}
          alt={defectText}
          onError={(e: any) => {
            e.target.onerror = null;
            e.target.src = whitePlaceholderSvg;
          }}
        />

        <div className="image-meta">
          <div className={`tag-time ${isUrgent ? "urgent" : ""}`}>
            {isUrgent && <span className="pulse-dot" />}
            <FiClock size={10} />
            <span>{diffMinutes < 60 ? `${diffMinutes}m` : `${Math.floor(diffMinutes / 60)}h`}</span>
          </div>
        </div>

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
      </div>

      <div className="precision-patrol-card__body">
        <div className="card-footer">
          <div className="card-footer__row">
            <div className="footer-item footer-item--error">
              <span className="footer-label">ERR</span>
              <span className="footer-value">{defectCode || "---"}</span>
            </div>
            <div className="footer-item footer-item--code">
              <span className="footer-label">CODE</span>
              <span className="footer-value">{data.G_NAME_KD || "---"}</span>
            </div>
            <div className="footer-item footer-item--defect">
              <span className="footer-label">DEFECT</span>
              <span className="footer-value">{defectDescription || defectText}</span>
            </div>
          </div>

          <div className="card-footer__row card-footer__row--secondary">
            <div className="footer-item footer-item--time">
              <span className="footer-label">TIME</span>
              <span className="footer-value">{diffMinutes}min</span>
            </div>
            <div className="footer-item footer-item--eq">
              <span className="footer-label">EQ</span>
              <span className="footer-value">{data.EQ || "LINE"}</span>
            </div>
            <div className="footer-item footer-item--cust">
              <span className="footer-label">CUST</span>
              <span className="footer-value">{data.CUST_NAME_KD || data.FACTORY || "---"}</span>
            </div>
            <div className="footer-item footer-item--ng">
              <span className="footer-label">NG RATE</span>
              <span className="footer-value">{data.INSPECT_NG ?? 0}/{data.INSPECT_QTY ?? 0} ({ngPercent}%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionPatrolCard);

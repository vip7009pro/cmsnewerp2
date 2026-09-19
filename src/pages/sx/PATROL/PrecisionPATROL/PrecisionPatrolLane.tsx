import React from "react";
import PrecisionPatrolCard, { PatrolCardData } from "./PrecisionPatrolCard";

interface PrecisionPatrolLaneProps {
  title: string;
  subtitle: string;
  category: "PQC3" | "DTC" | "INS";
  items: PatrolCardData[];
  onOpenModal: (item: PatrolCardData) => void;
}

export const PrecisionPatrolLane: React.FC<PrecisionPatrolLaneProps> = ({
  title,
  subtitle,
  category,
  items,
  onOpenModal,
}) => {
  if (items.length === 0) {
    return null;
  }

  const badgeClass =
    category === "PQC3" ? "pqc" : category === "DTC" ? "dtc" : "ins";

  return (
    <div className="patrol-lane">
      <div className="patrol-lane__header">
        <div className="header-left">
          <span className={`lane-badge ${badgeClass}`}>{category}</span>
          <span className="lane-title">{title}</span>
          <span className="lane-desc">• {subtitle}</span>
        </div>

        <div className="header-right">
          <span className="count-badge">{items.length} thẻ sự cố</span>
        </div>
      </div>

      <div className="patrol-lane__body">
        <div className="cards-track">
          {items.map((item, index) => (
            <PrecisionPatrolCard
              key={`${category}_${index}`}
              data={item}
              onOpenModal={onOpenModal}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionPatrolLane);

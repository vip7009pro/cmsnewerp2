import React from "react";
import { FiLayers, FiCheckSquare } from "react-icons/fi";

interface PrecisionPQC3DirectiveCardProps {
  planId: string;
  g_name: string;
  g_code: string;
  prodrequestno: string;
  prodreqdate: string;
  process_lot_no: string;
  pqc1Id: number;
  pqc3Id: number;
}

export const PrecisionPQC3DirectiveCard: React.FC<PrecisionPQC3DirectiveCardProps> = ({
  planId,
  g_name,
  g_code,
  prodrequestno,
  prodreqdate,
  process_lot_no,
  pqc1Id,
  pqc3Id,
}) => {
  return (
    <div className="precision-pqc3-directive-card">
      <div className="precision-pqc3-directive-card__header">
        <span className="title">
          <FiLayers size={13} /> Chỉ Thị Sản Xuất & Lô Setting
        </span>
        <span
          className={`linked-badge ${
            pqc1Id > 0 ? "linked-badge--active" : "linked-badge--none"
          }`}
        >
          {pqc1Id > 0 ? `Đã liên kết PQC1 #${pqc1Id}` : "Chưa liên kết PQC1"}
        </span>
      </div>

      <div className="precision-pqc3-directive-card__body">
        <div className="spec-item">
          <span className="spec-label">Chỉ Thị PLAN_ID</span>
          <span className="spec-value highlight">{planId || "---"}</span>
        </div>

        <div className="spec-item">
          <span className="spec-label">LOT Sản Xuất</span>
          <span className="spec-value">{process_lot_no || "---"}</span>
        </div>

        <div className="spec-item">
          <span className="spec-label">Mã Code Sản Phẩm</span>
          <span className="spec-value">{g_code || "---"}</span>
        </div>

        <div className="spec-item">
          <span className="spec-label">Số YCSX (Kế Hoạch)</span>
          <span className="spec-value">{prodrequestno || "---"}</span>
        </div>

        <div className="spec-item" style={{ gridColumn: "span 2" }}>
          <span className="spec-label">Tên Sản Phẩm (G_NAME)</span>
          <span className="spec-value" title={g_name}>
            {g_name || "Chưa có thông tin chỉ thị"}
          </span>
        </div>
      </div>

      <div className="precision-pqc3-directive-card__footer">
        <span>Ngày YCSX: <strong>{prodreqdate || "---"}</strong></span>
        {pqc3Id > 0 && (
          <span style={{ color: "#7c3aed", fontWeight: 700 }}>
            <FiCheckSquare style={{ verticalAlign: "middle" }} /> Đang chọn PQC3 #{pqc3Id}
          </span>
        )}
      </div>
    </div>
  );
};

export default React.memo(PrecisionPQC3DirectiveCard);

import React from "react";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { SX_DATA } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";

interface PrecisionPQC1DirectiveCardProps {
  process_lot_no: string;
  inputno: string;
  m_name: string;
  sx_data: SX_DATA[];
  ktdtc: "DKT" | "CKT";
  roll_qty: number;
  in_cfm_qty: number;
  lieql_sx: any;
}

export const PrecisionPQC1DirectiveCard: React.FC<PrecisionPQC1DirectiveCardProps> = ({
  process_lot_no,
  inputno,
  m_name,
  sx_data,
  ktdtc,
  roll_qty,
  in_cfm_qty,
  lieql_sx,
}) => {
  const currentSx = sx_data?.[0];

  return (
    <div className="precision-pqc1-directivecard">
      <div className="precision-pqc1-directivecard__header">
        <span className="title">
          <span className="badge-directive">TECH SPECS</span>
          Thông Tin Chỉ Thị & Công Đoạn Sản Xuất
        </span>

        <span className={`badge-dtc ${ktdtc === "DKT" ? "dkt" : "ckt"}`}>
          {ktdtc === "DKT" ? (
            <>
              <FiCheckCircle size={12} /> Đã Kiểm Tra DTC
            </>
          ) : (
            <>
              <FiAlertCircle size={12} /> Chưa Kiểm Tra DTC
            </>
          )}
        </span>
      </div>

      <div className="precision-pqc1-directivecard__content">
        {/* LOT SX */}
        <div className="spec-item">
          <span className="spec-label">LOT SẢN XUẤT</span>
          <span className="spec-value highlight" title={process_lot_no}>
            {process_lot_no || "---"}
          </span>
        </div>

        {/* LOT NVL */}
        <div className="spec-item">
          <span className="spec-label">LOT NGUYÊN VẬT LIỆU</span>
          <span className="spec-value" title={inputno}>
            {inputno || "---"}
          </span>
        </div>

        {/* LINE & CÔNG ĐOẠN */}
        <div className="spec-item">
          <span className="spec-label">LINE MÁY</span>
          <span className="spec-value">
            {currentSx?.EQ_NAME_TT || "---"}
          </span>
        </div>

        <div className="spec-item">
          <span className="spec-label">CÔNG ĐOẠN</span>
          <span className="spec-value">
            {currentSx?.PROCESS_NUMBER !== undefined ? currentSx.PROCESS_NUMBER : "---"}
          </span>
        </div>

        {/* STEP & PD */}
        <div className="spec-item">
          <span className="spec-label">STEP</span>
          <span className="spec-value">
            {currentSx?.STEP !== undefined ? currentSx.STEP : "---"}
          </span>
        </div>

        <div className="spec-item">
          <span className="spec-label">PD</span>
          <span className="spec-value">
            {currentSx?.PD || "---"}
          </span>
        </div>

        {/* CAVITY & CNSX */}
        <div className="spec-item">
          <span className="spec-label">CAVITY</span>
          <span className="spec-value">
            {currentSx?.CAVITY || "---"}
          </span>
        </div>

        <div className="spec-item">
          <span className="spec-label">MÃ CNSX</span>
          <span className="spec-value">
            {currentSx?.INS_EMPL || "---"}
          </span>
        </div>

        {/* TÊN NGUYÊN VẬT LIỆU */}
        <div className="spec-item span-2">
          <span className="spec-label">TÊN VẬT LIỆU & KHỔ (M_NAME | WIDTH)</span>
          <span className="spec-value text-normal" title={m_name}>
            {m_name || "Chưa có thông tin NVL"}
          </span>
        </div>

        {/* THỜI GIAN SETTING OK */}
        <div className="spec-item span-2">
          <span className="spec-label">THỜI GIAN BẮT ĐẦU MASS (ST.OK)</span>
          <span className="spec-value highlight">
            {currentSx?.MASS_START_TIME || "---"}
          </span>
        </div>
      </div>

      <div className="precision-pqc1-directivecard__footer">
        <div className="nvl-info">
          <span>Số Cuộn: <b>{roll_qty || 0}</b></span>
          <span>Lượng Cấp: <b>{(in_cfm_qty || 0).toLocaleString("en-US")} M</b></span>
          <span>Liệu QL SX: <b>{lieql_sx || 0}</b></span>
        </div>
        <span>Nguồn dữ liệu: KHSX P501 & QLSX</span>
      </div>
    </div>
  );
};

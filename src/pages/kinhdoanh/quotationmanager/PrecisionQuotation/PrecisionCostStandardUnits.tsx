import React, { memo } from "react";
import { FiSliders } from "react-icons/fi";
import { CODEDATA, DEFAULT_DM } from "../../interfaces/kdInterface";

interface Props {
  defaultDM: DEFAULT_DM;
  onSetDefaultDM: (keyname: string, value: any) => void;
  selectedCode: CODEDATA;
  onSetCodeInfo: (keyname: string, value: number) => void;
  onOpenVisualizer?: () => void;
}

const unitColumns = [
  { key: "WIDTH_OFFSET", label: "WIDTH_OFFSET" },
  { key: "LENGTH_OFFSET", label: "LENGTH_OFFSET" },
  { key: "KNIFE_UNIT", label: "CP dao T/C" },
  { key: "FILM_UNIT", label: "CP film bản T/C" },
  { key: "INK_UNIT", label: "CP mực T/C" },
  { key: "LABOR_UNIT", label: "CP nhân công T/C" },
  { key: "DELIVERY_UNIT", label: "CP giao hàng T/C" },
  { key: "DEPRECATION_UNIT", label: "CP khấu hao T/C" },
  { key: "GMANAGEMENT_UNIT", label: "CP quản lý chung T/C" },
  { key: "M_LOSS_UNIT", label: "Hao hụt T/C" },
];

const PrecisionCostStandardUnits: React.FC<Props> = ({
  defaultDM,
  selectedCode,
  onSetCodeInfo,
  onOpenVisualizer,
}) => {
  return (
    <section className="stitch-calc__standards-card">
      <div className="standards-title-row">
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FiSliders color="#2563eb" />
          <span>Định Mức Tiêu Chuẩn Chi Phí (Standard vs Actual Cost Rates)</span>
        </div>
        <button
          onClick={onOpenVisualizer}
          className="link-btn"
          title="Xem mô phỏng bản vẽ và file PDF kỹ thuật"
          style={{ background: "none", border: "none" }}
        >
          LINK HỆ THỐNG GỐC / BẢN VẼ ↗
        </button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th style={{ textAlign: "left", width: 90 }}>LOẠI T/C</th>
              {unitColumns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Hàng 1: T/C Mặc định */}
            <tr>
              <td className="row-label">T/C mặc định</td>
              {unitColumns.map((col) => {
                const val = (defaultDM as any)[col.key];
                return (
                  <td key={`def_${col.key}`}>
                    <input
                      type="text"
                      readOnly
                      value={val === null || val === undefined ? 0 : val}
                    />
                  </td>
                );
              })}
            </tr>

            {/* Hàng 2: T/C Hiện tại */}
            <tr style={{ background: "rgba(239, 246, 255, 0.4)" }}>
              <td className="row-label" style={{ color: "#1d4ed8", background: "rgba(219, 234, 254, 0.5)" }}>
                T/C hiện tại_
              </td>
              {unitColumns.map((col) => {
                const val = (selectedCode as any)[col.key];
                return (
                  <td key={`curr_${col.key}`}>
                    <input
                      type="number"
                      className="active-input"
                      value={val === null || val === undefined ? 0 : val}
                      onChange={(e) => onSetCodeInfo(col.key, Number(e.target.value))}
                      title={`Định mức hiện tại của mã: ${col.label}`}
                    />
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default memo(PrecisionCostStandardUnits);

import React from "react";
import { FiGrid } from "react-icons/fi";

interface UnitSummary {
  iqc_in: number;
  out_kho: number;
  input: number;
  used: number;
  remain: number;
  setting: number;
  ng: number;
  result: number;
  btp: number;
  ton_sx: number;
  return_kho: number;
  ins_input: number;
  ins_ok: number;
  ins_output: number;
}

interface PrecisionBaoCaoFullRollSummaryProps {
  summaryMetrics: {
    met: UnitSummary;
    ea: UnitSummary;
    m2: UnitSummary;
  };
}

const PrecisionBaoCaoFullRollSummary: React.FC<PrecisionBaoCaoFullRollSummaryProps> = ({
  summaryMetrics,
}) => {
  const { met, ea, m2 } = summaryMetrics;

  const fmt = (val: number, isDecimal = false) => {
    if (!val) return "0";
    if (isDecimal) {
      return val.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    }
    return Math.round(val).toLocaleString("en-US");
  };

  return (
    <div className="precision-bcfr-summary">
      <div className="precision-bcfr-summary__header">
        <div className="precision-bcfr-summary__title">
          <FiGrid size={13} color="#0284c7" />
          <span>Bảng Tổng Kết Chỉ Số Sản Xuất Toàn Diện (Full Metric Summary)</span>
        </div>
      </div>

      <div className="precision-bcfr-summary__table-wrap">
        <table className="precision-bcfr-summary__table">
          <thead>
            <tr>
              <th className="th-unit">ĐƠN VỊ</th>
              <th>IQC IN</th>
              <th>XUẤT KHO</th>
              <th>INPUT MÁY</th>
              <th>ĐÃ DÙNG</th>
              <th>TỒN MÁY</th>
              <th>CÂN CHỈNH</th>
              <th>HỎNG CĐ</th>
              <th>THÀNH PHẨM</th>
              <th>TỒN BTP</th>
              <th>TỒN KHO SX</th>
              <th>TRẢ VỀ</th>
              <th>KIỂM VÀO</th>
              <th>KIỂM OK</th>
              <th>KIỂM RA</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="td-unit" style={{ color: "#2563eb" }}>MÉT (m)</td>
              <td className="val-met">{fmt(met.iqc_in)}</td>
              <td className="val-met">{fmt(met.out_kho)}</td>
              <td className="val-met">{fmt(met.input)}</td>
              <td className="val-met">{fmt(met.used)}</td>
              <td className="val-met">{fmt(met.remain)}</td>
              <td className="val-met">{fmt(met.setting)}</td>
              <td className="val-met">{fmt(met.ng)}</td>
              <td className="val-met">{fmt(met.result)}</td>
              <td className="val-met">{fmt(met.btp)}</td>
              <td className="val-met">{fmt(met.ton_sx)}</td>
              <td className="val-met">{fmt(met.return_kho)}</td>
              <td className="val-met">{fmt(met.ins_input)}</td>
              <td className="val-met">{fmt(met.ins_ok)}</td>
              <td className="val-met">{fmt(met.ins_output)}</td>
            </tr>
            <tr>
              <td className="td-unit" style={{ color: "#16a34a" }}>CON (EA)</td>
              <td className="val-ea">{fmt(ea.iqc_in)}</td>
              <td className="val-ea">{fmt(ea.out_kho)}</td>
              <td className="val-ea">{fmt(ea.input)}</td>
              <td className="val-ea">{fmt(ea.used)}</td>
              <td className="val-ea">{fmt(ea.remain)}</td>
              <td className="val-ea">{fmt(ea.setting)}</td>
              <td className="val-ea">{fmt(ea.ng)}</td>
              <td className="val-ea">{fmt(ea.result)}</td>
              <td className="val-ea">{fmt(ea.btp)}</td>
              <td className="val-ea">{fmt(ea.ton_sx)}</td>
              <td className="val-ea">{fmt(ea.return_kho)}</td>
              <td className="val-ea">{fmt(ea.ins_input)}</td>
              <td className="val-ea">{fmt(ea.ins_ok)}</td>
              <td className="val-ea">{fmt(ea.ins_output)}</td>
            </tr>
            <tr>
              <td className="td-unit" style={{ color: "#dc2626" }}>DIỆN TÍCH (M²)</td>
              <td className="val-m2">{fmt(m2.iqc_in, true)}</td>
              <td className="val-m2">{fmt(m2.out_kho, true)}</td>
              <td className="val-m2">{fmt(m2.input, true)}</td>
              <td className="val-m2">{fmt(m2.used, true)}</td>
              <td className="val-m2">{fmt(m2.remain, true)}</td>
              <td className="val-m2">{fmt(m2.setting, true)}</td>
              <td className="val-m2">{fmt(m2.ng, true)}</td>
              <td className="val-m2">{fmt(m2.result, true)}</td>
              <td className="val-m2">{fmt(m2.btp, true)}</td>
              <td className="val-m2">{fmt(m2.ton_sx, true)}</td>
              <td className="val-m2">{fmt(m2.return_kho, true)}</td>
              <td className="val-m2">{fmt(m2.ins_input, true)}</td>
              <td className="val-m2">{fmt(m2.ins_ok, true)}</td>
              <td className="val-m2">{fmt(m2.ins_output, true)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default React.memo(PrecisionBaoCaoFullRollSummary);
export { PrecisionBaoCaoFullRollSummary };

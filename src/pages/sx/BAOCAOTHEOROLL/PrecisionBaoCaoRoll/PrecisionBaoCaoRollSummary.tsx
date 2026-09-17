import React from "react";
import { FiClipboard } from "react-icons/fi";
import { SX_BAOCAOROLLDATA } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";

interface Props {
  summarydata: SX_BAOCAOROLLDATA;
}

const PrecisionBaoCaoRollSummary: React.FC<Props> = ({ summarydata }) => {
  const fmt = (val: number, digits = 0) =>
    val?.toLocaleString("en-US", { maximumFractionDigits: digits });

  const allLoss = summarydata.PURE_INPUT > 0
    ? (1 - (summarydata.PURE_OUTPUT * 1.0) / summarydata.PURE_INPUT)
    : 0;

  const cells = [
    { label: "1. INPUT_QTY", value: fmt(summarydata.INPUT_QTY), color: "blue" as const },
    { label: "2. REMAIN_QTY", value: fmt(summarydata.REMAIN_QTY), color: "green" as const },
    { label: "3. USED_QTY", value: fmt(summarydata.USED_QTY), color: "green" as const },
    { label: "4. SETTING_MET", value: fmt(summarydata.SETTING_MET), color: "red" as const },
    { label: "5. PROCESS_NG", value: fmt(summarydata.PR_NG), color: "red" as const },
    { label: "6. OK_MET_AUTO", value: fmt(summarydata.OK_MET_AUTO), color: "green" as const },
    { label: "7. OK_MET_TT", value: fmt(summarydata.OK_MET_TT), color: "green" as const },
    { label: "8. ST_LOSS", value: `${fmt(summarydata.LOSS_ST, 1)}%`, color: "red" as const },
    { label: "9. SX_LOSS", value: `${fmt(summarydata.LOSS_SX, 1)}%`, color: "red" as const },
    { label: "10. LOSS_TT", value: `${fmt(summarydata.LOSS_TT, 1)}%`, color: "red" as const },
    { label: "11. OK_EA", value: fmt(summarydata.OK_EA), color: "green" as const },
    { label: "12. PURE_IN", value: fmt(summarydata.PURE_INPUT), color: "blue" as const },
    { label: "13. PURE_OUT", value: fmt(summarydata.PURE_OUTPUT), color: "blue" as const },
    { label: "14. ALL_LOSS", value: allLoss.toLocaleString("en-US", { style: "percent", maximumFractionDigits: 1 }), color: "red" as const },
  ];

  const borderMap = { blue: "precision-bcr-summary__cell--blue", green: "precision-bcr-summary__cell--green", red: "precision-bcr-summary__cell--red" };
  const valMap = { blue: "precision-bcr-summary__cell-value--blue", green: "precision-bcr-summary__cell-value--green", red: "precision-bcr-summary__cell-value--red" };

  return (
    <div className="precision-bcr-summary">
      <div className="precision-bcr-summary__title">
        <FiClipboard size={14} />
        <span>Tổng Kết Sản Xuất (Production Summary)</span>
      </div>
      <div className="precision-bcr-summary__grid">
        {cells.map((c, i) => (
          <div key={i} className={`precision-bcr-summary__cell ${borderMap[c.color]}`}>
            <span className="precision-bcr-summary__cell-label">{c.label}</span>
            <span className={`precision-bcr-summary__cell-value ${valMap[c.color]}`}>{c.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const MemoizedPrecisionBaoCaoRollSummary = React.memo(PrecisionBaoCaoRollSummary);
export { MemoizedPrecisionBaoCaoRollSummary as PrecisionBaoCaoRollSummary };
export default MemoizedPrecisionBaoCaoRollSummary;

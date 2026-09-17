import React from "react";
import { LOSS_TABLE_DATA } from "../../interfaces/khsxInterface";

export interface PrecisionDataSxSummaryProps {
  losstableinfo?: LOSS_TABLE_DATA;
  summary?: LOSS_TABLE_DATA;
  fullSummary?: boolean;
  onFullSummaryChange?: (val: boolean) => void;
}

const formatNumber = (val: number | undefined, decimals = 0) => {
  if (val === undefined || val === null) return "0";
  return val.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export const PrecisionDataSxSummary: React.FC<PrecisionDataSxSummaryProps> = React.memo(({
  losstableinfo,
  summary: summaryProp,
  fullSummary = false,
  onFullSummaryChange,
}) => {
  const summary = losstableinfo || summaryProp || {
    XUATKHO_MET: 0,
    XUATKHO_EA: 0,
    SCANNED_MET: 0,
    SCANNED_EA: 0,
    PROCESS1_RESULT: 0,
    PROCESS2_RESULT: 0,
    PROCESS3_RESULT: 0,
    PROCESS4_RESULT: 0,
    SX_RESULT: 0,
    INSPECTION_INPUT: 0,
    INSPECT_LOSS_QTY: 0,
    INSPECT_MATERIAL_NG: 0,
    INSPECT_OK_QTY: 0,
    INSPECT_PROCESS_NG: 0,
    INSPECT_TOTAL_NG: 0,
    INSPECT_TOTAL_QTY: 0,
    LOSS_THEM_TUI: 0,
    SX_MARKING_QTY: 0,
    INSPECTION_OUTPUT: 0,
    LOSS_INS_OUT_VS_SCANNED_EA: 0,
    LOSS_INS_OUT_VS_XUATKHO_EA: 0,
    NG1: 0,
    NG2: 0,
    NG3: 0,
    NG4: 0,
    SETTING1: 0,
    SETTING2: 0,
    SETTING3: 0,
    SETTING4: 0,
    SCANNED_EA2: 0,
    SCANNED_EA3: 0,
    SCANNED_EA4: 0,
    SCANNED_MET2: 0,
    SCANNED_MET3: 0,
    SCANNED_MET4: 0,
  };

  return (
    <div className="precision-datasx-summary">
      <div className="summary-header-strip">
        <span className="summary-title-badge">TỔNG HỢP SẢN LƯỢNG &amp; HAO HỤT CÔNG ĐOẠN</span>
        <div className="summary-loss-indicators">
          <div className="loss-badge primary">
            <span className="badge-label">LOSS (INS/SCANNED):</span>
            <span className="badge-val">
              {(summary.LOSS_INS_OUT_VS_SCANNED_EA * 100).toLocaleString("en-US", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })}%
            </span>
          </div>
          <div className="loss-badge danger">
            <span className="badge-label">LOSS (INS/XUẤT KHO):</span>
            <span className="badge-val">
              {(summary.LOSS_INS_OUT_VS_XUATKHO_EA * 100).toLocaleString("en-US", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })}%
            </span>
          </div>
        </div>
      </div>

      <div className="summary-table-scroll">
        <table className="precision-summary-table">
          <thead>
            <tr>
              <th className="col-blue">1.WH_MET</th>
              <th className="col-blue">2.WH_EA</th>
              <th className="col-magenta">3.IP1_MET</th>
              <th className="col-magenta">4.IP1_EA</th>
              {fullSummary && <th className="col-sub">5_1.ST1</th>}
              {fullSummary && <th className="col-sub">5_2.NG1</th>}
              <th className="col-green">5.CD1</th>
              {fullSummary && <th className="col-sub">6_1.IP2_MET</th>}
              {fullSummary && <th className="col-sub">6_2.IP2_EA</th>}
              {fullSummary && <th className="col-sub">6_3.ST2</th>}
              {fullSummary && <th className="col-sub">6_4.NG2</th>}
              <th className="col-green">6.CD2</th>
              {fullSummary && <th className="col-sub">7_1.IP3_MET</th>}
              {fullSummary && <th className="col-sub">7_2.IP3_EA</th>}
              {fullSummary && <th className="col-sub">7_3.ST3</th>}
              {fullSummary && <th className="col-sub">7_4.NG3</th>}
              <th className="col-green">7.CD3</th>
              {fullSummary && <th className="col-sub">8_1.IP4_MET</th>}
              {fullSummary && <th className="col-sub">8_2.IP4_EA</th>}
              {fullSummary && <th className="col-sub">8_3.ST4</th>}
              {fullSummary && <th className="col-sub">8_4.NG4</th>}
              <th className="col-green">8.CD4</th>
              <th className="col-green">9.SX_RESULT</th>
              <th className="col-green">10.INS_INPUT</th>
              {fullSummary && <th className="col-sub">10_1.INS_TT_QTY</th>}
              {fullSummary && <th className="col-sub">10_2.INS_QTY</th>}
              {fullSummary && <th className="col-sub">10_3.MARKING</th>}
              {fullSummary && <th className="col-sub">10_4.INS_OK</th>}
              {fullSummary && <th className="col-sub">10_5.INS_M_NG</th>}
              {fullSummary && <th className="col-sub">10_6.INS_P_NG</th>}
              {fullSummary && <th className="col-sub">10_7.INSP_LOSS</th>}
              {fullSummary && <th className="col-sub">10_8.THEM_TUI</th>}
              <th className="col-green">11.INS_OUTPUT</th>
              <th className="col-red">12.LOSS (11 vs 4) %</th>
              <th className="col-red">13.LOSS2 (11 vs 2) %</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="cell-blue">{formatNumber(summary.XUATKHO_MET)}</td>
              <td className="cell-blue">{formatNumber(summary.XUATKHO_EA)}</td>
              <td className="cell-pink">{formatNumber(summary.SCANNED_MET)}</td>
              <td className="cell-pink">{formatNumber(summary.SCANNED_EA)}</td>
              {fullSummary && <td className="cell-muted">{formatNumber(summary.SETTING1)}</td>}
              {fullSummary && <td className="cell-red">{formatNumber(summary.NG1)}</td>}
              <td className="cell-green">{formatNumber(summary.PROCESS1_RESULT)}</td>
              {fullSummary && <td className="cell-pink">{formatNumber(summary.SCANNED_MET2)}</td>}
              {fullSummary && <td className="cell-pink">{formatNumber(summary.SCANNED_EA2)}</td>}
              {fullSummary && <td className="cell-muted">{formatNumber(summary.SETTING2)}</td>}
              {fullSummary && <td className="cell-red">{formatNumber(summary.NG2)}</td>}
              <td className="cell-green">{formatNumber(summary.PROCESS2_RESULT)}</td>
              {fullSummary && <td className="cell-pink">{formatNumber(summary.SCANNED_MET3)}</td>}
              {fullSummary && <td className="cell-pink">{formatNumber(summary.SCANNED_EA3)}</td>}
              {fullSummary && <td className="cell-muted">{formatNumber(summary.SETTING3)}</td>}
              {fullSummary && <td className="cell-red">{formatNumber(summary.NG3)}</td>}
              <td className="cell-green">{formatNumber(summary.PROCESS3_RESULT)}</td>
              {fullSummary && <td className="cell-pink">{formatNumber(summary.SCANNED_MET4)}</td>}
              {fullSummary && <td className="cell-pink">{formatNumber(summary.SCANNED_EA4)}</td>}
              {fullSummary && <td className="cell-muted">{formatNumber(summary.SETTING4)}</td>}
              {fullSummary && <td className="cell-red">{formatNumber(summary.NG4)}</td>}
              <td className="cell-green">{formatNumber(summary.PROCESS4_RESULT)}</td>
              <td className="cell-green">{formatNumber(summary.SX_RESULT)}</td>
              <td className="cell-green">{formatNumber(summary.INSPECTION_INPUT)}</td>
              {fullSummary && <td className="cell-muted">{formatNumber(summary.INSPECT_TOTAL_QTY)}</td>}
              {fullSummary && <td className="cell-muted">{formatNumber(summary.INSPECT_TOTAL_QTY - summary.SX_MARKING_QTY)}</td>}
              {fullSummary && <td className="cell-muted">{formatNumber(summary.SX_MARKING_QTY)}</td>}
              {fullSummary && <td className="cell-muted">{formatNumber(summary.INSPECT_OK_QTY)}</td>}
              {fullSummary && <td className="cell-red">{formatNumber(summary.INSPECT_MATERIAL_NG)}</td>}
              {fullSummary && <td className="cell-red">{formatNumber(summary.INSPECT_PROCESS_NG)}</td>}
              {fullSummary && <td className="cell-muted">{formatNumber(summary.INSPECT_LOSS_QTY)}</td>}
              {fullSummary && <td className="cell-muted">{formatNumber(summary.LOSS_THEM_TUI)}</td>}
              <td className="cell-green">{formatNumber(summary.INSPECTION_OUTPUT)}</td>
              <td className="cell-loss1">
                {(summary.LOSS_INS_OUT_VS_SCANNED_EA * 100).toLocaleString("en-US", {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })}%
              </td>
              <td className="cell-loss2">
                {(summary.LOSS_INS_OUT_VS_XUATKHO_EA * 100).toLocaleString("en-US", {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default PrecisionDataSxSummary;

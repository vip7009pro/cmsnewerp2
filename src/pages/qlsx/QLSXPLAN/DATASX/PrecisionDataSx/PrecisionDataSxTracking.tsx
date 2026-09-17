import React from "react";
import { DAILY_YCSX_RESULT, YCSX_SX_DATA } from "../../interfaces/khsxInterface";

interface PrecisionDataSxTrackingProps {
  selectedYCSX: YCSX_SX_DATA;
  totalDailyYCSX: DAILY_YCSX_RESULT;
}

export const PrecisionDataSxTracking: React.FC<PrecisionDataSxTrackingProps> = React.memo(({
  selectedYCSX,
  totalDailyYCSX,
}) => {
  const pd = selectedYCSX.PD || 1;
  const cav = selectedYCSX.CAVITY || 1;
  const eaPerMet = (1000 / pd) * cav;
  const reqQty = selectedYCSX.PROD_REQUEST_QTY || 0;

  // Needed EA calculations
  const neededEaLoss1 = (selectedYCSX.LOSS_SX1 * reqQty) / 100;
  const neededEaLoss2 = (selectedYCSX.LOSS_SX2 * reqQty) / 100;
  const neededEaLoss3 = (selectedYCSX.LOSS_SX3 * reqQty) / 100;
  const neededEaLoss4 = (selectedYCSX.LOSS_SX4 * reqQty) / 100;
  const neededEaLossKt = (selectedYCSX.LOSS_KT * reqQty) / 100;
  const neededEaSetting1 = selectedYCSX.LOSS_SETTING1 * (1000.0 / pd) * cav;
  const neededEaSetting2 = selectedYCSX.LOSS_SETTING2 * (1000.0 / pd) * cav;
  const neededEaSetting3 = selectedYCSX.LOSS_SETTING3 * (1000.0 / pd) * cav;
  const neededEaSetting4 = selectedYCSX.LOSS_SETTING4 * (1000.0 / pd) * cav;

  const totalNeededEa = reqQty * (1 + (selectedYCSX.LOSS_SX1 + selectedYCSX.LOSS_SX2 + selectedYCSX.LOSS_SX3 + selectedYCSX.LOSS_KT) / 100) +
    (selectedYCSX.LOSS_SETTING1 + selectedYCSX.LOSS_SETTING2 + selectedYCSX.LOSS_SETTING3) * (1000.0 / pd) * cav;

  // Needed MET calculations
  const baseNeededMet = (reqQty * pd) / cav / 1000;
  const neededMetLoss1 = (selectedYCSX.LOSS_SX1 * reqQty) / 100 / 1000 * pd / cav;
  const neededMetLoss2 = (selectedYCSX.LOSS_SX2 * reqQty) / 100 / 1000 * pd / cav;
  const neededMetLoss3 = (selectedYCSX.LOSS_SX3 * reqQty) / 100 / 1000 * pd / cav;
  const neededMetLoss4 = (selectedYCSX.LOSS_SX4 * reqQty) / 100 / 1000 * pd / cav;
  const neededMetLossKt = (selectedYCSX.LOSS_KT * reqQty) / 100 / 1000 * pd / cav;
  const totalNeededMet = totalNeededEa * pd / cav / 1000;

  // Theory Loss calculations
  const theoryLossSetting1 = reqQty > 0 ? (selectedYCSX.LOSS_SETTING1 * 1000.0 / pd * cav / reqQty * 100) : 0;
  const theoryLossSetting2 = reqQty > 0 ? (selectedYCSX.LOSS_SETTING2 * 1000.0 / pd * cav / reqQty * 100) : 0;
  const theoryLossSetting3 = reqQty > 0 ? (selectedYCSX.LOSS_SETTING3 * 1000.0 / pd * cav / reqQty * 100) : 0;
  const theoryLossSetting4 = reqQty > 0 ? (selectedYCSX.LOSS_SETTING4 * 1000.0 / pd * cav / reqQty * 100) : 0;
  const totalTheoryLoss = reqQty > 0 ? ((totalNeededEa * 100) / reqQty - 100) : 0;

  // Actual Loss total
  const totalActualLoss = (totalDailyYCSX.LOSS1 + totalDailyYCSX.LOSS2 + totalDailyYCSX.LOSS3 + totalDailyYCSX.LOSS_KT) * 100;

  return (
    <div className="precision-datasx-tracking">
      {/* 1. MATERIAL TRACKING TABLE */}
      <div className="tracking-section">
        <div className="tracking-section-header">
          <span className="tracking-title">MATERIAL TRACKING</span>
          <span className="tracking-badge">YCSX: {selectedYCSX.PROD_REQUEST_NO || "---"}</span>
        </div>
        <div className="table-responsive-container">
          <table className="precision-tracking-table">
            <thead>
              <tr>
                <th>WH OUT</th>
                <th>NEXT IN</th>
                <th>IQC IN</th>
                <th>NOT SCANNED</th>
                <th>SCANNED</th>
                <th>REMAIN</th>
                <th>USED</th>
                <th>LOCK</th>
                <th>TỒN KHO SX</th>
                <th>NEXT OUT</th>
                <th>RETURN IQC</th>
                <th>RETURN</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="cell-blue">{(selectedYCSX.M_OUTPUT || 0).toLocaleString("en-US")}</td>
                <td className="cell-blue">{(selectedYCSX.NEXT_IN_QTY || 0).toLocaleString("en-US")}</td>
                <td className="cell-blue">{(selectedYCSX.IQC_IN || 0).toLocaleString("en-US")}</td>
                <td className="cell-muted">{(selectedYCSX.NOT_SCANNED_QTY || 0).toLocaleString("en-US")}</td>
                <td className="cell-purple">{(selectedYCSX.SCANNED_QTY || 0).toLocaleString("en-US")}</td>
                <td className="cell-red">{(selectedYCSX.REMAIN_QTY || 0).toLocaleString("en-US")}</td>
                <td className="cell-red-dark">{(selectedYCSX.USED_QTY || 0).toLocaleString("en-US")}</td>
                <td className="cell-green">{(selectedYCSX.LOCK_QTY || 0).toLocaleString("en-US")}</td>
                <td className="cell-green">{(selectedYCSX.TON_KHO_AO || 0).toLocaleString("en-US")}</td>
                <td className="cell-indigo">{(selectedYCSX.NEXT_OUT_QTY || 0).toLocaleString("en-US")}</td>
                <td className="cell-blue">{(selectedYCSX.RETURN_IQC || 0).toLocaleString("en-US")}</td>
                <td className="cell-teal">{(selectedYCSX.RETURN_QTY || 0).toLocaleString("en-US")}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. YCSX LOSS & SETTING DETAIL TABLE */}
      <div className="tracking-section">
        <div className="tracking-section-header">
          <span className="tracking-title">YCSX LOSS &amp; SETTING DETAIL</span>
          <span className="tracking-subtitle">Mã KH: {selectedYCSX.G_NAME_KD || "---"}</span>
        </div>
        <div className="table-responsive-container">
          <table className="precision-loss-detail-table">
            <thead>
              <tr>
                <th>YCSX NO</th>
                <th>CODE</th>
                <th>EA/MET</th>
                <th>YCSX_QTY</th>
                <th>SETTING 1</th>
                <th>LOSS 1</th>
                <th>SETTING 2</th>
                <th>LOSS 2</th>
                <th>SETTING 3</th>
                <th>LOSS 3</th>
                <th>SETTING 4</th>
                <th>LOSS 4</th>
                <th>INSPECTION</th>
                <th>TOTAL</th>
                <th>UNIT</th>
              </tr>
            </thead>
            <tbody>
              {/* Row 1: Tỷ lệ loss thiết kế */}
              <tr>
                <td rowSpan={5} className="cell-id">{selectedYCSX.PROD_REQUEST_NO}</td>
                <td rowSpan={5} className="cell-code">{selectedYCSX.G_NAME_KD}</td>
                <td className="cell-teal">{eaPerMet.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</td>
                <td className="cell-green-bold">{reqQty.toLocaleString("en-US")}</td>
                <td className="cell-muted">{(selectedYCSX.LOSS_SETTING1 || 0).toLocaleString("en-US")}</td>
                <td className="cell-red">{(selectedYCSX.LOSS_SX1 || 0).toLocaleString("en-US")}%</td>
                <td className="cell-muted">{(selectedYCSX.LOSS_SETTING2 || 0).toLocaleString("en-US")}</td>
                <td className="cell-red">{(selectedYCSX.LOSS_SX2 || 0).toLocaleString("en-US")}%</td>
                <td className="cell-muted">{(selectedYCSX.LOSS_SETTING3 || 0).toLocaleString("en-US")}</td>
                <td className="cell-red">{(selectedYCSX.LOSS_SX3 || 0).toLocaleString("en-US")}%</td>
                <td className="cell-muted">{(selectedYCSX.LOSS_SETTING4 || 0).toLocaleString("en-US")}</td>
                <td className="cell-red">{(selectedYCSX.LOSS_SX4 || 0).toLocaleString("en-US")}%</td>
                <td className="cell-red">{(selectedYCSX.LOSS_KT || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</td>
                <td className="cell-empty"></td>
                <td className="cell-empty"></td>
              </tr>

              {/* Row 2: NEEDED EA */}
              <tr>
                <td className="cell-label-dark">NEEDED EA</td>
                <td className="cell-amber">{reqQty.toLocaleString("en-US")}</td>
                <td className="cell-muted">{neededEaSetting1.toLocaleString("en-US", { maximumFractionDigits: 0 })}</td>
                <td className="cell-red">{neededEaLoss1.toLocaleString("en-US", { maximumFractionDigits: 0 })}</td>
                <td className="cell-muted">{neededEaSetting2.toLocaleString("en-US", { maximumFractionDigits: 0 })}</td>
                <td className="cell-red">{neededEaLoss2.toLocaleString("en-US", { maximumFractionDigits: 0 })}</td>
                <td className="cell-muted">{neededEaSetting3.toLocaleString("en-US", { maximumFractionDigits: 0 })}</td>
                <td className="cell-red">{neededEaLoss3.toLocaleString("en-US", { maximumFractionDigits: 0 })}</td>
                <td className="cell-muted">{neededEaSetting4.toLocaleString("en-US", { maximumFractionDigits: 0 })}</td>
                <td className="cell-red">{neededEaLoss4.toLocaleString("en-US", { maximumFractionDigits: 0 })}</td>
                <td className="cell-red">{neededEaLossKt.toLocaleString("en-US", { maximumFractionDigits: 0 })}</td>
                <td className="cell-green-bold">{totalNeededEa.toLocaleString("en-US", { maximumFractionDigits: 0 })}</td>
                <td className="cell-unit">EA</td>
              </tr>

              {/* Row 3: NEEDED MET */}
              <tr>
                <td className="cell-label-teal">NEEDED MET</td>
                <td className="cell-amber">{baseNeededMet.toLocaleString("en-US", { maximumFractionDigits: 0 })}</td>
                <td className="cell-muted">{(selectedYCSX.LOSS_SETTING1 || 0).toLocaleString("en-US")}</td>
                <td className="cell-red">{neededMetLoss1.toLocaleString("en-US", { maximumFractionDigits: 0 })}</td>
                <td className="cell-muted">{(selectedYCSX.LOSS_SETTING2 || 0).toLocaleString("en-US")}</td>
                <td className="cell-red">{neededMetLoss2.toLocaleString("en-US", { maximumFractionDigits: 0 })}</td>
                <td className="cell-muted">{(selectedYCSX.LOSS_SETTING3 || 0).toLocaleString("en-US")}</td>
                <td className="cell-red">{neededMetLoss3.toLocaleString("en-US", { maximumFractionDigits: 0 })}</td>
                <td className="cell-muted">{(selectedYCSX.LOSS_SETTING4 || 0).toLocaleString("en-US")}</td>
                <td className="cell-red">{neededMetLoss4.toLocaleString("en-US", { maximumFractionDigits: 0 })}</td>
                <td className="cell-red">{neededMetLossKt.toLocaleString("en-US", { maximumFractionDigits: 0 })}</td>
                <td className="cell-green-bold">{totalNeededMet.toLocaleString("en-US", { maximumFractionDigits: 0 })}</td>
                <td className="cell-unit">MET</td>
              </tr>

              {/* Row 4: THEORY LOSS % */}
              <tr>
                <td className="cell-label-magenta">THEORY LOSS %</td>
                <td className="cell-empty"></td>
                <td className="cell-muted">{theoryLossSetting1.toLocaleString("en-US", { maximumFractionDigits: 0 })}%</td>
                <td className="cell-red">{(selectedYCSX.LOSS_SX1 || 0).toLocaleString("en-US")}%</td>
                <td className="cell-muted">{theoryLossSetting2.toLocaleString("en-US", { maximumFractionDigits: 0 })}%</td>
                <td className="cell-red">{(selectedYCSX.LOSS_SX2 || 0).toLocaleString("en-US")}%</td>
                <td className="cell-muted">{theoryLossSetting3.toLocaleString("en-US", { maximumFractionDigits: 0 })}%</td>
                <td className="cell-red">{(selectedYCSX.LOSS_SX3 || 0).toLocaleString("en-US")}%</td>
                <td className="cell-muted">{theoryLossSetting4.toLocaleString("en-US", { maximumFractionDigits: 0 })}%</td>
                <td className="cell-red">{(selectedYCSX.LOSS_SX4 || 0).toLocaleString("en-US")}%</td>
                <td className="cell-red">{(selectedYCSX.LOSS_KT || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</td>
                <td className="cell-green-bold">{totalTheoryLoss.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</td>
                <td className="cell-unit">%</td>
              </tr>

              {/* Row 5: ACTUAL LOSS % */}
              <tr>
                <td className="cell-label-magenta">ACTUAL LOSS %</td>
                <td className="cell-empty"></td>
                <td colSpan={2} className="cell-red-bold">{(totalDailyYCSX.LOSS1 * 100).toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%</td>
                <td colSpan={2} className="cell-red-bold">{(totalDailyYCSX.LOSS2 * 100).toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%</td>
                <td colSpan={2} className="cell-red-bold">{(totalDailyYCSX.LOSS3 * 100).toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%</td>
                <td colSpan={2} className="cell-red-bold">{(totalDailyYCSX.LOSS4 * 100).toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%</td>
                <td className="cell-red-bold">{(totalDailyYCSX.LOSS_KT * 100).toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%</td>
                <td className="cell-green-bold">{totalActualLoss.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</td>
                <td className="cell-unit">%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

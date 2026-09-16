import React from "react";
import { BiTask, BiCheckShield, BiUserCheck, BiNetworkChart } from "react-icons/bi";
import { SampleKpiData } from "./sampleMonitorTypes";

interface PrecisionSampleMonitorKpiProps {
  kpi: SampleKpiData;
}

export const PrecisionSampleMonitorKpi: React.FC<PrecisionSampleMonitorKpiProps> = ({ kpi }) => {
  const completeRate = kpi.totalSamples > 0 ? Math.round((kpi.completedSamples / kpi.totalSamples) * 100) : 0;
  const approveRate = kpi.totalSamples > 0 ? Math.round((kpi.approvedSamples / kpi.totalSamples) * 100) : 0;
  const activeRate = kpi.totalSamples > 0 ? Math.round((kpi.activeSamples / kpi.totalSamples) * 100) : 0;

  return (
    <div className="precision-sample-monitor__kpiGrid">
      {/* Card 1: Tổng số mẫu */}
      <div className="precision-sample-monitor__kpiCard precision-sample-monitor__kpiCard--total">
        <div className="precision-sample-monitor__kpiIconWrapper precision-sample-monitor__kpiIconWrapper--total">
          <BiTask size={18} />
        </div>
        <div className="precision-sample-monitor__kpiContent">
          <span className="precision-sample-monitor__kpiLabel">TỔNG MẪU THEO DÕI</span>
          <div className="precision-sample-monitor__kpiValueRow">
            <span className="precision-sample-monitor__kpiMainValue">{kpi.totalSamples}</span>
            <span className="precision-sample-monitor__kpiSubValue">
              ({kpi.activeSamples} Mở / {kpi.lockedSamples} Khóa)
            </span>
          </div>
          <div className="precision-sample-monitor__kpiMiniProgress">
            <div className="precision-sample-monitor__miniBar">
              <div
                className="precision-sample-monitor__miniBarFill precision-sample-monitor__miniBarFill--total"
                style={{ width: `${activeRate}%` }}
              />
            </div>
            <span className="precision-sample-monitor__miniPercent">{activeRate}% Mở</span>
          </div>
        </div>
      </div>

      {/* Card 2: Hoàn thành công đoạn */}
      <div className="precision-sample-monitor__kpiCard precision-sample-monitor__kpiCard--completed">
        <div className="precision-sample-monitor__kpiIconWrapper precision-sample-monitor__kpiIconWrapper--completed">
          <BiCheckShield size={18} />
        </div>
        <div className="precision-sample-monitor__kpiContent">
          <span className="precision-sample-monitor__kpiLabel">HOÀN THÀNH TẤT CẢ CÔNG ĐOẠN</span>
          <div className="precision-sample-monitor__kpiValueRow">
            <span className="precision-sample-monitor__kpiMainValue">{kpi.completedSamples}</span>
            <span className="precision-sample-monitor__kpiSubValue">
              / {kpi.totalSamples} Mẫu (100% OK)
            </span>
          </div>
          <div className="precision-sample-monitor__kpiMiniProgress">
            <div className="precision-sample-monitor__miniBar">
              <div
                className="precision-sample-monitor__miniBarFill precision-sample-monitor__miniBarFill--completed"
                style={{ width: `${completeRate}%` }}
              />
            </div>
            <span className="precision-sample-monitor__miniPercent">{completeRate}% Xong</span>
          </div>
        </div>
      </div>

      {/* Card 3: Phê duyệt của Khách hàng */}
      <div className="precision-sample-monitor__kpiCard precision-sample-monitor__kpiCard--approved">
        <div className="precision-sample-monitor__kpiIconWrapper precision-sample-monitor__kpiIconWrapper--approved">
          <BiUserCheck size={18} />
        </div>
        <div className="precision-sample-monitor__kpiContent">
          <span className="precision-sample-monitor__kpiLabel">PHÊ DUYỆT KHÁCH HÀNG</span>
          <div className="precision-sample-monitor__kpiValueRow">
            <span className="precision-sample-monitor__kpiMainValue">{kpi.approvedSamples}</span>
            <span className="precision-sample-monitor__kpiSubValue">
              ({kpi.pendingApproveSamples} Chờ / {kpi.rejectedSamples} Từ chối)
            </span>
          </div>
          <div className="precision-sample-monitor__kpiMiniProgress">
            <div className="precision-sample-monitor__miniBar">
              <div
                className="precision-sample-monitor__miniBarFill precision-sample-monitor__miniBarFill--approved"
                style={{ width: `${approveRate}%` }}
              />
            </div>
            <span className="precision-sample-monitor__miniPercent">{approveRate}% Approved</span>
          </div>
        </div>
      </div>

      {/* Card 4: Tiến độ các bộ phận */}
      <div className="precision-sample-monitor__kpiCard precision-sample-monitor__kpiCard--progress">
        <div className="precision-sample-monitor__kpiIconWrapper precision-sample-monitor__kpiIconWrapper--progress">
          <BiNetworkChart size={18} />
        </div>
        <div className="precision-sample-monitor__kpiContent">
          <span className="precision-sample-monitor__kpiLabel">TIẾN ĐỘ TỪNG BỘ PHẬN</span>
          <div className="precision-sample-monitor__kpiValueRow">
            <span className="precision-sample-monitor__kpiMainValue" style={{ fontSize: 13.5 }}>
              R&D: {kpi.rndCompleted} • SX: {kpi.sxCompleted}
            </span>
          </div>
          <div className="precision-sample-monitor__kpiMiniProgress">
            <span className="precision-sample-monitor__kpiSubValue" style={{ fontSize: 10 }}>
              QC: {kpi.qcCompleted} • Kho/Mua: {kpi.materialCompleted}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

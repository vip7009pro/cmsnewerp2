import React from "react";
import { FiActivity, FiCheckCircle } from "react-icons/fi";

interface PrecisionKQDTCHeaderProps {
  totalCount: number;
}

const PrecisionKQDTCHeader: React.FC<PrecisionKQDTCHeaderProps> = ({ totalCount }) => {
  return (
    <div className="precision-kqdtc__header">
      <div className="precision-kqdtc__topBar">
        <div className="precision-kqdtc__headerLeft">
          <div className="precision-kqdtc__iconBadge">
            <FiActivity size={18} />
          </div>
          <div className="precision-kqdtc__titleBlock">
            <div className="precision-kqdtc__titleRow">
              <h1 className="precision-kqdtc__title">
                Độ Tin Cậy • Reliability Test & SPC Analysis
              </h1>
              <span className="precision-kqdtc__codeBadge">Q040</span>
            </div>
            <span className="precision-kqdtc__breadcrumb">
              Hệ Thống ERP / Quản Lý Chất Lượng (QC) / Kiểm Tra Độ Tin Cậy & Kiểm Soát SPC
            </span>
          </div>
        </div>

        <div className="precision-kqdtc__headerRight">
          <div className="precision-kqdtc__sigmaBadge">
            <FiCheckCircle size={13} />
            <span>SPC 6-Sigma: Cp, Cpk ≥ 1.33</span>
          </div>
          <div className="precision-kqdtc__telemetryBadge">
            <span className="precision-kqdtc__pulseDot" />
            <span>Hệ Thống Trực Tuyến ({totalCount.toLocaleString()} mẫu)</span>
          </div>
        </div>
      </div>

      {/* Sub-navigation Workflow Strip */}
      <div className="precision-kqdtc__workflowStrip">
        <div className="precision-kqdtc__navGroup">
          <button type="button" className="precision-kqdtc__navBtn precision-kqdtc__navBtn--active">
            ● TRA KQ ĐTC
          </button>
          <button type="button" className="precision-kqdtc__navBtn">
            TRA SPEC ĐTC
          </button>
          <button type="button" className="precision-kqdtc__navBtn">
            ADD SPEC ĐTC
          </button>
          <button type="button" className="precision-kqdtc__navBtn">
            ĐKÝ TEST ĐTC
          </button>
          <button type="button" className="precision-kqdtc__navBtn">
            NHẬP KQ ĐTC
          </button>
          <button type="button" className="precision-kqdtc__navBtn">
            QUẢN LÝ HẠNG MỤC ĐTC
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionKQDTCHeader);

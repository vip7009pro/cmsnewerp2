import React from "react";
import { AiOutlineSchedule } from "react-icons/ai";
import { QLSXPLANDATA } from "../../interfaces/khsxInterface";

interface PrecisionPlanDataTbHeaderProps {
  plandatatable: QLSXPLANDATA[];
  summarydata: QLSXPLANDATA;
  fromdate: string;
}

export const PrecisionPlanDataTbHeader: React.FC<PrecisionPlanDataTbHeaderProps> = ({
  plandatatable,
  summarydata,
  fromdate,
}) => {
  return (
    <div className="precision-plandatatb__header">
      <div className="header-left">
        <div className="title-icon">
          <AiOutlineSchedule />
        </div>
        <div>
          <div className="title-text">BẢNG QUẢN LÝ CHỈ THỊ SẢN XUẤT</div>
          <div className="subtitle-text">
            Kế hoạch sản xuất phân xưởng • Ngày: {fromdate}
          </div>
        </div>
      </div>

      <div className="kpi-container">
        <div className="kpi-card">
          <div>
            <div className="kpi-card__label">Tổng Lệnh</div>
            <div className="kpi-card__value text-blue">
              {plandatatable.length.toLocaleString("en-US")}
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-card__label">Tổng Plan Qty</div>
            <div className="kpi-card__value text-purple">
              {summarydata.PLAN_QTY?.toLocaleString("en-US")}
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-card__label">Kết Quả SX</div>
            <div className="kpi-card__value text-orange">
              {summarydata.KETQUASX?.toLocaleString("en-US")}
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-card__label">Tỉ Lệ Đạt</div>
            <div className="kpi-card__value text-green">
              {(summarydata.ACHIVEMENT_RATE || 0).toLocaleString("en-US", {
                maximumFractionDigits: 1,
              })}
              %
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

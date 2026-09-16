import React from "react";
import { CS_CONFIRM_TRENDING_DATA } from "../../interfaces/qcInterface";
import { nFormatter } from "../../../../api/services/utilService";
import { getGlobalSetting } from "../../../../api/Api";
import { WEB_SETTING_DATA } from "../../../../api/GlobalInterface";
import { FiAlertCircle, FiCalendar, FiDollarSign, FiShield, FiTrendingDown } from "react-icons/fi";

interface Props {
  dailyppm: CS_CONFIRM_TRENDING_DATA[];
  weeklyppm: CS_CONFIRM_TRENDING_DATA[];
  monthlyppm: CS_CONFIRM_TRENDING_DATA[];
  yearlyppm: CS_CONFIRM_TRENDING_DATA[];
  totalSavingAmount: number;
  totalRMAAmount: number;
  totalTaxiAmount: number;
}

export const PrecisionCSReportKpi: React.FC<Props> = ({
  dailyppm,
  weeklyppm,
  monthlyppm,
  yearlyppm,
  totalSavingAmount,
  totalRMAAmount,
  totalTaxiAmount,
}) => {
  const currency =
    getGlobalSetting()?.filter((e: WEB_SETTING_DATA) => e.ITEM_NAME === "CURRENCY")[0]?.CURRENT_VALUE ?? "USD";
  const currSymbol = currency === "USD" ? "$" : "₫";

  const today = dailyppm[0];
  const thisWeek = weeklyppm[0];
  const thisMonth = monthlyppm[0];
  const thisYear = yearlyppm[0];

  const todayTotal = (today?.C || 0) + (today?.K || 0);
  const weekTotal = (thisWeek?.C || 0) + (thisWeek?.K || 0);
  const monthTotal = (thisMonth?.C || 0) + (thisMonth?.K || 0);
  const yearTotal = (thisYear?.C || 0) + (thisYear?.K || 0);

  const totalFCost = totalRMAAmount + totalTaxiAmount;

  return (
    <div className="pcs-kpi">
      {/* 4 Thẻ Micro-cards KPI */}
      <div className="pcs-kpi__grid">
        {/* Card 1: Hôm nay */}
        <div className="pcs-kpi__card">
          <div className="pcs-kpi__card-top">
            <span className="pcs-kpi__card-title">Sự Cố Hôm Nay (Today)</span>
            <FiAlertCircle size={14} color="#2563eb" />
          </div>
          <div className="pcs-kpi__card-main">
            <span className="pcs-kpi__card-value">{todayTotal}</span>
            <span className="pcs-kpi__card-unit">vụ</span>
          </div>
          <div className="pcs-kpi__card-breakdown">
            <span>CMS (C): <strong style={{ color: "#2563eb" }}>{today?.C || 0}</strong></span>
            <span>Khách (K): <strong style={{ color: "#e11d48" }}>{today?.K || 0}</strong></span>
          </div>
        </div>

        {/* Card 2: Tuần này */}
        <div className="pcs-kpi__card">
          <div className="pcs-kpi__card-top">
            <span className="pcs-kpi__card-title">Sự Cố Tuần Này (Week)</span>
            <FiCalendar size={14} color="#059669" />
          </div>
          <div className="pcs-kpi__card-main">
            <span className="pcs-kpi__card-value">{weekTotal}</span>
            <span className="pcs-kpi__card-unit">vụ</span>
          </div>
          <div className="pcs-kpi__card-breakdown">
            <span>CMS (C): <strong style={{ color: "#2563eb" }}>{thisWeek?.C || 0}</strong></span>
            <span>Khách (K): <strong style={{ color: "#e11d48" }}>{thisWeek?.K || 0}</strong></span>
          </div>
        </div>

        {/* Card 3: Tháng này */}
        <div className="pcs-kpi__card">
          <div className="pcs-kpi__card-top">
            <span className="pcs-kpi__card-title">Sự Cố Tháng Này (Month)</span>
            <FiShield size={14} color="#d97706" />
          </div>
          <div className="pcs-kpi__card-main">
            <span className="pcs-kpi__card-value">{monthTotal}</span>
            <span className="pcs-kpi__card-unit">vụ</span>
          </div>
          <div className="pcs-kpi__card-breakdown">
            <span>CMS (C): <strong style={{ color: "#2563eb" }}>{thisMonth?.C || 0}</strong></span>
            <span>Khách (K): <strong style={{ color: "#e11d48" }}>{thisMonth?.K || 0}</strong></span>
          </div>
        </div>

        {/* Card 4: Năm này */}
        <div className="pcs-kpi__card">
          <div className="pcs-kpi__card-top">
            <span className="pcs-kpi__card-title">Sự Cố Năm Nay (Year)</span>
            <FiTrendingDown size={14} color="#7c3aed" />
          </div>
          <div className="pcs-kpi__card-main">
            <span className="pcs-kpi__card-value">{yearTotal}</span>
            <span className="pcs-kpi__card-unit">vụ</span>
          </div>
          <div className="pcs-kpi__card-breakdown">
            <span>CMS (C): <strong style={{ color: "#2563eb" }}>{thisYear?.C || 0}</strong></span>
            <span>Khách (K): <strong style={{ color: "#e11d48" }}>{thisYear?.K || 0}</strong></span>
          </div>
        </div>
      </div>

      {/* Dải Tóm Tắt Hoạt Động Tài Chính F-Cost & Cost Saving */}
      <div className="pcs-kpi__summary-strip">
        <div className="strip-item">
          <FiDollarSign size={13} color="#059669" />
          <span>Tiết kiệm Cost Saving:</span>
          <strong style={{ color: "#059669" }}>
            {currSymbol}{nFormatter(totalSavingAmount, 2)}
          </strong>
        </div>

        <div className="strip-item">
          <span>Chi phí RMA:</span>
          <strong style={{ color: "#d97706" }}>
            {currSymbol}{nFormatter(totalRMAAmount, 2)}
          </strong>
        </div>

        <div className="strip-item">
          <span>Chi phí Taxi:</span>
          <strong style={{ color: "#2563eb" }}>
            {currSymbol}{nFormatter(totalTaxiAmount, 2)}
          </strong>
        </div>

        <div className="strip-item">
          <span>Tổng F-Cost (RMA + Taxi):</span>
          <strong style={{ color: "#e11d48" }}>
            {currSymbol}{nFormatter(totalFCost, 2)}
          </strong>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionCSReportKpi);

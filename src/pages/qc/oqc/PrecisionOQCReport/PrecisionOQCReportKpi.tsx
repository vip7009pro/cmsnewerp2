import React from "react";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import DateRangeIcon from "@mui/icons-material/DateRange";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
import { OQC_TREND_DATA } from "../../interfaces/qcInterface";

interface Props {
  dailyppm: OQC_TREND_DATA[];
  weeklyppm: OQC_TREND_DATA[];
  monthlyppm: OQC_TREND_DATA[];
  yearlyppm: OQC_TREND_DATA[];
}

export const PrecisionOQCReportKpi: React.FC<Props> = ({
  dailyppm,
  weeklyppm,
  monthlyppm,
  yearlyppm,
}) => {
  const getRate = (arr: OQC_TREND_DATA[]) => {
    if (!arr || arr.length === 0) return 0;
    const rate = Number(arr[0]?.NG_RATE);
    return Number.isFinite(rate) ? rate : 0;
  };

  const getBadge = (rate: number) => {
    if (rate <= 1.0) {
      return { class: "poqc-kpi__card-badge--emerald", text: "TIÊU CHUẨN" };
    }
    if (rate <= 2.5) {
      return { class: "poqc-kpi__card-badge--amber", text: "THEO DÕI" };
    }
    return { class: "poqc-kpi__card-badge--rose", text: "VƯỢT NGƯỠNG" };
  };

  const todayRate = getRate(dailyppm);
  const weekRate = getRate(weeklyppm);
  const monthRate = getRate(monthlyppm);
  const yearRate = getRate(yearlyppm);

  const todayBadge = getBadge(todayRate);
  const weekBadge = getBadge(weekRate);
  const monthBadge = getBadge(monthRate);
  const yearBadge = getBadge(yearRate);

  return (
    <div className="poqc-kpi">
      {/* 1. Today NG */}
      <div className="poqc-kpi__card">
        <div className="poqc-kpi__card-top">
          <span className="poqc-kpi__card-title">Tỷ Lệ Lỗi Hôm Nay (Today NG)</span>
          <TrendingUpIcon className="poqc-kpi__card-icon" style={{ color: "#2563eb" }} />
        </div>
        <div className="poqc-kpi__card-main">
          <span className="poqc-kpi__card-value">{todayRate.toFixed(2)}</span>
          <span className="poqc-kpi__card-unit">%</span>
          <span className={`poqc-kpi__card-badge ${todayBadge.class}`}>{todayBadge.text}</span>
        </div>
        <div className="poqc-kpi__card-sub">
          <span>Tổng Lot xuất: <strong>{dailyppm[0]?.TOTAL_LOT?.toLocaleString() ?? 0}</strong></span>
          {" • "}
          <span>Lot NG: <strong className="text-rose-500">{dailyppm[0]?.NG_LOT ?? 0}</strong></span>
        </div>
      </div>

      {/* 2. This Week NG */}
      <div className="poqc-kpi__card">
        <div className="poqc-kpi__card-top">
          <span className="poqc-kpi__card-title">Tỷ Lệ Lỗi Tuần Này (This Week)</span>
          <DateRangeIcon className="poqc-kpi__card-icon" style={{ color: "#059669" }} />
        </div>
        <div className="poqc-kpi__card-main">
          <span className="poqc-kpi__card-value">{weekRate.toFixed(2)}</span>
          <span className="poqc-kpi__card-unit">%</span>
          <span className={`poqc-kpi__card-badge ${weekBadge.class}`}>{weekBadge.text}</span>
        </div>
        <div className="poqc-kpi__card-sub">
          <span>Tổng Lot xuất: <strong>{weeklyppm[0]?.TOTAL_LOT?.toLocaleString() ?? 0}</strong></span>
          {" • "}
          <span>Lot NG: <strong className="text-rose-500">{weeklyppm[0]?.NG_LOT ?? 0}</strong></span>
        </div>
      </div>

      {/* 3. This Month NG */}
      <div className="poqc-kpi__card">
        <div className="poqc-kpi__card-top">
          <span className="poqc-kpi__card-title">Tỷ Lệ Lỗi Tháng Này (This Month)</span>
          <CalendarMonthIcon className="poqc-kpi__card-icon" style={{ color: "#d97706" }} />
        </div>
        <div className="poqc-kpi__card-main">
          <span className="poqc-kpi__card-value">{monthRate.toFixed(2)}</span>
          <span className="poqc-kpi__card-unit">%</span>
          <span className={`poqc-kpi__card-badge ${monthBadge.class}`}>{monthBadge.text}</span>
        </div>
        <div className="poqc-kpi__card-sub">
          <span>Tổng Lot xuất: <strong>{monthlyppm[0]?.TOTAL_LOT?.toLocaleString() ?? 0}</strong></span>
          {" • "}
          <span>Lot NG: <strong className="text-rose-500">{monthlyppm[0]?.NG_LOT ?? 0}</strong></span>
        </div>
      </div>

      {/* 4. This Year NG */}
      <div className="poqc-kpi__card">
        <div className="poqc-kpi__card-top">
          <span className="poqc-kpi__card-title">Tỷ Lệ Lỗi Năm Nay (This Year)</span>
          <EventRepeatIcon className="poqc-kpi__card-icon" style={{ color: "#7c3aed" }} />
        </div>
        <div className="poqc-kpi__card-main">
          <span className="poqc-kpi__card-value">{yearRate.toFixed(2)}</span>
          <span className="poqc-kpi__card-unit">%</span>
          <span className={`poqc-kpi__card-badge ${yearBadge.class}`}>{yearBadge.text}</span>
        </div>
        <div className="poqc-kpi__card-sub">
          <span>Tổng Lot xuất: <strong>{yearlyppm[0]?.TOTAL_LOT?.toLocaleString() ?? 0}</strong></span>
          {" • "}
          <span>Lot NG: <strong className="text-rose-500">{yearlyppm[0]?.NG_LOT ?? 0}</strong></span>
        </div>
      </div>
    </div>
  );
};

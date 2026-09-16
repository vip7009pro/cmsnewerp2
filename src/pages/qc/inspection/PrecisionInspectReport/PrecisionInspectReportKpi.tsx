import React from "react";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import DateRangeIcon from "@mui/icons-material/DateRange";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
import { DailyPPMData, WeeklyPPMData, MonthlyPPMData, YearlyPPMData } from "../../interfaces/qcInterface";

interface Props {
  dailyppm: DailyPPMData[];
  weeklyppm: WeeklyPPMData[];
  monthlyppm: MonthlyPPMData[];
  yearlyppm: YearlyPPMData[];
}

export const PrecisionInspectReportKpi: React.FC<Props> = ({
  dailyppm, weeklyppm, monthlyppm, yearlyppm,
}) => {
  const getRate = (arr: any[]) => {
    if (!arr || arr.length === 0) return { total: 0, material: 0, process: 0 };
    return {
      total: Number(arr[0]?.TOTAL_PPM) || 0,
      material: Number(arr[0]?.MATERIAL_PPM) || 0,
      process: Number(arr[0]?.PROCESS_PPM) || 0,
    };
  };

  const getYearRate = () => {
    if (!yearlyppm || yearlyppm.length === 0) return { total: 0, material: 0, process: 0 };
    const last = yearlyppm[yearlyppm.length - 1];
    return {
      total: Number(last?.TOTAL_PPM) || 0,
      material: Number(last?.MATERIAL_PPM) || 0,
      process: Number(last?.PROCESS_PPM) || 0,
    };
  };

  const getBadge = (rate: number) => {
    if (rate <= 500) return { cls: "pir-kpi__card-badge--emerald", text: "TIÊU CHUẨN" };
    if (rate <= 2000) return { cls: "pir-kpi__card-badge--amber", text: "THEO DÕI" };
    return { cls: "pir-kpi__card-badge--rose", text: "VƯỢT NGƯỠNG" };
  };

  const today = getRate(dailyppm);
  const week = getRate(weeklyppm);
  const month = getRate(monthlyppm);
  const year = getYearRate();

  const todayBadge = getBadge(today.total);
  const weekBadge = getBadge(week.total);
  const monthBadge = getBadge(month.total);
  const yearBadge = getBadge(year.total);

  const renderCard = (
    title: string,
    rate: { total: number; material: number; process: number },
    badge: { cls: string; text: string },
    icon: React.ReactNode,
  ) => (
    <div className="pir-kpi__card">
      <div className="pir-kpi__card-top">
        <span className="pir-kpi__card-title">{title}</span>
        {icon}
      </div>
      <div className="pir-kpi__card-main">
        <span className="pir-kpi__card-value">{rate.total.toFixed(0)}</span>
        <span className="pir-kpi__card-unit">PPM</span>
        <span className={`pir-kpi__card-badge ${badge.cls}`}>{badge.text}</span>
      </div>
      <div className="pir-kpi__card-sub">
        <span>Process: <strong>{rate.process.toFixed(0)}</strong></span>
        {" • "}
        <span>Material: <strong>{rate.material.toFixed(0)}</strong></span>
      </div>
    </div>
  );

  return (
    <div className="pir-kpi">
      {renderCard("Hôm Qua (Yesterday NG)", today, todayBadge,
        <TrendingUpIcon className="pir-kpi__card-icon" style={{ color: "#2563eb" }} />
      )}
      {renderCard("Tuần Này (This Week NG)", week, weekBadge,
        <DateRangeIcon className="pir-kpi__card-icon" style={{ color: "#059669" }} />
      )}
      {renderCard("Tháng Này (This Month NG)", month, monthBadge,
        <CalendarMonthIcon className="pir-kpi__card-icon" style={{ color: "#d97706" }} />
      )}
      {renderCard("Năm Nay (This Year NG)", year, yearBadge,
        <EventRepeatIcon className="pir-kpi__card-icon" style={{ color: "#7c3aed" }} />
      )}
    </div>
  );
};

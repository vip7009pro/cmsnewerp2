import React from "react";
import { TinhHinhChotKpiStats } from "./useTinhHinhChotData";

interface PrecisionTinhHinhChotKpiProps {
  stats: TinhHinhChotKpiStats;
}

const PrecisionTinhHinhChotKpi: React.FC<PrecisionTinhHinhChotKpiProps> = ({ stats }) => {
  return (
    <div className="precision-thc-kpi">
      {/* Thẻ 1: Tổng Chỉ Thị */}
      <div className="precision-thc-kpi__card precision-thc-kpi__card--blue">
        <div className="precision-thc-kpi__header">
          <span className="precision-thc-kpi__title">Tổng Chỉ Thị Theo Dõi</span>
          <span className="material-symbols-outlined precision-thc-kpi__icon">assignment</span>
        </div>
        <div className="precision-thc-kpi__body">
          <div className="precision-thc-kpi__main-val">
            {stats.totalCommands.toLocaleString("en-US")}
            <span className="precision-thc-kpi__unit">LỆNH</span>
          </div>
          <div className="precision-thc-kpi__sub">
            <span>NM1: <strong>{stats.nm1Total.toLocaleString("en-US")}</strong></span>
            <span className="divider">•</span>
            <span>NM2: <strong>{stats.nm2Total.toLocaleString("en-US")}</strong></span>
          </div>
        </div>
      </div>

      {/* Thẻ 2: Tỷ Lệ Chốt Báo Cáo */}
      <div className="precision-thc-kpi__card precision-thc-kpi__card--emerald">
        <div className="precision-thc-kpi__header">
          <span className="precision-thc-kpi__title">Tỷ Lệ Chốt Báo Cáo</span>
          <span className="material-symbols-outlined precision-thc-kpi__icon">task_alt</span>
        </div>
        <div className="precision-thc-kpi__body">
          <div className="precision-thc-kpi__main-val text-emerald">
            {stats.rateChot}%
            <span className="precision-thc-kpi__tag">
              {stats.rateChot >= 95 ? "TỐT" : "CẦN TĂNG"}
            </span>
          </div>
          <div className="precision-thc-kpi__progress">
            <div
              className="precision-thc-kpi__progress-fill bg-emerald"
              style={{ width: `${Math.min(stats.rateChot, 100)}%` }}
            />
          </div>
          <div className="precision-thc-kpi__sub">
            <span>Đã chốt: <strong className="text-emerald">{stats.totalDaChot.toLocaleString("en-US")}</strong></span>
            <span className="divider">/</span>
            <span>{stats.totalCommands.toLocaleString("en-US")}</span>
          </div>
        </div>
      </div>

      {/* Thẻ 3: Tỷ Lệ Nhập Hiệu Suất */}
      <div className="precision-thc-kpi__card precision-thc-kpi__card--cyan">
        <div className="precision-thc-kpi__header">
          <span className="precision-thc-kpi__title">Tỷ Lệ Nhập Hiệu Suất</span>
          <span className="material-symbols-outlined precision-thc-kpi__icon">speed</span>
        </div>
        <div className="precision-thc-kpi__body">
          <div className="precision-thc-kpi__main-val text-cyan">
            {stats.rateHS}%
            <span className="precision-thc-kpi__tag">
              {stats.rateHS >= 90 ? "ĐẠT" : "CHẬM"}
            </span>
          </div>
          <div className="precision-thc-kpi__progress">
            <div
              className="precision-thc-kpi__progress-fill bg-cyan"
              style={{ width: `${Math.min(stats.rateHS, 100)}%` }}
            />
          </div>
          <div className="precision-thc-kpi__sub">
            <span>Đã nhập: <strong className="text-cyan">{stats.totalDaNhapHS.toLocaleString("en-US")}</strong></span>
            <span className="divider">/</span>
            <span>{stats.totalCommands.toLocaleString("en-US")}</span>
          </div>
        </div>
      </div>

      {/* Thẻ 4: Tồn Đọng Chưa Chốt */}
      <div
        className={`precision-thc-kpi__card ${
          stats.totalChuaChot > 0 ? "precision-thc-kpi__card--red" : "precision-thc-kpi__card--emerald"
        }`}
      >
        <div className="precision-thc-kpi__header">
          <span className="precision-thc-kpi__title">Chưa Chốt Báo Cáo</span>
          <span className="material-symbols-outlined precision-thc-kpi__icon">
            {stats.totalChuaChot > 0 ? "warning" : "check_circle"}
          </span>
        </div>
        <div className="precision-thc-kpi__body">
          <div className={`precision-thc-kpi__main-val ${stats.totalChuaChot > 0 ? "text-red" : "text-emerald"}`}>
            {stats.totalChuaChot.toLocaleString("en-US")}
            <span className="precision-thc-kpi__unit">LỆNH TỒN</span>
          </div>
          <div className="precision-thc-kpi__sub">
            <span>NM1: <strong className={stats.nm1ChuaChot > 0 ? "text-red" : ""}>{stats.nm1ChuaChot}</strong></span>
            <span className="divider">•</span>
            <span>NM2: <strong className={stats.nm2ChuaChot > 0 ? "text-red" : ""}>{stats.nm2ChuaChot}</strong></span>
          </div>
        </div>
      </div>

      {/* Thẻ 5: Tồn Đọng Chưa Nhập HS */}
      <div
        className={`precision-thc-kpi__card ${
          stats.totalChuaNhapHS > 0 ? "precision-thc-kpi__card--amber" : "precision-thc-kpi__card--emerald"
        }`}
      >
        <div className="precision-thc-kpi__header">
          <span className="precision-thc-kpi__title">Chưa Nhập Hiệu Suất</span>
          <span className="material-symbols-outlined precision-thc-kpi__icon">pending_actions</span>
        </div>
        <div className="precision-thc-kpi__body">
          <div className={`precision-thc-kpi__main-val ${stats.totalChuaNhapHS > 0 ? "text-amber" : "text-emerald"}`}>
            {stats.totalChuaNhapHS.toLocaleString("en-US")}
            <span className="precision-thc-kpi__unit">LỆNH</span>
          </div>
          <div className="precision-thc-kpi__sub">
            <span>NM1: <strong className={stats.nm1Total - stats.nm1DaNhapHS > 0 ? "text-amber" : ""}>{stats.nm1Total - stats.nm1DaNhapHS}</strong></span>
            <span className="divider">•</span>
            <span>NM2: <strong className={stats.nm2Total - stats.nm2DaNhapHS > 0 ? "text-amber" : ""}>{stats.nm2Total - stats.nm2DaNhapHS}</strong></span>
          </div>
        </div>
      </div>

      {/* Thẻ 6: So Sánh NM1 vs NM2 */}
      <div className="precision-thc-kpi__card precision-thc-kpi__card--indigo">
        <div className="precision-thc-kpi__header">
          <span className="precision-thc-kpi__title">Hiệu Năng NM1 vs NM2</span>
          <span className="material-symbols-outlined precision-thc-kpi__icon">compare_arrows</span>
        </div>
        <div className="precision-thc-kpi__body">
          <div className="precision-thc-kpi__compare-row">
            <span className="factory-badge factory-badge--nm1">NM1</span>
            <div className="compare-bar">
              <div
                className="compare-bar__fill bg-blue"
                style={{ width: `${Math.min(stats.nm1RateChot, 100)}%` }}
              />
            </div>
            <span className="compare-val">{stats.nm1RateChot}%</span>
          </div>
          <div className="precision-thc-kpi__compare-row">
            <span className="factory-badge factory-badge--nm2">NM2</span>
            <div className="compare-bar">
              <div
                className="compare-bar__fill bg-emerald"
                style={{ width: `${Math.min(stats.nm2RateChot, 100)}%` }}
              />
            </div>
            <span className="compare-val">{stats.nm2RateChot}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionTinhHinhChotKpi);

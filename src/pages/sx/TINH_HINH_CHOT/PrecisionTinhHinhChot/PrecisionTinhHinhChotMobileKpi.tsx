import React from "react";
import { TinhHinhChotKpiStats } from "./useTinhHinhChotData";
import { FiX } from "react-icons/fi";

interface Props {
  stats: TinhHinhChotKpiStats;
  onClose: () => void;
}

/**
 * Micro-KPI Cards dạng dải cuộn ngang cho Mobile:
 * - Tiết kiệm diện tích tối đa cho màn hình nhỏ
 * - Nút [X] đóng nhanh giải phóng 100% diện tích cho bảng dữ liệu
 * - Hiển thị 6 chỉ số trọng yếu: Tổng lệnh, Tỷ lệ chốt, Tỷ lệ nhập HS, Tồn chưa chốt, Tồn chưa nhập HS, So sánh 2 nhà máy
 */
export const PrecisionTinhHinhChotMobileKpi: React.FC<Props> = React.memo(
  ({ stats, onClose }) => {
    return (
      <div className="precision-thc__mobileKpi">
        <div className="mobile-kpi-scroll">
          {/* Nút đóng nhanh KPI */}
          <button
            type="button"
            className="mobile-kpi-close-btn"
            onClick={onClose}
            title="Đóng tóm tắt KPI để mở rộng bảng"
          >
            <FiX size={14} />
          </button>

          {/* Card 1: Tổng Lệnh */}
          <div className="mobile-kpi-chip chip-blue">
            <span className="chip-label">TỔNG LỆNH</span>
            <div className="chip-value-row">
              <span className="chip-main-val">
                {stats.totalCommands.toLocaleString("en-US")}
              </span>
              <span className="chip-sub">
                NM1: <strong>{stats.nm1Total.toLocaleString("en-US")}</strong> • NM2:{" "}
                <strong>{stats.nm2Total.toLocaleString("en-US")}</strong>
              </span>
            </div>
          </div>

          {/* Card 2: Tỷ Lệ Chốt */}
          <div className="mobile-kpi-chip chip-emerald">
            <span className="chip-label">TỶ LỆ CHỐT BC</span>
            <div className="chip-value-row">
              <span className="chip-main-val text-emerald">
                {stats.rateChot}%
              </span>
              <span className="chip-sub">
                Đã chốt:{" "}
                <strong className="text-emerald">
                  {stats.totalDaChot.toLocaleString("en-US")}
                </strong>
                /{stats.totalCommands.toLocaleString("en-US")}
              </span>
            </div>
          </div>

          {/* Card 3: Tỷ Lệ Nhập Hiệu Suất */}
          <div className="mobile-kpi-chip chip-cyan">
            <span className="chip-label">TỶ LỆ NHẬP HS</span>
            <div className="chip-value-row">
              <span className="chip-main-val text-cyan">
                {stats.rateHS}%
              </span>
              <span className="chip-sub">
                Đã nhập:{" "}
                <strong className="text-cyan">
                  {stats.totalDaNhapHS.toLocaleString("en-US")}
                </strong>
                /{stats.totalCommands.toLocaleString("en-US")}
              </span>
            </div>
          </div>

          {/* Card 4: Tồn Chưa Chốt */}
          <div
            className={`mobile-kpi-chip ${
              stats.totalChuaChot > 0 ? "chip-red" : "chip-emerald"
            }`}
          >
            <span className="chip-label">CHƯA CHỐT BC</span>
            <div className="chip-value-row">
              <span
                className={`chip-main-val ${
                  stats.totalChuaChot > 0 ? "text-red" : "text-emerald"
                }`}
              >
                {stats.totalChuaChot.toLocaleString("en-US")}
              </span>
              <span className="chip-sub">
                NM1:{" "}
                <strong className={stats.nm1ChuaChot > 0 ? "text-red" : ""}>
                  {stats.nm1ChuaChot}
                </strong>{" "}
                • NM2:{" "}
                <strong className={stats.nm2ChuaChot > 0 ? "text-red" : ""}>
                  {stats.nm2ChuaChot}
                </strong>
              </span>
            </div>
          </div>

          {/* Card 5: Tồn Chưa Nhập Hiệu Suất */}
          <div
            className={`mobile-kpi-chip ${
              stats.totalChuaNhapHS > 0 ? "chip-amber" : "chip-emerald"
            }`}
          >
            <span className="chip-label">CHƯA NHẬP HS</span>
            <div className="chip-value-row">
              <span
                className={`chip-main-val ${
                  stats.totalChuaNhapHS > 0 ? "text-amber" : "text-emerald"
                }`}
              >
                {stats.totalChuaNhapHS.toLocaleString("en-US")}
              </span>
              <span className="chip-sub">
                NM1:{" "}
                <strong
                  className={
                    stats.nm1Total - stats.nm1DaNhapHS > 0 ? "text-amber" : ""
                  }
                >
                  {stats.nm1Total - stats.nm1DaNhapHS}
                </strong>{" "}
                • NM2:{" "}
                <strong
                  className={
                    stats.nm2Total - stats.nm2DaNhapHS > 0 ? "text-amber" : ""
                  }
                >
                  {stats.nm2Total - stats.nm2DaNhapHS}
                </strong>
              </span>
            </div>
          </div>

          {/* Card 6: So Sánh NM1 vs NM2 */}
          <div className="mobile-kpi-chip chip-indigo">
            <span className="chip-label">NM1 VS NM2 CHỐT</span>
            <div className="chip-value-row">
              <span className="chip-sub">
                NM1: <strong className="text-blue">{stats.nm1RateChot}%</strong>{" "}
                • NM2:{" "}
                <strong className="text-emerald">{stats.nm2RateChot}%</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

PrecisionTinhHinhChotMobileKpi.displayName = "PrecisionTinhHinhChotMobileKpi";
export default PrecisionTinhHinhChotMobileKpi;

import React, { useMemo } from "react";
import { FaTasks, FaCheckCircle, FaSpinner } from "react-icons/fa";
import { GiCurvyKnife, GiArchiveRegister } from "react-icons/gi";
import { AiFillSetting } from "react-icons/ai";
import { SX_DATA } from "../../interfaces/khsxInterface";

interface PrecisionPlanStatusKpiProps {
  data: SX_DATA[];
}

export const PrecisionPlanStatusKpi: React.FC<PrecisionPlanStatusKpiProps> = React.memo(({ data }) => {
  const metrics = useMemo(() => {
    const total = data.length;
    const choDao = data.filter((x) => x.XUATDAO === null).length;
    const choLieu = data.filter((x) => x.XUATLIEU === null).length;
    const dangSetting = data.filter((x) => x.SETTING_START_TIME !== null && x.MASS_START_TIME === null).length;
    const dangMass = data.filter((x) => x.MASS_START_TIME !== null && x.CHOTBC === null).length;
    const daChotBc = data.filter((x) => x.CHOTBC !== null).length;
    const pctChot = total === 0 ? 0 : Math.round((daChotBc / total) * 100);

    return {
      total,
      choDao,
      choLieu,
      dangSetting,
      dangMass,
      daChotBc,
      pctChot,
    };
  }, [data]);

  return (
    <div className="precision-plan-status-kpi">
      {/* 1. Tổng Chỉ Thị */}
      <div className="kpi-card kpi-total">
        <div className="kpi-icon-wrap">
          <FaTasks />
        </div>
        <div className="kpi-content">
          <span className="kpi-title">Tổng Chỉ Thị</span>
          <div className="kpi-metric-row">
            <span className="kpi-value">{metrics.total.toLocaleString("en-US")}</span>
            <span className="kpi-sub">lệnh</span>
          </div>
        </div>
      </div>

      {/* 2. Chờ Xuất Dao */}
      <div className="kpi-card kpi-dao">
        <div className="kpi-icon-wrap">
          <GiCurvyKnife />
        </div>
        <div className="kpi-content">
          <span className="kpi-title">Chờ Xuất Dao</span>
          <div className="kpi-metric-row">
            <span className="kpi-value">{metrics.choDao.toLocaleString("en-US")}</span>
            <span className="kpi-sub">lệnh</span>
          </div>
        </div>
      </div>

      {/* 3. Chờ Xuất Liệu */}
      <div className="kpi-card kpi-lieu">
        <div className="kpi-icon-wrap">
          <GiArchiveRegister />
        </div>
        <div className="kpi-content">
          <span className="kpi-title">Chờ Xuất Liệu</span>
          <div className="kpi-metric-row">
            <span className="kpi-value">{metrics.choLieu.toLocaleString("en-US")}</span>
            <span className="kpi-sub">lệnh</span>
          </div>
        </div>
      </div>

      {/* 4. Đang Setting */}
      <div className="kpi-card kpi-setting">
        <div className="kpi-icon-wrap">
          <AiFillSetting />
        </div>
        <div className="kpi-content">
          <span className="kpi-title">Đang Setting</span>
          <div className="kpi-metric-row">
            <span className="kpi-value">{metrics.dangSetting.toLocaleString("en-US")}</span>
            <span className="kpi-sub">lệnh</span>
          </div>
        </div>
      </div>

      {/* 5. Đang Chạy Mass */}
      <div className="kpi-card kpi-mass">
        <div className="kpi-icon-wrap">
          <FaSpinner />
        </div>
        <div className="kpi-content">
          <span className="kpi-title">Đang Chạy Mass</span>
          <div className="kpi-metric-row">
            <span className="kpi-value">{metrics.dangMass.toLocaleString("en-US")}</span>
            <span className="kpi-sub">lệnh</span>
          </div>
        </div>
      </div>

      {/* 6. Đã Chốt Báo Cáo */}
      <div className="kpi-card kpi-done">
        <div className="kpi-icon-wrap">
          <FaCheckCircle />
        </div>
        <div className="kpi-content">
          <span className="kpi-title">Đã Chốt Báo Cáo</span>
          <div className="kpi-metric-row">
            <span className="kpi-value">{metrics.daChotBc.toLocaleString("en-US")}</span>
            <span className="kpi-sub">({metrics.pctChot}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
});

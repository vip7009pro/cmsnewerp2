import React, { useMemo } from "react";
import { FaTasks, FaCheckCircle, FaSpinner } from "react-icons/fa";
import { GiCurvyKnife, GiArchiveRegister } from "react-icons/gi";
import { AiFillSetting } from "react-icons/ai";
import { FiX } from "react-icons/fi";
import { SX_DATA } from "../../interfaces/khsxInterface";

interface PrecisionPlanStatusMobileKpiProps {
  data: SX_DATA[];
  onClose: () => void;
}

export const PrecisionPlanStatusMobileKpi: React.FC<
  PrecisionPlanStatusMobileKpiProps
> = React.memo(({ data, onClose }) => {
  const metrics = useMemo(() => {
    const total = data.length;
    const choDao = data.filter((x) => x.XUATDAO === null).length;
    const choLieu = data.filter((x) => x.XUATLIEU === null).length;
    const dangSetting = data.filter(
      (x) => x.SETTING_START_TIME !== null && x.MASS_START_TIME === null
    ).length;
    const dangMass = data.filter(
      (x) => x.MASS_START_TIME !== null && x.CHOTBC === null
    ).length;
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
    <div className="precision-plan-status-mobile-kpi-bar">
      <div className="mobile-kpi-scroll">
        {/* 1. Tổng */}
        <div className="mobile-kpi-chip kpi-total">
          <FaTasks className="kpi-icon" />
          <span className="kpi-label">Tổng:</span>
          <strong>{metrics.total.toLocaleString("en-US")}</strong>
        </div>

        {/* 2. Chờ Xuất Dao */}
        <div className="mobile-kpi-chip kpi-dao">
          <GiCurvyKnife className="kpi-icon" />
          <span className="kpi-label">Chờ Dao:</span>
          <strong>{metrics.choDao.toLocaleString("en-US")}</strong>
        </div>

        {/* 3. Chờ Xuất Liệu */}
        <div className="mobile-kpi-chip kpi-lieu">
          <GiArchiveRegister className="kpi-icon" />
          <span className="kpi-label">Chờ Liệu:</span>
          <strong>{metrics.choLieu.toLocaleString("en-US")}</strong>
        </div>

        {/* 4. Đang Setting */}
        <div className="mobile-kpi-chip kpi-setting">
          <AiFillSetting className="kpi-icon" />
          <span className="kpi-label">Setting:</span>
          <strong>{metrics.dangSetting.toLocaleString("en-US")}</strong>
        </div>

        {/* 5. Chạy Mass */}
        <div className="mobile-kpi-chip kpi-mass">
          <FaSpinner className="kpi-icon" />
          <span className="kpi-label">Mass:</span>
          <strong>{metrics.dangMass.toLocaleString("en-US")}</strong>
        </div>

        {/* 6. Chốt BC */}
        <div className="mobile-kpi-chip kpi-done">
          <FaCheckCircle className="kpi-icon" />
          <span className="kpi-label">Chốt BC:</span>
          <strong>
            {metrics.daChotBc.toLocaleString("en-US")} ({metrics.pctChot}%)
          </strong>
        </div>
      </div>

      <button
        type="button"
        className="mobile-kpi-close-btn"
        onClick={onClose}
        title="Đóng tóm tắt KPI"
      >
        <FiX size={14} />
      </button>
    </div>
  );
});

export default PrecisionPlanStatusMobileKpi;

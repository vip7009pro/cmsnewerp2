import React, { useMemo } from "react";
import { TEMLOTSX_DATA } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";
import {
  FaBarcode,
  FaBoxes,
  FaRulerCombined,
  FaIndustry,
  FaExchangeAlt,
  FaTools,
  FaTimes,
} from "react-icons/fa";

interface PrecisionLichSuTemLotSxMobileKpiProps {
  data: TEMLOTSX_DATA[];
  onClose: () => void;
}

export const PrecisionLichSuTemLotSxMobileKpi: React.FC<
  PrecisionLichSuTemLotSxMobileKpiProps
> = ({ data, onClose }) => {
  const kpi = useMemo(() => {
    const totalLots = data.length;
    let totalQty = 0;
    let totalMeters = 0;
    let nm1Count = 0;
    let nm2Count = 0;
    let pendingLots = 0;
    let transferredLots = 0;
    let settingMeters = 0;
    let ngMeters = 0;

    data.forEach((item) => {
      const qty = Number(item.TEMP_QTY) || 0;
      const met = Number(item.TEMP_MET) || 0;
      totalQty += qty;
      totalMeters += met;

      if (item.FACTORY === "NM1") nm1Count++;
      else if (item.FACTORY === "NM2") nm2Count++;

      if (
        item.LOT_STATUS === null ||
        item.LOT_STATUS === undefined ||
        item.LOT_STATUS === ""
      ) {
        pendingLots++;
      } else {
        transferredLots++;
      }

      settingMeters += Number(item.SETTING_MET) || 0;
      ngMeters += Number(item.PR_NG) || 0;
    });

    const nm1Rate = totalLots > 0 ? (nm1Count / totalLots) * 100 : 0;
    const nm2Rate = totalLots > 0 ? (nm2Count / totalLots) * 100 : 0;
    const pendingRate = totalLots > 0 ? (pendingLots / totalLots) * 100 : 0;

    return {
      totalLots,
      totalQty,
      totalMeters,
      nm1Count,
      nm2Count,
      nm1Rate,
      nm2Rate,
      pendingLots,
      transferredLots,
      pendingRate,
      settingMeters,
      ngMeters,
    };
  }, [data]);

  return (
    <div className="precision-lichsutemlotsx-mobile-kpi">
      <div className="kpi-scroll-container">
        {/* Card 1: Tổng Tem Đã In */}
        <div className="mobile-kpi-chip mobile-kpi-chip--purple">
          <FaBarcode className="chip-icon" />
          <div className="chip-content">
            <span className="chip-label">TỔNG TEM</span>
            <span className="chip-value">{kpi.totalLots.toLocaleString("en-US")} Lots</span>
          </div>
        </div>

        {/* Card 2: Tổng Sản Lượng EA */}
        <div className="mobile-kpi-chip mobile-kpi-chip--blue">
          <FaBoxes className="chip-icon" />
          <div className="chip-content">
            <span className="chip-label">SẢN LƯỢNG</span>
            <span className="chip-value">{kpi.totalQty.toLocaleString("en-US")} EA</span>
          </div>
        </div>

        {/* Card 3: Chiều Dài Mét */}
        <div className="mobile-kpi-chip mobile-kpi-chip--teal">
          <FaRulerCombined className="chip-icon" />
          <div className="chip-content">
            <span className="chip-label">CHIỀU DÀI</span>
            <span className="chip-value">
              {kpi.totalMeters.toLocaleString("en-US", { maximumFractionDigits: 1 })} m
            </span>
          </div>
        </div>

        {/* Card 4: Nhà Máy */}
        <div className="mobile-kpi-chip mobile-kpi-chip--emerald">
          <FaIndustry className="chip-icon" />
          <div className="chip-content">
            <span className="chip-label">NM1 / NM2</span>
            <span className="chip-value">
              {kpi.nm1Count} / {kpi.nm2Count} ({kpi.nm1Rate.toFixed(0)}%)
            </span>
          </div>
        </div>

        {/* Card 5: Chờ Chuyển CĐ */}
        <div className="mobile-kpi-chip mobile-kpi-chip--amber">
          <FaExchangeAlt className="chip-icon" />
          <div className="chip-content">
            <span className="chip-label">CHỜ CHUYỂN CĐ</span>
            <span className="chip-value">
              {kpi.pendingLots} ({kpi.pendingRate.toFixed(0)}%)
            </span>
          </div>
        </div>

        {/* Card 6: Cân Chỉnh & NG CĐ */}
        <div className="mobile-kpi-chip mobile-kpi-chip--rose">
          <FaTools className="chip-icon" />
          <div className="chip-content">
            <span className="chip-label">SET / NG CĐ</span>
            <span className="chip-value">
              {kpi.settingMeters.toFixed(0)}m / {kpi.ngMeters.toFixed(0)}m
            </span>
          </div>
        </div>
      </div>

      {/* Nút đóng nhanh dải KPI để giải phóng không gian */}
      <button
        type="button"
        className="btn-close-mobile-kpi"
        onClick={onClose}
        title="Đóng thanh KPI để mở rộng bảng dữ liệu"
      >
        <FaTimes size={11} />
      </button>
    </div>
  );
};

export default React.memo(PrecisionLichSuTemLotSxMobileKpi);

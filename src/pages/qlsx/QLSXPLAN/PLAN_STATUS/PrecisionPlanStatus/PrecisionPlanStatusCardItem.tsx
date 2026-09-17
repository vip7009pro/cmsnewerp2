import React from "react";
import { GiArchiveRegister, GiCurvyKnife } from "react-icons/gi";
import { AiFillSetting } from "react-icons/ai";
import { HiLogout, HiOutlineQrcode } from "react-icons/hi";
import { TbPrinter, TbReportAnalytics } from "react-icons/tb";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { SX_DATA } from "../../interfaces/khsxInterface";

interface PrecisionPlanStatusCardItemProps {
  DATA: SX_DATA;
}

export const PrecisionPlanStatusCardItem: React.FC<PrecisionPlanStatusCardItemProps> = React.memo(({ DATA }) => {
  const kq_tem: number =
    DATA.CHOTBC === null
      ? DATA.KQ_SX_TAM === null
        ? 0
        : DATA.KQ_SX_TAM
      : DATA.KETQUASX || 0;

  const planQty = DATA.PLAN_QTY || 0;
  const phantram_tem: number = planQty === 0 ? 0 : Math.min(Math.round((kq_tem / planQty) * 100), 200);

  const isXuatDao = DATA.XUATDAO !== null;
  const isBdSetting = DATA.SETTING_START_TIME !== null;
  const isKtSetting = DATA.MASS_START_TIME !== null;
  const isDkxl = DATA.DKXL !== null;
  const isXuatLieu = DATA.XUATLIEU !== null;
  const isInTem = DATA.IN_TEM !== null;
  const isChotBc = DATA.CHOTBC !== null;

  const getProgressColorClass = () => {
    if (phantram_tem >= 100) return "fill-green";
    if (phantram_tem >= 50) return "fill-blue";
    return "fill-amber";
  };

  return (
    <div className="status-pipeline-card">
      {/* 1. Hàng thông tin định danh và sản lượng */}
      <div className="card-top-row">
        <div className="plan-meta-left">
          <span className="badge-index">#{DATA.id !== undefined ? DATA.id + 1 : 1}</span>
          <span className="badge-plan-id">{DATA.PLAN_ID}</span>
          <span className="badge-prod-name">
            <HiOutlineQrcode />
            {DATA.G_NAME_KD || "---"}
          </span>
          <span className="meta-tag">{DATA.PLAN_DATE}</span>
          <span className="meta-tag tag-shift">
            {DATA.WORK_SHIFT === null ? "CHƯA SX" : DATA.WORK_SHIFT === "DAY" ? "CA NGÀY" : "CA ĐÊM"}
          </span>
          <span className="meta-tag tag-factory">{DATA.PLAN_FACTORY}</span>
          <span className="meta-tag tag-eq">{DATA.PLAN_EQ}</span>
          <span className="meta-tag tag-step">STEP: {DATA.STEP === 0 ? "F" : DATA.STEP}</span>
        </div>

        <div className="plan-progress-right">
          <div className="qty-metrics">
            <span className="qty-actual">{kq_tem.toLocaleString("en-US")}</span>
            <span className="qty-slash">/</span>
            <span className="qty-plan">{planQty.toLocaleString("en-US")}</span>
          </div>

          <div className="progress-bar-wrap">
            <div className="progress-track">
              <div
                className={`progress-fill ${getProgressColorClass()}`}
                style={{ width: `${Math.min(phantram_tem, 100)}%` }}
              />
            </div>
            <span className="progress-percent">{phantram_tem}%</span>
          </div>
        </div>
      </div>

      {/* 2. Stepper 7 mốc trạng thái theo chiều ngang */}
      <div className="card-stepper-row">
        <div className={`step-item ${isXuatDao ? "done" : "pending"}`}>
          <GiCurvyKnife className="step-icon" />
          <span className="step-name">{isXuatDao ? "Đã Xuất Dao" : "Chưa Xuất Dao"}</span>
        </div>

        <div className={`step-item ${isBdSetting ? "done" : "pending"}`}>
          <AiFillSetting className="step-icon" />
          <span className="step-name">{isBdSetting ? "Đã BĐ Setting" : "Chưa BĐ Setting"}</span>
        </div>

        <div className={`step-item ${isKtSetting ? "done" : "pending"}`}>
          <AiFillSetting className="step-icon" />
          <span className="step-name">{isKtSetting ? "Đã KT Setting" : "Chưa KT Setting"}</span>
        </div>

        <div className={`step-item ${isDkxl ? "done" : "pending"}`}>
          <GiArchiveRegister className="step-icon" />
          <span className="step-name">{isDkxl ? "Đã ĐK Liệu" : "Chưa ĐK Liệu"}</span>
        </div>

        <div className={`step-item ${isXuatLieu ? "done" : "pending"}`}>
          <HiLogout className="step-icon" />
          <span className="step-name">{isXuatLieu ? "Đã Xuất Liệu" : "Chưa Xuất Liệu"}</span>
        </div>

        <div className={`step-item ${isInTem ? "done" : "pending"}`}>
          <TbPrinter className="step-icon" />
          <span className="step-name">{isInTem ? "Đã In Tem" : "Chưa In Tem"}</span>
        </div>

        <div className={`step-item ${isChotBc ? "done" : "pending"}`}>
          <TbReportAnalytics className="step-icon" />
          <span className="step-name">{isChotBc ? "Đã Chốt BC" : "Chưa Chốt BC"}</span>
        </div>
      </div>
    </div>
  );
});

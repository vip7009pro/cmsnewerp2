import React from "react";
import { FiUsers, FiUserCheck, FiUserX, FiClock } from "react-icons/fi";
import { DIEMDANHMAINDEPT, DIEMDANHFULLSUMMARY } from "../../interfaces/nhansuInterface";

interface PrecisionBaoCaoKpiProps {
  mainDeptData: Array<DIEMDANHMAINDEPT>;
  fullSummaryData: Array<DIEMDANHFULLSUMMARY>;
}

export const PrecisionBaoCaoKpi: React.FC<PrecisionBaoCaoKpiProps> = ({
  mainDeptData,
  fullSummaryData,
}) => {
  // Lấy dòng TOTAL từ fullSummaryData hoặc mainDeptData
  const totalSummary = fullSummaryData.find((item) => item.MAINDEPTNAME === "TOTAL");
  const totalMainDept = mainDeptData.find((item) => item.MAINDEPTNAME === "TOTAL");

  const totalHeadcount = totalSummary?.COUNT_TOTAL ?? totalMainDept?.COUNT_TOTAL ?? 0;
  const actualPresent = totalSummary?.COUNT_ON ?? totalMainDept?.COUT_ON ?? 0;
  const offCount = totalSummary?.COUNT_OFF ?? totalMainDept?.COUT_OFF ?? 0;
  const pendingCount = totalSummary?.COUNT_CDD ?? totalMainDept?.COUNT_CDD ?? 0;

  const onRate = totalHeadcount > 0 ? (actualPresent / totalHeadcount) * 100 : 0;
  const offRate = totalHeadcount > 0 ? (offCount / totalHeadcount) * 100 : 0;
  const pendingRate = totalHeadcount > 0 ? (pendingCount / totalHeadcount) * 100 : 0;

  return (
    <section className="precision-baocao__kpis">
      {/* 1. Tổng quân số */}
      <div className="precision-baocao__kpiCard precision-baocao__kpiCard--blue">
        <div className="precision-baocao__kpiContent">
          <span className="precision-baocao__kpiLabel">Tổng quân số nhà máy</span>
          <div className="precision-baocao__kpiValueRow">
            <span className="precision-baocao__kpiValue">
              {totalHeadcount.toLocaleString("vi-VN")}
            </span>
            <span className="precision-baocao__kpiRate precision-baocao__kpiRate--blue">
              Nhân sự
            </span>
          </div>
          <span className="precision-baocao__kpiSubText">100% biên chế quản trị</span>
        </div>
        <div className="precision-baocao__kpiIcon">
          <FiUsers size={20} />
        </div>
      </div>

      {/* 2. Đi làm thực tế */}
      <div className="precision-baocao__kpiCard precision-baocao__kpiCard--green">
        <div className="precision-baocao__kpiContent">
          <span className="precision-baocao__kpiLabel">Đi làm thực tế</span>
          <div className="precision-baocao__kpiValueRow">
            <span className="precision-baocao__kpiValue">
              {actualPresent.toLocaleString("vi-VN")}
            </span>
            <span className="precision-baocao__kpiRate precision-baocao__kpiRate--green">
              {onRate.toFixed(1)}%
            </span>
          </div>
          <span className="precision-baocao__kpiSubText">Tỷ lệ chuyên cần đạt chuẩn</span>
        </div>
        <div className="precision-baocao__kpiIcon">
          <FiUserCheck size={20} />
        </div>
      </div>

      {/* 3. Nghỉ làm */}
      <div className="precision-baocao__kpiCard precision-baocao__kpiCard--red">
        <div className="precision-baocao__kpiContent">
          <span className="precision-baocao__kpiLabel">Nghỉ làm có / không phép</span>
          <div className="precision-baocao__kpiValueRow">
            <span className="precision-baocao__kpiValue">
              {offCount.toLocaleString("vi-VN")}
            </span>
            <span className="precision-baocao__kpiRate precision-baocao__kpiRate--red">
              {offRate.toFixed(1)}%
            </span>
          </div>
          <span className="precision-baocao__kpiSubText">
            {totalSummary?.PHEP_NAM ?? 0} phép năm • {totalSummary?.KHONG_LY_DO ?? 0} không phép
          </span>
        </div>
        <div className="precision-baocao__kpiIcon">
          <FiUserX size={20} />
        </div>
      </div>

      {/* 4. Chưa điểm danh / Chờ quẹt */}
      <div className="precision-baocao__kpiCard precision-baocao__kpiCard--amber">
        <div className="precision-baocao__kpiContent">
          <span className="precision-baocao__kpiLabel">Chưa ĐD / Chờ quẹt thẻ</span>
          <div className="precision-baocao__kpiValueRow">
            <span className="precision-baocao__kpiValue">
              {pendingCount.toLocaleString("vi-VN")}
            </span>
            <span className="precision-baocao__kpiRate precision-baocao__kpiRate--amber">
              {pendingRate.toFixed(1)}%
            </span>
          </div>
          <span className="precision-baocao__kpiSubText">SX & Team chuyển ca kíp</span>
        </div>
        <div className="precision-baocao__kpiIcon">
          <FiClock size={20} />
        </div>
      </div>
    </section>
  );
};

export default PrecisionBaoCaoKpi;

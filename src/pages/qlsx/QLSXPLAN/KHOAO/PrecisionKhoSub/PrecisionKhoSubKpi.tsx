import React, { useMemo } from "react";
import moment from "moment";
import { datediff } from "../../../../kinhdoanh/utils/kdUtils";
import { AiOutlineInbox, AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";
import { BiLayer, BiImport } from "react-icons/bi";

interface PrecisionKhoSubKpiProps {
  activeTab: "TON" | "LS_IN";
  data: any[];
}

export const PrecisionKhoSubKpi: React.FC<PrecisionKhoSubKpiProps> = ({ activeTab, data }) => {
  const stats = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        totalRows: 0,
        totalRolls: 0,
        totalQty: 0,
        overdueCount: 0,
        uniqueCodes: 0,
        fscCount: 0,
      };
    }

    const uniqueCodesSet = new Set<string>();
    let totalRolls = 0;
    let totalQty = 0;
    let overdueCount = 0;
    let fscCount = 0;

    const todayStr = moment.utc().format("YYYY-MM-DD");

    data.forEach((row) => {
      if (row.M_CODE) uniqueCodesSet.add(row.M_CODE);
      if (row.ROLL_QTY) totalRolls += Number(row.ROLL_QTY) || 0;

      if (activeTab === "TON") {
        totalQty += Number(row.TOTAL_IN_QTY || row.IN_QTY || 0);

        if (row.INS_DATE) {
          let diff = datediff(todayStr, row.INS_DATE);
          const weekday = moment.utc(row.INS_DATE).weekday();
          if (weekday >= 5) diff -= 2;
          if (diff > 1) overdueCount++;
        }

        if (row.PHANLOAI === "Y" || row.FSC === "Y" || row.FSC === "YES") {
          fscCount++;
        }
      } else if (activeTab === "LS_IN") {
        totalQty += Number(row.TOTAL_IN_QTY || row.IN_QTY || 0);
      }
    });

    return {
      totalRows: data.length,
      totalRolls,
      totalQty,
      overdueCount,
      uniqueCodes: uniqueCodesSet.size,
      fscCount,
    };
  }, [data, activeTab]);

  if (activeTab === "TON") {
    return (
      <div className="precision-khosub__kpi">
        <div className="kpi-card kpi-card--blue">
          <div className="kpi-info">
            <span className="kpi-label">Tổng Cuộn Tồn</span>
            <span className="kpi-val">{stats.totalRows.toLocaleString("en-US")}</span>
            <span className="kpi-sub">cuộn liệu trên sàn máy Sub</span>
          </div>
          <div className="kpi-icon">
            <AiOutlineInbox />
          </div>
        </div>

        <div className="kpi-card kpi-card--emerald">
          <div className="kpi-info">
            <span className="kpi-label">Tổng Lượng Tồn</span>
            <span className="kpi-val">{Math.round(stats.totalQty).toLocaleString("en-US")}</span>
            <span className="kpi-sub">mét / EA khả dụng</span>
          </div>
          <div className="kpi-icon">
            <BiLayer />
          </div>
        </div>

        <div className="kpi-card kpi-card--rose">
          <div className="kpi-info">
            <span className="kpi-label">Cuộn Quá Hạn (&gt;1 Ngày)</span>
            <span className="kpi-val">{stats.overdueCount.toLocaleString("en-US")}</span>
            <span className="kpi-sub">cần ưu tiên xử lý / trả kho</span>
          </div>
          <div className="kpi-icon">
            <AiOutlineWarning />
          </div>
        </div>

        <div className="kpi-card kpi-card--indigo">
          <div className="kpi-info">
            <span className="kpi-label">Chủng Loại Mã Liệu</span>
            <span className="kpi-val">{stats.uniqueCodes.toLocaleString("en-US")}</span>
            <span className="kpi-sub">M_CODE khác nhau</span>
          </div>
          <div className="kpi-icon">
            <BiLayer />
          </div>
        </div>

        <div className="kpi-card kpi-card--amber">
          <div className="kpi-info">
            <span className="kpi-label">Cuộn Liệu FSC</span>
            <span className="kpi-val">{stats.fscCount.toLocaleString("en-US")}</span>
            <span className="kpi-sub">cuộn đạt chuẩn FSC</span>
          </div>
          <div className="kpi-icon">
            <AiOutlineCheckCircle />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="precision-khosub__kpi">
      <div className="kpi-card kpi-card--emerald">
        <div className="kpi-info">
          <span className="kpi-label">Tổng Lượt Nhập</span>
          <span className="kpi-val">{stats.totalRows.toLocaleString("en-US")}</span>
          <span className="kpi-sub">lượt nhập kho Sub</span>
        </div>
        <div className="kpi-icon">
          <BiImport />
        </div>
      </div>

      <div className="kpi-card kpi-card--blue">
        <div className="kpi-info">
          <span className="kpi-label">Tổng Số Cuộn Nhập</span>
          <span className="kpi-val">{stats.totalRolls.toLocaleString("en-US")}</span>
          <span className="kpi-sub">cuộn ghi nhận nhập</span>
        </div>
        <div className="kpi-icon">
          <AiOutlineInbox />
        </div>
      </div>

      <div className="kpi-card kpi-card--indigo">
        <div className="kpi-info">
          <span className="kpi-label">Tổng Lượng Nhập Kho</span>
          <span className="kpi-val">{Math.round(stats.totalQty).toLocaleString("en-US")}</span>
          <span className="kpi-sub">mét / EA nhập vào sàn Sub</span>
        </div>
        <div className="kpi-icon">
          <BiLayer />
        </div>
      </div>

      <div className="kpi-card kpi-card--amber">
        <div className="kpi-info">
          <span className="kpi-label">Mã Liệu Đã Nhập</span>
          <span className="kpi-val">{stats.uniqueCodes.toLocaleString("en-US")}</span>
          <span className="kpi-sub">M_CODE đã nhập</span>
        </div>
        <div className="kpi-icon">
          <AiOutlineCheckCircle />
        </div>
      </div>
    </div>
  );
};

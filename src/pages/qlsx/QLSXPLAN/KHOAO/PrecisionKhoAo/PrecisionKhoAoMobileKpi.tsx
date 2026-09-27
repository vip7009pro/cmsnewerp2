import React, { useMemo } from "react";
import moment from "moment";
import { datediff } from "../../../../kinhdoanh/utils/kdUtils";
import { FiX, FiInbox, FiLayers, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import { BiImport, BiExport } from "react-icons/bi";

interface PrecisionKhoAoMobileKpiProps {
  activeTab: "TON" | "LS_IN" | "LS_OUT";
  data: any[];
  onClose: () => void;
}

export const PrecisionKhoAoMobileKpi: React.FC<PrecisionKhoAoMobileKpiProps> = React.memo(({
  activeTab,
  data,
  onClose,
}) => {
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
      } else if (activeTab === "LS_OUT") {
        totalQty += Number(row.TOTAL_OUT_QTY || row.OUT_QTY || 0);
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

  return (
    <div className="precision-khoao-mobile-kpi-container">
      <div className="mobile-kpi-header">
        <span className="mobile-kpi-title">CHỈ SỐ THEO DÕI NHANH</span>
        <button
          type="button"
          className="mobile-kpi-close-btn"
          onClick={onClose}
          title="Đóng chỉ số"
        >
          <FiX size={14} />
        </button>
      </div>

      <div className="mobile-kpi-scroll">
        {activeTab === "TON" && (
          <>
            <div className="mobile-kpi-chip mobile-kpi-chip--blue">
              <div className="chip-icon">
                <FiInbox size={13} />
              </div>
              <div className="chip-data">
                <span className="chip-label">Tổng Cuộn Tồn</span>
                <span className="chip-val">{stats.totalRows.toLocaleString("en-US")}</span>
              </div>
            </div>

            <div className="mobile-kpi-chip mobile-kpi-chip--emerald">
              <div className="chip-icon">
                <FiLayers size={13} />
              </div>
              <div className="chip-data">
                <span className="chip-label">Lượng Tồn (m/EA)</span>
                <span className="chip-val">{Math.round(stats.totalQty).toLocaleString("en-US")}</span>
              </div>
            </div>

            <div className={`mobile-kpi-chip ${stats.overdueCount > 0 ? "mobile-kpi-chip--rose" : "mobile-kpi-chip--gray"}`}>
              <div className="chip-icon">
                <FiAlertTriangle size={13} />
              </div>
              <div className="chip-data">
                <span className="chip-label">Quá Hạn &gt;1 Ngày</span>
                <span className="chip-val">{stats.overdueCount.toLocaleString("en-US")}</span>
              </div>
            </div>

            <div className="mobile-kpi-chip mobile-kpi-chip--indigo">
              <div className="chip-icon">
                <FiLayers size={13} />
              </div>
              <div className="chip-data">
                <span className="chip-label">Chủng Loại Liệu</span>
                <span className="chip-val">{stats.uniqueCodes.toLocaleString("en-US")}</span>
              </div>
            </div>

            <div className="mobile-kpi-chip mobile-kpi-chip--amber">
              <div className="chip-icon">
                <FiCheckCircle size={13} />
              </div>
              <div className="chip-data">
                <span className="chip-label">Đạt Chuẩn FSC</span>
                <span className="chip-val">
                  {stats.fscCount}{" "}
                  <small>
                    ({stats.totalRows > 0 ? `${Math.round((stats.fscCount / stats.totalRows) * 100)}%` : "0%"})
                  </small>
                </span>
              </div>
            </div>
          </>
        )}

        {activeTab === "LS_IN" && (
          <>
            <div className="mobile-kpi-chip mobile-kpi-chip--emerald">
              <div className="chip-icon">
                <BiImport size={14} />
              </div>
              <div className="chip-data">
                <span className="chip-label">Lượt Nhập Kho</span>
                <span className="chip-val">{stats.totalRows.toLocaleString("en-US")}</span>
              </div>
            </div>

            <div className="mobile-kpi-chip mobile-kpi-chip--blue">
              <div className="chip-icon">
                <FiInbox size={13} />
              </div>
              <div className="chip-data">
                <span className="chip-label">Tổng Cuộn Nhập</span>
                <span className="chip-val">{stats.totalRolls.toLocaleString("en-US")}</span>
              </div>
            </div>

            <div className="mobile-kpi-chip mobile-kpi-chip--indigo">
              <div className="chip-icon">
                <FiLayers size={13} />
              </div>
              <div className="chip-data">
                <span className="chip-label">Lượng Cấp (m/EA)</span>
                <span className="chip-val">{Math.round(stats.totalQty).toLocaleString("en-US")}</span>
              </div>
            </div>

            <div className="mobile-kpi-chip mobile-kpi-chip--amber">
              <div className="chip-icon">
                <FiLayers size={13} />
              </div>
              <div className="chip-data">
                <span className="chip-label">Mã Liệu Nhập</span>
                <span className="chip-val">{stats.uniqueCodes.toLocaleString("en-US")}</span>
              </div>
            </div>
          </>
        )}

        {activeTab === "LS_OUT" && (
          <>
            <div className="mobile-kpi-chip mobile-kpi-chip--amber">
              <div className="chip-icon">
                <BiExport size={14} />
              </div>
              <div className="chip-data">
                <span className="chip-label">Lượt Xuất Next</span>
                <span className="chip-val">{stats.totalRows.toLocaleString("en-US")}</span>
              </div>
            </div>

            <div className="mobile-kpi-chip mobile-kpi-chip--blue">
              <div className="chip-icon">
                <FiInbox size={13} />
              </div>
              <div className="chip-data">
                <span className="chip-label">Tổng Cuộn Xuất</span>
                <span className="chip-val">{stats.totalRolls.toLocaleString("en-US")}</span>
              </div>
            </div>

            <div className="mobile-kpi-chip mobile-kpi-chip--rose">
              <div className="chip-icon">
                <FiLayers size={13} />
              </div>
              <div className="chip-data">
                <span className="chip-label">Lượng Xuất (m/EA)</span>
                <span className="chip-val">{Math.round(stats.totalQty).toLocaleString("en-US")}</span>
              </div>
            </div>

            <div className="mobile-kpi-chip mobile-kpi-chip--indigo">
              <div className="chip-icon">
                <FiLayers size={13} />
              </div>
              <div className="chip-data">
                <span className="chip-label">Mã Liệu Xuất</span>
                <span className="chip-val">{stats.uniqueCodes.toLocaleString("en-US")}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
});

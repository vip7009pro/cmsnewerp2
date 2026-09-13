import React, { useMemo } from "react";
import { FiAlertCircle, FiCheckCircle, FiMapPin, FiTrendingUp, FiTruck, FiUsers } from "react-icons/fi";
import { CUST_INFO } from "../interfaces/kdInterface";

interface PrecisionCustKpiProps {
  custData: CUST_INFO[];
}

const PrecisionCustKpi: React.FC<PrecisionCustKpiProps> = ({ custData }) => {
  const stats = useMemo(() => {
    const total = custData.length;
    let useCount = 0;
    let offCount = 0;
    let khCount = 0;
    let nccCount = 0;
    let bacNinhCount = 0;
    let haNoiCount = 0;
    let vinhPhucCount = 0;
    let otherRegionCount = 0;
    let hasTaxCount = 0;

    custData.forEach((item) => {
      // 1. Trạng thái hoạt động
      if (item.USE_YN === "Y") {
        useCount++;
      } else {
        offCount++;
      }

      // 2. Phân loại
      const type = (item.CUST_TYPE || "").trim().toUpperCase();
      if (type === "KH") {
        khCount++;
      } else {
        nccCount++;
      }

      // 3. Địa bàn
      const addr = (item.CUST_ADDR1 || "").toLowerCase();
      if (addr.includes("bắc ninh") || addr.includes("bac ninh") || addr.includes("yên phong") || addr.includes("quế võ")) {
        bacNinhCount++;
      } else if (addr.includes("hà nội") || addr.includes("ha noi") || addr.includes("quang minh")) {
        haNoiCount++;
      } else if (addr.includes("vĩnh phúc") || addr.includes("vinh phuc") || addr.includes("bình xuyên")) {
        vinhPhucCount++;
      } else {
        otherRegionCount++;
      }

      // 4. MST
      if (item.TAX_NO && item.TAX_NO.trim() !== "" && item.TAX_NO.trim() !== "--") {
        hasTaxCount++;
      }
    });

    const khPercent = total > 0 ? ((khCount / total) * 100).toFixed(1) : "0";
    const nccPercent = total > 0 ? (100 - Number(khPercent)).toFixed(1) : "0";
    const taxRate = total > 0 ? ((hasTaxCount / total) * 100).toFixed(1) : "0";
    const missingTax = total - hasTaxCount;

    return {
      total,
      useCount,
      offCount,
      khCount,
      nccCount,
      khPercent,
      nccPercent,
      bacNinhCount,
      haNoiCount,
      vinhPhucCount,
      otherRegionCount,
      hasTaxCount,
      taxRate,
      missingTax,
    };
  }, [custData]);

  return (
    <section className="precision-cust__kpiGrid">
      {/* Card 1: Tổng Đối Tác */}
      <div className="kpi-card">
        <div className="kpi-info">
          <span className="kpi-label">Tổng Đối Tác (Partners Master)</span>
          <div className="kpi-metric-row">
            <span className="kpi-value">{stats.total}</span>
            <span className="kpi-sub">
              (<span className="badge-use">{stats.useCount} USE</span> •{" "}
              <span className="badge-off">{stats.offCount} OFF</span>)
            </span>
          </div>
          <div className="kpi-footer success">
            <FiCheckCircle size={11} />
            <span>{stats.useCount} đối tác đang kích hoạt giao dịch</span>
          </div>
        </div>
        <div className="kpi-icon-box kpi-icon-box--blue">
          <FiUsers />
        </div>
      </div>

      {/* Card 2: Phân Loại KH vs Vendor NCC */}
      <div className="kpi-card">
        <div className="kpi-info">
          <span className="kpi-label">Phân Loại Đối Tác (KH / NCC)</span>
          <div className="kpi-metric-row">
            <span className="kpi-value" style={{ color: "#2563eb", fontSize: "16px" }}>
              {stats.khCount} <span style={{ fontSize: "10px", color: "#64748b", fontWeight: 500 }}>KH</span>
            </span>
            <span style={{ color: "#cbd5e1" }}>•</span>
            <span className="kpi-value" style={{ color: "#4f46e5", fontSize: "16px" }}>
              {stats.nccCount} <span style={{ fontSize: "10px", color: "#64748b", fontWeight: 500 }}>NCC</span>
            </span>
          </div>
          <div className="kpi-split-bar" title={`Khách hàng: ${stats.khPercent}% | NCC: ${stats.nccPercent}%`}>
            <div className="kh-part" style={{ width: `${stats.khPercent}%` }} />
            <div className="ncc-part" style={{ width: `${stats.nccPercent}%` }} />
          </div>
          <div className="kpi-footer" style={{ justifyContent: "space-between" }}>
            <span>KH: {stats.khPercent}%</span>
            <span>NCC: {stats.nccPercent}%</span>
          </div>
        </div>
        <div className="kpi-icon-box kpi-icon-box--indigo">
          <FiTruck />
        </div>
      </div>

      {/* Card 3: Địa Bàn Trọng Điểm */}
      <div className="kpi-card">
        <div className="kpi-info">
          <span className="kpi-label">Địa Bàn KCN Trọng Điểm</span>
          <div className="kpi-metric-row">
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                background: "#fef3c7",
                color: "#b45309",
                padding: "2px 6px",
                borderRadius: "4px",
              }}
            >
              Bắc Ninh ({stats.bacNinhCount})
            </span>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                background: "#f1f5f9",
                color: "#334155",
                padding: "2px 6px",
                borderRadius: "4px",
              }}
            >
              Hà Nội ({stats.haNoiCount})
            </span>
          </div>
          <div className="kpi-footer">
            <FiMapPin size={11} />
            <span>KCN Yên Phong, Quế Võ, Quang Minh...</span>
          </div>
        </div>
        <div className="kpi-icon-box kpi-icon-box--amber">
          <FiMapPin />
        </div>
      </div>

      {/* Card 4: Chuẩn Hóa Mã Số Thuế */}
      <div className="kpi-card">
        <div className="kpi-info">
          <span className="kpi-label">Hồ Sơ Pháp Lý & Mã Số Thuế</span>
          <div className="kpi-metric-row">
            <span className="kpi-value" style={{ color: "#059669" }}>
              {stats.taxRate}%
            </span>
            <span className="kpi-sub">chuẩn hóa MST</span>
          </div>
          <div className={`kpi-footer ${stats.missingTax > 0 ? "danger" : "success"}`}>
            {stats.missingTax > 0 ? (
              <>
                <FiAlertCircle size={11} />
                <span>{stats.missingTax} đối tác cần bổ sung MST</span>
              </>
            ) : (
              <>
                <FiCheckCircle size={11} />
                <span>100% đối tác đã có MST đầy đủ</span>
              </>
            )}
          </div>
        </div>
        <div className="kpi-icon-box kpi-icon-box--emerald">
          <FiTrendingUp />
        </div>
      </div>
    </section>
  );
};

export default React.memo(PrecisionCustKpi);

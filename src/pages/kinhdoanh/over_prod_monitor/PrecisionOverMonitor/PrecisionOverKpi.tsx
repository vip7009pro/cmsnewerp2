import React, { useMemo } from "react";
import { PROD_OVER_DATA } from "../../interfaces/kdInterface";
import { FiLayers, FiDollarSign, FiCheckCircle, FiPieChart } from "react-icons/fi";

interface PrecisionOverKpiProps {
  data: PROD_OVER_DATA[];
}

const PrecisionOverKpi: React.FC<PrecisionOverKpiProps> = ({ data }) => {
  const stats = useMemo(() => {
    let totalOverQty = 0;
    let qtyY = 0;
    let qtyN = 0;
    let qtyP = 0;

    let totalAmount = 0;
    let amtY = 0;
    let amtN = 0;

    let closedCount = 0;
    let pendingCount = 0;

    const custMap = new Map<string, number>();

    for (const item of data) {
      const oQty = Number(item.OVER_QTY) || 0;
      const amt = Number(item.AMOUNT) || 0;
      totalOverQty += oQty;
      totalAmount += amt;

      if (item.KD_CFM === "Y") {
        qtyY += oQty;
        amtY += amt;
      } else if (item.KD_CFM === "N") {
        qtyN += oQty;
        amtN += amt;
      } else {
        qtyP += oQty;
      }

      if (item.HANDLE_STATUS === "C") {
        closedCount++;
      } else {
        pendingCount++;
      }

      const cust = item.CUST_NAME_KD?.trim() || "KHÁC";
      custMap.set(cust, (custMap.get(cust) || 0) + oQty);
    }

    const totalOrders = data.length;
    const closedRate = totalOrders > 0 ? ((closedCount / totalOrders) * 100).toFixed(1) : "0.0";

    // Tìm top 2 khách hàng
    const sortedCusts = Array.from(custMap.entries()).sort((a, b) => b[1] - a[1]);
    const topCustName = sortedCusts[0] ? sortedCusts[0][0] : "CHƯA CÓ";
    const topCustQty = sortedCusts[0] ? sortedCusts[0][1] : 0;
    const topCustRate = totalOverQty > 0 ? ((topCustQty / totalOverQty) * 100).toFixed(1) : "0.0";

    return {
      totalOverQty,
      qtyY,
      qtyN,
      qtyP,
      totalAmount,
      amtY,
      amtN,
      closedCount,
      pendingCount,
      totalOrders,
      closedRate,
      topCustName,
      topCustRate,
    };
  }, [data]);

  const formatCompact = (n: number) => {
    const abs = Math.abs(n);
    if (abs >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B`;
    if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
    if (abs >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
    return `${n.toLocaleString("en-US")}`;
  };

  return (
    <section className="precision-over-kpi-grid">
      {/* Card 1: Tổng Lượng SX Dư */}
      <div className="kpi-card kpi-card--amber">
        <div className="kpi-info">
          <span className="kpi-title">Tổng Lượng SX Dư (OVER QTY)</span>
          <div className="kpi-value">
            {stats.totalOverQty.toLocaleString("en-US")} <span className="unit">EA</span>
          </div>
          <div className="kpi-sub">
            <span className="tag-pill tag-emerald">Xuất: {formatCompact(stats.qtyY)}</span>
            <span>•</span>
            <span className="tag-pill tag-rose">Hủy: {formatCompact(stats.qtyN)}</span>
          </div>
        </div>
        <div className="kpi-icon-wrap">
          <FiLayers />
        </div>
      </div>

      {/* Card 2: Giá Trị SX Dư */}
      <div className="kpi-card kpi-card--blue">
        <div className="kpi-info">
          <span className="kpi-title">Giá Trị SX Dư (OVER AMOUNT)</span>
          <div className="kpi-value">
            ${stats.totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" "}
            <span className="unit">USD</span>
          </div>
          <div className="kpi-sub">
            <span className="tag-pill tag-emerald">Xuất: ${formatCompact(stats.amtY)}</span>
            <span>•</span>
            <span className="tag-pill tag-rose">Hủy: ${formatCompact(stats.amtN)}</span>
          </div>
        </div>
        <div className="kpi-icon-wrap">
          <FiDollarSign />
        </div>
      </div>

      {/* Card 3: Trạng Thái Xử Lý */}
      <div className="kpi-card kpi-card--emerald">
        <div className="kpi-info">
          <span className="kpi-title">Trạng Thái Xử Lý (STATUS)</span>
          <div className="kpi-value">
            {stats.closedRate}% <span className="unit">CLOSED</span>
          </div>
          <div className="kpi-sub">
            <span className="tag-pill tag-emerald">{stats.closedCount} Đã Xong</span>
            <span>•</span>
            <span className="tag-pill tag-amber">{stats.pendingCount} Chờ KD</span>
          </div>
        </div>
        <div className="kpi-icon-wrap">
          <FiCheckCircle />
        </div>
      </div>

      {/* Card 4: Khách Hàng Trọng Điểm */}
      <div className="kpi-card kpi-card--purple">
        <div className="kpi-info">
          <span className="kpi-title">Khách Hàng Chiếm Tỷ Trọng Cao</span>
          <div className="kpi-value" style={{ fontSize: "15px" }}>
            {stats.topCustName}
          </div>
          <div className="kpi-sub">
            <span className="tag-pill" style={{ backgroundColor: "#ede9fe", color: "#6d28d9" }}>
              Chiếm {stats.topCustRate}% lượng dư toàn kỳ
            </span>
          </div>
        </div>
        <div className="kpi-icon-wrap">
          <FiPieChart />
        </div>
      </div>
    </section>
  );
};

export default React.memo(PrecisionOverKpi);

import React from "react";
import { POSummaryData } from "../../../interfaces/kdInterface";
import {
  MdInventory2,
  MdLocalShipping,
  MdPrecisionManufacturing,
  MdPayments,
  MdCheckCircle,
  MdMonetizationOn,
  MdTrendingUp,
} from "react-icons/md";

interface PrecisionPoKpiGridProps {
  summary: POSummaryData;
  currency: string;
  totalOrdersCount: number;
  /** Mobile: render dạng siêu nén 2 hàng × 3 cột, mỗi ô chỉ 2 dòng (nhãn + giá trị) */
  compact?: boolean;
}

interface CompactKpiItem {
  key: string;
  label: string;
  fullLabel: string;
  value: string;
  unit: string;
  color: string;
}

const PrecisionPoKpiGrid: React.FC<PrecisionPoKpiGridProps> = ({
  summary,
  currency,
  totalOrdersCount,
  compact = false,
}) => {
  const deliveryPercent =
    summary.total_po_qty > 0
      ? ((summary.total_delivered_qty / summary.total_po_qty) * 100).toFixed(2)
      : "0.00";

  const backlogPercent =
    summary.total_po_qty > 0
      ? ((summary.total_pobalance_qty / summary.total_po_qty) * 100).toFixed(2)
      : "0.00";

  const billedPercent =
    summary.total_po_amount > 0
      ? ((summary.total_delivered_amount / summary.total_po_amount) * 100).toFixed(2)
      : "0.00";

  // Mobile compact: hàng 1 = 3 ô số lượng, hàng 2 = 3 ô số tiền (đúng thứ tự KPI 1→6)
  const compactItems: CompactKpiItem[] = [
    {
      key: "po_qty",
      label: "Tổng ĐH",
      fullLabel: "Tổng đặt hàng (PO Qty)",
      value: summary.total_po_qty.toLocaleString("en-US"),
      unit: "EA",
      color: "#1d4ed8",
    },
    {
      key: "delivered_qty",
      label: "Đã giao",
      fullLabel: "Số lượng đã giao",
      value: summary.total_delivered_qty.toLocaleString("en-US"),
      unit: "EA",
      color: "#047857",
    },
    {
      key: "balance_qty",
      label: "Tồn PO",
      fullLabel: "Tồn PO cần sản xuất",
      value: summary.total_pobalance_qty.toLocaleString("en-US"),
      unit: "EA",
      color: "#b45309",
    },
    {
      key: "po_amount",
      label: "Tổng giá trị",
      fullLabel: `Tổng giá trị PO (${totalOrdersCount.toLocaleString("en-US")} đơn)`,
      value: summary.total_po_amount.toLocaleString("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }),
      unit: currency,
      color: "#1d4ed8",
    },
    {
      key: "delivered_amount",
      label: "Giá trị giao",
      fullLabel: `Giá trị đã giao (${billedPercent}% Bill)`,
      value: summary.total_delivered_amount.toLocaleString("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }),
      unit: currency,
      color: "#0369a1",
    },
    {
      key: "balance_amount",
      label: "Giá trị còn lại",
      fullLabel: "Giá trị PO còn lại",
      value: summary.total_pobalance_amount.toLocaleString("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }),
      unit: currency,
      color: "#be123c",
    },
  ];

  if (compact) {
    return (
      <div className="po-kpi-grid po-kpi-grid--compact">
        {compactItems.map((item) => (
          <div className="kpi-card" key={item.key} title={`${item.fullLabel}: ${item.value} ${item.unit}`}>
            <span className="kpi-compact-label">{item.label}</span>
            <span className="kpi-compact-value font-mono-num" style={{ color: item.color }}>
              {item.value}
              <span className="kpi-compact-unit">{item.unit}</span>
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="po-kpi-grid">
      {/* KPI 1: TỔNG ĐẶT HÀNG */}
      <div className="kpi-card">
        <div className="kpi-top">
          <span className="kpi-label">Tổng Đặt Hàng (PO Qty)</span>
          <span className="kpi-icon-pill" style={{ background: "#eff6ff", color: "#2563eb" }}>
            <MdInventory2 />
          </span>
        </div>
        <div className="kpi-value-row">
          <span className="kpi-num font-mono-num">
            {summary.total_po_qty.toLocaleString("en-US")}
          </span>
          <span className="kpi-unit">EA</span>
        </div>
        <div className="kpi-footer">
          <span>Kế hoạch năm {new Date().getFullYear()}</span>
          {summary.total_pobalance_qty > 0 && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 2,
                fontWeight: 600,
                color: "#d97706",
                background: "#fffbeb",
                padding: "1px 4px",
                borderRadius: 4,
              }}
            >
              <MdTrendingUp size={12} />
              Còn tồn: {summary.total_pobalance_qty.toLocaleString("en-US")} EA
            </span>
          )}
        </div>
      </div>

      {/* KPI 2: SỐ LƯỢNG ĐÃ GIAO */}
      <div className="kpi-card">
        <div className="kpi-top">
          <span className="kpi-label">Số Lượng Đã Giao</span>
          <span className="kpi-icon-pill" style={{ background: "#ecfdf5", color: "#10b981" }}>
            <MdLocalShipping />
          </span>
        </div>
        <div className="kpi-value-row">
          <span className="kpi-num font-mono-num" style={{ color: "#047857" }}>
            {summary.total_delivered_qty.toLocaleString("en-US")}
          </span>
          <span className="kpi-unit">EA</span>
        </div>
        <div className="kpi-footer" style={{ flexDirection: "column", gap: 3 }}>
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <span>Tỷ lệ hoàn thành</span>
            <strong className="font-mono-num" style={{ color: "#047857" }}>
              {deliveryPercent}%
            </strong>
          </div>
          <div className="progress-bar-wrap">
            <div
              className="progress-bar-inner"
              style={{ width: `${Math.min(Number(deliveryPercent), 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* KPI 3: TỒN CẦN SẢN XUẤT */}
      <div className="kpi-card">
        <div className="kpi-top">
          <span className="kpi-label">Tồn PO</span>
          <span className="kpi-icon-pill" style={{ background: "#fffbeb", color: "#f59e0b" }}>
            <MdPrecisionManufacturing />
          </span>
        </div>
        <div className="kpi-value-row">
          <span className="kpi-num font-mono-num" style={{ color: "#b45309" }}>
            {summary.total_pobalance_qty.toLocaleString("en-US")}
          </span>
          <span className="kpi-unit">EA</span>
        </div>
        <div className="kpi-footer">
          <span>Chờ dập & kiểm tra</span>
          <span
            className="font-mono-num"
            style={{
              fontWeight: 600,
              color: "#b45309",
              background: "#fffbeb",
              padding: "1px 6px",
              borderRadius: 4,
              border: "1px solid #fde68a",
            }}
          >
            {backlogPercent}% Backlog
          </span>
        </div>
      </div>

      {/* KPI 4: TỔNG GIÁ TRỊ PO */}
      <div className="kpi-card">
        <div className="kpi-top">
          <span className="kpi-label">Tổng Giá Trị PO</span>
          <span className="kpi-icon-pill" style={{ background: "#eff6ff", color: "#2563eb" }}>
            <MdPayments />
          </span>
        </div>
        <div className="kpi-value-row">
          <span className="kpi-num font-mono-num">
            {summary.total_po_amount.toLocaleString("en-US", {
              style: "currency",
              currency: currency,
            })}
          </span>
          <span className="kpi-unit">{currency}</span>
        </div>
        <div className="kpi-footer">
          <span className="font-mono-num">Tổng đơn hàng</span>
          <span
            style={{
              fontWeight: 600,
              color: "#1d4ed8",
              background: "#eff6ff",
              padding: "1px 6px",
              borderRadius: 4,
            }}
          >
            {totalOrdersCount.toLocaleString("en-US")} đơn
          </span>
        </div>
      </div>

      {/* KPI 5: GIÁ TRỊ ĐÃ GIAO */}
      <div className="kpi-card">
        <div className="kpi-top">
          <span className="kpi-label">Giá Trị Đã Giao</span>
          <span className="kpi-icon-pill" style={{ background: "#f0f9ff", color: "#0284c7" }}>
            <MdCheckCircle />
          </span>
        </div>
        <div className="kpi-value-row">
          <span className="kpi-num font-mono-num" style={{ color: "#0369a1" }}>
            {summary.total_delivered_amount.toLocaleString("en-US", {
              style: "currency",
              currency: currency,
            })}
          </span>
          <span className="kpi-unit">{currency}</span>
        </div>
        <div className="kpi-footer">
          <span>Tiến độ thanh toán</span>
          <span
            className="font-mono-num"
            style={{
              fontWeight: 600,
              color: "#0284c7",
              background: "#f0f9ff",
              padding: "1px 6px",
              borderRadius: 4,
            }}
          >
            {billedPercent}% Bill
          </span>
        </div>
      </div>

      {/* KPI 6: GIÁ TRỊ PO CÒN LẠI */}
      <div className="kpi-card">
        <div className="kpi-top">
          <span className="kpi-label">Giá Trị PO Còn Lại</span>
          <span className="kpi-icon-pill" style={{ background: "#fff1f2", color: "#f43f5e" }}>
            <MdMonetizationOn />
          </span>
        </div>
        <div className="kpi-value-row">
          <span className="kpi-num font-mono-num" style={{ color: "#be123c" }}>
            {summary.total_pobalance_amount.toLocaleString("en-US", {
              style: "currency",
              currency: currency,
            })}
          </span>
          <span className="kpi-unit">{currency}</span>
        </div>
        <div className="kpi-footer">
          <span>Còn cần thực hiện</span>
          <span
            style={{
              fontWeight: 600,
              color: "#be123c",
              background: "#fff1f2",
              padding: "1px 6px",
              borderRadius: 4,
              border: "1px solid #fecdd3",
            }}
          >
            Pending
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionPoKpiGrid);

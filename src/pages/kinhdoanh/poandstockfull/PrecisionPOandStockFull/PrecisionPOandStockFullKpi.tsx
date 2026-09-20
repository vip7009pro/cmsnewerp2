import React, { useState } from "react";
import {
  FiShoppingBag,
  FiCpu,
  FiClock,
  FiInbox,
  FiArchive,
  FiLock,
  FiLayers,
  FiAlertTriangle,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";
import type { IconType } from "react-icons";
import { POFullSummary } from "../../interfaces/kdInterface";

interface PrecisionPOandStockFullKpiProps {
  summary: POFullSummary;
  /**
   * Mobile (≤768px): thay 8 widget rời rạc bằng 1 bảng compact để dễ đọc.
   * Desktop (mặc định): giữ nguyên 8 tile công nghiệp.
   */
  compact?: boolean;
}

interface KpiMetric {
  key: keyof POFullSummary;
  label: string;
  hint: string;
  tone: string;
  Icon: IconType;
}

/* Descriptor dùng cho nhánh bảng compact trên mobile (giữ đúng thứ tự 8 chỉ số) */
const KPI_TABLE_METRICS: KpiMetric[] = [
  { key: "PO_BALANCE", label: "PO BALANCE", hint: "EA đơn chưa xuất", tone: "po-balance", Icon: FiShoppingBag },
  { key: "BTP", label: "BTP (BÁN TP)", hint: "Tại các cụm máy SX", tone: "btp", Icon: FiCpu },
  { key: "CK", label: "CK (CHỜ KIỂM)", hint: "Chờ kiểm tra", tone: "ck", Icon: FiClock },
  { key: "CNK", label: "CNK (CHỜ NHẬP)", hint: "Chờ nhập kho", tone: "cnk", Icon: FiInbox },
  { key: "TP", label: "TP (THÀNH PHẨM)", hint: "Tồn kho thành phẩm", tone: "tp", Icon: FiArchive },
  { key: "BLOCK", label: "BLOCK (KHÓA)", hint: "Chặn xuất", tone: "block", Icon: FiLock },
  { key: "TONG_TON", label: "TỔNG TỒN", hint: "Tồn kho toàn nhà máy", tone: "tong-ton", Icon: FiLayers },
  { key: "THUATHIEU", label: "THỪA THIẾU", hint: "Thiếu hụt theo PO", tone: "thua-thieu", Icon: FiAlertTriangle },
];

const fmt = (num?: number) => {
  if (num === undefined || num === null || isNaN(num)) return "0";
  return num.toLocaleString("en-US");
};

const PrecisionPOandStockFullKpi: React.FC<PrecisionPOandStockFullKpiProps> = ({
  summary,
  compact = false,
}) => {
  /* ── Mobile: 1 bảng compact thay cho 8 widget ── */
  /* Mặc định mở rộng; user có thể thu gọn để nhường chỗ cho bảng AG Grid */
  const [collapsed, setCollapsed] = useState(false);

  if (compact) {
    return (
      <div
        className={`precision-po-stock__kpiTable${
          collapsed ? " precision-po-stock__kpiTable--collapsed" : ""
        }`}
      >
        <table>
          <thead>
            <tr>
              <th className="kpi-head" colSpan={2}>
                <button
                  type="button"
                  className="kpi-head__toggle"
                  onClick={() => setCollapsed((prev) => !prev)}
                  aria-expanded={!collapsed}
                  title={
                    collapsed
                      ? "Mở rộng bảng chỉ số tồn kho"
                      : "Thu gọn bảng chỉ số tồn kho"
                  }
                >
                  {collapsed ? (
                    <FiChevronRight size={13} />
                  ) : (
                    <FiChevronDown size={13} />
                  )}
                  <span className="kpi-head__title">Chỉ số tồn kho</span>
                  <span className="kpi-head__count">{KPI_TABLE_METRICS.length}</span>
                </button>
              </th>
            </tr>
          </thead>
          {!collapsed && (
            <tbody>
              {KPI_TABLE_METRICS.map(({ key, label, hint, tone, Icon }) => (
                <tr key={key} className={`kpi-row kpi-row--${tone}`} title={hint}>
                  <td className="kpi-row__label">
                    <span className="kpi-row__icon">
                      <Icon size={11} />
                    </span>
                    <span className="kpi-row__text">{label}</span>
                  </td>
                  <td className="kpi-row__value">
                    {fmt(summary[key])}
                    <span className="kpi-row__unit">EA</span>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    );
  }

  return (
    <div className="precision-po-stock__kpis">
      {/* 1. PO BALANCE */}
      <div className="kpi-tile kpi-tile--po-balance">
        <div className="kpi-header">
          <span className="kpi-title">PO BALANCE</span>
          <span className="kpi-icon-badge">
            <FiShoppingBag size={13} />
          </span>
        </div>
        <div className="kpi-value">{fmt(summary.PO_BALANCE)}</div>
        <div className="kpi-subtitle">EA đơn chưa xuất</div>
      </div>

      {/* 2. BTP (BÁN TP) */}
      <div className="kpi-tile kpi-tile--btp">
        <div className="kpi-header">
          <span className="kpi-title">BTP (BÁN TP)</span>
          <span className="kpi-icon-badge">
            <FiCpu size={13} />
          </span>
        </div>
        <div className="kpi-value">{fmt(summary.BTP)}</div>
        <div className="kpi-subtitle">Tại các cụm máy SX</div>
      </div>

      {/* 3. CK (CHỜ KIỂM) */}
      <div className="kpi-tile kpi-tile--ck">
        <div className="kpi-header">
          <span className="kpi-title">CK (CHỜ KIỂM)</span>
          <span className="kpi-icon-badge">
            <FiClock size={13} />
          </span>
        </div>
        <div className="kpi-value">{fmt(summary.CK)}</div>
        <div className="kpi-subtitle">Chờ kiểm tra</div>
      </div>

      {/* 4. CNK (CHỜ NHẬP) */}
      <div className="kpi-tile kpi-tile--cnk">
        <div className="kpi-header">
          <span className="kpi-title">CNK (CHỜ NHẬP)</span>
          <span className="kpi-icon-badge">
            <FiInbox size={13} />
          </span>
        </div>
        <div className="kpi-value">{fmt(summary.CNK)}</div>
        <div className="kpi-subtitle">Chờ nhập kho</div>
      </div>

      {/* 5. TP (THÀNH PHẨM) */}
      <div className="kpi-tile kpi-tile--tp">
        <div className="kpi-header">
          <span className="kpi-title">TP (THÀNH PHẨM)</span>
          <span className="kpi-icon-badge">
            <FiArchive size={13} />
          </span>
        </div>
        <div className="kpi-value">{fmt(summary.TP)}</div>
        <div className="kpi-subtitle">Tồn kho thành phẩm</div>
      </div>

      {/* 6. BLOCK (KHÓA) */}
      <div className="kpi-tile kpi-tile--block">
        <div className="kpi-header">
          <span className="kpi-title">BLOCK (KHÓA)</span>
          <span className="kpi-icon-badge">
            <FiLock size={13} />
          </span>
        </div>
        <div className="kpi-value">{fmt(summary.BLOCK)}</div>
        <div className="kpi-subtitle">Chặn xuất</div>
      </div>

      {/* 7. TỔNG TỒN */}
      <div className="kpi-tile kpi-tile--tong-ton">
        <div className="kpi-header">
          <span className="kpi-title">TỔNG TỒN</span>
          <span className="kpi-icon-badge">
            <FiLayers size={13} />
          </span>
        </div>
        <div className="kpi-value">{fmt(summary.TONG_TON)}</div>
        <div className="kpi-subtitle">Tồn kho toàn nhà máy</div>
      </div>

      {/* 8. THỪA THIẾU */}
      <div className="kpi-tile kpi-tile--thua-thieu">
        <div className="kpi-header">
          <span className="kpi-title">THỪA THIẾU</span>
          <span className="kpi-icon-badge">
            <FiAlertTriangle size={13} />
          </span>
        </div>
        <div className="kpi-value">{fmt(summary.THUATHIEU)}</div>
        <div className="kpi-subtitle">Thiếu hụt theo PO</div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionPOandStockFullKpi);

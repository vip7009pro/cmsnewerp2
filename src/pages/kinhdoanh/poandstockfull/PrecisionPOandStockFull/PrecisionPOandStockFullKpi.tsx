import React from "react";
import {
  FiShoppingBag,
  FiCpu,
  FiClock,
  FiInbox,
  FiArchive,
  FiLock,
  FiLayers,
  FiAlertTriangle,
} from "react-icons/fi";
import { POFullSummary } from "../../interfaces/kdInterface";

interface PrecisionPOandStockFullKpiProps {
  summary: POFullSummary;
}

const fmt = (num?: number) => {
  if (num === undefined || num === null || isNaN(num)) return "0";
  return num.toLocaleString("en-US");
};

const PrecisionPOandStockFullKpi: React.FC<PrecisionPOandStockFullKpiProps> = ({ summary }) => {
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

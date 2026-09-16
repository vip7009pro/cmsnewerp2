import React from "react";
import { AiOutlineBarcode, AiOutlineCheckCircle, AiOutlineQrcode } from "react-icons/ai";
import { BsBoxes } from "react-icons/bs";
import { BarcodeKpiData } from "./barcodeManagerTypes";

interface KpiProps {
  kpiData: BarcodeKpiData;
}

export const PrecisionProductBarcodeKpi: React.FC<KpiProps> = React.memo(({ kpiData }) => {
  return (
    <div className="precision-barcode__kpiContainer">
      {/* CARD 1: TỔNG SỐ BARCODE */}
      <div className="precision-barcode__kpiCard precision-barcode__kpiCard--blue">
        <div className="info">
          <span className="label">Tổng Mã Barcode</span>
          <span className="val">{kpiData.total}</span>
          <span className="sub">Đã định nghĩa trên hệ thống</span>
        </div>
        <div className="iconWrap" style={{ color: "#2563eb", background: "#eff6ff" }}>
          <AiOutlineBarcode size={18} />
        </div>
      </div>

      {/* CARD 2: CƠ CẤU CÔNG NGHỆ MÃ */}
      <div className="precision-barcode__kpiCard precision-barcode__kpiCard--purple">
        <div className="info">
          <span className="label">Công Nghệ Mã Vạch</span>
          <span className="val" style={{ fontSize: "14px" }}>
            1D: {kpiData.count1D} • QR: {kpiData.countQR} • Matrix: {kpiData.countMatrix}
          </span>
          <span className="sub">Phân bổ 1D Barcode, QR Code & 2D Matrix</span>
        </div>
        <div className="iconWrap" style={{ color: "#7c3aed", background: "#faf5ff" }}>
          <AiOutlineQrcode size={18} />
        </div>
      </div>

      {/* CARD 3: TIẾN ĐỘ SẢN XUẤT */}
      <div className="precision-barcode__kpiCard precision-barcode__kpiCard--emerald">
        <div className="info">
          <span className="label">Áp Dụng Sản Xuất</span>
          <span className="val" style={{ fontSize: "14px" }}>
            Đã SX: {kpiData.producedCount} • Chưa SX: {kpiData.notProducedCount}
          </span>
          <span className="sub">
            {kpiData.total > 0
              ? `${Math.round((kpiData.producedCount / kpiData.total) * 100)}% đã chạy chỉ thị`
              : "0%"}
          </span>
        </div>
        <div className="iconWrap" style={{ color: "#10b981", background: "#ecfdf5" }}>
          <BsBoxes size={16} />
        </div>
      </div>

      {/* CARD 4: TRẠNG THÁI TIÊU CHUẨN */}
      <div className="precision-barcode__kpiCard precision-barcode__kpiCard--amber">
        <div className="info">
          <span className="label">Trạng Thái Kiểm Định</span>
          <span className="val" style={{ fontSize: "14px" }}>
            OK: {kpiData.statusOkCount} • NG: {kpiData.statusNgCount}
          </span>
          <span className="sub">Độ tin cậy & tương thích máy đọc</span>
        </div>
        <div className="iconWrap" style={{ color: "#f59e0b", background: "#fffbeb" }}>
          <AiOutlineCheckCircle size={18} />
        </div>
      </div>
    </div>
  );
});

PrecisionProductBarcodeKpi.displayName = "PrecisionProductBarcodeKpi";

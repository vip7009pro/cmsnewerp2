import React, { memo } from "react";
import { FiCheckCircle, FiClock, FiAlertTriangle, FiFileText, FiLayers } from "react-icons/fi";
import { AiOutlineQrcode } from "react-icons/ai";

interface YcsxKpiProps {
  mode: "ycsx" | "amz";
  totalCount: number;
  approvedCount: number;
  pendingCount: number;
  materialShortageCount: number;
}

const PrecisionYCSXKpi: React.FC<YcsxKpiProps> = ({
  mode,
  totalCount,
  approvedCount,
  pendingCount,
  materialShortageCount,
}) => {
  if (mode === "ycsx") {
    const approvedRate = totalCount > 0 ? ((approvedCount / totalCount) * 100).toFixed(1) : "0.0";
    return (
      <div className="precision-ycsx__kpiGrid">
        {/* Card 1: Tổng Lệnh */}
        <div className="precision-ycsx__kpiCard precision-ycsx__kpiCard--blue">
          <div className="precision-ycsx__kpiInfo">
            <span className="precision-ycsx__kpiLabel">TỔNG LỆNH YCSX</span>
            <div className="precision-ycsx__kpiValueRow">
              <span className="precision-ycsx__kpiValue">{totalCount.toLocaleString("en-US")}</span>
              <span className="precision-ycsx__kpiSub">Đã tải</span>
            </div>
          </div>
          <div className="precision-ycsx__kpiIcon">
            <FiFileText />
          </div>
        </div>

        {/* Card 2: Đã Duyệt SX */}
        <div className="precision-ycsx__kpiCard precision-ycsx__kpiCard--emerald">
          <div className="precision-ycsx__kpiInfo">
            <span className="precision-ycsx__kpiLabel">ĐÃ DUYỆT SẢN XUẤT</span>
            <div className="precision-ycsx__kpiValueRow">
              <span className="precision-ycsx__kpiValue">{approvedCount.toLocaleString("en-US")}</span>
              <span className="precision-ycsx__kpiSub">{approvedRate}%</span>
            </div>
          </div>
          <div className="precision-ycsx__kpiIcon">
            <FiCheckCircle />
          </div>
        </div>

        {/* Card 3: Pending Chờ Duyệt */}
        <div className="precision-ycsx__kpiCard precision-ycsx__kpiCard--amber">
          <div className="precision-ycsx__kpiInfo">
            <span className="precision-ycsx__kpiLabel">PENDING SẢN XUẤT</span>
            <div className="precision-ycsx__kpiValueRow">
              <span className="precision-ycsx__kpiValue">{pendingCount.toLocaleString("en-US")}</span>
              <span className="precision-ycsx__kpiSub">Cần xử lý</span>
            </div>
          </div>
          <div className="precision-ycsx__kpiIcon">
            <FiClock />
          </div>
        </div>

        {/* Card 4: Vật Liệu Thiếu */}
        <div className="precision-ycsx__kpiCard precision-ycsx__kpiCard--rose">
          <div className="precision-ycsx__kpiInfo">
            <span className="precision-ycsx__kpiLabel">VẬT LIỆU THIẾU (VL_STT NO)</span>
            <div className="precision-ycsx__kpiValueRow">
              <span className="precision-ycsx__kpiValue">{materialShortageCount.toLocaleString("en-US")}</span>
              <span className="precision-ycsx__kpiSub">Báo động kho</span>
            </div>
          </div>
          <div className="precision-ycsx__kpiIcon">
            <FiAlertTriangle />
          </div>
        </div>
      </div>
    );
  }

  // Amazon KPI Cards
  const validRate = totalCount > 0 ? ((approvedCount / totalCount) * 100).toFixed(1) : "0.0";
  return (
    <div className="precision-ycsx__kpiGrid">
      {/* Card 1: Tổng Serial/QR */}
      <div className="precision-ycsx__kpiCard precision-ycsx__kpiCard--blue">
        <div className="precision-ycsx__kpiInfo">
          <span className="precision-ycsx__kpiLabel">TỔNG SERIAL / QR AMZ</span>
          <div className="precision-ycsx__kpiValueRow">
            <span className="precision-ycsx__kpiValue">{totalCount.toLocaleString("en-US")}</span>
            <span className="precision-ycsx__kpiSub">Bản ghi</span>
          </div>
        </div>
        <div className="precision-ycsx__kpiIcon">
          <AiOutlineQrcode />
        </div>
      </div>

      {/* Card 2: Mã Hợp Lệ */}
      <div className="precision-ycsx__kpiCard precision-ycsx__kpiCard--emerald">
        <div className="precision-ycsx__kpiInfo">
          <span className="precision-ycsx__kpiLabel">MÃ HỢP LỆ (VALID OK)</span>
          <div className="precision-ycsx__kpiValueRow">
            <span className="precision-ycsx__kpiValue">{approvedCount.toLocaleString("en-US")}</span>
            <span className="precision-ycsx__kpiSub">{validRate}%</span>
          </div>
        </div>
        <div className="precision-ycsx__kpiIcon">
          <FiCheckCircle />
        </div>
      </div>

      {/* Card 3: Lô Đang SX */}
      <div className="precision-ycsx__kpiCard precision-ycsx__kpiCard--amber">
        <div className="precision-ycsx__kpiInfo">
          <span className="precision-ycsx__kpiLabel">LÔ HÀNG ĐANG SX</span>
          <div className="precision-ycsx__kpiValueRow">
            <span className="precision-ycsx__kpiValue">{pendingCount.toLocaleString("en-US")}</span>
            <span className="precision-ycsx__kpiSub">Active LOT</span>
          </div>
        </div>
        <div className="precision-ycsx__kpiIcon">
          <FiLayers />
        </div>
      </div>

      {/* Card 4: Cảnh Báo Trùng */}
      <div className="precision-ycsx__kpiCard precision-ycsx__kpiCard--rose">
        <div className="precision-ycsx__kpiInfo">
          <span className="precision-ycsx__kpiLabel">CẢNH BÁO TRÙNG LẶP</span>
          <div className="precision-ycsx__kpiValueRow">
            <span className="precision-ycsx__kpiValue">{materialShortageCount.toLocaleString("en-US")}</span>
            <span className="precision-ycsx__kpiSub">Cần kiểm tra</span>
          </div>
        </div>
        <div className="precision-ycsx__kpiIcon">
          <FiAlertTriangle />
        </div>
      </div>
    </div>
  );
};

export default memo(PrecisionYCSXKpi);

import React from "react";
import {
  IoListOutline,
  IoFlaskOutline,
  IoLocateOutline,
  IoCheckmarkDoneCircleOutline,
} from "react-icons/io5";

interface PrecisionTestTableKpiProps {
  kpis: {
    totalItems: number;
    selectedItemName: string;
    selectedItemCode: number | null;
    totalPoints: number;
  };
}

const PrecisionTestTableKpi: React.FC<PrecisionTestTableKpiProps> = ({ kpis }) => {
  return (
    <div className="precision-testtable__kpis">
      {/* Card 1: Tổng Hạng Mục Test */}
      <div className="precision-testtable__kpiCard precision-testtable__kpiCard--blue">
        <div className="precision-testtable__kpiContent">
          <span className="precision-testtable__kpiLabel">TỔNG HẠNG MỤC TEST</span>
          <span className="precision-testtable__kpiValue">{kpis.totalItems}</span>
          <span className="precision-testtable__kpiSub">Hạng mục kiểm tra đã cấu hình</span>
        </div>
        <div className="precision-testtable__kpiIcon precision-testtable__kpiIcon--blue">
          <IoListOutline />
        </div>
      </div>

      {/* Card 2: Hạng Mục Đang Chọn */}
      <div className="precision-testtable__kpiCard precision-testtable__kpiCard--purple">
        <div className="precision-testtable__kpiContent">
          <span className="precision-testtable__kpiLabel">HẠNG MỤC ĐANG CHỌN</span>
          <span
            className="precision-testtable__kpiValue"
            style={{ fontSize: "0.95rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "200px" }}
            title={kpis.selectedItemName}
          >
            {kpis.selectedItemCode !== null ? `[${kpis.selectedItemCode}] ${kpis.selectedItemName}` : "Chưa chọn"}
          </span>
          <span className="precision-testtable__kpiSub">Đang thao tác danh sách điểm đo</span>
        </div>
        <div className="precision-testtable__kpiIcon precision-testtable__kpiIcon--purple">
          <IoFlaskOutline />
        </div>
      </div>

      {/* Card 3: Số Điểm Đo Hiện Tại */}
      <div className="precision-testtable__kpiCard precision-testtable__kpiCard--emerald">
        <div className="precision-testtable__kpiContent">
          <span className="precision-testtable__kpiLabel">SỐ ĐIỂM ĐO HIỆN TẠI (POINTS)</span>
          <span className="precision-testtable__kpiValue">{kpis.totalPoints}</span>
          <span className="precision-testtable__kpiSub">Điểm đo thuộc hạng mục đang chọn</span>
        </div>
        <div className="precision-testtable__kpiIcon precision-testtable__kpiIcon--emerald">
          <IoLocateOutline />
        </div>
      </div>

      {/* Card 4: Trạng Thái Hệ Thống */}
      <div className="precision-testtable__kpiCard precision-testtable__kpiCard--amber">
        <div className="precision-testtable__kpiContent">
          <span className="precision-testtable__kpiLabel">TRẠNG THÁI CƠ SỞ DỮ LIỆU</span>
          <span className="precision-testtable__kpiValue" style={{ fontSize: "0.95rem", color: "#166534" }}>
            ONLINE
          </span>
          <span className="precision-testtable__kpiSub">Đồng bộ tự động MSSQL Server</span>
        </div>
        <div className="precision-testtable__kpiIcon precision-testtable__kpiIcon--amber">
          <IoCheckmarkDoneCircleOutline />
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionTestTableKpi);

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
  /** Biến thể mobile: 4 ô nén 2 cột × 2 dòng thay cho 4 card lớn */
  compact?: boolean;
}

const PrecisionTestTableKpi: React.FC<PrecisionTestTableKpiProps> = ({ kpis, compact }) => {
  // ===== NHÁNH MOBILE: lưới 4 chip nén (2 cột), không icon, không dòng phụ =====
  if (compact) {
    const chips = [
      {
        label: "Tổng hạng mục",
        value: kpis.totalItems.toLocaleString("vi-VN"),
        tone: "blue",
      },
      {
        label: "Hạng mục đang chọn",
        value:
          kpis.selectedItemCode !== null
            ? `[${kpis.selectedItemCode}]`
            : "—",
        tone: "purple",
      },
      {
        label: "Điểm đo hiện tại",
        value: kpis.totalPoints.toLocaleString("vi-VN"),
        tone: "emerald",
      },
      {
        label: "Cơ sở dữ liệu",
        value: "ONLINE",
        tone: "amber",
      },
    ];

    return (
      <div className="precision-testtable__kpis precision-testtable__kpis--compact">
        {chips.map((chip) => (
          <div
            key={chip.label}
            className={`precision-testtable__kpiChip precision-testtable__kpiChip--${chip.tone}`}
            title={
              chip.tone === "purple" && kpis.selectedItemName
                ? kpis.selectedItemName
                : undefined
            }
          >
            <span className="chip-label">{chip.label}</span>
            <span className="chip-value">{chip.value}</span>
          </div>
        ))}
      </div>
    );
  }

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

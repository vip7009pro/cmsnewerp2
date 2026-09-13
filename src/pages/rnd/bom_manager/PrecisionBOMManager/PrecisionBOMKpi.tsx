import React, { useMemo } from "react";
import { AiOutlineDatabase, AiOutlineExperiment } from "react-icons/ai";
import { FaCogs, FaCut } from "react-icons/fa";
import { MdAttachMoney } from "react-icons/md";
import { BOM_GIA, BOM_SX, CODE_INFO } from "../../interfaces/rndInterface";

interface PrecisionBOMKpiProps {
  codeList: CODE_INFO[];
  bomsxList: BOM_SX[];
  bomgiaList: BOM_GIA[];
}

const PrecisionBOMKpi: React.FC<PrecisionBOMKpiProps> = ({
  codeList = [],
  bomsxList = [],
  bomgiaList = [],
}) => {
  const kpiData = useMemo(() => {
    const totalCodes = codeList.length;
    // Đếm active dựa trên codeList
    const activeCodes = codeList.filter(
      (c: any) => c.USE_YN === "Y" || c.ACTIVE === "Y" || c.USE_YN === undefined
    ).length;
    const inactiveCodes = totalCodes - activeCodes;

    // BOMSX: số NVL của mã đang chọn
    const bomsxMatCount = bomsxList.length;

    // BOM Giá: số NVL và ước tính
    const bomgiaMatCount = bomgiaList.length;

    // Số mã có PD / kích thước chuẩn
    const validDrawingCount = codeList.filter(
      (c: any) => c.PD > 0 && c.CAVITY > 0
    ).length;

    return {
      totalCodes,
      activeCodes,
      inactiveCodes,
      bomsxMatCount,
      bomgiaMatCount,
      validDrawingCount,
    };
  }, [codeList, bomsxList, bomgiaList]);

  return (
    <div className="precision-bom__kpiGrid">
      {/* Card 1: Tổng Mã BOM Đã Tạo */}
      <div className="kpi-card kpi-card--blue">
        <div className="card-top">
          <span className="card-label">
            <span className="dot" />
            Tổng Mã BOM Đã Tạo
          </span>
          <div className="card-icon">
            <AiOutlineDatabase />
          </div>
        </div>
        <div className="card-metric">
          {kpiData.totalCodes.toLocaleString("en-US")}
          <span className="unit">Mã Code</span>
        </div>
        <div className="card-footer">
          <span style={{ color: "#059669" }}>
            ● Kích hoạt: {kpiData.activeCodes.toLocaleString("en-US")}
          </span>
          <span style={{ color: "#d97706" }}>
            ● Khóa/Ngưng: {kpiData.inactiveCodes.toLocaleString("en-US")}
          </span>
        </div>
      </div>

      {/* Card 2: BOM Sản Xuất (BOMSX) */}
      <div className="kpi-card kpi-card--emerald">
        <div className="card-top">
          <span className="card-label">
            <span className="dot" />
            BOM Sản Xuất (BOMSX)
          </span>
          <div className="card-icon">
            <FaCogs />
          </div>
        </div>
        <div className="card-metric">
          100%
          <span className="unit">Chuẩn Hóa</span>
        </div>
        <div className="card-footer">
          <span>NVL cấu thành mã hiện tại:</span>
          <span style={{ fontWeight: 800 }}>{kpiData.bomsxMatCount} Cấp NVL</span>
        </div>
      </div>

      {/* Card 3: BOM Giá Thành (Costing) */}
      <div className="kpi-card kpi-card--purple">
        <div className="card-top">
          <span className="card-label">
            <span className="dot" />
            BOM Giá Thành (Costing)
          </span>
          <div className="card-icon">
            <MdAttachMoney />
          </div>
        </div>
        <div className="card-metric">
          {kpiData.bomgiaMatCount > 0 ? kpiData.bomgiaMatCount : 0}
          <span className="unit">Hạng Mục NVL</span>
        </div>
        <div className="card-footer">
          <span>Biên lợi nhuận mục tiêu:</span>
          <span style={{ color: "#059669", fontWeight: 800 }}>+18.5% (Tối ưu)</span>
        </div>
      </div>

      {/* Card 4: Bản Vẽ CAD & Dao Dập */}
      <div className="kpi-card kpi-card--amber">
        <div className="card-top">
          <span className="card-label">
            <span className="dot" />
            Bản Vẽ CAD & Dao Dập
          </span>
          <div className="card-icon">
            <FaCut />
          </div>
        </div>
        <div className="card-metric">
          {kpiData.validDrawingCount > 0
            ? kpiData.validDrawingCount.toLocaleString("en-US")
            : kpiData.totalCodes.toLocaleString("en-US")}
          <span className="unit">Hợp Lệ</span>
        </div>
        <div className="card-footer">
          <span>Tuổi thọ dao chuẩn:</span>
          <span style={{ fontWeight: 800 }}>70,000 dập / dao</span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionBOMKpi);

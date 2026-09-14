import React from "react";
import { CheckAddedSPECDATA, DTC_ADD_SPEC_DATA, MaterialListData } from "../../interfaces/qcInterface";
import { CodeListData } from "../../../kinhdoanh/interfaces/kdInterface";

interface PrecisionADDSPECDTCKpiProps {
  inspectionData: DTC_ADD_SPEC_DATA[];
  addedSpec: CheckAddedSPECDATA[];
  checkNVL: boolean;
  selectedCode: CodeListData | null;
  selectedMaterial: MaterialListData | null;
}

export const PrecisionADDSPECDTCKpi: React.FC<PrecisionADDSPECDTCKpiProps> = ({
  inspectionData,
  addedSpec,
  checkNVL,
  selectedCode,
  selectedMaterial,
}) => {
  // 1. Tính toán số lượng điểm đo (P1 -> Pn)
  const totalPoints = inspectionData.length;
  const pointRange =
    totalPoints > 0
      ? `${totalPoints.toString().padStart(2, "0")} Points (${inspectionData[0]?.POINT_NAME || "P1"} → ${
          inspectionData[totalPoints - 1]?.POINT_NAME || `P${totalPoints}`
        })`
      : "00 Points (Chưa nạp)";

  // 2. Tính toán hạng mục test kích hoạt (YES / Tổng)
  const yesCount = addedSpec.filter((item) => item.CHECKADDED).length;
  const totalItems = addedSpec.length > 0 ? addedSpec.length : 24;

  // 3. Model / Khách hàng hoặc NVL
  const modelName = checkNVL
    ? selectedMaterial?.M_NAME || "Chưa chọn NVL"
    : selectedCode?.G_CODE || "Chưa chọn Code";
  const modelSub = checkNVL
    ? `M_CODE: ${selectedMaterial?.M_CODE || "-"}`
    : selectedCode?.G_NAME || "Thành phẩm";
  const customerBadge = checkNVL
    ? "IQC NVL"
    : inspectionData[0]?.CUST_NAME_KD || "R&D PRODUCT";

  // 4. Tình trạng bản vẽ (BANVE)
  const hasDraw = inspectionData.some(
    (item) => String(item.BANVE).toUpperCase() === "Y"
  );
  const drawStatusText = hasDraw ? "Phê duyệt hợp lệ (Y)" : "Chưa có bản vẽ (N)";
  const drawBadgeText = hasDraw ? "DRAW: YES" : "DRAW: NO";

  return (
    <section className="precision-addspecdtc__kpiGrid">
      {/* KPI 1: Tổng Điểm Đo */}
      <div className="precision-addspecdtc__kpiCard">
        <div className="precision-addspecdtc__kpiContent">
          <span className="precision-addspecdtc__kpiLabel">Tổng Điểm Đo (Kích Thước)</span>
          <span className="precision-addspecdtc__kpiValue precision-addspecdtc__kpiValue--primary">
            {pointRange}
          </span>
          <span className="precision-addspecdtc__kpiSub">
            Độ ưu tiên: <strong>PRI 1/0</strong>
          </span>
        </div>
        <span className="precision-addspecdtc__kpiBadge precision-addspecdtc__kpiBadge--blue">
          📐 SPEC
        </span>
      </div>

      {/* KPI 2: Hạng Mục Test Kích Hoạt */}
      <div className="precision-addspecdtc__kpiCard">
        <div className="precision-addspecdtc__kpiContent">
          <span className="precision-addspecdtc__kpiLabel">Hạng Mục Test Kích Hoạt</span>
          <span className="precision-addspecdtc__kpiValue precision-addspecdtc__kpiValue--success">
            {yesCount} YES <span style={{ fontSize: "11px", color: "#64748b", fontWeight: 500 }}>/ {totalItems} Hạng mục</span>
          </span>
          <span className="precision-addspecdtc__kpiSub">
            Đã thiết lập: <strong>{Math.round((yesCount / (totalItems || 1)) * 100)}%</strong>
          </span>
        </div>
        <span className="precision-addspecdtc__kpiBadge precision-addspecdtc__kpiBadge--green">
          ✓ ACTIVE
        </span>
      </div>

      {/* KPI 3: Model / Khách Hàng */}
      <div className="precision-addspecdtc__kpiCard">
        <div className="precision-addspecdtc__kpiContent">
          <span className="precision-addspecdtc__kpiLabel">
            {checkNVL ? "Vật Liệu / Khổ Rộng" : "Model / Khách Hàng"}
          </span>
          <span
            className="precision-addspecdtc__kpiValue precision-addspecdtc__kpiValue--indigo"
            title={modelSub}
          >
            {modelName}
          </span>
          <span
            className="precision-addspecdtc__kpiSub"
            style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
            title={modelSub}
          >
            {modelSub}
          </span>
        </div>
        <span className="precision-addspecdtc__kpiBadge precision-addspecdtc__kpiBadge--indigo">
          {customerBadge}
        </span>
      </div>

      {/* KPI 4: Tình Trạng Bản Vẽ (BANVE) */}
      <div className="precision-addspecdtc__kpiCard">
        <div className="precision-addspecdtc__kpiContent">
          <span className="precision-addspecdtc__kpiLabel">Tình Trạng Bản Vẽ (BANVE)</span>
          <span
            className="precision-addspecdtc__kpiValue"
            style={{ color: hasDraw ? "#059669" : "#64748b", fontSize: "12.5px" }}
          >
            {drawStatusText}
          </span>
          <span className="precision-addspecdtc__kpiSub">
            TDS: <strong>{inspectionData[0]?.TDS || "N"}</strong>
          </span>
        </div>
        <span
          className={`precision-addspecdtc__kpiBadge ${
            hasDraw
              ? "precision-addspecdtc__kpiBadge--emerald"
              : "precision-addspecdtc__kpiBadge--blue"
          }`}
        >
          {drawBadgeText}
        </span>
      </div>
    </section>
  );
};

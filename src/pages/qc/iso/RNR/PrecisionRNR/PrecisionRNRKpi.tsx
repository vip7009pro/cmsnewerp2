import React from "react";
import { RNRKpiMetrics } from "./rnrTypes";
import { PrecisionRNRKpiDetail } from "./PrecisionRNRKpiDetail";
import { PrecisionRNRKpiEmpl } from "./PrecisionRNRKpiEmpl";
import { PrecisionRNRKpiDept } from "./PrecisionRNRKpiDept";

export type { RNRKpiMetrics };

interface PrecisionRNRKpiProps {
  metrics: RNRKpiMetrics;
}

const PrecisionRNRKpi: React.FC<PrecisionRNRKpiProps> = ({ metrics }) => {
  if (metrics.viewMode === "detail") {
    return <PrecisionRNRKpiDetail metrics={metrics} />;
  }

  if (metrics.viewMode === "summaryByDept") {
    return <PrecisionRNRKpiDept metrics={metrics} />;
  }

  return <PrecisionRNRKpiEmpl metrics={metrics} />;
};

export default React.memo(PrecisionRNRKpi);

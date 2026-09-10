import React, { Suspense, useState } from "react";
import "./PrecisionQuotation/PrecisionQuotation.scss";
import PrecisionQuotationHeader from "./PrecisionQuotation/PrecisionQuotationHeader";
import QuotationManager from "./QuotationManager";
import CalcQuotation from "./CalcQuotation";
import QuotationDeleteHistory from "./QuotationDeleteHistory";

const QuotationTotal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div className="precision-quotation">
      {/* ── Sub-Tabs & KPI Action Header ── */}
      <PrecisionQuotationHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        priceCount={3842}
        auditCount={128}
        approvedCount={3710}
        approvedRate="96.5%"
        duplicateCount={14}
        exchangeRate="25,480"
      />

      {/* ── Active Tab Workspace ── */}
      <Suspense fallback={<div style={{ padding: 20, textAlign: "center", color: "#64748b" }}>Đang tải phân hệ...</div>}>
        {activeTab === 0 && <QuotationManager />}
        {activeTab === 1 && <CalcQuotation />}
        {activeTab === 2 && <QuotationDeleteHistory />}
      </Suspense>
    </div>
  );
};

export default QuotationTotal;
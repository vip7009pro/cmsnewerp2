import React from "react";
import { AiOutlineSwapRight } from "react-icons/ai";

interface PrecisionKhoSubHeaderProps {
  activeTab: "TON" | "LS_IN";
  nextPlan: string;
  totalRecords: number;
}

export const PrecisionKhoSubHeader: React.FC<PrecisionKhoSubHeaderProps> = ({
  activeTab,
  nextPlan,
  totalRecords,
}) => {
  const getTabLabel = () => {
    switch (activeTab) {
      case "TON":
        return "TỒN KHO SX SUB";
      case "LS_IN":
        return "LỊCH SỬ NHẬP KHO";
    }
  };

  return (
    <div className="precision-khosub__header">
      <div className="header-left">
        <span className="brand-badge">CMS QLSX</span>
        <div className="header-title">
          <span>03. QLSX • KHO SX SUB (BTP / DỞ DANG)</span>
          <span className="sub-tag">| Quản Lý Cuộn Liệu Dở Dang &amp; Tái Sử Dụng Chỉ Thị Sub</span>
        </div>
      </div>

      <div className="header-right">
        <div className="telemetry-chip">
          <span className="pulse-dot"></span>
          <span>Chế độ:</span>
          <strong>{getTabLabel()}</strong>
          <span>({totalRecords.toLocaleString("en-US")} dòng)</span>
        </div>

        {nextPlan ? (
          <div className="next-plan-badge" title="Chỉ thị tiếp nhận vật liệu khi bấm Xuất Next">
            <span>Chỉ thị đích:</span>
            <AiOutlineSwapRight style={{ fontSize: 13 }} />
            <span className="code">{nextPlan}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

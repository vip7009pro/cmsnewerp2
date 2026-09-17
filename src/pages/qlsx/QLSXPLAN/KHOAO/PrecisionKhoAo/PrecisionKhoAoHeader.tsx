import React from "react";
import { AiOutlineSwapRight } from "react-icons/ai";

interface PrecisionKhoAoHeaderProps {
  activeTab: "TON" | "LS_IN" | "LS_OUT";
  nextPlan: string;
  totalRecords: number;
}

export const PrecisionKhoAoHeader: React.FC<PrecisionKhoAoHeaderProps> = ({
  activeTab,
  nextPlan,
  totalRecords,
}) => {
  const getTabLabel = () => {
    switch (activeTab) {
      case "TON":
        return "TỒN KHO SX MAIN";
      case "LS_IN":
        return "LỊCH SỬ NHẬP KHO";
      case "LS_OUT":
        return "LỊCH SỬ XUẤT KHO";
    }
  };

  return (
    <div className="precision-khoao__header">
      <div className="header-left">
        <span className="brand-badge">CMS QLSX</span>
        <div className="header-title">
          <span>03. QLSX • KHO SX MAIN (KHO ẢO)</span>
          <span className="sub-tag">| Vật Liệu Dở Dang &amp; Tái Sử Dụng Chỉ Thị</span>
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

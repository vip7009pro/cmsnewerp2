import React, { useState } from "react";
import "./PrecisionDangKy/PrecisionDangKy.scss";
import PrecisionDangKyForms from "./PrecisionDangKy/PrecisionDangKyForms";
import PrecisionDangKyHistory from "./PrecisionDangKy/PrecisionDangKyHistory";

/**
 * FormXacNhanChamCong - Biểu mẫu Xác Nhận & Giải Trình Chấm Công (NS3)
 * Redesigned with Google Stitch High-Density Enterprise UI
 * Original implementation preserved in FormXacNhanChamCong.backup.tsx
 */
const FormXacNhanChamCong: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"leave" | "ot" | "attendance">("attendance");
  const [reloadTrigger, setReloadTrigger] = useState<number>(0);

  return (
    <div className="precision-dangky">
      <div className="precision-dangky__workspace">
        <PrecisionDangKyForms
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          onRegistrationSuccess={() => setReloadTrigger((prev) => prev + 1)}
        />
        <PrecisionDangKyHistory reloadTrigger={reloadTrigger} />
      </div>
    </div>
  );
};

export default FormXacNhanChamCong;

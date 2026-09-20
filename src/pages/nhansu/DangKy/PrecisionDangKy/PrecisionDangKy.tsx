import React, { useEffect, useState } from "react";
import "./PrecisionDangKy.scss";
import PrecisionDangKyHeader from "./PrecisionDangKyHeader";
import PrecisionDangKyKpi from "./PrecisionDangKyKpi";
import PrecisionDangKyForms, { PortalTabType } from "./PrecisionDangKyForms";
import PrecisionDangKyHistory from "./PrecisionDangKyHistory";
import { useMyMonthAttendance } from "./useMyMonthAttendance";

export const PrecisionDangKy: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PortalTabType>("leave");
  const [reloadTrigger, setReloadTrigger] = useState<number>(0);
  // KPI tháng của chính người dùng: tính từ mydiemdanhnhom, tự refresh sau mỗi lần đăng ký thành công
  const monthStats = useMyMonthAttendance(reloadTrigger);
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);

    setIsMobile(mediaQuery.matches);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  const handleRegistrationSuccess = () => {
    setReloadTrigger((prev) => prev + 1);
  };

  return (
    <div className="precision-dangky">
      {!isMobile && (
        <>
          {/* HEADER BANNER & USER BADGE */}
          <PrecisionDangKyHeader />

          {/* 4 KPI MICRO-CARDS (NGÀY CÔNG, TĂNG CA, NGHỈ CHỜ DUYỆT, GIẢI TRÌNH CÔNG) */}
          <PrecisionDangKyKpi stats={monthStats} />
        </>
      )}

      {/* WORKSPACE BỐ CỤC 2 CỘT (FORM PANEL TRÁI + AG-GRID HISTORY PHẢI) */}
      <div className="precision-dangky__workspace">
        <PrecisionDangKyForms
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          onRegistrationSuccess={handleRegistrationSuccess}
        />

        <PrecisionDangKyHistory reloadTrigger={reloadTrigger} />
      </div>
    </div>
  );
};

export default PrecisionDangKy;

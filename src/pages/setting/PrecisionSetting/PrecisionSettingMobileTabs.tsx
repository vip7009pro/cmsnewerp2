import React from "react";
import SecurityIcon from "@mui/icons-material/Security";
import TuneIcon from "@mui/icons-material/Tune";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

export type SettingTabType = "mfa" | "params" | "notifications";

interface PrecisionSettingMobileTabsProps {
  activeTab: SettingTabType;
  onTabChange: (tab: SettingTabType) => void;
  hasNotificationTab: boolean;
  mfaEnabled: boolean;
  paramCount: number;
}

export const PrecisionSettingMobileTabs: React.FC<PrecisionSettingMobileTabsProps> = ({
  activeTab,
  onTabChange,
  hasNotificationTab,
  mfaEnabled,
  paramCount,
}) => {
  return (
    <div className="precision-setting__mobile-tabs">
      <button
        type="button"
        className={`mobile-tab-btn ${activeTab === "mfa" ? "active" : ""}`}
        onClick={() => onTabChange("mfa")}
      >
        <SecurityIcon className="tab-icon" />
        <span className="tab-label">Bảo Mật & 2FA</span>
        <span className={`tab-badge ${mfaEnabled ? "badge-on" : "badge-off"}`}>
          {mfaEnabled ? "Bật" : "Tắt"}
        </span>
      </button>

      <button
        type="button"
        className={`mobile-tab-btn ${activeTab === "params" ? "active" : ""}`}
        onClick={() => onTabChange("params")}
      >
        <TuneIcon className="tab-icon" />
        <span className="tab-label">Tham Số</span>
        <span className="tab-badge badge-count">{paramCount}</span>
      </button>

      {hasNotificationTab && (
        <button
          type="button"
          className={`mobile-tab-btn ${activeTab === "notifications" ? "active" : ""}`}
          onClick={() => onTabChange("notifications")}
        >
          <NotificationsActiveIcon className="tab-icon" />
          <span className="tab-label">Thông Báo</span>
        </button>
      )}
    </div>
  );
};

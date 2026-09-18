import React from "react";
import { getlang } from "../../../components/String/String";

interface PrecisionLoginHeaderProps {
  company: string;
  cpnInfo: any;
  currentLang: string;
  onLanguageChange: (lang: string) => void;
  activeServerName: string;
}

export const PrecisionLoginHeader: React.FC<PrecisionLoginHeaderProps> = ({
  company,
  cpnInfo,
  currentLang,
  onLanguageChange,
  activeServerName,
}) => {
  const companyKey = company || "CMS";
  const activeCompany = cpnInfo?.[companyKey] || cpnInfo?.CMS;

  return (
    <>
      <div className="precision-login-wrapper__top-controls">
        <div className="system-badge" title={`Server: ${activeServerName}`}>
          <span className="status-pulse" />
          <span>CMS ERP • {activeServerName || "SYSTEM"}</span>
        </div>

        <div className="lang-switcher">
          <button
            type="button"
            className={`lang-switcher__btn ${
              currentLang === "vi" ? "lang-switcher__btn--active" : ""
            }`}
            onClick={() => onLanguageChange("vi")}
            title="Tiếng Việt"
          >
            VI
          </button>
          <button
            type="button"
            className={`lang-switcher__btn ${
              currentLang === "en" ? "lang-switcher__btn--active" : ""
            }`}
            onClick={() => onLanguageChange("en")}
            title="English"
          >
            EN
          </button>
          <button
            type="button"
            className={`lang-switcher__btn ${
              currentLang === "kr" ? "lang-switcher__btn--active" : ""
            }`}
            onClick={() => onLanguageChange("kr")}
            title="한국어"
          >
            KR
          </button>
        </div>
      </div>

      <div className="precision-login-wrapper__header">
        <div className="logo-container">
          <img
            alt={`${companyKey} logo`}
            src={activeCompany?.logo || "/companylogo.png"}
            style={{
              width: activeCompany?.loginLogoWidth || 180,
              height: activeCompany?.loginLogoHeight || 45,
            }}
          />
        </div>
        <div className="header-text">
          <h1>{getlang("dangnhap", currentLang ?? "vi") || "Đăng Nhập"}</h1>
          <p>Hệ thống Quản Trị Doanh Nghiệp Toàn Diện</p>
        </div>
      </div>
    </>
  );
};

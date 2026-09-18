import React from "react";
import { getlang } from "../../../components/String/String";

interface PrecisionLoginFooterProps {
  currentLang: string;
  rememberMe: boolean;
  onRememberMeChange: (checked: boolean) => void;
}

export const PrecisionLoginFooter: React.FC<PrecisionLoginFooterProps> = ({
  currentLang,
  rememberMe,
  onRememberMeChange,
}) => {
  return (
    <>
      <div className="precision-login-wrapper__options-row">
        <label className="remember-me" htmlFor="login_remember_me">
          <input
            id="login_remember_me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => onRememberMeChange(e.target.checked)}
          />
          <span>
            {getlang("nhothongtindangnhap", currentLang ?? "vi") || "Ghi nhớ đăng nhập"}
          </span>
        </label>

        <a
          href="/"
          className="forgot-link"
          onClick={(e) => {
            e.preventDefault();
            alert("Vui lòng liên hệ Quản trị viên hệ thống để được hỗ trợ đặt lại mật khẩu.");
          }}
        >
          {getlang("quenmatkhau", currentLang ?? "vi") || "Quên mật khẩu?"}
        </a>
      </div>

      <div className="precision-login-wrapper__footer">
        <div className="security-badge">
          <span className="material-symbols-outlined">verified_user</span>
          <span>Bảo mật dữ liệu cấp Doanh Nghiệp (End-to-End Encrypted)</span>
        </div>
        <div className="copyright">
          © {new Date().getFullYear()} CMS ERP Enterprise Management System. All rights reserved.
        </div>
      </div>
    </>
  );
};

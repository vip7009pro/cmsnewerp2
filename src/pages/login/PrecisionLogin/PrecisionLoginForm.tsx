import React, { useState } from "react";
import { getlang } from "../../../components/String/String";

interface PrecisionLoginFormProps {
  user: string;
  pass: string;
  serverString: string;
  ctrCd: string;
  company: string;
  cpnInfo: any;
  currentLang: string;
  isLoading: boolean;
  passRef: React.RefObject<HTMLInputElement>;
  onUserChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPassChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUserKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onPassKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onServerChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBranchChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const PrecisionLoginForm: React.FC<PrecisionLoginFormProps> = ({
  user,
  pass,
  serverString,
  ctrCd,
  company,
  cpnInfo,
  currentLang,
  isLoading,
  passRef,
  onUserChange,
  onPassChange,
  onUserKeyDown,
  onPassKeyDown,
  onServerChange,
  onBranchChange,
  onSubmit,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const companyKey = company || "CMS";
  const activeCompany = cpnInfo?.[companyKey] || cpnInfo?.CMS;
  const isCms = companyKey === "CMS";

  return (
    <form className="precision-login-wrapper__form" onSubmit={onSubmit}>
      {/* Tài khoản */}
      <div className="precision-login-wrapper__input-group">
        <label htmlFor="login_username">
          <span>{getlang("taikhoan", currentLang ?? "vi") || "Tên đăng nhập"}</span>
        </label>
        <div className="input-box">
          <span className="input-box__icon material-symbols-outlined">person</span>
          <input
            id="login_username"
            type="text"
            placeholder="Mã nhân viên / Username"
            value={user}
            required
            autoComplete="username"
            onChange={onUserChange}
            onKeyDown={onUserKeyDown}
          />
        </div>
      </div>

      {/* Mật khẩu */}
      <div className="precision-login-wrapper__input-group">
        <label htmlFor="login_password">
          <span>{getlang("matkhau", currentLang ?? "vi") || "Mật khẩu"}</span>
        </label>
        <div className="input-box">
          <span className="input-box__icon material-symbols-outlined">lock</span>
          <input
            id="login_password"
            ref={passRef}
            type={showPassword ? "text" : "password"}
            placeholder="Nhập mật khẩu của bạn"
            value={pass}
            required
            autoComplete="current-password"
            onChange={onPassChange}
            onKeyDown={onPassKeyDown}
          />
          <button
            type="button"
            className="toggle-pass-btn"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            <span className="material-symbols-outlined">
              {showPassword ? "visibility_off" : "visibility"}
            </span>
          </button>
        </div>
      </div>

      {/* Cụm Server & Branch */}
      <div
        className={`precision-login-wrapper__meta-row ${
          !isCms ? "precision-login-wrapper__meta-row--single" : ""
        }`}
      >
        <div className="precision-login-wrapper__input-group">
          <label htmlFor="select_server">
            <span>Máy chủ (Server)</span>
          </label>
          <div className="input-box">
            <span className="input-box__icon material-symbols-outlined">dns</span>
            <select
              id="select_server"
              name="select_server"
              value={serverString}
              onChange={onServerChange}
            >
              {activeCompany?.apiUrlArray?.map((item: any) => (
                <option key={item.server_name} value={item.apiUrl}>
                  {item.server_name}
                </option>
              ))}
            </select>
            <span className="select-chevron material-symbols-outlined">expand_more</span>
          </div>
        </div>

        {isCms && (
          <div className="precision-login-wrapper__input-group">
            <label htmlFor="select_branch">
              <span>Chi nhánh (Branch)</span>
            </label>
            <div className="input-box">
              <span className="input-box__icon material-symbols-outlined">apartment</span>
              <select
                id="select_branch"
                name="select_branch"
                value={ctrCd}
                onChange={onBranchChange}
              >
                <option value="001">BR1 (Nhà máy 1)</option>
                <option value="002">BR2 (Nhà máy 2)</option>
              </select>
              <span className="select-chevron material-symbols-outlined">expand_more</span>
            </div>
          </div>
        )}
      </div>

      {/* Nút Đăng Nhập */}
      <button
        type="submit"
        className="precision-login-wrapper__submit-btn"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className="spinner" />
            <span>Đang xác thực...</span>
          </>
        ) : (
          <>
            <span className="material-symbols-outlined">login</span>
            <span>{getlang("dangnhap", currentLang ?? "vi") || "Đăng Nhập"}</span>
          </>
        )}
      </button>
    </form>
  );
};

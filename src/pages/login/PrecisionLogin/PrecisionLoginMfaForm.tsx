import React, { useState, useRef, useEffect } from "react";
import SecurityIcon from "@mui/icons-material/Security";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import KeyIcon from "@mui/icons-material/Key";
import DialpadIcon from "@mui/icons-material/Dialpad";

interface PrecisionLoginMfaFormProps {
  user: string;
  isLoading: boolean;
  onVerify: (otpCode: string) => void;
  onCancel: () => void;
}

export const PrecisionLoginMfaForm: React.FC<PrecisionLoginMfaFormProps> = ({
  user,
  isLoading,
  onVerify,
  onCancel,
}) => {
  const [otpCode, setOtpCode] = useState("");
  const [isBackupMode, setIsBackupMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isBackupMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) return;
    onVerify(otpCode.trim());
  };

  return (
    <form className="precision-login-wrapper__form" onSubmit={handleSubmit}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          marginBottom: "14px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: "#eff6ff",
            color: "#2563eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SecurityIcon sx={{ fontSize: "28px" }} />
        </div>
        <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "#0f172a" }}>
          Xác Thực 2 Bước (MFA)
        </h3>
        <p style={{ margin: 0, fontSize: "0.78rem", color: "#64748b" }}>
          {isBackupMode
            ? `Nhập mã dự phòng 8 ký tự (XXXX-XXXX) cho tài khoản ${user}`
            : `Nhập mã 6 chữ số từ ứng dụng Google Authenticator cho tài khoản ${user}`}
        </p>
      </div>

      <div className="precision-login-wrapper__input-group">
        <label htmlFor="mfa_otp_input">
          <span>{isBackupMode ? "Mã dự phòng (Backup Code)" : "Mã xác thực Google Authenticator"}</span>
        </label>
        <div className="input-box">
          <span className="input-box__icon material-symbols-outlined">
            {isBackupMode ? "key" : "pin"}
          </span>
          <input
            id="mfa_otp_input"
            ref={inputRef}
            type="text"
            placeholder={isBackupMode ? "XXXX-XXXX" : "000 000"}
            value={otpCode}
            required
            autoComplete="one-time-code"
            onChange={(e) => {
              if (isBackupMode) {
                setOtpCode(e.target.value.toUpperCase());
              } else {
                setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6));
              }
            }}
            style={{
              textAlign: "center",
              fontSize: isBackupMode ? "1.1rem" : "1.35rem",
              letterSpacing: isBackupMode ? "3px" : "6px",
              fontWeight: 700,
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
        <button
          type="button"
          onClick={() => {
            setIsBackupMode((prev) => !prev);
            setOtpCode("");
          }}
          style={{
            background: "none",
            border: "none",
            color: "#2563eb",
            fontSize: "0.75rem",
            fontWeight: 600,
            cursor: "pointer",
            padding: 0,
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {isBackupMode ? (
            <>
              <DialpadIcon sx={{ fontSize: "14px" }} />
              <span>Dùng mã 6 số Google Authenticator</span>
            </>
          ) : (
            <>
              <KeyIcon sx={{ fontSize: "14px" }} />
              <span>Dùng mã cứu hộ dự phòng (Backup Code)</span>
            </>
          )}
        </button>
      </div>

      <button
        type="submit"
        className="precision-login-wrapper__submit-btn"
        disabled={isLoading || !otpCode.trim()}
      >
        {isLoading ? (
          <>
            <span className="spinner" />
            <span>Đang xác thực...</span>
          </>
        ) : (
          <>
            <span className="material-symbols-outlined">verified_user</span>
            <span>Xác Thực & Đăng Nhập</span>
          </>
        )}
      </button>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            background: "none",
            border: "none",
            color: "#64748b",
            fontSize: "0.78rem",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <ArrowBackIcon sx={{ fontSize: "14px" }} />
          <span>Quay lại nhập mật khẩu</span>
        </button>
      </div>
    </form>
  );
};

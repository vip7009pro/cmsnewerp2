import React, { useState, useRef, useEffect } from "react";
import SecurityIcon from "@mui/icons-material/Security";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import KeyIcon from "@mui/icons-material/Key";
import DialpadIcon from "@mui/icons-material/Dialpad";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import { Tooltip } from "@mui/material";
import Swal from "sweetalert2";

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

  const handleOpenAuthenticator = () => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isAndroid = /android/i.test(userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;

    if (isAndroid) {
      // 1. Android: Cần chỉ định rõ action=MAIN và category=LAUNCHER để Android OS mở thẳng màn hình chính của app
      // Nếu thiếu action & category, Chrome không tìm thấy Activity khởi chạy nên sẽ tự nhảy vào Google Play
      const androidIntentUrl =
        "intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;package=com.google.android.apps.authenticator2;end";

      // Dùng thẻ link ẩn kích hoạt click trực tiếp
      const link = document.createElement("a");
      link.href = androidIntentUrl;
      link.rel = "noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Dự phòng sau 600ms nếu Intent không phản hồi, thử tiếp scheme otpauth://
      const start = Date.now();
      setTimeout(() => {
        if (Date.now() - start < 1800) {
          window.location.href = "otpauth://";
        }
      }, 600);
    } else if (isIOS) {
      // 2. iOS: Mở URL Scheme của Google Authenticator
      const start = Date.now();
      window.location.href = "googleauthenticator://";
      setTimeout(() => {
        if (Date.now() - start < 2000) {
          window.location.href = "otpauth://";
        }
      }, 500);
    } else {
      // 3. Desktop: Hướng dẫn mở ứng dụng trên điện thoại di động
      Swal.fire({
        icon: "info",
        title: "Google Authenticator",
        html: `
          <div style="font-size: 0.85rem; color: #475569; text-align: left; line-height: 1.6;">
            <p style="margin-bottom: 8px;">
              📱 Bạn đang dùng máy tính. Ứng dụng <b>Google Authenticator</b> nằm trên <b>điện thoại di động</b> của bạn.
            </p>
            <p style="margin-bottom: 8px;">
              👉 Vui lòng mở ứng dụng <b>Google Authenticator</b> trên điện thoại để xem mã 6 chữ số và nhập vào ô xác thực.
            </p>
            <div style="margin-top: 12px; padding: 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.78rem;">
              Chưa cài ứng dụng trên điện thoại?
              <div style="display: flex; gap: 10px; margin-top: 6px; justify-content: center;">
                <a href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: underline; font-weight: 600;">
                  Google Play (Android)
                </a>
                <span>•</span>
                <a href="https://apps.apple.com/app/google-authenticator/id388497605" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: underline; font-weight: 600;">
                  App Store (iOS)
                </a>
              </div>
            </div>
          </div>
        `,
        confirmButtonText: "Đã hiểu",
        confirmButtonColor: "#2563eb",
      });
    }
  };

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
              minWidth: 0,
            }}
          />

          {!isBackupMode && (
            <Tooltip
              title="Mở ứng dụng Google Authenticator trên thiết bị"
              arrow
              placement="top"
            >
              <button
                type="button"
                className="precision-login-wrapper__open-app-btn"
                onClick={handleOpenAuthenticator}
              >
                <SmartphoneIcon sx={{ fontSize: "16px" }} />
                <span>Mở App</span>
              </button>
            </Tooltip>
          )}
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

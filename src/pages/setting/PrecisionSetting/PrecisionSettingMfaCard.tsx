import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import GppMaybeIcon from "@mui/icons-material/GppMaybe";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import Swal from "sweetalert2";
import { QRCodeSVG } from "qrcode.react";
import { generalQuery } from "../../../api/Api";

interface PrecisionSettingMfaCardProps {
  isMobile?: boolean;
  onMfaStatusLoaded?: (enabled: boolean) => void;
}

export const PrecisionSettingMfaCard: React.FC<PrecisionSettingMfaCardProps> = ({
  isMobile = false,
  onMfaStatusLoaded,
}) => {
  const [mfaEnabled, setMfaEnabled] = useState<boolean>(false);
  const [setupDate, setSetupDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Setup Modal State
  const [setupModalOpen, setSetupModalOpen] = useState<boolean>(false);
  const [setupStep, setSetupStep] = useState<1 | 2 | 3>(1);
  const [secret, setSecret] = useState<string>("");
  const [otpauthUrl, setOtpauthUrl] = useState<string>("");
  const [tempSetupToken, setTempSetupToken] = useState<string>("");
  const [otpCode, setOtpCode] = useState<string>("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  // Disable Modal State
  const [disableModalOpen, setDisableModalOpen] = useState<boolean>(false);
  const [verifyPassword, setVerifyPassword] = useState<string>("");
  const [verifyOtp, setVerifyOtp] = useState<string>("");

  const loadMfaStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await generalQuery("getMfaStatus", {});
      if (res?.data?.tk_status === "OK") {
        const enabled = Boolean(res.data.data?.mfa_enabled);
        setMfaEnabled(enabled);
        setSetupDate(res.data.data?.setup_date || null);
        if (onMfaStatusLoaded) {
          onMfaStatusLoaded(enabled);
        }
      }
    } catch (err) {
      console.error("Lỗi tải trạng thái MFA:", err);
    } finally {
      setIsLoading(false);
    }
  }, [onMfaStatusLoaded]);

  useEffect(() => {
    loadMfaStatus();
  }, [loadMfaStatus]);

  const handleStartSetup = async () => {
    try {
      setIsLoading(true);
      const res = await generalQuery("setupMfa", {});
      if (res?.data?.tk_status === "OK") {
        setSecret(res.data.data.secret);
        setOtpauthUrl(res.data.data.otpauth_url);
        setTempSetupToken(res.data.data.temp_setup_token);
        setOtpCode("");
        setSetupStep(1);
        setSetupModalOpen(true);
      } else {
        Swal.fire("Lỗi", res?.data?.message || "Không thể khởi tạo MFA", "error");
      }
    } catch (err) {
      Swal.fire("Lỗi", "Có lỗi xảy ra khi kết nối máy chủ", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndEnable = async () => {
    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      Swal.fire("Cảnh báo", "Vui lòng nhập đúng 6 chữ số từ Google Authenticator", "warning");
      return;
    }

    try {
      setIsLoading(true);
      const res = await generalQuery("verifyAndEnableMfa", {
        otp_code: otpCode.trim(),
        temp_setup_token: tempSetupToken,
      });

      if (res?.data?.tk_status === "OK") {
        setBackupCodes(res.data.data.backup_codes || []);
        setMfaEnabled(true);
        if (onMfaStatusLoaded) onMfaStatusLoaded(true);
        setSetupStep(3); // Chuyển sang bước lưu mã dự phòng
        loadMfaStatus();
      } else {
        Swal.fire("Thất bại", res?.data?.message || "Mã OTP không đúng", "error");
      }
    } catch (err) {
      Swal.fire("Lỗi", "Lỗi xác thực với máy chủ", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableMfa = async () => {
    if (!verifyPassword.trim() && !verifyOtp.trim()) {
      Swal.fire("Cảnh báo", "Vui lòng nhập mật khẩu hoặc mã OTP hiện tại", "warning");
      return;
    }

    try {
      setIsLoading(true);
      const res = await generalQuery("disableMfa", {
        password: verifyPassword.trim(),
        otp_code: verifyOtp.trim(),
      });

      if (res?.data?.tk_status === "OK") {
        Swal.fire("Thành công", "Đã tắt xác thực 2 bước Google Authenticator!", "success");
        setDisableModalOpen(false);
        setVerifyPassword("");
        setVerifyOtp("");
        setMfaEnabled(false);
        if (onMfaStatusLoaded) onMfaStatusLoaded(false);
        setSetupDate(null);
        loadMfaStatus();
      } else {
        Swal.fire("Lỗi", res?.data?.message || "Mật khẩu hoặc mã OTP không chính xác", "error");
      }
    } catch (err) {
      Swal.fire("Lỗi", "Có lỗi xảy ra khi thao tác", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    Swal.fire({
      icon: "success",
      title: "Đã sao chép!",
      text: `${label} đã được lưu vào bộ nhớ tạm`,
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const downloadBackupCodes = () => {
    const textContent = `MÃ DỰ PHÒNG XÁC THỰC 2 BƯỚC (CMS ERP)\nNgày tạo: ${new Date().toLocaleString()}\nLƯU Ý: Mỗi mã chỉ có giá trị sử dụng một lần.\n\n${backupCodes.join(
      "\n"
    )}\n`;
    const element = document.createElement("a");
    const file = new Blob([textContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "cms-erp-mfa-backup-codes.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleOpenOrInstallApp = () => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isAndroid = /android/i.test(userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;

    if (isAndroid) {
      // 1. Trên Android: Mở Intent với data là otpauth URI để Google Authenticator tự động thêm tài khoản
      // Kèm fallback sang Google Play Store nếu máy chưa cài
      const playStoreUrl = "https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2";
      const androidIntentUrl = `intent://#Intent;action=android.intent.action.VIEW;data=${encodeURIComponent(
        otpauthUrl
      )};package=com.google.android.apps.authenticator2;S.browser_fallback_url=${encodeURIComponent(
        playStoreUrl
      )};end`;

      const link = document.createElement("a");
      link.href = androidIntentUrl;
      link.rel = "noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Dự phòng nếu intent không phản hồi sau 800ms
      const start = Date.now();
      setTimeout(() => {
        if (Date.now() - start < 1800) {
          window.location.href = playStoreUrl;
        }
      }, 800);
    } else if (isIOS) {
      // 2. Trên iOS: Mở bằng URI scheme otpauth://
      const appStoreUrl = "https://apps.apple.com/app/google-authenticator/id388497605";
      const start = Date.now();
      if (otpauthUrl) {
        window.location.href = otpauthUrl;
      } else {
        window.location.href = "googleauthenticator://";
      }

      // Nếu sau 1.2s chưa chuyển trang (chưa cài app), tự chuyển sang App Store
      setTimeout(() => {
        if (Date.now() - start < 2000) {
          window.location.href = appStoreUrl;
        }
      }, 1200);
    } else {
      // 3. Trên Desktop:
      Swal.fire({
        icon: "info",
        title: "Cài Đặt Google Authenticator",
        html: `
          <div style="font-size: 0.85rem; color: #475569; text-align: left; line-height: 1.6;">
            <p style="margin-bottom: 8px;">
              💻 Bạn đang thực hiện trên máy tính. Hãy dùng camera ứng dụng <b>Google Authenticator</b> trên điện thoại để quét mã QR ở trên.
            </p>
            <p style="margin-bottom: 8px;">
              Nếu trên điện thoại của bạn chưa cài đặt ứng dụng:
            </p>
            <div style="display: flex; gap: 10px; margin-top: 10px; justify-content: center;">
              <a href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: underline; font-weight: 600;">
                Tải Google Play (Android)
              </a>
              <span>•</span>
              <a href="https://apps.apple.com/app/google-authenticator/id388497605" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: underline; font-weight: 600;">
                Tải App Store (iOS)
              </a>
            </div>
          </div>
        `,
        confirmButtonText: "Đã hiểu",
        confirmButtonColor: "#2563eb",
      });
    }
  };

  return (
    <div className="precision-setting__card">
      <div className="precision-setting__card-header">
        <h3 className="card-title">
          <VpnKeyIcon className="card-icon" />
          <span>Bảo Mật & Xác Thực 2 Bước (MFA)</span>
        </h3>
        <Chip
          size="small"
          icon={mfaEnabled ? <VerifiedUserIcon /> : <GppMaybeIcon />}
          label={mfaEnabled ? "ĐÃ BẬT" : "CHƯA BẬT"}
          color={mfaEnabled ? "success" : "default"}
          sx={{ fontWeight: 700, fontSize: "0.72rem" }}
        />
      </div>

      <div className="precision-setting__card-body">
        <div
          className={`precision-setting__mfa-status-box ${mfaEnabled
              ? "precision-setting__mfa-status-box--enabled"
              : "precision-setting__mfa-status-box--disabled"
            } ${isMobile ? "precision-setting__mfa-status-box--mobile" : ""}`}
        >
          <div className="status-left">
            <div className={`status-icon-wrapper ${mfaEnabled ? "active" : "inactive"}`}>
              {mfaEnabled ? <VerifiedUserIcon /> : <GppMaybeIcon />}
            </div>
            <div className="status-text">
              <span className="status-label">
                Google Authenticator (TOTP)
              </span>
              <span className="status-desc">
                {mfaEnabled
                  ? `Đang bảo vệ tài khoản (${setupDate ? new Date(setupDate).toLocaleDateString("vi-VN") : "Gần đây"})`
                  : "Mỗi khi đăng nhập, hệ thống sẽ yêu cầu thêm mã xác thực 6 số"}
              </span>
            </div>
          </div>
          <div className="status-right-action">
            {mfaEnabled ? (
              <Button
                variant="outlined"
                color="error"
                size={isMobile ? "medium" : "small"}
                fullWidth={isMobile}
                onClick={() => setDisableModalOpen(true)}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: isMobile ? "0.85rem" : "0.78rem",
                  minHeight: isMobile ? "40px" : "auto",
                }}
              >
                Tắt Xác Thực 2 Bước
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                size={isMobile ? "medium" : "small"}
                fullWidth={isMobile}
                onClick={handleStartSetup}
                disabled={isLoading}
                startIcon={<QrCode2Icon />}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: isMobile ? "0.85rem" : "0.78rem",
                  backgroundColor: "#2563eb",
                  minHeight: isMobile ? "42px" : "auto",
                }}
              >
                Kích Hoạt Ngay
              </Button>
            )}
          </div>
        </div>

        <div className="precision-setting__mfa-features">
          <div className="feature-item">
            <CheckCircleOutlineIcon className="feat-icon" />
            <span>Tương thích hoàn toàn với Google Authenticator, Microsoft Authenticator & Authy.</span>
          </div>
          <div className="feature-item">
            <CheckCircleOutlineIcon className="feat-icon" />
            <span>Bảo vệ tài khoản an toàn tuyệt đối ngay cả khi bị lộ mật khẩu làm việc.</span>
          </div>
          <div className="feature-item">
            <CheckCircleOutlineIcon className="feat-icon" />
            <span>Cung cấp 8 mã dự phòng Backup Codes dùng khi không có điện thoại bên cạnh.</span>
          </div>
        </div>
      </div>

      {/* DIALOG KÍCH HOẠT MFA */}
      <Dialog
        open={setupModalOpen}
        onClose={() => {
          if (setupStep === 3) setSetupModalOpen(false);
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: "0.95rem", pb: 1 }}>
          {setupStep === 1 && "Bước 1: Quét Mã QR Bằng Ứng Dụng"}
          {setupStep === 2 && "Bước 2: Xác Nhận Mã 6 Chữ Số"}
          {setupStep === 3 && "Bước 3: Lưu Trữ Mã Khôi Phục Dự Phòng"}
        </DialogTitle>
        <DialogContent dividers sx={{ p: isMobile ? 1.5 : 2 }}>
          <div className="precision-setting__modal-stepper">
            {setupStep === 1 && (
              <div className="step-box">
                <span style={{ fontSize: "0.8rem", color: "#475569" }}>
                  Mở ứng dụng <b>Google Authenticator</b> trên điện thoại, bấm dấu <b>+</b> và chọn <b>Quét mã QR</b>:
                </span>
                <div className="qr-area">
                  {otpauthUrl && <QRCodeSVG value={otpauthUrl} size={isMobile ? 180 : 170} level="M" />}
                </div>
                <div style={{ textAlign: "center", fontSize: "0.75rem", color: "#64748b" }}>
                  Hoặc sao chép khóa bí mật:
                </div>
                <div className="secret-text-row">
                  <span style={{ wordBreak: "break-all" }}>{secret}</span>
                  <Tooltip title="Sao chép khóa bí mật">
                    <IconButton size="small" onClick={() => copyToClipboard(secret, "Khóa bí mật")}>
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </div>

                {/* NÚT MỞ APP TRỰC TIẾP HOẶC TẢI VỀ APP */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<SmartphoneIcon />}
                    onClick={handleOpenOrInstallApp}
                    sx={{
                      backgroundColor: "#2563eb",
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "0.82rem",
                      minHeight: "38px",
                      borderRadius: "8px",
                      boxShadow: "0 1px 3px rgba(37, 99, 235, 0.2)",
                    }}
                  >
                    Mở Google Authenticator
                  </Button>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "0.73rem",
                      color: "#64748b",
                      flexWrap: "wrap",
                    }}
                  >
                    <span>Chưa có ứng dụng?</span>
                    <a
                      href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#2563eb", textDecoration: "underline", fontWeight: 600 }}
                    >
                      Google Play
                    </a>
                    <span>•</span>
                    <a
                      href="https://apps.apple.com/app/google-authenticator/id388497605"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#2563eb", textDecoration: "underline", fontWeight: 600 }}
                    >
                      App Store
                    </a>
                  </div>
                </div>
              </div>
            )}

            {setupStep === 2 && (
              <div className="step-box">
                <span style={{ fontSize: "0.8rem", color: "#475569" }}>
                  Nhập mã 6 chữ số đang hiển thị trên ứng dụng Google Authenticator:
                </span>
                <TextField
                  autoFocus
                  placeholder="000 000"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                    autoComplete: "one-time-code",
                    maxLength: 6,
                    style: { textAlign: "center", fontSize: "1.5rem", letterSpacing: "8px", fontWeight: "bold" },
                  }}
                  size="medium"
                  fullWidth
                />
              </div>
            )}

            {setupStep === 3 && (
              <div className="step-box">
                <span style={{ fontSize: "0.8rem", color: "#15803d", fontWeight: 600 }}>
                  🎉 Kích hoạt thành công! Hãy lưu lại 8 mã dự phòng dưới đây để dùng khi không có điện thoại:
                </span>
                <div className="backup-codes-grid">
                  {backupCodes.map((code, idx) => (
                    <div key={idx} className="backup-code-item">
                      {code}
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "8px" }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<ContentCopyIcon />}
                    onClick={() => copyToClipboard(backupCodes.join("\n"), "Danh sách mã dự phòng")}
                  >
                    Sao Chép
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={downloadBackupCodes}
                  >
                    Tải File
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions sx={{ p: 1.5 }}>
          {setupStep === 1 && (
            <>
              <Button onClick={() => setSetupModalOpen(false)} color="inherit" size="small">
                Hủy
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={() => setSetupStep(2)}
                sx={{ backgroundColor: "#2563eb", minHeight: "36px" }}
              >
                Tiếp Tục Nhập Mã
              </Button>
            </>
          )}

          {setupStep === 2 && (
            <>
              <Button onClick={() => setSetupStep(1)} color="inherit" size="small">
                Quay Lại QR
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={handleVerifyAndEnable}
                disabled={isLoading || otpCode.length !== 6}
                sx={{ backgroundColor: "#2563eb", minHeight: "36px" }}
              >
                Xác Nhận Kích Hoạt
              </Button>
            </>
          )}

          {setupStep === 3 && (
            <Button
              variant="contained"
              size="small"
              onClick={() => setSetupModalOpen(false)}
              color="success"
              sx={{ minHeight: "36px" }}
            >
              Tôi Đã Lưu Mã & Hoàn Tất
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* DIALOG TẮT MFA */}
      <Dialog open={disableModalOpen} onClose={() => setDisableModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontSize: "0.95rem" }}>
          Xác Nhận Tắt Bảo Mật 2 Bước
        </DialogTitle>
        <DialogContent dividers sx={{ p: isMobile ? 1.5 : 2 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", paddingTop: "4px" }}>
            <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
              Để bảo vệ tài khoản, vui lòng nhập mật khẩu đăng nhập hoặc mã OTP 6 số từ Google Authenticator:
            </span>
            <TextField
              label="Mật khẩu đăng nhập"
              type="password"
              size="small"
              value={verifyPassword}
              onChange={(e) => setVerifyPassword(e.target.value)}
              fullWidth
            />
            <div style={{ textAlign: "center", fontSize: "0.75rem", color: "#94a3b8" }}>- HOẶC -</div>
            <TextField
              label="Mã OTP 6 số"
              placeholder="000000"
              size="small"
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              value={verifyOtp}
              onChange={(e) => setVerifyOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              fullWidth
            />
          </div>
        </DialogContent>
        <DialogActions sx={{ p: 1.5 }}>
          <Button onClick={() => setDisableModalOpen(false)} color="inherit" size="small">
            Hủy Bỏ
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={handleDisableMfa}
            disabled={isLoading || (!verifyPassword && !verifyOtp)}
            sx={{ minHeight: "36px" }}
          >
            Xác Nhận Tắt
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

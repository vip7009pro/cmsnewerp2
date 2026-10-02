import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
  TextField,
} from "@mui/material";
import { emailService } from "../../api/services/emailService";
import type { MailAccountConfig, MailAccountFormValues } from "./mail.types";
import { formatMailFull } from "./mailUtils";

interface MailAccountDialogProps {
  open: boolean;
  onClose: () => void;
  /** Gọi sau khi lưu thành công (để refresh danh sách + badge). */
  onSaved: (accountId: number) => void;
}

const emptyForm = (): MailAccountFormValues => ({
  EMAIL_ADDRESS: "",
  DISPLAY_NAME: "",
  POP3_HOST: "",
  POP3_PORT: 995,
  POP3_SECURE: true,
  POP3_USERNAME: "",
  POP3_PASSWORD: "",
  SMTP_HOST: "",
  SMTP_PORT: 465,
  SMTP_SECURE: true,
  IS_ACTIVE: true,
});

function toForm(account: MailAccountConfig | null): MailAccountFormValues {
  if (!account) return emptyForm();
  return {
    EMAIL_ADDRESS: account.emailAddress || "",
    DISPLAY_NAME: account.displayName || "",
    POP3_HOST: account.pop3Host || "",
    POP3_PORT: account.pop3Port ?? 995,
    POP3_SECURE: account.pop3Secure !== false,
    POP3_USERNAME: account.pop3Username || "",
    POP3_PASSWORD: "",
    SMTP_HOST: account.smtpHost || "",
    SMTP_PORT: account.smtpPort ?? 465,
    SMTP_SECURE: account.smtpSecure !== false,
    IS_ACTIVE: account.isActive !== false,
  };
}

/** Dialog để mỗi nhân viên tự cấu hình mailbox cá nhân (POP3 + SMTP). */
export default function MailAccountDialog({ open, onClose, onSaved }: MailAccountDialogProps) {
  const [form, setForm] = useState<MailAccountFormValues>(emptyForm);
  const [account, setAccount] = useState<MailAccountConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [probing, setProbing] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  useEffect(() => {
    if (!open) return;
    setMessage(null);
    setLoading(true);
    emailService
      .myAccount()
      .then((res) => {
        setAccount(res.account);
        setForm(toForm(res.account));
      })
      .catch((e) => setMessage({ type: "error", text: e?.message || "Không tải được cấu hình" }))
      .finally(() => setLoading(false));
  }, [open]);

  const set = <K extends keyof MailAccountFormValues>(key: K, value: MailAccountFormValues[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  /**
   * Khi bật/tắt SSL, tự đổi cổng theo chuẩn nếu người dùng CHƯA nhập cổng riêng.
   * (Tránh trường hợp tắt SSL nhưng cổng vẫn 465/587 ⇒ 587 thường bị chặn.)
   */
  const applyPortDefault = (kind: "smtp" | "pop3", secure: boolean) => {
    setForm((prev) => {
      const key = kind === "smtp" ? ("SMTP_PORT" as const) : ("POP3_PORT" as const);
      const current = Number(prev[key]) || 0;
      const standards = kind === "smtp" ? [25, 465, 587] : [110, 995];
      if (current && !standards.includes(current)) return prev; // cổng riêng ⇒ giữ nguyên
      const next = kind === "smtp" ? (secure ? 465 : 25) : (secure ? 995 : 110);
      return { ...prev, [key]: next };
    });
  };

  const payload = () => ({
    EMAIL_ADDRESS: form.EMAIL_ADDRESS,
    DISPLAY_NAME: form.DISPLAY_NAME,
    POP3_HOST: form.POP3_HOST,
    POP3_PORT: Number(form.POP3_PORT) || undefined,
    POP3_SECURE: form.POP3_SECURE,
    POP3_USERNAME: form.POP3_USERNAME,
    POP3_PASSWORD: form.POP3_PASSWORD || undefined,
    SMTP_HOST: form.SMTP_HOST,
    SMTP_PORT: Number(form.SMTP_PORT) || undefined,
    SMTP_SECURE: form.SMTP_SECURE,
    IS_ACTIVE: form.IS_ACTIVE,
  });

  const handleTest = async () => {
    setTesting(true);
    setMessage(null);
    try {
      const res: any = await emailService.testMyAccount(payload());
      const pop3 = res?.pop3;
      const smtp = res?.smtp;
      const parts = [
        pop3 ? `${pop3.ok ? "✔" : "✘"} Nhận (POP3): ${pop3.message}` : null,
        smtp ? `${smtp.ok ? "✔" : "✘"} Gửi (SMTP): ${smtp.message}` : null,
      ].filter(Boolean);
      setMessage({
        type: pop3?.ok && (smtp ? smtp.ok : true) ? "success" : "error",
        text: parts.join("  |  ") || res?.message || "Đã kiểm tra",
      });
    } catch (e: any) {
      setMessage({ type: "error", text: e?.message || "Kết nối thất bại" });
    } finally {
      setTesting(false);
    }
  };

  /** Dò cổng SMTP (465 / 587 / 25) để tìm cấu hình gửi được. */
  const handleProbeSmtp = async () => {
    setProbing(true);
    setMessage(null);
    try {
      const res = await emailService.testSmtp(payload());
      const lines = res.results.map((r) => `${r.ok ? "✔" : "✘"} ${r.label || `cổng ${r.port}`}`);
      if (res.recommended) {
        set("SMTP_PORT", res.recommended.port);
        set("SMTP_SECURE", res.recommended.secure);
        setMessage({
          type: "success",
          text: `Tìm thấy cổng gửi được: ${res.recommended.port} (SSL ${res.recommended.secure ? "BẬT" : "TẮT"}). Đã tự điền vào form — bấm "Lưu cấu hình".\n${lines.join("  ")}`,
        });
      } else {
        setMessage({ type: "error", text: `Không cổng SMTP nào kết nối được.\n${lines.join("  ")}` });
      }
    } catch (e: any) {
      setMessage({ type: "error", text: e?.message || "Không dò được cổng SMTP" });
    } finally {
      setProbing(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await emailService.saveMyAccount(payload());
      setMessage({ type: "success", text: "Đã lưu cấu hình. Hệ thống sẽ đồng bộ email trong ít phút." });
      setAccount({ ...(account as MailAccountConfig), ...toForm(account), id: res.id } as MailAccountConfig);
      onSaved(res.id);
    } catch (e: any) {
      setMessage({ type: "error", text: e?.message || "Lưu thất bại" });
    } finally {
      setSaving(false);
    }
  };

  const handleSyncNow = async () => {
    if (!account?.id) return;
    setMessage({ type: "info", text: "Đang yêu cầu đồng bộ..." });
    try {
      await emailService.syncNow(account.id);
      setMessage({ type: "success", text: "Đã yêu cầu đồng bộ. Email mới sẽ xuất hiện sau ~30–60 giây." });
    } catch (e: any) {
      setMessage({ type: "error", text: e?.message || "Không yêu cầu được đồng bộ" });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontSize: 16, fontWeight: 800 }}>Cấu hình Email của tôi</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <div style={{ textAlign: "center", padding: 24 }}>
            <CircularProgress size={22} />
          </div>
        ) : (
          <>
            {message && (
              <Alert severity={message.type === "info" ? "info" : message.type} sx={{ mb: 1.5, fontSize: 12.5 }}>
                {message.text}
              </Alert>
            )}
            {account?.lastSyncAt && (
              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 10 }}>
                Đồng bộ gần nhất: {formatMailFull(account.lastSyncAt)} · {account.lastSyncStatus || "—"}
                {account.lastError ? ` · ${account.lastError}` : ""}
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <TextField
                label="Địa chỉ email"
                value={form.EMAIL_ADDRESS}
                onChange={(e) => set("EMAIL_ADDRESS", e.target.value)}
                size="small"
                fullWidth
                required
              />
              <TextField
                label="Tên hiển thị"
                value={form.DISPLAY_NAME}
                onChange={(e) => set("DISPLAY_NAME", e.target.value)}
                size="small"
                fullWidth
              />
              <TextField
                label="Máy chủ POP3"
                value={form.POP3_HOST}
                onChange={(e) => set("POP3_HOST", e.target.value)}
                size="small"
                fullWidth
                required
                placeholder="mail.cmsvina.com"
              />
              <TextField
                label="Cổng POP3"
                type="number"
                value={form.POP3_PORT}
                onChange={(e) => set("POP3_PORT", e.target.value)}
                size="small"
                fullWidth
              />
              <TextField
                label="Tài khoản POP3"
                value={form.POP3_USERNAME}
                onChange={(e) => set("POP3_USERNAME", e.target.value)}
                size="small"
                fullWidth
                placeholder="Mặc định = địa chỉ email"
              />
              <TextField
                label={account?.hasPassword ? "Mật khẩu (để trống = giữ nguyên)" : "Mật khẩu POP3"}
                type="password"
                value={form.POP3_PASSWORD}
                onChange={(e) => set("POP3_PASSWORD", e.target.value)}
                size="small"
                fullWidth
                required={!account?.hasPassword}
              />
              <TextField
                label="Máy chủ SMTP (gửi)"
                value={form.SMTP_HOST}
                onChange={(e) => set("SMTP_HOST", e.target.value)}
                size="small"
                fullWidth
                placeholder="Mặc định = máy chủ POP3"
              />
              <TextField
                label="Cổng SMTP"
                type="number"
                value={form.SMTP_PORT}
                onChange={(e) => set("SMTP_PORT", e.target.value)}
                size="small"
                fullWidth
              />
            </div>

            <div style={{ display: "flex", gap: 18, marginTop: 12, flexWrap: "wrap" }}>
              <FormControlLabel
                control={<Switch checked={form.POP3_SECURE} onChange={(e) => { set("POP3_SECURE", e.target.checked); applyPortDefault("pop3", e.target.checked); }} />}
                label="POP3 dùng SSL/TLS (POP3S)"
              />
              <FormControlLabel
                control={<Switch checked={form.SMTP_SECURE} onChange={(e) => { set("SMTP_SECURE", e.target.checked); applyPortDefault("smtp", e.target.checked); }} />}
                label="SMTP dùng SSL/TLS"
              />
              <FormControlLabel
                control={<Switch checked={form.IS_ACTIVE} onChange={(e) => set("IS_ACTIVE", e.target.checked)} />}
                label="Bật đồng bộ tự động"
              />
            </div>
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 1.5 }}>
        <Button onClick={handleTest} disabled={testing || probing || loading || !form.POP3_HOST} startIcon={testing ? <CircularProgress size={14} /> : null}>
          Kiểm tra kết nối
        </Button>
        <Button onClick={handleProbeSmtp} disabled={testing || probing || loading || !(form.SMTP_HOST || form.POP3_HOST)} startIcon={probing ? <CircularProgress size={14} /> : null}>
          Dò cổng SMTP
        </Button>
        <span style={{ flex: 1 }} />
        {account?.id && (
          <Button onClick={handleSyncNow} disabled={loading}>
            Đồng bộ ngay
          </Button>
        )}
        <Button onClick={onClose}>Đóng</Button>
        <Button variant="contained" onClick={handleSave} disabled={saving || loading}>
          {saving ? "Đang lưu..." : "Lưu cấu hình"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

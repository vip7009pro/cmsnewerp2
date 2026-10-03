import { useEffect, useRef, useState } from "react";
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
import type { MailAdminMailbox, MailRawAccountRow } from "./mail.types";

interface MailAccountAdminDialogProps {
  open: boolean;
  onClose: () => void;
  /** Gọi sau khi lưu thành công (để tải lại bảng quản trị). */
  onSaved: () => void;
  /** null/undefined = tạo mới; số > 0 = sửa mailbox theo ID. */
  accountId?: number | null;
  /** Dữ liệu có sẵn từ bảng overview để điền ngay (thiếu username). */
  initial?: MailAdminMailbox | null;
}

interface FormState {
  EMAIL_ADDRESS: string;
  DISPLAY_NAME: string;
  EMPL_NO: string;
  POP3_HOST: string;
  POP3_PORT: string;
  POP3_SECURE: boolean;
  POP3_USERNAME: string;
  POP3_PASSWORD: string;
  SMTP_HOST: string;
  SMTP_PORT: string;
  SMTP_SECURE: boolean;
  SMTP_USERNAME: string;
  SMTP_PASSWORD: string;
  IS_ACTIVE: boolean;
  IS_SHARED: boolean;
  SYNC_RANGE_ENABLED: boolean;
  SYNC_FROM_DATE: string;
  SYNC_TO_DATE: string;
}

const emptyForm = (): FormState => ({
  EMAIL_ADDRESS: "",
  DISPLAY_NAME: "",
  EMPL_NO: "",
  POP3_HOST: "",
  POP3_PORT: "110",
  POP3_SECURE: false,
  POP3_USERNAME: "",
  POP3_PASSWORD: "",
  SMTP_HOST: "",
  SMTP_PORT: "25",
  SMTP_SECURE: false,
  SMTP_USERNAME: "",
  SMTP_PASSWORD: "",
  IS_ACTIVE: true,
  IS_SHARED: false,
  SYNC_RANGE_ENABLED: false,
  SYNC_FROM_DATE: "",
  SYNC_TO_DATE: "",
});

/** Đổi mốc ngày server trả về (ISO) ⇒ "YYYY-MM-DD" cho <input type="date">. */
function toDateInput(value?: string | null): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Form THÊM / SỬA 1 mailbox (admin) — thay thế cho việc phải dùng Excel.
 * Tạo mới: `emailAccountCreate`; Sửa: `emailAccountUpdate` (email không đổi được).
 */
export default function MailAccountAdminDialog({
  open,
  onClose,
  onSaved,
  accountId,
  initial,
}: MailAccountAdminDialogProps) {
  const isEdit = typeof accountId === "number" && accountId > 0;
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  // `initial` có identity mới mỗi render ⇒ giữ qua ref để effect không chạy lại liên tục.
  const initialRef = useRef<MailAdminMailbox | null | undefined>(initial);
  initialRef.current = initial;

  useEffect(() => {
    if (!open) return;
    setMessage(null);

    if (!isEdit) {
      setForm(emptyForm());
      setLoading(false);
      return;
    }

    const base = initialRef.current
      ? {
          ...emptyForm(),
          EMAIL_ADDRESS: initialRef.current.emailAddress || "",
          DISPLAY_NAME: initialRef.current.displayName || "",
          EMPL_NO: initialRef.current.emplNo || "",
          POP3_HOST: initialRef.current.pop3Host || "",
          POP3_PORT: String(initialRef.current.pop3Port ?? 110),
          POP3_SECURE: initialRef.current.pop3Secure === true,
          SMTP_HOST: initialRef.current.smtpHost || "",
          SMTP_PORT: String(initialRef.current.smtpPort ?? 25),
          SMTP_SECURE: initialRef.current.smtpSecure === true,
          IS_ACTIVE: initialRef.current.isActive !== false,
          IS_SHARED: initialRef.current.isShared === true,
          SYNC_FROM_DATE: toDateInput(initialRef.current.syncFromDate),
          SYNC_TO_DATE: toDateInput(initialRef.current.syncToDate),
          SYNC_RANGE_ENABLED: Boolean(initialRef.current.syncFromDate || initialRef.current.syncToDate),
        }
      : emptyForm();
    setForm(base);

    // Nạp thêm username (overview không có) từ danh sách account.
    setLoading(true);
    emailService
      .accountList(true)
      .then((rows: MailRawAccountRow[]) => {
        const row = (rows || []).find((r) => Number(r.ID) === accountId);
        if (!row) return;
        setForm((prev) => ({
          ...prev,
          EMAIL_ADDRESS: row.EMAIL_ADDRESS || prev.EMAIL_ADDRESS,
          DISPLAY_NAME: row.DISPLAY_NAME || prev.DISPLAY_NAME,
          EMPL_NO: row.EMPL_NO || prev.EMPL_NO,
          POP3_HOST: row.POP3_HOST || prev.POP3_HOST,
          POP3_PORT: String(row.POP3_PORT ?? prev.POP3_PORT),
          POP3_SECURE: row.POP3_SECURE === true || row.POP3_SECURE === 1,
          POP3_USERNAME: row.POP3_USERNAME || "",
          SMTP_HOST: row.SMTP_HOST || prev.SMTP_HOST,
          SMTP_PORT: String(row.SMTP_PORT ?? prev.SMTP_PORT),
          SMTP_SECURE: row.SMTP_SECURE === true || row.SMTP_SECURE === 1,
          SMTP_USERNAME: row.SMTP_USERNAME || "",
          IS_ACTIVE: row.IS_ACTIVE === true || row.IS_ACTIVE === 1,
          IS_SHARED: row.IS_SHARED === true || row.IS_SHARED === 1,
        }));
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, [open, accountId, isEdit]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const buildPayload = () => ({
    EMAIL_ADDRESS: form.EMAIL_ADDRESS.trim(),
    DISPLAY_NAME: form.DISPLAY_NAME.trim() || null,
    EMPL_NO: form.EMPL_NO.trim() ? form.EMPL_NO.trim().toUpperCase() : null,
    POP3_HOST: form.POP3_HOST.trim(),
    POP3_PORT: Number(form.POP3_PORT) || undefined,
    POP3_SECURE: form.POP3_SECURE,
    POP3_USERNAME: form.POP3_USERNAME.trim() || undefined,
    ...(form.POP3_PASSWORD ? { POP3_PASSWORD: form.POP3_PASSWORD } : {}),
    SMTP_HOST: form.SMTP_HOST.trim() || undefined,
    SMTP_PORT: Number(form.SMTP_PORT) || undefined,
    SMTP_SECURE: form.SMTP_SECURE,
    SMTP_USERNAME: form.SMTP_USERNAME.trim() || undefined,
    ...(form.SMTP_PASSWORD ? { SMTP_PASSWORD: form.SMTP_PASSWORD } : {}),
    IS_ACTIVE: form.IS_ACTIVE,
    IS_SHARED: form.IS_SHARED,
    // Tắt giới hạn ⇒ gửi null để XOÁ khoảng đã lưu.
    SYNC_FROM_DATE: form.SYNC_RANGE_ENABLED ? form.SYNC_FROM_DATE || null : null,
    SYNC_TO_DATE: form.SYNC_RANGE_ENABLED ? form.SYNC_TO_DATE || null : null,
  });

  const handleSave = async () => {
    if (!EMAIL_RE.test(form.EMAIL_ADDRESS.trim())) {
      setMessage({ type: "error", text: "Địa chỉ email không hợp lệ" });
      return;
    }
    if (!form.POP3_HOST.trim()) {
      setMessage({ type: "error", text: "Thiếu máy chủ POP3" });
      return;
    }
    if (!isEdit && !form.POP3_PASSWORD) {
      setMessage({ type: "error", text: "Cần nhập mật khẩu POP3 khi tạo mới" });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const payload = buildPayload();
      if (isEdit) {
        await emailService.accountUpdate({ ID: accountId, ...payload });
      } else {
        await emailService.accountCreate(payload);
      }
      onSaved();
      onClose();
    } catch (e: any) {
      setMessage({ type: "error", text: e?.message || "Lưu mailbox thất bại" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontSize: 16, fontWeight: 800 }}>
        {isEdit ? "Sửa tài khoản email" : "Thêm tài khoản email"}
      </DialogTitle>
      <DialogContent dividers>
        {message && (
          <Alert severity={message.type} sx={{ mb: 1.5, fontSize: 12.5 }}>
            {message.text}
          </Alert>
        )}
        {loading && (
          <div style={{ textAlign: "center", padding: 8 }}>
            <CircularProgress size={18} />
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
            disabled={isEdit}
            helperText={isEdit ? "Không đổi được địa chỉ" : undefined}
          />
          <TextField
            label="Tên hiển thị"
            value={form.DISPLAY_NAME}
            onChange={(e) => set("DISPLAY_NAME", e.target.value)}
            size="small"
            fullWidth
          />
          <TextField
            label="Mã nhân sự (EMPL_NO)"
            value={form.EMPL_NO}
            onChange={(e) => set("EMPL_NO", e.target.value)}
            size="small"
            fullWidth
            placeholder="VD: NTT1408 (bỏ trống = dùng chung)"
          />
          <TextField
            label="Máy chủ POP3"
            value={form.POP3_HOST}
            onChange={(e) => set("POP3_HOST", e.target.value)}
            size="small"
            fullWidth
            required
            placeholder="mail.cmsbando.com"
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
            label={isEdit ? "Mật khẩu POP3 (trống = giữ nguyên)" : "Mật khẩu POP3"}
            type="password"
            value={form.POP3_PASSWORD}
            onChange={(e) => set("POP3_PASSWORD", e.target.value)}
            size="small"
            fullWidth
            required={!isEdit}
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
          <TextField
            label="Tài khoản SMTP"
            value={form.SMTP_USERNAME}
            onChange={(e) => set("SMTP_USERNAME", e.target.value)}
            size="small"
            fullWidth
            placeholder="Mặc định = tài khoản POP3"
          />
          <TextField
            label={isEdit ? "Mật khẩu SMTP (trống = giữ nguyên)" : "Mật khẩu SMTP"}
            type="password"
            value={form.SMTP_PASSWORD}
            onChange={(e) => set("SMTP_PASSWORD", e.target.value)}
            size="small"
            fullWidth
          />
        </div>

        <div style={{ display: "flex", gap: 18, marginTop: 12, flexWrap: "wrap" }}>
          <FormControlLabel
            control={<Switch checked={form.POP3_SECURE} onChange={(e) => set("POP3_SECURE", e.target.checked)} />}
            label="POP3 dùng SSL/TLS"
          />
          <FormControlLabel
            control={<Switch checked={form.SMTP_SECURE} onChange={(e) => set("SMTP_SECURE", e.target.checked)} />}
            label="SMTP dùng SSL/TLS"
          />
          <FormControlLabel
            control={<Switch checked={form.IS_ACTIVE} onChange={(e) => set("IS_ACTIVE", e.target.checked)} />}
            label="Bật đồng bộ"
          />
          <FormControlLabel
            control={<Switch checked={form.IS_SHARED} onChange={(e) => set("IS_SHARED", e.target.checked)} />}
            label="Dùng chung"
          />
        </div>

        {/* Khoảng thời gian đồng bộ (tuỳ chọn). */}
        <div style={{ marginTop: 14, borderTop: "1px solid #e2e8f0", paddingTop: 10 }}>
          <FormControlLabel
            control={
              <Switch
                checked={form.SYNC_RANGE_ENABLED}
                onChange={(e) => set("SYNC_RANGE_ENABLED", e.target.checked)}
              />
            }
            label="Chỉ đồng bộ email trong khoảng thời gian"
          />
          {form.SYNC_RANGE_ENABLED && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 8 }}>
              <TextField
                label="Từ ngày"
                type="date"
                value={form.SYNC_FROM_DATE}
                onChange={(e) => set("SYNC_FROM_DATE", e.target.value)}
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Đến ngày"
                type="date"
                value={form.SYNC_TO_DATE}
                onChange={(e) => set("SYNC_TO_DATE", e.target.value)}
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </div>
          )}
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>
            Để trống một đầu = không giới hạn. Bỏ chọn để đồng bộ lại tất cả (email đã tải không bị xoá).
          </div>
        </div>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 1.5 }}>
        <Button onClick={onClose}>Huỷ</Button>
        <Button variant="contained" onClick={() => void handleSave()} disabled={saving || loading}>
          {saving ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Thêm tài khoản"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

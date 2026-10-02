import { useCallback, useEffect, useMemo, useRef, useState, type ClipboardEvent as ReactClipboardEvent } from "react";
import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import { emailService } from "../../api/services/emailService";
import { sanitizeRichHtml, richToPlainText } from "../Chat/chatRichText";
import {
  inspectPastedHtml,
  preparePastedTableHtml,
  readFileAsDataUrl,
  renderHtmlToPngDataUrl,
} from "./mailClipboardTable";
import type { MailAttachment, MailDetailModel } from "./mail.types";
import { formatBytes } from "./mailUtils";

/** Lọc HTML soạn email: CHO PHÉP ảnh (data:/cid:/http) và BẢNG (dán từ Excel). */
const sanitizeMailHtml = (value?: string | null) =>
  sanitizeRichHtml(value, { allowImages: true, allowTables: true });

/** Escape cho giá trị thuộc tính HTML. */
const escapeAttr = (value: string) =>
  String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export type MailComposeMode = "new" | "reply" | "replyAll" | "forward";

interface MailComposerProps {
  open: boolean;
  mode: MailComposeMode;
  /** Email gốc (khi trả lời/chuyển tiếp). */
  source?: MailDetailModel | null;
  /** ID bản nháp đang mở (để autosave cập nhật đúng bản). */
  draftId?: number | null;
  onClose: () => void;
  onSent: () => void;
}

/** Thanh công cụ định dạng tối giản (execCommand) cho contentEditable. */
const TOOLS: { cmd: string; arg?: string; icon: string; title: string }[] = [
  { cmd: "bold", icon: "format_bold", title: "Đậm" },
  { cmd: "italic", icon: "format_italic", title: "Nghiêng" },
  { cmd: "underline", icon: "format_underlined", title: "Gạch chân" },
  { cmd: "insertUnorderedList", icon: "format_list_bulleted", title: "Danh sách" },
  { cmd: "insertOrderedList", icon: "format_list_numbered", title: "Danh sách số" },
  { cmd: "justifyLeft", icon: "format_align_left", title: "Căn trái" },
];

const AUTOSAVE_MS = 1500;

/** Hộp soạn email: To/Cc/Bcc, tiêu đề, nội dung rich text, đính kèm, lưu nháp tự động. */
export default function MailComposer({ open, mode, source, draftId, onClose, onSent }: MailComposerProps) {
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [showCc, setShowCc] = useState(false);
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [attachments, setAttachments] = useState<{ id: number; fileName: string; fileSize: number }[]>([]);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [savedDraftId, setSavedDraftId] = useState<number | null>(draftId ?? null);
  /** Bảng vừa dán từ Excel — chờ người dùng chọn dán dạng ảnh hay bảng HTML. */
  const [tablePaste, setTablePaste] = useState<{
    html: string;
    rows: number;
    cols: number;
    /** Ảnh bitmap kèm trong clipboard (nếu có) — dùng cho "dán dạng ảnh nguyên bản". */
    imageDataUrl: string | null;
    busyImage: boolean;
    error: string | null;
  } | null>(null);

  const editorRef = useRef<HTMLDivElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const dirtyRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  // Khởi tạo khi mở
  useEffect(() => {
    if (!open) return;
    setError(null);
    setInfo(null);
    setAttachments([]);
    setSavedDraftId(draftId ?? null);
    dirtyRef.current = false;

    if (mode === "new") {
      setTo(""); setCc(""); setBcc(""); setSubject(""); setHtml("");
    } else if (source) {
      const fwd = mode === "forward";
      setTo(fwd ? "" : source.from.address || "");
      setCc("");
      setBcc("");
      setSubject(`${fwd ? "Fwd" : "Re"}: ${source.subject || ""}`);
      setHtml(sanitizeMailHtml(editorRef.current ? editorRef.current.innerHTML : ""));
    }
    // focus
    window.setTimeout(() => {
      const el = editorRef.current;
      if (el) el.innerHTML = mode === "new" ? "" : htmlFromSource(mode, source);
      el?.focus();
    }, 120);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, mode, source?.id]);

  function htmlFromSource(m: MailComposeMode, src?: MailDetailModel | null): string {
    if (!src) return "";
    const quoted = `<p><br/></p><blockquote style="margin:0 0 0 12px;padding-left:12px;border-left:2px solid #cbd5e1;color:#475569">
      <div>---------- ${m === "forward" ? "Chuyển tiếp" : "Thư gốc"} ----------</div>
      <div>Từ: ${src.from.name || ""} &lt;${src.from.address || ""}&gt;</div>
      <div>Tiêu đề: ${src.subject || ""}</div>
    </blockquote>`;
    return quoted;
  }

  const plainText = useMemo(() => richToPlainText(html), [html]);

  /**
   * Ảnh dán trong nội dung được gửi dưới dạng **ảnh nhúng `cid:`** (backend tự chuyển).
   * Đếm để cảnh báo sớm nếu ảnh quá lớn ⇒ tránh gửi thất bại.
   */
  const inlineImages = useMemo(() => {
    const matches = String(html || "").match(/data:image\/[a-z0-9.+-]+;base64,[A-Za-z0-9+/=\s]+/gi) || [];
    const bytes = matches.reduce((sum, dataUrl) => {
      const comma = dataUrl.indexOf(",");
      const payload = comma >= 0 ? dataUrl.length - comma - 1 : dataUrl.length;
      return sum + Math.floor(payload * 0.75);
    }, 0);
    return { count: matches.length, bytes };
  }, [html]);
  const INLINE_IMAGE_LIMIT = 5 * 1024 * 1024;

  const doAutosave = useCallback(async () => {
    if (!dirtyRef.current) return;
    dirtyRef.current = false;
    if (!to && !subject && !plainText.trim()) return; // chưa có gì để lưu
    try {
      const res = await emailService.saveDraft({
        ID: savedDraftId || undefined,
        TO: to,
        CC: cc,
        BCC: bcc,
        SUBJECT: subject,
        BODY_HTML: html,
        BODY_TEXT: plainText,
        ATTACHMENT_IDS: attachments.map((a) => a.id),
        IN_REPLY_TO: source?.inReplyTo || null,
      });
      if (res?.id) setSavedDraftId(res.id);
      setInfo("Đã lưu nháp");
      window.setTimeout(() => setInfo(null), 2000);
    } catch (err: any) {
      console.warn("[mail] lưu nháp lỗi:", err?.message || err);
    }
  }, [to, cc, bcc, subject, html, plainText, attachments, savedDraftId, source?.inReplyTo]);

  // Autosave debounce: chỉ lưu khi người dùng thực sự gõ
  const markDirty = useCallback(() => {
    dirtyRef.current = true;
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => void doAutosave(), AUTOSAVE_MS);
  }, [doAutosave]);

  useEffect(() => () => { if (timerRef.current) window.clearTimeout(timerRef.current); }, []);

  const exec = (cmd: string, arg?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, arg);
    setHtml(sanitizeMailHtml(editorRef.current?.innerHTML || ""));
    markDirty();
  };

  /**
   * Dán nội dung vào thân thư.
   * - Bảng từ Excel ⇒ hỏi người dùng muốn dán dạng **ảnh nguyên bản** hay **bảng HTML**.
   * - Tệp ảnh trong clipboard (chụp màn hình/copy ảnh) ⇒ chèn thành ảnh trong nội dung.
   * - Còn lại: để trình duyệt dán mặc định (đã có sanitizer lọc).
   */
  const handlePaste = (e: ReactClipboardEvent<HTMLDivElement>) => {
    const clipboard = e.clipboardData;
    const files = Array.from(clipboard?.files || []).filter((f) => f.type.startsWith("image/"));
    const htmlData = clipboard?.getData("text/html") || "";
    const table = inspectPastedHtml(htmlData);

    if (table.hasTable) {
      e.preventDefault();
      setTablePaste({
        html: table.html,
        rows: table.rows,
        cols: table.cols,
        imageDataUrl: null,
        busyImage: false,
        error: null,
      });
      // Excel/copy vùng thường kèm bitmap ⇒ đọc sẵn để "dán dạng ảnh" giống bản gốc nhất.
      if (files[0]) {
        readFileAsDataUrl(files[0])
          .then((url) => setTablePaste((prev) => (prev ? { ...prev, imageDataUrl: url } : prev)))
          .catch(() => undefined);
      }
      return;
    }

    if (files.length === 0) return; // HTML/text: để trình duyệt dán mặc định
    e.preventDefault();
    files.forEach((file) => {
      void readFileAsDataUrl(file).then((dataUrl) => {
        if (!/^data:image\//i.test(dataUrl)) return;
        insertHtmlAtCursor(`<img src="${dataUrl}" alt="${escapeAttr(file.name || "")}">`);
      });
    });
  };

  /** Chèn HTML vào vị trí con trỏ trong khung soạn thảo. */
  const insertHtmlAtCursor = (insertHtml: string) => {
    const editor = editorRef.current;
    if (!editor || !insertHtml) return;
    editor.focus();
    document.execCommand("insertHTML", false, insertHtml);
    setHtml(sanitizeMailHtml(editor.innerHTML));
    markDirty();
  };

  /** Dán bảng dưới dạng bảng HTML (giữ định dạng đã inline từ Excel). */
  const pasteTableAsHtml = () => {
    if (!tablePaste) return;
    const prepared = preparePastedTableHtml(tablePaste.html);
    const safe = sanitizeMailHtml(prepared);
    if (!safe.trim()) {
      setTablePaste((prev) => (prev ? { ...prev, error: "Không đọc được nội dung bảng từ clipboard." } : prev));
      return;
    }
    setTablePaste(null);
    insertHtmlAtCursor(safe);
  };

  /** Dán bảng dưới dạng ẢNH (nguyên bản): ưu tiên ảnh có sẵn trong clipboard, không thì tự kết xuất. */
  const pasteTableAsImage = async () => {
    if (!tablePaste) return;
    if (tablePaste.imageDataUrl) {
      const url = tablePaste.imageDataUrl;
      setTablePaste(null);
      insertHtmlAtCursor(`<img src="${url}" alt="Bảng">`);
      return;
    }
    setTablePaste((prev) => (prev ? { ...prev, busyImage: true, error: null } : prev));
    const rendered = await renderHtmlToPngDataUrl(preparePastedTableHtml(tablePaste.html));
    if (!rendered) {
      setTablePaste((prev) =>
        prev
          ? {
              ...prev,
              busyImage: false,
              error: "Không tạo được ảnh từ bảng này. Hãy chọn “Dán dạng bảng” hoặc dùng Copy as Picture trong Excel.",
            }
          : prev
      );
      return;
    }
    setTablePaste(null);
    insertHtmlAtCursor(`<img src="${rendered.dataUrl}" width="${rendered.width}" alt="Bảng">`);
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const res = await emailService.uploadOutbox(file);
      setAttachments((prev) => [...prev, { id: res.id, fileName: res.fileName, fileSize: res.fileSize }]);
      if (res.dangerous) {
        setError(`Tệp "${res.fileName}" là tệp thực thi được — nhiều nơi sẽ chặn/tự chối. Chỉ gửi khi thực sự tin cậy.`);
      }
      markDirty();
    } catch (err: any) {
      setError(err?.message || "Tải tệp lên thất bại");
    } finally {
      setUploading(false);
    }
  };

  const handleSend = async () => {
    setBusy(true);
    setError(null);
    try {
      const payload = {
        TO: to,
        CC: cc,
        BCC: bcc,
        SUBJECT: subject,
        BODY_HTML: html,
        BODY_TEXT: plainText,
        ATTACHMENT_IDS: attachments.map((a) => a.id),
        DRAFT_ID: savedDraftId || undefined,
      };
      let result: { inlineImagesSkipped?: number; inlineImagesSkippedBytes?: number } | null = null;
      if (mode === "new") result = await emailService.send(payload);
      else if (mode === "reply") result = await emailService.reply({ ...payload, ID: source?.id });
      else if (mode === "replyAll") result = await emailService.replyAll({ ...payload, ID: source?.id });
      else result = await emailService.forward({ ...payload, ID: source?.id });

      if (timerRef.current) window.clearTimeout(timerRef.current);
      dirtyRef.current = false;
      if (savedDraftId) await emailService.deleteDraft(savedDraftId).catch(() => undefined);
      onSent();

      // Ảnh quá lớn không nhúng được ⇒ cảnh báo ngay (thư đã gửi) để người dùng gửi lại dạng tệp.
      if (result?.inlineImagesSkipped) {
        setError(
          `Thư đã gửi, nhưng ${result.inlineImagesSkipped} ảnh trong nội dung quá lớn nên KHÔNG được gửi kèm — người nhận có thể không thấy ảnh. Hãy gửi lại ảnh đó dưới dạng tệp đính kèm.`
        );
        return;
      }
      onClose();
    } catch (err: any) {
      setError(err?.message || "Gửi thất bại");
    } finally {
      setBusy(false);
    }
  };

  // Cho phép gửi thư chỉ có ảnh trong nội dung hoặc chỉ có tệp đính kèm (không cần chữ).
  const canSend = (plainText.trim().length > 0 || inlineImages.count > 0 || attachments.length > 0) && !busy;

  return (
    <>
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { height: "min(640px, 92vh)" } }}>
      <div className="erp-mail__composer">
        <div className="erp-mail__composerHead">
          <span className="erp-mail__composerTitle">
            {mode === "new" ? "Soạn email mới" : mode === "forward" ? "Chuyển tiếp" : mode === "replyAll" ? "Trả lời tất cả" : "Trả lời"}
          </span>
          <span style={{ flex: 1 }} />
          {info && <span className="erp-mail__composerInfo">{info}</span>}
          <IconButton size="small" onClick={onClose} aria-label="Đóng" title="Đóng">
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </div>

        <div className="erp-mail__composerFields">
          <TextField label="Đến (To)" size="small" fullWidth value={to} onChange={(e) => { setTo(e.target.value); markDirty(); }} placeholder="a@congty.com, b@congty.com" />
          {!showCc && (
            <button type="button" className="erp-mail__linkBtn" onClick={() => setShowCc(true)}>
              + Cc / Bcc
            </button>
          )}
          {showCc && (
            <>
              <TextField label="Cc" size="small" fullWidth value={cc} onChange={(e) => { setCc(e.target.value); markDirty(); }} />
              <TextField label="Bcc" size="small" fullWidth value={bcc} onChange={(e) => { setBcc(e.target.value); markDirty(); }} />
            </>
          )}
          <TextField label="Tiêu đề" size="small" fullWidth value={subject} onChange={(e) => { setSubject(e.target.value); markDirty(); }} />
        </div>

        <div className="erp-mail__composerToolbar">
          {TOOLS.map((t) => (
            <button key={t.cmd} type="button" className="erp-mail__toolBtn" title={t.title} onMouseDown={(e) => { e.preventDefault(); exec(t.cmd, t.arg); }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{t.icon}</span>
            </button>
          ))}
          <span style={{ flex: 1 }} />
          {uploading && <CircularProgress size={16} />}
          <Tooltip title="Đính kèm tệp">
            <button type="button" className="erp-mail__toolBtn" onClick={() => fileRef.current?.click()}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>attach_file</span>
            </button>
          </Tooltip>
          <input
            ref={fileRef}
            type="file"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void handleUpload(f);
              e.target.value = "";
            }}
          />
        </div>

        <div
          ref={editorRef}
          className="erp-mail__composerEditor"
          contentEditable
          suppressContentEditableWarning
          onInput={() => { setHtml(sanitizeMailHtml(editorRef.current?.innerHTML || "")); markDirty(); }}
          onPaste={handlePaste}
          onBlur={() => void doAutosave()}
        />

        {attachments.length > 0 && (
          <div className="erp-mail__composerAttach">
            {attachments.map((a) => (
              <Chip
                key={a.id}
                size="small"
                label={`${a.fileName} · ${formatBytes(a.fileSize)}`}
                onDelete={async () => {
                  setAttachments((prev) => prev.filter((x) => x.id !== a.id));
                  await emailService.deleteOutbox(a.id).catch(() => undefined);
                  markDirty();
                }}
              />
            ))}
          </div>
        )}

        {inlineImages.count > 0 && (
          <div
            className={`erp-mail__composerInlineHint${inlineImages.bytes > INLINE_IMAGE_LIMIT ? " is-warn" : ""}`}
          >
            <span className="material-symbols-outlined">image</span>
            {inlineImages.bytes > INLINE_IMAGE_LIMIT
              ? `${inlineImages.count} ảnh trong nội dung (~${formatBytes(inlineImages.bytes)}) quá lớn — nên gửi dưới dạng tệp đính kèm.`
              : `${inlineImages.count} ảnh trong nội dung (~${formatBytes(inlineImages.bytes)}) sẽ được gửi kèm và hiển thị ngay trong thư.`}
          </div>
        )}

        {error && <Alert severity="error" sx={{ m: 1, fontSize: 12.5 }}>{error}</Alert>}

        <div className="erp-mail__composerFoot">
          <Button variant="contained" onClick={handleSend} disabled={!canSend} startIcon={<SendRoundedIcon />}>
            {busy ? "Đang gửi..." : "Gửi"}
          </Button>
          <Button onClick={() => void doAutosave()} disabled={busy} startIcon={<AttachFileRoundedIcon sx={{ display: "none" }} />}>
            Lưu nháp
          </Button>
          <span style={{ flex: 1 }} />
          <span className="erp-mail__composerHint">Nháp tự lưu sau ~1,5 giây</span>
        </div>
      </div>
      </Dialog>

      {/* Chọn cách dán bảng vừa copy từ Excel: giữ dạng bảng (HTML) hay thành ảnh nguyên bản. */}
      <Dialog open={!!tablePaste} onClose={() => setTablePaste(null)} maxWidth="sm" fullWidth>
        <div className="erp-mail__pasteDialog">
          <div className="erp-mail__pasteHead">
            <span className="material-symbols-outlined">table_view</span>
            <span>Dán bảng từ Excel</span>
          </div>
          <div className="erp-mail__pasteBody">
            Phát hiện bảng <b>{tablePaste?.rows} dòng</b> × <b>{tablePaste?.cols} cột</b>. Chọn cách dán:
            <div className="erp-mail__pasteOptions">
              <button
                type="button"
                className="erp-mail__pasteOption"
                onClick={pasteTableAsHtml}
                disabled={tablePaste?.busyImage}
              >
                <span className="material-symbols-outlined">grid_on</span>
                <b>Dán dạng bảng</b>
                <small>Giữ bảng và định dạng, vẫn sửa được từng ô</small>
              </button>
              <button
                type="button"
                className="erp-mail__pasteOption"
                onClick={() => void pasteTableAsImage()}
                disabled={tablePaste?.busyImage}
              >
                {tablePaste?.busyImage ? (
                  <CircularProgress size={18} />
                ) : (
                  <span className="material-symbols-outlined">image</span>
                )}
                <b>Dán dạng ảnh</b>
                <small>
                  {tablePaste?.imageDataUrl ? "Ảnh nguyên bản từ clipboard" : "Tự kết xuất bảng thành ảnh"}
                </small>
              </button>
            </div>
            {tablePaste?.error && <Alert severity="warning" sx={{ mt: 1.5, fontSize: 12.5 }}>{tablePaste.error}</Alert>}
          </div>
          <div className="erp-mail__pasteFoot">
            <Button size="small" onClick={() => setTablePaste(null)} disabled={tablePaste?.busyImage}>
              Huỷ
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}

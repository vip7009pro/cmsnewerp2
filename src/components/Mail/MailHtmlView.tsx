/**
 * Hiển thị nội dung HTML của email một cách AN TOÀN.
 *
 * Email HTML là nội dung KHÔNG đáng tin ⇒ nhiều lớp bảo vệ:
 *  1. Render trong `<iframe sandbox>` KHÔNG có `allow-scripts` ⇒ mọi JS (kể cả inline) không chạy,
 *     không truy cập cookie/localStorage/parent/token.
 *  2. Loại bỏ `<script>`, `<iframe>`, `<object>`, `<embed>`, `<form>`, `<link>`, `<meta>`, `<base>`.
 *  3. Loại bỏ thuộc tính sự kiện `on*` và URL `javascript:`.
 *  4. CSP trong tài liệu con: `script-src 'none'; object-src 'none'; frame-src 'none'`.
 *  5. MẶC ĐỊNH chặn ảnh remote (tracking pixel) — chỉ hiện khi người dùng bấm "Hiện ảnh".
 *
 * `allow-popups` cho phép link mở tab mới; KHÔNG cấp `allow-same-origin`/`allow-scripts`.
 */
import { useEffect, useMemo, useState } from "react";
import DOMPurify from "dompurify";
import CircularProgress from "@mui/material/CircularProgress";
import { mailFileUrl } from "../../api/services/emailService";

interface MailHtmlViewProps {
  /** ID email (để tải body từ NAS khi body tách rời). */
  messageId: number;
  /** HTML inline (nếu body nhỏ lưu DB). */
  html?: string | null;
  /** Body nằm ở file NAS ⇒ tải qua /mailfile/body/:id. */
  external?: boolean;
  title?: string;
  /**
   * Ảnh nhúng theo Content-ID: `cid:xxx` ⇒ URL tải từ server.
   * Đây là ảnh CỦA CHÍNH EMAIL nên luôn được phép hiển thị (không tính là "ảnh internet").
   */
  inlineImages?: Record<string, string>;
}

/** Làm sạch HTML email — allowlist của DOMPurify + tinh chỉnh riêng cho email. */
function sanitizeEmailHtml(html: string, allowRemoteImages: boolean, inlineImages: Record<string, string>): { html: string; origins: string[] } {
  const clean = DOMPurify.sanitize(html || "", {
    // Giữ ảnh/bảng/style của email nhưng bỏ hoàn toàn script & thành phần nhúng.
    FORBID_TAGS: ["script", "iframe", "object", "embed", "form", "link", "meta", "base", "style"],
    FORBID_ATTR: ["srcset", "background"],
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ["target"],
  });

  const doc = new DOMParser().parseFromString(clean, "text/html");
  const origins = new Set<string>();

  // Gắn target=_blank + rel an toàn cho mọi liên kết.
  doc.querySelectorAll("a[href]").forEach((a) => {
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener noreferrer nofollow");
  });

  doc.querySelectorAll("img").forEach((img) => {
    const src = String(img.getAttribute("src") || "");

    // Ảnh nhúng theo Content-ID ⇒ trỏ về server (ảnh của chính email, luôn hiện).
    if (/^cid:/i.test(src)) {
      const cid = src.slice(4).replace(/^<|>$/g, "");
      const url = inlineImages[cid] || inlineImages[decodeURIComponent(cid)];
      if (url) {
        img.setAttribute("src", url);
        try { origins.add(new URL(url).origin); } catch { /* bỏ qua */ }
      } else {
        img.removeAttribute("src");
        img.setAttribute("alt", img.getAttribute("alt") || "(ảnh nhúng không tìm thấy)");
      }
      return;
    }

    // Chặn ảnh remote (tracking) trừ khi người dùng cho phép.
    if (!allowRemoteImages && (/^(https?:)?\/\//i.test(src))) {
      const holder = doc.createElement("span");
      holder.setAttribute(
        "style",
        "display:inline-block;padding:3px 8px;border:1px dashed #cbd5e1;border-radius:6px;color:#94a3b8;font-size:12px"
      );
      holder.textContent = "🖼 Ảnh bị chặn";
      img.replaceWith(holder);
    }
  });

  return { html: doc.body.innerHTML, origins: [...origins] };
}

export default function MailHtmlView({ messageId, html, external, title, inlineImages }: MailHtmlViewProps) {
  const [rawHtml, setRawHtml] = useState<string>(html || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showImages, setShowImages] = useState(false);
  const inlineMap = useMemo(() => inlineImages || {}, [inlineImages]);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setShowImages(false);

    if (!external) {
      setRawHtml(html || "");
      return;
    }

    // Body tách rời trên NAS: tải về rồi cũng đi qua sanitize (không nhúng trực tiếp URL).
    setLoading(true);
    fetch(mailFileUrl("body", messageId))
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((text) => {
        if (!cancelled) setRawHtml(text);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || "Không tải được nội dung email");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [messageId, external, html]);

  const srcDoc = useMemo(() => {
    const { html: body, origins } = sanitizeEmailHtml(rawHtml, showImages, inlineMap);
    // Ảnh nhúng của chính email luôn được phép (thêm origin server vào img-src).
    const extra = origins.length > 0 ? ` ${origins.join(" ")}` : "";
    const imgSrc = showImages ? `img-src https: http: data: cid:${extra}` : `img-src data: cid:${extra}`;
    return `<!doctype html><html><head><meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="script-src 'none'; object-src 'none'; frame-src 'none'; base-uri 'none'; form-action 'none'; ${imgSrc}; style-src 'unsafe-inline' 'unsafe-hashes'; font-src data:">
</head><body style="margin:0;padding:14px;font-family:system-ui,-apple-system,'Segoe UI',Arial,sans-serif;font-size:13px;color:#0f172a;word-break:break-word">${body}</body></html>`;
  }, [rawHtml, showImages, inlineMap]);

  if (loading) {
    return (
      <div className="erp-mail__empty">
        <CircularProgress size={22} />
      </div>
    );
  }
  if (error) {
    return <div className="erp-mail__empty erp-mail__attachmentError">Không tải được nội dung email: {error}</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {!showImages && (
        <button
          type="button"
          onClick={() => setShowImages(true)}
          style={{
            alignSelf: "flex-start",
            margin: "8px 14px 0",
            padding: "4px 10px",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            background: "#f8fafc",
            color: "#2563eb",
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          Hiện ảnh (đang chặn ảnh từ internet)
        </button>
      )}
      <iframe
        className="erp-mail__htmlFrame"
        sandbox="allow-popups allow-popups-to-escape-sandbox"
        srcDoc={srcDoc}
        title={title || "Nội dung email"}
      />
    </div>
  );
}

/**
 * Tiện ích cho tin nhắn RICHTEXT (MSG_TYPE = "RICH").
 *
 * Nội dung richtext được lưu dưới dạng HTML ĐÃ LỌC theo allowlist:
 *  - Lọc ở client trước khi gửi (`sanitizeRichHtml`) — chặn XSS từ nội dung dán vào.
 *  - Lọc lại lúc render (`sanitizeRichHtml`) — phòng trường hợp dữ liệu cũ/bị sửa tay trong DB.
 *  - Server cũng có lớp chặn riêng (xem `practice1/services/chat/richText.js`).
 */

/** Thẻ được phép giữ lại (đủ cho các nút định dạng của thanh công cụ). */
const ALLOWED_TAGS = new Set([
  "p",
  "div",
  "br",
  "span",
  "b",
  "strong",
  "i",
  "em",
  "u",
  "s",
  "strike",
  "del",
  "sub",
  "sup",
  "code",
  "pre",
  "mark",
  "font",
  "a",
  "ul",
  "ol",
  "li",
  "blockquote",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
]);

/** Thẻ bị xoá CẢ nội dung (không chỉ bỏ thẻ). */
const DANGEROUS_TAGS = new Set([
  "script",
  "style",
  "iframe",
  "object",
  "embed",
  "applet",
  "link",
  "meta",
  "form",
  "base",
  "svg",
  "math",
  "template",
  "noscript",
]);

/** Thuộc tính style được phép giữ. */
const ALLOWED_STYLE_PROPS = new Set([
  "color",
  "background-color",
  "font-size",
  "font-weight",
  "font-style",
  "text-decoration",
  "text-align",
]);

/** Thuộc tính được phép giữ ngoài `style`. */
const ALLOWED_ATTRS = new Set(["color", "size", "face"]);

/** Scheme cho phép của thẻ <a> (chặn javascript:, data:...). */
const SAFE_LINK_SCHEME = /^(https?:\/\/|mailto:)/i;

function filterStyle(value: string): string {
  return String(value || "")
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .filter((part) => {
      const index = part.indexOf(":");
      if (index <= 0) return false;
      const prop = part.slice(0, index).trim().toLowerCase();
      const val = part.slice(index + 1).trim().toLowerCase();
      if (!ALLOWED_STYLE_PROPS.has(prop)) return false;
      if (!val) return false;
      // Chặn mọi vector qua giá trị (url(), expression, javascript:, data:).
      if (val.includes("url(") || val.includes("expression") || val.includes("javascript:")) {
        return false;
      }
      if (val.includes("data:") && prop !== "color" && prop !== "background-color") return false;
      return true;
    })
    .join("; ");
}

function sanitizeNode(node: Node, doc: Document): Node[] {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.nodeValue || "";
    return text ? [doc.createTextNode(text)] : [];
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return [];

  const element = node as Element;
  const tag = element.tagName.toLowerCase();
  if (DANGEROUS_TAGS.has(tag)) return [];

  const children = Array.from(element.childNodes).flatMap((child) => sanitizeNode(child, doc));

  // Thẻ ngoài allowlist ⇒ bỏ thẻ nhưng GIỮ nội dung (ví dụ <a> → chữ).
  if (!ALLOWED_TAGS.has(tag)) return children;

  const clean = doc.createElement(tag);
  Array.from(element.attributes).forEach((attribute) => {
    const name = attribute.name.toLowerCase();
    if (name === "style") {
      const safe = filterStyle(attribute.value);
      if (safe) clean.setAttribute("style", safe);
      return;
    }
    // Thẻ link: chỉ giữ href cùng scheme an toàn, luôn mở tab mới.
    if (tag === "a") {
      if (name !== "href") return;
      const href = attribute.value.trim();
      if (!SAFE_LINK_SCHEME.test(href)) return;
      clean.setAttribute("href", href);
      clean.setAttribute("target", "_blank");
      clean.setAttribute("rel", "noopener noreferrer");
      return;
    }
    if (ALLOWED_ATTRS.has(name)) clean.setAttribute(name, attribute.value);
  });
  children.forEach((child) => clean.appendChild(child));
  return [clean];
}

/** Lọc HTML richtext theo allowlist. Trả về chuỗi HTML an toàn để lưu/hiển thị. */
export function sanitizeRichHtml(html?: string | null): string {
  const raw = String(html || "");
  if (!raw) return "";
  if (typeof window === "undefined" || typeof DOMParser === "undefined") return "";

  const source = new DOMParser().parseFromString(raw, "text/html");
  const target = document.implementation.createHTMLDocument("");
  const holder = target.createElement("div");

  Array.from(source.body.childNodes).forEach((node) => {
    sanitizeNode(node, target).forEach((child) => holder.appendChild(child));
  });

  // Bỏ các thẻ rỗng do execCommand sinh ra khi không có nội dung.
  return holder.innerHTML.replace(/<p>\s*<\/p>/gi, "").trim();
}

/** HTML richtext ⇒ văn bản thuần (preview, sao chép, trích dẫn). */
export function richToPlainText(html?: string | null): string {
  const raw = String(html || "");
  if (!raw) return "";
  if (typeof DOMParser === "undefined") {
    return raw.replace(/<[^>]*>/g, "").trim();
  }
  // Chèn xuống dòng cho các thẻ khối trước khi lấy textContent.
  const withBreaks = raw
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\s*\/\s*(p|div|li|h[1-6]|blockquote)\s*>/gi, "\n");
  const doc = new DOMParser().parseFromString(withBreaks, "text/html");
  return (doc.body.textContent || "")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Nội dung richtext coi như rỗng khi không còn ký tự nào (ngoài thẻ). */
export function isRichContentEmpty(html?: string | null): boolean {
  return richToPlainText(html).trim().length === 0;
}

/** Văn bản thuần ⇒ HTML richtext (escape + xuống dòng) — dùng khi bật chế độ richtext cho draft cũ. */
export function plainTextToRichHtml(text?: string | null): string {
  const raw = String(text || "");
  if (!raw) return "";
  const escaped = raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped
    .split("\n")
    .map((line) => `<div>${line || "<br>"}</div>`)
    .join("");
}

/**
 * Lọc HTML richtext rồi:
 *  - bọc mọi `@Tên` thành `<span class="erp-chat__mention" data-mention="MÃ_NV">` (bấm được qua delegation);
 *  - tự nhận diện URL trần trong từng đoạn chữ thành thẻ `<a>` mở tab mới.
 *
 * Chỉ xử lý trong TỪNG node văn bản và BỎ QUA đoạn đã nằm trong thẻ `<a>` (tránh lồng link).
 * Nếu tên bị định dạng cắt đôi (vd `<b>@Nguyễn</b> Văn A`) thì đoạn đó không được bọc — chấp nhận được.
 */
export function decorateMentionsInHtml(
  html: string | null | undefined,
  members: { name: string; emplNo: string }[]
): string {
  const safe = sanitizeRichHtml(html);
  if (!safe) return safe;
  if (typeof DOMParser === "undefined" || typeof NodeFilter === "undefined") return safe;

  const candidates = members
    .map((item) => ({ label: String(item.name || item.emplNo || "").trim(), emplNo: item.emplNo }))
    .filter((item) => item.label);

  const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const mentionPattern =
    candidates.length > 0
      ? `@(?:${[...new Set(candidates.flatMap((item) => [item.label, item.emplNo]))]
          .filter(Boolean)
          .sort((a, b) => b.length - a.length)
          .map(escapeRegex)
          .join("|")})`
      : null;
  const urlPattern = `\\b(?:https?:\\/\\/|www\\.)[^\\s<>"']+`;
  const combined = new RegExp([mentionPattern, urlPattern].filter(Boolean).join("|"), "gi");

  const doc = new DOMParser().parseFromString(safe, "text/html");
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    const value = node.nodeValue || "";
    if (!value) continue;
    if (!value.includes("@") && !combined.test(value)) continue;
    combined.lastIndex = 0;
    // Bỏ qua chữ đã nằm trong thẻ <a> (tránh lồng link / bọc lại).
    if ((node.parentElement as Element | null)?.closest?.("a")) continue;
    textNodes.push(node);
  }

  textNodes.forEach((node) => {
    const value = node.nodeValue || "";
    combined.lastIndex = 0;
    const fragment = doc.createDocumentFragment();
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = combined.exec(value)) !== null) {
      if (match.index > lastIndex) {
        fragment.appendChild(doc.createTextNode(value.slice(lastIndex, match.index)));
      }
      const token = match[0];

      if (token.startsWith("@")) {
        const keyword = token.slice(1);
        const found = candidates.find((item) => item.label === keyword || item.emplNo === keyword);
        if (!found) {
          fragment.appendChild(doc.createTextNode(token));
        } else {
          const span = doc.createElement("span");
          span.className = "erp-chat__mention";
          span.setAttribute("data-mention", found.emplNo);
          span.textContent = token;
          fragment.appendChild(span);
        }
      } else {
        // URL: bỏ dấu câu dính ở cuối ra ngoài thẻ link.
        const trailingMatch = token.match(/[.,;:!?)\]}'"]+$/);
        const url = trailingMatch ? token.slice(0, -trailingMatch[0].length) : token;
        const anchor = doc.createElement("a");
        anchor.className = "erp-chat__link";
        anchor.setAttribute("href", /^https?:\/\//i.test(url) ? url : `https://${url}`);
        anchor.setAttribute("target", "_blank");
        anchor.setAttribute("rel", "noopener noreferrer");
        anchor.textContent = url;
        fragment.appendChild(anchor);
        if (trailingMatch) fragment.appendChild(doc.createTextNode(trailingMatch[0]));
      }

      lastIndex = match.index + token.length;
    }

    if (lastIndex < value.length) {
      fragment.appendChild(doc.createTextNode(value.slice(lastIndex)));
    }
    node.parentNode?.replaceChild(fragment, node);
  });

  return doc.body.innerHTML;
}

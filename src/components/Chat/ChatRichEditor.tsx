import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Tooltip } from "@mui/material";
import FormatBoldRoundedIcon from "@mui/icons-material/FormatBoldRounded";
import FormatItalicRoundedIcon from "@mui/icons-material/FormatItalicRounded";
import FormatUnderlinedRoundedIcon from "@mui/icons-material/FormatUnderlinedRounded";
import StrikethroughSRoundedIcon from "@mui/icons-material/StrikethroughSRounded";
import FormatListBulletedRoundedIcon from "@mui/icons-material/FormatListBulletedRounded";
import FormatListNumberedRoundedIcon from "@mui/icons-material/FormatListNumberedRounded";
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import TitleRoundedIcon from "@mui/icons-material/TitleRounded";
import FormatSizeRoundedIcon from "@mui/icons-material/FormatSizeRounded";
import FormatColorTextRoundedIcon from "@mui/icons-material/FormatColorTextRounded";
import FormatColorFillRoundedIcon from "@mui/icons-material/FormatColorFillRounded";
import FormatAlignLeftRoundedIcon from "@mui/icons-material/FormatAlignLeftRounded";
import FormatAlignCenterRoundedIcon from "@mui/icons-material/FormatAlignCenterRounded";
import FormatAlignRightRoundedIcon from "@mui/icons-material/FormatAlignRightRounded";
import FormatClearRoundedIcon from "@mui/icons-material/FormatClearRounded";
import { sanitizeRichHtml } from "./chatRichText";

export interface ChatRichEditorHandle {
  focus: () => void;
  clear: () => void;
  /** Thay toàn bộ nội dung (dùng khi nạp draft). */
  setHtml: (html: string) => void;
  /** Chèn tag tên tại vị trí con trỏ. */
  insertMention: (label: string) => void;
}

interface Props {
  onChange: (html: string) => void;
  /** Enter (không kèm Shift) — gửi tin. */
  onSubmit: () => void;
  /** Báo "đang nhập" (đã chống spam ở component cha). */
  onTyping: () => void;
  /** Từ khoá đang gõ sau `@` (null = không tag). */
  onMentionQuery: (keyword: string | null) => void;
  /** true khi bảng gợi ý tag đang mở ⇒ phím mũi tên/Enter do bảng xử lý. */
  mentionOpen?: boolean;
  /** Trả về true nếu component cha đã xử lý phím (điều hướng bảng tag). */
  onMentionKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => boolean;
  placeholder?: string;
  disabled?: boolean;
}

const TEXT_COLORS = [
  "#0f172a",
  "#dc2626",
  "#ea580c",
  "#ca8a04",
  "#16a34a",
  "#0891b2",
  "#2563eb",
  "#7c3aed",
  "#db2777",
  "#64748b",
];

const HIGHLIGHT_COLORS = [
  "transparent",
  "#fef08a",
  "#bbf7d0",
  "#bfdbfe",
  "#fecaca",
  "#e9d5ff",
  "#fed7aa",
];

const FONT_SIZES: { label: string; px: number }[] = [
  { label: "Nhỏ", px: 12 },
  { label: "Thường", px: 14 },
  { label: "Lớn", px: 17 },
  { label: "Rất lớn", px: 22 },
];

interface ToolButtonProps {
  title: string;
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}

/**
 * Nút thanh công cụ.
 * `onMouseDown` preventDefault để KHÔNG cướp focus của vùng soạn thảo —
 * nếu mất focus, `execCommand` sẽ không biết áp dụng cho đoạn văn bản nào.
 */
function ToolButton({ title, onClick, active = false, children }: ToolButtonProps) {
  return (
    <Tooltip title={title}>
      <button
        type="button"
        className={`erp-chat__richBtn${active ? " is-active" : ""}`}
        aria-label={title}
        onMouseDown={(event) => event.preventDefault()}
        onClick={onClick}
      >
        {children}
      </button>
    </Tooltip>
  );
}

/** Lấy từ khoá `@...` ngay trước con trỏ (chỉ khi con trỏ nằm trong vùng soạn thảo). */
function caretMentionKeyword(root: HTMLElement | null): string | null {
  if (!root) return null;
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  const range = selection.getRangeAt(0);
  if (!range.collapsed || !root.contains(range.startContainer)) return null;
  const node = range.startContainer;
  if (node.nodeType !== Node.TEXT_NODE) return null;
  const before = (node.nodeValue || "").slice(0, range.startOffset);
  const match = before.match(/@([^\s@]*)$/);
  return match ? match[1] : null;
}

/**
 * Vùng soạn tin RICHTEXT: contentEditable + thanh công cụ định dạng.
 * Dùng `document.execCommand` (không thêm thư viện) — chạy tốt trên Chrome/Edge/Firefox,
 * đúng nhóm trình duyệt mà ERP hỗ trợ.
 */
const ChatRichEditor = forwardRef<ChatRichEditorHandle, Props>(function ChatRichEditor(
  {
    onChange,
    onSubmit,
    onTyping,
    onMentionQuery,
    mentionOpen = false,
    onMentionKeyDown,
    placeholder = "Nhập tin nhắn... (Enter để gửi, Shift+Enter xuống dòng, @ để tag tên)",
    disabled = false,
  },
  ref
) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  /** Panel đang mở trong thanh công cụ (màu chữ / màu nền / cỡ chữ). */
  const [panel, setPanel] = useState<"color" | "highlight" | "size" | null>(null);
  const [activeFormats, setActiveFormats] = useState<Record<string, boolean>>({});

  const emitChange = useCallback(() => {
    const html = sanitizeRichHtml(editorRef.current?.innerHTML || "");
    onChange(html);
  }, [onChange]);

  const syncMention = useCallback(() => {
    onMentionQuery(caretMentionKeyword(editorRef.current));
  }, [onMentionQuery]);

  const syncActiveFormats = useCallback(() => {
    if (!editorRef.current) return;
    const read = (command: string) => {
      try {
        return document.queryCommandState(command);
      } catch {
        return false;
      }
    };
    setActiveFormats({
      bold: read("bold"),
      italic: read("italic"),
      underline: read("underline"),
      strikeThrough: read("strikeThrough"),
      insertUnorderedList: read("insertUnorderedList"),
      insertOrderedList: read("insertOrderedList"),
    });
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      focus: () => editorRef.current?.focus(),
      clear: () => {
        if (editorRef.current) editorRef.current.innerHTML = "";
        onChange("");
        onMentionQuery(null);
      },
      setHtml: (html: string) => {
        const safe = sanitizeRichHtml(html);
        if (editorRef.current) editorRef.current.innerHTML = safe;
        onChange(safe);
      },
      insertMention: (label: string) => {
        const editor = editorRef.current;
        if (!editor) return;
        editor.focus();
        document.execCommand("insertText", false, `@${label} `);
        emitChange();
        onMentionQuery(null);
      },
    }),
    [emitChange, onChange, onMentionQuery]
  );

  // Đồng bộ trạng thái nút (đậm/nghiêng...) theo vị trí con trỏ.
  useEffect(() => {
    const handler = () => syncActiveFormats();
    document.addEventListener("selectionchange", handler);
    return () => document.removeEventListener("selectionchange", handler);
  }, [syncActiveFormats]);

  const runCommand = useCallback(
    (command: string, value?: string) => {
      editorRef.current?.focus();
      document.execCommand(command, false, value);
      emitChange();
      syncActiveFormats();
    },
    [emitChange, syncActiveFormats]
  );

  /** Đổi cỡ chữ: execCommand chỉ có 1..7 nên đổi <font size="7"> thành <span style="font-size">. */
  const applyFontSize = useCallback(
    (px: number) => {
      const editor = editorRef.current;
      if (!editor) return;
      editor.focus();
      document.execCommand("fontSize", false, "7");
      editor.querySelectorAll('font[size="7"]').forEach((node) => {
        const span = document.createElement("span");
        span.style.fontSize = `${px}px`;
        span.innerHTML = (node as HTMLElement).innerHTML;
        node.replaceWith(span);
      });
      emitChange();
      setPanel(null);
    },
    [emitChange]
  );

  const applyBlock = useCallback(
    (tag: string) => {
      runCommand("formatBlock", tag);
      setPanel(null);
    },
    [runCommand]
  );

  const handleInput = useCallback(() => {
    emitChange();
    syncMention();
    onTyping();
  }, [emitChange, onTyping, syncMention]);

  /**
   * Dán nội dung: lọc HTML theo allowlist rồi chèn — vừa giữ định dạng hợp lệ,
   * vừa không mang mã độc từ trang nguồn vào.
   * Nếu clipboard có TỆP thì nhường cho luồng dán tệp của `ChatConversationView`.
   */
  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    if ((event.clipboardData?.files?.length ?? 0) > 0) return;
    const html = event.clipboardData?.getData("text/html") || "";
    const text = event.clipboardData?.getData("text/plain") || "";
    event.preventDefault();
    const safe = html ? sanitizeRichHtml(html) : "";
    if (safe) document.execCommand("insertHTML", false, safe);
    else document.execCommand("insertText", false, text);
    emitChange();
    syncMention();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    // Bảng gợi ý tag đang mở ⇒ ưu tiên điều hướng/đóng bằng bàn phím.
    if (mentionOpen && onMentionKeyDown?.(event)) return;

    if (event.key === "Enter") {
      event.preventDefault();
      if (event.shiftKey) {
        document.execCommand("insertLineBreak");
        emitChange();
        return;
      }
      onSubmit();
      return;
    }
    if (event.key === "Escape") setPanel(null);
  };

  const toolbar = (
    <div className="erp-chat__richToolbar" role="toolbar" aria-label="Định dạng tin nhắn">
      <ToolButton
        title="Đậm (Ctrl+B)"
        active={activeFormats.bold}
        onClick={() => runCommand("bold")}
      >
        <FormatBoldRoundedIcon fontSize="inherit" />
      </ToolButton>
      <ToolButton
        title="Nghiêng (Ctrl+I)"
        active={activeFormats.italic}
        onClick={() => runCommand("italic")}
      >
        <FormatItalicRoundedIcon fontSize="inherit" />
      </ToolButton>
      <ToolButton
        title="Gạch chân (Ctrl+U)"
        active={activeFormats.underline}
        onClick={() => runCommand("underline")}
      >
        <FormatUnderlinedRoundedIcon fontSize="inherit" />
      </ToolButton>
      <ToolButton
        title="Gạch ngang"
        active={activeFormats.strikeThrough}
        onClick={() => runCommand("strikeThrough")}
      >
        <StrikethroughSRoundedIcon fontSize="inherit" />
      </ToolButton>

      <span className="erp-chat__richSep" />

      <ToolButton
        title="Tiêu đề"
        onClick={() => applyBlock("h3")}
      >
        <TitleRoundedIcon fontSize="inherit" />
      </ToolButton>
      <ToolButton
        title="Trích đoạn"
        onClick={() => applyBlock("blockquote")}
      >
        <FormatQuoteRoundedIcon fontSize="inherit" />
      </ToolButton>
      <ToolButton
        title="Danh sách"
        active={activeFormats.insertUnorderedList}
        onClick={() => runCommand("insertUnorderedList")}
      >
        <FormatListBulletedRoundedIcon fontSize="inherit" />
      </ToolButton>
      <ToolButton
        title="Danh sách số"
        active={activeFormats.insertOrderedList}
        onClick={() => runCommand("insertOrderedList")}
      >
        <FormatListNumberedRoundedIcon fontSize="inherit" />
      </ToolButton>

      <span className="erp-chat__richSep" />

      <ToolButton
        title="Cỡ chữ"
        active={panel === "size"}
        onClick={() => setPanel(panel === "size" ? null : "size")}
      >
        <FormatSizeRoundedIcon fontSize="inherit" />
      </ToolButton>
      <ToolButton
        title="Màu chữ"
        active={panel === "color"}
        onClick={() => setPanel(panel === "color" ? null : "color")}
      >
        <FormatColorTextRoundedIcon fontSize="inherit" />
      </ToolButton>
      <ToolButton
        title="Màu nền chữ"
        active={panel === "highlight"}
        onClick={() => setPanel(panel === "highlight" ? null : "highlight")}
      >
        <FormatColorFillRoundedIcon fontSize="inherit" />
      </ToolButton>

      <span className="erp-chat__richSep" />

      <ToolButton title="Căn trái" onClick={() => runCommand("justifyLeft")}>
        <FormatAlignLeftRoundedIcon fontSize="inherit" />
      </ToolButton>
      <ToolButton title="Căn giữa" onClick={() => runCommand("justifyCenter")}>
        <FormatAlignCenterRoundedIcon fontSize="inherit" />
      </ToolButton>
      <ToolButton title="Căn phải" onClick={() => runCommand("justifyRight")}>
        <FormatAlignRightRoundedIcon fontSize="inherit" />
      </ToolButton>

      <span className="erp-chat__richSep" />

      <ToolButton
        title="Xoá định dạng"
        onClick={() => {
          runCommand("removeFormat");
          setPanel(null);
        }}
      >
        <FormatClearRoundedIcon fontSize="inherit" />
      </ToolButton>

      {panel === "size" && (
        <div className="erp-chat__richPanel" role="menu">
          {FONT_SIZES.map((size) => (
            <button
              key={size.px}
              type="button"
              className="erp-chat__richPanelItem"
              style={{ fontSize: size.px }}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => applyFontSize(size.px)}
            >
              {size.label}
            </button>
          ))}
        </div>
      )}

      {panel === "color" && (
        <div className="erp-chat__richPanel erp-chat__richPanel--swatch" role="menu">
          {TEXT_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              className="erp-chat__richSwatch"
              style={{ background: color }}
              aria-label={`Màu ${color}`}
              title={`Màu ${color}`}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                runCommand("foreColor", color);
                setPanel(null);
              }}
            />
          ))}
        </div>
      )}

      {panel === "highlight" && (
        <div className="erp-chat__richPanel erp-chat__richPanel--swatch" role="menu">
          {HIGHLIGHT_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              className="erp-chat__richSwatch"
              style={{
                background:
                  color === "transparent"
                    ? "repeating-conic-gradient(#e2e8f0 0% 25%, #fff 0% 50%) 50% / 8px 8px"
                    : color,
              }}
              aria-label={color === "transparent" ? "Bỏ màu nền" : `Nền ${color}`}
              title={color === "transparent" ? "Bỏ màu nền" : `Nền ${color}`}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                runCommand("hiliteColor", color);
                setPanel(null);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="erp-chat__richWrap">
      {toolbar}
      <div
        ref={editorRef}
        className="erp-chat__richInput"
        contentEditable={!disabled}
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        aria-label="Nội dung tin nhắn (định dạng phong phú)"
        data-placeholder={placeholder}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onKeyUp={syncMention}
        onMouseUp={syncMention}
        onPaste={handlePaste}
        onBlur={() => setPanel(null)}
      />
    </div>
  );
});

export default ChatRichEditor;

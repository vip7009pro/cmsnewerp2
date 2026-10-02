import { useEffect, useRef, useState } from "react";
import { CircularProgress, MenuItem, Select, Tooltip } from "@mui/material";
import type { MailSearchSort } from "./mail.types";
import { describeMailFilters, parseMailQuery } from "./mailUtils";

interface MailSearchBarProps {
  value: string;
  /** Gọi sau khi người dùng ngừng gõ (debounce 320ms). */
  onChange: (text: string) => void;
  sort: MailSearchSort;
  onSortChange: (sort: MailSearchSort) => void;
  onClear: () => void;
  running: boolean;
  total?: number | null;
  tookMs?: number | null;
  hint?: string;
}

const SORTS: { value: MailSearchSort; label: string }[] = [
  { value: "newest", label: "Mới nhất" },
  { value: "oldest", label: "Cũ nhất" },
  { value: "sender", label: "Người gửi" },
  { value: "subject", label: "Tiêu đề" },
];

/** Nút lọc nhanh — thêm/bớt token tương ứng trong ô tìm kiếm. */
const QUICK_TOKENS: { token: string; label: string; title: string }[] = [
  { token: "is:unread", label: "Chưa đọc", title: "Chỉ email chưa đọc" },
  { token: "has:attachment", label: "Đính kèm", title: "Chỉ email có tệp đính kèm" },
  { token: "is:starred", label: "Có sao", title: "Chỉ email đã gắn sao" },
];

/**
 * Ô tìm kiếm email + sắp xếp + lọc nhanh (Phase 5).
 * Hỗ trợ cú pháp: `from:` `to:` `subject:` `body:` `filename:` `has:attachment`
 * `is:unread|read|starred` `after:YYYY-MM-DD` `before:YYYY-MM-DD` và `"cụm từ"`.
 */
export default function MailSearchBar({
  value,
  onChange,
  sort,
  onSortChange,
  onClear,
  running,
  total,
  tookMs,
  hint,
}: MailSearchBarProps) {
  const [text, setText] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | null>(null);

  // Đồng bộ khi giá trị bên ngoài đổi (ví dụ bấm "Xoá tìm kiếm").
  useEffect(() => {
    setText(value);
  }, [value]);

  const parsed = parseMailQuery(text);
  const chips = describeMailFilters(parsed.filters);

  const push = (next: string, immediate = false) => {
    setText(next);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    // Gõ liên tục: chờ 320ms mới gọi API (giống chat); bấm nút thì chạy ngay.
    timerRef.current = window.setTimeout(() => onChange(next), immediate ? 0 : 320);
  };

  const toggleQuick = (token: string) => {
    const has = new RegExp(`(^|\\s)${token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\s|$)`, "i").test(text);
    const next = has ? text.replace(new RegExp(`\\s*${token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i"), "").trim() : `${text} ${token}`.trim();
    push(next, true);
  };

  const removeChip = (key: string) => {
    const patterns: Record<string, RegExp> = {
      from: /\s*from:\S+/i,
      to: /\s*to:\S+/i,
      subject: /\s*subject:("[^"]*"|\S+)/i,
      body: /\s*body:("[^"]*"|\S+)/i,
      filename: /\s*filename:("[^"]*"|\S+)/i,
      hasAttachment: /\s*has:attachment/i,
      isUnread: /\s*is:unread/i,
      isRead: /\s*is:read/i,
      isStarred: /\s*is:starred/i,
      after: /\s*after:\S+/i,
      before: /\s*before:\S+/i,
    };
    const pattern = patterns[key];
    push(pattern ? text.replace(pattern, "").trim() : text, true);
  };

  return (
    <div className="erp-mail__search">
      <div className="erp-mail__searchRow">
        <span className="material-symbols-outlined erp-mail__searchIcon">search</span>
        <input
          ref={inputRef}
          className="erp-mail__searchInput"
          type="search"
          placeholder="Tìm email… (VD: from:ketoan subject:hoá đơn has:attachment)"
          value={text}
          onChange={(e) => push(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") push(text, true);
            if (e.key === "Escape") {
              push("", true);
              onClear();
            }
          }}
          autoComplete="off"
        />
        {running && <CircularProgress size={15} />}
        {!!text && (
          <button
            type="button"
            className="erp-mail__searchClear"
            title="Xoá tìm kiếm"
            onClick={() => {
              setText("");
              onClear();
            }}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        )}
        <Select
          size="small"
          value={sort}
          onChange={(e) => onSortChange(e.target.value as MailSearchSort)}
          className="erp-mail__searchSort"
          title="Sắp xếp kết quả"
        >
          {SORTS.map((s) => (
            <MenuItem key={s.value} value={s.value} sx={{ fontSize: 12.5 }}>
              {s.label}
            </MenuItem>
          ))}
        </Select>
      </div>

      <div className="erp-mail__searchFilters">
        {QUICK_TOKENS.map((quick) => {
          const active = text.toLowerCase().includes(quick.token);
          return (
            <button
              key={quick.token}
              type="button"
              className={`erp-mail__filterPill${active ? " is-active" : ""}`}
              title={quick.title}
              onClick={() => toggleQuick(quick.token)}
            >
              {quick.label}
            </button>
          );
        })}
        {chips.length > 0 && <span className="erp-mail__filterSep" />}
        {chips.map((chip) => (
          <button
            key={chip.key}
            type="button"
            className="erp-mail__filterPill is-chip"
            title="Bỏ bộ lọc này"
            onClick={() => removeChip(chip.key)}
          >
            {chip.label}
            <span className="material-symbols-outlined">close</span>
          </button>
        ))}
        {hint && <span className="erp-mail__searchHint">{hint}</span>}
      </div>

      {parsed.warnings.length > 0 && (
        <div className="erp-mail__searchWarn">
          <Tooltip title={parsed.warnings.join(" · ")}>
            <span>
              <span className="material-symbols-outlined">info</span> {parsed.warnings[0]}
            </span>
          </Tooltip>
        </div>
      )}

      {typeof total === "number" && (
        <div className="erp-mail__searchMeta">
          {total} kết quả{typeof tookMs === "number" ? ` · ${tookMs} ms` : ""}
        </div>
      )}
    </div>
  );
}

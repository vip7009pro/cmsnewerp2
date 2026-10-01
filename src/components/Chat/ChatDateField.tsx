import React, { useRef } from "react";
import moment from "moment";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

interface Props {
  label: string;
  /** Giá trị dạng YYYY-MM-DD theo giờ Việt Nam; chuỗi rỗng = không giới hạn. */
  value: string;
  minDate?: string;
  maxDate?: string;
  /**
   * Chế độ gọn: KHÔNG hiện nhãn phía trên; khi trống thì hiện chính nhãn làm placeholder
   * bên trong ô. Dùng để xếp nhiều bộ lọc trên CÙNG MỘT DÒNG.
   */
  compact?: boolean;
  onChange: (value: string) => void;
}

/**
 * Ô chọn ngày hiển thị theo định dạng Việt Nam (dd/MM/yyyy).
 *
 * Vì sao không dùng MUI X DatePicker: adapter của MUI lấy tên thứ/tháng từ locale toàn cục
 * của moment, mà Vite tách module `moment/locale/vi` sang một instance moment khác nên
 * `moment.locale("vi")` không có tác dụng (lịch vẫn hiển thị tiếng Anh).
 * Cách này tự vẽ phần hiển thị theo dd/MM/yyyy và mở lịch gốc của trình duyệt
 * ⇒ luôn đúng định dạng, không phụ thuộc adapter.
 *
 * Giá trị trao đổi luôn là `YYYY-MM-DD`, dựng bằng `moment.utc` nên không lệch ngày.
 */
export default function ChatDateField({
  label,
  value,
  minDate,
  maxDate,
  compact = false,
  onChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const display = value ? moment.utc(value).format("DD/MM/YYYY") : "";

  const openPicker = () => {
    const input = inputRef.current;
    if (!input) return;
    const withPicker = input as HTMLInputElement & { showPicker?: () => void };
    if (typeof withPicker.showPicker === "function") withPicker.showPicker();
    else input.focus();
  };

  return (
    <div className={`erp-chat__dateField${compact ? " is-compact" : ""}`}>
      {!compact && <span className="erp-chat__dateLabel">{label}</span>}
      <div
        className="erp-chat__dateBox"
        role="button"
        tabIndex={0}
        onClick={openPicker}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openPicker();
          }
        }}
        aria-label={`${label}${display ? `: ${display}` : ""}`}
      >
        <span className={`erp-chat__dateValue${display ? "" : " is-empty"}`}>
          {display || (compact ? label : "dd/mm/yyyy")}
        </span>

        {display && (
          <button
            type="button"
            className="erp-chat__dateClear"
            aria-label={`Xoá ${label}`}
            onClick={(event) => {
              event.stopPropagation();
              onChange("");
            }}
          >
            <CloseRoundedIcon sx={{ fontSize: 13 }} />
          </button>
        )}

        <CalendarMonthRoundedIcon sx={{ fontSize: 17 }} className="erp-chat__dateIcon" />

        {/* Input gốc chỉ dùng để mở lịch và nhận giá trị; phần hiển thị do ta tự vẽ. */}
        <input
          ref={inputRef}
          type="date"
          className="erp-chat__dateNative"
          value={value || ""}
          min={minDate || undefined}
          max={maxDate || undefined}
          onChange={(event) => onChange(event.target.value)}
          tabIndex={-1}
        />
      </div>
    </div>
  );
}

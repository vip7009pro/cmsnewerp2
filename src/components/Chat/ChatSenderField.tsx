import React, { useCallback, useMemo } from "react";
import { Autocomplete, Avatar, TextField } from "@mui/material";
import type { ChatMember } from "./chat.types";
import { chatAvatarUrl, initialsOf, normalizeName, normalizeText } from "./chatUtils";

/** 1 lựa chọn "người gửi" trong bộ lọc. `EMPL_NO` rỗng = không lọc (Tất cả). */
interface SenderOption {
  EMPL_NO: string;
  FULL_NAME: string;
  EMPL_IMAGE?: string | null;
  JOB_NAME?: string | null;
}

const ALL_OPTION: SenderOption = { EMPL_NO: "", FULL_NAME: "Tất cả" };

interface Props {
  /** Thành viên phòng (KHÔNG gồm chính người đang xem nếu nơi gọi đã lọc). */
  members: ChatMember[];
  /** EMPL_NO đang chọn; chuỗi rỗng = tất cả. */
  value: string;
  onChange: (emplNo: string) => void;
  /** Nhãn nhỏ phía trên (giúp thẳng hàng với ô ngày trong lưới bộ lọc). */
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Ô chọn NGƯỜI GỬI dạng AutoComplete: gõ để tìm (khớp cả TÊN không dấu lẫn MÃ nhân viên)
 * rồi chọn; Enter chọn option đầu tiên của danh sách sau lọc (nhờ `autoHighlight`).
 *
 * Khác với `TextField select` cũ: vừa SEARCH vừa CHỌN được, hiển thị avatar + tên + mã
 * nên danh sách thành viên đông vẫn dùng tốt.
 */
export default function ChatSenderField({
  members,
  value,
  onChange,
  label,
  placeholder = "Tìm hoặc chọn người gửi...",
  disabled,
  className,
}: Props) {
  const options = useMemo<SenderOption[]>(
    () => [
      ALL_OPTION,
      ...members.map((member) => ({
        EMPL_NO: member.EMPL_NO,
        FULL_NAME: member.FULL_NAME || member.EMPL_NO,
        EMPL_IMAGE: member.EMPL_IMAGE,
        JOB_NAME: member.JOB_NAME,
      })),
    ],
    [members]
  );

  const selected = useMemo(
    () => options.find((option) => option.EMPL_NO === (value || "")) || ALL_OPTION,
    [options, value]
  );

  const handleChange = useCallback(
    (_event: React.SyntheticEvent, next: SenderOption | null) => onChange(next?.EMPL_NO || ""),
    [onChange]
  );

  // Lọc theo TÊN (bỏ dấu) hoặc MÃ nhân viên; khi ô tìm kiếm trống thì giữ đủ danh sách.
  const filterOptions = useCallback(
    (list: SenderOption[], { inputValue }: { inputValue: string }) => {
      const key = normalizeName(inputValue);
      if (!key) return list;
      return list.filter((option) => {
        if (!option.EMPL_NO) return false; // đang gõ thì bỏ mục "Tất cả"
        return (
          normalizeName(option.FULL_NAME).includes(key) ||
          normalizeText(option.EMPL_NO).includes(key)
        );
      });
    },
    []
  );

  return (
    <div className={`erp-chat__senderWrap${className ? ` ${className}` : ""}`}>
      {label && <span className="erp-chat__dateLabel">{label}</span>}
      <Autocomplete
        className="erp-chat__senderField"
        size="small"
        options={options}
        value={selected}
        onChange={handleChange}
        filterOptions={filterOptions}
        getOptionLabel={(option) => option.FULL_NAME}
        isOptionEqualToValue={(option, current) =>
          (option?.EMPL_NO || "") === (current?.EMPL_NO || "")
        }
        autoHighlight
        openOnFocus
        handleHomeEndKeys
        disabled={disabled}
        noOptionsText="Không tìm thấy người phù hợp"
        slotProps={{ popper: { className: "erp-chat__senderPopper" } }}
        renderInput={(params) => (
          <TextField {...params} size="small" placeholder={placeholder} />
        )}
        renderOption={(props, option) => {
          // Tách `key` khỏi props để tránh cảnh báo spread key vào JSX (React 18.3+).
          const { key, ...optionProps } = props;
          if (!option.EMPL_NO) {
            return (
              <li key={key} {...optionProps}>
                <span className="erp-chat__senderAll">Tất cả mọi người</span>
              </li>
            );
          }
          return (
            <li key={key} {...optionProps}>
              <Avatar
                src={chatAvatarUrl(option.EMPL_NO, option.EMPL_IMAGE)}
                sx={{ width: 26, height: 26, fontSize: 11 }}
              >
                {initialsOf(option.FULL_NAME)}
              </Avatar>
              <span className="erp-chat__senderOpt">
                <strong>{option.FULL_NAME}</strong>
                <small>
                  {option.EMPL_NO}
                  {option.JOB_NAME ? ` · ${option.JOB_NAME}` : ""}
                </small>
              </span>
            </li>
          );
        }}
      />
    </div>
  );
}

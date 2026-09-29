import React, { useRef, useState } from "react";
import { CircularProgress, Tooltip } from "@mui/material";
import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import ChatRoomAvatar from "./chatAvatars";
import { CHAT_AVATAR_PRESETS } from "./chatAvatars";
import { uploadChatAvatar } from "../../api/services/chatService";

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

interface Props {
  /** Giá trị avatar hiện tại: `icon:<id>`, `/chatavatar/<file>` hoặc rỗng. */
  value: string;
  /** Tên phòng để hiển thị preview khi chưa chọn avatar. */
  name?: string;
  onChange: (value: string) => void;
  compact?: boolean;
}

/**
 * Bộ chọn avatar phòng: chọn icon mặc định hoặc tải ảnh riêng lên.
 * Giá trị trả về đúng định dạng backend chấp nhận: `icon:<id>` | `/chatavatar/<file>` | "".
 */
export default function ChatAvatarPicker({ value, name, onChange, compact = false }: Props) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePick = async (file: File | null) => {
    if (!file) return;
    if (!/^image\//.test(file.type)) {
      setError("Chỉ nhận tệp ảnh");
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setError("Ảnh vượt quá 5MB");
      return;
    }

    setError(null);
    setUploading(true);
    try {
      const result = await uploadChatAvatar(file);
      onChange(result.url);
    } catch (uploadError: any) {
      setError(uploadError?.message || "Upload ảnh thất bại");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`erp-chat__avatarPicker${compact ? " is-compact" : ""}`}>
      <div className="erp-chat__avatarPreview">
        <ChatRoomAvatar value={value} name={name} size={compact ? 46 : 58} />
        <div className="erp-chat__avatarPreviewActions">
          <button
            type="button"
            className="erp-chat__ghostBtn"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <CircularProgress size={12} /> Đang tải...
              </>
            ) : (
              <>
                <AddPhotoAlternateRoundedIcon sx={{ fontSize: 15 }} /> Tải ảnh lên
              </>
            )}
          </button>
          {value && (
            <button type="button" className="erp-chat__ghostBtn" onClick={() => onChange("")}>
              <BlockRoundedIcon sx={{ fontSize: 15 }} /> Bỏ avatar
            </button>
          )}
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        hidden
        accept="image/*"
        onChange={(event) => {
          void handlePick(event.target.files?.[0] || null);
          event.target.value = "";
        }}
      />

      <div className="erp-chat__avatarGrid" role="radiogroup" aria-label="Icon avatar phòng">
        {CHAT_AVATAR_PRESETS.map((preset) => {
          const selected = value === `icon:${preset.id}`;
          return (
            <Tooltip key={preset.id} title={preset.label}>
              <button
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={preset.label}
                className={`erp-chat__avatarSwatch${selected ? " is-active" : ""}`}
                style={{ background: preset.bg }}
                onClick={() => onChange(`icon:${preset.id}`)}
              >
                {preset.icon}
              </button>
            </Tooltip>
          );
        })}
      </div>

      {error && <div className="erp-chat__fileError">{error}</div>}
      <div className="erp-chat__avatarHint">
        Chọn icon có sẵn hoặc tải ảnh riêng (tối đa 5MB) để phân biệt các phòng.
      </div>
    </div>
  );
}

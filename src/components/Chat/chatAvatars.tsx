import React, { useEffect, useState } from "react";
import { getSever } from "../../api/Api";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import RocketLaunchRoundedIcon from "@mui/icons-material/RocketLaunchRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import FactoryRoundedIcon from "@mui/icons-material/FactoryRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import HandymanRoundedIcon from "@mui/icons-material/HandymanRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import BuildRoundedIcon from "@mui/icons-material/BuildRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";
import { initialsOf, stripDeptSuffix } from "./chatUtils";

/**
 * Icon avatar phòng mặc định.
 *
 * Lưu trong DB dạng `icon:<id>` (ví dụ `icon:rocket`) để phân biệt với ảnh upload
 * (`/chatavatar/<file>`). DANH SÁCH ID PHẢI KHỚP backend `AVATAR_ICONS` trong
 * `services/chat/chatRoomService.js`.
 */
export interface ChatAvatarPreset {
  id: string;
  label: string;
  bg: string;
  icon: React.ReactElement;
}

export const CHAT_AVATAR_PRESETS: ChatAvatarPreset[] = [
  { id: "users", label: "Nhóm", bg: "#2563eb", icon: <GroupsRoundedIcon fontSize="inherit" /> },
  { id: "rocket", label: "Dự án", bg: "#7c3aed", icon: <RocketLaunchRoundedIcon fontSize="inherit" /> },
  { id: "briefcase", label: "Công việc", bg: "#0f766e", icon: <WorkRoundedIcon fontSize="inherit" /> },
  { id: "factory", label: "Sản xuất", bg: "#b45309", icon: <FactoryRoundedIcon fontSize="inherit" /> },
  { id: "chart", label: "Báo cáo", bg: "#0369a1", icon: <InsightsRoundedIcon fontSize="inherit" /> },
  { id: "box", label: "Kho vận", bg: "#a16207", icon: <Inventory2RoundedIcon fontSize="inherit" /> },
  { id: "tools", label: "Kỹ thuật", bg: "#475569", icon: <HandymanRoundedIcon fontSize="inherit" /> },
  { id: "shield", label: "Chất lượng", bg: "#15803d", icon: <ShieldRoundedIcon fontSize="inherit" /> },
  { id: "star", label: "Quan trọng", bg: "#ca8a04", icon: <StarRoundedIcon fontSize="inherit" /> },
  { id: "heart", label: "Nội bộ", bg: "#be123c", icon: <FavoriteRoundedIcon fontSize="inherit" /> },
  { id: "flag", label: "Mục tiêu", bg: "#dc2626", icon: <FlagRoundedIcon fontSize="inherit" /> },
  { id: "bolt", label: "Khẩn cấp", bg: "#ea580c", icon: <BoltRoundedIcon fontSize="inherit" /> },
  { id: "wrench", label: "Bảo trì", bg: "#0e7490", icon: <BuildRoundedIcon fontSize="inherit" /> },
  { id: "cart", label: "Mua hàng", bg: "#4f46e5", icon: <ShoppingCartRoundedIcon fontSize="inherit" /> },
  { id: "clipboard", label: "Kế hoạch", bg: "#0891b2", icon: <AssignmentRoundedIcon fontSize="inherit" /> },
  { id: "megaphone", label: "Thông báo", bg: "#c2410c", icon: <CampaignRoundedIcon fontSize="inherit" /> },
];

const PRESET_BY_ID = new Map(CHAT_AVATAR_PRESETS.map((preset) => [preset.id, preset]));

export function findAvatarPreset(value?: string | null): ChatAvatarPreset | null {
  const raw = String(value || "");
  if (!raw.startsWith("icon:")) return null;
  return PRESET_BY_ID.get(raw.slice(5)) || null;
}

/** Avatar là ảnh upload của phòng (đường dẫn nội bộ của backend). */
export function isUploadedAvatar(value?: string | null): boolean {
  return /^\/chatavatar\//.test(String(value || ""));
}

/**
 * Avatar là ẢNH NHÂN SỰ theo quy ước `NS_<EMPL_NO>.jpg` của ERP.
 *
 * Với hội thoại 1-1, avatar phòng CHÍNH LÀ ảnh của đối phương (backend trả sẵn ở
 * `DISPLAY_AVATAR`). Ảnh này nằm cùng origin với web (thư mục `Picture_NS`), KHÔNG phải
 * của backend nên không được ghép `getSever()` vào trước.
 */
export function isEmployeePhoto(value?: string | null): boolean {
  return /^\/Picture_NS\/[^/]+$/i.test(String(value || ""));
}

/**
 * URL đầy đủ của ảnh avatar phòng.
 * Ảnh upload (`/chatavatar/<file>`) nằm ở backend → ghép `getSever()`.
 * Ảnh nhân sự (`/Picture_NS/NS_<EMPL_NO>.jpg`) nằm cùng origin web → giữ nguyên.
 */
export function chatAvatarSrc(value?: string | null): string | undefined {
  const raw = String(value || "");
  if (isEmployeePhoto(raw)) return raw;
  if (isUploadedAvatar(raw)) return `${getSever()}${raw}`;
  return undefined;
}

interface AvatarProps {
  /**
   * Giá trị avatar phòng:
   *  - `icon:<id>` — icon mặc định của nhóm
   *  - `/chatavatar/<file>` — ảnh upload của nhóm
   *  - `/Picture_NS/NS_<EMPL_NO>.jpg` — ẢNH NHÂN SỰ (hội thoại 1-1 = ảnh đối phương)
   */
  value?: string | null;
  /** Tên phòng — dùng làm ảnh chữ cái khi chưa có avatar. */
  name?: string | null;
  /** Cạnh của ô avatar (px). */
  size?: number;
  /** true khi là hội thoại 1-1 (hiển thị chữ cái đầu của tên). */
  isDirect?: boolean;
}

/**
 * Avatar phòng dùng chung cho danh sách hội thoại, tiêu đề và dialog:
 * ảnh (nhân sự 1-1 / upload của nhóm) → icon mặc định → chữ cái đầu / icon nhóm.
 */
export default function ChatRoomAvatar({ value, name, size = 44, isDirect = false }: AvatarProps) {
  const photoSrc = chatAvatarSrc(value);
  const preset = findAvatarPreset(value);
  // Ảnh nhân sự chưa tồn tại (hoặc hỏng) ⇒ rơi về chữ cái đầu, KHÔNG hiện icon ảnh vỡ.
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [photoSrc]);

  if (photoSrc && !imageFailed) {
    return (
      <img
        className="erp-chat__roomAvatarImg"
        src={photoSrc}
        alt={name || "avatar"}
        style={{ width: size, height: size }}
        onError={() => setImageFailed(true)}
      />
    );
  }

  if (preset) {
    return (
      <span
        className="erp-chat__roomAvatarIcon"
        style={{ width: size, height: size, background: preset.bg, fontSize: size * 0.55 }}
        aria-hidden="true"
      >
        {preset.icon}
      </span>
    );
  }

  return (
    <span
      className="erp-chat__roomAvatarIcon"
      style={{ width: size, height: size, background: "#2563eb", fontSize: size * 0.42 }}
    >
      {isDirect ? initialsOf(stripDeptSuffix(name)) : <GroupsRoundedIcon fontSize="inherit" />}
    </span>
  );
}

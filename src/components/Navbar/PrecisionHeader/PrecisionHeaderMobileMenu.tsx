import React from "react";
import {
  Avatar,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  AccountCircleRounded,
  LogoutRounded,
  NotificationsRounded,
  PaletteRounded,
  SettingsRounded,
} from "@mui/icons-material";
import type { UserData } from "../../../api/GlobalInterface";
import "./PrecisionHeaderMobileMenu.scss";

type LangOption = { value: string; label: string };

const LANG_OPTIONS: LangOption[] = [
  { value: "vi", label: "Tiếng Việt" },
  { value: "en", label: "English" },
  { value: "kr", label: "한국어" },
];

export interface PrecisionHeaderMobileMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  userData?: UserData;
  userDisplayName: string;
  userInitials: string;
  lang?: string;
  notiCount: number;
  tabModeSwap: boolean;
  onSelectLanguage: (value: string) => void;
  onOpenAccountInfo: () => void;
  onOpenSetting: () => void;
  onOpenTheme: () => void;
  onOpenNotifications: () => void;
  onToggleTabMode: () => void;
  onLogout: () => void;
}

/**
 * Menu hành động dạng overflow cho chế độ mobile.
 * Gom toàn bộ các nút bị khuất trên viewport nhỏ (ngôn ngữ, thông báo,
 * bảng màu, tài khoản, cài đặt, đa nhiệm, đăng xuất) vào một chỗ.
 */
export default function PrecisionHeaderMobileMenu({
  anchorEl,
  open,
  onClose,
  userData,
  userDisplayName,
  userInitials,
  lang,
  notiCount,
  tabModeSwap,
  onSelectLanguage,
  onOpenAccountInfo,
  onOpenSetting,
  onOpenTheme,
  onOpenNotifications,
  onToggleTabMode,
  onLogout,
}: PrecisionHeaderMobileMenuProps) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      PaperProps={{
        className: "precision-header-mobile",
        sx: {
          mt: 1,
          width: 292,
          maxWidth: "calc(100vw - 20px)",
          borderRadius: "10px",
          border: "1px solid #cbd5e1",
          boxShadow: "0 18px 32px -12px rgba(15, 23, 42, 0.24)",
        },
      }}
    >
      <div className="precision-header-mobile__profile">
        <Avatar
          src={
            userData?.EMPL_IMAGE === "Y"
              ? `/Picture_NS/NS_${userData?.EMPL_NO}.jpg`
              : undefined
          }
          sx={{ width: 38, height: 38, bgcolor: "#2563eb", fontWeight: 700, fontSize: 14 }}
        >
          {userInitials}
        </Avatar>
        <div className="precision-header-mobile__profileMeta">
          <span className="precision-header-mobile__name">{userDisplayName}</span>
          <span className="precision-header-mobile__role">
            {userData?.JOB_NAME || "Nhân viên"} • {userData?.CMS_ID || userData?.EMPL_NO}
          </span>
          <span className="precision-header-mobile__dept">
            {userData?.MAINDEPTNAME || "CMS VINA"}
          </span>
        </div>
      </div>

      <Divider sx={{ my: 0.5 }} />

      <div className="precision-header-mobile__sectionLabel">Ngôn ngữ hệ thống</div>
      <div className="precision-header-mobile__langRow">
        {LANG_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`precision-header-mobile__langChip${
              lang === opt.value ? " is-active" : ""
            }`}
            onClick={() => onSelectLanguage(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <Divider sx={{ my: 0.5 }} />

      <MenuItem onClick={onOpenNotifications}>
        <ListItemIcon>
          <NotificationsRounded fontSize="small" sx={{ color: "#2563eb" }} />
        </ListItemIcon>
        <ListItemText
          primary="Thông báo hệ thống"
          primaryTypographyProps={{ fontSize: 13 }}
        />
        {notiCount > 0 && (
          <span className="precision-header-mobile__countBadge">
            {notiCount > 99 ? "99+" : notiCount}
          </span>
        )}
      </MenuItem>

      <MenuItem onClick={onOpenTheme}>
        <ListItemIcon>
          <PaletteRounded fontSize="small" />
        </ListItemIcon>
        <ListItemText
          primary="Bảng màu giao diện"
          primaryTypographyProps={{ fontSize: 13 }}
        />
      </MenuItem>

      <MenuItem onClick={onOpenAccountInfo}>
        <ListItemIcon>
          <AccountCircleRounded fontSize="small" sx={{ color: "#2563eb" }} />
        </ListItemIcon>
        <ListItemText
          primary="Thông tin tài khoản"
          primaryTypographyProps={{ fontSize: 13 }}
        />
      </MenuItem>

      <MenuItem onClick={onToggleTabMode}>
        <ListItemIcon>
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
            {tabModeSwap ? "tab" : "select_window"}
          </span>
        </ListItemIcon>
        <ListItemText
          primary={tabModeSwap ? "Chuyển sang đơn nhiệm" : "Chuyển sang đa nhiệm"}
          primaryTypographyProps={{ fontSize: 13 }}
        />
      </MenuItem>

      <MenuItem onClick={onOpenSetting}>
        <ListItemIcon>
          <SettingsRounded fontSize="small" />
        </ListItemIcon>
        <ListItemText
          primary="Cài đặt hệ thống"
          primaryTypographyProps={{ fontSize: 13 }}
        />
      </MenuItem>

      <Divider sx={{ my: 0.5 }} />

      <MenuItem onClick={onLogout} sx={{ color: "#f43f5e" }}>
        <ListItemIcon>
          <LogoutRounded fontSize="small" sx={{ color: "#f43f5e" }} />
        </ListItemIcon>
        <ListItemText
          primary="Đăng xuất"
          primaryTypographyProps={{ fontSize: 13, fontWeight: 600 }}
        />
      </MenuItem>
    </Menu>
  );
}

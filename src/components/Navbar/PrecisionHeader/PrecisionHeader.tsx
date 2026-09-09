import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  Divider,
  FormControlLabel,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Popover,
  Switch,
} from "@mui/material";
import {
  AccountCircleRounded,
  CloseRounded,
  LanguageRounded,
  LogoutRounded,
  PaletteRounded,
  SettingsRounded,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import { RootState } from "../../../redux/store";
import {
  addTab,
  changeGLBLanguage,
  hideSidebar,
  resetTab,
  setTabModeSwap,
  settabIndex,
  switchTheme,
  toggleSidebar,
  updateNotiCount,
} from "../../../redux/slices/globalSlice";
import { current_ver } from "../../../pages/home/Home";
import { logout } from "../../../api/Api";
import { UserData } from "../../../api/GlobalInterface";
import NotificationPanel from "../../NotificationPanel/NotificationPanel";
import NavMenuNew from "../../NavMenu/NavMenuNew";
import { getNavMenu } from "../../NavMenu/getNavMenu";
import { canUseTabMode, getFirstNavMenuSearchResult, normalizeMenuPath } from "../../NavMenu/navMenuSearch";
import "./PrecisionHeader.scss";

type ThemeOption = {
  value: string;
  label: string;
};

const CMS_THEME_OPTIONS: ThemeOption[] = [
  { value: "linear-gradient(90deg, #7efbbc 0%, #ace95c 100%)", label: "Orange-Yellow" },
  { value: "linear-gradient(90deg, hsla(152, 100%, 50%, 1) 0%, hsla(186, 100%, 69%, 1) 100%)", label: "Green-Blue" },
  { value: "linear-gradient(90deg, #FF9A8B 0%, #FF6A88 55%, #FF99AC 100%)", label: "Pink-Orange" },
  { value: "linear-gradient(90deg, #FEE140 0%, #FA709A 100%)", label: "Yellow-Pink" },
  { value: "linear-gradient(90deg, #8EC5FC 0%, #E0C3FC 100%)", label: "Light Blue-Purple" },
  { value: "linear-gradient(90deg, #FBAB7E 0%, #F7CE68 100%)", label: "Orange-Yellow" },
  { value: "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(56,204,255,1) 0%, rgba(17,218,189,1) 100%)", label: "Green-Blue" },
  { value: "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 100%)", label: "White" },
  { value: "linear-gradient(0deg, rgba(77, 175, 252,1), rgba(159, 212, 254,1))", label: "Blue" },
  { value: "linear-gradient(90deg, #FF6B6B 0%, #4ECDC4 100%)", label: "Coral-Teal" },
  { value: "linear-gradient(90deg, #FFE45C 0%, #7CFC00 100%)", label: "Lemon-Lime" },
  { value: "linear-gradient(90deg, #FF69B4 0%, #FF1493 55%, #FFC0CB 100%)", label: "Hot Pink-Deep Pink-Light Pink" },
  { value: "linear-gradient(90deg, #FF00FF 0%, #FF4500 50%, #FFD700 100%)", label: "Magenta-OrangeRed-Gold" },
  { value: "linear-gradient(90deg, #00FFFF 0%, #1E90FF 100%)", label: "Cyan-DodgerBlue" },
  { value: "linear-gradient(90deg, #FF1493 0%, #4169E1 100%)", label: "DeepPink-RoyalBlue" },
  { value: "linear-gradient(90deg, #9400D3 0%, #00BFFF 100%)", label: "DarkViolet-DeepSkyBlue" },
  { value: "linear-gradient(90deg, #00FA9A 0%, #00FF00 100%)", label: "MediumSpringGreen-Lime" },
  { value: "linear-gradient(90deg, #FF00FF 0%, #FF69B4 100%)", label: "Magenta-HotPink" },
  { value: "linear-gradient(90deg, #1E90FF 0%, #00BFFF 100%)", label: "DodgerBlue-DeepSkyBlue" },
  { value: "linear-gradient(90deg, #FF6B6B 0%, #556270 100%)", label: "Coral-Slate" },
  { value: "linear-gradient(90deg, #3A1C71 0%, #D76D77 50%, #FFAF7B 100%)", label: "Purple-Pink-Peach" },
  { value: "linear-gradient(90deg, #4B79A1 0%, #283E51 100%)", label: "Sky Blue-Navy" },
  { value: "linear-gradient(90deg, #C6FFDD 0%, #FBD786 50%, #f7797d 100%)", label: "Mint-Yellow-Pink" },
  { value: "linear-gradient(90deg, #8A2387 0%, #E94057 50%, #F27121 100%)", label: "Purple-Red-Orange" },
  { value: "linear-gradient(90deg, #1A2980 0%, #26D0CE 100%)", label: "Deep Blue-Turquoise" },
  { value: "linear-gradient(90deg, #FF416C 0%, #FF4B2B 100%)", label: "Pink-Orange" },
  { value: "linear-gradient(90deg, #654EA3 0%, #EAAFC8 100%)", label: "Purple-Pink" },
  { value: "linear-gradient(90deg, #00B4DB 0%, #0083B0 100%)", label: "Light Blue-Dark Blue" },
  { value: "linear-gradient(90deg, #FDC830 0%, #F37335 100%)", label: "Yellow-Orange" },
  { value: "linear-gradient(90deg, #ED213A 0%, #93291E 100%)", label: "Bright Red-Dark Red" },
  { value: "linear-gradient(90deg, #1D976C 0%, #93F9B9 100%)", label: "Dark Green-Light Green" },
  { value: "linear-gradient(90deg, #834D9B 0%, #D04ED6 100%)", label: "Purple-Magenta" },
  { value: "linear-gradient(90deg, #ADD100 0%, #7B920A 100%)", label: "Lime-Olive" },
  { value: "linear-gradient(90deg, #1A2A6C 0%, #B21F1F 50%, #FDBB2D 100%)", label: "Navy-Red-Yellow" },
  { value: "linear-gradient(90deg, #f8dd55 0%, #caf52d 100%)", label: "Yellow-Orange" },
];

const PVN_THEME_OPTIONS: ThemeOption[] = [
  { value: "linear-gradient(90deg, #f1da67 0%, #d1ce17 100%)", label: "Yellow-Orange" },
];

const NHATHAN_THEME_OPTIONS: ThemeOption[] = [
  { value: "linear-gradient(90deg, hsla(0, 0%, 74%, 1) 0%, hsla(60, 23%, 95%, 1) 100%)", label: "Gray-White" },
];

const DEFAULT_THEME_OPTIONS: ThemeOption[] = [
  { value: "linear-gradient(90deg, #f8dd55 0%, #caf52d 100%)", label: "Yellow-Orange" },
];

const COMPANY_THEME_OPTIONS: Record<string, ThemeOption[]> = {
  CMS: CMS_THEME_OPTIONS,
  PVN: PVN_THEME_OPTIONS,
  NHATHAN: NHATHAN_THEME_OPTIONS,
  default: DEFAULT_THEME_OPTIONS,
};

const hasManagementRole = (userData?: UserData) => {
  return (
    userData?.JOB_NAME === "ADMIN" ||
    userData?.JOB_NAME === "Leader" ||
    userData?.JOB_NAME === "Sub Leader" ||
    userData?.JOB_NAME === "Dept Staff"
  );
};

interface PrecisionHeaderProps {
  searchText?: string;
  onSearchTextChange?: (value: string) => void;
  onSearchFocus?: () => void;
  onSearchBlur?: () => void;
  onSearchEnter?: () => void;
  onSidebarToggle?: (nextOpen: boolean) => void;
  sidebarOpen?: boolean;
  onMenuSearchFocus?: () => void;
  menuAutoFocusSearch?: boolean;
  menuAlignedToSearch?: boolean;
}

export default function PrecisionHeader({
  searchText: propSearchText,
  onSearchTextChange: propOnSearchTextChange,
  onSearchFocus: propOnSearchFocus,
  onSearchBlur: propOnSearchBlur,
  onSearchEnter: propOnSearchEnter,
  onSidebarToggle: propOnSidebarToggle,
  sidebarOpen: propSidebarOpen,
  onMenuSearchFocus: propOnMenuSearchFocus,
  menuAutoFocusSearch: propMenuAutoFocusSearch,
  menuAlignedToSearch: propMenuAlignedToSearch,
}: PrecisionHeaderProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const headerRef = useRef<HTMLElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const searchAnchorRef = useRef<HTMLDivElement | null>(null);

  const [localSearchText, setLocalSearchText] = useState("");
  const searchText = propSearchText !== undefined ? propSearchText : localSearchText;
  const handleSearchTextChange = propOnSearchTextChange || setLocalSearchText;

  const [languageAnchorEl, setLanguageAnchorEl] = useState<HTMLElement | null>(null);
  const [themeAnchorEl, setThemeAnchorEl] = useState<HTMLElement | null>(null);
  const [avatarAnchorEl, setAvatarAnchorEl] = useState<HTMLElement | null>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<HTMLElement | null>(null);
  const [themeChoice, setThemeChoice] = useState("");

  const [internalMenuOpenSource, setInternalMenuOpenSource] = useState<"navbar" | "menu" | null>(null);
  const [searchMenuBounds, setSearchMenuBounds] = useState({ left: 0, width: 0 });

  const company: string = useSelector((state: RootState) => state.totalSlice.company);
  const lang: string | undefined = useSelector((state: RootState) => state.totalSlice.lang);
  const tabModeSwap: boolean = useSelector((state: RootState) => state.totalSlice.tabModeSwap);
  const sidebarStatus: boolean | undefined = useSelector((state: RootState) => state.totalSlice.sidebarmenu);
  const selectedServer: string = useSelector((state: RootState) => state.totalSlice.selectedServer);
  const userData: UserData | undefined = useSelector((state: RootState) => state.totalSlice.userData);
  const tabs: any[] = useSelector((state: RootState) => state.totalSlice.tabs);
  const notiCount: number = useSelector((state: RootState) => state.totalSlice.notificationCount ?? 0);

  const themeOptions = COMPANY_THEME_OPTIONS[company] ?? COMPANY_THEME_OPTIONS.default;
  const isMenuOpen = propSidebarOpen !== undefined ? propSidebarOpen : Boolean(sidebarStatus);

  const effectiveAlignedToSearch =
    propMenuAlignedToSearch !== undefined
      ? propMenuAlignedToSearch
      : internalMenuOpenSource === "navbar";

  const effectiveAutoFocusSearch =
    propMenuAutoFocusSearch !== undefined
      ? propMenuAutoFocusSearch
      : effectiveAlignedToSearch
      ? false
      : true;

  const navMenus = useMemo(() => getNavMenu(company, lang), [company, lang]);

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const initialTheme =
      savedTheme && themeOptions.some((o) => o.value === savedTheme)
        ? savedTheme
        : themeOptions[0]?.value ?? "";
    if (initialTheme) {
      setThemeChoice(initialTheme);
      dispatch(switchTheme(initialTheme));
    }
  }, [dispatch, themeOptions]);

  // Sync internal source when menu closes
  useEffect(() => {
    if (!isMenuOpen) {
      setInternalMenuOpenSource(null);
    }
  }, [isMenuOpen]);

  // Calculate search menu bounds aligned under search box
  const updateSearchMenuBounds = useCallback(() => {
    const searchAnchor = searchAnchorRef.current;
    const headerElement = headerRef.current;
    if (!searchAnchor || !headerElement) return;

    const searchRect = searchAnchor.getBoundingClientRect();
    const headerRect = headerElement.getBoundingClientRect();
    setSearchMenuBounds({
      left: Math.max(8, searchRect.left - headerRect.left),
      width: Math.max(380, searchRect.width),
    });
  }, []);

  useLayoutEffect(() => {
    if (!effectiveAlignedToSearch) {
      setSearchMenuBounds({ left: 0, width: 0 });
      return;
    }

    updateSearchMenuBounds();

    const handleResize = () => updateSearchMenuBounds();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [effectiveAlignedToSearch, updateSearchMenuBounds, isMenuOpen, searchText]);

  // Toggle navigation panel
  const handleToggleMenu = useCallback(() => {
    const nextState = !isMenuOpen;
    setInternalMenuOpenSource(nextState ? "menu" : null);
    propOnSidebarToggle?.(nextState);
    dispatch(toggleSidebar("2"));
  }, [dispatch, isMenuOpen, propOnSidebarToggle]);

  // Open first search result when Enter is pressed
  const openFirstSearchResult = useCallback(() => {
    if (propOnSearchEnter) {
      propOnSearchEnter();
      return;
    }

    const searchResult = getFirstNavMenuSearchResult(navMenus, searchText);
    if (!searchResult) return;

    if (searchResult.subMenu) {
      if (tabModeSwap) {
        if (!canUseTabMode(userData, searchResult.subMenu.MENU_CODE)) {
          Swal.fire("Cảnh báo", "Không đủ quyền hạn", "error");
          return;
        }

        const existedTabIndex = tabs.findIndex((ele) => ele.ELE_CODE === searchResult.subMenu?.MENU_CODE);
        if (existedTabIndex !== -1) {
          dispatch(settabIndex(existedTabIndex));
        } else {
          dispatch(
            addTab({
              ELE_NAME: searchResult.subMenu.title,
              ELE_CODE: searchResult.subMenu.MENU_CODE,
              REACT_ELE: "",
              PAGE_ID: -1,
            })
          );
          dispatch(settabIndex(tabs.length));
        }
        dispatch(hideSidebar("2"));
        return;
      }

      navigate(normalizeMenuPath(searchResult.subMenu.path));
      dispatch(hideSidebar("2"));
      return;
    }

    navigate(normalizeMenuPath(searchResult.menu.path));
    dispatch(hideSidebar("2"));
  }, [dispatch, navMenus, navigate, propOnSearchEnter, searchText, tabModeSwap, tabs, userData]);

  // Keyboard shortcut Ctrl + K or Ctrl + Space
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlK = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k";
      const isCtrlSpace = e.ctrlKey && (e.code === "Space" || e.key === " ");

      if (isCtrlK) {
        e.preventDefault();
        searchInputRef.current?.focus();
        if (!isMenuOpen) {
          dispatch(toggleSidebar("2"));
        }
      } else if (isCtrlSpace) {
        e.preventDefault();
        handleToggleMenu();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch, handleToggleMenu, isMenuOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    if (!isMenuOpen || company === "PVN") return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (headerRef.current?.contains(target)) return;

      // Không đóng menu nếu click vào bên trong navigationDrawer
      const drawer = document.getElementById("navigationDrawer");
      if (drawer?.contains(target)) return;

      setInternalMenuOpenSource(null);
      dispatch(hideSidebar("2"));
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [company, dispatch, isMenuOpen]);

  const handleLanguageSelect = (selectedLang: string) => {
    dispatch(changeGLBLanguage(selectedLang));
    localStorage.setItem("lang", selectedLang);
    setLanguageAnchorEl(null);
  };

  const handleThemeSelect = (themeVal: string) => {
    setThemeChoice(themeVal);
    dispatch(switchTheme(themeVal));
    localStorage.setItem("theme", themeVal);
    setThemeAnchorEl(null);
  };

  const handleNotificationClick = (event: MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
    dispatch(updateNotiCount(0));
    localStorage.setItem("notification_count", "0");
  };

  const handleLogout = () => {
    setAvatarAnchorEl(null);
    dispatch(resetTab(0));
    logout();
  };

  const handleTabModeChange = () => {
    if (!tabModeSwap) {
      dispatch(resetTab(0));
      dispatch(
        addTab({
          ELE_CODE: "NS0",
          ELE_NAME: "ACCOUNT_INFO",
          REACT_ELE: "",
          PAGE_ID: -1,
        })
      );
    }
    dispatch(setTabModeSwap(!tabModeSwap));
  };

  const handleOpenAccountInfo = () => {
    setAvatarAnchorEl(null);
    if (tabModeSwap) {
      const existedIndex = tabs.findIndex((t) => t.ELE_CODE === "NS0");
      if (existedIndex !== -1) {
        dispatch(settabIndex(existedIndex));
        return;
      }
      dispatch(
        addTab({
          ELE_CODE: "NS0",
          ELE_NAME: "ACCOUNT_INFO",
          REACT_ELE: "",
          PAGE_ID: -1,
        })
      );
      dispatch(settabIndex(tabs.length));
      return;
    }
    navigate("/accountinfo");
  };

  const handleOpenSetting = (e: MouseEvent) => {
    e.preventDefault();
    setAvatarAnchorEl(null);

    if (!hasManagementRole(userData)) {
      Swal.fire("Cảnh báo", "Không đủ quyền hạn", "error");
      return;
    }

    if (tabModeSwap) {
      const existedIndex = tabs.findIndex((t) => t.ELE_CODE === "ST01");
      if (existedIndex !== -1) {
        dispatch(settabIndex(existedIndex));
        return;
      }
      dispatch(
        addTab({
          ELE_CODE: "ST01",
          ELE_NAME: "SETTING",
          REACT_ELE: "",
          PAGE_ID: -1,
        })
      );
      dispatch(settabIndex(tabs.length));
      return;
    }
    navigate("/setting");
  };

  const userDisplayName =
    [userData?.MIDLAST_NAME, userData?.FIRST_NAME].filter(Boolean).join(" ") ||
    userData?.EMPL_NO ||
    "User";

  const userInitials =
    userData?.FIRST_NAME?.slice(0, 1) ||
    userData?.MIDLAST_NAME?.slice(0, 1) ||
    "U";

  const serverDisplay = selectedServer || "3007";

  return (
    <header ref={headerRef} className="precision-header" aria-label="CMS Vina ERP High-End Master Bar">
      <div className="precision-header__container">
        {/* Left: Brand, Version & Server Telemetry */}
        <div className="precision-header__brand">
          <button
            type="button"
            className="precision-header__menuBtn"
            onClick={handleToggleMenu}
            title="Đóng / Mở Menu Phân Hệ ERP (Ctrl + Space)"
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
              {isMenuOpen ? "dock_to_left" : "menu"}
            </span>
          </button>

          <Link to="/" className="precision-header__logoLink" title="Trang chủ CMS Vina ERP">
            <img
              src="/companylogo.png"
              alt="CMS VINA Logo"
              className="precision-header__logo"
            />
          </Link>

          <div className="precision-header__brandMeta">
            <span className="precision-header__brandName">
              {company === "PVN" ? "PVN ERP" : "CMS VINA"}
            </span>
            <span className="precision-header__versionTag">v{current_ver}</span>
          </div>

          <div className="precision-header__divider" />

          <div className="precision-header__serverPill" title={`Kết nối máy chủ: ${serverDisplay}`}>
            <span className="precision-header__pulseDot" />
            <span className="precision-header__serverText">{serverDisplay}</span>
          </div>
        </div>

        {/* Center: High-Precision Omnibar Search */}
        <div className="precision-header__searchWrap">
          <div ref={searchAnchorRef} className="precision-header__searchBox">
            <span className="material-symbols-outlined precision-header__searchIcon">
              search
            </span>
            <input
              ref={searchInputRef}
              type="text"
              value={searchText}
              onChange={(e) => {
                const val = e.target.value;
                handleSearchTextChange(val);
                setInternalMenuOpenSource("navbar");
                if (val.trim() && !isMenuOpen) {
                  if (propOnSearchFocus) {
                    propOnSearchFocus();
                  } else {
                    dispatch(toggleSidebar("2"));
                  }
                }
                requestAnimationFrame(() => updateSearchMenuBounds());
              }}
              onFocus={() => {
                setInternalMenuOpenSource("navbar");
                if (propOnSearchFocus) {
                  propOnSearchFocus();
                } else if (!isMenuOpen) {
                  dispatch(toggleSidebar("2"));
                }
                requestAnimationFrame(() => updateSearchMenuBounds());
              }}
              onClick={() => {
                if (!isMenuOpen) {
                  setInternalMenuOpenSource("navbar");
                  if (propOnSearchFocus) {
                    propOnSearchFocus();
                  } else {
                    dispatch(toggleSidebar("2"));
                  }
                  requestAnimationFrame(() => updateSearchMenuBounds());
                }
              }}
              onBlur={propOnSearchBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  openFirstSearchResult();
                } else if (e.key === "Escape") {
                  handleSearchTextChange("");
                  setInternalMenuOpenSource(null);
                  if (isMenuOpen) {
                    dispatch(hideSidebar("2"));
                  }
                }
              }}
              placeholder="Tìm nhanh chức năng, mã hồ sơ, nhân sự, mã kiểm tra..."
              className="precision-header__searchInput"
            />
            {searchText && (
              <button
                type="button"
                className="precision-header__searchClear"
                onClick={() => handleSearchTextChange("")}
                title="Xóa tìm kiếm"
              >
                <CloseRounded style={{ fontSize: 13 }} />
              </button>
            )}
            <kbd className="precision-header__searchKbd">Ctrl + K</kbd>
          </div>
        </div>

        {/* Right: Actions, Lang, Notifications, User Profile */}
        <div className="precision-header__actions">
          {/* Theme Palette Switcher */}
          <button
            type="button"
            className="precision-header__actionBtn"
            onClick={(e) => setThemeAnchorEl(e.currentTarget)}
            title="Tùy chỉnh giao diện & Bảng màu Gradient"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              palette
            </span>
          </button>

          {/* Language Switcher Pill */}
          <div
            className="precision-header__langPill"
            onClick={(e) => setLanguageAnchorEl(e.currentTarget)}
            title="Chuyển đổi ngôn ngữ hệ thống"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 17, color: "#64748b" }}>
              language
            </span>
            <span
              className="precision-header__langMain"
              style={{ color: lang === "vi" ? "#1d4ed8" : undefined }}
            >
              VN
            </span>
            <span className="precision-header__langSub">
              / <strong style={{ color: lang === "en" ? "#1d4ed8" : undefined }}>EN</strong> /{" "}
              <strong style={{ color: lang === "kr" ? "#1d4ed8" : undefined }}>KR</strong>
            </span>
          </div>

          {/* Notifications Center */}
          <div
            className="precision-header__actionBtn"
            onClick={handleNotificationClick}
            title="Thông báo hệ thống thời gian thực"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 19 }}>
              notifications
            </span>
            {notiCount > 0 && (
              <span className="precision-header__badge">
                {notiCount > 99 ? "99+" : notiCount}
              </span>
            )}
          </div>

          <div className="precision-header__divider" />

          {/* User Profile Pill */}
          <div
            className="precision-header__userPill"
            onClick={(e) => setAvatarAnchorEl(e.currentTarget)}
            title="Tài khoản cá nhân & Cài đặt"
          >
            <div className="precision-header__avatarWrap">
              <div className="precision-header__avatar">
                {userData?.EMPL_IMAGE === "Y" ? (
                  <img
                    src={`/Picture_NS/NS_${userData?.EMPL_NO}.jpg`}
                    alt={userDisplayName}
                  />
                ) : (
                  userInitials
                )}
              </div>
              <span className="precision-header__userStatusDot" />
            </div>

            <div className="precision-header__userMeta">
              <span className="precision-header__userName">{userDisplayName}</span>
              <div className="precision-header__userRole">
                <span>{userData?.JOB_NAME || "Nhân viên"}</span>
                <span>•</span>
                <span className="precision-header__userCode">
                  {userData?.CMS_ID || userData?.EMPL_NO}
                </span>
              </div>
            </div>

            <span
              className="material-symbols-outlined"
              style={{ fontSize: 16, color: "#94a3b8" }}
            >
              expand_more
            </span>
          </div>
        </div>
      </div>

      {/* Flyout ERP Department Menu Panel */}
      {isMenuOpen && company !== "PVN" && (
        <div
          className={`precision-header__menuPanel ${effectiveAlignedToSearch ? "precision-header__menuPanel--search" : ""}`.trim()}
          style={
            effectiveAlignedToSearch && searchMenuBounds.width > 0
              ? ({
                  ["--precision-menu-left" as any]: `${searchMenuBounds.left}px`,
                  ["--precision-menu-width" as any]: `${searchMenuBounds.width}px`,
                } as React.CSSProperties)
              : undefined
          }
        >
          <NavMenuNew
            mode="overlay"
            onClose={() => {
              setInternalMenuOpenSource(null);
              dispatch(hideSidebar("2"));
            }}
            searchText={searchText}
            onSearchTextChange={handleSearchTextChange}
            onSearchFocus={propOnMenuSearchFocus}
            onSearchEnter={openFirstSearchResult}
            autoFocusSearch={effectiveAutoFocusSearch}
          />
        </div>
      )}

      {/* Language Popup Menu */}
      <Menu
        anchorEl={languageAnchorEl}
        open={Boolean(languageAnchorEl)}
        onClose={() => setLanguageAnchorEl(null)}
        PaperProps={{
          sx: {
            borderRadius: "8px",
            boxShadow: "0 10px 15px -3px rgba(15, 23, 42, 0.08)",
            border: "1px solid #cbd5e1",
            minWidth: 160,
          },
        }}
      >
        <MenuItem onClick={() => handleLanguageSelect("vi")} selected={lang === "vi"}>
          <ListItemIcon>
            <LanguageRounded fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Tiếng Việt (VN)" />
        </MenuItem>
        <MenuItem onClick={() => handleLanguageSelect("kr")} selected={lang === "kr"}>
          <ListItemIcon>
            <LanguageRounded fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="한국어 (KR)" />
        </MenuItem>
        <MenuItem onClick={() => handleLanguageSelect("en")} selected={lang === "en"}>
          <ListItemIcon>
            <LanguageRounded fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="English (EN)" />
        </MenuItem>
      </Menu>

      {/* Theme Selection Menu (Complete 35+ Gradients) */}
      <Menu
        anchorEl={themeAnchorEl}
        open={Boolean(themeAnchorEl)}
        onClose={() => setThemeAnchorEl(null)}
        PaperProps={{
          sx: {
            borderRadius: "8px",
            boxShadow: "0 10px 20px -3px rgba(15, 23, 42, 0.12)",
            border: "1px solid #cbd5e1",
            minWidth: 260,
            maxHeight: 380,
          },
        }}
      >
        <div style={{ padding: "8px 16px", fontSize: 11, fontWeight: 800, color: "#64748b", letterSpacing: "0.05em" }}>
          BẢNG MÀU GIAO DIỆN ERP ({themeOptions.length} THEMES)
        </div>
        <Divider />
        {themeOptions.map((opt) => (
          <MenuItem
            key={opt.value}
            selected={themeChoice === opt.value}
            onClick={() => handleThemeSelect(opt.value)}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 4,
                background: opt.value,
                marginRight: 10,
                border: "1px solid rgba(0,0,0,0.15)",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            />
            <ListItemText primary={opt.label} primaryTypographyProps={{ fontSize: 12, fontWeight: 500 }} />
          </MenuItem>
        ))}
      </Menu>

      {/* User Profile Dropdown */}
      <Menu
        anchorEl={avatarAnchorEl}
        open={Boolean(avatarAnchorEl)}
        onClose={() => setAvatarAnchorEl(null)}
        PaperProps={{
          sx: {
            borderRadius: "8px",
            boxShadow: "0 10px 20px -3px rgba(15, 23, 42, 0.1)",
            border: "1px solid #cbd5e1",
            minWidth: 240,
            p: 0.5,
          },
        }}
      >
        <div
          style={{
            padding: "12px 14px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "#f8fafc",
            borderRadius: 6,
            marginBottom: 6,
          }}
        >
          <Avatar
            src={
              userData?.EMPL_IMAGE === "Y"
                ? `/Picture_NS/NS_${userData?.EMPL_NO}.jpg`
                : undefined
            }
            sx={{ width: 40, height: 40, bgcolor: "#2563eb", fontWeight: 700 }}
          >
            {userInitials}
          </Avatar>
          <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <span style={{ fontWeight: 700, fontSize: 13, color: "#0f172a" }}>
              {userDisplayName}
            </span>
            <span style={{ fontSize: 11, color: "#64748b" }}>
              {userData?.JOB_NAME || "Nhân viên"} • {userData?.CMS_ID || userData?.EMPL_NO}
            </span>
            <span style={{ fontSize: 10, color: "#2563eb", fontWeight: 600 }}>
              {userData?.MAINDEPTNAME || "CMS VINA"}
            </span>
          </div>
        </div>

        <Divider sx={{ my: 0.5 }} />

        <MenuItem onClick={handleOpenAccountInfo}>
          <ListItemIcon>
            <AccountCircleRounded fontSize="small" sx={{ color: "#2563eb" }} />
          </ListItemIcon>
          <ListItemText
            primary="Thông tin tài khoản"
            primaryTypographyProps={{ fontSize: 12, fontWeight: 600 }}
          />
        </MenuItem>

        <MenuItem disableRipple sx={{ py: 0.5 }}>
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={tabModeSwap}
                onChange={() => {
                  handleTabModeChange();
                  setAvatarAnchorEl(null);
                }}
              />
            }
            label={tabModeSwap ? "Đa nhiệm (Multiple Tabs)" : "Đơn nhiệm (Single Tab)"}
            componentsProps={{
              typography: { fontSize: 12, fontWeight: 500, color: "#334155" },
            }}
            sx={{ m: 0, width: "100%" }}
          />
        </MenuItem>

        <MenuItem onClick={handleOpenSetting}>
          <ListItemIcon>
            <SettingsRounded fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Cài đặt hệ thống" primaryTypographyProps={{ fontSize: 12 }} />
        </MenuItem>

        <Divider sx={{ my: 0.5 }} />

        <MenuItem onClick={handleLogout} sx={{ color: "#f43f5e" }}>
          <ListItemIcon>
            <LogoutRounded fontSize="small" sx={{ color: "#f43f5e" }} />
          </ListItemIcon>
          <ListItemText
            primary="Đăng xuất"
            primaryTypographyProps={{ fontSize: 12, fontWeight: 600 }}
          />
        </MenuItem>
      </Menu>

      {/* Notifications Popover */}
      <Popover
        open={Boolean(notificationAnchorEl)}
        anchorEl={notificationAnchorEl}
        onClose={() => setNotificationAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            mt: 1.5,
            borderRadius: "16px",
            boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
            border: "none",
            background: "transparent",
            maxWidth: 480,
            width: "100%",
            overflow: "visible",
          },
        }}
      >
        <NotificationPanel onClose={() => setNotificationAnchorEl(null)} />
      </Popover>
    </header>
  );
}

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Collapse } from "@mui/material";
import { FiSearch, FiX, FiChevronDown, FiZap, FiBookmark } from "../icons/localIconSet";
import Swal from "sweetalert2";
import { RootState } from "../../redux/store";
import { ELE_ARRAY, UserData } from "../../api/GlobalInterface";
import { addTab, hideSidebar, settabIndex } from "../../redux/slices/globalSlice";
import type { NAVMENUDATA, SUBNAVMENUDATA } from "./getNavMenu";
import {
  canUseTabMode,
  filterNavMenusByQuery,
  includesMenuText,
  normalizeMenuPath,
  normalizeSearchText,
} from "./navMenuSearch";
import { getDepartmentTheme, getSubMenuColorTheme } from "./navMenuThemes";
import { useMobileBackClose } from "./useMobileBackClose";
import "./NavMenuNew.scss";

interface NavMenuNewProps {
  mode?: "overlay" | "sidebar";
  className?: string;
  onClose?: () => void;
  searchText?: string;
  onSearchTextChange?: (value: string) => void;
  onSearchFocus?: () => void;
  onSearchEnter?: () => void;
  autoFocusSearch?: boolean;
}

const MOBILE_MEDIA_QUERY = "(max-width: 768px)";

const getGroupKey = (menu: NAVMENUDATA) => `${menu.title}__${menu.path}`;

const isRouteActive = (pathname: string, targetPath: string) => {
  const normalizedTarget = normalizeMenuPath(targetPath);
  if (!normalizedTarget || normalizedTarget === "#") return false;
  const current = pathname.toLowerCase();
  const target = normalizedTarget.toLowerCase();
  return current === target || current.startsWith(`${target}/`);
};

export const NavMenuNew: React.FC<NavMenuNewProps> = ({
  mode = "overlay",
  className,
  onClose,
  searchText,
  onSearchTextChange,
  onSearchFocus,
  onSearchEnter,
  autoFocusSearch = true,
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [internalSearchText, setInternalSearchText] = useState("");
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  // --- Viewport mode: dưới 768px là mobile (bàn phím ảo không được tự bật) ---
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia(MOBILE_MEDIA_QUERY).matches
      : false
  );

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
    const handleViewportChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);
    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleViewportChange);
    return () => mediaQuery.removeEventListener("change", handleViewportChange);
  }, []);

  const company: string = useSelector((state: RootState) => state.totalSlice.company) || "CMS";
  const lang: string | undefined = useSelector((state: RootState) => state.totalSlice.lang);
  const tabModeSwap: boolean = useSelector((state: RootState) => state.totalSlice.tabModeSwap);
  const tabs: ELE_ARRAY[] = useSelector((state: RootState) => state.totalSlice.tabs);
  const userData: UserData | undefined = useSelector((state: RootState) => state.totalSlice.userData);

  // Danh mục menu: nạp ĐỘNG để 5 bộ icon react-icons của NavMenuCMS/NHATHAN/PVN
  // không bị kéo vào bundle khởi động (xem comment trong Home.tsx).
  const [menus, setMenus] = useState<NAVMENUDATA[]>([]);
  useEffect(() => {
    let cancelled = false;
    void import("./getNavMenu").then(({ getNavMenu }) => {
      if (!cancelled) setMenus(getNavMenu(company, lang));
    });
    return () => {
      cancelled = true;
    };
  }, [company, lang]);
  const effectiveSearchText = searchText ?? internalSearchText;
  const normalizedQuery = normalizeSearchText(effectiveSearchText).trim();

  const handleSearchChange = (value: string) => {
    if (onSearchTextChange) {
      onSearchTextChange(value);
      return;
    }
    setInternalSearchText(value);
  };

  const visibleMenus = useMemo(
    () => filterNavMenusByQuery(menus, effectiveSearchText),
    [effectiveSearchText, menus]
  );

  // Auto focus search box — CHỈ trên desktop.
  // Mobile: tự focus sẽ bật bàn phím ảo ngay khi mở menu, che gần hết danh sách phân hệ.
  useEffect(() => {
    if (!autoFocusSearch || isMobile) return;
    const timer = setTimeout(() => {
      searchInputRef.current?.focus();
      searchInputRef.current?.select();
    }, 60);
    return () => clearTimeout(timer);
  }, [autoFocusSearch, isMobile]);

  // Mobile: nút Back (Android) / vuốt cạnh (iOS) đóng drawer thay vì thoát khỏi web.
  // Chỉ áp dụng cho drawer nổi (overlay) — mode sidebar do trang tự quản lý trạng thái đóng/mở.
  useMobileBackClose(isMobile && mode === "overlay" && Boolean(onClose), () => {
    onClose?.();
  });

  // Global Ctrl+K / Cmd+K & Escape shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      } else if (e.key === "Escape") {
        if (mode === "overlay" && onClose) {
          onClose();
        } else {
          dispatch(hideSidebar("2"));
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mode, onClose, dispatch]);

  const lastLiveTabCode = useMemo(() => {
    for (let index = tabs.length - 1; index >= 0; index -= 1) {
      const code = tabs[index]?.ELE_CODE;
      if (code && code !== "-1") return code;
    }
    return "";
  }, [tabs]);

  const activeTabGroupKey = useMemo(() => {
    if (!tabModeSwap) return "";
    const byCode = menus.find((m) => m.subNav?.some((s) => s.MENU_CODE === lastLiveTabCode));
    return byCode ? getGroupKey(byCode) : "";
  }, [lastLiveTabCode, menus, tabModeSwap]);

  // Trạng thái mở/đóng nhóm:
  // - Lần đầu mở menu: KHÔNG xổ sẵn nhóm nào (trước đây luôn tự xổ nhóm đầu tiên hoặc
  //   nhóm chứa route hiện tại ⇒ vừa bất ngờ vừa tốn công render/dựng animation).
  // - Chỉ tự xổ khi người dùng ĐANG tìm kiếm (kết quả khớp vài nhóm) — và thu gọn lại
  //   khi xóa hết nội dung tìm kiếm.
  const previousQueryRef = useRef("");
  useEffect(() => {
    if (!normalizedQuery) {
      if (previousQueryRef.current) {
        previousQueryRef.current = "";
        setOpenGroups({});
      }
      return;
    }

    previousQueryRef.current = normalizedQuery;
    const matchingKeys: Record<string, boolean> = {};
    visibleMenus.forEach((m) => {
      if (m.subNav && m.subNav.length > 0) {
        const matched =
          includesMenuText(m.title, normalizedQuery) ||
          m.subNav.some(
            (sub) =>
              includesMenuText(sub.title, normalizedQuery) ||
              includesMenuText(sub.MENU_CODE, normalizedQuery)
          );
        if (matched) {
          matchingKeys[getGroupKey(m)] = true;
        }
      }
    });
    setOpenGroups(matchingKeys);
  }, [normalizedQuery, visibleMenus]);

  // Chế độ đa nhiệm tab: khi tab đang active thuộc nhóm khác thì mở nhóm đó.
  // Bỏ qua lần chạy đầu để lúc mới mở menu không nhóm nào bị xổ sẵn.
  const didInitTabGroupRef = useRef(false);
  useEffect(() => {
    if (!didInitTabGroupRef.current) {
      didInitTabGroupRef.current = true;
      return;
    }
    if (!activeTabGroupKey) return;
    setOpenGroups({ [activeTabGroupKey]: true });
  }, [activeTabGroupKey]);

  const handleGroupToggle = (menuKey: string) => {
    setOpenGroups((prev) => {
      const isCurrentlyOpen = Boolean(prev[menuKey]);
      if (isCurrentlyOpen) {
        return { ...prev, [menuKey]: false };
      }
      return { [menuKey]: true };
    });
  };

  const handleSubMenuClick = (subMenu: SUBNAVMENUDATA) => {
    if (!tabModeSwap) return;
    if (!canUseTabMode(userData, subMenu.MENU_CODE)) {
      Swal.fire("Cảnh báo", "Không đủ quyền hạn", "error");
      return;
    }

    const existedIndex = tabs.findIndex((ele) => ele.ELE_CODE === subMenu.MENU_CODE);
    if (existedIndex !== -1) {
      dispatch(settabIndex(existedIndex));
    } else {
      dispatch(
        addTab({
          ELE_NAME: subMenu.title,
          ELE_CODE: subMenu.MENU_CODE,
          REACT_ELE: "",
          PAGE_ID: -1,
        })
      );
      dispatch(settabIndex(tabs.length));
    }

    if (mode === "overlay" && onClose) {
      onClose();
    }
  };

  const drawerContent = (
    <aside
      className={`navmenu-stitch-drawer navmenu-stitch-drawer--${mode} ${
        isMobile ? "navmenu-stitch-drawer--mobile" : ""
      } ${className || ""}`.trim()}
      id="navigationDrawer"
      aria-label="ERP Enterprise Navigation Drawer"
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {/* 1. Header Section */}
      <div className="navmenu-stitch-drawer__header">
        <div className="navmenu-stitch-drawer__topBar">
          <div className="navmenu-stitch-drawer__tag">
            <FiZap size={13} />
            <span>{company} • ENTERPRISE SUITE</span>
          </div>
          {mode === "overlay" && onClose && (
            <button
              type="button"
              className="navmenu-stitch-drawer__closeBtn"
              onClick={onClose}
              title="Đóng menu (Esc)"
            >
              <FiX size={16} />
            </button>
          )}
        </div>

        <div className="navmenu-stitch-drawer__titleRow">
          <div className="navmenu-stitch-drawer__titleBox">
            <h2 className="navmenu-stitch-drawer__title">Navigation Menu</h2>
            <span className="navmenu-stitch-drawer__groupChip">
              {visibleMenus.length} groups
            </span>
          </div>
          {/* <span className="navmenu-stitch-drawer__version">v2700 Pro</span> */}
        </div>

        <div className="navmenu-stitch-drawer__searchBox">
          <span className="navmenu-stitch-drawer__searchIcon">
            <FiSearch size={14} />
          </span>
          <input
            ref={searchInputRef}
            type="text"
            className="navmenu-stitch-drawer__searchInput"
            placeholder={
              isMobile
                ? "Tìm phân hệ hoặc chức năng..."
                : "Tìm nhanh module, mã (NS1, KD, QC...)"
            }
            value={effectiveSearchText}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={onSearchFocus}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onSearchEnter?.();
              }
            }}
          />
          <kbd className="navmenu-stitch-drawer__searchShortcut">⌘K</kbd>
        </div>
      </div>

      {/* 2. Accordion Module List */}
      <div className="navmenu-stitch-drawer__list navmenu-scrollbar">
        {visibleMenus.length === 0 ? (
          <div className="navmenu-stitch-drawer__emptyState">
            Không tìm thấy phân hệ hoặc chức năng phù hợp.
          </div>
        ) : (
          visibleMenus.map((menu, idx) => {
            const menuKey = getGroupKey(menu);
            const hasSub = (menu.subNav?.length ?? 0) > 0;
            const isExpanded = Boolean(openGroups[menuKey]);
            const theme = getDepartmentTheme(menu.title, idx);
            const isActive = hasSub
              ? menu.subNav?.some((sub) => isRouteActive(location.pathname, sub.path))
              : isRouteActive(location.pathname, menu.path);

            return (
              <div
                key={menuKey}
                className={`navmenu-stitch-drawer__group ${
                  isExpanded ? "navmenu-stitch-drawer__group--expanded" : ""
                }`}
              >
                {hasSub ? (
                  <button
                    type="button"
                    className={`navmenu-stitch-drawer__groupBtn ${
                      isExpanded ? "navmenu-stitch-drawer__groupBtn--open" : ""
                    }`}
                    onClick={() => handleGroupToggle(menuKey)}
                  >
                    <div className="navmenu-stitch-drawer__groupLeft">
                      <div
                        className="navmenu-stitch-drawer__groupIconBox"
                        style={{
                          backgroundColor: isExpanded ? theme.primaryColor : theme.iconBg,
                          color: isExpanded ? "#ffffff" : theme.iconColor,
                        }}
                      >
                        {menu.icon}
                      </div>
                      <div className="navmenu-stitch-drawer__groupTitles">
                        <span className="navmenu-stitch-drawer__groupTitle">{menu.title}</span>
                        <span
                          className="navmenu-stitch-drawer__groupSubtitle"
                          style={{ color: isExpanded ? theme.primaryColor : "#64748b" }}
                        >
                          {theme.subtitle}
                        </span>
                      </div>
                    </div>

                    <div className="navmenu-stitch-drawer__groupRight">
                      <span
                        className="navmenu-stitch-drawer__countBadge"
                        style={{
                          backgroundColor: theme.badgeBg,
                          color: theme.badgeText,
                          borderColor: theme.badgeBorder,
                        }}
                      >
                        {menu.subNav ? `${menu.subNav.length} mục` : theme.defaultCodeRange}
                      </span>
                      <span
                        className={`navmenu-stitch-drawer__chevron ${
                          isExpanded ? "navmenu-stitch-drawer__chevron--open" : ""
                        }`}
                      >
                        <FiChevronDown size={15} />
                      </span>
                    </div>
                  </button>
                ) : (
                  <Link
                    to={normalizeMenuPath(menu.path)}
                    className="navmenu-stitch-drawer__groupBtn navmenu-stitch-drawer__groupBtn--link"
                    onClick={() => mode === "overlay" && onClose?.()}
                  >
                    <div className="navmenu-stitch-drawer__groupLeft">
                      <div
                        className="navmenu-stitch-drawer__groupIconBox"
                        style={{ backgroundColor: theme.iconBg, color: theme.iconColor }}
                      >
                        {menu.icon}
                      </div>
                      <div className="navmenu-stitch-drawer__groupTitles">
                        <span className="navmenu-stitch-drawer__groupTitle">{menu.title}</span>
                      </div>
                    </div>
                  </Link>
                )}

                {hasSub && (
                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <div className="navmenu-stitch-drawer__submenu">
                      {menu.subNav?.map((subMenu, sIdx) => {
                        const isSubActive = isRouteActive(location.pathname, subMenu.path);
                        const subTheme = getSubMenuColorTheme(subMenu.MENU_CODE, sIdx);
                        return (
                          <Link
                            key={`${menuKey}__${subMenu.MENU_CODE}`}
                            to={normalizeMenuPath(subMenu.path)}
                            className={`navmenu-stitch-drawer__subLink ${
                              isSubActive ? "navmenu-stitch-drawer__subLink--active" : ""
                            }`}
                            onClick={() => handleSubMenuClick(subMenu)}
                          >
                            <div className="navmenu-stitch-drawer__subLeft">
                              <div
                                className="navmenu-stitch-drawer__subIconBox"
                                style={{
                                  backgroundColor: subTheme.bg,
                                  color: subTheme.text,
                                }}
                              >
                                {subMenu.icon}
                              </div>
                              <span className="navmenu-stitch-drawer__subLabel">
                                {subMenu.title}
                              </span>
                            </div>
                            <span className="navmenu-stitch-drawer__subCode">
                              {subMenu.MENU_CODE}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </Collapse>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 3. Footer Section */}
      <div className="navmenu-stitch-drawer__footer">
        <div className="navmenu-stitch-drawer__syncStatus">
          <span className="navmenu-stitch-drawer__pulseDot"></span>
          <span>
            Đồng bộ: <strong>{company}.VINA</strong>
          </span>
        </div>
        <button
          type="button"
          className="navmenu-stitch-drawer__pinBtn"
          onClick={() => {
            if (mode === "overlay" && onClose) onClose();
          }}
          title={isMobile ? "Đóng menu" : "Ghim thanh điều hướng"}
        >
          {isMobile ? <FiX size={13} /> : <FiBookmark size={13} />}
          <span>{isMobile ? "Đóng menu" : "Ghim Sidebar"}</span>
        </button>
      </div>
    </aside>
  );

  // In overlay mode, portal to body for crisp floating drawer with soft backdrop
  if (mode === "overlay") {
    if (typeof document === "undefined") return null;
    return createPortal(
      <>
        <div className="navmenu-stitch-overlay" onClick={onClose} />
        {drawerContent}
      </>,
      document.body
    );
  }

  return drawerContent;
};

export default NavMenuNew;

import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  AutoAwesomeRounded,
  CloseRounded,
  SearchRounded,
} from "@mui/icons-material";
import { Chip, Collapse, IconButton, InputAdornment, TextField } from "@mui/material";
import Swal from "sweetalert2";
import { RootState } from "../../redux/store";
import { ELE_ARRAY, UserData } from "../../api/GlobalInterface";
import { addTab, hideSidebar, settabIndex } from "../../redux/slices/globalSlice";
import { getNavMenu, NAVMENUDATA, SUBNAVMENUDATA } from "./getNavMenu";
import { canUseTabMode, filterNavMenusByQuery, includesMenuText, normalizeMenuPath, normalizeSearchText } from "./navMenuSearch";
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

const getGroupKey = (menu: NAVMENUDATA) => `${menu.title}__${menu.path}`;

const findGroupKeyByMenuCode = (menus: NAVMENUDATA[], menuCode: string) => {
  if (!menuCode) return "";

  const matchedMenu = menus.find((menu) => {
    return menu.subNav?.some((subMenu) => subMenu.MENU_CODE === menuCode);
  });

  return matchedMenu ? getGroupKey(matchedMenu) : "";
};

const findGroupKeyByPath = (menus: NAVMENUDATA[], pathname: string) => {
  const matchedMenu = menus.find((menu) => {
    if (!menu.subNav || menu.subNav.length === 0) {
      return isRouteActive(pathname, menu.path);
    }

    return menu.subNav.some((subMenu) => isRouteActive(pathname, subMenu.path));
  });

  return matchedMenu ? getGroupKey(matchedMenu) : "";
};

const isRouteActive = (pathname: string, targetPath: string) => {
  const normalizedTarget = normalizeMenuPath(targetPath);
  if (!normalizedTarget || normalizedTarget === "#") {
    return false;
  }
  const current = pathname.toLowerCase();
  const target = normalizedTarget.toLowerCase();
  return current === target || current.startsWith(`${target}/`);
};

const NavMenuNew = ({
  mode = "overlay",
  className,
  onClose,
  searchText,
  onSearchTextChange,
  onSearchFocus,
  onSearchEnter,
  autoFocusSearch = true,
}: NavMenuNewProps) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [internalSearchText, setInternalSearchText] = useState("");
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [userCollapsedGroups, setUserCollapsedGroups] = useState<Record<string, boolean>>({});

  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const company: string = useSelector((state: RootState) => state.totalSlice.company);
  const lang: string | undefined = useSelector((state: RootState) => state.totalSlice.lang);
  const tabModeSwap: boolean = useSelector((state: RootState) => state.totalSlice.tabModeSwap);
  const tabs: ELE_ARRAY[] = useSelector((state: RootState) => state.totalSlice.tabs);
  const userData: UserData | undefined = useSelector((state: RootState) => state.totalSlice.userData);

  const backgroundImage = company === "CMS" ? theme?.CMS?.backgroundImage : theme?.PVN?.backgroundImage;

  const menus = useMemo(() => getNavMenu(company, lang), [company, lang]);
  const effectiveSearchText = searchText ?? internalSearchText;
  const normalizedQuery = normalizeSearchText(effectiveSearchText).trim();

  const lastLiveTabCode = useMemo(() => {
    for (let index = tabs.length - 1; index >= 0; index -= 1) {
      const code = tabs[index]?.ELE_CODE;
      if (code && code !== "-1") {
        return code;
      }
    }

    return "";
  }, [tabs]);

  const handleSearchChange = (value: string) => {
    if (onSearchTextChange) {
      onSearchTextChange(value);
      return;
    }

    setInternalSearchText(value);
  };

  const visibleMenus = useMemo(() => filterNavMenusByQuery(menus, effectiveSearchText), [effectiveSearchText, menus]);

  useEffect(() => {
    if (!autoFocusSearch) return;
    searchInputRef.current?.focus();
  }, [autoFocusSearch]);

  useEffect(() => {
    if (normalizedQuery) {
      const matchingGroupKeys = new Set<string>();

      visibleMenus.forEach((menu) => {
        if (!menu.subNav || menu.subNav.length === 0) return;

        const groupMatches = includesMenuText(menu.title, normalizedQuery) || includesMenuText(menu.path, normalizedQuery);
        const submenuMatches = menu.subNav.some((subMenu) => {
          return (
            includesMenuText(subMenu.title, normalizedQuery) ||
            includesMenuText(subMenu.path, normalizedQuery) ||
            includesMenuText(subMenu.MENU_CODE, normalizedQuery)
          );
        });

        if (groupMatches || submenuMatches) {
          matchingGroupKeys.add(getGroupKey(menu));
        }
      });

      if (matchingGroupKeys.size === 0) return;

      setOpenGroups((previous) => {
        let hasChange = false;
        const nextGroups = { ...previous };

        matchingGroupKeys.forEach((groupKey) => {
          if (!nextGroups[groupKey]) {
            nextGroups[groupKey] = true;
            hasChange = true;
          }
        });

        return hasChange ? nextGroups : previous;
      });

      return;
    }

    const tabGroupKey = tabModeSwap ? findGroupKeyByMenuCode(menus, lastLiveTabCode) : "";
    const routeGroupKey = findGroupKeyByPath(menus, location.pathname);
    const activeGroupKey = tabGroupKey || routeGroupKey;

    if (!activeGroupKey) return;
    if (userCollapsedGroups[activeGroupKey]) return;

    setOpenGroups((previous) => {
      if (previous[activeGroupKey]) return previous;
      return {
        ...previous,
        [activeGroupKey]: true,
      };
    });
  }, [lastLiveTabCode, location.pathname, menus, normalizedQuery, tabModeSwap, userCollapsedGroups, visibleMenus]);

  const handleGroupToggle = (menuKey: string) => {
    const nextOpen = !openGroups[menuKey];

    setOpenGroups((previous) => ({
      ...previous,
      [menuKey]: nextOpen,
    }));

    setUserCollapsedGroups((previous) => ({
      ...previous,
      [menuKey]: !nextOpen,
    }));
  };

  const handleSubMenuClick = (subMenu: SUBNAVMENUDATA) => {
    if (!tabModeSwap) return;

    if (!canUseTabMode(userData, subMenu.MENU_CODE)) {
      Swal.fire("Cảnh báo", "Không đủ quyền hạn", "error");
      return;
    }

    const existedTabIndex = tabs.findIndex((ele) => ele.ELE_CODE === subMenu.MENU_CODE);
    if (existedTabIndex !== -1) {
      dispatch(settabIndex(existedTabIndex));
      return;
    }

    dispatch(
      addTab({
        ELE_NAME: subMenu.title,
        ELE_CODE: subMenu.MENU_CODE,
        REACT_ELE: "",
        PAGE_ID: -1,
      })
    );
    dispatch(settabIndex(tabs.length));
  };

  return (
    <aside
      className={`navmenu-new navmenu-new--${mode} ${className ?? ""}`.trim()}
      aria-label="ERP navigation menu"
      onKeyDown={(event) => {
        if (event.key !== "Escape") return;
        event.preventDefault();

        if (mode === "overlay" && onClose) {
          onClose();
          return;
        }

        dispatch(hideSidebar("2"));
      }}
    >
      <div className="navmenu-new__surface" style={{ backgroundImage }}>
        <div className="navmenu-new__header">
          <div className="navmenu-new__headingCopy">
            <div className="navmenu-new__eyebrow">
              <AutoAwesomeRounded fontSize="inherit" />
              <span>{company}</span>
            </div>
            <div className="navmenu-new__titleRow">
              <h3 className="navmenu-new__title">Navigation</h3>
              <Chip size="small" className="navmenu-new__chip" label={`${visibleMenus.length} groups`} />
            </div>
            <p className="navmenu-new__subtitle">Quick access to modules, tabs and workflows</p>
          </div>

          {mode === "overlay" && onClose && (
            <IconButton className="navmenu-new__closeButton" size="small" onClick={onClose} aria-label="Close menu">
              <CloseRounded fontSize="small" />
            </IconButton>
          )}
        </div>

        <TextField
          inputRef={searchInputRef}
          value={effectiveSearchText}
          onChange={(event) => handleSearchChange(event.target.value)}
          onFocus={onSearchFocus}
          onKeyDown={(event) => {
            if (event.key !== "Enter") return;
            event.preventDefault();
            onSearchEnter?.();
          }}
          fullWidth
          size="small"
          placeholder="Search modules"
          className="navmenu-new__search"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRounded fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <div className="navmenu-new__list">
          {visibleMenus.length === 0 ? (
            <div className="navmenu-new__emptyState">No menu items match your search.</div>
          ) : (
            visibleMenus.map((menu) => {
              const menuKey = getGroupKey(menu);
              const hasSubMenu = (menu.subNav?.length ?? 0) > 0;
              const isExpanded = Boolean(openGroups[menuKey]);
              const isActive = hasSubMenu
                ? menu.subNav?.some((subMenu) => isRouteActive(location.pathname, subMenu.path))
                : isRouteActive(location.pathname, menu.path);

              return (
                <div
                  key={menuKey}
                  className={`navmenu-new__group ${isActive ? "navmenu-new__group--active" : ""}`}
                >
                  {hasSubMenu ? (
                    <button
                      type="button"
                      className={`navmenu-new__groupButton ${isExpanded ? "navmenu-new__groupButton--open" : ""}`}
                      onClick={() => handleGroupToggle(menuKey)}
                    >
                      <span className="navmenu-new__groupIcon">{menu.icon}</span>
                      <span className="navmenu-new__groupLabel">
                        <span className="navmenu-new__groupTitle">{menu.title}</span>
                      </span>
                      <span className="navmenu-new__groupState">
                        {isExpanded ? menu.iconOpened : menu.iconClosed}
                      </span>
                    </button>
                  ) : menu.path && menu.path !== "#" ? (
                    <Link to={normalizeMenuPath(menu.path)} className="navmenu-new__groupLink">
                      <span className="navmenu-new__groupIcon">{menu.icon}</span>
                      <span className="navmenu-new__groupLabel">
                        <span className="navmenu-new__groupTitle">{menu.title}</span>
                      </span>
                    </Link>
                  ) : (
                    <div className="navmenu-new__groupButton navmenu-new__groupButton--static">
                      <span className="navmenu-new__groupIcon">{menu.icon}</span>
                      <span className="navmenu-new__groupLabel">
                        <span className="navmenu-new__groupTitle">{menu.title}</span>
                      </span>
                    </div>
                  )}

                  {hasSubMenu && (
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                      <div className="navmenu-new__submenu">
                        {menu.subNav?.map((subMenu) => {
                          const isSubActive = isRouteActive(location.pathname, subMenu.path);
                          return (
                            <Link
                              key={`${menuKey}__${subMenu.MENU_CODE}`}
                              to={normalizeMenuPath(subMenu.path)}
                              className={`navmenu-new__submenuLink ${isSubActive ? "navmenu-new__submenuLink--active" : ""}`}
                              onClick={() => handleSubMenuClick(subMenu)}
                            >
                              <span className="navmenu-new__submenuIcon">{subMenu.icon}</span>
                              <span className="navmenu-new__submenuLabel">{subMenu.title}</span>
                              <span className="navmenu-new__submenuCode">{subMenu.MENU_CODE}</span>
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
      </div>
    </aside>
  );
};

export default NavMenuNew;

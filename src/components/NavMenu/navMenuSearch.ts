import { UserData } from "../../api/GlobalInterface";
import { NAVMENUDATA, SUBNAVMENUDATA } from "./getNavMenu";

const allowedJobs = new Set(["ADMIN", "Leader", "Sub Leader", "Dept Staff"]);

export const normalizeSearchText = (value: string) => {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
};

const getSearchWords = (value: string) => {
  return normalizeSearchText(value).match(/[a-z0-9]+/g) ?? [];
};

const getSearchInitials = (value: string) => {
  return getSearchWords(value)
    .map((word) => word[0])
    .join("");
};

const isOrderedSubsequence = (query: string, source: string) => {
  let sourceIndex = 0;

  for (const character of query) {
    sourceIndex = source.indexOf(character, sourceIndex);
    if (sourceIndex === -1) {
      return false;
    }
    sourceIndex += 1;
  }

  return true;
};

export const matchesMenuText = (source: string | undefined, query: string) => {
  if (!source) return false;

  const normalizedQuery = normalizeSearchText(query).trim();
  if (!normalizedQuery) return false;

  const normalizedSource = normalizeSearchText(source);
  if (normalizedSource.includes(normalizedQuery)) {
    return true;
  }

  const compactQuery = normalizedQuery.replace(/\s+/g, "");
  if (!compactQuery) {
    return false;
  }

  const initials = getSearchInitials(source);
  return initials.includes(compactQuery) || isOrderedSubsequence(compactQuery, initials);
};

export const includesMenuText = (source: string | undefined, query: string) => {
  return matchesMenuText(source, query);
};

export const normalizeMenuPath = (path: string) => {
  if (!path) return "#";
  if (path.startsWith("http") || path.startsWith("#")) {
    return path;
  }
  return path.startsWith("/") ? path : `/${path}`;
};

export const canUseTabMode = (userData: UserData | undefined, menuCode?: string) => {
  if (!menuCode) return false;
  return allowedJobs.has(userData?.JOB_NAME ?? "") || menuCode === "NS4" || menuCode === "NS6";
};

export const filterNavMenusByQuery = (menus: NAVMENUDATA[], query: string) => {
  const normalizedQuery = normalizeSearchText(query).trim();
  if (!normalizedQuery) return menus;

  return menus.reduce<NAVMENUDATA[]>((accumulator, menu) => {
    const groupMatches = includesMenuText(menu.title, normalizedQuery) || includesMenuText(menu.path, normalizedQuery);
    const filteredSubNav = menu.subNav?.filter((subMenu) => {
      return (
        includesMenuText(subMenu.title, normalizedQuery) ||
        includesMenuText(subMenu.path, normalizedQuery) ||
        includesMenuText(subMenu.MENU_CODE, normalizedQuery)
      );
    });

    if (groupMatches) {
      accumulator.push(menu);
      return accumulator;
    }

    if ((filteredSubNav?.length ?? 0) > 0) {
      accumulator.push({
        ...menu,
        subNav: filteredSubNav,
      });
    }

    return accumulator;
  }, []);
};

export type NavMenuSearchResult = {
  menu: NAVMENUDATA;
  subMenu?: SUBNAVMENUDATA;
};

export const getFirstNavMenuSearchResult = (menus: NAVMENUDATA[], query: string): NavMenuSearchResult | null => {
  if (!normalizeSearchText(query).trim()) {
    return null;
  }

  const visibleMenus = filterNavMenusByQuery(menus, query);

  for (const menu of visibleMenus) {
    if ((menu.subNav?.length ?? 0) > 0) {
      return {
        menu,
        subMenu: menu.subNav?.[0],
      };
    }

    if (menu.path && menu.path !== "#") {
      return {
        menu,
      };
    }
  }

  return null;
};
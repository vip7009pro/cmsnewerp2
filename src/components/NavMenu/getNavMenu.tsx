import { NavMenuCMS } from './menu/NavMenuCMS';
import { NavMenuNHATHAN } from './menu/NavMenuNHATHAN';
import { NavMenuPVN } from './menu/NavMenuPVN';

export interface SUBNAVMENUDATA {
  title: string;
  path: string;
  icon: JSX.Element;
  MENU_CODE: string;
  cName?: string;
}
export interface NAVMENUDATA {
  title: string;
  path: string;
  icon: JSX.Element;
  iconClosed: JSX.Element;
  iconOpened: JSX.Element;
  subNav?: SUBNAVMENUDATA[];
}
export const getNavMenu = (company: string, lang?: string): NAVMENUDATA[] => {
  if (company === 'CMS') {
    return NavMenuCMS(lang);
  } else if (company === 'NHATHAN') {
    return NavMenuNHATHAN(lang);
  } else if (company === 'PVN') {
    return NavMenuPVN(lang);
  }
  return [];
};

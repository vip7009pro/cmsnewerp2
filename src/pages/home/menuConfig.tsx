// src/pages/home/menuConfig.ts
import { getlang } from "../../components/String/String";
import { MENU_LIST_DATA } from "../../api/GlobalInterface";
import { CMS_MENU } from "./menu/CMS_MENU";
import { NHATHAN_MENU } from "./menu/NHATHAN_MENU";
import { PVN_MENU } from "./menu/PVN_MENU";

// Helper để tránh lặp lại lang fallback
export const getLangSafe = (key: string, lang?: string) => getlang(key,lang ?? "en");

// Hàm sinh menu
export function getMenuList(company: string, lang?: string): MENU_LIST_DATA[] {
  if (company === "CMS") {
    return CMS_MENU(lang);
  }
  else if(company === "NHATHAN") {
    return NHATHAN_MENU(lang);
  } 
  else if (company === "PVN") {
    return  PVN_MENU(lang);
  }
  return [];
}
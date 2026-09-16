import {
  DAOFILM_ERR_DATA,
  RND_FILM_SAVING_TREND_DATA,
  RND_NEWCODE_BY_CUSTOMER,
  RND_NEWCODE_BY_PRODTYPE,
  RND_NEWCODE_TREND_DATA,
} from "../interfaces/rndInterface";
import { YCTK_TREND_DATA } from "../../kinhdoanh/interfaces/kdInterface";

export type RNDReportTab = "all" | "trending" | "distribution" | "filmsaving" | "daofilmerr";

export interface RNDKpiItem {
  total: number;
  newCode: number;
  ecn: number;
  rate: number;
}

export interface RNDKpiSummary {
  today: RNDKpiItem;
  thisWeek: RNDKpiItem;
  thisMonth: RNDKpiItem;
  thisYear: RNDKpiItem;
}

export interface UseRNDReportDataReturn {
  fromdate: string;
  setFromDate: (val: string) => void;
  todate: string;
  setToDate: (val: string) => void;
  cust_name: string;
  setCust_Name: (val: string) => void;
  df: boolean;
  setDF: (val: boolean) => void;
  searchCodeArray: string[];
  setSearchCodeArray: (val: string[]) => void;
  activeTab: RNDReportTab;
  setActiveTab: (val: RNDReportTab) => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  isLoading: boolean;
  kpiSummary: RNDKpiSummary;

  // Dữ liệu xu hướng New Code
  dailynewcode: RND_NEWCODE_TREND_DATA[];
  weeklynewcode: RND_NEWCODE_TREND_DATA[];
  monthlynewcode: RND_NEWCODE_TREND_DATA[];
  yearlynewcode: RND_NEWCODE_TREND_DATA[];

  // Dữ liệu cơ cấu
  newcodebycustomer: RND_NEWCODE_BY_CUSTOMER[];
  newcodebyprodtype: RND_NEWCODE_BY_PRODTYPE[];

  // Dữ liệu Tiết kiệm Film (PVN)
  filmSavingDaily: RND_FILM_SAVING_TREND_DATA[];
  filmSavingWeekly: RND_FILM_SAVING_TREND_DATA[];
  filmSavingMonthly: RND_FILM_SAVING_TREND_DATA[];
  filmSavingYearly: RND_FILM_SAVING_TREND_DATA[];
  tilefilmbanBackData: RND_FILM_SAVING_TREND_DATA[];

  // Dữ liệu YCTK Design Request (XXX)
  yctkdailynewcode: YCTK_TREND_DATA[];
  yctkweeklynewcode: YCTK_TREND_DATA[];
  yctkmonthlynewcode: YCTK_TREND_DATA[];
  yctkyearlynewcode: YCTK_TREND_DATA[];

  // Dữ liệu Lỗi dao film
  daofilmerr: DAOFILM_ERR_DATA[];

  // Hàm khởi tạo và tải dữ liệu
  initFunction: () => Promise<void>;
  company: string;
}

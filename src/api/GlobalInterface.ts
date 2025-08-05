import { ReactElement, ReactNode } from "react";
import { QLSXPLANDATA } from "../pages/qlsx/QLSXPLAN/interfaces/khsxInterface";

//redux interface
export interface UserData {
  EMPL_IMAGE?: string;
  ADD_COMMUNE?: string;
  ADD_DISTRICT?: string;
  ADD_PROVINCE?: string;
  ADD_VILLAGE?: string;
  ATT_GROUP_CODE?: number;
  CMS_ID?: string;
  CTR_CD?: string;
  DOB?: string;
  EMAIL?: string;
  EMPL_NO?: string;
  FACTORY_CODE?: number;
  FACTORY_NAME?: string;
  FACTORY_NAME_KR?: string;
  FIRST_NAME?: string;
  HOMETOWN?: string;
  JOB_CODE?: number;
  JOB_NAME?: string;
  JOB_NAME_KR?: string;
  MAINDEPTCODE?: number;
  MAINDEPTNAME?: string;
  MAINDEPTNAME_KR?: string;
  MIDLAST_NAME?: string;
  ONLINE_DATETIME?: string;
  PASSWORD?: string;
  PHONE_NUMBER?: string;
  POSITION_CODE?: number;
  POSITION_NAME?: string;
  POSITION_NAME_KR?: string;
  REMARK?: string;
  SEX_CODE?: number;
  SEX_NAME?: string;
  SEX_NAME_KR?: string;
  SUBDEPTCODE?: number;
  SUBDEPTNAME?: string;
  SUBDEPTNAME_KR?: string;
  WORK_POSITION_CODE?: number;
  WORK_POSITION_NAME?: string;
  WORK_POSITION_NAME_KR?: string;
  WORK_SHIFT_CODE?: number;
  WORK_SHIF_NAME?: string;
  WORK_SHIF_NAME_KR?: string;
  WORK_START_DATE?: string;
  WORK_STATUS_CODE?: number;
  WORK_STATUS_NAME?: string;
  WORK_STATUS_NAME_KR?: string;
}
export interface ELE_ARRAY {
  REACT_ELE: any;
  ELE_NAME: string;
  ELE_CODE: string;
  PAGE_ID?: number;
}
export interface GlobalInterface {
  notificationCount?: number;
  globalSetting?: WEB_SETTING_DATA[];
  globalSocket?: any;
  userData?: UserData;
  diemdanhstate?: boolean;
  lang?: string;
  sidebarmenu?: boolean;
  multiple_chithi_array: QLSXPLANDATA[];
  server_ip: string;
  tabs: ELE_ARRAY[];
  componentArray: Array<any>;
  tabIndex: number;
  tabModeSwap: boolean;
  loginState: boolean;
  vendorLoginState: boolean;
  ctr_cd: string;
  company: string;
  theme: {
    CMS: any;
    PVN: any;
  };
  cpnInfo: any;
  selectedServer: string;
}
export interface userDataInterface {
  EMPL_IMAGE?: string;
  ADD_COMMUNE: string;
  ADD_DISTRICT: string;
  ADD_PROVINCE: string;
  ADD_VILLAGE: string;
  ATT_GROUP_CODE: number;
  CMS_ID: string;
  CTR_CD: string;
  DOB: string;
  EMAIL: string;
  EMPL_NO: string;
  FACTORY_CODE: number;
  FACTORY_NAME: string;
  FACTORY_NAME_KR: string;
  FIRST_NAME: string;
  HOMETOWN: string;
  JOB_CODE: number;
  JOB_NAME: string;
  JOB_NAME_KR: string;
  MAINDEPTCODE: number;
  MAINDEPTNAME: string;
  MAINDEPTNAME_KR: string;
  MIDLAST_NAME: string;
  ONLINE_DATETIME: string;
  PASSWORD: string;
  PHONE_NUMBER: string;
  POSITION_CODE: number;
  POSITION_NAME: string;
  POSITION_NAME_KR: string;
  REMARK: string;
  SEX_CODE: number;
  SEX_NAME: string;
  SEX_NAME_KR: string;
  SUBDEPTCODE: number;
  SUBDEPTNAME: string;
  SUBDEPTNAME_KR: string;
  WORK_POSITION_CODE: number;
  WORK_POSITION_NAME: string;
  WORK_POSITION_NAME_KR: string;
  WORK_SHIFT_CODE: number;
  WORK_SHIF_NAME: string;
  WORK_SHIF_NAME_KR: string;
  WORK_START_DATE: string;
  WORK_STATUS_CODE: number;
  WORK_STATUS_NAME: string;
  WORK_STATUS_NAME_KR: string;
}
//chart
export interface WeeklyClosingData {
  EMPL_NAME: string;
  DELIVERY_AMOUNT: number;
}
export interface WeeklyClosingData {
  DEL_WEEK: string;
  DELIVERY_QTY: number;
  DELIVERED_AMOUNT: number;
}
export interface MENU_LIST_DATA {
  MENU_CODE: string;
  MENU_NAME: string;
  MENU_ITEM: ReactNode;
}
export interface WEB_SETTING_DATA {
  ID: number;
  ITEM_NAME: string;
  DEFAULT_VALUE: string;
  CURRENT_VALUE: string;
  SECTION: string;
}
export interface FORM_ELEMENT {
  elementType: string;
  element: ReactElement;
}


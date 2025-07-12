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
export interface POST_DATA {
  CTR_CD: string;
  POST_ID: number;
  DEPT_CODE: string;
  MAINDEPT: string;
  SUBDEPT: string;
  FILE_NAME: string;
  TITLE: string;
  CONTENT: string;
  IS_PINNED: string;
  INS_DATE: string;
  INS_EMPL: string;
  UPD_DATE: string;
  UPD_EMPL: string;
}
export interface DEPARTMENT_DATA {
  CTR_CD: string;
  DEPT_CODE: number;
  MAINDEPT: string;
  SUBDEPT: string;
  INFORMATION: string;
  PIN_QTY: number;
  INS_DATE: string;
  INS_EMPL: string;
  UPD_DATE: string;
  UPD_EMPL: string;
}
export interface KHKT_DATA {
  PLAN_DATE: string;
  FACTORY: string;
  G_CODE: string;
  G_NAME: string;
  INSPECT_SPEED: number;
  INS_STOCK_14H: number;
  PROD_TYPE: string;
  UNIT: string;
  INIT_WH_STOCK: number;
  PL_TG: number;
  TONKIEM_QTY: number;
  KQ_D1: number;
  KQ_OK: number;
  INS_STOCK: number;
  TON_THUA: number;
  D1_YESTD: number;
  D2_YESTD: number;
  OUTPUT_YESTD: number;
  OUTPUT_QTY_EA: number;
  D1: number;
  D2: number;
  D3: number;
  D4: number;
  D5: number;
  D6: number;
  D1D2_H: number;
  D1_H: number;
  D2_H: number;
  D3_H: number;
  D4_H: number;
  D5_H: number;
  D6_H: number;
  INPUT_14_18H: number;
  INPUT_18_2H: number;
  INPUT_2_6H: number;
  INPUT_6_10H: number;
  BTP_QTY: number;
  INPUT_14_18H_YESTD: number;
  INPUT_18_2H_YESTD: number;
  INPUT_2_6H_YESTD: number;
  INPUT_6_10H_YESTD: number;
  INPUT_10_14H_YESTD: number;
  TOTAL_INPUT_SAU_14H_YESTD: number;
  TOTAL_INPUT_SAU_14H: number;
}
export interface INSPECT_STATUS_DATA {
  PLAN_DATE: string;
  INS_DATE: string;
  G_CODE: string;
  IS_INSPECTING: string;
  INIT_INSP_STOCK: number;
  CURRENT_INSP_STOCK: number;
  INPUT_QTY: number;
  FIRST_INPUT_TIME: string;
  PRIORITY: number;
  PLAN: string;
  INIT_WH_STOCK: number;
  OUTPUT_QTY: number;
  WH_OUTPUT_QTY: number;
  CURRENT_WH_STOCK: number;
  TOTAL_OUTPUT: number; // This represents INIT_WH_STOCK + OUTPUT_QTY
  COVER_D1: string;
  D1: number;
  D2: number;
  D3: number;
  D4: number;
  D5: number;
  D6: number;
  D7: number;
  D8: number;
  D9: number;
  D10: number;
  D11: number;
  D12: number;
  D13: number;
  D14: number;
  D15: number;
  STATUS: string;
}
export interface TEMLOTKT_DATA {
  G_NAME: string;
  G_NAME_KD: string;
  DESCR: string;
  PROD_TYPE: string;
  PROD_MAIN_MATERIAL: string;
  CTR_CD: string;
  FACTORY: string;
  PROCESS_LOT_NO: string;
  LOT_PRINT_DATE: string;
  EMPL_NO: string;
  PACKING_QTY: number;
  LOT_QTY: string;
  REMARK: string;
  REMARK2: string;
  LABEL_ID: string;
  LINEQC_EMPL_NO: string;
  CNDB_ENCODES: string;
  EXP_DATE: string;
  MFT_DATE: string;
  LABEL_ID2: string;
  LABEL_SEQ: string;
  LABEL_ID_OLD: string;
  MFT_WEEK: string;
  PLAN_ID: string;
  G_CODE: string;
  MACHINE_NO: string;
  TABLE_NO: string;
  INS_STATUS: string;
  PO_TYPE: string;
  PROD_REQUEST_NO: string;
  LABEL_QTY_BY_DATE: string;
  G_EXP_DATE: string;
  G_QL_HSD: string;
  SORTING: string;
  FSC: string;
  FSC_CODE: string;
}
export interface LUONGP3_DATA {
  PLAN_ID: string;
  PLAN_DATE: string;
  PLAN_QTY: number;
  SX_DATE: string;
  PLAN_EQ: string;
  EQ_NAME: string;
  INS_EMPL: string;
  FULL_NAME: string;
  PROD_REQUEST_NO: string;
  G_CODE: string;
  G_NAME: string;
  G_NAME_KD: string;
  DESCR: string;
  M_CODE: string;
  M_NAME: string;
  WIDTH_CD: number;
  M_PRICE: number;
  USED_QTY: number;
  PR_NG: number;
  SETTING_MET: number;
  OK_MET: number;
  OK_EA: number;
  DM_SETTING: number;
  DM_LOSS_SX: number;
  PD: number;
  DON_GIA_IN: number;
  PROD_PRINT_TIMES: number;
  FILM_OUT_TIMES: number;
  THUA_THIEU_MET: number;
  THUA_THIEU_M2: number;
  THUA_THIEU_AMOUNT: number;
  PRINT_QTY_AMOUNT: number;
  OUT_FILM_AMOUNT: number;
  TOTAL_P3_AMOUNT: number;
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

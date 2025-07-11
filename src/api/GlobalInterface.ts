import { ReactElement, ReactNode } from "react";
import { QLSXPLANDATA } from "../pages/qlsx/QLSXPLAN/interfaces/khsxInterface";
//quan ly vat lieu
export interface MATERIAL_TABLE_DATA {
  M_ID: number;
  M_NAME: string;
  DESCR: string;
  CUST_CD: string;
  CUST_NAME_KD: string;
  SSPRICE: number;
  CMSPRICE: number;
  SLITTING_PRICE: number;
  MASTER_WIDTH: number;
  ROLL_LENGTH: number;
  USE_YN: string;
  INS_DATE: string;
  INS_EMPL: string;
  UPD_DATE: string;
  UPD_EMPL: string;
  EXP_DATE: string;
  TDS: string;
  FSC: string;
  FSC_CODE: string;
  FSC_NAME: string;
  TDS_VER: number;
  SGS_VER: number;
  MSDS_VER: number;
}
export interface FSC_LIST_DATA {
  FSC_CODE: string;
  FSC_NAME: string;
}
//bang chang cong
export interface BANGCHAMCONG_DATA {
  DATE_COLUMN: string;
  WEEKDAY: string;
  NV_CCID: string;
  EMPL_NO: string;
  CMS_ID: string;
  MIDLAST_NAME: string;
  FIRST_NAME: string;
  FULL_NAME: string;
  PHONE_NUMBER: string;
  SEX_NAME: string;
  WORK_STATUS_NAME: string;
  FACTORY_NAME: string;
  JOB_NAME: string;
  WORK_SHIF_NAME: string;
  WORK_POSITION_NAME: string;
  SUBDEPTNAME: string;
  MAINDEPTNAME: string;
  REQUEST_DATE: string;
  APPLY_DATE: string;
  APPROVAL_STATUS: string;
  OFF_ID: number;
  CA_NGHI: string;
  ON_OFF: number;
  OVERTIME_INFO: string;
  OVERTIME: number;
  REASON_NAME: string;
  REMARK: string;
  XACNHAN: string;
  CA_CODE: number;
  CA_NAME: string;
  IN_START: string;
  IN_END: string;
  OUT_START: string;
  OUT_END: string;
  CHECK_DATE0: string;
  CHECK10: string;
  CHECK20: string;
  CHECK30: string;
  CHECK40: string;
  CHECK50: string;
  CHECK60: string;
  CHECK_DATE: string;
  CHECK1: string;
  CHECK2: string;
  CHECK3: string;
  CHECK4: string;
  CHECK5: string;
  CHECK6: string;
  CHECK_DATE2: string;
  CHECK12: string;
  CHECK22: string;
  CHECK32: string;
  CHECK42: string;
  CHECK52: string;
  CHECK62: string;
  IN_TIME: string;
  OUT_TIME: string;
}
export interface BANGCHAMCONG_DATA2 {
  DATE_COLUMN: string;
  WEEKDAY: string;
  NV_CCID: string;
  EMPL_NO: string;
  CMS_ID: string;
  MIDLAST_NAME: string;
  FIRST_NAME: string;
  FULL_NAME: string;
  PHONE_NUMBER: string;
  SEX_NAME: string;
  WORK_STATUS_NAME: string;
  FACTORY_NAME: string;
  JOB_NAME: string;
  WORK_SHIF_NAME: string;
  CALV: number;
  WORK_POSITION_NAME: string;
  SUBDEPTNAME: string;
  MAINDEPTNAME: string;
  REQUEST_DATE: string;
  APPLY_DATE: string;
  APPROVAL_STATUS: string;
  OFF_ID: number;
  CA_NGHI: number;
  ON_OFF: number;
  OVERTIME_INFO: string;
  OVERTIME: number;
  REASON_NAME: string;
  REMARK: string;
  XACNHAN: string;
  FIXED_IN_TIME: string;
  FIXED_OUT_TIME: string;
  CHECK1: string;
  CHECK2: string;
  CHECK3: string;
  PREV_CHECK1: string;
  PREV_CHECK2: string;
  PREV_CHECK3: string;
  NEXT_CHECK1: string;
  NEXT_CHECK2: string;
  NEXT_CHECK3: string;
  IN_TIME: string;
  OUT_TIME: string;
}
export interface CA_INFO {
  CA_CODE: number;
  CA_NAME: string;
  CA_NAME_KR: string;
  IN_START: string;
  IN_END: string;
  OUT_START: string;
  OUT_END: string;
  LAUNCH_START: string;
  LAUNCH_END: string;
}
export interface IN_OUT_DATA {
  CA_CODE: number;
  IN_START: string;
  IN_END: string;
  OUT_START: string;
  OUT_END: string;
  CHECK10: string;
  CHECK20: string;
  CHECK30: string;
  CHECK40: string;
  CHECK50: string;
  CHECK60: string;
  CHECK1: string;
  CHECK2: string;
  CHECK3: string;
  CHECK4: string;
  CHECK5: string;
  CHECK6: string;
  CHECK12: string;
  CHECK22: string;
  CHECK32: string;
  CHECK42: string;
  CHECK52: string;
  CHECK62: string;
}
export interface IN_OUT_DATA2 {
  SHIFT_NAME: string;
  IN_START: string;
  IN_END: string;
  OUT_START: string;
  OUT_END: string;
  CHECK10: string;
  CHECK20: string;
  CHECK30: string;
  CHECK40: string;
  CHECK50: string;
  CHECK60: string;
  CHECK1: string;
  CHECK2: string;
  CHECK3: string;
  CHECK4: string;
  CHECK5: string;
  CHECK6: string;
  CHECK12: string;
  CHECK22: string;
  CHECK32: string;
  CHECK42: string;
  CHECK52: string;
  CHECK62: string;
}
export interface IN_OUT_DATA22 {
  SHIFT_NAME: string;
  CHECK1: string;
  CHECK2: string;
  CHECK3: string;
  PREV_CHECK1: string;
  PREV_CHECK2: string;
  PREV_CHECK3: string;
  NEXT_CHECK1: string;
  NEXT_CHECK2: string;
  NEXT_CHECK3: string;
}
export interface IN_OUT_DATA3 {
  CALV: number;
  CHECK1: string;
  CHECK2: string;
  CHECK3: string;
  PREV_CHECK1: string;
  PREV_CHECK2: string;
  PREV_CHECK3: string;
  NEXT_CHECK1: string;
  NEXT_CHECK2: string;
  NEXT_CHECK3: string;
}
//bao cao nhan su
export interface DIEMDANHFULLSUMMARY {
  id: number;
  MAINDEPTNAME: string;
  COUNT_TOTAL: number;
  COUNT_ON: number;
  COUNT_OFF: number;
  COUNT_CDD: number;
  T1_TOTAL: number;
  T1_ON: number;
  T1_OFF: number;
  T1_CDD: number;
  T2_TOTAL: number;
  T2_ON: number;
  T2_OFF: number;
  T2_CDD: number;
  HC_TOTAL: number;
  HC_ON: number;
  HC_OFF: number;
  HC_CDD: number;
  ON_RATE: number;
  TOTAL: number;
  PHEP_NAM: number;
  NUA_PHEP: number;
  NGHI_VIEC_RIENG: number;
  NGHI_OM: number;
  CHE_DO: number;
  KHONG_LY_DO: number;
}
export interface DiemDanhNhomDataSummary {
  id: string;
  MAINDEPTNAME: string;
  SUBDEPTNAME: string;
  TOTAL_ALL: number;
  TOTAL_ON: number;
  TOTAL_OFF: number;
  TOTAL_CDD: number;
  TOTAL_NM1: number;
  TOTAL_NM2: number;
  ON_NM1: number;
  ON_NM2: number;
  OFF_NM1: number;
  OFF_NM2: number;
  CDD_NM1: number;
  CDD_NM2: number;
}
export interface MainDeptData {
  id: number;
  MAINDEPTCODE: number;
  MAINDEPTNAME: string;
  MAINDEPTNAME_KR: string;
}
export interface DiemDanhHistoryData {
  id: string;
  APPLY_DATE: string;
  MAINDEPTNAME: string;
  TOTAL: number;
  TOTAL_ON: number;
  TOTAL_OFF: number;
  ON_RATE: number;
}
export interface DiemDanhFullData {
  DATE_COLUMN: string;
  WEEKDAY: string;
  id: string;
  EMPL_NO: string;
  CMS_ID: string;
  MIDLAST_NAME: string;
  FIRST_NAME: string;
  PHONE_NUMBER: string;
  SEX_NAME: string;
  WORK_STATUS_NAME: string;
  FACTORY_NAME: string;
  JOB_NAME: string;
  WORK_SHIF_NAME: string;
  WORK_POSITION_NAME: string;
  SUBDEPTNAME: string;
  MAINDEPTNAME: string;
  REQUEST_DATE: string;
  APPLY_DATE: string;
  APPROVAL_STATUS: number;
  OFF_ID: number;
  CA_NGHI: number;
  ON_OFF: number;
  OVERTIME_INFO: string;
  OVERTIME: number;
  REASON_NAME: string;
  REMARK: string;
  XACNHAN: string;
}
export interface DIEMDANHMAINDEPT {
  id: number;
  MAINDEPTNAME: string;
  COUNT_TOTAL: number;
  COUT_ON: number;
  COUT_OFF: number;
  COUNT_CDD: number;
  ON_RATE: number;
}
//diem danh nhom
export interface DiemDanhNhomData {
  id: string;
  APPLY_DATE: string;
  APPROVAL_STATUS: number;
  CA_NGHI: number;
  CMS_ID: string;
  EMPL_NO: string;
  FACTORY_NAME: string;
  FIRST_NAME: string;
  JOB_NAME: string;
  MAINDEPTNAME: string;
  MIDLAST_NAME: string;
  FULL_NAME: string;
  OFF_ID: any;
  ON_OFF: any;
  OVERTIME: any;
  OVERTIME_INFO: any;
  PHONE_NUMBER: string;
  REASON_NAME: any;
  REQUEST_DATE: string;
  SEX_NAME: string;
  SUBDEPTNAME: string;
  WORK_POSITION_NAME: string;
  WORK_SHIF_NAME: string;
  WORK_STATUS_NAME: string;
  REMARK?: string;
}
export interface WorkPositionTableData {
  id: number;
  CTR_CD: string;
  SUBDEPTCODE: number;
  WORK_POSITION_CODE: number;
  WORK_POSITION_NAME: string;
  WORK_POSITION_NAME_KR: string;
  ATT_GROUP_CODE: number;
}
export interface DiemDanhLichSuData {
  DATE_COLUMN: string;
  WEEKDAY: string;
  id: string;
  EMPL_NO: string;
  CMS_ID: string;
  MIDLAST_NAME: string;
  FIRST_NAME: string;
  PHONE_NUMBER: string;
  SEX_NAME: string;
  WORK_STATUS_NAME: string;
  FACTORY_NAME: string;
  JOB_NAME: string;
  WORK_SHIF_NAME: string;
  WORK_POSITION_NAME: string;
  SUBDEPTNAME: string;
  MAINDEPTNAME: string;
  REQUEST_DATE: string;
  APPLY_DATE: string;
  APPROVAL_STATUS: number;
  OFF_ID: number;
  CA_NGHI: number;
  ON_OFF: number;
  OVERTIME_INFO: string;
  OVERTIME: number;
  REASON_NAME: string;
  REMARK: string;
  XACNHAN: string;
  CHECK1: string;
  CHECK2: string;
  CHECK3: string;
  IN_TIME: string;
  OUT_TIME: string;
  EARLY_IN_MINUTES: number;
  EARLY_OUT_MINUTES: number;
  LATE_IN_MINUTES: number;
  OVERTIME_MINUTES: number;
  WORKING_MINUTES: number;
  FINAL_OVERTIMES: number;
}
export interface PheDuyetNghiData {
  id: string;
  EMPL_NO: string;
  REQUEST_DATE: string;
  APPLY_DATE: string;
  REASON_CODE: number;
  REMARK: string;
  APPROVAL_STATUS: number;
  OFF_ID: number;
  CA_NGHI: number;
  CMS_ID: string;
  FIRST_NAME: string;
  MIDLAST_NAME: string;
  DOB: string;
  HOMETOWN: string;
  SEX_CODE: number;
  ADD_PROVINCE: string;
  ADD_DISTRICT: string;
  ADD_COMMUNE: string;
  ADD_VILLAGE: string;
  PHONE_NUMBER: string;
  WORK_START_DATE: string;
  PASSWORD: string;
  EMAIL: string;
  WORK_POSITION_CODE: number;
  WORK_SHIFT_CODE: number;
  POSITION_CODE: number;
  JOB_CODE: number;
  FACTORY_CODE: number;
  WORK_STATUS_CODE: number;
  ONLINE_DATETIME: string;
  SEX_NAME: string;
  SEX_NAME_KR: string;
  WORK_STATUS_NAME: string;
  WORK_STATUS_NAME_KR: string;
  FACTORY_NAME: string;
  FACTORY_NAME_KR: string;
  JOB_NAME: string;
  JOB_NAME_KR: string;
  POSITION_NAME: string;
  POSITION_NAME_KR: string;
  WORK_SHIF_NAME: string;
  WORK_SHIF_NAME_KR: string;
  SUBDEPTCODE: number;
  WORK_POSITION_NAME: string;
  WORK_POSITION_NAME_KR: string;
  ATT_GROUP_CODE: number;
  MAINDEPTCODE: number;
  SUBDEPTNAME: string;
  SUBDEPTNAME_KR: string;
  MAINDEPTNAME: string;
  MAINDEPTNAME_KR: string;
  REASON_NAME: string;
  REASON_NAME_KR: string;
  ON_OFF: string;
  OVERTIME_INFO: string;
  OVERTIME: string;
}
//quan ly phong ban nhan su
export interface MainDeptTableData {
  id: number;
  CTR_CD: string;
  MAINDEPTCODE: number;
  MAINDEPTNAME: string;
  MAINDEPTNAME_KR: string;
}
export interface SubDeptTableData {
  id: number;
  CTR_CD: string;
  MAINDEPTCODE: number;
  SUBDEPTCODE: number;
  SUBDEPTNAME: string;
  SUBDEPTNAME_KR: string;
}
export interface EmployeeTableData {
  id: string;
  EMPL_NO: string;
  CMS_ID: string;
  FIRST_NAME: string;
  MIDLAST_NAME: string;
  FULL_NAME: string;
  DOB: string;
  HOMETOWN: string;
  ADD_PROVINCE: string;
  ADD_DISTRICT: string;
  ADD_COMMUNE: string;
  ADD_VILLAGE: string;
  PHONE_NUMBER: string;
  WORK_START_DATE: string;
  PASSWORD: string;
  EMAIL: string;
  REMARK: string;
  ONLINE_DATETIME: string;
  CTR_CD: string;
  SEX_CODE: number;
  SEX_NAME: string;
  SEX_NAME_KR: string;
  WORK_STATUS_CODE: number;
  WORK_STATUS_NAME: string;
  WORK_STATUS_NAME_KR: string;
  FACTORY_CODE: number;
  FACTORY_NAME: string;
  FACTORY_NAME_KR: string;
  JOB_CODE: number;
  JOB_NAME: string;
  JOB_NAME_KR: string;
  POSITION_CODE: number;
  POSITION_NAME: string;
  POSITION_NAME_KR: string;
  WORK_SHIFT_CODE: number;
  WORK_SHIF_NAME: string;
  WORK_SHIF_NAME_KR: string;
  WORK_POSITION_CODE: number;
  WORK_POSITION_NAME: string;
  WORK_POSITION_NAME_KR: string;
  ATT_GROUP_CODE: number;
  SUBDEPTCODE: number;
  SUBDEPTNAME: string;
  SUBDEPTNAME_KR: string;
  MAINDEPTCODE: number;
  MAINDEPTNAME: string;
  MAINDEPTNAME_KR: string;
  NV_CCID: number;
  EMPL_IMAGE: string;
  RESIGN_DATE: string;
}
//CS data
export interface CSCONFIRM_DATA {
  YEAR_WEEK: string;
  CONFIRM_ID: number;
  CONFIRM_DATE: string;
  CONTACT_ID: number;
  CS_EMPL_NO: string;
  EMPL_NAME: string;
  G_CODE: string;
  G_NAME: string;
  G_NAME_KD: string;
  PROD_REQUEST_NO: string;
  CUST_CD: string;
  CUST_NAME_KD: string;
  CONTENT: string;
  INSPECT_QTY: number;
  NG_QTY: number;
  REPLACE_RATE: number;
  REDUCE_QTY: number;
  FACTOR: string;
  RESULT: string;
  CONFIRM_STATUS: string;
  REMARK: string;
  INS_DATETIME: string;
  PHANLOAI: string;
  LINK: string;
  PROD_TYPE: string;
  PROD_MODEL: string;
  PROD_PROJECT: string;
  PROD_LAST_PRICE: number;
  REDUCE_AMOUNT: number;
  NG_NHAN?: string;
  DOI_SACH?: string;
  DS_VN?: string;
  DS_KR?: string;
}
//DTC data
export interface DTC_ADD_SPEC_DATA {
  CUST_NAME_KD: string;
  G_CODE: string;
  G_NAME: string;
  TEST_CODE: number;
  POINT_CODE: number;
  TEST_NAME: string;
  POINT_NAME: string;
  PRI: number;
  CENTER_VALUE: number;
  UPPER_TOR: number;
  LOWER_TOR: number;
  BARCODE_CONTENT: string;
  REMARK: string;
  M_NAME: string;
  WIDTH_CD: number;
  M_CODE: string;
  TDS: string;
  BANVE: string;
}
export interface MaterialListData {
  M_CODE: string;
  M_NAME: string;
  WIDTH_CD: number;
}
export interface CheckAddedSPECDATA {
  TEST_CODE: number;
  TEST_NAME: string;
  CHECKADDED: number;
}
export interface DTC_REG_DATA {
  DTC_ID: number;
  FACTORY: string;
  TEST_FINISH_TIME: string;
  TEST_EMPL_NO: string;
  G_CODE: string;
  PROD_REQUEST_NO: string;
  G_NAME: string;
  TEST_NAME: string;
  TEST_TYPE_NAME: string;
  WORK_POSITION_NAME: string;
  REQUEST_DATETIME: string;
  REQUEST_EMPL_NO: string;
  M_NAME: string;
  SIZE: number;
  REMARK: string;
  LOTCMS: string;
}
export interface TestListTable {
  TEST_CODE: number;
  TEST_NAME: string;
  SELECTED?: boolean;
  CHECKADDED?: boolean;
}
export interface DTC_RESULT_INPUT {
  DTC_ID: number;
  G_CODE: string;
  M_CODE: string;
  TEST_NAME: string;
  TEST_CODE: number;
  POINT_NAME: string;
  POINT_CODE: number;
  CENTER_VALUE: number;
  UPPER_TOR: number;
  LOWER_TOR: number;
  RESULT: number;
  REMARK: number;
}
export interface DTC_DATA {
  DTC_ID: number;
  FACTORY: string;
  TEST_FINISH_TIME: string;
  TEST_EMPL_NO: string;
  G_CODE: string;
  PROD_REQUEST_NO: string;
  G_NAME: string;
  TEST_NAME: string;
  POINT_CODE: number;
  POINT_NAME: string;
  CENTER_VALUE: number;
  UPPER_TOR: number;
  LOWER_TOR: number;
  RESULT: number;
  BARCODE_CONTENT: string;
  TEST_TYPE_NAME: string;
  WORK_POSITION_NAME: string;
  SAMPLE_NO: number;
  REQUEST_DATETIME: string;
  REQUEST_EMPL_NO: string;
  M_CODE: string;
  M_NAME: string;
  SIZE: string;
  LOTCMS: string;
  TEST_CODE: number;
  TDS: string;
  TDS_EMPL: string;
  TDS_UPD_DATE: string;
}
export interface DTC_SPEC_DATA {
  CUST_NAME_KD: string;
  G_CODE: string;
  G_NAME: string;
  TEST_NAME: string;
  POINT_NAME: string;
  PRI: number;
  CENTER_VALUE: number;
  UPPER_TOR: number;
  LOWER_TOR: number;
  MIN_SPEC: number;
  MAX_SPEC: number;
  BARCODE_CONTENT: string;
  REMARK: string;
  M_NAME: string;
  WIDTH_CD: number;
  M_CODE: string;
  TDS: string;
  BANVE: string;
}
//inspection
export interface INSPECT_OUTPUT_DATA {
  INSPECT_OUTPUT_ID: string;
  CUST_NAME_KD: string;
  EMPL_NAME: string;
  G_CODE: string;
  G_NAME: string;
  PROD_TYPE: string;
  G_NAME_KD: string;
  PROD_REQUEST_NO: string;
  PROD_REQUEST_DATE: string;
  PROD_REQUEST_QTY: number;
  PROCESS_LOT_NO: string;
  M_LOT_NO: string;
  LOTNCC: string;
  PROD_DATETIME: string;
  OUTPUT_DATETIME: string;
  OUTPUT_QTY_EA: number;
  REMARK: string;
  PIC_KD: string;
  CA_LAM_VIEC: string;
  NGAY_LAM_VIEC: string;
  STATUS: string;
}
export interface INSPECT_INPUT_DATA {
  INSPECT_INPUT_ID: string;
  CUST_NAME_KD: string;
  EMPL_NAME: string;
  G_CODE: string;
  G_NAME: string;
  PROD_TYPE: string;
  G_NAME_KD: string;
  PROD_REQUEST_NO: string;
  PROD_REQUEST_DATE: string;
  PROD_REQUEST_QTY: number;
  PROCESS_LOT_NO: string;
  M_LOT_NO: string;
  LOTNCC: string;
  PROD_DATETIME: string;
  INPUT_DATETIME: string;
  INPUT_QTY_EA: number;
  INPUT_QTY_KG: number;
  REMARK: string;
  CNDB_ENCODES: string;
  PIC_KD: string;
}
export interface INSPECT_INOUT_YCSX {
  PIC_KD: string;
  CUST_NAME_KD: string;
  G_CODE: string;
  G_NAME: string;
  G_NAME_KD: string;
  PROD_REQUEST_NO: string;
  PROD_REQUEST_DATE: string;
  PROD_REQUEST_QTY: number;
  LOT_TOTAL_INPUT_QTY_EA: number;
  LOT_TOTAL_OUTPUT_QTY_EA: number;
  DA_KIEM_TRA: number;
  OK_QTY: number;
  LOSS_NG_QTY: number;
  INSPECT_BALANCE: number;
}
export interface INSPECT_NG_DATA {
  INSPECT_ID: number;
  YEAR_WEEK: string;
  CUST_NAME_KD: string;
  PROD_REQUEST_NO: string;
  G_NAME_KD: string;
  G_NAME: string;
  G_CODE: string;
  PROD_TYPE: string;
  M_LOT_NO: string;
  LOTNCC: string;
  M_NAME: string;
  WIDTH_CD: number;
  INSPECTOR: string;
  LINEQC: string;
  PROD_PIC: string;
  UNIT: string;
  PROCESS_LOT_NO: string;
  PROCESS_IN_DATE: string;
  INSPECT_DATETIME: string;
  INSPECT_START_TIME: string;
  INSPECT_FINISH_TIME: string;
  FACTORY: string;
  LINEQC_PIC: string;
  MACHINE_NO: number;
  INSPECT_TOTAL_QTY: number;
  INSPECT_OK_QTY: number;
  INSPECT_SPEED: number;
  INSPECT_TOTAL_LOSS_QTY: number;
  INSPECT_TOTAL_NG_QTY: number;
  MATERIAL_NG_QTY: number;
  PROCESS_NG_QTY: number;
  PROD_PRICE: number;
  ERR1: number;
  ERR2: number;
  ERR3: number;
  ERR4: number;
  ERR5: number;
  ERR6: number;
  ERR7: number;
  ERR8: number;
  ERR9: number;
  ERR10: number;
  ERR11: number;
  ERR12: number;
  ERR13: number;
  ERR14: number;
  ERR15: number;
  ERR16: number;
  ERR17: number;
  ERR18: number;
  ERR19: number;
  ERR20: number;
  ERR21: number;
  ERR22: number;
  ERR23: number;
  ERR24: number;
  ERR25: number;
  ERR26: number;
  ERR27: number;
  ERR28: number;
  ERR29: number;
  ERR30: number;
  ERR31: number;
  ERR32: number;
  CNDB_ENCODES: string;
}
export interface INS_STATUS {
  KHUVUC: string;
  FACTORY: string;
  EQ_NAME: string;
  EMPL_COUNT: number;
  EQ_STATUS: string;
  CURR_PLAN_ID: string;
  CURR_G_CODE: string;
  REMARK: string;
  INS_EMPL: string;
  INS_DATE: string;
  UPD_EMPL: string;
  UPD_DATE: string;
  G_NAME_KD: string;
  G_NAME: string;
  SEARCH_STRING?: string;
}
export interface InSpectionSummaryData {
  totalSheetA: number;
  totalRollB: number;
  totalNormal: number;
  totalOLED: number;
  totalUV: number;
}

//iqc data
export interface IQC_INCOMMING_DATA {
  id?: number;
  IQC1_ID: number;
  M_CODE: string;
  M_NAME: string;
  WIDTH_CD: number;
  M_LOT_NO: string;
  LOT_CMS: string;
  LOT_VENDOR: string;
  LOT_VENDOR_IQC: string;
  CUST_CD: string;
  CUST_NAME_KD: string;
  EXP_DATE: string;
  INPUT_LENGTH: number;
  TOTAL_ROLL: number;
  NQ_AQL: number;
  NQ_CHECK_ROLL: number;
  DTC_ID: number;
  TEST_EMPL: string;
  TOTAL_RESULT: string;
  AUTO_JUDGEMENT: string;
  NGOAIQUAN: string;
  KICHTHUOC: string;
  THICKNESS: string;
  DIENTRO: string;
  CANNANG: string;
  KEOKEO: string;
  KEOKEO2: string;
  FTIR: string;
  MAIMON: string;
  XRF: string;
  SCANBARCODE: string;
  PHTHALATE: string;
  MAUSAC: string;
  SHOCKNHIET: string;
  TINHDIEN: string;
  NHIETAM: string;
  TVOC: string;
  DOBONG: string;
  INS_DATE: string;
  INS_EMPL: string;
  UPD_DATE: string;
  UPD_EMPL: string;
  REMARK: string;
  IQC_TEST_RESULT: string;
  DTC_RESULT: string;
  M_THICKNESS: number;
  M_THICKNESS_UPPER: number;
  M_THICKNESS_LOWER: number;
  M_WIDTH: number;
}
export interface HOLDING_DATA {
  HOLD_ID: number;
  ID: number;
  HOLDING_MONTH: string;
  FACTORY: string;
  WAHS_CD: string;
  LOC_CD: string;
  M_LOT_NO: string;
  M_CODE: string;
  M_NAME: string;
  WIDTH_CD: number;
  HOLDING_ROLL_QTY: number;
  HOLDING_QTY: number;
  HOLDING_TOTAL_QTY: number;
  HOLDING_IN_DATE: string;
  HOLDING_OUT_DATE: string;
  VENDOR_LOT: string;
  USE_YN: string;
  INS_DATE: string;
  INS_EMPL: string;
  UPD_DATE: string;
  UPD_EMPL: string;
  QC_PASS: string;
  QC_PASS_DATE: string;
  QC_PASS_EMPL: string;
  PROCESS_STATUS: string;
  PROCESS_DATE: string;
  PROCESS_EMPL: string;
  REASON: string;
  NCR_ID: number;
}
export interface QC_FAIL_DATA {
  id?: number;
  FACTORY: string;
  PLAN_ID_SUDUNG: string;
  G_NAME: string;
  G_CODE: string;
  LIEUQL_SX: number;
  M_CODE: string;
  M_LOT_NO: string;
  VENDOR_LOT: string;
  M_NAME: string;
  WIDTH_CD: number;
  ROLL_QTY: number;
  IN_QTY: number;
  TOTAL_IN_QTY: number;
  USE_YN: string;
  PQC3_ID: number;
  DEFECT_PHENOMENON: string;
  SX_DEFECT: string;
  OUT_DATE: string;
  INS_EMPL?: string;
  INS_DATE: string;
  UPD_EMPL: string;
  UPD_DATE: string;
  PHANLOAI: string;
  QC_PASS: string;
  QC_PASS_DATE: string;
  QC_PASS_EMPL: string;
  REMARK: string;
  IN1_EMPL: string;
  IN2_EMPL: string;
  OUT1_EMPL: string;
  OUT2_EMPL: string;
  OUT_PLAN_ID: string;
  IN_CUST_CD: string;
  OUT_CUST_CD: string;
  IN_CUST_NAME: string;
  OUT_CUST_NAME: string;
  REMARK_OUT: string;
  FAIL_ID: number;
  NCR_ID: number;
  PROCESS_LOT_NO: string;
}
//error table
export interface ERROR_TABLE {
  ERR_CODE: string;
  ERR_NAME_VN: string;
  ERR_NAME_KR: string;
  ERR_TYPE: string;
}
//pqc data
export interface PQC1_DATA {
  CUST_NAME_KD?: string;
  PQC1_ID: string;
  YEAR_WEEK: string;
  PROD_REQUEST_NO: string;
  PROD_REQUEST_QTY: number;
  PROD_REQUEST_DATE: string;
  PLAN_ID: string;
  PROCESS_LOT_NO: string;
  G_NAME: string;
  G_NAME_KD: string;
  LINEQC_PIC: string;
  PROD_PIC: string;
  PROD_LEADER: string;
  LINE_NO: string;
  STEPS: string;
  CAVITY: number;
  SETTING_OK_TIME: string;
  FACTORY: string;
  INSPECT_SAMPLE_QTY: number;
  PROD_LAST_PRICE: number;
  SAMPLE_AMOUNT: number;
  REMARK: string;
  INS_DATE: string;
  UPD_DATE: string;
}

export interface TRA_PQC1_DATA {
  PQC1_ID: string;
  YEAR_WEEK: string;
  PROD_REQUEST_NO: string;
  PROD_REQUEST_QTY: number;
  PROD_REQUEST_DATE: string;
  PLAN_ID: string;
  PROCESS_LOT_NO: string;
  G_NAME: string;
  G_NAME_KD: string;
  LINEQC_PIC: string;
  PROD_PIC: string;
  PROD_LEADER: string;
  LINE_NO: string;
  STEPS: string;
  CAVITY: number;
  SETTING_OK_TIME: string;
  FACTORY: string;
  INSPECT_SAMPLE_QTY: number;
  PROD_LAST_PRICE: number;
  SAMPLE_AMOUNT: number;
  REMARK: string;
  INS_DATE: string;
  UPD_DATE: string;
  PQC3_ID: string;
  OCCURR_TIME: string;
  INSPECT_QTY: number;
  DEFECT_QTY: number;
  DEFECT_RATE: number;
  DEFECT_PHENOMENON: number;
  IMG_1: string;
  IMG_2: string;
  IMG_3: string;
}
export interface PQC3_DATA {
  YEAR_WEEK: string;
  PQC3_ID: number;
  PQC1_ID: number;
  CUST_NAME_KD: string;
  FACTORY: string;
  PROD_REQUEST_NO: string;
  PROD_REQUEST_DATE: string;
  PROCESS_LOT_NO: string;
  G_CODE: string;
  G_NAME: string;
  G_NAME_KD: string;
  PROD_LAST_PRICE: number;
  LINEQC_PIC: string;
  PROD_PIC: string;
  PROD_LEADER: string;
  LINE_NO: string;
  OCCURR_TIME: string;
  INSPECT_QTY: number;
  DEFECT_QTY: number;
  DEFECT_AMOUNT: number;
  DEFECT_PHENOMENON: string;
  DEFECT_IMAGE_LINK: string;
  REMARK: string;
  WORST5: string;
  WORST5_MONTH: string;
  ERR_CODE: string;
  NG_NHAN?: string;
  DOI_SACH?: string;
  STATUS?: string;
}
export interface DAO_FILM_DATA {
  KNIFE_FILM_ID: string;
  FACTORY_NAME: number;
  NGAYBANGIAO: number;
  G_CODE: string;
  G_NAME: string;
  LOAIBANGIAO_PDP: string;
  LOAIPHATHANH: string;
  SOLUONG: string;
  SOLUONGOHP: string;
  LYDOBANGIAO: string;
  PQC_EMPL_NO: number;
  RND_EMPL_NO: string;
  SX_EMPL_NO: string;
  MA_DAO: string;
  REMARK: number;
  CFM_GIAONHAN: number;
  CFM_INS_EMPL: string;
  CFM_DATE: string;
  KNIFE_TYPE: string;
  KNIFE_FILM_STATUS: string;
  G_WIDTH: number;
  G_LENGTH: number;
  VENDOR: string;
  TOTAL_PRESS: number;
}
export interface CNDB_DATA {
  CNDB_DATE: string;
  CNDB_NO: string;
  CNDB_ENCODE: string;
  M_NAME: string;
  DEFECT_NAME: string;
  DEFECT_CONTENT: string;
  REG_EMPL_NO: string;
  REMARK: string;
  M_NAME2: string;
  INS_DATE: string;
  APPROVAL_STATUS: string;
  APPROVAL_EMPL: string;
  APPROVAL_DATE: string;
  G_CODE: string;
  G_NAME: string;
}

// kho lieu
export interface NHAPLIEUDATA {
  M_LOT_NO: string;
  LOTNCC: string;
  M_CODE: string;
  M_NAME: string;
  WIDTH_CD: number;
  IN_CFM_QTY: number;
  ROLL_QTY: number;
  TOTAL_IN_QTY: number;
  INS_DATE: string;
  CUST_NAME_KD: string;
  QC_PASS: string;
  QC_PASS_EMPL: string;
  QC_PASS_DATE: string;
  EXP_DATE: string;
  INVOICE: string;
  LOC_CD: string;
  FACTORY: string;
}
export interface XUATLIEUDATA {
  G_CODE: string;
  G_NAME: string;
  PROD_REQUEST_NO: string;
  PLAN_ID: string;
  M_CODE: string;
  M_NAME: string;
  WIDTH_CD: number;
  LOTNCC: string;
  M_LOT_NO: string;
  OUT_CFM_QTY: number;
  ROLL_QTY: number;
  TOTAL_OUT_QTY: number;
  INS_DATE: string;
}
export interface TONLIEUDATA {
  M_CODE: string;
  M_NAME: string;
  WIDTH_CD: number;
  TON_NM1: number;
  TON_NM2: number;
  HOLDING_NM1: number;
  HOLDING_NM2: number;
  TOTAL_OK: number;
  TOTAL_HOLDING: number;
  TDS: string;
}
//kho tp
export interface WH_IN_OUT {
  Product_MaVach: string;
  G_NAME: string;
  G_NAME_KD: string;
  Customer_ShortName: string;
  IO_Date: string;
  INPUT_DATETIME: string;
  IO_Shift: string;
  IO_Type: string;
  IO_Qty: number;
  CUST_NAME_KD: string;
  IO_Note: string;
  IO_Number: string;
}
export interface TONKIEMGOP_CMS {
  G_CODE: string;
  G_NAME: string;
  G_NAME_KD: string;
  CHO_KIEM: number;
  CHO_CS_CHECK: number;
  CHO_KIEM_RMA: number;
  TONG_TON_KIEM: number;
  BTP: number;
  TON_TP: number;
  PENDINGXK: number;
  TON_TPTT: number;
  BLOCK_QTY: number;
  GRAND_TOTAL_STOCK: number;
}
export interface TONKIEMGOP_KD {
  G_NAME_KD: string;
  CHO_KIEM: number;
  CHO_CS_CHECK: number;
  CHO_KIEM_RMA: number;
  TONG_TON_KIEM: number;
  BTP: number;
  TON_TP: number;
  BLOCK_QTY: number;
  GRAND_TOTAL_STOCK: number;
}
export interface TONKIEMTACH {
  KHO_NAME: string;
  LC_NAME: string;
  G_CODE: string;
  G_NAME: string;
  G_NAME_KD: string;
  NHAPKHO: number;
  XUATKHO: number;
  TONKHO: number;
  BLOCK_QTY: number;
  GRAND_TOTAL_TP: number;
}
//kho tp new
export interface KTP_IN {
  IN_DATE: string;
  FACTORY: string;
  AUTO_ID: string;
  INSPECT_OUTPUT_ID: string;
  PACK_ID: string;
  EMPL_NAME: string;
  PROD_REQUEST_NO: string;
  CUST_NAME_KD: string;
  G_CODE: string;
  G_NAME: string;
  G_NAME_KD: string;
  PROD_TYPE: string;
  PLAN_ID: string;
  IN_QTY: number;
  USE_YN: string;
  EMPL_GIAO: string;
  EMPL_NHAN: string;
  INS_DATE: string;
  INS_EMPL: string;
  UPD_DATE: string;
  UPD_EMPL: string;
  STATUS: string;
  REMARK: string;
}
export interface KTP_OUT {
  OUT_DATE: string;
  FACTORY: string;
  AUTO_ID: string;
  INSPECT_OUTPUT_ID: string;
  PACK_ID: string;
  EMPL_NAME: string;
  PROD_REQUEST_NO: string;
  G_CODE: string;
  G_NAME: string;
  G_NAME_KD: string;
  PROD_TYPE: string;
  PLAN_ID: string;
  CUST_CD: string;
  OUT_QTY: number;
  CUST_NAME_KD: string;
  OUT_TYPE: string;
  USE_YN: string;
  INS_DATE: string;
  INS_EMPL: string;
  UPD_DATE: string;
  UPD_EMPL: string;
  STATUS: string;
  REMARK: string;
  AUTO_ID_IN: string;
  OUT_PRT_SEQ: string;
  PO_NO: string;
}
export interface STOCK_G_CODE {
  G_CODE: string;
  G_NAME: string;
  G_NAME_KD: string;
  PROD_TYPE: string;
  STOCK: number;
  BLOCK_QTY: number;
  TOTAL_STOCK: number;
}
export interface STOCK_G_NAME_KD {
  G_NAME_KD: string;
  PROD_TYPE: string;
  STOCK: number;
  BLOCK_QTY: number;
  TOTAL_STOCK: number;
}
export interface STOCK_PROD_REQUEST_NO {
  CUST_NAME_KD: string;
  PROD_REQUEST_NO: string;
  G_CODE: string;
  G_NAME: string;
  G_NAME_KD: string;
  PROD_TYPE: string;
  STOCK: number;
  BLOCK_QTY: string;
  TOTAL_STOCK: string;
}
//rnd bom amazon
export interface CODE_INFO {
  id: number;
  G_CODE: string;
  G_NAME: string;
  G_NAME_KD: string;
  PROD_TYPE: string;
  PROD_LAST_PRICE: number;
  PD: number;
  CAVITY: number;
  PACKING_QTY: number;
  G_WIDTH: number;
  G_LENGTH: number;
  PROD_PROJECT: string;
  PROD_MODEL: string;
  M_NAME_FULLBOM: string;
  BANVE: string;
  NO_INSPECTION: string;
  USE_YN: string;
}
export interface CODE_FULL_INFO {
  CUST_CD?: string;
  PROD_PROJECT?: string;
  PROD_MODEL?: string;
  CODE_12: string;
  PROD_TYPE: string;
  G_NAME_KD?: string;
  DESCR?: string;
  PROD_MAIN_MATERIAL?: string;
  G_NAME?: string;
  G_LENGTH?: number;
  G_WIDTH?: number;
  PD?: number;
  G_C?: number;
  G_C_R?: number;
  G_CG?: number;
  G_LG?: number;
  G_SG_L?: number;
  G_SG_R?: number;
  PACK_DRT?: string;
  KNIFE_TYPE?: number;
  KNIFE_LIFECYCLE?: number;
  KNIFE_PRICE?: number;
  CODE_33?: string;
  ROLE_EA_QTY?: number;
  RPM?: number;
  PIN_DISTANCE?: number;
  PROCESS_TYPE?: string;
  EQ1?: string;
  EQ2?: string;
  PROD_DIECUT_STEP?: number;
  PROD_PRINT_TIMES?: number;
  REMK?: string;
  USE_YN?: string;
  G_CODE: string;
  CUST_NAME?: string;
  EQ3?: string;
  EQ4?: string;
  PO_TYPE?: string;
  FSC?: string;
  FSC_CODE?: string;
  PROD_DVT?: string;
  id?: number;
  PROD_LAST_PRICE?: number;
  CAVITY?: number;
  PACKING_QTY?: number;
  M_NAME_FULLBOM?: string;
  BANVE?: string;
  NO_INSPECTION?: string;
  PDBV?: string;
  FACTORY?: string;
  Setting1?: string;
  Setting2?: string;
  Setting3?: string;
  Setting4?: string;
  UPH1?: number;
  UPH2?: number;
  UPH3?: number;
  UPH4?: number;
  Step1?: number;
  Step2?: number;
  Step3?: number;
  Step4?: number;
  LOSS_SX1?: number;
  LOSS_SX2?: number;
  LOSS_SX3?: number;
  LOSS_SX4?: number;
  LOSS_SETTING1?: number;
  LOSS_SETTING2?: number;
  LOSS_SETTING3?: number;
  LOSS_SETTING4?: number;
  LOSS_ST_SX1?: number;
  LOSS_ST_SX2?: number;
  LOSS_ST_SX3?: number;
  LOSS_ST_SX4?: number;
  LOSS_KT?: number;
  NOTE?: string;
  BEP?: number;
  QL_HSD?: string;
  EXP_DATE?: string;
  APPSHEET?: string;
  PD_HSD?: string;
  UPD_COUNT?: number;
  UPD_DATE?: string;
  UPD_EMPL?: string;
  UPDATE_REASON?: string;
  APPROVED_YN?: string;
}
export interface LIST_BOM_AMAZON {
  id: string;
  G_CODE: string;
  G_NAME?: string;
  G_NAME_KD?: string;
}
export interface BOM_AMAZON {
  id: string;
  G_CODE?: string;
  G_NAME?: string;
  G_CODE_MAU?: string;
  TEN_MAU?: string;
  DOITUONG_NO?: string;
  DOITUONG_NAME?: string;
  GIATRI?: string;
  REMARK?: string;
  AMZ_COUNTRY?: string;
  AMZ_PROD_NAME?: string;
}
export interface CODEPHOI {
  G_CODE_MAU: string;
  G_NAME: string;
}
//rnd bom manager
export interface BOM_SX {
  id: string;
  G_CODE?: string;
  G_NAME?: string;
  G_NAME_KD?: string;
  RIV_NO?: string;
  M_CODE?: string;
  M_NAME?: string;
  WIDTH_CD?: number;
  M_QTY?: number;
  MAIN_M: string;
  LIEUQL_SX: number;
  INS_EMPL?: string;
  INS_DATE?: string;
  UPD_EMPL?: string;
  UPD_DATE?: string;
}
export interface BOM_GIA {
  id: string;
  BOM_ID?: string;
  G_CODE?: string;
  RIV_NO?: string;
  G_SEQ?: string;
  CATEGORY?: number;
  M_CODE?: string;
  M_CODE_SX?: string;
  M_NAME?: string;
  CUST_CD?: string;
  IMPORT_CAT?: string;
  M_CMS_PRICE: number;
  M_SS_PRICE: number;
  M_SLITTING_PRICE?: number;
  USAGE?: string;
  MAIN_M: number;
  MAT_MASTER_WIDTH?: number;
  MAT_CUTWIDTH?: number;
  MAT_ROLL_LENGTH?: number;
  MAT_THICKNESS?: number;
  M_QTY?: number;
  REMARK?: string;
  PROCESS_ORDER?: number;
  INS_EMPL?: string;
  UPD_EMPL?: string;
  INS_DATE?: string;
  UPD_DATE?: string;
}
export interface MATERIAL_INFO {
  M_ID: number;
  M_NAME: string;
  CUST_CD: string;
  SSPRICE: number;
  CMSPRICE: number;
  SLITTING_PRICE: number;
  MASTER_WIDTH: number;
  ROLL_LENGTH: number;
}
export interface M_NAME_LIST {
  M_NAME: string;
}
export interface COMPONENT_DATA {
  G_CODE_MAU: string;
  DOITUONG_NO: number;
  DOITUONG_NAME: string;
  PHANLOAI_DT: string;
  DOITUONG_STT: string;
  CAVITY_PRINT: number;
  GIATRI: string;
  FONT_NAME: string;
  FONT_SIZE: number;
  FONT_STYLE: string;
  POS_X: number;
  POS_Y: number;
  SIZE_W: number;
  SIZE_H: number;
  ROTATE: number;
  REMARK: string;
  COLOR?: string;
  INS_DATE?: string;
  INS_EMPL?: string;
  UPD_DATE?: string;
  UPD_EMPL?: string;
}
export interface POINT_DATA {
  x: number;
  y: number;
}
export interface BARCODE_DATA {
  G_CODE: string;
  G_NAME: string;
  BARCODE_STT: string;
  BARCODE_TYPE: string;
  BARCODE_RND: string;
  BARCODE_INSP: string;
  BARCODE_RELI: string;
  STATUS: string;
  SX_STATUS: string;
}
//quan ly giao nhan film data
export interface HANDOVER_DATA {
  KNIFE_FILM_ID: string;
  FACTORY_NAME: string;
  NGAYBANGIAO: string;
  G_CODE: string;
  G_NAME: string;
  PROD_TYPE: string;
  CUST_NAME_KD: string;
  LOAIBANGIAO_PDP: string;
  LOAIPHATHANH: string;
  SOLUONG: number;
  SOLUONGOHP: number;
  LYDOBANGIAO: string;
  PQC_EMPL_NO: string;
  RND_EMPL_NO: string;
  SX_EMPL_NO: string;
  REMARK: string;
  CFM_GIAONHAN: string;
  CFM_INS_EMPL: string;
  CFM_DATE: string;
  KNIFE_FILM_STATUS: string;
  MA_DAO: string;
  TOTAL_PRESS: number;
  CUST_CD: string;
  KNIFE_TYPE: string;
}

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
//tinh hinh chot bao cao
export interface TINH_HINH_CHOT_BC {
  SX_DATE: string;
  TOTAL: number;
  DA_CHOT: number;
  CHUA_CHOT: number;
  DA_NHAP_HIEUSUAT: number;
  CHUA_NHAP_HIEUSUAT: number;
}
//tinh hinh cuon lieu
export interface MATERIAL_STATUS {
  FIRST_INPUT_DATE: string;
  INS_DATE: string;
  FACTORY: string;
  M_LOT_NO: string;
  M_CODE: string;
  M_NAME: string;
  WIDTH_CD: number;
  ROLL_QTY: number;
  OUT_CFM_QTY: number;
  TOTAL_OUT_QTY: number;
  PROD_REQUEST_NO: string;
  PLAN_ID: string;
  PLAN_EQ: string;
  G_CODE: string;
  G_NAME: string;
  XUAT_KHO: string;
  VAO_FR: string;
  VAO_SR: string;
  VAO_DC: string;
  VAO_ED: string;
  CONFIRM_GIAONHAN: string;
  VAO_KIEM: string;
  NHATKY_KT: string;
  RA_KIEM: string;
  INSPECT_TOTAL_QTY: number;
  INSPECT_OK_QTY: number;
  INS_OUT: number;
  ROLL_LOSS_KT: number;
  ROLL_LOSS: number;
  PD: number;
  CAVITY: number;
  FR_RESULT: number;
  SR_RESULT: number;
  DC_RESULT: number;
  ED_RESULT: number;
  TOTAL_OUT_EA: number;
  FR_EA: number;
  SR_EA: number;
  DC_EA: number;
  ED_EA: number;
  INSPECT_TOTAL_EA: number;
  INSPECT_OK_EA: number;
  INS_OUTPUT_EA: number;
  CUST_NAME_KD?: string;
}
export interface LOSS_TABLE_DATA_ROLL {
  XUATKHO_MET: number;
  INSPECTION_INPUT: number;
  INSPECTION_OK: number;
  INSPECTION_OUTPUT: number;
  TOTAL_LOSS_KT: number;
  TOTAL_LOSS: number;
}
//chart
export interface YearlyClosingData {
  YEAR_NUM: string;
  DELIVERY_QTY: number;
  DELIVERED_AMOUNT: number;
  KPI_VALUE?: number;
}
export interface MaterialPOData {
  CUST_CD: string;
  CUST_NAME_KD: string;
  G_CODE: string;
  G_NAME_KD: string;
  M_CODE: string;
  M_NAME: string;
  WIDTH_CD: number;
  PO_NO: string;
  PO_QTY: number;
  DELIVERY_QTY: number;
  PO_BALANCE: number;
  PD: number;
  CAVITY_COT: number;
  CAVITY_HANG: number;
  CAVITY: number;
  NEED_M_QTY: number;
}
export interface MaterialPOSumData {
  M_CODE: string;
  M_NAME: string;
  WIDTH_CD: number;
  STOCK_M: number;
  HOLDING_M: number;
  NEED_M_QTY: number;
  M_SHORTAGE: number;
}
export interface DiemDanhMainDeptData {
  id: number;
  MAINDEPTNAME: string;
  COUNT_TOTAL: number;
  COUT_ON: number;
  COUT_OFF: number;
  COUNT_CDD: number;
  ON_RATE: number;
}
export interface SamSungFCSTData {
  WEEKNO: string;
  SEVT1: number;
  SEV1: number;
  SAMSUNG_ASIA1: number;
  TT_SS1: number;
  SEVT2: number;
  SEV2: number;
  SAMSUNG_ASIA2: number;
  TT_SS2: number;
}
export interface WeeklyClosingData {
  EMPL_NAME: string;
  DELIVERY_AMOUNT: number;
}
export interface WeeklyClosingData {
  DEL_WEEK: string;
  DELIVERY_QTY: number;
  DELIVERED_AMOUNT: number;
}
export interface DailyPPMData {
  INSPECT_DATE?: string;
  INSPECT_TOTAL_QTY?: number;
  MATERIAL_NG?: number;
  PROCESS_NG?: number;
  TOTAL_NG?: number;
  TOTAL_PPM?: number;
  MATERIAL_PPM?: number;
  PROCESS_PPM?: number;
  KPI_VALUE?: number;
}
export interface PPMData {
  INSPECT_DATE?: string;
  YEAR_WEEK?: number;
  YEAR_NUM?: number;
  WEEK_NUM?: number;
  YEAR_MONTH?: string;
  MONTH_NUM?: number;
  INSPECT_TOTAL_QTY?: number;
  MATERIAL_NG?: number;
  PROCESS_NG?: number;
  TOTAL_NG?: number;
  TOTAL_PPM?: number;
  MATERIAL_PPM?: number;
  PROCESS_PPM?: number;
}
export interface DailyData {
  dldata?: DailyPPMData[];
  processColor?: string;
  materialColor?: string;
}
export interface FcostData {
  dldata?: InspectSummary[];
  dlppmdata?: PPMData[];
  processColor?: string;
  materialColor?: string;
}
export interface NguoiHangData {
  dldata?: TREND_NGUOI_HANG_DATA[];
  processColor?: string;
  materialColor?: string;
}
export interface MonthlyPPMData {
  YEAR_MONTH?: string;
  YEAR_NUM?: number;
  MONTH_NUM?: number;
  INSPECT_TOTAL_QTY?: number;
  MATERIAL_NG?: number;
  PROCESS_NG?: number;
  TOTAL_NG?: number;
  TOTAL_PPM?: number;
  MATERIAL_PPM?: number;
  PROCESS_PPM?: number;
  KPI_VALUE?: number;
}
export interface MonthlyData {
  dldata?: MonthlyPPMData[];
  processColor?: string;
  materialColor?: string;
}
export interface WeeklyPPMData {
  YEAR_WEEK?: number;
  YEAR_NUM?: number;
  WEEK_NUM?: number;
  INSPECT_TOTAL_QTY?: number;
  MATERIAL_NG?: number;
  PROCESS_NG?: number;
  TOTAL_NG?: number;
  TOTAL_PPM?: number;
  MATERIAL_PPM?: number;
  PROCESS_PPM?: number;
  KPI_VALUE?: number;
}
export interface WeeklyData {
  dldata?: WeeklyPPMData[];
  processColor?: string;
  materialColor?: string;
}
export interface YearlyPPMData {
  YEAR_NUM?: number;
  INSPECT_TOTAL_QTY?: number;
  MATERIAL_NG?: number;
  PROCESS_NG?: number;
  TOTAL_NG?: number;
  TOTAL_PPM?: number;
  MATERIAL_PPM?: number;
  PROCESS_PPM?: number;
  KPI_VALUE?: number;
}
export interface YearlyData {
  dldata?: YearlyPPMData[];
  processColor?: string;
  materialColor?: string;
}
export interface FCSTAmountData {
  FCSTYEAR: number;
  FCSTWEEKNO: number;
  FCST4W_QTY: number;
  FCST4W_AMOUNT: number;
  FCST8W_QTY: number;
  FCST8W_AMOUNT: number;
}
export interface WorstData {
  ERR_CODE: string;
  ERR_NAME_VN: string;
  ERR_NAME_KR: string;
  NG_QTY: number;
  NG_AMOUNT: number;
  id: number;
}
export interface WorstCodeData {
  G_CODE: string;
  G_NAME_KD: string;
  INSPECT_TOTAL_QTY: number;
  NG_QTY: number;
  NG_AMOUNT: number;
  id: number;
}
export interface WidgetData_POBalanceSummary {
  po_balance_qty: number;
  po_balance_amount: number;
}
export interface InspectSummary {
  INSPECT_DATE?: string;
  INSPECT_YEAR?: string;
  INSPECT_YM?: string;
  INSPECT_YW?: string;
  INSPECT_MONTH?: string;
  INSPECT_WEEK?: string;
  ISP_TT_QTY: number;
  INSP_OK_QTY: number;
  M_NG_QTY: number;
  P_NG_QTY: number;
  T_NG_QTY: number;
  ISP_TT_AMOUNT: number;
  INSP_OK_AMOUNT: number;
  M_NG_AMOUNT: number;
  P_NG_AMOUNT: number;
  T_NG_AMOUNT: number;
  M_RATE: number;
  P_RATE: number;
  T_RATE: number;
  M_A_RATE: number;
  P_A_RATE: number;
  T_A_RATE: number;
  KPI_VALUE?: number;
}



export interface OQC_DATA {
  OQC_ID: number;
  DELIVERY_DATE: string;
  SHIFT_CODE: string;
  FACTORY_NAME: string;
  FULL_NAME: string;
  CUST_NAME_KD: string;
  PROD_REQUEST_NO: string;
  PROCESS_LOT_NO: string;
  M_LOT_NO: string;
  LOTNCC: string;
  LABEL_ID: string;
  PROD_REQUEST_DATE: string;
  PROD_REQUEST_QTY: number;
  G_CODE: string;
  G_NAME: string;
  G_NAME_KD: string;
  DELIVERY_QTY: number;
  SAMPLE_QTY: number;
  SAMPLE_NG_QTY: number;
  PROD_LAST_PRICE: number;
  DELIVERY_AMOUNT: number;
  SAMPLE_NG_AMOUNT: number;
  REMARK: string;
  RUNNING_COUNT: number;
}
export interface CS_RMA_DATA {
  RMA_ID: number;
  CONFIRM_ID: number;
  G_NAME_KD: string;
  RETURN_DATE: string;
  PROD_REQUEST_NO: string;
  G_CODE: string;
  RMA_TYPE: string;
  RMA_EMPL_NO: string;
  INS_DATETIME: string;
  FACTORY: string;
  RETURN_QTY: number;
  SORTING_OK_QTY: number;
  SORTING_NG_QTY: number;
  RMA_DELIVERY_QTY: number;
  PROD_LAST_PRICE: number;
  RETURN_AMOUNT: number;
  SORTING_OK_AMOUNT: number;
  SORTING_NG_AMOUNT: number;
  G_NAME: string;
  PROD_TYPE: string;
  PROD_MODEL: string;
  CONFIRM_DATE: string;
  CS_EMPL_NO: string;
  CONTENT: string;
  INSPECT_QTY: number;
  NG_QTY: number;
  REPLACE_RATE: number;
  REDUCE_QTY: number;
}
export interface CS_CNDB_DATA {
  SA_ID: number;
  SA_REQUEST_DATE: string;
  CONTACT_ID: number;
  CS_EMPL_NO: string;
  G_CODE: string;
  G_NAME: string;
  CUST_NAME_KD: string;
  PROD_REQUEST_NO: string;
  REQUEST_DATETIME: string;
  CONTENT: string;
  SA_QTY: number;
  RESULT: string;
  SA_STATUS: string;
  SA_REMARK: string;
  INS_DATETIME: string;
  SA_CUST_CD: string;
}
export interface CS_TAXI_DATA {
  TAXI_ID: number;
  CONFIRM_ID: number;
  SA_ID: number;
  CHIEU: number;
  CONG_VIEC: string;
  TAXI_DATE: string;
  TAXI_SHIFT: string;
  CS_EMPL_NO: string;
  DIEM_DI: string;
  DIEM_DEN: string;
  TAXI_AMOUNT: number;
  TRANSPORTATION: string;
  TAXI_REMARK: string;
  INS_DATETIME: string;
}
export interface INSP_PATROL_DATA {
  INS_PATROL_ID: number;
  PROD_REQUEST_NO: string;
  PLAN_ID: string;
  PROCESS_LOT_NO: string;
  G_CODE: string;
  ERR_CODE: string;
  INSPECT_QTY: number;
  DEFECT_QTY: number;
  DEFECT_PHENOMENON: string;
  DEFECT_IMAGE_LINK: string;
  LINEQC_PIC: string;
  PROD_PIC: string;
  INSP_PIC: string;
  INS_DATE: string;
  INS_EMPL: string;
  UPD_DATE: string;
  UPD_EMPL: string;
  PHANLOAI: string;
  REMARK: string;
  G_NAME_KD: string;
  CUST_NAME_KD: string;
  EQUIPMENT_CD: string;
  FACTORY: string;
  OCCURR_TIME: string;
}
export interface DTC_PATROL_DATA {
  CTR_CD: string;
  PATROL_ID: number;
  DTC_ID: number;
  TEST_CODE: number;
  TEST_TYPE_CODE: string;
  DEFECT_PHENOMENON: string;
  DEFECT_IMAGE_LINK: string;
  INS_DATE: string;
  INS_EMPL: string;
  UPD_DATE: string;
  UPD_EMPL: string;
  FILE_: string;
  G_NAME_KD: string;
  G_NAME: string;
  M_NAME: string;
  WIDTH_CD: number;
  TEST_TYPE_NAME: string;
  TEST_NAME: string;
  G_CODE: string;
  M_LOT_NO: string;
  M_CODE: string;
  WORK_POSITION_CODE: string;
  WORK_POSITION_NAME: string;
  CUST_NAME_KD: string;
  VENDOR: string;
  M_FACTORY: string;
  FACTORY: string;
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
export interface CHO_KIEM_DATA {
  G_CODE: string;
  G_NAME: string;
  G_NAME_KD: string;
  INSPECT_BALANCE_QTY: number;
  WAIT_CS_QTY: number;
  WAIT_SORTING_RMA: number;
  TOTAL_WAIT: number;
}
export interface WH_M_INPUT_DATA {
  id: string;
  CUST_CD: string;
  CUST_NAME_KD: string;
  M_NAME: string;
  M_CODE: string;
  WIDTH_CD: number;
  LOT_QTY: number;
  MET_PER_ROLL: number;
  ROLL_PER_LOT: number;
  INVOICE_NO: string;
  REMARK: string;
  EXP_DATE: string;
  PROD_REQUEST_NO: string;
}
export interface WH_M_OUTPUT_DATA {
  id: string;
  M_CODE: string;
  M_NAME: string;
  WIDTH_CD: number;
  M_LOT_NO: string;
  ROLL_QTY: number;
  UNIT_QTY: number;
  TOTAL_QTY: number;
  WAHS_CD: string;
  LOC_CD: string;
  LIEUQL_SX: number;
  OUT_DATE: string;
  OUT_NO: string;
  OUT_SEQ: string;
  IN_DATE: string;
  USE_YN: string;
  FSC_O302: string;
  FSC_MCODE: string;
  FSC_GCODE: string;
}
export interface DKXL_DATA {
  OUT_DATE: string;
  OUT_NO: string;
  OUT_SEQ: string;
  CODE_03: string;
  M_CODE: string;
  M_NAME: string;
  WIDTH_CD: number;
  OUT_PRE_QTY: number;
  OUT_CFM_QTY: number;
  REMK: string;
  USE_YN: string;
  INS_DATE: string;
  INS_EMPL: string;
  UPD_DATE: string;
  UPD_EMPL: string;
  FACTORY: string;
  CUST_CD: string;
  TOTAL_ROLL_QTY: number;
  PLAN_ID: string;
  PLAN_ID2: string;
}
export interface XUATPACK_DATA {
  G_CODE: string;
  G_NAME: string;
  G_NAME_KD: string;
  PROD_MODEL: string;
  OutID: string;
  CUST_NAME_KD: string;
  Customer_SortName: string;
  OUT_DATE: string;
  OUT_DATETIME: string;
  Out_Qty: number;
  SX_DATE: string;
  INSPECT_LOT_NO: string;
  PROCESS_LOT_NO: string;
  M_LOT_NO: string;
  LOTNCC: string;
  M_NAME: string;
  WIDTH_CD: number;
  SX_EMPL: string;
  LINEQC_EMPL: string;
  INSPECT_EMPL: string;
  EXP_DATE: string;
  Outtype: string;
}
export interface DEFECT_TRENDING_DATA {
  INSPECT_DATE?: string;
  INSPECT_YW?: string;
  INSPECT_YM?: string;
  INSPECT_YEAR?: number;
  INSPECT_MONTH?: number;
  INSPECT_WEEK?: number;
  INSPECT_TOTAL_QTY: number;
  INSPECT_OK_QTY: number;
  INSPECT_NG_QTY: number;
  ERR1: number;
  ERR2: number;
  ERR3: number;
  ERR4: number;
  ERR5: number;
  ERR6: number;
  ERR7: number;
  ERR8: number;
  ERR9: number;
  ERR10: number;
  ERR11: number;
  ERR12: number;
  ERR13: number;
  ERR14: number;
  ERR15: number;
  ERR16: number;
  ERR17: number;
  ERR18: number;
  ERR19: number;
  ERR20: number;
  ERR21: number;
  ERR22: number;
  ERR23: number;
  ERR24: number;
  ERR25: number;
  ERR26: number;
  ERR27: number;
  ERR28: number;
  ERR29: number;
  ERR30: number;
  ERR31: number;
  ERR32: number;
}
export interface INSPECT_PATROL {
  INS_PATROL_ID: number;
  PROD_REQUEST_NO: string;
  PLAN_ID: string;
  PROCESS_LOT_NO: string;
  G_CODE: string;
  ERR_CODE: string;
  INSPECT_QTY: number;
  DEFECT_QTY: number;
  DEFECT_PHENOMENON: string;
  LINEQC_PIC: string;
  INSP_PIC: string;
  PROD_PIC: string;
  INS_DATE: string;
  PHANLOAI: string;
  REMARK: string;
  OCCURR_TIME: string;
  LABEL_ID: string;
  EQUIPMENT_CD: string;
  CUST_CD: string;
  FACTORY: string;
  G_NAME: string;
  G_NAME_KD: string;
  CUST_NAME_KD: string;
}
export interface PQC_PPM_DATA {
  SETTING_DATE?: string;
  SETTING_YEAR?: string;
  SETTING_YM?: string;
  SETTING_YW?: string;
  TOTAL_LOT: number;
  OK_LOT: number;
  NG_LOT: number;
  INSPECT_AMOUNT: number;
  NG_RATE: number;
  KPI_VALUE?: number;
}
export interface OQC_TREND_DATA {
  DELIVERY_DATE?: string;
  DELIVERY_YEAR?: string;
  DELIVERY_YM?: string;
  DELIVERY_YW?: string;
  TOTAL_LOT: number;
  OK_LOT: number;
  NG_LOT: number;
  NG_RATE: number;
}
export interface PQCSummary {
  TOTAL_LOT: number;
  NG_LOT: number;
  NG_RATE: number;
  INSPECT_AMOUNT: number;
}
export interface CS_CONFIRM_TRENDING_DATA {
  CONFIRM_DATE?: string;
  CONFIRM_YW?: string;
  CONFIRM_YM?: string;
  CONFIRM_YEAR?: number;
  C: number;
  K: number;
  TOTAL: number;
}
export interface CS_CONFIRM_BY_CUSTOMER_DATA {
  CUST_NAME_KD: string;
  EMPL_NAME?: string;
  TOTAL: number;
}
export interface CS_REDUCE_AMOUNT_DATA {
  CONFIRM_DATE?: string;
  CONFIRM_YW?: string;
  CONFIRM_YM?: string;
  CONFIRM_YEAR?: number;
  REDUCE_AMOUNT: number;
}
export interface CS_RMA_AMOUNT_DATA {
  RT_DATE?: string;
  RT_YW?: string;
  RT_YM?: string;
  RT_YEAR?: number;
  HT: number;
  MD: number;
  CD: number;
  TT: number;
}
export interface CS_TAXI_AMOUNT_DATA {
  TAXI_DATE?: string;
  TAXI_YW?: string;
  TAXI_YM?: string;
  TAXI_YEAR?: string;
  TAXI_AMOUNT: number;
}
export interface CSFCOST {
  RMA_DATA: CS_RMA_AMOUNT_DATA[];
  TAXI_DATA: CS_TAXI_AMOUNT_DATA[];
}
export interface RNR_DATA {
  FACTORY: string;
  TEST_DATE: string;
  TEST_ID: string;
  TEST_NO: number;
  TEST_TYPE: string;
  FULL_NAME: string;
  SUBDEPTNAME: string;
  TEST_EMPL_NO: string;
  UPD_DATE: string;
  UPD_EMPL: string;
  TEST_NUMBER: number;
  TEST_NUMBER2: number;
  RESULT_OK_NG: number;
  RESULT_DETAIL: string;
  TEST_RESULT1: number;
  TEST_REUST2: number;
  MIX1: number;
  MIX2: number;
}
export interface RNR_DATA_EMPL {
  FULL_NAME: string;
  SUBDEPTNAME: string;
  TEST_ID: string;
  TEST_TYPE: string;
  TEST_NO: number;
  COUNT1: number;
  COUNT2: number;
  SO_CAU: number;
  SCORE1: number;
  SCORE2: number;
  MIX1: number;
  MIX2: number;
  JUDGE1: string;
  JUDGE2: string;
  BAT_NHAM1: number;
  BAT_NHAM2: number;
  BO_SOT1: number;
  BO_SOT2: number;
  BN_RATE1: number;
  BN_RATE2: number;
  BS_RATE1: number;
  BS_RATE2: number;
}
export interface AUDIT_LIST {
  AUDIT_ID: number;
  AUDIT_NAME: string;
  CUST_NAME_KD: string;
  PASS_SCORE: number;
}
export interface AUDIT_CHECK_LIST {
  id: number;
  AUDIT_DETAIL_ID: number;
  AUDIT_ID: number;
  AUDIT_NAME: string;
  MAIN_ITEM_NO: number;
  MAIN_ITEM_CONTENT: string;
  SUB_ITEM_NO: number;
  SUB_ITEM_CONTENT: string;
  LEVEL_CAT: string;
  DETAIL_VN: string;
  DETAIL_KR: string;
  DETAIL_EN: string;
  MAX_SCORE: number;
  INS_DATE: string;
  INS_EMPL: string;
  UPD_DATE: string;
  UPD_EMPL: string;
}
export interface AUDIT_RESULT {
  AUDIT_RESULT_ID: number;
  AUDIT_ID: number;
  AUDIT_NAME: string;
  AUDIT_DATE: string;
  REMARK: string;
  INS_DATE: string;
  INS_EMPL: string;
  UPD_DATE: string;
  UPD_EMPL: string;
}
export interface AUDIT_CHECKLIST_RESULT {
  AUDIT_RESULT_DETAIL_ID: number;
  AUDIT_RESULT_ID: number;
  AUDIT_DETAIL_ID: number;
  AUDIT_ID: number;
  AUDIT_NAME: string;
  MAIN_ITEM_NO: number;
  MAIN_ITEM_CONTENT: string;
  SUB_ITEM_NO: number;
  SUB_ITEM_CONTENT: string;
  LEVEL_CAT: string;
  DETAIL_VN: string;
  DETAIL_KR: string;
  DETAIL_EN: string;
  MAX_SCORE: number;
  AUDIT_SCORE: number;
  AUDIT_EVIDENT: string;
  REMARK: string;
  DEPARTMENT: string;
  INS_DATE: string;
  INS_EMPL: string;
  UPD_DATE: string;
  UPD_EMPL: string;
}

export interface MASTER_MATERIAL_HSD {
  M_NAME: string;
  EXP_DATE: number;
}
export interface RND_NEWCODE_TREND_DATA {
  CREATED_DATE?: string;
  CREATED_YW?: string;
  CREATED_YM?: string;
  CREATED_YEAR?: string;
  NEWCODE: number;
  ECN: number;
  TOTAL: number;
}
export interface RND_NEWCODE_BY_CUSTOMER {
  CUST_NAME_KD: string;
  NEWCODE: number;
}
export interface OQC_NG_BY_CUSTOMER {
  CUST_NAME_KD: string;
  NG_LOT: number;
}
export interface RND_NEWCODE_BY_PRODTYPE {
  PROD_TYPE: string;
  NEWCODE: number;
}
export interface OQC_NG_BY_PRODTYPE {
  PROD_TYPE: string;
  NG_LOT: number;
}
export interface SAMPLE_MONITOR_DATA {
  SAMPLE_ID: number;
  PROD_REQUEST_NO: string;
  G_CODE: string;
  G_NAME_KD: string;
  G_NAME: string;
  FILE_MAKET: string;
  FILM_FILE: string;
  KNIFE_STATUS: string;
  KNIFE_CODE: string;
  FILM: string;
  RND_EMPL: string;
  RND_UPD_DATE: string;
  MATERIAL_STATUS: string;
  PUR_EMPL: string;
  PUR_UPD_DATE: string;
  PRINT_STATUS: string;
  DIECUT_STATUS: string;
  PR_EMPL: string;
  PR_UPD_DATE: string;
  QC_STATUS: string;
  QC_EMPL: string;
  QC_UPD_DATE: string;
  APPROVE_STATUS: string;
  APPROVE_DATE: string;
  USE_YN: string;
  REMARK: string;
  INS_DATE: string;
  INS_EMPL: string;
  PROD_REQUEST_DATE: string;
  PROD_REQUEST_QTY: number;
  CUST_CD: string;
  DELIVERY_DT: string;
  G_WIDTH: number;
  G_LENGTH: number;
  CUST_NAME_KD: string;
}

export interface BOMSX_DATA {
  LIEUQL_SX: number;
  MAIN_M: number;
  G_CODE: string;
  G_NAME: string;
  G_NAME_KD: string;
  RIV_NO: string;
  M_CODE: string;
  M_NAME: string;
  WIDTH_CD: number;
  M_QTY: number;
  INS_EMPL: string;
  INS_DATE: string;
  UPD_EMPL: string;
  UPD_DATE: string;
  M_STOCK: number;
}


export interface FORM_ELEMENT {
  elementType: string;
  element: ReactElement;
}
export interface QUANLYDAOFILM_DATA {
  KNIFE_FILM_ID: number;
  FACTORY_NAME: string;
  CUST_CD: string;
  KNIFE_TYPE: string;
  KNIFE_FILM_STEP: string;
  G_CODE: string;
  KNIFE_FILM_QTY: number;
  FULL_KNIFE_CODE: string;
  KT_KNIFE_CODE: string;
  KNIFE_BOX_NUMBER: string;
  CAVITY_NGANG: number;
  CAVITY_DOC: number;
  STANDARD_PRESS_QTY: number;
  INS_EMPL: string;
  INS_DATE: string;
  UPD_EMPL: string;
  UPD_DATE: string;
  KNIFE_STATUS: string;
  REMARK: string;
  KNIFE_FILM_NO: string;
  KNIFE_FILM_SEQ: string;
  PD: number;
  TOTAL_PRESS: number;
  BOGOC: string;
  KCTD: string;
  KNIFE_TYPE2: string;
  SONG_GIUA: number;
  TOTAL_PRESS2: number;
  G_NAME: string;
  G_NAME_KD: string;
  PROD_TYPE: string;
  REV_NO: string;
  VENDOR: string;
}
export interface XUATDAOFILM_DATA {
  CA_LAM_VIEC: string;
  PLAN_ID: string;
  KNIFE_FILM_NO: string;
  QTY_KNIFE_FILM: string;
  CAVITY: number;
  PD: number;
  EQ_THUC_TE: string;
  PRESS_QTY: number;
  EMPL_NO: string;
  LOAIBANGIAO_PDP: string;
  F_WIDTH: number;
  F_LENGTH: number;
  INS_DATE: string;
  INS_EMPL: string;
  UPD_DATE: string;
  UPD_EMPL: string;
  SX_EMPL_NO: string;
  PLAN_ID2: string;
  PRESS_QTY2: number;
  G_NAME: string;
  G_NAME_KD: string;
  PLAN_DATE: string;
  SX_DATE: string;
}
export interface XBAR_DATA {
  GRP_ID: number;
  CENTER_VALUE: number;
  LOWER_VALUE: number;
  UPPER_VALUE: number;
  MIN_VALUE: number;
  MAX_VALUE: number;
  R_VALUE: number;
  AVG_VALUE: number;
  X_UCL: number;
  X_CL: number;
  X_LCL: number;
  R_UCL: number;
  R_CL: number;
  R_LCL: number;
}
export interface CPK_DATA {
  GRP_ID: number;
  CENTER_VALUE: number;
  LOWER_VALUE: number;
  UPPER_VALUE: number;
  STD_DEV_VALUE: number;
  AVG_VALUE: number;
  CPU: number;
  CPL: number;
  CPK: number;
  CPK1: number;
  CPK2: number;
}
export interface HISTOGRAM_DATA {
  RESULT: string;
  CNT: number;
}
export interface DTC_TEST_LIST {
  TEST_CODE: number;
  TEST_NAME: string;
}
export interface DTC_TEST_POINT {
  POINT_CODE: number;
  POINT_NAME: string;
  TEST_CODE: number;
  TEST_NAME: string;
}
export interface NCR_DATA {
  NCR_ID: number;
  FACTORY: string;
  NCR_NO: string;
  NCR_DATE: string;
  RESPONSE_REQ_DATE: string;
  CUST_CD: string;
  VENDOR: string;
  M_CODE: string;
  WIDTH_CD: number;
  M_NAME: string;
  CMS_LOT: string;
  VENDOR_LOT: string;
  DEFECT_TITLE: string;
  DEFECT_DETAIL: string;
  DEFECT_IMAGE: string;
  PROCESS_STATUS: string;
  USE_YN: string;
  INS_DATE: string;
  INS_EMPL: string;
  UPD_DATE: string;
  UPD_EMPL: string;
  REMARK: string;
}
export interface HOLDDING_BY_NCR_ID {
  NCR_ID: number;
  VENDOR_LOT: string;
  M_CODE: string;
  M_NAME: string;
  WIDTH_CD: number;
  TOTAL_HOLDING_ROLL: number;
  TOTAL_HOLDING_M: number;
  TOTAL_HOLDING_SQM: number;
  TYPE: string;
}

export interface DEFECT_PROCESS_DATA {
  CTR_CD: string;
  NG_SX100_ID: string;
  G_CODE: string;
  PROCESS_NUMBER: number;
  STT: number;
  DEFECT: string;
  TEST_ITEM: string;
  TEST_METHOD: string;
  INS_PATROL_ID: string;
  IMAGE_YN: string;
  USE_YN: string;
  INS_DATE: string;
  INS_EMPL: string;
  UPD_DATE: string;
  UPD_EMPL: string;
  PROD_MODEL: string;
  DESCR: string;
  G_NAME: string;
}
export interface MAT_DOC_DATA {
  CTR_CD: string;
  DOC_ID: string;
  DOC_TYPE: string;
  M_ID: number;
  M_NAME: string;
  VER: string;
  FILE_NAME: string;
  FILE_UPLOADED: string;
  REG_DATE: string;
  EXP_DATE: string;
  EXP_YN: string;
  PUR_APP: string;
  DTC_APP: string;
  RND_APP: string;
  PUR_EMPL: string;
  DTC_EMPL: string;
  RND_EMPL: string;
  PUR_APP_DATE: string;
  DTC_APP_DATE: string;
  RND_APP_DATE: string;
  USE_YN: string;
  INS_DATE: string;
  INS_EMPL: string;
  UPD_DATE: string;
  UPD_EMPL: string;
}
export interface ALL_DOC_DATA {
  CTR_CD: string;
  DOC_ID: number;
  DEPARTMENT: string;
  DOC_CATEGORY: string;
  DOC_CATEGORY2: string;
  DOC_NAME: string;
  HSD_YN: string;
  USE_YN: string;
  INS_DATE: string;
  INS_EMPL: string;
  UPD_DATE: string;
  UPD_EMPL: string;
}
export interface ALL_FILE_DATA {
  CTR_CD: string;
  FILE_ID: string;
  DOC_ID: string;
  REG_DATE: string;
  EXP_DATE: string;
  INS_DATE: string;
  INS_EMPL: string;
  UPD_DATE: string;
  UPD_EMPL: string;
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


export interface WORK_POSITION_DATA {
  CTR_CD: string;
  SUBDEPTCODE: number;
  WORK_POSITION_CODE: number;
  WORK_POSITION_NAME: string;
  WORK_POSITION_NAME_KR: string;
  ATT_GROUP_CODE: number;
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
export interface MRPDATA {
  CUST_NAME_KD: string;
  M_NAME: string;
  WIDTH_CD: number;
  CTR_CD: string;
  M_CODE: string;
  M_INIT_WH_STOCK: number;
  M_INIT_INSP_STOCK: number;
  M_INIT_BTP_STOCK: number;
  MD1: number;
  MD2: number;
  MD3: number;
  MD4: number;
  MD5: number;
  MD6: number;
  MD7: number;
  MD8: number;
  MD9: number;
  MD10: number;
  MD11: number;
  MD12: number;
  MD13: number;
  MD14: number;
  MD15: number;
  RAW_M_STOCK: number;
  TOTAL_STOCK: number;
}
export interface DOCUMENT_DATA {
  FILE_ID: number;
  REG_DATE: string;
  EXP_DATE: string;
  FORMAT_X: string;
  DOC_ID: number;
  CAT_ID: number;
  CAT_NAME: string;
  DOC_CAT_NAME: string;
  DOC_CAT_ID: number;
  DOC_NAME: string;
  HSD_YN: string;
  USE_YN: string;
  INS_DATE: string;
  INS_EMPL: string;
  UPD_DATE: string;
  UPD_EMPL: string;
}
export interface DOC_CATEGORY1_DATA {
  CAT_ID: number;
  CAT_NAME: string;
  SUBDEPTCODE: number;
  INS_DATE: string;
  INS_EMPL: string;
  UPD_DATE: string;
  UPD_EMPL: string;
}
export interface DOC_CATEGORY2_DATA {
  DOC_CAT_ID: number;
  DOC_CAT_NAME: string;
  INS_DATE: string;
  INS_EMPL: string;
  UPD_DATE: string;
  UPD_EMPL: string;
  MAINDEPTCODE: number;
}
export interface DOC_LIST_DATA {
  DOC_ID: number;
  DOC_NAME: string;
  HSD_YN: string;
  USE_YN: string;
  INS_DATE: string;
  INS_EMPL: string;
  UPD_DATE: string;
  UPD_EMPL: string;
  CAT_ID: number;
  DOC_CAT_ID: number;
}
export interface FULL_ROLL_DATA {
  PLAN_ID: string;
  M_LOT_NO: string;
  IQC_IN: number;
  OUT_KHO_QTY: number;
  LOCK_QTY: number;
  INPUT_QTY: number;
  USED_QTY: number;
  REMAIN_QTY: number;
  SETTING_MET: number;
  PR_NG: number;
  RESULT_MET: number;
  BTP_REMAIN_QTY: number;
  TON_KHO_SX: number;
  RETURN_KHO_QTY: number;
  RETURN_IQC_QTY: number;
  PD: number;
  CAVITY: number;
  INS_INPUT_MET: number;
  TON_KIEM_MET: number;
  INSPECT_TOTAL_MET: number;
  INSPECT_OK_MET: number;
  INSPECT_OUTPUT_MET: number;
  IQC_IN_EA: number;
  OUT_KHO_EA: number;
  LOCK_EA: number;
  INPUT_EA: number;
  USED_EA: number;
  REMAIN_EA: number;
  SETTING_EA: number;
  PR_NG_EA: number;
  RESULT_EA: number;
  BTP_REMAIN_EA: number;
  TON_KHO_SX_EA: number;
  RETURN_EA: number;
  RETURN_IQC_EA: number;
  INS_INPUT_EA: number;
  TON_KIEM_EA: number;
  INSPECT_TOTAL_EA: number;
  INSPECT_OK_EA: number;
  INSPECT_OUTPUT_EA: number;
  IQC_IN_M2: number;
  OUT_KHO_M2: number;
  LOCK_M2: number;
  INPUT_M2: number;
  USED_M2: number;
  REMAIN_M2: number;
  SETTING_M2: number;
  PR_NG_M2: number;
  RESULT_M2: number;
  BTP_REMAIN_M2: number;
  TON_KHO_SX_M2: number;
  RETURN_KHO_M2: number;
  RETURN_IQC_M2: number;
  INS_INPUT_M2: number;
  TON_KIEM_M2: number;
  INSPECT_TOTAL_M2: number;
  INSPECT_OK_M2: number;
  INSPECT_OUTPUT_M2: number;
  PROCESS_NUMBER: number;
  STEP: number;
  PLAN_DATE: string;
  G_NAME_KD: string;
  PROD_MAIN_MATERIAL: string;
  PROD_REQUEST_NO: string;
  PHAN_LOAI: string;
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
export interface BLOCK_DATA {
  CTR_CD: string;
  NCR_ID: number;
  PL_BLOCK: string;
  BLOCK_ID: number;
  PLAN_ID: string;
  M_CODE: string;
  M_LOT_NO: string;
  PROCESS_LOT_NO: string;
  BLOCK_ROLL_QTY: number;
  BLOCK_TOTAL_QTY: number;
  USE_YN: string;
  DEFECT: string;
  QC_PASS: string;
  QC_PASS_DATE: string;
  QC_PASS_EMPL: string;
  STATUS: string;
  PROCESS_EMPL: string;
  PROCESS_DATE: string;
  FACTORY: string;
  INS_DATE: string;
  INS_EMPL: string;
  UPD_DATE: string;
  UPD_EMPL: string;
  LOT_VENDOR: string;
  M_NAME: string;
  WIDTH_CD: number;
  VENDOR_NAME: string;
}
export interface KPI_DATA {
  CTR_CD: string;
  KPI_ID: number;
  KPI_NAME: string;
  KPI_YEAR: number;
  KPI_PERIOD: string;
  KPI_MONTH: number;
  KPI_VALUE: number;
  VALUE_TYPE: string;
  INS_DATE: string;
  INS_EMPL: string;
  UPD_DATE: string;
  UPD_EMPL: string;
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

export interface TREND_NGUOI_HANG_DATA {
  INSPECT_DATE?: string;
  INSPECT_YEAR?: number;
  INSPECT_MONTH?: number;
  INSPECT_WEEK?: number;
  INSPECT_YM?: string;
  INSPECT_YW?: string;
  EMPL_NUMBER: string;
  INSPECT_HOUR: number;
  INSPECT_TOTAL_QTY: number;
}
export interface CNT_GAP_DATA {
  GAP: number;
  CNT: number;
  RATE: number;
}
export interface AUDIT_HISTORY_DATA {
  id: number;
  CTR_CD: string;
  CUST_CD: string;
  CUST_NAME_KD: string;
  AUDIT_ID: number;
  AUDIT_DATE: string;
  AUDIT_NAME: string;
  AUDIT_MAX_SCORE: number;
  AUDIT_SCORE: number;
  AUDIT_PASS_SCORE: number;
  AUDIT_RESULT: string;
  AUDIT_FILE_EXT: string;
  INS_DATE: string;
  INS_EMPL: string;
  UPD_DATE: string;
  UPD_EMPL: string;
}

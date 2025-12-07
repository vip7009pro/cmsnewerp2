export interface SX_ACHIVE_DATE {
  id: number;
  EQ_NAME: string;
  PROD_REQUEST_NO: string;
  G_NAME_KD: string;
  STEP: number;
  PLAN_DAY: number;
  PLAN_NIGHT: number;
  PLAN_TOTAL: number;
  RESULT_DAY: number;
  RESULT_NIGHT: number;
  RESULT_TOTAL: number;
  DAY_RATE: number;
  NIGHT_RATE: number;
  TOTAL_RATE: number;
}
//machine qlsx
export interface MACHINE_LIST {
  EQ_NAME: string;
}
export interface TONLIEUXUONG {
  id: number;
  FACTORY: string;
  PHANLOAI: string;
  PLAN_ID_INPUT: string;
  PLAN_ID_SUDUNG: string;
  M_CODE: string;
  M_NAME: string;
  WIDTH_CD: number;
  M_LOT_NO: string;
  ROLL_QTY: number;
  IN_QTY: number;
  TOTAL_IN_QTY: number;
  FSC: string;
  IN_KHO_ID: number;
  PLAN_EQ: string;
  INS_DATE: string;
  USE_YN: string;
  P500_X?: number;
}
export interface LICHSUNHAPKHOAO {
  id: string;
  FACTORY: string;
  PHANLOAI: string;
  M_CODE: string;
  M_NAME: string;
  WIDTH_CD: number;
  M_LOT_NO: string;
  PLAN_ID_INPUT: string;
  ROLL_QTY: number;
  IN_QTY: number;
  TOTAL_IN_QTY: number;
  INS_DATE: string;
  KHO_CFM_DATE: string;
  RETURN_STATUS: string;
}
export interface LICHSUXUATKHOAO {
  id: string;
  FACTORY: string;
  PHANLOAI: string;
  M_CODE: string;
  M_NAME: string;
  WIDTH_CD: number;
  M_LOT_NO: string;
  PLAN_ID_INPUT: string;
  PLAN_ID_OUTPUT: string;
  ROLL_QTY: number;
  OUT_QTY: number;
  TOTAL_OUT_QTY: number;
  INS_DATE: string;
}
export interface LICHSUINPUTLIEUSX {
  id: string;
  PLAN_ID: string;
  G_NAME: string;
  G_NAME_KD: string;
  M_CODE: string;
  M_NAME: string;
  M_LOT_NO: string;
  WIDTH_CD: number;
  INPUT_QTY: number;
  USED_QTY: number;
  REMAIN_QTY: number;
  EMPL_NO: string;
  EQUIPMENT_CD: string;
  INS_DATE: string;
}
export interface DINHMUC_QSLX {
  FACTORY: string;
  EQ1: string;
  EQ2: string;
  EQ3: string;
  EQ4: string;
  Setting1: number;
  Setting2: number;
  Setting3: number;
  Setting4: number;
  UPH1: number;
  UPH2: number;
  UPH3: number;
  UPH4: number;
  Step1: number;
  Step2: number;
  Step3: number;
  Step4: number;
  LOSS_SX1: number;
  LOSS_SX2: number;
  LOSS_SX3: number;
  LOSS_SX4: number;
  LOSS_SETTING1: number;
  LOSS_SETTING2: number;
  LOSS_SETTING3: number;
  LOSS_SETTING4: number;
  LOSS_KT: number;
  NOTE: string;
}
export interface QLSXPLANDATA {
  id: number;
  PLAN_ID: string;
  PLAN_DATE: string;
  PROD_REQUEST_NO: string;
  PLAN_QTY: number;
  PLAN_EQ: string;
  PLAN_FACTORY: string;
  PLAN_LEADTIME: number;
  INS_EMPL: string;
  INS_DATE: string;
  UPD_EMPL: string;
  UPD_DATE: string;
  G_CODE: string;
  G_NAME: string;
  G_NAME_KD: string;
  PROD_REQUEST_DATE: string;
  PROD_REQUEST_QTY: number;
  DELIVERY_DT?: string;
  STEP: number;
  PLAN_ORDER: string;
  PROCESS_NUMBER: number;
  KQ_SX_TAM: number;
  KETQUASX: number;
  CD1: number;
  CD2: number;
  CD3: number;
  CD4: number;
  TON_CD1: number;
  TON_CD2: number;
  TON_CD3: number;
  TON_CD4: number;
  FACTORY: string;
  EQ1: string;
  EQ2: string;
  EQ3: string;
  EQ4: string;
  Setting1: number;
  Setting2: number;
  Setting3: number;
  Setting4: number;
  UPH1: number;
  UPH2: number;
  UPH3: number;
  UPH4: number;
  Step1: number;
  Step2: number;
  Step3: number;
  Step4: number;
  LOSS_SX1: number;
  LOSS_SX2: number;
  LOSS_SX3: number;
  LOSS_SX4: number;
  LOSS_SETTING1: number;
  LOSS_SETTING2: number;
  LOSS_SETTING3: number;
  LOSS_SETTING4: number;
  NOTE: string;
  NEXT_PLAN_ID: string;
  XUATDAOFILM?: string;
  EQ_STATUS?: string;
  MAIN_MATERIAL?: string;
  INT_TEM?: string;
  CHOTBC?: string;
  DKXL?: string;
  OLD_PLAN_QTY?: number;
  ACHIVEMENT_RATE?: number;
  PDBV?: string;
  PD?: number;
  CAVITY?: number;
  SETTING_START_TIME?: string;
  MASS_START_TIME?: string;
  MASS_END_TIME?: string;
  REQ_DF?: string;
  AT_LEADTIME?: number;
  ACC_TIME?: number;
  IS_SETTING?: string;
  PDBV_EMPL?: string;
  PDBV_DATE?: string;
  LOSS_KT?: number;
  ORG_LOSS_KT?: number;
  USE_YN?: string;
  SLC_CD1?: number;
  SLC_CD2?: number;
  SLC_CD3?: number;
  SLC_CD4?: number;
  CURRENT_SLC?: number;
  IS_TAM_THOI?: string;
  FL_YN?: string;
  PROD_PRINT_TIMES?: number;
}
export interface QLSXCHITHIDATA {
  id: string;
  CHITHI_ID: string;
  PLAN_ID: string;
  M_CODE: string;
  M_NAME: string;
  WIDTH_CD: number;
  M_ROLL_QTY: number;
  M_MET_QTY: number;
  M_QTY: number;
  LIEUQL_SX: number;
  MAIN_M: number;
  OUT_KHO_SX: number;
  OUT_CFM_QTY: number;
  INS_EMPL: string;
  INS_DATE: string;
  UPD_EMPL: string;
  UPD_DATE: string;
  M_STOCK: number;
  IQC_STOCK?: number;
}
export interface EQ_STATUS {
  FACTORY: string;
  EQ_NAME: string;
  EQ_SERIES: string;
  EQ_ACTIVE: string;
  REMARK: string;
  EQ_STATUS: string;
  CURR_PLAN_ID: string;
  CURR_G_CODE: string;
  INS_EMPL: string;
  INS_DATE: string;
  UPD_EMPL: string;
  UPD_DATE: string;
  EQ_CODE: string;
  G_NAME: string;
}
//machine component
export interface MachineInterface {
  machine_name?: string;
  factory?: string;
  run_stop?: number;
  machine_data?: QLSXPLANDATA[];
  current_plan_id?: string;
  current_g_name?: string;
  eq_status?: string;
  onClick?: (ev: any) => void;
}
export interface EQ_STT {
  FACTORY?: string;
  EQ_NAME?: string;
  EQ_OP?: number;
  EQ_SERIES?: string;
  EQ_ACTIVE?: string;
  REMARK?: string;
  EQ_STATUS?: string;
  CURR_PLAN_ID?: string;
  CURR_G_CODE?: string;
  INS_EMPL?: string;
  INS_DATE?: string;
  UPD_EMPL?: string;
  UPD_DATE?: string;
  EQ_CODE?: string;
  G_NAME_KD?: string;
  STEP?: number;
  SETTING_START_TIME?: string;
  MASS_START_TIME?: string;
  MASS_END_TIME?: string;
  KQ_SX_TAM?: number;
  SX_RESULT?: number;
  UPH1?: number;
  UPH2?: number;
  UPH3?: number;
  UPH4?: number;
  Setting1?: number;
  Setting2?: number;
  Setting3?: number;
  Setting4?: number;
  PROCESS_NUMBER?: number;
  PLAN_QTY?: number;
  ACC_TIME?: number;
  G_NAME?: string;
}
export interface MachineInterface2 {
  machine_name?: string;
  factory?: string;
  run_stop?: number;
  machine_data?: EQ_STT;
  current_plan_id?: string;
  current_step?: number;
  current_g_name?: string;
  search_string?: string;
  eq_status?: string;
  upd_time?: string;
  upd_empl?: string;
  eq_code?: string;
  eq_active?: string;
  onClick?: (ev: any) => void;
  onMouseEnter?: (ev: any) => void;
  onMouseLeave?: (ev: any) => void;
  onDoubleClick?: (ev: any) => void;
}
//capa sx
export interface DATA_DIEM_DANH {
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
  WORK_POSITION_CODE: number;
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
}
export interface DELIVERY_PLAN_CAPA {
  FACTORY: string;
  EQ: string;
  PL_DATE: string;
  LEADTIME: number;
  AVL_CAPA: number;
  REAL_CAPA: number;
}
export interface MACHINE_COUNTING {
  FACTORY?: string;
  EQ_NAME: string;
  EQ_QTY: number;
}
export interface YCSX_BALANCE_CAPA_DATA {
  EQ_NAME: string;
  YCSX_BALANCE: number;
}
export interface CAPA_LEADTIME_DATA {
  PROD_REQUEST_NO: string;
  PROD_REQUEST_QTY: number;
  G_CODE: string;
  G_NAME: string;
  Setting1: number;
  Setting2: number;
  UPH1: number;
  UPH2: number;
  TON_CD1: number;
  TON_CD2: number;
  EQ1: string;
  EQ2: string;
  LEATIME1: number;
  LEATIME2: number;
}
//data sx
export interface YCSX_SX_DATA {
  YCSX_PENDING: string;
  PHAN_LOAI: string;
  PROD_REQUEST_NO: string;
  G_NAME: string;
  G_NAME_KD: string;
  FACTORY: string;
  EQ1: string;
  EQ2: string;
  EQ3: string;
  EQ4: string;
  PROD_REQUEST_DATE: string;
  PROD_REQUEST_QTY: number;
  M_NAME: string;
  M_OUTPUT: number;
  NOT_SCANNED_QTY: number;
  SCANNED_QTY: number;
  REMAIN_QTY: number;
  USED_QTY: number;
  PD: number;
  CAVITY: number;
  WAREHOUSE_ESTIMATED_QTY: number;
  ESTIMATED_QTY: number;
  CD1: number;
  CD2: number;
  CD3: number;
  CD4: number;
  ST1: number;
  ST2: number;
  ST3: number;
  ST4: number;
  NG1: number;
  NG2: number;
  NG3: number;
  NG4: number;
  INS_INPUT: number;
  INSPECT_TOTAL_QTY: number;
  INSPECT_OK_QTY: number;
  INSPECT_LOSS_QTY: number;
  INSPECT_TOTAL_NG: number;
  INSPECT_MATERIAL_NG: number;
  INSPECT_PROCESS_NG: number;
  INS_OUTPUT: number;
  LOSS_SX1: number;
  LOSS_SX2: number;
  LOSS_SX3: number;
  LOSS_SX4: number;
  LOSS_INSPECT: number;
  TOTAL_LOSS: number;
  TOTAL_LOSS2: number;
  LOSS_THEM_TUI: number;
  SX_MARKING_QTY: number;
  NEXT_IN_QTY: number;
  IQC_IN: number;
  NOT_BEEP_QTY: number;
  LOCK_QTY: number;
  BEEP_QTY: number;
  TON_KHO_AO: number;
  NEXT_OUT_QTY: number;
  RETURN_QTY: number;
  RETURN_IQC: number;
  Setting1: number;
  Setting2: number;
  Setting3: number;
  Setting4: number;
  UPH1: number;
  UPH2: number;
  UPH3: number;
  UPH4: number;
  Step1: number;
  Step2: number;
  Step3: number;
  Step4: number;
  LOSS_SETTING1: number;
  LOSS_SETTING2: number;
  LOSS_SETTING3: number;
  LOSS_SETTING4: number;
  LOSS_KT: number;
  LOSS_OVER: string;
  LOSS_LT: number;
}
export interface LOSS_TABLE_DATA {
  XUATKHO_MET: number;
  XUATKHO_EA: number;
  SCANNED_MET: number;
  SCANNED_EA: number;
  SCANNED_MET2: number;
  SCANNED_EA2: number;
  SCANNED_MET3: number;
  SCANNED_EA3: number;
  SCANNED_MET4: number;
  SCANNED_EA4: number;
  SETTING1: number;
  NG1: number;
  PROCESS1_RESULT: number;
  SETTING2: number;
  NG2: number;
  PROCESS2_RESULT: number;
  SETTING3: number;
  NG3: number;
  PROCESS3_RESULT: number;
  SETTING4: number;
  NG4: number;
  PROCESS4_RESULT: number;
  SX_RESULT: number;
  INSPECTION_INPUT: number;
  INSPECT_TOTAL_QTY: number;
  INSPECT_OK_QTY: number;
  LOSS_THEM_TUI: number;
  INSPECT_LOSS_QTY: number;
  INSPECT_TOTAL_NG: number;
  INSPECT_MATERIAL_NG: number;
  INSPECT_PROCESS_NG: number;
  SX_MARKING_QTY: number;
  INSPECTION_OUTPUT: number;
  LOSS_INS_OUT_VS_SCANNED_EA: number;
  LOSS_INS_OUT_VS_XUATKHO_EA: number;
}
export interface LICHSUINPUTLIEU_DATA {
  id: string;
  PLAN_ID: string;
  G_NAME: string;
  G_NAME_KD: string;
  M_CODE: string;
  M_NAME: string;
  M_LOT_NO: string;
  LOTNCC: string;
  WIDTH_CD: number;
  INPUT_QTY: number;
  USED_QTY: number;
  REMAIN_QTY: number;
  EMPL_NO: string;
  EQUIPMENT_CD: string;
  INS_DATE: string;
  PROD_REQUEST_NO: string;
}
//plan result
export interface DAILY_SX_DATA {
  MACHINE_NAME: string;
  SX_DATE: string;
  SX_RESULT: number;
  PLAN_QTY: number;
  RATE: number;
}
export interface ACHIVEMENT_DATA {
  MACHINE_NAME: string;
  PLAN_QTY: number;
  WH_OUTPUT: number;
  SX_RESULT_TOTAL: number;
  RESULT_STEP_FINAL: number;
  RESULT_TO_NEXT_PROCESS: number;
  RESULT_TO_INSPECTION: number;
  INS_INPUT: number;
  INSPECT_TOTAL_QTY: number;
  INSPECT_OK_QTY: number;
  INSPECT_NG_QTY: number;
  INS_OUTPUT: number;
  TOTAL_LOSS: number;
  ACHIVEMENT_RATE: number;
}
export interface WEEKLY_SX_DATA {
  SX_WEEK: number;
  SX_RESULT: number;
  PLAN_QTY: number;
  RATE: number;
}
export interface MONTHLY_SX_DATA {
  SX_MONTH: number;
  SX_RESULT: number;
  PLAN_QTY: number;
  RATE: number;
}
export interface TOTAL_TIME {
  T_FR: number;
  T_SR: number;
  T_DC: number;
  T_ED: number;
  T_TOTAL: number;
}
export interface OPERATION_TIME_DATA {
  PLAN_FACTORY: string;
  MACHINE: string;
  TOTAL_TIME: number;
  RUN_TIME_SX: number;
  SETTING_TIME: number;
  LOSS_TIME: number;
  HIEU_SUAT_TIME: number;
  SETTING_TIME_RATE: number;
  LOSS_TIME_RATE: number;
}
export interface PRODUCTION_EFFICIENCY_DATA {
  SX_YEAR?: string;
  SX_YW?: string;
  SX_YM?: string;
  SX_DATE?: string;
  ALVB_TIME: number;
  TOTAL_TIME: number;
  PURE_RUN_TIME: number;
  RUN_TIME_SX: number;
  SETTING_TIME: number;
  LOSS_TIME: number;
  PURE_RUN_RATE: number;
  HIEU_SUAT_TIME: number;
  SETTING_TIME_RATE: number;
  LOSS_TIME_RATE: number;
  OPERATION_RATE: number;
}
export interface PLAN_LOSS_DATA {
  YW: string;
  PLAN_ORG_MET: number;
  PLAN_INPUT_MET: number;
  PLAN_QTY: number;
  SX_RESULT: number;
  ACTUAL_INPUT_MET: number;
  PLAN_LOSS_MET: number;
  ACTUAL_LOSS_MET: number;
  PLAN_LOSS_RATE: number;
  ACTUAL_LOSS_RATE: number;
}
export interface LEADTIME_DATA {
  MACHINE: string;
  FACTORY: string;
  Setting1: number;
  Setting2: number;
  Step1: number;
  Step2: number;
  UPH1: number;
  UPH2: number;
  Step3: number;
  Step4: number;
  DELIVERY_DT: string;
  EQ1: string;
  EQ2: string;
  EQ3: string;
  EQ4: string;
  UPH3: number;
  UPH4: number;
  Setting3: number;
  Setting4: number;
  G_CODE: string;
  PROD_MAIN_MATERIAL: string;
  G_NAME: string;
  G_NAME_KD: string;
  G_WIDTH: number;
  G_LENGTH: number;
  PROD_REQUEST_NO: string;
  PROD_REQUEST_DATE: string;
  CD1: number;
  CD2: number;
  CD3: number;
  CD4: number;
  SLC_CD1: number;
  SLC_CD2: number;
  SLC_CD3: number;
  SLC_CD4: number;
  TCD1: number;
  TCD2: number;
  TCD3: number;
  TCD4: number;
  LT1: number;
  LT2: number;
  LT3: number;
  LT4: number;
  LEADTIME: number;
  TCD: number;
  NEEDED_M: number;
  M_STOCK_QTY: number;
}
export interface ProductionPlan {
  PROD_REQUEST_NO: string;
  G_NAME: string;
  G_NAME_KD: string;
  G_CODE: string;
  EQ_NAME: string;
  productionPlanDate: string;
  productionPlanQty: number;
  productionPlanTime: number; // Đơn vị: phút
  PROD_MAIN_MATERIAL: string;
  G_WIDTH: number;
  G_LENGTH: number;
  PROD_REQUEST_DATE: string;
  DELIVERY_DT: string;
  NEEDED_M: number;
  M_STOCK_QTY: number;
}
export interface SX_CAPA_DATA {
  EQ_SERIES: string;
  EQ_QTY: number;
  EQ_OP: number;
  AVG_EQ_OP: number;
  MAN_FULL_CAPA: number;
  RETAIN_WF: number;
  RETAIN_WF_CAPA: number;
  ATT_WF: number;
  ATT_WF_CAPA: number;
  RETAIN_WF_TO_EQ: number;
  RETAIN_WF_TO_EQ_CAPA: number;
  ATT_WF_TO_EQ: number;
  ATT_WF_TO_EQ_CAPA: number;
  RETAIN_WF_MIN_CAPA: number;
  ATT_WF_MIN_CAPA: number;
  YCSX_BALANCE: number;
  RETAIN_WF_LEADTIME_DAYS: number;
  ATT_WF_LEADTIME_DAYS: number;
}
export interface PROD_PROCESS_DATA {
  G_CODE: string;
  PROCESS_NUMBER: number;
  FACTORY: string;
  EQ_SERIES: string;
  SETTING_TIME: number;
  UPH: number;
  STEP: number;
  LOSS_SX: number;
  LOSS_SETTING: number;
  INS_DATE: string;
  INS_EMPL: string;
  UPD_DATE: string;
  UPD_EMPL: string;
}
export interface BTP_AUTO_DATA {
  CTR_CD: string;
  PROD_REQUEST_NO: string;
  G_CODE: string;
  G_NAME: string;
  G_NAME_KD: string;
  EQUIPMENT_CD: string;
  MACHINE: string;
  PLAN_ID: string;
  M_LOT_NO: string;
  PROCESS_LOT_NO: string;
  TEMP_QTY: number;
  LOT_STATUS: string;
  PLAN_ID_INPUT: string;
  REMAIN_QTY: number;
  PL_HANG: string;
  USE_YN: string;
  PR_NB: number;
  BTP_REMAIN_EA: number;
  EQ_NAME: string;
  NEXT_EQ: string;
  FINAL_BTP: number;
  FINAL_PR_NB: number;
  BTP_LOCATION: string;
  FINAL_MACHINE: string;
  FINAL_LOCATION: string;
  XUONG: string;
}
export interface BTP_AUTO_DATA2 {
  INS_DATE: string;
  FACTORY: string;
  XUONG: string;
  EQ_NAME: string;
  G_CODE: string;
  G_NAME: string;
  M_NAME: string;
  WIDTH_CD: number;
  PROD_TYPE: string;
  UNIT: string;
  PROD_REQUEST_NO: string;
  PLAN_ID: string;
  PROCESS_NUMBER: number;
  M_LOT_NO: string;
  PROCESS_LOT_NO: string;
  REMAIN_QTY_M: number;
  TEMP_QTY_EA: number;
  FINAL_FACTORY: string;
  FINAL_XUONG: string;
  PHAN_LOAI: string;
  USE_YN: string;
  PD: number;
  CAVITY: number;
  TRANS_LOT_NO: string;
}
export interface BTP_AUTO_DATA_SUMMARY {
  G_CODE: string;
  XA: number;
  XB: number;
  TOTAL_BTP: number;
}
export interface YCSX_SLC_DATA {
  PROD_REQUEST_NO: string;
  G_CODE: string;
  PD: number;
  CAVITY: number;
  LOSS_SX1: number;
  LOSS_SX2: number;
  LOSS_SX3: number;
  LOSS_SX4: number;
  LOSS_SETTING1: number;
  LOSS_SETTING2: number;
  LOSS_SETTING3: number;
  LOSS_SETTING4: number;
  LOSS_KT: number;
  PROD_REQUEST_QTY: number;
  SLC_CD1: number;
  SLC_CD2: number;
  SLC_CD3: number;
  SLC_CD4: number;
}
export interface TEMLOTSX_DATA {
  INS_DATE: string;
  G_CODE: string;
  G_NAME: string;
  M_LOT_NO: string;
  LOTNCC: string;
  PROD_REQUEST_NO: string;
  PROCESS_LOT_NO: string;
  M_NAME: string;
  WIDTH_CD: string;
  EMPL_NAME: string;
  PLAN_ID: string;
  TEMP_QTY: number;
  TEMP_MET: number;
  PROCESS_NUMBER: number;
  LOT_STATUS: string;
  EQUIPMENT_CD: string;
  EMPL_NO: string;
  SETTING_MET: number;
  PR_NG: number;
  FACTORY: string;
  PR_NB: number;
  PLAN_QTY: number;
  INS_EMPL: string;
}
export interface SX_LOSS_TREND_DATA {
  INPUT_DATE: string;
  USED_QTY: number;
  SETTING_MET: number;
  PR_NG: number;
  LOSS_ST: number;
  LOSS_SX: number;
  LOSS_TT: number;
  OUTPUT_EA: number;
  INSPECT_INPUT: number;
  INSPECT_TT_QTY: number;
  RATE1: number;
  RATE2: number;
}
export interface PATROL_HEADER_DATA {
  G_CODE: string;
  G_NAME_KD: string;
  NG_AMOUNT: number;
  INSPECT_TOTAL_QTY: number;
  NG_QTY: number;
  WORST1: string;
  WORST2: string;
  WORST3: string;
}
export interface PATROL_DATA {
  TIME: string;
  EQ: string;
  FACTORY: string;
  G_NAME_KD: string;
  CUST_NAME_KD: string;
  DEFECT: string;
  INSPECT_QTY: number;
  INSPECT_NG: number;
  LINK: string;
  EMPL_NO: string;
  NG_NHAN?: string;
  DOI_SACH?: string;
  STATUS?: string;
}
export interface SX_BAOCAOROLLDATA {
  id: number;
  PHANLOAI: string;
  EQUIPMENT_CD: string;
  PROD_REQUEST_NO: string;
  PLAN_ID: string;
  PLAN_QTY: number;
  SX_RESULT: number;
  ACHIVEMENT_RATE: number;
  PROD_MODEL: string;
  G_NAME_KD: string;
  M_NAME: string;
  WIDTH_CD: number;
  M_LOT_NO: string;
  INPUT_QTY: number;
  REMAIN_QTY: number;
  USED_QTY: number;
  RPM: number;
  SETTING_MET: number;
  PR_NG: number;
  OK_MET_AUTO: number;
  OK_MET_TT: number;
  LOSS_ST: number;
  LOSS_SX: number;
  LOSS_TT: number;
  LOSS_TT_KT: number;
  OK_EA: number;
  OUTPUT_EA: number;
  INSPECT_INPUT: number;
  INSPECT_TT_QTY: number;
  INSPECT_OK_QTY: number;
  INSPECT_OK_SQM: number;
  TT_LOSS_SQM: number;
  REMARK: string;
  PD: number;
  CAVITY: number;
  STEP: number;
  PR_NB: number;
  MAX_PROCESS_NUMBER: number;
  LAST_PROCESS: number;
  INPUT_DATE: string;
  IS_SETTING: string;
  USED_SQM: number;
  LOSS_SQM: number;
  PURE_INPUT: number;
  PURE_OUTPUT: number;
  INSPECT_COMPLETED_DATE: string;
}
export interface SX_TREND_LOSS_DATA {
  INPUT_DATE?: string;
  INPUT_YEAR?: string;
  INPUT_YW?: string;
  INPUT_YM?: string;
  PURE_INPUT: number;
  PURE_OUTPUT: number;
  LOSS_RATE: number;
  KPI_VALUE?: number;
}
export interface SX_ACHIVE_DATA {
  SX_DATE?: string;
  SX_YM?: string;
  SX_YW?: string;
  SX_YEAR?: string;
  SX_RESULT: number;
  PLAN_QTY: number;
  ACHIVE_RATE: number;
}
export interface SX_LOSS_ROLL_DATA {
  OUT_DATE?: string;
  YEAR_NUM?: number;
  WEEK_NUM?: number;
  YEAR_WEEK?: string;
  TOTAL_ROLL: number;
  MASS_ROLL: number;
  SAMPLE_ROLL: number;
}
export interface SX_LOSSTIME_REASON_DATA {
  REASON: string;
  LOSS_TIME: number;
  TOTAL_LOSS_TIME: number;
  RATE: number;
}
export interface SX_LOSSTIME_BY_EMPL {
  EMPL_NAME: string;
  TOTAL_LOSS_TIME: number;
}
export interface SX_KPI_NV_DATA {
  INS_EMPL?: string;
  SX_DATE?: string;
  SX_YEAR?: number;
  SX_WEEK?: number;
  SX_MONTH?: number;
  SX_YW?: string;
  SX_YM?: string;
  PLAN_MET: number;
  OUTPUT_M_LT: number;
  OUTPUT_M_TT: number;
  PLAN_QTY: number;
  OUTPUT_EA_LT: number;
  OUTPUT_EA_TT: number;
  RATE_M: number;
  RATE_EA: number;
}
export interface SX_DATA {
  G_CODE: string;
  PHAN_LOAI: string;
  PLAN_ID: string;
  PLAN_DATE: string;
  PROD_REQUEST_NO: string;
  G_NAME: string;
  G_NAME_KD: string;
  PLAN_QTY: number;
  PLAN_TARGET_MET: number;
  PLAN_ORG_MET: number;
  PLAN_LOSS: number;
  EQ1: string;
  EQ2: string;
  PLAN_EQ: string;
  PLAN_FACTORY: string;
  PROCESS_NUMBER: number;
  STEP: number;
  M_NAME: string;
  WAREHOUSE_OUTPUT_QTY: number;
  TOTAL_OUT_QTY: number;
  USED_QTY: number;
  REMAIN_QTY: number;
  PD: number;
  CAVITY: number;
  SETTING_MET_TC: number;
  SETTING_DM_SX: number;
  NG_MET: number;
  SETTING_MET: number;
  NG_EA: number;
  SETTING_EA: number;
  WAREHOUSE_ESTIMATED_QTY: number;
  ESTIMATED_QTY_ST: number;
  ESTIMATED_QTY: number;
  KETQUASX: number;
  KETQUASX_TP?: number;
  LOSS_SX_ST: number;
  LOSS_SX: number;
  INS_INPUT: number;
  LOSS_SX_KT: number;
  INS_OUTPUT: number;
  LOSS_KT: number;
  SETTING_START_TIME: string;
  MASS_START_TIME: string;
  MASS_END_TIME: string;
  RPM: number;
  EQ_NAME_TT: string;
  SX_DATE: string;
  WORK_SHIFT: string;
  INS_EMPL: string;
  FACTORY: string;
  BOC_KIEM: number;
  LAY_DO: number;
  MAY_HONG: number;
  DAO_NG: number;
  CHO_LIEU: number;
  CHO_BTP: number;
  HET_LIEU: number;
  LIEU_NG: number;
  CAN_HANG: number;
  HOP_FL: number;
  CHO_QC: number;
  CHOT_BAOCAO: number;
  CHUYEN_CODE: number;
  CHO_FILM: number;
  K_CHO_DUYET: number;
  CHA_BAN: number;
  KHAC: number;
  REMARK: string;
  MACHINE_NAME: string;
  KQ_SX_TAM: number;
  id: number;
  XUATDAO: string;
  DKXL: string;
  XUATLIEU: string;
  CHOTBC: number;
  INSPECT_TOTAL_QTY: number;
  INSPECT_OK_QTY: number;
  LOSS_THEM_TUI: number;
  INSPECT_LOSS_QTY: number;
  INSPECT_TOTAL_NG: number;
  INSPECT_MATERIAL_NG: number;
  INSPECT_PROCESS_NG: number;
  SX_MARKING_QTY: number;
  NEXT_IN_QTY: number;
  NOT_BEEP_QTY: number;
  LOCK_QTY: number;
  BEEP_QTY: number;
  TON_KHO_AO: number;
  NEXT_OUT_QTY: number;
  RETURN_QTY: number;
  KETQUASX_M: number;
  IN_TEM?: string;
}
export interface RecentDM {
  G_CODE: string;
  PROCESS_NUMBER: number;
  TT_INPUT_QTY: number;
  TT_REMAIN_QTY: number;
  TT_USED_QTY: number;
  TT_SETTING_MET: number;
  TT_SX: number;
  TT_SX_RESULT: number;
  LOSS_SX: number;
}
export interface PROD_PLAN_CAPA_DATA {
  EQ_SERIES: string;
  PROD_DATE: string;
  LEADTIME: number;
  EQ_CAPA: number;
  EQ_CAPA_12H: number;
  RETAIN_WF_CAPA: number;
  ATT_WF_CAPA: number;
  RETAIN_WF_CAPA_12H: number;
  ATT_WF_CAPA_12H: number;
}
export interface DAILY_YCSX_RESULT {
  PLAN_DATE: string;
  TARGET1: number;
  INPUT1: number;
  RESULT1: number;
  LOSS1: number;
  TARGET2: number;
  INPUT2: number;
  RESULT2: number;
  LOSS2: number;
  TARGET3: number;
  INPUT3: number;
  RESULT3: number;
  LOSS3: number;
  TARGET4: number;
  INPUT4: number;
  RESULT4: number;
  LOSS4: number;
  INSP_QTY: number;
  INSP_LOSS: number;
  INSP_NG: number;
  INSP_OK: number;
  LOSS_KT: number;
}
export interface LONGTERM_PLAN_DATA {
  CTR_CD: string;
  G_CODE: string;
  UPH: number;
  PROCESS_NUMBER: number;
  EQ_NAME: string;
  PROD_REQUEST_QTY: number;
  KETQUASX: number;
  TON_YCSX: number;
  PLAN_DATE: string;
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
  D16: number;
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
  F_NEW: string;
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


export interface SX_KPI_NEW_DETAIL_DATA {
  CTR_CD: string;
  EQ_NAME: string;
  INS_EMPL: string;
  RUN_COUNT: number;
  INPUT_QTY: number;
  REMAIN_QTY: number;
  USED_QTY: number;
  DEFAULT_QTY: number;
  RATE_MET_TONG: number;
  RATE_MET_MAY: number;
  WORK_HOURS: number;
  REAL_RUN_HOURS: number;
  KPI_BY_MET: number;
  KPI: number;
}

export interface SX_KPI_NEW_SUMMARY_DATA {
  INS_EMPL: string;
  RUN_COUNT: number;
  TOTAL_SANLUONG: number;
  KPI: number;
  WORK_HOURS: number;
}

export interface DM_VITRI_KIEMTRA  {
  PHANLOAI: string;
  KPI_VALUE: number;
}

export interface DM_CODE_SX_KT {
  G_CODE: string;
  G_NAME_KD: string;
  DM_SX: number;
  DM_KT: number
}

export interface DM_MACHINE {
  EQ_NAME: string;
  DM_EA:number;
}

export interface KPI_MACHINE_DATA {
  EQ_SERIES: string;
  EQ_NAME:string;
  SX_YEAR:number;
  SX_MONTH:number;
  SX_YM:string;
  TOTAL_EA:number;
}
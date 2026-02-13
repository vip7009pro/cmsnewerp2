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
  id?: number | string;
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
  DOITUONG_NAME2?: string;
}
export interface CODEPHOI {
  G_CODE_MAU: string;
  G_NAME: string;
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
export interface RND_NEWCODE_BY_PRODTYPE {
  PROD_TYPE: string;
  NEWCODE: number;
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

export interface MASTER_MATERIAL_HSD {
  M_NAME: string;
  EXP_DATE: number;
}

export interface RND_FILM_SAVING_TREND_DATA {
  PLAN_DATE?: string;
  PLAN_YW?: string;
  PLAN_YM?: string;
  PLAN_YEAR?: string;
  PLAN_WEEK?: string;
  PLAN_MONTH?: string;
  FILM_QTY_LT: number;
  FILM_QTY_TT: number;
  SQM_TT: number;
  SQM_LT: number;
  SAVING_RATE: number;
  SQM_SAVING_RATE: number;
}

export interface DAOFILM_ERR_DATA {
  CTR_CD: string;
  ERR_CODE: string;
  CNT: number;
  RATE: number;
  ERR_NAME: string;
}
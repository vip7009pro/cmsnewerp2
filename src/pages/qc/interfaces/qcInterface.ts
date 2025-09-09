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
  PHANLOAI: string;
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
export interface OQC_NG_BY_PRODTYPE {
    PROD_TYPE: string;
    NG_LOT: number;
  }
  export interface OQC_NG_BY_CUSTOMER {
    CUST_NAME_KD: string;
    NG_LOT: number;
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
  export interface CHO_KIEM_DATA {
    G_CODE: string;
    G_NAME: string;
    G_NAME_KD: string;
    INSPECT_BALANCE_QTY: number;
    WAIT_CS_QTY: number;
    WAIT_SORTING_RMA: number;
    TOTAL_WAIT: number;
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
  export interface CNT_GAP_DATA2 {
    GAP: number;
    CNT_TOTAL: number;
    CNT_SX: number;
    CNT_QC: number;
    CNT_OK: number;
    RATE_SX: number;
    RATE_QC: number;
    RATE_OK: number;
  }
  export interface TRUOCHAN_BACK_DATA {
    PROD_REQUEST_NO: string;
    NGAY_GH: string;
    MAX_DATE: string;
    GAP: number;
  }
  export interface TRUOCHAN_BACK_DATA2 {
    PROD_REQUEST_NO: string;
    NGAY_GH: string;
    LAST_INPUT_DATE: string;
    LAST_OUTPUT_DATE: string;
    GAP: number;
    SX_CHAM: string;
    QC_CHAM: string;
  }
  export interface ALL_GAP_RATE_BACK_DATA {
    PROD_REQUEST_NO: string;
    NGAY_YC: string;
    MAX_DATE: string;
    GAP: number;
  }
  export interface KT_GAP_RATE_BACK_DATA {
    PROD_REQUEST_NO: string;
    MIN_DATE: string;
    MAX_DATE: string;
    GAP: number;
  }
  export interface SX_GAP_RATE_BACK_DATA {
    PROD_REQUEST_NO: string;
    MIN_DATE: string;
    MAX_DATE: string;
    GAP: number;
  }
  export interface KD_YC_GAP_RATE_BACK_DATA {
    PROD_REQUEST_NO: string;
    G_CODE: string;
    G_NAME_KD: string;
    G_NAME: string;
    EMPL_NO: string;
    PROD_REQUEST_DATE: string;
    DELIVERY_DT: string;
    NGAY_YC: string;
    NGAY_GH: string;
    GAP: number;
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

export interface IQC_TREND_DATA {
  INSPECT_DATE?: string;
  INSPECT_YEAR?: number;
  INSPECT_MONTH?: number;
  INSPECT_WEEK?: number;
  INSPECT_YM?: string;
  INSPECT_YW?: string;
  TEST_CNT: number;
  OK_CNT: number;
  NG_CNT: number;
  PD_CNT: number;
  NG_RATE: number;
}

export interface IQC_VENDOR_NGRATE_DATA {
  CUST_CD: string;
  CUST_NAME_KD: string;
  INSPECT_YEAR: number;
  INSPECT_WEEK?: number;
  INSPECT_YW?: string;
  INSPECT_MONTH?: number;
  INSPECT_YM?: string;
  TEST_CNT: number;
  OK_CNT: number;
  NG_CNT: number;
  PD_CNT: number;
  NG_RATE: number;
}

export interface IQC_FAILING_TREND_DATA {
  FAIL_YEAR: number;
  FAIL_WEEK: number;
  FAIL_YW: string;
  TOTAL_QTY: number;
  CLOSED_QTY: number;
  PENDING_QTY: number;
  COMPLETE_RATE: number;
}
export interface IQC_FAIL_PENDING
 {
  CUST_NAME_KD: string; 
  FAIL_QTY: number;
 }
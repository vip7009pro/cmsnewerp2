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
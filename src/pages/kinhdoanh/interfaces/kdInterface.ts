//PO kinh doanh
export interface POTableData {
    PO_ID: number;
    CUST_NAME_KD: string;
    PO_NO: string;
    G_NAME: string;
    G_NAME_KD: string;
    G_CODE: string;
    PO_DATE: string;
    RD_DATE: string;
    PROD_PRICE: string;
    PO_QTY: number;
    TOTAL_DELIVERED: number;
    PO_BALANCE: number;
    PO_AMOUNT: number;
    DELIVERED_AMOUNT: number;
    BALANCE_AMOUNT: number;
    TON_KIEM: number;
    BTP: number;
    TP: number;
    BLOCK_QTY: number;
    GRAND_TOTAL_STOCK: number;
    EMPL_NAME: string;
    PROD_TYPE: string;
    M_NAME_FULLBOM: string;
    PROD_MAIN_MATERIAL: string;
    CUST_CD: string;
    EMPL_NO: string;
    POMONTH: string;
    POWEEKNUM: string;
    OVERDUE: string;
    REMARK: string;
    FINAL: string;
  }
  export interface POSummaryData {
    total_po_qty: number;
    total_delivered_qty: number;
    total_pobalance_qty: number;
    total_po_amount: number;
    total_delivered_amount: number;
    total_pobalance_amount: number;
  }
  export interface CodeListData {
    G_CODE: string;
    G_NAME: string;
    G_NAME_KD?: string;
    PROD_LAST_PRICE: number;
    USE_YN: string;
    PO_BALANCE?: number;
  }
  export interface XUATKHOPODATA {
    CUST_CD: string;
    CUST_NAME_KD: string;
    G_CODE: string;
    G_NAME_KD: string;
    G_NAME: string;
    OUT_DATE: string;
    PO_NO: string;
    PO_QTY: string;
    DELIVERY_QTY: string;
    PO_BALANCE: string;
    THISDAY_OUT_QTY: string;
    CHECKSTATUS: string;
  }
  export interface CodeListDataUpGia {
    G_CODE: string;
    G_NAME: string;
    G_NAME_KD: string;
    PROD_MAIN_MATERIAL: string;
  }
  export interface CustomerListData {
    CUST_CD: string;
    CUST_NAME_KD: string;
    CUST_NAME?: string;
  }
  export interface PRICEWITHMOQ {
    CUST_NAME_KD: string;
    CUST_CD: string;
    G_CODE: string;
    G_NAME: string;
    PROD_MAIN_MATERIAL: string;
    PRICE_DATE: string;
    MOQ: number;
    PROD_PRICE: number;
    BEP: number;
    INS_DATE: string;
    INS_EMPL: string;
    UPD_DATE: string;
    UPD_EMPL: string;
    REMARK: string;
    FINAL: string;
  }
  //Invoice kinh doanh
  export interface InvoiceTableData {
    DELIVERY_ID: number;
    CUST_CD: string;
    CUST_NAME_KD: string;
    EMPL_NO: string;
    EMPL_NAME: string;
    G_CODE: string;
    G_NAME: string;
    G_NAME_KD: string;
    PO_NO: string;
    PO_DATE: string;
    RD_DATE: string;
    DELIVERY_DATE: string;
    DELIVERY_QTY: number;
    PROD_PRICE: string;
    DELIVERED_AMOUNT: number;
    REMARK: string;
    INVOICE_NO: string;
    PROD_TYPE: string;
    PROD_MODEL: string;
    PROD_PROJECT: string;
    YEARNUM: number;
    WEEKNUM: number;
    OVERDUE: string;
  }
  export interface InvoiceSummaryData {
    total_po_qty: number;
    total_delivered_qty: number;
    total_pobalance_qty: number;
    total_po_amount: number;
    total_delivered_amount: number;
    total_pobalance_amount: number;
  }
  //Plan kinh doanh
  export interface PlanTableData {
    PLAN_ID: string;
    EMPL_NAME: string;
    EMPL_NO: string;
    CUST_NAME_KD: string;
    CUST_CD: string;
    G_CODE: string;
    G_NAME_KD: string;
    G_NAME: string;
    PROD_TYPE: string;
    PROD_MAIN_MATERIAL: string;
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
    REMARK: string;
  }
  //FCST kinh doanh
  export interface FCSTTableData {
    EMPL_NO?: string;
    FCST_ID: number;
    FCSTYEAR: number;
    FCSTWEEKNO: number;
    G_CODE: string;
    G_NAME_KD: string;
    G_NAME: string;
    EMPL_NAME: string;
    CUST_NAME_KD: string;
    PROD_PROJECT: string;
    PROD_MODEL: string;
    PROD_MAIN_MATERIAL: string;
    PROD_PRICE: number;
    W1: number;
    W2: number;
    W3: number;
    W4: number;
    W5: number;
    W6: number;
    W7: number;
    W8: number;
    W9: number;
    W10: number;
    W11: number;
    W12: number;
    W13: number;
    W14: number;
    W15: number;
    W16: number;
    W17: number;
    W18: number;
    W19: number;
    W20: number;
    W21: number;
    W22: number;
    W1A: number;
    W2A: number;
    W3A: number;
    W4A: number;
    W5A: number;
    W6A: number;
    W7A: number;
    W8A: number;
    W9A: number;
    W10A: number;
    W11A: number;
    W12A: number;
    W13A: number;
    W14A: number;
    W15A: number;
    W16A: number;
    W17A: number;
    W18A: number;
    W19A: number;
    W20A: number;
    W21A: number;
    W22A: number;
  }
  //Shortage kinh doanh
  export interface ShortageData {
    ST_ID: number;
    PLAN_DATE: string;
    CUST_NAME_KD: string;
    PO_BALANCE: number;
    TON_TP: number;
    BTP: number;
    G_NAME: string;
    TONG_TON_KIEM: number;
    D1_9H: number;
    D1_13H: number;
    D1_19H: number;
    D1_21H: number;
    D1_23H: number;
    D2_9H: number;
    D2_13H: number;
    D2_21H: number;
    D3_SANG: number;
    D3_CHIEU: number;
    D4_SANG: number;
    D4_CHIEU: number;
    TODAY_TOTAL: number;
    TODAY_THIEU: number;
    UPH: number;
    PRIORITY: number;
  }
  //po stock full
  export interface POFullCMS {
    G_CODE: string;
    G_NAME: string;
    G_NAME_KD: string;
    PO_QTY: number;
    TOTAL_DELIVERED: number;
    PO_BALANCE: number;
    CHO_KIEM: number;
    CHO_CS_CHECK: number;
    CHO_KIEM_RMA: number;
    TONG_TON_KIEM: number;
    BTP: number;
    WAIT_INPUT_WH: number;
    TON_TP: number;
    BLOCK_QTY: number;
    GRAND_TOTAL_STOCK: number;
    THUA_THIEU: number;
    YCSX_BALANCE: number;
    YCSX_QTY: number;
    KETQUASX: number;
    NHAPKHO: number;
  }
  export interface POFullSummary {
    PO_BALANCE: number;
    TP: number;
    CNK: number;
    BTP: number;
    CK: number;
    BLOCK: number;
    TONG_TON: number;
    THUATHIEU: number;
  }
  // quan ly khach hang
  export interface CUST_INFO {
    id: string;
    CUST_TYPE: string;
    CUST_CD: string;
    CUST_NAME_KD: string;
    CUST_NAME: string;
    CUST_ADDR1: string;
    CUST_ADDR2: string;
    CUST_ADDR3: string;
    EMAIL: string;
    TAX_NO: string;
    CUST_NUMBER: string;
    BOSS_NAME: string;
    TEL_NO1: string;
    FAX_NO: string;
    CUST_POSTAL: string;
    REMK: string;
    USE_YN: string;
    INS_DATE: string;
    INS_EMPL: string;
    UPD_DATE: string;
    UPD_EMPL: string;
  }
  //ycsx manager
  export interface POBALANCETDYCSX {
    G_CODE: string;
    PO_BALANCE: number;
  }
  export interface TONKHOTDYCSX {
    G_CODE: string;
    CHO_KIEM: number;
    CHO_CS_CHECK: number;
    CHO_KIEM_RMA: number;
    TONG_TON_KIEM: number;
    BTP: number;
    TON_TP: number;
    BLOCK_QTY: number;
    GRAND_TOTAL_STOCK: number;
  }
  export interface FCSTTDYCSX {
    G_CODE: string;
    W1: number;
    W2: number;
    W3: number;
    W4: number;
    W5: number;
    W6: number;
    W7: number;
    W8: number;
  }
  export interface YCSXTableData {
    id?: number;
    DAUPAMZ: string;
    DACHITHI: string;
    DESCR?: string;
    PDBV_EMPL?: string;
    PDBV_DATE?: string;
    PDBV?: string;
    BANVE?: string;
    PROD_MAIN_MATERIAL?: string;
    PROD_TYPE?: string;
    EMPL_NO: string;
    CUST_CD: string;
    G_CODE: string;
    G_NAME: string;
    G_NAME_KD: string;
    EMPL_NAME: string;
    CUST_NAME_KD: string;
    PROD_REQUEST_NO: string;
    PROD_REQUEST_DATE: string;
    PROD_REQUEST_QTY: number;
    LOT_TOTAL_INPUT_QTY_EA: number;
    LOT_TOTAL_OUTPUT_QTY_EA: number;
    INSPECT_BALANCE: number;
    SHORTAGE_YCSX: number;
    YCSX_PENDING: number;
    PHAN_LOAI: string;
    REMARK: string;
    PO_TDYCSX: number;
    TOTAL_TKHO_TDYCSX: number;
    TKHO_TDYCSX: number;
    BTP_TDYCSX: number;
    CK_TDYCSX: number;
    BLOCK_TDYCSX: number;
    FCST_TDYCSX: number;
    W1: number;
    W2: number;
    W3: number;
    W4: number;
    W5: number;
    W6: number;
    W7: number;
    W8: number;
    PDUYET: number;
    LOAIXH: string;
    PO_BALANCE?: number;
    EQ1: string;
    EQ2: string;
    CD1: number;
    CD2: number;
    TON_CD1: number;
    TON_CD2: number;
    EQ3: string;
    EQ4: string;
    CD3: number;
    CD4: number;
    TON_CD3: number;
    TON_CD4: number;
    UPH1: number;
    UPH2: number;
    UPH3: number;
    UPH4: number;
    FACTORY: string;
    Setting1: number;
    Setting2: number;
    Setting3: number;
    Setting4: number;
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
    PL_HANG?: string;
    DELIVERY_DT?: string;
    SETVL?: string;
    G_WIDTH?: number;
    G_LENGTH?: number;
    PROD_PRINT_TIMES?: number;
    G_C?: number;
    G_C_R?: number;
    LOSS_KT?: number;
    SLC_CD1?: number;
    SLC_CD2?: number;
    SLC_CD3?: number;
    SLC_CD4?: number;
    USE_YN?: string;
    INS_DATE?: string;
    UPD_DATE?: string;
    MATERIAL_YN?: string;
    IS_TAM_THOI?: string;
    FL_YN?: string;
  }
  export interface UploadAmazonData {
    G_CODE?: string;
    PROD_REQUEST_NO?: string;
    NO_IN?: string;
    ROW_NO?: number;
    DATA1?: string;
    DATA2?: string;
    DATA3?: string;
    DATA4?: string;
    STATUS?: string;
    INLAI_COUNT?: number;
    REMARK?: string;
  }
  export interface PONOLIST {
    G_CODE: string;
    CUST_CD: string;
    PO_NO: string;
    PO_DATE: string;
    RD_DATE: string;
    PO_QTY: number;
  }
  //Amazon data
  export interface AMAZON_DATA {
    G_NAME: string;
    G_CODE: string;
    PROD_REQUEST_NO: string;
    NO_IN: string;
    ROW_NO: number;
    DATA_1: string;
    DATA_2: string;
    DATA_3: string;
    DATA_4: string;
    PRINT_STATUS: string;
    INLAI_COUNT: number;
    REMARK: string;
    INS_DATE: string;
    INS_EMPL: string;
  }
  //ycsx component
  export interface YCSX {
    PROD_REQUEST_NO: string;
    G_CODE: string;
  }
  export interface TONVL {
    M_CODE: string;
    M_NAME: string;
    WIDTH_CD: number;
    TON_DAU: number;
    INPUT: number;
    OUTPUT: number;
    RETURN_IN: number;
    HOLDING: number;
    GRAND_TOTAL: number;
  }
  export interface FullBOM {
    PDBV?: string;
    NO_INSPECTION?: string;
    PDUYET?: number;
    REMK: string;
    PROD_REQUEST_QTY: number;
    PROD_REQUEST_NO: string;
    PROD_REQUEST_DATE: string;
    G_CODE: string;
    DELIVERY_DT: string;
    CODE_55: string;
    CODE_50: string;
    RIV_NO: string;
    M_QTY: number;
    M_CODE: string;
    CUST_NAME: string;
    ROLE_EA_QTY: number;
    PACK_DRT: string;
    PROD_PRINT_TIMES: number;
    G_WIDTH: number;
    G_SG_R: number;
    G_SG_L: number;
    G_R: number;
    G_NAME: string;
    G_LG: number;
    G_LENGTH: number;
    G_CODE_C: string;
    G_CG: number;
    G_C: number;
    G_C_R: number;
    PD: number;
    CODE_33: string;
    M_NAME: string;
    WIDTH_CD: number;
    EMPL_NO: string;
    EMPL_NAME: string;
    CODE_03: string;
    REMARK: string;
    TONLIEU: number;
    HOLDING: number;
    TONG_TON_LIEU: number;
    IQC_STOCK?: number;
    PO_TYPE?: string;
    FSC: string;
    PROD_MAIN_MATERIAL?: string;
    LIEUQL_SX?: number;
    G_NAME_KD: string;
    PROD_DIECUT_STEP: number;
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
    PROD_TYPE?: string;
    PL_HANG?: string;
    FSC_CODE?: string;
    USE_YN?: string;
    EXP_DATE?: number;
    PD_HSD?: string;
    QL_HSD?: string;
    IS_TAM_THOI?: string;
  }

  export interface PROD_OVER_DATA {
    AUTO_ID: number;
    EMPL_NO: string;
    CUST_NAME_KD: string;
    G_CODE: string;
    G_NAME: string;
    G_NAME_KD: string;
    PROD_REQUEST_NO: string;
    PLAN_ID: string;
    OVER_QTY: number;
    KD_CFM: string;
    KD_EMPL_NO: string;
    KD_CF_DATETIME: string;
    HANDLE_STATUS: string;
    INS_DATE: string;
    INS_EMPL: string;
    UPD_DATE: string;
    UPD_EMPL: string;
    KD_REMARK: string;
    PROD_REQUEST_QTY: number;
  }

  //calc tinh gia
export interface BANGGIA_DATA_CALC {
    id: number;
    CUST_CD: string;
    G_CODE: string;
    PRICE_DATE: string;
    MOQ: number;
    PROD_PRICE: number;
    BEP: number;
    INS_DATE: string;
    INS_EMPL: string;
    UPD_DATE: string;
    UPD_EMPL: string;
    REMARK: string;
    FINAL: string;
  }
  export interface CODEDATA {
    id: number;
    Q_ID: string;
    G_CODE: string;
    WIDTH_OFFSET: number;
    LENGTH_OFFSET: number;
    KNIFE_UNIT: number;
    FILM_UNIT: number;
    INK_UNIT: number;
    LABOR_UNIT: number;
    DELIVERY_UNIT: number;
    DEPRECATION_UNIT: number;
    GMANAGEMENT_UNIT: number;
    M_LOSS_UNIT: number;
    G_WIDTH: number;
    G_LENGTH: number;
    G_C: number;
    G_C_R: number;
    G_LG: number;
    G_CG: number;
    G_SG_L: number;
    G_SG_R: number;
    PROD_PRINT_TIMES: number;
    KNIFE_COST: number;
    FILM_COST: number;
    INK_COST: number;
    LABOR_COST: number;
    DELIVERY_COST: number;
    DEPRECATION_COST: number;
    GMANAGEMENT_COST: number;
    MATERIAL_COST: number;
    TOTAL_COST: number;
    SALE_PRICE: number;
    PROFIT: number;
    G_NAME: string;
    G_NAME_KD: string;
    CUST_NAME_KD: string;
    CUST_CD: string;
  }
  export interface GIANVL {
    mCutWidth: number;
    mLength: number;
    mArea: number;
    giaVLSS: number;
    giaVLCMS: number;
    knife_cost: number;
    film_cost: number;
    ink_cost: number;
    labor_cost: number;
    delivery_cost: number;
    deprecation_cost: number;
    gmanagement_cost: number;
    totalcostCMS: number;
    totalcostSS: number;
  }
  //price manager
  export interface BANGGIA_DATA {
    CUST_NAME_KD: string;
    G_NAME: string;
    G_NAME_KD: string;
    PROD_MAIN_MATERIAL: string;
    MOQ: number;
    PRICE1: number;
    PRICE2: number;
    PRICE3: number;
    PRICE4: number;
    PRICE5: number;
    PRICE6: number;
    PRICE7: number;
    PRICE8: number;
    PRICE9: number;
    PRICE10: number;
    PRICE11: number;
    PRICE12: number;
    PRICE13: number;
    PRICE14: number;
    PRICE15: number;
    PRICE16: number;
    PRICE17: number;
    PRICE18: number;
    PRICE19: number;
    PRICE20: number;
    PRICE_DATE1: string;
    PRICE_DATE2: string;
    PRICE_DATE3: string;
    PRICE_DATE4: string;
    PRICE_DATE5: string;
    PRICE_DATE6: string;
    PRICE_DATE7: string;
    PRICE_DATE8: string;
    PRICE_DATE9: string;
    PRICE_DATE10: string;
    PRICE_DATE11: string;
    PRICE_DATE12: string;
    PRICE_DATE13: string;
    PRICE_DATE14: string;
    PRICE_DATE15: string;
    PRICE_DATE16: string;
    PRICE_DATE17: string;
    PRICE_DATE18: string;
    PRICE_DATE19: string;
    PRICE_DATE20: string;
  }
  export interface BANGGIA_DATA2 {
    id: number;
    PROD_ID: number;
    CUST_NAME_KD?: string;
    CUST_CD?: string;
    G_CODE?: string;
    G_NAME?: string;
    G_NAME_KD?: string;
    DESCR?: string;
    PROD_DVT?: string;
    PROD_MAIN_MATERIAL?: string;
    PRICE_DATE: string;
    MOQ: number;
    PROD_PRICE: number;
    BEP: number;
    INS_DATE: string;
    INS_EMPL: string;
    UPD_DATE: string;
    UPD_EMPL: string;
    REMARK: string;
    FINAL: string;
    G_WIDTH: number;
    G_LENGTH: number;
    G_NAME_KT: string;
    EQ1: string;
    EQ2: string;
    EQ3: string;
    EQ4: string;
    DUPLICATE: number;
  }

  export interface DEFAULT_DM {
    id: number;
    WIDTH_OFFSET: number;
    LENGTH_OFFSET: number;
    KNIFE_UNIT: number;
    FILM_UNIT: number;
    INK_UNIT: number;
    LABOR_UNIT: number;
    DELIVERY_UNIT: number;
    DEPRECATION_UNIT: number;
    GMANAGEMENT_UNIT: number;
    M_LOSS_UNIT: number;
  }

  export interface CUSTOMER_REVENUE_DATA {
  CUST_NAME_KD: string;
  DELIVERY_AMOUNT: number;
}
export interface PIC_REVENUE_DATA {
  EMPL_NAME: string;
  DELIVERY_AMOUNT: number;
}
export interface WeeklyClosingData {
  DEL_YEAR: string;
  DEL_WEEK: string;
  DEL_YW: string;
  DELIVERY_QTY: number;
  DELIVERED_AMOUNT: number;
  KPI_VALUE?: number;
}
export interface DailyClosingData {
  DELIVERY_DATE: string;
  DELIVERY_QTY: number;
  DELIVERED_AMOUNT: number;
  KPI_VALUE?: number;
}

export interface RunningPOData {
  PO_YEAR: number;
  PO_WEEK: number;
  YEAR_WEEK: string;
  RUNNING_PO_QTY: number;
  RUNNING_DEL_QTY: number;
  RUNNING_PO_BALANCE: number;
  RUNNING_PO_AMOUNT: number;
  RUNNING_DEL_AMOUNT: number;
  RUNNING_BALANCE_AMOUNT: number;
}
export interface MonthlyClosingData {
  MONTH_YW: string;
  MONTH_YEAR: string;
  MONTH_NUM: string;
  DELIVERY_QTY: number;
  DELIVERED_AMOUNT: number;
  KPI_VALUE?: number;
}
export interface WeekLyPOData {
  PO_YEAR: number;
  PO_WEEK: number;
  YEAR_WEEK: string;
  WEEKLY_PO_QTY: number;
  WEEKLY_PO_AMOUNT: number;
}
export interface WeeklyClosingData {
  CUST_NAME_KD: string;
  DELIVERY_AMOUNT: number;
}
export interface OVERDUE_DATA {
  DELIVERY_DATE?: string;
  YEARNUM?: string;
  DEL_YM?: string;
  DEL_YW?: string;
  TOTAL_IV: number;
  OK_IV: number;
  OVER_IV: number;
  OK_RATE: number;
}
export interface YearlyClosingData {
  YEAR_NUM: string;
  DELIVERY_QTY: number;
  DELIVERED_AMOUNT: number;
  KPI_VALUE?: number;
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

export interface YCTKData {
  CTR_CD: string;
  REQ_ID: number;
  CUST_CD: string;
  G_CODE: string;
  G_NAME: string;
  G_NAME_KD: string;
  CUST_NAME_KD: string;
  DESIGN_REQUEST_DATE: string;
  ESTIMATED_PO: number;
  MATERIAL: string;
  Coating_KhongPhu: boolean;
  Coating_LamiBong: boolean;
  Coating_OpamMo: boolean;
  Coating_UVBong: boolean;
  Coating_UVMo: boolean;
  LabelWidth: number;
  LabelHeight: number;
  Tolerance: number;
  FaceOut: number;
  FaceIn: number;
  TopBottomSpacing: number;
  BetweenLabelSpacing: number;
  LinerSpacing: number;
  CornerRadius: number;
  AdhesiveRemoval: boolean;
  HasToothCut: boolean;
  DieCutType: string;
  LabelForm: string;
  LabelFormQty: number;
  RollCore: string;
  PrintYN: string;
  DecalType: string;
  ApproveType: string;
  SpecialRequirement: string;
  SpecialRequirementLevel: number;
  SAMPLE_STATUS: string;
  RND_EMPL: string;
  QC_EMPL: string;
  KD_EMPL: string;
  INS_DATE: string;
  INS_EMPL: string;
  UPD_DATE: string;
  UPD_EMPL: string;
  Co_Sx_Mau: boolean;
  ManualCloseStatus: boolean;
  FINAL_STATUS: string;
}

export interface YCTK_TREND_DATA  {
  REQ_DATE?: string;
  REQ_YEAR?: number;
  REQ_WEEK?: number;
  REQ_YW?: string;
  REQ_MONTH?: number;
  REQ_YM?: string;
  COMPLETED: number;
  PENDING: number;
  TOTAL: number;
  RATE: number;
}

export interface PO_BALANCE_DETAIL {
  PO_YW: string;
  PO_YEAR: number;
  PO_WEEK: number;
  PO_QTY: number;
  DELIVERY_QTY: number;
  PO_BALANCE: number;
}

export interface PO_BALANCE_SUMMARY 
{
  PO_YEAR: number;
  PO_BALANCE: number;
}

export interface PO_BALANCE_CUSTOMER 
{
  CUST_CD: string;
  PO_YW: string;
  PO_YEAR: number;
  PO_WEEK: number;
  PO_QTY: number;
  DELIVERY_QTY: number;
  PO_BALANCE: number;
  CUST_NAME_KD: string;
}
export interface PO_BALANCE_CUSTOMER_BY_YEAR 
{
  CUST_NAME_KD: string;
  PO_BALANCE: number;
}

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

  export interface MSTOCK_BY_POPULAR_DATA {
    PHANLOAI: string;
    TOTAL_STOCK: number;
  }
  export interface MSTOCK_BY_POPULAR_DETAIL_DATA {
    M_CODE: string;
    M_NAME: string;
    WIDTH_CD: number;
    STOCK_SQM: number;
    PHANLOAI: string;
  }

  export interface M_INPUT_BY_POPULAR_DATA {
    PHANLOAI: string;
    IN_SQM: number;
  }
  export interface M_INPUT_BY_POPULAR_DETAIL_DATA {
    M_CODE: string;
    M_NAME: string;
    WIDTH_CD: number;
    IN_SQM: number;
    PHANLOAI: string;
  }

  export interface M_OUTPUT_BY_POPULAR_DATA {
    PHANLOAI: string;
    OUT_SQM: number;
  }
  export interface M_OUTPUT_BY_POPULAR_DETAIL_DATA {
    M_CODE: string;
    M_NAME: string;
    WIDTH_CD: number;
    OUT_SQM: number;
    PHANLOAI: string;
  }

  export interface M_STOCK_BY_MONTH_DATA {
    PHANLOAI: string;
    TOTAL_STOCK: number;
  }
  export interface M_STOCK_BY_MONTH_DETAIL_DATA {
    M_CODE: string;
    M_NAME: string;
    WIDTH_CD: number;
    STOCK_SQM: number;
    PHANLOAI: string;
  }
  export interface P_STOCK_BY_MONTH_DATA {
    PHANLOAI: string;
    TOTAL_STOCK: number;
  }
  export interface P_STOCK_BY_MONTH_DETAIL_DATA {
    G_CODE: string;
    G_NAME: string;
    G_NAME_KD: string;
    TOTAL_STOCK: number;
    PHANLOAI: string;
  }
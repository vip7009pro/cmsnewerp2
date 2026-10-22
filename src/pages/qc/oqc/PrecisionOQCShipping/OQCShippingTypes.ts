export interface OQC_SHIPPING_ROW {
  OUT_ID_KEY: string;
  WEEK_: number;
  OUT_SHIFT: string;
  OUT_DATE: string;
  PO_TYPE: string;
  CUST_NAME_KD: string;
  OUT_CUST_NAME: string;
  G_CODE: string;
  G_NAME: string;
  PLAN_ID: string;
  OUT_QTY: number;
  SAMPLING_QTY: number;
  SAMPLE_NG_QTY_TT: number;
  RATE_OK: number;
  OUT_STATUS_RESULT: string;
  id?: number | string;
}

export interface OQCShippingFilterState {
  fromdate: string;
  todate: string;
  gName: string;
  gCode: string;
  custName: string;
}

export interface OQCShippingKpiMetrics {
  totalLots: number;
  passLots: number;
  pendingLots: number;
  passRate: number;
  totalOutQty: number;
  totalSamplingQty: number;
  totalSampleNgQty: number;
  sampleNgPpm: number;
  avgRateOk: number;
  uniqueCodesCount: number;
  uniqueCustomersCount: number;
  shiftDayCount: number;
  shiftNightCount: number;
}

export interface Equipment {
  EQ_ID: number;
  CTR_CD: string;
  EQ_NAME: string;
  CONTROL_NO: string;
  SERIES_MODEL: string;
  MAKER: string;
  IMAGE_URL: string;
  STATUS: string;
  DEPARTMENT: string;
  LOCATION: string;
  CAL_PERIOD?: number;
  LAST_CAL_DATE?: string;
  NEXT_CAL_DATE?: string;
  STAMP_IMAGE_URL?: string;
  INS_DATE: string;
  INS_EMPL: string;
  UPD_DATE: string;
  UPD_EMPL: string;
  id?: number;
}

export interface CalibrationHistory {
  CAL_ID: number;
  CTR_CD: string;
  EQ_ID: number;
  CAL_DATE: string;
  NEXT_CAL_DATE: string;
  CAL_PERIOD: number;
  STAMP_IMAGE_URL: string;
  CAL_PERSON: string;
  REMARK: string;
  INS_DATE: string;
  INS_EMPL: string;
  UPD_DATE: string;
  UPD_EMPL: string;
  id?: number;
}

export interface CalibrationKpiData {
  totalCount: number;
  inUseCount: number;
  brokenCount: number;
  overdueCount: number;
  dueSoonCount: number;
  validCount: number;
}

export type UrgencyFilter = "ALL" | "OVERDUE" | "DUE_SOON" | "VALID" | "BROKEN";

export interface ImagePreviewState {
  isOpen: boolean;
  title: string;
  imageUrl: string;
}

import { AUDIT_HISTORY_DATA } from "../../../interfaces/qcInterface";

export interface AuditHistoryKpiData {
  totalCount: number;
  passCount: number;
  failCount: number;
  passRate: number;
  avgScore: number;
  avgMaxScore: number;
  hasFileCount: number;
  hasFileRate: number;
}

export interface CustomerOption {
  CUST_CD: string;
  CUST_NAME_KD: string;
  [key: string]: any;
}

export interface AuditFormState {
  id?: number;
  CTR_CD?: string;
  CUST_CD: string;
  CUST_NAME_KD: string;
  AUDIT_ID: number | string;
  AUDIT_DATE: string;
  AUDIT_NAME: string;
  AUDIT_MAX_SCORE: number | string;
  AUDIT_SCORE: number | string;
  AUDIT_PASS_SCORE: number | string;
  AUDIT_RESULT?: string;
  AUDIT_FILE_EXT?: string;
}

export type DialogMode = "add" | "edit" | null;

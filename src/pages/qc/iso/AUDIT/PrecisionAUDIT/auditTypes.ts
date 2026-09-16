import { CustomerListData } from "../../../kinhdoanh/interfaces/kdInterface";
import {
  AUDIT_CHECK_LIST,
  AUDIT_CHECKLIST_RESULT,
  AUDIT_LIST,
  AUDIT_RESULT,
} from "../../interfaces/qcInterface";

export type {
  CustomerListData,
  AUDIT_CHECK_LIST,
  AUDIT_CHECKLIST_RESULT,
  AUDIT_LIST,
  AUDIT_RESULT,
};

export interface AUDITKpiMetrics {
  totalItems: number;
  evaluatedItems: number;
  totalScore: number;
  maxScore: number;
  passScore: number;
  scoreRate: number;
  isPass: boolean;
  evidentCount: number;
  evidentRate: number;
  selectedAuditName: string;
  selectedAuditDate: string;
  selectedInsEmpl: string;
  totalBatches: number;
}

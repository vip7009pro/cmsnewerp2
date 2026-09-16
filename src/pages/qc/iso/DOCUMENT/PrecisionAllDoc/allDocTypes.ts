import { DOCUMENT_DATA, ALL_FILE_DATA, DOC_CATEGORY1_DATA, DOC_CATEGORY2_DATA, DOC_LIST_DATA } from "../../../interfaces/qcInterface";

export interface AllDocFilterValues {
  DOC_NAME: string;
  DOC_ID: number;
  CAT_ID: number;
  DOC_CAT_ID: number;
}

export interface AllDocKpiData {
  totalCount: number;
  activeCount: number;
  expiredCount: number;
  expiringSoonCount: number;
  pdfCount: number;
  officeCount: number;
}

export interface UploadModalState {
  isOpen: boolean;
  CAT_ID: number;
  DOC_CAT_ID: number;
  DOC_ID: number;
  DOC_NAME: string;
  REG_DATE: string;
  EXP_DATE: string;
  HSD_YN: string;
  file: File | null;
}

export interface UpdateModalState {
  isOpen: boolean;
  REG_DATE: string;
  EXP_DATE: string;
  HSD_YN: string;
  USE_YN: string;
}

export { DOCUMENT_DATA, ALL_FILE_DATA, DOC_CATEGORY1_DATA, DOC_CATEGORY2_DATA, DOC_LIST_DATA };

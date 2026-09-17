import { FullBOM } from "../../../kinhdoanh/interfaces/kdInterface";
import { SAMPLE_MONITOR_DATA } from "../../interfaces/rndInterface";

export type ExtendedSampleData = Partial<Omit<SAMPLE_MONITOR_DATA, 'DELIVERY_DT' | 'APPROVE_DATE' | 'INS_DATE'>> & {
  FILE_MAKET?: string;
  FILM_FILE?: string;
  KNIFE_STATUS?: string;
  KNIFE_CODE?: string;
  FILM?: string;
  PRINT_STATUS?: string;
  DIECUT_STATUS?: string;
  QC_STATUS?: string;
  MATERIAL_STATUS?: string;
  DELIVERY_DT?: string | null;
  APPROVE_DATE?: string | null;
  INS_DATE?: string | null;
  SAMPLE_ID?: any;
  APPROVE_STATUS?: any;
  USE_YN?: any;
  REMARK?: any;
  PROD_REQUEST_NO?: any;
  G_CODE?: any;
  G_NAME?: any;
  G_NAME_KD?: any;
  CUST_NAME_KD?: any;
  id?: number;
  TOTAL_STATUS?: string;
  [key: string]: any;
};

export interface SampleKpiData {
  totalSamples: number;
  completedSamples: number;
  approvedSamples: number;
  rejectedSamples: number;
  pendingApproveSamples: number;
  lockedSamples: number;
  activeSamples: number;
  rndCompleted: number;
  materialCompleted: number;
  sxCompleted: number;
  qcCompleted: number;
}

export type StatusFilterType = 'ALL' | 'COMPLETED' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'LOCKED';

export interface UseSampleMonitorDataReturn {
  data: ExtendedSampleData[];
  filteredData: ExtendedSampleData[];
  selectedSampleRef: React.MutableRefObject<ExtendedSampleData[]>;
  clickedRow: ExtendedSampleData | null;
  setClickedRow: (row: ExtendedSampleData) => void;
  prodRequestNo: string;
  setProdRequestNo: (val: string) => void;
  reqID: number;
  setReqID: (val: number) => void;
  ycsxInfo: FullBOM[];
  isLoading: boolean;
  userDept: string;
  kpiData: SampleKpiData;
  statusFilter: StatusFilterType;
  setStatusFilter: (filter: StatusFilterType) => void;
  searchKeyword: string;
  setSearchKeyword: (keyword: string) => void;
  loadSampleListTable: (silent?: boolean) => void;
  handleAddSample: () => void;
  handleUpdateDataRow: () => Promise<void>;
  handleLockSample: (lockValue: 'Y' | 'N') => Promise<void>;
  updateDataTable: (dataRow: ExtendedSampleData, key: string, value: any) => void;
  handleCellCheckboxChange: (row: ExtendedSampleData, key: string, checked: boolean) => void;
  handleExportExcel: (type: 'current' | 'all') => void;
}

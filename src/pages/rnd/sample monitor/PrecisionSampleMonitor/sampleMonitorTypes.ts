import { SAMPLE_MONITOR_DATA } from "../interfaces/rndInterface";
import { FullBOM } from "../../kinhdoanh/interfaces/kdInterface";

export interface ExtendedSampleData extends SAMPLE_MONITOR_DATA {
  id?: number;
  TOTAL_STATUS?: string;
}

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

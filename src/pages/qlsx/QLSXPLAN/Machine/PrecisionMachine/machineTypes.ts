import { DINHMUC_QSLX, EQ_STT, MACHINE_LIST, QLSXCHITHIDATA, QLSXPLANDATA, RecentDM } from "../../interfaces/khsxInterface";
import { YCSXTableData } from "../../../../kinhdoanh/interfaces/kdInterface";

// KPI tóm tắt sàn sản xuất realtime
export interface MachineKpiData {
  activeMachines: number;
  totalMachines: number;
  completedQty: number;
  totalTargetQty: number;
  waitingMaterialCount: number;
  waitingMachineNames: string[];
  currentShift: string;
}

// Cấu hình thông tin từng Dòng máy (Line Group)
export interface MachineLineConfig {
  series: string;
  name: string;
  description: string;
  gradientClass: string;
  accentColor: string;
  targetQty: number;
  avgOee: number;
}

// Trạng thái tìm kiếm YCSX trong Modal Plan
export interface YCSXFilterState {
  fromdate: string;
  todate: string;
  codeKD: string;
  codeCMS: string;
  empl_name: string;
  cust_name: string;
  prod_type: string;
  prodrequestno: string;
  phanloai: string;
  material: string;
  ycsxpendingcheck: boolean;
  inspectInputcheck: boolean;
  materialYES: boolean;
  alltime: boolean;
  tempDM: boolean;
}

// Cấu trúc DataDinhMuc của 4 công đoạn
export interface DataDinhMucState {
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
  LOSS_KT: number;
  NOTE: string;
}

// Hook Return Types cho Machine Data chính
export interface UseMachineDataReturn {
  factory: "NM1" | "NM2";
  setFactory: (f: "NM1" | "NM2") => void;
  selectedPlanDate: string;
  setSelectedPlanDate: (date: string) => void;
  selected_eq: string[];
  setSelected_eq: (lines: string[]) => void;
  eq_series: string[];
  eq_status: EQ_STT[];
  plandatatable: QLSXPLANDATA[];
  kpiData: MachineKpiData;
  isLoading: boolean;
  refreshAll: () => Promise<void>;
  handleAutoDispatch: () => Promise<void>;
  showPlanWindow: boolean;
  setShowPlanWindow: (show: boolean) => void;
  selectedMachine: string;
  setSelectedMachine: (m: string) => void;
  selectedFactory: string;
  setSelectedFactory: (f: string) => void;
  openPlanModal: (machineName: string, factory: string) => void;
}

// Hook Return Types cho Modal Plan trên máy
export interface UseMachinePlanModalReturn {
  // Plan đang chọn
  selectedPlan: QLSXPLANDATA;
  setSelectedPlan: React.Dispatch<React.SetStateAction<QLSXPLANDATA>>;
  handleSelectPlan: (rowData: QLSXPLANDATA) => Promise<void>;
  // Danh sách plan của máy
  currentMachinePlans: QLSXPLANDATA[];
  setCurrentMachinePlans: React.Dispatch<React.SetStateAction<QLSXPLANDATA[]>>;
  // Định mức
  datadinhmuc: DataDinhMucState;
  setDataDinhMuc: React.Dispatch<React.SetStateAction<DataDinhMucState>>;
  recentDMData: RecentDM[];
  machine_list: MACHINE_LIST[];
  // YCSX
  showYCSX: boolean;
  setShowYCSX: (val: boolean) => void;
  ycsxFilter: YCSXFilterState;
  setYCSXFilter: React.Dispatch<React.SetStateAction<YCSXFilterState>>;
  ycsxDataTable: YCSXTableData[];
  handletraYCSX: () => Promise<void>;
  handleAddPlanFromYCSX: (ycsxRow: YCSXTableData) => Promise<void>;
  // Thao tác Kế hoạch
  handleSaveSinglePlan: () => Promise<void>;
  handleDeletePlan: (plan: QLSXPLANDATA) => Promise<void>;
  handleMovePlan: (direction: "UP" | "DOWN", plan: QLSXPLANDATA) => Promise<void>;
  handleStartPlan: (plan: QLSXPLANDATA) => Promise<void>;
  handleFinishPlan: (plan: QLSXPLANDATA) => Promise<void>;
  // Chỉ thị vật tư
  chithidatatable: QLSXCHITHIDATA[];
  setChiThiDataTable: React.Dispatch<React.SetStateAction<QLSXCHITHIDATA[]>>;
  handleSaveChiThiMaterial: () => Promise<void>;
  handleResetChiThi: () => Promise<void>;
  handleDangKyXuatLieu: () => Promise<void>;
  handleDeleteChiThiLine: (row: QLSXCHITHIDATA) => Promise<void>;
  handleXuatDaoSample: () => Promise<void>;
  handleXuatLieuSample: () => Promise<void>;
  // In ấn & Dialogs
  showChiThi: boolean;
  setShowChiThi: (show: boolean) => void;
  showChiThi2: boolean;
  setShowChiThi2: (show: boolean) => void;
  showKhoAo: boolean;
  setShowKhoAo: (show: boolean) => void;
  showYCKT: boolean;
  setShowYCKT: (show: boolean) => void;
  selection: { tabycsx: boolean; tabbanve: boolean; tab1: boolean; tab2: boolean; tab3: boolean };
  setSelection: React.Dispatch<React.SetStateAction<any>>;
  maxLieu: number;
  setMaxLieu: (val: number) => void;
  handleSetMaxLieu: () => void;
  handlePrint: () => void;
  ycsxprintref: React.RefObject<HTMLDivElement>;
  chithilistrender: any;
  chithilistrender2: any;
  ycsxlistrender: any;
  ycktlistrender: any;
  renderPrintYCSX: () => void;
  renderPrintBanVe: () => void;
  renderPrintChiThi: (plansToRender?: QLSXPLANDATA[]) => void;
  renderPrintChiThi2: (plansToRender?: QLSXPLANDATA[]) => void;
  renderPrintYCKT: () => void;
  // Toolbar Bảng Plan List
  handleUpdateBatchPlan: () => Promise<void>;
  handleSaveDataDinhMuc: () => Promise<void>;
  handleSetDMMD: () => void;
  totalMachineTime: number;
  onRefreshData: () => Promise<void>;
  // Toolbar Bảng YCSX & Chỉ thị mở rộng
  handleSetPendingYCSX: (rows: YCSXTableData[], pending_value: number) => Promise<void>;
  handlePrintYCSXList: (rows: YCSXTableData[]) => void;
  handlePrintBanVeList: (rows: YCSXTableData[]) => void;
  handleRefreshChiThi: () => Promise<void>;
  // Loading state chi tiết plan
  isDetailLoading: boolean;
}

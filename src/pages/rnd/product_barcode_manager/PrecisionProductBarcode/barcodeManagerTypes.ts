import { BARCODE_DATA } from "../interfaces/rndInterface";
import { CodeListData } from "../../kinhdoanh/interfaces/kdInterface";

export interface BarcodeKpiData {
  total: number;
  count1D: number;
  countQR: number;
  countMatrix: number;
  producedCount: number;
  notProducedCount: number;
  statusOkCount: number;
  statusNgCount: number;
}

export type BarcodeTypeFilter = "ALL" | "1D" | "QR" | "MATRIX";
export type ProductionStatusFilter = "ALL" | "YES" | "NO";

export interface UseProductBarcodeDataReturn {
  barcodedatatable: BARCODE_DATA[];
  filteredBarcodeData: BARCODE_DATA[];
  codeList: CodeListData[];
  selectedCode: CodeListData | null;
  setSelectedCode: (val: CodeListData | null) => void;
  selectedRows: BARCODE_DATA;
  setSelectedRows: (val: BARCODE_DATA) => void;
  setBarCodeInfo: (keyname: string, value: any) => void;
  isLoading: boolean;
  kpiData: BarcodeKpiData;
  quickSearch: string;
  setQuickSearch: (val: string) => void;
  typeFilter: BarcodeTypeFilter;
  setTypeFilter: (val: BarcodeTypeFilter) => void;
  prodFilter: ProductionStatusFilter;
  setProdFilter: (val: ProductionStatusFilter) => void;
  showhidePivotTable: boolean;
  setShowHidePivotTable: (val: boolean) => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  isFormOpen: boolean;
  setIsFormOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
  load_barcode_table: (showToast?: boolean) => void;
  addBarcode: () => Promise<void>;
  updateBarcode: () => Promise<void>;
  deleteBarcode: () => Promise<void>;
  resetForm: () => void;
  handleExportExcel: () => void;
  dataSource: any;
}

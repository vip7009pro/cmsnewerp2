import { BOM_AMAZON as BOM_AMAZON_DATA, CODE_INFO, CODEPHOI, LIST_BOM_AMAZON } from "../../interfaces/rndInterface";

export type SidebarTabMode = "EXISTING" | "SEARCH_ALL";

export interface BomStatusInfo {
  isExisting: boolean;
  label: string;
  badgeClass: string;
}

export interface UseBomAmazonDataReturn {
  codephoilist: CODEPHOI[];
  listamazontable: LIST_BOM_AMAZON[];
  filteredListBomAmazon: LIST_BOM_AMAZON[];
  bomamazontable: BOM_AMAZON_DATA[];
  filteredBomData: BOM_AMAZON_DATA[];
  G_CODE_MAU: string;
  setG_CODE_MAU: (val: string) => void;
  isLoading: boolean;
  codeCMS: string;
  setCodeCMS: (val: string) => void;
  enableEdit: boolean;
  setEnableEdit: (val: boolean | ((prev: boolean) => boolean)) => void;
  rows: CODE_INFO[];
  codeinfoCMS: string;
  codeinfoKD: string;
  amz_country: string;
  setAMZ_COUNTRY: (val: string) => void;
  amz_prod_name: string;
  setAMZ_PROD_NAME: (val: string) => void;
  sidebarTab: SidebarTabMode;
  setSidebarTab: (val: SidebarTabMode) => void;
  sidebarSearch: string;
  setSidebarSearch: (val: string) => void;
  quickSearchBom: string;
  setQuickSearchBom: (val: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
  isInfoPanelOpen: boolean;
  setIsInfoPanelOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  handleSearchCodeKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleCODEINFO: () => void;
  handleGETLISTBOMAMAZON: (G_NAME: string) => void;
  handleGETBOMAMAZON: (G_CODE: string) => void;
  handleGETBOMAMAZONEMPTY: (G_CODE: string, G_NAME: string, G_CODE_MAU: string) => void;
  handleResetToTemplate: () => void;
  handleToggleEdit: () => void;
  confirmSaveBOMAMAZON: () => void;
  handle_saveAMAZONCODEINFO: () => void;
  handleExportExcel: () => void;
  isBomExist: boolean;
}

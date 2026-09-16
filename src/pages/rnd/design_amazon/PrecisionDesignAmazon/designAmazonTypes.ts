import { COMPONENT_DATA, CODE_INFO } from "../../interfaces/rndInterface";

export interface LiveOverlayState {
  type: 'drag' | 'resize';
  xMm?: number;
  yMm?: number;
  wMm?: number;
  hMm?: number;
}

export interface RotateDragState {
  idx: number;
  centerX: number;
  centerY: number;
  startMouseAngle: number;
  startRotate: number;
}

export interface RotateResizeDragState {
  idx: number;
  handle: 'tl' | 'tr' | 'bl' | 'br';
  startMouseWorldX: number;
  startMouseWorldY: number;
  startWorldX: number;
  startWorldY: number;
  startWorldW: number;
  startWorldH: number;
}

export interface ActiveHandleBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface SnapLine {
  type: 'vertical' | 'horizontal';
  pos: number;
}

export type GridStyle = 'solid' | 'dashed';

export interface PrintOffset {
  x: number;
  y: number;
}

export interface PaletteItem {
  type: string;
  label: string;
  desc?: string;
}

export interface DesignAmazonDataHook {
  componentList: COMPONENT_DATA[];
  setComponentList: React.Dispatch<React.SetStateAction<COMPONENT_DATA[]>>;
  latestComponentListRef: React.MutableRefObject<COMPONENT_DATA[]>;
  currentComponent: number;
  setCurrentComponent: React.Dispatch<React.SetStateAction<number>>;
  selectedComponent: COMPONENT_DATA | undefined;
  historyPast: COMPONENT_DATA[][];
  historyFuture: COMPONENT_DATA[][];
  commitComponentList: (next: COMPONENT_DATA[]) => void;
  undo: () => void;
  redo: () => void;
  jumpToHistory: (index: number) => void;
  deleteSelectedComponent: (idx?: number) => void;
  updateComponentAt: (index: number, patch: Partial<COMPONENT_DATA>, commit?: boolean) => void;
  addComponent: () => Promise<void>;
  createComponentAt: (type: string, mmX: number, mmY: number) => Promise<void>;
  pickAndUploadImage: () => Promise<string | null>;
  rows: CODE_INFO[];
  codeCMS: string;
  setCodeCMS: React.Dispatch<React.SetStateAction<string>>;
  codeinfoCMS: string;
  codeinfoKD: string;
  codedatatablefilter: CODE_INFO[];
  handleCODEINFO: () => void;
  handleSearchCodeKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleCODESelectionforUpdate: (selectedRows: CODE_INFO[]) => void;
  saveDesignAmazon: () => Promise<void>;
  confirmSaveDESIGN_AMAZON: () => void;
  handlePrint: () => void;
  handleListPrinters: () => Promise<void>;
  printOffsetMm: PrintOffset;
  setAndPersistPrintOffset: (next: PrintOffset) => void;
  labelprintref: React.RefObject<HTMLDivElement>;
  isPrinting: boolean;
  isLoading: boolean;
  newComponent: string;
  setNewComponent: React.Dispatch<React.SetStateAction<string>>;
}

export interface DesignAmazonCanvasHook {
  designRef: React.RefObject<HTMLDivElement>;
  scale: number;
  setScale: React.Dispatch<React.SetStateAction<number>>;
  x: number;
  setX: React.Dispatch<React.SetStateAction<number>>;
  y: number;
  setY: React.Dispatch<React.SetStateAction<number>>;
  MIN_SCALE: number;
  MAX_SCALE: number;
  zoomPresets: number[];
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  showGrid: boolean;
  setShowGrid: React.Dispatch<React.SetStateAction<boolean>>;
  gridMm: number;
  setGridMm: React.Dispatch<React.SetStateAction<number>>;
  gridStyle: GridStyle;
  setGridStyle: React.Dispatch<React.SetStateAction<GridStyle>>;
  gridBackground: string;
  enableSnap: boolean;
  setEnableSnap: React.Dispatch<React.SetStateAction<boolean>>;
  snapLines: SnapLine[];
  rulerTicks: { x: number[]; y: number[] };
  designBBoxPx: { minX: number; minY: number; width: number; height: number };
  stageSizePx: { width: number; height: number };
  liveOverlay: LiveOverlayState | null;
  activeHandleIdx: number | null;
  activeHandleBox: ActiveHandleBox | null;
  rotateDrag: RotateDragState | null;
  setRotateDrag: React.Dispatch<React.SetStateAction<RotateDragState | null>>;
  rotateResizeDrag: RotateResizeDragState | null;
  setRotateResizeDrag: React.Dispatch<React.SetStateAction<RotateResizeDragState | null>>;
  isShiftDown: boolean;
  isCtrlDown: boolean;
  isGroupDragging: boolean;
  setIsGroupDragging: React.Dispatch<React.SetStateAction<boolean>>;
  groupDragStartRef: React.MutableRefObject<{ mouseX: number; mouseY: number; x: number; y: number } | null>;
  renderHandles: () => JSX.Element[];
  renderRotatedResizeHandles: () => JSX.Element | null;
  paletteItems: PaletteItem[];
  RULER_TOP: number;
  RULER_LEFT: number;
  MM_TO_PX: number;
  PX_TO_MM: number;
}

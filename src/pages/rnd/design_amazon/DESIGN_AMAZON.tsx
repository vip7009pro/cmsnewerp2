import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import "./DESIGN_AMAZON.scss";
import {
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { TbComponents } from "react-icons/tb";
import Swal from "sweetalert2";
import { GrAdd } from "react-icons/gr";
import { generalQuery, getAuditMode, getCtrCd, uploadQuery } from "../../../api/Api";
import { SaveExcel, checkBP, renderElement } from "../../../api/GlobalFunction";
import { AiFillFileExcel } from "react-icons/ai";
import { BiMagnet, BiPrinter, BiSave, BiShow } from "react-icons/bi";
import { useReactToPrint } from "react-to-print";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  UserData,
} from "../../../api/GlobalInterface";
import { BOM_AMAZON, CODE_INFO, COMPONENT_DATA, POINT_DATA } from "../interfaces/rndInterface";
import AGTable from "../../../components/DataTable/AGTable";

const DESIGN_AMAZON = () => {
  const protocol = window.location.protocol.startsWith("https") ? "https" : "http";
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData,
  );
  const labelprintref = useRef(null);
  const designRef = useRef<HTMLDivElement | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const PRINT_OFFSET_LS_KEY = 'amz_print_offset_mm_v1';
  const [printOffsetMm, setPrintOffsetMm] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const handlePrint = useReactToPrint({
    content: () => labelprintref.current,
    onBeforeGetContent: async () => {
      setIsPrinting(true);
    },
    onAfterPrint: () => {
      setIsPrinting(false);
    },
  });
  const [showhidecodelist, setShowHideCodeList] = useState(true);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [isCtrlDown, setIsCtrlDown] = useState(false);
  const [isShiftDown, setIsShiftDown] = useState(false);
  const [scale, setScale] = useState(1);

  const RULER_TOP = 20;
  const RULER_LEFT = 30;

  const [showGrid, setShowGrid] = useState(false);
  const [gridMm, setGridMm] = useState(5);
  const [gridStyle, setGridStyle] = useState<'solid' | 'dashed'>('dashed');
  const [designViewSize, setDesignViewSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  const MIN_SCALE = 0.2;
  const MAX_SCALE = 10;

  const zoomPresets = useMemo(() => {
    return [
      0.25,
      0.5,
      0.75,
      1,
      1.25,
      1.5,
      2,
      3,
      4,
      5,
      8,
      10,
    ].filter((z) => z >= MIN_SCALE && z <= MAX_SCALE);
  }, [MAX_SCALE, MIN_SCALE]);

  const [rotateDrag, setRotateDrag] = useState<
    | { idx: number; centerX: number; centerY: number; startMouseAngle: number; startRotate: number }
    | null
  >(null);

  const [liveOverlay, setLiveOverlay] = useState<
    | { type: 'drag'; xMm: number; yMm: number }
    | { type: 'resize'; wMm: number; hMm: number }
    | null
  >(null);
  const [isGroupDragging, setIsGroupDragging] = useState(false);
  const groupDragStartRef = useRef<{ mouseX: number; mouseY: number; x: number; y: number } | null>(null);
  const [rows, setRows] = useState<CODE_INFO[]>([]);
  const [isLoading, setisLoading] = useState(false);
  const [codeCMS, setCodeCMS] = useState("");
  const [bomamazontable, setBOMAMAZONTable] = useState<BOM_AMAZON[]>([]);
  const [G_CODE_MAU, setG_CODE_MAU] = useState("7A07994A");
  const [componentList, setComponentList] = useState<COMPONENT_DATA[]>([
    {
      id: 0,
      G_CODE_MAU: "123456",
      DOITUONG_NO: 5,
      DOITUONG_NAME: "Rectangle",
      PHANLOAI_DT: "CONTAINER",
      DOITUONG_STT: "A6",
      CAVITY_PRINT: 2,
      GIATRI: "AZ:4Z99ADOEBRABHKDMAG5UZUWF5Y",
      FONT_NAME: "Arial",
      FONT_SIZE: 6,
      FONT_STYLE: "B",
      POS_X: 0,
      POS_Y: 0,
      SIZE_W: 23,
      SIZE_H: 28.6,
      ROTATE: 0,
      REMARK: "remark",
    },
    {
      id: 1,
      G_CODE_MAU: "123456",
      DOITUONG_NO: 0,
      DOITUONG_NAME: "Code name",
      PHANLOAI_DT: "TEXT",
      DOITUONG_STT: "A0",
      CAVITY_PRINT: 2,
      GIATRI: "GH68-54619A",
      FONT_NAME: "Arial",
      FONT_SIZE: 6,
      FONT_STYLE: "B",
      POS_X: 2.26,
      POS_Y: 20.53,
      SIZE_W: 2.08,
      SIZE_H: 2.08,
      ROTATE: 0,
      REMARK: "remark",
    },
    {
      id: 2,
      G_CODE_MAU: "123456",
      DOITUONG_NO: 1,
      DOITUONG_NAME: "Model",
      PHANLOAI_DT: "TEXT",
      DOITUONG_STT: "A1",
      CAVITY_PRINT: 2,
      GIATRI: "SM-R910NZAAXJP",
      FONT_NAME: "Arial",
      FONT_SIZE: 6,
      FONT_STYLE: "B",
      POS_X: 2.26,
      POS_Y: 15.36,
      SIZE_W: 2.08,
      SIZE_H: 2.08,
      ROTATE: 0,
      REMARK: "remark",
    },
    {
      id: 3,
      G_CODE_MAU: "123456",
      DOITUONG_NO: 1,
      DOITUONG_NAME: "EAN No 1",
      PHANLOAI_DT: "TEXT",
      DOITUONG_STT: "A2",
      CAVITY_PRINT: 2,
      GIATRI: "4986773220257",
      FONT_NAME: "Arial",
      FONT_SIZE: 6,
      FONT_STYLE: "B",
      POS_X: 2.26,
      POS_Y: 17.97,
      SIZE_W: 2.08,
      SIZE_H: 2.08,
      ROTATE: 0,
      REMARK: "remark",
    },
    {
      id: 4,
      G_CODE_MAU: "123456",
      DOITUONG_NO: 4,
      DOITUONG_NAME: "Logo AMZ 1",
      PHANLOAI_DT: "IMAGE",
      DOITUONG_STT: "A3",
      CAVITY_PRINT: 2,
      GIATRI: `${protocol}://cmsvina4285.com/images/logoAMAZON.png`,
      FONT_NAME: "Arial",
      FONT_SIZE: 6,
      FONT_STYLE: "B",
      POS_X: 2.28,
      POS_Y: 2.58,
      SIZE_W: 7.11,
      SIZE_H: 7,
      ROTATE: 0,
      REMARK: "remark",
    },
    {
      id: 5,
      G_CODE_MAU: "123456",
      DOITUONG_NO: 5,
      DOITUONG_NAME: "Barcode 1",
      PHANLOAI_DT: "1D BARCODE",
      DOITUONG_STT: "A4",
      CAVITY_PRINT: 2,
      GIATRI: "GH68-55104A",
      FONT_NAME: "Arial",
      FONT_SIZE: 6,
      FONT_STYLE: "B",
      POS_X: 1.97,
      POS_Y: 23.57,
      SIZE_W: 19.05,
      SIZE_H: 3.55,
      ROTATE: 0,
      REMARK: "remark",
    },
    {
      id: 6,
      G_CODE_MAU: "123456",
      DOITUONG_NO: 5,
      DOITUONG_NAME: "Matrix 1",
      PHANLOAI_DT: "2D MATRIX",
      DOITUONG_STT: "A5",
      CAVITY_PRINT: 2,
      GIATRI: "AZ:4Z99ADOEBRABHKDMAG5UZUWF5Y",
      FONT_NAME: "Arial",
      FONT_SIZE: 6,
      FONT_STYLE: "B",
      POS_X: 12,
      POS_Y: 2,
      SIZE_W: 9,
      SIZE_H: 9,
      ROTATE: 0,
      REMARK: "remark",
    },
  ]);

  const latestComponentListRef = useRef<COMPONENT_DATA[]>([]);
  useEffect(() => {
    latestComponentListRef.current = componentList;
  }, [componentList]);

  const agTableRef = useRef<any>(null);

  const nudgeStateRef = useRef<{
    active: boolean;
    startMs: number;
    dx: number;
    dy: number;
    ctrl: boolean;
    startSnapshot: COMPONENT_DATA[] | null;
    timerId: number | null;
  } | null>(null);

  const [activeHandleIdx, setActiveHandleIdx] = useState<number | null>(null);
  const [activeHandleBox, setActiveHandleBox] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);

  const [rotateResizeDrag, setRotateResizeDrag] = useState<{
    idx: number;
    handle: 'tl' | 'tr' | 'bl' | 'br';
    startMouseWorldX: number;
    startMouseWorldY: number;
    startWorldX: number;
    startWorldY: number;
    startWorldW: number;
    startWorldH: number;
  } | null>(null);

  const [newComponent, setNewComponent] = useState("TEXT");
  const [currentComponent, setCurrentComponent] = useState(0);
  const [codedatatablefilter, setCodeDataTableFilter] = useState<
    Array<CODE_INFO>
  >([]);
  const [codeinfoCMS, setcodeinfoCMS] = useState<any>("");

  const [historyPast, setHistoryPast] = useState<COMPONENT_DATA[][]>([]);
  const [historyFuture, setHistoryFuture] = useState<COMPONENT_DATA[][]>([]);
  const [enableSnap, setEnableSnap] = useState(false);
  const [snapLines, setSnapLines] = useState<{ type: 'vertical' | 'horizontal', pos: number }[]>([]);

  const MM_TO_PX = 96 / 25.4;
  const PX_TO_MM = 25.4 / 96;

  const getNextComponentId = useCallback(() => {
    const cur = latestComponentListRef.current;
    let maxId = -1;
    for (let i = 0; i < cur.length; i++) {
      const v = Number((cur[i] as any)?.id);
      if (Number.isFinite(v) && v > maxId) maxId = v;
    }
    return maxId + 1;
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PRINT_OFFSET_LS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const nx = Number(parsed?.x);
      const ny = Number(parsed?.y);
      if (!Number.isFinite(nx) || !Number.isFinite(ny)) return;
      setPrintOffsetMm({ x: nx, y: ny });
    } catch {
      // ignore
    }
  }, []);

  const setAndPersistPrintOffset = useCallback((next: { x: number; y: number }) => {
    setPrintOffsetMm(next);
    try {
      localStorage.setItem(PRINT_OFFSET_LS_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  const cloneList = (list: COMPONENT_DATA[]) =>
    list.map((e) => ({ ...e }));

  const commitComponentList = React.useCallback((next: COMPONENT_DATA[]) => {
    const current = latestComponentListRef.current;
    setHistoryPast((p) => [...p, cloneList(current)]);
    setHistoryFuture([]);
    setComponentList(next);
  }, []);

  const undo = React.useCallback(() => {
    setHistoryPast((p) => {
      if (p.length === 0) return p;
      const prev = p[p.length - 1];
      const newPast = p.slice(0, p.length - 1);
      
      const current = latestComponentListRef.current;
      setHistoryFuture((f) => [cloneList(current), ...f]);
      setComponentList(cloneList(prev));
      
      return newPast;
    });
  }, []);

  const redo = React.useCallback(() => {
    setHistoryFuture((f) => {
      if (f.length === 0) return f;
      const next = f[0];
      const newFuture = f.slice(1);

      const current = latestComponentListRef.current;
      setHistoryPast((p) => [...p, cloneList(current)]);
      setComponentList(cloneList(next));
      
      return newFuture;
    });
  }, []);

  const jumpToHistory = (index: number) => {
    const targetState = historyPast[index];
    const pastForFuture = historyPast.slice(index + 1);
    const newPast = historyPast.slice(0, index);
    
    // Move current state and specialized future to generic historyFuture? 
    // Usually jumping back clears the future or pushes everything to future.
    // Let's implement simple "Restore":
    // The state at 'index' becomes current.
    // 'newPast' contains 0..index-1.
    // Everything else (index+1..end of past) + current + oldFuture becomes newFuture.
    
    const current = latestComponentListRef.current;
    const itemsToFuture = [...pastForFuture, cloneList(current)];
    
    setHistoryPast(newPast);
    setHistoryFuture(prevFuture => [...itemsToFuture, ...prevFuture]);
    setComponentList(cloneList(targetState));
  };
  const handleGETBOMAMAZON = (G_CODE: string) => {
    setisLoading(true);
    generalQuery("getAMAZON_DESIGN", {
      G_CODE: G_CODE,
    })
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: COMPONENT_DATA[] = response.data.data.map(
            (element: COMPONENT_DATA, index: number) => {
              return {
                ...element,
                id: index,
              };
            },
          );
          //console.log(loadeddata);
          setComponentList(loadeddata);
          setisLoading(false);
        } else {
          //Swal.fire("Thông báo", "Lỗi BOM SX: " + response.data.message, "error");
          setComponentList([]);
          setisLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const [trigger, setTrigger] = useState(false);
  const [codeinfoKD, setcodeinfoKD] = useState<any>("");
  const handleCODESelectionforUpdate = (selectedRows: CODE_INFO[]) => {
    let datafilter = selectedRows;
    if (datafilter.length > 0) {
      setCodeDataTableFilter(datafilter);
      setcodeinfoCMS(datafilter[0].G_CODE);
      setcodeinfoKD(datafilter[0].G_NAME);
      handleGETBOMAMAZON(datafilter[0].G_CODE);
    } else {
      setCodeDataTableFilter([]);
    }
  };

  const pickAndUploadImage = async (): Promise<string | null> => {
    const file: File | null = await new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/png,image/jpeg';
      input.onchange = () => {
        resolve((input.files && input.files.length > 0 ? input.files[0] : null) as File | null);
      };
      input.oncancel = () => resolve(null);
      input.click();
    });

    if (!file) return null;

    const ext = (() => {
      const n = (file.name || '').toLowerCase();
      if (n.endsWith('.png')) return 'png';
      if (n.endsWith('.jpg')) return 'jpg';
      if (n.endsWith('.jpeg')) return 'jpeg';
      return 'png';
    })();

    const unique = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const filename = `${getCtrCd()}_${unique}.${ext}`;

    try {
      const response: any = await uploadQuery(file, filename, 'images');
      if (response?.data?.tk_status === 'NG') {
        Swal.fire('Thông báo', 'Upload file thất bại: ' + response?.data?.message, 'error');
        return null;
      }

      return `/images/${filename}`;
    } catch (err: any) {
      console.log(err);
      Swal.fire('Thông báo', 'Upload file thất bại', 'error');
      return null;
    }
  };

  const addComponent = async () => {
    if (codedatatablefilter.length > 0) {
      let max_dt_no: number = 0;
      for (let i = 0; i < componentList.length; i++) {
        if (max_dt_no < componentList[i].DOITUONG_NO)
          max_dt_no = componentList[i].DOITUONG_NO;
      }

      let giatri = "1234";
      if (newComponent === 'IMAGE') {
        const uploadedUrl = await pickAndUploadImage();
        if (!uploadedUrl) return;
        giatri = uploadedUrl;
      }

      let temp_compList: COMPONENT_DATA = {
        id: getNextComponentId(),
        G_CODE_MAU: codedatatablefilter[0].G_CODE,
        DOITUONG_NO: max_dt_no + 1,
        DOITUONG_NAME: newComponent,
        PHANLOAI_DT: newComponent,
        DOITUONG_STT: "A" + (max_dt_no + 1),
        CAVITY_PRINT: 2,
        GIATRI: giatri,
        FONT_NAME: "Arial",
        FONT_SIZE: 6,
        FONT_STYLE: "B",
        POS_X: 0,
        POS_Y: 0,
        SIZE_W: 9,
        SIZE_H: 9,
        ROTATE: 0,
        REMARK: "",
      };
      commitComponentList([...componentList, temp_compList]);
      setCurrentComponent(componentList.length);
    } else {
      Swal.fire("Thông báo", "Chọn code phôi trước", "error");
    }
  };

  const addComponentRef = useRef<(() => Promise<void>) | null>(null);
  useEffect(() => {
    addComponentRef.current = addComponent;
  }, [addComponent]);

  const agColumns = useMemo(
    () =>
      [
        { field: 'DOITUONG_STT', headerName: 'STT', width: 70, resizable: true, floatingFilter: true, rowDrag: true },
        { field: 'DOITUONG_NO', headerName: 'NO', width: 60, resizable: true, floatingFilter: true },
        { field: 'DOITUONG_NAME', headerName: 'NAME', width: 140, resizable: true, floatingFilter: true },
        {
          field: 'PHANLOAI_DT',
          headerName: 'TYPE',
          width: 110,
          resizable: true,
          floatingFilter: true,
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: {
            values: ['TEXT', 'IMAGE', '1D BARCODE', '2D MATRIX', 'QRCODE', 'CONTAINER'],
          },
        },
        { field: 'POS_X', headerName: 'X', width: 80, resizable: true, floatingFilter: true },
        { field: 'POS_Y', headerName: 'Y', width: 80, resizable: true, floatingFilter: true },
        { field: 'SIZE_W', headerName: 'W', width: 80, resizable: true, floatingFilter: true },
        { field: 'SIZE_H', headerName: 'H', width: 80, resizable: true, floatingFilter: true },
        { field: 'ROTATE', headerName: 'ROT', width: 80, resizable: true, floatingFilter: true },
        { field: 'FONT_NAME', headerName: 'FONT', width: 100, resizable: true, floatingFilter: true },
        { field: 'FONT_SIZE', headerName: 'F.SIZE', width: 80, resizable: true, floatingFilter: true },
        {
          field: 'FONT_STYLE',
          headerName: 'F.STYLE',
          width: 90,
          resizable: true,
          floatingFilter: true,
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: {
            values: ['R', 'B', 'I', 'U'],
          },
        },
        { field: 'GIATRI', headerName: 'GIATRI', width: 260, resizable: true, floatingFilter: true, cellRenderer: (params: any)=> {
          return <span style={{color:'blue'}}>{params.value}</span>
        } },
        { field: 'REMARK', headerName: 'REMARK', width: 150, resizable: true, floatingFilter: true },
      ] as any,
    [],
  );

  const onAgCellClick = useCallback((params: any) => {
    const clickedId = params?.data?.id;
    const idx = latestComponentListRef.current.findIndex((x: any) => x?.id === clickedId);
    if (idx >= 0) setCurrentComponent(idx);
  }, []);

  const onAgCellEditingStopped = useCallback(
    (e: any) => {
      const row = e?.data;
      if (!row) return;

      const id = row?.id;
      const field = e?.colDef?.field;
      if (!field) return;

      const numericFields = new Set([
        'POS_X',
        'POS_Y',
        'SIZE_W',
        'SIZE_H',
        'ROTATE',
        'FONT_SIZE',
        'DOITUONG_NO',
        'CAVITY_PRINT',
      ]);
      const raw = row[field];
      const nextValue = numericFields.has(field) ? (Number.isFinite(Number(raw)) ? Number(raw) : 0) : raw;

      const next = latestComponentListRef.current.map((x: any) => {
        if (x?.id !== id) return x;
        return { ...x, [field]: nextValue };
      });
      commitComponentList(next);

      const curSel = latestComponentListRef.current[currentComponent] as any;
      if (curSel) {
        const nextIdx = next.findIndex((x: any) => x?.id === curSel?.id);
        if (nextIdx >= 0) setCurrentComponent(nextIdx);
      }
    },
    [commitComponentList, currentComponent],
  );

  const onAgRowDragEnd = useCallback(
    (params: any) => {
      const curList = latestComponentListRef.current;
      const next: COMPONENT_DATA[] = [];
      params.api.forEachNode((node: any) => {
        if (node?.data) next.push(node.data);
      });
      if (next.length !== curList.length) return;

      const curSel = curList[currentComponent];
      commitComponentList(next.map((x) => ({ ...x })));
      if (curSel) {
        const nextIdx = next.findIndex((x: any) => x?.id === (curSel as any)?.id);
        if (nextIdx >= 0) setCurrentComponent(nextIdx);
      }
    },
    [commitComponentList, currentComponent],
  );

  const agToolbar = useMemo(
    () => (
      <div>
        <label style={{ marginRight: 8 }}>
          New Component:
          <select
            name="newcomponent"
            value={newComponent}
            onChange={(e) => {
              setNewComponent(e.target.value);
            }}
            style={{ height: 26, marginLeft: 6 }}
          >
            <option value="TEXT">TEXT</option>
            <option value="IMAGE">IMAGE</option>
            <option value="1D BARCODE">1D BARCODE</option>
            <option value="2D MATRIX">2D MATRIX</option>
            <option value="QRCODE">QRCODE</option>
            <option value="CONTAINER">CONTAINER</option>
          </select>
        </label>
        <IconButton
          className="buttonIcon"
          onClick={async () => {
            await addComponentRef.current?.();
          }}
        >
          <GrAdd color="white" size={15} />
          Add
        </IconButton>
      </div>
    ),
    [newComponent],
  );

  const selectedComponentId = useMemo(() => {
    const cur = latestComponentListRef.current;
    const c = cur?.[currentComponent] as any;
    return c?.id ?? null;
  }, [currentComponent, componentList]);

  useEffect(() => {
    const api = agTableRef.current?.api;
    if (!api) return;
    if (selectedComponentId == null) {
      api.deselectAll();
      return;
    }
    api.deselectAll();
    const node = api.getRowNode(selectedComponentId?.toString?.() ?? String(selectedComponentId));
    if (node) node.setSelected(true, true);
  }, [selectedComponentId]);

  const agGetRowStyle = useCallback(
    (params: any) => {
      const rowId = params?.data?.id ?? null;
      if (selectedComponentId == null || rowId == null) return undefined;
      if (rowId !== selectedComponentId) return  {
        backgroundColor: 'transparent',
        fontWeight: 400,
        fontSize: '0.7rem'
      };
      return {
        backgroundColor: '#7fee00',
        fontWeight: 700,
        fontSize: '0.8rem'
      };
    },
    [selectedComponentId],
  );

  const createComponentAt = async (type: string, mmX: number, mmY: number) => {
    if (codedatatablefilter.length <= 0) {
      Swal.fire("Thông báo", "Chọn code phôi trước", "error");
      return;
    }

    let max_dt_no: number = 0;
    for (let i = 0; i < componentList.length; i++) {
      if (max_dt_no < componentList[i].DOITUONG_NO) max_dt_no = componentList[i].DOITUONG_NO;
    }

    const t = type;
    const defaultSize = (() => {
      if (t === 'TEXT') return { w: 10, h: 3 };
      if (t === 'IMAGE') return { w: 10, h: 10 };
      if (t === '1D BARCODE') return { w: 25, h: 8 };
      if (t === '2D MATRIX') return { w: 10, h: 10 };
      if (t === 'QRCODE') return { w: 10, h: 10 };
      if (t === 'CONTAINER') return { w: 30, h: 20 };
      return { w: 10, h: 10 };
    })();

    let giatri = t === 'TEXT' ? 'TEXT' : 'sample text';
    if (t === 'IMAGE') {
      const uploadedUrl = await pickAndUploadImage();
      if (!uploadedUrl) return;
      giatri = uploadedUrl;
    }

    const temp_compList: COMPONENT_DATA = {
      id: getNextComponentId(),
      G_CODE_MAU: codedatatablefilter[0].G_CODE,
      DOITUONG_NO: max_dt_no + 1,
      DOITUONG_NAME: t,
      PHANLOAI_DT: t,
      DOITUONG_STT: "A" + (max_dt_no + 1),
      CAVITY_PRINT: 2,
      GIATRI: giatri,
      FONT_NAME: "Arial",
      FONT_SIZE: 6,
      FONT_STYLE: "B",
      POS_X: Math.max(0, Math.round(mmX * 100) / 100),
      POS_Y: Math.max(0, Math.round(mmY * 100) / 100),
      SIZE_W: defaultSize.w,
      SIZE_H: defaultSize.h,
      ROTATE: 0,
      REMARK: "",
    };

    commitComponentList([...componentList, temp_compList]);
    setCurrentComponent(componentList.length);
  };
  const handleCODEINFO = () => {
    setisLoading(true);
    generalQuery("codeinfo", {
      G_NAME: codeCMS,
    })
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: CODE_INFO[] = response.data.data.map(
            (element: CODE_INFO, index: number) => {
              return {
                ...element,
                G_NAME: getAuditMode() == 0? element?.G_NAME : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME : 'TEM_NOI_BO',
G_NAME_KD: getAuditMode() == 0? element?.G_NAME_KD : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME_KD : 'TEM_NOI_BO',
                id: index,
              };
            },
          );
          setRows(loadeddata);
          //setCODEINFODataTable(loadeddata);
          setisLoading(false);
          Swal.fire(
            "Thông báo",
            "Đã load " + response.data.data.length + " dòng",
            "success",
          );
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
          setisLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleSearchCodeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      handleCODEINFO();
    }
  };
  const checkDesignExist = async (G_CODE_MAU: string) => {
    let isDesignExist: boolean = false;
    await generalQuery("checkDesignExistAMZ", {
      G_CODE: G_CODE_MAU,
    })
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
          isDesignExist = true;
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return isDesignExist;
  };
  const deleteAMZDesign = async (G_CODE_MAU: string) => {
    await generalQuery("deleteAMZDesign", {
      G_CODE: G_CODE_MAU,
    })
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const saveDesignAmazon = async () => {
    if (codedatatablefilter.length > 0) {
      let checkExist: boolean = await checkDesignExist(
        codedatatablefilter[0].G_CODE,
      );
      console.log(checkExist);
      if (checkExist) {
        //neu ton tai design, delete xong insert
        console.log(codedatatablefilter[0].G_CODE);
        await deleteAMZDesign(codedatatablefilter[0].G_CODE);
        if (componentList.length > 0) {
          let err_code: string = "";
          for (let i = 0; i < componentList.length; i++) {
            await generalQuery("insertAMZDesign", componentList[i])
              // eslint-disable-next-line no-loop-func
              .then((response) => {
                //console.log(response.data);
                if (response.data.tk_status !== "NG") {
                } else {
                  err_code += "Lỗi: " + response.data.message + "| ";
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
          if (err_code === "") {
            Swal.fire("Thông báo", "Lưu DESIGN thành công", "success");
            setHistoryPast([]);
            setHistoryFuture([]);
          } else {
            Swal.fire("Thông báo", "Thất bại: " + err_code, "error");
          }
        } else {
          Swal.fire("Thông báo", "Tạo ít nhất 1 component", "error");
        }
      } else {
        //neu khong ton tai design, insert
        if (componentList.length > 0) {
          let err_code: string = "";
          for (let i = 0; i < componentList.length; i++) {
            await generalQuery("insertAMZDesign", componentList[i])
              // eslint-disable-next-line no-loop-func
              .then((response) => {
                //console.log(response.data);
                if (response.data.tk_status !== "NG") {
                } else {
                  err_code += "Lỗi: " + response.data.message + "| ";
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
          if (err_code === "") {
            Swal.fire("Thông báo", "Lưu DESIGN thành công", "success");
          } else {
            Swal.fire("Thông báo", "Thất bại: " + err_code, "error");
          }
        } else {
          Swal.fire("Thông báo", "Tạo ít nhất 1 component", "error");
        }
      }
    } else {
      Swal.fire("Thông báo", "Chọn code phôi để lưu", "error");
    }
  };
  const confirmSaveDESIGN_AMAZON = () => {
    Swal.fire({
      title: "Chắc chắn muốn lưu DESIGN AMAZON ?",
      text: "Sẽ ghi đè tất cả design cũ bằng design bạn vừa tạo !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn lưu!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành Lưu DESIGN", "Đang lưu DESIGN", "success");
        /*  checkBP(
          userData?.EMPL_NO,
          userData?.MAINDEPTNAME,
          ["RND"],
          saveDesignAmazon
        ); */
        checkBP(userData, ["RND"], ["ALL"], ["ALL"], saveDesignAmazon);
        //handleInsertBOMSX();
      }
    });
  };
/*   async function listUSBPrinters() {
    try {
        // Lấy danh sách thiết bị USB đã được cấp quyền
        const devices = await navigator.usb.getDevices();
        console.log('Danh sách thiết bị USB:');
        devices.forEach((device) => {
            console.log(`- Tên: ${device.productName || 'Không xác định'}, VendorID: ${device.vendorId}, ProductID: ${device.productId}`);
        });
        return devices;
    } catch (error) {
        console.error('Lỗi khi liệt kê thiết bị:', error);
        return [];
    }
} */

// Yêu cầu người dùng chọn thiết bị USB mới
/* async function requestUSBPrinters() {
    try {
        const device = await navigator.usb.requestDevice({
            filters: [], // VendorID của Xerox, thay nếu cần
        });
        console.log('device', device)
        console.log('Thiết bị đã chọn:', device.productName, device.vendorId, device.productId);
        return [device];
    } catch (error) {
        console.error('Lỗi khi yêu cầu thiết bị:', error);
        return [];
    }
} */

const handleListPrinters = async () => {
 // const existingDevices = await listUSBPrinters();
 // console.log('existing device', existingDevices)
 // if (existingDevices.length === 0) {
      //await requestUSBPrinters(); // Yêu cầu người dùng chọn thiết bị
 // }
};

  useEffect(() => { }, [trigger]);

  const deleteSelectedComponent = useCallback((idx?: number) => {
    const targetIdx = idx ?? currentComponent;
    if (targetIdx < 0 || targetIdx >= latestComponentListRef.current.length) return;
    const old: COMPONENT_DATA[] = latestComponentListRef.current.filter((_: COMPONENT_DATA, index1: number) => index1 !== targetIdx);
    commitComponentList(old);
    if (old.length === 0) {
      setCurrentComponent(-1);
    } else {
      setCurrentComponent((prev) => Math.max(0, Math.min(prev, old.length - 1)));
    }
  }, [commitComponentList, currentComponent]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Control') setIsCtrlDown(true);
      if (e.key === 'Shift') setIsShiftDown(true);
 
      if (!e.ctrlKey) return;

      const key = e.key.toLowerCase();
      if (key === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }
      if (key === "y") {
        e.preventDefault();
        redo();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Control") setIsCtrlDown(false);
      if (e.key === "Shift") setIsShiftDown(false);
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  useEffect(() => {
    if (!rotateResizeDrag) return;

    const onMove = (e: MouseEvent) => {
      const rect = designRef.current?.getBoundingClientRect();
      if (!rect) return;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const worldX = (mouseX - (x + RULER_LEFT)) / scale;
      const worldY = (mouseY - (y + RULER_TOP)) / scale;

      const c = componentList[rotateResizeDrag.idx];
      if (!c) return;
      const rotDeg = (c.ROTATE ?? 0);
      const rotRad = (rotDeg * Math.PI) / 180;
      const cos = Math.cos(rotRad);
      const sin = Math.sin(rotRad);

      const dWorldX = worldX - rotateResizeDrag.startMouseWorldX;
      const dWorldY = worldY - rotateResizeDrag.startMouseWorldY;

      // Rotate delta into local axes (component space)
      const dLocalX = dWorldX * cos + dWorldY * sin;
      const dLocalY = -dWorldX * sin + dWorldY * cos;

      let newWorldX = rotateResizeDrag.startWorldX;
      let newWorldY = rotateResizeDrag.startWorldY;
      let newWorldW = rotateResizeDrag.startWorldW;
      let newWorldH = rotateResizeDrag.startWorldH;

      if (rotateResizeDrag.handle === 'br') {
        newWorldW = rotateResizeDrag.startWorldW + dLocalX;
        newWorldH = rotateResizeDrag.startWorldH + dLocalY;
      } else if (rotateResizeDrag.handle === 'tr') {
        newWorldW = rotateResizeDrag.startWorldW + dLocalX;
        newWorldY = rotateResizeDrag.startWorldY + dLocalY;
        newWorldH = rotateResizeDrag.startWorldH - dLocalY;
      } else if (rotateResizeDrag.handle === 'bl') {
        newWorldX = rotateResizeDrag.startWorldX + dLocalX;
        newWorldW = rotateResizeDrag.startWorldW - dLocalX;
        newWorldH = rotateResizeDrag.startWorldH + dLocalY;
      } else {
        // tl
        newWorldX = rotateResizeDrag.startWorldX + dLocalX;
        newWorldY = rotateResizeDrag.startWorldY + dLocalY;
        newWorldW = rotateResizeDrag.startWorldW - dLocalX;
        newWorldH = rotateResizeDrag.startWorldH - dLocalY;
      }

      const minWorld = 1;
      if (newWorldW < minWorld) {
        const diff = minWorld - newWorldW;
        if (rotateResizeDrag.handle === 'tl' || rotateResizeDrag.handle === 'bl') newWorldX -= diff;
        newWorldW = minWorld;
      }
      if (newWorldH < minWorld) {
        const diff = minWorld - newWorldH;
        if (rotateResizeDrag.handle === 'tl' || rotateResizeDrag.handle === 'tr') newWorldY -= diff;
        newWorldH = minWorld;
      }

      const screenX = (x + RULER_LEFT) + newWorldX * scale;
      const screenY = (y + RULER_TOP) + newWorldY * scale;
      const screenW = newWorldW * scale;
      const screenH = newWorldH * scale;

      setActiveHandleIdx(rotateResizeDrag.idx);
      setActiveHandleBox({ x: screenX, y: screenY, w: screenW, h: screenH });
      setLiveOverlay({ type: 'resize', wMm: newWorldW * PX_TO_MM, hMm: newWorldH * PX_TO_MM });
    };

    const onUp = () => {
      const idx = rotateResizeDrag.idx;
      const box = activeHandleBox;
      if (!box) {
        setRotateResizeDrag(null);
        return;
      }

      const worldX = (box.x - (x + RULER_LEFT)) / scale;
      const worldY = (box.y - (y + RULER_TOP)) / scale;
      const worldW = box.w / scale;
      const worldH = box.h / scale;

      const mmX = Math.round((worldX * PX_TO_MM) * 100) / 100;
      const mmY = Math.round((worldY * PX_TO_MM) * 100) / 100;
      const mmW = Math.round((worldW * PX_TO_MM) * 100) / 100;
      const mmH = Math.round((worldH * PX_TO_MM) * 100) / 100;

      setLiveOverlay(null);
      setActiveHandleIdx(null);
      setActiveHandleBox(null);
      setRotateResizeDrag(null);

      commitComponentList(
        latestComponentListRef.current.map((p: COMPONENT_DATA, i: number) =>
          i === idx ? { ...p, POS_X: mmX, POS_Y: mmY, SIZE_W: mmW, SIZE_H: mmH } : p,
        ),
      );
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [rotateResizeDrag, x, y, scale, componentList, activeHandleBox, commitComponentList]);

  useEffect(() => {
    const isArrow = (k: string) => ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(k);

    const isAgGridTarget = (t: EventTarget | null) => {
      const el = t as any;
      if (!el) return false;
      if (typeof (el as any).closest === 'function') {
        return Boolean((el as HTMLElement).closest('.ag-theme-quartz'));
      }
      return false;
    };

    const computeDir = (k: string) => {
      if (k === 'ArrowLeft') return { dx: -1, dy: 0 };
      if (k === 'ArrowRight') return { dx: 1, dy: 0 };
      if (k === 'ArrowUp') return { dx: 0, dy: -1 };
      return { dx: 0, dy: 1 };
    };

    const stopNudge = () => {
      const st = nudgeStateRef.current;
      if (!st?.active) return;

      if (st.timerId != null) {
        window.clearInterval(st.timerId);
      }

      nudgeStateRef.current = null;
      setLiveOverlay(null);

      const finalList = latestComponentListRef.current;
      commitComponentList(finalList);
    };

    const applyNudgeStep = (dtMs: number) => {
      const st = nudgeStateRef.current;
      if (!st?.active) return;

      const t = performance.now() - st.startMs;
      const baseStepMm = 0.01;
      const accel = Math.min(40, 1 + t / 250);
      const stepMm = baseStepMm * accel;

      const idx = currentComponent;
      const cur = latestComponentListRef.current[idx];
      if (!cur) {
        stopNudge();
        return;
      }

      const mult = Math.max(0.25, dtMs / 30);
      const deltaMm = stepMm * mult;

      const nextList = latestComponentListRef.current.map((p, i) => {
        if (i !== idx) return p;

        if (st.ctrl) {
          const nextW = Math.max(0.01, (p.SIZE_W ?? 0) + st.dx * deltaMm);
          const nextH = Math.max(0.01, (p.SIZE_H ?? 0) + st.dy * deltaMm);
          return { ...p, SIZE_W: nextW, SIZE_H: nextH };
        }

        const nextX = Math.max(0, (p.POS_X ?? 0) + st.dx * deltaMm);
        const nextY = Math.max(0, (p.POS_Y ?? 0) + st.dy * deltaMm);
        return { ...p, POS_X: nextX, POS_Y: nextY };
      });

      setComponentList(nextList);
      latestComponentListRef.current = nextList;

      const sel = nextList[idx];
      if (sel) {
        if (st.ctrl) {
          setLiveOverlay({ type: 'resize', wMm: Number(sel.SIZE_W ?? 0), hMm: Number(sel.SIZE_H ?? 0) });
        } else {
          setLiveOverlay({ type: 'drag', xMm: Number(sel.POS_X ?? 0), yMm: Number(sel.POS_Y ?? 0) });
        }
      }
    };

    const isTypingTarget = (t: EventTarget | null) => {
      const el = t as HTMLElement | null;
      if (!el) return false;
      const tag = (el.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
      if ((el as any).isContentEditable) return true;
      return false;
    };

    const onDeleteKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Delete' && e.key !== 'Backspace') return;
      if (isTypingTarget(e.target)) return;
      if (currentComponent < 0 || currentComponent >= latestComponentListRef.current.length) return;
      e.preventDefault();
      deleteSelectedComponent();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (!isArrow(e.key)) return;
      if (isTypingTarget(e.target)) return;
      if (isAgGridTarget(e.target)) return;
      if (currentComponent < 0 || currentComponent >= latestComponentListRef.current.length) return;

      e.preventDefault();

      if (nudgeStateRef.current?.active) return;

      const dir = computeDir(e.key);
      const now = performance.now();
      nudgeStateRef.current = {
        active: true,
        startMs: now,
        dx: dir.dx,
        dy: dir.dy,
        ctrl: e.ctrlKey,
        startSnapshot: latestComponentListRef.current.map((x) => ({ ...x })),
        timerId: null,
      };

      // Apply one step immediately
      applyNudgeStep(30);

      // Then accelerate while holding
      const id = window.setInterval(() => {
        applyNudgeStep(30);
      }, 30);

      const st = nudgeStateRef.current;
      if (st) st.timerId = id;
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (!isArrow(e.key)) return;
      stopNudge();
    };

    window.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('keyup', onKeyUp, true);
    window.addEventListener('keydown', onDeleteKeyDown, true);
    return () => {
      window.removeEventListener('keydown', onKeyDown, true as any);
      window.removeEventListener('keyup', onKeyUp, true as any);
      window.removeEventListener('keydown', onDeleteKeyDown, true as any);
      stopNudge();
    };
  }, [currentComponent, commitComponentList, deleteSelectedComponent]);

  useEffect(() => {
    if (!isGroupDragging) return;

    const onMove = (e: MouseEvent) => {
      const start = groupDragStartRef.current;
      if (!start) return;
      // x/y are screen pixels (left/top), not scaled by CSS transform
      const dx = e.clientX - start.mouseX;
      const dy = e.clientY - start.mouseY;
      setX(start.x + dx);
      setY(start.y + dy);
    };

    const onUp = () => {
      setIsGroupDragging(false);
      groupDragStartRef.current = null;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isGroupDragging, scale]);

  const designBBoxPx = useMemo(() => {
    if (componentList.length === 0) {
      return { minX: 0, minY: 0, width: 0, height: 0 };
    }

    let minX = Number.POSITIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;

    for (const c of componentList) {
      const cx = (c.POS_X ?? 0) * MM_TO_PX;
      const cy = (c.POS_Y ?? 0) * MM_TO_PX;
      const cw = (c.SIZE_W ?? 0) * MM_TO_PX;
      const ch = (c.SIZE_H ?? 0) * MM_TO_PX;
      minX = Math.min(minX, cx);
      minY = Math.min(minY, cy);
      maxX = Math.max(maxX, cx + cw);
      maxY = Math.max(maxY, cy + ch);
    }

    if (!Number.isFinite(minX) || !Number.isFinite(minY)) {
      return { minX: 0, minY: 0, width: 0, height: 0 };
    }

    const pad = 6;
    minX = Math.max(0, minX - pad);
    minY = Math.max(0, minY - pad);
    const width = Math.max(0, maxX - minX + pad * 2);
    const height = Math.max(0, maxY - minY + pad * 2);
    return { minX, minY, width, height };
  }, [componentList]);

  const stageSizePx = useMemo(() => {
    return {
      width: Math.max(10, designBBoxPx.minX + designBBoxPx.width),
      height: Math.max(10, designBBoxPx.minY + designBBoxPx.height),
    };
  }, [designBBoxPx]);

  useEffect(() => {
    const el = designRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      const delta = e.deltaY;
      setScale((prev) => {
        const next = delta < 0 ? prev * 1.1 : prev / 1.1;
        return Math.max(MIN_SCALE, Math.min(MAX_SCALE, next));
      });
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel as any);
    };
  }, [MAX_SCALE, MIN_SCALE]);

  useEffect(() => {
    const el = designRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setDesignViewSize({ w: r.width, h: r.height });
    });
    ro.observe(el);
    const r = el.getBoundingClientRect();
    setDesignViewSize({ w: r.width, h: r.height });
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!rotateDrag) return;

    const onMove = (e: MouseEvent) => {
      const a = Math.atan2(e.clientY - rotateDrag.centerY, e.clientX - rotateDrag.centerX) * 180 / Math.PI;
      const delta = a - rotateDrag.startMouseAngle;
      const next = rotateDrag.startRotate + delta;
      updateComponentAt(rotateDrag.idx, { ROTATE: next }, false);
    };

    const onUp = () => {
      const idx = rotateDrag.idx;
      const nextList = componentList.map((p, i) => (i === idx ? { ...p, ROTATE: componentList[i].ROTATE } : p));
      commitComponentList(nextList);
      setRotateDrag(null);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [rotateDrag, componentList, commitComponentList]);

  const paletteItems = useMemo(() => {
    return [
      { type: 'TEXT', label: 'TEXT' },
      { type: 'IMAGE', label: 'IMAGE' },
      { type: '1D BARCODE', label: '1D' },
      { type: '2D MATRIX', label: '2D' },
      { type: 'QRCODE', label: 'QR' },
      { type: 'CONTAINER', label: 'BOX' },
    ];
  }, []);

  const gridBackground = useMemo(() => {
    const stepPx = Math.max(1, gridMm * MM_TO_PX);
    const stroke = 'rgba(0,0,0,0.18)';
    const lineW = 0.5;

    if (gridStyle === 'solid') {
      return `repeating-linear-gradient(0deg, ${stroke} 0, ${stroke} ${lineW}px, transparent ${lineW}px, transparent ${stepPx}px), repeating-linear-gradient(90deg, ${stroke} 0, ${stroke} ${lineW}px, transparent ${lineW}px, transparent ${stepPx}px)`;
    }

    const dash = 3;
    const gap = 3;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${stepPx}" height="${stepPx}" viewBox="0 0 ${stepPx} ${stepPx}" shape-rendering="crispEdges"><path d="M0 0H${stepPx} M0 0V${stepPx}" fill="none" stroke="${stroke}" stroke-width="${lineW}" stroke-dasharray="${dash} ${gap}"/></svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  }, [gridMm, gridStyle]);

  const rulerTicks = useMemo(() => {
    const w = designViewSize.w;
    const h = designViewSize.h;
    if (w <= 0 || h <= 0) return { x: [] as number[], y: [] as number[] };

    // Ruler origin must be at the intersection corner (RULER_LEFT, RULER_TOP).
    // We measure in viewport coordinates and scale tick spacing with zoom.
    const stepPxScreen = Math.max(1, gridMm * MM_TO_PX * scale);
    const usableW = Math.max(0, w - RULER_LEFT);
    const usableH = Math.max(0, h - RULER_TOP);

    const xs: number[] = [];
    for (let s = 0; s <= usableW; s += stepPxScreen) xs.push(s);
    const ys: number[] = [];
    for (let s = 0; s <= usableH; s += stepPxScreen) ys.push(s);

    return { x: xs, y: ys };
  }, [designViewSize, scale, gridMm, RULER_LEFT, RULER_TOP]);

  const codeInfoColumns = useMemo(() => {
    return [
      { field: 'id', headerName: 'ID', width: 60 },
      { field: 'G_CODE', headerName: 'G_CODE', width: 90 },
      { field: 'G_NAME', headerName: 'G_NAME', width: 260, flex: 1 },
      { field: 'G_NAME_KD', headerName: 'G_NAME_KD', width: 160 },
    ];
  }, []);

  const codeInfoTable = useMemo(() => {
    return (
      <AGTable
        suppressRowClickSelection={false}
        showFilter={true}
        rowHeight={28}
        toolbar={
          <div style={{ fontSize: '0.7rem', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                SaveExcel(rows, 'Code Info Table');
              }}
            >
              <AiFillFileExcel color="green" size={15} />
              SAVE
            </IconButton>
          </div>
        }
        columns={codeInfoColumns}
        data={rows}
        onRowClick={(params: any) => {
          if (!params?.data) return;
          handleCODESelectionforUpdate([params.data]);
        }}
        onSelectionChange={(params: any) => {
          const sel = params?.api?.getSelectedRows?.() ?? [];
          handleCODESelectionforUpdate(sel);
        }}
      />
    );
  }, [rows, codeInfoColumns]);

  const updateComponentAt = (index: number, patch: Partial<COMPONENT_DATA>, commit = false) => {
    const next = componentList.map((p, i) => (i === index ? { ...p, ...patch } : p));
    if (commit) commitComponentList(next);
    else setComponentList(next);
  };

  const renderHandles = () => {
    return componentList.map((c, idx) => {
      const pxX = (c.POS_X ?? 0) * MM_TO_PX;
      const pxY = (c.POS_Y ?? 0) * MM_TO_PX;
      const pxW = Math.max(1, (c.SIZE_W ?? 1) * MM_TO_PX);
      const pxH = Math.max(1, (c.SIZE_H ?? 1) * MM_TO_PX);

      const screenX = RULER_LEFT + x + pxX * scale;
      const screenY = RULER_TOP + y + pxY * scale;
      const screenW = pxW * scale;
      const screenH = pxH * scale;

      const isActive = activeHandleIdx === idx && activeHandleBox != null;
      // RESTORE DRAG using activeHandleBox to act as local state for immediate feedback
      const usedX = isActive ? activeHandleBox!.x : screenX;
      const usedY = isActive ? activeHandleBox!.y : screenY;
      
      const usedW = isActive ? activeHandleBox!.w : screenW;
      const usedH = isActive ? activeHandleBox!.h : screenH;

      const selected = idx === currentComponent;
      const rot = (c.ROTATE ?? 0);

      return (
        <Rnd
          key={`h_${idx}`}
          size={{ width: usedW, height: usedH }}
          position={{ x: usedX, y: usedY }}
          scale={1}
          minWidth={1}
          minHeight={1}
          enableResizing={false}
          disableDragging={!isCtrlDown || !selected}
          resizeHandleStyles={{
            top: { height: 12 },
            right: { width: 12 },
            bottom: { height: 12 },
            left: { width: 12 },
            topRight: { width: 16, height: 16 },
            bottomRight: { width: 16, height: 16 },
            bottomLeft: { width: 16, height: 16 },
            topLeft: { width: 16, height: 16 },
          }}
          onMouseDown={(e: any) => {
            e.stopPropagation();
            
            // CYCLE SELECTION LOGIC
            // 1. Calculate hit test for all components
            const clickX = e.clientX;
            const clickY = e.clientY;

            // We need to find all components under this mouse position
            // But 'e' here is relative to the handle if we are not careful? 
            // actually onMouseDown on Rnd might bubble? Rnd catches it?
            
            // Simpler approach: If we are clicking THIS component, checking if we want to cycle.
            // However, Rnd's onMouseDown captures the event.
            // If we are already selected, we might want to select the NEXT one below us?
            // But if we are selected, Rnd might be initiating a drag.
            
            // Let's rely on a global check if possible, OR:
            // If current component IS selected, and we click it again (without dragging?), maybe cycle?
            // Difficult to distinguish drag vs click here. 
            // Better approach: Calculate overlap on click.
            
            // Let's look at all components and see which ones intersect the mouse event.
            // Since we don't have easy access to absolute mouse coordinates relative to the design container in this scope easily without ref.
            // But we know 'idx' is clicked.
            
             // If we just set currentComponent, it works for the top one.
            // But if z-index makes the top one capture clicks, we can't reach the bottom one.
            // The user wants to reach the bottom one.
            
            // Current Logic:
            if (currentComponent === idx) {
               // If already selected, maybe we try to select the next one at this location?
               // We need to find other components that intersect this point.
               // It's tricky without a centralized handler. 
               
               // Alternative: If Rnd allows click propagation? No, it usually stops propagation.
               // We can manually trigger a check.
            }
            
            // Let's implement cycling if we click the *currently selected* item or if we handle it centrally.
            // But here we are inside the map.
            
            // Attempt: Find all components overlapping with THIS component (approximately).
            // Better: use the mouse event client coordinates to check against all component BBoxes on screen.
            
            // We need to perform a hit test against ALL components.
            const containerRect = designRef.current?.getBoundingClientRect();
            if(!containerRect) {
               setCurrentComponent(idx);
               return;
            }

            const mouseX = e.clientX - containerRect.left;
            const mouseY = e.clientY - containerRect.top;
            
            // Find all components that contain (mouseX, mouseY)
            const matches: number[] = [];
            componentList.forEach((c, i) => {
               const cx = (c.POS_X ?? 0) * MM_TO_PX * scale + x + RULER_LEFT;
               const cy = (c.POS_Y ?? 0) * MM_TO_PX * scale + y + RULER_TOP;
               const cw = Math.max(16, (c.SIZE_W ?? 1) * MM_TO_PX * scale);
               const ch = Math.max(16, (c.SIZE_H ?? 1) * MM_TO_PX * scale);
               
               if (mouseX >= cx && mouseX <= cx + cw && mouseY >= cy && mouseY <= cy + ch) {
                  matches.push(i);
               }
            });

            if (matches.length > 1) {
               // Cycle
               const currentIndexInMatches = matches.indexOf(currentComponent);
               
               // If current component is not in matches (e.g. clicking a new stack), select the last one (topmost)? 
               // Or usually topmost is rendered last (z-index).
               // Let's select the next one in the list.
               let nextMatchIndex = -1;
               if (currentIndexInMatches === -1) {
                  // Select the last match (visually on top usually if rendered in order)
                  nextMatchIndex = matches.length - 1; 
               } else {
                  // Cycle backwards (to go 'down') or forwards?
                  // If we want to select 'next' below, we go to index - 1?
                  // Let's just cycle.
                   nextMatchIndex = (currentIndexInMatches + 1) % matches.length;
               }
               
               setCurrentComponent(matches[nextMatchIndex]);
            } else {
               setCurrentComponent(idx);
            }
          }}
          onDragStart={(e: any) => {
            e.stopPropagation();
            setCurrentComponent(idx);
            setActiveHandleIdx(idx);
            setActiveHandleBox({ x: usedX, y: usedY, w: usedW, h: usedH });
          }}
          onDrag={(e: any, d: any) => {
            let newX = d.x;
            let newY = d.y;
            
            const currentSnapLines: { type: 'vertical' | 'horizontal', pos: number }[] = [];

            if (enableSnap) {
               // SNAP LOGIC
               const threshold = 3 * scale; // REDUCED SENSITIVITY from 5 to 3
               const myW = usedW;
               const myH = usedH;
               
               // Calculate center
               const myCx = newX + myW / 2;
               const myCy = newY + myH / 2;
               const myR = newX + myW;
               const myB = newY + myH;

               componentList.forEach((c, i) => {
                 if (i === idx) return;
                 
                 // Other component coordinates (screen px)
                 const otherPxX = (c.POS_X ?? 0) * MM_TO_PX;
                 const otherPxY = (c.POS_Y ?? 0) * MM_TO_PX;
                 const otherPxW = Math.max(1, (c.SIZE_W ?? 1) * MM_TO_PX);
                 const otherPxH = Math.max(1, (c.SIZE_H ?? 1) * MM_TO_PX);
                 
                 const otherScreenX = RULER_LEFT + x + otherPxX * scale;
                 const otherScreenY = RULER_TOP + y + otherPxY * scale;
                 const otherScreenW = otherPxW * scale;
                 const otherScreenH = otherPxH * scale;

                 const otherCx = otherScreenX + otherScreenW / 2;
                 const otherCy = otherScreenY + otherScreenH / 2;
                 const otherR = otherScreenX + otherScreenW;
                 const otherB = otherScreenY + otherScreenH;

                 // Vertical Snap (compare X)
                 // Left to Left
                 if (Math.abs(newX - otherScreenX) < threshold) { newX = otherScreenX; currentSnapLines.push({ type: 'vertical', pos: newX }); }
                 // Left to Right
                 else if (Math.abs(newX - otherR) < threshold) { newX = otherR; currentSnapLines.push({ type: 'vertical', pos: newX }); }
                 // Right to Left
                 else if (Math.abs(myR - otherScreenX) < threshold) { newX = otherScreenX - myW; currentSnapLines.push({ type: 'vertical', pos: otherScreenX }); }
                 // Right to Right
                 else if (Math.abs(myR - otherR) < threshold) { newX = otherR - myW; currentSnapLines.push({ type: 'vertical', pos: otherR }); }
                 // Center to Center
                 else if (Math.abs(myCx - otherCx) < threshold) { newX = otherCx - myW / 2; currentSnapLines.push({ type: 'vertical', pos: otherCx }); }

                 // Horizontal Snap (compare Y)
                 // Top to Top
                 if (Math.abs(newY - otherScreenY) < threshold) { newY = otherScreenY; currentSnapLines.push({ type: 'horizontal', pos: newY }); }
                 // Top to Bottom
                 else if (Math.abs(newY - otherB) < threshold) { newY = otherB; currentSnapLines.push({ type: 'horizontal', pos: newY }); }
                 // Bottom to Top
                 else if (Math.abs(myB - otherScreenY) < threshold) { newY = otherScreenY - myH; currentSnapLines.push({ type: 'horizontal', pos: otherScreenY }); }
                 // Bottom to Bottom
                 else if (Math.abs(myB - otherB) < threshold) { newY = otherB - myH; currentSnapLines.push({ type: 'horizontal', pos: otherB }); }
                 // Center to Center
                 else if (Math.abs(myCy - otherCy) < threshold) { newY = otherCy - myH / 2; currentSnapLines.push({ type: 'horizontal', pos: otherCy }); }
               });
            }

            setSnapLines(currentSnapLines);

            if (activeHandleIdx === idx) {
              setActiveHandleBox((prev) => ({
                x: newX,
                y: newY,
                w: prev?.w ?? usedW,
                h: prev?.h ?? usedH,
              }));
            }
            const unscaledX = (newX - (x + RULER_LEFT)) / scale;
            const unscaledY = (newY - (y + RULER_TOP)) / scale;
            const mmX = unscaledX * PX_TO_MM;
            const mmY = unscaledY * PX_TO_MM;
            // REMOVE HEAVY UPDATE: Don't update componentList state during drag
            // updateComponentAt(idx, { POS_X: mmX, POS_Y: mmY }, false); 
            
            if (idx === currentComponent) setLiveOverlay({ type: 'drag', xMm: mmX, yMm: mmY });
          }}
          onDragStop={(e: any, d: any) => {
            setSnapLines([]);
            // Use local drag state if available to get the snapped position
            
            let finalX = d.x;
            let finalY = d.y;
            
            if (activeHandleBox) {
                finalX = activeHandleBox.x;
                finalY = activeHandleBox.y;
            }

            const unscaledX = (finalX - (x + RULER_LEFT)) / scale;
            const unscaledY = (finalY - (y + RULER_TOP)) / scale;
            const mmX = Math.round((unscaledX * PX_TO_MM) * 100) / 100;
            const mmY = Math.round((unscaledY * PX_TO_MM) * 100) / 100;
            setLiveOverlay(null);
            setActiveHandleIdx(null);
            setActiveHandleBox(null);
            
            // Commit final position
            commitComponentList(
              componentList.map((p, i) => (i === idx ? { ...p, POS_X: mmX, POS_Y: mmY } : p)),
            );
          }}
          onResize={(e: any, dir: any, ref: any, delta: any, pos: any) => {
            let newX = pos.x;
            let newY = pos.y;
            let newW = ref.offsetWidth;
            let newH = ref.offsetHeight;
            
            const currentSnapLines: { type: 'vertical' | 'horizontal', pos: number }[] = [];

            if (enableSnap) {
               const threshold = 3 * scale; // REDUCED SENSITIVITY
               
               // Identify which edges are moving based on 'dir'
               const d = dir.toLowerCase();

               // Calculate current edges map (candidate values)
               let myL = newX;
               let myT = newY;
               // Note: Rnd updates pos.x/y. Calculate Right/Bottom based on new Width/Height
               // But strictly: Right = x + w.
               // During resize, newW/newH are the NEW dimensions.
               
               componentList.forEach((c, i) => {
                 if (i === idx) return;
                 
                 // Other component coordinates (screen px)
                 const otherPxX = (c.POS_X ?? 0) * MM_TO_PX;
                 const otherPxY = (c.POS_Y ?? 0) * MM_TO_PX;
                 const otherPxW = Math.max(1, (c.SIZE_W ?? 1) * MM_TO_PX);
                 const otherPxH = Math.max(1, (c.SIZE_H ?? 1) * MM_TO_PX);
                 
                 const otherScreenX = RULER_LEFT + x + otherPxX * scale;
                 const otherScreenY = RULER_TOP + y + otherPxY * scale;
                 const otherScreenW = otherPxW * scale;
                 const otherScreenH = otherPxH * scale;

                 const otherR = otherScreenX + otherScreenW;
                 const otherB = otherScreenY + otherScreenH;

                 // We need to recalculate myR/myB inside loop or before? 
                 // The snap logic modifies newX/newW/newY/newH.
                 // Ideally we snap against the *original* candidate components?
                 // Or cumulative snapping?
                 // Simple approach: Check snaps against candidate position.
                 
                 // Recalculate my edges based on current 'new' values
                 const currL = newX;
                 const currT = newY;
                 const currR = newX + newW;
                 const currB = newY + newH;

                 // Horizontal Resizing Snaps
                 if (d.includes('left')) {
                    // Left edge moving. Snap Left to Other Left/Right
                    if (Math.abs(currL - otherScreenX) < threshold) {
                        const diff = otherScreenX - currL;
                        newX = otherScreenX; newW -= diff; currentSnapLines.push({ type: 'vertical', pos: newX });
                    } else if (Math.abs(currL - otherR) < threshold) {
                        const diff = otherR - currL;
                        newX = otherR; newW -= diff; currentSnapLines.push({ type: 'vertical', pos: newX });
                    }
                 }
                 if (d.includes('right')) {
                    // Right edge moving. Snap Right to Other Left/Right
                    if (Math.abs(currR - otherScreenX) < threshold) {
                         const diff = otherScreenX - currR;
                         newW += diff; currentSnapLines.push({ type: 'vertical', pos: otherScreenX });
                    } else if (Math.abs(currR - otherR) < threshold) {
                         const diff = otherR - currR;
                         newW += diff; currentSnapLines.push({ type: 'vertical', pos: otherR });
                    }
                 }
                 
                 // Vertical Resizing Snaps
                 if (d.includes('top')) {
                     // Top edge moving
                     if (Math.abs(currT - otherScreenY) < threshold) {
                         const diff = otherScreenY - currT;
                         newY = otherScreenY; newH -= diff; currentSnapLines.push({ type: 'horizontal', pos: newY });
                     } else if (Math.abs(currT - otherB) < threshold) {
                         const diff = otherB - currT;
                         newY = otherB; newH -= diff; currentSnapLines.push({ type: 'horizontal', pos: newY });
                     }
                 }
                 if (d.includes('bottom')) {
                     // Bottom edge moving
                     if (Math.abs(currB - otherScreenY) < threshold) {
                         const diff = otherScreenY - currB;
                         newH += diff; currentSnapLines.push({ type: 'horizontal', pos: otherScreenY });
                     } else if (Math.abs(currB - otherB) < threshold) {
                         const diff = otherB - currB;
                         newH += diff; currentSnapLines.push({ type: 'horizontal', pos: otherB });
                     }
                 }
               });
            }
            
            setSnapLines(currentSnapLines);
            
            if (activeHandleIdx === idx) {
              setActiveHandleBox({ x: newX, y: newY, w: newW, h: newH });
            }
            const w = newW / scale;
            const h = newH / scale;
            const unscaledX = (newX - (x + RULER_LEFT)) / scale;
            const unscaledY = (newY - (y + RULER_TOP)) / scale;
            const mmW = w * PX_TO_MM;
            const mmH = h * PX_TO_MM;
            const mmX = unscaledX * PX_TO_MM;
            const mmY = unscaledY * PX_TO_MM;

            if (idx === currentComponent) setLiveOverlay({ type: 'resize', wMm: mmW, hMm: mmH });
          }}
          onResizeStop={(e: any, dir: any, ref: any, delta: any, pos: any) => {
            setSnapLines([]);
            
            // Get final values from activeHandleBox if available (since we snapped it there)
            let finalX = pos.x;
            let finalY = pos.y;
            let finalW = ref.offsetWidth;
            let finalH = ref.offsetHeight;
            
            if (activeHandleBox) {
                finalX = activeHandleBox.x;
                finalY = activeHandleBox.y;
                finalW = activeHandleBox.w;
                finalH = activeHandleBox.h;
            }
            
            const w = finalW / scale;
            const h = finalH / scale;
            const unscaledX = (finalX - (x + RULER_LEFT)) / scale;
            const unscaledY = (finalY - (y + RULER_TOP)) / scale;
            const mmW = Math.round((w * PX_TO_MM) * 100) / 100;
            const mmH = Math.round((h * PX_TO_MM) * 100) / 100;
            const mmX = Math.round((unscaledX * PX_TO_MM) * 100) / 100;
            const mmY = Math.round((unscaledY * PX_TO_MM) * 100) / 100;
            setLiveOverlay(null);
            setActiveHandleIdx(null);
            setActiveHandleBox(null);
            commitComponentList(
              componentList.map((p, i) =>
                i === idx ? { ...p, SIZE_W: mmW, SIZE_H: mmH, POS_X: mmX, POS_Y: mmY } : p,
              ),
            );
          }}
          style={{
            border: '2px solid transparent',
            background: 'transparent',
            boxSizing: 'border-box',
            zIndex: selected ? 200 : 10,
            pointerEvents: 'auto', // Allow clicking even if not selected, so we can capture click to cycle
          }}
        >
          {selected && (
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                border: '2px solid rgba(25,118,210,0.9)',
                background: 'rgba(25, 118, 210, 0.05)',
                boxSizing: 'border-box',
                transform: rot ? `rotate(${rot}deg)` : undefined,
                transformOrigin: 'top left',
                pointerEvents: 'none',
              }}
            />
          )}
        </Rnd>
      );
    });
  };

  const renderRotatedResizeHandles = () => {
    if (!isCtrlDown) return null;
    const idx = currentComponent;
    if (idx < 0) return null;
    const c = componentList[idx];
    if (!c) return null;
    if (rotateResizeDrag && rotateResizeDrag.idx !== idx) return null;

    const pxX = (c.POS_X ?? 0) * MM_TO_PX;
    const pxY = (c.POS_Y ?? 0) * MM_TO_PX;
    const pxW = Math.max(1, (c.SIZE_W ?? 1) * MM_TO_PX);
    const pxH = Math.max(1, (c.SIZE_H ?? 1) * MM_TO_PX);

    // If resizing, prefer activeHandleBox for live position/size
    const baseScreenX = activeHandleIdx === idx && activeHandleBox ? activeHandleBox.x : (RULER_LEFT + x + pxX * scale);
    const baseScreenY = activeHandleIdx === idx && activeHandleBox ? activeHandleBox.y : (RULER_TOP + y + pxY * scale);
    const baseScreenW = activeHandleIdx === idx && activeHandleBox ? activeHandleBox.w : (pxW * scale);
    const baseScreenH = activeHandleIdx === idx && activeHandleBox ? activeHandleBox.h : (pxH * scale);

    const rotDeg = (c.ROTATE ?? 0);
    const rotRad = (rotDeg * Math.PI) / 180;
    const cos = Math.cos(rotRad);
    const sin = Math.sin(rotRad);

    const tl = { x: baseScreenX, y: baseScreenY };
    const tr = { x: baseScreenX + baseScreenW * cos, y: baseScreenY + baseScreenW * sin };
    const bl = { x: baseScreenX - baseScreenH * sin, y: baseScreenY + baseScreenH * cos };
    const br = { x: tr.x - baseScreenH * sin, y: tr.y + baseScreenH * cos };

    const hs = 10;
    const half = hs / 2;

    const begin = (handle: 'tl' | 'tr' | 'bl' | 'br') => (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const rect = designRef.current?.getBoundingClientRect();
      if (!rect) return;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const startMouseWorldX = (mouseX - (x + RULER_LEFT)) / scale;
      const startMouseWorldY = (mouseY - (y + RULER_TOP)) / scale;

      const startWorldX = activeHandleIdx === idx && activeHandleBox ? (activeHandleBox.x - (x + RULER_LEFT)) / scale : pxX;
      const startWorldY = activeHandleIdx === idx && activeHandleBox ? (activeHandleBox.y - (y + RULER_TOP)) / scale : pxY;
      const startWorldW = activeHandleIdx === idx && activeHandleBox ? activeHandleBox.w / scale : pxW;
      const startWorldH = activeHandleIdx === idx && activeHandleBox ? activeHandleBox.h / scale : pxH;

      setRotateResizeDrag({
        idx,
        handle,
        startMouseWorldX,
        startMouseWorldY,
        startWorldX,
        startWorldY,
        startWorldW,
        startWorldH,
      });
      setActiveHandleIdx(idx);
      setActiveHandleBox({ x: baseScreenX, y: baseScreenY, w: baseScreenW, h: baseScreenH });
    };

    const dotStyle = (cursor: string) => ({
      position: 'absolute' as const,
      width: hs,
      height: hs,
      borderRadius: 2,
      background: '#fff',
      border: '2px solid #1976d2',
      zIndex: 260,
      cursor,
      pointerEvents: 'auto' as const,
      boxSizing: 'border-box' as const,
    });

    return (
      <>
        <div style={{ ...dotStyle('nwse-resize'), left: tl.x - half, top: tl.y - half }} onMouseDown={begin('tl')} />
        <div style={{ ...dotStyle('nesw-resize'), left: tr.x - half, top: tr.y - half }} onMouseDown={begin('tr')} />
        <div style={{ ...dotStyle('nesw-resize'), left: bl.x - half, top: bl.y - half }} onMouseDown={begin('bl')} />
        <div style={{ ...dotStyle('nwse-resize'), left: br.x - half, top: br.y - half }} onMouseDown={begin('br')} />
      </>
    );
  };

  return (
    (<div className="design_window">
      <div className="design_control" id="dsg_ctrl" style={{ width: showhidecodelist ? '20%' : '0%', overflow: 'hidden' }}>
        {showhidecodelist && (
          <div className="codelist">
            <span style={{ color: "blue", fontWeight: "bold", fontSize: 20 }}>
              List Code
            </span>
            <div className="tracuuFcst">
              <div className="tracuuFcstform">
                <div className="forminput">
                  <div className="forminputcolumn">
                    <label>
                      <b> All Code:</b>{" "}
                      <input
                        type="text"
                        placeholder="Nhập code vào đây"
                        value={codeCMS}
                        onChange={(e) => setCodeCMS(e.target.value)}
                        onKeyDown={(e) => {
                          handleSearchCodeKeyDown(e);
                        }}
                      ></input>
                    </label>
                    <button
                      className="traxuatkiembutton"
                      onClick={() => {
                        handleCODEINFO();
                      }}
                    >
                      Tìm code
                    </button>
                  </div>
                </div>
              </div>
              <div className="codeinfotable">{codeInfoTable}</div>
            </div>
          </div>
        )}
        {/*
        <div className="componentSide" style={{ width: showhidecodelist ? '50%' : '100%' }}>
          <div className="componentList">
            <div className="title">
              <div style={{ color: "blue", fontWeight: "bold", fontSize: 20 }}>
                List Component
              </div>
            </div>
            <div className="componentdiv">
              <div className="addnewcomponent">
                <label>
                  New Component:
                  <select
                    name="newcomponent"
                    value={newComponent}
                    onChange={(e) => {
                      setNewComponent(e.target.value);
                    }}
                  >
                    <option value="TEXT">TEXT</option>
                    <option value="IMAGE">IMAGE</option>
                    <option value="1D BARCODE">1D BARCODE</option>
                    <option value="2D MATRIX">2D MATRIX</option>
                    <option value="QRCODE">QRCODE</option>
                    <option value="CONTAINER">CONTAINER</option>
                  </select>
                </label>
                <IconButton
                  className="buttonIcon"
                  onClick={async () => {
                    await addComponent();
                  }}
                >
                  <GrAdd color="white" size={15} />
                  Add
                </IconButton>
              </div>
              <List dense={true}>
                {componentList.map((ele: COMPONENT_DATA, index: number) => {
                  return (
                    <ListItem
                      key={index}
                    >
                      <ListItemButton
                        role={undefined}
                        onClick={() => {
                          setCurrentComponent(index);
                        }}
                        dense
                        sx={{ py: 0, minHeight: 32, backgroundColor: index === currentComponent ? 'rgba(25, 118, 210, 0.12)' : 'transparent' }}
                      >
                        <ListItemText
                          primaryTypographyProps={{ fontSize: '0.75rem', fontWeight: 'bold' }}
                          secondaryTypographyProps={{ fontSize: '0.65rem' }}
                          primary={`${ele.DOITUONG_NO}.${ele.DOITUONG_NAME}`}
                          secondary={ele.PHANLOAI_DT}
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </div>
          </div>
          <div className="componentProps">
            <span style={{ color: "blue", fontWeight: "bold", fontSize: 20 }}>
              Component Properties{" "}
            </span>
            {componentList.length > 0 && (
              <div className="propsform">
                <div className="forminput">
                  <div className="forminputcolumn">
                  <b>COMPONENT TYPE:</b>
                  <label>
                    <select
                      name="newcomponent"
                      value={
                        componentList.filter(
                          (ele: COMPONENT_DATA, index: number) =>
                            currentComponent === index,
                        )[0]?.PHANLOAI_DT
                      }
                      onChange={(e) => {
                        updateComponentAt(currentComponent, { PHANLOAI_DT: e.target.value }, true);
                      }}
                    >
                      <option value="TEXT">TEXT</option>
                      <option value="IMAGE">IMAGE</option>
                      <option value="1D BARCODE">1D BARCODE</option>
                      <option value="2D MATRIX">2D MATRIX</option>
                      <option value="QRCODE">QRCODE</option>
                      <option value="CONTAINER">CONTAINER</option>
                    </select>
                  </label>
                  <b>COMPONENT NAME</b>
                  <label>
                    <input
                      type="text"
                      placeholder="Code hàng"
                      value={
                        componentList.filter(
                          (ele: COMPONENT_DATA, index: number) =>
                            currentComponent === index,
                        )[0]?.DOITUONG_NAME
                      }
                      onChange={(e) => {
                        updateComponentAt(currentComponent, { DOITUONG_NAME: e.target.value }, false);
                      }}
                    ></input>
                  </label>
                  <b>COMPONENT STT</b>
                  <label>
                    <input
                      type="text"
                      placeholder="Code hàng"
                      value={
                        componentList.filter(
                          (ele: COMPONENT_DATA, index: number) =>
                            currentComponent === index,
                        )[0]?.DOITUONG_STT
                      }
                      onChange={(e) => {
                        updateComponentAt(currentComponent, { DOITUONG_STT: e.target.value }, false);
                      }}
                    ></input>
                  </label>
                  <b>CAVITY PRINT</b>
                  <label>
                    <input
                      type="text"
                      placeholder="Code hàng"
                      value={
                        componentList.filter(
                          (ele: COMPONENT_DATA, index: number) =>
                            currentComponent === index,
                        )[0]?.CAVITY_PRINT
                      }
                      onChange={(e) => {
                        updateComponentAt(currentComponent, { CAVITY_PRINT: Number(e.target.value) }, false);
                      }}
                    ></input>
                  </label>
                  <b>VALUE</b>
                  <label>
                    <input
                      type="text"
                      placeholder="Giá trị"
                      value={
                        componentList.filter(
                          (ele: COMPONENT_DATA, index: number) =>
                            currentComponent === index,
                        )[0]?.GIATRI
                      }
                      onChange={(e) => {
                        updateComponentAt(currentComponent, { GIATRI: e.target.value }, false);
                      }}
                    ></input>
                  </label>
                  <b>FONT NAME</b>
                  <label>
                    <input
                      type="text"
                      placeholder="Nhập tên font"
                      value={
                        componentList.filter(
                          (ele: COMPONENT_DATA, index: number) =>
                            currentComponent === index,
                        )[0]?.FONT_NAME
                      }
                      onChange={(e) => {
                        updateComponentAt(currentComponent, { FONT_NAME: e.target.value }, false);
                      }}
                    ></input>
                  </label>
                  <b>COMPONENT NO</b>
                  <label>
                    <input
                      type="text"
                      placeholder="Nhập COMPONENT NO"
                      value={
                        componentList.filter(
                          (ele: COMPONENT_DATA, index: number) =>
                            currentComponent === index,
                        )[0]?.DOITUONG_NO
                      }
                      onChange={(e) => {
                        updateComponentAt(currentComponent, { DOITUONG_NO: Number(e.target.value) }, false);
                      }}
                    ></input>
                  </label>
                </div>
              </div>
              <div className="forminput">
                <div className="forminputcolumn">
                  <b>FONT SIZE (pt)</b>
                  <label>
                    <input
                      type="number"
                      step={0.1}
                      placeholder="Code hàng"
                      value={
                        componentList.filter(
                          (ele: COMPONENT_DATA, index: number) =>
                            currentComponent === index,
                        )[0]?.FONT_SIZE
                      }
                      onChange={(e) => {
                        updateComponentAt(currentComponent, { FONT_SIZE: Number(e.target.value) }, false);
                      }}
                    ></input>
                  </label>
                  <b>FONT STYLE:</b>
                  <label>
                    <select
                      name="fontstyle"
                      value={
                        componentList.filter(
                          (ele: COMPONENT_DATA, index: number) =>
                            currentComponent === index,
                        )[0]?.FONT_STYLE
                      }
                      onChange={(e) => {
                        updateComponentAt(currentComponent, { FONT_STYLE: e.target.value }, true);
                      }}
                    >
                      <option value="B">Bold</option>
                      <option value="I">Italic</option>
                      <option value="U">Underline</option>
                      <option value="R">Regular</option>
                    </select>
                  </label>
                  <b>POS X (mm)</b>
                  <label>
                    <input
                      type="number"
                      step={0.01}
                      lang="en-US"
                      placeholder="10"
                      value={
                        componentList.filter(
                          (ele: COMPONENT_DATA, index: number) =>
                            currentComponent === index,
                        )[0]?.POS_X
                      }
                      onChange={(e) => {
                        updateComponentAt(currentComponent, { POS_X: Number(e.target.value) }, false);
                      }}
                    ></input>
                  </label>
                  <b>POS Y (mm)</b>
                  <label>
                    <input
                      type="number"
                      step={0.01}
                      lang="en-US"
                      placeholder="10"
                      value={
                        componentList.filter(
                          (ele: COMPONENT_DATA, index: number) =>
                            currentComponent === index,
                        )[0]?.POS_Y
                      }
                      onChange={(e) => {
                        updateComponentAt(currentComponent, { POS_Y: Number(e.target.value) }, false);
                      }}
                    ></input>
                  </label>
                  <b>SIZE WIDTH (mm)</b>
                  <label lang="en-US">
                    <input
                      type="number"
                      step={0.01}
                      lang="en-US"
                      placeholder="10"
                      value={
                        componentList.filter(
                          (ele: COMPONENT_DATA, index: number) =>
                            currentComponent === index,
                        )[0]?.SIZE_W
                      }
                      onChange={(e) => {
                        const vl = e.target.value;
                        updateComponentAt(currentComponent, { SIZE_W: Number(vl) }, false);
                      }}
                    ></input>
                  </label>
                  <b>SIZE HEIGHT (mm)</b>
                  <label lang="en-US">
                    <input
                      type="number"
                      step={0.01}
                      lang="en-US"
                      placeholder="10"
                      value={
                        componentList.filter(
                          (ele: COMPONENT_DATA, index: number) =>
                            currentComponent === index,
                        )[0]?.SIZE_H
                      }
                      onChange={(e) => {
                        updateComponentAt(currentComponent, { SIZE_H: Number(e.target.value) }, false);
                      }}
                    ></input>
                  </label>
                  <b>ROTATE (degree)</b>
                  <label lang="en-US">
                    <input
                      type="number"
                      step={0.01}
                      lang="en-US"
                      placeholder="10"
                      value={
                        componentList.filter(
                          (ele: COMPONENT_DATA, index: number) =>
                            currentComponent === index,
                        )[0]?.ROTATE
                      }
                      onChange={(e) => {
                        updateComponentAt(currentComponent, { ROTATE: Number(e.target.value) }, true);
                      }}
                    ></input>
                  </label>
                  <b>REMARK</b>
                  <label lang="en-US">
                    <input
                      type="text"
                      lang="en-US"
                      placeholder="remark"
                      value={
                        componentList.filter(
                          (ele: COMPONENT_DATA, index: number) =>
                            currentComponent === index,
                        )[0]?.REMARK
                      }
                      onChange={(e) => {
                        updateComponentAt(currentComponent, { REMARK: e.target.value }, false);
                      }}
                    ></input>
                  </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        */}
      </div>
      <div className="design_panel" style={{ width: showhidecodelist ? '80%' : '100%', display: 'flex', flexDirection: 'column' }}>
        <div className="design_toolbar">
          <IconButton
            className="buttonIcon"
            onClick={() => {
              // setShowHideCodeList(!showhidecodelist);
              // Do nothing for now or toggle history? Context unclear.
              setShowHideCodeList(!showhidecodelist);
            }}
          >
            <BiShow color="black" size={15} />
            List
          </IconButton>
          <IconButton
            className="buttonIcon"
            onClick={() => {
              confirmSaveDESIGN_AMAZON();
            }}
          >
            <BiSave color="black" size={15} />
            Save
          </IconButton>
          <IconButton className="buttonIcon" onClick={undo} disabled={historyPast.length === 0}>
            Undo
          </IconButton>
          <IconButton className="buttonIcon" onClick={redo} disabled={historyFuture.length === 0}>
            Redo
          </IconButton>
          <IconButton
            className="buttonIcon"
            onClick={() => {
              handlePrint();
            }}
          >
            <BiPrinter color="black" size={15} />
            Print
          </IconButton>
          <span style={{ fontSize: 12, paddingLeft: 8 }}>Offset X (mm):</span>
          <input
            type="number"
            step={0.01}
            value={Number.isFinite(printOffsetMm.x) ? printOffsetMm.x : 0}
            onChange={(e) => {
              const v = Number(e.target.value);
              setAndPersistPrintOffset({ x: Number.isFinite(v) ? v : 0, y: printOffsetMm.y });
            }}
            style={{ width: 80, height: 26, marginLeft: 6 }}
          />
          <span style={{ fontSize: 12, paddingLeft: 8 }}>Offset Y (mm):</span>
          <input
            type="number"
            step={0.01}
            value={Number.isFinite(printOffsetMm.y) ? printOffsetMm.y : 0}
            onChange={(e) => {
              const v = Number(e.target.value);
              setAndPersistPrintOffset({ x: printOffsetMm.x, y: Number.isFinite(v) ? v : 0 });
            }}
            style={{ width: 80, height: 26, marginLeft: 6 }}
          />
          <IconButton
            className="buttonIcon"
            onClick={() => {
              handleListPrinters();
            }}
          >
            <BiPrinter color="black" size={15} />
            Print USB
          </IconButton>
          <IconButton
            className="buttonIcon"
            onClick={() => setEnableSnap(!enableSnap)}
            style={enableSnap ? { backgroundColor: '#e0e0e0' } : {}}
          >
            <BiMagnet color={enableSnap ? "blue" : "black"} size={15} />
            Snap
          </IconButton>
          <IconButton className="buttonIcon" onClick={() => setShowGrid((p) => !p)} style={showGrid ? { backgroundColor: '#e0e0e0' } : {}}>
            Grid
          </IconButton>
          <select value={gridMm} onChange={(e) => setGridMm(Number(e.target.value))} style={{ height: 26 }}>
            <option value={10}>10mm</option>
            <option value={5}>5mm</option>
            <option value={2}>2mm</option>
            <option value={1}>1mm</option>
          </select>
          <select value={gridStyle} onChange={(e) => setGridStyle(e.target.value as any)} style={{ height: 26, marginLeft: 6 }}>
            <option value={'dashed'}>Dashed</option>
            <option value={'solid'}>Solid</option>
          </select>
          <span style={{ fontSize: 12, paddingLeft: 8 }}>Zoom:</span>
          <select
            value={scale}
            onChange={(e) => {
              const next = Number(e.target.value);
              if (!Number.isFinite(next)) return;
              setScale(Math.max(MIN_SCALE, Math.min(MAX_SCALE, next)));
            }}
            style={{ height: 26, marginLeft: 6 }}
          >
            {zoomPresets.map((z) => (
              <option key={z} value={z}>
                {Math.round(z * 100)}%
              </option>
            ))}
          </select>
          <span style={{ fontSize: 12, paddingLeft: 8 }}>({(scale * 100).toFixed(0)}%)</span>

          <div style={{ display: 'flex', flexDirection: 'row', gap: 6, marginLeft: 12, alignItems: 'center' }}>
            {paletteItems.map((it) => (
              <div
                key={it.type}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('amz/newComponentType', it.type);
                  e.dataTransfer.effectAllowed = 'copy';
                }}
                style={{ width: 40, height: 28, border: '1px solid rgba(0,0,0,0.2)', borderRadius: 6, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', cursor: 'grab', userSelect: 'none', background: '#fff' }}
                title={it.type}
              >
                <TbComponents size={14} />
                <div style={{ fontSize: 10, fontWeight: 700, paddingLeft: 4 }}>{it.label}</div>
              </div>
            ))}
          </div>
         {/*  X:
          <input
            type="number"
            step={0.01}
            value={parseFloat((x * 0.26458333333719).toFixed(2))}
            onChange={(e) => {
              console.log(Number(e.target.value) / 0.26458333333719);
              setX(Number(e.target.value) / 0.26458333333719);
            }}
            style={{ width: "80px" }}
          ></input>{" "}
          (mm) Y:
          <input
            type="number"
            step={0.01}
            value={parseFloat((y * 0.26458333333719).toFixed(2))}
            onChange={(e) => {
              console.log(Number(e.target.value) / 0.26458333333719);
              setY(Number(e.target.value) / 0.26458333333719);
            }}
            style={{ width: "80px" }}
          ></input>{" "}
          (mm) */}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        <div
          id="10a"
          className="designAmazon"
          ref={designRef}
          style={{ position: "relative", flex: 7, width: '100%', minHeight: 0, overflow: 'hidden' }}
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDrop={async (e) => {
            e.preventDefault();
            const t = e.dataTransfer.getData('amz/newComponentType');
            if (!t) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const mx = e.clientX - rect.left - RULER_LEFT;
            const my = e.clientY - rect.top - RULER_TOP;
            const worldX = (mx - x) / scale;
            const worldY = (my - y) / scale;
            const mmX = worldX * PX_TO_MM;
            const mmY = worldY * PX_TO_MM;
            await createComponentAt(t, mmX, mmY);
          }}
          onMouseDown={(e) => {
            if (e.ctrlKey && e.target === e.currentTarget) {
              setCurrentComponent(-1);
            }
          }}
        >
          <div style={{ position: 'absolute', left: RULER_LEFT, top: 0, right: 0, height: RULER_TOP, zIndex: 30, pointerEvents: 'none', background: 'rgba(255,255,255,0.92)', borderBottom: '1px solid rgba(0,0,0,0.15)' }}>
            {rulerTicks.x.map((s) => {
              const sx = s;
              const mm = (s / scale) * PX_TO_MM;
              return (
                <div key={`rx_${s}`} style={{ position: 'absolute', left: sx, top: 0, height: 20, width: 1, background: 'rgba(0,0,0,0.35)' }}>
                  <div style={{ position: 'absolute', top: 8, left: 2, fontSize: 10, color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>{Math.round(mm)}</div>
                </div>
              );
            })}
          </div>

          <div style={{ position: 'absolute', left: 0, top: RULER_TOP, bottom: 0, width: RULER_LEFT, zIndex: 30, pointerEvents: 'none', background: 'rgba(255,255,255,0.92)', borderRight: '1px solid rgba(0,0,0,0.15)' }}>
            {rulerTicks.y.map((s) => {
              const sy = s;
              const mm = (s / scale) * PX_TO_MM;
              return (
                <div key={`ry_${s}`} style={{ position: 'absolute', left: 0, top: sy, width: 30, height: 1, background: 'rgba(0,0,0,0.35)' }}>
                  <div style={{ position: 'absolute', left: 2, top: 2, fontSize: 10, color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>{Math.round(mm)}</div>
                </div>
              );
            })}
          </div>
          {snapLines.map((line, i) => (
             <div key={i} style={{
                position: 'absolute',
                left: line.type === 'vertical' ? line.pos : 0,
                top: line.type === 'horizontal' ? line.pos : 0,
                width: line.type === 'vertical' ? 1 : '100%',
                height: line.type === 'horizontal' ? 1 : '100%',
                backgroundColor: 'red',
                zIndex: 9999,
                pointerEvents: 'none',
                border: 'none',
                // Optional: Make it dashed if prefer
             }} />
          ))}

          {(() => {
            const sel = componentList[currentComponent];
            if (!sel || !liveOverlay) return null;

            const pxX = (sel.POS_X ?? 0) * MM_TO_PX;
            const pxY = (sel.POS_Y ?? 0) * MM_TO_PX;
            const pxW = Math.max(1, (sel.SIZE_W ?? 1) * MM_TO_PX);

            const text =
              liveOverlay.type === 'drag'
                ? `X: ${liveOverlay.xMm.toFixed(2)}mm  Y: ${liveOverlay.yMm.toFixed(2)}mm`
                : `W: ${liveOverlay.wMm.toFixed(2)}mm  H: ${liveOverlay.hMm.toFixed(2)}mm`;

            return (
              <div
                style={{
                  position: 'absolute',
                  left: x + (pxX + pxW / 2) * scale,
                  top: y + Math.max(0, (pxY - 18) * scale),
                  transform: 'translateX(-50%)',
                  background: 'rgba(0,0,0,0.75)',
                  color: '#fff',
                  fontSize: 12,
                  padding: '2px 6px',
                  borderRadius: 4,
                  zIndex: 60,
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {text}
              </div>
            );
          })()}

          <div
            className="designZoomStage"
            style={{
              position: "absolute",
              left: RULER_LEFT + x,
              top: RULER_TOP + y,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            <div
              id="amzStageBounds"
              style={{
                position: "relative",
                width: stageSizePx.width,
                height: stageSizePx.height,
              }}
            >
              {showGrid && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 1,
                    pointerEvents: 'none',
                    backgroundImage: gridBackground,
                    backgroundSize: `${Math.max(1, gridMm * MM_TO_PX)}px ${Math.max(1, gridMm * MM_TO_PX)}px`,
                    backgroundRepeat: 'repeat',
                  }}
                />
              )}
              <div
                style={{
                  position: "absolute",
                  left: designBBoxPx.minX,
                  top: designBBoxPx.minY,
                  width: designBBoxPx.width,
                  height: designBBoxPx.height,
                  pointerEvents: isShiftDown ? "auto" : "none",
                  cursor: isShiftDown ? "move" : "default",
                  zIndex: 5,
                  background: "transparent",
                }}
                onMouseDown={(e) => {
                  if (!isShiftDown) return;
                  e.preventDefault();
                  e.stopPropagation();
                  setIsGroupDragging(true);
                  groupDragStartRef.current = {
                    mouseX: e.clientX,
                    mouseY: e.clientY,
                    x,
                    y,
                  };
                }}
              />

              <div
                className="labelprint"
                ref={labelprintref}
                style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
              >
                {/* 
                   Create a preview list that merges componentList with any active drag/resize override 
                   This uses useMemo inside the render or just calculation here to prevent lag?
                   Actually simpler: renderElement takes componentList. 
                   We want to override the ONE component being dragged.
                */}
                <div
                  style={
                    isPrinting
                      ? {
                          transform: `translate(${printOffsetMm.x * MM_TO_PX}px, ${printOffsetMm.y * MM_TO_PX}px)`,
                          transformOrigin: 'top left',
                        }
                      : undefined
                  }
                >
                  {(() => {
                    let renderList = componentList;
                    // If dragging, we want to visually update the content too, BUT without updating componentList state to avoid heavy re-render.
                    // We can override the specific item in a temp array.
                    if (activeHandleIdx !== null && activeHandleBox !== null) {
                      const idx = activeHandleIdx;

                      // Derived from activeHandleBox (screen px) back to MM
                      // This calculation must match exactly what onDrag does but we do it here for render
                      const unscaledX = (activeHandleBox.x - (x + RULER_LEFT)) / scale;
                      const unscaledY = (activeHandleBox.y - (y + RULER_TOP)) / scale;
                      const mmX = unscaledX * PX_TO_MM;
                      const mmY = unscaledY * PX_TO_MM;

                      // For resize
                      const w = activeHandleBox.w / scale;
                      const h = activeHandleBox.h / scale;
                      const mmW = w * PX_TO_MM;
                      const mmH = h * PX_TO_MM;

                      renderList = componentList.map((p, i) => {
                        if (i !== idx) return p;
                        return {
                          ...p,
                          POS_X: mmX,
                          POS_Y: mmY,
                          SIZE_W: mmW,
                          SIZE_H: mmH,
                        };
                      });
                    }
                    return renderElement(renderList);
                  })()}
                </div>
              </div>
            </div>
          </div>

          <div style={{ position: 'absolute', inset: 0, zIndex: 40 }}>
            {renderHandles()}
            {renderRotatedResizeHandles()}
            {(() => {
              const idx = currentComponent;
              if (idx < 0) return null;
              const c = componentList[idx];
              if (!c) return null;
              const pxX = (c.POS_X ?? 0) * MM_TO_PX;
              const pxY = (c.POS_Y ?? 0) * MM_TO_PX;
              const pxW = Math.max(1, (c.SIZE_W ?? 1) * MM_TO_PX);
              const pxH = Math.max(1, (c.SIZE_H ?? 1) * MM_TO_PX);
              const screenX = RULER_LEFT + x + pxX * scale;
              const screenY = RULER_TOP + y + pxY * scale;
              const screenW = pxW * scale;
              const screenH = pxH * scale;

              const rotDeg = (c.ROTATE ?? 0);
              const rotRad = (rotDeg * Math.PI) / 180;
              const cos = Math.cos(rotRad);
              const sin = Math.sin(rotRad);

              // Component rotates around top-left (screenX, screenY)
              const trX = screenX + screenW * cos;
              const trY = screenY + screenW * sin;

              // Offset the handle slightly outward relative to the rotated top edge
              const offLocalX = 10;
              const offLocalY = -10;
              const handleX = trX + offLocalX * cos - offLocalY * sin;
              const handleY = trY + offLocalX * sin + offLocalY * cos;

              // Use rotated center for rotation gesture calculations
              const centerX = screenX + (screenW / 2) * cos - (screenH / 2) * sin;
              const centerY = screenY + (screenW / 2) * sin + (screenH / 2) * cos;
              return (
                <div
                  style={{ position: 'absolute', left: handleX, top: handleY, width: 16, height: 16, borderRadius: 16, background: '#fff', border: '2px solid #ff9800', zIndex: 300, cursor: 'grab' }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI;
                    setRotateDrag({ idx, centerX, centerY, startMouseAngle: startAngle, startRotate: rotDeg });
                  }}
                  title="Rotate"
                />
              );
            })()}
          </div>
        </div>
        <div style={{ flex: 5, minHeight: 0, overflow: 'hidden' }}>
          <AGTable
            ref={agTableRef}
            suppressRowClickSelection={false}
            showFilter={true}
            toolbar={agToolbar}
            columns={agColumns}
            data={componentList}
            getRowStyle={agGetRowStyle}
            onCellEditingStopped={onAgCellEditingStopped}
            onCellClick={onAgCellClick}
            onSelectionChange={() => {}}
            onRowDragEnd={onAgRowDragEnd}
          />
        </div>
        </div>
      </div>
      <div className="historyPanel" style={{ width: '200px', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #ccc', background: '#f5f5f5', height: '100%', overflow: 'hidden' }}>
          <div style={{ padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #ddd', background: '#fff' }}>
            History
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <List dense>
              {historyPast.map((item, index) => (
                <ListItem key={index} disablePadding secondaryAction={
                  <span style={{ fontSize: '0.6rem', color: '#999' }}>{index + 1}</span>
                }>
                  <ListItemButton onClick={() => jumpToHistory(index)} dense sx={{ py: 0 }}>
                    <ListItemText 
                      primary={`Action ${index + 1}`} 
                      secondary={`${item.length} components`} 
                      primaryTypographyProps={{ fontSize: '0.75rem' }}
                      secondaryTypographyProps={{ fontSize: '0.65rem' }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
              {historyPast.length === 0 && (
                <div style={{ padding: '10px', fontSize: '0.8rem', color: '#888', textAlign: 'center' }}>
                  No history yet
                </div>
              )}
            </List>
          </div>
      </div>
    </div>)
  );
};
export default DESIGN_AMAZON;

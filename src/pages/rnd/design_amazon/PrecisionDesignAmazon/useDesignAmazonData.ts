import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import { useReactToPrint } from "react-to-print";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { UserData } from "../../../../api/GlobalInterface";
import { CODE_INFO, COMPONENT_DATA } from "../../interfaces/rndInterface";
import { generalQuery, getAuditMode, getCtrCd, uploadQuery } from "../../../../api/Api";
import { checkBP } from "../../../../api/services/permissionService";
import { DesignAmazonDataHook, PrintOffset } from "./designAmazonTypes";

const PRINT_OFFSET_LS_KEY = "amz_print_offset_mm_v1";

const INITIAL_COMPONENTS: COMPONENT_DATA[] = [
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
    GIATRI: "https://cmsvina4285.com/images/logoAMAZON.png",
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
];

export const useDesignAmazonData = (): DesignAmazonDataHook => {
  const protocol = typeof window !== "undefined" && window.location.protocol.startsWith("https") ? "https" : "http";
  const userData: UserData | undefined = useSelector((state: RootState) => state.totalSlice.userData);

  const labelprintref = useRef<HTMLDivElement | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printOffsetMm, setPrintOffsetMm] = useState<PrintOffset>({ x: 0, y: 0 });

  const [rows, setRows] = useState<CODE_INFO[]>([]);
  const [isLoading, setisLoading] = useState(false);
  const [codeCMS, setCodeCMS] = useState("");
  const [codeinfoCMS, setcodeinfoCMS] = useState<string>("");
  const [codeinfoKD, setcodeinfoKD] = useState<string>("");
  const [codedatatablefilter, setCodeDataTableFilter] = useState<CODE_INFO[]>([]);

  const [componentList, setComponentList] = useState<COMPONENT_DATA[]>(() => {
    return INITIAL_COMPONENTS.map((item) =>
      item.PHANLOAI_DT === "IMAGE" && item.GIATRI?.includes("cmsvina4285.com")
        ? { ...item, GIATRI: `${protocol}://cmsvina4285.com/images/logoAMAZON.png` }
        : item
    );
  });

  const latestComponentListRef = useRef<COMPONENT_DATA[]>(componentList);
  useEffect(() => {
    latestComponentListRef.current = componentList;
  }, [componentList]);

  const [currentComponent, setCurrentComponent] = useState(0);
  const [newComponent, setNewComponent] = useState("TEXT");
  const [historyPast, setHistoryPast] = useState<COMPONENT_DATA[][]>([]);
  const [historyFuture, setHistoryFuture] = useState<COMPONENT_DATA[][]>([]);

  const cloneList = (list: COMPONENT_DATA[]) => list.map((e) => ({ ...e }));

  const commitComponentList = useCallback((next: COMPONENT_DATA[]) => {
    const current = latestComponentListRef.current;
    setHistoryPast((p) => [...p, cloneList(current)]);
    setHistoryFuture([]);
    setComponentList(next);
  }, []);

  const undo = useCallback(() => {
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

  const redo = useCallback(() => {
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

  const jumpToHistory = useCallback((index: number) => {
    setHistoryPast((past) => {
      if (index < 0 || index >= past.length) return past;
      const targetState = past[index];
      const pastForFuture = past.slice(index + 1);
      const newPast = past.slice(0, index);
      const current = latestComponentListRef.current;
      const itemsToFuture = [...pastForFuture, cloneList(current)];
      setHistoryFuture((prevFuture) => [...itemsToFuture, ...prevFuture]);
      setComponentList(cloneList(targetState));
      return newPast;
    });
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

  const setAndPersistPrintOffset = useCallback((next: PrintOffset) => {
    setPrintOffsetMm(next);
    try {
      localStorage.setItem(PRINT_OFFSET_LS_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  const handlePrint = useReactToPrint({
    content: () => labelprintref.current,
    onBeforeGetContent: async () => {
      setIsPrinting(true);
    },
    onAfterPrint: () => {
      setIsPrinting(false);
    },
  });

  const handleListPrinters = async () => {
    Swal.fire("In USB", "Hỗ trợ kết nối máy in nhãn USB qua WebUSB API", "info");
  };

  const getNextComponentId = useCallback(() => {
    const cur = latestComponentListRef.current;
    let maxId = -1;
    for (let i = 0; i < cur.length; i++) {
      const v = Number((cur[i] as any)?.id);
      if (Number.isFinite(v) && v > maxId) maxId = v;
    }
    return maxId + 1;
  }, []);

  const handleGETBOMAMAZON = useCallback((G_CODE: string) => {
    setisLoading(true);
    generalQuery("getAMAZON_DESIGN", { G_CODE })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: COMPONENT_DATA[] = response.data.data.map(
            (element: COMPONENT_DATA, index: number) => ({
              ...element,
              id: index,
            })
          );
          setComponentList(loadeddata);
          setisLoading(false);
        } else {
          setComponentList([]);
          setisLoading(false);
        }
      })
      .catch((error) => {
        console.error(error);
        setisLoading(false);
      });
  }, []);

  const handleCODESelectionforUpdate = useCallback(
    (selectedRows: CODE_INFO[]) => {
      if (selectedRows.length > 0) {
        setCodeDataTableFilter(selectedRows);
        setcodeinfoCMS(selectedRows[0].G_CODE);
        setcodeinfoKD(selectedRows[0].G_NAME);
        handleGETBOMAMAZON(selectedRows[0].G_CODE);
      } else {
        setCodeDataTableFilter([]);
      }
    },
    [handleGETBOMAMAZON]
  );

  const handleCODEINFO = useCallback(() => {
    setisLoading(true);
    generalQuery("codeinfo", { G_NAME: codeCMS })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: CODE_INFO[] = response.data.data.map((element: CODE_INFO, index: number) => ({
            ...element,
            G_NAME:
              getAuditMode() === 0
                ? element?.G_NAME
                : element?.G_NAME?.search("CNDB") === -1
                ? element?.G_NAME
                : "TEM_NOI_BO",
            G_NAME_KD:
              getAuditMode() === 0
                ? element?.G_NAME_KD
                : element?.G_NAME?.search("CNDB") === -1
                ? element?.G_NAME_KD
                : "TEM_NOI_BO",
            id: index,
          }));
          setRows(loadeddata);
          setisLoading(false);
          Swal.fire("Thông báo", `Đã tải ${response.data.data.length} dòng mã hàng`, "success");
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
          setisLoading(false);
        }
      })
      .catch((error) => {
        console.error(error);
        setisLoading(false);
      });
  }, [codeCMS]);

  const handleSearchCodeKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleCODEINFO();
      }
    },
    [handleCODEINFO]
  );

  const pickAndUploadImage = useCallback(async (): Promise<string | null> => {
    const file: File | null = await new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/png,image/jpeg";
      input.onchange = () => {
        resolve((input.files && input.files.length > 0 ? input.files[0] : null) as File | null);
      };
      input.oncancel = () => resolve(null);
      input.click();
    });

    if (!file) return null;

    const ext = (() => {
      const n = (file.name || "").toLowerCase();
      if (n.endsWith(".png")) return "png";
      if (n.endsWith(".jpg")) return "jpg";
      if (n.endsWith(".jpeg")) return "jpeg";
      return "png";
    })();

    const unique = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const filename = `${getCtrCd()}_${unique}.${ext}`;

    try {
      const response: any = await uploadQuery(file, filename, "images");
      if (response?.data?.tk_status === "NG") {
        Swal.fire("Thông báo", "Upload file thất bại: " + response?.data?.message, "error");
        return null;
      }
      return `/images/${filename}`;
    } catch (err: any) {
      console.error(err);
      Swal.fire("Thông báo", "Upload file thất bại", "error");
      return null;
    }
  }, []);

  const addComponent = useCallback(async () => {
    if (codedatatablefilter.length > 0) {
      const cur = latestComponentListRef.current;
      let max_dt_no = 0;
      for (let i = 0; i < cur.length; i++) {
        if (max_dt_no < cur[i].DOITUONG_NO) max_dt_no = cur[i].DOITUONG_NO;
      }

      let giatri = "1234";
      if (newComponent === "IMAGE") {
        const uploadedUrl = await pickAndUploadImage();
        if (!uploadedUrl) return;
        giatri = uploadedUrl;
      }

      const temp_compList: COMPONENT_DATA = {
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
      commitComponentList([...cur, temp_compList]);
      setCurrentComponent(cur.length);
    } else {
      Swal.fire("Thông báo", "Chọn mã hàng trước khi thêm đối tượng", "warning");
    }
  }, [codedatatablefilter, newComponent, getNextComponentId, pickAndUploadImage, commitComponentList]);

  const createComponentAt = useCallback(
    async (type: string, mmX: number, mmY: number) => {
      if (codedatatablefilter.length <= 0) {
        Swal.fire("Thông báo", "Chọn mã hàng trước khi tạo đối tượng", "warning");
        return;
      }

      const cur = latestComponentListRef.current;
      let max_dt_no = 0;
      for (let i = 0; i < cur.length; i++) {
        if (max_dt_no < cur[i].DOITUONG_NO) max_dt_no = cur[i].DOITUONG_NO;
      }

      const defaultSize = (() => {
        if (type === "TEXT") return { w: 10, h: 3 };
        if (type === "IMAGE") return { w: 10, h: 10 };
        if (type === "1D BARCODE") return { w: 25, h: 8 };
        if (type === "2D MATRIX") return { w: 10, h: 10 };
        if (type === "QRCODE") return { w: 10, h: 10 };
        if (type === "CONTAINER") return { w: 30, h: 20 };
        return { w: 10, h: 10 };
      })();

      let giatri = type === "TEXT" ? "TEXT" : "sample text";
      if (type === "IMAGE") {
        const uploadedUrl = await pickAndUploadImage();
        if (!uploadedUrl) return;
        giatri = uploadedUrl;
      }

      const temp_compList: COMPONENT_DATA = {
        id: getNextComponentId(),
        G_CODE_MAU: codedatatablefilter[0].G_CODE,
        DOITUONG_NO: max_dt_no + 1,
        DOITUONG_NAME: type,
        PHANLOAI_DT: type,
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

      commitComponentList([...cur, temp_compList]);
      setCurrentComponent(cur.length);
    },
    [codedatatablefilter, getNextComponentId, pickAndUploadImage, commitComponentList]
  );

  const updateComponentAt = useCallback(
    (index: number, patch: Partial<COMPONENT_DATA>, commit = false) => {
      const cur = latestComponentListRef.current;
      const next = cur.map((p, i) => (i === index ? { ...p, ...patch } : p));
      if (commit) commitComponentList(next);
      else {
        setComponentList(next);
        latestComponentListRef.current = next;
      }
    },
    [commitComponentList]
  );

  const deleteSelectedComponent = useCallback(
    (idx?: number) => {
      const cur = latestComponentListRef.current;
      const targetIdx = idx ?? currentComponent;
      if (targetIdx < 0 || targetIdx >= cur.length) return;
      const old: COMPONENT_DATA[] = cur.filter((_: COMPONENT_DATA, i: number) => i !== targetIdx);
      commitComponentList(old);
      if (old.length === 0) {
        setCurrentComponent(-1);
      } else {
        setCurrentComponent((prev) => Math.max(0, Math.min(prev, old.length - 1)));
      }
    },
    [commitComponentList, currentComponent]
  );

  const checkDesignExist = async (G_CODE_MAU: string): Promise<boolean> => {
    let isDesignExist = false;
    try {
      const response = await generalQuery("checkDesignExistAMZ", { G_CODE: G_CODE_MAU });
      if (response.data.tk_status !== "NG") isDesignExist = true;
    } catch (error) {
      console.error(error);
    }
    return isDesignExist;
  };

  const deleteAMZDesign = async (G_CODE_MAU: string) => {
    try {
      await generalQuery("deleteAMZDesign", { G_CODE: G_CODE_MAU });
    } catch (error) {
      console.error(error);
    }
  };

  const saveDesignAmazon = useCallback(async () => {
    const cur = latestComponentListRef.current;
    if (codedatatablefilter.length > 0) {
      const code = codedatatablefilter[0].G_CODE;
      const checkExist = await checkDesignExist(code);
      if (checkExist) {
        await deleteAMZDesign(code);
      }

      if (cur.length > 0) {
        let err_code = "";
        for (let i = 0; i < cur.length; i++) {
          try {
            const response = await generalQuery("insertAMZDesign", cur[i]);
            if (response.data.tk_status === "NG") {
              err_code += "Lỗi: " + response.data.message + "| ";
            }
          } catch (error) {
            console.error(error);
          }
        }
        if (err_code === "") {
          Swal.fire("Thông báo", "Lưu THIẾT KẾ TEM AMAZON thành công", "success");
          setHistoryPast([]);
          setHistoryFuture([]);
        } else {
          Swal.fire("Thông báo", "Thất bại: " + err_code, "error");
        }
      } else {
        Swal.fire("Thông báo", "Tạo ít nhất 1 đối tượng tem", "error");
      }
    } else {
      Swal.fire("Thông báo", "Chọn mã hàng để lưu", "error");
    }
  }, [codedatatablefilter]);

  const confirmSaveDESIGN_AMAZON = useCallback(() => {
    Swal.fire({
      title: "Chắc chắn muốn lưu DESIGN AMAZON?",
      text: "Sẽ ghi đè tất cả design cũ bằng design bạn vừa tạo!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Đồng ý Lưu!",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành Lưu DESIGN", "Đang ghi dữ liệu vào hệ thống...", "info");
        checkBP(userData, ["RND"], ["ALL"], ["ALL"], saveDesignAmazon);
      }
    });
  }, [userData, saveDesignAmazon]);

  const selectedComponent = useMemo(() => {
    return componentList[currentComponent];
  }, [componentList, currentComponent]);

  return {
    componentList,
    setComponentList,
    latestComponentListRef,
    currentComponent,
    setCurrentComponent,
    selectedComponent,
    historyPast,
    historyFuture,
    commitComponentList,
    undo,
    redo,
    jumpToHistory,
    deleteSelectedComponent,
    updateComponentAt,
    addComponent,
    createComponentAt,
    pickAndUploadImage,
    rows,
    codeCMS,
    setCodeCMS,
    codeinfoCMS,
    codeinfoKD,
    codedatatablefilter,
    handleCODEINFO,
    handleSearchCodeKeyDown,
    handleCODESelectionforUpdate,
    saveDesignAmazon,
    confirmSaveDESIGN_AMAZON,
    handlePrint,
    handleListPrinters,
    printOffsetMm,
    setAndPersistPrintOffset,
    labelprintref,
    isPrinting,
    isLoading,
    newComponent,
    setNewComponent,
  };
};

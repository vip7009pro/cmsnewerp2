import React, { useEffect, useMemo, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import "./DESIGN_AMAZON.scss";
import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { FcDeleteRow } from "react-icons/fc";
import { TbComponents } from "react-icons/tb";
import Swal from "sweetalert2";
import { GrAdd } from "react-icons/gr";
import { generalQuery, getAuditMode } from "../../../api/Api";
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
  const handlePrint = useReactToPrint({
    content: () => labelprintref.current,
  });
  const [showhidecodelist, setShowHideCodeList] = useState(true);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [isCtrlDown, setIsCtrlDown] = useState(false);
  const [isShiftDown, setIsShiftDown] = useState(false);
  const [scale, setScale] = useState(1);

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
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);
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
  const addComponent = () => {
    if (codedatatablefilter.length > 0) {
      let max_dt_no: number = 0;
      for (let i = 0; i < componentList.length; i++) {
        if (max_dt_no < componentList[i].DOITUONG_NO)
          max_dt_no = componentList[i].DOITUONG_NO;
      }
      let temp_compList: COMPONENT_DATA = {
        G_CODE_MAU: codedatatablefilter[0].G_CODE,
        DOITUONG_NO: max_dt_no + 1,
        DOITUONG_NAME: newComponent,
        PHANLOAI_DT: newComponent,
        DOITUONG_STT: "A" + (max_dt_no + 1),
        CAVITY_PRINT: 2,
        GIATRI: "1234",
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

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "Control") setIsCtrlDown(true);
      if (e.key === "Shift") setIsShiftDown(true);

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
    const up = (e: KeyboardEvent) => {
      if (e.key === "Control") setIsCtrlDown(false);
      if (e.key === "Shift") setIsShiftDown(false);
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [undo, redo]);

  useEffect(() => {
    const isArrow = (k: string) => k === 'ArrowUp' || k === 'ArrowDown' || k === 'ArrowLeft' || k === 'ArrowRight';

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

    const onKeyDown = (e: KeyboardEvent) => {
      if (!isArrow(e.key)) return;
      if (isTypingTarget(e.target)) return;
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
    return () => {
      window.removeEventListener('keydown', onKeyDown, true as any);
      window.removeEventListener('keyup', onKeyUp, true as any);
      stopNudge();
    };
  }, [currentComponent, commitComponentList]);

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
        return Math.max(0.2, Math.min(5, next));
      });
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel as any);
    };
  }, []);

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

      const hitW = Math.max(pxW, 16);
      const hitH = Math.max(pxH, 16);

      const screenX = x + pxX * scale;
      const screenY = y + pxY * scale;
      const screenW = hitW * scale;
      const screenH = hitH * scale;

      const isActive = activeHandleIdx === idx && activeHandleBox != null;
      // RESTORE DRAG using activeHandleBox to act as local state for immediate feedback
      const usedX = isActive ? activeHandleBox!.x : screenX;
      const usedY = isActive ? activeHandleBox!.y : screenY;
      
      const usedW = isActive ? activeHandleBox!.w : screenW;
      const usedH = isActive ? activeHandleBox!.h : screenH;

      const selected = idx === currentComponent;

      return (
        <Rnd
          key={`h_${idx}`}
          size={{ width: usedW, height: usedH }}
          position={{ x: usedX, y: usedY }}
          scale={1}
          enableResizing={isCtrlDown && selected}
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
               const cx = (c.POS_X ?? 0) * MM_TO_PX * scale + x;
               const cy = (c.POS_Y ?? 0) * MM_TO_PX * scale + y;
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
                 
                 const otherScreenX = x + otherPxX * scale;
                 const otherScreenY = y + otherPxY * scale;
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
            const unscaledX = (newX - x) / scale;
            const unscaledY = (newY - y) / scale;
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

            const unscaledX = (finalX - x) / scale;
            const unscaledY = (finalY - y) / scale;
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
                 
                 const otherScreenX = x + otherPxX * scale;
                 const otherScreenY = y + otherPxY * scale;
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
            const unscaledX = (newX - x) / scale;
            const unscaledY = (newY - y) / scale;
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
            const unscaledX = (finalX - x) / scale;
            const unscaledY = (finalY - y) / scale;
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
            border: selected ? '2px solid #1976d2' : '1px dashed rgba(0,0,0,0.35)',
            background: selected ? 'rgba(25, 118, 210, 0.05)' : 'transparent',
            boxSizing: 'border-box',
            zIndex: selected ? 200 : 10,
            pointerEvents: 'auto', // Allow clicking even if not selected, so we can capture click to cycle
          }}
        />
      );
    });
  };

  return (
    (<div className="design_window">
      <div className="design_control" id="dsg_ctrl">
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
        <div className="componentSide">
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
                  onClick={() => {
                    addComponent();
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
                      onDragEnter={(e) => {
                        setEndIndex(index);
                      }}
                      onDragEnd={(e) => {
                        console.log(startIndex + "|" + endIndex);
                        const next = componentList.map((x) => ({ ...x }));
                        const tmp = next[startIndex];
                        next[startIndex] = next[endIndex];
                        next[endIndex] = tmp;
                        commitComponentList(next);
                      }}
                      /* onDragExit={(e)=> {console.log(e)}} */
                      /* onDragOver={(e)=> {console.log(e)}} */
                      onDragStart={(e) => {
                        setStartIndex(index);
                      }}
                      draggable={true}
                      key={index}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          style={{ backgroundColor: "transparent" }}
                          size="small"
                          sx={{ padding: 0.5 }}
                          onClick={() => {
                            let old: COMPONENT_DATA[] = componentList.filter(
                              (ele: COMPONENT_DATA, index1: number) => {
                                return index1 !== index;
                              },
                            );
                            commitComponentList(old);
                            setCurrentComponent((prev) =>
                              Math.max(0, Math.min(prev, old.length - 1)),
                            );
                          }}
                        >
                          <FcDeleteRow />
                        </IconButton>
                      }
                    >
                      <ListItemButton
                        role={undefined}
                        onClick={() => {
                          setCurrentComponent(index);
                        }}
                        dense
                        sx={{ py: 0, minHeight: 32 }}
                      >
                        <ListItemAvatar sx={{ minWidth: 30 }}>
                          <Avatar
                            style={{ backgroundColor: "transparent" }}
                            sx={{ width: 20, height: 20 }}
                          >
                            <TbComponents size={16} />
                          </Avatar>
                        </ListItemAvatar>
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
      </div>
      <div className="design_panel">
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
          X:
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
          (mm)
        </div>
        <div
          id="10a"
          className="designAmazon"
          ref={designRef}
          style={{ position: "relative", flex: 1, width: '100%', height: '100%', overflow: 'hidden' }}
          onMouseDown={(e) => {
            if (e.ctrlKey && e.target === e.currentTarget) {
              setCurrentComponent(-1);
            }
          }}
        >
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
              left: x,
              top: y,
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
                {(() => {
                   let renderList = componentList;
                   // If dragging, we want to visually update the content too, BUT without updating componentList state to avoid heavy re-render.
                   // We can override the specific item in a temp array.
                   if (activeHandleIdx !== null && activeHandleBox !== null) {
                       const idx = activeHandleIdx;
                       
                       // Derived from activeHandleBox (screen px) back to MM
                       // This calculation must match exactly what onDrag does but we do it here for render
                       const unscaledX = (activeHandleBox.x - x) / scale;
                       const unscaledY = (activeHandleBox.y - y) / scale;
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
                             POS_X: mmX, POS_Y: mmY,
                             SIZE_W: mmW, SIZE_H: mmH 
                          };
                       });
                   }
                   return renderElement(renderList);
                })()}
              </div>
            </div>
          </div>

          <div style={{ position: 'absolute', inset: 0, zIndex: 40 }}>
            {renderHandles()}
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

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { UserData } from "../../../../api/GlobalInterface";
import { generalQuery, uploadQuery } from "../../../../api/Api";
import { SaveExcel } from "../../../../api/services/excelService";
import { ERROR_TABLE, PQC1_DATA, PQC3_DATA } from "../../interfaces/qcInterface";

export type PQC3ViewMode = "DEFECT" | "SETTING" | "DUAL";

export interface PQC3KpiStats {
  totalDefects: number;
  totalDefectQty: number;
  totalInspectQty: number;
  defectRate: string;
  totalPqc1Lots: number;
}

export const usePQC3Data = () => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );

  // Form input states
  const [factory, setFactory] = useState<string>(
    userData?.FACTORY_CODE === 1 ? "NM1" : "NM2"
  );
  const [process_lot_no, setProcessLotNo] = useState<string>("");
  const [planId, setPlanId] = useState<string>("");
  const [g_name, setGName] = useState<string>("");
  const [g_code, setGCode] = useState<string>("");
  const [prodrequestno, setProdRequestNo] = useState<string>("");
  const [prodreqdate, setProdReqDate] = useState<string>("");
  const [lineqc_empl, setLineqc_empl] = useState<string>("");
  const [empl_name, setEmplName] = useState<string>("");
  const [empl_name2, setEmplName2] = useState<string>("");
  const [pqc1Id, setPQC1ID] = useState<number>(0);
  const [pqc3Id, setPQC3ID] = useState<number>(0);
  const [err_code, setErr_Code] = useState<string>("ERR1");
  const [error_tb, setError_TB] = useState<ERROR_TABLE[]>([]);
  const [defect_phenomenon, setDefectPhenomenon] = useState<string>("");
  const [occurr_time, setOccurrTime] = useState<string>(
    moment().format("YYYY-MM-DD HH:mm:ss")
  );
  const [remark, setReMark] = useState<string>("");
  const [sample_qty, setSample_Qty] = useState<number>(0);
  const [defect_qty, setDefect_Qty] = useState<number>(0);
  const [file, setFile] = useState<any>(null);

  // Grid & Data states
  const [pqc1datatable, setPqc1DataTable] = useState<Array<PQC1_DATA>>([]);
  const [pqc3datatable, setPqc3DataTable] = useState<Array<PQC3_DATA>>([]);
  const [selectedPqc1Row, setSelectedPqc1Row] = useState<PQC1_DATA | null>(null);
  const [selectedPqc3Row, setSelectedPqc3Row] = useState<PQC3_DATA | null>(null);

  // View & UI controls
  const [activeView, setActiveView] = useState<PQC3ViewMode>("DEFECT");
  const [showhideinput, setShowHideInput] = useState<boolean>(true);
  const [quickFilter, setQuickFilter] = useState<string>("");
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<{
    isOpen: boolean;
    url: string;
    title: string;
  }>({
    isOpen: false,
    url: "",
    title: "",
  });

  // Enter traversal ref array:
  // [0: LotSX, 1: LineQC, 2: MaLoi, 3: HienTuong, 4: ThoiGian, 5: Remark, 6: File, 7: SampleQty, 8: DefectQty, 9: BtnSave]
  const refArray = [
    useRef<any>(null),
    useRef<any>(null),
    useRef<any>(null),
    useRef<any>(null),
    useRef<any>(null),
    useRef<any>(null),
    useRef<any>(null),
    useRef<any>(null),
    useRef<any>(null),
    useRef<any>(null),
    useRef<any>(null),
  ];

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>,
    index: number
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextIndex = (index + 1) % refArray.length;
      refArray[nextIndex]?.current?.focus();
    }
  };

  // 1. Tra cứu danh mục mã lỗi từ backend
  const loadErrorTable = useCallback(() => {
    generalQuery("loadErrTable", {})
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          setError_TB(response.data.data || []);
        } else {
          setError_TB([]);
        }
      })
      .catch((error) => {
        console.error("loadErrorTable error:", error);
        setError_TB([]);
      });
  }, []);

  // 2. Tra cứu dữ liệu PQC1 liên quan theo G_CODE
  const traPQC1Data = useCallback(
    (gCodeParam?: string) => {
      const targetGCode = gCodeParam ?? g_code;
      generalQuery("trapqc1data", {
        ALLTIME: true,
        FROM_DATE: moment().add(-2, "day").format("YYYY-MM-DD"),
        TO_DATE: moment().format("YYYY-MM-DD"),
        CUST_NAME: "",
        PROCESS_LOT_NO: "",
        G_CODE: targetGCode,
        G_NAME: "",
        PROD_TYPE: "",
        EMPL_NAME: "",
        PROD_REQUEST_NO: "",
        ID: "",
        FACTORY: userData?.FACTORY_CODE === 1 ? "NM1" : "NM2",
      })
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            const loadeddata: PQC1_DATA[] = (response.data.data || []).map(
              (element: PQC1_DATA, index: number) => ({
                ...element,
                INS_DATE: moment
                  .utc(element.INS_DATE)
                  .format("YYYY-MM-DD HH:mm:ss"),
                UPD_DATE: moment
                  .utc(element.UPD_DATE)
                  .format("YYYY-MM-DD HH:mm:ss"),
                SETTING_OK_TIME: moment
                  .utc(element.SETTING_OK_TIME)
                  .format("YYYY-MM-DD HH:mm:ss"),
                id: index,
              })
            );
            setPqc1DataTable(loadeddata);
          } else {
            setPqc1DataTable([]);
          }
        })
        .catch((error) => {
          console.error("traPQC1Data error:", error);
          setPqc1DataTable([]);
        });
    },
    [g_code, userData?.FACTORY_CODE]
  );

  // 3. Tra cứu dữ liệu sự cố lỗi PQC3
  const handleTraPQC3Data = useCallback(() => {
    setIsLoading(true);
    generalQuery("trapqc3data", {
      ALLTIME: true,
      FROM_DATE: moment().add(-2, "day").format("YYYY-MM-DD"),
      TO_DATE: moment().format("YYYY-MM-DD"),
      CUST_NAME: "",
      PROCESS_LOT_NO: "",
      G_CODE: "",
      G_NAME: "",
      PROD_TYPE: "",
      EMPL_NAME: "",
      PROD_REQUEST_NO: "",
      ID: "",
      FACTORY: "All",
    })
      .then((response) => {
        setIsLoading(false);
        if (response.data.tk_status !== "NG") {
          const loadeddata: PQC3_DATA[] = (response.data.data || []).map(
            (element: PQC3_DATA, index: number) => ({
              ...element,
              OCCURR_TIME: moment
                .utc(element.OCCURR_TIME)
                .format("YYYY-MM-DD HH:mm:ss"),
              id: index,
            })
          );
          setPqc3DataTable(loadeddata);
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
          setPqc3DataTable([]);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("handleTraPQC3Data error:", error);
        setPqc3DataTable([]);
      });
  }, []);

  // 4. Tra cứu thông tin chỉ thị theo PLAN_ID
  const checkPlanID = useCallback(
    (targetPlanId: string) => {
      generalQuery("checkPLAN_ID", { PLAN_ID: targetPlanId })
        .then((response) => {
          if (response.data.tk_status !== "NG" && response.data.data?.[0]) {
            const item = response.data.data[0];
            setPlanId(targetPlanId);
            setGName(item.G_NAME || "");
            setProdRequestNo(item.PROD_REQUEST_NO || "");
            setProdReqDate(item.PROD_REQUEST_DATE || "");
            setGCode(item.G_CODE || "");
            traPQC1Data(item.G_CODE || "");
          } else {
            setProdRequestNo("");
            setGName("");
            setProdReqDate("");
            setGCode("");
          }
        })
        .catch((error) => {
          console.error("checkPlanID error:", error);
        });
    },
    [traPQC1Data]
  );

  // 5. Tra cứu LOT SX
  const checkProcessLotNo = useCallback(
    (lotNo: string) => {
      generalQuery("checkPROCESS_LOT_NO", { PROCESS_LOT_NO: lotNo })
        .then((response) => {
          if (response.data.tk_status !== "NG" && response.data.data?.[0]) {
            const foundPlanId = response.data.data[0].PLAN_ID;
            setPlanId(foundPlanId);
            checkPlanID(foundPlanId);
          } else {
            setPlanId("");
          }
        })
        .catch((error) => {
          console.error("checkProcessLotNo error:", error);
        });
    },
    [checkPlanID]
  );

  // 6. Tra cứu tên nhân viên theo mã thẻ
  const checkEMPL_NAME = useCallback((selection: number, EMPL_NO: string) => {
    generalQuery("checkEMPL_NO_mobile", { EMPL_NO: EMPL_NO })
      .then((response) => {
        if (response.data.tk_status !== "NG" && response.data.data?.[0]) {
          const fullName = `${response.data.data[0].MIDLAST_NAME || ""} ${
            response.data.data[0].FIRST_NAME || ""
          }`.trim();
          if (selection === 1) {
            setEmplName(fullName);
          } else {
            setEmplName2(fullName);
          }
        } else {
          if (selection === 1) setEmplName("");
          else setEmplName2("");
        }
      })
      .catch((error) => {
        console.error("checkEMPL_NAME error:", error);
        if (selection === 1) setEmplName("");
        else setEmplName2("");
      });
  }, []);

  // 7. Upload file ảnh sự cố PQC3
  const uploadFile2 = useCallback(
    async (targetPQC3ID: number) => {
      if (file !== null && file !== undefined) {
        uploadQuery(file, "PQC3_" + targetPQC3ID + ".png", "pqc")
          .then((response) => {
            if (response.data.tk_status !== "NG") {
              Swal.fire(
                "Thành công",
                `Đã cập nhật ảnh lỗi PQC3 #${targetPQC3ID}`,
                "success"
              );
              setFile(null);
              handleTraPQC3Data();
            } else {
              Swal.fire(
                "Thông báo",
                "Upload file thất bại: " + response.data.message,
                "error"
              );
            }
          })
          .catch((error) => {
            console.error("uploadFile2 error:", error);
          });
      } else {
        Swal.fire("Cảnh báo", "Vui lòng chọn file ảnh (.png, .jpg)", "error");
      }
    },
    [file, handleTraPQC3Data]
  );

  // 8. Kiểm tra tính hợp lệ dữ liệu nhập
  const checkInput = useCallback((): boolean => {
    return (
      planId.trim() !== "" &&
      lineqc_empl.trim() !== "" &&
      process_lot_no.trim() !== "" &&
      pqc1Id !== 0 &&
      file !== undefined &&
      file !== null &&
      err_code.trim() !== "" &&
      defect_phenomenon.trim() !== "" &&
      prodrequestno.trim() !== "" &&
      g_code.trim() !== ""
    );
  }, [
    planId,
    lineqc_empl,
    process_lot_no,
    pqc1Id,
    file,
    err_code,
    defect_phenomenon,
    prodrequestno,
    g_code,
  ]);

  // 9. Thêm mới dữ liệu lỗi PQC3
  const inputDataPqc3 = useCallback(() => {
    const uploadData = {
      PROCESS_LOT_NO: process_lot_no.toUpperCase(),
      LINEQC_PIC: lineqc_empl.toUpperCase(),
      OCCURR_TIME: occurr_time,
      INSPECT_QTY: sample_qty,
      DEFECT_QTY: defect_qty,
      DEFECT_PHENOMENON: defect_phenomenon,
      DEFECT_IMAGE_LINK: "Link_Web",
      REMARK: remark,
      PQC1_ID: pqc1Id,
      ERR_CODE: err_code,
      PROD_REQUEST_NO: prodrequestno,
      G_CODE: g_code,
    };

    generalQuery("insert_pqc3", uploadData)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          generalQuery("getlastestPQC3_ID", {})
            .then((resLatest) => {
              if (resLatest.data.tk_status !== "NG" && resLatest.data.data?.[0]) {
                const latestId = resLatest.data.data[0].PQC3_ID;
                setPQC3ID(latestId);
                // Upload ảnh cho PQC3_ID vừa tạo
                uploadFile2(latestId);
              } else {
                setPQC3ID(0);
                Swal.fire("Thông báo", "Đã lưu dữ liệu PQC3", "success");
                handleTraPQC3Data();
              }
            })
            .catch((error) => {
              console.error("getlastestPQC3_ID error:", error);
            });
        } else {
          Swal.fire("Cảnh báo", "Có lỗi: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.error("insert_pqc3 error:", error);
      });
  }, [
    process_lot_no,
    lineqc_empl,
    occurr_time,
    sample_qty,
    defect_qty,
    defect_phenomenon,
    remark,
    pqc1Id,
    err_code,
    prodrequestno,
    g_code,
    uploadFile2,
    handleTraPQC3Data,
  ]);

  // 10. Chọn dòng bảng PQC1 (Tự động liên kết PQC1_ID và điền thông tin chỉ thị)
  const handleSelectPqc1Row = useCallback(
    (rowData: PQC1_DATA) => {
      setSelectedPqc1Row(rowData);
      if (rowData.PQC1_ID) {
        setPQC1ID(Number(rowData.PQC1_ID) || 0);
      }
      if (rowData.PROCESS_LOT_NO && !process_lot_no) {
        setProcessLotNo(rowData.PROCESS_LOT_NO);
      }
      if (rowData.PLAN_ID && !planId) {
        setPlanId(rowData.PLAN_ID);
      }
      if (rowData.G_NAME && !g_name) {
        setGName(rowData.G_NAME);
      }
      if (rowData.PROD_REQUEST_NO && !prodrequestno) {
        setProdRequestNo(rowData.PROD_REQUEST_NO);
      }
      if (rowData.LINEQC_PIC && !lineqc_empl) {
        setLineqc_empl(rowData.LINEQC_PIC);
        checkEMPL_NAME(1, rowData.LINEQC_PIC);
      }
    },
    [process_lot_no, planId, g_name, prodrequestno, lineqc_empl, checkEMPL_NAME]
  );

  // 11. Chọn dòng bảng PQC3 (Để update ảnh hoặc xem chi tiết)
  const handleSelectPqc3Row = useCallback((rowData: PQC3_DATA) => {
    setSelectedPqc3Row(rowData);
    if (rowData.PQC3_ID) {
      setPQC3ID(Number(rowData.PQC3_ID) || 0);
    }
  }, []);

  // 12. Reset Form nhập
  const handleResetForm = useCallback(() => {
    setProcessLotNo("");
    setPlanId("");
    setGName("");
    setGCode("");
    setProdRequestNo("");
    setProdReqDate("");
    setLineqc_empl("");
    setEmplName("");
    setPQC1ID(0);
    setPQC3ID(0);
    setDefectPhenomenon("");
    setReMark("");
    setSample_Qty(0);
    setDefect_Qty(0);
    setFile(null);
    setOccurrTime(moment().format("YYYY-MM-DD HH:mm:ss"));
  }, []);

  // 13. Xuất file Excel (EX1 dữ liệu đang lọc / EX2 toàn bộ)
  const exportExcel = useCallback(
    (isFiltered: boolean) => {
      if (activeView === "SETTING") {
        if (pqc1datatable.length === 0) {
          Swal.fire("Thông báo", "Không có dữ liệu PQC1 để xuất Excel", "info");
          return;
        }
        let dataToExport = pqc1datatable;
        if (isFiltered && quickFilter.trim() !== "") {
          const q = quickFilter.toLowerCase().trim();
          dataToExport = pqc1datatable.filter((row) =>
            Object.values(row).some(
              (val) => val !== null && String(val).toLowerCase().includes(q)
            )
          );
        }
        SaveExcel(dataToExport, `PQC1_SETTING_${moment().format("YYYYMMDD_HHmmss")}`);
      } else {
        if (pqc3datatable.length === 0) {
          Swal.fire("Thông báo", "Không có dữ liệu PQC3 để xuất Excel", "info");
          return;
        }
        let dataToExport = pqc3datatable;
        if (isFiltered && quickFilter.trim() !== "") {
          const q = quickFilter.toLowerCase().trim();
          dataToExport = pqc3datatable.filter((row) =>
            Object.values(row).some(
              (val) => val !== null && String(val).toLowerCase().includes(q)
            )
          );
        }
        SaveExcel(dataToExport, `PQC3_DEFECTS_${moment().format("YYYYMMDD_HHmmss")}`);
      }
    },
    [activeView, pqc1datatable, pqc3datatable, quickFilter]
  );

  // 14. Tính toán Micro-cards KPI thống kê realtime
  const kpis: PQC3KpiStats = useMemo(() => {
    const totalDefects = pqc3datatable.length;
    let totalDefectQty = 0;
    let totalInspectQty = 0;

    for (let i = 0; i < pqc3datatable.length; i++) {
      const item = pqc3datatable[i];
      totalDefectQty += Number(item.DEFECT_QTY) || 0;
      totalInspectQty += Number(item.INSPECT_QTY) || 0;
    }

    const defectRate =
      totalInspectQty > 0
        ? ((totalDefectQty / totalInspectQty) * 100).toFixed(2) + "%"
        : "0.00%";

    return {
      totalDefects,
      totalDefectQty,
      totalInspectQty,
      defectRate,
      totalPqc1Lots: pqc1datatable.length,
    };
  }, [pqc3datatable, pqc1datatable]);

  // Nạp dữ liệu ban đầu
  useEffect(() => {
    loadErrorTable();
    handleTraPQC3Data();
  }, [loadErrorTable, handleTraPQC3Data]);

  return {
    userData,
    factory,
    setFactory,
    process_lot_no,
    setProcessLotNo,
    planId,
    setPlanId,
    g_name,
    g_code,
    prodrequestno,
    prodreqdate,
    lineqc_empl,
    setLineqc_empl,
    empl_name,
    empl_name2,
    pqc1Id,
    setPQC1ID,
    pqc3Id,
    setPQC3ID,
    err_code,
    setErr_Code,
    error_tb,
    defect_phenomenon,
    setDefectPhenomenon,
    occurr_time,
    setOccurrTime,
    remark,
    setReMark,
    sample_qty,
    setSample_Qty,
    defect_qty,
    setDefect_Qty,
    file,
    setFile,
    pqc1datatable,
    pqc3datatable,
    selectedPqc1Row,
    selectedPqc3Row,
    activeView,
    setActiveView,
    showhideinput,
    setShowHideInput,
    quickFilter,
    setQuickFilter,
    isFullScreen,
    setIsFullScreen,
    isLoading,
    previewImage,
    setPreviewImage,
    refArray,
    handleKeyDown,
    checkPlanID,
    checkProcessLotNo,
    checkEMPL_NAME,
    uploadFile2,
    checkInput,
    inputDataPqc3,
    handleTraPQC3Data,
    traPQC1Data,
    handleSelectPqc1Row,
    handleSelectPqc3Row,
    handleResetForm,
    exportExcel,
    kpis,
  };
};

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { UserData } from "../../../../api/GlobalInterface";
import { generalQuery } from "../../../../api/Api";
import { PQC1_DATA } from "../../interfaces/qcInterface";
import { SX_DATA } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";
import { SaveExcel } from "../../../../api/services/excelService";

export interface PQC1_ITEM extends PQC1_DATA {
  PQC3_ID?: string;
  OCCURR_TIME?: string;
  INSPECT_QTY?: number;
  DEFECT_QTY?: number;
  DEFECT_RATE?: number;
  DEFECT_PHENOMENON?: string;
  IMG_1?: string;
  IMG_2?: string;
  IMG_3?: string;
  [key: string]: any;
}

export const usePQC1Data = () => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );

  // Form input state
  const [factory, setFactory] = useState<string>(
    userData?.FACTORY_CODE === 1 ? "NM1" : "NM2"
  );
  const [planId, setPlanId] = useState<string>("");
  const [lineqc_empl, setLineqc_empl] = useState<string>("");
  const [prod_leader_empl, setprod_leader_empl] = useState<string>("");
  const [remark, setReMark] = useState<string>("");
  const [empl_name, setEmplName] = useState<string>("");
  const [empl_name2, setEmplName2] = useState<string>("");

  // Directive information state
  const [inputno, setInputNo] = useState<string>("");
  const [process_lot_no, setProcessLotNo] = useState<string>("");
  const [g_name, setGName] = useState<string>("");
  const [g_code, setGCode] = useState<string>("");
  const [m_name, setM_Name] = useState<string>("");
  const [m_code, setM_Code] = useState<string>("");
  const [width_cd, setWidthCD] = useState<number>(0);
  const [in_cfm_qty, setInCFMQTY] = useState<number>(0);
  const [roll_qty, setRollQty] = useState<number>(0);
  const [lieql_sx, setLieuQL_SX] = useState<any>(0);
  const [out_date, setOut_Date] = useState<string>("");
  const [prodrequestno, setProdRequestNo] = useState<string>("");
  const [prodreqdate, setProdReqDate] = useState<string>("");
  const [sx_data, setSXData] = useState<SX_DATA[]>([]);
  const [ktdtc, setKTDTC] = useState<"DKT" | "CKT">("CKT");

  // Grid & UI state
  const [pqc1datatable, setPqc1DataTable] = useState<Array<PQC1_ITEM>>([]);
  const [showhideinput, setShowHideInput] = useState<boolean>(true);
  const [quickFilter, setQuickFilter] = useState<string>("");
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const selectedRowsDataA = useRef<Array<PQC1_ITEM>>([]);

  // Enter-key traversal ref array: [0: PlanId, 1: LineQc, 2: ProdLeader, 3: Remark, 4: BtnSubmit]
  const refArray = [
    useRef<any>(null),
    useRef<any>(null),
    useRef<any>(null),
    useRef<any>(null),
    useRef<any>(null),
  ];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextIndex = (index + 1) % refArray.length;
      refArray[nextIndex]?.current?.focus();
    }
  };

  // 1. Check KTDTC (Độ tin cậy)
  const checkKTDTC = useCallback((PROCESS_LOT_NO: string) => {
    generalQuery("checkktdtc", { PROCESS_LOT_NO: PROCESS_LOT_NO })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          if (response.data.data?.[0]?.TRANGTHAI !== null && response.data.data?.[0]?.TRANGTHAI !== undefined) {
            setKTDTC("DKT");
          } else {
            setKTDTC("CKT");
          }
        } else {
          setKTDTC("CKT");
        }
      })
      .catch((error) => {
        console.error("checkKTDTC error:", error);
        setKTDTC("CKT");
      });
  }, []);

  // 2. Check Lot NVL
  const checkLotNVL = useCallback((M_LOT_NO: string) => {
    generalQuery("checkMNAMEfromLot", { M_LOT_NO: M_LOT_NO })
      .then((response) => {
        if (response.data.tk_status !== "NG" && response.data.data?.length > 0) {
          const item = response.data.data[0];
          setM_Name(`${item.M_NAME || ""} | ${item.WIDTH_CD || ""}`);
          setM_Code(item.M_CODE || "");
          setWidthCD(item.WIDTH_CD || 0);
          setInCFMQTY(item.OUT_CFM_QTY || 0);
          setRollQty(item.ROLL_QTY || 0);
          setLieuQL_SX(item.LIEUQL_SX === null ? "0" : item.LIEUQL_SX);
          setOut_Date(item.OUT_DATE || "");
        } else {
          setM_Name("");
          setM_Code("");
          setWidthCD(0);
          setRollQty(0);
          setInCFMQTY(0);
          setLieuQL_SX(0);
          setOut_Date("");
        }
      })
      .catch((error) => {
        console.error("checkLotNVL error:", error);
      });
  }, []);

  // 3. Check Plan ID P501
  const checkPlanIDP501 = useCallback((SXDATA: SX_DATA[]) => {
    if (!SXDATA || SXDATA.length === 0) return;
    generalQuery("checkPlanIdP501", { PLAN_ID: SXDATA[0].PLAN_ID })
      .then((response) => {
        if (response.data.tk_status !== "NG" && response.data.data?.length > 0) {
          const first = response.data.data[0];
          setInputNo(first.M_LOT_NO);
          checkLotNVL(first.M_LOT_NO);
          setProcessLotNo(first.PROCESS_LOT_NO);
          checkKTDTC(first.PROCESS_LOT_NO);
        } else {
          if (SXDATA[0].PROCESS_NUMBER === 0) {
            setInputNo("");
            setProcessLotNo("");
          } else {
            generalQuery("checkProcessLotNo_Prod_Req_No", {
              PROD_REQUEST_NO: SXDATA[0].PROD_REQUEST_NO,
            })
              .then((res2) => {
                if (res2.data.tk_status !== "NG" && res2.data.data?.length > 0) {
                  const item2 = res2.data.data[0];
                  setInputNo(item2.M_LOT_NO);
                  checkLotNVL(item2.M_LOT_NO);
                  setProcessLotNo(item2.PROCESS_LOT_NO);
                  checkKTDTC(item2.PROCESS_LOT_NO);
                } else {
                  setInputNo("");
                  setProcessLotNo("");
                }
              })
              .catch((err) => {
                console.error("checkProcessLotNo_Prod_Req_No error:", err);
              });
          }
        }
      })
      .catch((error) => {
        console.error("checkPlanIDP501 error:", error);
      });
  }, [checkKTDTC, checkLotNVL]);

  // 4. Check Data SX
  const checkDataSX = useCallback((PLAN_ID: string) => {
    generalQuery("loadDataSX", {
      ALLTIME: true,
      FROM_DATE: "",
      TO_DATE: "",
      PROD_REQUEST_NO: "",
      PLAN_ID: PLAN_ID,
      M_NAME: "",
      M_CODE: "",
      G_NAME: "",
      G_CODE: "",
      FACTORY: "ALL",
      PLAN_EQ: "ALL",
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loaded_data: SX_DATA[] = (response.data.data || []).map(
            (element: SX_DATA, index: number) => ({
              ...element,
              PLAN_DATE: moment.utc(element.PLAN_DATE).format("YYYY-MM-DD"),
              SETTING_START_TIME:
                element.SETTING_START_TIME === null
                  ? ""
                  : moment.utc(element.SETTING_START_TIME).format("YYYY-MM-DD HH:mm:ss"),
              MASS_START_TIME:
                element.MASS_START_TIME === null
                  ? ""
                  : moment.utc(element.MASS_START_TIME).format("YYYY-MM-DD HH:mm:ss"),
              MASS_END_TIME:
                element.MASS_END_TIME === null
                  ? ""
                  : moment.utc(element.MASS_END_TIME).format("YYYY-MM-DD HH:mm:ss"),
              SX_DATE:
                element.SX_DATE === null
                  ? ""
                  : moment.utc(element.SX_DATE).format("YYYY-MM-DD"),
              id: index,
            })
          );
          setSXData(loaded_data);
          if (loaded_data.length > 0) {
            checkPlanIDP501(loaded_data);
          }
        } else {
          Swal.fire("Thông báo", "Có lỗi: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.error("loadDataSX error:", error);
      });
  }, [checkPlanIDP501]);

  // 5. Check Plan ID
  const checkPlanID = useCallback((PLAN_ID: string) => {
    generalQuery("checkPLAN_ID", { PLAN_ID: PLAN_ID })
      .then((response) => {
        if (response.data.tk_status !== "NG" && response.data.data?.length > 0) {
          const item = response.data.data[0];
          setPlanId(PLAN_ID);
          setGName(item.G_NAME || "");
          setProdRequestNo(item.PROD_REQUEST_NO || "");
          setProdReqDate(item.PROD_REQUEST_DATE || "");
          setGCode(item.G_CODE || "");
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
  }, []);

  // 6. Check Process Lot No
  const checkProcessLotNo = useCallback((PROCESS_LOT_NO: string) => {
    generalQuery("checkPROCESS_LOT_NO", { PROCESS_LOT_NO: PROCESS_LOT_NO })
      .then((response) => {
        if (response.data.tk_status !== "NG" && response.data.data?.length > 0) {
          const pId = response.data.data[0].PLAN_ID;
          setPlanId(pId);
          checkPlanID(pId);
        } else {
          setPlanId("");
        }
      })
      .catch((error) => {
        console.error("checkProcessLotNo error:", error);
      });
  }, [checkPlanID]);

  // 7. Check Empl Name
  const checkEMPL_NAME = useCallback((selection: number, EMPL_NO: string) => {
    generalQuery("checkEMPL_NO_mobile", { EMPL_NO: EMPL_NO })
      .then((response) => {
        if (response.data.tk_status !== "NG" && response.data.data?.length > 0) {
          const fullName = `${response.data.data[0].MIDLAST_NAME} ${response.data.data[0].FIRST_NAME}`;
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
        console.error("checkEMPL_NO_mobile error:", error);
      });
  }, []);

  // 8. Tra cứu PQC1 Data
  const traPQC1Data = useCallback(() => {
    setIsLoading(true);
    generalQuery("trapqc1data", {
      ALLTIME: false,
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
      FACTORY: factory || (userData?.FACTORY_CODE === 1 ? "NM1" : "NM2"),
    })
      .then((response) => {
        setIsLoading(false);
        if (response.data.tk_status !== "NG") {
          const loadeddata: PQC1_ITEM[] = (response.data.data || []).map(
            (element: PQC1_ITEM, index: number) => ({
              ...element,
              INS_DATE: moment.utc(element.INS_DATE).format("YYYY-MM-DD HH:mm:ss"),
              UPD_DATE: moment.utc(element.UPD_DATE).format("YYYY-MM-DD HH:mm:ss"),
              SETTING_OK_TIME: moment.utc(element.SETTING_OK_TIME).format("YYYY-MM-DD HH:mm:ss"),
              id: index,
            })
          );
          setPqc1DataTable(loadeddata);
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("trapqc1data error:", error);
      });
  }, [factory, userData?.FACTORY_CODE]);

  // 9. Input Check
  const checkInput = (): boolean => {
    return Boolean(
      inputno !== "" &&
      planId !== "" &&
      lineqc_empl !== "" &&
      sx_data.length !== 0 &&
      process_lot_no !== ""
    );
  };

  // 10. Insert PQC1 Data
  const inputDataPqc1 = () => {
    if (!checkInput()) {
      Swal.fire("Thông báo", "Hãy nhập đủ thông tin trước khi lưu setting", "warning");
      refArray[0]?.current?.focus();
      return;
    }

    generalQuery("insert_pqc1", {
      PROCESS_LOT_NO: process_lot_no.toUpperCase(),
      LINEQC_PIC: lineqc_empl.toUpperCase(),
      PROD_PIC: sx_data[0]?.INS_EMPL?.toUpperCase() || "",
      PROD_LEADER: prod_leader_empl.toUpperCase(),
      STEPS: sx_data[0]?.STEP,
      CAVITY: sx_data[0]?.CAVITY,
      SETTING_OK_TIME: sx_data[0]?.MASS_START_TIME,
      FACTORY: sx_data[0]?.PLAN_FACTORY || factory,
      REMARK: ktdtc,
      PROD_REQUEST_NO: sx_data[0]?.PROD_REQUEST_NO,
      G_CODE: sx_data[0]?.G_CODE,
      PLAN_ID: sx_data[0]?.PLAN_ID?.toUpperCase(),
      PROCESS_NUMBER: sx_data[0]?.PROCESS_NUMBER,
      LINE_NO: sx_data[0]?.EQ_NAME_TT,
      REMARK2: remark,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          Swal.fire("Thông báo", "Input data Setting thành công!", "success");
          traPQC1Data();
          setPlanId("");
          setLineqc_empl("");
          setReMark("");
          refArray[0]?.current?.focus();
        } else {
          Swal.fire("Cảnh báo", "Có lỗi: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.error("insert_pqc1 error:", error);
      });
  };

  // 11. Update Sample QTY
  const updateSampleQty = async () => {
    const selected = selectedRowsDataA.current;
    if (selected.length === 0) {
      Swal.fire("Cảnh báo", "Vui lòng chọn ít nhất 1 dòng trên bảng để cập nhật", "warning");
      return;
    }

    let err_code = "";
    for (let i = 0; i < selected.length; i++) {
      await generalQuery("updatepqc1sampleqty", {
        PQC1_ID: selected[i].PQC1_ID,
        INSPECT_SAMPLE_QTY: selected[i].INSPECT_SAMPLE_QTY,
      })
        .then((response) => {
          if (response.data.tk_status === "NG") {
            err_code += `| ${response.data.message} `;
          }
        })
        .catch((error) => {
          console.error("updatepqc1sampleqty error:", error);
        });
    }

    if (err_code === "") {
      Swal.fire("Thông báo", "Cập nhật Sample QTY thành công!", "success");
      traPQC1Data();
    } else {
      Swal.fire("Cảnh báo", "Có lỗi: " + err_code, "error");
    }
  };

  // 12. Xuất Excel
  const exportExcel = (isFiltered: boolean = false) => {
    if (pqc1datatable.length === 0) {
      Swal.fire("Thông báo", "Không có dữ liệu để xuất Excel", "info");
      return;
    }
    const dataToExport = isFiltered && selectedRowsDataA.current.length > 0
      ? selectedRowsDataA.current
      : pqc1datatable;

    SaveExcel(dataToExport, `PQC1_SETTING_${moment().format("YYYYMMDD_HHmmss")}`);
  };

  // 13. KPIs realtime
  const kpis = useMemo(() => {
    const total = pqc1datatable.length;
    const dktCount = pqc1datatable.filter((d) => d.REMARK?.includes("DKT")).length;
    const totalSample = pqc1datatable.reduce((acc, cur) => acc + (Number(cur.INSPECT_SAMPLE_QTY) || 0), 0);
    const validRateRows = pqc1datatable.filter((d) => d.DEFECT_RATE !== null && d.DEFECT_RATE !== undefined);
    const avgDefectRate = validRateRows.length > 0
      ? (validRateRows.reduce((acc, cur) => acc + (Number(cur.DEFECT_RATE) || 0), 0) / validRateRows.length).toFixed(1)
      : "0.0";

    return {
      total,
      dktCount,
      cktCount: total - dktCount,
      totalSample,
      avgDefectRate,
    };
  }, [pqc1datatable]);

  // Initial load
  useEffect(() => {
    traPQC1Data();
  }, [traPQC1Data]);

  return {
    // User & Factory
    userData,
    factory,
    setFactory,
    // Inputs & Names
    planId,
    setPlanId,
    lineqc_empl,
    setLineqc_empl,
    prod_leader_empl,
    setprod_leader_empl,
    remark,
    setReMark,
    empl_name,
    empl_name2,
    // Directives
    inputno,
    process_lot_no,
    g_name,
    g_code,
    m_name,
    m_code,
    width_cd,
    in_cfm_qty,
    roll_qty,
    lieql_sx,
    out_date,
    prodrequestno,
    prodreqdate,
    sx_data,
    ktdtc,
    // Table & Actions
    pqc1datatable,
    showhideinput,
    setShowHideInput,
    quickFilter,
    setQuickFilter,
    isFullScreen,
    setIsFullScreen,
    isLoading,
    selectedRowsDataA,
    refArray,
    handleKeyDown,
    // Business methods
    checkPlanID,
    checkDataSX,
    checkProcessLotNo,
    checkLotNVL,
    checkEMPL_NAME,
    traPQC1Data,
    inputDataPqc1,
    updateSampleQty,
    exportExcel,
    kpis,
  };
};

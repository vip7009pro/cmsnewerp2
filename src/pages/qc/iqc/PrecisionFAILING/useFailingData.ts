import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import moment from "moment";
import { generalQuery } from "../../../../api/Api";
import { RootState } from "../../../../redux/store";
import { UserData } from "../../../../api/GlobalInterface";
import { CustomerListData } from "../../../kinhdoanh/interfaces/kdInterface";
import { QC_FAIL_DATA } from "../../interfaces/qcInterface";
import {
  f_isM_CODE_in_M140_Main,
  f_isM_LOT_NO_in_IN_KHO_SX,
  f_isM_LOT_NO_in_O302,
  f_resetIN_KHO_SX_IQC1,
  f_resetIN_KHO_SX_IQC2,
  f_updateNCRIDForFailing,
} from "../../utils/qcUtils";
import {
  f_isM_LOT_NO_in_P500,
  f_nhapkhoao,
} from "../../../qlsx/QLSXPLAN/utils/khsxUtils";
import { SaveExcel } from "../../../../api/services/excelService";

export const useFailingData = () => {
  const theme = useSelector((state: RootState) => state.totalSlice.theme);
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );

  // Sidebar Mode: 'IN' (Nhập Kho) | 'OUT' (Xuất Kho) | 'FILTER' (Bộ Lọc Tra Cứu)
  const [sidebarMode, setSidebarMode] = useState<"IN" | "OUT" | "FILTER">("FILTER");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const toggleFullscreen = useCallback(() => setIsFullscreen((prev) => !prev), []);

  // Filter & Config States
  const [cmsvcheck, setCMSVCheck] = useState(true);
  const [onlyPending, setOnlyPending] = useState(true);
  const [customerList, setCustomerList] = useState<CustomerListData[]>([]);
  const [testtype, setTestType] = useState("NVL");
  const [cust_cd, setCust_Cd] = useState("6969");
  const [ncrId, setNCRID] = useState(0);
  const [remark, setReMark] = useState("");
  const [isNewFailing, setIsNewFailing] = useState(false);
  const [quickFilterText, setQuickFilterText] = useState("");

  // Plan & Material States
  const [planId, setPlanId] = useState("");
  const [g_name, setGName] = useState("");
  const [g_code, setGCode] = useState("");
  const [prodrequestno, setProdRequestNo] = useState("");
  const [prodreqdate, setProdReqDate] = useState("");
  const [pqc3Id, setPQC3ID] = useState(0);
  const [defect_phenomenon, setDefectPhenomenon] = useState("");

  const [m_lot_no, setM_LOT_NO] = useState("");
  const [process_lot_no, setProcessLotNo] = useState("");
  const [vendorLot, setVendorLot] = useState("");
  const [m_name, setM_Name] = useState("");
  const [m_code, setM_Code] = useState("");
  const [width_cd, setWidthCD] = useState(0);
  const [in_cfm_qty, setInCFMQTY] = useState(0);
  const [roll_qty, setRollQty] = useState(0);
  const [lieql_sx, setLieuQL_SX] = useState<any>(0);
  const [out_date, setOut_Date] = useState("");

  // Personnel States
  const [request_empl, setrequest_empl] = useState("");
  const [request_empl2, setrequest_empl2] = useState("");
  const [empl_name, setEmplName] = useState("");
  const [empl_name2, setEmplName2] = useState("");

  // Table Data & Selected Rows
  const [inspectiondatatable, setInspectionDataTable] = useState<QC_FAIL_DATA[]>([]);
  const selectedRowsDataA = useRef<QC_FAIL_DATA[]>([]);
  const [selectedCount, setSelectedCount] = useState(0);

  const onSelectionChange = useCallback((e: any) => {
    const selected = e?.api?.getSelectedRows() || [];
    selectedRowsDataA.current = selected;
    setSelectedCount(selected.length);
  }, []);

  // Fetch Customer List
  const getcustomerlist = useCallback(() => {
    generalQuery("selectcustomerList", {})
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          setCustomerList(response.data.data);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  // Check Employee Name
  const checkEMPL_NAME = useCallback((selection: number, EMPL_NO: string) => {
    if (!EMPL_NO || EMPL_NO.length < 5) return;
    generalQuery("checkEMPL_NO_mobile", { EMPL_NO })
      .then((response) => {
        if (response.data.tk_status !== "NG" && response.data.data?.length > 0) {
          const fullName =
            response.data.data[0].MIDLAST_NAME +
            " " +
            response.data.data[0].FIRST_NAME;
          if (selection === 1) setEmplName(fullName);
          else setEmplName2(fullName);
        } else {
          if (selection === 1) setEmplName("");
          else setEmplName2("");
        }
      })
      .catch((error) => console.log(error));
  }, []);

  // Check Plan ID
  const checkPlanID = useCallback((PLAN_ID: string) => {
    if (!PLAN_ID || PLAN_ID.length < 7) return;
    generalQuery("checkPLAN_ID", { PLAN_ID })
      .then((response) => {
        if (response.data.tk_status !== "NG" && response.data.data?.length > 0) {
          setGName(response.data.data[0].G_NAME);
          setProdReqDate(response.data.data[0].PROD_REQUEST_DATE);
          setGCode(response.data.data[0].G_CODE);
        } else {
          setProdRequestNo("");
          setGName("");
          setProdReqDate("");
          setGCode("");
        }
      })
      .catch((error) => console.log(error));
  }, []);

  // Check PQC3 ID
  const checkPQC3_ID = useCallback((PLAN_ID: string) => {
    if (!PLAN_ID || PLAN_ID.length < 7) return;
    generalQuery("checkPQC3_IDfromPLAN_ID", { PLAN_ID })
      .then((response) => {
        if (response.data.tk_status !== "NG" && response.data.data?.length > 0) {
          setPQC3ID(response.data.data[0].PQC3_ID ?? 0);
          setDefectPhenomenon(response.data.data[0].DEFECT_PHENOMENON ?? "");
        } else {
          setPQC3ID(0);
          setDefectPhenomenon("");
        }
      })
      .catch((error) => console.log(error));
  }, []);

  // Check Material Lot NVL
  const checkLotNVL = useCallback((M_LOT_NO: string) => {
    if (!M_LOT_NO || M_LOT_NO.length < 7) return;
    generalQuery("checkMNAMEfromLot", { M_LOT_NO })
      .then((response) => {
        if (response.data.tk_status !== "NG" && response.data.data?.length > 0) {
          const item = response.data.data[0];
          setM_Name(item.M_NAME + " | " + item.WIDTH_CD);
          setM_Code(item.M_CODE);
          setWidthCD(item.WIDTH_CD);
          setInCFMQTY(item.OUT_CFM_QTY);
          setRollQty(item.ROLL_QTY);
          setVendorLot(item.LOTNCC ?? "");
          if ((item.PLAN_ID ?? "").length > 7) {
            checkPQC3_ID(item.PLAN_ID);
          }
          setLieuQL_SX(item.LIEUQL_SX === null ? 0 : item.LIEUQL_SX);
          setOut_Date(item.OUT_DATE);
        } else {
          setM_Name("");
          setM_Code("");
          setWidthCD(0);
          setRollQty(0);
          setInCFMQTY(0);
          setLieuQL_SX(0);
          setOut_Date("");
          setVendorLot("");
        }
      })
      .catch((error) => console.log(error));
  }, [checkPQC3_ID]);

  // Check Material Lot NVL for BTP
  const checkLotNVL_BTP = useCallback((M_LOT_NO: string) => {
    if (!M_LOT_NO) return;
    generalQuery("checkMNAMEfromLot", { M_LOT_NO })
      .then((response) => {
        if (response.data.tk_status !== "NG" && response.data.data?.length > 0) {
          const item = response.data.data[0];
          setM_Name(item.M_NAME + " | " + item.WIDTH_CD);
          setM_Code(item.M_CODE);
          setWidthCD(item.WIDTH_CD);
          setVendorLot(item.LOTNCC ?? "");
          setLieuQL_SX(item.LIEUQL_SX === null ? 0 : item.LIEUQL_SX);
          setOut_Date(item.OUT_DATE);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  // Check Process Lot (BTP)
  const checkLotProcess = useCallback((PROCESS_LOT_NO: string) => {
    if (!PROCESS_LOT_NO || PROCESS_LOT_NO.length < 5) return;
    generalQuery("checkProcessLotNoInfo", { PROCESS_LOT_NO })
      .then(async (response) => {
        if (response.data.tk_status !== "NG" && response.data.data?.length > 0) {
          const M_LOT = response.data.data[0].M_LOT_NO;
          const TOTAL_IN_QTY = response.data.data[0].BTP_MET;
          const LOT_PLAN = response.data.data[0].PLAN_ID;

          setPlanId(LOT_PLAN);
          setM_LOT_NO(M_LOT);
          await checkLotNVL_BTP(M_LOT);
          await checkPlanID(LOT_PLAN);
          await checkPQC3_ID(LOT_PLAN);
          setRollQty(1);
          setInCFMQTY(TOTAL_IN_QTY);
        }
      })
      .catch((error) => console.log(error));
  }, [checkLotNVL_BTP, checkPlanID, checkPQC3_ID]);

  // Input Validation Helper
  const checkInput = useCallback((): boolean => {
    return (
      (m_lot_no !== "" || process_lot_no !== "") &&
      planId !== "" &&
      request_empl !== ""
    );
  }, [m_lot_no, process_lot_no, planId, request_empl]);

  // Add Row to Grid (Form IN)
  const addRow = useCallback(async () => {
    const temp_row: QC_FAIL_DATA = {
      id: inspectiondatatable.length,
      FACTORY: userData?.FACTORY_CODE === 1 ? "NM1" : "NM2",
      PLAN_ID_SUDUNG: planId.toUpperCase(),
      G_NAME: g_name,
      G_CODE: g_code,
      LIEUQL_SX: lieql_sx,
      M_CODE: m_code,
      M_LOT_NO: m_lot_no,
      VENDOR_LOT: vendorLot,
      M_NAME: m_name,
      WIDTH_CD: width_cd,
      ROLL_QTY: roll_qty,
      IN_QTY: in_cfm_qty,
      TOTAL_IN_QTY: roll_qty * in_cfm_qty,
      USE_YN: "Y",
      PQC3_ID: pqc3Id,
      DEFECT_PHENOMENON: defect_phenomenon,
      SX_DEFECT: defect_phenomenon,
      OUT_DATE: out_date,
      INS_EMPL: userData?.EMPL_NO,
      INS_DATE: moment().format("YYYY-MM-DD HH:mm:ss"),
      UPD_EMPL: "",
      UPD_DATE: "",
      PHANLOAI: testtype,
      QC_PASS: "P",
      QC_PASS_DATE: "",
      QC_PASS_EMPL: "",
      REMARK: remark,
      IN1_EMPL: request_empl.toUpperCase(),
      IN2_EMPL: request_empl2.toUpperCase(),
      OUT1_EMPL: "",
      OUT2_EMPL: "",
      OUT_PLAN_ID: "",
      IN_CUST_CD: "",
      OUT_CUST_CD: "",
      IN_CUST_NAME: "",
      OUT_CUST_NAME: "",
      REMARK_OUT: "",
      FAIL_ID: 0,
      NCR_ID: 0,
      PROCESS_LOT_NO: process_lot_no,
    };

    setInspectionDataTable((prev) => [...prev, temp_row]);
    setM_LOT_NO("");
    setM_Name("");
    setWidthCD(0);
    setVendorLot("");
    setProcessLotNo("");
  }, [
    inspectiondatatable.length,
    userData,
    planId,
    g_name,
    g_code,
    lieql_sx,
    m_code,
    m_lot_no,
    vendorLot,
    m_name,
    width_cd,
    roll_qty,
    in_cfm_qty,
    pqc3Id,
    defect_phenomenon,
    out_date,
    testtype,
    remark,
    request_empl,
    request_empl2,
    process_lot_no,
  ]);

  // Handle Add Action (Form IN)
  const handleAddFailingRow = useCallback(async () => {
    if (checkInput() && isNewFailing) {
      let checkLOTExistTotal = false;
      const checkLotP500 = await f_isM_LOT_NO_in_P500(planId, m_lot_no);
      const checkLotIN_KHO_SX = await f_isM_LOT_NO_in_IN_KHO_SX(planId, m_lot_no);
      const checkLotO302 = await f_isM_LOT_NO_in_O302(planId, m_lot_no);

      if (checkLotP500 || checkLotIN_KHO_SX || checkLotO302) {
        checkLOTExistTotal = true;
      }

      const lotArray = inspectiondatatable.map((el) => el.M_LOT_NO);
      if (!checkLOTExistTotal) {
        Swal.fire("Thông báo", "LOT này không dùng cho chỉ thị này", "error");
        return;
      }
      if (lotArray.indexOf(m_lot_no) >= 0) {
        Swal.fire("Thông báo", "LOT này đã được thêm rồi", "error");
        return;
      }
      addRow();
    } else {
      Swal.fire("Thông báo", "Hãy chọn New Failing và nhập đủ thông tin trước khi bấm Add", "error");
    }
  }, [checkInput, isNewFailing, planId, m_lot_no, inspectiondatatable, addRow]);

  // Save Failing Data to Database (Form IN)
  const saveFailingData = useCallback(async () => {
    if (inspectiondatatable.length === 0) {
      Swal.fire("Thông báo", "Chưa có dòng nào để lưu", "warning");
      return;
    }

    let err_code = "";
    for (let i = 0; i < inspectiondatatable.length; i++) {
      const row = inspectiondatatable[i];
      await generalQuery("insertFailingData", {
        FACTORY: row.FACTORY,
        PLAN_ID_SUDUNG: row.PLAN_ID_SUDUNG,
        LIEUQL_SX: row.LIEUQL_SX,
        M_CODE: row.M_CODE,
        M_LOT_NO: row.M_LOT_NO,
        VENDOR_LOT: row.VENDOR_LOT,
        ROLL_QTY: row.ROLL_QTY,
        IN_QTY: row.IN_QTY,
        TOTAL_IN_QTY: row.TOTAL_IN_QTY,
        USE_YN: row.USE_YN,
        PQC3_ID: row.PQC3_ID,
        DEFECT_PHENOMENON: row.DEFECT_PHENOMENON,
        OUT_DATE: row.OUT_DATE,
        INS_EMPL: row.INS_EMPL,
        INS_DATE: row.INS_DATE,
        UPD_EMPL: row.UPD_EMPL,
        UPD_DATE: row.UPD_DATE,
        PHANLOAI: row.PHANLOAI,
        QC_PASS: row.QC_PASS,
        QC_PASS_DATE: row.QC_PASS_DATE,
        QC_PASS_EMPL: row.QC_PASS_EMPL,
        REMARK: row.REMARK,
        IN1_EMPL: row.IN1_EMPL,
        IN2_EMPL: row.IN2_EMPL,
        OUT1_EMPL: row.OUT1_EMPL,
        OUT2_EMPL: row.OUT2_EMPL,
        OUT_PLAN_ID: row.OUT_PLAN_ID,
        IN_CUST_CD: row.IN_CUST_CD,
        OUT_CUST_CD: row.OUT_CUST_CD,
        PROCESS_LOT_NO: row.PROCESS_LOT_NO,
      }).then((response) => {
        if (response.data.tk_status === "NG") {
          err_code += "Lỗi: " + response.data.message + "| ";
        }
      });

      if (await f_isM_LOT_NO_in_P500(row.PLAN_ID_SUDUNG, row.M_LOT_NO)) {
        await f_resetIN_KHO_SX_IQC2(row.PLAN_ID_SUDUNG, row.M_LOT_NO);
        if (row.PHANLOAI === "BTP") {
          await generalQuery("updateLOT_SX_STATUS", {
            PROCESS_LOT_NO: row.PROCESS_LOT_NO,
            LOT_STATUS: "IQ",
          });
        }
      } else {
        await f_resetIN_KHO_SX_IQC1(row.PLAN_ID_SUDUNG, row.M_LOT_NO);
      }
    }

    if (err_code === "") {
      Swal.fire("Thông báo", "Thêm data thành công", "success");
      setIsNewFailing(false);
    } else {
      Swal.fire("Thông báo", "Lỗi: " + err_code, "error");
    }
  }, [inspectiondatatable]);

  // Update QC Fail Table Data (Form OUT - Output Liệu QC Fail)
  const updateQCFailTable = useCallback(async () => {
    if (selectedRowsDataA.current.length === 0) {
      Swal.fire("Thông báo", "Chọn ít nhất 1 dòng trên lưới để thực hiện xuất", "error");
      return;
    }
    if (!g_name) {
      Swal.fire("Thông báo", "Số chỉ thị chưa đúng hoặc chưa có mã code", "error");
      return;
    }
    if (!empl_name) {
      Swal.fire("Thông báo", "Phải nhập mã nhân viên người giao", "error");
      return;
    }
    if (!empl_name2) {
      Swal.fire("Thông báo", "Phải nhập mã nhân viên người nhận", "error");
      return;
    }

    let err_code = "";
    for (let i = 0; i < selectedRowsDataA.current.length; i++) {
      const row = selectedRowsDataA.current[i];
      if ((row.OUT1_EMPL !== null || row.OUT2_EMPL !== null) && row.USE_YN === "N") {
        err_code += `Lỗi: Cuộn ${row.M_LOT_NO} đã out rồi | `;
      } else {
        await generalQuery("updateQCFailTableData", {
          OUT1_EMPL: request_empl,
          OUT2_EMPL: request_empl2,
          OUT_CUST_CD: cust_cd,
          OUT_PLAN_ID: planId,
          REMARK_OUT: remark,
          FAIL_ID: row.FAIL_ID,
        }).then(async (response) => {
          if (response.data.tk_status !== "NG") {
            const checkM_CODE = await f_isM_CODE_in_M140_Main(row.M_CODE, g_code);
            if (checkM_CODE) {
              f_nhapkhoao({
                FACTORY: row.FACTORY,
                PHANLOAI: "R",
                PLAN_ID_INPUT: planId,
                PLAN_ID_SUDUNG: null,
                M_CODE: row.M_CODE,
                M_LOT_NO: row.M_LOT_NO,
                ROLL_QTY: row.ROLL_QTY,
                IN_QTY: row.IN_QTY,
                TOTAL_IN_QTY: row.TOTAL_IN_QTY,
                USE_YN: "Y",
                FSC: "N",
                FSC_MCODE: "01",
                FSC_GCODE: "01",
              });
            } else {
              err_code += "Chú ý: Có cuộn không phải liệu chính trong BOM của code được chỉ thị vào; ";
            }
          } else {
            err_code += ` Lỗi: ${response.data.message} | `;
          }
        });
      }
    }

    if (err_code === "") {
      Swal.fire("Thông báo", "Xuất kho failing thành công", "success");
    } else {
      Swal.fire("Thông báo", "Có lỗi: " + err_code, "warning");
    }
  }, [g_name, empl_name, empl_name2, request_empl, request_empl2, cust_cd, planId, remark, g_code]);

  // Fetch QC Failing Data (Tra Data)
  const handletraFailingData = useCallback(() => {
    setIsNewFailing(false);
    generalQuery("loadQCFailData", { ONLY_PENDING: onlyPending })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: QC_FAIL_DATA[] = response.data.data.map(
            (element: QC_FAIL_DATA, index: number) => ({
              ...element,
              INS_DATE: element.INS_DATE
                ? moment(element.INS_DATE).utc().format("YYYY-MM-DD HH:mm:ss")
                : "",
              UPD_DATE: element.UPD_DATE
                ? moment(element.UPD_DATE).utc().format("YYYY-MM-DD HH:mm:ss")
                : "",
              QC_PASS_DATE: element.QC_PASS_DATE
                ? moment(element.QC_PASS_DATE).utc().format("YYYY-MM-DD HH:mm:ss")
                : "",
              id: index,
            })
          );
          setInspectionDataTable(loadeddata);
          Swal.fire("Thông báo", "Đã load : " + loadeddata.length + " dòng", "success");
        }
      })
      .catch((error) => console.log(error));
  }, [onlyPending]);

  // Set QC PASS / FAIL Action
  const setQCPASS = useCallback(async (value: "Y" | "N") => {
    if (selectedRowsDataA.current.length === 0) {
      Swal.fire("Thông báo", "Chọn ít nhất 1 dòng để thực hiện", "error");
      return;
    }
    if (userData?.SUBDEPTNAME !== "IQC") {
      Swal.fire("Thông báo", "Bạn không phải người bộ phận IQC", "error");
      return;
    }

    Swal.fire({
      title: "Cập nhật QC Pass",
      text: "Đang xử lý dữ liệu, vui lòng chờ...",
      icon: "info",
      showConfirmButton: false,
      allowOutsideClick: false,
    });

    let err_code = "";
    for (let i = 0; i < selectedRowsDataA.current.length; i++) {
      const row = selectedRowsDataA.current[i];
      await generalQuery("updateQCPASS_FAILING", {
        FAIL_ID: row.FAIL_ID,
        M_LOT_NO: row.M_LOT_NO,
        PLAN_ID_SUDUNG: row.PLAN_ID_SUDUNG,
        VALUE: value,
      }).then((response) => {
        if (response.data.tk_status === "NG") {
          err_code += ` Lỗi: ${response.data.message}`;
        }
      });
    }

    if (err_code === "") {
      Swal.fire("Thông báo", "SET thành công", "success");
      handletraFailingData();
    } else {
      Swal.fire("Thông báo", "Lỗi: " + err_code, "error");
    }
  }, [userData, handletraFailingData]);

  // Set Close / Pending (Bộ phận Mua Hàng)
  const setClose = useCallback(async (value: "C" | "P") => {
    if (selectedRowsDataA.current.length === 0) {
      Swal.fire("Thông báo", "Chọn ít nhất 1 dòng để thực hiện", "error");
      return;
    }
    if (userData?.SUBDEPTNAME !== "MUA" && userData?.EMPL_NO !== "NHU1903") {
      Swal.fire("Thông báo", "Bạn không phải người bộ phận MUA", "error");
      return;
    }

    Swal.fire({
      title: "Đang update trạng thái",
      text: "Đang cập nhật, vui lòng chờ...",
      icon: "info",
      showConfirmButton: false,
      allowOutsideClick: false,
    });

    let err_code = "";
    for (let i = 0; i < selectedRowsDataA.current.length; i++) {
      const row = selectedRowsDataA.current[i];
      await generalQuery("updateCLOSE_FAILING", {
        FAIL_ID: row.FAIL_ID,
        M_LOT_NO: row.M_LOT_NO,
        PLAN_ID_SUDUNG: row.PLAN_ID_SUDUNG,
        VALUE: value,
      }).then((response) => {
        if (response.data.tk_status === "NG") {
          err_code += ` Lỗi: ${response.data.message}`;
        }
      });
    }

    if (err_code === "") {
      Swal.fire("Thông báo", "SET thành công", "success");
      handletraFailingData();
    } else {
      Swal.fire("Thông báo", "Lỗi: " + err_code, "error");
    }
  }, [userData, handletraFailingData]);

  // IQC Confirm Action
  const setIQCConfirm = useCallback(async (confirmEMPL: string) => {
    if (selectedRowsDataA.current.length === 0) {
      Swal.fire("Thông báo", "Chọn ít nhất 1 dòng để thực hiện", "error");
      return;
    }
    if (userData?.SUBDEPTNAME !== "IQC") {
      Swal.fire("Thông báo", "Bạn không phải người bộ phận IQC", "error");
      return;
    }
    if (!confirmEMPL) {
      Swal.fire("Thông báo", "Hãy nhập mã người xác nhận", "error");
      return;
    }

    let err_code = "";
    for (let i = 0; i < selectedRowsDataA.current.length; i++) {
      await generalQuery("updateIQCConfirm_FAILING", {
        FAIL_ID: selectedRowsDataA.current[i].FAIL_ID,
        IN2_EMPL: confirmEMPL.toUpperCase(),
      }).then((response) => {
        if (response.data.tk_status === "NG") {
          err_code += ` Lỗi: ${response.data.message}`;
        }
      });
    }

    if (err_code === "") {
      Swal.fire("Thông báo", "Confirm thành công", "success");
      handletraFailingData();
    } else {
      Swal.fire("Thông báo", "Lỗi: " + err_code, "error");
    }
  }, [userData, handletraFailingData]);

  // Update NCR ID for Failing
  const updateNCRIDFailing = useCallback(async () => {
    if (selectedRowsDataA.current.length === 0) {
      Swal.fire("Thông báo", "Chọn ít nhất 1 dòng để thực hiện", "error");
      return;
    }
    if (userData?.SUBDEPTNAME !== "IQC") {
      Swal.fire("Thông báo", "Bạn không phải người bộ phận IQC", "error");
      return;
    }
    if (ncrId === 0) {
      Swal.fire("Thông báo", "NCR ID phải khác 0", "error");
      return;
    }

    let err_code = "";
    for (let i = 0; i < selectedRowsDataA.current.length; i++) {
      await f_updateNCRIDForFailing(selectedRowsDataA.current[i].FAIL_ID ?? 0, ncrId);
    }

    if (err_code === "") {
      Swal.fire("Thông báo", "UPDATE NCR ID thành công", "success");
      handletraFailingData();
    } else {
      Swal.fire("Thông báo", "Lỗi: " + err_code, "error");
    }
  }, [userData, ncrId, handletraFailingData]);

  // Export Excel Handlers
  const handleExportExcel = useCallback((type: "EX1" | "EX2") => {
    const dataToExport =
      type === "EX1" && selectedRowsDataA.current.length > 0
        ? selectedRowsDataA.current
        : inspectiondatatable;

    if (dataToExport.length === 0) {
      Swal.fire("Thông báo", "Không có dữ liệu để xuất Excel", "warning");
      return;
    }

    SaveExcel(dataToExport, `QC_FAILING_DATA_${moment().format("YYYYMMDD_HHmmss")}`);
  }, [inspectiondatatable]);

  // Start New Failing Session
  const handleNewFailing = useCallback(() => {
    setInspectionDataTable([]);
    setIsNewFailing(true);
    setSidebarMode("IN");
  }, []);

  // Realtime KPI Calculation
  const kpiStats = useMemo(() => {
    const total = inspectiondatatable.length;
    let passed = 0;
    let pending = 0;
    let totalQty = 0;

    for (let i = 0; i < total; i++) {
      const row = inspectiondatatable[i];
      if (row.QC_PASS === "Y") passed++;
      else pending++;
      totalQty += Number(row.TOTAL_IN_QTY) || 0;
    }

    const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : "0.0";
    const pendingRate = total > 0 ? ((pending / total) * 100).toFixed(1) : "0.0";

    return {
      total,
      passed,
      pending,
      passRate,
      pendingRate,
      totalQty,
    };
  }, [inspectiondatatable]);

  useEffect(() => {
    getcustomerlist();
  }, [getcustomerlist]);

  return {
    theme,
    userData,
    sidebarMode,
    setSidebarMode,
    isFullscreen,
    toggleFullscreen,
    cmsvcheck,
    setCMSVCheck,
    onlyPending,
    setOnlyPending,
    customerList,
    testtype,
    setTestType,
    cust_cd,
    setCust_Cd,
    ncrId,
    setNCRID,
    remark,
    setReMark,
    isNewFailing,
    setIsNewFailing,
    quickFilterText,
    setQuickFilterText,
    planId,
    setPlanId,
    g_name,
    g_code,
    prodrequestno,
    prodreqdate,
    pqc3Id,
    defect_phenomenon,
    setDefectPhenomenon,
    m_lot_no,
    setM_LOT_NO,
    process_lot_no,
    setProcessLotNo,
    vendorLot,
    setVendorLot,
    m_name,
    m_code,
    width_cd,
    in_cfm_qty,
    roll_qty,
    lieql_sx,
    out_date,
    request_empl,
    setrequest_empl,
    request_empl2,
    setrequest_empl2,
    empl_name,
    empl_name2,
    inspectiondatatable,
    selectedCount,
    onSelectionChange,
    checkEMPL_NAME,
    checkPlanID,
    checkPQC3_ID,
    checkLotNVL,
    checkLotProcess,
    handleAddFailingRow,
    saveFailingData,
    updateQCFailTable,
    handletraFailingData,
    setQCPASS,
    setClose,
    setIQCConfirm,
    updateNCRIDFailing,
    handleExportExcel,
    handleNewFailing,
    kpiStats,
  };
};

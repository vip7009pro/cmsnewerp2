// useIncomingData.ts - Custom Hook encapsulating 100% of IQC Incoming state and logic
import { useState, useRef, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import Swal from "sweetalert2";
import { generalQuery, getAuditMode, getUserData, uploadQuery } from "../../../../api/Api";
import { checkBP } from "../../../../api/services/permissionService";
import { f_updateStockM090 } from "../../../../api/services/inventoryService";
import { SaveExcel } from "../../../../api/services/excelService";
import { IQC_INCOMMING_DATA, DTC_DATA } from "../../interfaces/qcInterface";
import { UserData } from "../../../../api/GlobalInterface";
import { RootState } from "../../../../redux/store";

const aqlTable = [
  { MIN_ROLL_QTY: 1, MAX_ROLL_QTY: 1, TEST_QTY: 1 },
  { MIN_ROLL_QTY: 2, MAX_ROLL_QTY: 15, TEST_QTY: 2 },
  { MIN_ROLL_QTY: 16, MAX_ROLL_QTY: 25, TEST_QTY: 3 },
  { MIN_ROLL_QTY: 26, MAX_ROLL_QTY: 90, TEST_QTY: 5 },
  { MIN_ROLL_QTY: 91, MAX_ROLL_QTY: 150, TEST_QTY: 8 },
  { MIN_ROLL_QTY: 151, MAX_ROLL_QTY: 280, TEST_QTY: 13 },
  { MIN_ROLL_QTY: 281, MAX_ROLL_QTY: 500, TEST_QTY: 20 },
];

export const getTestQty = (total_roll: number): number => {
  const item = aqlTable.find((el) => el.MIN_ROLL_QTY <= total_roll && el.MAX_ROLL_QTY >= total_roll);
  return item?.TEST_QTY ?? 0;
};

export const useIncomingData = () => {
  const userData: UserData | undefined = useSelector((state: RootState) => state.totalSlice.userData);

  // Tab & Modal & Fullscreen State
  const [activeLeftTab, setActiveLeftTab] = useState<"traData" | "newInput">("traData");
  const [showBNK, setShowBNK] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [ncrIdInput, setNcrIdInput] = useState("");

  // Filters State
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [m_name, setM_Name] = useState("");
  const [m_code, setM_Code] = useState("");
  const [vendor, setVendor] = useState("");
  const [vendorLot, setVendorLot] = useState("");
  const [showAllIncoming, setShowAllIncoming] = useState(false);

  // Registration Form State
  const [inputno, setInputNo] = useState("");
  const [request_empl, setrequest_empl] = useState(getUserData()?.EMPL_NO || "");
  const [empl_name, setEmplName] = useState("");
  const [reqDeptCode, setReqDeptCode] = useState("");
  const [remark, setReMark] = useState("");
  const [width_cd, setWidthCD] = useState(0);
  const [in_cfm_qty, setInCFMQTY] = useState(0);
  const [roll_qty, setRollQty] = useState(0);
  const [dtc_id, setDtc_ID] = useState(0);
  const [cust_cd, setCust_Cd] = useState("");
  const [cust_name_kd, setCust_Name_KD] = useState("");
  const [exp_date, setEXP_DATE] = useState(moment().format("YYYY-MM-DD"));
  const [total_qty, setTotal_QTY] = useState(0);
  const [total_roll, setTotal_ROLL] = useState(0);
  const [nq_qty, setNQ_QTY] = useState(0);

  // Grid Data State
  const [iqc1datatable, setIQC1DataTable] = useState<IQC_INCOMMING_DATA[]>([]);
  const [dtcDataTable, setDtcDataTable] = useState<DTC_DATA[]>([]);
  const [clickedRow, setClickedRow] = useState<IQC_INCOMMING_DATA | null>(null);
  const selectedRowsData = useRef<IQC_INCOMMING_DATA[]>([]);

  // Holding Data
  const insertHoldingData = async (REASON: string, M_CODE: string, M_LOT_NO: string) => {
    let nextID: number = 0;
    try {
      const res = await generalQuery("getMaxHoldingID", {});
      if (res.data.tk_status !== "NG" && res.data.data.length > 0) {
        nextID = res.data.data[0].MAX_ID + 1;
      }
      await generalQuery("insertHoldingFromI222", {
        ID: nextID,
        REASON: REASON,
        M_CODE: M_CODE,
        M_LOT_NO: M_LOT_NO,
      });
      f_updateStockM090();
    } catch (e) {
      console.error(e);
    }
  };

  // Handletra DTC Data
  const handletraDTCData = (dtcId: number) => {
    generalQuery("dtcdata", {
      ALLTIME: true,
      FROM_DATE: "",
      TO_DATE: "",
      G_CODE: "",
      G_NAME: "",
      M_NAME: "",
      M_CODE: "",
      TEST_NAME: "0",
      PROD_REQUEST_NO: "",
      TEST_TYPE: "0",
      ID: dtcId,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: DTC_DATA[] = response.data.data.map((element: DTC_DATA, index: number) => ({
            ...element,
            G_NAME:
              getAuditMode() === 0
                ? element?.G_NAME
                : element?.G_NAME?.search("CNDB") === -1
                  ? element?.G_NAME
                  : "TEM_NOI_BO",
            TEST_FINISH_TIME: moment.utc(element.TEST_FINISH_TIME).format("YYYY-MM-DD HH:mm:ss"),
            REQUEST_DATETIME: moment.utc(element.REQUEST_DATETIME).format("YYYY-MM-DD HH:mm:ss"),
            id: index,
          }));
          setDtcDataTable(loadeddata);
        } else {
          setDtcDataTable([]);
        }
      })
      .catch((err) => {
        console.error(err);
        setDtcDataTable([]);
      });
  };

  // Handletra IQC1 Data
  const handletraIQC1Data = () => {
    generalQuery("loadIQC1table", {
      M_CODE: m_code.trim(),
      M_NAME: m_name.trim(),
      LOTNCC: vendorLot.trim(),
      FROM_DATE: fromdate,
      TO_DATE: todate,
      VENDOR_NAME: vendor.trim(),
      SHOW_ALL: showAllIncoming,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: IQC_INCOMMING_DATA[] = response.data.data.map((element: IQC_INCOMMING_DATA, index: number) => {
            const keyArray = Object.keys(element).filter((key) => key.startsWith("KQ"));
            const auto_judgement = keyArray.some((key) => element[key as keyof IQC_INCOMMING_DATA] === 0)
              ? "NG"
              : keyArray.some((key) => element[key as keyof IQC_INCOMMING_DATA] === 2)
                ? "PD"
                : "OK";

            return {
              ...element,
              NQ_AQL: getTestQty(element.TOTAL_ROLL) ?? 0,
              AUTO_JUDGEMENT:
                element.IQC_TEST_RESULT === "OK"
                  ? auto_judgement
                  : element.IQC_TEST_RESULT === "PD" && auto_judgement === "NG"
                    ? "NG"
                    : element.IQC_TEST_RESULT === "PD" && auto_judgement === "PD"
                      ? "PD"
                      : element.IQC_TEST_RESULT === "PD" && auto_judgement === "OK"
                        ? "PD"
                        : element.IQC_TEST_RESULT === "NG" && auto_judgement === "NG"
                          ? "NG"
                          : "OK",
              DTC_AUTO: auto_judgement,
              INS_DATE: element.INS_DATE ? moment(element.INS_DATE).utc().format("YYYY-MM-DD HH:mm:ss") : "",
              UPD_DATE: element.UPD_DATE ? moment(element.UPD_DATE).utc().format("YYYY-MM-DD HH:mm:ss") : "",
              EXP_DATE: element.EXP_DATE ? moment(element.EXP_DATE).utc().format("YYYY-MM-DD") : "",
              id: index,
            };
          });
          setIQC1DataTable(loadeddata);
          Swal.fire("Thông báo", `Đã load : ${loadeddata.length} dòng`, "success");
        }
      })
      .catch((err) => console.error(err));
  };

  // Check Lot NVL
  const checkLotNVL = (mLotNo: string) => {
    generalQuery("checkMNAMEfromLotI222", { M_LOT_NO: mLotNo })
      .then((response) => {
        if (response.data.tk_status !== "NG" && response.data.data.length > 0) {
          const item = response.data.data[0];
          setM_Name(`${item.M_NAME} | ${item.WIDTH_CD}`);
          setM_Code(item.M_CODE);
          setWidthCD(item.WIDTH_CD);
          setInCFMQTY(item.OUT_CFM_QTY);
          setRollQty(item.ROLL_QTY);
          setCust_Cd(item.CUST_CD);
          setCust_Name_KD(item.CUST_NAME_KD);
          setVendorLot(item.LOTNCC);
          setEXP_DATE(moment(item.EXP_DATE).format("YYYY-MM-DD"));

          generalQuery("checkMNAMEfromLotI222Total", {
            M_CODE: item.M_CODE,
            LOTCMS: mLotNo.substring(0, 6),
          })
            .then((res) => {
              if (res.data.tk_status !== "NG" && res.data.data.length > 0) {
                setTotal_QTY(res.data.data[0].TOTAL_CFM_QTY);
                setTotal_ROLL(res.data.data[0].TOTAL_ROLL);
              } else {
                setTotal_QTY(0);
                setTotal_ROLL(0);
              }
            })
            .catch((e) => console.error(e));
        } else {
          setM_Name("");
          setM_Code("");
          setWidthCD(0);
          setRollQty(0);
          setInCFMQTY(0);
          setCust_Cd("");
          setCust_Name_KD("");
          setVendorLot("");
          setEXP_DATE(moment().format("YYYY-MM-DD"));
        }
      })
      .catch((e) => console.error(e));
  };

  // Check Empl Name
  const checkEMPL_NAME = (emplNo: string) => {
    generalQuery("checkEMPL_NO_mobile", { EMPL_NO: emplNo })
      .then((response) => {
        if (response.data.tk_status !== "NG" && response.data.data.length > 0) {
          const item = response.data.data[0];
          setEmplName(`${item.MIDLAST_NAME} ${item.FIRST_NAME}`);
          setReqDeptCode(item.WORK_POSITION_CODE);
        } else {
          setEmplName("");
          setReqDeptCode("");
        }
      })
      .catch((e) => console.error(e));
  };

  // Add Row & Insert
  const addRow = () => {
    if (!inputno || !request_empl || nq_qty === 0 || dtc_id === 0) {
      Swal.fire("Thông báo", "Hãy nhập đủ thông tin trước khi đăng ký", "error");
      return;
    }
    const tempRow: IQC_INCOMMING_DATA = {
      id: iqc1datatable.length,
      IQC1_ID: iqc1datatable.length,
      M_CODE: m_code,
      M_NAME: m_name,
      WIDTH_CD: width_cd,
      M_LOT_NO: inputno,
      LOT_CMS: inputno.substring(0, 6),
      LOT_VENDOR: vendorLot,
      CUST_CD: cust_cd,
      CUST_NAME_KD: cust_name_kd,
      EXP_DATE: exp_date,
      INPUT_LENGTH: total_qty,
      TOTAL_ROLL: total_roll,
      NQ_AQL: getTestQty(total_roll),
      NQ_CHECK_ROLL: nq_qty,
      DTC_ID: dtc_id,
      TEST_EMPL: request_empl,
      TOTAL_RESULT: "",
      AUTO_JUDGEMENT: "",
      NGOAIQUAN: "",
      KICHTHUOC: "",
      THICKNESS: "",
      DIENTRO: "",
      CANNANG: "",
      KEOKEO: "",
      KEOKEO2: "",
      FTIR: "",
      MAIMON: "",
      XRF: "",
      SCANBARCODE: "",
      PHTHALATE: "",
      MAUSAC: "",
      SHOCKNHIET: "",
      TINHDIEN: "",
      NHIETAM: "",
      TVOC: "",
      DOBONG: "",
      INS_DATE: "",
      INS_EMPL: "",
      UPD_DATE: "",
      UPD_EMPL: "",
      REMARK: remark,
      IQC_TEST_RESULT: "PD",
      DTC_RESULT: "PD",
      LOT_VENDOR_IQC: "",
      M_THICKNESS: 0,
      M_THICKNESS_UPPER: 0,
      M_THICKNESS_LOWER: 0,
      M_WIDTH: 0,
      CHECKSHEET: ""
    };
    setIQC1DataTable((prev) => [...prev, tempRow]);
    Swal.fire("Thông báo", "Đã thêm dòng vào danh sách kiểm tra", "success");
  };

  const insertIQC1Table = async () => {
    if (iqc1datatable.length === 0) {
      Swal.fire("Thông báo", "Thêm ít nhất 1 dòng để lưu", "error");
      return;
    }
    let errCode = "";
    for (let i = 0; i < iqc1datatable.length; i++) {
      try {
        const res = await generalQuery("insertIQC1table", iqc1datatable[i]);
        if (res.data.tk_status === "NG") {
          errCode += `Lỗi: ${res.data.message} | `;
        }
      } catch (e: any) {
        errCode += `Lỗi: ${e.message} | `;
      }
    }
    if (!errCode) {
      Swal.fire("Thông báo", "Thêm data thành công", "success");
      handletraIQC1Data();
    } else {
      Swal.fire("Thông báo", `Lỗi: ${errCode}`, "error");
    }
  };

  // Update Actions
  const updateIncomingData = async () => {
    const selected = selectedRowsData.current;
    if (selected.length === 0) {
      Swal.fire("Thông báo", "Chọn ít nhất 1 dòng để thực hiện", "error");
      return;
    }
    Swal.fire({
      title: "Update Data",
      text: "Đang update, hãy chờ chút...",
      icon: "info",
      allowOutsideClick: false,
      showConfirmButton: false,
    });

    let errCode = "";
    for (let i = 0; i < selected.length; i++) {
      const row = selected[i];
      try {
        const res = await generalQuery("updateIncomingData_web", {
          IQC1_ID: row.IQC1_ID,
          TOTAL_RESULT: (row.TOTAL_RESULT ?? "PD").toUpperCase(),
          NQ_CHECK_ROLL: row.NQ_CHECK_ROLL,
          IQC_TEST_RESULT: (row.IQC_TEST_RESULT ?? "PD").toUpperCase(),
          DTC_RESULT: (row.DTC_RESULT ?? "PD").toUpperCase(),
          REMARK: row.REMARK,
        });
        if (res.data.tk_status !== "NG") {
          await generalQuery("updateQCPASSI222", {
            M_CODE: row.M_CODE,
            LOT_CMS: row.LOT_CMS,
            VALUE: row.TOTAL_RESULT === "OK" ? "Y" : "N",
          });
          if (row.TOTAL_RESULT === "NG") {
            insertHoldingData(row.REMARK, row.M_CODE, row.LOT_CMS);
          }
        } else {
          errCode += ` Lỗi: ${res.data.message}`;
        }
      } catch (e: any) {
        errCode += ` Lỗi: ${e.message}`;
      }
    }

    if (!errCode) {
      Swal.fire("Thông báo", "Update thành công", "success");
      handletraIQC1Data();
    } else {
      Swal.fire("Thông báo", `Lỗi: ${errCode}`, "error");
    }
  };

  const setQCPASS = async (value: "Y" | "N") => {
    const selected = selectedRowsData.current;
    if (selected.length === 0) {
      Swal.fire("Thông báo", "Chọn ít nhất 1 dòng để thực hiện", "error");
      return;
    }
    Swal.fire({
      title: "Set QC Pass",
      text: "Đang set pass, hãy chờ chút...",
      icon: "info",
      allowOutsideClick: false,
      showConfirmButton: false,
    });

    let errCode = "";
    for (let i = 0; i < selected.length; i++) {
      const row = selected[i];
      try {
        await generalQuery("updateQCPASSI222", {
          M_CODE: row.M_CODE,
          LOT_CMS: row.LOT_CMS,
          VALUE: value,
        });
        if (value === "N") {
          insertHoldingData(row.REMARK, row.M_CODE, row.LOT_CMS);
        }
        await generalQuery("updateIQC1Table", {
          M_CODE: row.M_CODE,
          LOT_CMS: row.LOT_CMS,
          VALUE: value === "Y" ? "OK" : "NG",
          IQC1_ID: row.IQC1_ID,
          REMARK: row.REMARK,
        });
      } catch (e: any) {
        errCode += ` Lỗi: ${e.message}`;
      }
    }

    if (!errCode) {
      Swal.fire("Thông báo", "SET thành công", "success");
      handletraIQC1Data();
    } else {
      Swal.fire("Thông báo", `Lỗi: ${errCode}`, "error");
    }
  };

  const handleUpdateNcrId = () => {
    const selected = selectedRowsData.current;
    if (selected.length === 0) {
      Swal.fire("Thông báo", "Vui lòng chọn 1 dòng để cập nhật NCR_ID", "warning");
      return;
    }
    if (selected.length > 1) {
      Swal.fire("Thông báo", "Bạn đã chọn nhiều hơn 1 dòng", "warning");
      return;
    }
    const targetRow = selected[0];
    const ncrVal = ncrIdInput.trim();

    Swal.fire({
      title: "Xác nhận cập nhật NCR_ID?",
      text: `Bạn có chắc muốn gán NCR_ID "${ncrVal}" cho IQC1_ID: ${targetRow.IQC1_ID}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        generalQuery("update_iqc_ncr_id", {
          IQC1_ID: targetRow.IQC1_ID,
          NCR_ID: ncrVal === "" ? null : ncrVal,
        })
          .then((res) => {
            if (res.data.tk_status !== "NG") {
              Swal.fire("Thành công", "Đã cập nhật NCR_ID thành công", "success");
              setNcrIdInput("");
              handletraIQC1Data();
            } else {
              Swal.fire("Lỗi", `Cập nhật thất bại: ${res.data.message}`, "error");
            }
          })
          .catch((e) => Swal.fire("Lỗi", `Lỗi hệ thống: ${e.message}`, "error"));
      }
    });
  };

  const updateIQC_INLINE = (datarow: IQC_INCOMMING_DATA) => {
    generalQuery("updateIncomingData_web", {
      IQC1_ID: datarow.IQC1_ID,
      TOTAL_RESULT: (datarow.TOTAL_RESULT ?? "PD").toUpperCase(),
      NQ_CHECK_ROLL: datarow.NQ_CHECK_ROLL,
      IQC_TEST_RESULT: (datarow.IQC_TEST_RESULT ?? "PD").toUpperCase(),
      DTC_RESULT: (datarow.DTC_RESULT ?? "PD").toUpperCase(),
      REMARK: datarow.REMARK,
    })
      .then((res) => {
        if (res.data.tk_status !== "NG") {
          Swal.fire("Thông báo", "Update data thành công", "success");
        } else {
          Swal.fire("Thông báo", "Update data thất bại", "error");
        }
      })
      .catch((e) => console.error(e));
  };

  const updateDataTable = (dataRow: IQC_INCOMMING_DATA, key: string, value: any) => {
    Swal.fire({
      title: "Chắc chắn muốn update Data ?",
      text: "Suy nghĩ kỹ trước khi thực hiện",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Vẫn update!",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        const dataToUpdate = iqc1datatable.find((e) => e.IQC1_ID === dataRow.IQC1_ID);
        if (dataToUpdate) {
          updateIQC_INLINE({ ...dataToUpdate, [key]: value });
          setIQC1DataTable((prev) => prev.map((p) => (p.IQC1_ID === dataRow.IQC1_ID ? { ...p, [key]: value } : p)));
          if (key === "TOTAL_RESULT") {
            generalQuery("updateQCPASSI222", {
              M_CODE: dataToUpdate.M_CODE,
              LOT_CMS: dataToUpdate.LOT_CMS,
              VALUE: value === "OK" ? "Y" : "N",
            }).catch((e) => console.error(e));
          }
        }
      }
    });
  };

  const uploadChecksheet = (file: File, iqc1Id: number) => {
    checkBP(userData, ["QC"], ["ALL"], ["ALL"], async () => {
      uploadQuery(file, `${iqc1Id}.pdf`, "iqcincoming")
        .then((res) => {
          if (res.data.tk_status !== "NG") {
            generalQuery("updateIncomingChecksheet", { IQC1_ID: iqc1Id, CHECKSHEET: "Y" })
              .then((resp) => {
                if (resp.data.tk_status !== "NG") {
                  Swal.fire("Thông báo", "Upload checksheet thành công", "success");
                  setIQC1DataTable((prev) => prev.map((p) => (p.IQC1_ID === iqc1Id ? { ...p, CHECKSHEET: "Y" } : p)));
                } else {
                  Swal.fire("Thông báo", "Upload checksheet thất bại", "error");
                }
              })
              .catch((e) => console.error(e));
          } else {
            Swal.fire("Thông báo", `Upload file thất bại: ${res.data.message}`, "error");
          }
        })
        .catch((e) => console.error(e));
    });
  };

  // Export Excel
  const handleExportExcel = (type: "EX1" | "EX2") => {
    const dataToExport = type === "EX1" ? (selectedRowsData.current.length > 0 ? selectedRowsData.current : iqc1datatable) : iqc1datatable;
    SaveExcel(dataToExport, `IQC_Incoming_${moment().format("YYYYMMDD_HHmmss")}`);
  };

  const handleExportDtcExcel = (type: "EX1" | "EX2") => {
    SaveExcel(dtcDataTable, `DTC_Results_${clickedRow?.M_LOT_NO || "Data"}_${moment().format("YYYYMMDD_HHmmss")}`);
  };

  // Micro-KPIs calculation
  const kpis = useMemo(() => {
    const totalLots = iqc1datatable.length;
    const okLots = iqc1datatable.filter((r) => r.TOTAL_RESULT === "OK").length;
    const ngLots = iqc1datatable.filter((r) => r.TOTAL_RESULT === "NG").length;
    const passRate = totalLots > 0 ? ((okLots / totalLots) * 100).toFixed(1) : "100.0";
    const dtcTestCount = iqc1datatable.filter((r) => r.DTC_ID > 0).length;
    const holdingCount = iqc1datatable.filter((r) => r.TOTAL_RESULT === "NG" || (r.NCR_ID && r.NCR_ID.trim() !== "")).length;

    return { totalLots, okLots, ngLots, passRate, dtcTestCount, holdingCount };
  }, [iqc1datatable]);

  // Initial load
  useEffect(() => {
    handletraIQC1Data();
  }, []);

  return {
    userData,
    activeLeftTab,
    setActiveLeftTab,
    showBNK,
    setShowBNK,
    isFullscreen,
    setIsFullscreen,
    ncrIdInput,
    setNcrIdInput,
    fromdate,
    setFromDate,
    todate,
    setToDate,
    m_name,
    setM_Name,
    m_code,
    setM_Code,
    vendor,
    setVendor,
    vendorLot,
    setVendorLot,
    showAllIncoming,
    setShowAllIncoming,
    inputno,
    setInputNo,
    request_empl,
    setrequest_empl,
    empl_name,
    remark,
    setReMark,
    nq_qty,
    setNQ_QTY,
    dtc_id,
    setDtc_ID,
    iqc1datatable,
    setIQC1DataTable,
    dtcDataTable,
    clickedRow,
    setClickedRow,
    selectedRowsData,
    handletraIQC1Data,
    handletraDTCData,
    checkLotNVL,
    checkEMPL_NAME,
    addRow,
    insertIQC1Table,
    updateIncomingData,
    setQCPASS,
    handleUpdateNcrId,
    updateDataTable,
    updateIQC_INLINE,
    uploadChecksheet,
    handleExportExcel,
    handleExportDtcExcel,
    kpis,
  };
};

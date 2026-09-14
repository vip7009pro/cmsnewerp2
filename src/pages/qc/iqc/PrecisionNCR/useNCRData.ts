import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { generalQuery, getCompany, getUserData, uploadQuery } from "../../../../api/Api";
import { checkBP } from "../../../../api/services/permissionService";
import { HOLDDING_BY_NCR_ID, NCR_DATA } from "../../interfaces/qcInterface";
import { SaveExcel } from "../../../../api/services/excelService";

export const useNCRData = () => {
  const userData = useSelector((state: RootState) => state.totalSlice.userData);

  // Layout & UI States
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isNewRegister, setIsNewRegister] = useState(false);
  const [quickFilterText, setQuickFilterText] = useState("");
  const [pendingOnly, setPendingOnly] = useState(false);

  // Data Tables
  const [ncr_data_table, setNCRDataTable] = useState<Array<NCR_DATA>>([]);
  const [holdingdatatable, setHoldingDataTable] = useState<Array<HOLDDING_BY_NCR_ID>>([]);
  const [selectedNCR, setSelectedNCR] = useState<NCR_DATA | null>(null);
  const selectedRowsData = useRef<Array<NCR_DATA>>([]);
  const clickedrow = useRef<NCR_DATA | null>(null);

  // Search Filter States
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [vendor, setVendor] = useState("");
  const [m_name, setM_Name] = useState("");
  const [m_code, setM_Code] = useState("");
  const [cmsLOT, setCMSLOT] = useState("");
  const [vendorLot, setVendorLot] = useState("");

  // New NCR Registration States
  const [cmsLot, setCmsLot] = useState("");
  const [iqc_empl, setIQC_Empl] = useState(getUserData()?.EMPL_NO || "");
  const [empl_name, setEmplName] = useState("");
  const [remark, setReMark] = useState("");
  const [width_cd, setWidthCD] = useState(0);
  const [in_cfm_qty, setInCFMQTY] = useState(0);
  const [roll_qty, setRollQty] = useState(0);
  const [cust_cd, setCust_Cd] = useState("");
  const [cust_name_kd, setCust_Name_KD] = useState("");
  const [exp_date, setEXP_DATE] = useState(moment().format("YYYY-MM-DD"));
  const [ncr_date, setNCR_DATE] = useState(moment().format("YYYY-MM-DD"));
  const [response_date, setRESPONSE_DATE] = useState(moment().format("YYYY-MM-DD"));
  const [total_qty, setTotal_QTY] = useState(0);
  const [total_roll, setTotal_ROLL] = useState(0);
  const [defect_title, setDefect_Title] = useState("");
  const [defect_detail, setDefect_Detail] = useState("");

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  // API 1: Tra cứu Holding Data theo NCR_ID
  const handletraHoldingData = useCallback((ncrDataRow: NCR_DATA) => {
    generalQuery("loadHoldingMaterialByNCR_ID", {
      NCR_ID: ncrDataRow.NCR_ID,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: HOLDDING_BY_NCR_ID[] = response.data.data.map(
            (element: HOLDDING_BY_NCR_ID, index: number) => ({
              ...element,
              id: index,
            })
          );
          setHoldingDataTable(loadeddata);
        } else {
          setHoldingDataTable([]);
        }
      })
      .catch((error) => {
        console.error(error);
        setHoldingDataTable([]);
      });
  }, []);

  // API 2: Tra cứu NCR Data
  const handletraNCRData = useCallback(() => {
    generalQuery("loadNCRData", {
      M_CODE: m_code.trim(),
      M_NAME: m_name.trim(),
      LOTNCC: vendorLot.trim(),
      FROM_DATE: fromdate,
      TO_DATE: todate,
      VENDOR_NAME: vendor.trim(),
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: NCR_DATA[] = response.data.data.map(
            (element: NCR_DATA, index: number) => ({
              ...element,
              NCR_DATE: element.NCR_DATE === null ? "" : moment(element.NCR_DATE).utc().format("YYYY-MM-DD"),
              RESPONSE_REQ_DATE: element.RESPONSE_REQ_DATE === null ? "" : moment(element.RESPONSE_REQ_DATE).utc().format("YYYY-MM-DD"),
              INS_DATE: element.INS_DATE === null ? "" : moment(element.INS_DATE).utc().format("YYYY-MM-DD HH:mm:ss"),
              UPD_DATE: element.UPD_DATE === null ? "" : moment(element.UPD_DATE).utc().format("YYYY-MM-DD HH:mm:ss"),
              id: index,
            })
          );
          setNCRDataTable(loadeddata);
          setIsNewRegister(false);
          setSelectedNCR(null);
          setHoldingDataTable([]);
          Swal.fire("Thông báo", "Đã load: " + loadeddata.length + " dòng", "success");
        } else {
          Swal.fire("Thông báo", "Không có dữ liệu phù hợp", "info");
        }
      })
      .catch((error) => {
        console.error(error);
        Swal.fire("Lỗi", "Không thể tải dữ liệu NCR", "error");
      });
  }, [fromdate, todate, m_code, m_name, vendor, vendorLot]);

  // API 3: Cập nhật Process Status ('Y' = COMPLETED, 'P' = PENDING)
  const handleSetProcessStatus = useCallback(async (status: "Y" | "P") => {
    const selected = selectedRowsData.current;
    if (selected.length === 0) {
      Swal.fire("Thông báo", "Vui lòng chọn ít nhất 1 NCR để cập nhật", "warning");
      return;
    }

    checkBP(userData, ["QC"], ["Leader", "Dept Staff", "Sub Leader"], ["ALL"], async () => {
      let successCount = 0;
      let errCount = 0;

      for (const row of selected) {
        try {
          const response = await generalQuery("update_ncr_process_status", {
            NCR_ID: row.NCR_ID,
            process_status: status,
          });
          if (response.data.tk_status !== "NG") {
            successCount++;
          } else {
            errCount++;
          }
        } catch (error) {
          console.error(error);
          errCount++;
        }
      }

      if (successCount > 0) {
        Swal.fire("Thông báo", `Đã cập nhật ${successCount} NCR thành công`, "success");
        const updatedIds = selected.map((r) => r.NCR_ID);
        setNCRDataTable((prev) =>
          prev.map((element) => {
            if (updatedIds.includes(element.NCR_ID)) {
              return { ...element, PROCESS_STATUS: status };
            }
            return element;
          })
        );
        setSelectedNCR((prev) =>
          prev && updatedIds.includes(prev.NCR_ID) ? { ...prev, PROCESS_STATUS: status } : prev
        );
      }
      if (errCount > 0) {
        Swal.fire("Lỗi", `Cập nhật ${errCount} NCR thất bại`, "error");
      }
    });
  }, [userData]);

  // API 4: Kiểm tra tên nhân viên theo mã
  const checkEMPL_NAME = useCallback((EMPL_NO: string) => {
    generalQuery("checkEMPL_NO_mobile", { EMPL_NO })
      .then((response) => {
        if (response.data.tk_status !== "NG" && response.data.data.length > 0) {
          setEmplName(response.data.data[0].MIDLAST_NAME + " " + response.data.data[0].FIRST_NAME);
        } else {
          setEmplName("");
        }
      })
      .catch((error) => {
        console.error(error);
        setEmplName("");
      });
  }, []);

  // API 5: Kiểm tra thông tin Lot NVL ERP
  const checkLotNVL = useCallback((M_LOT_NO: string) => {
    generalQuery("checkMNAMEfromLotI222", { M_LOT_NO })
      .then((response) => {
        if (response.data.tk_status !== "NG" && response.data.data.length > 0) {
          const first = response.data.data[0];
          setM_Name(first.M_NAME);
          setVendor(first.CUST_NAME_KD);
          setM_Code(first.M_CODE);
          setWidthCD(first.WIDTH_CD);
          setInCFMQTY(first.OUT_CFM_QTY);
          setRollQty(first.ROLL_QTY);
          setCust_Cd(first.CUST_CD);
          setCust_Name_KD(first.CUST_NAME_KD);
          setVendorLot(first.LOTNCC);
          setEXP_DATE(moment(first.EXP_DATE).format("YYYY-MM-DD"));

          generalQuery("checkMNAMEfromLotI222Total", {
            M_CODE: first.M_CODE,
            LOTCMS: M_LOT_NO.substring(0, 6),
          })
            .then((resTotal) => {
              if (resTotal.data.tk_status !== "NG" && resTotal.data.data.length > 0) {
                setTotal_QTY(resTotal.data.data[0].TOTAL_CFM_QTY);
                setTotal_ROLL(resTotal.data.data[0].TOTAL_ROLL);
              } else {
                setTotal_QTY(0);
                setTotal_ROLL(0);
              }
            })
            .catch(() => {
              setTotal_QTY(0);
              setTotal_ROLL(0);
            });
        } else {
          setVendor("");
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
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // Kiểm tra tính hợp lệ trước khi Add
  const checkInput = useCallback((): boolean => {
    return (
      cmsLot !== "" &&
      iqc_empl !== "" &&
      ncr_date !== "" &&
      response_date !== "" &&
      cust_cd !== "" &&
      m_name !== "" &&
      vendorLot !== "" &&
      defect_title !== "" &&
      defect_detail !== ""
    );
  }, [cmsLot, iqc_empl, ncr_date, response_date, cust_cd, m_name, vendorLot, defect_title, defect_detail]);

  // Thêm dòng mới vào bảng ncr_data_table
  const addRow = useCallback(async () => {
    if (!checkInput()) {
      Swal.fire("Thông báo", "Hãy nhập đủ thông tin trước khi đăng ký", "error");
      return;
    }
    const temp_row: NCR_DATA = {
      NCR_ID: ncr_data_table.length > 0 ? Math.max(...ncr_data_table.map((row) => row.NCR_ID)) + 1 : 0,
      FACTORY: "NM1",
      NCR_NO: getCompany() + "1-" + moment().format("YYYYMMDD"),
      NCR_DATE: ncr_date,
      RESPONSE_REQ_DATE: response_date,
      CUST_CD: cust_cd,
      VENDOR: vendor,
      M_CODE: m_code,
      WIDTH_CD: width_cd,
      M_NAME: m_name,
      CMS_LOT: cmsLot,
      VENDOR_LOT: vendorLot,
      DEFECT_TITLE: defect_title,
      DEFECT_DETAIL: defect_detail,
      DEFECT_IMAGE: "P",
      PROCESS_STATUS: "P",
      USE_YN: "Y",
      INS_DATE: moment().format("YYYY-MM-DD HH:mm:ss"),
      INS_EMPL: iqc_empl,
      UPD_DATE: moment().format("YYYY-MM-DD HH:mm:ss"),
      UPD_EMPL: iqc_empl,
      REMARK: remark,
      COUNTERMEASURE: "N",
      COUNTERMEASURE_EXT: "",
    };
    setNCRDataTable((prev) => [...prev, temp_row]);
    Swal.fire("Thông báo", "Đã thêm 1 dòng vào danh sách đăng ký", "success");
  }, [
    checkInput,
    ncr_data_table,
    ncr_date,
    response_date,
    cust_cd,
    vendor,
    m_code,
    width_cd,
    m_name,
    cmsLot,
    vendorLot,
    defect_title,
    defect_detail,
    iqc_empl,
    remark,
  ]);

  // Lưu toàn bộ data NCR vào Database
  const insertNCRData = useCallback(async () => {
    if (ncr_data_table.length > 0) {
      let err_code = "";
      for (let i = 0; i < ncr_data_table.length; i++) {
        try {
          const response = await generalQuery("insertNCRData", ncr_data_table[i]);
          if (response.data.tk_status === "NG") {
            err_code += "Lỗi : " + response.data.message + " | ";
          }
        } catch (error: any) {
          err_code += "Lỗi mạng: " + error.message + " | ";
        }
      }
      if (err_code === "") {
        Swal.fire("Thông báo", "Thêm data thành công", "success");
      } else {
        Swal.fire("Thông báo", "Lỗi: " + err_code, "error");
      }
    } else {
      Swal.fire("Thông báo", "Thêm ít nhất 1 dòng để lưu", "error");
    }
  }, [ncr_data_table]);

  // Upload Ảnh Lỗi
  const handleDefectImageUpload = useCallback(
    async (file: File, ncrId: number) => {
      checkBP(userData, ["QC"], ["Leader", "Dept Staff", "Sub Leader"], ["ALL"], async () => {
        try {
          const resUpload = await uploadQuery(file, "NCR_" + ncrId + ".png", "ncrimage");
          if (resUpload.data.tk_status !== "NG") {
            const resUpdate = await generalQuery("update_ncr_image", {
              NCR_ID: ncrId,
              imagevalue: "Y",
            });
            if (resUpdate.data.tk_status !== "NG") {
              Swal.fire("Thông báo", "Upload ảnh thành công", "success");
              setNCRDataTable((prev) =>
                prev.map((el) => (el.NCR_ID === ncrId ? { ...el, DEFECT_IMAGE: "Y" } : el))
              );
              setSelectedNCR((prev) =>
                prev && prev.NCR_ID === ncrId ? { ...prev, DEFECT_IMAGE: "Y" } : prev
              );
            } else {
              Swal.fire("Thông báo", "Upload ảnh thất bại", "error");
            }
          } else {
            Swal.fire("Thông báo", "Upload ảnh thất bại: " + resUpload.data.message, "error");
          }
        } catch (error) {
          console.error(error);
          Swal.fire("Lỗi", "Không thể upload ảnh", "error");
        }
      });
    },
    [userData]
  );

  // Upload File Đối Sách (Countermeasure)
  const handleCountermeasureUpload = useCallback(
    async (file: File, ncrId: number) => {
      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      const allowedExtensions = ["pdf", "pptx", "docx", "xlsx"];
      if (!allowedExtensions.includes(ext)) {
        Swal.fire("Thông báo", "Chỉ cho phép upload file dạng pdf, pptx, docx, xlsx", "error");
        return;
      }

      checkBP(userData, ["QC"], ["Leader", "Dept Staff", "Sub Leader"], ["ALL"], async () => {
        try {
          const resUpload = await uploadQuery(file, "NCR_" + ncrId + "." + ext, "ncrimage");
          if (resUpload.data.tk_status !== "NG") {
            const resUpdate = await generalQuery("update_ncr_countermeasure", {
              NCR_ID: ncrId,
              countermeasure: "Y",
              countermeasure_ext: ext,
            });
            if (resUpdate.data.tk_status !== "NG") {
              Swal.fire("Thông báo", "Upload đối sách thành công", "success");
              setNCRDataTable((prev) =>
                prev.map((el) =>
                  el.NCR_ID === ncrId ? { ...el, COUNTERMEASURE: "Y", COUNTERMEASURE_EXT: ext } : el
                )
              );
              setSelectedNCR((prev) =>
                prev && prev.NCR_ID === ncrId
                  ? { ...prev, COUNTERMEASURE: "Y", COUNTERMEASURE_EXT: ext }
                  : prev
              );
            } else {
              Swal.fire("Thông báo", "Cập nhật đối sách thất bại", "error");
            }
          } else {
            Swal.fire("Thông báo", "Upload file thất bại: " + resUpload.data.message, "error");
          }
        } catch (error) {
          console.error(error);
          Swal.fire("Lỗi", "Không thể upload đối sách", "error");
        }
      });
    },
    [userData]
  );

  // Chuyển sang form đăng ký mới
  const handleStartNewRegister = useCallback(() => {
    setNCRDataTable([]);
    setIsNewRegister(true);
    setVendor("");
    setVendorLot("");
    setM_Code("");
    setM_Name("");
    setCmsLot("");
    setDefect_Title("");
    setDefect_Detail("");
    setReMark("");
  }, []);

  // Xuất Excel NCR Table
  const handleExportExcel = useCallback(
    (type: 1 | 2) => {
      const dataToExport =
        type === 1
          ? ncr_data_table.filter((r) => {
              if (pendingOnly && r.PROCESS_STATUS === "Y") return false;
              if (!quickFilterText.trim()) return true;
              const q = quickFilterText.toLowerCase();
              return (
                r.M_NAME?.toLowerCase().includes(q) ||
                r.M_CODE?.toLowerCase().includes(q) ||
                r.VENDOR?.toLowerCase().includes(q) ||
                r.CMS_LOT?.toLowerCase().includes(q) ||
                r.VENDOR_LOT?.toLowerCase().includes(q) ||
                r.DEFECT_TITLE?.toLowerCase().includes(q) ||
                String(r.NCR_ID ?? "").includes(q)
              );
            })
          : ncr_data_table;

      if (dataToExport.length === 0) {
        Swal.fire("Thông báo", "Không có dữ liệu để xuất Excel", "warning");
        return;
      }
      SaveExcel(dataToExport, `NCR_DATA_${moment().format("YYYYMMDD_HHmmss")}`);
    },
    [ncr_data_table, pendingOnly, quickFilterText]
  );

  // Xuất Excel Holding Detail Table
  const handleExportHoldingExcel = useCallback(
    (type: 1 | 2) => {
      if (holdingdatatable.length === 0) {
        Swal.fire("Thông báo", "Không có dữ liệu holding để xuất Excel", "warning");
        return;
      }
      SaveExcel(holdingdatatable, `NCR_HOLDING_${selectedNCR?.NCR_ID ?? "DETAIL"}_${moment().format("YYYYMMDD_HHmmss")}`);
    },
    [holdingdatatable, selectedNCR]
  );

  // Realtime KPIs
  const kpiStats = useMemo(() => {
    const total = ncr_data_table.length;
    const completed = ncr_data_table.filter((r) => r.PROCESS_STATUS === "Y").length;
    const completedPercent = total > 0 ? ((completed / total) * 100).toFixed(1) : "0.0";
    const pending = total - completed;
    const totalRollHold = holdingdatatable.reduce((acc, r) => acc + (Number(r.TOTAL_HOLDING_ROLL) || 0), 0);
    const totalMHold = holdingdatatable.reduce((acc, r) => acc + (Number(r.TOTAL_HOLDING_M) || 0), 0);

    return {
      total,
      completed,
      completedPercent,
      pending,
      totalRollHold,
      totalMHold,
    };
  }, [ncr_data_table, holdingdatatable]);

  // Khởi tạo tra tên nhân viên ban đầu
  useEffect(() => {
    if (iqc_empl && iqc_empl.length >= 7) {
      checkEMPL_NAME(iqc_empl);
    }
  }, [iqc_empl, checkEMPL_NAME]);

  return {
    userData,
    isFullscreen,
    toggleFullscreen,
    isNewRegister,
    setIsNewRegister,
    quickFilterText,
    setQuickFilterText,
    pendingOnly,
    setPendingOnly,

    // Tables
    ncr_data_table,
    setNCRDataTable,
    holdingdatatable,
    setHoldingDataTable,
    selectedNCR,
    setSelectedNCR,
    selectedRowsData,
    clickedrow,

    // Filters
    fromdate,
    setFromDate,
    todate,
    setToDate,
    vendor,
    setVendor,
    m_name,
    setM_Name,
    m_code,
    setM_Code,
    cmsLOT,
    setCMSLOT,
    vendorLot,
    setVendorLot,

    // New Input States
    cmsLot,
    setCmsLot,
    iqc_empl,
    setIQC_Empl,
    empl_name,
    remark,
    setReMark,
    width_cd,
    in_cfm_qty,
    roll_qty,
    exp_date,
    ncr_date,
    setNCR_DATE,
    response_date,
    setRESPONSE_DATE,
    total_qty,
    total_roll,
    defect_title,
    setDefect_Title,
    defect_detail,
    setDefect_Detail,

    // Actions
    handletraNCRData,
    handletraHoldingData,
    handleSetProcessStatus,
    checkLotNVL,
    checkEMPL_NAME,
    addRow,
    insertNCRData,
    handleDefectImageUpload,
    handleCountermeasureUpload,
    handleStartNewRegister,
    handleExportExcel,
    handleExportHoldingExcel,
    kpiStats,
  };
};

export type UseNCRDataReturn = ReturnType<typeof useNCRData>;

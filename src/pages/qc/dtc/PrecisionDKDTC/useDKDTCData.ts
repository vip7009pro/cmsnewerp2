import { useState, useEffect, useMemo, useCallback } from "react";
import Swal from "sweetalert2";
import moment from "moment";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { UserData } from "../../../../api/GlobalInterface";
import { generalQuery, getAuditMode, getUserData } from "../../../../api/Api";
import { CheckAddedSPECDATA, DTC_REG_DATA, TestListTable } from "../../interfaces/qcInterface";
import { f_loadDTC_TestList } from "../../utils/qcUtils";
import { SaveExcel } from "../../../../api/services/excelService";

export const useDKDTCData = () => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );

  const [testtype, setTestType] = useState<string>("3");
  const [inputno, setInputNo] = useState<string>("");
  const [checkNVL, setCheckNVL] = useState<boolean>(
    userData?.SUBDEPTNAME === "IQC" ? true : false
  );
  const [request_empl, setRequestEmpl] = useState<string>(
    getUserData()?.EMPL_NO || ""
  );
  const [remark, setRemark] = useState<string>("");
  const [testList, setTestList] = useState<TestListTable[]>([]);
  const [testedCODE, setTestedCode] = useState<number[]>([]);
  const [inspectiondatatable, setInspectionDataTable] = useState<DTC_REG_DATA[]>([]);
  const [empl_name, setEmplName] = useState<string>("");
  const [reqDeptCode, setReqDeptCode] = useState<string>("");
  const [showdkbs, setShowDKBS] = useState<boolean>(false);
  const [oldDTC_ID, setOldDTC_ID] = useState<number>(-1);
  const [g_name, setGName] = useState<string>("");
  const [g_code, setGCode] = useState<string>("");
  const [m_name, setM_Name] = useState<string>("");
  const [m_code, setM_Code] = useState<string>("");
  const [cust_cd, setCust_CD] = useState<string>("");
  const [prodrequestno, setProdRequestNo] = useState<string>("");
  const [prodreqdate, setProdReqDate] = useState<string>("");
  const [addedSpec, setAddedSpec] = useState<CheckAddedSPECDATA[]>([]);
  const [lotncc, setLotNCC] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Scanner modal state
  const [scannerOpen, setScannerOpen] = useState<boolean>(false);
  const [scannerTarget, setScannerTarget] = useState<"inputno" | "lotncc">("inputno");

  // Load danh sách các hạng mục test ĐTC
  const getTestList = useCallback(async () => {
    try {
      const tempList: TestListTable[] = await f_loadDTC_TestList();
      setTestList(tempList);
    } catch (err) {
      console.error("Error loading test list:", err);
    }
  }, []);

  // Tải bảng danh sách đăng ký gần nhất
  const handletraDTCData = useCallback(() => {
    generalQuery("loadrecentRegisteredDTCData", {})
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: DTC_REG_DATA[] = response.data.data.map(
            (element: DTC_REG_DATA, index: number) => ({
              ...element,
              G_NAME:
                getAuditMode() === 0
                  ? element.G_NAME
                  : element.G_NAME?.search("CNDB") === -1
                  ? element.G_NAME
                  : "TEM_NOI_BO",
              TEST_FINISH_TIME:
                element.TEST_FINISH_TIME === "1900-01-01T00:00:00.000Z" ||
                element.TEST_FINISH_TIME === null
                  ? ""
                  : moment(element.TEST_FINISH_TIME)
                      .utc()
                      .format("YYYY-MM-DD HH:mm:ss"),
              REQUEST_DATETIME:
                element.REQUEST_DATETIME === "1900-01-01T00:00:00.000Z" ||
                element.REQUEST_DATETIME === null
                  ? ""
                  : moment(element.REQUEST_DATETIME)
                      .utc()
                      .format("YYYY-MM-DD HH:mm:ss"),
              id: index,
            })
          );
          setInspectionDataTable(loadeddata);
        }
      })
      .catch((error) => {
        console.error("Error loadrecentRegisteredDTCData:", error);
      });
  }, []);

  // Kiểm tra tên nhân viên yêu cầu
  const checkEMPL_NAME = useCallback((emplNo: string) => {
    generalQuery("checkEMPL_NO_mobile", { EMPL_NO: emplNo })
      .then((response) => {
        if (response.data.tk_status !== "NG" && response.data.data?.length > 0) {
          const emp = response.data.data[0];
          setEmplName(`${emp.MIDLAST_NAME} ${emp.FIRST_NAME}`);
          setReqDeptCode(emp.WORK_POSITION_CODE);
        } else {
          setEmplName("");
          setReqDeptCode("");
        }
      })
      .catch((error) => {
        console.error("Error checkEMPL_NAME:", error);
      });
  }, []);

  // Kiểm tra Spec đã thêm cho mã hàng / mã liệu
  const checkAddedSpec = useCallback((mCode?: string, gCode?: string) => {
    generalQuery("checkAddedSpec", {
      M_CODE: checkNVL ? mCode : "B0000035",
      G_CODE: checkNVL ? "7A07540A" : gCode,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          setAddedSpec(response.data.data || []);
        }
      })
      .catch((error) => {
        console.error("Error checkAddedSpec:", error);
      });
  }, [checkNVL]);

  // Kiểm tra YCSX
  const checkYCSX = useCallback((reqNo: string) => {
    generalQuery("ycsx_fullinfo", { PROD_REQUEST_NO: reqNo })
      .then((response) => {
        if (response.data.tk_status !== "NG" && response.data.data?.length > 0) {
          const item = response.data.data[0];
          setProdRequestNo(reqNo);
          setGName(item.G_NAME);
          setProdReqDate(item.PROD_REQUEST_DATE);
          setGCode(item.G_CODE);
          checkAddedSpec("", item.G_CODE);
        } else {
          setProdRequestNo("");
          setGName("");
          setProdReqDate("");
          setGCode("");
        }
      })
      .catch((error) => {
        console.error("Error checkYCSX:", error);
      });
  }, [checkAddedSpec]);

  // Kiểm tra Label ID
  const checkLabelID = useCallback((labelId: string) => {
    generalQuery("checkLabelID2", { LABEL_ID2: labelId })
      .then((response) => {
        if (response.data.tk_status !== "NG" && response.data.data?.length > 0) {
          const item = response.data.data[0];
          setProdRequestNo(item.PROD_REQUEST_NO);
          setGName(item.G_NAME);
          setProdReqDate(item.PROD_REQUEST_DATE);
          setGCode(item.G_CODE);
          checkAddedSpec("", item.G_CODE);
        } else {
          setProdRequestNo("");
          setGName("");
          setProdReqDate("");
          setGCode("");
        }
      })
      .catch((error) => {
        console.error("Error checkLabelID:", error);
      });
  }, [checkAddedSpec]);

  // Tải lịch sử test theo M_CODE
  const getTestedCodeByM_CODE = useCallback(async (mCode: string) => {
    try {
      const response = await generalQuery("lichSuTestM_CODE", { M_CODE: mCode });
      let tested_code_list: any[] = [];
      if (response.data.tk_status !== "NG" && response.data.data?.length > 0) {
        tested_code_list = response.data.data.map((item: any) => item.TEST_CODE);
      }
      const tempList: TestListTable[] = await f_loadDTC_TestList();
      const temp_testList = tempList.map((el) => ({
        ...el,
        CHECKADDED: false,
        SELECTED: tested_code_list.includes(el.TEST_CODE),
      }));
      setTestList(temp_testList);
      setTestedCode(tested_code_list);
    } catch (err) {
      console.error("Error getTestedCodeByM_CODE:", err);
    }
  }, []);

  // Kiểm tra Lot NVL
  const checkLotNVL = useCallback((mLotNo: string) => {
    generalQuery("checkMNAMEfromLotI222", { M_LOT_NO: mLotNo })
      .then(async (response) => {
        if (response.data.tk_status !== "NG" && response.data.data?.length > 0) {
          const item = response.data.data[0];
          setM_Name(`${item.M_NAME} | ${item.WIDTH_CD}`);
          setM_Code(item.M_CODE);
          setCust_CD(item.CUST_CD);
          setLotNCC(item.LOTNCC || "");
          checkAddedSpec(item.M_CODE, "");
          getTestedCodeByM_CODE(item.M_CODE);
        } else {
          setM_Name("");
          setM_Code("");
          setCust_CD("");
          setLotNCC("");
        }
      })
      .catch((error) => {
        console.error("Error checkLotNVL:", error);
      });
  }, [checkAddedSpec, getTestedCodeByM_CODE]);

  // Input change handler
  const handleInputChange = useCallback((val: string) => {
    setInputNo(val);
    if (val.length >= 7) {
      if (checkNVL) {
        checkLotNVL(val);
      } else {
        if (val.length === 7) {
          checkYCSX(val);
        } else if (val.length >= 8) {
          checkLabelID(val);
        }
      }
    } else {
      setAddedSpec([]);
    }
  }, [checkNVL, checkLotNVL, checkYCSX, checkLabelID]);

  // Toggle hạng mục test
  const handleToggleTestItem = useCallback((testCode: number) => {
    const selected_test = addedSpec.filter(
      (element) => element.TEST_CODE === testCode
    );

    if (
      selected_test.length > 0 &&
      selected_test[0].CHECKADDED === null &&
      checkNVL === false
    ) {
      Swal.fire(
        "Chưa có SPEC",
        "Hạng mục này chưa được khai báo SPEC kỹ thuật, vui lòng thêm SPEC trước khi đăng ký.",
        "warning"
      );
      return;
    }

    setTestList((prev) =>
      prev.map((el) =>
        el.TEST_CODE === testCode ? { ...el, SELECTED: !el.SELECTED } : el
      )
    );
  }, [addedSpec, checkNVL]);

  // Chọn tất cả / Bỏ chọn tất cả hạng mục
  const handleSelectAllTests = useCallback((select: boolean) => {
    setTestList((prev) =>
      prev.map((el) => ({ ...el, SELECTED: select }))
    );
  }, []);

  // Lấy Last DTC ID
  const getLastDTC_ID = useCallback(async (): Promise<number> => {
    try {
      const response = await generalQuery("getLastDTCID", {});
      if (response.data.tk_status !== "NG" && response.data.data?.length > 0) {
        return response.data.data[0].LAST_DCT_ID + 1;
      }
    } catch (err) {
      console.error("Error getLastDTCID:", err);
    }
    return 1;
  }, []);

  // Kiểm tra DTC_ID theo M_LOT_NO
  const getDTC_ID_by_M_LOT_NO = useCallback(async (mLotNo: string): Promise<number> => {
    try {
      const response = await generalQuery("checkDTC_ID_FROM_M_LOT_NO", { M_LOT_NO: mLotNo });
      if (response.data.tk_status !== "NG" && response.data.data?.length > 0) {
        return response.data.data[0].DTC_ID;
      }
    } catch (err) {
      console.error("Error getDTC_ID_by_M_LOT_NO:", err);
    }
    return -1;
  }, []);

  // Kiểm tra tồn tại Lot và Test Code
  const isM_LOT_NO_AND_TEST_CODE_EXIST = useCallback(async (mLotNo: string, testCode: number): Promise<boolean> => {
    try {
      const response = await generalQuery("checkDTC_M_LOT_NO_TEST_CODE_REG", {
        M_LOT_NO: mLotNo,
        TEST_CODE: testCode,
      });
      return response.data.tk_status !== "NG" && response.data.data?.length > 0;
    } catch {
      return false;
    }
  }, []);

  // Đăng ký TEST
  const registerDTC = useCallback(async () => {
    if (!inputno || !request_empl) {
      Swal.fire("Thiếu thông tin", "Vui lòng điền đủ mã YCSX/LOT và NV yêu cầu", "warning");
      return;
    }

    const selectedTests = testList.filter((t) => t.SELECTED);
    if (selectedTests.length === 0) {
      Swal.fire("Chưa chọn hạng mục", "Vui lòng chọn ít nhất 1 hạng mục test", "warning");
      return;
    }

    let err_code = "";
    let nextDTC_ID = await getLastDTC_ID();
    if (checkNVL) {
      const oldID = await getDTC_ID_by_M_LOT_NO(inputno);
      if (oldID !== -1) {
        nextDTC_ID = oldID;
      }
    }

    const final_ID = showdkbs ? oldDTC_ID : nextDTC_ID;

    for (let i = 0; i < selectedTests.length; i++) {
      const t = selectedTests[i];
      const data = {
        DTC_ID: final_ID,
        TEST_CODE: t.TEST_CODE,
        TEST_TYPE_CODE: testtype,
        REQUEST_DEPT_CODE: userData?.WORK_POSITION_CODE,
        PROD_REQUEST_NO: checkNVL ? "1IG0008" : prodrequestno,
        M_LOT_NO: checkNVL ? inputno : "2101011325",
        PROD_REQUEST_DATE: checkNVL ? "20210916" : prodreqdate,
        REQUEST_EMPL_NO: request_empl,
        REMARK: remark,
        G_CODE: checkNVL ? "7A07540A" : g_code,
        M_CODE: checkNVL ? m_code : "B0000035",
      };

      if (checkNVL && (await isM_LOT_NO_AND_TEST_CODE_EXIST(data.M_LOT_NO, data.TEST_CODE))) {
        continue;
      }

      try {
        const response = await generalQuery("registerDTCTest", data);
        if (response.data.tk_status === "NG") {
          err_code += ` ${response.data.message || ""}`;
        }
      } catch (err: any) {
        err_code += ` Lỗi kết nối: ${err?.message || ""}`;
      }
    }

    if (err_code === "") {
      if (getUserData()?.SUBDEPTNAME?.includes("IQC")) {
        generalQuery("insertIQC1table", {
          M_CODE: m_code,
          M_LOT_NO: inputno,
          LOT_CMS: inputno.substring(0, 6),
          LOT_VENDOR: lotncc,
          CUST_CD: cust_cd,
          EXP_DATE: "",
          INPUT_LENGTH: 0,
          TOTAL_ROLL: 0,
          NQ_CHECK_ROLL: 0,
          DTC_ID: final_ID,
          TEST_EMPL: getUserData()?.EMPL_NO,
          REMARK: "",
        }).catch(() => {});
      }

      Swal.fire({
        icon: "success",
        title: "Đăng ký thành công",
        text: `Mã ID Test ĐTC đã khởi tạo: ${final_ID}`,
        timer: 2500,
      });

      setGCode("");
      setGName("");
      setRemark("");
      handletraDTCData();
    } else {
      Swal.fire("Đăng ký thất bại", err_code, "error");
    }
  }, [
    inputno,
    request_empl,
    testList,
    checkNVL,
    showdkbs,
    oldDTC_ID,
    getLastDTC_ID,
    getDTC_ID_by_M_LOT_NO,
    testtype,
    userData,
    prodrequestno,
    prodreqdate,
    remark,
    g_code,
    m_code,
    isM_LOT_NO_AND_TEST_CODE_EXIST,
    lotncc,
    cust_cd,
    handletraDTCData,
  ]);

  // Bộ lọc dữ liệu bảng
  const filteredData = useMemo(() => {
    if (!searchTerm) return inspectiondatatable;
    const term = searchTerm.toLowerCase().trim();
    return inspectiondatatable.filter(
      (item) =>
        item.DTC_ID?.toString().toLowerCase().includes(term) ||
        item.TEST_NAME?.toLowerCase().includes(term) ||
        item.PROD_REQUEST_NO?.toLowerCase().includes(term) ||
        item.G_NAME?.toLowerCase().includes(term) ||
        item.M_NAME?.toLowerCase().includes(term) ||
        item.REQUEST_EMPL_NO?.toLowerCase().includes(term) ||
        item.LOTCMS?.toLowerCase().includes(term)
    );
  }, [inspectiondatatable, searchTerm]);

  // Thống kê KPI micro
  const kpis = useMemo(() => {
    const total = inspectiondatatable.length;
    const finished = inspectiondatatable.filter((item) => Boolean(item.TEST_FINISH_TIME)).length;
    const massProd = inspectiondatatable.filter((item) => item.TEST_TYPE_NAME?.includes("MASS")).length;
    const selectedTestsCount = testList.filter((t) => t.SELECTED).length;

    return {
      total,
      finished,
      massProd,
      selectedTestsCount,
    };
  }, [inspectiondatatable, testList]);

  // Xuất Excel EX1 (Đang lọc)
  const handleExportEX1 = useCallback(() => {
    if (filteredData.length === 0) {
      Swal.fire("Không có dữ liệu", "Danh sách đang lọc hiện tại đang rỗng", "info");
      return;
    }
    SaveExcel(filteredData, `DKDTC_Filter_${moment().format("YYYYMMDD_HHmm")}`);
  }, [filteredData]);

  // Xuất Excel EX2 (Toàn bộ)
  const handleExportEX2 = useCallback(() => {
    if (inspectiondatatable.length === 0) {
      Swal.fire("Không có dữ liệu", "Danh sách toàn bộ hiện tại đang rỗng", "info");
      return;
    }
    SaveExcel(inspectiondatatable, `DKDTC_All_${moment().format("YYYYMMDD_HHmm")}`);
  }, [inspectiondatatable]);

  // Xử lý quét mã vạch thành công từ Camera
  const handleScanSuccess = useCallback(
    (decodedText: string) => {
      if (scannerTarget === "lotncc") {
        setLotNCC(decodedText);
      } else {
        handleInputChange(decodedText);
      }
    },
    [scannerTarget, handleInputChange]
  );

  // Khởi tạo
  useEffect(() => {
    handletraDTCData();
    getTestList();
    if (getUserData()?.EMPL_NO) {
      checkEMPL_NAME(getUserData()?.EMPL_NO || "");
    }
  }, [handletraDTCData, getTestList, checkEMPL_NAME]);

  return {
    testtype,
    setTestType,
    inputno,
    setInputNo: handleInputChange,
    checkNVL,
    setCheckNVL,
    request_empl,
    setRequestEmpl,
    remark,
    setRemark,
    testList,
    inspectiondatatable: filteredData,
    allDataTable: inspectiondatatable,
    empl_name,
    reqDeptCode,
    showdkbs,
    setShowDKBS,
    oldDTC_ID,
    setOldDTC_ID,
    g_name,
    g_code,
    m_name,
    m_code,
    lotncc,
    setLotNCC,
    searchTerm,
    setSearchTerm,
    scannerOpen,
    setScannerOpen,
    scannerTarget,
    setScannerTarget,
    kpis,
    addedSpec,
    handleToggleTestItem,
    handleSelectAllTests,
    handletraDTCData,
    registerDTC,
    handleExportExcel: handleExportEX1,
    handleExportEX1,
    handleExportEX2,
    handleScanSuccess,
    checkEMPL_NAME,
  };
};

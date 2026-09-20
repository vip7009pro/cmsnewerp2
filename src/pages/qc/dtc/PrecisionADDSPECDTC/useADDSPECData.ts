import { useEffect, useRef, useState, useTransition } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import Swal from "sweetalert2";
import { RootState } from "../../../../redux/store";
import { generalQuery, getAuditMode } from "../../../../api/Api";
import { UserData } from "../../../../api/GlobalInterface";
import { CheckAddedSPECDATA, DTC_ADD_SPEC_DATA, MaterialListData, TestListTable } from "../../interfaces/qcInterface";
import { CodeListData } from "../../../kinhdoanh/interfaces/kdInterface";
import { f_loadDTC_TestList } from "../../utils/qcUtils";

export const useADDSPECData = () => {
  const userData: UserData | undefined = useSelector((state: RootState) => state.totalSlice.userData);

  const [testList, setTestList] = useState<TestListTable[]>([]);
  const [addedSpec, setAddedSpec] = useState<CheckAddedSPECDATA[]>([]);
  const [materialList, setMaterialList] = useState<MaterialListData[]>([
    { M_CODE: "A0000001", M_NAME: "#200", WIDTH_CD: 1200 },
  ]);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialListData | null>({
    M_CODE: "A0000001",
    M_NAME: "#200",
    WIDTH_CD: 1200,
  });

  const [isPending, startTransition] = useTransition();
  const [codeList, setCodeList] = useState<CodeListData[]>([]);
  const [selectedCode, setSelectedCode] = useState<CodeListData | null>({
    G_CODE: "7C03925A",
    G_NAME: "GH63-18084A_A_SM-A515F",
    PROD_LAST_PRICE: 0.318346,
    USE_YN: "Y",
  });

  const [fromdate] = useState(moment().format("YYYY-MM-DD"));
  const [todate] = useState(moment().format("YYYY-MM-DD"));
  const [codeKD] = useState("");
  const [testname, setTestName] = useState("0");
  const [testtype] = useState("0");
  const [prodrequestno] = useState("");
  const [checkNVL, setCheckNVL] = useState(userData?.SUBDEPTNAME === "IQC");
  const [id] = useState("");
  const [inspectiondatatable, setInspectionDataTable] = useState<Array<any>>([]);
  const [m_name] = useState("");
  const [quickFilterText, setQuickFilterText] = useState("");
  // Đếm số dòng đang chọn: ref không gây re-render nên cần state riêng cho status bar
  const [selectedCount, setSelectedCount] = useState(0);

  const selectedRowsData = useRef<Array<DTC_ADD_SPEC_DATA>>([]);

  const getcodelist = (G_NAME: string) => {
    generalQuery("selectcodeList", { G_NAME: G_NAME })
      .then((response) => {
        if (response.data.tk_status !== "NG" && !isPending) {
          startTransition(() => {
            setCodeList(response.data.data);
          });
        }
      })
      .catch((error) => console.log(error));
  };

  const getmateriallist = () => {
    generalQuery("getMaterialList", {})
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          setMaterialList(response.data.data);
        }
      })
      .catch((error) => console.log(error));
  };

  const getTestList = async () => {
    const tempList: TestListTable[] = await f_loadDTC_TestList();
    tempList.unshift({ TEST_CODE: 0, TEST_NAME: "ALL", TEST_TIME: null, SELECTED: false });
    setTestList(tempList);
  };

  const checkAddedSpec = (m_code: string | undefined, g_code: string | undefined) => {
    generalQuery("checkAddedSpec", {
      M_CODE: checkNVL ? m_code : "B0000035",
      G_CODE: checkNVL ? "7A07540A" : g_code,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          setAddedSpec(response.data.data);
        }
      })
      .catch((error) => console.log(error));
  };

  const handletraDTCData = (test_name: string) => {
    generalQuery("checkSpecDTC", {
      checkNVL: checkNVL,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      G_CODE: checkNVL ? "" : selectedCode?.G_CODE,
      G_NAME: codeKD,
      M_NAME: m_name,
      M_CODE: checkNVL ? selectedMaterial?.M_CODE : "",
      TEST_NAME: test_name,
      PROD_REQUEST_NO: prodrequestno,
      TEST_TYPE: testtype,
      ID: id,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: DTC_ADD_SPEC_DATA[] = response.data.data.map(
            (element: DTC_ADD_SPEC_DATA, index: number) => ({
              ...element,
              G_NAME:
                getAuditMode() === 0
                  ? element?.G_NAME
                  : element?.G_NAME?.search("CNDB") === -1
                  ? element?.G_NAME
                  : "TEM_NOI_BO",
              id: index,
            })
          );
          setInspectionDataTable(loadeddata);
          Swal.fire("Thông báo", "Đã load " + response.data.data.length + " dòng", "success");
          checkAddedSpec(selectedMaterial?.M_CODE, selectedCode?.G_CODE);
        } else {
          generalQuery("checkSpecDTC2", {
            checkNVL: checkNVL,
            FROM_DATE: fromdate,
            TO_DATE: todate,
            G_CODE: checkNVL ? "" : selectedCode?.G_CODE,
            G_NAME: codeKD,
            M_NAME: m_name,
            M_CODE: checkNVL ? selectedMaterial?.M_CODE : "",
            TEST_NAME: test_name,
            PROD_REQUEST_NO: prodrequestno,
            TEST_TYPE: testtype,
            ID: id,
          })
            .then((res2) => {
              if (res2.data.tk_status !== "NG") {
                const loadeddata: DTC_ADD_SPEC_DATA[] = res2.data.data.map(
                  (element: DTC_ADD_SPEC_DATA, index: number) => ({ ...element, id: index })
                );
                if (checkNVL && test_name === "1") {
                  setInspectionDataTable([loadeddata[0]]);
                  Swal.fire("Thông báo", "Chưa có SPEC, Đã load bảng trắng để nhập 1 dòng", "warning");
                } else {
                  setInspectionDataTable(loadeddata);
                  Swal.fire("Thông báo", "Chưa có SPEC, Đã load bảng trắng để nhập " + res2.data.data.length + " dòng", "warning");
                }
                checkAddedSpec(selectedMaterial?.M_CODE, selectedCode?.G_CODE);
              } else {
                setInspectionDataTable([]);
              }
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((error) => console.log(error));
  };

  const handleInsertSpec = async () => {
    if (testname === "0") {
      Swal.fire("Thông báo", "Hãy chọn một hạng mục test bất kỳ", "error");
      return;
    }
    Swal.fire({
      title: "Insert SPEC",
      text: "Đang Insert SPEC...",
      icon: "info",
      showConfirmButton: false,
      allowOutsideClick: false,
    });

    let err_code = "";
    if (!checkNVL) {
      for (let i = 0; i < inspectiondatatable.length; i++) {
        const item = inspectiondatatable[i];
        const res = await generalQuery("insertSpecDTC", {
          checkNVL,
          G_CODE: selectedCode?.G_CODE,
          M_CODE: "B0000035",
          TEST_CODE: testname,
          POINT_CODE: item.POINT_CODE,
          PRI: item.PRI,
          CENTER_VALUE: item.CENTER_VALUE,
          UPPER_TOR: item.UPPER_TOR,
          LOWER_TOR: item.LOWER_TOR,
          BARCODE_CONTENT: item.BARCODE_CONTENT || "",
          REMARK: item.REMARK || "",
        });
        if (res.data.tk_status === "NG") {
          err_code += ` Lỗi: ${item.TEST_CODE}| ${item.POINT_CODE} : ${res.data.message};`;
        }
      }
    } else {
      const mCodeList = materialList
        .filter((el) => el.M_NAME === selectedMaterial?.M_NAME)
        .map((el2) => ({ M_CODE: el2.M_CODE, WIDTH_CD: el2.WIDTH_CD }));

      for (let j = 0; j < mCodeList.length; j++) {
        for (let i = 0; i < inspectiondatatable.length; i++) {
          const item = inspectiondatatable[i];
          const res = await generalQuery("insertSpecDTC", {
            checkNVL,
            G_CODE: "7A07540A",
            M_CODE: mCodeList[j].M_CODE,
            TEST_CODE: testname,
            POINT_CODE: item.POINT_CODE,
            PRI: item.PRI,
            CENTER_VALUE: testname === "1" ? mCodeList[j].WIDTH_CD : item.CENTER_VALUE,
            UPPER_TOR: item.UPPER_TOR,
            LOWER_TOR: item.LOWER_TOR,
            BARCODE_CONTENT: item.BARCODE_CONTENT || "",
            REMARK: item.REMARK || "",
          });
          if (res.data.tk_status === "NG") {
            err_code += ` Lỗi: ${item.TEST_CODE}| ${item.POINT_CODE} : ${res.data.message};`;
          }
        }
      }
    }

    if (err_code !== "") {
      Swal.fire("Thông báo", "Có lỗi: " + err_code, "error");
    } else {
      Swal.fire("Thông báo", "Add SPEC thành công", "success");
    }
    checkAddedSpec(selectedMaterial?.M_CODE, selectedCode?.G_CODE);
  };

  const handleUpdateSpec = async () => {
    if (testname === "0") {
      Swal.fire("Thông báo", "Hãy chọn một hạng mục test bất kỳ", "error");
      return;
    }
    if (selectedRowsData.current.length < 1) {
      Swal.fire("Thông báo", "Chọn ít nhất một dòng để update", "error");
      return;
    }
    Swal.fire({
      title: "Update SPEC",
      text: "Đang Update SPEC...",
      icon: "info",
      showConfirmButton: false,
      allowOutsideClick: false,
    });

    let err_code = "";
    if (!checkNVL) {
      for (let i = 0; i < selectedRowsData.current.length; i++) {
        const item = selectedRowsData.current[i];
        const res = await generalQuery("updateSpecDTC", {
          checkNVL,
          G_CODE: selectedCode?.G_CODE,
          M_CODE: "B0000035",
          TEST_CODE: testname,
          POINT_CODE: item.POINT_CODE,
          PRI: item.PRI,
          CENTER_VALUE: item.CENTER_VALUE,
          UPPER_TOR: item.UPPER_TOR,
          LOWER_TOR: item.LOWER_TOR,
          BARCODE_CONTENT: item.BARCODE_CONTENT,
          REMARK: item.REMARK,
        });
        if (res.data.tk_status === "NG") {
          err_code += ` Lỗi: ${item.TEST_CODE}| ${item.POINT_CODE} : ${res.data.message};`;
        }
      }
    } else {
      const mCodeList = materialList
        .filter((el) => el.M_NAME === selectedMaterial?.M_NAME)
        .map((el2) => ({ M_CODE: el2.M_CODE, WIDTH_CD: el2.WIDTH_CD }));

      for (let j = 0; j < mCodeList.length; j++) {
        for (let i = 0; i < selectedRowsData.current.length; i++) {
          const item = selectedRowsData.current[i];
          const res = await generalQuery("updateSpecDTC", {
            checkNVL,
            G_CODE: "7A07540A",
            M_CODE: mCodeList[j].M_CODE,
            TEST_CODE: testname,
            POINT_CODE: item.POINT_CODE,
            PRI: item.PRI,
            CENTER_VALUE: testname === "1" ? mCodeList[j].WIDTH_CD : item.CENTER_VALUE,
            UPPER_TOR: item.UPPER_TOR,
            LOWER_TOR: item.LOWER_TOR,
            BARCODE_CONTENT: item.BARCODE_CONTENT,
            REMARK: item.REMARK,
          });
          if (res.data.tk_status === "NG") {
            err_code += ` Lỗi: ${item.TEST_CODE}| ${item.POINT_CODE} : ${res.data.message};`;
          }
        }
      }
    }

    if (err_code !== "") {
      Swal.fire("Thông báo", "Có lỗi: " + err_code, "error");
    } else {
      Swal.fire("Thông báo", "Update SPEC thành công", "success");
    }
    checkAddedSpec(selectedMaterial?.M_CODE, selectedCode?.G_CODE);
  };

  const copyXRFSpec = async (m_code: string | undefined, g_code: string | undefined) => {
    const listM = materialList
      .filter((el) => el.M_NAME === selectedMaterial?.M_NAME)
      .map((el2) => el2.M_CODE);

    if (!checkNVL) {
      const res = await generalQuery("copyXRFSpec", {
        M_CODE: checkNVL ? m_code : "B0000035",
        G_CODE: checkNVL ? "7A07540A" : g_code,
      });
      if (res.data.tk_status !== "NG") Swal.fire("Thông báo", "Copy XRF Spec thành công", "success");
    } else {
      for (let i = 0; i < listM.length; i++) {
        await generalQuery("copyXRFSpec", {
          M_CODE: listM[i],
          G_CODE: checkNVL ? "7A07540A" : g_code,
        });
      }
      Swal.fire("Thông báo", "Copy XRF Spec thành công", "success");
    }
  };

  const copyXRFSpecSDI = async (m_code: string | undefined, g_code: string | undefined) => {
    const listM = materialList
      .filter((el) => el.M_NAME === selectedMaterial?.M_NAME)
      .map((el2) => el2.M_CODE);

    if (!checkNVL) {
      const res = await generalQuery("copyXRFSpecSDI", {
        M_CODE: checkNVL ? m_code : "B0000035",
        G_CODE: checkNVL ? "7A07540A" : g_code,
      });
      if (res.data.tk_status !== "NG") Swal.fire("Thông báo", "Copy XRF Spec thành công", "success");
    } else {
      for (let i = 0; i < listM.length; i++) {
        await generalQuery("copyXRFSpecSDI", {
          M_CODE: listM[i],
          G_CODE: checkNVL ? "7A07540A" : g_code,
        });
      }
      Swal.fire("Thông báo", "Copy XRF Spec thành công", "success");
    }
  };

  const handleAddNewPoint = () => {
    if (testname === "0") {
      Swal.fire("Thông báo", "Hãy chọn một hạng mục test bất kỳ trước khi thêm điểm đo", "error");
      return;
    }
    const nextCode = inspectiondatatable.length + 1;
    const newPoint: any = {
      id: nextCode,
      CUST_NAME_KD: inspectiondatatable[0]?.CUST_NAME_KD || "SEVT",
      G_CODE: selectedCode?.G_CODE || "",
      G_NAME: selectedCode?.G_NAME || "",
      M_CODE: checkNVL ? selectedMaterial?.M_CODE : "B0000035",
      M_NAME: checkNVL ? selectedMaterial?.M_NAME : "",
      WIDTH_CD: checkNVL ? selectedMaterial?.WIDTH_CD || 0 : 0,
      TEST_CODE: testname,
      TEST_NAME: testList.find((t) => String(t.TEST_CODE) === String(testname))?.TEST_NAME || "Kích thước",
      POINT_CODE: nextCode,
      POINT_NAME: `P${nextCode}`,
      PRI: 1,
      CENTER_VALUE: 0,
      LOWER_TOR: 0.1,
      UPPER_TOR: 0.1,
      BARCODE_CONTENT: "",
      REMARK: "",
      TDS: "N",
      BANVE: "Y",
    };
    setInspectionDataTable([...inspectiondatatable, newPoint]);
  };

  const handleDeleteSelected = () => {
    if (selectedRowsData.current.length === 0) {
      Swal.fire("Thông báo", "Vui lòng chọn ít nhất một dòng để xóa", "warning");
      return;
    }
    const selectedIds = new Set(selectedRowsData.current.map((r: any) => r.id));
    setInspectionDataTable(inspectiondatatable.filter((r) => !selectedIds.has(r.id)));
    selectedRowsData.current = [];
    setSelectedCount(0);
  };

  const toggleCheckNVL = () => {
    setCheckNVL(!checkNVL);
    setAddedSpec([]);
    setInspectionDataTable([]);
  };

  useEffect(() => {
    getcodelist("");
    getmateriallist();
    getTestList();
  }, []);

  return {
    codeList,
    selectedCode,
    setSelectedCode,
    materialList,
    selectedMaterial,
    setSelectedMaterial,
    testList,
    testname,
    setTestName,
    checkNVL,
    toggleCheckNVL,
    addedSpec,
    inspectiondatatable,
    setInspectionDataTable,
    quickFilterText,
    setQuickFilterText,
    selectedCount,
    setSelectedCount,
    selectedRowsData,
    handletraDTCData,
    handleInsertSpec,
    handleUpdateSpec,
    checkAddedSpec,
    copyXRFSpec,
    copyXRFSpecSDI,
    handleAddNewPoint,
    handleDeleteSelected,
  };
};

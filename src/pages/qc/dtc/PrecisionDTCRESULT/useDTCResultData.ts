import { useState, useEffect, useMemo, useCallback } from "react";
import Swal from "sweetalert2";
import moment from "moment";
import * as XLSX from "xlsx";
import { generalQuery } from "../../../../api/Api";
import { SaveExcel } from "../../../../api/services/excelService";
import { TestListTable } from "../../interfaces/qcInterface";
import { f_loadDTC_TestList } from "../../utils/qcUtils";
import {
  DTC_RESULT_INPUT,
  InputData,
  unpivotJsonArray,
} from "./dtcResultUtils";

export const useDTCResultData = () => {
  const [switchIDLOT, setSwitchIDLOT] = useState<boolean>(false);
  const [dtc_id, setDTC_ID] = useState<string>("");
  const [remark, setRemark] = useState<string>("");
  const [uphangloat, setUpHangLoat] = useState<boolean>(false);
  const [testList, setTestList] = useState<TestListTable[]>([]);
  const [testname, setTestName] = useState<string>("1003");
  const [testcode_tenthat, setTestCode_tenthat] = useState<string>("XRF");
  const [inspectiondatatable, setInspectionDataTable] = useState<DTC_RESULT_INPUT[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Material & Product metadata
  const [M_Name, setM_Name] = useState<string>("");
  const [M_Code, setM_Code] = useState<string>("");
  const [WidthCD, setWidthCD] = useState<number | string>(0);
  const [Cust_Cd, setCust_Cd] = useState<string>("");
  const [VendorLot, setVendorLot] = useState<string>("");

  // Load danh sách hạng mục test DTC
  const getTestList = useCallback(async () => {
    try {
      const tempList: TestListTable[] = await f_loadDTC_TestList();
      setTestList(tempList);
    } catch (err) {
      console.error("Error loading test list:", err);
    }
  }, []);

  // Tra cứu thông tin LOT NVL (IQC)
  const checkLotNVL = useCallback((mLotNo: string) => {
    generalQuery("checkM_NAME_IQC", { M_LOT_NO: mLotNo })
      .then((response) => {
        if (response.data.tk_status !== "NG" && response.data.data?.length > 0) {
          const item = response.data.data[0];
          setM_Name(item.M_NAME || "");
          setM_Code(item.M_CODE || "");
          setWidthCD(item.WIDTH_CD || 0);
          setCust_Cd(item.CUST_CD || "");
          setVendorLot(item.LOT_VENDOR || "");
        } else {
          setM_Name("");
          setM_Code("");
          setWidthCD(0);
          setCust_Cd("");
          setVendorLot("");
        }
      })
      .catch((error) => {
        console.error("Error checkLotNVL:", error);
      });
  }, []);

  // Kiểm tra các hạng mục test đã đăng ký của DTC_ID
  const checkRegisteredTest = useCallback((id: string) => {
    if (!id.trim()) return;
    generalQuery("checkRegisterdDTCTEST", { DTC_ID: id })
      .then((response) => {
        if (response.data.tk_status !== "NG" && Array.isArray(response.data.data)) {
          const temp_loaded: TestListTable[] = response.data.data.map((element: any) => ({
            ...element,
            CHECKADDED: element.CHECKADDED !== null && element.CHECKADDED !== undefined,
          }));
          setTestList(temp_loaded);
        }
      })
      .catch((error) => {
        console.error("Error checkRegisterdDTCTEST:", error);
      });
  }, []);

  // Lấy DTC_ID từ LOT NVL
  const getIDFromLot = useCallback(
    (lotNo: string) => {
      generalQuery("getidDTCfromlotNVL", { M_LOT_NO: lotNo })
        .then((response) => {
          if (response.data.tk_status !== "NG" && response.data.data?.length > 0) {
            const foundId = response.data.data[0].DTC_ID.toString();
            setDTC_ID(foundId);
            checkLotNVL(response.data.data[0].M_LOT_NO);
            checkRegisteredTest(foundId);
            if (testname) {
              handletraDTCData(foundId, testname);
            }
          }
        })
        .catch((error) => {
          console.error("Error getidDTCfromlotNVL:", error);
        });
    },
    [checkLotNVL, checkRegisteredTest, testname]
  );

  // Nạp dữ liệu SPEC và điểm đo của DTC_ID và TEST_CODE
  const handletraDTCData = useCallback((id: string, testCode: string) => {
    if (!id.trim() || !testCode.trim()) return;
    generalQuery("getinputdtcspec", {
      DTC_ID: id,
      TEST_CODE: testCode,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG" && Array.isArray(response.data.data)) {
          const loadeddata: DTC_RESULT_INPUT[] = response.data.data.map(
            (element: DTC_RESULT_INPUT, index: number) => ({
              ...element,
              SAMPLE_NO: element.SAMPLE_NO || 1,
              id: index,
            })
          );
          setInspectionDataTable(loadeddata);
        } else {
          setInspectionDataTable([]);
        }
      })
      .catch((error) => {
        console.error("Error getinputdtcspec:", error);
        setInspectionDataTable([]);
      });
  }, []);

  // Thay đổi mã ID TEST hoặc LOT NVL
  const handleInputChange = useCallback(
    (val: string) => {
      setDTC_ID(val);
      if (switchIDLOT) {
        if (val.length >= 7) {
          getIDFromLot(val);
        }
      } else {
        if (val.length >= 4) {
          checkRegisteredTest(val);
          if (testname) {
            handletraDTCData(val, testname);
          }
        }
      }
    },
    [switchIDLOT, getIDFromLot, checkRegisteredTest, testname, handletraDTCData]
  );

  // Chuyển chọn hạng mục Test
  const handleSelectTest = useCallback(
    (code: string) => {
      setTestName(code);
      const found = testList.find((el) => el.TEST_CODE.toString() === code);
      if (found) {
        setTestCode_tenthat(found.TEST_NAME);
      }
      if (dtc_id.trim()) {
        handletraDTCData(dtc_id, code);
      }
    },
    [testList, dtc_id, handletraDTCData]
  );

  // Cập nhật giá trị khi người dùng chỉnh sửa cell trên AGTable
  const handleCellValueChanged = useCallback((params: any) => {
    const updatedRow = params.data;
    setInspectionDataTable((prev) =>
      prev.map((row) => (row.id === updatedRow.id ? { ...updatedRow } : row))
    );
  }, []);

  // Thêm mẫu đo mới (+1 Sample)
  const handleAddSample = useCallback(() => {
    if (inspectiondatatable.length === 0) {
      Swal.fire("Chưa có điểm đo", "Vui lòng nạp spec điểm đo trước khi thêm mẫu", "warning");
      return;
    }
    const currentMaxSample = Math.max(...inspectiondatatable.map((r) => r.SAMPLE_NO || 1));
    const nextSampleNo = currentMaxSample + 1;
    const baseSampleRows = inspectiondatatable.filter((r) => (r.SAMPLE_NO || 1) === 1);

    const newSampleRows: DTC_RESULT_INPUT[] = baseSampleRows.map((row, idx) => ({
      ...row,
      id: inspectiondatatable.length + idx,
      SAMPLE_NO: nextSampleNo,
      RESULT: (null as any),
      REMARK: "",
    }));

    setInspectionDataTable((prev) => [...prev, ...newSampleRows]);
    Swal.fire({
      icon: "success",
      title: "Đã thêm mẫu đo",
      text: `Đã tạo thêm mẫu M#${nextSampleNo} (${baseSampleRows.length} điểm đo)`,
      timer: 1500,
    });
  }, [inspectiondatatable]);

  // Upload file Excel kết quả đo XRF
  const readUploadFile = useCallback(
    (e: any) => {
      e.preventDefault();
      if (!e.target.files || e.target.files.length === 0) return;

      const reader = new FileReader();
      reader.onload = async (event: any) => {
        try {
          // Parity backup: chỉ cho nạp Excel khi hạng mục đang chọn là XRF
          if (testcode_tenthat !== "XRF") {
            Swal.fire("Thông báo", "Chọn test XRF để upload file", "error");
            return;
          }
          const data = event.target.result;
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json: any = XLSX.utils.sheet_to_json(worksheet);

          if (!json || json.length === 0) {
            Swal.fire("File rỗng", "Không tìm thấy dữ liệu trong file Excel", "warning");
            return;
          }

          const inputArray: InputData[] = json.map((element: any) => ({
            DTC_ID: element.DTC_ID ?? dtc_id,
            Br: element.Br ?? 0,
            Pb: element.Pb ?? 0,
            Hg: element.Hg ?? 0,
            Cd: element.Cd ?? 0,
            As: element.As ?? 0,
            Cr: element.Cr ?? 0,
            Sb: element.Sb ?? 0,
            Sn: element.Sn ?? 0,
            S: element.S ?? 0,
            Cl: element.Cl ?? 0,
            P: element.P ?? 0,
            REMARK: element.REMARK ?? "",
          }));

          if (inputArray.length > 7 && !uphangloat) {
            Swal.fire("Thông báo", "Số lượng dòng trong file Excel không được lớn hơn 7", "error");
            return;
          }

          const baseItem = inspectiondatatable[0];
          const newInputArray: DTC_RESULT_INPUT[] = await unpivotJsonArray(
            uphangloat,
            uphangloat ? 0 : baseItem?.DTC_ID || Number(dtc_id),
            uphangloat ? 0 : baseItem?.TEST_CODE || 3,
            uphangloat ? "" : baseItem?.G_CODE || "",
            uphangloat ? "" : baseItem?.G_NAME || "",
            uphangloat ? "" : baseItem?.M_CODE || "",
            uphangloat ? "" : baseItem?.M_NAME || "",
            uphangloat ? "" : baseItem?.TEST_NAME || "XRF",
            inspectiondatatable,
            inputArray
          );

          if (newInputArray.length > 0) {
            setInspectionDataTable(newInputArray);
            Swal.fire("Thành công", `Đã nạp ${newInputArray.length} giá trị đo từ Excel`, "success");
          }
        } catch (err: any) {
          Swal.fire("Lỗi đọc file", err?.message || "Không thể đọc file Excel", "error");
        }
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    },
    [dtc_id, uphangloat, inspectiondatatable, testcode_tenthat]
  );

  // Cập nhật người thực hiện test
  const updateDTCTESEMPL = useCallback((dtcId: number, testCode: number) => {
    generalQuery("updateDTC_TEST_EMPL", {
      DTC_ID: dtcId,
      TEST_CODE: testCode,
    }).catch((error) => console.error("Error updateDTC_TEST_EMPL:", error));
  }, []);

  // Lưu kết quả đo
  const insertDTCResult = useCallback(async () => {
    if (inspectiondatatable.length === 0) {
      Swal.fire("Chưa có dữ liệu", "Không có điểm đo nào để lưu", "warning");
      return;
    }

    let checkresult = true;
    for (let i = 0; i < inspectiondatatable.length; i++) {
      const val = inspectiondatatable[i].RESULT;
      if (val === null || val === undefined || isNaN(Number(val))) {
        checkresult = false;
        break;
      }
    }

    if (!checkresult) {
      Swal.fire(
        "Thiếu số đo",
        uphangloat
          ? "File Excel có điểm đo thiếu hoặc không hợp lệ, vui lòng kiểm tra lại trước khi lưu"
          : "Vui lòng nhập đầy đủ kết quả đo trước khi lưu",
        "warning"
      );
      return;
    }

    if (!uphangloat && !dtc_id.trim()) {
      Swal.fire(
        "Thiếu thông tin",
        "Vui lòng nhập ID TEST (hoặc chuyển sang chế độ LOT NVL / Up hàng loạt) trước khi lưu",
        "warning"
      );
      return;
    }

    let err_code = "";
    for (let i = 0; i < inspectiondatatable.length; i++) {
      const row = inspectiondatatable[i];
      try {
        const response = await generalQuery("insert_dtc_result", {
          DTC_ID: uphangloat ? row.DTC_ID : dtc_id,
          G_CODE: row.G_CODE,
          M_CODE: row.M_CODE,
          TEST_CODE: row.TEST_CODE,
          POINT_CODE: row.POINT_CODE,
          SAMPLE_NO: row.SAMPLE_NO,
          RESULT: row.RESULT,
          REMARK: remark === "" ? row.REMARK : remark,
        });

        if (response.data.tk_status !== "NG") {
          updateDTCTESEMPL(row.DTC_ID, row.TEST_CODE);
        } else {
          err_code += `Lỗi: ${response.data.message || ""}\n`;
        }
      } catch (err: any) {
        err_code += `Lỗi kết nối: ${err?.message || ""}\n`;
      }
    }

    if (err_code === "") {
      Swal.fire("Thành công", "Đã lưu kết quả đo vào hệ thống", "success");
      setInspectionDataTable([]);
    } else {
      Swal.fire("Lưu kết quả thất bại", err_code, "error");
    }
  }, [inspectiondatatable, uphangloat, dtc_id, remark, updateDTCTESEMPL]);

  // Bộ lọc tìm kiếm nhanh
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return inspectiondatatable;
    const term = searchTerm.toLowerCase().trim();
    return inspectiondatatable.filter(
      (item) =>
        item.POINT_NAME?.toLowerCase().includes(term) ||
        item.SAMPLE_NO?.toString().includes(term) ||
        item.G_NAME?.toLowerCase().includes(term) ||
        item.M_NAME?.toLowerCase().includes(term) ||
        item.REMARK?.toLowerCase().includes(term)
    );
  }, [inspectiondatatable, searchTerm]);

  // Tính toán KPI realtime
  const kpis = useMemo(() => {
    const totalPoints = inspectiondatatable.length;
    let sampleCount = 0;
    let okCount = 0;
    let ngCount = 0;

    inspectiondatatable.forEach((row) => {
      if (row.SAMPLE_NO && row.SAMPLE_NO > sampleCount) {
        sampleCount = row.SAMPLE_NO;
      }
      if (row.RESULT !== null && row.RESULT !== undefined && !isNaN(Number(row.RESULT))) {
        const rs = Number(row.RESULT);
        const center = Number(row.CENTER_VALUE || 0);
        const upper = Number(row.UPPER_TOR || 0);
        const lower = Number(row.LOWER_TOR || 0);
        if (rs > center + upper || rs < center - lower) {
          ngCount++;
        } else {
          okCount++;
        }
      }
    });

    const evaluatedCount = okCount + ngCount;
    const okRate = evaluatedCount > 0 ? Math.round((okCount / evaluatedCount) * 100) : 0;

    return {
      totalPoints,
      sampleCount: sampleCount || (totalPoints > 0 ? 1 : 0),
      okCount,
      ngCount,
      okRate,
    };
  }, [inspectiondatatable]);

  // Xuất Excel EX1: Đang lọc
  const handleExportEX1 = useCallback(() => {
    if (filteredData.length === 0) {
      Swal.fire("Không có dữ liệu", "Bảng đang lọc hiện tại rỗng", "info");
      return;
    }
    SaveExcel(filteredData, `DTC_RESULT_FILTERED_${moment().format("YYYYMMDD_HHmm")}`);
  }, [filteredData]);

  // Xuất Excel EX2: Toàn bộ
  const handleExportEX2 = useCallback(() => {
    if (inspectiondatatable.length === 0) {
      Swal.fire("Không có dữ liệu", "Bảng dữ liệu hiện tại rỗng", "info");
      return;
    }
    SaveExcel(inspectiondatatable, `DTC_RESULT_ALL_${moment().format("YYYYMMDD_HHmm")}`);
  }, [inspectiondatatable]);

  useEffect(() => {
    getTestList();
  }, [getTestList]);

  return {
    switchIDLOT,
    setSwitchIDLOT,
    dtc_id,
    setDTC_ID: handleInputChange,
    remark,
    setRemark,
    uphangloat,
    setUpHangLoat,
    testList,
    testname,
    testcode_tenthat,
    inspectiondatatable: filteredData,
    allDataTable: inspectiondatatable,
    searchTerm,
    setSearchTerm,
    M_Name,
    M_Code,
    WidthCD,
    Cust_Cd,
    VendorLot,
    kpis,
    handleSelectTest,
    handleCellValueChanged,
    handleAddSample,
    readUploadFile,
    insertDTCResult,
    handleExportEX1,
    handleExportEX2,
    handletraDTCData: () => handletraDTCData(dtc_id, testname),
  };
};

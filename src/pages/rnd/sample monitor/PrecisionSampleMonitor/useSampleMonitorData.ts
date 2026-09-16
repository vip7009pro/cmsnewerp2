import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import moment from "moment";
import { generalQuery, getUserData } from "../../../../api/Api";
import { checkBP } from "../../../../api/services/permissionService";
import { SaveExcel } from "../../../../api/services/excelService";
import { FullBOM } from "../../../kinhdoanh/interfaces/kdInterface";
import {
  ExtendedSampleData,
  SampleKpiData,
  StatusFilterType,
  UseSampleMonitorDataReturn,
} from "./sampleMonitorTypes";

export const useSampleMonitorData = (): UseSampleMonitorDataReturn => {
  const [data, setData] = useState<ExtendedSampleData[]>([]);
  const selectedSampleRef = useRef<ExtendedSampleData[]>([]);
  const [clickedRow, setClickedRow] = useState<ExtendedSampleData | null>(null);
  const [prodRequestNo, setProdRequestNo] = useState("");
  const [reqID, setReqID] = useState(0);
  const [ycsxInfo, setYcsxInfo] = useState<FullBOM[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("ALL");
  const [searchKeyword, setSearchKeyword] = useState("");

  const userDept = useMemo(() => {
    return getUserData()?.MAINDEPTNAME ?? "";
  }, []);

  // 1. Nạp danh sách YCSX khi gõ mã số
  const loadYCSXData = useCallback((ycsx: string) => {
    if (!ycsx.trim()) {
      setYcsxInfo([]);
      return;
    }
    generalQuery("ycsx_fullinfo", { PROD_REQUEST_NO: ycsx })
      .then((response) => {
        if (response.data.tk_status !== "NG" && Array.isArray(response.data.data)) {
          setYcsxInfo(response.data.data);
        } else {
          setYcsxInfo([]);
        }
      })
      .catch((error) => {
        console.error("Lỗi nạp YCSX:", error);
        setYcsxInfo([]);
      });
  }, []);

  // Tự động kiểm tra độ dài YCSX để nạp thông tin
  useEffect(() => {
    if (prodRequestNo.trim().length === 7) {
      loadYCSXData(prodRequestNo.trim());
    } else {
      setYcsxInfo([]);
    }
  }, [prodRequestNo, loadYCSXData]);

  // 2. Nạp dữ liệu danh sách Sample Monitor
  const loadSampleListTable = useCallback((silent: boolean = false) => {
    setIsLoading(true);
    generalQuery("loadSampleMonitorTable", {})
      .then((response) => {
        setIsLoading(false);
        if (response.data.tk_status !== "NG") {
          const loadeddata: ExtendedSampleData[] = (response.data.data || []).map(
            (element: ExtendedSampleData, index: number) => {
              const isCompleted =
                element.FILE_MAKET === "Y" &&
                element.FILM_FILE === "Y" &&
                element.KNIFE_STATUS === "Y" &&
                element.KNIFE_CODE !== "" &&
                element.KNIFE_CODE !== null &&
                element.FILM === "Y" &&
                element.PRINT_STATUS === "Y" &&
                element.DIECUT_STATUS === "Y" &&
                element.QC_STATUS === "Y" &&
                element.MATERIAL_STATUS === "Y";

              return {
                ...element,
                DELIVERY_DT:
                  element.DELIVERY_DT !== null && element.DELIVERY_DT !== undefined
                    ? moment(element.DELIVERY_DT, "YYYYMMDD").isValid()
                      ? moment(element.DELIVERY_DT, "YYYYMMDD").format("YYYY-MM-DD")
                      : element.DELIVERY_DT
                    : "",
                APPROVE_DATE:
                  element.APPROVE_DATE !== null && element.APPROVE_DATE !== undefined
                    ? moment(element.APPROVE_DATE).isValid()
                      ? moment(element.APPROVE_DATE).format("YYYY-MM-DD")
                      : element.APPROVE_DATE
                    : "",
                INS_DATE:
                  element.INS_DATE !== null && element.INS_DATE !== undefined
                    ? moment(element.INS_DATE).isValid()
                      ? moment(element.INS_DATE).format("YYYY-MM-DD")
                      : element.INS_DATE
                    : "",
                id: index,
                TOTAL_STATUS: isCompleted ? "COMPLETED" : "NOT COMPLETED",
              };
            }
          );
          setData(loadeddata);
          selectedSampleRef.current = [];
          if (!silent) {
            Swal.fire({
              title: "Thành công",
              text: `Đã nạp thành công ${loadeddata.length} dòng dữ liệu mẫu`,
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            });
          }
        } else {
          setData([]);
          selectedSampleRef.current = [];
          if (!silent) {
            Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
          }
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Lỗi nạp danh sách Sample:", error);
      });
  }, []);

  // 3. Cập nhật dữ liệu trực tiếp trên bảng (local state)
  const updateDataTable = useCallback(
    (dataRow: ExtendedSampleData, key: string, value: any) => {
      setData((prev) =>
        prev.map((p) => {
          if (p.SAMPLE_ID === dataRow.SAMPLE_ID) {
            const updated = { ...p, [key]: value };
            const isCompleted =
              updated.FILE_MAKET === "Y" &&
              updated.FILM_FILE === "Y" &&
              updated.KNIFE_STATUS === "Y" &&
              updated.KNIFE_CODE !== "" &&
              updated.KNIFE_CODE !== null &&
              updated.FILM === "Y" &&
              updated.PRINT_STATUS === "Y" &&
              updated.DIECUT_STATUS === "Y" &&
              updated.QC_STATUS === "Y" &&
              updated.MATERIAL_STATUS === "Y";
            updated.TOTAL_STATUS = isCompleted ? "COMPLETED" : "NOT COMPLETED";
            return updated;
          }
          return p;
        })
      );
    },
    []
  );

  const handleCellCheckboxChange = useCallback(
    (row: ExtendedSampleData, key: string, checked: boolean) => {
      updateDataTable(row, key, checked ? "Y" : "N");
    },
    [updateDataTable]
  );

  // 4. Thêm Sample theo dõi mới
  const handleAddSample = useCallback(() => {
    if (ycsxInfo.length === 0) {
      Swal.fire("Cảnh báo", "Vui lòng nhập đúng mã số YCSX 7 ký tự để nạp thông tin", "warning");
      return;
    }
    const item = ycsxInfo[0];
    generalQuery("addMonitoringSample", {
      PROD_REQUEST_NO: item.PROD_REQUEST_NO,
      G_NAME_KD: item.G_NAME_KD,
      G_CODE: item.G_CODE,
      REQ_ID: reqID,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          Swal.fire("Thành công", `Đã thêm mẫu ${item.PROD_REQUEST_NO} vào hệ thống theo dõi!`, "success");
          setProdRequestNo("");
          setReqID(0);
          setYcsxInfo([]);
          loadSampleListTable(true);
        } else {
          if (response.data.message?.includes("PRIMARY KEY")) {
            Swal.fire("Thông báo", "YCSX này đã tồn tại trong danh sách theo dõi!", "error");
          } else {
            Swal.fire("Thông báo", "Thêm sample thất bại: " + response.data.message, "error");
          }
        }
      })
      .catch((error) => {
        console.error(error);
        Swal.fire("Lỗi", "Không thể kết nối máy chủ", "error");
      });
  }, [ycsxInfo, reqID, loadSampleListTable]);

  // 5. Cập nhật dữ liệu hàng loạt theo phòng ban
  const handleUpdateDataRow = useCallback(async () => {
    const selected = selectedSampleRef.current;
    if (selected.length === 0) {
      Swal.fire("Thông báo", "Vui lòng tích chọn ít nhất 1 dòng mẫu để lưu!", "warning");
      return;
    }

    const dept = userDept.toUpperCase();
    let errCode = "";

    Swal.fire({
      title: "Đang lưu dữ liệu...",
      text: `Đang cập nhật tiến độ cho ${selected.length} dòng mẫu (${dept})...`,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    for (let i = 0; i < selected.length; i++) {
      const dataToUpdate = selected[i];

      try {
        switch (dept) {
          case "RND":
            await generalQuery("updateRND_SAMPLE_STATUS", {
              SAMPLE_ID: dataToUpdate.SAMPLE_ID,
              FILE_MAKET: dataToUpdate.FILE_MAKET,
              FILM_FILE: dataToUpdate.FILM_FILE,
              KNIFE_STATUS: dataToUpdate.KNIFE_STATUS,
              KNIFE_CODE: dataToUpdate.KNIFE_CODE,
              FILM: dataToUpdate.FILM,
            });
            break;

          case "SX":
            await generalQuery("updateSX_SAMPLE_STATUS", {
              SAMPLE_ID: dataToUpdate.SAMPLE_ID,
              PRINT_STATUS: dataToUpdate.PRINT_STATUS,
              DIECUT_STATUS: dataToUpdate.DIECUT_STATUS,
            });
            break;

          case "QC":
            await generalQuery("updateQC_SAMPLE_STATUS", {
              SAMPLE_ID: dataToUpdate.SAMPLE_ID,
              QC_STATUS: dataToUpdate.QC_STATUS,
            });
            break;

          case "KD":
            await generalQuery("updateAPPROVE_SAMPLE_STATUS", {
              SAMPLE_ID: dataToUpdate.SAMPLE_ID,
              APPROVE_STATUS: dataToUpdate.APPROVE_STATUS,
              USE_YN: dataToUpdate.USE_YN,
              REMARK: dataToUpdate.REMARK,
            });
            break;

          case "MUA":
          case "KHO":
            await generalQuery("updateMATERIAL_STATUS", {
              SAMPLE_ID: dataToUpdate.SAMPLE_ID,
              MATERIAL_STATUS: dataToUpdate.MATERIAL_STATUS,
            });
            break;

          default:
            // Nếu là Admin hoặc phòng ban tổng hợp: cập nhật toàn diện
            await Promise.all([
              generalQuery("updateRND_SAMPLE_STATUS", {
                SAMPLE_ID: dataToUpdate.SAMPLE_ID,
                FILE_MAKET: dataToUpdate.FILE_MAKET,
                FILM_FILE: dataToUpdate.FILM_FILE,
                KNIFE_STATUS: dataToUpdate.KNIFE_STATUS,
                KNIFE_CODE: dataToUpdate.KNIFE_CODE,
                FILM: dataToUpdate.FILM,
              }),
              generalQuery("updateMATERIAL_STATUS", {
                SAMPLE_ID: dataToUpdate.SAMPLE_ID,
                MATERIAL_STATUS: dataToUpdate.MATERIAL_STATUS,
              }),
              generalQuery("updateSX_SAMPLE_STATUS", {
                SAMPLE_ID: dataToUpdate.SAMPLE_ID,
                PRINT_STATUS: dataToUpdate.PRINT_STATUS,
                DIECUT_STATUS: dataToUpdate.DIECUT_STATUS,
              }),
              generalQuery("updateQC_SAMPLE_STATUS", {
                SAMPLE_ID: dataToUpdate.SAMPLE_ID,
                QC_STATUS: dataToUpdate.QC_STATUS,
              }),
              generalQuery("updateAPPROVE_SAMPLE_STATUS", {
                SAMPLE_ID: dataToUpdate.SAMPLE_ID,
                APPROVE_STATUS: dataToUpdate.APPROVE_STATUS,
                USE_YN: dataToUpdate.USE_YN,
                REMARK: dataToUpdate.REMARK,
              }),
            ]);
            break;
        }
      } catch (err: any) {
        errCode += ` | Lỗi dòng ${dataToUpdate.SAMPLE_ID}: ${err?.message || ""}`;
      }
    }

    if (errCode === "") {
      Swal.fire("Thành công", `Đã lưu cập nhật tiến độ cho ${selected.length} dòng!`, "success");
    } else {
      Swal.fire("Có lỗi xảy ra", "Chi tiết: " + errCode, "error");
    }
    loadSampleListTable(true);
  }, [userDept, loadSampleListTable]);

  // 6. Khóa / Mở Sample (Kiểm tra quyền Kinh Doanh)
  const handleLockSample = useCallback(
    async (lockValue: "Y" | "N") => {
      const selected = selectedSampleRef.current;
      if (selected.length === 0) {
        Swal.fire("Thông báo", "Vui lòng chọn ít nhất 1 dòng để thực hiện!", "warning");
        return;
      }

      checkBP(getUserData(), ["KD", "ADMIN"], ["ALL"], ["ALL"], async () => {
        let errCode = "";
        Swal.fire({
          title: lockValue === "Y" ? "Đang mở khóa sample..." : "Đang khóa sample...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        for (let i = 0; i < selected.length; i++) {
          try {
            const res = await generalQuery("lockSample", {
              SAMPLE_ID: selected[i].SAMPLE_ID,
              USE_YN: lockValue,
            });
            if (res.data.tk_status === "NG") {
              errCode += ` | ${res.data.message}`;
            }
          } catch (err: any) {
            errCode += ` | ${err?.message || ""}`;
          }
        }

        if (errCode === "") {
          Swal.fire(
            "Thành công",
            `Đã ${lockValue === "Y" ? "MỞ" : "KHÓA"} thành công ${selected.length} dòng mẫu!`,
            "success"
          );
        } else {
          Swal.fire("Thông báo", "Cập nhật có lỗi: " + errCode, "error");
        }
        loadSampleListTable(true);
      });
    },
    [loadSampleListTable]
  );

  // 7. Thống kê KPI Realtime
  const kpiData: SampleKpiData = useMemo(() => {
    let completed = 0;
    let approved = 0;
    let rejected = 0;
    let pendingApprove = 0;
    let locked = 0;
    let active = 0;
    let rndReady = 0;
    let matReady = 0;
    let sxReady = 0;
    let qcReady = 0;

    for (const item of data) {
      if (item.USE_YN === "N") {
        locked++;
      } else {
        active++;
      }

      if (item.TOTAL_STATUS === "COMPLETED") completed++;

      if (item.APPROVE_STATUS === "Y") approved++;
      else if (item.APPROVE_STATUS === "N") rejected++;
      else pendingApprove++;

      const isRndDone =
        item.FILE_MAKET === "Y" &&
        item.FILM_FILE === "Y" &&
        item.KNIFE_STATUS === "Y" &&
        Boolean(item.KNIFE_CODE) &&
        item.FILM === "Y";
      if (isRndDone) rndReady++;

      if (item.MATERIAL_STATUS === "Y") matReady++;

      const isSxDone = item.PRINT_STATUS === "Y" && item.DIECUT_STATUS === "Y";
      if (isSxDone) sxReady++;

      if (item.QC_STATUS === "Y") qcReady++;
    }

    return {
      totalSamples: data.length,
      completedSamples: completed,
      approvedSamples: approved,
      rejectedSamples: rejected,
      pendingApproveSamples: pendingApprove,
      lockedSamples: locked,
      activeSamples: active,
      rndCompleted: rndReady,
      materialCompleted: matReady,
      sxCompleted: sxReady,
      qcCompleted: qcReady,
    };
  }, [data]);

  // 8. Lọc danh sách hiển thị
  const filteredData: ExtendedSampleData[] = useMemo(() => {
    let list = data;

    // Filter theo trạng thái
    if (statusFilter === "COMPLETED") {
      list = list.filter((x) => x.TOTAL_STATUS === "COMPLETED");
    } else if (statusFilter === "PENDING") {
      list = list.filter((x) => x.TOTAL_STATUS !== "COMPLETED" && x.USE_YN !== "N");
    } else if (statusFilter === "APPROVED") {
      list = list.filter((x) => x.APPROVE_STATUS === "Y");
    } else if (statusFilter === "REJECTED") {
      list = list.filter((x) => x.APPROVE_STATUS === "N");
    } else if (statusFilter === "LOCKED") {
      list = list.filter((x) => x.USE_YN === "N");
    }

    // Filter theo từ khóa tìm kiếm nhanh
    if (searchKeyword.trim()) {
      const q = searchKeyword.toLowerCase().trim();
      list = list.filter(
        (x) =>
          x.PROD_REQUEST_NO?.toLowerCase().includes(q) ||
          x.G_CODE?.toLowerCase().includes(q) ||
          x.G_NAME?.toLowerCase().includes(q) ||
          x.G_NAME_KD?.toLowerCase().includes(q) ||
          x.CUST_NAME_KD?.toLowerCase().includes(q) ||
          x.KNIFE_CODE?.toLowerCase().includes(q) ||
          x.REMARK?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [data, statusFilter, searchKeyword]);

  // 9. Xuất file Excel
  const handleExportExcel = useCallback(
    (type: "current" | "all") => {
      const exportList = type === "current" ? filteredData : data;
      if (exportList.length === 0) {
        Swal.fire("Thông báo", "Không có dữ liệu để xuất Excel!", "info");
        return;
      }
      SaveExcel(
        exportList,
        `Theo_Doi_Sample_${type === "current" ? "Dang_Loc" : "Toan_Bo"}_${moment().format("YYYYMMDD_HHmm")}`
      );
    },
    [filteredData, data]
  );

  // Tự động load dữ liệu khi mở tab
  useEffect(() => {
    loadSampleListTable(true);
  }, [loadSampleListTable]);

  return {
    data,
    filteredData,
    selectedSampleRef,
    clickedRow,
    setClickedRow,
    prodRequestNo,
    setProdRequestNo,
    reqID,
    setReqID,
    ycsxInfo,
    isLoading,
    userDept,
    kpiData,
    statusFilter,
    setStatusFilter,
    searchKeyword,
    setSearchKeyword,
    loadSampleListTable,
    handleAddSample,
    handleUpdateDataRow,
    handleLockSample,
    updateDataTable,
    handleCellCheckboxChange,
    handleExportExcel,
  };
};

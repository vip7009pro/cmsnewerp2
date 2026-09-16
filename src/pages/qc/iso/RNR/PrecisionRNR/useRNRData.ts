import React, { useState, useEffect, useMemo, useCallback } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { generalQuery } from "../../../../../api/Api";
import { SaveExcel } from "../../../../../api/services/excelService";
import { RNR_DATA, RNR_DATA_EMPL } from "../../../interfaces/qcInterface";
import { RNRKpiMetrics } from "./PrecisionRNRKpi";

export const useRNRData = () => {
  const [isLoading, setisLoading] = useState(false);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [testID, setTestID] = useState("");
  const [empl_name, setEmpl_Name] = useState("");
  const [alltime, setAllTime] = useState(false);
  const [factory, setFactory] = useState("ALL");
  const [testType, setTestType] = useState("ALL");
  const [selectedData, setSelectedData] = useState<"detail" | "summaryByEmpl" | "summaryByDept">("detail");
  const [rnrdatatable, setRNRDataTable] = useState<Array<any>>([]);
  const [quickFilterText, setQuickFilterText] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Lỗi khi bật toàn màn hình:", err);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((err) => {
          console.error("Lỗi khi thoát toàn màn hình:", err);
        });
      }
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Gọi API tra cứu dữ liệu
  const handletraRNRData = useCallback(
    (targetMode?: "detail" | "summaryByEmpl" | "summaryByDept") => {
      const mode = targetMode || selectedData;
      setisLoading(true);

      if (mode === "detail") {
        generalQuery("loadRNRchitiet", {
          ALLTIME: alltime,
          FROM_DATE: fromdate,
          TO_DATE: todate,
          EMPL_NAME: empl_name,
          FACTORY: factory,
          TEST_TYPE: testType,
          TEST_ID: testID,
        })
          .then((response) => {
            if (response.data.tk_status !== "NG") {
              const loadeddata: RNR_DATA[] = response.data.data.map(
                (element: RNR_DATA, index: number) => ({
                  ...element,
                  TEST_DATE: element.TEST_DATE !== null ? moment.utc(element.TEST_DATE).format("YYYY-MM-DD") : "",
                  UPD_DATE: element.UPD_DATE !== null ? moment.utc(element.UPD_DATE).format("YYYY-MM-DD HH:mm:ss") : "",
                  id: index,
                })
              );
              setRNRDataTable(loadeddata);
              setisLoading(false);
              Swal.fire({
                title: "Thông báo",
                text: `Đã load ${response.data.data.length} dòng chi tiết`,
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
              });
            } else {
              Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
              setisLoading(false);
            }
          })
          .catch((error) => {
            console.error("loadRNRchitiet error:", error);
            setisLoading(false);
          });
      } else {
        // summaryByEmpl hoặc summaryByDept đều dùng dữ liệu tổng hợp theo nhân viên
        generalQuery("RnRtheonhanvien", {
          ALLTIME: alltime,
          FROM_DATE: fromdate,
          TO_DATE: todate,
          EMPL_NAME: empl_name,
          FACTORY: factory,
          TEST_TYPE: testType,
          TEST_ID: testID,
        })
          .then((response) => {
            if (response.data.tk_status !== "NG") {
              const loadeddata: RNR_DATA_EMPL[] = response.data.data.map(
                (element: RNR_DATA_EMPL, index: number) => {
                  const isGRNR = element.TEST_TYPE === "G_RNR";
                  const score1 = element.SCORE1 ?? 0;
                  const score2 = isGRNR ? (element.SCORE2 ?? -1) : -1;
                  const batNham1 = element.BAT_NHAM1 ?? 0;
                  const batNham2 = element.BAT_NHAM2 ?? 0;
                  const soCau = element.SO_CAU > 0 ? element.SO_CAU : 1;

                  const judge1 = isGRNR
                    ? score1 >= 80 && batNham1 === 0 ? "PASS" : "FAIL"
                    : score1 >= 80 ? "PASS" : "FAIL";

                  let judge2 = "N/A";
                  if (isGRNR && score2 !== -1) {
                    judge2 = score2 >= 80 && batNham2 === 0 ? "PASS" : "FAIL";
                  }

                  return {
                    ...element,
                    SCORE2: score2,
                    MIX2: isGRNR ? element.MIX2 : -1,
                    JUDGE1: judge1,
                    JUDGE2: judge2,
                    BN_RATE1: isGRNR ? batNham1 / soCau : 0,
                    BN_RATE2: isGRNR ? batNham2 / soCau : 0,
                    BS_RATE1: isGRNR ? (element.BO_SOT1 ?? 0) / soCau : 0,
                    BS_RATE2: isGRNR ? (element.BO_SOT2 ?? 0) / soCau : 0,
                    id: index,
                  };
                }
              );
              setRNRDataTable(loadeddata);
              setisLoading(false);
              Swal.fire({
                title: "Thông báo",
                text: `Đã load ${response.data.data.length} nhân sự dự thi`,
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
              });
            } else {
              Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
              setisLoading(false);
            }
          })
          .catch((error) => {
            console.error("RnRtheonhanvien error:", error);
            setisLoading(false);
          });
      }
    },
    [alltime, fromdate, todate, empl_name, factory, testType, testID, selectedData]
  );

  // Khi chuyển Tab segment
  const handleSelectDataChange = useCallback(
    (newMode: "detail" | "summaryByEmpl" | "summaryByDept") => {
      setSelectedData(newMode);
      // Nếu chuyển giữa detail và summary thì tự động load lại dữ liệu tương ứng nếu đang trống hoặc khác nguồn
      if (newMode === "detail") {
        handletraRNRData("detail");
      } else {
        handletraRNRData(newMode);
      }
    },
    [handletraRNRData]
  );

  // Xử lý phím Enter
  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => {
      if (e.key === "Enter") {
        handletraRNRData();
      }
    },
    [handletraRNRData]
  );

  // Dữ liệu hiển thị theo chế độ
  const currentData = useMemo(() => {
    if (selectedData === "summaryByDept") {
      // Nhóm rnrdatatable theo SUBDEPTNAME
      const deptMap: { [dept: string]: { scores1: number[]; scores2: number[]; pass1: number; pass2: number; count: number } } = {};

      rnrdatatable.forEach((item: any) => {
        const dept = item.SUBDEPTNAME || "Khác";
        if (!deptMap[dept]) {
          deptMap[dept] = { scores1: [], scores2: [], pass1: 0, pass2: 0, count: 0 };
        }
        deptMap[dept].count += 1;
        if (typeof item.SCORE1 === "number") deptMap[dept].scores1.push(item.SCORE1);
        if (typeof item.SCORE2 === "number" && item.SCORE2 !== -1) deptMap[dept].scores2.push(item.SCORE2);
        if (item.JUDGE1 === "PASS") deptMap[dept].pass1 += 1;
        if (item.JUDGE2 === "PASS") deptMap[dept].pass2 += 1;
      });

      return Object.keys(deptMap).map((dept, index) => {
        const d = deptMap[dept];
        const avg1 = d.scores1.length > 0 ? d.scores1.reduce((a, b) => a + b, 0) / d.scores1.length : 0;
        const avg2 = d.scores2.length > 0 ? d.scores2.reduce((a, b) => a + b, 0) / d.scores2.length : -1;
        const passRate1 = d.count > 0 ? (d.pass1 / d.count) * 100 : 0;
        const passRate2 = d.scores2.length > 0 ? (d.pass2 / d.scores2.length) * 100 : -1;

        return {
          id: index,
          SUBDEPTNAME: dept,
          TOTAL_EMPL: d.count,
          AVG_SCORE1: avg1,
          PASS_COUNT1: d.pass1,
          PASS_RATE1: passRate1,
          AVG_SCORE2: avg2,
          PASS_COUNT2: d.pass2,
          PASS_RATE2: passRate2,
        };
      });
    }

    return rnrdatatable;
  }, [rnrdatatable, selectedData]);

  // Lọc nhanh dữ liệu Quick Filter
  const filteredData = useMemo(() => {
    if (!quickFilterText.trim()) return currentData;
    const q = quickFilterText.toLowerCase().trim();

    return currentData.filter((row: any) => {
      return Object.values(row).some((val) => {
        if (val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(q);
      });
    });
  }, [currentData, quickFilterText]);

  // Tính toán chỉ số KPI Metrics
  const kpiMetrics: RNRKpiMetrics = useMemo(() => {
    if (selectedData === "detail") {
      const totalQuestions = rnrdatatable.length;
      const tests = new Set<string>();
      const empls = new Set<string>();
      let true1Count = 0;
      let eval1Count = 0;
      let true2Count = 0;
      let eval2Count = 0;
      let totalOkStandard = 0;
      let totalNgStandard = 0;

      rnrdatatable.forEach((item: any) => {
        if (item.TEST_ID) tests.add(String(item.TEST_ID));
        if (item.FULL_NAME) empls.add(String(item.FULL_NAME));
        if (item.RESULT_OK_NG === 1 || item.RESULT_OK_NG === "OK") totalOkStandard += 1;
        else totalNgStandard += 1;

        if (item.TEST_RESULT1 !== null && item.TEST_RESULT1 !== undefined) {
          eval1Count += 1;
          if (item.TEST_RESULT1 === item.RESULT_OK_NG) true1Count += 1;
        }

        if (item.TEST_REUST2 !== null && item.TEST_REUST2 !== undefined) {
          eval2Count += 1;
          if (item.TEST_REUST2 === item.RESULT_OK_NG) true2Count += 1;
        }
      });

      return {
        viewMode: "detail",
        totalQuestions,
        testCount: tests.size,
        accuracyRate1: eval1Count > 0 ? (true1Count / eval1Count) * 100 : 0,
        true1Count,
        eval1Count,
        accuracyRate2: eval2Count > 0 ? (true2Count / eval2Count) * 100 : 0,
        true2Count,
        eval2Count,
        uniqueEmpls: empls.size,
        totalOkStandard,
        totalNgStandard,
        totalExaminees: 0,
        deptCount: 0,
        passRate1: 0,
        pass1Count: 0,
        fail1Count: 0,
        avgScore1: 0,
        maxScore1: 0,
        minScore1: 0,
        passRate2: 0,
        pass2Count: 0,
        avgScore2: 0,
        avgBNRate: 0,
        avgBSRate: 0,
        totalDepts: 0,
        topDeptName: "",
        topDeptRate: 0,
        lowestDeptName: "",
        lowestDeptRate: 0,
        overallAvgScore1: 0,
      };
    }

    if (selectedData === "summaryByDept") {
      const depts = currentData;
      let topName = "";
      let topRate = -1;
      let lowName = "";
      let lowRate = 999;
      let totalScores = 0;
      let scoreCount = 0;
      let totalEx = 0;

      depts.forEach((d: any) => {
        totalEx += d.TOTAL_EMPL;
        totalScores += d.AVG_SCORE1 * d.TOTAL_EMPL;
        scoreCount += d.TOTAL_EMPL;

        if (d.PASS_RATE1 > topRate) {
          topRate = d.PASS_RATE1;
          topName = d.SUBDEPTNAME;
        }
        if (d.PASS_RATE1 < lowRate) {
          lowRate = d.PASS_RATE1;
          lowName = d.SUBDEPTNAME;
        }
      });

      return {
        viewMode: "summaryByDept",
        totalQuestions: 0,
        testCount: 0,
        accuracyRate1: 0,
        true1Count: 0,
        eval1Count: 0,
        accuracyRate2: 0,
        true2Count: 0,
        eval2Count: 0,
        uniqueEmpls: 0,
        totalOkStandard: 0,
        totalNgStandard: 0,
        totalExaminees: totalEx,
        deptCount: depts.length,
        passRate1: 0,
        pass1Count: 0,
        fail1Count: 0,
        avgScore1: 0,
        maxScore1: 0,
        minScore1: 0,
        passRate2: 0,
        pass2Count: 0,
        avgScore2: 0,
        avgBNRate: 0,
        avgBSRate: 0,
        totalDepts: depts.length,
        topDeptName: topName,
        topDeptRate: topRate >= 0 ? topRate : 0,
        lowestDeptName: lowName,
        lowestDeptRate: lowRate <= 100 ? lowRate : 0,
        overallAvgScore1: scoreCount > 0 ? totalScores / scoreCount : 0,
      };
    }

    // summaryByEmpl
    const totalEx = rnrdatatable.length;
    const depts = new Set<string>();
    let pass1Count = 0;
    let fail1Count = 0;
    let sumScore1 = 0;
    let max1 = 0;
    let min1 = 100;
    let pass2Count = 0;
    let eval2Count = 0;
    let sumScore2 = 0;
    let sumBN = 0;
    let sumBS = 0;

    rnrdatatable.forEach((item: any) => {
      if (item.SUBDEPTNAME) depts.add(String(item.SUBDEPTNAME));
      if (item.JUDGE1 === "PASS") pass1Count += 1;
      else fail1Count += 1;

      const s1 = Number(item.SCORE1 ?? 0);
      sumScore1 += s1;
      if (s1 > max1) max1 = s1;
      if (s1 < min1) min1 = s1;

      if (item.SCORE2 !== -1 && item.SCORE2 !== null && item.SCORE2 !== undefined) {
        eval2Count += 1;
        sumScore2 += Number(item.SCORE2);
        if (item.JUDGE2 === "PASS") pass2Count += 1;
      }

      sumBN += Number(item.BN_RATE1 ?? 0);
      sumBS += Number(item.BS_RATE1 ?? 0);
    });

    return {
      viewMode: "summaryByEmpl",
      totalQuestions: 0,
      testCount: 0,
      accuracyRate1: 0,
      true1Count: 0,
      eval1Count: 0,
      accuracyRate2: 0,
      true2Count: 0,
      eval2Count: 0,
      uniqueEmpls: 0,
      totalOkStandard: 0,
      totalNgStandard: 0,
      totalExaminees: totalEx,
      deptCount: depts.size,
      passRate1: totalEx > 0 ? (pass1Count / totalEx) * 100 : 0,
      pass1Count,
      fail1Count,
      avgScore1: totalEx > 0 ? sumScore1 / totalEx : 0,
      maxScore1: totalEx > 0 ? max1 : 0,
      minScore1: totalEx > 0 ? min1 : 0,
      passRate2: eval2Count > 0 ? (pass2Count / eval2Count) * 100 : -1,
      pass2Count,
      avgScore2: eval2Count > 0 ? sumScore2 / eval2Count : -1,
      avgBNRate: totalEx > 0 ? sumBN / totalEx : 0,
      avgBSRate: totalEx > 0 ? sumBS / totalEx : 0,
      totalDepts: 0,
      topDeptName: "",
      topDeptRate: 0,
      lowestDeptName: "",
      lowestDeptRate: 0,
      overallAvgScore1: 0,
    };
  }, [rnrdatatable, selectedData, currentData]);

  // Xuất Excel
  const exportExcelFiltered = useCallback(() => {
    const filename = `RNR_${selectedData}_Filtered_${moment().format("YYYYMMDD_HHmmss")}`;
    SaveExcel(filteredData, filename);
  }, [filteredData, selectedData]);

  const exportExcelAll = useCallback(() => {
    const filename = `RNR_${selectedData}_All_${moment().format("YYYYMMDD_HHmmss")}`;
    SaveExcel(currentData, filename);
  }, [currentData, selectedData]);

  return {
    isLoading,
    fromdate,
    setFromDate,
    todate,
    setToDate,
    alltime,
    setAllTime,
    factory,
    setFactory,
    testType,
    setTestType,
    testID,
    setTestID,
    empl_name,
    setEmpl_Name,
    selectedData,
    handleSelectDataChange,
    handletraRNRData,
    handleSearchKeyDown,
    currentData,
    filteredData,
    quickFilterText,
    setQuickFilterText,
    kpiMetrics,
    isFullscreen,
    toggleFullscreen,
    exportExcelFiltered,
    exportExcelAll,
  };
};

import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { SaveExcel } from "../../../../../api/services/excelService";
import { MACHINE_LIST, SX_ACHIVE_DATE } from "../../interfaces/khsxInterface";
import { f_getMachineListData, f_loadTiLeDat } from "../../utils/khsxUtils";

export const useAchivementTbData = () => {
  const [machine_list, setMachine_List] = useState<MACHINE_LIST[]>([]);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [factory, setFactory] = useState("NM1");
  const [machine, setMachine] = useState("ALL");
  const [plandatatable, setPlanDataTable] = useState<SX_ACHIVE_DATE[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [summarydata, setSummaryData] = useState<SX_ACHIVE_DATE>({
    id: 0,
    DAY_RATE: 0,
    EQ_NAME: "TOTAL",
    G_NAME_KD: "TOTAL",
    NIGHT_RATE: 0,
    PLAN_DAY: 0,
    PLAN_NIGHT: 0,
    PLAN_TOTAL: 0,
    PROD_REQUEST_NO: "TOTAL",
    RESULT_DAY: 0,
    RESULT_NIGHT: 0,
    RESULT_TOTAL: 0,
    STEP: 0,
    TOTAL_RATE: 0,
  });

  // Tải danh sách máy
  const getMachineList = useCallback(async () => {
    try {
      const list = await f_getMachineListData();
      setMachine_List(list);
    } catch (error) {
      console.error(error);
    }
  }, []);

  // Tải dữ liệu tỷ lệ đạt
  const loadTiLeDat = useCallback(
    async (plan_date?: string) => {
      setIsLoading(true);
      const targetDate = plan_date || fromdate;
      try {
        const { summaryData, planDataTable } = await f_loadTiLeDat(
          targetDate,
          machine,
          factory
        );
        setSummaryData(summaryData);
        setPlanDataTable(planDataTable);

        if (planDataTable.length === 0) {
          Swal.fire("Thông báo", "Không có dữ liệu trong ngày đã chọn", "info");
        }
      } catch (error) {
        console.error(error);
        Swal.fire("Lỗi", "Không thể tải dữ liệu tỷ lệ đạt", "error");
      } finally {
        setIsLoading(false);
      }
    },
    [fromdate, machine, factory]
  );

  // Xuất Excel
  const exportExcel = useCallback((rows: SX_ACHIVE_DATE[], title: string) => {
    if (!rows || rows.length === 0) {
      Swal.fire("Thông báo", "Không có dữ liệu để xuất Excel", "warning");
      return;
    }
    const cleanRows = rows.map((r) => ({
      EQ_NAME: r.EQ_NAME,
      PROD_REQUEST_NO: r.PROD_REQUEST_NO,
      CODE_KD: r.G_NAME_KD,
      STEP: r.STEP,
      PLAN_DAY: r.PLAN_DAY,
      PLAN_NIGHT: r.PLAN_NIGHT,
      PLAN_TOTAL: r.PLAN_TOTAL,
      RESULT_DAY: r.RESULT_DAY,
      RESULT_NIGHT: r.RESULT_NIGHT,
      RESULT_TOTAL: r.RESULT_TOTAL,
      DAY_RATE: r.DAY_RATE ? `${r.DAY_RATE.toFixed(1)}%` : "0%",
      NIGHT_RATE: r.NIGHT_RATE ? `${r.NIGHT_RATE.toFixed(1)}%` : "0%",
      TOTAL_RATE: r.TOTAL_RATE ? `${r.TOTAL_RATE.toFixed(1)}%` : "0%",
    }));
    SaveExcel(cleanRows, `${title}_${fromdate}_${moment().format("HHmmss")}`);
  }, [fromdate]);

  // Initial Load
  useEffect(() => {
    getMachineList();
    loadTiLeDat(fromdate);
  }, []);

  return {
    machine_list,
    fromdate,
    setFromDate,
    factory,
    setFactory,
    machine,
    setMachine,
    plandatatable,
    summarydata,
    isLoading,
    loadTiLeDat,
    exportExcel,
  };
};

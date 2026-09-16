import { useState, useEffect, useCallback, useMemo } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { generalQuery } from "../../../../api/Api";
import {
  CS_CONFIRM_BY_CUSTOMER_DATA,
  CS_CONFIRM_TRENDING_DATA,
  CS_REDUCE_AMOUNT_DATA,
  CS_RMA_AMOUNT_DATA,
  CS_TAXI_AMOUNT_DATA,
} from "../../interfaces/qcInterface";
import { CodeListData } from "../../../kinhdoanh/interfaces/kdInterface";

export const useCSReportData = () => {
  const [dailyppm, setDailyPPM] = useState<CS_CONFIRM_TRENDING_DATA[]>([]);
  const [weeklyppm, setWeeklyPPM] = useState<CS_CONFIRM_TRENDING_DATA[]>([]);
  const [monthlyppm, setMonthlyPPM] = useState<CS_CONFIRM_TRENDING_DATA[]>([]);
  const [yearlyppm, setYearlyPPM] = useState<CS_CONFIRM_TRENDING_DATA[]>([]);

  const [fromdate, setFromDate] = useState(moment().add(-14, "day").format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [worstby, setWorstBy] = useState("AMOUNT");
  const [ng_type, setNg_Type] = useState("ALL");
  const [cust_name, setCust_Name] = useState("");
  const [df, setDF] = useState(true);

  const [csConfirmDataByCustomer, setCsConfirmDataByCustomer] = useState<CS_CONFIRM_BY_CUSTOMER_DATA[]>([]);
  const [csConfirmDataByPIC, setCsConfirmDataByPIC] = useState<CS_CONFIRM_BY_CUSTOMER_DATA[]>([]);
  const [codeList, setCodeList] = useState<CodeListData[]>([]);
  const [searchCodeArray, setSearchCodeArray] = useState<string[]>([]);

  const [csDailyReduceAmount, setCSDailyReduceAmount] = useState<CS_REDUCE_AMOUNT_DATA[]>([]);
  const [csWeeklyReduceAmount, setCSWeeklyReduceAmount] = useState<CS_REDUCE_AMOUNT_DATA[]>([]);
  const [csMonthlyReduceAmount, setCSMonthlyReduceAmount] = useState<CS_REDUCE_AMOUNT_DATA[]>([]);
  const [csYearlyReduceAmount, setCSYearlyReduceAmount] = useState<CS_REDUCE_AMOUNT_DATA[]>([]);

  const [csDailyRMAAmount, setCSDailyRMAAmount] = useState<CS_RMA_AMOUNT_DATA[]>([]);
  const [csWeeklyRMAAmount, setCSWeeklyRMAAmount] = useState<CS_RMA_AMOUNT_DATA[]>([]);
  const [csMonthlyRMAAmount, setCSMonthlyRMAAmount] = useState<CS_RMA_AMOUNT_DATA[]>([]);
  const [csYearlyRMAAmount, setCSYearlyRMAAmount] = useState<CS_RMA_AMOUNT_DATA[]>([]);

  const [csDailyTAXIAmount, setCSDailyTAXIAmount] = useState<CS_TAXI_AMOUNT_DATA[]>([]);
  const [csWeeklyTAXIAmount, setCSWeeklyTAXIAmount] = useState<CS_TAXI_AMOUNT_DATA[]>([]);
  const [csMonthlyTAXIAmount, setCSMonthlyTAXIAmount] = useState<CS_TAXI_AMOUNT_DATA[]>([]);
  const [csYearlyTAXIAmount, setCSYearlyTAXIAmount] = useState<CS_TAXI_AMOUNT_DATA[]>([]);

  const [activeTab, setActiveTab] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Lắng nghe sự kiện Fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Lỗi khi mở toàn màn hình:", err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error("Lỗi khi thoát toàn màn hình:", err);
      });
    }
  }, []);

  // Lấy danh mục mã sản phẩm
  const getcodelist = useCallback((G_NAME: string) => {
    generalQuery("selectcodeList", { G_NAME })
      .then((res) => {
        if (res.data?.tk_status !== "NG" && Array.isArray(res.data?.data)) {
          setCodeList(res.data.data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // Thêm mã vào danh sách lọc
  const handleAddCode = useCallback((code: string) => {
    if (code) {
      setSearchCodeArray((prev) => (prev.includes(code) ? prev : [...prev, code]));
    }
  }, []);

  const handleClearCodeArray = useCallback(() => {
    setSearchCodeArray([]);
  }, []);

  // Các hàm tải dữ liệu chi tiết
  const handle_getCSDailyConfirmData = useCallback(async (fDate: string, tDate: string, codes: string[]) => {
    const td = moment().format("YYYY-MM-DD");
    const frd = moment().add(-14, "day").format("YYYY-MM-DD");
    try {
      const res = await generalQuery("csdailyconfirmdata", {
        FROM_DATE: df ? frd : fDate,
        TO_DATE: df ? td : tDate,
        codeArray: codes,
        CUST_NAME_KD: cust_name,
      });
      if (res.data?.tk_status !== "NG" && Array.isArray(res.data?.data)) {
        const loaded = res.data.data.map((item: CS_CONFIRM_TRENDING_DATA, idx: number) => ({
          ...item,
          CONFIRM_DATE: moment.utc(item.CONFIRM_DATE).format("YYYY-MM-DD"),
          TOTAL: (item.C || 0) + (item.K || 0),
          id: idx,
        }));
        setDailyPPM(loaded);
      } else {
        setDailyPPM([]);
      }
    } catch (e) {
      console.error(e);
      setDailyPPM([]);
    }
  }, [df, cust_name]);

  const handle_getCSWeeklyConfirmData = useCallback(async (fDate: string, tDate: string, codes: string[]) => {
    const td = moment().format("YYYY-MM-DD");
    const frd = moment().add(-70, "day").format("YYYY-MM-DD");
    try {
      const res = await generalQuery("csweeklyconfirmdata", {
        FROM_DATE: df ? frd : fDate,
        TO_DATE: df ? td : tDate,
        codeArray: codes,
        CUST_NAME_KD: cust_name,
      });
      if (res.data?.tk_status !== "NG" && Array.isArray(res.data?.data)) {
        const loaded = res.data.data.map((item: CS_CONFIRM_TRENDING_DATA, idx: number) => ({
          ...item,
          TOTAL: (item.C || 0) + (item.K || 0),
          id: idx,
        }));
        setWeeklyPPM(loaded);
      } else {
        setWeeklyPPM([]);
      }
    } catch (e) {
      console.error(e);
      setWeeklyPPM([]);
    }
  }, [df, cust_name]);

  const handle_getCSMonthlyConfirmData = useCallback(async (fDate: string, tDate: string, codes: string[]) => {
    const td = moment().format("YYYY-MM-DD");
    const frd = moment().add(-365, "day").format("YYYY-MM-DD");
    try {
      const res = await generalQuery("csmonthlyconfirmdata", {
        FROM_DATE: df ? frd : fDate,
        TO_DATE: df ? td : tDate,
        codeArray: codes,
        CUST_NAME_KD: cust_name,
      });
      if (res.data?.tk_status !== "NG" && Array.isArray(res.data?.data)) {
        const loaded = res.data.data.map((item: CS_CONFIRM_TRENDING_DATA, idx: number) => ({
          ...item,
          TOTAL: (item.C || 0) + (item.K || 0),
          id: idx,
        }));
        setMonthlyPPM(loaded);
      } else {
        setMonthlyPPM([]);
      }
    } catch (e) {
      console.error(e);
      setMonthlyPPM([]);
    }
  }, [df, cust_name]);

  const handle_getCSYearlyConfirmData = useCallback(async (fDate: string, tDate: string, codes: string[]) => {
    const td = moment().format("YYYY-MM-DD");
    const frd = moment().add(-3650, "day").format("YYYY-MM-DD");
    try {
      const res = await generalQuery("csyearlyconfirmdata", {
        FROM_DATE: df ? frd : fDate,
        TO_DATE: df ? td : tDate,
        codeArray: codes,
        CUST_NAME_KD: cust_name,
      });
      if (res.data?.tk_status !== "NG" && Array.isArray(res.data?.data)) {
        const loaded = res.data.data.map((item: CS_CONFIRM_TRENDING_DATA, idx: number) => ({
          ...item,
          TOTAL: (item.C || 0) + (item.K || 0),
          id: idx,
        }));
        setYearlyPPM(loaded);
      } else {
        setYearlyPPM([]);
      }
    } catch (e) {
      console.error(e);
      setYearlyPPM([]);
    }
  }, [df, cust_name]);

  const handle_getCSConfirmDataByCustomer = useCallback(async (fDate: string, tDate: string, codes: string[]) => {
    const td = moment().format("YYYY-MM-DD");
    const frd = moment().add(-14, "day").format("YYYY-MM-DD");
    try {
      const res = await generalQuery("csConfirmDataByCustomer", {
        FROM_DATE: df ? frd : fDate,
        TO_DATE: df ? td : tDate,
        codeArray: codes,
        CUST_NAME_KD: cust_name,
      });
      if (res.data?.tk_status !== "NG" && Array.isArray(res.data?.data)) {
        const loaded = res.data.data.map((item: CS_CONFIRM_BY_CUSTOMER_DATA, idx: number) => ({
          ...item,
          id: idx,
        }));
        setCsConfirmDataByCustomer(loaded);
      } else {
        setCsConfirmDataByCustomer([]);
      }
    } catch (e) {
      console.error(e);
      setCsConfirmDataByCustomer([]);
    }
  }, [df, cust_name]);

  const handle_getCSConfirmDataByPIC = useCallback(async (fDate: string, tDate: string, codes: string[]) => {
    const td = moment().format("YYYY-MM-DD");
    const frd = moment().add(-14, "day").format("YYYY-MM-DD");
    try {
      const res = await generalQuery("csConfirmDataByPIC", {
        FROM_DATE: df ? frd : fDate,
        TO_DATE: df ? td : tDate,
        codeArray: codes,
        CUST_NAME_KD: cust_name,
      });
      if (res.data?.tk_status !== "NG" && Array.isArray(res.data?.data)) {
        const loaded = res.data.data.map((item: CS_CONFIRM_BY_CUSTOMER_DATA, idx: number) => ({
          ...item,
          id: idx,
        }));
        setCsConfirmDataByPIC(loaded);
      } else {
        setCsConfirmDataByPIC([]);
      }
    } catch (e) {
      console.error(e);
      setCsConfirmDataByPIC([]);
    }
  }, [df, cust_name]);

  const handle_getCSDailyReduceAmount = useCallback(async (fDate: string, tDate: string, codes: string[]) => {
    const td = moment().format("YYYY-MM-DD");
    const frd = moment().add(-14, "day").format("YYYY-MM-DD");
    try {
      const res = await generalQuery("csdailyreduceamount", {
        FROM_DATE: df ? frd : fDate,
        TO_DATE: df ? td : tDate,
        codeArray: codes,
        CUST_NAME_KD: cust_name,
      });
      if (res.data?.tk_status !== "NG" && Array.isArray(res.data?.data)) {
        const loaded = res.data.data.map((item: CS_REDUCE_AMOUNT_DATA, idx: number) => ({
          ...item,
          CONFIRM_DATE: moment(item.CONFIRM_DATE).format("YYYY-MM-DD"),
          id: idx,
        }));
        setCSDailyReduceAmount(loaded);
      } else {
        setCSDailyReduceAmount([]);
      }
    } catch (e) {
      console.error(e);
      setCSDailyReduceAmount([]);
    }
  }, [df, cust_name]);

  const handle_getCSWeeklyReduceAmount = useCallback(async (fDate: string, tDate: string, codes: string[]) => {
    const td = moment().format("YYYY-MM-DD");
    const frd = moment().add(-70, "day").format("YYYY-MM-DD");
    try {
      const res = await generalQuery("csweeklyreduceamount", {
        FROM_DATE: df ? frd : fDate,
        TO_DATE: df ? td : tDate,
        codeArray: codes,
        CUST_NAME_KD: cust_name,
      });
      if (res.data?.tk_status !== "NG" && Array.isArray(res.data?.data)) {
        const loaded = res.data.data.map((item: CS_REDUCE_AMOUNT_DATA, idx: number) => ({
          ...item,
          id: idx,
        }));
        setCSWeeklyReduceAmount(loaded);
      } else {
        setCSWeeklyReduceAmount([]);
      }
    } catch (e) {
      console.error(e);
      setCSWeeklyReduceAmount([]);
    }
  }, [df, cust_name]);

  const handle_getCSMonthlyReduceAmount = useCallback(async (fDate: string, tDate: string, codes: string[]) => {
    const td = moment().format("YYYY-MM-DD");
    const frd = moment().add(-365, "day").format("YYYY-MM-DD");
    try {
      const res = await generalQuery("csmonthlyreduceamount", {
        FROM_DATE: df ? frd : fDate,
        TO_DATE: df ? td : tDate,
        codeArray: codes,
        CUST_NAME_KD: cust_name,
      });
      if (res.data?.tk_status !== "NG" && Array.isArray(res.data?.data)) {
        const loaded = res.data.data.map((item: CS_REDUCE_AMOUNT_DATA, idx: number) => ({
          ...item,
          id: idx,
        }));
        setCSMonthlyReduceAmount(loaded);
      } else {
        setCSMonthlyReduceAmount([]);
      }
    } catch (e) {
      console.error(e);
      setCSMonthlyReduceAmount([]);
    }
  }, [df, cust_name]);

  const handle_getCSYearlyReduceAmount = useCallback(async (fDate: string, tDate: string, codes: string[]) => {
    const td = moment().format("YYYY-MM-DD");
    const frd = moment().add(-1200, "day").format("YYYY-MM-DD");
    try {
      const res = await generalQuery("csyearlyreduceamount", {
        FROM_DATE: df ? frd : fDate,
        TO_DATE: df ? td : tDate,
        codeArray: codes,
        CUST_NAME_KD: cust_name,
      });
      if (res.data?.tk_status !== "NG" && Array.isArray(res.data?.data)) {
        const loaded = res.data.data.map((item: CS_REDUCE_AMOUNT_DATA, idx: number) => ({
          ...item,
          id: idx,
        }));
        setCSYearlyReduceAmount(loaded);
      } else {
        setCSYearlyReduceAmount([]);
      }
    } catch (e) {
      console.error(e);
      setCSYearlyReduceAmount([]);
    }
  }, [df, cust_name]);

  const handle_getCSDailyRMAAmount = useCallback(async (fDate: string, tDate: string, codes: string[]) => {
    const td = moment().format("YYYY-MM-DD");
    const frd = moment().add(-14, "day").format("YYYY-MM-DD");
    try {
      const res = await generalQuery("csdailyRMAAmount", {
        FROM_DATE: df ? frd : fDate,
        TO_DATE: df ? td : tDate,
        codeArray: codes,
        CUST_NAME_KD: cust_name,
      });
      if (res.data?.tk_status !== "NG" && Array.isArray(res.data?.data)) {
        const loaded = res.data.data.map((item: CS_RMA_AMOUNT_DATA, idx: number) => ({
          ...item,
          TT: (item.CD || 0) + (item.HT || 0) + (item.MD || 0),
          RT_DATE: moment(item.RT_DATE).format("YYYY-MM-DD"),
          id: idx,
        }));
        setCSDailyRMAAmount(loaded);
      } else {
        setCSDailyRMAAmount([]);
      }
    } catch (e) {
      console.error(e);
      setCSDailyRMAAmount([]);
    }
  }, [df, cust_name]);

  const handle_getCSWeeklyRMAAmount = useCallback(async (fDate: string, tDate: string, codes: string[]) => {
    const td = moment().format("YYYY-MM-DD");
    const frd = moment().add(-70, "day").format("YYYY-MM-DD");
    try {
      const res = await generalQuery("csweeklyRMAAmount", {
        FROM_DATE: df ? frd : fDate,
        TO_DATE: df ? td : tDate,
        codeArray: codes,
        CUST_NAME_KD: cust_name,
      });
      if (res.data?.tk_status !== "NG" && Array.isArray(res.data?.data)) {
        const loaded = res.data.data.map((item: CS_RMA_AMOUNT_DATA, idx: number) => ({
          ...item,
          TT: (item.CD || 0) + (item.HT || 0) + (item.MD || 0),
          RT_DATE: moment(item.RT_DATE).format("YYYY-MM-DD"),
          id: idx,
        }));
        setCSWeeklyRMAAmount(loaded);
      } else {
        setCSWeeklyRMAAmount([]);
      }
    } catch (e) {
      console.error(e);
      setCSWeeklyRMAAmount([]);
    }
  }, [df, cust_name]);

  const handle_getCSMonthlyRMAAmount = useCallback(async (fDate: string, tDate: string, codes: string[]) => {
    const td = moment().format("YYYY-MM-DD");
    const frd = moment().add(-365, "day").format("YYYY-MM-DD");
    try {
      const res = await generalQuery("csmonthlyRMAAmount", {
        FROM_DATE: df ? frd : fDate,
        TO_DATE: df ? td : tDate,
        codeArray: codes,
        CUST_NAME_KD: cust_name,
      });
      if (res.data?.tk_status !== "NG" && Array.isArray(res.data?.data)) {
        const loaded = res.data.data.map((item: CS_RMA_AMOUNT_DATA, idx: number) => ({
          ...item,
          TT: (item.CD || 0) + (item.HT || 0) + (item.MD || 0),
          RT_DATE: moment(item.RT_DATE).format("YYYY-MM-DD"),
          id: idx,
        }));
        setCSMonthlyRMAAmount(loaded);
      } else {
        setCSMonthlyRMAAmount([]);
      }
    } catch (e) {
      console.error(e);
      setCSMonthlyRMAAmount([]);
    }
  }, [df, cust_name]);

  const handle_getCSYearlyRMAAmount = useCallback(async (fDate: string, tDate: string, codes: string[]) => {
    const td = moment().format("YYYY-MM-DD");
    const frd = moment().add(-3650, "day").format("YYYY-MM-DD");
    try {
      const res = await generalQuery("csyearlyRMAAmount", {
        FROM_DATE: df ? frd : fDate,
        TO_DATE: df ? td : tDate,
        codeArray: codes,
        CUST_NAME_KD: cust_name,
      });
      if (res.data?.tk_status !== "NG" && Array.isArray(res.data?.data)) {
        const loaded = res.data.data.map((item: CS_RMA_AMOUNT_DATA, idx: number) => ({
          ...item,
          TT: (item.CD || 0) + (item.HT || 0) + (item.MD || 0),
          RT_DATE: moment(item.RT_DATE).format("YYYY-MM-DD"),
          id: idx,
        }));
        setCSYearlyRMAAmount(loaded);
      } else {
        setCSYearlyRMAAmount([]);
      }
    } catch (e) {
      console.error(e);
      setCSYearlyRMAAmount([]);
    }
  }, [df, cust_name]);

  const handle_getCSDailyTaxiAmount = useCallback(async (fDate: string, tDate: string, codes: string[]) => {
    const td = moment().format("YYYY-MM-DD");
    const frd = moment().add(-14, "day").format("YYYY-MM-DD");
    try {
      const res = await generalQuery("csdailyTaxiAmount", {
        FROM_DATE: df ? frd : fDate,
        TO_DATE: df ? td : tDate,
        codeArray: codes,
        CUST_NAME_KD: cust_name,
      });
      if (res.data?.tk_status !== "NG" && Array.isArray(res.data?.data)) {
        const loaded = res.data.data.map((item: CS_TAXI_AMOUNT_DATA, idx: number) => ({
          ...item,
          TAXI_DATE: moment(item.TAXI_DATE).format("YYYY-MM-DD"),
          id: idx,
        }));
        setCSDailyTAXIAmount(loaded);
      } else {
        setCSDailyTAXIAmount([]);
      }
    } catch (e) {
      console.error(e);
      setCSDailyTAXIAmount([]);
    }
  }, [df, cust_name]);

  const handle_getCSWeeklyTaxiAmount = useCallback(async (fDate: string, tDate: string, codes: string[]) => {
    const td = moment().format("YYYY-MM-DD");
    const frd = moment().add(-70, "day").format("YYYY-MM-DD");
    try {
      const res = await generalQuery("csweeklyTaxiAmount", {
        FROM_DATE: df ? frd : fDate,
        TO_DATE: df ? td : tDate,
        codeArray: codes,
        CUST_NAME_KD: cust_name,
      });
      if (res.data?.tk_status !== "NG" && Array.isArray(res.data?.data)) {
        const loaded = res.data.data.map((item: CS_TAXI_AMOUNT_DATA, idx: number) => ({
          ...item,
          id: idx,
        }));
        setCSWeeklyTAXIAmount(loaded);
      } else {
        setCSWeeklyTAXIAmount([]);
      }
    } catch (e) {
      console.error(e);
      setCSWeeklyTAXIAmount([]);
    }
  }, [df, cust_name]);

  const handle_getCSMonthlyTaxiAmount = useCallback(async (fDate: string, tDate: string, codes: string[]) => {
    const td = moment().format("YYYY-MM-DD");
    const frd = moment().add(-365, "day").format("YYYY-MM-DD");
    try {
      const res = await generalQuery("csmonthlyTaxiAmount", {
        FROM_DATE: df ? frd : fDate,
        TO_DATE: df ? td : tDate,
        codeArray: codes,
        CUST_NAME_KD: cust_name,
      });
      if (res.data?.tk_status !== "NG" && Array.isArray(res.data?.data)) {
        const loaded = res.data.data.map((item: CS_TAXI_AMOUNT_DATA, idx: number) => ({
          ...item,
          id: idx,
        }));
        setCSMonthlyTAXIAmount(loaded);
      } else {
        setCSMonthlyTAXIAmount([]);
      }
    } catch (e) {
      console.error(e);
      setCSMonthlyTAXIAmount([]);
    }
  }, [df, cust_name]);

  const handle_getCSYearlyTaxiAmount = useCallback(async (fDate: string, tDate: string, codes: string[]) => {
    const td = moment().format("YYYY-MM-DD");
    const frd = moment().add(-3650, "day").format("YYYY-MM-DD");
    try {
      const res = await generalQuery("csyearlyTaxiAmount", {
        FROM_DATE: df ? frd : fDate,
        TO_DATE: df ? td : tDate,
        codeArray: codes,
        CUST_NAME_KD: cust_name,
      });
      if (res.data?.tk_status !== "NG" && Array.isArray(res.data?.data)) {
        const loaded = res.data.data.map((item: CS_TAXI_AMOUNT_DATA, idx: number) => ({
          ...item,
          id: idx,
        }));
        setCSYearlyTAXIAmount(loaded);
      } else {
        setCSYearlyTAXIAmount([]);
      }
    } catch (e) {
      console.error(e);
      setCSYearlyTAXIAmount([]);
    }
  }, [df, cust_name]);

  // Nạp toàn bộ dữ liệu ban đầu
  const initFunction = useCallback(async () => {
    setLoading(true);
    Swal.fire({
      title: "Đang tải báo cáo CS",
      text: "Đang đồng bộ toàn diện dữ liệu, vui lòng chờ...",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      showConfirmButton: false,
      timer: 3500,
    });

    try {
      await Promise.all([
        handle_getCSDailyConfirmData(fromdate, todate, searchCodeArray),
        handle_getCSWeeklyConfirmData(fromdate, todate, searchCodeArray),
        handle_getCSMonthlyConfirmData(fromdate, todate, searchCodeArray),
        handle_getCSYearlyConfirmData(fromdate, todate, searchCodeArray),
        handle_getCSConfirmDataByCustomer(fromdate, todate, searchCodeArray),
        handle_getCSConfirmDataByPIC(fromdate, todate, searchCodeArray),
        handle_getCSDailyReduceAmount(fromdate, todate, searchCodeArray),
        handle_getCSWeeklyReduceAmount(fromdate, todate, searchCodeArray),
        handle_getCSMonthlyReduceAmount(fromdate, todate, searchCodeArray),
        handle_getCSYearlyReduceAmount(fromdate, todate, searchCodeArray),
        handle_getCSDailyRMAAmount(fromdate, todate, searchCodeArray),
        handle_getCSWeeklyRMAAmount(fromdate, todate, searchCodeArray),
        handle_getCSMonthlyRMAAmount(fromdate, todate, searchCodeArray),
        handle_getCSYearlyRMAAmount(fromdate, todate, searchCodeArray),
        handle_getCSDailyTaxiAmount(fromdate, todate, searchCodeArray),
        handle_getCSMonthlyTaxiAmount(fromdate, todate, searchCodeArray),
        handle_getCSWeeklyTaxiAmount(fromdate, todate, searchCodeArray),
        handle_getCSYearlyTaxiAmount(fromdate, todate, searchCodeArray),
      ]);

      Swal.fire({
        title: "Hoàn tất",
        text: "Đã tải xong dữ liệu Báo Cáo CS",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Lỗi nạp dữ liệu CS:", error);
      Swal.fire("Lỗi", "Không thể tải đầy đủ dữ liệu", "error");
    } finally {
      setLoading(false);
    }
  }, [
    fromdate,
    todate,
    searchCodeArray,
    handle_getCSDailyConfirmData,
    handle_getCSWeeklyConfirmData,
    handle_getCSMonthlyConfirmData,
    handle_getCSYearlyConfirmData,
    handle_getCSConfirmDataByCustomer,
    handle_getCSConfirmDataByPIC,
    handle_getCSDailyReduceAmount,
    handle_getCSWeeklyReduceAmount,
    handle_getCSMonthlyReduceAmount,
    handle_getCSYearlyReduceAmount,
    handle_getCSDailyRMAAmount,
    handle_getCSWeeklyRMAAmount,
    handle_getCSMonthlyRMAAmount,
    handle_getCSYearlyRMAAmount,
    handle_getCSDailyTaxiAmount,
    handle_getCSMonthlyTaxiAmount,
    handle_getCSWeeklyTaxiAmount,
    handle_getCSYearlyTaxiAmount,
  ]);

  useEffect(() => {
    getcodelist("");
    initFunction();
  }, []);

  // Tổng hợp chỉ số tài chính KPI
  const totalSavingAmount = useMemo(() => {
    return csDailyReduceAmount.reduce((sum, item) => sum + (item.REDUCE_AMOUNT || 0), 0);
  }, [csDailyReduceAmount]);

  const totalRMAAmount = useMemo(() => {
    return csDailyRMAAmount.reduce((sum, item) => sum + (item.TT || 0), 0);
  }, [csDailyRMAAmount]);

  const totalTaxiAmount = useMemo(() => {
    return csDailyTAXIAmount.reduce((sum, item) => sum + (item.TAXI_AMOUNT || 0), 0);
  }, [csDailyTAXIAmount]);

  return {
    dailyppm,
    weeklyppm,
    monthlyppm,
    yearlyppm,
    fromdate,
    setFromDate,
    todate,
    setToDate,
    worstby,
    setWorstBy,
    ng_type,
    setNg_Type,
    cust_name,
    setCust_Name,
    df,
    setDF,
    csConfirmDataByCustomer,
    csConfirmDataByPIC,
    codeList,
    searchCodeArray,
    handleAddCode,
    handleClearCodeArray,
    csDailyReduceAmount,
    csWeeklyReduceAmount,
    csMonthlyReduceAmount,
    csYearlyReduceAmount,
    csDailyRMAAmount,
    csWeeklyRMAAmount,
    csMonthlyRMAAmount,
    csYearlyRMAAmount,
    csDailyTAXIAmount,
    csWeeklyTAXIAmount,
    csMonthlyTAXIAmount,
    csYearlyTAXIAmount,
    activeTab,
    setActiveTab,
    loading,
    isFullscreen,
    toggleFullscreen,
    initFunction,
    totalSavingAmount,
    totalRMAAmount,
    totalTaxiAmount,
  };
};

export default useCSReportData;

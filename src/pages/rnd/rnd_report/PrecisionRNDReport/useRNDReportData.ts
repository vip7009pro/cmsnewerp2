import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { generalQuery, getCompany } from "../../../../api/Api";
import {
  DAOFILM_ERR_DATA,
  RND_FILM_SAVING_TREND_DATA,
  RND_NEWCODE_BY_CUSTOMER,
  RND_NEWCODE_BY_PRODTYPE,
  RND_NEWCODE_TREND_DATA,
} from "../../interfaces/rndInterface";
import { YCTK_TREND_DATA } from "../../../kinhdoanh/interfaces/kdInterface";
import {
  f_load_film_saving_daily,
  f_load_film_saving_monthly,
  f_load_film_saving_weekly,
  f_load_film_saving_yearly,
  f_load_tilefilmbanBackData,
  f_load_YCTK_TREND_DAILY,
  f_load_YCTK_TREND_MONTHLY,
  f_load_YCTK_TREND_WEEKLY,
  f_load_YCTK_TREND_YEARLY,
} from "../../../kinhdoanh/utils/kdUtils";
import { f_LoadDaoFilmErr } from "../../utils/rndUtils";
import {
  RNDKpiSummary,
  RNDReportTab,
  UseRNDReportDataReturn,
} from "./rndReportTypes";

export const useRNDReportData = (): UseRNDReportDataReturn => {
  const [dailynewcode, setDailyNewCode] = useState<RND_NEWCODE_TREND_DATA[]>([]);
  const [weeklynewcode, setWeeklyNewCode] = useState<RND_NEWCODE_TREND_DATA[]>([]);
  const [monthlynewcode, setMonthlyNewCode] = useState<RND_NEWCODE_TREND_DATA[]>([]);
  const [yearlynewcode, setYearlyNewCode] = useState<RND_NEWCODE_TREND_DATA[]>([]);
  const [yctkdailynewcode, setYCTKDailyNewCode] = useState<YCTK_TREND_DATA[]>([]);
  const [yctkweeklynewcode, setYCTKWeeklyNewCode] = useState<YCTK_TREND_DATA[]>([]);
  const [yctkmonthlynewcode, setYCTKMonthlyNewCode] = useState<YCTK_TREND_DATA[]>([]);
  const [yctkyearlynewcode, setYCTKYearlyNewCode] = useState<YCTK_TREND_DATA[]>([]);
  const [filmSavingDaily, setFilmSavingDaily] = useState<RND_FILM_SAVING_TREND_DATA[]>([]);
  const [filmSavingWeekly, setFilmSavingWeekly] = useState<RND_FILM_SAVING_TREND_DATA[]>([]);
  const [filmSavingMonthly, setFilmSavingMonthly] = useState<RND_FILM_SAVING_TREND_DATA[]>([]);
  const [filmSavingYearly, setFilmSavingYearly] = useState<RND_FILM_SAVING_TREND_DATA[]>([]);
  const [tilefilmbanBackData, setTileFilmBanBackData] = useState<RND_FILM_SAVING_TREND_DATA[]>([]);
  const [daofilmerr, setDaoFilmErr] = useState<DAOFILM_ERR_DATA[]>([]);

  const [fromdate, setFromDate] = useState<string>(moment().add(-14, "day").format("YYYY-MM-DD"));
  const [todate, setToDate] = useState<string>(moment().format("YYYY-MM-DD"));
  const [cust_name, setCust_Name] = useState<string>("");
  const [searchCodeArray, setSearchCodeArray] = useState<string[]>([]);
  const [df, setDF] = useState<boolean>(true);
  const [newcodebycustomer, setNewCodeByCustomer] = useState<RND_NEWCODE_BY_CUSTOMER[]>([]);
  const [newcodebyprodtype, setNewCodeByProdType] = useState<RND_NEWCODE_BY_PRODTYPE[]>([]);

  const [activeTab, setActiveTab] = useState<RNDReportTab>("all");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const company = useMemo(() => getCompany(), []);

  // Fullscreen Handler
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // 1. API: DAILY NEW CODE
  const handle_getDailyNewCodeData = useCallback(
    async (FACTORY: string, listCode: string[]) => {
      const td = moment().add(0, "day").format("YYYY-MM-DD");
      const frd = moment().add(-12, "day").format("YYYY-MM-DD");
      try {
        const response = await generalQuery("rnddailynewcode", {
          FACTORY: FACTORY,
          FROM_DATE: df ? frd : fromdate,
          TO_DATE: df ? td : todate,
          codeArray: df ? [] : listCode,
          CUST_NAME_KD: cust_name,
        });
        if (response.data.tk_status !== "NG") {
          const loadeddata: RND_NEWCODE_TREND_DATA[] = response.data.data.map(
            (element: RND_NEWCODE_TREND_DATA) => ({
              ...element,
              TOTAL: (element.NEWCODE || 0) + (element.ECN || 0),
              CREATED_DATE: moment.utc(element.CREATED_DATE).format("YYYY-MM-DD"),
            })
          );
          setDailyNewCode(loadeddata);
        } else {
          setDailyNewCode([]);
        }
      } catch (error) {
        console.error(error);
        setDailyNewCode([]);
      }
    },
    [df, fromdate, todate, cust_name]
  );

  // 2. API: WEEKLY NEW CODE
  const handle_getWeeklyNewCodeData = useCallback(
    async (FACTORY: string, listCode: string[]) => {
      const td = moment().add(0, "day").format("YYYY-MM-DD");
      const frd = moment().add(-70, "day").format("YYYY-MM-DD");
      try {
        const response = await generalQuery("rndweeklynewcode", {
          FACTORY: FACTORY,
          FROM_DATE: df ? frd : fromdate,
          TO_DATE: df ? td : todate,
          codeArray: df ? [] : listCode,
          CUST_NAME_KD: cust_name,
        });
        if (response.data.tk_status !== "NG") {
          const loadeddata: RND_NEWCODE_TREND_DATA[] = response.data.data.map(
            (element: RND_NEWCODE_TREND_DATA) => ({
              ...element,
              TOTAL: (element.NEWCODE || 0) + (element.ECN || 0),
            })
          );
          setWeeklyNewCode(loadeddata);
        } else {
          setWeeklyNewCode([]);
        }
      } catch (error) {
        console.error(error);
        setWeeklyNewCode([]);
      }
    },
    [df, fromdate, todate, cust_name]
  );

  // 3. API: MONTHLY NEW CODE
  const handle_getMonthlyNewCodeData = useCallback(
    async (FACTORY: string, listCode: string[]) => {
      const td = moment().add(0, "day").format("YYYY-MM-DD");
      const frd = moment().add(-365, "day").format("YYYY-MM-DD");
      try {
        const response = await generalQuery("rndmonthlynewcode", {
          FACTORY: FACTORY,
          FROM_DATE: df ? frd : fromdate,
          TO_DATE: df ? td : todate,
          codeArray: df ? [] : listCode,
          CUST_NAME_KD: cust_name,
        });
        if (response.data.tk_status !== "NG") {
          const loadeddata: RND_NEWCODE_TREND_DATA[] = response.data.data.map(
            (element: RND_NEWCODE_TREND_DATA) => ({
              ...element,
              TOTAL: (element.NEWCODE || 0) + (element.ECN || 0),
            })
          );
          setMonthlyNewCode(loadeddata);
        } else {
          setMonthlyNewCode([]);
        }
      } catch (error) {
        console.error(error);
        setMonthlyNewCode([]);
      }
    },
    [df, fromdate, todate, cust_name]
  );

  // 4. API: YEARLY NEW CODE
  const handle_getYearlyNewCodeData = useCallback(
    async (FACTORY: string, listCode: string[]) => {
      const td = moment().add(0, "day").format("YYYY-MM-DD");
      const frd = moment().add(-3650, "day").format("YYYY-MM-DD");
      try {
        const response = await generalQuery("rndyearlynewcode", {
          FACTORY: FACTORY,
          FROM_DATE: df ? frd : fromdate,
          TO_DATE: df ? td : todate,
          codeArray: df ? [] : listCode,
          CUST_NAME_KD: cust_name,
        });
        if (response.data.tk_status !== "NG") {
          const loadeddata: RND_NEWCODE_TREND_DATA[] = response.data.data.map(
            (element: RND_NEWCODE_TREND_DATA) => ({
              ...element,
              TOTAL: (element.NEWCODE || 0) + (element.ECN || 0),
            })
          );
          setYearlyNewCode(loadeddata);
        } else {
          setYearlyNewCode([]);
        }
      } catch (error) {
        console.error(error);
        setYearlyNewCode([]);
      }
    },
    [df, fromdate, todate, cust_name]
  );

  // 5. API: NEW CODE BY CUSTOMER
  const handle_newCodeByCustomer = useCallback(
    async (from_date: string, to_date: string, listCode: string[]) => {
      const td = moment().add(0, "day").format("YYYY-MM-DD");
      const frd = moment().add(-14, "day").format("YYYY-MM-DD");
      try {
        const response = await generalQuery("rndNewCodeByCustomer", {
          FROM_DATE: df ? frd : from_date,
          TO_DATE: df ? td : to_date,
          codeArray: listCode,
          CUST_NAME_KD: cust_name,
        });
        if (response.data.tk_status !== "NG") {
          const loadeddata: RND_NEWCODE_BY_CUSTOMER[] = response.data.data.map(
            (element: RND_NEWCODE_BY_CUSTOMER, index: number) => ({
              ...element,
              id: index,
            })
          );
          setNewCodeByCustomer(loadeddata);
        } else {
          setNewCodeByCustomer([]);
        }
      } catch (error) {
        console.error(error);
        setNewCodeByCustomer([]);
      }
    },
    [df, cust_name]
  );

  // 6. API: NEW CODE BY PRODUCT TYPE
  const handle_newCodeByProdType = useCallback(
    async (from_date: string, to_date: string, listCode: string[]) => {
      const td = moment().add(0, "day").format("YYYY-MM-DD");
      const frd = moment().add(-14, "day").format("YYYY-MM-DD");
      try {
        const response = await generalQuery("rndNewCodeByProdType", {
          FROM_DATE: df ? frd : from_date,
          TO_DATE: df ? td : to_date,
          codeArray: listCode,
          CUST_NAME_KD: cust_name,
        });
        if (response.data.tk_status !== "NG") {
          const loadeddata: RND_NEWCODE_BY_PRODTYPE[] = response.data.data.map(
            (element: RND_NEWCODE_BY_PRODTYPE, index: number) => ({
              ...element,
              id: index,
            })
          );
          setNewCodeByProdType(loadeddata);
        } else {
          setNewCodeByProdType([]);
        }
      } catch (error) {
        console.error(error);
        setNewCodeByProdType([]);
      }
    },
    [df, cust_name]
  );

  // 7. API: DESIGN REQUEST TRENDING (XXX)
  const handle_getYCTKData = useCallback(
    async (from_date: string, to_date: string) => {
      const td = moment().add(0, "day").format("YYYY-MM-DD");
      const frd = moment().add(-14, "day").format("YYYY-MM-DD");
      try {
        const [d, w, m, y] = await Promise.all([
          f_load_YCTK_TREND_DAILY({ FROM_DATE: df ? frd : from_date, TO_DATE: df ? td : to_date }),
          f_load_YCTK_TREND_WEEKLY({ FROM_DATE: df ? moment().add(-70, "day").format("YYYY-MM-DD") : from_date, TO_DATE: df ? td : to_date }),
          f_load_YCTK_TREND_MONTHLY({ FROM_DATE: df ? moment().add(-365, "day").format("YYYY-MM-DD") : from_date, TO_DATE: df ? td : to_date }),
          f_load_YCTK_TREND_YEARLY({ FROM_DATE: df ? moment().add(-3650, "day").format("YYYY-MM-DD") : from_date, TO_DATE: df ? td : to_date }),
        ]);
        setYCTKDailyNewCode(d || []);
        setYCTKWeeklyNewCode(w || []);
        setYCTKMonthlyNewCode(m || []);
        setYCTKYearlyNewCode(y || []);
      } catch (e) {
        console.error(e);
      }
    },
    [df]
  );

  // 8. API: FILM SAVING TRENDING (PVN)
  const handle_getFilmSavingData = useCallback(
    async (from_date: string, to_date: string) => {
      const td = moment().add(0, "day").format("YYYY-MM-DD");
      const frd = moment().add(-14, "day").format("YYYY-MM-DD");
      try {
        const [d, w, m, y, back] = await Promise.all([
          f_load_film_saving_daily({ FROM_DATE: df ? frd : from_date, TO_DATE: df ? td : to_date }),
          f_load_film_saving_weekly({ FROM_DATE: df ? moment().add(-70, "day").format("YYYY-MM-DD") : from_date, TO_DATE: df ? td : to_date }),
          f_load_film_saving_monthly({ FROM_DATE: df ? moment().add(-365, "day").format("YYYY-MM-DD") : from_date, TO_DATE: df ? td : to_date }),
          f_load_film_saving_yearly({ FROM_DATE: df ? moment().add(-3650, "day").format("YYYY-MM-DD") : from_date, TO_DATE: df ? td : to_date }),
          f_load_tilefilmbanBackData({ FROM_DATE: df ? moment().add(-365, "day").format("YYYY-MM-DD") : from_date, TO_DATE: df ? td : to_date }),
        ]);
        setFilmSavingDaily(d || []);
        setFilmSavingWeekly(w || []);
        setFilmSavingMonthly(m || []);
        setFilmSavingYearly(y || []);
        setTileFilmBanBackData(back || []);
      } catch (e) {
        console.error(e);
      }
    },
    [df]
  );

  // 9. API: DAO FILM ERR
  const handle_getDaoFilmErr = useCallback(
    async (from_date: string, to_date: string) => {
      const td = moment().add(0, "day").format("YYYY-MM-DD");
      const frd = moment().add(-14, "day").format("YYYY-MM-DD");
      try {
        const res = await f_LoadDaoFilmErr({
          FROM_DATE: df ? frd : from_date,
          TO_DATE: df ? td : to_date,
        });
        setDaoFilmErr(res || []);
      } catch (e) {
        console.error(e);
      }
    },
    [df]
  );

  // HÀM TẢI DỮ LIỆU CHÍNH (INIT FUNCTION)
  const initFunction = useCallback(
    async (showToast: boolean = true) => {
      setIsLoading(true);
      if (showToast) {
        Swal.fire({
          title: "Đang tải báo cáo",
          text: "Đang xử lý dữ liệu R&D, vui lòng chờ trong giây lát...",
          icon: "info",
          showCancelButton: false,
          allowOutsideClick: false,
          showConfirmButton: false,
        });
      }

      const promises: Promise<any>[] = [
        handle_getDailyNewCodeData("ALL", searchCodeArray),
        handle_getWeeklyNewCodeData("ALL", searchCodeArray),
        handle_getMonthlyNewCodeData("ALL", searchCodeArray),
        handle_getYearlyNewCodeData("ALL", searchCodeArray),
        handle_newCodeByCustomer(fromdate, todate, searchCodeArray),
        handle_newCodeByProdType(fromdate, todate, searchCodeArray),
        handle_getDaoFilmErr(fromdate, todate),
      ];

      if (company === "PVN") {
        promises.push(handle_getFilmSavingData(fromdate, todate));
      } else if (company === "XXX") {
        promises.push(handle_getYCTKData(fromdate, todate));
      }

      try {
        await Promise.all(promises);
        setIsLoading(false);
        if (showToast) {
          Swal.fire("Thông báo", "Đã nạp xong báo cáo R&D", "success");
        }
      } catch (error) {
        console.error(error);
        setIsLoading(false);
        if (showToast) {
          Swal.fire("Lỗi", "Không thể tải báo cáo R&D", "error");
        }
      }
    },
    [
      handle_getDailyNewCodeData,
      handle_getWeeklyNewCodeData,
      handle_getMonthlyNewCodeData,
      handle_getYearlyNewCodeData,
      handle_newCodeByCustomer,
      handle_newCodeByProdType,
      handle_getDaoFilmErr,
      handle_getFilmSavingData,
      handle_getYCTKData,
      searchCodeArray,
      fromdate,
      todate,
      company,
    ]
  );

  // ON MOUNT: Chỉ chạy 1 lần lúc mở tab, nạp êm dịu showToast = false
  useEffect(() => {
    initFunction(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // TÍNH TOÁN KPI REALTIME (TODAY, THIS WEEK, THIS MONTH, THIS YEAR)
  const kpiSummary: RNDKpiSummary = useMemo(() => {
    // 1. Today vs Yesterday
    const tCur = dailynewcode?.[0];
    const tPrev = dailynewcode?.[1];
    const tNew = tCur?.NEWCODE || 0;
    const tEcn = tCur?.ECN || 0;
    const tTotal = tNew + tEcn;
    const tPrevTotal = (tPrev?.NEWCODE || 0) + (tPrev?.ECN || 0);
    const tRate = tPrevTotal > 0 ? ((tTotal - tPrevTotal) / tPrevTotal) * 100 : 0;

    // 2. This Week vs Last Week
    const wCur = weeklynewcode?.[0];
    const wPrev = weeklynewcode?.[1];
    const wNew = wCur?.NEWCODE || 0;
    const wEcn = wCur?.ECN || 0;
    const wTotal = wNew + wEcn;
    const wPrevTotal = (wPrev?.NEWCODE || 0) + (wPrev?.ECN || 0);
    const wRate = wPrevTotal > 0 ? ((wTotal - wPrevTotal) / wPrevTotal) * 100 : 0;

    // 3. This Month vs Last Month
    const mCur = monthlynewcode?.[0];
    const mPrev = monthlynewcode?.[1];
    const mNew = mCur?.NEWCODE || 0;
    const mEcn = mCur?.ECN || 0;
    const mTotal = mNew + mEcn;
    const mPrevTotal = (mPrev?.NEWCODE || 0) + (mPrev?.ECN || 0);
    const mRate = mPrevTotal > 0 ? ((mTotal - mPrevTotal) / mPrevTotal) * 100 : 0;

    // 4. This Year vs Last Year
    const yCur = yearlynewcode?.[0];
    const yPrev = yearlynewcode?.[1];
    const yNew = yCur?.NEWCODE || 0;
    const yEcn = yCur?.ECN || 0;
    const yTotal = yNew + yEcn;
    const yPrevTotal = (yPrev?.NEWCODE || 0) + (yPrev?.ECN || 0);
    const yRate = yPrevTotal > 0 ? ((yTotal - yPrevTotal) / yPrevTotal) * 100 : 0;

    return {
      today: { total: tTotal, newCode: tNew, ecn: tEcn, rate: tRate },
      thisWeek: { total: wTotal, newCode: wNew, ecn: wEcn, rate: wRate },
      thisMonth: { total: mTotal, newCode: mNew, ecn: mEcn, rate: mRate },
      thisYear: { total: yTotal, newCode: yNew, ecn: yEcn, rate: yRate },
    };
  }, [dailynewcode, weeklynewcode, monthlynewcode, yearlynewcode]);

  return {
    fromdate,
    setFromDate,
    todate,
    setToDate,
    cust_name,
    setCust_Name,
    df,
    setDF,
    searchCodeArray,
    setSearchCodeArray,
    activeTab,
    setActiveTab,
    isFullscreen,
    toggleFullscreen,
    isLoading,
    kpiSummary,
    dailynewcode,
    weeklynewcode,
    monthlynewcode,
    yearlynewcode,
    newcodebycustomer,
    newcodebyprodtype,
    filmSavingDaily,
    filmSavingWeekly,
    filmSavingMonthly,
    filmSavingYearly,
    tilefilmbanBackData,
    yctkdailynewcode,
    yctkweeklynewcode,
    yctkmonthlynewcode,
    yctkyearlynewcode,
    daofilmerr,
    initFunction,
    company,
  };
};

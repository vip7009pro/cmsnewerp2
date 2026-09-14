import { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import Swal from 'sweetalert2';
import { generalQuery } from '../../../../api/Api';
import {
  IQC_TREND_DATA,
  IQC_VENDOR_NGRATE_DATA,
  IQC_FAILING_TREND_DATA,
  IQC_FAIL_PENDING,
} from '../../interfaces/qcInterface';
import { CodeListData } from '../../../kinhdoanh/interfaces/kdInterface';
import {
  f_loadIQCDailyNGTrend,
  f_loadIQCWeeklyTrend,
  f_loadIQCMonthlyTrend,
  f_loadIQCYearlyTrend,
  f_loadVendorIncomingNGRateByWeek,
  f_loadVendorIncomingNGRateByMonth,
  f_loadIQCFailTrending,
  f_loadIQCHoldingTrending,
  f_loadIQCFailPending,
  f_loadIQCHoldingPending,
} from '../../utils/qcUtils';

export const useIQCReportData = () => {
  const [dailyppm, setDailyPPM] = useState<IQC_TREND_DATA[]>([]);
  const [weeklyppm, setWeeklyPPM] = useState<IQC_TREND_DATA[]>([]);
  const [monthlyppm, setMonthlyPPM] = useState<IQC_TREND_DATA[]>([]);
  const [yearlyppm, setYearlyPPM] = useState<IQC_TREND_DATA[]>([]);
  const [weeklyvendorppm, setWeeklyVendorPPM] = useState<IQC_VENDOR_NGRATE_DATA[]>([]);
  const [monthlyvendorppm, setMonthlyVendorPPM] = useState<IQC_VENDOR_NGRATE_DATA[]>([]);
  const [weeklyfailingtrending, setWeeklyFailingTrending] = useState<IQC_FAILING_TREND_DATA[]>([]);
  const [weeklyholdingtrending, setWeeklyHoldingTrending] = useState<IQC_FAILING_TREND_DATA[]>([]);
  const [iqcfailpending, setIqcFailPending] = useState<IQC_FAIL_PENDING[]>([]);
  const [iqcholdingpending, setIqcHoldingPending] = useState<IQC_FAIL_PENDING[]>([]);

  // Bộ lọc
  const [fromdate, setFromDate] = useState<string>(moment().add(-14, 'day').format('YYYY-MM-DD'));
  const [todate, setToDate] = useState<string>(moment().format('YYYY-MM-DD'));
  const [worstby, setWorstBy] = useState<string>('AMOUNT');
  const [ng_type, setNg_Type] = useState<string>('ALL');
  const [cust_name, setCust_Name] = useState<string>('');
  const [codeList, setCodeList] = useState<CodeListData[]>([]);
  const [searchCodeArray, setSearchCodeArray] = useState<string[]>([]);
  const [selectedCode, setSelectedCode] = useState<CodeListData | null>({
    G_CODE: '6A00001B',
    G_NAME: 'GT-I9500_SJ68-01284A',
    G_NAME_KD: 'GT-I9500_SJ68-01284A',
    PROD_LAST_PRICE: 0,
    USE_YN: 'N',
  });
  const [df, setDF] = useState<boolean>(true);

  // Phân hệ hiển thị (Segmented Jump Tab)
  const [activeTab, setActiveTab] = useState<string>('all');

  const handle_getDailyPPM = useCallback(async (FACTORY: string, listCode: string[]) => {
    const td = moment().add(0, 'day').format('YYYY-MM-DD');
    const frd = moment().add(-12, 'day').format('YYYY-MM-DD');
    const data = {
      FACTORY: FACTORY,
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name,
    };
    const result = await f_loadIQCDailyNGTrend(data);
    setDailyPPM(result);
  }, [df, fromdate, todate, cust_name]);

  const handle_getWeeklyPPM = useCallback(async (FACTORY: string, listCode: string[]) => {
    const td = moment().add(0, 'day').format('YYYY-MM-DD');
    const frd = moment().add(-70, 'day').format('YYYY-MM-DD');
    const data = {
      FACTORY: FACTORY,
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name,
    };
    const result = await f_loadIQCWeeklyTrend(data);
    setWeeklyPPM(result);
  }, [df, fromdate, todate, cust_name]);

  const handle_getMonthlyPPM = useCallback(async (FACTORY: string, listCode: string[]) => {
    const td = moment().add(0, 'day').format('YYYY-MM-DD');
    const frd = moment().add(-365, 'day').format('YYYY-MM-DD');
    const data = {
      FACTORY: FACTORY,
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name,
    };
    const result = await f_loadIQCMonthlyTrend(data);
    setMonthlyPPM(result);
  }, [df, fromdate, todate, cust_name]);

  const handle_getYearlyPPM = useCallback(async (FACTORY: string, listCode: string[]) => {
    const td = moment().add(0, 'day').format('YYYY-MM-DD');
    const frd = moment().add(-3650, 'day').format('YYYY-MM-DD');
    const data = {
      FACTORY: FACTORY,
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name,
    };
    const result = await f_loadIQCYearlyTrend(data);
    setYearlyPPM(result);
  }, [df, fromdate, todate, cust_name]);

  const handle_getIncomingNGRateByWeek = useCallback(async (from_date: string, to_date: string, listCode: string[]) => {
    const td = moment().add(0, 'day').format('YYYY-MM-DD');
    const frd = moment().add(-180, 'day').format('YYYY-MM-DD');
    const data = {
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name,
    };
    const result = await f_loadVendorIncomingNGRateByWeek(data);
    setWeeklyVendorPPM(result);
  }, [df, cust_name]);

  const handle_getIncomingNGRateByMonth = useCallback(async (from_date: string, to_date: string, listCode: string[]) => {
    const td = moment().add(0, 'day').format('YYYY-MM-DD');
    const frd = moment().add(-365, 'day').format('YYYY-MM-DD');
    const data = {
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name,
    };
    const result = await f_loadVendorIncomingNGRateByMonth(data);
    setMonthlyVendorPPM(result);
  }, [df, cust_name]);

  const handle_weeklyFailingTrending = useCallback(async (from_date: string, to_date: string, listCode: string[]) => {
    const td = moment().add(0, 'day').format('YYYY-MM-DD');
    const frd = moment().add(-140, 'day').format('YYYY-MM-DD');
    const data = {
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name,
    };
    const result = await f_loadIQCFailTrending(data);
    setWeeklyFailingTrending(result);
  }, [df, cust_name]);

  const handle_weeklyHoldingTrending = useCallback(async (from_date: string, to_date: string, listCode: string[]) => {
    const td = moment().add(0, 'day').format('YYYY-MM-DD');
    const frd = moment().add(-365, 'day').format('YYYY-MM-DD');
    const data = {
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name,
    };
    const result = await f_loadIQCHoldingTrending(data);
    setWeeklyHoldingTrending(result);
  }, [df, cust_name]);

  const handle_iqcFailPending = useCallback(async (from_date: string, to_date: string, listCode: string[]) => {
    const td = moment().add(0, 'day').format('YYYY-MM-DD');
    const frd = moment().add(-365, 'day').format('YYYY-MM-DD');
    const data = {
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name,
    };
    const result = await f_loadIQCFailPending(data);
    setIqcFailPending(result);
  }, [df, cust_name]);

  const handle_iqcHoldingPending = useCallback(async (from_date: string, to_date: string, listCode: string[]) => {
    const td = moment().add(0, 'day').format('YYYY-MM-DD');
    const frd = moment().add(-365, 'day').format('YYYY-MM-DD');
    const data = {
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name,
    };
    const result = await f_loadIQCHoldingPending(data);
    setIqcHoldingPending(result);
  }, [df, cust_name]);

  const getcodelist = (G_NAME: string) => {
    generalQuery('selectcodeList', { G_NAME: G_NAME })
      .then((response) => {
        if (response.data.tk_status !== 'NG') {
          setCodeList(response.data.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const initFunction = useCallback(async () => {
    Swal.fire({
      title: 'Đang tải báo cáo',
      text: 'Đang tải dữ liệu báo cáo IQC, hãy chờ chút...',
      icon: 'info',
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: 'OK',
      showConfirmButton: false,
    });

    try {
      await Promise.all([
        handle_getDailyPPM('ALL', searchCodeArray),
        handle_getWeeklyPPM('ALL', searchCodeArray),
        handle_getMonthlyPPM('ALL', searchCodeArray),
        handle_getYearlyPPM('ALL', searchCodeArray),
        handle_getIncomingNGRateByMonth(fromdate, todate, searchCodeArray),
        handle_getIncomingNGRateByWeek(fromdate, todate, searchCodeArray),
        handle_weeklyFailingTrending(fromdate, todate, searchCodeArray),
        handle_weeklyHoldingTrending(fromdate, todate, searchCodeArray),
        handle_iqcFailPending(fromdate, todate, searchCodeArray),
        handle_iqcHoldingPending(fromdate, todate, searchCodeArray),
      ]);
      Swal.fire({
        title: 'Thông báo',
        text: 'Đã nạp xong toàn bộ dữ liệu báo cáo IQC!',
        icon: 'success',
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire('Lỗi', 'Không thể nạp dữ liệu báo cáo IQC!', 'error');
    }
  }, [
    handle_getDailyPPM,
    handle_getWeeklyPPM,
    handle_getMonthlyPPM,
    handle_getYearlyPPM,
    handle_getIncomingNGRateByMonth,
    handle_getIncomingNGRateByWeek,
    handle_weeklyFailingTrending,
    handle_weeklyHoldingTrending,
    handle_iqcFailPending,
    handle_iqcHoldingPending,
    searchCodeArray,
    fromdate,
    todate,
  ]);

  const handleSelectCode = useCallback((code: CodeListData | null) => {
    setSelectedCode(code);
    if (code?.G_CODE && !searchCodeArray.includes(code.G_CODE)) {
      setSearchCodeArray((prev) => [...prev, code.G_CODE]);
    }
  }, [searchCodeArray]);

  const handleRemoveCode = useCallback((code: string) => {
    setSearchCodeArray((prev) => prev.filter((c) => c !== code));
  }, []);

  const handleClearCodeArray = useCallback(() => {
    setSearchCodeArray([]);
  }, []);

  useEffect(() => {
    getcodelist('');
    initFunction();
  }, []);

  return {
    dailyppm,
    weeklyppm,
    monthlyppm,
    yearlyppm,
    weeklyvendorppm,
    monthlyvendorppm,
    weeklyfailingtrending,
    weeklyholdingtrending,
    iqcfailpending,
    iqcholdingpending,
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
    codeList,
    searchCodeArray,
    setSearchCodeArray,
    selectedCode,
    setSelectedCode,
    handleSelectCode,
    handleRemoveCode,
    handleClearCodeArray,
    df,
    setDF,
    activeTab,
    setActiveTab,
    initFunction,
  };
};

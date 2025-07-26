import { useState, useEffect, useCallback } from 'react';
import { CNT_GAP_DATA } from "../../../qc/interfaces/qcInterface";
import { f_load_ALL_GAP_RATE_DATA, f_load_ALL_HOAN_THANH_TRUOC_HAN_RATE_DATA,  f_load_dailyAchive_data,  f_load_dailyEff_data,  f_load_KT_GAP_RATE_DATA, f_load_monthlyAchive_data, f_load_monthlyEff_data, f_load_SX_Daily_Loss_Trend, f_load_SX_GAP_RATE_DATA, f_load_SX_Monthly_Loss_Trend, f_load_SX_Weekly_Loss_Trend, f_load_SX_Yearly_Loss_Trend, f_load_SXLossTimeByEmpl, f_load_SXLossTimeByReason, f_load_weeklyAchive_data,f_load_weeklyEff_data,f_load_YCSX_GAP_RATE_DATA, f_load_yearlyAchive_data, f_load_yearlyEff_data, f_loadPlanLossData,  } from '../../../qlsx/QLSXPLAN/utils/khsxUtils';
import moment from 'moment';
import { PLAN_LOSS_DATA, PRODUCTION_EFFICIENCY_DATA, SX_ACHIVE_DATA, SX_LOSSTIME_BY_EMPL, SX_LOSSTIME_REASON_DATA, SX_TREND_LOSS_DATA } from '../../../qlsx/QLSXPLAN/interfaces/khsxInterface';

// Hook 1: Lấy dữ liệu theo khoảng thời gian
export const usehandle_loadYCSX_GAP_RATE_DATA = (fromDate: string, toDate: string, df: boolean) => {
  const [data, setData] = useState<CNT_GAP_DATA[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  

  let td = moment().add(0, "day").format("YYYY-MM-DD");
  let frd = moment().add(-12, "day").format("YYYY-MM-DD");

  const fetchData = useCallback(
    async () => {  
      setLoading(true);
      setError(null);
      setData(await f_load_YCSX_GAP_RATE_DATA({
            FROM_DATE: df ? frd : fromDate,
            TO_DATE: df ? td : toDate,            
          })); 
    },
    [fromDate, toDate, df]
  );

  const triggerFetch = useCallback(() => {
    fetchData();
  }, [fromDate, toDate, fetchData]);

  return { data, loading, error, triggerFetch };
};

export const usehandle_loadSX_GAP_RATE_DATA = (fromDate: string, toDate: string, df: boolean) => {
  const [data, setData] = useState<CNT_GAP_DATA[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  

  let td = moment().add(0, "day").format("YYYY-MM-DD");
  let frd = moment().add(-12, "day").format("YYYY-MM-DD");

  const fetchData = useCallback(
    async () => {  
      setLoading(true);
      setError(null);
      setData(await f_load_SX_GAP_RATE_DATA({
            FROM_DATE: df ? frd : fromDate,
            TO_DATE: df ? td : toDate,            
          })); 
    },
    [fromDate, toDate, df]
  );

  const triggerFetch = useCallback(() => {
    fetchData();
  }, [fromDate, toDate, fetchData]);

  return { data, loading, error, triggerFetch };
};

export const usehandle_loadKT_GAP_RATE_DATA = (fromDate: string, toDate: string, df: boolean) => {
  const [data, setData] = useState<CNT_GAP_DATA[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  

  let td = moment().add(0, "day").format("YYYY-MM-DD");
  let frd = moment().add(-12, "day").format("YYYY-MM-DD");

  const fetchData = useCallback(
    async () => {  
      setLoading(true);
      setError(null);
      setData(await f_load_KT_GAP_RATE_DATA({
            FROM_DATE: df ? frd : fromDate,
            TO_DATE: df ? td : toDate,            
          })); 
    },
    [fromDate, toDate, df]
  );

  const triggerFetch = useCallback(() => {
    fetchData();
  }, [fromDate, toDate, fetchData]);

  return { data, loading, error, triggerFetch };
};

export const usehandle_loadALL_GAP_RATE_DATA = (fromDate: string, toDate: string, df: boolean) => {
  const [data, setData] = useState<CNT_GAP_DATA[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  

  let td = moment().add(0, "day").format("YYYY-MM-DD");
  let frd = moment().add(-12, "day").format("YYYY-MM-DD");

  const fetchData = useCallback(
    async () => {  
      setLoading(true);
      setError(null);
      setData(await f_load_ALL_GAP_RATE_DATA({
            FROM_DATE: df ? frd : fromDate,
            TO_DATE: df ? td : toDate,            
          })); 
    },
    [fromDate, toDate, df]
  );

  const triggerFetch = useCallback(() => {
    fetchData();
  }, [fromDate, toDate, fetchData]);

  return { data, loading, error, triggerFetch };
};

export const usehandle_loadALL_HOAN_THANH_TRUOC_HAN_RATE_DATA = (fromDate: string, toDate: string, df: boolean) => {
  const [data, setData] = useState<CNT_GAP_DATA[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  

  let td = moment().add(0, "day").format("YYYY-MM-DD");
  let frd = moment().add(-12, "day").format("YYYY-MM-DD");

  const fetchData = useCallback(
    async () => {  
      setLoading(true);
      setError(null);
      setData(await f_load_ALL_HOAN_THANH_TRUOC_HAN_RATE_DATA({
            FROM_DATE: df ? frd : fromDate,
            TO_DATE: df ? td : toDate,            
          })); 
    },
    [fromDate, toDate, df]
  );

  const triggerFetch = useCallback(() => {
    fetchData();
  }, [fromDate, toDate, fetchData]);

  return { data, loading, error, triggerFetch };
};

export const usehandle_load_SX_Daily_Loss_Trend = (fromDate: string, toDate: string, df: boolean) => {
  const [data, setData] = useState<SX_TREND_LOSS_DATA[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  

  let td = moment().add(0, "day").format("YYYY-MM-DD");
  let frd = moment().add(-12, "day").format("YYYY-MM-DD");

  const fetchData = useCallback(
    async () => {  
      setLoading(true);
      setError(null);
      setData(await f_load_SX_Daily_Loss_Trend({
            FROM_DATE: df ? frd : fromDate,
            TO_DATE: df ? td : toDate,            
          })); 
    },
    [fromDate, toDate, df]
  );

  const triggerFetch = useCallback(() => {
    fetchData();
  }, [fromDate, toDate, fetchData]);

  return { data, loading, error, triggerFetch };
};

export const usehandle_load_SX_Weekly_Loss_Trend = (fromDate: string, toDate: string, df: boolean) => {
  const [data, setData] = useState<SX_TREND_LOSS_DATA[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  

  let td = moment().add(0, "day").format("YYYY-MM-DD");
  let frd = moment().add(-70, "day").format("YYYY-MM-DD");

  const fetchData = useCallback(
    async () => {  
      setLoading(true);
      setError(null);
      setData(await f_load_SX_Weekly_Loss_Trend({
            FROM_DATE: df ? frd : fromDate,
            TO_DATE: df ? td : toDate,            
          })); 
    },
    [fromDate, toDate, df]
  );

  const triggerFetch = useCallback(() => {
    fetchData();
  }, [fromDate, toDate, fetchData]);

  return { data, loading, error, triggerFetch };
};

export const usehandle_load_SX_Monthly_Loss_Trend = (fromDate: string, toDate: string, df: boolean) => {
  const [data, setData] = useState<SX_TREND_LOSS_DATA[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  

  let td = moment().add(0, "day").format("YYYY-MM-DD");
  let frd = moment().add(-365, "day").format("YYYY-MM-DD");

  const fetchData = useCallback(
    async () => {  
      setLoading(true);
      setError(null);
      setData(await f_load_SX_Monthly_Loss_Trend({
            FROM_DATE: df ? frd : fromDate,
            TO_DATE: df ? td : toDate,            
          })); 
    },
    [fromDate, toDate, df]
  );

  const triggerFetch = useCallback(() => {
    fetchData();
  }, [fromDate, toDate, fetchData]);

  return { data, loading, error, triggerFetch };
};

export const usehandle_load_SX_Yearly_Loss_Trend = (fromDate: string, toDate: string, df: boolean) => {
  const [data, setData] = useState<SX_TREND_LOSS_DATA[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  

  let td = moment().add(0, "day").format("YYYY-MM-DD");
  let frd = moment().add(-3650, "day").format("YYYY-MM-DD");

  const fetchData = useCallback(
    async () => {  
      setLoading(true);
      setError(null);
      setData(await f_load_SX_Yearly_Loss_Trend({
            FROM_DATE: df ? frd : fromDate,
            TO_DATE: df ? td : toDate,            
          })); 
    },
    [fromDate, toDate, df]
  );

  const triggerFetch = useCallback(() => {
    fetchData();
  }, [fromDate, toDate, fetchData]);

  return { data, loading, error, triggerFetch };
};

export const usehandle_getDailyAchiveData = (fromDate: string, toDate: string, df: boolean) => {
  const [data, setData] = useState<SX_ACHIVE_DATA[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  

  let td = moment().add(0, "day").format("YYYY-MM-DD");
  let frd = moment().add(-12, "day").format("YYYY-MM-DD");

  const fetchData = useCallback(
    async () => {  
      setLoading(true);
      setError(null);
      setData(await f_load_dailyAchive_data({
            FROM_DATE: df ? frd : fromDate,
            TO_DATE: df ? td : toDate,            
          })); 
    },
    [fromDate, toDate, df]
  );

  const triggerFetch = useCallback(() => {
    fetchData();
  }, [fromDate, toDate, fetchData]);

  return { data, loading, error, triggerFetch };
};

export const usehandle_getWeeklyAchiveData = (fromDate: string, toDate: string, df: boolean) => {
  const [data, setData] = useState<SX_ACHIVE_DATA[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  

  let td = moment().add(0, "day").format("YYYY-MM-DD");
  let frd = moment().add(-70, "day").format("YYYY-MM-DD");

  const fetchData = useCallback(
    async () => {  
      setLoading(true);
      setError(null);
      setData(await f_load_weeklyAchive_data({
            FROM_DATE: df ? frd : fromDate,
            TO_DATE: df ? td : toDate,            
          })); 
    },
    [fromDate, toDate, df]
  );

  const triggerFetch = useCallback(() => {
    fetchData();
  }, [fromDate, toDate, fetchData]);

  return { data, loading, error, triggerFetch };
};

export const usehandle_getMonthlyAchiveData = (fromDate: string, toDate: string, df: boolean) => {
  const [data, setData] = useState<SX_ACHIVE_DATA[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  

  let td = moment().add(0, "day").format("YYYY-MM-DD");
  let frd = moment().add(-365, "day").format("YYYY-MM-DD");

  const fetchData = useCallback(
    async () => {  
      setLoading(true);
      setError(null);
      setData(await f_load_monthlyAchive_data({
            FROM_DATE: df ? frd : fromDate,
            TO_DATE: df ? td : toDate,            
          })); 
    },
    [fromDate, toDate, df]
  );

  const triggerFetch = useCallback(() => {
    fetchData();
  }, [fromDate, toDate, fetchData]);

  return { data, loading, error, triggerFetch };
};

export const usehandle_getYearlyAchiveData = (fromDate: string, toDate: string, df: boolean) => {
  const [data, setData] = useState<SX_ACHIVE_DATA[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  

  let td = moment().add(0, "day").format("YYYY-MM-DD");
  let frd = moment().add(-3650, "day").format("YYYY-MM-DD");

  const fetchData = useCallback(
    async () => {  
      setLoading(true);
      setError(null);
      setData(await f_load_yearlyAchive_data({
            FROM_DATE: df ? frd : fromDate,
            TO_DATE: df ? td : toDate,            
          })); 
    },
    [fromDate, toDate, df]
  );

  const triggerFetch = useCallback(() => {
    fetchData();
  }, [fromDate, toDate, fetchData]);

  return { data, loading, error, triggerFetch };
};

export const usehandle_getDailyEffData = (fromDate: string, toDate: string, df: boolean) => {
  const [data, setData] = useState<PRODUCTION_EFFICIENCY_DATA[]>([]);
  const [overview, setOverview] = useState<PRODUCTION_EFFICIENCY_DATA>({
    ALVB_TIME: 0,
    HIEU_SUAT_TIME:0,
    LOSS_TIME:0,
    LOSS_TIME_RATE:0,
    OPERATION_RATE:0,
    PURE_RUN_RATE:0,
    PURE_RUN_TIME:0,
    RUN_TIME_SX:0,
    SETTING_TIME:0,
    SETTING_TIME_RATE:0,
    TOTAL_TIME:0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  

  let td = moment().add(0, "day").format("YYYY-MM-DD");
  let frd = moment().add(-12, "day").format("YYYY-MM-DD");

  const fetchData = useCallback(
    async () => {  
      setLoading(true);
      setError(null);
      let result = await f_load_dailyEff_data({
            FROM_DATE: df ? frd : fromDate,
            TO_DATE: df ? td : toDate,            
          }); 
      setData(result.efficiency);
      setOverview(result.overview);
    },
    [fromDate, toDate, df]
  );

  const triggerFetch = useCallback(() => {
    fetchData();
  }, [fromDate, toDate, fetchData]);

  return { data,overview, loading, error, triggerFetch};
};
export const usehandle_getWeeklyEffData = (fromDate: string, toDate: string, df: boolean) => {
  const [data, setData] = useState<PRODUCTION_EFFICIENCY_DATA[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  

  let td = moment().add(0, "day").format("YYYY-MM-DD");
  let frd = moment().add(-70, "day").format("YYYY-MM-DD");

  const fetchData = useCallback(
    async () => {  
      setLoading(true);
      setError(null);
      let result = await f_load_weeklyEff_data({
            FROM_DATE: df ? frd : fromDate,
            TO_DATE: df ? td : toDate,            
          }); 
      setData(result);     
    },
    [fromDate, toDate, df]
  );

  const triggerFetch = useCallback(() => {
    fetchData();
  }, [fromDate, toDate, fetchData]);

  return { data, loading, error, triggerFetch};
};

export const usehandle_getMonthlyEffData = (fromDate: string, toDate: string, df: boolean) => {
  const [data, setData] = useState<PRODUCTION_EFFICIENCY_DATA[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  

  let td = moment().add(0, "day").format("YYYY-MM-DD");
  let frd = moment().add(-365, "day").format("YYYY-MM-DD");

  const fetchData = useCallback(
    async () => {  
      setLoading(true);
      setError(null);
      let result = await f_load_monthlyEff_data({
            FROM_DATE: df ? frd : fromDate,
            TO_DATE: df ? td : toDate,            
          }); 
      setData(result);     
    },
    [fromDate, toDate, df]
  );

  const triggerFetch = useCallback(() => {
    fetchData();
  }, [fromDate, toDate, fetchData]);

  return { data, loading, error, triggerFetch};
};

export const usehandle_getYearlyEffData = (fromDate: string, toDate: string, df: boolean) => {
  const [data, setData] = useState<PRODUCTION_EFFICIENCY_DATA[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  

  let td = moment().add(0, "day").format("YYYY-MM-DD");
  let frd = moment().add(-3650, "day").format("YYYY-MM-DD");

  const fetchData = useCallback(
    async () => {  
      setLoading(true);
      setError(null);
      let result = await f_load_yearlyEff_data({
            FROM_DATE: df ? frd : fromDate,
            TO_DATE: df ? td : toDate,            
          }); 
      setData(result);     
    },
    [fromDate, toDate, df]
  );

  const triggerFetch = useCallback(() => {
    fetchData();
  }, [fromDate, toDate, fetchData]);

  return { data, loading, error, triggerFetch};
};


export const usehandle_getPlanLossData = (fromDate: string, toDate: string, df: boolean) => {
  const [data, setData] = useState<PLAN_LOSS_DATA[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  

  let td = moment().add(0, "day").format("YYYY-MM-DD");
  let frd = moment().add(-12, "day").format("YYYY-MM-DD");

  const fetchData = useCallback(
    async () => {  
      setLoading(true);
      setError(null);
      let result = await f_loadPlanLossData({
            FROM_DATE: df ? frd : fromDate,
            TO_DATE: df ? td : toDate,            
          }); 
      setData(result);     
    },
    [fromDate, toDate, df]
  );

  const triggerFetch = useCallback(() => {
    fetchData();
  }, [fromDate, toDate, fetchData]);

  return { data, loading, error, triggerFetch};
};

export const usehandle_getSXLossTimeByReason = (fromDate: string, toDate: string, df: boolean) => {
  const [data, setData] = useState<SX_LOSSTIME_REASON_DATA[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  

  let td = moment().add(0, "day").format("YYYY-MM-DD");
  let frd = moment().add(-12, "day").format("YYYY-MM-DD");

  const fetchData = useCallback(
    async () => {  
      setLoading(true);
      setError(null);
      let result = await f_load_SXLossTimeByReason({
            FROM_DATE: df ? frd : fromDate,
            TO_DATE: df ? td : toDate,            
          }); 
      setData(result);     
    },
    [fromDate, toDate, df]
  );

  const triggerFetch = useCallback(() => {
    fetchData();
  }, [fromDate, toDate, fetchData]);

  return { data, loading, error, triggerFetch};
};

export const usehandle_getSXLossTimeByEmpl = (fromDate: string, toDate: string, df: boolean) => {
  const [data, setData] = useState<SX_LOSSTIME_BY_EMPL[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  

  let td = moment().add(0, "day").format("YYYY-MM-DD");
  let frd = moment().add(-12, "day").format("YYYY-MM-DD");

  const fetchData = useCallback(
    async () => {  
      setLoading(true);
      setError(null);
      let result = await f_load_SXLossTimeByEmpl({
            FROM_DATE: df ? frd : fromDate,
            TO_DATE: df ? td : toDate,            
          }); 
      setData(result);     
    },
    [fromDate, toDate, df]
  );

  const triggerFetch = useCallback(() => {
    fetchData();
  }, [fromDate, toDate, fetchData]);

  return { data, loading, error, triggerFetch};
};
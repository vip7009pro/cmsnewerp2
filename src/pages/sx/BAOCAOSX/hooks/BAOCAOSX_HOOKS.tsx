import { useState, useEffect, useCallback } from 'react';
import { CNT_GAP_DATA } from "../../../qc/interfaces/qcInterface";
import { f_load_YCSX_GAP_RATE_DATA } from '../../../qlsx/QLSXPLAN/utils/khsxUtils';
import moment from 'moment';

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
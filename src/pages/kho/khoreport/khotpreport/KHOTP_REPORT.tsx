import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import './PrecisionKhoTP/PrecisionKhoTP.scss';
import { P_STOCK_BY_MONTH_DATA, P_STOCK_BY_MONTH_DETAIL_DATA } from '../../interfaces/khoInterface';
import { f_load_P_Stock_By_Month, f_load_P_Stock_By_Month_Detail } from '../../utils/khoUtils';
import PrecisionKhoTPHeader from './PrecisionKhoTP/PrecisionKhoTPHeader';
import PrecisionKhoTPToolbar from './PrecisionKhoTP/PrecisionKhoTPToolbar';
import PrecisionKhoTPKpi from './PrecisionKhoTP/PrecisionKhoTPKpi';
import PrecisionKhoTPMonthSection from './PrecisionKhoTP/PrecisionKhoTPMonthSection';

const KHOTP_REPORT = () => {
  // ─── State ──────────────────────────────────────────────────
  const [fromdate, setFromDate] = useState(moment().add(-14, 'day').format('YYYY-MM-DD'));
  const [todate, setToDate] = useState(moment().format('YYYY-MM-DD'));
  const [df, setDF] = useState(true);
  const [moc1, setMoc1] = useState(3);
  const [moc2, setMoc2] = useState(6);

  const [stockpopularmonth, setStockPopularMonth] = useState<P_STOCK_BY_MONTH_DATA[]>([]);
  const [stockpopularmonthdetailA, setStockPopularMonthDetailA] = useState<P_STOCK_BY_MONTH_DETAIL_DATA[]>([]);
  const [stockpopularmonthdetailB, setStockPopularMonthDetailB] = useState<P_STOCK_BY_MONTH_DETAIL_DATA[]>([]);
  const [stockpopularmonthdetailC, setStockPopularMonthDetailC] = useState<P_STOCK_BY_MONTH_DETAIL_DATA[]>([]);

  // ─── API Helpers ────────────────────────────────────────────
  const getDateRange = useCallback(() => {
    const td = moment().format('YYYY-MM-DD');
    const frd = moment().add(-14, 'day').format('YYYY-MM-DD');
    return { FROM_DATE: df ? frd : fromdate, TO_DATE: df ? td : todate };
  }, [df, fromdate, todate]);

  const initFunction = useCallback(async () => {
    Swal.fire({
      title: 'Đang tải báo cáo',
      text: 'Đang tải dữ liệu tồn kho thành phẩm...',
      icon: 'info',
      showCancelButton: false,
      allowOutsideClick: false,
      showConfirmButton: false,
    });

    const range = getDateRange();
    const mocParams = { ...range, MOC1: moc1, MOC2: moc2 };

    try {
      await Promise.all([
        f_load_P_Stock_By_Month(mocParams).then(setStockPopularMonth),
        f_load_P_Stock_By_Month_Detail({ ...mocParams, PHANLOAI: 'A' }).then(setStockPopularMonthDetailA),
        f_load_P_Stock_By_Month_Detail({ ...mocParams, PHANLOAI: 'B' }).then(setStockPopularMonthDetailB),
        f_load_P_Stock_By_Month_Detail({ ...mocParams, PHANLOAI: 'C' }).then(setStockPopularMonthDetailC),
      ]);
    } finally {
      Swal.close();
    }
  }, [getDateRange, moc1, moc2]);

  useEffect(() => { initFunction(); }, []);

  const totalRecords =
    stockpopularmonthdetailA.length +
    stockpopularmonthdetailB.length +
    stockpopularmonthdetailC.length;

  // ─── Render ─────────────────────────────────────────────────
  return (
    <div className="precision-khotp">
      <PrecisionKhoTPHeader onReload={initFunction} totalRecords={totalRecords} />

      <PrecisionKhoTPToolbar
        fromDate={fromdate}
        toDate={todate}
        df={df}
        moc1={moc1}
        moc2={moc2}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onDfChange={setDF}
        onMoc1Change={setMoc1}
        onMoc2Change={setMoc2}
        onSearch={initFunction}
      />

      <div className="precision-khotp__body">
        <PrecisionKhoTPKpi
          stockMonth={stockpopularmonth}
          moc1={moc1}
          moc2={moc2}
        />

        <PrecisionKhoTPMonthSection
          stockPopularMonth={stockpopularmonth}
          stockMonthDetailA={stockpopularmonthdetailA}
          stockMonthDetailB={stockpopularmonthdetailB}
          stockMonthDetailC={stockpopularmonthdetailC}
          moc1={moc1}
          moc2={moc2}
        />
      </div>
    </div>
  );
};

export default KHOTP_REPORT;

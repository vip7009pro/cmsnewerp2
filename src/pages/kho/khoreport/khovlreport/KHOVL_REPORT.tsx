import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import './PrecisionKhoVL/PrecisionKhoVL.scss';
import { SaveExcel } from '../../../../api/services/excelService';
import {
  M_INPUT_BY_POPULAR_DATA,
  M_INPUT_BY_POPULAR_DETAIL_DATA,
  M_OUTPUT_BY_POPULAR_DATA,
  M_OUTPUT_BY_POPULAR_DETAIL_DATA,
  MSTOCK_BY_POPULAR_DATA,
  MSTOCK_BY_POPULAR_DETAIL_DATA,
} from '../../interfaces/khoInterface';
import {
  f_load_Stock_By_Month,
  f_load_Stock_By_Month_Detail,
  f_loadM_INPUT_BY_POPULAR,
  f_loadM_INPUT_BY_POPULAR_DETAIL,
  f_loadM_OUTPUT_BY_POPULAR,
  f_loadM_OUTPUT_BY_POPULAR_DETAIL,
  f_loadMSTOCK_BY_POPULAR,
  f_loadMSTOCK_BY_POPULAR_DETAIL,
} from '../../utils/khoUtils';
import PrecisionKhoVLHeader from './PrecisionKhoVL/PrecisionKhoVLHeader';
import PrecisionKhoVLToolbar, { WHVLTab } from './PrecisionKhoVL/PrecisionKhoVLToolbar';
import PrecisionKhoVLKpi from './PrecisionKhoVL/PrecisionKhoVLKpi';
import PrecisionKhoVLPopularSection from './PrecisionKhoVL/PrecisionKhoVLPopularSection';
import PrecisionKhoVLMonthSection from './PrecisionKhoVL/PrecisionKhoVLMonthSection';

const KHOVL_REPORT = () => {
  // ─── State ──────────────────────────────────────────────────
  const [fromdate, setFromDate] = useState(moment().add(-14, 'day').format('YYYY-MM-DD'));
  const [todate, setToDate] = useState(moment().format('YYYY-MM-DD'));
  const [df, setDF] = useState(true);
  const [moc1, setMoc1] = useState(3);
  const [moc2, setMoc2] = useState(6);
  const [activeTab, setActiveTab] = useState<WHVLTab>('all');

  const [stockpopular, setStockPopular] = useState<MSTOCK_BY_POPULAR_DATA[]>([]);
  const [stockpopulardetail, setStockPopularDetail] = useState<MSTOCK_BY_POPULAR_DETAIL_DATA[]>([]);
  const [inputpopular, setInputPopular] = useState<M_INPUT_BY_POPULAR_DATA[]>([]);
  const [inputpopulardetail, setInputPopularDetail] = useState<M_INPUT_BY_POPULAR_DETAIL_DATA[]>([]);
  const [outputpopular, setOutputPopular] = useState<M_OUTPUT_BY_POPULAR_DATA[]>([]);
  const [outputpopulardetail, setOutputPopularDetail] = useState<M_OUTPUT_BY_POPULAR_DETAIL_DATA[]>([]);
  const [stockpopularmonth, setStockPopularMonth] = useState<MSTOCK_BY_POPULAR_DATA[]>([]);
  const [stockpopularmonthdetailA, setStockPopularMonthDetailA] = useState<MSTOCK_BY_POPULAR_DETAIL_DATA[]>([]);
  const [stockpopularmonthdetailB, setStockPopularMonthDetailB] = useState<MSTOCK_BY_POPULAR_DETAIL_DATA[]>([]);
  const [stockpopularmonthdetailC, setStockPopularMonthDetailC] = useState<MSTOCK_BY_POPULAR_DETAIL_DATA[]>([]);

  // ─── API Helpers ────────────────────────────────────────────
  const getDateRange = useCallback(() => {
    const td = moment().format('YYYY-MM-DD');
    const frd = moment().add(-14, 'day').format('YYYY-MM-DD');
    return { FROM_DATE: df ? frd : fromdate, TO_DATE: df ? td : todate };
  }, [df, fromdate, todate]);

  const initFunction = useCallback(async () => {
    Swal.fire({
      title: 'Đang tải báo cáo',
      text: 'Đang tải dữ liệu kho nguyên liệu...',
      icon: 'info',
      showCancelButton: false,
      allowOutsideClick: false,
      showConfirmButton: false,
    });

    const range = getDateRange();
    const mocParams = { ...range, MOC1: moc1, MOC2: moc2 };

    try {
      await Promise.all([
        f_loadMSTOCK_BY_POPULAR(range).then(setStockPopular),
        f_loadMSTOCK_BY_POPULAR_DETAIL(range).then(setStockPopularDetail),
        f_loadM_INPUT_BY_POPULAR(range).then(setInputPopular),
        f_loadM_INPUT_BY_POPULAR_DETAIL(range).then(setInputPopularDetail),
        f_loadM_OUTPUT_BY_POPULAR(range).then(setOutputPopular),
        f_loadM_OUTPUT_BY_POPULAR_DETAIL(range).then(setOutputPopularDetail),
        f_load_Stock_By_Month(mocParams).then(setStockPopularMonth),
        f_load_Stock_By_Month_Detail({ ...mocParams, PHANLOAI: 'A' }).then(setStockPopularMonthDetailA),
        f_load_Stock_By_Month_Detail({ ...mocParams, PHANLOAI: 'B' }).then(setStockPopularMonthDetailB),
        f_load_Stock_By_Month_Detail({ ...mocParams, PHANLOAI: 'C' }).then(setStockPopularMonthDetailC),
      ]);
    } finally {
      Swal.close();
    }
  }, [getDateRange, moc1, moc2]);

  useEffect(() => { initFunction(); }, []);

  // ─── Totals for header ──────────────────────────────────────
  const totalRecords =
    stockpopulardetail.length + inputpopulardetail.length + outputpopulardetail.length;

  const showPopular = activeTab === 'all' || activeTab === 'popular';
  const showLongterm = activeTab === 'all' || activeTab === 'longterm';

  // ─── Render ─────────────────────────────────────────────────
  return (
    <div className="precision-khovl">
      <PrecisionKhoVLHeader onReload={initFunction} totalRecords={totalRecords} />

      <PrecisionKhoVLToolbar
        fromDate={fromdate}
        toDate={todate}
        df={df}
        moc1={moc1}
        moc2={moc2}
        activeTab={activeTab}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onDfChange={setDF}
        onMoc1Change={setMoc1}
        onMoc2Change={setMoc2}
        onSearch={initFunction}
        onTabChange={setActiveTab}
      />

      <div className="precision-khovl__body">
        <PrecisionKhoVLKpi
          stockPopular={stockpopular}
          inputPopular={inputpopular}
        />

        {showPopular && (
          <PrecisionKhoVLPopularSection
            stockPopular={stockpopular}
            stockPopularDetail={stockpopulardetail}
            inputPopular={inputpopular}
            inputPopularDetail={inputpopulardetail}
            outputPopular={outputpopular}
            outputPopularDetail={outputpopulardetail}
            fromDate={fromdate}
            toDate={todate}
          />
        )}

        {showLongterm && (
          <PrecisionKhoVLMonthSection
            stockPopularMonth={stockpopularmonth}
            stockMonthDetailA={stockpopularmonthdetailA}
            stockMonthDetailB={stockpopularmonthdetailB}
            stockMonthDetailC={stockpopularmonthdetailC}
            moc1={moc1}
            moc2={moc2}
          />
        )}
      </div>
    </div>
  );
};

export default KHOVL_REPORT;

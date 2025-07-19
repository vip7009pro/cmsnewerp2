import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import './KHOVL_REPORT.scss';
import { Checkbox, IconButton } from '@mui/material';
import { SaveExcel } from '../../../../api/GlobalFunction';
import { AiFillFileExcel } from 'react-icons/ai';
import { RND_NEWCODE_TREND_DATA } from '../../../rnd/interfaces/rndInterface';
import { M_INPUT_BY_POPULAR_DATA, M_INPUT_BY_POPULAR_DETAIL_DATA, M_OUTPUT_BY_POPULAR_DATA, M_OUTPUT_BY_POPULAR_DETAIL_DATA, MSTOCK_BY_POPULAR_DATA, MSTOCK_BY_POPULAR_DETAIL_DATA } from '../../interfaces/khoInterface';
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
import MSTOCK_BY_POPULAR_CHART from '../../../../components/Chart/WH/MSTOCK_BY_POPULAR_CHART';
import M_INPUT_BY_POPULAR_CHART from '../../../../components/Chart/WH/M_INPUT_BY_POPULAR_CHART';
import M_OUTPUT_BY_POPULAR_CHART from '../../../../components/Chart/WH/M_OUTPUT_BY_POPULAR_CHART';
import AGTable from '../../../../components/DataTable/AGTable';
import MSTOCK_BY_MONTH_CHART from '../../../../components/Chart/WH/MSTOCK_BY_MONTH_CHART';
const KHOVL_REPORT = () => {
  const [stockpopularmonth, setStockPopularMonth] = useState<MSTOCK_BY_POPULAR_DATA[]>([]);
  const [stockpopularmonthdetailA, setStockPopularMonthDetailA] = useState<MSTOCK_BY_POPULAR_DETAIL_DATA[]>([]);
  const [stockpopularmonthdetailB, setStockPopularMonthDetailB] = useState<MSTOCK_BY_POPULAR_DETAIL_DATA[]>([]);
  const [stockpopularmonthdetailC, setStockPopularMonthDetailC] = useState<MSTOCK_BY_POPULAR_DETAIL_DATA[]>([]);
  const [stockpopular, setStockPopular] = useState<MSTOCK_BY_POPULAR_DATA[]>([]);
  const [stockpopulardetail, setStockPopularDetail] = useState<MSTOCK_BY_POPULAR_DETAIL_DATA[]>([]);
  const [inputpopular, setInputPopular] = useState<M_INPUT_BY_POPULAR_DATA[]>([]);
  const [inputpopulardetail, setInputPopularDetail] = useState<M_INPUT_BY_POPULAR_DETAIL_DATA[]>([]);
  const [outputpopular, setOutputPopular] = useState<M_OUTPUT_BY_POPULAR_DATA[]>([]);
  const [outputpopulardetail, setOutputPopularDetail] = useState<M_OUTPUT_BY_POPULAR_DETAIL_DATA[]>([]);




  const [fromdate, setFromDate] = useState(moment().add(-14, 'day').format('YYYY-MM-DD'));
  const [todate, setToDate] = useState(moment().format('YYYY-MM-DD'));
  const [cust_name, setCust_Name] = useState('');
  const [searchCodeArray, setSearchCodeArray] = useState<string[]>([]);
  const [df, setDF] = useState(true);

  const handle_stockPopular = async (from_date: string, to_date: string, listCode: string[]) => {
    let td = moment().add(0, 'day').format('YYYY-MM-DD');
    let frd = moment().add(-14, 'day').format('YYYY-MM-DD');
    setStockPopular(
      await f_loadMSTOCK_BY_POPULAR({
        FROM_DATE: df ? frd : from_date,
        TO_DATE: df ? td : to_date,
      })
    );
  };
  const handle_stockPopularDetail = async (from_date: string, to_date: string, listCode: string[]) => {
    let td = moment().add(0, 'day').format('YYYY-MM-DD');
    let frd = moment().add(-14, 'day').format('YYYY-MM-DD');
    setStockPopularDetail(
      await f_loadMSTOCK_BY_POPULAR_DETAIL({
        FROM_DATE: df ? frd : from_date,
        TO_DATE: df ? td : to_date,
      })
    );
  };
  const handle_inputPopular = async (from_date: string, to_date: string, listCode: string[]) => {
    let td = moment().add(0, 'day').format('YYYY-MM-DD');
    let frd = moment().add(-14, 'day').format('YYYY-MM-DD');
    setInputPopular(
      await f_loadM_INPUT_BY_POPULAR({
        FROM_DATE: df ? frd : from_date,
        TO_DATE: df ? td : to_date,
      })
    );
  };
  const handle_inputPopularDetail = async (from_date: string, to_date: string, listCode: string[]) => {
    let td = moment().add(0, 'day').format('YYYY-MM-DD');
    let frd = moment().add(-14, 'day').format('YYYY-MM-DD');
    setInputPopularDetail(
      await f_loadM_INPUT_BY_POPULAR_DETAIL({
        FROM_DATE: df ? frd : from_date,
        TO_DATE: df ? td : to_date,
      })
    );
  };
  const handle_outputPopular = async (from_date: string, to_date: string, listCode: string[]) => {
    let td = moment().add(0, 'day').format('YYYY-MM-DD');
    let frd = moment().add(-14, 'day').format('YYYY-MM-DD');
    setOutputPopular(
      await f_loadM_OUTPUT_BY_POPULAR({
        FROM_DATE: df ? frd : from_date,
        TO_DATE: df ? td : to_date,
      })
    );
  };
  const handle_outputPopularDetail = async (from_date: string, to_date: string, listCode: string[]) => {
    let td = moment().add(0, 'day').format('YYYY-MM-DD');
    let frd = moment().add(-14, 'day').format('YYYY-MM-DD');
    setOutputPopularDetail(
      await f_loadM_OUTPUT_BY_POPULAR_DETAIL({
        FROM_DATE: df ? frd : from_date,
        TO_DATE: df ? td : to_date,
      })
    );
  };
  const handle_stockPopularMonth = async (from_date: string, to_date: string, listCode: string[]) => {
    let td = moment().add(0, 'day').format('YYYY-MM-DD');
    let frd = moment().add(-14, 'day').format('YYYY-MM-DD');
    setStockPopularMonth(
      await f_load_Stock_By_Month({
        FROM_DATE: df ? frd : from_date,
        TO_DATE: df ? td : to_date,
      })
    );
  };
  const handle_stockPopularMonthDetail = async (from_date: string, to_date: string, listCode: string[], phanloai:string) => {
    let td = moment().add(0, 'day').format('YYYY-MM-DD');
    let frd = moment().add(-14, 'day').format('YYYY-MM-DD');
    if (phanloai === "A") {
      setStockPopularMonthDetailA(
        await f_load_Stock_By_Month_Detail({
          FROM_DATE: df ? frd : from_date,
          TO_DATE: df ? td : to_date,
          PHANLOAI: phanloai,
      })
    );
    } else if (phanloai === "B") {
      setStockPopularMonthDetailB(
        await f_load_Stock_By_Month_Detail({
          FROM_DATE: df ? frd : from_date,
          TO_DATE: df ? td : to_date,
          PHANLOAI: phanloai,
      })
    );
    } else if (phanloai === "C") {
      setStockPopularMonthDetailC(
        await f_load_Stock_By_Month_Detail({
          FROM_DATE: df ? frd : from_date,
          TO_DATE: df ? td : to_date,
          PHANLOAI: phanloai,
      })
    );
    }
  };
  const stockPopular_AGTable = useMemo(() => {
    return (
      <AGTable
        showFilter={true}
        toolbar={<div></div>}        
        data={stockpopulardetail}
        onCellEditingStopped={(params: any) => {}}
        onCellClick={async (params: any) => {
          //setSelectedRows(params.data)
        }}
        onSelectionChange={(params: any) => {
          //console.log(e!.api.getSelectedRows())
        }}
      />
    );
  }, [stockpopulardetail]);
  const inputPopular_AGTable = useMemo(() => {
    return (
      <AGTable
        showFilter={true}
        toolbar={<div></div>}
        data={inputpopulardetail}
        onCellEditingStopped={(params: any) => {}}
        onCellClick={async (params: any) => {
          //setSelectedRows(params.data)
        }}
        onSelectionChange={(params: any) => {
          //console.log(e!.api.getSelectedRows())
        }}
      />
    );
  }, [inputpopulardetail]);
  const outputPopular_AGTable = useMemo(() => {
    return (
      <AGTable
        showFilter={true}
        toolbar={<div></div>}
        data={outputpopulardetail}
        onCellEditingStopped={(params: any) => {}}
        onCellClick={async (params: any) => {
          //setSelectedRows(params.data)
        }}
        onSelectionChange={(params: any) => {
          //console.log(e!.api.getSelectedRows())
        }}
      />
    );
  }, [outputpopulardetail]);
  const stockMonth_A_AGTable = useMemo(() => {
    return (
      <AGTable
        showFilter={true}
        toolbar={<div></div>}
        data={stockpopularmonthdetailA}
        onCellEditingStopped={(params: any) => {}}
        onCellClick={async (params: any) => {
          //setSelectedRows(params.data)
        }}
        onSelectionChange={(params: any) => {
          //console.log(e!.api.getSelectedRows())
        }}
      />
    );
  }, [stockpopularmonthdetailA]);
  const stockMonth_B_AGTable = useMemo(() => {
    return (
      <AGTable
        showFilter={true}
        toolbar={<div></div>}
        data={stockpopularmonthdetailB}
        onCellEditingStopped={(params: any) => {}}
        onCellClick={async (params: any) => {
          //setSelectedRows(params.data)
        }}
        onSelectionChange={(params: any) => {
          //console.log(e!.api.getSelectedRows())
        }}
      />
    );
  }, [stockpopularmonthdetailB]);
  const stockMonth_C_AGTable = useMemo(() => {
    return (
      <AGTable
        showFilter={true}
        toolbar={<div></div>}
        data={stockpopularmonthdetailC}
        onCellEditingStopped={(params: any) => {}}
        onCellClick={async (params: any) => {
          //setSelectedRows(params.data)
        }}
        onSelectionChange={(params: any) => {
          //console.log(e!.api.getSelectedRows())
        }}
      />
    );
  }, [stockpopularmonthdetailC]);

  const previousMonth = moment().subtract(1, 'month');
  const firstDayOfPreviousMonth = previousMonth.startOf('month').format('YYYY-MM-DD');
  const lastDayOfPreviousMonth = previousMonth.endOf('month').format('YYYY-MM-DD');
  const initFunction = async () => {
    Swal.fire({
      title: 'Đang tải báo cáo',
      text: 'Đang tải dữ liệu, hãy chờ chút',
      icon: 'info',
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: 'OK',
      showConfirmButton: false,
    });
    Promise.all([handle_stockPopular(fromdate, todate, searchCodeArray), handle_stockPopularDetail(fromdate, todate, searchCodeArray), handle_inputPopular(fromdate, todate, searchCodeArray), handle_inputPopularDetail(fromdate, todate, searchCodeArray), handle_outputPopular(fromdate, todate, searchCodeArray), handle_outputPopularDetail(fromdate, todate, searchCodeArray), handle_stockPopularMonth(fromdate, todate, searchCodeArray), handle_stockPopularMonthDetail(fromdate, todate, searchCodeArray, 'A'), handle_stockPopularMonthDetail(fromdate, todate, searchCodeArray, 'B'), handle_stockPopularMonthDetail(fromdate, todate, searchCodeArray, 'C')]).then((values) => {
      Swal.close();
      //Swal.fire("Thông báo", "Đã load xong báo cáo", 'success');
    });
  };
  useEffect(() => {
    initFunction();
  }, []);
  return (
    <div className='khovlreport'>
      <div className='title'>
        <span>WH REPORT</span>
      </div>
      <div className='doanhthureport'>
        <div className='pobalancesummary'>
          <label>
            <b>Từ ngày:</b>
            <input
              type='date'
              value={fromdate.slice(0, 10)}
              onChange={(e) => {
                setFromDate(e.target.value);
              }}
            ></input>
          </label>
          <label>
            <b>Tới ngày:</b>{' '}
            <input
              type='date'
              value={todate.slice(0, 10)}
              onChange={(e) => {
                setToDate(e.target.value);
              }}
            ></input>
          </label>
          <label>
            <b>Customer:</b>{' '}
            <input
              type='text'
              value={cust_name}
              onChange={(e) => {
                setCust_Name(e.target.value);
              }}
            ></input>{' '}
            ({searchCodeArray.length})
          </label>
          <label>
            <b>Default:</b>{' '}
            <Checkbox
              checked={df}
              onChange={(e) => {
                setDF(e.target.checked);
                if (!df) setSearchCodeArray([]);
              }}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </label>
          <button
            className='searchbutton'
            onClick={() => {
              initFunction();
            }}
          >
            Search
          </button>
        </div>
        <span className='section_title'>1. Tình hình nhập/xuất/tồn liệu theo độ thông dụng ({fromdate} - {todate}) </span> 
        <span style={{ fontSize: '1rem', alignSelf: 'center', color: '#4953df' }}>(Liệu thông dụng được xác định dựa trên lượng xuất ra trong tháng trước ({firstDayOfPreviousMonth} - {lastDayOfPreviousMonth}))</span>
        <span style={{ fontSize: '1rem', alignSelf: 'center', color: '#4953df' }}>(A: Thông dụng ({` SQM>5000 m²`}), B: Ít thông dụng ({`500m²  < SQM <= 5000m² `}), C: Tồn xấu ({`SQM <= 500m² `})</span>
        <div className='stock_popular'>
          <div className='dailygraph' style={{ height: '600px' }}>
            <span className='subsection'>
              Tồn liệu theo mức thông dụng{' '}
              <IconButton
                className='buttonIcon'
                onClick={() => {
                  SaveExcel(stockpopular, 'Stock Popular');
                }}
              >
                <AiFillFileExcel color='green' size={15} />
                Excel
              </IconButton>
            </span>
            <MSTOCK_BY_POPULAR_CHART data={[...stockpopular]} />
          </div>
          <div className='dailygraph' style={{ height: '600px' }}>
            <span className='subsection'>
              Input liệu theo mức thông dụng{' '}
              <IconButton
                className='buttonIcon'
                onClick={() => {
                  SaveExcel(inputpopular, 'Input Popular');
                }}
              >
                <AiFillFileExcel color='green' size={15} />
                Excel
              </IconButton>
            </span>
            <M_INPUT_BY_POPULAR_CHART data={[...inputpopular]} />
          </div>
          <div className='dailygraph' style={{ height: '600px' }}>
            <span className='subsection'>
              Output liệu theo mức thông dụng{' '}
              <IconButton
                className='buttonIcon'
                onClick={() => {
                  SaveExcel(outputpopular, 'Output Popular');
                }}
              >
                <AiFillFileExcel color='green' size={15} />
                Excel
              </IconButton>
            </span>
            <M_OUTPUT_BY_POPULAR_CHART data={[...outputpopular]} />
          </div>
        </div>
        <div className='stock_popular'>
          <div className='dailygraph' style={{ height: '600px' }}>
            <span className='subsection'>
              Stock Popular Detail             
            </span>
            {stockPopular_AGTable}
          </div>
          <div className='dailygraph' style={{ height: '600px' }}>
            <span className='subsection'>
              Input Popular Detail              
            </span>
            {inputPopular_AGTable}
          </div>
          <div className='dailygraph' style={{ height: '600px' }}>
            <span className='subsection'>
              Output Popular Detail              
            </span>
            {outputPopular_AGTable}
          </div>
        </div>
        <br></br>
        <hr></hr>
        <div className='graph'>
          <span className='section_title'>2. Tình hình tồn liệu dài hạn</span>
          <span style={{ fontSize: '1rem', alignSelf: 'center', color: '#4953df' }}>(A: Tồn dưới 3 tháng, B: Tồn từ 3 tháng đến 6 tháng, C: Tồn trên 6 tháng)</span>
          <div className='stock_popular'>
          <div className='dailygraph' style={{ height: '600px' }}>
            <span className='subsection'>
              Stock By Month{' '}
              <IconButton
                className='buttonIcon'
                onClick={() => {
                  SaveExcel(stockpopularmonth, 'Stock Popular');
                }}
              >
                <AiFillFileExcel color='green' size={15} />
                Excel
              </IconButton>
            </span>
            <MSTOCK_BY_MONTH_CHART data={[...stockpopularmonth]} />
          </div>
          <div className='dailygraph' style={{ height: '600px' }}>
            <span className='subsection'>
              Stock By Month Detail A   (less than 3 months)            
            </span>
           {stockMonth_A_AGTable}
          </div>
          <div className='dailygraph' style={{ height: '600px' }}>
            <span className='subsection'>
              Stock By Month Detail B   (less than 6 months)       
            </span>
           {stockMonth_B_AGTable}
          </div>
          <div className='dailygraph' style={{ height: '600px' }}>
            <span className='subsection'>
              Stock By Month Detail C   (more than 6 months)          
            </span>
           {stockMonth_C_AGTable}
          </div>
        
        </div> 
        </div>
      </div>
    </div>
  );
};
export default KHOVL_REPORT;

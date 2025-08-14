import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import './KHOTP_REPORT.scss';
import { Checkbox, IconButton } from '@mui/material';
import { SaveExcel } from '../../../../api/GlobalFunction';
import { AiFillFileExcel } from 'react-icons/ai';
import { P_STOCK_BY_MONTH_DATA, P_STOCK_BY_MONTH_DETAIL_DATA } from '../../interfaces/khoInterface';
import { f_load_P_Stock_By_Month, f_load_P_Stock_By_Month_Detail } from '../../utils/khoUtils';
import AGTable from '../../../../components/DataTable/AGTable';
import { getUserData } from '../../../../api/Api';
import PSTOCK_BY_MONTH_CHART from '../../../../components/Chart/WH/PSTOCK_BY_MONTH_CHART';
const KHOTP_REPORT = () => {
  const [stockpopularmonth, setStockPopularMonth] = useState<P_STOCK_BY_MONTH_DATA[]>([]);
  const [stockpopularmonthdetailA, setStockPopularMonthDetailA] = useState<P_STOCK_BY_MONTH_DETAIL_DATA[]>([]);
  const [stockpopularmonthdetailB, setStockPopularMonthDetailB] = useState<P_STOCK_BY_MONTH_DETAIL_DATA[]>([]);
  const [stockpopularmonthdetailC, setStockPopularMonthDetailC] = useState<P_STOCK_BY_MONTH_DETAIL_DATA[]>([]);
  const [moc1,setMoc1] = useState(3);
  const [moc2,setMoc2] = useState(6);
  const [fromdate, setFromDate] = useState(moment().add(-14, 'day').format('YYYY-MM-DD'));
  const [todate, setToDate] = useState(moment().format('YYYY-MM-DD'));
  const [cust_name, setCust_Name] = useState('');
  const [searchCodeArray, setSearchCodeArray] = useState<string[]>([]);
  const [df, setDF] = useState(true);

  const handle_stockPopularMonth = async (from_date: string, to_date: string, listCode: string[], moc1: number, moc2: number) => {
    let td = moment().add(0, 'day').format('YYYY-MM-DD');
    let frd = moment().add(-14, 'day').format('YYYY-MM-DD');
    setStockPopularMonth(
      await f_load_P_Stock_By_Month({
        FROM_DATE: df ? frd : from_date,
        TO_DATE: df ? td : to_date,
        MOC1: moc1,
        MOC2: moc2,
      })
    );
  };
  const handle_stockPopularMonthDetail = async (from_date: string, to_date: string, listCode: string[], phanloai:string, moc1: number, moc2: number) => {
    let td = moment().add(0, 'day').format('YYYY-MM-DD');
    let frd = moment().add(-14, 'day').format('YYYY-MM-DD');
    if (phanloai === "A") {
      setStockPopularMonthDetailA(
        await f_load_P_Stock_By_Month_Detail({
          FROM_DATE: df ? frd : from_date,
          TO_DATE: df ? td : to_date,
          PHANLOAI: phanloai,
          MOC1: moc1,
          MOC2: moc2,
      })
    );
    } else if (phanloai === "B") {
      setStockPopularMonthDetailB(
        await f_load_P_Stock_By_Month_Detail({
          FROM_DATE: df ? frd : from_date,
          TO_DATE: df ? td : to_date,
          PHANLOAI: phanloai,
          MOC1: moc1,
          MOC2: moc2,
      })
    );
    } else if (phanloai === "C") {
      setStockPopularMonthDetailC(
        await f_load_P_Stock_By_Month_Detail({
          FROM_DATE: df ? frd : from_date,
          TO_DATE: df ? td : to_date,
          PHANLOAI: phanloai,
          MOC1: moc1,
          MOC2: moc2,
      })
    );
    }
  };
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
    Promise.all([handle_stockPopularMonth(fromdate, todate, searchCodeArray,moc1, moc2), handle_stockPopularMonthDetail(fromdate, todate, searchCodeArray, 'A', moc1, moc2), handle_stockPopularMonthDetail(fromdate, todate, searchCodeArray, 'B', moc1, moc2), handle_stockPopularMonthDetail(fromdate, todate, searchCodeArray, 'C', moc1, moc2)]).then((values) => {
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
        <span>PRODUCT WH REPORT</span>
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
            
        <div className='graph'>
          <span className='section_title'>1. Tình hình tồn kho dài hạn</span>{(getUserData()?.EMPL_NO === "NHU1903" || getUserData()?.EMPL_NO === "none") && <div style={{ display: 'flex', alignItems: 'center' }}>Mốc 1: <input type="number" value={moc1} style={{width: '50px'}} onChange={(e) => setMoc1(Number(e.target.value))} /> Mốc 2: <input type="number" value={moc2} style={{width: '50px'}} onChange={(e) => setMoc2(Number(e.target.value))}/>
          <button
            className='searchbutton'
            onClick={() => {
              initFunction();
            }}
          >
            Search
          </button>
          </div>}
          <span style={{ fontSize: '1rem', alignSelf: 'center', color: '#4953df' }}>(A: Tồn dưới {moc1} tháng, B: Tồn từ {moc1} tháng đến {moc2} tháng, C: Tồn trên {moc2} tháng)</span>
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
            <PSTOCK_BY_MONTH_CHART data={[...stockpopularmonth]} />
          </div>
          <div className='dailygraph' style={{ height: '600px' }}>
            <span className='subsection'>
              Stock By Month Detail A   (less than {moc1} months)            
            </span>
           {stockMonth_A_AGTable}
          </div>
          <div className='dailygraph' style={{ height: '600px' }}>
            <span className='subsection'>
              Stock By Month Detail B   (less than {moc2} months)       
            </span>
           {stockMonth_B_AGTable}
          </div>
          <div className='dailygraph' style={{ height: '600px' }}>
            <span className='subsection'>
              Stock By Month Detail C   (more than {moc2} months)          
            </span>
           {stockMonth_C_AGTable}
          </div>        
        </div> 
        </div>
      </div>
    </div>
  );
};
export default KHOTP_REPORT

import moment from 'moment';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { generalQuery } from '../../../api/Api';
import './IQC_REPORT.scss';

import { Autocomplete, Checkbox, IconButton, TextField, Typography, createFilterOptions } from '@mui/material';
import PQCMonthlyFcost from '../../../components/Chart/PQC/PQCMonthlyFcost';
import PQCYearlyFcost from '../../../components/Chart/PQC/PQCYearlyFcost';
import { SaveExcel } from '../../../api/GlobalFunction';
import { AiFillFileExcel } from 'react-icons/ai';
import { DEFECT_TRENDING_DATA, IQC_FAILING_TREND_DATA, IQC_FAIL_PENDING, IQC_TREND_DATA, IQC_VENDOR_NGRATE_DATA, PQC3_DATA, PQCSummary, PQC_PPM_DATA } from '../interfaces/qcInterface';
import { CodeListData } from '../../kinhdoanh/interfaces/kdInterface';
import { f_loadIQCDailyNGTrend, f_loadIQCFailPending, f_loadIQCFailTrending, f_loadIQCHoldingPending, f_loadIQCHoldingTrending, f_loadIQCMonthlyTrend, f_loadIQCWeeklyTrend, f_loadIQCYearlyTrend, f_loadVendorIncomingNGRateByMonth, f_loadVendorIncomingNGRateByWeek } from '../utils/qcUtils';
import IQCDailyNGRate from '../../../components/Chart/IQC/IQCDailyNGRate';
import IQCWeeklyNGRate from '../../../components/Chart/IQC/IQCWeeklyNGRate';
import IQCMonthlyNGRate from '../../../components/Chart/IQC/IQCMonthlyNGRate';
import IQCYearlyNGRate from '../../../components/Chart/IQC/IQCYearlyNGRate';
import WidgetIQC from '../../../components/Widget/WidgetIQC';
import IQcWeeklyVendorNGRateTrending from '../../../components/Chart/IQC/IQcWeeklyVendorNGRateTrending';
import IQcMonthlyVendorNGRateTrending from '../../../components/Chart/IQC/IQcMonthlyVendorNGRateTrending';
import IQCWeeklyFailingTrending from '../../../components/Chart/IQC/IQCWeeklyFailingTrending';
import IQC_FAILING_PENDING from '../../../components/Chart/IQC/IQC_FAILING_PENDING';
const IQC_REPORT = () => {
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

  const [fromdate, setFromDate] = useState(moment().add(-14, 'day').format('YYYY-MM-DD'));
  const [todate, setToDate] = useState(moment().format('YYYY-MM-DD'));
  const [worstby, setWorstBy] = useState('AMOUNT');
  const [ng_type, setNg_Type] = useState('ALL');
  const [inspectSummary, setInspectSummary] = useState<PQCSummary[]>([]);
  const [dailyDefectTrendingData, setDailyDefectTrendingData] = useState<DEFECT_TRENDING_DATA[]>([]);
  const [cust_name, setCust_Name] = useState('');
  const [codeList, setCodeList] = useState<CodeListData[]>([]);
  const [searchCodeArray, setSearchCodeArray] = useState<string[]>([]);
  const [pqcdatatable, setPqcDataTable] = useState<Array<PQC3_DATA>>([]);
  const [selectedCode, setSelectedCode] = useState<CodeListData | null>({
    G_CODE: '6A00001B',
    G_NAME: 'GT-I9500_SJ68-01284A',
    G_NAME_KD: 'GT-I9500_SJ68-01284A',
    PROD_LAST_PRICE: 0,
    USE_YN: 'N',
  });
  const [df, setDF] = useState(true);
  const filterOptions1 = createFilterOptions({
    matchFrom: 'any',
    limit: 100,
  });
  const handle_getDailyPPM = async (FACTORY: string, listCode: string[]) => {
    let td = moment().add(0, 'day').format('YYYY-MM-DD');
    let frd = moment().add(-12, 'day').format('YYYY-MM-DD');
    let data = {
      FACTORY: FACTORY,
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name,
    };

    let result = await f_loadIQCDailyNGTrend(data);
    setDailyPPM(result);
  };
  const handle_getWeeklyPPM = async (FACTORY: string, listCode: string[]) => {
    let td = moment().add(0, 'day').format('YYYY-MM-DD');
    let frd = moment().add(-70, 'day').format('YYYY-MM-DD');
    let data = {
      FACTORY: FACTORY,
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name,
    };

    let result = await f_loadIQCWeeklyTrend(data);
    console.log('result', result);
    setWeeklyPPM(result);
  };
  const handle_getMonthlyPPM = async (FACTORY: string, listCode: string[]) => {
    let td = moment().add(0, 'day').format('YYYY-MM-DD');
    let frd = moment().add(-365, 'day').format('YYYY-MM-DD');
    let data = {
      FACTORY: FACTORY,
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name,
    };

    let result = await f_loadIQCMonthlyTrend(data);
    setMonthlyPPM(result);
  };
  const handle_getYearlyPPM = async (FACTORY: string, listCode: string[]) => {
    let td = moment().add(0, 'day').format('YYYY-MM-DD');
    let frd = moment().add(-3650, 'day').format('YYYY-MM-DD');
    let data = {
      FACTORY: FACTORY,
      FROM_DATE: df ? frd : fromdate,
      TO_DATE: df ? td : todate,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name,
    };

    let result = await f_loadIQCYearlyTrend(data);
    setYearlyPPM(result);
  };
  const handle_getIncomingNGRateByWeek = async (from_date: string, to_date: string, listCode: string[]) => {
    let td = moment().add(0, 'day').format('YYYY-MM-DD');
    let frd = moment().add(-180, 'day').format('YYYY-MM-DD');
    let data = {
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name,
    };
    let result = await f_loadVendorIncomingNGRateByWeek(data);
    setWeeklyVendorPPM(result);
  };
  const handle_getIncomingNGRateByMonth = async (from_date: string, to_date: string, listCode: string[]) => {
    let td = moment().add(0, 'day').format('YYYY-MM-DD');
    let frd = moment().add(-365, 'day').format('YYYY-MM-DD');
    let data = {
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name,
    };
    let result = await f_loadVendorIncomingNGRateByMonth(data);
    setMonthlyVendorPPM(result);
  };
  const handle_weeklyFailingTrending = async (from_date: string, to_date: string, listCode: string[]) => {
    let td = moment().add(0, 'day').format('YYYY-MM-DD');
    let frd = moment().add(-140, 'day').format('YYYY-MM-DD');
    let data = {
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name,
    };
    let result = await f_loadIQCFailTrending(data);
    setWeeklyFailingTrending(result);
  };
  const handle_weeklyHoldingTrending = async (from_date: string, to_date: string, listCode: string[]) => {
    let td = moment().add(0, 'day').format('YYYY-MM-DD');
    let frd = moment().add(-365, 'day').format('YYYY-MM-DD');
    let data = {
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name,
    };
    let result = await f_loadIQCHoldingTrending(data);
    setWeeklyHoldingTrending(result);
  };
  const handle_iqcFailPending = async (from_date: string, to_date: string, listCode: string[]) => {
    let td = moment().add(0, 'day').format('YYYY-MM-DD');
    let frd = moment().add(-365, 'day').format('YYYY-MM-DD');
    let data = {
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name,
    };
    let result = await f_loadIQCFailPending(data);
    setIqcFailPending(result);
  };
  const handle_iqcHoldingPending = async (from_date: string, to_date: string, listCode: string[]) => {
    let td = moment().add(0, 'day').format('YYYY-MM-DD');
    let frd = moment().add(-365, 'day').format('YYYY-MM-DD');
    let data = {
      FROM_DATE: df ? frd : from_date,
      TO_DATE: df ? td : to_date,
      codeArray: df ? [] : listCode,
      CUST_NAME_KD: cust_name,
    };
    let result = await f_loadIQCHoldingPending(data);
    setIqcHoldingPending(result);
  };

  const getcodelist = (G_NAME: string) => {
    generalQuery('selectcodeList', { G_NAME: G_NAME })
      .then((response) => {
        if (response.data.tk_status !== 'NG') {
          setCodeList(response.data.data);
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
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
    Promise.all([handle_getDailyPPM('ALL', searchCodeArray), handle_getWeeklyPPM('ALL', searchCodeArray), handle_getMonthlyPPM('ALL', searchCodeArray), handle_getYearlyPPM('ALL', searchCodeArray), handle_getIncomingNGRateByMonth(fromdate, todate, searchCodeArray), handle_getIncomingNGRateByWeek(fromdate, todate, searchCodeArray), handle_weeklyFailingTrending(fromdate, todate, searchCodeArray), handle_weeklyHoldingTrending(fromdate, todate, searchCodeArray), handle_iqcFailPending(fromdate, todate, searchCodeArray), handle_iqcHoldingPending(fromdate, todate, searchCodeArray)]).then((values) => {
      Swal.fire('Thông báo', 'Đã load xong báo cáo', 'success');
    });
  };
  useEffect(() => {
    getcodelist('');
    initFunction();
  }, []);
  return (
    <div className='iqcreport'>
      <div className='title'>
        <span>IQC REPORT</span>
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
                //handleGetInspectionWorst(e.target.value, todate, worstby, ng_type);
                //handle_getIncomingNGRateByWeek(e.target.value, todate);
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
                //handleGetInspectionWorst(fromdate, e.target.value, worstby, ng_type);
                //handle_getIncomingNGRateByWeek(fromdate,e.target.value);
              }}
            ></input>
          </label>
          <label>
            <b>Worst by:</b>{' '}
            <select
              name='worstby'
              value={worstby}
              onChange={(e) => {
                setWorstBy(e.target.value);
                //handleGetInspectionWorst(fromdate, todate, e.target.value, ng_type);
              }}
            >
              <option value={'QTY'}>QTY</option>
              <option value={'AMOUNT'}>AMOUNT</option>
            </select>
          </label>
          <label>
            <b>NG TYPE:</b>{' '}
            <select
              name='ngtype'
              value={ng_type}
              onChange={(e) => {
                setNg_Type(e.target.value);
                //handleGetInspectionWorst(fromdate, todate, worstby, e.target.value);
              }}
            >
              <option value={'ALL'}>ALL</option>
              <option value={'P'}>PROCESS</option>
              <option value={'M'}>MATERIAL</option>
            </select>
          </label>
          <b>Code hàng:</b>{' '}
          <label>
            <Autocomplete
              disableCloseOnSelect
              /* multiple={true} */
              sx={{ fontSize: '0.6rem' }}
              ListboxProps={{ style: { fontSize: '0.7rem' } }}
              size='small'
              disablePortal
              options={codeList}
              className='autocomplete1'
              filterOptions={filterOptions1}
              getOptionLabel={(option: CodeListData | any) => `${option.G_CODE}: ${option.G_NAME_KD}:${option.G_NAME}`}
              renderInput={(params) => <TextField {...params} label='Select code' />}
              /*  renderOption={(props, option: any, { selected }) => (
                 <li {...props}>
                   <Checkbox
                     sx={{ marginRight: 0 }}
                     checked={selected}
                   />
                   {`${option.G_CODE}: ${option.G_NAME_KD}:${option.G_NAME}`}
                 </li>
               )} */
              renderOption={(props, option: any) => (
                <Typography style={{ fontSize: '0.7rem' }} {...props}>
                  {`${option.G_CODE}: ${option.G_NAME_KD}:${option.G_NAME}`}
                </Typography>
              )}
              onChange={(event: any, newValue: CodeListData | any) => {
                //console.log(newValue);
                setSelectedCode(newValue);
                if (searchCodeArray.indexOf(newValue?.G_CODE ?? '') === -1) setSearchCodeArray([...searchCodeArray, newValue?.G_CODE ?? '']);
                /* setSelectedCodes(newValue); */
              }}
              isOptionEqualToValue={(option: any, value: any) => option.G_CODE === value.G_CODE}
            />
          </label>
          <label>
            <input
              type='text'
              value={searchCodeArray.concat()}
              onChange={(e) => {
                setSearchCodeArray([]);
              }}
            ></input>{' '}
            ({searchCodeArray.length})
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
                //console.log(e.target.checked);
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
        <span className='section_title'>1. OverView</span>
        <div className='revenuewidget'>
          <div className='revenuwdg'>
            <WidgetIQC widgettype='revenue' label='Today NG' topColor='#ace73d' botColor='#ffbf6b' material_ppm={dailyppm[dailyppm.length - 1]?.OK_CNT} process_ppm={dailyppm[dailyppm.length - 1]?.PD_CNT} total_ppm={dailyppm[dailyppm.length - 1]?.NG_RATE} />
          </div>
          <div className='revenuwdg'>
            <WidgetIQC widgettype='revenue' label='This Week NG' topColor='#ace73d' botColor='#ffbf6b' material_ppm={weeklyppm[weeklyppm.length - 1]?.OK_CNT} process_ppm={weeklyppm[weeklyppm.length - 1]?.PD_CNT} total_ppm={weeklyppm[weeklyppm.length - 1]?.NG_RATE} />
          </div>
          <div className='revenuwdg'>
            <WidgetIQC widgettype='revenue' label='This Month NG' topColor='#ace73d' botColor='#ffbf6b' material_ppm={monthlyppm[monthlyppm.length - 1]?.OK_CNT} process_ppm={monthlyppm[monthlyppm.length - 1]?.PD_CNT} total_ppm={monthlyppm[monthlyppm.length - 1]?.NG_RATE} />
          </div>
          <div className='revenuwdg'>
            <WidgetIQC widgettype='revenue' label='This Year NG' topColor='#ace73d' botColor='#ffbf6b' material_ppm={yearlyppm[yearlyppm.length - 1]?.OK_CNT} process_ppm={yearlyppm[yearlyppm.length - 1]?.PD_CNT} total_ppm={yearlyppm[yearlyppm.length - 1]?.NG_RATE} />
          </div>
        </div>
        <br></br>
        <hr></hr>
        <div className='graph'>
          <span className='section_title'>2. IQC NG Trending</span>
          <div className='dailygraphtotal'>
            <div className='dailygraphtotal' style={{ height: '400px' }}>
              <div className='dailygraph'>
                <span className='subsection'>
                  Daily NG Rate{' '}
                  <IconButton
                    className='buttonIcon'
                    onClick={() => {
                      SaveExcel(dailyppm, 'DailyPPMData');
                    }}
                  >
                    <AiFillFileExcel color='green' size={15} />
                    Excel
                  </IconButton>
                </span>
                <IQCDailyNGRate dldata={dailyppm} processColor='#53eb34' materialColor='#ff0000' />
              </div>
              <div className='dailygraph'>
                <span className='subsection'>
                  Weekly NG Rate{' '}
                  <IconButton
                    className='buttonIcon'
                    onClick={() => {
                      SaveExcel(weeklyppm, 'WeeklyPPMData');
                    }}
                  >
                    <AiFillFileExcel color='green' size={15} />
                    Excel
                  </IconButton>
                </span>
                <IQCWeeklyNGRate dldata={weeklyppm} processColor='#53eb34' materialColor='#ff0000' />
              </div>
            </div>
            <div className='monthlyweeklygraph' style={{ height: '400px' }}>
              <div className='dailygraph'>
                <span className='subsection'>
                  Monthly NG Rate{' '}
                  <IconButton
                    className='buttonIcon'
                    onClick={() => {
                      SaveExcel(monthlyppm, 'MonthlyPPMData');
                    }}
                  >
                    <AiFillFileExcel color='green' size={15} />
                    Excel
                  </IconButton>
                </span>
                <IQCMonthlyNGRate dldata={monthlyppm} processColor='#53eb34' materialColor='#ff0000' />
              </div>
              <div className='dailygraph'>
                <span className='subsection'>
                  Yearly NG Rate{' '}
                  <IconButton
                    className='buttonIcon'
                    onClick={() => {
                      SaveExcel(yearlyppm, 'YearlyPPMData');
                    }}
                  >
                    <AiFillFileExcel color='green' size={15} />
                    Excel
                  </IconButton>
                </span>
                <IQCYearlyNGRate dldata={[...yearlyppm].reverse()} processColor='#53eb34' materialColor='#ff0000' />
              </div>
            </div>
          </div>

          <div className='defect_trending'>
            <div className='dailygraph' style={{ height: '400px' }}>
              <span className='subsection_title'>
                2.5 Vendor Weekly Incoming Defects Trending{' '}
                <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    SaveExcel(weeklyvendorppm, 'Vendor Weekly IncomingDefects Trending');
                  }}
                >
                  <AiFillFileExcel color='green' size={15} />
                  Excel
                </IconButton>
              </span>
              <IQcWeeklyVendorNGRateTrending
                dldata={[...weeklyvendorppm].reverse()}
                onClick={(e) => {
                  console.log(e);
                  //traPQC32(e.activeLabel, e.activeLabel, searchCodeArray);
                }}
              />
            </div>
            <div className='dailygraph' style={{ height: '400px' }}>
              <span className='subsection_title'>
                2.6 Vendor Monthly Incoming Defects Trending{' '}
                <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    SaveExcel(monthlyvendorppm, 'Vendor Monthly Incoming Defects Trending');
                  }}
                >
                  <AiFillFileExcel color='green' size={15} />
                  Excel
                </IconButton>
              </span>
              <IQcMonthlyVendorNGRateTrending
                dldata={[...monthlyvendorppm].reverse()}
                onClick={(e) => {
                  console.log(e);
                  //traPQC32(e.activeLabel, e.activeLabel, searchCodeArray);
                }}
              />
            </div>
          </div>
          <span className='section_title'>3. IQC Fail Holding Trending</span>
          <span className='subsection_title'>IQC Failing Trending</span>
          <div className='fcosttrending'>
            <div className='fcostgraph'>
              <div className='dailygraph'>
                <span className='subsection'>
                  Weekly Failing (PROCESS){' '}
                  <IconButton
                    className='buttonIcon'
                    onClick={() => {
                      SaveExcel(weeklyfailingtrending, 'WeeklyFailingTrendingData');
                    }}
                  >
                    <AiFillFileExcel color='green' size={15} />
                    Excel
                  </IconButton>
                </span>
                <IQCWeeklyFailingTrending dldata={weeklyfailingtrending} processColor='#8b89fc' materialColor='#41d5fa' />
              </div>
            </div>
            <div className='fcostgraph'>
              <div className='dailygraph'>
                <span className='subsection'>
                  Weekly Holding (INCOMING)
                  <IconButton
                    className='buttonIcon'
                    onClick={() => {
                      SaveExcel(weeklyholdingtrending, 'WeeklyHoldingTrendingData');
                    }}
                  >
                    <AiFillFileExcel color='green' size={15} />
                    Excel
                  </IconButton>
                </span>
                <IQCWeeklyFailingTrending dldata={weeklyholdingtrending} processColor='#8b89fc' materialColor='#41d5fa' />
              </div>
            </div>
          </div>

          <span className='subsection_title'>IQC Failing Pending</span>
          <div className='fcosttrending'>
            <div className='fcostgraph'>
              <div className='dailygraph'>
                <span className='subsection'>
                  Weekly Failing (PROCESS){' '}
                  <IconButton
                    className='buttonIcon'
                    onClick={() => {
                      SaveExcel(iqcfailpending, 'WeeklyFailingPendingData');
                    }}
                  >
                    <AiFillFileExcel color='green' size={15} />
                    Excel
                  </IconButton>
                </span>
                <IQC_FAILING_PENDING data={iqcfailpending} />
              </div>
            </div>
            <div className='fcostgraph'>
              <div className='dailygraph'>
                <span className='subsection'>
                  Weekly Holding (INCOMING)
                  <IconButton
                    className='buttonIcon'
                    onClick={() => {
                      SaveExcel(iqcholdingpending, 'WeeklyHoldingPendingData');
                    }}
                  >
                    <AiFillFileExcel color='green' size={15} />
                    Excel
                  </IconButton>
                </span>
                <IQC_FAILING_PENDING data={iqcholdingpending} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default IQC_REPORT;

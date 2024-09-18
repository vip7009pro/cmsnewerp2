import React, { useEffect, useRef, useState } from 'react'
import './PATROL.scss'
import PATROL_COMPONENT from './PATROL_COMPONENT'
import PATROL_HEADER from './PATROL_HEADER'
import { INSP_PATROL_DATA, PATROL_HEADER_DATA, PQC3_DATA } from '../../../api/GlobalInterface'
import { generalQuery } from '../../../api/Api'
import { Button, Checkbox } from '@mui/material'
import moment from 'moment'
import { FromInputColumn } from '../../../components/StyledComponents/ComponentLib'
import Swal from 'sweetalert2'
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
const PATROL = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [patrolheaderdata, setPatrolHeaderData] = useState<PATROL_HEADER_DATA[]>([]);
  const [fullScreen, setFullScreen] = useState(false);
  const [pqcdatatable, setPqcDataTable] = useState<Array<PQC3_DATA>>([]);
  const [inspectionPatrolTable, setInspectionPatrolTable] = useState<Array<INSP_PATROL_DATA>>([]);
  const fromdateRef = useRef((moment().format("YYYY-MM-DD")));
  const todateRef = useRef((moment().format("YYYY-MM-DD")));
  const liveStream = useRef(true);
  const [isLoading, setIsLoading] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const getPatrolHeaderData = async () => {
    console.log('vao get patrol header')
    /* console.log(fromdateRef.current);
    console.log(todateRef.current); */
    setIsLoading(true);
    await generalQuery("getpatrolheader", {
      FROM_DATE: liveStream?.current ? moment().format('YYYY-MM-DD') : fromdateRef.current,
      TO_DATE: liveStream?.current ? moment().format('YYYY-MM-DD') : todateRef.current,
    })
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: PATROL_HEADER_DATA[] = response.data.data.map(
            (element: PATROL_HEADER_DATA, index: number) => {
              return {
                ...element,
              };
            }
          );
          //console.log(loadeddata);
          setIsLoading(false);
          setPatrolHeaderData(loadeddata);
        } else {
          //Swal.fire("Thông báo", "Lỗi BOM SX: " + response.data.message, "error");
          setIsLoading(true);
          setPatrolHeaderData([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getInspectionPatrol = () => {
    generalQuery("trainspectionpatrol", {
      FROM_DATE: liveStream?.current ? moment().format('YYYY-MM-DD') : fromdateRef.current,
      TO_DATE: liveStream?.current ? moment().format('YYYY-MM-DD') : todateRef.current,
    })
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: INSP_PATROL_DATA[] = response.data.data.map(
            (element: INSP_PATROL_DATA, index: number) => {
              return {
                ...element,
              };
            }
          );
          //console.log(loadeddata);
          setInspectionPatrolTable(loadeddata);
        } else {
          //Swal.fire("Thông báo", "Lỗi BOM SX: " + response.data.message, "error");
          setInspectionPatrolTable([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const traPQC3 = () => {
    console.log('liveStream', liveStream.current);
    generalQuery("trapqc3data", {
      ALLTIME: false,
      FROM_DATE: liveStream.current ? moment().format('YYYY-MM-DD') : fromdateRef.current,
      TO_DATE: liveStream.current ? moment().format('YYYY-MM-DD') : todateRef.current,
      CUST_NAME: '',
      PROCESS_LOT_NO: '',
      G_CODE: '',
      G_NAME: '',
      PROD_TYPE: '',
      EMPL_NAME: '',
      PROD_REQUEST_NO: '',
      ID: '',
      FACTORY: 'All',
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: PQC3_DATA[] = response.data.data.map(
            (element: PQC3_DATA, index: number) => {
              //summaryOutput += element.OUTPUT_QTY_EA;
              return {
                ...element,
                OCCURR_TIME: moment
                  .utc(element.OCCURR_TIME)
                  .format("YYYY-MM-DD HH:mm:ss"),
                id: index,
              };
            },
          );
          //setSummaryInspect('Tổng Xuất: ' +  summaryOutput.toLocaleString('en-US') + 'EA');
          if (loadeddata.length > 3) {
            setPqcDataTable(loadeddata.slice(0, 3));
          }
          else {
            setPqcDataTable(loadeddata);
          }
        } else {
          //Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
          setPqcDataTable([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const initFunction = () => {
    if (liveStream.current) {
      fromdateRef.current = moment().format('YYYY-MM-DD')
      todateRef.current = moment().format('YYYY-MM-DD')
    }
    if (!isLoading) {
      /* getPatrolHeaderData(); */
    }
    else {
      Swal.fire('Thông báo', 'Đang load đợi tý', 'warning');
    }
    traPQC3();
    getInspectionPatrol();
  }
  useEffect(() => {
    initFunction();
    let intervalID = window.setInterval(() => {
      initFunction();
    }, 10000);
    return () => {
      clearInterval(intervalID);
    }
  }, [])
  return (
    <div className="patrol" style={{
      position: fullScreen ? `fixed` : `relative`,
      top: fullScreen ? `0` : `0`,
      left: fullScreen ? `0` : `0`,
      zIndex: fullScreen ? `99999` : '9'
    }}>
      <div className="header" style={{ backgroundImage: theme.CMS.backgroundImage }}>
        <img alt="running" src="/blink.gif" width={120} height={50}></img>
       {/*  <PATROL_HEADER data={patrolheaderdata} /> */}
        <div className="control">
          <div className="checkb">
            <Button color='secondary' onClick={() => {
              initFunction();
            }}>Load</Button>
            <Checkbox
              checked={fullScreen}
              onChange={(e) => {
                //console.log(onlyRunning);
                setFullScreen(!fullScreen);
              }}
              inputProps={{ "aria-label": "controlled" }}
            />
            Full Screen
            <Checkbox
              checked={liveStream.current}
              onChange={(e) => {
                //console.log(onlyRunning);
                liveStream.current = !liveStream.current
                if (liveStream.current === true) {
                  fromdateRef.current = moment().format('YYYY-MM-DD')
                  todateRef.current = moment().format('YYYY-MM-DD')
                }
                setTrigger(!trigger);
              }}
              inputProps={{ "aria-label": "controlled" }}
            />
            Live
          </div>
          <div className='forminputcolumn'>
            <label>
              <b>FROM:</b>
              <input
                type="date"
                value={fromdateRef.current.toString()}
                onChange={(e) => { fromdateRef.current = e.target.value; setTrigger(!trigger) }}
              ></input>
            </label>
            <label>
              <b>TO:</b>{" "}
              <input
                type="date"
                value={todateRef.current.toString()}
                onChange={(e) => { todateRef.current = e.target.value; setTrigger(!trigger) }}
              ></input>
            </label>
          </div>
        </div>
      </div>
      <div className="row">
        {
          pqcdatatable.map((ele: PQC3_DATA, index: number) => {
            return (
              <PATROL_COMPONENT key={index} data={{
                CUST_NAME_KD: ele.CUST_NAME_KD,
                DEFECT: ele.ERR_CODE + ':' + ele.DEFECT_PHENOMENON,
                EQ: ele.LINE_NO,
                FACTORY: ele.FACTORY,
                G_NAME_KD: ele.G_NAME_KD,
                INSPECT_QTY: ele.INSPECT_QTY,
                INSPECT_NG: ele.DEFECT_QTY,
                LINK: `/pqc/PQC3_${ele.PQC3_ID + 1}.png`,
                TIME: ele.OCCURR_TIME,
                EMPL_NO: ele.LINEQC_PIC
              }} />
            )
          })
        }
      </div>
      <div className="row">
        {
          inspectionPatrolTable.filter((element: INSP_PATROL_DATA, index: number) => element.PHANLOAI === 'NL').map((ele: INSP_PATROL_DATA, index: number) => {
            return (
              <PATROL_COMPONENT key={index} data={{
                CUST_NAME_KD: ele.CUST_NAME_KD,
                DEFECT: ele.ERR_CODE + ':' + ele.DEFECT_PHENOMENON,
                EQ: ele.EQUIPMENT_CD,
                FACTORY: ele.FACTORY,
                G_NAME_KD: ele.G_NAME_KD,
                INSPECT_QTY: ele.INSPECT_QTY,
                INSPECT_NG: ele.DEFECT_QTY,
                LINK: `/INS_PATROL/INS_PATROL_${ele.INS_PATROL_ID}.png`,
                TIME: ele.OCCURR_TIME,
                EMPL_NO: ele.INSP_PIC
              }} />
            )
          })
        }
      </div>
      <div className="row">
        {
          inspectionPatrolTable.filter((element: INSP_PATROL_DATA, index: number) => element.PHANLOAI === 'PK').map((ele: INSP_PATROL_DATA, index: number) => {
            return (
              <PATROL_COMPONENT key={index} data={{
                CUST_NAME_KD: ele.CUST_NAME_KD,
                DEFECT: ele.ERR_CODE + ':' + ele.DEFECT_PHENOMENON,
                EQ: ele.EQUIPMENT_CD,
                FACTORY: ele.FACTORY,
                G_NAME_KD: ele.G_NAME_KD,
                INSPECT_QTY: ele.INSPECT_QTY,
                INSPECT_NG: ele.DEFECT_QTY,
                LINK: `/INS_PATROL/INS_PATROL_${ele.INS_PATROL_ID}.png`,
                TIME: ele.OCCURR_TIME,
                EMPL_NO: ele.INSP_PIC
              }} />
            )
          })
        }
      </div>
    </div>
  )
}
export default PATROL
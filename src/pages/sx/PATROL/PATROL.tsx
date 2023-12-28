import React, { useEffect, useState } from 'react'
import './PATROL.scss'
import PATROL_COMPONENT from './PATROL_COMPONENT'
import PATROL_HEADER from './PATROL_HEADER'
import { INSP_PATROL_DATA, PATROL_HEADER_DATA, PQC3_DATA } from '../../../api/GlobalInterface'
import { generalQuery } from '../../../api/Api'
import { Checkbox } from '@mui/material'
import moment from 'moment'
const PATROL = () => {
  const [patrolheaderdata, setPatrolHeaderData] = useState<PATROL_HEADER_DATA[]>([]);
  const [fullScreen, setFullScreen] = useState(false);
  const [pqcdatatable, setPqcDataTable] = useState<Array<PQC3_DATA>>([]);
  const [inspectionPatrolTable, setInspectionPatrolTable] = useState<Array<INSP_PATROL_DATA>>([]);
  const getPatrolHeaderData = () => {
    generalQuery("getpatrolheader", {
      FROM_DATE: moment().format('YYYY-MM-DD'),
      TO_DATE: moment().format('YYYY-MM-DD'),
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
          setPatrolHeaderData(loadeddata);
        } else {
          //Swal.fire("Thông báo", "Lỗi BOM SX: " + response.data.message, "error");
          setPatrolHeaderData([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getInspectionPatrol = () => {
    generalQuery("trainspectionpatrol", {
      FROM_DATE: moment().format('YYYY-MM-DD'),
      TO_DATE: moment().format('YYYY-MM-DD'),
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
    generalQuery("trapqc3data", {
      ALLTIME: false,
      FROM_DATE: moment().format('YYYY-MM-DD'),
      TO_DATE: moment().format('YYYY-MM-DD'),
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
    getPatrolHeaderData();
    traPQC3();
    getInspectionPatrol();
  }
  useEffect(() => {
    initFunction();
    let intervalID = window.setInterval(() => {
      initFunction();
    }, 30000);
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

      <div className="header">
      <img alt="running" src="/blink.gif" width={120} height={50}></img>
        <PATROL_HEADER data={patrolheaderdata} />        
        <Checkbox
          checked={fullScreen}
          onChange={(e) => {
            //console.log(onlyRunning);
            setFullScreen(!fullScreen);
          }}
          inputProps={{ "aria-label": "controlled" }}
        />
        Full Screen
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
                LINK: `http://192.168.1.192/pqc/PQC3_${ele.PQC3_ID + 1}.png`,
                TIME: ele.OCCURR_TIME,
                EMPL_NO: ele.LINEQC_PIC
              }} />
            )
          })
        }
      </div>
      <div className="row">
        {
          inspectionPatrolTable.map((ele: INSP_PATROL_DATA, index: number) => {
            return (
              <PATROL_COMPONENT key={index} data={{
                CUST_NAME_KD: ele.CUST_NAME_KD,
                DEFECT: ele.ERR_CODE + ':' + ele.DEFECT_PHENOMENON,
                EQ: ele.EQUIPMENT_CD,
                FACTORY: ele.FACTORY,
                G_NAME_KD: ele.G_NAME_KD,
                INSPECT_QTY: ele.INSPECT_QTY,
                INSPECT_NG: ele.DEFECT_QTY,
                LINK: `http://192.168.1.192/INS_PATROL/INS_PATROL_${ele.INS_PATROL_ID}.png`,
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
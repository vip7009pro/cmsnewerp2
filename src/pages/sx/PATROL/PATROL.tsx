import React, { useEffect, useRef, useState } from 'react'
import './PATROL.scss'
import PATROL_COMPONENT from './PATROL_COMPONENT'

import { generalQuery } from '../../../api/Api'
import { Button, Checkbox, FormControlLabel } from '@mui/material'
import moment from 'moment'
import Swal from 'sweetalert2'
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { PATROL_HEADER_DATA } from '../../qlsx/QLSXPLAN/interfaces/khsxInterface'
import { DTC_PATROL_DATA, INSP_PATROL_DATA, PQC3_DATA } from '../../qc/interfaces/qcInterface'

const PATROL = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [patrolheaderdata, setPatrolHeaderData] = useState<PATROL_HEADER_DATA[]>([]);
  const [fullScreen, setFullScreen] = useState(false);
  const [pqcdatatable, setPqcDataTable] = useState<Array<PQC3_DATA>>([]);
  const [inspectionPatrolTable, setInspectionPatrolTable] = useState<Array<INSP_PATROL_DATA>>([]);
  const [dtcPatrolTable, setDtcPatrolTable] = useState<Array<DTC_PATROL_DATA>>([]);
  const fromdateRef = useRef((moment().format("YYYY-MM-DD")));
  const todateRef = useRef((moment().format("YYYY-MM-DD")));
  const liveStream = useRef(true);
  const [isLoading, setIsLoading] = useState(false);
  const [trigger, setTrigger] = useState(false);

  const getPatrolHeaderData = async () => {
    console.log('vao get patrol header')
    setIsLoading(true);
    await generalQuery("getpatrolheader", {
      FROM_DATE: liveStream?.current ? moment().format('YYYY-MM-DD') : fromdateRef.current,
      TO_DATE: liveStream?.current ? moment().format('YYYY-MM-DD') : todateRef.current,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: PATROL_HEADER_DATA[] = response.data.data.map(
            (element: PATROL_HEADER_DATA, index: number) => {
              return {
                ...element,
              };
            }
          );
          setIsLoading(false);
          setPatrolHeaderData(loadeddata);
        } else {
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
        if (response.data.tk_status !== "NG") {
          const loadeddata: INSP_PATROL_DATA[] = response.data.data.map(
            (element: INSP_PATROL_DATA, index: number) => {
              return {
                ...element,
                id: index
              };
            }
          );
          setInspectionPatrolTable(loadeddata);
        } else {
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
        if (response.data.tk_status !== "NG") {
          const loadeddata: PQC3_DATA[] = response.data.data.map(
            (element: PQC3_DATA, index: number) => {
              return {
                ...element,
                OCCURR_TIME: moment
                  .utc(element.OCCURR_TIME)
                  .format("YYYY-MM-DD HH:mm:ss"),
                id: index,
              };
            },
          );
          if (loadeddata.length > 3) {
            setPqcDataTable(loadeddata.slice(0, 3));
          }
          else {
            setPqcDataTable(loadeddata);
          }
        } else {
          setPqcDataTable([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const loadDTCPatrolData = () => {
    generalQuery("loadDTCPatrol", {
      FROM_DATE: liveStream?.current ? moment().format('YYYY-MM-DD') : fromdateRef.current,
      TO_DATE: liveStream?.current ? moment().format('YYYY-MM-DD') : todateRef.current,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: DTC_PATROL_DATA[] = response.data.data.map(
            (element: DTC_PATROL_DATA, index: number) => {
              return {
                ...element,
                INS_DATE: moment
                  .utc(element.INS_DATE)
                  .format("YYYY-MM-DD HH:mm:ss"),
                id: index
              };
            }
          );
          setDtcPatrolTable(loadeddata);
        } else {
          setDtcPatrolTable([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const initFunction = () => {
    if (liveStream.current) {
      fromdateRef.current = moment().format('YYYY-MM-DD')
      todateRef.current = moment().format('YYYY-MM-DD')
    }
    if (!isLoading) {
      getPatrolHeaderData();
    }
    else {
      Swal.fire('Thông báo', 'Đang load đợi tý', 'warning');
    }
    traPQC3();
    getInspectionPatrol();
    loadDTCPatrolData();
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

  const renderLane = (
    title: string,
    subtitle: string,
    items: any[],
    renderItem: (ele: any, index: number) => React.ReactNode,
  ) => {
    if (!items || items.length === 0) return null;
    return (
      <section className="patrol_lane">
        <div className="patrol_lane__header">
          <div className="patrol_lane__title">{title}</div>
          <div className="patrol_lane__subtitle">
            {subtitle}
            <span className="patrol_lane__count">{items.length}</span>
          </div>
        </div>
        <div className="patrol_lane__body">
          <div className="patrol_lane__track">
            {items.map((ele: any, index: number) => renderItem(ele, index))}
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="patrol" style={{
      position: fullScreen ? `fixed` : `relative`,
      top: fullScreen ? `0` : `0`,
      left: fullScreen ? `0` : `0`,
      zIndex: fullScreen ? `99999` : '9'
    }}>
      <div className="patrol_header" style={{ backgroundImage: theme.CMS.backgroundImage }}>
        <div className="patrol_header__left">
          <div className="patrol_header__title">PATROL</div>
          <div className="patrol_header__subtitle">Auto refresh 10s • Double-check events</div>
        </div>
        <div className="patrol_header__right">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              initFunction();
            }}
          >
            Load
          </Button>

          <FormControlLabel
            control={
              <Checkbox
                checked={fullScreen}
                onChange={() => {
                  setFullScreen(!fullScreen);
                }}
              />
            }
            label="Full Screen"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={liveStream.current}
                onChange={() => {
                  liveStream.current = !liveStream.current
                  if (liveStream.current === true) {
                    fromdateRef.current = moment().format('YYYY-MM-DD')
                    todateRef.current = moment().format('YYYY-MM-DD')
                  }
                  setTrigger(!trigger);
                }}
              />
            }
            label="Live"
          />

          <div className="patrol_header__dates">
            <label>
              <b>FROM:</b>
              <input
                type="date"
                value={fromdateRef.current.toString()}
                onChange={(e) => {
                  fromdateRef.current = e.target.value;
                  setTrigger(!trigger)
                }}
                disabled={liveStream.current}
              ></input>
            </label>
            <label>
              <b>TO:</b>{" "}
              <input
                type="date"
                value={todateRef.current.toString()}
                onChange={(e) => {
                  todateRef.current = e.target.value;
                  setTrigger(!trigger)
                }}
                disabled={liveStream.current}
              ></input>
            </label>
          </div>
        </div>
      </div>
      <div className="patrol_content">
        {renderLane(
          "PQC3",
          liveStream.current ? "Today" : `${fromdateRef.current} → ${todateRef.current}`,
          pqcdatatable,
          (ele: PQC3_DATA, index: number) => {
            return (
              <PATROL_COMPONENT
                key={ele.PQC3_ID ?? index}
                data={{
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
                }}
              />
            )
          }
        )}

        {renderLane(
          "DTC",
          liveStream.current ? "Today" : `${fromdateRef.current} → ${todateRef.current}`,
          dtcPatrolTable,
          (ele: DTC_PATROL_DATA, index: number) => {
            return (
              <PATROL_COMPONENT
                key={ele.DTC_ID ?? index}
                data={{
                  CUST_NAME_KD: ele.M_CODE !=='B0000035' ? ele.VENDOR: ele.CUST_NAME_KD,
                  DEFECT: ele.DEFECT_PHENOMENON,
                  EQ: ele.TEST_NAME,
                  FACTORY: ele.M_CODE !=='B0000035'? ele.M_FACTORY: ele.FACTORY,
                  G_NAME_KD: ele.M_CODE !=='B0000035' ?  ele.M_NAME + '|' + ele.WIDTH_CD :  ele.G_NAME_KD,
                  INSPECT_QTY: 5,
                  INSPECT_NG: 5,
                  LINK: `/DTC_PATROL/${ele.DTC_ID}_${ele.TEST_CODE}${ele.FILE_}`,
                  TIME: ele.INS_DATE,
                  EMPL_NO: ele.INS_EMPL
                }}
              />
            )
          }
        )}

        {renderLane(
          "INS Patrol",
          "NL / PK",
          inspectionPatrolTable.filter((element: INSP_PATROL_DATA) => element.PHANLOAI === 'NL' || element.PHANLOAI === 'PK'),
          (ele: INSP_PATROL_DATA, index: number) => {
            return (
              <PATROL_COMPONENT
                key={ele.INS_PATROL_ID ?? index}
                data={{
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
                }}
              />
            )
          }
        )}
      </div>
    </div>
  )
}
export default PATROL
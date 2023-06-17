import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  EditingState,
  FilteringState,
  IntegratedFiltering,
  IntegratedPaging,
  IntegratedSelection,
  IntegratedSorting,
  PagingState,
  SearchState,
  SelectionState,
  SortingState,
  TableRowDetail,
} from "@devexpress/dx-react-grid";
import { generalQuery } from "../../../../api/Api";
import moment from "moment";
import {
  Chart,
  Connector,
  Legend,
  Label,
  Series,
  Title,
  Tooltip,
  CommonSeriesSettings,
  Format,
  ArgumentAxis,
  ValueAxis,
} from "devextreme-react/chart";
import PieChart, { Export, Font } from "devextreme-react/pie-chart";
import "./CAPASX.scss";
import CIRCLE_COMPONENT from "./CIRCLE_COMPONENT/CIRCLE_COMPONENT";
interface DATA_DIEM_DANH {
  id: string;
  EMPL_NO: string;
  CMS_ID: string;
  MIDLAST_NAME: string;
  FIRST_NAME: string;
  PHONE_NUMBER: string;
  SEX_NAME: string;
  WORK_STATUS_NAME: string;
  FACTORY_NAME: string;
  JOB_NAME: string;
  WORK_SHIF_NAME: string;
  WORK_POSITION_CODE: number;
  WORK_POSITION_NAME: string;
  SUBDEPTNAME: string;
  MAINDEPTNAME: string;
  REQUEST_DATE: string;
  APPLY_DATE: string;
  APPROVAL_STATUS: string;
  OFF_ID: number;
  CA_NGHI: number;
  ON_OFF: number;
  OVERTIME_INFO: string;
  OVERTIME: number;
  REASON_NAME: string;
  REMARK: string;
}
interface MACHINE_COUNTING {
  EQ_NAME: string;
  EQ_QTY: number;
}
interface YCSX_BALANCE_CAPA_DATA {
  EQ_NAME: string;
  YCSX_BALANCE: number;
}
interface EQ_STT {
  FACTORY: string;
  EQ_NAME: string;
  EQ_ACTIVE: string;
  REMARK: string;
  EQ_STATUS: string;
  CURR_PLAN_ID: string;
  CURR_G_CODE: string;
  INS_EMPL: string;
  INS_DATE: string;
  UPD_EMPL: string;
  UPD_DATE: string;
  EQ_CODE: string;
  G_NAME_KD: string;
  STEP: number;
}
const CAPASX = () => {
  const dailytime: number = 1260;
  const [eq_status, setEQ_STATUS] = useState<EQ_STT[]>([]);
  const [datadiemdanh, setDataDiemDanh] = useState<DATA_DIEM_DANH[]>([]);
  const [machinecount, setMachineCount] = useState<MACHINE_COUNTING[]>([]);
  const [ycsxbalance, setYCSXBALANCE] = useState<YCSX_BALANCE_CAPA_DATA[]>([]);
  const [FR_EMPL, setFR_EMPL] = useState({
    TNM1: 0,
    TNM2: 0,
    NM1: 0,
    NM2: 0,
  });
  const [SR_EMPL, setSR_EMPL] = useState({
    TNM1: 0,
    TNM2: 0,
    NM1: 0,
    NM2: 0,
  });
  const [DC_EMPL, setDC_EMPL] = useState({
    TNM1: 0,
    TNM2: 0,
    NM1: 0,
    NM2: 0,
  });
  const [ED_EMPL, setED_EMPL] = useState({
    TNM1: 0,
    TNM2: 0,
    NM1: 0,
    NM2: 0,
  });
  const getDiemDanhAllBP = () => {
    generalQuery("diemdanhallbp", {
      MAINDEPTCODE: 5,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: DATA_DIEM_DANH[] = response.data.data.map(
            (element: DATA_DIEM_DANH, index: number) => {
              return {
                ...element,
                REQUEST_DATE: moment(element.REQUEST_DATE)
                  .utc()
                  .format("YYYY-MM-DD"),
                APPLY_DATE: moment(element.APPLY_DATE)
                  .utc()
                  .format("YYYY-MM-DD"),
              };
            }
          );
          setDataDiemDanh(loaded_data);
          setED_EMPL({
            TNM1: loaded_data.filter((ele: DATA_DIEM_DANH, index: number) => {
              return ele.WORK_POSITION_NAME === "SX_ED1";
            }).length,
            TNM2: loaded_data.filter((ele: DATA_DIEM_DANH, index: number) => {
              return ele.WORK_POSITION_NAME === "SX_ED3";
            }).length,
            NM1: loaded_data.filter((ele: DATA_DIEM_DANH, index: number) => {
              return ele.WORK_POSITION_NAME === "SX_ED1" && ele.ON_OFF === 1;
            }).length,
            NM2: loaded_data.filter((ele: DATA_DIEM_DANH, index: number) => {
              return ele.WORK_POSITION_NAME === "SX_ED3" && ele.ON_OFF === 1;
            }).length,
          });
          setSR_EMPL({
            TNM1: loaded_data.filter((ele: DATA_DIEM_DANH, index: number) => {
              return ele.WORK_POSITION_NAME === "SX_SR1";
            }).length,
            TNM2: loaded_data.filter((ele: DATA_DIEM_DANH, index: number) => {
              return ele.WORK_POSITION_NAME === "SX_SR3";
            }).length,
            NM1: loaded_data.filter((ele: DATA_DIEM_DANH, index: number) => {
              return ele.WORK_POSITION_NAME === "SX_SR1" && ele.ON_OFF === 1;
            }).length,
            NM2: loaded_data.filter((ele: DATA_DIEM_DANH, index: number) => {
              return ele.WORK_POSITION_NAME === "SX_SR3" && ele.ON_OFF === 1;
            }).length,
          });
          setDC_EMPL({
            TNM1: loaded_data.filter((ele: DATA_DIEM_DANH, index: number) => {
              return ele.WORK_POSITION_NAME === "SX_DC1";
            }).length,
            TNM2: loaded_data.filter((ele: DATA_DIEM_DANH, index: number) => {
              return ele.WORK_POSITION_NAME === "SX_DC3";
            }).length,
            NM1: loaded_data.filter((ele: DATA_DIEM_DANH, index: number) => {
              return ele.WORK_POSITION_NAME === "SX_DC1" && ele.ON_OFF === 1;
            }).length,
            NM2: loaded_data.filter((ele: DATA_DIEM_DANH, index: number) => {
              return ele.WORK_POSITION_NAME === "SX_DC3" && ele.ON_OFF === 1;
            }).length,
          });
          setFR_EMPL({
            TNM1: loaded_data.filter((ele: DATA_DIEM_DANH, index: number) => {
              return ele.WORK_POSITION_NAME === "SX_FR1";
            }).length,
            TNM2: loaded_data.filter((ele: DATA_DIEM_DANH, index: number) => {
              return ele.WORK_POSITION_NAME === "SX_FR3";
            }).length,
            NM1: loaded_data.filter((ele: DATA_DIEM_DANH, index: number) => {
              return ele.WORK_POSITION_NAME === "SX_FR1" && ele.ON_OFF === 1;
            }).length,
            NM2: loaded_data.filter((ele: DATA_DIEM_DANH, index: number) => {
              return ele.WORK_POSITION_NAME === "SX_FR3" && ele.ON_OFF === 1;
            }).length,
          });
        } else {
          setDataDiemDanh([]);
          setFR_EMPL({
            TNM1: 0,
            TNM2: 0,
            NM1: 0,
            NM2: 0,
          });
          setSR_EMPL({
            TNM1: 0,
            TNM2: 0,
            NM1: 0,
            NM2: 0,
          });
          setDC_EMPL({
            TNM1: 0,
            TNM2: 0,
            NM1: 0,
            NM2: 0,
          });
          setED_EMPL({
            TNM1: 0,
            TNM2: 0,
            NM1: 0,
            NM2: 0,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getMachineCounting = () => {
    generalQuery("machinecounting", {})
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: MACHINE_COUNTING[] = response.data.data.map(
            (element: MACHINE_COUNTING, index: number) => {
              return {
                ...element,
                id: index,
              };
            }
          );
          setMachineCount(loaded_data);
        } else {
          setMachineCount([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getYCSXBALANCE = () => {
    generalQuery("ycsxbalancecapa", {})
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: YCSX_BALANCE_CAPA_DATA[] = response.data.data.map(
            (element: YCSX_BALANCE_CAPA_DATA, index: number) => {
              return {
                ...element,
                id: index,
              };
            }
          );
          setYCSXBALANCE(loaded_data);
        } else {
          setYCSXBALANCE([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  function customizeTooltip(pointInfo: any) {
    return {
      text: `${pointInfo.argumentText}<br/>${Number(
        pointInfo.valueText
      ).toLocaleString("en-US", { maximumFractionDigits: 1 })} days`,
    };
  }
  const dataSource_eq: any = [
    {
      EQ_NAME: "FR",
      WF_FOR_FULL_CAPA:
        machinecount.filter(
          (ele: MACHINE_COUNTING, index: number) => ele.EQ_NAME === "FR"
        )[0]?.EQ_QTY *
        2 *
        2,
      RETAIN_WF: FR_EMPL.TNM1 + FR_EMPL.TNM2,
      REALTIME_WF: FR_EMPL.NM1 + FR_EMPL.NM2,
    },
    {
      EQ_NAME: "SR",
      WF_FOR_FULL_CAPA:
        machinecount.filter(
          (ele: MACHINE_COUNTING, index: number) => ele.EQ_NAME === "SR"
        )[0]?.EQ_QTY *
        2 *
        2,
      RETAIN_WF: SR_EMPL.TNM1 + SR_EMPL.TNM2,
      REALTIME_WF: SR_EMPL.NM1 + SR_EMPL.NM2,
    },
    {
      EQ_NAME: "DC",
      WF_FOR_FULL_CAPA:
        machinecount.filter(
          (ele: MACHINE_COUNTING, index: number) => ele.EQ_NAME === "DC"
        )[0]?.EQ_QTY *
        2 *
        1,
      RETAIN_WF: DC_EMPL.TNM1 + DC_EMPL.TNM2,
      REALTIME_WF: DC_EMPL.NM1 + DC_EMPL.NM2,
    },
    {
      EQ_NAME: "ED",
      WF_FOR_FULL_CAPA:
        machinecount.filter(
          (ele: MACHINE_COUNTING, index: number) => ele.EQ_NAME === "ED"
        )[0]?.EQ_QTY *
        2 *
        1,
      RETAIN_WF: ED_EMPL.TNM1 + ED_EMPL.TNM2,
      REALTIME_WF: ED_EMPL.NM1 + ED_EMPL.NM2,
    },
  ];
  const dataSource_capa: any = [
    {
      EQ_NAME: "ED",
      EQ_LEADTIME:
        ycsxbalance.filter(
          (ele: YCSX_BALANCE_CAPA_DATA, index: number) => ele.EQ_NAME === "ED"
        )[0]?.YCSX_BALANCE /
        Math.min(
          ((ED_EMPL.NM1 + ED_EMPL.NM2) / 4) * dailytime,
          machinecount.filter(
            (ele: MACHINE_COUNTING, index: number) => ele.EQ_NAME === "ED"
          )[0]?.EQ_QTY * dailytime
        ),
      EQ_AVL_LEADTIME:
        ycsxbalance.filter(
          (ele: YCSX_BALANCE_CAPA_DATA, index: number) => ele.EQ_NAME === "ED"
        )[0]?.YCSX_BALANCE /
        Math.min(
          ((ED_EMPL.TNM1 + ED_EMPL.TNM2) / 4) * dailytime,
          machinecount.filter(
            (ele: MACHINE_COUNTING, index: number) => ele.EQ_NAME === "ED"
          )[0]?.EQ_QTY * dailytime
        ),
    },
    {
      EQ_NAME: "DC",
      EQ_LEADTIME:
        ycsxbalance.filter(
          (ele: YCSX_BALANCE_CAPA_DATA, index: number) => ele.EQ_NAME === "DC"
        )[0]?.YCSX_BALANCE /
        Math.min(
          ((DC_EMPL.NM1 + DC_EMPL.NM2) / 4) * dailytime,
          machinecount.filter(
            (ele: MACHINE_COUNTING, index: number) => ele.EQ_NAME === "DC"
          )[0]?.EQ_QTY * dailytime
        ),
      EQ_AVL_LEADTIME:
        ycsxbalance.filter(
          (ele: YCSX_BALANCE_CAPA_DATA, index: number) => ele.EQ_NAME === "DC"
        )[0]?.YCSX_BALANCE /
        Math.min(
          ((DC_EMPL.TNM1 + DC_EMPL.TNM2) / 4) * dailytime,
          machinecount.filter(
            (ele: MACHINE_COUNTING, index: number) => ele.EQ_NAME === "DC"
          )[0]?.EQ_QTY * dailytime
        ),
    },
    {
      EQ_NAME: "SR",
      EQ_LEADTIME:
        ycsxbalance.filter(
          (ele: YCSX_BALANCE_CAPA_DATA, index: number) => ele.EQ_NAME === "SR"
        )[0]?.YCSX_BALANCE /
        Math.min(
          ((SR_EMPL.NM1 + SR_EMPL.NM2) / 4) * dailytime,
          machinecount.filter(
            (ele: MACHINE_COUNTING, index: number) => ele.EQ_NAME === "SR"
          )[0]?.EQ_QTY * dailytime
        ),
      EQ_AVL_LEADTIME:
        ycsxbalance.filter(
          (ele: YCSX_BALANCE_CAPA_DATA, index: number) => ele.EQ_NAME === "SR"
        )[0]?.YCSX_BALANCE /
        Math.min(
          ((SR_EMPL.TNM1 + SR_EMPL.TNM2) / 4) * dailytime,
          machinecount.filter(
            (ele: MACHINE_COUNTING, index: number) => ele.EQ_NAME === "SR"
          )[0]?.EQ_QTY * dailytime
        ),
    },
    {
      EQ_NAME: "FR",
      EQ_LEADTIME:
        ycsxbalance.filter(
          (ele: YCSX_BALANCE_CAPA_DATA, index: number) => ele.EQ_NAME === "FR"
        )[0]?.YCSX_BALANCE /
        Math.min(
          ((FR_EMPL.NM1 + FR_EMPL.NM2) / 4) * dailytime,
          machinecount.filter(
            (ele: MACHINE_COUNTING, index: number) => ele.EQ_NAME === "FR"
          )[0]?.EQ_QTY * dailytime
        ),
      EQ_AVL_LEADTIME:
        ycsxbalance.filter(
          (ele: YCSX_BALANCE_CAPA_DATA, index: number) => ele.EQ_NAME === "FR"
        )[0]?.YCSX_BALANCE /
        Math.min(
          ((FR_EMPL.TNM1 + FR_EMPL.TNM2) / 4) * dailytime,
          machinecount.filter(
            (ele: MACHINE_COUNTING, index: number) => ele.EQ_NAME === "FR"
          )[0]?.EQ_QTY * dailytime
        ),
    },
  ];
  const getTotalEMPL = () => {
    return (
      machinecount.filter(
        (ele: MACHINE_COUNTING, index: number) => ele.EQ_NAME === "FR"
      )[0]?.EQ_QTY *
        2 *
        2 +
      machinecount.filter(
        (ele: MACHINE_COUNTING, index: number) => ele.EQ_NAME === "SR"
      )[0]?.EQ_QTY *
        2 *
        2 +
      machinecount.filter(
        (ele: MACHINE_COUNTING, index: number) => ele.EQ_NAME === "DC"
      )[0]?.EQ_QTY *
        2 *
        1 +
      machinecount.filter(
        (ele: MACHINE_COUNTING, index: number) => ele.EQ_NAME === "ED"
      )[0]?.EQ_QTY *
        2 *
        1
    );
  };
  const getRetainEMPL = () => {
    return datadiemdanh.filter(
      (e: DATA_DIEM_DANH, index: number) =>
        e.WORK_POSITION_NAME === "SX_DC1" ||
        e.WORK_POSITION_NAME === "SX_SR1" ||
        e.WORK_POSITION_NAME === "SX_ED1" ||
        e.WORK_POSITION_NAME === "SX_FR1" ||
        e.WORK_POSITION_NAME === "SX_ED3" ||
        e.WORK_POSITION_NAME === "SX_FR3"
    ).length;
  };
  const getRealTimeEMPL = () => {
    return datadiemdanh.filter(
      (e: DATA_DIEM_DANH, index: number) =>
        (e.WORK_POSITION_NAME === "SX_DC1" ||
          e.WORK_POSITION_NAME === "SX_SR1" ||
          e.WORK_POSITION_NAME === "SX_ED1" ||
          e.WORK_POSITION_NAME === "SX_FR1" ||
          e.WORK_POSITION_NAME === "SX_ED3" ||
          e.WORK_POSITION_NAME === "SX_FR3") &&
        e.ON_OFF === 1
    ).length;
  };
  const getFRTotal = () => {
    return machinecount.filter(
      (ele: MACHINE_COUNTING, index: number) => ele.EQ_NAME === "FR"
    )[0]?.EQ_QTY;
  };
  const getSRTotal = () => {
    return machinecount.filter(
      (ele: MACHINE_COUNTING, index: number) => ele.EQ_NAME === "SR"
    )[0]?.EQ_QTY;
  };
  const getDCTotal = () => {
    return machinecount.filter(
      (ele: MACHINE_COUNTING, index: number) => ele.EQ_NAME === "DC"
    )[0]?.EQ_QTY;
  };
  const getEDTotal = () => {
    return machinecount.filter(
      (ele: MACHINE_COUNTING, index: number) => ele.EQ_NAME === "ED"
    )[0]?.EQ_QTY;
  };
  const handle_loadEQ_STATUS = () => {
    generalQuery("checkEQ_STATUS", {})
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: EQ_STT[] = response.data.data.map(
            (element: EQ_STT, index: number) => {
              return {
                ...element,
                id: index,
              };
            }
          );
          //console.log(loaded_data);
          setEQ_STATUS(loaded_data);
        } else {
          setEQ_STATUS([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getrunningFR = () => {
    return eq_status.filter(
      (element: EQ_STT, index: number) =>
        element.EQ_NAME.substring(0, 2) === "FR" &&
        (element.EQ_STATUS === "MASS" || element.EQ_STATUS === "SETTING")
    ).length;
  };
  const getrunningSR = () => {
    return eq_status.filter(
      (element: EQ_STT, index: number) =>
        element.EQ_NAME.substring(0, 2) === "SR" &&
        (element.EQ_STATUS === "MASS" || element.EQ_STATUS === "SETTING")
    ).length;
  };
  const getrunningDC = () => {
    return eq_status.filter(
      (element: EQ_STT, index: number) =>
        element.EQ_NAME.substring(0, 2) === "DC" &&
        (element.EQ_STATUS === "MASS" || element.EQ_STATUS === "SETTING")
    ).length;
  };
  const getrunningED = () => {
    return eq_status.filter(
      (element: EQ_STT, index: number) =>
        element.EQ_NAME.substring(0, 2) === "ED" && element.EQ_STATUS === "MASS"
    ).length;
  };
  const workforcechartMM = useMemo(() => {
    return (
      <Chart
        id='workforcechart'
        title='WORKFORCE STATUS'
        dataSource={dataSource_eq}
        width={700}
      >
        <ArgumentAxis title='MACHINE NAME' />
        <ValueAxis title='Workforce (人)' />
        <CommonSeriesSettings
          argumentField='EQ_NAME'
          type='bar'
          hoverMode='allArgumentPoints'
          selectionMode='allArgumentPoints'
        >
          <Label visible={true}>
            <Format type='fixedPoint' precision={0} />
          </Label>
        </CommonSeriesSettings>
        <Series
          argumentField='EQ_NAME'
          valueField='WF_FOR_FULL_CAPA'
          name='WF_FOR_FULL_CAPA'
          color='#DE14FE'
        />
        <Series
          argumentField='EQ_NAME'
          valueField='RETAIN_WF'
          name='RETAIN_WF'
          color='blue'
        />
        <Series
          argumentField='EQ_NAME'
          valueField='REALTIME_WF'
          name='REALTIME_WF'
          color='#01D201'
        />
        <Legend
          verticalAlignment='bottom'
          horizontalAlignment='center'
        ></Legend>
      </Chart>
    );
  }, [datadiemdanh]);
  const leadtimechartMM = useMemo(() => {
    return (
      <Chart
        id='chartcapa'
        rotated={true}
        dataSource={dataSource_capa}
        width={700}
      >
        <ArgumentAxis title='MACHINE NAME' />
        <ValueAxis title='LeadTime (days)' />
        <Title
          text='PRODUCTION LEADTIME BY EQUIPMENT'
          subtitle='YCSX BALANCE STANDARD'
        />
        <Series
          valueField='EQ_LEADTIME'
          argumentField='EQ_NAME'
          name='REAL LEADTIME'
          type='bar'
          color='red'
        >
          <Label
            visible={true}
            customizeText={(e: any) => {
              return `${e.value.toLocaleString("en-US", {
                maximumFractionDigits: 1,
              })} days`;
            }}
          />
        </Series>
        <Series
          valueField='EQ_AVL_LEADTIME'
          argumentField='EQ_NAME'
          name='AVAILABLE LEADTIME'
          type='bar'
          color='#3DC23D'
        >
          <Label
            visible={true}
            customizeText={(e: any) => {
              return `${e.value.toLocaleString("en-US", {
                maximumFractionDigits: 1,
              })} days`;
            }}
          />
        </Series>
        <Legend visible={true} />
        <Tooltip enabled={true} customizeTooltip={customizeTooltip} />
      </Chart>
    );
  }, [ycsxbalance]);
  useEffect(() => {
    getDiemDanhAllBP();
    getMachineCounting();
    getYCSXBALANCE();
    handle_loadEQ_STATUS();
    let intervalID = window.setInterval(() => {
      handle_loadEQ_STATUS();
      getDiemDanhAllBP();
      getMachineCounting();
      getYCSXBALANCE();
    }, 5000);
    return () => {
      window.clearInterval(intervalID);
    };
  }, []);
  return (
    <div className='capaqlsx'>
      <div
        className='maintitle'
        style={{ fontSize: "2rem", alignSelf: "center" }}
      >
        PRODUCTION CAPA MANAGEMENT
      </div>
      <div className='wfandeqstatus'>
        <div className='sectiondiv'>
          <div className='title'>1. WORKFORCE STATUS (Workers Only)</div>
          <div className='totalwfdiv'>
            <CIRCLE_COMPONENT
              type='workforce'
              value={getTotalEMPL()?.toString()}
              title='WORKFORCE FOR FULL CAPA'
              color='#DE14FE'
            />
            <CIRCLE_COMPONENT
              type='workforce'
              value={getRetainEMPL()?.toString()}
              title='RETAIN WORKFORCE'
              color='blue'
            />
            <CIRCLE_COMPONENT
              type='workforce'
              value={getRealTimeEMPL()?.toString()}
              title='REAL TIME WORKFORCE'
              color='#01D201'
            />
          </div>
        </div>
        <div className='sectiondiv'>
          <div className='title'>2. EQUIPMENT STATUS (Running/Total)</div>
          <div className='totalwfdiv'>
            <CIRCLE_COMPONENT
              type='machine'
              value={
                getrunningFR()?.toString() + "/" + getFRTotal()?.toString()
              }
              title='FR'
              color='blue'
            />
            <CIRCLE_COMPONENT
              type='machine'
              value={
                getrunningSR()?.toString() + "/" + getSRTotal()?.toString()
              }
              title='SR'
              color='red'
            />
            <CIRCLE_COMPONENT
              type='machine'
              value={
                getrunningDC()?.toString() + "/" + getDCTotal()?.toString()
              }
              title='DC'
              color='#DE14FE'
            />
            <CIRCLE_COMPONENT
              type='machine'
              value={
                getrunningED()?.toString() + "/" + getEDTotal()?.toString()
              }
              title='ED'
              color='#376DD4'
            />
          </div>
        </div>
      </div>
      
      <div className='workforcechart'>
       
        <div className="sectiondiv">
        <div className='title'>3. WORKFORCE STATUS BY EQUIPMENT</div>
          <div className='starndardworkforce'>{workforcechartMM}</div>          
        </div>
        <div className="sectiondiv">     
        <div className='title'>4. PRODUCTION LEADTIME</div>    
          <div className='capachart'>{leadtimechartMM}</div>
        </div>
       
      </div>
      <div className='ycsxbalancedatatable'>
        <table>
          <thead>
            <tr>
              <th style={{ color: "black", fontWeight: "normal" }}>EQ_NAME</th>
              <th style={{ color: "black", fontWeight: "normal" }}>EQ_QTY</th>
              <th style={{ color: "black", fontWeight: "normal" }}>
                DAILY_TIME (min)
              </th>
              <th style={{ color: "black", fontWeight: "normal" }}>
                MAX_CAPA (min)
              </th>
              <th style={{ color: "black", fontWeight: "normal" }}>
                MAX_CAPA_WF (人)
              </th>
              <th style={{ color: "black", fontWeight: "normal" }}>
                AVAILABLE_WF(人)
              </th>
              <th style={{ color: "black", fontWeight: "normal" }}>
                REAL_WF (人)
              </th>
              <th style={{ color: "black", fontWeight: "normal" }}>
                EQ_AVL_CAPA (min)
              </th>
              <th style={{ color: "black", fontWeight: "normal" }}>
                EQ_REAL_CAPA (min)
              </th>
              <th style={{ color: "black", fontWeight: "normal" }}>
                MAN_AVL_CAPA (min)
              </th>
              <th style={{ color: "black", fontWeight: "normal" }}>
                MAN_REAL_CAPA (min)
              </th>
              <th style={{ color: "black", fontWeight: "normal" }}>
                YCSX_BALANCE (min)
              </th>
              <th style={{ color: "black", fontWeight: "normal" }}>
                AVL_LEADTIME (DAYS)
              </th>
              <th style={{ color: "black", fontWeight: "normal" }}>
                REL_LEADTIME (DAYS)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ color: "blue", fontWeight: "normal" }}>FR</td>
              <td style={{ color: "blue", fontWeight: "normal" }}>
                {
                  machinecount.filter(
                    (ele: MACHINE_COUNTING, index: number) =>
                      ele.EQ_NAME === "FR"
                  )[0]?.EQ_QTY
                }
              </td>
              {/* EQ QTY*/}
              <td style={{ color: "#fc2df6", fontWeight: "normal" }}>1,260</td>
              {/* DAILY TIME*/}
              <td style={{ color: "#fc2df6", fontWeight: "normal" }}>
                {(
                  machinecount.filter(
                    (ele: MACHINE_COUNTING, index: number) =>
                      ele.EQ_NAME === "FR"
                  )[0]?.EQ_QTY * dailytime
                )?.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </td>
              {/* MAX CAPA*/}
              <td style={{ color: "green", fontWeight: "normal" }}>
                {machinecount.filter(
                  (ele: MACHINE_COUNTING, index: number) => ele.EQ_NAME === "FR"
                )[0]?.EQ_QTY *
                  2 *
                  2}
              </td>
              {/* MAX CAPA WF*/}
              <td style={{ color: "green", fontWeight: "normal" }}>
                {FR_EMPL.TNM1 + FR_EMPL.TNM2}
              </td>
              {/* AVAILABLE WORKFORCE*/}
              <td style={{ color: "green", fontWeight: "normal" }}>
                {FR_EMPL.NM1 + FR_EMPL.NM2}
              </td>
              {/* REAL WORKFORCE*/}
              <td style={{ color: "#F73A8A", fontWeight: "normal" }}>
                {Math.min(
                  ((FR_EMPL.TNM1 + FR_EMPL.TNM2) / 4) * dailytime,
                  machinecount.filter(
                    (ele: MACHINE_COUNTING, index: number) =>
                      ele.EQ_NAME === "FR"
                  )[0]?.EQ_QTY * dailytime
                )?.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </td>
              {/* EQ AVAILABLE CAPA*/}
              <td style={{ color: "#F73A8A", fontWeight: "normal" }}>
                {Math.min(
                  ((FR_EMPL.NM1 + FR_EMPL.NM2) / 4) * dailytime,
                  machinecount.filter(
                    (ele: MACHINE_COUNTING, index: number) =>
                      ele.EQ_NAME === "FR"
                  )[0]?.EQ_QTY * dailytime
                )?.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </td>
              {/* EQ REAL CAPA*/}
              <td style={{ color: "blue", fontWeight: "normal" }}>
                {(
                  ((FR_EMPL.TNM1 + FR_EMPL.TNM2) * dailytime) /
                  2
                )?.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </td>
              {/* AVAILABLE CAPA*/}
              <td style={{ color: "blue", fontWeight: "normal" }}>
                {(
                  ((FR_EMPL.NM1 + FR_EMPL.NM2) * dailytime) /
                  2
                )?.toLocaleString("en-US", {
                  maximumFractionDigits: 0,
                })}
              </td>
              {/* REAL CAPA*/}
              <td style={{ color: "green", fontWeight: "normal" }}>
                {ycsxbalance
                  .filter(
                    (ele: YCSX_BALANCE_CAPA_DATA, index: number) =>
                      ele.EQ_NAME === "FR"
                  )[0]
                  ?.YCSX_BALANCE?.toLocaleString("en-US", {
                    maximumFractionDigits: 0,
                  })}
              </td>
              {/*YCSX BALANCE*/}
              <td style={{ color: "red", fontWeight: "normal" }}>
                {(
                  ycsxbalance.filter(
                    (ele: YCSX_BALANCE_CAPA_DATA, index: number) =>
                      ele.EQ_NAME === "FR"
                  )[0]?.YCSX_BALANCE /
                  Math.min(
                    ((FR_EMPL.TNM1 + FR_EMPL.TNM2) / 4) * dailytime,
                    machinecount.filter(
                      (ele: MACHINE_COUNTING, index: number) =>
                        ele.EQ_NAME === "FR"
                    )[0]?.EQ_QTY * dailytime
                  )
                ).toLocaleString("en-US", { maximumFractionDigits: 1 })}
              </td>
              {/*AVL LEADTIME DAYS*/}
              <td style={{ color: "red", fontWeight: "normal" }}>
                {(
                  ycsxbalance.filter(
                    (ele: YCSX_BALANCE_CAPA_DATA, index: number) =>
                      ele.EQ_NAME === "FR"
                  )[0]?.YCSX_BALANCE /
                  Math.min(
                    ((FR_EMPL.NM1 + FR_EMPL.NM2) / 4) * dailytime,
                    machinecount.filter(
                      (ele: MACHINE_COUNTING, index: number) =>
                        ele.EQ_NAME === "FR"
                    )[0]?.EQ_QTY * dailytime
                  )
                ).toLocaleString("en-US", { maximumFractionDigits: 1 })}
              </td>
              {/*REL LEADTIME DAYS*/}
            </tr>
            <tr>
              <td style={{ color: "blue", fontWeight: "normal" }}>SR</td>
              <td style={{ color: "blue", fontWeight: "normal" }}>
                {
                  machinecount.filter(
                    (ele: MACHINE_COUNTING, index: number) =>
                      ele.EQ_NAME === "SR"
                  )[0]?.EQ_QTY
                }
              </td>
              {/* EQ QTY*/}
              <td style={{ color: "#fc2df6", fontWeight: "normal" }}>1,260</td>
              {/* DAILY TIME*/}
              <td style={{ color: "#fc2df6", fontWeight: "normal" }}>
                {(
                  machinecount.filter(
                    (ele: MACHINE_COUNTING, index: number) =>
                      ele.EQ_NAME === "SR"
                  )[0]?.EQ_QTY * dailytime
                )?.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </td>
              {/* MAX CAPA*/}
              <td style={{ color: "green", fontWeight: "normal" }}>
                {machinecount.filter(
                  (ele: MACHINE_COUNTING, index: number) => ele.EQ_NAME === "SR"
                )[0]?.EQ_QTY *
                  2 *
                  2}
              </td>
              {/* MAX CAPA WF*/}
              <td style={{ color: "green", fontWeight: "normal" }}>
                {SR_EMPL.TNM1 + SR_EMPL.TNM2}
              </td>
              {/* AVAILABLE WORKFORCE*/}
              <td style={{ color: "green", fontWeight: "normal" }}>
                {SR_EMPL.NM1 + SR_EMPL.NM2}
              </td>
              {/* REAL WORKFORCE*/}
              <td style={{ color: "#F73A8A", fontWeight: "normal" }}>
                {Math.min(
                  ((SR_EMPL.TNM1 + SR_EMPL.TNM2) / 4) * dailytime,
                  machinecount.filter(
                    (ele: MACHINE_COUNTING, index: number) =>
                      ele.EQ_NAME === "SR"
                  )[0]?.EQ_QTY * dailytime
                )?.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </td>
              {/* EQ AVAILABLE CAPA*/}
              <td style={{ color: "#F73A8A", fontWeight: "normal" }}>
                {Math.min(
                  ((SR_EMPL.NM1 + SR_EMPL.NM2) / 4) * dailytime,
                  machinecount.filter(
                    (ele: MACHINE_COUNTING, index: number) =>
                      ele.EQ_NAME === "SR"
                  )[0]?.EQ_QTY * dailytime
                )?.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </td>
              {/* EQ REAL CAPA*/}
              <td style={{ color: "blue", fontWeight: "normal" }}>
                {(
                  ((SR_EMPL.TNM1 + SR_EMPL.TNM2) * dailytime) /
                  2
                )?.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </td>
              {/* AVAILABLE CAPA*/}
              <td style={{ color: "blue", fontWeight: "normal" }}>
                {(
                  ((SR_EMPL.NM1 + SR_EMPL.NM2) * dailytime) /
                  2
                )?.toLocaleString("en-US", {
                  maximumFractionDigits: 0,
                })}
              </td>
              {/* REAL CAPA*/}
              <td style={{ color: "green", fontWeight: "normal" }}>
                {ycsxbalance
                  .filter(
                    (ele: YCSX_BALANCE_CAPA_DATA, index: number) =>
                      ele.EQ_NAME === "SR"
                  )[0]
                  ?.YCSX_BALANCE?.toLocaleString("en-US", {
                    maximumFractionDigits: 0,
                  })}
              </td>
              {/*YCSX BALANCE*/}
              <td style={{ color: "red", fontWeight: "normal" }}>
                {(
                  ycsxbalance.filter(
                    (ele: YCSX_BALANCE_CAPA_DATA, index: number) =>
                      ele.EQ_NAME === "SR"
                  )[0]?.YCSX_BALANCE /
                  Math.min(
                    ((SR_EMPL.TNM1 + SR_EMPL.TNM2) / 4) * dailytime,
                    machinecount.filter(
                      (ele: MACHINE_COUNTING, index: number) =>
                        ele.EQ_NAME === "SR"
                    )[0]?.EQ_QTY * dailytime
                  )
                ).toLocaleString("en-US", { maximumFractionDigits: 1 })}
              </td>
              {/* ALV LEADTIME DAYS*/}
              <td style={{ color: "red", fontWeight: "normal" }}>
                {(
                  ycsxbalance.filter(
                    (ele: YCSX_BALANCE_CAPA_DATA, index: number) =>
                      ele.EQ_NAME === "SR"
                  )[0]?.YCSX_BALANCE /
                  Math.min(
                    ((SR_EMPL.NM1 + SR_EMPL.NM2) / 4) * dailytime,
                    machinecount.filter(
                      (ele: MACHINE_COUNTING, index: number) =>
                        ele.EQ_NAME === "SR"
                    )[0]?.EQ_QTY * dailytime
                  )
                ).toLocaleString("en-US", { maximumFractionDigits: 1 })}
              </td>
              {/*LEADTIME DAYS*/}
            </tr>
            <tr>
              <td style={{ color: "blue", fontWeight: "normal" }}>DC</td>
              <td style={{ color: "blue", fontWeight: "normal" }}>
                {
                  machinecount.filter(
                    (ele: MACHINE_COUNTING, index: number) =>
                      ele.EQ_NAME === "DC"
                  )[0]?.EQ_QTY
                }
              </td>
              {/* EQ QTY*/}
              <td style={{ color: "#fc2df6", fontWeight: "normal" }}>1,260</td>
              {/* DAILY TIME*/}
              <td style={{ color: "#fc2df6", fontWeight: "normal" }}>
                {(
                  machinecount.filter(
                    (ele: MACHINE_COUNTING, index: number) =>
                      ele.EQ_NAME === "DC"
                  )[0]?.EQ_QTY * dailytime
                )?.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </td>
              {/* MAX CAPA*/}
              <td style={{ color: "green", fontWeight: "normal" }}>
                {machinecount.filter(
                  (ele: MACHINE_COUNTING, index: number) => ele.EQ_NAME === "DC"
                )[0]?.EQ_QTY *
                  2 *
                  1}
              </td>
              {/* MAX CAPA WF*/}
              <td style={{ color: "green", fontWeight: "normal" }}>
                {DC_EMPL.TNM1 + DC_EMPL.TNM2}
              </td>
              {/* AVAILABLE WORKFORCE*/}
              <td style={{ color: "green", fontWeight: "normal" }}>
                {DC_EMPL.NM1 + DC_EMPL.NM2}
              </td>
              {/* REAL WORKFORCE*/}
              <td style={{ color: "#F73A8A", fontWeight: "normal" }}>
                {Math.min(
                  ((DC_EMPL.TNM1 + DC_EMPL.TNM2) / 4) * dailytime,
                  machinecount.filter(
                    (ele: MACHINE_COUNTING, index: number) =>
                      ele.EQ_NAME === "DC"
                  )[0]?.EQ_QTY * dailytime
                )?.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </td>
              {/* EQ AVAILABLE CAPA*/}
              <td style={{ color: "#F73A8A", fontWeight: "normal" }}>
                {Math.min(
                  ((DC_EMPL.NM1 + DC_EMPL.NM2) / 4) * dailytime,
                  machinecount.filter(
                    (ele: MACHINE_COUNTING, index: number) =>
                      ele.EQ_NAME === "DC"
                  )[0]?.EQ_QTY * dailytime
                )?.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </td>
              {/* EQ REAL CAPA*/}
              <td style={{ color: "blue", fontWeight: "normal" }}>
                {(
                  ((DC_EMPL.TNM1 + DC_EMPL.TNM2) * dailytime) /
                  2
                )?.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </td>
              {/* AVAILABLE CAPA*/}
              <td style={{ color: "blue", fontWeight: "normal" }}>
                {(
                  ((DC_EMPL.NM1 + DC_EMPL.NM2) * dailytime) /
                  2
                )?.toLocaleString("en-US", {
                  maximumFractionDigits: 0,
                })}
              </td>
              {/* REAL CAPA*/}
              <td style={{ color: "green", fontWeight: "normal" }}>
                {ycsxbalance
                  .filter(
                    (ele: YCSX_BALANCE_CAPA_DATA, index: number) =>
                      ele.EQ_NAME === "DC"
                  )[0]
                  ?.YCSX_BALANCE?.toLocaleString("en-US", {
                    maximumFractionDigits: 0,
                  })}
              </td>
              {/*YCSX BALANCE*/}
              <td style={{ color: "red", fontWeight: "normal" }}>
                {(
                  ycsxbalance.filter(
                    (ele: YCSX_BALANCE_CAPA_DATA, index: number) =>
                      ele.EQ_NAME === "DC"
                  )[0]?.YCSX_BALANCE /
                  Math.min(
                    ((DC_EMPL.TNM1 + DC_EMPL.TNM2) / 4) * dailytime,
                    machinecount.filter(
                      (ele: MACHINE_COUNTING, index: number) =>
                        ele.EQ_NAME === "DC"
                    )[0]?.EQ_QTY * dailytime
                  )
                ).toLocaleString("en-US", { maximumFractionDigits: 1 })}
              </td>
              {/*AVL LEADTIME DAYS*/}
              <td style={{ color: "red", fontWeight: "normal" }}>
                {(
                  ycsxbalance.filter(
                    (ele: YCSX_BALANCE_CAPA_DATA, index: number) =>
                      ele.EQ_NAME === "DC"
                  )[0]?.YCSX_BALANCE /
                  Math.min(
                    ((DC_EMPL.NM1 + DC_EMPL.NM2) / 4) * dailytime,
                    machinecount.filter(
                      (ele: MACHINE_COUNTING, index: number) =>
                        ele.EQ_NAME === "DC"
                    )[0]?.EQ_QTY * dailytime
                  )
                ).toLocaleString("en-US", { maximumFractionDigits: 1 })}
              </td>
              {/*REL LEADTIME DAYS*/}
            </tr>
            <tr>
              <td style={{ color: "blue", fontWeight: "normal" }}>ED</td>
              <td style={{ color: "blue", fontWeight: "normal" }}>
                {
                  machinecount.filter(
                    (ele: MACHINE_COUNTING, index: number) =>
                      ele.EQ_NAME === "ED"
                  )[0]?.EQ_QTY
                }
              </td>
              {/* EQ QTY*/}
              <td style={{ color: "#fc2df6", fontWeight: "normal" }}>1,260</td>
              {/* DAILY TIME*/}
              <td style={{ color: "#fc2df6", fontWeight: "normal" }}>
                {(
                  machinecount.filter(
                    (ele: MACHINE_COUNTING, index: number) =>
                      ele.EQ_NAME === "ED"
                  )[0]?.EQ_QTY * dailytime
                )?.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </td>
              {/* MAX CAPA*/}
              <td style={{ color: "green", fontWeight: "normal" }}>
                {machinecount.filter(
                  (ele: MACHINE_COUNTING, index: number) => ele.EQ_NAME === "ED"
                )[0]?.EQ_QTY *
                  2 *
                  1}
              </td>
              {/* MAX CAPA WF*/}
              <td style={{ color: "green", fontWeight: "normal" }}>
                {ED_EMPL.TNM1 + ED_EMPL.TNM2}
              </td>
              {/* AVAILABLE WORKFORCE*/}
              <td style={{ color: "green", fontWeight: "normal" }}>
                {ED_EMPL.NM1 + ED_EMPL.NM2}
              </td>
              {/* REAL WORKFORCE*/}
              <td style={{ color: "#F73A8A", fontWeight: "normal" }}>
                {Math.min(
                  ((ED_EMPL.TNM1 + ED_EMPL.TNM2) / 4) * dailytime,
                  machinecount.filter(
                    (ele: MACHINE_COUNTING, index: number) =>
                      ele.EQ_NAME === "ED"
                  )[0]?.EQ_QTY * dailytime
                )?.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </td>
              {/* EQ AVAILABLE CAPA*/}
              <td style={{ color: "#F73A8A", fontWeight: "normal" }}>
                {Math.min(
                  ((ED_EMPL.NM1 + ED_EMPL.NM2) / 4) * dailytime,
                  machinecount.filter(
                    (ele: MACHINE_COUNTING, index: number) =>
                      ele.EQ_NAME === "ED"
                  )[0]?.EQ_QTY * dailytime
                )?.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </td>
              {/* EQ REAL CAPA*/}
              <td style={{ color: "blue", fontWeight: "normal" }}>
                {(
                  ((ED_EMPL.TNM1 + ED_EMPL.TNM2) * dailytime) /
                  2
                )?.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </td>
              {/* AVAILABLE CAPA*/}
              <td style={{ color: "blue", fontWeight: "normal" }}>
                {(
                  ((ED_EMPL.NM1 + ED_EMPL.NM2) * dailytime) /
                  2
                )?.toLocaleString("en-US", {
                  maximumFractionDigits: 0,
                })}
              </td>
              {/* REAL CAPA*/}
              <td style={{ color: "green", fontWeight: "normal" }}>
                {ycsxbalance
                  .filter(
                    (ele: YCSX_BALANCE_CAPA_DATA, index: number) =>
                      ele.EQ_NAME === "ED"
                  )[0]
                  ?.YCSX_BALANCE?.toLocaleString("en-US", {
                    maximumFractionDigits: 0,
                  })}
              </td>
              {/*YCSX BALANCE*/}
              <td style={{ color: "red", fontWeight: "normal" }}>
                {(
                  ycsxbalance.filter(
                    (ele: YCSX_BALANCE_CAPA_DATA, index: number) =>
                      ele.EQ_NAME === "ED"
                  )[0]?.YCSX_BALANCE /
                  Math.min(
                    ((ED_EMPL.TNM1 + ED_EMPL.TNM2) / 4) * dailytime,
                    machinecount.filter(
                      (ele: MACHINE_COUNTING, index: number) =>
                        ele.EQ_NAME === "ED"
                    )[0]?.EQ_QTY * dailytime
                  )
                )?.toLocaleString("en-US", { maximumFractionDigits: 1 })}
              </td>
              {/*LEADTIME DAYS*/}
              <td style={{ color: "red", fontWeight: "normal" }}>
                {(
                  ycsxbalance.filter(
                    (ele: YCSX_BALANCE_CAPA_DATA, index: number) =>
                      ele.EQ_NAME === "ED"
                  )[0]?.YCSX_BALANCE /
                  Math.min(
                    ((ED_EMPL.NM1 + ED_EMPL.NM2) / 4) * dailytime,
                    machinecount.filter(
                      (ele: MACHINE_COUNTING, index: number) =>
                        ele.EQ_NAME === "ED"
                    )[0]?.EQ_QTY * dailytime
                  )
                )?.toLocaleString("en-US", { maximumFractionDigits: 1 })}
              </td>
              {/*LEADTIME DAYS*/}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default CAPASX;

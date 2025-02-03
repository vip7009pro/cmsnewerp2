import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { generalQuery, getCompany, getGlobalSetting } from "../../../../api/Api";
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
import {
  DATA_DIEM_DANH,
  DELIVERY_PLAN_CAPA,
  EQ_STT,
  MACHINE_COUNTING,
  SX_CAPA_DATA,
  WEB_SETTING_DATA,
  YCSX_BALANCE_CAPA_DATA,
} from "../../../../api/GlobalInterface";
import { CustomResponsiveContainer, f_handle_loadEQ_STATUS } from "../../../../api/GlobalFunction";
import AGTable from "../../../../components/DataTable/AGTable";
const CAPASX2 = () => {
  const dailytime: number = parseInt(getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'DAILY_TIME')[0]?.CURRENT_VALUE ?? '900');
  const dailytime2: number = dailytime;
  const [trigger, setTrigger] = useState(true);
  const [selectedFactory, setSelectedFactory] = useState("NM1");
  const [selectedMachine, setSelectedMachine] = useState("FR");
  const [selectedPlanDate, setSelectedPlanDate] = useState(  moment.utc().format("YYYY-MM-DD"));
  const [eq_status, setEQ_STATUS] = useState<EQ_STT[]>([]);
  const [datadiemdanh, setDataDiemDanh] = useState<DATA_DIEM_DANH[]>([]);
  const [dlleadtime, setDlLeadTime] = useState<DELIVERY_PLAN_CAPA[]>([
    {
      PL_DATE: "",
      FACTORY: "",
      AVL_CAPA: 0,
      EQ: "",
      LEADTIME: 0,
      REAL_CAPA: 0,
    },
  ]);
  const [capadata, setCapaData]= useState<SX_CAPA_DATA[]>([]);
  const getDeliveryLeadTime = async (
    factory: string,
    eq: string,
    plan_date: string
  ) => {
    let eq_data: EQ_STT[] = [];
    await generalQuery("checkEQ_STATUS", {})
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          eq_data = response.data.data;
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
    //console.log(eq_data);
    const FRNM1: number = eq_data.filter(
      (e: EQ_STT, index: number) =>
        e?.EQ_NAME?.substring(0, 2) === "FR" &&
        e.FACTORY === "NM1" &&
        e.EQ_ACTIVE === "OK"
    ).length;
    const SRNM1: number = eq_data.filter(
      (e: EQ_STT, index: number) =>
        e?.EQ_NAME?.substring(0, 2) === "SR" &&
        e.FACTORY === "NM1" &&
        e.EQ_ACTIVE === "OK"
    ).length;
    const DCNM1: number = eq_data.filter(
      (e: EQ_STT, index: number) =>
        e?.EQ_NAME?.substring(0, 2) === "DC" &&
        e.FACTORY === "NM1" &&
        e.EQ_ACTIVE === "OK"
    ).length;
    const EDNM1: number = eq_data.filter(
      (e: EQ_STT, index: number) =>
        e?.EQ_NAME?.substring(0, 2) === "ED" &&
        e.FACTORY === "NM1" &&
        e.EQ_ACTIVE === "OK"
    ).length;
    const FRNM2: number = eq_data.filter(
      (e: EQ_STT, index: number) =>
        e?.EQ_NAME?.substring(0, 2) === "FR" &&
        e.FACTORY === "NM2" &&
        e.EQ_ACTIVE === "OK"
    ).length;
    const SRNM2: number = eq_data.filter(
      (e: EQ_STT, index: number) =>
        e?.EQ_NAME?.substring(0, 2) === "SR" &&
        e.FACTORY === "NM2" &&
        e.EQ_ACTIVE === "OK"
    ).length;
    const DCNM2: number = eq_data.filter(
      (e: EQ_STT, index: number) =>
        e?.EQ_NAME?.substring(0, 2) === "DC" &&
        e.FACTORY === "NM2" &&
        e.EQ_ACTIVE === "OK"
    ).length;
    const EDNM2: number = eq_data.filter(
      (e: EQ_STT, index: number) =>
        e?.EQ_NAME?.substring(0, 2) === "ED" &&
        e.FACTORY === "NM2" &&
        e.EQ_ACTIVE === "OK"
    ).length;
    const eq_sttdata = {
      FR1: FRNM1,
      SR1: SRNM1,
      DC1: DCNM1,
      ED1: EDNM1,
      FR2: FRNM2,
      SR2: SRNM2,
      DC2: DCNM2,
      ED2: EDNM2,
    };
    //console.log(eq_sttdata);
    let FR_EMPL = {
      TNM1: 0,
      TNM2: 0,
      NM1: 0,
      NM2: 0,
    };
    let SR_EMPL = {
      TNM1: 0,
      TNM2: 0,
      NM1: 0,
      NM2: 0,
    };
    let DC_EMPL = {
      TNM1: 0,
      TNM2: 0,
      NM1: 0,
      NM2: 0,
    };
    let ED_EMPL = {
      TNM1: 0,
      TNM2: 0,
      NM1: 0,
      NM2: 0,
    };
    await generalQuery("diemdanhallbp", {
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
          ED_EMPL = {
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
          };
          SR_EMPL = {
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
          };
          DC_EMPL = {
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
          };
          FR_EMPL = {
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
          };
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
    let empl_info = {
      FR: FR_EMPL,
      SR: SR_EMPL,
      DC: DC_EMPL,
      ED: ED_EMPL,
    };
    //console.log(empl_info);
    await generalQuery("capabydeliveryplan", {
      PLAN_DATE: plan_date,
      EQ: eq,
      FACTORY: factory,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: DELIVERY_PLAN_CAPA[] = response.data.data.map(
            (element: DELIVERY_PLAN_CAPA, index: number) => {
              return {
                ...element,
                PL_DATE: moment(element.PL_DATE).utc().format("YYYY-MM-DD"),
                AVL_CAPA: STD_CAPA(
                  element.FACTORY,
                  element.EQ,
                  eq_sttdata,
                  empl_info
                ),
                REAL_CAPA: STD_CAPA_8(
                  element.FACTORY,
                  element.EQ,
                  eq_sttdata,
                  empl_info
                ),
                /* REAL_CAPA:  REL_CAPA(element.FACTORY, element.EQ, eq_sttdata,empl_info), */
              };
            }
          );
          //console.log(loaded_data);
          setDlLeadTime(loaded_data);
        } else {
          setDlLeadTime([]);
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
  const STD_CAPA = (
    FACTORY: string,
    EQ: string,
    EQ_STTDATA: any,
    EMPL_INFO: any
  ) => {
    const FRNM1: number = EQ_STTDATA.FR1;
    const SRNM1: number = EQ_STTDATA.SR1;
    const DCNM1: number = EQ_STTDATA.DC1;
    const EDNM1: number = EQ_STTDATA.ED1;
    const FRNM2: number = EQ_STTDATA.FR2;
    const SRNM2: number = EQ_STTDATA.SR2;
    const DCNM2: number = EQ_STTDATA.DC2;
    const EDNM2: number = EQ_STTDATA.ED2;
    const FR_EMPL = EMPL_INFO.FR;
    const SR_EMPL = EMPL_INFO.SR;
    const DC_EMPL = EMPL_INFO.DC;
    const ED_EMPL = EMPL_INFO.ED;
    if (FACTORY === "NM1") {
      if (EQ === "FR") {
        return Math.min((FR_EMPL.TNM1 / 4) * dailytime, FRNM1 * dailytime);
      } else if (EQ === "SR") {
        return Math.min((SR_EMPL.TNM1 / 4) * dailytime, SRNM1 * dailytime);
      } else if (EQ === "DC") {
        return Math.min((DC_EMPL.TNM1 / 2) * dailytime, DCNM1 * dailytime);
      } else if (EQ === "ED") {
        return Math.min((ED_EMPL.TNM1 / 2) * dailytime, EDNM1 * dailytime);
      }
    } else if (FACTORY === "NM2") {
      if (EQ === "FR") {
        return Math.min((FR_EMPL.TNM2 / 4) * dailytime, FRNM2 * dailytime);
      } else if (EQ === "SR") {
        return Math.min((SR_EMPL.TNM2 / 4) * dailytime, SRNM2 * dailytime);
      } else if (EQ === "DC") {
        return Math.min((DC_EMPL.TNM2 / 2) * dailytime, DCNM2 * dailytime);
      } else if (EQ === "ED") {
        return Math.min((ED_EMPL.TNM2 / 2) * dailytime, EDNM2 * dailytime);
      }
    }
  };
  const STD_CAPA_8 = (
    FACTORY: string,
    EQ: string,
    EQ_STTDATA: any,
    EMPL_INFO: any
  ) => {
    const FRNM1: number = EQ_STTDATA.FR1;
    const SRNM1: number = EQ_STTDATA.SR1;
    const DCNM1: number = EQ_STTDATA.DC1;
    const EDNM1: number = EQ_STTDATA.ED1;
    const FRNM2: number = EQ_STTDATA.FR2;
    const SRNM2: number = EQ_STTDATA.SR2;
    const DCNM2: number = EQ_STTDATA.DC2;
    const EDNM2: number = EQ_STTDATA.ED2;
    const FR_EMPL = EMPL_INFO.FR;
    const SR_EMPL = EMPL_INFO.SR;
    const DC_EMPL = EMPL_INFO.DC;
    const ED_EMPL = EMPL_INFO.ED;
    if (FACTORY === "NM1") {
      if (EQ === "FR") {
        return Math.min((FR_EMPL.TNM1 / 4) * dailytime, FRNM1 * dailytime2);
      } else if (EQ === "SR") {
        return Math.min((SR_EMPL.TNM1 / 4) * dailytime2, SRNM1 * dailytime2);
      } else if (EQ === "DC") {
        return Math.min((DC_EMPL.TNM1 / 2) * dailytime2, DCNM1 * dailytime2);
      } else if (EQ === "ED") {
        return Math.min((ED_EMPL.TNM1 / 2) * dailytime2, EDNM1 * dailytime2);
      }
    } else if (FACTORY === "NM2") {
      if (EQ === "FR") {
        return Math.min((FR_EMPL.TNM2 / 4) * dailytime2, FRNM2 * dailytime2);
      } else if (EQ === "SR") {
        return Math.min((SR_EMPL.TNM2 / 4) * dailytime2, SRNM2 * dailytime2);
      } else if (EQ === "DC") {
        return Math.min((DC_EMPL.TNM2 / 2) * dailytime2, DCNM2 * dailytime2);
      } else if (EQ === "ED") {
        return Math.min((ED_EMPL.TNM2 / 2) * dailytime2, EDNM2 * dailytime2);
      }
    }
  };
  const getCapaData = ()=> {

    Swal.fire({
      title: "Tra cứu Capa",
      text: "Đang tải dữ liệu, hãy chờ chút",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });
    generalQuery("getSXCapaData", {
      MAINDEPTCODE: 5,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: SX_CAPA_DATA[] = response.data.data.map(
            (element: SX_CAPA_DATA, index: number) => {
              return {
                ...element,
                RETAIN_WF_LEADTIME_DAYS: element.YCSX_BALANCE<=0 || element.RETAIN_WF<=0 ?0:element.RETAIN_WF_LEADTIME_DAYS,
                ATT_WF_LEADTIME_DAYS: element.YCSX_BALANCE<=0 || element.ATT_WF<=0 ?0:element.ATT_WF_LEADTIME_DAYS,
                id: index               
              };
            }
          );    
          let totalRow: SX_CAPA_DATA =  {
            EQ_SERIES: 'TOTAL',
            EQ_QTY: 0,
            EQ_OP: 0,
            AVG_EQ_OP: 0,
            MAN_FULL_CAPA: 0,
            RETAIN_WF: 0,
            RETAIN_WF_CAPA: 0,
            ATT_WF: 0,
            ATT_WF_CAPA: 0,
            RETAIN_WF_TO_EQ: 0,
            RETAIN_WF_TO_EQ_CAPA: 0,
            ATT_WF_TO_EQ: 0,
            ATT_WF_TO_EQ_CAPA: 0,
            RETAIN_WF_MIN_CAPA: 0,
            ATT_WF_MIN_CAPA: 0,
            YCSX_BALANCE: 0,
            RETAIN_WF_LEADTIME_DAYS: 0,
            ATT_WF_LEADTIME_DAYS: 0,            
          }
          for (let index = 0; index < loaded_data.length; index++) {
            totalRow.EQ_QTY += loaded_data[index].EQ_QTY;
            totalRow.EQ_OP += loaded_data[index].EQ_OP;
            totalRow.AVG_EQ_OP += loaded_data[index].AVG_EQ_OP;
            totalRow.MAN_FULL_CAPA += loaded_data[index].MAN_FULL_CAPA;
            totalRow.RETAIN_WF += loaded_data[index].RETAIN_WF;
            totalRow.RETAIN_WF_CAPA += loaded_data[index].RETAIN_WF_CAPA;
            totalRow.ATT_WF += loaded_data[index].ATT_WF;
            totalRow.ATT_WF_CAPA += loaded_data[index].ATT_WF_CAPA;
            totalRow.RETAIN_WF_TO_EQ += loaded_data[index].RETAIN_WF_TO_EQ;
            totalRow.RETAIN_WF_TO_EQ_CAPA += loaded_data[index].RETAIN_WF_TO_EQ_CAPA;
            totalRow.ATT_WF_TO_EQ += loaded_data[index].ATT_WF_TO_EQ;
            totalRow.ATT_WF_TO_EQ_CAPA += loaded_data[index].ATT_WF_TO_EQ_CAPA;
            totalRow.RETAIN_WF_MIN_CAPA += loaded_data[index].RETAIN_WF_MIN_CAPA;
            totalRow.ATT_WF_MIN_CAPA += loaded_data[index].ATT_WF_MIN_CAPA;
            totalRow.YCSX_BALANCE += loaded_data[index].YCSX_BALANCE;
            totalRow.RETAIN_WF_LEADTIME_DAYS += loaded_data[index].RETAIN_WF_LEADTIME_DAYS;
            totalRow.ATT_WF_LEADTIME_DAYS += loaded_data[index].ATT_WF_LEADTIME_DAYS;
          }
          loaded_data.push(totalRow);
          setCapaData(loaded_data)
        } else {
          setCapaData([]);          
        }
        Swal.fire('Thông báo','Load data thành công','success');
      })
      .catch((error) => {
        console.log(error);
      });

  }
  const workforcechartMM = useMemo(() => {
    return (
      <Chart
        id='workforcechart'
        title='WORKFORCE STATUS'
        dataSource={capadata}
        width={`100%`}
      >
        <ArgumentAxis title='MACHINE NAME' />
        <ValueAxis title='Workforce (人)' />
        <CommonSeriesSettings
          argumentField='EQ_SERIES'
          type='bar'
          hoverMode='allArgumentPoints'
          selectionMode='allArgumentPoints'
        >
          <Label visible={true}>
            <Format type='fixedPoint' precision={0} />
          </Label>
        </CommonSeriesSettings>
        <Series
          argumentField='EQ_SERIES'
          valueField='EQ_OP'
          name='WF_FOR_FULL_CAPA'
          color='#DE14FE'
        />
        <Series
          argumentField='EQ_SERIES'
          valueField='RETAIN_WF'
          name='RETAIN_WF'
          color='blue'
        />
        <Series
          argumentField='EQ_SERIES'
          valueField='ATT_WF'
          name='REALTIME_WF'
          color='#01D201'
        />
        <Legend
          verticalAlignment='bottom'
          horizontalAlignment='center'
        ></Legend>
      </Chart>
    );
  }, [capadata]);
  const DeliveryLeadTimeMMFR = useMemo(() => {
    return (
      <Chart
        id='workforcechart'
        title='PRODUCTION CAPA BY DELIVERY PLAN [FR]'
        dataSource={dlleadtime.filter(
          (e: DELIVERY_PLAN_CAPA, index: number) => e.EQ === "FR"
        )}
        width={`100%`}
        resolveLabelOverlapping='hide'
      >
        {/* <Title
          text='PRODUCTION CAPA BY DELIVERY PLAN'
          subtitle={`[DATE:${selectedPlanDate}] [FACTORY:${selectedFactory}] [MACHINE:${selectedMachine}]`}
        /> */}
        <ArgumentAxis title='PL_DATE' />
        <ValueAxis title='LEADTIME' />
        <CommonSeriesSettings
          argumentField='PL_DATE'
          type='bar'
          hoverMode='allArgumentPoints'
          selectionMode='allArgumentPoints'
        >
          <Label visible={true}>
            <Format type='fixedPoint' precision={0} />
          </Label>
        </CommonSeriesSettings>
        <Series
          argumentField='PL_DATE'
          valueField='LEADTIME'
          name='Leadtime'
          color='#28DF67'
        />
        <Series
          argumentField='PL_DATE'
          valueField='AVL_CAPA'
          name='12H'
          color='#E80020'
          type='line'
        />
        <Series
          argumentField='PL_DATE'
          valueField='REAL_CAPA'
          name='8H'
          color='#089ED6 '
          type='line'
        />
        <Legend
          verticalAlignment='bottom'
          horizontalAlignment='center'
        ></Legend>
      </Chart>
    );
  }, [dlleadtime]);
  const DeliveryLeadTimeMMSR = useMemo(() => {
    return (
      <Chart
        id='workforcechart'
        title='PRODUCTION CAPA BY DELIVERY PLAN [SR]'
        dataSource={dlleadtime.filter(
          (e: DELIVERY_PLAN_CAPA, index: number) => e.EQ === "SR"
        )}
        width={`100%`}
        resolveLabelOverlapping='hide'
      >
        {/* <Title
          text='PRODUCTION CAPA BY DELIVERY PLAN'
          subtitle={`[DATE:${selectedPlanDate}] [FACTORY:${selectedFactory}] [MACHINE:${selectedMachine}]`}
        /> */}
        <ArgumentAxis title='PL_DATE' />
        <ValueAxis title='LEADTIME' />
        <CommonSeriesSettings
          argumentField='PL_DATE'
          type='bar'
          hoverMode='allArgumentPoints'
          selectionMode='allArgumentPoints'
        >
          <Label visible={true}>
            <Format type='fixedPoint' precision={0} />
          </Label>
        </CommonSeriesSettings>
        <Series
          argumentField='PL_DATE'
          valueField='LEADTIME'
          name='Leadtime'
          color='#28DF67'
        />
        <Series
          argumentField='PL_DATE'
          valueField='AVL_CAPA'
          name='12H'
          color='#E80020'
          type='line'
        />
        <Series
          argumentField='PL_DATE'
          valueField='REAL_CAPA'
          name='8H'
          color='#089ED6 '
          type='line'
        />
        <Legend
          verticalAlignment='bottom'
          horizontalAlignment='center'
        ></Legend>
      </Chart>
    );
  }, [dlleadtime]);
  const DeliveryLeadTimeMMDC = useMemo(() => {
    return (
      <Chart
        id='workforcechart'
        title='PRODUCTION CAPA BY DELIVERY PLAN [DC]'
        dataSource={dlleadtime.filter(
          (e: DELIVERY_PLAN_CAPA, index: number) => e.EQ === "DC"
        )}
        width={`100%`}
        resolveLabelOverlapping='hide'
      >
        {/* <Title
          text='PRODUCTION CAPA BY DELIVERY PLAN'
          subtitle={`[DATE:${selectedPlanDate}] [FACTORY:${selectedFactory}] [MACHINE:${selectedMachine}]`}
        /> */}
        <ArgumentAxis title='PL_DATE' />
        <ValueAxis title='LEADTIME' />
        <CommonSeriesSettings
          argumentField='PL_DATE'
          type='bar'
          hoverMode='allArgumentPoints'
          selectionMode='allArgumentPoints'
        >
          <Label visible={true}>
            <Format type='fixedPoint' precision={0} />
          </Label>
        </CommonSeriesSettings>
        <Series
          argumentField='PL_DATE'
          valueField='LEADTIME'
          name='Leadtime'
          color='#28DF67'
        />
        <Series
          argumentField='PL_DATE'
          valueField='AVL_CAPA'
          name='12H'
          color='#E80020'
          type='line'
        />
        <Series
          argumentField='PL_DATE'
          valueField='REAL_CAPA'
          name='8H'
          color='#089ED6 '
          type='line'
        />
        <Legend
          verticalAlignment='bottom'
          horizontalAlignment='center'
        ></Legend>
      </Chart>
    );
  }, [dlleadtime]);
  const DeliveryLeadTimeMMED = useMemo(() => {
    return (
      <Chart
        id='workforcechart'
        title='PRODUCTION CAPA BY DELIVERY PLAN [ED]'
        dataSource={dlleadtime.filter(
          (e: DELIVERY_PLAN_CAPA, index: number) => e.EQ === "ED"
        )}
        width={`100%`}
        resolveLabelOverlapping='hide'
      >
        {/* <Title
          text='PRODUCTION CAPA BY DELIVERY PLAN'
          subtitle={`[DATE:${selectedPlanDate}] [FACTORY:${selectedFactory}] [MACHINE:${selectedMachine}]`}
        /> */}
        <ArgumentAxis title='PL_DATE' />
        <ValueAxis title='LEADTIME' />
        <CommonSeriesSettings
          argumentField='PL_DATE'
          type='bar'
          hoverMode='allArgumentPoints'
          selectionMode='allArgumentPoints'
        >
          <Label visible={true}>
            <Format type='fixedPoint' precision={0} />
          </Label>
        </CommonSeriesSettings>
        <Series
          argumentField='PL_DATE'
          valueField='LEADTIME'
          name='Leadtime'
          color='#28DF67'
        />
        <Series
          argumentField='PL_DATE'
          valueField='AVL_CAPA'
          name='12H'
          color='#E80020'
          type='line'
        />
        <Series
          argumentField='PL_DATE'
          valueField='REAL_CAPA'
          name='8H'
          color='#089ED6 '
          type='line'
        />
        <Legend
          verticalAlignment='bottom'
          horizontalAlignment='center'
        ></Legend>
      </Chart>
    );
  }, [dlleadtime]);
  const leadtimechartMM = useMemo(() => {
    return (
      <Chart
        id='chartcapa'
        rotated={true}
        dataSource={capadata.filter((e: SX_CAPA_DATA, index: number) => e.EQ_SERIES !== "TOTAL")}
        width={`100%`}
      >
        <ArgumentAxis title='MACHINE NAME' />
        <ValueAxis title='LeadTime (days)' />
        <Title
          text='PRODUCTION LEADTIME BY EQUIPMENT'
          subtitle='PO BALANCE STANDARD (STOCK EXCLUDED)'
        />
        <Series
          valueField='ATT_WF_LEADTIME_DAYS'
          argumentField='EQ_SERIES'
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
          valueField='RETAIN_WF_LEADTIME_DAYS'
          argumentField='EQ_SERIES'
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
  }, [capadata]);
  const capacolumns = [   
    { field: "EQ_SERIES", headerName: "EQ_SERIES", width: 60 },
    { field: "EQ_QTY", headerName: "EQ_QTY", width: 50 },
    { field: "EQ_OP", headerName: "EQ_OP", width: 50 },
    { field: "AVG_EQ_OP", headerName: "AVG_EQ_OP", width: 60 },
    { field: "MAN_FULL_CAPA", headerName: "MAN_FULL_CAPA", width: 90, cellRenderer: (params: any) => { 
      return (
        <span style={{ color: "blue" }}>{params.data.MAN_FULL_CAPA?.toLocaleString("en-US")}</span>
      )
     }
    },
    { field: "RETAIN_WF_CAPA", headerName: "RETAIN_WF_CAPA", width: 90, cellRenderer: (params: any) => { 
      return (
        <span style={{ color: "green" }}>{params.data.RETAIN_WF_CAPA?.toLocaleString("en-US")}</span>
      )
     } },
    { field: "ATT_WF_CAPA", headerName: "ATT_WF_CAPA", width: 90, cellRenderer: (params: any) => { 
      return (
        <span style={{ color: "red" }}>{params.data.ATT_WF_CAPA?.toLocaleString("en-US")}</span>
      )
     } },
    { field: "RETAIN_WF_TO_EQ_CAPA", headerName: "RETAIN_WF_TO_EQ_CAPA", width: 120 , cellRenderer: (params: any) => { 
      return (
        <span style={{ color: "gray" }}>{params.data.RETAIN_WF_TO_EQ_CAPA?.toLocaleString("en-US")}</span>
      )
     }},
    { field: "ATT_WF_TO_EQ_CAPA", headerName: "ATT_WF_TO_EQ_CAPA", width: 110, cellRenderer: (params: any) => { 
      return (
        <span style={{ color: "gray" }}>{params.data.ATT_WF_TO_EQ_CAPA?.toLocaleString("en-US")}</span>
      )
     } },
    { field: "RETAIN_WF_MIN_CAPA", headerName: "RETAIN_WF_MIN_CAPA", width: 110, cellRenderer: (params: any) => { 
      return (
        <span style={{ color: "gray" }}>{params.data.RETAIN_WF_MIN_CAPA?.toLocaleString("en-US")}</span>
      )
     } },
    { field: "ATT_WF_MIN_CAPA", headerName: "ATT_WF_MIN_CAPA", width: 110, cellRenderer: (params: any) => { 
      return (
        <span style={{ color: "gray" }}>{params.data.ATT_WF_MIN_CAPA?.toLocaleString("en-US")}</span>
      )
     } },
    { field: "YCSX_BALANCE", headerName: "YCSX_BALANCE", width: 80, cellRenderer: (params: any) => { 
      return (
        <span style={{ color: "blue" }}>{params.data.YCSX_BALANCE?.toLocaleString("en-US")}</span>
      )
     } },
    { field: "RETAIN_WF_LEADTIME_DAYS", headerName: "RETAIN_WF_LEADTIME_DAYS", width: 150 , cellRenderer: (params: any) => { 
      return (
        <span style={{ color: "green", fontWeight:'bold' }}>{params.data.RETAIN_WF_LEADTIME_DAYS?.toLocaleString("en-US")}</span>
      )
     }},
    { field: "ATT_WF_LEADTIME_DAYS", headerName: "ATT_WF_LEADTIME_DAYS", width: 130, cellRenderer: (params: any) => { 
      return (
        <span style={{ color: "red", fontWeight:'bold' }}>{params.data.ATT_WF_LEADTIME_DAYS?.toLocaleString("en-US")}</span>
      )
     } }
  ]
  const capaDataAGTable = useMemo(() =>
    <AGTable
      showFilter={true}
      toolbar={
        <div>          
        </div>
      }
      columns={capacolumns}
      data={capadata}
      onCellEditingStopped={(params: any) => {
        //console.log(e.data)
      }} onRowClick={(params: any) => {
        //clickedRow.current = params.data;        
      }} onSelectionChange={(params: any) => {
        //setSelectedRows(params!.api.getSelectedRows()[0]);        
      }}
    />
    , [capadata, capacolumns, trigger]);
  useEffect(() => {   
    getCapaData();   
    //getDeliveryLeadTime(selectedFactory, selectedMachine, selectedPlanDate);
    /* let intervalID = window.setInterval(() => {
      handle_loadEQ_STATUS();
      getDeliveryLeadTime(selectedFactory,selectedMachine,selectedPlanDate); 
      getDiemDanhAllBP();
      getMachineCounting();
      getYCSXBALANCE();
    }, 30000); */
    return () => {
      //window.clearInterval(intervalID);
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
              value={capadata.filter((e: SX_CAPA_DATA, index: number) => e.EQ_SERIES === "TOTAL")[0]?.EQ_OP.toString()}
              title='WORKFORCE FOR FULL CAPA'
              color='#DE14FE'
            />
            <CIRCLE_COMPONENT
              type='workforce'
              value={capadata.filter((e: SX_CAPA_DATA, index: number) => e.EQ_SERIES === "TOTAL")[0]?.RETAIN_WF.toString()}
              title='RETAIN WORKFORCE'
              color='blue'
            />
            <CIRCLE_COMPONENT
              type='workforce'
              value={capadata.filter((e: SX_CAPA_DATA, index: number) => e.EQ_SERIES === "TOTAL")[0]?.ATT_WF.toString()}
              title='REAL TIME WORKFORCE'
              color='#01D201'
            />
          </div>
        </div>
        <div className='sectiondiv'>
          <div className='title'>2. EQUIPMENT STATUS (Running/Total)</div>
          <div className='totalwfdiv'>
            {
              capadata.filter((e: SX_CAPA_DATA, index: number) => e.EQ_SERIES !== "TOTAL").map((e: SX_CAPA_DATA, index: number) => {
                return (
                  <CIRCLE_COMPONENT
                    key={index} 
                    type='machine'
                    value={e.EQ_QTY?.toString()}
                    title={e.EQ_SERIES} 
                    color={'blue'}
                  />
                );
              })
            }            
            
          </div>
        </div>
      </div>
      <div className='workforcechart'>
        <div className='sectiondiv'>
          <div className='title'>3. WORKFORCE STATUS BY EQUIPMENT</div>
          <div className='starndardworkforce'>{workforcechartMM}</div>
        </div>
        <div className='sectiondiv'>
          <div className='title'>4. PRODUCTION LEADTIME</div>
          <div className='capachart'>{leadtimechartMM}</div>
        </div>        
      </div>
      <div className="capadatatable">
        {capaDataAGTable}
      </div>
      {getCompany() === "CMS" && <div className='dailydeliverycapa'>
        <div className='sectiondiv'>
          <div className='title'>3. PRODUCTION BY DELIVERY PLAN</div>
          <div className='selectcontrol'>
            Plan Date:
            <input
              type='date'
              value={selectedPlanDate}
              onChange={(e) => {
                setSelectedPlanDate(e.target.value);
                getDeliveryLeadTime(
                  selectedFactory,
                  selectedMachine,
                  e.target.value
                );
              }}
            ></input>
            Factory:
            <select
              name='factory'
              value={selectedFactory}
              onChange={(e) => {
                setSelectedFactory(e.target.value);
                getDeliveryLeadTime(
                  e.target.value,
                  selectedMachine,
                  selectedPlanDate
                );
              }}
            >
              <option value='NM1'>NM1</option>
              <option value='NM2'>NM2</option>
            </select>           
          </div>     
               
          <div className='starndardworkforce'>{DeliveryLeadTimeMMFR}</div>
          <div className='starndardworkforce'>{DeliveryLeadTimeMMED}</div>
          {selectedFactory === "NM1" && (
            <div className='starndardworkforce'>{DeliveryLeadTimeMMSR}</div>
          )}
          {selectedFactory === "NM1" && (
            <div className='starndardworkforce'>{DeliveryLeadTimeMMDC}</div>
          )}
        </div>
      </div>}
    </div>
  );
};
export default CAPASX2;

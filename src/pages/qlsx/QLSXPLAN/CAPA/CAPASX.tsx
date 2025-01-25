import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { generalQuery, getGlobalSetting } from "../../../../api/Api";
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
  PROD_PLAN_CAPA_DATA,
  WEB_SETTING_DATA,
  YCSX_BALANCE_CAPA_DATA,
} from "../../../../api/GlobalInterface";
import { CustomResponsiveContainer, f_getProductionPlanLeadTimeCapaData, f_handle_loadEQ_STATUS } from "../../../../api/GlobalFunction";
import ProductionPlanCapaChart from "../../../../components/Chart/KHSX/ProductionPlanCapa";
const CAPASX = () => {
  const dailytime: number = parseInt(getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'DAILY_TIME')[0]?.CURRENT_VALUE ?? '900');
  const dailytime2: number = dailytime+300;
  const [trigger, setTrigger] = useState(true);
  const [productionplancapadata, setProductionPlanCapaData] = useState<PROD_PLAN_CAPA_DATA[]>([]);
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
  const getProductionPlanLeadTimeCapaData = async (PLAN_DATE: string) => {
    setProductionPlanCapaData(await f_getProductionPlanLeadTimeCapaData(PLAN_DATE));    
  }
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
  //console.log(ED_EMPL.TNM1 , ED_EMPL.TNM2)
  const dataSource_capa: any = [
    {
      EQ_NAME: "ED",
      EQ_LEADTIME: //NM2 lam 1 ca
        ycsxbalance.filter(
          (ele: YCSX_BALANCE_CAPA_DATA, index: number) => ele.EQ_NAME === "ED"
        )[0]?.YCSX_BALANCE /
        Math.min(
          ((ED_EMPL.NM1 + ED_EMPL.NM2 / 2) / 2) * dailytime,
          machinecount.filter(
            (ele: MACHINE_COUNTING, index: number) => ele.EQ_NAME === "ED"
          )[0]?.EQ_QTY * dailytime
        ),
      EQ_AVL_LEADTIME:
        ycsxbalance.filter(
          (ele: YCSX_BALANCE_CAPA_DATA, index: number) => ele.EQ_NAME === "ED"
        )[0]?.YCSX_BALANCE /
        Math.min(
          ((ED_EMPL.TNM1 + ED_EMPL.TNM2 / 2) / 2) * dailytime,
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
          ((DC_EMPL.NM1 + DC_EMPL.NM2) / 2) * dailytime,
          machinecount.filter(
            (ele: MACHINE_COUNTING, index: number) => ele.EQ_NAME === "DC"
          )[0]?.EQ_QTY * dailytime
        ),
      EQ_AVL_LEADTIME:
        ycsxbalance.filter(
          (ele: YCSX_BALANCE_CAPA_DATA, index: number) => ele.EQ_NAME === "DC"
        )[0]?.YCSX_BALANCE /
        Math.min(
          ((DC_EMPL.TNM1 + DC_EMPL.TNM2) / 2) * dailytime,
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
  const handle_loadEQ_STATUS = async () => {
    let eq_data = await f_handle_loadEQ_STATUS();
    setEQ_STATUS(eq_data.EQ_STATUS);    
  };
  const getrunningFR = () => {
    return eq_status.filter(
      (element: EQ_STT, index: number) =>
        element?.EQ_NAME?.substring(0, 2) === "FR" &&
        (element.EQ_STATUS === "MASS" || element.EQ_STATUS === "SETTING")
    ).length;
  };
  const getrunningSR = () => {
    return eq_status.filter(
      (element: EQ_STT, index: number) =>
        element?.EQ_NAME?.substring(0, 2) === "SR" &&
        (element.EQ_STATUS === "MASS" || element.EQ_STATUS === "SETTING")
    ).length;
  };
  const getrunningDC = () => {
    return eq_status.filter(
      (element: EQ_STT, index: number) =>
        element?.EQ_NAME?.substring(0, 2) === "DC" &&
        (element.EQ_STATUS === "MASS" || element.EQ_STATUS === "SETTING")
    ).length;
  };
  const getrunningED = () => {
    return eq_status.filter(
      (element: EQ_STT, index: number) =>
        element?.EQ_NAME?.substring(0, 2) === "ED" &&
        element.EQ_STATUS === "MASS"
    ).length;
  };
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
  const REL_CAPA = (
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
        return Math.min((FR_EMPL.NM1 / 4) * dailytime, FRNM1 * dailytime);
      } else if (EQ === "SR") {
        return Math.min((SR_EMPL.NM1 / 4) * dailytime, SRNM1 * dailytime);
      } else if (EQ === "DC") {
        return Math.min((DC_EMPL.NM1 / 2) * dailytime, DCNM1 * dailytime);
      } else if (EQ === "ED") {
        return Math.min((ED_EMPL.NM1 / 2) * dailytime, EDNM1 * dailytime);
      }
    } else if (FACTORY === "NM2") {
      if (EQ === "FR") {
        return Math.min((FR_EMPL.NM2 / 4) * dailytime, FRNM2 * dailytime);
      } else if (EQ === "SR") {
        return Math.min((SR_EMPL.NM2 / 4) * dailytime, SRNM2 * dailytime);
      } else if (EQ === "DC") {
        return Math.min((DC_EMPL.NM2 / 2) * dailytime, DCNM2 * dailytime);
      } else if (EQ === "ED") {
        return Math.min((ED_EMPL.NM2 / 2) * dailytime, EDNM2 * dailytime);
      }
    }
  };
  const workforcechartMM = useMemo(() => {
    return (
      <Chart
        id='workforcechart'
        title='WORKFORCE STATUS'
        dataSource={dataSource_eq}
        width={`100%`}
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
        dataSource={dataSource_capa}
        width={`100%`}
      >
        <ArgumentAxis title='MACHINE NAME' />
        <ValueAxis title='LeadTime (days)' />
        <Title
          text='PRODUCTION LEADTIME BY EQUIPMENT'
          subtitle='PO BALANCE STANDARD (STOCK EXCLUDED)'
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

  const chartFRCapa = useMemo(() => {
    return (
      <ProductionPlanCapaChart dldata={productionplancapadata.filter((e: PROD_PLAN_CAPA_DATA, index: number) => e.EQ_SERIES === "FR")} materialColor="#3DC23D" processColor="#3DC23D"/>     
    );
  }, [productionplancapadata]);
  const chartSRCapa = useMemo(() => {
    return (
      <ProductionPlanCapaChart dldata={productionplancapadata.filter((e: PROD_PLAN_CAPA_DATA, index: number) => e.EQ_SERIES === "SR")} materialColor="#3DC23D" processColor="#3DC23D"/>     
    );
  }, [productionplancapadata]);
  const chartDCCapa = useMemo(() => {
    return (
      <ProductionPlanCapaChart dldata={productionplancapadata.filter((e: PROD_PLAN_CAPA_DATA, index: number) => e.EQ_SERIES === "DC")} materialColor="#3DC23D" processColor="#3DC23D"/>     
    );
  }, [productionplancapadata]);
  const chartEDCapa = useMemo(() => {
    return (
      <ProductionPlanCapaChart dldata={productionplancapadata.filter((e: PROD_PLAN_CAPA_DATA, index: number) => e.EQ_SERIES === "ED")} materialColor="#3DC23D" processColor="#3DC23D"/>     
    );
  }, [productionplancapadata]);

  useEffect(() => {
    console.log("rerender");
    getDiemDanhAllBP();
    getMachineCounting();
    getYCSXBALANCE();
    handle_loadEQ_STATUS();
    getDeliveryLeadTime(selectedFactory, selectedMachine, selectedPlanDate);
    getProductionPlanLeadTimeCapaData(selectedPlanDate);
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
        <div className='sectiondiv'>
          <div className='title'>3. WORKFORCE STATUS BY EQUIPMENT</div>
          <div className='starndardworkforce'>{workforcechartMM}</div>
        </div>
        <div className='sectiondiv'>
          <div className='title'>4. PRODUCTION LEADTIME</div>
          <div className='capachart'>{leadtimechartMM}</div>
        </div>
      </div>
      <div className='dailydeliverycapa'>
        <div className='sectiondiv'>
          <div className='title' style={{ fontSize: "1.2rem" }}>3. PRODUCTION BY DELIVERY PLAN</div>
          <div className='selectcontrol'>
            Plan Date:
            <input
              type='date'
              value={selectedPlanDate}
              onChange={(e) => {
                setSelectedPlanDate(e.target.value);
                getProductionPlanLeadTimeCapaData(e.target.value);
                /* getDeliveryLeadTime(
                  selectedFactory,
                  selectedMachine,
                  e.target.value
                ); */
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
            {/*  Machine:
        <select
          name='machine'
          value={selectedMachine}
          onChange={(e) => {
            setSelectedMachine(e.target.value);
            getDeliveryLeadTime(selectedFactory, e.target.value,selectedPlanDate);
          }}
        >
          <option value='FR'>FR</option>
          <option value='SR'>SR</option>
          <option value='DC'>DC</option>
          <option value='ED'>ED</option>
        </select> */}
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
                  <td style={{ color: "#fc2df6", fontWeight: "normal" }}>{dailytime}</td>
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
                  <td style={{ color: "#fc2df6", fontWeight: "normal" }}>{dailytime}</td>
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
                  <td style={{ color: "#fc2df6", fontWeight: "normal" }}>{dailytime}</td>
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
                      ((DC_EMPL.TNM1 + DC_EMPL.TNM2) / 2) * dailytime,
                      machinecount.filter(
                        (ele: MACHINE_COUNTING, index: number) =>
                          ele.EQ_NAME === "DC"
                      )[0]?.EQ_QTY * dailytime
                    )?.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                  </td>
                  {/* EQ AVAILABLE CAPA*/}
                  <td style={{ color: "#F73A8A", fontWeight: "normal" }}>
                    {Math.min(
                      ((DC_EMPL.NM1 + DC_EMPL.NM2) / 2) * dailytime,
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
                        ((DC_EMPL.TNM1 + DC_EMPL.TNM2) / 2) * dailytime,
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
                        ((DC_EMPL.NM1 + DC_EMPL.NM2) / 2) * dailytime,
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
                  <td style={{ color: "#fc2df6", fontWeight: "normal" }}>{dailytime}</td>
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
                      ((ED_EMPL.TNM1 + ED_EMPL.TNM2) / 2) * dailytime,
                      machinecount.filter(
                        (ele: MACHINE_COUNTING, index: number) =>
                          ele.EQ_NAME === "ED"
                      )[0]?.EQ_QTY * dailytime
                    )?.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                  </td>
                  {/* EQ AVAILABLE CAPA*/}
                  <td style={{ color: "#F73A8A", fontWeight: "normal" }}>
                    {Math.min(
                      ((ED_EMPL.NM1 + ED_EMPL.NM2) / 2) * dailytime,
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
                        ((ED_EMPL.TNM1 + ED_EMPL.TNM2) / 2) * dailytime,
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
                        ((ED_EMPL.NM1 + ED_EMPL.NM2) / 2) * dailytime,
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
          <div className='header' style={{fontSize: '1.2rem', fontWeight: 'bold', alignSelf: 'center'}}>FR PLAN CAPA</div>
          <div className='starndardworkforce' style={{height: '500px'}}>{chartFRCapa}</div>
          <div className='header' style={{fontSize: '1.2rem', fontWeight: 'bold', alignSelf: 'center'}}>SR PLAN CAPA</div>
          <div className='starndardworkforce' style={{height: '500px'}}>{chartSRCapa}</div>
          <div className='header' style={{fontSize: '1.2rem', fontWeight: 'bold', alignSelf: 'center'}}>DC PLAN CAPA</div>
          <div className='starndardworkforce' style={{height: '500px'}}>{chartDCCapa}</div>
          <div className='header' style={{fontSize: '1.2rem', fontWeight: 'bold', alignSelf: 'center'}}>ED PLAN CAPA</div>
          <div className='starndardworkforce' style={{height: '500px'}}>{chartEDCapa}</div>

         {/*  <div className='starndardworkforce'>{DeliveryLeadTimeMMFR}</div>
          <div className='starndardworkforce'>{DeliveryLeadTimeMMED}</div>
          {selectedFactory === "NM1" && (
            <div className='starndardworkforce'>{DeliveryLeadTimeMMSR}</div>
          )}
          {selectedFactory === "NM1" && (
            <div className='starndardworkforce'>{DeliveryLeadTimeMMDC}</div>
          )} */}
        </div>
      </div>
    </div>
  );
};
export default CAPASX;

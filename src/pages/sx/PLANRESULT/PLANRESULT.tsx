import React, { useEffect, useMemo, useState, useTransition } from "react";
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
  AdaptiveLayout,
} from "devextreme-react/chart";
import PieChart, { Export, Font } from "devextreme-react/pie-chart";
import "./PLANRESULT.scss";
import { generalQuery } from "../../../api/Api";
import CIRCLE_COMPONENT from "../../qlsx/QLSXPLAN/CAPA/CIRCLE_COMPONENT/CIRCLE_COMPONENT";
import { ProgressBar } from "devextreme-react/progress-bar";
import { CircularProgress, IconButton, LinearProgress } from "@mui/material";
import { BiSearch } from "react-icons/bi";
import useWindowDimensions from "../../../api/useWindowDimensions";
import { RootState } from "../../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { ResponsiveContainer } from "recharts";
interface MACHINE_COUNTING {
  FACTORY: string;
  EQ_NAME: string;
  EQ_QTY: number;
}
interface DAILY_SX_DATA {
  MACHINE_NAME: string;
  SX_DATE: string;
  SX_RESULT: number;
  PLAN_QTY: number;
  RATE: number;
}
interface ACHIVEMENT_DATA {
  MACHINE_NAME: string;
  PLAN_QTY: number;
  WH_OUTPUT: number;
  SX_RESULT_TOTAL: number;
  RESULT_STEP_FINAL: number;
  RESULT_TO_NEXT_PROCESS: number;
  RESULT_TO_INSPECTION: number;
  INS_INPUT: number;
  INSPECT_TOTAL_QTY: number;
  INSPECT_OK_QTY: number;
  INSPECT_NG_QTY: number;
  INS_OUTPUT: number;
  TOTAL_LOSS: number;
  ACHIVEMENT_RATE: number;
}
interface WEEKLY_SX_DATA {
  SX_WEEK: number;
  SX_RESULT: number;
  PLAN_QTY: number;
  RATE: number;
}
interface MONTHLY_SX_DATA {
  SX_MONTH: number;
  SX_RESULT: number;
  PLAN_QTY: number;
  RATE: number;
}
interface TOTAL_TIME {
  T_FR: number;
  T_SR: number;
  T_DC: number;
  T_ED: number;
  T_TOTAL: number;
}
interface OPERATION_TIME_DATA {
  PLAN_FACTORY: string;
  MACHINE: string;
  TOTAL_TIME: number;
  RUN_TIME_SX: number;
  SETTING_TIME: number;
  LOSS_TIME: number;
  HIEU_SUAT_TIME: number;
  SETTING_TIME_RATE: number;
  LOSS_TIME_RATE: number;
}
const PLANRESULT = () => {
  const { height, width } = useWindowDimensions();
  function getBusinessDatesCount(st: any, ed: any) {
    const startDate = new Date(moment(st).format("YYYY-MM-DD"));
    const endDate = new Date(moment(ed).format("YYYY-MM-DD"));
    let count = 0;
    const curDate = new Date(startDate.getTime());
    while (curDate <= endDate) {
      const dayOfWeek = curDate.getDay();
      if (dayOfWeek !== 0) count++;
      curDate.setDate(curDate.getDate() + 1);
    }
    return count;
  }
  const dailytime1: number = 1260;
  const dailytime2: number = 1260;
  const [T_TIME_NM1, setT_TIME_NM1] = useState<TOTAL_TIME>({
    T_FR: 1,
    T_SR: 1,
    T_DC: 1,
    T_ED: 1,
    T_TOTAL: 1,
  });
  const [T_TIME_NM2, setT_TIME_NM2] = useState<TOTAL_TIME>({
    T_FR: 1,
    T_SR: 1,
    T_DC: 1,
    T_ED: 1,
    T_TOTAL: 1,
  });
  const [machinecount, setMachineCount] = useState<MACHINE_COUNTING[]>([]);
  const [fromdate, setFromDate] = useState(
    moment().add(-30, "day").format("YYYY-MM-DD")
  );
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [operation_time, setOperationTime] = useState<OPERATION_TIME_DATA[]>(
    []
  );
  const [machine, setMachine] = useState("ALL");
  const [factory, setFactory] = useState("ALL");
  const [daily_sx_data, setDailySXData] = useState<DAILY_SX_DATA[]>([]);
  const [weekly_sx_data, setWeeklySXData] = useState<WEEKLY_SX_DATA[]>([]);
  const [monthly_sx_data, setMonthlySXData] = useState<MONTHLY_SX_DATA[]>([]);
  const [sxachivementdata, setSXAchivementData] = useState<ACHIVEMENT_DATA[]>(
    []
  );
  const sidebarstatus: boolean | undefined = useSelector(
    (state: RootState) => state.totalSlice.sidebarmenu
  );
  const [dayrange, setDayRange] = useState(
    getBusinessDatesCount(fromdate, todate)
  );
  const getMachineCounting = () => {
    generalQuery("machinecounting2", {})
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
          let temp_TIME_NM1: TOTAL_TIME = {
            T_FR:
              (loaded_data.filter(
                (ele: MACHINE_COUNTING, index: number) =>
                  ele?.FACTORY === "NM1" && ele?.EQ_NAME === "FR"
              )[0]?.EQ_QTY === undefined
                ? 0
                : loaded_data.filter(
                    (ele: MACHINE_COUNTING, index: number) =>
                      ele?.FACTORY === "NM1" && ele?.EQ_NAME === "FR"
                  )[0]?.EQ_QTY) * dailytime1,
            T_SR:
              (loaded_data.filter(
                (ele: MACHINE_COUNTING, index: number) =>
                  ele?.FACTORY === "NM1" && ele?.EQ_NAME === "SR"
              )[0]?.EQ_QTY === undefined
                ? 0
                : loaded_data.filter(
                    (ele: MACHINE_COUNTING, index: number) =>
                      ele?.FACTORY === "NM1" && ele?.EQ_NAME === "SR"
                  )[0]?.EQ_QTY) * dailytime1,
            T_DC:
              (loaded_data.filter(
                (ele: MACHINE_COUNTING, index: number) =>
                  ele?.FACTORY === "NM1" && ele?.EQ_NAME === "DC"
              )[0]?.EQ_QTY === undefined
                ? 0
                : loaded_data.filter(
                    (ele: MACHINE_COUNTING, index: number) =>
                      ele?.FACTORY === "NM1" && ele?.EQ_NAME === "DC"
                  )[0]?.EQ_QTY) * dailytime1,
            T_ED:
              (loaded_data.filter(
                (ele: MACHINE_COUNTING, index: number) =>
                  ele?.FACTORY === "NM1" && ele?.EQ_NAME === "ED"
              )[0]?.EQ_QTY === undefined
                ? 0
                : loaded_data.filter(
                    (ele: MACHINE_COUNTING, index: number) =>
                      ele?.FACTORY === "NM1" && ele?.EQ_NAME === "ED"
                  )[0]?.EQ_QTY) * dailytime1,
            T_TOTAL: 0,
          };
          let temp_TIME_NM2: TOTAL_TIME = {
            T_FR:
              (loaded_data.filter(
                (ele: MACHINE_COUNTING, index: number) =>
                  ele?.FACTORY === "NM2" && ele?.EQ_NAME === "FR"
              )[0]?.EQ_QTY === undefined
                ? 0
                : loaded_data.filter(
                    (ele: MACHINE_COUNTING, index: number) =>
                      ele?.FACTORY === "NM2" && ele?.EQ_NAME === "FR"
                  )[0]?.EQ_QTY) * dailytime2,
            T_SR:
              (loaded_data.filter(
                (ele: MACHINE_COUNTING, index: number) =>
                  ele?.FACTORY === "NM2" && ele?.EQ_NAME === "SR"
              )[0]?.EQ_QTY === undefined
                ? 0
                : loaded_data.filter(
                    (ele: MACHINE_COUNTING, index: number) =>
                      ele?.FACTORY === "NM2" && ele?.EQ_NAME === "SR"
                  )[0]?.EQ_QTY) * dailytime2,
            T_DC:
              (loaded_data.filter(
                (ele: MACHINE_COUNTING, index: number) =>
                  ele?.FACTORY === "NM2" && ele?.EQ_NAME === "DC"
              )[0]?.EQ_QTY === undefined
                ? 0
                : loaded_data.filter(
                    (ele: MACHINE_COUNTING, index: number) =>
                      ele?.FACTORY === "NM2" && ele?.EQ_NAME === "DC"
                  )[0]?.EQ_QTY) * dailytime2,
            T_ED:
              (loaded_data.filter(
                (ele: MACHINE_COUNTING, index: number) =>
                  ele?.FACTORY === "NM2" && ele?.EQ_NAME === "ED"
              )[0]?.EQ_QTY === undefined
                ? 0
                : loaded_data.filter(
                    (ele: MACHINE_COUNTING, index: number) =>
                      ele?.FACTORY === "NM2" && ele?.EQ_NAME === "ED"
                  )[0]?.EQ_QTY) * dailytime2,
            T_TOTAL: 0,
          };
          let tt1: TOTAL_TIME = {
            T_FR: temp_TIME_NM1.T_FR,
            T_SR: temp_TIME_NM1.T_SR,
            T_DC: temp_TIME_NM1.T_DC,
            T_ED: temp_TIME_NM1.T_ED,
            T_TOTAL:
              temp_TIME_NM1.T_FR +
              temp_TIME_NM1.T_SR +
              temp_TIME_NM1.T_DC +
              temp_TIME_NM1.T_ED,
          };
          let tt2: TOTAL_TIME = {
            T_FR: temp_TIME_NM2.T_FR,
            T_SR: temp_TIME_NM2.T_SR,
            T_DC: temp_TIME_NM2.T_DC,
            T_ED: temp_TIME_NM2.T_ED,
            T_TOTAL:
              temp_TIME_NM2.T_FR +
              temp_TIME_NM2.T_SR +
              temp_TIME_NM2.T_DC +
              temp_TIME_NM2.T_ED,
          };
          setT_TIME_NM1(tt1);
          setT_TIME_NM2(tt2);
          //console.log(loaded_data);
          setMachineCount(loaded_data);
        } else {
          setMachineCount([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getDailySXData = (mc: string, ft: string, fr: string, td: string) => {
    generalQuery("dailysxdata", {
      MACHINE: mc,
      FACTORY: ft,
      FROM_DATE: fr,
      TO_DATE: td,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: DAILY_SX_DATA[] = response.data.data.map(
            (element: DAILY_SX_DATA, index: number) => {
              return {
                ...element,
                SX_DATE: moment(element.SX_DATE).utc().format("YYYY-MM-DD"),
                RATE: (element.SX_RESULT / element.PLAN_QTY) * 100,
              };
            }
          );
          setDailySXData(loaded_data);
        } else {
          setDailySXData([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getWeeklySXData = (mc: string, ft: string, fr: string, td: string) => {
    generalQuery("sxweeklytrenddata", {
      MACHINE: mc,
      FACTORY: ft,
      FROM_DATE: fr,
      TO_DATE: td,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: WEEKLY_SX_DATA[] = response.data.data.map(
            (element: WEEKLY_SX_DATA, index: number) => {
              return {
                ...element,
                RATE: (element.SX_RESULT / element.PLAN_QTY) * 100,
              };
            }
          );
          setWeeklySXData(loaded_data);
        } else {
          setWeeklySXData([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getMonthlySXData = (mc: string, ft: string, fr: string, td: string) => {
    generalQuery("sxmonthlytrenddata", {
      MACHINE: mc,
      FACTORY: ft,
      FROM_DATE: fr,
      TO_DATE: td,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: MONTHLY_SX_DATA[] = response.data.data.map(
            (element: MONTHLY_SX_DATA, index: number) => {
              return {
                ...element,
                RATE: (element.SX_RESULT / element.PLAN_QTY) * 100,
              };
            }
          );
          setMonthlySXData(loaded_data);
        } else {
          setMonthlySXData([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getMachineTimeEfficiency = (
    mc: string,
    ft: string,
    fr: string,
    td: string
  ) => {
    generalQuery("machineTimeEfficiency", {
      MACHINE: mc,
      FACTORY: ft,
      FROM_DATE: fr,
      TO_DATE: td,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loaded_data: OPERATION_TIME_DATA[] = response.data.data.map(
            (element: OPERATION_TIME_DATA, index: number) => {
              return {
                ...element,
              };
            }
          );
          let temp_time: OPERATION_TIME_DATA = {
            PLAN_FACTORY: "TOTAL",
            MACHINE: "TOTAL",
            TOTAL_TIME: 0,
            RUN_TIME_SX: 0,
            SETTING_TIME: 0,
            LOSS_TIME: 0,
            HIEU_SUAT_TIME: 0,
            SETTING_TIME_RATE: 0,
            LOSS_TIME_RATE: 0,
          };
          for (let i = 0; i < loaded_data.length; i++) {
            temp_time.TOTAL_TIME += loaded_data[i].TOTAL_TIME;
            temp_time.RUN_TIME_SX += loaded_data[i].RUN_TIME_SX;
            temp_time.SETTING_TIME += loaded_data[i].SETTING_TIME;
            temp_time.LOSS_TIME += loaded_data[i].LOSS_TIME;
          }
          temp_time.HIEU_SUAT_TIME =
            temp_time.RUN_TIME_SX / temp_time.TOTAL_TIME;
          temp_time.SETTING_TIME_RATE =
            temp_time.SETTING_TIME / temp_time.TOTAL_TIME;
          temp_time.LOSS_TIME_RATE = temp_time.LOSS_TIME / temp_time.TOTAL_TIME;
          loaded_data.push(temp_time);
          setOperationTime(loaded_data);
        } else {
          setOperationTime([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getSXAchiveMentData = (ft: string, fr: string, td: string) => {
    generalQuery("sxachivementdata", {
      FACTORY: ft,
      FROM_DATE: fr,
      TO_DATE: td,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loaded_data: ACHIVEMENT_DATA[] = response.data.data.map(
            (element: ACHIVEMENT_DATA, index: number) => {
              return {
                ...element,
                TOTAL_LOSS:
                  100 - (element.INS_OUTPUT / element.WH_OUTPUT) * 100,
                ACHIVEMENT_RATE:
                  (element.SX_RESULT_TOTAL / element.PLAN_QTY) * 100,
              };
            }
          );
          let temp_TOTAL_ACHIVEMENT: ACHIVEMENT_DATA = {
            MACHINE_NAME: "TOTAL",
            PLAN_QTY: 0,
            WH_OUTPUT: 0,
            SX_RESULT_TOTAL: 0,
            RESULT_STEP_FINAL: 0,
            RESULT_TO_NEXT_PROCESS: 0,
            RESULT_TO_INSPECTION: 0,
            INS_INPUT: 0,
            INSPECT_TOTAL_QTY: 0,
            INSPECT_OK_QTY: 0,
            INSPECT_NG_QTY: 0,
            INS_OUTPUT: 0,
            TOTAL_LOSS: 0,
            ACHIVEMENT_RATE: 0,
          };
          for (let i = 0; i < loaded_data.length; i++) {
            temp_TOTAL_ACHIVEMENT.PLAN_QTY += loaded_data[i].PLAN_QTY;
            temp_TOTAL_ACHIVEMENT.WH_OUTPUT += loaded_data[i].WH_OUTPUT;
            temp_TOTAL_ACHIVEMENT.SX_RESULT_TOTAL +=
              loaded_data[i].SX_RESULT_TOTAL;
            temp_TOTAL_ACHIVEMENT.RESULT_STEP_FINAL +=
              loaded_data[i].RESULT_STEP_FINAL;
            temp_TOTAL_ACHIVEMENT.RESULT_TO_NEXT_PROCESS +=
              loaded_data[i].RESULT_TO_NEXT_PROCESS;
            temp_TOTAL_ACHIVEMENT.RESULT_TO_INSPECTION +=
              loaded_data[i].RESULT_TO_INSPECTION;
            temp_TOTAL_ACHIVEMENT.INS_INPUT += loaded_data[i].INS_INPUT;
            temp_TOTAL_ACHIVEMENT.INSPECT_TOTAL_QTY +=
              loaded_data[i].INSPECT_TOTAL_QTY;
            temp_TOTAL_ACHIVEMENT.INSPECT_OK_QTY +=
              loaded_data[i].INSPECT_OK_QTY;
            temp_TOTAL_ACHIVEMENT.INSPECT_NG_QTY +=
              loaded_data[i].INSPECT_NG_QTY;
            temp_TOTAL_ACHIVEMENT.INS_OUTPUT += loaded_data[i].INS_OUTPUT;
          }
          temp_TOTAL_ACHIVEMENT.ACHIVEMENT_RATE =
            (temp_TOTAL_ACHIVEMENT.SX_RESULT_TOTAL /
              temp_TOTAL_ACHIVEMENT.PLAN_QTY) *
            100;
          temp_TOTAL_ACHIVEMENT.TOTAL_LOSS =
            100 -
            (temp_TOTAL_ACHIVEMENT.INS_OUTPUT /
              temp_TOTAL_ACHIVEMENT.WH_OUTPUT) *
              100;
          loaded_data.push(temp_TOTAL_ACHIVEMENT);
          setSXAchivementData(loaded_data);
        } else {
          setSXAchivementData([]);
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
  function nFormatter(num: number) {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "B";
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return num;
  }
  const productionresultchartMM = useMemo(() => {
    return (
      <Chart
        id='workforcechart'
        dataSource={daily_sx_data}
        height={600}
        resolveLabelOverlapping='hide'
      >
        <Title
          text={`DAILY PRODUCTION RESULT`}
          subtitle={`[${fromdate} ~ ${todate}] [${machine}] -[${factory}]`}
        />
        <ArgumentAxis title='PRODUCTION DATE' />
        <ValueAxis name='quantity' position='left' title='QUANTITY (EA)' />
        <ValueAxis
          name='rate'
          position='right'
          title='Achivement Rate (%)'
          maxValueMargin={0.005}
        />
        <CommonSeriesSettings
          argumentField='SX_DATE'
          hoverMode='allArgumentPoints'
          selectionMode='allArgumentPoints'
        >
          <Label visible={true}>
            <Format type='fixedPoint' precision={0} />
          </Label>
        </CommonSeriesSettings>
        <Series
          axis='rate'
          argumentField='SX_DATE'
          valueField='RATE'
          name='ACHIVEMENT RATE'
          color='#019623'
          type='line'
        >
          <Label
            visible={true}
            customizeText={(e: any) => {
              return `${e.value.toLocaleString("en-US", {
                maximumFractionDigits: 0,
              })}%`;
            }}
          />
        </Series>
        <Series
          axis='quantity'
          argumentField='SX_DATE'
          valueField='PLAN_QTY'
          name='PLAN_QTY'
          color='#A5A6A9'
          type='line'
        >
          <Label
            visible={true}
            customizeText={(e: any) => {
              return `${nFormatter(e.value)}`;
            }}
          />
        </Series>
        <Series
          axis='quantity'
          argumentField='SX_DATE'
          valueField='SX_RESULT'
          name='SX_RESULT'
          color='blue'
          type='bar'
        >
          <Label
            visible={true}
            customizeText={(e: any) => {
              return `${nFormatter(e.value)}`;
            }}
          />
        </Series>
        <Legend
          verticalAlignment='bottom'
          horizontalAlignment='center'
        ></Legend>
      </Chart>
    );
  }, [daily_sx_data]);
  const weeklySXchartMM = useMemo(() => {
    return (     
      <Chart
        id='workforcechart'
        dataSource={weekly_sx_data}
        height={600}
        width={(width - (sidebarstatus ? 400 : 200)) / 2}
        resolveLabelOverlapping='hide'
      >
        <Title
          text={`WEEKLY PRODUCTION TRENDING`}
          subtitle={`[${fromdate} ~ ${todate}]`}
        />
        <ArgumentAxis title='PRODUCTION WEEK' allowDecimals={false}/>
        <ValueAxis name='quantity' position='left' title='QUANTITY (EA)' />
        <ValueAxis
          name='rate'
          position='right'
          title='Achivement Rate (%)'
          maxValueMargin={0.05}
        />
        <CommonSeriesSettings argumentField='SX_WEEK' type='stackedBar'>
          <Label visible={true}>
            <Format type='fixedPoint' precision={0} />
          </Label>
        </CommonSeriesSettings>
        <Series
          axis='rate'
          argumentField='SX_WEEK'
          valueField='RATE'
          name='ACHIVEMENT RATE'
          color='#019623'
          type='line'
        >
          <Label
            visible={true}
            customizeText={(e: any) => {
              return `${e.value.toLocaleString("en-US", {
                maximumFractionDigits: 0,
              })}%`;
            }}
          />
        </Series>
        <Series
          axis='quantity'
          argumentField='SX_WEEK'
          valueField='PLAN_QTY'
          name='PLAN_QTY'
          color='#A5A6A9'
          type='line'
        >
          <Label
            visible={true}
            customizeText={(e: any) => {
              return `${nFormatter(e.value)}`;
            }}
          />
        </Series>
        <Series
          axis='quantity'
          argumentField='SX_WEEK'
          valueField='SX_RESULT'
          name='SX_RESULT'
          color='#FA9F0B'
          type='bar'
        >
          <Label
            visible={true}
            customizeText={(e: any) => {
              return `${nFormatter(e.value)}`;
            }}
          />
        </Series>
        <Legend
          verticalAlignment='bottom'
          horizontalAlignment='center'
        ></Legend>
      </Chart>
     
    );
  }, [weekly_sx_data, width, height]);
  const monthlySXchartMM = useMemo(() => {
    return (      
      <Chart
        id='workforcechart'
        dataSource={monthly_sx_data}
        height={600}
        width={(width - (sidebarstatus ? 400 : 200)) / 2}
        resolveLabelOverlapping='stack'
      >
        <Title
          text={`MONTHLY PRODUCTION TRENDING`}
          subtitle={`[${moment().format("YYYY")}]`}
        />
        <ArgumentAxis title='PRODUCTION MONTH' />
        <ValueAxis name='quantity' position='left' title='QUANTITY (EA)' />
        <ValueAxis
          name='rate'
          position='right'
          title='Achivement Rate (%)'
          maxValueMargin={0.05}
        />
        <CommonSeriesSettings argumentField='SX_MONTH' type='stackedBar'>
          <Label visible={true}>
            <Format type='fixedPoint' precision={0} />
          </Label>
        </CommonSeriesSettings>
        <Series
          axis='rate'
          argumentField='SX_MONTH'
          valueField='RATE'
          name='ACHIVEMENT RATE'
          color='#019623'
          type='line'
        >
          <Label
            visible={true}
            customizeText={(e: any) => {
              return `${e.value.toLocaleString("en-US", {
                maximumFractionDigits: 0,
              })}%`;
            }}
          />
        </Series>
        <Series
          axis='quantity'
          argumentField='SX_MONTH'
          valueField='PLAN_QTY'
          name='PLAN_QTY'
          color='#A5A6A9'
          type='line'
        >
          <Label
            visible={true}
            customizeText={(e: any) => {
              return `${nFormatter(e.value)}`;
            }}
          />
        </Series>
        <Series
          axis='quantity'
          argumentField='SX_MONTH'
          valueField='SX_RESULT'
          name='SX_RESULT'
          color='#ED45B5'
          type='bar'
        >
          <Label
            visible={true}
            customizeText={(e: any) => {
              return `${nFormatter(e.value)}`;
            }}
          />
        </Series>
        <Legend
          verticalAlignment='bottom'
          horizontalAlignment='center'
        ></Legend>
      </Chart>
      
    );
  }, [monthly_sx_data, width, height]);
  const getAvailableTime = () => {
    let totalAvailableTime: number = 0;
    if (factory === "ALL") {
      if (machine == "ALL") {
        totalAvailableTime = T_TIME_NM1.T_TOTAL + T_TIME_NM2.T_TOTAL;
      } else {
        switch (machine) {
          case "FR":
            totalAvailableTime = T_TIME_NM1.T_FR + T_TIME_NM2.T_FR;
            break;
          case "SR":
            totalAvailableTime = T_TIME_NM1.T_SR + T_TIME_NM2.T_SR;
            break;
          case "DC":
            totalAvailableTime = T_TIME_NM1.T_DC + T_TIME_NM2.T_DC;
            break;
          case "ED":
            totalAvailableTime = T_TIME_NM1.T_ED + T_TIME_NM2.T_ED;
            break;
        }
      }
    } else {
      if (machine == "ALL") {
        totalAvailableTime =
          factory === "NM1" ? T_TIME_NM1.T_TOTAL : T_TIME_NM2.T_TOTAL;
      } else {
        switch (machine) {
          case "FR":
            totalAvailableTime =
              factory === "NM1" ? T_TIME_NM1.T_FR : T_TIME_NM2.T_FR;
            break;
          case "SR":
            totalAvailableTime =
              factory === "NM1" ? T_TIME_NM1.T_SR : T_TIME_NM2.T_SR;
            break;
          case "DC":
            totalAvailableTime =
              factory === "NM1" ? T_TIME_NM1.T_DC : T_TIME_NM2.T_DC;
            break;
          case "ED":
            totalAvailableTime =
              factory === "NM1" ? T_TIME_NM1.T_ED : T_TIME_NM2.T_ED;
            break;
        }
      }
    }
    return totalAvailableTime;
  };
  useEffect(() => {
    getMonthlySXData(
      machine,
      factory,
      moment().format("YYYY") + "-01-01",
      moment().format("YYYY-MM-DD")
    );
    getWeeklySXData(machine, factory, fromdate, todate);
    getDailySXData(machine, factory, fromdate, todate);
    getSXAchiveMentData(factory, fromdate, todate);
    getMachineCounting();
    getMachineTimeEfficiency(machine, factory, fromdate, todate);
    let intervalID = window.setInterval(() => {}, 5000);
    return () => {
      window.clearInterval(intervalID);
    };
  }, []);
  return (
    <div className='planresult'>
      <div
        className='maintitle'
        style={{ fontSize: "1.2rem", alignSelf: "center" }}
      >
        PRODUCTION PERFORMANCE MANAGEMENT
      </div>
      <div className='inputformdiv'>
        <div className='forminput'>
          <div className='forminputcolumn'>
            <label>
              <b>Quick Select</b>
              <select
                name='phanloai'
                onChange={(e) => {
                  console.log(e.target.value);
                  if (e.target.value === "0") {
                    getMonthlySXData(
                      machine,
                      factory,
                      moment().format("YYYY") + "-01-01",
                      moment().format("YYYY-MM-DD")
                    );
                    getWeeklySXData(
                      machine,
                      factory,
                      moment().add(-30, "day").format("YYYY-MM-DD"),
                      moment().format("YYYY-MM-DD")
                    );
                    getDailySXData(
                      machine,
                      factory,
                      moment().add(-30, "day").format("YYYY-MM-DD"),
                      moment().format("YYYY-MM-DD")
                    );
                    getSXAchiveMentData(
                      factory,
                      moment().add(-30, "day").format("YYYY-MM-DD"),
                      moment().format("YYYY-MM-DD")
                    );
                    setFromDate(moment().add(-30, "day").format("YYYY-MM-DD"));
                    getMachineTimeEfficiency(
                      machine,
                      factory,
                      moment().add(-30, "day").format("YYYY-MM-DD"),
                      moment().format("YYYY-MM-DD")
                    );
                    setToDate(moment().format("YYYY-MM-DD"));
                    setDayRange(
                      getBusinessDatesCount(
                        moment().add(-30, "day").format("YYYY-MM-DD"),
                        moment().format("YYYY-MM-DD")
                      )
                    );
                    //setDayRange(Math.abs(moment().add(-30, "day").diff(moment(),'days')));
                  } else if (e.target.value === "1") {
                    getMonthlySXData(
                      machine,
                      factory,
                      moment().format("YYYY") + "-01-01",
                      moment().format("YYYY-MM-DD")
                    );
                    getWeeklySXData(
                      machine,
                      factory,
                      moment().format("YYYY-MM-DD"),
                      moment().format("YYYY-MM-DD")
                    );
                    getDailySXData(
                      machine,
                      factory,
                      moment().format("YYYY-MM-DD"),
                      moment().format("YYYY-MM-DD")
                    );
                    getSXAchiveMentData(
                      factory,
                      moment().format("YYYY-MM-DD"),
                      moment().format("YYYY-MM-DD")
                    );
                    setFromDate(moment().format("YYYY-MM-DD"));
                    setToDate(moment().format("YYYY-MM-DD"));
                    getMachineTimeEfficiency(
                      machine,
                      factory,
                      moment().add(0, "day").format("YYYY-MM-DD"),
                      moment().format("YYYY-MM-DD")
                    );
                    setDayRange(
                      getBusinessDatesCount(
                        moment().format("YYYY-MM-DD"),
                        moment().format("YYYY-MM-DD")
                      )
                    );
                    //setDayRange(Math.abs(moment().diff(moment(),'days')));
                  } else if (e.target.value === "2") {
                    getMonthlySXData(
                      machine,
                      factory,
                      moment().format("YYYY") + "-01-01",
                      moment().add(0, "day").format("YYYY-MM-DD")
                    );
                    getWeeklySXData(
                      machine,
                      factory,
                      moment().add(-1, "day").format("YYYY-MM-DD"),
                      moment().add(-1, "day").format("YYYY-MM-DD")
                    );
                    getDailySXData(
                      machine,
                      factory,
                      moment().add(-1, "day").format("YYYY-MM-DD"),
                      moment().add(-1, "day").format("YYYY-MM-DD")
                    );
                    getSXAchiveMentData(
                      factory,
                      moment().add(-1, "day").format("YYYY-MM-DD"),
                      moment().add(-1, "day").format("YYYY-MM-DD")
                    );
                    getMachineTimeEfficiency(
                      machine,
                      factory,
                      moment().add(-1, "day").format("YYYY-MM-DD"),
                      moment().add(-1, "day").format("YYYY-MM-DD")
                    );
                    setFromDate(moment().add(-1, "day").format("YYYY-MM-DD"));
                    setToDate(moment().add(-1, "day").format("YYYY-MM-DD"));
                    setDayRange(
                      getBusinessDatesCount(
                        moment().add(-1, "day").format("YYYY-MM-DD"),
                        moment().add(-1, "day").format("YYYY-MM-DD")
                      )
                    );
                    //setDayRange(Math.abs(moment().add(-1,'days').diff(moment(),'days')));
                  }
                }}
              >
                <option value='0'>LAST 30 DAYS</option>
                <option value='1'>TODAY</option>
                <option value='2'>YESTERDAY</option>
              </select>
            </label>
          </div>
          <div className='forminputcolumn'>
            <label>
              <b>From:</b>
              <input
                type='date'
                value={fromdate.slice(0, 10)}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  //console.log(e.target.value);
                  /*  getDailySXData(machine, factory, e.target.value, todate);
                    getSXAchiveMentData(factory, e.target.value, todate);
                    getWeeklySXData(machine, factory, e.target.value, todate);
                    getMachineTimeEfficiency(machine, factory,e.target.value, todate);
                    setDayRange(
                      getBusinessDatesCount(
                        moment(e.target.value).format("YYYY-MM-DD"),
                        moment(todate).format("YYYY-MM-DD")
                      )
                    );    
 */
                }}
              ></input>
            </label>
            <label>
              <b>To:</b>{" "}
              <input
                type='date'
                value={todate.slice(0, 10)}
                onChange={(e) => {
                  setToDate(e.target.value);
                  /*  console.log(e.target.value);
                  getDailySXData(machine, factory, fromdate, e.target.value);
                  getSXAchiveMentData(factory, fromdate, e.target.value);
                  getWeeklySXData(machine, factory, fromdate, e.target.value);
                  getMachineTimeEfficiency(machine, factory, fromdate, e.target.value);
                  setDayRange(
                    getBusinessDatesCount(
                      moment(fromdate).format("YYYY-MM-DD"),
                      moment(e.target.value).format("YYYY-MM-DD")
                    )
                  );        */
                }}
              ></input>
            </label>
          </div>
          <div className='forminputcolumn'>
            <label>
              <b>FACTORY:</b>
              <select
                name='phanloai'
                value={factory}
                onChange={(e) => {
                  setFactory(e.target.value);
                  /*  getDailySXData(machine, e.target.value, fromdate, todate);
                  getWeeklySXData(machine, e.target.value, fromdate, todate);
                  getMonthlySXData(
                    machine,
                    e.target.value,
                    moment().format("YYYY") + "-01-01",
                    moment().format("YYYY-MM-DD")
                  );
                  getSXAchiveMentData(e.target.value, fromdate, todate);
                  getMachineTimeEfficiency(machine, e.target.value, fromdate, todate); */
                }}
              >
                <option value='ALL'>ALL</option>
                <option value='NM1'>NM1</option>
                <option value='NM2'>NM2</option>
              </select>
            </label>
            <label>
              <b>MACHINE:</b>
              <select
                name='machine'
                value={machine}
                onChange={(e) => {
                  setMachine(e.target.value);
                  /* getDailySXData(e.target.value, factory, fromdate, todate);
                  getWeeklySXData(e.target.value, factory, fromdate, todate);
                  getMonthlySXData(
                    e.target.value,
                    factory,
                    moment().format("YYYY") + "-01-01",
                    moment().format("YYYY-MM-DD")
                  );
                  getMachineTimeEfficiency(e.target.value,factory, fromdate, todate); */
                }}
              >
                <option value='ALL'>ALL</option>
                <option value='FR'>FR</option>
                <option value='SR'>SR</option>
                <option value='DC'>DC</option>
                <option value='ED'>ED</option>
              </select>
            </label>
          </div>
          <div className='forminputcolumn'>
            <IconButton
              className='buttonIcon'
              onClick={() => {
                getDailySXData(machine, factory, fromdate, todate);
                getSXAchiveMentData(factory, fromdate, todate);
                getWeeklySXData(machine, factory, fromdate, todate);
                getMachineTimeEfficiency(machine, factory, fromdate, todate);
                setDayRange(
                  getBusinessDatesCount(
                    moment(fromdate).format("YYYY-MM-DD"),
                    moment(todate).format("YYYY-MM-DD")
                  )
                );
              }}
            >
              <BiSearch color='green' size={25} />
              Search
            </IconButton>
          </div>
        </div>
      </div>
      <div className='prdiv'>
        <div className='progressdiv'>
          <div className='titleprogressdiv'>
            1.PRODUCTION ACHIVEMENT RATE BY MACHINE (%)
          </div>
          <div className='mainprogressdiv'>
            <div className='subprogressdiv'>
              <div className='sectiondiv'>
                <div className='totalachivementdiv'>
                  {`${sxachivementdata
                    .filter(
                      (ele: ACHIVEMENT_DATA, index: number) =>
                        ele.MACHINE_NAME === "TOTAL"
                    )[0]
                    ?.ACHIVEMENT_RATE?.toLocaleString("en-US", {
                      maximumFractionDigits: 1,
                    })}%`}
                </div>
              </div>
            </div>
            <div className='subprogressdiv'>
              <div className='sectiondiv'>
                FR:{" "}
                {sxachivementdata
                  .filter(
                    (ele: ACHIVEMENT_DATA, index: number) =>
                      ele.MACHINE_NAME === "FR"
                  )[0]
                  ?.ACHIVEMENT_RATE?.toLocaleString("en-US", {
                    maximumFractionDigits: 1,
                  })}{" "}
                %
                <LinearProgress
                  style={{ height: "10px" }}
                  variant='determinate'
                  color='primary'
                  aria-valuemin={0}
                  aria-valuemax={100}
                  value={
                    sxachivementdata.filter(
                      (ele: ACHIVEMENT_DATA, index: number) =>
                        ele.MACHINE_NAME === "FR"
                    )[0]?.ACHIVEMENT_RATE === undefined
                      ? 0
                      : sxachivementdata.filter(
                          (ele: ACHIVEMENT_DATA, index: number) =>
                            ele.MACHINE_NAME === "FR"
                        )[0]?.ACHIVEMENT_RATE
                  }
                />
              </div>
              <div className='sectiondiv'>
                SR:{" "}
                {sxachivementdata
                  .filter(
                    (ele: ACHIVEMENT_DATA, index: number) =>
                      ele.MACHINE_NAME === "SR"
                  )[0]
                  ?.ACHIVEMENT_RATE?.toLocaleString("en-US", {
                    maximumFractionDigits: 1,
                  })}{" "}
                %
                <LinearProgress
                  style={{ height: "10px" }}
                  variant='determinate'
                  color='secondary'
                  aria-valuemin={0}
                  aria-valuemax={100}
                  value={
                    sxachivementdata.filter(
                      (ele: ACHIVEMENT_DATA, index: number) =>
                        ele.MACHINE_NAME === "SR"
                    )[0]?.ACHIVEMENT_RATE === undefined
                      ? 0
                      : sxachivementdata.filter(
                          (ele: ACHIVEMENT_DATA, index: number) =>
                            ele.MACHINE_NAME === "SR"
                        )[0]?.ACHIVEMENT_RATE
                  }
                />
              </div>
              <div className='sectiondiv'>
                DC:{" "}
                {sxachivementdata
                  .filter(
                    (ele: ACHIVEMENT_DATA, index: number) =>
                      ele.MACHINE_NAME === "DC"
                  )[0]
                  ?.ACHIVEMENT_RATE?.toLocaleString("en-US", {
                    maximumFractionDigits: 1,
                  })}{" "}
                %
                <LinearProgress
                  style={{ height: "10px" }}
                  variant='determinate'
                  color='info'
                  aria-valuemin={0}
                  aria-valuemax={100}
                  value={
                    sxachivementdata.filter(
                      (ele: ACHIVEMENT_DATA, index: number) =>
                        ele.MACHINE_NAME === "DC"
                    )[0]?.ACHIVEMENT_RATE === undefined
                      ? 0
                      : sxachivementdata.filter(
                          (ele: ACHIVEMENT_DATA, index: number) =>
                            ele.MACHINE_NAME === "DC"
                        )[0]?.ACHIVEMENT_RATE
                  }
                />
              </div>
              <div className='sectiondiv'>
                ED:{" "}
                {sxachivementdata
                  .filter(
                    (ele: ACHIVEMENT_DATA, index: number) =>
                      ele.MACHINE_NAME === "ED"
                  )[0]
                  ?.ACHIVEMENT_RATE?.toLocaleString("en-US", {
                    maximumFractionDigits: 1,
                  })}{" "}
                %
                <LinearProgress
                  style={{ height: "10px" }}
                  variant='determinate'
                  color='warning'
                  aria-valuemin={0}
                  aria-valuemax={100}
                  value={
                    sxachivementdata.filter(
                      (ele: ACHIVEMENT_DATA, index: number) =>
                        ele.MACHINE_NAME === "ED"
                    )[0]?.ACHIVEMENT_RATE === undefined
                      ? 0
                      : sxachivementdata.filter(
                          (ele: ACHIVEMENT_DATA, index: number) =>
                            ele.MACHINE_NAME === "ED"
                        )[0]?.ACHIVEMENT_RATE
                  }
                />
              </div>
            </div>
          </div>
        </div>
        <div className='progressdiv'>
          <div className='titleprogressdiv'>2.PRODUCTION LOSS (%)</div>
          <div className='mainprogressdiv'>
            <div className='subprogressdiv'>
              <div className='sectiondiv'>
                <div className='totallosstdiv'>
                  {`${(
                    (sxachivementdata.filter(
                      (ele: ACHIVEMENT_DATA, index: number) =>
                        ele.MACHINE_NAME === "TOTAL"
                    )[0]?.INS_OUTPUT /
                      sxachivementdata.filter(
                        (ele: ACHIVEMENT_DATA, index: number) =>
                          ele.MACHINE_NAME === "TOTAL"
                      )[0]?.WH_OUTPUT) *
                      100 -
                    100
                  )?.toLocaleString("en-US", {
                    maximumFractionDigits: 1,
                  })}%`}
                </div>
              </div>
              <div className='sectiondiv'>
                <div className='lossdiv'>
                  <CIRCLE_COMPONENT
                    type='loss'
                    value={`${nFormatter(
                      sxachivementdata.filter(
                        (ele: ACHIVEMENT_DATA, index: number) =>
                          ele.MACHINE_NAME === "TOTAL"
                      )[0]?.PLAN_QTY
                    )}`}
                    title='PLAN QTY'
                    color='blue'
                  />
                  <CIRCLE_COMPONENT
                    type='loss'
                    value={`${nFormatter(
                      sxachivementdata.filter(
                        (ele: ACHIVEMENT_DATA, index: number) =>
                          ele.MACHINE_NAME === "TOTAL"
                      )[0]?.WH_OUTPUT
                    )}`}
                    title='WH OUTPUT'
                    color='#CBAA00'
                  />
                  <CIRCLE_COMPONENT
                    type='loss'
                    value={`${nFormatter(
                      sxachivementdata.filter(
                        (ele: ACHIVEMENT_DATA, index: number) =>
                          ele.MACHINE_NAME === "TOTAL"
                      )[0]?.SX_RESULT_TOTAL
                    )}`}
                    title='RESULT_TOTAL'
                    color='#02B93A'
                  />
                  <CIRCLE_COMPONENT
                    type='loss'
                    value={`${nFormatter(
                      sxachivementdata.filter(
                        (ele: ACHIVEMENT_DATA, index: number) =>
                          ele.MACHINE_NAME === "TOTAL"
                      )[0]?.RESULT_TO_INSPECTION
                    )}`}
                    title='RESULT_INSP'
                    color='#02B93A'
                  />
                  <CIRCLE_COMPONENT
                    type='loss'
                    value={`${nFormatter(
                      sxachivementdata.filter(
                        (ele: ACHIVEMENT_DATA, index: number) =>
                          ele.MACHINE_NAME === "TOTAL"
                      )[0]?.INS_INPUT
                    )}`}
                    title='INSP INPUT'
                    color='#CC26F9'
                  />
                  <CIRCLE_COMPONENT
                    type='loss'
                    value={`${nFormatter(
                      sxachivementdata.filter(
                        (ele: ACHIVEMENT_DATA, index: number) =>
                          ele.MACHINE_NAME === "TOTAL"
                      )[0]?.INSPECT_TOTAL_QTY
                    )}`}
                    title='INSP TOTAL'
                    color='blue'
                  />
                  <CIRCLE_COMPONENT
                    type='loss'
                    value={`${nFormatter(
                      sxachivementdata.filter(
                        (ele: ACHIVEMENT_DATA, index: number) =>
                          ele.MACHINE_NAME === "TOTAL"
                      )[0]?.INSPECT_OK_QTY
                    )}`}
                    title='INSP OK'
                    color='#00C50C'
                  />
                  <CIRCLE_COMPONENT
                    type='loss'
                    value={`${nFormatter(
                      sxachivementdata.filter(
                        (ele: ACHIVEMENT_DATA, index: number) =>
                          ele.MACHINE_NAME === "TOTAL"
                      )[0]?.INSPECT_NG_QTY
                    )}`}
                    title='INSP NG'
                    color='red'
                  />
                  <CIRCLE_COMPONENT
                    type='loss'
                    value={`${nFormatter(
                      sxachivementdata.filter(
                        (ele: ACHIVEMENT_DATA, index: number) =>
                          ele.MACHINE_NAME === "TOTAL"
                      )[0]?.INS_OUTPUT
                    )}`}
                    title='INSP OUTPUT'
                    color='#02D819'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='progressdiv'>
          <div className='titleprogressdiv'>3.PRODUCTION EFFICIENCY (%)</div>
          <div className='mainprogressdiv'>
            <div className='subprogressdiv'>
              <div className='sectiondiv'>
                <div className='efficiencydiv'>
                  <CIRCLE_COMPONENT
                    type='timesummary'
                    value={`${nFormatter(
                      (operation_time.filter(
                        (ele: OPERATION_TIME_DATA, index: number) =>
                          ele.PLAN_FACTORY === "TOTAL"
                      )[0]?.TOTAL_TIME /
                        ((T_TIME_NM1.T_TOTAL + T_TIME_NM2.T_TOTAL) *
                          dayrange)) *
                        100
                    )?.toLocaleString("en-US", {
                      maximumFractionDigits: 1,
                    })} %`}
                    title='OPERATION RATE'
                    color='red'
                  />
                  <CIRCLE_COMPONENT
                    type='timesummary'
                    value={`${nFormatter(
                      ((operation_time.filter(
                        (ele: OPERATION_TIME_DATA, index: number) =>
                          ele.PLAN_FACTORY === "TOTAL"
                      )[0]?.RUN_TIME_SX -
                        operation_time.filter(
                          (ele: OPERATION_TIME_DATA, index: number) =>
                            ele.PLAN_FACTORY === "TOTAL"
                        )[0]?.LOSS_TIME +
                        operation_time.filter(
                          (ele: OPERATION_TIME_DATA, index: number) =>
                            ele.PLAN_FACTORY === "TOTAL"
                        )[0]?.SETTING_TIME) /
                        operation_time.filter(
                          (ele: OPERATION_TIME_DATA, index: number) =>
                            ele.PLAN_FACTORY === "TOTAL"
                        )[0]?.TOTAL_TIME) *
                        100
                    )?.toLocaleString("en-US", {
                      maximumFractionDigits: 1,
                    })} %`}
                    title='PRODUCTION EFFICIENCY'
                    color='#FE28A7'
                  />
                  <CIRCLE_COMPONENT
                    type='timesummary'
                    value={`${nFormatter(
                      ((operation_time.filter(
                        (ele: OPERATION_TIME_DATA, index: number) =>
                          ele.PLAN_FACTORY === "TOTAL"
                      )[0]?.RUN_TIME_SX -
                        operation_time.filter(
                          (ele: OPERATION_TIME_DATA, index: number) =>
                            ele.PLAN_FACTORY === "TOTAL"
                        )[0]?.LOSS_TIME) /
                        operation_time.filter(
                          (ele: OPERATION_TIME_DATA, index: number) =>
                            ele.PLAN_FACTORY === "TOTAL"
                        )[0]?.TOTAL_TIME) *
                        100
                    )?.toLocaleString("en-US", {
                      maximumFractionDigits: 1,
                    })} %`}
                    title='EQ EFFICIENCY'
                    color='#00B215'
                  />
                </div>
              </div>
              <div className='sectiondiv'>
                <div className='lossdiv'>
                  <CIRCLE_COMPONENT
                    type='time'
                    value={`${nFormatter(getAvailableTime() * dayrange)} min`}
                    title='AVLB TIME'
                    color='blue'
                  />
                  <CIRCLE_COMPONENT
                    type='time'
                    value={`${nFormatter(
                      operation_time.filter(
                        (ele: OPERATION_TIME_DATA, index: number) =>
                          ele.PLAN_FACTORY === "TOTAL"
                      )[0]?.TOTAL_TIME
                    )} min`}
                    title='TT PROD TIME'
                    color='#742BFE'
                  />
                  <CIRCLE_COMPONENT
                    type='time'
                    value={`${nFormatter(
                      operation_time.filter(
                        (ele: OPERATION_TIME_DATA, index: number) =>
                          ele.PLAN_FACTORY === "TOTAL"
                      )[0]?.SETTING_TIME
                    )} min`}
                    title='SETTING TIME'
                    color='#FE5E2B'
                  />
                  <CIRCLE_COMPONENT
                    type='time'
                    value={`${nFormatter(
                      operation_time.filter(
                        (ele: OPERATION_TIME_DATA, index: number) =>
                          ele.PLAN_FACTORY === "TOTAL"
                      )[0]?.RUN_TIME_SX -
                        operation_time.filter(
                          (ele: OPERATION_TIME_DATA, index: number) =>
                            ele.PLAN_FACTORY === "TOTAL"
                        )[0]?.LOSS_TIME
                    )} min`}
                    title='RUN TIME'
                    color='#21B800'
                  />
                  <CIRCLE_COMPONENT
                    type='time'
                    value={`${nFormatter(
                      operation_time.filter(
                        (ele: OPERATION_TIME_DATA, index: number) =>
                          ele.PLAN_FACTORY === "TOTAL"
                      )[0]?.LOSS_TIME
                    )} min`}
                    title='LOSS TIME'
                    color='red'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='workforcechart'>
        <div className='sectiondiv'>
          <div className='titleplanresult'>
            4. PRODUCTION PERFOMANCE TRENDING
          </div>
          <div className='starndardworkforce'>{productionresultchartMM}</div>
        </div>
      </div>
      <div className='workforcechart2'>
        <div className='sectiondiv'>
          <div className='starndardworkforce'>{weeklySXchartMM}</div>
        </div>
        <div className='sectiondiv'>
          <div className='starndardworkforce'>{monthlySXchartMM}</div>
        </div>
      </div>
      <div className='ycsxbalancedatatable'>
        <table>
          <thead>
            <tr>
              <th style={{ color: "black", fontWeight: "normal" }}>
                MACHINE_NAME
              </th>
              <th style={{ color: "black", fontWeight: "normal" }}>PLAN_QTY</th>
              <th style={{ color: "black", fontWeight: "normal" }}>
                WH_OUTPUT
              </th>
              <th style={{ color: "black", fontWeight: "normal" }}>
                SX_RESULT_TOTAL
              </th>
              <th style={{ color: "black", fontWeight: "normal" }}>
                RESULT_STEP_FINAL
              </th>
              <th style={{ color: "black", fontWeight: "normal" }}>
                RESULT_TO_NEXT_PROCESS
              </th>
              <th style={{ color: "black", fontWeight: "normal" }}>
                RESULT_TO_INSPECTION
              </th>
              <th style={{ color: "black", fontWeight: "normal" }}>
                INS_INPUT
              </th>
              <th style={{ color: "black", fontWeight: "normal" }}>
                INSPECT_TOTAL_QTY
              </th>
              <th style={{ color: "black", fontWeight: "normal" }}>
                INSPECT_OK_QTY
              </th>
              <th style={{ color: "black", fontWeight: "normal" }}>
                INSPECT_NG_QTY
              </th>
              <th style={{ color: "black", fontWeight: "normal" }}>
                INS_OUTPUT
              </th>
              <th style={{ color: "black", fontWeight: "normal" }}>
                TOTAL_LOSS
              </th>
              <th style={{ color: "black", fontWeight: "normal" }}>
                ACHIVEMENT_RATE
              </th>
            </tr>
          </thead>
          <tbody>
            {sxachivementdata.map((ele: ACHIVEMENT_DATA, index: number) => {
              if (ele.MACHINE_NAME !== "TOTAL") {
                return (
                  <tr key={index}>
                    <td style={{ color: "blue", fontWeight: "bold" }}>
                      {ele.MACHINE_NAME}
                    </td>
                    <td style={{ color: "#360EEA", fontWeight: "normal" }}>
                      {ele.PLAN_QTY?.toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td style={{ color: "#B09403", fontWeight: "normal" }}>
                      {ele.WH_OUTPUT?.toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td style={{ color: "#EA0EBA", fontWeight: "normal" }}>
                      {ele.SX_RESULT_TOTAL?.toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td style={{ color: "#EA0EBA", fontWeight: "normal" }}>
                      {ele.RESULT_STEP_FINAL?.toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td style={{ color: "#F16E05", fontWeight: "normal" }}>
                      {ele.RESULT_TO_NEXT_PROCESS?.toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td style={{ color: "#F16E05", fontWeight: "normal" }}>
                      {ele.RESULT_TO_INSPECTION?.toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td style={{ color: "#009E4D", fontWeight: "normal" }}>
                      {ele.INS_INPUT?.toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td style={{ color: "#009E4D", fontWeight: "normal" }}>
                      {ele.INSPECT_TOTAL_QTY?.toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td style={{ color: "#1C9E00", fontWeight: "normal" }}>
                      {ele.INSPECT_OK_QTY?.toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td style={{ color: "red", fontWeight: "normal" }}>
                      {ele.INSPECT_NG_QTY?.toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td style={{ color: "#929E00", fontWeight: "normal" }}>
                      {ele.INS_OUTPUT?.toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td style={{ color: "red", fontWeight: "normal" }}>
                      {ele.TOTAL_LOSS?.toLocaleString("en-US", {
                        maximumFractionDigits: 1,
                      })}
                      %
                    </td>
                    <td style={{ color: "#21C502", fontWeight: "normal" }}>
                      {ele.ACHIVEMENT_RATE?.toLocaleString("en-US", {
                        maximumFractionDigits: 1,
                      })}
                      %
                    </td>
                  </tr>
                );
              } else {
                return (
                  <tr key={index}>
                    <td style={{ color: "blue", fontWeight: "bold" }}>
                      {ele.MACHINE_NAME}
                    </td>
                    <td style={{ color: "#360EEA", fontWeight: "bold" }}>
                      {ele.PLAN_QTY?.toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td style={{ color: "#B09403", fontWeight: "bold" }}>
                      {ele.WH_OUTPUT?.toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td style={{ color: "#EA0EBA", fontWeight: "bold" }}>
                      {ele.SX_RESULT_TOTAL?.toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td style={{ color: "#EA0EBA", fontWeight: "bold" }}>
                      {ele.RESULT_STEP_FINAL?.toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td style={{ color: "#F16E05", fontWeight: "bold" }}>
                      {ele.RESULT_TO_NEXT_PROCESS?.toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td style={{ color: "#F16E05", fontWeight: "bold" }}>
                      {ele.RESULT_TO_INSPECTION?.toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td style={{ color: "#009E4D", fontWeight: "bold" }}>
                      {ele.INS_INPUT?.toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td style={{ color: "#009E4D", fontWeight: "bold" }}>
                      {ele.INSPECT_TOTAL_QTY?.toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td style={{ color: "#1C9E00", fontWeight: "bold" }}>
                      {ele.INSPECT_OK_QTY?.toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td style={{ color: "red", fontWeight: "bold" }}>
                      {ele.INSPECT_NG_QTY?.toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td style={{ color: "#929E00", fontWeight: "bold" }}>
                      {ele.INS_OUTPUT?.toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td style={{ color: "red", fontWeight: "bold" }}>
                      {ele.TOTAL_LOSS?.toLocaleString("en-US", {
                        maximumFractionDigits: 1,
                      })}
                      %
                    </td>
                    <td style={{ color: "#21C502", fontWeight: "bold" }}>
                      {ele.ACHIVEMENT_RATE?.toLocaleString("en-US", {
                        maximumFractionDigits: 1,
                      })}
                      %
                    </td>
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
      </div>
      <div className='ycsxbalancedatatable'>
        <table>
          <thead>
            <tr>
              <th style={{ color: "black", fontWeight: "normal" }}>
                PLAN_FACTORY
              </th>
              <th style={{ color: "black", fontWeight: "normal" }}>MACHINE</th>
              <th style={{ color: "black", fontWeight: "normal" }}>
                TOTAL_TIME
              </th>
              <th style={{ color: "black", fontWeight: "normal" }}>
                RUN_TIME_SX
              </th>
              <th style={{ color: "black", fontWeight: "normal" }}>
                SETTING_TIME
              </th>
              <th style={{ color: "black", fontWeight: "normal" }}>
                LOSS_TIME
              </th>
              <th style={{ color: "black", fontWeight: "normal" }}>
                PROD_EFFICIENCY
              </th>
              <th style={{ color: "black", fontWeight: "normal" }}>
                EQ_EFFICIENCY
              </th>
              <th style={{ color: "black", fontWeight: "normal" }}>
                SETTING_TIME_RATE
              </th>
              <th style={{ color: "black", fontWeight: "normal" }}>
                LOSS_TIME_RATE
              </th>
            </tr>
          </thead>
          <tbody>
            {operation_time.map((ele: OPERATION_TIME_DATA, index: number) => {
              if (ele.PLAN_FACTORY !== "TOTAL") {
                return (
                  <tr key={index}>
                    <td style={{ color: "blue", fontWeight: "bold" }}>
                      {ele.PLAN_FACTORY}
                    </td>
                    <td style={{ color: "#360EEA", fontWeight: "normal" }}>
                      {ele.MACHINE}
                    </td>
                    <td style={{ color: "#360EEA", fontWeight: "normal" }}>
                      {ele.TOTAL_TIME?.toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td style={{ color: "#EA0EBA", fontWeight: "normal" }}>
                      {(ele.RUN_TIME_SX - ele.LOSS_TIME)?.toLocaleString(
                        "en-US",
                        {
                          maximumFractionDigits: 0,
                        }
                      )}
                    </td>
                    <td style={{ color: "#EA0EBA", fontWeight: "normal" }}>
                      {ele.SETTING_TIME?.toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td style={{ color: "#F16E05", fontWeight: "normal" }}>
                      {ele.LOSS_TIME?.toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td style={{ color: "#21C502", fontWeight: "normal" }}>
                      {(
                        ((ele.RUN_TIME_SX + ele.SETTING_TIME - ele.LOSS_TIME) /
                          ele.TOTAL_TIME) *
                        100
                      )?.toLocaleString("en-US", {
                        maximumFractionDigits: 1,
                      })}
                      %
                    </td>
                    <td style={{ color: "#21C502", fontWeight: "normal" }}>
                      {(
                        ((ele.RUN_TIME_SX - ele.LOSS_TIME) / ele.TOTAL_TIME) *
                        100
                      )?.toLocaleString("en-US", {
                        maximumFractionDigits: 1,
                      })}
                      %
                    </td>
                    <td style={{ color: "#B09403", fontWeight: "normal" }}>
                      {(
                        (ele.SETTING_TIME / ele.TOTAL_TIME) *
                        100
                      )?.toLocaleString("en-US", {
                        maximumFractionDigits: 1,
                      })}
                      %
                    </td>
                    <td style={{ color: "red", fontWeight: "normal" }}>
                      {((ele.LOSS_TIME / ele.TOTAL_TIME) * 100)?.toLocaleString(
                        "en-US",
                        {
                          maximumFractionDigits: 1,
                        }
                      )}
                      %
                    </td>
                  </tr>
                );
              } else {
                return (
                  <tr key={index}>
                    <td style={{ color: "blue", fontWeight: "bold" }}>
                      {ele.PLAN_FACTORY}
                    </td>
                    <td style={{ color: "#360EEA", fontWeight: "bold" }}>
                      {ele.MACHINE}
                    </td>
                    <td style={{ color: "#360EEA", fontWeight: "bold" }}>
                      {ele.TOTAL_TIME?.toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td style={{ color: "#EA0EBA", fontWeight: "bold" }}>
                      {(ele.RUN_TIME_SX - ele.LOSS_TIME)?.toLocaleString(
                        "en-US",
                        {
                          maximumFractionDigits: 0,
                        }
                      )}
                    </td>
                    <td style={{ color: "#EA0EBA", fontWeight: "bold" }}>
                      {ele.SETTING_TIME?.toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td style={{ color: "#F16E05", fontWeight: "bold" }}>
                      {ele.LOSS_TIME?.toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td style={{ color: "#21C502", fontWeight: "bold" }}>
                      {(
                        ((ele.RUN_TIME_SX + ele.SETTING_TIME - ele.LOSS_TIME) /
                          ele.TOTAL_TIME) *
                        100
                      )?.toLocaleString("en-US", {
                        maximumFractionDigits: 1,
                      })}
                      %
                    </td>
                    <td style={{ color: "#21C502", fontWeight: "bold" }}>
                      {(
                        ((ele.RUN_TIME_SX - ele.LOSS_TIME) / ele.TOTAL_TIME) *
                        100
                      )?.toLocaleString("en-US", {
                        maximumFractionDigits: 1,
                      })}
                      %
                    </td>
                    <td style={{ color: "#B09403", fontWeight: "bold" }}>
                      {(
                        (ele.SETTING_TIME / ele.TOTAL_TIME) *
                        100
                      )?.toLocaleString("en-US", {
                        maximumFractionDigits: 1,
                      })}
                      %
                    </td>
                    <td style={{ color: "red", fontWeight: "bold" }}>
                      {((ele.LOSS_TIME / ele.TOTAL_TIME) * 100)?.toLocaleString(
                        "en-US",
                        {
                          maximumFractionDigits: 1,
                        }
                      )}
                      %
                    </td>
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default PLANRESULT;

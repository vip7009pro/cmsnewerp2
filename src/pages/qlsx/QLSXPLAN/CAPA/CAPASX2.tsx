import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { generalQuery, getGlobalSetting } from "../../../../api/Api";
import {
  Chart,
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
import "./CAPASX.scss";
import CIRCLE_COMPONENT from "./CIRCLE_COMPONENT/CIRCLE_COMPONENT";
import { WEB_SETTING_DATA } from "../../../../api/GlobalInterface";
import AGTable from "../../../../components/DataTable/AGTable";
import { DELIVERY_PLAN_CAPA, EQ_STT, SX_CAPA_DATA } from "../interfaces/khsxInterface";
import { f_handle_loadEQ_STATUS, f_loadcapabydeliveryplan } from "../utils/khsxUtils";
import moment from "moment";
const CAPASX2 = () => {
  const dailytime: number = parseInt(getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'DAILY_TIME')[0]?.CURRENT_VALUE ?? '900');
  const dailytime2: number = dailytime;
  const [eq_status, setEQ_STATUS] = useState<EQ_STT[]>([]);
  const [eq_series, setEQ_SERIES] = useState<string[]>([]);
  const [trigger, setTrigger] = useState(true);
  const [selectedFactory, setSelectedFactory] = useState("NM1");
  const [selectedMachine, setSelectedMachine] = useState("FR");
  const [selectedPlanDate, setSelectedPlanDate] = useState(moment.utc().format("YYYY-MM-DD"));
  const [capadata, setCapaData]= useState<SX_CAPA_DATA[]>([]);
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
  function customizeTooltip(pointInfo: any) {
    return {
      text: `${pointInfo.argumentText}<br/>${Number(
        pointInfo.valueText
      ).toLocaleString("en-US", { maximumFractionDigits: 1 })} days`,
    };
  } 
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
  const getDailyDeliveryPlanCapa = async (PLAN_DATE: string, EQ: string, FACTORY: string) => {
    let kq: DELIVERY_PLAN_CAPA[] = [];
    kq = await f_loadcapabydeliveryplan({
      PLAN_DATE: PLAN_DATE,
      EQ: EQ, 
      FACTORY: FACTORY,
    })
    kq = kq.map((ele: DELIVERY_PLAN_CAPA, index: number) => {
      return {
        ...ele,
        AVL_CAPA: capadata.filter((e: SX_CAPA_DATA, i: number) => e.EQ_SERIES === ele.EQ)[0]?.RETAIN_WF_MIN_CAPA*1300/900,
        REAL_CAPA: capadata.filter((e: SX_CAPA_DATA, i: number) => e.EQ_SERIES === ele.EQ)[0]?.RETAIN_WF_MIN_CAPA,
        id: index,
      }
    })
    setDlLeadTime(kq)
  }
    const handle_loadEQ_STATUS = async () => {
      let eq_data = await f_handle_loadEQ_STATUS();
      setEQ_STATUS(eq_data.EQ_STATUS);
      setEQ_SERIES(eq_data.EQ_SERIES);   
    };
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

  function renderCapaCharts(capaByDeliveryPlan: DELIVERY_PLAN_CAPA[], eq_series: string[]){ 
    return (
      <>
      {
        eq_series.map((eq: string, index:  number)=> {
          return (
            <Chart
                    id='workforcechart'
                    title={`PRODUCTION CAPA BY DELIVERY PLAN [${eq}]`}
                    dataSource={capaByDeliveryPlan.filter(
                      (e: DELIVERY_PLAN_CAPA, index: number) => e.EQ === eq
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
          )
        })
      }
      </>
    )
  }
  useEffect(() => {   
    getCapaData();   
    getDailyDeliveryPlanCapa(selectedPlanDate, selectedMachine, selectedFactory);
    handle_loadEQ_STATUS();    
    return () => {
     
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
      <div className='selectcontrol'>
            Plan Date:
            <input
              type='date'
              value={selectedPlanDate}
              onChange={(e) => {
                setSelectedPlanDate(e.target.value);
                getDailyDeliveryPlanCapa(e.target.value, selectedMachine, selectedFactory);                
              }}
            ></input>
            Factory:
            <select
              name='factory'
              value={selectedFactory}
              onChange={(e) => {
                setSelectedFactory(e.target.value);
                getDailyDeliveryPlanCapa(selectedPlanDate, selectedMachine, e.target.value);
              }}
            >
              <option value='NM1'>NM1</option>
              <option value='NM2'>NM2</option>
            </select>           
          </div>
      {renderCapaCharts(dlleadtime, eq_series)}
    </div>
  );
};
export default CAPASX2;

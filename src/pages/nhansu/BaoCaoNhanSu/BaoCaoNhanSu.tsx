import {
  DataGrid,
  GridSelectionModel,
  GridToolbar,
  GridToolbarContainer,
  GridToolbarExport,
  GridCsvExportOptions,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridRowsProp,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { generalQuery } from "../../../api/Api";
import "./BaoCaoNhanSu.scss";
import Swal from "sweetalert2";
import LinearProgress from "@mui/material/LinearProgress";
import {
  CustomResponsiveContainer,
  SaveExcel,
} from "../../../api/GlobalFunction";
import moment from "moment";
import { elementAcceptingRef } from "@mui/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  ComposedChart,
  ResponsiveContainer,
  Label,
  LabelList,
  PieChart,
  Pie,
  Cell,
  /*   ResponsiveContainer, */
} from "recharts";
import { Grid } from "@mui/material";
import ChartDiemDanhMAINDEPT from "../../../components/Chart/ChartDiemDanhMAINDEPT";
interface DiemDanhNhomData {
  id: string;
  MAINDEPTNAME: string;
  SUBDEPTNAME: string;
  TOTAL_ALL: number;
  TOTAL_ON: number;
  TOTAL_OFF: number;
  TOTAL_CDD: number;
  TOTAL_NM1: number;
  TOTAL_NM2: number;
  ON_NM1: number;
  ON_NM2: number;
  OFF_NM1: number;
  OFF_NM2: number;
  CDD_NM1: number;
  CDD_NM2: number;
}
interface MainDeptData {
  id: number;
  MAINDEPTCODE: number;
  MAINDEPTNAME: string;
  MAINDEPTNAME_KR: string;
}
interface DiemDanhHistoryData {
  id: string;
  APPLY_DATE: string;
  MAINDEPTNAME: string;
  TOTAL: number;
  TOTAL_ON: number;
  TOTAL_OFF: number;
  ON_RATE: number;
}
interface DiemDanhFullData {
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
  WORK_POSITION_NAME: string;
  SUBDEPTNAME: string;
  MAINDEPTNAME: string;
  REQUEST_DATE: string;
  APPLY_DATE: string;
  APPROVAL_STATUS: number;
  OFF_ID: number;
  CA_NGHI: number;
  ON_OFF: number;
  OVERTIME_INFO: string;
  OVERTIME: number;
  REASON_NAME: string;
  REMARK: string;
  XACNHAN: string;
}
interface DIEMDANHMAINDEPT {
  id: number, 
  MAINDEPTNAME: string, 
  COUNT_TOTAL: number,
  COUT_ON: number,
  COUT_OFF: number, 
  COUNT_CDD: number,
  ON_RATE: number
}
const BaoCaoNhanSu = () => {
  const [isLoading, setisLoading] = useState(false);
  const [ddmaindepttb, setddmaindepttb] = useState<Array<DIEMDANHMAINDEPT>>([]);
  const [diemdanhnhomtable, setDiemDanhNhomTable] = useState<
    Array<DiemDanhNhomData>
  >([]);
  const [piechartdata, setPieChartData] = useState<Array<DiemDanhNhomData>>([]);
  const [fromdate, setFromDate] = useState(
    moment().add(-8, "day").format("YYYY-MM-DD")
  );
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [ca, setCa] = useState(6);
  const [nhamay, setNhaMay] = useState(0);
  const [maindeptcode, setmaindeptcode] = useState(0);
  const [maindepttable, setMainDeptTable] = useState<Array<MainDeptData>>([]);
  const [diemdanh_historyTable, setDiemDanh_HistoryTable] = useState<
    Array<DiemDanhHistoryData>
  >([]);
  const [diemdanhFullTable, setDiemDanhFullTable] = useState<
    Array<DiemDanhFullData>
  >([]);
  const column_ddmaindepttb= [
    { field: "MAINDEPTNAME", headerName: "BP Chính", width: 120, renderCell: (params: any) => {
      return (        
        <div className='onoffdiv'>
          <span style={{ fontWeight: "bold", color: "black" }}>
            {params.row.MAINDEPTNAME}
          </span>
        </div>
      );
    }},
    { field: "COUNT_TOTAL", headerName: "Tổng", width: 120, renderCell: (params: any) => {
      return (        
        <div className='onoffdiv'>
          <span style={{ fontWeight: "bold", color: "black" }}>
            {params.row.COUNT_TOTAL}
          </span>
        </div>
      );
    }},
    { field: "COUT_ON", headerName: "Đi làm", width: 120, renderCell: (params: any) => {
      return (        
        <div className='onoffdiv'>
          <span style={{ fontWeight: "bold", color: "black" }}>
            {params.row.COUT_ON}
          </span>
        </div>
      );
    }},
    { field: "COUT_OFF", headerName: "Nghỉ làm", width: 120, renderCell: (params: any) => {
      return (        
        <div className='onoffdiv'>
          <span style={{ fontWeight: "bold", color: "black" }}>
            {params.row.COUT_OFF}
          </span>
        </div>
      );
    }},
    { field: "COUNT_CDD", headerName: "Chưa điểm danh", width: 120, renderCell: (params: any) => {
      return (        
        <div className='onoffdiv'>
          <span style={{ fontWeight: "bold", color: "black" }}>
            {params.row.COUNT_CDD}
          </span>
        </div>
      );
    }},     
    { field: "ON_RATE", headerName: "Tỉ lệ đi làm", width: 120, renderCell: (params: any) => {
      return (
        <div className='onoffdiv'>
          <span style={{ fontWeight: "bold", color: "black" }}>
            {
              params.row.ON_RATE.toLocaleString("en-US", {
              style: "decimal",
              maximumFractionDigits: 2,})} %          
            
          </span>
        </div>)
    }},
       
  ];
  const columns_diemdanhnhom = [
    {
      field: "MAINDEPTNAME",
      headerName: "BP Chính",
      width: 120,
      renderCell: (params: any) => {
        return (
          <div className='onoffdiv'>
            <span style={{ fontWeight: "bold", color: "black" }}>
              {params.row.MAINDEPTNAME}
            </span>
          </div>
        );
      },
    },
    {
      field: "SUBDEPTNAME",
      headerName: "BP Phụ",
      width: 120,
      renderCell: (params: any) => {
        return (
          <div className='onoffdiv'>
            <span style={{ fontWeight: "bold", color: "black" }}>
              {params.row.SUBDEPTNAME}
            </span>
          </div>
        );
      },
    },
    {
      field: "TOTAL_ALL",
      headerName: "Tổng",
      width: 90,
      renderCell: (params: any) => {
        return (
          <div className='onoffdiv'>
            <span style={{ fontWeight: "bold", color: "blue" }}>
              {params.row.TOTAL_ALL}
            </span>
          </div>
        );
      },
    },
    {
      field: "TOTAL_ON",
      headerName: "Đi Làm",
      width: 90,
      renderCell: (params: any) => {
        return (
          <div className='onoffdiv'>
            <span style={{ fontWeight: "bold", color: "green" }}>
              {params.row.TOTAL_ON}
            </span>
          </div>
        );
      },
    },
    {
      field: "TOTAL_OFF",
      headerName: "Nghỉ Làm",
      width: 90,
      renderCell: (params: any) => {
        return (
          <div className='onoffdiv'>
            <span style={{ fontWeight: "bold", color: "red" }}>
              {params.row.TOTAL_OFF}
            </span>
          </div>
        );
      },
    },
    {
      field: "TOTAL_CDD",
      headerName: "Chưa ĐD",
      width: 90,
      renderCell: (params: any) => {
        return (
          <div className='onoffdiv'>
            <span style={{ fontWeight: "bold", color: "black" }}>
              {params.row.TOTAL_CDD}
            </span>
          </div>
        );
      },
    },
    {
      field: "ON_RATE",
      headerName: "TL ĐI LÀM",
      width: 120,
      renderCell: (params: any) => {
        return (
          <div className='onoffdiv'>
            <span style={{ fontWeight: "bold", color: "black" }}>
              {(
                (params.row.TOTAL_ON / params.row.TOTAL_ALL) *
                100
              ).toLocaleString("en-US", {
                style: "decimal",
                maximumFractionDigits: 2,
              })}
              %
            </span>
          </div>
        );
      },
    },
  ];
  const columns_diemdanhfull = [
    {
      field: "APPLY_DATE",
      headerName: "APPLY_DATE",
      width: 120,
      valueGetter: (params: any) => {
        return params.row.APPLY_DATE ? params.row.APPLY_DATE.slice(0, 10) : "";
      },
    },
    {
      field: "ON_OFF",
      headerName: "ON_OFF",
      width: 120,
      renderCell: (params: any) => {
        if (params.row.ON_OFF === 1) {
          return (
            <div className='onoffdiv'>
              <span style={{ fontWeight: "bold", color: "green" }}>Đi làm</span>
            </div>
          );
        } else if (params.row.ON_OFF === 0) {
          return (
            <div className='onoffdiv'>
              <span style={{ fontWeight: "bold", color: "red" }}>Nghỉ làm</span>
            </div>
          );
        }
      },
    },
    {
      field: "PHE_DUYET",
      headerName: "PHE_DUYET",
      width: 120,
      renderCell: (params: any) => {
        if (params.row.APPROVAL_STATUS === 0) {
          return (
            <div className='onoffdiv'>
              <span style={{ fontWeight: "bold", color: "red" }}>Từ chối</span>
            </div>
          );
        } else if (params.row.APPROVAL_STATUS === 1) {
          return (
            <div className='onoffdiv'>
              <span style={{ fontWeight: "bold", color: "green" }}>
                Phê duyệt
              </span>
            </div>
          );
        } else if (params.row.APPROVAL_STATUS === 2) {
          return (
            <div className='onoffdiv'>
              <span style={{ fontWeight: "bold", color: "white" }}>
                Chờ duyệt
              </span>
            </div>
          );
        } else {
          return <div className='onoffdiv'></div>;
        }
      },
    },
    { field: "EMPL_NO", headerName: "EMPL_NO", width: 120 },
    { field: "CMS_ID", headerName: "CMS_ID", width: 120 },
    { field: "MIDLAST_NAME", headerName: "MIDLAST_NAME", width: 170 },
    { field: "FIRST_NAME", headerName: "FIRST_NAME", width: 120 },
    { field: "CA_NGHI", headerName: "CA_NGHI", width: 100 },
    { field: "OVERTIME_INFO", headerName: "OVERTIME_INFO", width: 120 },
    { field: "OVERTIME", headerName: "OVERTIME", width: 100 },
    { field: "REASON_NAME", headerName: "REASON_NAME", width: 120 },
    { field: "REMARK", headerName: "REMARK", width: 170 },
    { field: "XACNHAN", headerName: "XACNHAN", width: 120 },
    { field: "PHONE_NUMBER", headerName: "PHONE_NUMBER", width: 120 },
    { field: "SEX_NAME", headerName: "SEX_NAME", width: 120 },
    { field: "WORK_STATUS_NAME", headerName: "WORK_STATUS_NAME", width: 120 },
    { field: "FACTORY_NAME", headerName: "FACTORY_NAME", width: 120 },
    { field: "JOB_NAME", headerName: "JOB_NAME", width: 120 },
    { field: "WORK_SHIF_NAME", headerName: "WORK_SHIF_NAME", width: 120 },
    {
      field: "WORK_POSITION_NAME",
      headerName: "WORK_POSITION_NAME",
      width: 120,
    },
    { field: "SUBDEPTNAME", headerName: "SUBDEPTNAME", width: 120 },
    { field: "MAINDEPTNAME", headerName: "MAINDEPTNAME", width: 120 },
    {
      field: "REQUEST_DATE",
      headerName: "REQUEST_DATE",
      width: 120,
      valueGetter: (params: any) => {
        return params.row.REQUEST_DATE
          ? params.row.REQUEST_DATE.slice(0, 10)
          : "";
      },
    },
    { field: "OFF_ID", headerName: "OFF_ID", width: 120 },
  ];
  function CustomToolbar3() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarQuickFilter />
        <button
          className='saveexcelbutton'
          onClick={() => {
            SaveExcel(diemdanhFullTable, "DiemdanhHistoryFull");
          }}
        >
          Save Excel
        </button>
      </GridToolbarContainer>
    );
  }

  const addTotal = (tabledata: Array<DiemDanhNhomData>) => {
    var TOTAL_ALL: number = 0;
    var TOTAL_OFF: number = 0;
    var TOTAL_ON: number = 0;
    var TOTAL_CDD: number = 0;
    var TOTAL_NM1: number = 0;
    var TOTAL_NM2: number = 0;
    var ON_NM1: number = 0;
    var ON_NM2: number = 0;
    var OFF_NM1: number = 0;
    var OFF_NM2: number = 0;
    var CDD_NM1: number = 0;
    var CDD_NM2: number = 0;
    for (var i = 0; i < tabledata.length; i++) {
      var obj = tabledata[i];
      TOTAL_ALL += obj.TOTAL_ALL;
      TOTAL_ON += obj.TOTAL_ON;
      TOTAL_OFF += obj.TOTAL_OFF;
      TOTAL_CDD += obj.TOTAL_CDD;
      TOTAL_NM1 += obj.TOTAL_NM1;
      TOTAL_NM2 += obj.TOTAL_NM2;
      ON_NM1 += obj.ON_NM1;
      ON_NM2 += obj.ON_NM2;
      OFF_NM1 += obj.OFF_NM1;
      OFF_NM2 += obj.OFF_NM2;
      CDD_NM1 += obj.CDD_NM1;
      CDD_NM2 += obj.CDD_NM2;
    }
    var grandTotalOBJ: DiemDanhNhomData = {
      id: "GRAND_TOTAL",
      MAINDEPTNAME: "GRAND_TOTAL",
      SUBDEPTNAME: "GRAND_TOTAL",
      TOTAL_ALL: TOTAL_ALL,
      TOTAL_ON: TOTAL_ON,
      TOTAL_OFF: TOTAL_OFF,
      TOTAL_CDD: TOTAL_CDD,
      TOTAL_NM1: TOTAL_NM1,
      TOTAL_NM2: TOTAL_NM2,
      ON_NM1: ON_NM1,
      ON_NM2: ON_NM2,
      OFF_NM1: OFF_NM1,
      OFF_NM2: OFF_NM2,
      CDD_NM1: CDD_NM1,
      CDD_NM2: CDD_NM2,
    };
    tabledata.push(grandTotalOBJ);
    return tabledata;
  };
  
  const handleSearch2 = () => {
    setisLoading(true);
    generalQuery("getmaindeptlist", { from_date: fromdate })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          setMainDeptTable(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    generalQuery("diemdanhsummarynhom", { todate: todate })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          setPieChartData(response.data.data);
          setDiemDanhNhomTable(addTotal(response.data.data));
          setisLoading(false);
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
    generalQuery("diemdanhhistorynhom", {
      start_date: fromdate,
      end_date: todate,
      MAINDEPTCODE: maindeptcode,
      WORK_SHIFT_CODE: ca,
      FACTORY_CODE: nhamay,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const newdiemdanhtb: Array<DiemDanhHistoryData> =
            response.data.data.map((obj: { APPLY_DATE: string | any[] }) => {
              return { ...obj, APPLY_DATE: obj.APPLY_DATE.slice(0, 10) };
            });
          setDiemDanh_HistoryTable(newdiemdanhtb);
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
    generalQuery("diemdanhfull", { from_date: fromdate, to_date: todate })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          setDiemDanhFullTable(response.data.data);
          setisLoading(false);
          Swal.fire(
            "Thông báo",
            "Đã load " + response.data.data.length + " dòng",
            "success"
          );
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
    generalQuery("getddmaindepttb", {})
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let temp_total: DIEMDANHMAINDEPT = {
            id: 1111,
            MAINDEPTNAME: 'TOTAL',
            COUNT_TOTAL:0,
            COUT_ON:0,
            COUT_OFF:0,
            COUNT_CDD:0,
            ON_RATE:0,            
          };

          let loadeddata = response.data.data.map((element: DIEMDANHMAINDEPT, index: number)=> {
            temp_total = {
              ...temp_total,              
              COUNT_TOTAL: temp_total.COUNT_TOTAL + element.COUNT_TOTAL,
              COUT_ON:temp_total.COUT_ON + element.COUT_ON,
              COUT_OFF:temp_total.COUT_OFF + element.COUT_OFF,
              COUNT_CDD:temp_total.COUNT_CDD + element.COUNT_CDD
            };

            return {
              ...element, 
              id: index
            }
          })
          temp_total = {
            ...temp_total,
            ON_RATE: temp_total.COUT_ON/temp_total.COUNT_TOTAL*100
          }
          loadeddata = [...loadeddata,temp_total];
          //console.log(loadeddata);
          setddmaindepttb(loadeddata);
          setisLoading(false);          
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleSearch = () => {
    handleSearch2();
  };
  const COLORS = [
    "#ff8c66",
    "#ffb366",
    "#ffd966",
    "#ffff66",
    "#d9ff66",
    "#b3ff66",
    "#8cff66",
    "#66ff66",
    "#66ff8c",
    "#66ffb3",
    "#66ffd9",
    "#66ffff",
    "#66d9ff",
    "#66b3ff",
    "#668cff",
    "#6666ff",
    "#8c66ff",
    "#b366ff",
    "#d966ff",
    "#ff66ff",
    "#ff66d9",
    "#ff66b3",
    "#ff668c",
    "#ff6666",
  ];
  useEffect(() => {   
    handleSearch2();
  }, []);
  return (
    <div className='baocaonhansu'>
      <div className='baocao1'>
        <h3>Báo cáo nhân sự</h3>
        <div className='filterform'>
          <label>
            <b>Chọn bộ phận:</b>
            <select
              name='bophan'
              value={maindeptcode}
              onChange={(e) => {
                setmaindeptcode(Number(e.target.value));
              }}
            >
              <option value={0}>Tất cả</option>
              {maindepttable.map((element, index) => (
                <option key={index} value={element.MAINDEPTCODE}>
                  {element.MAINDEPTNAME}
                </option>
              ))}
            </select>
          </label>
          <label>
            <b>Chọn nhà máy:</b>
            <select
              name='nhamay'
              value={nhamay}
              onChange={(e) => {
                setNhaMay(Number(e.target.value));
              }}
            >
              <option value={0}>Tất cả</option>
              <option value={1}>Nhà máy 1</option>
              <option value={2}>Nhà máy 2</option>
            </select>
          </label>
          <label>
            <b>Chọn ca:</b>
            <select
              name='ca'
              value={ca}
              onChange={(e) => {
                setCa(Number(e.target.value));
              }}
            >
              <option value={6}>Tất cả</option>
              <option value={1}>Ca 1</option>
              <option value={2}>Ca 2</option>
              <option value={3}>Hành chính</option>
              <option value={4}>Ca 1 + Hành Chính</option>
              <option value={5}>Ca 2 + Hành Chính</option>
            </select>
          </label>
          <label>
            <b>From:</b>
            <input
              type='date'
              value={fromdate.slice(0, 10)}
              onChange={(e) => setFromDate(e.target.value)}
            ></input>
          </label>
          <label>
            <b>To:</b>
            <input
              type='date'
              value={todate.slice(0, 10)}
              onChange={(e) => setToDate(e.target.value)}
            ></input>
          </label>
          <button
            className='searchbutton'
            onClick={() => {
              handleSearch();
            }}
          >
            Search
          </button>
        </div>
        <h3>Biểu đồ trending tình hình đi làm</h3>
        <div className='diemdanhhistorychart'>
          <CustomResponsiveContainer>
            <ComposedChart
              width={500}
              height={300}
              data={diemdanh_historyTable}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray='3 3' className='chartGrid' />
              <XAxis dataKey='APPLY_DATE'>
                {" "}
                <Label value='Ngày tháng' offset={0} position='insideBottom' />
              </XAxis>
              <YAxis
                yAxisId='left-axis'
                label={{
                  value: "Số lượng đi làm",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <YAxis
                orientation='right'
                yAxisId='right-axis'
                label={{
                  value: "Tỉ lệ đi làm",
                  angle: -90,
                  position: "outsideRight",
                }}
              />
              <Tooltip />
              <Legend />
              <Bar
                yAxisId='left-axis'
                dataKey='TOTAL_ON'
                stackId='a'
                fill='#8884d8'
              >
                <LabelList dataKey='TOTAL_ON' position='inside' />
              </Bar>
              <Bar
                yAxisId='left-axis'
                dataKey='TOTAL_OFF'
                stackId='a'
                fill='#82ca9d'
              >
                <LabelList dataKey='TOTAL_OFF' position='inside' />
              </Bar>
              <Line
                yAxisId='right-axis'
                type='monotone'
                dataKey='ON_RATE'
                stroke='#FF0000'
                activeDot={{ r: 8 }}
              ></Line>
            </ComposedChart>
          </CustomResponsiveContainer>
        </div>
        <h3>Nhân lực điểm danh trong ngày theo bộ phận chính</h3>
        <div className='maindept_tableOK'>
          <div className='tiledilamtable'>
            <DataGrid
              components={{
                LoadingOverlay: LinearProgress,
              }}
              style={{ padding: "20px" }}
              loading={isLoading}
              rows={ddmaindepttb}
              rowHeight={30}
              columns={column_ddmaindepttb}             
              hideFooterPagination
              hideFooter
            />
          </div>
          <div className='titrongphongbangraph'>
            <CustomResponsiveContainer>
             <ChartDiemDanhMAINDEPT/>
            </CustomResponsiveContainer>
          </div>
        </div>
        <h3>Nhân lực điểm danh trong ngày theo bộ phận phụ</h3>
        <div className='maindept_table'>
          <div className='tiledilamtable'>
            <DataGrid
              components={{
                LoadingOverlay: LinearProgress,
              }}
              style={{ padding: "20px" }}
              loading={isLoading}
              rows={diemdanhnhomtable}
              columns={columns_diemdanhnhom}
              getRowHeight={() => "auto"}
              hideFooterPagination
              hideFooter
            />
          </div>
          <div className='titrongphongbangraph'>
            <CustomResponsiveContainer>
              <PieChart width={500} height={500}>
                <Legend />
                <Tooltip />
                {piechartdata && (
                  <Pie
                    data={piechartdata.slice(0, piechartdata.length - 1)}
                    isAnimationActive={false}
                    cx='50%'
                    cy='50%'
                    outerRadius={80}
                    fill='#80bfff'
                    dataKey='TOTAL_ALL'
                    nameKey='SUBDEPTNAME'
                    paddingAngle={5}
                    label
                    labelLine={true}
                  >
                    {piechartdata.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                )}
              </PieChart>
            </CustomResponsiveContainer>
          </div>
        </div>
        <h3>Lịch sử đi làm full info</h3>
        <div className='maindept_table'>
          <DataGrid
            components={{
              Toolbar: CustomToolbar3,
              LoadingOverlay: LinearProgress,
            }}
            style={{ padding: "20px" }}
            loading={isLoading}
            rowHeight={35}
            rows={diemdanhFullTable}
            columns={columns_diemdanhfull}
            rowsPerPageOptions={[5, 10, 30, 50, 100, 500, 1000, 5000, 10000]}
            editMode='row'
            getRowHeight={() => "auto"}
          />
        </div>
      </div>
    </div>
  );
};
export default BaoCaoNhanSu;

import {
  Autocomplete,
  IconButton,
  LinearProgress,
  TextField,
} from "@mui/material";
import {
  DataGrid,
  GridCallbackDetails,
  GridCellEditCommitParams,
  GridSelectionModel,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
  MuiBaseEvent,
  MuiEvent,
} from "@mui/x-data-grid";
import moment from "moment";
import React, { useContext, useEffect, useState, useTransition } from "react";
import {
  AiFillFileExcel,
  AiOutlineCloudUpload,
  AiOutlinePrinter,
} from "react-icons/ai";
import Swal from "sweetalert2";
import { generalQuery } from "../../../../api/Api";
import { UserContext } from "../../../../api/Context";
import { checkBP, SaveExcel } from "../../../../api/GlobalFunction";
import "./PLAN_DATATB.scss";
import { UserData } from "../../../../redux/slices/globalSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
interface QLSXPLANDATA {
  id: number;
  PLAN_ID: string;
  PLAN_DATE: string;
  PROD_REQUEST_NO: string;
  PLAN_QTY: number;
  PLAN_EQ: string;
  PLAN_FACTORY: string;
  PLAN_LEADTIME: number;
  INS_EMPL: string;
  INS_DATE: string;
  UPD_EMPL: string;
  UPD_DATE: string;
  G_CODE: string;
  G_NAME: string;
  G_NAME_KD: string;
  PROD_REQUEST_DATE: string;
  PROD_REQUEST_QTY: number;
  STEP: number;
  PLAN_ORDER: string;
  PROCESS_NUMBER: number;
  KQ_SX_TAM: number;
  KETQUASX: number;
  ACHIVEMENT_RATE: number,
  CD1: number;
  CD2: number;
  CD3: number;
  CD4: number;
  TON_CD1: number;
  TON_CD2: number;
  TON_CD3: number;
  TON_CD4: number;
  FACTORY: string;
  EQ1: string;
  EQ2: string;
  EQ3: string;
  EQ4: string;
  Setting1: number;
  Setting2: number;
  Setting3: number;
  Setting4: number;
  UPH1: number;
  UPH2: number;
  UPH3: number;
  UPH4: number;
  Step1: number;
  Step2: number;
  Step3: number;
  Step4: number;
  LOSS_SX1: number;
  LOSS_SX2: number;
  LOSS_SX3: number;
  LOSS_SX4: number;
  LOSS_SETTING1: number;
  LOSS_SETTING2: number;
  LOSS_SETTING3: number;
  LOSS_SETTING4: number;
  NOTE: string;
  NEXT_PLAN_ID: string;
  XUATDAOFILM?: string;
  EQ_STATUS?: string;
  MAIN_MATERIAL?: string;
  INT_TEM?: string;
  CHOTBC?: string;
  DKXL?: string;
  OLD_PLAN_QTY?: number;
}
const PLAN_DATATB = () => {
  const [selectionModel_INPUTSX, setSelectionModel_INPUTSX] = useState<any>([]);
  const [readyRender, setReadyRender] = useState(false);
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );
  const [isLoading, setisLoading] = useState(false);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [factory, setFactory] = useState("ALL");
  const [machine, setMachine] = useState("ALL");
  const [plandatatable, setPlanDataTable] = useState<QLSXPLANDATA[]>([]);
  const [summarydata, setSummaryData]= useState<QLSXPLANDATA>({
    id: -1,
  PLAN_ID: '',
  PLAN_DATE: '',
  PROD_REQUEST_NO: '',
  PLAN_QTY: 0,
  PLAN_EQ: '',
  PLAN_FACTORY: '',
  PLAN_LEADTIME: 0,
  INS_EMPL: '',
  INS_DATE: '',
  UPD_EMPL: '',
  UPD_DATE: '',
  G_CODE: '',
  G_NAME: '',
  G_NAME_KD: '',
  PROD_REQUEST_DATE: '',
  PROD_REQUEST_QTY: 0,
  STEP: 0,
  PLAN_ORDER: '',
  PROCESS_NUMBER: 0,
  KQ_SX_TAM: 0,
  KETQUASX: 0,
  ACHIVEMENT_RATE: 0,
  CD1: 0,
  CD2: 0,
  TON_CD1: 0,
  TON_CD2: 0,
  FACTORY: '',
  EQ1: '',
  EQ2: '',
  Setting1: 0,
  Setting2: 0,
  UPH1: 0,
  UPH2: 0,
  Step1: 0,
  Step2: 0,
  LOSS_SX1: 0,
  LOSS_SX2: 0,
  LOSS_SETTING1: 0,
  LOSS_SETTING2: 0,
  NOTE: '',
  XUATDAOFILM: '',
  EQ_STATUS: '',
  MAIN_MATERIAL: '',
  INT_TEM: '',
  CHOTBC: '',
  DKXL: '',
  NEXT_PLAN_ID: '',
  CD3:0,
  CD4:0,
  EQ3:'',
  EQ4:'',
  LOSS_SETTING3:0,
  LOSS_SETTING4:0,
  LOSS_SX3:0,
  LOSS_SX4:0,
  Setting3:0,
  Setting4:0,
  Step3:0,
  Step4:0,
  TON_CD3:0,
  TON_CD4:0,
  UPH3:0,
  UPH4:0,
  OLD_PLAN_QTY:0,
  });
  const [qlsxplandatafilter, setQlsxPlanDataFilter] = useState<
    Array<QLSXPLANDATA>
  >([]);
  const column_plandatatable = [
    {
      field: "PLAN_FACTORY",
      headerName: "FACTORY",
      width: 80,
      editable: false,
    },
    {
      field: "PLAN_DATE",
      headerName: "PLAN_DATE",
      width: 110,
      editable: false,
    },   
    {
      field: "PLAN_ID",
      headerName: "PLAN_ID",
      width: 90,
      editable: false,
      resizeable: true,
    },   
    {
      field: "G_NAME",
      headerName: "G_NAME",
      width: 200,
      editable: false,
      resizeable: true,
    },   
    {
      field: "G_NAME_KD",
      headerName: "G_NAME_KD",
      width: 180,
      editable: false,
      renderCell: (params: any) => {
        if (
          params.row.FACTORY === null ||
          params.row.EQ1 === null ||
          params.row.EQ2 === null ||
          params.row.Setting1 === null ||
          params.row.Setting2 === null ||
          params.row.UPH1 === null ||
          params.row.UPH2 === null ||
          params.row.Step1 === null ||
          params.row.Step1 === null ||
          params.row.LOSS_SX1 === null ||
          params.row.LOSS_SX2 === null ||
          params.row.LOSS_SETTING1 === null ||
          params.row.LOSS_SETTING2 === null
        )
          return <span style={{ color: "red" }}>{params.row.G_NAME_KD}</span>;
        return <span style={{ color: "green" }}>{params.row.G_NAME_KD}</span>;
      },
    },    
    {
      field: "PLAN_QTY",
      headerName: "PLAN_QTY",
      width: 80,
      renderCell: (params: any) => {
        if (params.row.PLAN_QTY === 0) {
          return <span style={{ color: "red", fontWeight:'bold' }}>NG</span>;
        } else {
          return (
            <span style={{ color: "green",  fontWeight:'bold' }}>
              {params.row.PLAN_QTY.toLocaleString("en", "US")}
            </span>
          );
        }
      },
    },    
    {
      field: "KETQUASX",
      headerName: "RESULT_QTY",
      width: 110,
      renderCell: (params: any) => {
        if (params.row.KETQUASX !== null) {
          return <span style={{color:'blue', fontWeight:'bold'}}>{params.row.KETQUASX.toLocaleString("en-US")}</span>;
        } else {
          return <span>0</span>;
        }
      },
    },
    {
      field: "ACHIVEMENT_RATE",
      headerName: "ACHIVEMENT_RATE",
      width: 150,
      renderCell: (params: any) => {
        if (params.row.ACHIVEMENT_RATE !== undefined) {
          if(params.row.ACHIVEMENT_RATE === 100)
          {
            return <span style={{color:'green', fontWeight:'bold'}}>{params.row.ACHIVEMENT_RATE.toLocaleString("en-US",{ maximumFractionDigits: 0,})}%</span>;
          }
          else
          {
            return <span style={{color:'red', fontWeight:'bold'}}>{params.row.ACHIVEMENT_RATE.toLocaleString("en-US",{ maximumFractionDigits: 0,})}%</span>;
          }
        } else {
          return <span>0</span>;
        }
      },
    },
    { field: "PLAN_EQ", headerName: "PLAN_EQ", width: 80 },
    {
      field: "EQ_STATUS",
      headerName: "Trạng thái",
      width: 100,
      renderCell: (params: any) => {
        if (params.row.EQ_STATUS === "KTST-KSX") {
          return <span style={{ color: "green" }}>KTST-KSX</span>;
        } else if (params.row.EQ_STATUS === "Đang setting") {
          return <span style={{ color: "yellow" }}>Đang Setting</span>;
        } else if (params.row.EQ_STATUS === "Đang Run") {
          return <span style={{ color: "blue" }}>Đang Run</span>;
        } else if (params.row.EQ_STATUS === "Chạy xong") {
          return <span style={{ color: "green" }}>Chạy xong</span>;
        } else {
          return <span style={{ color: "red" }}>Chưa chạy</span>;
        }
      },
    },
    { field: "XUATDAOFILM", headerName: "Xuất Dao", width: 80 },
    { field: "DKXL", headerName: "ĐK Xuất liệu", width: 80 },
    { field: "MAIN_MATERIAL", headerName: "Xuất liệu", width: 80 },
    { field: "CHOTBC", headerName: "Chốt báo cáo", width: 80 },
    {
      field: "INS_EMPL",
      headerName: "INS_EMPL",
      width: 120,
      editable: false,
      hide: false,
    },
    {
      field: "INS_DATE",
      headerName: "INS_DATE",
      width: 120,
      editable: false,
      hide: true,
    },
    {
      field: "UPD_EMPL",
      headerName: "UPD_EMPL",
      width: 120,
      editable: false,
      hide: true,
    },
    {
      field: "UPD_DATE",
      headerName: "UPD_DATE",
      width: 120,
      editable: false,
      hide: true,
    },
    {
      field: "PROD_REQUEST_NO",
      headerName: "YCSX NO",
      width: 80,
      editable: false,
    },
    {
      field: "PROD_REQUEST_DATE",
      headerName: "YCSX DATE",
      width: 80,
      editable: false,
    },
    { field: "G_CODE", headerName: "G_CODE", width: 100, editable: false },
    {
      field: "PROD_REQUEST_QTY",
      headerName: "YCSX QTY",
      width: 80,
      editable: false,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.row.PROD_REQUEST_QTY.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    { field: "EQ1", headerName: "EQ1", width: 30, editable: false },
    { field: "EQ2", headerName: "EQ2", width: 30, editable: false },
    {
      field: "CD1",
      headerName: "KQ_CD1",
      width: 80,
      editable: false,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.row.CD1.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "CD2",
      headerName: "KQ_CD2",
      width: 80,
      editable: false,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.row.CD2.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "TON_CD1",
      headerName: "TONYCSX_CD1",
      width: 120,
      editable: false,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.row.TON_CD1.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "TON_CD2",
      headerName: "TONYCSX_CD2",
      width: 120,
      editable: false,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.row.TON_CD2.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "PROCESS_NUMBER",
      headerName: "PROCESS_NUMBER",
      width: 110,
      renderCell: (params: any) => {
        if (
          params.row.PROCESS_NUMBER === null ||
          params.row.PROCESS_NUMBER === 0
        ) {
          return <span style={{ color: "red" }}>NG</span>;
        } else {
          return (
            <span style={{ color: "green" }}>{params.row.PROCESS_NUMBER}</span>
          );
        }
      },
    },
    { field: "STEP", headerName: "STEP", width: 60 },
    { field: "PLAN_ORDER", headerName: "PLAN_ORDER", width: 110 },
  ];
  function CustomToolbarLICHSUINPUTSX() {
    return (
      <GridToolbarContainer>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            SaveExcel(plandatatable, "PLAN Table");
          }}
        >
          <AiFillFileExcel color='green' size={25} />
          SAVE
        </IconButton>
        <GridToolbarQuickFilter />
        <div className='div' style={{ fontSize: 20, fontWeight: "bold" }}>
          BẢNG PLAN THEO NGÀY
        </div>
      </GridToolbarContainer>
    );
  }
  const loadQLSXPlan = (plan_date: string) => {
    //console.log(selectedPlanDate);
    generalQuery("getqlsxplan2", {
      PLAN_DATE: plan_date,
      MACHINE: machine,
      FACTORY: factory,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: QLSXPLANDATA, index: number) => {
              return {
                ...element,
                PLAN_DATE: moment.utc(element.PLAN_DATE).format("YYYY-MM-DD"),
                EQ_STATUS:
                  element.EQ_STATUS === "B"
                    ? "Đang setting"
                    : element.EQ_STATUS === "M"
                    ? "Đang Run"
                    : element.EQ_STATUS === "K"
                    ? "Chạy xong"
                    : element.EQ_STATUS === "K"
                    ? "KTST-KSX"
                    : "Chưa chạy",
                  ACHIVEMENT_RATE: element.KETQUASX/element.PLAN_QTY*100,
                id: index,
              };
            }
          );
          //console.log(loadeddata);
          let temp_plan_data: QLSXPLANDATA= {
            id: -1,
            PLAN_ID: '',
            PLAN_DATE: '',
            PROD_REQUEST_NO: '',
            PLAN_QTY: 0,
            PLAN_EQ: '',
            PLAN_FACTORY: '',
            PLAN_LEADTIME: 0,
            INS_EMPL: '',
            INS_DATE: '',
            UPD_EMPL: '',
            UPD_DATE: '',
            G_CODE: '',
            G_NAME: '',
            G_NAME_KD: '',
            PROD_REQUEST_DATE: '',
            PROD_REQUEST_QTY: 0,
            STEP: 0,
            PLAN_ORDER: '',
            PROCESS_NUMBER: 0,
            KQ_SX_TAM: 0,
            KETQUASX: 0,
            ACHIVEMENT_RATE: 0,
            CD1: 0,
            CD2: 0,
            TON_CD1: 0,
            TON_CD2: 0,
            FACTORY: '',
            EQ1: '',
            EQ2: '',
            Setting1: 0,
            Setting2: 0,
            UPH1: 0,
            UPH2: 0,
            Step1: 0,
            Step2: 0,
            LOSS_SX1: 0,
            LOSS_SX2: 0,
            LOSS_SETTING1: 0,
            LOSS_SETTING2: 0,
            NOTE: '',
            XUATDAOFILM: '',
            EQ_STATUS: '',
            MAIN_MATERIAL: '',
            INT_TEM: '',
            CHOTBC: '',
            DKXL: '',
            NEXT_PLAN_ID: '',
            CD3:0,
            CD4:0,
            EQ3:'',
            EQ4:'',
            LOSS_SETTING3:0,
            LOSS_SETTING4:0,
            LOSS_SX3:0,
            LOSS_SX4:0,
            Setting3:0,
            Setting4:0,
            Step3:0,
            Step4:0,
            TON_CD3:0,
            TON_CD4:0,
            UPH3:0,
            UPH4:0,
            OLD_PLAN_QTY:0,
          }
          for(let i=0;i<loadeddata.length;i++)
          {
            temp_plan_data.PLAN_QTY += loadeddata[i].PLAN_QTY;
            temp_plan_data.KETQUASX += loadeddata[i].KETQUASX;
            
          }
          temp_plan_data.ACHIVEMENT_RATE = temp_plan_data.KETQUASX/temp_plan_data.PLAN_QTY*100;
          setSummaryData(temp_plan_data);          
          setPlanDataTable(loadeddata);
          setReadyRender(true);
          setisLoading(false);
          Swal.fire(
            "Thông báo",
            "Đã load: " + response.data.data.length + " dòng",
            "success"
          );
        } else {
          setPlanDataTable([]);
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_movePlan = async () => {
    if (qlsxplandatafilter.length > 0) {
      let err_code: string = "0";
      for (let i = 0; i < qlsxplandatafilter.length; i++) {
        let checkplansetting: boolean = false;
        await generalQuery("checkplansetting", {
          PLAN_ID: qlsxplandatafilter[i].PLAN_ID,
        })
          .then((response) => {
            //console.log(response.data);
            if (response.data.tk_status !== "NG") {
              checkplansetting = true;
            } else {
              checkplansetting = false;
            }
          })
          .catch((error) => {
            console.log(error);
          });
        if (!checkplansetting) {
          generalQuery("move_plan", {
            PLAN_ID: qlsxplandatafilter[i].PLAN_ID,
            PLAN_DATE: todate,
          })
            .then((response) => {
              //console.log(response.data.data);
              if (response.data.tk_status !== "NG") {
              } else {
                err_code += "Lỗi: " + response.data.message + "\n";
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          err_code +=
            "Lỗi: PLAN_ID " +
            qlsxplandatafilter[i].PLAN_ID +
            " đã setting nên không di chuyển được sang ngày khác, phải chốt";
        }
      }
      if (err_code !== "0") {
        Swal.fire("Thông báo", "Lỗi: " + err_code, "error");
      }
      loadQLSXPlan(fromdate);
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất một chỉ thị để di chuyển", "error");
    }
  };
  const handleConfirmMovePlan = () => {
    Swal.fire({
      title: "Chắc chắn muốn chuyển ngày cho plan đã chọn ?",
      text: "Sẽ bắt đầu chuyển ngày đã chọn",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn chuyển!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành chuyển ngày PLAN", "Đang ngày plan", "success");
       /*  checkBP(
          userData?.EMPL_NO,
          userData?.MAINDEPTNAME,
          ["QLSX"],
          handle_movePlan
        ); */
        checkBP(userData,['QLSX'],['ALL'],['ALL'],handle_movePlan);
        //handle_movePlan();
      }
    });
  };
  const handleQLSXPlanDataSelectionforUpdate = (ids: GridSelectionModel) => {
    const selectedID = new Set(ids);
    let datafilter = plandatatable.filter((element: any) =>
      selectedID.has(element.PLAN_ID)
    );
    //console.log(datafilter);
    if (datafilter.length > 0) {
      setQlsxPlanDataFilter(datafilter);
    } else {
      setQlsxPlanDataFilter([]);
      //console.log("xoa filter");
    }
  };
  useEffect(() => {
    //setColumnDefinition(column_inspect_output);
  }, []);
  return (
    <div className='lichsuplanTable'>
      <div className='tracuuDataInspection'>
        <div className='tracuuDataInspectionform'>
          <div className='forminput'>
            <div className='forminputcolumn'>
              <label>
                <b>PLAN DATE</b>
                <input
                  type='date'
                  value={fromdate.slice(0, 10)}
                  onChange={(e) => setFromDate(e.target.value)}
                ></input>
              </label>
              <label>
                <b>FACTORY:</b>
                <select
                  name='phanloai'
                  value={factory}
                  onChange={(e) => {
                    setFactory(e.target.value);
                  }}
                >
                  <option value='ALL'>ALL</option>
                  <option value='NM1'>NM1</option>
                  <option value='NM2'>NM2</option>
                </select>
              </label>
            </div>
            <div className='forminputcolumn'>
              <label>
                <b>MACHINE:</b>
                <select
                  name='machine'
                  value={machine}
                  onChange={(e) => {
                    setMachine(e.target.value);
                  }}
                >
                  <option value='ALL'>ALL</option>
                  <option value='FR'>FR</option>
                  <option value='SR'>SR</option>
                  <option value='DC'>DC</option>
                  <option value='ED'>ED</option>
                </select>
              </label>
              <label>
                <b>MOVE TO DATE</b>
                <input
                  type='date'
                  value={todate.slice(0, 10)}
                  onChange={(e) => setToDate(e.target.value)}
                ></input>
              </label>
            </div>
            <div className='forminputcolumn'>
              <button
                className='tranhatky'
                onClick={() => {
                  handleConfirmMovePlan();
                }}
              >
                MOVE PLAN
              </button>
              <button
                className='tranhatky'
                onClick={() => {
                  setisLoading(true);
                  setReadyRender(false);
                  loadQLSXPlan(fromdate);
                }}
              >
                Tra PLAN
              </button>
            </div>
          </div>
          <div className='lossinfo'>
          <table>
          <thead>
            <tr>
              <th style={{ color: "black", fontWeight: "normal" }}>
                FACTORY
              </th>             
              <th style={{ color: "black", fontWeight: "normal" }}>
                MACHINE
              </th>
              <th style={{ color: "black", fontWeight: "normal" }}>
                TOTAL PLAN
              </th>
              <th style={{ color: "black", fontWeight: "normal" }}>
                TOTAL RESULT
              </th>
              <th style={{ color: "black", fontWeight: "normal" }}>
                ACHIVEMENT RATE
              </th>             
            </tr>
          </thead>
          <tbody>
            
                  <tr>
                    <td style={{ color: "blue", fontWeight: "bold" }}>
                      {factory}
                    </td>
                    <td style={{ color: "#360EEA", fontWeight: "bold" }}>
                      {machine}
                    </td>
                    <td style={{ color: "#360EEA", fontWeight: "bold" }}>
                      {summarydata.PLAN_QTY?.toLocaleString('en-US',{maximumFractionDigits:0})}
                    </td>
                    <td style={{ color: "green", fontWeight: "bold" }}>
                      {summarydata.KETQUASX?.toLocaleString('en-US',{maximumFractionDigits:0})}
                    </td>
                    <td style={{ color: "#EA0EBA", fontWeight: "bold" }}>
                      {summarydata.ACHIVEMENT_RATE?.toLocaleString('en-US',{maximumFractionDigits:0})}%
                    </td>
                  </tr>
               
              
            
          </tbody>
        </table>

          </div>
        </div>
        <div className='tracuuYCSXTable'>
          {readyRender && (
            <DataGrid
              sx={{ fontSize: 12, flex: 1 }}
              components={{
                Toolbar: CustomToolbarLICHSUINPUTSX,
                LoadingOverlay: LinearProgress,
              }}
              loading={isLoading}
              rowHeight={30}
              rows={plandatatable}
              columns={column_plandatatable}
              rowsPerPageOptions={[
                5, 10, 50, 100, 500, 1000, 5000, 10000, 500000,
              ]}
              disableSelectionOnClick
              checkboxSelection
              editMode='cell'
              getRowId={(row) => row.PLAN_ID}
              onSelectionModelChange={(ids) => {
                handleQLSXPlanDataSelectionforUpdate(ids);
              }}
              onCellEditCommit={(
                params: GridCellEditCommitParams,
                event: MuiEvent<MuiBaseEvent>,
                details: GridCallbackDetails
              ) => {
                const keyvar = params.field;
                const newdata = plandatatable.map((p) =>
                  p.id === params.id ? { ...p, [keyvar]: params.value } : p
                );
                setPlanDataTable(newdata);
                //console.log(plandatatable);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default PLAN_DATATB;

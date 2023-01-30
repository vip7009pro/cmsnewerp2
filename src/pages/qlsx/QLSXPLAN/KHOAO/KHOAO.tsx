/* eslint-disable no-loop-func */
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

import "./KHOAO.scss";

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
  STEP: string;
  PLAN_ORDER: string;
  PROCESS_NUMBER: number;
  KQ_SX_TAM: number;
  KETQUASX: number;
  CD1: number;
  CD2: number;
  TON_CD1: number;
  TON_CD2: number;
  FACTORY: string;
  EQ1: string;
  EQ2: string;
  Setting1: number;
  Setting2: number;
  UPH1: number;
  UPH2: number;
  Step1: number;
  Step2: number;
  LOSS_SX1: number;
  LOSS_SX2: number;
  LOSS_SETTING1: number;
  LOSS_SETTING2: number;
  NOTE: string;
}
interface TONLIEUXUONG {
  id: number;
  FACTORY: string;
  PHANLOAI: string;
  PLAN_ID_INPUT: string;
  M_CODE: string;
  M_NAME: string;
  WIDTH_CD: number;
  M_LOT_NO: string;
  ROLL_QTY: number;
  IN_QTY: number;
  TOTAL_IN_QTY: number;
}
interface LICHSUNHAPKHOAO {
  id: string;
  FACTORY: string;
  PHANLOAI: string;
  M_CODE: string;
  M_NAME: string;
  WIDTH_CD: number;
  M_LOT_NO: string;
  PLAN_ID_INPUT: string;
  ROLL_QTY: number;
  IN_QTY: number;
  TOTAL_IN_QTY: number;
  INS_DATE: string;
}
interface LICHSUXUATKHOAO {
  id: string;
  FACTORY: string;
  PHANLOAI: string;
  M_CODE: string;
  M_NAME: string;
  WIDTH_CD: number;
  M_LOT_NO: string;
  PLAN_ID_INPUT: string;
  PLAN_ID_OUTPUT: string;
  ROLL_QTY: number;
  OUT_QTY: number;
  TOTAL_OUT_QTY: number;
  INS_DATE: string;
}
const KHOAO = ({NEXT_PLAN}:{NEXT_PLAN?:string}) => {
  const [selectionModel_INPUTSX, setSelectionModel_INPUTSX] = useState<any>([]);
  const [readyRender, setReadyRender] = useState(false);
  const [userData, setUserData] = useContext(UserContext);
  const [isLoading, setisLoading] = useState(false);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [factory, setFactory] = useState("ALL");
  const [machine, setMachine] = useState("ALL");
  const [plandatatable, setPlanDataTable] = useState<QLSXPLANDATA[]>([]);
  const [datatable, setDataTable] = useState<any[]>([]);
  const [current_Column, setCurrent_Column] = useState<any[]>([]);
  const [qlsxplandatafilter, setQlsxPlanDataFilter] = useState<
    Array<QLSXPLANDATA>
  >([]);
  const [tonkhoaodatafilter, setTonKhoAoDataFilter] = useState<
    Array<TONLIEUXUONG>
  >([]);
  const [nextPlan, setNextPlan]= useState(NEXT_PLAN);
  const [tonkhoaotable, setTonKhoAoTable] = useState<Array<TONLIEUXUONG>>([]);
  const [lichsunhapkhoao, setLichSuNhapKhoAo] = useState<
    Array<LICHSUNHAPKHOAO>
  >([]);
  const [lichsuxuatkhoao, setLichSuXuatKhoAo] = useState<
    Array<LICHSUXUATKHOAO>
  >([]);
  const [tableTitle, setTableTitle] = useState("");

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
    {
      field: "PLAN_ID",
      headerName: "PLAN_ID",
      width: 90,
      editable: false,
      resizeable: true,
    },
    { field: "G_CODE", headerName: "G_CODE", width: 100, editable: false },
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
      field: "PLAN_QTY",
      headerName: "PLAN_QTY",
      width: 80,
      renderCell: (params: any) => {
        if (params.row.PLAN_QTY === 0) {
          return <span style={{ color: "red" }}>NG</span>;
        } else {
          return (
            <span style={{ color: "green" }}>
              {params.row.PLAN_QTY.toLocaleString("en", "US")}
            </span>
          );
        }
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
    {
      field: "KETQUASX",
      headerName: "KETQUASX",
      width: 110,
      renderCell: (params: any) => {
        if (params.row.KETQUASX !== null) {
          return <span>{params.row.KETQUASX.toLocaleString("en-US")}</span>;
        } else {
          return <span>0</span>;
        }
      },
    },
    {
      field: "KQ_SX_TAM",
      headerName: "KETQUASX_TAM",
      width: 120,
      renderCell: (params: any) => {
        if (params.row.KQ_SX_TAM !== null) {
          return <span>{params.row.KQ_SX_TAM.toLocaleString("en-US")}</span>;
        } else {
          return <span>0</span>;
        }
      },
    },
    { field: "PLAN_EQ", headerName: "PLAN_EQ", width: 80 },

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
  ];

  const column_nhapkhoaotable = [
    { field: "FACTORY", headerName: "FACTORY", width: 80 },
    { field: "PHANLOAI", headerName: "PHANLOAI", width: 80 },
    { field: "M_CODE", headerName: "M_CODE", width: 80 },
    { field: "M_NAME", headerName: "M_NAME", width: 150 },
    { field: "WIDTH_CD", headerName: "WIDTH_CD", width: 80 },
    { field: "M_LOT_NO", headerName: "M_LOT_NO", width: 120 },
    { field: "PLAN_ID_INPUT", headerName: "PLAN_ID_INPUT", width: 120 },
    { field: "ROLL_QTY", headerName: "ROLL_QTY", width: 80 },
    { field: "IN_QTY", headerName: "IN_QTY", width: 80 },
    { field: "TOTAL_IN_QTY", headerName: "TOTAL_IN_QTY", width: 120 },
    { field: "INS_DATE", headerName: "INS_DATE", width: 150 },
  ];
  const column_xuatkhoaotable = [
    { field: "FACTORY", headerName: "FACTORY", width: 80 },
    { field: "PHANLOAI", headerName: "PHANLOAI", width: 80 },
    { field: "M_CODE", headerName: "M_CODE", width: 80 },
    { field: "M_NAME", headerName: "M_NAME", width: 150 },
    { field: "WIDTH_CD", headerName: "WIDTH_CD", width: 80 },
    { field: "M_LOT_NO", headerName: "M_LOT_NO", width: 120 },
    { field: "PLAN_ID_INPUT", headerName: "PLAN_ID_INPUT", width: 120 },
    { field: "PLAN_ID_OUTPUT", headerName: "PLAN_ID_OUTPUT", width: 120 },
    { field: "ROLL_QTY", headerName: "ROLL_QTY", width: 80 },
    { field: "OUT_QTY", headerName: "OUT_QTY", width: 80 },
    { field: "TOTAL_OUT_QTY", headerName: "TOTAL_OUT_QTY", width: 80 },
    { field: "INS_DATE", headerName: "INS_DATE", width: 150 },
  ];
  const column_tonkhoaotable = [
    { field: "FACTORY", headerName: "NM", width: 40, editable: false },
    {
      field: "PLAN_ID_INPUT",
      headerName: "PLAN_ID",
      width: 80,
      editable: false,
    },
    { field: "PHANLOAI", headerName: "PL", width: 40, editable: false },
    { field: "M_CODE", headerName: "M_CODE", width: 80, editable: false },
    {
      field: "M_NAME",
      headerName: "M_NAME",
      width: 120,
      editable: false,
      renderCell: (params: any) => {
        if (params.row.LIEUQL_SX === 1) {
          return (
            <span style={{ color: "red", fontWeight: "bold" }}>
              {params.row.M_NAME}
            </span>
          );
        } else {
          return <span style={{ color: "black" }}>{params.row.M_NAME}</span>;
        }
      },
    },
    { field: "WIDTH_CD", headerName: "SIZE", width: 30, editable: false },
    { field: "M_LOT_NO", headerName: "M_LOT_NO", width: 90, editable: false },
    {
      field: "ROLL_QTY",
      headerName: "ROLL_QTY",
      width: 70,
      editable: false,
      renderCell: (params: any) => {
        if (params.row.PHANLOAI !== "F") {
          return (
            <span style={{ color: "blue" }}>
              {params.row.ROLL_QTY.toLocaleString("en", "US")}
            </span>
          );
        } else {
          return (
            <span style={{ color: "red", fontWeight: "bold" }}>
              {params.row.ROLL_QTY.toLocaleString("en", "US")}
            </span>
          );
        }
      },
    },
    {
      field: "IN_QTY",
      headerName: "IN_QTY",
      width: 70,
      editable: false,
      renderCell: (params: any) => {
        if (params.row.PHANLOAI !== "F") {
          return (
            <span style={{ color: "blue" }}>
              {params.row.IN_QTY.toLocaleString("en", "US")}
            </span>
          );
        } else {
          return (
            <span style={{ color: "red", fontWeight: "bold" }}>
              {params.row.IN_QTY.toLocaleString("en", "US")}
            </span>
          );
        }
      },
    },
    {
      field: "TOTAL_IN_QTY",
      headerName: "TOTAL_IN_QTY",
      width: 120,
      editable: false,
      renderCell: (params: any) => {
        if (params.row.PHANLOAI !== "F") {
          return (
            <span style={{ color: "green" , fontWeight:'bold'}}>
              {params.row.TOTAL_IN_QTY.toLocaleString("en", "US")}
            </span>
          );
        } else {
          return (
            <span style={{ color: "red", fontWeight: "bold" }}>
              {params.row.TOTAL_IN_QTY.toLocaleString("en", "US")}
            </span>
          );
        }
      },
    },
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
          {tableTitle}
        </div>
        <div className='div' style={{ fontSize: 20, fontWeight: "bold" }}>
          _|_Liệu xuất next sẽ vào chỉ thị:  {nextPlan}
        </div>
      </GridToolbarContainer>
    );
  }


  const load_nhapkhoao = () => {
    generalQuery("lichsunhapkhoao", {
      FROM_DATE: fromdate,
      TO_DATE: todate,
      FACTORY: factory,      
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: LICHSUNHAPKHOAO, index: number) => {
              return {
                ...element,
                INS_DATE: moment
                  .utc(element.INS_DATE)
                  .format("YYYY-MM-DD HH:mm:ss"),
                id: index,
              };
            }
          );
          //console.log(loadeddata);
          setDataTable(loadeddata);
          setCurrent_Column(column_nhapkhoaotable);
          setReadyRender(true);
          setisLoading(false);
          setTableTitle("LỊCH SỬ NHẬP KHO ẢO");
          Swal.fire(
            "Thông báo",
            "Đã load: " + response.data.data.length + " dòng",
            "success"
          );
        } else {
          setDataTable([]);
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const load_xuatkhoao = () => {
    generalQuery("lichsuxuatkhoao", {
      FROM_DATE: fromdate,
      TO_DATE: todate,
      FACTORY: factory,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: LICHSUXUATKHOAO, index: number) => {
              return {
                ...element,
                INS_DATE: moment
                  .utc(element.INS_DATE)
                  .format("YYYY-MM-DD HH:mm:ss"),
                id: index,
              };
            }
          );
          //console.log(loadeddata);
          setDataTable(loadeddata);          
          setReadyRender(true);
          setisLoading(false);
          setTableTitle("LỊCH SỬ XUẤT KHO ẢO");
          Swal.fire(
            "Thông báo",
            "Đã load: " + response.data.data.length + " dòng",
            "success"
          );
        } else {
          setDataTable([]);
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_loadKhoAo = () => {
    generalQuery("checktonlieutrongxuong", {
      FACTORY: factory
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: TONLIEUXUONG[] = response.data.data.map(
            (element: TONLIEUXUONG, index: number) => {
              return {
                ...element,
                id: index,
              };
            }
          );
          
          setDataTable(loadeddata);
          setCurrent_Column(column_tonkhoaotable);
          setReadyRender(true);
          setisLoading(false);
          setTableTitle("TỒN KHO ẢO");
          Swal.fire(
            "Thông báo",
            "Đã load: " + response.data.data.length + " dòng",
            "success"
          );
        } else {
          setDataTable([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handle_xuatKhoAo = async () => {
    console.log(nextPlan);
    if (nextPlan !== '' && nextPlan !== undefined) {
      if (tonkhoaodatafilter.length > 0) {
        let err_code: string = "0";
        for (let i = 0; i < tonkhoaodatafilter.length; i++) {
          let checklieuchithi: boolean = true;
          await generalQuery("checkM_CODE_CHITHI", {
            PLAN_ID_OUTPUT: nextPlan,
            M_CODE: tonkhoaodatafilter[i].M_CODE,
          })
            .then((response) => {
              console.log(response.data.data);
              if (response.data.tk_status !== "NG") {
                checklieuchithi = true;
              } else {
                checklieuchithi = false;
              }
            })
            .catch((error) => {
              console.log(error);
            });
          if (checklieuchithi === true) {
            await generalQuery("xuatkhoao", {
              FACTORY: tonkhoaodatafilter[i].FACTORY,
              PHANLOAI: "N",
              PLAN_ID_INPUT: tonkhoaodatafilter[i].PLAN_ID_INPUT,
              PLAN_ID_OUTPUT: nextPlan,
              M_CODE: tonkhoaodatafilter[i].M_CODE,
              M_LOT_NO: tonkhoaodatafilter[i].M_LOT_NO,
              ROLL_QTY: tonkhoaodatafilter[i].ROLL_QTY,
              OUT_QTY: tonkhoaodatafilter[i].IN_QTY,
              TOTAL_OUT_QTY: tonkhoaodatafilter[i].TOTAL_IN_QTY,
              USE_YN: "O",
            })
              .then((response) => {
                console.log(response.data.tk_status);
                if (response.data.tk_status !== "NG") {                 
                  generalQuery("setUSE_YN_KHO_AO_INPUT", {
                    FACTORY: tonkhoaodatafilter[i].FACTORY,
                    PHANLOAI: tonkhoaodatafilter[i].PHANLOAI,
                    PLAN_ID_INPUT: tonkhoaodatafilter[i].PLAN_ID_INPUT,
                    PLAN_ID_SUDUNG: nextPlan,
                    M_CODE: tonkhoaodatafilter[i].M_CODE,
                    M_LOT_NO: tonkhoaodatafilter[i].M_LOT_NO,
                    TOTAL_IN_QTY: tonkhoaodatafilter[i].TOTAL_IN_QTY,
                    USE_YN: "O",
                  })
                    .then((response) => {
                      console.log(response.data);
                      if (response.data.tk_status !== "NG") {
                      } else {
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                } else {
                  err_code += "| " + response.data.message;
                }
              })
              .catch((error) => {
                console.log(error);
              });
          } else {
            err_code +=
              "| " +
              "Liệu: " +
              tonkhoaodatafilter[i].M_NAME +
              " chưa được đăng ký xuất liệu \n Đã xuất các liệu hợp lệ";
          }
        }
        if (err_code !== "0") {
          Swal.fire("Thông báo", "Có lỗi: " + err_code, "error");
        }
        setTonKhoAoDataFilter([]);
        handle_loadKhoAo();       
        
      } else {
        Swal.fire("Thông báo", "Chọn ít nhất 1 liệu để xuất kho", "error");
      }
    }
    else
    {
      Swal.fire('Thông báo', 'Chưa nhập next PLAN', 'error');
    }
  };


  const handleTonKhoAoDataSelectionforUpdate = (ids: GridSelectionModel) => {
    const selectedID = new Set(ids);
    let datafilter = datatable.filter((element: any) =>
      selectedID.has(element.id)
    );
    console.log(datafilter);
    if (datafilter.length > 0) {
      setTonKhoAoDataFilter(datafilter);
    } else {
      setTonKhoAoDataFilter([]);
      //console.log("xoa filter");
    }
  };

  useEffect(() => {
    setisLoading(true);
    setReadyRender(false);
    setCurrent_Column(column_tonkhoaotable);
    handle_loadKhoAo();
    //setColumnDefinition(column_inspect_output);
  }, []);
  return (
    <div className='khoao'>
      <div className='tracuuDataInspection'>
        <div className='tracuuDataInspectionform'>
          <div className='forminput'>
            <div className='forminputcolumn'>
              <label>
                <b>FROM DATE</b>
                <input
                  type='date'
                  value={fromdate.slice(0, 10)}
                  onChange={(e) => setFromDate(e.target.value)}
                ></input>
              </label>
              <label>
                <b>TO DATE</b>
                <input
                  type='date'
                  value={todate.slice(0, 10)}
                  onChange={(e) => setToDate(e.target.value)}
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
                  }}
                >
                  <option value='ALL'>ALL</option>
                  <option value='NM1'>NM1</option>
                  <option value='NM2'>NM2</option>
                </select>
              </label>
              <label>
                <b>NEXT PLAN</b>
                <input
                  type='text'
                  value={nextPlan}
                  onChange={(e) => setNextPlan(e.target.value)}
                ></input>
              </label>
            </div>

            <div className='forminputcolumn'>
              <button
                className='tranhatky'
                onClick={() => {
                  setisLoading(true);
                  setReadyRender(false);
                  setCurrent_Column(column_tonkhoaotable);
                  handle_loadKhoAo();
                }}
              >
                TỒN KHO ẢO
              </button>
              <button
                className='tranhatky'
                onClick={() => {
                  setisLoading(true);
                  setReadyRender(false);
                  setCurrent_Column(column_nhapkhoaotable);
                  load_nhapkhoao();
                }}
              >
                LS IN
              </button>
            </div>
            <div className='forminputcolumn'>
              <button
                className='xuatnext'
                onClick={() => {
                  checkBP(userData.EMPL_NO,userData.MAINDEPTNAME,['QLSX'], handle_xuatKhoAo);
                  //handle_xuatKhoAo();                  
                }}
              >
                XUẤT NEXT
              </button>
              <button
                className='tranhatky'
                onClick={() => {
                  setisLoading(true);
                  setReadyRender(false);
                  setCurrent_Column(column_xuatkhoaotable);
                  load_xuatkhoao();
                }}
              >
                LS OUT
              </button>
            </div>
          </div>
          <div className='formbutton'></div>
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
              rows={datatable}
              columns={current_Column}
              rowsPerPageOptions={[
                5, 10, 50, 100, 500, 1000, 5000, 10000, 500000,
              ]}
              checkboxSelection
              disableSelectionOnClick
              editMode='cell'
              getRowId={(row) => row.id}
              onSelectionModelChange={(ids) => {
                handleTonKhoAoDataSelectionforUpdate(ids);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default KHOAO;

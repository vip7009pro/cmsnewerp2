import {
  Autocomplete,
  Button,
  IconButton,
  LinearProgress,
  TextField,
} from "@mui/material";
import { GridToolbarContainer, GridToolbarQuickFilter } from "@mui/x-data-grid";
import {
  Column,
  Editing,
  FilterRow,
  Pager,
  Scrolling,
  SearchPanel,
  Selection,
  DataGrid,
  Paging,
  Toolbar,
  Item,
  Export,
  ColumnChooser,
  Summary,
  TotalItem,
} from "devextreme-react/data-grid";

import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import {
  AiFillFileExcel,
  AiOutlineCloudUpload,
  AiOutlinePrinter,
} from "react-icons/ai";
import Swal from "sweetalert2";

import "./TINHHINHCUONLIEU.scss";
import { UserContext } from "../../../api/Context";
import { generalQuery } from "../../../api/Api";
import { SaveExcel } from "../../../api/GlobalFunction";

interface MATERIAL_STATUS {
  INS_DATE: string;
  FACTORY: string;
  M_LOT_NO: string;
  M_CODE: string;
  M_NAME: string;
  WIDTH_CD: number;
  ROLL_QTY: number;
  OUT_CFM_QTY: number;
  TOTAL_OUT_QTY: number;
  PROD_REQUEST_NO: string;
  PLAN_ID: string;
  PLAN_EQ: string;
  G_CODE: string;
  G_NAME: string;
  XUAT_KHO: string;
  VAO_FR: string;
  VAO_SR: string;
  VAO_DC: string;
  VAO_ED: string;
  CONFIRM_GIAONHAN: string;
  VAO_KIEM: string;
  NHATKY_KT: string;
  RA_KIEM: string;
  INSPECT_TOTAL_QTY: number;
  INSPECT_OK_QTY: number;
  INS_OUT: number;
}

interface LOSS_TABLE_DATA {
  XUATKHO_MET: number;
  INSPECTION_INPUT: number;
  INSPECTION_OK: number;
  INSPECTION_OUTPUT: number;
  TOTAL_LOSS: number;
}

const TINHHINHCUONLIEU = () => {
  const [losstableinfo, setLossTableInfo] = useState<LOSS_TABLE_DATA>({
    XUATKHO_MET: 0,
    INSPECTION_INPUT: 0,
    INSPECTION_OK: 0,
    INSPECTION_OUTPUT: 0,
    TOTAL_LOSS: 0,
  });
  const [showloss, setShowLoss] = useState(false);
  const [readyRender, setReadyRender] = useState(false);
  const [userData, setUserData] = useContext(UserContext);
  const [isLoading, setisLoading] = useState(false);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [codeKD, setCodeKD] = useState("");
  const [codeCMS, setCodeCMS] = useState("");
  const [machine, setMachine] = useState("ALL");
  const [factory, setFactory] = useState("ALL");
  const [prodrequestno, setProdRequestNo] = useState("");
  const [plan_id, setPlanID] = useState("");
  const [alltime, setAllTime] = useState(true);
  const [datasxtable, setDataSXTable] = useState<Array<any>>([]);
  const [m_name, setM_Name] = useState("");
  const [m_code, setM_Code] = useState("");
  const column_datasx = [
    { field: "PHAN_LOAI", headerName: "PHAN_LOAI", minWidth: 120, flex: 1 },
    { field: "PLAN_ID", headerName: "PLAN_ID", minWidth: 120, flex: 1 },
    { field: "PLAN_DATE", headerName: "PLAN_DATE", minWidth: 120, flex: 1 },
    {
      field: "PROD_REQUEST_NO",
      headerName: "PROD_REQUEST_NO",
      minWidth: 120,
      flex: 1,
    },
    { field: "G_CODE", headerName: "G_CODE", minWidth: 120, flex: 1 },
    { field: "G_NAME", headerName: "G_NAME", minWidth: 120, flex: 1 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", minWidth: 120, flex: 1 },
    {
      field: "PLAN_QTY",
      headerName: "PLAN_QTY",
      minWidth: 120,
      flex: 1,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.row.PLAN_QTY.toLocaleString("en-US")}
          </span>
        );
      },
    },
    { field: "PLAN_EQ", headerName: "PLAN_EQ", minWidth: 120, flex: 1 },
    {
      field: "PLAN_FACTORY",
      headerName: "PLAN_FACTORY",
      minWidth: 120,
      flex: 1,
    },
    {
      field: "PROCESS_NUMBER",
      headerName: "PROCESS_NUMBER",
      minWidth: 120,
      flex: 1,
    },
    { field: "STEP", headerName: "STEP", minWidth: 120, flex: 1 },
    { field: "M_NAME", headerName: "M_NAME", minWidth: 120, flex: 1 },
    {
      field: "WAREHOUSE_OUTPUT_QTY",
      headerName: "WAREHOUSE_OUTPUT_QTY",
      minWidth: 150,
      flex: 1,
      renderCell: (params: any) => {
        if (params.row.WAREHOUSE_OUTPUT_QTY !== null) {
          return (
            <span style={{ color: "blue" }}>
              {params.row.WAREHOUSE_OUTPUT_QTY.toLocaleString("en-US")}
            </span>
          );
        } else {
          return <></>;
        }
      },
    },
    {
      field: "TOTAL_OUT_QTY",
      headerName: "TOTAL_OUT_QTY",
      minWidth: 120,
      flex: 1,
      renderCell: (params: any) => {
        if (params.row.TOTAL_OUT_QTY !== null) {
          return (
            <span style={{ color: "blue" }}>
              {params.row.TOTAL_OUT_QTY.toLocaleString("en-US")}
            </span>
          );
        } else {
          return <></>;
        }
      },
    },
    {
      field: "USED_QTY",
      headerName: "USED_QTY",
      minWidth: 120,
      flex: 1,
      renderCell: (params: any) => {
        if (params.row.USED_QTY !== null) {
          return (
            <span style={{ color: "blue" }}>
              {params.row.USED_QTY.toLocaleString("en-US")}
            </span>
          );
        } else {
          return <></>;
        }
      },
    },
    {
      field: "REMAIN_QTY",
      headerName: "REMAIN_QTY",
      minWidth: 120,
      flex: 1,
      renderCell: (params: any) => {
        if (params.row.REMAIN_QTY !== null) {
          return (
            <span style={{ color: "blue" }}>
              {params.row.REMAIN_QTY.toLocaleString("en-US")}
            </span>
          );
        } else {
          return <></>;
        }
      },
    },
    { field: "PD", headerName: "PD", minWidth: 120, flex: 1 },
    { field: "CAVITY", headerName: "CAVITY", minWidth: 120, flex: 1 },
    {
      field: "SETTING_MET",
      headerName: "SETTING_MET",
      minWidth: 120,
      flex: 1,
      renderCell: (params: any) => {
        if (params.row.SETTING_MET !== null) {
          return (
            <span style={{ color: "blue" }}>
              {params.row.SETTING_MET.toLocaleString("en-US")}
            </span>
          );
        } else {
          return <></>;
        }
      },
    },
    {
      field: "WAREHOUSE_ESTIMATED_QTY",
      headerName: "WAREHOUSE_ESTIMATED_QTY",
      minWidth: 120,
      flex: 1,
      renderCell: (params: any) => {
        if (params.row.WAREHOUSE_ESTIMATED_QTY !== null) {
          return (
            <span style={{ color: "blue" }}>
              {params.row.WAREHOUSE_ESTIMATED_QTY.toLocaleString("en-US")}
            </span>
          );
        } else {
          return <></>;
        }
      },
    },
    {
      field: "ESTIMATED_QTY",
      headerName: "ESTIMATED_QTY",
      minWidth: 120,
      flex: 1,
      renderCell: (params: any) => {
        if (params.row.ESTIMATED_QTY !== null) {
          return (
            <span style={{ color: "blue" }}>
              {params.row.ESTIMATED_QTY.toLocaleString("en-US")}
            </span>
          );
        } else {
          return <></>;
        }
      },
    },
    {
      field: "KETQUASX",
      headerName: "KETQUASX",
      minWidth: 120,
      flex: 1,
      renderCell: (params: any) => {
        if (params.row.KETQUASX !== null) {
          return (
            <span style={{ color: "blue" }}>
              {params.row.KETQUASX.toLocaleString("en-US")}
            </span>
          );
        } else {
          return <></>;
        }
      },
    },
    {
      field: "LOSS_SX",
      headerName: "LOSS_SX",
      minWidth: 120,
      flex: 1,
      valueGetter: (params: any) => {
        if (params.row.KETQUASX !== null && params.row.ESTIMATED_QTY !== null) {
          return (
            1 -
            params.row.KETQUASX / params.row.ESTIMATED_QTY
          ).toLocaleString("en-US", { style: "percent" });
        } else {
          return "0%";
        }
      },
    },
    {
      field: "INS_INPUT",
      headerName: "INS_INPUT",
      minWidth: 120,
      flex: 1,
      renderCell: (params: any) => {
        if (params.row.INS_INPUT !== null) {
          return (
            <span style={{ color: "blue" }}>
              {params.row.INS_INPUT.toLocaleString("en-US")}
            </span>
          );
        } else {
          return <></>;
        }
      },
    },
    {
      field: "LOSS_SX_KT",
      headerName: "LOSS_SX_KT",
      minWidth: 120,
      flex: 1,
      valueGetter: (params: any) => {
        if (params.row.KETQUASX !== null && params.row.INS_INPUT !== null) {
          return (
            1 -
            params.row.INS_INPUT / params.row.KETQUASX
          ).toLocaleString("en-US", { style: "percent" });
        } else {
          return "0%";
        }
      },
    },
    {
      field: "INS_OUTPUT",
      headerName: "INS_OUTPUT",
      minWidth: 120,
      flex: 1,
      renderCell: (params: any) => {
        if (params.row.INS_OUTPUT !== null) {
          return (
            <span style={{ color: "blue" }}>
              {params.row.INS_OUTPUT.toLocaleString("en-US")}
            </span>
          );
        } else {
          return <></>;
        }
      },
    },
    {
      field: "LOSS_KT",
      headerName: "LOSS_KT",
      minWidth: 120,
      flex: 1,
      valueGetter: (params: any) => {
        if (params.row.INS_INPUT !== null && params.row.INS_OUTPUT !== null) {
          return (
            1 -
            params.row.INS_OUTPUT / params.row.INS_INPUT
          ).toLocaleString("en-US", { style: "percent" });
        } else {
          return "0%";
        }
      },
    },
    {
      field: "SETTING_START_TIME",
      headerName: "SETTING_START_TIME",
      minWidth: 120,
      flex: 1,
    },
    {
      field: "MASS_START_TIME",
      headerName: "MASS_START_TIME",
      minWidth: 120,
      flex: 1,
    },
    {
      field: "MASS_END_TIME",
      headerName: "MASS_END_TIME",
      minWidth: 120,
      flex: 1,
    },
    { field: "RPM", headerName: "RPM", minWidth: 120, flex: 1 },
    { field: "EQ_NAME_TT", headerName: "EQ_NAME_TT", minWidth: 120, flex: 1 },
    { field: "SX_DATE", headerName: "SX_DATE", minWidth: 120, flex: 1 },
    { field: "WORK_SHIFT", headerName: "WORK_SHIFT", minWidth: 120, flex: 1 },
    { field: "INS_EMPL", headerName: "INS_EMPL", minWidth: 120, flex: 1 },
    { field: "FACTORY", headerName: "FACTORY", minWidth: 120, flex: 1 },
    { field: "BOC_KIEM", headerName: "BOC_KIEM", minWidth: 120, flex: 1 },
    { field: "LAY_DO", headerName: "LAY_DO", minWidth: 120, flex: 1 },
    { field: "MAY_HONG", headerName: "MAY_HONG", minWidth: 120, flex: 1 },
    { field: "DAO_NG", headerName: "DAO_NG", minWidth: 120, flex: 1 },
    { field: "CHO_LIEU", headerName: "CHO_LIEU", minWidth: 120, flex: 1 },
    { field: "CHO_BTP", headerName: "CHO_BTP", minWidth: 120, flex: 1 },
    { field: "HET_LIEU", headerName: "HET_LIEU", minWidth: 120, flex: 1 },
    { field: "LIEU_NG", headerName: "LIEU_NG", minWidth: 120, flex: 1 },
    { field: "CAN_HANG", headerName: "CAN_HANG", minWidth: 120, flex: 1 },
    { field: "HOP_FL", headerName: "HOP_FL", minWidth: 120, flex: 1 },
    { field: "CHO_QC", headerName: "CHO_QC", minWidth: 120, flex: 1 },
    { field: "CHOT_BAOCAO", headerName: "CHOT_BAOCAO", minWidth: 120, flex: 1 },
    { field: "CHUYEN_CODE", headerName: "CHUYEN_CODE", minWidth: 120, flex: 1 },
    { field: "KHAC", headerName: "KHAC", minWidth: 120, flex: 1 },
    { field: "REMARK", headerName: "REMARK", minWidth: 120, flex: 1 },
  ];
  const [selectedRows, setSelectedRows] = useState<number>(0);

  const [columnDefinition, setColumnDefinition] =
    useState<Array<any>>(column_datasx);

  const handle_loaddatasx = () => {
    generalQuery("materialLotStatus", {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      PROD_REQUEST_NO: prodrequestno,
      PLAN_ID: plan_id,
      M_NAME: m_name,
      M_CODE: m_code,
      G_NAME: codeKD,
      G_CODE: codeCMS,
      FACTORY: factory,
      PLAN_EQ: machine,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: MATERIAL_STATUS[] = response.data.data.map(
            (element: MATERIAL_STATUS, index: number) => {
              return {
                ...element,
                INS_DATE:
                  element.INS_DATE === null
                    ? ""
                    : moment
                        .utc(element.INS_DATE)
                        .format("YYYY-MM-DD HH:mm:ss"),
                id: index,
              };
            }
          );
          //setShowLoss(false);
          Swal.fire(
            "Thông báo",
            "Đã load : " + loaded_data.length + " dòng",
            "success"
          );

          let temp_loss_info: LOSS_TABLE_DATA = {
            XUATKHO_MET: 0,
            INSPECTION_INPUT: 0,
            INSPECTION_OK: 0,
            INSPECTION_OUTPUT: 0,
            TOTAL_LOSS: 0,
          };
          for (let i = 0; i < loaded_data.length; i++) {
            temp_loss_info.XUATKHO_MET += loaded_data[i].TOTAL_OUT_QTY;
            temp_loss_info.INSPECTION_INPUT += loaded_data[i].INSPECT_TOTAL_QTY;
            temp_loss_info.INSPECTION_OK += loaded_data[i].INSPECT_OK_QTY;
            temp_loss_info.INSPECTION_OUTPUT += loaded_data[i].INS_OUT;
          }
          temp_loss_info.TOTAL_LOSS =
            1 - temp_loss_info.INSPECTION_OUTPUT / temp_loss_info.XUATKHO_MET;
          setLossTableInfo(temp_loss_info);
          setDataSXTable(loaded_data);
          setReadyRender(true);
          setisLoading(false);
        } else {
          Swal.fire("Thông báo", " Có lỗi : " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const materialDataTable = React.useMemo(
    () => (
      <div className='datatb'>
        <div className='losstable'>
          <table>
            <thead>
              <tr>
                <th style={{ color: "black", fontWeight: "bold" }}>
                  1.XUAT KHO MET
                </th>
                <th style={{ color: "black", fontWeight: "bold" }}>
                  7.KT INPUT MET
                </th>
                <th style={{ color: "black", fontWeight: "bold" }}>
                  7.KT OK MET
                </th>
                <th style={{ color: "black", fontWeight: "bold" }}>
                  8.KT OUTPUT MET
                </th>
                <th style={{ color: "black", fontWeight: "bold" }}>
                  9.TOTAL_LOSS
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ color: "blue", fontWeight: "bold" }}>
                  {losstableinfo.XUATKHO_MET.toLocaleString("en-US")}
                </td>
                <td style={{ color: "#fc2df6", fontWeight: "bold" }}>
                  {losstableinfo.INSPECTION_INPUT.toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </td>
                <td style={{ color: "#fc2df6", fontWeight: "bold" }}>
                  {losstableinfo.INSPECTION_OK.toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </td>
                <td style={{ color: "#fc2df6", fontWeight: "bold" }}>
                  {losstableinfo.INSPECTION_OUTPUT.toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </td>
                <td style={{ color: "green", fontWeight: "bold" }}>
                  {losstableinfo.TOTAL_LOSS.toLocaleString("en-US", {
                    style: "percent",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <DataGrid
          autoNavigateToFocusedRow={true}
          allowColumnReordering={true}
          allowColumnResizing={true}
          columnAutoWidth={false}
          cellHintEnabled={true}
          columnResizingMode={"widget"}
          showColumnLines={true}
          dataSource={datasxtable}
          columnWidth='auto'
          keyExpr='id'
          height={"70vh"}
          showBorders={true}
          onSelectionChanged={(e) => {
            setSelectedRows(e.selectedRowsData.length);
          }}
          onRowClick={(e) => {
            //console.log(e.data);
          }}
        >
          <Scrolling
            useNative={true}
            scrollByContent={true}
            scrollByThumb={true}
            showScrollbar='onHover'
            mode='virtual'
          />
          <Selection mode='multiple' selectAllMode='allPages' />
          <Editing
            allowUpdating={false}
            allowAdding={true}
            allowDeleting={false}
            mode='batch'
            confirmDelete={true}
            onChangesChange={(e) => {}}
          />
          <Export enabled={true} />
          <Toolbar disabled={false}>
            <Item location='before'>
              <IconButton
                className='buttonIcon'
                onClick={() => {
                  SaveExcel(datasxtable, "MaterialStatus");
                }}
              >
                <AiFillFileExcel color='green' size={25} />
                SAVE
              </IconButton>
            </Item>

            <Item name='searchPanel' />
            <Item name='exportButton' />
            <Item name='columnChooser' />
          </Toolbar>
          <FilterRow visible={true} />
          <SearchPanel visible={true} />
          {/* <Column
                dataField='YEAR_WEEK'
                caption='YEAR_WEEK'
                width={100}
                cellRender={(e: any) => {
                    return (
                    <span style={{ color: "blue", fontWeight: "bold" }}>
                        {e.data.YEAR_WEEK}
                    </span>
                    );
                }}
                /> */}

          <ColumnChooser enabled={true} />
          <Column dataField='id' caption='ID' width={100}></Column>
          <Column dataField='FACTORY' caption='FACTORY' width={100}></Column>
          <Column dataField='INS_DATE' caption='INS_DATE' width={150}></Column>
          <Column dataField='M_LOT_NO' caption='M_LOT_NO' width={100}></Column>
          <Column dataField='M_CODE' caption='M_CODE' width={100}></Column>
          <Column dataField='M_NAME' caption='M_NAME' width={100}></Column>
          <Column dataField='WIDTH_CD' caption='WIDTH_CD' width={100}></Column>
          <Column
            dataField='XUAT_KHO'
            caption='XUAT_KHO'
            width={100}
            cellRender={(e: any) => {
              if (e.data.XUAT_KHO === "Y") {
                return (
                  <div
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      height: "20px",
                      width: "80px",
                      backgroundColor: "#54e00d",
                      textAlign: "center",
                    }}
                  >
                    Y
                  </div>
                );
              } else {
                return (
                  <div
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      height: "20px",
                      width: "50px",
                      backgroundColor: "red",
                      textAlign: "center",
                    }}
                  >
                    N
                  </div>
                );
              }
            }}
          ></Column>
          <Column
            dataField='VAO_FR'
            caption='VAO_FR'
            width={100}
            cellRender={(e: any) => {
              if (e.data.VAO_FR === "Y") {
                return (
                  <div
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      height: "20px",
                      width: "80px",
                      backgroundColor: "#54e00d",
                      textAlign: "center",
                    }}
                  >
                    Y
                  </div>
                );
              } else {
                return (
                  <div
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      height: "20px",
                      width: "50px",
                      backgroundColor: "red",
                      textAlign: "center",
                    }}
                  >
                    N
                  </div>
                );
              }
            }}
          ></Column>
          <Column
            dataField='VAO_SR'
            caption='VAO_SR'
            width={100}
            cellRender={(e: any) => {
              if (e.data.VAO_SR === "Y") {
                return (
                  <div
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      height: "20px",
                      width: "80px",
                      backgroundColor: "#54e00d",
                      textAlign: "center",
                    }}
                  >
                    Y
                  </div>
                );
              } else {
                return (
                  <div
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      height: "20px",
                      width: "50px",
                      backgroundColor: "red",
                      textAlign: "center",
                    }}
                  >
                    N
                  </div>
                );
              }
            }}
          ></Column>
          <Column
            dataField='VAO_DC'
            caption='VAO_DC'
            width={100}
            cellRender={(e: any) => {
              if (e.data.VAO_DC === "Y") {
                return (
                  <div
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      height: "20px",
                      width: "80px",
                      backgroundColor: "#54e00d",
                      textAlign: "center",
                    }}
                  >
                    Y
                  </div>
                );
              } else {
                return (
                  <div
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      height: "20px",
                      width: "50px",
                      backgroundColor: "red",
                      textAlign: "center",
                    }}
                  >
                    N
                  </div>
                );
              }
            }}
          ></Column>
          <Column
            dataField='VAO_ED'
            caption='VAO_ED'
            width={100}
            cellRender={(e: any) => {
              if (e.data.VAO_ED === "Y") {
                return (
                  <div
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      height: "20px",
                      width: "80px",
                      backgroundColor: "#54e00d",
                      textAlign: "center",
                    }}
                  >
                    Y
                  </div>
                );
              } else {
                return (
                  <div
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      height: "20px",
                      width: "50px",
                      backgroundColor: "red",
                      textAlign: "center",
                    }}
                  >
                    N
                  </div>
                );
              }
            }}
          ></Column>
          <Column
            dataField='CONFIRM_GIAONHAN'
            caption='CONFIRM_GIAONHAN'
            width={100}
            cellRender={(e: any) => {
              if (e.data.CONFIRM_GIAONHAN === "Y") {
                return (
                  <div
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      height: "20px",
                      width: "80px",
                      backgroundColor: "#54e00d",
                      textAlign: "center",
                    }}
                  >
                    Y
                  </div>
                );
              } else {
                return (
                  <div
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      height: "20px",
                      width: "50px",
                      backgroundColor: "red",
                      textAlign: "center",
                    }}
                  >
                    N
                  </div>
                );
              }
            }}
          ></Column>
          <Column
            dataField='VAO_KIEM'
            caption='VAO_KIEM'
            width={100}
            cellRender={(e: any) => {
              if (e.data.VAO_KIEM === "Y") {
                return (
                  <div
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      height: "20px",
                      width: "80px",
                      backgroundColor: "#54e00d",
                      textAlign: "center",
                    }}
                  >
                    Y
                  </div>
                );
              } else {
                return (
                  <div
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      height: "20px",
                      width: "50px",
                      backgroundColor: "red",
                      textAlign: "center",
                    }}
                  >
                    N
                  </div>
                );
              }
            }}
          ></Column>
          <Column
            dataField='NHATKY_KT'
            caption='NHATKY_KT'
            width={100}
            cellRender={(e: any) => {
              if (e.data.NHATKY_KT === "Y") {
                return (
                  <div
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      height: "20px",
                      width: "80px",
                      backgroundColor: "#54e00d",
                      textAlign: "center",
                    }}
                  >
                    Y
                  </div>
                );
              } else {
                return (
                  <div
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      height: "20px",
                      width: "50px",
                      backgroundColor: "red",
                      textAlign: "center",
                    }}
                  >
                    N
                  </div>
                );
              }
            }}
          ></Column>
          <Column dataField='ROLL_QTY' caption='ROLL_QTY' width={100}></Column>
          <Column
            dataField='OUT_CFM_QTY'
            caption='OUT_CFM_QTY'
            width={100}
            dataType='number'
            format={"decimal"}
          ></Column>
          <Column
            dataField='TOTAL_OUT_QTY'
            caption='TOTAL_OUT_QTY'
            width={100}
            dataType='number'
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "blue", fontWeight: "bold" }}>
                  {e.data.TOTAL_OUT_QTY?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField='INSPECT_TOTAL_QTY'
            caption='INSPECT_TOTAL_QTY'
            width={100}
            dataType='number'
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "red", fontWeight: "bold" }}>
                  {e.data.INSPECT_TOTAL_QTY?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField='INSPECT_OK_QTY'
            caption='INSPECT_OK_QTY'
            width={100}
            dataType='number'
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "#54e00d", fontWeight: "bold" }}>
                  {e.data.INSPECT_OK_QTY?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField='INS_OUT'
            caption='INS_OUT'
            width={100}
            dataType='number'
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "green", fontWeight: "bold" }}>
                  {e.data.INS_OUT?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column dataField='PD' caption='PD' width={100}></Column>
          <Column dataField='CAVITY' caption='CAVITY' width={100}></Column>
          <Column
            dataField='PROD_REQUEST_NO'
            caption='PROD_REQUEST_NO'
            width={100}
          ></Column>
          <Column dataField='PLAN_ID' caption='PLAN_ID' width={100}></Column>
          <Column dataField='PLAN_EQ' caption='PLAN_EQ' width={100}></Column>
          <Column dataField='G_CODE' caption='G_CODE'></Column>
          <Column dataField='G_NAME' caption='G_NAME'></Column>
          <Paging defaultPageSize={15} />
          <Pager
            showPageSizeSelector={true}
            allowedPageSizes={[5, 10, 15, 20, 100, 1000, 10000, "all"]}
            showNavigationButtons={true}
            showInfo={true}
            infoText='Page #{0}. Total: {1} ({2} items)'
            displayMode='compact'
          />
          <Summary>
            <TotalItem
              alignment='right'
              column='id'
              summaryType='count'
              valueFormat={"decimal"}
            />
            <TotalItem
              alignment='right'
              column='TOTAL_OUT_QTY'
              summaryType='sum'
              valueFormat={"thousands"}
            />
            <TotalItem
              alignment='right'
              column='INSPECT_TOTAL_QTY'
              summaryType='sum'
              valueFormat={"thousands"}
            />
            <TotalItem
              alignment='right'
              column='INSPECT_OK_QTY'
              summaryType='sum'
              valueFormat={"thousands"}
            />
            <TotalItem
              alignment='right'
              column='INS_OUT'
              summaryType='sum'
              valueFormat={"thousands"}
            />
          </Summary>
        </DataGrid>
      </div>
    ),
    [datasxtable]
  );

  useEffect(() => {
    //setColumnDefinition(column_inspect_output);
  }, []);
  return (
    <div className='datasx'>
      <div className='tracuuDataInspection'>
        <div className='tracuuDataInspectionform'>
          <div className='forminput'>
            <div className='forminputcolumn'>
              <label>
                <b>Từ ngày:</b>
                <input
                  type='date'
                  value={fromdate.slice(0, 10)}
                  onChange={(e) => setFromDate(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Tới ngày:</b>{" "}
                <input
                  type='date'
                  value={todate.slice(0, 10)}
                  onChange={(e) => setToDate(e.target.value)}
                ></input>
              </label>
            </div>
            <div className='forminputcolumn'>
              <label>
                <b>Code KD:</b>{" "}
                <input
                  type='text'
                  placeholder='GH63-xxxxxx'
                  value={codeKD}
                  onChange={(e) => setCodeKD(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Code CMS:</b>{" "}
                <input
                  type='text'
                  placeholder='7C123xxx'
                  value={codeCMS}
                  onChange={(e) => setCodeCMS(e.target.value)}
                ></input>
              </label>
            </div>
            <div className='forminputcolumn'>
              <label>
                <b>Tên Liệu:</b>{" "}
                <input
                  type='text'
                  placeholder='SJ-203020HC'
                  value={m_name}
                  onChange={(e) => setM_Name(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Mã Liệu CMS:</b>{" "}
                <input
                  type='text'
                  placeholder='A123456'
                  value={m_code}
                  onChange={(e) => setM_Code(e.target.value)}
                ></input>
              </label>
            </div>
            <div className='forminputcolumn'>
              <label>
                <b>Số YCSX:</b>{" "}
                <input
                  type='text'
                  placeholder='1F80008'
                  value={prodrequestno}
                  onChange={(e) => setProdRequestNo(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Số chỉ thị:</b>{" "}
                <input
                  type='text'
                  placeholder='A123456'
                  value={plan_id}
                  onChange={(e) => setPlanID(e.target.value)}
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
            </div>
          </div>
          <div className='formbutton'>
            <label>
              <b>All Time:</b>
              <input
                type='checkbox'
                name='alltimecheckbox'
                defaultChecked={alltime}
                onChange={() => setAllTime(!alltime)}
              ></input>
            </label>
            <button
              className='tranhatky'
              onClick={() => {
                setisLoading(true);
                setReadyRender(false);
                setColumnDefinition(column_datasx);
                handle_loaddatasx();
              }}
            >
              TRA LIỆU
            </button>
          </div>
        </div>
        <div className='tracuuYCSXTable'>
          Số dòng đã chọn: {selectedRows} / {datasxtable.length}
          {materialDataTable}
        </div>
      </div>
    </div>
  );
};
export default TINHHINHCUONLIEU;

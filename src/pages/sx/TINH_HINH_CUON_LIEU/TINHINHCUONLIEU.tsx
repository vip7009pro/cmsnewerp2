import {
  IconButton,
} from "@mui/material";
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
  ROLL_LOSS_KT: number;
  ROLL_LOSS: number;
  PD: number;
  CAVITY: number;
  FR_RESULT: number;
  SR_RESULT: number;
  DC_RESULT: number;
  ED_RESULT: number;
  TOTAL_OUT_EA: number;
  FR_EA: number;
  SR_EA: number;
  DC_EA: number;
  ED_EA: number;
  INSPECT_TOTAL_EA: number;
  INSPECT_OK_EA: number;
  INS_OUTPUT_EA: number;
}

interface LOSS_TABLE_DATA {
  XUATKHO_MET: number;
  INSPECTION_INPUT: number;
  INSPECTION_OK: number;
  INSPECTION_OUTPUT: number;
  TOTAL_LOSS_KT: number;
  TOTAL_LOSS: number;
}

const TINHHINHCUONLIEU = () => {
  const [losstableinfo, setLossTableInfo] = useState<LOSS_TABLE_DATA>({
    XUATKHO_MET: 0,
    INSPECTION_INPUT: 0,
    INSPECTION_OK: 0,
    INSPECTION_OUTPUT: 0,
    TOTAL_LOSS_KT: 0,
    TOTAL_LOSS: 0,
  });


  const [userData, setUserData] = useContext(UserContext);
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
  const [selectedRows, setSelectedRows] = useState<number>(0);

  const handleSearchCodeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {                      
      handle_loaddatasx();
    }
  };


  const handle_loaddatasx = () => {
    Swal.fire({
      title: "Tra cứu trạng thái cuộn liệu",
      text: "Đang tải dữ liệu, hãy chờ chút",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });
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
            TOTAL_LOSS_KT: 0,
            TOTAL_LOSS: 0,
          };
          for (let i = 0; i < loaded_data.length; i++) {
            temp_loss_info.XUATKHO_MET += loaded_data[i].TOTAL_OUT_QTY;
            temp_loss_info.INSPECTION_INPUT += loaded_data[i].INSPECT_TOTAL_QTY;
            temp_loss_info.INSPECTION_OK += loaded_data[i].INSPECT_OK_QTY;
            temp_loss_info.INSPECTION_OUTPUT += loaded_data[i].INS_OUT;
          }
          temp_loss_info.TOTAL_LOSS_KT =
            1 - temp_loss_info.INSPECTION_OK / temp_loss_info.XUATKHO_MET;
          temp_loss_info.TOTAL_LOSS =
            1 - temp_loss_info.INSPECTION_OUTPUT / temp_loss_info.XUATKHO_MET;
          setLossTableInfo(temp_loss_info);
          setDataSXTable(loaded_data);
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
                  9.TOTAL_LOSS_KT
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
                  {losstableinfo.TOTAL_LOSS_KT.toLocaleString("en-US", {
                    style: "percent",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
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
              } 
              else if (e.data.CONFIRM_GIAONHAN === "R")  {
                return (
                  <div
                    style={{
                      color: "black",
                      fontWeight: "bold",
                      height: "20px",
                      width: "80px",
                      backgroundColor: "yellow",
                      textAlign: "center",
                    }}
                  >
                    R
                  </div>
                );

              }
              else {
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
            dataField='FR_RESULT'
            caption='FR_RESULT'
            width={100}
            dataType='number'
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "blue", fontWeight: "bold" }}>
                  {e.data.FR_RESULT?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField='SR_RESULT'
            caption='SR_RESULT'
            width={100}
            dataType='number'
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "blue", fontWeight: "bold" }}>
                  {e.data.SR_RESULT?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField='DC_RESULT'
            caption='DC_RESULT'
            width={100}
            dataType='number'
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "blue", fontWeight: "bold" }}>
                  {e.data.DC_RESULT?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField='ED_RESULT'
            caption='ED_RESULT'
            width={100}
            dataType='number'
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "blue", fontWeight: "bold" }}>
                  {e.data.ED_RESULT?.toLocaleString("en-US")}
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
                <span style={{ color: "blue", fontWeight: "bold" }}>
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
                <span style={{ color: "blue", fontWeight: "bold" }}>
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
                <span style={{ color: "blue", fontWeight: "bold" }}>
                  {e.data.INS_OUT?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField='TOTAL_OUT_EA'
            caption='TOTAL_OUT_EA'
            width={100}
            dataType='number'
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "green", fontWeight: "bold" }}>
                  {e.data.TOTAL_OUT_EA?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField='FR_EA'
            caption='FR_EA'
            width={100}
            dataType='number'
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "green", fontWeight: "bold" }}>
                  {e.data.FR_EA?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField='SR_EA'
            caption='SR_EA'
            width={100}
            dataType='number'
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "green", fontWeight: "bold" }}>
                  {e.data.SR_EA?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField='DC_EA'
            caption='DC_EA'
            width={100}
            dataType='number'
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "green", fontWeight: "bold" }}>
                  {e.data.DC_EA?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField='ED_EA'
            caption='ED_EA'
            width={100}
            dataType='number'
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "green", fontWeight: "bold" }}>
                  {e.data.ED_EA?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField='INSPECT_TOTAL_EA'
            caption='INSPECT_TOTAL_EA'
            width={100}
            dataType='number'
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "green", fontWeight: "bold" }}>
                  {e.data.INSPECT_TOTAL_EA?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField='INSPECT_OK_EA'
            caption='INSPECT_OK_EA'
            width={100}
            dataType='number'
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "green", fontWeight: "bold" }}>
                  {e.data.INSPECT_OK_EA?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField='INS_OUTPUT_EA'
            caption='INS_OUTPUT_EA'
            width={100}
            dataType='number'
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "green", fontWeight: "bold" }}>
                  {e.data.INS_OUTPUT_EA?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>

          <Column
            dataField='ROLL_LOSS_KT'
            caption='ROLL_LOSS_KT'
            width={100}
            dataType='number'
            format={"percent"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "green", fontWeight: "bold" }}>
                  {100*e.data.ROLL_LOSS_KT?.toLocaleString("en-US",)} %
                </span>
              );
            }}
          ></Column>         
          <Column
            dataField='ROLL_LOSS'
            caption='ROLL_LOSS'
            width={100}
            dataType='number'
            format={"percent"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "green", fontWeight: "bold" }}>
                  {100*e.data.ROLL_LOSS?.toLocaleString("en-US",)} %
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
              column='TOTAL_OUT_EA'
              summaryType='sum'
              valueFormat={"thousands"}
            />
            <TotalItem
              alignment='right'
              column='FR_RESULT'
              summaryType='sum'
              valueFormat={"thousands"}
            />
            <TotalItem
              alignment='right'
              column='SR_RESULT'
              summaryType='sum'
              valueFormat={"thousands"}
            />
            <TotalItem
              alignment='right'
              column='DC_RESULT'
              summaryType='sum'
              valueFormat={"thousands"}
            />
            <TotalItem
              alignment='right'
              column='ED_RESULT'
              summaryType='sum'
              valueFormat={"thousands"}
            />
            <TotalItem
              alignment='right'
              column='FR_EA'
              summaryType='sum'
              valueFormat={"thousands"}
            />
            <TotalItem
              alignment='right'
              column='SR_EA'
              summaryType='sum'
              valueFormat={"thousands"}
            />
            <TotalItem
              alignment='right'
              column='DC_EA'
              summaryType='sum'
              valueFormat={"thousands"}
            />
            <TotalItem
              alignment='right'
              column='ED_EA'
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
            <TotalItem
              alignment='right'
              column='INSPECT_TOTAL_EA'
              summaryType='sum'
              valueFormat={"thousands"}
            />
            <TotalItem
              alignment='right'
              column='INSPECT_OK_EA'
              summaryType='sum'
              valueFormat={"thousands"}
            />
            <TotalItem
              alignment='right'
              column='INS_OUTPUT_EA'
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
    <div className='tinhinhcuonlieu'>
      <div className='tracuuDataInspection'>
        <div className='tracuuDataInspectionform'>
          <div className='forminput'>
            <div className='forminputcolumn'>
              <label>
                <b>Từ ngày:</b>
                <input onKeyDown={(e)=> {handleSearchCodeKeyDown(e);} }
                  type='date'
                  value={fromdate.slice(0, 10)}
                  onChange={(e) => setFromDate(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Tới ngày:</b>{" "}
                <input onKeyDown={(e)=> {handleSearchCodeKeyDown(e);} }
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
                  onKeyDown={(e)=> {handleSearchCodeKeyDown(e);} }
                  type='text'
                  placeholder='GH63-xxxxxx'
                  value={codeKD}
                  onChange={(e) => setCodeKD(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Code CMS:</b>{" "}
                <input onKeyDown={(e)=> {handleSearchCodeKeyDown(e);} }
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
                <input onKeyDown={(e)=> {handleSearchCodeKeyDown(e);} }
                  type='text'
                  placeholder='SJ-203020HC'
                  value={m_name}
                  onChange={(e) => setM_Name(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Mã Liệu CMS:</b>{" "}
                <input onKeyDown={(e)=> {handleSearchCodeKeyDown(e);} }
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
                <input onKeyDown={(e)=> {handleSearchCodeKeyDown(e);} }
                  type='text'
                  placeholder='1F80008'
                  value={prodrequestno}
                  onChange={(e) => setProdRequestNo(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Số chỉ thị:</b>{" "}
                <input onKeyDown={(e)=> {handleSearchCodeKeyDown(e);} }
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
              <input onKeyDown={(e)=> {handleSearchCodeKeyDown(e);} }
                type='checkbox'
                name='alltimecheckbox'
                defaultChecked={alltime}
                onChange={() => setAllTime(!alltime)}
              ></input>
            </label>
            <button
              className='tranhatky'
              onClick={() => {                                          
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
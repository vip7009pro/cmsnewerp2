import { IconButton } from "@mui/material";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import Swal from "sweetalert2";
import "./TINHHINHCUONLIEU.scss";
import { generalQuery, getAuditMode } from "../../../api/Api";
import { f_getMachineListData, f_loadRollLossData } from "../../../api/GlobalFunction";
import PivotTable from "../../../components/PivotChart/PivotChart";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import {
  LOSS_TABLE_DATA_ROLL,
  MACHINE_LIST,
  MATERIAL_STATUS,
  SX_LOSS_ROLL_DATA,
} from "../../../api/GlobalInterface";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import AGTable from "../../../components/DataTable/AGTable";
import SXWeeklyLossRoll from "../../../components/Chart/SX/SXWeeklyLossRoll";

const TINHHINHCUONLIEU = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [machine_list, setMachine_List] = useState<MACHINE_LIST[]>([]);
  const getMachineList = async () => {
    setMachine_List(await f_getMachineListData());
  };
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);
  const [losstableinfo, setLossTableInfo] = useState<LOSS_TABLE_DATA_ROLL>({
    XUATKHO_MET: 0,
    INSPECTION_INPUT: 0,
    INSPECTION_OK: 0,
    INSPECTION_OUTPUT: 0,
    TOTAL_LOSS_KT: 0,
    TOTAL_LOSS: 0,
  });
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [codeKD, setCodeKD] = useState("");
  const [codeCMS, setCodeCMS] = useState("");
  const [machine, setMachine] = useState("ALL");
  const [factory, setFactory] = useState("ALL");
  const [prodrequestno, setProdRequestNo] = useState("");
  const [plan_id, setPlanID] = useState("");
  const [alltime, setAllTime] = useState(false);
  const [datasxtable, setDataSXTable] = useState<Array<any>>([]);
  const [m_name, setM_Name] = useState("");
  const [m_code, setM_Code] = useState("");
  const [cust_name_kd, setCUST_NAME_KD] = useState("");
  const [columns, setColumns] = useState<Array<any>>([]);
  const [loss_roll_data, setLossRollData] = useState<SX_LOSS_ROLL_DATA[]>([])
  const handleLoadRollLossData = async () => {
    let kq: SX_LOSS_ROLL_DATA[] = [];
    kq = await f_loadRollLossData(fromdate, todate)
    setLossRollData(kq);
  }
  const handleSearchCodeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
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
    handleLoadRollLossData();
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
      CUST_NAME_KD: cust_name_kd
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: MATERIAL_STATUS[] = response.data.data.map(
            (element: MATERIAL_STATUS, index: number) => {
              return {
                id: index,
                ...element,
                G_NAME: getAuditMode() == 0 ? element?.G_NAME : element?.G_NAME?.search('CNDB') == -1 ? element?.G_NAME : 'TEM_NOI_BO',
                INS_DATE: element.INS_DATE === null ? "" : moment.utc(element.INS_DATE).format("YYYY-MM-DD HH:mm:ss"),
                FIRST_INPUT_DATE: element.FIRST_INPUT_DATE === null ? "" : moment.utc(element.FIRST_INPUT_DATE).format("YYYY-MM-DD HH:mm:ss"),
              };
            },
          );
          //setShowLoss(false);
          Swal.fire(
            "Thông báo",
            "Đã load : " + loaded_data.length + " dòng",
            "success",
          );
          let temp_loss_info: LOSS_TABLE_DATA_ROLL = {
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
          let keysArray = Object.getOwnPropertyNames(loaded_data[0]);
          let column_map = keysArray.map((e, index) => {
            if (e.substring(0, 4) === "VAO_" ||
              e === "XUAT_KHO" ||
              e === "CONFIRM_GIAONHAN" ||
              e === "NHATKY_KT" ||
              e === "RETURN_IQC" ||
              e === "VAO_SX" ||
              e === "RA_KIEM") {
              return {
                field: e,
                headerName: e,
                width: 70,
                cellRenderer: (ele: any) => {
                  //console.log(ele);
                  if (
                    e.substring(0, 4) === "VAO_" ||
                    e === "XUAT_KHO" ||
                    e === "CONFIRM_GIAONHAN" ||
                    e === "NHATKY_KT" ||
                    e === "RETURN_IQC" ||
                    e === "VAO_SX" ||
                    e === "RA_KIEM"
                  ) {
                    if (ele.data[e] === "Y") {
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
                    } else if (ele.data[e] === "R") {
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
                  } else if (
                    [
                      "TOTAL_OUT_QTY",
                      "INSPECT_TOTAL_QTY",
                      "INSPECT_OK_QTY",
                      "INS_OUT",
                    ].indexOf(e) > -1 ||
                    e.indexOf("RESULT") > -1
                  ) {
                    return (
                      <span style={{ color: "blue", fontWeight: "bold" }}>
                        {ele.data[e]?.toLocaleString("en-US")}
                      </span>
                    );
                  } else if (
                    [
                      "TOTAL_OUT_EA",
                      "INSPECT_TOTAL_EA",
                      "INSPECT_OK_EA",
                      "INS_OUTPUT_EA",
                    ].indexOf(e) > -1 ||
                    e.indexOf("_EA") > -1
                  ) {
                    return (
                      <span style={{ color: "green", fontWeight: "bold" }}>
                        {ele.data[e]?.toLocaleString("en-US")}
                      </span>
                    );
                  } else if (e.indexOf("_LOSS") > -1) {
                    return (
                      <span style={{ color: "green", fontWeight: "bold" }}>
                        {100 *
                          ele.data[e]?.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                        %
                      </span>
                    );
                  } else {
                    return <span>{ele.data[e]}</span>;
                  }
                },
              };
            }

            else if (e === 'id') {
              return {
                field: e,
                headerName: 'ID',
                width: 60,
                headerCheckboxSelection: true,
                checkboxSelection: true,
              }
            }
            return {
              field: e,
              headerName: e,
              width: 60,
              cellRenderer: (ele: any) => {
                //console.log(ele);
                if (
                  e.substring(0, 4) === "VAO_" ||
                  e === "XUAT_KHO" ||
                  e === "CONFIRM_GIAONHAN" ||
                  e === "NHATKY_KT" ||
                  e === "RETURN_KHO" ||
                  e === "RA_KIEM"
                ) {
                  if (ele.data[e] === "Y") {
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
                  } else if (ele.data[e] === "R") {
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
                } else if (
                  [
                    "TOTAL_OUT_QTY",
                    "INSPECT_TOTAL_QTY",
                    "INSPECT_OK_QTY",
                    "INS_OUT",
                  ].indexOf(e) > -1 ||
                  e.indexOf("RESULT") > -1
                ) {
                  return (
                    <span style={{ color: "blue", fontWeight: "bold" }}>
                      {ele.data[e]?.toLocaleString("en-US")}
                    </span>
                  );
                } else if (
                  [
                    "TOTAL_OUT_EA",
                    "INSPECT_TOTAL_EA",
                    "INSPECT_OK_EA",
                    "INS_OUTPUT_EA",
                  ].indexOf(e) > -1 ||
                  e.indexOf("_EA") > -1
                ) {
                  return (
                    <span style={{ color: "green", fontWeight: "bold" }}>
                      {ele.data[e]?.toLocaleString("en-US")}
                    </span>
                  );
                } else if (e.indexOf("_LOSS") > -1) {
                  return (
                    <span style={{ color: "green", fontWeight: "bold" }}>
                      {100 *
                        ele.data[e]?.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                      %
                    </span>
                  );
                } else {
                  return <span>{ele.data[e]}</span>;
                }
              },

            }
          });

          setColumns(column_map);
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
  const materialDataTableAG = useMemo(() =>
    <AGTable
      suppressRowClickSelection={true}
      showFilter={true}
      toolbar={
        <></>
      }
      columns={columns}
      data={datasxtable}
      onCellEditingStopped={(params: any) => {
        //console.log(e.data)
      }} onRowClick={(params: any) => {

      }} onSelectionChange={(params: any) => {

      }}
    />
    , [datasxtable, columns]);

  const dataSource = new PivotGridDataSource({
    fields: [
      {
        caption: "INS_DATE",
        width: 80,
        dataField: "INS_DATE",
        allowSorting: true,
        allowFiltering: true,
        dataType: "date",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "M_LOT_NO",
        width: 80,
        dataField: "M_LOT_NO",
        allowSorting: true,
        allowFiltering: true,
        dataType: "string",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "M_CODE",
        width: 80,
        dataField: "M_CODE",
        allowSorting: true,
        allowFiltering: true,
        dataType: "string",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "M_NAME",
        width: 80,
        dataField: "M_NAME",
        allowSorting: true,
        allowFiltering: true,
        dataType: "string",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "WIDTH_CD",
        width: 80,
        dataField: "WIDTH_CD",
        allowSorting: true,
        allowFiltering: true,
        dataType: "string",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "XUAT_KHO",
        width: 80,
        dataField: "XUAT_KHO",
        allowSorting: true,
        allowFiltering: true,
        dataType: "string",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "VAO_FR",
        width: 80,
        dataField: "VAO_FR",
        allowSorting: true,
        allowFiltering: true,
        dataType: "string",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "VAO_SR",
        width: 80,
        dataField: "VAO_SR",
        allowSorting: true,
        allowFiltering: true,
        dataType: "string",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "VAO_DC",
        width: 80,
        dataField: "VAO_DC",
        allowSorting: true,
        allowFiltering: true,
        dataType: "string",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "VAO_ED",
        width: 80,
        dataField: "VAO_ED",
        allowSorting: true,
        allowFiltering: true,
        dataType: "string",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "CONFIRM_GIAONHAN",
        width: 80,
        dataField: "CONFIRM_GIAONHAN",
        allowSorting: true,
        allowFiltering: true,
        dataType: "string",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "VAO_KIEM",
        width: 80,
        dataField: "VAO_KIEM",
        allowSorting: true,
        allowFiltering: true,
        dataType: "string",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "NHATKY_KT",
        width: 80,
        dataField: "NHATKY_KT",
        allowSorting: true,
        allowFiltering: true,
        dataType: "string",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "RA_KIEM",
        width: 80,
        dataField: "RA_KIEM",
        allowSorting: true,
        allowFiltering: true,
        dataType: "string",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "ROLL_QTY",
        width: 80,
        dataField: "ROLL_QTY",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "OUT_CFM_QTY",
        width: 80,
        dataField: "OUT_CFM_QTY",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "TOTAL_OUT_QTY",
        width: 80,
        dataField: "TOTAL_OUT_QTY",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "FR_RESULT",
        width: 80,
        dataField: "FR_RESULT",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "SR_RESULT",
        width: 80,
        dataField: "SR_RESULT",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "DC_RESULT",
        width: 80,
        dataField: "DC_RESULT",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "ED_RESULT",
        width: 80,
        dataField: "ED_RESULT",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "INSPECT_TOTAL_QTY",
        width: 80,
        dataField: "INSPECT_TOTAL_QTY",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "INSPECT_OK_QTY",
        width: 80,
        dataField: "INSPECT_OK_QTY",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "INS_OUT",
        width: 80,
        dataField: "INS_OUT",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "PD",
        width: 80,
        dataField: "PD",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "CAVITY",
        width: 80,
        dataField: "CAVITY",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "TOTAL_OUT_EA",
        width: 80,
        dataField: "TOTAL_OUT_EA",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "FR_EA",
        width: 80,
        dataField: "FR_EA",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "SR_EA",
        width: 80,
        dataField: "SR_EA",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "DC_EA",
        width: 80,
        dataField: "DC_EA",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "ED_EA",
        width: 80,
        dataField: "ED_EA",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "INSPECT_TOTAL_EA",
        width: 80,
        dataField: "INSPECT_TOTAL_EA",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "INSPECT_OK_EA",
        width: 80,
        dataField: "INSPECT_OK_EA",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "INS_OUTPUT_EA",
        width: 80,
        dataField: "INS_OUTPUT_EA",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "ROLL_LOSS_KT",
        width: 80,
        dataField: "ROLL_LOSS_KT",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "ROLL_LOSS",
        width: 80,
        dataField: "ROLL_LOSS",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "PROD_REQUEST_NO",
        width: 80,
        dataField: "PROD_REQUEST_NO",
        allowSorting: true,
        allowFiltering: true,
        dataType: "string",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "PLAN_ID",
        width: 80,
        dataField: "PLAN_ID",
        allowSorting: true,
        allowFiltering: true,
        dataType: "string",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "PLAN_EQ",
        width: 80,
        dataField: "PLAN_EQ",
        allowSorting: true,
        allowFiltering: true,
        dataType: "string",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "G_CODE",
        width: 80,
        dataField: "G_CODE",
        allowSorting: true,
        allowFiltering: true,
        dataType: "string",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "G_NAME",
        width: 80,
        dataField: "G_NAME",
        allowSorting: true,
        allowFiltering: true,
        dataType: "string",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "FACTORY",
        width: 80,
        dataField: "FACTORY",
        allowSorting: true,
        allowFiltering: true,
        dataType: "string",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
    ],
    store: datasxtable,
  });
  useEffect(() => {
    getMachineList();
    //setColumnDefinition(column_inspect_output);
  }, []);
  return (
    <div className="tinhinhcuonlieu">
      <div className="chartcuonlieu" style={{ height: '300px' }}>
        <SXWeeklyLossRoll dldata={loss_roll_data} materialColor="#ffff64aa" processColor="#7df7fc" />
      </div>
      <div className="tracuuDataInspection">
        <div className="tracuuDataInspectionform" style={{ backgroundImage: theme.CMS.backgroundImage }}>
          <div className="forminput">
            <div className="forminputcolumn">
              <label>
                <b>Từ ngày:</b>
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                  type="date"
                  value={fromdate.slice(0, 10)}
                  onChange={(e) => setFromDate(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Tới ngày:</b>{" "}
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                  type="date"
                  value={todate.slice(0, 10)}
                  onChange={(e) => setToDate(e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Code KD:</b>{" "}
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                  type="text"
                  placeholder="GH63-xxxxxx"
                  value={codeKD}
                  onChange={(e) => setCodeKD(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Code ERP:</b>{" "}
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                  type="text"
                  placeholder="7C123xxx"
                  value={codeCMS}
                  onChange={(e) => setCodeCMS(e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Tên Liệu:</b>{" "}
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                  type="text"
                  placeholder="SJ-203020HC"
                  value={m_name}
                  onChange={(e) => setM_Name(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Mã Liệu CMS:</b>{" "}
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                  type="text"
                  placeholder="A123456"
                  value={m_code}
                  onChange={(e) => setM_Code(e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Số YCSX:</b>{" "}
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                  type="text"
                  placeholder="1F80008"
                  value={prodrequestno}
                  onChange={(e) => setProdRequestNo(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Số chỉ thị:</b>{" "}
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                  type="text"
                  placeholder="A123456"
                  value={plan_id}
                  onChange={(e) => setPlanID(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Khách hàng:</b>{" "}
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                  type="text"
                  placeholder="SEV"
                  value={cust_name_kd}
                  onChange={(e) => setCUST_NAME_KD(e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>FACTORY:</b>
                <select
                  name="phanloai"
                  value={factory}
                  onChange={(e) => {
                    setFactory(e.target.value);
                  }}
                >
                  <option value="ALL">ALL</option>
                  <option value="NM1">NM1</option>
                  <option value="NM2">NM2</option>
                </select>
              </label>
              <label>
                <b>MACHINE:</b>
                <select
                  name="machine2"
                  value={machine}
                  onChange={(e) => {
                    setMachine(e.target.value);
                  }}
                >
                  {machine_list.map((ele: MACHINE_LIST, index: number) => {
                    return (
                      <option key={index} value={ele.EQ_NAME}>
                        {ele.EQ_NAME}
                      </option>
                    );
                  })}
                </select>
              </label>
            </div>
          </div>
          <div className="formbutton">
            <label>
              <b>All Time:</b>
              <input
                onKeyDown={(e) => {
                  handleSearchCodeKeyDown(e);
                }}
                type="checkbox"
                name="alltimecheckbox"
                defaultChecked={alltime}
                onChange={() => setAllTime(!alltime)}
              ></input>
            </label>
            <button
              className="tranhatky"
              onClick={() => {
                handle_loaddatasx();
              }}
            >
              TRA LIỆU
            </button>
          </div>
        </div>
        <div className="tracuuYCSXTable">
          <div className="losstable" style={{ backgroundImage: theme.CMS.backgroundImage }}>
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

          {materialDataTableAG}
        </div>
        {showhidePivotTable && (
          <div className="pivottable1">
            <IconButton
              className="buttonIcon"
              onClick={() => {
                setShowHidePivotTable(false);
              }}
            >
              <AiFillCloseCircle color="blue" size={15} />
              Close
            </IconButton>
            <PivotTable datasource={dataSource} tableID="invoicetablepivot" />
          </div>
        )}
      </div>
    </div>
  );
};
export default TINHHINHCUONLIEU;

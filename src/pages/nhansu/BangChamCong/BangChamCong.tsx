import { Button, IconButton } from "@mui/material";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import Swal from "sweetalert2";
import "./BangChamCong.scss";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import { MdOutlinePivotTableChart } from "react-icons/md";
import { checkBP, f_setCaDiemDanh, weekdayarray } from "../../../api/GlobalFunction";
import { generalQuery } from "../../../api/Api";
import PivotTable from "../../../components/PivotChart/PivotChart";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import {
  BANGCHAMCONG_DATA,
  BANGCHAMCONG_DATA2,
  CA_INFO,
  IN_OUT_DATA,
  IN_OUT_DATA2,
  IN_OUT_DATA22,
  IN_OUT_DATA3,
  UserData,
} from "../../../api/GlobalInterface";
import AGTable from '../../../components/DataTable/AGTable';

const BANGCHAMCONG = () => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );

  const [cainfo, setCaInfo] = useState<CA_INFO[]>([]);
  const [bangchamcong, setBangChamCong] = useState<BANGCHAMCONG_DATA[]>([]);
  const [bangchamcong2, setBangChamCong2] = useState<BANGCHAMCONG_DATA2[]>([]);
  const selectedRows = useRef<BANGCHAMCONG_DATA2[]>([]);
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [alltime, setAllTime] = useState(false);
  const [trunghiviec, setTruNghiViec] = useState(true);
  const [trunghisinh, setTruNghiSinh] = useState(true);
  const columns = [
    {
      field: 'DATE_COLUMN',
      headerName: 'DATE_COLUMN',
      width: 120,
      type: 'date',
      checkboxSelection: true,
      headerCheckboxSelection: true
    },
    {
      field: 'WEEKDAY',
      headerName: 'WEEKDAY',
      width: 50,
      type: 'date'
    },
    {
      field: 'NV_CCID',
      headerName: 'NV_CCID',
      width: 50
    },
    {
      field: 'EMPL_NO',
      headerName: 'EMPL_NO',
      width: 50
    },
    {
      field: 'CMS_ID',
      headerName: 'NS_ID',
      width: 50
    },
    {
      field: 'FULL_NAME',
      headerName: 'FULL_NAME',
      width: 100,
      cellRenderer: (params: any) => {
        return <span style={{ color: "#013b92", fontWeight: "bold" }}>{params.data.FULL_NAME}</span>;
      } 
    },
    {
      field: 'FACTORY_NAME',
      headerName: 'FACTORY_NAME',
      width: 80
    },
    {
      field: 'WORK_SHIF_NAME',
      headerName: 'WORK_SHIFT_NAME',
      width: 100
    },
    {
      field: 'CALV',
      headerName: 'CALV',
      width: 60
    },
    {
      field: 'MAINDEPTNAME',
      headerName: 'MAINDEPTNAME',
      width: 80
    },
    {
      field: 'SUBDEPTNAME',
      headerName: 'SUBDEPTNAME',
      width: 80
    },
    {
      field: 'FIXED_IN_TIME',
      headerName: 'FIXED_IN_TIME',
      width: 100,
      cellRenderer: (params: any) => {
        if (params.data.FIXED_IN_TIME !== "OFF") {
          return <span style={{ color: "blue", fontWeight: "bold" }}>{params.data.FIXED_IN_TIME}</span>;
        } else {
          return <span style={{ color: "red", fontWeight: "bold" }}>{params.data.FIXED_IN_TIME}</span>;
        }
      }
    },
    {
      field: 'FIXED_OUT_TIME',
      headerName: 'FIXED_OUT_TIME',
      width: 100,
      cellRenderer: (params: any) => {
        if (params.data.FIXED_OUT_TIME !== "OFF") {
          return <span style={{ color: "blue", fontWeight: "bold" }}>{params.data.FIXED_OUT_TIME}</span>;
        } else {
          return <span style={{ color: "red", fontWeight: "bold" }}>{params.data.FIXED_OUT_TIME}</span>;
        }
      }
    },
    {
      field: 'IN_TIME',
      headerName: 'AUTO_IN_TIME',
      width: 100,
      cellRenderer: (params: any) => {
        if (params.value !== "Thiếu giờ vào") {
          return <span style={{ color: "blue", fontWeight: "bold" }}>{params.data.IN_TIME}</span>;
        } else {
          return <span style={{ color: "red", fontWeight: "bold" }}>{params.data.IN_TIME}</span>;
        }
      }
    },
    {
      field: 'OUT_TIME',
      headerName: 'AUTO_OUT_TIME',
      width: 100,
      cellRenderer: (params: any) => {
        if (params.value !== "Thiếu giờ ra") {
          return <span style={{ color: "blue", fontWeight: "bold" }}>{params.data.OUT_TIME}</span>;
        } else {
          return <span style={{ color: "red", fontWeight: "bold" }}>{params.data.OUT_TIME}</span>;
        }
      }
    },
    {
      field: 'STATUS',
      headerName: 'STATUS',
      width: 100,
      cellRenderer: (params: any) => {
        if (params.value !== "Thiếu công") {
          return <span style={{ color: "blue", fontWeight: "normal" }}>{params.data.STATUS}</span>;
        } else {
          return <span style={{ color: "red", fontWeight: "normal" }}>{params.data.STATUS}</span>;
        }
      }
    },
    {
      field: 'REASON_NAME',
      headerName: 'REASON_NAME',
      width: 100
    },
    {
      field: 'CHECK1',
      headerName: 'CHECK1',
      width: 100
    },
    {
      field: 'CHECK2',
      headerName: 'CHECK2',
      width: 100
    },
    {
      field: 'CHECK3',
      headerName: 'CHECK3',
      width: 100
    },
    {
      field: 'PREV_CHECK1',
      headerName: 'PREV_CHECK1',
      width: 100
    },
    {
      field: 'PREV_CHECK2',
      headerName: 'PREV_CHECK2',
      width: 100
    },
    {
      field: 'PREV_CHECK3',
      headerName: 'PREV_CHECK3',
      width: 100
    },
    {
      field: 'NEXT_CHECK1',
      headerName: 'NEXT_CHECK1',
      width: 100
    },
    {
      field: 'NEXT_CHECK2',
      headerName: 'NEXT_CHECK2',
      width: 100
    },
    {
      field: 'NEXT_CHECK3',
      headerName: 'NEXT_CHECK3',
      width: 100
    }
  ];
  const toolbar = (
    <>     
      <IconButton
        className='buttonIcon'
        onClick={() => {
          setShowHidePivotTable(!showhidePivotTable);
        }}
      >
        <MdOutlinePivotTableChart color='#ff33bb' size={15} />
        Pivot
      </IconButton>
    </>
  );
  const fields_chamcong: any = [
    {
      caption: "DATE_COLUMN",
      width: 80,
      dataField: "DATE_COLUMN",
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
      caption: "NV_CCID",
      width: 80,
      dataField: "NV_CCID",
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
      caption: "EMPL_NO",
      width: 80,
      dataField: "EMPL_NO",
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
      caption: "NS_ID",
      width: 80,
      dataField: "CMS_ID",
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
      caption: "MIDLAST_NAME",
      width: 80,
      dataField: "MIDLAST_NAME",
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
      caption: "FIRST_NAME",
      width: 80,
      dataField: "FIRST_NAME",
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
      caption: "PHONE_NUMBER",
      width: 80,
      dataField: "PHONE_NUMBER",
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
      caption: "SEX_NAME",
      width: 80,
      dataField: "SEX_NAME",
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
      caption: "WORK_STATUS_NAME",
      width: 80,
      dataField: "WORK_STATUS_NAME",
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
      caption: "FACTORY_NAME",
      width: 80,
      dataField: "FACTORY_NAME",
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
      caption: "JOB_NAME",
      width: 80,
      dataField: "JOB_NAME",
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
      caption: "WORK_SHIF_NAME",
      width: 80,
      dataField: "WORK_SHIF_NAME",
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
      caption: "WORK_POSITION_NAME",
      width: 80,
      dataField: "WORK_POSITION_NAME",
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
      caption: "SUBDEPTNAME",
      width: 80,
      dataField: "SUBDEPTNAME",
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
      caption: "MAINDEPTNAME",
      width: 80,
      dataField: "MAINDEPTNAME",
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
      caption: "REQUEST_DATE",
      width: 80,
      dataField: "REQUEST_DATE",
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
      caption: "APPLY_DATE",
      width: 80,
      dataField: "APPLY_DATE",
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
      caption: "APPROVAL_STATUS",
      width: 80,
      dataField: "APPROVAL_STATUS",
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
      caption: "OFF_ID",
      width: 80,
      dataField: "OFF_ID",
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
      caption: "CA_NGHI",
      width: 80,
      dataField: "CA_NGHI",
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
      caption: "ON_OFF",
      width: 80,
      dataField: "ON_OFF",
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
      caption: "OVERTIME_INFO",
      width: 80,
      dataField: "OVERTIME_INFO",
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
      caption: "OVERTIME",
      width: 80,
      dataField: "OVERTIME",
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
      caption: "REASON_NAME",
      width: 80,
      dataField: "REASON_NAME",
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
      caption: "REMARK",
      width: 80,
      dataField: "REMARK",
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
      caption: "XACNHAN",
      width: 80,
      dataField: "XACNHAN",
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
      caption: "CA_CODE",
      width: 80,
      dataField: "CA_CODE",
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
      caption: "CA_NAME",
      width: 80,
      dataField: "CA_NAME",
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
      caption: "IN_START",
      width: 80,
      dataField: "IN_START",
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
      caption: "IN_END",
      width: 80,
      dataField: "IN_END",
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
      caption: "OUT_START",
      width: 80,
      dataField: "OUT_START",
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
      caption: "OUT_END",
      width: 80,
      dataField: "OUT_END",
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
      caption: "CHECK_DATE",
      width: 80,
      dataField: "CHECK_DATE",
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
      caption: "CHECK1",
      width: 80,
      dataField: "CHECK1",
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
      caption: "CHECK2",
      width: 80,
      dataField: "CHECK2",
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
      caption: "CHECK3",
      width: 80,
      dataField: "CHECK3",
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
      caption: "CHECK4",
      width: 80,
      dataField: "CHECK4",
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
      caption: "CHECK5",
      width: 80,
      dataField: "CHECK5",
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
      caption: "CHECK6",
      width: 80,
      dataField: "CHECK6",
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
      caption: "CHECK_DATE2",
      width: 80,
      dataField: "CHECK_DATE2",
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
      caption: "CHECK12",
      width: 80,
      dataField: "CHECK12",
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
      caption: "CHECK22",
      width: 80,
      dataField: "CHECK22",
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
      caption: "CHECK32",
      width: 80,
      dataField: "CHECK32",
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
      caption: "CHECK42",
      width: 80,
      dataField: "CHECK42",
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
      caption: "CHECK52",
      width: 80,
      dataField: "CHECK52",
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
      caption: "CHECK62",
      width: 80,
      dataField: "CHECK62",
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
  ];
  const [selectedDataSource, setSelectedDataSource] =
    useState<PivotGridDataSource>(
      new PivotGridDataSource({
        fields: fields_chamcong,
        store: bangchamcong,
      })
    );
  const chamcongTBMM = React.useMemo(
    () => {    
      return (       
          <AGTable
          suppressRowClickSelection={false}
            data={bangchamcong2}
            columns={columns}
            toolbar={toolbar}
            onSelectionChange={(e) => {
              // Handle selection change
              selectedRows.current = e!.api.getSelectedRows();
            }}
          />       
      );
    },
    [bangchamcong2, showhidePivotTable]
  );
  const loadBangChamCong = () => {
    Swal.fire({
      title: "Tra data chấm công",
      text: "Đang tải dữ liệu, hãy chờ chút",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });
    generalQuery("loadC001", {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: BANGCHAMCONG_DATA[] = response.data.data.map(
            (element: BANGCHAMCONG_DATA, index: number) => {
              return {
                ...element,
                WEEKDAY: weekdayarray[new Date(element.DATE_COLUMN).getDay()],
                FULL_NAME: element.MIDLAST_NAME + " " + element.FIRST_NAME,
                DATE_COLUMN: element.DATE_COLUMN.substring(0, 10),
                APPLY_DATE:
                  element.APPLY_DATE !== null
                    ? moment.utc(element.APPLY_DATE).format("DD/MM/YYYY")
                    : "",
                CHECK_DATE0:
                  element.CHECK_DATE0 !== null
                    ? moment.utc(element.CHECK_DATE0).format("DD/MM/YYYY")
                    : "",
                CHECK_DATE:
                  element.CHECK_DATE2 !== null
                    ? moment.utc(element.CHECK_DATE).format("DD/MM/YYYY")
                    : "",
                CHECK_DATE2:
                  element.CHECK_DATE2 !== null
                    ? moment.utc(element.CHECK_DATE2).format("DD/MM/YYYY")
                    : "",
                CHECK10:
                  element.CHECK10 !== null
                    ? moment.utc(element.CHECK10).format("HH:mm:ss")
                    : "",
                CHECK20:
                  element.CHECK20 !== null
                    ? moment.utc(element.CHECK20).format("HH:mm:ss")
                    : "",
                CHECK30:
                  element.CHECK30 !== null
                    ? moment.utc(element.CHECK30).format("HH:mm:ss")
                    : "",
                CHECK40:
                  element.CHECK40 !== null
                    ? moment.utc(element.CHECK40).format("HH:mm:ss")
                    : "",
                CHECK50:
                  element.CHECK50 !== null
                    ? moment.utc(element.CHECK50).format("HH:mm:ss")
                    : "",
                CHECK60:
                  element.CHECK60 !== null
                    ? moment.utc(element.CHECK60).format("HH:mm:ss")
                    : "",
                CHECK1:
                  element.CHECK1 !== null
                    ? moment.utc(element.CHECK1).format("HH:mm:ss")
                    : "",
                CHECK2:
                  element.CHECK2 !== null
                    ? moment.utc(element.CHECK2).format("HH:mm:ss")
                    : "",
                CHECK3:
                  element.CHECK3 !== null
                    ? moment.utc(element.CHECK3).format("HH:mm:ss")
                    : "",
                CHECK4:
                  element.CHECK4 !== null
                    ? moment.utc(element.CHECK4).format("HH:mm:ss")
                    : "",
                CHECK5:
                  element.CHECK5 !== null
                    ? moment.utc(element.CHECK5).format("HH:mm:ss")
                    : "",
                CHECK6:
                  element.CHECK6 !== null
                    ? moment.utc(element.CHECK6).format("HH:mm:ss")
                    : "",
                CHECK12:
                  element.CHECK12 !== null
                    ? moment.utc(element.CHECK12).format("HH:mm:ss")
                    : "",
                CHECK22:
                  element.CHECK22 !== null
                    ? moment.utc(element.CHECK22).format("HH:mm:ss")
                    : "",
                CHECK32:
                  element.CHECK32 !== null
                    ? moment.utc(element.CHECK32).format("HH:mm:ss")
                    : "",
                CHECK42:
                  element.CHECK42 !== null
                    ? moment.utc(element.CHECK42).format("HH:mm:ss")
                    : "",
                CHECK52:
                  element.CHECK52 !== null
                    ? moment.utc(element.CHECK52).format("HH:mm:ss")
                    : "",
                CHECK62:
                  element.CHECK62 !== null
                    ? moment.utc(element.CHECK62).format("HH:mm:ss")
                    : "",
                IN_START:
                  element.IN_START !== null
                    ? moment.utc(element.IN_START).format("HH:mm")
                    : "",
                IN_END:
                  element.IN_END !== null
                    ? moment.utc(element.IN_END).format("HH:mm")
                    : "",
                OUT_START:
                  element.OUT_START !== null
                    ? moment.utc(element.OUT_START).format("HH:mm")
                    : "",
                OUT_END:
                  element.OUT_END !== null
                    ? moment.utc(element.OUT_END).format("HH:mm")
                    : "",
                IN_TIME: tinhInOutTime({
                  CA_CODE: element.CA_CODE,
                  IN_START:
                    element.IN_START !== null
                      ? moment.utc(element.IN_START).format("HH:mm")
                      : "",
                  IN_END:
                    element.IN_END !== null
                      ? moment.utc(element.IN_END).format("HH:mm")
                      : "",
                  OUT_START:
                    element.OUT_START !== null
                      ? moment.utc(element.OUT_START).format("HH:mm")
                      : "",
                  OUT_END:
                    element.OUT_END !== null
                      ? moment.utc(element.OUT_END).format("HH:mm")
                      : "",
                  CHECK10:
                    element.CHECK10 !== null
                      ? moment.utc(element.CHECK10).format("HH:mm")
                      : "",
                  CHECK20:
                    element.CHECK20 !== null
                      ? moment.utc(element.CHECK20).format("HH:mm")
                      : "",
                  CHECK30:
                    element.CHECK30 !== null
                      ? moment.utc(element.CHECK30).format("HH:mm")
                      : "",
                  CHECK40:
                    element.CHECK40 !== null
                      ? moment.utc(element.CHECK40).format("HH:mm")
                      : "",
                  CHECK50:
                    element.CHECK50 !== null
                      ? moment.utc(element.CHECK50).format("HH:mm")
                      : "",
                  CHECK60:
                    element.CHECK60 !== null
                      ? moment.utc(element.CHECK60).format("HH:mm")
                      : "",
                  CHECK1:
                    element.CHECK1 !== null
                      ? moment.utc(element.CHECK1).format("HH:mm")
                      : "",
                  CHECK2:
                    element.CHECK2 !== null
                      ? moment.utc(element.CHECK2).format("HH:mm")
                      : "",
                  CHECK3:
                    element.CHECK3 !== null
                      ? moment.utc(element.CHECK3).format("HH:mm")
                      : "",
                  CHECK4:
                    element.CHECK4 !== null
                      ? moment.utc(element.CHECK4).format("HH:mm")
                      : "",
                  CHECK5:
                    element.CHECK5 !== null
                      ? moment.utc(element.CHECK5).format("HH:mm")
                      : "",
                  CHECK6:
                    element.CHECK6 !== null
                      ? moment.utc(element.CHECK6).format("HH:mm")
                      : "",
                  CHECK12:
                    element.CHECK12 !== null
                      ? moment.utc(element.CHECK12).format("HH:mm")
                      : "",
                  CHECK22:
                    element.CHECK22 !== null
                      ? moment.utc(element.CHECK22).format("HH:mm")
                      : "",
                  CHECK32:
                    element.CHECK32 !== null
                      ? moment.utc(element.CHECK32).format("HH:mm")
                      : "",
                  CHECK42:
                    element.CHECK42 !== null
                      ? moment.utc(element.CHECK42).format("HH:mm")
                      : "",
                  CHECK52:
                    element.CHECK52 !== null
                      ? moment.utc(element.CHECK52).format("HH:mm")
                      : "",
                  CHECK62:
                    element.CHECK62 !== null
                      ? moment.utc(element.CHECK62).format("HH:mm")
                      : "",
                }).IN_TIME,
                OUT_TIME: tinhInOutTime({
                  CA_CODE: element.CA_CODE,
                  IN_START:
                    element.IN_START !== null
                      ? moment.utc(element.IN_START).format("HH:mm")
                      : "",
                  IN_END:
                    element.IN_END !== null
                      ? moment.utc(element.IN_END).format("HH:mm")
                      : "",
                  OUT_START:
                    element.OUT_START !== null
                      ? moment.utc(element.OUT_START).format("HH:mm")
                      : "",
                  OUT_END:
                    element.OUT_END !== null
                      ? moment.utc(element.OUT_END).format("HH:mm")
                      : "",
                  CHECK10:
                    element.CHECK10 !== null
                      ? moment.utc(element.CHECK10).format("HH:mm")
                      : "",
                  CHECK20:
                    element.CHECK20 !== null
                      ? moment.utc(element.CHECK20).format("HH:mm")
                      : "",
                  CHECK30:
                    element.CHECK30 !== null
                      ? moment.utc(element.CHECK30).format("HH:mm")
                      : "",
                  CHECK40:
                    element.CHECK40 !== null
                      ? moment.utc(element.CHECK40).format("HH:mm")
                      : "",
                  CHECK50:
                    element.CHECK50 !== null
                      ? moment.utc(element.CHECK50).format("HH:mm")
                      : "",
                  CHECK60:
                    element.CHECK60 !== null
                      ? moment.utc(element.CHECK60).format("HH:mm")
                      : "",
                  CHECK1:
                    element.CHECK1 !== null
                      ? moment.utc(element.CHECK1).format("HH:mm")
                      : "",
                  CHECK2:
                    element.CHECK2 !== null
                      ? moment.utc(element.CHECK2).format("HH:mm")
                      : "",
                  CHECK3:
                    element.CHECK3 !== null
                      ? moment.utc(element.CHECK3).format("HH:mm")
                      : "",
                  CHECK4:
                    element.CHECK4 !== null
                      ? moment.utc(element.CHECK4).format("HH:mm")
                      : "",
                  CHECK5:
                    element.CHECK5 !== null
                      ? moment.utc(element.CHECK5).format("HH:mm")
                      : "",
                  CHECK6:
                    element.CHECK6 !== null
                      ? moment.utc(element.CHECK6).format("HH:mm")
                      : "",
                  CHECK12:
                    element.CHECK12 !== null
                      ? moment.utc(element.CHECK12).format("HH:mm")
                      : "",
                  CHECK22:
                    element.CHECK22 !== null
                      ? moment.utc(element.CHECK22).format("HH:mm")
                      : "",
                  CHECK32:
                    element.CHECK32 !== null
                      ? moment.utc(element.CHECK32).format("HH:mm")
                      : "",
                  CHECK42:
                    element.CHECK42 !== null
                      ? moment.utc(element.CHECK42).format("HH:mm")
                      : "",
                  CHECK52:
                    element.CHECK52 !== null
                      ? moment.utc(element.CHECK52).format("HH:mm")
                      : "",
                  CHECK62:
                    element.CHECK62 !== null
                      ? moment.utc(element.CHECK62).format("HH:mm")
                      : "",
                }).OUT_TIME,
                id: index,
              };
            }
          );
          setBangChamCong(loaded_data);
          setSelectedDataSource(
            new PivotGridDataSource({
              fields: fields_chamcong,
              store: loaded_data,
            })
          );
          Swal.fire(
            "Thông báo",
            " Đã tải: " + loaded_data.length + " dòng ",
            "success"
          );
        } else {
          Swal.fire("Thông báo", " Có lỗi : " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
        Swal.fire("Thông báo", " Có lỗi : " + error, "error");
      });
  };
  const loadBangChamCong2 = () => {
    Swal.fire({
      title: "Tra data chấm công",
      text: "Đang tải dữ liệu, hãy chờ chút",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });
    generalQuery("loadC0012", {
      FROM_DATE: fromdate,
      TO_DATE: todate,
      TRUNGHIVIEC: trunghiviec,
      TRUNGHISINH: trunghisinh
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: BANGCHAMCONG_DATA2[] = response.data.data.map(
            (element: BANGCHAMCONG_DATA2, index: number) => {
              let inoutdata: { IN_TIME: string; OUT_TIME: string; } = tinhInOutTime3({                
                CALV:element.CALV,          
                CHECK1:element.CHECK1 !== null  ? moment.utc(element.CHECK1).format("HH:mm")  : "",
                CHECK2:element.CHECK2 !== null  ? moment.utc(element.CHECK2).format("HH:mm")  : "",
                CHECK3:element.CHECK3 !== null  ? moment.utc(element.CHECK3).format("HH:mm")  : "",
                PREV_CHECK1:element.PREV_CHECK1 !== null  ? moment.utc(element.PREV_CHECK1).format("HH:mm")  : "",
                PREV_CHECK2:element.PREV_CHECK2 !== null  ? moment.utc(element.PREV_CHECK2).format("HH:mm")  : "",
                PREV_CHECK3:element.PREV_CHECK3 !== null  ? moment.utc(element.PREV_CHECK3).format("HH:mm")  : "",
                NEXT_CHECK1:element.NEXT_CHECK1 !== null  ? moment.utc(element.NEXT_CHECK1).format("HH:mm")  : "",
                NEXT_CHECK2:element.NEXT_CHECK2 !== null  ? moment.utc(element.NEXT_CHECK2).format("HH:mm")  : "",
                NEXT_CHECK3:element.NEXT_CHECK3 !== null  ? moment.utc(element.NEXT_CHECK3).format("HH:mm")  : "",
              },);       
              /* const intime_calc: string = tinhInOutTime22({                
                SHIFT_NAME: element.WORK_SHIF_NAME,
                CHECK1:
                  element.CHECK1 !== null
                    ? moment.utc(element.CHECK1).format("HH:mm")
                    : "",
                CHECK2:
                  element.CHECK2 !== null
                    ? moment.utc(element.CHECK2).format("HH:mm")
                    : "",
                CHECK3:
                  element.CHECK3 !== null
                    ? moment.utc(element.CHECK3).format("HH:mm")
                    : "",
                PREV_CHECK1:
                  element.PREV_CHECK1 !== null
                    ? moment.utc(element.PREV_CHECK1).format("HH:mm")
                    : "",
                PREV_CHECK2:
                  element.PREV_CHECK2 !== null
                    ? moment.utc(element.PREV_CHECK2).format("HH:mm")
                    : "",
                PREV_CHECK3:
                  element.PREV_CHECK3 !== null
                    ? moment.utc(element.PREV_CHECK3).format("HH:mm")
                    : "",
                NEXT_CHECK1:
                  element.NEXT_CHECK1 !== null
                    ? moment.utc(element.NEXT_CHECK1).format("HH:mm")
                    : "",
                NEXT_CHECK2:
                  element.NEXT_CHECK2 !== null
                    ? moment.utc(element.NEXT_CHECK2).format("HH:mm")
                    : "",
                NEXT_CHECK3:
                  element.NEXT_CHECK3 !== null
                    ? moment.utc(element.NEXT_CHECK3).format("HH:mm")
                    : "",
              }).IN_TIME;
              const outtime_calc: string = tinhInOutTime22({
                SHIFT_NAME: element.WORK_SHIF_NAME,          
                CHECK1:
                  element.CHECK1 !== null
                    ? moment.utc(element.CHECK1).format("HH:mm")
                    : "",
                CHECK2:
                  element.CHECK2 !== null
                    ? moment.utc(element.CHECK2).format("HH:mm")
                    : "",
                CHECK3:
                  element.CHECK3 !== null
                    ? moment.utc(element.CHECK3).format("HH:mm")
                    : "",
                PREV_CHECK1:
                  element.PREV_CHECK1 !== null
                    ? moment.utc(element.PREV_CHECK1).format("HH:mm")
                    : "",
                PREV_CHECK2:
                  element.PREV_CHECK2 !== null
                    ? moment.utc(element.PREV_CHECK2).format("HH:mm")
                    : "",
                PREV_CHECK3:
                  element.PREV_CHECK3 !== null
                    ? moment.utc(element.PREV_CHECK3).format("HH:mm")
                    : "",
                NEXT_CHECK1:
                  element.NEXT_CHECK1 !== null
                    ? moment.utc(element.NEXT_CHECK1).format("HH:mm")
                    : "",
                NEXT_CHECK2:
                  element.NEXT_CHECK2 !== null
                    ? moment.utc(element.NEXT_CHECK2).format("HH:mm")
                    : "",
                NEXT_CHECK3:
                  element.NEXT_CHECK3 !== null
                    ? moment.utc(element.NEXT_CHECK3).format("HH:mm")
                    : "",
              }).OUT_TIME;
 */

              return {
                ...element,
                WEEKDAY: weekdayarray[new Date(element.DATE_COLUMN).getDay()],
                FULL_NAME: element.MIDLAST_NAME + " " + element.FIRST_NAME,
                DATE_COLUMN: element.DATE_COLUMN.substring(0, 10),
                CALV: element.CALV === 0 ? 'Hành Chính' : element.CALV === 1 ? 'Ca Ngày' : element.CALV === 2 ? 'Ca Đêm' : 'Không có ca',
                APPLY_DATE:
                  element.APPLY_DATE !== null
                    ? moment.utc(element.APPLY_DATE).format("YYYY-MM-DD")
                    : "",
                CHECK1:
                  element.CHECK1 !== null
                    ? moment.utc(element.CHECK1).format("HH:mm:ss")
                    : "",
                CHECK2:
                  element.CHECK2 !== null
                    ? moment.utc(element.CHECK2).format("HH:mm:ss")
                    : "",
                CHECK3:
                  element.CHECK3 !== null
                    ? moment.utc(element.CHECK3).format("HH:mm:ss")
                    : "",
                PREV_CHECK1:
                  element.PREV_CHECK1 !== null
                    ? moment.utc(element.PREV_CHECK1).format("HH:mm:ss")
                    : "",
                PREV_CHECK2:
                  element.PREV_CHECK2 !== null
                    ? moment.utc(element.PREV_CHECK2).format("HH:mm:ss")
                    : "",
                PREV_CHECK3:
                  element.PREV_CHECK3 !== null
                    ? moment.utc(element.PREV_CHECK3).format("HH:mm:ss")
                    : "",
                NEXT_CHECK1:
                  element.NEXT_CHECK1 !== null
                    ? moment.utc(element.NEXT_CHECK1).format("HH:mm:ss")
                    : "",
                NEXT_CHECK2:
                  element.NEXT_CHECK2 !== null
                    ? moment.utc(element.NEXT_CHECK2).format("HH:mm:ss")
                    : "",
                NEXT_CHECK3:
                  element.NEXT_CHECK3 !== null
                    ? moment.utc(element.NEXT_CHECK3).format("HH:mm:ss")
                    : "",
                IN_TIME: inoutdata.IN_TIME,
                OUT_TIME: inoutdata.OUT_TIME,
                FIXED_IN_TIME: element.FIXED_IN_TIME ?? "X",
                FIXED_OUT_TIME: element.FIXED_OUT_TIME ?? "X",
                STATUS: inoutdata.IN_TIME === 'Thiếu giờ vào' || inoutdata.OUT_TIME === 'Thiếu giờ ra' ? 'Thiếu công' : 'Đủ công',
                id: index,
              };
            }
          );
          setBangChamCong2(loaded_data);
          setSelectedDataSource(
            new PivotGridDataSource({
              fields: fields_chamcong,
              store: loaded_data,
            })
          );
          Swal.fire(
            "Thông báo",
            " Đã tải: " + loaded_data.length + " dòng, IN_TIME, OUT_TIME chỉ là dự đoán, có thể sai do chấm công không đúng quy định",
            "success"
          );
        } else {
          Swal.fire("Thông báo", " Có lỗi : " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
        Swal.fire("Thông báo", " Có lỗi : " + error, "error");
      });
  };
  const tinhInOutTime = (IO_DATA: IN_OUT_DATA) => {
    const in_start: number = moment(IO_DATA.IN_START, "HH:mm").valueOf();
    const in_end: number = moment(IO_DATA.IN_END, "HH:mm").valueOf();
    const out_start: number = moment(IO_DATA.OUT_START, "HH:mm").valueOf();
    const out_end: number = moment(IO_DATA.OUT_END, "HH:mm").valueOf();
    const check1_array: number[] = [
      IO_DATA.CHECK1 !== "" ? moment(IO_DATA.CHECK1, "HH:mm").valueOf() : 0,
      IO_DATA.CHECK2 !== "" ? moment(IO_DATA.CHECK2, "HH:mm").valueOf() : 0,
      IO_DATA.CHECK3 !== "" ? moment(IO_DATA.CHECK3, "HH:mm").valueOf() : 0,
      IO_DATA.CHECK4 !== "" ? moment(IO_DATA.CHECK4, "HH:mm").valueOf() : 0,
      IO_DATA.CHECK5 !== "" ? moment(IO_DATA.CHECK5, "HH:mm").valueOf() : 0,
      IO_DATA.CHECK6 !== "" ? moment(IO_DATA.CHECK6, "HH:mm").valueOf() : 0,
    ];
    const check2_array: number[] = [
      IO_DATA.CHECK12 !== "" ? moment(IO_DATA.CHECK12, "HH:mm").valueOf() : 0,
      IO_DATA.CHECK22 !== "" ? moment(IO_DATA.CHECK22, "HH:mm").valueOf() : 0,
      IO_DATA.CHECK32 !== "" ? moment(IO_DATA.CHECK32, "HH:mm").valueOf() : 0,
      IO_DATA.CHECK42 !== "" ? moment(IO_DATA.CHECK42, "HH:mm").valueOf() : 0,
      IO_DATA.CHECK52 !== "" ? moment(IO_DATA.CHECK52, "HH:mm").valueOf() : 0,
      IO_DATA.CHECK62 !== "" ? moment(IO_DATA.CHECK62, "HH:mm").valueOf() : 0,
    ];
    const check1_nozero: number[] = check1_array.filter(
      (ele: number, index: number) => ele !== 0
    );
    const check2_nozero: number[] = check2_array.filter(
      (ele: number, index: number) => ele !== 0
    );
    const check1_start_range: number[] = check1_nozero.filter(
      (ele: number, index: number) => ele >= in_start && ele <= in_end
    );
    const check1_end_range: number[] = check1_nozero.filter(
      (ele: number, index: number) => ele >= out_start && ele <= out_end
    );
    const check2_start_range: number[] = check2_nozero.filter(
      (ele: number, index: number) => ele >= in_start && ele <= in_end
    );
    const check2_end_range: number[] = check2_nozero.filter(
      (ele: number, index: number) => ele >= out_start && ele <= out_end
    );
    const mincheck1: number = Math.min.apply(Math, check1_nozero);
    const maxcheck1: number = Math.max.apply(Math, check1_nozero);
    //console.log('check1 start range', moment(check1_start_range).format('HH:mm'));
    //console.log('check2 end range', moment(check2_end_range).format('HH:mm'));
    //ca dem
    const minStartRange: number = Math.min.apply(Math, check1_start_range);
    const maxEndRange: number = Math.max.apply(Math, check2_end_range);
    //ca ngay
    const maxStartRange: number = Math.max.apply(Math, check1_end_range);
    //min of all check1
    const minAllCheck1: number = Math.min.apply(Math, check1_nozero);
    //max of all check1
    const maxAllCheck1: number = Math.max.apply(Math, check1_nozero);
    //max all check2
    const maxAllCheck2: number = Math.max.apply(Math, check2_nozero);
    let result = {
      IN_TIME: "",
      OUT_TIME: "",
    };
    if (IO_DATA.IN_START !== "") {
      switch (IO_DATA.CA_CODE) {
        case 0:
          result = {
            IN_TIME: moment(minStartRange).isValid()
              ? moment(minStartRange).format("HH:mm")
              : check1_nozero.length > 0
                ? moment(minAllCheck1).format("HH:mm")
                : "",
            OUT_TIME: moment(maxStartRange).isValid()
              ? moment(maxStartRange).format("HH:mm")
              : check1_nozero.length > 0
                ? moment(maxAllCheck1).format("HH:mm")
                : "",
          };
          break;
        case 1:
          result = {
            IN_TIME: moment(minStartRange).isValid()
              ? moment(minStartRange).format("HH:mm")
              : check1_nozero.length > 0
                ? moment(minAllCheck1).format("HH:mm")
                : "",
            OUT_TIME: moment(maxStartRange).isValid()
              ? moment(maxStartRange).format("HH:mm")
              : check1_nozero.length > 0
                ? moment(maxAllCheck1).format("HH:mm")
                : "",
          };
          break;
        case 2:
          result = {
            IN_TIME: moment(minStartRange).isValid()
              ? moment(minStartRange).format("HH:mm")
              : check1_nozero.length > 0
                ? moment(minAllCheck1).format("HH:mm")
                : "",
            OUT_TIME: moment(maxEndRange).isValid()
              ? moment(maxEndRange).format("HH:mm")
              : check2_nozero.length > 0
                ? moment(maxAllCheck2).format("HH:mm")
                : "",
          };
          break;
      }
    } else {
      result = {
        IN_TIME: "",
        OUT_TIME: "",
      };
    }
    //console.log(result);
    return result;
  };
  const tinhInOutTime2 = (IO_DATA: IN_OUT_DATA2) => {
    console.log(cainfo);
    let team = IO_DATA.SHIFT_NAME;
    let result = {
      IN_TIME: "",
      OUT_TIME: "",
    };
    const tgv: string = "Thiếu giờ vào";
    const tgr: string = "Thiếu giờ ra";
    const in_start1: number = moment(
      moment(cainfo[1].IN_START).format("HH:mm"),
      "HH:mm"
    ).valueOf();
    const check0_array: number[] = [
      IO_DATA.CHECK10 !== "" ? moment(IO_DATA.CHECK10, "HH:mm").valueOf() : 0,
      IO_DATA.CHECK20 !== "" ? moment(IO_DATA.CHECK20, "HH:mm").valueOf() : 0,
      IO_DATA.CHECK30 !== "" ? moment(IO_DATA.CHECK30, "HH:mm").valueOf() : 0,
      IO_DATA.CHECK40 !== "" ? moment(IO_DATA.CHECK40, "HH:mm").valueOf() : 0,
      IO_DATA.CHECK50 !== "" ? moment(IO_DATA.CHECK50, "HH:mm").valueOf() : 0,
      IO_DATA.CHECK60 !== "" ? moment(IO_DATA.CHECK60, "HH:mm").valueOf() : 0,
    ];
    const check1_array: number[] = [
      IO_DATA.CHECK1 !== "" ? moment(IO_DATA.CHECK1, "HH:mm").valueOf() : 0,
      IO_DATA.CHECK2 !== "" ? moment(IO_DATA.CHECK2, "HH:mm").valueOf() : 0,
      IO_DATA.CHECK3 !== "" ? moment(IO_DATA.CHECK3, "HH:mm").valueOf() : 0,
      IO_DATA.CHECK4 !== "" ? moment(IO_DATA.CHECK4, "HH:mm").valueOf() : 0,
      IO_DATA.CHECK5 !== "" ? moment(IO_DATA.CHECK5, "HH:mm").valueOf() : 0,
      IO_DATA.CHECK6 !== "" ? moment(IO_DATA.CHECK6, "HH:mm").valueOf() : 0,
    ];
    const check2_array: number[] = [
      IO_DATA.CHECK12 !== "" ? moment(IO_DATA.CHECK12, "HH:mm").valueOf() : 0,
      IO_DATA.CHECK22 !== "" ? moment(IO_DATA.CHECK22, "HH:mm").valueOf() : 0,
      IO_DATA.CHECK32 !== "" ? moment(IO_DATA.CHECK32, "HH:mm").valueOf() : 0,
      IO_DATA.CHECK42 !== "" ? moment(IO_DATA.CHECK42, "HH:mm").valueOf() : 0,
      IO_DATA.CHECK52 !== "" ? moment(IO_DATA.CHECK52, "HH:mm").valueOf() : 0,
      IO_DATA.CHECK62 !== "" ? moment(IO_DATA.CHECK62, "HH:mm").valueOf() : 0,
    ];
    const check0_nozero: number[] = check0_array.filter(
      (ele: number, index: number) => ele !== 0
    );
    const check1_nozero: number[] = check1_array.filter(
      (ele: number, index: number) => ele !== 0
    );
    const check2_nozero: number[] = check2_array.filter(
      (ele: number, index: number) => ele !== 0
    );
    const mincheck0: number = Math.min.apply(Math, check0_nozero);
    const maxcheck0: number = Math.max.apply(Math, check0_nozero);
    const mincheck1: number = Math.min.apply(Math, check1_nozero);
    const maxcheck1: number = Math.max.apply(Math, check1_nozero);
    const mincheck2: number = Math.min.apply(Math, check2_nozero);
    const maxcheck2: number = Math.max.apply(Math, check2_nozero);
    if (team === "TEAM 1" || team === "TEAM 2" || team === "TEAM 12T") {
      const in_start1: number = moment(
        cainfo[1].IN_START.substring(11, 16),
        "HH:mm"
      ).valueOf();
      const in_end1: number = moment(
        cainfo[1].IN_END.substring(11, 16),
        "HH:mm"
      ).valueOf();
      const out_start1: number = moment(
        cainfo[1].OUT_START.substring(11, 16),
        "HH:mm"
      ).valueOf();
      const out_end1: number = moment(
        cainfo[1].OUT_END.substring(11, 16),
        "HH:mm"
      ).valueOf();
      const in_start2: number = moment(
        cainfo[2].IN_START.substring(11, 16),
        "HH:mm"
      ).valueOf();
      const in_end2: number = moment(
        cainfo[2].IN_END.substring(11, 16),
        "HH:mm"
      ).valueOf();
      const out_start2: number = moment(
        cainfo[2].OUT_START.substring(11, 16),
        "HH:mm"
      ).valueOf();
      const out_end2: number = moment(
        cainfo[2].OUT_END.substring(11, 16),
        "HH:mm"
      ).valueOf();
      let check1check: string = "NA";
      if (mincheck1 >= in_start1 && mincheck1 <= in_end1) {
        check1check = "VAOCA1";
      } else if (mincheck1 >= in_start2 && mincheck1 <= in_end2) {
        check1check = "VAOCA2";
      }
      if (mincheck1 >= out_start1 && mincheck1 <= out_end1) {
        check1check = "RACA1";
      } else if (mincheck1 >= out_start2 && mincheck1 <= out_end2) {
        check1check = "RACA2";
      }
      let check1maxcheck: string = "NA";
      if (maxcheck1 >= in_start1 && maxcheck1 <= in_end1) {
        check1maxcheck = "VAOCA1";
      } else if (maxcheck1 >= in_start2 && maxcheck1 <= in_end2) {
        check1maxcheck = "VAOCA2";
      }
      if (maxcheck1 >= out_start1 && maxcheck1 <= out_end1) {
        check1maxcheck = "RACA1";
      } else if (maxcheck1 >= out_start2 && maxcheck1 <= out_end2) {
        check1maxcheck = "RACA2";
      }
      let check0check: string = "NA";
      if (maxcheck0 >= out_start1 && maxcheck0 <= out_end1) {
        check0check = "RACA1";
      } else if (maxcheck0 >= out_start2 && maxcheck0 <= out_end2) {
        check0check = "RACA2";
      }
      if (maxcheck0 >= in_start1 && maxcheck0 <= in_end1) {
        check0check = "VAOCA1";
      } else if (maxcheck0 >= in_start2 && maxcheck0 <= in_end2) {
        check0check = "VAOCA2";
      }
      let final_ca: string = "NA";
      if (check1check === "VAOCA1" && check1maxcheck === "RACA1") {
        final_ca = "CA1"; //
      } else if (check1check === "RACA2" && check1maxcheck === "VAOCA2") {
        final_ca = "CA2"; //
      } else {
        final_ca = "NA";
      }
      console.log("check1check", check1check);
      console.log("check0check", check0check);
      console.log("final ca", final_ca);
      const in_start: number = final_ca === "CA1" ? in_start1 : in_start2;
      const in_end: number = final_ca === "CA1" ? in_end1 : in_end2;
      const out_start: number = final_ca === "CA1" ? out_start1 : out_start2;
      const out_end: number = final_ca === "CA1" ? out_end1 : out_end2;
      const check0_start_range: number[] = check0_nozero.filter(
        (ele: number, index: number) => ele >= in_start && ele <= in_end
      );
      const check0_end_range: number[] = check0_nozero.filter(
        (ele: number, index: number) => ele >= out_start && ele <= out_end
      );
      const check1_start_range: number[] = check1_nozero.filter(
        (ele: number, index: number) => ele >= in_start && ele <= in_end
      );
      const check1_end_range: number[] = check1_nozero.filter(
        (ele: number, index: number) => ele >= out_start && ele <= out_end
      );
      const check2_start_range: number[] = check2_nozero.filter(
        (ele: number, index: number) => ele >= in_start && ele <= in_end
      );
      const check2_end_range: number[] = check2_nozero.filter(
        (ele: number, index: number) => ele >= out_start && ele <= out_end
      );
      //ca dem
      const minStartRange: number = Math.min.apply(Math, check1_start_range);
      const maxEndRange: number = Math.max.apply(Math, check2_end_range);
      //ca ngay
      const maxStartRange: number = Math.max.apply(Math, check1_end_range);
      //min of all check0
      const minAllCheck0: number = Math.min.apply(Math, check0_nozero);
      //max of all check0
      const maxAllCheck0: number = Math.max.apply(Math, check0_nozero);
      //min of all check1
      const minAllCheck1: number = Math.min.apply(Math, check1_nozero);
      //max of all check1
      const maxAllCheck1: number = Math.max.apply(Math, check1_nozero);
      //max all check2
      const maxAllCheck2: number = Math.max.apply(Math, check2_nozero);
      switch (final_ca) {
        case "CA1":
          var temp1_intime =
            check1_nozero.length > 0 ? moment(mincheck1).format("HH:mm") : tgv;
          let temp1_outtime =
            check1_nozero.length > 0 ? moment(maxcheck1).format("HH:mm") : tgv;
          let checkthieu: string = "NA";
          if (mincheck1 >= in_start1 && mincheck1 <= in_end1) {
            checkthieu = tgr;
          }
          if (mincheck1 === maxcheck1) {
            result = {
              IN_TIME: checkthieu === tgr ? temp1_intime : tgv,
              OUT_TIME: checkthieu !== tgr ? temp1_outtime : tgr,
            };
          } else {
            result = {
              IN_TIME: temp1_intime,
              OUT_TIME: temp1_outtime,
            };
          }
          /*  result= {
                        IN_TIME: moment(minStartRange).isValid()?  moment(minStartRange).format('HH:mm'): check1_nozero.length>0? moment(minAllCheck1).format('HH:mm'): tgv,
                        OUT_TIME: moment(maxStartRange).isValid()?  moment(maxStartRange).format('HH:mm'):check1_nozero.length>0? moment(maxAllCheck1).format('HH:mm'): tgr,
                    } */
          break;
        case "CA2":
          result = {
            IN_TIME: moment(minStartRange).isValid()
              ? moment(minStartRange).format("HH:mm")
              : check1_nozero.length > 0
                ? moment(minAllCheck1).format("HH:mm")
                : tgv,
            OUT_TIME: moment(maxEndRange).isValid()
              ? moment(maxEndRange).format("HH:mm")
              : check2_nozero.length > 0
                ? moment(maxAllCheck2).format("HH:mm")
                : tgr,
          };
          break;
        default:
          let temp_intime =
            check1_nozero.length > 0
              ? moment(minAllCheck1).format("HH:mm")
              : tgv;
          let temp_outtime =
            check1_nozero.length > 0
              ? moment(maxAllCheck1).format("HH:mm")
              : tgv;
          result = {
            IN_TIME: temp_intime === temp_outtime ? temp_intime : tgv,
            OUT_TIME: temp_intime === temp_outtime ? tgr : temp_outtime,
          };
          break;
      }
    } else {
      const in_start: number = moment(
        cainfo[0].IN_START.substring(11, 16),
        "HH:mm"
      ).valueOf();
      const in_end: number = moment(
        cainfo[0].IN_END.substring(11, 16),
        "HH:mm"
      ).valueOf();
      const out_start: number = moment(
        cainfo[0].OUT_START.substring(11, 16),
        "HH:mm"
      ).valueOf();
      const out_end: number = moment(
        cainfo[0].OUT_END.substring(11, 16),
        "HH:mm"
      ).valueOf();
      let temp_intime =
        check1_nozero.length > 0 ? moment(mincheck1).format("HH:mm") : tgv;
      let temp_outtime =
        check1_nozero.length > 0 ? moment(maxcheck1).format("HH:mm") : tgr;
      let checkthieu: string = "NA";
      if (mincheck1 >= in_start && mincheck1 <= in_end) {
        checkthieu = tgr;
      }
      if (mincheck1 === maxcheck1) {
        result = {
          IN_TIME: checkthieu === tgr ? temp_intime : tgv,
          OUT_TIME: checkthieu !== tgr ? temp_outtime : tgr,
        };
      } else {
        result = {
          IN_TIME: temp_intime,
          OUT_TIME: temp_outtime,
        };
      }
    }
    return result;
  };
  const tinhInOutTime22 = (IO_DATA: IN_OUT_DATA22) => {
    //console.log(cainfo);
    let team = IO_DATA.SHIFT_NAME;
    let result = {
      IN_TIME: "",
      OUT_TIME: "",
    };
    const tgv: string = "Thiếu giờ vào";
    const tgr: string = "Thiếu giờ ra";
    const check0_array: number[] = [
      IO_DATA.PREV_CHECK1 !== ""
        ? moment(IO_DATA.PREV_CHECK1, "HH:mm").valueOf()
        : 0,
      IO_DATA.PREV_CHECK2 !== ""
        ? moment(IO_DATA.PREV_CHECK2, "HH:mm").valueOf()
        : 0,
      IO_DATA.PREV_CHECK3 !== ""
        ? moment(IO_DATA.PREV_CHECK3, "HH:mm").valueOf()
        : 0,
    ];
    const check1_array: number[] = [
      IO_DATA.CHECK1 !== "" ? moment(IO_DATA.CHECK1, "HH:mm").valueOf() : 0,
      IO_DATA.CHECK2 !== "" ? moment(IO_DATA.CHECK2, "HH:mm").valueOf() : 0,
      IO_DATA.CHECK3 !== "" ? moment(IO_DATA.CHECK3, "HH:mm").valueOf() : 0,
    ];
    const check2_array: number[] = [
      IO_DATA.NEXT_CHECK1 !== ""
        ? moment(IO_DATA.NEXT_CHECK1, "HH:mm").valueOf()
        : 0,
      IO_DATA.NEXT_CHECK2 !== ""
        ? moment(IO_DATA.NEXT_CHECK2, "HH:mm").valueOf()
        : 0,
      IO_DATA.NEXT_CHECK3 !== ""
        ? moment(IO_DATA.NEXT_CHECK3, "HH:mm").valueOf()
        : 0,
    ];
    const check0_nozero: number[] = check0_array.filter(
      (ele: number, index: number) => ele !== 0
    );
    const check1_nozero: number[] = check1_array.filter(
      (ele: number, index: number) => ele !== 0
    );
    const check2_nozero: number[] = check2_array.filter(
      (ele: number, index: number) => ele !== 0
    );
    const mincheck0: number = Math.min.apply(Math, check0_nozero);
    const maxcheck0: number = Math.max.apply(Math, check0_nozero);
    const mincheck1: number = Math.min.apply(Math, check1_nozero);
    const maxcheck1: number = Math.max.apply(Math, check1_nozero);
    const mincheck2: number = Math.min.apply(Math, check2_nozero);
    const maxcheck2: number = Math.max.apply(Math, check2_nozero);
    if (team === "TEAM 1" || team === "TEAM 2" || team === "TEAM 12T") {
      /*  const in_start1: number = moment(cainfo[1].IN_START.substring(11,16),'HH:mm').valueOf();
            const in_end1: number = moment(cainfo[1].IN_END.substring(11,16),'HH:mm').valueOf();
            const out_start1: number = moment(cainfo[1].OUT_START.substring(11,16),'HH:mm').valueOf();
            const out_end1: number = moment(cainfo[1].OUT_END.substring(11,16),'HH:mm').valueOf();
            const in_start2: number = moment(cainfo[2].IN_START.substring(11,16),'HH:mm').valueOf();
            const in_end2: number = moment(cainfo[2].IN_END.substring(11,16),'HH:mm').valueOf();
            const out_start2: number = moment(cainfo[2].OUT_START.substring(11,16),'HH:mm').valueOf();
            const out_end2: number = moment(cainfo[2].OUT_END.substring(11,16),'HH:mm').valueOf();  */
      const in_start1: number = moment("05:30", "HH:mm").valueOf();
      const in_end1: number = moment("07:59", "HH:mm").valueOf();
      const out_start1: number = moment("20:00", "HH:mm").valueOf();
      const out_end1: number = moment("22:00", "HH:mm").valueOf();
      const in_start2: number = moment("17:30", "HH:mm").valueOf();
      const in_end2: number = moment("19:59", "HH:mm").valueOf();
      const out_start2: number = moment("08:00", "HH:mm").valueOf();
      const out_end2: number = moment("10:00", "HH:mm").valueOf();
      let check1check: string = "NA";
      if (mincheck1 >= in_start1 && mincheck1 <= in_end1) {
        check1check = "VAOCA1";
      } else if (mincheck1 >= in_start2 && mincheck1 <= in_end2) {
        check1check = "VAOCA2";
      }
      if (mincheck1 >= out_start1 && mincheck1 <= out_end1) {
        check1check = "RACA1";
      } else if (mincheck1 >= out_start2 && mincheck1 <= out_end2) {
        check1check = "RACA2";
      }
      let check1maxcheck: string = "NA";
      if (maxcheck1 >= in_start1 && maxcheck1 <= in_end1) {
        check1maxcheck = "VAOCA1";
      } else if (maxcheck1 >= in_start2 && maxcheck1 <= in_end2) {
        check1maxcheck = "VAOCA2";
      }
      if (maxcheck1 >= out_start1 && maxcheck1 <= out_end1) {
        check1maxcheck = "RACA1";
      } else if (maxcheck1 >= out_start2 && maxcheck1 <= out_end2) {
        check1maxcheck = "RACA2";
      }
      let check0check: string = "NA";
      if (mincheck0 >= out_start1 && mincheck0 <= out_end1) {
        check0check = "RACA1";
      } else if (mincheck0 >= out_start2 && mincheck0 <= out_end2) {
        check0check = "RACA2";
      }
      if (mincheck0 >= in_start1 && mincheck0 <= in_end1) {
        check0check = "VAOCA1";
      } else if (mincheck0 >= in_start2 && mincheck0 <= in_end2) {
        check0check = "VAOCA2";
      }
      let check0maxcheck: string = "NA";
      if (maxcheck0 >= out_start1 && maxcheck0 <= out_end1) {
        check0maxcheck = "RACA1";
      } else if (maxcheck0 >= out_start2 && maxcheck0 <= out_end2) {
        check0maxcheck = "RACA2";
      }
      if (maxcheck0 >= in_start1 && maxcheck0 <= in_end1) {
        check0maxcheck = "VAOCA1";
      } else if (maxcheck0 >= in_start2 && maxcheck0 <= in_end2) {
        check0maxcheck = "VAOCA2";
      }
      let final_ca: string = "NA";
      if (check0check === "NA") {
        if (check1check === "VAOCA1") {
          final_ca = "CA1";
        } else if (check1check === "VAOCA2") {
          final_ca = "CA2";
        }
      } else {
        if (check1check === "RACA2" && check0check === "RACA2") {
          final_ca = "CA2";
        } else if (check0check === "VAOCA1" && check1check === "VAOCA2") {
          if (check0maxcheck === "RACA2") {
            final_ca = "CA2";
          } else if (check0maxcheck === "RACA1") {
            final_ca = "CA1";
          } else if (check0maxcheck === "VAOCA1") {
            final_ca = "CA2";
          }
        } else if (check1check === "RACA2" && check0maxcheck === "VAOCA2") {
          final_ca = "CA2";
        } else {
          final_ca = "CA1";
        }
      }
      /* console.log("check1check", check1check);
      console.log("check0check", check0check);
      console.log("check0maxcheck", check0maxcheck); */
      /* console.log("final ca", final_ca); */
      const in_start: number = final_ca === "CA1" ? in_start1 : in_start2;
      const in_end: number = final_ca === "CA1" ? in_end1 : in_end2;
      const out_start: number = final_ca === "CA1" ? out_start1 : out_start2;
      const out_end: number = final_ca === "CA1" ? out_end1 : out_end2;
      const check0_start_range: number[] = check0_nozero.filter(
        (ele: number, index: number) => ele >= in_start && ele <= in_end
      );
      const check0_end_range: number[] = check0_nozero.filter(
        (ele: number, index: number) => ele >= out_start && ele <= out_end
      );
      const check1_start_range: number[] = check1_nozero.filter(
        (ele: number, index: number) => ele >= in_start && ele <= in_end
      );
      const check1_end_range: number[] = check1_nozero.filter(
        (ele: number, index: number) => ele >= out_start && ele <= out_end
      );
      const check2_start_range: number[] = check2_nozero.filter(
        (ele: number, index: number) => ele >= in_start && ele <= in_end
      );
      const check2_end_range: number[] = check2_nozero.filter(
        (ele: number, index: number) => ele >= out_start && ele <= out_end
      );
      
      //ca dem
      const minStartRange: number = Math.min.apply(Math, check1_start_range);
      const maxEndRange: number = Math.max.apply(Math, check2_end_range);
      //ca ngay
      const maxStartRange: number = Math.max.apply(Math, check1_end_range);
      //min of all check0
      const minAllCheck0: number = Math.min.apply(Math, check0_nozero);
      //max of all check0
      const maxAllCheck0: number = Math.max.apply(Math, check0_nozero);
      //min of all check1
      const minAllCheck1: number = Math.min.apply(Math, check1_nozero);
      //max of all check1
      const maxAllCheck1: number = Math.max.apply(Math, check1_nozero);
      //max all check2
      const minAllCheck2: number = Math.min.apply(Math, check2_nozero);
      const maxAllCheck2: number = Math.max.apply(Math, check2_nozero);
      switch (final_ca) {
        case "CA1":
          var temp1_intime =
            check1_nozero.length > 0 ? moment(mincheck1).format("HH:mm") : tgv;
          let temp1_outtime =
            check1_nozero.length > 0 ? moment(maxcheck1).format("HH:mm") : tgv;
          let checkthieu: string = "NA";
          if (mincheck1 >= in_start1 && mincheck1 <= in_end1) {
            checkthieu = tgr;
          }
          if (mincheck1 === maxcheck1) {
            result = {
              IN_TIME: checkthieu === tgr ? temp1_intime : tgv,
              OUT_TIME: checkthieu !== tgr ? temp1_outtime : tgr,
            };
          } else {
            result = {
              IN_TIME: temp1_intime,
              OUT_TIME: temp1_outtime,
            };
          }
          /*  result= {
                        IN_TIME: moment(minStartRange).isValid()?  moment(minStartRange).format('HH:mm'): check1_nozero.length>0? moment(minAllCheck1).format('HH:mm'): tgv,
                        OUT_TIME: moment(maxStartRange).isValid()?  moment(maxStartRange).format('HH:mm'):check1_nozero.length>0? moment(maxAllCheck1).format('HH:mm'): tgr,
                    } */
          break;
        case "CA2":
          //console.log("dang tinh inout ca 2");
          result = {
            IN_TIME:
              check1_nozero.length > 0
                ? moment(maxAllCheck1).format("HH:mm")
                : tgv,
            OUT_TIME:
              check2_nozero.length > 0
                ? moment(minAllCheck2).format("HH:mm")
                : tgr,
          };
          break;
        default:
          let temp_intime =
            check1_nozero.length > 0
              ? moment(minAllCheck1).format("HH:mm")
              : tgv;
          let temp_outtime =
            check1_nozero.length > 0
              ? moment(maxAllCheck1).format("HH:mm")
              : tgv;
          result = {
            IN_TIME: temp_intime === temp_outtime ? temp_intime : tgv,
            OUT_TIME: temp_intime === temp_outtime ? tgr : temp_outtime,
          };
          break;
      }
    } else {
      const in_start: number = moment(
        cainfo[0].IN_START.substring(11, 16),
        "HH:mm"
      ).valueOf();
      const in_end: number = moment(
        cainfo[0].IN_END.substring(11, 16),
        "HH:mm"
      ).valueOf();
      const out_start: number = moment(
        cainfo[0].OUT_START.substring(11, 16),
        "HH:mm"
      ).valueOf();
      const out_end: number = moment(
        cainfo[0].OUT_END.substring(11, 16),
        "HH:mm"
      ).valueOf();
      let temp_intime =
        check1_nozero.length > 0 ? moment(mincheck1).format("HH:mm") : tgv;
      let temp_outtime =
        check1_nozero.length > 0 ? moment(maxcheck1).format("HH:mm") : tgr;
      let checkthieu: string = "NA";
      if (mincheck1 >= in_start && mincheck1 <= in_end) {
        checkthieu = tgr;
      }
      if (mincheck1 === maxcheck1) {
        result = {
          IN_TIME: checkthieu === tgr ? temp_intime : tgv,
          OUT_TIME: checkthieu !== tgr ? temp_outtime : tgr,
        };
      } else {
        result = {
          IN_TIME: temp_intime,
          OUT_TIME: temp_outtime,
        };
      }
    }
    return result;
  };
  const tinhInOutTime3 = (IO_DATA: IN_OUT_DATA3) => {
    //console.log(cainfo);
    let team = (IO_DATA.CALV === 0 || IO_DATA.CALV === 1) ? 'CA1' : IO_DATA.CALV === 2 ? 'CA2' : 'Chưa có ca';
    let result = {
      IN_TIME: "",
      OUT_TIME: "",
    };
    const tgv: string = "Thiếu giờ vào";
    const tgr: string = "Thiếu giờ ra";
    const check0_array: number[] = [
      IO_DATA.PREV_CHECK1 !== ""
        ? moment(IO_DATA.PREV_CHECK1, "HH:mm").valueOf()
        : 0,
      IO_DATA.PREV_CHECK2 !== ""
        ? moment(IO_DATA.PREV_CHECK2, "HH:mm").valueOf()
        : 0,
      IO_DATA.PREV_CHECK3 !== ""
        ? moment(IO_DATA.PREV_CHECK3, "HH:mm").valueOf()
        : 0,
    ];
    const check1_array: number[] = [
      IO_DATA.CHECK1 !== "" ? moment(IO_DATA.CHECK1, "HH:mm").valueOf() : 0,
      IO_DATA.CHECK2 !== "" ? moment(IO_DATA.CHECK2, "HH:mm").valueOf() : 0,
      IO_DATA.CHECK3 !== "" ? moment(IO_DATA.CHECK3, "HH:mm").valueOf() : 0,
    ];
    const check2_array: number[] = [
      IO_DATA.NEXT_CHECK1 !== ""
        ? moment(IO_DATA.NEXT_CHECK1, "HH:mm").valueOf()
        : 0,
      IO_DATA.NEXT_CHECK2 !== ""
        ? moment(IO_DATA.NEXT_CHECK2, "HH:mm").valueOf()
        : 0,
      IO_DATA.NEXT_CHECK3 !== ""
        ? moment(IO_DATA.NEXT_CHECK3, "HH:mm").valueOf()
        : 0,
    ];
    const check0_nozero: number[] = check0_array.filter(
      (ele: number, index: number) => ele !== 0
    );
    const check1_nozero: number[] = check1_array.filter(
      (ele: number, index: number) => ele !== 0
    );
    const check2_nozero: number[] = check2_array.filter(
      (ele: number, index: number) => ele !== 0
    );
    const mincheck0: number = Math.min.apply(Math, check0_nozero);
    const maxcheck0: number = Math.max.apply(Math, check0_nozero);
    const mincheck1: number = Math.min.apply(Math, check1_nozero);
    const maxcheck1: number = Math.max.apply(Math, check1_nozero);
    const mincheck2: number = Math.min.apply(Math, check2_nozero);
    const maxcheck2: number = Math.max.apply(Math, check2_nozero);
    if (IO_DATA.CALV === 1 || IO_DATA.CALV === 2) {
      const in_start1: number = moment("05:30", "HH:mm").valueOf();
      const in_end1: number = moment("08:00", "HH:mm").valueOf();
      const out_start1: number = moment("20:00", "HH:mm").valueOf();
      const out_end1: number = moment("22:00", "HH:mm").valueOf();
      const in_start2: number = moment("17:30", "HH:mm").valueOf();
      const in_end2: number = moment("20:00", "HH:mm").valueOf();
      const out_start2: number = moment("08:00", "HH:mm").valueOf();
      const out_end2: number = moment("10:00", "HH:mm").valueOf();

    /*const in_start1: number = moment(cainfo[1].IN_START.substring(11,16),'HH:mm').valueOf();
      const in_end1: number = moment(cainfo[1].IN_END.substring(11,16),'HH:mm').valueOf();
      const out_start1: number = moment(cainfo[1].OUT_START.substring(11,16),'HH:mm').valueOf();
      const out_end1: number = moment(cainfo[1].OUT_END.substring(11,16),'HH:mm').valueOf();
      const in_start2: number = moment(cainfo[2].IN_START.substring(11,16),'HH:mm').valueOf();
      const in_end2: number = moment(cainfo[2].IN_END.substring(11,16),'HH:mm').valueOf();
      const out_start2: number = moment(cainfo[2].OUT_START.substring(11,16),'HH:mm').valueOf();
      const out_end2: number = moment(cainfo[2].OUT_END.substring(11,16),'HH:mm').valueOf();  */

      /* console.log("check1check", check1check);
      console.log("check0check", check0check);
      console.log("check0maxcheck", check0maxcheck); */
      /* console.log("final ca", final_ca); */
      const in_start: number = IO_DATA.CALV === 1 ? in_start1 : in_start2;
      const in_end: number = IO_DATA.CALV === 1 ? in_end1 : in_end2;
      const out_start: number = IO_DATA.CALV === 1 ? out_start1 : out_start2;
      const out_end: number = IO_DATA.CALV === 1 ? out_end1 : out_end2;
      const check0_start_range: number[] = check0_nozero.filter(
        (ele: number, index: number) => ele >= in_start && ele <= in_end
      );
      const check0_end_range: number[] = check0_nozero.filter(
        (ele: number, index: number) => ele >= out_start && ele <= out_end
      );
      const check1_start_range: number[] = check1_nozero.filter(
        (ele: number, index: number) => ele >= in_start && ele <= in_end
      );
      const check1_end_range: number[] = check1_nozero.filter(
        (ele: number, index: number) => ele >= out_start && ele <= out_end
      );
      const check2_start_range: number[] = check2_nozero.filter(
        (ele: number, index: number) => ele >= in_start && ele <= in_end
      );
      const check2_end_range: number[] = check2_nozero.filter(
        (ele: number, index: number) => ele >= out_start && ele <= out_end
      );

      //ca dem
      const minStartRange: number = Math.min.apply(Math, check1_start_range);
      const maxEndRange: number = Math.max.apply(Math, check2_end_range);
      //ca ngay
      const maxStartRange: number = Math.max.apply(Math, check1_end_range);
      //min of all check0
      const minAllCheck0: number = Math.min.apply(Math, check0_nozero);
      //max of all check0
      const maxAllCheck0: number = Math.max.apply(Math, check0_nozero);
      //min of all check1
      const minAllCheck1: number = Math.min.apply(Math, check1_nozero);
      //max of all check1
      const maxAllCheck1: number = Math.max.apply(Math, check1_nozero);
      //max all check2
      const minAllCheck2: number = Math.min.apply(Math, check2_nozero);
      const maxAllCheck2: number = Math.max.apply(Math, check2_nozero);     
      
      switch (IO_DATA.CALV) {
        case 1:
          let temp1_intime =
            check1_nozero.length > 0 ? moment(mincheck1).format("HH:mm") : tgv;
          let temp1_outtime =
            check1_nozero.length > 0 ? moment(maxcheck1).format("HH:mm") : tgr;
          let checkthieu: string = "NA";
          if (mincheck1 >= in_start1 && mincheck1 <= in_end1) {
            checkthieu = tgr;
          }
          if (mincheck1 === maxcheck1) {
            result = {
              IN_TIME: checkthieu === tgr ? temp1_intime : tgv,
              OUT_TIME: checkthieu !== tgr ? temp1_outtime : tgr,
            };
          } else {
            result = {
              IN_TIME: temp1_intime,
              OUT_TIME: temp1_outtime,
            };
          }
          /*  result= {
                        IN_TIME: moment(minStartRange).isValid()?  moment(minStartRange).format('HH:mm'): check1_nozero.length>0? moment(minAllCheck1).format('HH:mm'): tgv,
                        OUT_TIME: moment(maxStartRange).isValid()?  moment(maxStartRange).format('HH:mm'):check1_nozero.length>0? moment(maxAllCheck1).format('HH:mm'): tgr,
                    } */
          break;
        case 2:
          //console.log("dang tinh inout ca 2");
          let temp1_intime2 =
            check1_nozero.length > 0 ? moment(maxcheck1).format("HH:mm") : tgv;
          let temp1_outtime2 =
            check2_nozero.length > 0 ? moment(mincheck2).format("HH:mm") : tgr;
          let checkthieu2: string = "NA";
          result = {
            IN_TIME: temp1_intime2,
            OUT_TIME: temp1_outtime2,
          }
          

          break;
        default:
          let temp_intime =
            check1_nozero.length > 0
              ? moment(minAllCheck1).format("HH:mm")
              : tgv;
          let temp_outtime =
            check1_nozero.length > 0
              ? moment(maxAllCheck1).format("HH:mm")
              : tgr;
          result = {
            IN_TIME: temp_intime === temp_outtime ? temp_intime : tgv,
            OUT_TIME: temp_intime === temp_outtime ? tgr : temp_outtime,
          };
          break;
      }
    } else {
      const in_start: number = moment(
        cainfo[0].IN_START.substring(11, 16),
        "HH:mm"
      ).valueOf();
      const in_end: number = moment(
        cainfo[0].IN_END.substring(11, 16),
        "HH:mm"
      ).valueOf();
      const out_start: number = moment(
        cainfo[0].OUT_START.substring(11, 16),
        "HH:mm"
      ).valueOf();
      const out_end: number = moment(
        cainfo[0].OUT_END.substring(11, 16),
        "HH:mm"
      ).valueOf();
      let temp_intime =
        check1_nozero.length > 0 ? moment(mincheck1).format("HH:mm") : tgv;
      let temp_outtime =
        check1_nozero.length > 0 ? moment(maxcheck1).format("HH:mm") : tgr;
      let checkthieu: string = "NA";
      if (mincheck1 >= in_start && mincheck1 <= in_end) {
        checkthieu = tgr;
      }
      if (mincheck1 === maxcheck1) {
        result = {
          IN_TIME: checkthieu === tgr ? temp_intime : tgv,
          OUT_TIME: checkthieu !== tgr ? temp_outtime : tgr,
        };
      } else {
        result = {
          IN_TIME: temp_intime,
          OUT_TIME: temp_outtime,
        };
      }
    }
    return result;
  };
  const testcomparetime = () => {
    const a: number = moment.utc("19:47:42", "HH:mm:ss").valueOf();
    const reverse_a: string = moment.utc(a).format("HH:mm:ss");
    /* console.log("a", a);
    console.log("reverse_a", reverse_a); */
  };
  const loadCaInfo = () => {
    generalQuery("loadCaInfo", {})
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: CA_INFO[] = response.data.data.map(
            (element: CA_INFO, index: number) => {
              return {
                ...element,
              };
            }
          );
          /* console.log("cainfo", loaded_data); */
          setCaInfo(loaded_data);
        } else {
          Swal.fire("Thông báo", " Có lỗi : " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
        Swal.fire("Thông báo", " Có lỗi : " + error, "error");
      });
  };
  const handleFixTime = () => {
    //swal confirm to fix time
    Swal.fire({ 
      title: 'Bạn có chắc chắn muốn fix time không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, fix it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        console.log(selectedRows.current);
        for (let i = 0; i < selectedRows.current.length; i++) {
          const row = selectedRows.current[i];
            if(row.ON_OFF === null) {
              await generalQuery("setdiemdanhnhom2", {
                APPLY_DATE: row.DATE_COLUMN,
                diemdanhvalue: row.IN_TIME.includes("Thiếu") && row.OUT_TIME.includes("Thiếu") ? 0 : 1,
                EMPL_NO: row.EMPL_NO,
                CURRENT_TEAM: row.WORK_SHIF_NAME === "Hành Chính" ? 0 : row.WORK_SHIF_NAME === "TEAM 1" ? 1 : 2,    
                CURRENT_CA: row.WORK_SHIF_NAME === "Hành Chính" ? 0 : row.CALV ?? 0,
              })
                .then((response) => {
                  //console.log(response.data);
                  if (response.data.tk_status === "OK") {                    
                  } else {
                    Swal.fire(
                      "Có lỗi",
                      "Nội dung: " + response.data.message,
                      "error"
                    );
                  }
                })
                .catch((error) => {
                  //console.log(error);
                });
            }
           await generalQuery("fixTime", {
            APPLY_DATE: row.DATE_COLUMN,
            EMPL_NO: row.EMPL_NO,
            IN_TIME: row.FIXED_IN_TIME,
            OUT_TIME: row.FIXED_OUT_TIME
          })
            .then((response) => {
              //console.log(response.data.data);
              if (response.data.tk_status !== "NG") {
              
              } else {
                
              }
            })
            .catch((error) => {
              console.log(error);
              Swal.fire("Thông báo", " Có lỗi : " + error, "error");
            });          
        } 
        Swal.fire("Thông báo", "Fix time thành công", "success");
      }
    })
  }
  const handleFixTimeAuto = () => {
    //swal confirm to fix time
    Swal.fire({ 
      title: 'Bạn có chắc chắn muốn fix time không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, fix it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        console.log(selectedRows.current);
        for (let i = 0; i < selectedRows.current.length; i++) {
          const row = selectedRows.current[i];       
          if(row.ON_OFF === null) {
           await generalQuery("setdiemdanhnhom2", {
              APPLY_DATE: row.DATE_COLUMN,
              diemdanhvalue: row.IN_TIME.includes("Thiếu") && row.OUT_TIME.includes("Thiếu") ? 0 : 1,
              EMPL_NO: row.EMPL_NO,
              CURRENT_TEAM: row.WORK_SHIF_NAME === "Hành Chính" ? 0 : row.WORK_SHIF_NAME === "TEAM 1" ? 1 : 2,    
              CURRENT_CA: row.WORK_SHIF_NAME === "Hành Chính" ? 0 : row.CALV ?? 0,
            })
              .then((response) => {
                //console.log(response.data);
                if (response.data.tk_status === "OK") {                    
                } else {
                  Swal.fire(
                    "Có lỗi",
                    "Nội dung: " + response.data.message,
                    "error"
                  );
                }
              })
              .catch((error) => {
                //console.log(error);
              });
          }
          await generalQuery("fixTime", {
            APPLY_DATE: row.DATE_COLUMN,
            EMPL_NO: row.EMPL_NO,
            IN_TIME: row.IN_TIME.includes("Thiếu") && row.OUT_TIME.includes("Thiếu") ? 'OFF' : row.IN_TIME,
            OUT_TIME: row.OUT_TIME.includes("Thiếu") && row.IN_TIME.includes("Thiếu") ? 'OFF' : row.OUT_TIME  
          })
            .then((response) => {
              //console.log(response.data.data);
              if (response.data.tk_status !== "NG") {
              
              } else {
                
              }
            })
            .catch((error) => {
              console.log(error);
              Swal.fire("Thông báo", " Có lỗi : " + error, "error");
            });          
        } 
        Swal.fire("Thông báo", "Fix time thành công", "success");
      }
    })
  }
  const handleSETCA = (CALV: number) => {
    //swal confirm to fix time
    if(selectedRows.current.length ===0) {
      Swal.fire('Thông báo','Chưa chọn dòng nào','error');
      return;
    }
    Swal.fire({ 
      title: 'Bạn có set Ca không ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Có!'
    }).then(async (result) => {
      if (result.isConfirmed) {        
        for (let i = 0; i < selectedRows.current.length; i++) {
          const row = selectedRows.current[i];
          await f_setCaDiemDanh({
            EMPL_NO: row.EMPL_NO,
            APPLY_DATE: row.DATE_COLUMN,
            CALV: CALV
          });                    
        } 
        loadBangChamCong2();
        Swal.fire("Thông báo", "Set Ca thành công", "success");
      }
    })
  }
  useEffect(() => {
    testcomparetime();
    loadCaInfo();
  }, []);
  return (
    <div className='bangchamcong'>
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
          </div>
          <div className='formbutton'>
            <label>
              <b>Trừ nghỉ việc:</b>
              <input
                type='checkbox'
                name='alltimecheckbox'
                defaultChecked={trunghiviec}
                onChange={() => setTruNghiViec(!trunghiviec)}
              ></input>
            </label>
            <label>
              <b>Trừ nghỉ sinh:</b>
              <input
                type='checkbox'
                name='alltimecheckbox'
                defaultChecked={trunghisinh}
                onChange={() => setTruNghiSinh(!trunghisinh)}
              ></input>
            </label>
            <Button color={'primary'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#15a012' }} onClick={() => {
              checkBP(
                userData,
                ["NHANSU"],
                ["ALL"],
                ["ALL"],
                loadBangChamCong2
              );
            }}>Tra chấm công</Button>
            <Button color={'warning'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#f78923' }} onClick={() => {
              checkBP(
                userData,
                ["NHANSU"],
                ["ALL"],
                ["ALL"],
                handleFixTime
              );
            }}>FIX MANUAL TIME</Button>
            <Button color={'warning'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#f78923' }} onClick={() => {
              checkBP(
                userData,
                ["NHANSU"],
                ["ALL"],
                ["ALL"],
                handleFixTimeAuto
              );
            }}>FIX AUTO TIME</Button>
            <Button color={'warning'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#1899d4' }} onClick={() => {
              checkBP(
                userData,
                ["NHANSU"],
                ["ALL"],
                ["ALL"],
                ()=> {
                  handleSETCA(0);
                }
              );
            }}>SET CA HC</Button>
            <Button color={'warning'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#69c006' }} onClick={() => {
              checkBP(
                userData,
                ["NHANSU"],
                ["ALL"],
                ["ALL"],
                ()=> {
                  handleSETCA(1);
                }
              );
            }}>SET CA NGÀY</Button>
            <Button color={'warning'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#8f8173' }} onClick={() => {
              checkBP(
                userData,
                ["NHANSU"],
                ["ALL"],
                ["ALL"],
                ()=> {
                  handleSETCA(2);
                }
              );
            }}>SET CA ĐÊM</Button>
          </div>
        </div>
        <div className='tracuuYCSXTable'>{chamcongTBMM}</div>
        {showhidePivotTable && (
          <div className='pivottable1'>
            <IconButton
              className='buttonIcon'
              onClick={() => {
                setShowHidePivotTable(false);
              }}
            >
              <AiFillCloseCircle color='blue' size={15} />
              Close
            </IconButton>
            <PivotTable
              datasource={selectedDataSource}
              tableID='datasxtablepivot'
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default BANGCHAMCONG;

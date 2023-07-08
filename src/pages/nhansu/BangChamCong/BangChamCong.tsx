import {
    IconButton,
  } from "@mui/material";
  import DataGrid, {
    Column,
    ColumnChooser,
    Editing,
    Export,
    FilterRow,
    Item,
    Pager,
    Paging,
    Scrolling,
    SearchPanel,
    Selection,
    Summary,
    Toolbar,
    TotalItem,
  } from "devextreme-react/data-grid";
  import moment, { duration } from "moment";
  import React, { useContext, useEffect, useState, useTransition } from "react";
  import {
    AiFillCloseCircle,
    AiFillFileExcel,
    AiOutlineCloudUpload,
    AiOutlinePrinter,
  } from "react-icons/ai";
  import Swal from "sweetalert2";
  import "./BANGCHAMCONG.scss";
  import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
  import { MdOutlinePivotTableChart } from "react-icons/md";
import { SaveExcel, checkBP, weekdayarray } from "../../../api/GlobalFunction";
import { generalQuery } from "../../../api/Api";
import PivotTable from "../../../components/PivotChart/PivotChart";
import { RootState } from "../../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { UserData } from "../../../redux/slices/globalSlice";

  interface BANGCHAMCONG_DATA {
    DATE_COLUMN: string,
    WEEKDAY: string,
    NV_CCID: string,
    EMPL_NO: string,
    CMS_ID: string,
    MIDLAST_NAME: string,
    FIRST_NAME: string,
    FULL_NAME: string,
    PHONE_NUMBER: string,
    SEX_NAME: string,
    WORK_STATUS_NAME: string,
    FACTORY_NAME: string,
    JOB_NAME: string,
    WORK_SHIF_NAME: string,
    WORK_POSITION_NAME: string,
    SUBDEPTNAME: string,
    MAINDEPTNAME: string,
    REQUEST_DATE: string,
    APPLY_DATE: string,
    APPROVAL_STATUS: string,
    OFF_ID: number,
    CA_NGHI: string,
    ON_OFF: number,
    OVERTIME_INFO: string,
    OVERTIME: number,
    REASON_NAME: string,
    REMARK: string,
    XACNHAN: string,
    CA_CODE: number,
    CA_NAME: string,
    IN_START: string,
    IN_END: string,
    OUT_START: string,
    OUT_END: string,
    CHECK_DATE0: string,
    CHECK10: string,
    CHECK20: string,
    CHECK30: string,
    CHECK40: string,
    CHECK50: string,
    CHECK60: string,
    CHECK_DATE: string,
    CHECK1: string,
    CHECK2: string,
    CHECK3: string,
    CHECK4: string,
    CHECK5: string,
    CHECK6: string,
    CHECK_DATE2: string,
    CHECK12: string,
    CHECK22: string,
    CHECK32: string,
    CHECK42: string,
    CHECK52: string,
    CHECK62: string,    
    IN_TIME: string,
    OUT_TIME: string,
  }
  interface CA_INFO {
    CA_CODE: number,
    CA_NAME: string,
    CA_NAME_KR: string,
    IN_START: string,
    IN_END: string,
    OUT_START: string,
    OUT_END: string,
    LAUNCH_START: string,
    LAUNCH_END: string,
  }

  interface IN_OUT_DATA {
    CA_CODE: number;
    IN_START: string;
    IN_END: string;
    OUT_START: string;
    OUT_END: string;

    CHECK10: string,
    CHECK20: string,
    CHECK30: string,
    CHECK40: string,
    CHECK50: string,
    CHECK60: string,
    CHECK1: string;
    CHECK2: string;
    CHECK3: string;
    CHECK4: string;
    CHECK5: string;
    CHECK6: string;
    CHECK12: string;
    CHECK22: string;
    CHECK32: string;
    CHECK42: string;
    CHECK52: string;
    CHECK62: string;
  }
  interface IN_OUT_DATA2 {
    SHIFT_NAME: string;
    IN_START: string;
    IN_END: string;
    OUT_START: string;
    OUT_END: string;

    CHECK10: string,
    CHECK20: string,
    CHECK30: string,
    CHECK40: string,
    CHECK50: string,
    CHECK60: string,
    CHECK1: string;
    CHECK2: string;
    CHECK3: string;
    CHECK4: string;
    CHECK5: string;
    CHECK6: string;
    CHECK12: string;
    CHECK22: string;
    CHECK32: string;
    CHECK42: string;
    CHECK52: string;
    CHECK62: string;
  }
  const BANGCHAMCONG = () => {
    const userData: UserData | undefined = useSelector(
        (state: RootState) => state.totalSlice.userData
    );
    const [cainfo,setCaInfo]= useState<CA_INFO[]>([]);
    const [bangchamcong,setBangChamCong]= useState<BANGCHAMCONG_DATA[]>([]);
    const [showhidePivotTable, setShowHidePivotTable] = useState(false);
    const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
    const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
    const [codeKD, setCodeKD] = useState("");
    const [codeCMS, setCodeCMS] = useState("");
    const [machine, setMachine] = useState("ALL");
    const [factory, setFactory] = useState("ALL");
    const [prodrequestno, setProdRequestNo] = useState("");
    const [plan_id, setPlanID] = useState("");
    const [alltime, setAllTime] = useState(false);
    const [id, setID] = useState("");
    const [datasxtable, setDataSXTable] = useState<Array<any>>([]);
    const [m_name, setM_Name] = useState("");
    const [m_code, setM_Code] = useState("");

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
      caption: "CMS_ID",
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
      () => (
        <div className='datatb'>
          <DataGrid
            style={{ fontSize: "0.7rem" }}
            autoNavigateToFocusedRow={true}
            allowColumnReordering={true}
            allowColumnResizing={true}
            columnAutoWidth={false}
            cellHintEnabled={true}
            columnResizingMode={"widget"}
            showColumnLines={true}
            dataSource={bangchamcong}
            columnWidth='auto'
            keyExpr='id'
            height={"70vh"}
            showBorders={true}
            onSelectionChanged={(e) => {
              //console.log(e.selectedRowsData);
             /*  setSelectedRowsDataYCSX(e.selectedRowsData); */
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
              allowAdding={false}
              allowDeleting={false}
              mode='cell'
              confirmDelete={false}
              onChangesChange={(e) => {}}
            />
            <Export enabled={true} />
            <Toolbar disabled={false}>
              <Item location='before'>
                <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    SaveExcel(bangchamcong, "SXDATATABLE");
                  }}
                >
                  <AiFillFileExcel color='green' size={25} />
                  SAVE
                </IconButton>
                <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    setShowHidePivotTable(!showhidePivotTable);
                  }}
                >
                  <MdOutlinePivotTableChart color='#ff33bb' size={25} />
                  Pivot
                </IconButton>
              </Item>
              <Item name='searchPanel' />
              <Item name='exportButton' />
              <Item name='columnChooserButton' />
              <Item name='addRowButton' />
              <Item name='saveButton' />
              <Item name='revertButton' />
            </Toolbar>
            <FilterRow visible={true} />
            <SearchPanel visible={true} />
            <ColumnChooser enabled={true} />
            <Paging defaultPageSize={15} />
            <Pager
              showPageSizeSelector={true}
              allowedPageSizes={[5, 10, 15, 20, 100, 1000, 10000, "all"]}
              showNavigationButtons={true}
              showInfo={true}
              infoText='Page #{0}. Total: {1} ({2} items)'
              displayMode='compact'
            />                        
            <Column dataField='EMPL_NO' caption='EMPL_NO' width={100}></Column>
            <Column dataField='CMS_ID' caption='CMS_ID' width={100}></Column>
            <Column dataField='NV_CCID' caption='NV_CCID' width={100}></Column>
           {/*  <Column dataField='MIDLAST_NAME' caption='MIDLAST_NAME' width={100}></Column>
            <Column dataField='FIRST_NAME' caption='FIRST_NAME' width={100}></Column> */}
            <Column dataField='FULL_NAME' caption='FULL_NAME' width={100}></Column>
           {/*  <Column dataField='PHONE_NUMBER' caption='PHONE_NUMBER' width={100}></Column>
            <Column dataField='SEX_NAME' caption='SEX_NAME' width={100}></Column> */}
            {/* <Column dataField='WORK_STATUS_NAME' caption='WORK_STATUS_NAME' width={100}></Column> */}
            <Column dataField='FACTORY_NAME' caption='FACTORY_NAME' width={100}></Column>
            {/* <Column dataField='JOB_NAME' caption='JOB_NAME' width={100}></Column> */}
            <Column dataField='WORK_SHIF_NAME' caption='WORK_SHIF_NAME' width={100}></Column>
           {/*  <Column dataField='WORK_POSITION_NAME' caption='WORK_POSITION_NAME' width={100}></Column>
            <Column dataField='SUBDEPTNAME' caption='SUBDEPTNAME' width={100}></Column> */}
            <Column dataField='MAINDEPTNAME' caption='MAINDEPTNAME' width={100}></Column>
           {/*  <Column dataField='REQUEST_DATE' caption='REQUEST_DATE' width={100}></Column>
            <Column dataField='APPLY_DATE' caption='APPLY_DATE' width={100}></Column>
            <Column dataField='APPROVAL_STATUS' caption='APPROVAL_STATUS' width={100}></Column>
            <Column dataField='OFF_ID' caption='OFF_ID' width={100}></Column>
            <Column dataField='CA_NGHI' caption='CA_NGHI' width={100}></Column>
            <Column dataField='ON_OFF' caption='ON_OFF' width={100}></Column>
            <Column dataField='OVERTIME_INFO' caption='OVERTIME_INFO' width={100}></Column>
            <Column dataField='OVERTIME' caption='OVERTIME' width={100}></Column> */}
            
           {/*  <Column dataField='REMARK' caption='REMARK' width={100}></Column>
            <Column dataField='XACNHAN' caption='XACNHAN' width={100}></Column>
            <Column dataField='CA_CODE' caption='CA_CODE' width={100}></Column> */}
            <Column dataField='CA_NAME' caption='CA_NAME' width={100}></Column>
           {/*  <Column dataField='IN_START' caption='IN_START' width={100}></Column>
            <Column dataField='IN_END' caption='IN_END' width={100}></Column>
            <Column dataField='OUT_START' caption='OUT_START' width={100}></Column>
            <Column dataField='OUT_END' caption='OUT_END' width={100}></Column> */}
            <Column dataField='DATE_COLUMN' caption='DATE_COLUMN' width={100} dataType='date'></Column>
            <Column dataField='WEEKDAY' caption='WEEKDAY' width={100}></Column>
            <Column dataField='IN_TIME' caption='IN_TIME' width={100}></Column>
            <Column dataField='OUT_TIME' caption='OUT_TIME' width={100}></Column>
            <Column dataField='REASON_NAME' caption='REASON_NAME' width={100}></Column>
            {/* <Column dataField='CHECK_DATE' caption='CHECK_DATE' width={100}></Column> */}
            <Column dataField='CHECK10' caption='CHECK10' width={100}></Column>
            <Column dataField='CHECK20' caption='CHECK20' width={100}></Column>
            <Column dataField='CHECK30' caption='CHECK30' width={100}></Column>
            <Column dataField='CHECK40' caption='CHECK40' width={100}></Column>
            <Column dataField='CHECK50' caption='CHECK50' width={100}></Column>
            <Column dataField='CHECK60' caption='CHECK60' width={100}></Column>

            <Column dataField='CHECK1' caption='CHECK1' width={100}></Column>
            <Column dataField='CHECK2' caption='CHECK2' width={100}></Column>
            <Column dataField='CHECK3' caption='CHECK3' width={100}></Column>
            <Column dataField='CHECK4' caption='CHECK4' width={100}></Column>
            <Column dataField='CHECK5' caption='CHECK5' width={100}></Column>
            <Column dataField='CHECK6' caption='CHECK6' width={100}></Column>
            {/* <Column dataField='CHECK_DATE2' caption='CHECK_DATE2' width={100}></Column> */}
            <Column dataField='CHECK12' caption='CHECK12' width={100}></Column>
            <Column dataField='CHECK22' caption='CHECK22' width={100}></Column>
            <Column dataField='CHECK32' caption='CHECK32' width={100}></Column>
            <Column dataField='CHECK42' caption='CHECK42' width={100}></Column>
            <Column dataField='CHECK52' caption='CHECK52' width={100}></Column>
            <Column dataField='CHECK62' caption='CHECK62' width={100}></Column>
            <Summary>
              <TotalItem
                alignment='right'
                column='DATE_COLUMN'
                summaryType='count'
                valueFormat={"decimal"}
            />              
            </Summary>
          </DataGrid>
        </div>
      ),
      [bangchamcong]
    );
    const loadBangChamCong = ()=> {        
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
                const loaded_data: BANGCHAMCONG_DATA[] = response.data.data.map(
                  (element: BANGCHAMCONG_DATA, index: number) => {
                    return {
                      ...element,
                      WEEKDAY: weekdayarray[new Date(element.DATE_COLUMN).getDay()],
                      FULL_NAME: element.MIDLAST_NAME + ' ' + element.FIRST_NAME,
                      DATE_COLUMN: moment.utc(element.DATE_COLUMN).format("DD/MM/YYYY"),
                      APPLY_DATE:  element.APPLY_DATE !== null? moment.utc(element.APPLY_DATE).format("DD/MM/YYYY"): '',
                      CHECK_DATE0:  element.CHECK_DATE0 !== null? moment.utc(element.CHECK_DATE0).format("DD/MM/YYYY"): '',
                      CHECK_DATE:  element.CHECK_DATE2 !== null? moment.utc(element.CHECK_DATE).format("DD/MM/YYYY"): '',
                      CHECK_DATE2: element.CHECK_DATE2 !== null? moment.utc(element.CHECK_DATE2).format("DD/MM/YYYY"): '',

                      CHECK10: element.CHECK10 !== null? moment.utc(element.CHECK10).format("HH:mm:ss"): '',
                      CHECK20: element.CHECK20 !== null? moment.utc(element.CHECK20).format("HH:mm:ss"): '',
                      CHECK30: element.CHECK30 !== null? moment.utc(element.CHECK30).format("HH:mm:ss"): '',
                      CHECK40: element.CHECK40 !== null? moment.utc(element.CHECK40).format("HH:mm:ss"): '',
                      CHECK50: element.CHECK50 !== null? moment.utc(element.CHECK50).format("HH:mm:ss"): '',
                      CHECK60: element.CHECK60 !== null? moment.utc(element.CHECK60).format("HH:mm:ss"): '',

                      CHECK1: element.CHECK1 !== null? moment.utc(element.CHECK1).format("HH:mm:ss"): '',
                      CHECK2: element.CHECK2 !== null? moment.utc(element.CHECK2).format("HH:mm:ss"): '',
                      CHECK3: element.CHECK3 !== null? moment.utc(element.CHECK3).format("HH:mm:ss"): '',
                      CHECK4: element.CHECK4 !== null? moment.utc(element.CHECK4).format("HH:mm:ss"): '',
                      CHECK5: element.CHECK5 !== null? moment.utc(element.CHECK5).format("HH:mm:ss"): '',
                      CHECK6: element.CHECK6 !== null? moment.utc(element.CHECK6).format("HH:mm:ss"): '',

                      CHECK12: element.CHECK12 !== null? moment.utc(element.CHECK12).format("HH:mm:ss"): '',
                      CHECK22: element.CHECK22 !== null? moment.utc(element.CHECK22).format("HH:mm:ss"): '',
                      CHECK32: element.CHECK32 !== null? moment.utc(element.CHECK32).format("HH:mm:ss"): '',
                      CHECK42: element.CHECK42 !== null? moment.utc(element.CHECK42).format("HH:mm:ss"): '',
                      CHECK52: element.CHECK52 !== null? moment.utc(element.CHECK52).format("HH:mm:ss"): '',
                      CHECK62: element.CHECK62 !== null? moment.utc(element.CHECK62).format("HH:mm:ss"): '',

                      IN_START: element.IN_START !== null? moment.utc(element.IN_START).format("HH:mm"): '',
                      IN_END: element.IN_END !== null? moment.utc(element.IN_END).format("HH:mm"): '',
                      OUT_START: element.OUT_START !== null? moment.utc(element.OUT_START).format("HH:mm"): '',
                      OUT_END: element.OUT_END !== null? moment.utc(element.OUT_END).format("HH:mm"): '',

                      IN_TIME: tinhInOutTime2({
                        SHIFT_NAME:element.WORK_SHIF_NAME,
                        IN_START: element.IN_START !== null? moment.utc(element.IN_START).format("HH:mm"): '',
                        IN_END: element.IN_END !== null? moment.utc(element.IN_END).format("HH:mm"): '',
                        OUT_START: element.OUT_START !== null? moment.utc(element.OUT_START).format("HH:mm"): '',
                        OUT_END: element.OUT_END !== null? moment.utc(element.OUT_END).format("HH:mm"): '',                  
                        CHECK10: element.CHECK10 !== null? moment.utc(element.CHECK10).format("HH:mm"): '',
                        CHECK20: element.CHECK20 !== null? moment.utc(element.CHECK20).format("HH:mm"): '',
                        CHECK30: element.CHECK30 !== null? moment.utc(element.CHECK30).format("HH:mm"): '',
                        CHECK40: element.CHECK40 !== null? moment.utc(element.CHECK40).format("HH:mm"): '',
                        CHECK50: element.CHECK50 !== null? moment.utc(element.CHECK50).format("HH:mm"): '',
                        CHECK60: element.CHECK60 !== null? moment.utc(element.CHECK60).format("HH:mm"): '',
                        CHECK1: element.CHECK1 !== null? moment.utc(element.CHECK1).format("HH:mm"): '',
                        CHECK2: element.CHECK2 !== null? moment.utc(element.CHECK2).format("HH:mm"): '',
                        CHECK3: element.CHECK3 !== null? moment.utc(element.CHECK3).format("HH:mm"): '',
                        CHECK4: element.CHECK4 !== null? moment.utc(element.CHECK4).format("HH:mm"): '',
                        CHECK5: element.CHECK5 !== null? moment.utc(element.CHECK5).format("HH:mm"): '',
                        CHECK6: element.CHECK6 !== null? moment.utc(element.CHECK6).format("HH:mm"): '',
                        CHECK12: element.CHECK12 !== null? moment.utc(element.CHECK12).format("HH:mm"): '',
                        CHECK22: element.CHECK22 !== null? moment.utc(element.CHECK22).format("HH:mm"): '',
                        CHECK32: element.CHECK32 !== null? moment.utc(element.CHECK32).format("HH:mm"): '',
                        CHECK42: element.CHECK42 !== null? moment.utc(element.CHECK42).format("HH:mm"): '',
                        CHECK52: element.CHECK52 !== null? moment.utc(element.CHECK52).format("HH:mm"): '',
                        CHECK62: element.CHECK62 !== null? moment.utc(element.CHECK62).format("HH:mm"): '',
                      }).IN_TIME,
                      OUT_TIME: tinhInOutTime2({
                        SHIFT_NAME:element.WORK_SHIF_NAME,
                        IN_START: element.IN_START !== null? moment.utc(element.IN_START).format("HH:mm"): '',
                        IN_END: element.IN_END !== null? moment.utc(element.IN_END).format("HH:mm"): '',
                        OUT_START: element.OUT_START !== null? moment.utc(element.OUT_START).format("HH:mm"): '',
                        OUT_END: element.OUT_END !== null? moment.utc(element.OUT_END).format("HH:mm"): '',                  
                        CHECK10: element.CHECK10 !== null? moment.utc(element.CHECK10).format("HH:mm"): '',
                        CHECK20: element.CHECK20 !== null? moment.utc(element.CHECK20).format("HH:mm"): '',
                        CHECK30: element.CHECK30 !== null? moment.utc(element.CHECK30).format("HH:mm"): '',
                        CHECK40: element.CHECK40 !== null? moment.utc(element.CHECK40).format("HH:mm"): '',
                        CHECK50: element.CHECK50 !== null? moment.utc(element.CHECK50).format("HH:mm"): '',
                        CHECK60: element.CHECK60 !== null? moment.utc(element.CHECK60).format("HH:mm"): '',
                        CHECK1: element.CHECK1 !== null? moment.utc(element.CHECK1).format("HH:mm"): '',
                        CHECK2: element.CHECK2 !== null? moment.utc(element.CHECK2).format("HH:mm"): '',
                        CHECK3: element.CHECK3 !== null? moment.utc(element.CHECK3).format("HH:mm"): '',
                        CHECK4: element.CHECK4 !== null? moment.utc(element.CHECK4).format("HH:mm"): '',
                        CHECK5: element.CHECK5 !== null? moment.utc(element.CHECK5).format("HH:mm"): '',
                        CHECK6: element.CHECK6 !== null? moment.utc(element.CHECK6).format("HH:mm"): '',
                        CHECK12: element.CHECK12 !== null? moment.utc(element.CHECK12).format("HH:mm"): '',
                        CHECK22: element.CHECK22 !== null? moment.utc(element.CHECK22).format("HH:mm"): '',
                        CHECK32: element.CHECK32 !== null? moment.utc(element.CHECK32).format("HH:mm"): '',
                        CHECK42: element.CHECK42 !== null? moment.utc(element.CHECK42).format("HH:mm"): '',
                        CHECK52: element.CHECK52 !== null? moment.utc(element.CHECK52).format("HH:mm"): '',
                        CHECK62: element.CHECK62 !== null? moment.utc(element.CHECK62).format("HH:mm"): '',
                      }).OUT_TIME,
                      /* IN_TIME: tinhInOutTime({
                        CA_CODE:element.CA_CODE,
                        IN_START: element.IN_START !== null? moment.utc(element.IN_START).format("HH:mm"): '',
                        IN_END: element.IN_END !== null? moment.utc(element.IN_END).format("HH:mm"): '',
                        OUT_START: element.OUT_START !== null? moment.utc(element.OUT_START).format("HH:mm"): '',
                        OUT_END: element.OUT_END !== null? moment.utc(element.OUT_END).format("HH:mm"): '',                  
                        CHECK10: element.CHECK10 !== null? moment.utc(element.CHECK10).format("HH:mm"): '',
                        CHECK20: element.CHECK20 !== null? moment.utc(element.CHECK20).format("HH:mm"): '',
                        CHECK30: element.CHECK30 !== null? moment.utc(element.CHECK30).format("HH:mm"): '',
                        CHECK40: element.CHECK40 !== null? moment.utc(element.CHECK40).format("HH:mm"): '',
                        CHECK50: element.CHECK50 !== null? moment.utc(element.CHECK50).format("HH:mm"): '',
                        CHECK60: element.CHECK60 !== null? moment.utc(element.CHECK60).format("HH:mm"): '',
                        CHECK1: element.CHECK1 !== null? moment.utc(element.CHECK1).format("HH:mm"): '',
                        CHECK2: element.CHECK2 !== null? moment.utc(element.CHECK2).format("HH:mm"): '',
                        CHECK3: element.CHECK3 !== null? moment.utc(element.CHECK3).format("HH:mm"): '',
                        CHECK4: element.CHECK4 !== null? moment.utc(element.CHECK4).format("HH:mm"): '',
                        CHECK5: element.CHECK5 !== null? moment.utc(element.CHECK5).format("HH:mm"): '',
                        CHECK6: element.CHECK6 !== null? moment.utc(element.CHECK6).format("HH:mm"): '',
                        CHECK12: element.CHECK12 !== null? moment.utc(element.CHECK12).format("HH:mm"): '',
                        CHECK22: element.CHECK22 !== null? moment.utc(element.CHECK22).format("HH:mm"): '',
                        CHECK32: element.CHECK32 !== null? moment.utc(element.CHECK32).format("HH:mm"): '',
                        CHECK42: element.CHECK42 !== null? moment.utc(element.CHECK42).format("HH:mm"): '',
                        CHECK52: element.CHECK52 !== null? moment.utc(element.CHECK52).format("HH:mm"): '',
                        CHECK62: element.CHECK62 !== null? moment.utc(element.CHECK62).format("HH:mm"): '',
                      }).IN_TIME,
                      OUT_TIME: tinhInOutTime({
                        CA_CODE:element.CA_CODE,
                        IN_START: element.IN_START !== null? moment.utc(element.IN_START).format("HH:mm"): '',
                        IN_END: element.IN_END !== null? moment.utc(element.IN_END).format("HH:mm"): '',
                        OUT_START: element.OUT_START !== null? moment.utc(element.OUT_START).format("HH:mm"): '',
                        OUT_END: element.OUT_END !== null? moment.utc(element.OUT_END).format("HH:mm"): '',                  
                        CHECK10: element.CHECK10 !== null? moment.utc(element.CHECK10).format("HH:mm"): '',
                        CHECK20: element.CHECK20 !== null? moment.utc(element.CHECK20).format("HH:mm"): '',
                        CHECK30: element.CHECK30 !== null? moment.utc(element.CHECK30).format("HH:mm"): '',
                        CHECK40: element.CHECK40 !== null? moment.utc(element.CHECK40).format("HH:mm"): '',
                        CHECK50: element.CHECK50 !== null? moment.utc(element.CHECK50).format("HH:mm"): '',
                        CHECK60: element.CHECK60 !== null? moment.utc(element.CHECK60).format("HH:mm"): '',
                        CHECK1: element.CHECK1 !== null? moment.utc(element.CHECK1).format("HH:mm"): '',
                        CHECK2: element.CHECK2 !== null? moment.utc(element.CHECK2).format("HH:mm"): '',
                        CHECK3: element.CHECK3 !== null? moment.utc(element.CHECK3).format("HH:mm"): '',
                        CHECK4: element.CHECK4 !== null? moment.utc(element.CHECK4).format("HH:mm"): '',
                        CHECK5: element.CHECK5 !== null? moment.utc(element.CHECK5).format("HH:mm"): '',
                        CHECK6: element.CHECK6 !== null? moment.utc(element.CHECK6).format("HH:mm"): '',
                        CHECK12: element.CHECK12 !== null? moment.utc(element.CHECK12).format("HH:mm"): '',
                        CHECK22: element.CHECK22 !== null? moment.utc(element.CHECK22).format("HH:mm"): '',
                        CHECK32: element.CHECK32 !== null? moment.utc(element.CHECK32).format("HH:mm"): '',
                        CHECK42: element.CHECK42 !== null? moment.utc(element.CHECK42).format("HH:mm"): '',
                        CHECK52: element.CHECK52 !== null? moment.utc(element.CHECK52).format("HH:mm"): '',
                        CHECK62: element.CHECK62 !== null? moment.utc(element.CHECK62).format("HH:mm"): '',
                      }).OUT_TIME, */
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
                Swal.fire("Thông báo", " Đã tải: " + loaded_data.length +' dòng', "success");
              } else {
                Swal.fire("Thông báo", " Có lỗi : " + response.data.message, "error");
              }
            })
            .catch((error) => {
              console.log(error);
              Swal.fire("Thông báo", " Có lỗi : " + error, "error");
            });
    }
    
    const tinhInOutTime =(IO_DATA: IN_OUT_DATA)=> {
        
        const in_start: number = moment(IO_DATA.IN_START,'HH:mm').valueOf();
        const in_end: number = moment(IO_DATA.IN_END,'HH:mm').valueOf();
        const out_start: number = moment(IO_DATA.OUT_START,'HH:mm').valueOf();
        const out_end: number = moment(IO_DATA.OUT_END,'HH:mm').valueOf();
        const check1_array: number[] = [
            IO_DATA.CHECK1 !=='' ? moment(IO_DATA.CHECK1,'HH:mm').valueOf():0,
            IO_DATA.CHECK2 !=='' ? moment(IO_DATA.CHECK2,'HH:mm').valueOf():0,
            IO_DATA.CHECK3 !=='' ? moment(IO_DATA.CHECK3,'HH:mm').valueOf():0,
            IO_DATA.CHECK4 !=='' ? moment(IO_DATA.CHECK4,'HH:mm').valueOf():0,
            IO_DATA.CHECK5 !=='' ? moment(IO_DATA.CHECK5,'HH:mm').valueOf():0,
            IO_DATA.CHECK6 !=='' ? moment(IO_DATA.CHECK6,'HH:mm').valueOf():0,           
        ]
        const check2_array: number[] = [
            IO_DATA.CHECK12 !=='' ? moment(IO_DATA.CHECK12,'HH:mm').valueOf():0,
            IO_DATA.CHECK22 !=='' ? moment(IO_DATA.CHECK22,'HH:mm').valueOf():0,
            IO_DATA.CHECK32 !=='' ? moment(IO_DATA.CHECK32,'HH:mm').valueOf():0,
            IO_DATA.CHECK42 !=='' ? moment(IO_DATA.CHECK42,'HH:mm').valueOf():0,
            IO_DATA.CHECK52 !=='' ? moment(IO_DATA.CHECK52,'HH:mm').valueOf():0,
            IO_DATA.CHECK62 !=='' ? moment(IO_DATA.CHECK62,'HH:mm').valueOf():0,  
        ]
        const check1_nozero: number[]= check1_array.filter((ele: number, index: number)=> ele!==0);
        const check2_nozero: number[]= check2_array.filter((ele: number, index: number)=> ele!==0);

        const check1_start_range: number[]= check1_nozero.filter((ele:number, index: number)=> ele >= in_start && ele <= in_end);
        const check1_end_range: number[]= check1_nozero.filter((ele:number, index: number)=> ele >= out_start && ele <= out_end);

        const check2_start_range: number[]= check2_nozero.filter((ele:number, index: number)=> ele >= in_start && ele <= in_end);
        const check2_end_range: number[]= check2_nozero.filter((ele:number, index: number)=> ele >= out_start && ele <= out_end);

        const mincheck1:number = Math.min.apply(Math, check1_nozero);
        const maxcheck1:number = Math.max.apply(Math, check1_nozero);


         
        
        //console.log('check1 start range', moment(check1_start_range).format('HH:mm'));
        //console.log('check2 end range', moment(check2_end_range).format('HH:mm'));
        //ca dem
        const minStartRange:number = Math.min.apply(Math, check1_start_range);
        const maxEndRange:number = Math.max.apply(Math, check2_end_range);


        //ca ngay
        const maxStartRange:number = Math.max.apply(Math, check1_end_range);
       
        //min of all check1
        const minAllCheck1:number = Math.min.apply(Math,check1_nozero);
        //max of all check1
        const maxAllCheck1:number = Math.max.apply(Math,check1_nozero);

        //max all check2
        const maxAllCheck2:number = Math.max.apply(Math,check2_nozero);       

        let result = {
            IN_TIME: '',
            OUT_TIME:'',           
        }

        if(IO_DATA.IN_START !== '')
        {            
            
            switch(IO_DATA.CA_CODE)
            {
                
                case 0:
                    result= {
                        IN_TIME: moment(minStartRange).isValid()?  moment(minStartRange).format('HH:mm'): check1_nozero.length>0? moment(minAllCheck1).format('HH:mm'): '',
                        OUT_TIME: moment(maxStartRange).isValid()?  moment(maxStartRange).format('HH:mm'):check1_nozero.length>0? moment(maxAllCheck1).format('HH:mm'): '',
                    }                   
              
                break;

                case 1:
                    result= {
                        IN_TIME: moment(minStartRange).isValid()?  moment(minStartRange).format('HH:mm'): check1_nozero.length>0? moment(minAllCheck1).format('HH:mm'): '',
                        OUT_TIME: moment(maxStartRange).isValid()?  moment(maxStartRange).format('HH:mm'):check1_nozero.length>0? moment(maxAllCheck1).format('HH:mm'): '',
                    }                    
                    
                break;
                case 2:
                    result= {
                        IN_TIME: moment(minStartRange).isValid()?  moment(minStartRange).format('HH:mm'):check1_nozero.length>0? moment(minAllCheck1).format('HH:mm'): '',
                        OUT_TIME: moment(maxEndRange).isValid()?  moment(maxEndRange).format('HH:mm'):check2_nozero.length>0? moment(maxAllCheck2).format('HH:mm'): '',
                    }

                break;
            }

        }
        else {
            result= {
                IN_TIME: '',
                OUT_TIME: '',
            }
        }
        //console.log(result);
        return  result; 
        
    }
    const tinhInOutTime2 =(IO_DATA: IN_OUT_DATA2)=> {
        
        console.log(cainfo);
        let team = IO_DATA.SHIFT_NAME;        
        let result= {
            IN_TIME: '',
            OUT_TIME: '',
        }

        const tgv: string = 'Thiếu giờ vào';
        const tgr: string = 'Thiếu giờ ra';


        const in_start1: number = moment(moment(cainfo[1].IN_START).format('HH:mm'),'HH:mm').valueOf();

        
        const check0_array: number[] = [
            IO_DATA.CHECK10 !=='' ? moment(IO_DATA.CHECK10,'HH:mm').valueOf():0,
            IO_DATA.CHECK20 !=='' ? moment(IO_DATA.CHECK20,'HH:mm').valueOf():0,
            IO_DATA.CHECK30 !=='' ? moment(IO_DATA.CHECK30,'HH:mm').valueOf():0,
            IO_DATA.CHECK40 !=='' ? moment(IO_DATA.CHECK40,'HH:mm').valueOf():0,
            IO_DATA.CHECK50 !=='' ? moment(IO_DATA.CHECK50,'HH:mm').valueOf():0,
            IO_DATA.CHECK60 !=='' ? moment(IO_DATA.CHECK60,'HH:mm').valueOf():0,           
        ]
        const check1_array: number[] = [
            IO_DATA.CHECK1 !=='' ? moment(IO_DATA.CHECK1,'HH:mm').valueOf():0,
            IO_DATA.CHECK2 !=='' ? moment(IO_DATA.CHECK2,'HH:mm').valueOf():0,
            IO_DATA.CHECK3 !=='' ? moment(IO_DATA.CHECK3,'HH:mm').valueOf():0,
            IO_DATA.CHECK4 !=='' ? moment(IO_DATA.CHECK4,'HH:mm').valueOf():0,
            IO_DATA.CHECK5 !=='' ? moment(IO_DATA.CHECK5,'HH:mm').valueOf():0,
            IO_DATA.CHECK6 !=='' ? moment(IO_DATA.CHECK6,'HH:mm').valueOf():0,           
        ]
        const check2_array: number[] = [
            IO_DATA.CHECK12 !=='' ? moment(IO_DATA.CHECK12,'HH:mm').valueOf():0,
            IO_DATA.CHECK22 !=='' ? moment(IO_DATA.CHECK22,'HH:mm').valueOf():0,
            IO_DATA.CHECK32 !=='' ? moment(IO_DATA.CHECK32,'HH:mm').valueOf():0,
            IO_DATA.CHECK42 !=='' ? moment(IO_DATA.CHECK42,'HH:mm').valueOf():0,
            IO_DATA.CHECK52 !=='' ? moment(IO_DATA.CHECK52,'HH:mm').valueOf():0,
            IO_DATA.CHECK62 !=='' ? moment(IO_DATA.CHECK62,'HH:mm').valueOf():0,  
        ]

       

        const check0_nozero: number[]= check0_array.filter((ele: number, index: number)=> ele!==0);
        const check1_nozero: number[]= check1_array.filter((ele: number, index: number)=> ele!==0);
        const check2_nozero: number[]= check2_array.filter((ele: number, index: number)=> ele!==0);


        const check0_array_decode: string[]= check0_nozero.map((ele:number)=>  moment(ele).format('HH:mm'));
        const check1_array_decode: string[]= check1_nozero.map((ele:number)=>  moment(ele).format('HH:mm'));
        const check2_array_decode: string[]= check2_nozero.map((ele:number)=>  moment(ele).format('HH:mm'));

        console.table(check0_array_decode);
        console.table(check1_array_decode);
        console.table(check2_array_decode);
  
        const mincheck0:number = Math.min.apply(Math, check0_nozero);
        const maxcheck0:number = Math.max.apply(Math, check0_nozero);

        const mincheck1:number = Math.min.apply(Math, check1_nozero);
        const maxcheck1:number = Math.max.apply(Math, check1_nozero);

        const mincheck2:number = Math.min.apply(Math, check2_nozero);
        const maxcheck2:number = Math.max.apply(Math, check2_nozero);
        
        if(team ==='TEAM 1' || team==='TEAM 2' || 'TEAM 12T')
        {
            const in_start1: number = moment(cainfo[1].IN_START.substring(11,16),'HH:mm').valueOf();
            const in_end1: number = moment(cainfo[1].IN_END.substring(11,16),'HH:mm').valueOf();
            const out_start1: number = moment(cainfo[1].OUT_START.substring(11,16),'HH:mm').valueOf();
            const out_end1: number = moment(cainfo[1].OUT_END.substring(11,16),'HH:mm').valueOf();

            const in_start2: number = moment(cainfo[2].IN_START.substring(11,16),'HH:mm').valueOf();
            const in_end2: number = moment(cainfo[2].IN_END.substring(11,16),'HH:mm').valueOf();
            const out_start2: number = moment(cainfo[2].OUT_START.substring(11,16),'HH:mm').valueOf();
            const out_end2: number = moment(cainfo[2].OUT_END.substring(11,16),'HH:mm').valueOf();

            


            console.log('-----decode------------'); 
            

            console.log('-----------------');            
            console.log('mincheck1',mincheck1);
            console.log('in_start1',in_start1);
            console.log('in_end1',in_end1);
            console.log('out_start1',out_start1);
            console.log('out_end1',out_end1);

            console.log('maxcheck0',maxcheck0);

            console.log('in_start2',in_start2);
            console.log('in_end2',in_end2);
            console.log('out_start2',out_start2);
            console.log('out_end2',out_end2); 



            
            let check1check: string = 'NA';
            if(mincheck1 >= in_start1 && mincheck1 <= in_end1)
            {
                check1check = 'VAOCA1';
            }
            else if(mincheck1 >= in_start2 && mincheck1 <= in_end2)
            {
                check1check = 'VAOCA2';
            }
            
            if(mincheck1 >= out_start1 && mincheck1 <= out_end1)
            {
                check1check = 'RACA1';
            }
            else if(mincheck1 >= out_start2 && mincheck1 <= out_end2)
            {
                check1check = 'RACA2';
            }
            
            let check0check: string = 'NA';
            if(maxcheck0 >= out_start1 && maxcheck0 <= out_end1)
            {
                check0check = 'RACA1'; 
            }
            else if(maxcheck0 >= out_start2 && maxcheck0 <= out_end2)
            {
                check0check = 'RACA2';
            }

            if(maxcheck0 >= in_start1 && maxcheck0 <= in_end1)
            {
                check0check = 'VAOCA1'; 
            }
            else if(maxcheck0 >= in_start2 && maxcheck0 <= in_end2)
            {
                check0check = 'VAOCA2';
            }

            let final_ca: string = 'NA';
            if(check1check ==='VAOCA1' && check0check ==='VAOCA1')
            {
                final_ca = 'CA1';//
            }            
            else if(check1check ==='VAOCA1' && check0check ==='VAOCA2')
            {
                final_ca = 'CA1';//
            }
            if(check1check ==='VAOCA1' && check0check ==='RACA1')
            {
                final_ca = 'CA1';
            }            
            else if(check1check ==='VAOCA1' && check0check ==='RACA2')
            {
                final_ca = 'CA1';//---
            }
            else if(check1check ==='VAOCA2' && check0check ==='VAOCA1')
            {
                final_ca = 'CA2';///
            }
            else if(check1check ==='VAOCA2' && check0check ==='VAOCA2')
            {
                final_ca = 'CA2';///
            }
            else if(check1check ==='VAOCA2' && check0check ==='RACA1')
            {
                final_ca = 'CA2';///
            }
            else if(check1check ==='VAOCA2' && check0check ==='RACA2')
            {
                final_ca = 'CA2';///
            }
            else if(check1check ==='RACA1' && check0check ==='VAOCA1')
            {
                final_ca = 'CA2';
            }           
            else if(check1check ==='RACA1' && check0check ==='VAOCA2')
            {
                final_ca = 'CA2';
            }           
            else if(check1check ==='RACA1' && check0check ==='RACA1')
            {
                final_ca = 'CA2';
            }           
            else if(check1check ==='RACA1' && check0check ==='RACA2')
            {
                final_ca = 'CA2';
            }           
            else if(check1check ==='RACA2' && check0check ==='VAOCA1')
            {
                final_ca = 'CA2';
            }           
            else if(check1check ==='RACA2' && check0check ==='VAOCA2')
            {
                final_ca = 'CA2';
            }           
            else if(check1check ==='RACA2' && check0check ==='RACA1')
            {
                final_ca = 'CA2';
            }           
            else if(check1check ==='RACA2' && check0check ==='RACA2')
            {
                final_ca = 'CA2';
            }           
            else 
            {
                final_ca ='NA'
            }

            console.log('-----------------');          
            console.log('_IN_START',cainfo[1].IN_START);
            console.log('in_start1',in_start1);

            console.log('in_start1',moment(in_start1).format('HH:mm'));
            console.log('in_end1',moment(in_end1).format('HH:mm'));
            console.log('mincheck1', moment(mincheck1).format('HH:mm'));

            console.log('out_start1',moment(out_start1).format('HH:mm'));
            console.log('out_end1',moment(out_end1).format('HH:mm'));

            console.log('in_start2',moment(in_start2).format('HH:mm'));
            console.log('in_end2',moment(in_end2).format('HH:mm'));

            console.log('out_start2',moment(out_start2).format('HH:mm'));
            console.log('out_end2',moment(out_end2).format('HH:mm'));
            
            console.log('maxcheck0', moment(maxcheck0).format('HH:mm'));

            console.log('check1check', check1check);
            console.log('check0check', check0check);
            console.log('final ca', final_ca);
              
            const in_start: number = final_ca === 'CA1'? in_start1 : in_start2;
            const in_end: number = final_ca === 'CA1'? in_end1 : in_end2;
            const out_start: number = final_ca === 'CA1'? out_start1 : out_start2;
            const out_end: number = final_ca === 'CA1'? out_end1 : out_end2;

            const check0_start_range: number[]= check0_nozero.filter((ele:number, index: number)=> ele >= in_start && ele <= in_end);
            const check0_end_range: number[]= check0_nozero.filter((ele:number, index: number)=> ele >= out_start && ele <= out_end);
    
            const check1_start_range: number[]= check1_nozero.filter((ele:number, index: number)=> ele >= in_start && ele <= in_end);
            const check1_end_range: number[]= check1_nozero.filter((ele:number, index: number)=> ele >= out_start && ele <= out_end);
    
            const check2_start_range: number[]= check2_nozero.filter((ele:number, index: number)=> ele >= in_start && ele <= in_end);
            const check2_end_range: number[]= check2_nozero.filter((ele:number, index: number)=> ele >= out_start && ele <= out_end);

            //ca dem
            const minStartRange:number = Math.min.apply(Math, check1_start_range);
            const maxEndRange:number = Math.max.apply(Math, check2_end_range);

            //ca ngay
            const maxStartRange:number = Math.max.apply(Math, check1_end_range);

            //min of all check0
            const minAllCheck0:number = Math.min.apply(Math,check0_nozero);
            //max of all check0
            const maxAllCheck0:number = Math.max.apply(Math,check0_nozero);       

            //min of all check1
            const minAllCheck1:number = Math.min.apply(Math,check1_nozero);
            //max of all check1
            const maxAllCheck1:number = Math.max.apply(Math,check1_nozero);

            //max all check2
            const maxAllCheck2:number = Math.max.apply(Math,check2_nozero);

            switch(final_ca)
            { 
                case 'CA1':
                    result= {
                        IN_TIME: moment(minStartRange).isValid()?  moment(minStartRange).format('HH:mm'): check1_nozero.length>0? moment(minAllCheck1).format('HH:mm'): tgv,
                        OUT_TIME: moment(maxStartRange).isValid()?  moment(maxStartRange).format('HH:mm'):check1_nozero.length>0? moment(maxAllCheck1).format('HH:mm'): tgr,
                    }
                break;
                case 'CA2':
                    result= {
                        IN_TIME: moment(minStartRange).isValid()?  moment(minStartRange).format('HH:mm'):check1_nozero.length>0? moment(minAllCheck1).format('HH:mm'): tgv,
                        OUT_TIME: moment(maxEndRange).isValid()?  moment(maxEndRange).format('HH:mm'):check2_nozero.length>0? moment(maxAllCheck2).format('HH:mm'): tgr,
                    }
                break;
                default: 
                    let  temp_intime = check1_nozero.length>0? moment(minAllCheck1).format('HH:mm'): tgv;
                    let  temp_outtime = check1_nozero.length>0? moment(maxAllCheck1).format('HH:mm'): tgv;
                    result= {
                        IN_TIME: temp_intime===temp_outtime? temp_intime: tgv,
                        OUT_TIME: temp_intime===temp_outtime? tgr: temp_outtime,
                    }
                break;
            }
        }
        else
        {
            const in_start: number = moment(cainfo[0].IN_START,'HH:mm').valueOf();
            const in_end: number = moment(cainfo[0].IN_END,'HH:mm').valueOf();
            const out_start: number = moment(cainfo[0].OUT_START,'HH:mm').valueOf();
            const out_end: number = moment(cainfo[0].OUT_END,'HH:mm').valueOf();

            const check0_start_range: number[]= check0_nozero.filter((ele:number, index: number)=> ele >= in_start && ele <= in_end);
            const check0_end_range: number[]= check0_nozero.filter((ele:number, index: number)=> ele >= out_start && ele <= out_end);
    
            const check1_start_range: number[]= check1_nozero.filter((ele:number, index: number)=> ele >= in_start && ele <= in_end);
            const check1_end_range: number[]= check1_nozero.filter((ele:number, index: number)=> ele >= out_start && ele <= out_end);
    
            const check2_start_range: number[]= check2_nozero.filter((ele:number, index: number)=> ele >= in_start && ele <= in_end);
            const check2_end_range: number[]= check2_nozero.filter((ele:number, index: number)=> ele >= out_start && ele <= out_end);

            //ca dem
            const minStartRange:number = Math.min.apply(Math, check1_start_range);
            const maxEndRange:number = Math.max.apply(Math, check2_end_range);

            //ca ngay
            const maxStartRange:number = Math.max.apply(Math, check1_end_range);


            //min of all check0
            const minAllCheck0:number = Math.min.apply(Math,check0_nozero);
            //max of all check0
            const maxAllCheck0:number = Math.max.apply(Math,check0_nozero);       

            //min of all check1
            const minAllCheck1:number = Math.min.apply(Math,check1_nozero);
            //max of all check1
            const maxAllCheck1:number = Math.max.apply(Math,check1_nozero);

            //max all check2
            const maxAllCheck2:number = Math.max.apply(Math,check2_nozero);

            result= {
                IN_TIME: moment(minStartRange).isValid()?  moment(minStartRange).format('HH:mm'): check1_nozero.length>0? moment(minAllCheck1).format('HH:mm'): tgv,
                OUT_TIME: moment(maxStartRange).isValid()?  moment(maxStartRange).format('HH:mm'):check1_nozero.length>0? moment(maxAllCheck1).format('HH:mm'): tgr,
            } 

        }

        return result;
    }  
    
    const testcomparetime=()=> {
        const a:number = moment.utc('19:47:42','HH:mm:ss').valueOf();
        const reverse_a: string = moment.utc(a).format('HH:mm:ss');
        console.log('a',a);
        console.log('reverse_a',reverse_a);      
    }
    const loadCaInfo=()=> {
        generalQuery("loadCaInfo", {
            
          })
            .then((response) => {
              //console.log(response.data.data);
              if (response.data.tk_status !== "NG") {
                const loaded_data: CA_INFO[] = response.data.data.map(
                  (element: CA_INFO, index: number) => {
                   return {
                    ...element,
                   }
                  }
                ); 
                console.log('cainfo',loaded_data);              
                setCaInfo(loaded_data); 
              } else {
                Swal.fire("Thông báo", " Có lỗi : " + response.data.message, "error");
              }
            })
            .catch((error) => {
              console.log(error);
              Swal.fire("Thông báo", " Có lỗi : " + error, "error");
            });        
    }

    useEffect(() => {
      testcomparetime();
      loadCaInfo();
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
                    checkBP(userData?.EMPL_NO,userData?.MAINDEPTNAME,['NHANSU'], loadBangChamCong);                    
                }}
              >
                Tra chấm công
              </button>
            </div>
          </div>      
          <div className='tracuuYCSXTable'>           
            {chamcongTBMM}        
          </div>
          {showhidePivotTable && (
          <div className='pivottable1'>
            <IconButton
              className='buttonIcon'    
              onClick={() => {
                setShowHidePivotTable(false);
              }}
            >
              <AiFillCloseCircle color='blue' size={25} />
              Close
            </IconButton>
            <PivotTable datasource={selectedDataSource} tableID='datasxtablepivot' />
          </div>
        )}
        </div>
      </div>
    );
  };
  export default BANGCHAMCONG;
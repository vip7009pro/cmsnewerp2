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
import "./QuotationManager.scss";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import { MdOutlinePivotTableChart } from "react-icons/md";
import { SaveExcel, checkBP, weekdayarray } from "../../../api/GlobalFunction";
import { generalQuery } from "../../../api/Api";
import PivotTable from "../../../components/PivotChart/PivotChart";
import { RootState } from "../../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { UserData } from "../../../redux/slices/globalSlice";

interface BANGGIA_DATA {
  CUST_NAME_KD: string,
  G_NAME: string,
  G_NAME_KD: string,
  PROD_MAIN_MATERIAL: string,
  MOQ: number,
  PRICE1: number,
  PRICE2: number,
  PRICE3: number,
  PRICE4: number,
  PRICE5: number,
  PRICE6: number,
  PRICE7: number,
  PRICE8: number,
  PRICE9: number,
  PRICE10: number,
  PRICE11: number,
  PRICE12: number,
  PRICE13: number,
  PRICE14: number,
  PRICE15: number,
  PRICE16: number,
  PRICE17: number,
  PRICE18: number,
  PRICE19: number,
  PRICE20: number,
  PRICE_DATE1: string,
  PRICE_DATE2: string,
  PRICE_DATE3: string,
  PRICE_DATE4: string,
  PRICE_DATE5: string,
  PRICE_DATE6: string,
  PRICE_DATE7: string,
  PRICE_DATE8: string,
  PRICE_DATE9: string,
  PRICE_DATE10: string,
  PRICE_DATE11: string,
  PRICE_DATE12: string,
  PRICE_DATE13: string,
  PRICE_DATE14: string,
  PRICE_DATE15: string,
  PRICE_DATE16: string,
  PRICE_DATE17: string,
  PRICE_DATE18: string,
  PRICE_DATE19: string,
  PRICE_DATE20: string,
}
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

const QuotationManager = () => {
  const userData: UserData | undefined = useSelector(
      (state: RootState) => state.totalSlice.userData
  );
  const [cainfo,setCaInfo]= useState<CA_INFO[]>([]);
  const [bangchamcong,setBangChamCong]= useState<BANGCHAMCONG_DATA[]>([]);
  const [banggia,setBangGia]= useState<BANGGIA_DATA[]>([]);
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [alltime, setAllTime] = useState(false);
  const [cust_name, setCust_Name]= useState('');
  const [codeKD, setCodeKD] = useState("");
  const [codeCMS, setCodeCMS] = useState("");
  const [m_name, setM_Name] = useState("");

  const fields_chamcong: any = [
    {
      caption: "CUST_NAME_KD",
      width: 80,
      dataField: "CUST_NAME_KD",
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
      caption: "G_NAME_KD",
      width: 80,
      dataField: "G_NAME_KD",
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
      caption: "PROD_MAIN_MATERIAL",
      width: 80,
      dataField: "PROD_MAIN_MATERIAL",
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
      caption: "MOQ",
      width: 80,
      dataField: "MOQ",
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
      caption: "PRICE1",
      width: 80,
      dataField: "PRICE1",
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
      caption: "PRICE2",
      width: 80,
      dataField: "PRICE2",
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
      caption: "PRICE3",
      width: 80,
      dataField: "PRICE3",
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
      caption: "PRICE4",
      width: 80,
      dataField: "PRICE4",
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
      caption: "PRICE5",
      width: 80,
      dataField: "PRICE5",
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
      caption: "PRICE6",
      width: 80,
      dataField: "PRICE6",
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
      caption: "PRICE7",
      width: 80,
      dataField: "PRICE7",
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
      caption: "PRICE8",
      width: 80,
      dataField: "PRICE8",
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
      caption: "PRICE9",
      width: 80,
      dataField: "PRICE9",
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
      caption: "PRICE10",
      width: 80,
      dataField: "PRICE10",
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
      caption: "PRICE11",
      width: 80,
      dataField: "PRICE11",
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
      caption: "PRICE12",
      width: 80,
      dataField: "PRICE12",
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
      caption: "PRICE13",
      width: 80,
      dataField: "PRICE13",
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
      caption: "PRICE14",
      width: 80,
      dataField: "PRICE14",
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
      caption: "PRICE15",
      width: 80,
      dataField: "PRICE15",
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
      caption: "PRICE16",
      width: 80,
      dataField: "PRICE16",
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
      caption: "PRICE17",
      width: 80,
      dataField: "PRICE17",
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
      caption: "PRICE18",
      width: 80,
      dataField: "PRICE18",
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
      caption: "PRICE19",
      width: 80,
      dataField: "PRICE19",
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
      caption: "PRICE20",
      width: 80,
      dataField: "PRICE20",
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
      caption: "PRICE_DATE1",
      width: 80,
      dataField: "PRICE_DATE1",
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
      caption: "PRICE_DATE2",
      width: 80,
      dataField: "PRICE_DATE2",
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
      caption: "PRICE_DATE3",
      width: 80,
      dataField: "PRICE_DATE3",
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
      caption: "PRICE_DATE4",
      width: 80,
      dataField: "PRICE_DATE4",
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
      caption: "PRICE_DATE5",
      width: 80,
      dataField: "PRICE_DATE5",
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
      caption: "PRICE_DATE6",
      width: 80,
      dataField: "PRICE_DATE6",
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
      caption: "PRICE_DATE7",
      width: 80,
      dataField: "PRICE_DATE7",
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
      caption: "PRICE_DATE8",
      width: 80,
      dataField: "PRICE_DATE8",
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
      caption: "PRICE_DATE9",
      width: 80,
      dataField: "PRICE_DATE9",
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
      caption: "PRICE_DATE10",
      width: 80,
      dataField: "PRICE_DATE10",
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
      caption: "PRICE_DATE11",
      width: 80,
      dataField: "PRICE_DATE11",
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
      caption: "PRICE_DATE12",
      width: 80,
      dataField: "PRICE_DATE12",
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
      caption: "PRICE_DATE13",
      width: 80,
      dataField: "PRICE_DATE13",
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
      caption: "PRICE_DATE14",
      width: 80,
      dataField: "PRICE_DATE14",
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
      caption: "PRICE_DATE15",
      width: 80,
      dataField: "PRICE_DATE15",
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
      caption: "PRICE_DATE16",
      width: 80,
      dataField: "PRICE_DATE16",
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
      caption: "PRICE_DATE17",
      width: 80,
      dataField: "PRICE_DATE17",
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
      caption: "PRICE_DATE18",
      width: 80,
      dataField: "PRICE_DATE18",
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
      caption: "PRICE_DATE19",
      width: 80,
      dataField: "PRICE_DATE19",
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
      caption: "PRICE_DATE20",
      width: 80,
      dataField: "PRICE_DATE20",
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
      store: banggia,
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
          dataSource={banggia}
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
                  SaveExcel(banggia, "PriceTable");
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
          <Column dataField='CUST_NAME_KD' caption='CUST_NAME_KD' width={100}></Column>
          <Column dataField='G_NAME' caption='G_NAME' width={100}></Column>
          <Column dataField='G_NAME_KD' caption='G_NAME_KD' width={100}></Column>
          <Column dataField='PROD_MAIN_MATERIAL' caption='PROD_MAIN_MATERIAL' width={100}></Column>
          <Column dataField='MOQ' caption='MOQ' width={100}></Column>
          <Column dataField='PRICE1' caption='PRICE1' width={100} dataType='number'
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "blue", fontWeight: "normal" }}>
                  {e.data.PRICE1?.toFixed(6).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6,                    
                  })}
                </span>
              );
            }}></Column>
          <Column dataField='PRICE2' caption='PRICE2' width={100} dataType='number'
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "blue", fontWeight: "normal" }}>
                  {e.data.PRICE2?.toFixed(6).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6,                    
                  })}
                </span>
              );
            }}></Column>
          <Column dataField='PRICE3' caption='PRICE3' width={100} dataType='number'
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "blue", fontWeight: "normal" }}>
                  {e.data.PRICE3?.toFixed(6).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6,                    
                  })}
                </span>
              );
            }}></Column>
          <Column dataField='PRICE4' caption='PRICE4' width={100} dataType='number'
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "blue", fontWeight: "normal" }}>
                  {e.data.PRICE4?.toFixed(6).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6,                    
                  })}
                </span>
              );
            }}></Column>
          <Column dataField='PRICE5' caption='PRICE5' width={100} dataType='number'
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "blue", fontWeight: "normal" }}>
                  {e.data.PRICE5?.toFixed(6).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6,                    
                  })}
                </span>
              );
            }}></Column>
          <Column dataField='PRICE6' caption='PRICE6' width={100} dataType='number'
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "blue", fontWeight: "normal" }}>
                  {e.data.PRICE6?.toFixed(6).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6,                    
                  })}
                </span>
              );
            }}></Column>
          <Column dataField='PRICE7' caption='PRICE7' width={100} dataType='number'
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "blue", fontWeight: "normal" }}>
                  {e.data.PRICE7?.toFixed(6).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6,                    
                  })}
                </span>
              );
            }}></Column>
          <Column dataField='PRICE8' caption='PRICE8' width={100} dataType='number'
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "blue", fontWeight: "normal" }}>
                  {e.data.PRICE8?.toFixed(6).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6,                    
                  })}
                </span>
              );
            }}></Column>
          <Column dataField='PRICE9' caption='PRICE9' width={100} dataType='number'
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "blue", fontWeight: "normal" }}>
                  {e.data.PRICE9?.toFixed(6).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6,                    
                  })}
                </span>
              );
            }}></Column>
          <Column dataField='PRICE10' caption='PRICE10' width={100} dataType='number'
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "blue", fontWeight: "normal" }}>
                  {e.data.PRICE10?.toFixed(6).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6,                    
                  })}
                </span>
              );
            }}></Column>
          <Column dataField='PRICE11' caption='PRICE11' width={100} dataType='number'
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "blue", fontWeight: "normal" }}>
                  {e.data.PRICE11?.toFixed(6).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6,                    
                  })}
                </span>
              );
            }}></Column>
          <Column dataField='PRICE12' caption='PRICE12' width={100} dataType='number'
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "blue", fontWeight: "normal" }}>
                  {e.data.PRICE12?.toFixed(6).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6,                    
                  })}
                </span>
              );
            }}></Column>
          <Column dataField='PRICE13' caption='PRICE13' width={100} dataType='number'
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "blue", fontWeight: "normal" }}>
                  {e.data.PRICE13?.toFixed(6).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6,                    
                  })}
                </span>
              );
            }}></Column>
          <Column dataField='PRICE14' caption='PRICE14' width={100} dataType='number'
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "blue", fontWeight: "normal" }}>
                  {e.data.PRICE14?.toFixed(6).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6,                    
                  })}
                </span>
              );
            }}></Column>
          <Column dataField='PRICE15' caption='PRICE15' width={100} dataType='number'
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "blue", fontWeight: "normal" }}>
                  {e.data.PRICE15?.toFixed(6).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6,                    
                  })}
                </span>
              );
            }}></Column>
          <Column dataField='PRICE16' caption='PRICE16' width={100} dataType='number'
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "blue", fontWeight: "normal" }}>
                  {e.data.PRICE16?.toFixed(6).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6,                    
                  })}
                </span>
              );
            }}></Column>
          <Column dataField='PRICE17' caption='PRICE17' width={100} dataType='number'
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "blue", fontWeight: "normal" }}>
                  {e.data.PRICE17?.toFixed(6).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6,                    
                  })}
                </span>
              );
            }}></Column>
          <Column dataField='PRICE18' caption='PRICE18' width={100} dataType='number'
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "blue", fontWeight: "normal" }}>
                  {e.data.PRICE18?.toFixed(6).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6,                    
                  })}
                </span>
              );
            }}></Column>
          <Column dataField='PRICE19' caption='PRICE19' width={100} dataType='number'
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "blue", fontWeight: "normal" }}>
                  {e.data.PRICE19?.toFixed(6).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6,                    
                  })}
                </span>
              );
            }}></Column>
          <Column dataField='PRICE20' caption='PRICE20' width={100} dataType='number'
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "blue", fontWeight: "normal" }}>
                  {e.data.PRICE20?.toFixed(6).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6,                    
                  })}
                </span>
              );
            }}></Column>
          <Column dataField='PRICE_DATE1' caption='PRICE_DATE1' width={100}></Column>
          <Column dataField='PRICE_DATE2' caption='PRICE_DATE2' width={100}></Column>
          <Column dataField='PRICE_DATE3' caption='PRICE_DATE3' width={100}></Column>
          <Column dataField='PRICE_DATE4' caption='PRICE_DATE4' width={100}></Column>
          <Column dataField='PRICE_DATE5' caption='PRICE_DATE5' width={100}></Column>
          <Column dataField='PRICE_DATE6' caption='PRICE_DATE6' width={100}></Column>
          <Column dataField='PRICE_DATE7' caption='PRICE_DATE7' width={100}></Column>
          <Column dataField='PRICE_DATE8' caption='PRICE_DATE8' width={100}></Column>
          <Column dataField='PRICE_DATE9' caption='PRICE_DATE9' width={100}></Column>
          <Column dataField='PRICE_DATE10' caption='PRICE_DATE10' width={100}></Column>
          <Column dataField='PRICE_DATE11' caption='PRICE_DATE11' width={100}></Column>
          <Column dataField='PRICE_DATE12' caption='PRICE_DATE12' width={100}></Column>
          <Column dataField='PRICE_DATE13' caption='PRICE_DATE13' width={100}></Column>
          <Column dataField='PRICE_DATE14' caption='PRICE_DATE14' width={100}></Column>
          <Column dataField='PRICE_DATE15' caption='PRICE_DATE15' width={100}></Column>
          <Column dataField='PRICE_DATE16' caption='PRICE_DATE16' width={100}></Column>
          <Column dataField='PRICE_DATE17' caption='PRICE_DATE17' width={100}></Column>
          <Column dataField='PRICE_DATE18' caption='PRICE_DATE18' width={100}></Column>
          <Column dataField='PRICE_DATE19' caption='PRICE_DATE19' width={100}></Column>
          <Column dataField='PRICE_DATE20' caption='PRICE_DATE20' width={100}></Column>

          <Summary>
            <TotalItem
              alignment='right'
              column='G_CODE'
              summaryType='count'
              valueFormat={"decimal"}
          />              
          </Summary>
        </DataGrid>
      </div>
    ),
    [banggia]
  );

  const loadBangGia = ()=> {
    generalQuery("loadbanggia", {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      M_NAME: m_name,
      G_CODE: codeCMS,
      G_NAME: codeKD,
      CUST_NAME_KD: cust_name,      
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: BANGGIA_DATA[] = response.data.data.map(
            (element: BANGGIA_DATA, index: number) => {
             return {
              ...element,
              PRICE_DATE1: element.PRICE_DATE1 !== null? moment.utc(element.PRICE_DATE1).format('YYYY-MM-DD'):'',
              PRICE_DATE2: element.PRICE_DATE2 !== null? moment.utc(element.PRICE_DATE2).format('YYYY-MM-DD'):'',
              PRICE_DATE3: element.PRICE_DATE3 !== null? moment.utc(element.PRICE_DATE3).format('YYYY-MM-DD'):'',
              PRICE_DATE4: element.PRICE_DATE4 !== null? moment.utc(element.PRICE_DATE4).format('YYYY-MM-DD'):'',
              PRICE_DATE5: element.PRICE_DATE5 !== null? moment.utc(element.PRICE_DATE5).format('YYYY-MM-DD'):'',
              PRICE_DATE6: element.PRICE_DATE6 !== null? moment.utc(element.PRICE_DATE6).format('YYYY-MM-DD'):'',
              PRICE_DATE7: element.PRICE_DATE7 !== null? moment.utc(element.PRICE_DATE7).format('YYYY-MM-DD'):'',
              PRICE_DATE8: element.PRICE_DATE8 !== null? moment.utc(element.PRICE_DATE8).format('YYYY-MM-DD'):'',
              PRICE_DATE9: element.PRICE_DATE9 !== null? moment.utc(element.PRICE_DATE9).format('YYYY-MM-DD'):'',
              PRICE_DATE10: element.PRICE_DATE10 !== null? moment.utc(element.PRICE_DATE10).format('YYYY-MM-DD'):'',
              PRICE_DATE11: element.PRICE_DATE11 !== null? moment.utc(element.PRICE_DATE11).format('YYYY-MM-DD'):'',
              PRICE_DATE12: element.PRICE_DATE12 !== null? moment.utc(element.PRICE_DATE12).format('YYYY-MM-DD'):'',
              PRICE_DATE13: element.PRICE_DATE13 !== null? moment.utc(element.PRICE_DATE13).format('YYYY-MM-DD'):'',
              PRICE_DATE14: element.PRICE_DATE14 !== null? moment.utc(element.PRICE_DATE14).format('YYYY-MM-DD'):'',
              PRICE_DATE15: element.PRICE_DATE15 !== null? moment.utc(element.PRICE_DATE15).format('YYYY-MM-DD'):'',
              PRICE_DATE16: element.PRICE_DATE16 !== null? moment.utc(element.PRICE_DATE16).format('YYYY-MM-DD'):'',
              PRICE_DATE17: element.PRICE_DATE17 !== null? moment.utc(element.PRICE_DATE17).format('YYYY-MM-DD'):'',
              PRICE_DATE18: element.PRICE_DATE18 !== null? moment.utc(element.PRICE_DATE18).format('YYYY-MM-DD'):'',
              PRICE_DATE19: element.PRICE_DATE19 !== null? moment.utc(element.PRICE_DATE19).format('YYYY-MM-DD'):'',
              PRICE_DATE20: element.PRICE_DATE20 !== null? moment.utc(element.PRICE_DATE20).format('YYYY-MM-DD'):'',
              id: index,
             }
            }
          );                
          setBangGia(loaded_data); 
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
    loadBangGia();
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
                <b>Tên khách hàng:</b>{" "}
                <input
                  type='text'
                  placeholder='SEVT'
                  value={cust_name}
                  onChange={(e) => setCust_Name(e.target.value)}
                ></input>
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
                  checkBP(userData?.EMPL_NO,userData?.MAINDEPTNAME,['KD'], loadBangGia);                    
              }}
            >
              Load Bảng Giá
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
export default QuotationManager;
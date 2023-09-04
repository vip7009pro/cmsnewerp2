import {
  Autocomplete,
  IconButton,
  TextField,
  createFilterOptions,
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
import React, {
  startTransition,
  useContext,
  useEffect,
  useState,
  useTransition,
} from "react";
import { AiFillCloseCircle, AiFillFileExcel } from "react-icons/ai";
import Swal from "sweetalert2";
import "./QLGN.scss";
import { UserContext } from "../../../api/Context";
import { generalQuery } from "../../../api/Api";
import { CustomResponsiveContainer, SaveExcel } from "../../../api/GlobalFunction";
import { MdOutlinePivotTableChart } from "react-icons/md";
import PivotTable from "../../../components/PivotChart/PivotChart";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import { CodeListData, HANDOVER_DATA } from "../../../api/GlobalInterface";

const QLGN = () => {
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);
  const [handoverdatatable, setHandoverDataTable] = useState<
    Array<HANDOVER_DATA>
  >([]);
  const [fromdate, setFromDate] = useState(moment.utc().format("YYYY-MM-DD"));
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
  const [plph, setPLPH] = useState("PH");
  const [pltl, setPLTL] = useState("PH");
  const [ldph, setLDPH] = useState("New Code");
  const [rndEmpl, setRNDEMPL] = useState("");
  const [qcEmpl, setQCEMPL] = useState("");
  const [sxEmpl, setSXEMPL] = useState("");
  const [selectedRows, setSelectedRows] = useState<HANDOVER_DATA>({
    KNIFE_FILM_ID: "",
    FACTORY_NAME: "",
    NGAYBANGIAO: "",
    G_CODE: "",
    G_NAME: "",
    PROD_TYPE: "",
    CUST_NAME_KD: "",
    LOAIBANGIAO_PDP: "",
    LOAIPHATHANH: "",
    SOLUONG: 0,
    SOLUONGOHP: 0,
    LYDOBANGIAO: "",
    PQC_EMPL_NO: "",
    RND_EMPL_NO: "",
    SX_EMPL_NO: "",
    REMARK: "",
    CFM_GIAONHAN: "",
    CFM_INS_EMPL: "",
    CFM_DATE: "",
    KNIFE_FILM_STATUS: "",
    MA_DAO: "",
    TOTAL_PRESS: 0,
    CUST_CD: "",
    KNIFE_TYPE: "",
  });
  const [selectedCode, setSelectedCode] = useState<CodeListData | null>({
    G_CODE: "6A00001B",
    G_NAME: "GT-I9500_SJ68-01284A",
    PROD_LAST_PRICE: 0,
    USE_YN: "N",
  });
  const [codeList, setCodeList] = useState<CodeListData[]>([]);
  const load_handoverdata_table = () => {
    generalQuery("loadquanlygiaonhan", {})
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: HANDOVER_DATA, index: number) => {
              return {
                ...element,
                NGAYBANGIAO: moment
                  .utc(element.NGAYBANGIAO)
                  .format("YYYY-MM-DD"),
                CFM_DATE: moment.utc(element.CFM_DATE).format("YYYY-MM-DD"),
                id: index,
              };
            },
          );
          //console.log(loadeddata);
          setHandoverDataTable(loadeddata);
          Swal.fire(
            "Thông báo",
            "Đã load: " + response.data.data.length + " dòng",
            "success",
          );
        } else {
          setHandoverDataTable([]);
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const setBarCodeInfo = (keyname: string, value: any) => {
    //console.log(keyname);
    //console.log(value);
    let tempHandoverData: HANDOVER_DATA = { ...selectedRows, [keyname]: value };
    //console.log(tempcodefullinfo);
    setSelectedRows(tempHandoverData);
  };
  const addBarcode = async () => {
    let barcodeExist: boolean = false;
    await generalQuery("checkbarcodeExist", selectedRows)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          barcodeExist = true;
        } else {
          barcodeExist = false;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    if (barcodeExist === false) {
      await generalQuery("addBarcode", selectedRows)
        .then((response) => {
          //console.log(response.data.data);
          if (response.data.tk_status !== "NG") {
            Swal.fire("Thông báo", "Thêm vật liệu thành công", "success");
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      Swal.fire("Thông báo", "Vật liệu đã tồn tại", "error");
    }
  };
  const updateBarcode = async () => {
    generalQuery("updateBarcode", selectedRows)
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          Swal.fire("Thông báo", "Update vật liệu thành công", "success");
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleSearchCodeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      load_handoverdata_table();
    }
  };
  const HandoverDataTable = React.useMemo(
    () => (
      <div className="datatb">
        <CustomResponsiveContainer>
          <DataGrid
            autoNavigateToFocusedRow={true}
            allowColumnReordering={true}
            allowColumnResizing={true}
            columnAutoWidth={false}
            cellHintEnabled={true}
            columnResizingMode={"widget"}
            showColumnLines={true}
            dataSource={handoverdatatable}
            columnWidth="auto"
            keyExpr="id"
            height={"75vh"}
            showBorders={true}
            onRowPrepared={(e) => {}}
            onSelectionChanged={(e) => {
              //setSelectedRows(e.selectedRowsData[0]);
            }}
            onRowClick={(e) => {
              setSelectedRows(e.data);
              //console.log(e.data);
            }}
          >
            <Scrolling
              useNative={true}
              scrollByContent={true}
              scrollByThumb={true}
              showScrollbar="onHover"
              mode="virtual"
            />
            <Selection mode="single" selectAllMode="allPages" />
            <Editing
              allowUpdating={false}
              allowAdding={true}
              allowDeleting={false}
              mode="batch"
              confirmDelete={true}
              onChangesChange={(e) => {}}
            />
            <Export enabled={true} />
            <Toolbar disabled={false}>
              <Item location="before">
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    SaveExcel(handoverdatatable, "MaterialStatus");
                  }}
                >
                  <AiFillFileExcel color="green" size={15} />
                  SAVE
                </IconButton>
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    setShowHidePivotTable(!showhidePivotTable);
                  }}
                >
                  <MdOutlinePivotTableChart color="#ff33bb" size={15} />
                  Pivot
                </IconButton>
              </Item>
              <Item name="searchPanel" />
              <Item name="exportButton" />
              <Item name="columnChooser" />
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
              infoText="Page #{0}. Total: {1} ({2} items)"
              displayMode="compact"
            />
            <Column
              dataField="KNIFE_FILM_ID"
              caption="KNIFE_FILM_ID"
              width={100}
            ></Column>
            <Column
              dataField="FACTORY_NAME"
              caption="FACTORY_NAME"
              width={100}
            ></Column>
            <Column
              dataField="NGAYBANGIAO"
              caption="NGAYBANGIAO"
              width={100}
            ></Column>
            <Column dataField="G_CODE" caption="G_CODE" width={100}></Column>
            <Column dataField="G_NAME" caption="G_NAME" width={100}></Column>
            <Column
              dataField="PROD_TYPE"
              caption="PROD_TYPE"
              width={100}
            ></Column>
            <Column
              dataField="CUST_NAME_KD"
              caption="CUST_NAME_KD"
              width={100}
            ></Column>
            <Column
              dataField="LOAIBANGIAO_PDP"
              caption="LOAIBANGIAO_PDP"
              width={100}
            ></Column>
            <Column
              dataField="LOAIPHATHANH"
              caption="LOAIPHATHANH"
              width={100}
            ></Column>
            <Column dataField="SOLUONG" caption="SOLUONG" width={100}></Column>
            <Column
              dataField="SOLUONGOHP"
              caption="SOLUONGOHP"
              width={100}
            ></Column>
            <Column
              dataField="LYDOBANGIAO"
              caption="LYDOBANGIAO"
              width={100}
            ></Column>
            <Column
              dataField="PQC_EMPL_NO"
              caption="PQC_EMPL_NO"
              width={100}
            ></Column>
            <Column
              dataField="RND_EMPL_NO"
              caption="RND_EMPL_NO"
              width={100}
            ></Column>
            <Column
              dataField="SX_EMPL_NO"
              caption="SX_EMPL_NO"
              width={100}
            ></Column>
            <Column dataField="REMARK" caption="REMARK" width={100}></Column>
            <Column
              dataField="CFM_GIAONHAN"
              caption="CFM_GIAONHAN"
              width={100}
            ></Column>
            <Column
              dataField="CFM_INS_EMPL"
              caption="CFM_INS_EMPL"
              width={100}
            ></Column>
            <Column
              dataField="CFM_DATE"
              caption="CFM_DATE"
              width={100}
            ></Column>
            <Column
              dataField="KNIFE_FILM_STATUS"
              caption="KNIFE_FILM_STATUS"
              width={100}
            ></Column>
            <Column dataField="MA_DAO" caption="MA_DAO" width={100}></Column>
            <Column
              dataField="TOTAL_PRESS"
              caption="TOTAL_PRESS"
              width={100}
            ></Column>
            <Column dataField="CUST_CD" caption="CUST_CD" width={100}></Column>
            <Column
              dataField="KNIFE_TYPE"
              caption="KNIFE_TYPE"
              width={100}
            ></Column>

            <Summary>
              <TotalItem
                alignment="right"
                column="id"
                summaryType="count"
                valueFormat={"decimal"}
              />
            </Summary>
          </DataGrid>
        </CustomResponsiveContainer>
      </div>
    ),
    [handoverdatatable],
  );

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
  const filterOptions1 = createFilterOptions({
    matchFrom: "any",
    limit: 100,
  });
  const [isPending, startTransition] = useTransition();
  const getcodelist = (G_NAME: string) => {
    generalQuery("selectcodeList", { G_NAME: G_NAME })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          if (!isPending) {
            startTransition(() => {
              setCodeList(response.data.data);
            });
          }
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getcodelist("");
    load_handoverdata_table();
    //setColumnDefinition(column_inspect_output);
  }, []);
  return (
    <div className="qlgn">
      <div className="tracuuDataInspection">
        <div className="tracuuDataInspectionform">
          <div className="forminput">
            <div className="forminputcolumn">
              <label>
                <Autocomplete
                  sx={{ fontSize: "0.6rem" }}
                  ListboxProps={{ style: { fontSize: "0.7rem" } }}
                  size="small"
                  disablePortal
                  options={codeList}
                  className="autocomplete1"
                  filterOptions={filterOptions1}
                  getOptionLabel={(option: CodeListData | any) =>
                    `${option.G_CODE}: ${option.G_NAME}`
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Select code" />
                  )}
                  onChange={(event: any, newValue: CodeListData | any) => {
                    console.log(newValue);
                    setSelectedCode(newValue);
                    setBarCodeInfo("G_CODE", newValue.G_CODE);
                  }}
                  value={
                    codeList.filter(
                      (e: CodeListData, index: number) =>
                        e.G_CODE === selectedRows.G_CODE,
                    )[0]
                  }
                  isOptionEqualToValue={(option: any, value: any) =>
                    option.G_CODE === value.G_CODE
                  }
                />
              </label>
              <label>
                <b>Ngày bàn giao:</b>
                <input
                  onKeyDown={(e) => {}}
                  type="date"
                  value={fromdate.slice(0, 10)}
                  onChange={(e) => setFromDate(e.target.value)}
                ></input>
              </label>

              <label>
                <b>Phân loại phát hành:</b>{" "}
                <select
                  name="vendor"
                  value={plph}
                  onChange={(e) => {
                    setPLPH(e.target.value);
                  }}
                >
                  <option value="PH">PHÁT HÀNH</option>
                  <option value="TH">THU HỒI</option>
                </select>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Phân loại tài liệu:</b>{" "}
                <select
                  name="vendor"
                  value={pltl}
                  onChange={(e) => {
                    setPLTL(e.target.value);
                  }}
                >
                  <option value="F">FILM</option>
                  <option value="D">DAO</option>
                  <option value="T">TÀI LIỆU</option>
                  <option value="M">MẮT DAO</option>
                </select>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Phân loại bàn giao:</b>{" "}
                <select
                  name="vendor"
                  value={ldph}
                  onChange={(e) => {
                    setLDPH(e.target.value);
                  }}
                >
                  <option value="New Code">New Code</option>
                  <option value="ECN">ECN</option>
                  <option value="Update">Update</option>
                  <option value="Amendment">Amendment</option>
                </select>
              </label>

              <label>
                <b>Mã nhân viên RND:</b>{" "}
                <input
                  type="text"
                  placeholder="RND"
                  value={rndEmpl}
                  onChange={(e) => setRNDEMPL(e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Mã nhân viên QC:</b>{" "}
                <input
                  type="text"
                  placeholder="QC"
                  value={qcEmpl}
                  onChange={(e) => setQCEMPL(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Mã nhân viên SX:</b>{" "}
                <input
                  type="text"
                  placeholder="SX"
                  value={sxEmpl}
                  onChange={(e) => setSXEMPL(e.target.value)}
                ></input>
              </label>
            </div>
          </div>
          <div className="formbutton">
            <button
              className="tranhatky"
              onClick={() => {
                load_handoverdata_table();
              }}
            >
              Refesh
            </button>
            <button
              className="tranhatky"
              onClick={() => {
                addBarcode();
              }}
            >
              Add
            </button>
            <button
              className="traxuatkiembutton"
              onClick={() => {
                updateBarcode();
              }}
            >
              Update
            </button>
          </div>
        </div>
        <div className="tracuuYCSXTable">{HandoverDataTable}</div>
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
export default QLGN;

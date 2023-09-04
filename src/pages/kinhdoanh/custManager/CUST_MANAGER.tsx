import { IconButton } from "@mui/material";
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
import { AiFillCloseCircle, AiFillFileExcel } from "react-icons/ai";
import Swal from "sweetalert2";
import "./CUST_MANAGER2.scss";
import { UserContext } from "../../../api/Context";
import { generalQuery } from "../../../api/Api";
import { CustomResponsiveContainer, SaveExcel, zeroPad } from "../../../api/GlobalFunction";
import { MdOutlinePivotTableChart } from "react-icons/md";
import PivotTable from "../../../components/PivotChart/PivotChart";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import { CUST_INFO } from "../../../api/GlobalInterface";
const CUST_MANAGER = () => {
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);
  const [custinfodatatable, setCUSTINFODataTable] = useState<Array<any>>([]);
  const [selectedRows, setSelectedRows] = useState<CUST_INFO>({
    id: "1",
    CUST_TYPE: "KH",
    CUST_CD: "",
    CUST_NAME_KD: "",
    CUST_NAME: "",
    CUST_ADDR1: "",
    CUST_ADDR2: "",
    CUST_ADDR3: "",
    EMAIL: "",
    TAX_NO: "",
    CUST_NUMBER: "",
    BOSS_NAME: "",
    TEL_NO1: "",
    FAX_NO: "",
    CUST_POSTAL: "",
    REMK: "",
    INS_DATE: "",
    INS_EMPL: "",
    UPD_DATE: "",
    UPD_EMPL: "",
  });
  const setCustInfo = (keyname: string, value: any) => {
    let tempCustInfo: CUST_INFO = { ...selectedRows, [keyname]: value };
    //console.log(tempcodefullinfo);
    setSelectedRows(tempCustInfo);
  };
  const autogenerateCUST_CD = async (company_type: string) => {
    let next_cust_cd: string = company_type + "001";
    await generalQuery("checkcustcd", {
      COMPANY_TYPE: company_type,
    })
      .then((response) => {
        console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let stt =
            company_type === "KH"
              ? response.data.data[0].CUST_CD.substring(2, 5)
              : response.data.data[0].CUST_CD.substring(3, 6);
          next_cust_cd = company_type + zeroPad(parseInt(stt) + 1, 3);
          console.log("nex cust_cd", next_cust_cd);
        } else {
          //Swal.fire("Thông báo", " Có lỗi : " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
        Swal.fire("Thông báo", " Có lỗi : " + error, "error");
      });
    return next_cust_cd;
  };
  const createNewCustomer = async (company_type: string) => {
    let next_cust_cd = await autogenerateCUST_CD(company_type);
    setSelectedRows({
      id: "0",
      CUST_TYPE: company_type,
      BOSS_NAME: "",
      CUST_ADDR1: "",
      CUST_ADDR2: "",
      CUST_ADDR3: "",
      EMAIL: "",
      CUST_CD: next_cust_cd,
      CUST_NAME: "",
      CUST_NAME_KD: "",
      CUST_NUMBER: "",
      CUST_POSTAL: "",
      FAX_NO: "",
      INS_DATE: "",
      INS_EMPL: "",
      REMK: "",
      TAX_NO: "",
      TEL_NO1: "",
      UPD_DATE: "",
      UPD_EMPL: "",
    });
  };
  const handleCUSTINFO = () => {
    generalQuery("get_listcustomer", {})
      .then((response) => {
        /// console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: CUST_INFO[] = response.data.data.map(
            (element: CUST_INFO, index: number) => {
              return {
                ...element,
                CUST_NAME: element.CUST_NAME !== null ? element.CUST_NAME : "",
                CUST_NAME_KD:
                  element.CUST_NAME_KD !== null ? element.CUST_NAME_KD : "",
                CUST_ADDR1:
                  element.CUST_ADDR1 !== null ? element.CUST_ADDR1 : "",
                CUST_ADDR2:
                  element.CUST_ADDR2 !== null ? element.CUST_ADDR2 : "",
                CUST_ADDR3:
                  element.CUST_ADDR3 !== null ? element.CUST_ADDR3 : "",
                EMAIL: element.EMAIL !== null ? element.EMAIL : "",
                TAX_NO: element.TAX_NO !== null ? element.TAX_NO : "",
                CUST_NUMBER:
                  element.CUST_NUMBER !== null ? element.CUST_NUMBER : "",
                BOSS_NAME: element.BOSS_NAME !== null ? element.BOSS_NAME : "",
                TEL_NO1: element.TEL_NO1 !== null ? element.TEL_NO1 : "",
                FAX_NO: element.FAX_NO !== null ? element.FAX_NO : "",
                CUST_POSTAL:
                  element.CUST_POSTAL !== null ? element.CUST_POSTAL : "",
                REMK: element.REMK !== null ? element.REMK : "",
                INS_DATE:
                  element.INS_DATE !== null
                    ? moment.utc(element.INS_DATE).format("YYYY-MM-DD")
                    : "",
                UPD_DATE:
                  element.UPD_DATE !== null
                    ? moment.utc(element.UPD_DATE).format("YYYY-MM-DD")
                    : "",
                id: index,
              };
            },
          );
          setCUSTINFODataTable(loadeddata);
          Swal.fire(
            "Thông báo",
            "Đã load " + response.data.data.length + " dòng",
            "success",
          );
        } else {
          setCUSTINFODataTable([]);
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_addCustomer = () => {
    generalQuery("add_customer", selectedRows)
      .then((response) => {
        /// console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          Swal.fire("Thông báo", "Thêm khách thành công", "success");
          handleCUSTINFO();
        } else {
          Swal.fire(
            "Thông báo",
            "Thêm khách thất bại: " + response.data.message,
            "error",
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_editCustomer = () => {
    generalQuery("edit_customer", selectedRows)
      .then((response) => {
        /// console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          Swal.fire("Thông báo", "Sửa khách thành công", "success");
          handleCUSTINFO();
        } else {
          Swal.fire(
            "Thông báo",
            "Sửa khách thất bại: " + response.data.message,
            "error",
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const materialDataTable = React.useMemo(
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
            dataSource={custinfodatatable}
            columnWidth="auto"
            keyExpr="id"
            height={"75vh"}
            showBorders={true}
            onSelectionChanged={(e) => {
              setSelectedRows(e.selectedRowsData[0]);
            }}
            onRowClick={(e) => {
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
                    SaveExcel(custinfodatatable, "Customer Table");
                  }}
                >
                  <AiFillFileExcel color="green" size={25} />
                  SAVE
                </IconButton>
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    setShowHidePivotTable(!showhidePivotTable);
                  }}
                >
                  <MdOutlinePivotTableChart color="#ff33bb" size={25} />
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
    [custinfodatatable],
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
    store: custinfodatatable,
  });
  useEffect(() => {
    handleCUSTINFO();
    //setColumnDefinition(column_inspect_output);
  }, []);
  return (
    <div className="cust_manager2">
      <div className="tracuuDataInspection">
        <div className="tracuuDataInspectionform">
          <div className="forminput">
            <div className="forminputcolumn">
              <label>
                <b>Mã KH:</b>{" "}
                <input
                  type="text"
                  placeholder="Mã khách hàng"
                  value={selectedRows?.CUST_CD}
                  onChange={(e) => setCustInfo("CUST_CD", e.target.value)}
                ></input>
              </label>
              <label>
                <b>Tên KH(KD):</b>{" "}
                <input
                  type="text"
                  placeholder="Tên khách hàng"
                  value={selectedRows?.CUST_NAME_KD}
                  onChange={(e) => setCustInfo("CUST_NAME_KD", e.target.value)}
                ></input>
              </label>
              <label>
                <b>Tên KH(FULL):</b>{" "}
                <input
                  type="text"
                  placeholder="Tên khách hàng"
                  value={selectedRows?.CUST_NAME}
                  onChange={(e) => setCustInfo("CUST_NAME", e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Địa chỉ chính:</b>{" "}
                <input
                  type="text"
                  placeholder="Địa chỉ"
                  value={selectedRows?.CUST_ADDR1}
                  onChange={(e) => setCustInfo("CUST_ADDR1", e.target.value)}
                ></input>
              </label>
              <label>
                <b>Địa chỉ 2:</b>{" "}
                <input
                  type="text"
                  placeholder="Địa chỉ"
                  value={selectedRows?.CUST_ADDR2}
                  onChange={(e) => setCustInfo("CUST_ADDR2", e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Địa chỉ 3:</b>{" "}
                <input
                  type="text"
                  placeholder="Địa chỉ"
                  value={selectedRows?.CUST_ADDR3}
                  onChange={(e) => setCustInfo("CUST_ADDR3", e.target.value)}
                ></input>
              </label>
              <label>
                <b>MST</b>{" "}
                <input
                  type="text"
                  placeholder="Mã số thuế"
                  value={selectedRows?.TAX_NO}
                  onChange={(e) => setCustInfo("TAX_NO", e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Số ĐT:</b>{" "}
                <input
                  type="text"
                  placeholder="Số điện thoại"
                  value={selectedRows?.CUST_NUMBER}
                  onChange={(e) => setCustInfo("CUST_NUMBER", e.target.value)}
                ></input>
              </label>
              <label>
                <b>Tên chủ:</b>{" "}
                <input
                  type="text"
                  placeholder="Tên chủ"
                  value={selectedRows?.BOSS_NAME}
                  onChange={(e) => setCustInfo("BOSS_NAME", e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Số phone:</b>{" "}
                <input
                  type="text"
                  placeholder="Số phone"
                  value={selectedRows?.TEL_NO1}
                  onChange={(e) => setCustInfo("TEL_NO1", e.target.value)}
                ></input>
              </label>
              <label>
                <b>Fax:</b>{" "}
                <input
                  type="text"
                  placeholder="FAX"
                  value={selectedRows?.FAX_NO}
                  onChange={(e) => setCustInfo("FAX_NO", e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Mã bưu điện:</b>{" "}
                <input
                  type="text"
                  placeholder="Mã bưu điện"
                  value={selectedRows?.CUST_POSTAL}
                  onChange={(e) => setCustInfo("CUST_POSTAL", e.target.value)}
                ></input>
              </label>
              <label>
                <b>Remark:</b>{" "}
                <input
                  type="text"
                  placeholder="Ghi chú"
                  value={selectedRows?.REMK}
                  onChange={(e) => setCustInfo("REMK", e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Email:</b>{" "}
                <input
                  type="text"
                  placeholder="Email"
                  value={selectedRows?.EMAIL}
                  onChange={(e) => setCustInfo("REMK", e.target.value)}
                ></input>
              </label>
              <label>
                <b>Phân loại:</b>{" "}
                <select
                  name="plvendor"
                  value={selectedRows?.CUST_TYPE}
                  onChange={(e) => {
                    setCustInfo("CUST_TYPE", e.target.value);
                  }}
                >
                  <option value="KH">Khách Hàng</option>
                  <option value="NCC">Nhà Cung Cấp</option>
                </select>
              </label>
            </div>
          </div>
          <div className="formbutton">
            <button
              className="tranhatky"
              onClick={() => {
                createNewCustomer(selectedRows.CUST_TYPE);
              }}
            >
              New
            </button>
            <button
              className="tranhatky"
              onClick={() => {
                handle_addCustomer();
              }}
            >
              Add
            </button>
            <button
              className="traxuatkiembutton"
              onClick={() => {
                handle_editCustomer();
              }}
            >
              Update
            </button>
          </div>
        </div>
        <div className="tracuuYCSXTable">{materialDataTable}</div>
        {showhidePivotTable && (
          <div className="pivottable1">
            <IconButton
              className="buttonIcon"
              onClick={() => {
                setShowHidePivotTable(false);
              }}
            >
              <AiFillCloseCircle color="blue" size={25} />
              Close
            </IconButton>
            <PivotTable datasource={dataSource} tableID="invoicetablepivot" />
          </div>
        )}
      </div>
    </div>
  );
};
export default CUST_MANAGER;

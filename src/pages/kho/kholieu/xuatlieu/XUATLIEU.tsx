import {
  Button,
  Autocomplete,
  Checkbox,
  FormControlLabel,
  IconButton,
  TextField,
  createFilterOptions,
  Typography,
  AutocompleteRenderOptionState,
  AutocompleteOwnerState,
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
import { AiFillCloseCircle, AiFillFileExcel } from "react-icons/ai";
import Swal from "sweetalert2";
import { MdOutlinePivotTableChart } from "react-icons/md";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import { CustomerListData, DKXL_DATA, MATERIAL_TABLE_DATA, MaterialListData, WH_M_INPUT_DATA, WH_M_OUTPUT_DATA } from "../../../../api/GlobalInterface";
import { generalQuery, getCompany } from "../../../../api/Api";
import { CustomResponsiveContainer, SaveExcel, zeroPad } from "../../../../api/GlobalFunction";
import PivotTable from "../../../../components/PivotChart/PivotChart";
import './XUATLIEU.scss';
const XUATLIEU = () => {
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);
  const [material_table_data, set_material_table_data] = useState<Array<WH_M_INPUT_DATA>>([]);
  const [datasxtable, setDataSXTable] = useState<Array<any>>([]);
  const [giao_empl, setGiao_Empl] = useState("");
  const [nhan_empl, setNhan_Empl] = useState("");
  const [giao_empl_name, setGiao_Empl_Name] = useState("");
  const [nhan_empl_name, setNhan_Empl_Name] = useState("");
  const [planId, setPlanId] = useState("");
  const [g_name, setGName] = useState("");
  const [invoice_no, setInvoiceNo] = useState("");
  const [loaink, setloaiNK] = useState("03");
  const [prepareOutData, setPrepareOutData] = useState<WH_M_OUTPUT_DATA[]>([]);
  const [selectedRows, setSelectedRows] = useState<MATERIAL_TABLE_DATA>({
    M_ID: 0,
    M_NAME: "",
    DESCR: "",
    CUST_CD: "",
    CUST_NAME_KD: "",
    SSPRICE: 0,
    CMSPRICE: 0,
    SLITTING_PRICE: 0,
    MASTER_WIDTH: 0,
    ROLL_LENGTH: 0,
    USE_YN: "Y",
    INS_DATE: "",
    INS_EMPL: "",
    UPD_DATE: "",
    UPD_EMPL: "",
    EXP_DATE: "",
  });
  const [selectedFactory, setSelectedFactory] = useState("NM1");
  const [materialList, setMaterialList] = useState<MaterialListData[]>([
    {
      M_CODE: "A0000001",
      M_NAME: "#200",
      WIDTH_CD: 1200,
    },
  ]);
  const [selectedMaterial, setSelectedMaterial] =
    useState<MaterialListData | null>({
      M_CODE: "A0000001",
      M_NAME: "#200",
      WIDTH_CD: 1200,
    });
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerListData | null>({
      CUST_CD: getCompany() === "CMS" ? "6969" : "KH000",
      CUST_NAME: getCompany() === "CMS" ? "CMSVINA" : "PVN",
      CUST_NAME_KD: getCompany() === "CMS" ? "CMSVINA" : "PVN",
    });
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [m_lot_no, setM_LOT_NO] = useState("");
  const [m_name, setM_Name] = useState("");
  const [width_cd, setWidthCD] = useState(0);
  const [in_cfm_qty, setInCFMQTY] = useState(0);
  const [roll_qty, setRollQty] = useState(0);
  const [m_code, setM_Code] = useState("");
  const [lieql_sx, setLieuQL_SX] = useState(0);
  const [out_date, setOut_Date] = useState("");
  const [wahs_cd, setWAHS_CD] = useState("");
  const [loc_cd, setLOC_CD] = useState("");
  const [solanout, setSoLanOut] = useState(1);
  const [fsc, setFSC] = useState('N');
  const checkEMPL_NAME = (selection: number, EMPL_NO: string) => {
    generalQuery("checkEMPL_NO_mobile", { EMPL_NO: EMPL_NO })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);\
          if (selection === 1) {
            setGiao_Empl_Name(
              response.data.data[0].MIDLAST_NAME +
              " " +
              response.data.data[0].FIRST_NAME,
            );
          } else {
            setNhan_Empl_Name(
              response.data.data[0].MIDLAST_NAME +
              " " +
              response.data.data[0].FIRST_NAME,
            );
          }
        } else {
          setGiao_Empl_Name("");
          setGiao_Empl_Name("");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const checkPlanID = (PLAN_ID: string) => {
    generalQuery("checkPLAN_ID", { PLAN_ID: PLAN_ID })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);
          setPlanId(PLAN_ID);
          setGName(response.data.data[0].G_NAME);
          setFSC(response.data.data[0].G_NAME ?? 'N')
        } else {
          setGName("");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const addMaterial = async () => {
    let temp_m_invoie: WH_M_INPUT_DATA = {
      id: moment().format("YYYYMMDD_HHmmsss") + material_table_data.length.toString(),
      CUST_CD: selectedCustomer?.CUST_CD ?? "",
      CUST_NAME_KD: selectedCustomer?.CUST_NAME_KD ?? "",
      M_NAME: selectedMaterial?.M_NAME ?? "",
      M_CODE: selectedMaterial?.M_CODE ?? "",
      WIDTH_CD: selectedMaterial?.WIDTH_CD!,
      INVOICE_NO: invoice_no,
      EXP_DATE: todate,
      PROD_REQUEST_NO: "",
      REMARK: "",
      MET_PER_ROLL: 0,
      LOT_QTY: 0,
      ROLL_PER_LOT: 1,
    }
    if (temp_m_invoie.CUST_CD === '' || temp_m_invoie.M_CODE === '' || temp_m_invoie.INVOICE_NO === '' || temp_m_invoie.EXP_DATE === '') {
      Swal.fire("Thông báo", "Không được để trống thông tin cần thiết", "error");
    }
    else {
      set_material_table_data([...material_table_data, temp_m_invoie]);
    }
  };
  const xuatkho = async () => {
    if (prepareOutData.length > 0) {
      let err_code: string = '';
      for (let i = 0; i < prepareOutData.length; i++) {
        await generalQuery("insert_O302", {
          OUT_DATE: prepareOutData[i].OUT_DATE,
          OUT_NO: prepareOutData[i].OUT_NO,
          OUT_SEQ: prepareOutData[i].OUT_SEQ,
          M_LOT_NO: prepareOutData[i].M_LOT_NO,
          LOC_CD: prepareOutData[i].LOC_CD,
          M_CODE: prepareOutData[i].M_CODE,
          OUT_CFM_QTY: prepareOutData[i].TOTAL_QTY,
          WAHS_CD: prepareOutData[i].WAHS_CD,
          FACTORY: selectedFactory,
          CUST_CD: selectedCustomer?.CUST_CD,
          ROLL_QTY: prepareOutData[i].ROLL_QTY,
          IN_DATE_O302: prepareOutData[i].IN_DATE,
          PLAN_ID: planId,
          SOLANOUT: solanout,
          LIEUQL_SX: prepareOutData[i].LIEUQL_SX,
          INS_RECEPTION: nhan_empl,
          FSC_O302: fsc,
        })
          .then((response) => {
            if (response.data.tk_status !== "NG") {
            } else {
              err_code += `Lỗi: ${response.data.message} | `;
            }
          })
          .catch((error) => {
            //console.log(error);
          });
      }
      if (err_code !== '') {
        Swal.fire('Thông báo', 'Nhập kho vật liệu thất bại: ' + err_code, 'error');
      }
      else {
        set_material_table_data([]);
        Swal.fire('Thông báo', 'Nhập kho vật liệu thành công', 'success');
      }
    }
    else {
      Swal.fire("Thông báo", "Chưa có dòng nào", 'error');
    }
  }
  const checkLotNVL = async (M_LOT_NO: string, PLAN_ID: string) => {
    await generalQuery("checkMNAMEfromLotI222XuatKho", { M_LOT_NO: M_LOT_NO, PLAN_ID: PLAN_ID })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);
          setM_Name(
            response.data.data[0].M_NAME +
            " | " +
            response.data.data[0].WIDTH_CD,
          );
          setM_Code(response.data.data[0].M_CODE);
          setWidthCD(response.data.data[0].WIDTH_CD);
          setInCFMQTY(response.data.data[0].IN_CFM_QTY);
          setRollQty(response.data.data[0].ROLL_QTY);
          setLieuQL_SX(response.data.data[0].LIEUQL_SX ?? 0);
          setOut_Date(response.data.data[0].OUT_DATE);
          setWAHS_CD(response.data.data[0].WAHS_CD);
          setLOC_CD(response.data.data[0].LOC_CD);
          let IN_DATE: string = response.data.data[0].IN_DATE;
          let USE_YN: string = response.data.data[0].USE_YN;
          let M_CODE: string = response.data.data[0].M_CODE;
          let M_NAME: string = response.data.data[0].M_NAME;
          let WIDTH_CD: number = response.data.data[0].WIDTH_CD;
          let IN_CFM_QTY: number = USE_YN !== 'R' ? response.data.data[0].IN_CFM_QTY : response.data.data[0].RETURN_QTY;
          let ROLL_QTY: number = response.data.data[0].ROLL_QTY;
          let LIEUQL_SX: number = response.data.data[0].LIEUQL_SX;
          let WAHS_CD: string = response.data.data[0].WAHS_CD;
          let LOC_CD: string = response.data.data[0].LOC_CD;
          let lot_info: DKXL_DATA = dangkyxuatlieutable.filter((ele: DKXL_DATA, index: number) => {
            return ele.M_CODE === M_CODE;
          })[0] ?? "NG";
          console.log(lot_info);
          let OUT_DATE: string = lot_info.OUT_DATE ?? 'NG';
          let OUT_NO: string = lot_info.OUT_NO ?? "NG";
          let OUT_SEQ: string = lot_info.OUT_SEQ ?? "NG";
          let temp_row: WH_M_OUTPUT_DATA = {
            id: moment().format("YYYYMMDD_HHmmsss" + prepareOutData.length),
            M_CODE: M_CODE,
            M_NAME: M_NAME,
            WIDTH_CD: WIDTH_CD,
            M_LOT_NO: M_LOT_NO,
            ROLL_QTY: ROLL_QTY,
            UNIT_QTY: IN_CFM_QTY,
            TOTAL_QTY: ROLL_QTY * IN_CFM_QTY,
            WAHS_CD: WAHS_CD,
            LOC_CD: LOC_CD,
            LIEUQL_SX: LIEUQL_SX,
            OUT_DATE: OUT_DATE,
            OUT_NO: OUT_NO,
            OUT_SEQ: OUT_SEQ,
            IN_DATE: IN_DATE,
            USE_YN: USE_YN
          }
          let checkExist_lot: boolean = prepareOutData.filter((ele: WH_M_OUTPUT_DATA, index: number) => {
            return ele.M_LOT_NO === M_LOT_NO;
          }).length > 0;
          if (!checkExist_lot && OUT_DATE !== 'NG' && USE_YN !== 'X') {
            setPrepareOutData([...prepareOutData, temp_row]);
          }
          else if (OUT_DATE === 'NG') {
            Swal.fire("Thông báo", "Lot này là Liệu chưa đăng ký xuất kho", "warning");
          }
          else if (USE_YN === 'X') {
            Swal.fire("Thông báo", "Lot này đã sử dụng rồi", "warning");
          }
          else {
            Swal.fire("Thông báo", "Lot này bắn rồi", "warning");
          }
          setM_LOT_NO("");
        } else {
          setM_Name("");
          setM_Code("");
          setWidthCD(0);
          setRollQty(0);
          setInCFMQTY(0);
          setLieuQL_SX(0);
          setOut_Date("");
          setWAHS_CD("");
          setLOC_CD("");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleConfirmXuatKho = () => {
    Swal.fire({
      title: "Nhập liệu vào kho",
      text: "Chắc chắn muốn nhập kho các liệu đã nhập ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn Nhập!",
    }).then((result) => {
      if (result.isConfirmed) {
        xuatkho();
      }
    });
  };
  const [dangkyxuatlieutable, setDangKyXuatLieuTable] = useState<DKXL_DATA[]>([]);
  const loadDKXLTB = async (PLAN_ID: string) => {
    await generalQuery("checkPLANID_O301", { PLAN_ID: PLAN_ID })
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
          setDangKyXuatLieuTable(response.data.data);
        } else {
          setDangKyXuatLieuTable([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const checkSoLanOutO302 = async (PLAN_ID: string) => {
    await generalQuery("checksolanout_O302", { PLAN_ID: PLAN_ID })
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
          setSoLanOut((response.data.data[0].SOLANOUT ?? 0) + 1);
        } else {
          setSoLanOut(1);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
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
            dataSource={prepareOutData}
            columnWidth="auto"
            keyExpr="id"
            height={"80vh"}
            showBorders={true}
            onSelectionChanged={(e) => {
              //setSelectedRows(e.selectedRowsData[0]);
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
            <Selection mode="multiple" selectAllMode="allPages" />
            <Editing
              allowUpdating={true}
              allowAdding={false}
              allowDeleting={true}
              mode="cell"
              confirmDelete={true}
              onChangesChange={(e) => { }}
            />
            <Export enabled={true} />
            <Toolbar disabled={false}>
              <Item location="before">
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    SaveExcel(datasxtable, "MaterialStatus");
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
              <Item name="saveButton" />
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
            <Column dataField="M_CODE" caption="M_CODE" width={90} allowEditing={false} ></Column>
            <Column dataField="M_NAME" caption="M_NAME" width={90} allowEditing={false} ></Column>
            <Column dataField="WIDTH_CD" caption="WIDTH_CD" width={90} allowEditing={false} ></Column>
            <Column dataField="M_LOT_NO" caption="M_LOT_NO" width={90} allowEditing={false} ></Column>
            <Column dataField="ROLL_QTY" caption="ROLL_QTY" width={90} allowEditing={false} ></Column>
            <Column dataField="UNIT_QTY" caption="UNIT_QTY" width={90} allowEditing={false} ></Column>
            <Column dataField="TOTAL_QTY" caption="TOTAL_QTY" width={90} allowEditing={false} ></Column>
            <Column dataField="LIEUQL_SX" caption="LIEUQL_SX" width={90} allowEditing={false} ></Column>
            <Column dataField="WAHS_CD" caption="WAHS_CD" width={90} allowEditing={false} ></Column>
            <Column dataField="LOC_CD" caption="LOC_CD" width={90} allowEditing={false} ></Column>
            <Column dataField="OUT_DATE" caption="OUT_DATE" width={90} allowEditing={false} ></Column>
            <Column dataField="OUT_NO" caption="OUT_NO" width={90} allowEditing={false} ></Column>
            <Column dataField="OUT_SEQ" caption="OUT_SEQ" width={90} allowEditing={false} ></Column>
            <Column dataField="IN_DATE" caption="IN_DATE" width={90} allowEditing={false} ></Column>
            <Column dataField="USE_YN" caption="USE_YN" width={90} allowEditing={false} ></Column>
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
    [prepareOutData],
  );
  const dkxlDataTable = React.useMemo(
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
            dataSource={dangkyxuatlieutable}
            columnWidth="auto"
            keyExpr="M_CODE"
            height={"65vh"}
            showBorders={true}
            onSelectionChanged={(e) => {
              //setSelectedRows(e.selectedRowsData[0]);
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
            <Editing
              allowUpdating={true}
              allowAdding={false}
              allowDeleting={false}
              mode="cell"
              confirmDelete={true}
              onChangesChange={(e) => { }}
            />
            <Paging defaultPageSize={15} />
            <Pager
              showPageSizeSelector={true}
              allowedPageSizes={[5, 10, 15, 20, 100, 1000, 10000, "all"]}
              showNavigationButtons={true}
              showInfo={true}
              infoText="Page #{0}. Total: {1} ({2} items)"
              displayMode="compact"
            />
            <Column dataField="M_CODE" caption="M_CODE" width={60} allowEditing={false} ></Column>
            <Column dataField="M_NAME" caption="M_NAME" width={70} allowEditing={false} ></Column>
            <Column dataField="WIDTH_CD" caption="SIZE" width={50} allowEditing={false} ></Column>
            <Column dataField="OUT_PRE_QTY" caption="DKY" width={50} allowEditing={false} ></Column>
            <Column dataField="OUT_CFM_QTY" caption="OUT" width={50} allowEditing={false} ></Column>
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
    [dangkyxuatlieutable],
  );
  const [customerList, setCustomerList] = useState<CustomerListData[]>([]);
  const filterOptions1 = createFilterOptions({
    matchFrom: "any",
    limit: 100,
  });
  const getcustomerlist = () => {
    generalQuery("selectCustomerAndVendorList", {})
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          setCustomerList(response.data.data);
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
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
  const getmateriallist = () => {
    generalQuery("getMaterialList", {})
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          ////console.log(response.data.data);
          setMaterialList(response.data.data);
        } else {
        }
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  useEffect(() => {
    getcustomerlist();
    getmateriallist();
  }, []);
  return (
    <div className="xuatlieu">
      <div className="tracuuDataInspection">
        <div className="tracuuDataInspectionform">
          <div className="forminput">
            <div className="forminputcolumn">
              <label style={{ display: "flex", alignItems: "center" }}>
                <b>Vendor:</b>
                <Autocomplete
                  sx={{
                    height: 10,
                    width: "160px",
                    margin: "1px",
                    fontSize: "0.7rem",
                    marginBottom: "20px",
                    backgroundColor: "white",
                  }}
                  size="small"
                  disablePortal
                  options={customerList}
                  className="autocomplete"
                  filterOptions={filterOptions1}
                  isOptionEqualToValue={(option: any, value: any) =>
                    option.CUST_CD === value.CUST_CD
                  }
                  getOptionLabel={(option: any) =>
                    `${option.CUST_CD !== null ? option.CUST_NAME_KD : ""}${option.CUST_CD !== null ? option.CUST_CD : ""
                    }`
                  }
                  renderInput={(params) => (
                    <TextField {...params} style={{ height: "10px" }} />
                  )}
                  renderOption={(props, option: any) => <Typography style={{ fontSize: '0.7rem' }} {...props}>
                    {`${option.CUST_CD !== null ? option.CUST_NAME_KD : ""}${option.CUST_CD !== null ? option.CUST_CD : ""}`}
                  </Typography>}
                  defaultValue={{
                    CUST_CD: getCompany() === "CMS" ? "0000" : "KH000",
                    CUST_NAME: getCompany() === "CMS" ? "SEOJIN" : "PVN",
                    CUST_NAME_KD: getCompany() === "CMS" ? "SEOJIN" : "PVN",
                  }}
                  value={{
                    CUST_CD: selectedCustomer?.CUST_CD,
                    CUST_NAME: selectedCustomer?.CUST_NAME,
                    CUST_NAME_KD: selectedCustomer?.CUST_NAME_KD
                  }}
                  onChange={(event: any, newValue: any) => {
                    console.log(newValue);
                    setSelectedCustomer(newValue);
                  }}
                />
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Factory:</b>
                <select
                  name='factory'
                  value={selectedFactory}
                  onChange={(e) => {
                    setSelectedFactory(e.target.value);
                  }}
                >
                  <option value='NM1'>NM1</option>
                  <option value='NM2'>NM2</option>
                </select>
              </label>
              <label>
                <b>Ngày xuất kho:</b>
                <input
                  type="date"
                  value={fromdate.slice(0, 10)}
                  onChange={(e) => setFromDate(e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Ng.Giao:</b>
                <input
                  type="text"
                  placeholder={"NHU1903"}
                  value={giao_empl}
                  onChange={(e) => {
                    if (e.target.value.length >= 7) {
                      checkEMPL_NAME(1, e.target.value);
                    }
                    setGiao_Empl(e.target.value);
                  }}
                ></input>
              </label>
              {giao_empl_name && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: "bold",
                    color: "blue",
                  }}
                >
                  {giao_empl_name}
                </span>
              )}
              <label>
                <b>Ng.Nhận:</b>
                <input
                  type="text"
                  placeholder={"NHU1903"}
                  value={nhan_empl}
                  onChange={(e) => {
                    if (e.target.value.length >= 7) {
                      checkEMPL_NAME(2, e.target.value);
                    }
                    setNhan_Empl(e.target.value);
                  }}
                ></input>
              </label>
              {nhan_empl && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: "bold",
                    color: "blue",
                  }}
                >
                  {nhan_empl_name}
                </span>
              )}
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Số chỉ thị:</b>{" "}
                <input
                  type="text"
                  placeholder="Số chỉ thị"
                  value={planId}
                  onChange={(e) => {
                    setPlanId(e.target.value)
                    if (e.target.value.length >= 7) {
                      checkPlanID(e.target.value);
                      checkSoLanOutO302(e.target.value);
                      loadDKXLTB(e.target.value);
                    }
                  }}
                ></input>
              </label>
              {g_name && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: "bold",
                    color: "blue",
                  }}
                >
                  {g_name}
                </span>
              )}
              <label>
                <b>LOT Vật liệu:</b>{" "}
                <input
                  type="text"
                  placeholder="Lot vật liệu"
                  value={m_lot_no}
                  onChange={(e) => {
                    setM_LOT_NO(e.target.value)
                    if (e.target.value.length >= 10) {
                      checkLotNVL(e.target.value, planId);
                    }
                  }}
                ></input>
              </label>
              {m_name && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: "bold",
                    color: "blue",
                  }}
                >
                  {m_name}
                </span>
              )}
            </div>
          </div>
          <div className="formbutton">
            <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#f05bd7' }} onClick={() => {
              addMaterial();
            }}>Add</Button>
            <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#ec9d52' }} onClick={() => {
              handleConfirmXuatKho();
            }}>Xuất kho</Button>
          </div>
          <div className="dkxlTable">{dkxlDataTable}</div>
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
export default XUATLIEU;

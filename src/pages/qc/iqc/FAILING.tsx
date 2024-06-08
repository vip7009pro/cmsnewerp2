import {
  Autocomplete,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import moment from "moment";
import React, {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { AiFillFileExcel, AiOutlineSearch } from "react-icons/ai";
import Swal from "sweetalert2";
import { generalQuery } from "../../../api/Api";
import { UserContext } from "../../../api/Context";
import { SaveExcel } from "../../../api/GlobalFunction";
import "./FAILING.scss";
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
import { BiShow } from "react-icons/bi";
import { GrStatusGood } from "react-icons/gr";
import { FcCancel } from "react-icons/fc";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  CustomerListData,
  QC_FAIL_DATA,
  UserData,
} from "../../../api/GlobalInterface";
import AGTable from "../../../components/DataTable/AGTable";
const FAILING = () => {
  const [cmsvcheck, setCMSVCheck] = useState(true);
  const [customerList, setCustomerList] = useState<CustomerListData[]>([]);
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData,
  );
  const [testtype, setTestType] = useState("NVL");
  const [inputno, setInputNo] = useState("");
  const [request_empl, setrequest_empl] = useState("");
  const [request_empl2, setrequest_empl2] = useState("");
  const [remark, setReMark] = useState("");
  const [inspectiondatatable, setInspectionDataTable] = useState<Array<any>>([]);
  const selectedRowsDataA = useRef<Array<QC_FAIL_DATA>>([]);
  const [empl_name, setEmplName] = useState("");
  const [empl_name2, setEmplName2] = useState("");
  const [g_name, setGName] = useState("");
  const [g_code, setGCode] = useState("");
  const [m_name, setM_Name] = useState("");
  const [width_cd, setWidthCD] = useState(0);
  const [in_cfm_qty, setInCFMQTY] = useState(0);
  const [roll_qty, setRollQty] = useState(0);
  const [m_code, setM_Code] = useState("");
  const [prodrequestno, setProdRequestNo] = useState("");
  const [planId, setPlanId] = useState("");
  const [pqc3Id, setPQC3ID] = useState(0);
  const [defect_phenomenon, setDefectPhenomenon] = useState("");
  const [prodreqdate, setProdReqDate] = useState("");
  const [vendorLot, setVendorLot] = useState("");
  const [lieql_sx, setLieuQL_SX] = useState(0);
  const [out_date, setOut_Date] = useState("");
  const [cust_cd, setCust_Cd] = useState("6969");
  const column_failing_table=[
    { field: 'FAIL_ID',headerName: 'FAIL_ID', resizable: true,width: 80 },
    { field: 'FACTORY',headerName: 'FACTORY', resizable: true,width: 80 },
    { field: 'PLAN_ID_SUDUNG',headerName: 'PLAN_ID_SUDUNG', resizable: true,width: 80 },
    { field: 'G_NAME',headerName: 'G_NAME', resizable: true,width: 80 },
    { field: 'LIEUQL_SX',headerName: 'LIEUQL_SX', resizable: true,width: 80 },
    { field: 'M_CODE',headerName: 'M_CODE', resizable: true,width: 80 },
    { field: 'M_LOT_NO',headerName: 'M_LOT_NO', resizable: true,width: 80 },
    { field: 'VENDOR_LOT',headerName: 'VENDOR_LOT', resizable: true,width: 80 },
    { field: 'M_NAME',headerName: 'M_NAME', resizable: true,width: 80 },
    { field: 'WIDTH_CD',headerName: 'WIDTH_CD', resizable: true,width: 80 },
    { field: 'ROLL_QTY',headerName: 'ROLL_QTY', resizable: true,width: 80 },
    { field: 'TOTAL_IN_QTY',headerName: 'TOTAL_IN_QTY', resizable: true,width: 80 },
    { field: 'USE_YN',headerName: 'USE_YN', resizable: true,width: 80 },
    { field: 'PQC3_ID',headerName: 'PQC3_ID', resizable: true,width: 80 },
    { field: 'DEFECT_PHENOMENON',headerName: 'DEFECT_PHENOMENON', resizable: true,width: 80 },
    { field: 'OUT_DATE',headerName: 'OUT_DATE', resizable: true,width: 80 },
    { field: 'INS_EMPL',headerName: 'INS_EMPL', resizable: true,width: 80 },
    { field: 'INS_DATE',headerName: 'INS_DATE', resizable: true,width: 80 },
    { field: 'UPD_EMPL',headerName: 'UPD_EMPL', resizable: true,width: 80 },
    { field: 'UPD_DATE',headerName: 'UPD_DATE', resizable: true,width: 80 },
    { field: 'PHANLOAI',headerName: 'PHANLOAI', resizable: true,width: 80 },
    { field: 'QC_PASS',headerName: 'QC_PASS', resizable: true,width: 80 },
    { field: 'QC_PASS_DATE',headerName: 'QC_PASS_DATE', resizable: true,width: 80 },
    { field: 'QC_PASS_EMPL',headerName: 'QC_PASS_EMPL', resizable: true,width: 80 },
    { field: 'REMARK',headerName: 'REMARK', resizable: true,width: 80 },
    { field: 'IN1_EMPL',headerName: 'IN1_EMPL', resizable: true,width: 80 },
    { field: 'IN2_EMPL',headerName: 'IN2_EMPL', resizable: true,width: 80 },
    { field: 'OUT1_EMPL',headerName: 'OUT1_EMPL', resizable: true,width: 80 },
    { field: 'OUT2_EMPL',headerName: 'OUT2_EMPL', resizable: true,width: 80 },
    { field: 'IN_CUST_CD',headerName: 'IN_CUST_CD', resizable: true,width: 80 },
    { field: 'OUT_CUST_CD',headerName: 'OUT_CUST_CD', resizable: true,width: 80 },
    { field: 'IN_CUST_NAME',headerName: 'IN_CUST_NAME', resizable: true,width: 80 },
    { field: 'OUT_CUST_NAME',headerName: 'OUT_CUST_NAME', resizable: true,width: 80 },
    { field: 'OUT_PLAN_ID',headerName: 'OUT_PLAN_ID', resizable: true,width: 80 },
    { field: 'REMARK_OUT',headerName: 'REMARK_OUT', resizable: true,width: 80 },
   
  ];
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // console.log('press enter')
      e.preventDefault();
      if (checkInput()) {
        let lotArray = inspectiondatatable.map(
          (element: QC_FAIL_DATA, index: number) => {
            return element.M_LOT_NO;
          },
        );
        if (pqc3Id !== 0) {
          if (lotArray.indexOf(inputno) < 0) {
            addRow();
          } else {
            Swal.fire(
              "Thông tin",
              "Đã thêm cuộn này rồi",
              "error",
            );
          }
        } else {
          Swal.fire(
            "Thông tin",
            "Số chỉ thị này PQC chưa lập lỗi, không thêm được",
            "error",
          );
        }
      } else {
        Swal.fire(
          "Thông báo",
          "Hãy nhập đủ thông tin trước khi đăng ký",
          "error",
        );
      }
    }
  };
  const setQCPASS = async (value: string) => {
    console.log(selectedRowsDataA.current);
    if (selectedRowsDataA.current.length > 0) {
      Swal.fire({
        title: "Tra cứu vật liệu Holding",
        text: "Đang tải dữ liệu, hãy chờ chút",
        icon: "info",
        showCancelButton: false,
        allowOutsideClick: false,
        confirmButtonText: "OK",
        showConfirmButton: false,
      });
      let err_code: string = "";
      for (let i = 0; i < selectedRowsDataA.current.length; i++) {
        await generalQuery("updateQCPASS_FAILING", {
          M_LOT_NO: selectedRowsDataA.current[i].M_LOT_NO,
          PLAN_ID_SUDUNG: selectedRowsDataA.current[i].PLAN_ID_SUDUNG,
          VALUE: value,
        })
          // eslint-disable-next-line no-loop-func
          .then((response) => {
            //console.log(response.data.data);
            if (response.data.tk_status !== "NG") {
            } else {
              err_code += ` Lỗi: ${response.data.message}`;
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
      if (err_code === "") {
        Swal.fire("Thông báo", "SET thành công", "success");
      } else {
        Swal.fire("Thông báo", "Lỗi: " + err_code, "error");
      }
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 dòng để thực hiện", "error");
    }
  };
  const materialDataTable = React.useMemo(
    () => (
      <div className="datatb">
        <div className="menubar">
          <span style={{ fontSize: '1rem', fontWeight: "bold" }}>
            BẢNG NHẬP THÔNG TIN CUỘN LIỆU- BTP QC FAIL
          </span>
        </div>
        <DataGrid
          style={{ fontSize: "0.7rem" }}
          autoNavigateToFocusedRow={true}
          allowColumnReordering={true}
          allowColumnResizing={true}
          columnAutoWidth={false}
          cellHintEnabled={true}
          columnResizingMode={"widget"}
          showColumnLines={true}
          dataSource={inspectiondatatable}
          columnWidth="auto"
          keyExpr="id"
          height={"79vh"}
          showBorders={true}
          onSelectionChanged={(e) => {
            //setSelectedRowsData(e.selectedRowsData);
          }}
          onRowClick={(e) => {
            //console.log(e.data);
          }}
          onRowUpdated={(e) => {
            //console.log(e);
          }}
        >
          <Scrolling
            useNative={false}
            scrollByContent={true}
            scrollByThumb={true}
            showScrollbar="onHover"
            mode="virtual"
          />
          <Selection mode="multiple" selectAllMode="allPages" />
          <Editing
            allowUpdating={true}
            allowAdding={false}
            allowDeleting={false}
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
                  SaveExcel(inspectiondatatable, "SPEC DTC");
                }}
              >
                <AiFillFileExcel color="green" size={15} />
                SAVE
              </IconButton>
            </Item>
            <Item name="searchPanel" />
            <Item name="exportButton" />
            <Item name="columnChooserButton" />
            <Item name="addRowButton" />
            <Item name="saveButton" />
            <Item name="revertButton" />
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
            dataField="FAIL_ID"
            caption="FAIL_ID"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="FACTORY"
            caption="FACTORY"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="PLAN_ID_SUDUNG"
            caption="PLAN_ID_SUDUNG"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="G_NAME"
            caption="G_NAME"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="LIEUQL_SX"
            caption="LIEUQL_SX"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="M_CODE"
            caption="M_CODE"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="M_LOT_NO"
            caption="M_LOT_NO"
            width={100}
            allowEditing={true}
          ></Column>
          <Column
            dataField="VENDOR_LOT"
            caption="VENDOR_LOT"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="M_NAME"
            caption="M_NAME"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="WIDTH_CD"
            caption="WIDTH_CD"
            width={100}
            allowEditing={false}
          ></Column>
          <Column dataField="ROLL_QTY" caption="ROLL_QTY" width={100}></Column>
          <Column dataField="IN_QTY" caption="IN_QTY" width={100}></Column>
          <Column
            dataField="TOTAL_IN_QTY"
            caption="TOTAL_IN_QTY"
            width={100}
          ></Column>
          <Column
            dataField="USE_YN"
            caption="USE_YN"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="PQC3_ID"
            caption="PQC3_ID"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="DEFECT_PHENOMENON"
            caption="DEFECT_PHENOMENON"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="OUT_DATE"
            caption="OUT_DATE"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="INS_EMPL"
            caption="INS_EMPL"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="INS_DATE"
            caption="INS_DATE"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="UPD_EMPL"
            caption="UPD_EMPL"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="UPD_DATE"
            caption="UPD_DATE"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="PHANLOAI"
            caption="PHANLOAI"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="QC_PASS"
            caption="QC_PASS"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="QC_PASS_DATE"
            caption="QC_PASS_DATE"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="QC_PASS_EMPL"
            caption="QC_PASS_EMPL"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="REMARK"
            caption="REMARK"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="IN1_EMPL"
            caption="IN1_EMPL"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="IN2_EMPL"
            caption="IN2_EMPL"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="OUT1_EMPL"
            caption="OUT1_EMPL"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="OUT2_EMPL"
            caption="OUT2_EMPL"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="IN_CUST_CD"
            caption="IN_CUST_CD"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="OUT_CUST_CD"
            caption="OUT_CUST_CD"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="IN_CUST_NAME"
            caption="IN_CUST_NAME"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="OUT_CUST_NAME"
            caption="OUT_CUST_NAME"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="OUT_PLAN_ID"
            caption="OUT_PLAN_ID"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="REMARK_OUT"
            caption="REMARK_OUT"
            width={100}
            allowEditing={false}
          ></Column>
          <Summary>
            <TotalItem
              alignment="right"
              column="M_CODE"
              summaryType="count"
              valueFormat={"decimal"}
            />
            <TotalItem
              alignment="right"
              column="ROLL_QTY"
              summaryType="sum"
              valueFormat={"decimal"}
            />
            <TotalItem
              alignment="right"
              column="IN_QTY"
              summaryType="sum"
              valueFormat={"decimal"}
            />
            <TotalItem
              alignment="right"
              column="TOTAL_IN_QTY"
              summaryType="sum"
              valueFormat={"decimal"}
            />
          </Summary>
        </DataGrid>
      </div>
    ),
    [inspectiondatatable],
  );
  const failingDataAGTable = useMemo(() => {
    return (
      <AGTable
        toolbar={
          <div>
            
          </div>}
        columns={column_failing_table}
        data={inspectiondatatable}
        onCellEditingStopped={(e) => {
          //console.log(e.data)
        }} onRowClick={(e) => {
          //console.log(e.data)
          
        }} onSelectionChange={(e) => {
          //console.log(e!.api.getSelectedRows())
          selectedRowsDataA.current = e!.api.getSelectedRows();             
        }}
      />
    )
  }, [inspectiondatatable]);
  const handletraFailingData = () => {
    generalQuery("loadQCFailData", {})
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: QC_FAIL_DATA[] = response.data.data.map(
            (element: QC_FAIL_DATA, index: number) => {
              return {
                ...element,
                INS_DATE:
                  element.INS_DATE === null
                    ? ""
                    : moment(element.INS_DATE)
                      .utc()
                      .format("YYYY-MM-DD HH:mm:ss"),
                UPD_DATE:
                  element.UPD_DATE === null
                    ? ""
                    : moment(element.UPD_DATE)
                      .utc()
                      .format("YYYY-MM-DD HH:mm:ss"),
                QC_PASS_DATE:
                  element.QC_PASS_DATE === null
                    ? ""
                    : moment(element.QC_PASS_DATE)
                      .utc()
                      .format("YYYY-MM-DD HH:mm:ss"),
                id: index,
              };
            },
          );
          setInspectionDataTable(loadeddata);
          Swal.fire(
            "Thông báo",
            "Đã load :" + loadeddata.length + " dòng",
            "success",
          );
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const checkEMPL_NAME = (selection: number, EMPL_NO: string) => {
    generalQuery("checkEMPL_NO_mobile", { EMPL_NO: EMPL_NO })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);\
          if (selection === 1) {
            setEmplName(
              response.data.data[0].MIDLAST_NAME +
              " " +
              response.data.data[0].FIRST_NAME,
            );
          } else {
            setEmplName2(
              response.data.data[0].MIDLAST_NAME +
              " " +
              response.data.data[0].FIRST_NAME,
            );
          }
        } else {
          setEmplName("");
          setEmplName2("");
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
          setProdReqDate(response.data.data[0].PROD_REQUEST_DATE);
          setGCode(response.data.data[0].G_CODE);
        } else {
          setProdRequestNo("");
          setGName("");
          setProdReqDate("");
          setGCode("");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const checkPQC3_ID = (PLAN_ID: string) => {
    generalQuery("checkPQC3_IDfromPLAN_ID", { PLAN_ID: PLAN_ID })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);
          setPQC3ID(response.data.data[0].PQC3_ID);
          setDefectPhenomenon(response.data.data[0].DEFECT_PHENOMENON);
        } else {
          setPQC3ID(0);
          setDefectPhenomenon("");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const checkLotNVL = (M_LOT_NO: string) => {
    generalQuery("checkMNAMEfromLot", { M_LOT_NO: M_LOT_NO })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          console.log(response.data.data);
          setM_Name(
            response.data.data[0].M_NAME +
            " | " +
            response.data.data[0].WIDTH_CD,
          );
          setM_Code(response.data.data[0].M_CODE);
          setWidthCD(response.data.data[0].WIDTH_CD);
          setInCFMQTY(response.data.data[0].OUT_CFM_QTY);
          setRollQty(response.data.data[0].ROLL_QTY);
          setVendorLot(response.data.data[0].LOTNCC?? "");
          setPlanId(response.data.data[0].PLAN_ID?? "");

          if((response.data.data[0].PLAN_ID ?? "").length>7) {
            checkPlanID(response.data.data[0].PLAN_ID);
            checkPQC3_ID(response.data.data[0].PLAN_ID);
          }
          setLieuQL_SX(
            response.data.data[0].LIEUQL_SX === null
              ? "0"
              : response.data.data[0].LIEUQL_SX,
          );
          setOut_Date(response.data.data[0].OUT_DATE);
        } else {
          setM_Name("");
          setM_Code("");
          setWidthCD(0);
          setRollQty(0);
          setInCFMQTY(0);
          setLieuQL_SX(0);
          setOut_Date("");
          setVendorLot("");
          setPlanId("");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const checkInput = (): boolean => {
    if (
      inputno !== "" &&
      planId !== "" &&      
      request_empl !== ""
    ) {
      return true;
    } else {
      return false;
    }
  };
  const addRow = async () => {
    let temp_row: QC_FAIL_DATA = {
      id: inspectiondatatable.length,
      FACTORY: userData?.FACTORY_CODE === 1 ? "NM1" : "NM2",
      PLAN_ID_SUDUNG: planId,
      G_NAME: g_name,
      LIEUQL_SX: lieql_sx,
      M_CODE: m_code,
      M_LOT_NO: inputno,
      VENDOR_LOT: vendorLot,
      M_NAME: m_name,
      WIDTH_CD: width_cd,
      ROLL_QTY: roll_qty,
      IN_QTY: in_cfm_qty,
      TOTAL_IN_QTY: roll_qty * in_cfm_qty,
      USE_YN: "Y",
      PQC3_ID: pqc3Id,
      DEFECT_PHENOMENON: defect_phenomenon,
      OUT_DATE: out_date,
      INS_EMPL: userData?.EMPL_NO,
      INS_DATE: moment().format("YYYY-MM-DD HH:mm:ss"),
      UPD_EMPL: "",
      UPD_DATE: "",
      PHANLOAI: testtype,
      QC_PASS: "N",
      QC_PASS_DATE: "",
      QC_PASS_EMPL: "",
      REMARK: remark,
      IN1_EMPL: request_empl,
      IN2_EMPL: request_empl2,
      OUT1_EMPL: "",
      OUT2_EMPL: "",
      OUT_PLAN_ID: "",
      IN_CUST_CD: "",
      OUT_CUST_CD: "",
      IN_CUST_NAME: "",
      OUT_CUST_NAME: "",
      REMARK_OUT: "",
      FAIL_ID: 0,
    };
    setInspectionDataTable((prev) => {
      return [...prev, temp_row];
    });
    setInputNo("");
  };
  const saveFailingData = async () => {
    if (inspectiondatatable.length > 0) {
      let err_code: string = "";
      for (let i = 0; i < inspectiondatatable.length; i++) {
        await generalQuery("insertFailingData", {
          FACTORY: inspectiondatatable[i].FACTORY,
          PLAN_ID_SUDUNG: inspectiondatatable[i].PLAN_ID_SUDUNG,
          LIEUQL_SX: inspectiondatatable[i].LIEUQL_SX,
          M_CODE: inspectiondatatable[i].M_CODE,
          M_LOT_NO: inspectiondatatable[i].M_LOT_NO,
          VENDOR_LOT: inspectiondatatable[i].VENDOR_LOT,
          ROLL_QTY: inspectiondatatable[i].ROLL_QTY,
          IN_QTY: inspectiondatatable[i].IN_QTY,
          TOTAL_IN_QTY: inspectiondatatable[i].TOTAL_IN_QTY,
          USE_YN: inspectiondatatable[i].USE_YN,
          PQC3_ID: inspectiondatatable[i].PQC3_ID,
          OUT_DATE: inspectiondatatable[i].OUT_DATE,
          INS_EMPL: inspectiondatatable[i].INS_EMPL,
          INS_DATE: inspectiondatatable[i].INS_DATE,
          UPD_EMPL: inspectiondatatable[i].UPD_EMPL,
          UPD_DATE: inspectiondatatable[i].UPD_DATE,
          PHANLOAI: inspectiondatatable[i].PHANLOAI,
          QC_PASS: inspectiondatatable[i].QC_PASS,
          QC_PASS_DATE: inspectiondatatable[i].QC_PASS_DATE,
          QC_PASS_EMPL: inspectiondatatable[i].QC_PASS_EMPL,
          REMARK: inspectiondatatable[i].REMARK,
          IN1_EMPL: inspectiondatatable[i].IN1_EMPL,
          IN2_EMPL: inspectiondatatable[i].IN2_EMPL,
          OUT1_EMPL: inspectiondatatable[i].OUT1_EMPL,
          OUT2_EMPL: inspectiondatatable[i].OUT2_EMPL,
          OUT_PLAN_ID: inspectiondatatable[i].OUT_PLAN_ID,
          IN_CUST_CD: inspectiondatatable[i].IN_CUST_CD,
          OUT_CUST_CD: inspectiondatatable[i].OUT_CUST_CD,
        })
          // eslint-disable-next-line no-loop-func
          .then((response) => {
            if (response.data.tk_status !== "NG") {
              //console.log(response.data.data);
            } else {
              err_code += "Lỗi: " + response.data.message + "| ";
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
      if (err_code === "") {
        Swal.fire("Thông báo", "Thêm data thành công", "success");
      } else {
        Swal.fire("Thông báo", "Lỗi: " + err_code, "error");
      }
    } else {
    }
  };
  const getcustomerlist = () => {
    generalQuery("selectcustomerList", {})
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
  const updateQCFailTable = async () => {
    if (selectedRowsDataA.current.length > 0) {
      let err_code: string = "";
      for (let i = 0; i < selectedRowsDataA.current.length; i++) {
        await generalQuery("updateQCFailTableData", {
          OUT1_EMPL: request_empl,
          OUT2_EMPL: request_empl2,
          OUT_CUST_CD: cust_cd,
          OUT_PLAN_ID: planId,
          REMARK_OUT: remark,
          FAIL_ID: selectedRowsDataA.current[i].FAIL_ID,
        })
          // eslint-disable-next-line no-loop-func
          .then((response) => {
            if (response.data.tk_status !== "NG") {
            } else {
              err_code += ` Lỗi: ${response.data.message} | `;
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
      if (err_code === "") {
        Swal.fire("Thông báo", "Xuất thành công", "success");
      } else {
        Swal.fire("Thông báo", "Có lỗi: " + err_code, "error");
      }
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 dòng để thực hiện", "error");
    }
  };
  useEffect(() => {
    getcustomerlist();
    ///handletraFailingData();
  }, []);
  return (
    <div className="failing">
      <div className="tracuuDataInspection">
        <div className="maintable">
          <div className="tracuuDataInspectionform">
            <div className="forminput">
              <div className="forminputcolumn">
                <label>
                  <b>Tên Nhà cung cấp:</b>
                  <select
                    disabled={cmsvcheck}
                    name="khachhang"
                    value={cust_cd}
                    onChange={(e) => {
                      setCust_Cd(e.target.value);
                    }}
                  >
                    {customerList.map((element, index) => (
                      <option key={index} value={element.CUST_CD}>
                        {element.CUST_NAME_KD}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <b>Phân loại hàng:</b>
                  <select
                    name="phanloaihang"
                    value={testtype}
                    onChange={(e) => {
                      setTestType(e.target.value);
                    }}
                  >
                    <option value="NVL">Vật Liệu</option>
                    <option value="BTP">Bán Thành Phẩm</option>
                  </select>
                </label>
              </div>
              <div className="forminputcolumn">
                <label>
                  <b>Số chỉ thị sản xuất:</b>
                  <input
                    type="text"
                    placeholder="1F80008A"
                    value={planId}
                    onChange={(e) => {
                      if (e.target.value.length >= 7) {
                        checkPlanID(e.target.value);
                        checkPQC3_ID(e.target.value);
                      }
                      setPlanId(e.target.value);
                    }}
                  ></input>
                </label>
                {g_name && (
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: "bold",
                      color: "blue",
                    }}
                  >
                    {g_name}
                  </span>
                )}
                <label>
                  <b>LOT NVL CMS:</b>
                  <input
                    type="text"
                    placeholder="202304190123"
                    value={inputno}
                    onKeyDown={(e)=> {
                      handleKeyDown(e);
                    }}
                    onChange={(e) => {
                      //console.log(e.target.value.length);
                      if (e.target.value.length >= 7) {
                        //console.log(e.target.value);
                        checkLotNVL(e.target.value);
                      }
                      setInputNo(e.target.value);
                    }}
                  ></input>
                </label>
                {m_name && (
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: "bold",
                      color: "blue",
                    }}
                  >
                    {m_name}
                  </span>
                )}
              </div>
              <div className="forminputcolumn">
                <label>
                  <b>VENDOR LOT:</b>
                  <input
                    type="text"
                    placeholder={"54951949844984"}
                    value={vendorLot}
                    onChange={(e) => {
                      setVendorLot(e.target.value);
                    }}
                  ></input>
                </label>
                <label>
                  <b>Mã nhân viên giao:</b>
                  <input
                    type="text"
                    placeholder={"NVD1201"}
                    value={request_empl}
                    onChange={(e) => {
                      if (e.target.value.length >= 7) {
                        checkEMPL_NAME(1, e.target.value);
                      }
                      setrequest_empl(e.target.value);
                    }}
                  ></input>
                </label>
                {request_empl && (
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: "bold",
                      color: "blue",
                    }}
                  >
                    {empl_name}
                  </span>
                )}
              </div>
              <div className="forminputcolumn">
                <label>
                  <b>Mã nhân viên nhận:</b>
                  <input
                    type="text"
                    placeholder={"NVD1201"}
                    value={request_empl2}
                    onChange={(e) => {
                      if (e.target.value.length >= 7) {
                        checkEMPL_NAME(2, e.target.value);
                      }
                      setrequest_empl2(e.target.value);
                    }}
                  ></input>
                </label>
                {request_empl2 && (
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: "bold",
                      color: "blue",
                    }}
                  >
                    {empl_name2}
                  </span>
                )}
                <label>
                  <b>Remark:</b>
                  <input
                    type="text"
                    placeholder={"Ghi chú"}
                    value={remark}
                    onChange={(e) => {
                      setReMark(e.target.value);
                    }}
                  ></input>
                </label>
              </div>
             
              <div className="forminputcolumn">
                <label>
                  <b>CMSV</b>
                  <input
                    type="checkbox"
                    name="alltimecheckbox"
                    defaultChecked={cmsvcheck}
                    onChange={(e) => {
                      if (cmsvcheck === false) setCust_Cd("6969");
                      setCMSVCheck(!cmsvcheck);
                    }}
                  ></input>
                </label>
                <div className="btdiv" style={{display:'flex', gap: '10px'}}>
               
                </div>
                
              </div>
            </div>
            <div className="formbutton">
            <Button color={'success'} variant="contained" size="small" fullWidth={false} sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#01aa01', color: 'white' }} onClick={() => {
                  setInspectionDataTable([]);
                }}>New</Button>
                <Button color={'success'} variant="contained" size="small" fullWidth={false} sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#d7f724', color: 'black' }} onClick={() => {
                  handletraFailingData();
                }}>Tra Data</Button>
            <Button color={'success'} variant="contained" size="small" fullWidth={false} sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#403dda' }} onClick={() => {
                  if (checkInput()) {
                    let lotArray = inspectiondatatable.map(
                      (element: QC_FAIL_DATA, index: number) => {
                        return element.M_LOT_NO;
                      },
                    );
                    if (pqc3Id !== 0) {
                      if (lotArray.indexOf(inputno) < 0) {
                        addRow();
                      } else {
                        Swal.fire(
                          "Thông tin",
                          "Đã thêm cuộn này rồi",
                          "error",
                        );
                      }
                    } else {
                      Swal.fire(
                        "Thông tin",
                        "Số chỉ thị này PQC chưa lập lỗi, không thêm được",
                        "error",
                      );
                    }
                  } else {
                    Swal.fire(
                      "Thông báo",
                      "Hãy nhập đủ thông tin trước khi đăng ký",
                      "error",
                    );
                  }
                }}>Add</Button>
                <Button color={'success'} variant="contained" size="small" fullWidth={false} sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#f764ef' }} onClick={() => {
                  saveFailingData();
                }}>Save</Button>
                

            </div>
          </div>
          <div className="tracuuYCSXTable">
            {failingDataAGTable}
          </div>
          <div className="tracuuDataInspectionform2">
            <b style={{ color: "blue" }}>OUTPUT LIỆU QC FAIL</b>
            <div className="forminput">
              <div className="forminputcolumn">
                <label>
                  <b>Vendor:</b>
                  <select
                    disabled={cmsvcheck}
                    name="khachhang"
                    value={cust_cd}
                    onChange={(e) => {
                      setCust_Cd(e.target.value);
                    }}
                  >
                    {customerList.map((element, index) => (
                      <option key={index} value={element.CUST_CD}>
                        {element.CUST_NAME_KD}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <b>CMSV:</b>
                  <input
                    type="checkbox"
                    name="alltimecheckbox"
                    defaultChecked={cmsvcheck}
                    onChange={(e) => {
                      if (cmsvcheck === false) setCust_Cd("6969");
                      setCMSVCheck(!cmsvcheck);
                    }}
                  ></input>
                </label>
              </div>
              <div className="forminputcolumn">
                <label>
                  <b>Số CT:</b>
                  <input
                    type="text"
                    placeholder="1F80008A"
                    value={planId}
                    onChange={(e) => {
                      if (e.target.value.length >= 7) {
                        checkPlanID(e.target.value);
                      }
                      setPlanId(e.target.value);
                    }}
                  ></input>
                </label>
                {g_name && (
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: "bold",
                      color: "blue",
                    }}
                  >
                    {g_name}
                  </span>
                )}
              </div>
              <div className="forminputcolumn">
                <label>
                  <b>Ng.Giao:</b>
                  <input
                    type="text"
                    placeholder={"NVD1201"}
                    value={request_empl}
                    onChange={(e) => {
                      if (e.target.value.length >= 7) {
                        checkEMPL_NAME(1, e.target.value);
                      }
                      setrequest_empl(e.target.value);
                    }}
                  ></input>
                </label>
                {request_empl && (
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: "bold",
                      color: "blue",
                    }}
                  >
                    {empl_name}
                  </span>
                )}
                <label>
                  <b>Ng.Nhận:</b>
                  <input
                    type="text"
                    placeholder={"NVD1201"}
                    value={request_empl2}
                    onChange={(e) => {
                      if (e.target.value.length >= 7) {
                        checkEMPL_NAME(2, e.target.value);
                      }
                      setrequest_empl2(e.target.value);
                    }}
                  ></input>
                </label>
                {request_empl2 && (
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: "bold",
                      color: "blue",
                    }}
                  >
                    {empl_name2}
                  </span>
                )}
              </div>
              <div className="forminputcolumn">
                <label>
                  <b>Remark:</b>
                  <input
                    type="text"
                    placeholder={"Ghi chú"}
                    value={remark}
                    onChange={(e) => {
                      setReMark(e.target.value);
                    }}
                  ></input>
                </label>
              </div>
            </div>
            <div className="formbutton">
              <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#efff0c', color: 'black' }} onClick={() => {
                updateQCFailTable();
              }}>Xuất</Button>
            </div>
            <div className="formbutton">
              <IconButton
                className="buttonIcon"
                onClick={() => {
                  if (userData?.SUBDEPTNAME === "IQC") {
                    //console.log(selectedRowsDataA.current);
                    setQCPASS("Y");
                  } else {
                    Swal.fire(
                      "Thông báo",
                      "Bạn không phải người bộ phận IQC",
                      "error",
                    );
                  }
                }}
              >
                <GrStatusGood color="green" size={15} />
                SET PASS
              </IconButton>
              <IconButton
                className="buttonIcon"
                onClick={() => {
                  if (userData?.SUBDEPTNAME === "IQC") {
                    setQCPASS("N");
                  } else {
                    Swal.fire(
                      "Thông báo",
                      "Bạn không phải người bộ phận IQC",
                      "error",
                    );
                  }
                  //checkBP(userData?.EMPL_NO,userData?.MAINDEPTNAME,['QC'], ()=>{setQCPASS('Y');});
                  //checkBP(userData?.EMPL_NO,userData?.MAINDEPTNAME,['QLSX'], setQCPASS('N'));
                  //setQCPASS('N');
                }}
              >
                <FcCancel color="red" size={15} />
                RESET PASS
              </IconButton>
            </div>
            <div
              className="formbutton"
              style={{ marginTop: "20px", display: "flex", flexWrap: "wrap" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default FAILING;

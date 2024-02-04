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
  useRef,
  useState,
  useTransition,
} from "react";
import { AiFillFileExcel, AiOutlineSearch } from "react-icons/ai";
import Swal from "sweetalert2";
import { generalQuery } from "../../../api/Api";
import { UserContext } from "../../../api/Context";
import {
  CustomResponsiveContainer,
  SaveExcel,
} from "../../../api/GlobalFunction";
import "./PQC1.scss";
import DataGrid, {
  Column,
  ColumnChooser,
  Editing,
  Export,
  FilterRow,
  Item,
  KeyboardNavigation,
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
  PQC1_DATA,
  SX_DATA,
  UserData,
} from "../../../api/GlobalInterface";
const PQC1 = () => {
  const [customerList, setCustomerList] = useState<CustomerListData[]>([]);
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );
  const [testtype, setTestType] = useState("NVL");
  const [inputno, setInputNo] = useState("");
  const [lineqc_empl, setLineqc_empl] = useState("");
  const [prod_leader_empl, setprod_leader_empl] = useState("");
  const [remark, setReMark] = useState("");
  const [inspectiondatatable, setInspectionDataTable] = useState<Array<any>>(
    []
  );
  const [selectedRowsDataA, setSelectedRowsData] = useState<Array<PQC1_DATA>>(
    []
  );
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
  const [process_lot_no, setProcessLotNo] = useState("");
  const [vendorLot, setVendorLot] = useState("");
  const [lieql_sx, setLieuQL_SX] = useState(0);
  const [out_date, setOut_Date] = useState("");
  const [showhideinput, setShowHideInput] = useState(true);
  const [cust_cd, setCust_Cd] = useState("6969");
  const [factory, setFactory] = useState(
    userData?.FACTORY_CODE === 1 ? "NM1" : "NM2"
  );
  const [pqc1datatable, setPqc1DataTable] = useState<Array<PQC1_DATA>>([]);
  const [sx_data, setSXData] = useState<SX_DATA[]>([]);
  const [ktdtc, setKTDTC] = useState("CKT");
  const refArray = [useRef<any>(null), useRef<any>(null), useRef<any>(null), useRef<any>(null), useRef<any>(null)];
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Enter") {
      // console.log('press enter')
      e.preventDefault();
      const nextIndex = (index + 1) % refArray.length;
      refArray[nextIndex].current.focus();
    }
  };
  const checkKTDTC = (PROCESS_LOT_NO: string) => {
    generalQuery("checkktdtc", { PROCESS_LOT_NO: PROCESS_LOT_NO })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);
          if (response.data.data[0].TRANGTHAI !== null) {
            setKTDTC("DKT");
          } else {
            setKTDTC("CKT");
          }
        } else {
          setKTDTC("CKT");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const checkDataSX = (PLAN_ID: string) => {
    generalQuery("loadDataSX", {
      ALLTIME: true,
      FROM_DATE: "",
      TO_DATE: "",
      PROD_REQUEST_NO: "",
      PLAN_ID: PLAN_ID,
      M_NAME: "",
      M_CODE: "",
      G_NAME: "",
      G_CODE: "",
      FACTORY: "ALL",
      PLAN_EQ: "ALL",
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: SX_DATA[] = response.data.data.map(
            (element: SX_DATA, index: number) => {
              return {
                ...element,
                PLAN_DATE: moment.utc(element.PLAN_DATE).format("YYYY-MM-DD"),
                SETTING_START_TIME:
                  element.SETTING_START_TIME === null
                    ? ""
                    : moment
                      .utc(element.SETTING_START_TIME)
                      .format("YYYY-MM-DD HH:mm:ss"),
                MASS_START_TIME:
                  element.MASS_START_TIME === null
                    ? ""
                    : moment
                      .utc(element.MASS_START_TIME)
                      .format("YYYY-MM-DD HH:mm:ss"),
                MASS_END_TIME:
                  element.MASS_END_TIME === null
                    ? ""
                    : moment
                      .utc(element.MASS_END_TIME)
                      .format("YYYY-MM-DD HH:mm:ss"),
                SX_DATE:
                  element.SX_DATE === null
                    ? ""
                    : moment.utc(element.SX_DATE).format("YYYY-MM-DD"),
                id: index,
              };
            }
          );
          //console.log(loaded_data);
          setSXData(loaded_data);
          checkPlanIDP501(loaded_data);
        } else {
          Swal.fire("Thông báo", " Có lỗi : " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const pqc1DataTable = React.useMemo(
    () => (
      <div className="datatb">
        <div className="menubar">
          <IconButton
            className="buttonIcon"
            onClick={() => {
              setShowHideInput((pre) => !pre);
              setInspectionDataTable([]);
            }}
          >
            <BiShow color="blue" size={15} />
            Show/Hide Input
          </IconButton>
          <IconButton
            className="buttonIcon"
            onClick={() => {
              traPQC1Data();
              //setShowHideInput(false);
            }}
          >
            <AiOutlineSearch color="red" size={15} />
            Tra Data
          </IconButton>
        </div>
        <CustomResponsiveContainer>
          <DataGrid
            style={{ fontSize: "0.7rem" }}
            autoNavigateToFocusedRow={true}
            allowColumnReordering={true}
            allowColumnResizing={true}
            columnAutoWidth={false}
            cellHintEnabled={true}
            columnResizingMode={"widget"}
            showColumnLines={true}
            dataSource={pqc1datatable}
            columnWidth="auto"
            keyExpr="id"
            height={"100%"}
            showBorders={true}
            onSelectionChanged={(e) => {
              //console.log(e.selectedRowsData);
              //setselecterowfunction(e.selectedRowsData);
              setSelectedRowsData(e.selectedRowsData);
            }}
            onRowClick={(e) => {
              //console.log(e.data);
            }}
            onRowUpdated={(e) => {
              //console.log(e);
            }}
          >
            <KeyboardNavigation
              editOnKeyPress={true}
              enterKeyAction={"moveFocus"}
              enterKeyDirection={"column"}
            />
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
              allowAdding={true}
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
            <Column dataField='FACTORY' caption='FACTORY' allowEditing={false} width={50}></Column>
            <Column dataField='PQC1_ID' caption='PQC1_ID' allowEditing={false} width={60}></Column>
            <Column dataField='PLAN_ID' caption='PLAN_ID' allowEditing={false} width={70}></Column>
            <Column dataField='SETTING_OK_TIME' caption='SETTING_OK_TIME' allowEditing={false} width={130}></Column>
            <Column dataField='INSPECT_SAMPLE_QTY' caption='INSPECT_SAMPLE_QTY' allowEditing={true} width={150}></Column>
            <Column dataField='YEAR_WEEK' caption='YEAR_WEEK' allowEditing={false} width={100}></Column>
            <Column dataField='PROCESS_LOT_NO' caption='PROCESS_LOT_NO' allowEditing={false} width={100}></Column>
            <Column dataField='G_NAME' caption='G_NAME' allowEditing={false} width={100}></Column>
            <Column dataField='G_NAME_KD' caption='G_NAME_KD' allowEditing={false} width={100}></Column>
            <Column dataField='LINEQC_PIC' caption='LINEQC_PIC' allowEditing={false} width={100}></Column>
            <Column dataField='PROD_PIC' caption='PROD_PIC' allowEditing={false} width={100}></Column>
            <Column dataField='PROD_LEADER' caption='PROD_LEADER' allowEditing={false} width={100}></Column>
            <Column dataField='LINE_NO' caption='LINE_NO' allowEditing={false} width={100}></Column>
            <Column dataField='STEPS' caption='STEPS' allowEditing={false} width={70}></Column>
            <Column dataField='CAVITY' caption='CAVITY' allowEditing={false} width={60}></Column>
            <Column dataField='PROD_LAST_PRICE' caption='PROD_LAST_PRICE' allowEditing={false} width={100}></Column>
            <Column dataField='SAMPLE_AMOUNT' caption='SAMPLE_AMOUNT' allowEditing={false} width={100}></Column>
            <Column dataField='CNDB_ENCODES' caption='CNDB_ENCODES' allowEditing={false} width={100}></Column>
            <Column dataField='REMARK' caption='REMARK' allowEditing={false} width={100}></Column>
            <Column dataField='INS_DATE' caption='INS_DATE' allowEditing={false} width={100}></Column>
            <Column dataField='UPD_DATE' caption='UPD_DATE' allowEditing={false} width={100}></Column>
            <Column dataField='PQC3_ID' caption='PQC3_ID' allowEditing={false} width={100}></Column>
            <Column dataField='OCCURR_TIME' caption='OCCURR_TIME' allowEditing={false} width={100}></Column>
            <Column dataField='INSPECT_QTY' caption='INSPECT_QTY' allowEditing={false} width={100}></Column>
            <Column dataField='DEFECT_QTY' caption='DEFECT_QTY' allowEditing={false} width={100}></Column>
            <Column dataField='DEFECT_PHENOMENON' caption='DEFECT_PHENOMENON' allowEditing={false} width={100}></Column>
            <Column dataField='PROD_REQUEST_NO' caption='PROD_REQUEST_NO' allowEditing={false} width={100}></Column>
            <Column dataField='PROD_REQUEST_QTY' caption='PROD_REQUEST_QTY' allowEditing={false} width={100}></Column>
            <Column dataField='PROD_REQUEST_DATE' caption='PROD_REQUEST_DATE' allowEditing={false} width={100}></Column>
            <Summary>
              <TotalItem
                alignment="right"
                column="PQC1_ID"
                summaryType="count"
                valueFormat={"decimal"}
              />
            </Summary>
          </DataGrid>
        </CustomResponsiveContainer>
      </div>
    ),
    [pqc1datatable]
  );
  const traPQC1Data = () => {
    generalQuery("trapqc1data", {
      ALLTIME: false,
      FROM_DATE: moment().add(-2, "day").format("YYYY-MM-DD"),
      TO_DATE: moment().format("YYYY-MM-DD"),
      CUST_NAME: "",
      PROCESS_LOT_NO: "",
      G_CODE: "",
      G_NAME: "",
      PROD_TYPE: "",
      EMPL_NAME: "",
      PROD_REQUEST_NO: "",
      ID: "",
      FACTORY: userData?.FACTORY_CODE === 1 ? "NM1" : "NM2",
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: PQC1_DATA[] = response.data.data.map(
            (element: PQC1_DATA, index: number) => {
              //summaryInput += element.INPUT_QTY_EA;
              return {
                ...element,
                INS_DATE: moment
                  .utc(element.INS_DATE)
                  .format("YYYY-MM-DD HH:mm:ss"),
                UPD_DATE: moment
                  .utc(element.UPD_DATE)
                  .format("YYYY-MM-DD HH:mm:ss"),
                SETTING_OK_TIME: moment
                  .utc(element.SETTING_OK_TIME)
                  .format("YYYY-MM-DD HH:mm:ss"),
                id: index,
              };
            }
          );
          //setSummaryInspect('Tổng Nhập: ' +  summaryInput.toLocaleString('en-US') + 'EA');
          setPqc1DataTable(loadeddata);
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
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
              response.data.data[0].FIRST_NAME
            );
          } else {
            setEmplName2(
              response.data.data[0].MIDLAST_NAME +
              " " +
              response.data.data[0].FIRST_NAME
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
          setProdRequestNo(response.data.data[0].PROD_REQUEST_NO);
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
  const checkProcessLotNo = (PROCESS_LOT_NO: string) => {
    generalQuery("checkPROCESS_LOT_NO", { PROCESS_LOT_NO: PROCESS_LOT_NO })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);
          setPlanId(response.data.data[0].PLAN_ID);
          checkPlanID(response.data.data[0].PLAN_ID);
        } else {
          setPlanId("");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const checkPlanIDP501 = (SXDATA: SX_DATA[]) => {
    generalQuery("checkPlanIdP501", { PLAN_ID: SXDATA[0].PLAN_ID })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);
          setInputNo(response.data.data[0].M_LOT_NO);
          checkLotNVL(response.data.data[0].M_LOT_NO);
          setProcessLotNo(response.data.data[0].PROCESS_LOT_NO);
          checkKTDTC(response.data.data[0].PROCESS_LOT_NO);
        } else {
          if (SXDATA[0].PROCESS_NUMBER === 0) {
            setInputNo("");
            setProcessLotNo("");
          } else {
            generalQuery("checkProcessLotNo_Prod_Req_No", {
              PROD_REQUEST_NO: SXDATA[0].PROD_REQUEST_NO,
            })
              .then((response) => {
                if (response.data.tk_status !== "NG") {
                  //console.log(response.data.data);
                  setInputNo(response.data.data[0].M_LOT_NO);
                  checkLotNVL(response.data.data[0].M_LOT_NO);
                  setProcessLotNo(response.data.data[0].PROCESS_LOT_NO);
                  checkKTDTC(response.data.data[0].PROCESS_LOT_NO);
                } else {
                  setInputNo("");
                  setProcessLotNo("");
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
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
          //console.log(response.data.data);
          setM_Name(
            response.data.data[0].M_NAME +
            " | " +
            response.data.data[0].WIDTH_CD
          );
          setM_Code(response.data.data[0].M_CODE);
          setWidthCD(response.data.data[0].WIDTH_CD);
          setInCFMQTY(response.data.data[0].OUT_CFM_QTY);
          setRollQty(response.data.data[0].ROLL_QTY);
          setLieuQL_SX(
            response.data.data[0].LIEUQL_SX === null
              ? "0"
              : response.data.data[0].LIEUQL_SX
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
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const inputDataPqc1 = () => {
    generalQuery("insert_pqc1", {
      PROCESS_LOT_NO: process_lot_no.toUpperCase(),
      LINEQC_PIC: lineqc_empl.toUpperCase(),
      PROD_PIC: sx_data[0].INS_EMPL.toUpperCase(),
      PROD_LEADER: prod_leader_empl.toUpperCase(),
      STEPS: sx_data[0].STEP,
      CAVITY: sx_data[0].CAVITY,
      SETTING_OK_TIME: sx_data[0].MASS_START_TIME,
      FACTORY: sx_data[0].PLAN_FACTORY,
      REMARK: ktdtc,
      PROD_REQUEST_NO: sx_data[0].PROD_REQUEST_NO,
      G_CODE: sx_data[0].G_CODE,
      PLAN_ID: sx_data[0].PLAN_ID.toUpperCase(),
      PROCESS_NUMBER: sx_data[0].PROCESS_NUMBER,
      LINE_NO: sx_data[0].EQ_NAME_TT,
      REMARK2: remark,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);
          Swal.fire("Thông báo", "Input data thành công", "success");
          traPQC1Data();
          setPlanId('');
          setLineqc_empl('');
          setReMark('');
        } else {
          Swal.fire("Cảnh báo", "Có lỗi: " + response.data.message, "error");
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
      lineqc_empl !== "" &&
      sx_data.length !== 0 &&
      process_lot_no !== ""
    ) {
      return true;
    } else {
      return false;
    }
  };
  const updateSampleQty = async () => {
    if (selectedRowsDataA.length > 0) {
      let err_code: string = '';
      for (let i = 0; i < selectedRowsDataA.length; i++) {
        await generalQuery("updatepqc1sampleqty", {
          PQC1_ID: selectedRowsDataA[i].PQC1_ID,
          INSPECT_SAMPLE_QTY: selectedRowsDataA[i].INSPECT_SAMPLE_QTY
        })
          .then((response) => {
            if (response.data.tk_status !== "NG") {
            } else {
              err_code += '|   ' + response.data.message + ', ';
              //Swal.fire("Cảnh báo", "Có lỗi: " + response.data.message, "error");
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
      if (err_code === '') {
        Swal.fire("Thông báo", "Update sample qty thành công", "success");
      }
      else {
        Swal.fire("Cảnh báo", "Có lỗi: " + err_code, "error");
      }
    }
    else {
      Swal.fire("Cảnh báo", "Có lỗi: Chọn ít nhất 1 dòng để update", "error");
    }
  }
  useEffect(() => {
    traPQC1Data();
    ///handletraFailingData();
  }, []);
  return (
    <div className="pqc1">
      <div className="tracuuDataInspection">
        <div className="inputform">
          {true && (
            <div className="tracuuDataInspectionform">
              <b style={{ color: "blue" }}> {lineqc_empl && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: "bold",
                    color: "red",
                  }}
                >
                  {empl_name}
                </span>
              )}|NHẬP THÔNG TIN SETTING|  {prod_leader_empl && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: "bold",
                    color: "red",
                  }}
                >
                  {empl_name2}
                </span>
              )}</b>
              <div className="forminput">
                <div className="forminputcolumn">
                  <label>
                    <b>FACTORY</b>
                    <select
                      disabled={userData?.EMPL_NO === "NHU1903"}
                      name="factory"
                      value={factory}
                      onChange={(e) => {
                        setFactory(e.target.value);
                      }}
                    >
                      <option value="NM1">NM1</option>
                      <option value="NM2">NM2</option>
                    </select>
                  </label>
                  <label>
                    <b>Số chỉ thị sản xuất</b>
                    <input
                      ref={refArray[0]}
                      type="text"
                      placeholder=""
                      value={planId}
                      onKeyDown={(e) => {
                        handleKeyDown(e, 0);
                      }}
                      onChange={(e) => {
                        if (e.target.value.length >= 8) {
                          checkPlanID(e.target.value);
                          checkDataSX(e.target.value);
                        } else {
                          setSXData([]);
                          setInputNo("");
                          setProcessLotNo("");
                        }
                        setPlanId(e.target.value);
                      }}
                    ></input>
                  </label>
                </div>
                <div className="forminputcolumn">
                  <label>
                    <b>Mã LINEQC</b>
                    <input
                      ref={refArray[1]}
                      onKeyDown={(e) => {
                        handleKeyDown(e, 1);
                      }}
                      type="text"
                      placeholder={""}
                      value={lineqc_empl}
                      onChange={(e) => {
                        if (e.target.value.length >= 7) {
                          checkEMPL_NAME(1, e.target.value);
                        }
                        setLineqc_empl(e.target.value);
                      }}
                    ></input>
                  </label>
                  <label>
                    <b>Mã Leader SX</b>
                    <input
                      ref={refArray[2]}
                      onKeyDown={(e) => {
                        handleKeyDown(e, 2);
                      }}
                      type="text"
                      placeholder={""}
                      value={prod_leader_empl}
                      onChange={(e) => {
                        if (e.target.value.length >= 7) {
                          checkEMPL_NAME(2, e.target.value);
                        }
                        setprod_leader_empl(e.target.value);
                      }}
                    ></input>
                  </label>
                </div>
                <div className="forminputcolumn">
                  <label>
                    <b>Remark</b>
                    <input
                      ref={refArray[3]}
                      onKeyDown={(e) => {
                        handleKeyDown(e, 3);
                      }}
                      type="text"
                      placeholder={"Ghi chú"}
                      value={remark}
                      onChange={(e) => {
                        setReMark(e.target.value);
                      }}
                    ></input>
                  </label>
                  <Button
                    ref={refArray[4]}
                    onKeyDown={(e) => {
                      //handleKeyDown(e,4);
                    }}
                    color={"primary"}
                    variant="contained"
                    size="small"
                    sx={{
                      fontSize: "0.7rem",
                      padding: "3px",
                      backgroundColor: "#756DFA",
                    }}
                    onClick={() => {
                      if (checkInput()) {
                        refArray[0].current.focus();
                        inputDataPqc1();
                      } else {
                        refArray[0].current.focus();
                        Swal.fire(
                          "Thông báo",
                          "Hãy nhập đủ thông tin trước khi input",
                          "error"
                        );
                        refArray[0].current.focus();
                      }
                    }}
                  >
                    Input Data
                  </Button>
                  <Button
                    color={"primary"}
                    variant="contained"
                    size="small"
                    sx={{
                      fontSize: "0.7rem",
                      padding: "3px",
                      backgroundColor: "#02ac2c",
                    }}
                    onClick={() => {
                      updateSampleQty();
                      refArray[0].current.focus();
                    }}
                  >
                    Update QTY
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="maintable">
          {showhideinput && (
            <div className="tracuuDataInspectionform2">
              <b style={{ color: "blue" }}>THÔNG TIN CHỈ THỊ</b>
              <div className="forminput">
                <div className="forminputcolumn">
                  <label>
                    <b style={{ color: "gray" }}>LOT SX</b>
                    <input
                      disabled={true}
                      type="text"
                      value={process_lot_no}
                      onChange={(e) => {
                        if (e.target.value.length >= 7) {
                          checkProcessLotNo(e.target.value);
                        }
                        setProcessLotNo(e.target.value);
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
                    <b style={{ color: "gray" }}>LOT NVL</b>
                    <input
                      disabled={true}
                      type="text"
                      value={inputno}
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
                        fontSize: '0.7rem',
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
                    <b style={{ color: "gray" }}>LINE NO</b>
                    <input
                      disabled={true}
                      type="text"
                      value={
                        sx_data[0] !== undefined ? sx_data[0]?.EQ_NAME_TT : ""
                      }
                      onChange={(e) => { }}
                    ></input>
                  </label>
                  <label>
                    <b style={{ color: "gray" }}>Công Đoạn</b>
                    <input
                      disabled={true}
                      type="text"
                      value={
                        sx_data[0] !== undefined
                          ? sx_data[0]?.PROCESS_NUMBER
                          : ""
                      }
                      onChange={(e) => { }}
                    ></input>
                  </label>
                </div>
                <div className="forminputcolumn">
                  <label>
                    <b style={{ color: "gray" }}>STEP</b>
                    <input
                      disabled={true}
                      type="text"
                      value={sx_data[0] !== undefined ? sx_data[0]?.STEP : ""}
                      onChange={(e) => { }}
                    ></input>
                  </label>
                  <label>
                    <b style={{ color: "gray" }}>PD</b>
                    <input
                      disabled={true}
                      type="text"
                      value={sx_data[0] !== undefined ? sx_data[0]?.PD : ""}
                      onChange={(e) => { }}
                    ></input>
                  </label>
                </div>
                <div className="forminputcolumn">
                  <label>
                    <b style={{ color: "gray" }}>CAVITY</b>
                    <input
                      disabled={true}
                      type="text"
                      value={sx_data[0] !== undefined ? sx_data[0]?.CAVITY : ""}
                      onChange={(e) => { }}
                    ></input>
                  </label>
                  <label>
                    <b style={{ color: "gray" }}>ST.OK</b>
                    <input
                      disabled={true}
                      type="text"
                      value={
                        sx_data[0] !== undefined
                          ? sx_data[0]?.MASS_START_TIME
                          : ""
                      }
                      onChange={(e) => { }}
                    ></input>
                  </label>
                </div>
                <div className="forminputcolumn">
                  <label>
                    <b style={{ color: "gray" }}>Mã CNSX</b>
                    <input
                      disabled={true}
                      type="text"
                      value={
                        sx_data[0] !== undefined ? sx_data[0]?.INS_EMPL : ""
                      }
                      onChange={(e) => { }}
                    ></input>
                  </label>
                </div>
              </div>
            </div>
          )}
          <div className="tracuuYCSXTable">{pqc1DataTable}</div>
        </div>
      </div>
    </div>
  );
};
export default PQC1;

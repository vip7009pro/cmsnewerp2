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
import React, { useContext, useEffect, useState, useTransition } from "react";
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
interface TestListTable {
  TEST_CODE: string;
  TEST_NAME: string;
  SELECTED: boolean;
}
interface QC_FAIL_DATA {
  id?: number;
  FACTORY: string;
  PLAN_ID_SUDUNG: string;
  G_NAME: string;
  LIEUQL_SX: number;
  M_CODE: string;
  M_LOT_NO: string;
  VENDOR_LOT: string;
  M_NAME: string;
  WIDTH_CD: number;
  ROLL_QTY: number;
  IN_QTY: number;
  TOTAL_IN_QTY: number;
  USE_YN: string;
  PQC3_ID: number;
  DEFECT_PHENOMENON: string;
  OUT_DATE: string;
  INS_EMPL: string;
  INS_DATE: string;
  UPD_EMPL: string;
  UPD_DATE: string;
  PHANLOAI: string;
  QC_PASS: string;
  QC_PASS_DATE: string;
  QC_PASS_EMPL: string;
  REMARK: string;
}
const FAILING = () => {
  const [userData, setUserData] = useContext(UserContext);
  const [testtype, setTestType] = useState("NVL");
  const [inputno, setInputNo] = useState("");
  const [checkNVL, setCheckNVL] = useState(
    userData.SUBDEPTNAME === "IQC" ? true : false
  );
  const [request_empl, setrequest_empl] = useState("");
  const [remark, setReMark] = useState("");
  const [testList, setTestList] = useState<TestListTable[]>([
    { TEST_CODE: "1", TEST_NAME: "Kích thước", SELECTED: false },
    { TEST_CODE: "2", TEST_NAME: "Kéo keo", SELECTED: false },
    { TEST_CODE: "3", TEST_NAME: "XRF", SELECTED: false },
    { TEST_CODE: "4", TEST_NAME: "Điện trở", SELECTED: false },
    { TEST_CODE: "5", TEST_NAME: "Tĩnh điện", SELECTED: false },
    { TEST_CODE: "6", TEST_NAME: "Độ bóng", SELECTED: false },
    { TEST_CODE: "7", TEST_NAME: "Phtalate", SELECTED: false },
    { TEST_CODE: "8", TEST_NAME: "FTIR", SELECTED: false },
    { TEST_CODE: "9", TEST_NAME: "Mài mòn", SELECTED: false },
    { TEST_CODE: "10", TEST_NAME: "Màu sắc", SELECTED: false },
    { TEST_CODE: "11", TEST_NAME: "TVOC", SELECTED: false },
    { TEST_CODE: "12", TEST_NAME: "Cân nặng", SELECTED: false },
    { TEST_CODE: "13", TEST_NAME: "Scanbarcode", SELECTED: false },
    { TEST_CODE: "14", TEST_NAME: "Nhiệt cao Ẩm cao", SELECTED: false },
    { TEST_CODE: "15", TEST_NAME: "Shock nhiệt", SELECTED: false },
    { TEST_CODE: "1002", TEST_NAME: "Kéo keo 2", SELECTED: false },
    { TEST_CODE: "1003", TEST_NAME: "Ngoại Quan", SELECTED: false },
    { TEST_CODE: "1005", TEST_NAME: "Độ dày", SELECTED: false },
  ]);
  const [inspectiondatatable, setInspectionDataTable] = useState<Array<any>>(
    []
  );
  const [selectedRowsData, setSelectedRowsData] = useState<Array<QC_FAIL_DATA>>(
    []
  );
  const [empl_name, setEmplName] = useState("");
  const [reqDeptCode, setReqDeptCode] = useState("");
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
  const [mLotArray, setmLotArray] = useState<string[]>([]);
  const [showhideinput, setShowHideInput] = useState(true);
  const setQCPASS = async (value: string) => {
    //console.log(selectedRowsData);
    if (selectedRowsData.length > 0) {
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
      for (let i = 0; i < selectedRowsData.length; i++) {
        await generalQuery("updateQCPASS_FAILING", {
          M_LOT_NO: selectedRowsData[i].M_LOT_NO,
          PLAN_ID_SUDUNG: selectedRowsData[i].PLAN_ID_SUDUNG,
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
      <div className='datatb'>
        <DataGrid
          autoNavigateToFocusedRow={true}
          allowColumnReordering={true}
          allowColumnResizing={true}
          columnAutoWidth={false}
          cellHintEnabled={true}
          columnResizingMode={"widget"}
          showColumnLines={true}
          dataSource={inspectiondatatable}
          columnWidth='auto'
          keyExpr='id'
          height={"70vh"}
          showBorders={true}
          onSelectionChanged={(e) => {
            //console.log(e.selectedRowsData);
            //setSelectedRowsData(e.selectedRowsData);
            setSelectedRowsData(e.selectedRowsData);
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
            allowUpdating={true}
            allowAdding={false}
            allowDeleting={true}
            mode='cell'
            confirmDelete={true}
            onChangesChange={(e) => {}}
          />
          <Export enabled={true} />
          <Toolbar disabled={false}>
            <Item location='before'>
              <IconButton
                className='buttonIcon'
                onClick={() => {
                  SaveExcel(inspectiondatatable, "SPEC DTC");
                }}
              >
                <AiFillFileExcel color='green' size={25} />
                SAVE
              </IconButton>
              <IconButton
                className='buttonIcon'
                onClick={() => {
                  setShowHideInput((pre) => !pre);
                  setInspectionDataTable([]);
                }}
              >
                <BiShow color='blue' size={25} />
                Show/Hide Input
              </IconButton>
              <span style={{ fontSize: 20, fontWeight: "bold" }}>
                BẢNG NHẬP THÔNG TIN CUỘN LIỆU- BTP QC FAIL
              </span>
              <IconButton
                className='buttonIcon'
                onClick={() => {
                  handletraFailingData();
                  setShowHideInput(false);
                }}
              >
                <AiOutlineSearch color='red' size={25} />
                Tra Data
              </IconButton>
              <IconButton
                className='buttonIcon'
                onClick={() => {
                  if (userData.SUBDEPTNAME === "IQC") {
                    setQCPASS("Y");
                  } else {
                    Swal.fire(
                      "Thông báo",
                      "Bạn không phải người bộ phận IQC",
                      "error"
                    );
                  }
                  //checkBP(userData.EMPL_NO,userData.MAINDEPTNAME,['QC'], ()=>{setQCPASS('Y');});
                  //checkBP(userData.EMPL_NO,userData.MAINDEPTNAME,['QLSX'], setQCPASS('Y'));
                  //setQCPASS('Y');
                }}
              >
                <GrStatusGood color='green' size={25} />
                SET PASS
              </IconButton>
              <IconButton
                className='buttonIcon'
                onClick={() => {
                  if (userData.SUBDEPTNAME === "IQC") {
                    setQCPASS("N");
                  } else {
                    Swal.fire(
                      "Thông báo",
                      "Bạn không phải người bộ phận IQC",
                      "error"
                    );
                  }
                  //checkBP(userData.EMPL_NO,userData.MAINDEPTNAME,['QC'], ()=>{setQCPASS('Y');});
                  //checkBP(userData.EMPL_NO,userData.MAINDEPTNAME,['QLSX'], setQCPASS('N'));
                  //setQCPASS('N');
                }}
              >
                <FcCancel color='red' size={25} />
                RESET PASS
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
          <Column
            dataField='FACTORY'
            caption='FACTORY'
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField='PLAN_ID_SUDUNG'
            caption='PLAN_ID_SUDUNG'
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField='G_NAME'
            caption='G_NAME'
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField='LIEUQL_SX'
            caption='LIEUQL_SX'
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField='M_CODE'
            caption='M_CODE'
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField='M_LOT_NO'
            caption='M_LOT_NO'
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField='VENDOR_LOT'
            caption='VENDOR_LOT'
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField='M_NAME'
            caption='M_NAME'
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField='WIDTH_CD'
            caption='WIDTH_CD'
            width={100}
            allowEditing={false}
          ></Column>
          <Column dataField='ROLL_QTY' caption='ROLL_QTY' width={100}></Column>
          <Column dataField='IN_QTY' caption='IN_QTY' width={100}></Column>
          <Column
            dataField='TOTAL_IN_QTY'
            caption='TOTAL_IN_QTY'
            width={100}
          ></Column>
          <Column
            dataField='USE_YN'
            caption='USE_YN'
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField='PQC3_ID'
            caption='PQC3_ID'
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField='DEFECT_PHENOMENON'
            caption='DEFECT_PHENOMENON'
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField='OUT_DATE'
            caption='OUT_DATE'
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField='INS_EMPL'
            caption='INS_EMPL'
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField='INS_DATE'
            caption='INS_DATE'
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField='UPD_EMPL'
            caption='UPD_EMPL'
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField='UPD_DATE'
            caption='UPD_DATE'
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField='PHANLOAI'
            caption='PHANLOAI'
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField='QC_PASS'
            caption='QC_PASS'
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField='QC_PASS_DATE'
            caption='QC_PASS_DATE'
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField='QC_PASS_EMPL'
            caption='QC_PASS_EMPL'
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField='REMARK'
            caption='REMARK'
            width={100}
            allowEditing={false}
          ></Column>
        </DataGrid>
      </div>
    ),
    [inspectiondatatable]
  );
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
            }
          );
          setInspectionDataTable(loadeddata);
          Swal.fire(
            "Thông báo",
            "Đã load :" + loadeddata.length + " dòng",
            "success"
          );
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const checkEMPL_NAME = (EMPL_NO: string) => {
    generalQuery("checkEMPL_NO_mobile", { EMPL_NO: EMPL_NO })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);
          setEmplName(
            response.data.data[0].MIDLAST_NAME +
              " " +
              response.data.data[0].FIRST_NAME
          );
          setReqDeptCode(response.data.data[0].WORK_POSITION_CODE);
        } else {
          setEmplName("");
          setReqDeptCode("");
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
  const checkInput = (): boolean => {
    if (
      inputno !== "" &&
      planId !== "" &&
      vendorLot !== "" &&
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
      FACTORY: userData.FACTORY_CODE === 1 ? "NM1" : "NM2",
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
      INS_EMPL: userData.EMPL_NO,
      INS_DATE: moment().format("YYYY-MM-DD HH:mm:ss"),
      UPD_EMPL: "",
      UPD_DATE: "",
      PHANLOAI: testtype,
      QC_PASS: "N",
      QC_PASS_DATE: "",
      QC_PASS_EMPL: "",
      REMARK: remark,
    };
    setInspectionDataTable((prev) => {
      return [...prev, temp_row];
    });
  };
  useEffect(() => {
    ///handletraFailingData();
  }, []);
  return (
    <div className='failing'>
      <div className='tracuuDataInspection'>
        <div className='maintable'>
          {showhideinput && (
            <div className='tracuuDataInspectionform'>
              <b style={{ color: "blue" }}>INPUT LIỆU QC FAIL</b>
              <div className='forminput'>
                <div className='forminputcolumn'>
                  <b>Phân loại hàng</b>
                  <label>
                    <select
                      name='phanloaihang'
                      value={testtype}
                      onChange={(e) => {
                        setTestType(e.target.value);
                      }}
                    >
                      <option value='NVL'>Vật Liệu</option>
                      <option value='BTP'>Bán Thành Phẩm</option>
                    </select>
                  </label>
                  <b>Số chỉ thị sản xuất</b>
                  <label>
                    <input
                      type='text'
                      placeholder='1F80008A'
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
                  <b>LOT NVL CMS</b>
                  <label>
                    <input
                      type='text'
                      placeholder='202304190123'
                      value={inputno}
                      onChange={(e) => {
                        if (e.target.value.length >= 7) {
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
                  <b>VENDOR LOT</b>
                  <label>
                    <input
                      type='text'
                      placeholder={"NVD1201"}
                      value={vendorLot}
                      onChange={(e) => {
                        setVendorLot(e.target.value);
                      }}
                    ></input>
                  </label>
                  <b>Mã nhân viên giao</b>
                  <label>
                    <input
                      type='text'
                      placeholder={"NVD1201"}
                      value={request_empl}
                      onChange={(e) => {
                        if (e.target.value.length >= 7) {
                          checkEMPL_NAME(e.target.value);
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
                <b>Remark</b>
                <div className='forminputcolumn'>
                  <label>
                    <input
                      type='text'
                      placeholder={"Ghi chú"}
                      value={remark}
                      onChange={(e) => {
                        setReMark(e.target.value);
                      }}
                    ></input>
                  </label>
                </div>
              </div>
              <div className='formbutton'>
                <button
                  className='tranhatky'
                  onClick={() => {
                    if (checkInput()) {
                      let lotArray = inspectiondatatable.map(
                        (element: QC_FAIL_DATA, index: number) => {
                          return element.M_LOT_NO;
                        }
                      );
                      if (pqc3Id !== 0) {
                        if (lotArray.indexOf(inputno) < 0) {
                          addRow();
                        } else {
                          Swal.fire(
                            "Thông tin",
                            "Đã thêm cuộn này rồi",
                            "error"
                          );
                        }
                      } else {
                        Swal.fire(
                          "Thông tin",
                          "Số chỉ thị này PQC chưa lập lỗi, không thêm được",
                          "error"
                        );
                      }
                    } else {
                      Swal.fire(
                        "Thông báo",
                        "Hãy nhập đủ thông tin trước khi đăng ký",
                        "error"
                      );
                    }
                  }}
                >
                  Add
                </button>
                <button
                  className='tranhatky'
                  onClick={() => {
                    if (checkInput()) {
                    } else {
                      Swal.fire(
                        "Thông báo",
                        "Hãy nhập đủ thông tin trước khi đăng ký",
                        "error"
                      );
                    }
                  }}
                >
                  Save
                </button>
              </div>
              <div
                className='formbutton'
                style={{ marginTop: "20px", display: "flex", flexWrap: "wrap" }}
              ></div>
            </div>
          )}
          <div className='tracuuYCSXTable'>{materialDataTable}</div>
        </div>
      </div>
    </div>
  );
};
export default FAILING;

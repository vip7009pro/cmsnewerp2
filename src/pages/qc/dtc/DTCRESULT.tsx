import {
  Autocomplete,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import moment from "moment";
import React, { useContext, useEffect, useState, useTransition } from "react";
import { AiFillFileExcel } from "react-icons/ai";
import Swal from "sweetalert2";
import { generalQuery } from "../../../api/Api";
import { UserContext } from "../../../api/Context";
import { CustomResponsiveContainer, SaveExcel } from "../../../api/GlobalFunction";
import "./DTCRESULT.scss";
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
import {
  DTC_REG_DATA,
  DTC_RESULT_INPUT,
  TestListTable,
} from "../../../api/GlobalInterface";
const DTCRESULT = () => {
  const [testtype, setTestType] = useState("3");
  const [inputno, setInputNo] = useState("");
  const [checkNVL, setCheckNVL] = useState(false);
  const [dtc_id, setDTC_ID] = useState("");
  const [remark, setReMark] = useState("");
  const [testList, setTestList] = useState<TestListTable[]>([
    { TEST_CODE: "1", TEST_NAME: "Kích thước", CHECKADDED: false },
    { TEST_CODE: "2", TEST_NAME: "Kéo keo", CHECKADDED: false },
    { TEST_CODE: "3", TEST_NAME: "XRF", CHECKADDED: false },
    { TEST_CODE: "4", TEST_NAME: "Điện trở", CHECKADDED: false },
    { TEST_CODE: "5", TEST_NAME: "Tĩnh điện", CHECKADDED: false },
    { TEST_CODE: "6", TEST_NAME: "Độ bóng", CHECKADDED: false },
    { TEST_CODE: "7", TEST_NAME: "Phtalate", CHECKADDED: false },
    { TEST_CODE: "8", TEST_NAME: "FTIR", CHECKADDED: false },
    { TEST_CODE: "9", TEST_NAME: "Mài mòn", CHECKADDED: false },
    { TEST_CODE: "10", TEST_NAME: "Màu sắc", CHECKADDED: false },
    { TEST_CODE: "11", TEST_NAME: "TVOC", CHECKADDED: false },
    { TEST_CODE: "12", TEST_NAME: "Cân nặng", CHECKADDED: false },
    { TEST_CODE: "13", TEST_NAME: "Scanbarcode", CHECKADDED: false },
    { TEST_CODE: "14", TEST_NAME: "Nhiệt cao Ẩm cao", CHECKADDED: false },
    { TEST_CODE: "15", TEST_NAME: "Shock nhiệt", CHECKADDED: false },
    { TEST_CODE: "1002", TEST_NAME: "Kéo keo 2", CHECKADDED: false },
    { TEST_CODE: "1003", TEST_NAME: "Ngoại Quan", CHECKADDED: false },
    { TEST_CODE: "1005", TEST_NAME: "Độ dày", CHECKADDED: false },
  ]);
  const [inspectiondatatable, setInspectionDataTable] = useState<Array<any>>(
    [],
  );
  const [testname, setTestName] = useState("1003");
  const [selectedRowsData, setSelectedRowsData] = useState<Array<DTC_REG_DATA>>(
    [],
  );
  const [empl_name, setEmplName] = useState("");
  const [reqDeptCode, setReqDeptCode] = useState("");
  const [g_name, setGName] = useState("");
  const [g_code, setGCode] = useState("");
  const [m_name, setM_Name] = useState("");
  const [m_code, setM_Code] = useState("");
  const [prodrequestno, setProdRequestNo] = useState("");
  const [prodreqdate, setProdReqDate] = useState("");
  const materialDataTable = React.useMemo(
    () => (
      <div className="datatb">
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
            dataSource={inspectiondatatable}
            columnWidth="auto"
            keyExpr="id"
            height={"85vh"}
            showBorders={true}
            onSelectionChanged={(e) => {
              //console.log(e.selectedRowsData);
              //setSelectedRowsData(e.selectedRowsData);
            }}
            onRowClick={(e) => {
              //console.log(e.data);
            }}
          >
            <KeyboardNavigation
              editOnKeyPress={true}
              enterKeyAction={"moveFocus"}
              enterKeyDirection={"column"}
            />
            <Scrolling
              useNative={true}
              scrollByContent={true}
              scrollByThumb={true}
              showScrollbar="onHover"
              mode="virtual"
            />
            {/*     <Selection mode='multiple' selectAllMode='allPages' /> */}
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
                <span style={{ fontSize: '0.8rem', fontWeight: "bold" }}>
                  Bảng nhập kết quả độ tin cậy
                </span>
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
            <Column dataField="DTC_ID" caption="DTC_ID" width={100}></Column>
            <Column
              dataField="TEST_NAME"
              caption="TEST_NAME"
              width={100}
            ></Column>
            <Column
              dataField="POINT_NAME"
              caption="POINT_NAME"
              width={100}
            ></Column>
            <Column
              dataField="CENTER_VALUE"
              caption="CENTER_VALUE"
              width={100}
            ></Column>
            <Column
              dataField="UPPER_TOR"
              caption="UPPER_TOR"
              width={100}
            ></Column>
            <Column
              dataField="LOWER_TOR"
              caption="LOWER_TOR"
              width={100}
            ></Column>
            <Column dataField="RESULT" caption="RESULT" width={100}></Column>
            <Column dataField="REMARK" caption="REMARK" width={100}></Column>
          </DataGrid>
        </CustomResponsiveContainer>
      </div>
    ),
    [inspectiondatatable],
  );
  const handletraDTCData = (dtc_id: string, test_code: string) => {
    generalQuery("getinputdtcspec", {
      DTC_ID: dtc_id,
      TEST_CODE: test_code,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: DTC_RESULT_INPUT[] = response.data.data.map(
            (element: DTC_RESULT_INPUT, index: number) => {
              return {
                ...element,
                id: index,
              };
            },
          );
          setInspectionDataTable(loadeddata);
        } else {
          setInspectionDataTable([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const checkInput = (): boolean => {
    let checkresult: boolean = true;
    for (let i = 0; i < inspectiondatatable.length; i++) {
      if (
        inspectiondatatable[i].RESULT === "" ||
        inspectiondatatable[i].RESULT === null
      ) {
        checkresult = false;
      }
    }
    if (dtc_id !== "" && checkresult === true) {
      return true;
    } else {
      return false;
    }
  };
  const checkRegisteredTest = (dtc_id: string) => {
    generalQuery("checkRegisterdDTCTEST", {
      DTC_ID: dtc_id,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);
          let temp_loaded: TestListTable[] = response.data.data.map(
            (element: TestListTable, index: number) => {
              return {
                ...element,
                CHECKADDED: element.CHECKADDED === null ? false : true,
              };
            },
          );
          //console.log(temp_loaded);
          setTestList(temp_loaded);
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const insertDTCResult = async () => {
    if (inspectiondatatable.length > 0) {
      let err_code: string = "";
      for (let i = 0; i < inspectiondatatable.length; i++) {
        await generalQuery("insert_dtc_result", {
          DTC_ID: dtc_id,
          G_CODE: inspectiondatatable[i].G_CODE,
          M_CODE: inspectiondatatable[i].M_CODE,
          TEST_CODE: inspectiondatatable[i].TEST_CODE,
          POINT_CODE: inspectiondatatable[i].POINT_CODE,
          SAMPLE_NO: 1,
          RESULT: inspectiondatatable[i].RESULT,
          REMARK: remark,
        })
          // eslint-disable-next-line no-loop-func
          .then((response) => {
            if (response.data.tk_status !== "NG") {
              //console.log(response.data.data);
            } else {
              err_code += `Lỗi : ` + response.data.message;
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
      if (err_code === "") {
        updateDTCTESEMPL(
          inspectiondatatable[0].DTC_ID,
          inspectiondatatable[0].TEST_CODE,
        );
        Swal.fire("Thông báo", "Up kết quả thành công", "success");
      } else {
        Swal.fire("Thông báo", "Lỗi: " + err_code, "error");
      }
    }
  };
  const updateDTCTESEMPL = (dtc_id: string, test_code: string) => {
    generalQuery("updateDTC_TEST_EMPL", {
      DTC_ID: dtc_id,
      TEST_CODE: test_code,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => { }, []);
  return (
    <div className="dtcresult">
      <div className="tracuuDataInspection">
        <div className="maintable">
          <div className="tracuuDataInspectionform">
            <div className="forminput">
              <div className="forminputcolumn">
                <label>
                  <b>ID:</b>
                  <input
                    type="text"
                    placeholder={"123456"}
                    value={dtc_id}
                    onChange={(e) => {
                      setDTC_ID(e.target.value);
                      checkRegisteredTest(e.target.value);
                    }}
                  ></input>
                  <span
                    style={{ fontSize: 15, fontWeight: "bold", color: "blue" }}
                  >
                    {empl_name}
                  </span>
                </label>
              </div>
              <div className="forminputcolumn">
                <label>
                  <div className="checkboxarray" style={{ display: "flex" }}>
                    <RadioGroup
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={testname}
                      onChange={(e) => {
                        console.log(e.target.value);
                        setTestName(e.target.value);
                        if (dtc_id !== "")
                          handletraDTCData(dtc_id, e.target.value);
                      }}
                      style={{ display: "flex" }}
                    >
                      <div
                        className="radiogroup"
                        style={{ display: "flex", flexWrap: "wrap" }}
                      >
                        {testList.map(
                          (element: TestListTable, index: number) => {
                            return (
                              <div
                                key={index}
                                className="radioelement"
                                style={{
                                  display: "flex",
                                  margin: 0,
                                  padding: 0,
                                }}
                              >
                                <FormControlLabel
                                  labelPlacement="bottom"
                                  value={element.TEST_CODE.toString()}
                                  key={index}
                                  style={{ fontSize: 5, padding: 0, margin: 0 }}
                                  label={
                                    <Typography
                                      style={{
                                        padding: 0,
                                        margin: 0,
                                        fontSize: 12,
                                        fontWeight: element.CHECKADDED
                                          ? "bold"
                                          : "normal",
                                        color: element.CHECKADDED
                                          ? "green"
                                          : "black",
                                      }}
                                    >
                                      {element.TEST_NAME}
                                    </Typography>
                                  }
                                  sx={{ fontSize: 5, padding: 0, margin: 0 }}
                                  control={<Radio />}
                                />
                              </div>
                            );
                          },
                        )}
                      </div>
                    </RadioGroup>
                  </div>
                </label>
              </div>
              <div className="forminputcolumn">
                <label>
                  <b>Remark</b>
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
              <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#2297c5' }} onClick={() => {
                if (checkInput()) {
                  insertDTCResult();
                } else {
                  Swal.fire(
                    "Thông báo",
                    "Hãy nhập đủ thông tin trước khi đăng ký",
                    "error",
                  );
                }
              }}>NHẬP KẾT QUẢ</Button>
            </div>
            <div
              className="formbutton"
              style={{ marginTop: "20px", display: "flex", flexWrap: "wrap" }}
            ></div>
          </div>
          <div className="tracuuYCSXTable">{materialDataTable}</div>
        </div>
      </div>
    </div>
  );
};
export default DTCRESULT;

import { Button, FormControlLabel, IconButton, Radio, RadioGroup, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { AiFillFileExcel } from "react-icons/ai";
import Swal from "sweetalert2";
import { generalQuery } from "../../../api/Api";
import { CustomResponsiveContainer, f_loadDTC_TestList, SaveExcel } from "../../../api/GlobalFunction";
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
  Toolbar,
} from "devextreme-react/data-grid";
import {
  DTC_REG_DATA,
  DTC_RESULT_INPUT,
  TestListTable,
} from "../../../api/GlobalInterface";
import AGTable from "../../../components/DataTable/AGTable";
const DTCRESULT = () => {
  const [testtype, setTestType] = useState("3");
  const [inputno, setInputNo] = useState("");
  const [checkNVL, setCheckNVL] = useState(false);
  const [dtc_id, setDTC_ID] = useState("");
  const [remark, setReMark] = useState("");
  const [testList, setTestList] = useState<TestListTable[]>([]);
  const getTestList = async () => {
    let tempList: TestListTable[] = await f_loadDTC_TestList();
    setTestList(tempList);
  }
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

  const dtcResultColumn = [    
    { field: 'DTC_ID',headerName: 'DTC_ID', resizable: true,width: 100 },
    { field: 'G_CODE',headerName: 'G_CODE', resizable: true,width: 100 },
    { field: 'M_CODE',headerName: 'M_CODE', resizable: true,width: 100 },
    { field: 'TEST_NAME',headerName: 'TEST_NAME', resizable: true,width: 100 },
    { field: 'TEST_CODE',headerName: 'TEST_CODE', resizable: true,width: 100 },
    { field: 'POINT_NAME',headerName: 'POINT_NAME', resizable: true,width: 100 },
    { field: 'POINT_CODE',headerName: 'POINT_CODE', resizable: true,width: 100 },
    { field: 'CENTER_VALUE',headerName: 'CENTER_VALUE', resizable: true,width: 100 },
    { field: 'UPPER_TOR',headerName: 'UPPER_TOR', resizable: true,width: 100 },
    { field: 'LOWER_TOR',headerName: 'LOWER_TOR', resizable: true,width: 100 },
    { field: 'RESULT',headerName: 'RESULT', resizable: true,width: 100 },
    { field: 'REMARK',headerName: 'REMARK', resizable: true,width: 100 },   
  ]
  const resultDTCTable = useMemo(() => {
    return (
      <AGTable
        toolbar={
          <div>
          </div>}
        columns={dtcResultColumn}
        data={inspectiondatatable}
        onCellEditingStopped={(e) => {
          //console.log(e.data)
        }} onRowClick={(e) => {
          //console.log(e.data)
        }} onSelectionChange={(e) => {
          //console.log(e!.api.getSelectedRows())
        }}
        onRowDoubleClick={async (e) => {
          //console.log(e.data)
        }}
      />
    )
  }, [inspectiondatatable,])
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
  useEffect(() => {
    getTestList();
  }, []);
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
          <div className="tracuuYCSXTable">{resultDTCTable}</div>
        </div>
      </div>
    </div>
  );
};
export default DTCRESULT;

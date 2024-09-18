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
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
const DTCRESULT = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);

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
          <div className="tracuuDataInspectionform" style={{ backgroundImage: theme.CMS.backgroundImage }}>
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

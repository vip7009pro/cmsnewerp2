import { Button, FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { generalQuery } from "../../../api/Api";
import { f_loadDTC_TestList } from "../../../api/GlobalFunction";
import "./DTCRESULT.scss";
import {
  DTC_REG_DATA,
  TestListTable,
} from "../../../api/GlobalInterface";
import AGTable from "../../../components/DataTable/AGTable";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import * as XLSX from "xlsx";
export interface DTC_RESULT_INPUT {
  DTC_ID: number;
  G_CODE: string;
  G_NAME: string;
  M_CODE: string;
  M_NAME: string;
  TEST_NAME: string;
  TEST_CODE: number;
  POINT_NAME: string;
  POINT_CODE: number;
  CENTER_VALUE: number;
  SAMPLE_NO: number;
  UPPER_TOR: number;
  LOWER_TOR: number;
  RESULT: number;
  REMARK: string;
  id: number;
}
// Định nghĩa interface cho object đầu vào
export interface InputData {
  Br: string | number;
  Pb: string | number;
  Hg: string | number;
  Cd: string | number;
  AS: string | number;
  Cr: string | number;
  Sb: string | number;
  Sn: string | number;
  S: string | number;
  Cl: string | number;
  P: string | number;  
  REMARK: string;
}
// Định nghĩa interface cho object đầu ra
export interface OutputData {
  id: number;
  DTC_ID: number;
  TEST_CODE: number;
  TEST_NAME: string;
  G_CODE: string;
  G_NAME: string;
  M_CODE: string;
  M_NAME: string;
  POINT_CODE: number;
  POINT_NAME: string;
  SAMPLE_NO: number;
  CENTER_VALUE: number;
  UPPER_TOR: number;
  LOWER_TOR: number;
  RESULT: number;
  REMARK: string;
}
export const unpivotJsonArray = (DTC_ID: number, TEST_CODE: number, G_CODE: string,G_NAME: string,  M_CODE: string, M_NAME: string, TEST_NAME: string, defaultResultArray: DTC_RESULT_INPUT[], inputArray: InputData[]): OutputData[] => {
  const result: OutputData[] = [];
  let pointCodeCounter = 1; // Bộ đếm POINT_CODE tăng liên tục  
  inputArray.forEach((item, index) => {
    const sampleNo = 1; // SAMPLE_NO bắt đầu từ 1
    Object.entries(item).forEach(([key, value]) => {
      const resultValue = value === "ND" ? 0 : Number(value); // Nếu giá trị là "ND" thì gán 0, ngược lại gán giá trị    
      if(key === "REMARK") return; // Nếu key là "REMARK" thì bỏ qua
      result.push({
        id: index,
        DTC_ID: DTC_ID,
        TEST_CODE: TEST_CODE,
        TEST_NAME: TEST_NAME,
        G_CODE: G_CODE,
        G_NAME: G_NAME,
        M_CODE: M_CODE,
        M_NAME: M_NAME,
        POINT_CODE: pointCodeCounter,       
        POINT_NAME: key + (index+1),       
        SAMPLE_NO: sampleNo,
        RESULT: resultValue,
        CENTER_VALUE: 0,
        UPPER_TOR: 0,
        LOWER_TOR: 0,
        REMARK: item.REMARK,
      });
      pointCodeCounter++; // Tăng POINT_CODE cho phần tử tiếp theo
    });
  });
  //lấy các giá trị CENTER_VALUE, UPPER_TOR, LOWER_TOR từ defaultResultArray cho vào result array
  for (let i = 0; i < result.length; i++) {
    for (let j = 0; j < defaultResultArray.length; j++) {
      if (result[i].POINT_NAME === defaultResultArray[j].POINT_NAME) {
        result[i].CENTER_VALUE = defaultResultArray[j].CENTER_VALUE;
        result[i].UPPER_TOR = defaultResultArray[j].UPPER_TOR;
        result[i].LOWER_TOR = defaultResultArray[j].LOWER_TOR;
      }
    }
  }
  return result;
}
const DTCRESULT = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [uploadExcelJson, setUploadExcelJSon] = useState<Array<any>>([]);
  const [dtc_id, setDTC_ID] = useState("");
  const [remark, setReMark] = useState("");
  const [testList, setTestList] = useState<TestListTable[]>([]);
  const getTestList = async () => {
    let tempList: TestListTable[] = await f_loadDTC_TestList();
    setTestList(tempList);
  }
  const [inspectiondatatable, setInspectionDataTable] = useState<Array<DTC_RESULT_INPUT>>(
    [],
  );
  const [testname, setTestName] = useState("1003");

  const [testcode_tenthat, setTestCode_tenthat] = useState("XRF");

  const [selectedRowsData, setSelectedRowsData] = useState<Array<DTC_REG_DATA>>(
    [],
  );
  const [empl_name, setEmplName] = useState("");
  const dtcResultColumn = [
    { field: 'DTC_ID', headerName: 'DTC_ID', resizable: true, width: 80, headerCheckboxSelection: true, checkboxSelection: true, },
    { field: 'G_CODE', headerName: 'G_CODE', resizable: true, width: 60 },
    { field: 'G_NAME', headerName: 'G_NAME', resizable: true, width: 120 },
    { field: 'M_CODE', headerName: 'M_CODE', resizable: true, width: 60 },
    { field: 'TEST_NAME', headerName: 'TEST_NAME', resizable: true, width: 80 },
    { field: 'TEST_CODE', headerName: 'TEST_CODE', resizable: true, width: 60 },
    { field: 'POINT_NAME', headerName: 'POINT_NAME', resizable: true, width: 70 },
    { field: 'POINT_CODE', headerName: 'POINT_CODE', resizable: true, width: 70 },
    { field: 'CENTER_VALUE', headerName: 'CENTER_VALUE', resizable: true, width: 100 },
    { field: 'UPPER_TOR', headerName: 'UPPER_TOR', resizable: true, width: 100 },
    { field: 'LOWER_TOR', headerName: 'LOWER_TOR', resizable: true, width: 100 },
    { field: 'RESULT', headerName: 'RESULT', resizable: true, width: 100, cellRenderer: (params: any) => {
      let rs: number = Number(params.value);          
      if(params.value === null) {
        return  <span style={{ color: 'black', fontWeight: 'bold', fontSize: '0.8rem' }}>{params.value?.toLocaleString('en-US')}</span>
      }      
      else if(rs > (Number(params.data.UPPER_TOR)  + Number(params.data.CENTER_VALUE)) || rs < (Number(params.data.CENTER_VALUE) - Number(params.data.LOWER_TOR)))
      {
        return <span style={{ color: 'red', fontWeight: 'bold', fontSize: '0.8rem' }}>{params.value?.toLocaleString('en-US')}</span>        
      }
      else {
        return <span style={{ color: 'green', fontWeight: 'bold', fontSize: '0.8rem' }}>{params.value?.toLocaleString('en-US')}</span>        
      }     
    } 
  },
    { field: 'REMARK', headerName: 'REMARK', resizable: true, width: 100 },
  ]
  const readUploadFile = (e: any) => {
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json: any = XLSX.utils.sheet_to_json(worksheet);
        const keys = Object.keys(json[0]);
        let finalJson: any = [];
        finalJson = json.map((element: any, index: number) => {
          return {
            ...element,
            id: index
          }
        });
        let inputArray: InputData[] = finalJson.map((element: any) => {
          return {
            Br: element.Br ?? 0,
            Pb: element.Pb ?? 0,
            Hg: element.Hg ?? 0,
            Cd: element.Cd ?? 0,
            As: element.As ?? 0,
            Cr: element.Cr ?? 0,
            Sb: element.Sb ?? 0,
            Sn: element.Sn ?? 0,
            S: element.S ?? 0,
            Cl: element.Cl ?? 0,
            P: element.P ?? 0,
            REMARK: element.REMARK ?? "",
          };
        });
        if(inputArray.length > 7){
          Swal.fire(
            "Thông báo",
            "Số lượng dòng trong file excel không được lớn hơn 7",
            "error",
          );
          return;
        }
        let newInputArray: DTC_RESULT_INPUT[] = [];
        newInputArray = unpivotJsonArray(inspectiondatatable[0].DTC_ID, inspectiondatatable[0].TEST_CODE, inspectiondatatable[0].G_CODE, inspectiondatatable[0].G_NAME,inspectiondatatable[0].M_CODE,inspectiondatatable[0].M_NAME, inspectiondatatable[0].TEST_NAME, inspectiondatatable, inputArray);
        setInspectionDataTable(newInputArray);
        //setUploadExcelJSon(finalJson);
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };
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
        isNaN(inspectiondatatable[i].RESULT) ||
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
          REMARK: remark === "" ?  inspectiondatatable[i].REMARK : remark,
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
  const updateDTCTESEMPL = (dtc_id: number, test_code: number) => {
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
                        setTestCode_tenthat(
                          testList.filter( (element: TestListTable) => element.TEST_CODE.toString() === e.target.value)[0].TEST_NAME
                        );

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
              <div className="forminputcolumn">
              {(testname ==='3') && <label htmlFor="upload">
              <b>Excel: </b>
              <input
                className="selectfilebutton"
                type="file"
                name="upload"
                id="upload"
                onChange={(e: any) => {
                  if(testcode_tenthat !== "XRF")
                  {
                    Swal.fire(
                      "Thông báo",
                      "Chọn test XRF để upload file",
                      "error",
                    );
                    return;
                  }
                  readUploadFile(e);
                }}
              />
            </label>}
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

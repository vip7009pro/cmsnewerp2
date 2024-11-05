import { Button, Checkbox, FormControlLabel, IconButton, Typography } from "@mui/material";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { AiFillFileExcel } from "react-icons/ai";
import Swal from "sweetalert2";
import { generalQuery, getAuditMode } from "../../../api/Api";
import { CustomResponsiveContainer, f_loadDTC_TestList, SaveExcel } from "../../../api/GlobalFunction";
import "./DKDTC.scss";
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
  Toolbar,
} from "devextreme-react/data-grid";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { CheckAddedSPECDATA, DTC_REG_DATA, TestListTable, UserData } from "../../../api/GlobalInterface";
import AGTable from "../../../components/DataTable/AGTable";
const DKDTC = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData,
  );
  const [testtype, setTestType] = useState("3");
  const [inputno, setInputNo] = useState("");
  const [checkNVL, setCheckNVL] = useState(
    userData?.SUBDEPTNAME === "IQC" ? true : false,
  );
  const [request_empl, setrequest_empl] = useState("");
  const [remark, setReMark] = useState("");
  const [testList, setTestList] = useState<TestListTable[]>([]);
  const [inspectiondatatable, setInspectionDataTable] = useState<Array<any>>(
    [],
  );
  const [empl_name, setEmplName] = useState("");
  const [reqDeptCode, setReqDeptCode] = useState("");
  const [showdkbs, setShowDKBS] = useState(false);
  const [oldDTC_ID, setOldDTC_ID] = useState(-1);
  const [g_name, setGName] = useState("");
  const [g_code, setGCode] = useState("");
  const [m_name, setM_Name] = useState("");
  const [m_code, setM_Code] = useState("");
  const [prodrequestno, setProdRequestNo] = useState("");
  const [prodreqdate, setProdReqDate] = useState("");
  const [addedSpec, setAddedSpec] = useState<CheckAddedSPECDATA[]>([]);
  const [trigger, setTrigger] = useState(false);  
  const dtcdatacolumn = [
    { field: 'DTC_ID', headerName: 'DTC_ID', resizable: true, width: 50 },
    { field: 'FACTORY', headerName: 'FACTORY', resizable: true, width: 50 },
    { field: 'TEST_FINISH_TIME', headerName: 'FINISH_TIME', resizable: true, width: 100 },
    { field: 'TEST_EMPL_NO', headerName: 'TEST_EMPL_NO', resizable: true, width: 100 },
    { field: 'G_CODE', headerName: 'G_CODE', resizable: true, width: 100 },
    { field: 'PROD_REQUEST_NO', headerName: 'PROD_REQUEST_NO', resizable: true, width: 100 },
    { field: 'G_NAME', headerName: 'G_NAME', resizable: true, width: 100 },
    { field: 'TEST_NAME', headerName: 'TEST_NAME', resizable: true, width: 100 },
    { field: 'TEST_TYPE_NAME', headerName: 'TEST_TYPE_NAME', resizable: true, width: 100 },
    { field: 'WORK_POSITION_NAME', headerName: 'WORK_POSITION_NAME', resizable: true, width: 100 },
    { field: 'REQUEST_DATETIME', headerName: 'REQUEST_DATETIME', resizable: true, width: 100 },
    { field: 'REQUEST_EMPL_NO', headerName: 'REQUEST_EMPL_NO', resizable: true, width: 100 },
    { field: 'M_NAME', headerName: 'M_NAME', resizable: true, width: 100 },
    { field: 'SIZE', headerName: 'SIZE', resizable: true, width: 100 },
    { field: 'REMARK', headerName: 'REMARK', resizable: true, width: 100 },
    { field: 'LOTCMS', headerName: 'LOTCMS', resizable: true, width: 100 },
  ]
  const getTestList = async () => {
    let tempList: TestListTable[] = await f_loadDTC_TestList();
    setTestList(tempList);
  }
  const kqdtcDataTableAG = useMemo(() => {
    return (
      <AGTable
        toolbar={
          <div>
          </div>}
        columns={dtcdatacolumn}
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
  const handletraDTCData = () => {
    generalQuery("loadrecentRegisteredDTCData", {})
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: DTC_REG_DATA[] = response.data.data.map(
            (element: DTC_REG_DATA, index: number) => {
              return {
                ...element,
                G_NAME: getAuditMode() == 0 ? element.G_NAME : element.G_NAME?.search('CNDB') == -1 ? element.G_NAME : 'TEM_NOI_BO',
                TEST_FINISH_TIME:
                  element.TEST_FINISH_TIME === "1900-01-01T00:00:00.000Z" ||
                    element.TEST_FINISH_TIME === null
                    ? ""
                    : moment(element.TEST_FINISH_TIME)
                      .utc()
                      .format("YYYY-MM-DD HH:mm:ss"),
                REQUEST_DATETIME:
                  element.REQUEST_DATETIME === "1900-01-01T00:00:00.000Z" ||
                    element.REQUEST_DATETIME === null
                    ? ""
                    : moment(element.REQUEST_DATETIME)
                      .utc()
                      .format("YYYY-MM-DD HH:mm:ss"),
                id: index,
              };
            },
          );
          setInspectionDataTable(loadeddata);
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
            response.data.data[0].FIRST_NAME,
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
  const checkYCSX = (PROD_REQUEST_NO: string) => {
    generalQuery("ycsx_fullinfo", { PROD_REQUEST_NO: PROD_REQUEST_NO })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);
          setProdRequestNo(PROD_REQUEST_NO);
          setGName(response.data.data[0].G_NAME);
          setProdReqDate(response.data.data[0].PROD_REQUEST_DATE);
          setGCode(response.data.data[0].G_CODE);
          checkAddedSpec("", response.data.data[0].G_CODE);
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
  const checkLotNVL = (M_LOT_NO: string) => {
    generalQuery("checkMNAMEfromLotI222", { M_LOT_NO: M_LOT_NO })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);
          setM_Name(
            response.data.data[0].M_NAME +
            " | " +
            response.data.data[0].WIDTH_CD,
          );
          setM_Code(response.data.data[0].M_CODE);
          checkAddedSpec(response.data.data[0].M_CODE, "");
        } else {
          setM_Name("");
          setM_Code("");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getLastDTC_ID = async () => {
    let nextid: number = 0;
    await generalQuery("getLastDTCID", {})
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);
          nextid = response.data.data[0].LAST_DCT_ID + 1;
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return nextid;
  };
  const checkLabelID = (LABEL_ID: string) => {
    generalQuery("checkLabelID2", { LABEL_ID2: LABEL_ID })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);
          setProdRequestNo(response.data.data[0].PROD_REQUEST_NO);
          setGName(response.data.data[0].G_NAME);
          setProdReqDate(response.data.data[0].PROD_REQUEST_DATE);
          setGCode(response.data.data[0].G_CODE);
          checkAddedSpec("", response.data.data[0].G_CODE);
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
  const registerDTC = async () => {
    let err_code: string = "";
    let nextDTC_ID: number = await getLastDTC_ID();
    for (let i = 0; i < testList.length; i++) {
      if (testList[i].SELECTED) {
        let data = {
          DTC_ID: showdkbs ? oldDTC_ID : nextDTC_ID,
          TEST_CODE: testList[i].TEST_CODE,
          TEST_TYPE_CODE: testtype,
          REQUEST_DEPT_CODE: reqDeptCode,
          PROD_REQUEST_NO: checkNVL ? "1IG0008" : prodrequestno,
          M_LOT_NO: checkNVL ? inputno : "2101011325",
          PROD_REQUEST_DATE: checkNVL ? "20210916" : prodreqdate,
          REQUEST_EMPL_NO: request_empl,
          REMARK: remark,
          G_CODE: checkNVL ? "7A07540A" : g_code,
          M_CODE: checkNVL ? m_code : "B0000035",
        };
        //console.log(data);
        await generalQuery("registerDTCTest", data)
          // eslint-disable-next-line no-loop-func
          .then((response) => {
            if (response.data.tk_status !== "NG") {
            } else {
              err_code += "Lỗi: " + response.data.message + " ";
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
    if (err_code === "") {
      let final_ID: number = showdkbs ? oldDTC_ID : nextDTC_ID;
      Swal.fire(
        "Thông báo",
        "Đăng ký ĐTC thành công, ID test là: " + final_ID,
        "success",
      );
      setGCode("");
      setGName("");
      setrequest_empl("");
      handletraDTCData();
    } else {
      Swal.fire("Thông báo", "Đăng ký ĐTC thất bại: " + err_code, "error");
    }
  };
  const checkInput = (): boolean => {
    if (inputno !== "" && request_empl !== "") {
      return true;
    } else {
      return false;
    }
  };
  const checkAddedSpec = (
    m_code: string | undefined,
    g_code: string | undefined,
  ) => {
    generalQuery("checkAddedSpec", {
      M_CODE: checkNVL ? m_code : "B0000035",
      G_CODE: checkNVL ? "7A07540A" : g_code,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);
          setAddedSpec(response.data.data);
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    handletraDTCData();
    getTestList();
  }, []);
  return (
    <div className="dkdtc">
      <div className="tracuuDataInspection">
        <div className="maintable">
          <div className="tracuuDataInspectionform" style={{ backgroundImage: theme.CMS.backgroundImage }}>
            <b style={{ color: "blue" }}>
              {checkNVL
                ? "ĐĂNG KÝ TEST LIỆU (IQC)"
                : "ĐĂNG KÝ TEST SẢN PHẨM (PQC/OQC)"}
            </b>
            <div className="forminput">
              <div className="forminputcolumn">
                <b>Phân loại test</b>
                <label>
                  <select
                    name="phanloaihang"
                    value={testtype}
                    onChange={(e) => {
                      setTestType(e.target.value);
                    }}
                  >
                    <option value="1">FIRST_LOT</option>
                    <option value="2">ECN</option>
                    <option value="3">MASS PRODUCTION</option>
                    <option value="4">SAMPLE</option>
                  </select>
                </label>
                <b>{checkNVL ? "LOT NVL CMS" : "YCSX/LABEL_ID"}</b>{" "}
                <label>
                  <input
                    type="text"
                    placeholder={checkNVL ? "202304190123" : "1F80008/13AB19S5"}
                    value={inputno}
                    onChange={(e) => {
                      if (e.target.value.length >= 7) {
                        if (checkNVL) {
                          console.log(e.target.value);
                          checkLotNVL(e.target.value);
                        } else {
                          if (e.target.value.length === 7) {
                            checkYCSX(e.target.value);
                          } else if (e.target.value.length === 8) {
                            checkLabelID(e.target.value);
                          }
                        }
                      } else {
                        setAddedSpec([]);
                      }
                      setInputNo(e.target.value);
                    }}
                  ></input>
                </label>
                <span
                  style={{ fontSize: 15, fontWeight: "bold", color: "blue" }}
                >
                  {checkNVL ? m_name : g_name}
                </span>
                <b>Mã nhân viên yêu cầu test</b>
                <label>
                  <input
                    type="text"
                    placeholder={"NHU1903"}
                    value={request_empl}
                    onChange={(e) => {
                      if (e.target.value.length >= 7) {
                        checkEMPL_NAME(e.target.value);
                      }
                      setrequest_empl(e.target.value);
                    }}
                  ></input>
                </label>
                <span
                  style={{ fontSize: 15, fontWeight: "bold", color: "blue" }}
                >
                  {empl_name}
                </span>
              </div>
              <div className="forminputcolumn">
                <b>Hạng mục test</b>
                <label>
                  <div className="checkboxarray">
                    {testList.map((element: TestListTable, index: number) => {
                      return (
                        <FormControlLabel
                          key={index}
                          style={{ fontSize: 5 }}
                          label={
                            <Typography
                              style={{
                                fontSize: 13,
                                color:
                                  addedSpec[index]?.CHECKADDED === null ||
                                    addedSpec[index]?.CHECKADDED === undefined
                                    ? "black"
                                    : "blue",
                              }}
                            >
                              {element.TEST_NAME}
                            </Typography>
                          }
                          sx={{ fontSize: 5 }}
                          control={
                            <Checkbox
                              classes={{ root: "custom-checkbox-root" }}
                              name={element.TEST_CODE.toString()}
                              key={element.TEST_CODE}
                              checked={element.SELECTED}                             
                              onChange={(
                                event: React.ChangeEvent<HTMLInputElement>,
                              ) => {
                                let selected_test: CheckAddedSPECDATA[] =
                                  addedSpec.filter(
                                    (
                                      element: CheckAddedSPECDATA,
                                      index: number,
                                    ) => {
                                      return (
                                        element.TEST_CODE.toString() ===
                                        event.target.name
                                      );
                                    },
                                  );
                                if (selected_test[0].CHECKADDED === null) {
                                  Swal.fire(
                                    "Thông báo",
                                    "Hạng mục " +
                                    element.TEST_NAME +
                                    " chưa add spec ko thể đăng ký test được, hãy add spec trước",
                                    "error",
                                  );
                                } else {
                                  let temp_testList = testList.map(
                                    (element: TestListTable, index: number) => {
                                      if (
                                        element.TEST_CODE.toString() === event.target.name
                                      ) {
                                        return {
                                          ...element,
                                          SELECTED: !element.SELECTED,
                                        };
                                      } else {
                                        return {
                                          ...element,
                                        };
                                      }
                                    },
                                  );
                                  setTestList(temp_testList);
                                }
                              }}
                            />
                          }
                        />
                      );
                    })}
                  </div>
                </label>
              </div>
              <div className="forminputcolumn">
                {showdkbs && <label>
                  <b>ID Test đã có</b>
                  <input
                    type="text"
                    placeholder={"Ghi chú"}
                    value={oldDTC_ID}
                    onChange={(e) => {
                      setOldDTC_ID(Number(e.target.value));
                    }}
                  ></input>
                </label>}
                <label>
                  <b>Đăng ký bổ sung</b>
                  <input
                    type="checkbox"
                    name="alltimecheckbox"
                    checked={showdkbs}
                    onChange={() => {
                      setShowDKBS(!showdkbs);
                    }}
                  ></input>
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
              <label>
                <b>{checkNVL === true ? "Swap" : "Swap"}:</b>
                <input
                  type="checkbox"
                  name="alltimecheckbox"
                  defaultChecked={checkNVL}
                  onChange={() => {
                    setCheckNVL(!checkNVL);
                  }}
                ></input>
              </label>
              {/* <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#f3db55', color: 'black' }} onClick={() => {
                let temp_testList = testList.map((e) => {
                  return {
                    ...e,
                    SELECTED: false,
                  };
                });
                console.log('temp_testList', temp_testList);
                setTestList(temp_testList);
                setTrigger(prev => !prev);
              }}>Reset hạng mục</Button> */}
              <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#18a70b' }} onClick={() => {
                if (checkInput()) {
                  registerDTC();
                } else {
                  Swal.fire(
                    "Thông báo",
                    "Hãy nhập đủ thông tin trước khi đăng ký",
                    "error",
                  );
                }
              }}>Đăng ký TEST</Button>
            </div>
            <div
              className="formbutton"
              style={{ marginTop: "20px", display: "flex", flexWrap: "wrap" }}
            ></div>
          </div>
          <div className="tracuuYCSXTable">{kqdtcDataTableAG}</div>
        </div>
      </div>
    </div>
  );
};
export default DKDTC;

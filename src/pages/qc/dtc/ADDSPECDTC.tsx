import { Button, Autocomplete, TextField, createFilterOptions } from "@mui/material";
import moment from "moment";
import { useEffect, useMemo, useState, useTransition } from "react";
import Swal from "sweetalert2";
import { generalQuery, getAuditMode, getCompany } from "../../../api/Api";
import "./ADDSPECTDTC.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  UserData,
} from "../../../api/GlobalInterface";
import AGTable from "../../../components/DataTable/AGTable";
import { CheckAddedSPECDATA, DTC_ADD_SPEC_DATA, MaterialListData, TestListTable } from "../interfaces/qcInterface";
import { CodeListData } from "../../kinhdoanh/interfaces/kdInterface";
import { f_loadDTC_TestList } from "../utils/qcUtils";
/* import { Autocomplete } from 'devextreme-react'; */
const ADDSPECTDTC = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [testList, setTestList] = useState<TestListTable[]>([]);
  const [addedSpec, setAddedSpec] = useState<CheckAddedSPECDATA[]>([]);
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
  const [isPending, startTransition] = useTransition();
  const [codeList, setCodeList] = useState<CodeListData[]>([]);
  const [selectedCode, setSelectedCode] = useState<CodeListData | null>({
    G_CODE: "7C03925A",
    G_NAME: "GH63-18084A_A_SM-A515F",
    PROD_LAST_PRICE: 0.318346,
    USE_YN: "Y",
  });
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData,
  );
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [codeKD, setCodeKD] = useState("");
  const [codeCMS, setCodeCMS] = useState("");
  const [testname, setTestName] = useState("0");
  const [testtype, setTestType] = useState("0");
  const [prodrequestno, setProdRequestNo] = useState("");
  const [checkNVL, setCheckNVL] = useState(
    userData?.SUBDEPTNAME === "IQC" ? true : false,
  );
  const [id, setID] = useState("");
  const [inspectiondatatable, setInspectionDataTable] = useState<Array<any>>(
    [],
  );
  const [m_name, setM_Name] = useState("");
  const [selectedRowsData, setSelectedRowsData] = useState<
    Array<DTC_ADD_SPEC_DATA>
  >([]);
  const getcodelist = (G_NAME: string) => {
    generalQuery("selectcodeList", { G_NAME: G_NAME })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          if (!isPending) {
            startTransition(() => {
              setCodeList(response.data.data);
            });
          }
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getmateriallist = () => {
    generalQuery("getMaterialList", {})
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);
          setMaterialList(response.data.data);
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handletraDTCData = (test_name: string) => {
    generalQuery("checkSpecDTC", {
      checkNVL: checkNVL,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      G_CODE: checkNVL === true ? "" : selectedCode?.G_CODE,
      G_NAME: codeKD,
      M_NAME: m_name,
      M_CODE: checkNVL === true ? selectedMaterial?.M_CODE : "",
      TEST_NAME: test_name,
      PROD_REQUEST_NO: prodrequestno,
      TEST_TYPE: testtype,
      ID: id,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: DTC_ADD_SPEC_DATA[] = response.data.data.map(
            (element: DTC_ADD_SPEC_DATA, index: number) => {
              return {
                ...element,
                G_NAME: getAuditMode() == 0 ? element?.G_NAME : element?.G_NAME?.search('CNDB') == -1 ? element?.G_NAME : 'TEM_NOI_BO',
                id: index,
              };
            },
          );
          setInspectionDataTable(loadeddata);
          Swal.fire(
            "Thông báo",
            "Đã load " + response.data.data.length + " dòng",
            "success",
          );
          checkAddedSpec(selectedMaterial?.M_CODE, selectedCode?.G_CODE);
        } else {
          generalQuery("checkSpecDTC2", {
            checkNVL: checkNVL,
            FROM_DATE: fromdate,
            TO_DATE: todate,
            G_CODE: checkNVL === true ? "" : selectedCode?.G_CODE,
            G_NAME: codeKD,
            M_NAME: m_name,
            M_CODE: checkNVL === true ? selectedMaterial?.M_CODE : "",
            TEST_NAME: test_name,
            PROD_REQUEST_NO: prodrequestno,
            TEST_TYPE: testtype,
            ID: id,
          })
            .then((response) => {
              //console.log(response.data.data);
              if (response.data.tk_status !== "NG") {
                const loadeddata: DTC_ADD_SPEC_DATA[] = response.data.data.map(
                  (element: DTC_ADD_SPEC_DATA, index: number) => {
                    return {
                      ...element,
                      id: index,
                    };
                  },
                );
                if (checkNVL && test_name === "1") {
                  let temp_loaded: DTC_ADD_SPEC_DATA[] = [];
                  setInspectionDataTable([...temp_loaded, loadeddata[0]]);
                  Swal.fire(
                    "Thông báo",
                    "Chưa có SPEC, Đã load bảng trắng để nhập 1 dòng",
                    "warning",
                  );
                } else {
                  setInspectionDataTable(loadeddata);
                  Swal.fire(
                    "Thông báo",
                    "Chưa có SPEC, Đã load bảng trắng để nhập " +
                    response.data.data.length +
                    " dòng",
                    "warning",
                  );
                }
                checkAddedSpec(selectedMaterial?.M_CODE, selectedCode?.G_CODE);
              } else {
                setInspectionDataTable([]);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleInsertSpec = async () => {
    Swal.fire({
      title: "Insert SPEC",
      text: "Đang Insert SPEC",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });
    if (testname === "0") {
      Swal.fire("Thông báo", "Hãy chọn một hạng mục test bất kỳ", "error");
    } else {
      if (!checkNVL) {
        let err_code: string = "";
        for (let i = 0; i < inspectiondatatable.length; i++) {
          await generalQuery("insertSpecDTC", {
            checkNVL: checkNVL,
            G_CODE: selectedCode?.G_CODE,
            M_CODE: "B0000035",
            TEST_CODE: testname,
            POINT_CODE: inspectiondatatable[i].POINT_CODE,
            PRI: inspectiondatatable[i].PRI,
            CENTER_VALUE: inspectiondatatable[i].CENTER_VALUE,
            UPPER_TOR: inspectiondatatable[i].UPPER_TOR,
            LOWER_TOR: inspectiondatatable[i].LOWER_TOR,
            BARCODE_CONTENT:
              inspectiondatatable[i].BARCODE_CONTENT === undefined
                ? ""
                : inspectiondatatable[i].BARCODE_CONTENT,
            REMARK:
              inspectiondatatable[i].REMARK === undefined
                ? ""
                : inspectiondatatable[i].REMARK,
          })
            // eslint-disable-next-line no-loop-func
            .then((response) => {
              //console.log(response.data.data);
              if (response.data.tk_status !== "NG") {
              } else {
                err_code +=
                  " Lỗi: " +
                  inspectiondatatable[i].TEST_CODE +
                  "| " +
                  inspectiondatatable[i].POINT_CODE +
                  " : " +
                  response.data.message;
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
        if (err_code !== "") {
          Swal.fire("Thông báo: ", "Có lỗi : " + err_code, "error");
        } else {
          Swal.fire("Thông báo: ", "Add SPEC thành công", "success");
        }
      } else {
        let mCodeList: { M_CODE: string; WIDTH_CD: number }[] = materialList
          .filter((element: MaterialListData) => {
            return element.M_NAME === selectedMaterial?.M_NAME;
          })
          .map((ele2: MaterialListData) => {
            return {
              M_CODE: ele2.M_CODE,
              WIDTH_CD: ele2.WIDTH_CD,
            };
          });
        let err_code: string = "";
        for (let j = 0; j < mCodeList.length; j++) {
          for (let i = 0; i < inspectiondatatable.length; i++) {
            await generalQuery("insertSpecDTC", {
              checkNVL: checkNVL,
              G_CODE: "7A07540A",
              M_CODE: mCodeList[j].M_CODE,
              TEST_CODE: testname,
              POINT_CODE: inspectiondatatable[i].POINT_CODE,
              PRI: inspectiondatatable[i].PRI,
              CENTER_VALUE:
                testname === "1"
                  ? mCodeList[j].WIDTH_CD
                  : inspectiondatatable[i].CENTER_VALUE,
              UPPER_TOR: inspectiondatatable[i].UPPER_TOR,
              LOWER_TOR: inspectiondatatable[i].LOWER_TOR,
              BARCODE_CONTENT:
                inspectiondatatable[i].BARCODE_CONTENT === undefined
                  ? ""
                  : inspectiondatatable[i].BARCODE_CONTENT,
              REMARK:
                inspectiondatatable[i].REMARK === undefined
                  ? ""
                  : inspectiondatatable[i].REMARK,
            })
              // eslint-disable-next-line no-loop-func
              .then((response) => {
                //console.log(response.data.data);
                if (response.data.tk_status !== "NG") {
                } else {
                  err_code +=
                    " Lỗi: " +
                    inspectiondatatable[i].TEST_CODE +
                    "| " +
                    inspectiondatatable[i].POINT_CODE +
                    " : " +
                    response.data.message;
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
        }
        if (err_code !== "") {
          Swal.fire("Thông báo: ", "Có lỗi : " + err_code, "error");
        } else {
          Swal.fire("Thông báo: ", "Add SPEC thành công", "success");
        }
      }
      checkAddedSpec(selectedMaterial?.M_CODE, selectedCode?.G_CODE);
    }
  };
  const handleUpdateSpec = async () => {
    Swal.fire({
      title: "Update SPEC",
      text: "Đang Update SPEC",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });
    if (testname === "0") {
      Swal.fire("Thông báo", "Hãy chọn một hạng mục test bất kỳ", "error");
    } else if (selectedRowsData.length < 1) {
      Swal.fire("Thông báo", "Chọn ít nhất một dòng để update", "error");
    } else {
      if (!checkNVL) {
        let err_code: string = "";
        for (let i = 0; i < selectedRowsData.length; i++) {
          await generalQuery("updateSpecDTC", {
            checkNVL: checkNVL,
            G_CODE: selectedCode?.G_CODE,
            M_CODE: "B0000035",
            TEST_CODE: testname,
            POINT_CODE: selectedRowsData[i].POINT_CODE,
            PRI: selectedRowsData[i].PRI,
            CENTER_VALUE: selectedRowsData[i].CENTER_VALUE,
            UPPER_TOR: selectedRowsData[i].UPPER_TOR,
            LOWER_TOR: selectedRowsData[i].LOWER_TOR,
            BARCODE_CONTENT: selectedRowsData[i].BARCODE_CONTENT,
            REMARK: selectedRowsData[i].REMARK,
          })
            // eslint-disable-next-line no-loop-func
            .then((response) => {
              //console.log(response.data.data);
              if (response.data.tk_status !== "NG") {
              } else {
                err_code +=
                  " Lỗi: " +
                  inspectiondatatable[i].TEST_CODE +
                  "| " +
                  inspectiondatatable[i].POINT_CODE +
                  " : " +
                  response.data.message;
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
        if (err_code !== "") {
          Swal.fire("Thông báo: ", "Có lỗi : " + err_code, "error");
        } else {
          Swal.fire("Thông báo: ", "Add SPEC thành công", "success");
        }
      } else {
        let mCodeList: { M_CODE: string; WIDTH_CD: number }[] = materialList
          .filter((element: MaterialListData) => {
            return element.M_NAME === selectedMaterial?.M_NAME;
          })
          .map((ele2: MaterialListData) => {
            return {
              M_CODE: ele2.M_CODE,
              WIDTH_CD: ele2.WIDTH_CD,
            };
          });
        let err_code: string = "";
        for (let j = 0; j < mCodeList.length; j++) {
          for (let i = 0; i < selectedRowsData.length; i++) {
            await generalQuery("updateSpecDTC", {
              checkNVL: checkNVL,
              G_CODE: "7A07540A",
              M_CODE: mCodeList[j].M_CODE,
              TEST_CODE: testname,
              POINT_CODE: selectedRowsData[i].POINT_CODE,
              PRI: selectedRowsData[i].PRI,
              CENTER_VALUE:
                testname === "1"
                  ? mCodeList[j].WIDTH_CD
                  : selectedRowsData[i].CENTER_VALUE,
              UPPER_TOR: selectedRowsData[i].UPPER_TOR,
              LOWER_TOR: selectedRowsData[i].LOWER_TOR,
              BARCODE_CONTENT: selectedRowsData[i].BARCODE_CONTENT,
              REMARK: selectedRowsData[i].REMARK,
            })
              // eslint-disable-next-line no-loop-func
              .then((response) => {
                //console.log(response.data.data);
                if (response.data.tk_status !== "NG") {
                } else {
                  err_code +=
                    " Lỗi: " +
                    inspectiondatatable[i].TEST_CODE +
                    "| " +
                    inspectiondatatable[i].POINT_CODE +
                    " : " +
                    response.data.message;
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
        }
        if (err_code !== "") {
          Swal.fire("Thông báo: ", "Có lỗi : " + err_code, "error");
        } else {
          Swal.fire("Thông báo: ", "Add SPEC thành công", "success");
        }
      }
      checkAddedSpec(selectedMaterial?.M_CODE, selectedCode?.G_CODE);
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
  const copyXRFSpec = async (
    m_code: string | undefined,
    g_code: string | undefined,
  ) => {
    let listM_CODE_SAME_M_NAME: string[] = [];
    listM_CODE_SAME_M_NAME = materialList.filter((element: MaterialListData) => {
      return element.M_NAME === selectedMaterial?.M_NAME;
    }).map((ele2: MaterialListData) => {
      return ele2.M_CODE;
    });
    if(!checkNVL){
      generalQuery("copyXRFSpec", {
        M_CODE: checkNVL ? m_code : "B0000035",
        G_CODE: checkNVL ? "7A07540A" : g_code,
      })
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            //console.log(response.data.data);
            //setAddedSpec(response.data.data);
            Swal.fire("Thông báo: ", "Copy XRF Spec thành công", "success");
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });
      
    }else{
      for(let i = 0; i < listM_CODE_SAME_M_NAME.length; i++){
        generalQuery("copyXRFSpec", {
          M_CODE: checkNVL ? listM_CODE_SAME_M_NAME[i] : "B0000035",
          G_CODE: checkNVL ? "7A07540A" : g_code,
        })
          .then((response) => {
            if (response.data.tk_status !== "NG") {
              //console.log(response.data.data);
              //setAddedSpec(response.data.data);
              Swal.fire("Thông báo: ", "Copy XRF Spec thành công", "success");
            } else {
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } 
      
    }
   
  };

  const copyXRFSpecSDI = (
    m_code: string | undefined,
    g_code: string | undefined,
  ) => {
    let listM_CODE_SAME_M_NAME: string[] = [];
    listM_CODE_SAME_M_NAME = materialList.filter((element: MaterialListData) => {
      return element.M_NAME === selectedMaterial?.M_NAME;
    }).map((ele2: MaterialListData) => {
      return ele2.M_CODE;
    });
    if(!checkNVL){
      generalQuery("copyXRFSpecSDI", {
        M_CODE: checkNVL ? m_code : "B0000035",
        G_CODE: checkNVL ? "7A07540A" : g_code,
      })
        .then((response) => {
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);
          //setAddedSpec(response.data.data);
          Swal.fire("Thông báo: ", "Copy XRF Spec thành công", "success");
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
    }else{
      for(let i = 0; i < listM_CODE_SAME_M_NAME.length; i++){
        generalQuery("copyXRFSpecSDI", {            
          M_CODE: checkNVL ? listM_CODE_SAME_M_NAME[i] : "B0000035",
          G_CODE: checkNVL ? "7A07540A" : g_code,

        })
          .then((response) => {
            if (response.data.tk_status !== "NG") {
              //console.log(response.data.data);
              //setAddedSpec(response.data.data);
              Swal.fire("Thông báo: ", "Copy XRF Spec thành công", "success");
            } else {
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } 
      
    }
  };
  const filterOptions1 = createFilterOptions({
    matchFrom: "any",
    limit: 100,
  });
  const getTestList = async () => {
    let tempList: TestListTable[] = await f_loadDTC_TestList();
    tempList.unshift({ TEST_CODE: 0, TEST_NAME: 'ALL', SELECTED: false, })
    setTestList(tempList);
  }
  const dtcSpecColumn = [
    { field: 'CUST_NAME_KD', headerName: 'CUST_NAME_KD', resizable: true, width: 100, checkboxSelection: true , headerCheckboxSelection: true },
    { field: 'G_CODE', headerName: 'G_CODE', resizable: true, width: 100 },
    { field: 'G_NAME', headerName: 'G_NAME', resizable: true, width: 100 },
    { field: 'M_CODE', headerName: 'M_CODE', resizable: true, width: 100 },
    { field: 'M_NAME', headerName: 'M_NAME', resizable: true, width: 100 },
    { field: 'WIDTH_CD', headerName: 'WIDTH_CD', resizable: true, width: 100 },
    { field: 'TEST_CODE', headerName: 'TEST_CODE', resizable: true, width: 100 },
    { field: 'TEST_NAME', headerName: 'TEST_NAME', resizable: true, width: 100 },
    { field: 'POINT_CODE', headerName: 'POINT_CODE', resizable: true, width: 100 },
    { field: 'POINT_NAME', headerName: 'POINT_NAME', resizable: true, width: 100 },
    { field: 'PRI', headerName: 'PRI', resizable: true, width: 100 },
    { field: 'CENTER_VALUE', headerName: 'CENTER_VALUE', resizable: true, width: 100 },
    { field: 'LOWER_TOR', headerName: 'LOWER_TOR', resizable: true, width: 100 },
    { field: 'UPPER_TOR', headerName: 'UPPER_TOR', resizable: true, width: 100 },
    { field: 'BARCODE_CONTENT', headerName: 'BARCODE_CONTENT', resizable: true, width: 100 },
    { field: 'REMARK', headerName: 'REMARK', resizable: true, width: 100 },
    { field: 'TDS', headerName: 'TDS', resizable: true, width: 100 },
    { field: 'BANVE', headerName: 'BANVE', resizable: true, width: 100 },
  ]
  const spectDTCTable = useMemo(() => {
    return (
      <AGTable
      suppressRowClickSelection = {false}
        toolbar={
          <div>
          </div>}
        columns={dtcSpecColumn}
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
  useEffect(() => {
    getcodelist("");
    getmateriallist();
    getTestList();
  }, []);
  return (
    <div className="addspecdtc">
      <div className="tracuuDataInspection" >
        <div className="tracuuDataInspectionform" style={{ backgroundImage: theme.CMS.backgroundImage }}>
          <b style={{ color: "blue" }}>
            {checkNVL
              ? "ADD SPEC ĐTC NVL (IQC)"
              : "ADD SPEC ĐTC SẢN PHẨM (RND)"}
          </b>
          <br></br>
          <div className="forminput">
            <div className="forminputcolumn">
              <div className="label">
                <b>Code/Liệu</b>
              </div>
              <div className="inputbox">
                {!checkNVL && (
                  <Autocomplete
                    sx={{ fontSize: "0.7rem", width: "240px", padding: 0 }}
                    hidden={checkNVL}
                    disabled={checkNVL}
                    size="small"
                    disablePortal
                    options={codeList}
                    className="autocomplete"
                    filterOptions={filterOptions1}
                    isOptionEqualToValue={(option: any, value: any) =>
                      option.G_CODE === value.G_CODE
                    }
                    getOptionLabel={(option: any) =>
                      `${option.G_CODE}: ${option.G_NAME}`
                    }
                    renderInput={(params) => <TextField {...params} />}
                    onChange={(event: any, newValue: any) => {
                      //console.log(newValue);
                      //checkAddedSpec(undefined, selectedCode?.G_CODE);
                      //handletraDTCData(testname);
                      setSelectedCode(newValue);
                    }}
                    value={selectedCode}
                  />
                )}
                {checkNVL && (
                  <Autocomplete
                    sx={{ fontSize: "0.7rem", width: "240px", padding: 0 }}
                    hidden={!checkNVL}
                    disabled={!checkNVL}
                    size="small"
                    disablePortal
                    options={materialList}
                    className="autocomplete"
                    filterOptions={filterOptions1}
                    isOptionEqualToValue={(option: any, value: any) =>
                      option.M_CODE === value.M_CODE
                    }
                    getOptionLabel={(option: any) =>
                      `${option.M_NAME}|${option.WIDTH_CD}|${option.M_CODE}`
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Chọn NVL" />
                    )}
                    defaultValue={{
                      M_CODE: "A0007770",
                      M_NAME: "SJ-203020HC",
                      WIDTH_CD: 208,
                    }}
                    value={selectedMaterial}
                    onChange={(event: any, newValue: any) => {
                      //console.log(newValue);
                      //checkAddedSpec(newValue?.M_CODE, undefined);
                      //handletraDTCData(testname);
                      setSelectedMaterial(newValue);
                    }}
                  />
                )}
              </div>
            </div>
            <div className="forminputcolumn">
              <div className="label">
                <b>Hạng mục test</b>
              </div>
              <div className="inputbox">
                <select
                  name="hangmuctest"
                  value={testname}
                  onChange={(e) => {
                    setTestName(e.target.value);
                    handletraDTCData(e.target.value);
                    checkAddedSpec(
                      selectedMaterial?.M_CODE,
                      selectedCode?.G_CODE,
                    );
                  }}
                > {
                    testList.map((ele: TestListTable, index: number) => {
                      return (
                        <option key={index} value={ele.TEST_CODE}>{ele.TEST_NAME}</option>
                      )
                    })
                  }
                </select>
              </div>
            </div>
            <div className="forminputcolumn"></div>
          </div>
          <div className="formbutton">
            <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.6rem', padding: '3px', backgroundColor: '#bb8947' }} onClick={() => {
              handletraDTCData(testname);
              checkAddedSpec(selectedMaterial?.M_CODE, selectedCode?.G_CODE);
            }}>Load Spec</Button>
            <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.6rem', padding: '3px', backgroundColor: '#3cd446' }} onClick={() => {
              handleInsertSpec();
            }}>Add Spec</Button>
            <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.6rem', padding: '3px', backgroundColor: '#cb45e6' }} onClick={() => {
              handleUpdateSpec();
            }}>Update Spec</Button>
            
          </div>
          {(getCompany()==='CMS') &&<div className="copydiv" style={{ gap: '10px',display: "flex", alignItems:'center', justifyContent: "space-between", marginTop: "20px", marginBottom: "20px" }}>
          {(testname === "3") && <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.6rem', padding: '3px', backgroundColor: '#3642b6' }} onClick={() => {
              copyXRFSpec(selectedMaterial?.M_CODE, selectedCode?.G_CODE);
            }}>Copy XRF Spec SS</Button>}

          {(testname === "3") && <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.6rem', padding: '3px', backgroundColor: '#24ad96' }} onClick={() => {
              copyXRFSpecSDI(selectedMaterial?.M_CODE, selectedCode?.G_CODE);
            }}>Copy XRF Spec SDI</Button>}
          </div>  }       
          <div
            className="formbutton"
            style={{
              display: "flex",
              flexWrap: "wrap",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >
            {addedSpec.map((element: CheckAddedSPECDATA, index: number) => {
              return (
                <div key={index} style={{}}>
                  <span style={{ fontSize: 12 }}>{element.TEST_NAME}:</span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: element.CHECKADDED ? "bold" : "normal",
                      color: element.CHECKADDED ? "blue" : "red",
                    }}
                  >
                    {element.CHECKADDED ? "YES" : "NO"}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="formbutton">
            <label>
              <b>{checkNVL === true ? "Swap (SP)" : "Swap (NVL)"}:</b>
              <input
                type="checkbox"
                name="alltimecheckbox"
                defaultChecked={checkNVL}
                onChange={() => {
                  setCheckNVL(!checkNVL);
                  setAddedSpec([]);
                  setInspectionDataTable([]);
                }}
              ></input>
            </label>
          </div>
        </div>
        <div className="tracuuYCSXTable">{spectDTCTable}</div>
      </div>
    </div>
  );
};
export default ADDSPECTDTC;

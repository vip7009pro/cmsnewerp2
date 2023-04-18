import { Autocomplete, IconButton, TextField } from "@mui/material";
import moment from "moment";
import React, { useContext, useEffect, useState, useTransition } from "react";
import { AiFillFileExcel } from "react-icons/ai";
import Swal from "sweetalert2";
import { generalQuery } from "../../../api/Api";
import { UserContext } from "../../../api/Context";
import { SaveExcel } from "../../../api/GlobalFunction";
import "./DKDTC.scss";
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
interface DTC_ADD_SPEC_DATA {
  CUST_NAME_KD: string;
  G_CODE: string;
  G_NAME: string;
  TEST_CODE: number;
  POINT_CODE: number;
  TEST_NAME: string;
  POINT_NAME: string;
  PRI: number;
  CENTER_VALUE: number;
  UPPER_TOR: number;
  LOWER_TOR: number;
  BARCODE_CONTENT: string;
  REMARK: string;
  M_NAME: string;
  WIDTH_CD: number;
  M_CODE: string;
  TDS: string;
  BANVE: string;
}
interface CodeListData {
  G_CODE: string;
  G_NAME: string;
  PROD_LAST_PRICE: number;
  USE_YN: string;
}
interface MaterialListData {
  M_CODE: string;
  M_NAME: string;
  WIDTH_CD: number;
}
interface CheckAddedSPECDATA {
  TEST_CODE: number,
  TEST_NAME: string,
  CHECKADDED: number,
}
const DKDTC = () => {
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
  const [userData, setUserData] = useContext(UserContext);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [codeKD, setCodeKD] = useState("");
  const [codeCMS, setCodeCMS] = useState("");
  const [testname, setTestName] = useState("0");
  const [testtype, setTestType] = useState("0");
  const [prodrequestno, setProdRequestNo] = useState("");
  const [checkNVL, setCheckNVL] = useState(false);
  const [id, setID] = useState("");
  const [inspectiondatatable, setInspectionDataTable] = useState<Array<any>>(
    []
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
            console.log(e.selectedRowsData);
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
            allowDeleting={false}
            mode='batch'
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
          <Column dataField='CUST_NAME_KD' caption='CUST_NAME_KD'></Column>
          <Column dataField='G_CODE' caption='G_CODE'></Column>
          <Column dataField='G_NAME' caption='G_NAME' width={150}></Column>
          <Column dataField='TEST_NAME' caption='TEST_NAME'></Column>
          <Column dataField='POINT_NAME' caption='POINT_NAME'></Column>
          <Column dataField='PRI' caption='PRI'></Column>
          <Column
            dataField='CENTER_VALUE'
            caption='CENTER_VALUE'
            width={120}
          ></Column>
          <Column
            dataField='UPPER_TOR'
            caption='UPPER_TOR'
            width={120}
          ></Column>
          <Column
            dataField='LOWER_TOR'
            caption='LOWER_TOR'
            width={120}
          ></Column>
          <Column
            dataField='BARCODE_CONTENT'
            caption='BARCODE_CONTENT'
          ></Column>
          <Column dataField='REMARK' caption='REMARK'></Column>
          <Column dataField='M_NAME' caption='M_NAME' width={120}></Column>
          <Column dataField='WIDTH_CD' caption='WIDTH_CD'></Column>
          <Column dataField='M_CODE' caption='M_CODE'></Column>
          <Column
            caption='BANVE/TDS'
            width={150}
            cellRender={(e: any) => {
              if (e.data.M_CODE === "B0000035") {
                let link: string = `/banve/${e.data.G_CODE}.pdf`;
                if (e.data.BANVE === "Y") {
                  return (
                    <div
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        height: "20px",
                        width: "80px",
                        backgroundColor: "#54e00d",
                        textAlign: "center",
                      }}
                    >
                      <a href={link} target='_blank' rel='noopener noreferrer'>
                        Bản Vẽ
                      </a>
                    </div>
                  );
                } else {
                  return (
                    <div
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        height: "20px",
                        width: "80px",
                        backgroundColor: "gray",
                        textAlign: "center",
                      }}
                    >
                      Chưa có bản vẽ
                    </div>
                  );
                }
              } else {
                let link: string = `/tds/${e.data.M_CODE}.pdf`;
                if (e.data.TDS === "Y") {
                  return (
                    <div
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        height: "20px",
                        width: "80px",
                        backgroundColor: "red",
                        textAlign: "center",
                      }}
                    >
                      <a href={link} target='_blank' rel='noopener noreferrer'>
                        TDS
                      </a>
                    </div>
                  );
                } else {
                  return (
                    <div
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        height: "20px",
                        width: "80px",
                        backgroundColor: "gray",
                        textAlign: "center",
                      }}
                    >
                      Chưa có TDS
                    </div>
                  );
                }
              }
            }}
          ></Column>
          <Summary>
            <TotalItem
              alignment='right'
              column='G_CODE'
              summaryType='count'
              valueFormat={"decimal"}
            />
          </Summary>
        </DataGrid>
      </div>
    ),
    [inspectiondatatable]
  );
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
                id: index,
              };
            }
          );
          setInspectionDataTable(loadeddata);
          Swal.fire(
            "Thông báo",
            "Đã load " + response.data.data.length + " dòng",
            "success"
          );
          checkAddedSpec();
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
                  }
                );
                setInspectionDataTable(loadeddata);
                Swal.fire(
                  "Thông báo",
                  "Chưa có SPEC, Đã load bảng trắng để nhập " +
                    response.data.data.length +
                    " dòng",
                  "warning"
                );
                checkAddedSpec();
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
            BARCODE_CONTENT: inspectiondatatable[i].BARCODE_CONTENT,
            REMARK: inspectiondatatable[i].REMARK,
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
        let mCodeList: string[] = materialList
          .filter((element: MaterialListData) => {
            return element.M_NAME === selectedMaterial?.M_NAME;
          })
          .map((ele2: MaterialListData) => {
            return ele2.M_CODE;
          });
        let err_code: string = "";
        for (let j = 0; j < mCodeList.length; j++) {
          for (let i = 0; i < inspectiondatatable.length; i++) {
            await generalQuery("insertSpecDTC", {
              checkNVL: checkNVL,
              G_CODE: "7A07540A",
              M_CODE: mCodeList[j],
              TEST_CODE: testname,
              POINT_CODE: inspectiondatatable[i].POINT_CODE,
              PRI: inspectiondatatable[i].PRI,
              CENTER_VALUE: inspectiondatatable[i].CENTER_VALUE,
              UPPER_TOR: inspectiondatatable[i].UPPER_TOR,
              LOWER_TOR: inspectiondatatable[i].LOWER_TOR,
              BARCODE_CONTENT: inspectiondatatable[i].BARCODE_CONTENT,
              REMARK: inspectiondatatable[i].REMARK,
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
      checkAddedSpec();
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
        let mCodeList: string[] = materialList
          .filter((element: MaterialListData) => {
            return element.M_NAME === selectedMaterial?.M_NAME;
          })
          .map((ele2: MaterialListData) => {
            return ele2.M_CODE;
          });
        let err_code: string = "";
        for (let j = 0; j < mCodeList.length; j++) {
          for (let i = 0; i < selectedRowsData.length; i++) {
            await generalQuery("updateSpecDTC", {
              checkNVL: checkNVL,
              G_CODE: "7A07540A",
              M_CODE: mCodeList[j],
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
        }
        if (err_code !== "") {
          Swal.fire("Thông báo: ", "Có lỗi : " + err_code, "error");
        } else {
          Swal.fire("Thông báo: ", "Add SPEC thành công", "success");
        }
      }
      checkAddedSpec();
    }
  };
  const checkAddedSpec = () => {
    generalQuery("checkAddedSpec", { 
      M_CODE: checkNVL? selectedMaterial?.M_CODE: 'B0000035',
      G_CODE: checkNVL? '7A07540A' : selectedCode?.G_CODE
    })
    .then((response) => {
      if (response.data.tk_status !== "NG") { 
            setAddedSpec(response.data.data);
      }
        else
        {

        }
      } 
            
    )
    .catch((error) => {
      console.log(error);
    });
  }
  useEffect(() => {
    getcodelist("");
    getmateriallist();
  }, []);
  return (
    <div className='dkdtc'>
      <div className='tracuuDataInspection'>
      <div className="addedspec">
          {
            addedSpec.map((element: CheckAddedSPECDATA,index: number)=> {
              return (
                <div key={index} style={{fontSize:12,}}>{element.TEST_NAME}: <span style={{fontSize:10, fontWeight:'bold', backgroundColor: element.CHECKADDED? '#80ff00':'red'}}>{element.CHECKADDED? 'YES':'NO'}</span></div>
              )
            })
           }
          </div>
          <div className="maintable">
          <div className='tracuuDataInspectionform'>          
          <div className='forminput'>
            <div className='forminputcolumn'>
              {!checkNVL && (
                <label>
                  <Autocomplete
                    hidden={checkNVL}
                    disabled={checkNVL}
                    size='small'
                    disablePortal
                    options={codeList}
                    className='autocomplete'
                    isOptionEqualToValue={(option, value) =>
                      option.G_CODE === value.G_CODE
                    }
                    getOptionLabel={(option: CodeListData) =>
                      `${option.G_CODE}: ${option.G_NAME}`
                    }
                    renderInput={(params) => (
                      <TextField {...params} label='Chọn sản phẩm' />
                    )}
                    onChange={(event: any, newValue: CodeListData | null) => {
                      //console.log(newValue);
                      setSelectedCode(newValue);                      
                    }}
                    value={selectedCode}
                  />
                </label>
              )}
              {checkNVL && (
                <label>
                  <Autocomplete
                    hidden={!checkNVL}
                    disabled={!checkNVL}
                    size='small'
                    disablePortal
                    options={materialList}
                    className='autocomplete'
                    isOptionEqualToValue={(option, value) =>
                      option.M_CODE === value.M_CODE
                    }
                    getOptionLabel={(option: MaterialListData) =>
                      `${option.M_NAME}|${option.WIDTH_CD}|${option.M_CODE}`
                    }
                    renderInput={(params) => (
                      <TextField {...params} label='Chọn NVL' />
                    )}
                    defaultValue={{
                      M_CODE: "A0007770",
                      M_NAME: "SJ-203020HC",
                      WIDTH_CD: 208,
                    }}
                    value={selectedMaterial}
                    onChange={(
                      event: any,
                      newValue: MaterialListData | null
                    ) => {
                      console.log(newValue);
                      setSelectedMaterial(newValue);
                    }}
                  />
                </label>
              )}
            </div>
            <div className='forminputcolumn'>
              <label>
                <b>Hạng mục test</b>
                <br></br>
                <select
                  name='hangmuctest'
                  value={testname}
                  onChange={(e) => {
                    setTestName(e.target.value);
                    handletraDTCData(e.target.value);
                    checkAddedSpec();
                  }}
                >
                  <option value='0'>ALL</option>
                  <option value='1'>Kích thước</option>
                  <option value='2'>Kéo keo</option>
                  <option value='3'>XRF</option>
                  <option value='4'>Điện trở</option>
                  <option value='5'>Tĩnh điện</option>
                  <option value='6'>Độ bóng</option>
                  <option value='7'>Phtalate</option>
                  <option value='8'>FTIR</option>
                  <option value='9'>Mài mòn</option>
                  <option value='10'>Màu sắc</option>
                  <option value='11'>TVOC</option>
                  <option value='12'>Cân nặng</option>
                  <option value='13'>Scanbarcode</option>
                  <option value='14'>Nhiệt cao Ẩm cao</option>
                  <option value='15'>Shock nhiệt</option>
                  <option value='1002'>Kéo keo 2</option>
                </select>
              </label>
            </div>
            <div className='forminputcolumn'></div>
          </div>
          <div className='formbutton'>
            <label>
              <b>
                {checkNVL === true
                  ? "Swap"
                  : "Swap"}
                :
              </b>
              <input
                type='checkbox'
                name='alltimecheckbox'
                defaultChecked={checkNVL}
                onChange={() => {
                  setCheckNVL(!checkNVL);
                  setAddedSpec([]);
                  setInspectionDataTable([]);
                }}
              ></input>
            </label>
            <button
              className='tranhatky'
              onClick={() => {
                handletraDTCData(testname);
                checkAddedSpec();
              }}
            >
              Load SPEC
            </button>            
          </div>
          <div className='formbutton' style={{marginTop:'20px', display:'flex', flexWrap:'wrap'}}>            
          
          </div>
        </div>
        <div className='tracuuYCSXTable'>{materialDataTable}</div>

          </div>
       
      </div>
    </div>
  );
};
export default DKDTC;

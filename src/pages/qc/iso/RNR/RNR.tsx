import {
  Autocomplete,
  Button,
  IconButton,
  LinearProgress,
  TextField,
} from "@mui/material";
import {
  DataGrid,
  GridSelectionModel,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import moment from "moment";
import React, { useContext, useEffect, useState, useTransition } from "react";
import {
  AiFillFileExcel,
  AiOutlineCloudUpload,
  AiOutlinePrinter,
} from "react-icons/ai";
import Swal from "sweetalert2";
import "./RNR.scss";
import { SaveExcel } from "../../../../api/GlobalFunction";
import { generalQuery } from "../../../../api/Api";
import { RNR_DATA, RNR_DATA_EMPL } from "../../../../api/GlobalInterface";
const RNR = () => {
  const [readyRender, setReadyRender] = useState(true);
  const [isLoading, setisLoading] = useState(false);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [testID, setTestID] = useState("");
  const [empl_name, setEmpl_Name] = useState("");
  const [alltime, setAllTime] = useState(true);
  const [factory, setFactory] = useState("ALL");
  const [testType, setTestType] = useState("ALL");
  const [selectedData, setSelectedData] = useState("detail");
  const [rnrdatatable, setRNRDataTable] = useState<Array<any>>([]);
  const column_TRA_RNR_DATA = [
    { field: 'FACTORY', headerName: 'FACTORY', width: 80 },
    { field: 'FULL_NAME', headerName: 'FULL_NAME', width: 160 },
    { field: 'SUBDEPTNAME', headerName: 'SUBDEPTNAME', width: 100 },
    { field: 'TEST_EMPL_NO', headerName: 'TEST_EMPL_NO', width: 120 },
    { field: 'TEST_DATE', headerName: 'TEST_DATE', width: 100 },
    { field: 'TEST_ID', headerName: 'TEST_ID', width: 80 },
    { field: 'TEST_NO', headerName: 'TEST_NO', width: 80 },
    { field: 'TEST_TYPE', headerName: 'TEST_TYPE', width: 80 },
    { field: 'TEST_NUMBER', headerName: 'TEST_NUMBER', width: 110 },
    {
      field: 'TEST_RESULT1', headerName: 'TEST_RESULT1', width: 100, renderCell: (params: any) => {
        if (params.row.TEST_RESULT1 === params.row.RESULT_OK_NG) {
          return (
            <span style={{ color: "green", fontWeight: 'bold' }}>TRUE</span>
          );
        }
        else {
          return (
            <span style={{ color: "red", fontWeight: 'bold' }}>FALSE</span>
          );
        }
      },
    },
    { field: 'TEST_NUMBER2', headerName: 'TEST_NUMBER2', width: 110 },
    {
      field: 'TEST_REUST2', headerName: 'TEST_RESULT2', width: 100, renderCell: (params: any) => {
        if (params.row.TEST_REUST2 !== null) {
          if (params.row.TEST_REUST2 === params.row.RESULT_OK_NG) {
            return (
              <span style={{ color: "green", fontWeight: 'bold' }}>TRUE</span>
            );
          }
          else {
            return (
              <span style={{ color: "red", fontWeight: 'bold' }}>FALSE</span>
            );
          }
        }
        else {
          return (
            <span style={{ color: "gray", fontWeight: 'bold' }}>NA</span>
          );
        }
      },
    },
    { field: 'MIX1', headerName: 'MIX1', width: 80 },
    { field: 'MIX2', headerName: 'MIX2', width: 80 },
    { field: 'RESULT_OK_NG', headerName: 'RESULT_OK_NG', width: 150 },
    { field: 'RESULT_DETAIL', headerName: 'RESULT_DETAIL', width: 150 },
    { field: 'UPD_DATE', headerName: 'UPD_DATE', width: 150 },
    { field: 'UPD_EMPL', headerName: 'UPD_EMPL', width: 80 },
  ];
  const column_TRA_RNR_DATA_EMPL = [
    { field: 'id', headerName: 'STT', width: 80 },
    { field: 'FULL_NAME', headerName: 'FULL_NAME', width: 150 },
    { field: 'SUBDEPTNAME', headerName: 'SUBDEPTNAME', width: 80 },
    { field: 'TEST_ID', headerName: 'TEST_ID', width: 80 },
    { field: 'TEST_TYPE', headerName: 'TEST_TYPE', width: 80 },
    { field: 'TEST_NO', headerName: 'TEST_NO', width: 80 },
    { field: 'COUNT1', headerName: 'COUNT1', width: 80 },
    { field: 'COUNT2', headerName: 'COUNT2', width: 80 },
    { field: 'SO_CAU', headerName: 'SO_CAU', width: 80 },
    {
      field: 'SCORE1', headerName: 'SCORE1', width: 80, renderCell: (params: any) => {
        return (
          <span style={{ color: "blue", fontWeight: 'normal' }}>{params.row.SCORE1.toLocaleString('en-US', {
            style: "decimal",
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
          })}</span>
        );
      },
    },
    {
      field: 'SCORE2', headerName: 'SCORE2', width: 80, renderCell: (params: any) => {
        if(params.row.SCORE2 == -1)
        {
          return (
            <span style={{ color: "gray", fontWeight: 'normal' }}>N/A</span>
          );
        }
        else {
          return (
            <span style={{ color: "blue", fontWeight: 'normal' }}>{params.row.SCORE2.toLocaleString('en-US', {
              style: "decimal",
              maximumFractionDigits: 0,
              minimumFractionDigits: 0,
            })}</span>
          );
        }
        
      },
    },    
    { field: 'MIX1', headerName: 'MIX1', width: 80 },
    { field: 'MIX2', headerName: 'MIX2', width: 80 , renderCell: (params: any) => {
      if(params.row.MIX2 == -1)
      {
        return (
          <span style={{ color: "gray", fontWeight: 'normal' }}>N/A</span>
        );
      }
      else {
        return (
          <span>{params.row.MIX2.toLocaleString('en-US', {
            style: "decimal",
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
          })}</span>
        );
      }
      
    },}, 
    {
      field: 'JUDGE1', headerName: 'JUDGE1', width: 80, renderCell: (params: any) => {
        if (params.row.JUDGE1 === "PASS") {
          return (
            <span style={{ color: "green", fontWeight: 'bold' }}>PASS</span>
          );
        }
        else {
          return (
            <span style={{ color: "red", fontWeight: 'bold' }}>FAIL</span>
          );
        }
      },
    },
    {
      field: 'JUDGE2', headerName: 'JUDGE2', width: 80, renderCell: (params: any) => {
        if (params.row.JUDGE2 === "PASS") {
          return (
            <span style={{ color: "green", fontWeight: 'bold' }}>PASS</span>
          );
        }
        else if (params.row.JUDGE2 === "FAIL") {
          return (
            <span style={{ color: "red", fontWeight: 'bold' }}>FAIL</span>
          );
        }
        else {
          return (
            <span style={{ color: "gray", fontWeight: 'bold' }}>N/A</span>
          );
        }
      },
    }
  ];
  const [columnDefinition, setColumnDefinition] =
    useState<Array<any>>(column_TRA_RNR_DATA);
  function CustomToolbarPOTable() {
    return (
      <GridToolbarContainer>
        <IconButton
          className="buttonIcon"
          onClick={() => {
            SaveExcel(rnrdatatable, "Inspection Data Table");
          }}
        >
          <AiFillFileExcel color="green" size={15} />
          SAVE
        </IconButton>
        <GridToolbarQuickFilter />
      </GridToolbarContainer>
    );
  }
  const handletraRNRData = (selection: string) => {
    setisLoading(true);
    switch (selection) {
      case 'detail':
        setColumnDefinition(column_TRA_RNR_DATA);
        generalQuery("loadRNRchitiet", {
          ALLTIME: alltime,
          FROM_DATE: fromdate,
          TO_DATE: todate,
          EMPL_NAME: empl_name,
          FACTORY: factory,
          TEST_TYPE: testType,
          TEST_ID: testID
        })
          .then((response) => {
            //console.log(response.data.data);
            if (response.data.tk_status !== "NG") {
              const loadeddata: RNR_DATA[] = response.data.data.map(
                (element: RNR_DATA, index: number) => {
                  //summaryInput += element.INPUT_QTY_EA;
                  return {
                    ...element,
                    TEST_DATE: element.TEST_DATE !== null ? moment.utc(element.TEST_DATE).format("YYYY-MM-DD") : '',
                    UPD_DATE: element.UPD_DATE !== null ? moment.utc(element.UPD_DATE).format("YYYY-MM-DD HH:mm:ss") : '',
                    id: index,
                  };
                },
              );
              //setSummaryInspect('Tổng Nhập: ' +  summaryInput.toLocaleString('en-US') + 'EA');
              setRNRDataTable(loadeddata);
              setReadyRender(true);
              setisLoading(false);
              Swal.fire(
                "Thông báo",
                "Đã load " + response.data.data.length + " dòng",
                "success",
              );
            } else {
              Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
              setisLoading(false);
            }
          })
          .catch((error) => {
            console.log(error);
          });
        break;
      case 'summaryByEmpl':
        setColumnDefinition(column_TRA_RNR_DATA_EMPL);
        generalQuery("RnRtheonhanvien", {
          ALLTIME: alltime,
          FROM_DATE: fromdate,
          TO_DATE: todate,
          EMPL_NAME: empl_name,
          FACTORY: factory,
          TEST_TYPE: testType,
          TEST_ID: testID
        })
          .then((response) => {
            //console.log(response.data.data);
            if (response.data.tk_status !== "NG") {
              const loadeddata: RNR_DATA_EMPL[] = response.data.data.map(
                (element: RNR_DATA_EMPL, index: number) => {
                  //summaryInput += element.INPUT_QTY_EA;
                  return {
                    ...element,
                    SCORE2: element.TEST_TYPE !=='G_RNR'? -1 : element.SCORE2,
                    MIX2: element.TEST_TYPE !=='G_RNR'? -1 : element.MIX2,
                    JUDGE1: element.TEST_TYPE ==='G_RNR'? element.SCORE1 >= 80 && element.MIX1 ===0 ? 'PASS' : 'FAIL' :  element.SCORE1 >= 80 ? 'PASS' : 'FAIL',
                    JUDGE2: element.TEST_TYPE ==='G_RNR'? (element.SCORE2 >= 80 && element.MIX2 ===0? 'PASS' : 'FAIL') :'N/A',                    
                    id: index,
                  };
                },
              );
              //setSummaryInspect('Tổng Nhập: ' +  summaryInput.toLocaleString('en-US') + 'EA');
              setRNRDataTable(loadeddata);
              setReadyRender(true);
              setisLoading(false);
              Swal.fire(
                "Thông báo",
                "Đã load " + response.data.data.length + " dòng",
                "success",
              );
            } else {
              Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
              setisLoading(false);
            }
          })
          .catch((error) => {
            console.log(error);
          });
        break;
    }
  };
  useEffect(() => {
  }, []);
  return (
    <div className="rnr">
      <div className="tracuuDataPqc">
        <div className="tracuuDataPQCform">
          <div className="forminput">
            <div className="forminputcolumn">
              <label>
                <b>Từ ngày:</b>
                <input
                  type="date"
                  value={fromdate.slice(0, 10)}
                  onChange={(e) => setFromDate(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Tới ngày:</b>{" "}
                <input
                  type="date"
                  value={todate.slice(0, 10)}
                  onChange={(e) => setToDate(e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Tên nhân viên:</b>{" "}
                <input
                  type="text"
                  placeholder="Nhập tên vào đây"
                  value={empl_name}
                  onChange={(e) => setEmpl_Name(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Nhà máy:</b>
                <select
                  name="phanloai"
                  value={factory}
                  onChange={(e) => {
                    setFactory(e.target.value);
                  }}
                >
                  <option value="All">ALL</option>
                  <option value="NM1">NM1</option>
                  <option value="NM2">NM2</option>
                </select>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Test ID:</b>{" "}
                <input
                  type="text"
                  placeholder="Nhập Test ID để tìm kiếm"
                  value={testID}
                  onChange={(e) => setTestID(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Test Type:</b>
                <select
                  name="testype"
                  value={testType}
                  onChange={(e) => {
                    setTestType(e.target.value);
                  }}
                >
                  <option value="ALL">ALL</option>
                  <option value="Test_LT">Test_LT</option>
                  <option value="G_RNR">G_RNR</option>
                  <option value="Test_CC">Test_CC</option>
                </select>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>All Time:</b>
                <input
                  type="checkbox"
                  name="alltimecheckbox"
                  defaultChecked={alltime}
                  onChange={() => setAllTime(!alltime)}
                ></input>
              </label>
              <label>
                <b>Select Data:</b>
                <select
                  name="dataselect"
                  value={selectedData}
                  onChange={(e) => {
                    setSelectedData(e.target.value);
                  }}
                >
                  <option value="detail">Chi tiết theo từng câu đề thi</option>
                  <option value="summaryByEmpl">Tổng hợp kết quả theo đầu nhân viên</option>
                  <option value="trendByEmpl">Trend kết quả test từng nhân viên</option>
                  <option value="summaryByDept">Tổng hợp kết quả theo bộ phận</option>
                </select>
              </label>
            </div>
          </div>
          <div className="formbutton">
            <div className="btgroup">
              <Button color={'primary'} variant="contained" size="small" fullWidth={true} sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#69b1f5f' }} onClick={() => {
                setisLoading(true);
                setReadyRender(false);
                handletraRNRData(selectedData);
              }}>Tra Data</Button>
            </div>
          </div>
        </div>
        <div className="tracuuPQCTable">
          {readyRender && (
            <DataGrid
              sx={{ fontSize: 12, flex: 1 }}
              components={{
                Toolbar: CustomToolbarPOTable,
                LoadingOverlay: LinearProgress,
              }}
              loading={isLoading}
              rowHeight={30}
              rows={rnrdatatable}
              columns={columnDefinition}
              rowsPerPageOptions={[
                5, 10, 50, 100, 500, 1000, 5000, 10000, 500000,
              ]}
              editMode="row"
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default RNR;

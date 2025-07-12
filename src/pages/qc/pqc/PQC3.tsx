import { Button } from "@mui/material";
import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import { generalQuery, uploadQuery } from "../../../api/Api";
import { zeroPad } from "../../../api/GlobalFunction";
import "./PQC3.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import AGTable from "../../../components/DataTable/AGTable";
import { ERROR_TABLE, PQC1_DATA, PQC3_DATA } from "../interfaces/qcInterface";
import { UserData } from "../../../api/GlobalInterface";
const PQC3 = () => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );
  const [error_tb, setError_TB] = useState<ERROR_TABLE[]>([]);
  const [occurr_time, setOccurrTime] = useState(moment().format('YYYY-MM-DD HH:mm:ss'));
  const [lineqc_empl, setLineqc_empl] = useState("");
  const [err_code, setErr_Code] = useState("ERR1");
  const [remark, setReMark] = useState("");
  const [selectedRowsDataA, setSelectedRowsData] = useState<Array<PQC1_DATA>>([]);
  const [empl_name, setEmplName] = useState("");
  const [empl_name2, setEmplName2] = useState("");
  const [g_name, setGName] = useState("");
  const [g_code, setGCode] = useState("");
  const [prodrequestno, setProdRequestNo] = useState("");
  const [planId, setPlanId] = useState("");
  const [pqc3Id, setPQC3ID] = useState(0);
  const [pqc1Id, setPQC1ID] = useState(0);
  const [defect_phenomenon, setDefectPhenomenon] = useState("");
  const [prodreqdate, setProdReqDate] = useState("");
  const [process_lot_no, setProcessLotNo] = useState("");
  const [factory, setFactory] = useState(userData?.FACTORY_CODE === 1 ? "NM1" : "NM2");
  const [pqc1datatable, setPqc1DataTable] = useState<Array<PQC1_DATA>>([]);
  const [pqc3datatable, setPqc3DataTable] = useState<Array<PQC3_DATA>>([]);
  
  const refArray = [useRef<any>(null), useRef<any>(null), useRef<any>(null), useRef<any>(null), useRef<any>(null), useRef<any>(null), useRef<any>(null), useRef<any>(null), useRef<any>(null), useRef<any>(null), useRef<any>(null)];
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Enter") {
      // console.log('press enter')
      e.preventDefault();
      const nextIndex = (index + 1) % refArray.length;
      refArray[nextIndex].current.focus();
    }
  };
  const [sample_qty, setSample_Qty] = useState(0);
  const [defect_qty, setDefect_Qty] = useState(0);
  const [file, setFile] = useState<any>(null);
  //let file:any = null;
  const uploadFile2 = async (PQC3_ID: number) => {
    if (file !== null && file !== undefined) {
      uploadQuery(file, "PQC3_" + (PQC3_ID + 1) + ".png", "pqc")
        .then((response) => {
          console.log("resopone upload:", response.data);
          if (response.data.tk_status !== "NG") {
            Swal.fire("Thông báo", "Input data pqc3 thành công", "success");
            handleTraPQC3Data();
          } else {
            Swal.fire(
              "Thông báo",
              "Upload file thất bại:" + response.data.message,
              "error"
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    else {
      Swal.fire('Cảnh báo', 'Chưa chọn file', 'error');
    }
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
          traPQC1Data(response.data.data[0].G_CODE);
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
  const columns_pqc1 = [
    { field: 'PQC1_ID', headerName: 'PQC1_ID', width: 50 },
    { field: 'G_NAME_KD', headerName: 'G_NAME_KD', width: 70 },
    { field: 'LINE_NO', headerName: 'LINE_NO', width: 50 },
    { field: 'SETTING_OK_TIME', headerName: 'SETTING_OK_TIME', width: 100 },
    { field: 'PROCESS_LOT_NO', headerName: 'LOT SX', width: 50 },
    { field: 'PLAN_ID', headerName: 'PLAN_ID', width: 50 },
    { field: 'INSPECT_SAMPLE_QTY', headerName: 'SAMPLE_QTY', width: 70 },
    { field: 'YEAR_WEEK', headerName: 'YEAR_WEEK', width: 60 },
    { field: 'FACTORY', headerName: 'FACTORY', width: 50 },
    { field: 'G_NAME', headerName: 'G_NAME', width: 100 },
    { field: 'LINEQC_PIC', headerName: 'LINEQC_PIC', width: 100 },
    { field: 'PROD_PIC', headerName: 'PROD_PIC', width: 100 },
    { field: 'PROD_LEADER', headerName: 'PROD_LEADER', width: 100 },
    { field: 'STEPS', headerName: 'STEPS', width: 100 },
    { field: 'CAVITY', headerName: 'CAVITY', width: 100 },
    { field: 'PROD_LAST_PRICE', headerName: 'PROD_LAST_PRICE', width: 100 },
    { field: 'SAMPLE_AMOUNT', headerName: 'SAMPLE_AMOUNT', width: 100 },
    { field: 'CNDB_ENCODES', headerName: 'CNDB_ENCODES', width: 100 },
    { field: 'REMARK', headerName: 'REMARK', width: 100 },
    { field: 'INS_DATE', headerName: 'INS_DATE', width: 100 },
    { field: 'UPD_DATE', headerName: 'UPD_DATE', width: 100 },
    { field: 'PQC3_ID', headerName: 'PQC3_ID', width: 100 },
    { field: 'OCCURR_TIME', headerName: 'OCCURR_TIME', width: 100 },
    { field: 'INSPECT_QTY', headerName: 'INSPECT_QTY', width: 100 },
    { field: 'DEFECT_QTY', headerName: 'DEFECT_QTY', width: 100 },
    { field: 'DEFECT_PHENOMENON', headerName: 'DEFECT_PHENOMENON', width: 100 },
    { field: 'PROD_REQUEST_NO', headerName: 'PROD_REQUEST_NO', width: 100 },
    { field: 'PROD_REQUEST_QTY', headerName: 'PROD_REQUEST_QTY', width: 100 },
    { field: 'PROD_REQUEST_DATE', headerName: 'PROD_REQUEST_DATE', width: 100 },
  ]
  const pqc1DataTableAG = useMemo(() => {
    return (
      <AGTable
        suppressRowClickSelection={false}
        toolbar={
          <div style={{ fontSize: '0.7rem', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          </div>}
        columns={columns_pqc1}
        data={pqc1datatable}
        onCellEditingStopped={(params: any) => {
          //console.log(e.data)
        }} onRowClick={(params: any) => {
          let rowData = params.data;
          setSelectedRowsData(rowData);
          //console.log(e.data) 
        }} onSelectionChange={(params: any) => {
          //setSelectedRows(params!.api.getSelectedRows()[0]);
          //console.log(e!.api.getSelectedRows())
        }} onRowDoubleClick={(params: any) => {
        }}
      />
    )
  }, [pqc1datatable, columns_pqc1])
  const columns_pqc3 = [
    {
      field: "YEAR_WEEK",
      headerName: "YEAR_WEEK",
      width: 60,
      editable: false
    },
    {
      field: "PQC3_ID",
      headerName: "PQC3_ID",
      width: 50,
      editable: false
    },
    {
      field: "PQC1_ID",
      headerName: "PQC1_ID",
      width: 50,
      editable: false
    },
    {
      field: "CUST_NAME_KD",
      headerName: "CUST_NAME_KD",
      width: 90,
      editable: false
    },
    {
      field: "FACTORY",
      headerName: "FACTORY",
      width: 50,
      editable: false
    },
    {
      field: "PROD_REQUEST_NO",
      headerName: "YCSX_NO",
      width: 60,
      editable: false
    },
    {
      field: "PROD_REQUEST_DATE",
      headerName: "YCSX_DATE",
      width: 60,
      editable: false
    },
    {
      field: "PROCESS_LOT_NO",
      headerName: "LOTSX",
      width: 50,
      editable: false
    },
    {
      field: "G_CODE",
      headerName: "G_CODE",
      width: 50,
      editable: false
    },
    {
      field: "G_NAME",
      headerName: "G_NAME",
      width: 100,
      editable: false
    },
    {
      field: "G_NAME_KD",
      headerName: "G_NAME_KD",
      width: 80,
      editable: false
    },
    {
      field: "PROD_LAST_PRICE",
      headerName: "PRICE",
      width: 50,
      editable: false
    },
    {
      field: "LINEQC_PIC",
      headerName: "LINEQC_PIC",
      width: 60,
      editable: false
    },
    {
      field: "PROD_PIC",
      headerName: "PROD_PIC",
      width: 60,
      editable: false
    },
    {
      field: "PROD_LEADER",
      headerName: "PROD_LEADER",
      width: 80,
      editable: false
    },
    {
      field: "LINE_NO",
      headerName: "LINE_NO",
      width: 50,
      editable: false
    },
    {
      field: "OCCURR_TIME",
      headerName: "OCCURR_TIME",
      width: 70,
      editable: false
    },
    {
      field: "INSPECT_QTY",
      headerName: "INSPECT_QTY",
      width: 70,
      editable: false
    },
    {
      field: "DEFECT_QTY",
      headerName: "DEFECT_QTY",
      width: 70,
      editable: false
    },
    {
      field: "DEFECT_AMOUNT",
      headerName: "DEFECT_AMOUNT",
      width: 90,
      editable: false
    },
    {
      field: "DEFECT_PHENOMENON",
      headerName: "DEFECT_PHENOMENON",
      width: 100,
      editable: false
    },
    {
      field: "DEFECT_IMAGE_LINK",
      headerName: "IMAGE_LINK",
      width: 70,
      editable: false
    },
    {
      field: "REMARK",
      headerName: "REMARK",
      width: 100,
      editable: false
    },
    {
      field: "WORST5",
      headerName: "WORST5",
      width: 150,
      editable: false
    },
    {
      field: "WORST5_MONTH",
      headerName: "WORST5_MONTH",
      width: 50,
      editable: false
    },
    {
      field: "ERR_CODE",
      headerName: "ERR_CODE",
      width: 60,
      editable: false
    },
    {
      field: "NG_NHAN",
      headerName: "NG_NHAN",
      width: 250,
      editable: false
    },
    {
      field: "DOI_SACH",
      headerName: "DOI_SACH",
      width: 150,
      editable: false
    },
    {
      field: "STATUS",
      headerName: "STATUS",
      width: 150,
      editable: false
    },
  ]
  const pqc3DataTableAG = useMemo(() => {
    return (
      <AGTable
        suppressRowClickSelection={false}
        toolbar={
          <div style={{ fontSize: '0.7rem', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          </div>}
        columns={columns_pqc3}
        data={pqc3datatable}
        onCellEditingStopped={(params: any) => {
          //console.log(e.data)
        }} onRowClick={(params: any) => {
          let rowData = params.data;
          setSelectedRowsData(rowData);
          //console.log(e.data) 
        }} onSelectionChange={(params: any) => {
          //setSelectedRows(params!.api.getSelectedRows()[0]);
          //console.log(e!.api.getSelectedRows())
        }} onRowDoubleClick={(params: any) => {
        }}
      />
    )
  }, [pqc3datatable, columns_pqc3])
  const traPQC1Data = (g_code: string) => {
    generalQuery("trapqc1data", {
      ALLTIME: true,
      FROM_DATE: moment().add(-2, "day").format("YYYY-MM-DD"),
      TO_DATE: moment().format("YYYY-MM-DD"),
      CUST_NAME: "",
      PROCESS_LOT_NO: "",
      G_CODE: g_code,
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
  const loadErrorTable = () => {
    generalQuery("loadErrTable", {})
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);\
          setError_TB(response.data.data);
        } else {
          setError_TB([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const checkInput = (): boolean => {
    if (
      planId !== "" &&
      lineqc_empl !== "" &&
      process_lot_no !== "" &&
      pqc1Id !== 0 &&
      file !== undefined &&
      file !== null &&
      err_code !== "" &&
      defect_phenomenon !== "" &&
      prodrequestno !== "" &&
      g_code !== ""
    ) {
      return true;
    } else {
      return false;
    }
  };
  const inputDataPqc3 = () => {
    const uploadData = {
      PROCESS_LOT_NO: process_lot_no.toUpperCase(),
      LINEQC_PIC: lineqc_empl.toUpperCase(),
      OCCURR_TIME: occurr_time,
      INSPECT_QTY: sample_qty,
      DEFECT_QTY: defect_qty,
      DEFECT_PHENOMENON: defect_phenomenon,
      DEFECT_IMAGE_LINK: 'Link_Web',
      REMARK: remark,
      PQC1_ID: pqc1Id,
      ERR_CODE: err_code,
      PROD_REQUEST_NO: prodrequestno,
      G_CODE: g_code,
    };
    console.log('upload data', uploadData);
    generalQuery("insert_pqc3", uploadData)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          generalQuery("getlastestPQC3_ID", {})
            .then((response) => {
              if (response.data.tk_status !== "NG") {
                console.log(response.data.data);
                setPQC3ID(response.data.data[0].PQC3_ID);
                uploadFile2(response.data.data[0].PQC3_ID);
              } else {
                setPQC3ID(0);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          Swal.fire("Cảnh báo", "Có lỗi: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleTraPQC3Data = () => {
    generalQuery("trapqc3data", {
      ALLTIME: true,
      FROM_DATE: moment().add(-2, "day").format("YYYY-MM-DD"),
      TO_DATE: moment().format("YYYY-MM-DD"),
      CUST_NAME: '',
      PROCESS_LOT_NO: '',
      G_CODE: '',
      G_NAME: '',
      PROD_TYPE: '',
      EMPL_NAME: '',
      PROD_REQUEST_NO: '',
      ID: '',
      FACTORY: 'All',
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: PQC3_DATA[] = response.data.data.map(
            (element: PQC3_DATA, index: number) => {
              //summaryOutput += element.OUTPUT_QTY_EA;
              return {
                ...element,
                OCCURR_TIME: moment
                  .utc(element.OCCURR_TIME)
                  .format("YYYY-MM-DD HH:mm:ss"),
                id: index,
              };
            },
          );
          //setSummaryInspect('Tổng Xuất: ' +  summaryOutput.toLocaleString('en-US') + 'EA');
          setPqc3DataTable(loadeddata);
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
          setPqc3DataTable([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    loadErrorTable();
    handleTraPQC3Data();
    ///handletraFailingData();
  }, []);
  return (
    <div className="pqc3">
      <div className="tracuuDataInspection">
        <div className="inputform">
        </div>
        <div className="maintable">
          <div className="tracuuDataInspectionform">
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
                  <b>Lot SX</b>
                  <input
                    ref={refArray[0]}
                    type="text"
                    placeholder=""
                    value={process_lot_no}
                    onKeyDown={(e) => {
                      handleKeyDown(e, 0);
                    }}
                    onChange={(e) => {
                      setProcessLotNo(e.target.value);
                      if (e.target.value.length >= 8) {
                        checkProcessLotNo(e.target.value);
                      } else {
                      }
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
                  <b>Mã lỗi</b>
                  <select
                    ref={refArray[2]}
                    onKeyDown={(e: any) => {
                      handleKeyDown(e, 2);
                    }}
                    name="factory"
                    value={err_code}
                    onChange={(e) => {
                      setErr_Code(e.target.value);
                    }}
                  >{
                      error_tb.map((ele: ERROR_TABLE, index: number) => {
                        return (
                          <option key={index} value={ele.ERR_CODE}>{zeroPad(index + 1, 2)}|{ele.ERR_NAME_VN}</option>
                        )
                      })
                    }
                  </select>
                </label>
                <label>
                  <b>Hiện tượng lỗi</b>
                  <input
                    ref={refArray[3]}
                    onKeyDown={(e) => {
                      handleKeyDown(e, 3);
                    }}
                    type="text"
                    placeholder={""}
                    value={defect_phenomenon}
                    onChange={(e) => {
                      setDefectPhenomenon(e.target.value);
                    }}
                  ></input>
                </label>
              </div>
              <div className="forminputcolumn">
                <label>
                  <b>Time Phát Sinh</b>
                  <input
                    ref={refArray[4]}
                    onKeyDown={(e) => {
                      handleKeyDown(e, 4);
                    }}
                    type="datetime-local"
                    placeholder={"Ghi chú"}
                    value={occurr_time}
                    onChange={(e) => {
                      setOccurrTime(e.target.value);
                    }}
                  ></input>
                </label>
                <label>
                  <b>Remark</b>
                  <input
                    ref={refArray[5]}
                    onKeyDown={(e) => {
                      handleKeyDown(e, 5);
                    }}
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
                <input
                  ref={refArray[6]}
                  onKeyDown={(e) => {
                    handleKeyDown(e, 6);
                  }}
                  style={{ width: '170px' }}
                  accept='.jpg'
                  type='file'
                  placeholder="Chọn file"
                  onChange={(e: any) => {
                    setFile(e.target.files[0]);
                    console.log(e.target.files[0]);
                  }}
                />
              </div>
              <div className="forminputcolumn">
                <label>
                  <b>SAMPLE QTY</b>
                  <input
                    ref={refArray[7]}
                    onKeyDown={(e) => {
                      handleKeyDown(e, 7);
                    }}
                    type="text"
                    placeholder=""
                    value={sample_qty}
                    onChange={(e) => {
                      setSample_Qty(Number(e.target.value));
                    }}
                  ></input>
                </label>
                <label>
                  <b>DEFECT QTY</b>
                  <input
                    ref={refArray[8]}
                    onKeyDown={(e) => {
                      handleKeyDown(e, 8);
                    }}
                    type="text"
                    placeholder=""
                    value={defect_qty}
                    onChange={(e) => {
                      setDefect_Qty(Number(e.target.value));
                    }}
                  ></input>
                </label>
              </div>
              <div className="forminputcolumn">
                <Button
                  ref={refArray[9]}
                  /*  onKeyDown={(e: any) => {                      
                     refArray[0].current.focus();
                   }} */
                  color={"primary"}
                  variant="contained"
                  size="small"
                  sx={{
                    fontSize: "0.7rem",
                    padding: "3px",
                    backgroundColor: "#f97bfd",
                  }}
                  onClick={(e) => {
                    if (checkInput()) {
                      refArray[0].current.focus();
                      inputDataPqc3();
                    }
                    else {
                      refArray[0].current.focus();
                      Swal.fire('Cảnh báo', 'Nhập đủ thông tin cần thiết', 'error');
                    }
                  }}
                >
                  Input Data
                </Button>
                <Button
                  /* ref={refArray[10]}
                  onKeyDown={(e: any) => {
                    handleKeyDown(e, 10);
                  }} */
                  color={"primary"}
                  variant="contained"
                  size="small"
                  sx={{
                    fontSize: "0.7rem",
                    padding: "3px",
                    backgroundColor: "#756DFA",
                  }}
                  onClick={() => {
                    //console.log(occurr_time)
                    uploadFile2(pqc3Id);
                  }}
                >
                  Update Ảnh
                </Button>
              </div>
            </div>
          </div>
          <div className="tracuuYCSXTable2">{pqc1DataTableAG}</div>
          <div className="tracuuYCSXTable">{pqc3DataTableAG}</div>
        </div>
      </div>
    </div>
  );
};
export default PQC3;

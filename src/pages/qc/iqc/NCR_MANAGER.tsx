import { Button, IconButton } from "@mui/material";
import moment from "moment";
import { useEffect, useMemo, useRef, useState } from "react";
import { AiFillFileAdd, AiOutlineSearch } from "react-icons/ai";
import Swal from "sweetalert2";
import { generalQuery, getAuditMode, getCompany, getUserData } from "../../../api/Api";
import "./NCR_MANAGER.scss";
import { GrStatusGood } from "react-icons/gr";
import { FcCancel } from "react-icons/fc";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  DTC_DATA,
  IQC_INCOMMING_DATA,
  NCR_DATA,
  UserData,
} from "../../../api/GlobalInterface";
import AGTable from "../../../components/DataTable/AGTable";
const NCR_MANAGER = () => {
  const [isNewRegister, setNewRegister] = useState(false);
  const column_dtc_data = [
    { field: "TEST_NAME", headerName: "TEST_NAME", width: 80 },
    { field: "POINT_CODE", headerName: "POINT_CODE", width: 90 },
    {
      field: "DANHGIA",
      headerName: "DANH_GIA",
      width: 80,
      cellRenderer: (params: any) => {
        if (
          params.data.RESULT >= params.data.CENTER_VALUE - params.data.LOWER_TOR &&
          params.data.RESULT <= params.data.CENTER_VALUE + params.data.UPPER_TOR
        )
          return (
            <span style={{ color: "green" }}>
              <b>OK</b>
            </span>
          );
        return (
          <span style={{ color: "red" }}>
            <b>NG</b>
          </span>
        );
      },
    },
    {
      field: "CENTER_VALUE",
      headerName: "CENTER_VALUE",
      width: 120,
      cellRenderer: (params: any) => {
        return (
          <span>
            <b>{params.data.CENTER_VALUE}</b>
          </span>
        );
      },
    },
    {
      field: "UPPER_TOR",
      headerName: "UPPER_TOR",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span>
            <b>{params.data.UPPER_TOR}</b>
          </span>
        );
      },
    },
    {
      field: "LOWER_TOR",
      headerName: "LOWER_TOR",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span>
            <b>{params.data.LOWER_TOR}</b>
          </span>
        );
      },
    },
    { field: "RESULT", headerName: "RESULT", width: 80 },
    { field: "DTC_ID", headerName: "DTC_ID", width: 80 },
    { field: "PROD_REQUEST_NO", headerName: "YCSX", width: 80 },
    { field: "G_CODE", headerName: "G_CODE", width: 80 },
    {
      field: "G_NAME",
      headerName: "G_NAME",
      width: 200,
      cellRenderer: (params: any) => {
        if (params.data.M_CODE !== "B0000035") return <span></span>;
        return (
          <span>
            <b>{params.data.G_NAME}</b>
          </span>
        );
      },
    },
    {
      field: "M_CODE",
      headerName: "M_CODE",
      width: 80,
      cellRenderer: (params: any) => {
        if (params.data.M_CODE === "B0000035") return <span></span>;
        return (
          <span>
            <b>{params.data.M_CODE}</b>
          </span>
        );
      },
    },
    {
      field: "M_NAME",
      headerName: "TEN LIEU",
      width: 150,
      cellRenderer: (params: any) => {
        if (params.data.M_CODE === "B0000035") return <span></span>;
        return (
          <span>
            <b>{params.data.M_NAME}</b>
          </span>
        );
      },
    },
    { field: "FACTORY", headerName: "FACTORY", width: 80 },
    { field: "TEST_FINISH_TIME", headerName: "TEST_FINISH_TIME", width: 145 },
    { field: "TEST_EMPL_NO", headerName: "NV TEST", width: 100 },
    { field: "TEST_TYPE_NAME", headerName: "TEST_TYPE_NAME", width: 140 },
    { field: "WORK_POSITION_NAME", headerName: "BO PHAN", width: 80 },
    { field: "SAMPLE_NO", headerName: "SAMPLE_NO", width: 80 },
    { field: "REQUEST_DATETIME", headerName: "NGAY YC", width: 145 },
    { field: "REQUEST_EMPL_NO", headerName: "NV YC", width: 80 },
    { field: "SIZE", headerName: "SIZE", width: 80 },
    { field: "LOTCMS", headerName: "LOTCMS", width: 80 },
    { field: "TEST_CODE", headerName: "TEST_CODE", width: 80 },
    { field: "TDS", headerName: "TDS", width: 80 },
    { field: "TDS_EMPL", headerName: "TDS_EMPL", width: 80 },
    { field: "TDS_UPD_DATE", headerName: "TDS_UPD_DATE", width: 80 },
  ];
  const handletraDTCData = (dtc_id: number) => {
    generalQuery("dtcdata", {
      ALLTIME: true,
      FROM_DATE: "",
      TO_DATE: "",
      G_CODE: "",
      G_NAME: "",
      M_NAME: "",
      M_CODE: "",
      TEST_NAME: "0",
      PROD_REQUEST_NO: "",
      TEST_TYPE: "0",
      ID: dtc_id,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: DTC_DATA[] = response.data.data.map(
            (element: DTC_DATA, index: number) => {
              return {
                ...element,
                G_NAME: getAuditMode() == 0? element?.G_NAME : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME : 'TEM_NOI_BO',
                TEST_FINISH_TIME: moment
                  .utc(element.TEST_FINISH_TIME)
                  .format("YYYY-MM-DD HH:mm:ss"),
                REQUEST_DATETIME: moment
                  .utc(element.REQUEST_DATETIME)
                  .format("YYYY-MM-DD HH:mm:ss"),
                id: index,
              };
            },
          );
          setDtcDataTable(loadeddata);
        } else {
          setDtcDataTable([])
          /* Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error"); */
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData,
  );
  const [cmsLot, setCmsLot] = useState("");
  const [iqc_empl, setIQC_Empl] = useState(getUserData()?.EMPL_NO!);
  const [remark, setReMark] = useState("");
  const [ncr_data_table, setNCRDataTable] = useState<
    Array<NCR_DATA>
  >([
    {
      NCR_ID: 0,
      FACTORY: "",
      NCR_NO: "",
      NCR_DATE: "",
      RESPONSE_REQ_DATE: "",
      CUST_CD: "",
      VENDOR: "",
      M_NAME: "",
      CMS_LOT: "",
      VENDOR_LOT: "", 
      DEFECT_TITLE: "",
      DEFECT_DETAIL: "",
      DEFECT_IMAGE: "",
      PROCESS_STATUS: "",
      USE_YN: "",
      INS_DATE: "",
      INS_EMPL: "",
      UPD_DATE: "", 
      UPD_EMPL: "",
      REMARK: "",
    }
  ]);
  const [dtcDataTable, setDtcDataTable] = useState<Array<DTC_DATA>>([]);
  const selectedRowsData= useRef<Array<IQC_INCOMMING_DATA>>([]);
  const [empl_name, setEmplName] = useState("");
  const [m_name, setM_Name] = useState("");
  const [width_cd, setWidthCD] = useState(0);
  const [in_cfm_qty, setInCFMQTY] = useState(0);
  const [roll_qty, setRollQty] = useState(0);
  const [m_code, setM_Code] = useState("");
  const [cust_cd, setCust_Cd] = useState("");
  const [cust_name_kd, setCust_Name_KD] = useState("");
  const [vendorLot, setVendorLot] = useState("");
  const [cmsLOT, setCMSLOT] = useState("");
  const [exp_date, setEXP_DATE] = useState(moment().format("YYYY-MM-DD"));
  const [ncr_date, setNCR_DATE] = useState(moment().format("YYYY-MM-DD"));
  const [response_date, setRESPONSE_DATE] = useState(moment().format("YYYY-MM-DD"));
  const [total_qty, setTotal_QTY] = useState(0);
  const [total_roll, setTotal_ROLL] = useState(0);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [vendor, setVendor] = useState("");
  const [defect_title, setDefect_Title] = useState("");
  const [defect_detail, setDefect_Detail] = useState(""); 

  const setQCPASS = async (value: string) => {
    console.log(selectedRowsData.current);
    if (selectedRowsData.current.length > 0) {
      Swal.fire({
        title: "Set QC Pass",
        text: "Đang set pass, hãy chờ chút",
        icon: "info",
        showCancelButton: false,
        allowOutsideClick: false,
        confirmButtonText: "OK",
        showConfirmButton: false,
      });
      let err_code: string = "";
      for (let i = 0; i < selectedRowsData.current.length; i++) {
        await generalQuery("updateQCPASSI222", {
          M_CODE: selectedRowsData.current[i].M_CODE,
          LOT_CMS: selectedRowsData.current[i].LOT_CMS,
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
        await generalQuery("updateIQC1Table", {
          M_CODE: selectedRowsData.current[i].M_CODE,
          LOT_CMS: selectedRowsData.current[i].LOT_CMS,
          VALUE: value === "Y" ? "OK" : "NG",
          IQC1_ID: selectedRowsData.current[i].IQC1_ID,
          REMARK: selectedRowsData.current[i].REMARK,
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
        handletraIQC1Data();
      } else {
        Swal.fire("Thông báo", "Lỗi: " + err_code, "error");
      }
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 dòng để thực hiện", "error");
    }
  };
  let column_ncrdatatable = [
    { field: "NCR_ID", headerName: "NCR_ID", width: 100 },
    { field: "NCR_NO", headerName: "NCR_NO", width: 100 },
    { field: "NCR_DATE", headerName: "NCR_DATE", width: 100 },
    { field: "RESPONSE_REQ_DATE", headerName: "RESPONSE_REQ_DATE", width: 100 },
    { field: "CUST_CD", headerName: "CUST_CD", width: 100 },
    { field: "VENDOR", headerName: "VENDOR", width: 100 },
    { field: "M_NAME", headerName: "M_NAME", width: 100 },
    { field: "CMS_LOT", headerName: "CMS_LOT", width: 100 },
    { field: "VENDOR_LOT", headerName: "VENDOR_LOT", width: 100 },
    { field: "DEFECT_TITLE", headerName: "DEFECT_TITLE", width: 100 },
    { field: "DEFECT_DETAIL", headerName: "DEFECT_DETAIL", width: 100 },  
    { field: "PROCESS_STATUS", headerName: "PROCESS_STATUS", width: 100 },
    { field: "USE_YN", headerName: "USE_YN", width: 100 },
    { field: "INS_DATE", headerName: "INS_DATE", width: 100 },
    { field: "INS_EMPL", headerName: "INS_EMPL", width: 100 },
    { field: "UPD_DATE", headerName: "UPD_DATE", width: 100 },
    { field: "UPD_EMPL", headerName: "UPD_EMPL", width: 100 },
    { field: "REMARK", headerName: "REMARK", width: 100 },
  ];

  const ncrDataTable = useMemo(() => {
    return (
      <AGTable
        toolbar={
          <div>
           
            <IconButton
              className="buttonIcon"
              onClick={() => {
                setNCRDataTable([]);
                setNewRegister(true);  
                setVendor("");              
                setVendorLot("");              
                setM_Code("");              
                setM_Name("");
              }}
            >
              <AiFillFileAdd color="green" size={15} />
              NEW NCR
            </IconButton>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                //handletraIQC1Data();
                setNewRegister(false);
              }}
            >
              <AiOutlineSearch color="red" size={15} />
              Tra Data
            </IconButton>
            <IconButton
              className="buttonIcon"
              onClick={() => {                
                if (userData?.SUBDEPTNAME === "IQC") {
                  setQCPASS("Y");
                } else {
                  Swal.fire(
                    "Thông báo",
                    "Bạn không phải người bộ phận IQC",
                    "error",
                  );
                }
              }}
            >
              <GrStatusGood color="green" size={15} />
              SET PASS
            </IconButton>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                if (userData?.SUBDEPTNAME === "IQC") {
                  setQCPASS("N");
                } else {
                  Swal.fire(
                    "Thông báo",
                    "Bạn không phải người bộ phận IQC",
                    "error",
                  );
                }
              }}
            >
              <FcCancel color="red" size={15} />
              RESET PASS
            </IconButton>
          </div>}
        columns={column_ncrdatatable}
        data={ncr_data_table}
        onCellEditingStopped={(e) => {
          //console.log(e.data)
        }} onRowClick={(e) => {
          //console.log(e.data)
          handletraDTCData(e.data.DTC_ID);
        }} onSelectionChange={(e) => {
          //console.log(e!.api.getSelectedRows())
          selectedRowsData.current = e!.api.getSelectedRows();         
        }}
      />
    )
  }, [ncr_data_table]);
  const dtc_data_table = useMemo(() => {
    return (
      <AGTable
        toolbar={
          <div>
            
          </div>}
        columns={column_dtc_data}
        data={dtcDataTable}
        onCellEditingStopped={(e) => {
          //console.log(e.data)
        }} onRowClick={(e) => {
          //console.log(e.data)
          
        }} onSelectionChange={(e) => {
          //console.log(e!.api.getSelectedRows())
             
        }}
      />
    )
  }, [dtcDataTable]);

  const handletraIQC1Data = () => {
    generalQuery("loadIQC1table", {
      M_CODE: m_code.trim(),
      M_NAME: m_name.trim(),
      LOTNCC: vendorLot.trim(),
      FROM_DATE: fromdate,
      TO_DATE: todate,
      VENDOR_NAME: vendor.trim()
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: NCR_DATA[] = response.data.data.map(
            (element: NCR_DATA, index: number) => {              
              return {
                ...element,                
                INS_DATE: element.INS_DATE === null ? "" : moment(element.INS_DATE).utc().format("YYYY-MM-DD HH:mm:ss"),
                UPD_DATE: element.UPD_DATE === null ? "" : moment(element.UPD_DATE).utc().format("YYYY-MM-DD HH:mm:ss"),              
                id: index,
              };
            },
          );
          setNCRDataTable(loadeddata);
          setNewRegister(false);
          Swal.fire(
            "Thông báo",
            "Đã load :" + loadeddata.length + " dòng",
            "success",
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
            response.data.data[0].FIRST_NAME,
          );        
        } else {
          setEmplName("");       
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
          setVendor(response.data.data[0].CUST_NAME_KD)
          setM_Code(response.data.data[0].M_CODE);
          setWidthCD(response.data.data[0].WIDTH_CD);
          setInCFMQTY(response.data.data[0].OUT_CFM_QTY);
          setRollQty(response.data.data[0].ROLL_QTY);
          setCust_Cd(response.data.data[0].CUST_CD);
          setCust_Name_KD(response.data.data[0].CUST_NAME_KD);
          setVendorLot(response.data.data[0].LOTNCC);
          setEXP_DATE(moment(response.data.data[0].EXP_DATE).format("YYYY-MM-DD"));
          generalQuery("checkMNAMEfromLotI222Total", {
            M_CODE: response.data.data[0].M_CODE,
            LOTCMS: M_LOT_NO.substring(0, 6),
          })
            .then((response) => {
              if (response.data.tk_status !== "NG") {
                //console.log(response.data.data);
                setTotal_QTY(response.data.data[0].TOTAL_CFM_QTY);
                setTotal_ROLL(response.data.data[0].TOTAL_ROLL);
              } else {
                setTotal_QTY(0);
                setTotal_ROLL(0);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          setVendor("");
          setM_Name("");
          setM_Code("");
          setWidthCD(0);
          setRollQty(0);
          setInCFMQTY(0);
          setCust_Cd("");
          setCust_Name_KD("");
          setVendorLot("");
          setEXP_DATE(moment().format('YYYY-MM-DD'))
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const checkInput = (): boolean => {
    if (
      cmsLot !== "" &&      
      iqc_empl !== "" &&
      ncr_date !== "" &&
      response_date !== "" &&
      cust_cd !== "" &&
      m_name !== "" &&
      vendorLot !== "" &&
      defect_title !== "" &&
      defect_detail !== "" 
    ) {
      return true;
    } else {
      return false;
    }
  };
  const addRow = async () => {
    let temp_row: NCR_DATA = {
      NCR_ID: ncr_data_table.length>0 ? Math.max(...ncr_data_table.map(row => row.NCR_ID)) + 1 : 0,
      FACTORY: "NM1",
      NCR_NO: getCompany()+'1-'+moment().format("YYYYMMDD"),
      NCR_DATE: ncr_date,
      RESPONSE_REQ_DATE: response_date,
      CUST_CD: cust_cd,
      VENDOR: vendor,
      M_NAME: m_name,
      CMS_LOT: cmsLot,  
      VENDOR_LOT: vendorLot,
      DEFECT_TITLE: defect_title,
      DEFECT_DETAIL: defect_detail,
      DEFECT_IMAGE: "P",
      PROCESS_STATUS: "P",
      USE_YN: "Y",
      INS_DATE: moment().format("YYYY-MM-DD HH:mm:ss"),
      INS_EMPL: iqc_empl, 
      UPD_DATE: moment().format("YYYY-MM-DD HH:mm:ss"),
      UPD_EMPL: iqc_empl,
      REMARK: remark, 
    };
    setNCRDataTable((prev) => {
      return [...prev, temp_row];
    });
  };
  const insertNCRTable = async () => {
    if (ncr_data_table.length > 0) {
      let err_code: string = "";
      for (let i = 0; i < ncr_data_table.length; i++) {
        await generalQuery("insertIQC1table", ncr_data_table[i])
          // eslint-disable-next-line no-loop-func
          .then((response) => {
            if (response.data.tk_status !== "NG") {
              //console.log(response.data.data);
            } else {
              err_code += "Lỗi : " + response.data.message + " | ";
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
      if (err_code === "") {
        Swal.fire("Thông báo", "Thêm data thành công", "success");
      } else {
        Swal.fire("Thông báo", "Lỗi: " + err_code, "error");
      }
    } else {
      Swal.fire("Thông báo", "Thêm ít nhất 1 dòng để lưu", "error");
    }
  };
  useEffect(() => {
    //handletraIQC1Data();
  }, []);
  return (
    <div className="ncr_management">
      <div className="tracuuDataInspection">
        <div className="maintable">
          {isNewRegister && <div className="tracuuDataInspectionform">
            <b style={{ color: "blue" }}>INPUT DATA NCR</b>
            <div className="forminput">              
              <div className="forminputcolumn">
                <b>LOT NVL ERP</b>
                <label>
                  <input
                    type="text"
                    placeholder="2304190123"
                    value={cmsLot}
                    onChange={(e) => {
                      if (e.target.value.length >= 7) {
                        checkLotNVL(e.target.value);
                      }
                      setCmsLot(e.target.value);
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
                    type="text"
                    placeholder={"abcdxyz"}
                    value={vendorLot}
                    onChange={(e) => {
                      setVendorLot(e.target.value);
                    }}
                  ></input>
                </label>
              </div>
              <div className="forminputcolumn">
                <b>NCR DATE</b>
                <label>
                  <input
                    type="date"
                    value={ncr_date}
                    onChange={(e) => {
                      setNCR_DATE(e.target.value);
                    }}
                  ></input>
                </label>
                <b>RESPONSE REQ DATE</b>
                <label>
                  <input
                    type="date"
                    value={response_date}
                    onChange={(e) => {
                      setRESPONSE_DATE(e.target.value);
                    }}
                  ></input>
                </label>
              </div>
              <div className="forminputcolumn">
                <b>DEFECT TITLE</b>
                <label>
                  <input
                    type="text"
                    value={defect_title}
                    onChange={(e) => {
                      setDefect_Title(e.target.value);
                    }}
                  ></input>
                </label>  
                <b>DEFECT DETAIL</b>
                <label>
                  <input
                    type="text"
                    value={defect_detail}
                    onChange={(e) => {
                      setDefect_Detail(e.target.value);
                    }}
                  ></input>
                </label>  
              </div>              
              <div className="forminputcolumn">               
                <b>MÃ IQC</b>
                <label>
                  <input
                    type="text"
                    placeholder={"NHU1903"}
                    value={iqc_empl}
                    onChange={(e) => {
                      if (e.target.value.length >= 7) {
                        checkEMPL_NAME(e.target.value);
                      }
                      setIQC_Empl(e.target.value);
                    }}
                  ></input>
                </label>
                {iqc_empl && (
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
                <b>REMARK</b>
                <label>
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
              <Button fullWidth={true}  color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#f3f735', color: 'black' }} onClick={() => {
                if (checkInput()) {
                  if(isNewRegister)
                  {
                    addRow();
                  }
                  else {
                    Swal.fire('Thông báo','Bấm New và Add đăng ký mới rồi hãy save','warning');
                  }
                } else {
                  Swal.fire( "Thông báo", "Hãy nhập đủ thông tin trước khi đăng ký", "error",);
                }
              }}>Add</Button>
              <Button fullWidth={true}  color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#0ca32d' }} onClick={() => {
                if(isNewRegister)
                {
                  insertNCRTable();
                }
                else {
                  Swal.fire('Thông báo','Bấm New và Add đăng ký mới rồi hãy save','warning');
                }
              }}>Save</Button>
            </div>
          </div>}
          {!isNewRegister && <div className="tracuuDataInspectionform">
            <b style={{ color: "blue" }}>TRA DATA NCR</b>
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
              <b>Tên Liệu:</b>{" "}
              <input
                type="text"
                placeholder="SJ-203020HC"
                value={m_name}
                onChange={(e) => setM_Name(e.target.value)}
              ></input>
            </label>
            <label>
              <b>Mã Liệu CMS:</b>{" "}
              <input
                type="text"
                placeholder="A123456"
                value={m_code}
                onChange={(e) => setM_Code(e.target.value)}
              ></input>
            </label>
          </div>
          <div className="forminputcolumn">
            <label>
              <b>Vendor Name:</b>{" "}
              <input
                type="text"
                placeholder="SSJ"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
              ></input>
            </label>           
            <label>
              <b>LOT CMS:</b>{" "}
              <input
                type="text"
                placeholder="2409040001"
                value={cmsLOT}
                onChange={(e) => setCMSLOT(e.target.value)}
              ></input>
            </label>           
            <label>
              <b>Vendor LOT:</b>{" "}
              <input
                type="text"
                placeholder="abcxyz123"
                value={vendorLot}
                onChange={(e) => setVendorLot(e.target.value)}
              ></input>
            </label>           
          </div>
          </div>
            {isNewRegister && <div className="formbutton">
              <Button fullWidth={true} color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#4959e7', color: 'white' }} onClick={() => {
                setNCRDataTable([]);
                setNewRegister(true);
              }}>NEW</Button>
              <Button fullWidth={true}  color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#f3f735', color: 'black' }} onClick={() => {
                if (checkInput()) {
                  if(isNewRegister)
                  {
                    addRow();
                  }
                  else {
                    Swal.fire('Thông báo','Bấm New và Add đăng ký mới rồi hãy save','warning');
                  }
                } else {
                  Swal.fire(
                    "Thông báo",
                    "Hãy nhập đủ thông tin trước khi đăng ký",
                    "error",
                  );
                }
              }}>Add</Button>
              <Button fullWidth={true}  color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#0ca32d' }} onClick={() => {
                if(isNewRegister)
                {
                  insertNCRTable();
                }
                else {
                  Swal.fire('Thông báo','Bấm New và Add đăng ký mới rồi hãy save','warning');
                }
              }}>Save</Button>
            </div>}
            {!isNewRegister && <div className="formbutton">
              <Button fullWidth={true} color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#4959e7', color: 'white' }} onClick={() => {
               handletraIQC1Data();
              }}>Tra Data</Button>          
            </div>}
          </div>}
          <div className="tracuuYCSXTable">{ncrDataTable}</div>
          <div className="tracuuDataInspectionform2">
            <b style={{ color: "blue" }}>Kết quả ĐTC</b>
            {dtc_data_table}
          </div>
        </div>
      </div>
    </div>
  );
};
export default NCR_MANAGER;

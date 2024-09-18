import { Button, IconButton } from "@mui/material";
import moment from "moment";
import { useEffect, useMemo, useRef, useState } from "react";
import { AiFillFileAdd, AiOutlineCloudUpload, AiOutlineExport, AiOutlineSearch } from "react-icons/ai";
import Swal from "sweetalert2";
import { generalQuery, getAuditMode, getCompany, getUserData, uploadQuery } from "../../../api/Api";
import "./NCR_MANAGER.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { DTC_DATA, HOLDDING_BY_NCR_ID, NCR_DATA, UserData } from "../../../api/GlobalInterface";
import AGTable from "../../../components/DataTable/AGTable";
import { checkBP } from "../../../api/GlobalFunction";
const NCR_MANAGER = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [isNewRegister, setNewRegister] = useState(false);
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData,
  );
  const [cmsLot, setCmsLot] = useState("");
  const [iqc_empl, setIQC_Empl] = useState(getUserData()?.EMPL_NO!);
  const [remark, setReMark] = useState("");
  const [ncr_data_table, setNCRDataTable] = useState<Array<NCR_DATA>>([]);
  const [holdingdatatable, setHoldingDataTable] = useState<Array<HOLDDING_BY_NCR_ID>>([]);
  const selectedRowsData= useRef<Array<NCR_DATA>>([]);
  const clickedrow = useRef<NCR_DATA | null>(null);
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


  let column_ncrdatatable = [
    { field: "NCR_ID", headerName: "NCR_ID", width: 80, checkboxSelection: true, checkboxSelectionVisible: true },
    { field: "FACTORY", headerName: "FACTORY", width: 80 },  
    { field: "NCR_NO", headerName: "NCR_NO", width: 80 },
    { field: "NCR_DATE", headerName: "NCR_DATE", width: 80 },
    { field: "RESPONSE_REQ_DATE", headerName: "RESPONSE_REQ_DATE", width: 80 },
    { field: "CUST_CD", headerName: "CUST_CD", width: 80 },
    { field: "VENDOR", headerName: "VENDOR", width: 80 },
    { field: "M_CODE", headerName: "M_CODE", width: 80 },
    { field: "M_NAME", headerName: "M_NAME", width: 80 },
    { field: "WIDTH_CD", headerName: "WIDTH_CD", width: 80 },
    { field: "CMS_LOT", headerName: "CMS_LOT", width: 80 },
    { field: "VENDOR_LOT", headerName: "VENDOR_LOT", width: 80 },
    { field: "DEFECT_TITLE", headerName: "DEFECT_TITLE", width: 80 },
    { field: "DEFECT_DETAIL", headerName: "DEFECT_DETAIL", width: 80 },  
    { field: "DEFECT_IMAGE", headerName: "DEFECT_IMAGE", width: 80,   cellRenderer: (params: any) => {
      let file: any = null;
      const uploadFile2: any = async (e: any) => {
        //console.log(file);
        checkBP(userData, ["QC",], ["Leader","Dept Staff","Sub Leader"], ["ALL"], async () => {
          uploadQuery(file, "NCR_" + params.data.NCR_ID + ".png", "ncrimage")
            .then((response) => {
              if (response.data.tk_status !== "NG") {
                generalQuery("update_ncr_image", {
                  NCR_ID: params.data.NCR_ID,
                  imagevalue: "Y",
                })
                  .then((response) => {
                    if (response.data.tk_status !== "NG") {
                      Swal.fire(
                        "Thông báo",
                        "Upload ảnh thành công",
                        "success",
                      );
                      let tempcodeinfodatatable = ncr_data_table.map(
                        (element: NCR_DATA, index: number) => {
                          return element.NCR_ID === params.data.NCR_ID
                            ? { ...element, DEFECT_IMAGE: "Y" }
                            : element;
                        },
                      );
                      setNCRDataTable(tempcodeinfodatatable);
                    } else {
                      Swal.fire(
                        "Thông báo",
                        "Upload ảnh thất bại",
                        "error",
                      );
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              } else {
                Swal.fire(
                  "Thông báo",
                  "Upload ảnh thất bại:" + response.data.message,
                  "error",
                );
              }
            })
            .catch((error) => {
              console.log(error);
            });
        });
      };
      let hreftlink = "/ncrimage/" + "NCR_" + params.data.NCR_ID + ".png";
      if (params.data.DEFECT_IMAGE !== "N" && params.data.DEFECT_IMAGE !== null) {
        return (
          <span style={{ color: "gray" }}>
            <a target="_blank" rel="noopener noreferrer" href={hreftlink}>
              LINK
            </a>
          </span>
        );
      } else {
        return (
          <div className="uploadfile">
            <IconButton
              className="buttonIcon"
              onClick={(e) => {
                uploadFile2(e);
              }}
            >
              <AiOutlineCloudUpload color="yellow" size={15} />
              Upload
            </IconButton>
            <input
              accept=".png"
              type="file"
              onChange={(e: any) => {
                file = e.target.files[0];
                console.log(file);
              }}
            />
          </div>
        );
      }
    },},  
    { field: "PROCESS_STATUS", headerName: "PROCESS_STATUS", width: 80,
      cellRenderer: (params: any) => {
        if (params.data.PROCESS_STATUS === 'Y') {
          return <span style={{ color: "black" }}>COMPLETED</span>;
        } else if (params.data.PROCESS_STATUS === 'N') {
          return <span style={{ color: "white" }}>NOT COMPLETED</span>;
        } else {
          return <span style={{ color: "white" }}>PENDING</span>;
        }
      },  
      cellStyle: (params: any) => {
      if (params.data.PROCESS_STATUS === 'Y') {
        return { backgroundColor: '#77da41', color: 'white' };
      }
      else if (params.data.PROCESS_STATUS === 'N') {
        return { backgroundColor: '#ff0000', color: 'white' };
      }
      else {
        return { backgroundColor: '#e7a44b', color: 'white' };
      }
    }  },
    { field: "USE_YN", headerName: "USE_YN", width: 80 },
    { field: "INS_DATE", headerName: "INS_DATE", width: 80 },
    { field: "INS_EMPL", headerName: "INS_EMPL", width: 80 },
    { field: "UPD_DATE", headerName: "UPD_DATE", width: 80 },
    { field: "UPD_EMPL", headerName: "UPD_EMPL", width: 80 },
    { field: "REMARK", headerName: "REMARK", width: 80 },
  ];

  let column_holdingbyncridtable = [
    { field: "NCR_ID", headerName: "NCR_ID", width: 60, checkboxSelection: true, checkboxSelectionVisible: true },
    { field: "VENDOR_LOT", headerName: "VENDOR_LOT", width: 60 },  
    { field: "M_CODE", headerName: "M_CODE", width: 60 },
    { field: "M_NAME", headerName: "M_NAME", width: 60 },
    { field: "WIDTH_CD", headerName: "WIDTH_CD", width: 60 },
    { field: "TOTAL_HOLDING_ROLL", headerName: "TOTAL_HOLDING_ROLL", width: 60 },
    { field: "TOTAL_HOLDING_M", headerName: "TOTAL_HOLDING_M", width: 60 },
    { field: "TOTAL_HOLDING_SQM", headerName: "TOTAL_HOLDING_SQM", width: 60 },
    { field: "TYPE", headerName: "TYPE", width: 60 },
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
                //handletraIQC1Data();
                
              }}
            >
              <AiOutlineExport color="red" size={15} />
              Export NCR
            </IconButton>   
          </div>}
        columns={column_ncrdatatable}
        data={ncr_data_table}
        onCellEditingStopped={(e) => {
          //console.log(e.data)
        }} onRowClick={(e) => {
          //console.log(e.data)
          clickedrow.current = e.data;
          handletraHoldingData(e.data);          
        }} onSelectionChange={(e) => {
          //console.log(e!.api.getSelectedRows())
          selectedRowsData.current = e!.api.getSelectedRows();         
        }}
      />
    )
  }, [ncr_data_table]);
  const holding_data_table = useMemo(() => {
    return (
      <AGTable
        toolbar={
          <div>
            
          </div>}
        columns={column_holdingbyncridtable}
        data={holdingdatatable}
        onCellEditingStopped={(e) => {
          //console.log(e.data)
        }} onRowClick={(e) => {
          //console.log(e.data)
          
        }} onSelectionChange={(e) => {
          //console.log(e!.api.getSelectedRows())
             
        }}
      />
    )
  }, [holdingdatatable]);

  const handletraNCRData = () => {
    generalQuery("loadNCRData", {
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
                NCR_DATE: element.NCR_DATE === null ? "" : moment(element.NCR_DATE).utc().format("YYYY-MM-DD"),
                RESPONSE_REQ_DATE: element.RESPONSE_REQ_DATE === null ? "" : moment(element.RESPONSE_REQ_DATE).utc().format("YYYY-MM-DD"),
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
  const handletraHoldingData = (ncrDataRow: NCR_DATA) => {
    generalQuery("loadHoldingMaterialByNCR_ID", {
      NCR_ID: ncrDataRow.NCR_ID,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {          
          const loadeddata: HOLDDING_BY_NCR_ID[] = response.data.data.map(  
            (element: HOLDDING_BY_NCR_ID, index: number) => {              
              return {
                ...element,
                id: index,
              };
            },
          );
          setHoldingDataTable(loadeddata);
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
          setM_Name(response.data.data[0].M_NAME);
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
      M_CODE: m_code,
      WIDTH_CD: width_cd,
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
  
  const insertNCRData = async () => {
    if (ncr_data_table.length > 0) {
      let err_code: string = "";
      for (let i = 0; i < ncr_data_table.length; i++) {
        await generalQuery("insertNCRData", ncr_data_table[i])
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
          {isNewRegister && <div className="tracuuDataInspectionform" style={{ backgroundImage: theme.CMS.backgroundImage }}>
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
                    {m_name} | {width_cd}
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
                  insertNCRData();
                }
                else {
                  Swal.fire('Thông báo','Bấm New và Add đăng ký mới rồi hãy save','warning');
                }
              }}>Save</Button>
            </div>
          </div>}
          {!isNewRegister && <div className="tracuuDataInspectionform" style={{ backgroundImage: theme.CMS.backgroundImage }}>
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
                  insertNCRData();
                }
                else {
                  Swal.fire('Thông báo','Bấm New và Add đăng ký mới rồi hãy save','warning');
                }
              }}>Save</Button>
            </div>}
            {!isNewRegister && <div className="formbutton">
              <Button fullWidth={true} color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#4959e7', color: 'white' }} onClick={() => {
               handletraNCRData();
              }}>Tra Data</Button>          
            </div>}
          </div>}
          <div className="tracuuYCSXTable"><span style={{textAlign: 'center', fontSize: '1rem', fontWeight: 'bold', color: 'blue'}}>NCR Detail</span>
          {ncrDataTable}</div>
          <div className="tracuuDataInspectionform2">
            <b style={{ color: "blue" }}>Holding - Failing Detail</b>
            {holding_data_table}
          </div>
        </div>
      </div>
    </div>
  );
};
export default NCR_MANAGER;

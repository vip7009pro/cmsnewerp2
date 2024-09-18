import { Button, IconButton } from "@mui/material";
import moment from "moment";
import { useEffect, useMemo, useRef, useState } from "react";
import { AiFillFileAdd, AiOutlineSearch } from "react-icons/ai";
import Swal from "sweetalert2";
import { generalQuery, getAuditMode } from "../../../api/Api";
import "./INCOMMING.scss";
import { GrStatusGood } from "react-icons/gr";
import { FcCancel } from "react-icons/fc";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  DTC_DATA,
  IQC_INCOMMING_DATA,
  UserData,
} from "../../../api/GlobalInterface";
import AGTable from "../../../components/DataTable/AGTable";
const INCOMMING = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
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
  const [inputno, setInputNo] = useState("");
  const [request_empl, setrequest_empl] = useState("");
  const [remark, setReMark] = useState("");
  const [iqc1datatable, setIQC1DataTable] = useState<
    Array<IQC_INCOMMING_DATA>
  >([
    {
      id: 0,
      M_CODE: "",
      M_NAME: "",
      WIDTH_CD: 0,
      M_LOT_NO: "",
      LOT_CMS: "",
      LOT_VENDOR: "",
      CUST_CD: "",
      CUST_NAME_KD: "",
      IQC1_ID: 0,
      EXP_DATE: "",
      INPUT_LENGTH: 0,
      TOTAL_ROLL: 0,
      NQ_CHECK_ROLL: 0,
      DTC_ID: 0,
      TEST_EMPL: "",
      TOTAL_RESULT: "",
      AUTO_JUDGEMENT: "",
      NGOAIQUAN: "",
      KICHTHUOC: "",
      THICKNESS: "",
      DIENTRO: "",
      CANNANG: "",
      KEOKEO: "",
      KEOKEO2: "",
      FTIR: "",
      MAIMON: "",
      XRF: "",
      SCANBARCODE: "",
      PHTHALATE: "",
      MAUSAC: "",
      SHOCKNHIET: "",
      TINHDIEN: "",
      NHIETAM: "",
      TVOC: "",
      DOBONG: "",
      INS_DATE: "",
      INS_EMPL: "",
      UPD_DATE: "",
      UPD_EMPL: "",
      REMARK: ""
    }
  ]);
  const [dtcDataTable, setDtcDataTable] = useState<Array<DTC_DATA>>([]);
  const selectedRowsData= useRef<Array<IQC_INCOMMING_DATA>>([]);
  const [empl_name, setEmplName] = useState("");
  const [reqDeptCode, setReqDeptCode] = useState("");
  const [m_name, setM_Name] = useState("");
  const [width_cd, setWidthCD] = useState(0);
  const [in_cfm_qty, setInCFMQTY] = useState(0);
  const [roll_qty, setRollQty] = useState(0);
  const [m_code, setM_Code] = useState("");
  const [dtc_id, setDtc_ID] = useState(0);
  const [cust_cd, setCust_Cd] = useState("");
  const [cust_name_kd, setCust_Name_KD] = useState("");
  const [vendorLot, setVendorLot] = useState("");
  const [exp_date, setEXP_DATE] = useState(moment().format("YYYY-MM-DD"));
  const [total_qty, setTotal_QTY] = useState(0);
  const [total_roll, setTotal_ROLL] = useState(0);
  const [nq_qty, setNQ_QTY] = useState(0);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [vendor, setVendor] = useState("");

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
  const renderOKNGCell = (data: any, key: string) => {
    if (data[key] === 1) {
      return (
        <span style={{ color: "green", fontWeight: "bold" }}>
          OK
        </span>
      );
    } else if (data[key] === 0) {
      return (
        <span style={{ color: "red", fontWeight: "bold" }}>NG</span>
      );
    } else if (data[key] === 2) {
      return (
        <span style={{ color: "#1848FC", fontWeight: "bold" }}>
          PENDING
        </span>
      );
    } else {
      return (
        <span style={{ color: "#C1C7C3", fontWeight: "bold" }}>
          N/A
        </span>
      );
    }
  }
  let column_iqcdatatable = [
    { field: 'IQC1_ID',headerName: 'IQC1_ID', headerCheckboxSelection: true, checkboxSelection: true,resizable: true,width: 80 },
    { field: 'M_CODE',headerName: 'M_CODE', resizable: true,width: 80 },
    { field: 'M_NAME',headerName: 'M_NAME', resizable: true,width: 80 },
    { field: 'WIDTH_CD',headerName: 'SIZE', resizable: true,width: 60 },
    { field: 'M_LOT_NO',headerName: 'M_LOT_NO', resizable: true,width: 80 },
    { field: 'LOT_CMS',headerName: 'LOT_CMS', resizable: true,width: 80 },
    { field: 'LOT_VENDOR',headerName: 'LOT_VENDOR', resizable: true,width: 80 },
    { field: 'CUST_CD',headerName: 'CUST_CD', resizable: true,width: 80 },
    { field: 'CUST_NAME_KD',headerName: 'CUST_NAME_KD', resizable: true,width: 80 },
    { field: 'EXP_DATE',headerName: 'EXP_DATE', resizable: true,width: 80 },
    { field: 'INPUT_LENGTH',headerName: 'INPUT_LENGTH', resizable: true,width: 80 },
    { field: 'TOTAL_ROLL',headerName: 'TOTAL_ROLL', resizable: true,width: 80 },
    { field: 'NQ_CHECK_ROLL',headerName: 'NQ_CHECK_ROLL', resizable: true,width: 80 },
    { field: 'DTC_ID',headerName: 'DTC_ID', resizable: true,width: 80 },
    { field: 'TEST_EMPL',headerName: 'TEST_EMPL', resizable: true,width: 80 },
    { field: 'TOTAL_RESULT',headerName: 'TOTAL_RESULT', resizable: true,width: 80, cellRenderer: (params: any) => {
      if (params.data.TOTAL_RESULT === "OK") {
        return (
          <div
            style={{
              color: "white",
              fontWeight: "bold",
              backgroundColor: "#01E33F",
              textAlign: "center",
            }}
          >
            OK
          </div>
        );
      } else if (params.data.TOTAL_RESULT === "NG") {
        return (
          <div
            style={{
              color: "white",
              fontWeight: "bold",
              backgroundColor: "red",
              textAlign: "center",
            }}
          >
            NG
          </div>
        );
      } else {
        return (
          <div
            style={{
              color: "white",
              fontWeight: "bold",
              backgroundColor: "#CCCFCC",
              textAlign: "center",
            }}
          >
            N/A
          </div>
        );
      }
    } },
    { field: 'AUTO_JUDGEMENT',headerName: 'AUTO_JUDGEMENT', resizable: true,width: 80, cellRenderer:(params: any) => {
      if (params.data.AUTO_JUDGEMENT === "OK") {
        return (
          <div
            style={{
              color: "white",
              fontWeight: "normal",
              backgroundColor: "#01E33F",
              textAlign: "center",
            }}
          >
            OK
          </div>
        );
      } else if (params.data.AUTO_JUDGEMENT === "NG") {
        return (
          <div
            style={{
              color: "white",
              fontWeight: "normal",
              backgroundColor: "red",
              textAlign: "center",
            }}
          >
            NG
          </div>
        );
      } else if (params.data.AUTO_JUDGEMENT === "PENDING") {
        return (
          <div
            style={{
              color: "white",
              fontWeight: "normal",
              backgroundColor: "blue",
              textAlign: "center",
            }}
          >
            PENDING
          </div>
        );
      }
    } 
    },      
    
  ];
  const tail_column_iqcdatatable = [
    { field: 'INS_DATE',headerName: 'INS_DATE', resizable: true,width: 80  },
    { field: 'INS_EMPL',headerName: 'INS_EMPL', resizable: true,width: 80  },
    { field: 'UPD_DATE',headerName: 'UPD_DATE', resizable: true,width: 80  },
    { field: 'UPD_EMPL',headerName: 'UPD_EMPL', resizable: true,width: 80  },
    { field: 'REMARK',headerName: 'REMARK', resizable: true,width: 80  },
  ];
  let keyArray =iqc1datatable.length > 0 ? Object?.keys(iqc1datatable[0])?.filter((key: string) => key.startsWith('KQ')) : [];
  let test_item_fields: any[] = keyArray?.map((key: string) => {   
      return {
        field: key,
        headerName: key,
        resizable: true,
        width: 80,
        cellRenderer: (params: any) => renderOKNGCell(params.data, key),
      };
  });  
  column_iqcdatatable.push(...test_item_fields);
  column_iqcdatatable.push(...tail_column_iqcdatatable);
  const iqcDataTable = useMemo(() => {
    return (
      <AGTable
        toolbar={
          <div>           
            <IconButton
              className="buttonIcon"
              onClick={() => {
                setIQC1DataTable([]);
                setNewRegister(true);  
                setVendor("");              
                setVendorLot("");              
                setM_Code("");              
                setM_Name("");
              }}
            >
              <AiFillFileAdd color="green" size={15} />
              New INPUT
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
        columns={column_iqcdatatable}
        data={iqc1datatable}
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
  }, [iqc1datatable]);
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
          const loadeddata: IQC_INCOMMING_DATA[] = response.data.data.map(
            (element: IQC_INCOMMING_DATA, index: number) => {
              let keyArray = Object.keys(element).filter((key: string) => key.startsWith('KQ'));
              //check if any value of keyarray is 0 , if so return AUTO_JUDGEMENT = "NG" else return "OK"
              let auto_judgement = keyArray.some((key: string) => element[key as keyof IQC_INCOMMING_DATA] === 0) ? "NG" : "OK";
              return {
                ...element,
                AUTO_JUDGEMENT: auto_judgement,
                INS_DATE: element.INS_DATE === null ? "" : moment(element.INS_DATE).utc().format("YYYY-MM-DD HH:mm:ss"),
                UPD_DATE: element.UPD_DATE === null ? "" : moment(element.UPD_DATE).utc().format("YYYY-MM-DD HH:mm:ss"),
                EXP_DATE: element.EXP_DATE === null ? "" : moment(element.EXP_DATE).utc().format("YYYY-MM-DD"),
                id: index,
              };
            },
          );
          setIQC1DataTable(loadeddata);
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
      inputno !== "" &&      
      request_empl !== "" &&      
      nq_qty !== 0 &&
      dtc_id !== 0
    ) {
      return true;
    } else {
      return false;
    }
  };
  const addRow = async () => {
    let temp_row: IQC_INCOMMING_DATA = {
      id: iqc1datatable.length,
      IQC1_ID: iqc1datatable.length,
      M_CODE: m_code,
      M_NAME: m_name,
      WIDTH_CD: width_cd,
      M_LOT_NO: inputno,
      LOT_CMS: inputno.substring(0, 6),
      LOT_VENDOR: vendorLot,
      CUST_CD: cust_cd,
      CUST_NAME_KD: cust_name_kd,
      EXP_DATE: exp_date,
      INPUT_LENGTH: total_qty,
      TOTAL_ROLL: total_roll,
      NQ_CHECK_ROLL: nq_qty,
      DTC_ID: dtc_id,
      TEST_EMPL: request_empl,
      TOTAL_RESULT: "",
      AUTO_JUDGEMENT: "",
      NGOAIQUAN: "",
      KICHTHUOC: "",
      THICKNESS: "",
      DIENTRO: "",
      CANNANG: "",
      KEOKEO: "",
      KEOKEO2: "",
      FTIR: "",
      MAIMON: "",
      XRF: "",
      SCANBARCODE: "",
      PHTHALATE: "",
      MAUSAC: "",
      SHOCKNHIET: "",
      TINHDIEN: "",
      NHIETAM: "",
      TVOC: "",
      DOBONG: "",
      INS_DATE: "",
      INS_EMPL: "",
      UPD_DATE: "",
      UPD_EMPL: "",
      REMARK: "",
    };
    setIQC1DataTable((prev) => {
      return [...prev, temp_row];
    });
  };
  const insertIQC1Table = async () => {
    if (iqc1datatable.length > 0) {
      let err_code: string = "";
      for (let i = 0; i < iqc1datatable.length; i++) {
        await generalQuery("insertIQC1table", iqc1datatable[i])
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
    <div className="incomming">
      <div className="tracuuDataInspection">
        <div className="maintable">
          {isNewRegister && <div className="tracuuDataInspectionform" style={{ backgroundImage: theme.CMS.backgroundImage }}>
            <b style={{ color: "blue" }}>INPUT DATA KIỂM TRA INCOMMING</b>
            <div className="forminput" >
              <div className="forminputcolumn">
                <b>LOT NVL ERP</b>
                <label>
                  <input
                    type="text"
                    placeholder="202304190123"
                    value={inputno}
                    onChange={(e) => {
                      if (e.target.value.length >= 7) {
                        checkLotNVL(e.target.value);
                      }
                      setInputNo(e.target.value);
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
                <b>Hạn sử dụng</b>
                <label>
                  <input
                    type="date"
                    value={exp_date}
                    onChange={(e) => {
                      setEXP_DATE(e.target.value);
                    }}
                  ></input>
                </label>
                <b>RL NgQuan</b>
                <label>
                  <input
                    type="text"
                    value={nq_qty}
                    onChange={(e) => {
                      setNQ_QTY(Number(e.target.value));
                    }}
                  ></input>
                </label>
              </div>
              <div className="forminputcolumn">
                <b>ID TestĐTC</b>
                <label>
                  <input
                    type="text"
                    value={dtc_id}
                    onChange={(e) => {
                      setDtc_ID(Number(e.target.value));
                    }}
                  ></input>
                </label>
                <b>Mã IQC</b>
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
                {request_empl && (
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
              </div>
              <div className="forminputcolumn">
                <b>Remark</b>
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
                  insertIQC1Table();
                }
                else {
                  Swal.fire('Thông báo','Bấm New và Add đăng ký mới rồi hãy save','warning');
                }
              }}>Save</Button>
            </div>
          </div>}
          {!isNewRegister && <div className="tracuuDataInspectionform" style={{ backgroundImage: theme.CMS.backgroundImage }}>
            <b style={{ color: "blue" }}>TRA DATA INCOMMING</b>
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
                setIQC1DataTable([]);
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
                  insertIQC1Table();
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
          <div className="tracuuYCSXTable">{iqcDataTable}</div>
          <div className="tracuuDataInspectionform2">
            <b style={{ color: "blue" }}>Kết quả ĐTC</b>
            {dtc_data_table}
          </div>
        </div>
      </div>
    </div>
  );
};
export default INCOMMING;

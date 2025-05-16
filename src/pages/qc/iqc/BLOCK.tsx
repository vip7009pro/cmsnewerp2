import { Button, IconButton } from "@mui/material";
import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import { generalQuery } from "../../../api/Api";
import "./BLOCK.scss";
import { GrStatusGood } from "react-icons/gr";
import { FcCancel } from "react-icons/fc";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  CustomerListData,
  QC_FAIL_DATA,
  BLOCK_DATA,
  UserData,
} from "../../../api/GlobalInterface";
import AGTable from "../../../components/DataTable/AGTable";
import { AiFillFileAdd, AiOutlineSearch } from "react-icons/ai";
import {
  checkBP,
  f_isM_CODE_in_M140_Main,
  f_isM_LOT_NO_in_IN_KHO_SX,
  f_isM_LOT_NO_in_O302,
  f_isM_LOT_NO_in_P500,
  f_nhapkhoao,
  f_resetIN_KHO_SX_IQC1,
  f_resetIN_KHO_SX_IQC2,
  f_updateNCRIDForFailing,
  f_updateNCRIDForHolding,
} from "../../../api/GlobalFunction";
import { GiConfirmed } from "react-icons/gi";
const BLOCK = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [cmsvcheck, setCMSVCheck] = useState(true);
  const [onlyPending, setOnlyPending] = useState(true);
  const [customerList, setCustomerList] = useState<CustomerListData[]>([]);
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );
  const [testtype, setTestType] = useState("ALL");
  const [m_lot_no, setM_LOT_NO] = useState("");
  const [process_lot_no, setProcessLotNo] = useState("");
  const [request_empl, setrequest_empl] = useState("");
  const [request_empl2, setrequest_empl2] = useState("");
  const [remark, setReMark] = useState("");
  const [blockingdatatable, setBlockingDataTable] = useState<Array<BLOCK_DATA>>(
    []
  );
  const selectedRowsDataA = useRef<Array<BLOCK_DATA>>([]);
  const [empl_name, setEmplName] = useState("");
  const [empl_name2, setEmplName2] = useState("");
  const [g_name, setGName] = useState("");
  const [g_code, setGCode] = useState("");
  const [m_name, setM_Name] = useState("");
  const [width_cd, setWidthCD] = useState(0);
  const [in_cfm_qty, setInCFMQTY] = useState(0);
  const [roll_qty, setRollQty] = useState(0);
  const [m_code, setM_Code] = useState("");
  const [prodrequestno, setProdRequestNo] = useState("");
  const [planId, setPlanId] = useState("");
  const [pqc3Id, setPQC3ID] = useState(0);
  const [defect_phenomenon, setDefectPhenomenon] = useState("");
  const [prodreqdate, setProdReqDate] = useState("");
  const [vendorLot, setVendorLot] = useState("");
  const [lieql_sx, setLieuQL_SX] = useState(0);
  const [out_date, setOut_Date] = useState("");
  const [cust_cd, setCust_Cd] = useState("6969");
  const [ncrId, setNCRID] = useState(0);
  const [isNewFailing, setIsNewFailing] = useState(false);
  const column_blocking_table = [
    { field: "FACTORY", headerName: "FACTORY", resizable: true, width: 80,checkboxSelection: true,
      headerCheckboxSelection: true, },
    {
      field: "BLOCK_ID",
      headerName: "BLOCK_ID",
      resizable: true,
      width: 70,      
    },
    { field: "PHAN_LOAI", headerName: "PHAN_LOAI", resizable: true, width: 60 },
    { field: "MAKER", headerName: "MAKER", resizable: true, width: 70 },
    { field: "SUPPLIER", headerName: "SUPPLIER", resizable: true, width: 70, 
      cellRenderer: (params: any) => {
        return (
          <div style={{textAlign: 'center', fontWeight: 'normal', color: 'green',borderRadius: '5px'}}>{params.data.SUPPLIER}</div>
        )
      }
     },
    { field: "PL_BLOCK", headerName: "PL_BLOCK", resizable: true, width: 60 },
    { field: "PLAN_ID", headerName: "PLAN_ID", resizable: true, width: 60 },   
    { field: "M_CODE", headerName: "M_CODE", resizable: true, width: 80 },
    { field: "M_NAME", headerName: "M_NAME", resizable: true, width: 100, cellRenderer: (params: any) => {
      return (
        <div style={{textAlign: 'center', fontWeight: 'normal', color: 'blue',borderRadius: '5px'}}>{params.data.M_NAME}</div>
      )
    } },
    { field: "WIDTH_CD", headerName: "SIZE", resizable: true, width: 50, cellRenderer: (params: any) => {
      return (
        <div style={{textAlign: 'center', fontWeight: 'normal', color: 'blue',borderRadius: '5px'}}>{params.data.WIDTH_CD}</div>
      )
    } },
    { field: "M_LOT_NO", headerName: "M_LOT_NO", resizable: true, width: 80, cellRenderer: (params: any) => {
      if(params.data.QC_PASS === "Y") {
        return (
          <div style={{textAlign: 'center', fontWeight: 'normal', color: 'blue', backgroundColor: '#96f53d', borderRadius: '5px'}}>{params.data.M_LOT_NO}</div>
        )
      } else {
        return (
          <div style={{textAlign: 'center', fontWeight: 'normal', color: 'black', backgroundColor: '#e9dddd', borderRadius: '5px'}}>{params.data.M_LOT_NO}</div>
        )
      }
    } },
    {
      field: "LOT_VENDOR",
      headerName: "LOT_VENDOR",
      resizable: true,
      width: 150,
    },
    {
      field: "BLOCK_ROLL_QTY",
      headerName: "ROLL_QTY",
      resizable: true,
      width: 60,
    },
    {
      field: "BLOCK_TOTAL_QTY",
      headerName: "TOTAL_QTY",
      resizable: true,
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <div style={{textAlign: 'center', fontWeight: 'bold', color: 'green', borderRadius: '5px'}}>{params.data.BLOCK_TOTAL_QTY?.toLocaleString('en-US',{minimumFractionDigits: 0, maximumFractionDigits: 0})}</div>
        )
      } 
    },
   
    { field: "DEFECT", headerName: "DEFECT", resizable: true, width: 150 },
    { field: "PLSP", headerName: "PLSP", resizable: true, width: 50 },
    { field: 'QC_PASS', headerName: 'QC_PASS/FAIL', resizable: true, width: 70, cellRenderer: (params: any) => {
      if(params.data.QC_PASS === 'Y') { 
        return (
          <div style={{textAlign: 'center', fontWeight: 'bold', color: 'white', width: '100%', backgroundColor: 'green', borderRadius: '5px'}}>PASSED</div>
        )
      } else if(params.data.QC_PASS === 'N') {
        return (
          <div style={{textAlign: 'center', fontWeight: 'bold', color: 'white', width: '100%', backgroundColor: 'red', borderRadius: '5px'}}>FAILED</div>
        )
      } else {
        return (
          <div style={{textAlign: 'center', fontWeight: 'bold', color: 'black', width: '100%', backgroundColor: 'yellow', borderRadius: '5px'}}>PENDING</div>
        )
      }
    } },
    {
      field: "QC_PASS_DATE",
      headerName: "QC_PASS_DATE",
      resizable: true,
      width: 120,
    },
    {
      field: "QC_PASS_EMPL",
      headerName: "QC_PASS_EMPL",
      resizable: true,
      width: 100,
    },
    { field: "PL_BLOCK", headerName: "PL_BLOCK", resizable: true, width: 80 },
    {
      field: "STATUS",
      headerName: "STATUS",
      resizable: true,
      width: 100,
      cellRenderer: (params: any) => {
        if(params.data.STATUS === 'CLOSED') { 
          return (
            <div style={{textAlign: 'center', fontWeight: 'bold', color: 'white', width: '100%', backgroundColor: 'green', borderRadius: '5px'}}>CLOSED</div>
          )
        } else if(params.data.STATUS === 'PENDING') {
          return (
            <div style={{textAlign: 'center', fontWeight: 'bold', color: 'black', width: '100%', backgroundColor: 'yellow', borderRadius: '5px'}}>PENDING</div>
          )
        }
      } 
    },
    { field: "USE_YN", headerName: "USE_YN", resizable: true, width: 80 },
    { field: "NCR_ID", headerName: "NCR_ID", resizable: true, width: 50 },   
    {
      field: "PROCESS_LOT_NO",
      headerName: "LOT_SX",
      resizable: true,
      width: 80,
    },
    { field: "INS_DATE", headerName: "INS_DATE", resizable: true, width: 120 },
    { field: "INS_EMPL", headerName: "INS_EMPL", resizable: true, width: 100 },
    { field: "UPD_DATE", headerName: "UPD_DATE", resizable: true, width: 120 },
    { field: "UPD_EMPL", headerName: "UPD_EMPL", resizable: true, width: 100 },
  ];
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // console.log('press enter')
      e.preventDefault();
      if (checkInput()) {
        let lotArray = blockingdatatable.map(
          (element: BLOCK_DATA, index: number) => {
            return element.M_LOT_NO;
          }
        );
        if (pqc3Id !== 0) {
          if (lotArray.indexOf(m_lot_no) < 0) {
          } else {
            Swal.fire("Thông tin", "Đã thêm cuộn này rồi", "error");
          }
        } else {
          Swal.fire(
            "Thông tin",
            "Số chỉ thị này PQC chưa lập lỗi, không thêm được",
            "error"
          );
        }
      } else {
        Swal.fire(
          "Thông báo",
          "Hãy nhập đủ thông tin trước khi đăng ký",
          "error"
        );
      }
    }
  };
  const setQCPASS = async (value: string) => {
    console.log(selectedRowsDataA.current);
    if (selectedRowsDataA.current.length > 0) {
      Swal.fire({
        title: "Tra cứu vật liệu Holding",
        text: "Đang tải dữ liệu, hãy chờ chút",
        icon: "info",
        showCancelButton: false,
        allowOutsideClick: false,
        confirmButtonText: "OK",
        showConfirmButton: false,
      });
      let err_code: string = "";
      for (let i = 0; i < selectedRowsDataA.current.length; i++) {
        if(selectedRowsDataA.current[i].PL_BLOCK === "FAILING"){
          await generalQuery("updateQCPASS_FAILING", {
            FAIL_ID: selectedRowsDataA.current[i].BLOCK_ID,
            M_LOT_NO: selectedRowsDataA.current[i].M_LOT_NO,
            PLAN_ID_SUDUNG: selectedRowsDataA.current[i].PLAN_ID,
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
          
        }
        else if(selectedRowsDataA.current[i].PL_BLOCK === "HOLDING"){
          await generalQuery("updateQCPASS_HOLDING", {
            M_LOT_NO: selectedRowsDataA.current[i].M_LOT_NO,
            ID: selectedRowsDataA.current[i].BLOCK_ID,
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
          
        }
        
      }
      if (err_code === "") {
        Swal.fire("Thông báo", "SET thành công", "success");
      } else {
        Swal.fire("Thông báo", "Lỗi: " + err_code, "error");
      }
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 dòng để thực hiện", "error");
    }
  };
  const setClose = async (value: string) => {
    console.log(selectedRowsDataA.current);
    if (selectedRowsDataA.current.length > 0) {
      Swal.fire({
        title: "Đang update",
        text: "Đang tải dữ liệu, hãy chờ chút",
        icon: "info",
        showCancelButton: false,
        allowOutsideClick: false,
        confirmButtonText: "OK",
        showConfirmButton: false,
      });
      let err_code: string = "";
      for (let i = 0; i < selectedRowsDataA.current.length; i++) {
        if(selectedRowsDataA.current[i].PL_BLOCK === "FAILING"){
          await generalQuery("updateCLOSE_FAILING", {
            FAIL_ID: selectedRowsDataA.current[i].BLOCK_ID,
            M_LOT_NO: selectedRowsDataA.current[i].M_LOT_NO,
            PLAN_ID_SUDUNG: selectedRowsDataA.current[i].PLAN_ID,
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
          
        }
        else if(selectedRowsDataA.current[i].PL_BLOCK === "HOLDING"){
          await generalQuery("updateCLOSE_HOLDING", {
            HOLD_ID: selectedRowsDataA.current[i].BLOCK_ID,           
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
          
        }
       
      }
      if (err_code === "") {
        Swal.fire("Thông báo", "SET thành công", "success");
      } else {
        Swal.fire("Thông báo", "Lỗi: " + err_code, "error");
      }
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 dòng để thực hiện", "error");
    }
  };
  const setIQCConfirm = async (confirmEMPL: string) => {
    if (selectedRowsDataA.current.length > 0) {
      Swal.fire({
        title: "Tra cứu vật liệu Holding",
        text: "Đang tải dữ liệu, hãy chờ chút",
        icon: "info",
        showCancelButton: false,
        allowOutsideClick: false,
        confirmButtonText: "OK",
        showConfirmButton: false,
      });
      let err_code: string = "";
      for (let i = 0; i < selectedRowsDataA.current.length; i++) {
        await generalQuery("updateIQCConfirm_FAILING", {
          FAIL_ID: selectedRowsDataA.current[i].BLOCK_ID,
          IN2_EMPL: confirmEMPL.toUpperCase(),
        })
          // eslint-disable-next-line no-loop-func
          .then(async (response) => {
            //console.log(response.data.data);
            if (response.data.tk_status !== "NG") {
              /*  if(await f_isM_LOT_NO_in_P500(selectedRowsDataA.current[i].PLAN_ID_SUDUNG, selectedRowsDataA.current[i].M_LOT_NO)){
                await f_resetIN_KHO_SX_IQC2(selectedRowsDataA.current[i].PLAN_ID_SUDUNG, selectedRowsDataA.current[i].M_LOT_NO);        
              }  
              else 
              {
                await f_resetIN_KHO_SX_IQC1(selectedRowsDataA.current[i].PLAN_ID_SUDUNG, selectedRowsDataA.current[i].M_LOT_NO);
              } */
            } else {
              err_code += ` Lỗi: ${response.data.message}`;
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
      if (err_code === "") {
        Swal.fire("Thông báo", "Confirm thành công", "success");
      } else {
        Swal.fire("Thông báo", "Lỗi: " + err_code, "error");
      }
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 dòng để thực hiện", "error");
    }
  };
  const updateNCRIDBlocking = async () => {
    console.log(selectedRowsDataA.current);
    if (selectedRowsDataA.current.length > 0) {
      Swal.fire({
        title: "Tra cứu vật liệu Holding",
        text: "Đang tải dữ liệu, hãy chờ chút",
        icon: "info",
        showCancelButton: false,
        allowOutsideClick: false,
        confirmButtonText: "OK",
        showConfirmButton: false,
      });
      let err_code: string = "";
      for (let i = 0; i < selectedRowsDataA.current.length; i++) {
        if(selectedRowsDataA.current[i].PL_BLOCK === "FAILING"){
          await f_updateNCRIDForFailing(
            selectedRowsDataA.current[i].BLOCK_ID,
            ncrId
          );
        }
        else if(selectedRowsDataA.current[i].PL_BLOCK === "HOLDING"){
          await f_updateNCRIDForHolding(
            selectedRowsDataA.current[i].BLOCK_ID,
            ncrId
          );
        }
      }
      if (err_code === "") {
        Swal.fire("Thông báo", "SET thành công", "success");
      } else {
        Swal.fire("Thông báo", "Lỗi: " + err_code, "error");
      }
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 dòng để thực hiện", "error");
    }
  };
  const blockingDataAGTable = useMemo(() => {
    return (
      <AGTable
        toolbar={
          <>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                setIsNewFailing(false);
                handletraBlockingData();
              }}
            >
              <AiOutlineSearch color="red" size={15} />
              Tra Data
            </IconButton>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                if (userData?.SUBDEPTNAME === "IQC") {
                  //console.log(selectedRowsDataA.current);
                  setQCPASS("Y");
                } else {
                  Swal.fire(
                    "Thông báo",
                    "Bạn không phải người bộ phận IQC",
                    "error"
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
                    "error"
                  );
                }
                //checkBP(userData?.EMPL_NO,userData?.MAINDEPTNAME,['QC'], ()=>{setQCPASS('Y');});
                //checkBP(userData?.EMPL_NO,userData?.MAINDEPTNAME,['QLSX'], setQCPASS('N'));
                //setQCPASS('N');
              }}
            >
              <FcCancel color="red" size={15} />
              SET FAIL
            </IconButton>
          
            <IconButton
              className="buttonIcon"
              onClick={() => {
                if (userData?.SUBDEPTNAME === "IQC") {
                  updateNCRIDBlocking();
                }
              }}
            >
              <FcCancel color="red" size={15} />
              UPDATE NCR_ID
            </IconButton>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                if (
                  userData?.SUBDEPTNAME === "MUA" ||
                  userData?.EMPL_NO === "NHU1903"
                ) {
                  //console.log(selectedRowsDataA.current);
                  setClose("C");
                } else {
                  Swal.fire(
                    "Thông báo",
                    "Bạn không phải người bộ phận MUA",
                    "error"
                  );
                }
              }}
            >
              <GrStatusGood color="green" size={15} />
              SET CLOSED
            </IconButton>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                if (
                  userData?.SUBDEPTNAME === "MUA" ||
                  userData?.EMPL_NO === "NHU1903"
                ) {
                  //console.log(selectedRowsDataA.current);
                  setClose("P");
                } else {
                  Swal.fire(
                    "Thông báo",
                    "Bạn không phải người bộ phận MUA",
                    "error"
                  );
                }
              }}
            >
              <FcCancel color="red" size={15} />
              SET PENDING
            </IconButton>
          </>
        }
        columns={column_blocking_table}
        data={blockingdatatable}
        onCellEditingStopped={(e) => {
          //console.log(e.data)
        }}
        onRowClick={(e) => {
          //console.log(e.data)
        }}
        onSelectionChange={(e) => {
          //console.log(e!.api.getSelectedRows())
          selectedRowsDataA.current = e!.api.getSelectedRows();
        }}
      />
    );
  }, [blockingdatatable, request_empl2, onlyPending]);
  const handletraBlockingData = () => {
    generalQuery("loadBlockingData", {
      ONLY_PENDING: onlyPending,
      LOT_VENDOR: vendorLot,
      M_LOT_NO: m_lot_no,
      DEFECT: defect_phenomenon,
      NCR_ID: ncrId,
      PLSP: testtype
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: BLOCK_DATA[] = response.data.data.map(
            (element: BLOCK_DATA, index: number) => {
              return {
                ...element,
                INS_DATE:
                  element.INS_DATE === null
                    ? ""
                    : moment(element.INS_DATE)
                        .utc()
                        .format("YYYY-MM-DD HH:mm:ss"),
                UPD_DATE:
                  element.UPD_DATE === null
                    ? ""
                    : moment(element.UPD_DATE)
                        .utc()
                        .format("YYYY-MM-DD HH:mm:ss"),
                QC_PASS_DATE:
                  element.QC_PASS_DATE === null
                    ? ""
                    : moment(element.QC_PASS_DATE)
                        .utc()
                        .format("YYYY-MM-DD HH:mm:ss"),
                PROCESS_DATE: element.PROCESS_DATE === null ? "" : moment(element.PROCESS_DATE).utc().format("YYYY-MM-DD"),
                id: index,
              };
            }
          );
          setBlockingDataTable(loadeddata);
          Swal.fire(
            "Thông báo",
            "Đã load :" + loadeddata.length + " dòng",
            "success"
          );
        } else {
          Swal.fire(
            "Thông báo",
            "Không có dữ liệu",
            "error"
          );
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
  const checkPlanID = (PLAN_ID: string) => {
    generalQuery("checkPLAN_ID", { PLAN_ID: PLAN_ID })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);
          //setPlanId(PLAN_ID);
          setGName(response.data.data[0].G_NAME);
          setProdReqDate(response.data.data[0].PROD_REQUEST_DATE);
          setGCode(response.data.data[0].G_CODE);
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
  const checkPQC3_ID = (PLAN_ID: string) => {
    generalQuery("checkPQC3_IDfromPLAN_ID", { PLAN_ID: PLAN_ID })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);
          setPQC3ID(response.data.data[0].PQC3_ID ?? 0);
          setDefectPhenomenon(response.data.data[0].DEFECT_PHENOMENON ?? "");
        } else {
          setPQC3ID(0);
          setDefectPhenomenon("");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const checkLotNVL = async (M_LOT_NO: string) => {
    generalQuery("checkMNAMEfromLot", { M_LOT_NO: M_LOT_NO })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          console.log(response.data.data);
          setM_Name(
            response.data.data[0].M_NAME +
              " | " +
              response.data.data[0].WIDTH_CD
          );
          setM_Code(response.data.data[0].M_CODE);
          setWidthCD(response.data.data[0].WIDTH_CD);
          setInCFMQTY(response.data.data[0].OUT_CFM_QTY);
          setRollQty(response.data.data[0].ROLL_QTY);
          setVendorLot(response.data.data[0].LOTNCC ?? "");
          //setPlanId(response.data.data[0].PLAN_ID ?? "");
          if ((response.data.data[0].PLAN_ID ?? "").length > 7) {
            //checkPlanID(response.data.data[0].PLAN_ID);
            checkPQC3_ID(response.data.data[0].PLAN_ID);
          }
          setLieuQL_SX(
            response.data.data[0].LIEUQL_SX === null
              ? "0"
              : response.data.data[0].LIEUQL_SX
          );
          setOut_Date(response.data.data[0].OUT_DATE);
        } else {
          setM_Name("");
          setM_Code("");
          setWidthCD(0);
          setRollQty(0);
          setInCFMQTY(0);
          setLieuQL_SX(0);
          setOut_Date("");
          setVendorLot("");
          //setPlanId("");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const checkLotNVL_BTP = async (M_LOT_NO: string) => {
    generalQuery("checkMNAMEfromLot", { M_LOT_NO: M_LOT_NO })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          console.log(response.data.data);
          setM_Name(
            response.data.data[0].M_NAME +
              " | " +
              response.data.data[0].WIDTH_CD
          );
          setM_Code(response.data.data[0].M_CODE);
          setWidthCD(response.data.data[0].WIDTH_CD);
          setVendorLot(response.data.data[0].LOTNCC ?? "");
          //setPlanId(response.data.data[0].PLAN_ID ?? "");
          setLieuQL_SX(
            response.data.data[0].LIEUQL_SX === null
              ? "0"
              : response.data.data[0].LIEUQL_SX
          );
          setOut_Date(response.data.data[0].OUT_DATE);
        } else {
          setM_Name("");
          setM_Code("");
          setWidthCD(0);
          setRollQty(0);
          setInCFMQTY(0);
          setLieuQL_SX(0);
          setOut_Date("");
          setVendorLot("");
          //setPlanId("");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const checkLotProcess = (PROCESS_LOT_NO: string) => {
    generalQuery("checkProcessLotNoInfo", { PROCESS_LOT_NO: PROCESS_LOT_NO })
      .then(async (response) => {
        if (response.data.tk_status !== "NG") {
          let M_LOT_NO: string = response.data.data[0].M_LOT_NO;
          let TOTAL_IN_QTY: number = response.data.data[0].BTP_MET;
          let LOT_PLAN_ID: string = response.data.data[0].PLAN_ID;
          console.log("BTP_MET", TOTAL_IN_QTY);
          setPlanId(LOT_PLAN_ID);
          setM_LOT_NO(M_LOT_NO);
          await checkLotNVL_BTP(M_LOT_NO);
          await checkPlanID(LOT_PLAN_ID);
          await checkPQC3_ID(LOT_PLAN_ID);
          setRollQty(1);
          setInCFMQTY(TOTAL_IN_QTY);
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const checkInput = (): boolean => {
    if (m_lot_no !== "" && planId !== "" && request_empl !== "") {
      return true;
    } else {
      return false;
    }
  };
  const getcustomerlist = () => {
    generalQuery("selectcustomerList", {})
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          setCustomerList(response.data.data);
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getcustomerlist();
    ///handletraFailingData();
  }, []);
  return (
    <div className="failing">
      <div className="tracuuDataInspection">
        <div className="maintable">
          <div
            className="tracuuDataInspectionform"
            style={{ backgroundImage: theme.CMS.backgroundImage }}
          >
            <div className="forminput">
              <div className="forminputcolumn">            
                <label>
                  <b>Phân loại hàng:</b>
                  <select
                    name="phanloaihang"
                    value={testtype}
                    onChange={(e) => {
                      setTestType(e.target.value);
                    }}
                  >
                    <option value="ALL">ALL</option>
                    <option value="NVL">Vật Liệu</option>
                    <option value="BTP">Bán Thành Phẩm</option>
                    <option value="SP">Sản Phẩm</option>
                  </select>
                </label>
              </div>
                  
           
              <div className="forminputcolumn">
                <label>
                  <b>VENDOR LOT:</b>
                  <input
                    type="text"
                    placeholder={"54951949844984"}
                    value={vendorLot}
                    onChange={(e) => {
                      setVendorLot(e.target.value);
                    }}
                  ></input>
                </label>
                <label>
                  <b>DEFECT PHENOMENON:</b>
                  <input
                    type="text"
                    placeholder={"Defect content"}
                    value={defect_phenomenon}
                    onChange={(e) => {
                      setDefectPhenomenon(e.target.value);
                    }}
                  ></input>
                </label>
                
              </div>
              <div className="forminputcolumn">
               
                <label>
                  <b>Remark:</b>
                  <input
                    type="text"
                    placeholder={"Ghi chú"}
                    value={remark}
                    onChange={(e) => {
                      setReMark(e.target.value);
                    }}
                  ></input>
                </label>
                <label>
                  <b>NCR_ID</b>
                  <input
                    type="number"
                    placeholder={"NCR_ID"}
                    value={ncrId}
                    onChange={(e) => {
                      setNCRID(parseInt(e.target.value));
                    }}
                  ></input>
                </label>
              </div>
              <div className="forminputcolumn">
              <label>
                  <b>ONLY PENDING STATUS:</b>
                  <input
                    type="checkbox"
                    name="alltimecheckbox"
                    defaultChecked={onlyPending}
                    onChange={(e) => {
                      setOnlyPending((prev) => !prev);
                    }}
                  ></input>
                </label>               
                <div
                  className="btdiv"
                  style={{ display: "flex", gap: "10px" }}
                ></div>
              </div>
            </div>
            <div className="formbutton">
            <IconButton
              className="buttonIcon"
              onClick={() => {
                setIsNewFailing(false);
                handletraBlockingData();
              }}
            >
              <AiOutlineSearch color="red" size={15} />
              Tra Data
            </IconButton>
              
            </div>
          </div>
          <div className="tracuuYCSXTable">{blockingDataAGTable}</div>
        </div>
      </div>
    </div>
  );
};
export default BLOCK;

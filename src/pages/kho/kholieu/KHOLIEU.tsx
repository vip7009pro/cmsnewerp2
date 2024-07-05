import { Button, IconButton } from "@mui/material";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import Swal from "sweetalert2";
import { generalQuery, getAuditMode } from "../../../api/Api";
import { checkBP } from "../../../api/GlobalFunction";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import "./KHOLIEU.scss";
import {
  NHAPLIEUDATA,
  TONLIEUDATA,
  UserData,
  XUATLIEUDATA,
} from "../../../api/GlobalInterface";
import NHAPLIEU from "./nhaplieu/NHAPLIEU";
import XUATLIEU from "./xuatlieu/XUATLIEU";
import AGTable from "../../../components/DataTable/AGTable";
const KHOLIEU = () => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData,
  );
  const [readyRender, setReadyRender] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [m_name, setM_Name] = useState("");
  const [m_code, setM_Code] = useState("");
  const [codeKD, setCodeKD] = useState("");
  const [prod_request_no, setProd_Request_No] = useState("");
  const [plan_id, setPlanID] = useState("");
  const [alltime, setAllTime] = useState(false);
  const [justbalancecode, setJustBalanceCode] = useState(true);
  const [whdatatable, setWhDataTable] = useState<Array<any>>([]);
  const [sumaryWH, setSummaryWH] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [lotncc, setLOTNCC] = useState("");
  const [inputlieufilter, setInputLieuFilter] = useState<NHAPLIEUDATA[]>([]);
  const [shownhaplieu, setShowNhapLieu] = useState(false);
  const [showxuatlieu, setShowXuatLieu] = useState(false);
  const column_STOCK_LIEU = [
    { field: "M_CODE", headerName: "M_CODE", width: 90 },
    { field: "M_NAME", headerName: "M_NAME", width: 180 },
    { field: "WIDTH_CD", headerName: "WIDTH_CD", width: 90 },
    {
      field: "TON_NM1",
      headerName: "TON_NM1",
      width: 120,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "gray" }}>
            <b>{params.data.TON_NM1?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "TON_NM2",
      headerName: "TON_NM2",
      width: 120,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "gray" }}>
            <b>{params.data.TON_NM2?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "HOLDING_NM1",
      headerName: "HOLDING_NM1",
      width: 100,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            <b>{params.data.HOLDING_NM1?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "HOLDING_NM2",
      headerName: "HOLDING_NM2",
      width: 100,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            <b>{params.data.HOLDING_NM2?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "TOTAL_OK",
      headerName: "TOTAL_OK",
      width: 150,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>{params.data.TOTAL_OK?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "TOTAL_HOLDING",
      headerName: "TOTAL_HOLDING",
      width: 150,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            <b>{params.data.TOTAL_HOLDING?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "TDS",
      headerName: "TDS",
      width: 150,
      cellRenderer: (params: any) => {
        let hreftlink = "/tds/" + params.data.M_CODE + ".pdf";
        if (params.data.TDS === "Y") {
          return (
            <span style={{ color: "gray" }}>
              <a target="_blank" rel="noopener noreferrer" href={hreftlink}>
                LINK
              </a>
            </span>
          );
        } else {
          return <span style={{ color: "gray" }}>Chưa có TDS</span>;
        }
      },
    },
  ];
  const column_XUATLIEUDATA = [
    { field: "G_CODE", headerName: "G_CODE", width: 100 },
    { field: "G_NAME", headerName: "G_NAME", width: 220 },
    { field: "PROD_REQUEST_NO", headerName: "SO YCSX", width: 90 },
    { field: "PLAN_ID", headerName: "PLAN_ID", width: 90 },
    { field: "M_CODE", headerName: "M_CODE", width: 100 },
    { field: "M_NAME", headerName: "M_NAME", width: 180 },
    { field: "WIDTH_CD", headerName: "WIDTH_CD", width: 90 },
    { field: "LOTNCC", headerName: "LOTNCC", width: 100 },
    { field: "M_LOT_NO", headerName: "M_LOT_NO", width: 100 },
    {
      field: "OUT_CFM_QTY",
      headerName: "UNIT_QTY",
      width: 120,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>{params.data.OUT_CFM_QTY?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    { field: "ROLL_QTY", headerName: "ROLL_QTY", width: 100 },
    {
      field: "TOTAL_OUT_QTY",
      headerName: "OUTPUT QTY",
      width: 120,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>{params.data.TOTAL_OUT_QTY?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    { field: "INS_DATE", headerName: "INS_DATE", width: 150 },
    { field: "INS_EMPL", headerName: "NV_GIAO", width: 80 },
    { field: "INS_RECEPTION", headerName: "NV_NHAN", width: 80 },
  ];
  const column_NHAPLIEUDATA = [
    { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 150 },
    { field: "LOTNCC", headerName: "LOTNCC", width: 120 },
    { field: "M_LOT_NO", headerName: "M_LOT_NO", width: 90 },
    { field: "M_CODE", headerName: "M_CODE", width: 100 },
    { field: "M_NAME", headerName: "M_NAME", width: 180 },
    { field: "WIDTH_CD", headerName: "WIDTH_CD", width: 150 },
    {
      field: "IN_CFM_QTY",
      headerName: "UNIT QTY",
      width: 120,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>{params.data.IN_CFM_QTY?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    { field: "ROLL_QTY", headerName: "ROLL_QTY", width: 100 },
    {
      field: "TOTAL_IN_QTY",
      headerName: "INPUT QTY",
      width: 120,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>{params.data.TOTAL_IN_QTY?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    { field: "INS_DATE", headerName: "INS_DATE", width: 150 },
    { field: "QC_PASS", headerName: "QC_PASS", width: 180 },
    { field: "QC_PASS_EMPL", headerName: "QC_PASS_EMPL", width: 180 },
    { field: "QC_PASS_DATE", headerName: "QC_PASS_DATE", width: 180 },
  ];
  const [columnDefinition, setColumnDefinition] =
    useState<Array<any>>(column_XUATLIEUDATA);
  const handletra_inputlieu = () => {
    setSummaryWH("");
    setisLoading(true);
    let roll_no_array = rollNo.trim().split("-");
    generalQuery("tranhaplieu", {
      M_NAME: m_name,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      ROLL_NO_START: roll_no_array.length === 2 ? roll_no_array[0] : "",
      ROLL_NO_STOP: roll_no_array.length === 2 ? roll_no_array[1] : "",
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: NHAPLIEUDATA[] = response.data.data.map(
            (element: NHAPLIEUDATA, index: number) => {
              return {
                ...element,
                id: index,
                INS_DATE: moment
                  .utc(element.INS_DATE)
                  .format("YYYY-MM-DD HH:mm:ss"),
                QC_PASS_DATE:
                  element.QC_PASS_DATE !== null
                    ? moment
                      .utc(element.QC_PASS_DATE)
                      .format("YYYY-MM-DD HH:mm:ss")
                    : "",
              };
            },
          );
          setWhDataTable(loadeddata);
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
  };
  const handletra_outputlieu = () => {
    setisLoading(true);
    generalQuery("traxuatlieu", {
      G_NAME: codeKD,
      ALLTIME: alltime,
      JUSTBALANCE: justbalancecode,
      PROD_REQUEST_NO: prod_request_no,
      M_NAME: m_name,
      M_CODE: m_code,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      PLAN_ID: plan_id,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: XUATLIEUDATA[] = response.data.data.map(
            (element: XUATLIEUDATA, index: number) => {
              return {
                ...element,
                G_NAME: getAuditMode() == 0? element?.G_NAME : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME : 'TEM_NOI_BO',
                id: index,
                INS_DATE: moment
                  .utc(element.INS_DATE)
                  .format("YYYY-MM-DD HH:mm:ss"),
              };
            },
          );
          setWhDataTable(loadeddata);
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
  };
  const handletraWHSTOCKLIEU = () => {
    setSummaryWH("");
    setisLoading(true);
    generalQuery("tratonlieu", {
      M_CODE: m_code,
      M_NAME: m_name,
      JUSTBALANCE: justbalancecode,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: TONLIEUDATA[] = response.data.data.map(
            (element: TONLIEUDATA, index: number) => {
              return {
                ...element,
                id: index,
              };
            },
          );
          setWhDataTable(loadeddata);
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
  };
  const updatelotNCC = () => {
    if (lotncc !== "") {
      if (inputlieufilter.length > 0) {
        let err_code: string = "";
        for (let i = 0; i < inputlieufilter.length; i++) {
          generalQuery("updatelieuncc", {
            M_LOT_NO: inputlieufilter[i].M_LOT_NO,
            LOTNCC: lotncc,
          })
            .then((response) => {
              //console.log(response.data.data);
              if (response.data.tk_status !== "NG") {
              } else {
                err_code += ` Có lỗi: ${response.data.message} | `;
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
        if (err_code === "") {
          Swal.fire("Thông báo", "Update lot NCC thành công", "success");
        } else {
          Swal.fire(
            "Thông báo",
            "Update lot NCC thất bại: " + err_code,
            "error",
          );
        }
      } else {
        Swal.fire("Thông báo", "Xin hãy chọn ít nhất một dòng", "warning");
      }
    }
  };
  const warehouseDataTableAG = useMemo(()=> {
    return (
      <AGTable
        toolbar={
          <div>            
          </div>}
        columns={columnDefinition}
        data={whdatatable}
        onCellEditingStopped={(params: any) => {
          //console.log(e.data)
        }} onRowClick={(params: any) => {
          //console.log(e.data)
        }} onSelectionChange={(params: any) => {
          //console.log(e!.api.getSelectedRows())
        }}
      />
    )
  },[whdatatable,columnDefinition])

  useEffect(() => { }, []);
  return (
    <div className="kholieu">
      <div className="tracuuDataWHform">
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
              <b>Code KD:</b>{" "}
              <input
                type="text"
                placeholder="GH63-14904A"
                value={codeKD}
                onChange={(e) => setCodeKD(e.target.value)}
              ></input>
            </label>
            <label>
              <b>YCSX:</b>{" "}
              <input
                type="text"
                placeholder="1F80008"
                value={prod_request_no}
                onChange={(e) => setProd_Request_No(e.target.value)}
              ></input>
            </label>
          </div>
          <div className="forminputcolumn">
            <label>
              <b>PLAN_ID:</b>{" "}
              <input
                type="text"
                placeholder="1F80008A"
                value={plan_id}
                onChange={(e) => setPlanID(e.target.value)}
              ></input>
            </label>
            <label>
              <b>STT Cuộn:</b>{" "}
              <input
                type="text"
                placeholder="1-120"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
              ></input>
            </label>
            <label>
              LOT NCC:
              <input
                type="text"
                value={lotncc}
                onChange={(e) => {
                  setLOTNCC(e.target.value);
                }}
              ></input>
            </label>
            <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#2639F6' }} onClick={() => {
          if (userData?.SUBDEPTNAME === "IQC") {
            //checkBP(userData?.EMPL_NO,userData?.MAINDEPTNAME,['QC','KHO'], updatelotNCC);
            checkBP(
              userData,
              ["QC", "KHO"],
              ["ALL"],
              ["ALL"],
              updatelotNCC,
            );
          } else {
            Swal.fire("Thông báo", "Bạn không phải người IQC", "error");
          }
        }}>UPD LOT NCC</Button>
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
              <b>Chỉ code có tồn:</b>
              <input
                type="checkbox"
                name="alltimecheckbox"
                defaultChecked={justbalancecode}
                onChange={() => setJustBalanceCode(!justbalancecode)}
              ></input>
            </label>
          </div>
        </div>
        <div className="formbutton">
          <Button color={'primary'} variant="contained" size="small" fullWidth={true} sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: 'red' }} onClick={() => {
            setisLoading(true);
            setReadyRender(false);
            setColumnDefinition(column_NHAPLIEUDATA);
            handletra_inputlieu();
          }}>Data Nhập</Button>
          <Button color={'primary'} variant="contained" size="small" fullWidth={true} sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#36D334' }} onClick={() => {
            setisLoading(true);
            setReadyRender(false);
            setColumnDefinition(column_XUATLIEUDATA);
            handletra_outputlieu();
          }}>Data Xuất</Button>
          <Button color={'primary'} variant="contained" size="small" fullWidth={true} sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: 'yellow', color: 'black' }} onClick={() => {
            setisLoading(true);
            setReadyRender(false);
            setColumnDefinition(column_STOCK_LIEU);
            handletraWHSTOCKLIEU();
          }}>Tồn Liệu</Button>
        </div>
        {/* <div className="toolbardiv" style={{display:'flex', gap:'10px'}}>        
          <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#e6d53c', color:'black' }} onClick={() => { 
              checkBP(
                userData,
                ["KHO"],
                ["ALL"],
                ["ALL"],
                ()=> {
                  setShowNhapLieu(true);
                  setShowXuatLieu(false);
                },
              );            
          }}>Nhập</Button>
          <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#db3823', color:'white' }} onClick={() => { 
              checkBP(
                userData,
                ["KHO"],
                ["ALL"],
                ["ALL"],
                ()=> {
                  setShowNhapLieu(false);
                  setShowXuatLieu(true);
                },
              );            
          }}>Xuất</Button>
      </div> */}
      </div>
      <div className="tracuuWHTable">        
        {warehouseDataTableAG}
      </div>
      {shownhaplieu &&<div className="nhaplieudiv">     
       <div>
        Nhập vật liệu vào kho
        <IconButton
            className="buttonIcon"
            onClick={() => {
              setShowNhapLieu(false);
              setShowXuatLieu(false);              
            }}
          >
            <AiFillCloseCircle color="blue" size={15} />
            Close
          </IconButton>
        </div>
         <NHAPLIEU/>
        
      </div>}
      {showxuatlieu &&<div className="xuatlieudiv">     
       <div>
        Xuất vật liệu
        <IconButton
            className="buttonIcon"
            onClick={() => {
              setShowXuatLieu(false);
              setShowNhapLieu(false);
            }}
          >
            <AiFillCloseCircle color="blue" size={15} />
            Close
          </IconButton>
        </div>
         <XUATLIEU/>
        
      </div>}
    </div>
  );
};
export default KHOLIEU;

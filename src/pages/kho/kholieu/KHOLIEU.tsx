import { Button, Icon, IconButton } from "@mui/material";
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
import { MdInput, MdOutput } from "react-icons/md";
const KHOLIEU = () => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData,
  );
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
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
    { field: "M_CODE", headerName: "M_CODE", width: 50 },
    { field: "M_NAME", headerName: "M_NAME", width: 100 },
    { field: "WIDTH_CD", headerName: "WIDTH_CD", width: 60 },
    {
      field: "TON_NM1",
      headerName: "TON_NM1",
      width: 60,
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
      width: 60,
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
      width: 80,
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
      width: 80,
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
      width: 80,
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
      width: 90,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            <b>{params.data.TOTAL_HOLDING?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },        
  ];
  const column_XUATLIEUDATA = [
    { field: "G_CODE", headerName: "G_CODE", width: 50 },
    { field: "G_NAME", headerName: "G_NAME", width: 100 },
    { field: "PROD_REQUEST_NO", headerName: "SO YCSX", width: 50 },
    { field: "PLAN_ID", headerName: "PLAN_ID", width: 50 },
    { field: "M_CODE", headerName: "M_CODE", width: 50 },
    { field: "M_NAME", headerName: "M_NAME", width: 90 },
    { field: "WIDTH_CD", headerName: "WIDTH_CD", width: 60 },
    { field: "LOTNCC", headerName: "LOTNCC", width: 90 },
    { field: "M_LOT_NO", headerName: "M_LOT_NO", width: 60 },
    {
      field: "OUT_CFM_QTY",
      headerName: "UNIT_QTY",
      width: 60,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>{params.data.OUT_CFM_QTY?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    { field: "ROLL_QTY", headerName: "ROLL_QTY", width: 60 },
    {
      field: "TOTAL_OUT_QTY",
      headerName: "OUTPUT QTY",
      width: 70,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>{params.data.TOTAL_OUT_QTY?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    { field: "INS_DATE", headerName: "INS_DATE", width: 100 },
    { field: "INS_EMPL", headerName: "NV_GIAO", width: 60 },
    { field: "INS_RECEPTION", headerName: "NV_NHAN", width: 60 },
  ];
  const column_NHAPLIEUDATA = [
    { field: "MAKER", headerName: "MAKER", width: 80 },
    { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 80 },
    { field: "LOTNCC", headerName: "LOTNCC", width: 60 },
    { field: "M_LOT_NO", headerName: "M_LOT_NO", width: 70 },
    { field: "M_CODE", headerName: "M_CODE", width: 50 },
    { field: "M_NAME", headerName: "M_NAME", width: 100 },
    { field: "WIDTH_CD", headerName: "WIDTH_CD", width: 60 },
    {
      field: "IN_CFM_QTY",
      headerName: "UNIT QTY",
      width: 60,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>{params.data.IN_CFM_QTY?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    { field: "ROLL_QTY", headerName: "ROLL_QTY", width: 60 },
    {
      field: "TOTAL_IN_QTY",
      headerName: "INPUT QTY",
      width: 60,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>{params.data.TOTAL_IN_QTY?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    { field: "USE_YN", headerName: "USE_YN", width: 60, cellStyle: (params: any) => {
      if (params.data.USE_YN !== "X") { 
        return (
          {backgroundColor: "green", color: "white", textAlign: "center"}
        );
      } else {
        return (
          {backgroundColor: "red", color: "white", textAlign: "center"}
        );
      }
    } },


    { field: "INVOICE", headerName: "INVOICE", width: 100 },
    { field: "EXP_DATE", headerName: "EXP_DATE", width: 60, cellRenderer: (params: any) => {
      if (new Date(params.data.EXP_DATE) > new Date()) {
      return (
        <span style={{ color: "green" }}>
          <b>{params.data.EXP_DATE?.toLocaleString("en-US")}</b>
        </span>
      );
    } else {
      return (
        <span style={{ color: "red" }}>
          <b>{params.data.EXP_DATE?.toLocaleString("en-US")}</b>
        </span>
      );
    }
    }},
    { field: "PHAN_LOAI", headerName: "PHAN_LOAI", width: 60 },
    { field: "FACTORY", headerName: "FACTORY", width: 60 },
    { field: "LOC_CD", headerName: "LOC_CD", width: 60 },
    { field: "INS_DATE", headerName: "INS_DATE", width: 100 },
    { field: "QC_PASS", headerName: "QC_PASS", width: 70 },
    { field: "QC_PASS_EMPL", headerName: "QC_PASS_EMPL", width: 90 },
    { field: "QC_PASS_DATE", headerName: "QC_PASS_DATE", width: 90 },
  ];70
  const [columnDefinition, setColumnDefinition] =
    useState<Array<any>>(column_XUATLIEUDATA);
  const handletra_inputlieu = () => {
    Swal.fire({
      title: "Tra data",
      text: "Đang tra data",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });
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
                EXP_DATE:
                  element.EXP_DATE !== null
                    ? moment
                      .utc(element.EXP_DATE)
                      .format("YYYY-MM-DD")
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
          setWhDataTable([]);
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
          setisLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handletra_outputlieu = () => {
    Swal.fire({
      title: "Tra data",
      text: "Đang tra data",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });
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
          setWhDataTable([]);
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
          setisLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handletraWHSTOCKLIEU = () => {
    Swal.fire({
      title: "Tra data",
      text: "Đang tra data",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });
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
          setWhDataTable([]);
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
            <IconButton
              className="buttonIcon"
              onClick={() => {
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
              }}
            >
              <MdInput color="green" size={15} />
              Nhập Liệu
            </IconButton>
            <IconButton
              className="buttonIcon"
              onClick={() => {
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
              }}
            >
              <MdOutput color="red" size={15} />
              Xuất liệu
            </IconButton>      
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
      <div className="tracuuDataWHform" style={{ backgroundImage: theme.CMS.backgroundImage }}>
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
      </div>
      <div className="tracuuWHTable">        
        {warehouseDataTableAG}
      </div>
      {shownhaplieu &&<div className="nhaplieudiv" >     
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

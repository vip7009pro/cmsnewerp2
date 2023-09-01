import { IconButton, LinearProgress } from "@mui/material";
import {
  DataGrid,
  GridCallbackDetails,
  GridCellEditCommitParams,
  GridSelectionModel,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  MuiBaseEvent,
  MuiEvent,
} from "@mui/x-data-grid";
import moment from "moment";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { AiFillFileExcel } from "react-icons/ai";
import Swal from "sweetalert2";
import { generalQuery } from "../../../api/Api";
import { UserContext } from "../../../api/Context";
import { SaveExcel, checkBP } from "../../../api/GlobalFunction";
import { RootState } from "../../../redux/store";
import { useSelector, useDispatch } from "react-redux";

import "./KHOLIEU.scss";
import {
  NHAPLIEUDATA,
  TONLIEUDATA,
  UserData,
  XUATLIEUDATA,
} from "../../../api/GlobalInterface";

const KHOLIEU = () => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData,
  );
  const [readyRender, setReadyRender] = useState(false);
  const [selection, setSelection] = useState<any>({
    trapo: true,
    thempohangloat: false,
    them1po: false,
    them1invoice: false,
    themycsx: false,
    suaycsx: false,
    inserttableycsx: false,
    renderycsx: false,
    renderbanve: false,
    amazontab: false,
  });
  const [isLoading, setisLoading] = useState(false);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [m_name, setM_Name] = useState("");
  const [m_code, setM_Code] = useState("");
  const [codeKD, setCodeKD] = useState("");
  const [codeCMS, setCodeCMS] = useState("");
  const [cust_name, setCustName] = useState("");
  const [prod_request_no, setProd_Request_No] = useState("");
  const [plan_id, setPlanID] = useState("");
  const [alltime, setAllTime] = useState(false);
  const [justbalancecode, setJustBalanceCode] = useState(true);
  const [whdatatable, setWhDataTable] = useState<Array<any>>([]);
  const [sumaryWH, setSummaryWH] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [lotncc, setLOTNCC] = useState("");
  const [inputlieufilter, setInputLieuFilter] = useState<NHAPLIEUDATA[]>([]);
  const column_STOCK_LIEU = [
    { field: "M_CODE", headerName: "M_CODE", width: 90 },
    { field: "M_NAME", headerName: "M_NAME", width: 180 },
    { field: "WIDTH_CD", headerName: "WIDTH_CD", width: 90 },
    {
      field: "TON_NM1",
      headerName: "TON_NM1",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "gray" }}>
            <b>{params.row.TON_NM1?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "TON_NM2",
      headerName: "TON_NM2",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "gray" }}>
            <b>{params.row.TON_NM2?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "HOLDING_NM1",
      headerName: "HOLDING_NM1",
      width: 100,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            <b>{params.row.HOLDING_NM1?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "HOLDING_NM2",
      headerName: "HOLDING_NM2",
      width: 100,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            <b>{params.row.HOLDING_NM2?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "TOTAL_OK",
      headerName: "TOTAL_OK",
      width: 150,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>{params.row.TOTAL_OK?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "TOTAL_HOLDING",
      headerName: "TOTAL_HOLDING",
      width: 150,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            <b>{params.row.TOTAL_HOLDING?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "TDS",
      headerName: "TDS",
      width: 150,
      renderCell: (params: any) => {
        let hreftlink = "/tds/" + params.row.M_CODE + ".pdf";
        if (params.row.TDS === "Y") {
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
    { field: "M_LOT_NO", headerName: "M_LOT_NO", width: 100 },
    {
      field: "OUT_CFM_QTY",
      headerName: "UNIT_QTY",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>{params.row.OUT_CFM_QTY?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    { field: "ROLL_QTY", headerName: "ROLL_QTY", width: 100 },
    {
      field: "TOTAL_OUT_QTY",
      headerName: "OUTPUT QTY",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>{params.row.TOTAL_OUT_QTY?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    { field: "INS_DATE", headerName: "INS_DATE", width: 180 },
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
      renderCell: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>{params.row.IN_CFM_QTY?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    { field: "ROLL_QTY", headerName: "ROLL_QTY", width: 100 },
    {
      field: "TOTAL_IN_QTY",
      headerName: "INPUT QTY",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>{params.row.TOTAL_IN_QTY?.toLocaleString("en-US")}</b>
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
  function CustomToolbarPOTable() {
    return (
      <GridToolbarContainer>
        <IconButton
          className="buttonIcon"
          onClick={() => {
            SaveExcel(whdatatable, "WareHouse Data Table");
          }}
        >
          <AiFillFileExcel color="green" size={25} />
          SAVE
        </IconButton>
        <GridToolbarQuickFilter />
        <span
          style={{
            fontWeight: "bold",
            fontSize: 18,
            paddingLeft: 20,
            color: "blue",
          }}
        >
          {sumaryWH}
        </span>
      </GridToolbarContainer>
    );
  }
  const bangdata = useMemo(() => {
    return (
      <DataGrid
        sx={{ fontSize: "0.7rem", flex: 1 }}
        components={{
          Toolbar: CustomToolbarPOTable,
          LoadingOverlay: LinearProgress,
        }}
        loading={isLoading}
        rowHeight={30}
        rows={whdatatable}
        columns={columnDefinition}
        disableSelectionOnClick
        checkboxSelection
        editMode="cell"
        rowsPerPageOptions={[5, 10, 50, 100, 500, 1000, 5000, 10000, 500000]}
        onSelectionModelChange={(ids) => {
          handleInputLieuDataSelectionforUpdate(ids);
        }}
        onCellEditCommit={(
          params: GridCellEditCommitParams,
          event: MuiEvent<MuiBaseEvent>,
          details: GridCallbackDetails,
        ) => {
          const keyvar = params.field;
          const newdata = whdatatable.map((p) =>
            p.id === params.id ? { ...p, [keyvar]: params.value } : p,
          );
          //setPlanDataTable(newdata);
          //console.log(plandatatable);
        }}
      />
    );
  }, [whdatatable]);
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

  const handleInputLieuDataSelectionforUpdate = (ids: GridSelectionModel) => {
    const selectedID = new Set(ids);
    let datafilter = whdatatable.filter((element: any) =>
      selectedID.has(element.id),
    );
    //console.log(datafilter);
    if (datafilter.length > 0) {
      setInputLieuFilter(datafilter);
    } else {
      setInputLieuFilter([]);
      //console.log("xoa filter");
    }
  };

  useEffect(() => {}, []);
  return (
    <div className="kholieu">
      <div className="tracuuDataWH">
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
            <button
              className="tranhapkiembutton"
              onClick={() => {
                setisLoading(true);
                setReadyRender(false);
                setColumnDefinition(column_NHAPLIEUDATA);
                handletra_inputlieu();
              }}
            >
              Nhập Liệu
            </button>
            <button
              className="tranhapkiembutton"
              onClick={() => {
                setisLoading(true);
                setReadyRender(false);
                setColumnDefinition(column_XUATLIEUDATA);
                handletra_outputlieu();
              }}
            >
              Xuất Liệu
            </button>
            <button
              className="traxuatkiembutton"
              onClick={() => {
                setisLoading(true);
                setReadyRender(false);
                setColumnDefinition(column_STOCK_LIEU);
                handletraWHSTOCKLIEU();
              }}
            >
              Tồn Liệu
            </button>
            <button
              className="tranhatky"
              onClick={() => {
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
                //updatelotNCC();
              }}
            >
              UPD LOT NCC
            </button>
            LOT NCC:
            <input
              type="text"
              value={lotncc}
              onChange={(e) => setLOTNCC(e.target.value)}
            ></input>
          </div>
        </div>
        <div className="tracuuWHTable">{readyRender && bangdata}</div>
      </div>
    </div>
  );
};
export default KHOLIEU;

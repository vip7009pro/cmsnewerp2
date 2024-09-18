import { Button } from "@mui/material";
import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import { generalQuery } from "../../../api/Api";
import "./HOLDING.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { HOLDING_DATA, UserData } from "../../../api/GlobalInterface";
import AGTable from "../../../components/DataTable/AGTable";
import { f_updateNCRIDForHolding } from "../../../api/GlobalFunction";

const HOLDING = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const selectedRowsData = useRef<Array<HOLDING_DATA>>([],);
  const userData: UserData | undefined = useSelector((state: RootState) => state.totalSlice.userData,);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [codeKD, setCodeKD] = useState("");
  const [alltime, setAllTime] = useState(true);
  const [id, setID] = useState("");
  const [holdingdatatable, setHoldingDataTable] = useState<Array<any>>([]);
  const [m_name, setM_Name] = useState("");
  const [m_code, setM_Code] = useState("");
  const [mLotNo, setMLotNo] = useState("");
  const [mStatus, setMStatus] = useState("ALL");
  const [ncrId, setNCRID] = useState(0);

  const column_holding_table = [
    { field: 'HOLD_ID',headerName: 'HOLD_ID', headerCheckboxSelection: true, checkboxSelection: true, resizable: true,width: 100 },
    { field: 'HOLDING_MONTH',headerName: 'HOLDING_MONTH', resizable: true,width: 100 },
    { field: 'FACTORY',headerName: 'FACTORY', resizable: true,width: 100 },
    { field: 'WAHS_CD',headerName: 'WAHS_CD', resizable: true,width: 100 },
    { field: 'LOC_CD',headerName: 'LOC_CD', resizable: true,width: 100 },
    { field: 'M_LOT_NO',headerName: 'M_LOT_NO', resizable: true,width: 100 },
    { field: 'M_CODE',headerName: 'M_CODE', resizable: true,width: 100 },
    { field: 'M_NAME',headerName: 'M_NAME', resizable: true,width: 100 },
    { field: 'WIDTH_CD',headerName: 'WIDTH_CD', resizable: true,width: 100 },
    { field: 'HOLDING_ROLL_QTY',headerName: 'HOLDING_ROLL_QTY', resizable: true,width: 100 },
    { field: 'HOLDING_QTY',headerName: 'HOLDING_QTY', resizable: true,width: 100 },
    { field: 'HOLDING_TOTAL_QTY',headerName: 'HOLDING_TOTAL_QTY', resizable: true,width: 100 },
    { field: 'REASON',headerName: 'REASON', resizable: true,width: 100 },
    { field: 'HOLDING_IN_DATE',headerName: 'HOLDING_IN_DATE', resizable: true,width: 100 },
    { field: 'HOLDING_OUT_DATE',headerName: 'HOLDING_OUT_DATE', resizable: true,width: 100 },
    { field: 'VENDOR_LOT',headerName: 'VENDOR_LOT', resizable: true,width: 100 },
    { field: 'USE_YN',headerName: 'USE_YN', resizable: true,width: 100 },
    { field: 'INS_DATE',headerName: 'INS_DATE', resizable: true,width: 100 },
    { field: 'INS_EMPL',headerName: 'INS_EMPL', resizable: true,width: 100 },
    { field: 'UPD_DATE',headerName: 'UPD_DATE', resizable: true,width: 100 },
    { field: 'UPD_EMPL',headerName: 'UPD_EMPL', resizable: true,width: 100 },
    { field: 'QC_PASS',headerName: 'QC_PASS', resizable: true,width: 100 },
    { field: 'QC_PASS_DATE',headerName: 'QC_PASS_DATE', resizable: true,width: 100 },
      { field: 'QC_PASS_EMPL',headerName: 'QC_PASS_EMPL', resizable: true,width: 100 },
   
  ];

  const updateNCRIDHolding = async () => {  
    if (selectedRowsData.current.length > 0) {
      if (ncrId ===0) {
        Swal.fire("Thông báo", "NCR ID phải khác 0", "error");
        return;
      }
      Swal.fire({
        title: "UPDATE NCR ID",
        text: "Đang UPDATE NCR ID",
        icon: "info",
        showCancelButton: false,  
        allowOutsideClick: false,
        confirmButtonText: "OK",
        showConfirmButton: false,
      });
      let err_code: string = "";
      for (let i = 0; i < selectedRowsData.current.length; i++) {
       await f_updateNCRIDForHolding(selectedRowsData.current[i].HOLD_ID, ncrId);
      }
      if (err_code === "") {
        Swal.fire("Thông báo", "UPDATE thành công", "success"); 
      } else {
        Swal.fire("Thông báo", "Lỗi: " + err_code, "error");
      }
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 dòng để thực hiện", "error");
    }
  };  
  const setQCPASS = async (value: string) => {
    //console.log(selectedRowsData.current);
    if (selectedRowsData.current.length > 0) {
      Swal.fire({
        title: "SET/REST PASS",
        text: "Đang SET/RESET PASS liệu",
        icon: "info",
        showCancelButton: false,
        allowOutsideClick: false,
        confirmButtonText: "OK",
        showConfirmButton: false,
      });
      let err_code: string = "";
      for (let i = 0; i < selectedRowsData.current.length; i++) {
        await generalQuery("updateQCPASS_HOLDING", {
          M_LOT_NO: selectedRowsData.current[i].M_LOT_NO,
          ID: selectedRowsData.current[i].ID,
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
      if (err_code === "") {
        Swal.fire("Thông báo", "SET thành công", "success");
      } else {
        Swal.fire("Thông báo", "Lỗi: " + err_code, "error");
      }
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 dòng để thực hiện", "error");
    }
  };
  const updateReason = async () => {
    console.log(selectedRowsData.current);
    if (selectedRowsData.current.length > 0) {
      Swal.fire({
        title: "Update hiện tượng lỗi",
        text: "Đang update thông tin lỗi",
        icon: "info",
        showCancelButton: false,
        allowOutsideClick: false,
        confirmButtonText: "OK",
        showConfirmButton: false,
      });
      let err_code: string = "";
      for (let i = 0; i < selectedRowsData.current.length; i++) {
        await generalQuery("updateMaterialHoldingReason", {
          HOLD_ID: selectedRowsData.current[i].HOLD_ID,
          REASON: selectedRowsData.current[0].REASON,
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
        Swal.fire("Thông báo", "Update thành công", "success");
      } else {
        Swal.fire("Thông báo", "Lỗi: " + err_code, "error");
      }
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 dòng để thực hiện", "error");
    }
  };
  const holdingDataAGTable = useMemo(() => {
    return (
      <AGTable
        toolbar={
          <div>
            
          </div>}
        columns={column_holding_table}
        data={holdingdatatable}
        onCellEditingStopped={(e) => {
          //console.log(e.data)
        }} onRowClick={(e) => {
          //console.log(e.data)
          
        }} onSelectionChange={(e) => {
          //console.log(e!.api.getSelectedRows())
          selectedRowsData.current = e!.api.getSelectedRows();             
        }}
      />
    )
  }, [holdingdatatable]);
  const handleSearchCodeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      handletraHoldingData();
    }
  };
  const handletraHoldingData = () => {
    Swal.fire({
      title: "Tra cứu vật liệu Holding",
      text: "Đang tải dữ liệu, hãy chờ chút",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });
    generalQuery("traholdingmaterial", {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      M_NAME: m_name,
      M_CODE: m_code,
      M_LOT_NO: mLotNo,
      M_STATUS: mStatus,
      ID: id,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: HOLDING_DATA[] = response.data.data.map(
            (element: HOLDING_DATA, index: number) => {
              return {
                ...element,
                INS_DATE:
                  element.INS_DATE !== null
                    ? moment.utc(element.INS_DATE).format("YYYY-MM-DD HH:mm:ss")
                    : "",
                UPD_DATE:
                  element.UPD_DATE !== null
                    ? moment.utc(element.UPD_DATE).format("YYYY-MM-DD HH:mm:ss")
                    : "",
                QC_PASS_DATE:
                  element.QC_PASS_DATE !== null
                    ? moment
                      .utc(element.QC_PASS_DATE)
                      .format("YYYY-MM-DD HH:mm:ss")
                    : "",
                id: index,
              };
            },
          );
          setHoldingDataTable(loadeddata);
          Swal.fire(
            "Thông báo",
            "Đã load " + response.data.data.length + " dòng",
            "success",
          );
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    //setColumnDefinition(column_inspect_output);
  }, []);
  return (
    <div className="holding">
      <div className="tracuuDataInspection" >
        <div className="tracuuDataInspectionform" style={{ backgroundImage: theme.CMS.backgroundImage }}>
          <div className="forminput">
            <div className="forminputcolumn">
              <label>
                <b>Từ ngày:</b>
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                  type="date"
                  value={fromdate.slice(0, 10)}
                  onChange={(e) => setFromDate(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Tới ngày:</b>{" "}
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
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
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                  type="text"
                  placeholder="SJ-203020HC"
                  value={m_name}
                  onChange={(e) => setM_Name(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Mã Liệu CMS:</b>{" "}
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                  type="text"
                  placeholder="A123456"
                  value={m_code}
                  onChange={(e) => setM_Code(e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>LOT CMS:</b>{" "}
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                  type="text"
                  placeholder="2204280689"
                  value={mLotNo}
                  onChange={(e) => setMLotNo(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Trạng Thái</b>
                <select
                  name="hangmuctest"
                  value={mStatus}
                  onChange={(e) => {
                    setMStatus(e.target.value);
                  }}
                >
                  <option value="ALL">ALL</option>
                  <option value="Y">ĐÃ PASS</option>
                  <option value="N">CHƯA PASS</option>
                </select>
              </label>
              <label>
                <b>NCR ID:</b>
                <input
                  type="number"
                  value={ncrId}
                  onChange={(e) => setNCRID(parseInt(e.target.value))}
                ></input>
              </label>  
            </div>
            <div className="forminputcolumn">
              <Button color={'success'} variant="contained" size="small" fullWidth={false} sx={{ fontSize: '0.6rem', padding: '3px', backgroundColor: '#fa1717' }} onClick={() => {
                handletraHoldingData();
              }}>Tra Holding</Button>
              <Button color={'success'} variant="contained" size="small" fullWidth={false} sx={{ fontSize: '0.6rem', padding: '3px', backgroundColor: '#fffc5b', color: 'black' }} onClick={() => {
                updateReason();
              }}>Update Reason</Button>

            </div>
            <div className="forminputcolumn">
              <Button color={'success'} variant="contained" size="small" fullWidth={false} sx={{ fontSize: '0.6rem', padding: '3px', backgroundColor: '#07cc00' }} onClick={() => {
                if (userData?.SUBDEPTNAME === "IQC") {
                  setQCPASS("Y");
                } else {
                  Swal.fire(
                    "Thông báo",
                    "Bạn không phải người bộ phận IQC",
                    "error",
                  );
                }
              }}>SET PASS</Button>
              <Button color={'success'} variant="contained" size="small" fullWidth={false} sx={{ fontSize: '0.6rem', padding: '3px', backgroundColor: 'gray' }} onClick={() => {
                if (userData?.SUBDEPTNAME === "IQC") {
                  setQCPASS("N");
                } else {
                  Swal.fire(
                    "Thông báo",
                    "Bạn không phải người bộ phận IQC",
                    "error",
                  );
                }
              }}>RESET PASS</Button>
              <Button color={'success'} variant="contained" size="small" fullWidth={false} sx={{ fontSize: '0.6rem', padding: '3px', backgroundColor: '#cc004e' }} onClick={() => {
                if (userData?.SUBDEPTNAME === "IQC") {
                  updateNCRIDHolding();
                } else {
                  Swal.fire(
                    "Thông báo",
                    "Bạn không phải người bộ phận IQC",
                    "error",
                  );
                }
              }}>UPDATE NCR ID</Button>


            </div>
            <div className="forminputcolumn">
              <label>
                <b>All Time:</b>
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                  type="checkbox"
                  name="alltimecheckbox"
                  defaultChecked={alltime}
                  onChange={() => setAllTime(!alltime)}
                ></input>
              </label>

            </div>
          </div>
        </div>
        <div className="tracuuYCSXTable">{holdingDataAGTable}</div>
      </div>
    </div>
  );
};
export default HOLDING;

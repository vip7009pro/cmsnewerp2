import {
  DataGrid,
  GridSelectionModel,
  GridToolbar,
  GridToolbarContainer,
  GridToolbarExport,
  GridCsvExportOptions,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { generalQuery } from "../../../api/Api";
import "./TabDangKy.scss";
import Swal from "sweetalert2";
import LinearProgress from "@mui/material/LinearProgress";
import moment from "moment";
const TabDangKy = () => {
  const [quanlynhansuShow, setQuanLyNhanSuShow] = useState(true);
  const [canghi, setCanNghi] = useState(1);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [nghitype, setNghiType] = useState(1);
  const [reason, setReason] = useState("");
  const [starttime, setStartTime] = useState("");
  const [finishtime, setFinishTime] = useState("");
  const [confirm_worktime, setConfirm_WorkTime] = useState("");
  const [confirm_type, setConfirm_Type] = useState("GD");
  const [confirm_date, setConfirm_Date] = useState(
    moment().format("YYYY-MM-DD")
  );
  const handleclearxacnhan = () => {
    setConfirm_WorkTime("");
    setConfirm_Date("");
  };
  const handlecleardangkynghi = () => {
    setCanNghi(1);
    setFromDate("");
    setToDate("");
    setNghiType(1);
  };
  const handlecleartangca = () => {
    setStartTime("");
    setFinishTime("");
  };
  const handle_xacnhan = () => {
    const insertData = {
      confirm_worktime: confirm_type + ":" + confirm_worktime,
      confirm_date: confirm_date,
    };
    console.log(insertData);
    generalQuery("xacnhanchamcongnhom", insertData)
      .then((response) => {
        if (response.data.tk_status === "OK") {
          Swal.fire(
            "Thông báo",
            "Chúc mừng bạn, Xác nhận chấm công thành công !",
            "success"
          );
        } else {
          Swal.fire(
            "Lỗi",
            "Xác nhận thất bại ! " + response.data.message,
            "error"
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const hanlde_dangkynghi = () => {
    const insertData = {
      canghi: canghi,
      reason_code: nghitype,
      remark_content: reason,
      ngaybatdau: fromdate,
      ngayketthuc: todate,
    };
    console.log(insertData);
    generalQuery("dangkynghi2", insertData)
      .then((response) => {
        if (response.data.tk_status === "OK") {
          Swal.fire(
            "Thông báo",
            "Chúc mừng bạn, đăng ký nghỉ thành công !",
            "success"
          );
        } else {
          Swal.fire(
            "Lỗi",
            "Đăng ký nghỉ thất bại thất bại ! " + response.data.message,
            "error"
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const hanlde_dangkytangca = () => {
    const insertData = {
      over_start: starttime,
      over_finish: finishtime,
    };
    console.log(insertData);
    generalQuery("dangkytangcacanhan", insertData)
      .then((response) => {
        if (response.data.tk_status === "OK") {
          Swal.fire(
            "Thông báo",
            "Chúc mừng bạn, đăng ký tăng ca thành công !",
            "success"
          );
        } else {
          Swal.fire(
            "Thông báo",
            "Đăngkys tăng ca thất bại ! " + response.data.message,
            "error"
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {}, []);
  return (
    <div className='tabdangky'>    
      <div className='formdangkys'>
        {quanlynhansuShow && (
          <div className='formnho'>
            <h3>Đăng ký nghỉ</h3>
            <div className='dangkyform'>
              <div className='dangkyinput'>
                <div className='dangkyinputbox'>
                  <label>
                    <b>Ca nghỉ:</b>
                    <select
                      name='canghi'
                      value={canghi}
                      onChange={(e) => setCanNghi(Number(e.target.value))}
                    >
                      <option value={1}>Ca 1</option>
                      <option value={2}>Ca 2</option>
                    </select>
                  </label>
                  <label>
                    <b>Nghỉ từ ngày:</b>
                    <input
                      type='date'
                      value={fromdate.slice(0, 10)}
                      onChange={(e) => setFromDate(e.target.value)}
                    ></input>
                  </label>
                  <label>
                    <b>Nghỉ tới ngày ngày:</b>{" "}
                    <input
                      type='date'
                      value={todate.slice(0, 10)}
                      onChange={(e) => setToDate(e.target.value)}
                    ></input>
                  </label>
                  <label>
                    <b>Kiểu nghỉ:</b>
                    <select
                      name='nghitype'
                      value={nghitype}
                      onChange={(e) => setNghiType(Number(e.target.value))}
                    >
                      <option value={1}>Phép năm</option>
                      <option value={2}>Nửa phép</option>
                      <option value={3}>Việc riêng</option>
                      <option value={4}>Nghỉ ốm</option>
                      <option value={5}>Chế độ</option>
                      <option value={6}>Lý do khác</option>
                    </select>
                  </label>
                  <label>
                    <b>Lý do cụ thể:</b>{" "}
                    <input
                      type='text'
                      placeholder='Viết ngắn gọn lý do vào đây'
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    ></input>
                  </label>
                </div>
              </div>
              <div className='dangkybutton'>
                <button className='thembutton' onClick={hanlde_dangkynghi}>
                  Đăng ký
                </button>
                <button className='xoabutton' onClick={handlecleardangkynghi}>
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}
        {quanlynhansuShow && (
          <div className='formnho'>
            <h3>Đăng ký tăng ca</h3>
            <div className='dangkyform'>
              <div className='dangkyinput'>
                <div className='dangkyinputbox'>
                  <label>
                    <b>Thời gian bắt đầu:</b>{" "}
                    <input
                      type='text'
                      placeholder='1700'
                      value={starttime}
                      onChange={(e) => setStartTime(e.target.value)}
                    ></input>
                  </label>
                  <label>
                    <b>Thời gian kết thúc:</b>{" "}
                    <input
                      type='text'
                      placeholder='2000'
                      value={finishtime}
                      onChange={(e) => setFinishTime(e.target.value)}
                    ></input>
                  </label>
                </div>
              </div>
              <div className='dangkybutton'>
                <button className='thembutton' onClick={hanlde_dangkytangca}>
                  Đăng ký
                </button>
                <button className='xoabutton' onClick={handlecleartangca}>
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}
        {quanlynhansuShow && (
          <div className='formnho'>
            <h3>Xác nhận chấm công (Quên chấm công)</h3>
            <div className='dangkyform'>
              <div className='dangkyinput'>
                <div className='dangkyinputbox'>
                  <label>
                    <b>Kiểu nghỉ:</b>
                    <select
                      name='nghitype'
                      value={confirm_type}
                      onChange={(e) => setConfirm_Type(e.target.value)}
                    >
                      <option value='GD'>Quên giờ vào</option>
                      <option value='GS'>Quên giờ về</option>
                      <option value='CA'>Quên cả giờ vào - giờ về</option>
                    </select>
                  </label>
                  <label>
                    <b>Ngày quên:</b>
                    <input
                      type='date'
                      value={confirm_date}
                      onChange={(e) => setConfirm_Date(e.target.value)}
                    ></input>
                  </label>
                  <label>
                    <b>Giờ vào-về:</b>{" "}
                    <input
                      type='text'
                      placeholder='0800-1700'
                      value={confirm_worktime}
                      onChange={(e) => setConfirm_WorkTime(e.target.value)}
                    ></input>
                  </label>
                </div>
              </div>
              <div className='dangkybutton'>
                <button className='thembutton' onClick={handle_xacnhan}>
                  Xác nhận
                </button>
                <button className='xoabutton' onClick={handleclearxacnhan}>
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default TabDangKy;

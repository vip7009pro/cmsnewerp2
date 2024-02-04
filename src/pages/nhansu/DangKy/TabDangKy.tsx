import React, { useEffect, useState } from "react";
import { generalQuery, getGlobalLang, } from "../../../api/Api";
import "./TabDangKy.scss";
import Swal from "sweetalert2";
import moment from "moment";
import { getlang } from "../../../components/String/String";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
const TabDangKy = () => {
  const glbLang: string | undefined = useSelector(
    (state: RootState) => state.totalSlice.lang,
  );

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
    moment().format("YYYY-MM-DD"),
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
            "success",
          );
        } else {
          Swal.fire(
            "Lỗi",
            "Xác nhận thất bại ! " + response.data.message,
            "error",
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
            "success",
          );
        } else {
          Swal.fire(
            "Lỗi",
            "Đăng ký nghỉ thất bại thất bại ! " + response.data.message,
            "error",
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
            "success",
          );
        } else {
          Swal.fire(
            "Thông báo",
            "Đăngkys tăng ca thất bại ! " + response.data.message,
            "error",
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => { }, []);
  return (
    <div className="tabdangky">
      <div className="formdangkys">
        <div className="formnho">
          <h3>{getlang("dangkynghi",glbLang!)}</h3>
          <div className="dangkyform">
            <div className="dangkyinput">
              <div className="dangkyinputbox">
                <label>
                  <b>{getlang("canghi",glbLang!)}:</b>
                  <select
                    name="canghi"
                    value={canghi}
                    onChange={(e) => setCanNghi(Number(e.target.value))}
                  >
                    <option value={1}>Ca 1</option>
                    <option value={2}>Ca 2</option>
                  </select>
                </label>
                <label>
                  <b>From Date:</b>
                  <input
                    type="date"
                    value={fromdate.slice(0, 10)}
                    onChange={(e) => setFromDate(e.target.value)}
                  ></input>
                </label>
                <label>
                  <b>To Date:</b>{" "}
                  <input
                    type="date"
                    value={todate.slice(0, 10)}
                    onChange={(e) => setToDate(e.target.value)}
                  ></input>
                </label>
                <label>
                  <b>{getlang("kieunghi",glbLang!)}:</b>
                  <select
                    name="nghitype"
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
                  <b>{getlang("lydocuthe",glbLang!)}:</b>{" "}
                  <input
                    type="text"
                    placeholder="Viết ngắn gọn lý do vào đây"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  ></input>
                </label>
              </div>
            </div>
            <div className="dangkybutton">
              <button className="thembutton" onClick={hanlde_dangkynghi}>
              {getlang("dangky1",glbLang!)}
              </button>
              <button className="xoabutton" onClick={handlecleardangkynghi}>
                Clear
              </button>
            </div>
          </div>
        </div>
        <div className="formnho">
          <h3>{getlang("dangkytangca",glbLang!)}</h3>
          <div className="dangkyform">
            <div className="dangkyinput">
              <div className="dangkyinputbox">
                <label>
                  <b>{getlang("thoigianbatdau",glbLang!)}:</b>{" "}
                  <input
                    type="text"
                    placeholder="1700"
                    value={starttime}
                    onChange={(e) => setStartTime(e.target.value)}
                  ></input>
                </label>
                <label>
                  <b>{getlang("thoigianketthuc",glbLang!)}:</b>{" "}
                  <input
                    type="text"
                    placeholder="2000"
                    value={finishtime}
                    onChange={(e) => setFinishTime(e.target.value)}
                  ></input>
                </label>
              </div>
            </div>
            <div className="dangkybutton">
              <button className="thembutton" onClick={hanlde_dangkytangca}>
              {getlang("dangky1",glbLang!)}
              </button>
              <button className="xoabutton" onClick={handlecleartangca}>
                Clear
              </button>
            </div>
          </div>
        </div>
        <div className="formnho">
          <h3>{getlang("xacnhanchamcong",glbLang!)}</h3>
          <div className="dangkyform">
            <div className="dangkyinput">
              <div className="dangkyinputbox">
                <label>
                  <b>{getlang("kieuxacnhan",glbLang!)}:</b>
                  <select
                    name="nghitype"
                    value={confirm_type}
                    onChange={(e) => setConfirm_Type(e.target.value)}
                  >
                    <option value="GD">Quên giờ vào</option>
                    <option value="GS">Quên giờ về</option>
                    <option value="CA">Quên cả giờ vào - giờ về</option>
                  </select>
                </label>
                <label>
                  <b>Date:</b>
                  <input
                    type="date"
                    value={confirm_date}
                    onChange={(e) => setConfirm_Date(e.target.value)}
                  ></input>
                </label>
                <label>
                  <b>Time:</b>{" "}
                  <input
                    type="text"
                    placeholder="0800-1700"
                    value={confirm_worktime}
                    onChange={(e) => setConfirm_WorkTime(e.target.value)}
                  ></input>
                </label>
              </div>
            </div>
            <div className="dangkybutton">
              <button className="thembutton" onClick={handle_xacnhan}>
              {getlang("dangky1",glbLang!)}
              </button>
              <button className="xoabutton" onClick={handleclearxacnhan}>
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TabDangKy;

import React, { useEffect, useState } from "react";
import { generalQuery, getGlobalLang, getSocket, getUserData, } from "../../../api/Api";
import "./TabDangKy.scss";
import Swal from "sweetalert2";
import moment from "moment";
import { getlang } from "../../../components/String/String";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { f_insert_Notification_Data } from "../../../api/GlobalFunction";
import { NotificationElement } from "../../../components/NotificationPanel/Notification";
const FormDangKyNghi = () => {
  const glbLang: string | undefined = useSelector( (state: RootState) => state.totalSlice.lang, );
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [canghi, setCanNghi] = useState(1);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [nghitype, setNghiType] = useState(1);
  const [reason, setReason] = useState("");
  const handlecleardangkynghi = () => {
    setCanNghi(1);
    setFromDate(moment().format("YYYY-MM-DD"));
    setToDate(moment().format("YYYY-MM-DD"));
    setNghiType(1);
    setReason("");
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
      .then(async (response) => {
        if (response.data.tk_status === "OK") {
          let newNotification: NotificationElement = {
            CTR_CD: '002',
            NOTI_ID: -1,
            NOTI_TYPE: "success",
            TITLE: 'Đăng ký nghỉ',
            CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${getUserData()?.FIRST_NAME}), nhân viên ${getUserData()?.WORK_POSITION_NAME} đã đăng ký nghỉ từ ngày ${fromdate} tới ngày ${todate}.`,
            SUBDEPTNAME: getUserData()?.SUBDEPTNAME ?? "",
            MAINDEPTNAME: getUserData()?.MAINDEPTNAME ?? "",
            INS_EMPL: 'NHU1903',
            INS_DATE: '2024-12-30',
            UPD_EMPL: 'NHU1903',
            UPD_DATE: '2024-12-30',
          }  
          if(await f_insert_Notification_Data(newNotification))
          {
            getSocket().emit("notification_panel",newNotification);
          }
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
  useEffect(() => { }, []);
  return (
    <div className="tabdangky">
      <div className="formdangkys">
        <div className="formnho" style={{ backgroundImage: theme.CMS.backgroundImage }}>
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
      </div>
    </div>
  );
};
export default FormDangKyNghi;

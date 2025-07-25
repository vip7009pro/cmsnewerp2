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
const FormXacNhanChamCong = () => {
  const glbLang: string | undefined = useSelector(
    (state: RootState) => state.totalSlice.lang, );
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [confirm_worktime, setConfirm_WorkTime] = useState("");
  const [confirm_type, setConfirm_Type] = useState("GD");
  const [confirm_date, setConfirm_Date] = useState( moment().format("YYYY-MM-DD"), );
  const handleclearxacnhan = () => {
    setConfirm_WorkTime("");
    setConfirm_Date(moment().format("YYYY-MM-DD"));
  };
  const handle_xacnhan = () => {
    const insertData = {
      confirm_worktime: confirm_type + ":" + confirm_worktime,
      confirm_date: confirm_date,
    };
    console.log(insertData);
    generalQuery("xacnhanchamcongnhom", insertData)
      .then(async (response) => {
        if (response.data.tk_status === "OK") {
          let newNotification: NotificationElement = {
            CTR_CD: '002',
            NOTI_ID: -1,
            NOTI_TYPE: "success",
            TITLE: 'Xác nhận chấm công',
            CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${getUserData()?.FIRST_NAME}), nhân viên ${getUserData()?.WORK_POSITION_NAME} đã đăng ký xác nhận chấm công ngày ${confirm_date}, thời gian ${confirm_worktime}.`,
            SUBDEPTNAME: getUserData()?.SUBDEPTNAME ?? "",
            MAINDEPTNAME: getUserData()?.MAINDEPTNAME ?? "",
            INS_EMPL: 'NHU1903',
            INS_DATE: '2024-12-30',
            UPD_EMPL: 'NHU1903',
            UPD_DATE: '2024-12-30',
          }  
          if(await f_insert_Notification_Data(newNotification))
          {
            getSocket().emit("notification_panel", newNotification);
          }
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
  useEffect(() => { }, []);
  return (
    <div className="tabdangky">
      <div className="formdangkys">     
        <div className="formnho" style={{ backgroundImage: theme.CMS.backgroundImage }}>
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
export default FormXacNhanChamCong;

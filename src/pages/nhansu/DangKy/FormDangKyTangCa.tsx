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
const FormDangKyTangCa = () => {
  const glbLang: string | undefined = useSelector( (state: RootState) => state.totalSlice.lang, );
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [starttime, setStartTime] = useState("");
  const [finishtime, setFinishTime] = useState("");
  const handlecleartangca = () => {
    setStartTime("");
    setFinishTime("");
  };
  const hanlde_dangkytangca = () => {
    const insertData = {
      over_start: starttime,
      over_finish: finishtime,
    };
    console.log(insertData);
    generalQuery("dangkytangcacanhan", insertData)
      .then(async (response) => {
        if (response.data.tk_status === "OK") {
          let newNotification: NotificationElement = {
            CTR_CD: '002',
            NOTI_ID: -1,
            NOTI_TYPE: "success",
            TITLE: 'Đăng ký tăng ca',
            CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${getUserData()?.FIRST_NAME}), nhân viên ${getUserData()?.WORK_POSITION_NAME} đã đăng ký tăng ca từ  ${starttime} tới ${finishtime}.`,
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
            "Chúc mừng bạn, đăng ký tăng ca thành công !",
            "success",
          );
        } else {
          Swal.fire(
            "Thông báo",
            "Đăng ký tăng ca thất bại ! Kiểm tra xem đã điểm danh chưa? " + response.data.message,
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
      </div>
    </div>
  );
};
export default FormDangKyTangCa;

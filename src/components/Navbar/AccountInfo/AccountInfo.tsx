import moment from "moment";
import React, { useState, useEffect, useContext } from "react";
import { generalQuery } from "../../../api/Api";
import { UserContext } from "../../../api/Context";
import "./AccountInfo.scss";

import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant='determinate' {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant='body2' color='text.secondary'>{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

export default function AccountInfo() {
  const [userdata, setUserData] = useContext(UserContext);
  const [workday, setWorkDay] = useState(0);
  const [overtimeday, setOverTimeDay] = useState(0);
  const [nghiday, setNghiDay] = useState(0);
  const [countxacnhan, setCountXacNhan] = useState(0);
  const [thuongphat, setThuongPhat] = useState({
    count_thuong: 0,
    count_phat: 0,
  });

  const startOfYear = moment().year() + "-01-01";
  //console.log(moment().startOf('year').format('YYYY-MM-DD'));
  const now = moment(new Date());
  const start = moment(startOfYear);
  var duration = moment.duration(now.diff(start));
  var days = duration.asDays();
  //console.log("Ngay khac nhau = " + Math.floor(days));
  function getBusinessDatesCount(startDate: any, endDate: any) {
    let count = 0;
    const curDate = new Date(startDate.getTime());
    while (curDate <= endDate) {
      const dayOfWeek = curDate.getDay();
      if (dayOfWeek !== 0) count++;
      curDate.setDate(curDate.getDate() + 1);
    }
    return count;
  }
  days = getBusinessDatesCount(new Date(startOfYear), new Date());
  const getData = () => {
    let insertData = {};
    generalQuery("workdaycheck", insertData)
      .then((response) => {
        //console.log(response.data.data[0].WORK_DAY);
        setWorkDay(response.data.data[0].WORK_DAY);
      })
      .catch((error) => {
        console.log(error);
      });
    generalQuery("tangcadaycheck", insertData)
      .then((response) => {
        //console.log(response.data.data[0].WORK_DAY);
        setOverTimeDay(response.data.data[0].TANGCA_DAY);
      })
      .catch((error) => {
        console.log(error);
      });
    generalQuery("nghidaycheck", insertData)
      .then((response) => {
        //console.log(response.data.data[0].WORK_DAY);
        setNghiDay(response.data.data[0].NGHI_DAY);
      })
      .catch((error) => {
        console.log(error);
      });

    generalQuery("countxacnhanchamcong", insertData)
      .then((response) => {
        //console.log(response.data.data[0].WORK_DAY);
        setCountXacNhan(response.data.data[0].COUTNXN);
      })
      .catch((error) => {
        console.log(error);
      });

    generalQuery("countthuongphat", insertData)
      .then((response) => {
        console.log(response.data.data);
        console.log(response.data.data.count_thuong[0].THUONG);
        console.log(response.data.data.count_phat[0].PHAT);
        setThuongPhat({
          count_thuong: response.data.data.count_thuong[0].THUONG,
          count_phat: response.data.data.count_phat[0].PHAT,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getData();
    return () => {};
  }, []);
  const DOB = () => {
    if (userdata.DOB != null) {
      return userdata.DOB;
    } else {
      return "2021-12-16";
    }
  };
  return (
    <div className='accountinfo'>
      <h1>Thông tin đi làm của bạn trong năm:</h1>
      <div className='panelhome'>
        <div className='cot1'>
          <h5>Thông tin nhân viên:</h5>
          <ul>
            <li className='emplInfoList'>
              {" "}
              Họ và tên: {userdata.MIDLAST_NAME} {userdata.FIRST_NAME}
            </li>
            <li className='emplInfoList'> Mã nhân sự: {userdata.CMS_ID}</li>
            <li className='emplInfoList'> Mã ERP: {userdata.EMPL_NO}</li>
            <li className='emplInfoList'>
              {" "}
              Ngày tháng năm sinh: {DOB().slice(0, 10)}
            </li>
            <li className='emplInfoList'> Quê quán: {userdata.HOMETOWN}</li>
            <li className='emplInfoList'>
              {" "}
              Địa chỉ: {userdata.ADD_VILLAGE}-{userdata.ADD_COMMUNE}-
              {userdata.ADD_DISTRICT}-{userdata.ADD_PROVINCE}
            </li>
            <li className='emplInfoList'>
              {" "}
              Bộ phận chính: {userdata.MAINDEPTNAME}
            </li>
            <li className='emplInfoList'>
              {" "}
              Bộ phận phụ: {userdata.SUBDEPTNAME}
            </li>
            <li className='emplInfoList'>
              {" "}
              Vị trí làm việc: {userdata.WORK_POSITION_NAME}
            </li>
            <li className='emplInfoList'>
              {" "}
              Nhóm điểm danh: {userdata.ATT_GROUP_CODE}
            </li>
            <li className='emplInfoList'> Chức vụ: {userdata.JOB_NAME}</li>
          </ul>
        </div>
        <div className='cot2'>
          <h3 className='h3h3' style={{ color: "#cc33ff" }}>
            1. Từ đầu năm đến giờ có : {Math.floor(days)} ngày (Tính cả ngày
            nghỉ lễ nhưng k tính chủ nhật)
          </h3>{" "}
          <br></br>
          {workday} / {Math.floor(days)}
          <Box sx={{ width: "100%" }}>
            <LinearProgressWithLabel
              value={(workday / Math.floor(days)) * 100}
            />
          </Box>
          <h3 className='h3h3' style={{ color: "purple" }}>
            2. Số ngày bạn đi làm : {workday} ngày
          </h3>{" "}
          <br></br>
          {overtimeday} / {Math.floor(workday)}
          <Box sx={{ width: "100%" }}>
            <LinearProgressWithLabel
              value={Math.floor((overtimeday / workday) * 100)}
            />
          </Box>
          <h3 className='h3h3' style={{ color: "blue" }}>
            3. Số ngày bạn tăng ca : {overtimeday} ngày
          </h3>{" "}
          <br></br>
          <Box sx={{ width: "100%" }}>
            <LinearProgressWithLabel
              value={Math.floor((countxacnhan / workday) * 100)}
            />
          </Box>
          <h3 className='h3h3' style={{ color: "rgb(121 38 222)" }}>
            4. Số ngày xác nhận chấm công : {countxacnhan} ngày
          </h3>{" "}
          <br></br>
          <h3 className='h3h3' style={{ color: "red" }}>
            5. Số ngày bạn đăng ký nghỉ (ko tính chủ nhật và nửa phép):{" "}
            {nghiday} ngày
          </h3>{" "}
          <br></br>
          <h3 className='h3h3' style={{ color: "black" }}>
            6. Thưởng phạt: Khen thưởng: {thuongphat.count_thuong} , Kỷ luật:{" "}
            {thuongphat.count_phat}
          </h3>{" "}
          <br></br>
        </div>
      </div>
    </div>
  );
}

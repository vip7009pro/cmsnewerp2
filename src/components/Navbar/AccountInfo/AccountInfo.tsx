import moment from "moment";
import React, { useState, useEffect, useContext } from "react";
import { generalQuery } from "../../../api/Api";
import { UserContext, LangConText } from "../../../api/Context";
import "./AccountInfo.scss";


import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import getsentence from "../../String/String";

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
  const [lang,setLang] = useContext(LangConText);

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
      <h1>{/* Th??ng tin c???a b???n */}{getsentence(17,lang)}</h1>
      <div className='panelhome'>
        <div className='cot1'>
          <h5>{/* Th??ng tin nh??n vi??n */}{getsentence(18,lang)}:</h5>
          <ul>
            <li className='emplInfoList'>
              {" "}
             {/*  H??? v?? t??n */}{getsentence(19,lang)}: {userdata.MIDLAST_NAME} {userdata.FIRST_NAME}
            </li>
            <li className='emplInfoList'> {/* M?? nh??n s??? */}{getsentence(20,lang)}: {userdata.CMS_ID}</li>
            <li className='emplInfoList'> {/* M?? ERP */}{getsentence(21,lang)}: {userdata.EMPL_NO}</li>
            <li className='emplInfoList'>
              {" "}
              {/* Ng??y th??ng n??m sinh */}{getsentence(22,lang)}: {DOB().slice(0, 10)}
            </li>
            <li className='emplInfoList'> {/* Qu?? qu??n */}{getsentence(23,lang)}: {userdata.HOMETOWN}</li>
            <li className='emplInfoList'>
              {" "}
              {/* ?????a ch??? */}{getsentence(24,lang)}: {userdata.ADD_VILLAGE}-{userdata.ADD_COMMUNE}-
              {userdata.ADD_DISTRICT}-{userdata.ADD_PROVINCE}
            </li>
            <li className='emplInfoList'>
              {" "}
              {/* B??? ph???n ch??nh */}{getsentence(25,lang)}: {userdata.MAINDEPTNAME}
            </li>
            <li className='emplInfoList'>
              {" "}
              {/* B??? ph???n ph??? */}{getsentence(26,lang)}: {userdata.SUBDEPTNAME}
            </li>
            <li className='emplInfoList'>
              {" "}
             {/*  V??? tr?? l??m vi???c */}{getsentence(27,lang)}: {userdata.WORK_POSITION_NAME}
            </li>
            <li className='emplInfoList'>
              {" "}
              {/* Nh??m ??i???m danh */}{getsentence(28,lang)}: {userdata.ATT_GROUP_CODE}
            </li>
            <li className='emplInfoList'> {/* Ch???c v??? */}{getsentence(29,lang)}: {userdata.JOB_NAME}</li>
          </ul>
        </div>
        <div className='cot2'>
          <h3 className='h3h3' style={{ color: "#cc33ff" }}>
            1. {/* T??? ?????u n??m ?????n gi??? c?? */}{getsentence(30,lang)} : {Math.floor(days)} {/* ng??y */} {getsentence(31,lang)}
          </h3>{" "}
          <br></br>
          {workday} / {Math.floor(days)}
          <Box sx={{ width: "100%" }}>
            <LinearProgressWithLabel
              value={(workday / Math.floor(days)) * 100}
            />
          </Box>
          <h3 className='h3h3' style={{ color: "purple" }}>
            2. {/* S??? ng??y b???n ??i l??m */} {getsentence(32,lang)}: {workday} {/* ng??y */}{getsentence(31,lang)}
          </h3>{" "}
          <br></br>
          {overtimeday} / {Math.floor(workday)}
          <Box sx={{ width: "100%" }}>
            <LinearProgressWithLabel
              value={Math.floor((overtimeday / workday) * 100)}
            />
          </Box>
          <h3 className='h3h3' style={{ color: "blue" }}>
            3. {/*S??? ng??y b???n t??ng ca*/}{getsentence(33,lang)} : {overtimeday} {/* ng??y */}{getsentence(31,lang)}
          </h3>{" "}
          <br></br>
          <Box sx={{ width: "100%" }}>
            <LinearProgressWithLabel
              value={Math.floor((countxacnhan / workday) * 100)}
            />
          </Box>
          <h3 className='h3h3' style={{ color: "rgb(121 38 222)" }}>
            4. {/*S??? ng??y qu??n ch???m c??ng */}{getsentence(34,lang)} : {countxacnhan} {/* ng??y */}{getsentence(31,lang)}
          </h3>{" "}
          <br></br>
          <h3 className='h3h3' style={{ color: "red" }}>
            5. {/* S??? ng??y b???n ????ng k?? ngh??? (ko t??nh ch??? nh???t v?? n???a ph??p) */}{getsentence(35,lang)}:{" "}
            {nghiday} {/* ng??y */} {getsentence(31,lang)}
          </h3>{" "}
          <br></br>
          <h3 className='h3h3' style={{ color: "black" }}>
            6. {/* Th?????ng ph???t: Khen th?????ng */} {getsentence(36,lang)}: {/*Khen thuong*/}{getsentence(37,lang)} {' '}{thuongphat.count_thuong} , {/* K??? lu???t */}{getsentence(38,lang)}:{" "}
            {thuongphat.count_phat}
          </h3>{" "}
          <br></br>
        </div>
      </div>
    </div>
  );
}

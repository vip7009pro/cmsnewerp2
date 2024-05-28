import moment from "moment";
import React, { useState, useEffect, useContext } from "react";
import { generalQuery, getCompany, getSocket, getUserData, uploadQuery } from "../../../api/Api";
import { UserContext, LangConText } from "../../../api/Context";
import "./AccountInfo.scss";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import getsentence from "../../String/String";
import { Button, IconButton } from "@mui/material";
import { AiOutlineCloudUpload } from "react-icons/ai";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  changeUserData,
  update_socket,
} from "../../../redux/slices/globalSlice";
import Cookies from "universal-cookie";
import { UserData } from "../../../api/GlobalInterface";
interface MYCHAMCONG {
  MIN_TIME: string;
  MAX_TIME: string;
}
export function LinearProgressWithLabel(
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
  const cookies = new Cookies();
  const userdata: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );
  const company: string = useSelector(
    (state: RootState) => state.totalSlice.company
  );
  const [currentPW, setCurrentPW] = useState("");
  const [newPW, setNewPW] = useState("");
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [server_string, setServer_String] = useState('http://14.160.33.94:5013');
  const [webver, setwebver] = useState(0);
  const dispatch = useDispatch();
  const [logoutID, setLogOutID] = useState("");
  const [mychamcong, setMyChamCong] = useState<MYCHAMCONG>();
  const [lang, setLang] = useContext(LangConText);
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
  const setWebVer = (web_ver: number) => {
    getSocket().emit("setWebVer", web_ver);
    generalQuery("setWebVer", {
      WEB_VER: web_ver,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          Swal.fire("Thông báo", "Set web ver thành công", "success");
        } else {
          Swal.fire(
            "Thông báo",
            "Set web ver thất bại: " + response.data.message,
            "error"
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getData = () => {
    let insertData = {};
    generalQuery("workdaycheck", insertData)
      .then((response) => {
        //console.log(response.data.data[0].WORK_DAY);
        setWorkDay(response.data.data[0]?.WORK_DAY);
      })
      .catch((error) => {
        console.log(error);
      });
    generalQuery("tangcadaycheck", insertData)
      .then((response) => {
        //console.log(response.data.data[0].WORK_DAY);
        setOverTimeDay(response.data.data[0]?.TANGCA_DAY);
      })
      .catch((error) => {
        console.log(error);
      });
    generalQuery("nghidaycheck", insertData)
      .then((response) => {
        //console.log(response.data.data[0].WORK_DAY);
        setNghiDay(response.data.data[0]?.NGHI_DAY);
      })
      .catch((error) => {
        console.log(error);
      });
    generalQuery("countxacnhanchamcong", insertData)
      .then((response) => {
        //console.log(response.data.data[0].WORK_DAY);
        setCountXacNhan(response.data.data[0]?.COUTNXN);
      })
      .catch((error) => {
        console.log(error);
      });
    generalQuery("countthuongphat", insertData)
      .then((response) => {
        setThuongPhat({
          count_thuong: response.data.data.count_thuong[0].THUONG,
          count_phat: response.data.data.count_phat[0]?.PHAT,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getchamcong = () => {
    generalQuery("checkMYCHAMCONG", {})
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
          //console.log('data',response.data.data)
          //console.log('data',response.data.REFRESH_TOKEN);
          /* let rfr_token: string = response.data.REFRESH_TOKEN;
          cookies.set("token", rfr_token, { path: "/" }); */
          let loaded_data: MYCHAMCONG = response.data.data[0];
          loaded_data.MIN_TIME = loaded_data.MIN_TIME?.substring(11, 19);
          loaded_data.MAX_TIME = loaded_data.MAX_TIME?.substring(11, 19);
          let tempminhour: number = Number(
            loaded_data.MIN_TIME?.substring(0, 2)
          );
          let tempminminute: number = Number(
            loaded_data.MIN_TIME?.substring(3, 5)
          );
          let tempmaxhour: number = Number(
            loaded_data.MAX_TIME?.substring(0, 2)
          );
          let tempmaxminute: number = Number(
            loaded_data.MAX_TIME?.substring(3, 5)
          );
          /* console.log('tempminhour',tempminhour);
          console.log('tempmaxhour',tempmaxhour);
          console.log('tempminminute',tempminminute);
          console.log('tempmaxminute',tempmaxminute);
 */
          if (tempminhour === tempmaxhour) {
            if (tempmaxminute - tempminminute >= 30) {
            } else {
              loaded_data.MAX_TIME = "Chưa chấm";
            }
          }
          //console.log('gio xu ly',loaded_data)
          setMyChamCong(loaded_data);
        } else {
          setMyChamCong({
            MIN_TIME: "Chưa chấm",
            MAX_TIME: "Chưa chấm",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleChangePassWord = () => {
    if (currentPW === getUserData()?.PASSWORD) {
      generalQuery("changepassword", {
        PASSWORD: newPW
      })
        .then((response) => {
          Swal.fire("Thông báo", "Thay đổi mật khẩu thành công", "success");
        })
        .catch((error) => {
          console.log(error);
        });
    }
    else {
      Swal.fire("Thông báo", "Mật khẩu hiện tại không đúng", "error");
    }
  }
  const [file, setFile] = useState<any>(null);
  //let file:any = null;
  const uploadFile2 = async (e: any) => {
    uploadQuery(file, "NS_" + userdata?.EMPL_NO + ".jpg", "Picture_NS")
      .then((response) => {
        console.log("resopone upload:", response.data);
        if (response.data.tk_status !== "NG") {
          generalQuery("update_empl_image", {
            EMPL_NO: userdata?.EMPL_NO,
            EMPL_IMAGE: "Y",
          })
            .then((response) => {
              if (response.data.tk_status !== "NG") {
                dispatch(changeUserData({ ...userdata, EMPL_IMAGE: "Y" }));
                Swal.fire("Thông báo", "Upload avatar thành công", "success");
              } else {
                Swal.fire("Thông báo", "Upload avatar thất bại", "error");
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          Swal.fire(
            "Thông báo",
            "Upload file thất bại:" + response.data.message,
            "error"
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getData();
    getchamcong();
    let intervalID2 = window.setInterval(() => {
      getchamcong();
    }, 5000);
    return () => {
      window.clearInterval(intervalID2);
    };
  }, []);
  const DOB = () => {
    if (userdata?.DOB != null) {
      return userdata?.DOB;
    } else {
      return "2021-12-16";
    }
  };
  return (
    <div
      className='accountinfo'
      style={{
        backgroundImage: `${company === "CMS"
          ? theme.CMS.backgroundImage
          : theme.PVN.backgroundImage
          }`,
      }}
    >
      <h1 className='text-3xl'>
        {/* Thông tin của bạn */}
        {getsentence(17, lang)}
      </h1>
      <div className='panelhome'>
        <div className={`cot0 ${userdata?.EMPL_IMAGE === "Y" ? "on" : "off"}`}>
          {userdata?.EMPL_IMAGE === "Y" && (
            <img
              width={240}
              height={340}
              src={"/Picture_NS/NS_" + userdata?.EMPL_NO + ".jpg"}
              alt={userdata?.EMPL_NO}
            ></img>
          )}
        </div>
        <div className={`cot1 ${userdata?.EMPL_IMAGE === "Y" ? "on" : "off"}`}>
          <h5 className='text-3xl'>
            {/* Thông tin nhân viên */}
            {getsentence(18, lang)}:
          </h5>
          <ul>
            <div className='diemdanhinfo'>
              <div className='chamcongtitle'>
                Chấm công ngày: {moment().format("YYYY-MM-DD")}
              </div>
              <div className='chamconginfo'>
                <div
                  className='chamcongmin'
                  style={{
                    backgroundImage: `${company === "CMS"
                      ? theme.CMS.backgroundImage
                      : theme.PVN.backgroundImage
                      }`,
                  }}
                >
                  {mychamcong?.MIN_TIME !== null
                    ? mychamcong?.MIN_TIME
                    : "Chưa chấm"}
                </div>
                <div
                  className='chamcongmax'
                  style={{
                    backgroundImage: `${company === "CMS"
                      ? theme.CMS.backgroundImage
                      : theme.PVN.backgroundImage
                      }`,
                  }}
                >
                  {mychamcong?.MAX_TIME !== null
                    ? mychamcong?.MAX_TIME
                    : "Chưa chấm"}
                </div>
              </div>
            </div>
            <li className='emplInfoList'>
              {" "}
              {/*  Họ và tên */}
              {getsentence(19, lang)}: {userdata?.MIDLAST_NAME}{" "}
              {userdata?.FIRST_NAME}
            </li>
            <li className='emplInfoList'>
              {" "}
              {/* Mã nhân sự */}
              {getsentence(20, lang)}: {userdata?.CMS_ID}
            </li>
            <li className='emplInfoList'>
              {" "}
              {/* Mã ERP */}
              {getsentence(21, lang)}: {userdata?.EMPL_NO}
            </li>
            <li className='emplInfoList'>
              {" "}
              {/* Ngày tháng năm sinh */}
              {getsentence(22, lang)}: {DOB().slice(0, 10)}
            </li>
            <li className='emplInfoList'>
              {" "}
              {/* Quê quán */}
              {getsentence(23, lang)}: {userdata?.HOMETOWN}
            </li>
            <li className='emplInfoList'>
              {" "}
              {/* Địa chỉ */}
              {getsentence(24, lang)}: {userdata?.ADD_VILLAGE}-
              {userdata?.ADD_COMMUNE}-{userdata?.ADD_DISTRICT}-
              {userdata?.ADD_PROVINCE}
            </li>
            <li className='emplInfoList'>
              {" "}
              {/* Bộ phận chính */}
              {getsentence(25, lang)}: {userdata?.MAINDEPTNAME}
            </li>
            <li className='emplInfoList'>
              {" "}
              {/* Bộ phận phụ */}
              {getsentence(26, lang)}: {userdata?.SUBDEPTNAME}
            </li>
            <li className='emplInfoList'>
              {" "}
              {/*  Vị trí làm việc */}
              {getsentence(27, lang)}: {userdata?.WORK_POSITION_NAME}
            </li>
            <li className='emplInfoList'>
              {" "}
              {/* Nhóm điểm danh */}
              {getsentence(28, lang)}: {userdata?.ATT_GROUP_CODE}
            </li>
            <li className='emplInfoList'>
              {" "}
              {/* Chức vụ */}
              {getsentence(29, lang)}: {userdata?.JOB_NAME}
            </li>
            {userdata?.EMPL_IMAGE !== "Y" && (
              <li className='emplInfoList'>
                {" "}
                <div className='uploadfile'>
                  {" "}
                  Avatar:
                  <IconButton className='buttonIcon' onClick={uploadFile2}>
                    <AiOutlineCloudUpload color='yellow' size={15} />
                    Upload
                  </IconButton>
                  <input
                    accept='.jpg'
                    type='file'
                    onChange={(e: any) => {
                      setFile(e.target.files[0]);
                      console.log(e.target.files[0]);
                    }}
                  />
                </div>
              </li>
            )}
          </ul>
        </div>
        <div className={`cot2 ${userdata?.EMPL_IMAGE === "Y" ? "on" : "off"}`}>
          <h3 className='h3h3' style={{ color: "#cc33ff" }}>
            1. {/* Từ đầu năm đến giờ có */}
            {getsentence(30, lang)} : {Math.floor(days)} {/* ngày */}{" "}
            {getsentence(31, lang)}
          </h3>{" "}
          <br></br>
          {workday} / {Math.floor(days)}
          <Box sx={{ width: "100%" }}>
            <LinearProgressWithLabel
              value={(workday / Math.floor(days)) * 100}
            />
          </Box>
          <h3 className='h3h3' style={{ color: "purple" }}>
            2. {/* Số ngày bạn đi làm */} {getsentence(32, lang)}: {workday}{" "}
            {/* ngày */}
            {getsentence(31, lang)}
          </h3>{" "}
          <br></br>
          {overtimeday} / {Math.floor(workday)}
          <Box sx={{ width: "100%" }}>
            <LinearProgressWithLabel
              value={Math.floor((overtimeday / workday) * 100)}
            />
          </Box>
          <h3 className='h3h3' style={{ color: "blue" }}>
            3. {/*Số ngày bạn tăng ca*/}
            {getsentence(33, lang)} : {overtimeday} {/* ngày */}
            {getsentence(31, lang)}
          </h3>{" "}
          <br></br>
          <Box sx={{ width: "100%" }}>
            <LinearProgressWithLabel
              value={Math.floor((countxacnhan / workday) * 100)}
            />
          </Box>
          <h3 className='h3h3' style={{ color: "rgb(121 38 222)" }}>
            4. {/*Số ngày quên chấm công */}
            {getsentence(34, lang)} : {countxacnhan} {/* ngày */}
            {getsentence(31, lang)}
          </h3>{" "}
          <br></br>
          <h3 className='h3h3' style={{ color: "red" }}>
            5. {/* Số ngày bạn đăng ký nghỉ (ko tính chủ nhật và nửa phép) */}
            {getsentence(35, lang)}: {nghiday} {/* ngày */}{" "}
            {getsentence(31, lang)}
          </h3>{" "}
          <br></br>
          <h3 className='h3h3' style={{ color: "black" }}>
            6. {/* Thưởng phạt: Khen thưởng */} {getsentence(36, lang)}:{" "}
            {/*Khen thuong*/}
            {getsentence(37, lang)} {thuongphat.count_thuong} , {/* Kỷ luật */}
            {getsentence(38, lang)}: {thuongphat.count_phat}
          </h3>{" "}
          <form>
            <h3 className='h3h3' style={{ color: "black" }}>
              {userdata?.EMPL_NO === "NHU1903" && (
                <input
                  type='text'
                  value={logoutID}
                  onChange={(e) => {
                    setLogOutID(e.target.value);
                  }}
                ></input>
              )}
              {userdata?.EMPL_NO === "NHU1903" && (
                <Button
                  onClick={() => {
                    dispatch(
                      update_socket({
                        event: "notification",
                        data: {
                          command: "logout",
                          EMPL_NO: logoutID,
                        },
                      })
                    );
                  }}
                >
                  X
                </Button>
              )}
              {userdata?.EMPL_NO === "NHU1903" && (
                <input
                  type='text'
                  value={webver}
                  onChange={(e) => {
                    setwebver(Number(e.target.value));
                  }}
                ></input>
              )}
              {userdata?.EMPL_NO === "NHU1903" && (
                <Button
                  onClick={() => {
                    if (webver !== 0) {
                      setWebVer(webver);
                    } else {
                      Swal.fire("Thông báo", "Không setver =0 ", "warning");
                    }
                  }}
                >
                  Upver
                </Button>
              )}
              {
                userdata?.EMPL_NO === 'NHU1903' && (
                  <label>
                    Chọn Server:
                    <select
                      name="select_server"
                      value={server_string}
                      onChange={(e) => {
                        setServer_String(e.target.value);
                      }}
                    >
                      <option value={"http://14.160.33.94:" + 5013}>MAIN_SERVER</option>
                      <option value={"http://14.160.33.94:" + 3007}>SUB_SERVER</option>
                      <option value={"http://192.168.1.192:" + 5013}>LAN_SERVER</option>
                      <option value={"http://cms.ddns.net:" + 5013}>NET_SERVER</option>
                      <option value={"http://cms.ddns.net:" + 3007}>SUBNET_SERVER</option>
                    </select>
                  </label>
                )
              }
              {userdata?.EMPL_NO === "NHU1903" && (
                <Button
                  onClick={() => {
                    getSocket().emit("changeServer", { server: server_string, empl_no: logoutID });
                  }}
                >
                  Set Server
                </Button>
              )}
              Pass hiện tại:
              <input
                type='password'
                value={currentPW}
                onChange={(e) => {
                  setCurrentPW(e.target.value);
                }}
              ></input>
              Pass mới:
              <input
                type='password'
                value={newPW}
                onChange={(e) => {
                  setNewPW(e.target.value);
                }}
              ></input>
              <Button
                onClick={() => {
                  handleChangePassWord();
                }}
              >
                Change Pass
              </Button>
            </h3>{" "}
          </form>
          <br></br>
        </div>
      </div>
    </div>
  );
}

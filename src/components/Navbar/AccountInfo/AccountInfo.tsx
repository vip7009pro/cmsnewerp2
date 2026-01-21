import moment from "moment";
import React, { useState, useEffect, useContext } from "react";
import { generalQuery, getCompany, getSocket, getUserData, uploadQuery } from "../../../api/Api";
import "./AccountInfo.scss";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import getsentence from "../../String/String";
import { Button, Card, CardContent, CardHeader, Chip, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, Stack, TextField } from "@mui/material";
import { AiOutlineBarChart, AiOutlineIdcard, AiOutlineTool, AiOutlineUnlock } from "react-icons/ai";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  changeUserData,
  update_socket,
} from "../../../redux/slices/globalSlice";
import Cookies from "universal-cookie";
import { UserData } from "../../../api/GlobalInterface";
import Box from "@mui/material/Box";
import axios from "axios";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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
  const [server_string, setServer_String] = useState('https://cmsvina4285.com:5013');
  const [webver, setwebver] = useState(0);
  const dispatch = useDispatch();
  const [logoutID, setLogOutID] = useState("");
  const [mychamcong, setMyChamCong] = useState<MYCHAMCONG>();
  const [showAdminTools, setShowAdminTools] = useState(false);
  const [openChangePw, setOpenChangePw] = useState(false);
  const lang: string | undefined = useSelector(
    (state: RootState) => state.totalSlice.lang
  );
  const [workday, setWorkDay] = useState(0);
  const [overtimeday, setOverTimeDay] = useState(0);
  const [nghiday, setNghiDay] = useState(0);
  const [countxacnhan, setCountXacNhan] = useState(0);
  const [attendanceTimeline, setAttendanceTimeline] = useState<Array<{ day: number; hours: number }>>([]);
  const [attendanceTimelineLoading, setAttendanceTimelineLoading] = useState(false);
  const [attendanceTimelineError, setAttendanceTimelineError] = useState<string | null>(null);
  const [thuongphat, setThuongPhat] = useState({
    count_thuong: 0,
    count_phat: 0,
  });
  const todayDay = moment().date();
  const attendanceChartData: Array<{ day: number; hours: number; hoursPast: number | null; hoursFuture: number | null }> =
    attendanceTimeline.map((d) => ({
      ...d,
      hoursPast: d.day < todayDay ? d.hours : null,
      hoursFuture: d.day >= todayDay ? d.hours : null,
    }));
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

  const fetchAttendanceTimeline = async () => {
    try {
      setAttendanceTimelineLoading(true);
      setAttendanceTimelineError(null);

      const monthStart = moment().startOf("month");
      const monthEnd = moment().endOf("month");
      const daysInMonth = monthEnd.date();

      const baseData: Array<{ day: number; hours: number }> = Array.from(
        { length: daysInMonth },
        (_, idx) => ({ day: idx + 1, hours: 0 })
      );

      const response = await generalQuery("mydiemdanhnhom", {
        from_date: monthStart.format("YYYY-MM-DD"),
        to_date: monthEnd.format("YYYY-MM-DD"),
      });

      if (response.data.tk_status === "NG") {
        setAttendanceTimeline(baseData);
        setAttendanceTimelineError(response.data.message || "Load failed");
        return;
      }

      const rows: any[] = response.data.data || [];

      const parseTime = (dateStr: string, timeStr: string) => {
        const clean = String(timeStr || "").trim();
        if (!clean || clean === "OFF") return null;
        return moment(
          `${dateStr} ${clean}`,
          [
            "YYYY-MM-DD HH:mm",
            "YYYY-MM-DD HH:mm:ss",
            "YYYY-MM-DD H:mm",
            "YYYY-MM-DD H:mm:ss",
          ],
          true
        );
      };

      const toHours = (mins: number) => Math.round((mins / 60) * 100) / 100;

      for (const row of rows) {
        const dateStr = moment(row.DATE_COLUMN).utc().format("YYYY-MM-DD");
        const day = Number(moment(dateStr, "YYYY-MM-DD").format("D"));
        if (!day || day < 1 || day > daysInMonth) continue;

        const inMoment = parseTime(dateStr, row.IN_TIME);
        const outMomentRaw = parseTime(dateStr, row.OUT_TIME);
        if (!inMoment || !outMomentRaw || !inMoment.isValid() || !outMomentRaw.isValid()) {
          continue;
        }

        const outMoment = outMomentRaw.isBefore(inMoment) ? outMomentRaw.clone().add(1, "day") : outMomentRaw;
        const diffMinutes = Math.max(0, outMoment.diff(inMoment, "minutes"));
        const workingMinutes = Math.max(0, diffMinutes - 60);
        baseData[day - 1] = { day, hours: toHours(workingMinutes) };
      }
      setAttendanceTimeline(baseData);
    } catch (e: any) {
      setAttendanceTimelineError(String(e?.message || e));
    } finally {
      setAttendanceTimelineLoading(false);
    }
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
          count_thuong: response.data.data !== undefined ? response.data.data[0]?.THUONG : 0,
          count_phat: response.data.data !== undefined ? response.data.data[0]?.PHAT : 0,
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
  const uploadFile2 = async (selectedFile?: File) => {
    const fileToUpload = selectedFile ?? file;
    if (!fileToUpload) {
      Swal.fire("Thông báo", "Chưa chọn file", "warning");
      return;
    }
    uploadQuery(fileToUpload, "NS_" + userdata?.EMPL_NO + ".jpg", "Picture_NS")
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
  const avatarInputRef = React.useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    getData();
    getchamcong();
    fetchAttendanceTimeline();
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
  const isAdmin = userdata?.EMPL_NO === "NHU1903";
  const cardBg = `${company === "CMS" ? theme.CMS.backgroundImage : theme.PVN.backgroundImage}`;
  return (
    <div
      className='accountinfo'
      style={{
        backgroundImage: cardBg,
        ...( { ["--ai-card-bg" as any]: cardBg } as any ),
      }}
    >
      <div className="aiContainer">
        <div className="aiTitleRow">
          <h1 className='text-3xl'>
            {/* Thông tin của bạn */}
            {getsentence(17, lang ?? "en")}
          </h1>
          <div className="aiTitleChips">
            <Chip size="small" label={userdata?.EMPL_NO ?? ""} />
            <Chip size="small" variant="outlined" label={userdata?.JOB_NAME ?? ""} />
          </div>
        </div>

        <Card className="aiCard aiHeaderCard">
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <div className="aiAvatarBlock">
                  <div
                    className="aiAvatarFrame aiAvatarFrame--click"
                    onClick={() => {
                      avatarInputRef.current?.click();
                    }}
                  >
                    {userdata?.EMPL_IMAGE === "Y" ? (
                      <img
                        className="aiAvatar"
                        src={"/Picture_NS/NS_" + userdata?.EMPL_NO + ".jpg"}
                        alt={userdata?.EMPL_NO}
                      ></img>
                    ) : (
                      <div className="aiAvatarFallback">
                        {(userdata?.FIRST_NAME ?? "?").slice(0, 1)}
                      </div>
                    )}
                  </div>
                  <input
                    ref={avatarInputRef}
                    id="aiAvatarInput"
                    accept='.jpg'
                    type='file'
                    style={{ display: "none" }}
                    onChange={(e: any) => {
                      const selectedFile = e.target.files?.[0];
                      if (!selectedFile) return;
                      setFile(selectedFile);
                      uploadFile2(selectedFile);
                      e.target.value = "";
                    }}
                  />
                </div>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={0.75}>
                  <div className="aiName">
                    {/*  Họ và tên */}
                    {userdata?.MIDLAST_NAME} {userdata?.FIRST_NAME}
                  </div>
                  <div className="aiSub">
                    {/* Bộ phận chính */}
                    Main Department: {userdata?.MAINDEPTNAME}
                  </div>
                  <div className="aiSub">
                    {/* Bộ phận phụ */}
                    Sub Department: {userdata?.SUBDEPTNAME}
                  </div>
                  <div className="aiMetaRow">
                    <span>
                      {/* Mã nhân sự */}
                      {getsentence(20, lang ?? "en")}: <b>{userdata?.CMS_ID}</b>
                    </span>
                    <span>
                      {/* Mã ERP */}
                      {getsentence(21, lang ?? "en")}: <b>{userdata?.EMPL_NO}</b>
                    </span>
                  </div>
                </Stack>
              </Grid>

              <Grid item xs={12} md={3}>
                <div className="aiCheckinCard">
                  <div className='chamcongtitle' style={{ fontSize: "15px" }}>
                    IN/OUT: {moment().format("YYYY-MM-DD")}
                  </div>
                  <div className="aiCheckGrid">
                    <div className="aiCheckPill aiCheckPill--in">
                      <div className="aiCheckLabel">IN</div>
                      <div className="aiCheckTime">
                        {mychamcong?.MIN_TIME !== null
                          ? mychamcong?.MIN_TIME
                          : "Chưa chấm"}
                      </div>
                    </div>
                    <div className="aiCheckPill aiCheckPill--out">
                      <div className="aiCheckLabel">OUT</div>
                      <div className="aiCheckTime">
                        {mychamcong?.MAX_TIME !== null
                          ? mychamcong?.MAX_TIME
                          : "Chưa chấm"}
                      </div>
                    </div>
                  </div>
                </div>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card className="aiCard">
              <CardHeader
                title={
                  <div className="aiCardTitle">
                    <AiOutlineIdcard size={18} />
                    <span>
                      {/* Thông tin nhân viên */}
                      {getsentence(18, lang ?? "en")}
                    </span>
                  </div>
                }
              />
              <CardContent>
                <div className="aiInfoGrid">
                  <div className="aiInfoRow">
                    <div className="aiLabel">
                      {/* Ngày tháng năm sinh */}
                      {getsentence(22, lang ?? "en")}
                    </div>
                    <div className="aiValue">{DOB().slice(0, 10)}</div>
                  </div>
                  <div className="aiInfoRow">
                    <div className="aiLabel">
                      {/* Quê quán */}
                      {getsentence(23, lang ?? "en")}
                    </div>
                    <div className="aiValue">{userdata?.HOMETOWN}</div>
                  </div>
                  <div className="aiInfoRow">
                    <div className="aiLabel">
                      {/* Địa chỉ */}
                      {getsentence(24, lang ?? "en")}
                    </div>
                    <div className="aiValue">
                      {userdata?.ADD_VILLAGE}-{userdata?.ADD_COMMUNE}-{userdata?.ADD_DISTRICT}-{userdata?.ADD_PROVINCE}
                    </div>
                  </div>
                  <div className="aiInfoRow">
                    <div className="aiLabel">
                      {/*  Vị trí làm việc */}
                      {getsentence(27, lang ?? "en")}
                    </div>
                    <div className="aiValue">{userdata?.WORK_POSITION_NAME}</div>
                  </div>
                  <div className="aiInfoRow">
                    <div className="aiLabel">
                      {/* Nhóm điểm danh */}
                      {getsentence(28, lang ?? "en")}
                    </div>
                    <div className="aiValue">{userdata?.ATT_GROUP_CODE}</div>
                  </div>
                  <div className="aiInfoRow">
                    <div className="aiLabel">
                      {/* Chức vụ */}
                      {getsentence(29, lang ?? "en")}
                    </div>
                    <div className="aiValue">{userdata?.JOB_NAME}</div>
                  </div>
                  <div className="aiInfoRow aiActionRow">
                    <div className="aiLabel">
                    </div>
                    <div className="aiValue aiActionValue">
                      <Button
                        className="aiChangePwBtn"
                        variant="contained"
                        size="small"
                        onClick={() => setOpenChangePw(true)}
                        startIcon={<AiOutlineUnlock size={16} />}
                      >
                        Change password
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card className="aiCard">
              <CardHeader
                title={
                  <div className="aiCardTitle">
                    <AiOutlineBarChart size={18} />
                    <span>Summary</span>
                  </div>
                }
              />
              <CardContent>
                <div className="aiStatBlock">
                  <div className="aiStatTitle">
                    1. {/* Từ đầu năm đến giờ có */}
                    {getsentence(30, lang ?? "en")} : {Math.floor(days)} {/* ngày */}{" "}
                    {getsentence(31, lang ?? "en")}
                  </div>
                  <div className="aiStatValue">{workday} / {Math.floor(days)}</div>
                  <Box sx={{ width: "100%" }}>
                    <LinearProgressWithLabel value={(workday / Math.floor(days)) * 100} />
                  </Box>
                </div>

                <Divider className="aiDivider" />

                <div className="aiStatBlock">
                  <div className="aiStatTitle">
                    2. {/* Số ngày bạn đi làm */} {getsentence(32, lang ?? "en")}: {workday}{" "}
                    {/* ngày */}
                    {getsentence(31, lang ?? "en")}
                  </div>
                  <div className="aiStatValue">{overtimeday} / {Math.floor(workday)}</div>
                  <Box sx={{ width: "100%" }}>
                    <LinearProgressWithLabel value={workday === 0 ? 0 : Math.floor((overtimeday / workday) * 100)} />
                  </Box>
                </div>

                <Divider className="aiDivider" />

                <div className="aiStatBlock">
                  <div className="aiStatTitle">
                    3. {/*Số ngày bạn tăng ca*/}
                    {getsentence(33, lang ?? "en")} : {overtimeday} {/* ngày */}
                    {getsentence(31, lang ?? "en")}
                  </div>
                  <Box sx={{ width: "100%" }}>
                    <LinearProgressWithLabel value={workday === 0 ? 0 : Math.floor((countxacnhan / workday) * 100)} />
                  </Box>
                </div>

                <Divider className="aiDivider" />

                <div className="aiStatBlock">
                  <div className="aiStatTitle">
                    4. {/*Số ngày quên chấm công */}
                    {getsentence(34, lang ?? "en")} : {countxacnhan} {/* ngày */}
                    {getsentence(31, lang ?? "en")}
                  </div>
                </div>

                <Divider className="aiDivider" />

                <div className="aiStatBlock">
                  <div className="aiStatTitle">
                    5. {/* Số ngày bạn đăng ký nghỉ (ko tính chủ nhật và nửa phép) */}
                    {getsentence(35, lang ?? "en")}: {nghiday} {/* ngày */}{" "}
                    {getsentence(31, lang ?? "en")}
                  </div>
                </div>

                <Divider className="aiDivider" />

                <div className="aiStatBlock">
                  <div className="aiStatTitle">
                    6. {/* Thưởng phạt: Khen thưởng */} {getsentence(36, lang ?? "en")}:{" "}
                    {/*Khen thuong*/}
                    {getsentence(37, lang ?? "en")} {thuongphat.count_thuong} , {/* Kỷ luật */}
                    {getsentence(38, lang ?? "en")}: {thuongphat.count_phat}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card className="aiCard">
              <CardHeader
                title={
                  <div className="aiCardTitle">
                    <AiOutlineBarChart size={18} />
                    <span>Time line đi làm (Tháng {moment().format("MM")})</span>
                  </div>
                }
                action={
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      fetchAttendanceTimeline();
                    }}
                  >
                    Refresh
                  </Button>
                }
              />
              <CardContent>
                {attendanceTimelineError && (
                  <div style={{ color: "#c62828", marginBottom: 8 }}>{attendanceTimelineError}</div>
                )}
                {attendanceTimelineLoading && (
                  <Box sx={{ width: "100%", mb: 1 }}>
                    <LinearProgress />
                  </Box>
                )}
                <div style={{ width: "100%", height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={attendanceChartData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} domain={[0, 12]} />
                      <Tooltip
                        content={({ active, payload, label }: any) => {
                          if (!active || !payload || payload.length === 0) return null;
                          const item = payload.find((p: any) => p?.value != null);
                          if (!item) return null;
                          return (
                            <div
                              style={{
                                background: "white",
                                border: "1px solid rgba(0,0,0,0.15)",
                                padding: 8,
                                borderRadius: 8,
                              }}
                            >
                              <div style={{ fontWeight: 700, marginBottom: 4 }}>{`Ngày ${label}`}</div>
                              <div>{`${item.value} giờ`}</div>
                            </div>
                          );
                        }}
                      />
                      <Line type="monotone" dataKey="hoursPast" stroke="#2e7d32" strokeWidth={2} dot={false} isAnimationActive={!attendanceTimelineLoading} />
                      <Line type="monotone" dataKey="hoursFuture" stroke="#d32f2f" strokeWidth={2} dot={false} isAnimationActive={!attendanceTimelineLoading} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </Grid>

          <Dialog open={openChangePw} onClose={() => setOpenChangePw(false)} maxWidth="xs" fullWidth>
            <DialogTitle>Change Password</DialogTitle>
            <DialogContent>
              <div className="aiDialogForm">
                <TextField
                  label="Pass hiện tại"
                  type="password"
                  size="small"
                  value={currentPW}
                  onChange={(e) => {
                    setCurrentPW(e.target.value);
                  }}
                />
                <TextField
                  label="Pass mới"
                  type="password"
                  size="small"
                  value={newPW}
                  onChange={(e) => {
                    setNewPW(e.target.value);
                  }}
                />
              </div>
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" onClick={() => setOpenChangePw(false)}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  handleChangePassWord();
                  setOpenChangePw(false);
                }}
              >
                Confirm
              </Button>
            </DialogActions>
          </Dialog>

          {isAdmin && (
            <Grid item xs={12}>
              <Card className="aiCard aiAdminCard">
                <CardHeader
                  title={
                    <div className="aiCardTitle">
                      <AiOutlineTool size={18} />
                      <span>Admin tools</span>
                    </div>
                  }
                  action={
                    <Button
                      variant={showAdminTools ? "contained" : "outlined"}
                      size="small"
                      onClick={() => setShowAdminTools(!showAdminTools)}
                    >
                      {showAdminTools ? "Hide" : "Show"}
                    </Button>
                  }
                />
                <Collapse in={showAdminTools} timeout="auto" unmountOnExit>
                  <CardContent>
                    <div className="aiAdminGrid">
                      <TextField
                        label="Logout EMPL_NO"
                        size="small"
                        value={logoutID}
                        onChange={(e) => {
                          setLogOutID(e.target.value);
                        }}
                      />
                      <Button
                        variant="outlined"
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
                      <TextField
                        label="Web ver"
                        size="small"
                        value={webver}
                        onChange={(e) => {
                          setwebver(Number(e.target.value));
                        }}
                      />
                      <Button
                        variant="outlined"
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
                      <div className="aiAdminSelect">
                        <label>
                          Chọn Server:
                          <select
                            name="select_server"
                            value={server_string}
                            onChange={(e) => {
                              setServer_String(e.target.value);
                            }}
                          >
                            <option value={"https://cmsvina4285.com:" + 5013}>NET_SERVER</option>
                            <option value={"https://cmsvina4285.com:" + 3007}>SUBNET_SERVER</option>
                          </select>
                        </label>
                      </div>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          getSocket().emit("changeServer", { server: server_string, empl_no: logoutID });
                        }}
                      >
                        Set Server
                      </Button>
                      <div className="aiAdminFile">
                        <input
                          id="aiUpdateBe"
                          type="file"
                          onChange={(e) => {
                            setFile(e.target.files?.[0]);
                          }}
                        />
                      </div>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          if (file) {
                            uploadQuery(file, 'updatebe.exe', 'backend')
                              .then(async (response) => {
                                if (response.data.tk_status !== "NG") {
                                  Swal.fire("Thông báo", "Upload thành công", "success");
                                  window.open("http://192.168.1.192:5005/api/test/updatebackend", "_blank");
                                }
                                else {
                                  Swal.fire("Thông báo", "Upload thất bại: " + response.data.message, "error");
                                }
                              })
                              .catch((error) => {
                                console.log(error);
                                Swal.fire("Thông báo", "Upload thất bại", "error");
                              });
                          } else {
                            Swal.fire("Thông báo", "Chưa chọn file", "warning");
                          }
                        }}
                      >
                        Update backend
                      </Button>
                    </div>
                  </CardContent>
                </Collapse>
              </Card>
            </Grid>
          )}
        </Grid>
      </div>
    </div>
  );
}

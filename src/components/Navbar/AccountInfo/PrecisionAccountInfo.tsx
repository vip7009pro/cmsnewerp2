import React, { useState, useEffect, useCallback, useMemo } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { RootState } from "../../../redux/store";
import { changeUserData } from "../../../redux/slices/globalSlice";
import { generalQuery, uploadQuery } from "../../../api/Api";
import { UserData } from "../../../api/GlobalInterface";

import PrecisionStatusBanner from "./components/PrecisionStatusBanner";
import PrecisionHeroProfile from "./components/PrecisionHeroProfile";
import PrecisionLiveClock from "./components/PrecisionLiveClock";
import PrecisionKpiGrid from "./components/PrecisionKpiGrid";
import PrecisionDossierRecord from "./components/PrecisionDossierRecord";
import PrecisionAttendanceTimeline from "./components/PrecisionAttendanceTimeline";
import PrecisionAdminTools from "./components/PrecisionAdminTools";
import PrecisionChangePasswordDialog from "./components/PrecisionChangePasswordDialog";

import "./PrecisionAccountInfo.scss";

interface MYCHAMCONG {
  MIN_TIME: string;
  MAX_TIME: string;
}

export default function PrecisionAccountInfo() {
  const dispatch = useDispatch();
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );

  const [mychamcong, setMyChamCong] = useState<MYCHAMCONG>({
    MIN_TIME: "Chưa chấm",
    MAX_TIME: "Chưa chấm",
  });
  const [workday, setWorkDay] = useState(0);
  const [overtimeday, setOverTimeDay] = useState(0);
  const [nghiday, setNghiDay] = useState(0);
  const [countxacnhan, setCountXacNhan] = useState(0);
  const [thuongphat, setThuongPhat] = useState({
    count_thuong: 0,
    count_phat: 0,
  });

  const [attendanceTimeline, setAttendanceTimeline] = useState<Array<{ day: number; hours: number }>>([]);
  const [attendanceTimelineLoading, setAttendanceTimelineLoading] = useState(false);
  const [attendanceTimelineError, setAttendanceTimelineError] = useState<string | null>(null);

  const [openChangePw, setOpenChangePw] = useState(false);

  // Calculate working days from start of year to today (excluding Sundays)
  const days = useMemo(() => {
    const startOfYear = moment().year() + "-01-01";
    let count = 0;
    const curDate = new Date(startOfYear);
    const endDate = new Date();
    while (curDate <= endDate) {
      if (curDate.getDay() !== 0) count++;
      curDate.setDate(curDate.getDate() + 1);
    }
    return count;
  }, []);

  // Fetch KPI statistics
  const getData = useCallback(() => {
    generalQuery("workdaycheck", {})
      .then((res) => {
        setWorkDay(res.data.data[0]?.WORK_DAY ?? 0);
      })
      .catch((err) => console.error(err));

    generalQuery("tangcadaycheck", {})
      .then((res) => {
        setOverTimeDay(res.data.data[0]?.TANGCA_DAY ?? 0);
      })
      .catch((err) => console.error(err));

    generalQuery("nghidaycheck", {})
      .then((res) => {
        setNghiDay(res.data.data[0]?.NGHI_DAY ?? 0);
      })
      .catch((err) => console.error(err));

    generalQuery("countxacnhanchamcong", {})
      .then((res) => {
        setCountXacNhan(res.data.data[0]?.COUTNXN ?? 0);
      })
      .catch((err) => console.error(err));

    generalQuery("countthuongphat", {})
      .then((res) => {
        setThuongPhat({
          count_thuong: res.data.data !== undefined ? res.data.data[0]?.THUONG ?? 0 : 0,
          count_phat: res.data.data !== undefined ? res.data.data[0]?.PHAT ?? 0 : 0,
        });
      })
      .catch((err) => console.error(err));
  }, []);

  // Fetch today's check-in/out status
  const getChamCong = useCallback(() => {
    generalQuery("checkMYCHAMCONG", {})
      .then((response) => {
        if (response.data.tk_status !== "NG" && response.data.data?.[0]) {
          const loadedData: MYCHAMCONG = { ...response.data.data[0] };
          loadedData.MIN_TIME = loadedData.MIN_TIME?.substring(11, 19) || "Chưa chấm";
          loadedData.MAX_TIME = loadedData.MAX_TIME?.substring(11, 19) || "Chưa chấm";

          const minH = Number(loadedData.MIN_TIME.substring(0, 2));
          const minM = Number(loadedData.MIN_TIME.substring(3, 5));
          const maxH = Number(loadedData.MAX_TIME.substring(0, 2));
          const maxM = Number(loadedData.MAX_TIME.substring(3, 5));

          if (minH === maxH && maxM - minM < 30) {
            loadedData.MAX_TIME = "Chưa chấm";
          }

          setMyChamCong(loadedData);
        } else {
          setMyChamCong({
            MIN_TIME: "Chưa chấm",
            MAX_TIME: "Chưa chấm",
          });
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // Fetch monthly attendance timeline
  const fetchAttendanceTimeline = useCallback(async () => {
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
        setAttendanceTimelineError(response.data.message || "Tải dữ liệu thất bại");
        return;
      }

      const rows: any[] = response.data.data || [];

      const parseTime = (dateStr: string, timeStr: string) => {
        const clean = String(timeStr || "").trim();
        if (!clean || clean === "OFF") return null;
        return moment(`${dateStr} ${clean}`, [
          "YYYY-MM-DD HH:mm",
          "YYYY-MM-DD HH:mm:ss",
          "YYYY-MM-DD H:mm",
          "YYYY-MM-DD H:mm:ss",
        ], true);
      };

      const toHours = (mins: number) => Math.round((mins / 60) * 10) / 10;

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
  }, []);

  // Upload Employee Avatar
  const handleUploadAvatar = useCallback((file: File) => {
    if (!userData?.EMPL_NO) return;

    uploadQuery(file, "NS_" + userData.EMPL_NO + ".jpg", "Picture_NS")
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          generalQuery("update_empl_image", {
            EMPL_NO: userData.EMPL_NO,
            EMPL_IMAGE: "Y",
          })
            .then((res) => {
              if (res.data.tk_status !== "NG") {
                dispatch(changeUserData({ ...userData, EMPL_IMAGE: "Y" }));
                Swal.fire("Thành công", "Cập nhật ảnh đại diện thành công", "success");
              } else {
                Swal.fire("Lỗi", "Cập nhật dữ liệu ảnh thất bại", "error");
              }
            })
            .catch((err) => {
              console.error(err);
              Swal.fire("Lỗi", "Không thể kết nối máy chủ", "error");
            });
        } else {
          Swal.fire("Lỗi", "Tải ảnh thất bại: " + response.data.message, "error");
        }
      })
      .catch((err) => {
        console.error(err);
        Swal.fire("Lỗi", "Tải ảnh thất bại", "error");
      });
  }, [dispatch, userData]);

  useEffect(() => {
    getData();
    getChamCong();
    fetchAttendanceTimeline();

    // 5-second interval for live attendance clock
    const intervalID = setInterval(() => {
      getChamCong();
    }, 5000);

    return () => clearInterval(intervalID);
  }, [getData, getChamCong, fetchAttendanceTimeline]);

  const isAdmin = userData?.EMPL_NO === "NHU1903";

  return (
    <div className="precision-hub">
      <div className="precision-hub__content">
        {/* 1. System Status Banner */}
        <PrecisionStatusBanner shiftName={userData?.WORK_SHIF_NAME} />

        {/* 2. Top Section: Profile Hero (7 Cols) & Live Attendance Clock (5 Cols) */}
        <div className="precision-hub__topGrid">
          <PrecisionHeroProfile
            userData={userData}
            onOpenChangePassword={() => setOpenChangePw(true)}
            onUploadAvatar={handleUploadAvatar}
          />
          <PrecisionLiveClock mychamcong={mychamcong} />
        </div>

        {/* 3. 6-Card KPI Metrics Grid */}
        <PrecisionKpiGrid
          workday={workday}
          days={days}
          overtimeday={overtimeday}
          countxacnhan={countxacnhan}
          nghiday={nghiday}
          thuongphat={thuongphat}
        />

        {/* 4. Detailed Employee Dossier Record (Electronic HR Ledger) */}
        <PrecisionDossierRecord userData={userData} />

        {/* 5. 30-Day Attendance & Work Hour Timeline */}
        <PrecisionAttendanceTimeline
          attendanceTimeline={attendanceTimeline}
          isLoading={attendanceTimelineLoading}
          error={attendanceTimelineError}
          onRefresh={fetchAttendanceTimeline}
        />

        {/* 6. Admin Tools (NHU1903 Only) */}
        {isAdmin && <PrecisionAdminTools />}

        {/* 7. Change Password Dialog */}
        <PrecisionChangePasswordDialog
          open={openChangePw}
          onClose={() => setOpenChangePw(false)}
        />
      </div>
    </div>
  );
}

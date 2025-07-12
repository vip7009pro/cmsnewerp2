import { useCallback, useEffect, useMemo, useState } from "react";
import { generalQuery, getSocket, getUserData } from "../../../api/Api";
import "./DiemDanhNhom.scss";
import Swal from "sweetalert2";
import { f_insert_Notification_Data } from "../../../api/GlobalFunction";
import moment from "moment";
import { getlang } from "../../../components/String/String";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { NotificationElement } from "../../../components/NotificationPanel/Notification";
import AGTable from "../../../components/DataTable/AGTable";
import { DiemDanhNhomData } from "../interfaces/nhansuInterface";
const DiemDanhNhomCMS = ({ option }: { option: string }) => {
  const glbLang: string | undefined = useSelector(
    (state: RootState) => state.totalSlice.lang
  );
  const [WORK_SHIFT_CODE, setWORK_SHIFT_CODE] = useState(0);
  const [diemdanhnhomtable, setDiemDanhNhomTable] = useState<
    Array<DiemDanhNhomData>
  >([]);
  const columns_diemdanhnhom = useMemo(
    () => [
      {
        field: "id",
        headerName: "STT",
        width: 30,
        headerClassName: "super-app-theme--header",
      },
      {
        field: "EMPL_NO",
        headerName: "EMPL_NO",
        width: 50,
        headerClassName: "super-app-theme--header",
      },
      {
        field: "CMS_ID",
        headerName: "NS_ID",
        width: 50,
        headerClassName: "super-app-theme--header",
      },
      {
        field: "FULL_NAME",
        headerName: "FULL_NAME",
        width: 120,
        headerClassName: "super-app-theme--header",
        cellRenderer: (params: any) => {
          return (
            <span
              style={{
                fontWeight: "bold",
                color:
                  params.data?.ON_OFF === 1
                    ? "green"
                    : params.data?.ON_OFF === 0
                    ? "red"
                    : "",
              }}
            >
              {params.data?.FULL_NAME}
            </span>
          );
        },
      },
      {
        field: "AVATAR",
        headerName: "AVATAR",
        width: 70,
        cellRenderer: (params: any) => {
          return (
            <img
              width={`100%`}
              height={80}
              src={"/Picture_NS/NS_" + params.data?.EMPL_NO + ".jpg"}
              alt={params.data?.EMPL_NO}
            ></img>
          );
        },
        headerClassName: "super-app-theme--header",
      },
      {
        field: "DIEMDANH",
        headerName: "DIEMDANH",
        width: 150,
        cellRenderer: (params: any) => {
          let typeclass: string =
            params.data?.ON_OFF === 1
              ? "onbt"
              : params.data?.ON_OFF === 0
              ? "offbt"
              : "";
          const dangkynghi_auto = (REASON_CODE: number) => {
            const insertData = {
              canghi: 1,
              reason_code: REASON_CODE,
              remark_content: "AUTO",
              ngaybatdau: moment().format("YYYY-MM-DD"),
              ngayketthuc: moment().format("YYYY-MM-DD"),
              EMPL_NO: params.data?.EMPL_NO,
            };
            ////console.log(insertData);
            generalQuery("dangkynghi2_AUTO", insertData)
              .then((response) => {
                if (response.data.tk_status === "OK") {
                  const newProjects = diemdanhnhomtable.map((p) =>
                    p.EMPL_NO === params.data?.EMPL_NO
                      ? { ...p, ON_OFF: 0, REASON_NAME: "AUTO" }
                      : p
                  );
                  setDiemDanhNhomTable(newProjects);
                  Swal.fire(
                    "Thông báo",
                    "Người này nghỉ ko đăng ký, auto đăng ký nghỉ!",
                    "warning"
                  );
                } else {
                  Swal.fire(
                    "Lỗi",
                    "Người này nghỉ ko đăng ký, auto chuyển nghỉ, tuy nhiên thao tác thất bại ! " +
                      response.data.message,
                    "error"
                  );
                }
              })
              .catch((error) => {
                //console.log(error);
              });
          };
          const xoadangkynghi_auto = () => {
            const insertData = {
              EMPL_NO: params.data?.EMPL_NO,
            };
            ////console.log(insertData);
            generalQuery("xoadangkynghi_AUTO", insertData)
              .then((response) => {
                //console.log(response.data.tk_status)
                if (response.data.tk_status === "OK") {
                } else {
                  /*  Swal.fire(
                          "Lỗi",
                          "Xóa đăng ký nghỉ AUTO thất bại, hãy chuyển qua xóa thủ công !" +
                            response.data.message,
                          "error"
                        ); */
                }
              })
              .catch((error) => {
                //console.log(error);
              });
          };
          const onClick = async (type: number, calv?: number) => {
            let current_team_dayshift: number = -2;
            /*  await generalQuery("checkcurrentDAYSHIFT",{})
                    .then((response) => {
                      //console.log(response.data.tk_status)
                      if (response.data.tk_status === "OK") {
                        current_team_dayshift = response.data.data[0].DAYSHIFT;                        
                      } else {
                      }
                    })
                    .catch((error) => {
                    }); */
            if (current_team_dayshift !== -1) {
              if (type === 1) {
                if (
                  params.data?.OFF_ID === null ||
                  params.data?.REASON_NAME === "Nửa phép"
                ) {
                  generalQuery("setdiemdanhnhom", {
                    diemdanhvalue: type,
                    EMPL_NO: params.data?.EMPL_NO,
                    CURRENT_TEAM:
                      params.data?.WORK_SHIF_NAME === "Hành Chính"
                        ? 0
                        : params.data?.WORK_SHIF_NAME === "TEAM 1"
                        ? 1
                        : 2,
                    CURRENT_CA:
                      params.data?.WORK_SHIF_NAME === "Hành Chính" ? 0 : calv,
                  })
                    .then(async (response) => {
                      //console.log(response.data);
                      if (response.data.tk_status === "OK") {
                        const newProjects = diemdanhnhomtable.map((p) =>
                          p.EMPL_NO === params.data?.EMPL_NO
                            ? { ...p, ON_OFF: type }
                            : p
                        );
                        setDiemDanhNhomTable(newProjects);
                      } else {
                        Swal.fire(
                          "Có lỗi",
                          "Nội dung: " + response.data.message,
                          "error"
                        );
                      }
                    })
                    .catch((error) => {
                      //console.log(error);
                    });
                } else {
                  Swal.fire(
                    "Có lỗi",
                    "Đã đăng ký nghỉ rồi, không điểm danh được",
                    "error"
                  );
                }
              } else if (type === 0) {
                generalQuery("setdiemdanhnhom", {
                  diemdanhvalue: type,
                  EMPL_NO: params.data?.EMPL_NO,
                  CURRENT_TEAM:
                    params.data?.WORK_SHIF_NAME === "Hành Chính"
                      ? 0
                      : params.data?.WORK_SHIF_NAME === "TEAM 1"
                      ? 1
                      : 2,
                  CURRENT_CA:
                    params.data?.WORK_SHIF_NAME === "Hành Chính" ? 0 : calv,
                })
                  .then((response) => {
                    //console.log(response.data);
                    if (response.data.tk_status === "OK") {
                      const newProjects = diemdanhnhomtable.map((p) =>
                        p.EMPL_NO === params.data?.EMPL_NO
                          ? { ...p, ON_OFF: type }
                          : p
                      );
                      if (params.data?.OFF_ID === null) {
                        dangkynghi_auto(3);
                      }
                      setDiemDanhNhomTable(newProjects);
                    } else {
                      Swal.fire(
                        "Có lỗi",
                        "Nội dung: " + response.data.message,
                        "error"
                      );
                    }
                  })
                  .catch((error) => {
                    //console.log(error);
                  });
              } else if (type === 2) {
                generalQuery("setdiemdanhnhom", {
                  diemdanhvalue: 0,
                  EMPL_NO: params.data?.EMPL_NO,
                  CURRENT_TEAM:
                    params.data?.WORK_SHIF_NAME === "Hành Chính"
                      ? 0
                      : params.data?.WORK_SHIF_NAME === "TEAM 1"
                      ? 1
                      : 2,
                  CURRENT_CA:
                    params.data?.WORK_SHIF_NAME === "Hành Chính" ? 0 : calv,
                })
                  .then((response) => {
                    //console.log(response.data);
                    if (response.data.tk_status === "OK") {
                      const newProjects = diemdanhnhomtable.map((p) =>
                        p.EMPL_NO === params.data?.EMPL_NO
                          ? { ...p, ON_OFF: 0 }
                          : p
                      );
                      if (params.data?.OFF_ID === null) {
                        dangkynghi_auto(5);
                      }
                      setDiemDanhNhomTable(newProjects);
                    } else {
                      Swal.fire(
                        "Có lỗi",
                        "Nội dung: " + response.data.message,
                        "error"
                      );
                    }
                  })
                  .catch((error) => {
                    //console.log(error);
                  });
              }
              let newNotification: NotificationElement = {
                CTR_CD: "002",
                NOTI_ID: -1,
                NOTI_TYPE: "success",
                TITLE: "Điểm danh thủ công",
                CONTENT: `${getUserData()?.EMPL_NO} (${
                  getUserData()?.MIDLAST_NAME
                } ${getUserData()?.FIRST_NAME}), nhân viên ${
                  getUserData()?.WORK_POSITION_NAME
                } đã điểm danh thủ công cho ${params.data?.EMPL_NO}_ ${
                  params.data?.MIDLAST_NAME
                } ${params.data?.FIRST_NAME} ${type === 1 ? "đi làm" : "nghỉ"}`,
                SUBDEPTNAME: getUserData()?.SUBDEPTNAME ?? "",
                MAINDEPTNAME: getUserData()?.MAINDEPTNAME ?? "",
                INS_EMPL: "NHU1903",
                INS_DATE: "2024-12-30",
                UPD_EMPL: "NHU1903",
                UPD_DATE: "2024-12-30",
              };
              if (await f_insert_Notification_Data(newNotification)) {
                getSocket().emit("notification_panel", newNotification);
              }
            } else {
            }
          };
          const onReset = () => {
            if (params.data?.REMARK === "AUTO") {
              const newProjects = diemdanhnhomtable.map((p) =>
                p.EMPL_NO === params.data?.EMPL_NO
                  ? { ...p, ON_OFF: null, OFF_ID: null, REASON_NAME: null }
                  : p
              );
              setDiemDanhNhomTable(newProjects);
              xoadangkynghi_auto();
            } else {
              const newProjects = diemdanhnhomtable.map((p) =>
                p.EMPL_NO === params.data?.EMPL_NO ? { ...p, ON_OFF: null } : p
              );
              setDiemDanhNhomTable(newProjects);
            }
          };
          if (params.data?.ON_OFF === null) {
            return (
              <div className={`onoffdiv ${typeclass}`}>
                <button className="onbutton" onClick={() => onClick(1, 1)}>
                  Làm Ngày
                </button>{" "}
                <br></br>
                <button className="onbutton" onClick={() => onClick(1, 2)}>
                  Làm Đêm
                </button>{" "}
                <br></br>
                <button className="offbutton" onClick={() => onClick(0, 1)}>
                  Nghỉ
                </button>
                <button className="off50button" onClick={() => onClick(2)}>
                  50%
                </button>
              </div>
            );
          }
          return (
            <div className="onoffdiv">
              <span
                style={{ color: params.data?.ON_OFF === 1 ? "green" : "red" }}
              >
                {params.data?.ON_OFF === 1 ? "Đi làm" : "Nghỉ làm"}
              </span>
              <button className="resetbutton" onClick={() => onReset()}>
                RESET
              </button>
            </div>
          );
        },
        headerClassName: "super-app-theme--header",
      },
      {
        field: "TANGCA",
        headerName: "TANGCA",
        minWidth: 150,
        flex: 1,
        cellRenderer: (params: any) => {
          let typeclass: string =
            params.data?.OVERTIME === 1
              ? "onbt"
              : params.data?.OVERTIME === 0
              ? "offbt"
              : "";
          const onClick = (overtimeinfo: string) => {
            //Swal.fire("Thông báo", "Gia tri = " + params.data?.EMPL_NO, "success");
            generalQuery("dangkytangcanhom", {
              tangcavalue: overtimeinfo === "KTC" ? 0 : 1,
              EMPL_NO: params.data?.EMPL_NO,
              overtime_info: overtimeinfo,
            })
              .then(async (response) => {
                //console.log(response.data);
                if (response.data.tk_status === "OK") {
                  const newProjects = diemdanhnhomtable.map((p) =>
                    p.EMPL_NO === params.data?.EMPL_NO
                      ? {
                          ...p,
                          OVERTIME: overtimeinfo === "KTC" ? 0 : 1,
                          OVERTIME_INFO: overtimeinfo,
                        }
                      : p
                  );
                  let newNotification: NotificationElement = {
                    CTR_CD: "002",
                    NOTI_ID: -1,
                    NOTI_TYPE: "success",
                    TITLE: "Đăng ký tăng ca hộ",
                    CONTENT: `${getUserData()?.EMPL_NO} (${
                      getUserData()?.MIDLAST_NAME
                    } ${getUserData()?.FIRST_NAME}), nhân viên ${
                      getUserData()?.WORK_POSITION_NAME
                    } đã đăng ký tăng ca cho ${params.data?.EMPL_NO}_ ${
                      params.data?.MIDLAST_NAME
                    } ${params.data?.FIRST_NAME} ${overtimeinfo}`,
                    SUBDEPTNAME: getUserData()?.SUBDEPTNAME ?? "",
                    MAINDEPTNAME: getUserData()?.MAINDEPTNAME ?? "",
                    INS_EMPL: "NHU1903",
                    INS_DATE: "2024-12-30",
                    UPD_EMPL: "NHU1903",
                    UPD_DATE: "2024-12-30",
                  };
                  if (await f_insert_Notification_Data(newNotification)) {
                    getSocket().emit("notification_panel", newNotification);
                  }
                  setDiemDanhNhomTable(newProjects);
                } else {
                  Swal.fire(
                    "Có lỗi",
                    "Nội dung: " + response.data.message,
                    "error"
                  );
                }
              })
              .catch((error) => {
                //console.log(error);
              });
          };
          const onReset = () => {
            const newProjects = diemdanhnhomtable.map((p) =>
              p.EMPL_NO === params.data?.EMPL_NO
                ? { ...p, OVERTIME: null, OVERTIME_INFO: null }
                : p
            );
            ////console.log(newProjects);
            setDiemDanhNhomTable(newProjects);
          };
          if (params.data?.OVERTIME === null) {
            return (
              <div className={`onoffdiv ${typeclass}`}>
                <button className="tcbutton" onClick={() => onClick("KTC")}>
                  KTC
                </button>
                <button
                  className="tcbutton"
                  onClick={() => onClick("0500-0800")}
                >
                  05-08
                </button>
                <button
                  className="tcbutton"
                  onClick={() => onClick("1700-2000")}
                >
                  17-20
                </button>
                <button
                  className="tcbutton"
                  onClick={() => onClick("1700-1800")}
                >
                  17-18
                </button>
                <button
                  className="tcbutton"
                  onClick={() => onClick("1400-1800")}
                >
                  14-18
                </button>
                <button
                  className="tcbutton"
                  onClick={() => onClick("1600-2000")}
                >
                  16-20
                </button>
              </div>
            );
          }
          return (
            <div className="onoffdiv">
              <span
                style={{ color: params.data?.OVERTIME === 1 ? "green" : "red" }}
              >
                {params.data?.OVERTIME_INFO}
              </span>
              <button className="resetbutton" onClick={() => onReset()}>
                RESET
              </button>
            </div>
          );
        },
        headerClassName: "super-app-theme--header",
      },
      {
        field: "PHONE_NUMBER",
        headerName: "PHONE_NUMBER",
        width: 80,
        headerClassName: "super-app-theme--header",
      },
      {
        field: "FACTORY_NAME",
        headerName: "FACTORY_NAME",
        width: 80,
        headerClassName: "super-app-theme--header",
      },
      {
        field: "JOB_NAME",
        headerName: "JOB_NAME",
        width: 60,
        headerClassName: "super-app-theme--header",
      },
      {
        field: "WORK_SHIF_NAME",
        headerName: "TEAM",
        width: 60,
        headerClassName: "super-app-theme--header",
      },
      {
        field: "WORK_POSITION_NAME",
        headerName: "VI TRI",
        width: 60,
        headerClassName: "super-app-theme--header",
      },
      {
        field: "SUBDEPTNAME",
        headerName: "SUBDEPTNAME",
        width: 80,
        headerClassName: "super-app-theme--header",
      },
      {
        field: "MAINDEPTNAME",
        headerName: "MAINDEPTNAME",
        width: 80,
        headerClassName: "super-app-theme--header",
      },
      {
        field: "REQUEST_DATE",
        headerName: "REQUEST_DATE",
        width: 80,
        headerClassName: "super-app-theme--header",
      },
      {
        field: "APPLY_DATE",
        headerName: "APPLY_DATE",
        width: 80,
        headerClassName: "super-app-theme--header",
      },
      {
        field: "APPROVAL_STATUS",
        headerName: "TT_PHEDUYET",
        width: 80,
        headerClassName: "super-app-theme--header",
      },
      {
        field: "REASON_NAME",
        headerName: "REASON_NAME",
        width: 80,
        headerClassName: "super-app-theme--header",
      },
      {
        field: "OFF_ID",
        headerName: "OFF_ID",
        width: 80,
        headerClassName: "super-app-theme--header",
      },
      {
        field: "CA_NGHI",
        headerName: "CA_NGHI",
        width: 80,
        headerClassName: "super-app-theme--header",
      },
      {
        field: "ON_OFF",
        headerName: "ON_OFF",
        width: 80,
        headerClassName: "super-app-theme--header",
      },
      {
        field: "OVERTIME_INFO",
        headerName: "OVERTIME_INFO",
        width: 80,
        headerClassName: "super-app-theme--header",
      },
      {
        field: "OVERTIME",
        headerName: "OVERTIME",
        width: 80,
        headerClassName: "super-app-theme--header",
      },
      {
        field: "REMARK",
        headerName: "REMARK",
        width: 80,
        headerClassName: "super-app-theme--header",
      },
    ],
    [diemdanhnhomtable]
  );
  const onselectionteamhandle = useCallback(
    (teamnamelist: number) => {
      setWORK_SHIFT_CODE(teamnamelist);
      generalQuery(option, { team_name_list: teamnamelist })
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            let loaded_data = response.data.data.map(
              (e: any, index: number) => {
                return {
                  ...e,
                  REQUEST_DATE:
                    e.REQUEST_DATE !== null
                      ? moment.utc(e.REQUEST_DATE).format("YYYY-MM-DD")
                      : "",
                  APPLY_DATE:
                    e.APPLY_DATE !== null
                      ? moment.utc(e.APPLY_DATE).format("YYYY-MM-DD")
                      : "",
                  FULL_NAME: e.MIDLAST_NAME + " " + e.FIRST_NAME,
                  id: index + 1,
                };
              }
            );
            setDiemDanhNhomTable(loaded_data);
            Swal.fire(
              "Thông báo",
              "Đã load " + response.data.data.length + " dòng",
              "success"
            );
          } else {
            Swal.fire(
              "Thông báo",
              "Nội dung: " + response.data.message,
              "error"
            );
          }
        })
        .catch((error) => {
          //console.log(error);
        });
    },
    [WORK_SHIFT_CODE]
  );
  const diemdanhnhomAGTable = useMemo(() => {
    return (
      <AGTable
        rowHeight={80}
        suppressRowClickSelection={false}
        toolbar={<></>}
        columns={columns_diemdanhnhom}
        data={diemdanhnhomtable}
        onCellEditingStopped={(e) => {
          //console.log(e.data)
        }}
        onRowClick={(e) => {
          //console.log(e.data)
        }}
        onSelectionChange={(e) => {
          //console.log(e!.api.getSelectedRows())
        }}
      />
    );
  }, [diemdanhnhomtable]);
  useEffect(() => {
    onselectionteamhandle(5);
  }, []);
  return (
    <div className="diemdanhnhom">
      <div className="filterform">
        <label>
          {getlang("calamviec", glbLang!)}:
          <select
            name="calamviec"
            value={WORK_SHIFT_CODE}
            onChange={(e) => {
              onselectionteamhandle(Number(e.target.value));
            }}
          >
            <option value={0}>TEAM 1 + Hành chính</option>
            <option value={1}>TEAM 2+ Hành chính</option>
            <option value={2}>TEAM 1</option>
            <option value={3}>TEAM 2</option>
            <option value={4}>Hành chính</option>
            <option value={5}>Tất cả</option>
          </select>
        </label>
      </div>
      <div className="maindept_table">{diemdanhnhomAGTable}</div>
    </div>
  );
};
export default DiemDanhNhomCMS;

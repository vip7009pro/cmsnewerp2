import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { generalQuery, getSocket, getUserData } from "../../../api/Api";
import "./DiemDanhNhom.scss";
import Swal from "sweetalert2";
import { f_insert_Notification_Data, SaveExcel } from "../../../api/GlobalFunction";
import moment from "moment";
import { DiemDanhNhomData } from "../../../api/GlobalInterface";
import { getlang } from "../../../components/String/String";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { NotificationElement } from "../../../components/NotificationPanel/Notification";
const DiemDanhNhom = () => {
  const glbLang: string | undefined = useSelector(
    (state: RootState) => state.totalSlice.lang,
  );
  const [isLoading, setisLoading] = useState(false);
  const [WORK_SHIFT_CODE, setWORK_SHIFT_CODE] = useState(0);
  const [diemdanhnhomtable, setDiemDanhNhomTable] = useState<
    Array<DiemDanhNhomData>
  >([]);
  const columns_diemdanhnhom = [
    { field: "EMPL_NO", headerName: "EMPL_NO", width: 170, headerClassName: 'super-app-theme--header' },
    { field: "CMS_ID", headerName: "NS_ID", width: 100, headerClassName: 'super-app-theme--header' },
    {
      field: "AVATAR",
      headerName: "AVATAR",
      width: 70,
      renderCell: (params: any) => {
        return (
          <img
            width={70}
            height={90}
            src={"/Picture_NS/NS_" + params.row.EMPL_NO + ".jpg"}
            alt={params.row.EMPL_NO}
          ></img>
        );
      }, headerClassName: 'super-app-theme--header',
    },
    {
      field: "DIEMDANH",
      headerName: "DIEMDANH",
      width: 200,
      renderCell: (params: any) => {
        let typeclass: string =
          params.row.ON_OFF === 1
            ? "onbt"
            : params.row.ON_OFF === 0
              ? "offbt"
              : "";
        const dangkynghi_auto = (REASON_CODE: number) => {
          const insertData = {
            canghi: 1,
            reason_code: REASON_CODE,
            remark_content: "AUTO",
            ngaybatdau: moment().format("YYYY-MM-DD"),
            ngayketthuc: moment().format("YYYY-MM-DD"),
            EMPL_NO: params.row.EMPL_NO,
          };
          ////console.log(insertData);
          generalQuery("dangkynghi2_AUTO", insertData)
            .then((response) => {
              if (response.data.tk_status === "OK") {
                const newProjects = diemdanhnhomtable.map((p) =>
                  p.EMPL_NO === params.row.EMPL_NO
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
            EMPL_NO: params.row.EMPL_NO,
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
                params.row.OFF_ID === null ||
                params.row.REASON_NAME === "Nửa phép"
              ) {
                generalQuery("setdiemdanhnhom", {
                  diemdanhvalue: type,
                  EMPL_NO: params.row.EMPL_NO,
                  CURRENT_TEAM:
                    params.row.WORK_SHIF_NAME === "Hành Chính"
                      ? 0
                      : params.row.WORK_SHIF_NAME === "TEAM 1"
                        ? 1
                        : 2,
                  CURRENT_CA:
                    params.row.WORK_SHIF_NAME === "Hành Chính" ? 0 : calv,
                })
                  .then(async (response) => {
                    //console.log(response.data);
                    if (response.data.tk_status === "OK") {
                      const newProjects = diemdanhnhomtable.map((p) =>
                        p.EMPL_NO === params.row.EMPL_NO
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
                EMPL_NO: params.row.EMPL_NO,
                CURRENT_TEAM:
                  params.row.WORK_SHIF_NAME === "Hành Chính"
                    ? 0
                    : params.row.WORK_SHIF_NAME === "TEAM 1"
                      ? 1
                      : 2,
                CURRENT_CA:
                  params.row.WORK_SHIF_NAME === "Hành Chính" ? 0 : calv,
              })
                .then((response) => {
                  //console.log(response.data);
                  if (response.data.tk_status === "OK") {
                    const newProjects = diemdanhnhomtable.map((p) =>
                      p.EMPL_NO === params.row.EMPL_NO
                        ? { ...p, ON_OFF: type }
                        : p
                    );
                    if (params.row.OFF_ID === null) {
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
                EMPL_NO: params.row.EMPL_NO,
                CURRENT_TEAM:
                  params.row.WORK_SHIF_NAME === "Hành Chính"
                    ? 0
                    : params.row.WORK_SHIF_NAME === "TEAM 1"
                      ? 1
                      : 2,
                CURRENT_CA:
                  params.row.WORK_SHIF_NAME === "Hành Chính" ? 0 : calv,
              })
                .then((response) => {
                  //console.log(response.data);
                  if (response.data.tk_status === "OK") {
                    const newProjects = diemdanhnhomtable.map((p) =>
                      p.EMPL_NO === params.row.EMPL_NO ? { ...p, ON_OFF: 0 } : p
                    );
                    if (params.row.OFF_ID === null) {
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
              CTR_CD: '002',
              NOTI_ID: -1,
              NOTI_TYPE: "success",
              TITLE: 'Điểm danh thủ công',
              CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${getUserData()?.FIRST_NAME}), nhân viên ${getUserData()?.WORK_POSITION_NAME} đã điểm danh thủ công cho ${params.row.EMPL_NO}_ ${params.row.MIDLAST_NAME} ${params.row.FIRST_NAME} ${type === 1 ? 'đi làm':'nghỉ'}`,
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
          } else {
          }
        };
        const onReset = () => {
          if (params.row.REMARK === "AUTO") {
            const newProjects = diemdanhnhomtable.map((p) =>
              p.EMPL_NO === params.row.EMPL_NO
                ? { ...p, ON_OFF: null, OFF_ID: null, REASON_NAME: null }
                : p
            );
            setDiemDanhNhomTable(newProjects);
            xoadangkynghi_auto();
          } else {
            const newProjects = diemdanhnhomtable.map((p) =>
              p.EMPL_NO === params.row.EMPL_NO ? { ...p, ON_OFF: null } : p
            );
            setDiemDanhNhomTable(newProjects);
          }
        };
        if (params.row.ON_OFF === null) {
          return (
            <div className={`onoffdiv ${typeclass}`}>
              <button className='onbutton' onClick={() => onClick(1, 1)}>
                Làm Ngày
              </button>{" "}
              <br></br>
              <button className='onbutton' onClick={() => onClick(1, 2)}>
                Làm Đêm
              </button>{" "}
              <br></br>
              <button className='offbutton' onClick={() => onClick(0, 1)}>
                Nghỉ
              </button>
              <button className='off50button' onClick={() => onClick(2)}>
                50%
              </button>
            </div>
          );
        }
        return (
          <div className='onoffdiv'>
            <span className={`onoffshowtext A${params.row.ON_OFF}`}>
              {params.row.ON_OFF === 1 ? "ON" : "OFF"}
            </span>
            <button className='resetbutton' onClick={() => onReset()}>
              RESET
            </button>
          </div>
        );
      }, headerClassName: 'super-app-theme--header',
    },
    {
      field: "TANGCA",
      headerName: "TANGCA",
      minWidth: 200,
      flex: 1,
      renderCell: (params: any) => {
        let typeclass: string =
          params.row.OVERTIME === 1
            ? "onbt"
            : params.row.OVERTIME === 0
              ? "offbt"
              : "";
        const onClick = (overtimeinfo: string) => {
          //Swal.fire("Thông báo", "Gia tri = " + params.row.EMPL_NO, "success");
          generalQuery("dangkytangcanhom", {
            tangcavalue: overtimeinfo === "KTC" ? 0 : 1,
            EMPL_NO: params.row.EMPL_NO,
            overtime_info: overtimeinfo,
          })
            .then(async (response) => {
              //console.log(response.data);
              if (response.data.tk_status === "OK") {
                const newProjects = diemdanhnhomtable.map((p) =>
                  p.EMPL_NO === params.row.EMPL_NO
                    ? {
                      ...p,
                      OVERTIME: overtimeinfo === "KTC" ? 0 : 1,
                      OVERTIME_INFO: overtimeinfo,
                    }
                    : p
                );
                let newNotification: NotificationElement = {
                  CTR_CD: '002',
                  NOTI_ID: -1,
                  NOTI_TYPE: "success",
                  TITLE: 'Đăng ký tăng ca hộ',
                  CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${getUserData()?.FIRST_NAME}), nhân viên ${getUserData()?.WORK_POSITION_NAME} đã đăng ký tăng ca cho ${params.row.EMPL_NO}_ ${params.row.MIDLAST_NAME} ${params.row.FIRST_NAME} ${overtimeinfo}`,
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
            p.EMPL_NO === params.row.EMPL_NO
              ? { ...p, OVERTIME: null, OVERTIME_INFO: null }
              : p
          );
          ////console.log(newProjects);
          setDiemDanhNhomTable(newProjects);
        };
        if (params.row.OVERTIME === null) {
          return (
            <div className={`onoffdiv ${typeclass}`}>
              <button className='tcbutton' onClick={() => onClick("KTC")}>
                KTC
              </button>
              <button className='tcbutton' onClick={() => onClick("0500-0800")}>
                05-08
              </button>
              <button className='tcbutton' onClick={() => onClick("1700-2000")}>
                17-20
              </button>
              <button className='tcbutton' onClick={() => onClick("1700-1800")}>
                17-18
              </button>
              <button className='tcbutton' onClick={() => onClick("1400-1800")}>
                14-18
              </button>
              <button className='tcbutton' onClick={() => onClick("1600-2000")}>
                16-20
              </button>
            </div>
          );
        }
        return (
          <div className='onoffdiv'>
            <span className={`onoffshowtext A${params.row.OVERTIME}`}>
              {params.row.OVERTIME_INFO}
            </span>
            <button className='resetbutton' onClick={() => onReset()}>
              RESET
            </button>
          </div>
        );
      }, headerClassName: 'super-app-theme--header',
    },
    { field: "MIDLAST_NAME", headerName: "MIDLAST_NAME", width: 130, headerClassName: 'super-app-theme--header' },
    { field: "FIRST_NAME", headerName: "FIRST_NAME", width: 130, headerClassName: 'super-app-theme--header' },
    { field: "PHONE_NUMBER", headerName: "PHONE_NUMBER", width: 130, headerClassName: 'super-app-theme--header' },
    { field: "SEX_NAME", headerName: "SEX_NAME", width: 130, headerClassName: 'super-app-theme--header' },
    { field: "WORK_STATUS_NAME", headerName: "WORK_STATUS_NAME", width: 130, headerClassName: 'super-app-theme--header' },
    { field: "FACTORY_NAME", headerName: "FACTORY_NAME", width: 130, headerClassName: 'super-app-theme--header' },
    { field: "JOB_NAME", headerName: "JOB_NAME", width: 130, headerClassName: 'super-app-theme--header' },
    { field: "WORK_SHIF_NAME", headerName: "WORK_SHIF_NAME", width: 130, headerClassName: 'super-app-theme--header' },
    {
      field: "WORK_POSITION_NAME",
      headerName: "WORK_POSITION_NAME",
      width: 130, headerClassName: 'super-app-theme--header',
    },
    { field: "SUBDEPTNAME", headerName: "SUBDEPTNAME", width: 130, headerClassName: 'super-app-theme--header' },
    { field: "MAINDEPTNAME", headerName: "MAINDEPTNAME", width: 130, headerClassName: 'super-app-theme--header' },
    {
      field: "REQUEST_DATE",
      headerName: "REQUEST_DATE",
      width: 130, headerClassName: 'super-app-theme--header',
    },
    {
      field: "APPLY_DATE",
      headerName: "APPLY_DATE",
      width: 130, headerClassName: 'super-app-theme--header',
    },
    { field: "APPROVAL_STATUS", headerName: "APPROVAL_STATUS", width: 130, headerClassName: 'super-app-theme--header' },
    { field: "OFF_ID", headerName: "OFF_ID", width: 130, headerClassName: 'super-app-theme--header' },
    { field: "CA_NGHI", headerName: "CA_NGHI", width: 130, headerClassName: 'super-app-theme--header' },
    { field: "ON_OFF", headerName: "ON_OFF", width: 130, headerClassName: 'super-app-theme--header' },
    { field: "OVERTIME_INFO", headerName: "OVERTIME_INFO", width: 130, headerClassName: 'super-app-theme--header' },
    { field: "OVERTIME", headerName: "OVERTIME", width: 130, headerClassName: 'super-app-theme--header' },
    { field: "REASON_NAME", headerName: "REASON_NAME", width: 130, headerClassName: 'super-app-theme--header' },
    { field: "REMARK", headerName: "REMARK", width: 130, headerClassName: 'super-app-theme--header' },
  ];
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <button
          className='saveexcelbutton'
          onClick={() => {
            SaveExcel(diemdanhnhomtable, "DiemDanhNhom");
          }}
        >
          Save Excel
        </button>
        <GridToolbarQuickFilter />
      </GridToolbarContainer>
    );
  }
  const onselectionteamhandle = (teamnamelist: number) => {
    setWORK_SHIFT_CODE(teamnamelist);
    generalQuery("diemdanhnhom", { team_name_list: teamnamelist })
      .then((response) => {
        ////console.log(response.data.data);
        setDiemDanhNhomTable(response.data.data);
        setisLoading(false);
        Swal.fire(
          "Thông báo",
          "Đã load " + response.data.data.length + " dòng",
          "success"
        );
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  useEffect(() => {
    //console.log('vao day');
    generalQuery("diemdanhnhom", { team_name_list: WORK_SHIFT_CODE })
      .then((response) => {
        ////console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loaded_data = response.data.data.map((e: any, index: number) => {
            return (
              {
                ...e,
                REQUEST_DATE: e.REQUEST_DATE !== null ? moment.utc(e.REQUEST_DATE).format('YYYY-MM-DD') : '',
                APPLY_DATE: e.APPLY_DATE !== null ? moment.utc(e.APPLY_DATE).format('YYYY-MM-DD') : '',
                id: index
              }
            )
          })
          setDiemDanhNhomTable(loaded_data);
          Swal.fire(
            "Thông báo",
            "Đã load " + response.data.data.length + " dòng",
            "success"
          );
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        //console.log(error);
      });
  }, []);
  return (
    (<div className='diemdanhnhom'>
      <div className='filterform'>
        <label>
          {getlang("calamviec", glbLang!)}:
          <select
            name='calamviec'
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
      <div className='maindept_table'>
        <DataGrid
          sx={{
            fontSize: "0.7rem", '& .super-app-theme--header': {
              backgroundColor: 'rgba(211, 23, 180, 0.775)',
              fontSize: '0.8rem',
              color: 'white'
            },
          }}
          columnHeaderHeight={20}
          slots={{
            toolbar: CustomToolbar,
          }}
          loading={isLoading}
          rowHeight={70}
          rows={diemdanhnhomtable}
          columns={columns_diemdanhnhom}
          pageSizeOptions={[5, 10, 50, 100, 500]}
          editMode='row'
          getRowHeight={() => "auto"}
        />
      </div>
    </div>)
  );
};
export default DiemDanhNhom;

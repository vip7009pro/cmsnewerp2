import { useCallback, useEffect, useMemo, useState } from "react";
import { generalQuery, getSocket, getUserData } from "../../../api/Api";
import "./DieuChuyenTeam.scss";
import Swal from "sweetalert2";
import { f_insert_Notification_Data } from "../../../api/GlobalFunction";
import {
  DiemDanhNhomData,
  WorkPositionTableData,
} from "../interfaces/nhansuInterface";
import { getlang } from "../../../components/String/String";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { NotificationElement } from "../../../components/NotificationPanel/Notification";
import AGTable from "../../../components/DataTable/AGTable";
import moment from "moment";
const DieuChuyenTeamCMS = ({option1, option2}: {option1: string, option2: string}) => {
  const glbLang: string | undefined = useSelector(
    (state: RootState) => state.totalSlice.lang
  );
  const [WORK_SHIFT_CODE, setWORK_SHIFT_CODE] = useState(5);
  const [diemdanhnhomtable, setDiemDanhNhomTable] = useState<
    Array<DiemDanhNhomData>
  >([]);
  const [workpositionload, setWorkPositionLoad] = useState<
    Array<WorkPositionTableData>
  >([]);
  const setTeam = useCallback(async (EMPL_NO: string, value: number) => {
    generalQuery("setteamnhom", {
      teamvalue: value,
      EMPL_NO: EMPL_NO,
    }).then((response) => {
      if (response.data.tk_status === "OK") {
        const newProjects = diemdanhnhomtable.map((p) =>
          p.EMPL_NO === EMPL_NO
            ? {
                ...p,
                WORK_SHIF_NAME:
                  value === 0
                    ? "Hành Chính"
                    : value === 1
                    ? "TEAM 1"
                    : "TEAM 2",
              }
            : p
        );
        setDiemDanhNhomTable(newProjects);
      } else {
        Swal.fire("Có lỗi", "Nội dung: " + response.data.message, "error");
      }
    });
  }, [diemdanhnhomtable]);
  const setCa = useCallback(async (params: any, value: number) => {
    generalQuery("setca", {
      EMPL_NO: params.data?.EMPL_NO,
      CALV: value,
    })
      .then(async (response) => {
        //console.log(response.data);
        if (response.data.tk_status === "OK") {
          const newProjects = diemdanhnhomtable.map((p) =>
            p.EMPL_NO === params.data?.EMPL_NO
              ? {
                  ...p,
                  CALV: value,
                }
              : p
          );
          let newNotification: NotificationElement = {
            CTR_CD: "002",
            NOTI_ID: -1,
            NOTI_TYPE: "success",
            TITLE: "Thay đổi ca làm việc",
            CONTENT: `${getUserData()?.EMPL_NO} (${
              getUserData()?.MIDLAST_NAME
            } ${getUserData()?.FIRST_NAME}), nhân viên ${
              getUserData()?.WORK_POSITION_NAME
            } đã thay ca làm việc cho ${params.data?.EMPL_NO}_ ${
              params.data?.MIDLAST_NAME
            } ${params.data?.FIRST_NAME} thành ${
              value === 2 ? "Ca đêm" : value === 1 ? "Ca ngày" : "Ca HC"
            } `,
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
          Swal.fire("Có lỗi", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        //console.log(error);
      });
  }, [diemdanhnhomtable]);
  const resetCa = useCallback(async (params: any) => {
    const newProjects = diemdanhnhomtable.map((p) =>
      p.EMPL_NO === params.data?.EMPL_NO ? { ...p, CALV: null } : p
    );
    ////console.log(newProjects);
    setDiemDanhNhomTable(newProjects);
  }, [diemdanhnhomtable]);
  const setFactory = useCallback(async (EMPL_NO: string, value: number) => {
    generalQuery("setnhamay", {
      EMPL_NO: EMPL_NO,
      FACTORY: value,
    })
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status === "OK") {
          const newProjects = diemdanhnhomtable.map((p) =>
            p.EMPL_NO === EMPL_NO
              ? {
                  ...p,
                  FACTORY_NAME: value === 1 ? "Nhà máy 1" : "Nhà máy 2",
                }
              : p
          );
          setDiemDanhNhomTable(newProjects);
        } else {
          Swal.fire("Có lỗi", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        //console.log(error);
      });
  }, [diemdanhnhomtable]);
  const setViTri = useCallback(async (EMPL_NO: string, WORK_POSITION_CODE: number) => {
    Swal.fire({
      title: "Chắc chắn muốn chuyển vị trí ?",
      text: "Sẽ bắt đầu chuyển vị trí",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn chuyển!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành chuyển vị trí", "Đang chuyển vị trí", "success");
        generalQuery("setEMPL_WORK_POSITION", {
          WORK_POSITION_CODE: WORK_POSITION_CODE,
          EMPL_NO: EMPL_NO,
        })
          .then((response) => {
            //console.log(response.data.data);
            if (response.data.tk_status === "OK") {
              const newProjects = diemdanhnhomtable.map((p) =>
                p.EMPL_NO === EMPL_NO
                  ? {
                      ...p,
                      WORK_POSITION_CODE: WORK_POSITION_CODE,
                      WORK_POSITION_NAME:
                        workpositionload.find(
                          (w) => w.WORK_POSITION_CODE === WORK_POSITION_CODE
                        )?.WORK_POSITION_NAME ?? "",
                    }
                  : p
              );
              setDiemDanhNhomTable(newProjects);
            } else {
              Swal.fire(
                "Thông báo",
                "Nội dung: " + response.data.message,
                "error"
              );
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
      }
    });
  }, [diemdanhnhomtable]);
  const columns_diemdanhnhom = useMemo(() => [
    {
      field: "id",
      headerName: "ID",
      width: 30,
      headerClass: "super-app-theme--header",
    },
    {
      field: "FULL_NAME",
      headerName: "FULL_NAME",
      width: 130,
      headerClass: "super-app-theme--header",
    },
    {
      field: "WORK_SHIF_NAME",
      headerName: "WORK_SHIF_NAME",
      width: 130,
      headerClass: "super-app-theme--header",
    },
    {
      field: "SET_TEAM",
      headerName: "SET_TEAM",
      width: 120,
      headerClass: "super-app-theme--header",
      cellRenderer: (params: any) => {
        if (params.data?.WORK_SHIF_NAME === "Hành Chính") {
          return (
            <div className="onoffdiv">
              <button
                className="team1bt"
                onClick={() => setTeam(params.data?.EMPL_NO, 1)}
              >
                TEAM1
              </button>
              <button
                className="team2bt"
                onClick={() => setTeam(params.data?.EMPL_NO, 2)}
              >
                TEAM2
              </button>
            </div>
          );
        } else if (params.data?.WORK_SHIF_NAME === "TEAM 1") {
          return (
            <div className="onoffdiv">
              <button
                className="hcbt"
                onClick={() => setTeam(params.data?.EMPL_NO, 0)}
              >
                HanhChinh
              </button>
              <button
                className="team2bt"
                onClick={() => setTeam(params.data?.EMPL_NO, 2)}
              >
                TEAM2
              </button>
            </div>
          );
        } else {
          return (
            <div className="onoffdiv">
              <button
                className="team1bt"
                onClick={() => setTeam(params.data?.EMPL_NO, 1)}
              >
                TEAM1
              </button>
              <button
                className="hcbt"
                onClick={() => setTeam(params.data?.EMPL_NO, 0)}
              >
                HanhChinh
              </button>
            </div>
          );
        }
      },
    },
    {
      field: "SETCA",
      headerName: "SET CA",
      minWidth: 150,
      cellRenderer: (params: any) => {
        if (params.data?.CALV === null) {
          return (
            <div className={`calvdiv`}>
              <button className="tcbutton" onClick={() => setCa(params, 0)}>
                Ca HC
              </button>
              <button className="tcbutton" onClick={() => setCa(params, 1)}>
                Ca ngày
              </button>
              <button className="tcbutton" onClick={() => setCa(params, 2)}>
                Ca đêm
              </button>
            </div>
          );
        }
        return (
          <div className="onoffdiv">
            <span className={`onoffshowtext A${params.data?.CALV}`}>
              {params.data?.CALV === 0
                ? "Ca HC"
                : params.data?.CALV === 1
                ? "Ca ngày"
                : params.data?.CALV === 2
                ? "Ca đêm"
                : "Chưa có ca"}
            </span>
            <button className="resetbutton" onClick={() => resetCa(params)}>
              RESET
            </button>
          </div>
        );
      },
      headerClass: "super-app-theme--header",
    },
    {
      field: "FACTORY_NAME",
      headerName: "FACTORY_NAME",
      width: 80,
      headerClass: "super-app-theme--header",
    },
    {
      field: "SET_NM",
      headerName: "SET_NM",
      width: 100,
      headerClass: "super-app-theme--header",
      cellRenderer: (params: any) => {
        if (params.data?.FACTORY_NAME === "Nhà máy 1") {
          return (
            <div className="onoffdiv">
              <button
                className="team2bt"
                onClick={() => setFactory(params.data?.EMPL_NO, 2)}
              >
                SET NM2
              </button>
            </div>
          );
        } else if (params.data?.FACTORY_NAME === "Nhà máy 2") {
          return (
            <div className="onoffdiv">
              <button
                className="hcbt"
                onClick={() => setFactory(params.data?.EMPL_NO, 1)}
              >
                SET NM1
              </button>
            </div>
          );
        } else {
          return (
            <div className="onoffdiv">
              <button
                className="team1bt"
                onClick={() => setFactory(params.data?.EMPL_NO, 1)}
              >
                SET NM1
              </button>
              <button
                className="hcbt"
                onClick={() => setFactory(params.data?.EMPL_NO, 2)}
              >
                SET NM2
              </button>
            </div>
          );
        }
      },
    },
    {
      field: "WORK_POSITION_NAME",
      headerName: "VI_TRI",
      width: 60,
      headerClass: "super-app-theme--header",
    },
    {
      field: "SETVITRI",
      headerName: "SET_VI_TRI",
      width: 120,
      headerClass: "super-app-theme--header",
      cellRenderer: (params: any) => {
        const onClick = (work_position_code: number) => {
          //Swal.fire("Thông báo", "Gia tri = " + params.data?.EMPL_NO, "success");
          Swal.fire({
            title: "Chắc chắn muốn chuyển team ?",
            text: "Sẽ bắt đầu chuyển team",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Vẫn chuyển!",
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire("Tiến hành chuyển team", "Đang chuyển team", "success");
              generalQuery("setEMPL_WORK_POSITION", {
                WORK_POSITION_CODE: work_position_code,
                EMPL_NO: params.data?.EMPL_NO,
              })
                .then((response) => {
                  //console.log(response.data.data);
                  if (response.data.tk_status === "OK") {
                    generalQuery(option1, {
                      team_name_list: WORK_SHIFT_CODE,
                    })
                      .then((response) => {
                        //console.log(response.data.data);
                        if (response.data.tk_status !== "NG") {
                          setDiemDanhNhomTable(response.data.data);
                          
                          //Swal.fire("Thông báo", "Đã load " + response.data.data.length + " dòng", "success");
                        } else {
                          Swal.fire(
                            "Thông báo",
                            "Nội dung: " + response.data.message,
                            "error"
                          );
                        }
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  } else {
                    Swal.fire(
                      "Có lỗi",
                      "Nội dung: " + response.data.message,
                      "error"
                    );
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          });
        };
        return (
          <div className="onoffdiv">
            <label>
              <select
                name="vitrilamviec"
                value={params.data?.WORK_POSITION_CODE}
                onChange={(e) => {
                  setViTri(params.data?.EMPL_NO, Number(e.target.value));
                }}
              >
                {workpositionload.map((element, index) => (
                  <option key={index} value={element.WORK_POSITION_CODE}>
                    {element.WORK_POSITION_NAME}
                  </option>
                ))}
              </select>
            </label>
          </div>
        );
      },
    },
    {
      field: "EMPL_NO",
      headerName: "EMPL_NO",
      width: 80,
      headerClass: "super-app-theme--header",
    },
    {
      field: "CMS_ID",
      headerName: "NS_ID",
      width: 80,
      headerClass: "super-app-theme--header",
    },
    {
      field: "MIDLAST_NAME",
      headerName: "MIDLAST_NAME",
      width: 80,
      headerClass: "super-app-theme--header",
    },
    {
      field: "FIRST_NAME",
      headerName: "FIRST_NAME",
      width: 80,
      headerClass: "super-app-theme--header",
    },
    {
      field: "SUBDEPTNAME",
      headerName: "SUBDEPTNAME",
      width: 80,
      headerClass: "super-app-theme--header",
    },
    {
      field: "MAINDEPTNAME",
      headerName: "MAINDEPTNAME",
      width: 80,
      headerClass: "super-app-theme--header",
    },
    {
      field: "PHONE_NUMBER",
      headerName: "PHONE_NUMBER",
      width: 80,
      headerClass: "super-app-theme--header",
    },
    {
      field: "SEX_NAME",
      headerName: "SEX_NAME",
      width: 80,
      headerClass: "super-app-theme--header",
    },
    {
      field: "WORK_STATUS_NAME",
      headerName: "WORK_STATUS_NAME",
      width: 120,
      headerClass: "super-app-theme--header",
    },
    {
      field: "JOB_NAME",
      headerName: "JOB_NAME",
      width: 80,
      headerClass: "super-app-theme--header",
    },
  ], [diemdanhnhomtable]);
  const loadDiemDanhNhomTable = useCallback(async (teamnamelist: number) => {
    generalQuery(option1, { team_name_list: teamnamelist })
      .then((response) => {
        //console.log(response.data.data);
        let loaded_data = response.data.data.map((e: any, index: number) => {
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
        });
        setDiemDanhNhomTable(loaded_data);
        
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const loadWorkPositionTable = useCallback(() => {
    generalQuery(option2, {})
      .then((response) => {
        //console.log(response.data.data);
        let loaded_data = response.data.data.map((e: any, index: number) => {
          return {
            ...e,
            id: index + 1,
          };
        });
        setWorkPositionLoad(loaded_data);
        
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const diemdanhnhomAGTable = useMemo(() => {
    return (
      <AGTable
        rowHeight={30}
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
  }, [diemdanhnhomtable,columns_diemdanhnhom]);
  useEffect(() => {   
    loadWorkPositionTable();
    loadDiemDanhNhomTable(5);
  }, []);
  return (
    <div className="dieuchuyenteam">
      <div className="filterform">
        <label>
          {getlang("calamviec", glbLang!)}:
          <select
            name="calamviec"
            value={WORK_SHIFT_CODE}
            onChange={(e) => {
              setWORK_SHIFT_CODE(Number(e.target.value));
              loadDiemDanhNhomTable(Number(e.target.value));
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
export default DieuChuyenTeamCMS;

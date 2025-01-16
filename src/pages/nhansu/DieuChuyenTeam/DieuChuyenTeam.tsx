import {
  DataGrid,
  GridRowSelectionModel,
  GridToolbar,
  GridToolbarContainer,
  GridToolbarExport,
  GridCsvExportOptions,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridRowsProp,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { generalQuery, getSocket, getUserData } from "../../../api/Api";
import "./DieuChuyenTeam.scss";
import Swal from "sweetalert2";
import LinearProgress from "@mui/material/LinearProgress";
import { f_insert_Notification_Data, SaveExcel } from "../../../api/GlobalFunction";
import {
  DiemDanhNhomData,
  WorkPositionTableData,
} from "../../../api/GlobalInterface";
import { getlang } from "../../../components/String/String";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { NotificationElement } from "../../../components/NotificationPanel/Notification";

const DieuChuyenTeam = () => {
  const glbLang: string | undefined = useSelector(
    (state: RootState) => state.totalSlice.lang,
  );
  const [isLoading, setisLoading] = useState(false);
  const [WORK_SHIFT_CODE, setWORK_SHIFT_CODE] = useState(5);
  const [diemdanhnhomtable, setDiemDanhNhomTable] = useState<
    Array<DiemDanhNhomData>
  >([]);
  const [workpositionload, setWorkPositionLoad] = useState<
    Array<WorkPositionTableData>
  >([]);
  const columns_diemdanhnhom = [
    {
      field: "id",
      headerName: "ID",
      width: 100,headerClassName: 'super-app-theme--header',     
    },
    { field: "WORK_SHIF_NAME", headerName: "WORK_SHIF_NAME", width: 130,headerClassName: 'super-app-theme--header' },
    {
      field: "SET_TEAM",
      headerName: "SET_TEAM",
      width: 200,headerClassName: 'super-app-theme--header',
      renderCell: (params: any) => {
        const onClick = (teamvalue_info: number) => {
          //Swal.fire("Thông báo", "Gia tri = " + params.row.EMPL_NO, "success");
          generalQuery("setteamnhom", {
            teamvalue: teamvalue_info,
            EMPL_NO: params.row.EMPL_NO,
          })
            .then((response) => {
              console.log(response.data.tk_status);
              if (response.data.tk_status === "OK") {
                const newProjects = diemdanhnhomtable.map((p) =>
                  p.EMPL_NO === params.row.EMPL_NO
                    ? {
                      ...p,
                      WORK_SHIF_NAME:
                        teamvalue_info === 0
                          ? "Hành Chính"
                          : teamvalue_info === 1
                            ? "TEAM 1"
                            : "TEAM 2",
                    }
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
              console.log(error);
            });
        };

        if (params.row.WORK_SHIF_NAME === "Hành Chính") {
          return (
            <div className='onoffdiv'>
              <button className='team1bt' onClick={() => onClick(1)}>
                TEAM1
              </button>
              <button className='team2bt' onClick={() => onClick(2)}>
                TEAM2
              </button>
            </div>
          );
        } else if (params.row.WORK_SHIF_NAME === "TEAM 1") {
          return (
            <div className='onoffdiv'>
              <button className='hcbt' onClick={() => onClick(0)}>
                HanhChinh
              </button>
              <button className='team2bt' onClick={() => onClick(2)}>
                TEAM2
              </button>
            </div>
          );
        } else {
          return (
            <div className='onoffdiv'>
              <button className='team1bt' onClick={() => onClick(1)}>
                TEAM1
              </button>
              <button className='hcbt' onClick={() => onClick(0)}>
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
              minWidth: 200,
              flex: 1,
              renderCell: (params: any) => {               
                const onClick = (calv: string) => {
                  //Swal.fire("Thông báo", "Gia tri = " + params.row.EMPL_NO, "success");
                  generalQuery("setca", {                    
                    EMPL_NO: params.row.EMPL_NO,
                    CALV: calv,
                  })
                    .then(async (response) => {
                      //console.log(response.data);
                      if (response.data.tk_status === "OK") {
                        const newProjects = diemdanhnhomtable.map((p) =>
                          p.EMPL_NO === params.row.EMPL_NO
                            ? {
                                ...p,
                                CALV: calv,                                
                              }
                            : p
                        );
                        let newNotification: NotificationElement = {
                          CTR_CD: '002',
                          NOTI_ID: -1,
                          NOTI_TYPE: "success",
                          TITLE: 'Thay đổi ca làm việc',
                          CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${getUserData()?.FIRST_NAME}), nhân viên ${getUserData()?.WORK_POSITION_NAME} đã thay ca làm việc cho ${params.row.EMPL_NO}_ ${params.row.MIDLAST_NAME} ${params.row.FIRST_NAME} thành ${calv === "1" ? "Ca ngày" : "Ca đêm"} `,
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
                      ? { ...p, CALV: null }
                      : p
                  );
                  ////console.log(newProjects);
                  setDiemDanhNhomTable(newProjects);
                };
                if (params.row.CALV === null) {
                  return (
                    <div className={`calvdiv`}>
                      <button className='tcbutton' onClick={() => onClick("0")}>
                        Ca HC
                      </button>
                      <button className='tcbutton' onClick={() => onClick("1")}>
                        Ca ngày
                      </button>
                      <button className='tcbutton' onClick={() => onClick("2")}>
                        Ca đêm
                      </button>                  
                    </div>
                  );
                }
                return (
                  <div className='onoffdiv'>
                    <span className={`onoffshowtext A${params.row.CALV}`}>
                      {params.row.CALV === 0 ? "Ca HC" :  params.row.CALV === 1 ? "Ca ngày" : params.row.CALV === 2 ? "Ca đêm" :  "Chưa có ca"}
                    </span>
                    <button className='resetbutton' onClick={() => onReset()}>
                      RESET
                    </button>
                  </div>
                );
              },headerClassName: 'super-app-theme--header',
            },
    { field: "FACTORY_NAME", headerName: "FACTORY_NAME", width: 130,headerClassName: 'super-app-theme--header' },
    {
      field: "SET_NM",
      headerName: "SET_NM",
      width: 100,headerClassName: 'super-app-theme--header',
      renderCell: (params: any) => {
        const onClick = (teamvalue_info: number) => {
          //Swal.fire("Thông báo", "Gia tri = " + params.row.EMPL_NO, "success");
          generalQuery("setnhamay", {
            FACTORY: teamvalue_info,
            EMPL_NO: params.row.EMPL_NO,
          })
            .then((response) => {
              //console.log(response.data.data);
              if (response.data.tk_status === "OK") {
                const newProjects = diemdanhnhomtable.map((p) =>
                  p.EMPL_NO === params.row.EMPL_NO
                    ? {
                      ...p,
                      FACTORY_NAME:
                        teamvalue_info === 1 ? "Nhà máy 1" : "Nhà máy 2",
                    }
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
              console.log(error);
            });
        };

        if (params.row.FACTORY_NAME === "Nhà máy 1") {
          return (
            <div className='onoffdiv'>
              <button className='team2bt' onClick={() => onClick(2)}>
                SET NM2
              </button>
            </div>
          );
        } else if (params.row.FACTORY_NAME === "Nhà máy 2") {
          return (
            <div className='onoffdiv'>
              <button className='hcbt' onClick={() => onClick(1)}>
                SET NM1
              </button>
            </div>
          );
        } else {
          return (
            <div className='onoffdiv'>
              <button className='team1bt' onClick={() => onClick(1)}>
                SET NM1
              </button>
              <button className='hcbt' onClick={() => onClick(2)}>
                SET NM2
              </button>
            </div>
          );
        }
      },
    },
    {
      field: "WORK_POSITION_NAME",
      headerName: "WORK_POSITION_NAME",
      width: 130,headerClassName: 'super-app-theme--header',
    },
    {
      field: "SETVITRI",
      headerName: "SET_VI_TRI",
      width: 120,headerClassName: 'super-app-theme--header',
      renderCell: (params: any) => {
        const onClick = (work_position_code: number) => {
          //Swal.fire("Thông báo", "Gia tri = " + params.row.EMPL_NO, "success");
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
                EMPL_NO: params.row.EMPL_NO,
              })
                .then((response) => {
                  //console.log(response.data.data);
                  if (response.data.tk_status === "OK") {
                    generalQuery("diemdanhnhom", {
                      team_name_list: WORK_SHIFT_CODE,
                    })
                      .then((response) => {
                        //console.log(response.data.data);
                        if (response.data.tk_status !== "NG") {
                          setDiemDanhNhomTable(response.data.data);
                          setisLoading(false);
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
          <div className='onoffdiv'>
            <label>
              <select
                name='vitrilamviec'
                value={params.row.WORK_POSITION_CODE}
                onChange={(e) => {
                  onClick(Number(e.target.value));
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
    { field: "EMPL_NO", headerName: "EMPL_NO", width: 170,headerClassName: 'super-app-theme--header' },
    { field: "CMS_ID", headerName: "NS_ID", width: 100,headerClassName: 'super-app-theme--header' },
    { field: "MIDLAST_NAME", headerName: "MIDLAST_NAME", width: 130,headerClassName: 'super-app-theme--header' },
    { field: "FIRST_NAME", headerName: "FIRST_NAME", width: 130,headerClassName: 'super-app-theme--header' },
    { field: "SUBDEPTNAME", headerName: "SUBDEPTNAME", width: 130,headerClassName: 'super-app-theme--header' },
    { field: "MAINDEPTNAME", headerName: "MAINDEPTNAME", width: 130,headerClassName: 'super-app-theme--header' },
    { field: "PHONE_NUMBER", headerName: "PHONE_NUMBER", width: 130,headerClassName: 'super-app-theme--header' },
    { field: "SEX_NAME", headerName: "SEX_NAME", width: 130,headerClassName: 'super-app-theme--header' },
    { field: "WORK_STATUS_NAME", headerName: "WORK_STATUS_NAME", width: 130,headerClassName: 'super-app-theme--header' },
    { field: "JOB_NAME", headerName: "JOB_NAME", width: 130,headerClassName: 'super-app-theme--header' },
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
            SaveExcel(diemdanhnhomtable, "DieuChuyenTeam");
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
        //console.log(response.data.data);
        setDiemDanhNhomTable(response.data.data);
        setisLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    setisLoading(true);
    generalQuery("workpositionlist_BP", {})
      .then((response) => {
        //console.log(response.data.data);
        let loaded_data =  response.data.data.map((e: any, index: number)=> {
          return (
            {
              ...e,
              id: e.EMPL_NO
            }
          )
        })
        setWorkPositionLoad(loaded_data);
        setisLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });

    generalQuery("diemdanhnhom", { team_name_list: WORK_SHIFT_CODE })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          setDiemDanhNhomTable(response.data.data);
          setisLoading(false);
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
        console.log(error);
      });
  }, []);

  return (
    (<div className='dieuchuyenteam'>
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
              fontSize:'0.8rem',
              color:'white'
            },
          }}
          columnHeaderHeight={20}
          slots={{
            toolbar: CustomToolbar,
            
          }}
          loading={isLoading}
          rowHeight={35}
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

export default DieuChuyenTeam;

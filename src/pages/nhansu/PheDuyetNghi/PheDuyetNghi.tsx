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
import { generalQuery } from "../../../api/Api";
import "./PheDuyetNghi.scss";
import Swal from "sweetalert2";
import LinearProgress from "@mui/material/LinearProgress";
import { SaveExcel } from "../../../api/GlobalFunction";
import { PheDuyetNghiData } from "../../../api/GlobalInterface";
import moment from "moment";

const PheDuyetNghi = () => {
  const [isLoading, setisLoading] = useState(false);
  const [diemdanhnhomtable, setDiemDanhNhomTable] = useState<
    Array<PheDuyetNghiData>
  >([]);

  const columns_diemdanhnhom = [
    {
      field: "id",
      headerName: "ID",
      width: 100,headerClassName: 'super-app-theme--header',     
    },
    {
      field: "PHE_DUYET",
      headerName: "PHE_DUYET",
      width: 200,headerClassName: 'super-app-theme--header',
      renderCell: (params: any) => {
        const onClick = (pheduyet_value: number) => {
          if (pheduyet_value === 3) {
            Swal.fire({
              title: "Chắc chắn muốn xóa đăng ký nghỉ đã chọn ?",
              text: "Sẽ xóa đăng ký nghỉ",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Vẫn Xóa!",
            }).then((result) => {
              if (result.isConfirmed) {
                Swal.fire("Tiến hành Xóa", "Đang Xóa Đăng ký nghỉ", "success");
                generalQuery("setpheduyetnhom", {
                  off_id: params.row.OFF_ID,
                  pheduyetvalue: pheduyet_value,
                })
                  .then((response) => {
                    console.log(response.data.tk_status);
                    if (response.data.tk_status === "OK") {
                      const newProjects = diemdanhnhomtable.map((p) =>
                        p.OFF_ID === params.row.OFF_ID
                          ? {
                              ...p,
                              APPROVAL_STATUS: pheduyet_value,
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
              }
            });
          } else if (pheduyet_value === 0) {
            generalQuery("setpheduyetnhom", {
              off_id: params.row.OFF_ID,
              pheduyetvalue: pheduyet_value,
            })
              .then((response) => {
                console.log(response.data.tk_status);
                if (response.data.tk_status === "OK") {
                  const newProjects = diemdanhnhomtable.map((p) =>
                    p.OFF_ID === params.row.OFF_ID
                      ? {
                          ...p,
                          APPROVAL_STATUS: pheduyet_value,
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
          } else {
            if (
              (params.row.ON_OFF === 0 ||
                params.row.ON_OFF === null ||
                params.row.REASON_NAME === "Nửa phép") &&
              pheduyet_value === 1
            ) {
              generalQuery("setpheduyetnhom", {
                off_id: params.row.OFF_ID,
                pheduyetvalue: pheduyet_value,
              })
                .then((response) => {
                  console.log(response.data.tk_status);
                  if (response.data.tk_status === "OK") {
                    const newProjects = diemdanhnhomtable.map((p) =>
                      p.OFF_ID === params.row.OFF_ID
                        ? {
                            ...p,
                            APPROVAL_STATUS: pheduyet_value,
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
            } else {
              Swal.fire(
                "Thông báo",
                "Đã điểm danh đi làm, không phê duyệt nghỉ được"
              );
            }
          }
        };

        const onReset = () => {
          const newProjects = diemdanhnhomtable.map((p) =>
            p.OFF_ID === params.row.OFF_ID
              ? {
                  ...p,
                  APPROVAL_STATUS: 2,
                }
              : p
          );
          setDiemDanhNhomTable(newProjects);
        };

        if (params.row.APPROVAL_STATUS === 0) {
          return (
            <div className='onoffdiv'>
              <span style={{ fontWeight: "bold", color: "red" }}>Từ chối</span>
              <button className='resetbutton' onClick={() => onReset()}>
                RESET
              </button>
              <button className='deletebutton' onClick={() => onClick(3)}>
                XÓA
              </button>
            </div>
          );
        } else if (params.row.APPROVAL_STATUS === 1) {
          return (
            <div className='onoffdiv'>
              <span style={{ fontWeight: "bold", color: "green" }}>
                Phê Duyệt
              </span>
              <button className='resetbutton' onClick={() => onReset()}>
                RESET
              </button>
              <button className='deletebutton' onClick={() => onClick(3)}>
                XÓA
              </button>
            </div>
          );
        } else if (params.row.APPROVAL_STATUS === 3) {
          return (
            <div className='onoffdiv'>
              <span style={{ fontWeight: "bold", color: "red" }}>Đã xóa</span>
            </div>
          );
        } else {
          return (
            <div className='onoffdiv'>
              <button className='onbutton' onClick={() => onClick(1)}>
                Duyệt
              </button>
              <button className='offbutton' onClick={() => onClick(0)}>
                Từ chối
              </button>
            </div>
          );
        }
      },
    },
    { field: "EMPL_NO", headerName: "EMPL_NO", width: 120,headerClassName: 'super-app-theme--header' },
    { field: "CMS_ID", headerName: "NS_ID", width: 120,headerClassName: 'super-app-theme--header' },
    { field: "MIDLAST_NAME", headerName: "MIDLAST_NAME", width: 170,headerClassName: 'super-app-theme--header' },
    { field: "FIRST_NAME", headerName: "FIRST_NAME", width: 100,headerClassName: 'super-app-theme--header' },
    {
      field: "REQUEST_DATE",
      headerName: "REQUEST_DATE",
      width: 110,headerClassName: 'super-app-theme--header',     
    },
    {
      field: "APPLY_DATE",
      headerName: "APPLY_DATE",
      width: 100,headerClassName: 'super-app-theme--header',     
    },
    { field: "REASON_NAME", headerName: "REASON_NAME", width: 120,headerClassName: 'super-app-theme--header' },
    { field: "CA_NGHI", headerName: "CA_NGHI", width: 80,headerClassName: 'super-app-theme--header' },
    { field: "REMARK", headerName: "REMARK", width: 170,headerClassName: 'super-app-theme--header' },
    { field: "ON_OFF", headerName: "ON_OFF", width: 120,headerClassName: 'super-app-theme--header' },
    {
      field: "DOB",
      headerName: "DOB",
      width: 170,headerClassName: 'super-app-theme--header',
    },
    { field: "POSITION_NAME", headerName: "POSITION_NAME", width: 170,headerClassName: 'super-app-theme--header' },
    { field: "FACTORY_NAME", headerName: "FACTORY_NAME", width: 170,headerClassName: 'super-app-theme--header' },
    { field: "WORK_SHIF_NAME", headerName: "WORK_SHIF_NAME", width: 170,headerClassName: 'super-app-theme--header' },
    { field: "JOB_NAME", headerName: "JOB_NAME", width: 170,headerClassName: 'super-app-theme--header' },
    { field: "MAINDEPTNAME", headerName: "MAINDEPT_NAME", width: 170,headerClassName: 'super-app-theme--header' },
    { field: "SUBDEPTNAME", headerName: "SUBDEPT_NAME", width: 170,headerClassName: 'super-app-theme--header' },
    {
      field: "WORK_POSITION_NAME",
      headerName: "WORK_POSITION_NAME",
      width: 170,headerClassName: 'super-app-theme--header',
    },
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
            SaveExcel(diemdanhnhomtable, "PheDuyetNghi");
          }}
        >
          Save Excel
        </button>
        <GridToolbarQuickFilter />
      </GridToolbarContainer>
    );
  }

  useEffect(() => {
    setisLoading(true);
    generalQuery("pheduyetnhom", {})
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loaded_data =  response.data.data.map((e: any, index: number)=> {
            return (
              {
                ...e,
                REQUEST_DATE: e.REQUEST_DATE !== null? moment.utc(e.REQUEST_DATE).format('YYYY-MM-DD'):'',
                APPLY_DATE: e.APPLY_DATE !== null? moment.utc(e.APPLY_DATE).format('YYYY-MM-DD'):'',
                DOB: e.DOB !== null? moment.utc(e.DOB).format('YYYY-MM-DD'):'',
                id: e.OFF_ID
              }
            )
          })
          setDiemDanhNhomTable(loaded_data);
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
        setisLoading(false);
      });
  }, []);

  return (
    (<div className='pheduyetnghi'>
      <div className='maindept_table'>
        <DataGrid
          sx={{
            fontSize: "0.7rem", '& .super-app-theme--header': {
              backgroundColor: 'rgba(158, 79, 4, 0.775)',
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
          pageSizeOptions={[5, 10, 50, 100, 500, 1000, 2000]}
          editMode='row'
          getRowHeight={() => "auto"}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </div>
    </div>)
  );
};

export default PheDuyetNghi;

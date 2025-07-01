import { useCallback, useEffect, useMemo, useState } from "react";
import { generalQuery, getUserData } from "../../../api/Api";
import "./PheDuyetNghi.scss";
import Swal from "sweetalert2";
import { checkBP } from "../../../api/GlobalFunction";
import { PheDuyetNghiData } from "../../../api/GlobalInterface";
import moment from "moment";
import AGTable from "../../../components/DataTable/AGTable";
const PheDuyetNghiCMS = ({ option }: { option: string }) => {
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-01"));
  const [todate, setToDate] = useState(
    moment()
      .endOf("month")
      .add(1, "months")
      .subtract(0, "days")
      .format("YYYY-MM-DD")
  );
  const [onlyPending, setOnlyPending] = useState(true);
  const [diemdanhnhomtable, setDiemDanhNhomTable] = useState<
    PheDuyetNghiData[]
  >([]);
  const columns_diemdanhnhom = useMemo(
    () => [
      {
        field: "id",
        headerName: "ID",
        width: 30,
      },
      {
        field: "PHE_DUYET",
        headerName: "PHE_DUYET",
        width: 150,
        cellRenderer: (params: any) => {
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
                  Swal.fire(
                    "Tiến hành Xóa",
                    "Đang Xóa Đăng ký nghỉ",
                    "success"
                  );
                  generalQuery("setpheduyetnhom", {
                    off_id: params.data.OFF_ID,
                    pheduyetvalue: pheduyet_value,
                  })
                    .then((response) => {
                      console.log(response.data.tk_status);
                      if (response.data.tk_status === "OK") {
                        const newProjects = diemdanhnhomtable.map((p) =>
                          p.OFF_ID === params.data.OFF_ID
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
                off_id: params.data.OFF_ID,
                pheduyetvalue: pheduyet_value,
              })
                .then((response) => {
                  console.log(response.data.tk_status);
                  if (response.data.tk_status === "OK") {
                    const newProjects = diemdanhnhomtable.map((p) =>
                      p.OFF_ID === params.data.OFF_ID
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
                (params.data.ON_OFF === 0 ||
                  params.data.ON_OFF === null ||
                  params.data.REASON_NAME === "Nửa phép") &&
                pheduyet_value === 1
              ) {
                generalQuery("setpheduyetnhom", {
                  off_id: params.data.OFF_ID,
                  pheduyetvalue: pheduyet_value,
                })
                  .then((response) => {
                    console.log(response.data.tk_status);
                    if (response.data.tk_status === "OK") {
                      const newProjects = diemdanhnhomtable.map((p) =>
                        p.OFF_ID === params.data.OFF_ID
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
              p.OFF_ID === params.data.OFF_ID
                ? {
                    ...p,
                    APPROVAL_STATUS: 2,
                  }
                : p
            );
            setDiemDanhNhomTable(newProjects);
          };
          if (params.data.APPROVAL_STATUS === 0) {
            return (
              <div className="onoffdiv">
                <span style={{ fontWeight: "bold", color: "red" }}>
                  Từ chối
                </span>
                <button
                  className="resetbutton"
                  onClick={() => {
                    checkBP(getUserData(), ["ALL"], ["ALL"], ["ALL"], () => {
                      onReset();
                    });
                  }}
                >
                  RESET
                </button>
                <button
                  className="deletebutton"
                  onClick={() => {
                    checkBP(getUserData(), ["ALL"], ["ALL"], ["ALL"], () => {
                      onClick(3);
                    });
                  }}
                >
                  XÓA
                </button>
              </div>
            );
          } else if (params.data.APPROVAL_STATUS === 1) {
            return (
              <div className="onoffdiv">
                <span style={{ fontWeight: "bold", color: "green" }}>
                  Phê Duyệt
                </span>
                <button
                  className="resetbutton"
                  onClick={() => {
                    checkBP(getUserData(), ["ALL"], ["ALL"], ["ALL"], () => {
                      onReset();
                    });
                  }}
                >
                  RESET
                </button>
                <button
                  className="deletebutton"
                  onClick={() => {
                    checkBP(getUserData(), ["ALL"], ["ALL"], ["ALL"], () => {
                      onClick(3);
                    });
                  }}
                >
                  XÓA
                </button>
              </div>
            );
          } else if (params.data.APPROVAL_STATUS === 3) {
            return (
              <div className="onoffdiv">
                <span style={{ fontWeight: "bold", color: "red" }}>Đã xóa</span>
              </div>
            );
          } else {
            return (
              <div className="onoffdiv">
                <button
                  className="onbutton"
                  onClick={() => {
                    checkBP(getUserData(), ["ALL"], ["ALL"], ["ALL"], () => {
                      onClick(1);
                    });
                  }}
                >
                  Duyệt
                </button>
                <button
                  className="offbutton"
                  onClick={() => {
                    checkBP(getUserData(), ["ALL"], ["ALL"], ["ALL"], () => {
                      onClick(0);
                    });
                  }}
                >
                  Từ chối
                </button>
              </div>
            );
          }
        },
      },
      { field: "EMPL_NO", headerName: "EMPL_NO", width: 60 },
      { field: "CMS_ID", headerName: "NS_ID", width: 60 },
      {
        field: "FULL_NAME",
        headerName: "FULL_NAME",
        width: 120,
        cellRenderer: (params: any) => {
          return (
            <div>
              <span style={{ fontWeight: "bold", color: "#122dc5" }}>
                {params.data.FULL_NAME}
              </span>
            </div>
          );
        },
      },
      {
        field: "REQUEST_DATE",
        headerName: "REQUEST_DATE",
        width: 90,
      },
      {
        field: "APPLY_DATE",
        headerName: "APPLY_DATE",
        width: 90,
      },
      { field: "REASON_NAME", headerName: "REASON_NAME", width: 80 },
      { field: "CA_NGHI", headerName: "CA_NGHI", width: 50 },
      { field: "REMARK", headerName: "REMARK", width: 60 },
      { field: "ON_OFF", headerName: "ON_OFF", width: 40 },
      {
        field: "DOB",
        headerName: "DOB",
        width: 70,
      },
      { field: "POSITION_NAME", headerName: "POSITION_NAME", width: 100 },
      { field: "FACTORY_NAME", headerName: "FACTORY_NAME", width: 100 },
      { field: "WORK_SHIF_NAME", headerName: "WORK_SHIF_NAME", width: 100 },
      { field: "JOB_NAME", headerName: "JOB_NAME", width: 100 },
      { field: "MAINDEPTNAME", headerName: "MAINDEPT_NAME", width: 90 },
      { field: "SUBDEPTNAME", headerName: "SUBDEPT_NAME", width: 90 },
      {
        field: "WORK_POSITION_NAME",
        headerName: "WORK_POSITION_NAME",
        width: 120,
      },
    ],
    [diemdanhnhomtable, true]
  );
  const pheduyetnghiAGTable = useMemo(() => {
    return (
      <AGTable
        rowHeight={40}
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
  const loadPheDuyetNghi = useCallback(() => {
    generalQuery(option, {
      FROM_DATE: fromdate,
      TO_DATE: todate,
      ONLY_PENDING: onlyPending,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
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
              DOB: e.DOB !== null ? moment.utc(e.DOB).format("YYYY-MM-DD") : "",
              FULL_NAME: e.MIDLAST_NAME + " " + e.FIRST_NAME,
              id: e.OFF_ID,
            };
          });
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
        console.log(error);
      });
  }, [fromdate, todate, onlyPending]);
  useEffect(() => {
    loadPheDuyetNghi();
  }, []);
  return (
    <div className="pheduyetnghi">
      <div className="filterform">
        <label>
          <b>From Date:</b>
          <input
            type="date"
            value={fromdate.slice(0, 10)}
            onChange={(e) => setFromDate(e.target.value)}
          ></input>
        </label>
        <label>
          <b>To Date:</b>{" "}
          <input
            type="date"
            value={todate.slice(0, 10)}
            onChange={(e) => setToDate(e.target.value)}
          ></input>
        </label>
        <b>Only Pending:</b>
        <input
          type="checkbox"
          checked={onlyPending}
          onChange={(e) => setOnlyPending(e.target.checked)}
        ></input>
        <button
          className="searchbutton"
          onClick={() => {
            loadPheDuyetNghi();
          }}
        >
          Search
        </button>
      </div>
      <div className="maindept_table">{pheduyetnghiAGTable}</div>
    </div>
  );
};
export default PheDuyetNghiCMS;

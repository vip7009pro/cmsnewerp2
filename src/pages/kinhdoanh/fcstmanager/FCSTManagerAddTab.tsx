import { IconButton } from "@mui/material";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { generalQuery, getSocket, getUserData } from "../../../api/Api";
import { f_insert_Notification_Data } from "../../../api/GlobalFunction";
import { NotificationElement } from "../../../components/NotificationPanel/Notification";
import AGTable from "../../../components/DataTable/AGTable";
import { UserData } from "../../../api/GlobalInterface";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import "./FCSTManagerAddTab.scss";

const FCSTManagerAddTab = () => {
  const [uploadExcelJson, setUploadExcelJSon] = useState<Array<any>>([]);
  const [isLoading, setisLoading] = useState(false);
  const [trigger, setTrigger] = useState(true);

  const userData: UserData | undefined = useSelector((state: RootState) => state.totalSlice.userData);

  const column_excelplan2: any = [
    { field: "EMPL_NO", headerName: "EMPL_NO", width: 50 },
    { field: "CUST_CD", headerName: "CUST_CD", width: 50 },
    { field: "G_CODE", headerName: "G_CODE", width: 50 },
    { field: "PROD_PRICE", headerName: "PROD_PRICE", width: 50 },
    { field: "YEAR", headerName: "YEAR", width: 50 },
    { field: "WEEKNO", headerName: "WEEKNO", width: 50 },
    { field: "W1", type: "number", headerName: "W1", width: 50 },
    { field: "W2", type: "number", headerName: "W2", width: 50 },
    { field: "W3", type: "number", headerName: "W3", width: 50 },
    { field: "W4", type: "number", headerName: "W4", width: 50 },
    { field: "W5", type: "number", headerName: "W5", width: 50 },
    { field: "W6", type: "number", headerName: "W6", width: 50 },
    { field: "W7", type: "number", headerName: "W7", width: 50 },
    { field: "W8", type: "number", headerName: "W8", width: 50 },
    { field: "W9", type: "number", headerName: "W9", width: 50 },
    { field: "W10", type: "number", headerName: "W10", width: 50 },
    { field: "W11", type: "number", headerName: "W11", width: 50 },
    { field: "W12", type: "number", headerName: "W12", width: 50 },
    { field: "W13", type: "number", headerName: "W13", width: 50 },
    { field: "W14", type: "number", headerName: "W14", width: 50 },
    { field: "W15", type: "number", headerName: "W15", width: 50 },
    { field: "W16", type: "number", headerName: "W16", width: 50 },
    { field: "W17", type: "number", headerName: "W17", width: 50 },
    { field: "W18", type: "number", headerName: "W18", width: 50 },
    { field: "W19", type: "number", headerName: "W19", width: 50 },
    { field: "W20", type: "number", headerName: "W20", width: 50 },
    { field: "W21", type: "number", headerName: "W21", width: 50 },
    { field: "W22", type: "number", headerName: "W22", width: 50 },
    { field: "CHECKSTATUS", headerName: "CHECKSTATUS", width: 200 },
  ];

  const readUploadFile = (e: any) => {
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json: any = XLSX.utils.sheet_to_json(worksheet);

        setUploadExcelJSon(
          json.map((element: any, index: number) => {
            return {
              ...element,
              id: index,
              CHECKSTATUS: "Waiting",
              W1: element.W1 === undefined || element.W1 === "" ? 0 : element.W1,
              W2: element.W2 === undefined || element.W2 === "" ? 0 : element.W2,
              W3: element.W3 === undefined || element.W3 === "" ? 0 : element.W3,
              W4: element.W4 === undefined || element.W4 === "" ? 0 : element.W4,
              W5: element.W5 === undefined || element.W5 === "" ? 0 : element.W5,
              W6: element.W6 === undefined || element.W6 === "" ? 0 : element.W6,
              W7: element.W7 === undefined || element.W7 === "" ? 0 : element.W7,
              W8: element.W8 === undefined || element.W8 === "" ? 0 : element.W8,
              W9: element.W9 === undefined || element.W9 === "" ? 0 : element.W9,
              W10: element.W10 === undefined || element.W10 === "" ? 0 : element.W10,
              W11: element.W11 === undefined || element.W11 === "" ? 0 : element.W11,
              W12: element.W12 === undefined || element.W12 === "" ? 0 : element.W12,
              W13: element.W13 === undefined || element.W13 === "" ? 0 : element.W13,
              W14: element.W14 === undefined || element.W14 === "" ? 0 : element.W14,
              W15: element.W15 === undefined || element.W15 === "" ? 0 : element.W15,
              W16: element.W16 === undefined || element.W16 === "" ? 0 : element.W16,
              W17: element.W17 === undefined || element.W17 === "" ? 0 : element.W17,
              W18: element.W18 === undefined || element.W18 === "" ? 0 : element.W18,
              W19: element.W19 === undefined || element.W19 === "" ? 0 : element.W19,
              W20: element.W20 === undefined || element.W20 === "" ? 0 : element.W20,
              W21: element.W21 === undefined || element.W21 === "" ? 0 : element.W21,
              W22: element.W22 === undefined || element.W22 === "" ? 0 : element.W22,
            };
          }),
        );
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  const handle_checkFcstHangLoat = async () => {
    setisLoading(true);
    let tempjson = uploadExcelJson;
    for (let i = 0; i < uploadExcelJson.length; i++) {
      let err_code: number = 0;
      await generalQuery("checkFcstExist", {
        FCSTYEAR: uploadExcelJson[i].YEAR,
        FCSTWEEKNO: uploadExcelJson[i].WEEKNO,
        G_CODE: uploadExcelJson[i].G_CODE,
        CUST_CD: uploadExcelJson[i].CUST_CD,
      })
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            err_code = 1;
          }
        })
        .catch((error) => {
          console.log(error);
        });

      await generalQuery("checkGCodeVer", {
        G_CODE: uploadExcelJson[i].G_CODE,
      })
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            if (response.data.data[0].USE_YN === "Y") {
            } else {
              err_code = 3;
            }
          } else {
            err_code = 4;
          }
        })
        .catch((error) => {
          console.log(error);
        });

      if (err_code === 0) {
        tempjson[i].CHECKSTATUS = "OK";
      } else if (err_code === 1) {
        tempjson[i].CHECKSTATUS = "NG:FCST đã tồn tại";
      } else if (err_code === 2) {
        tempjson[i].CHECKSTATUS = "NG: Ngày FCST không được sau ngày hôm nay";
      } else if (err_code === 3) {
        tempjson[i].CHECKSTATUS = "NG: Ver này đã bị khóa";
      } else if (err_code === 4) {
        tempjson[i].CHECKSTATUS = "NG: Không có Code ERP này";
      } else if (err_code === 5) {
        tempjson[i].CHECKSTATUS = "NG: Giao hàng nhiều hơn PO";
      }
    }
    setisLoading(false);
    Swal.fire("Thông báo", "Đã hoàn thành check FCST hàng loạt", "success");
    setUploadExcelJSon(tempjson);
    setTrigger(!trigger);
  };

  const handle_upFcstHangLoat = async () => {
    setisLoading(true);
    let tempjson = uploadExcelJson;
    for (let i = 0; i < uploadExcelJson.length; i++) {
      let err_code: number = 0;
      await generalQuery("checkFcstExist", {
        FCSTYEAR: uploadExcelJson[i].YEAR,
        FCSTWEEKNO: uploadExcelJson[i].WEEKNO,
        G_CODE: uploadExcelJson[i].G_CODE,
        CUST_CD: uploadExcelJson[i].CUST_CD,
      })
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            err_code = 1;
          }
        })
        .catch((error) => {
          console.log(error);
        });

      await generalQuery("checkGCodeVer", {
        G_CODE: uploadExcelJson[i].G_CODE,
      })
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            if (response.data.data[0].USE_YN === "Y") {
            } else {
              err_code = 3;
            }
          } else {
            err_code = 4;
          }
        })
        .catch((error) => {
          console.log(error);
        });

      if (err_code === 0) {
        await generalQuery("insert_fcst", {
          EMPL_NO: uploadExcelJson[i].EMPL_NO,
          CUST_CD: uploadExcelJson[i].CUST_CD,
          G_CODE: uploadExcelJson[i].G_CODE,
          PROD_PRICE: uploadExcelJson[i].PROD_PRICE,
          YEAR: uploadExcelJson[i].YEAR,
          WEEKNO: uploadExcelJson[i].WEEKNO,
          W1: uploadExcelJson[i].W1,
          W2: uploadExcelJson[i].W2,
          W3: uploadExcelJson[i].W3,
          W4: uploadExcelJson[i].W4,
          W5: uploadExcelJson[i].W5,
          W6: uploadExcelJson[i].W6,
          W7: uploadExcelJson[i].W7,
          W8: uploadExcelJson[i].W8,
          W9: uploadExcelJson[i].W9,
          W10: uploadExcelJson[i].W10,
          W11: uploadExcelJson[i].W11,
          W12: uploadExcelJson[i].W12,
          W13: uploadExcelJson[i].W13,
          W14: uploadExcelJson[i].W14,
          W15: uploadExcelJson[i].W15,
          W16: uploadExcelJson[i].W16,
          W17: uploadExcelJson[i].W17,
          W18: uploadExcelJson[i].W18,
          W19: uploadExcelJson[i].W19,
          W20: uploadExcelJson[i].W20,
          W21: uploadExcelJson[i].W21,
          W22: uploadExcelJson[i].W22,
        })
          .then((response) => {
            if (response.data.tk_status !== "NG") {
              tempjson[i].CHECKSTATUS = "OK";
            } else {
              err_code = 5;
              tempjson[i].CHECKSTATUS = "NG: Lỗi SQL: " + response.data.message;
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else if (err_code === 1) {
        tempjson[i].CHECKSTATUS = "NG:FCST đã tồn tại";
      } else if (err_code === 2) {
        tempjson[i].CHECKSTATUS = "NG: Ngày FCST không được sau ngày hôm nay";
      } else if (err_code === 3) {
        tempjson[i].CHECKSTATUS = "NG: Ver này đã bị khóa";
      } else if (err_code === 4) {
        tempjson[i].CHECKSTATUS = "NG: Không có Code ERP này";
      } else if (err_code === 5) {
        tempjson[i].CHECKSTATUS = "NG: Giao hàng nhiều hơn PO";
      }
    }
    setisLoading(false);

    let newNotification: NotificationElement = {
      CTR_CD: "002",
      NOTI_ID: -1,
      NOTI_TYPE: "success",
      TITLE: "Thêm FCST mới",
      CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${getUserData()?.FIRST_NAME}), nhân viên ${getUserData()?.WORK_POSITION_NAME} đã thêm forecast mới`,
      SUBDEPTNAME: "KD",
      MAINDEPTNAME: "KD",
      INS_EMPL: "NHU1903",
      INS_DATE: "2024-12-30",
      UPD_EMPL: "NHU1903",
      UPD_DATE: "2024-12-30",
    };
    if (await f_insert_Notification_Data(newNotification)) {
      getSocket().emit("notification_panel", newNotification);
    }

    Swal.fire("Thông báo", "Đã hoàn thành check Plan hàng loạt", "success");
    setUploadExcelJSon(tempjson);
  };

  const confirmUpFcstHangLoat = () => {
    Swal.fire({
      title: "Chắc chắn muốn thêm FCST hàng loạt ?",
      text: "Thêm rồi mà sai, sửa là hơi vất đấy",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn thêm!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành thêm", "Đang thêm FCST hàng loạt", "success");
        handle_upFcstHangLoat();
      }
    });
  };

  const confirmCheckFcstHangLoat = () => {
    Swal.fire({
      title: "Chắc chắn muốn check FCST hàng loạt ?",
      text: "Sẽ bắt đầu check FCST hàng loạt",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn check!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành check", "Đang check FCST hàng loạt", "success");
        handle_checkFcstHangLoat();
      }
    });
  };

  const fcstDataAGTableExcel = useMemo(
    () => (
      <AGTable
        suppressRowClickSelection={false}
        showFilter={true}
        toolbar={<></>}
        columns={column_excelplan2}
        data={uploadExcelJson}
        onCellEditingStopped={(params: any) => {}}
        onRowClick={(params: any) => {}}
        onSelectionChange={(params: any) => {}}
      />
    ),
    [uploadExcelJson, trigger],
  );

  useEffect(() => {}, []);

  return (
    <div className="newfcst">
      <div className="batchnewplan">
        <h3>Thêm FCST Hàng Loạt</h3>
        <form className="formupload">
          <label htmlFor="upload">
            <b>Chọn file Excel: </b>
            <input
              className="selectfilebutton"
              type="file"
              name="upload"
              id="upload"
              onChange={(e: any) => {
                readUploadFile(e);
              }}
            />
          </label>
          <div
            className="checkpobutton"
            onClick={(e) => {
              e.preventDefault();
              confirmCheckFcstHangLoat();
            }}
          >
            Check FCST
          </div>
          <div
            className="uppobutton"
            onClick={(e) => {
              e.preventDefault();
              confirmUpFcstHangLoat();
            }}
          >
            Up FCST
          </div>
        </form>
        <div className="insertPlanTable">{fcstDataAGTableExcel}</div>
      </div>
    </div>
  );
};

export default FCSTManagerAddTab;

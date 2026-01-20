import { Button } from "@mui/material";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { generalQuery } from "../../../api/Api";
import { SaveExcel } from "../../../api/GlobalFunction";
import { UserData } from "../../../api/GlobalInterface";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import AGTable from "../../../components/DataTable/AGTable";
import "./ShortageKDAddTab.scss";

const ShortageKDAddTab = () => {
  const userData: UserData | undefined = useSelector((state: RootState) => state.totalSlice.userData);

  const [uploadExcelJson, setUploadExcelJSon] = useState<Array<any>>([]);

  const column_excel_shortage = useMemo(
    () => [
      { field: "G_CODE", headerName: "G_CODE", width: 100 },
      { field: "CUST_CD", headerName: "CUST_CD", width: 100 },
      { field: "EMPL_NO", headerName: "EMPL_NO", width: 100 },
      { field: "PLAN_DATE", headerName: "PLAN_DATE", width: 100 },
      { field: "D1_9H", headerName: "D1_9H", width: 100 },
      { field: "D1_13H", headerName: "D1_13H", width: 100 },
      { field: "D1_19H", headerName: "D1_19H", width: 100 },
      { field: "D1_21H", headerName: "D1_21H", width: 100 },
      { field: "D1_23H", headerName: "D1_23H", width: 100 },
      { field: "D2_9H", headerName: "D2_9H", width: 100 },
      { field: "D2_13H", headerName: "D2_13H", width: 100 },
      { field: "D2_21H", headerName: "D2_21H", width: 100 },
      { field: "D3_SANG", headerName: "D3_SANG", width: 100 },
      { field: "D3_CHIEU", headerName: "D3_CHIEU", width: 100 },
      { field: "D4_SANG", headerName: "D4_SANG", width: 100 },
      { field: "D4_CHIEU", headerName: "D4_CHIEU", width: 100 },
      { field: "PRIORITY", headerName: "PRIORITY", width: 100 },
      { field: "CHECKSTATUS", headerName: "CHECKSTATUS", width: 100 },
    ],
    [uploadExcelJson],
  );

  const excelAGTable = useMemo(
    () => (
      <AGTable
        suppressRowClickSelection={false}
        showFilter={true}
        toolbar={
          <div>            
          </div>
        }
        columns={column_excel_shortage}
        data={uploadExcelJson}
        onCellEditingStopped={(params: any) => {}}
        onRowClick={(params: any) => {}}
        onSelectionChange={(params: any) => {}}
      />
    ),
    [uploadExcelJson],
  );

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
              D1_9H: element.D1_9H === undefined || element.D1_9H === "" ? 0 : element.D1_9H,
              D1_13H: element.D1_13H === undefined || element.D1_13H === "" ? 0 : element.D1_13H,
              D1_19H: element.D1_19H === undefined || element.D1_19H === "" ? 0 : element.D1_19H,
              D1_21H: element.D1_21H === undefined || element.D1_21H === "" ? 0 : element.D1_21H,
              D1_23H: element.D1_23H === undefined || element.D1_23H === "" ? 0 : element.D1_23H,
              D1_OTHER: element.D1_OTHER === undefined || element.D1_OTHER === "" ? 0 : element.D1_OTHER,
              D2_9H: element.D2_9H === undefined || element.D2_9H === "" ? 0 : element.D2_9H,
              D2_13H: element.D2_13H === undefined || element.D2_13H === "" ? 0 : element.D2_13H,
              D2_21H: element.D2_21H === undefined || element.D2_21H === "" ? 0 : element.D2_21H,
              D3_SANG: element.D3_SANG === undefined || element.D3_SANG === "" ? 0 : element.D3_SANG,
              D3_CHIEU: element.D3_CHIEU === undefined || element.D3_CHIEU === "" ? 0 : element.D3_CHIEU,
              D4_SANG: element.D4_SANG === undefined || element.D4_SANG === "" ? 0 : element.D4_SANG,
              D4_CHIEU: element.D4_CHIEU === undefined || element.D4_CHIEU === "" ? 0 : element.D4_CHIEU,
              PLAN_DATE: moment.utc(element.PLAN_DATE).format("YYYY-MM-DD"),
            };
          }),
        );
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  const handle_checkShortageHangLoat = async () => {
    let tempjson = uploadExcelJson;
    for (let i = 0; i < uploadExcelJson.length; i++) {
      let err_code: number = 0;
      await generalQuery("checkShortageExist", {
        G_CODE: uploadExcelJson[i].G_CODE,
        CUST_CD: uploadExcelJson[i].CUST_CD,
        PLAN_DATE: uploadExcelJson[i].PLAN_DATE,
      })
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            err_code = 1;
          }
        })
        .catch((error) => {
          console.log(error);
        });
      let now = moment();
      let plandate = moment(uploadExcelJson[i].PLAN_DATE);
      if (now < plandate) {
        err_code = 2;
      }
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
        tempjson[i].CHECKSTATUS = "NG:Plan đã tồn tại";
      } else if (err_code === 2) {
        tempjson[i].CHECKSTATUS = "NG: Ngày Plan không được sau ngày hôm nay";
      } else if (err_code === 3) {
        tempjson[i].CHECKSTATUS = "NG: Ver này đã bị khóa";
      } else if (err_code === 4) {
        tempjson[i].CHECKSTATUS = "NG: Không có Code ERP này";
      } else if (err_code === 5) {
        tempjson[i].CHECKSTATUS = "NG: Giao hàng nhiều hơn PO";
      }
    }
    Swal.fire("Thông báo", "Đã hoàn thành check Plan hàng loạt", "success");
    setUploadExcelJSon(tempjson);
  };

  const handle_upShortageHangLoat = async () => {
    let tempjson = uploadExcelJson;
    for (let i = 0; i < uploadExcelJson.length; i++) {
      let err_code: number = 0;
      await generalQuery("checkShortageExist", {
        G_CODE: uploadExcelJson[i].G_CODE,
        CUST_CD: uploadExcelJson[i].CUST_CD,
        PLAN_DATE: uploadExcelJson[i].PLAN_DATE,
      })
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            err_code = 1;
          }
        })
        .catch((error) => {
          console.log(error);
        });
      let now = moment();
      let plandate = moment(uploadExcelJson[i].PLAN_DATE);
      if (now < plandate) {
        err_code = 2;
      }
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
        await generalQuery("insert_shortage", {
          REMARK: uploadExcelJson[i].REMARK,
          G_CODE: uploadExcelJson[i].G_CODE,
          CUST_CD: uploadExcelJson[i].CUST_CD,
          PLAN_DATE: uploadExcelJson[i].PLAN_DATE,
          EMPL_NO: userData?.EMPL_NO,
          D1_9H: uploadExcelJson[i].D1_9H,
          D1_13H: uploadExcelJson[i].D1_13H,
          D1_19H: uploadExcelJson[i].D1_19H,
          D1_21H: uploadExcelJson[i].D1_21H,
          D1_23H: uploadExcelJson[i].D1_23H,
          D1_OTHER: uploadExcelJson[i].D1_OTHER,
          D2_9H: uploadExcelJson[i].D2_9H,
          D2_13H: uploadExcelJson[i].D2_13H,
          D2_21H: uploadExcelJson[i].D2_21H,
          D3_SANG: uploadExcelJson[i].D3_SANG,
          D3_CHIEU: uploadExcelJson[i].D3_CHIEU,
          D4_SANG: uploadExcelJson[i].D4_SANG,
          D4_CHIEU: uploadExcelJson[i].D4_CHIEU,
          PRIORITY: uploadExcelJson[i].PRIORITY,
          INS_EMPL: userData?.EMPL_NO,
          UPD_EMPL: userData?.EMPL_NO,
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
        tempjson[i].CHECKSTATUS = "NG:Plan đã tồn tại";
      } else if (err_code === 2) {
        tempjson[i].CHECKSTATUS = "NG: Ngày Plan không được sau ngày hôm nay";
      } else if (err_code === 3) {
        tempjson[i].CHECKSTATUS = "NG: Ver này đã bị khóa";
      } else if (err_code === 4) {
        tempjson[i].CHECKSTATUS = "NG: Không có Code ERP này";
      } else if (err_code === 5) {
        tempjson[i].CHECKSTATUS = "NG: Giao hàng nhiều hơn PO";
      }
    }
    Swal.fire("Thông báo", "Đã hoàn thành check Plan hàng loạt", "success");
    setUploadExcelJSon(tempjson);
  };

  const confirmUpShortageHangLoat = () => {
    Swal.fire({
      title: "Chắc chắn muốn thêm Plan hàng loạt ?",
      text: "Thêm rồi mà sai, sửa là hơi vất đấy",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn thêm!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành thêm", "Đang thêm Plan hàng loạt", "success");
        handle_upShortageHangLoat();
      }
    });
  };

  const confirmCheckShortageHangLoat = () => {
    Swal.fire({
      title: "Chắc chắn muốn check Plan hàng loạt ?",
      text: "Sẽ bắt đầu check Plan hàng loạt",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn check!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành check", "Đang check Plan hàng loạt", "success");
        handle_checkShortageHangLoat();
      }
    });
  };

  useEffect(() => {}, []);

  return (
    <div className="planAdd">
      <div className="batchnewplan batchnewplan--full">
        <div className="planAddHeader">
          <h3>Thêm Shortage Hàng Loạt</h3>
        </div>

        <form className="formupload formupload--full">
          <div className="uploadLeft">
            <label htmlFor="upload">
           
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
          </div>

          <Button
            variant="contained"
            color="info"
            className="planAddActionBtn"
            onClick={(e) => {
              e.preventDefault();
              confirmCheckShortageHangLoat();
            }}
          >
            Check
          </Button>
          <Button
            variant="contained"
            color="error"
            className="planAddActionBtn"
            onClick={(e) => {
              e.preventDefault();
              confirmUpShortageHangLoat();
            }}
          >
            Up Shortage
          </Button>
        </form>

        <div className="insertPlanTable insertPlanTable--full">{excelAGTable}</div>
      </div>
    </div>
  );
};

export default ShortageKDAddTab;

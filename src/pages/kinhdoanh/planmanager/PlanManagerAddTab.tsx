import { Button } from "@mui/material";
import moment from "moment";
import { useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { generalQuery, getSocket, getUserData } from "../../../api/Api";
import { f_insert_Notification_Data } from "../../../api/GlobalFunction";
import { NotificationElement } from "../../../components/NotificationPanel/Notification";
import AGTable from "../../../components/DataTable/AGTable";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import "./PlanManagerAddTab.scss";

const PlanManagerAddTab = () => {
  const userData = useSelector((state: RootState) => state.totalSlice.userData);
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const company: string = useSelector((state: RootState) => state.totalSlice.company);

  const [uploadExcelJson, setUploadExcelJSon] = useState<Array<any>>([]);
  const [columnsExcel, setColumnsExcel] = useState<Array<any>>([

    { field: "PLAN_ID", headerName: "PLAN_ID", width: 100, checkboxSelection: true, headerCheckboxSelection: true },
    { field: "EMPL_NAME", headerName: "EMPL_NAME", width: 100 },
    { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 100 },
    { field: "G_CODE", headerName: "G_CODE", width: 70 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 100 },
    {
      field: "G_NAME",
      headerName: "G_NAME",
      width: 120,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            <b>{params.data.G_NAME}</b>
          </span>
        );
      },
    },
    { field: "PROD_TYPE", headerName: "PROD_TYPE", width: 60 },
    {
      field: "PROD_MAIN_MATERIAL",
      headerName: "PROD_MAIN_MATERIAL",
      width: 120,
    },
    { field: "PLAN_DATE", headerName: "PLAN_DATE", width: 50 },
    {
      field: "D1",
      type: "number",
      headerName: "D1",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.D1?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "D2",
      type: "number",
      headerName: "D2",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.D2?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "D3",
      type: "number",
      headerName: "D3",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.D3?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "D4",
      type: "number",
      headerName: "D4",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.D4?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "D5",
      type: "number",
      headerName: "D5",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.D5?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "D6",
      type: "number",
      headerName: "D6",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.D6?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "D7",
      type: "number",
      headerName: "D7",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.D7?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "D8",
      type: "number",
      headerName: "D8",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.D8?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "D9",
      type: "number",
      headerName: "D9",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.D9?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "D10",
      type: "number",
      headerName: "D10",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.D10?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "D11",
      type: "number",
      headerName: "D11",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.D11?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "D12",
      type: "number",
      headerName: "D12",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.D12?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "D13",
      type: "number",
      headerName: "D13",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.D13?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "D14",
      type: "number",
      headerName: "D14",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.D14?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "D15",
      type: "number",
      headerName: "D15",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.D15?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    { field: "REMARK", headerName: "REMARK", width: 120 },
  

  ]);
  const [trigger, setTrigger] = useState(true);
  const excelSelected = useRef<any[]>([]);

  const loadFile = (e: any) => {
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = (evt: any) => {
        const data = evt.target.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json: any = XLSX.utils.sheet_to_json(worksheet);
        const keys = json.length > 0 ? Object.keys(json[0]) : [];
        let uploadexcelcolumn = keys.map((element) => {
          return {
            field: element,
            headerName: element,
            width: 150,
          };
        });
        uploadexcelcolumn.push({
          field: "CHECKSTATUS",
          headerName: "CHECKSTATUS",
          width: 200,
        });
        setColumnsExcel(uploadexcelcolumn);

        setUploadExcelJSon(
          json.map((element: any, index: number) => {
            return {
              ...element,
              id: index,
              CHECKSTATUS: "Waiting",
              D1: element.D1 === undefined || element.D1 === "" ? 0 : element.D1,
              D2: element.D2 === undefined || element.D2 === "" ? 0 : element.D2,
              D3: element.D3 === undefined || element.D3 === "" ? 0 : element.D3,
              D4: element.D4 === undefined || element.D4 === "" ? 0 : element.D4,
              D5: element.D5 === undefined || element.D5 === "" ? 0 : element.D5,
              D6: element.D6 === undefined || element.D6 === "" ? 0 : element.D6,
              D7: element.D7 === undefined || element.D7 === "" ? 0 : element.D7,
              D8: element.D8 === undefined || element.D8 === "" ? 0 : element.D8,
              D9: element.D9 === undefined || element.D9 === "" ? 0 : element.D9,
              D10: element.D10 === undefined || element.D10 === "" ? 0 : element.D10,
              D11: element.D11 === undefined || element.D11 === "" ? 0 : element.D11,
              D12: element.D12 === undefined || element.D12 === "" ? 0 : element.D12,
              D13: element.D13 === undefined || element.D13 === "" ? 0 : element.D13,
              D14: element.D14 === undefined || element.D14 === "" ? 0 : element.D14,
              D15: element.D15 === undefined || element.D15 === "" ? 0 : element.D15,
            };
          })
        );
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  const handle_checkPlanHangLoat = async () => {
    let tempjson = uploadExcelJson;
    for (let i = 0; i < uploadExcelJson.length; i++) {
      let err_code: number = 0;
      await generalQuery("checkPlanExist", {
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
            if (response.data.data[0].USE_YN !== "Y") {
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
    setTrigger(!trigger);
  };

  const handle_upPlanHangLoat = async () => {
    let tempjson = uploadExcelJson;
    for (let i = 0; i < uploadExcelJson.length; i++) {
      let err_code: number = 0;
      await generalQuery("checkPlanExist", {
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
            if (response.data.data[0].USE_YN !== "Y") {
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
        await generalQuery("insert_plan", {
          REMARK: uploadExcelJson[i].REMARK,
          G_CODE: uploadExcelJson[i].G_CODE,
          CUST_CD: uploadExcelJson[i].CUST_CD,
          PLAN_DATE: uploadExcelJson[i].PLAN_DATE,
          EMPL_NO: userData?.EMPL_NO,
          D1: uploadExcelJson[i].D1,
          D2: uploadExcelJson[i].D2,
          D3: uploadExcelJson[i].D3,
          D4: uploadExcelJson[i].D4,
          D5: uploadExcelJson[i].D5,
          D6: uploadExcelJson[i].D6,
          D7: uploadExcelJson[i].D7,
          D8: uploadExcelJson[i].D8,
          D9: uploadExcelJson[i].D9,
          D10: uploadExcelJson[i].D10,
          D11: uploadExcelJson[i].D11,
          D12: uploadExcelJson[i].D12,
          D13: uploadExcelJson[i].D13,
          D14: uploadExcelJson[i].D14,
          D15: uploadExcelJson[i].D15,
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
        tempjson[i].CHECKSTATUS = "NG: Giao hàng nhiều hơn đơn hàng";
      }
    }

    let newNotification: NotificationElement = {
      CTR_CD: "002",
      NOTI_ID: -1,
      NOTI_TYPE: "success",
      TITLE: "Thêm kế hoạch giao hàng mới",
      CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${getUserData()?.FIRST_NAME}), nhân viên ${getUserData()?.WORK_POSITION_NAME} đã thêm kế hoạch giao hàng mới`,
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

  const confirmUpPlanHangLoat = () => {
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
        handle_upPlanHangLoat();
      }
    });
  };

  const confirmCheckPlanHangLoat = () => {
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
        handle_checkPlanHangLoat();
      }
    });
  };

  const planDataAGTableExcel = useMemo(
    () => (
      <AGTable
        suppressRowClickSelection={false}
        showFilter={true}
        toolbar={<></>}
        columns={columnsExcel}
        data={uploadExcelJson}
        onCellEditingStopped={(params: any) => {}}
        onRowClick={(params: any) => {}}
        onSelectionChange={(params: any) => {
          excelSelected.current = params!.api.getSelectedRows();
        }}
      />
    ),
    [uploadExcelJson, columnsExcel, trigger]
  );

  return (
    <div className="planAdd">
      <div
        className="batchnewplan batchnewplan--full"
        style={{
          ["--planadd-header-bg" as any]: theme?.[company]?.backgroundImage ?? theme?.CMS?.backgroundImage ?? "",
        }}
      >
        <div className="planAddHeader">
          <h3>Thêm Plan Hàng Loạt</h3>
        </div>

        <div className="formupload formupload--full">
          <div className="uploadLeft">
            <input
              className="selectfilebutton"
              type="file"
              name="upload"
              id="upload"
              onChange={(e: any) => {
                loadFile(e);
              }}
            />
          </div>

          <Button className="planAddActionBtn" variant="contained" size="small" onClick={confirmCheckPlanHangLoat}>
            Check Plan
          </Button>
          <Button
            className="planAddActionBtn"
            variant="contained"
            size="small"
            color="success"
            onClick={confirmUpPlanHangLoat}
          >
            Up Plan
          </Button>
        </div>

        <div className="insertPlanTable insertPlanTable--full">{planDataAGTableExcel}</div>
      </div>
    </div>
  );
};

export default PlanManagerAddTab;

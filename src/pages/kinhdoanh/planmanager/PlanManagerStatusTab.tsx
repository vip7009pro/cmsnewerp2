import React, { useMemo, useState } from "react";
import Swal from "sweetalert2";
import moment from "moment";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { INSPECT_STATUS_DATA } from "../../qc/interfaces/qcInterface";
import { f_loadInspect_status_G_CODE } from "../../qc/utils/qcUtils";
import { f_updateBTP_M100, f_updateTONKIEM_M100, f_update_Stock_M100_CMS } from "../../../api/GlobalFunction";
import AGTable from "../../../components/DataTable/AGTable";
import { Button } from "@mui/material";
import "../pomanager/PoManagerAddTab.scss";

const PlanManagerStatusTab: React.FC = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const company: string = useSelector((state: RootState) => state.totalSlice.company);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [planStatus, setPlanStatus] = useState<Array<INSPECT_STATUS_DATA>>([]);

  const column_planstatus: any = [
    { field: "PLAN_DATE", type: "date", headerName: "PLAN_DATE", width: 70 },
    { field: "G_CODE", headerName: "G_CODE", width: 70 },
    { field: "G_NAME", headerName: "G_NAME", width: 150 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 90 },
    {
      field: "IS_INSPECTING",
      headerName: "IS_INSPECTING",
      width: 110,
      cellRenderer: (params: any) => {
        if (params.value !== null)
          return (
            <span style={{ color: "green" }}>
              <b>INSPECTING</b> <img alt="running" src="/blink.gif" width={50} height={20}></img>
            </span>
          );
        return (
          <span style={{ color: "gray" }}>
            <b>NOT INSPECTING</b>
          </span>
        );
      },
    },
    { field: "INS_DATE", headerName: "INIT_TIME", width: 100 },
    { field: "INIT_INSP_STOCK", type: "number", headerName: "TON_KIEM_BAN_DAU", width: 100 },
    { field: "INPUT_QTY", type: "number", headerName: "NHAP_KIEM", width: 70 },
    { field: "FIRST_INPUT_TIME", type: "number", headerName: "FIRST_INPUT_TIME", width: 100 },
    { field: "PRIORITY", type: "number", headerName: "PRIORITY", width: 80 },
    { field: "PLAN_KT", type: "number", headerName: "PLAN_KT", width: 70 },
    { field: "CURRENT_INSP_STOCK", type: "number", headerName: "TON_KIEM_HIEN_TAI", width: 110 },
    { field: "INIT_WH_STOCK", type: "number", headerName: "TON_KHO_BAN_DAU", width: 100 },
    { field: "OUTPUT_QTY", type: "number", headerName: "XUAT_KIEM", width: 70 },
    { field: "TOTAL_OUTPUT", type: "number", headerName: "TONG_VAO_KHO", width: 100 },
    { field: "WH_OUTPUT_QTY", type: "number", headerName: "XUAT_KHO", width: 90 },
    { field: "CURRENT_WH_STOCK", type: "number", headerName: "TON_KHO_HIEN_TAI", width: 110 },
  ];

  const handleloadPlanStatus = async () => {
    Swal.fire({
      title: "Load Plan",
      text: "Đang load Plan, hãy chờ một chút",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });
    await f_update_Stock_M100_CMS({});
    await f_updateBTP_M100();
    await f_updateTONKIEM_M100();

    let kq: INSPECT_STATUS_DATA[] = [];
    kq = await f_loadInspect_status_G_CODE(fromdate);
    if (kq.length > 0) {
      Swal.fire("Thông báo", "Đã load " + kq.length + " dòng", "success");
      setPlanStatus(kq);
    } else {
      Swal.fire(
        "Thông báo",
        "Chưa chốt kế hoạch ngày " + fromdate + ", chọn ngày khác hoặc tra lại sau 14h " + fromdate,
        "success"
      );
      setPlanStatus([]);
    }
  };

  const planStatusDataAGTable = useMemo(
    () => (
      <AGTable
        suppressRowClickSelection={false}
        showFilter={true}
        toolbar={<></>}
        columns={column_planstatus}
        data={planStatus}
        onCellEditingStopped={(params: any) => {}}
        onRowClick={(params: any) => {}}
        onSelectionChange={(params: any) => {}}
      />
    ),
    [planStatus]
  );

  return (
    <div className="newpo">
      <div
        className="batchnewpo batchnewpo--full"
        style={{
          ["--poadd-header-bg" as any]: theme?.[company]?.backgroundImage ?? theme?.CMS?.backgroundImage ?? "",
        }}
      >
        <div className="newpoHeader">
          <h3>Trạng thái kiểm tra Plan</h3>
        </div>

        <div className="formupload formupload--full">
          <div className="uploadLeft">
            <input
              className="selectfilebutton"
              type="date"
              value={fromdate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <Button className="poAddActionBtn" variant="contained" size="small" onClick={handleloadPlanStatus}>
            Check Plan
          </Button>
        </div>

        <div className="insertPOTable insertPOTable--full">{planStatusDataAGTable}</div>
      </div>
    </div>
  );
};

export default PlanManagerStatusTab;

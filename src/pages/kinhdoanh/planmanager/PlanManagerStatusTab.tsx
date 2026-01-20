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
import './PlanManagerStatusTab.scss';

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
    { field: "IS_INSPECTING", headerName: "IS_INSPECTING", width: 110, cellRenderer: (params: any) => {
      if(params.value !== null)
      return (
        <span style={{ color: "green" }}>
          <b>INSPECTING</b> <img alt="running" src="/blink.gif" width={50} height={20}></img>
        </span>
      );
      return  <span style={{ color: "gray" }}>
      <b>NOT INSPECTING</b>
    </span>
    },},
    { field: "INS_DATE", headerName: "INIT_TIME", width: 100 },
    {
      field: "INIT_INSP_STOCK",
      type: "number",
      headerName: "TON_KIEM_BAN_DAU",
      width: 100,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.INIT_INSP_STOCK?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "INPUT_QTY",
      type: "number",
      headerName: "NHAP_KIEM",
      width: 70,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.INPUT_QTY?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "FIRST_INPUT_TIME",
      type: "number",
      headerName: "FIRST_INPUT_TIME",
      width: 100,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "gray" }}>
            <b>{params.data.FIRST_INPUT_TIME?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "PRIORITY",
      type: "number",
      headerName: "PRIORITY",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.PRIORITY?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "PLAN_KT",
      type: "number",
      headerName: "PLAN_KT",
      width: 70,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.PLAN_KT}</b>
          </span>
        );
      },
    },
    {
      field: "CURRENT_INSP_STOCK",
      type: "number",
      headerName: "TON_KIEM_HIEN_TAI",
      width: 110,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.CURRENT_INSP_STOCK?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "INIT_WH_STOCK",
      type: "number",
      headerName: "TON_KHO_BAN_DAU",
      width: 100,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.INIT_WH_STOCK?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "OUTPUT_QTY",
      type: "number",
      headerName: "XUAT_KIEM",
      width: 70,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.OUTPUT_QTY?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "TOTAL_OUTPUT",
      type: "number",
      headerName: "TONG_VAO_KHO",
      width: 100,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>{params.data.TOTAL_OUTPUT?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "WH_OUTPUT_QTY",
      type: "number",
      headerName: "XUAT_KHO",
      width: 90,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.WH_OUTPUT_QTY?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "CURRENT_WH_STOCK",
      type: "number",
      headerName: "TON_KHO_HIEN_TAI",
      width: 110,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.CURRENT_WH_STOCK?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "COVER_D1",      
      headerName: "COVER_D1",
      width: 60,
      cellStyle: (params: any) => {
        if (params.value === 'OK') {
          return { backgroundColor: "#43d2eb" };      
        }
        else {
          return { backgroundColor: "#fe7a7a", color: 'white' };
        }
       
      },
    },
    {
      field: "D1",
      type: "number",
      headerName: "D1",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{  }}>
            <b>{params.data.D1?.toLocaleString("en-US")}</b>
          </span>
        );
      },
      cellStyle: (params: any) => {
        if (params.data.D1 > params.data.TOTAL_OUTPUT) {
          return { backgroundColor: "red", color: 'white' };
        }
        else 
        {
          return { backgroundColor: "#12e928" };
        }
      }
    },
    {
      field: "D2",
      type: "number",
      headerName: "D2",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{}}>
            <b>{params.data.D2?.toLocaleString("en-US")}</b>
          </span>
        );
      },
      cellStyle: (params: any) => {
        if ((params.data.D1 + params.data.D2) > params.data.TOTAL_OUTPUT) {
          return { backgroundColor: "red", color: 'white' };
        }
        else 
        {
          return { backgroundColor: "#12e928" };
        }
      }
    },
    {
      field: "D3",
      type: "number",
      headerName: "D3",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{}}>
            <b>{params.data.D3?.toLocaleString("en-US")}</b>
          </span>
        );
      },
      cellStyle: (params: any) => {
        if ((params.data.D1 + params.data.D2 + params.data.D3) > params.data.TOTAL_OUTPUT) {
          return { backgroundColor: "red", color: 'white' };
        }
        else 
        {
          return { backgroundColor: "#12e928" };
        }
      }
    },
    {
      field: "D4",
      type: "number",
      headerName: "D4",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{}}>
            <b>{params.data.D4?.toLocaleString("en-US")}</b>
          </span>
        );
      },
      cellStyle: (params: any) => {
        if ((params.data.D1 + params.data.D2 + params.data.D3 + params.data.D4) > params.data.TOTAL_OUTPUT) {
          return { backgroundColor: "red", color: 'white' };
        }
        else 
        {
          return { backgroundColor: "#12e928" };
        }
      }
    },
    {
      field: "D5",
      type: "number",
      headerName: "D5",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{}}>
            <b>{params.data.D5?.toLocaleString("en-US")}</b>
          </span>
        );
      },
      cellStyle: (params: any) => {
        if ((params.data.D1 + params.data.D2 + params.data.D3 + params.data.D4 + params.data.D5) > params.data.TOTAL_OUTPUT) {
          return { backgroundColor: "red", color: 'white' };
        }
        else 
        {
          return { backgroundColor: "#12e928" };
        }
      }
    },
    {
      field: "D6",
      type: "number",
      headerName: "D6",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{}}>
            <b>{params.data.D6?.toLocaleString("en-US")}</b>
          </span>
        );
      },
      cellStyle: (params: any) => {
        if ((params.data.D1 + params.data.D2 + params.data.D3 + params.data.D4 + params.data.D5 + params.data.D6) > params.data.TOTAL_OUTPUT) {
          return { backgroundColor: "red", color: 'white' };
        }
        else 
        {
          return { backgroundColor: "#12e928" };
        }
      }
    },
    {
      field: "D7",
      type: "number",
      headerName: "D7",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{}}>
            <b>{params.data.D7?.toLocaleString("en-US")}</b>
          </span>
        );
      },
      cellStyle: (params: any) => {
        if ((params.data.D1 + params.data.D2 + params.data.D3 + params.data.D4 + params.data.D5 + params.data.D6 + params.data.D7) > params.data.TOTAL_OUTPUT) {
          return { backgroundColor: "red", color: 'white' };
        }
        else 
        {
          return { backgroundColor: "#12e928" };
        }
      }
    },
    {
      field: "D8",
      type: "number",
      headerName: "D8",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{}}>
            <b>{params.data.D8?.toLocaleString("en-US")}</b>
          </span>
        );
      },
      cellStyle: (params: any) => {
        if ((params.data.D1 + params.data.D2 + params.data.D3 + params.data.D4 + params.data.D5 + params.data.D6 + params.data.D7 + params.data.D8) > params.data.TOTAL_OUTPUT) {
          return { backgroundColor: "red", color: 'white' };
        }
        else 
        {
          return { backgroundColor: "#12e928" };
        }
      }
    },
    {
      field: "D9",
      type: "number",
      headerName: "D9",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{}}>
            <b>{params.data.D9?.toLocaleString("en-US")}</b>
          </span>
        );
      },
      cellStyle: (params: any) => {
        if ((params.data.D1 + params.data.D2 + params.data.D3 + params.data.D4 + params.data.D5 + params.data.D6 + params.data.D7 + params.data.D8 + params.data.D9) > params.data.TOTAL_OUTPUT) {
          return { backgroundColor: "red", color: 'white' };
        }
        else 
        {
          return { backgroundColor: "#12e928" };
        }
      }
    },
    {
      field: "D10",
      type: "number",
      headerName: "D10",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{}}>
            <b>{params.data.D10?.toLocaleString("en-US")}</b>
          </span>
        );
      },
      cellStyle: (params: any) => {
        if ((params.data.D1 + params.data.D2 + params.data.D3 + params.data.D4 + params.data.D5 + params.data.D6 + params.data.D7 + params.data.D8 + params.data.D9 + params.data.D10) > params.data.TOTAL_OUTPUT) {
          return { backgroundColor: "red", color: 'white' };
        }
        else 
        {
          return { backgroundColor: "#12e928" };
        }
      }
    },
    {
      field: "D11",
      type: "number",
      headerName: "D11",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{}}>
            <b>{params.data.D11?.toLocaleString("en-US")}</b>
          </span>
        );
      },
      cellStyle: (params: any) => {
        if ((params.data.D1 + params.data.D2 + params.data.D3 + params.data.D4 + params.data.D5 + params.data.D6 + params.data.D7 + params.data.D8 + params.data.D9 + params.data.D10 + params.data.D11) > params.data.TOTAL_OUTPUT) {
          return { backgroundColor: "red", color: 'white' };
        }
        else 
        {
          return { backgroundColor: "#12e928" };
        }
      }
    },
    {
      field: "D12",
      type: "number",
      headerName: "D12",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{}}>
            <b>{params.data.D12?.toLocaleString("en-US")}</b>
          </span>
        );
      },
      cellStyle: (params: any) => {
        if ((params.data.D1 + params.data.D2 + params.data.D3 + params.data.D4 + params.data.D5 + params.data.D6 + params.data.D7 + params.data.D8 + params.data.D9 + params.data.D10 + params.data.D11 + params.data.D12) > params.data.TOTAL_OUTPUT) {
          return { backgroundColor: "red", color: 'white' };
        }
        else 
        {
          return { backgroundColor: "#12e928" };
        }
      }
    },
    {
      field: "D13",
      type: "number",
      headerName: "D13",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{}}>
            <b>{params.data.D13?.toLocaleString("en-US")}</b>
          </span>
        );
      },
      cellStyle: (params: any) => {
        if ((params.data.D1 + params.data.D2 + params.data.D3 + params.data.D4 + params.data.D5 + params.data.D6 + params.data.D7 + params.data.D8 + params.data.D9 + params.data.D10 + params.data.D11 + params.data.D12 + params.data.D13) > params.data.TOTAL_OUTPUT) {
          return { backgroundColor: "red", color: 'white' };
        }
        else 
        {
          return { backgroundColor: "#12e928" };
        }
      }
    },
    {
      field: "D14",
      type: "number",
      headerName: "D14",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{}}>
            <b>{params.data.D14?.toLocaleString("en-US")}</b>
          </span>
        );
      },
      cellStyle: (params: any) => {
        if ((params.data.D1 + params.data.D2 + params.data.D3 + params.data.D4 + params.data.D5 + params.data.D6 + params.data.D7 + params.data.D8 + params.data.D9 + params.data.D10 + params.data.D11 + params.data.D12 + params.data.D13 + params.data.D14) > params.data.TOTAL_OUTPUT) {
          return { backgroundColor: "red", color: 'white' };
        }
        else 
        {
          return { backgroundColor: "#12e928" };
        }
      }
    },
    {
      field: "D15",
      type: "number",
      headerName: "D15",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{}}>
            <b>{params.data.D15?.toLocaleString("en-US")}</b>
          </span>
        );
      },
      cellStyle: (params: any) => {
        if ((params.data.D1 + params.data.D2 + params.data.D3 + params.data.D4 + params.data.D5 + params.data.D6 + params.data.D7 + params.data.D8 + params.data.D9 + params.data.D10 + params.data.D11 + params.data.D12 + params.data.D13 + params.data.D14 + params.data.D15) > params.data.TOTAL_OUTPUT) {
          return { backgroundColor: "red", color: 'white' };
        }
        else 
        {
          return { backgroundColor: "#12e928" };
        }
      }
    },
    { field: "STATUS", headerName: "STATUS", width: 70 },
  ]

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
    <div className="planStatusTab">
      <div
        className="planStatusForm"
        style={{
          backgroundImage: theme?.[company]?.backgroundImage ?? theme?.CMS?.backgroundImage ?? "",
        }}
      >
        <div className="planStatusHeader">
          <h3>Trạng thái kiểm tra Plan</h3>
        </div>

        <div className="planStatusControls">
          <label>
            <b>Ngày:</b>
            <input className="selectfilebutton" type="date" value={fromdate} onChange={(e) => setFromDate(e.target.value)} />
          </label>
          <Button className="checkPlanBtn" variant="contained" size="small" onClick={handleloadPlanStatus}>
            Check Plan
          </Button>
        </div>

        <div className="planStatusTable">{planStatusDataAGTable}</div>
      </div>
    </div>
  );
};

export default PlanManagerStatusTab;

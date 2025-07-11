import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import "./KPI_NVSX.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import AGTable from "../../../components/DataTable/AGTable";
import Swal from "sweetalert2";
import { Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { SX_KPI_NV_DATA } from "../../qlsx/QLSXPLAN/interfaces/khsxInterface";
import { f_load_SX_NV_KPI_DATA_Daily, f_load_SX_NV_KPI_DATA_Monthly, f_load_SX_NV_KPI_DATA_Weekly, f_load_SX_NV_KPI_DATA_Yearly } from "../../qlsx/QLSXPLAN/utils/khsxUtils";
const KPI_NVSX = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const {register,handleSubmit,watch, formState:{errors}} = useForm()
  const [kpinvsxdata, setKPI_NVSXData] = useState<SX_KPI_NV_DATA[]>([]);
  const columns_kpinvsx_daily = useMemo(() => {
    return [
      { field: "id", headerName: "ID", width: 30 },
      { field: "INS_EMPL", headerName: "INS_EMPL", width: 60 },
      { field: "SX_DATE", headerName: "SX_DATE", width: 60 },
      { field: "SX_YEAR", headerName: "SX_YEAR", width: 60 },
      { field: "SX_WEEK", headerName: "SX_WEEK", width: 60 },
      { field: "SX_MONTH", headerName: "SX_MONTH", width: 60 },
      { field: "SX_YW", headerName: "SX_YW", width: 60 },
      { field: "SX_YM", headerName: "SX_YM", width: 60 },
      {
        field: "PLAN_MET",
        headerName: "PLAN_MET",
        width: 90,
        cellRenderer: (params: any) => {
          return (
            <span style={{ color: "#1f67ec" }}>
              {params.value?.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              m
            </span>
          );
        },
      },
      {
        field: "PLAN_QTY",
        headerName: "PLAN_QTY",
        width: 90,
        cellRenderer: (params: any) => {
          return (
            <span style={{ color: "#df0000" }}>
              {params.value?.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              EA
            </span>
          );
        },
      },
      {
        field: "OUTPUT_M_LT",
        headerName: "OUTPUT_M_LT",
        width: 90,
        cellRenderer: (params: any) => {
          return (
            <span style={{ color: "#079413" }}>
              {params.value?.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              m
            </span>
          );
        },
      },
      {
        field: "OUTPUT_M_TT",
        headerName: "OUTPUT_M_TT",
        width: 90,
        cellRenderer: (params: any) => {
          return (
            <span style={{ color: "#1f67ec" }}>
              {params.value?.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              m
            </span>
          );
        },
      },
      {
        field: "OUTPUT_EA_LT",
        headerName: "OUTPUT_EA_LT",
        width: 90,
        cellRenderer: (params: any) => {
          return (
            <span style={{ color: "#1f67ec" }}>
              {params.value?.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              EA
            </span>
          );
        },
      },
      {
        field: "OUTPUT_EA_TT",
        headerName: "OUTPUT_EA_TT",
        width: 90,
        cellRenderer: (params: any) => {
          return (
            <span style={{ color: "#079413" }}>
              {params.value?.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              EA
            </span>
          );
        },
      },
      {
        field: "RATE_M",
        headerName: "RATE_M",
        width: 90,
        cellRenderer: (params: any) => {
          return (
            <span style={{ color: "#1f67ec" }}>
              {params.value?.toLocaleString("en-US", {
                style: "percent",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              %
            </span>
          );
        },
      },
      {
        field: "RATE_EA",
        headerName: "RATE_EA",
        width: 90,
        cellRenderer: (params: any) => {
          return (
            <span style={{ color: "#079413" }}>
              {params.value?.toLocaleString("en-US", {
                style: "percent",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              %
            </span>
          );
        },
      },
    ];
  }, []);
  const columns_kpinvsx_weekly = useMemo(() => {
    return [
      { field: "id", headerName: "ID", width: 30 },
      { field: "INS_EMPL", headerName: "INS_EMPL", width: 60 },
      { field: "SX_YEAR", headerName: "SX_YEAR", width: 60 },
      { field: "SX_WEEK", headerName: "SX_WEEK", width: 60 },
      { field: "SX_YW", headerName: "SX_YW", width: 60 },
      {
        field: "PLAN_MET",
        headerName: "PLAN_MET",
        width: 90,
        cellRenderer: (params: any) => {
          return (
            <span style={{ color: "#1f67ec" }}>
              {params.value?.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              m
            </span>
          );
        },
      },
      {
        field: "PLAN_QTY",
        headerName: "PLAN_QTY",
        width: 90,
        cellRenderer: (params: any) => {
          return (
            <span style={{ color: "#df0000" }}>
              {params.value?.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              EA
            </span>
          );
        },
      },
      {
        field: "OUTPUT_M_LT",
        headerName: "OUTPUT_M_LT",
        width: 90,
        cellRenderer: (params: any) => {
          return (
            <span style={{ color: "#079413" }}>
              {params.value?.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              m
            </span>
          );
        },
      },
      {
        field: "OUTPUT_M_TT",
        headerName: "OUTPUT_M_TT",
        width: 90,
        cellRenderer: (params: any) => {
          return (
            <span style={{ color: "#1f67ec" }}>
              {params.value?.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              m
            </span>
          );
        },
      },
      {
        field: "OUTPUT_EA_LT",
        headerName: "OUTPUT_EA_LT",
        width: 90,
        cellRenderer: (params: any) => {
          return (
            <span style={{ color: "#1f67ec" }}>
              {params.value?.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              EA
            </span>
          );
        },
      },
      {
        field: "OUTPUT_EA_TT",
        headerName: "OUTPUT_EA_TT",
        width: 90,
        cellRenderer: (params: any) => {
          return (
            <span style={{ color: "#079413" }}>
              {params.value?.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              EA
            </span>
          );
        },
      },
      {
        field: "RATE_M",
        headerName: "RATE_M",
        width: 90,
        cellRenderer: (params: any) => {
          return (
            <span style={{ color: "#1f67ec" }}>
              {params.value?.toLocaleString("en-US", {
                style: "percent",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              %
            </span>
          );
        },
      },
      {
        field: "RATE_EA",
        headerName: "RATE_EA",
        width: 90,
        cellRenderer: (params: any) => {
          return (
            <span style={{ color: "#079413" }}>
              {params.value?.toLocaleString("en-US", {
                style: "percent",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              %
            </span>
          );
        },
      },
    ];
  }, []);
  const columns_kpinvsx_monthly = useMemo(() => {
    return [
      { field: "id", headerName: "ID", width: 30 },
      { field: "INS_EMPL", headerName: "INS_EMPL", width: 60 },
      { field: "SX_YEAR", headerName: "SX_YEAR", width: 60 },
      { field: "SX_MONTH", headerName: "SX_MONTH", width: 60 },
      { field: "SX_YM", headerName: "SX_YM", width: 60 },
      {
        field: "PLAN_MET",
        headerName: "PLAN_MET",
        width: 90,
        cellRenderer: (params: any) => {
          return (
            <span style={{ color: "#1f67ec" }}>
              {params.value?.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              m
            </span>
          );
        },
      },
      {
        field: "PLAN_QTY",
        headerName: "PLAN_QTY",
        width: 90,
        cellRenderer: (params: any) => {
          return (
            <span style={{ color: "#df0000" }}>
              {params.value?.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              EA
            </span>
          );
        },
      },
      {
        field: "OUTPUT_M_LT",
        headerName: "OUTPUT_M_LT",
        width: 90,
        cellRenderer: (params: any) => {
          return (
            <span style={{ color: "#079413" }}>
              {params.value?.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              m
            </span>
          );
        },
      },
      {
        field: "OUTPUT_M_TT",
        headerName: "OUTPUT_M_TT",
        width: 90,
        cellRenderer: (params: any) => {
          return (
            <span style={{ color: "#1f67ec" }}>
              {params.value?.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              m
            </span>
          );
        },
      },
      {
        field: "OUTPUT_EA_LT",
        headerName: "OUTPUT_EA_LT",
        width: 90,
        cellRenderer: (params: any) => {
          return (
            <span style={{ color: "#1f67ec" }}>
              {params.value?.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              EA
            </span>
          );
        },
      },
      {
        field: "OUTPUT_EA_TT",
        headerName: "OUTPUT_EA_TT",
        width: 90,
        cellRenderer: (params: any) => {
          return (
            <span style={{ color: "#079413" }}>
              {params.value?.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              EA
            </span>
          );
        },
      },
      {
        field: "RATE_M",
        headerName: "RATE_M",
        width: 90,
        cellRenderer: (params: any) => {
          return (
            <span style={{ color: "#1f67ec" }}>
              {params.value?.toLocaleString("en-US", {
                style: "percent",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              %
            </span>
          );
        },
      },
      {
        field: "RATE_EA",
        headerName: "RATE_EA",
        width: 90,
        cellRenderer: (params: any) => {
          return (
            <span style={{ color: "#079413" }}>
              {params.value?.toLocaleString("en-US", {
                style: "percent",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              %
            </span>
          );
        },
      },
    ];
  }, []);
  const columns_kpinvsx_yearly = useMemo(() => {
    return [
      { field: "id", headerName: "ID", width: 30 },
      { field: "INS_EMPL", headerName: "INS_EMPL", width: 60 },
      { field: "SX_YEAR", headerName: "SX_YEAR", width: 60 },
      {
        field: "PLAN_MET",
        headerName: "PLAN_MET",
        width: 90,
        cellRenderer: (params: any) => {
          return (
            <span style={{ color: "#1f67ec" }}>
              {params.value?.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              m
            </span>
          );
        },
      },
      {
        field: "PLAN_QTY",
        headerName: "PLAN_QTY",
        width: 90,
        cellRenderer: (params: any) => {
          return (
            <span style={{ color: "#df0000" }}>
              {params.value?.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              EA
            </span>
          );
        },
      },
      {
        field: "OUTPUT_M_LT",
        headerName: "OUTPUT_M_LT",
        width: 90,
        cellRenderer: (params: any) => {
          return (
            <span style={{ color: "#079413" }}>
              {params.value?.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              m
            </span>
          );
        },
      },
      {
        field: "OUTPUT_M_TT",
        headerName: "OUTPUT_M_TT",
        width: 90,
        cellRenderer: (params: any) => {
          return (
            <span style={{ color: "#1f67ec" }}>
              {params.value?.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              m
            </span>
          );
        },
      },
      {
        field: "OUTPUT_EA_LT",
        headerName: "OUTPUT_EA_LT",
        width: 90,
        cellRenderer: (params: any) => {
          return (
            <span style={{ color: "#1f67ec" }}>
              {params.value?.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              EA
            </span>
          );
        },
      },
      {
        field: "OUTPUT_EA_TT",
        headerName: "OUTPUT_EA_TT",
        width: 90,
        cellRenderer: (params: any) => {
          return (
            <span style={{ color: "#079413" }}>
              {params.value?.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              EA
            </span>
          );
        },
      },
      {
        field: "RATE_M",
        headerName: "RATE_M",
        width: 90,
        cellRenderer: (params: any) => {
          return (
            <span style={{ color: "#1f67ec" }}>
              {params.value?.toLocaleString("en-US", {
                style: "percent",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              %
            </span>
          );
        },
      },
      {
        field: "RATE_EA",
        headerName: "RATE_EA",
        width: 90,
        cellRenderer: (params: any) => {
          return (
            <span style={{ color: "#079413" }}>
              {params.value?.toLocaleString("en-US", {
                style: "percent",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              %
            </span>
          );
        },
      },
    ];
  }, []);
  const [columns, setColumns] = useState(columns_kpinvsx_daily);
  const loss_data_ag_table = useMemo(() => {
    return (
      <AGTable
        showFilter={true}
        toolbar={<div></div>}
        columns={columns}
        data={kpinvsxdata}
        onCellEditingStopped={(params: any) => {}}
        onCellClick={async (params: any) => {
          //setSelectedRows(params.data)
        }}
        onSelectionChange={(params: any) => {
          //console.log(e!.api.getSelectedRows())
        }}
      />
    );
  }, [kpinvsxdata, columns]);
  const handle_loaddatasx = async () => {
    let kq: SX_KPI_NV_DATA[] = [];
    if (watch("option") === "Daily") {
      setColumns(columns_kpinvsx_daily);
      kq = await f_load_SX_NV_KPI_DATA_Daily({
        FROM_DATE: watch("fromdate"),
        TO_DATE: watch("todate"),
      });
    } else if (watch("option") === "Weekly") {
      setColumns(columns_kpinvsx_weekly);
      kq = await f_load_SX_NV_KPI_DATA_Weekly({
        FROM_DATE: watch("fromdate"),
        TO_DATE: watch("todate"),
      });
    } else if (watch("option") === "Monthly") {
      setColumns(columns_kpinvsx_monthly);
      kq = await f_load_SX_NV_KPI_DATA_Monthly({
        FROM_DATE: watch("fromdate"),
        TO_DATE: watch("todate"),
      });
    } else if (watch("option") === "Yearly") {
      setColumns(columns_kpinvsx_yearly);
      kq = await f_load_SX_NV_KPI_DATA_Yearly({
        FROM_DATE: watch("fromdate"),
        TO_DATE: watch("todate"),
      });
    }
    //console.log(kq);
    if (kq.length > 0) {
      Swal.fire("Thông báo", "Đã load : " + kq.length + " dòng", "success");
      setKPI_NVSXData(kq);
    } else {
      Swal.fire("Thông báo", "Không có dữ liệu", "error");
      setKPI_NVSXData([]);
    }
  };
  useEffect(() => {
    return () => {
    };
  }, []);
  return (
    <div className="kpinvsx">
      <div className="tracuuDataInspection">
        <div
          className="tracuuDataInspectionform"
          style={{ backgroundImage: theme.CMS.backgroundImage }}
        >
          <div className="forminput">
            <div className="forminputcolumn">
              <label>
                <b>Từ ngày:</b>
                <input
                  defaultValue={moment().add(-8, "day").format("YYYY-MM-DD")}
                  {...register("fromdate")}
                  type="date"
                />
              </label>
              <label>
                <b>Tới ngày:</b>{" "}
                <input
                  defaultValue={moment().format("YYYY-MM-DD")}
                  {...register("todate")}
                  type="date"
                />
              </label>
              <label>
                <b>Option:</b>
                <select {...register("option")}>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </label>
            </div>
          </div>
          <div className="formbutton">
            <label>
              <b
                style={{
                  color: "#1f67ec",
                  fontWeight: "normal",
                  fontSize: "0.8rem",
                }}
              >
                All Time:
              </b>
              <input {...register("alltime")} type="checkbox" />
            </label>
            <Button onClick={handleSubmit(handle_loaddatasx)}>
              Load Data
            </Button>
          </div>
        </div>
        <div className="tracuuYCSXTable">
          <div className="datatable">{loss_data_ag_table}</div>
        </div>
      </div>
    </div>
  );
};
export default KPI_NVSX;

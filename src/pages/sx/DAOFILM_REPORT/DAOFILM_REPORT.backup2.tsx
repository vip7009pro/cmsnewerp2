import { IconButton } from "@mui/material";
import { CustomCellRendererProps } from "ag-grid-react";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { MdRefresh } from "react-icons/md";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import Swal from "sweetalert2";
import AGTable from "../../../components/DataTable/AGTable";
import {
  DaoFilmReportBackData,
  DaoFilmReportDetailData,
  DaoFilmReportPieData,
  DaoFilmReportQueryPayload,
  DaoFilmReportWidgetData,
  f_loadDaoFilmReportBackData,
  f_loadDaoFilmReportDetailData,
  f_loadDaoFilmReportExportPieData,
  f_loadDaoFilmReportUsagePieData,
  f_loadDaoFilmReportWidgetData,
} from "../utils/daoFilmReportUtils";
import "./DAOFILM_REPORT.scss";

const usageColors = ["#0ea5e9", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];
const exportColors = ["#1d4ed8", "#059669", "#d97706", "#dc2626", "#7c3aed", "#0f766e"];

const defaultWidgetData: DaoFilmReportWidgetData = {
  Total_Knife: 0,
  Total_OK_Knife: 0,
  Total_NG_Knife: 0,
};

const DAOFILM_REPORT = () => {
  const [fromDate, setFromDate] = useState<string>(moment().format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState<string>(moment().format("YYYY-MM-DD"));
  const [useAllTime, setUseAllTime] = useState<boolean>(true);

  const [tableData, setTableData] = useState<DaoFilmReportBackData[]>([]);
  const [detailTableData, setDetailTableData] = useState<DaoFilmReportDetailData[]>([]);
  const [selectedKnife, setSelectedKnife] = useState<{ MA_DAO: string; MA_DAO_KT: string } | null>(
    null,
  );
  const [activePayload, setActivePayload] = useState<DaoFilmReportQueryPayload | null>(null);
  const [widgetData, setWidgetData] = useState<DaoFilmReportWidgetData>(defaultWidgetData);
  const [usagePieData, setUsagePieData] = useState<DaoFilmReportPieData[]>([]);
  const [exportPieData, setExportPieData] = useState<DaoFilmReportPieData[]>([]);

  const buildPayload = (): DaoFilmReportQueryPayload => {
    const today = moment().format("YYYY-MM-DD");

    if (useAllTime) {
      return {
        FROM_DATE: "2020-01-01",
        TO_DATE: today,
        USE_ALL_TIME: true,
      };
    }

    return {
      FROM_DATE: fromDate,
      TO_DATE: toDate,
      USE_ALL_TIME: false,
    };
  };

  const loadData = async () => {
    Swal.fire({
      title: "Tra data",
      text: "Dang tai Dao Film Report",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const payload = buildPayload();
      setActivePayload(payload);
      const [loadedTableData, loadedWidgetData, loadedUsagePieData, loadedExportPieData] =
        await Promise.all([
          f_loadDaoFilmReportBackData(payload),
          f_loadDaoFilmReportWidgetData(payload),
          f_loadDaoFilmReportUsagePieData(payload),
          f_loadDaoFilmReportExportPieData(payload),
        ]);

      setTableData(loadedTableData);
      setDetailTableData([]);
      setSelectedKnife(null);
      setWidgetData(loadedWidgetData);
      setUsagePieData(loadedUsagePieData);
      setExportPieData(loadedExportPieData);

      Swal.fire("Thong bao", `Da load ${loadedTableData.length} dong`, "success");
    } catch (error: any) {
      setTableData([]);
      setDetailTableData([]);
      setSelectedKnife(null);
      setActivePayload(null);
      setWidgetData(defaultWidgetData);
      setUsagePieData([]);
      setExportPieData([]);
      Swal.fire("Thong bao", `Loi: ${error?.message ?? error}`, "error");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalUsagePie = useMemo(() => {
    return usagePieData.reduce((sum, item) => sum + item.value, 0);
  }, [usagePieData]);

  const totalExportPie = useMemo(() => {
    return exportPieData.reduce((sum, item) => sum + item.value, 0);
  }, [exportPieData]);

  const colDefs = useMemo(() => {
    return [
      {
        field: "STT",
        headerName: "STT",
        width: 60,
        resizable: true,
        pinned: "left",
      },
      {
        field: "MA_DAO",
        headerName: "MA_DAO",
        width: 130,
        resizable: true,
        floatingFilter: true,
        filter: true,
      },
      {
        field: "MA_DAO_KT",
        headerName: "MA_DAO_KT",
        width: 140,
        resizable: true,
        floatingFilter: true,
        filter: true,
      },
      {
        field: "StandardQty",
        headerName: "STANDARD",
        width: 110,
        resizable: true,
        floatingFilter: true,
        filter: true,
        cellRenderer: (params: CustomCellRendererProps<DaoFilmReportBackData>) => (
          <span style={{ color: "#1d4ed8", fontWeight: "bold" }}>
            {(params.data?.StandardQty ?? 0).toLocaleString("en-US")}
          </span>
        ),
      },
      {
        field: "TotalPress",
        headerName: "TOTAL_PRESS",
        width: 120,
        resizable: true,
        floatingFilter: true,
        filter: true,
        cellRenderer: (params: CustomCellRendererProps<DaoFilmReportBackData>) => {
          const overPress = (params.data?.TotalPress ?? 0) >= (params.data?.StandardQty ?? 0);
          return (
            <span style={{ color: overPress ? "#dc2626" : "#0f766e", fontWeight: "bold" }}>
              {(params.data?.TotalPress ?? 0).toLocaleString("en-US")}
            </span>
          );
        },
      },
      {
        field: "ExportCount",
        headerName: "EXPORT_COUNT",
        width: 120,
        resizable: true,
        floatingFilter: true,
        filter: true,
        cellRenderer: (params: CustomCellRendererProps<DaoFilmReportBackData>) => (
          <span style={{ color: "#475569", fontWeight: "bold" }}>
            {(params.data?.ExportCount ?? 0).toLocaleString("en-US")}
          </span>
        ),
      },
      {
        field: "NGAY_BAN_GIAO",
        headerName: "NGAY_BAN_GIAO",
        width: 130,
        resizable: true,
        floatingFilter: true,
        filter: true,
      },
      {
        field: "OVER_STATUS",
        headerName: "OVER",
        width: 90,
        resizable: true,
        floatingFilter: true,
        filter: true,
        cellRenderer: (params: CustomCellRendererProps<DaoFilmReportBackData>) => {
          const status = params.data?.OVER_STATUS ?? "";
          return (
            <span style={{ fontWeight: "bold", color: status === "OK" ? "#0f766e" : "#dc2626" }}>
              {status}
            </span>
          );
        },
        cellStyle: (params: any) => {
          if (params.data?.OVER_STATUS === "OK") {
            return { backgroundColor: "#dcfce7" };
          }
          return { backgroundColor: "#fee2e2" };
        },
      },
      {
        field: "OVER_PERCENTAGE",
        headerName: "OVER_%",
        width: 100,
        resizable: true,
        floatingFilter: true,
        filter: true,
        cellRenderer: (params: CustomCellRendererProps<DaoFilmReportBackData>) => {
          const value = params.data?.OVER_PERCENTAGE ?? 0;
          return (
            <span style={{ color: value >= 100 ? "#dc2626" : "#1d4ed8", fontWeight: "bold" }}>
              {value.toFixed(2)}%
            </span>
          );
        },
      },
    ];
  }, []);

  const detailColDefs = useMemo(() => {
    return [
      {
        field: "MA_DAO",
        headerName: "MA_DAO",
        width: 100,
        resizable: true,
        floatingFilter: true,
        filter: true,
      },
      {
        field: "MA_DAO_KT",
        headerName: "MA_DAO_KT",
        width: 100,
        resizable: true,
        floatingFilter: true,
        filter: true,
      },
      {
        field: "G_CODE",
        headerName: "CODE",
        width: 60,
        resizable: true,
        floatingFilter: true,
        filter: true,
      },
      {
        field: "G_NAME",
        headerName: "CODE_NAME",
        width: 100,
        resizable: true,
        floatingFilter: true,
        filter: true,
      },
      {
        field: "PD",
        headerName: "PD",
        width: 40,
        resizable: true,
        floatingFilter: true,
        filter: true,
      },
      {
        field: "CAVITY",
        headerName: "CAVITY",
        width: 50,
        resizable: true,
        floatingFilter: true,
        filter: true,
      },
      {
        field: "QTY",
        headerName: "QTY",
        width: 30,
        resizable: true,
        floatingFilter: true,
        filter: true,
        cellRenderer: (params: CustomCellRendererProps<DaoFilmReportDetailData>) => (
          <span style={{ color: "#1d4ed8", fontWeight: "bold" }}>
            {(params.data?.QTY ?? 0).toLocaleString("en-US")}
          </span>
        ),
      },
      {
        field: "PRESS_QTY",
        headerName: "PRESS_QTY",
        width: 60,
        resizable: true,
        floatingFilter: true,
        filter: true,
        cellRenderer: (params: CustomCellRendererProps<DaoFilmReportDetailData>) => (
          <span style={{ color: "#0f766e", fontWeight: "bold" }}>
            {(params.data?.PRESS_QTY ?? 0).toLocaleString("en-US")}
          </span>
        ),
      },
      {
        field: "EMPL_NO",
        headerName: "EMPL_NO",
        width: 50,
        resizable: true,
        floatingFilter: true,
        filter: true,
      },
      {
        field: "SX_EMPL",
        headerName: "SX_EMPL",
        width: 50,
        resizable: true,
        floatingFilter: true,
        filter: true,
      },
      {
        field: "SX_DATE",
        headerName: "SX_DATE",
        width: 50,
        resizable: true,
        floatingFilter: true,
        filter: true,
      },
      {
        field: "PLAN_ID",
        headerName: "PLAN_ID",
        width: 50,
        resizable: true,
        floatingFilter: true,
        filter: true,
      },
    ];
  }, []);

  const loadDetailDataByRow = async (row: DaoFilmReportBackData) => {
    const selectedMA_DAO = row?.MA_DAO ?? "";
    const selectedMA_DAO_KT = row?.MA_DAO_KT ?? "";

    if (selectedMA_DAO === "" || selectedMA_DAO_KT === "") {
      setSelectedKnife(null);
      setDetailTableData([]);
      return;
    }

    setSelectedKnife({ MA_DAO: selectedMA_DAO, MA_DAO_KT: selectedMA_DAO_KT });

    try {
      const payload = {
        ...(activePayload ?? buildPayload()),
        MA_DAO: selectedMA_DAO,
        MA_DAO_KT: selectedMA_DAO_KT,
      };
      const loadedDetailData = await f_loadDaoFilmReportDetailData(payload);
      setDetailTableData(loadedDetailData);
    } catch (error: any) {
      setDetailTableData([]);
      Swal.fire("Thong bao", `Loi tai bang chi tiet: ${error?.message ?? error}`, "error");
    }
  };

  const handleBackDataRowClick = (params: any) => {
    const clickedRow = params?.data as DaoFilmReportBackData | undefined;
    if (!clickedRow) {
      setSelectedKnife(null);
      setDetailTableData([]);
      return;
    }
    loadDetailDataByRow(clickedRow);
  };

  const renderPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="daoFilmPieTooltip">
          <p>{payload[0].name}</p>
          <p>{`${Number(payload[0].value ?? 0).toLocaleString("en-US")} dao`}</p>
        </div>
      );
    }
    return null;
  };

  const renderPieLabel = (props: any) => {
    const { cx, cy, midAngle, outerRadius, name, percent, value, fill } = props;
    const RADIAN = Math.PI / 180;
    const startX = cx + outerRadius * Math.cos(-midAngle * RADIAN);
    const startY = cy + outerRadius * Math.sin(-midAngle * RADIAN);
    const endX = cx + (outerRadius + 14) * Math.cos(-midAngle * RADIAN);
    const endY = cy + (outerRadius + 14) * Math.sin(-midAngle * RADIAN);
    const textX = cx + (outerRadius + 30) * Math.cos(-midAngle * RADIAN);
    const textY = cy + (outerRadius + 30) * Math.sin(-midAngle * RADIAN);
    const isRightSide = textX > cx;
    const anchor = isRightSide ? "start" : "end";
    const lineEndX = isRightSide ? textX - 6 : textX + 6;

    const knifeCount = Number(value) || 0;
    const ratio = ((Number(percent) || 0) * 100).toFixed(0);

    return (
      <g>
        <path
          d={`M${startX},${startY}L${endX},${endY}L${lineEndX},${textY}`}
          stroke={fill}
          strokeWidth={1}
          fill="none"
        />
        <text
          x={textX}
          y={textY}
          fill={fill}
          textAnchor={anchor}
          dominantBaseline="central"
          fontSize="0.72rem"
          fontWeight={700}
        >
          {`${name}: ${knifeCount.toLocaleString("en-US")} dao (${ratio}%)`}
        </text>
      </g>
    );
  };

  return (
    <div className="daoFilmReport">
      <div className="daoFilmReportTop">
        <div className="daoFilmWidgetColumn">
          <div className="daoFilmWidgetCard total">
            <span className="widgetTitle">Tổng số dao / 총 칼 수량</span>
            <span className="widgetValue">{widgetData.Total_Knife.toLocaleString("en-US")}</span>
          </div>

          <div className="daoFilmWidgetCard ok">
            <span className="widgetTitle">Số dao OK / OK 칼 수량</span>
            <span className="widgetValue">{widgetData.Total_OK_Knife.toLocaleString("en-US")}</span>
          </div>

          <div className="daoFilmWidgetCard ng">
            <span className="widgetTitle">Số dao NG (Over) / Over 칼 수량</span>
            <span className="widgetValue">{widgetData.Total_NG_Knife.toLocaleString("en-US")}</span>
          </div>
        </div>

        <div className="daoFilmPieCard">
          <div className="daoFilmPieTitle">Tỉ trọng số dao theo % sử dụng / %사용 에 따른 칼 수량의 비중 </div>
          <div className="daoFilmPieSummary">Tong: {totalUsagePie.toLocaleString("en-US")} dao</div>
          <div className="daoFilmPieBody">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={renderPieTooltip} />
                <Pie
                  data={usagePieData}
                  dataKey="value"
                  nameKey="name"
                  isAnimationActive={false}
                  outerRadius={95}
                  labelLine={false}
                  label={renderPieLabel}
                >
                  {usagePieData.map((entry, index) => (
                    <Cell key={`usage-${entry.name}-${index}`} fill={usageColors[index % usageColors.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="daoFilmPieCard">
          <div className="daoFilmPieTitle">Tỉ trọng số dao theo số lần xuất / 출고 횟수에 따른 비중</div>
          <div className="daoFilmPieSummary">Tổng: {totalExportPie.toLocaleString("en-US")} dao</div>
          <div className="daoFilmPieBody">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={renderPieTooltip} />
                <Pie
                  data={exportPieData}
                  dataKey="value"
                  nameKey="name"
                  isAnimationActive={false}
                  outerRadius={95}
                  labelLine={false}
                  label={renderPieLabel}
                >
                  {exportPieData.map((entry, index) => (
                    <Cell key={`export-${entry.name}-${index}`} fill={exportColors[index % exportColors.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="daoFilmReportBottom">
        <div className="daoFilmBackTablePanel">
          <AGTable
            showFilter={true}
            toolbar={
              <div className="daoFilmReportToolbar">
                <div className="daoFilmToolbarTitle">DAO FILM REPORT</div>

                <label>
                  <span>Tu ngay</span>
                  <input
                    type="date"
                    value={fromDate}
                    disabled={useAllTime}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </label>

                <label>
                  <span>Toi ngay</span>
                  <input
                    type="date"
                    value={toDate}
                    disabled={useAllTime}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </label>

                <label className="defaultMonthCheckbox">
                  <span>All time (2020-01-01 - now)</span>
                  <input
                    type="checkbox"
                    checked={useAllTime}
                    onChange={(e) => setUseAllTime(e.target.checked)}
                  />
                </label>

                <IconButton className="buttonIcon" onClick={() => loadData()}>
                  <MdRefresh color="#0ea5e9" size={18} />
                  Load Data
                </IconButton>
              </div>
            }
            columns={colDefs}
            data={tableData}
            suppressRowClickSelection={false}
            onRowClick={handleBackDataRowClick}
            onSelectionChange={() => {}}
            onCellEditingStopped={() => {}}
          />
        </div>

        <div className="daoFilmDetailTablePanel">
          <AGTable
            showFilter={true}
            toolbar={
              <div className="daoFilmDetailToolbar">
                <div className="daoFilmToolbarTitle">DAO FILM DETAIL</div>
                <div className="daoFilmSelectedKnife">
                  {selectedKnife
                    ? `${selectedKnife.MA_DAO} | ${selectedKnife.MA_DAO_KT}`
                    : "Click 1 dong o bang backdata de xem chi tiet"}
                </div>
              </div>
            }
            columns={detailColDefs}
            data={detailTableData}
            onSelectionChange={() => {}}
            onCellEditingStopped={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default DAOFILM_REPORT;

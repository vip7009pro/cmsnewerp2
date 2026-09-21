import React, { useCallback, useMemo } from "react";
import AGTable from "../../../../components/DataTable/AGTable";
import { useDataSxData } from "./PrecisionDataSx/useDataSxData";
import { PrecisionDataSxHeader } from "./PrecisionDataSx/PrecisionDataSxHeader";
import { PrecisionDataSxToolbar } from "./PrecisionDataSx/PrecisionDataSxToolbar";
import { PrecisionDataSxSummary } from "./PrecisionDataSx/PrecisionDataSxSummary";
import { PrecisionDataSxTracking } from "./PrecisionDataSx/PrecisionDataSxTracking";
import { lazyOpenable } from "../../../../components/PivotChart/lazyOpenable";
// Pivot modal chỉ nạp ĐỘNG khi mở (module kéo theo DevExtreme) — xem lazyOpenable.tsx.
// Lưu ý: modal này dùng prop "open" (không phải "isOpen").
const PrecisionDataSxPivotModal = lazyOpenable(() =>
  import("./PrecisionDataSx/PrecisionDataSxPivotModal").then(
    (m) => m.PrecisionDataSxPivotModal,
  ),
  "open",
);
import { column_datasx_chithi } from "./PrecisionDataSx/PrecisionDataSxColumnsChiThi";
import { column_datasx_ycsx } from "./PrecisionDataSx/PrecisionDataSxColumnsYcsx";
import {
  column_daily_datasx_ycsx,
  column_inputlieudatatable,
  column_nhapkhoaotable,
} from "./PrecisionDataSx/PrecisionDataSxColumnsSub";
import "./PrecisionDataSx/PrecisionDataSx.scss";

const DATASX: React.FC = () => {
  const {
    register,
    watch,
    loading,
    machine_list,
    showhidePivotTable,
    setShowHidePivotTable,
    showhideDailyYCSX,
    setShowHideDailyYCSX,
    inputlieudatatable,
    khoaodata,
    losstableinfo,
    selectbutton,
    datasxtable,
    dailyycsx,
    totalDailyYCSX,
    selectedYCSX,
    selectedDataSource,
    handle_loaddatasx,
    handle_loaddatasxYCSX,
    handleRowClickChiThi,
    handleRowClickXuatLieu,
    handleRowClickYcsx,
  } = useDataSxData();

  const fullSummary = watch("fullSummary");

  const getDailyRowStyle = useCallback((params: any) => {
    if (params?.data?.PLAN_DATE === "TOTAL") {
      return { backgroundColor: "#fef9c3", fontWeight: "bold" };
    }
    return null;
  }, []);

  // 1. AGTable Chi Thị
  const tableChiThi = useMemo(
    () => (
      <AGTable
        columns={column_datasx_chithi}
        data={datasxtable}
        onRowClick={handleRowClickChiThi}
      />
    ),
    [datasxtable, handleRowClickChiThi]
  );

  // 2. AGTable Lịch Sử Xuất Liệu (Sub bảng 1 khi xem Chỉ Thị)
  const tableXuatLieu = useMemo(
    () => (
      <AGTable
        columns={column_inputlieudatatable}
        data={inputlieudatatable}
        onRowClick={handleRowClickXuatLieu}
      />
    ),
    [inputlieudatatable, handleRowClickXuatLieu]
  );

  // 3. AGTable Kho Ảo (Sub bảng 2 khi xem Chỉ Thị)
  const tableKhoAo = useMemo(
    () => (
      <AGTable
        showFilter={true}
        columns={column_nhapkhoaotable}
        data={khoaodata}
      />
    ),
    [khoaodata]
  );

  // 4. AGTable YCSX
  const tableYcsx = useMemo(
    () => (
      <AGTable
        columns={column_datasx_ycsx}
        data={datasxtable}
        onRowClick={handleRowClickYcsx}
      />
    ),
    [datasxtable, handleRowClickYcsx]
  );

  // 5. AGTable Daily YCSX (khi xem chi tiết YCSX)
  const tableDailyYcsx = useMemo(
    () => (
      <AGTable
        getRowStyle={getDailyRowStyle}
        columns={column_daily_datasx_ycsx}
        data={dailyycsx}
      />
    ),
    [dailyycsx, getDailyRowStyle]
  );

  return (
    <div className="precision-datasx-container">
      {/* 1. Header Bar chuẩn Google Stitch */}
      <PrecisionDataSxHeader
        selectbutton={selectbutton}
        rowCount={datasxtable.length}
        showhidePivotTable={showhidePivotTable}
        onTogglePivot={() => setShowHidePivotTable((prev) => !prev)}
        showhideDailyYCSX={showhideDailyYCSX}
        onToggleDetailYCSX={() => setShowHideDailyYCSX((prev) => !prev)}
      />

      {/* 2. Compact Multi-Filter Toolbar */}
      <PrecisionDataSxToolbar
        register={register}
        machineList={machine_list}
        loading={loading}
        onLoadChiThi={handle_loaddatasx}
        onLoadYcsx={handle_loaddatasxYCSX}
        activeMode={selectbutton}
      />

      {/* 3. Summary Table (Bảo tồn nguyên vẹn 100% logic & các trường hao hụt) */}
      <PrecisionDataSxSummary
        losstableinfo={losstableinfo}
        fullSummary={fullSummary}
      />

      {/* 4. Main Grids Content Area */}
      <div className="precision-datasx-content">
        {/* Layout 1: Chế độ TRA CHỈ THỊ (Chia 2 Panes: Trái Chỉ Thị ~75%, Phải 2 bảng Sub ~25%) */}
        {selectbutton && (
          <div className="datasx-pane-chithi">
            <div className="chithi-main-table">{tableChiThi}</div>
            <div className="chithi-sub-tables">
              <div className="sub-table-card">
                <div className="sub-table-header">
                  <span className="sub-title">Lịch Sử Xuất Liệu</span>
                  <span className="sub-count">{inputlieudatatable.length} dòng</span>
                </div>
                <div className="sub-table-body">{tableXuatLieu}</div>
              </div>
              <div className="sub-table-card">
                <div className="sub-table-header">
                  <span className="sub-title">Tồn Kho Ảo</span>
                  <span className="sub-count">{khoaodata.length} dòng</span>
                </div>
                <div className="sub-table-body">{tableKhoAo}</div>
              </div>
            </div>
          </div>
        )}

        {/* Layout 2: Chế độ TRA YCSX (Full width + Drawer Tracking & Daily Details) */}
        {!selectbutton && (
          <div className="datasx-pane-ycsx">
            <div className={`ycsx-main-table ${showhideDailyYCSX ? "collapsed" : ""}`}>
              {tableYcsx}
            </div>

            {showhideDailyYCSX && (
              <div className="ycsx-detail-drawer">
                <div className="drawer-header">
                  <span className="drawer-title">
                    CHI TIẾT TIẾN ĐỘ &amp; HAO HỤT YCSX: {selectedYCSX.current.PROD_REQUEST_NO || "---"}
                  </span>
                </div>
                <div className="drawer-body">
                  <div className="tracking-side">
                    <PrecisionDataSxTracking
                      selectedYCSX={selectedYCSX.current}
                      totalDailyYCSX={totalDailyYCSX}
                    />
                  </div>
                  <div className="daily-side">
                    <div className="daily-side-header">
                      <span>TIẾN ĐỘ SẢN XUẤT THEO NGÀY</span>
                    </div>
                    <div className="daily-side-body">{tableDailyYcsx}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5. Modal Phân tích đa chiều Pivot Table */}
      <PrecisionDataSxPivotModal
        open={showhidePivotTable}
        onClose={() => setShowHidePivotTable(false)}
        dataSource={selectedDataSource}
        tableID="datasxtablepivot"
      />
    </div>
  );
};

export default DATASX;

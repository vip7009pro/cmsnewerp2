import React, { useCallback, useMemo, useState } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { FiChevronDown, FiChevronUp, FiX, FiBarChart2, FiCalendar } from "react-icons/fi";
import AGTable from "../../../../components/DataTable/AGTable";
import { useDataSxData } from "./PrecisionDataSx/useDataSxData";
import { PrecisionDataSxHeader } from "./PrecisionDataSx/PrecisionDataSxHeader";
import { PrecisionDataSxToolbar } from "./PrecisionDataSx/PrecisionDataSxToolbar";
import { PrecisionDataSxSummary } from "./PrecisionDataSx/PrecisionDataSxSummary";
import { PrecisionDataSxTracking } from "./PrecisionDataSx/PrecisionDataSxTracking";
import { PrecisionDataSxMobileToolbar } from "./PrecisionDataSx/PrecisionDataSxMobileToolbar";
import { PrecisionDataSxMobileFilterDrawer } from "./PrecisionDataSx/PrecisionDataSxMobileFilterDrawer";
import { SaveExcel } from "../../../../api/services/excelService";
import useIsMobile from "../../../../components/Navbar/AccountInfo/useIsMobile";
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
  const isMobile = useIsMobile();

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
    setValue,
    reset,
    handle_loaddatasx,
    handle_loaddatasxYCSX,
    handleRowClickChiThi,
    handleRowClickXuatLieu,
    handleRowClickYcsx,
  } = useDataSxData();

  const fullSummary = watch("fullSummary");

  // Mobile local state
  const [quickSearchText, setQuickSearchText] = useState<string>("");
  const [showMobileFilterDrawer, setShowMobileFilterDrawer] = useState<boolean>(false);
  const [showMobileLossSummary, setShowMobileLossSummary] = useState<boolean>(false);
  const [mobileChithiTab, setMobileChithiTab] = useState<"chithi" | "xuatlieu" | "khoao">("chithi");
  const [mobileYcsxDetailTab, setMobileYcsxDetailTab] = useState<"tracking" | "daily">("tracking");

  // Lọc dữ liệu nhanh bằng ô Quick Search
  const filteredDataSxTable = useMemo(() => {
    if (!quickSearchText.trim()) return datasxtable;
    const kw = quickSearchText.toLowerCase().trim();
    return datasxtable.filter((row: any) => {
      return (
        (row.PLAN_ID && String(row.PLAN_ID).toLowerCase().includes(kw)) ||
        (row.PROD_REQUEST_NO && String(row.PROD_REQUEST_NO).toLowerCase().includes(kw)) ||
        (row.G_NAME && String(row.G_NAME).toLowerCase().includes(kw)) ||
        (row.G_NAME_KD && String(row.G_NAME_KD).toLowerCase().includes(kw)) ||
        (row.G_CODE && String(row.G_CODE).toLowerCase().includes(kw)) ||
        (row.M_NAME && String(row.M_NAME).toLowerCase().includes(kw)) ||
        (row.M_CODE && String(row.M_CODE).toLowerCase().includes(kw)) ||
        (row.M_LOT_NO && String(row.M_LOT_NO).toLowerCase().includes(kw)) ||
        (row.PLAN_EQ && String(row.PLAN_EQ).toLowerCase().includes(kw))
      );
    });
  }, [datasxtable, quickSearchText]);

  // Đếm số điều kiện lọc tùy chỉnh đang áp dụng (để hiển thị badge trên mobile)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (watch("alltime")) count++;
    if (watch("prodrequestno")?.trim()) count++;
    if (watch("plan_id")?.trim()) count++;
    if (watch("codeKD")?.trim()) count++;
    if (watch("codeCMS")?.trim()) count++;
    if (watch("m_name")?.trim()) count++;
    if (watch("m_code")?.trim()) count++;
    if (watch("factory") && watch("factory") !== "ALL") count++;
    if (watch("machine") && watch("machine") !== "ALL") count++;
    if (watch("onlyClose")) count++;
    if (watch("truSample") === false) count++;
    return count;
  }, [watch]);

  // Đặt lại toàn bộ bộ lọc
  const handleResetFilter = useCallback(() => {
    reset({
      fromdate: moment().format("YYYY-MM-DD"),
      todate: moment().format("YYYY-MM-DD"),
      prodrequestno: "",
      plan_id: "",
      m_name: "",
      m_code: "",
      codeKD: "",
      codeCMS: "",
      factory: "ALL",
      machine: "ALL",
      truSample: true,
      onlyClose: false,
      fullSummary: false,
      alltime: false,
    });
    setQuickSearchText("");
  }, [reset]);

  // Xuất Excel
  const handleExportExcel = useCallback(() => {
    const exportList = filteredDataSxTable.length > 0 ? filteredDataSxTable : datasxtable;
    if (!exportList || exportList.length === 0) {
      Swal.fire("Thông báo", "Không có dữ liệu để xuất Excel", "warning");
      return;
    }
    const name = selectbutton ? "DataSX_ChiThi" : "DataSX_YCSX";
    SaveExcel(exportList, `${name}_${moment().format("YYYYMMDD_HHmmss")}`);
  }, [filteredDataSxTable, datasxtable, selectbutton]);

  // Sự kiện chạm dòng trên Mobile: tự động chuyển tab tương ứng để xem ngay
  const handleMobileRowClickChiThi = useCallback(
    (e: any) => {
      handleRowClickChiThi(e);
      setMobileChithiTab("xuatlieu");
    },
    [handleRowClickChiThi]
  );

  const handleMobileRowClickXuatLieu = useCallback(
    (e: any) => {
      handleRowClickXuatLieu(e);
      setMobileChithiTab("khoao");
    },
    [handleRowClickXuatLieu]
  );

  const handleMobileRowClickYcsx = useCallback(
    (e: any) => {
      handleRowClickYcsx(e);
      setShowHideDailyYCSX(true);
    },
    [handleRowClickYcsx, setShowHideDailyYCSX]
  );

  const getDailyRowStyle = useCallback((params: any) => {
    if (params?.data?.PLAN_DATE === "TOTAL") {
      return { backgroundColor: "#fef9c3", fontWeight: "bold" };
    }
    return null;
  }, []);

  // 1. AGTable Chỉ Thị
  const tableChiThi = useMemo(
    () => (
      <AGTable
        toolbar={<></>}
        showFilter={true}
        columns={column_datasx_chithi}
        data={filteredDataSxTable}
        onRowClick={isMobile ? handleMobileRowClickChiThi : handleRowClickChiThi}
      />
    ),
    [filteredDataSxTable, isMobile, handleMobileRowClickChiThi, handleRowClickChiThi]
  );

  // 2. AGTable Lịch Sử Xuất Liệu (Sub bảng 1 khi xem Chỉ Thị)
  const tableXuatLieu = useMemo(
    () => (
      <AGTable
        columns={column_inputlieudatatable}
        data={inputlieudatatable}
        onRowClick={isMobile ? handleMobileRowClickXuatLieu : handleRowClickXuatLieu}
      />
    ),
    [inputlieudatatable, isMobile, handleMobileRowClickXuatLieu, handleRowClickXuatLieu]
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
        toolbar={<></>}
        columns={column_datasx_ycsx}
        data={filteredDataSxTable}
        onRowClick={isMobile ? handleMobileRowClickYcsx : handleRowClickYcsx}
      />
    ),
    [filteredDataSxTable, isMobile, handleMobileRowClickYcsx, handleRowClickYcsx]
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
    <div className={`precision-datasx-container ${isMobile ? "is-mobile" : ""}`}>
      {/* ===================== KHỐI DESKTOP: BẢO TOÀN NGUYÊN VẸN 100% ===================== */}
      {!isMobile && (
        <PrecisionDataSxHeader
          selectbutton={selectbutton}
          rowCount={datasxtable.length}
          showhidePivotTable={showhidePivotTable}
          onTogglePivot={() => setShowHidePivotTable((prev) => !prev)}
          showhideDailyYCSX={showhideDailyYCSX}
          onToggleDetailYCSX={() => setShowHideDailyYCSX((prev) => !prev)}
        />
      )}

      {!isMobile && (
        <PrecisionDataSxToolbar
          register={register}
          machineList={machine_list}
          loading={loading}
          onLoadChiThi={handle_loaddatasx}
          onLoadYcsx={handle_loaddatasxYCSX}
          activeMode={selectbutton}
        />
      )}

      {!isMobile && (
        <PrecisionDataSxSummary
          losstableinfo={losstableinfo}
          fullSummary={fullSummary}
        />
      )}

      {/* ===================== KHỐI MOBILE: CÔNG THÁI HỌC THÍCH ỨNG ===================== */}
      {isMobile && (
        <PrecisionDataSxMobileToolbar
          quickSearchText={quickSearchText}
          onQuickSearchChange={setQuickSearchText}
          onClearSearch={() => setQuickSearchText("")}
          onLoadChiThi={handle_loaddatasx}
          onLoadYcsx={handle_loaddatasxYCSX}
          activeMode={selectbutton}
          loading={loading}
          onOpenFilterDrawer={() => setShowMobileFilterDrawer(true)}
          activeFilterCount={activeFilterCount}
          totalRecords={datasxtable.length}
          filteredRecords={filteredDataSxTable.length}
          allTime={watch("alltime")}
          onAllTimeChange={(val) => setValue("alltime", val)}
          truSample={watch("truSample")}
          onTruSampleChange={(val) => setValue("truSample", val)}
          fullSummary={fullSummary}
          onFullSummaryChange={(val) => setValue("fullSummary", val)}
          showLossSummary={showMobileLossSummary}
          onToggleLossSummary={() => setShowMobileLossSummary((prev) => !prev)}
          onOpenPivot={() => setShowHidePivotTable(true)}
          showhideDailyYCSX={showhideDailyYCSX}
          onToggleDetailYCSX={() => setShowHideDailyYCSX((prev) => !prev)}
          onExportExcel={handleExportExcel}
          onReset={handleResetFilter}
        />
      )}

      {/* Dải chỉ số Loss tinh gọn trên Mobile */}
      {isMobile && (
        <div className="mobile-loss-summary-bar">
          <div className="loss-indicators-left">
            <span className="loss-pill primary">
              INS/SCN: {(losstableinfo.LOSS_INS_OUT_VS_SCANNED_EA * 100).toFixed(1)}%
            </span>
            <span className="loss-pill danger">
              INS/XK: {(losstableinfo.LOSS_INS_OUT_VS_XUATKHO_EA * 100).toFixed(1)}%
            </span>
          </div>
          <button
            type="button"
            className="btn-toggle-summary"
            onClick={() => setShowMobileLossSummary((prev) => !prev)}
          >
            <span>{showMobileLossSummary ? "Thu Gọn" : "Bảng Chi Tiết"}</span>
            {showMobileLossSummary ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />}
          </button>
        </div>
      )}

      {/* Bảng tổng hợp hao hụt mở rộng trên Mobile (nếu bật) */}
      {isMobile && showMobileLossSummary && (
        <div className="mobile-expanded-summary">
          <PrecisionDataSxSummary
            losstableinfo={losstableinfo}
            fullSummary={fullSummary}
          />
        </div>
      )}

      {/* ===================== KHUNG HIỂN THỊ DỮ LIỆU CHÍNH ===================== */}
      {/* 1. Trên Desktop: Giữ nguyên bố cục chia Panes và Drawers chuẩn ban đầu */}
      {!isMobile && (
        <div className="precision-datasx-content">
          {/* Layout 1: Chế độ TRA CHỈ THỊ (Trái Chỉ Thị ~75%, Phải 2 bảng Sub ~25%) */}
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
      )}

      {/* 2. Trên Mobile: Tối đa hóa diện tích AGTable qua Tab Bar công thái học */}
      {isMobile && (
        <div className="mobile-grid-area">
          {/* Chế độ TRA CHỈ THỊ: Tab Bar 3 bảng độc lập */}
          {selectbutton && (
            <>
              <div className="mobile-chithi-tab-bar">
                <button
                  type="button"
                  className={`mobile-tab-btn ${mobileChithiTab === "chithi" ? "is-active" : ""}`}
                  onClick={() => setMobileChithiTab("chithi")}
                >
                  <span>Chỉ Thị</span>
                  <span className="tab-count-badge">{filteredDataSxTable.length}</span>
                </button>
                <button
                  type="button"
                  className={`mobile-tab-btn ${mobileChithiTab === "xuatlieu" ? "is-active" : ""}`}
                  onClick={() => setMobileChithiTab("xuatlieu")}
                >
                  <span>Xuất Liệu</span>
                  <span className="tab-count-badge">{inputlieudatatable.length}</span>
                </button>
                <button
                  type="button"
                  className={`mobile-tab-btn ${mobileChithiTab === "khoao" ? "is-active" : ""}`}
                  onClick={() => setMobileChithiTab("khoao")}
                >
                  <span>Kho Ảo</span>
                  <span className="tab-count-badge">{khoaodata.length}</span>
                </button>
              </div>

              <div style={{ flex: 1, minHeight: 0, height: "100%" }}>
                {mobileChithiTab === "chithi" && tableChiThi}
                {mobileChithiTab === "xuatlieu" && tableXuatLieu}
                {mobileChithiTab === "khoao" && tableKhoAo}
              </div>
            </>
          )}

          {/* Chế độ TRA YCSX: AGTable YCSX + Drawer Chi Tiết */}
          {!selectbutton && (
            <>
              <div style={{ flex: showhideDailyYCSX ? 0.45 : 1, minHeight: 0, height: "100%" }}>
                {tableYcsx}
              </div>

              {showhideDailyYCSX && (
                <div className="mobile-ycsx-drawer">
                  <div className="mobile-ycsx-drawer-header">
                    <div className="drawer-sub-tabs">
                      <button
                        type="button"
                        className={`sub-tab-btn ${mobileYcsxDetailTab === "tracking" ? "is-active" : ""}`}
                        onClick={() => setMobileYcsxDetailTab("tracking")}
                      >
                        <FiBarChart2 size={12} style={{ marginRight: 4 }} />
                        <span>Hao Hụt Tracking</span>
                      </button>
                      <button
                        type="button"
                        className={`sub-tab-btn ${mobileYcsxDetailTab === "daily" ? "is-active" : ""}`}
                        onClick={() => setMobileYcsxDetailTab("daily")}
                      >
                        <FiCalendar size={12} style={{ marginRight: 4 }} />
                        <span>Tiến Độ ({dailyycsx.length})</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      className="btn-close-drawer"
                      onClick={() => setShowHideDailyYCSX(false)}
                      title="Đóng chi tiết"
                    >
                      <FiX size={16} />
                    </button>
                  </div>

                  <div className="mobile-ycsx-drawer-body">
                    {mobileYcsxDetailTab === "tracking" && (
                      <PrecisionDataSxTracking
                        selectedYCSX={selectedYCSX.current}
                        totalDailyYCSX={totalDailyYCSX}
                      />
                    )}
                    {mobileYcsxDetailTab === "daily" && tableDailyYcsx}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ===================== FLOATING FILTER DRAWER (MOBILE) ===================== */}
      {isMobile && showMobileFilterDrawer && (
        <PrecisionDataSxMobileFilterDrawer
          isOpen={showMobileFilterDrawer}
          onClose={() => setShowMobileFilterDrawer(false)}
          watch={watch}
          setValue={setValue}
          machineList={machine_list}
          onLoadChiThi={handle_loaddatasx}
          onLoadYcsx={handle_loaddatasxYCSX}
          onReset={handleResetFilter}
        />
      )}

      {/* ===================== MODAL PIVOT TABLE ===================== */}
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

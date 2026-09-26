import React, { useMemo } from "react";
import AGTable from "../../../../components/DataTable/AGTable";
import "./PrecisionLichSuInputLieu/PrecisionLichSuInputLieu.scss";
import { useLichSuInputLieuData } from "./PrecisionLichSuInputLieu/useLichSuInputLieuData";
import { columnsLichSuInputLieu } from "./PrecisionLichSuInputLieu/PrecisionLichSuInputLieuColumns";
import PrecisionLichSuInputLieuHeader from "./PrecisionLichSuInputLieu/PrecisionLichSuInputLieuHeader";
import PrecisionLichSuInputLieuKpi from "./PrecisionLichSuInputLieu/PrecisionLichSuInputLieuKpi";
import PrecisionLichSuInputLieuToolbar from "./PrecisionLichSuInputLieu/PrecisionLichSuInputLieuToolbar";
import { FiSearch, FiDownload } from "react-icons/fi";

const LICHSUINPUTLIEU: React.FC = () => {
  const {
    fromDate,
    toDate,
    allTime,
    prodRequestNo,
    planId,
    codeCMS,
    codeKD,
    mName,
    mCode,
    inspectiondatatable,
    filteredDataTable,
    quickSearchText,
    isLoading,
    setFromDate,
    setToDate,
    setAllTime,
    setProdRequestNo,
    setPlanId,
    setCodeCMS,
    setCodeKD,
    setMName,
    setMCode,
    setQuickSearchText,
    handleLoadLichSu,
    handleReset,
    handleExportExcel,
  } = useLichSuInputLieuData();

  const columns = useMemo(() => columnsLichSuInputLieu, []);

  return (
    <div className="precision-inputlieu">
      {/* 1. Header Bar Công Nghiệp */}
      <PrecisionLichSuInputLieuHeader
        totalRecords={inspectiondatatable.length}
        isLoading={isLoading}
        onReload={handleLoadLichSu}
      />

      {/* 2. Khối 5 Micro-Cards KPI Thống Kê Realtime */}
      <PrecisionLichSuInputLieuKpi data={inspectiondatatable} />

      {/* 3. Dải Lọc Điều Hành Top Toolbar (Thay thế sidebar 230px dọc) */}
      <PrecisionLichSuInputLieuToolbar
        fromDate={fromDate}
        toDate={toDate}
        allTime={allTime}
        prodRequestNo={prodRequestNo}
        planId={planId}
        codeCMS={codeCMS}
        codeKD={codeKD}
        mName={mName}
        mCode={mCode}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onAllTimeChange={setAllTime}
        onProdRequestNoChange={setProdRequestNo}
        onPlanIdChange={setPlanId}
        onCodeCMSChange={setCodeCMS}
        onCodeKDChange={setCodeKD}
        onMNameChange={setMName}
        onMCodeChange={setMCode}
        onSearch={handleLoadLichSu}
        onReset={handleReset}
        onExportExcel={() => handleExportExcel()}
      />

      {/* 4. Khung Bảng Lịch Sử Input Liệu AGTable */}
      <div className="precision-inputlieu-grid-container">
        {/* Thanh Lọc Nhanh & Thao Tác Bảng */}
        <div className="precision-inputlieu-grid-toolbar">
          <div className="precision-inputlieu-grid-toolbar__left">
            <div className="precision-inputlieu-grid-toolbar__search">
              <FiSearch size={11} color="#64748b" />
              <input
                type="text"
                placeholder="Tìm mã YCSX, PLAN, liệu, lot, máy, nhân viên..."
                value={quickSearchText}
                onChange={(e) => setQuickSearchText(e.target.value)}
              />
            </div>
            <div className="precision-inputlieu-grid-toolbar__stats">
              <span>Đang hiển thị: </span>
              <strong>{filteredDataTable.length}</strong> /{" "}
              <span>{inspectiondatatable.length} bản ghi</span>
            </div>
          </div>

          <div className="precision-inputlieu-grid-toolbar__actions">
            <button
              type="button"
              className="btn-grid-action btn-grid-action--excel"
              onClick={() => handleExportExcel(filteredDataTable)}
              title="Xuất Excel dữ liệu đang lọc trên bảng"
            >
              <FiDownload size={11} />
              <span>Xuất Bảng Này</span>
            </button>
          </div>
        </div>

        {/* Thân Bảng AGTable */}
        <div className="precision-inputlieu-grid-body">
          <AGTable
            toolbar={null}
            suppressRowClickSelection={false}
            columns={columns}
            data={filteredDataTable}
            onCellEditingStopped={() => {}}
            onRowClick={() => {}}
            onSelectionChange={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default LICHSUINPUTLIEU;

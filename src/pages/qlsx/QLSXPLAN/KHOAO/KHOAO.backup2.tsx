import React from "react";
import AGTable from "../../../../components/DataTable/AGTable";
import { AiOutlineSearch, AiOutlineFileExcel } from "react-icons/ai";
import { PrecisionKhoAoHeader } from "./PrecisionKhoAo/PrecisionKhoAoHeader";
import { PrecisionKhoAoToolbar } from "./PrecisionKhoAo/PrecisionKhoAoToolbar";
import { PrecisionKhoAoKpi } from "./PrecisionKhoAo/PrecisionKhoAoKpi";
import { useKhoAoData } from "./PrecisionKhoAo/useKhoAoData";
import "./PrecisionKhoAo/PrecisionKhoAo.scss";

interface KHOAOProps {
  NEXT_PLAN?: string;
}

const KHOAO: React.FC<KHOAOProps> = ({ NEXT_PLAN }) => {
  const {
    activeTab,
    fromdate,
    setFromDate,
    todate,
    setToDate,
    factory,
    setFactory,
    nextPlan,
    setNextPlan,
    searchKeyword,
    setSearchKeyword,
    isLoading,
    datatable,
    filteredData,
    columns,
    tonkhoaodatafilter,
    handleTabChange,
    handleRefresh,
    handle_xuatKhoAo,
    handle_nhappassword_xoarac,
    handle_nhappassword_anrac,
    exportExcel,
  } = useKhoAoData(NEXT_PLAN);

  return (
    <div className="precision-khoao">
      {/* Header công nghiệp với Breadcrumb & Telemetry */}
      <PrecisionKhoAoHeader
        activeTab={activeTab}
        nextPlan={nextPlan}
        totalRecords={filteredData.length}
      />

      {/* Toolbar 2 tầng: Switcher Tabs, Bộ lọc & Action Groups */}
      <PrecisionKhoAoToolbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        fromdate={fromdate}
        setFromDate={setFromDate}
        todate={todate}
        setToDate={setToDate}
        factory={factory}
        setFactory={setFactory}
        nextPlan={nextPlan}
        setNextPlan={setNextPlan}
        onXuatNext={handle_xuatKhoAo}
        onXoaRac={handle_nhappassword_xoarac}
        onAnRac={handle_nhappassword_anrac}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      {/* Micro-cards KPI Dashboard */}
      <PrecisionKhoAoKpi activeTab={activeTab} data={filteredData} />

      {/* Data Grid Container */}
      <div className="precision-khoao__gridContainer">
        <div className="precision-khoao__gridToolbar">
          <div className="gridToolbar-left">
            <div className="search-box">
              <AiOutlineSearch className="search-icon" />
              <input
                type="text"
                placeholder="Lọc nhanh mã liệu, tên liệu, số lot, plan..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>

            <div className="grid-actions">
              <button
                type="button"
                className="grid-btn grid-btn--excel"
                onClick={() => exportExcel("EX1")}
                title="Xuất dữ liệu đang lọc ra file Excel"
              >
                <AiOutlineFileExcel />
                <span>EX1</span>
                <span className="badge">Đang lọc</span>
              </button>

              <button
                type="button"
                className="grid-btn grid-btn--excel"
                onClick={() => exportExcel("EX2")}
                title="Xuất toàn bộ dữ liệu ra file Excel"
              >
                <AiOutlineFileExcel />
                <span>EX2</span>
                <span className="badge">Tất cả</span>
              </button>
            </div>
          </div>

          <div className="gridToolbar-right">
            <span>
              Đang hiển thị: <strong>{filteredData.length} / {datatable.length}</strong> cuộn
            </span>
          </div>
        </div>

        <div className="precision-khoao__gridBody">
          <AGTable
            showFilter={true}
            columns={columns}
            data={filteredData}
            onSelectionChange={(params: any) => {
              tonkhoaodatafilter.current = params?.api?.getSelectedRows() || [];
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default KHOAO;

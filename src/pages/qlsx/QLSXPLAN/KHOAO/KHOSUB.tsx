import React from "react";
import AGTable from "../../../../components/DataTable/AGTable";
import { AiOutlineSearch, AiOutlineFileExcel } from "react-icons/ai";
import { PrecisionKhoSubHeader } from "./PrecisionKhoSub/PrecisionKhoSubHeader";
import { PrecisionKhoSubToolbar } from "./PrecisionKhoSub/PrecisionKhoSubToolbar";
import { PrecisionKhoSubKpi } from "./PrecisionKhoSub/PrecisionKhoSubKpi";
import { useKhoSubData } from "./PrecisionKhoSub/useKhoSubData";
import "./PrecisionKhoSub/PrecisionKhoSub.scss";

interface KHOSUBProps {
  NEXT_PLAN?: string;
}

const KHOSUB: React.FC<KHOSUBProps> = ({ NEXT_PLAN }) => {
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
    handle_xuatKhoSub,
    exportExcel,
  } = useKhoSubData(NEXT_PLAN);

  return (
    <div className="precision-khosub">
      {/* Header công nghiệp với Breadcrumb & Telemetry */}
      <PrecisionKhoSubHeader
        activeTab={activeTab}
        nextPlan={nextPlan}
        totalRecords={filteredData.length}
      />

      {/* Toolbar 2 tầng: Switcher Tabs, Bộ lọc & Action Groups */}
      <PrecisionKhoSubToolbar
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
        onXuatNext={handle_xuatKhoSub}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      {/* Micro-cards KPI Dashboard */}
      <PrecisionKhoSubKpi activeTab={activeTab} data={filteredData} />

      {/* Data Grid Container */}
      <div className="precision-khosub__gridContainer">
        <div className="precision-khosub__gridToolbar">
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

        <div className="precision-khosub__gridBody">
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

export default KHOSUB;

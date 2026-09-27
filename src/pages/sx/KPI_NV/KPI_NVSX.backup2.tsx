import React, { useEffect } from "react";
import "./PrecisionKpiNvSx/PrecisionKpiNvSx.scss";
import { useKpiNvSxData } from "./PrecisionKpiNvSx/useKpiNvSxData";
import PrecisionKpiNvSxHeader from "./PrecisionKpiNvSx/PrecisionKpiNvSxHeader";
import PrecisionKpiNvSxToolbar from "./PrecisionKpiNvSx/PrecisionKpiNvSxToolbar";
import PrecisionKpiNvSxKpi from "./PrecisionKpiNvSx/PrecisionKpiNvSxKpi";
import PrecisionKpiNvSxCharts from "./PrecisionKpiNvSx/PrecisionKpiNvSxCharts";
import PrecisionKpiNvSxGrid from "./PrecisionKpiNvSx/PrecisionKpiNvSxGrid";

const KPI_NVSX: React.FC = () => {
  const {
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    option,
    setOption,
    allTime,
    setAllTime,
    activeTab,
    setActiveTab,
    searchKeyword,
    setSearchKeyword,
    isLoading,
    rawKpiData,
    filteredData,
    columns,
    summaryKpi,
    periodTrendChartData,
    topEmplMetChartData,
    rateDistChartData,
    topEmplQtyChartData,
    loadKpiData,
    handleExportEX1,
    handleExportEX2,
    handleQuickDate,
  } = useKpiNvSxData();

  // Tải dữ liệu ban đầu
  useEffect(() => {
    loadKpiData();
  }, [loadKpiData]);

  const showKpiAndCharts = activeTab === "all" || activeTab === "charts";
  const showGrid = activeTab === "all" || activeTab === "grid";

  return (
    <div className="precision-kpinvsx">
      {/* 1. Header Bar công nghiệp */}
      <PrecisionKpiNvSxHeader
        totalRecords={filteredData.length}
        uniqueEmpl={summaryKpi.uniqueEmplCount}
        option={option}
        isLoading={isLoading}
        onReload={loadKpiData}
      />

      {/* 2. Action Toolbar Compact & Segmented View Switcher */}
      <PrecisionKpiNvSxToolbar
        fromDate={fromDate}
        toDate={toDate}
        option={option}
        allTime={allTime}
        activeTab={activeTab}
        isLoading={isLoading}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onOptionChange={setOption}
        onAllTimeToggle={() => setAllTime((prev) => !prev)}
        onTabChange={setActiveTab}
        onQuickDate={handleQuickDate}
        onLoadData={loadKpiData}
      />

      {/* 3. Nội dung cuộn linh hoạt Full-Height */}
      <div className="precision-kpinvsx__contentBody">
        {/* Phân hệ KPI & Biểu Đồ Recharts Executive Dashboard */}
        {showKpiAndCharts && (
          <>
            {/* Dashboard 6 Micro-Cards KPI */}
            <PrecisionKpiNvSxKpi summary={summaryKpi} />

            {/* Hệ thống 4 biểu đồ Recharts phong cách KinhDoanhReport */}
            <PrecisionKpiNvSxCharts
              periodTrendData={periodTrendChartData}
              topEmplMetData={topEmplMetChartData}
              rateDistData={rateDistChartData}
              topEmplQtyData={topEmplQtyChartData}
              option={option}
            />
          </>
        )}

        {/* Phân hệ Bảng Dữ Liệu AG Grid */}
        {showGrid && (
          <PrecisionKpiNvSxGrid
            columns={columns}
            data={filteredData}
            totalCount={rawKpiData.length}
            searchKeyword={searchKeyword}
            onSearchChange={setSearchKeyword}
            onExportEX1={handleExportEX1}
            onExportEX2={handleExportEX2}
          />
        )}
      </div>
    </div>
  );
};

export default KPI_NVSX;

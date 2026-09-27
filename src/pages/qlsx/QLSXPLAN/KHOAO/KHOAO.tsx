import React, { useState, useMemo, useCallback } from "react";
import moment from "moment";
import AGTable from "../../../../components/DataTable/AGTable";
import { AiOutlineSearch, AiOutlineFileExcel } from "react-icons/ai";
import useIsMobile from "../../../../components/Navbar/AccountInfo/useIsMobile";
import { PrecisionKhoAoHeader } from "./PrecisionKhoAo/PrecisionKhoAoHeader";
import { PrecisionKhoAoToolbar } from "./PrecisionKhoAo/PrecisionKhoAoToolbar";
import { PrecisionKhoAoKpi } from "./PrecisionKhoAo/PrecisionKhoAoKpi";
import { PrecisionKhoAoMobileHeader } from "./PrecisionKhoAo/PrecisionKhoAoMobileHeader";
import { PrecisionKhoAoMobileToolbar } from "./PrecisionKhoAo/PrecisionKhoAoMobileToolbar";
import { PrecisionKhoAoMobileKpi } from "./PrecisionKhoAo/PrecisionKhoAoMobileKpi";
import { PrecisionKhoAoMobileFilterDrawer } from "./PrecisionKhoAo/PrecisionKhoAoMobileFilterDrawer";
import { useKhoAoData } from "./PrecisionKhoAo/useKhoAoData";
import "./PrecisionKhoAo/PrecisionKhoAo.scss";

interface KHOAOProps {
  NEXT_PLAN?: string;
}

const KHOAO: React.FC<KHOAOProps> = ({ NEXT_PLAN }) => {
  const isMobile = useIsMobile();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [showKpiSummary, setShowKpiSummary] = useState(false);

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

  // Đếm số điều kiện lọc đang active
  const activeFilterCount = useMemo(() => {
    let count = 0;
    const today = moment().format("YYYY-MM-DD");
    if (factory !== "ALL") count++;
    if (activeTab !== "TON") {
      if (fromdate.slice(0, 10) !== today || todate.slice(0, 10) !== today) {
        count++;
      }
    }
    if (nextPlan.trim() !== "") count++;
    return count;
  }, [factory, activeTab, fromdate, todate, nextPlan]);

  // Đặt lại bộ lọc về mặc định
  const handleResetFilter = useCallback(() => {
    const today = moment().format("YYYY-MM-DD");
    setFactory("ALL");
    setFromDate(today);
    setToDate(today);
    setNextPlan("");
    setSearchKeyword("");
    handleTabChange("TON");
  }, [setFactory, setFromDate, setToDate, setNextPlan, setSearchKeyword, handleTabChange]);

  // Áp dụng bộ lọc từ Mobile Drawer
  const handleApplyFilter = useCallback(() => {
    handleRefresh();
  }, [handleRefresh]);

  return (
    <div className={`precision-khoao ${isMobile ? "is-mobile" : ""}`}>
      {/* 1. DESKTOP ONLY: Header công nghiệp chuẩn Google Stitch */}
      {!isMobile && (
        <PrecisionKhoAoHeader
          activeTab={activeTab}
          nextPlan={nextPlan}
          totalRecords={filteredData.length}
        />
      )}

      {/* 2. DESKTOP ONLY: Toolbar 2 tầng */}
      {!isMobile && (
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
      )}

      {/* 3. DESKTOP ONLY: Micro-cards KPI Dashboard */}
      {!isMobile && <PrecisionKhoAoKpi activeTab={activeTab} data={filteredData} />}

      {/* 4. MOBILE ONLY: Header Tinh Gọn */}
      {isMobile && (
        <PrecisionKhoAoMobileHeader
          activeTab={activeTab}
          nextPlan={nextPlan}
          totalRecords={datatable.length}
          filteredRecords={filteredData.length}
          showKpiSummary={showKpiSummary}
          onToggleKpiSummary={() => setShowKpiSummary((prev) => !prev)}
          onRefresh={handleRefresh}
          isLoading={isLoading}
        />
      )}

      {/* 5. MOBILE ONLY: Toolbar 2 Hàng Công Thái Học */}
      {isMobile && (
        <PrecisionKhoAoMobileToolbar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
          onClearSearch={() => setSearchKeyword("")}
          onOpenFilterDrawer={() => setIsMobileFilterOpen(true)}
          activeFilterCount={activeFilterCount}
          nextPlan={nextPlan}
          setNextPlan={setNextPlan}
          onXuatNext={handle_xuatKhoAo}
          onXoaRac={handle_nhappassword_xoarac}
          onAnRac={handle_nhappassword_anrac}
          onRefresh={handleRefresh}
          onExportExcel={exportExcel}
          isLoading={isLoading}
        />
      )}

      {/* 6. MOBILE ONLY: Micro KPI Cuộn Ngang (Collapsible) */}
      {isMobile && showKpiSummary && (
        <PrecisionKhoAoMobileKpi
          activeTab={activeTab}
          data={filteredData}
          onClose={() => setShowKpiSummary(false)}
        />
      )}

      {/* 7. KHỐI BẢNG DỮ LIỆU CHÍNH */}
      <div className="precision-khoao__gridContainer">
        {!isMobile && (
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
        )}

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

      {/* 8. MOBILE ONLY: Bottom Sheet Filter Drawer (Zero Blur) */}
      {isMobile && (
        <PrecisionKhoAoMobileFilterDrawer
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
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
          onApply={handleApplyFilter}
          onReset={handleResetFilter}
        />
      )}
    </div>
  );
};

export default KHOAO;

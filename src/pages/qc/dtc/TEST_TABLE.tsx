import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { UserData } from "../../../api/GlobalInterface";
import useIsMobile from "../../../components/Navbar/AccountInfo/useIsMobile";
import { useTestTableData } from "./PrecisionTESTTABLE/useTestTableData";
import PrecisionTestTableHeader from "./PrecisionTESTTABLE/PrecisionTestTableHeader";
import PrecisionTestTableKpi from "./PrecisionTESTTABLE/PrecisionTestTableKpi";
import PrecisionTestItemPanel from "./PrecisionTESTTABLE/PrecisionTestItemPanel";
import PrecisionTestPointPanel from "./PrecisionTESTTABLE/PrecisionTestPointPanel";
import PrecisionAddTestItemModal from "./PrecisionTESTTABLE/PrecisionAddTestItemModal";
import PrecisionAddTestPointModal from "./PrecisionTESTTABLE/PrecisionAddTestPointModal";
import PrecisionTestTableMobileHeader from "./PrecisionTESTTABLE/PrecisionTestTableMobileHeader";
import PrecisionTestTableMobileTabs, {
  TestTableMobilePane,
} from "./PrecisionTESTTABLE/PrecisionTestTableMobileTabs";
import PrecisionTestTableMobileToolbar from "./PrecisionTESTTABLE/PrecisionTestTableMobileToolbar";
import "./PrecisionTESTTABLE/PrecisionTESTTABLE.scss";

const TEST_TABLE: React.FC = () => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );

  const isMobile = useIsMobile();

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Trạng thái chuyên biệt cho Mobile ERP
  // KPI mặc định ẨN để nhường chỗ cho bảng dữ liệu (viewport thấp ~850px)
  const [showMobileKpi, setShowMobileKpi] = useState<boolean>(false);
  const [showTableFilter, setShowTableFilter] = useState<boolean>(true);
  // Trên mobile 2 panel master-detail được chuyển thành 2 tab (tránh xếp dọc dài)
  const [activePane, setActivePane] = useState<TestTableMobilePane>("items");

  const {
    testList,
    testPointList,
    selectedTestItem,
    itemSearch,
    setItemSearch,
    pointSearch,
    setPointSearch,
    openAddItemModal,
    setOpenAddItemModal,
    openAddPointModal,
    setOpenAddPointModal,
    suggestedNextTestCode,
    suggestedNextPointCode,
    filteredItems,
    filteredPoints,
    kpis,
    loadTestList,
    loadTestPointList,
    handleSelectTestItem,
    handleCreateTestItem,
    handleCreateTestPoint,
    handleExportItems,
    handleExportPoints,
  } = useTestTableData();

  const handleRefreshAll = useCallback(() => {
    loadTestList();
    loadTestPointList();
  }, [loadTestList, loadTestPointList]);

  // Mobile: chạm 1 dòng hạng mục -> nạp điểm đo rồi tự chuyển sang tab Điểm đo
  const handleSelectItemMobile = useCallback(
    (item: Parameters<typeof handleSelectTestItem>[0]) => {
      handleSelectTestItem(item);
      setActivePane("points");
    },
    [handleSelectTestItem]
  );

  const isItemsPane = activePane === "items";

  return (
    <div
      className={`precision-testtable ${isMobile ? "is-mobile" : ""} ${
        isFullscreen && !isMobile ? "precision-testtable--fullscreen" : ""
      }`}
    >
      {/* ======================================================================= */}
      {/* GIAO DIỆN DESKTOP (> 768px): GIỮ NGUYÊN 100% BỐ CỤC BAN ĐẦU             */}
      {/* ======================================================================= */}
      {!isMobile && (
        <>
          {/* Top Banner / Breadcrumb & Telemetry Header */}
          <PrecisionTestTableHeader
            userData={userData}
            onRefresh={handleRefreshAll}
            isFullscreen={isFullscreen}
            onToggleFullscreen={() => setIsFullscreen((prev) => !prev)}
          />

          {/* Realtime Micro-KPI Ribbon */}
          <PrecisionTestTableKpi kpis={kpis} />

          {/* Split 2-Panel Master-Detail Workspace */}
          <div className="precision-testtable__workspace">
            {/* Left Panel: Test Items (Master) */}
            <PrecisionTestItemPanel
              data={filteredItems}
              totalCount={testList.length}
              selectedItem={selectedTestItem}
              searchTerm={itemSearch}
              setSearchTerm={setItemSearch}
              onSelectItem={handleSelectTestItem}
              onOpenAddModal={() => setOpenAddItemModal(true)}
              onExport={handleExportItems}
              onRefresh={loadTestList}
            />

            {/* Right Panel: Test Points (Detail) */}
            <PrecisionTestPointPanel
              data={filteredPoints}
              totalCount={testPointList.length}
              selectedItem={selectedTestItem}
              searchTerm={pointSearch}
              setSearchTerm={setPointSearch}
              onOpenAddModal={() => setOpenAddPointModal(true)}
              onExport={handleExportPoints}
              onRefresh={loadTestPointList}
            />
          </div>
        </>
      )}

      {/* ======================================================================= */}
      {/* GIAO DIỆN MOBILE (≤ 768px): TỐI ĐA KHÔNG GIAN BẢNG DỮ LIỆU             */}
      {/* ======================================================================= */}
      {isMobile && (
        <>
          {/* 1. Mobile Header tinh gọn: brand + số dòng + toggle KPI */}
          <PrecisionTestTableMobileHeader
            totalItems={testList.length}
            filteredItems={filteredItems.length}
            totalPoints={testPointList.length}
            showKpi={showMobileKpi}
            onToggleKpi={() => setShowMobileKpi((prev) => !prev)}
            onReload={handleRefreshAll}
          />

          {/* 2. Micro-KPI compact (ẩn theo mặc định để nhường chỗ cho bảng) */}
          {showMobileKpi && <PrecisionTestTableKpi kpis={kpis} compact />}

          {/* 3. Segmented switcher: Hạng mục ↔ Điểm đo */}
          <PrecisionTestTableMobileTabs
            activePane={activePane}
            onPaneChange={setActivePane}
            itemsCount={filteredItems.length}
            pointsCount={filteredPoints.length}
          />

          {/* 4. Mobile Toolbar công thái học: search + tiện ích cuộn ngang */}
          <PrecisionTestTableMobileToolbar
            searchTerm={isItemsPane ? itemSearch : pointSearch}
            onSearchChange={isItemsPane ? setItemSearch : setPointSearch}
            searchPlaceholder={
              isItemsPane
                ? "Lọc mã hoặc tên hạng mục..."
                : "Lọc mã hoặc tên điểm đo..."
            }
            primaryLabel={isItemsPane ? "+ Hạng mục" : "+ Điểm đo"}
            primaryDisabled={!isItemsPane && !selectedTestItem}
            onPrimaryAction={
              isItemsPane
                ? () => setOpenAddItemModal(true)
                : () => setOpenAddPointModal(true)
            }
            onExport={isItemsPane ? handleExportItems : handleExportPoints}
            onReload={isItemsPane ? loadTestList : loadTestPointList}
            onReset={
              isItemsPane ? () => setItemSearch("") : () => setPointSearch("")
            }
            showFilter={showTableFilter}
            onToggleFilter={() => setShowTableFilter((prev) => !prev)}
            primaryTone={isItemsPane ? "emerald" : "indigo"}
          />

          {/* 5. Bảng dữ liệu chiếm trọn không gian còn lại (1 panel mỗi lần) */}
          <div className="precision-testtable__mobilePane">
            {isItemsPane ? (
              <PrecisionTestItemPanel
                data={filteredItems}
                totalCount={testList.length}
                selectedItem={selectedTestItem}
                searchTerm={itemSearch}
                setSearchTerm={setItemSearch}
                onSelectItem={handleSelectItemMobile}
                onOpenAddModal={() => setOpenAddItemModal(true)}
                onExport={handleExportItems}
                onRefresh={loadTestList}
                isMobile
                showFilter={showTableFilter}
              />
            ) : (
              <PrecisionTestPointPanel
                data={filteredPoints}
                totalCount={testPointList.length}
                selectedItem={selectedTestItem}
                searchTerm={pointSearch}
                setSearchTerm={setPointSearch}
                onOpenAddModal={() => setOpenAddPointModal(true)}
                onExport={handleExportPoints}
                onRefresh={loadTestPointList}
                isMobile
                showFilter={showTableFilter}
              />
            )}
          </div>
        </>
      )}

      {/* Luxury Modal: Thêm Hạng Mục Test Mới */}
      <PrecisionAddTestItemModal
        isOpen={openAddItemModal}
        onClose={() => setOpenAddItemModal(false)}
        suggestedCode={suggestedNextTestCode}
        onSubmit={handleCreateTestItem}
      />

      {/* Luxury Modal: Thêm Điểm Đo Mới */}
      <PrecisionAddTestPointModal
        isOpen={openAddPointModal}
        onClose={() => setOpenAddPointModal(false)}
        selectedItem={selectedTestItem}
        suggestedPointCode={suggestedNextPointCode}
        onSubmit={handleCreateTestPoint}
      />
    </div>
  );
};

export default TEST_TABLE;

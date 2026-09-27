import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { UserData } from "../../../api/GlobalInterface";
import { useTestTableData } from "./PrecisionTESTTABLE/useTestTableData";
import PrecisionTestTableHeader from "./PrecisionTESTTABLE/PrecisionTestTableHeader";
import PrecisionTestTableKpi from "./PrecisionTESTTABLE/PrecisionTestTableKpi";
import PrecisionTestItemPanel from "./PrecisionTESTTABLE/PrecisionTestItemPanel";
import PrecisionTestPointPanel from "./PrecisionTESTTABLE/PrecisionTestPointPanel";
import PrecisionAddTestItemModal from "./PrecisionTESTTABLE/PrecisionAddTestItemModal";
import PrecisionAddTestPointModal from "./PrecisionTESTTABLE/PrecisionAddTestPointModal";
import "./PrecisionTESTTABLE/PrecisionTESTTABLE.scss";

const TEST_TABLE: React.FC = () => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

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

  return (
    <div
      className={`precision-testtable ${
        isFullscreen ? "precision-testtable--fullscreen" : ""
      }`}
    >
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

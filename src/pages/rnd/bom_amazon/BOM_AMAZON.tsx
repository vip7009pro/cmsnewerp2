import React, { useMemo } from "react";
import AGTable from "../../../components/DataTable/AGTable";
import { CODE_INFO } from "../interfaces/rndInterface";
import { createBomAmazonColumns } from "./PrecisionBomAmazon/PrecisionBomAmazonColumns";
import { PrecisionBomAmazonHeader } from "./PrecisionBomAmazon/PrecisionBomAmazonHeader";
import { PrecisionBomAmazonInfoPanel } from "./PrecisionBomAmazon/PrecisionBomAmazonInfoPanel";
import { PrecisionBomAmazonSidebar } from "./PrecisionBomAmazon/PrecisionBomAmazonSidebar";
import { PrecisionBomAmazonToolbar } from "./PrecisionBomAmazon/PrecisionBomAmazonToolbar";
import { useBomAmazonData } from "./PrecisionBomAmazon/useBomAmazonData";
import "./PrecisionBomAmazon/PrecisionBomAmazon.scss";
import "./BOM_AMAZON.scss";

const BOM_AMAZON: React.FC = () => {
  const {
    codephoilist,
    listamazontable,
    bomamazontable,
    filteredBomData,
    G_CODE_MAU,
    setG_CODE_MAU,
    codeCMS,
    setCodeCMS,
    enableEdit,
    rows,
    codeinfoCMS,
    codeinfoKD,
    amz_country,
    setAMZ_COUNTRY,
    amz_prod_name,
    setAMZ_PROD_NAME,
    sidebarTab,
    setSidebarTab,
    quickSearchBom,
    setQuickSearchBom,
    isSidebarOpen,
    setIsSidebarOpen,
    isInfoPanelOpen,
    setIsInfoPanelOpen,
    isFullscreen,
    toggleFullscreen,
    handleSearchCodeKeyDown,
    handleCODEINFO,
    handleGETLISTBOMAMAZON,
    handleGETBOMAMAZON,
    handleGETBOMAMAZONEMPTY,
    handleResetToTemplate,
    handleToggleEdit,
    confirmSaveBOMAMAZON,
    handle_saveAMAZONCODEINFO,
    handleExportExcel,
    isBomExist,
  } = useBomAmazonData();

  // Columns cho bảng BOM Amazon trung tâm
  const bomAmazonColumns = useMemo(
    () => createBomAmazonColumns(enableEdit),
    [enableEdit]
  );

  // Xử lý khi chọn một mã hàng từ All Code để khởi tạo BOM từ phôi
  const handleSelectCodeInfo = (row: CODE_INFO) => {
    if (!row?.G_CODE) return;
    handleGETBOMAMAZONEMPTY(row.G_CODE, row.G_NAME || "", G_CODE_MAU);
  };

  return (
    <div className="precision-bom-amz">
      {/* 1. SUB-HEADER CHUẨN STITCH */}
      <PrecisionBomAmazonHeader
        isFullscreen={isFullscreen}
        toggleFullscreen={toggleFullscreen}
        onRefresh={() => handleGETLISTBOMAMAZON("")}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        isInfoPanelOpen={isInfoPanelOpen}
        onToggleInfoPanel={() => setIsInfoPanelOpen((prev) => !prev)}
      />

      {/* 2. LAYOUT 3 PANES */}
      <div className="precision-bom-amz__layout">
        {/* PANE TRÁI: SIDEBAR CHỌN PHÔI VÀ TRA CỨU */}
        <PrecisionBomAmazonSidebar
          isOpen={isSidebarOpen}
          codephoilist={codephoilist}
          G_CODE_MAU={G_CODE_MAU}
          setG_CODE_MAU={setG_CODE_MAU}
          sidebarTab={sidebarTab}
          setSidebarTab={setSidebarTab}
          listamazontable={listamazontable}
          rows={rows}
          codeCMS={codeCMS}
          setCodeCMS={setCodeCMS}
          handleSearchCodeKeyDown={handleSearchCodeKeyDown}
          handleCODEINFO={handleCODEINFO}
          handleGETBOMAMAZON={handleGETBOMAMAZON}
          onSelectCodeInfo={handleSelectCodeInfo}
        />

        {/* PANE TRUNG TÂM: WORKSPACE BẢNG BOM CHÍNH */}
        <main className="precision-bom-amz__workspace">
          {/* TOOLBAR HÀNH ĐỘNG */}
          <PrecisionBomAmazonToolbar
            codeinfoCMS={codeinfoCMS}
            codeinfoKD={codeinfoKD}
            isBomExist={isBomExist}
            bomDataLength={bomamazontable.length}
            filteredCount={filteredBomData.length}
            enableEdit={enableEdit}
            onToggleEdit={handleToggleEdit}
            onSaveBom={confirmSaveBOMAMAZON}
            onResetToTemplate={handleResetToTemplate}
            onExportExcel={handleExportExcel}
            quickSearchBom={quickSearchBom}
            setQuickSearchBom={setQuickSearchBom}
          />

          {/* AGTABLE HIGH-DENSITY */}
          <div className="precision-bom-amz__gridContainer">
            <AGTable
              showFilter={true}
              toolbar={<></>}
              columns={bomAmazonColumns}
              data={filteredBomData}
            />
          </div>
        </main>

        {/* PANE PHẢI: THÔNG TIN SẢN PHẨM & THỊ TRƯỜNG AMAZON */}
        <PrecisionBomAmazonInfoPanel
          isOpen={isInfoPanelOpen}
          onClose={() => setIsInfoPanelOpen(false)}
          codeinfoCMS={codeinfoCMS}
          amz_prod_name={amz_prod_name}
          setAMZ_PROD_NAME={setAMZ_PROD_NAME}
          amz_country={amz_country}
          setAMZ_COUNTRY={setAMZ_COUNTRY}
          onUpdateInfo={handle_saveAMAZONCODEINFO}
        />
      </div>
    </div>
  );
};

export default BOM_AMAZON;

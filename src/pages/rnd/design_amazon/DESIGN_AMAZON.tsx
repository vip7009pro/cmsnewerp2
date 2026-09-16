// Precision Amazon Label Design Studio - Google Stitch High-Density Enterprise
import React, { useState, useCallback } from "react";
import "./DESIGN_AMAZON.scss";
import { useDesignAmazonData } from "./PrecisionDesignAmazon/useDesignAmazonData";
import { useDesignAmazonCanvas } from "./PrecisionDesignAmazon/useDesignAmazonCanvas";
import { PrecisionDesignAmazonHeader } from "./PrecisionDesignAmazon/PrecisionDesignAmazonHeader";
import { PrecisionDesignAmazonToolbar } from "./PrecisionDesignAmazon/PrecisionDesignAmazonToolbar";
import { PrecisionDesignAmazonSidebar } from "./PrecisionDesignAmazon/PrecisionDesignAmazonSidebar";
import { PrecisionDesignAmazonCanvas } from "./PrecisionDesignAmazon/PrecisionDesignAmazonCanvas";
import { PrecisionDesignAmazonInspector } from "./PrecisionDesignAmazon/PrecisionDesignAmazonInspector";
import { PrecisionDesignAmazonTable } from "./PrecisionDesignAmazon/PrecisionDesignAmazonTable";

const DESIGN_AMAZON: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showInspector, setShowInspector] = useState(true);
  const [showTable, setShowTable] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const data = useDesignAmazonData();

  const canvas = useDesignAmazonCanvas({
    componentList: data.componentList,
    latestComponentListRef: data.latestComponentListRef,
    currentComponent: data.currentComponent,
    setCurrentComponent: data.setCurrentComponent,
    commitComponentList: data.commitComponentList,
    undo: data.undo,
    redo: data.redo,
    deleteSelectedComponent: data.deleteSelectedComponent,
    updateComponentAt: data.updateComponentAt,
  });

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  return (
    <div className="precision-amz-design">
      {/* 1. Header & Telemetry */}
      <PrecisionDesignAmazonHeader
        codeinfoCMS={data.codeinfoCMS}
        codeinfoKD={data.codeinfoKD}
        componentCount={data.componentList.length}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        showInspector={showInspector}
        setShowInspector={setShowInspector}
        showTable={showTable}
        setShowTable={setShowTable}
        isFullscreen={isFullscreen}
        toggleFullscreen={toggleFullscreen}
        onRefresh={data.handleCODEINFO}
      />

      {/* 2. Ribbon Command Bar */}
      <PrecisionDesignAmazonToolbar
        onSave={data.confirmSaveDESIGN_AMAZON}
        onUndo={data.undo}
        canUndo={data.historyPast.length > 0}
        onRedo={data.redo}
        canRedo={data.historyFuture.length > 0}
        onPrint={data.handlePrint}
        onPrintUSB={data.handleListPrinters}
        printOffsetMm={data.printOffsetMm}
        onUpdatePrintOffset={data.setAndPersistPrintOffset}
        enableSnap={canvas.enableSnap}
        setEnableSnap={canvas.setEnableSnap}
        showGrid={canvas.showGrid}
        setShowGrid={canvas.setShowGrid}
        gridMm={canvas.gridMm}
        setGridMm={canvas.setGridMm}
        gridStyle={canvas.gridStyle}
        setGridStyle={canvas.setGridStyle}
        scale={canvas.scale}
        setScale={canvas.setScale}
        zoomPresets={canvas.zoomPresets}
        zoomIn={canvas.zoomIn}
        zoomOut={canvas.zoomOut}
        resetZoom={canvas.resetZoom}
        paletteItems={canvas.paletteItems}
      />

      {/* 3. Studio Workspace (Sidebar + Canvas + Inspector) */}
      <div className="precision-amz-design__workspace">
        <PrecisionDesignAmazonSidebar
          isOpen={showSidebar}
          onClose={() => setShowSidebar(false)}
          codeCMS={data.codeCMS}
          setCodeCMS={data.setCodeCMS}
          onSearch={data.handleCODEINFO}
          onKeyDown={data.handleSearchCodeKeyDown}
          rows={data.rows}
          onSelectCode={data.handleCODESelectionforUpdate}
          isLoading={data.isLoading}
        />

        <PrecisionDesignAmazonCanvas
          designRef={canvas.designRef}
          scale={canvas.scale}
          x={canvas.x}
          y={canvas.y}
          showGrid={canvas.showGrid}
          gridMm={canvas.gridMm}
          gridBackground={canvas.gridBackground}
          rulerTicks={canvas.rulerTicks}
          stageSizePx={canvas.stageSizePx}
          designBBoxPx={canvas.designBBoxPx}
          snapLines={canvas.snapLines}
          liveOverlay={canvas.liveOverlay}
          componentList={data.componentList}
          currentComponent={data.currentComponent}
          setCurrentComponent={data.setCurrentComponent}
          activeHandleIdx={canvas.activeHandleIdx}
          activeHandleBox={canvas.activeHandleBox}
          isPrinting={data.isPrinting}
          printOffsetMm={data.printOffsetMm}
          labelprintref={data.labelprintref}
          renderHandles={canvas.renderHandles}
          renderRotatedResizeHandles={canvas.renderRotatedResizeHandles}
          setRotateDrag={canvas.setRotateDrag}
          isShiftDown={canvas.isShiftDown}
          setIsGroupDragging={canvas.setIsGroupDragging}
          groupDragStartRef={canvas.groupDragStartRef}
          onCreateComponentAt={data.createComponentAt}
          RULER_TOP={canvas.RULER_TOP}
          RULER_LEFT={canvas.RULER_LEFT}
          MM_TO_PX={canvas.MM_TO_PX}
          PX_TO_MM={canvas.PX_TO_MM}
        />

        <PrecisionDesignAmazonInspector
          isOpen={showInspector}
          onClose={() => setShowInspector(false)}
          selectedComponent={data.selectedComponent}
          currentIndex={data.currentComponent}
          totalComponents={data.componentList.length}
          onUpdateComponent={data.updateComponentAt}
          onDeleteComponent={data.deleteSelectedComponent}
          onPickAndUploadImage={data.pickAndUploadImage}
          historyPast={data.historyPast}
          onJumpToHistory={data.jumpToHistory}
        />
      </div>

      {/* 4. Bottom Table Dock */}
      <PrecisionDesignAmazonTable
        isOpen={showTable}
        componentList={data.componentList}
        latestComponentListRef={data.latestComponentListRef}
        currentComponent={data.currentComponent}
        setCurrentComponent={data.setCurrentComponent}
        commitComponentList={data.commitComponentList}
        newComponent={data.newComponent}
        setNewComponent={data.setNewComponent}
        onAddComponent={data.addComponent}
      />
    </div>
  );
};

export default DESIGN_AMAZON;

import moment from "moment";
import React, { useMemo, useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { generalQuery, getCompany } from "../../../api/Api";
import { renderElement } from "../../../api/services/utilService";
import AGTable from "../../../components/DataTable/AGTable";
import PivotTable from "../../../components/PivotChart/LazyPivotTable";
import { RootState } from "../../../redux/store";
import BOM_DESIGN from "./BOM_DESIGN";
import {
  getColumnBOMGIA,
  getColumnBOMSX,
  getColumnCodeInfo,
} from "./PrecisionBOMManager/bomManagerColumns";
import "./PrecisionBOMManager/PrecisionBOMManager.scss";
import PrecisionBOMBulkModal from "./PrecisionBOMManager/PrecisionBOMBulkModal";
import PrecisionBOMDualTables from "./PrecisionBOMManager/PrecisionBOMDualTables";
import PrecisionBOMSidebar from "./PrecisionBOMManager/PrecisionBOMSidebar";
import PrecisionBOMSpecGrid from "./PrecisionBOMManager/PrecisionBOMSpecGrid";
import PrecisionBOMTemLotModal from "./PrecisionBOMManager/PrecisionBOMTemLotModal";
import { useBOMManagerActions } from "./PrecisionBOMManager/useBOMManagerActions";
import { useBOMManagerData } from "./PrecisionBOMManager/useBOMManagerData";
import { COMPONENT_DATA } from "../interfaces/rndInterface";
import { createPivotDataSource } from "../../../components/PivotChart/lazyPivot";
import { FiX } from "react-icons/fi";

import {
  DEFAULT_AMAZON_TEMPLATE,
  mapComponentListWithCodeInfo,
} from "./PrecisionBOMManager/precisionBOMTemLotUtils";
import { getUserData } from "../../../api/Api";

const BOM_MANAGER: React.FC = () => {
  const company = useSelector((state: RootState) => state.totalSlice.company) || getCompany();
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showHideDesignBom, setShowHideDesignBOM] = useState(false);
  const [showPivot, setShowPivot] = useState(false);
  const [showHideTemLot, setShowHideTemLot] = useState(false);
  const [templateComponents, setTemplateComponents] = useState<COMPONENT_DATA[]>(DEFAULT_AMAZON_TEMPLATE);
  const [componentList, setComponentList] = useState<COMPONENT_DATA[]>(DEFAULT_AMAZON_TEMPLATE);

  const labelprintref = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => labelprintref.current,
  });

  // Hook dữ liệu & queries
  const bomData = useBOMManagerData();
  const {
    codeCMS,
    setCodeCMS,
    cndb,
    setCNDB,
    activeOnly,
    setActiveOnly,
    isLoading,
    isCodeDetailLoading,
    codeInfoDataTable,
    codefullinfo,
    setCodeFullInfo,
    bomsxtable,
    setBOMSXTable,
    bomgiatable,
    setBOMGIATable,
    customerList,
    machineList,
    materialList,
    masterMaterialList,
    selectedMaterial,
    setSelectedMaterial,
    selectedMasterMaterial,
    setSelectedMasterMaterial,
    currentProcessList,
    setCurrentProcessList,
    tempSelectedMachine,
    setTempSelectedMachine,
    tempSelectedProcess,
    loadProcessList,
    fscList,
    defaultDM,
    enableEdit,
    setEnableEdit,
    pinBOM,
    setPinBOM,
    bomsxSelectedRows,
    bomgiaSelectedRows,
    handleSetCodeInfo,
    handleClearInfo,
    handleCODEINFO,
    handleSelectCode,
  } = bomData;

  // 1. Tải template tem LOT thiết kế theo mã G_CODE (fallback: 6E00004A hoặc DEFAULT_AMAZON_TEMPLATE)
  useEffect(() => {
    const targetCode =
      codefullinfo?.G_CODE && codefullinfo.G_CODE !== "-------"
        ? codefullinfo.G_CODE
        : "6E00004A";

    generalQuery("getAMAZON_DESIGN", { G_CODE: targetCode })
      .then((res) => {
        if (res.data.tk_status !== "NG" && res.data.data?.length > 0) {
          const loaded = res.data.data.map((el: COMPONENT_DATA, idx: number) => ({
            ...el,
            id: idx,
          }));
          setTemplateComponents(loaded);
        } else if (targetCode !== "6E00004A") {
          generalQuery("getAMAZON_DESIGN", { G_CODE: "6E00004A" })
            .then((fallbackRes) => {
              if (fallbackRes.data.tk_status !== "NG" && fallbackRes.data.data?.length > 0) {
                const loaded = fallbackRes.data.data.map(
                  (el: COMPONENT_DATA, idx: number) => ({
                    ...el,
                    id: idx,
                  })
                );
                setTemplateComponents(loaded);
              } else {
                setTemplateComponents(DEFAULT_AMAZON_TEMPLATE);
              }
            })
            .catch(() => setTemplateComponents(DEFAULT_AMAZON_TEMPLATE));
        } else {
          setTemplateComponents(DEFAULT_AMAZON_TEMPLATE);
        }
      })
      .catch(() => setTemplateComponents(DEFAULT_AMAZON_TEMPLATE));
  }, [codefullinfo?.G_CODE]);

  // 2. Tự động ánh xạ 100% dữ liệu của mã sản phẩm đang chọn vào tem LOT
  useEffect(() => {
    const emplNo = getUserData()?.EMPL_NO || "ADMIN";
    const mapped = mapComponentListWithCodeInfo(
      templateComponents,
      codefullinfo,
      customerList,
      emplNo
    );
    setComponentList(mapped);
  }, [codefullinfo, templateComponents, customerList]);

  // Hook thao tác nghiệp vụ
  const bomActions = useBOMManagerActions({
    codefullinfo,
    setCodeFullInfo,
    bomsxtable,
    setBOMSXTable,
    bomgiatable,
    setBOMGIATable,
    defaultDM,
    handleCODEINFO,
    handleSelectCode,
    bomsxSelectedRows,
    bomgiaSelectedRows,
    selectedMaterial,
    selectedMasterMaterial,
    currentProcessList,
    setCurrentProcessList,
    tempSelectedMachine,
    tempSelectedProcess,
    machineList,
    loadProcessList,
  });

  const {
    confirmAddNewCode,
    confirmAddNewVer,
    confirmUpdateCode,
    confirmSaveBOMSX,
    confirmSaveBOMGIA,
    handleCloneBOMSX,
    handleAddRowBOMSX,
    handleDeleteRowBOMSX,
    handleAddRowBOMGIA,
    handleDeleteRowBOMGIA,
    handleAddProcess,
    handleDeleteProcess,
    handleSaveProcess,
    confirmResetBanVe,
    handleUploadCAD,
    handleUploadAppsheet,
  } = bomActions;

  // 1. Bảng danh sách mã sản phẩm bên trái
  const codeTableJSX = useMemo(
    () => (
      <AGTable
        toolbar={<></>}
        showFilter={true}
        columns={getColumnCodeInfo(enableEdit)}
        data={codeInfoDataTable}
        onRowClick={(params: any) => handleSelectCode(params.data?.G_CODE)}
      />
    ),
    [codeInfoDataTable, enableEdit, handleSelectCode]
  );

  // 2. Bảng BOM Sản Xuất (BOMSX)
  const bomsxTableJSX = useMemo(
    () => (
      <AGTable
        toolbar={<></>}
        showFilter={false}
        columns={getColumnBOMSX(enableEdit)}
        data={bomsxtable}
        onSelectionChange={(params: any) => {
          bomsxSelectedRows.current = params.api.getSelectedRows();
        }}
      />
    ),
    [bomsxtable, enableEdit]
  );

  // 3. Bảng BOM Giá Thành (Costing BOM)
  const bomgiaTableJSX = useMemo(
    () => (
      <AGTable
        toolbar={<></>}
        showFilter={false}
        columns={getColumnBOMGIA(enableEdit)}
        data={bomgiatable}
        onSelectionChange={(params: any) => {
          bomgiaSelectedRows.current = params.api.getSelectedRows();
        }}
      />
    ),
    [bomgiatable, enableEdit]
  );

  // DataSource cho Pivot Grid đa chiều
  // ⚠️ DevExtreme chỉ được nạp khi user mở pivot (xem components/PivotChart/lazyPivot.ts).
  const [pivotDataSource, setPivotDataSource] = useState<any>(null);
  useEffect(() => {
    if (!showPivot) return; // chưa mở pivot -> không tải DevExtreme
    let cancelled = false;
    void (async () => {
      const ds = await createPivotDataSource({
        fields: [
          { caption: "G_CODE", width: 120, dataField: "G_CODE", area: "row" },
          { caption: "M_CODE", width: 100, dataField: "M_CODE", area: "row" },
          { caption: "M_NAME", width: 160, dataField: "M_NAME", area: "row" },
          { caption: "M_QTY", dataField: "M_QTY", dataType: "number", summaryType: "sum", format: "fixedPoint", area: "data" },
        ],
        store: bomgiatable.length > 0 ? bomgiatable : bomsxtable,
      });
      if (!cancelled) setPivotDataSource(ds);
    })();
    return () => {
      cancelled = true;
    };
  }, [showPivot, bomgiatable, bomsxtable]);

  return (
    <div className="precision-bom">
      {/* Main Workspace: Sidebar + Main Area (Header & KPI removed per user request to maximize vertical space) */}
      <div className="precision-bom__workspace">
        {/* Cột trái: Sidebar điều khiển & danh sách mã */}
        <PrecisionBOMSidebar
          codeCMS={codeCMS}
          setCodeCMS={setCodeCMS}
          cndb={cndb}
          setCNDB={setCNDB}
          activeOnly={activeOnly}
          setActiveOnly={setActiveOnly}
          isLoading={isLoading}
          onSearchCode={handleCODEINFO}
          onSearchKeyDown={(e) => {
            if (e.key === "Enter") handleCODEINFO();
          }}
          onAdd={confirmAddNewCode}
          onAddVer={confirmAddNewVer}
          onOpenBulkUpload={() => setShowBulkModal(true)}
          onUpdate={confirmUpdateCode}
          onClear={handleClearInfo}
          onResetBanVe={confirmResetBanVe}
          onToggleEdit={() => setEnableEdit((prev) => !prev)}
          enableEdit={enableEdit}
          pinBOM={pinBOM}
          onTogglePin={() => setPinBOM((prev) => !prev)}
          onExportEX1={() => {}}
          onExportEX2={() => {}}
          onOpenPivot={() => setShowPivot(true)}
          codeTableJSX={codeTableJSX}
          codeFullInfo={codefullinfo}
          totalCodes={codeInfoDataTable.length}
        />

        {/* Cột phải: Thông số mã hiện hành & 2 Bảng song song 50:50 */}
        <main className={`precision-bom__main${isCodeDetailLoading ? " is-loading" : ""}`}>
          {isCodeDetailLoading && (
            <div className="loading-overlay loading-overlay--detail" role="status" aria-live="polite">
              <span className="loading-spinner" />
              <span>Đang tải thông tin mã và BOM...</span>
            </div>
          )}
          <PrecisionBOMSpecGrid
            codeFullInfo={codefullinfo}
            handleSetCodeInfo={handleSetCodeInfo}
            enableform={!enableEdit}
            customerList={customerList}
            machineList={machineList}
            masterMaterialList={masterMaterialList}
            selectedMasterMaterial={selectedMasterMaterial}
            setSelectedMasterMaterial={setSelectedMasterMaterial}
            currentProcessList={currentProcessList}
            tempSelectedMachine={tempSelectedMachine}
            setTempSelectedMachine={setTempSelectedMachine}
            tempSelectedProcess={tempSelectedProcess}
            onAddProcess={handleAddProcess}
            onDeleteProcess={handleDeleteProcess}
            onSaveProcess={handleSaveProcess}
            fscList={fscList}
            company={company}
            onUploadCAD={handleUploadCAD}
            onUploadAppsheet={handleUploadAppsheet}
            showHideTemLot={showHideTemLot}
            onToggleTemLot={() => setShowHideTemLot((prev) => !prev)}
            onPrintTemLot={handlePrint}
            showProcessGrid={getUserData()?.EMPL_NO === "NHU1903"}
          />

          <PrecisionBOMDualTables
            bomsxTableJSX={bomsxTableJSX}
            bomgiaTableJSX={bomgiaTableJSX}
            onSaveBOMSX={confirmSaveBOMSX}
            onAddRowBOMSX={handleAddRowBOMSX}
            onDeleteRowBOMSX={handleDeleteRowBOMSX}
            onSaveBOMGIA={confirmSaveBOMGIA}
            onAddRowBOMGIA={handleAddRowBOMGIA}
            onDeleteRowBOMGIA={handleDeleteRowBOMGIA}
            onCloneBOMSX={handleCloneBOMSX}
            onToggleDesignBom={() => setShowHideDesignBOM((prev) => !prev)}
            onToggleEdit={() => setEnableEdit((prev) => !prev)}
            enableEdit={enableEdit}
            pinBOM={pinBOM}
            onExportEX1={() => {}}
            onExportEX2={() => {}}
            onOpenPivot={() => setShowPivot(true)}
            bomsxCount={bomsxtable.length}
            bomgiaCount={bomgiatable.length}
            materialList={materialList}
            selectedMaterial={selectedMaterial}
            setSelectedMaterial={setSelectedMaterial}
          />
        </main>
      </div>

      {/* Modal Upload Hàng Loạt */}
      <PrecisionBOMBulkModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        onSuccessReload={() => {
          handleCODEINFO();
          setShowBulkModal(false);
        }}
      />

      {/* Modal PivotTable Xoay Đa Chiều */}
      {showPivot && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 120000,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              width: "95%",
              height: "90vh",
              borderRadius: "8px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
          >
            <div
              style={{
                padding: "8px 16px",
                background: "#0f172a",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid #334155",
              }}
            >
              <span style={{ fontWeight: 600, fontSize: "14px" }}>
                Phân Tích Pivot BOM ({codefullinfo.G_CODE || "MASTER"})
              </span>
              <button
                type="button"
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  border: "none",
                  color: "#ffffff",
                  width: "26px",
                  height: "26px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => setShowPivot(false)}
              >
                <FiX size={16} />
              </button>
            </div>
            <div style={{ padding: "12px", height: "calc(100% - 50px)", overflow: "auto" }}>
              {pivotDataSource ? (
                <PivotTable datasource={pivotDataSource} tableID="BOMPivotMaster" />
              ) : (
                <div className="pivot-loading">Đang tải bảng pivot…</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal BOM Design */}
      {showHideDesignBom && (
        <div className="design_panel" style={{ position: "fixed", inset: 0, zIndex: 110000, background: "#ffffff" }}>
          <div style={{ padding: 8, display: "flex", justifyContent: "flex-end", background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
            <button
              type="button"
              style={{ background: "#e11d48", color: "#fff", border: "none", padding: "4px 14px", borderRadius: 4, cursor: "pointer", fontWeight: 700 }}
              onClick={() => setShowHideDesignBOM(false)}
            >
              Đóng Design BOM
            </button>
          </div>
          <BOM_DESIGN />
        </div>
      )}

      {/* Modal Preview & Print Tem LOT */}
      <PrecisionBOMTemLotModal
        isOpen={showHideTemLot}
        onClose={() => setShowHideTemLot(false)}
        onPrint={handlePrint}
        codeFullInfo={codefullinfo}
        componentList={componentList}
        labelPrintRef={labelprintref}
      />

      {/* Hidden Print Container khi modal đóng để đảm bảo react-to-print luôn có node DOM sẵn sàng */}
      {!showHideTemLot && (
        <div style={{ position: "fixed", left: "-9999px", top: "-9999px", opacity: 0, pointerEvents: "none" }}>
          <div ref={labelprintref} style={{ position: "relative", width: "125mm", height: "65mm" }}>
            {renderElement(componentList)}
          </div>
        </div>
      )}
    </div>
  );
};

export default BOM_MANAGER;

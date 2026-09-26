import React, { useState, useRef } from "react";
import {
  AiFillDelete,
  AiFillFileAdd,
  AiFillPlusCircle,
  AiFillSave,
  AiOutlineCloudUpload,
  AiOutlineDown,
  AiOutlineSearch,
  AiOutlineUp,
} from "react-icons/ai";
import {
  FaBoxes,
  FaCopy,
  FaDraftingCompass,
  FaFilePdf,
  FaMoneyBillWave,
  FaPrint,
  FaRulerCombined,
} from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { BiReset } from "react-icons/bi";
import { MdEditNote, MdOutlineUpdate, MdUpgrade } from "react-icons/md";
import { Autocomplete, createFilterOptions, TextField } from "@mui/material";
import { CODE_FULL_INFO } from "../../interfaces/rndInterface";
import { MaterialListData } from "../../../qc/interfaces/qcInterface";
import PrecisionBOMMobileActionDrawer from "./PrecisionBOMMobileActionDrawer";

const filterOptionsMaterial = createFilterOptions({
  matchFrom: "any",
  limit: 80,
});

interface PrecisionBOMMobileViewProps {
  codeCMS: string;
  setCodeCMS: (val: string) => void;
  activeOnly: boolean;
  setActiveOnly: (val: boolean) => void;
  cndb: boolean;
  setCNDB: (val: boolean) => void;
  onSearchCode: () => void;
  isLoading: boolean;
  isCodeDetailLoading: boolean;
  codefullinfo: CODE_FULL_INFO;
  codeTableJSX: React.ReactNode;
  bomsxTableJSX: React.ReactNode;
  bomgiaTableJSX: React.ReactNode;
  specGridJSX: React.ReactNode;
  codeCount: number;
  bomsxCount: number;
  bomgiaCount: number;
  enableEdit: boolean;
  onToggleEdit: () => void;
  pinBOM: boolean;
  onTogglePin: () => void;
  onExportEX1: () => void;
  onExportEX2: () => void;
  onOpenPivot: () => void;
  onNew: () => void;
  onAdd: () => void;
  onAddVer: () => void;
  onOpenBulkUpload: () => void;
  onUpdate: () => void;
  onClear: () => void;
  onResetBanVe: () => void;
  onSaveBOMSX: () => void;
  onAddRowBOMSX: () => void;
  onDeleteRowBOMSX: () => void;
  onSaveBOMGIA: () => void;
  onAddRowBOMGIA: () => void;
  onDeleteRowBOMGIA: () => void;
  onCloneBOMSX: () => void;
  onToggleDesignBom: () => void;
  onToggleTemLot: () => void;
  materialList: MaterialListData[];
  selectedMaterial: MaterialListData | null;
  setSelectedMaterial: (val: MaterialListData | null) => void;
}

const PrecisionBOMMobileView: React.FC<PrecisionBOMMobileViewProps> = ({
  codeCMS,
  setCodeCMS,
  activeOnly,
  setActiveOnly,
  cndb,
  setCNDB,
  onSearchCode,
  isLoading,
  isCodeDetailLoading,
  codefullinfo,
  codeTableJSX,
  bomsxTableJSX,
  bomgiaTableJSX,
  specGridJSX,
  codeCount,
  bomsxCount,
  bomgiaCount,
  enableEdit,
  onToggleEdit,
  pinBOM,
  onTogglePin,
  onExportEX1,
  onExportEX2,
  onOpenPivot,
  onNew,
  onAdd,
  onAddVer,
  onOpenBulkUpload,
  onUpdate,
  onClear,
  onResetBanVe,
  onSaveBOMSX,
  onAddRowBOMSX,
  onDeleteRowBOMSX,
  onSaveBOMGIA,
  onAddRowBOMGIA,
  onDeleteRowBOMGIA,
  onCloneBOMSX,
  onToggleDesignBom,
  onToggleTemLot,
  materialList,
  selectedMaterial,
  setSelectedMaterial,
}) => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [expandCode, setExpandCode] = useState(true);
  const [expandSpec, setExpandSpec] = useState(true);
  const [expandBomsx, setExpandBomsx] = useState(true);
  const [expandBomgia, setExpandBomgia] = useState(true);

  const contentAreaRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearchCode();
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="precision-bom-mobile">
      {/* 1. STICKY TOP CONTROLS: SEARCH & ACTIONS */}
      <header className="mobile-header">
        {/* Hàng 1: Search Box + Nút Tìm + Filter Pills + Nút Thao Tác Drawer */}
        <div className="mobile-search-row">
          <div className="mobile-search-input-wrap">
            <input
              type="text"
              className="mobile-search-input"
              placeholder="Nhập mã sản phẩm..."
              value={codeCMS}
              onChange={(e) => setCodeCMS(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {codeCMS && (
              <button
                type="button"
                className="mobile-input-clear-btn"
                onClick={() => setCodeCMS("")}
                aria-label="Xóa tìm kiếm"
              >
                <FiX size={15} />
              </button>
            )}
          </div>

          <button
            type="button"
            className="mobile-btn-search"
            onClick={onSearchCode}
            disabled={isLoading}
            aria-label="Tìm kiếm"
          >
            <AiOutlineSearch size={16} />
            <span>Tìm</span>
          </button>

          <button
            type="button"
            className={`mobile-chip-toggle ${activeOnly ? "is-active" : ""}`}
            onClick={() => setActiveOnly(!activeOnly)}
          >
            Active
          </button>

          <button
            type="button"
            className={`mobile-chip-toggle ${cndb ? "is-active" : ""}`}
            onClick={() => setCNDB(!cndb)}
          >
            CNDB
          </button>

          <button
            type="button"
            className="mobile-btn-action-menu"
            onClick={() => setShowDrawer(true)}
            title="Mở menu thao tác ERP"
          >
            ⚡ Menu
          </button>
        </div>

        {/* Hàng 2: Thanh cuộn ngang các shortcut thao tác nhanh */}
        <div className="mobile-actions-scroll">
          {codefullinfo?.G_CODE && (
            <div
              className="mobile-current-code-tag"
              onClick={() => scrollToSection("mobile-sec-spec")}
              title="Cuộn tới thông số mã đang chọn"
            >
              <span className="code-dot">●</span>
              <span className="code-title">{codefullinfo.G_CODE}</span>
              <span className="code-rev">Rev.{codefullinfo.REV_NO || "A"}</span>
            </div>
          )}

          <button
            type="button"
            className={`mobile-pill-btn ${enableEdit ? "mobile-pill-btn--primary" : ""}`}
            onClick={onToggleEdit}
          >
            <MdEditNote size={13} />
            <span>{enableEdit ? "Tắt Sửa" : "Bật Sửa"}</span>
          </button>

          <button
            type="button"
            className={`mobile-pill-btn ${pinBOM ? "mobile-pill-btn--primary" : ""}`}
            onClick={onTogglePin}
          >
            <span>{pinBOM ? "Đã Ghim" : "Ghim"}</span>
          </button>

          <button type="button" className="mobile-pill-btn" onClick={onExportEX1}>
            EX1
          </button>
          <button type="button" className="mobile-pill-btn" onClick={onExportEX2}>
            EX2
          </button>
          <button type="button" className="mobile-pill-btn mobile-pill-btn--amber" onClick={onOpenPivot}>
            PIVOT
          </button>
          <button type="button" className="mobile-pill-btn" onClick={onToggleTemLot}>
            Tem LOT
          </button>
        </div>

        {/* Hàng 3: Jump Anchors (Nhảy nhanh tới các khối khi cuộn trang) */}
        <nav className="mobile-tabs-bar" aria-label="Điều hướng nhanh các khối">
          <button
            type="button"
            className="mobile-tab-btn"
            onClick={() => scrollToSection("mobile-sec-code")}
          >
            <span>📋 Mã SP</span>
            <span className="tab-badge">{codeCount}</span>
          </button>

          <button
            type="button"
            className="mobile-tab-btn"
            onClick={() => scrollToSection("mobile-sec-spec")}
          >
            <span>📐 Thông Số</span>
          </button>

          <button
            type="button"
            className="mobile-tab-btn"
            onClick={() => scrollToSection("mobile-sec-bomsx")}
          >
            <span>⚙️ BOM SX</span>
            <span className="tab-badge tab-badge--emerald">{bomsxCount}</span>
          </button>

          <button
            type="button"
            className="mobile-tab-btn"
            onClick={() => scrollToSection("mobile-sec-bomgia")}
          >
            <span>💰 BOM Giá</span>
            <span className="tab-badge tab-badge--indigo">{bomgiaCount}</span>
          </button>
        </nav>
      </header>

      {/* 2. MAIN SCROLLABLE BODY: HIỂN THỊ TOÀN BỘ CÁC KHỐI CUỘN TỰ DO */}
      <main className="mobile-content-area" ref={contentAreaRef}>
        {/* Loading Overlay */}
        {(isLoading || isCodeDetailLoading) && (
          <div className="mobile-loading-overlay">
            <span className="loading-spinner" />
            <span>Đang tải dữ liệu...</span>
          </div>
        )}

        {/* KHỐI 1: DANH SÁCH MÃ SẢN PHẨM */}
        <section id="mobile-sec-code" className="mobile-section-card">
          <div className="section-card-header" onClick={() => setExpandCode(!expandCode)}>
            <div className="header-left">
              <span className="section-icon">📋</span>
              <span className="section-title">1. DANH SÁCH MÃ SẢN PHẨM</span>
              <span className="section-count">{codeCount} mã</span>
            </div>
            <button
              type="button"
              className="btn-toggle-expand"
              onClick={(e) => {
                e.stopPropagation();
                setExpandCode(!expandCode);
              }}
              aria-label={expandCode ? "Thu gọn bảng mã" : "Mở rộng bảng mã"}
            >
              {expandCode ? <AiOutlineUp size={14} /> : <AiOutlineDown size={14} />}
            </button>
          </div>

          {expandCode && (
            <div className="section-card-body">
              <div className="mobile-table-container">{codeTableJSX}</div>
              <div className="mobile-card-quickbar">
                <button type="button" className="btn-quick btn-quick--new" onClick={onNew}>
                  <AiFillPlusCircle size={13} /> NEW
                </button>
                <button type="button" className="btn-quick btn-quick--add" onClick={onAdd}>
                  <AiFillFileAdd size={13} /> ADD
                </button>
                <button type="button" className="btn-quick btn-quick--addver" onClick={onAddVer}>
                  <MdUpgrade size={13} /> VER
                </button>
                <button type="button" className="btn-quick btn-quick--update" onClick={onUpdate}>
                  <MdOutlineUpdate size={13} /> UPDATE
                </button>
                <button type="button" className="btn-quick btn-quick--bulk" onClick={onOpenBulkUpload}>
                  <AiOutlineCloudUpload size={13} /> UP LOẠT
                </button>
              </div>
            </div>
          )}
        </section>

        {/* KHỐI 2: THÔNG SỐ SẢN PHẨM & BẢN VẼ */}
        <section id="mobile-sec-spec" className="mobile-section-card">
          <div className="section-card-header" onClick={() => setExpandSpec(!expandSpec)}>
            <div className="header-left">
              <span className="section-icon">📐</span>
              <span className="section-title">
                2. THÔNG SỐ: {codefullinfo?.G_CODE || "CHƯA CHỌN MÃ"}
              </span>
              <span className="section-rev">Rev.{codefullinfo?.REV_NO || "A"}</span>
            </div>
            <button
              type="button"
              className="btn-toggle-expand"
              onClick={(e) => {
                e.stopPropagation();
                setExpandSpec(!expandSpec);
              }}
              aria-label={expandSpec ? "Thu gọn thông số" : "Mở rộng thông số"}
            >
              {expandSpec ? <AiOutlineUp size={14} /> : <AiOutlineDown size={14} />}
            </button>
          </div>

          {expandSpec && (
            <div className="section-card-body">
              {/* Thanh thao tác nhanh spec */}
              <div className="spec-quick-actions">
                {codefullinfo?.G_CODE ? (
                  <a
                    className="spec-action-chip spec-action-chip--pdf"
                    href={`/banve/${codefullinfo.G_CODE}.pdf?v=${Date.now()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaFilePdf size={12} /> Xem Bản Vẽ PDF
                  </a>
                ) : (
                  <span className="spec-action-chip spec-action-chip--disabled">
                    <FaFilePdf size={12} /> Chưa có bản vẽ
                  </span>
                )}
                <button
                  type="button"
                  className="spec-action-chip spec-action-chip--tem"
                  onClick={onToggleTemLot}
                >
                  <FaPrint size={12} /> In Tem LOT
                </button>
                <button
                  type="button"
                  className="spec-action-chip"
                  onClick={onResetBanVe}
                >
                  <BiReset size={12} /> Reset Bản Vẽ
                </button>
                <button
                  type="button"
                  className="spec-action-chip spec-action-chip--clear"
                  onClick={onClear}
                >
                  <AiFillDelete size={12} /> Clear Form
                </button>
              </div>

              {/* Lưới thông số spec */}
              <div className="mobile-spec-content">{specGridJSX}</div>
            </div>
          )}
        </section>

        {/* KHỐI 3: BOM SẢN XUẤT (BOMSX) */}
        <section id="mobile-sec-bomsx" className="mobile-section-card">
          <div className="section-card-header section-card-header--emerald" onClick={() => setExpandBomsx(!expandBomsx)}>
            <div className="header-left">
              <FaBoxes size={14} color="#059669" />
              <span className="section-title">3. BOM SẢN XUẤT (BOMSX)</span>
              <span className="section-count">{bomsxCount} NVL</span>
            </div>
            <button
              type="button"
              className="btn-toggle-expand"
              onClick={(e) => {
                e.stopPropagation();
                setExpandBomsx(!expandBomsx);
              }}
              aria-label={expandBomsx ? "Thu gọn BOMSX" : "Mở rộng BOMSX"}
            >
              {expandBomsx ? <AiOutlineUp size={14} /> : <AiOutlineDown size={14} />}
            </button>
          </div>

          {expandBomsx && (
            <div className="section-card-body">
              {/* Autocomplete chọn NVL */}
              <div className="mobile-material-bar">
                <Autocomplete
                  size="small"
                  options={materialList}
                  className="mobile-material-autocomplete"
                  filterOptions={filterOptionsMaterial}
                  getOptionLabel={(option: any) =>
                    `${option.M_NAME || ""}|${option.WIDTH_CD || 0}|${option.M_CODE || ""}`
                  }
                  isOptionEqualToValue={(option: any, value: any) => option.M_CODE === value?.M_CODE}
                  value={selectedMaterial}
                  onChange={(_, newValue: any) => setSelectedMaterial(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder="Chọn NVL trước khi thêm..."
                      sx={{
                        width: "100%",
                        "& .MuiInputBase-root": { height: 36, fontSize: 13, background: "#ffffff" },
                      }}
                    />
                  )}
                  renderOption={(props, option: any) => (
                    <li {...props} style={{ fontSize: "12px", padding: "6px 8px" }}>
                      <strong style={{ color: "#2563eb", marginRight: 6 }}>{option.M_CODE}</strong>
                      <span>{option.M_NAME} ({option.WIDTH_CD}mm)</span>
                    </li>
                  )}
                />
              </div>

              {/* Toolbar nút thao tác BOMSX */}
              <div className="mobile-panel-toolbar">
                <button type="button" className="btn-tool-mob btn-tool-mob--save" onClick={onSaveBOMSX}>
                  <AiFillSave size={13} /> Lưu BOM
                </button>
                <button type="button" className="btn-tool-mob btn-tool-mob--add" onClick={onAddRowBOMSX}>
                  <AiFillPlusCircle size={13} /> Thêm Dòng
                </button>
                <button type="button" className="btn-tool-mob btn-tool-mob--delete" onClick={onDeleteRowBOMSX}>
                  <AiFillDelete size={13} /> Xóa Dòng
                </button>
                <button type="button" className="btn-tool-mob btn-tool-mob--design" onClick={onToggleDesignBom}>
                  <FaDraftingCompass size={13} /> Design
                </button>
              </div>

              {/* Bảng BOMSX */}
              <div className="mobile-table-container">{bomsxTableJSX}</div>
            </div>
          )}
        </section>

        {/* KHỐI 4: BOM GIÁ THÀNH (BOMGIA) */}
        <section id="mobile-sec-bomgia" className="mobile-section-card">
          <div className="section-card-header section-card-header--indigo" onClick={() => setExpandBomgia(!expandBomgia)}>
            <div className="header-left">
              <FaMoneyBillWave size={14} color="#4f46e5" />
              <span className="section-title">4. BOM GIÁ THÀNH (COSTING BOM)</span>
              <span className="section-count">{bomgiaCount} NVL</span>
            </div>
            <button
              type="button"
              className="btn-toggle-expand"
              onClick={(e) => {
                e.stopPropagation();
                setExpandBomgia(!expandBomgia);
              }}
              aria-label={expandBomgia ? "Thu gọn BOM Giá" : "Mở rộng BOM Giá"}
            >
              {expandBomgia ? <AiOutlineUp size={14} /> : <AiOutlineDown size={14} />}
            </button>
          </div>

          {expandBomgia && (
            <div className="section-card-body">
              {/* Toolbar nút thao tác BOMGIA */}
              <div className="mobile-panel-toolbar">
                <button type="button" className="btn-tool-mob btn-tool-mob--clone" onClick={onCloneBOMSX}>
                  <FaCopy size={12} /> Clone BOMSX
                </button>
                <button type="button" className="btn-tool-mob btn-tool-mob--save-indigo" onClick={onSaveBOMGIA}>
                  <AiFillSave size={13} /> Lưu Giá
                </button>
                <button type="button" className="btn-tool-mob btn-tool-mob--add" onClick={onAddRowBOMGIA}>
                  <AiFillPlusCircle size={13} /> Thêm Dòng
                </button>
                <button type="button" className="btn-tool-mob btn-tool-mob--delete" onClick={onDeleteRowBOMGIA}>
                  <AiFillDelete size={13} /> Xóa Dòng
                </button>
              </div>

              {/* Bảng BOMGIA */}
              <div className="mobile-table-container">{bomgiaTableJSX}</div>
            </div>
          )}
        </section>

        {/* Khoảng đệm chân trang để không bị che bởi thanh điều hướng trình duyệt */}
        <div style={{ height: "60px", flexShrink: 0 }} />
      </main>

      {/* 3. MOBILE ACTION DRAWER (BOTTOM SHEET) */}
      <PrecisionBOMMobileActionDrawer
        isOpen={showDrawer}
        onClose={() => setShowDrawer(false)}
        codeFullInfo={codefullinfo}
        enableEdit={enableEdit}
        pinBOM={pinBOM}
        onNew={onNew}
        onAdd={onAdd}
        onAddVer={onAddVer}
        onOpenBulkUpload={onOpenBulkUpload}
        onUpdate={onUpdate}
        onClear={onClear}
        onResetBanVe={onResetBanVe}
        onToggleEdit={onToggleEdit}
        onTogglePin={onTogglePin}
        onExportEX1={onExportEX1}
        onExportEX2={onExportEX2}
        onOpenPivot={onOpenPivot}
        onToggleDesignBom={onToggleDesignBom}
        onToggleTemLot={onToggleTemLot}
      />
    </div>
  );
};

export default React.memo(PrecisionBOMMobileView);

import React from "react";
import {
  AiFillDelete,
  AiFillFileAdd,
  AiOutlineCloudUpload,
  AiOutlinePushpin,
  AiOutlineSearch,
} from "react-icons/ai";
import { BiReset } from "react-icons/bi";
import { FaFilePdf, FaListAlt } from "react-icons/fa";
import { MdEditNote, MdOutlineUpdate, MdUpgrade } from "react-icons/md";
import CodeVisualLize from "../../../kinhdoanh/quotationmanager/CodeVisualize/CodeVisualLize";
import { CODE_FULL_INFO } from "../../interfaces/rndInterface";

interface PrecisionBOMSidebarProps {
  codeCMS: string;
  setCodeCMS: (val: string) => void;
  cndb: boolean;
  setCNDB: (val: boolean) => void;
  activeOnly: boolean;
  setActiveOnly: (val: boolean) => void;
  onSearchCode: () => void;
  onSearchKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onAdd: () => void;
  onAddVer: () => void;
  onOpenBulkUpload: () => void;
  onUpdate: () => void;
  onClear: () => void;
  onResetBanVe: () => void;
  onToggleEdit: () => void;
  enableEdit: boolean;
  pinBOM: boolean;
  onTogglePin: () => void;
  onExportEX1: () => void;
  onExportEX2: () => void;
  onOpenPivot: () => void;
  codeTableJSX: React.ReactNode;
  codeFullInfo: CODE_FULL_INFO;
  totalCodes: number;
}

const PrecisionBOMSidebar: React.FC<PrecisionBOMSidebarProps> = ({
  codeCMS,
  setCodeCMS,
  cndb,
  setCNDB,
  activeOnly,
  setActiveOnly,
  onSearchCode,
  onSearchKeyDown,
  onAdd,
  onAddVer,
  onOpenBulkUpload,
  onUpdate,
  onClear,
  onResetBanVe,
  onToggleEdit,
  enableEdit,
  pinBOM,
  onTogglePin,
  onExportEX1,
  onExportEX2,
  onOpenPivot,
  codeTableJSX,
  codeFullInfo,
  totalCodes,
}) => {
  return (
    <aside className="precision-bom__sidebar">
      {/* Top Search & Action Card */}
      <div className="sidebar-card">
        <div className="card-title-bar">
          <div className="title">
            <FaListAlt size={13} color="#2563eb" />
            <span>Danh Sách Mã BOM</span>
          </div>
          <span className="count-badge">{totalCodes.toLocaleString("en-US")} MÃ</span>
        </div>

        {/* Code Search Input Form */}
        <div className="search-form">
          <input
            className="search-input"
            type="text"
            placeholder="MÃ CODE..."
            value={codeCMS}
            onChange={(e) => setCodeCMS(e.target.value)}
            onKeyDown={onSearchKeyDown}
          />
          <label className="checkbox-label" title="Chỉ lấy mã đang kích hoạt">
            <input
              type="checkbox"
              checked={activeOnly}
              onChange={(e) => setActiveOnly(e.target.checked)}
            />
            <span>Active</span>
          </label>
          <label className="checkbox-label" title="Chỉ mã công nghệ đặc biệt (CNDB)">
            <input
              type="checkbox"
              checked={cndb}
              onChange={(e) => setCNDB(e.target.checked)}
            />
            <span>CNDB</span>
          </label>
          <button className="btn-search" onClick={onSearchCode} title="Tìm mã sản phẩm">
            <AiOutlineSearch size={13} />
          </button>
        </div>

        {/* Action Command Palette: ADD, ADD VER, UP LOẠT (ngay cạnh ADD VER), UPDATE, CLEAR */}
        <div className="action-buttons-grid">
          {/* Nút 1: ADD */}
          <button
            className="btn-action btn-action--add"
            onClick={onAdd}
            title="Tạo mã BOM mới hoàn toàn"
          >
            <AiFillFileAdd size={13} />
            <span>ADD</span>
          </button>

          {/* Nút 2: ADD VER */}
          <button
            className="btn-action btn-action--add-ver"
            onClick={onAddVer}
            title="Thêm phiên bản mới (Rev) cho mã hiện hành"
          >
            <MdUpgrade size={14} />
            <span>ADD VER</span>
          </button>

          {/* Nút 3: UP LOẠT (Đặt ngay cạnh ADD VER theo yêu cầu người dùng) */}
          <button
            className="btn-action btn-action--bulk-up"
            onClick={onOpenBulkUpload}
            title="Nạp dữ liệu hàng loạt từ file Excel"
          >
            <AiOutlineCloudUpload size={14} />
            <span>UP LOẠT</span>
          </button>

          {/* Nút 4: UPDATE */}
          <button
            className="btn-action btn-action--update"
            onClick={onUpdate}
            title="Cập nhật thông số mã hiện hành"
          >
            <MdOutlineUpdate size={14} />
            <span>UPDATE</span>
          </button>

          {/* Nút 5: CLEAR */}
          <button
            className="btn-action btn-action--clear"
            onClick={onClear}
            title="Xóa trắng form nhập liệu"
            style={{ gridColumn: "span 2" }}
          >
            <AiFillDelete size={13} />
            <span>CLEAR FORM</span>
          </button>
        </div>

        {/* Secondary Subtools */}
        <div className="quick-subtools">
          <button className="tool-link" onClick={onResetBanVe} title="Khôi phục link bản vẽ">
            <BiReset size={12} /> Reset BV
          </button>
          <button
            className={`tool-link tool-link--edit`}
            onClick={onToggleEdit}
            title="Bật/Tắt chế độ chỉnh sửa"
          >
            <MdEditNote size={12} /> {enableEdit ? "Tắt Sửa" : "Bật Sửa"}
          </button>
          <button
            className={`tool-link tool-link--pin ${pinBOM ? "pinned" : ""}`}
            onClick={onTogglePin}
            title="Ghim BOM hiện hành"
          >
            <AiOutlinePushpin size={12} /> {pinBOM ? "Đã Ghim" : "Ghim"}
          </button>
          <div className="export-group">
            <span className="chip-export chip-export--green" onClick={onExportEX1} title="Xuất lưới đang xem">
              EX1
            </span>
            <span className="chip-export chip-export--green" onClick={onExportEX2} title="Xuất dữ liệu gốc">
              EX2
            </span>
            <span className="chip-export chip-export--amber" onClick={onOpenPivot} title="Phân tích xoay Pivot">
              PIVOT
            </span>
          </div>
        </div>
      </div>

      {/* Code List High-Density Grid */}
      <div className="sidebar-card code-list-card">
        <div className="table-container">{codeTableJSX}</div>
      </div>

      {/* Product Visualizer & Drawing link */}
      <div className="visualizer-card">
        <CodeVisualLize
          DATA={{
            id: 0,
            Q_ID: "",
            G_CODE: codeFullInfo?.G_CODE || "",
            WIDTH_OFFSET: 0,
            LENGTH_OFFSET: 0,
            KNIFE_UNIT: 0,
            FILM_UNIT: 0,
            INK_UNIT: 0,
            LABOR_UNIT: 0,
            DELIVERY_UNIT: 0,
            DEPRECATION_UNIT: 0,
            GMANAGEMENT_UNIT: 0,
            M_LOSS_UNIT: 0,
            G_WIDTH: codeFullInfo?.G_WIDTH ?? 0,
            G_LENGTH: codeFullInfo?.G_LENGTH ?? 0,
            G_C: codeFullInfo?.G_C ?? 0,
            G_C_R: codeFullInfo?.G_C_R ?? 0,
            G_LG: codeFullInfo?.G_LG ?? 0,
            G_CG: codeFullInfo?.G_CG ?? 0,
            G_SG_L: codeFullInfo?.G_SG_L ?? 0,
            G_SG_R: codeFullInfo?.G_SG_R ?? 0,
            PROD_PRINT_TIMES: 0,
            KNIFE_COST: 0,
            FILM_COST: 0,
            INK_COST: 0,
            LABOR_COST: 0,
            DELIVERY_COST: 0,
            DEPRECATION_COST: 0,
            GMANAGEMENT_COST: 0,
            MATERIAL_COST: 0,
            TOTAL_COST: 0,
            SALE_PRICE: 0,
            PROFIT: 0,
            G_NAME: codeFullInfo?.G_NAME || "",
            G_NAME_KD: codeFullInfo?.G_NAME_KD || "",
            CUST_NAME_KD: "",
            CUST_CD: codeFullInfo?.CUST_CD || "",
          }}
        />
        <div className="drawing-link-bar">
          <span style={{ fontSize: "10px", color: "#64748b" }}>CAD Drawing:</span>
          {codeFullInfo?.G_CODE ? (
            <a
              className="cad-link"
              target="_blank"
              rel="noopener noreferrer"
              href={`/banve/${codeFullInfo.G_CODE}.pdf?v=${Date.now()}`}
            >
              <FaFilePdf size={12} />
              <span>{codeFullInfo.G_CODE}.pdf</span>
            </a>
          ) : (
            <span style={{ fontSize: "10px", color: "#94a3b8" }}>Chưa có file</span>
          )}
        </div>
      </div>
    </aside>
  );
};

export default React.memo(PrecisionBOMSidebar);

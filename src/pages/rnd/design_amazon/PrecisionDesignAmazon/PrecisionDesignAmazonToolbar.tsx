import React from "react";
import { BiSave, BiPrinter, BiMagnet } from "react-icons/bi";
import { TbComponents } from "react-icons/tb";
import {
  MdUndo,
  MdRedo,
  MdZoomIn,
  MdZoomOut,
  MdCenterFocusStrong,
  MdGridOn,
  MdGridOff,
} from "react-icons/md";
import { Tooltip } from "@mui/material";
import { GridStyle, PaletteItem, PrintOffset } from "./designAmazonTypes";

interface PrecisionDesignAmazonToolbarProps {
  onSave: () => void;
  onUndo: () => void;
  canUndo: boolean;
  onRedo: () => void;
  canRedo: boolean;
  onPrint: () => void;
  onPrintUSB: () => void;
  printOffsetMm: PrintOffset;
  onUpdatePrintOffset: (next: PrintOffset) => void;
  enableSnap: boolean;
  setEnableSnap: (val: boolean) => void;
  showGrid: boolean;
  setShowGrid: (val: boolean) => void;
  gridMm: number;
  setGridMm: (val: number) => void;
  gridStyle: GridStyle;
  setGridStyle: (val: GridStyle) => void;
  scale: number;
  setScale: (val: number) => void;
  zoomPresets: number[];
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  paletteItems: PaletteItem[];
}

export const PrecisionDesignAmazonToolbar: React.FC<PrecisionDesignAmazonToolbarProps> = ({
  onSave,
  onUndo,
  canUndo,
  onRedo,
  canRedo,
  onPrint,
  onPrintUSB,
  printOffsetMm,
  onUpdatePrintOffset,
  enableSnap,
  setEnableSnap,
  showGrid,
  setShowGrid,
  gridMm,
  setGridMm,
  gridStyle,
  setGridStyle,
  scale,
  setScale,
  zoomPresets,
  zoomIn,
  zoomOut,
  resetZoom,
  paletteItems,
}) => {
  const safePalette = paletteItems || [];
  const safePresets = zoomPresets || [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4];
  const safeOffset = printOffsetMm || { x: 0, y: 0 };

  return (
    <div className="precision-amz-design__ribbon">
      {/* Group 1: Core Actions */}
      <div className="precision-amz-design__ribbonGroup">
        <span className="precision-amz-design__groupLabel">THAO TÁC</span>
        <div className="precision-amz-design__groupContent">
          <Tooltip title="Lưu thiết kế vào cơ sở dữ liệu (Ghi đè BOM thiết kế)">
            <button
              type="button"
              className="precision-amz-design__btn precision-amz-design__btn--save"
              onClick={onSave}
            >
              <BiSave size={16} />
              <span>LƯU DESIGN</span>
            </button>
          </Tooltip>

          <Tooltip title="Hoàn tác thao tác trước (Ctrl + Z)">
            <button
              type="button"
              className="precision-amz-design__btn precision-amz-design__btn--icon"
              onClick={onUndo}
              disabled={!canUndo}
            >
              <MdUndo size={16} />
              <span>Undo</span>
            </button>
          </Tooltip>

          <Tooltip title="Làm lại thao tác vừa hoàn tác (Ctrl + Y hoặc Ctrl + Shift + Z)">
            <button
              type="button"
              className="precision-amz-design__btn precision-amz-design__btn--icon"
              onClick={onRedo}
              disabled={!canRedo}
            >
              <MdRedo size={16} />
              <span>Redo</span>
            </button>
          </Tooltip>

          <Tooltip title="In tem nhãn thực tế qua Web Print">
            <button
              type="button"
              className="precision-amz-design__btn precision-amz-design__btn--print"
              onClick={onPrint}
            >
              <BiPrinter size={16} />
              <span>IN TEM</span>
            </button>
          </Tooltip>

          <Tooltip title="Kết nối trực tiếp máy in nhãn USB">
            <button
              type="button"
              className="precision-amz-design__btn precision-amz-design__btn--ghost"
              onClick={onPrintUSB}
            >
              <BiPrinter size={15} />
              <span>USB Print</span>
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="precision-amz-design__groupDivider" />

      {/* Group 2: Print Calibration Offsets */}
      <div className="precision-amz-design__ribbonGroup">
        <span className="precision-amz-design__groupLabel">BÙ LỀ IN (MM)</span>
        <div className="precision-amz-design__groupContent">
          <div className="precision-amz-design__offsetInput" title="Khoảng dịch chuyển lề in theo trục ngang X (mm)">
            <span className="precision-amz-design__offsetTag">X:</span>
            <input
              type="number"
              step={0.01}
              value={Number.isFinite(safeOffset.x) ? safeOffset.x : 0}
              onChange={(e) => {
                const v = Number(e.target.value);
                onUpdatePrintOffset({ x: Number.isFinite(v) ? v : 0, y: safeOffset.y });
              }}
            />
          </div>

          <div className="precision-amz-design__offsetInput" title="Khoảng dịch chuyển lề in theo trục dọc Y (mm)">
            <span className="precision-amz-design__offsetTag">Y:</span>
            <input
              type="number"
              step={0.01}
              value={Number.isFinite(safeOffset.y) ? safeOffset.y : 0}
              onChange={(e) => {
                const v = Number(e.target.value);
                onUpdatePrintOffset({ x: safeOffset.x, y: Number.isFinite(v) ? v : 0 });
              }}
            />
          </div>
        </div>
      </div>

      <div className="precision-amz-design__groupDivider" />

      {/* Group 3: Precision Snapping & Grid */}
      <div className="precision-amz-design__ribbonGroup">
        <span className="precision-amz-design__groupLabel">BẮT ĐIỂM & LƯỚI</span>
        <div className="precision-amz-design__groupContent">
          <Tooltip title={enableSnap ? "Tắt tự động bắt dính đối tượng" : "Bật bắt dính thông minh (Smart Snap lines)"}>
            <button
              type="button"
              className={`precision-amz-design__btn precision-amz-design__btn--toggle ${
                enableSnap ? "is-active" : ""
              }`}
              onClick={() => setEnableSnap(!enableSnap)}
            >
              <BiMagnet size={16} />
              <span>Snap</span>
            </button>
          </Tooltip>

          <Tooltip title={showGrid ? "Ẩn lưới milimet" : "Hiện lưới milimet"}>
            <button
              type="button"
              className={`precision-amz-design__btn precision-amz-design__btn--toggle ${
                showGrid ? "is-active" : ""
              }`}
              onClick={() => setShowGrid(!showGrid)}
            >
              {showGrid ? <MdGridOn size={16} /> : <MdGridOff size={16} />}
              <span>Lưới</span>
            </button>
          </Tooltip>

          <select
            className="precision-amz-design__select"
            value={gridMm}
            onChange={(e) => setGridMm(Number(e.target.value))}
            title="Bước lưới milimet"
          >
            <option value={10}>10 mm</option>
            <option value={5}>5 mm</option>
            <option value={2}>2 mm</option>
            <option value={1}>1 mm</option>
          </select>

          <select
            className="precision-amz-design__select"
            value={gridStyle}
            onChange={(e) => setGridStyle(e.target.value as GridStyle)}
            title="Kiểu đường lưới"
          >
            <option value="dashed">Nét Đứt</option>
            <option value="solid">Nét Liền</option>
          </select>
        </div>
      </div>

      <div className="precision-amz-design__groupDivider" />

      {/* Group 4: Zoom Controls */}
      <div className="precision-amz-design__ribbonGroup">
        <span className="precision-amz-design__groupLabel">THU PHÓNG</span>
        <div className="precision-amz-design__groupContent">
          <Tooltip title="Thu nhỏ (Ctrl + Wheel Down)">
            <button
              type="button"
              className="precision-amz-design__iconSquareBtn"
              onClick={zoomOut}
            >
              <MdZoomOut size={16} />
            </button>
          </Tooltip>

          <select
            className="precision-amz-design__select precision-amz-design__select--zoom"
            value={scale}
            onChange={(e) => {
              const next = Number(e.target.value);
              if (Number.isFinite(next)) setScale(next);
            }}
          >
            {safePresets.map((z) => (
              <option key={z} value={z}>
                {Math.round(z * 100)}%
              </option>
            ))}
          </select>

          <Tooltip title="Phóng to (Ctrl + Wheel Up)">
            <button
              type="button"
              className="precision-amz-design__iconSquareBtn"
              onClick={zoomIn}
            >
              <MdZoomIn size={16} />
            </button>
          </Tooltip>

          <Tooltip title="Đặt lại tỷ lệ chuẩn 100% và về gốc tọa độ">
            <button
              type="button"
              className="precision-amz-design__iconSquareBtn"
              onClick={resetZoom}
            >
              <MdCenterFocusStrong size={16} />
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="precision-amz-design__groupDivider" />

      {/* Group 5: Palette Components */}
      <div className="precision-amz-design__ribbonGroup precision-amz-design__ribbonGroup--palette">
        <span className="precision-amz-design__groupLabel">KÉO THẢ ĐỐI TƯỢNG VÀO CANVAS</span>
        <div className="precision-amz-design__paletteList">
          {safePalette.map((it) => (
            <div
              key={it.type}
              className="precision-amz-design__paletteItem"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("amz/newComponentType", it.type);
                e.dataTransfer.effectAllowed = "copy";
              }}
              title={`Kéo thả ${it.label} vào vị trí bất kỳ trên tem`}
            >
              <TbComponents size={14} className="precision-amz-design__paletteIcon" />
              <span className="precision-amz-design__paletteTag">{it.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

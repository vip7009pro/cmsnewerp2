import React from "react";
import { COMPONENT_DATA } from "../../interfaces/rndInterface";
import { renderElement } from "../../../../api/services/utilService";
import {
  ActiveHandleBox,
  LiveOverlayState,
  PrintOffset,
  RotateDragState,
  SnapLine,
} from "./designAmazonTypes";

interface PrecisionDesignAmazonCanvasProps {
  designRef: React.RefObject<HTMLDivElement>;
  scale: number;
  x: number;
  y: number;
  showGrid: boolean;
  gridMm: number;
  gridBackground: string;
  rulerTicks: { x: number[]; y: number[] };
  stageSizePx: { width: number; height: number };
  designBBoxPx: { minX: number; minY: number; width: number; height: number };
  snapLines: SnapLine[];
  liveOverlay: LiveOverlayState | null;
  componentList: COMPONENT_DATA[];
  currentComponent: number;
  setCurrentComponent: (val: number) => void;
  activeHandleIdx: number | null;
  activeHandleBox: ActiveHandleBox | null;
  isPrinting: boolean;
  printOffsetMm: PrintOffset;
  labelprintref: React.RefObject<HTMLDivElement>;
  renderHandles: () => JSX.Element[];
  renderRotatedResizeHandles: () => JSX.Element | null;
  setRotateDrag: React.Dispatch<React.SetStateAction<RotateDragState | null>>;
  isShiftDown: boolean;
  setIsGroupDragging: (val: boolean) => void;
  groupDragStartRef: React.MutableRefObject<{ mouseX: number; mouseY: number; x: number; y: number } | null>;
  onCreateComponentAt: (type: string, mmX: number, mmY: number) => Promise<void>;
  RULER_TOP: number;
  RULER_LEFT: number;
  MM_TO_PX: number;
  PX_TO_MM: number;
}

export const PrecisionDesignAmazonCanvas: React.FC<PrecisionDesignAmazonCanvasProps> = ({
  designRef,
  scale,
  x,
  y,
  showGrid,
  gridMm,
  gridBackground,
  rulerTicks,
  stageSizePx,
  designBBoxPx,
  snapLines,
  liveOverlay,
  componentList,
  currentComponent,
  setCurrentComponent,
  activeHandleIdx,
  activeHandleBox,
  isPrinting,
  printOffsetMm,
  labelprintref,
  renderHandles,
  renderRotatedResizeHandles,
  setRotateDrag,
  isShiftDown,
  setIsGroupDragging,
  groupDragStartRef,
  onCreateComponentAt,
  RULER_TOP,
  RULER_LEFT,
  MM_TO_PX,
  PX_TO_MM,
}) => {
  return (
    <div
      className="precision-amz-design__viewport"
      ref={designRef}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrop={async (e) => {
        e.preventDefault();
        const t = e.dataTransfer.getData("amz/newComponentType");
        if (!t) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const mx = e.clientX - rect.left - RULER_LEFT;
        const my = e.clientY - rect.top - RULER_TOP;
        const worldX = (mx - x) / scale;
        const worldY = (my - y) / scale;
        const mmX = worldX * PX_TO_MM;
        const mmY = worldY * PX_TO_MM;
        await onCreateComponentAt(t, mmX, mmY);
      }}
      onMouseDown={(e) => {
        if (e.ctrlKey && e.target === e.currentTarget) {
          setCurrentComponent(-1);
        }
      }}
    >
      {/* Top Ruler (Milimet) */}
      <div className="precision-amz-design__rulerTop">
        {rulerTicks.x.map((s) => {
          const mm = (s / scale) * PX_TO_MM;
          return (
            <div key={`rx_${s}`} className="precision-amz-design__tickX" style={{ left: s }}>
              <span className="precision-amz-design__tickLabel">{Math.round(mm)}</span>
            </div>
          );
        })}
      </div>

      {/* Left Ruler (Milimet) */}
      <div className="precision-amz-design__rulerLeft">
        {rulerTicks.y.map((s) => {
          const mm = (s / scale) * PX_TO_MM;
          return (
            <div key={`ry_${s}`} className="precision-amz-design__tickY" style={{ top: s }}>
              <span className="precision-amz-design__tickLabel">{Math.round(mm)}</span>
            </div>
          );
        })}
      </div>

      {/* Origin Corner (0,0) */}
      <div className="precision-amz-design__rulerCorner" title="Gốc tọa độ (0,0) mm">
        <span>mm</span>
      </div>

      {/* Smart Alignment Snap Lines */}
      {snapLines.map((line, i) => (
        <div
          key={i}
          className={`precision-amz-design__snapLine precision-amz-design__snapLine--${line.type}`}
          style={{
            left: line.type === "vertical" ? line.pos : 0,
            top: line.type === "horizontal" ? line.pos : 0,
          }}
        />
      ))}

      {/* Live Coordinate Overlay Tooltip */}
      {(() => {
        const sel = componentList[currentComponent];
        if (!sel || !liveOverlay) return null;

        const pxX = (sel.POS_X ?? 0) * MM_TO_PX;
        const pxY = (sel.POS_Y ?? 0) * MM_TO_PX;
        const pxW = Math.max(1, (sel.SIZE_W ?? 1) * MM_TO_PX);

        const text =
          liveOverlay.type === "drag"
            ? `X: ${liveOverlay.xMm?.toFixed(2)}mm  Y: ${liveOverlay.yMm?.toFixed(2)}mm`
            : `W: ${liveOverlay.wMm?.toFixed(2)}mm  H: ${liveOverlay.hMm?.toFixed(2)}mm`;

        return (
          <div
            className="precision-amz-design__coordBadge"
            style={{
              left: x + (pxX + pxW / 2) * scale,
              top: y + Math.max(0, (pxY - 18) * scale),
            }}
          >
            {text}
          </div>
        );
      })()}

      {/* Zoom Stage */}
      <div
        className="precision-amz-design__zoomStage"
        style={{
          left: RULER_LEFT + x,
          top: RULER_TOP + y,
          transform: `scale(${scale})`,
        }}
      >
        <div
          id="amzStageBounds"
          className="precision-amz-design__stageBounds"
          style={{
            width: stageSizePx.width,
            height: stageSizePx.height,
          }}
        >
          {showGrid && (
            <div
              className="precision-amz-design__gridCanvas"
              style={{
                backgroundImage: gridBackground,
                backgroundSize: `${Math.max(1, gridMm * MM_TO_PX)}px ${Math.max(1, gridMm * MM_TO_PX)}px`,
              }}
            />
          )}

          {/* Group Drag Layer (Shift + Drag) */}
          <div
            className={`precision-amz-design__groupDragLayer ${isShiftDown ? "is-active" : ""}`}
            style={{
              left: designBBoxPx.minX,
              top: designBBoxPx.minY,
              width: designBBoxPx.width,
              height: designBBoxPx.height,
            }}
            onMouseDown={(e) => {
              if (!isShiftDown) return;
              e.preventDefault();
              e.stopPropagation();
              setIsGroupDragging(true);
              groupDragStartRef.current = {
                mouseX: e.clientX,
                mouseY: e.clientY,
                x,
                y,
              };
            }}
          />

          {/* Print Container & Live Element Rendering */}
          <div className="precision-amz-design__printWrapper labelprint" ref={labelprintref}>
            <div
              style={
                isPrinting
                  ? {
                      transform: `translate(${printOffsetMm.x * MM_TO_PX}px, ${printOffsetMm.y * MM_TO_PX}px)`,
                      transformOrigin: "top left",
                    }
                  : undefined
              }
            >
              {(() => {
                let renderList = componentList;
                if (activeHandleIdx !== null && activeHandleBox !== null) {
                  const idx = activeHandleIdx;
                  const unscaledX = (activeHandleBox.x - (x + RULER_LEFT)) / scale;
                  const unscaledY = (activeHandleBox.y - (y + RULER_TOP)) / scale;
                  const mmX = unscaledX * PX_TO_MM;
                  const mmY = unscaledY * PX_TO_MM;
                  const w = activeHandleBox.w / scale;
                  const h = activeHandleBox.h / scale;
                  const mmW = w * PX_TO_MM;
                  const mmH = h * PX_TO_MM;

                  renderList = componentList.map((p, i) => {
                    if (i !== idx) return p;
                    return {
                      ...p,
                      POS_X: mmX,
                      POS_Y: mmY,
                      SIZE_W: mmW,
                      SIZE_H: mmH,
                    };
                  });
                }
                return renderElement(renderList);
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Selection Handles & Controls Overlay */}
      <div className="precision-amz-design__handlesOverlay">
        {renderHandles()}
        {renderRotatedResizeHandles()}

        {/* Rotation Handle (Orange circular knob) */}
        {(() => {
          const idx = currentComponent;
          if (idx < 0) return null;
          const c = componentList[idx];
          if (!c) return null;

          const pxX = (c.POS_X ?? 0) * MM_TO_PX;
          const pxY = (c.POS_Y ?? 0) * MM_TO_PX;
          const pxW = Math.max(1, (c.SIZE_W ?? 1) * MM_TO_PX);
          const pxH = Math.max(1, (c.SIZE_H ?? 1) * MM_TO_PX);

          const screenX = RULER_LEFT + x + pxX * scale;
          const screenY = RULER_TOP + y + pxY * scale;
          const screenW = pxW * scale;
          const screenH = pxH * scale;

          const rotDeg = c.ROTATE ?? 0;
          const rotRad = (rotDeg * Math.PI) / 180;
          const cos = Math.cos(rotRad);
          const sin = Math.sin(rotRad);

          const trX = screenX + screenW * cos;
          const trY = screenY + screenW * sin;

          const offLocalX = 10;
          const offLocalY = -10;
          const handleX = trX + offLocalX * cos - offLocalY * sin;
          const handleY = trY + offLocalX * sin + offLocalY * cos;

          const centerX = screenX + (screenW / 2) * cos - (screenH / 2) * sin;
          const centerY = screenY + (screenW / 2) * sin + (screenH / 2) * cos;

          return (
            <div
              className="precision-amz-design__rotationKnob"
              style={{ left: handleX, top: handleY }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const startAngle = (Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180) / Math.PI;
                setRotateDrag({ idx, centerX, centerY, startMouseAngle: startAngle, startRotate: rotDeg });
              }}
              title="Kéo chuột để xoay đối tượng"
            />
          );
        })()}
      </div>
    </div>
  );
};

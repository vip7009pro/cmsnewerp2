import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { COMPONENT_DATA } from "../../interfaces/rndInterface";
import {
  ActiveHandleBox,
  DesignAmazonCanvasHook,
  GridStyle,
  LiveOverlayState,
  PaletteItem,
  RotateDragState,
  RotateResizeDragState,
  SnapLine,
} from "./designAmazonTypes";

const RULER_TOP = 20;
const RULER_LEFT = 30;
const MM_TO_PX = 96 / 25.4;
const PX_TO_MM = 25.4 / 96;
const MIN_SCALE = 0.2;
const MAX_SCALE = 10;

interface CanvasHookProps {
  componentList: COMPONENT_DATA[];
  latestComponentListRef: React.MutableRefObject<COMPONENT_DATA[]>;
  currentComponent: number;
  setCurrentComponent: React.Dispatch<React.SetStateAction<number>>;
  commitComponentList: (next: COMPONENT_DATA[]) => void;
  undo: () => void;
  redo: () => void;
  deleteSelectedComponent: (idx?: number) => void;
  updateComponentAt: (index: number, patch: Partial<COMPONENT_DATA>, commit?: boolean) => void;
}

export const useDesignAmazonCanvas = ({
  componentList,
  latestComponentListRef,
  currentComponent,
  setCurrentComponent,
  commitComponentList,
  undo,
  redo,
  deleteSelectedComponent,
  updateComponentAt,
}: CanvasHookProps): DesignAmazonCanvasHook => {
  const designRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const [isCtrlDown, setIsCtrlDown] = useState(false);
  const [isShiftDown, setIsShiftDown] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [gridMm, setGridMm] = useState(5);
  const [gridStyle, setGridStyle] = useState<GridStyle>("dashed");
  const [enableSnap, setEnableSnap] = useState(false);
  const [snapLines, setSnapLines] = useState<SnapLine[]>([]);

  const [designViewSize, setDesignViewSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [activeHandleIdx, setActiveHandleIdx] = useState<number | null>(null);
  const [activeHandleBox, setActiveHandleBox] = useState<ActiveHandleBox | null>(null);
  const [liveOverlay, setLiveOverlay] = useState<LiveOverlayState | null>(null);

  const [rotateDrag, setRotateDrag] = useState<RotateDragState | null>(null);
  const [rotateResizeDrag, setRotateResizeDrag] = useState<RotateResizeDragState | null>(null);
  const [isGroupDragging, setIsGroupDragging] = useState(false);
  const groupDragStartRef = useRef<{ mouseX: number; mouseY: number; x: number; y: number } | null>(null);

  const nudgeStateRef = useRef<{
    active: boolean;
    startMs: number;
    dx: number;
    dy: number;
    ctrl: boolean;
    startSnapshot: COMPONENT_DATA[] | null;
    timerId: number | null;
  } | null>(null);

  const zoomPresets = useMemo(() => {
    return [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4, 5, 8, 10].filter((z) => z >= MIN_SCALE && z <= MAX_SCALE);
  }, []);

  const zoomIn = useCallback(() => {
    setScale((prev) => Math.min(MAX_SCALE, Math.round(prev * 1.25 * 100) / 100));
  }, []);

  const zoomOut = useCallback(() => {
    setScale((prev) => Math.max(MIN_SCALE, Math.round((prev / 1.25) * 100) / 100));
  }, []);

  const resetZoom = useCallback(() => {
    setScale(1);
    setX(0);
    setY(0);
  }, []);

  const paletteItems: PaletteItem[] = useMemo(
    () => [
      { type: "TEXT", label: "TEXT", desc: "Đoạn văn bản" },
      { type: "IMAGE", label: "IMAGE", desc: "Hình ảnh / Logo" },
      { type: "1D BARCODE", label: "1D BARCODE", desc: "Mã vạch 1D" },
      { type: "2D MATRIX", label: "2D MATRIX", desc: "Ma trận dữ liệu" },
      { type: "QRCODE", label: "QR CODE", desc: "Mã QR" },
      { type: "CONTAINER", label: "BOX", desc: "Khung đường bao" },
    ],
    []
  );

  const gridBackground = useMemo(() => {
    const stepPx = Math.max(1, gridMm * MM_TO_PX);
    const stroke = "rgba(15, 23, 42, 0.16)";
    const lineW = 0.5;

    if (gridStyle === "solid") {
      return `repeating-linear-gradient(0deg, ${stroke} 0, ${stroke} ${lineW}px, transparent ${lineW}px, transparent ${stepPx}px), repeating-linear-gradient(90deg, ${stroke} 0, ${stroke} ${lineW}px, transparent ${lineW}px, transparent ${stepPx}px)`;
    }

    const dash = 3;
    const gap = 3;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${stepPx}" height="${stepPx}" viewBox="0 0 ${stepPx} ${stepPx}" shape-rendering="crispEdges"><path d="M0 0H${stepPx} M0 0V${stepPx}" fill="none" stroke="${stroke}" stroke-width="${lineW}" stroke-dasharray="${dash} ${gap}"/></svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  }, [gridMm, gridStyle]);

  const rulerTicks = useMemo(() => {
    const w = designViewSize.w;
    const h = designViewSize.h;
    if (w <= 0 || h <= 0) return { x: [] as number[], y: [] as number[] };

    const stepPxScreen = Math.max(1, gridMm * MM_TO_PX * scale);
    const usableW = Math.max(0, w - RULER_LEFT);
    const usableH = Math.max(0, h - RULER_TOP);

    const xs: number[] = [];
    for (let s = 0; s <= usableW; s += stepPxScreen) xs.push(s);
    const ys: number[] = [];
    for (let s = 0; s <= usableH; s += stepPxScreen) ys.push(s);

    return { x: xs, y: ys };
  }, [designViewSize, scale, gridMm]);

  const designBBoxPx = useMemo(() => {
    if (componentList.length === 0) {
      return { minX: 0, minY: 0, width: 0, height: 0 };
    }

    let minX = Number.POSITIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;

    for (const c of componentList) {
      const cx = (c.POS_X ?? 0) * MM_TO_PX;
      const cy = (c.POS_Y ?? 0) * MM_TO_PX;
      const cw = (c.SIZE_W ?? 0) * MM_TO_PX;
      const ch = (c.SIZE_H ?? 0) * MM_TO_PX;
      minX = Math.min(minX, cx);
      minY = Math.min(minY, cy);
      maxX = Math.max(maxX, cx + cw);
      maxY = Math.max(maxY, cy + ch);
    }

    if (!Number.isFinite(minX) || !Number.isFinite(minY)) {
      return { minX: 0, minY: 0, width: 0, height: 0 };
    }

    const pad = 6;
    minX = Math.max(0, minX - pad);
    minY = Math.max(0, minY - pad);
    const width = Math.max(0, maxX - minX + pad * 2);
    const height = Math.max(0, maxY - minY + pad * 2);
    return { minX, minY, width, height };
  }, [componentList]);

  const stageSizePx = useMemo(() => {
    return {
      width: Math.max(10, designBBoxPx.minX + designBBoxPx.width),
      height: Math.max(10, designBBoxPx.minY + designBBoxPx.height),
    };
  }, [designBBoxPx]);

  useEffect(() => {
    const el = designRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      const delta = e.deltaY;
      setScale((prev) => {
        const next = delta < 0 ? prev * 1.1 : prev / 1.1;
        return Math.max(MIN_SCALE, Math.min(MAX_SCALE, next));
      });
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel as any);
    };
  }, []);

  useEffect(() => {
    const el = designRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setDesignViewSize({ w: r.width, h: r.height });
    });
    ro.observe(el);
    const r = el.getBoundingClientRect();
    setDesignViewSize({ w: r.width, h: r.height });
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!rotateDrag) return;

    const onMove = (e: MouseEvent) => {
      const a = (Math.atan2(e.clientY - rotateDrag.centerY, e.clientX - rotateDrag.centerX) * 180) / Math.PI;
      const delta = a - rotateDrag.startMouseAngle;
      const next = rotateDrag.startRotate + delta;
      updateComponentAt(rotateDrag.idx, { ROTATE: Math.round(next * 10) / 10 }, false);
    };

    const onUp = () => {
      const idx = rotateDrag.idx;
      const nextList = componentList.map((p, i) =>
        i === idx ? { ...p, ROTATE: componentList[i].ROTATE } : p
      );
      commitComponentList(nextList);
      setRotateDrag(null);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [rotateDrag, componentList, commitComponentList, updateComponentAt]);

  useEffect(() => {
    if (!rotateResizeDrag) return;

    const onMove = (e: MouseEvent) => {
      const rect = designRef.current?.getBoundingClientRect();
      if (!rect) return;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const worldX = (mouseX - (x + RULER_LEFT)) / scale;
      const worldY = (mouseY - (y + RULER_TOP)) / scale;

      const c = componentList[rotateResizeDrag.idx];
      if (!c) return;
      const rotDeg = c.ROTATE ?? 0;
      const rotRad = (rotDeg * Math.PI) / 180;
      const cos = Math.cos(rotRad);
      const sin = Math.sin(rotRad);

      const dWorldX = worldX - rotateResizeDrag.startMouseWorldX;
      const dWorldY = worldY - rotateResizeDrag.startMouseWorldY;

      const dLocalX = dWorldX * cos + dWorldY * sin;
      const dLocalY = -dWorldX * sin + dWorldY * cos;

      let newWorldX = rotateResizeDrag.startWorldX;
      let newWorldY = rotateResizeDrag.startWorldY;
      let newWorldW = rotateResizeDrag.startWorldW;
      let newWorldH = rotateResizeDrag.startWorldH;

      if (rotateResizeDrag.handle === "br") {
        newWorldW = rotateResizeDrag.startWorldW + dLocalX;
        newWorldH = rotateResizeDrag.startWorldH + dLocalY;
      } else if (rotateResizeDrag.handle === "tr") {
        newWorldW = rotateResizeDrag.startWorldW + dLocalX;
        newWorldY = rotateResizeDrag.startWorldY + dLocalY;
        newWorldH = rotateResizeDrag.startWorldH - dLocalY;
      } else if (rotateResizeDrag.handle === "bl") {
        newWorldX = rotateResizeDrag.startWorldX + dLocalX;
        newWorldW = rotateResizeDrag.startWorldW - dLocalX;
        newWorldH = rotateResizeDrag.startWorldH + dLocalY;
      } else {
        newWorldX = rotateResizeDrag.startWorldX + dLocalX;
        newWorldY = rotateResizeDrag.startWorldY + dLocalY;
        newWorldW = rotateResizeDrag.startWorldW - dLocalX;
        newWorldH = rotateResizeDrag.startWorldH - dLocalY;
      }

      const minWorld = 1;
      if (newWorldW < minWorld) {
        const diff = minWorld - newWorldW;
        if (rotateResizeDrag.handle === "tl" || rotateResizeDrag.handle === "bl") newWorldX -= diff;
        newWorldW = minWorld;
      }
      if (newWorldH < minWorld) {
        const diff = minWorld - newWorldH;
        if (rotateResizeDrag.handle === "tl" || rotateResizeDrag.handle === "tr") newWorldY -= diff;
        newWorldH = minWorld;
      }

      const screenX = x + RULER_LEFT + newWorldX * scale;
      const screenY = y + RULER_TOP + newWorldY * scale;
      const screenW = newWorldW * scale;
      const screenH = newWorldH * scale;

      setActiveHandleIdx(rotateResizeDrag.idx);
      setActiveHandleBox({ x: screenX, y: screenY, w: screenW, h: screenH });
      setLiveOverlay({ type: "resize", wMm: newWorldW * PX_TO_MM, hMm: newWorldH * PX_TO_MM });
    };

    const onUp = () => {
      const idx = rotateResizeDrag.idx;
      const box = activeHandleBox;
      if (!box) {
        setRotateResizeDrag(null);
        return;
      }

      const worldX = (box.x - (x + RULER_LEFT)) / scale;
      const worldY = (box.y - (y + RULER_TOP)) / scale;
      const worldW = box.w / scale;
      const worldH = box.h / scale;

      const mmX = Math.round(worldX * PX_TO_MM * 100) / 100;
      const mmY = Math.round(worldY * PX_TO_MM * 100) / 100;
      const mmW = Math.round(worldW * PX_TO_MM * 100) / 100;
      const mmH = Math.round(worldH * PX_TO_MM * 100) / 100;

      setLiveOverlay(null);
      setActiveHandleIdx(null);
      setActiveHandleBox(null);
      setRotateResizeDrag(null);

      commitComponentList(
        latestComponentListRef.current.map((p: COMPONENT_DATA, i: number) =>
          i === idx ? { ...p, POS_X: mmX, POS_Y: mmY, SIZE_W: mmW, SIZE_H: mmH } : p
        )
      );
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [rotateResizeDrag, x, y, scale, componentList, activeHandleBox, commitComponentList, latestComponentListRef]);

  useEffect(() => {
    const isArrow = (k: string) => ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(k);

    const isAgGridTarget = (t: EventTarget | null) => {
      const el = t as any;
      if (!el) return false;
      if (typeof (el as any).closest === "function") {
        return Boolean((el as HTMLElement).closest(".ag-theme-quartz"));
      }
      return false;
    };

    const computeDir = (k: string) => {
      if (k === "ArrowLeft") return { dx: -1, dy: 0 };
      if (k === "ArrowRight") return { dx: 1, dy: 0 };
      if (k === "ArrowUp") return { dx: 0, dy: -1 };
      return { dx: 0, dy: 1 };
    };

    const stopNudge = () => {
      const st = nudgeStateRef.current;
      if (!st?.active) return;

      if (st.timerId != null) {
        window.clearInterval(st.timerId);
      }

      nudgeStateRef.current = null;
      setLiveOverlay(null);

      const finalList = latestComponentListRef.current;
      commitComponentList(finalList);
    };

    const applyNudgeStep = (dtMs: number) => {
      const st = nudgeStateRef.current;
      if (!st?.active) return;

      const t = performance.now() - st.startMs;
      const baseStepMm = 0.01;
      const accel = Math.min(40, 1 + t / 250);
      const stepMm = baseStepMm * accel;

      const idx = currentComponent;
      const cur = latestComponentListRef.current[idx];
      if (!cur) {
        stopNudge();
        return;
      }

      const mult = Math.max(0.25, dtMs / 30);
      const deltaMm = stepMm * mult;

      const nextList = latestComponentListRef.current.map((p, i) => {
        if (i !== idx) return p;

        if (st.ctrl) {
          const nextW = Math.max(0.01, (p.SIZE_W ?? 0) + st.dx * deltaMm);
          const nextH = Math.max(0.01, (p.SIZE_H ?? 0) + st.dy * deltaMm);
          return { ...p, SIZE_W: nextW, SIZE_H: nextH };
        }

        const nextX = Math.max(0, (p.POS_X ?? 0) + st.dx * deltaMm);
        const nextY = Math.max(0, (p.POS_Y ?? 0) + st.dy * deltaMm);
        return { ...p, POS_X: nextX, POS_Y: nextY };
      });

      latestComponentListRef.current = nextList;

      const sel = nextList[idx];
      if (sel) {
        if (st.ctrl) {
          setLiveOverlay({ type: "resize", wMm: Number(sel.SIZE_W ?? 0), hMm: Number(sel.SIZE_H ?? 0) });
        } else {
          setLiveOverlay({ type: "drag", xMm: Number(sel.POS_X ?? 0), yMm: Number(sel.POS_Y ?? 0) });
        }
      }
    };

    const isTypingTarget = (t: EventTarget | null) => {
      const el = t as HTMLElement | null;
      if (!el) return false;
      const tag = (el.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return true;
      if ((el as any).isContentEditable) return true;
      return false;
    };

    const onDeleteKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Delete" && e.key !== "Backspace") return;
      if (isTypingTarget(e.target)) return;
      if (currentComponent < 0 || currentComponent >= latestComponentListRef.current.length) return;
      e.preventDefault();
      deleteSelectedComponent();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Control") setIsCtrlDown(true);
      if (e.key === "Shift") setIsShiftDown(true);

      if (e.ctrlKey) {
        const key = e.key.toLowerCase();
        if (key === "z") {
          e.preventDefault();
          if (e.shiftKey) redo();
          else undo();
          return;
        }
        if (key === "y") {
          e.preventDefault();
          redo();
          return;
        }
      }

      if (!isArrow(e.key)) return;
      if (isTypingTarget(e.target)) return;
      if (isAgGridTarget(e.target)) return;
      if (currentComponent < 0 || currentComponent >= latestComponentListRef.current.length) return;

      e.preventDefault();

      if (nudgeStateRef.current?.active) return;

      const dir = computeDir(e.key);
      const now = performance.now();
      nudgeStateRef.current = {
        active: true,
        startMs: now,
        dx: dir.dx,
        dy: dir.dy,
        ctrl: e.ctrlKey,
        startSnapshot: latestComponentListRef.current.map((x) => ({ ...x })),
        timerId: null,
      };

      applyNudgeStep(30);

      const id = window.setInterval(() => {
        applyNudgeStep(30);
      }, 30);

      const st = nudgeStateRef.current;
      if (st) st.timerId = id;
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Control") setIsCtrlDown(false);
      if (e.key === "Shift") setIsShiftDown(false);
      if (!isArrow(e.key)) return;
      stopNudge();
    };

    window.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("keyup", onKeyUp, true);
    window.addEventListener("keydown", onDeleteKeyDown, true);
    return () => {
      window.removeEventListener("keydown", onKeyDown, true as any);
      window.removeEventListener("keyup", onKeyUp, true as any);
      window.removeEventListener("keydown", onDeleteKeyDown, true as any);
      stopNudge();
    };
  }, [currentComponent, commitComponentList, deleteSelectedComponent, redo, undo, latestComponentListRef]);

  useEffect(() => {
    if (!isGroupDragging) return;

    const onMove = (e: MouseEvent) => {
      const start = groupDragStartRef.current;
      if (!start) return;
      const dx = e.clientX - start.mouseX;
      const dy = e.clientY - start.mouseY;
      setX(start.x + dx);
      setY(start.y + dy);
    };

    const onUp = () => {
      setIsGroupDragging(false);
      groupDragStartRef.current = null;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isGroupDragging]);

  const renderHandles = useCallback(() => {
    return componentList.map((c, idx) => {
      const pxX = (c.POS_X ?? 0) * MM_TO_PX;
      const pxY = (c.POS_Y ?? 0) * MM_TO_PX;
      const pxW = Math.max(1, (c.SIZE_W ?? 1) * MM_TO_PX);
      const pxH = Math.max(1, (c.SIZE_H ?? 1) * MM_TO_PX);

      const screenX = RULER_LEFT + x + pxX * scale;
      const screenY = RULER_TOP + y + pxY * scale;
      const screenW = pxW * scale;
      const screenH = pxH * scale;

      const isActive = activeHandleIdx === idx && activeHandleBox != null;
      const usedX = isActive ? activeHandleBox!.x : screenX;
      const usedY = isActive ? activeHandleBox!.y : screenY;
      const usedW = isActive ? activeHandleBox!.w : screenW;
      const usedH = isActive ? activeHandleBox!.h : screenH;

      const selected = idx === currentComponent;
      const rot = c.ROTATE ?? 0;

      return (
        <Rnd
          key={`h_${idx}`}
          size={{ width: usedW, height: usedH }}
          position={{ x: usedX, y: usedY }}
          scale={1}
          minWidth={1}
          minHeight={1}
          enableResizing={false}
          disableDragging={!isCtrlDown || !selected}
          onMouseDown={(e: any) => {
            e.stopPropagation();
            const containerRect = designRef.current?.getBoundingClientRect();
            if (!containerRect) {
              setCurrentComponent(idx);
              return;
            }

            const mouseX = e.clientX - containerRect.left;
            const mouseY = e.clientY - containerRect.top;

            const matches: number[] = [];
            componentList.forEach((comp, i) => {
              const cx = (comp.POS_X ?? 0) * MM_TO_PX * scale + x + RULER_LEFT;
              const cy = (comp.POS_Y ?? 0) * MM_TO_PX * scale + y + RULER_TOP;
              const cw = Math.max(16, (comp.SIZE_W ?? 1) * MM_TO_PX * scale);
              const ch = Math.max(16, (comp.SIZE_H ?? 1) * MM_TO_PX * scale);

              if (mouseX >= cx && mouseX <= cx + cw && mouseY >= cy && mouseY <= cy + ch) {
                matches.push(i);
              }
            });

            if (matches.length > 1) {
              const currentIndexInMatches = matches.indexOf(currentComponent);
              let nextMatchIndex = -1;
              if (currentIndexInMatches === -1) {
                nextMatchIndex = matches.length - 1;
              } else {
                nextMatchIndex = (currentIndexInMatches + 1) % matches.length;
              }
              setCurrentComponent(matches[nextMatchIndex]);
            } else {
              setCurrentComponent(idx);
            }
          }}
          onDragStart={(e: any) => {
            e.stopPropagation();
            setCurrentComponent(idx);
            setActiveHandleIdx(idx);
            setActiveHandleBox({ x: usedX, y: usedY, w: usedW, h: usedH });
          }}
          onDrag={(_e: any, d: any) => {
            let newX = d.x;
            let newY = d.y;
            const currentSnapLines: SnapLine[] = [];

            if (enableSnap) {
              const threshold = 3 * scale;
              const myW = usedW;
              const myH = usedH;
              const myCx = newX + myW / 2;
              const myCy = newY + myH / 2;
              const myR = newX + myW;
              const myB = newY + myH;

              componentList.forEach((otherComp, i) => {
                if (i === idx) return;

                const otherPxX = (otherComp.POS_X ?? 0) * MM_TO_PX;
                const otherPxY = (otherComp.POS_Y ?? 0) * MM_TO_PX;
                const otherPxW = Math.max(1, (otherComp.SIZE_W ?? 1) * MM_TO_PX);
                const otherPxH = Math.max(1, (otherComp.SIZE_H ?? 1) * MM_TO_PX);

                const otherScreenX = RULER_LEFT + x + otherPxX * scale;
                const otherScreenY = RULER_TOP + y + otherPxY * scale;
                const otherScreenW = otherPxW * scale;
                const otherScreenH = otherPxH * scale;

                const otherCx = otherScreenX + otherScreenW / 2;
                const otherCy = otherScreenY + otherScreenH / 2;
                const otherR = otherScreenX + otherScreenW;
                const otherB = otherScreenY + otherScreenH;

                if (Math.abs(newX - otherScreenX) < threshold) {
                  newX = otherScreenX;
                  currentSnapLines.push({ type: "vertical", pos: newX });
                } else if (Math.abs(newX - otherR) < threshold) {
                  newX = otherR;
                  currentSnapLines.push({ type: "vertical", pos: newX });
                } else if (Math.abs(myR - otherScreenX) < threshold) {
                  newX = otherScreenX - myW;
                  currentSnapLines.push({ type: "vertical", pos: otherScreenX });
                } else if (Math.abs(myR - otherR) < threshold) {
                  newX = otherR - myW;
                  currentSnapLines.push({ type: "vertical", pos: otherR });
                } else if (Math.abs(myCx - otherCx) < threshold) {
                  newX = otherCx - myW / 2;
                  currentSnapLines.push({ type: "vertical", pos: otherCx });
                }

                if (Math.abs(newY - otherScreenY) < threshold) {
                  newY = otherScreenY;
                  currentSnapLines.push({ type: "horizontal", pos: newY });
                } else if (Math.abs(newY - otherB) < threshold) {
                  newY = otherB;
                  currentSnapLines.push({ type: "horizontal", pos: newY });
                } else if (Math.abs(myB - otherScreenY) < threshold) {
                  newY = otherScreenY - myH;
                  currentSnapLines.push({ type: "horizontal", pos: otherScreenY });
                } else if (Math.abs(myB - otherB) < threshold) {
                  newY = otherB - myH;
                  currentSnapLines.push({ type: "horizontal", pos: otherB });
                } else if (Math.abs(myCy - otherCy) < threshold) {
                  newY = otherCy - myH / 2;
                  currentSnapLines.push({ type: "horizontal", pos: otherCy });
                }
              });
            }

            setSnapLines(currentSnapLines);

            if (activeHandleIdx === idx) {
              setActiveHandleBox((prev) => ({
                x: newX,
                y: newY,
                w: prev?.w ?? usedW,
                h: prev?.h ?? usedH,
              }));
            }

            const unscaledX = (newX - (x + RULER_LEFT)) / scale;
            const unscaledY = (newY - (y + RULER_TOP)) / scale;
            const mmX = unscaledX * PX_TO_MM;
            const mmY = unscaledY * PX_TO_MM;

            if (idx === currentComponent) setLiveOverlay({ type: "drag", xMm: mmX, yMm: mmY });
          }}
          onDragStop={(_e: any, d: any) => {
            setSnapLines([]);
            let finalX = d.x;
            let finalY = d.y;
            if (activeHandleBox) {
              finalX = activeHandleBox.x;
              finalY = activeHandleBox.y;
            }

            const unscaledX = (finalX - (x + RULER_LEFT)) / scale;
            const unscaledY = (finalY - (y + RULER_TOP)) / scale;
            const mmX = Math.round(unscaledX * PX_TO_MM * 100) / 100;
            const mmY = Math.round(unscaledY * PX_TO_MM * 100) / 100;
            setLiveOverlay(null);
            setActiveHandleIdx(null);
            setActiveHandleBox(null);

            commitComponentList(
              componentList.map((p, i) => (i === idx ? { ...p, POS_X: mmX, POS_Y: mmY } : p))
            );
          }}
          style={{
            border: "2px solid transparent",
            background: "transparent",
            boxSizing: "border-box",
            zIndex: selected ? 200 : 10,
            pointerEvents: "auto",
          }}
        >
          {selected && (
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                border: "2px solid rgba(37, 99, 235, 0.9)",
                background: "rgba(37, 99, 235, 0.08)",
                boxSizing: "border-box",
                transform: rot ? `rotate(${rot}deg)` : undefined,
                transformOrigin: "top left",
                pointerEvents: "none",
              }}
            />
          )}
        </Rnd>
      );
    });
  }, [
    componentList,
    x,
    y,
    scale,
    activeHandleIdx,
    activeHandleBox,
    currentComponent,
    isCtrlDown,
    enableSnap,
    commitComponentList,
    setCurrentComponent,
  ]);

  const renderRotatedResizeHandles = useCallback(() => {
    if (!isCtrlDown) return null;
    const idx = currentComponent;
    if (idx < 0) return null;
    const c = componentList[idx];
    if (!c) return null;
    if (rotateResizeDrag && rotateResizeDrag.idx !== idx) return null;

    const pxX = (c.POS_X ?? 0) * MM_TO_PX;
    const pxY = (c.POS_Y ?? 0) * MM_TO_PX;
    const pxW = Math.max(1, (c.SIZE_W ?? 1) * MM_TO_PX);
    const pxH = Math.max(1, (c.SIZE_H ?? 1) * MM_TO_PX);

    const baseScreenX =
      activeHandleIdx === idx && activeHandleBox ? activeHandleBox.x : RULER_LEFT + x + pxX * scale;
    const baseScreenY =
      activeHandleIdx === idx && activeHandleBox ? activeHandleBox.y : RULER_TOP + y + pxY * scale;
    const baseScreenW = activeHandleIdx === idx && activeHandleBox ? activeHandleBox.w : pxW * scale;
    const baseScreenH = activeHandleIdx === idx && activeHandleBox ? activeHandleBox.h : pxH * scale;

    const rotDeg = c.ROTATE ?? 0;
    const rotRad = (rotDeg * Math.PI) / 180;
    const cos = Math.cos(rotRad);
    const sin = Math.sin(rotRad);

    const tl = { x: baseScreenX, y: baseScreenY };
    const tr = { x: baseScreenX + baseScreenW * cos, y: baseScreenY + baseScreenW * sin };
    const bl = { x: baseScreenX - baseScreenH * sin, y: baseScreenY + baseScreenH * cos };
    const br = { x: tr.x - baseScreenH * sin, y: tr.y + baseScreenH * cos };

    const hs = 10;
    const half = hs / 2;

    const begin = (handle: "tl" | "tr" | "bl" | "br") => (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const rect = designRef.current?.getBoundingClientRect();
      if (!rect) return;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const startMouseWorldX = (mouseX - (x + RULER_LEFT)) / scale;
      const startMouseWorldY = (mouseY - (y + RULER_TOP)) / scale;

      const startWorldX =
        activeHandleIdx === idx && activeHandleBox ? (activeHandleBox.x - (x + RULER_LEFT)) / scale : pxX;
      const startWorldY =
        activeHandleIdx === idx && activeHandleBox ? (activeHandleBox.y - (y + RULER_TOP)) / scale : pxY;
      const startWorldW = activeHandleIdx === idx && activeHandleBox ? activeHandleBox.w / scale : pxW;
      const startWorldH = activeHandleIdx === idx && activeHandleBox ? activeHandleBox.h / scale : pxH;

      setRotateResizeDrag({
        idx,
        handle,
        startMouseWorldX,
        startMouseWorldY,
        startWorldX,
        startWorldY,
        startWorldW,
        startWorldH,
      });
      setActiveHandleIdx(idx);
      setActiveHandleBox({ x: baseScreenX, y: baseScreenY, w: baseScreenW, h: baseScreenH });
    };

    const dotStyle = (cursor: string) => ({
      position: "absolute" as const,
      width: hs,
      height: hs,
      borderRadius: 2,
      background: "#fff",
      border: "2px solid #2563eb",
      zIndex: 260,
      cursor,
      pointerEvents: "auto" as const,
      boxSizing: "border-box" as const,
    });

    return (
      <>
        <div style={{ ...dotStyle("nwse-resize"), left: tl.x - half, top: tl.y - half }} onMouseDown={begin("tl")} />
        <div style={{ ...dotStyle("nesw-resize"), left: tr.x - half, top: tr.y - half }} onMouseDown={begin("tr")} />
        <div style={{ ...dotStyle("nesw-resize"), left: bl.x - half, top: bl.y - half }} onMouseDown={begin("bl")} />
        <div style={{ ...dotStyle("nwse-resize"), left: br.x - half, top: br.y - half }} onMouseDown={begin("br")} />
      </>
    );
  }, [
    isCtrlDown,
    currentComponent,
    componentList,
    rotateResizeDrag,
    activeHandleIdx,
    activeHandleBox,
    x,
    y,
    scale,
  ]);

  return {
    designRef,
    scale,
    setScale,
    x,
    setX,
    y,
    setY,
    MIN_SCALE,
    MAX_SCALE,
    zoomPresets,
    zoomIn,
    zoomOut,
    resetZoom,
    showGrid,
    setShowGrid,
    gridMm,
    setGridMm,
    gridStyle,
    setGridStyle,
    gridBackground,
    enableSnap,
    setEnableSnap,
    snapLines,
    rulerTicks,
    designBBoxPx,
    stageSizePx,
    liveOverlay,
    activeHandleIdx,
    activeHandleBox,
    rotateDrag,
    setRotateDrag,
    rotateResizeDrag,
    setRotateResizeDrag,
    isShiftDown,
    isCtrlDown,
    isGroupDragging,
    setIsGroupDragging,
    groupDragStartRef,
    renderHandles,
    renderRotatedResizeHandles,
    paletteItems,
    RULER_TOP,
    RULER_LEFT,
    MM_TO_PX,
    PX_TO_MM,
  };
};

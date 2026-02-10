import React from "react";
import JsBarcode from "jsbarcode";
import { COMPONENT_DATA } from "../../interfaces/rndInterface";

const BARCODE2 = ({ DATA }: { DATA: COMPONENT_DATA }) => {
  const hostRef = React.useRef<HTMLDivElement | null>(null);
  const svgRef = React.useRef<SVGSVGElement | null>(null);

  const [moduleW, setModuleW] = React.useState<number>(1.0);
  const baseWidthPerModuleRef = React.useRef<number | null>(null);

  // Reset khi giá trị thay đổi
  React.useEffect(() => {
    baseWidthPerModuleRef.current = null;
    setModuleW(1.0);
  }, [DATA.GIATRI]);

  // Hàm render barcode bằng JsBarcode
  const renderBarcode = React.useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;

    try {
      JsBarcode(svg, String(DATA.GIATRI || ""), {
        format: "CODE128",
        width: moduleW,
        height: DATA.SIZE_H * 3.779527559, // dùng 96 DPI tạm thời, sau sẽ điều chỉnh viewBox
        displayValue: false,
        margin: 0,
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        background: "#fff",
        lineColor: "#000",
        flat: false, // giữ nguyên tỷ lệ thanh bar
      });

      // Sau khi render, loại bỏ quiet zone và fit sát
      const g = svg.querySelector("g") as SVGGElement | null;
      if (g) {
        const bbox = g.getBBox();

        // Set viewBox để zoom sát vào phần thanh bar, loại bỏ quiet zone
        svg.setAttribute(
          "viewBox",
          `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`
        );

        // Ép SVG fill full container
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.setAttribute("preserveAspectRatio", "none");
      }
    } catch (err) {
      console.warn("JsBarcode error:", err);
      // Có thể clear SVG nếu lỗi
      svg.innerHTML = "";
    }
  }, [DATA.GIATRI, moduleW, DATA.SIZE_H]);

  // Render barcode khi cần
  React.useEffect(() => {
    renderBarcode();
  }, [renderBarcode]);

  // Logic fit width động (giống code cũ)
  React.useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let rafId: number | null = null;

    const fit = () => {
      const svg = svgRef.current;
      if (!svg) return;

      // Đo chiều rộng thực tế của nội dung barcode (sau khi loại quiet zone)
      const g = svg.querySelector("g") as SVGGElement | null;
      const measureEl = g || svg;
      let contentW = 0;

      try {
        contentW = measureEl.getBBox().width;
      } catch {
        return;
      }

      if (!Number.isFinite(contentW) || contentW <= 0) return;

      const containerW = host.getBoundingClientRect().width;
      if (containerW <= 0) return;

      const targetW = containerW * 0.99; // sát hơn, tránh cắt

      if (baseWidthPerModuleRef.current == null) {
        if (Math.abs(moduleW - 1) < 0.0001) {
          baseWidthPerModuleRef.current = contentW;
        } else {
          setModuleW(1);
        }
        return;
      }

      const baseW = baseWidthPerModuleRef.current;
      if (!Number.isFinite(baseW) || baseW <= 0) return;

      const ideal = targetW / baseW;
      const clamped = Math.max(0.6, Math.min(3.5, ideal)); // min 0.6 để scan ổn
      const step = 0.002;
      const next = Math.round(clamped / step) * step;

      if (Math.abs(next - moduleW) > 0.005) {
        setModuleW(next);
      }
    };

    const scheduleFit = () => {
      if (rafId != null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(fit);
    };

    scheduleFit();

    const ro = new ResizeObserver(scheduleFit);
    ro.observe(host);

    return () => {
      ro.disconnect();
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, [moduleW]);

  return (
    <div
      className="amz_barcode"
      style={{
        position: "absolute",
        top: `${DATA.POS_Y}mm`,
        left: `${DATA.POS_X}mm`,
        width: `${DATA.SIZE_W}mm`,
        height: `${DATA.SIZE_H}mm`,
        transform: `rotate(${DATA.ROTATE}deg)`,
        transformOrigin: "top left",
        overflow: "hidden",
        background: "#fff",
      }}
    >
      <div
        ref={hostRef}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <svg
          ref={svgRef}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
          }}
        />
      </div>
    </div>
  );
};

export default BARCODE2;
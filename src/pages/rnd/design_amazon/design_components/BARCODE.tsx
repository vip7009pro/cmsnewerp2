import React from "react";
import Barcode from "react-barcode";
import { COMPONENT_DATA } from "../../interfaces/rndInterface";

const BARCODE = ({ DATA }: { DATA: COMPONENT_DATA }) => {
  const hostRef = React.useRef<HTMLDivElement | null>(null);
  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const [moduleW, setModuleW] = React.useState<number>(0.8);
  const baseWidthPerModuleRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    baseWidthPerModuleRef.current = null;
    setModuleW(1);
  }, [DATA.GIATRI]);

  React.useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let rafId: number | null = null;

    const fit = () => {
      const svg = host.querySelector("svg") as SVGSVGElement | null;
      if (!svg) return;
      svgRef.current = svg;

      const baseValW = svg.width?.baseVal?.value;
      const attrW = svg.getAttribute("width");
      const parsedAttrW = attrW ? parseFloat(attrW) : NaN;

      const contentW =
        Number.isFinite(baseValW) && baseValW > 0
          ? baseValW
          : Number.isFinite(parsedAttrW) && parsedAttrW > 0
            ? parsedAttrW
            : NaN;

      if (!Number.isFinite(contentW) || contentW <= 0) return;

      const containerW = host.getBoundingClientRect().width;
      if (containerW <= 0) return;

      const targetW = containerW * 0.99; // fit sát hơn

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
      const clamped = Math.max(0.6, Math.min(3, ideal));
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

  // Hack quiet zone: adjust viewBox sau render để cắt khoảng trắng
  React.useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const g = svg.querySelector('g'); // Nhóm chứa thanh bar
    if (!g) return;

    const bbox = g.getBBox(); // Lấy bounding box của nội dung (không tính quiet zone)

    // Adjust viewBox để zoom vào nội dung, loại bỏ quiet zone xung quanh
    const padding = 0; // Có thể thêm padding nhỏ nếu cần
    svg.setAttribute('viewBox', `${bbox.x - padding} ${bbox.y - padding} ${bbox.width + 2 * padding} ${bbox.height + 2 * padding}`);
    svg.setAttribute('preserveAspectRatio', 'none'); // Cho phép stretch để fill full

  }, [moduleW]); // Chạy lại khi moduleW thay đổi (khi resize ngang)

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
        <Barcode
          value={DATA.GIATRI}
          format="CODE128"
          width={moduleW}
          displayValue={false}
          background="#fff"
          lineColor="black"
          margin={0}
          renderer="svg"
        />
      </div>

      {/* CSS ép fill full */}
      <style>{`
        .amz_barcode svg {
          width: 100% !important;
          height: 100% !important;
          display: block !important;
          margin: 0 !important;
          padding: 0 !important;
          object-fit: fill !important;
        }
      `}</style>
    </div>
  );
};

export default BARCODE;
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import "./WidgetInspection.scss";
interface WidgetInfo {
  widgettype?: string;
  label?: string;
  amount?: number;
  percentage?: number;
  topColor?: string;
  botColor?: string;
  material_ppm?: number;
  process_ppm?: number;
  total_ppm?: number;
}
export default function WidgetOQC({
  widgettype,
  label,
  topColor,
  botColor,
  material_ppm,
  process_ppm,
  total_ppm,
}: WidgetInfo) {
  if (widgettype === "revenue") {
    return (
      <div
        className="widgetinspection"
        style={{
          backgroundImage: `linear-gradient(to right, ${topColor}, ${botColor})`,
        }}
      >
        <div className="up">
          <span className="title">{label}</span>
        </div>
        <div className="middle">
        <div className="totalNG">
            {total_ppm?.toLocaleString("en-US", {             
              maximumFractionDigits: 3,
              minimumFractionDigits: 3,
            })}%
          </div>

        </div>
       
      </div>
    );
  } else return <div>NONO</div>;
}

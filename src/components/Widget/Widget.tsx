import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import { getCompany, getGlobalSetting } from "../../api/Api";
import { WEB_SETTING_DATA } from "../../api/GlobalInterface";
import "../Widget/Widget.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
interface WidgetInfo {
  widgettype: string;
  label: string;
  qty: number;
  amount: number;
  percentage: number;
  topColor: string;
  botColor: string;
}
export default function Widget({
  widgettype,
  label,
  qty,
  amount,
  percentage,
  topColor,
  botColor,
}: WidgetInfo) {
  //console.log('percentage',percentage);
  if (widgettype === "revenue") {
    return (
      <div
        className="widget"
        style={{
          backgroundImage: `linear-gradient(to right, ${topColor}, ${botColor})`,
        }}
      >
        <div className="left">
          <span className="title">{label}</span>
          <span className="title2">QTY</span>
          <span className="counter">{qty?.toLocaleString("en-US")} EA</span>
        </div>
        <div className="right">
          <div className="percentage positive">
            {percentage >=0 && <KeyboardArrowUpIcon color="success"/>}
            {percentage <0 && <KeyboardArrowDown color="error"/>}
             <span style={{color: `${percentage >=0 ? 'green': 'red'}` }}>{percentage?.toLocaleString('en-US',{minimumFractionDigits: 2, maximumFractionDigits: 2})}%</span>
          </div>
          <span className="title2">AMOUNT</span>
          <span className="counter">
            {amount?.toLocaleString("en-US", {
              style: "currency",
              currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
            })}
          </span>
        </div>
      </div>
    );
  } else return <div>NONO</div>;
}

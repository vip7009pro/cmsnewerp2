import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import './WidgetInspection.scss'
interface WidgetInfo {
  widgettype?:string,  
  label?: string,
  qty?: number,
  amount?: number,
  percentage?: number,
  topColor?: string,
  botColor?: string,
}
export default function WidgetInspection({widgettype,label,qty,topColor, botColor}: WidgetInfo) {
  if(widgettype === 'revenue')
  {
    return (    
      <div className='widgetinspection' style={{ backgroundImage: `linear-gradient(to right, ${topColor}, ${botColor})`}}>
          <div className="left">
              <span className="title">{label}</span>              
              <span className="materialNG">Material NG</span>
              <span className="processNG">Process NG</span>
              <span className="totalNG">Total NG</span>
          </div>         
          <div className="right">
              <span className="title">{label}</span>              
              <span className="materialNG">{qty?.toLocaleString('en-US')} ppm</span>
              <span className="processNG">{qty?.toLocaleString('en-US')} ppm</span>
              <span className="totalNG">{qty?.toLocaleString('en-US')} ppm</span>
          </div>         
      </div>
    )    
  }
  else
  return <div>NONO</div>
}

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import './WidgetInspection.scss'
interface WidgetInfo {
  widgettype?:string,  
  label?: string,  
  amount?: number,
  percentage?: number,
  topColor?: string,
  botColor?: string,
  
  material_ppm?: number,
  process_ppm?: number,
  total_ppm?: number,
}
export default function WidgetInspection({widgettype,label,topColor, botColor, material_ppm, process_ppm, total_ppm}: WidgetInfo) {
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
              <span className="materialNG">{material_ppm?.toLocaleString('en-US')} ppm</span>
              <span className="processNG">{process_ppm?.toLocaleString('en-US')} ppm</span>
              <span className="totalNG">{total_ppm?.toLocaleString('en-US')} ppm</span>
          </div>         
      </div>
    )    
  }
  else
  return <div>NONO</div>
}

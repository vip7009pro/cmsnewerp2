import React from 'react';
import './MachineTimeLine.scss'; // Import file CSS để định dạng
import { addMinutes } from 'date-fns';
import moment from 'moment';
import { ProductionPlan } from '../../../../api/GlobalInterface';
import { Rnd } from 'react-rnd';
import { IconButton } from '@mui/material';
import { GridClearIcon } from '@mui/x-data-grid';
interface MachineTimeLineProps {
  plans: ProductionPlan[];
  onDoubleClick?: (plan: ProductionPlan) => void;
  onDragEnd?: (plan: ProductionPlan) => void;
  onDrop?: (plan: ProductionPlan, oldplan: ProductionPlan, destplan: ProductionPlan) => void;
  onClear?: (plan: ProductionPlan) => void;
  width: number;
  searchProduct: string;
  auto?: boolean;
}
/*  const colors = [
  '#84942b'
]; */
const colors = [
  '#edbaba', '#66B2FF', '#58d858', '#FFCC99', '#FF99CC',
  '#FFD700', '#00CED1', '#FF6347', '#9370DB', '#20B2AA',
  '#FF4500', '#00FA9A', '#DC143C', '#1E90FF', '#FF69B4',
  '#32CD32', '#FF8C00', '#8A2BE2', '#00FF7F', '#B22222'
]; // Màu sắc cho các kế hoạch
const MachineTimeLine: React.FC<MachineTimeLineProps> = ({ plans, onDoubleClick, width, searchProduct, onDrop, onDragEnd, onClear, auto }) => {
  const totalPlanTime = plans.reduce((total, plan) => total + plan.productionPlanTime, 0);
  const startDate = new Date(Math.min(...plans.map(plan => new Date(plan.productionPlanDate).getTime())));
  const endDate = new Date(Math.max(...plans.map(plan => addMinutes(new Date(plan.productionPlanDate), plan.productionPlanTime).getTime())));
  return (
    <div className="machine-timeline">
      <div className="eq-name" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '12px', fontWeight: 'bold'}}>{plans[0]?.EQ_NAME}</div>
      {plans.map((plan, index) => {
        const planWidth = (auto === false ? 15 : (plan.productionPlanTime)*width/1000); // Tính độ rộng của hình chữ nhật con
        const color = plan.PROD_REQUEST_NO !=='' ? colors[index % colors.length] : '#383838'; // Chọn màu sắc cho từng hình chữ nhật
        let checkSearchProduct: boolean = false;
        checkSearchProduct = plan.PROD_REQUEST_NO.toUpperCase().includes(searchProduct) === true || plan.G_NAME_KD.toUpperCase().includes(searchProduct) === true || plan.G_CODE.toUpperCase().includes(searchProduct) === true || plan.PROD_MAIN_MATERIAL.toUpperCase().includes(searchProduct) === true
        return (
            <div
              draggable={true}
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.dropEffect = 'move'; 
                e.dataTransfer.setData('text/plain', JSON.stringify(plan));
              }}  
              onDragEnd={(e) => {
                if (onDragEnd) {
                  onDragEnd(plan);
                }
              }}   
              onDragOver={(e) => {
                e.preventDefault();
              }} 
              onDrop={(e) => {
                e.preventDefault();
                if (onDrop) {        
                  const planfrom = JSON.parse(e.dataTransfer.getData('text/plain'));                  
                  const oldplan = JSON.parse(JSON.stringify(planfrom));                 
                  planfrom.EQ_NAME = plans[0].EQ_NAME
                  onDrop(planfrom,oldplan, plan);                       
                }
              }}

              key={index}
              className="plan-block"
              style={{
                width: `${planWidth}%`, backgroundColor: searchProduct === null ? color : checkSearchProduct === true ? color : "black", WebkitFilter:
                  searchProduct === null ? "none" : checkSearchProduct === true ? "none" : "blur(5px)",
              }}
              onDoubleClick={() => {
                if (searchProduct !== null && checkSearchProduct === true) {
                  if (onDoubleClick) {
                    onDoubleClick(plan);
                  }
                }
              }}
            >
              <div className="planinfo">
                {auto === false && <div className="button-clear">
                  <IconButton onClick={() => {
                    if (onClear) {
                      onClear(plan);  
                    }
                  }}>
                    <GridClearIcon sx={{fontSize: '12px', position: 'absolute', top: '0', right: '0'}} />
                  </IconButton>
                </div>}
                {plan.PROD_REQUEST_NO !== '-' && <div className="plan-content">
                  <div>{moment.utc(plan.productionPlanDate).format('YYYY-MM-DD HH:mm')}</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#4039ac' }}>{plan.G_NAME_KD}</div>
                  <div>{plan.PROD_REQUEST_NO} / {plan.G_CODE}</div>
                  <div>{plan.productionPlanTime?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} mins / TCD: {plan.productionPlanQty.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} EA</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 'normal', color: '#0d5624' }}>{plan.PROD_MAIN_MATERIAL}</div>
                  <div>RQ: {plan.PROD_REQUEST_DATE} / GH: {plan.DELIVERY_DT} / {plan.G_WIDTH} x {plan.G_LENGTH} mm</div>
                </div>}
                {plan.PROD_REQUEST_NO === '-' && <div className="plan-content" >
                  OFF
                  <div>{moment.utc(plan.productionPlanDate).format('YYYY-MM-DD HH:mm')}</div>
                  <div>{plan.productionPlanTime?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} mins</div>
                </div>}
              </div>
              <div className="materialinfo" style={{ backgroundColor: plan.M_STOCK_QTY < plan.NEEDED_M ? 'red' : 'green' }}>
                <div style={{ fontSize: '0.6rem', fontWeight: 'normal', color: '#ffffff' }}>{plan.M_STOCK_QTY?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} MET</div> /
                <div style={{ fontSize: '0.6rem', fontWeight: 'normal', color: '#ffffff' }}>{plan.NEEDED_M?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} MET</div>
              </div>
            </div>          
        );
      })}
    </div>
  );
};
export default MachineTimeLine;

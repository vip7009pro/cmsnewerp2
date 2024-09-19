import React from 'react';
import './MachineTimeLine.scss'; // Import file CSS để định dạng
import { addMinutes } from 'date-fns';
import moment from 'moment';
import { ProductionPlan } from '../../../../api/GlobalInterface';



interface MachineTimeLineProps {
  plans: ProductionPlan[];
  width: number;
}

const colors = ['#FF9999', '#66B2FF', '#58d858', '#FFCC99', '#FF99CC']; // Màu sắc cho các kế hoạch

const MachineTimeLine: React.FC<MachineTimeLineProps> = ({ plans, width }) => {
  const totalPlanTime = plans.reduce((total, plan) => total + plan.productionPlanTime, 0);
  const startDate = new Date(Math.min(...plans.map(plan => new Date(plan.productionPlanDate).getTime())));
  const endDate = new Date(Math.max(...plans.map(plan => addMinutes(new Date(plan.productionPlanDate), plan.productionPlanTime).getTime())));
  return (
    <div className="machine-timeline" >
      <div className="eq-name" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '12px', fontWeight: 'bold'}}>{plans[0]?.EQ_NAME}</div>
      {plans.map((plan, index) => {
        const planWidth = (plan.productionPlanTime)*width/1000; // Tính độ rộng của hình chữ nhật con
        const color = plan.PROD_REQUEST_NO !=='' ? colors[index % colors.length] : '#383838'; // Chọn màu sắc cho từng hình chữ nhật

        return (
          <div
            key={index}
            className="plan-block"
            style={{ width: `${planWidth}%`, backgroundColor: color,}}
          >
            {plan.PROD_REQUEST_NO !=='' && <div className="plan-content">
              <div>{moment.utc(plan.productionPlanDate).format('YYYY-MM-DD HH:mm')}</div>              
              <div>{plan.G_NAME_KD}</div>
              <div>{plan.PROD_REQUEST_NO} / {plan.G_CODE}</div>
              <div>{plan.productionPlanTime?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} mins</div>
              <div>{plan.PROD_MAIN_MATERIAL}</div>
              <div>{plan.DELIVERY_DT}/{plan.G_WIDTH} x {plan.G_LENGTH} mm</div>              
            </div>}
            {plan.PROD_REQUEST_NO ==='' && <div className="plan-content">
              OFF        
              <div>{moment.utc(plan.productionPlanDate).format('YYYY-MM-DD HH:mm')}</div>
              <div>{plan.productionPlanTime?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} mins</div>    
            </div>}
          </div>
        );
      })}
    </div>
  );
};

export default MachineTimeLine;

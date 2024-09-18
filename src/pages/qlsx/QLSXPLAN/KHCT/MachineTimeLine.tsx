import React from 'react';
import './MachineTimeLine.scss'; // Import file CSS để định dạng
import { addMinutes } from 'date-fns';
import moment from 'moment';

interface ProductionPlan {
  poNo: string;
  productCode: string;
  eqName: string;
  productionPlanDate: string;
  productionPlanQty: number;
  productionPlanTime: number; // Đơn vị: phút
  material: string;
  moldWidth: number;
  moldLength: number;
  deliveryRequestDate: string;
}

interface MachineTimeLineProps {
  plans: ProductionPlan[];
}

const colors = ['#FF9999', '#66B2FF', '#58d858', '#FFCC99', '#FF99CC']; // Màu sắc cho các kế hoạch

const MachineTimeLine: React.FC<MachineTimeLineProps> = ({ plans }) => {
  const totalPlanTime = plans.reduce((total, plan) => total + plan.productionPlanTime, 0);
  const startDate = new Date(Math.min(...plans.map(plan => new Date(plan.productionPlanDate).getTime())));
  const endDate = new Date(Math.max(...plans.map(plan => addMinutes(new Date(plan.productionPlanDate), plan.productionPlanTime).getTime())));

  return (
    <div className="machine-timeline">
      <div className="eq-name">{plans[0]?.eqName}</div>
      {plans.map((plan, index) => {
        const planWidth = (plan.productionPlanTime)/40; // Tính độ rộng của hình chữ nhật con
        const color = colors[index % colors.length]; // Chọn màu sắc cho từng hình chữ nhật

        return (
          <div
            key={index}
            className="plan-block"
            style={{ width: `${planWidth}%`, backgroundColor: color }}
          >
            <div className="plan-content">
              <div>{moment.utc(plan.productionPlanDate).format('YYYY-MM-DD HH:mm')}</div>
              <div>{plan.productCode}</div>
              <div>{plan.productionPlanTime} mins</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MachineTimeLine;

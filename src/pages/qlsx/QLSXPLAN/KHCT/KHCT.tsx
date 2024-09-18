import React, { useState } from 'react'
import './KHCT.scss'
import { parseISO, format, addMinutes, compareAsc, setHours, setMinutes, addDays } from 'date-fns';
import { SaveExcel } from '../../../../api/GlobalFunction';
import moment from 'moment';
import MachineTimeLine from './MachineTimeLine';
import DateMarkers from './DateMarkers';
const KHCT = () => {
  interface ProductOrder {
    poNo: string;
    productCode: string;
    poQty: number;
    deliveryRequestDate: string;
    moldWidth: number;
    moldLength: number;
    productionTime: number; // Đơn vị: phút
    material: string;
  }

  interface Equipment {
    eqName: string;
    eqQty: number;
  }

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




  const [plans, setPlans] = useState<ProductionPlan[]>([])
  // Hàm kiểm tra xem thời gian có trong giờ hành chính hay không
function isWithinBusinessHours(date: Date): boolean {
  const hour = date.getHours();
  return (hour >= 8 && hour < 17) || (hour >= 20 || hour < 5);
}

// Hàm điều chỉnh thời gian để bắt đầu trong giờ hành chính nếu cần thiết
function adjustToBusinessHours(date: Date): Date {
  const hour = date.getHours();
  if (hour >= 5 && hour < 8) {
      return setHours(setMinutes(date, 0), 8); // Đặt lại thời gian thành 8:00 sáng cùng ngày
  } else if (hour >= 17 && hour < 20) {
      return setHours(setMinutes(date, 0), 20); // Đặt lại thời gian thành 20:00 tối cùng ngày
  }
  return date;
}

// Hàm cộng thêm thời gian sản xuất, bỏ qua thời gian ngoài giờ hành chính
function addProductionMinutes(startDate: Date, minutes: number): Date {
  let currentDate = startDate;
  let remainingMinutes = minutes;

  while (remainingMinutes > 0) {
      currentDate = adjustToBusinessHours(currentDate);

      const hour = currentDate.getHours();
      let endOfShift: Date;

      if (hour >= 8 && hour < 17) {
          endOfShift = setHours(setMinutes(new Date(currentDate), 0), 17);
      } else {
          endOfShift = setHours(setMinutes(addDays(new Date(currentDate), hour < 5 ? 0 : 1), 0), 5);
      }

      const availableMinutes = (endOfShift.getTime() - currentDate.getTime()) / 60000; // Tính số phút sẵn có trong ca hiện tại

      if (remainingMinutes <= availableMinutes) {
          return addMinutes(currentDate, remainingMinutes);
      } else {
          remainingMinutes -= availableMinutes;
          currentDate = addMinutes(endOfShift, 0);
      }
  }

  return currentDate;
}

// Hàm lập kế hoạch sản xuất
function createProductionPlan(orders: ProductOrder[], equipments: Equipment[]): ProductionPlan[] {
  // Sắp xếp đơn hàng theo ngày giao hàng
  orders.sort((a, b) => new Date(a.deliveryRequestDate).getTime() - new Date(b.deliveryRequestDate).getTime());

  // Gom nhóm đơn hàng theo kích thước khuôn
  const groupedByMold = groupBy(orders, order => `${order.moldWidth}x${order.moldLength}`);

  const plans: ProductionPlan[] = [];

  // Tạo danh sách các máy móc và thời gian sẵn có của chúng
  const availableMachines = equipments.flatMap(eq => 
      Array.from({ length: eq.eqQty }, () => ({ eqName: eq.eqName, availableFrom: new Date() }))
  );

  // Duyệt qua từng nhóm kích thước khuôn
  for (const moldGroup of groupedByMold.values()) {
      // Gom nhóm theo vật liệu
      const groupedByMaterial = groupBy(moldGroup, order => order.material);

      for (const materialGroup of groupedByMaterial.values()) {
          for (const order of materialGroup) {
              let remainingQty = order.poQty;

              while (remainingQty > 0) {
                  // Sắp xếp máy móc theo thời gian sẵn có
                  availableMachines.sort((a, b) => compareAsc(a.availableFrom, b.availableFrom));

                  for (const machine of availableMachines) {
                      if (remainingQty <= 0) break;

                      const productionPlanQty = Math.min(remainingQty, order.poQty);
                      const productionPlanTime = (productionPlanQty / order.poQty) * order.productionTime;
                      const productionEndDate = addProductionMinutes(machine.availableFrom, productionPlanTime);

                      plans.push({
                          poNo: order.poNo,
                          productCode: order.productCode,
                          eqName: machine.eqName,
                          productionPlanDate: format(machine.availableFrom, 'yyyy-MM-dd HH:mm'),
                          productionPlanQty,
                          productionPlanTime,
                          material: order.material,
                          moldWidth: order.moldWidth,
                          moldLength: order.moldLength,
                          deliveryRequestDate: order.deliveryRequestDate
                      });

                      remainingQty -= productionPlanQty;
                      machine.availableFrom = productionEndDate;
                  }
              }
          }
      }
  }

  plans.sort((a, b) => {
    const machineComparison = a.eqName.localeCompare(b.eqName);
    if (machineComparison !== 0) return machineComparison;
    return compareAsc(parseISO(a.productionPlanDate), parseISO(b.productionPlanDate));
  });

  return plans;
}


const startDate = new Date(Math.min(...plans.map(plan => new Date(plan.productionPlanDate).getTime())));
const endDate = new Date(Math.max(...plans.map(plan => addMinutes(new Date(plan.productionPlanDate), plan.productionPlanTime).getTime())));
console.log(startDate)
console.log(endDate)

  // Hàm gom nhóm
  function groupBy<T>(list: T[], keyGetter: (item: T) => any): Map<any, T[]> {
    const map = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }

  // Dữ liệu đầu vào
  const orders: ProductOrder[] = [
    { poNo: 'PO1', productCode: 'P1', poQty: 100, deliveryRequestDate: '2024-10-01', moldWidth: 10, moldLength: 20, productionTime: 650, material: 'A' },
    { poNo: 'PO1', productCode: 'P2', poQty: 200, deliveryRequestDate: '2024-10-02', moldWidth: 10, moldLength: 20, productionTime: 120, material: 'B' },
    { poNo: 'PO2', productCode: 'P1', poQty: 150, deliveryRequestDate: '2024-10-01', moldWidth: 10, moldLength: 20, productionTime: 600, material: 'A' },
    { poNo: 'PO3', productCode: 'P3', poQty: 150, deliveryRequestDate: '2024-10-01', moldWidth: 10, moldLength: 20, productionTime: 900, material: 'C' },
    { poNo: 'PO4', productCode: 'P4', poQty: 120, deliveryRequestDate: '2024-10-03', moldWidth: 12, moldLength: 22, productionTime: 750, material: 'C' },
    { poNo: 'PO5', productCode: 'P5', poQty: 180, deliveryRequestDate: '2024-10-04', moldWidth: 11, moldLength: 21, productionTime: 190, material: 'C' },
    { poNo: 'PO6', productCode: 'P6', poQty: 130, deliveryRequestDate: '2024-10-05', moldWidth: 13, moldLength: 23, productionTime: 480, material: 'A' },
    { poNo: 'PO7', productCode: 'P7', poQty: 160, deliveryRequestDate: '2024-10-06', moldWidth: 13, moldLength: 23, productionTime: 100, material: 'A' },
    { poNo: 'PO8', productCode: 'P8', poQty: 140, deliveryRequestDate: '2024-10-07', moldWidth: 16, moldLength: 26, productionTime: 385, material: 'B' },
    { poNo: 'PO9', productCode: 'P9', poQty: 190, deliveryRequestDate: '2024-10-08', moldWidth: 13, moldLength: 23, productionTime: 110, material: 'B' },
    { poNo: 'PO10', productCode: 'P1', poQty: 110, deliveryRequestDate: '2024-10-09', moldWidth: 13, moldLength: 23, productionTime: 570, material: 'A' },
    { poNo: 'PO11', productCode: 'P11', poQty: 170, deliveryRequestDate: '2024-10-10', moldWidth: 19, moldLength: 29, productionTime: 295, material: 'C' },
    { poNo: 'PO12', productCode: 'P12', poQty: 125, deliveryRequestDate: '2024-10-11', moldWidth: 20, moldLength: 30, productionTime: 278, material: 'C' },
    { poNo: 'PO13', productCode: 'P3', poQty: 185, deliveryRequestDate: '2024-10-12', moldWidth: 21, moldLength: 31, productionTime: 305, material: 'D' },
    { poNo: 'PO14', productCode: 'P4', poQty: 135, deliveryRequestDate: '2024-10-13', moldWidth: 22, moldLength: 32, productionTime: 482, material: 'A' },
    { poNo: 'PO15', productCode: 'P1', poQty: 165, deliveryRequestDate: '2024-10-14', moldWidth: 23, moldLength: 33, productionTime: 298, material: 'A' },
    { poNo: 'PO16', productCode: 'P6', poQty: 145, deliveryRequestDate: '2024-10-15', moldWidth: 23, moldLength: 33, productionTime: 388, material: 'B' },
    { poNo: 'PO17', productCode: 'P7', poQty: 195, deliveryRequestDate: '2024-10-16', moldWidth: 23, moldLength: 33, productionTime: 515, material: 'B' },
    { poNo: 'PO18', productCode: 'P8', poQty: 115, deliveryRequestDate: '2024-10-17', moldWidth: 26, moldLength: 36, productionTime: 372, material: 'A' },
    { poNo: 'PO19', productCode: 'P9', poQty: 175, deliveryRequestDate: '2024-10-18', moldWidth: 27, moldLength: 37, productionTime: 300, material: 'C' },
    { poNo: 'PO20', productCode: 'P2', poQty: 130, deliveryRequestDate: '2024-10-19', moldWidth: 28, moldLength: 38, productionTime: 140, material: 'B' },
    { poNo: 'PO100', productCode: 'P1', poQty: 150, deliveryRequestDate: '2024-12-08', moldWidth: 108, moldLength: 118, productionTime: 192, material: 'A' },
    { poNo: 'PO101', productCode: 'P1', poQty: 140, deliveryRequestDate: '2024-12-09', moldWidth: 108, moldLength: 118, productionTime: 286, material: 'A' },
    { poNo: 'PO102', productCode: 'P2', poQty: 160, deliveryRequestDate: '2024-12-10', moldWidth: 110, moldLength: 120, productionTime: 397, material: 'B' },
    { poNo: 'PO103', productCode: 'P3', poQty: 170, deliveryRequestDate: '2024-12-11', moldWidth: 108, moldLength: 118, productionTime: 403, material: 'A' },
    // Thêm các đơn hàng khác
  ];

  const equipments: Equipment[] = [
    { eqName: 'Machine01', eqQty: 1 },
    { eqName: 'Machine02', eqQty: 1 },
    { eqName: 'Machine03', eqQty: 1 },
    { eqName: 'Machine04', eqQty: 1 },
    { eqName: 'Machine05', eqQty: 1 },
    { eqName: 'Machine06', eqQty: 1 },
    { eqName: 'Machine07', eqQty: 1 },
    { eqName: 'Machine08', eqQty: 1 },
    { eqName: 'Machine09', eqQty: 1 },
    { eqName: 'Machine10', eqQty: 1 },
    // Thêm các thiết bị khác
  ];

  return (
    <div><button onClick={() => {
      console.log(orders)
      const plans = createProductionPlan(orders, equipments)
      console.log(plans)
      setPlans(plans)
      
      /* SaveExcel(orders, 'Đơn hàng')
      SaveExcel(plans, 'Kế hoạch sản xuất') */

    }}>Tạo kế hoạch sản xuất</button>
      <div className="timeline-container">
        <DateMarkers startDate={startDate} endDate={endDate} />
        <MachineTimeLine plans={plans.filter(plan => plan.eqName === 'Machine01')} />        
        <MachineTimeLine plans={plans.filter(plan => plan.eqName === 'Machine02')} />        
        <MachineTimeLine plans={plans.filter(plan => plan.eqName === 'Machine03')} />
        <MachineTimeLine plans={plans.filter(plan => plan.eqName === 'Machine04')} />
        <MachineTimeLine plans={plans.filter(plan => plan.eqName === 'Machine05')} />
        <MachineTimeLine plans={plans.filter(plan => plan.eqName === 'Machine06')} />
        <MachineTimeLine plans={plans.filter(plan => plan.eqName === 'Machine07')} />
        <MachineTimeLine plans={plans.filter(plan => plan.eqName === 'Machine08')} />
        <MachineTimeLine plans={plans.filter(plan => plan.eqName === 'Machine09')} />
        <MachineTimeLine plans={plans.filter(plan => plan.eqName === 'Machine10')} />
      </div>


   {/*  
    <div>
      <table className="order-table" style={{ border: '1px solid black', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '5px' }}>PO No</th>
            <th style={{ border: '1px solid black', padding: '5px' }}>Product Code</th>
            <th style={{ border: '1px solid black', padding: '5px' }}>PO Qty</th>
            <th style={{ border: '1px solid black', padding: '5px' }}>Delivery Request Date</th>
            <th style={{ border: '1px solid black', padding: '5px' }}>Mold Width</th>
            <th style={{ border: '1px solid black', padding: '5px' }}>Mold Length</th>
            <th style={{ border: '1px solid black', padding: '5px' }}>Production Time (min)</th>
            <th style={{ border: '1px solid black', padding: '5px' }}>Material</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid black', padding: '5px' }}>{order.poNo}</td>
              <td style={{ border: '1px solid black', padding: '5px' }}>{order.productCode}</td>
              <td style={{ border: '1px solid black', padding: '5px' }}>{order.poQty}</td>
              <td style={{ border: '1px solid black', padding: '5px' }}>{order.deliveryRequestDate}</td>
              <td style={{ border: '1px solid black', padding: '5px' }}>{order.moldWidth}</td>
              <td style={{ border: '1px solid black', padding: '5px' }}>{order.moldLength}</td>
              <td style={{ border: '1px solid black', padding: '5px' }}>{order.productionTime}</td>
              <td style={{ border: '1px solid black', padding: '5px' }}>{order.material}</td>
            </tr>
          ))}
        </tbody>
      </table>

      
      <table className="plan-table" style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '5px' }}>PO No</th>
            <th style={{ border: '1px solid black', padding: '5px' }}>Product Code</th>
            <th style={{ border: '1px solid black', padding: '5px' }}>Equipment</th>
            <th style={{ border: '1px solid black', padding: '5px' }}>Plan Date</th>
            <th style={{ border: '1px solid black', padding: '5px' }}>Plan Qty</th>
            <th style={{ border: '1px solid black', padding: '5px' }}>Plan Time (min)</th>
            <th style={{ border: '1px solid black', padding: '5px' }}>Material</th>
            <th style={{ border: '1px solid black', padding: '5px' }}>Mold Width</th>
            <th style={{ border: '1px solid black', padding: '5px' }}>Mold Length</th>
            <th style={{ border: '1px solid black', padding: '5px' }}>Delivery Date</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid black', padding: '5px' }}>{plan.poNo}</td>
              <td style={{ border: '1px solid black', padding: '5px' }}>{plan.productCode}</td>
              <td style={{ border: '1px solid black', padding: '5px' }}>{plan.eqName}</td>
              <td style={{ border: '1px solid black', padding: '5px' }}>{plan.productionPlanDate}</td>
              <td style={{ border: '1px solid black', padding: '5px' }}>{plan.productionPlanQty}</td>
              <td style={{ border: '1px solid black', padding: '5px' }}>{plan.productionPlanTime}</td>
              <td style={{ border: '1px solid black', padding: '5px' }}>{plan.material}</td>
              <td style={{ border: '1px solid black', padding: '5px' }}>{plan.moldWidth}</td>
              <td style={{ border: '1px solid black', padding: '5px' }}>{plan.moldLength}</td>
              <td style={{ border: '1px solid black', padding: '5px' }}>{plan.deliveryRequestDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>   */}
    </div>
  )
}

export default KHCT
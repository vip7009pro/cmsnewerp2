import React, { useEffect, useState } from 'react'
import './KHCT.scss'
import { parseISO, format, addMinutes, compareAsc, setHours, setMinutes, addDays } from 'date-fns';
import { f_handle_loadEQ_STATUS, f_loadLeadtimeData, SaveExcel } from '../../../../api/GlobalFunction';
import moment from 'moment';
import MachineTimeLine from './MachineTimeLine';
import DateMarkers from './DateMarkers';
import { EQ_STT, LEADTIME_DATA, ProductionPlan } from '../../../../api/GlobalInterface';
import Swal from 'sweetalert2';
import { IconButton } from '@mui/material';
import { MdCreate } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';


const KHCT = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [plans, setPlans] = useState<ProductionPlan[]>([])
  const [FRplans, setFRPlans] = useState<ProductionPlan[]>([])
  const [SRplans, setSRPlans] = useState<ProductionPlan[]>([])
  const [DCplans, setDCPlans] = useState<ProductionPlan[]>([])
  const [EDplans, setEDPlans] = useState<ProductionPlan[]>([])
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [endDate, setEndDate] = useState<Date>(new Date())
  const [leadtimeData, setLeadtimeData] = useState<LEADTIME_DATA[]>([])
  const [FRleadtimeData, FRsetLeadtimeData] = useState<LEADTIME_DATA[]>([])
  const [SRleadtimeData, SRsetLeadtimeData] = useState<LEADTIME_DATA[]>([])
  const [DCleadtimeData, DCsetLeadtimeData] = useState<LEADTIME_DATA[]>([])
  const [EDleadtimeData, EDsetLeadtimeData] = useState<LEADTIME_DATA[]>([])
  const [eq_series, setEqSeries] = useState<string[]>([])
  const [eq_status, setEqStatus] = useState<EQ_STT[]>([])
  const [overtimeday, setOvertimeDay] = useState<boolean>(false)
  const [overtimenight, setOvertimeNight] = useState<boolean>(false)
  const [showFR, setShowFR] = useState<boolean>(true)
  const [showSR, setShowSR] = useState<boolean>(true)
  const [showDC, setShowDC] = useState<boolean>(true)
  const [showED, setShowED] = useState<boolean>(true)
  const handleLoadEQ_STATUS = async () => {
    const data = await f_handle_loadEQ_STATUS()
    setEqSeries(data.EQ_SERIES)
    setEqStatus(data.EQ_STATUS.filter(item => item.FACTORY === 'NM1' && item.EQ_ACTIVE==='OK'))
  }
  const handleLoadLeadtimeData = async () => {
    Swal.fire({
      title: 'Đang load tồn yêu cầu...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
    })
    const data = await f_loadLeadtimeData();
    const FRdata = data.filter(item => item.MACHINE === 'FR')
    const SRdata = data.filter(item => item.MACHINE === 'SR')
    const DCdata = data.filter(item => item.MACHINE === 'DC')
    const EDdata = data.filter(item => item.MACHINE === 'ED')
    setLeadtimeData(data);
    FRsetLeadtimeData(FRdata)
    SRsetLeadtimeData(SRdata)
    DCsetLeadtimeData(DCdata)
    EDsetLeadtimeData(EDdata)
    Swal.close()
  }
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
  function createProductionPlan2(orders: LEADTIME_DATA[], machines: EQ_STT[]): ProductionPlan[] {
    let plans: ProductionPlan[] = [];
    let currentDateTime = new Date();
    const workingHoursStartDay = 8 * 60; // 8:00 AM in minutes
    const workingHoursEndDay = overtimeday ? 20 * 60 : 17 * 60; // 5:00 PM in minutes
    const workingHoursStartNight = 20 * 60; // 8:00 PM in minutes
    const workingHoursEndNight = overtimenight ? 8 * 60 : 5 * 60; // 5:00 AM in minutes of the next day
    // Sắp xếp các đơn hàng theo thứ tự ưu tiên
    orders.sort((a, b) => new Date(a.DELIVERY_DT).getTime() - new Date(b.DELIVERY_DT).getTime() ||
      a.G_WIDTH - b.G_WIDTH ||
      a.G_LENGTH - b.G_LENGTH ||
      a.PROD_MAIN_MATERIAL?.localeCompare(b.PROD_MAIN_MATERIAL));
    let machineIndexes: { [key: string]: Date } = {};
    machines.forEach(machine => {
      machineIndexes[machine.EQ_NAME ?? ""] = new Date(currentDateTime);
    });
    // Phân bổ đơn hàng vào các máy
    orders.forEach(order => {
      let remainingProductionTime = order.LEADTIME;
      let machine = machines.shift(); // Lấy máy đầu tiên từ danh sách máy
      while (remainingProductionTime > 0 && machine) {
        let machineCurrentDateTime = machineIndexes[machine.EQ_NAME ?? ""];
        let planStartTime = machineCurrentDateTime.getHours() * 60 + machineCurrentDateTime.getMinutes();
        let availableTime = 0;
        if (planStartTime >= workingHoursStartDay && planStartTime < workingHoursEndDay) {
          availableTime = workingHoursEndDay - planStartTime;
        } else if (planStartTime >= workingHoursStartNight || planStartTime < workingHoursEndNight) {
          if (planStartTime >= workingHoursStartNight) {
            availableTime = 24 * 60 - planStartTime + workingHoursEndNight;
          } else {
            availableTime = workingHoursEndNight - planStartTime;
          }
        } else {
          if (planStartTime < workingHoursStartDay) {
            let gapTime = workingHoursStartDay - planStartTime;
            plans.push({
              PROD_REQUEST_NO: '',
              G_NAME: '',
              G_NAME_KD: '',
              G_CODE: '',
              EQ_NAME: machine.EQ_NAME ?? "",
              productionPlanDate: moment.utc(machineCurrentDateTime).add(7, 'hours').toISOString(),
              productionPlanQty: 0,
              productionPlanTime: gapTime,
              PROD_MAIN_MATERIAL: '',
              G_WIDTH: 0,
              G_LENGTH: 0,
              DELIVERY_DT: ''
            });
            machineCurrentDateTime.setMinutes(machineCurrentDateTime.getMinutes() + gapTime);
            continue;
          } else {
            let gapTime = workingHoursStartNight - planStartTime;
            plans.push({
              PROD_REQUEST_NO: '',
              G_NAME: '',
              G_NAME_KD: '',
              G_CODE: '',
              EQ_NAME: machine.EQ_NAME ?? "",
              productionPlanDate: moment.utc(machineCurrentDateTime).add(7, 'hours').toISOString(),
              productionPlanQty: 0,
              productionPlanTime: gapTime,
              PROD_MAIN_MATERIAL: '',
              G_WIDTH: 0,
              G_LENGTH: 0,
              DELIVERY_DT: ''
            });
            machineCurrentDateTime.setMinutes(machineCurrentDateTime.getMinutes() + gapTime);
            continue;
          }
        }
        let productionTime = Math.min(availableTime, remainingProductionTime);
        plans.push({
          PROD_REQUEST_NO: order.PROD_REQUEST_NO,
          G_CODE: order.G_CODE,
          G_NAME: order.G_NAME,
          G_NAME_KD: order.G_NAME_KD,
          EQ_NAME: machine.EQ_NAME ?? "",
          productionPlanDate: moment.utc(machineCurrentDateTime).add(7, 'hours').toISOString(),
          productionPlanQty: order.TCD,
          productionPlanTime: order.LEADTIME,
          PROD_MAIN_MATERIAL: order.PROD_MAIN_MATERIAL,
          G_WIDTH: order.G_WIDTH,
          G_LENGTH: order.G_LENGTH,
          DELIVERY_DT: order.DELIVERY_DT
        });
        machineCurrentDateTime.setMinutes(machineCurrentDateTime.getMinutes() + productionTime);
        remainingProductionTime -= productionTime;
        if (remainingProductionTime > 0 && (planStartTime + productionTime) >= workingHoursEndDay && planStartTime < workingHoursStartNight) {
          let gapTime = workingHoursStartNight - (planStartTime + productionTime);
          plans.push({
            PROD_REQUEST_NO: '',
            G_CODE: '',
            G_NAME: '',
            G_NAME_KD: '',
            EQ_NAME: machine.EQ_NAME ?? "",
            productionPlanDate: moment.utc(machineCurrentDateTime).add(7, 'hours').toISOString(),
            productionPlanQty: 0,
            productionPlanTime: gapTime,
            PROD_MAIN_MATERIAL: '',
            G_WIDTH: 0,
            G_LENGTH: 0,
            DELIVERY_DT: ''
          });
          machineCurrentDateTime.setMinutes(machineCurrentDateTime.getMinutes() + gapTime);
        } else if (remainingProductionTime > 0 && (planStartTime + productionTime) >= workingHoursEndNight && planStartTime >= workingHoursStartNight) {
          let gapTime = workingHoursStartDay - (planStartTime + productionTime - 24 * 60);
          plans.push({
            PROD_REQUEST_NO: '',
            G_CODE: '',
            G_NAME: '',
            G_NAME_KD: '',
            EQ_NAME: machine.EQ_NAME ?? "",
            productionPlanDate: moment.utc(machineCurrentDateTime).add(7, 'hours').toISOString(),
            productionPlanQty: 0,
            productionPlanTime: gapTime,
            PROD_MAIN_MATERIAL: '',
            G_WIDTH: 0,
            G_LENGTH: 0,
            DELIVERY_DT: ''
          });
          machineCurrentDateTime.setMinutes(machineCurrentDateTime.getMinutes() + gapTime);
        }
        machineIndexes[machine.EQ_NAME ?? ""] = machineCurrentDateTime; // Cập nhật thời gian hiện tại của máy
      }
      if (machine) {
        machines.push(machine); // Đưa máy trở lại danh sách máy
      }
    });
    // Sắp xếp kế hoạch sản xuất theo tên máy và thời gian sản xuất
    plans.sort((a, b) => a.EQ_NAME.localeCompare(b.EQ_NAME) || new Date(a.productionPlanDate).getTime() - new Date(b.productionPlanDate).getTime());
    return plans;
  }
  // Hàm lập kế hoạch sản xuất
  function createProductionPlan(orders: LEADTIME_DATA[], equipments: EQ_STT[]): ProductionPlan[] {
      // Sắp xếp đơn hàng theo ngày giao hàng
      orders.sort((a, b) => new Date(a.DELIVERY_DT).getTime() - new Date(b.DELIVERY_DT).getTime());
      // Gom nhóm đơn hàng theo kích thước khuôn
      const groupedByMold = groupBy(orders, order => `${order.G_WIDTH}x${order.G_LENGTH}`);
      const plans: ProductionPlan[] = [];
      // Tạo danh sách các máy móc và thời gian sẵn có của chúng
      const availableMachines = equipments.flatMap(eq =>
        Array.from({ length: 1 }, () => ({ eqName: eq.EQ_NAME, availableFrom: new Date() }))
      );
      // Duyệt qua từng nhóm kích thước khuôn
      for (const moldGroup of groupedByMold.values()) {
        // Gom nhóm theo vật liệu
        const groupedByMaterial = groupBy(moldGroup, order => order.PROD_MAIN_MATERIAL);
        for (const materialGroup of groupedByMaterial.values()) {
          for (const order of materialGroup) {
            let remainingQty = order.TCD;
            while (remainingQty > 0) {
              // Sắp xếp máy móc theo thời gian sẵn có
              availableMachines.sort((a, b) => compareAsc(a.availableFrom, b.availableFrom));
              for (const machine of availableMachines) {
                if (remainingQty <= 0) break;
                const productionPlanQty = Math.min(remainingQty, order.TCD);
                const productionPlanTime = (productionPlanQty / order.TCD) * order.LEADTIME;
                const productionEndDate = addProductionMinutes(machine.availableFrom, productionPlanTime);
                plans.push({
                  PROD_REQUEST_NO: order.PROD_REQUEST_NO,
                  G_NAME: order.G_NAME,
                  G_NAME_KD: order.G_NAME_KD,
                  G_CODE: order.G_CODE,
                  EQ_NAME: machine.eqName ?? "",
                  productionPlanDate: format(machine.availableFrom, 'yyyy-MM-dd HH:mm'),
                  productionPlanQty,
                  productionPlanTime,
                  PROD_MAIN_MATERIAL: order.PROD_MAIN_MATERIAL,
                  G_WIDTH: order.G_WIDTH,
                  G_LENGTH: order.G_LENGTH,
                  DELIVERY_DT: order.DELIVERY_DT
                });
                remainingQty -= productionPlanQty;
                machine.availableFrom = productionEndDate;
              }
            }
          }
        }
      }
      plans.sort((a, b) => {
        const machineComparison = a.EQ_NAME.localeCompare(b.EQ_NAME);
        if (machineComparison !== 0) return machineComparison;
        return compareAsc(parseISO(a.productionPlanDate), parseISO(b.productionPlanDate));
      });
      return plans;
  }
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
  const [width, setWidth] = useState(20);
  const handleWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWidth(Number(event.target.value));
  };



  const DAY_SHIFT_START_HOUR = 8;
  const DAY_SHIFT_END_HOUR = 17;
  const NIGHT_SHIFT_START_HOUR = 20;
  const NIGHT_SHIFT_END_HOUR = 5;

  // Hàm kiểm tra nếu thời gian nằm trong ca làm việc
  function isWorkingTime(date: moment.Moment): boolean {
  const hour = date.hour();
  return (
    (hour >= DAY_SHIFT_START_HOUR && hour < DAY_SHIFT_END_HOUR) ||
    (hour >= NIGHT_SHIFT_START_HOUR || hour < NIGHT_SHIFT_END_HOUR)
  );
  }


// Hàm lập kế hoạch sản xuất
function createProductionPlan3(orders: LEADTIME_DATA[], equipments: EQ_STT[]): ProductionPlan[] {
  // Sắp xếp đơn hàng theo ngày giao hàng
  orders.sort((a, b) => moment(a.DELIVERY_DT).diff(moment(b.DELIVERY_DT)));

  // Gom nhóm đơn hàng theo kích thước khuôn
  const groupedByMold = groupBy(orders, order => `${order.G_WIDTH}x${order.G_LENGTH}`);

  const plans: ProductionPlan[] = [];
  const availableMachines = equipments.flatMap(eq => Array(1).fill(eq.EQ_NAME));

  // Duyệt qua từng nhóm kích thước khuôn
  for (const moldGroup of groupedByMold.values()) {
    // Gom nhóm theo vật liệu
    const groupedByMaterial = groupBy(moldGroup, order => order.PROD_MAIN_MATERIAL);

    for (const materialGroup of groupedByMaterial.values()) {
      for (const order of materialGroup) {
        let currentDate = moment();

        for (const machine of availableMachines) {
          // Nếu không trong giờ làm việc, thêm kế hoạch rỗng và điều chỉnh thời gian
          if (!isWorkingTime(currentDate)) {
            let nextWorkingStart = currentDate.clone();
            if (currentDate.hour() >= DAY_SHIFT_END_HOUR && currentDate.hour() < NIGHT_SHIFT_START_HOUR) {
              nextWorkingStart = currentDate.clone().hour(NIGHT_SHIFT_START_HOUR).minute(0);
            } else {
              nextWorkingStart = nextWorkingStart.add(1, 'day').hour(DAY_SHIFT_START_HOUR).minute(0);
            }
            plans.push({
              PROD_REQUEST_NO: '',
              G_CODE: '',
              G_NAME: '',
              G_NAME_KD: '',
              EQ_NAME: machine,
              productionPlanDate: currentDate.format('YYYY-MM-DD HH:mm'),
              productionPlanTime: nextWorkingStart.diff(currentDate, 'minutes'),
              DELIVERY_DT: '',
              G_WIDTH: 0,
              G_LENGTH: 0,
              PROD_MAIN_MATERIAL: '',
              productionPlanQty: 0
            });
            currentDate = nextWorkingStart;
            continue;
          }

          plans.push({
            PROD_REQUEST_NO: order.PROD_REQUEST_NO,
            G_CODE: order.G_CODE,
            G_NAME: order.G_NAME,
            G_NAME_KD: order.G_NAME_KD,
            EQ_NAME: machine,
            productionPlanDate: currentDate.format('YYYY-MM-DD HH:mm'),
            productionPlanQty: order.TCD,
            productionPlanTime: order.LEADTIME,
            DELIVERY_DT: order.DELIVERY_DT,
            G_WIDTH: order.G_WIDTH,
            G_LENGTH: order.G_LENGTH,
            PROD_MAIN_MATERIAL: order.PROD_MAIN_MATERIAL,           
          });

          currentDate = currentDate.add(order.LEADTIME, 'minutes');
        }
      }
    }
  }

  return plans;
}




  const handleCreatePlan = () => {
    const startDate = new Date(Math.min(...plans.map(plan => new Date(plan.productionPlanDate).getTime())) - 7 * 60 * 60 * 1000);
    const endDate = new Date(Math.max(...plans.map(plan => addMinutes(new Date(plan.productionPlanDate), plan.productionPlanTime).
      getTime())) - 7 * 60 * 60 * 1000);
    const tempFRPlan = createProductionPlan(FRleadtimeData, eq_status.filter(item => item.EQ_SERIES === 'FR'))
    const tempSRPlan = createProductionPlan(SRleadtimeData, eq_status.filter(item => item.EQ_SERIES === 'SR'))
    const tempDCPlan = createProductionPlan(DCleadtimeData, eq_status.filter(item => item.EQ_SERIES === 'DC'))
    const tempEDPlan = createProductionPlan(EDleadtimeData, eq_status.filter(item => item.EQ_SERIES === 'ED'))
    setStartDate(startDate)
    setEndDate(endDate)
    setFRPlans(tempFRPlan)
    setSRPlans(tempSRPlan)
    setDCPlans(tempDCPlan)
    setEDPlans(tempEDPlan)
  }
  useEffect(() => {
    handleLoadEQ_STATUS();
    handleLoadLeadtimeData();
  }, []);
  return (
      <div className="timeline-container" style={{ width: '100%', backgroundColor: '#ca9f9f333', overflow: 'scroll', padding: '10px' }}>
        <div className="headercontrol" style={{ display: 'flex',  gap: '10px', backgroundImage: theme.CMS.backgroundImage}}>
          <div className='slider' style={{ display: 'flex', width: 'fit-content', gap: '10px', alignItems: 'center', justifyContent: 'center' }}>
            <label htmlFor="widthSlider" style={{fontSize: '12px'}}>Zoom: </label>
            <input
              id="widthSlider"
              type="range"
              min="1"
              max="500"
              value={width}
              onChange={handleWidthChange}
            />
            <span style={{fontSize: '12px'}}>{width}X</span>
          </div>
          <div style={{ display: 'flex', width: 'fit-content', gap: '10px', alignItems: 'center', justifyContent: 'center' }}>            
            <IconButton onClick={() => { handleCreatePlan() }}><MdCreate size={15}/><span style={{fontSize: '12px'}}>Create Plan</span></IconButton>       
            <input type="checkbox" id="morningShift" checked={overtimeday} onChange={(e) => setOvertimeDay(e.target.checked)} />
            <label htmlFor="morningShift">Tăng ca sáng</label>         
            <input type="checkbox" id="nightShift" checked={overtimenight} onChange={(e) => setOvertimeNight(e.target.checked)} />
            <label htmlFor="nightShift">Tăng ca tối</label>
            <input type="checkbox" id="showFR" checked={showFR} onChange={(e) => setShowFR(e.target.checked)} />
            <label htmlFor="showFR">FR</label>
            <input type="checkbox" id="showSR" checked={showSR} onChange={(e) => setShowSR(e.target.checked)} />
            <label htmlFor="showSR">SR</label>
            <input type="checkbox" id="showDC" checked={showDC} onChange={(e) => setShowDC(e.target.checked)} />
            <label htmlFor="showDC">DC</label>
            <input type="checkbox" id="showED" checked={showED} onChange={(e) => setShowED(e.target.checked)} />
            <label htmlFor="showED">ED</label>
          </div>
        </div>
       {/*  <DateMarkers startDate={startDate} endDate={endDate} width={width} /> */}
        {showFR && <div style={{ border: '1px solid black', padding: '10px', marginBottom: '10px', width: '98%', overflow: 'scroll' }}>
          {
            eq_status.filter(item => item.EQ_SERIES === 'FR').map(equipment => (
              <MachineTimeLine plans={FRplans.filter(plan => plan.EQ_NAME === equipment.EQ_NAME)} width={width} />
            ))
          }
        </div>}
        {showSR && <div style={{ border: '1px solid black', padding: '10px', marginBottom: '10px', width: '98%', overflow: 'scroll' }}>
          {
            eq_status.filter(item => item.EQ_SERIES === 'SR').map(equipment => (
              <MachineTimeLine plans={SRplans.filter(plan => plan.EQ_NAME === equipment.EQ_NAME)} width={width} />
            ))
          }
        </div>}
        {showDC && <div style={{ border: '1px solid black', padding: '10px', marginBottom: '10px', width: '98%', overflow: 'scroll' }}>
          {
            eq_status.filter(item => item.EQ_SERIES === 'DC').map(equipment => (
              <MachineTimeLine plans={DCplans.filter(plan => plan.EQ_NAME === equipment.EQ_NAME)} width={width} />
            ))
          }
        </div>}
        {showED && <div style={{ border: '1px solid black', padding: '10px', marginBottom: '10px', width: '98%', overflow: 'scroll' }}>
          {
            eq_status.filter(item => item.EQ_SERIES === 'ED').map(equipment => (
              <MachineTimeLine plans={EDplans.filter(plan => plan.EQ_NAME === equipment.EQ_NAME)} width={width} />
            ))
          }
        </div>}
      </div>
  )
}
export default KHCT
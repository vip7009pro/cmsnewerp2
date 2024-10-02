import React, { useEffect, useState } from 'react'
import './KHCT.scss'
import { parseISO, format, addMinutes, compareAsc, setHours, setMinutes, addDays } from 'date-fns';
import { f_handle_loadEQ_STATUS, f_loadLeadtimeData, SaveExcel } from '../../../../api/GlobalFunction';
import moment from 'moment';
import MachineTimeLine from './MachineTimeLine';
import DateMarkers from './DateMarkers';
import { EQ_STT, LEADTIME_DATA, ProductionPlan } from '../../../../api/GlobalInterface';
import Swal from 'sweetalert2';
import { Button, FormControl, FormControlLabel, FormLabel, IconButton, Radio, RadioGroup, TextField } from '@mui/material';
import { MdCreate } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { MinPriorityQueue } from '@datastructures-js/priority-queue';
import CustomDialog from '../../../../components/Dialog/CustomDialog';
import AddPlanDialog from '../QUICKPLAN/AddPlanDialog';
import { BiSave } from 'react-icons/bi';

const KHCT = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [plans, setPlans] = useState<ProductionPlan[]>([])
  const [FRplans, setFRPlans] = useState<ProductionPlan[]>([])
  const [SRplans, setSRPlans] = useState<ProductionPlan[]>([])
  const [DCplans, setDCPlans] = useState<ProductionPlan[]>([])
  const [EDplans, setEDPlans] = useState<ProductionPlan[]>([])

  const [FRplans_Manual, setFRPlans_Manual] = useState<ProductionPlan[]>([//create one example plan
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'FR01',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'FR02',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'FR03',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'FR04',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'FR05',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'FR06',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'FR07',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    

  ]);
  const [SRplans_Manual, setSRPlans_Manual] = useState<ProductionPlan[]>([  
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'SR01',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'SR02',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'SR03',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'SR04',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'SR05',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'SR06',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'SR07',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'SR08',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    }
  ]);   
  const [DCplans_Manual, setDCPlans_Manual] = useState<ProductionPlan[]>([
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'DC01',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'DC02',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'DC03',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'DC04',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'DC05',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'DC06',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'DC07',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    }
  ]);
  const [EDplans_Manual, setEDPlans_Manual] = useState<ProductionPlan[]>([
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'ED01',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'ED02',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'ED03',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'ED04',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'ED05',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'ED06',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'ED07',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'ED08',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'ED09',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'ED10',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'ED11',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'ED12',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'ED13',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'ED14',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'ED15',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'ED16',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'ED17',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'ED18',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'ED19',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'ED20',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'ED21',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'ED22',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'ED23',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'ED24',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'ED25',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'ED26',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'ED27',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'ED28',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'ED29',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'ED30',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'ED31',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'ED32',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'ED33',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'ED34',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'ED35',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'ED36',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'ED37',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'ED38',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    },
    {
      PROD_REQUEST_NO: '-',
      G_NAME: '-',
      G_NAME_KD: '-',
      G_CODE: '-',
      EQ_NAME: 'ED39',
      productionPlanDate: '-',
      productionPlanQty: 0,
      productionPlanTime: 70,
      PROD_MAIN_MATERIAL: '-',
      G_WIDTH: 0,
      G_LENGTH: 0,
      DELIVERY_DT: '-',
      PROD_REQUEST_DATE: '-',
      NEEDED_M: 0,
      M_STOCK_QTY: 0
    }
    ]);

  const [startDate, setStartDate] = useState<Date>(new Date())
  const [endDate, setEndDate] = useState<Date>(new Date())

  const [eq_series, setEqSeries] = useState<string[]>([])
  const [eq_status, setEqStatus] = useState<EQ_STT[]>([])
  const [overtimeday, setOvertimeDay] = useState<boolean>(false)
  const [overtimenight, setOvertimeNight] = useState<boolean>(false)
  const [showFR, setShowFR] = useState<boolean>(true)
  const [showSR, setShowSR] = useState<boolean>(true)
  const [showDC, setShowDC] = useState<boolean>(true)
  const [showED, setShowED] = useState<boolean>(true)
  const [createPlanMethod, setCreatePlanMethod] = useState<string>('method8')
  const [PROD_REQUEST_NO  , setPROD_REQUEST_NO] = useState<string>('')
  const [G_CODE, setG_CODE] = useState<string>('')  
  const [EQ_NAME, setEQ_NAME] = useState<string>('')
  const [searchProduct, setSearchProduct] = useState<string>('')
  const handleOpenDialog = () => {
    setOpenDialog(true)
  }
  const handleCloseDialog = () => {
    setOpenDialog(false)
  }
  const handleLoadEQ_STATUS = async () => {
    const data = await f_handle_loadEQ_STATUS()
    setEqSeries(data.EQ_SERIES)
    setEqStatus(data.EQ_STATUS.filter(item => item.FACTORY === 'NM1' && item.EQ_ACTIVE==='OK'))
    return {
      FReq_status: data.EQ_STATUS.filter(item => item.FACTORY === 'NM1' && item.EQ_ACTIVE==='OK' && item.EQ_NAME?.includes('FR')),
      SReq_status: data.EQ_STATUS.filter(item => item.FACTORY === 'NM1' && item.EQ_ACTIVE==='OK' && item.EQ_NAME?.includes('SR')),
      DCeq_status: data.EQ_STATUS.filter(item => item.FACTORY === 'NM1' && item.EQ_ACTIVE==='OK' && item.EQ_NAME?.includes('DC')),
      EDeq_status: data.EQ_STATUS.filter(item => item.FACTORY === 'NM1' && item.EQ_ACTIVE==='OK' && item.EQ_NAME?.includes('ED'))
    }
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
    const {FReq_status, SReq_status, DCeq_status, EDeq_status} = await handleLoadEQ_STATUS()
    const FRdata = data.filter(item => item.MACHINE === 'FR' && item.LEADTIME>0)
    const SRdata = data.filter(item => item.MACHINE === 'SR' && item.LEADTIME>0)
    const DCdata = data.filter(item => item.MACHINE === 'DC' && item.LEADTIME>0)
    const EDdata = data.filter(item => item.MACHINE === 'ED' && item.LEADTIME>0)  
    let plans = await handleCreatePlan(FRdata, SRdata, DCdata, EDdata, FReq_status, SReq_status, DCeq_status, EDeq_status);    
    setFRPlans(plans.FRplans)
    setSRPlans(plans.SRplans)
    setDCPlans(plans.DCplans)
    setEDPlans(plans.EDplans)
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
              DELIVERY_DT: '',
              PROD_REQUEST_DATE: '',
              NEEDED_M: 0,
              M_STOCK_QTY: 0
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
              DELIVERY_DT: '',
              PROD_REQUEST_DATE: '',
              NEEDED_M: 0,
              M_STOCK_QTY: 0
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
          DELIVERY_DT: order.DELIVERY_DT,
          PROD_REQUEST_DATE: order.PROD_REQUEST_DATE,
          NEEDED_M: order.NEEDED_M,
          M_STOCK_QTY: order.M_STOCK_QTY
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
            DELIVERY_DT: '',
            PROD_REQUEST_DATE: '',
            NEEDED_M: 0,
            M_STOCK_QTY: 0
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
            DELIVERY_DT: '',
            PROD_REQUEST_DATE: '',
            NEEDED_M: 0,
            M_STOCK_QTY: 0
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
                  DELIVERY_DT: order.DELIVERY_DT,
                  PROD_REQUEST_DATE: order.PROD_REQUEST_DATE,
                  NEEDED_M: order.NEEDED_M,
                  M_STOCK_QTY: order.M_STOCK_QTY
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
  const [width, setWidth] = useState(120);
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

  // Hàm lấy thời gian bắt đầu làm việc tiếp theo
  function getNextWorkingTime(date: moment.Moment): moment.Moment {
    const hour = date.hour();
    if (hour >= DAY_SHIFT_START_HOUR && hour < DAY_SHIFT_END_HOUR) {
      return date;
    } else if (hour >= NIGHT_SHIFT_START_HOUR || hour < NIGHT_SHIFT_END_HOUR) {
      return date;
    } else if (hour >= DAY_SHIFT_END_HOUR && hour < NIGHT_SHIFT_START_HOUR) {
      return date.clone().hour(NIGHT_SHIFT_START_HOUR).minute(0);
    } else {
      return date.clone().add(1, 'day').hour(DAY_SHIFT_START_HOUR).minute(0);
    }
  }

  function getWorkingEndTime(date: moment.Moment): moment.Moment {
    const hour = date.hour();
    if (hour >= DAY_SHIFT_START_HOUR && hour < DAY_SHIFT_END_HOUR) {
      return date.clone().hour(DAY_SHIFT_END_HOUR).minute(0);
    } else if (hour >= NIGHT_SHIFT_START_HOUR || hour < NIGHT_SHIFT_END_HOUR) {
      return date.clone().hour(NIGHT_SHIFT_END_HOUR).minute(0);
    } else {
      return getNextWorkingTime(date);
    }
  }



// Hàm lấy thời gian kết thúc ca làm việc
function getWorkingTimeEnd(date: moment.Moment): moment.Moment {
  const hour = date.hour();
  if (hour >= DAY_SHIFT_START_HOUR && hour < DAY_SHIFT_END_HOUR) {
      return date.clone().hour(DAY_SHIFT_END_HOUR).minute(0).second(0);
  } else if (hour >= NIGHT_SHIFT_START_HOUR || hour < NIGHT_SHIFT_END_HOUR) {
      return date.clone().add(1, 'day').hour(NIGHT_SHIFT_END_HOUR).minute(0).second(0);
  }
  return date;
}
// Hàm lập kế hoạch sản xuất
function createProductionPlan4(orders: LEADTIME_DATA[], equipments: EQ_STT[]): ProductionPlan[] {
  // Sắp xếp đơn hàng theo ngày giao hàng
  orders.sort((a, b) => moment(a.DELIVERY_DT).diff(moment(b.DELIVERY_DT)));

  // Gom nhóm đơn hàng theo kích thước khuôn
  const groupedByMold = groupBy(orders, order => `${order.G_WIDTH}x${order.G_LENGTH}`);

  const plans: ProductionPlan[] = [];
  const availableMachines = equipments.flatMap(eq => Array(1).fill(eq.EQ_NAME));

  let machineCurrentDateTimes: { [key: string]: moment.Moment } = {};
  availableMachines.forEach(machine => {
      machineCurrentDateTimes[machine] = moment();
  });

  // Duyệt qua từng nhóm kích thước khuôn
  for (const moldGroup of groupedByMold.values()) {
      // Gom nhóm theo vật liệu
      const groupedByMaterial = groupBy(moldGroup, order => order.PROD_MAIN_MATERIAL);

      for (const materialGroup of groupedByMaterial.values()) {
          for (const order of materialGroup) {
              let productionTimeRemaining = order.LEADTIME;

              for (const machine of availableMachines) {
                  if (productionTimeRemaining <= 0) break;

                  let currentDate = machineCurrentDateTimes[machine];

                  // Nếu không trong giờ làm việc, thêm kế hoạch rỗng và điều chỉnh thời gian
                  if (!isWorkingTime(currentDate)) {
                      let nextWorkingStart = getNextWorkingTime(currentDate);
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
                          productionPlanQty: 0,
                          PROD_REQUEST_DATE: '',
                          NEEDED_M: 0,
                          M_STOCK_QTY: 0
                      });
                      currentDate = nextWorkingStart;
                      machineCurrentDateTimes[machine] = currentDate;
                  }

                  let workingTimeEnd = getWorkingTimeEnd(currentDate);
                  let availableTime = workingTimeEnd.diff(currentDate, 'minutes');

                  let productionTimeForThisSlot = Math.min(availableTime, productionTimeRemaining);

                  plans.push({
                      PROD_REQUEST_NO: order.PROD_REQUEST_NO,
                      G_CODE: order.G_CODE,
                      G_NAME: order.G_NAME,
                      G_NAME_KD: order.G_NAME_KD,
                      EQ_NAME: machine,
                      productionPlanDate: currentDate.format('YYYY-MM-DD HH:mm'),
                      productionPlanTime: productionTimeForThisSlot,
                      DELIVERY_DT: order.DELIVERY_DT,
                      G_WIDTH: order.G_WIDTH,
                      G_LENGTH: order.G_LENGTH,
                      PROD_MAIN_MATERIAL: order.PROD_MAIN_MATERIAL,
                      productionPlanQty: order.TCD,
                      PROD_REQUEST_DATE: order.PROD_REQUEST_DATE,
                      NEEDED_M: order.NEEDED_M,
                      M_STOCK_QTY: order.M_STOCK_QTY
                  });

                  currentDate = currentDate.add(productionTimeForThisSlot, 'minutes');
                  productionTimeRemaining -= productionTimeForThisSlot;

                  if (productionTimeRemaining > 0) {
                      machineCurrentDateTimes[machine] = currentDate;
                  }
              }
          }
      }
  }

  return plans.sort((a, b) => a.EQ_NAME.localeCompare(b.EQ_NAME) || moment(a.productionPlanDate).diff(moment(b.productionPlanDate)));
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
              productionPlanQty: 0,
              PROD_REQUEST_DATE: '',
              NEEDED_M: 0,
              M_STOCK_QTY: 0
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
            PROD_REQUEST_DATE: order.PROD_REQUEST_DATE,
            NEEDED_M: order.NEEDED_M,
            M_STOCK_QTY: order.M_STOCK_QTY
          });

          currentDate = currentDate.add(order.LEADTIME, 'minutes');
        }
      }
    }
  }

  return plans;
}
// Hàm lập kế hoạch sản xuất
function createProductionPlan5(orders: LEADTIME_DATA[], equipments: EQ_STT[]): ProductionPlan[] {
  // Sắp xếp đơn hàng theo ngày giao hàng
  orders.sort((a, b) => moment(a.DELIVERY_DT).diff(moment(b.DELIVERY_DT)));

  // Gom nhóm đơn hàng theo kích thước khuôn
  const groupedByMold = groupBy(orders, order => `${order.G_WIDTH}x${order.G_LENGTH}`);

  const plans: ProductionPlan[] = [];
  const availableMachines = equipments.flatMap(eq => Array(1).fill(eq.EQ_NAME));

  let machineCurrentDateTimes: { [key: string]: moment.Moment } = {};
  availableMachines.forEach(machine => {
      machineCurrentDateTimes[machine] = moment();
  });

  // Duyệt qua từng nhóm kích thước khuôn
  for (const moldGroup of groupedByMold.values()) {
      // Gom nhóm theo vật liệu
      const groupedByMaterial = groupBy(moldGroup, order => order.PROD_MAIN_MATERIAL);

      for (const materialGroup of groupedByMaterial.values()) {
          for (const order of materialGroup) {
              let productionTimeRemaining = order.LEADTIME;

              for (const machine of availableMachines) {
                  if (productionTimeRemaining <= 0) break;

                  let currentDate = machineCurrentDateTimes[machine];

                  while (productionTimeRemaining > 0) {
                      // Nếu không trong giờ làm việc, thêm kế hoạch rỗng và điều chỉnh thời gian
                      if (!isWorkingTime(currentDate)) {
                          let nextWorkingStart = getNextWorkingTime(currentDate);
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
                              productionPlanQty: 0,
                              PROD_REQUEST_DATE: '',
                              NEEDED_M: 0,
                              M_STOCK_QTY: 0
                          });
                          currentDate = nextWorkingStart;
                      }

                      let workingTimeEnd = getWorkingTimeEnd(currentDate);
                      let availableTime = workingTimeEnd.diff(currentDate, 'minutes');

                      let productionTimeForThisSlot = Math.min(availableTime, productionTimeRemaining);

                      plans.push({
                          PROD_REQUEST_NO: order.PROD_REQUEST_NO,
                          G_CODE: order.G_CODE,
                          G_NAME: order.G_NAME,
                          G_NAME_KD: order.G_NAME_KD,
                          EQ_NAME: machine,
                          productionPlanDate: currentDate.format('YYYY-MM-DD HH:mm'),
                          productionPlanTime: productionTimeForThisSlot,
                          DELIVERY_DT: order.DELIVERY_DT,
                          G_WIDTH: order.G_WIDTH,
                          G_LENGTH: order.G_LENGTH,
                          PROD_MAIN_MATERIAL: order.PROD_MAIN_MATERIAL,
                          productionPlanQty: order.TCD,
                          PROD_REQUEST_DATE: order.PROD_REQUEST_DATE,
                          NEEDED_M: order.NEEDED_M,
                          M_STOCK_QTY: order.M_STOCK_QTY
                      });

                      currentDate = currentDate.add(productionTimeForThisSlot, 'minutes');
                      productionTimeRemaining -= productionTimeForThisSlot;

                      if (productionTimeRemaining > 0) {
                          currentDate = getNextWorkingTime(currentDate);
                      }

                      machineCurrentDateTimes[machine] = currentDate;
                  }
              }
          }
      }
  }

  return plans.sort((a, b) => a.EQ_NAME.localeCompare(b.EQ_NAME) || moment(a.productionPlanDate).diff(moment(b.productionPlanDate)));
}
// Tạo kế hoạch sản xuất sử dụng lý thuyết đồ thị
function createProductionPlan6(orders: LEADTIME_DATA[], equipments: EQ_STT[]): ProductionPlan[] {
  // Sắp xếp đơn hàng theo ngày giao hàng
  orders.sort((a, b) => moment(a.DELIVERY_DT).diff(moment(b.DELIVERY_DT)));

  // Gom nhóm đơn hàng theo kích thước khuôn
  const groupedByMold = groupBy(orders, order => `${order.G_WIDTH}x${order.G_LENGTH}`);
  const plans: ProductionPlan[] = [];
  const availableMachines = equipments.flatMap(eq => Array(1).fill(eq.EQ_NAME));

  const machineQueue = new MinPriorityQueue<{ eqName: string, availableTime: moment.Moment }>();
  availableMachines.forEach(machine => machineQueue.enqueue({ eqName: machine, availableTime: moment() }));

  for (const moldGroup of groupedByMold.values()) {
    const groupedByMaterial = groupBy(moldGroup, order => order.PROD_MAIN_MATERIAL);

    for (const materialGroup of groupedByMaterial.values()) {
      for (const order of materialGroup) {
        const { eqName, availableTime } = machineQueue.dequeue();

        // Điều chỉnh thời gian nếu không trong giờ làm việc
        let currentDate = availableTime;
        if (!isWorkingTime(currentDate)) {
          if (currentDate.hour() >= DAY_SHIFT_END_HOUR && currentDate.hour() < NIGHT_SHIFT_START_HOUR) {
            currentDate = currentDate.clone().hour(NIGHT_SHIFT_START_HOUR).minute(0);
          } else {
            currentDate = currentDate.add(1, 'day').hour(DAY_SHIFT_START_HOUR).minute(0);
          }
        }

        // Thêm kế hoạch sản xuất
        plans.push({
          PROD_REQUEST_NO: order.PROD_REQUEST_NO,
          G_CODE: order.G_CODE,
          G_NAME: order.G_NAME,
          G_NAME_KD: order.G_NAME_KD,
          EQ_NAME: eqName,
          productionPlanDate: currentDate.format('YYYY-MM-DD HH:mm'),
          productionPlanTime: order.LEADTIME,
          DELIVERY_DT: order.DELIVERY_DT,
          G_WIDTH: order.G_WIDTH,
          G_LENGTH: order.G_LENGTH,
          PROD_MAIN_MATERIAL: order.PROD_MAIN_MATERIAL,
          productionPlanQty: order.TCD,
          PROD_REQUEST_DATE: order.PROD_REQUEST_DATE,
          NEEDED_M: order.NEEDED_M,
          M_STOCK_QTY: order.M_STOCK_QTY
        });

        // Cập nhật thời gian khả dụng của máy
        currentDate = currentDate.add(order.LEADTIME, 'minutes');
        machineQueue.enqueue({ eqName, availableTime: currentDate });
      }
    }
  }

  return plans;
}
function createProductionPlan7(orders: LEADTIME_DATA[], equipments: EQ_STT[]): ProductionPlan[] {
  // Sắp xếp đơn hàng theo ngày giao hàng
  orders.sort((a, b) => moment(a.DELIVERY_DT).diff(moment(b.DELIVERY_DT)));

  // Gom nhóm đơn hàng theo kích thước khuôn
  const groupedByMold = groupBy(orders, order => `${order.G_WIDTH}x${order.G_LENGTH}`);
  const plans: ProductionPlan[] = [];
  const machineAvailability = new Map<string, moment.Moment>();

  equipments.forEach(eq => machineAvailability.set(eq.EQ_NAME??'', moment()));

  for (const moldGroup of groupedByMold.values()) {
    const groupedByMaterial = groupBy(moldGroup, order => order.PROD_MAIN_MATERIAL);

    for (const materialGroup of groupedByMaterial.values()) {
      for (const order of materialGroup) {
        let earliestMachine = null;
        let earliestTime = moment();

        for (const [machine, availableTime] of machineAvailability) {
          const adjustedTime = getNextWorkingTime(availableTime.clone());
          if (earliestMachine === null || adjustedTime.isBefore(earliestTime)) {
            earliestMachine = machine;
            earliestTime = adjustedTime;
          }
        }

        if (earliestMachine) {
          plans.push({
            G_CODE: order.G_CODE,
            EQ_NAME: earliestMachine,
            productionPlanDate: earliestTime.format('YYYY-MM-DD HH:mm'),
            productionPlanTime: order.LEADTIME,
            DELIVERY_DT: order.DELIVERY_DT,
            G_WIDTH: order.G_WIDTH,
            G_LENGTH: order.G_LENGTH,
            PROD_MAIN_MATERIAL: order.PROD_MAIN_MATERIAL,
            productionPlanQty: order.TCD,
            PROD_REQUEST_NO: order.PROD_REQUEST_NO,
            G_NAME: order.G_NAME,
            G_NAME_KD: order.G_NAME_KD, 
            PROD_REQUEST_DATE: order.PROD_REQUEST_DATE,
            NEEDED_M: order.NEEDED_M,
            M_STOCK_QTY: order.M_STOCK_QTY
          });

          const nextAvailableTime = earliestTime.clone().add(order.LEADTIME, 'minutes');
          machineAvailability.set(earliestMachine, nextAvailableTime);
        }
      }
    }
  }

  return plans;
}
function createProductionPlan8(orders: LEADTIME_DATA[], equipments: EQ_STT[]): ProductionPlan[] {
  // Sắp xếp đơn hàng theo ngày giao hàng
  orders.sort((a, b) => moment(a.DELIVERY_DT).diff(moment(b.DELIVERY_DT)));

  // Gom nhóm đơn hàng theo mã sản phẩm
  const groupedByProductCode = groupBy(orders, order => order.G_CODE);

  const plans: ProductionPlan[] = [];
  const machineAvailability = new Map<string, moment.Moment>();

  equipments.forEach(eq => machineAvailability.set(eq.EQ_NAME ?? '', moment()));

  for (const productGroup of groupedByProductCode.values()) {
    // Gom nhóm theo kích thước khuôn
    const groupedByMold = groupBy(productGroup, order => `${order.G_WIDTH}x${order.G_LENGTH}`);
    
    for (const moldGroup of groupedByMold.values()) {
      // Gom nhóm theo vật liệu
      const groupedByMaterial = groupBy(moldGroup, order => order.PROD_MAIN_MATERIAL);

      for (const materialGroup of groupedByMaterial.values()) {
        for (const order of materialGroup) {
          let earliestMachine = null;
          let earliestTime = moment();

          for (const [machine, availableTime] of machineAvailability) {
            const adjustedTime = getNextWorkingTime(availableTime.clone());
            if (earliestMachine === null || adjustedTime.isBefore(earliestTime)) {
              earliestMachine = machine;
              earliestTime = adjustedTime;
            }
          }

          if (earliestMachine) {
            plans.push({
              G_CODE: order.G_CODE,
              EQ_NAME: earliestMachine,
              productionPlanDate: earliestTime.format('YYYY-MM-DD HH:mm'),
              productionPlanTime: order.LEADTIME,
              DELIVERY_DT: order.DELIVERY_DT,
              G_WIDTH: order.G_WIDTH,
              G_LENGTH: order.G_LENGTH,
              PROD_MAIN_MATERIAL: order.PROD_MAIN_MATERIAL,
              productionPlanQty: order.TCD,
              PROD_REQUEST_NO: order.PROD_REQUEST_NO,
              G_NAME: order.G_NAME,
              G_NAME_KD: order.G_NAME_KD,
              PROD_REQUEST_DATE: order.PROD_REQUEST_DATE,
              NEEDED_M: order.NEEDED_M,
              M_STOCK_QTY: order.M_STOCK_QTY
            });

            const nextAvailableTime = earliestTime.clone().add(order.LEADTIME, 'minutes');
            machineAvailability.set(earliestMachine, nextAvailableTime);
          }
        }
      }
    }
  }

  return plans;
}
function createProductionPlan9(orders: LEADTIME_DATA[], equipments: EQ_STT[]): ProductionPlan[] {
  // Sắp xếp đơn hàng theo ngày giao hàng
  orders.sort((a, b) => moment(a.DELIVERY_DT).diff(moment(b.DELIVERY_DT)));

  // Gom nhóm đơn hàng theo mã sản phẩm
  const groupedByProductCode = groupBy(orders, order => order.G_CODE);

  const plans: ProductionPlan[] = [];
  const machineAvailability = new Map<string, moment.Moment>();

  equipments.forEach(eq => machineAvailability.set(eq.EQ_NAME??"", moment()));

  for (const productGroup of groupedByProductCode.values()) {
    // Gom nhóm theo kích thước khuôn
    const groupedByMold = groupBy(productGroup, order => `${order.G_WIDTH}x${order.G_LENGTH}`);
    
    for (const moldGroup of groupedByMold.values()) {
      // Gom nhóm theo vật liệu
      const groupedByMaterial = groupBy(moldGroup, order => order.PROD_MAIN_MATERIAL);

      for (const materialGroup of groupedByMaterial.values()) {
        for (const order of materialGroup) {
          let remainingTime = order.LEADTIME;

          while (remainingTime > 0) {
            let earliestMachine = null;
            let earliestTime = moment();

            for (const [machine, availableTime] of machineAvailability) {
              const adjustedTime = getNextWorkingTime(availableTime.clone());
              if (earliestMachine === null || adjustedTime.isBefore(earliestTime)) {
                earliestMachine = machine;
                earliestTime = adjustedTime;
              }
            }

            if (earliestMachine) {
              const workEndTime = getWorkingEndTime(earliestTime);
              const availableMinutes = workEndTime.diff(earliestTime, 'minutes');
              const productionMinutes = Math.min(remainingTime, availableMinutes);

              plans.push({
                G_CODE: order.G_CODE,
                EQ_NAME: earliestMachine,
                productionPlanDate: earliestTime.format('YYYY-MM-DD HH:mm'),
                productionPlanTime: productionMinutes,
                DELIVERY_DT: order.DELIVERY_DT,
                G_WIDTH: order.G_WIDTH,
                G_LENGTH: order.G_LENGTH,
                PROD_MAIN_MATERIAL: order.PROD_MAIN_MATERIAL,
                productionPlanQty: order.TCD,
                PROD_REQUEST_NO: order.PROD_REQUEST_NO,
                G_NAME: order.G_NAME,
                G_NAME_KD: order.G_NAME_KD,
                PROD_REQUEST_DATE: order.PROD_REQUEST_DATE,
                NEEDED_M: order.NEEDED_M,
                M_STOCK_QTY: order.M_STOCK_QTY
              });

              remainingTime -= productionMinutes;
              machineAvailability.set(earliestMachine, earliestTime.clone().add(productionMinutes, 'minutes'));
            }
          }
        }
      }
    }
  }

  return plans;
}

const handleCreatePlan = async (FRleadtimeData: LEADTIME_DATA[], SRleadtimeData: LEADTIME_DATA[], DCleadtimeData: LEADTIME_DATA[], EDleadtimeData: LEADTIME_DATA[], eq_statusFR: EQ_STT[], eq_statusSR: EQ_STT[], eq_statusDC: EQ_STT[], eq_statusED: EQ_STT[]) => {
  const startDate = new Date(Math.min(...plans.map(plan => new Date(plan.productionPlanDate).getTime())) - 7 * 60 * 60 * 1000);
  const endDate = new Date(Math.max(...plans.map(plan => addMinutes(new Date(plan.productionPlanDate), plan.productionPlanTime).
    getTime())) - 7 * 60 * 60 * 1000);
    let tempFRPlan: ProductionPlan[] = []
    let tempSRPlan: ProductionPlan[] = []
    let tempDCPlan: ProductionPlan[] = []
    let tempEDPlan: ProductionPlan[] = []
    switch (createPlanMethod) {
      case 'method1':
        tempFRPlan = createProductionPlan(FRleadtimeData, eq_statusFR)
        tempSRPlan = createProductionPlan(SRleadtimeData, eq_statusSR)
        tempDCPlan = createProductionPlan(DCleadtimeData, eq_statusDC)
        tempEDPlan = createProductionPlan(EDleadtimeData, eq_statusED)
        break;
      case 'method2':
        tempFRPlan = createProductionPlan2(FRleadtimeData, eq_statusFR)
        tempSRPlan = createProductionPlan2(SRleadtimeData, eq_statusSR)
        tempDCPlan = createProductionPlan2(DCleadtimeData, eq_statusDC)
        tempEDPlan = createProductionPlan2(EDleadtimeData, eq_statusED)
        break;
      case 'method3':
        tempFRPlan = createProductionPlan3(FRleadtimeData, eq_statusFR)
        tempSRPlan = createProductionPlan3(SRleadtimeData, eq_statusSR)
        tempDCPlan = createProductionPlan3(DCleadtimeData, eq_statusDC)
        tempEDPlan = createProductionPlan3(EDleadtimeData, eq_statusED)
        break;
      case 'method4':
        tempFRPlan = createProductionPlan4(FRleadtimeData, eq_statusFR)
        tempSRPlan = createProductionPlan4(SRleadtimeData, eq_statusSR)
        tempDCPlan = createProductionPlan4(DCleadtimeData, eq_statusDC)
        tempEDPlan = createProductionPlan4(EDleadtimeData, eq_statusED)
        break;  
      case 'method5':
        tempFRPlan = createProductionPlan5(FRleadtimeData, eq_statusFR)
        tempSRPlan = createProductionPlan5(SRleadtimeData, eq_statusSR)
        tempDCPlan = createProductionPlan5(DCleadtimeData, eq_statusDC)
        tempEDPlan = createProductionPlan5(EDleadtimeData, eq_statusED)
        break;  
      case 'method6':
        tempFRPlan = createProductionPlan6(FRleadtimeData, eq_statusFR)
        tempSRPlan = createProductionPlan6(SRleadtimeData, eq_statusSR)
        tempDCPlan = createProductionPlan6(DCleadtimeData, eq_statusDC)
        tempEDPlan = createProductionPlan6(EDleadtimeData, eq_statusED)
        break;  
      case 'method7':
        tempFRPlan = createProductionPlan7(FRleadtimeData, eq_statusFR)
        tempSRPlan = createProductionPlan7(SRleadtimeData, eq_statusSR)
        tempDCPlan = createProductionPlan7(DCleadtimeData, eq_statusDC)
        tempEDPlan = createProductionPlan7(EDleadtimeData, eq_statusED)
        break;    
      case 'method8':
        tempFRPlan = createProductionPlan8(FRleadtimeData, eq_statusFR)
        tempSRPlan = createProductionPlan8(SRleadtimeData, eq_statusSR)
        tempDCPlan = createProductionPlan8(DCleadtimeData, eq_statusDC)
        tempEDPlan = createProductionPlan8(EDleadtimeData, eq_statusED)
        break;      
      case 'method9':
        tempFRPlan = createProductionPlan9(FRleadtimeData, eq_statusFR)
        tempSRPlan = createProductionPlan9(SRleadtimeData, eq_statusSR)
        tempDCPlan = createProductionPlan9(DCleadtimeData, eq_statusDC)
        tempEDPlan = createProductionPlan9(EDleadtimeData, eq_statusED)
        break;        
    }    
  setStartDate(startDate)
  setEndDate(endDate)    
  setFRPlans(tempFRPlan)
  setSRPlans(tempSRPlan)
  setDCPlans(tempDCPlan)
  setEDPlans(tempEDPlan)
  return {
    FRplans: tempFRPlan,
    SRplans: tempSRPlan,
    DCplans: tempDCPlan,
    EDplans: tempEDPlan
  }
}

  useEffect(() => {
    //handleLoadEQ_STATUS();
    handleLoadLeadtimeData();
  }, []);
  return (
    <div style={{display: 'flex', flexDirection: 'row', gap: '10px', height: '88vh'}}>
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
            {/* <select
              style={{fontSize: '12px'}}
              value={createPlanMethod}
              onChange={(e) => setCreatePlanMethod(e.target.value)}
            >
              <option value="method1">Method 1</option>
              <option value="method2">Method 2</option>
              <option value="method3">Method 3</option>
              <option value="method4">Method 4</option>
              <option value="method5">Method 5</option>
              <option value="method6">Method 6</option>
              <option value="method7">Method 7</option>
              <option value="method8">Method 8</option>
              <option value="method9">Method 9</option>
            </select> */}
            <IconButton onClick={() => {handleLoadLeadtimeData(); }}><MdCreate size={15}/><span style={{fontSize: '12px'}}>Reload Plan</span></IconButton>       
             
                
         {/*    <input type="checkbox" id="morningShift" checked={overtimeday} onChange={(e) => setOvertimeDay(e.target.checked)} />
            <label htmlFor="morningShift">Tăng ca sáng</label>         
            <input type="checkbox" id="nightShift" checked={overtimenight} onChange={(e) => setOvertimeNight(e.target.checked)} />
            <label htmlFor="nightShift">Tăng ca tối</label> */}
            <input type="text" placeholder="Search Product"  value={searchProduct} onChange={(e) => setSearchProduct(e.target.value)} />
            <input type="checkbox" id="showFR" checked={showFR} onChange={(e) => setShowFR(e.target.checked)} />
            <label htmlFor="showFR">FR</label>
            <input type="checkbox" id="showSR" checked={showSR} onChange={(e) => setShowSR(e.target.checked)} />
            <label htmlFor="showSR">SR</label>
            <input type="checkbox" id="showDC" checked={showDC} onChange={(e) => setShowDC(e.target.checked)} />
            <label htmlFor="showDC">DC</label>
            <input type="checkbox" id="showED" checked={showED} onChange={(e) => setShowED(e.target.checked)} />
            <label htmlFor="showED">ED</label>
            <IconButton onClick={() => {}}><BiSave size={15}/><span style={{fontSize: '12px'}}>Save Plan</span></IconButton>     
          </div>
        </div>
       {/*  <DateMarkers startDate={startDate} endDate={endDate} width={width} /> */}
        {showFR && <div style={{ border: '1px solid black', padding: '10px', marginBottom: '10px', width: '98%', overflow: 'scroll' }}>
          {
            eq_status.filter(item => item.EQ_SERIES === 'FR').map(equipment => (
              <MachineTimeLine key={equipment.EQ_NAME} plans={FRplans.filter(plan => plan.EQ_NAME === equipment.EQ_NAME)} width={width} onDoubleClick={(plan) => {
                console.log(plan)
                setPROD_REQUEST_NO(plan.PROD_REQUEST_NO)
                setG_CODE(plan.G_CODE)  
                setEQ_NAME(plan.EQ_NAME)
                handleOpenDialog()
              }} searchProduct={searchProduct.toUpperCase()}/>
            ))
          }
        </div>}
        {showSR && <div style={{ border: '1px solid black', padding: '10px', marginBottom: '10px', width: '98%', overflow: 'scroll' }}>
          {
            eq_status.filter(item => item.EQ_SERIES === 'SR').map(equipment => (
              <MachineTimeLine key={equipment.EQ_NAME} plans={SRplans.filter(plan => plan.EQ_NAME === equipment.EQ_NAME)} width={width} onDoubleClick={(plan) => {
                console.log(plan)
                setPROD_REQUEST_NO(plan.PROD_REQUEST_NO)
                setG_CODE(plan.G_CODE)  
                setEQ_NAME(plan.EQ_NAME)
                handleOpenDialog()
              }} searchProduct={searchProduct.toUpperCase()}/>
            ))
          }
        </div>}
        {showDC && <div style={{ border: '1px solid black', padding: '10px', marginBottom: '10px', width: '98%', overflow: 'scroll' }}>
          {
            eq_status.filter(item => item.EQ_SERIES === 'DC').map(equipment => (
              <MachineTimeLine key={equipment.EQ_NAME} plans={DCplans.filter(plan => plan.EQ_NAME === equipment.EQ_NAME)} width={width} onDoubleClick={(plan) => {
                console.log(plan)
                setPROD_REQUEST_NO(plan.PROD_REQUEST_NO)
                setG_CODE(plan.G_CODE)  
                setEQ_NAME(plan.EQ_NAME)
                handleOpenDialog()
              }} searchProduct={searchProduct.toUpperCase()}/>
            ))
          }
        </div>}
        {showED && <div style={{ border: '1px solid black', padding: '10px', marginBottom: '10px', width: '98%', overflow: 'scroll' }}>
          {
            eq_status.filter(item => item.EQ_SERIES === 'ED').map(equipment => (
              <MachineTimeLine key={equipment.EQ_NAME} plans={EDplans.filter(plan => plan.EQ_NAME === equipment.EQ_NAME)} width={width} onDoubleClick={(plan) => {
                console.log(plan)
                setPROD_REQUEST_NO(plan.PROD_REQUEST_NO)
                setG_CODE(plan.G_CODE)  
                setEQ_NAME(plan.EQ_NAME)
                handleOpenDialog()
              }} searchProduct={searchProduct.toUpperCase()}/>
            ))
          }
        </div>}
        <CustomDialog
          isOpen={openDialog}
          onClose={handleCloseDialog}
          title="Create Production Order"
          content={<AddPlanDialog PROD_REQUEST_NO={PROD_REQUEST_NO} G_CODE={G_CODE} EQ_NAME={EQ_NAME}/>}
          actions={<></>}  
        />
      </div>
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
            <IconButton onClick={() => {handleLoadLeadtimeData(); }}><MdCreate size={15}/><span style={{fontSize: '12px'}}>Reload Plan</span></IconButton>        
            <input type="text" placeholder="Search Product"  value={searchProduct} onChange={(e) => setSearchProduct(e.target.value)} />
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
        {showFR && <div style={{ border: '1px solid black', padding: '10px', marginBottom: '10px', width: '98%', overflow: 'scroll' }}>
          {
            eq_status.filter(item => item.EQ_SERIES === 'FR').map(equipment => (
              <MachineTimeLine key={equipment.EQ_NAME} plans={FRplans_Manual.filter(plan => plan.EQ_NAME === equipment.EQ_NAME)} width={width} onDoubleClick={(plan) => {  
                if(plan.PROD_REQUEST_NO !== '-'){
                setPROD_REQUEST_NO(plan.PROD_REQUEST_NO)
                setG_CODE(plan.G_CODE)  
                setEQ_NAME(plan.EQ_NAME)
                handleOpenDialog()
                }
              }} 
              searchProduct={searchProduct.toUpperCase()}
              auto={false}
              onClear={(plan) => {
                console.log('plan', plan)
                let temp1 = [...FRplans_Manual];
                if(plan.PROD_REQUEST_NO !== '-'){  
                  let indexofoldplan = temp1.findIndex(p => p.PROD_REQUEST_NO == plan.PROD_REQUEST_NO && p.EQ_NAME === plan.EQ_NAME)  
                  if (indexofoldplan !== -1) {
                  temp1.splice(indexofoldplan, 1)
                }        
                setFRPlans_Manual(temp1)
                }
              }}
              onDrop={(planfrom, oldplan, destplan) => { 
                //if planfrom exist  
                if(planfrom.PROD_REQUEST_NO !== '-'){ 
                let temp1 = [...FRplans_Manual]
                let indexofoldplan = temp1.findIndex(p => p.PROD_REQUEST_NO == oldplan.PROD_REQUEST_NO && p.EQ_NAME === oldplan.EQ_NAME)  
                if (indexofoldplan !== -1) {
                  temp1.splice(indexofoldplan, 1)
                }        
                //search for destplan in FRplans and insert planfrom after destplan
                let indexofdestplan = temp1.findIndex(p => p.PROD_REQUEST_NO == destplan.PROD_REQUEST_NO && p.EQ_NAME === destplan.EQ_NAME)  
                if (indexofdestplan !== -1) {
                  temp1.splice(indexofdestplan + 1, 0, planfrom)
                }         
                setFRPlans_Manual(temp1)
                }
              }}
              onDragEnd={(plan) => {
                console.log('plan', plan)
              }}
              />
            ))
          }
        </div>}
        {showSR && <div style={{ border: '1px solid black', padding: '10px', marginBottom: '10px', width: '98%', overflow: 'scroll' }}>
          {
            eq_status.filter(item => item.EQ_SERIES === 'SR').map(equipment => (
              <MachineTimeLine key={equipment.EQ_NAME} plans={SRplans_Manual.filter(plan => plan.EQ_NAME === equipment.EQ_NAME)} width={width} onDoubleClick={(plan) => {
                console.log(plan)
                setPROD_REQUEST_NO(plan.PROD_REQUEST_NO)
                setG_CODE(plan.G_CODE)  
                setEQ_NAME(plan.EQ_NAME)
                handleOpenDialog()
              }} searchProduct={searchProduct.toUpperCase()}
              auto={false}
              onClear={(plan) => {
                console.log('plan', plan)
                let temp1 = [...SRplans_Manual];
                if(plan.PROD_REQUEST_NO !== '-'){  
                  let indexofoldplan = temp1.findIndex(p => p.PROD_REQUEST_NO == plan.PROD_REQUEST_NO && p.EQ_NAME === plan.EQ_NAME)  
                  if (indexofoldplan !== -1) {
                  temp1.splice(indexofoldplan, 1)
                }        
                setSRPlans_Manual(temp1)
                }
              }}
              onDrop={(planfrom, oldplan, destplan) => { 
                //if planfrom exist  
                if(planfrom.PROD_REQUEST_NO !== '-'){ 
                let temp1 = [...SRplans_Manual]
                let indexofoldplan = temp1.findIndex(p => p.PROD_REQUEST_NO == oldplan.PROD_REQUEST_NO && p.EQ_NAME === oldplan.EQ_NAME)  
                if (indexofoldplan !== -1) {
                  temp1.splice(indexofoldplan, 1)
                }        
                //search for destplan in FRplans and insert planfrom after destplan
                let indexofdestplan = temp1.findIndex(p => p.PROD_REQUEST_NO == destplan.PROD_REQUEST_NO && p.EQ_NAME === destplan.EQ_NAME)  
                if (indexofdestplan !== -1) {
                  temp1.splice(indexofdestplan + 1, 0, planfrom)
                }         
                setSRPlans_Manual(temp1)
                }
              }}
              onDragEnd={(plan) => {
                console.log('plan', plan)
              }}
              />
            ))
          }
        </div>}
        {showDC && <div style={{ border: '1px solid black', padding: '10px', marginBottom: '10px', width: '98%', overflow: 'scroll' }}>
          {
            eq_status.filter(item => item.EQ_SERIES === 'DC').map(equipment => (
              <MachineTimeLine key={equipment.EQ_NAME} plans={DCplans_Manual.filter(plan => plan.EQ_NAME === equipment.EQ_NAME)} width={width} onDoubleClick={(plan) => {
                console.log(plan)
                setPROD_REQUEST_NO(plan.PROD_REQUEST_NO)
                setG_CODE(plan.G_CODE)  
                setEQ_NAME(plan.EQ_NAME)
                handleOpenDialog()
              }} searchProduct={searchProduct.toUpperCase()}
              auto={false}
              onClear={(plan) => {
                console.log('plan', plan)
                let temp1 = [...DCplans_Manual];
                if(plan.PROD_REQUEST_NO !== '-'){  
                  let indexofoldplan = temp1.findIndex(p => p.PROD_REQUEST_NO == plan.PROD_REQUEST_NO && p.EQ_NAME === plan.EQ_NAME)  
                  if (indexofoldplan !== -1) {
                  temp1.splice(indexofoldplan, 1)
                }        
                setDCPlans_Manual(temp1)
                }
              }}
              onDrop={(planfrom, oldplan, destplan) => { 
                //if planfrom exist  
                if(planfrom.PROD_REQUEST_NO !== '-'){ 
                let temp1 = [...DCplans_Manual]
                let indexofoldplan = temp1.findIndex(p => p.PROD_REQUEST_NO == oldplan.PROD_REQUEST_NO && p.EQ_NAME === oldplan.EQ_NAME)  
                if (indexofoldplan !== -1) {
                  temp1.splice(indexofoldplan, 1)
                }        
                //search for destplan in FRplans and insert planfrom after destplan
                let indexofdestplan = temp1.findIndex(p => p.PROD_REQUEST_NO == destplan.PROD_REQUEST_NO && p.EQ_NAME === destplan.EQ_NAME)  
                if (indexofdestplan !== -1) {
                  temp1.splice(indexofdestplan + 1, 0, planfrom)
                }         
                setDCPlans_Manual(temp1)
                }
              }}
              onDragEnd={(plan) => {
                console.log('plan', plan)
              }}
              />
            ))
          }
        </div>}
        {showED && <div style={{ border: '1px solid black', padding: '10px', marginBottom: '10px', width: '98%', overflow: 'scroll' }}>
          {
            eq_status.filter(item => item.EQ_SERIES === 'ED').map(equipment => (
              <MachineTimeLine key={equipment.EQ_NAME} plans={EDplans_Manual.filter(plan => plan.EQ_NAME === equipment.EQ_NAME)} width={width} onDoubleClick={(plan) => {                
                setPROD_REQUEST_NO(plan.PROD_REQUEST_NO)
                setG_CODE(plan.G_CODE)  
                setEQ_NAME(plan.EQ_NAME)
                handleOpenDialog()
              }} searchProduct={searchProduct.toUpperCase()}
              auto={false}
              onClear={(plan) => {
                console.log('plan', plan)
                let temp1 = [...EDplans_Manual];
                if(plan.PROD_REQUEST_NO !== '-'){  
                  let indexofoldplan = temp1.findIndex(p => p.PROD_REQUEST_NO == plan.PROD_REQUEST_NO && p.EQ_NAME === plan.EQ_NAME)  
                  if (indexofoldplan !== -1) {
                  temp1.splice(indexofoldplan, 1)
                }        
                setEDPlans_Manual(temp1)
                }
              }}
              onDrop={(planfrom, oldplan, destplan) => { 
                //if planfrom exist  
                if(planfrom.PROD_REQUEST_NO !== '-'){ 
                let temp1 = [...EDplans_Manual]
                let indexofoldplan = temp1.findIndex(p => p.PROD_REQUEST_NO == oldplan.PROD_REQUEST_NO && p.EQ_NAME === oldplan.EQ_NAME)  
                if (indexofoldplan !== -1) {
                  temp1.splice(indexofoldplan, 1)
                }        
                //search for destplan in FRplans and insert planfrom after destplan
                let indexofdestplan = temp1.findIndex(p => p.PROD_REQUEST_NO == destplan.PROD_REQUEST_NO && p.EQ_NAME === destplan.EQ_NAME)  
                if (indexofdestplan !== -1) {
                  temp1.splice(indexofdestplan + 1, 0, planfrom)
                }         
                setEDPlans_Manual(temp1)
                }
              }}
              onDragEnd={(plan) => {
                console.log('plan', plan)
              }}
              />
            ))
          }
        </div>}
        <CustomDialog
          isOpen={openDialog}
          onClose={handleCloseDialog}
          title="Create Production Order"
          content={<AddPlanDialog PROD_REQUEST_NO={PROD_REQUEST_NO} G_CODE={G_CODE} EQ_NAME={EQ_NAME}/>}
          actions={<></>}  
        />
      </div>
    </div>
      
  )
}
export default KHCT
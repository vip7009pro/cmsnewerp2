import { Button } from "@mui/material";
import React from "react";
import Swal from "sweetalert2";
import "./MACHINE_COMPONENT2.scss";

interface QLSXPLANDATA {
  PLAN_ID: string;
  PLAN_DATE: string;
  PROD_REQUEST_NO: string;
  PLAN_QTY: number;
  PLAN_EQ: string;
  PLAN_FACTORY: string;
  PLAN_LEADTIME: number;
  INS_EMPL: string;
  INS_DATE: string;
  UPD_EMPL: string;
  UPD_DATE: string;
  G_NAME: string;
  G_NAME_KD: string;
  PROD_REQUEST_DATE: string;
  PROD_REQUEST_QTY: number;
  STEP: string
}

interface MachineInterface {
  machine_name?: string;
  factory?: string;
  run_stop?: number;
  machine_data?: QLSXPLANDATA[];
  current_plan_id?: string;
  current_g_name?: string;
  eq_status?: string;  
  onClick?:  (ev: any) => void;
}

const MACHINE_COMPONENT2 = (machine_data: MachineInterface) => {
  const runtopcolor: string = "#2fd5eb";
  const runbotcolor: string = "#8ce9f5";
  const stoptopcolor: string = "white";
  const stopbotcolor: string = "black";
 
  return (
    <div
      className='machine_component2'
      style={{
        backgroundImage: `linear-gradient(to right, ${
          machine_data.run_stop === 1 ? runtopcolor : stoptopcolor
        }, ${machine_data.run_stop === 1 ? runbotcolor : stopbotcolor})`,
        borderBottom:`${machine_data.machine_name?.slice(0,2) ==='FR'? '5px solid black' : machine_data.machine_name?.slice(0,2) ==='SR'?  '5px solid #fa0cf2' : machine_data.machine_name?.slice(0,2) ==='DC'?  '5px solid blue' : '5px solid #faa30c'}`,
        borderRadius: '4px'
      }}
      onDoubleClick={machine_data.onClick}
    >
      <div className='tieude' style={{backgroundColor:`${machine_data.eq_status ==='STOP'? 'red':machine_data.eq_status ==='SETTING'? 'yellow' : `#50f73e` }`}}>
        <div className="eqname"  style={{color:`${machine_data.eq_status ==='STOP'? 'white':machine_data.eq_status ==='SETTING'? 'black' : `black` }`}}>
          {machine_data.machine_name}
          {machine_data.eq_status === 'MASS' &&<img alt='running' src='/blink.gif' width={40} height={20}></img>}
        </div>            
      </div>
      <div className='machineplan'>
        {machine_data.current_g_name}
      </div>
    </div>
  );
};

export default MACHINE_COMPONENT2;

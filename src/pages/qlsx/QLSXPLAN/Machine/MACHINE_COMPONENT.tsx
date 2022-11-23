import { Button } from "@mui/material";
import React from "react";
import Swal from "sweetalert2";
import "./MACHINE_COMPONENT.scss";

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

const MACHINE_COMPONENT = (machine_data: MachineInterface) => {
  const runtopcolor: string = "#2fd5eb";
  const runbotcolor: string = "#8ce9f5";
  const stoptopcolor: string = "white";
  const stopbotcolor: string = "black";
  let filteredDataTable = machine_data.machine_data?.filter((element: QLSXPLANDATA, index: number) => {
    return (element.PLAN_EQ === machine_data.machine_name && element.PLAN_FACTORY === machine_data.factory);
  });
 
  return (
    <div
      className='machine_component'
      style={{
        backgroundImage: `linear-gradient(to right, ${
          machine_data.run_stop === 1 ? runtopcolor : stoptopcolor
        }, ${machine_data.run_stop === 1 ? runbotcolor : stopbotcolor})`,
      }}
      onDoubleClick={machine_data.onClick}
    >
      <div className='tieude' style={{backgroundColor:`${machine_data.eq_status ==='STOP'? 'red':machine_data.eq_status ==='SETTING'? 'yellow' : `#50f73e` }`}}>
        <div className="eqname"  style={{color:`${machine_data.eq_status ==='STOP'? 'white':machine_data.eq_status ==='SETTING'? 'black' : `black` }`}}>
          {machine_data.machine_name}
          {machine_data.eq_status === 'MASS' &&<img alt='running' src='/blink.gif' width={40} height={20}></img>}
        </div>
        <div className="currentcode"  style={{ fontSize:12, color:`${machine_data.eq_status ==='STOP'? 'white':machine_data.eq_status ==='SETTING'? 'black' : `black` }`}}>
        {machine_data.current_g_name}
        </div>      
      </div>
      <div className='machineplan'>
        <ul>
            {
                filteredDataTable?.map((element: QLSXPLANDATA, index: number)=> {
                    return (
                        <li key={index}>{element.G_NAME_KD} | {element.PROD_REQUEST_NO} | B{element.STEP} | {element.PLAN_QTY} </li>
                    )
                })
            }         
        </ul>
      </div>
    </div>
  );
};

export default MACHINE_COMPONENT;

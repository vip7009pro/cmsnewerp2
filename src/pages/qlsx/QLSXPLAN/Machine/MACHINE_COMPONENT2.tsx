import { Button } from "@mui/material";
import moment from "moment";
import React, { useState } from "react";
import Swal from "sweetalert2";
import "./MACHINE_COMPONENT2.scss";
import { MachineInterface2 } from "../../../../api/GlobalInterface";
const MACHINE_COMPONENT2 = (machine_data: MachineInterface2) => {
  //console.log(machine_data)
  const runtopcolor: string = "#2fd5eb";
  const runbotcolor: string = "#8ce9f5";
  const stoptopcolor: string = "white";
  const stopbotcolor: string = "black";
  //console.log(`${machine_data.machine_name}`,moment.utc(machine_data.upd_time).format('YYYY-MM-DD HH:mm:ss'));
  var date1 = moment(moment.utc().format("YYYY-MM-DD HH:mm:ss")).utc();
  var date2 = moment.utc(machine_data.upd_time).format("YYYY-MM-DD HH:mm:ss");
  var diff: number = date1.diff(date2, "minutes");


  const [showhideDetail, setShowHideDetail] = useState(false);
  //console.log("EQ_NAME: " + machine_data.machine_name + ", EQ_STATUS: " + machine_data.current_g_name)
  let checkSearch: boolean = false;
  if (
    machine_data.current_g_name !== undefined &&
    machine_data.search_string !== undefined &&
    machine_data.current_g_name !== null &&
    machine_data.search_string !== null
  ) {
    if (machine_data.search_string === "") {
      checkSearch = true;
    } else if (machine_data.current_g_name === null) {
      checkSearch = true;
    } else {
      checkSearch = machine_data.current_g_name
        .toLowerCase()
        .includes(machine_data.search_string.toLowerCase());
    }
  }
  const backGroundStyle = {
    backgroundColor: `${
      checkSearch
        ? machine_data.eq_status === "STOP"
          ? "gray"
          : machine_data.eq_status === "SETTING"
          ? "#F6E396"
          : `#8FF591`
        : "black"
    }`,
    color: `${
      checkSearch
        ? machine_data.eq_status === "STOP"
          ? "white"
          : machine_data.eq_status === "SETTING"
          ? "black"
          : `black`
        : "black"
    }`,
  };
  const planQtyFontStyle = {
    color: `${
      checkSearch
        ? machine_data.eq_status === "STOP"
          ? "white"
          : machine_data.eq_status === "SETTING"
          ? "#4C8BF1"
          : `#A640FC`
        : "black"
    }`,
  };
  const resultQtyFontStyle = {
    color: `${
      checkSearch
        ? machine_data.eq_status === "STOP"
          ? "white"
          : machine_data.eq_status === "SETTING"
          ? "#4C8BF1"
          : `#F84DE3`
        : "black"
    }`,
  };
  const achivRateFontStyle = {
    color: `${
      checkSearch
        ? machine_data.eq_status === "STOP"
          ? "white"
          : machine_data.eq_status === "SETTING"
          ? "#4C8BF1"
          : `red`
        : "black"
    }`,
  };

  const thisSettingTime =  machine_data.machine_data?.PROCESS_NUMBER === 1 ? machine_data.machine_data.Setting1 : machine_data.machine_data?.PROCESS_NUMBER === 2 ? machine_data.machine_data?.Setting2 : machine_data.machine_data?.PROCESS_NUMBER === 3 ? machine_data.machine_data?.Setting3 : machine_data.machine_data?.Setting4;
  const thisUPH =  machine_data.machine_data?.PROCESS_NUMBER === 1 ? machine_data.machine_data.UPH1 : machine_data.machine_data?.PROCESS_NUMBER === 2 ? machine_data.machine_data?.UPH2 : machine_data.machine_data?.PROCESS_NUMBER === 3 ? machine_data.machine_data?.UPH3 : machine_data.machine_data?.UPH4;
  const thisPLAN_QTY =  machine_data.machine_data?.PLAN_QTY === undefined ? 0 : machine_data.machine_data?.PLAN_QTY;
  const thisRESULT_QTY =  machine_data.machine_data?.SX_RESULT === undefined ? 0 : machine_data.machine_data?.SX_RESULT;
  const thisKQSXTAM =  machine_data.machine_data?.KQ_SX_TAM === undefined ? 0 : machine_data.machine_data?.KQ_SX_TAM;
  const finalRESULT = thisRESULT_QTY !== null? thisRESULT_QTY  : thisKQSXTAM;

  var datesetting1 = (machine_data.machine_data?.MASS_START_TIME !== null && machine_data.machine_data?.MASS_START_TIME !== undefined)? moment(moment.utc(machine_data.machine_data?.MASS_START_TIME).format('YYYY-MM-DD HH:mm:ss')).utc() : moment.utc();
  var datesetting2 = moment.utc(machine_data.machine_data?.SETTING_START_TIME).format("YYYY-MM-DD HH:mm:ss");

 
  var diffsetting: number = datesetting1.diff(datesetting2, "minutes");


  var datemass1 = (machine_data.machine_data?.MASS_END_TIME !== null && machine_data.machine_data?.MASS_END_TIME !== undefined)? moment.utc(moment.utc(machine_data.machine_data?.MASS_END_TIME).format('YYYY-MM-DD HH:mm:ss')) : moment.utc();
  var datemass2 = moment.utc(machine_data.machine_data?.MASS_START_TIME).format("YYYY-MM-DD HH:mm:ss");

  var diffmass: number = datemass1.diff(datemass2, "minutes");
/*   
  if(machine_data.machine_data?.CURR_PLAN_ID ==='3IC0025A')
  {
    console.log('datesetting1',datesetting1)
    console.log('datesetting2',datesetting2)
    console.log('datediffsetting', diffsetting)
    console.log('diffmass', diffmass)
  } */


  return (
    <div
      className='mc2'
      style={{
        WebkitFilter:
          machine_data.current_g_name === null
            ? "none"
            : checkSearch === true
            ? "none"
            : "blur(5px)",
      }}
    >
      <div className="header">
        {machine_data.eq_status === "STOP" && machine_data.upd_empl !== "" && (
          <div className='downtime' style={{ fontSize: "1.2rem" }}>
            <div className="currenttime">
            Stop: {diff} min 
            </div>
            <div className="totaltime">
            (TT:{machine_data.machine_data?.ACC_TIME?.toLocaleString('en-US',{maximumFractionDigits:0,minimumFractionDigits:0})} min)
            </div>           
          </div>
        )}
        {machine_data.eq_status === "SETTING" && machine_data.upd_empl !== "" && (
          <div className='downtime' style={{ fontSize: "1.2rem" }}>           
            <div className="currenttime">
            Setting: {diff} min 
            </div>
            <div className="totaltime">
            (TT:{machine_data.machine_data?.ACC_TIME?.toLocaleString('en-US',{maximumFractionDigits:0,minimumFractionDigits:0})} min)
            </div>
          </div>
        )}
        {machine_data.eq_status === "MASS" && machine_data.upd_empl !== "" && (
          <div className='downtime' style={{ fontSize: "1.2rem" }}>
           <div className="currenttime">
            Run: {diff} min 
            </div>
            <div className="totaltime">
            (TT:{machine_data.machine_data?.ACC_TIME?.toLocaleString('en-US',{maximumFractionDigits:0,minimumFractionDigits:0})} min)
            </div>
          </div>
        )}

      </div>
      

      <div
        className='machine_component2'
        style={{
          /*  backgroundImage: `linear-gradient(to right, ${
            machine_data.run_stop === 1 ? runtopcolor : stoptopcolor
          }, ${machine_data.run_stop === 1 ? runbotcolor : stopbotcolor})`, */
          borderBottom: `${
            machine_data.machine_name?.slice(0, 2) === "FR"
              ? "5px solid black"
              : machine_data.machine_name?.slice(0, 2) === "SR"
              ? "5px solid #fa0cf2"
              : machine_data.machine_name?.slice(0, 2) === "DC"
              ? "5px solid blue"
              : "5px solid #faa30c"
          }`,
          borderRadius: "4px",
        }}
        onDoubleClick={machine_data.onClick}
        onMouseEnter={() => {
          setShowHideDetail(true);
        }}
        onMouseLeave={() => {
          setShowHideDetail(false);
        }}
      >
        <div
          className='tieude'
          style={{
            backgroundColor: `${
              checkSearch
                ? machine_data.eq_status === "STOP"
                  ? "red"
                  : machine_data.eq_status === "SETTING"
                  ? "yellow"
                  : `#3ff258`
                : "black"
            }`,

            fontSize: "1.5rem",
          }}
        >
          <div
            className='eqname'
            style={{
              color: `${
                machine_data.eq_status === "STOP"
                  ? "white"
                  : machine_data.eq_status === "SETTING"
                  ? "black"
                  : `black`
              }`,
            }}
          >
            {machine_data.machine_name === "ED36" &&
            machine_data.factory === "NM2"
              ? "ED36(SP01)"
              : machine_data.machine_name}
            {checkSearch && machine_data.eq_status === "MASS" && (
              <img alt='running' src='/blink.gif' width={50} height={25}></img>
            )}
            {checkSearch && machine_data.eq_status === "SETTING" && (
              <img
                alt='running'
                src='/setting3.gif'
                width={25}
                height={25}
              ></img>
            )}
            {checkSearch && machine_data.eq_status === "STOP" && (
              <span style={{ fontSize: "1.6rem" }}>_STOP</span>
            )}
          </div>
        </div>
        <div className='noidung' style={backGroundStyle}>
          <div className='up'>
            <div className='emplpicture'>
              <span
                style={{
                  alignSelf: "center",
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                {machine_data.upd_empl}
              </span>
              <img
                width={88}
                height={100}
                /* src={"/Picture_NS/NS_" + "NHU1903" + ".jpg"} */
                src={"/Picture_NS/NS_" + machine_data.upd_empl + ".jpg"}
                alt={"congnhan"}
              ></img>
            </div>
            <div className='target' style={backGroundStyle}>
              <div className='title'>Target</div>
              <div className='content'>
                <span>Setting: {
                thisSettingTime
                } min</span>
                <span>UPH: {
               thisUPH?.toLocaleString('en-US')
                } EA/h</span>
                <span>Start time: {machine_data.machine_data?.SETTING_START_TIME !== null? moment.utc(machine_data.machine_data?.SETTING_START_TIME).format('HH:mm:ss'): 'N/A'}</span>
                
                <span>End time: {
                  //(parseInt(machine_data.machine_data?.PLAN_QTY/thisUPH*60) + thisSettingTime)
                  thisUPH !== undefined?
                machine_data.machine_data?.SETTING_START_TIME !== null? 
                moment.utc(machine_data.machine_data?.SETTING_START_TIME).add(thisPLAN_QTY/thisUPH*60 + (thisSettingTime === undefined? 0 : thisSettingTime),'minute').format('HH:mm:ss'): "N/A" : "N/A"}</span>
              </div>
            </div>
            <div className='result' style={backGroundStyle}>
              <div className='title'>Result</div>
              <div className='content'>
                <span>Setting: {diffsetting} min</span>
                <span>UPH: {(finalRESULT/diffmass*60).toLocaleString('en-US', {
                    style: "decimal",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })} EA/h</span>
                <span>Start time: {machine_data.machine_data?.SETTING_START_TIME !== null? moment.utc(machine_data.machine_data?.SETTING_START_TIME).format('HH:mm:ss'): 'N/A'}</span>
                <span>End time: {machine_data.machine_data?.MASS_END_TIME !== null? moment.utc(machine_data.machine_data?.MASS_END_TIME).format('HH:mm:ss'): 'Currently Running'}</span>
              </div>
            </div>
          </div>
          <div className='down'>
            <div className='planqty'>
              <div className='title' style={planQtyFontStyle}>
                PLAN QTY
              </div>
              <div className='value' style={planQtyFontStyle}>
                <span>{thisPLAN_QTY?.toLocaleString('en-US')}</span>
              </div>
            </div>
            <div className='result'>
              <div className='title' style={planQtyFontStyle}>
                RESULT QTY
              </div>
              <div className='value' style={planQtyFontStyle}>
                <span>{finalRESULT?.toLocaleString('en-US')}</span>
              </div>
            </div>
            <div className='rate'>
              <div className='title' style={planQtyFontStyle}>
                ACHIV.RATE
              </div>
              <div className='value' style={planQtyFontStyle}>
                <span>{(finalRESULT/thisPLAN_QTY).toLocaleString('en-US', {
                    style: "percent",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}</span>
              </div>
            </div>
          </div>
        </div>
        <div className='machineplan'>
          <span style={{ fontWeight: "bold" }}>
            {machine_data.current_plan_id}:
          </span>{" "}
          {machine_data.current_g_name} STEP: B{machine_data.current_step}
        </div>
      </div>
      {showhideDetail && <div className='chitiet'></div>}
    </div>
  );
};
export default MACHINE_COMPONENT2;

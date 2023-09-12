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
  var date1 = moment.utc();
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
      {machine_data.eq_status === "STOP" && machine_data.upd_empl !== "" && (
        <div className='downtime' style={{ fontSize: "1.2rem" }}>
          {" "}
          Stop: {diff} min
        </div>
      )}
      {machine_data.eq_status === "SETTING" && machine_data.upd_empl !== "" && (
        <div className='downtime' style={{ fontSize: "1.2rem" }}>
          {" "}
          Setting: {diff} min
        </div>
      )}
      {machine_data.eq_status === "MASS" && machine_data.upd_empl !== "" && (
        <div className='downtime' style={{ fontSize: "1.2rem" }}>
          {" "}
          Run: {diff} min
        </div>
      )}
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
                src={"/Picture_NS/NS_" + "NHU1903" + ".jpg"}
                /* src={"/Picture_NS/NS_" + machine_data.upd_empl + ".jpg"} */
                alt={"congnhan"}
              ></img>
            </div>
            <div className='target' style={backGroundStyle}>
              <div className='title'>Target</div>
              <div className='content'>
                <span>Setting: 90 min</span>
                <span>UPH: 1000 EA/h</span>
                <span>Start time: 08:20</span>
                <span>End time: 10:20</span>
              </div>
            </div>
            <div className='result' style={backGroundStyle}>
              <div className='title'>Result</div>
              <div className='content'>
                <span>Setting: 90 min</span>
                <span>UPH: 1000 EA/h</span>
                <span>Start time: 08:20</span>
                <span>End time: 10:20</span>
              </div>
            </div>
          </div>
          <div className='down'>
            <div className='planqty'>
              <div className='title' style={planQtyFontStyle}>
                PLAN QTY
              </div>
              <div className='value' style={planQtyFontStyle}>
                <span>25,000</span>
              </div>
            </div>
            <div className='result'>
              <div className='title' style={planQtyFontStyle}>
                RESULT QTY
              </div>
              <div className='value' style={planQtyFontStyle}>
                <span>20,000</span>
              </div>
            </div>
            <div className='rate'>
              <div className='title' style={planQtyFontStyle}>
                ACHIV.RATE
              </div>
              <div className='value' style={planQtyFontStyle}>
                <span>80%</span>
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

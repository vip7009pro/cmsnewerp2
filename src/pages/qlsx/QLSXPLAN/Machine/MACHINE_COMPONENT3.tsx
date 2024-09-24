import { Button } from "@mui/material";
import moment from "moment";
import React, { useState } from "react";
import Swal from "sweetalert2";
import "./MACHINE_COMPONENT3.scss";
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
  return (
    <div
      className="mc3"
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
        <div className="downtime" style={{ fontSize: 11 }}>
          {" "}
          Stop: {diff} min
        </div>
      )}
      {machine_data.eq_status === "SETTING" && machine_data.upd_empl !== "" && (
        <div className="downtime" style={{ fontSize: 11 }}>
          {" "}
          Setting: {diff} min
        </div>
      )}
      {machine_data.eq_status === "MASS" && machine_data.upd_empl !== "" && (
        <div className="downtime" style={{ fontSize: 11 }}>
          {" "}
          Run: {diff} min
        </div>
      )}
      <div
        className="machine_component2"
        style={{
          backgroundImage: `linear-gradient(to right, ${
            machine_data.run_stop === 1 ? runtopcolor : stoptopcolor
          }, ${machine_data.run_stop === 1 ? runbotcolor : stopbotcolor})`,
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
        onClick={machine_data.onClick}
        onMouseEnter={() => {
          setShowHideDetail(true);
        }}
        onMouseLeave={() => {
          setShowHideDetail(false);
        }}
        onDoubleClick={()=> {
          if (machine_data.onDoubleClick) {
            console.log(machine_data)
            machine_data.onDoubleClick(machine_data);
          }          
        }}
      >
        <div
          className="tieude"
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
          }}
        >
          <div
            className="eqname"
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
              <img alt="running" src="/blink.gif" width={40} height={20}></img>
            )}
            {checkSearch && machine_data.eq_status === "SETTING" && (
              <img
                alt="running"
                src="/setting3.gif"
                width={30}
                height={30}
              ></img>
            )}
          </div>
        </div>
        <div className="machineplan">
          {machine_data.current_g_name} STEP: B{machine_data.current_step}
        </div>
      </div>
      {showhideDetail && <div className="chitiet"></div>}
    </div>
  );
};
export default MACHINE_COMPONENT2;

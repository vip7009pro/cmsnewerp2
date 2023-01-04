import React from "react";
import { BiUser } from "react-icons/bi";
import "./INSPECT_COMPONENT.scss";
interface INS_STATUS {
  FACTORY?: string;
  EQ_NAME?: string;
  EMPL_COUNT?: number;
  EQ_STATUS?: string;
  CURR_PLAN_ID?: string;
  CURR_G_CODE?: string;
  G_NAME?: string;
  G_NAME_KD?: string;
  REMARK?: string;
  INS_EMPL?: string;
  INS_DATE?: string;
  UPD_EMPL?: string;
  UPD_DATE?: string;
}
const INSPECT_COMPONENT = ({ INS_DATA }: { INS_DATA?: INS_STATUS }) => {
  const runtopcolor: string = "#2fd5eb";
  const runbotcolor: string = "#8ce9f5";
  const stoptopcolor: string = "white";
  const stopbotcolor: string = "black";
  return (
    <div
      className='inspect_component'
      style={{
        backgroundImage: `linear-gradient(to right, ${
          INS_DATA?.EQ_STATUS === "START" ? runtopcolor : stoptopcolor
        }, ${INS_DATA?.EQ_STATUS === "START" ? runbotcolor : stopbotcolor})`,
        borderRadius: "4px",
      }}
    >
      <div
        className='tieude'
        style={{
          backgroundColor: `${
            INS_DATA?.EQ_STATUS === "STOP"
              ? "red"
              : INS_DATA?.EQ_STATUS === "START"
              ? "#3ff258"
              : `#3ff258`
          }`,
        }}
      >
        <div
          className='eqname'
          style={{
            color: `${
              INS_DATA?.EQ_STATUS === "STOP"
                ? "white"
                : INS_DATA?.EQ_STATUS === "START"
                ? "black"
                : `black`
            }`,
          }}
        >
          {INS_DATA?.EQ_NAME}
          {INS_DATA?.EQ_STATUS === "START" && (
            <img alt='running' src='/blink.gif' width={40} height={20}></img>
          )}
          {INS_DATA?.EQ_STATUS === "SETTING" && (
            <img alt='running' src='/setting3.gif' width={30} height={30}></img>
          )}
        </div>
      </div>
      <div className='machineplan' style={{ fontSize: "12px" }}>
        <div className='codename'> {INS_DATA?.G_NAME_KD}</div>
        <div className='user'>
          <BiUser /> {INS_DATA?.EMPL_COUNT} người
        </div>
      </div>
    </div>
  );
};
export default INSPECT_COMPONENT;

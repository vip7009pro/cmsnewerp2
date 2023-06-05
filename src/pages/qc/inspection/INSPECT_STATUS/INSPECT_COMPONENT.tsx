import React from "react";
import { BiUser } from "react-icons/bi";
import "./INSPECT_COMPONENT.scss";
interface INS_STATUS {
  SEARCH_STRING?: string;
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

  let checkSearch: boolean = false; 
  if(INS_DATA?.G_NAME !== undefined && INS_DATA.SEARCH_STRING !== undefined && INS_DATA.G_NAME !== null && INS_DATA.SEARCH_STRING !== null)
  {
    if(INS_DATA.SEARCH_STRING ==='')
    {
      checkSearch = true;
    }
    else 
    {
      checkSearch = INS_DATA.G_NAME.toLowerCase().includes(INS_DATA.SEARCH_STRING.toLowerCase());
    }
  }
  
  return (
    <div
      className='inspect_component'
      style={{
        backgroundImage: `linear-gradient(to right, ${
          INS_DATA?.EQ_STATUS === "START" ? runtopcolor : stoptopcolor
        }, ${INS_DATA?.EQ_STATUS === "START" ? runbotcolor : stopbotcolor})`,
        borderRadius: "4px",
        WebkitFilter: INS_DATA?.G_NAME===null? 'none': checkSearch? 'none': 'blur(5px)',
      }}
    >
      <div
        className='tieude'
        style={{
          backgroundColor: `${
            checkSearch ?
            INS_DATA?.EQ_STATUS === "STOP"
              ? "red"
              : INS_DATA?.EQ_STATUS === "START"
              ? "#3ff258"
              : `#3ff258` :'black'
          }`,
        }}
      >
        <div
          className='eqname'
          style={{
            color: `${
              checkSearch?
              INS_DATA?.EQ_STATUS === "STOP"
                ? "white"
                : INS_DATA?.EQ_STATUS === "START"
                ? "black"
                : `black` : 'white'
            }`,
            /* backgroundColor: checkSearch? '#66d8f2':'black' */
          }}
        >
           {INS_DATA?.EQ_NAME}
          {checkSearch && (INS_DATA?.EQ_STATUS === "START") && (
            <img alt='running' src='/blink.gif' width={40} height={15}></img>
          )}
          { checkSearch && (INS_DATA?.EQ_STATUS === "SETTING") && (
            <img alt='running' src='/setting3.gif' width={30} height={30}></img>
          )}
        </div>
      </div>
      <div className='machineplan' style={{ fontSize: "12px",     
     }}>
        <div className='codename'> {INS_DATA?.G_NAME_KD}</div>
        <div className='user'>
          <BiUser /> {INS_DATA?.EMPL_COUNT} người
        </div>
      </div>
    </div>
  );
};
export default INSPECT_COMPONENT;

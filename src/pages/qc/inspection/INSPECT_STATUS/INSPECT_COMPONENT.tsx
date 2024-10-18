import React from "react";
import { BiUser } from "react-icons/bi";
import "./INSPECT_COMPONENT.scss";
import { INS_STATUS } from "../../../../api/GlobalInterface";
import { generalQuery } from "../../../../api/Api";
import Swal from "sweetalert2";

const INSPECT_COMPONENT = ({ INS_DATA }: { INS_DATA?: INS_STATUS }) => {
  const runtopcolor: string = "#2fd5eb";
  const runbotcolor: string = "#8ce9f5";
  const stoptopcolor: string = "white";
  const stopbotcolor: string = "black";

  let checkSearch: boolean = false;
  if (
    INS_DATA?.G_NAME !== undefined &&
    INS_DATA.SEARCH_STRING !== undefined &&
    INS_DATA.G_NAME !== null &&
    INS_DATA.SEARCH_STRING !== null
  ) {
    if (INS_DATA.SEARCH_STRING === "") {
      checkSearch = true;
    } else {
      checkSearch = INS_DATA.G_NAME.toLowerCase().includes(
        INS_DATA.SEARCH_STRING.toLowerCase(),
      );
    }
  }
  const resetStatus = async () => {
    //Swal confirm whether to reset status
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to reset the status of this machine!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, reset it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await generalQuery("resetStatus", {
          EQ_NAME: INS_DATA?.EQ_NAME,
        }).then((response) => {
          console.log(response);
          if (response.data.tk_status !== "NG") {
            Swal.fire("Reset!", "Status has been reset.", "success");
          } else {
            Swal.fire("Error!", "Status reset failed.", "error");
          }
        });
      }
    });
  };

  return (
    <div
      className="inspect_component"
      style={{
        backgroundImage: `linear-gradient(to right, ${
          INS_DATA?.EQ_STATUS === "START" ? runtopcolor : stoptopcolor
        }, ${INS_DATA?.EQ_STATUS === "START" ? runbotcolor : stopbotcolor})`,
        borderRadius: "4px",
        WebkitFilter:
          INS_DATA?.G_NAME === null
            ? "none"
            : checkSearch
            ? "none"
            : "blur(5px)",
      }}
      onDoubleClick={() => {
        console.log("double click");
        console.log(INS_DATA);
        resetStatus();  
      }}
    >
      <div
        className="tieude"
        style={{
          backgroundColor: `${
            checkSearch
              ? INS_DATA?.EQ_STATUS === "STOP"
                ? "red"
                : INS_DATA?.EQ_STATUS === "START"
                ? "#3ff258"
                : `#3ff258`
              : "black"
          }`,
        }}
      >
        <div
          className="eqname"
          style={{
            color: `${
              checkSearch
                ? INS_DATA?.EQ_STATUS === "STOP"
                  ? "white"
                  : INS_DATA?.EQ_STATUS === "START"
                  ? "black"
                  : `black`
                : "white"
            }`,
            /* backgroundColor: checkSearch? '#66d8f2':'black' */
          }}
        >
          {INS_DATA?.EQ_NAME}
          {checkSearch && INS_DATA?.EQ_STATUS === "START" && (
            <img alt="running" src="/blink.gif" width={40} height={15}></img>
          )}
          {checkSearch && INS_DATA?.EQ_STATUS === "SETTING" && (
            <img alt="running" src="/setting3.gif" width={30} height={30}></img>
          )}
        </div>
      </div>
      <div className="machineplan" style={{ fontSize: "12px" }}>
        <div className="codename"> {INS_DATA?.G_NAME_KD}</div>
        <div className="user">
          <BiUser /> {INS_DATA?.EMPL_COUNT} người
        </div>
      </div>
    </div>
  );
};
export default INSPECT_COMPONENT;

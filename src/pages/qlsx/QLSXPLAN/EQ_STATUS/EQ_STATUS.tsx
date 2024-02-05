/* eslint-disable no-loop-func */
import React, {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import "./EQ_STATUS.scss";
import Swal from "sweetalert2";
import { generalQuery, getCompany } from "../../../../api/Api";
import moment from "moment";
import { UserContext } from "../../../../api/Context";
import MACHINE_COMPONENT2 from "../Machine/MACHINE_COMPONENT2";
import EQ_SUMMARY from "./EQ_SUMMARY";
import { Checkbox, TextField } from "@mui/material";
import { EQ_STT } from "../../../../api/GlobalInterface";
import { useSpring, animated } from "@react-spring/web";
const EQ_STATUS = () => {
  const [time, setTime] = useState(5);
  const [fullScreen, setFullScreen] = useState(false);
  const [autoChange, setAutoChange] = useState(false);
  const [factory, setFactory] = useState("NM1");
  const [machine, setMachine] = useState("ED");
  const [searchString, setSearchString] = useState("");
  const [onlyRunning, setOnlyRunning] = useState(false);
  const [machine_number, setMachine_Number] = useState(12);
  const [pagenum, setPageNum] = useState(1);
  const [trigger, setTrigger] = useState(true);
  const page = useRef(1);
  const [eq_status, setEQ_STATUS] = useState<EQ_STT[]>([]);
  const [eq_series, setEQ_SERIES] = useState<string[]>([]);
  const [totalmachine, setTotalMachine] = useState(39);
  const handle_loadEQ_STATUS = () => {
    generalQuery("checkEQ_STATUS", {})
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: EQ_STT[] = response.data.data.map(
            (element: EQ_STT, index: number) => {
              return {
                ...element,
                id: index,
              };
            }
          );
          //console.log(loaded_data);
          setEQ_STATUS(loaded_data);
          setEQ_SERIES([
            ...new Set(
              loaded_data.map((e: EQ_STT, index: number) => {
                return e.EQ_SERIES === undefined ? "" : e.EQ_SERIES;
              })
            ), 'FR+SR'
          ]);
        } else {
          setEQ_STATUS([]);
          setEQ_SERIES([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const springs = useSpring({
    from: { x: 2000, y: 0 },
    to: { x: 0, y: 0 },
    config: { duration: 200 },
    /* transform: trigger ? "translateX(-50%)" : "translateX(50%)", // Slide in từ trái sang phải, slide out đi ngược lại
    opacity: trigger ? 1 : 0, */
  });
  useEffect(() => {
    let currentTimeout = 5;
    let showtimeout: any = localStorage.getItem("showtimeout")?.toString();
    if (showtimeout !== undefined) {
      setTime(Number(showtimeout));
      currentTimeout = Number(showtimeout);
    } else {
      /* localStorage.setItem("server_ip", 'http://14.160.33.94:5013/api');
      dispatch(changeServer('http://14.160.33.94:5013/api')); */
      localStorage.setItem("showtimeout", "10");
      currentTimeout = 10;
    }
    handle_loadEQ_STATUS();
    let intervalID = window.setInterval(() => {
      handle_loadEQ_STATUS();
    }, 3000);
    let intervalID2 = window.setInterval(() => {
      //console.log(39 / machine_number);
      if (page.current >= 39 / machine_number) {
        page.current = 1;
      } else {
        page.current += 1;
      }
      setPageNum(page.current);
    }, currentTimeout * 1000);
    return () => {
      window.clearInterval(intervalID);
      window.clearInterval(intervalID2);
    };
  }, [page.current]);
  return (
    <div
      className='eq_status'
      style={{
        position: fullScreen ? `fixed` : `relative`,
        top: fullScreen ? `0` : `0`,
        left: fullScreen ? `0` : `0`,
      }}
    >
      <div className='searchcode'>
        <label>
          <b>FACTORY:</b>
          <select
            name='phanloai'
            value={factory}
            onChange={(e) => {
              setFactory(e.target.value);
              console.log(e.target.value);
            }}
            style={{ width: 160, height: 20 }}
          >
            <option value='NM1'>NM1</option>
            <option value='NM2'>NM2</option>
          </select>
        </label>
        <label>
          <b>MACHINE:</b>
          <select
            name='machine2'
            value={machine}
            onChange={(e) => {
              setMachine(e.target.value);
              //console.log(e.target.value);
            }}
            style={{ width: 160, height: 20 }}
          >
            {eq_series.map((ele: string, index: number) => {
              return (
                <option key={index} value={ele}>
                  {ele}
                </option>
              );
            })}
          </select>
        </label>
        Machine Show:
        <input
          type='text'
          placeholder='Number machine'
          value={machine_number}
          onChange={(e) => {
            setMachine_Number(Number(e.target.value));
          }}
        />
        Show Time (s):
        <input
          type='text'
          placeholder='Show Time'
          value={time}
          onChange={(e) => {
            setTime(Number(e.target.value));
            localStorage.setItem("showtimeout", e.target.value);
          }}
        />
        <Checkbox
          checked={autoChange}
          onChange={(e) => {
            //console.log(onlyRunning);
            setAutoChange(!autoChange);
          }}
          inputProps={{ "aria-label": "controlled" }}
        />
        Show Full
        <Checkbox
          checked={fullScreen}
          onChange={(e) => {
            //console.log(onlyRunning);
            setFullScreen(!fullScreen);
          }}
          inputProps={{ "aria-label": "controlled" }}
        />
        Full Screen
        <Checkbox
          checked={onlyRunning}
          onChange={(e) => {
            //console.log(onlyRunning);
            setOnlyRunning(!onlyRunning);
            if (onlyRunning) {
              setTotalMachine(
                eq_status.filter(
                  (element: EQ_STT, index: number) =>
                    element.FACTORY === factory &&
                    element?.EQ_NAME?.substring(0, 2) === machine &&
                    (element?.EQ_STATUS === "MASS" ||
                      element?.EQ_STATUS === "SETTING")
                ).length
              );
            } else {
              setTotalMachine(
                eq_status.filter(
                  (element: EQ_STT, index: number) =>
                    element.FACTORY === factory &&
                    element?.EQ_NAME?.substring(0, 2) === machine
                ).length
              );
            }
          }}
          inputProps={{ "aria-label": "controlled" }}
        />
        Only Running
        <input
          type='text'
          placeholder='Search code'
          value={searchString}
          onChange={(e) => {
            setSearchString(e.target.value);
          }}
        />
      </div>
      <div className='machinelist'>
        <div className='eqlist'>
          <div className='NM1'>
            <span className='machine_title'>
              {factory}{" "}
              {machine === "ED"
                ? `- Máy ${machine_number * (page.current - 1) + 1} =>
              Máy
              ${machine_number * page.current >= 39
                  ? 39
                  : machine_number * page.current
                }`
                : ``}
            </span>
            {eq_series
              .filter((element: string, index: number) => element === machine)
              .map((ele_series: string, index: number) => {
                return (
                  <animated.div
                    className='animated_div'
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: 8,
                      /*...springs,*/
                    }}
                    key={index}
                  >
                    <div id='machinediv' className='FRlist' key={index}>
                      {eq_status
                        .filter(
                          (element: EQ_STT, index: number) => {
                            let selected_eq_name: string = element?.EQ_NAME?.substring(0, 2) ?? 'ED';
                            
                            return (
                              element.FACTORY === factory &&
                                (machine === 'FR+SR' ? (selected_eq_name === 'FR' || selected_eq_name === 'SR') : selected_eq_name === machine) &&
                              ((onlyRunning === true &&
                                element?.EQ_STATUS === "MASS" ||
                                element?.EQ_STATUS === "SETTING") ||
                                onlyRunning === false)
                            )
                          }
                        )
                        .map((element: EQ_STT, index: number) => {
                          if (autoChange) {
                            return (
                              <MACHINE_COMPONENT2
                                search_string={searchString}
                                key={index}
                                factory={element.FACTORY}
                                machine_name={element.EQ_NAME}
                                eq_status={element.EQ_STATUS}
                                current_g_name={element.G_NAME_KD}
                                current_plan_id={element.CURR_PLAN_ID}
                                current_step={element.STEP}
                                run_stop={element.EQ_ACTIVE === "OK" ? 1 : 0}
                                upd_time={element.UPD_DATE}
                                upd_empl={element.UPD_EMPL}
                                machine_data={element}
                                onClick={() => { }}
                                onMouseEnter={() => { }}
                                onMouseLeave={() => { }}
                              />
                            );
                          } else {
                            if (element.EQ_SERIES === "ED") {
                              if (
                                index >= machine_number * (page.current - 1) &&
                                index < machine_number * page.current
                              ) {
                                return (
                                  <MACHINE_COMPONENT2
                                    search_string={searchString}
                                    key={index}
                                    factory={element.FACTORY}
                                    machine_name={element.EQ_NAME}
                                    eq_status={element.EQ_STATUS}
                                    current_g_name={element.G_NAME_KD}
                                    current_plan_id={element.CURR_PLAN_ID}
                                    current_step={element.STEP}
                                    run_stop={
                                      element.EQ_ACTIVE === "OK" ? 1 : 0
                                    }
                                    upd_time={element.UPD_DATE}
                                    upd_empl={element.UPD_EMPL}
                                    machine_data={element}
                                    onClick={() => { }}
                                    onMouseEnter={() => { }}
                                    onMouseLeave={() => { }}
                                  />
                                );
                              } else {
                              }
                            } else {
                              return (
                                <MACHINE_COMPONENT2
                                  search_string={searchString}
                                  key={index}
                                  factory={element.FACTORY}
                                  machine_name={element.EQ_NAME}
                                  eq_status={element.EQ_STATUS}
                                  current_g_name={element.G_NAME_KD}
                                  current_plan_id={element.CURR_PLAN_ID}
                                  current_step={element.STEP}
                                  run_stop={element.EQ_ACTIVE === "OK" ? 1 : 0}
                                  upd_time={element.UPD_DATE}
                                  upd_empl={element.UPD_EMPL}
                                  machine_data={element}
                                  onClick={() => { }}
                                  onMouseEnter={() => { }}
                                  onMouseLeave={() => { }}
                                />
                              );
                            }
                          }
                        })}
                    </div>
                  </animated.div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default EQ_STATUS;

/* eslint-disable no-loop-func */
import React, {
  ReactElement,
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

const EQ_STATUS = () => {
  const [factory, setFactory] = useState("NM1");
  const [machine, setMachine] = useState("ED");
  const [searchString, setSearchString] = useState("");
  const [onlyRunning, setOnlyRunning] = useState(false);
  const [machine_number, setMachine_Number] = useState(12);
  const [pagenum, setPageNum] = useState(1);
  const page = useRef(1);
  const [eq_status, setEQ_STATUS] = useState<EQ_STT[]>([]);
  const [eq_series, setEQ_SERIES] = useState<string[]>([]);
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
            ),
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

  useEffect(() => {
    handle_loadEQ_STATUS();
    let intervalID = window.setInterval(() => {
      handle_loadEQ_STATUS();
    }, 3000);

    let intervalID2 = window.setInterval(() => {
      if (page.current >= 3) {
        page.current = 1;
      } else {
        page.current += 1;
      }
      setPageNum(page.current);
    }, 5000);

    return () => {
      window.clearInterval(intervalID);
      window.clearInterval(intervalID2);
    };
  }, [page.current]);
  return (
    <div className='eq_status'>
      <div className='searchcode'>
        <TextField
          placeholder='Search Code'
          value={searchString}
          onChange={(e) => {
            setSearchString(e.target.value);
          }}
        />
        <label>
          <b>FACTORY:</b>
          <select
            name='phanloai'
            value={factory}
            onChange={(e) => {
              setFactory(e.target.value);
              console.log(e.target.value);
            }}
            style={{ width: 160, height: 30 }}
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
              console.log(e.target.value);
            }}
            style={{ width: 160, height: 30 }}
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
        <button style={{ height: "30px" }} onClick={() => {}}>
          Auto Scroll
        </button>
        <Checkbox
          checked={onlyRunning}
          onChange={(e) => {
            //console.log(onlyRunning);
            setOnlyRunning(!onlyRunning);
          }}
          inputProps={{ "aria-label": "controlled" }}
        />
        Only Running
      </div>
      <div className='machinelist'>
        <div className='eqlist'>
          <div className='NM1'>
            <span className='machine_title'>NM1</span>
            {/* <EQ_SUMMARY
              EQ_DATA={eq_status.filter(
                (element: EQ_STT, index: number) => element.FACTORY === factory && element.EQ_NAME=== machine
              )}
            /> */}
            {eq_series
              .filter((element: string, index: number) => element === machine)
              .map((ele_series: string, index: number) => {
                return (
                  <div id='machinediv' className='FRlist' key={index}>
                    {eq_status
                      .filter(
                        (element: EQ_STT, index: number) =>
                          element.FACTORY === factory &&
                          element?.EQ_NAME?.substring(0, 2) === machine &&
                          ((onlyRunning === true &&
                            element?.EQ_STATUS === "MASS") ||
                            element?.EQ_STATUS === "SETTING" ||
                            onlyRunning == false)
                      )
                      .map((element: EQ_STT, index: number) => {
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
                                run_stop={element.EQ_ACTIVE === "OK" ? 1 : 0}
                                upd_time={element.UPD_DATE}
                                upd_empl={element.UPD_EMPL}
                                machine_data={element}
                                onClick={() => {}}
                                onMouseEnter={() => {}}
                                onMouseLeave={() => {}}
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
                              onClick={() => {}}
                              onMouseEnter={() => {}}
                              onMouseLeave={() => {}}
                            />
                          );
                        }
                      })}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default EQ_STATUS;

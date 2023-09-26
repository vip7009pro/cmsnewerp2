/* eslint-disable no-loop-func */
import React, {
  ReactElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import Swal from "sweetalert2";
import { generalQuery, getCompany } from "../../../../api/Api";
import moment from "moment";
import { UserContext } from "../../../../api/Context";
import MACHINE_COMPONENT3 from "../Machine/MACHINE_COMPONENT3";
import EQ_SUMMARY from "./EQ_SUMMARY";
import { TextField } from "@mui/material";
import { EQ_STT } from "../../../../api/GlobalInterface";
import "./EQ_STATUS2.scss";

const EQ_STATUS2 = () => {
  const [searchString, setSearchString] = useState("");
  const [selection, setSelection] = useState<any>({
    tab1: true,
    tab2: false,
    tab3: false,
    tabycsx: false,
    tabbanve: false,
  });
  const setNav = (choose: number) => {
    if (choose === 1) {
      setSelection({ ...selection, tab1: true, tab2: false, tab3: false });
    } else if (choose === 2) {
      setSelection({ ...selection, tab1: false, tab2: true, tab3: false });
    } else if (choose === 3) {
      setSelection({ ...selection, tab1: false, tab2: false, tab3: true });
    }
  };
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
            },
          );
          //console.log(loaded_data);
          setEQ_STATUS(loaded_data);
          setEQ_SERIES([
            ...new Set(
              loaded_data.map((e: EQ_STT, index: number) => {
                return e.EQ_SERIES === undefined ? "" : e.EQ_SERIES;
              }),
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
    return () => {
      window.clearInterval(intervalID);
    };
  }, []);
  return (
    <div className="eq_status2">
      <div className="searchcode">
        <TextField
          placeholder="Search Code"
          value={searchString}
          onChange={(e) => {
            setSearchString(e.target.value);
          }}
        />
      </div>
      <div className="machinelist">
        <div className="eqlist">
          <div className="NM1">
            <span className="machine_title">NM1</span>
            <EQ_SUMMARY
              EQ_DATA={eq_status.filter(
                (element: EQ_STT, index: number) => element.FACTORY === "NM1",
              )}
            />
            {eq_series.map((ele_series: string, index: number) => {
              return (
                <div className="FRlist" key={index}>
                  {eq_status
                    .filter(
                      (element: EQ_STT, index: number) =>
                        element.FACTORY === "NM1" &&
                        element?.EQ_NAME?.substring(0, 2) === ele_series,
                    )
                    .map((element: EQ_STT, index: number) => {
                      return (
                        <MACHINE_COMPONENT3
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
                    })}
                </div>
              );
            })}

            {/*  <div className='FRlist'>
            {eq_status
              .filter(
                (element: EQ_STT, index: number) =>
                  element.FACTORY === "NM1" &&
                  element.EQ_NAME.substring(0, 2) === "FR"
              )
              .map((element: EQ_STT, index: number) => {
                return (
                  <MACHINE_COMPONENT3
                    search_string={searchString}                    
                    key={index}
                    factory={element.FACTORY}
                    machine_name={element.EQ_NAME}
                    eq_status={element.EQ_STATUS}
                    current_g_name={element.G_NAME_KD}
                    current_plan_id={element.CURR_PLAN_ID}
                    current_step = {element.STEP}
                    run_stop={element.EQ_ACTIVE === "OK" ? 1 : 0}
                    upd_time ={element.UPD_DATE}
                    upd_empl ={element.UPD_EMPL}                    
                    onClick={() => {}}
                    onMouseEnter={()=>{}}
                    onMouseLeave={()=>{}}
                  />
                );
              })}
          </div>
          <div className='FRlist'>
            {eq_status
              .filter(
                (element: EQ_STT, index: number) =>
                  element.FACTORY === "NM1" &&
                  element.EQ_NAME.substring(0, 2) === "SR"
              )
              .map((element: EQ_STT, index: number) => {
                return (
                  <MACHINE_COMPONENT3
                    search_string={searchString}
                    key={index}
                    factory={element.FACTORY}
                    machine_name={element.EQ_NAME}
                    eq_status={element.EQ_STATUS}
                    current_g_name={element.G_NAME_KD}
                    current_step = {element.STEP}
                    current_plan_id={element.CURR_PLAN_ID}
                    run_stop={element.EQ_ACTIVE === "OK" ? 1 : 0}
                    upd_time ={element.UPD_DATE}
                    upd_empl ={element.UPD_EMPL}
                    onClick={() => {}}
                  />
                );
              })}
          </div>
          <div className='FRlist'>
            {eq_status
              .filter(
                (element: EQ_STT, index: number) =>
                  element.FACTORY === "NM1" &&
                  element.EQ_NAME.substring(0, 2) === "DC"
              )
              .map((element: EQ_STT, index: number) => {
                return (
                  <MACHINE_COMPONENT3
                    search_string={searchString}
                    key={index}
                    factory={element.FACTORY}
                    machine_name={element.EQ_NAME}
                    eq_status={element.EQ_STATUS}
                    current_g_name={element.G_NAME_KD}
                    current_step = {element.STEP}
                    current_plan_id={element.CURR_PLAN_ID}
                    run_stop={element.EQ_ACTIVE === "OK" ? 1 : 0}
                    upd_time ={element.UPD_DATE}
                    upd_empl ={element.UPD_EMPL}
                    onClick={() => {}}
                  />
                );
              })}
          </div>
          <div className='FRlist'>
            {eq_status
              .filter(
                (element: EQ_STT, index: number) =>
                  element.FACTORY === "NM1" &&
                  element.EQ_NAME.substring(0, 2) === "ED"
              )
              .map((element: EQ_STT, index: number) => {
                return (
                  <MACHINE_COMPONENT3
                    search_string={searchString}
                    key={index}
                    factory={element.FACTORY}
                    machine_name={element.EQ_NAME}
                    eq_status={element.EQ_STATUS}
                    current_g_name={element.G_NAME_KD}
                    current_step = {element.STEP}
                    current_plan_id={element.CURR_PLAN_ID}
                    run_stop={element.EQ_ACTIVE === "OK" ? 1 : 0}
                    upd_time ={element.UPD_DATE}
                    upd_empl ={element.UPD_EMPL}
                    onClick={() => {}}
                  />
                );
              })}
          </div> */}
          </div>
        </div>
        {getCompany() === "CMS" && (
          <div className="eqinfo">
            <div className="NM2">
              <span className="machine_title">NM2</span>
              <EQ_SUMMARY
                EQ_DATA={eq_status.filter(
                  (element: EQ_STT, index: number) => element.FACTORY === "NM2",
                )}
              />
              {eq_series.map((ele_series: string, index: number) => {
                return (
                  <div className="FRlist" key={index}>
                    {eq_status
                      .filter(
                        (element: EQ_STT, index: number) =>
                          element.FACTORY === "NM2" &&
                          element?.EQ_NAME?.substring(0, 2) === ele_series,
                      )
                      .map((element: EQ_STT, index: number) => {
                        return (
                          <MACHINE_COMPONENT3
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
                            onClick={() => { }}
                            onMouseEnter={() => { }}
                            onMouseLeave={() => { }}
                          />
                        );
                      })}
                  </div>
                );
              })}

              {/*  <div className='FRlist'>
            {eq_status
              .filter(
                (element: EQ_STT, index: number) =>
                  element.FACTORY === "NM2" &&
                  element.EQ_NAME.substring(0, 2) === "FR"
              )
              .map((element: EQ_STT, index: number) => {
                return (
                  <MACHINE_COMPONENT3
                    search_string={searchString}
                    key={index}
                    factory={element.FACTORY}
                    machine_name={element.EQ_NAME}
                    eq_status={element.EQ_STATUS}
                    current_g_name={element.G_NAME_KD}
                    current_plan_id={element.CURR_PLAN_ID}
                    current_step = {element.STEP}
                    run_stop={element.EQ_ACTIVE === "OK" ? 1 : 0}
                    upd_time ={element.UPD_DATE}
                    upd_empl ={element.UPD_EMPL}
                    onClick={() => {}}
                  />
                );
              })}
          </div>
          <div className='FRlist'>
            {eq_status
              .filter(
                (element: EQ_STT, index: number) =>
                  element.FACTORY === "NM2" &&
                  element.EQ_NAME.substring(0, 2) === "ED"
              )
              .map((element: EQ_STT, index: number) => {
                return (
                  <MACHINE_COMPONENT3
                    search_string={searchString}
                    key={index}
                    factory={element.FACTORY}
                    machine_name={element.EQ_NAME}
                    eq_status={element.EQ_STATUS}
                    current_g_name={element.G_NAME_KD}
                    current_step = {element.STEP}
                    current_plan_id={element.CURR_PLAN_ID}
                    run_stop={element.EQ_ACTIVE === "OK" ? 1 : 0}
                    upd_time ={element.UPD_DATE}
                    upd_empl ={element.UPD_EMPL}
                    onClick={() => {}}
                  />
                );
              })}
          </div> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default EQ_STATUS2;

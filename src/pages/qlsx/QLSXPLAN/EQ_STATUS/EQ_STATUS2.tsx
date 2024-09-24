/* eslint-disable no-loop-func */
import { useEffect, useMemo, useState } from "react";
import { getCompany } from "../../../../api/Api";
import MACHINE_COMPONENT3 from "../Machine/MACHINE_COMPONENT3";
import EQ_SUMMARY from "./EQ_SUMMARY";
import { IconButton } from "@mui/material";
import { EQ_STT, MachineInterface2 } from "../../../../api/GlobalInterface";
import "./EQ_STATUS2.scss";
import { f_handle_loadEQ_STATUS, f_handle_toggleMachineActiveStatus } from "../../../../api/GlobalFunction";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import Swal from "sweetalert2";
import { AiFillCloseCircle, AiFillFileAdd } from "react-icons/ai";
import AGTable from "../../../../components/DataTable/AGTable";
const EQ_STATUS2 = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [showHideEQManager, setShowHideEQManager] = useState(true);
  const openDialogEQManager = () => {
    setShowHideEQManager(true);
  }
  const closeDialogEQManager = () => {
    setShowHideEQManager(false);
  }
  const [searchString, setSearchString] = useState("");
  const [eq_status, setEQ_STATUS] = useState<EQ_STT[]>([]);
  const [eq_series, setEQ_SERIES] = useState<string[]>([]);
  const handle_loadEQ_STATUS = async () => {
    let eq_data = await f_handle_loadEQ_STATUS();
    setEQ_STATUS(eq_data.EQ_STATUS);
    setEQ_SERIES(eq_data.EQ_SERIES);
  };
  const handleToggleMachineActiveStatus = async (EQ_CODE: string, EQ_ACTIVE: string) => {
    let kq = await f_handle_toggleMachineActiveStatus(EQ_CODE, EQ_ACTIVE);
    if (kq) {
      Swal.fire({
        icon: "success",
        title: "Toggle machine active status successfully",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Toggle machine active status failed",
      });
    }
  }
  const column_eq_status = [
    { field: "EQ_CODE", headerName: "EQ_CODE", width: 80, checkboxSelection: true, headerCheckboxSelection: true },
    { field: "FACTORY", headerName: "FACTORY", width: 80 },
    { field: "EQ_NAME", headerName: "EQ_NAME", width: 80 },
    { field: "EQ_SERIES", headerName: "EQ_SERIES", width: 80 },
    { field: "EQ_ACTIVE", headerName: "EQ_ACTIVE", width: 80 },
    { field: "EQ_STATUS", headerName: "EQ_STATUS", width: 80 },
    { field: "CURR_PLAN_ID", headerName: "CURR_PLAN_ID", width: 80 },
    { field: "CURR_G_CODE", headerName: "CURR_G_CODE", width: 80 },
    { field: "INS_EMPL", headerName: "INS_EMPL", width: 80 },
    { field: "INS_DATE", headerName: "INS_DATE", width: 80 },
    { field: "UPD_EMPL", headerName: "UPD_EMPL", width: 80 },
    { field: "UPD_DATE", headerName: "UPD_DATE", width: 80 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 80 },
    { field: "STEP", headerName: "STEP", width: 80 },
    { field: "SETTING_START_TIME", headerName: "SETTING_START_TIME", width: 80 },
    { field: "MASS_START_TIME", headerName: "MASS_START_TIME", width: 80 },
    { field: "MASS_END_TIME", headerName: "MASS_END_TIME", width: 80 },
    { field: "KQ_SX_TAM", headerName: "KQ_SX_TAM", width: 80 },
    { field: "SX_RESULT", headerName: "SX_RESULT", width: 80 },
    { field: "PROCESS_NUMBER", headerName: "PROCESS_NUMBER", width: 80 },
    { field: "PLAN_QTY", headerName: "PLAN_QTY", width: 80 },
    { field: "ACC_TIME", headerName: "ACC_TIME", width: 80 },
    { field: "G_NAME", headerName: "G_NAME", width: 80 },
    { field: "REMARK", headerName: "REMARK", width: 80 },
  ]
  const eq_data_table = useMemo(() => {
    return (
      <AGTable
        toolbar={
          <>
          </>
        }
        data={eq_status}
        columns={column_eq_status}
        onSelectionChange={() => { }}
      />
    )
  }, [])
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
        <input type='text' placeholder="Search Code" value={searchString} onChange={(e) => {
          setSearchString(e.target.value);
        }}>
        </input>
        <IconButton
          className="buttonIcon"
          onClick={openDialogEQManager}
        >
          <AiFillFileAdd color="green" size={15} />
          EQ Manager
        </IconButton>
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
                          eq_active={element.EQ_ACTIVE}
                          eq_code={element.EQ_CODE}
                          onClick={() => { }}
                          onMouseEnter={() => { }}
                          onMouseLeave={() => { }}
                          onDoubleClick={(e) => {
                            console.log(e)
                            if (e.eq_active === "OK") {
                              handleToggleMachineActiveStatus(e.eq_code ?? "", "NG");
                            }
                            else {
                              handleToggleMachineActiveStatus(e.eq_code ?? "", "OK");
                            }
                          }}
                        />
                      );
                    })}
                </div>
              );
            })}
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
                            eq_active={element.EQ_ACTIVE}
                            eq_code={element.EQ_CODE}
                            onClick={() => { }}
                            onMouseEnter={() => { }}
                            onMouseLeave={() => { }}
                            onDoubleClick={(e: MachineInterface2) => {
                              console.log(e)
                              if (e.eq_active === "OK") {
                                handleToggleMachineActiveStatus(e.eq_code ?? "", "NG");
                              }
                              else {
                                handleToggleMachineActiveStatus(e.eq_code ?? "", "OK");
                              }
                            }}
                          />
                        );
                      })}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {showHideEQManager &&
        <div className="eq_manager" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '70vw', height: '80vh', backgroundColor: '#86c4d3', padding: '10px' }}>
          <div className="eq_manager_title" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20px', fontSize: '1rem', fontWeight: 'bold' }}>
            <span>EQ Manager</span>
            <IconButton
              className="buttonIcon"
              onClick={closeDialogEQManager}
            >
              <AiFillCloseCircle color="blue" size={15} />
              Close
            </IconButton>
          </div>
          {eq_data_table}
        </div>}
    </div>
  );
};
export default EQ_STATUS2;

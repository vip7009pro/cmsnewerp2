/* eslint-disable no-loop-func */
import { useEffect, useMemo, useRef, useState } from "react";
import { getCompany, getUserData } from "../../../../api/Api";
import MACHINE_COMPONENT3 from "../Machine/MACHINE_COMPONENT3";
import EQ_SUMMARY from "./EQ_SUMMARY";
import { IconButton } from "@mui/material";
import { EQ_STT, MachineInterface2 } from "../../../../api/GlobalInterface";
import "./EQ_STATUS2.scss";
import { checkBP, f_addMachine, f_deleteMachine, f_handle_loadEQ_STATUS, f_handle_toggleMachineActiveStatus } from "../../../../api/GlobalFunction";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import Swal from "sweetalert2";
import { AiFillCloseCircle, AiFillDelete, AiFillFileAdd, AiFillPlusCircle, AiOutlineSetting } from "react-icons/ai";
import AGTable from "../../../../components/DataTable/AGTable";
import CustomDialog from "../../../../components/Dialog/CustomDialog";
import { GiManualMeatGrinder } from "react-icons/gi";
const EQ_STATUS2 = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [factory, setFactory] = useState("NM1");
  const [eqCode, setEqCode] = useState("");
  const [eqName, setEqName] = useState("");
  const [eqActive, setEqActive] = useState("OK");
  const [eqOp, setEqOp] = useState(1);
  const [showHideEQManager, setShowHideEQManager] = useState(false);
  const [showAddMachineDialog, setShowAddMachineDialog] = useState(false);
  const selectedMachine = useRef<EQ_STT | null>(null);

  const handleAddMachine = async () => {
    let kq = await f_addMachine({
      FACTORY: factory,
      EQ_CODE: eqCode,
      EQ_NAME: eqName,
      EQ_ACTIVE: eqActive,
      EQ_OP: eqOp      
    });
    if (kq) {
      Swal.fire({
        icon: "success",
        title: "Add machine successfully",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Add machine failed",
      });
    }
  }
  const handleDeleteMachine = async () => {
    console.log(selectedMachine.current)
    if (selectedMachine.current) {
    let kq = await f_deleteMachine({
      EQ_CODE: selectedMachine.current?.EQ_CODE,
    });
    if (kq) {
      Swal.fire({
        icon: "success",
        title: "Delete machine successfully",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Delete machine failed",
      });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "No machine selected",
      });
    }
  }
  const openDialogAddMachine = () => {
    setShowAddMachineDialog(true);
  }
  const closeDialogAddMachine = () => {
    setShowAddMachineDialog(false);
  }
  const openDialogEQManager = () => {
    setShowHideEQManager(true);
  }
  const closeDialogEQManager = () => {
    setShowHideEQManager(false);
  }
  const [searchString, setSearchString] = useState("");
  const [eq_status, setEQ_STATUS] = useState<EQ_STT[]>([]);
  const [eq_status_manager_data, setEQ_STATUS_MANAGER_DATA] = useState<EQ_STT[]>([]);
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
    {
      field: "EQ_ACTIVE", headerName: "EQ_ACTIVE", width: 80, cellStyle: (params: any) => {
        if (params.data.EQ_ACTIVE === 'OK') {
          return { backgroundColor: '#77da41', color: 'black' };
        }
        else if (params.data.EQ_ACTIVE === 'NG') {
          return { backgroundColor: '#ff0000', color: 'white' };
        }
      }
    },
    
    { field: "EQ_OP", headerName: "EQ_OP", width: 80 },
    { field: "EQ_STATUS", headerName: "EQ_STATUS", width: 80 },
    { field: "CURR_PLAN_ID", headerName: "CURR_PLAN_ID", width: 80 },
    { field: "CURR_G_CODE", headerName: "CURR_G_CODE", width: 80 },
    { field: "INS_EMPL", headerName: "INS_EMPL", width: 80 },
    { field: "INS_DATE", headerName: "INS_DATE", width: 80 },
    { field: "UPD_EMPL", headerName: "UPD_EMPL", width: 80 },
    { field: "UPD_DATE", headerName: "UPD_DATE", width: 80 },
  ]
  const eq_data_table = useMemo(() => {
    return (
      <AGTable
        suppressRowClickSelection={false}
        toolbar={
          <>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                checkBP(getUserData(), ["SX", "QLSX"], ["Leader", "Manager"], ["ALL"], async () => {
                 
                      openDialogAddMachine();
                    
                  
                })
              }}
            >
              <AiFillFileAdd color="#3741d3" size={15} />
              Add
            </IconButton>

            <IconButton
              className="buttonIcon"
              onClick={() => {
                checkBP(getUserData(), ["SX", "QLSX"], ["Leader", "Manager"], ["ALL"], async () => {
                  Swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                  }).then((result) => {
                    if (result.isConfirmed) {
                      handleDeleteMachine();
                    }
                  })
                })
              }}
            >
              <AiFillDelete color="#fb0000" size={15} />
              Delete
            </IconButton>
          </>
        }
        data={eq_status_manager_data}
        columns={column_eq_status}
        onSelectionChange={(e) => {
          
        }}  
        onRowClick={(e) => {
          console.log(e)
          selectedMachine.current = e.data;
        }}
      />
    )
  }, [eq_status_manager_data])
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
        { getUserData()?.EMPL_NO === "NHU1903" && <IconButton
          className="buttonIcon"
          onClick={
            () => {
              checkBP(getUserData(), ["SX", "QLSX"], ["Leader", "Manager"], ["ALL"], async () => {
                setEQ_STATUS_MANAGER_DATA(eq_status);
                openDialogEQManager();
              })
            }
          }
        >
          <AiOutlineSetting color="green" size={15} />
          EQ Manager
        </IconButton>}
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
        <div className="eq_manager" >
          <div className="eq_manager_title">
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
      <CustomDialog
        isOpen={showAddMachineDialog}
        onClose={closeDialogAddMachine}
        title="Add machine"
        content={<div>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label htmlFor="factory" style={{ marginBottom: '5px' }}>Factory:</label>
              <select
                id="factory"
                name="factory"
                value={factory}
                onChange={(e) => setFactory(e.target.value)}
                style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="NM1">NM1</option>
                <option value="NM2">NM2</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label htmlFor="eq_code" style={{ marginBottom: '5px' }}>EQ Code:</label>
              <input
                type="text"
                id="eq_code"
                name="eq_code"
                value={eqCode}
                onChange={(e) => setEqCode(e.target.value)}
                style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label htmlFor="eq_name" style={{ marginBottom: '5px' }}>EQ Name:</label>
              <input
                type="text"
                id="eq_name"
                name="eq_name"
                value={eqName}
                onChange={(e) => setEqName(e.target.value)}
                style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label htmlFor="eq_op" style={{ marginBottom: '5px' }}>EQ OP:</label>
              <input
                type="text"
                id="eq_op"
                name="eq_op"
                value={eqOp}
                onChange={(e) => setEqOp(parseInt(e.target.value))}
                style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label htmlFor="eq_active" style={{ marginBottom: '5px' }}>EQ Active:</label>
              <select
                id="eq_active"
                name="eq_active"
                value={eqActive}
                onChange={(e) => setEqActive(e.target.value)}
                style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="OK">OK</option>
                <option value="NG">NG</option>
              </select>
            </div>
          </form>
        </div>}
        actions={<>
          <IconButton
            className="buttonIcon"
            onClick={()=> {
              Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',    
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, add it!'
              }).then((result) => {
                if (result.isConfirmed) {
                  handleAddMachine();
                  closeDialogAddMachine();
                }
              })
            }}
          >
            <AiFillPlusCircle color="green" size={15} />
            Add Machine
          </IconButton>
        </>}
      />
    </div>
  );
};
export default EQ_STATUS2;

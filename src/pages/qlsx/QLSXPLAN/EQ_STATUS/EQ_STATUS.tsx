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
  import { generalQuery } from "../../../../api/Api";
  import moment from "moment";
  import { UserContext } from "../../../../api/Context";
import MACHINE_COMPONENT2 from "../Machine/MACHINE_COMPONENT2";
import EQ_SUMMARY from "./EQ_SUMMARY";
  interface EQ_STT {
    FACTORY: string,
    EQ_NAME: string, 
    EQ_ACTIVE: string,
    REMARK: string,
    EQ_STATUS: string, 
    CURR_PLAN_ID: string,
    CURR_G_CODE: string,
    INS_EMPL: string, 
    INS_DATE: string, 
    UPD_EMPL: string,
    UPD_DATE: string,
    EQ_CODE: string,
    G_NAME_KD: string,
  }
  const EQ_STATUS = () => {
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
    const [eq_status, setEQ_STATUS]=  useState<EQ_STT[]>([]);
    const handle_loadEQ_STATUS =()=> {
      generalQuery("checkEQ_STATUS", {
      })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: EQ_STT[] = response.data.data.map((element: EQ_STT, index: number)=> {
            return {
              ...element,
              id: index
            }
          })
          setEQ_STATUS(loaded_data);
        } else {     
          setEQ_STATUS([]);       
        }
      })
      .catch((error) => {
        console.log(error);
      });  
    }
    useEffect(() => {      
      handle_loadEQ_STATUS();
      let intervalID = window.setInterval(()=> { 
        handle_loadEQ_STATUS();      
      },3000);
      return (
        ()=> {
          window.clearInterval(intervalID);
        }
      )
    }, []);
    return (
      <div className='eq_status'> 
      <div className="eqlist">
      <div className="NM1">
              <span className='machine_title'>NM1</span>
              <div className='FRlist'>
                {
                  eq_status.filter((element:EQ_STT, index: number)=> element.FACTORY==='NM1').map((element: EQ_STT, index: number)=>{
                    return (<MACHINE_COMPONENT2
                    key={index}
                    factory={element.FACTORY}
                    machine_name= {element.EQ_NAME}
                    eq_status ={element.EQ_STATUS}
                    current_g_name ={element.G_NAME_KD}
                    current_plan_id ={element.CURR_PLAN_ID}
                    run_stop={element.EQ_ACTIVE==='OK'? 1:0}                    
                     onClick={()=>{
                      }}
                  />)
                  })
                }
              </div>
            </div>
            <div className="NM2">
              <span className='machine_title'>NM2</span>
              <div className='FRlist'>
                {
                  eq_status.filter((element:EQ_STT, index: number)=> element.FACTORY==='NM2').map((element: EQ_STT, index: number)=>{
                    return (<MACHINE_COMPONENT2
                    key={index}
                    factory={element.FACTORY}
                    machine_name= {element.EQ_NAME}
                    eq_status ={element.EQ_STATUS}
                    current_g_name ={element.G_NAME_KD}
                    current_plan_id ={element.CURR_PLAN_ID}
                    run_stop={element.EQ_ACTIVE==='OK'? 1:0}                    
                     onClick={()=>{
                      }}
                  />)
                  })
                }
              </div>
            </div>   

      </div>        
      <div className="eqinfo">       
        <span className="subtitle"> NM1 EQUIPMENT STATUS</span>
       <EQ_SUMMARY EQ_DATA={eq_status.filter((element:EQ_STT, index: number)=> element.FACTORY==='NM1')}/>
       <span className="subtitle"> NM2 EQUIPMENT STATUS</span>
       <EQ_SUMMARY EQ_DATA={eq_status.filter((element:EQ_STT, index: number)=> element.FACTORY==='NM2')}/>
      </div>
                           
      </div>
    );
  };
  export default EQ_STATUS;
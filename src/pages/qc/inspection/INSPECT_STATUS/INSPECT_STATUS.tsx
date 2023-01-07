import moment from "moment";
import React, { useEffect, useState } from "react";
import { generalQuery } from "../../../../api/Api";
import INSPECT_COMPONENT from "./INSPECT_COMPONENT";
import "./INSPECT_STATUS.scss";
import INS_SUMMARY from "./INS_SUMMARY";
interface INS_STATUS {
  KHUVUC: string;
  FACTORY: string;
  EQ_NAME: string;
  EMPL_COUNT: number;
  EQ_STATUS: string;
  CURR_PLAN_ID: string;
  CURR_G_CODE: string;
  REMARK: string;
  INS_EMPL: string;
  INS_DATE: string;
  UPD_EMPL: string;
  UPD_DATE: string;
  G_NAME_KD: string;
  G_NAME: string;
}

const INSPECT_STATUS = () => {
  const [ins_status_data, setIns_Status_Data] = useState<INS_STATUS[]>([]);

  const handle_getINS_STATUS = () => {
    generalQuery("getIns_Status", {})
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: INS_STATUS[] = response.data.data.map(
            (element: INS_STATUS, index: number) => {
              return {
                ...element,
                INS_DATE: moment(element.INS_DATE)
                  .utc()
                  .format("YYYY-MM-DD HH:mm:ss"),
                UPD_DATE: moment(element.UPD_DATE)
                  .utc()
                  .format("YYYY-MM-DD HH:mm:ss"),
                id: index,
              };
            }
          );
          //console.log(loaded_data);
          setIns_Status_Data(loaded_data);
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    handle_getINS_STATUS();   
    let intervalID = window.setInterval(() => {
      handle_getINS_STATUS();
      console.log('ff')
    }, 3000);
    return () => {
      window.clearInterval(intervalID);
    };
  }, []);

  return (
    <div className='ins_status'>
      <div className="ins_summary">
        <INS_SUMMARY INS_DATA={ins_status_data}/>
      </div>
      <div className="ins_div">
      <div className='NM1'>
        <div className='title'>NM1 INSPECTION STATUS</div>
        <div className='table'>
          <div className='xuongA'>
             <b>Xưởng A:</b>
            {ins_status_data
              .filter((element: INS_STATUS) => element.KHUVUC === "A")
              .map((element: INS_STATUS, index: number) => {
                return (
                  <INSPECT_COMPONENT
                    key={index}
                    INS_DATA={{
                      FACTORY: element.FACTORY,
                      EQ_NAME: element.EQ_NAME,
                      EMPL_COUNT: element.EMPL_COUNT,
                      EQ_STATUS: element.EQ_STATUS,
                      CURR_PLAN_ID: element.CURR_PLAN_ID,
                      CURR_G_CODE: element.CURR_G_CODE,
                      G_NAME: element.G_NAME,
                      G_NAME_KD: element.G_NAME_KD,
                      REMARK: element.REMARK,
                      INS_EMPL: element.INS_EMPL,
                      INS_DATE: element.INS_DATE,
                      UPD_EMPL: element.UPD_EMPL,
                      UPD_DATE: element.UPD_DATE,
                    }}
                  />
                );
              })}
          </div>
          <div className='xuongB'>
            <b>Xưởng B:</b>
            {ins_status_data
              .filter((element: INS_STATUS) => element.KHUVUC === "B")
              .map((element: INS_STATUS, index: number) => {
                return (
                  <INSPECT_COMPONENT
                    key={index}
                    INS_DATA={{
                      FACTORY: element.FACTORY,
                      EQ_NAME: element.EQ_NAME,
                      EMPL_COUNT: element.EMPL_COUNT,
                      EQ_STATUS: element.EQ_STATUS,
                      CURR_PLAN_ID: element.CURR_PLAN_ID,
                      CURR_G_CODE: element.CURR_G_CODE,
                      G_NAME: element.G_NAME,
                      G_NAME_KD: element.G_NAME_KD,
                      REMARK: element.REMARK,
                      INS_EMPL: element.INS_EMPL,
                      INS_DATE: element.INS_DATE,
                      UPD_EMPL: element.UPD_EMPL,
                      UPD_DATE: element.UPD_DATE,
                    }}
                  />
                );
              })}
          </div>
        </div>
      </div>
      <div className='NM2'>
        <div className='title'>NM2 INSPECTION STATUS</div>
        <div className='table'>
          <div className='normal'>
            <b>Hàng Thường:</b>
            {ins_status_data
              .filter((element: INS_STATUS) => element.KHUVUC === "N")
              .map((element: INS_STATUS, index: number) => {
                return (
                  <INSPECT_COMPONENT
                    key={index}
                    INS_DATA={{
                      FACTORY: element.FACTORY,
                      EQ_NAME: element.EQ_NAME,
                      EMPL_COUNT: element.EMPL_COUNT,
                      EQ_STATUS: element.EQ_STATUS,
                      CURR_PLAN_ID: element.CURR_PLAN_ID,
                      CURR_G_CODE: element.CURR_G_CODE,
                      G_NAME: element.G_NAME,
                      G_NAME_KD: element.G_NAME_KD,
                      REMARK: element.REMARK,
                      INS_EMPL: element.INS_EMPL,
                      INS_DATE: element.INS_DATE,
                      UPD_EMPL: element.UPD_EMPL,
                      UPD_DATE: element.UPD_DATE,
                    }}
                  />
                );
              })}
          </div>
          <div className='oled'>
            <b>OLED:</b>
            {ins_status_data
              .filter((element: INS_STATUS) => element.KHUVUC === "O")
              .map((element: INS_STATUS, index: number) => {
                return (
                  <INSPECT_COMPONENT
                    key={index}
                    INS_DATA={{
                      FACTORY: element.FACTORY,
                      EQ_NAME: element.EQ_NAME,
                      EMPL_COUNT: element.EMPL_COUNT,
                      EQ_STATUS: element.EQ_STATUS,
                      CURR_PLAN_ID: element.CURR_PLAN_ID,
                      CURR_G_CODE: element.CURR_G_CODE,
                      G_NAME: element.G_NAME,
                      G_NAME_KD: element.G_NAME_KD,
                      REMARK: element.REMARK,
                      INS_EMPL: element.INS_EMPL,
                      INS_DATE: element.INS_DATE,
                      UPD_EMPL: element.UPD_EMPL,
                      UPD_DATE: element.UPD_DATE,
                    }}
                  />
                );
              })}
          </div>
          <div className='uv'>
            <b>UV:</b>
            {ins_status_data
              .filter((element: INS_STATUS) => element.KHUVUC === "U")
              .map((element: INS_STATUS, index: number) => {
                return (
                  <INSPECT_COMPONENT
                    key={index}
                    INS_DATA={{
                      FACTORY: element.FACTORY,
                      EQ_NAME: element.EQ_NAME,
                      EMPL_COUNT: element.EMPL_COUNT,
                      EQ_STATUS: element.EQ_STATUS,
                      CURR_PLAN_ID: element.CURR_PLAN_ID,
                      CURR_G_CODE: element.CURR_G_CODE,
                      G_NAME: element.G_NAME,
                      G_NAME_KD: element.G_NAME_KD,
                      REMARK: element.REMARK,
                      INS_EMPL: element.INS_EMPL,
                      INS_DATE: element.INS_DATE,
                      UPD_EMPL: element.UPD_EMPL,
                      UPD_DATE: element.UPD_DATE,
                    }}
                  />
                );
              })}
          </div>
        </div>
      </div>

      </div>
      
    </div>
  );
};

export default INSPECT_STATUS;

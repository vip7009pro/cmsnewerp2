import { MenuItem, Select, TextField } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { generalQuery } from "../../../../api/Api";
import INSPECT_COMPONENT from "./INSPECT_COMPONENT";
import "./INSPECT_STATUS.scss";
import INS_SUMMARY from "./INS_SUMMARY";
import INS_SUMMARY2 from "./INS_SUMMARY2";
import {
  INS_STATUS,
  InSpectionSummaryData,
} from "../../../../api/GlobalInterface";

const INSPECT_STATUS = () => {
  const [searchString, setSearchString] = useState("");
  const [selectedFactory, setSelectedFactory] = useState(0);
  const [ins_status_data, setIns_Status_Data] = useState<INS_STATUS[]>([]);
  const [inspectionsummary, setInspectionSummary] =
    useState<InSpectionSummaryData>({
      totalSheetA: 0,
      totalRollB: 0,
      totalNormal: 0,
      totalOLED: 0,
      totalUV: 0,
    });

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
            },
          );
          //console.log(loaded_data);
          let tem_summary_data: InSpectionSummaryData = {
            totalSheetA: 0,
            totalRollB: 0,
            totalNormal: 0,
            totalOLED: 0,
            totalUV: 0,
          };

          for (let i = 0; i < loaded_data.length; i++) {
            tem_summary_data.totalSheetA +=
              loaded_data[i].KHUVUC === "A" ? loaded_data[i].EMPL_COUNT : 0;
            tem_summary_data.totalRollB +=
              loaded_data[i].KHUVUC === "B" ? loaded_data[i].EMPL_COUNT : 0;
            tem_summary_data.totalNormal +=
              loaded_data[i].KHUVUC === "N" ? loaded_data[i].EMPL_COUNT : 0;
            tem_summary_data.totalOLED +=
              loaded_data[i].KHUVUC === "O" ? loaded_data[i].EMPL_COUNT : 0;
            tem_summary_data.totalUV +=
              loaded_data[i].KHUVUC === "U" ? loaded_data[i].EMPL_COUNT : 0;
          }
          setInspectionSummary(tem_summary_data);
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
      //console.log('ff')
    }, 3000);
    return () => {
      window.clearInterval(intervalID);
    };
  }, []);

  return (
    <div className="ins_status">
      <div className="ins_summary">
        <div className="selectform">
          <div className="label">Select Factory</div>
          <Select
            value={selectedFactory}
            label="Select Factory"
            onChange={(e) => {
              setSelectedFactory(Number(e.target.value));
            }}
            style={{ width: "200px", height: "40px" }}
            placeholder="Chọn nhà máy"
          >
            <MenuItem value={0}>ALL</MenuItem>
            <MenuItem value={1}>NM1</MenuItem>
            <MenuItem value={2}>NM2</MenuItem>
          </Select>
          <TextField
            placeholder="Search Code"
            value={searchString}
            onChange={(e) => {
              setSearchString(e.target.value);
            }}
          />
        </div>
        {/* <INS_SUMMARY INS_DATA={ins_status_data}/>
        <INS_SUMMARY INS_DATA={ins_status_data}/> */}
      </div>
      <div className="ins_div">
        {(selectedFactory === 0 || selectedFactory === 1) && (
          <div className="NM1">
            <div className="title">
              NM1 INSPECTION STATUS (
              {inspectionsummary.totalSheetA + inspectionsummary.totalRollB}{" "}
              người)
            </div>
            <div className="table">
              <div className="xuongA">
                <div className="subtitle">
                  <b>
                    Xưởng A: ({inspectionsummary.totalSheetA} người đang kiểm
                    tra)
                  </b>
                </div>
                <div className="submachine">
                  {ins_status_data
                    .filter((element: INS_STATUS) => element.KHUVUC === "A")
                    .map((element: INS_STATUS, index: number) => {
                      return (
                        <INSPECT_COMPONENT
                          key={index}
                          INS_DATA={{
                            SEARCH_STRING: searchString,
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
                            KHUVUC: element.KHUVUC,
                          }}
                        />
                      );
                    })}
                </div>
              </div>
              <div className="xuongB">
                <div className="subtitle">
                  <b>
                    Xưởng B: ({inspectionsummary.totalRollB} người đang kiểm
                    tra)
                  </b>
                </div>
                <div className="submachine">
                  {ins_status_data
                    .filter((element: INS_STATUS) => element.KHUVUC === "B")
                    .map((element: INS_STATUS, index: number) => {
                      return (
                        <INSPECT_COMPONENT
                          key={index}
                          INS_DATA={{
                            SEARCH_STRING: searchString,
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
                            KHUVUC: element.KHUVUC,
                          }}
                        />
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        )}
        {(selectedFactory === 0 || selectedFactory === 2) && (
          <div className="NM2">
            <div className="title">
              NM2 INSPECTION STATUS (
              {inspectionsummary.totalNormal +
                inspectionsummary.totalOLED +
                inspectionsummary.totalUV}{" "}
              người)
            </div>
            <div className="table">
              <div className="normal">
                <div className="subtitle">
                  <b>
                    Hàng Thường: ({inspectionsummary.totalNormal} người đang
                    kiểm tra)
                  </b>
                </div>
                <div className="submachine">
                  {ins_status_data
                    .filter((element: INS_STATUS) => element.KHUVUC === "N")
                    .map((element: INS_STATUS, index: number) => {
                      return (
                        <INSPECT_COMPONENT
                          key={index}
                          INS_DATA={{
                            SEARCH_STRING: searchString,
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
                            KHUVUC: element.KHUVUC,
                          }}
                        />
                      );
                    })}
                </div>
              </div>
              <div className="oled">
                <div className="subtitle">
                  <b>
                    OLED: ({inspectionsummary.totalOLED} người đang kiểm tra)
                  </b>
                </div>
                <div className="submachine">
                  {ins_status_data
                    .filter((element: INS_STATUS) => element.KHUVUC === "O")
                    .map((element: INS_STATUS, index: number) => {
                      return (
                        <INSPECT_COMPONENT
                          key={index}
                          INS_DATA={{
                            SEARCH_STRING: searchString,
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
                            KHUVUC: element.KHUVUC,
                          }}
                        />
                      );
                    })}
                </div>
              </div>
              <div className="uv">
                <div className="subtitle">
                  <b>UV: ({inspectionsummary.totalUV} người đang kiểm tra)</b>
                </div>
                <div className="submachine">
                  {ins_status_data
                    .filter((element: INS_STATUS) => element.KHUVUC === "U")
                    .map((element: INS_STATUS, index: number) => {
                      return (
                        <INSPECT_COMPONENT
                          key={index}
                          INS_DATA={{
                            SEARCH_STRING: searchString,
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
                            KHUVUC: element.KHUVUC,
                          }}
                        />
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default INSPECT_STATUS;

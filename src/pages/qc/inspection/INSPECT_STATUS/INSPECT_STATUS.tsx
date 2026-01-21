import { MenuItem, Select, TextField } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { generalQuery } from "../../../../api/Api";
import INSPECT_COMPONENT from "./INSPECT_COMPONENT";
import "./INSPECT_STATUS.scss";
import {
  INS_STATUS,
  InSpectionSummaryData,
} from "../../interfaces/qcInterface";

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
      <div className="ins_header">
        <div className="ins_header__left">
          <div className="ins_header__title">Inspection Status</div>
          <div className="ins_header__subtitle">Realtime overview (auto refresh 3s)</div>
        </div>
        <div className="ins_header__right">
          <Select
            value={selectedFactory}
            onChange={(e) => {
              setSelectedFactory(Number(e.target.value));
            }}
            size="small"
          >
            <MenuItem value={0}>ALL</MenuItem>
            <MenuItem value={1}>NM1</MenuItem>
            <MenuItem value={2}>NM2</MenuItem>
          </Select>
          <TextField
            size="small"
            label="Search"
            value={searchString}
            onChange={(e) => {
              setSearchString(e.target.value);
            }}
          />
        </div>
      </div>

      <div className="ins_kpis">
        <div className="ins_kpi ins_kpi--blue">
          <div className="ins_kpi__label">NM1 (A+B)</div>
          <div className="ins_kpi__value">
            {inspectionsummary.totalSheetA + inspectionsummary.totalRollB}
          </div>
        </div>
        <div className="ins_kpi ins_kpi--teal">
          <div className="ins_kpi__label">Xưởng A</div>
          <div className="ins_kpi__value">{inspectionsummary.totalSheetA}</div>
        </div>
        <div className="ins_kpi ins_kpi--cyan">
          <div className="ins_kpi__label">Xưởng B</div>
          <div className="ins_kpi__value">{inspectionsummary.totalRollB}</div>
        </div>
        <div className="ins_kpi ins_kpi--amber">
          <div className="ins_kpi__label">NM2 (N+O+U)</div>
          <div className="ins_kpi__value">
            {inspectionsummary.totalNormal +
              inspectionsummary.totalOLED +
              inspectionsummary.totalUV}
          </div>
        </div>
        <div className="ins_kpi ins_kpi--purple">
          <div className="ins_kpi__label">OLED</div>
          <div className="ins_kpi__value">{inspectionsummary.totalOLED}</div>
        </div>
        <div className="ins_kpi ins_kpi--green">
          <div className="ins_kpi__label">UV</div>
          <div className="ins_kpi__value">{inspectionsummary.totalUV}</div>
        </div>
      </div>

      <div className="ins_content">
        {(selectedFactory === 0 || selectedFactory === 1) && (
          <section className="ins_panel">
            <div className="ins_panel__header">
              <div className="ins_panel__title">NM1</div>
              <div className="ins_panel__meta">
                {inspectionsummary.totalSheetA + inspectionsummary.totalRollB} người
              </div>
            </div>
            <div className="ins_panel__body ins_panel__body--grid2">
              <div className="ins_area">
                <div className="ins_area__header">
                  <span className="ins_area__name">Xưởng A</span>
                  <span className="ins_area__count">{inspectionsummary.totalSheetA} người</span>
                </div>
                <div className="ins_area__grid">
                  {ins_status_data
                    .filter((element: INS_STATUS) => element.KHUVUC === "A")
                    .map((element: INS_STATUS, index: number) => {
                      return (
                        <INSPECT_COMPONENT
                          key={element.EQ_NAME ?? index}
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
              <div className="ins_area">
                <div className="ins_area__header">
                  <span className="ins_area__name">Xưởng B</span>
                  <span className="ins_area__count">{inspectionsummary.totalRollB} người</span>
                </div>
                <div className="ins_area__grid">
                  {ins_status_data
                    .filter((element: INS_STATUS) => element.KHUVUC === "B")
                    .map((element: INS_STATUS, index: number) => {
                      return (
                        <INSPECT_COMPONENT
                          key={element.EQ_NAME ?? index}
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
          </section>
        )}

        {(selectedFactory === 0 || selectedFactory === 2) && (
          <section className="ins_panel">
            <div className="ins_panel__header">
              <div className="ins_panel__title">NM2</div>
              <div className="ins_panel__meta">
                {inspectionsummary.totalNormal +
                  inspectionsummary.totalOLED +
                  inspectionsummary.totalUV} người
              </div>
            </div>
            <div className="ins_panel__body">
              <div className="ins_area">
                <div className="ins_area__header">
                  <span className="ins_area__name">Hàng Thường</span>
                  <span className="ins_area__count">{inspectionsummary.totalNormal} người</span>
                </div>
                <div className="ins_area__grid">
                  {ins_status_data
                    .filter((element: INS_STATUS) => element.KHUVUC === "N")
                    .map((element: INS_STATUS, index: number) => {
                      return (
                        <INSPECT_COMPONENT
                          key={element.EQ_NAME ?? index}
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

              <div className="ins_area">
                <div className="ins_area__header">
                  <span className="ins_area__name">OLED</span>
                  <span className="ins_area__count">{inspectionsummary.totalOLED} người</span>
                </div>
                <div className="ins_area__grid">
                  {ins_status_data
                    .filter((element: INS_STATUS) => element.KHUVUC === "O")
                    .map((element: INS_STATUS, index: number) => {
                      return (
                        <INSPECT_COMPONENT
                          key={element.EQ_NAME ?? index}
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

              <div className="ins_area">
                <div className="ins_area__header">
                  <span className="ins_area__name">UV</span>
                  <span className="ins_area__count">{inspectionsummary.totalUV} người</span>
                </div>
                <div className="ins_area__grid">
                  {ins_status_data
                    .filter((element: INS_STATUS) => element.KHUVUC === "U")
                    .map((element: INS_STATUS, index: number) => {
                      return (
                        <INSPECT_COMPONENT
                          key={element.EQ_NAME ?? index}
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
          </section>
        )}
      </div>
    </div>
  );
};

export default INSPECT_STATUS;

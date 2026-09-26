import React from "react";
import MACHINE_COMPONENT3 from "../../Machine/MACHINE_COMPONENT3";
import EQ_SUMMARY from "../EQ_SUMMARY";
import { EQ_STT } from "../../interfaces/khsxInterface";

interface PrecisionEqStatus2DesktopPanelProps {
  factoryCode: string;
  eq_status: EQ_STT[];
  eq_series: string[];
  searchString: string;
  onToggleStatus: (eqCode: string, active: string) => void;
}

export const PrecisionEqStatus2DesktopPanel: React.FC<
  PrecisionEqStatus2DesktopPanelProps
> = React.memo(({
  factoryCode,
  eq_status,
  eq_series,
  searchString,
  onToggleStatus,
}) => {
  const eqDataByFactory = eq_status.filter(
    (element: EQ_STT) => element.FACTORY === factoryCode
  );

  return (
    <section className="eqs_panel">
      <div className="eqs_panel__header">
        <div className="eqs_panel__title">
          <span className="eqs_panel__factory">{factoryCode}</span>
          <span className="eqs_panel__count">{eqDataByFactory.length} machines</span>
        </div>
        <div className="eqs_panel__summary">
          <EQ_SUMMARY EQ_DATA={eqDataByFactory} />
        </div>
      </div>

      <div className="eqs_panel__body">
        {eq_series.map((ele_series: string, index: number) => {
          const seriesMachines = eq_status.filter(
            (element: EQ_STT) =>
              element.FACTORY === factoryCode &&
              element?.EQ_NAME?.substring(0, 2) === ele_series
          );
          if (seriesMachines.length === 0) return null;

          const runningCount = seriesMachines.filter(
            (m) => m.EQ_STATUS === "MASS"
          ).length;
          const settingCount = seriesMachines.filter(
            (m) => m.EQ_STATUS === "SETTING"
          ).length;
          const stopCount = seriesMachines.filter(
            (m) => m.EQ_STATUS === "STOP"
          ).length;

          return (
            <div className="eqs_series" key={factoryCode + ele_series + index}>
              <div className="eqs_series__header">
                <div className="eqs_series__name">{ele_series}</div>
                <div className="eqs_series__meta">
                  <span className="eqs_badge eqs_badge--success">RUN {runningCount}</span>
                  <span className="eqs_badge eqs_badge--warning">SET {settingCount}</span>
                  <span className="eqs_badge eqs_badge--danger">STOP {stopCount}</span>
                </div>
              </div>
              <div className="eqs_series__grid">
                {seriesMachines.map((element: EQ_STT, idx: number) => (
                  <MACHINE_COMPONENT3
                    search_string={searchString}
                    key={element.EQ_CODE ?? idx}
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
                    onClick={() => {}}
                    onMouseEnter={() => {}}
                    onMouseLeave={() => {}}
                    onDoubleClick={(e: any) => {
                      onToggleStatus(e.eq_code ?? "", e.eq_active === "OK" ? "NG" : "OK");
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
});

export default PrecisionEqStatus2DesktopPanel;

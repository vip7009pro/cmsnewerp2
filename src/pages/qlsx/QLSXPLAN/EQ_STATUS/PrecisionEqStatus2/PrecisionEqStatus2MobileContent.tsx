import React from "react";
import MACHINE_COMPONENT3 from "../../Machine/MACHINE_COMPONENT3";
import { EQ_STT } from "../../interfaces/khsxInterface";

interface PrecisionEqStatus2MobileContentProps {
  filteredMobileMachines: EQ_STT[];
  mobileVisibleFactories: string[];
  eq_series: string[];
  searchString: string;
  onToggleStatus: (eqCode: string, active: string) => void;
}

export const PrecisionEqStatus2MobileContent: React.FC<
  PrecisionEqStatus2MobileContentProps
> = React.memo(({
  filteredMobileMachines,
  mobileVisibleFactories,
  eq_series,
  searchString,
  onToggleStatus,
}) => {
  if (filteredMobileMachines.length === 0) {
    return <div className="eqs2_no_data">Không tìm thấy thiết bị phù hợp với bộ lọc</div>;
  }

  return (
    <div className="eqs2_mobile_content">
      {mobileVisibleFactories.map((facCode) => {
        const facMachines = filteredMobileMachines.filter((m) => m.FACTORY === facCode);
        if (facMachines.length === 0) return null;

        return (
          <div key={facCode} className="eqs2_mobile_factory_group">
            {eq_series.map((ser) => {
              const serMachines = facMachines.filter((m) => m.EQ_NAME?.substring(0, 2) === ser);
              if (serMachines.length === 0) return null;

              const runCount = serMachines.filter((m) => m.EQ_STATUS === "MASS").length;
              const setCount = serMachines.filter((m) => m.EQ_STATUS === "SETTING").length;
              const stopCount = serMachines.filter((m) => m.EQ_STATUS === "STOP").length;

              return (
                <div key={facCode + "_" + ser} className="eqs2_mobile_section">
                  <div className="eqs2_mobile_section__header">
                    <div className="sec-title">
                      <span className="sec-tag">{facCode}</span>
                      <span>Dòng {ser}</span>
                    </div>
                    <div className="sec-badges">
                      <span className="eqs_badge eqs_badge--success">R {runCount}</span>
                      <span className="eqs_badge eqs_badge--warning">S {setCount}</span>
                      <span className="eqs_badge eqs_badge--danger">D {stopCount}</span>
                    </div>
                  </div>
                  <div className="eqs2_mobile_section__grid">
                    {serMachines.map((m, idx) => (
                      <MACHINE_COMPONENT3
                        key={m.EQ_CODE ?? idx}
                        search_string={searchString}
                        factory={m.FACTORY}
                        machine_name={m.EQ_NAME}
                        eq_status={m.EQ_STATUS}
                        current_g_name={m.G_NAME_KD}
                        current_plan_id={m.CURR_PLAN_ID}
                        current_step={m.STEP}
                        run_stop={m.EQ_ACTIVE === "OK" ? 1 : 0}
                        upd_time={m.UPD_DATE}
                        upd_empl={m.UPD_EMPL}
                        machine_data={m}
                        eq_active={m.EQ_ACTIVE}
                        eq_code={m.EQ_CODE}
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
        );
      })}
    </div>
  );
});

export default PrecisionEqStatus2MobileContent;

import React from "react";
import MACHINE_COMPONENT from "./MACHINE_COMPONENT";
import "./MACHINE.scss";

const MACHINE2 = () => {
  return (
    <div className="machineplan">
      <span className="machine_title">FR</span>
      <div className="FRlist">
        <MACHINE_COMPONENT factory="NM2" machine_name="FR1" run_stop={1} />
        <MACHINE_COMPONENT factory="NM2" machine_name="FR2" />
        <MACHINE_COMPONENT factory="NM2" machine_name="FR3" />
        <MACHINE_COMPONENT factory="NM2" machine_name="FR4" run_stop={1} />
      </div>
      <span className="machine_title">ED</span>
      <div className="EDlist">
        <MACHINE_COMPONENT factory="NM2" machine_name="ED1" run_stop={1} />
        <MACHINE_COMPONENT factory="NM2" machine_name="ED2" run_stop={1} />
        <MACHINE_COMPONENT factory="NM2" machine_name="ED3" run_stop={1} />
        <MACHINE_COMPONENT factory="NM2" machine_name="ED4" run_stop={1} />
        <MACHINE_COMPONENT factory="NM2" machine_name="ED5" run_stop={1} />
        <MACHINE_COMPONENT factory="NM2" machine_name="ED6" run_stop={1} />
        <MACHINE_COMPONENT factory="NM2" machine_name="ED7" run_stop={1} />
        <MACHINE_COMPONENT factory="NM2" machine_name="ED8" run_stop={1} />
        <MACHINE_COMPONENT factory="NM2" machine_name="ED9" run_stop={1} />
        <MACHINE_COMPONENT factory="NM2" machine_name="ED10" run_stop={1} />
        <MACHINE_COMPONENT factory="NM2" machine_name="ED11" />
        <MACHINE_COMPONENT factory="NM2" machine_name="ED12" />
        <MACHINE_COMPONENT factory="NM2" machine_name="ED13" />
        <MACHINE_COMPONENT factory="NM2" machine_name="ED14" run_stop={1} />
        <MACHINE_COMPONENT factory="NM2" machine_name="ED15" run_stop={1} />
        <MACHINE_COMPONENT factory="NM2" machine_name="ED16" run_stop={1} />
        <MACHINE_COMPONENT factory="NM2" machine_name="ED17" run_stop={1} />
        <MACHINE_COMPONENT factory="NM2" machine_name="ED18" run_stop={1} />
        <MACHINE_COMPONENT factory="NM2" machine_name="ED19" run_stop={1} />
        <MACHINE_COMPONENT factory="NM2" machine_name="ED20" run_stop={1} />
        <MACHINE_COMPONENT factory="NM2" machine_name="ED21" run_stop={1} />
        <MACHINE_COMPONENT factory="NM2" machine_name="ED22" run_stop={1} />
        <MACHINE_COMPONENT factory="NM2" machine_name="ED23" run_stop={1} />
        <MACHINE_COMPONENT factory="NM2" machine_name="ED24" run_stop={1} />
        <MACHINE_COMPONENT factory="NM2" machine_name="ED25" />
        <MACHINE_COMPONENT factory="NM2" machine_name="ED26" />
        <MACHINE_COMPONENT factory="NM2" machine_name="ED27" />
        <MACHINE_COMPONENT factory="NM2" machine_name="ED28" />
        <MACHINE_COMPONENT factory="NM2" machine_name="ED29" />
        <MACHINE_COMPONENT factory="NM2" machine_name="ED30" />
        <MACHINE_COMPONENT factory="NM2" machine_name="ED31" run_stop={1} />
        <MACHINE_COMPONENT factory="NM2" machine_name="ED32" run_stop={1} />
        <MACHINE_COMPONENT factory="NM2" machine_name="ED33" run_stop={1} />
        <MACHINE_COMPONENT factory="NM2" machine_name="ED34" run_stop={1} />
        <MACHINE_COMPONENT factory="NM2" machine_name="ED35" run_stop={1} />
      </div>
    </div>
  );
};

export default MACHINE2;

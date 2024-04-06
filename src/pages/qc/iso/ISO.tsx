import { useEffect, useState } from "react";
import "./ISO.scss";
import RNR from "./RNR/RNR";
import AUDIT from "./AUDIT/AUDIT";
const ISO = () => {
  const [selection, setSelection] = useState<any>({
    tab1: true,
    tab2: false,
    tab3: false,
  });
  const setNav = (choose: number) => {
    if (choose === 1) {
      setSelection({
        ...selection,
        tab1: true,
        tab2: false,
        tab3: false,
        tab4: false,
        tab5: false,
      });
    } else if (choose === 2) {
      setSelection({
        ...selection,
        tab1: false,
        tab2: true,
        tab3: false,
        tab4: false,
        tab5: false,
      });
    } else if (choose === 3) {
      setSelection({
        ...selection,
        tab1: false,
        tab2: false,
        tab3: true,
        tab4: false,
        tab5: false,
      });
    } else if (choose === 4) {
      setSelection({
        ...selection,
        tab1: false,
        tab2: false,
        tab3: false,
        tab4: true,
        tab5: false,
      });
    } else if (choose === 5) {
      setSelection({
        ...selection,
        tab1: false,
        tab2: false,
        tab3: false,
        tab4: false,
        tab5: true,
      });
    }
  };
  useEffect(() => { }, []);
  return (
    <div className="iso">
      <div className="mininavbar">
        <div
          className="mininavitem"
          onClick={() => setNav(1)}
          style={{
            backgroundColor: selection.tab1 === true ? "#02c712" : "#abc9ae",
            color: selection.tab1 === true ? "yellow" : "yellow",
          }}
        >
          <span className="mininavtext">EMPL G_RNR</span>
        </div>
        <div
          className="mininavitem"
          onClick={() => setNav(2)}
          style={{
            backgroundColor: selection.tab2 === true ? "#02c712" : "#abc9ae",
            color: selection.tab2 === true ? "yellow" : "yellow",
          }}
        >
          <span className="mininavtext">SELF AUDIT</span>
        </div>        
      </div>
      {selection.tab1 && (
        <div className="rnr">
          <RNR />
        </div>
      )}
      {selection.tab2 && (
        <div className="qpa">
          <AUDIT />
        </div>
      )}     
    </div>
  );
};
export default ISO;

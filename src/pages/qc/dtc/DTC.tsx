import { Profiler, useEffect, useState } from "react";
import "./DTC.scss";
import DKDTC from "./DKDTC";
import KQDTC from "./KQDTC";
import SPECDTC from "./SPECDTC";
import ADDSPECDTC from "./ADDSPECDTC";
import DTCRESULT from "./DTCRESULT";

const DTC = () => {
  const [selection, setSelection] = useState<any>({
    tab1: true,
    tab2: false,
    tab3: false,
    tab4: false,
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

  useEffect(() => {}, []);

  return (
    <div className="dtc">
      <div className="mininavbar">
        <div
          className="mininavitem"
          onClick={() => setNav(1)}
          style={{
            backgroundColor: selection.tab1 === true ? "#02c712" : "#abc9ae",
            color: selection.tab1 === true ? "yellow" : "yellow",
          }}
        >
          <span className="mininavtext">TRA KQ ĐTC</span>
        </div>
        <div
          className="mininavitem"
          onClick={() => setNav(2)}
          style={{
            backgroundColor: selection.tab2 === true ? "#02c712" : "#abc9ae",
            color: selection.tab2 === true ? "yellow" : "yellow",
          }}
        >
          <span className="mininavtext">TRA SPEC ĐTC</span>
        </div>
        <div
          className="mininavitem"
          onClick={() => setNav(3)}
          style={{
            backgroundColor: selection.tab3 === true ? "#02c712" : "#abc9ae",
            color: selection.tab3 === true ? "yellow" : "yellow",
          }}
        >
          <span className="mininavtext">ADD SPEC ĐTC</span>
        </div>
        <div
          className="mininavitem"
          onClick={() => setNav(4)}
          style={{
            backgroundColor: selection.tab4 === true ? "#02c712" : "#abc9ae",
            color: selection.tab4 === true ? "yellow" : "yellow",
          }}
        >
          <span className="mininavtext">ĐKÝ TEST ĐTC</span>
        </div>
        <div
          className="mininavitem"
          onClick={() => setNav(5)}
          style={{
            backgroundColor: selection.tab5 === true ? "#02c712" : "#abc9ae",
            color: selection.tab5 === true ? "yellow" : "yellow",
          }}
        >
          <span className="mininavtext">NHẬP KQ ĐTC</span>
        </div>
      </div>
      {selection.tab1 && (
        <div className="trainspection">
          <KQDTC />
        </div>
      )}
      {selection.tab2 && (
        <div className="trainspection">
          <SPECDTC />
        </div>
      )}
      {selection.tab3 && (
        <div className="trainspection">
          <ADDSPECDTC />
        </div>
      )}
      {selection.tab4 && (
        <div className="trainspection">
          <DKDTC />
        </div>
      )}
      {selection.tab5 && (
        <div className="trainspection">
          <DTCRESULT />
        </div>
      )}
    </div>
  );
};
export default DTC;

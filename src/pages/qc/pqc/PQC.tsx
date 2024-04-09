import { useEffect, useState } from "react";
import INPUTPQC from "./INPUTPQC";
import TRAPQC from "./TRAPQC";
import "./PQC.scss";
import CODE_MANAGER from "../../rnd/code_manager/CODE_MANAGER";
import PQC1 from "./PQC1";
import PQC3 from "./PQC3";
import LINEQC from "./LINEQC";
import PATROL from "../../sx/PATROL/PATROL";
import PQC_REPORT from "./PQC_REPORT";
import QLGN from "../../rnd/quanlygiaonhandaofilm/QLGN";

const PQC = () => {
  const [selection, setSelection] = useState<any>({
    tab1: true,
    tab2: false,
    tab3: false,
    tab4: false,
    tab5: false,
    tab6: false,
    tab7: false,
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
        tab6: false,
        tab7: false,
      });
    } else if (choose === 2) {
      setSelection({
        ...selection,
        tab1: false,
        tab2: true,
        tab3: false,
        tab4: false,
        tab5: false,
        tab6: false,
        tab7: false,
      });
    } else if (choose === 3) {
      setSelection({
        ...selection,
        tab1: false,
        tab2: false,
        tab3: true,
        tab4: false,
        tab5: false,
        tab6: false,
        tab7: false,
      });
    } else if (choose === 4) {
      setSelection({
        ...selection,
        tab1: false,
        tab2: false,
        tab3: false,
        tab4: true,
        tab5: false,
        tab6: false,
        tab7: false,
      });
    } else if (choose === 5) {
      setSelection({
        ...selection,
        tab1: false,
        tab2: false,
        tab3: false,
        tab4: false,
        tab5: true,
        tab6: false,
        tab7: false,
      });
    } else if (choose === 6) {
      setSelection({
        ...selection,
        tab1: false,
        tab2: false,
        tab3: false,
        tab4: false,
        tab5: false,
        tab6: true,
        tab7: false,
      });
    } else if (choose === 7) {
      setSelection({
        ...selection,
        tab1: false,
        tab2: false,
        tab3: false,
        tab4: false,
        tab5: false,
        tab6: false,
        tab7: true,
      });
    }
  };
  useEffect(() => { }, []);
  return (
    <div className="pqc">
      <div className="mininavbar">
        <div
          className="mininavitem"
          onClick={() => setNav(1)}
          style={{
            backgroundColor: selection.tab1 === true ? "#02c712" : "#abc9ae",
            color: selection.tab1 === true ? "yellow" : "yellow",
          }}
        >
          <span className="mininavtext">LINEQC</span>
        </div>
        <div
          className="mininavitem"
          onClick={() => setNav(2)}
          style={{
            backgroundColor: selection.tab2 === true ? "#02c712" : "#abc9ae",
            color: selection.tab2 === true ? "yellow" : "yellow",
          }}
        >
          <span className="mininavtext">DATA PQC</span>
        </div>
        <div
          className="mininavitem"
          onClick={() => setNav(3)}
          style={{
            backgroundColor: selection.tab3 === true ? "#02c712" : "#abc9ae",
            color: selection.tab3 === true ? "yellow" : "yellow",
          }}
        >
          <span className="mininavtext">PQC1-SETTING</span>
        </div>
        <div
          className="mininavitem"
          onClick={() => setNav(4)}
          style={{
            backgroundColor: selection.tab4 === true ? "#02c712" : "#abc9ae",
            color: selection.tab4 === true ? "yellow" : "yellow",
          }}
        >
          <span className="mininavtext">PQC3-DEFECT</span>
        </div>
        <div
          className="mininavitem"
          onClick={() => setNav(5)}
          style={{
            backgroundColor: selection.tab5 === true ? "#02c712" : "#abc9ae",
            color: selection.tab5 === true ? "yellow" : "yellow",
          }}
        >
          <span className="mininavtext">PATROL</span>
        </div>
        <div
          className="mininavitem"
          onClick={() => setNav(7)}
          style={{
            backgroundColor: selection.tab7 === true ? "#02c712" : "#abc9ae",
            color: selection.tab7 === true ? "yellow" : "yellow",
          }}
        >
          <span className="mininavtext">Giao Nhận Dao Film</span>
        </div>
        <div
          className="mininavitem"
          onClick={() => setNav(6)}
          style={{
            backgroundColor: selection.tab6 === true ? "#02c712" : "#abc9ae",
            color: selection.tab6 === true ? "yellow" : "yellow",
          }}
        >
          <span className="mininavtext">Báo Cáo</span>
        </div>

      </div>
      {selection.tab1 && (
        <div className="trapqc">
          <LINEQC />
        </div>
      )}
      {selection.tab2 && (
        <div className="trapqc">
          <TRAPQC />
        </div>
      )}
      {selection.tab3 && (
        <div className="trapqc">
          <PQC1 />
        </div>
      )}
      {selection.tab4 && (
        <div className="trapqc">
          <PQC3 />
        </div>
      )}
      {selection.tab5 && (
        <div className="trapqc">
          <PATROL />
        </div>
      )}
      {selection.tab6 && (
        <div className="trapqc">
          <PQC_REPORT />
        </div>
      )}
      {selection.tab7 && (
        <div className="trapqc">
          <QLGN />
        </div>
      )}
     
      {selection.tab3 && <div className="report"></div>}
    </div>
  );
};
export default PQC;

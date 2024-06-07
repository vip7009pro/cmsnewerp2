import { useEffect, useState } from "react";
import KHOTP from "../../kho/khotp/KHOTP";
import "./OQC.scss";
import OQC_DATA from "./OQC_DATA";
import OQC_REPORT from "./OQC_REPORT";
const OQC = () => {
  const [selection, setSelection] = useState<any>({
    tab1: true,
    tab2: false,
    tab3: false,
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

  useEffect(() => {}, []);

  return (
     <div className="oqc">
      <div className="mininavbar">
        <div
          className="mininavitem"
          onClick={() => setNav(1)}
          style={{
            backgroundColor: selection.tab1 === true ? "#02c712" : "#abc9ae",
            color: selection.tab1 === true ? "yellow" : "yellow",
          }}
        >
          <span className="mininavtext">Data Kho Thành Phẩm</span>
        </div>
        <div
          className="mininavitem"
          onClick={() => setNav(2)}
          style={{
            backgroundColor: selection.tab2 === true ? "#02c712" : "#abc9ae",
            color: selection.tab2 === true ? "yellow" : "yellow",
          }}
        >
          <span className="mininavtext">Data OQC</span>
        </div>
        <div
          className="mininavitem"
          onClick={() => setNav(3)}
          style={{
            backgroundColor: selection.tab3 === true ? "#02c712" : "#abc9ae",
            color: selection.tab3 === true ? "yellow" : "yellow",
          }}
        >
          <span className="mininavtext">Báo Cáo</span>
        </div>
      </div>
      {selection.tab1 && (
        <div className="trainspection">
          <KHOTP />
        </div>
      )}
      {selection.tab2 && (
        <div className="trainspection">
          <OQC_DATA />
        </div>
      )}
      {selection.tab3 && (
        <div className="trainspection">
          <OQC_REPORT />
        </div>
      )}
    </div> 
   
  );
};
export default OQC;

 

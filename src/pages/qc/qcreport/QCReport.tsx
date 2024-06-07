import { useEffect, useState, lazy, Suspense } from "react";
import "./QCReport.scss";
import PQC_REPORT from "../pqc/PQC_REPORT";
import INSPECT_REPORT from "../inspection/INSPECT_REPORT";
import CSREPORT from "../cs/CSREPORT";
import OQC_REPORT from "../oqc/OQC_REPORT";

const QCReport = () => {
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
        tab6: false,
        tab7: false,
        tab8: false,
        tab9: false,
        tab10: false,
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
        tab8: false,
        tab9: false,
        tab10: false,
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
        tab8: false,
        tab9: false,
        tab10: false,
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
        tab8: false,
        tab9: false,
        tab10: false,
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
        tab8: false,
        tab9: false,
        tab10: false,
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
        tab8: false,
        tab9: false,
        tab10: false,
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
        tab8: false,
        tab9: false,
        tab10: false,
      });
    } else if (choose === 8) {
      setSelection({
        ...selection,
        tab1: false,
        tab2: false,
        tab3: false,
        tab4: false,
        tab5: false,
        tab6: false,
        tab7: false,
        tab8: true,
        tab9: false,
        tab10: false,
      });
    } else if (choose === 9) {
      setSelection({
        ...selection,
        tab1: false,
        tab2: false,
        tab3: false,
        tab4: false,
        tab5: false,
        tab6: false,
        tab7: false,
        tab8: false,
        tab9: true,
        tab10: false,
      });
    } else if (choose === 10) {
      setSelection({
        ...selection,
        tab1: false,
        tab2: false,
        tab3: false,
        tab4: false,
        tab5: false,
        tab6: false,
        tab7: false,
        tab8: false,
        tab9: false,
        tab10: true,
      });
    }
  };
  useEffect(() => {}, []);

  return (
    <div className="qcreport">
      <Suspense fallback={<div> Loading...</div>}>
        <div className="mininavbar">
          <div
            className="mininavitem"
            onClick={() => setNav(1)}
            style={{
              backgroundColor: selection.tab1 === true ? "#02c712" : "#abc9ae",
              color: selection.tab1 === true ? "yellow" : "yellow",
            }}
          >
            <span className="mininavtext">PQC REPORT</span>
          </div>   
          <div
            className="mininavitem"
            onClick={() => setNav(2)}
            style={{
              backgroundColor: selection.tab2 === true ? "#02c712" : "#abc9ae",
              color: selection.tab2 === true ? "yellow" : "yellow",
            }}
          >
            <span className="mininavtext">INSPECTION REPORT</span>
          </div>  
          <div
            className="mininavitem"
            onClick={() => setNav(4)}
            style={{
              backgroundColor: selection.tab4 === true ? "#02c712" : "#abc9ae",
              color: selection.tab4 === true ? "yellow" : "yellow",
            }}
          >
            <span className="mininavtext">OQC REPORT</span>
          </div>  
          <div
            className="mininavitem"
            onClick={() => setNav(3)}
            style={{
              backgroundColor: selection.tab3 === true ? "#02c712" : "#abc9ae",
              color: selection.tab3 === true ? "yellow" : "yellow",
            }}
          >
            <span className="mininavtext">CS REPORT</span>
          </div>  
         
          
          
        </div>
        {selection.tab1 && (
          <div className="traiqc">
            <PQC_REPORT/>            
          </div>
        )}
        {selection.tab2 && (
          <div className="datadtc">
            <INSPECT_REPORT/>            
          </div>
        )}
        {selection.tab3 && (
          <div className="datadtc">
            <CSREPORT/>            
          </div>
        )}
        {selection.tab4 && (
          <div className="datadtc">
            <OQC_REPORT/>            
          </div>
        )}
        {selection.tab5 && (
          <div className="datadtc">
            
          </div>
        )}
        {selection.tab6 && (
          <div className="datadtc">
            
          </div>
        )}
        {selection.tab7 && (
          <div className="datadtc">
            
          </div>
        )}
        {selection.tab8 && (
          <div className="datadtc">
            
          </div>
        )}
        {selection.tab9 && (
          <div className="datadtc">
            
          </div>
        )}       
        {selection.tab10 && (
          <div className="datadtc">
            
          </div>
        )}
      </Suspense>
    </div>
  );
};
export default QCReport;

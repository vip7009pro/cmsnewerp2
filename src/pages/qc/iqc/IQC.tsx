import { useEffect, useState } from "react";
import KHOLIEU from "../../kho/kholieu/KHOLIEU";
import KQDTC from "../dtc/KQDTC";
import "./IQC.scss";
import SPECDTC from "../dtc/SPECDTC";
import ADDSPECTDTC from "../dtc/ADDSPECDTC";
import DKDTC from "../dtc/DKDTC";
import DTC from "../dtc/DTC";
import HOLD_FAIL from "./HOLD_FAIL";

const IQC = () => {
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

  useEffect(() => {}, []);

  return (
    <div className="iqc">
      <div className="mininavbar">
        <div
          className="mininavitem"
          onClick={() => setNav(1)}
          style={{
            backgroundColor: selection.tab1 === true ? "#02c712" : "#abc9ae",
            color: selection.tab1 === true ? "yellow" : "yellow",
          }}
        >
          <span className="mininavtext">Kho Liệu</span>
        </div>
        <div
          className="mininavitem"
          onClick={() => setNav(2)}
          style={{
            backgroundColor: selection.tab2 === true ? "#02c712" : "#abc9ae",
            color: selection.tab2 === true ? "yellow" : "yellow",
          }}
        >
          <span className="mininavtext">ĐỘ TIN CẬY</span>
        </div>
        <div
          className="mininavitem"
          onClick={() => setNav(3)}
          style={{
            backgroundColor: selection.tab3 === true ? "#02c712" : "#abc9ae",
            color: selection.tab3 === true ? "yellow" : "yellow",
          }}
        >
          <span className="mininavtext">IN-HOLD-FAIL</span>
        </div>
      </div>
      {selection.tab1 && (
        <div className="traiqc">
          <KHOLIEU />
        </div>
      )}
      {selection.tab2 && (
        <div className="datadtc">
          <DTC />
        </div>
      )}
      {selection.tab3 && (
        <div className="datadtc">
          <HOLD_FAIL />
        </div>
      )}
    </div>
  );
};
export default IQC;

import { useEffect, useState } from "react";
import "./TRACUU.scss";
const TRACUU = () => {
  const [selection, setSelection] = useState<any>({
    tab1: false,
    tab2: true,
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
  useEffect(() => { }, []);
  return (
    <div className="TRACUU">
      <div className="mininavbar">
        <div className="mininavitem" onClick={() => setNav(2)}>
          <span className="mininavtext">Data TRACUU</span>
        </div>
        <div className="mininavitem" onClick={() => setNav(3)}>
          <span className="mininavtext">Report TRACUU</span>
        </div>
        <div className="mininavitem" onClick={() => setNav(1)}>
          <span className="mininavtext">Input TRACUU</span>
        </div>
      </div>
      {selection.tab2 && <div className="traTRACUU"></div>}
      {false && <div className="trapqc"></div>}
      {selection.tab3 && <div className="report"></div>}
    </div>
  );
};
export default TRACUU;

import { useEffect, useState, lazy, Suspense, useContext } from "react";
import "./BAOCAOSXALL.scss";

import LICHSUINPUTLIEU from "../qlsx/QLSXPLAN/LICHSUINPUTLIEU/LICHSUINPUTLIEU";
import DATASX2 from "../qlsx/QLSXPLAN/DATASX/DATASX2";
import LICHSUTEMLOTSX from "./LICHSUTEMLOTSX/LICHSUTEMLOTSX";
import TINHHINHCUONLIEU from "./TINH_HINH_CUON_LIEU/TINHINHCUONLIEU";
import BAOCAOTHEOROLL from "./BAOCAOTHEOROLL/BAOCAOTHEOROLL";
import ACHIVEMENTTB from "../qlsx/QLSXPLAN/ACHIVEMENTTB/ACHIVEMENTTB";
import PATROL from "./PATROL/PATROL";
import { getlang } from "../../components/String/String";
import { LangConText } from "../../api/Context";

const BAOCAOSXALL = () => {
  const [selection, setSelection] = useState<any>({
    tab1: true,
    tab2: false,
    tab3: false,
    tab4: false,
    tab5: false,
    tab6: false,
    tab7: false,
    tab8: false,
  });
  const [lang, setLang] = useContext(LangConText);
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
  useEffect(() => { }, []);
  return (
    <div className="qlsxplan">
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
            <span className="mininavtext">{getlang("nhatkysanxuat", lang)}</span>
          </div>
          <div
            className="mininavitem"
            onClick={() => setNav(2)}
            style={{
              backgroundColor: selection.tab2 === true ? "#02c712" : "#abc9ae",
              color: selection.tab2 === true ? "yellow" : "yellow",
            }}
          >
            <span className="mininavtext">{getlang("lichsuxuatlieuthat", lang)}</span>
          </div>
          <div
            className="mininavitem"
            onClick={() => setNav(3)}
            style={{
              backgroundColor: selection.tab3 === true ? "#02c712" : "#abc9ae",
              color: selection.tab3 === true ? "yellow" : "yellow",
            }}
          >
            <span className="mininavtext">{getlang("lichsutemlotsx", lang)}</span>
          </div>
          <div
            className="mininavitem"
            onClick={() => setNav(4)}
            style={{
              backgroundColor: selection.tab4 === true ? "#02c712" : "#abc9ae",
              color: selection.tab4 === true ? "yellow" : "yellow",
            }}
          >
            <span className="mininavtext">{getlang("materiallotstatus", lang)}</span>
          </div>
          <div
            className="mininavitem"
            onClick={() => setNav(5)}
            style={{
              backgroundColor: selection.tab5 === true ? "#02c712" : "#abc9ae",
              color: selection.tab5 === true ? "yellow" : "yellow",
            }}
          >
            <span className="mininavtext">{getlang("sxrolldata", lang)}</span>
          </div>
          <div
            className="mininavitem"
            onClick={() => setNav(6)}
            style={{
              backgroundColor: selection.tab6 === true ? "#02c712" : "#abc9ae",
              color: selection.tab6 === true ? "yellow" : "yellow",
            }}
          >
            <span className="mininavtext">PLAN-RESULT</span>
          </div>
          <div
            className="mininavitem"
            onClick={() => setNav(7)}
            style={{
              backgroundColor: selection.tab7 === true ? "#02c712" : "#abc9ae",
              color: selection.tab7 === true ? "yellow" : "yellow",
            }}
          >
            <span className="mininavtext">PATROL</span>
          </div>
        </div>
        {selection.tab1 && (
          <div className="traiqc">
            <DATASX2 />
          </div>
        )}
        {selection.tab2 && (
          <div className="datadtc">
            <LICHSUINPUTLIEU />
          </div>
        )}
        {selection.tab3 && (
          <div className="datadtc">
            <LICHSUTEMLOTSX />
          </div>
        )}
        {selection.tab4 && (
          <div className="datadtc">
            <TINHHINHCUONLIEU />
          </div>
        )}
        {selection.tab5 && (
          <div className="datadtc">
            <BAOCAOTHEOROLL />
          </div>
        )}
        {selection.tab6 && (
          <div className="datadtc">
            <ACHIVEMENTTB />
          </div>
        )}
        {selection.tab7 && (
          <div className="datadtc">
            <PATROL />
          </div>
        )}
      </Suspense>
    </div>
  );
};
export default BAOCAOSXALL;

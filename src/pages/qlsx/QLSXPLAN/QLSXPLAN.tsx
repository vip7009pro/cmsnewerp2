import { useEffect, useState, lazy, Suspense } from "react";
import "./QLSXPLAN.scss";
import MACHINE from "./Machine/MACHINE";
import ACHIVEMENTTB from "./ACHIVEMENTTB/ACHIVEMENTTB";
import LICHSUINPUTLIEU from "./LICHSUINPUTLIEU/LICHSUINPUTLIEU";
import QUICKPLAN from "./QUICKPLAN/QUICKPLAN";
import PLAN_DATATB from "./LICHSUCHITHITABLE/PLAN_DATATB";
import DATASX2 from "./DATASX/DATASX2";
import PLAN_STATUS from "./PLAN_STATUS/PLAN_STATUS";
import EQ_STATUS from "./EQ_STATUS/EQ_STATUS";
import EQ_STATUS2 from "./EQ_STATUS/EQ_STATUS2";
import KHOAO from "./KHOAO/KHOAO";

const QLSXPLAN = () => {
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
            <span className="mininavtext">PLAN VISUAL</span>
          </div>
          {/*  <div className='mininavitem'  onClick={() => setNav(9)} style={{backgroundColor:selection.tab9 === true ? '#02c712':'#abc9ae', color: selection.tab9 === true ? 'yellow':'yellow'}}>
          <span className='mininavtext'>
            KH-CT
          </span>
        </div>   */}
          <div
            className="mininavitem"
            onClick={() => setNav(4)}
            style={{
              backgroundColor: selection.tab4 === true ? "#02c712" : "#abc9ae",
              color: selection.tab4 === true ? "yellow" : "yellow",
            }}
          >
            <span className="mininavtext">QUICK PLAN</span>
          </div>
          {/*  <div className='mininavitem'  onClick={() => setNav(2)} style={{backgroundColor:selection.tab2 === true ? '#02c712':'#abc9ae', color: selection.tab2 === true ? 'yellow':'yellow'}}>
          <span className='mininavtext'>
            PLAN YCSX
          </span>
        </div>   */}
          <div
            className="mininavitem"
            onClick={() => setNav(5)}
            style={{
              backgroundColor: selection.tab5 === true ? "#02c712" : "#abc9ae",
              color: selection.tab5 === true ? "yellow" : "yellow",
            }}
          >
            <span className="mininavtext">PLAN TABLE</span>
          </div>
          <div
            className="mininavitem"
            onClick={() => setNav(3)}
            style={{
              backgroundColor: selection.tab3 === true ? "#02c712" : "#abc9ae",
              color: selection.tab3 === true ? "yellow" : "yellow",
            }}
          >
            <span className="mininavtext">LỊCH SỬ</span>
          </div>
          <div
            className="mininavitem"
            onClick={() => setNav(6)}
            style={{
              backgroundColor: selection.tab6 === true ? "#02c712" : "#abc9ae",
              color: selection.tab6 === true ? "yellow" : "yellow",
            }}
          >
            <span className="mininavtext">DATA SX</span>
          </div>
          <div
            className="mininavitem"
            onClick={() => setNav(7)}
            style={{
              backgroundColor: selection.tab7 === true ? "#02c712" : "#abc9ae",
              color: selection.tab7 === true ? "yellow" : "yellow",
            }}
          >
            <span className="mininavtext">PLAN STATUS</span>
          </div>
          <div
            className="mininavitem"
            onClick={() => setNav(8)}
            style={{
              backgroundColor: selection.tab8 === true ? "#02c712" : "#abc9ae",
              color: selection.tab8 === true ? "yellow" : "yellow",
            }}
          >
            <span className="mininavtext">TV SHOW</span>
          </div>
          <div
            className="mininavitem"
            onClick={() => setNav(9)}
            style={{
              backgroundColor: selection.tab9 === true ? "#02c712" : "#abc9ae",
              color: selection.tab9 === true ? "yellow" : "yellow",
            }}
          >
            <span className="mininavtext">EQ STATUS</span>
          </div>
          <div
            className="mininavitem"
            onClick={() => setNav(10)}
            style={{
              backgroundColor: selection.tab10 === true ? "#02c712" : "#abc9ae",
              color: selection.tab10 === true ? "yellow" : "yellow",
            }}
          >
            <span className="mininavtext">KHO ẢO</span>
          </div>
          <div
            className="mininavitem"
            onClick={() => setNav(2)}
            style={{
              backgroundColor: selection.tab2 === true ? "#02c712" : "#abc9ae",
              color: selection.tab2 === true ? "yellow" : "yellow",
            }}
          >
            <span className="mininavtext">PLAN_RESULT</span>
          </div>
        </div>
        {selection.tab1 && (
          <div className="traiqc">
            <MACHINE />
          </div>
        )}
        {selection.tab2 && (
          <div className="datadtc">
            <ACHIVEMENTTB />
          </div>
        )}
        {selection.tab3 && (
          <div className="datadtc">
            <LICHSUINPUTLIEU />
          </div>
        )}
        {selection.tab4 && (
          <div className="datadtc">
            <QUICKPLAN />
          </div>
        )}
        {selection.tab5 && (
          <div className="datadtc">
            <PLAN_DATATB />
          </div>
        )}
        {selection.tab6 && (
          <div className="datadtc">
            <DATASX2 />
          </div>
        )}
        {selection.tab7 && (
          <div className="datadtc">
            <PLAN_STATUS />
          </div>
        )}
        {selection.tab8 && (
          <div className="datadtc">
            <EQ_STATUS />
          </div>
        )}
        {selection.tab9 && (
          <div className="datadtc">
            <EQ_STATUS2 />
          </div>
        )}       
        {selection.tab10 && (
          <div className="datadtc">
            <KHOAO />
          </div>
        )}
      </Suspense>
    </div>
  );
};
export default QLSXPLAN;

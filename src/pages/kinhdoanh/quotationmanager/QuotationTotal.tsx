import { useEffect, useState, lazy, Suspense } from "react";
import "./QuotationTotal.scss";
import QuotationManager from "./QuotationManager";
import CalcQuotation from "./CalcQuotation";

const QuotationTotal = () => {
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
    <div className="quotationtotal">
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
            <span className="mininavtext">Quản lý giá</span>
          </div>
          <div
            className="mininavitem"
            onClick={() => setNav(2)}
            style={{
              backgroundColor: selection.tab2 === true ? "#02c712" : "#abc9ae",
              color: selection.tab2 === true ? "yellow" : "yellow",
            }}
          >
            <span className="mininavtext">Tính báo giá</span>
          </div>
        </div>
        {selection.tab1 && (
          <div className="capastatus">
            <QuotationManager />
          </div>
        )}
        {selection.tab2 && (
          <div className="capadata">
            <CalcQuotation />
          </div>
        )}
      </Suspense>
    </div>
  );
};
export default QuotationTotal;

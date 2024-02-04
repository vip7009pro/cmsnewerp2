import { useEffect, useState } from "react";
import DiemDanhNhomBP from "../DiemDanhNhom/DiemDanhBP";
import DieuChuyenTeamBP from "../DieuChuyenTeam/DieuChuyenTeamBP";
import PheDuyetNghiBP from "../PheDuyetNghi/PheDuyetNghiBP";
import "./QuanLyCapCao.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { getlang } from "../../../components/String/String";
const QuanLyCapCao = () => {
  const glbLang: string | undefined = useSelector(
    (state: RootState) => state.totalSlice.lang,
  );
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
  useEffect(() => { }, []);
  return (
    <div className="quanlycapcao">
      <div className="mininavbar">
        <div
          className="mininavitem"
          onClick={() => setNav(1)}
          style={{
            backgroundColor: selection.tab1 === true ? "#02c712" : "#abc9ae",
            color: selection.tab1 === true ? "yellow" : "yellow",
          }}
        >
          <span className="mininavtext"> {getlang("diemdanhtoanbophan", glbLang!)}</span>
        </div>
        <div
          className="mininavitem"
          onClick={() => setNav(2)}
          style={{
            backgroundColor: selection.tab2 === true ? "#02c712" : "#abc9ae",
            color: selection.tab2 === true ? "yellow" : "yellow",
          }}
        >
          <span className="mininavtext">{getlang("pheduyetnghitoanbophan", glbLang!)}</span>
        </div>
        <div
          className="mininavitem"
          onClick={() => setNav(3)}
          style={{
            backgroundColor: selection.tab3 === true ? "#02c712" : "#abc9ae",
            color: selection.tab3 === true ? "yellow" : "yellow",
          }}
        >
          <span className="mininavtext">{getlang("dieuchuyentoanbophan", glbLang!)}</span>
        </div>
      </div>
      {selection.tab1 && (
        <div className="diemdanhbp">
          <DiemDanhNhomBP />
        </div>
      )}
      {selection.tab2 && (
        <div className="pheduyetbp">
          <PheDuyetNghiBP />
        </div>
      )}
      {selection.tab3 && (
        <div className="dieuchuyenbp">
          <DieuChuyenTeamBP />
        </div>
      )}
    </div>
  );
};
export default QuanLyCapCao;

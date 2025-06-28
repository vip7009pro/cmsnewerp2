import React, { Suspense, useEffect, lazy } from "react";
const DieuChuyenTeamNS = React.lazy(() => import("../DieuChuyenTeam/DieuChuyenTeamCMS"));
import "./QuanLyCapCao.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { getlang } from "../../../components/String/String";
import MyTabs from "../../../components/MyTab/MyTab";
const DiemDanhNhomCMS = lazy(() => import("../DiemDanhNhom/DiemDanhNhomCMS"));
const PheDuyetNghiCMS = lazy(() => import("../PheDuyetNghi/PheDuyetNghiCMS"));
const QuanLyCapCao_NS = () => {
  const glbLang: string | undefined = useSelector(
    (state: RootState) => state.totalSlice.lang
  );
  useEffect(() => { }, []);
  return (
    <div className="quanlycapcao">
      <Suspense fallback={<div>Loading...</div>}>
        <MyTabs defaultActiveTab={0} >
          <MyTabs.Tab title={getlang("diemdanhtoanbophan", glbLang!)}>
            <DiemDanhNhomCMS option="diemdanhnhomNS" />
          </MyTabs.Tab>
          <MyTabs.Tab title={getlang("pheduyetnghitoanbophan", glbLang!)}>
            <PheDuyetNghiCMS option="pheduyetnhomNS" />
          </MyTabs.Tab>
          <MyTabs.Tab title={getlang("dieuchuyentoanbophan", glbLang!)}>
            <DieuChuyenTeamNS option1="diemdanhnhomNS" option2="workpositionlist_NS" />
          </MyTabs.Tab>
        </MyTabs>
      </Suspense>
    </div>
  );
};
export default QuanLyCapCao_NS;
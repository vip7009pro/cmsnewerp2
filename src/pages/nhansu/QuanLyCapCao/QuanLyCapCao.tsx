import React, { Suspense, useEffect, lazy } from "react";
const DieuChuyenTeamBP = React.lazy(() => import("../DieuChuyenTeam/DieuChuyenTeamCMS"));

import "./QuanLyCapCao.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { getlang } from "../../../components/String/String";
import MyTabs from "../../../components/MyTab/MyTab";
const DiemDanhNhomCMS = lazy(() => import("../DiemDanhNhom/DiemDanhNhomCMS"));
const PheDuyetNghiCMS = lazy(() => import("../PheDuyetNghi/PheDuyetNghiCMS"));
const QuanLyCapCao = () => {
  const glbLang: string | undefined = useSelector(
    (state: RootState) => state.totalSlice.lang
  );
  useEffect(() => {}, []);
  return (
    <div className="quanlycapcao">
      <Suspense fallback={<div>Loading...</div>}>
        <MyTabs defaultActiveTab={0}>
          <MyTabs.Tab title={getlang("diemdanhtoanbophan", glbLang!)}>
            <DiemDanhNhomCMS option="diemdanhnhomBP" />
          </MyTabs.Tab>
          <MyTabs.Tab title={getlang("pheduyetnghitoanbophan", glbLang!)}>
            <PheDuyetNghiCMS option="pheduyetnhomBP" />
          </MyTabs.Tab>
          <MyTabs.Tab title={getlang("dieuchuyentoanbophan", glbLang!)}>
            <DieuChuyenTeamBP option1="diemdanhnhomBP" option2="workpositionlist_BP" />
          </MyTabs.Tab>
        </MyTabs>
      </Suspense>
    </div>
  );
};
export default QuanLyCapCao;
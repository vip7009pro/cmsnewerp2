import React, { Suspense, useEffect, lazy } from "react";
const DieuChuyenTeamBP = React.lazy(() => import("../DieuChuyenTeam/DieuChuyenTeamBP"));
const PheDuyetNghiBP = React.lazy(() => import("../PheDuyetNghi/PheDuyetNghiBP"));
import "./QuanLyCapCao.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { getlang } from "../../../components/String/String";
import MyTabs from "../../../components/MyTab/MyTab";
import DiemDanhNhomCMS from "../DiemDanhNhom/DiemDanhNhomCMS";
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
            <PheDuyetNghiBP />
          </MyTabs.Tab>
          <MyTabs.Tab title={getlang("dieuchuyentoanbophan", glbLang!)}>
            <DieuChuyenTeamBP />
          </MyTabs.Tab>
        </MyTabs>
      </Suspense>
    </div>
  );
};
export default QuanLyCapCao;
import React, { Suspense, useEffect } from "react";
const DiemDanhNhomNS = React.lazy(() => import("../DiemDanhNhom/DiemDanhNS"));
const DieuChuyenTeamNS = React.lazy(() => import("../DieuChuyenTeam/DieuChuyenTeamNS"));
const PheDuyetNghiNS = React.lazy(() => import("../PheDuyetNghi/PheDuyetNghiNS"));
import "./QuanLyCapCao.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { getlang } from "../../../components/String/String";
import MyTabs from "../../../components/MyTab/MyTab";
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
            <DiemDanhNhomNS />
          </MyTabs.Tab>
          <MyTabs.Tab title={getlang("pheduyetnghitoanbophan", glbLang!)}>
            <PheDuyetNghiNS />
          </MyTabs.Tab>
          <MyTabs.Tab title={getlang("dieuchuyentoanbophan", glbLang!)}>
            <DieuChuyenTeamNS />
          </MyTabs.Tab>
        </MyTabs>
      </Suspense>
    </div>
  );
};
export default QuanLyCapCao_NS;
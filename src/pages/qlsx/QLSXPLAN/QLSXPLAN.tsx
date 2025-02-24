import React, { useEffect, Suspense } from "react";
import "./QLSXPLAN.scss";
import KHCT from "./KHCT/KHCT";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { getCompany, getUserData } from "../../../api/Api";
import LONGTERM_PLAN from "./LICHSUCHITHITABLE/LONGTERM_PLAN";
import MyTabs from "../../../components/MyTab/MyTab";
const BTP_AUTO = React.lazy(() => import("../../sx/BTP_AUTO/BTP_AUTO"));
const MACHINE_OLD = React.lazy(() => import("./Machine/MACHINE_backup"));
const PLAN_DATATB_OLD = React.lazy(() => import("./LICHSUCHITHITABLE/PLAN_DATATB_backup"));
const MACHINE = React.lazy(() => import("./Machine/MACHINE"));
const ACHIVEMENTTB = React.lazy(() => import("./ACHIVEMENTTB/ACHIVEMENTTB"));
const LICHSUINPUTLIEU = React.lazy(() => import("./LICHSUINPUTLIEU/LICHSUINPUTLIEU"));
const PLAN_DATATB = React.lazy(() => import("./LICHSUCHITHITABLE/PLAN_DATATB"));
const DATASX = React.lazy(() => import("./DATASX/DATASX"));
const PLAN_STATUS = React.lazy(() => import("./PLAN_STATUS/PLAN_STATUS"));
const EQ_STATUS = React.lazy(() => import("./EQ_STATUS/EQ_STATUS"));
const EQ_STATUS2 = React.lazy(() => import("./EQ_STATUS/EQ_STATUS2"));
const KHOAO = React.lazy(() => import("./KHOAO/KHOAO"));
const QUICKPLAN2 = React.lazy(() => import("./QUICKPLAN/QUICKPLAN2"));
const QUICKPLAN2_OLD = React.lazy(() => import("./QUICKPLAN/QUICKPLAN2_backup"));
const QLSXPLAN = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  useEffect(() => { }, []);
  return (
    <div className="qlsxplan">
      <Suspense fallback={<div>Loading...</div>}>
        <MyTabs defaultActiveTab={0}>
          <MyTabs.Tab title="PLAN VISUAL">
            {getCompany() === "CMS" && getUserData()?.EMPL_NO === "NHU1903z" ? (
              <MACHINE />
            ) : (
              <MACHINE_OLD />
            )}
          </MyTabs.Tab>
          {getCompany() === "CMS" && (
            <MyTabs.Tab title="QUICK PLAN">
              {getCompany() === "CMS" && getUserData()?.EMPL_NO === "NHU1903z" ? (
                <QUICKPLAN2 />
              ) : (
                <QUICKPLAN2_OLD />
              )}
            </MyTabs.Tab>
          )}
          {getCompany() === "CMS" && getUserData()?.EMPL_NO === "NHU1903" && (
            <MyTabs.Tab title="AUTO PLAN">
              <KHCT />
            </MyTabs.Tab>
          )}
          <MyTabs.Tab title="PLAN TABLE">
            {getCompany() === "CMS" && getUserData()?.EMPL_NO === "NHU1903z" ? (
              <PLAN_DATATB />
            ) : (
              <PLAN_DATATB_OLD />
            )}
          </MyTabs.Tab>
          {getCompany() === "CMS" && (
            <MyTabs.Tab title="LONGTERM PLAN">
              <LONGTERM_PLAN />
            </MyTabs.Tab>
          )}
          <MyTabs.Tab title="LỊCH SỬ">
            <LICHSUINPUTLIEU />
          </MyTabs.Tab>
          <MyTabs.Tab title="DATA SX">
            <DATASX />
          </MyTabs.Tab>
          <MyTabs.Tab title="PLAN STATUS">
            <PLAN_STATUS />
          </MyTabs.Tab>
          <MyTabs.Tab title="TV SHOW">
            <EQ_STATUS />
          </MyTabs.Tab>
          <MyTabs.Tab title="EQ STATUS">
            <EQ_STATUS2 />
          </MyTabs.Tab>
          <MyTabs.Tab title="Kho SX Main">
            <KHOAO />
          </MyTabs.Tab>
          <MyTabs.Tab title="PLAN_RESULT">
            <ACHIVEMENTTB />
          </MyTabs.Tab>
          {getCompany() === "CMS" && (
            <MyTabs.Tab title="BTP">
              <BTP_AUTO />
            </MyTabs.Tab>
          )}
        </MyTabs>
      </Suspense>
    </div>
  );
};
export default QLSXPLAN;
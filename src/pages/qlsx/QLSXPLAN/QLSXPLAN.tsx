import React, { useEffect, Suspense } from "react";
import "./QLSXPLAN.scss";
import KHCT from "./KHCT/KHCT";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { getCompany, getUserData } from "../../../api/Api";
import LONGTERM_PLAN from "./LICHSUCHITHITABLE/LONGTERM_PLAN";
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
      <Suspense fallback={<div> Loading...</div>}>
        <Tabs className="tabs" style={{
          fontSize: "0.6rem",
          width: "100%",
        }}>
          <TabList className="tablist" style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "left",
            backgroundImage: theme.CMS.backgroundImage,
            color: 'gray'
          }}>
            <Tab>PLAN VISUAL</Tab>
            {getCompany() === "CMS" && <Tab>QUICK PLAN</Tab>}
            {getCompany() === "CMS" &&  getUserData()?.EMPL_NO  ==='NHU1903' && <Tab>AUTO PLAN</Tab>}
            <Tab>PLAN TABLE</Tab>
            {getCompany() === "CMS" && <Tab>LONGTERM PLAN</Tab>}           
            <Tab>LỊCH SỬ</Tab>
            <Tab>DATA SX</Tab>
            <Tab>PLAN STATUS</Tab>
            <Tab>TV SHOW</Tab>
            <Tab>EQ STATUS</Tab>
            <Tab>Kho SX Main</Tab>
            <Tab>PLAN_RESULT</Tab>
            {getCompany() === "CMS" && <Tab>BTP</Tab>}               
          </TabList>
          <TabPanel>
            {(getCompany() === "CMS" && getUserData()?.EMPL_NO === 'NHU1903z') ? <MACHINE /> : <MACHINE_OLD />}
          </TabPanel>
          {getCompany() === "CMS" && <TabPanel>
            {getCompany() === "CMS" && getUserData()?.EMPL_NO === 'NHU1903z' ? <QUICKPLAN2 /> : <QUICKPLAN2_OLD />}
          </TabPanel>}
          {getCompany() === "CMS" && getUserData()?.EMPL_NO  ==='NHU1903' &&<TabPanel>
            <KHCT />
          </TabPanel>}
          <TabPanel>
            {getCompany() === "CMS" && getUserData()?.EMPL_NO === 'NHU1903z' ? <PLAN_DATATB /> : <PLAN_DATATB_OLD />}
          </TabPanel>
          {getCompany() ==='CMS' &&  <TabPanel>
            <LONGTERM_PLAN />
          </TabPanel>}
          <TabPanel>
            <LICHSUINPUTLIEU />
          </TabPanel>
          <TabPanel>
            <DATASX />
          </TabPanel>
          <TabPanel>
            <PLAN_STATUS />
          </TabPanel>
          <TabPanel>
            <EQ_STATUS />
          </TabPanel>
          <TabPanel>
            <EQ_STATUS2 />
          </TabPanel>
          <TabPanel>
            <KHOAO />
          </TabPanel>
          <TabPanel>
            <ACHIVEMENTTB />
          </TabPanel>
          <TabPanel>
            {getCompany() ==='CMS' && <BTP_AUTO />}
          </TabPanel>
        </Tabs>
      </Suspense>
    </div>
  );
};
export default QLSXPLAN;

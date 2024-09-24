import React, { useEffect, Suspense } from "react";
import "./QLSXPLAN.scss";
import KHCT from "./KHCT/KHCT";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
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

const QLSXPLAN = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme); 
  useEffect(() => {}, []);
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
            <Tab>QUICK PLAN</Tab>
            <Tab>AUTO PLAN</Tab>
            <Tab>PLAN TABLE</Tab>
            <Tab>LỊCH SỬ</Tab>
            <Tab>DATA SX</Tab>
            <Tab>PLAN STATUS</Tab>
            <Tab>TV SHOW</Tab>
            <Tab>EQ STATUS</Tab>  
            <Tab>Kho SX Main</Tab>
            <Tab>PLAN_RESULT</Tab>
          </TabList>
          <TabPanel>
            <MACHINE />
          </TabPanel>
          <TabPanel>
            <QUICKPLAN2 />
          </TabPanel>    
          <TabPanel>  
            <KHCT /> 
          </TabPanel>   
          <TabPanel>
            <PLAN_DATATB />
          </TabPanel>      
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
        </Tabs>
      </Suspense>
    </div>
  );
};
export default QLSXPLAN;

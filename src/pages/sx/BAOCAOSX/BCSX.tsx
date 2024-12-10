import React, { useEffect, Suspense } from "react";
import "./BCSX.scss";
const SX_REPORT = React.lazy(() => import("./SX_REPORT"));
const CAPASX = React.lazy(() => import("../../qlsx/QLSXPLAN/CAPA/CAPASX"));
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import CAPASX2 from "../../qlsx/QLSXPLAN/CAPA/CAPASX2";
import { getCompany } from "../../../api/Api";

const BCSX = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme); 
  useEffect(() => {}, []);
  return (
    <div className="qcreport">
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
            color: "gray",
            overflow: "hidden", 
          }}>
            <Tab>PRODUCTION PERFOMANCE REPORT</Tab>
            <Tab>PRODUCTION CAPA REPORT</Tab>
          </TabList>
          <TabPanel>            
            <SX_REPORT/>            
          </TabPanel>
          <TabPanel>
            {
              getCompany() ==='CMS' && <CAPASX />
            }
            {
              getCompany() !=='CMS' && <CAPASX2 />
            }
          </TabPanel>        
        </Tabs>
      </Suspense>
    </div>
  );
};
export default BCSX;

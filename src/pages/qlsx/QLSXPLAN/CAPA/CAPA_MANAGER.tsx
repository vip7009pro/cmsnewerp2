import { useEffect, useState, lazy, Suspense } from "react";
import "./CAPA_MANAGER.scss";
import CAPADATA from "./CAPADATA";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import CAPASX2 from "./CAPASX2";
import { getCompany } from "../../../../api/Api";
import CAPASX from "./CAPASX";

const CAPA_MANAGER = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  useEffect(() => {}, []);
  return (
    <div className="capamanager">
      <Suspense fallback={<div> Loading...</div>}>       
        <Tabs className="tabs" style={{
          fontSize: "0.6rem",
          width: "100%",
        }}>
          <TabList className="tablist" style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            backgroundImage: theme.CMS.backgroundImage,
            justifyContent: "left",
          }}>
            <Tab>CAPA STATUS</Tab>
            <Tab>CAPA DATA</Tab>
          </TabList>
          <TabPanel>
            {
              getCompany() ==='CMS' && <CAPASX />
            }
            {
              getCompany() !=='CMS' && <CAPASX2 />
            }
          </TabPanel>
          <TabPanel>
            <CAPADATA />
          </TabPanel> 
        </Tabs>
      </Suspense>
    </div>
  );
};
export default CAPA_MANAGER;

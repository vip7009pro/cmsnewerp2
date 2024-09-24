import { useEffect, useState, lazy, Suspense } from "react";
import "./CAPA_MANAGER.scss";
import CAPASX from "./CAPASX";
import CAPADATA from "./CAPADATA";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

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
            <CAPASX />
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

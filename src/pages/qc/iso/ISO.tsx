import { useEffect, useState } from "react";
import "./ISO.scss";
import RNR from "./RNR/RNR";
import AUDIT from "./AUDIT/AUDIT";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import ALLDOC from "./DOCUMENT/ALLDOC";
const ISO = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  useEffect(() => { }, []);
  return (
    <div className="iso">
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
          <Tab>EMPL G_RNR</Tab>
          <Tab>SELF AUDIT</Tab>
          <Tab>DOCUMENT</Tab>
        </TabList>
        <TabPanel>
          <div className="rnr">
            <RNR />
          </div>
        </TabPanel>
        <TabPanel>
          <div className="audit">
            <AUDIT />
          </div>
        </TabPanel>
        <TabPanel>
          <div className="audit">
            <ALLDOC />
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};
export default ISO;

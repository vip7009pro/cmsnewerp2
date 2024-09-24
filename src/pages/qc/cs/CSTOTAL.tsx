import { useEffect, useState } from "react";
import "./CSTOTAL.scss";
import CS from "./CS";
import CS_DATA_TB from "./CS_DATA";
import CSREPORT from "./CSREPORT";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

const CSTOTAL = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);


  useEffect(() => {}, []);

  return (
    <div className="totalcs">     
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
          <Tab>DATA CS</Tab>
          <Tab>BÁO CÁO CS</Tab>
        </TabList>
        <TabPanel>      
            <div className="datacs">
              <CS_DATA_TB />
            </div>     
        </TabPanel>
        <TabPanel>         
            <div className="baocaocs">
              <CSREPORT/>          
            </div>        
        </TabPanel>
      </Tabs>
    </div>
  );
};
export default CSTOTAL;

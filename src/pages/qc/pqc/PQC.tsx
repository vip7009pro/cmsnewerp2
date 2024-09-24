import { useEffect, useState } from "react";
import TRAPQC from "./TRAPQC";
import "./PQC.scss";
import PQC1 from "./PQC1";
import PQC3 from "./PQC3";
import LINEQC from "./LINEQC";
import PATROL from "../../sx/PATROL/PATROL";
import PQC_REPORT from "./PQC_REPORT";
import QLGN from "../../rnd/quanlygiaonhandaofilm/QLGN";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
const PQC = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  useEffect(() => { }, []);
  return (
    <div className="pqc">
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
          <Tab>
            <span className="mininavtext">LINEQC</span>
          </Tab>
          <Tab>
            <span className="mininavtext">DATA PQC</span>
          </Tab>
          <Tab>
            <span className="mininavtext">PQC1-SETTING</span>
          </Tab>
          <Tab>
            <span className="mininavtext">PQC3-DEFECT</span>
          </Tab>
          <Tab>
            <span className="mininavtext">PATROL</span>
          </Tab>
          <Tab>
            <span className="mininavtext">Giao Nhận Dao Film</span>
          </Tab>
          <Tab>
            <span className="mininavtext">Báo Cáo</span>
          </Tab>
        </TabList>
        <TabPanel>
          <LINEQC />
        </TabPanel> 
        <TabPanel>
          <div className="trapqc">
            <TRAPQC />
          </div>
        </TabPanel>
        <TabPanel>
          <div className="trapqc">
            <PQC1 />
          </div>
        </TabPanel>
        <TabPanel>
          <div className="trapqc">
            <PQC3 />
          </div>
        </TabPanel>
        <TabPanel>
          <div className="trapqc">
            <PATROL />
          </div>
        </TabPanel>        
        <TabPanel>
          <div className="trapqc">
            <QLGN />
          </div>
        </TabPanel>
        <TabPanel>
          <div className="trapqc">
            <PQC_REPORT />
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};
export default PQC;

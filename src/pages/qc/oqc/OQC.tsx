import { useEffect, useState } from "react";
import KHOTP from "../../kho/khotp/KHOTP";
import "./OQC.scss";
import OQC_DATA from "./OQC_DATA";
import OQC_REPORT from "./OQC_REPORT";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { getCompany } from "../../../api/Api";
import KHOTPNEW from "../../kho/khotp_new/KHOTPNEW";
const OQC = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  useEffect(() => {}, []);
  return (
     <div className="oqc">
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
            <span className="mininavtext">Data Kho Thành Phẩm</span>
          </Tab>
          <Tab>
            <span className="mininavtext">Data OQC</span>
          </Tab>
          <Tab>
            <span className="mininavtext">Báo Cáo</span>
          </Tab>
        </TabList>
        <TabPanel>
          <div className="trainspection">
            {getCompany() === 'CMS' ? <KHOTP /> : <KHOTPNEW />}
          </div>
        </TabPanel>
        <TabPanel>
          <div className="trainspection">
            <OQC_DATA />
          </div>
        </TabPanel>
        <TabPanel>
          <div className="trainspection">
            <OQC_REPORT />
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};


export default OQC;

 

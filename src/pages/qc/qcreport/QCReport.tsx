import React, { useEffect, useState, lazy, Suspense } from "react";
import "./QCReport.scss";
const PQC_REPORT = React.lazy(() => import("../pqc/PQC_REPORT"));
const INSPECT_REPORT = React.lazy(() => import("../inspection/INSPECT_REPORT"));
const CSREPORT = React.lazy(() => import("../cs/CSREPORT"));
const OQC_REPORT = React.lazy(() => import("../oqc/OQC_REPORT"));
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { getCompany } from "../../../api/Api";
import INSPECT_REPORT2 from "../inspection/INSPECT_REPORT2";

const QCReport = () => {
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
          color: 'gray'
        }}>
          <Tab>PQC REPORT</Tab>
          <Tab>INSPECTION REPORT</Tab>
          <Tab>CS REPORT</Tab>
          <Tab>OQC REPORT</Tab>
        </TabList>
        <TabPanel>
          <PQC_REPORT/>
        </TabPanel>
        <TabPanel>
          {getCompany() ==='CMS' ? <INSPECT_REPORT/> : <INSPECT_REPORT2/>}
        </TabPanel>
        <TabPanel>
          <CSREPORT/>
        </TabPanel>
        <TabPanel>
          <OQC_REPORT/>
        </TabPanel>
        </Tabs>
      </Suspense>
    </div>
  );
};
export default QCReport;

import React, { useEffect, Suspense } from "react";
import "./WH_REPORT.scss";
import MyTabs from "../../../components/MyTab/MyTab";
import KHOVL_REPORT from "./khovlreport/KHOVL_REPORT";
const WH_REPORT = () => {
  useEffect(() => {}, []);
  return (
    <div className="whreport">
      <Suspense fallback={<div>Loading...</div>}>
        <MyTabs defaultActiveTab={0}>
          <MyTabs.Tab title="MATERIAL WH REPORT">
            <KHOVL_REPORT />
          </MyTabs.Tab>
          <MyTabs.Tab title="PRODUCT WH REPORT">
            <></>
          </MyTabs.Tab>         
        </MyTabs>
      </Suspense>
    </div>
  );
};
export default WH_REPORT;
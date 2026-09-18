import React, { useEffect, Suspense } from "react";
import "./WH_REPORT.scss";
import MyTabs from "../../../components/MyTab/MyTab";
import KHOVL_REPORT from "./khovlreport/KHOVL_REPORT";
import KHOTP_REPORT from "./khotpreport/KHOTP_REPORT";
import { getUserData } from "../../../api/Api";
const WH_REPORT = () => {
  useEffect(() => {}, []);
  return (
    <div className="whreport">
      <Suspense fallback={<div>Loading...</div>}>
        <MyTabs defaultActiveTab={0}>
          <MyTabs.Tab title="MATERIAL WH REPORT">
            <KHOVL_REPORT />
          </MyTabs.Tab>
         {/*  <MyTabs.Tab title="PRODUCT WH REPORT">
            <KHOTP_REPORT />
          </MyTabs.Tab>       */}   
        </MyTabs>
      </Suspense>
    </div>
  );
};
export default WH_REPORT;
import React, { useEffect, Suspense } from "react";
import "./QCReport.scss";
const PQC_REPORT = React.lazy(() => import("../pqc/PQC_REPORT"));
const INSPECT_REPORT = React.lazy(() => import("../inspection/INSPECT_REPORT"));
const CSREPORT = React.lazy(() => import("../cs/CSREPORT"));
const OQC_REPORT = React.lazy(() => import("../oqc/OQC_REPORT"));
import { getCompany } from "../../../api/Api";
import INSPECT_REPORT2 from "../inspection/INSPECT_REPORT2";
import MyTabs from "../../../components/MyTab/MyTab";
const QCReport = () => {
  useEffect(() => {}, []);
  return (
    <div className="qcreport">
      <Suspense fallback={<div>Loading...</div>}>
        <MyTabs defaultActiveTab={0}>
          <MyTabs.Tab title="PQC REPORT">
            <PQC_REPORT />
          </MyTabs.Tab>
          <MyTabs.Tab title="INSPECTION REPORT">
            {getCompany() === "CMS" ? <INSPECT_REPORT /> : <INSPECT_REPORT2 />}
          </MyTabs.Tab>
          <MyTabs.Tab title="CS REPORT">
            <CSREPORT />
          </MyTabs.Tab>
          <MyTabs.Tab title="OQC REPORT">
            <OQC_REPORT />
          </MyTabs.Tab>
        </MyTabs>
      </Suspense>
    </div>
  );
};
export default QCReport;
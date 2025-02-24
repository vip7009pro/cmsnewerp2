import React, { useEffect, Suspense } from "react";
import "./BCSX.scss";
const SX_REPORT = React.lazy(() => import("./SX_REPORT"));
const CAPASX = React.lazy(() => import("../../qlsx/QLSXPLAN/CAPA/CAPASX"));
import CAPASX2 from "../../qlsx/QLSXPLAN/CAPA/CAPASX2";
import { getCompany } from "../../../api/Api";
import MyTabs from "../../../components/MyTab/MyTab";
const BCSX = () => {
  useEffect(() => {}, []);
  return (
    <div className="qcreport">
      <Suspense fallback={<div>Loading...</div>}>
        <MyTabs defaultActiveTab={0}>
          <MyTabs.Tab title="PRODUCTION PERFOMANCE REPORT">
            <SX_REPORT />
          </MyTabs.Tab>
          <MyTabs.Tab title="PRODUCTION CAPA REPORT">
            {getCompany() === "CMS" ? <CAPASX /> : <CAPASX2 />}
          </MyTabs.Tab>
        </MyTabs>
      </Suspense>
    </div>
  );
};
export default BCSX;
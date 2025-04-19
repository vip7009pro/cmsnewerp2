import { useEffect } from "react";
import TRAPQC from "./TRAPQC";
import "./PQC.scss";
import PQC1 from "./PQC1";
import PQC3 from "./PQC3";
import LINEQC from "./LINEQC";
import PATROL from "../../sx/PATROL/PATROL";
import PQC_REPORT from "./PQC_REPORT";
import QLGN from "../../rnd/quanlygiaonhandaofilm/QLGN";
import MyTabs from "../../../components/MyTab/MyTab";
import { getUserData } from "../../../api/Api";

const PQC = () => {
  useEffect(() => {}, []);
  return (
    <div className="pqc">
      <MyTabs  defaultActiveTab={0}>
        {getUserData()?.SUBDEPTNAME?.includes("PQC")  &&<MyTabs.Tab title={"LINEQC"}>
          <LINEQC />
        </MyTabs.Tab>}
        {getUserData()?.JOB_NAME !=='Worker' && <MyTabs.Tab title={"DATA PQC"}>
          <div className="trapqc">
            <TRAPQC />
          </div>
        </MyTabs.Tab>}
         {getUserData()?.JOB_NAME !=='Worker' &&  <MyTabs.Tab title={"PQC1-SETTING"}>
          <div className="trapqc">
            <PQC1 />
          </div>
        </MyTabs.Tab>}
         {getUserData()?.JOB_NAME !=='Worker' &&  <MyTabs.Tab title={"PQC3-DEFECT"}>
          <div className="trapqc">
            <PQC3 />
          </div>
        </MyTabs.Tab>}
         {getUserData()?.JOB_NAME !=='Worker' &&  <MyTabs.Tab title={"PATROL"}>
          <div className="trapqc">
            <PATROL />
          </div>
        </MyTabs.Tab>}
         {getUserData()?.JOB_NAME !=='Worker' &&  <MyTabs.Tab title={"Giao Nhận Dao Film"}>
          <div className="trapqc">
            <QLGN />
          </div>
        </MyTabs.Tab>}
         {getUserData()?.JOB_NAME !=='Worker' &&  <MyTabs.Tab title={"Báo Cáo"}>
          <div className="trapqc">
            <PQC_REPORT />
          </div>
        </MyTabs.Tab>}
      </MyTabs>
    </div>
  );
};

export default PQC;
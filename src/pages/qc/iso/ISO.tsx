import { useEffect } from "react";
import "./ISO.scss";
import RNR from "./RNR/RNR";
import AUDIT from "./AUDIT/AUDIT";
import ALLDOC from "./DOCUMENT/ALLDOC";
import MyTabs from "../../../components/MyTab/MyTab";
import { getCompany } from "../../../api/Api";
import AUDIT_HISTORY from "./AUDIT/AUDIT_HISTORY";
const ISO = () => {
  useEffect(() => {}, []);
  return (
    <div className="iso">
      <MyTabs defaultActiveTab={0}>
        {(getCompany() ==='CMS') && <MyTabs.Tab title="TEST">
          <div className="rnr">
            <RNR />
          </div>
        </MyTabs.Tab>}
        {(getCompany() ==='CMS') && <MyTabs.Tab title="SELF AUDIT">
          <div className="audit">
            <AUDIT />
          </div>
        </MyTabs.Tab>}
        <MyTabs.Tab title="AUDIT HISTORY">
          <div className="audit">
           <AUDIT_HISTORY/>
          </div>
        </MyTabs.Tab>
        {(getCompany() ==='CMS') && <MyTabs.Tab title="DOCUMENT">
          <div className="audit">
            <ALLDOC />
          </div>
        </MyTabs.Tab>}
      </MyTabs>
    </div>
  );
};
export default ISO;
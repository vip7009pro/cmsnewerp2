import { useEffect } from "react";
import "./CSTOTAL.scss";
import CS_DATA_TB from "./CS_DATA";
import CSREPORT from "./CSREPORT";
import MyTabs from "../../../components/MyTab/MyTab";
const CSTOTAL = () => {
  useEffect(() => {}, []);
  return (
    <div className="totalcs">
      <MyTabs defaultActiveTab={0}>
        <MyTabs.Tab title="DATA CS">
          <div className="datacs">
            <CS_DATA_TB />
          </div>
        </MyTabs.Tab>
        <MyTabs.Tab title="BÁO CÁO CS">
          <div className="baocaocs">
            <CSREPORT />
          </div>
        </MyTabs.Tab>
      </MyTabs>
    </div>
  );
};
export default CSTOTAL;
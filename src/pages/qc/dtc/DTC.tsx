import { useEffect } from "react";
import "./DTC.scss";
import DKDTC from "./DKDTC";
import KQDTC from "./KQDTC";
import SPECDTC from "./SPECDTC";
import ADDSPECDTC from "./ADDSPECDTC";
import DTCRESULT from "./DTCRESULT";
import TEST_TABLE from "./TEST_TABLE";
import { getCompany } from "../../../api/Api";
import MyTabs from "../../../components/MyTab/MyTab";
const DTC = () => {
  useEffect(() => { }, []);
  return (
    <div className="dtc">
      <MyTabs defaultActiveTab={0}>
        <MyTabs.Tab title={"TRA KQ ĐTC"}>
          <KQDTC />
        </MyTabs.Tab>
        <MyTabs.Tab title={"TRA SPEC ĐTC"}>
          <SPECDTC />
        </MyTabs.Tab>
        <MyTabs.Tab title={"ADD SPEC ĐTC"}>
          <ADDSPECDTC />
        </MyTabs.Tab>
        <MyTabs.Tab title={"ĐKÝ TEST ĐTC"}>
          <DKDTC />
        </MyTabs.Tab>
        <MyTabs.Tab title={"NHẬP KQ ĐTC"}>
          <DTCRESULT />
        </MyTabs.Tab>
        {getCompany() === "CMS" && (
          <MyTabs.Tab title={"Quản lý hạng mục ĐTC"}>
            <TEST_TABLE />
          </MyTabs.Tab>
        )}
      </MyTabs>
    </div>
  );
};
export default DTC;
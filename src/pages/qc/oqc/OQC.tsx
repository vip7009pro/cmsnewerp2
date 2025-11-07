import { useEffect } from "react";
import KHOTP from "../../kho/khotp/KHOTP";
import "./OQC.scss";
import OQC_DATA from "./OQC_DATA";
import OQC_REPORT from "./OQC_REPORT";
import { getCompany } from "../../../api/Api";
import KHOTPNEW from "../../kho/khotp_new/KHOTPNEW";
import MyTabs from "../../../components/MyTab/MyTab";
import QTR_DATA from "./QTR_DATA";
const OQC = () => {
  useEffect(() => {}, []);
  return (
    <div className="oqc">
      <MyTabs
        defaultActiveTab={0}>
        <MyTabs.Tab title={"Data Kho Thành Phẩm"}>
          <div className="trainspection">
            {getCompany() === "CMS" ? <KHOTP /> : <KHOTPNEW />}
          </div>
        </MyTabs.Tab>
        <MyTabs.Tab title={"Data OQC"}>
          <div className="trainspection">
            <OQC_DATA />
          </div>
        </MyTabs.Tab>
       { getCompany() === "CMS" && <MyTabs.Tab title={"Data QTR"}>
          <div className="trainspection">
            <QTR_DATA />
          </div>
        </MyTabs.Tab>}
        <MyTabs.Tab title={"Báo Cáo"}>
          <div className="trainspection">
            <OQC_REPORT />
          </div>
        </MyTabs.Tab>
      </MyTabs>
    </div>
  );
};
export default OQC;
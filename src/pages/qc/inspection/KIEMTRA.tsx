import { useEffect, Suspense } from "react";
import "./KIEMTRA.scss";
import INSPECTION from "./INSPECTION";
import INSPECT_REPORT from "./INSPECT_REPORT";
import INSPECT_STATUS from "./INSPECT_STATUS/INSPECT_STATUS";
import TINHHINHCUONLIEU from "../../sx/TINH_HINH_CUON_LIEU/TINHINHCUONLIEU";
import PATROL from "../../sx/PATROL/PATROL";
import { getCompany } from "../../../api/Api";
import INSPECT_REPORT2 from "./INSPECT_REPORT2";
import MyTabs from "../../../components/MyTab/MyTab";
import LOSS_TIME_DATA from "./LOSS_TIME_DATA/LOSS_TIME_DATA";

const KIEMTRA = () => {
  useEffect(() => {}, []);

  return (
    <div className="kiemtra">
      <Suspense fallback={<div>Loading</div>}>
        <MyTabs defaultActiveTab={0}>
          <MyTabs.Tab title={"Data Kiểm Tra"}>
            <div className="trainspection">
              <INSPECTION />
            </div>
          </MyTabs.Tab>
          {getCompany() === "PVN" && <MyTabs.Tab title={"Loss Time New"}>
            <div className="trainspection">
              <LOSS_TIME_DATA />
            </div>
          </MyTabs.Tab>}
          <MyTabs.Tab title={"Báo cáo"}>
            {(getCompany() === "CMS" || getCompany() === "PVN") ? (
              <INSPECT_REPORT />
            ) : (
              <INSPECT_REPORT2 />
            )}
          </MyTabs.Tab>
          <MyTabs.Tab title={"ISP STATUS"}>
            <INSPECT_STATUS />
          </MyTabs.Tab>
          <MyTabs.Tab title={"Material Status"}>
            <TINHHINHCUONLIEU />
          </MyTabs.Tab>
          <MyTabs.Tab title={"PATROL"}>
            <PATROL />
          </MyTabs.Tab>
        </MyTabs>
      </Suspense>
    </div>
  );
};

export default KIEMTRA;
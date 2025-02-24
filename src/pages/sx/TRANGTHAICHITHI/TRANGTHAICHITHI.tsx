import { Suspense, useEffect } from "react";
import PLAN_STATUS from "../../qlsx/QLSXPLAN/PLAN_STATUS/PLAN_STATUS";
import TINH_HINH_CHOT from "../TINH_HINH_CHOT/TINH_HINH_CHOT";
import "./TRANGTHAICHITHI.scss";
import MyTabs from "../../../components/MyTab/MyTab";
const TRANGTHAICHITHI = () => {
  useEffect(() => {}, []);
  return (
    <div className="trangthaichithisx">
      <Suspense fallback={<div>Loading...</div>}>
        <MyTabs defaultActiveTab={0}>
          <MyTabs.Tab title="PLAN STATUS">
            <PLAN_STATUS />
          </MyTabs.Tab>
          <MyTabs.Tab title="TÌNH HÌNH CHỐT">
            <TINH_HINH_CHOT />
          </MyTabs.Tab>
        </MyTabs>
      </Suspense>
    </div>
  );
};
export default TRANGTHAICHITHI;
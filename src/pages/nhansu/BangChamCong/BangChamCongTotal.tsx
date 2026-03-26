import { useEffect, Suspense, lazy } from "react";
import "./BangChamCongTotal.scss";
import MyTabs from "../../../components/MyTab/MyTab";
import UploadCong from "./UploadCong";
const BANGCHAMCONG = lazy(() => import("./BangChamCong"));
import { getCompany } from "../../../api/Api";


const BangChamCongTotal = () => {
  useEffect(() => {}, []);

  return (
    <div className="bangchamcongtotal">
      <Suspense fallback={<div>Loading</div>}>
        <MyTabs defaultActiveTab={0}>
          <MyTabs.Tab title={"Bảng chấm công"}>
            <BANGCHAMCONG />
          </MyTabs.Tab>          
          {getCompany() === "PVN" && <MyTabs.Tab title={"Upload chấm công"}>
            <UploadCong />
          </MyTabs.Tab> }         
        </MyTabs>
      </Suspense>
    </div>
  );
};

export default BangChamCongTotal;
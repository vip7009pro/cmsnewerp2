import { useEffect, Suspense } from "react";
import "./CAPA_MANAGER.scss";
import CAPADATA from "./CAPADATA";
import CAPASX2 from "./CAPASX2";
import { getCompany } from "../../../../api/Api";
import CAPASX from "./CAPASX";
import MyTabs from "../../../../components/MyTab/MyTab";
const CAPA_MANAGER = () => {
  useEffect(() => {}, []);
  return (
    <div className="capamanager">
      <Suspense fallback={<div>Loading...</div>}>
        <MyTabs defaultActiveTab={0}>
          <MyTabs.Tab title="CAPA STATUS">
            {getCompany() === "CMS" ? <CAPASX /> : <CAPASX2 />}
          </MyTabs.Tab>
          <MyTabs.Tab title="CAPA DATA">
            <CAPADATA />
          </MyTabs.Tab>
        </MyTabs>
      </Suspense>
    </div>
  );
};
export default CAPA_MANAGER;
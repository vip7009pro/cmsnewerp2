import "./PlanManager.scss";
import MyTabs from "../../../components/MyTab/MyTab";
import PlanManagerAddTab from "./PlanManagerAddTab";
import PlanManagerManageTab from "./PlanManagerManageTab";
import PlanManagerStatusTab from "./PlanManagerStatusTab";
import { getCompany } from "../../../api/Api";

const PlanManager = () => {
  return (
    <div className="planmanager">
      <MyTabs defaultActiveTab={0}>
        <MyTabs.Tab title="Quản lý Plan">
          <PlanManagerManageTab />
        </MyTabs.Tab>
        {getCompany() === "CMS" && (
          <MyTabs.Tab title="Plan Status">
            <PlanManagerStatusTab />
          </MyTabs.Tab>
        )}
        <MyTabs.Tab title="Thêm Plan">
          <PlanManagerAddTab />
        </MyTabs.Tab>
      </MyTabs>
    </div>
  );
};
export default PlanManager;

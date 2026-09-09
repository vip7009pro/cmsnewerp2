import "./PoManager.scss";
import MyTabs from "../../../components/MyTab/MyTab";
import PoManagerManageTab from "./PoManagerManageTab";
import PoManagerAddTab from "./PoManagerAddTab";

const PoManagerBackup = () => {
  return (
    <div className="pomanager">
      <MyTabs defaultActiveTab={0}>
        <MyTabs.Tab title="Quản lý PO">
          <PoManagerManageTab />
        </MyTabs.Tab>
        <MyTabs.Tab title="Thêm PO">
          <PoManagerAddTab />
        </MyTabs.Tab>
      </MyTabs>
    </div>
  );
};
export default PoManagerBackup;

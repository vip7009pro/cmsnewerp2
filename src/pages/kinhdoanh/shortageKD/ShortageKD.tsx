import MyTabs from "../../../components/MyTab/MyTab";
import "./ShortageKD.scss";
import React from "react";
import ShortageKDAddTab from "./ShortageKDAddTab";
import ShortageKDManageTab from "./ShortageKDManageTab";

const ShortageKD = () => {
  return (
    <div className="shortage">
      <MyTabs defaultActiveTab={0}>
        <MyTabs.Tab title="Quản lý Shortage">
          <ShortageKDManageTab />
        </MyTabs.Tab>
        <MyTabs.Tab title="Thêm Shortage">
          <ShortageKDAddTab />
        </MyTabs.Tab>
      </MyTabs>
    </div>
  );
};
export default ShortageKD;

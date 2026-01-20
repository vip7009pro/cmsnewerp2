import "./FCSTManager.scss";
import React from "react";
import MyTabs from "../../../components/MyTab/MyTab";
import FCSTManagerAddTab from "./FCSTManagerAddTab";
import FCSTManagerManageTab from "./FCSTManagerManageTab";

const FCSTManager = () => {
  return (
    <div className="fcstmanager">
      <MyTabs defaultActiveTab={0}>
        <MyTabs.Tab title="Quản lý FCST">
          <FCSTManagerManageTab />
        </MyTabs.Tab>
        <MyTabs.Tab title="Thêm FCST">
          <FCSTManagerAddTab />
        </MyTabs.Tab>
      </MyTabs>
    </div>
  );
};
export default FCSTManager;

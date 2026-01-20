import "./InvoiceManager.scss";
import React from "react";
import MyTabs from "../../../components/MyTab/MyTab";
import InvoiceManagerAddTab from "./InvoiceManagerAddTab";
import InvoiceManagerManageTab from "./InvoiceManagerManageTab";

const InvoiceManager = () => {
  return (
    <div className="invoicemanager">
      <MyTabs defaultActiveTab={0}>
        <MyTabs.Tab title="Quản lý Invoice">
          <InvoiceManagerManageTab />
        </MyTabs.Tab>
        <MyTabs.Tab title="Thêm Invoice">
          <InvoiceManagerAddTab />
        </MyTabs.Tab>
      </MyTabs>
    </div>
  );
};
export default InvoiceManager;
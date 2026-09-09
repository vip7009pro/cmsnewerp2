import { useEffect } from "react";
import "./QuanLyPhongBanNhanSu.scss";
import MyTabs from "../../../components/MyTab/MyTab";
import UserManager from "./UserManager";
import DeptManager from "./DeptManager";
const QuanLyPhongBanNhanSu = () => {
  useEffect(() => {   
  }, []);
  return (
    <div className="quanlyphongbannhansunew">
      <MyTabs defaultActiveTab={0}>
        <MyTabs.Tab title="Quản lý Nhân Sự">
          <UserManager/>
        </MyTabs.Tab>
        <MyTabs.Tab title="Quản Lý Phòng Ban">
          <DeptManager/>
        </MyTabs.Tab>
      </MyTabs>
    </div>
  );
};
export default QuanLyPhongBanNhanSu;
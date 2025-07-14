import { useEffect } from "react";
import "./TabDangKy.scss";
import MyTabs from "../../../components/MyTab/MyTab";
import FormDangKyNghi from "./FormDangKyNghi";
import FormDangKyTangCa from "./FormDangKyTangCa";
import FormXacNhanChamCong from "./FormXacNhanChamCong";
const TabDangKy = () => {
  useEffect(() => { }, []);
  return (
    <MyTabs defaultActiveTab={0}>
    <MyTabs.Tab title="Đăng ký nghỉ">
      <FormDangKyNghi/>
    </MyTabs.Tab>
    <MyTabs.Tab title="Đăng ký tăng ca">
      <FormDangKyTangCa/>
    </MyTabs.Tab>
    <MyTabs.Tab title="Xác nhận chấm công">
      <FormXacNhanChamCong/>
    </MyTabs.Tab>
  </MyTabs>
  );
};
export default TabDangKy;
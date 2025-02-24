import { useEffect } from "react";
import KHOLIEU from "../../kho/kholieu/KHOLIEU";
import "./IQC.scss";
import DTC from "../dtc/DTC";
import HOLD_FAIL from "./HOLD_FAIL";
import NCR_MANAGER from "./NCR_MANAGER";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import MyTabs from "../../../components/MyTab/MyTab";
const IQC = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  useEffect(() => { }, []);
  return (
    <div className="iqc">      
      <MyTabs defaultActiveTab={0}>
          <MyTabs.Tab title="Kho Liệu">
          <KHOLIEU />
          </MyTabs.Tab>
          <MyTabs.Tab title="ĐỘ TIN CẬY">
          <DTC />
          </MyTabs.Tab>
          <MyTabs.Tab title="IN-HOLD-FAIL">
          <HOLD_FAIL />
          </MyTabs.Tab>
          <MyTabs.Tab title="NCR MANAGEMENT">
          <NCR_MANAGER />
          </MyTabs.Tab>
        </MyTabs>
    </div>
  );
};
export default IQC;

import { useEffect } from "react";
import KHOLIEU from "../../kho/kholieu/KHOLIEU";
import "./IQC.scss";
import DTC from "../dtc/DTC";
import HOLD_FAIL from "./HOLD_FAIL";
import NCR_MANAGER from "./NCR_MANAGER";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import MyTabs from "../../../components/MyTab/MyTab";
import DKDTC from "../dtc/DKDTC";
import { getUserData } from "../../../api/Api";
import INCOMMING from "./INCOMMING";
import HOLDING from "./HOLDING";
import FAILING from "./FAILING";
const IQC = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  useEffect(() => {}, []);
  return (
    <div className="iqc">
      <MyTabs defaultActiveTab={0}>
        {getUserData()?.JOB_NAME !== "Worker" && (
          <MyTabs.Tab title="Kho Liệu">
            <KHOLIEU />
          </MyTabs.Tab>
        )}
        {getUserData()?.JOB_NAME !== "Worker" && (
          <MyTabs.Tab title="ĐỘ TIN CẬY">
            <DTC />
          </MyTabs.Tab>
        )}
        {getUserData()?.JOB_NAME === "Worker" && (
          <MyTabs.Tab title={"LẤY MẪU ICM"}>
            <DKDTC />
          </MyTabs.Tab>
        )}        
        <MyTabs.Tab title={"INCOMING"}>
          <INCOMMING />
        </MyTabs.Tab>
        <MyTabs.Tab title={"HOLDING"}>
          <HOLDING />
        </MyTabs.Tab>
        <MyTabs.Tab title={"FAILING"}>
          <FAILING />
        </MyTabs.Tab>
        {/* {getUserData()?.JOB_NAME!=='Worker' &&   <MyTabs.Tab title="IN-HOLD-FAIL">
          <HOLD_FAIL />
          </MyTabs.Tab>} */}
        {getUserData()?.JOB_NAME !== "Worker" && (
          <MyTabs.Tab title="NCR MANAGEMENT">
            <NCR_MANAGER />
          </MyTabs.Tab>
        )}
      </MyTabs>
    </div>
  );
};
export default IQC;

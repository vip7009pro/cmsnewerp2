import { useEffect } from "react";
import KHOLIEU from "../../kho/kholieu/KHOLIEU";
import "./IQC.scss";
import DTC from "../dtc/DTC";
import HOLD_FAIL from "./HOLD_FAIL";
import NCR_MANAGER from "./NCR_MANAGER";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
const IQC = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  useEffect(() => { }, []);
  return (
    <div className="iqc">
      <Tabs className="tabs" style={{
        fontSize: "0.6rem",
        width: "100%",
      }}>
        <TabList className="tablist" style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "left",
          backgroundImage: theme.CMS.backgroundImage,
          color: 'gray'
        }}>
          <Tab><span className="mininavtext">Kho Liệu</span></Tab>
          <Tab><span className="mininavtext">ĐỘ TIN CẬY</span></Tab>
          <Tab><span className="mininavtext">IN-HOLD-FAIL</span></Tab>
          <Tab><span className="mininavtext">NCR MANAGEMENT</span></Tab>
          {/* <Tab><span className="mininavtext">RMA MANAGEMENT</span></Tab> */}
        </TabList>
        <TabPanel>
          <KHOLIEU />
        </TabPanel>
        <TabPanel>
          <DTC />
        </TabPanel>
        <TabPanel>
          <HOLD_FAIL />
        </TabPanel>
        <TabPanel>
          <NCR_MANAGER />
        </TabPanel>
        {/* <TabPanel>
        </TabPanel> */}
      </Tabs>
    </div>
  );
};
export default IQC;

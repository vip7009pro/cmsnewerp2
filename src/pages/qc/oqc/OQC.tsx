import { useEffect, useState } from "react";
import KHOTP from "../../kho/khotp/KHOTP";
import "./OQC.scss";
import OQC_DATA from "./OQC_DATA";
import OQC_REPORT from "./OQC_REPORT";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
const OQC = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [selection, setSelection] = useState<any>({
    tab1: true,
    tab2: false,
    tab3: false,
  });
  const setNav = (choose: number) => {
    if (choose === 1) {
      setSelection({ ...selection, tab1: true, tab2: false, tab3: false });
    } else if (choose === 2) {
      setSelection({ ...selection, tab1: false, tab2: true, tab3: false });
    } else if (choose === 3) {
      setSelection({ ...selection, tab1: false, tab2: false, tab3: true });
    }
  };

  useEffect(() => {}, []);

  return (
     <div className="oqc">
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
          <Tab>
            <span className="mininavtext">Data Kho Thành Phẩm</span>
          </Tab>
          <Tab>
            <span className="mininavtext">Data OQC</span>
          </Tab>
          <Tab>
            <span className="mininavtext">Báo Cáo</span>
          </Tab>
        </TabList>
        <TabPanel>
          <div className="trainspection">
            <KHOTP />
          </div>
        </TabPanel>
        <TabPanel>
          <div className="trainspection">
            <OQC_DATA />
          </div>
        </TabPanel>
        <TabPanel>
          <div className="trainspection">
            <OQC_REPORT />
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};


export default OQC;

 

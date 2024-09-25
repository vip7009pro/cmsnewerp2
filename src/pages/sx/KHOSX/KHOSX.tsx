import { useEffect, useState } from "react";
import "./KHOSX.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import KHOAO from "../../qlsx/QLSXPLAN/KHOAO/KHOAO";
import KHOSUB from "../../qlsx/QLSXPLAN/KHOAO/KHOSUB";
import KHOLIEU from "../../kho/kholieu/KHOLIEU";
const KHOSX = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  useEffect(() => { }, []);
  return (
    <div className="khosx">
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
            <span className="mininavtext">KHO MAIN</span>
          </Tab>
          <Tab>
            <span className="mininavtext">KHO SUB</span>
          </Tab>
          <Tab>
            <span className="mininavtext">KHO VL</span>
          </Tab>
        </TabList>
        <TabPanel>
          <div className="trainspection">
            <KHOAO />
          </div>
        </TabPanel>
        <TabPanel>
          <div className="trainspection">
            <KHOSUB />
          </div>
        </TabPanel>
        <TabPanel>
          <div className="trainspection">
            <KHOLIEU />
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};
export default KHOSX;

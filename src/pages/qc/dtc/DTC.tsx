import { Profiler, useEffect, useState } from "react";
import "./DTC.scss";
import DKDTC from "./DKDTC";
import KQDTC from "./KQDTC";
import SPECDTC from "./SPECDTC";
import ADDSPECDTC from "./ADDSPECDTC";
import DTCRESULT from "./DTCRESULT";
import TEST_TABLE from "./TEST_TABLE";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { getCompany } from "../../../api/Api";

const DTC = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [selection, setSelection] = useState<any>({
    tab1: true,
    tab2: false,
    tab3: false,
    tab4: false,
    tab5: false,
    tab6: false,
  });

  
  useEffect(() => {}, []);

  return (
    <div className="dtc">
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
              <span className="mininavtext">TRA KQ ĐTC</span>
            </Tab>
            <Tab>
              <span className="mininavtext">TRA SPEC ĐTC</span>
            </Tab>
            <Tab>
              <span className="mininavtext">ADD SPEC ĐTC</span>
            </Tab>  
            <Tab>
              <span className="mininavtext">ĐKÝ TEST ĐTC</span>
            </Tab>
            <Tab>
              <span className="mininavtext">NHẬP KQ ĐTC</span>
            </Tab>
            { getCompany() === "CMS" && <Tab>
              <span className="mininavtext">Quản lý hạng mục ĐTC</span> 
            </Tab>}
          </TabList>
          <TabPanel>
            <KQDTC />
          </TabPanel>
          <TabPanel>
            <SPECDTC />
          </TabPanel>
          <TabPanel>
            <ADDSPECDTC />
          </TabPanel>
          <TabPanel>
            <DKDTC />
          </TabPanel>
          <TabPanel>
            <DTCRESULT />
          </TabPanel>
          { getCompany() === "CMS" && <TabPanel>
            <TEST_TABLE />
          </TabPanel>}
      </Tabs> 
    </div>
  );
};


export default DTC;

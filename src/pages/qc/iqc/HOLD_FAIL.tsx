import { useEffect, useState } from "react";
import KHOLIEU from "../../kho/kholieu/KHOLIEU";
import KQDTC from "../dtc/KQDTC";
import "./HOLD_FAIL.scss";
import SPECDTC from "../dtc/SPECDTC";
import ADDSPECTDTC from "../dtc/ADDSPECDTC";
import DKDTC from "../dtc/DKDTC";
import DTC from "../dtc/DTC";
import HOLDING from "./HOLDING";
import FAILING from "./FAILING";
import INCOMMING from "./INCOMMING";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

const HOLD_FAIL = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [selection, setSelection] = useState<any>({
    tab1: false,
    tab2: false,
    tab3: true,
  });

  const setNav = (choose: number) => {
    if (choose === 1) {
      setSelection({
        ...selection,
        tab1: true,
        tab2: false,
        tab3: false,
        tab4: false,
        tab5: false,
      });
    } else if (choose === 2) {
      setSelection({
        ...selection,
        tab1: false,
        tab2: true,
        tab3: false,
        tab4: false,
        tab5: false,
      });
    } else if (choose === 3) {
      setSelection({
        ...selection,
        tab1: false,
        tab2: false,
        tab3: true,
        tab4: false,
        tab5: false,
      });
    } else if (choose === 4) {
      setSelection({
        ...selection,
        tab1: false,
        tab2: false,
        tab3: false,
        tab4: true,
        tab5: false,
      });
    } else if (choose === 5) {
      setSelection({
        ...selection,
        tab1: false,
        tab2: false,
        tab3: false,
        tab4: false,
        tab5: true,
      });
    }
  };

  useEffect(() => {}, []);

  return (
    <div className="hold_fail">  
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
              <span className="mininavtext">HOLDING</span>
            </Tab>
            <Tab>
              <span className="mininavtext">FAILING</span>
            </Tab>
            <Tab>
              <span className="mininavtext">INCOMMING</span>
            </Tab>
          </TabList>
          <TabPanel>
            <HOLDING />
          </TabPanel>
          <TabPanel>
            <FAILING />
          </TabPanel>
          <TabPanel>
            <INCOMMING /> 
          </TabPanel>
      </Tabs> 
    </div>
  );
};
export default HOLD_FAIL;
      

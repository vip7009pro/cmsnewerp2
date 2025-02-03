import { useEffect, useState, lazy, Suspense } from "react";
import "./KIEMTRA.scss";
import INSPECTION from "./INSPECTION";
import INSPECT_REPORT from "./INSPECT_REPORT";
import INSPECT_STATUS from "./INSPECT_STATUS/INSPECT_STATUS";
import TINHHINHCUONLIEU from "../../sx/TINH_HINH_CUON_LIEU/TINHINHCUONLIEU";
import PATROL from "../../sx/PATROL/PATROL";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { getCompany } from "../../../api/Api";
import INSPECT_REPORT2 from "./INSPECT_REPORT2";
const KIEMTRA = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme); 
  const [selection, setSelection] = useState<any>({
    tab1: true,
    tab2: false,
    tab3: false,
    tab4: false,
    tab5: false,
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
    <div className="kiemtra">
      <Suspense fallback={<div>Loading</div>}> 
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
            <span className="mininavtext">Data Kiểm Tra</span>
          </Tab>
          <Tab>
            <span className="mininavtext">Báo cáo</span>
          </Tab>
          <Tab>
            <span className="mininavtext">ISP STATUS</span>
          </Tab>
          <Tab>
            <span className="mininavtext">Material Status</span>
          </Tab>
          <Tab>
            <span className="mininavtext">PATROL</span>
          </Tab>
        </TabList>
        <TabPanel>
        {selection.tab1 && (
          <div className="trainspection">
            <INSPECTION />
          </div>
        )}
        </TabPanel>
        <TabPanel>
          {(getCompany() ==='CMS' || getCompany() ==='PVN')  ? <INSPECT_REPORT /> : <INSPECT_REPORT2 />}
        </TabPanel>
        <TabPanel>
          <INSPECT_STATUS />
        </TabPanel>
        <TabPanel>
          <TINHHINHCUONLIEU />
        </TabPanel>
        <TabPanel>
          <PATROL />
        </TabPanel> 
        </Tabs>
      </Suspense>
    </div>
  );
};
export default KIEMTRA;

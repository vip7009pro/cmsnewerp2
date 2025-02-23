import React, { useEffect, useState, lazy, Suspense, useContext } from "react";
import "./BAOCAOSXALL.scss";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
const LICHSUINPUTLIEU = React.lazy(() => import("../qlsx/QLSXPLAN/LICHSUINPUTLIEU/LICHSUINPUTLIEU"));
const DATASX = React.lazy(() => import("../qlsx/QLSXPLAN/DATASX/DATASX"));
const LICHSUTEMLOTSX = React.lazy(() => import("./LICHSUTEMLOTSX/LICHSUTEMLOTSX"));
const TINHHINHCUONLIEU = React.lazy(() => import("./TINH_HINH_CUON_LIEU/TINHINHCUONLIEU"));
const BAOCAOTHEOROLL = React.lazy(() => import("./BAOCAOTHEOROLL/BAOCAOTHEOROLL"));
const ACHIVEMENTTB = React.lazy(() => import("../qlsx/QLSXPLAN/ACHIVEMENTTB/ACHIVEMENTTB"));
const PATROL = React.lazy(() => import("./PATROL/PATROL"));
const DAOFILMDATA = React.lazy(() => import("./LICHSUDAOFILM/DAOFILMDATA"));
import { getlang } from "../../components/String/String";
import { LangConText } from "../../api/Context";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import FAILING from "../qc/iqc/FAILING";
import MAINDEFECTS from "./MAINDEFECTS/MAINDEFECTS";
import { getCompany } from "../../api/Api";
import BTP_AUTO from "./BTP_AUTO/BTP_AUTO";
const BAOCAOSXALL = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [lang, setLang] = useContext(LangConText);
  useEffect(() => { }, []);
  return (
    <div className="qlsxplan">
      <Suspense fallback={<div> Loading...</div>}>
        <Tabs className="tabs" style={{
          fontSize: "0.6rem",
          width: "100%",
        }}
          forceRenderTabPanel={false}
        >
          <TabList className="tablist" style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "left",
            backgroundImage: theme.CMS.backgroundImage,
            color: 'gray'
          }}>
            <Tab>
              <span className="mininavtext">{getlang("nhatkysanxuat", lang)}</span>
            </Tab>
            <Tab>
              <span className="mininavtext">{getlang("lichsuxuatlieuthat", lang)}</span>
            </Tab>
            <Tab>
              <span className="mininavtext">{getlang("lichsutemlotsx", lang)}</span>
            </Tab>
            <Tab>
              <span className="mininavtext">{getlang("materiallotstatus", lang)}</span>
            </Tab>
            <Tab>
              <span className="mininavtext">{getlang("sxrolldata", lang)}</span>
            </Tab>
            <Tab>
              <span className="mininavtext">Plan-Result</span>
            </Tab>
            <Tab>
              <span className="mininavtext">Data Dao Film</span>
            </Tab>
            { getCompany() === "CMS" && <Tab>
              <span className="mininavtext">Failing</span>
            </Tab>}
            <Tab>
              <span className="mininavtext">Patrol</span>
            </Tab>
            { getCompany() === "CMS" && <Tab>
              <span className="mininavtext">Main Defects</span>
            </Tab>}
            { getCompany() === "CMS" && <Tab>
              <span className="mininavtext">BTP Data</span>
            </Tab>}
          </TabList>
          <TabPanel>
            <DATASX />
          </TabPanel>
          <TabPanel>
            <LICHSUINPUTLIEU />
          </TabPanel>
          <TabPanel>
            <LICHSUTEMLOTSX />
          </TabPanel>
          <TabPanel>
            <TINHHINHCUONLIEU />
          </TabPanel>
          <TabPanel>
            <BAOCAOTHEOROLL />
          </TabPanel>
          <TabPanel>
            <ACHIVEMENTTB />
          </TabPanel>
          <TabPanel>
            <DAOFILMDATA />
          </TabPanel>
          { getCompany() === "CMS" && <TabPanel>
            <FAILING />
          </TabPanel>}
          <TabPanel>
            <PATROL />
          </TabPanel>
          { getCompany() === "CMS" && <TabPanel>
            <MAINDEFECTS />
          </TabPanel>}
          { getCompany() === "CMS" && <TabPanel>
            <BTP_AUTO />
          </TabPanel>}
        </Tabs>
      </Suspense>
    </div>
  );
};
export default BAOCAOSXALL;

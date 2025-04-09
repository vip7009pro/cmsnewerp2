import React, { useEffect, Suspense, useContext } from "react";
import "./BAOCAOSXALL.scss";
const LICHSUINPUTLIEU = React.lazy(() => import("../qlsx/QLSXPLAN/LICHSUINPUTLIEU/LICHSUINPUTLIEU"));
const DATASX = React.lazy(() => import("../qlsx/QLSXPLAN/DATASX/DATASX"));
const LICHSUTEMLOTSX = React.lazy(() => import("./LICHSUTEMLOTSX/LICHSUTEMLOTSX"));
const TINHHINHCUONLIEU = React.lazy(() => import("./TINH_HINH_CUON_LIEU/TINHINHCUONLIEU"));
const BAOCAOTHEOROLL = React.lazy(() => import("./BAOCAOTHEOROLL/BAOCAOTHEOROLL"));
const ACHIVEMENTTB = React.lazy(() => import("../qlsx/QLSXPLAN/ACHIVEMENTTB/ACHIVEMENTTB"));
const PATROL = React.lazy(() => import("./PATROL/PATROL"));
const DAOFILMDATA = React.lazy(() => import("./LICHSUDAOFILM/DAOFILMDATA"));
const BTP_AUTO = React.lazy(() => import("./BTP_AUTO/BTP_AUTO"));
const FAILING = React.lazy(() => import("../qc/iqc/FAILING"));
const MAINDEFECTS = React.lazy(() => import("./MAINDEFECTS/MAINDEFECTS"));
const BAOCAOFULLROLL = React.lazy(() => import("./BAOCAOTHEOROLL/BAOCAOFULLROLL"));
import { getlang } from "../../components/String/String";
import { LangConText } from "../../api/Context";
import { getCompany } from "../../api/Api";
import MyTabs from "../../components/MyTab/MyTab";
const BAOCAOSXALL = () => {
  const [lang, setLang] = useContext(LangConText);
  useEffect(() => { }, []);
  return (
    <div className="qlsxplan">
      <Suspense fallback={<div>Loading...</div>}>
        <MyTabs defaultActiveTab={0}>
          <MyTabs.Tab title={getlang("nhatkysanxuat", lang)}>
            <DATASX />
          </MyTabs.Tab>
          <MyTabs.Tab title={getlang("lichsuxuatlieuthat", lang)}>
            <LICHSUINPUTLIEU />
          </MyTabs.Tab>
          <MyTabs.Tab title={getlang("lichsutemlotsx", lang)}>
            <LICHSUTEMLOTSX />
          </MyTabs.Tab>
          <MyTabs.Tab title={getlang("materiallotstatus", lang)}>
            <TINHHINHCUONLIEU />
          </MyTabs.Tab>
          <MyTabs.Tab title={getlang("sxrolldata", lang)}>
            <BAOCAOTHEOROLL />
          </MyTabs.Tab>
          {getCompany()==='CMS' && <MyTabs.Tab title={getlang("baocaofullroll", lang)}>
            <BAOCAOFULLROLL />
          </MyTabs.Tab>}
          <MyTabs.Tab title="Plan-Result">
            <ACHIVEMENTTB />
          </MyTabs.Tab>
          <MyTabs.Tab title="Data Dao Film">
            <DAOFILMDATA />
          </MyTabs.Tab>
          {getCompany() === "CMS" && (
            <MyTabs.Tab title="Failing">
              <FAILING />
            </MyTabs.Tab>
          )}
          <MyTabs.Tab title="Patrol">
            <PATROL />
          </MyTabs.Tab>
          {getCompany() === "CMS" && (
            <MyTabs.Tab title="Main Defects">
              <MAINDEFECTS />
            </MyTabs.Tab>
          )}
          {getCompany() === "CMS" && (
            <MyTabs.Tab title="BTP Data">
              <BTP_AUTO />
            </MyTabs.Tab>
          )}
        </MyTabs>
      </Suspense>
    </div>
  );
};
export default BAOCAOSXALL;
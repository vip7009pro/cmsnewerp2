import React, { useEffect, Suspense, useContext, lazy } from "react";
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
import { getCompany, getUserData } from "../../api/Api";
import MyTabs from "../../components/MyTab/MyTab";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
const KPI_NVSX = lazy(() => import("./KPI_NV/KPI_NVSX"));
const DATASAMPLESX = lazy(() => import("./DATASAMPLE/DATASAMPLESX"));
const KPI_NVSX_NEW = lazy(() => import("./KPI_NV_NEW/KPI_NV_NEW"));
const BAOCAOSXALL = () => {
    const lang: string | undefined = useSelector(
      (state: RootState) => state.totalSlice.lang
    );

  useEffect(() => { }, []);
  return (
    <div className="qlsxplan">
      <Suspense fallback={<div>Loading...</div>}>
        <MyTabs defaultActiveTab={0}>
          
          {getUserData()?.JOB_NAME !== "Worker" && <MyTabs.Tab title={getlang("nhatkysanxuat", lang ?? "en")}>
            <DATASX />
          </MyTabs.Tab>}
          {getUserData()?.JOB_NAME !== "Worker" && <MyTabs.Tab title={getlang("lichsuxuatlieuthat", lang ?? "en")}>
            <LICHSUINPUTLIEU />
          </MyTabs.Tab>}
          {getUserData()?.JOB_NAME !== "Worker" && <MyTabs.Tab title={getlang("lichsutemlotsx", lang ?? "en")}>
            <LICHSUTEMLOTSX />
          </MyTabs.Tab>}
          {getUserData()?.JOB_NAME !== "Worker" && <MyTabs.Tab title={getlang("materiallotstatus", lang ?? "en")}>
            <TINHHINHCUONLIEU />
          </MyTabs.Tab>}
          {getUserData()?.JOB_NAME !== "Worker" && <MyTabs.Tab title={getlang("sxrolldata", lang ?? "en")}>
            <BAOCAOTHEOROLL />
          </MyTabs.Tab>}
          {getCompany()==='CMS' &&  getUserData()?.JOB_NAME !== "Worker" && <MyTabs.Tab title={getlang("baocaofullroll", lang ?? "en")}>
            <BAOCAOFULLROLL />
          </MyTabs.Tab>}
          {getUserData()?.JOB_NAME !== "Worker" && <MyTabs.Tab title="Plan-Result">
            <ACHIVEMENTTB />
          </MyTabs.Tab>}
          {getUserData()?.JOB_NAME !== "Worker" && <MyTabs.Tab title="Data Dao Film">
            <DAOFILMDATA />
          </MyTabs.Tab>}
          {getCompany() === "CMS" && getUserData()?.JOB_NAME !== "Worker" && <MyTabs.Tab title="Failing">
            <FAILING />
          </MyTabs.Tab>}
          {getUserData()?.JOB_NAME !== "Worker" && <MyTabs.Tab title="Patrol">
            <PATROL />
          </MyTabs.Tab>}
          {getCompany() === "CMS" && getUserData()?.JOB_NAME !== "Worker" && (
            <MyTabs.Tab title="Main Defects">
              <MAINDEFECTS />
            </MyTabs.Tab>
          )}
          {getCompany() === "CMS" && getUserData()?.JOB_NAME !== "Worker" && (
            <MyTabs.Tab title="BTP Data">
              <BTP_AUTO />
            </MyTabs.Tab>
          )}
          {getUserData()?.JOB_NAME !== "Worker" && getCompany() === "CMS" && <MyTabs.Tab title="KPI NV">
            <KPI_NVSX />
          </MyTabs.Tab>}
          {getUserData()?.JOB_NAME !== "Worker" && getCompany() !== "CMS" &&<MyTabs.Tab title="KPI NEW">
            <KPI_NVSX_NEW />
          </MyTabs.Tab>}
          {getCompany() === "CMS" && <MyTabs.Tab title="Data Sample">
            <DATASAMPLESX />
          </MyTabs.Tab>}
        </MyTabs>
      </Suspense>
    </div>
  );
};
export default BAOCAOSXALL;
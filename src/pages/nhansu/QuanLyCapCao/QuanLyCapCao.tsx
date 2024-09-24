import React, { Suspense, useEffect, useState } from "react";
const DiemDanhNhomBP = React.lazy(() => import("../DiemDanhNhom/DiemDanhBP"));
const DieuChuyenTeamBP = React.lazy(() => import("../DieuChuyenTeam/DieuChuyenTeamBP"));
const PheDuyetNghiBP = React.lazy(() => import("../PheDuyetNghi/PheDuyetNghiBP"));
import "./QuanLyCapCao.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { getlang } from "../../../components/String/String";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
const QuanLyCapCao = () => {
  const glbLang: string | undefined = useSelector(
    (state: RootState) => state.totalSlice.lang,
  );
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
  useEffect(() => { }, []);
  return (
    <div className="quanlycapcao">
      <Suspense fallback={<div> Loading...</div>}>
      <Tabs className="tabs" style={{
        fontSize: "0.6rem",
        width: "100%",
      }}>
        <TabList className="tablist" style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          backgroundImage: theme.CMS.backgroundImage,
          justifyContent: "left", 
        }}>
          <Tab>
            <span className="mininavtext"> {getlang("diemdanhtoanbophan", glbLang!)}</span>
          </Tab>
          <Tab>
            <span className="mininavtext">{getlang("pheduyetnghitoanbophan", glbLang!)}</span>
          </Tab>
          <Tab>
            <span className="mininavtext">{getlang("dieuchuyentoanbophan", glbLang!)}</span>  
          </Tab>
        </TabList>
        <TabPanel>
          <DiemDanhNhomBP />
        </TabPanel>
        <TabPanel>
          <PheDuyetNghiBP />
        </TabPanel>
        <TabPanel>  
          <DieuChuyenTeamBP />
          </TabPanel>
        </Tabs>
      </Suspense>
    </div>
  );
};
export default QuanLyCapCao;

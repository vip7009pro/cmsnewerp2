import { Suspense, useEffect, useState } from "react";
import PLAN_STATUS from "../../qlsx/QLSXPLAN/PLAN_STATUS/PLAN_STATUS";
import TINH_HINH_CHOT from "../TINH_HINH_CHOT/TINH_HINH_CHOT";
import "./TRANGTHAICHITHI.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
const TRANGTHAICHITHI = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  useEffect(() => { }, []);
  return (
    <div className="trangthaichithisx">
      <Suspense fallback={<div> Loading...</div>}>
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
            color: "gray",
            overflow: "hidden",
          }}>
            <Tab>PLAN STATUS</Tab>
            <Tab>TÌNH HÌNH CHỐT</Tab>
          </TabList>
          <TabPanel>
            <PLAN_STATUS />
          </TabPanel>
          <TabPanel>
            <TINH_HINH_CHOT />
          </TabPanel>
        </Tabs>
      </Suspense>
    </div>
  );
};
export default TRANGTHAICHITHI;

import { Outlet } from "react-router-dom";
import "../home/home.scss";
import { useSpring, animated } from "@react-spring/web";
import React, { useEffect, useRef, useState, useContext, Suspense } from "react";
import { generalQuery, getCompany, getUserData, logout } from "../../api/ApiVendors";
import Swal from "sweetalert2";
import { IconButton, Tab, TabProps, Tabs, Typography } from "@mui/material";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { RootState } from "../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { closeTab, settabIndex } from "../../redux/slices/globalSlice";
import styled from "@emotion/styled";
import Cookies from "universal-cookie";
import { getlang } from "../../components/String/String";
import { MENU_LIST_DATA, UserData } from "../../api/GlobalInterface";

import SqlEditor from "../nocodelowcode/components/TestBackEnd/SqlEditor";
import NavbarVendors from "../../components/Navbar/NavbarVendors";
import HomePageVendors from "../../components/Vendors/Home/HomeVendors";

export const current_ver: number = getCompany() === "CMS" ? 2618 : 423;

import { AccountInfo, AddInfo, BANGCHAMCONG, BaoCaoNhanSu, BAOCAOSXALL, BAOCAOTHEOROLL, BCSX, Blank, BOM_AMAZON, BOM_MANAGER, CAPA_MANAGER, CODE_MANAGER, CSTOTAL, CUST_MANAGER, DESIGN_AMAZON, DiemDanhNhomCMS, DieuChuyenTeamCMS, DTC, EQ_STATUS, EQ_STATUS2, FCSTManager, FileTransfer, Information, INSPECT_STATUS, InvoiceManager, IQC, ISO, KHOAO, KHOLIEU, KHOSUB, KHOSX, KHOTP, KHOTPNEW, KIEMTRA, KinhDoanhReport, LichSu_New, LICHSUINPUTLIEU, LICHSUTEMLOTSX, MACHINE, Navbar, NOCODELOWCODE, OQC, OVER_MONITOR, PermissionNotify, PheDuyetNghiCMS, PLAN_DATATB, PLAN_STATUS, PlanManager, PLANRESULT, POandStockFull, PoManager, PostManager, PQC, PRODUCT_BARCODE_MANAGER, QCReport, QLSXPLAN, QLVL, QuanLyCapCao, QuanLyCapCao_NS, QuanLyPhongBanNhanSu, QuanLyPhongBanNhanSu_Old, QUICKPLAN2, QuotationTotal, RND_REPORT, SAMPLE_MONITOR, SettingPage, ShortageKD, TabDangKy, TINHHINHCUONLIEU, TINHLIEU, TINHLUONGP3, TRANGTHAICHITHI, YCSXManager } from "../../api/lazyPages";

interface ELE_ARRAY {
  REACT_ELE: any;
  ELE_NAME: string;
  ELE_CODE: string;
}
export const CustomTab = styled((props: TabProps) => <Tab {...props} />)({
  // Tùy chỉnh kiểu cho tab tại đây
  color: "gray", // Ví dụ: đặt màu chữ là màu xanh
  fontWeight: 200, // Ví dụ: đặt độ đậm cho chữ
  // Thêm các kiểu tùy chỉnh khác tại đây...
});
function HomeVendors() {

  const cookies = new Cookies();
  const company: string = useSelector(
    (state: RootState) => state.totalSlice.company
  );
  const lang: string | undefined = useSelector(
    (state: RootState) => state.totalSlice.lang
  );
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const tabs: ELE_ARRAY[] = useSelector(
    (state: RootState) => state.totalSlice.tabs
  );
  const tabIndex: number = useSelector(
    (state: RootState) => state.totalSlice.tabIndex
  );
  const tabModeSwap: boolean = useSelector(
    (state: RootState) => state.totalSlice.tabModeSwap
  );
  const sidebarStatus : boolean | undefined = useSelector(
    (state: RootState) => state.totalSlice.sidebarmenu,
  );
  console.log('company', company);
  const menulist: MENU_LIST_DATA[] = company === 'CMS' ? [
    {
      MENU_CODE: "BL1",
      MENU_NAME: "XXX",
      MENU_ITEM: <Blank />,
    },
    {
      MENU_CODE: "NS0",
      MENU_NAME: "Account Info",
      MENU_ITEM: <HomePageVendors />,
    },
    {
      MENU_CODE: "NS1",
      MENU_NAME: getlang("quanlyphongban", lang ?? "en"),
      MENU_ITEM: <QuanLyPhongBanNhanSu />,
    },
    {
      MENU_CODE: "NS2",
      MENU_NAME: getlang("diemdanhnhom", lang ?? "en"),
      MENU_ITEM: <DiemDanhNhomCMS option="diemdanhnhomNS" />,
    },
    {
      MENU_CODE: "NS3",
      MENU_NAME: getlang("dieuchuyenteam", lang ?? "en"),
      MENU_ITEM: <DieuChuyenTeamCMS option1="diemdanhnhomNS" option2="workpositionlist_NS" />,
    },
    {
      MENU_CODE: "NS4",
      MENU_NAME: getlang("dangky", lang ?? "en"),
      MENU_ITEM: <TabDangKy />,
    },
    {
      MENU_CODE: "NS5",
      MENU_NAME: getlang("pheduyet", lang ?? "en"),
      MENU_ITEM: <PheDuyetNghiCMS option="pheduyetnghi" />,
    },
    {
      MENU_CODE: "NS6",
      MENU_NAME: getlang("lichsudilam", lang ?? "en"),
      MENU_ITEM: <LichSu_New />,
    },
    {
      MENU_CODE: "NS7",
      MENU_NAME: getlang("quanlycapcao", lang ?? "en"),
      MENU_ITEM: <QuanLyCapCao />,
    },
    {
      MENU_CODE: "NS8",
      MENU_NAME: getlang("baocaonhansu", lang ?? "en"),
      MENU_ITEM: <BaoCaoNhanSu />,
    },
    {
      MENU_CODE: "NS9",
      MENU_NAME: getlang("listchamcong", lang ?? "en"),
      MENU_ITEM: <BANGCHAMCONG />,
    },
    {
      MENU_CODE: "NS10",
      MENU_NAME: getlang("quanlycapcao", lang ?? "en"),
      MENU_ITEM: <QuanLyCapCao_NS />,
    },
    {
      MENU_CODE: "KD1",
      MENU_NAME: getlang("quanlypo", lang ?? "en"),
      MENU_ITEM: <PoManager />,
    },
    {
      MENU_CODE: "KD2",
      MENU_NAME: getlang("quanlyinvoices", lang ?? "en"),
      MENU_ITEM: <InvoiceManager />,
    },
    {
      MENU_CODE: "KD3",
      MENU_NAME: getlang("quanlyplan", lang ?? "en"),
      MENU_ITEM: <PlanManager />,
    },
    {
      MENU_CODE: "KD4",
      MENU_NAME: getlang("shortage", lang ?? "en"),
      MENU_ITEM: <ShortageKD />,
    },
    {
      MENU_CODE: "KD5",
      MENU_NAME: getlang("quanlyFCST", lang ?? "en"),
      MENU_ITEM: <FCSTManager />,
    },
    {
      MENU_CODE: "KD6",
      MENU_NAME: getlang("quanlyYCSX", lang ?? "en"),
      MENU_ITEM: <YCSXManager />,
    },
    {
      MENU_CODE: "KD7",
      MENU_NAME: getlang("quanlyPOFull", lang ?? "en"),
      MENU_ITEM: <POandStockFull />,
    },
    {
      MENU_CODE: "KD8",
      MENU_NAME: getlang("thongtinsanpham", lang ?? "en"),
      MENU_ITEM: <CODE_MANAGER />,
    },
    {
      MENU_CODE: "KD9",
      MENU_NAME: getlang("quanlycodebom", lang ?? "en"),
      MENU_ITEM: <BOM_MANAGER />,
    },
    {
      MENU_CODE: "KD10",
      MENU_NAME: getlang("quanlykhachhang", lang ?? "en"),
      MENU_ITEM: <CUST_MANAGER />,
    },
    {
      MENU_CODE: "KD11",
      MENU_NAME: getlang("eqstatus", lang ?? "en"),
      MENU_ITEM: <EQ_STATUS2 />,
    },
    {
      MENU_CODE: "KD12",
      MENU_NAME: getlang("ins_status", lang ?? "en"),
      MENU_ITEM: <INSPECT_STATUS />,
    },
    {
      MENU_CODE: "KD13",
      MENU_NAME: getlang("baocao", lang ?? "en"),
      MENU_ITEM: <KinhDoanhReport />,
    },
    {
      MENU_CODE: "KD14",
      MENU_NAME: getlang("quanlygia", lang ?? "en"),
      MENU_ITEM: <QuotationTotal />,
    },
    {
      MENU_CODE: "KD15",
      MENU_NAME: getlang("ins_status", lang ?? "en"),
      MENU_ITEM: <OVER_MONITOR />,
    },
    {
      MENU_CODE: "PU1",
      MENU_NAME: getlang("quanlyvatlieu", lang ?? "en"),
      MENU_ITEM: <QLVL />,
    },
    {
      MENU_CODE: "PU2",
      MENU_NAME: getlang("quanlymrp", lang ?? "en"),
      MENU_ITEM: <TINHLIEU />,
    },
    {
      MENU_CODE: "QC1",
      MENU_NAME: getlang("quanlyYCSX", lang ?? "en"),
      MENU_ITEM: <YCSXManager />,
    },
    {
      MENU_CODE: "QC2",
      MENU_NAME: getlang("thongtinsanpham", lang ?? "en"),
      MENU_ITEM: <CODE_MANAGER />,
    },
    {
      MENU_CODE: "QC3",
      MENU_NAME: "IQC",
      MENU_ITEM: <IQC />,
    },
    {
      MENU_CODE: "QC4",
      MENU_NAME: "PQC",
      MENU_ITEM: <PQC />,
    },
    {
      MENU_CODE: "QC5",
      MENU_NAME: "OQC",
      MENU_ITEM: <OQC />,
    },
    {
      MENU_CODE: "QC6",
      MENU_NAME: getlang("inspection", lang ?? "en"),
      MENU_ITEM: <KIEMTRA />,
    },
    {
      MENU_CODE: "QC7",
      MENU_NAME: "CS",
      MENU_ITEM: <CSTOTAL />,
    },
    {
      MENU_CODE: "QC8",
      MENU_NAME: getlang("dtc", lang ?? "en"),
      MENU_ITEM: <DTC />,
    },
    {
      MENU_CODE: "QC9",
      MENU_NAME: "ISO",
      MENU_ITEM: <ISO />,
    },
    {
      MENU_CODE: "QC10",
      MENU_NAME: getlang("baocaoqc", lang ?? "en"),
      MENU_ITEM: <QCReport />,
    },
    {
      MENU_CODE: "RD1",
      MENU_NAME: getlang("quanlycodebom", lang ?? "en"),
      MENU_ITEM: <BOM_MANAGER />,
    },
    {
      MENU_CODE: "RD2",
      MENU_NAME: getlang("thembomamazon", lang ?? "en"),
      MENU_ITEM: <BOM_AMAZON />,
    },
    {
      MENU_CODE: "RD3",
      MENU_NAME: getlang("dtc", lang ?? "en"),
      MENU_ITEM: <DTC />,
    },
    {
      MENU_CODE: "RD4",
      MENU_NAME: getlang("quanlyYCSX", lang ?? "en"),
      MENU_ITEM: <YCSXManager />,
    },
    {
      MENU_CODE: "RD5",
      MENU_NAME: getlang("thietkedesignamazon", lang ?? "en"),
      MENU_ITEM: <DESIGN_AMAZON />,
    },
    {
      MENU_CODE: "RD6",
      MENU_NAME: getlang("productbarcodemanager", lang ?? "en"),
      MENU_ITEM: <PRODUCT_BARCODE_MANAGER />,
    },
    {
      MENU_CODE: "RD7",
      MENU_NAME: getlang("baocaornd", lang ?? "en"),
      MENU_ITEM: <RND_REPORT />,
    },
    {
      MENU_CODE: "RD8",
      MENU_NAME: getlang("samplemonitor", lang ?? "en"),
      MENU_ITEM: <SAMPLE_MONITOR />,
    },
    {
      MENU_CODE: "QL1",
      MENU_NAME: getlang("quanlyYCSX", lang ?? "en"),
      MENU_ITEM: <YCSXManager />,
    },
    {
      MENU_CODE: "QL2",
      MENU_NAME: getlang("quanlycodebom", lang ?? "en"),
      MENU_ITEM: <BOM_MANAGER />,
    },
    {
      MENU_CODE: "QL3",
      MENU_NAME: getlang("thongtinsanpham", lang ?? "en"),
      MENU_ITEM: <CODE_MANAGER />,
    },
    {
      MENU_CODE: "QL4",
      MENU_NAME: getlang("quanlyplansx", lang ?? "en"),
      MENU_ITEM: <QLSXPLAN />,
    },
    {
      MENU_CODE: "QL5",
      MENU_NAME: getlang("quanlycapa", lang ?? "en"),
      MENU_ITEM: <CAPA_MANAGER />,
    },
    {
      MENU_CODE: "QL6",
      MENU_NAME: getlang("quanlymrp", lang ?? "en"),
      MENU_ITEM: <CAPA_MANAGER />,
    },
    {
      MENU_CODE: "QL7",
      MENU_NAME: "PLAN VISUAL",
      MENU_ITEM: <MACHINE />,
    },
    {
      MENU_CODE: "QL8",
      MENU_NAME: "QUICK PLAN",
      MENU_ITEM: <QUICKPLAN2 />,
    },
    {
      MENU_CODE: "QL9",
      MENU_NAME: "TRA PLAN",
      MENU_ITEM: <PLAN_DATATB />,
    },
    {
      MENU_CODE: "QL10",
      MENU_NAME: "INPUT LIEU",
      MENU_ITEM: <LICHSUINPUTLIEU />,
    },
    {
      MENU_CODE: "QL11",
      MENU_NAME: "PLAN STATUS",
      MENU_ITEM: <PLAN_STATUS />,
    },
    {
      MENU_CODE: "QL12",
      MENU_NAME: "EQ STATUS",
      MENU_ITEM: <EQ_STATUS />,
    },
    {
      MENU_CODE: "SX1",
      MENU_NAME: getlang("quanlyYCSX", lang ?? "en"),
      MENU_ITEM: <YCSXManager />,
    },
    {
      MENU_CODE: "SX2",
      MENU_NAME: getlang("thongtinsanpham", lang ?? "en"),
      MENU_ITEM: <CODE_MANAGER />,
    },
    {
      MENU_CODE: "SX3",
      MENU_NAME: getlang("datasanxuat", lang ?? "en"),
      MENU_ITEM: <BAOCAOSXALL />,
    },
    {
      MENU_CODE: "SX4",
      MENU_NAME: getlang("inspection", lang ?? "en"),
      MENU_ITEM: <KIEMTRA />,
    },
    {
      MENU_CODE: "SX5",
      MENU_NAME: getlang("planstatus", lang ?? "en"),
      MENU_ITEM: <TRANGTHAICHITHI />,
    },
    {
      MENU_CODE: "SX6",
      MENU_NAME: getlang("eqstatus", lang ?? "en"),
      MENU_ITEM: <EQ_STATUS />,
    },
    {
      MENU_CODE: "SX7",
      MENU_NAME: getlang("khothat", lang ?? "en"),
      MENU_ITEM: <KHOLIEU />,
    },
    {
      MENU_CODE: "SX8",
      MENU_NAME: getlang("khoao", lang ?? "en"),
      MENU_ITEM: <KHOAO />,
    },
    {
      MENU_CODE: "SX15",
      MENU_NAME: getlang("khosub", lang ?? "en"),
      MENU_ITEM: <KHOSUB />,
    },
    {
      MENU_CODE: "SX16",
      MENU_NAME: getlang("eqstatus", lang ?? "en"),
      MENU_ITEM: <EQ_STATUS2 />,
    },
    {
      MENU_CODE: "SX17",
      MENU_NAME: getlang("khosx", lang ?? "en"),
      MENU_ITEM: <KHOSX />,
    },
    {
      MENU_CODE: "SX18",
      MENU_NAME: getlang("tinhluongP3", lang ?? "en"),
      MENU_ITEM: <TINHLUONGP3 />,
    },
    {
      MENU_CODE: "SX11",
      MENU_NAME: getlang("quanlycapa", lang ?? "en"),
      MENU_ITEM: <CAPA_MANAGER />,
    },
    {
      MENU_CODE: "SX12",
      MENU_NAME: getlang("hieusuatsx", lang ?? "en"),
      MENU_ITEM: <PLANRESULT />,
    },
    {
      MENU_CODE: "SX13",
      MENU_NAME: getlang("baocaosx", lang ?? "en"),
      MENU_ITEM: <BCSX />,
    },
    {
      MENU_CODE: "KO1",
      MENU_NAME: getlang("nhapxuattontp", lang ?? "en"),
      MENU_ITEM: company === "CMS" ? <KHOTP /> : <KHOTPNEW />,
    },
    {
      MENU_CODE: "KO2",
      MENU_NAME: getlang("nhapxuattonlieu", lang ?? "en"),
      MENU_ITEM: <KHOLIEU />,
    },
    {
      MENU_CODE: "IF1",
      MENU_NAME: getlang("information_board", lang ?? "en"),
      MENU_ITEM: <Information />,
    },
    {
      MENU_CODE: "IF2",
      MENU_NAME: getlang("information_register", lang ?? "en"),
      MENU_ITEM: <AddInfo />,
    },
    {
      MENU_CODE: "IF3",
      MENU_NAME: getlang("post_manager", lang ?? "en"),
      MENU_ITEM: <PostManager />,
    },
    {
      MENU_CODE: "TL1",
      MENU_NAME: getlang("filetransfer", lang ?? "en"),
      MENU_ITEM: <FileTransfer />,
    },
    {
      MENU_CODE: "TL2",
      MENU_NAME: getlang("nocodelowcode", lang ?? "en"),
      MENU_ITEM: getUserData()?.EMPL_NO==='NHU1903' ? <SqlEditor />: <></>,
    },
    {
      MENU_CODE: "ST01",
      MENU_NAME: "Setting",
      MENU_ITEM: <SettingPage />,
    },
    {
      MENU_CODE: "",
      MENU_NAME: "",
      MENU_ITEM: <HomePageVendors />,
    },
    {
      MENU_CODE: "-1",
      MENU_NAME: "",
      MENU_ITEM: <HomePageVendors />,
    },
  ] : [
    {
      MENU_CODE: "BL1",
      MENU_NAME: "XXX",
      MENU_ITEM: <Blank />,
    },
    {
      MENU_CODE: "NS0",
      MENU_NAME: "Account Info",
      MENU_ITEM: <HomePageVendors />,
    },
    {
      MENU_CODE: "NS1",
      MENU_NAME: getlang("quanlyphongban", lang ?? "en"),
      MENU_ITEM: <QuanLyPhongBanNhanSu_Old />,
    },
    {
      MENU_CODE: "NS2",
      MENU_NAME: getlang("diemdanhnhom", lang ?? "en"),
      MENU_ITEM: <DiemDanhNhomCMS option="diemdanhnhomNS" />,
    },
    {
      MENU_CODE: "NS3",
      MENU_NAME: getlang("dieuchuyenteam", lang ?? "en"),
      MENU_ITEM: <DieuChuyenTeamCMS option1="diemdanhnhomNS" option2="workpositionlist_NS" />,
    },
    {
      MENU_CODE: "NS4",
      MENU_NAME: getlang("dangky", lang ?? "en"),
      MENU_ITEM: <TabDangKy />,
    },
    {
      MENU_CODE: "NS5",
      MENU_NAME: getlang("pheduyet", lang ?? "en"),
      MENU_ITEM: <PheDuyetNghiCMS option="pheduyetnghi" />,
    },
    {
      MENU_CODE: "NS6",
      MENU_NAME: getlang("lichsudilam", lang ?? "en"),
      MENU_ITEM: <LichSu_New />,
    },
    {
      MENU_CODE: "NS7",
      MENU_NAME: getlang("quanlycapcao", lang ?? "en"),
      MENU_ITEM: <QuanLyCapCao />,
    },
    {
      MENU_CODE: "NS8",
      MENU_NAME: getlang("baocaonhansu", lang ?? "en"),
      MENU_ITEM: <BaoCaoNhanSu />,
    },
    {
      MENU_CODE: "NS9",
      MENU_NAME: getlang("listchamcong", lang ?? "en"),
      MENU_ITEM: <BANGCHAMCONG />,
    },
    {
      MENU_CODE: "NS10",
      MENU_NAME: getlang("quanlycapcao", lang ?? "en"),
      MENU_ITEM: <QuanLyCapCao_NS />,
    },
    {
      MENU_CODE: "KD1",
      MENU_NAME: getlang("quanlypo", lang ?? "en"),
      MENU_ITEM: <PoManager />,
    },
    {
      MENU_CODE: "KD2",
      MENU_NAME: getlang("quanlyinvoices", lang ?? "en"),
      MENU_ITEM: <InvoiceManager />,
    },
    {
      MENU_CODE: "KD3",
      MENU_NAME: getlang("quanlyplan", lang ?? "en"),
      MENU_ITEM: <PlanManager />,
    },
    {
      MENU_CODE: "KD4",
      MENU_NAME: getlang("shortage", lang ?? "en"),
      MENU_ITEM: <ShortageKD />,
    },
    {
      MENU_CODE: "KD5",
      MENU_NAME: getlang("quanlyFCST", lang ?? "en"),
      MENU_ITEM: <FCSTManager />,
    },
    {
      MENU_CODE: "KD6",
      MENU_NAME: getlang("quanlyYCSX", lang ?? "en"),
      MENU_ITEM: <YCSXManager />,
    },
    {
      MENU_CODE: "KD7",
      MENU_NAME: getlang("quanlyPOFull", lang ?? "en"),
      MENU_ITEM: <POandStockFull />,
    },
    {
      MENU_CODE: "KD8",
      MENU_NAME: getlang("thongtinsanpham", lang ?? "en"),
      MENU_ITEM: <CODE_MANAGER />,
    },
    {
      MENU_CODE: "KD9",
      MENU_NAME: getlang("quanlycodebom", lang ?? "en"),
      MENU_ITEM: <BOM_MANAGER />,
    },
    {
      MENU_CODE: "KD10",
      MENU_NAME: getlang("quanlykhachhang", lang ?? "en"),
      MENU_ITEM: <CUST_MANAGER />,
    },
    {
      MENU_CODE: "KD11",
      MENU_NAME: getlang("eqstatus", lang ?? "en"),
      MENU_ITEM: <EQ_STATUS2 />,
    },
    {
      MENU_CODE: "KD12",
      MENU_NAME: getlang("ins_status", lang ?? "en"),
      MENU_ITEM: <INSPECT_STATUS />,
    },
    {
      MENU_CODE: "KD13",
      MENU_NAME: getlang("baocao", lang ?? "en"),
      MENU_ITEM: <KinhDoanhReport />,
    },
    {
      MENU_CODE: "KD14",
      MENU_NAME: getlang("quanlygia", lang ?? "en"),
      MENU_ITEM: <QuotationTotal />,
    },
    {
      MENU_CODE: "PU1",
      MENU_NAME: getlang("quanlyvatlieu", lang ?? "en"),
      MENU_ITEM: <QLVL />,
    },
    {
      MENU_CODE: "PU2",
      MENU_NAME: getlang("quanlymrp", lang ?? "en"),
      MENU_ITEM: <TINHLIEU />,
    },
    {
      MENU_CODE: "QC1",
      MENU_NAME: getlang("quanlyYCSX", lang ?? "en"),
      MENU_ITEM: <YCSXManager />,
    },
    {
      MENU_CODE: "QC2",
      MENU_NAME: getlang("thongtinsanpham", lang ?? "en"),
      MENU_ITEM: <CODE_MANAGER />,
    },
    {
      MENU_CODE: "QC3",
      MENU_NAME: "IQC",
      MENU_ITEM: <IQC />,
    },
    {
      MENU_CODE: "QC4",
      MENU_NAME: "PQC",
      MENU_ITEM: <PQC />,
    },
    {
      MENU_CODE: "QC5",
      MENU_NAME: "OQC",
      MENU_ITEM: <OQC />,
    },
    {
      MENU_CODE: "QC6",
      MENU_NAME: getlang("inspection", lang ?? "en"),
      MENU_ITEM: <KIEMTRA />,
    },
    {
      MENU_CODE: "QC7",
      MENU_NAME: "CS",
      MENU_ITEM: <CSTOTAL />,
    },
    {
      MENU_CODE: "QC8",
      MENU_NAME: getlang("dtc", lang ?? "en"),
      MENU_ITEM: <DTC />,
    },
    {
      MENU_CODE: "QC9",
      MENU_NAME: "ISO",
      MENU_ITEM: <ISO />,
    },
    {
      MENU_CODE: "QC10",
      MENU_NAME: getlang("baocaoqc", lang ?? "en"),
      MENU_ITEM: <QCReport />,
    },
    {
      MENU_CODE: "RD1",
      MENU_NAME: getlang("quanlycodebom", lang ?? "en"),
      MENU_ITEM: <BOM_MANAGER />,
    },
    {
      MENU_CODE: "RD2",
      MENU_NAME: getlang("thembomamazon", lang ?? "en"),
      MENU_ITEM: <BOM_AMAZON />,
    },
    {
      MENU_CODE: "RD3",
      MENU_NAME: getlang("dtc", lang ?? "en"),
      MENU_ITEM: <DTC />,
    },
    {
      MENU_CODE: "RD4",
      MENU_NAME: getlang("quanlyYCSX", lang ?? "en"),
      MENU_ITEM: <YCSXManager />,
    },
    {
      MENU_CODE: "RD5",
      MENU_NAME: getlang("thietkedesignamazon", lang ?? "en"),
      MENU_ITEM: <DESIGN_AMAZON />,
    },
    {
      MENU_CODE: "RD6",
      MENU_NAME: getlang("productbarcodemanager", lang ?? "en"),
      MENU_ITEM: <PRODUCT_BARCODE_MANAGER />,
    },
    {
      MENU_CODE: "RD7",
      MENU_NAME: getlang("baocaornd", lang ?? "en"),
      MENU_ITEM: <RND_REPORT />,
    },
    {
      MENU_CODE: "RD8",
      MENU_NAME: getlang("samplemonitor", lang ?? "en"),
      MENU_ITEM: <SAMPLE_MONITOR />,
    },
    {
      MENU_CODE: "QL1",
      MENU_NAME: getlang("quanlyYCSX", lang ?? "en"),
      MENU_ITEM: <YCSXManager />,
    },
    {
      MENU_CODE: "QL2",
      MENU_NAME: getlang("quanlycodebom", lang ?? "en"),
      MENU_ITEM: <BOM_MANAGER />,
    },
    {
      MENU_CODE: "QL3",
      MENU_NAME: getlang("thongtinsanpham", lang ?? "en"),
      MENU_ITEM: <CODE_MANAGER />,
    },
    {
      MENU_CODE: "QL4",
      MENU_NAME: getlang("quanlyplansx", lang ?? "en"),
      MENU_ITEM: <QLSXPLAN />,
    },
    {
      MENU_CODE: "QL5",
      MENU_NAME: getlang("quanlycapa", lang ?? "en"),
      MENU_ITEM: <CAPA_MANAGER />,
    },
    {
      MENU_CODE: "QL6",
      MENU_NAME: getlang("quanlymrp", lang ?? "en"),
      MENU_ITEM: <CAPA_MANAGER />,
    },
    {
      MENU_CODE: "QL7",
      MENU_NAME: "PLAN VISUAL",
      MENU_ITEM: <MACHINE />,
    },
    {
      MENU_CODE: "QL8",
      MENU_NAME: "QUICK PLAN",
      MENU_ITEM: <QUICKPLAN2 />,
    },
    {
      MENU_CODE: "QL9",
      MENU_NAME: "TRA PLAN",
      MENU_ITEM: <PLAN_DATATB />,
    },
    {
      MENU_CODE: "QL10",
      MENU_NAME: "INPUT LIEU",
      MENU_ITEM: <LICHSUINPUTLIEU />,
    },
    {
      MENU_CODE: "QL11",
      MENU_NAME: "PLAN STATUS",
      MENU_ITEM: <PLAN_STATUS />,
    },
    {
      MENU_CODE: "QL12",
      MENU_NAME: "EQ STATUS",
      MENU_ITEM: <EQ_STATUS />,
    },
    {
      MENU_CODE: "SX1",
      MENU_NAME: getlang("quanlyYCSX", lang ?? "en"),
      MENU_ITEM: <YCSXManager />,
    },
    {
      MENU_CODE: "SX2",
      MENU_NAME: getlang("thongtinsanpham", lang ?? "en"),
      MENU_ITEM: <CODE_MANAGER />,
    },
    {
      MENU_CODE: "SX3",
      MENU_NAME: getlang("datasanxuat", lang ?? "en"),
      MENU_ITEM: <BAOCAOSXALL />,
    },
    {
      MENU_CODE: "SX4",
      MENU_NAME: getlang("inspection", lang ?? "en"),
      MENU_ITEM: <KIEMTRA />,
    },
    {
      MENU_CODE: "SX5",
      MENU_NAME: getlang("planstatus", lang ?? "en"),
      MENU_ITEM: <TRANGTHAICHITHI />,
    },
    {
      MENU_CODE: "SX6",
      MENU_NAME: getlang("eqstatus", lang ?? "en"),
      MENU_ITEM: <EQ_STATUS />,
    },
    {
      MENU_CODE: "SX7",
      MENU_NAME: getlang("khothat", lang ?? "en"),
      MENU_ITEM: <KHOLIEU />,
    },
    {
      MENU_CODE: "SX8",
      MENU_NAME: getlang("khoao", lang ?? "en"),
      MENU_ITEM: <KHOAO />,
    },
    {
      MENU_CODE: "SX9",
      MENU_NAME: getlang("lichsuxuatlieuthat", lang ?? "en"),
      MENU_ITEM: <LICHSUINPUTLIEU />,
    },
    {
      MENU_CODE: "SX10",
      MENU_NAME: getlang("materiallotstatus", lang ?? "en"),
      MENU_ITEM: <TINHHINHCUONLIEU />,
    },
    {
      MENU_CODE: "SX13",
      MENU_NAME: getlang("sxrolldata", lang ?? "en"),
      MENU_ITEM: <BAOCAOTHEOROLL />,
    },
    {
      MENU_CODE: "SX14",
      MENU_NAME: getlang("lichsutemlotsx", lang ?? "en"),
      MENU_ITEM: <LICHSUTEMLOTSX />,
    },
    {
      MENU_CODE: "SX11",
      MENU_NAME: getlang("quanlycapa", lang ?? "en"),
      MENU_ITEM: <CAPA_MANAGER />,
    },
    {
      MENU_CODE: "SX12",
      MENU_NAME: getlang("hieusuatsx", lang ?? "en"),
      MENU_ITEM: <PLANRESULT />,
    },
    {
      MENU_CODE: "SX18",
      MENU_NAME: getlang("tinhluongP3", lang ?? "en"),
      MENU_ITEM: <TINHLUONGP3 />,
    },
    {
      MENU_CODE: "KO1",
      MENU_NAME: getlang("nhapxuattontp", lang ?? "en"),
      MENU_ITEM: company === "CMS" ? <KHOTP /> : <KHOTPNEW />,
    },
    {
      MENU_CODE: "KO2",
      MENU_NAME: getlang("nhapxuattonlieu", lang ?? "en"),
      MENU_ITEM: <KHOLIEU />,
    },
    {
      MENU_CODE: "ST01",
      MENU_NAME: "Setting",
      MENU_ITEM: <SettingPage />,
    },
    {
      MENU_CODE: "",
      MENU_NAME: "",
      MENU_ITEM: <HomePageVendors />,
    },
    {
      MENU_CODE: "-1",
      MENU_NAME: "",
      MENU_ITEM: <HomePageVendors />,
    },
  ];
  const dispatch = useDispatch();
  const [checkVerWeb, setCheckVerWeb] = useState(1);
  
  const CustomTabLabel = styled(Typography)({
    fontWeight: 200, // Ví dụ: đặt độ đậm cho chữ
    // Thêm các kiểu tùy chỉnh khác tại đây...
  });
  const getchamcong = () => {
    generalQuery("checkMYCHAMCONGVendors", {})
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
          //console.log('data',response.data.data)
          //console.log('data',response.data.REFRESH_TOKEN);
          let rfr_token: string = response.data.REFRESH_TOKEN;
          cookies.set("token_vendors", rfr_token, { path: "/" });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const checkERPLicense = async () => {
    //console.log(getSever());
    //if (getSever() !== 'http://192.168.1.192:5013') {
    if (true) {
      generalQuery("checkLicense", {
        COMPANY: company
      })
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            console.log(response.data.message);
          } else {
            console.log(response.data.message);
            if (getUserData()?.EMPL_NO !== 'NHU1903') {
              Swal.fire('Thông báo', 'Please check your network', 'error');
              logout();
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
  useEffect(() => {
    console.log("local ver", current_ver);
    generalQuery("checkWebVer", {})
      .then((response) => {
        console.log(response.data.tk_status);
        if (response.data.tk_status !== "NG") {
          console.log("webver", response.data.data[0].VERWEB);
          setCheckVerWeb(response.data.data[0].VERWEB);
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
    let intervalID = window.setInterval(() => {
      generalQuery("checkWebVer", {})
        .then((response) => {
          if (response?.data?.tk_status !== "NG") {
            //console.log('webver',response.data.data[0].VERWEB);
            if (current_ver >= response.data.data[0].VERWEB) {
            } else {
              window.clearInterval(intervalID);
              Swal.fire({
                title: "ERP has updates?",
                text: "Update Web",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Update",
                cancelButtonText: "Update later",
              }).then((result) => {
                if (result.isConfirmed) {
                  Swal.fire("Notification", "Update Web", "success");
                  window.location.reload();
                } else {
                  Swal.fire(
                    "Notification",
                    "Press Ctrl + F5 to update the Web",
                    "info"
                  );
                }
              });
            }
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });
      getchamcong();
    }, 30000);
    checkERPLicense();
    /* let intervalID2 = window.setInterval(() => {
      checkERPLicense();
    }, 30000); */
    return () => {
      window.clearInterval(intervalID);
      /* window.clearInterval(intervalID2); */
    };
  }, []);
  return (
    <div className='home'>
      <div className='navdiv'>
        <NavbarVendors />      
      </div>
      <div className='homeContainer'>
        {/* <div className='sidebardiv'>
          <Sidebar />
        </div> */}
        <div className='outletdiv'>
          <animated.div
            className='animated_div'
            style={{
              width: "100%",
              height: "100vh",
              borderRadius: 8,
            }}
          >
            {tabModeSwap &&
              tabs.filter(
                (ele: ELE_ARRAY, index: number) =>
                  ele.ELE_CODE !== "-1" && ele.ELE_CODE !== "NS0"
              ).length > 0 && (
                <div className="tabsdiv">


                  <Tabs
                    value={tabIndex}
                    onChange={(
                      event: React.SyntheticEvent,
                      newValue: number
                    ) => {
                      dispatch(settabIndex(newValue));
                    }}
                    variant='scrollable'
                    aria-label='ERP TABS'
                    scrollButtons
                    allowScrollButtonsMobile
                    className="tabs"
                    style={{
                      backgroundImage: `${company === "CMS"
                        ? theme.CMS.backgroundImage
                        : theme.PVN.backgroundImage
                        }`,
                      border: "none",
                      minHeight: "2px",
                      boxSizing: "border-box",
                      borderRadius: "2px",
                      overflow: 'scroll',
                      height: 'fit-content'
                    }}
                  >
                    {tabs.map((ele: ELE_ARRAY, index: number) => {
                      if (ele.ELE_CODE !== "-1") {
                        return (
                          <div>
                            <CustomTab
                              key={index}
                              label={
                                <div className="tabdiv" style={{ display: 'flex', fontSize: "0.8rem", justifyContent: 'center', alignContent: 'center', padding: 0, color: "black", borderRadius: '5px', margin: '5px', cursor: 'pointer' }}
                                  onClick={() => {
                                    dispatch(settabIndex(index));
                                  }}
                                >
                                  <CustomTabLabel style={{ fontSize: "0.7rem", display: 'flex', whiteSpace: 'nowrap', alignItems: 'center' }}>
                                    <span style={{ marginRight: '5px' }}>{index + 1}.{ele.ELE_NAME}</span>
                                    <IconButton key={index + 'A'} onClick={() => {
                                      dispatch(closeTab(index));
                                    }}>
                                      <AiOutlineCloseCircle color={tabIndex === index ? `blue` : `gray`} size={15} />
                                    </IconButton>
                                  </CustomTabLabel>
                                </div>
                              }
                              value={index}
                              style={{
                                minHeight: "2px",
                                height: "5px",
                                boxSizing: "border-box",
                                borderRadius: "3px",
                              }}
                            ></CustomTab>
                          </div>
                        );
                      }
                    })}
                  </Tabs>
                </div>

              )}
            {tabModeSwap &&
              tabs.map((ele: ELE_ARRAY, index: number) => {
                if (ele.ELE_CODE !== "-1")
                  return (
                    <div
                      key={index}
                      className='component_element'
                      style={{
                        visibility: index === tabIndex ? "visible" : "hidden",
                        width: sidebarStatus ? "100%" : "100%",
                      }}
                    >
                      <Suspense fallback={<div>Loading...</div>}>
                        {menulist.filter((menu: MENU_LIST_DATA, index: number) => menu.MENU_CODE === ele.ELE_CODE)[0].MENU_ITEM}
                      </Suspense>
                    </div>
                  );
              })}
            {current_ver >= checkVerWeb ? (
              !tabModeSwap && <Outlet />
            ) : (
              <p
                style={{
                  fontSize: 35,
                  backgroundColor: "red",
                  width: "100%",
                  height: "100%",
                  zIndex: 1000,
                }}
              >
                ERP has updates, Press Ctrl +F5 to update web
              </p>
            )}
            {tabModeSwap && tabs.length === 0 && <HomePageVendors />}
          </animated.div>
        </div>
        {/* {userData?.EMPL_NO === 'NHU1903' && <div className="chatroom">
          <CHAT />
        </div>} */}
      </div>
    </div>
  );
}
export default HomeVendors;
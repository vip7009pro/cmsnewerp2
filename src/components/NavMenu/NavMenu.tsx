import React, { useContext, useEffect, useMemo, useRef, useState, ReactElement } from "react";
import { Link } from "react-router-dom";
import {
  FcAbout,
  FcAcceptDatabase,
  FcApprove,
  FcCapacitor,
  FcCustomerSupport,
  FcInspection,
  FcList,
  FcProcess,
  FcServices,
} from "react-icons/fc";
import "./NavMenu.scss";
import { GiPostStamp } from "react-icons/gi";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import HomeIcon from "@mui/icons-material/Home";
import {
  FaDonate,
  FaFileInvoiceDollar,
  FaCheckCircle,
  FaHistory,
  FaBomb,
  FaPaperPlane,
  FaWarehouse,
  FaScroll,
  FaPeopleArrows,
  FaBarcode,
  FaLongArrowAltRight,
  FaPaintRoller,
} from "react-icons/fa";
import {
  BiBarcode,
  BiCart,
  BiSortAZ,
  BiTransfer,
  BiTrendingUp,
} from "react-icons/bi";
import {
  FcPlanner,
  FcSettings,
  FcBullish,
  FcPortraitMode,
  FcManager,
  FcCheckmark,
  FcPieChart,
  FcRefresh,
} from "react-icons/fc";
import {
  MdBugReport,
  MdDesignServices,
  MdInput,
  MdOutlineAppRegistration,
  MdOutlineAspectRatio,
  MdOutlineChecklistRtl,
  MdOutlineProductionQuantityLimits,
  MdOutlineSignalWifiStatusbarNull,
  MdPrecisionManufacturing,
  MdPriceChange,
} from "react-icons/md";
import { WiDayLightning } from "react-icons/wi";
import { SiStatuspal } from "react-icons/si";
import getsentence from "../../components/String/String";
import { LangConText } from "../../api/Context";
import {
  AiFillAmazonCircle,
  AiFillAmazonSquare,
  AiFillCheckSquare,
  AiFillMinusCircle,
  AiOutlineCalendar,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import RuleRoundedIcon from "@mui/icons-material/RuleRounded";
import { RootState } from "../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import {
  changeDiemDanhState,
  changeUserData,
  toggleSidebar,
  hideSidebar,
} from "../../redux/slices/globalSlice";
import { getlang } from "../../components/String/String";
import { GrStatusUnknown } from "react-icons/gr";
import { FcDataProtection } from "react-icons/fc";
import useOutsideClick from "../../api/customHooks";
import { GiPriceTag } from "react-icons/gi";
import { UserData } from "../../api/GlobalInterface";
import { getCompany } from "../../api/Api";
import {
  setTabModeSwap,
} from "../../redux/slices/globalSlice";
import { addTab, settabIndex, resetTab } from "../../redux/slices/globalSlice";
import MACHINE from "../../pages/qlsx/QLSXPLAN/Machine/MACHINE";
import QUICKPLAN from "../../pages/qlsx/QLSXPLAN/QUICKPLAN/QUICKPLAN";
import PLAN_STATUS from "../../pages/qlsx/QLSXPLAN/PLAN_STATUS/PLAN_STATUS";
import QuanLyPhongBanNhanSu from "../../pages/nhansu/QuanLyPhongBanNhanSu/QuanLyPhongBanNhanSu";
import DiemDanhNhom from "../../pages/nhansu/DiemDanhNhom/DiemDanhNhom";
import DieuChuyenTeam from "../../pages/nhansu/DieuChuyenTeam/DieuChuyenTeam";
import TabDangKy from "../../pages/nhansu/DangKy/TabDangKy";
import PheDuyetNghi from "../../pages/nhansu/PheDuyetNghi/PheDuyetNghi";
import LichSu from "../../pages/nhansu/LichSu/LichSu";
import QuanLyCapCao from "../../pages/nhansu/QuanLyCapCao/QuanLyCapCao";
import BaoCaoNhanSu from "../../pages/nhansu/BaoCaoNhanSu/BaoCaoNhanSu";
import PoManager from "../../pages/kinhdoanh/pomanager/PoManager";
import InvoiceManager from "../../pages/kinhdoanh/invoicemanager/InvoiceManager";
import PlanManager from "../../pages/kinhdoanh/planmanager/PlanManager";
import ShortageKD from "../../pages/kinhdoanh/shortageKD/ShortageKD";
import FCSTManager from "../../pages/kinhdoanh/fcstmanager/FCSTManager";
import YCSXManager from "../../pages/kinhdoanh/ycsxmanager/YCSXManager";
import POandStockFull from "../../pages/kinhdoanh/poandstockfull/POandStockFull";
import CODE_MANAGER from "../../pages/rnd/code_manager/CODE_MANAGER";
import BOM_MANAGER from "../../pages/rnd/bom_manager/BOM_MANAGER";
import CUST_MANAGER from "../../pages/kinhdoanh/custManager/CUST_MANAGER";
import EQ_STATUS from "../../pages/qlsx/QLSXPLAN/EQ_STATUS/EQ_STATUS";
import INSPECT_STATUS from "../../pages/qc/inspection/INSPECT_STATUS/INSPECT_STATUS";
import KinhDoanhReport from "../../pages/kinhdoanh/kinhdoanhreport/KinhDoanhReport";
import KIEMTRA from "../../pages/qc/inspection/KIEMTRA";
import DTC from "../../pages/qc/dtc/DTC";
import ISO from "../../pages/qc/iso/ISO";
import QC from "../../pages/qc/QC";
import IQC from "../../pages/qc/iqc/IQC";
import PQC from "../../pages/qc/pqc/PQC";
import OQC from "../../pages/qc/oqc/OQC";
import BOM_AMAZON from "../../pages/rnd/bom_amazon/BOM_AMAZON";
import DESIGN_AMAZON from "../../pages/rnd/design_amazon/DESIGN_AMAZON";
import QLSXPLAN from "../../pages/qlsx/QLSXPLAN/QLSXPLAN";
import TRANGTHAICHITHI from "../../pages/sx/TRANGTHAICHITHI/TRANGTHAICHITHI";
import KHOLIEU from "../../pages/kho/kholieu/KHOLIEU";
import KHOAO from "../../pages/qlsx/QLSXPLAN/KHOAO/KHOAO";
import LICHSUINPUTLIEU from "../../pages/qlsx/QLSXPLAN/LICHSUINPUTLIEU/LICHSUINPUTLIEU";
import TINHHINHCUONLIEU from "../../pages/sx/TINH_HINH_CUON_LIEU/TINHINHCUONLIEU";
import CSTOTAL from "../../pages/qc/cs/CSTOTAL";
import AccountInfo from "../../components/Navbar/AccountInfo/AccountInfo";
import PLAN_DATATB from "../../pages/qlsx/QLSXPLAN/LICHSUCHITHITABLE/PLAN_DATATB";
import Swal from "sweetalert2";
import CAPA_MANAGER from "../../pages/qlsx/QLSXPLAN/CAPA/CAPA_MANAGER";
import PLANRESULT from "../../pages/sx/PLANRESULT/PLANRESULT";
import BANGCHAMCONG from "../../pages/nhansu/BangChamCong/BangChamCong";
import QuotationTotal from "../../pages/kinhdoanh/quotationmanager/QuotationTotal";
import QLVL from "../../pages/muahang/quanlyvatlieu/QLVL";
import PRODUCT_BARCODE_MANAGER from "../../pages/rnd/product_barcode_manager/PRODUCT_BARCODE_MANAGER";
import QLGN from "../../pages/rnd/quanlygiaonhandaofilm/QLGN";
import KHOTPNEW from "../../pages/kho/khotp_new/KHOTPNEW";
import KHOTP from "../../pages/kho/khotp/KHOTP";
import { ELE_ARRAY, } from "../../api/GlobalInterface";
import EQ_STATUS2 from "../../pages/qlsx/QLSXPLAN/EQ_STATUS/EQ_STATUS2";
import TINHLIEU from "../../pages/muahang/tinhlieu/TINHLIEU";
import BAOCAOTHEOROLL from "../../pages/sx/BAOCAOTHEOROLL/BAOCAOTHEOROLL";
import LICHSUTEMLOTSX from "../../pages/sx/LICHSUTEMLOTSX/LICHSUTEMLOTSX";
import BAOCAOSXALL from "../../pages/sx/BAOCAOSXALL";
interface MENU_LIST_DATA {
  MENU_CODE: string;
  MENU_NAME: string;
  MENU_ITEM: ReactElement;
}
const NavMenu = () => {
  const [lang, setLang] = useContext(LangConText);
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData,
  );
  const company: string = useSelector(
    (state: RootState) => state.totalSlice.company,
  );
  const tabModeSwap: boolean = useSelector(
    (state: RootState) => state.totalSlice.tabModeSwap,
  );
  const tabs: ELE_ARRAY[] = useSelector(
    (state: RootState) => state.totalSlice.tabs,
  );
  const dispatch = useDispatch();
  const SidebarData = [
    {
      title: getlang("nhansu", lang) /*Nhân sự*/,
      path: "#",
      icon: <FcManager color="green" size={20} />,
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,
      subNav: [
        {
          title: getlang("diemdanhnhom", lang),
          path: "/nhansu/diemdanhnhom",
          icon: <FcCheckmark color="red" size={20} />,
          MENU_CODE: "NS2",
        },
        {
          title: getlang("dieuchuyenteam", lang),
          path: "/nhansu/dieuchuyenteam",
          icon: <FcRefresh color="red" size={20} />,
          MENU_CODE: "NS3",
        },
        {
          title: getlang("dangky1", lang),
          path: "/nhansu/dangky",
          icon: <MdOutlineAppRegistration size={20} />,
          MENU_CODE: "NS4",
        },
        {
          title: getlang("pheduyet", lang),
          path: "/nhansu/pheduyetnghi",
          icon: <FcApprove size={20} />,
          MENU_CODE: "NS5",
        },
        {
          title: getlang("lichsudilam", lang),
          path: "/nhansu/lichsu",
          icon: <FaHistory color="green" size={20} />,
          MENU_CODE: "NS6",
        },
        {
          title: getlang("quanlycapcao", lang),
          path: "/nhansu/quanlycapcao",
          icon: <FcManager color="#cc99ff" size={20} />,
          MENU_CODE: "NS7",
        },
        {
          title: getlang("baocaonhansu", lang),
          path: "/nhansu/baocaonhansu",
          icon: <FcPieChart color="#cc99ff" size={20} />,
          MENU_CODE: "NS8",
        },
        getCompany() === "CMS" && {
          title: getlang("quanlyphongban", lang),
          path: "/nhansu/quanlyphongbannhanvien",
          icon: <FcPortraitMode color="blue" size={20} />,
          MENU_CODE: "NS1",
        },
      ],
    },
    {
      title: getlang("phonghanhchinhnhansu", lang) /*Nhân sự*/,
      path: "#",
      icon: <FaPeopleArrows color="#7F60F3" size={20} />,
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,
      subNav: [
        {
          title: getlang("quanlyphongban", lang),
          path: "/nhansu/quanlyphongbannhanvien",
          icon: <FcPortraitMode color="blue" size={20} />,
          MENU_CODE: "NS1",
        },
        {
          title: getlang("listchamcong", lang),
          path: "/nhansu/listchamcong",
          icon: <MdOutlineChecklistRtl color="blue" size={20} />,
          MENU_CODE: "NS9",
        },
        {
          title: getlang("baocaonhansu", lang),
          path: "/nhansu/baocaonhansu",
          icon: <FcPieChart color="#cc99ff" size={20} />,
          MENU_CODE: "NS8",
        },
      ],
    },
    {
      title: getlang("phongkinhdoanh", lang) /*Phòng Kinh Doanh*/,
      path: "#",
      icon: <FaDonate color="green" size={20} />,
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,
      subNav: [
        {
          title: getlang("quanlygiasanpham", lang) /*Quản lý PO*/,
          path: "/kinhdoanh/quotationmanager",
          icon: <GiPriceTag color="#01C716" size={20} />,
          MENU_CODE: "KD14",
        },
        {
          title: getlang("quanlypo", lang) /*Quản lý PO*/,
          path: "/kinhdoanh/pomanager",
          icon: <BiCart color="blue" size={20} />,
          MENU_CODE: "KD1",
        },
        {
          title: getlang("quanlyinvoices", lang) /*Quản lý Invoice*/,
          path: "/kinhdoanh/invoicemanager",
          icon: <FaFileInvoiceDollar color="red" size={20} />,
          MENU_CODE: "KD2",
        },
        {
          title: getlang("quanlyplan", lang) /*Quản Lý Plan*/,
          path: "/kinhdoanh/planmanager",
          icon: <FcPlanner size={20} />,
          MENU_CODE: "KD3",
        },
        {
          title: getlang("shortage", lang) /*Quản Lý Plan*/,
          path: "/kinhdoanh/shortage",
          icon: <AiFillMinusCircle size={20} color="red" />,
          MENU_CODE: "KD4",
        },
        {
          title: getlang("quanlyFCST", lang) /*Quản lý FCST*/,
          path: "/kinhdoanh/fcstmanager",
          icon: <WiDayLightning color="#cc99ff" size={20} />,
          MENU_CODE: "KD5",
        },
        {
          title: getlang("quanlyYCSX", lang) /*Quản lý YCSX*/,
          path: "/kinhdoanh/ycsxmanager",
          icon: <FcSettings color="#cc99ff" size={20} />,
          MENU_CODE: "KD6",
        },
        {
          title: getlang("quanlyPOFull", lang) /*PO tích hợp tồn kho*/,
          path: "/kinhdoanh/poandstockfull",
          icon: <FaCheckCircle color="#ff9900" size={20} />,
          MENU_CODE: "KD7",
        },
        {
          title: getlang("thongtinsanpham", lang),
          path: "/kinhdoanh/codeinfo",
          icon: <FcAbout color="#cc00ff" size={20} />,
          MENU_CODE: "KD8",
        },
        {
          title: getlang("quanlycodebom", lang),
          path: "/kinhdoanh/quanlycodebom",
          icon: <FaBomb color="black" size={20} />,
          MENU_CODE: "KD9",
          cName: "sub-nav",
        },
        {
          title: getlang("quanlykhachhang", lang),
          path: "/kinhdoanh/customermanager",
          icon: <FcCustomerSupport color="#cc00ff" size={20} />,
          MENU_CODE: "KD10",
        },
        {
          title: getlang("eqstatus", lang),
          path: "kinhdoanh/eqstatus",
          icon: <MdOutlineSignalWifiStatusbarNull color="#cc00ff" size={20} />,
          MENU_CODE: "KD11",
          cName: "sub-nav",
        },
        {
          title: getlang("ins_status", lang),
          path: "kinhdoanh/ins_status",
          icon: <FcInspection color="#cc00ff" size={20} />,
          MENU_CODE: "KD12",
          cName: "sub-nav",
        },
        {
          title: getlang("baocao", lang),
          path: "/kinhdoanh/kinhdoanhreport",
          icon: <FcBullish size={20} />,
          MENU_CODE: "KD13",
        },
      ],
    },
    {
      title: getlang("phongmuahang", lang) /*Phòng Kinh Doanh*/,
      path: "#",
      icon: <AiOutlineShoppingCart color="#B701CA" size={20} />,
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,
      subNav: [
        {
          title: getlang("quanlykhachhang", lang),
          path: "/kinhdoanh/customermanager",
          icon: <FcCustomerSupport color="#cc00ff" size={20} />,
          MENU_CODE: "KD10",
        },
        {
          title: getlang("quanlyvatlieu", lang) /*Quản lý VL*/,
          path: "/phongmuahang/quanlyvatlieu",
          icon: <FaScroll color="#01C716" size={20} />,
          MENU_CODE: "PU1",
        },
        {
          title: getlang("quanlymrp", lang) /*Quản lý VL*/,
          path: "/phongmuahang/mrp",
          icon: <AiOutlineCalendar color="blue" size={20} />,
          MENU_CODE: "PU2",
        },
      ],
    },
    {
      title: getlang("phongqc", lang),
      path: "#",
      icon: <AiFillCheckSquare color="#cc99ff" size={20} />,
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,
      subNav: [
        {
          title: getlang("quanlyYCSX", lang),
          path: "/qc/ycsxmanager",
          icon: <FcSettings color="#cc99ff" size={20} />,
          MENU_CODE: "QC1",
          cName: "sub-nav",
        },
        {
          title: getlang("thongtinsanpham", lang),
          path: "/qc/codeinfo",
          icon: <FcAbout color="#cc00ff" size={20} />,
          MENU_CODE: "QC2",
        },
        {
          title: "IQC",
          path: "/qc/iqc",
          icon: <MdInput color="blue" size={20} />,
          MENU_CODE: "QC3",
          cName: "sub-nav",
        },
        {
          title: "PQC",
          path: "/qc/pqc",
          icon: <FcProcess color="green" size={20} />,
          MENU_CODE: "QC4",
          cName: "sub-nav",
        },
        {
          title: "OQC",
          path: "/qc/oqc",
          icon: <MdInput color="green" size={20} />,
          MENU_CODE: "QC5",
        },
        {
          title: getlang("inspection", lang),
          path: "/qc/inspection",
          icon: <FcInspection color="blue" size={20} />,
          MENU_CODE: "QC6",
        },
        {
          title: "CS",
          path: "/qc/cs",
          icon: <FcServices color="blue" size={20} />,
          MENU_CODE: "QC7",
        },
        {
          title: getlang("dtc", lang),
          path: "/qc/dtc",
          icon: <MdOutlineAspectRatio color="red" size={20} />,
          MENU_CODE: "QC8",
        },
        {
          title: "ISO",
          path: "/qc/iso",
          icon: <BiSortAZ color="#fa1e9e" size={20} />,
          MENU_CODE: "QC9",
        },
        {
          title: getlang("baocaoqc", lang),
          path: "/qc/qcreport",
          icon: <MdBugReport color="blue" size={20} />,
          MENU_CODE: "QC10",
        },
      ],
    },
    {
      title: getlang("phongrnd", lang),
      path: "#",
      icon: <MdDesignServices color="#3366ff" size={20} />,
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,
      subNav: [
        {
          title: getlang("quanlycodebom", lang),
          path: "/rnd/quanlycodebom",
          icon: <FaBomb color="black" size={20} />,
          MENU_CODE: "RD1",
          cName: "sub-nav",
        },
        {
          title: getlang("thembomamazon", lang),
          path: "/rnd/thembomamazon",
          icon: <AiFillAmazonSquare color="green" size={20} />,
          MENU_CODE: "RD2",
          cName: "sub-nav",
        },
        {
          title: getlang("dtc", lang),
          path: "/rnd/dtc",
          icon: <MdOutlineAspectRatio color="red" size={20} />,
          MENU_CODE: "RD3",
        },
        {
          title: getlang("quanlyYCSX", lang),
          path: "rnd/ycsxmanager",
          icon: <FcSettings color="#cc99ff" size={20} />,
          MENU_CODE: "RD4",
          cName: "sub-nav",
        },
        {
          title: getlang("thietkedesignamazon", lang),
          path: "/rnd/designamazon",
          icon: <AiFillAmazonCircle color="blue" size={20} />,
          MENU_CODE: "RD5",
        },
        {
          title: getlang("productbarcodemanager", lang),
          path: "/rnd/productbarcodemanager",
          icon: <FaBarcode color="#098705" size={20} />,
          MENU_CODE: "RD6",
        },
      ],
    },
    {
      title: getlang("phongqlsx", lang),
      path: "#",
      icon: <MdOutlineProductionQuantityLimits color="#00cc00" size={20} />,
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,
      subNav: [
        {
          title: getlang("quanlyYCSX", lang),
          path: "qlsx/ycsxmanager",
          icon: <FcSettings color="#cc99ff" size={20} />,
          MENU_CODE: "QL1",
          cName: "sub-nav",
        },
        {
          title: getlang("quanlycodebom", lang),
          path: "qlsx/quanlycodebom",
          icon: <FaBomb color="black" size={20} />,
          MENU_CODE: "QL2",
          cName: "sub-nav",
        },
        {
          title: getlang("thongtinsanpham", lang),
          path: "qlsx/codeinfo",
          icon: <FcAbout color="#cc00ff" size={20} />,
          MENU_CODE: "QL3",
          cName: "sub-nav",
        },
        {
          title: getlang("quanlyplansx", lang),
          path: "qlsx/qlsxplan",
          icon: <FaPaperPlane color="#ff33cc" size={20} />,
          MENU_CODE: "QL4",
        },
        {
          title: getlang("quanlycapa", lang),
          path: "qlsx/capamanager",
          icon: <FcCapacitor color="blue" size={20} />,
          MENU_CODE: "QL5",
        },
        {
          title: getlang("quanlymrp", lang),
          path: "qlsx/qlsxmrp",
          icon: <AiOutlineCalendar color="blue" size={20} />,
          MENU_CODE: "QL6",
        },
      ],
    },
    {
      title: getlang("phongsanxuat", lang),
      path: "#",
      icon: <MdPrecisionManufacturing color="red" size={20} />,
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,
      subNav: [
        {
          title: getlang("quanlyYCSX", lang),
          path: "sx/ycsxmanager",
          icon: <FcSettings color="#cc99ff" size={20} />,
          MENU_CODE: "SX1",
          cName: "sub-nav",
        },
        {
          title: getlang("thongtinsanpham", lang),
          path: "sx/codeinfo",
          icon: <FcAbout color="#cc00ff" size={20} />,
          MENU_CODE: "SX2",
          cName: "sub-nav",
        },
        {
          title: getlang("datasanxuat", lang),
          path: "sx/datasx",
          icon: <FcAcceptDatabase color="#cc00ff" size={20} />,
          MENU_CODE: "SX3",
          cName: "sub-nav",
        },
        {
          title: getlang("inspection", lang),
          path: "sx/inspection",
          icon: <FcInspection color="blue" size={20} />,
          MENU_CODE: "SX4",
        },
        {
          title: getlang("planstatus", lang),
          path: "sx/planstatus",
          icon: <SiStatuspal color="#02a112" size={20} />,
          MENU_CODE: "SX5",
          cName: "sub-nav",
        },
        {
          title: getlang("eqstatus", lang),
          path: "sx/eqstatus",
          icon: <MdOutlineSignalWifiStatusbarNull color="#cc00ff" size={20} />,
          MENU_CODE: "SX6",
          cName: "sub-nav",
        },
        {
          title: getlang("khothat", lang),
          path: "sx/khothat",
          icon: <FaWarehouse color="#2BFC27" size={20} />,
          MENU_CODE: "SX7",
          cName: "sub-nav",
        },
        {
          title: getlang("khoao", lang),
          path: "sx/khoao",
          icon: <FaWarehouse color="#fc00ff" size={20} />,
          MENU_CODE: "SX8",
          cName: "sub-nav",
        },
        /*   {
              title: getlang("lichsuxuatlieuthat", lang),
              path: "sx/lichsuxuatlieu",
              icon: <FcDataProtection color="#cc00ff" size={20} />,
              MENU_CODE: "SX9",
              cName: "sub-nav",
          },
          {
              title: getlang("lichsutemlotsx", lang),
              path: "sx/lichsutemlotsx",
              icon: <GiPostStamp  color="#cea70e" size={20} />,
              MENU_CODE: "SX14",
              cName: "sub-nav",
          },
          {
              title: getlang("materiallotstatus", lang),
              path: "sx/materiallotstatus",
              icon: <FaScroll color="black" size={20} />,
              MENU_CODE: "SX10",
              cName: "sub-nav",
          },
          {
              title: getlang("sxrolldata", lang),
              path: "sx/rolldata",
              icon: <FaPaintRoller color="#04a29d" size={20} />,
              MENU_CODE: "SX13",
              cName: "sub-nav",
          }, */
        {
          title: getlang("quanlycapa", lang),
          path: "sx/capamanager",
          icon: <FcCapacitor color="blue" size={20} />,
          MENU_CODE: "SX11",
        },
        {
          title: getlang("hieusuatsx", lang),
          path: "sx/planresult",
          icon: <BiTrendingUp color="green" size={20} />,
          MENU_CODE: "SX12",
        },
      ],
    },
    {
      title: getlang("bophankho", lang),
      path: "#",
      icon: <FaWarehouse color="#7459FA" size={20} />,
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,
      subNav: [
        {
          title: getlang("nhapxuattonlieu", lang),
          path: "bophankho/nhapxuattonlieu",
          icon: <FaLongArrowAltRight color="#12CAB9" size={20} />,
          MENU_CODE: "KO2",
          cName: "sub-nav",
        },
        {
          title: getlang("nhapxuattontp", lang),
          path: "bophankho/nhapxuattontp",
          icon: <FaLongArrowAltRight color="#74CE00" size={20} />,
          MENU_CODE: "KO1",
          cName: "sub-nav",
        },
      ],
    },
  ];
  const menulist: MENU_LIST_DATA[] = [
    {
      MENU_CODE: "NS0",
      MENU_NAME: "Account Info",
      MENU_ITEM: <AccountInfo />,
    },
    {
      MENU_CODE: "NS1",
      MENU_NAME: getlang("quanlyphongban", lang),
      MENU_ITEM: <QuanLyPhongBanNhanSu />,
    },
    {
      MENU_CODE: "NS2",
      MENU_NAME: getlang("diemdanhnhom", lang),
      MENU_ITEM: <DiemDanhNhom />,
    },
    {
      MENU_CODE: "NS3",
      MENU_NAME: getlang("dieuchuyenteam", lang),
      MENU_ITEM: <DieuChuyenTeam />,
    },
    {
      MENU_CODE: "NS4",
      MENU_NAME: getlang("dangky1", lang),
      MENU_ITEM: <TabDangKy />,
    },
    {
      MENU_CODE: "NS5",
      MENU_NAME: getlang("pheduyet", lang),
      MENU_ITEM: <PheDuyetNghi />,
    },
    {
      MENU_CODE: "NS6",
      MENU_NAME: getlang("lichsudilam", lang),
      MENU_ITEM: <LichSu />,
    },
    {
      MENU_CODE: "NS7",
      MENU_NAME: getlang("quanlycapcao", lang),
      MENU_ITEM: <QuanLyCapCao />,
    },
    {
      MENU_CODE: "NS8",
      MENU_NAME: getlang("baocaonhansu", lang),
      MENU_ITEM: <BaoCaoNhanSu />,
    },
    {
      MENU_CODE: "NS9",
      MENU_NAME: getlang("listchamcong", lang),
      MENU_ITEM: <BANGCHAMCONG />,
    },
    {
      MENU_CODE: "KD1",
      MENU_NAME: getlang("quanlypo", lang),
      MENU_ITEM: <PoManager />,
    },
    {
      MENU_CODE: "KD2",
      MENU_NAME: getlang("quanlyinvoices", lang),
      MENU_ITEM: <InvoiceManager />,
    },
    {
      MENU_CODE: "KD3",
      MENU_NAME: getlang("quanlyplan", lang),
      MENU_ITEM: <PlanManager />,
    },
    {
      MENU_CODE: "KD4",
      MENU_NAME: getlang("shortage", lang),
      MENU_ITEM: <ShortageKD />,
    },
    {
      MENU_CODE: "KD5",
      MENU_NAME: getlang("quanlyFCST", lang),
      MENU_ITEM: <FCSTManager />,
    },
    {
      MENU_CODE: "KD6",
      MENU_NAME: getlang("quanlyYCSX", lang),
      MENU_ITEM: <YCSXManager />,
    },
    {
      MENU_CODE: "KD7",
      MENU_NAME: getlang("quanlyPOFull", lang),
      MENU_ITEM: <POandStockFull />,
    },
    {
      MENU_CODE: "KD8",
      MENU_NAME: getlang("thongtinsanpham", lang),
      MENU_ITEM: <CODE_MANAGER />,
    },
    {
      MENU_CODE: "KD9",
      MENU_NAME: getlang("quanlycodebom", lang),
      MENU_ITEM: <BOM_MANAGER />,
    },
    {
      MENU_CODE: "KD10",
      MENU_NAME: getlang("quanlykhachhang", lang),
      MENU_ITEM: <CUST_MANAGER />,
    },
    {
      MENU_CODE: "KD11",
      MENU_NAME: getlang("eqstatus", lang),
      MENU_ITEM: <EQ_STATUS2 />,
    },
    {
      MENU_CODE: "KD12",
      MENU_NAME: getlang("ins_status", lang),
      MENU_ITEM: <INSPECT_STATUS />,
    },
    {
      MENU_CODE: "KD13",
      MENU_NAME: getlang("baocao", lang),
      MENU_ITEM: <KinhDoanhReport />,
    },
    {
      MENU_CODE: "KD14",
      MENU_NAME: getlang("quanlygia", lang),
      MENU_ITEM: <QuotationTotal />,
    },
    {
      MENU_CODE: "PU1",
      MENU_NAME: getlang("quanlyvatlieu", lang),
      MENU_ITEM: <QLVL />,
    },
    {
      MENU_CODE: "PU2",
      MENU_NAME: getlang("quanlymrp", lang),
      MENU_ITEM: <TINHLIEU />,
    },
    {
      MENU_CODE: "QC1",
      MENU_NAME: getlang("quanlyYCSX", lang),
      MENU_ITEM: <YCSXManager />,
    },
    {
      MENU_CODE: "QC2",
      MENU_NAME: getlang("thongtinsanpham", lang),
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
      MENU_NAME: getlang("inspection", lang),
      MENU_ITEM: <KIEMTRA />,
    },
    {
      MENU_CODE: "QC7",
      MENU_NAME: "CS",
      MENU_ITEM: <CSTOTAL />,
    },
    {
      MENU_CODE: "QC8",
      MENU_NAME: getlang("dtc", lang),
      MENU_ITEM: <DTC />,
    },
    {
      MENU_CODE: "QC9",
      MENU_NAME: "ISO",
      MENU_ITEM: <ISO />,
    },
    {
      MENU_CODE: "QC10",
      MENU_NAME: getlang("baocaoqc", lang),
      MENU_ITEM: <QC />,
    },
    {
      MENU_CODE: "RD1",
      MENU_NAME: getlang("quanlycodebom", lang),
      MENU_ITEM: <BOM_MANAGER />,
    },
    {
      MENU_CODE: "RD2",
      MENU_NAME: getlang("thembomamazon", lang),
      MENU_ITEM: <BOM_AMAZON />,
    },
    {
      MENU_CODE: "RD3",
      MENU_NAME: getlang("dtc", lang),
      MENU_ITEM: <DTC />,
    },
    {
      MENU_CODE: "RD4",
      MENU_NAME: getlang("quanlyYCSX", lang),
      MENU_ITEM: <YCSXManager />,
    },
    {
      MENU_CODE: "RD5",
      MENU_NAME: getlang("thietkedesignamazon", lang),
      MENU_ITEM: <DESIGN_AMAZON />,
    },
    {
      MENU_CODE: "RD6",
      MENU_NAME: getlang("productbarcodemanager", lang),
      MENU_ITEM: <PRODUCT_BARCODE_MANAGER />,
    },
    {
      MENU_CODE: "QL1",
      MENU_NAME: getlang("quanlyYCSX", lang),
      MENU_ITEM: <YCSXManager />,
    },
    {
      MENU_CODE: "QL2",
      MENU_NAME: getlang("quanlycodebom", lang),
      MENU_ITEM: <BOM_MANAGER />,
    },
    {
      MENU_CODE: "QL3",
      MENU_NAME: getlang("thongtinsanpham", lang),
      MENU_ITEM: <CODE_MANAGER />,
    },
    {
      MENU_CODE: "QL4",
      MENU_NAME: getlang("quanlyplansx", lang),
      MENU_ITEM: <QLSXPLAN />,
    },
    {
      MENU_CODE: "QL5",
      MENU_NAME: getlang("quanlycapa", lang),
      MENU_ITEM: <CAPA_MANAGER />,
    },
    {
      MENU_CODE: "QL6",
      MENU_NAME: getlang("quanlymrp", lang),
      MENU_ITEM: <TINHLIEU />,
    },
    {
      MENU_CODE: "QL7",
      MENU_NAME: "PLAN VISUAL",
      MENU_ITEM: <MACHINE />,
    },
    {
      MENU_CODE: "QL8",
      MENU_NAME: "QUICK PLAN",
      MENU_ITEM: <QUICKPLAN />,
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
      MENU_NAME: getlang("quanlyYCSX", lang),
      MENU_ITEM: <YCSXManager />,
    },
    {
      MENU_CODE: "SX2",
      MENU_NAME: getlang("thongtinsanpham", lang),
      MENU_ITEM: <CODE_MANAGER />,
    },
    {
      MENU_CODE: "SX3",
      MENU_NAME: getlang("datasanxuat", lang),
      MENU_ITEM: <BAOCAOSXALL />,
    },
    {
      MENU_CODE: "SX4",
      MENU_NAME: getlang("inspection", lang),
      MENU_ITEM: <KIEMTRA />,
    },
    {
      MENU_CODE: "SX5",
      MENU_NAME: getlang("planstatus", lang),
      MENU_ITEM: <TRANGTHAICHITHI />,
    },
    {
      MENU_CODE: "SX6",
      MENU_NAME: getlang("eqstatus", lang),
      MENU_ITEM: <EQ_STATUS />,
    },
    {
      MENU_CODE: "SX7",
      MENU_NAME: getlang("khothat", lang),
      MENU_ITEM: <KHOLIEU />,
    },
    {
      MENU_CODE: "SX8",
      MENU_NAME: getlang("khoao", lang),
      MENU_ITEM: <KHOAO />,
    },
    {
      MENU_CODE: "SX9",
      MENU_NAME: getlang("lichsuxuatlieuthat", lang),
      MENU_ITEM: <LICHSUINPUTLIEU />,
    },
    {
      MENU_CODE: "SX10",
      MENU_NAME: getlang("materiallotstatus", lang),
      MENU_ITEM: <TINHHINHCUONLIEU />,
    },
    {
      MENU_CODE: "SX13",
      MENU_NAME: getlang("sxrolldata", lang),
      MENU_ITEM: <BAOCAOTHEOROLL />,
    },
    {
      MENU_CODE: "SX14",
      MENU_NAME: getlang("lichsutemlotsx", lang),
      MENU_ITEM: <LICHSUTEMLOTSX />,
    },
    {
      MENU_CODE: "SX11",
      MENU_NAME: getlang("quanlycapa", lang),
      MENU_ITEM: <CAPA_MANAGER />,
    },
    {
      MENU_CODE: "SX12",
      MENU_NAME: getlang("hieusuatsx", lang),
      MENU_ITEM: <PLANRESULT />,
    },
    {
      MENU_CODE: "KO1",
      MENU_NAME: getlang("nhapxuattontp", lang),
      MENU_ITEM: company === "CMS" ? <KHOTP /> : <KHOTPNEW />,
    },
    {
      MENU_CODE: "KO2",
      MENU_NAME: getlang("nhapxuattonlieu", lang),
      MENU_ITEM: <KHOLIEU />,
    },
    {
      MENU_CODE: "",
      MENU_NAME: "",
      MENU_ITEM: <AccountInfo />,
    },
    {
      MENU_CODE: "-1",
      MENU_NAME: "",
      MENU_ITEM: <AccountInfo />,
    },
  ];
  return (
    <div className='navmenu'>
      <nav>
        <ul>
          {
            SidebarData.map((sidebar_element: any, index: number) => {
              return (
                <li key={index} ><Link to={sidebar_element.path} key={index}>{sidebar_element.icon}{sidebar_element.title}
                </Link>
                  <ul className="submenu">
                    {
                      sidebar_element.subNav.map((subnav_element: any, index: number) => {
                        return (
                          <li key={index}><Link to={subnav_element.path} key={index}
                            onClick={() => {
                              if (tabModeSwap) {
                                if (
                                  userData?.JOB_NAME === "ADMIN" ||
                                  userData?.JOB_NAME === "Leader" ||
                                  userData?.JOB_NAME === "Sub Leader" ||
                                  userData?.JOB_NAME === "Dept Staff" ||
                                  subnav_element.MENU_CODE === "NS4" ||
                                  subnav_element.MENU_CODE === "NS6"
                                ) {
                                  if (tabModeSwap) {
                                    let ele_code_array: string[] = tabs.map(
                                      (ele: ELE_ARRAY, index: number) => {
                                        return ele.ELE_CODE;
                                      },
                                    );
                                    let tab_index: number = ele_code_array.indexOf(
                                      subnav_element.MENU_CODE,
                                    );
                                    //console.log(tab_index);
                                    if (tab_index !== -1) {
                                      //console.log('co tab roi');
                                      dispatch(settabIndex(tab_index));
                                    } else {
                                      //console.log('chua co tab');
                                      dispatch(
                                        addTab({
                                          ELE_NAME: subnav_element.title,
                                          ELE_CODE: subnav_element.MENU_CODE,
                                          REACT_ELE: menulist.filter(
                                            (ele: MENU_LIST_DATA, index: number) =>
                                              ele.MENU_CODE === subnav_element.MENU_CODE,
                                          )[0].MENU_ITEM,
                                        }),
                                      );
                                      dispatch(settabIndex(tabs.length));
                                    }
                                  }
                                } else {
                                  Swal.fire("Cảnh báo", "Không đủ quyền hạn", "error");
                                }
                              }
                            }}
                          >{subnav_element.icon}{subnav_element.title}
                          </Link></li>
                        )
                      })
                    }
                  </ul>
                </li>
              )
            })
          }
        </ul>
      </nav>
    </div>
  )
}
export default NavMenu
import { useContext } from "react";
import { Link } from "react-router-dom";
import {
  FcAbout,
  FcAcceptDatabase,
  FcAdvertising,
  FcApprove,
  FcCapacitor,
  FcCustomerSupport,
  FcInspection,
  FcProcess,
  FcServices,
} from "react-icons/fc";
import "./NavMenu.scss";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
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
  FaReact,
  FaProductHunt,
  FaStackOverflow,
  FaTools,
  FaFileImport,
  FaChalkboardTeacher,
} from "react-icons/fa";
import { BiCart, BiSortAZ, BiTrendingDown, BiTrendingUp, BiUpload } from "react-icons/bi";
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
  MdTv,
} from "react-icons/md";
import { WiDayLightning } from "react-icons/wi";
import { SiStatuspal } from "react-icons/si";
import { LangConText } from "../../api/Context";
import {
  AiFillAmazonCircle,
  AiFillAmazonSquare,
  AiFillCheckSquare,
  AiFillMinusCircle,
  AiOutlineCalendar,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { RootState } from "../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { getlang } from "../../components/String/String";
import { GiPriceTag } from "react-icons/gi";
import { UserData } from "../../api/GlobalInterface";
import { getCompany } from "../../api/Api";
import { addTab, settabIndex } from "../../redux/slices/globalSlice";
import Swal from "sweetalert2";
import { ELE_ARRAY, } from "../../api/GlobalInterface";
import { HiInformationCircle } from "react-icons/hi";
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
  const SidebarData = company === 'CMS' ?  [
    {
      title: getlang("nhansubophan", lang) /*Nhân sự*/,
      path: "#",
      icon: <FcManager color="green" size={15} />,
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,
      subNav: [
        {
          title: getlang("diemdanhnhom", lang),
          path: "/nhansu/diemdanhnhom",
          icon: <FcCheckmark color="red" size={15} />,
          MENU_CODE: "NS2",
        },
        {
          title: getlang("dieuchuyenteam", lang),
          path: "/nhansu/dieuchuyenteam",
          icon: <FcRefresh color="red" size={15} />,
          MENU_CODE: "NS3",
        },
        {
          title: getlang("dangky1", lang),
          path: "/nhansu/dangky",
          icon: <MdOutlineAppRegistration size={15} />,
          MENU_CODE: "NS4",
        },
        {
          title: getlang("pheduyet", lang),
          path: "/nhansu/pheduyetnghi",
          icon: <FcApprove size={15} />,
          MENU_CODE: "NS5",
        },
        {
          title: getlang("lichsudilam", lang),
          path: "/nhansu/lichsu",
          icon: <FaHistory color="green" size={15} />,
          MENU_CODE: "NS6",
        },
        {
          title: getlang("quanlycapcao", lang),
          path: "/nhansu/quanlycapcao",
          icon: <FcManager color="#cc99ff" size={15} />,
          MENU_CODE: "NS7",
        },
        {
          title: getlang("baocaonhansu", lang),
          path: "/nhansu/baocaonhansu",
          icon: <FcPieChart color="#cc99ff" size={15} />,
          MENU_CODE: "NS8",
        },
        getCompany() === "CMS" && {
          title: getlang("quanlyphongban", lang),
          path: "/nhansu/quanlyphongbannhanvien",
          icon: <FcPortraitMode color="blue" size={15} />,
          MENU_CODE: "NS1",
        },
      ],
    },
    {
      title: getlang("phonghanhchinhnhansu", lang) /*Nhân sự*/,
      path: "#",
      icon: <FaPeopleArrows color="#7F60F3" size={15} />,
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,
      subNav: [
        {
          title: getlang("quanlyphongban", lang),
          path: "/nhansu/quanlyphongbannhanvien",
          icon: <FcPortraitMode color="blue" size={15} />,
          MENU_CODE: "NS1",
        },
        {
          title: getlang("listchamcong", lang),
          path: "/nhansu/listchamcong",
          icon: <MdOutlineChecklistRtl color="blue" size={15} />,
          MENU_CODE: "NS9",
        },
        {
          title: getlang("quanlycapcaons", lang),
          path: "/nhansu/quanlycapcaons",
          icon: <FcManager color="#cc99ff" size={15} />,
          MENU_CODE: "NS10",
        },
        {
          title: getlang("baocaonhansu", lang),
          path: "/nhansu/baocaonhansu",
          icon: <FcPieChart color="#cc99ff" size={15} />,
          MENU_CODE: "NS8",
        },
      ],
    },
    {
      title: getlang("phongkinhdoanh", lang) /*Phòng Kinh Doanh*/,
      path: "#",
      icon: <FaDonate color="green" size={15} />,
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,
      subNav: [
        {
          title: getlang("quanlygiasanpham", lang) /*Quản lý PO*/,
          path: "/kinhdoanh/quotationmanager",
          icon: <GiPriceTag color="#01C716" size={15} />,
          MENU_CODE: "KD14",
        },
        {
          title: getlang("quanlypo", lang) /*Quản lý PO*/,
          path: "/kinhdoanh/pomanager",
          icon: <BiCart color="blue" size={15} />,
          MENU_CODE: "KD1",
        },
        {
          title: getlang("quanlyinvoices", lang) /*Quản lý Invoice*/,
          path: "/kinhdoanh/invoicemanager",
          icon: <FaFileInvoiceDollar color="red" size={15} />,
          MENU_CODE: "KD2",
        },
        {
          title: getlang("quanlyplan", lang) /*Quản Lý Plan*/,
          path: "/kinhdoanh/planmanager",
          icon: <FcPlanner size={15} />,
          MENU_CODE: "KD3",
        },
        {
          title: getlang("shortage", lang) /*Quản Lý Plan*/,
          path: "/kinhdoanh/shortage",
          icon: <AiFillMinusCircle size={15} color="red" />,
          MENU_CODE: "KD4",
        },
        {
          title: getlang("quanlyFCST", lang) /*Quản lý FCST*/,
          path: "/kinhdoanh/fcstmanager",
          icon: <WiDayLightning color="#cc99ff" size={15} />,
          MENU_CODE: "KD5",
        },
        {
          title: getlang("quanlyYCSX", lang) /*Quản lý YCSX*/,
          path: "/kinhdoanh/ycsxmanager",
          icon: <FcSettings color="#cc99ff" size={15} />,
          MENU_CODE: "KD6",
        },
        {
          title: getlang("quanlyPOFull", lang) /*PO tích hợp tồn kho*/,
          path: "/kinhdoanh/poandstockfull",
          icon: <FaCheckCircle color="#ff9900" size={15} />,
          MENU_CODE: "KD7",
        },
        {
          title: getlang("thongtinsanpham", lang),
          path: "/kinhdoanh/codeinfo",
          icon: <FcAbout color="#cc00ff" size={15} />,
          MENU_CODE: "KD8",
        },
        {
          title: getlang("quanlycodebom", lang),
          path: "/kinhdoanh/quanlycodebom",
          icon: <FaBomb color="black" size={15} />,
          MENU_CODE: "KD9",
          cName: "sub-nav",
        },
        {
          title: getlang("quanlykhachhang", lang),
          path: "/kinhdoanh/customermanager",
          icon: <FcCustomerSupport color="#cc00ff" size={15} />,
          MENU_CODE: "KD10",
        },
        {
          title: getlang("eqstatus", lang),
          path: "kinhdoanh/eqstatus",
          icon: <MdOutlineSignalWifiStatusbarNull color="#cc00ff" size={15} />,
          MENU_CODE: "KD11",
          cName: "sub-nav",
        },
        {
          title: getlang("ins_status", lang),
          path: "kinhdoanh/ins_status",
          icon: <FcInspection color="#cc00ff" size={15} />,
          MENU_CODE: "KD12",
          cName: "sub-nav",
        },
        {
          title: getlang("overmonitor", lang),
          path: "kinhdoanh/overmonitor",
          icon: <FaStackOverflow color="#db0c0c" size={15} />,
          MENU_CODE: "KD15",
          cName: "sub-nav",
        },
        {
          title: getlang("baocao", lang),
          path: "/kinhdoanh/kinhdoanhreport",
          icon: <FcBullish size={15} />,
          MENU_CODE: "KD13",
        },
      ],
    },
    {
      title: getlang("phongmuahang", lang) /*Phòng Kinh Doanh*/,
      path: "#",
      icon: <AiOutlineShoppingCart color="#B701CA" size={15} />,
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,
      subNav: [
        {
          title: getlang("quanlykhachhang", lang),
          path: "/kinhdoanh/customermanager",
          icon: <FcCustomerSupport color="#cc00ff" size={15} />,
          MENU_CODE: "KD10",
        },
        {
          title: getlang("quanlyvatlieu", lang) /*Quản lý VL*/,
          path: "/phongmuahang/quanlyvatlieu",
          icon: <FaScroll color="#01C716" size={15} />,
          MENU_CODE: "PU1",
        },
        {
          title: getlang("quanlymrp", lang) /*Quản lý VL*/,
          path: "/phongmuahang/mrp",
          icon: <AiOutlineCalendar color="blue" size={15} />,
          MENU_CODE: "PU2",
        },
      ],
    },
    {
      title: getlang("phongqc", lang),
      path: "#",
      icon: <AiFillCheckSquare color="#cc99ff" size={15} />,
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,
      subNav: [
        {
          title: getlang("quanlyYCSX", lang),
          path: "/qc/ycsxmanager",
          icon: <FcSettings color="#cc99ff" size={15} />,
          MENU_CODE: "QC1",
          cName: "sub-nav",
        },
        {
          title: getlang("thongtinsanpham", lang),
          path: "/qc/codeinfo",
          icon: <FcAbout color="#cc00ff" size={15} />,
          MENU_CODE: "QC2",
        },
        {
          title: "IQC",
          path: "/qc/iqc",
          icon: <MdInput color="blue" size={15} />,
          MENU_CODE: "QC3",
          cName: "sub-nav",
        },
        {
          title: "PQC",
          path: "/qc/pqc",
          icon: <FcProcess color="green" size={15} />,
          MENU_CODE: "QC4",
          cName: "sub-nav",
        },
        {
          title: "OQC",
          path: "/qc/oqc",
          icon: <MdInput color="green" size={15} />,
          MENU_CODE: "QC5",
        },
        {
          title: getlang("inspection", lang),
          path: "/qc/inspection",
          icon: <FcInspection color="blue" size={15} />,
          MENU_CODE: "QC6",
        },
        {
          title: "CS",
          path: "/qc/cs",
          icon: <FcServices color="blue" size={15} />,
          MENU_CODE: "QC7",
        },
        {
          title: getlang("dtc", lang),
          path: "/qc/dtc",
          icon: <MdOutlineAspectRatio color="red" size={15} />,
          MENU_CODE: "QC8",
        },
        {
          title: "ISO",
          path: "/qc/iso",
          icon: <BiSortAZ color="#fa1e9e" size={15} />,
          MENU_CODE: "QC9",
        },
        {
          title: getlang("baocaoqc", lang),
          path: "/qc/qcreport",
          icon: <MdBugReport color="blue" size={15} />,
          MENU_CODE: getCompany() === 'CMS' ? "QC10" : "BL1",
        },
      ],
    },
    {
      title: getlang("phongrnd", lang),
      path: "#",
      icon: <MdDesignServices color="#3366ff" size={15} />,
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,
      subNav: [
        {
          title: getlang("quanlycodebom", lang),
          path: "/rnd/quanlycodebom",
          icon: <FaBomb color="black" size={15} />,
          MENU_CODE: "RD1",
          cName: "sub-nav",
        },
        {
          title: getlang("thembomamazon", lang),
          path: "/rnd/thembomamazon",
          icon: <AiFillAmazonSquare color="green" size={15} />,
          MENU_CODE: "RD2",
          cName: "sub-nav",
        },
        {
          title: getlang("dtc", lang),
          path: "/rnd/dtc",
          icon: <MdOutlineAspectRatio color="red" size={15} />,
          MENU_CODE: "RD3",
        },
        {
          title: getlang("quanlyYCSX", lang),
          path: "rnd/ycsxmanager",
          icon: <FcSettings color="#cc99ff" size={15} />,
          MENU_CODE: "RD4",
          cName: "sub-nav",
        },
        {
          title: getlang("thietkedesignamazon", lang),
          path: "/rnd/designamazon",
          icon: <AiFillAmazonCircle color="blue" size={15} />,
          MENU_CODE: "RD5",
        },
        {
          title: getlang("productbarcodemanager", lang),
          path: "/rnd/productbarcodemanager",
          icon: <FaBarcode color="#098705" size={15} />,
          MENU_CODE: "RD6",
        },
        {
          title: getlang("samplemonitor", lang),
          path: "/rnd/samplemonitor",
          icon: <FaProductHunt color="#eef109" size={15} />,
          MENU_CODE: "RD8",
        },
        {
          title: getlang("baocaornd", lang),
          path: "/rnd/baocaornd",
          icon: <FaReact color="#b50acc" size={15} />,
          MENU_CODE: getCompany() === 'CMS' ? "RD7" : "BL1",
        },
      ],
    },
    /* {
      title: getlang("phongqlsx", lang),
      path: "#",
      icon: <MdOutlineProductionQuantityLimits color="#00cc00" size={15} />,
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,
      subNav: [
        {
          title: getlang("quanlyYCSX", lang),
          path: "qlsx/ycsxmanager",
          icon: <FcSettings color="#cc99ff" size={15} />,
          MENU_CODE: "QL1",
          cName: "sub-nav",
        },
        {
          title: getlang("quanlycodebom", lang),
          path: "qlsx/quanlycodebom",
          icon: <FaBomb color="black" size={15} />,
          MENU_CODE: "QL2",
          cName: "sub-nav",
        },
        {
          title: getlang("thongtinsanpham", lang),
          path: "qlsx/codeinfo",
          icon: <FcAbout color="#cc00ff" size={15} />,
          MENU_CODE: "QL3",
          cName: "sub-nav",
        },        
        {
          title: getlang("quanlycapa", lang),
          path: "qlsx/capamanager",
          icon: <FcCapacitor color="blue" size={15} />,
          MENU_CODE: "QL5",
        },
        {
          title: getlang("quanlymrp", lang),
          path: "qlsx/qlsxmrp",
          icon: <AiOutlineCalendar color="blue" size={15} />,
          MENU_CODE: "QL6",
        },
      ],
    }, */
    {
      title: getlang("phongsanxuat", lang),
      path: "#",
      icon: <MdPrecisionManufacturing color="red" size={15} />,
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,
      subNav: [
        {
          title: getlang("quanlyYCSX", lang),
          path: "sx/ycsxmanager",
          icon: <FcSettings color="#cc99ff" size={15} />,
          MENU_CODE: "SX1",
          cName: "sub-nav",
        },
        {
          title: getlang("thongtinsanpham", lang),
          path: "sx/codeinfo",
          icon: <FcAbout color="#cc00ff" size={15} />,
          MENU_CODE: "SX2",
          cName: "sub-nav",
        },
        {
          title: getlang("khsx", lang),
          path: "qlsx/qlsxplan",
          icon: <FaPaperPlane color="#ff33cc" size={15} />,
          MENU_CODE: "QL4",
        },
        {
          title: getlang("tienhanhsx", lang),
          path: "sx/planstatus",
          icon: <SiStatuspal color="#02a112" size={15} />,
          MENU_CODE: "SX5",
          cName: "sub-nav",
        },
        {
          title: getlang("datasanxuat", lang),
          path: "sx/datasx",
          icon: <FcAcceptDatabase color="#cc00ff" size={15} />,
          MENU_CODE: "SX3",
          cName: "sub-nav",
        },
        {
          title: getlang("inspection", lang),
          path: "sx/inspection",
          icon: <FcInspection color="blue" size={15} />,
          MENU_CODE: "SX4",
        },
        
        {
          title: 'TV Show',
          path: "sx/eqstatus",
          icon: <MdTv color="#119edf" size={15} />,
          MENU_CODE: "SX6",
          cName: "sub-nav",
        },
        {
          title: getlang("eq_manager", lang),
          path: "sx/eqstatus",
          icon: <MdOutlineSignalWifiStatusbarNull color="#cc00ff" size={15} />,
          MENU_CODE: "SX16",
          cName: "sub-nav",
        },
        {
          title: getlang("khosx", lang),
          path: "sx/khosx",
          icon: <FaWarehouse color="#4144f7" size={15} />,
          MENU_CODE: "SX17",
          cName: "sub-nav",
        },
        /* {
          title: getlang("khothat", lang),
          path: "sx/khothat",
          icon: <FaWarehouse color="#2BFC27" size={15} />,
          MENU_CODE: "SX7",
          cName: "sub-nav",
        },
        {
          title: getlang("khoao", lang),
          path: "sx/khoao",
          icon: <FaWarehouse color="#fc00ff" size={15} />,
          MENU_CODE: "SX8",
          cName: "sub-nav",
        },
        {
          title: getlang("khosub", lang),
          path: "sx/khosub",
          icon: <FaWarehouse color="#04517e" size={15} />,
          MENU_CODE: "SX15",
          cName: "sub-nav",
        }, */
       /*  {
          title: getlang("quanlycapa", lang),
          path: "sx/capamanager",
          icon: <FcCapacitor color="blue" size={15} />,
          MENU_CODE: "SX11",
        },
        {
          title: getlang("hieusuatsx", lang),
          path: "sx/planresult",
          icon: <BiTrendingUp color="green" size={15} />,
          MENU_CODE: "SX12",
        }, */
        {
          title: getlang("baocaosx", lang),
          path: "sx/baocaosx",
          icon: <FcBullish color="#ec3ede" size={15} />,
          MENU_CODE: "SX13",
        },
      ],
    },
    {
      title: getlang("bophankho", lang),
      path: "#",
      icon: <FaWarehouse color="#7459FA" size={15} />,
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,
      subNav: [
        {
          title: getlang("nhapxuattonlieu", lang),
          path: "bophankho/nhapxuattonlieu",
          icon: <FaLongArrowAltRight color="#12CAB9" size={15} />,
          MENU_CODE: "KO2",
          cName: "sub-nav",
        },
        {
          title: getlang("nhapxuattontp", lang),
          path: "bophankho/nhapxuattontp",
          icon: <FaLongArrowAltRight color="#74CE00" size={15} />,
          MENU_CODE: "KO1",
          cName: "sub-nav",
        },
      ],
    },
    {
      title: getlang("information_board", lang),
      path: "#",
      icon: <FaChalkboardTeacher  color="#21bae9" size={15} />,
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,
      subNav: [
        {
          title: getlang("information_board", lang),
          path: "information_board/news",
          icon: <FaChalkboardTeacher color="#0dc453" size={15} />,
          MENU_CODE: "IF1",
          cName: "sub-nav",
        },
        {
          title: getlang("information_register", lang),
          path: "information_board/register",
          icon: <BiUpload color="#0c1eb8" size={15} />,
          MENU_CODE: "IF2",
          cName: "sub-nav",
        },
        {
          title: getlang("post_manager", lang),
          path: "information_board/postmanager",
          icon: <FcAdvertising  color="#0c1eb8" size={15} />,
          MENU_CODE: "IF3",
          cName: "sub-nav",
        },
        ],
    },    
    {
      title: getlang("tool", lang),
      path: "#",
      icon: <FaTools color="#14c51d" size={15} />,
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,
      subNav: [
        {
          title: getlang("filetransfer", lang),
          path: "tool/filetransfer",
          icon: <FaFileImport color="#0c1eb8" size={15} />,
          MENU_CODE: "TL1",
          cName: "sub-nav",
        },
            ],
    },
  ] : [
    {
      title: getlang("nhansubophan", lang) /*Nhân sự*/,
      path: "#",
      icon: <FcManager color="green" size={15} />,
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,
      subNav: [
        {
          title: getlang("diemdanhnhom", lang),
          path: "/nhansu/diemdanhnhom",
          icon: <FcCheckmark color="red" size={15} />,
          MENU_CODE: "NS2",
        },
        {
          title: getlang("dieuchuyenteam", lang),
          path: "/nhansu/dieuchuyenteam",
          icon: <FcRefresh color="red" size={15} />,
          MENU_CODE: "NS3",
        },
        {
          title: getlang("dangky1", lang),
          path: "/nhansu/dangky",
          icon: <MdOutlineAppRegistration size={15} />,
          MENU_CODE: "NS4",
        },
        {
          title: getlang("pheduyet", lang),
          path: "/nhansu/pheduyetnghi",
          icon: <FcApprove size={15} />,
          MENU_CODE: "NS5",
        },
        {
          title: getlang("lichsudilam", lang),
          path: "/nhansu/lichsu",
          icon: <FaHistory color="green" size={15} />,
          MENU_CODE: "NS6",
        },
        {
          title: getlang("quanlycapcao", lang),
          path: "/nhansu/quanlycapcao",
          icon: <FcManager color="#cc99ff" size={15} />,
          MENU_CODE: "NS7",
        },
        {
          title: getlang("baocaonhansu", lang),
          path: "/nhansu/baocaonhansu",
          icon: <FcPieChart color="#cc99ff" size={15} />,
          MENU_CODE: "NS8",
        },       
      ],
    },
    {
      title: getlang("phonghanhchinhnhansu", lang) /*Nhân sự*/,
      path: "#",
      icon: <FaPeopleArrows color="#7F60F3" size={15} />,
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,
      subNav: [
        {
          title: getlang("quanlyphongban", lang),
          path: "/nhansu/quanlyphongbannhanvien",
          icon: <FcPortraitMode color="blue" size={15} />,
          MENU_CODE: "NS1",
        },
        {
          title: getlang("listchamcong", lang),
          path: "/nhansu/listchamcong",
          icon: <MdOutlineChecklistRtl color="blue" size={15} />,
          MENU_CODE: "NS9",
        },
        {
          title: getlang("quanlycapcaons", lang),
          path: "/nhansu/quanlycapcaons",
          icon: <FcManager color="#cc99ff" size={15} />,
          MENU_CODE: "NS10",
        },
        {
          title: getlang("baocaonhansu", lang),
          path: "/nhansu/baocaonhansu",
          icon: <FcPieChart color="#cc99ff" size={15} />,
          MENU_CODE: "NS8",
        },
      ],
    },
    {
      title: getlang("phongkinhdoanh", lang) /*Phòng Kinh Doanh*/,
      path: "#",
      icon: <FaDonate color="green" size={15} />,
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,
      subNav: [
        {
          title: getlang("quanlygiasanpham", lang) /*Quản lý PO*/,
          path: "/kinhdoanh/quotationmanager",
          icon: <GiPriceTag color="#01C716" size={15} />,
          MENU_CODE: "KD14",
        },
        {
          title: getlang("quanlypo", lang) /*Quản lý PO*/,
          path: "/kinhdoanh/pomanager",
          icon: <BiCart color="blue" size={15} />,
          MENU_CODE: "KD1",
        },
        {
          title: getlang("quanlyinvoices", lang) /*Quản lý Invoice*/,
          path: "/kinhdoanh/invoicemanager",
          icon: <FaFileInvoiceDollar color="red" size={15} />,
          MENU_CODE: "KD2",
        },
        {
          title: getlang("quanlyplan", lang) /*Quản Lý Plan*/,
          path: "/kinhdoanh/planmanager",
          icon: <FcPlanner size={15} />,
          MENU_CODE: "KD3",
        },
        {
          title: getlang("shortage", lang) /*Quản Lý Plan*/,
          path: "/kinhdoanh/shortage",
          icon: <AiFillMinusCircle size={15} color="red" />,
          MENU_CODE: "KD4",
        },
        {
          title: getlang("quanlyFCST", lang) /*Quản lý FCST*/,
          path: "/kinhdoanh/fcstmanager",
          icon: <WiDayLightning color="#cc99ff" size={15} />,
          MENU_CODE: "KD5",
        },
        {
          title: getlang("quanlyYCSX", lang) /*Quản lý YCSX*/,
          path: "/kinhdoanh/ycsxmanager",
          icon: <FcSettings color="#cc99ff" size={15} />,
          MENU_CODE: "KD6",
        },
        {
          title: getlang("quanlyPOFull", lang) /*PO tích hợp tồn kho*/,
          path: "/kinhdoanh/poandstockfull",
          icon: <FaCheckCircle color="#ff9900" size={15} />,
          MENU_CODE: "KD7",
        },
        {
          title: getlang("thongtinsanpham", lang),
          path: "/kinhdoanh/codeinfo",
          icon: <FcAbout color="#cc00ff" size={15} />,
          MENU_CODE: "KD8",
        },
        {
          title: getlang("quanlycodebom", lang),
          path: "/kinhdoanh/quanlycodebom",
          icon: <FaBomb color="black" size={15} />,
          MENU_CODE: "KD9",
          cName: "sub-nav",
        },
        {
          title: getlang("quanlykhachhang", lang),
          path: "/kinhdoanh/customermanager",
          icon: <FcCustomerSupport color="#cc00ff" size={15} />,
          MENU_CODE: "KD10",
        },
        {
          title: getlang("eqstatus", lang),
          path: "kinhdoanh/eqstatus",
          icon: <MdOutlineSignalWifiStatusbarNull color="#cc00ff" size={15} />,
          MENU_CODE: "KD11",
          cName: "sub-nav",
        },
        {
          title: getlang("ins_status", lang),
          path: "kinhdoanh/ins_status",
          icon: <FcInspection color="#cc00ff" size={15} />,
          MENU_CODE: "KD12",
          cName: "sub-nav",
        },
        {
          title: getlang("baocao", lang),
          path: "/kinhdoanh/kinhdoanhreport",
          icon: <FcBullish size={15} />,
          MENU_CODE: "KD13",
        },
      ],
    },
    {
      title: getlang("phongmuahang", lang) /*Phòng Kinh Doanh*/,
      path: "#",
      icon: <AiOutlineShoppingCart color="#B701CA" size={15} />,
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,
      subNav: [
        {
          title: getlang("quanlykhachhang", lang),
          path: "/kinhdoanh/customermanager",
          icon: <FcCustomerSupport color="#cc00ff" size={15} />,
          MENU_CODE: "KD10",
        },
        {
          title: getlang("quanlyvatlieu", lang) /*Quản lý VL*/,
          path: "/phongmuahang/quanlyvatlieu",
          icon: <FaScroll color="#01C716" size={15} />,
          MENU_CODE: "PU1",
        },
        {
          title: getlang("quanlymrp", lang) /*Quản lý VL*/,
          path: "/phongmuahang/mrp",
          icon: <AiOutlineCalendar color="blue" size={15} />,
          MENU_CODE: "PU2",
        },
      ],
    },
    {
      title: getlang("phongqc", lang),
      path: "#",
      icon: <AiFillCheckSquare color="#cc99ff" size={15} />,
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,
      subNav: [
        {
          title: getlang("quanlyYCSX", lang),
          path: "/qc/ycsxmanager",
          icon: <FcSettings color="#cc99ff" size={15} />,
          MENU_CODE: "QC1",
          cName: "sub-nav",
        },
        {
          title: getlang("thongtinsanpham", lang),
          path: "/qc/codeinfo",
          icon: <FcAbout color="#cc00ff" size={15} />,
          MENU_CODE: "QC2",
        },
        {
          title: "IQC",
          path: "/qc/iqc",
          icon: <MdInput color="blue" size={15} />,
          MENU_CODE: "QC3",
          cName: "sub-nav",
        },
        {
          title: "PQC",
          path: "/qc/pqc",
          icon: <FcProcess color="green" size={15} />,
          MENU_CODE: "QC4",
          cName: "sub-nav",
        },
        {
          title: "OQC",
          path: "/qc/oqc",
          icon: <MdInput color="green" size={15} />,
          MENU_CODE: "QC5",
        },
        {
          title: getlang("inspection", lang),
          path: "/qc/inspection",
          icon: <FcInspection color="blue" size={15} />,
          MENU_CODE: "QC6",
        },
        {
          title: "CS",
          path: "/qc/cs",
          icon: <FcServices color="blue" size={15} />,
          MENU_CODE: "QC7",
        },
        {
          title: getlang("dtc", lang),
          path: "/qc/dtc",
          icon: <MdOutlineAspectRatio color="red" size={15} />,
          MENU_CODE: "QC8",
        },
        {
          title: "ISO",
          path: "/qc/iso",
          icon: <BiSortAZ color="#fa1e9e" size={15} />,
          MENU_CODE: "QC9",
        },
        {
          title: getlang("baocaoqc", lang),
          path: "/qc/qcreport",
          icon: <MdBugReport color="blue" size={15} />,
          MENU_CODE: getCompany() === 'CMS' ? "QC10" : "BL1",
        },
      ],
    },
    {
      title: getlang("phongrnd", lang),
      path: "#",
      icon: <MdDesignServices color="#3366ff" size={15} />,
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,
      subNav: [
        {
          title: getlang("quanlycodebom", lang),
          path: "/rnd/quanlycodebom",
          icon: <FaBomb color="black" size={15} />,
          MENU_CODE: "RD1",
          cName: "sub-nav",
        },
        {
          title: getlang("thembomamazon", lang),
          path: "/rnd/thembomamazon",
          icon: <AiFillAmazonSquare color="green" size={15} />,
          MENU_CODE: "RD2",
          cName: "sub-nav",
        },
        {
          title: getlang("dtc", lang),
          path: "/rnd/dtc",
          icon: <MdOutlineAspectRatio color="red" size={15} />,
          MENU_CODE: "RD3",
        },
        {
          title: getlang("quanlyYCSX", lang),
          path: "rnd/ycsxmanager",
          icon: <FcSettings color="#cc99ff" size={15} />,
          MENU_CODE: "RD4",
          cName: "sub-nav",
        },
        {
          title: getlang("thietkedesignamazon", lang),
          path: "/rnd/designamazon",
          icon: <AiFillAmazonCircle color="blue" size={15} />,
          MENU_CODE: "RD5",
        },
        {
          title: getlang("productbarcodemanager", lang),
          path: "/rnd/productbarcodemanager",
          icon: <FaBarcode color="#098705" size={15} />,
          MENU_CODE: "RD6",
        },
        {
          title: getlang("samplemonitor", lang),
          path: "/rnd/samplemonitor",
          icon: <FaProductHunt color="#eef109" size={15} />,
          MENU_CODE: "RD8",
        },
        {
          title: getlang("baocaornd", lang),
          path: "/rnd/baocaornd",
          icon: <FaReact color="#b50acc" size={15} />,
          MENU_CODE: getCompany() === 'CMS' ? "RD7" : "BL1",
        },
      ],
    },
    {
      title: getlang("phongqlsx", lang),
      path: "#",
      icon: <MdOutlineProductionQuantityLimits color="#00cc00" size={15} />,
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,
      subNav: [
        {
          title: getlang("quanlyYCSX", lang),
          path: "qlsx/ycsxmanager",
          icon: <FcSettings color="#cc99ff" size={15} />,
          MENU_CODE: "QL1",
          cName: "sub-nav",
        },
        {
          title: getlang("quanlycodebom", lang),
          path: "qlsx/quanlycodebom",
          icon: <FaBomb color="black" size={15} />,
          MENU_CODE: "QL2",
          cName: "sub-nav",
        },
        {
          title: getlang("thongtinsanpham", lang),
          path: "qlsx/codeinfo",
          icon: <FcAbout color="#cc00ff" size={15} />,
          MENU_CODE: "QL3",
          cName: "sub-nav",
        },
        {
          title: getlang("quanlyplansx", lang),
          path: "qlsx/qlsxplan",
          icon: <FaPaperPlane color="#ff33cc" size={15} />,
          MENU_CODE: "QL4",
        },
        {
          title: getlang("quanlycapa", lang),
          path: "qlsx/capamanager",
          icon: <FcCapacitor color="blue" size={15} />,
          MENU_CODE: "QL5",
        },
        {
          title: getlang("quanlymrp", lang),
          path: "qlsx/qlsxmrp",
          icon: <AiOutlineCalendar color="blue" size={15} />,
          MENU_CODE: "QL6",
        },
      ],
    },
    {
      title: getlang("phongsanxuat", lang),
      path: "#",
      icon: <MdPrecisionManufacturing color="red" size={15} />,
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,
      subNav: [
        {
          title: getlang("quanlyYCSX", lang),
          path: "sx/ycsxmanager",
          icon: <FcSettings color="#cc99ff" size={15} />,
          MENU_CODE: "SX1",
          cName: "sub-nav",
        },
        {
          title: getlang("thongtinsanpham", lang),
          path: "sx/codeinfo",
          icon: <FcAbout color="#cc00ff" size={15} />,
          MENU_CODE: "SX2",
          cName: "sub-nav",
        },
        {
          title: getlang("datasanxuat", lang),
          path: "sx/datasx",
          icon: <FcAcceptDatabase color="#cc00ff" size={15} />,
          MENU_CODE: "SX3",
          cName: "sub-nav",
        },
        {
          title: getlang("inspection", lang),
          path: "sx/inspection",
          icon: <FcInspection color="blue" size={15} />,
          MENU_CODE: "SX4",
        },
        {
          title: getlang("planstatus", lang),
          path: "sx/planstatus",
          icon: <SiStatuspal color="#02a112" size={15} />,
          MENU_CODE: "SX5",
          cName: "sub-nav",
        },
        {
          title: getlang("eqstatus", lang),
          path: "sx/eqstatus",
          icon: <MdOutlineSignalWifiStatusbarNull color="#cc00ff" size={15} />,
          MENU_CODE: "SX6",
          cName: "sub-nav",
        },
        {
          title: getlang("khothat", lang),
          path: "sx/khothat",
          icon: <FaWarehouse color="#2BFC27" size={15} />,
          MENU_CODE: "SX7",
          cName: "sub-nav",
        },
        {
          title: getlang("khoao", lang),
          path: "sx/khoao",
          icon: <FaWarehouse color="#fc00ff" size={15} />,
          MENU_CODE: "SX8",
          cName: "sub-nav",
        },
        {
          title: getlang("quanlycapa", lang),
          path: "sx/capamanager",
          icon: <FcCapacitor color="blue" size={15} />,
          MENU_CODE: "SX11",
        },
        {
          title: getlang("hieusuatsx", lang),
          path: "sx/planresult",
          icon: <BiTrendingUp color="green" size={15} />,
          MENU_CODE: "SX12",
        },
      ],
    },
    {
      title: getlang("bophankho", lang),
      path: "#",
      icon: <FaWarehouse color="#7459FA" size={15} />,
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,
      subNav: [
        {
          title: getlang("nhapxuattonlieu", lang),
          path: "bophankho/nhapxuattonlieu",
          icon: <FaLongArrowAltRight color="#12CAB9" size={15} />,
          MENU_CODE: "KO2",
          cName: "sub-nav",
        },
        {
          title: getlang("nhapxuattontp", lang),
          path: "bophankho/nhapxuattontp",
          icon: <FaLongArrowAltRight color="#74CE00" size={15} />,
          MENU_CODE: "KO1",
          cName: "sub-nav",
        },
      ],
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
                                      dispatch(
                                        addTab({
                                          ELE_NAME: subnav_element.title,
                                          ELE_CODE: subnav_element.MENU_CODE,
                                          REACT_ELE: ""
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
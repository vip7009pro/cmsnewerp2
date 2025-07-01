import { Link } from "react-router-dom";
import {
  FcAbout,
  FcAcceptDatabase,
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
  FaFileInvoiceDollar,
  FaCheckCircle,
  FaHistory,
  FaBomb,
  FaPaperPlane,
  FaWarehouse,
  FaScroll,
  FaBarcode,
  FaLongArrowAltRight,
  FaReact,
  FaProductHunt,
  FaStackOverflow,
} from "react-icons/fa";
import { BiCart, BiSortAZ } from "react-icons/bi";
import {
  FcPlanner,
  FcSettings,
  FcBullish,
  FcPortraitMode,
  FcManager,
  FcPieChart,
  FcRefresh,
} from "react-icons/fc";
import {
  MdBugReport,
  MdErrorOutline,
  MdInput,
  MdOutlineAppRegistration,
  MdOutlineAspectRatio,
  MdOutlineChecklistRtl,
  MdOutlineGppGood,
  MdOutlineLocalShipping,
  MdOutlineSignalWifiStatusbarNull,
} from "react-icons/md";
import { WiDayLightning } from "react-icons/wi";
import { SiStatuspal } from "react-icons/si";
import {
  AiFillAmazonCircle,
  AiFillAmazonSquare,
  AiFillMinusCircle,
  AiOutlineAudit,
  AiOutlineCalendar,
} from "react-icons/ai";
import { RootState } from "../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { getlang } from "../String/String";
import { GiPriceTag } from "react-icons/gi";
import { UserData } from "../../api/GlobalInterface";
import { getCompany } from "../../api/Api";
import { addTab, settabIndex } from "../../redux/slices/globalSlice";
import Swal from "sweetalert2";
import { ELE_ARRAY, } from "../../api/GlobalInterface";
import { FaCodePullRequest } from "react-icons/fa6";
import { CiShoppingCart } from "react-icons/ci";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { GrContact } from "react-icons/gr";
const NavMenu2 = () => {
  const lang = "vi"
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
      title: getlang("orders", lang),
      path: "#",
      icon: <CiShoppingCart  color="#e03384" size={20} />,
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,
      subNav: [
        {
          title: getlang("quanlyYCSX", lang),
          path: "/partners/qc/ycsxmanager",
          icon: <FcSettings color="#cc99ff" size={20} />,
          MENU_CODE: "QC1",
          cName: "sub-nav",
        },
        {
          title: getlang("thongtinsanpham", lang),
          path: "/partners/qc/codeinfo",
          icon: <FcAbout color="#cc00ff" size={20} />,
          MENU_CODE: "QC2",
        },
        {
          title: "IQC",
          path: "/partners/qc/iqc",
          icon: <MdInput color="blue" size={20} />,
          MENU_CODE: "QC3",
          cName: "sub-nav",
        },
        {
          title: "PQC",
          path: "/partners/qc/pqc",
          icon: <FcProcess color="green" size={20} />,
          MENU_CODE: "QC4",
          cName: "sub-nav",
        },
        {
          title: "OQC",
          path: "/partners/qc/oqc",
          icon: <MdInput color="green" size={20} />,
          MENU_CODE: "QC5",
        },
        {
          title: getlang("inspection", lang),
          path: "/partners/qc/inspection",
          icon: <FcInspection color="blue" size={20} />,
          MENU_CODE: "QC6",
        },
        {
          title: "CS",
          path: "/partners/qc/cs",
          icon: <FcServices color="blue" size={20} />,
          MENU_CODE: "QC7",
        },
        {
          title: getlang("dtc", lang),
          path: "/partners/qc/dtc",
          icon: <MdOutlineAspectRatio color="red" size={20} />,
          MENU_CODE: "QC8",
        },
        {
          title: "ISO",
          path: "/partners/qc/iso",
          icon: <BiSortAZ color="#fa1e9e" size={20} />,
          MENU_CODE: "QC9",
        },
        {
          title: getlang("baocaoqc", lang),
          path: "/partners/qc/qcreport",
          icon: <MdBugReport color="blue" size={20} />,
          MENU_CODE: getCompany() === 'CMS' ? "QC10" : "BL1",
        },
      ],
    },
    {
      title: getlang("delivery", lang),
      path: "#",
      icon: <MdOutlineLocalShipping color="#3366ff" size={20} />,
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,
      subNav: [
        {
          title: getlang("quanlycodebom", lang),
          path: "/partners/rnd/quanlycodebom",
          icon: <FaBomb color="black" size={20} />,
          MENU_CODE: "RD1",
          cName: "sub-nav",
        },
        {
          title: getlang("thembomamazon", lang),
          path: "/partners/rnd/thembomamazon",
          icon: <AiFillAmazonSquare color="green" size={20} />,
          MENU_CODE: "RD2",
          cName: "sub-nav",
        },
        {
          title: getlang("dtc", lang),
          path: "/partners/rnd/dtc",
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
          path: "/partners/rnd/designamazon",
          icon: <AiFillAmazonCircle color="blue" size={20} />,
          MENU_CODE: "RD5",
        },
        {
          title: getlang("productbarcodemanager", lang),
          path: "/partners/rnd/productbarcodemanager",
          icon: <FaBarcode color="#098705" size={20} />,
          MENU_CODE: "RD6",
        },
        {
          title: getlang("samplemonitor", lang),
          path: "/partners/rnd/samplemonitor",
          icon: <FaProductHunt color="#eef109" size={20} />,
          MENU_CODE: "RD8",
        },
        {
          title: getlang("baocaornd", lang),
          path: "/partners/rnd/baocaornd",
          icon: <FaReact color="#b50acc" size={20} />,
          MENU_CODE: getCompany() === 'CMS' ? "RD7" : "BL1",
        },
      ],
    },
    {
      title: getlang("forecast", lang),
      path: "#",
      icon: <TiWeatherPartlySunny  color="#051f72" size={20} />,
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
      title: getlang("incominginspection", lang),
      path: "#",
      icon: <FcInspection color="green" size={20} />,
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,
      subNav: [
        {
          title: getlang("incominginspection", lang),
          path: "/partners/incoming-inspection",
          icon: <FcInspection color="red" size={20} />,
          MENU_CODE: "NS2",
        },
        {
          title: getlang("dieuchuyenteam", lang),
          path: "/partners/quality-issue",
          icon: <FcRefresh color="red" size={20} />,
          MENU_CODE: "NS3",
        },
        {
          title: getlang("dangky1", lang),
          path: "/partners/nhansu/dangky",
          icon: <MdOutlineAppRegistration size={20} />,
          MENU_CODE: "NS4",
        },
        {
          title: getlang("pheduyet", lang),
          path: "/partners/nhansu/pheduyetnghi",
          icon: <FcApprove size={20} />,
          MENU_CODE: "NS5",
        },
        {
          title: getlang("lichsudilam", lang),
          path: "/partners/nhansu/lichsu",
          icon: <FaHistory color="green" size={20} />,
          MENU_CODE: "NS6",
        },
        {
          title: getlang("quanlycapcao", lang),
          path: "/partners/nhansu/quanlycapcao",
          icon: <FcManager color="#cc99ff" size={20} />,
          MENU_CODE: "NS7",
        },
        {
          title: getlang("baocaonhansu", lang),
          path: "/partners/nhansu/baocaonhansu",
          icon: <FcPieChart color="#cc99ff" size={20} />,
          MENU_CODE: "NS8",
        },
        getCompany() === "CMS" && {
          title: getlang("quanlyphongban", lang),
          path: "/partners/nhansu/quanlyphongbannhanvien",
          icon: <FcPortraitMode color="blue" size={20} />,
          MENU_CODE: "NS1",
        },
      ],
    },
    {
      title: getlang("qualityissue", lang) /*Nhân sự*/,
      path: "#",
      icon: <MdErrorOutline color="#ff0000" size={20} />,
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,
      subNav: [
        {
          title: getlang("quanlyphongban", lang),
          path: "/partners/nhansu/quanlyphongbannhanvien",
          icon: <FcPortraitMode color="blue" size={20} />,
          MENU_CODE: "NS1",
        },
        {
          title: getlang("listchamcong", lang),
          path: "/partners/nhansu/listchamcong",
          icon: <MdOutlineChecklistRtl color="blue" size={20} />,
          MENU_CODE: "NS9",
        },
        {
          title: getlang("baocaonhansu", lang),
          path: "/partners/nhansu/baocaonhansu",
          icon: <FcPieChart color="#cc99ff" size={20} />,
          MENU_CODE: "NS8",
        },
      ],
    },
    {
      title: getlang("audit", lang) /*Phòng Kinh Doanh*/,
      path: "#",
      icon: <AiOutlineAudit color="green" size={20} />,
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,
      subNav: [
        {
          title: getlang("quanlygiasanpham", lang) /*Quản lý PO*/,
          path: "/partners/kinhdoanh/quotationmanager",
          icon: <GiPriceTag color="#01C716" size={20} />,
          MENU_CODE: "KD14",
        },
        {
          title: getlang("quanlypo", lang) /*Quản lý PO*/,
          path: "/partners/kinhdoanh/pomanager",
          icon: <BiCart color="blue" size={20} />,
          MENU_CODE: "KD1",
        },
        {
          title: getlang("quanlyinvoices", lang) /*Quản lý Invoice*/,
          path: "/partners/kinhdoanh/invoicemanager",
          icon: <FaFileInvoiceDollar color="red" size={20} />,
          MENU_CODE: "KD2",
        },
        {
          title: getlang("quanlyplan", lang) /*Quản Lý Plan*/,
          path: "/partners/kinhdoanh/planmanager",
          icon: <FcPlanner size={20} />,
          MENU_CODE: "KD3",
        },
        {
          title: getlang("shortage", lang) /*Quản Lý Plan*/,
          path: "/partners/kinhdoanh/shortage",
          icon: <AiFillMinusCircle size={20} color="red" />,
          MENU_CODE: "KD4",
        },
        {
          title: getlang("quanlyFCST", lang) /*Quản lý FCST*/,
          path: "/partners/kinhdoanh/fcstmanager",
          icon: <WiDayLightning color="#cc99ff" size={20} />,
          MENU_CODE: "KD5",
        },
        {
          title: getlang("quanlyYCSX", lang) /*Quản lý YCSX*/,
          path: "/partners/kinhdoanh/ycsxmanager",
          icon: <FcSettings color="#cc99ff" size={20} />,
          MENU_CODE: "KD6",
        },
        {
          title: getlang("quanlyPOFull", lang) /*PO tích hợp tồn kho*/,
          path: "/partners/kinhdoanh/poandstockfull",
          icon: <FaCheckCircle color="#ff9900" size={20} />,
          MENU_CODE: "KD7",
        },
        {
          title: getlang("thongtinsanpham", lang),
          path: "/partners/kinhdoanh/codeinfo",
          icon: <FcAbout color="#cc00ff" size={20} />,
          MENU_CODE: "KD8",
        },
        {
          title: getlang("quanlycodebom", lang),
          path: "/partners/kinhdoanh/quanlycodebom",
          icon: <FaBomb color="black" size={20} />,
          MENU_CODE: "KD9",
          cName: "sub-nav",
        },
        {
          title: getlang("quanlykhachhang", lang),
          path: "/partners/kinhdoanh/customermanager",
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
          title: getlang("overmonitor", lang),
          path: "kinhdoanh/overmonitor",
          icon: <FaStackOverflow color="#db0c0c" size={20} />,
          MENU_CODE: "KD15",
          cName: "sub-nav",
        },
        {
          title: getlang("baocao", lang),
          path: "/partners/kinhdoanh/kinhdoanhreport",
          icon: <FcBullish size={20} />,
          MENU_CODE: "KD13",
        },
      ],
    },
    {
      title: getlang("cmsrequest", lang) /*Phòng Kinh Doanh*/,
      path: "#",
      icon: <FaCodePullRequest color="#B701CA" size={20} />,
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,
      subNav: [
        {
          title: getlang("quanlykhachhang", lang),
          path: "/partners/kinhdoanh/customermanager",
          icon: <FcCustomerSupport color="#cc00ff" size={20} />,
          MENU_CODE: "KD10",
        },
        {
          title: getlang("quanlyvatlieu", lang) /*Quản lý VL*/,
          path: "/partners/phongmuahang/quanlyvatlieu",
          icon: <FaScroll color="#01C716" size={20} />,
          MENU_CODE: "PU1",
        },
        {
          title: getlang("quanlymrp", lang) /*Quản lý VL*/,
          path: "/partners/phongmuahang/mrp",
          icon: <AiOutlineCalendar color="blue" size={20} />,
          MENU_CODE: "PU2",
        },
      ],
    },    
    {
      title: getlang("vendorquality", lang),
      path: "#",
      icon: <MdOutlineGppGood   color="#96d9ca" size={20} />,
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
        {
          title: getlang("khosub", lang),
          path: "sx/khosub",
          icon: <FaWarehouse color="#04517e" size={20} />,
          MENU_CODE: "SX15",
          cName: "sub-nav",
        },
       /*  {
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
        }, */
        {
          title: getlang("baocaosx", lang),
          path: "sx/baocaosx",
          icon: <FcBullish color="#ec3ede" size={20} />,
          MENU_CODE: "SX13",
        },
      ],
    },
    {
      title: getlang("about", lang),
      path: "#",
      icon: <FcAbout color="#7459FA" size={20} />,
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
    {
      title: getlang("contact", lang),
      path: "#",
      icon: <GrContact  color="#0bbf41" size={20} />,
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
export default NavMenu2
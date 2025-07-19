import { getlang } from "../../String/String";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { FaDonate, FaFileInvoiceDollar, FaCheckCircle, FaHistory, FaBomb, FaPaperPlane, FaWarehouse, FaScroll, FaPeopleArrows, FaBarcode, FaLongArrowAltRight, FaReact, FaProductHunt, FaStackOverflow, FaTools, FaFileImport, FaChalkboardTeacher, FaChartArea, FaChartPie } from 'react-icons/fa';
import { BiCart, BiMoney, BiSortAZ, BiTrendingUp, BiUpload } from 'react-icons/bi';
import { FcPlanner, FcSettings, FcBullish, FcPortraitMode, FcManager, FcCheckmark, FcPieChart, FcRefresh } from 'react-icons/fc';
import { MdBugReport, MdDesignServices, MdInput, MdOutlineAppRegistration, MdOutlineAspectRatio, MdOutlineChecklistRtl, MdOutlineDraw, MdOutlineProductionQuantityLimits, MdOutlineSignalWifiStatusbarNull, MdPrecisionManufacturing, MdTv } from 'react-icons/md';
import { WiDayLightning } from 'react-icons/wi';
import { SiStatuspal } from 'react-icons/si';
import { AiFillAmazonCircle, AiFillAmazonSquare, AiFillCheckSquare, AiFillMinusCircle, AiOutlineCalendar, AiOutlineShoppingCart } from 'react-icons/ai';
import { FcAbout, FcAcceptDatabase, FcAdvertising, FcApprove, FcCapacitor, FcCustomerSupport, FcInspection, FcProcess, FcServices } from 'react-icons/fc';
import { GiPriceTag } from "react-icons/gi";
import { getCompany } from "../../../api/Api";

export const NavMenuCMS = (lang?: string) => {
    return [
        {
          title: getlang('nhansubophan', lang ?? 'vi') /*Nhân sự*/,
          path: '#',
          icon: <FcManager color='green' size={15} />,
          iconClosed: <KeyboardArrowDownIcon />,
          iconOpened: <KeyboardArrowUpIcon />,
          subNav: [
            {
              title: getlang('diemdanhnhom', lang ?? 'vi'),
              path: '/nhansu/diemdanhnhom',
              icon: <FcCheckmark color='red' size={15} />,
              MENU_CODE: 'NS2',
            },
            {
              title: getlang('dieuchuyenteam', lang ?? 'vi'),
              path: '/nhansu/dieuchuyenteam',
              icon: <FcRefresh color='red' size={15} />,
              MENU_CODE: 'NS3',
            },
            {
              title: getlang('dangky1', lang ?? 'vi'),
              path: '/nhansu/dangky',
              icon: <MdOutlineAppRegistration size={15} />,
              MENU_CODE: 'NS4',
            },
            {
              title: getlang('pheduyet', lang ?? 'vi'),
              path: '/nhansu/pheduyetnghi',
              icon: <FcApprove size={15} />,
              MENU_CODE: 'NS5',
            },
            {
              title: getlang('lichsudilam', lang ?? 'vi'),
              path: '/nhansu/lichsu',
              icon: <FaHistory color='green' size={15} />,
              MENU_CODE: 'NS6',
            },
            {
              title: getlang('quanlycapcao', lang ?? 'vi'),
              path: '/nhansu/quanlycapcao',
              icon: <FcManager color='#cc99ff' size={15} />,
              MENU_CODE: 'NS7',
            },
            {
              title: getlang('baocaonhansu', lang ?? 'vi'),
              path: '/nhansu/baocaonhansu',
              icon: <FcPieChart color='#cc99ff' size={15} />,
              MENU_CODE: 'NS8',
            },
            {
              title: getlang('quanlyphongban', lang ?? 'vi'),
              path: '/nhansu/quanlyphongbannhanvien',
              icon: <FcPortraitMode color='blue' size={15} />,
              MENU_CODE: 'NS1',
            },
          ],
        },
        {
          title: getlang('phonghanhchinhnhansu', lang ?? 'vi') /*Nhân sự*/,
          path: '#',
          icon: <FaPeopleArrows color='#7F60F3' size={15} />,
          iconClosed: <KeyboardArrowDownIcon />,
          iconOpened: <KeyboardArrowUpIcon />,
          subNav: [
            {
              title: getlang('quanlyphongban', lang ?? 'vi'),
              path: '/nhansu/quanlyphongbannhanvien',
              icon: <FcPortraitMode color='blue' size={15} />,
              MENU_CODE: 'NS1',
            },
            {
              title: getlang('listchamcong', lang ?? 'vi'),
              path: '/nhansu/listchamcong',
              icon: <MdOutlineChecklistRtl color='blue' size={15} />,
              MENU_CODE: 'NS9',
            },
            {
              title: getlang('quanlycapcaons', lang ?? 'vi'),
              path: '/nhansu/quanlycapcaons',
              icon: <FcManager color='#cc99ff' size={15} />,
              MENU_CODE: 'NS10',
            },
            {
              title: getlang('baocaonhansu', lang ?? 'vi'),
              path: '/nhansu/baocaonhansu',
              icon: <FcPieChart color='#cc99ff' size={15} />,
              MENU_CODE: 'NS8',
            },
          ],
        },
        {
          title: getlang('phongkinhdoanh', lang ?? 'vi') /*Phòng Kinh Doanh*/,
          path: '#',
          icon: <FaDonate color='green' size={15} />,
          iconClosed: <KeyboardArrowDownIcon />,
          iconOpened: <KeyboardArrowUpIcon />,
          subNav: [
            {
              title: getlang('quanlygiasanpham', lang ?? 'vi') /*Quản lý PO*/,
              path: '/kinhdoanh/quotationmanager',
              icon: <GiPriceTag color='#01C716' size={15} />,
              MENU_CODE: 'KD14',
            },
            {
              title: getlang('quanlypo', lang ?? 'vi') /*Quản lý PO*/,
              path: '/kinhdoanh/pomanager',
              icon: <BiCart color='blue' size={15} />,
              MENU_CODE: 'KD1',
            },
            {
              title: getlang('quanlyinvoices', lang ?? 'vi') /*Quản lý Invoice*/,
              path: '/kinhdoanh/invoicemanager',
              icon: <FaFileInvoiceDollar color='red' size={15} />,
              MENU_CODE: 'KD2',
            },
            {
              title: getlang('quanlyplan', lang ?? 'vi') /*Quản Lý Plan*/,
              path: '/kinhdoanh/planmanager',
              icon: <FcPlanner size={15} />,
              MENU_CODE: 'KD3',
            },
            {
              title: getlang('shortage', lang ?? 'vi') /*Quản Lý Plan*/,
              path: '/kinhdoanh/shortage',
              icon: <AiFillMinusCircle size={15} color='red' />,
              MENU_CODE: 'KD4',
            },
            {
              title: getlang('quanlyFCST', lang ?? 'vi') /*Quản lý FCST*/,
              path: '/kinhdoanh/fcstmanager',
              icon: <WiDayLightning color='#cc99ff' size={15} />,
              MENU_CODE: 'KD5',
            },
            {
              title: getlang('quanlyYCSX', lang ?? 'vi') /*Quản lý YCSX*/,
              path: '/kinhdoanh/ycsxmanager',
              icon: <FcSettings color='#cc99ff' size={15} />,
              MENU_CODE: 'KD6',
            },
            {
              title: getlang('quanlyPOFull', lang ?? 'vi') /*PO tích hợp tồn kho*/,
              path: '/kinhdoanh/poandstockfull',
              icon: <FaCheckCircle color='#ff9900' size={15} />,
              MENU_CODE: 'KD7',
            },
            {
              title: getlang('thongtinsanpham', lang ?? 'vi'),
              path: '/kinhdoanh/codeinfo',
              icon: <FcAbout color='#cc00ff' size={15} />,
              MENU_CODE: 'KD8',
            },
            {
              title: getlang('quanlycodebom', lang ?? 'vi'),
              path: '/kinhdoanh/quanlycodebom',
              icon: <FaBomb color='black' size={15} />,
              MENU_CODE: 'KD9',
              cName: 'sub-nav',
            },
            {
              title: getlang('quanlykhachhang', lang ?? 'vi'),
              path: '/kinhdoanh/customermanager',
              icon: <FcCustomerSupport color='#cc00ff' size={15} />,
              MENU_CODE: 'KD10',
            },
            {
              title: getlang('eqstatus', lang ?? 'vi'),
              path: 'kinhdoanh/eqstatus',
              icon: <MdOutlineSignalWifiStatusbarNull color='#cc00ff' size={15} />,
              MENU_CODE: 'KD11',
              cName: 'sub-nav',
            },
            {
              title: getlang('ins_status', lang ?? 'vi'),
              path: 'kinhdoanh/ins_status',
              icon: <FcInspection color='#cc00ff' size={15} />,
              MENU_CODE: 'KD12',
              cName: 'sub-nav',
            },
            {
              title: getlang('overmonitor', lang ?? 'vi'),
              path: 'kinhdoanh/overmonitor',
              icon: <FaStackOverflow color='#db0c0c' size={15} />,
              MENU_CODE: 'KD15',
              cName: 'sub-nav',
            },
            {
              title: getlang('baocao', lang ?? 'vi'),
              path: '/kinhdoanh/kinhdoanhreport',
              icon: <FcBullish size={15} />,
              MENU_CODE: 'KD13',
            },
          ],
        },
        {
          title: getlang('phongmuahang', lang ?? 'vi') /*Phòng Kinh Doanh*/,
          path: '#',
          icon: <AiOutlineShoppingCart color='#B701CA' size={15} />,
          iconClosed: <KeyboardArrowDownIcon />,
          iconOpened: <KeyboardArrowUpIcon />,
          subNav: [
            {
              title: getlang('quanlykhachhang', lang ?? 'vi'),
              path: '/kinhdoanh/customermanager',
              icon: <FcCustomerSupport color='#cc00ff' size={15} />,
              MENU_CODE: 'KD10',
            },
            {
              title: getlang('quanlyvatlieu', lang ?? 'vi') /*Quản lý VL*/,
              path: '/phongmuahang/quanlyvatlieu',
              icon: <FaScroll color='#01C716' size={15} />,
              MENU_CODE: 'PU1',
            },
            {
              title: getlang('quanlymrp', lang ?? 'vi') /*Quản lý VL*/,
              path: '/phongmuahang/mrp',
              icon: <AiOutlineCalendar color='blue' size={15} />,
              MENU_CODE: 'PU2',
            },
          ],
        },
        {
          title: getlang('phongqc', lang ?? 'vi'),
          path: '#',
          icon: <AiFillCheckSquare color='#cc99ff' size={15} />,
          iconClosed: <KeyboardArrowDownIcon />,
          iconOpened: <KeyboardArrowUpIcon />,
          subNav: [
            {
              title: getlang('quanlyYCSX', lang ?? 'vi'),
              path: '/qc/ycsxmanager',
              icon: <FcSettings color='#cc99ff' size={15} />,
              MENU_CODE: 'QC1',
              cName: 'sub-nav',
            },
            {
              title: getlang('thongtinsanpham', lang ?? 'vi'),
              path: '/qc/codeinfo',
              icon: <FcAbout color='#cc00ff' size={15} />,
              MENU_CODE: 'QC2',
            },
            {
              title: 'IQC',
              path: '/qc/iqc',
              icon: <MdInput color='blue' size={15} />,
              MENU_CODE: 'QC3',
              cName: 'sub-nav',
            },
            {
              title: 'PQC',
              path: '/qc/pqc',
              icon: <FcProcess color='green' size={15} />,
              MENU_CODE: 'QC4',
              cName: 'sub-nav',
            },
            {
              title: 'OQC',
              path: '/qc/oqc',
              icon: <MdInput color='green' size={15} />,
              MENU_CODE: 'QC5',
            },
            {
              title: getlang('inspection', lang ?? 'vi'),
              path: '/qc/inspection',
              icon: <FcInspection color='blue' size={15} />,
              MENU_CODE: 'QC6',
            },
            {
              title: 'CS',
              path: '/qc/cs',
              icon: <FcServices color='blue' size={15} />,
              MENU_CODE: 'QC7',
            },
            {
              title: getlang('dtc', lang ?? 'vi'),
              path: '/qc/dtc',
              icon: <MdOutlineAspectRatio color='red' size={15} />,
              MENU_CODE: 'QC8',
            },
            {
              title: 'ISO',
              path: '/qc/iso',
              icon: <BiSortAZ color='#fa1e9e' size={15} />,
              MENU_CODE: 'QC9',
            },
            {
              title: getlang('baocaoqc', lang ?? 'vi'),
              path: '/qc/qcreport',
              icon: <MdBugReport color='blue' size={15} />,
              MENU_CODE: 'QC10',
            },
          ],
        },
        {
          title: getlang('phongrnd', lang ?? 'vi'),
          path: '#',
          icon: <MdDesignServices color='#3366ff' size={15} />,
          iconClosed: <KeyboardArrowDownIcon />,
          iconOpened: <KeyboardArrowUpIcon />,
          subNav: [
            {
              title: getlang('quanlycodebom', lang ?? 'vi'),
              path: '/rnd/quanlycodebom',
              icon: <FaBomb color='black' size={15} />,
              MENU_CODE: 'RD1',
              cName: 'sub-nav',
            },
            {
              title: getlang('thembomamazon', lang ?? 'vi'),
              path: '/rnd/thembomamazon',
              icon: <AiFillAmazonSquare color='green' size={15} />,
              MENU_CODE: 'RD2',
              cName: 'sub-nav',
            },
            {
              title: getlang('dtc', lang ?? 'vi'),
              path: '/rnd/dtc',
              icon: <MdOutlineAspectRatio color='red' size={15} />,
              MENU_CODE: 'RD3',
            },
            {
              title: getlang('quanlyYCSX', lang ?? 'vi'),
              path: 'rnd/ycsxmanager',
              icon: <FcSettings color='#cc99ff' size={15} />,
              MENU_CODE: 'RD4',
              cName: 'sub-nav',
            },
            {
              title: getlang('thietkedesignamazon', lang ?? 'vi'),
              path: '/rnd/designamazon',
              icon: <AiFillAmazonCircle color='blue' size={15} />,
              MENU_CODE: 'RD5',
            },
            {
              title: getlang('productbarcodemanager', lang ?? 'vi'),
              path: '/rnd/productbarcodemanager',
              icon: <FaBarcode color='#098705' size={15} />,
              MENU_CODE: 'RD6',
            },
            {
              title: getlang('samplemonitor', lang ?? 'vi'),
              path: '/rnd/samplemonitor',
              icon: <FaProductHunt color='#eef109' size={15} />,
              MENU_CODE: 'RD8',
            },
            {
              title: getlang('baocaornd', lang ?? 'vi'),
              path: '/rnd/baocaornd',
              icon: <FaReact color='#b50acc' size={15} />,
              MENU_CODE: getCompany() === 'CMS' ? 'RD7' : 'BL1',
            },
          ],
        },
        /* {
                title: getlang("phongqlsx",lang ?? "vi"),
                path: "#",
                icon: <MdOutlineProductionQuantityLimits color="#00cc00" size={15} />,
                iconClosed: <KeyboardArrowDownIcon />,
                iconOpened: <KeyboardArrowUpIcon />,
                subNav: [
                  {
                    title: getlang("quanlyYCSX",lang ?? "vi"),
                    path: "qlsx/ycsxmanager",
                    icon: <FcSettings color="#cc99ff" size={15} />,
                    MENU_CODE: "QL1",
                    cName: "sub-nav",
                  },
                  {
                    title: getlang("quanlycodebom",lang ?? "vi"),
                    path: "qlsx/quanlycodebom",
                    icon: <FaBomb color="black" size={15} />,
                    MENU_CODE: "QL2",
                    cName: "sub-nav",
                  },
                  {
                    title: getlang("thongtinsanpham",lang ?? "vi"),
                    path: "qlsx/codeinfo",
                    icon: <FcAbout color="#cc00ff" size={15} />,
                    MENU_CODE: "QL3",
                    cName: "sub-nav",
                  },        
                  {
                    title: getlang("quanlycapa",lang ?? "vi"),
                    path: "qlsx/capamanager",
                    icon: <FcCapacitor color="blue" size={15} />,
                    MENU_CODE: "QL5",
                  },
                  {
                    title: getlang("quanlymrp",lang ?? "vi"),
                    path: "qlsx/qlsxmrp",
                    icon: <AiOutlineCalendar color="blue" size={15} />,
                    MENU_CODE: "QL6",
                  },
                ],
              }, */
        {
          title: getlang('phongsanxuat', lang ?? 'vi'),
          path: '#',
          icon: <MdPrecisionManufacturing color='red' size={15} />,
          iconClosed: <KeyboardArrowDownIcon />,
          iconOpened: <KeyboardArrowUpIcon />,
          subNav: [
            {
              title: getlang('quanlyYCSX', lang ?? 'vi'),
              path: 'sx/ycsxmanager',
              icon: <FcSettings color='#cc99ff' size={15} />,
              MENU_CODE: 'SX1',
              cName: 'sub-nav',
            },
            {
              title: getlang('thongtinsanpham', lang ?? 'vi'),
              path: 'sx/codeinfo',
              icon: <FcAbout color='#cc00ff' size={15} />,
              MENU_CODE: 'SX2',
              cName: 'sub-nav',
            },
            {
              title: getlang('khsx', lang ?? 'vi'),
              path: 'qlsx/qlsxplan',
              icon: <FaPaperPlane color='#ff33cc' size={15} />,
              MENU_CODE: 'QL4',
            },
            {
              title: getlang('tienhanhsx', lang ?? 'vi'),
              path: 'sx/planstatus',
              icon: <SiStatuspal color='#02a112' size={15} />,
              MENU_CODE: 'SX5',
              cName: 'sub-nav',
            },
            {
              title: getlang('datasanxuat', lang ?? 'vi'),
              path: 'sx/datasx',
              icon: <FcAcceptDatabase color='#cc00ff' size={15} />,
              MENU_CODE: 'SX3',
              cName: 'sub-nav',
            },
            {
              title: getlang('inspection', lang ?? 'vi'),
              path: 'sx/inspection',
              icon: <FcInspection color='blue' size={15} />,
              MENU_CODE: 'SX4',
            },
            {
              title: 'TV Show',
              path: 'sx/eqstatus',
              icon: <MdTv color='#119edf' size={15} />,
              MENU_CODE: 'SX6',
              cName: 'sub-nav',
            },
            {
              title: getlang('eq_manager', lang ?? 'vi'),
              path: 'sx/eqstatus',
              icon: <MdOutlineSignalWifiStatusbarNull color='#cc00ff' size={15} />,
              MENU_CODE: 'SX16',
              cName: 'sub-nav',
            },
            {
              title: getlang('khosx', lang ?? 'vi'),
              path: 'sx/khosx',
              icon: <FaWarehouse color='#4144f7' size={15} />,
              MENU_CODE: 'SX17',
              cName: 'sub-nav',
            },
            /* {
                    title: getlang("khothat",lang ?? "vi"),
                    path: "sx/khothat",
                    icon: <FaWarehouse color="#2BFC27" size={15} />,
                    MENU_CODE: "SX7",
                    cName: "sub-nav",
                  },
                  {
                    title: getlang("khoao",lang ?? "vi"),
                    path: "sx/khoao",
                    icon: <FaWarehouse color="#fc00ff" size={15} />,
                    MENU_CODE: "SX8",
                    cName: "sub-nav",
                  },
                  {
                    title: getlang("khosub",lang ?? "vi"),
                    path: "sx/khosub",
                    icon: <FaWarehouse color="#04517e" size={15} />,
                    MENU_CODE: "SX15",
                    cName: "sub-nav",
                  }, */
            /*  {
                    title: getlang("quanlycapa",lang ?? "vi"),
                    path: "sx/capamanager",
                    icon: <FcCapacitor color="blue" size={15} />,
                    MENU_CODE: "SX11",
                  },
                  {
                    title: getlang("hieusuatsx",lang ?? "vi"),
                    path: "sx/planresult",
                    icon: <BiTrendingUp color="green" size={15} />,
                    MENU_CODE: "SX12",
                  }, */
            {
              title: getlang('baocaosx', lang ?? 'vi'),
              path: 'sx/baocaosx',
              icon: <FcBullish color='#ec3ede' size={15} />,
              MENU_CODE: 'SX13',
            },
            /* {
                    title: getlang("tinhluongP3",lang ?? "vi"),
                    path: "sx/tinhluongP3",
                    icon: <BiMoney color="green" size={15} />,
                    MENU_CODE: "SX18",
                  }, */
          ],
        },
        {
          title: getlang('bophankho', lang ?? 'vi'),
          path: '#',
          icon: <FaWarehouse color='#7459FA' size={15} />,
          iconClosed: <KeyboardArrowDownIcon />,
          iconOpened: <KeyboardArrowUpIcon />,
          subNav: [
            {
              title: getlang('nhapxuattonlieu', lang ?? 'vi'),
              path: 'bophankho/nhapxuattonlieu',
              icon: <FaLongArrowAltRight color='#12CAB9' size={15} />,
              MENU_CODE: 'KO2',
              cName: 'sub-nav',
            },
            {
              title: getlang('nhapxuattontp', lang ?? 'vi'),
              path: 'bophankho/nhapxuattontp',
              icon: <FaLongArrowAltRight color='#74CE00' size={15} />,
              MENU_CODE: 'KO1',
              cName: 'sub-nav',
            },
          ],
        },
        {
          title: getlang('information_board', lang ?? 'vi'),
          path: '#',
          icon: <FaChalkboardTeacher color='#21bae9' size={15} />,
          iconClosed: <KeyboardArrowDownIcon />,
          iconOpened: <KeyboardArrowUpIcon />,
          subNav: [
            {
              title: getlang('information_board', lang ?? 'vi'),
              path: 'information_board/news',
              icon: <FaChalkboardTeacher color='#0dc453' size={15} />,
              MENU_CODE: 'IF1',
              cName: 'sub-nav',
            },
            {
              title: getlang('information_register', lang ?? 'vi'),
              path: 'information_board/register',
              icon: <BiUpload color='#0c1eb8' size={15} />,
              MENU_CODE: 'IF2',
              cName: 'sub-nav',
            },
            {
              title: getlang('post_manager', lang ?? 'vi'),
              path: 'information_board/postmanager',
              icon: <FcAdvertising color='#0c1eb8' size={15} />,
              MENU_CODE: 'IF3',
              cName: 'sub-nav',
            },
          ],
        },
        {
          title: getlang('tool', lang ?? 'vi'),
          path: '#',
          icon: <FaTools color='#14c51d' size={15} />,
          iconClosed: <KeyboardArrowDownIcon />,
          iconOpened: <KeyboardArrowUpIcon />,
          subNav: [
            {
              title: getlang('filetransfer', lang ?? 'vi'),
              path: 'tool/filetransfer',
              icon: <FaFileImport color='#0c1eb8' size={15} />,
              MENU_CODE: 'TL1',
              cName: 'sub-nav',
            },
            {
              title: getlang('nocodelowcode', lang ?? 'vi'),
              path: 'tool/nocodelowcode',
              icon: <FaReact color='#0c1eb8' size={15} />,
              MENU_CODE: 'TL2',
              cName: 'sub-nav',
            },
          ],
        },
      ];
};
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SubMenu from "./Submenu";
import { FcAbout, FcAcceptDatabase, FcApprove, FcCapacitor, FcCustomerSupport, FcInspection, FcList, FcProcess, FcServices } from 'react-icons/fc';
import "./Sidebar.scss";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import HomeIcon from '@mui/icons-material/Home';
import { FaDonate, FaFileInvoiceDollar,FaCheckCircle, FaHistory, FaBomb, FaPaperPlane, FaWarehouse, FaScroll } from 'react-icons/fa';
import { BiCart, BiSortAZ } from 'react-icons/bi';
import { FcPlanner, FcSettings,FcBullish, FcPortraitMode,FcManager,FcCheckmark,FcPieChart,FcRefresh } from 'react-icons/fc';
import { MdBugReport, MdDesignServices, MdInput, MdOutlineAppRegistration, MdOutlineAspectRatio, MdOutlineProductionQuantityLimits, MdOutlineSignalWifiStatusbarNull, MdPrecisionManufacturing, MdPriceChange } from "react-icons/md";
import { WiDayLightning } from "react-icons/wi";
import { SiStatuspal } from "react-icons/si";
import getsentence from "../../components/String/String";
import { LangConText } from "../../api/Context";
import { AiFillAmazonCircle, AiFillAmazonSquare, AiFillMinusCircle, AiOutlineCalendar } from "react-icons/ai";
import RuleRoundedIcon from '@mui/icons-material/RuleRounded';
import {RootState} from '../../redux/store'
import {useSelector, useDispatch} from 'react-redux'
import { changeDiemDanhState, changeUserData, UserData, toggleSidebar, hideSidebar } from "../../redux/slices/globalSlice";
import { getlang } from '../../components/String/String';
import { GrStatusUnknown } from "react-icons/gr";
import { FcDataProtection } from "react-icons/fc";
import useOutsideClick from "../../api/customHooks";

interface SEARCH_LIST_DATA {
  MENU_CODE: string;
  MENU_NAME: string;
}

const Sidebar = () => {
  const boxRef = useRef<HTMLDivElement>(null);  
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);
  const [lang,setLang] = useContext(LangConText);
  const globalUserData: UserData|undefined = useSelector((state:RootState)=>state.totalSlice.userData);
  const dispatch = useDispatch();
  useOutsideClick(boxRef,()=> {
    //console.log('outsideclick');  
    //dispatch(hideSidebar(1));

  }, ()=> {
    //console.log('insideclick');
  });
  

  const SidebarData = [
    {
      title: getlang('nhansu',lang), /*Nhân sự*/
      path: '#',
      icon: <FcManager color='green' size={25}/>,
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,
      subNav: [
        {
          title: getlang('quanlyphongban',lang),
          path: '/nhansu/quanlyphongbannhanvien',
          icon: <FcPortraitMode color='blue' size={25}/>,
          MENU_CODE: 'NS1',          
        },
        {
          title:  getlang('diemdanhnhom',lang),
          path: '/nhansu/diemdanhnhom',
          icon: <FcCheckmark color='red' size={25}/>,
          MENU_CODE: 'NS2',
        },
        {
          title:  getlang('dieuchuyenteam',lang),
          path: '/nhansu/dieuchuyenteam',
          icon: <FcRefresh color='red' size={25}/>,
          MENU_CODE: 'NS3',        },
        {
          title: getlang('dangky',lang),
          path: '/nhansu/dangky',
          icon: <MdOutlineAppRegistration size={25}/>,
          MENU_CODE: 'NS4',        },
        {
          title:  getlang('pheduyet',lang),
          path: '/nhansu/pheduyetnghi',
          icon: <FcApprove size={25}/>,
          MENU_CODE: 'NS5',        },
        {
          title:  getlang('lichsudilam',lang),
          path: '/nhansu/lichsu',
          icon: <FaHistory color="green" size={25}/>,
          MENU_CODE: 'NS6',        },
        {
          title: getlang('quanlycapcao',lang),
          path: '/nhansu/quanlycapcao',
          icon: <FcManager color='#cc99ff' size={25}/>,
          MENU_CODE: 'NS7',
        },
        {
          title: getlang('baocaonhansu',lang),
          path: '/nhansu/baocaonhansu',
          icon: <FcPieChart color='#cc99ff' size={25}/>,
          MENU_CODE: 'NS8',        },       
      ]
    },
    {
      title: getlang('phongkinhdoanh',lang), /*Phòng Kinh Doanh*/
      path: '#',
      icon: <FaDonate color='green' size={25}/>,
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,  
      subNav: [
        {
          title: getlang('quanlypo',lang), /*Quản lý PO*/
          path: '/kinhdoanh/pomanager',
          icon: <BiCart color='blue' size={25}/>,
          MENU_CODE: 'KD1',        },
        {
          title: getlang('quanlyinvoices',lang), /*Quản lý Invoice*/
          path: '/kinhdoanh/invoicemanager',
          icon: <FaFileInvoiceDollar color='red' size={25}/>,
          MENU_CODE: 'KD2',        },
        {
          title: getlang('quanlyplan',lang), /*Quản Lý Plan*/
          path: '/kinhdoanh/planmanager',
          icon: <FcPlanner size={25}/>,
          MENU_CODE: 'KD3',        },
        {
          title: getlang('shortage',lang), /*Quản Lý Plan*/
          path: '/kinhdoanh/shortage',
          icon: <AiFillMinusCircle size={25} color='red'/>,
          MENU_CODE: 'KD4',        },
        {
          title: getlang('quanlyFCST',lang), /*Quản lý FCST*/
          path: '/kinhdoanh/fcstmanager',
          icon: <WiDayLightning color='#cc99ff' size={25}/>,
          MENU_CODE: 'KD5',        },
        {
          title: getlang('quanlyYCSX',lang), /*Quản lý YCSX*/
          path: '/kinhdoanh/ycsxmanager',
          icon: <FcSettings color='#cc99ff' size={25}/>,
          MENU_CODE: 'KD6',        },        
        {
          title: getlang('quanlyPOFull',lang), /*PO tích hợp tồn kho*/
          path: '/kinhdoanh/poandstockfull',
          icon: <FaCheckCircle color='#ff9900' size={25}/>,
          MENU_CODE: 'KD7',        },    
        {
          title: getlang('thongtinsanpham',lang),
          path: '/kinhdoanh/codeinfo',
          icon: <FcAbout color='#cc00ff' size={25}/>,
          MENU_CODE: 'KD8',        },  
        {
          title: getlang('quanlycodebom',lang),
          path: '/kinhdoanh/quanlycodebom',
          icon: <FaBomb color='black' size={25}/>,
          MENU_CODE: 'KD9',
          cName: 'sub-nav'
        },      
        {
          title: getlang('quanlykhachhang',lang),
          path: '/kinhdoanh/customermanager',
          icon: <FcCustomerSupport color='#cc00ff' size={25}/>,
          MENU_CODE: 'KD10',        },  
        {
          title: getlang('eqstatus',lang),
          path: 'kinhdoanh/eqstatus',
          icon: <MdOutlineSignalWifiStatusbarNull color='#cc00ff' size={25}/>,
          MENU_CODE: 'KD11',
          cName: 'sub-nav'
        },           
        {
          title: getlang('ins_status',lang),
          path: 'kinhdoanh/ins_status',
          icon: <FcInspection color='#cc00ff' size={25}/>,
          MENU_CODE: 'KD12',
          cName: 'sub-nav'
        },           
        {
          title: getlang('baocao',lang),
          path: '/kinhdoanh/kinhdoanhreport',
          icon: <FcBullish  size={25}/>,
          MENU_CODE: 'KD13',        }
      ]
    },
    {
      title: getlang('phongqc',lang),
      path: '#',
      icon: <RuleRoundedIcon color="error"/>,
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,  
      subNav: [
        {
          title: getlang('quanlyYCSX',lang),
          path: '/qc/ycsxmanager',
          icon: <FcSettings color='#cc99ff' size={25}/>,
          MENU_CODE: 'QC1',
          cName: 'sub-nav'
        }, 
        {
          title:  getlang('thongtinsanpham',lang),
          path: '/qc/codeinfo',
          icon: <FcAbout color='#cc00ff' size={25}/>,
          MENU_CODE: 'QC2'
        },  
        {
          title: 'IQC',
          path: '/qc/iqc',
          icon: <MdInput color='blue' size={25}/>,
          MENU_CODE: 'QC3',
          cName: 'sub-nav'
        },
        {
          title: 'PQC',
          path: '/qc/pqc',
          icon: <FcProcess color='green' size={25}/>,
          MENU_CODE: 'QC4',
          cName: 'sub-nav'
        },
        {
          title: 'OQC',
          path: '/qc/oqc',
          icon: <MdInput color='green' size={25}/>,
          MENU_CODE: 'QC5'
        },
        {
          title:  getlang('inspection',lang),
          path: '/qc/inspection',
          icon: <FcInspection color='blue' size={25}/>,
          MENU_CODE: 'QC6'
        },
        {
          title: 'CS',
          path: '/qc/cs',
          icon: <FcServices color='blue' size={25}/> ,
          MENU_CODE: 'QC7'       
        },
        {
          title: getlang('dtc',lang),
          path: '/qc/dtc',
          icon: <MdOutlineAspectRatio color='red' size={25}/>,
          MENU_CODE: 'QC8'        
        },        
        {
          title: 'ISO',
          path: '/qc/iso',
          icon: <BiSortAZ color='#fa1e9e' size={25}/>,
          MENU_CODE: 'QC9'        
        },       
        {
          title: getlang('baocaoqc',lang),
          path: '/qc/qcreport',
          icon: <MdBugReport color='blue' size={25}/>,
          MENU_CODE: 'QC10'
        }
      ]
    }, 
    {
      title: getlang('phongrnd',lang),
      path: '#',
      icon: <MdDesignServices color='#3366ff' size={25}/>,
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,  
      subNav: [
        {
          title: getlang('quanlycodebom',lang),
          path: '/rnd/quanlycodebom',
          icon: <FaBomb color='black' size={25}/>,
          MENU_CODE: 'RD1',
          cName: 'sub-nav'
        },
        {
          title: getlang('thembomamazon',lang),
          path: '/rnd/thembomamazon',
          icon: <AiFillAmazonSquare color='green' size={25}/>,
          MENU_CODE: 'RD2',
          cName: 'sub-nav'
        },
        {
          title: getlang('dtc',lang),
          path: '/rnd/dtc',
          icon: <MdOutlineAspectRatio color='red' size={25}/>,
          MENU_CODE: 'RD3'        
        }, 
        {
          title: getlang('quanlyYCSX',lang),
          path: 'rnd/ycsxmanager',
          icon: <FcSettings color='#cc99ff' size={25}/>,
          MENU_CODE: 'RD4',
          cName: 'sub-nav'
        },
        {
          title: getlang('thietkedesignamazon',lang),
          path: '/rnd/designamazon',
          icon: <AiFillAmazonCircle color='blue' size={25}/>,
          MENU_CODE: 'RD5'
        }
      ]
    },  
    {
      title: getlang('phongqlsx',lang),
      path: '#',
      icon: <MdOutlineProductionQuantityLimits color='#00cc00' size={25}/>,
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,  
      subNav: [
        {
          title: getlang('quanlyYCSX',lang),
          path: 'qlsx/ycsxmanager',
          icon: <FcSettings color='#cc99ff' size={25}/>,
          MENU_CODE: 'QL1',
          cName: 'sub-nav'
        },
        {
          title: getlang('quanlycodebom',lang),
          path: 'qlsx/quanlycodebom',
          icon: <FaBomb color='black' size={25}/>,
          MENU_CODE: 'QL2',
          cName: 'sub-nav'
        },
        {
          title: getlang('thongtinsanpham',lang),
          path: 'qlsx/codeinfo',
          icon: <FcAbout color='#cc00ff' size={25}/>,
          MENU_CODE: 'QL3',
          cName: 'sub-nav'
        },
        {
          title: getlang('quanlyplansx',lang),
          path: 'qlsx/qlsxplan',
          icon: <FaPaperPlane color='#ff33cc' size={25}/>,
          MENU_CODE: 'QL4'
        }        ,
        {
          title: getlang('quanlycapa',lang),
          path: 'qlsx/capamanager',
          icon: <FcCapacitor color='blue' size={25}/>,
          MENU_CODE: 'QL5'
        }
               ,
        {
          title: getlang('quanlymrp',lang),
          path: 'qlsx/qlsxmrp',
          icon: <AiOutlineCalendar color='blue' size={25}/>,
          MENU_CODE: 'QL6'
        }
      ]
    },   
    {
      title: getlang('phongsanxuat',lang),
      path: '#',
      icon: <MdPrecisionManufacturing color='red' size={25}/>,
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,  
      subNav: [
        {
          title: getlang('quanlyYCSX',lang),
          path: 'sx/ycsxmanager',
          icon: <FcSettings color='#cc99ff' size={25}/>,
          MENU_CODE: 'SX1',
          cName: 'sub-nav'
        },        
        {
          title: getlang('thongtinsanpham',lang),
          path: 'sx/codeinfo',
          icon: <FcAbout color='#cc00ff' size={25}/>,
          MENU_CODE: 'SX2',
          cName: 'sub-nav'
        },        
        {
          title: getlang('datasanxuat',lang),
          path: 'sx/datasx',
          icon: <FcAcceptDatabase color='#cc00ff' size={25}/>,
          MENU_CODE: 'SX3',
          cName: 'sub-nav'
        },      
        {
          title:  getlang('inspection',lang),
          path: 'sx/inspection',
          icon: <FcInspection color='blue' size={25}/>,
          MENU_CODE: 'SX4'
        },  
        {
          title: getlang('planstatus',lang),
          path: 'sx/planstatus',
          icon: <SiStatuspal color='#02a112' size={25}/>,
          MENU_CODE: 'SX5',
          cName: 'sub-nav'
        },        
        {
          title: getlang('eqstatus',lang),
          path: 'sx/eqstatus',
          icon: <MdOutlineSignalWifiStatusbarNull color='#cc00ff' size={25}/>,
          MENU_CODE: 'SX6',
          cName: 'sub-nav'
        },     
        {
          title: getlang('khothat',lang),
          path: 'sx/khothat',
          icon: <FaWarehouse color='#2BFC27' size={25}/>,
          MENU_CODE: 'SX7',
          cName: 'sub-nav'
        },       
        {
          title: getlang('khoao',lang),
          path: 'sx/khoao',
          icon: <FaWarehouse color='#fc00ff' size={25}/>,
          MENU_CODE: 'SX8',
          cName: 'sub-nav'
        },       
        {
          title: getlang('lichsuxuatlieuthat',lang),
          path: 'sx/lichsuxuatlieu',
          icon: <FcDataProtection color='#cc00ff' size={25}/>,
          MENU_CODE: 'SX9',
          cName: 'sub-nav'
        },        
        {
          title: getlang('materiallotstatus',lang),
          path: 'sx/materiallotstatus',
          icon: <FaScroll color='black' size={25}/>,
          MENU_CODE: 'SX10',
          cName: 'sub-nav'
        },        
           
      ]
    },   
    
  ];

  const sidebarStatus: boolean | undefined = useSelector(
    (state: RootState) => state.totalSlice.sidebarmenu
  );

  useEffect(()=> {    

  },[])
  return (
    <div ref={boxRef} > 
      <nav
        className={`SidebarNav ${
          sidebarStatus === true ? "show-sidebar" : "hide-sidebar"
        }`}
      >
        <div className='SidebarWrap'>
          <Link to='#' className='NavIcon'>
            <img alt="logo" src="/logocmsvina.png" width={85.8} height={20.35}/>            
          </Link>
          {SidebarData.map((item, index) => {
            return <SubMenu item={item} key={index} />;
          })}
        </div>
      </nav>
    </div>
  );
};
export default Sidebar;

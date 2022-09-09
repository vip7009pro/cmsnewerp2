import React, { useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SubMenu from "./Submenu";
import { FcAbout, FcApprove, FcCustomerSupport, FcList } from 'react-icons/fc';
import "./Sidebar.scss";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import HomeIcon from '@mui/icons-material/Home';
import { FaDonate, FaFileInvoiceDollar,FaCheckCircle, FaHistory, FaBomb } from 'react-icons/fa';
import { BiCart } from 'react-icons/bi';
import { FcPlanner, FcSettings,FcBullish, FcPortraitMode,FcManager,FcCheckmark,FcPieChart,FcRefresh } from 'react-icons/fc';
import { MdDesignServices, MdOutlineAppRegistration, MdPriceChange } from "react-icons/md";
import { WiDayLightning } from "react-icons/wi";
import getsentence from "../../components/String/String";
import { LangConText } from "../../api/Context";
import { AiFillAmazonCircle, AiFillAmazonSquare } from "react-icons/ai";

const Sidebar = () => {
  const [sidebar, setSidebar] = useState(true);
  const showSidebar = () => setSidebar(!sidebar);
  const [lang,setLang] = useContext(LangConText);

  const SidebarData = [
    {
      title: getsentence(12,lang), /*Nhân sự*/
      path: 'nhansu',
      icon: <FcManager color='green' size={25}/>,
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,  
      subNav: [
        {
          title: getsentence(13,lang), /*Quản lý phòng ban- nhân viên*/
          path: '/nhansu/quanlyphongbannhanvien',
          icon: <FcPortraitMode color='blue' size={25}/>
        },
        {
          title: getsentence(14,lang), /*Điểm danh nhóm*/
          path: '/nhansu/diemdanhnhom',
          icon: <FcCheckmark color='red' size={25}/>
        },
        {
          title: 'Điều chuyển team', /*  getsentence(14,lang), */ 
          path: '/nhansu/dieuchuyenteam',
          icon: <FcRefresh color='red' size={25}/>
        },
        {
          title: getsentence(15,lang), /*Đăng ký*/
          path: '/nhansu/dangky',
          icon: <MdOutlineAppRegistration size={25}/>
        },
        {
          title:  'Phê duyệt nghỉ',
          path: '/nhansu/pheduyetnghi',
          icon: <FcApprove size={25}/>
        },
        {
          title:  'Lịch Sử',
          path: '/nhansu/lichsu',
          icon: <FaHistory color="green" size={25}/>
        },
        {
          title: getsentence(16,lang), /*Báo cáo nhân sự*/
          path: '/nhansu/baocaonhansu',
          icon: <FcPieChart color='#cc99ff' size={25}/>
        }
      ]
    },
    {
      title: getsentence(4,lang), /*Phòng Kinh Doanh*/
      path: 'kinhdoanh',
      icon: <FaDonate color='green' size={25}/>,
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,  
      subNav: [
        {
          title: getsentence(5,lang), /*Quản lý PO*/
          path: '/kinhdoanh/pomanager',
          icon: <BiCart color='blue' size={25}/>
        },
        {
          title: getsentence(6,lang), /*Quản lý Invoice*/
          path: '/kinhdoanh/invoicemanager',
          icon: <FaFileInvoiceDollar color='red' size={25}/>
        },
        {
          title: getsentence(7,lang), /*Quản Lý Plan*/
          path: '/kinhdoanh/planmanager',
          icon: <FcPlanner size={25}/>
        },
        {
          title: getsentence(8,lang), /*Quản lý FCST*/
          path: '/kinhdoanh/fcstmanager',
          icon: <WiDayLightning color='#cc99ff' size={25}/>
        },
        {
          title: getsentence(9,lang), /*Quản lý YCSX*/
          path: '/kinhdoanh/ycsxmanager',
          icon: <FcSettings color='#cc99ff' size={25}/>
        },        
        {
          title: getsentence(10,lang), /*PO tích hợp tồn kho*/
          path: '/kinhdoanh/poandstockfull',
          icon: <FaCheckCircle color='#ff9900' size={25}/>
        },    
        {
          title: 'Thông tin sản phẩm', /*Quản lý giá*/
          path: '/kinhdoanh/codeinfo',
          icon: <FcAbout color='#cc00ff' size={25}/>
        },        
        {
          title: 'Quản lý khách hàng', /*Quản lý giá*/
          path: '/kinhdoanh/customermanager',
          icon: <FcCustomerSupport color='#cc00ff' size={25}/>
        },        
        {
          title: getsentence(11,lang),/*Báo cáo*/
          path: '/kinhdoanh/kinhdoanhreport',
          icon: <FcBullish  size={25}/>
        }
      ]
    },
    {
      title: 'Phòng RnD',
      path: '/',
      icon: <MdDesignServices color='#3366ff' size={25}/>,
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,  
      subNav: [
        {
          title: 'Quản lý Code- Bom',
          path: '/rnd/quanlycodebom',
          icon: <FaBomb color='black' size={25}/>,
          cName: 'sub-nav'
        },
        {
          title: 'Thêm BOM AMAZON',
          path: '/rnd/thembomamazon',
          icon: <AiFillAmazonSquare color='green' size={25}/>,
          cName: 'sub-nav'
        },
        {
          title: 'Thiết kế DESIGN AMAZON',
          path: '/rnd/designamazon',
          icon: <AiFillAmazonCircle color='blue' size={25}/>
        }
      ]
    },    
  ];

  return (
    <>
      <div className='Nav'>
        {!sidebar && <Link to='#' className='NavIcon'>
          <FcList onClick={showSidebar} />         
        </Link>}
      </div>
      <nav
        className={`SidebarNav ${
          sidebar === true ? "show-sidebar" : "hide-sidebar"
        }`}
      >
        <div className='SidebarWrap'>
          <Link to='#' className='NavIcon'>
            <img alt="logo" src="logocmsvina.png" width={85.8} height={20.35}/>
            <FcList onClick={showSidebar} />
          </Link>
          {SidebarData.map((item, index) => {
            return <SubMenu item={item} key={index} />;
          })}
        </div>
      </nav>
    </>
  );
};
export default Sidebar;

import React, { useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SubMenu from "./Submenu";
import { FcList } from 'react-icons/fc';
import "./Sidebar.scss";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import HomeIcon from '@mui/icons-material/Home';
import { FaDonate, FaFileInvoiceDollar,FaCheckCircle } from 'react-icons/fa';
import { BiCart } from 'react-icons/bi';
import { FcPlanner, FcSettings,FcBullish, FcPortraitMode,FcManager,FcCheckmark,FcPieChart } from 'react-icons/fc';
import { MdOutlineAppRegistration } from "react-icons/md";
import { WiDayLightning } from "react-icons/wi";
import getsentence from "../../components/String/String";
import { LangConText } from "../../api/Context";


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
          title: getsentence(15,lang), /*Đăng ký*/
          path: '/nhansu/dangky',
          icon: <MdOutlineAppRegistration size={25}/>
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
          title: getsentence(11,lang),/*Báo cáo*/
          path: '/kinhdoanh/kinhdoanhreport',
          icon: <FcBullish  size={25}/>
        }
      ]
    },
    {
      title: 'Phòng QLSX',
      path: '/',
      icon: <HomeIcon />,
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,  
      subNav: [
        {
          title: 'Reports',
          path: '/reports/reports1',
          icon: <HomeIcon />,
          cName: 'sub-nav'
        },
        {
          title: 'Reports 2',
          path: '/reports/reports2',
          icon: <HomeIcon />,
          cName: 'sub-nav'
        },
        {
          title: 'Reports 3',
          path: '/reports/reports3',
          icon: <HomeIcon />
        }
      ]
    },
    {
      title: 'Products',
      path: '/products',
      icon: <HomeIcon />
    },
    {
      title: 'Team',
      path: '/team',
      icon: <HomeIcon />
    },
    {
      title: 'Messages',
      path: '/messages',
      icon: <HomeIcon />,  
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,
  
      subNav: [
        {
          title: 'Message 1',
          path: '/messages/message1',
          icon: <HomeIcon />
        },
        {
          title: 'Message 2',
          path: '/messages/message2',
          icon: <HomeIcon />
        }
      ]
    },
    {
      title: 'Support',
      path: '/support',
      icon: <HomeIcon />
    }
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
            <span className="cmslogo">CMS VINA</span>
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

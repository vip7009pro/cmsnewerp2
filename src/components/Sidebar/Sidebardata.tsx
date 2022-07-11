import React from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import HomeIcon from '@mui/icons-material/Home';
import { FaDonate, FaFileInvoiceDollar,FaCheckCircle } from 'react-icons/fa';
import { BiCart } from 'react-icons/bi';
import { FcPlanner, FcSettings,FcBullish } from 'react-icons/fc';
import { WiDayLightning } from "react-icons/wi";

export const SidebarData = [
    {
      title: 'Phòng Kinh Doanh',
      path: 'kinhdoanh',
      icon: <FaDonate color='green' size={25}/>,
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,  
      subNav: [
        {
          title: 'Quản Lý PO',
          path: '/kinhdoanh/pomanager',
          icon: <BiCart color='blue' size={25}/>
        },
        {
          title: 'Quản lý invoice',
          path: '/kinhdoanh/invoicemanager',
          icon: <FaFileInvoiceDollar color='red' size={25}/>
        },
        {
          title: 'Quản lý Plan',
          path: '/kinhdoanh/planmanager',
          icon: <FcPlanner size={25}/>
        },
        {
          title: 'Quản lý FCST',
          path: '/kinhdoanh/fcstmanager',
          icon: <WiDayLightning color='#cc99ff' size={25}/>
        },
        {
          title: 'Quản lý YCSX',
          path: '/kinhdoanh/ycsxmanager',
          icon: <FcSettings color='#cc99ff' size={25}/>
        },        
        {
          title: 'PO Tích hợp tồn kho',
          path: '/kinhdoanh/poandstockfull',
          icon: <FaCheckCircle color='#ff9900' size={25}/>
        },        
        {
          title: 'Báo cáo',
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
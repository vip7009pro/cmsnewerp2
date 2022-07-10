import React from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import HomeIcon from '@mui/icons-material/Home';
/* import String from "../../components/String/String"; */

export const SidebarData = [
    {
      title: 'Home',
      path: '/',
      icon: <HomeIcon />,
      iconClosed: <KeyboardArrowDownIcon />,
      iconOpened: <KeyboardArrowUpIcon />,
  
      subNav: [
        {
          title: 'Dashboard',
          path: '/',
          icon: <HomeIcon />
        },
        {
          title: 'Revenue',
          path: '/overview/revenue',
          icon: <HomeIcon />
        }
      ]
    },
    {
      title: 'Reports',
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
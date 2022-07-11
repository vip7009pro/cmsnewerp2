import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SidebarData } from "./Sidebardata";
import SubMenu from "./Submenu";
import MenuIcon from "@mui/icons-material/Menu";
import { FcList } from 'react-icons/fc';
import "./Sidebar.scss";

const Sidebar = () => {
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);
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
            <span className="cmslogo">CMSVINA</span>
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

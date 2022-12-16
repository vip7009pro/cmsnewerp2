import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Submenu.scss";
import { RootState } from "../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import {
  changeDiemDanhState,
  changeUserData,
  UserData,
} from "../../redux/slices/globalSlice";

const SubMenu = ({ item }: { item: any }) => {
  const [subnav, setSubnav] = useState(false);
  const showSubnav = () => setSubnav(!subnav);
  const globalUserData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );
  return (
    <>
      <Link
        className='SidebarLink'
        to={item.path}
        onClick={item.subNav && showSubnav}
      >
        <div>
          {item.icon}
          <span className='SidebarLabel'>{item.title}</span>
        </div>
        <div>
          {item.subNav && subnav
            ? item.iconOpened
            : item.subNav
            ? item.iconClosed
            : null}
        </div>
      </Link>
      {subnav &&
        item.subNav.map((item: any, index: any) => {
          return (
            <Link className='DropdownLink' to={item.path} key={index}>
              {item.icon}
              <span className='SidebarLabel'>{item.title}</span>
            </Link>
          );
        })}
    </>
  );
};

export default SubMenu;

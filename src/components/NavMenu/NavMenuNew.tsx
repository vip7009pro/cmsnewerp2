import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./NavMenu.scss";
import { RootState } from "../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { UserData } from "../../api/GlobalInterface";
import { generalQuery } from "../../api/Api";
import { addTab, settabIndex } from "../../redux/slices/globalSlice";
import Swal from "sweetalert2";
import { ELE_ARRAY } from "../../api/GlobalInterface";
import * as FaIcons from "react-icons/fa";
import * as BiIcons from "react-icons/bi";
import * as MdIcons from "react-icons/md";
import * as AiIcons from "react-icons/ai";
import * as FcIcons from "react-icons/fc";
import * as HiIcons from "react-icons/hi";
import * as IoIcons from "react-icons/io";
interface MENUDATA {
  MenuID: number;
  MenuName: string;
  Text: string;
  CreateAt: string;
  UpdatedAt: string;
  Link: string;
  MenuIcon: string;
  IconColor: string;
  SubMenuID: number;
  SubMenuName: string;
  SubText: string;
  SubCreateAt: string;
  SubUpdatedAt: string;
  SubLink: string;
  MenuCode: string;
  SubMenuIcon: string;
  SubIconColor: string;
}
const NavMenuNew = () => {
  const [icons, setIcons] = useState<
    { name: string; library: string; IconComponent: any }[]
  >([]);
  const [menuData, setMenuData] = useState<MENUDATA[]>([]);
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );
  const company: string = useSelector(
    (state: RootState) => state.totalSlice.company
  );
  const tabModeSwap: boolean = useSelector(
    (state: RootState) => state.totalSlice.tabModeSwap
  );
  const tabs: ELE_ARRAY[] = useSelector(
    (state: RootState) => state.totalSlice.tabs
  );
  const dispatch = useDispatch();
  //get unique MenuID, MenuName, Text
  const uniqueMenuData = menuData.reduce((acc: MENUDATA[], item: MENUDATA) => {
    if (!acc.some((el: MENUDATA) => el.MenuID === item.MenuID)) {
      acc.push(item);
    }
    return acc;
  }, []);
  const handleLoadMenuData = async () => {
    try {
      // API này cần chỉnh lại theo backend thực tế
      const res = await generalQuery("loadMenuData", {});
      if (res?.data?.tk_status !== "NG") {
        if (res.data.data.length > 0) {
          let loaded_data: MENUDATA[] = res.data.data.map(
            (element: MENUDATA, index: number) => {
              return {
                ...element,
                id: index,
              };
            }
          );
          setMenuData(loaded_data);
        }
      }
    } catch (e) {
      setMenuData([]);
    }
  };
  useEffect(() => {
    // Lấy danh sách icon từ các bộ
    const faIconList = Object.keys(FaIcons).map((name) => ({
      name,
      library: "fa",
      IconComponent: FaIcons[name as keyof typeof FaIcons],
    }));
    const mdIconList = Object.keys(MdIcons).map((name) => ({
      name,
      library: "md",
      IconComponent: MdIcons[name as keyof typeof MdIcons],
    }));
    const biIconList = Object.keys(BiIcons).map((name) => ({
      name,
      library: "bi",
      IconComponent: BiIcons[name as keyof typeof BiIcons],
    }));
    const aiIconList = Object.keys(AiIcons).map((name) => ({
      name,
      library: "ai",
      IconComponent: AiIcons[name as keyof typeof AiIcons],
    }));
    const fcIconList = Object.keys(FcIcons).map((name) => ({
      name,
      library: "fc",
      IconComponent: FcIcons[name as keyof typeof FcIcons],
    }));
    const hiIconList = Object.keys(HiIcons).map((name) => ({
      name,
      library: "hi",
      IconComponent: HiIcons[name as keyof typeof HiIcons],
    }));
    const ioIconList = Object.keys(IoIcons).map((name) => ({
      name,
      library: "io",
      IconComponent: IoIcons[name as keyof typeof IoIcons],
    }));
    // Gộp danh sách
    const allIcons = [
      ...faIconList,
      ...mdIconList,
      ...biIconList,
      ...aiIconList,
      ...fcIconList,
      ...hiIconList,
      ...ioIconList,
    ];
    setIcons(allIcons);
  }, []);
  useEffect(() => {
    handleLoadMenuData();
  }, []);
  return (
    <div className="navmenu">
      <nav>
        <ul>
          {uniqueMenuData.map((menu: MENUDATA, index: number) => {
            const subMenu = menuData.filter(
              (item: MENUDATA) => item.MenuID === menu.MenuID
            );
            const icon = icons.find((icon) => icon.name === menu.MenuIcon);
            return (
              <li key={index}>
                <Link to={menu.Link} key={index}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{ fontSize: "0.8rem", color: `${menu.IconColor}` }}
                    >
                      {icon ? <icon.IconComponent size={15}/> : null}
                    </div>
                    {menu.Text}
                  </div>
                </Link>
                <ul className="submenu">
                  {subMenu.map((subMenu: MENUDATA, index: number) => {
                    const icon = icons.find(
                      (icon) => icon.name === subMenu.SubMenuIcon
                    );
                    return (
                      <li key={index}>
                        <Link
                          to={subMenu.SubLink}
                          key={index}
                          onClick={() => {
                            console.log("subMenu.MenuCode", subMenu.MenuCode);
                            if (subMenu.MenuCode === null) return;
                            if (
                              userData?.JOB_NAME === "ADMIN" ||
                              userData?.JOB_NAME === "Leader" ||
                              userData?.JOB_NAME === "Sub Leader" ||
                              userData?.JOB_NAME === "Dept Staff" ||
                              subMenu.MenuCode === "NS4" ||
                              subMenu.MenuCode === "NS6"
                            ) {
                              if (tabModeSwap) {
                                if (tabModeSwap) {
                                  let ele_code_array: string[] = tabs.map(
                                    (ele: ELE_ARRAY, index: number) => {
                                      return ele.ELE_CODE;
                                    }
                                  );
                                  let tab_index: number =
                                    ele_code_array.indexOf(subMenu.MenuCode);
                                  //console.log(tab_index);
                                  if (tab_index !== -1) {
                                    //console.log('co tab roi');
                                    dispatch(settabIndex(tab_index));
                                  } else {
                                    dispatch(
                                      addTab({
                                        ELE_NAME: subMenu.SubText,
                                        ELE_CODE: subMenu.MenuCode,
                                        REACT_ELE: "",
                                      })
                                    );
                                    dispatch(settabIndex(tabs.length));
                                  }
                                }
                              }
                            } else {
                              Swal.fire(
                                "Cảnh báo",
                                "Không đủ quyền hạn",
                                "error"
                              );
                            }
                          }}
                        >
                          {icon ? (
                            <icon.IconComponent color={subMenu.SubIconColor} size={15}/>
                          ) : null}
                          {subMenu.SubText}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};
export default NavMenuNew;

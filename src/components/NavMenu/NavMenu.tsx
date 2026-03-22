import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./NavMenu.scss";
import { UserData } from "../../api/GlobalInterface";
import { generalQuery } from "../../api/Api";
import { addTab, setTabIndex } from "../../redux/slices/tabsSlice";
import Swal from "sweetalert2";
import { ELE_ARRAY } from "../../api/GlobalInterface";
import { getNavMenu, NAVMENUDATA } from "./getNavMenu";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectUserData } from "../../redux/selectors/authSelectors";
import { selectTabModeSwap, selectTabs } from "../../redux/selectors/tabsSelectors";
import { selectCompany, selectLang } from "../../redux/selectors/uiSelectors";
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
  SubMenuIcon: string;
  SubIconColor: string;
}
const NavMenu = () => {
  const [menuData, setMenuData] = useState<MENUDATA[]>([]);
  const [openPVNMenus, setOpenPVNMenus] = useState<Record<string, boolean>>({});
  const userData: UserData | undefined = useAppSelector(selectUserData);
  const company: string = useAppSelector(selectCompany);
  const lang: string | undefined = useAppSelector(selectLang);
  const tabModeSwap: boolean = useAppSelector(selectTabModeSwap);
  const tabs: ELE_ARRAY[] = useAppSelector(selectTabs);
  const handleLoadMenuData = async () => {
    try {
      // API này cần chỉnh lại theo backend thực tế
      const res = await generalQuery("loadMenuData", {});
      if (res?.data?.data) {
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
    handleLoadMenuData();
  }, []);
  const dispatch = useAppDispatch();
  const SidebarData: NAVMENUDATA[] = useMemo( () => getNavMenu(company, lang), [company, lang] );
  const isPVN = company === "PVN";

  return (
    <div className={`navmenu ${company === "PVN" ? "navmenu--vertical" : ""}`}>
      <nav>
        <ul>
          {SidebarData.map((sidebar_element: any, index: number) => {
            const hasSub = (sidebar_element.subNav?.length ?? 0) > 0;
            const menuKey: string = `${sidebar_element.path ?? ""}__${sidebar_element.title ?? ""}__${index}`;
            const isOpen = !!openPVNMenus[menuKey];
            return (
              <li key={index}>
                {isPVN && hasSub ? (
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenPVNMenus((prev) => ({
                        ...prev,
                        [menuKey]: !prev[menuKey],
                      }));
                    }}
                  >
                    {sidebar_element.icon}
                    {sidebar_element.title}
                  </a>
                ) : (
                  <Link to={sidebar_element.path} key={index}>
                    {sidebar_element.icon}
                    {sidebar_element.title}
                  </Link>
                )}
                <ul className={`submenu ${isPVN && hasSub && isOpen ? "submenu--open" : ""}`}>
                  {sidebar_element.subNav?.map(
                    (subnav_element: any, index: number) => {
                      return (
                        <li key={index}>
                          <Link
                            to={subnav_element.path}
                            key={index}
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
                                      }
                                    );
                                    let tab_index: number =
                                      ele_code_array.indexOf(
                                        subnav_element.MENU_CODE
                                      );
                                    //console.log(tab_index);
                                    if (tab_index !== -1) {
                                      //console.log('co tab roi');
                                      dispatch(setTabIndex(tab_index));
                                    } else {
                                      dispatch(
                                        addTab({
                                          ELE_NAME: subnav_element.title,
                                          ELE_CODE: subnav_element.MENU_CODE,
                                          REACT_ELE: "",
                                          PAGE_ID: -1,
                                        })
                                      );
                                      dispatch(setTabIndex(tabs.length));
                                    }
                                  }
                                } else {
                                  Swal.fire(
                                    "Cảnh báo",
                                    "Không đủ quyền hạn",
                                    "error"
                                  );
                                }
                              }
                            }}
                          >
                            {subnav_element.icon}
                            {subnav_element.title}
                          </Link>
                        </li>
                      );
                    }
                  )}
                </ul>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};
export default NavMenu;

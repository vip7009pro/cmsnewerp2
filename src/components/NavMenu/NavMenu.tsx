import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./NavMenu.scss";
import { RootState } from "../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { UserData } from "../../api/GlobalInterface";
import { generalQuery } from "../../api/Api";
import { addTab, settabIndex } from "../../redux/slices/globalSlice";
import Swal from "sweetalert2";
import { ELE_ARRAY } from "../../api/GlobalInterface";
import { getNavMenu, NAVMENUDATA } from "./getNavMenu";
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
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );
  const company: string = useSelector(
    (state: RootState) => state.totalSlice.company
  );
  const lang: string | undefined = useSelector(
    (state: RootState) => state.totalSlice.lang
  );
  const tabModeSwap: boolean = useSelector(
    (state: RootState) => state.totalSlice.tabModeSwap
  );
  const tabs: ELE_ARRAY[] = useSelector(
    (state: RootState) => state.totalSlice.tabs
  );
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
  const dispatch = useDispatch();
  const SidebarData: NAVMENUDATA[] = useMemo( () => getNavMenu(company, lang), [company, lang] );

  return (
    <div className="navmenu">
      <nav>
        <ul>
          {SidebarData.map((sidebar_element: any, index: number) => {
            return (
              <li key={index}>
                <Link to={sidebar_element.path} key={index}>
                  {sidebar_element.icon}
                  {sidebar_element.title}
                </Link>
                <ul className="submenu">
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
                                      dispatch(settabIndex(tab_index));
                                    } else {
                                      dispatch(
                                        addTab({
                                          ELE_NAME: subnav_element.title,
                                          ELE_CODE: subnav_element.MENU_CODE,
                                          REACT_ELE: "",
                                          PAGE_ID: -1,
                                        })
                                      );
                                      dispatch(settabIndex(tabs.length));
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

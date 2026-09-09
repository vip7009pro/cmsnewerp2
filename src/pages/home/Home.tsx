import { Outlet, useNavigate } from "react-router-dom";
import "../home/home.scss";
import { animated } from "@react-spring/web";
import React, { useEffect, useState, Suspense, useMemo, useCallback, useRef, } from "react";
import { generalQuery, getCompany, getUserData, logout } from "../../api/Api";
import Swal from "sweetalert2";
import {
  IconButton,
  IconButtonProps,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { RootState } from "../../redux/store";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { addTab, changeGLBLanguage, closeTab, hideSidebar, resetTab, setTabModeSwap, settabIndex, toggleSidebar } from "../../redux/slices/globalSlice";
import styled from "@emotion/styled";
import Cookies from "universal-cookie";
import { MENU_LIST_DATA } from "../../api/GlobalInterface";
import { AccountInfo } from "../../api/lazyPages";
import { getMenuList } from "./menuConfig";
import PageTabs from "../nocodelowcode/components/PagesManager/Components/PageTabs/PageTabs";
import PrecisionHeader from "../../components/Navbar/PrecisionHeader/PrecisionHeader";
import { CloseRounded } from "@mui/icons-material";
import NavMenuNew from "../../components/NavMenu/NavMenuNew";
import { getNavMenu } from "../../components/NavMenu/getNavMenu";
import { canUseTabMode, getFirstNavMenuSearchResult, normalizeMenuPath } from "../../components/NavMenu/navMenuSearch";
import { requestChangelogPopup } from "../../components/Changelog/changelogEvents";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { Link } from "react-router-dom";
export const current_ver: number = getCompany() === "CMS" ? 2700 : 438;
interface ELE_ARRAY {
  REACT_ELE: any;
  ELE_NAME: string;
  ELE_CODE: string;
  PAGE_ID?: number;
}

export const CustomTab = styled(Tab)({
  minHeight: 26,
  height: 26,
  padding: 0,
  textTransform: "none",
  minWidth: 0,
  opacity: 1,
});

const CustomTabs = styled(Tabs)({
  minHeight: 34,
  height: 34,
  padding: 0,
  '& .MuiTabs-flexContainer': {
    gap: 4,
    height: 34,
    alignItems: "center",
  },
  '& .MuiTabs-indicator': {
    display: "none",
  },
  '& .MuiTabs-scrollButtons': {
    width: 22,
    height: 22,
    borderRadius: 4,
    color: "#64748b",
    '&.Mui-disabled': {
      opacity: 0.25,
    },
  },
});

function Home() {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const { theme, tabs, lang, company, tabIndex, tabModeSwap, sidebarStatus, cpnInfo, selectedServer, userData } =
    useSelector((state: RootState) => ({
      theme: state.totalSlice.theme,
      lang: state.totalSlice.lang,
      company: state.totalSlice.company,
      tabIndex: state.totalSlice.tabIndex,
      tabModeSwap: state.totalSlice.tabModeSwap,
      sidebarStatus: state.totalSlice.sidebarmenu,
      cpnInfo: state.totalSlice.cpnInfo,
      selectedServer: state.totalSlice.selectedServer,
      userData: state.totalSlice.userData,
      tabs: state.totalSlice.tabs,
    }), shallowEqual);

  const [menuSearchText, setMenuSearchText] = useState("");

  const prevState = useRef<any>(null);
  useEffect(() => {
    if (prevState.current) {
      const allProps: any = { theme, tabs, lang, company, tabIndex, tabModeSwap, sidebarStatus, cpnInfo, selectedServer, userData };
      const diff = Object.keys(allProps).filter(k => allProps[k] !== prevState.current[k]);
      if (diff.length > 0) {
        console.log("⚠️ Home re-render caused by changes in: ", diff);
      }
    }
    prevState.current = { theme, tabs, lang, company, tabIndex, tabModeSwap, sidebarStatus, cpnInfo, selectedServer, userData };
  });

  console.log("company", company);
  const menulist: MENU_LIST_DATA[] = useMemo(() => getMenuList(company, lang), [company, lang]);
  const navMenus = useMemo(() => getNavMenu(company, lang), [company, lang]);
  const dispatch = useDispatch();
  const [checkVerWeb, setCheckVerWeb] = useState(1);
  const [menuOpenSource, setMenuOpenSource] = useState<"navbar" | "menu" | null>(null);

  const handleNavSearchTextChange = useCallback((value: string) => {
    setMenuSearchText(value);

    if (value.trim() && !sidebarStatus) {
      dispatch(toggleSidebar("2"));
    }
  }, [dispatch, sidebarStatus]);

  const handleMenuSearchFocus = useCallback(() => {
    setMenuOpenSource("menu");
  }, []);

  useEffect(() => {
    if (!sidebarStatus) {
      setMenuOpenSource(null);
    }
  }, [sidebarStatus]);

  const openFirstSearchResult = useCallback(() => {
    const searchResult = getFirstNavMenuSearchResult(navMenus, menuSearchText);
    if (!searchResult) return;

    if (searchResult.subMenu) {
      if (tabModeSwap) {
        if (!canUseTabMode(userData, searchResult.subMenu.MENU_CODE)) {
          Swal.fire("Cảnh báo", "Không đủ quyền hạn", "error");
          return;
        }

        const existedTabIndex = tabs.findIndex((ele) => ele.ELE_CODE === searchResult.subMenu?.MENU_CODE);
        if (existedTabIndex !== -1) {
          dispatch(settabIndex(existedTabIndex));
        } else {
          dispatch(
            addTab({
              ELE_NAME: searchResult.subMenu.title,
              ELE_CODE: searchResult.subMenu.MENU_CODE,
              REACT_ELE: "",
              PAGE_ID: -1,
            })
          );
          dispatch(settabIndex(tabs.length));
        }

        dispatch(hideSidebar("2"));
        return;
      }

      navigate(normalizeMenuPath(searchResult.subMenu.path));
      dispatch(hideSidebar("2"));
      return;
    }

    navigate(normalizeMenuPath(searchResult.menu.path));
    dispatch(hideSidebar("2"));
  }, [dispatch, menuSearchText, navMenus, navigate, tabModeSwap, tabs, userData]);

  const updatechamcongdiemdanh = useCallback(() => {
    generalQuery("updatechamcongdiemdanhauto", {})
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const getchamcong = useCallback(() => {
    generalQuery("checkMYCHAMCONG", {})
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
          //console.log('data',response.data.REFRESH_TOKEN);
          let rfr_token: string = response.data.REFRESH_TOKEN;
          cookies.set("token", rfr_token, { path: "/" });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const checkERPLicense = useCallback(() => {
    if (true) {
      generalQuery("checkLicense", {
        COMPANY: company,
      })
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            console.log(response.data.message);
          } else {
            console.log(response.data.message);
            if (getUserData()?.EMPL_NO !== "NHU1903") {
              Swal.fire("Thông báo", "Please check your network", "error");
              logout();
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);
  const checkWebVer = useCallback((intervalID?: number) => {
    generalQuery("checkWebVer", {})
      .then((response) => {
        if (response?.data?.tk_status !== "NG") {
          const serverVersion = Number(response.data.data[0].VERWEB);
          console.log('webver', serverVersion);
          if (Number.isFinite(serverVersion) && current_ver < serverVersion) {
            requestChangelogPopup(serverVersion);
          }
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  useEffect(() => {
    console.log("local ver", current_ver);
    checkWebVer();
    let intervalID = window.setInterval(() => {
      checkWebVer(intervalID);
      getchamcong();
    }, 30000);
    checkERPLicense();
    return () => {
      window.clearInterval(intervalID);
    };
  }, []);
  //useRenderLag(true, 2500);
  const isPVN = company === "PVN";
  const didRestoreTabsRef = useRef(false);
  const pvnSidebarRef = useRef<HTMLDivElement | null>(null);
  const pvnToggleRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (didRestoreTabsRef.current) return;
    didRestoreTabsRef.current = true;

    const saveTab: any = localStorage.getItem("tabs")?.toString();
    if (saveTab !== undefined) {
      let tempTab: any[] = [];
      try {
        tempTab = JSON.parse(saveTab);
      } catch (e) {
        tempTab = [];
      }

      for (let i = 0; i < tempTab.length; i++) {
        dispatch(
          addTab({
            ELE_CODE: tempTab[i].MENU_CODE,
            ELE_NAME: tempTab[i].MENU_NAME,
            REACT_ELE: "",
            PAGE_ID: tempTab[i].PAGE_ID ?? -1,
          })
        );
      }
      dispatch(settabIndex(0));
      localStorage.setItem(
        "tabs",
        JSON.stringify(
          tempTab.filter((ele: any) => ele.MENU_CODE !== "-1")
        )
      );
    }
  }, [dispatch]);

  const handleNavSearchFocus = useCallback(() => {
    setMenuOpenSource("navbar");
    if (!sidebarStatus) {
      dispatch(toggleSidebar("2"));
    }
  }, [dispatch, sidebarStatus]);

  const handleNavSearchBlur = useCallback(() => {
    if (!menuSearchText.trim()) {
      setMenuOpenSource(null);
    }
  }, [menuSearchText]);

  useEffect(() => {
    if (!isPVN) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!sidebarStatus) return;
      const target = e.target as Node | null;
      if (!target) return;
      if (pvnSidebarRef.current?.contains(target)) return;
      if (pvnToggleRef.current?.contains(target)) return;
      dispatch(toggleSidebar("2"));
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (!e.ctrlKey) return;
      const isSpace = e.code === "Space" || e.key === " ";
      if (!isSpace) return;

      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const isTypingTarget =
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        target?.isContentEditable;
      if (isTypingTarget) return;

      e.preventDefault();
      setMenuOpenSource(!sidebarStatus ? "menu" : null);
      dispatch(toggleSidebar("2"));
    };

    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [dispatch, isPVN, sidebarStatus]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === "ArrowDown") {
        if (!tabModeSwap) return;

        const currentTabIndex = tabIndex;
        const currentTab = tabs[currentTabIndex];
        if (!currentTab || currentTab.ELE_CODE === "-1") return;

        event.preventDefault();
        dispatch(closeTab(currentTabIndex));
        return;
      }

      if (!event.ctrlKey || !event.shiftKey) return;
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

      const switchableTabs = tabs.filter((tab) => tab.ELE_CODE !== "-1");
      if (switchableTabs.length < 2) return;

      const currentCode = tabs[tabIndex]?.ELE_CODE;
      const currentSwitchableIndex = switchableTabs.findIndex((tab) => tab.ELE_CODE === currentCode);
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const nextSwitchableIndex = currentSwitchableIndex === -1
        ? 0
        : (currentSwitchableIndex + direction + switchableTabs.length) % switchableTabs.length;
      const nextTab = switchableTabs[nextSwitchableIndex];

      if (!nextTab) return;

      const nextTabIndex = tabs.findIndex((tab) => tab.ELE_CODE === nextTab.ELE_CODE);
      if (nextTabIndex === -1) return;

      event.preventDefault();
      dispatch(settabIndex(nextTabIndex));
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [dispatch, tabIndex, tabs]);
  return (
    <div className={`home ${isPVN ? "home--pvn" : ""}`}>
      {!isPVN && (
        <div className="navdiv">
          <PrecisionHeader
            searchText={menuSearchText}
            onSearchTextChange={handleNavSearchTextChange}
            onSearchFocus={handleNavSearchFocus}
            onSearchBlur={handleNavSearchBlur}
            onSearchEnter={openFirstSearchResult}
            onSidebarToggle={(nextOpen) => setMenuOpenSource(nextOpen ? "menu" : null)}
            sidebarOpen={menuOpenSource === "menu" || Boolean(sidebarStatus)}
          />
        </div>
      )}
      <div className={`homeContainer ${isPVN ? "homeContainer--pvn" : ""}`}>
        {isPVN && (
          <div
            ref={pvnSidebarRef}
            className={`sidebardiv ${sidebarStatus ? "sidebardiv--open" : "sidebardiv--closed"}`}
            style={{
              backgroundImage: `${theme.PVN.backgroundImage}`,
            }}
          >
            <div className="pvnSidebarHeader">
              <div className="pvnSidebarLogo">
                <img
                  alt="companylogo"
                  src="/companylogo.png"
                  width={cpnInfo[company].logoWidth}
                  height={cpnInfo[company].logoHeight}
                />
              </div>
              <div className="pvnSidebarWebver">
                <b>
                  Web Ver: {current_ver}_({selectedServer})
                </b>
              </div>
            </div>
            <div className="pvnSidebarMenuScroll">
              <div className="pvnSidebarMenuScrollInner">
                <NavMenuNew
                  mode="sidebar"
                  autoFocusSearch={menuOpenSource !== "navbar"}
                  onSearchEnter={openFirstSearchResult}
                  onSearchFocus={handleMenuSearchFocus}
                />
              </div>
            </div>
            <div className="pvnSidebarFooter">
              <div className="pvnSidebarTools">
                <select
                  value={lang}
                  onChange={(e) => {
                    dispatch(changeGLBLanguage(e.target.value));
                    localStorage.setItem("lang", e.target.value);
                  }}
                >
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">English</option>
                  <option value="kr">한국어</option>
                </select>
                <div
                  className="pvnToolBtn"
                  onClick={() => {
                    if (!tabModeSwap) {
                      dispatch(resetTab(0));
                      dispatch(
                        addTab({
                          ELE_CODE: "NS0",
                          ELE_NAME: "ACCOUNT_INFO",
                          REACT_ELE: "",
                          PAGE_ID: -1,
                        })
                      );
                    }
                    dispatch(setTabModeSwap(!tabModeSwap));
                  }}
                >
                  {tabModeSwap ? "Multiple Tabs" : "Single Tab"}
                </div>
                <Link
                  className="pvnToolBtn"
                  to="/setting"
                  onClick={(e) => {
                    if (tabModeSwap) {
                      e.preventDefault();
                      if (
                        userData?.JOB_NAME === "ADMIN" ||
                        userData?.JOB_NAME === "Leader" ||
                        userData?.JOB_NAME === "Sub Leader" ||
                        userData?.JOB_NAME === "Dept Staff"
                      ) {
                        let ele_code_array: string[] = tabs.map((ele: ELE_ARRAY) => ele.ELE_CODE);
                        let tIndex: number = ele_code_array.indexOf("ST01");
                        if (tIndex !== -1) {
                          dispatch(settabIndex(tIndex));
                        } else {
                          dispatch(
                            addTab({
                              ELE_CODE: "ST01",
                              ELE_NAME: "SETTING",
                              REACT_ELE: "",
                              PAGE_ID: -1,
                            })
                          );
                          dispatch(settabIndex(tabs.length));
                        }
                      } else {
                        Swal.fire("Cảnh báo", "Không đủ quyền hạn", "error");
                      }
                    }
                  }}
                >
                  Setting
                </Link>
                <div
                  className="pvnToolBtn"
                  onClick={() => {
                    dispatch(resetTab(0));
                    logout();
                  }}
                >
                  Logout
                </div>
              </div>
            </div>
          </div>
        )}
        {isPVN && (
          <div
            ref={pvnToggleRef}
            className={`pvnSidebarToggle ${sidebarStatus ? "pvnSidebarToggle--open" : "pvnSidebarToggle--closed"}`}
            onClick={() => {
              setMenuOpenSource(!sidebarStatus ? "menu" : null);
              dispatch(toggleSidebar("2"));
            }}
          >
            {sidebarStatus ? <MdChevronLeft size={16} /> : <MdChevronRight size={16} />}
          </div>
        )}
        <div className="outletdiv">
          <animated.div
            className="animated_div"
            style={{
              width: "100%",
              borderRadius: 8,
            }}
          >
            {tabModeSwap &&
              tabs.filter(
                (ele: ELE_ARRAY) =>
                  ele.ELE_CODE !== "-1" && ele.ELE_CODE !== "NS0"
              ).length > 0 && (
                <div className="tabsdiv">
                  <CustomTabs
                    value={tabIndex}
                    onChange={(
                      event: React.SyntheticEvent,
                      newValue: number
                    ) => {
                      dispatch(settabIndex(newValue));
                    }}
                    variant="scrollable"
                    aria-label="ERP TABS"
                    scrollButtons
                    allowScrollButtonsMobile
                    className="tabs"
                  >
                    {tabs.map((ele: ELE_ARRAY, index: number) => {
                      if (ele?.ELE_CODE !== "-1") {
                        const isActive = tabIndex === index;
                        return (
                          <CustomTab
                            disableRipple
                            key={index}
                            value={index}
                            className={isActive ? "erpTab erpTab--active" : "erpTab"}
                            label={
                              <div
                                className={
                                  isActive
                                    ? "erpTabLabel erpTabLabel--active"
                                    : "erpTabLabel"
                                }
                                onClick={(e) => {
                                  e.stopPropagation();
                                  dispatch(settabIndex(index));
                                }}
                              >
                                <span className="erpTabDot" />
                                <span className="erpTabIndex">{index + 1}</span>
                                <span className="erpTabTitle" title={ele.ELE_NAME}>
                                  {ele.ELE_NAME}
                                </span>
                                <span
                                  className="erpTabClose"
                                  title="Đóng tab (Ctrl+Shift+Down)"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(closeTab(index));
                                  }}
                                >
                                  <CloseRounded style={{ fontSize: 13 }} />
                                </span>
                              </div>
                            }
                          />
                        );
                      }
                      return null;
                    })}
                  </CustomTabs>

                  <div className="erpTabsToolbar">
                    <span className="erpTabsCount">
                      {tabs.filter((t) => t?.ELE_CODE !== "-1").length} tabs
                    </span>
                    <button
                      type="button"
                      className="erpTabsCloseAllBtn"
                      title="Đóng tất cả các tab"
                      onClick={() => {
                        dispatch(resetTab(0));
                      }}
                    >
                      <CloseRounded style={{ fontSize: 12 }} />
                      <span>Đóng tất cả</span>
                    </button>
                  </div>
                </div>
              )}
            {tabModeSwap &&
              tabs.map((ele: ELE_ARRAY, index: number) => {
                if (ele.ELE_CODE !== "-1")
                  return (
                    <div
                      key={index}
                      className="component_element"
                      style={{
                        visibility: index === tabIndex ? "visible" : "hidden",
                        width: sidebarStatus ? "100%" : "100%",
                      }}
                    >
                      <Suspense fallback={<div>Loading...</div>}>
                        {/* <PageShow pageId={ele.PAGE_ID ?? 0} /> */}
                        {
                          ele.PAGE_ID !== -1 ? <PageTabs PageGroupID={ele.PAGE_ID ?? 0} />

                            :
                            menulist.find(
                              (menu) => menu.MENU_CODE === ele.ELE_CODE
                            )?.MENU_ITEM}
                      </Suspense>
                    </div>
                  );
              })}
            {current_ver >= checkVerWeb ? (
              !tabModeSwap && <Outlet />
            ) : (
              <p
                style={{
                  fontSize: 35,
                  backgroundColor: "red",
                  width: "100%",
                  height: "100%",
                  zIndex: 1000,
                }}
              >
                ERP has updates, Press Ctrl +F5 to update web
              </p>
            )}
            {tabModeSwap && tabs.length === 0 && <AccountInfo />}
          </animated.div>
        </div>
        {/* {userData?.EMPL_NO === 'NHU1903' && <div className="chatroom">
          <CHAT />
        </div>} */}
      </div>
    </div>
  );
}
export default React.memo(Home);

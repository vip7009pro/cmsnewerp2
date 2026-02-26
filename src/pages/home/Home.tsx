import { Outlet } from "react-router-dom";
import "../home/home.scss";
import { animated } from "@react-spring/web";
import React, { useEffect, useState, Suspense, useMemo, useCallback, useRef, } from "react";
import { generalQuery, getCompany, getUserData, logout } from "../../api/Api";
import Swal from "sweetalert2";
import { IconButton, Tab, TabProps, Tabs, Typography } from "@mui/material";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { RootState } from "../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { addTab, changeGLBLanguage, closeTab, resetTab, setTabModeSwap, settabIndex, toggleSidebar } from "../../redux/slices/globalSlice";
import styled from "@emotion/styled";
import Cookies from "universal-cookie";
import { MENU_LIST_DATA } from "../../api/GlobalInterface";
import { AccountInfo, Navbar } from "../../api/lazyPages";
import { getMenuList } from "./menuConfig";
import PageTabs from "../nocodelowcode/components/PagesManager/Components/PageTabs/PageTabs";
import { useRenderLag } from "../../api/userRenderLag";
import NavMenu from "../../components/NavMenu/NavMenu";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { Link } from "react-router-dom";
export const current_ver: number = getCompany() === "CMS" ? 2650 : 439;
interface ELE_ARRAY {
  REACT_ELE: any;
  ELE_NAME: string;
  ELE_CODE: string;
  PAGE_ID?: number;
}
export const CustomTab = styled((props: TabProps) => <Tab {...props} />)({
  // Tùy chỉnh kiểu cho tab tại đây
  color: "gray", // Ví dụ: đặt màu chữ là màu xanh
  fontWeight: 200, // Ví dụ: đặt độ đậm cho chữ
  // Thêm các kiểu tùy chỉnh khác tại đây...
});
function Home() {
  const cookies = new Cookies();
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
    }));
  console.log("company", company);
  const menulist: MENU_LIST_DATA[] = useMemo( () => getMenuList(company, lang), [company, lang] );
  const dispatch = useDispatch();
  const [checkVerWeb, setCheckVerWeb] = useState(1);
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
  const CustomTabLabel = styled(Typography)({
    fontWeight: 200, // Ví dụ: đặt độ đậm cho chữ
    // Thêm các kiểu tùy chỉnh khác tại đây...
  });
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
          console.log('webver',response.data.data[0].VERWEB);
          if (current_ver >= response.data.data[0].VERWEB) {
          } else {
            if (intervalID) {
              window.clearInterval(intervalID);
            }
            Swal.fire({
              title: "ERP has updates?",
              text: "Update Web",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Update",
              cancelButtonText: "Update later",
            }).then((result) => {
              if (result.isConfirmed) {
                Swal.fire("Notification", "Update Web", "success");
                window.location.reload();
              } else {
                Swal.fire(
                  "Notification",
                  "Press Ctrl + F5 to update the Web",
                  "info"
                );
              }
            });
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
    if (!isPVN) return;
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
  }, [dispatch, isPVN]);

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
      dispatch(toggleSidebar("2"));
    };

    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [dispatch, isPVN, sidebarStatus]);
  return (
    <div className={`home ${isPVN ? "home--pvn" : ""}`}>
      {!isPVN && (
        <div className="navdiv">
          <Navbar />
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
                <NavMenu />
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
              height: "100vh",
              borderRadius: 8,
            }}
          >
            {tabModeSwap &&
              tabs.filter(
                (ele: ELE_ARRAY, index: number) =>
                  ele.ELE_CODE !== "-1" && ele.ELE_CODE !== "NS0"
              ).length > 0 && (
                <div className="tabsdiv">
                  <Tabs
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
                    style={{
                      backgroundImage: `${
                        company === "CMS"
                          ? theme.CMS.backgroundImage
                          : theme.PVN.backgroundImage
                      }`,
                      border: "none",
                      minHeight: "2px",
                      boxSizing: "border-box",
                      borderRadius: "2px",
                      overflow: "scroll",
                      height: "fit-content",
                    }}
                  >
                    {tabs.map((ele: ELE_ARRAY, index: number) => {
                      if (ele?.ELE_CODE !== "-1") {
                        return (
                          <div key={index}>
                            <CustomTab
                              key={index}
                              label={
                                <div
                                  className="tabdiv"
                                  style={{                                    
                                    display: "flex",
                                    fontSize: "0.8rem",
                                    justifyContent: "center",
                                    alignContent: "center",
                                    padding: '5px 5px 5px 5px',
                                    color: "black",
                                    borderRadius: "25px",
                                    margin: "2px",
                                    cursor: "pointer",
                                    backgroundColor: tabIndex === index ? "#1976d23e" : "transparent",                                    
                                  }}
                                 
                                >
                                  <CustomTabLabel
                                    style={{
                                      fontSize: "0.7rem",
                                      display: "flex",
                                      whiteSpace: "nowrap",
                                      alignItems: "center",
                                    }}
                                    
                                  >
                                    <span style={{ marginRight: "5px" }} onClick={() => {
                                      dispatch(settabIndex(index));
                                    }}>
                                      {index + 1}.{ele.ELE_NAME}
                                    </span>
                                    <IconButton
                                      key={index + "A"}
                                      onClick={() => {
                                        dispatch(closeTab(index));
                                      }}
                                    >
                                      <AiOutlineCloseCircle
                                        color={
                                          tabIndex === index ? `blue` : `gray`
                                        }
                                        size={15}
                                      />
                                    </IconButton>
                                  </CustomTabLabel>
                                </div>
                              }
                              value={index}
                              style={{
                                minHeight: "2px",
                                height: "5px",
                                boxSizing: "border-box",
                                borderRadius: "3px",
                              }}
                            ></CustomTab>
                          </div>
                        );
                      }
                    })}
                  </Tabs>
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
                          ele.PAGE_ID !== -1 ?  <PageTabs PageGroupID={ele.PAGE_ID ?? 0} />
                        
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
export default Home;

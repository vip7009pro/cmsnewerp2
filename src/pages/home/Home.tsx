import { Outlet } from "react-router-dom";
import "../home/home.scss";
import { animated } from "@react-spring/web";
import React, { useEffect, useState, Suspense, useMemo, useCallback, } from "react";
import { generalQuery, getCompany, getUserData, logout } from "../../api/Api";
import Swal from "sweetalert2";
import { IconButton, Tab, TabProps, Tabs, Typography } from "@mui/material";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { RootState } from "../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { closeTab, settabIndex } from "../../redux/slices/globalSlice";
import styled from "@emotion/styled";
import Cookies from "universal-cookie";
import { MENU_LIST_DATA } from "../../api/GlobalInterface";
import { AccountInfo, Navbar } from "../../api/lazyPages";
import { getMenuList } from "./menuConfig";
import PageTabs from "../nocodelowcode/components/PagesManager/Components/PageTabs/PageTabs";
export const current_ver: number = getCompany() === "CMS" ? 2640 : 426;
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
  const { theme, tabs, lang, company, tabIndex, tabModeSwap, sidebarStatus } =
    useSelector((state: RootState) => ({
      theme: state.totalSlice.theme,
      lang: state.totalSlice.lang,
      company: state.totalSlice.company,
      tabIndex: state.totalSlice.tabIndex,
      tabModeSwap: state.totalSlice.tabModeSwap,
      sidebarStatus: state.totalSlice.sidebarmenu,
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
          //console.log('webver',response.data.data[0].VERWEB);
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
  return (
    <div className="home">
      <div className="navdiv">
        <Navbar />
      </div>
      <div className="homeContainer">
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
                                    padding: 0,
                                    color: "black",
                                    borderRadius: "5px",
                                    margin: "5px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    dispatch(settabIndex(index));
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
                                    <span style={{ marginRight: "5px" }}>
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

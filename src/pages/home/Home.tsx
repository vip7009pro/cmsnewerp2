import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import "../home/home.scss";
import { useSpring, animated } from "@react-spring/web";
import { ReactElement, useEffect, useState } from "react";
import { generalQuery } from "../../api/Api";
import Swal from "sweetalert2";
import PrimarySearchAppBar from "../../components/AppBar/AppBarCustom";
import CHAT from "../chat/CHAT";
import { Box, IconButton, Tab, Tabs, Typography } from "@mui/material";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { RootState } from "../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { addTab, closeTab, settabIndex } from "../../redux/slices/globalSlice";
import AccountInfo from "../../components/Navbar/AccountInfo/AccountInfo";
export const current_ver: number = 170;
interface ELE_ARRAY {
  REACT_ELE: ReactElement;
  ELE_NAME: string;
  ELE_CODE: string;
}
function Home() {
  const tabs: ELE_ARRAY[] = useSelector(
    (state: RootState) => state.totalSlice.tabs
  );
  const tabIndex: number = useSelector(
    (state: RootState) => state.totalSlice.tabIndex
  );
  const tabModeSwap: boolean = useSelector(
    (state: RootState) => state.totalSlice.tabModeSwap
  );
  const sidebarStatus: boolean | undefined = useSelector(
    (state: RootState) => state.totalSlice.sidebarmenu
  );
  const dispatch = useDispatch();
  const springs = useSpring({
    from: { x: 1000, y: 100 },
    to: { x: 0, y: 0 },
  });
  const [checkVerWeb, setCheckVerWeb] = useState(1);
  const updatechamcongdiemdanh=()=> {
    generalQuery("updatechamcongdiemdanhauto", {  })
    .then((response) => {
      //console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  useEffect(() => {
    console.log("local ver", current_ver);
    generalQuery("checkWebVer", {})
      .then((response) => {
        console.log(response.data.tk_status);
        if (response.data.tk_status !== "NG") {
          console.log("webver", response.data.data[0].VERWEB);
          setCheckVerWeb(response.data.data[0].VERWEB);
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
    let intervalID = window.setInterval(() => {
      generalQuery("checkWebVer", {})
        .then((response) => {
          if (response?.data?.tk_status !== "NG") {
            //console.log('webver',response.data.data[0].VERWEB);
            if (current_ver >= response.data.data[0].VERWEB) {
            } else {
              window.clearInterval(intervalID);
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
    }, 30000);

    let intervalID2 = window.setInterval(() => {
      updatechamcongdiemdanh();      
    }, 5000);


    return () => {
      window.clearInterval(intervalID);
      window.clearInterval(intervalID2);
    };
  }, []);
  //console.log(tabs)
  return (
    <div className='home'>
      <div className='navdiv'>
        <Navbar />
        {/* <PrimarySearchAppBar/>  */}
      </div>
      <div className='homeContainer'>
        <div className='sidebardiv'>
          <Sidebar />
        </div>
        <div className='outletdiv'>
          <animated.div
            className='animated_div'
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 8,
              ...springs,
            }}
          >
            {tabModeSwap &&
              tabs.filter(
                (ele: ELE_ARRAY, index: number) =>
                  ele.ELE_CODE !== "-1" && ele.ELE_CODE !== "NS0"
              ).length > 0 && (
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    value={tabIndex}
                    onChange={(
                      event: React.SyntheticEvent,
                      newValue: number
                    ) => {
                      //console.log(newValue);
                      dispatch(settabIndex(newValue));
                    }}
                    variant='scrollable'
                    aria-label='ERP TABS'
                    scrollButtons
                    allowScrollButtonsMobile
                    style={{
                      backgroundImage: `linear-gradient(0deg, #afd3d1, #86cfff)`,
                      marginRight: "5px",
                      border: "none",
                      minHeight: "2px",
                      boxSizing: "border-box",
                      marginTop: 2,
                      borderRadius: "2px",
                    }}
                  >
                    {tabs.map((ele: ELE_ARRAY, index: number) => {
                      if (ele.ELE_CODE !== "-1") {
                        return (
                          <Tab
                            key={index}
                            label={index + 1 + "." + ele.ELE_NAME}
                            value={index}
                            style={{
                              minHeight: "2px",
                              height: "5px",
                              boxSizing: "border-box",
                              borderRadius: "5px",
                            }}
                          ></Tab>
                        );
                      }
                    })}
                  </Tabs>
                </Box>
              )}
            {tabModeSwap &&
              tabs.map((ele: ELE_ARRAY, index: number) => {
                if (ele.ELE_CODE !== "-1")
                  return (
                    <div
                      key={index}
                      className='component_element'
                      style={{
                        visibility: index === tabIndex ? "visible" : "hidden",     
                        width: sidebarStatus ? "85%" : "100%",                  
                      }}
                    >
                      {ele.REACT_ELE}
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
                  width: "800px",
                  height: "500px",
                  zIndex: 1000,
                }}
              >
                ERP has updates, Press Ctrl +F5 to update web
              </p>
            )}
            {tabModeSwap && tabs.length === 0 && <AccountInfo />}
          </animated.div>
        </div>
        {/* <div className="chatroom">
          <CHAT/>
        </div> */}
      </div>
    </div>
  );
}
export default Home;

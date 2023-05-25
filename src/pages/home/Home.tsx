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
export const current_ver: number = 135;
interface ELE_ARRAY {
  REACT_ELE: ReactElement;
  ELE_NAME: string;
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
  const dispatch = useDispatch();
  const springs = useSpring({
    from: { x: 1000, y: 100 },
    to: { x: 0, y: 0 },
  });
  const [checkVerWeb, setCheckVerWeb] = useState(1);
  console.log("local ver", current_ver);
  useEffect(() => {
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
          if (response.data.tk_status !== "NG") {
            //console.log('webver',response.data.data[0].VERWEB);
            if (current_ver >= response.data.data[0].VERWEB) {
            } else {
              window.clearInterval(intervalID);
              Swal.fire({
                title: "Có ver mới, hãy update?",
                text: "Update web",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Đã rõ",
              }).then((result) => {
                if (result.isConfirmed) {
                  Swal.fire("Thông báo", "Update web", "success");
                  window.location.reload();
                } else {
                  Swal.fire("Thông báo", "Nhớ F5 để update web nhé", "info");
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
    return () => {
      window.clearInterval(intervalID);
    };
  }, []);
  return (
    <div className='home'>
      <div className='navdiv'>
        <Navbar />
        {/* <PrimarySearchAppBar/>  */}
      </div>
      <div className='homeContainer'>
        <div className='sidebardiv'>
          {!tabModeSwap && <Sidebar />}
        </div>
        <div className='outletdiv'>
          <animated.div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 8,
              ...springs,
            }}
          >
            <div
              className='closeTab'
              style={{
                position: "absolute",
                top: "10px",
                right: 10,
                zIndex: 999,
              }}
            >
              {tabModeSwap && <IconButton
                className='buttonIcon'
                onClick={() => {
                  dispatch(closeTab(1));
                }}
              >
                <AiOutlineCloseCircle color='red' size={25} />
              </IconButton>}
            </div>            
            {tabModeSwap && <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabIndex}
                onChange={(event: React.SyntheticEvent, newValue: number) => {
                  console.log(newValue);
                  dispatch(settabIndex(newValue));
                }}
                variant="scrollable"
                aria-label='ERP TABS'
                scrollButtons
                allowScrollButtonsMobile
              >
                {tabs.map((ele: ELE_ARRAY, index: number) => {
                  return (
                    <Tab
                      key={index}
                      label={index + 1 + "." + ele.ELE_NAME}
                      value={index}
                    ></Tab>
                  );
                })}
              </Tabs>
            </Box>}          
            {tabModeSwap &&  tabs.map((ele: ELE_ARRAY, index: number) => {
              return (
                <div
                  key={index}
                  className='component_element'
                  style={{
                    visibility: index === tabIndex ? "visible" : "hidden",
                    position: "absolute",
                    top: "50px",
                    left: 0,
                    width: "100%",
                  }}
                >
                  {ele.REACT_ELE}
                </div>
              );
            })}
            {tabModeSwap && tabs.length ===0 && <AccountInfo/>}
             {current_ver >= checkVerWeb? (
              !tabModeSwap && <Outlet />
            ) : (
              <p>Web có câp nhật, Ctrl +F5 để cập nhật web</p>
            )}
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

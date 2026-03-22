import "devextreme/dist/css/dx.light.css";
import { useEffect, Suspense, useRef, useMemo, useCallback } from "react";
import {
  checkLogin,
  generalQuery,
  getCompany,
  getGlobalSetting,
  getNotiCount,
  getSocket,
  getUserData,
} from "./api/Api";
import Swal from "sweetalert2";
import { setDiemDanhState, setLoginState, setUserData } from "./redux/slices/authSlice";
import { setGlobalSetting } from "./redux/slices/notificationsSlice";
import { setTabModeSwap } from "./redux/slices/tabsSlice";
import { emitSocketEvent } from "./redux/slices/socketSlice";
import "./App.scss";
import FallBackComponent from "./components/Fallback/FallBackComponent";
import { UserData, WEB_SETTING_DATA } from "./api/GlobalInterface";
import { current_ver } from "./pages/home/Home";
import { Notifications } from "react-push-notification";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Login } from "./api/lazyPages";
import { requestFullScreen } from "./api/GlobalFunction";
import AppRoutes from "./AppRoutes";
import { useRenderLag } from "./api/userRenderLag";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { selectIsLoggedIn, selectUserData } from "./redux/selectors/authSelectors";
import { useMainSocketListeners } from "./socket/useMainSocketListeners";
function App() {
  const full_screen: number = parseInt(
    getGlobalSetting()?.filter(
      (ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === "FULL_SCREEN"
    )[0]?.CURRENT_VALUE ?? "0"
  );
  const elementRef = useRef(null);
  const swalContainer = document.querySelector(".swal2-container");
  const defaultUser = useMemo(() => {
    return {
      ADD_COMMUNE: "Đông Xuân",
      ADD_DISTRICT: "Sóc Sơn",
      ADD_PROVINCE: "Hà Nội",
      ADD_VILLAGE: "Thôn Phú Thọ",
      ATT_GROUP_CODE: 1,
      CMS_ID: "CMS1179",
      CTR_CD: "002",
      DOB: "1993-10-18T00:00:00.000Z",
      EMAIL: "nvh1903@cmsbando.com",
      EMPL_NO: "none",
      FACTORY_CODE: 1,
      FACTORY_NAME: "Nhà máy 1",
      FACTORY_NAME_KR: "1공장",
      FIRST_NAME: "HÙNG3",
      HOMETOWN: "Phụ Thọ - Đông Xuân - Sóc Sơn - Hà Nội",
      JOB_CODE: 1,
      JOB_NAME: "Dept Staff",
      JOB_NAME_KR: "부서담당자",
      MAINDEPTCODE: 1,
      MAINDEPTNAME: "QC",
      MAINDEPTNAME_KR: "품질",
      MIDLAST_NAME: "NGUYỄN VĂN",
      ONLINE_DATETIME: "2022-07-12T20:49:52.600Z",
      PASSWORD: "",
      PHONE_NUMBER: "0971092454",
      POSITION_CODE: 3,
      POSITION_NAME: "Staff",
      POSITION_NAME_KR: "사원",
      REMARK: "",
      SEX_CODE: 1,
      SEX_NAME: "Nam",
      SEX_NAME_KR: "남자",
      SUBDEPTCODE: 2,
      SUBDEPTNAME: "PD",
      SUBDEPTNAME_KR: "통역",
      WORK_POSITION_CODE: 2,
      WORK_POSITION_NAME: "PD",
      WORK_POSITION_NAME_KR: "PD",
      WORK_SHIFT_CODE: 0,
      WORK_SHIF_NAME: "Hành Chính",
      WORK_SHIF_NAME_KR: "정규",
      WORK_START_DATE: "2019-03-11T00:00:00.000Z",
      WORK_STATUS_CODE: 1,
      WORK_STATUS_NAME: "Đang làm",
      WORK_STATUS_NAME_KR: "근무중",
      EMPL_IMAGE: "N",
    };
  }, []);
  if (swalContainer instanceof HTMLElement) {
    swalContainer.style.zIndex = "9999";
  }
  const loadWebSetting = useCallback(() => {
    generalQuery("loadWebSetting", {})
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          let crST_string: any = localStorage.getItem("setting") ?? "";
          let loadeddata: WEB_SETTING_DATA[] = [];
          if (crST_string !== "") {
            let crST: WEB_SETTING_DATA[] = JSON.parse(crST_string);
            loadeddata = response.data.data.map(
              (element: WEB_SETTING_DATA, index: number) => {
                return {
                  ...element,
                  CURRENT_VALUE:
                    crST.filter(
                      (ele: WEB_SETTING_DATA, id: number) =>
                        ele.ID === element.ID
                    )[0]?.CURRENT_VALUE ?? element.DEFAULT_VALUE,
                };
              }
            );
          } else {
            loadeddata = response.data.data.map(
              (element: WEB_SETTING_DATA, index: number) => {
                return {
                  ...element,
                  CURRENT_VALUE: element.DEFAULT_VALUE,
                };
              }
            );
          }
          dispatch(setGlobalSetting(loadeddata));
        } else {
          dispatch(setGlobalSetting([]));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const globalLoginState: boolean | undefined = useAppSelector(selectIsLoggedIn);
  const globalUserData: UserData | undefined = useAppSelector(selectUserData);
  const dispatch = useAppDispatch();
  const checkDiemDanh = useCallback(() => {
    generalQuery("checkdiemdanh", {})
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          dispatch(setDiemDanhState(true));
        } else {
          dispatch(setDiemDanhState(false));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const checkLoginCallback = useCallback(() => {
    checkLogin()
      .then((data: any) => {
//        console.log('data check login', data);
        if (data.data.tk_status === "ng") {
          loadWebSetting();
          dispatch(setLoginState(false));
          dispatch(setUserData(defaultUser));
        } else {
          dispatch(setUserData(data.data.data));
          if (data.data.data.JOB_NAME === "Worker") {
            dispatch(setTabModeSwap(false));
          }
          if (data.data.data.POSITION_CODE === 4) {
            dispatch(setTabModeSwap(false));
          }
          dispatch(
            emitSocketEvent({
              event: "login",
              data: data.data.data.EMPL_NO,
            })
          );
          dispatch(setLoginState(true));
        }
      })
      .catch((err: any) => {
        console.log(err + " ");
      });
  }, []);
  useMainSocketListeners(globalLoginState);

  useEffect(() => {
    checkLoginCallback();
    checkDiemDanh();
  }, [globalLoginState]);

  useEffect(() => {
    let timer: any = null;

    const onScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target && target.scrollHeight > target.clientHeight) {
        target.classList.add("is-scrolling");
        if (timer) window.clearTimeout(timer);
        timer = window.setTimeout(() => {
          target.classList.remove("is-scrolling");
        }, 900);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true, capture: true } as any);
    return () => {
      if (timer) window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll, { capture: true } as any);
    };
  }, []);
  return (
    <>
      {globalLoginState && (
        <div
          className="App"
          ref={elementRef}
          onClick={() => requestFullScreen(elementRef, full_screen)}
        >
          <Suspense fallback={<FallBackComponent />}>
            <AppRoutes globalUserData={globalUserData} />
          </Suspense>
        </div>
      )}
      {!globalLoginState && <Login />}
      <Notifications />
    </>
  );
}
export default App;

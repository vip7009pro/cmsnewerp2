import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  checkLogin,
  generalQuery,
} from "../api/Api";
import { WEB_SETTING_DATA } from "../api/GlobalInterface";
import { DEFAULT_USER_DATA } from "../api/defaultUserData";
import {
  changeDiemDanhState,
  changeGLBSetting,
  changeUserData,
  login,
  logout,
  setTabModeSwap,
  update_socket,
} from "../redux/slices/globalSlice";

/**
 * Unified boot: fetch auth + điểm danh in parallel, hydrate settings, then dispatch
 * so the first paint after bootstrap has core Redux state complete.
 */
export function useAppBootstrap(): boolean {
  const dispatch = useDispatch();
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const loadWebSetting = useCallback(() => {
    return generalQuery("loadWebSetting", {})
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const crST_string: string = localStorage.getItem("setting") ?? "";
          let loadeddata: WEB_SETTING_DATA[] = [];
          if (crST_string !== "") {
            const crST: WEB_SETTING_DATA[] = JSON.parse(crST_string);
            loadeddata = response.data.data.map(
              (element: WEB_SETTING_DATA) => ({
                ...element,
                CURRENT_VALUE:
                  crST.filter((ele: WEB_SETTING_DATA) => ele.ID === element.ID)[0]
                    ?.CURRENT_VALUE ?? element.DEFAULT_VALUE,
              })
            );
          } else {
            loadeddata = response.data.data.map(
              (element: WEB_SETTING_DATA) => ({
                ...element,
                CURRENT_VALUE: element.DEFAULT_VALUE,
              })
            );
          }
          dispatch(changeGLBSetting(loadeddata));
        } else {
          dispatch(changeGLBSetting([]));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [dispatch]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const [loginData, diemDanhRes] = await Promise.all([
          checkLogin().catch((err) => {
            console.error("Login check failed:", err);
            return { data: { tk_status: "ng", data: DEFAULT_USER_DATA } };
          }),
          generalQuery("checkdiemdanh", {}).catch((error) => {
            console.log(error);
            return { data: { tk_status: "NG" } };
          }),
        ]);

        if (cancelled) return;

        await loadWebSetting();
        if (cancelled) return;

        if (diemDanhRes.data.tk_status !== "NG") {
          dispatch(changeDiemDanhState(true));
        } else {
          dispatch(changeDiemDanhState(false));
        }

        if (loginData.data.tk_status === "ng") {
          dispatch(logout(false));
          dispatch(changeUserData(DEFAULT_USER_DATA));
        } else {
          dispatch(changeUserData(loginData.data.data));
          if (
            loginData.data.data.JOB_NAME === "Worker" ||
            loginData.data.data.POSITION_CODE === 4
          ) {
            dispatch(setTabModeSwap(false));
          }
          dispatch(
            update_socket({
              event: "login",
              data: loginData.data.data.EMPL_NO,
            })
          );
          dispatch(login(true));
        }
      } catch (err) {
        console.error("Bootstrap failed:", err);
        dispatch(logout(false));
        dispatch(changeUserData(DEFAULT_USER_DATA));
      } finally {
        if (!cancelled) setIsBootstrapping(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [dispatch, loadWebSetting]);

  return isBootstrapping;
}

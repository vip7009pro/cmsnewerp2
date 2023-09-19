import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ReactElement } from "react";
import { io } from "socket.io-client";
import Swal from "sweetalert2";
import { getUserData, logout as LGOT } from "../../api/Api";
import {
  ELE_ARRAY,
  GlobalInterface,
  QLSXPLANDATA,
  UserData,
} from "../../api/GlobalInterface";
const startCPN: string = "CMS";
const socket = io(
  startCPN === "CMS"
    ? "http://14.160.33.94:3005"
    : startCPN === "PVN"
    ? "http://222.252.1.63:3005"
    : ""
);
//const socket =  io('http://localhost:3005')
socket.on("connect", () => {
  console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});
socket.on("notification", (data) => {
  if (data.command === "logout") {
    console.log(getUserData());
    if (getUserData()?.EMPL_NO === data.EMPL_NO) {
      console.log("logout nao");
      LGOT();
    } else if (data.EMPL_NO === "ALL") {
      console.log("logout nao");
      LGOT();
    }
  }
  console.log(data); // x8WIv7-mJelg7on_ALbx
});

socket.on("online_list", (data) => {
  console.log("online list", data);
});
socket.on("login", (data) => {
  console.log(data);
  // x8WIv7-mJelg7on_ALbx
});
socket.on("logout", (data) => {
  console.log(data);
  // x8WIv7-mJelg7on_ALbx
});
socket.on("disconnect", () => {
  console.log(socket.id); //undefined
});
socket.on("connect_error", (e) => {
  console.log("Lỗi kết nối: ", e);
});
let server_ip_local: any = localStorage.getItem("server_ip")?.toString();
if (server_ip_local !== undefined) {
} else {
  console.log("server_ip_local", server_ip_local);
  localStorage.setItem(
    "server_ip",
    startCPN === "CMS"
      ? "http://14.160.33.94:5011"
      : startCPN === "PVN"
      ? "http://222.252.1.63:3007"
      : ""
  );
}
const initialState: GlobalInterface = {
  userData: {
    EMPL_IMAGE: "Y",
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
    PASSWORD: "dauxanhrauma",
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
  },
  diemdanhstate: false,
  lang: "vi",
  sidebarmenu: true,
  multiple_chithi_array: [],
  company: startCPN,
  server_ip:
    startCPN === "CMS"
      ? "http://14.160.33.94:5011"
      : startCPN === "PVN"
      ? "http://222.252.1.63:3007"
      : "",
  tabs: [],
  tabIndex: 0,
  tabModeSwap: true,
  loginState: false,
  theme: {
    CMS: {
      backgroundImage: `linear-gradient(0deg, rgba(77, 175, 252,0.8), rgba(159, 212, 254,0.8))`,
    },
    PVN: {
      /* backgroundImage: `linear-gradient(90deg, rgba(254,255,23,1) 0%, rgba(235,242,144,0.9920343137254902) 47%, rgba(255,241,134,1) 100%)`, */
      backgroundImage: `linear-gradient(0deg, rgba(214, 225, 132, 0.6), rgba(216, 255, 19, 0.6))`,
    },
  },
};
export const glbSlice = createSlice({
  name: "totalSlice",
  initialState,
  reducers: {
    changeDiemDanhState: (state, action: PayloadAction<boolean>) => {
      //console.log(action.payload);
      state.diemdanhstate = action.payload;
    },
    changeUserData: (state, action: PayloadAction<UserData>) => {
      //console.log(action.payload);
      if (action.payload !== undefined) state.userData = action.payload;
    },
    update_socket: (state, action: PayloadAction<any>) => {
      socket.emit(action.payload.event, action.payload.data);
    },
    listen_socket: (state, action: PayloadAction<any>) => {
      socket.on(action.payload.event, (data: any) => {
        switch (action.payload.event) {
          case "login":
            console.log(data);
            break;
          case "logout":
            console.log(data + "da dang xuat");
            break;
          case "connect":
            console.log(socket.id);
            break;
          case "disconnect":
            console.log(data);
            break;
          case "notification":
            break;
        }
      });
    },
    toggleSidebar: (state, action: PayloadAction<any>) => {
      state.sidebarmenu = !state.sidebarmenu;
    },
    hideSidebar: (state, action: PayloadAction<any>) => {
      state.sidebarmenu = false;
    },
    addChithiArray: (state, action: PayloadAction<QLSXPLANDATA>) => {
      let temp_plan_id_array: string[] = state.multiple_chithi_array.map(
        (element: QLSXPLANDATA, index: number) => {
          return element.PLAN_ID;
        }
      );
      let temp_plan_step_array: QLSXPLANDATA[] =
        state.multiple_chithi_array.filter(
          (element: QLSXPLANDATA, index: number) => {
            return element.STEP === 0;
          }
        );
      if (temp_plan_id_array.indexOf(action.payload.PLAN_ID) !== -1) {
        Swal.fire("Thông báo", "PLAN ID đã được thêm rồi", "error");
      } else {
        if (temp_plan_step_array.length > 0 && action.payload.STEP === 0) {
          Swal.fire(
            "Thông báo",
            "Chỉ thêm 1 chỉ thị Bước 0 vào combo",
            "error"
          );
        } else {
          if (state.multiple_chithi_array.length === 0) {
            state.multiple_chithi_array = [
              ...state.multiple_chithi_array,
              action.payload,
            ];
            //console.log(state.multiple_chithi_array);
            Swal.fire("Thông báo", "Thêm PLAN ID thành công", "success");
          } else {
            if (
              state.multiple_chithi_array[0].PROD_REQUEST_NO ===
              action.payload.PROD_REQUEST_NO
            ) {
              state.multiple_chithi_array = [
                ...state.multiple_chithi_array,
                action.payload,
              ];
              //console.log(state.multiple_chithi_array);
              Swal.fire("Thông báo", "Thêm PLAN ID thành công", "success");
            } else {
              Swal.fire(
                "Thông báo",
                "Chỉ thêm các chỉ thị của cùng 1 ycsx vào combo",
                "error"
              );
            }
          }
        }
      }
    },
    resetChithiArray: (state, action: PayloadAction<string>) => {
      state.multiple_chithi_array = [];
      Swal.fire("Thông báo", "Reset Plan in combo thành công", "success");
    },
    changeServer: (state, action: PayloadAction<string>) => {
      state.server_ip = action.payload;
      //Swal.fire('Thông báo','Đã đổi server sang : ' + action.payload);
    },
    addTab: (state, action: PayloadAction<ELE_ARRAY>) => {
      if (
        state.tabs.filter((e: ELE_ARRAY, index: number) => e.ELE_CODE !== "-1")
          .length < 8
      ) {
        state.tabs = [...state.tabs, action.payload];
        localStorage.setItem(
          "tabs",
          JSON.stringify(
            state.tabs.map((ele: ELE_ARRAY, index: number) => {
              return {
                MENU_CODE: ele.ELE_CODE,
                MENU_NAME: ele.ELE_NAME,
              };
            })
          )
        );
      } else {
        Swal.fire(
          "Thông báo",
          "Chỉ mở cùng lúc tối đa 8 tab để đảm bảo trải nghiệm sử dụng, hãy tắt bớt tab không sử dụng",
          "warning"
        );
      }
    },
    resetTab: (state, action: PayloadAction<any>) => {
      state.tabs = [];
      localStorage.setItem(
        "tabs",
        JSON.stringify(
          state.tabs.map((ele: ELE_ARRAY, index: number) => {
            return {
              MENU_CODE: ele.ELE_CODE,
              MENU_NAME: ele.ELE_NAME,
            };
          })
        )
      );
    },
    closeTab: (state, action: PayloadAction<number>) => {
      /*  state.tabs = state.tabs.filter(
            (ele: ELE_ARRAY, index1: number) => {
              return index1 !== state.tabIndex;
            }
          ); */
      let checkallDeleted: boolean = true;
      for (let i = 0; i < state.tabs.length; i++) {
        if (state.tabs[i].ELE_CODE !== "-1") checkallDeleted = false;
      }
      if (!checkallDeleted) {
        state.tabs[state.tabIndex] = {
          ELE_CODE: "-1",
          ELE_NAME: "DELETED",
          REACT_ELE: "",
        };
        localStorage.setItem(
          "tabs",
          JSON.stringify(
            state.tabs.map((ele: ELE_ARRAY, index: number) => {
              return {
                MENU_CODE: ele.ELE_CODE,
                MENU_NAME: ele.ELE_NAME,
              };
            })
          )
        );
        //let i=state.tabIndex;
        while (
          state.tabIndex > 0 &&
          state.tabs[state.tabIndex].ELE_CODE === "-1"
        ) {
          state.tabIndex--;
        }
        if (state.tabIndex === 0) {
          while (
            state.tabIndex < state.tabs.length &&
            state.tabs[state.tabIndex].ELE_CODE === "-1"
          ) {
            state.tabIndex++;
          }
        }
        /* state.tabIndex = state.tabIndex-1>0? state.tabIndex-1: 0;  */
      }
    },
    settabIndex: (state, action: PayloadAction<number>) => {
      state.tabIndex = action.payload;
    },
    setTabModeSwap: (state, action: PayloadAction<boolean>) => {
      state.tabModeSwap = action.payload;
    },
    logout: (state, action: PayloadAction<boolean>) => {
      state.loginState = false;
    },
    login: (state, action: PayloadAction<boolean>) => {
      state.loginState = true;
    },
  },
});
export const {
  changeDiemDanhState,
  changeUserData,
  update_socket,
  toggleSidebar,
  hideSidebar,
  addChithiArray,
  resetChithiArray,
  changeServer,
  listen_socket,
  addTab,
  closeTab,
  settabIndex,
  setTabModeSwap,
  resetTab,
  logout,
  login,
} = glbSlice.actions;
export default glbSlice.reducer;

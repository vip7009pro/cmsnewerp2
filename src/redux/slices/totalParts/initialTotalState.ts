import { io } from "socket.io-client";
import Swal from "sweetalert2";
import { getUserData, logout as LGOT } from "../../../api/Api";
import {
  ELE_ARRAY,
  GlobalInterface,
  WEB_SETTING_DATA,
} from "../../../api/GlobalInterface";

const startCPN: string = "CMS";

console.log("protocol", window.location.protocol);
const protocol = window.location.protocol.startsWith("https") ? "https" : "http";
const main_port = protocol === "https" ? "5014" : "5013";
const sub_port = protocol === "https" ? "3007" : "3007";

export const companyInfo = {
  CMS: {
    logo: "/companylogo.png",
    logoWidth: 114.4,
    logoHeight: 27.13333,
    loginLogoWidth: 190,
    loginLogoHeight: 50,
    backgroundImage: `linear-gradient(90deg, hsla(152, 100%, 50%, 1) 0%, hsla(186, 100%, 69%, 1) 100%)`,
    apiUrl: `${protocol}://cmsvina4285.com:${main_port}`,
    apiUrlArray: [
      {
        server_name: "NET_SERVER",
        apiUrl: `${protocol}://cmsvina4285.com:${main_port}`,
      },
      {
        server_name: "SUBNET_SERVER",
        apiUrl: `${protocol}://cmsvina4285.com:${sub_port}`,
      },
    ],
  },
  PVN: {
    logo: "/companylogo.png",
    logoWidth: 114.4,
    logoHeight: 25,
    loginLogoWidth: 190,
    loginLogoHeight: 80,
    backgroundImage: `linear-gradient(0deg, rgba(220, 243, 165,1), rgba(243, 233, 89))`,
    apiUrl: `${protocol}://erp.printvietnam.com.vn:${sub_port}`,
    apiUrlArray: [
      {
        server_name: "MAIN_SERVER",
        apiUrl: `${protocol}://erp.printvietnam.com.vn:${sub_port}`,
      },
      {
        server_name: "TEST_SERVER",
        apiUrl: `${protocol}://localhost:${sub_port}`,
      },
    ],
  },
  NHATHAN: {
    logo: "/companylogo.png",
    logoWidth: 30,
    logoHeight: 30,
    loginLogoWidth: 170,
    loginLogoHeight: 160,
    backgroundImage: `linear-gradient(0deg, rgba(220, 243, 165,1), rgba(243, 233, 89))`,
    apiUrl: `${protocol}://222.252.1.214:${sub_port}`,
    apiUrlArray: [
      {
        server_name: "MAIN_SERVER",
        apiUrl: `${protocol}://222.252.1.214:${sub_port}`,
      },
      {
        server_name: "TEST_SERVER",
        apiUrl: `${protocol}://localhost:${sub_port}`,
      },
    ],
  },
};

export const socket = io(companyInfo[startCPN as keyof typeof companyInfo].apiUrl);

socket.on("connect", () => {
  console.log(socket.id);
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
  console.log(data);
});

socket.on("login", (data) => {
  console.log(data);
});

socket.on("logout", (data) => {
  console.log(data);
});

socket.on("disconnect", () => {
  console.log(socket.id);
});

socket.on("connect_error", (e) => {
  console.log("Lỗi kết nối: ", e);
});

let server_ip_local: any = localStorage.getItem("server_ip")?.toString();
if (server_ip_local !== undefined) {
} else {
  localStorage.setItem(
    "server_ip",
    companyInfo[startCPN as keyof typeof companyInfo].apiUrl,
  );
}

let notiCount: any = localStorage.getItem("notification_count")?.toString();
if (notiCount !== undefined) {
} else {
  localStorage.setItem("notification_count", "0");
}

let crST_string: any = localStorage.getItem("setting") ?? "";
let crST: WEB_SETTING_DATA[] = [];
if (crST_string !== "") {
  crST = JSON.parse(crST_string);
}

export type TotalState = GlobalInterface;

export const initialTotalState: GlobalInterface = {
  notificationCount: Number.parseInt(notiCount),
  globalSetting: crST,
  globalSocket: socket,
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
  lang: localStorage.getItem("lang")?.toString() ?? "vi",
  sidebarmenu: false,
  multiple_chithi_array: [],
  company: startCPN,
  server_ip:
    server_ip_local ?? companyInfo[startCPN as keyof typeof companyInfo].apiUrl,
  tabs: [],
  componentArray: [],
  tabIndex: 0,
  tabModeSwap: true,
  loginState: false,
  vendorLoginState: false,
  ctr_cd: "002",
  theme: {
    CMS: {
      backgroundImage: companyInfo[startCPN as keyof typeof companyInfo]
        .backgroundImage,
    },
    PVN: {
      backgroundImage: companyInfo[startCPN as keyof typeof companyInfo]
        .backgroundImage,
    },
  },
  cpnInfo: companyInfo,
  selectedServer:
    companyInfo[startCPN as keyof typeof companyInfo].apiUrlArray[0].server_name,
  lag_mode: false,
};

export function persistTabs(tabs: ELE_ARRAY[]) {
  localStorage.setItem(
    "tabs",
    JSON.stringify(
      tabs.map((ele: ELE_ARRAY) => {
        return {
          MENU_CODE: ele.ELE_CODE,
          MENU_NAME: ele.ELE_NAME,
          PAGE_ID: ele.PAGE_ID,
        };
      }),
    ),
  );
}

export function showAddTabLimitWarning() {
  Swal.fire(
    "Thông báo",
    "Chỉ mở cùng lúc tối đa 8 tab để đảm bảo trải nghiệm sử dụng, hãy tắt bớt tab không sử dụng",
    "warning",
  );
}

export function showPlanIdAlreadyAdded() {
  Swal.fire("Thông báo", "PLAN ID đã được thêm rồi", "error");
}

export function showOnlyOneStep0Allowed() {
  Swal.fire("Thông báo", "Chỉ thêm 1 chỉ thị Bước 0 vào combo", "error");
}

export function showOnlySameYcsxAllowed() {
  Swal.fire("Thông báo", "Chỉ thêm các chỉ thị của cùng 1 ycsx vào combo", "error");
}

export function showAddPlanSuccess() {
  Swal.fire("Thông báo", "Thêm PLAN ID thành công", "success");
}

export function showResetPlanSuccess() {
  Swal.fire("Thông báo", "Reset Plan in combo thành công", "success");
}

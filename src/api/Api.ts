import Cookies from "universal-cookie";
import Swal from "sweetalert2";
import { store } from "../redux/store";
import {login as loginSlice,logout as logoutSlice } from "../redux/slices/globalSlice"


const axios = require("axios").default;
const cookies = new Cookies();
axios.defaults.withCredentials = true;
//const API_URL = "http://14.160.33.94:3007/api";
//const API_URL = "http://localhost:3007/api";
export function getSever(): string {
  const state = store.getState();
  console.log(state.totalSlice.server_ip);
  return state.totalSlice.server_ip;
}

let API_URL = "http://14.160.33.94:5011/api";


let UPLOAD_URL = "http://14.160.33.94:5011/uploadfile";


let server_ip_local: any = localStorage.getItem("server_ip")?.toString();
if (server_ip_local !== undefined) {
  API_URL = server_ip_local;
} else {
}


export function login(user: string, pass: string) {
  axios
    .post(API_URL, {
      command: "login",
      user: user,
      pass: pass,
    })
    .then((response: any) => {
      console.log("ketqua");
      //console.log(response.data);
      var Jresult = response.data;
      //console.log("Status = " + Jresult.tk_status);
      //console.log("Token content = " + Jresult.token_content);
      if (Jresult.tk_status === "ok") {
        //console.log(Jresult.token_content);
        Swal.fire(
          "Thông báo",
          "Chúc mừng bạn, đăng nhập thành công !",
          "success"
        );
        //alert("Đăng nhập thành công");
        cookies.set("token", Jresult.token_content, { path: "/" });
        setTimeout(() => {
          /* window.location.href = "/"; */
          store.dispatch(loginSlice(true));

        }, 1000);
      } else {
        Swal.fire("Tên đăng nhập hoặc mật khẩu sai");
      }
    })
    .catch((error: any) => {
      console.log(error);
    });
}
export function logout() {
  cookies.set("token", "reset", { path: "/" });
  /* Swal.fire("Thông báo", "Đăng xuất thành công !", "success"); */
  setTimeout(() => {
    /* window.location.href = "/"; */
    store.dispatch(logoutSlice(false));
  }, 1000);
}
export async function checkLogin() {
  let data = await axios.post(API_URL, {
    command: "checklogin",
    DATA: {token_string: cookies.get('token'),},
  });
  return data;
}
export async function generalQuery(command: string, queryData: any) {
  let data = await axios.post(API_URL, {    
    command: command,
    DATA: {...queryData, token_string: cookies.get('token'),},
  });
  return data;
}

export async function uploadQuery(file: any, filename: string, uploadfoldername:string, filenamelist?: string[]) {
  const formData = new FormData();
  formData.append("uploadedfile", file);
  formData.append("filename", filename);
  formData.append("uploadfoldername", uploadfoldername); 
  if(filenamelist) formData.append('newfilenamelist',JSON.stringify(filenamelist));
  console.log('filenamelist',filenamelist);
  let data = await axios.post(UPLOAD_URL, formData);
  return data;
}

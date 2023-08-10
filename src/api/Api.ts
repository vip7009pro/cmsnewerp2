import Cookies from "universal-cookie";
import Swal from "sweetalert2";
import { store } from "../redux/store";
import {changeUserData, login as loginSlice,logout as logoutSlice, update_socket } from "../redux/slices/globalSlice"


/* import axios from 'axios'; */
import axios from 'axios';
const cookies = new Cookies();
axios.defaults.withCredentials = true;
//const API_URL = "http://14.160.33.94:3007/api";
//const API_URL = "http://localhost:3007/api";
export function getSever(): string {
  const state = store.getState();
  //console.log(state.totalSlice.server_ip);
  return state.totalSlice.server_ip;
}
export function getCompany(): string {
  const state = store.getState();
  //console.log(state.totalSlice.server_ip);
  return state.totalSlice.company;
}

console.log('company', getCompany())

let API_URL = getSever() + '/api';
let UPLOAD_URL = getSever() + '/uploadfile';

let server_ip_local: any = localStorage.getItem("server_ip")?.toString();

if (server_ip_local !== undefined) {
  API_URL = server_ip_local+ '/api';
  UPLOAD_URL = server_ip_local+ '/uploadfile';
} else {
  
}

export function login(user: string, pass: string) {
  let API_URL = getSever() + '/api';
  let UPLOAD_URL = getSever() + '/uploadfile';

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
        checkLogin()
        .then((data) => {
          //console.log(data);
          if (data.data.tk_status === "ng") {
            /* console.log("khong co token");
            setLoginState(false); */
            store.dispatch(logoutSlice(false));
            store.dispatch(
              changeUserData({
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
              })
            );            
          } else {
            //console.log(data.data.data);    
            if(data.data.data.WORK_STATUS_CODE !== 0)
            {
              store.dispatch(changeUserData(data.data.data));
              //dispatch(update_socket(data.data.data.EMPL_NO + " da dangnhap"));
              store.dispatch(
                update_socket({
                  event: "login",
                  data: data.data.data.EMPL_NO,
                })
              );
              /* setLoginState(true); */
              store.dispatch(loginSlice(true));
              setTimeout(() => {
                /*  window.location.href = "/"; */
                 store.dispatch(loginSlice(true));          
               }, 1000);

            }     
            else
            {
              Swal.fire("Thông báo","Nghỉ việc rồi không truy cập được!","error");
            }   
           
          }
        })
        .catch((err) => {
          console.log(err + " ");
        });        
      
      }  else {
        Swal.fire("Thông báo","Tên đăng nhập hoặc mật khẩu sai!","error");
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
  let API_URL = getSever() + '/api';
  let UPLOAD_URL = getSever() + '/uploadfile';
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
  formData.append("token_string2", cookies.get('token'));
  if(filenamelist) formData.append('newfilenamelist',JSON.stringify(filenamelist));
  console.log('filenamelist',filenamelist);
  console.log('formData',formData);
  let data = await axios.post(UPLOAD_URL, formData);
  return data;
}

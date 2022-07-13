
import Cookies from "universal-cookie";
import Swal from "sweetalert2";

const axios = require('axios').default;

const cookies = new Cookies();
axios.defaults.withCredentials = true;

 //const API_URL = "http://14.160.33.94:5011/api";
 const API_URL = "http://14.160.33.94:3007/api";

export function login(user: string, pass: string) {
  axios.post(API_URL, {
      command: "login",
      user: user,
      pass: pass,
    })
    .then((response: any) => {
      console.log("ketqua");
      console.log(response.data);
      var Jresult = response.data;
      console.log("Status = " + Jresult.tk_status);
      console.log("Tokent content = " + Jresult.token_content);
      if (Jresult.tk_status == "ok") {
        console.log(Jresult.token_content);
        Swal.fire("Thông báo", "Chúc mừng bạn, đăng nhập thành công !", "success");
        //alert("Đăng nhập thành công");
        cookies.set("token", Jresult.token_content, { path: "/" });
        setTimeout(() => {
          window.location.href = "/";
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
  Swal.fire("Thông báo", "Đăng xuất thành công !", "success");
  setTimeout(() => {
    window.location.href = "/";
  }, 1000);
}
export async function checkLogin() {
  let data = await axios.post(API_URL, {
    command: "checklogin",
  });
  return data;
}
export async function generalQuery(command: string, queryData: any) {
  let data = await axios.post(API_URL, {
    command: command,
    DATA: queryData,
  });
  return data;
}

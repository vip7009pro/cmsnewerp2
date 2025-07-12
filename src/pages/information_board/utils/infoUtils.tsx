import moment from "moment";
import { generalQuery } from "../../../api/Api";
import { DEPARTMENT_DATA, POST_DATA } from "../interfaces/infoInterface";

//bang tin
export const f_getDepartmentList = async () => {
  let kq: DEPARTMENT_DATA[] = [];
  await generalQuery("getDepartmentList", {})
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        kq = response.data.data;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};
export const f_fetchPostListAll = async () => {
  let kq: POST_DATA[] = [];
  try {
    let res = await generalQuery("loadPostAll", {});
    //console.log(res);
    if (res.data.tk_status !== "NG") {
      //console.log(res.data.data);
      let loaded_data: POST_DATA[] = res.data.data.map(
        (ele: POST_DATA, index: number) => {
          return {
            ...ele,
            INS_DATE: moment.utc(ele.INS_DATE).format("YYYY-MM-DD HH:mm:ss"),
            UPD_DATE: moment.utc(ele.UPD_DATE).format("YYYY-MM-DD HH:mm:ss"),
            id: index,
          };
        }
      );
      kq = loaded_data;
    } else {
      console.log("fetch error");
    }
  } catch (error) {
    console.log(error);
  }
  return kq;
};
export const f_fetchPostList = async (DEPT_CODE: number) => {
  let kq: POST_DATA[] = [];
  try {
    let res = await generalQuery("loadPost", { DEPT_CODE: DEPT_CODE });
    //console.log(res);
    if (res.data.tk_status !== "NG") {
      //console.log(res.data.data);
      let loaded_data: POST_DATA[] = res.data.data.map(
        (ele: POST_DATA, index: number) => {
          return {
            ...ele,
            INS_DATE: moment.utc(ele.INS_DATE).format("YYYY-MM-DD HH:mm:ss"),
            UPD_DATE: moment.utc(ele.UPD_DATE).format("YYYY-MM-DD HH:mm:ss"),
            id: index,
          };
        }
      );
      kq = loaded_data;
    } else {
      console.log("fetch error");
    }
  } catch (error) {
    console.log(error);
  }
  return kq;
};
export const f_updatePostData = async (DATA: POST_DATA) => {
  //console.log(DATA)
  let kq: string = "";
  await generalQuery("updatePost", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
};
export const f_deletePostData = async (DATA: POST_DATA) => {
  //console.log(DATA)
  let kq: string = "";
  await generalQuery("deletePost", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
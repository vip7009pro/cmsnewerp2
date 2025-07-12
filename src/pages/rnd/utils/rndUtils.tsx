import { generalQuery } from "../../../api/Api";
import { COMPONENT_DATA } from "../interfaces/rndInterface";

export const f_handleGETBOMAMAZON = async (G_CODE: string) => {
  let kq: COMPONENT_DATA[] = [];
  await generalQuery("getAMAZON_DESIGN", {
    G_CODE: G_CODE,
  })
    .then((response) => {
      ////console.log(response.data);
      if (response.data.tk_status !== "NG") {
        const loadeddata: COMPONENT_DATA[] = response.data.data.map(
          (element: COMPONENT_DATA, index: number) => {
            return {
              ...element,
              id: index,
            };
          }
        );
        ////console.log(loadeddata);
        kq = loadeddata;
      } else {
        //Swal.fire("Thông báo", "Lỗi BOM SX: " + response.data.message, "error");
        kq = [];
      }
    })
    .catch((error) => {
      //console.log(error);
    });
  return kq;
};

export const f_updatePurApp = async (DATA: any) => {
  let kq: boolean = false;
  await generalQuery("updatePurApp", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        kq = true;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};
export const f_updateDtcApp = async (DATA: any) => {
  let kq: boolean = false;
  await generalQuery("updateDtcApp", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        kq = true;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};
export const f_updateRndApp = async (DATA: any) => {
  let kq: boolean = false;
  await generalQuery("updateRndApp", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        kq = true;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};


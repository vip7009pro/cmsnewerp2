import Swal from "sweetalert2";
import { generalQuery } from "../../../api/Api";
import { MAT_DOC_DATA, MRPDATA } from "../interfaces/muaInterface";

export const f_getMaterialDocData = async (filterData: any) => {
  let mat_doc_data: MAT_DOC_DATA[] = [];
  await generalQuery("getMaterialDocData", filterData)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        const loadeddata: MAT_DOC_DATA[] = response.data.data.map(
          (element: MAT_DOC_DATA, index: number) => {
            return {
              ...element,
              id: index,
              REG_DATE: element.REG_DATE?.slice(0, 10) ?? "",
              EXP_DATE: element.EXP_DATE?.slice(0, 10) ?? "",
              PUR_APP_DATE: element.PUR_APP_DATE?.slice(0, 10) ?? "",
              DTC_APP_DATE: element.DTC_APP_DATE?.slice(0, 10) ?? "",
              RND_APP_DATE: element.RND_APP_DATE?.slice(0, 10) ?? "",
              INS_DATE: element.INS_DATE?.slice(0, 10) ?? "",
              UPD_DATE: element.UPD_DATE?.slice(0, 10) ?? "",
            };
          }
        );
        mat_doc_data = loadeddata;
      } else {
        mat_doc_data = [];
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return mat_doc_data;
};
export const f_insertMaterialDocData = async (DATA: any) => {
  let kq: boolean = false;
  await generalQuery("insertMaterialDocData", DATA)
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
export const f_checkDocVersion = async (DATA: any) => {
  let kq: number = 0;
  await generalQuery("checkDocVersion", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        kq = response.data.data[0].VER;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq + 1;
};
export const f_updateMaterialDocData = async (DATA: any) => {
  let kq: boolean = false;
  await generalQuery("updateMaterialDocData", DATA)
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

export const f_autoUpdateDocUSE_YN = async (DATA: any) => {
  let kq: boolean = false;
  await generalQuery("autoUpdateDocUSEYN_EXP", DATA)
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

export const f_loadMRPPlan = async (PLAN_DATE: string) => {
  let kq: MRPDATA[] = [];
  await generalQuery("loadMRPPlan", {
    PLAN_DATE: PLAN_DATE,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        Swal.fire("Thông báo", "Load data thành công", "success");
        let loaded_data: MRPDATA[] = response.data.data.map(
          (element: MRPDATA, index: number) => {
            return {
              ...element,
              id: index,
            };
          }
        );
        kq = loaded_data;
      } else {
        //kq = response.data.message;
        Swal.fire("Thông báo", "Không có data", "error");
      }
    })
    .catch((error) => {});
  return kq;
};

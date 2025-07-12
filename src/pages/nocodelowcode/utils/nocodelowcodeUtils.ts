import Swal from "sweetalert2";
import { generalQuery } from "../../../api/Api";
import { Field, Form } from "../types/types";

export const f_loadFormList = async () => {
  let kq: Form[] = [];
  await generalQuery("loadFormList", {})
    .then((response) => {
      console.log(response.data);
      if (response.data.tk_status !== "NG") {
        Swal.fire("Thông báo", "Load data thành công", "success");
        //console.log(response.data.data);
        let loaded_data: Form[] = response.data.data.map(
          (element: Form, index: number) => {
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
export const f_updateForm = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("updateForm", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_deleteForm = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("deleteForm", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_loadFormDetail = async (DATA: any) => {
  let kq: Form[] = [];
  await generalQuery("loadFormDetail", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_insertForm = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("insertForm", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_loadFieldList = async (DATA: any) => {
  let kq: Field[] = [];
  await generalQuery("loadFieldList", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        kq = response.data.data;
      } else {
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_insertField = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("insertField", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_updateField = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("updateField", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_deleteField = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("deleteField", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_addField = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("addField", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
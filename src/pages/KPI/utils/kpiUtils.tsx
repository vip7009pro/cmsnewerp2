import Swal from "sweetalert2";
import { generalQuery } from "../../../api/Api";
import { KPI_DATA } from "../interfaces/kpiInterface";

export const f_createKPI = async (DATA: KPI_DATA[]) => {
  let kq: string = "";
  await generalQuery("insertKPI", {
    KPI_DATA: DATA,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {
      kq = error.message;
    });
  return kq;
};
export const f_updateKPI = async (DATA: KPI_DATA[]) => {
  let kq: string = "";
  await generalQuery("updateKPI", {
    KPI_DATA: DATA,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {
      kq = error.message;
    });
  return kq;
};
export const f_deleteKPI = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("deleteKPI", {
    KPI_NAME: DATA[0].KPI_NAME,
    KPI_YEAR: DATA[0].KPI_YEAR,
    KPI_PERIOD: DATA[0].KPI_PERIOD,
    KPI_MONTH: DATA[0].KPI_MONTH,
    VALUE_TYPE: DATA[0].VALUE_TYPE,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};

export const f_loadKPI = async (KPI_NAME: string) => {
  let kq: KPI_DATA[] = [];
  await generalQuery("loadKPI", { KPI_NAME: KPI_NAME })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        if (response.data.data.length > 0) {
          kq = response.data.data;
        }
      } else {
        Swal.fire("Thông báo", "Không có KPI", "error");
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_loadKPIList = async () => {
  let kq: { KPI_NAME: string }[] = [];
  await generalQuery("loadKPIList", {})
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        if (response.data.data.length > 0) {
          kq = response.data.data;
        }
      } else {
        Swal.fire("Thông báo", "Không có KPI", "error");
      }
    })
    .catch((error) => {});
  return kq;
};
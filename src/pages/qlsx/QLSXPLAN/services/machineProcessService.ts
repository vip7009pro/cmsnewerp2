import { generalQuery } from "../../../../api/Api";
import {
  MACHINE_LIST,
  PROD_PROCESS_DATA,
  RecentDM,
} from "../interfaces/khsxInterface";

const getRecentDMData = async (G_CODE: string) => {
  let recentDMData: RecentDM[] = [];
  await generalQuery("loadRecentDM", { G_CODE: G_CODE })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        const loadeddata: RecentDM[] = response.data.data.map(
          (element: RecentDM, index: number) => {
            return {
              ...element,
            };
          }
        );
        recentDMData = loadeddata;
      } else {
        recentDMData = [];
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return recentDMData;
};

const getMachineListData = async () => {
  let machineListData: MACHINE_LIST[] = [];
  await generalQuery("getmachinelist", {})
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        const loadeddata: MACHINE_LIST[] = response.data.data.map(
          (element: MACHINE_LIST, index: number) => {
            return {
              ...element,
            };
          }
        );
        loadeddata.push({ EQ_NAME: "NO" }, { EQ_NAME: "NA" }, { EQ_NAME: "ALL" });
        machineListData = loadeddata.sort((a, b) => a.EQ_NAME.localeCompare(b.EQ_NAME));
      } else {
        machineListData = [];
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return machineListData;
};

const loadProdProcessData = async (G_CODE: string) => {
  let kq: PROD_PROCESS_DATA[] = [];
  await generalQuery("loadProdProcessData", {
    G_CODE: G_CODE,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        kq = response.data.data.map((element: PROD_PROCESS_DATA, index: number) => {
          return { ...element, id: index };
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};

/* ── process CRUD (migrated from khsxUtils) ── */

const addProdProcessData = async (DATA: any): Promise<boolean> => {
  let kq: boolean = false;
  await generalQuery("addProdProcessData", DATA)
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

const addProdProcessDataQLSX = async (DATA: any): Promise<boolean> => {
  let kq: boolean = false;
  await generalQuery("addProdProcessDataQLSX", DATA)
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

const updateProdProcessData = async (DATA: any): Promise<boolean> => {
  let kq: boolean = false;
  await generalQuery("updateProdProcessData", DATA)
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

const updateProdProcessDataQLSX = async (DATA: any): Promise<boolean> => {
  let kq: boolean = false;
  await generalQuery("updateProdProcessDataQLSX", DATA)
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

const deleteProdProcessData = async (DATA: any): Promise<boolean> => {
  let kq: boolean = false;
  await generalQuery("deleteProdProcessData", DATA)
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

const checkProcessNumberContinuous = async (
  DATA: PROD_PROCESS_DATA[]
): Promise<boolean> => {
  let kq: boolean = true;
  for (let i = 0; i < DATA.length; i++) {
    if (DATA[i].PROCESS_NUMBER !== i + 1) {
      kq = false;
      break;
    }
  }
  return kq;
};

const checkEQ_SERIES_Exist_In_EQ_SERIES_LIST = async (
  DATA: PROD_PROCESS_DATA[],
  machineList: MACHINE_LIST[]
): Promise<boolean> => {
  let kq: boolean = true;
  for (let i = 0; i < DATA.length; i++) {
    if (
      machineList.find((item) => item.EQ_NAME === DATA[i].EQ_SERIES) ===
      undefined
    ) {
      kq = false;
      break;
    }
  }
  return kq;
};

const deleteProcessNotInCurrentListFromDataBase = async (
  DATA: PROD_PROCESS_DATA[]
): Promise<boolean> => {
  let kq: boolean = false;
  await generalQuery("deleteProcessNotInCurrentListFromDataBase", {
    G_CODE: DATA[0].G_CODE,
    PROCESS_NUMBER_LIST: DATA.map((item) => item.PROCESS_NUMBER).join(","),
  })
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

const checkProcessExist = async (DATA: PROD_PROCESS_DATA): Promise<boolean> => {
  let kq: boolean = false;
  await generalQuery("checkProcessExist", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        kq = response.data.data[0].COUNT_QTY > 0;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  console.log("checkexist", kq);
  return kq;
};

const addProcessDataTotal = async (DATA: PROD_PROCESS_DATA[]): Promise<void> => {
  for (let i = 0; i < DATA.length; i++) {
    if (await checkProcessExist(DATA[i])) {
      await updateProdProcessData(DATA[i]);
    } else {
      await addProdProcessData(DATA[i]);
    }
  }
};

const addProcessDataTotalQLSX = async (DATA: PROD_PROCESS_DATA[]): Promise<void> => {
  for (let i = 0; i < DATA.length; i++) {
    if (await checkProcessExist(DATA[i])) {
      await updateProdProcessDataQLSX(DATA[i]);
    } else {
      await addProdProcessDataQLSX(DATA[i]);
    }
  }
};

export const machineProcessService = {
  getRecentDMData,
  getMachineListData,
  loadProdProcessData,
  addProdProcessData,
  addProdProcessDataQLSX,
  updateProdProcessData,
  updateProdProcessDataQLSX,
  deleteProdProcessData,
  checkProcessNumberContinuous,
  checkEQ_SERIES_Exist_In_EQ_SERIES_LIST,
  deleteProcessNotInCurrentListFromDataBase,
  checkProcessExist,
  addProcessDataTotal,
  addProcessDataTotalQLSX,
};

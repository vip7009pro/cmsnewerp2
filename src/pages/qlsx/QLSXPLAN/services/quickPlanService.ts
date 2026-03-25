import { generalQuery } from "../../../../api/Api";
import { DINHMUC_QSLX, MACHINE_LIST, PROD_PROCESS_DATA } from "../interfaces/khsxInterface";

const loadDMSX = async (G_CODE: string): Promise<DINHMUC_QSLX[]> => {
  let kq: DINHMUC_QSLX[] = [];
  await generalQuery("loadDMSX", {
    G_CODE: G_CODE,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        const loadeddata: DINHMUC_QSLX[] = response.data.data.map(
          (element: DINHMUC_QSLX, index: number) => {
            return {
              ...element,
              id: index,
            };
          }
        );
        kq = loadeddata;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};

const deleteProdProcessData = async (DATA: { G_CODE: string }): Promise<boolean> => {
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

const checkProcessNumberContinuos = async (
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

const checkEQSeriesExistInMachineList = async (
  DATA: PROD_PROCESS_DATA[],
  machineList: MACHINE_LIST[]
): Promise<boolean> => {
  let kq: boolean = true;
  for (let i = 0; i < DATA.length; i++) {
    if (machineList.find((item) => item.EQ_NAME === DATA[i].EQ_SERIES) === undefined) {
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
  return kq;
};

const addProdProcessDataQLSX = async (DATA: PROD_PROCESS_DATA): Promise<boolean> => {
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

const updateProdProcessDataQLSX = async (DATA: PROD_PROCESS_DATA): Promise<boolean> => {
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

export type AddProcessDataTotalQLSXResult = {
  total: number;
  successCount: number;
};

const addProcessDataTotalQLSX = async (
  DATA: PROD_PROCESS_DATA[]
): Promise<AddProcessDataTotalQLSXResult> => {
  let successCount = 0;
  for (let i = 0; i < DATA.length; i++) {
    const existed = await checkProcessExist(DATA[i]);
    const ok = existed
      ? await updateProdProcessDataQLSX(DATA[i])
      : await addProdProcessDataQLSX(DATA[i]);
    if (ok) successCount++;
  }

  return {
    total: DATA.length,
    successCount,
  };
};

export const quickPlanService = {
  loadDMSX,
  deleteProdProcessData,
  checkProcessNumberContinuos,
  checkEQSeriesExistInMachineList,
  deleteProcessNotInCurrentListFromDataBase,
  addProcessDataTotalQLSX,
};

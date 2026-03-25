import { generalQuery } from "../../../../api/Api";
import { EQ_STT } from "../interfaces/khsxInterface";

const loadEQStatus = async (): Promise<{ EQ_SERIES: string[]; EQ_STATUS: EQ_STT[] }> => {
  let eq_status_data: EQ_STT[] = [];
  let eq_series_data: string[] = [];

  await generalQuery("checkEQ_STATUS", {})
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        const loaded_data: EQ_STT[] = response.data.data.map(
          (element: EQ_STT, index: number) => {
            return {
              ...element,
              id: index,
            };
          }
        );
        eq_series_data = [
          ...new Set(
            loaded_data.map((e: EQ_STT) => {
              return e.EQ_SERIES ?? "NA";
            })
          ),
        ];
        eq_status_data = loaded_data;
      } else {
        eq_status_data = [];
        eq_series_data = [];
      }
    })
    .catch((error) => {
      console.log(error);
    });

  return {
    EQ_SERIES: eq_series_data,
    EQ_STATUS: eq_status_data,
  };
};

const toggleMachineActiveStatus = async (
  EQ_CODE: string,
  EQ_ACTIVE: string
): Promise<boolean> => {
  let kq: boolean = false;
  await generalQuery("toggleMachineActiveStatus", {
    EQ_CODE,
    EQ_ACTIVE,
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

export type AddMachinePayload = {
  FACTORY: string;
  EQ_CODE: string;
  EQ_NAME: string;
  EQ_ACTIVE: string;
  EQ_OP: number;
};

const addMachine = async (payload: AddMachinePayload): Promise<boolean> => {
  let kq: boolean = false;
  await generalQuery("addMachine", {
    FACTORY: payload.FACTORY,
    EQ_CODE: payload.EQ_CODE,
    EQ_NAME: payload.EQ_NAME,
    EQ_ACTIVE: payload.EQ_ACTIVE,
    EQ_OP: payload.EQ_OP,
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

const deleteMachine = async (EQ_CODE: string): Promise<boolean> => {
  let kq: boolean = false;
  await generalQuery("deleteMachine", {
    EQ_CODE,
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

export const eqStatusService = {
  loadEQStatus,
  toggleMachineActiveStatus,
  addMachine,
  deleteMachine,
};

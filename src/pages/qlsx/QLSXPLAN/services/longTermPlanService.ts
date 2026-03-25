import moment from "moment";
import { generalQuery } from "../../../../api/Api";
import { LONGTERM_PLAN_DATA } from "../interfaces/khsxInterface";

const deleteLongtermPlan = async (DATA: LONGTERM_PLAN_DATA): Promise<string> => {
  let kq: string = "";
  await generalQuery("deleteLongtermPlan", DATA)
    .then((response) => {
      if (response.data.tk_status === "NG") {
        kq = response.data.message;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};

const updateLongTermPlan = async (DATA: LONGTERM_PLAN_DATA): Promise<string> => {
  let kq: string = "";
  await generalQuery("updateKHSXDAIHAN", DATA)
    .then((response) => {
      if (response.data.tk_status === "NG") {
        kq = response.data.message;
      }
    })
    .catch((error) => {
      kq = error.message;
      console.log(error);
    });
  return kq;
};

const insertLongTermPlan = async (
  DATA: LONGTERM_PLAN_DATA,
  PLAN_DATE: string
): Promise<string> => {
  let kq: string = "";
  let insertData = {
    ...DATA,
    PLAN_DATE: PLAN_DATE,
  };

  await generalQuery("insertKHSXDAIHAN", insertData)
    .then((response) => {
      if (response.data.tk_status === "NG") {
        kq = response.data.message;
      } else {
        updateLongTermPlan(insertData);
      }
    })
    .catch((error) => {
      kq = error.message;
      console.log(error);
    });

  return kq;
};

const moveLongTermPlan = async (
  FROM_DATE: string,
  TO_DATE: string
): Promise<string> => {
  let kq: string = "";
  await generalQuery("moveKHSXDAIHAN", {
    FROM_DATE: FROM_DATE,
    TO_DATE: TO_DATE,
  })
    .then((response) => {
      if (response.data.tk_status === "NG") {
        kq = response.data.message;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};

const deleteNotExistLongTermPlan = async (PLAN_DATE: string): Promise<string> => {
  let kq: string = "";
  await generalQuery("deleteNotExistKHSXDAIHAN", {
    PLAN_DATE: PLAN_DATE,
  })
    .then((response) => {
      if (response.data.tk_status === "NG") {
        kq = response.data.message;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};

const loadLongTermPlan = async (PLAN_DATE: string): Promise<LONGTERM_PLAN_DATA[]> => {
  let kq: LONGTERM_PLAN_DATA[] = [];
  await generalQuery("loadKHSXDAIHAN", {
    PLAN_DATE: PLAN_DATE,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        let loaded_data: LONGTERM_PLAN_DATA[] = [];
        loaded_data = response.data.data.map(
          (element: LONGTERM_PLAN_DATA, index: number) => {
            return {
              ...element,
              PLAN_DATE:
                element.PLAN_DATE !== null
                  ? moment.utc(element.PLAN_DATE).format("YYYY-MM-DD")
                  : "",
              id: index,
            };
          }
        );
        kq = loaded_data;
      }
    })
    .catch((error) => {
      console.log(error);
    });

  return kq;
};

export const longTermPlanService = {
  deleteLongtermPlan,
  insertLongTermPlan,
  updateLongTermPlan,
  moveLongTermPlan,
  deleteNotExistLongTermPlan,
  loadLongTermPlan,
};

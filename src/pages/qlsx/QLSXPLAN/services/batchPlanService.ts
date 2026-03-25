import { generalQuery } from "../../../../api/Api";
import { QLSXPLANDATA } from "../interfaces/khsxInterface";
import { chiThiService } from "./chiThiService";

const checkPlanIDP500 = async (PLAN_ID: string): Promise<boolean> => {
  let kq: boolean = false;
  await generalQuery("checkP500PlanID_mobile", {
    PLAN_ID: PLAN_ID,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        kq = true;
      } else {
        kq = false;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};

const getCurrentDMToSave = async (planData: QLSXPLANDATA) => {
  let NEEDED_QTY: number = planData.PLAN_QTY ?? 0;
  let FINAL_LOSS_SX: number = 0;
  let FINAL_LOSS_KT: number = planData?.LOSS_KT ?? 0;
  let FINAL_LOSS_SETTING: number = 0;
  let PD: number = planData.PD ?? 0;
  let CAVITY: number = planData.CAVITY ?? 0;

  if (planData.PROCESS_NUMBER === 1) {
    FINAL_LOSS_SX =
      (planData.LOSS_SX2 ?? 0) +
      (planData.LOSS_SX3 ?? 0) +
      (planData.LOSS_SX4 ?? 0);
  } else if (planData.PROCESS_NUMBER === 2) {
    FINAL_LOSS_SX = (planData.LOSS_SX3 ?? 0) + (planData.LOSS_SX4 ?? 0);
  } else if (planData.PROCESS_NUMBER === 3) {
    FINAL_LOSS_SX = planData.LOSS_SX4 ?? 0;
  } else if (planData.PROCESS_NUMBER === 4) {
    FINAL_LOSS_SX = 0;
  }

  if (planData.PROCESS_NUMBER === 1) {
    FINAL_LOSS_SETTING =
      (planData.LOSS_SETTING2 ?? 0) +
      (planData.LOSS_SETTING3 ?? 0) +
      (planData.LOSS_SETTING4 ?? 0);
  } else if (planData.PROCESS_NUMBER === 2) {
    FINAL_LOSS_SETTING =
      (planData.LOSS_SETTING3 ?? 0) + (planData.LOSS_SETTING4 ?? 0);
  } else if (planData.PROCESS_NUMBER === 3) {
    FINAL_LOSS_SETTING = planData.LOSS_SETTING4 ?? 0;
  } else if (planData.PROCESS_NUMBER === 4) {
    FINAL_LOSS_SETTING = 0;
  }

  NEEDED_QTY =
    (NEEDED_QTY * (100 + FINAL_LOSS_SX + FINAL_LOSS_KT)) / 100 +
    (FINAL_LOSS_SETTING / PD) * CAVITY * 1000;

  return {
    NEEDED_QTY: planData.PLAN_QTY,
    FINAL_LOSS_SX: FINAL_LOSS_SX,
    FINAL_LOSS_KT: planData.LOSS_KT,
    FINAL_LOSS_SETTING: FINAL_LOSS_SETTING,
  };
};

export type UpdatePlanQLSXPayload = {
  PLAN_ID: string;
  STEP: number;
  PLAN_QTY: number;
  OLD_PLAN_QTY: number;
  PLAN_LEADTIME: number;
  PLAN_EQ: string;
  PLAN_ORDER: string;
  PROCESS_NUMBER: number;
  KETQUASX: number;
  NEXT_PLAN_ID: string;
  IS_SETTING: string;
  NEEDED_QTY: number;
  CURRENT_LOSS_SX: number;
  CURRENT_LOSS_KT: number;
  CURRENT_SETTING_M: number;
};

const updatePlanQLSX = async (planData: UpdatePlanQLSXPayload): Promise<string> => {
  let kq: string = "";
  await generalQuery("updatePlanQLSX", {
    PLAN_ID: planData.PLAN_ID,
    STEP: planData.STEP,
    PLAN_QTY: planData.PLAN_QTY,
    OLD_PLAN_QTY: planData.OLD_PLAN_QTY,
    PLAN_LEADTIME: planData.PLAN_LEADTIME,
    PLAN_EQ: planData.PLAN_EQ,
    PLAN_ORDER: planData.PLAN_ORDER,
    PROCESS_NUMBER: planData.PROCESS_NUMBER,
    KETQUASX: planData.KETQUASX ?? 0,
    NEXT_PLAN_ID: planData.NEXT_PLAN_ID ?? "X",
    IS_SETTING: planData.IS_SETTING?.toUpperCase(),
    NEEDED_QTY: planData.NEEDED_QTY,
    CURRENT_LOSS_SX: planData.CURRENT_LOSS_SX,
    CURRENT_LOSS_KT: planData.CURRENT_LOSS_KT,
    CURRENT_SETTING_M: planData.CURRENT_SETTING_M,
  })
    .then((response) => {
      if (response.data.tk_status === "NG") {
        kq += "_" + response.data.message;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};

const updateBatchPlan = async (planArray: QLSXPLANDATA[]): Promise<string> => {
  let err_code: string = "0";

  for (let i = 0; i < planArray.length; i++) {
    let check_NEXT_PLAN_ID: boolean = true;
    if (planArray[i].NEXT_PLAN_ID !== "X") {
      const nextRow = planArray[i + 1];
      if (nextRow && planArray[i].NEXT_PLAN_ID === nextRow.PLAN_ID) {
        check_NEXT_PLAN_ID = true;
      } else {
        check_NEXT_PLAN_ID = false;
      }
    }

    let checkPlanIdP500: boolean = false;
    checkPlanIdP500 = await checkPlanIDP500(planArray[i].PLAN_ID);

    let { NEEDED_QTY, FINAL_LOSS_SX, FINAL_LOSS_KT, FINAL_LOSS_SETTING } =
      await getCurrentDMToSave(planArray[i]);

    if (
      parseInt(planArray[i].PROCESS_NUMBER.toString()) >= 1 &&
      parseInt(planArray[i].PROCESS_NUMBER.toString()) <= 4 &&
      planArray[i].PLAN_QTY !== 0 &&
      planArray[i].PLAN_QTY <= (planArray[i].CURRENT_SLC ?? 0) &&
      planArray[i].PLAN_ID !== planArray[i].NEXT_PLAN_ID &&
      planArray[i].CHOTBC !== "V" &&
      check_NEXT_PLAN_ID &&
      parseInt(planArray[i].STEP.toString()) >= 0 &&
      parseInt(planArray[i].STEP.toString()) <= 9 &&
      chiThiService.checkEQvsPROCESS(
        planArray[i].EQ1,
        planArray[i].EQ2,
        planArray[i].EQ3,
        planArray[i].EQ4
      ) >= planArray[i].PROCESS_NUMBER &&
      checkPlanIdP500 === false
    ) {
      err_code += await updatePlanQLSX({
        PLAN_ID: planArray[i].PLAN_ID,
        STEP: planArray[i].STEP,
        PLAN_QTY: planArray[i].PLAN_QTY,
        OLD_PLAN_QTY: planArray[i].PLAN_QTY,
        PLAN_LEADTIME: planArray[i].PLAN_LEADTIME,
        PLAN_EQ: planArray[i].PLAN_EQ,
        PLAN_ORDER: planArray[i].PLAN_ORDER,
        PROCESS_NUMBER: planArray[i].PROCESS_NUMBER,
        KETQUASX: planArray[i].KETQUASX ?? 0,
        NEXT_PLAN_ID: planArray[i].NEXT_PLAN_ID ?? "X",
        IS_SETTING: planArray[i].IS_SETTING ?? "Y",
        NEEDED_QTY: NEEDED_QTY,
        CURRENT_LOSS_SX: FINAL_LOSS_SX,
        CURRENT_LOSS_KT: FINAL_LOSS_KT ?? 0,
        CURRENT_SETTING_M: FINAL_LOSS_SETTING ?? 0,
      });
    } else {
      err_code += "_" + (planArray[i].G_NAME_KD ?? "") + ":";
      if (
        !(
          parseInt(planArray[i].PROCESS_NUMBER.toString()) >= 1 &&
          parseInt(planArray[i].PROCESS_NUMBER.toString()) <= 4
        )
      ) {
        err_code += "_: Process number chưa đúng";
      } else if (planArray[i].PLAN_QTY === 0) {
        err_code += "_: Số lượng chỉ thị =0";
      } else if (planArray[i].PLAN_QTY > (planArray[i].CURRENT_SLC ?? 0)) {
        err_code += "_: Số lượng chỉ thị lớn hơn số lượng yêu cầu sx";
      } else if (planArray[i].PLAN_ID === planArray[i].NEXT_PLAN_ID) {
        err_code += "_: NEXT_PLAN_ID không được giống PLAN_ID hiện tại";
      } else if (!check_NEXT_PLAN_ID) {
        err_code += "_: NEXT_PLAN_ID không giống với PLAN_ID ở dòng tiếp theo";
      } else if (planArray[i].CHOTBC === "V") {
        err_code +=
          "_: Chỉ thị đã chốt báo cáo, sẽ ko sửa được, thông tin các chỉ thị khác trong máy được lưu thành công";
      } else if (
        !(
          parseInt(planArray[i].STEP.toString()) >= 0 &&
          parseInt(planArray[i].STEP.toString()) <= 9
        )
      ) {
        err_code += "_: Hãy nhập STEP từ 0 -> 9";
      } else if (
        !(
          parseInt(planArray[i].PROCESS_NUMBER.toString()) >= 1 &&
          parseInt(planArray[i].PROCESS_NUMBER.toString()) <= 4
        )
      ) {
        err_code += "_: Hãy nhập PROCESS NUMBER từ 1 đến 4";
      } else if (checkPlanIdP500) {
        err_code += "_: Đã bắn liệu vào sản xuất, không sửa chỉ thị được";
      }
    }
  }

  return err_code;
};

export const batchPlanService = {
  updateBatchPlan,
};

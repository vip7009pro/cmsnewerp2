import moment from "moment";
import Swal from "sweetalert2";
import { generalQuery, getAuditMode, getCompany, getGlobalSetting } from "../../../../api/Api";
import { WEB_SETTING_DATA } from "../../../../api/GlobalInterface";
import { YCSXTableData } from "../../../kinhdoanh/interfaces/kdInterface";
import { ycsxService } from "../../../kinhdoanh/services/ycsxService";
import { QLSXPLANDATA } from "../interfaces/khsxInterface";
import { chiThiService } from "./chiThiService";

export const PLAN_ID_ARRAY = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
  "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
];

const updatePlanOrder = async (plan_date: string): Promise<boolean> => {
  let ok = false;
  await generalQuery("updatePlanOrder", {
    PLAN_DATE: plan_date,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        ok = true;
      } else {
        Swal.fire("Thông báo", "Update plan order thất bại", "error");
        ok = false;
      }
    })
    .catch((error) => {
      console.log(error);
      ok = false;
    });
  return ok;
};

const loadQLSXPlanData = async (
  plan_date: string,
  machine: string,
  factory: string
): Promise<QLSXPLANDATA[]> => {
  let planData: QLSXPLANDATA[] = [];
  await generalQuery("getqlsxplan2", {
    PLAN_DATE: plan_date,
    MACHINE: machine,
    FACTORY: factory,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        let loadeddata = response.data.data.map(
          (element: QLSXPLANDATA, index: number) => {
            let DU1: number = 0;
            let DU2: number = 0;
            let DU3: number = 0;
            let DU4: number = 0;
            let temp_TCD1: number =
              element.EQ1 === "NO" || element.EQ1 === "NA"
                ? 0
                : (element.SLC_CD1 ?? 0) -
                  element.CD1 -
                  Math.floor(DU1 * (1 - (element.LOSS_SX1 * 1.0) / 100));
            let temp_TCD2: number =
              element.EQ2 === "NO" || element.EQ2 === "NA"
                ? 0
                : (element.SLC_CD2 ?? 0) -
                  element.CD2 -
                  Math.floor(DU2 * (1 - (element.LOSS_SX2 * 1.0) / 100));
            let temp_TCD3: number =
              element.EQ3 === "NO" || element.EQ3 === "NA"
                ? 0
                : (element.SLC_CD3 ?? 0) -
                  element.CD3 -
                  Math.floor(DU3 * (1 - (element.LOSS_SX3 * 1.0) / 100));
            let temp_TCD4: number =
              element.EQ4 === "NO" || element.EQ4 === "NA"
                ? 0
                : (element.SLC_CD4 ?? 0) -
                  element.CD4 -
                  Math.floor(DU4 * (1 - (element.LOSS_SX4 * 1.0) / 100));
            return {
              ...element,
              ORG_LOSS_KT: getCompany() === "CMS" ? element.LOSS_KT : 0,
              LOSS_KT:
                getCompany() === "CMS"
                  ? (element?.LOSS_KT ?? 0) > 5
                    ? 5
                    : element.LOSS_KT ?? 0
                  : 0,
              G_NAME:
                getAuditMode() == 0
                  ? element?.G_NAME
                  : element?.G_NAME?.search("CNDB") == -1
                  ? element?.G_NAME
                  : "TEM_NOI_BO",
              G_NAME_KD:
                getAuditMode() == 0
                  ? element?.G_NAME_KD
                  : element?.G_NAME?.search("CNDB") == -1
                  ? element?.G_NAME_KD
                  : "TEM_NOI_BO",
              PLAN_DATE: moment.utc(element.PLAN_DATE).format("YYYY-MM-DD"),
              EQ_STATUS:
                element.EQ_STATUS === "B"
                  ? "Đang setting"
                  : element.EQ_STATUS === "M"
                  ? "Đang Run"
                  : element.EQ_STATUS === "K"
                  ? "Chạy xong"
                  : element.EQ_STATUS === "K"
                  ? "KTST-KSX"
                  : "Chưa chạy",
              ACHIVEMENT_RATE: (element.KETQUASX / element.PLAN_QTY) * 100,
              SLC_CD1:
                element.EQ1 === "NO" || element.EQ1 === "NA"
                  ? 0
                  : (element.SLC_CD1 ?? 0) -
                    Math.floor(DU1 * (1 - (element.LOSS_SX1 * 1.0) / 100)),
              SLC_CD2:
                element.EQ2 === "NO" || element.EQ2 === "NA"
                  ? 0
                  : (element.SLC_CD2 ?? 0) -
                    Math.floor(DU2 * (1 - (element.LOSS_SX2 * 1.0) / 100)),
              SLC_CD3:
                element.EQ3 === "NO" || element.EQ3 === "NA"
                  ? 0
                  : (element.SLC_CD3 ?? 0) -
                    Math.floor(DU3 * (1 - (element.LOSS_SX3 * 1.0) / 100)),
              SLC_CD4:
                element.EQ4 === "NO" || element.EQ4 === "NA"
                  ? 0
                  : (element.SLC_CD4 ?? 0) -
                    Math.floor(DU4 * (1 - (element.LOSS_SX4 * 1.0) / 100)),
              CD1: element.CD1 ?? 0,
              CD2: element.CD2 ?? 0,
              CD3: element.CD3 ?? 0,
              CD4: element.CD4 ?? 0,
              TON_CD1: element.EQ1 === "NO" || element.EQ1 === "NA" ? 0 : temp_TCD1,
              TON_CD2: element.EQ2 === "NO" || element.EQ2 === "NA" ? 0 : temp_TCD2,
              TON_CD3: element.EQ3 === "NO" || element.EQ3 === "NA" ? 0 : temp_TCD3,
              TON_CD4: element.EQ4 === "NO" || element.EQ4 === "NA" ? 0 : temp_TCD4,
              SETTING_START_TIME:
                element.SETTING_START_TIME === null
                  ? "X"
                  : moment.utc(element.SETTING_START_TIME).format("HH:mm:ss"),
              MASS_START_TIME:
                element.MASS_START_TIME === null
                  ? "X"
                  : moment.utc(element.MASS_START_TIME).format("HH:mm:ss"),
              MASS_END_TIME:
                element.MASS_END_TIME === null
                  ? "X"
                  : moment.utc(element.MASS_END_TIME).format("HH:mm:ss"),
              CURRENT_SLC:
                element.PROCESS_NUMBER === 1
                  ? element.SLC_CD1
                  : element.PROCESS_NUMBER === 2
                  ? element.SLC_CD2
                  : element.PROCESS_NUMBER === 3
                  ? element.SLC_CD3
                  : element.SLC_CD4,
              id: index,
            };
          }
        );
        planData = loadeddata;
      } else {
        planData = [];
      }
    })
    .catch((error) => {
      console.log(error);
    });

  return planData;
};

const loadQLSXPlanData2 = async (
  plan_date: string,
  machine: string,
  factory: string
): Promise<QLSXPLANDATA[]> => {
  let planData: QLSXPLANDATA[] = [];
  await generalQuery("getqlsxplan2_New", {
    PLAN_DATE: plan_date,
    MACHINE: machine,
    FACTORY: factory,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        let loadeddata = response.data.data.map(
          (element: QLSXPLANDATA, index: number) => {
            return {
              ...element,
              ORG_LOSS_KT: getCompany() === "CMS" ? element.LOSS_KT : 0,
              LOSS_KT:
                getCompany() === "CMS"
                  ? (element?.LOSS_KT ?? 0) > 5
                    ? 5
                    : element.LOSS_KT ?? 0
                  : 0,
              G_NAME:
                getAuditMode() == 0
                  ? element?.G_NAME
                  : element?.G_NAME?.search("CNDB") == -1
                  ? element?.G_NAME
                  : "TEM_NOI_BO",
              G_NAME_KD:
                getAuditMode() == 0
                  ? element?.G_NAME_KD
                  : element?.G_NAME?.search("CNDB") == -1
                  ? element?.G_NAME_KD
                  : "TEM_NOI_BO",
              PLAN_DATE: moment.utc(element.PLAN_DATE).format("YYYY-MM-DD"),
              EQ_STATUS:
                element.EQ_STATUS === "B"
                  ? "Đang setting"
                  : element.EQ_STATUS === "M"
                  ? "Đang Run"
                  : element.EQ_STATUS === "K"
                  ? "Chạy xong"
                  : element.EQ_STATUS === "K"
                  ? "KTST-KSX"
                  : "Chưa chạy",
              id: index,
            };
          }
        );
        planData = loadeddata;
      } else {
        planData = [];
      }
    })
    .catch((error) => {
      console.log(error);
    });

  return planData;
};

const updateLossKT_ZTB_DM_HISTORY = async () => {
  await generalQuery("updateLossKT_ZTB_DM_HISTORY", {})
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        console.error("Lỗi update Loss KT ZTB DM History: " + response.data.message);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

/* ── plan API functions (migrated from khsxUtils) ── */

const updatePlanQLSX = async (planData: any) => {
  let kq: string = "";
  await generalQuery("updatePlanQLSX", {
    PLAN_ID: planData.PLAN_ID,
    STEP: planData.STEP,
    PLAN_QTY: planData.PLAN_QTY,
    OLD_PLAN_QTY: planData.PLAN_QTY,
    PLAN_LEADTIME: planData.PLAN_LEADTIME,
    PLAN_EQ: planData.PLAN_EQ,
    PLAN_ORDER: planData.PLAN_ORDER,
    PROCESS_NUMBER: planData.PROCESS_NUMBER,
    KETQUASX: planData.KETQUASX,
    NEXT_PLAN_ID: planData.NEXT_PLAN_ID,
    IS_SETTING: planData.IS_SETTING,
    NEEDED_QTY: planData.NEEDED_QTY,
    CURRENT_LOSS_SX: planData.CURRENT_LOSS_SX,
    CURRENT_LOSS_KT: planData.CURRENT_LOSS_KT,
    CURRENT_SETTING_M: planData.CURRENT_SETTING_M,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        kq = "0";
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};

const getCurrentDMToSave = async (planData: QLSXPLANDATA) => {
  let NEEDED_QTY: number = planData.PLAN_QTY ?? 0,
    FINAL_LOSS_SX: number = 0,
    FINAL_LOSS_KT: number = planData?.LOSS_KT ?? 0,
    FINAL_LOSS_SETTING: number = 0,
    PD: number = planData.PD ?? 0,
    CAVITY: number = planData.CAVITY ?? 0;
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

const saveSinglePlan = async (planToSave: QLSXPLANDATA) => {
  let check_NEXT_PLAN_ID: boolean = true;
  let checkPlanIdP500: boolean = false;
  let err_code: string = "0";
  await generalQuery("checkP500PlanID_mobile", {
    PLAN_ID: planToSave?.PLAN_ID,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        checkPlanIdP500 = true;
      } else {
        checkPlanIdP500 = false;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  let { NEEDED_QTY, FINAL_LOSS_SX, FINAL_LOSS_KT, FINAL_LOSS_SETTING } =
    await getCurrentDMToSave(planToSave);
  if (
    parseInt(planToSave?.PROCESS_NUMBER.toString()) >= 1 &&
    parseInt(planToSave?.PROCESS_NUMBER.toString()) <= 4 &&
    planToSave?.PLAN_QTY !== 0 &&
    planToSave?.PLAN_QTY <= (planToSave?.CURRENT_SLC ?? 0) &&
    planToSave?.PLAN_ID !== planToSave?.NEXT_PLAN_ID &&
    planToSave?.CHOTBC !== "V" &&
    check_NEXT_PLAN_ID &&
    parseInt(planToSave?.STEP.toString()) >= 0 &&
    parseInt(planToSave?.STEP.toString()) <= 9 &&
    chiThiService.checkEQvsPROCESS(
      planToSave?.EQ1 ?? "",
      planToSave?.EQ2 ?? "",
      planToSave?.EQ3 ?? "",
      planToSave?.EQ4 ?? ""
    ) >= planToSave?.PROCESS_NUMBER &&
    checkPlanIdP500 === false
  ) {
    err_code += await updatePlanQLSX({
      PLAN_ID: planToSave?.PLAN_ID,
      STEP: planToSave?.STEP,
      PLAN_QTY: planToSave?.PLAN_QTY,
      OLD_PLAN_QTY: planToSave?.PLAN_QTY,
      PLAN_LEADTIME: planToSave?.PLAN_LEADTIME,
      PLAN_EQ: planToSave?.PLAN_EQ,
      PLAN_ORDER: planToSave?.PLAN_ORDER,
      PROCESS_NUMBER: planToSave?.PROCESS_NUMBER,
      KETQUASX: planToSave?.KETQUASX ?? 0,
      NEXT_PLAN_ID: planToSave?.NEXT_PLAN_ID ?? "X",
      IS_SETTING: planToSave?.IS_SETTING?.toUpperCase(),
      NEEDED_QTY: NEEDED_QTY,
      CURRENT_LOSS_SX: FINAL_LOSS_SX,
      CURRENT_LOSS_KT: FINAL_LOSS_KT,
      CURRENT_SETTING_M: FINAL_LOSS_SETTING,
    });
  } else {
    err_code += "_" + planToSave?.G_NAME_KD + ":";
    if (
      !(
        parseInt(planToSave?.PROCESS_NUMBER.toString()) >= 1 &&
        parseInt(planToSave?.PROCESS_NUMBER.toString()) <= 4
      )
    ) {
      err_code += "_: Process number chưa đúng";
    } else if (planToSave?.PLAN_QTY === 0) {
      err_code += "_: Số lượng chỉ thị =0";
    } else if (planToSave?.PLAN_QTY > (planToSave?.CURRENT_SLC ?? 0)) {
      err_code += "_: Số lượng chỉ thị lớn hơn số lượng yêu cầu sx";
    } else if (planToSave?.PLAN_ID === planToSave?.NEXT_PLAN_ID) {
      err_code += "_: NEXT_PLAN_ID không được giống PLAN_ID hiện tại";
    } else if (!check_NEXT_PLAN_ID) {
      err_code += "_: NEXT_PLAN_ID không giống với PLAN_ID ở dòng tiếp theo";
    } else if (planToSave?.CHOTBC === "V") {
      err_code +=
        "_: Chỉ thị đã chốt báo cáo, sẽ ko sửa được, thông tin các chỉ thị khác trong máy được lưu thành công";
    } else if (
      !(
        parseInt(planToSave?.STEP.toString()) >= 0 &&
        parseInt(planToSave?.STEP.toString()) <= 9
      )
    ) {
      err_code += "_: Hãy nhập STEP từ 0 -> 9";
    } else if (
      !(
        parseInt(planToSave?.PROCESS_NUMBER.toString()) >= 1 &&
        parseInt(planToSave?.PROCESS_NUMBER.toString()) <= 4
      )
    ) {
      err_code += "_: Hãy nhập PROCESS NUMBER từ 1 đến 4";
    } else if (checkPlanIdP500) {
      err_code += "_: Đã bắn liệu vào sản xuất, không sửa chỉ thị được";
    }
  }
  return err_code;
};

const saveQLSX = async (qlsxdata: any) => {
  let isOk: boolean = false;
  await generalQuery("saveQLSX", {
    G_CODE: qlsxdata.G_CODE,
    FACTORY: qlsxdata.FACTORY,
    EQ1: qlsxdata.EQ1,
    EQ2: qlsxdata.EQ2,
    EQ3: qlsxdata.EQ3,
    EQ4: qlsxdata.EQ4,
    Setting1: qlsxdata.Setting1,
    Setting2: qlsxdata.Setting2,
    Setting3: qlsxdata.Setting3,
    Setting4: qlsxdata.Setting4,
    UPH1: qlsxdata.UPH1,
    UPH2: qlsxdata.UPH2,
    UPH3: qlsxdata.UPH3,
    UPH4: qlsxdata.UPH4,
    Step1: qlsxdata.Step1,
    Step2: qlsxdata.Step2,
    Step3: qlsxdata.Step3,
    Step4: qlsxdata.Step4,
    LOSS_SX1: qlsxdata.LOSS_SX1,
    LOSS_SX2: qlsxdata.LOSS_SX2,
    LOSS_SX3: qlsxdata.LOSS_SX3,
    LOSS_SX4: qlsxdata.LOSS_SX4,
    LOSS_SETTING1: qlsxdata.LOSS_SETTING1,
    LOSS_SETTING2: qlsxdata.LOSS_SETTING2,
    LOSS_SETTING3: qlsxdata.LOSS_SETTING3,
    LOSS_SETTING4: qlsxdata.LOSS_SETTING4,
    LOSS_KT: qlsxdata.LOSS_KT,
    NOTE: qlsxdata.NOTE,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        isOk = true;
      } else {
        isOk = false;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return isOk;
};

const deleteQLSXPlan = async (planToDelete: QLSXPLANDATA[]) => {
  let err_code: string = "0";
  if (planToDelete.length > 0) {
    for (let i = 0; i < planToDelete.length; i++) {
      let isOnO302: boolean = false,
        isChotBaoCao: boolean = planToDelete[i].CHOTBC === "V",
        isOnOutKhoAo: boolean = false;
      await generalQuery("checkPLANID_O302", {
        PLAN_ID: planToDelete[i].PLAN_ID,
      })
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            isOnO302 = true;
          }
        })
        .catch((error) => {
          console.log(error);
        });
      await generalQuery("checkPLANID_OUT_KHO_AO", {
        PLAN_ID: planToDelete[i].PLAN_ID,
      })
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            isOnOutKhoAo = true;
          }
        })
        .catch((error) => {
          console.log(error);
        });
      if (!isChotBaoCao && !isOnO302 && !isOnOutKhoAo) {
        generalQuery("deletePlanQLSX", {
          PLAN_ID: planToDelete[i].PLAN_ID,
        })
          .then((response) => {
            if (response.data.tk_status !== "NG") {
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        if (isChotBaoCao) {
          err_code = "Chỉ thị + " + planToDelete[i].PLAN_ID + ":  +đã chốt báo cáo, ko xóa được chỉ thị";
        } else if (isOnO302) {
          err_code = "Chỉ thị + " + planToDelete[i].PLAN_ID + ":  +đã xuất Kho NVL";
        } else if (isOnOutKhoAo) {
          err_code = "Chỉ thị + " + planToDelete[i].PLAN_ID + ":  +đã xuất Kho SX Main";
        }
      }
    }
  } else {
    err_code = "Chọn ít nhất một dòng để xóa";
  }
  return err_code;
};

const getNextPlanOrder = async (
  PLAN_DATE: string,
  PLAN_EQ: string,
  PLAN_FACTORY: string
) => {
  let next_plan_order: number = 1;
  await generalQuery("getLastestPLANORDER", {
    PLAN_DATE: PLAN_DATE,
    PLAN_EQ: PLAN_EQ,
    PLAN_FACTORY: PLAN_FACTORY,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        next_plan_order = response.data.data[0].PLAN_ORDER + 1;
      } else {
        next_plan_order = 1;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return next_plan_order;
};

const getNextPLAN_ID = async (
  PROD_REQUEST_NO: string,
  selectedPlanDate: string,
  selectedMachine: string,
  selectedFactory: string
) => {
  let next_plan_id: string = PROD_REQUEST_NO;
  let next_plan_order: number = 1;
  await generalQuery("getLastestPLAN_ID", {
    PROD_REQUEST_NO: PROD_REQUEST_NO,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        let old_plan_id: string = response.data.data[0].PLAN_ID;
        if (old_plan_id.substring(7, 8) === "Z") {
          if (old_plan_id.substring(3, 4) === "0") {
            next_plan_id =
              old_plan_id.substring(0, 3) +
              "A" +
              old_plan_id.substring(4, 7) +
              "A";
          } else {
            next_plan_id =
              old_plan_id.substring(0, 3) +
              PLAN_ID_ARRAY[PLAN_ID_ARRAY.indexOf(old_plan_id.substring(3, 4)) + 1] +
              old_plan_id.substring(4, 7) +
              "A";
          }
        } else {
          next_plan_id =
            old_plan_id.substring(0, 7) +
            PLAN_ID_ARRAY[PLAN_ID_ARRAY.indexOf(old_plan_id.substring(7, 8)) + 1];
        }
      } else {
        next_plan_id = PROD_REQUEST_NO + "A";
      }
    })
    .catch((error) => {
      console.log(error);
    });
  next_plan_order = await getNextPlanOrder(
    selectedPlanDate,
    selectedMachine,
    selectedFactory
  );
  return { NEXT_PLAN_ID: next_plan_id, NEXT_PLAN_ORDER: next_plan_order };
};

const checkProdReqExistO302 = async (PROD_REQUEST_NO: string) => {
  let check_ycsx_hethongcu: boolean = false;
  await generalQuery("checkProd_request_no_Exist_O302", {
    PROD_REQUEST_NO: PROD_REQUEST_NO,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        if (response.data.data.length > 0) {
          check_ycsx_hethongcu = true;
        } else {
          check_ycsx_hethongcu = false;
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return check_ycsx_hethongcu;
};

const addPLANRaw = async (planData: any) => {
  let err_code: string = "";
  await generalQuery("addPlanQLSX", {
    PLAN_ID: planData.PLAN_ID,
    PLAN_DATE: planData.PLAN_DATE,
    PROD_REQUEST_NO: planData.PROD_REQUEST_NO,
    PLAN_QTY: planData.PLAN_QTY,
    PLAN_EQ: planData.PLAN_EQ,
    PLAN_FACTORY: planData.PLAN_FACTORY,
    PLAN_LEADTIME: planData.PLAN_LEADTIME,
    STEP: planData.STEP,
    PLAN_ORDER: planData.PLAN_ORDER,
    PROCESS_NUMBER: planData.PROCESS_NUMBER,
    G_CODE: planData.G_CODE,
    NEXT_PLAN_ID: planData.NEXT_PLAN_ID,
    IS_SETTING: planData.IS_SETTING,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        err_code = response.data.message;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return err_code;
};

const addQLSXPLAN = async (
  ycsxdatatablefilter: YCSXTableData[],
  selectedPlanDate: string,
  selectedMachine: string,
  selectedFactory: string,
  tempDM?: boolean
) => {
  console.log("tempDM", tempDM);
  let err_code: string = "0";
  const qtyFactor: number =
    parseInt(
      getGlobalSetting()?.filter(
        (ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === "DAILY_TIME"
      )[0]?.CURRENT_VALUE ?? "840"
    ) / 2 / 60;
  if (ycsxdatatablefilter.length >= 1) {
    for (let i = 0; i < ycsxdatatablefilter.length; i++) {
      let check_ycsx_hethongcu: boolean = await checkProdReqExistO302(
        ycsxdatatablefilter[i].PROD_REQUEST_NO ?? ""
      );
      let nextPlan = await getNextPLAN_ID(
        ycsxdatatablefilter[i].PROD_REQUEST_NO ?? "",
        selectedPlanDate,
        selectedMachine,
        selectedFactory
      );
      let NextPlanID = nextPlan.NEXT_PLAN_ID;
      let NextPlanOrder = nextPlan.NEXT_PLAN_ORDER;
      if (check_ycsx_hethongcu === false) {
        let selected_eq: string = selectedMachine.substring(0, 2);
        let proc_number: number =
          selected_eq === ycsxdatatablefilter[i].EQ1
            ? 1
            : selected_eq === ycsxdatatablefilter[i].EQ2
            ? 2
            : selected_eq === ycsxdatatablefilter[i].EQ3
            ? 3
            : selected_eq === ycsxdatatablefilter[i].EQ4
            ? 4
            : 0;
        let UPH1: number = ycsxdatatablefilter[i].UPH1 ?? 999999999;
        let UPH2: number = ycsxdatatablefilter[i].UPH2 ?? 999999999;
        let UPH3: number = ycsxdatatablefilter[i].UPH3 ?? 999999999;
        let UPH4: number = ycsxdatatablefilter[i].UPH4 ?? 999999999;
        let UPH: number =
          proc_number === 1
            ? UPH1
            : proc_number === 2
            ? UPH2
            : proc_number === 3
            ? UPH3
            : proc_number === 4
            ? UPH4
            : 999999999;
        let TON: number =
          proc_number === 1
            ? ycsxdatatablefilter[i].TON_CD1 ?? 0
            : proc_number === 2
            ? ycsxdatatablefilter[i].TON_CD2 ?? 0
            : proc_number === 3
            ? ycsxdatatablefilter[i].TON_CD3 ?? 0
            : proc_number === 4
            ? ycsxdatatablefilter[i].TON_CD4 ?? 0
            : 0;
        if (proc_number === 0 && tempDM === false) {
          err_code += "Không đúng máy trong BOM | ";
        } else {
          err_code += await addPLANRaw({
            PLAN_ID: NextPlanID,
            PLAN_DATE: selectedPlanDate,
            PROD_REQUEST_NO: ycsxdatatablefilter[i].PROD_REQUEST_NO,
            PLAN_QTY:
              getCompany() === "PVN"
                ? TON < 0
                  ? 0
                  : TON
                : TON <= 0
                ? 0
                : TON < UPH * qtyFactor
                ? TON
                : UPH * qtyFactor,
            PLAN_EQ: selectedMachine,
            PLAN_FACTORY: selectedFactory,
            PLAN_LEADTIME: 0,
            STEP: 0,
            PLAN_ORDER: NextPlanOrder,
            PROCESS_NUMBER: proc_number,
            G_CODE: ycsxdatatablefilter[i].G_CODE,
            NEXT_PLAN_ID: "X",
            IS_SETTING: "Y",
          });
        }
      } else {
        err_code +=
          "Yêu cầu sản xuất này đã chạy từ hệ thống cũ, không chạy được lẫn lộn cũ mới, hãy chạy hết bằng hệ thống cũ với yc này | ";
      }
    }
    await ycsxService.updateDMSX_LOSS_KT();
  } else {
    err_code = "Chọn ít nhất 1 YCSX để Add !";
  }
  return err_code;
};

export const planService = {
  updatePlanOrder,
  loadQLSXPlanData,
  loadQLSXPlanData2,
  updateLossKT_ZTB_DM_HISTORY,
  updatePlanQLSX,
  getCurrentDMToSave,
  saveSinglePlan,
  saveQLSX,
  deleteQLSXPlan,
  addQLSXPLAN,
};

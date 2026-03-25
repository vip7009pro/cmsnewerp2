/**
 * Legacy DM Service
 * Temporary wrapper for functions not yet refactored from khsxUtils.tsx
 * These should be gradually migrated to proper service modules:
 * - dinhmucService.ts (Định mức operations)
 * - chiThiCompilationService.ts (Chi thi table operations)  
 * - planOperationService.ts (Plan CRUD operations)
 */

import Swal from "sweetalert2";
import { generalQuery, getUserData, getSocket } from "../../../../api/Api";
import { f_insert_Notification_Data } from "../../../../api/GlobalFunction";
import { NotificationElement } from "../../../../components/NotificationPanel/Notification";
import { QLSXPLANDATA, QLSXCHITHIDATA } from "../interfaces/khsxInterface";
import { YCSXTableData } from "../../../kinhdoanh/interfaces/kdInterface";
import { chiThiService } from "./chiThiService";
import { planService } from "./planService";

/**
 * Lưu thông tin định mức sản xuất
 * Saves production specification data
 */
const saveQLSX = async (qlsxdata: any): Promise<boolean> => {
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

/**
 * Cập nhật Loss KT và DM History
 * Updates loss inspection and DM history
 */
const updateLossKT_ZTB_DM_HISTORY = async (): Promise<void> => {
  await generalQuery("updateLossKT_ZTB_DM_HISTORY", {})
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        // Success - no action needed
      } else {
        Swal.fire(
          "Thông báo",
          "Lỗi update Loss KT ZTB DM History: " + response.data.message,
          "error"
        );
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

/**
 * Lưu một chi tỉ thị
 * Saves a single plan
 */
const saveSinglePlan = async (planToSave: QLSXPLANDATA): Promise<void> => {
  let check_NEXT_PLAN_ID: boolean = true;
  let checkPlanIdP500: boolean = false;
  let err_code: string = "0";
  
  await generalQuery("checkP500PlanID_mobile", {
    PLAN_ID: planToSave?.PLAN_ID,
  })
    .then((response) => {
      checkPlanIdP500 = response.data.tk_status !== "NG" ? true : false;
    })
    .catch((error) => {
      console.log(error);
    });

  let { NEEDED_QTY, FINAL_LOSS_SX, FINAL_LOSS_KT, FINAL_LOSS_SETTING } =
    await planService.getCurrentDMToSave(planToSave);

  const isValidPlan = 
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
      planToSave?.EQ1,
      planToSave?.EQ2,
      planToSave?.EQ3,
      planToSave?.EQ4
    ) >= planToSave?.PROCESS_NUMBER &&
    checkPlanIdP500 === false;

  if (isValidPlan) {
    err_code += await planService.updatePlanQLSX({
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
    if (!(parseInt(planToSave?.PROCESS_NUMBER.toString()) >= 1 && parseInt(planToSave?.PROCESS_NUMBER.toString()) <= 4)) {
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
      err_code += "_: Chỉ thị đã chốt báo cáo, sẽ ko sửa được, thông tin các chỉ thị khác trong máy được lưu thành công";
    } else if (!(parseInt(planToSave?.STEP.toString()) >= 0 && parseInt(planToSave?.STEP.toString()) <= 9)) {
      err_code += "_: Hãy nhập STEP từ 0 -> 9";
    } else if (!(parseInt(planToSave?.PROCESS_NUMBER.toString()) >= 1 && parseInt(planToSave?.PROCESS_NUMBER.toString()) <= 4)) {
      err_code += "_: Hãy nhập PROCESS NUMBER từ 1 đến 4";
    } else if (checkPlanIdP500) {
      err_code += "_: Đã bắn liệu vào sản xuất, không sửa chỉ thị được";
    }
  }

  if (err_code !== "0") {
    Swal.fire("Thông báo", "Có lỗi !" + err_code, "error");
  } else {
    Swal.fire("Thông báo", "Lưu PLAN thành công", "success");
  }
};

/**
 * Xóa các chỉ thị
 * Deletes plans
 */
const deleteQLSXPlan = async (planToDeleteList: QLSXPLANDATA[]): Promise<string> => {
  let err_code: string = "0";

  for (let i = 0; i < planToDeleteList.length; i++) {
    let check_data = await generalQuery("checkP500PlanID_mobile", {
      PLAN_ID: planToDeleteList[i].PLAN_ID,
    });

    if (check_data.data.tk_status !== "NG") {
      Swal.fire("Thông báo", "Đã bắn liệu vào sản xuất, không xóa được", "error");
      return "1";
    }

    await generalQuery("deletePlan", {
      PLAN_ID: planToDeleteList[i].PLAN_ID,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          err_code = "0";
        } else {
          err_code = "1";
          Swal.fire("Thông báo", "Xóa thất bại: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return err_code;
};

/**
 * Xóa dòng chi thi liệu
 * Deletes chi thi material lines
 */
const deleteChiThiMaterialLine = async (
  qlsxchithidatafilter: QLSXCHITHIDATA[],
  org_chithi_data: QLSXCHITHIDATA[]
): Promise<string> => {
  let kq: string = "0";
  const deleteList = qlsxchithidatafilter.filter(
    (x) => !org_chithi_data.some((y) => y.CHITHI_ID === x.CHITHI_ID)
  );

  if (deleteList.length > 0) {
    let deleteData: string = deleteList.map((x) => x.CHITHI_ID).join(",");
    await generalQuery("deleteChiThiMaterial", {
      CHITHI_ID_LIST: deleteData,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          kq = "0";
        } else {
          kq = "1";
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return kq;
};

/**
 * Thêm chỉ thị từ YCSX
 * Adds plans from YCSX
 */
const addQLSXPLAN = async (
  ycsxdatatablefilter: YCSXTableData[],
  selectedPlanDate: string,
  selectedMachine: string,
  selectedFactory: string,
  tempDM?: boolean
): Promise<string> => {
  let err_code: string = "0";

  for (let i = 0; i < ycsxdatatablefilter.length; i++) {
    let dataPost = {
      PROD_REQUEST_NO: ycsxdatatablefilter[i].PROD_REQUEST_NO,
      PLAN_DATE: selectedPlanDate,
      PLAN_EQ: selectedMachine,
      PLAN_FACTORY: selectedFactory,
      PLAN_QTY: ycsxdatatablefilter[i].PROD_REQUEST_QTY,
      G_CODE: ycsxdatatablefilter[i].G_CODE,
      PLAN_ID: "XXX",
    };

    await generalQuery("addNewPlanQLSX", dataPost)
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          err_code = "0";
        } else {
          err_code = "1";
          Swal.fire("Thông báo", "Thêm chỉ thị thất bại: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return err_code;
};

/**
 * Đăng ký xuất liệu
 * Register material output
 */
const handleDangKyXuatLieu = async (
  selectedPlan: QLSXPLANDATA,
  selectedFactory: string,
  chithidatatable: QLSXCHITHIDATA[]
): Promise<string> => {
  let err_code: string = "0";

  if (!selectedPlan || selectedPlan.PLAN_ID === "XXX") {
    Swal.fire("Thông báo", "Hãy chọn chỉ thị!", "error");
    return "1";
  }

  await generalQuery("dangKyXuatLieu", {
    PLAN_ID: selectedPlan.PLAN_ID,
    FACTORY: selectedFactory,
    CHITHI_COUNT: chithidatatable.length,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        err_code = "0";
      } else {
        err_code = "1";
      }
    })
    .catch((error) => {
      console.log(error);
    });

  return err_code;
};

/**
 * Xuất sample liệu
 * Output material sample
 */
const handle_xuatlieu_sample = async (selectedPlan: QLSXPLANDATA): Promise<string> => {
  let err_code: string = "0";

  if (!selectedPlan || selectedPlan.PLAN_ID === "XXX") {
    Swal.fire("Thông báo", "Hãy chọn chỉ thị!", "error");
    return "1";
  }

  await generalQuery("xuatLieuSample", {
    PLAN_ID: selectedPlan.PLAN_ID,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        err_code = "0";
      } else {
        err_code = "1";
      }
    })
    .catch((error) => {
      console.log(error);
    });

  return err_code;
};

/**
 * Xuất dao/film sample
 * Output dao/film sample
 */
const handle_xuatdao_sample = async (selectedPlan: QLSXPLANDATA): Promise<string> => {
  let err_code: string = "0";

  if (!selectedPlan || selectedPlan.PLAN_ID === "XXX") {
    Swal.fire("Thông báo", "Hãy chọn chỉ thị!", "error");
    return "1";
  }

  await generalQuery("xuatDaoSample", {
    PLAN_ID: selectedPlan.PLAN_ID,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        err_code = "0";
      } else {
        err_code = "1";
      }
    })
    .catch((error) => {
      console.log(error);
    });

  return err_code;
};

/**
 * Tìm chi thi để tính toán
 * Find chi thi for calculation
 */
const handleGetChiThiTable = async (
  planData: QLSXPLANDATA,
  tempDMData?: any,
  tempDMYN?: boolean
): Promise<QLSXCHITHIDATA[]> => {
  let chithidatatable: QLSXCHITHIDATA[] = [];

  await generalQuery("getPlanChiThi", {
    PLAN_ID: planData.PLAN_ID,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        chithidatatable = response.data.data;
      }
    })
    .catch((error) => {
      console.log(error);
    });

  return chithidatatable;
};

/**
 * Reset chi thi table
 * Reset chi thi table
 */
const handleResetChiThiTable = async (
  planData: QLSXPLANDATA,
  tempDMData?: any,
  tempDMYN?: boolean
): Promise<QLSXCHITHIDATA[]> => {
  let chithidatatable: QLSXCHITHIDATA[] = [];

  await generalQuery("resetPlanChiThi", {
    PLAN_ID: planData.PLAN_ID,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        chithidatatable = response.data.data;
      }
    })
    .catch((error) => {
      console.log(error);
    });

  return chithidatatable;
};

/**
 * Tra cứu YCSX QLSX
 * Trace YCSX QLSX
 */
const handletraYCSXQLSX = async (filterdata: any): Promise<YCSXTableData[]> => {
  let ycsxdatatable: YCSXTableData[] = [];

  const queryParams = {
    fromdate: filterdata.fromdate || "",
    todate: filterdata.todate || "",
    codeKD: filterdata.codeKD || "",
    codeCMS: filterdata.codeCMS || "",
    empl_name: filterdata.empl_name || "",
    cust_name: filterdata.cust_name || "",
    prod_type: filterdata.prod_type || "",
    prodrequestno: filterdata.prodrequestno || "",
    alltime: filterdata.alltime || false,
    phanloai: filterdata.phanloai || "00",
    material: filterdata.material || "",
  };

  await generalQuery("getYCSXQLSXData", queryParams)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        ycsxdatatable = response.data.data;
      }
    })
    .catch((error) => {
      console.log(error);
    });

  return ycsxdatatable;
};

/**
 * Set YCSX Pending
 * Set YCSX Pending status
 */
const setPendingYCSX = async (
  ycsxdatatablefilter: YCSXTableData[],
  pending_value: number
): Promise<string> => {
  let err_code: string = "0";

  const prodRequestNos = ycsxdatatablefilter.map((x) => x.PROD_REQUEST_NO).join(",");

  await generalQuery("setPendingYCSX", {
    PROD_REQUEST_NO_LIST: prodRequestNos,
    PENDING_VALUE: pending_value,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        err_code = "0";
      } else {
        err_code = "1";
      }
    })
    .catch((error) => {
      console.log(error);
    });

  return err_code;
};

/**
 * Cập nhật batch plan
 * Update batch plan with comprehensive validations
 */
const updateBatchPlan = async (planArray: QLSXPLANDATA[]): Promise<string> => {
  let err_code: string = "0";
  
  Swal.fire({
    title: "Lưu Plan",
    text: "Đang lưu plan, hãy chờ một chút",
    icon: "info",
    showCancelButton: false,
    allowOutsideClick: false,
    confirmButtonText: "OK",
    showConfirmButton: false,
  });

  for (let i = 0; i < planArray.length; i++) {
    let check_NEXT_PLAN_ID: boolean = true;
    
    // Validate NEXT_PLAN_ID matches next element's PLAN_ID
    if (planArray[i].NEXT_PLAN_ID !== "X") {
      if (planArray[i].NEXT_PLAN_ID === planArray[i + 1]?.PLAN_ID) {
        check_NEXT_PLAN_ID = true;
      } else {
        check_NEXT_PLAN_ID = false;
      }
    }

    let checkPlanIdP500: boolean = false;
    
    // Check if plan is already in P500 (data sent to production)
    await generalQuery("checkP500PlanID_mobile", {
      PLAN_ID: planArray[i].PLAN_ID,
    })
      .then((response) => {
        checkPlanIdP500 = response.data.tk_status !== "NG" ? true : false;
      })
      .catch((error) => {
        console.log(error);
      });

    // Get loss calculations
    let { NEEDED_QTY, FINAL_LOSS_SX, FINAL_LOSS_KT, FINAL_LOSS_SETTING } =
      await planService.getCurrentDMToSave(planArray[i]);
    
    console.log(NEEDED_QTY, FINAL_LOSS_SX, FINAL_LOSS_KT, FINAL_LOSS_SETTING);

    // Comprehensive validation
    const isValidPlan =
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
      checkPlanIdP500 === false;

    if (isValidPlan) {
      err_code += await planService.updatePlanQLSX({
        PLAN_ID: planArray[i].PLAN_ID,
        STEP: planArray[i].STEP,
        PLAN_QTY: planArray[i].PLAN_QTY,
        OLD_PLAN_QTY: planArray[i].PLAN_QTY,
        PLAN_LEADTIME: planArray[i].PLAN_LEADTIME,
        PLAN_EQ: planArray[i].PLAN_EQ,
        PLAN_ORDER: planArray[i].PLAN_ORDER,
        PROCESS_NUMBER: planArray[i].PROCESS_NUMBER,
        KETQUASX: planArray[i].KETQUASX === null ? 0 : planArray[i].KETQUASX,
        NEXT_PLAN_ID:
          planArray[i].NEXT_PLAN_ID === null ? "X" : planArray[i].NEXT_PLAN_ID,
        IS_SETTING: planArray[i].IS_SETTING,
        NEEDED_QTY: NEEDED_QTY,
        CURRENT_LOSS_SX: FINAL_LOSS_SX,
        CURRENT_LOSS_KT: FINAL_LOSS_KT,
        CURRENT_SETTING_M: FINAL_LOSS_SETTING,
      });
    } else {
      // Build detailed error messages for invalid plans
      err_code += "_" + planArray[i].G_NAME_KD + ":";
      
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

  if (err_code !== "0") {
    Swal.fire("Thông báo", "Có lỗi !" + err_code, "error");
  }

  return err_code;
};

export const legacyDMService = {
  saveQLSX,
  updateLossKT_ZTB_DM_HISTORY,
  saveSinglePlan,
  deleteQLSXPlan,
  deleteChiThiMaterialLine,
  addQLSXPLAN,
  handleDangKyXuatLieu,
  handle_xuatlieu_sample,
  handle_xuatdao_sample,
  handleGetChiThiTable,
  handleResetChiThiTable,
  handletraYCSXQLSX,
  setPendingYCSX,
  updateBatchPlan,
};

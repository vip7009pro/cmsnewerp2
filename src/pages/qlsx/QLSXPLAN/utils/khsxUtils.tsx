import Swal from "sweetalert2";
import {
  generalQuery,
  getAuditMode,
  getCompany,
  getGlobalSetting,
  getUserData,
} from "../../../../api/Api";
import {
  BTP_AUTO_DATA2,
  BTP_AUTO_DATA_SUMMARY,
  DAILY_YCSX_RESULT,
  DEFECT_PROCESS_DATA,
  DINHMUC_QSLX,
  EQ_STT,
  LEADTIME_DATA,
  LICHSUINPUTLIEU_DATA,
  LICHSUNHAPKHOAO,
  LICHSUXUATKHOAO,
  LONGTERM_PLAN_DATA,
  LOSS_TABLE_DATA,
  MACHINE_LIST,
  PLAN_LOSS_DATA,
  PROD_PLAN_CAPA_DATA,
  PROD_PROCESS_DATA,
  PRODUCTION_EFFICIENCY_DATA,
  QLSXCHITHIDATA,
  QLSXPLANDATA,
  RecentDM,
  SX_ACHIVE_DATA,
  SX_ACHIVE_DATE,
  SX_DATA,
  SX_KPI_NV_DATA,
  SX_LOSS_ROLL_DATA,
  SX_LOSSTIME_BY_EMPL,
  SX_LOSSTIME_REASON_DATA,
  SX_TREND_LOSS_DATA,
  TEMLOTSX_DATA,
  TONLIEUXUONG,
  YCSX_SLC_DATA,
  YCSX_SX_DATA,
} from "../interfaces/khsxInterface";
import moment from "moment";
import { YCSXTableData } from "../../../kinhdoanh/interfaces/kdInterface";
import CHITHI_COMPONENT from "../CHITHI/CHITHI_COMPONENT";
import CHITHI_COMPONENT2 from "../CHITHI/CHITHI_COMPONENT2";
import YCSXComponent from "../../../kinhdoanh/ycsxmanager/YCSXComponent/YCSXComponent";
import DrawComponent from "../../../kinhdoanh/ycsxmanager/DrawComponent/DrawComponent";
import {  
  WEB_SETTING_DATA,
} from "../../../../api/GlobalInterface";
import { checkBP, zeroPad } from "../../../../api/GlobalFunction";
import { f_updateDMSX_LOSS_KT } from "../../../kinhdoanh/utils/kdUtils";
import { BOMSX_DATA, CODE_FULL_INFO } from "../../../rnd/interfaces/rndInterface";
import { CNT_GAP_DATA, TREND_NGUOI_HANG_DATA } from "../../../qc/interfaces/qcInterface";
export const f_loadTiLeDat = async (
  plan_date: string,
  machine: string,
  factory: string
) => {
  //console.log(todate);
  let summaryData: SX_ACHIVE_DATE = {
    id: -1,
    DAY_RATE: 0,
    EQ_NAME: "TOTAL",
    G_NAME_KD: "TOTAL",
    NIGHT_RATE: 0,
    PLAN_DAY: 0,
    PLAN_NIGHT: 0,
    PLAN_TOTAL: 0,
    PROD_REQUEST_NO: "TOTAL",
    RESULT_DAY: 0,
    RESULT_NIGHT: 0,
    RESULT_TOTAL: 0,
    STEP: 0,
    TOTAL_RATE: 0,
  };
  let planDataTable: SX_ACHIVE_DATE[] = [];
  await generalQuery("loadtiledat", {
    PLAN_DATE: plan_date,
    MACHINE: machine,
    FACTORY: factory,
  })
    .then((response) => {
      //console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        let loadeddata: SX_ACHIVE_DATE[] = response.data.data.map(
          (element: SX_ACHIVE_DATE, index: number) => {
            return {
              ...element,
              id: index,
            };
          }
        );
        //console.log(loadeddata);
        let temp_plan_data: SX_ACHIVE_DATE = {
          id: -1,
          DAY_RATE: 0,
          EQ_NAME: "TOTAL",
          G_NAME_KD: "TOTAL",
          NIGHT_RATE: 0,
          PLAN_DAY: 0,
          PLAN_NIGHT: 0,
          PLAN_TOTAL: 0,
          PROD_REQUEST_NO: "TOTAL",
          RESULT_DAY: 0,
          RESULT_NIGHT: 0,
          RESULT_TOTAL: 0,
          STEP: 0,
          TOTAL_RATE: 0,
        };
        for (let i = 0; i < loadeddata.length; i++) {
          temp_plan_data.PLAN_DAY += loadeddata[i].PLAN_DAY;
          temp_plan_data.PLAN_NIGHT += loadeddata[i].PLAN_NIGHT;
          temp_plan_data.PLAN_TOTAL += loadeddata[i].PLAN_TOTAL;
          temp_plan_data.RESULT_DAY += loadeddata[i].RESULT_DAY;
          temp_plan_data.RESULT_NIGHT += loadeddata[i].RESULT_NIGHT;
          temp_plan_data.RESULT_TOTAL += loadeddata[i].RESULT_TOTAL;
        }
        temp_plan_data.DAY_RATE =
          (temp_plan_data.RESULT_DAY / temp_plan_data.PLAN_DAY) * 100;
        temp_plan_data.NIGHT_RATE =
          (temp_plan_data.RESULT_NIGHT / temp_plan_data.PLAN_NIGHT) * 100;
        temp_plan_data.TOTAL_RATE =
          (temp_plan_data.RESULT_TOTAL / temp_plan_data.PLAN_TOTAL) * 100;
        summaryData = temp_plan_data;
        planDataTable = [temp_plan_data, ...loadeddata];
      } else {
        planDataTable = [];
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return { summaryData, planDataTable };
};
export const f_getDataDinhMucGCode = async (G_CODE: string) => {
  let dataDinhMuc: DINHMUC_QSLX = {
    FACTORY: "NM1",
    EQ1: "",
    EQ2: "",
    Setting1: 0,
    Setting2: 0,
    UPH1: 0,
    UPH2: 0,
    Step1: 0,
    Step2: 0,
    LOSS_SX1: 0,
    LOSS_SX2: 0,
    LOSS_SETTING1: 0,
    LOSS_SETTING2: 0,
    NOTE: "",
    EQ3: "",
    EQ4: "",
    Setting3: 0,
    Setting4: 0,
    UPH3: 0,
    UPH4: 0,
    Step3: 0,
    Step4: 0,
    LOSS_SX3: 0,
    LOSS_SX4: 0,
    LOSS_SETTING3: 0,
    LOSS_SETTING4: 0,
    LOSS_KT: 0,
  };
  await generalQuery("getdatadinhmuc_G_CODE", {
    G_CODE: G_CODE,
  })
    .then((response) => {
      //console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        let rowData = response.data.data[0];
        dataDinhMuc = {
          ...dataDinhMuc,
          FACTORY: rowData.FACTORY ?? "NA",
          EQ1: rowData.EQ1 === "" || rowData.EQ1 === null ? "NA" : rowData.EQ1,
          EQ2: rowData.EQ2 === "" || rowData.EQ2 === null ? "NA" : rowData.EQ2,
          Setting1: rowData.Setting1 ?? 0,
          Setting2: rowData.Setting2 ?? 0,
          UPH1: rowData.UPH1 ?? 0,
          UPH2: rowData.UPH2 ?? 0,
          Step1: rowData.Step1 ?? 0,
          Step2: rowData.Step2 ?? 0,
          LOSS_SX1: rowData.LOSS_SX1 ?? 0,
          LOSS_SX2: rowData.LOSS_SX2 ?? 0,
          LOSS_SETTING1: rowData.LOSS_SETTING1 ?? 0,
          LOSS_SETTING2: rowData.LOSS_SETTING2 ?? 0,
          NOTE: rowData.NOTE ?? "",
          EQ3: rowData.EQ3 === "" || rowData.EQ3 === null ? "NA" : rowData.EQ3,
          EQ4: rowData.EQ4 === "" || rowData.EQ4 === null ? "NA" : rowData.EQ4,
          Setting3: rowData.Setting3 ?? 0,
          Setting4: rowData.Setting4 ?? 0,
          UPH3: rowData.UPH3 ?? 0,
          UPH4: rowData.UPH4 ?? 0,
          Step3: rowData.Step3 ?? 0,
          Step4: rowData.Step4 ?? 0,
          LOSS_SX3: rowData.LOSS_SX3 ?? 0,
          LOSS_SX4: rowData.LOSS_SX4 ?? 0,
          LOSS_SETTING3: rowData.LOSS_SETTING3 ?? 0,
          LOSS_SETTING4: rowData.LOSS_SETTING4 ?? 0,
          LOSS_KT: rowData.LOSS_KT ?? 0,
        };
      } else {
        Swal.fire("Thông báo", " Có lỗi : " + response.data.message, "error");
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return dataDinhMuc;
};
export const PLAN_ID_ARRAY = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
//Machine functions
export const f_checkEQvsPROCESS = (
  EQ1: string,
  EQ2: string,
  EQ3: string,
  EQ4: string
) => {
  let maxprocess: number = 0;
  if (["NA", "NO", "", null].indexOf(EQ1) === -1) maxprocess++;
  if (["NA", "NO", "", null].indexOf(EQ2) === -1) maxprocess++;
  if (["NA", "NO", "", null].indexOf(EQ3) === -1) maxprocess++;
  if (["NA", "NO", "", null].indexOf(EQ4) === -1) maxprocess++;
  return maxprocess;
};
export const renderChiThi = (planlist: QLSXPLANDATA[], ref: any) => {
  const company = getCompany();
  return planlist.map((element, index) => (
    <CHITHI_COMPONENT ref={ref} key={index} DATA={element} />
  ));
};
export const renderChiThi2 = (planlist: QLSXPLANDATA[], ref: any) => {
  const company = getCompany();
  return <CHITHI_COMPONENT2 ref={ref} PLAN_LIST={planlist} />;
};
export const renderYCSX = (ycsxlist: YCSXTableData[]) => {
  return ycsxlist.map((element, index) => (
    <YCSXComponent key={index} DATA={element} />
  ));
};
export const renderBanVe = (ycsxlist: YCSXTableData[]) => {
  return ycsxlist.map((element, index) =>
    element.BANVE === "Y" ? (
      <DrawComponent
        key={index}
        G_CODE={element.G_CODE}
        PDBV={element.PDBV}
        PROD_REQUEST_NO={element.PROD_REQUEST_NO}
        PDBV_EMPL={element.PDBV_EMPL}
        PDBV_DATE={element.PDBV_DATE}
      />
    ) : (
      <div>Code: {element.G_NAME} : Không có bản vẽ</div>
    )
  );
};
export const f_getCurrentDMToSave = async (planData: QLSXPLANDATA) => {
  console.log(planData);
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
    NEEDED_QTY: planData.PLAN_QTY /* Math.round(NEEDED_QTY) */,
    FINAL_LOSS_SX: FINAL_LOSS_SX,
    FINAL_LOSS_KT: planData.LOSS_KT,
    FINAL_LOSS_SETTING: FINAL_LOSS_SETTING,
  };
};
export const f_saveSinglePlan = async (planToSave: QLSXPLANDATA) => {
  let check_NEXT_PLAN_ID: boolean = true;
  let checkPlanIdP500: boolean = false;
  let err_code: string = "0";
  await generalQuery("checkP500PlanID_mobile", {
    PLAN_ID: planToSave?.PLAN_ID,
  })
    .then((response) => {
      //console.log(response.data);
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
    await f_getCurrentDMToSave(planToSave);
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
    f_checkEQvsPROCESS(
      planToSave?.EQ1,
      planToSave?.EQ2,
      planToSave?.EQ3,
      planToSave?.EQ4
    ) >= planToSave?.PROCESS_NUMBER &&
    checkPlanIdP500 === false
  ) {
    err_code += await f_updatePlanQLSX({
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
  if (err_code !== "0") {
    Swal.fire("Thông báo", "Có lỗi !" + err_code, "error");
  } else {
    Swal.fire("Thông báo", "Lưu PLAN thành công", "success");
  }
};
export const f_getRecentDMData = async (G_CODE: string) => {
  let recentDMData: RecentDM[] = [];
  await generalQuery("loadRecentDM", { G_CODE: G_CODE })
    .then((response) => {
      //console.log(response.data);
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
        //Swal.fire("Thông báo", "Lỗi BOM SX: " + response.data.message, "error");
        recentDMData = [];
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return recentDMData;
};
export const f_getMachineListData = async () => {
  let machineListData: MACHINE_LIST[] = [];
  await generalQuery("getmachinelist", {})
    .then((response) => {
      //console.log(response.data);
      if (response.data.tk_status !== "NG") {
        const loadeddata: MACHINE_LIST[] = response.data.data.map(
          (element: MACHINE_LIST, index: number) => {
            return {
              ...element,
            };
          }
        );
        loadeddata.push(
          { EQ_NAME: "NO" },
          { EQ_NAME: "NA" },
          { EQ_NAME: "ALL" }
        );
        machineListData = loadeddata.sort((a, b) =>
          a.EQ_NAME.localeCompare(b.EQ_NAME)
        );
      } else {
        //Swal.fire("Thông báo", "Lỗi BOM SX: " + response.data.message, "error");
        machineListData = [];
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return machineListData;
};
export const f_handle_loadEQ_STATUS = async () => {
  let eq_status_data: EQ_STT[] = [];
  let eq_series_data: string[] = [];
  await generalQuery("checkEQ_STATUS", {})
    .then((response) => {
      //console.log(response.data.data);
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
            loaded_data.map((e: EQ_STT, index: number) => {
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
export const f_saveQLSX = async (qlsxdata: any) => {
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
      console.log(response.data.tk_status);
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
export const f_updateLossKT_ZTB_DM_HISTORY = async () => {
  await generalQuery("updateLossKT_ZTB_DM_HISTORY", {})
    .then((response) => {
      if (response.data.tk_status !== "NG") {
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
export const f_updatePlanQLSX = async (planData: any) => {
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
    KETQUASX: planData.KETQUASX ?? 0,
    NEXT_PLAN_ID: planData.NEXT_PLAN_ID ?? "X",
    IS_SETTING: planData.IS_SETTING?.toUpperCase(),
    NEEDED_QTY: planData.NEEDED_QTY,
    CURRENT_LOSS_SX: planData.CURRENT_LOSS_SX,
    CURRENT_LOSS_KT: planData.CURRENT_LOSS_KT,
    CURRENT_SETTING_M: planData.CURRENT_SETTING_M,
  })
    .then((response) => {
      //console.log(response.data.tk_status);
      if (response.data.tk_status !== "NG") {
      } else {
        kq += "_" + response.data.message;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};
export const f_checkPlanIDP500 = async (PLAN_ID: string) => {
  let kq: boolean = false;
  await generalQuery("checkP500PlanID_mobile", {
    PLAN_ID: PLAN_ID,
  })
    .then((response) => {
      //console.log(response.data);
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
export const f_updateBatchPlan = async (planArray: any) => {
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
    if (planArray[i].NEXT_PLAN_ID !== "X") {
      if (planArray[i].NEXT_PLAN_ID === planArray[i + 1].PLAN_ID) {
        check_NEXT_PLAN_ID = true;
      } else {
        check_NEXT_PLAN_ID = false;
      }
    }
    let checkPlanIdP500: boolean = false;
    checkPlanIdP500 = await f_checkPlanIDP500(planArray[i].PLAN_ID);
    let { NEEDED_QTY, FINAL_LOSS_SX, FINAL_LOSS_KT, FINAL_LOSS_SETTING } =
      await f_getCurrentDMToSave(planArray[i]);
    console.log(NEEDED_QTY, FINAL_LOSS_SX, FINAL_LOSS_KT, FINAL_LOSS_SETTING);
    if (
      parseInt(planArray[i].PROCESS_NUMBER.toString()) >= 1 &&
      parseInt(planArray[i].PROCESS_NUMBER.toString()) <= 4 &&
      planArray[i].PLAN_QTY !== 0 &&
      planArray[i].PLAN_QTY <= planArray[i].CURRENT_SLC &&
      planArray[i].PLAN_ID !== planArray[i].NEXT_PLAN_ID &&
      planArray[i].CHOTBC !== "V" &&
      check_NEXT_PLAN_ID &&
      parseInt(planArray[i].STEP.toString()) >= 0 &&
      parseInt(planArray[i].STEP.toString()) <= 9 &&
      f_checkEQvsPROCESS(
        planArray[i].EQ1,
        planArray[i].EQ2,
        planArray[i].EQ3,
        planArray[i].EQ4
      ) >= planArray[i].PROCESS_NUMBER &&
      checkPlanIdP500 === false
    ) {
      err_code += await f_updatePlanQLSX({
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
      } else if (planArray[i].PLAN_QTY > planArray[i].CURRENT_SLC) {
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
export const f_updatePlanOrder = (plan_date: string) => {
  generalQuery("updatePlanOrder", {
    PLAN_DATE: plan_date,
  })
    .then((response) => {
      //console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
      } else {
        Swal.fire("Thông báo", "Update plan order thất bại", "error");
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
export const f_loadQLSXPLANDATA = async (
  plan_date: string,
  machine: string,
  factory: string
) => {
  let planData: QLSXPLANDATA[] = [];
  await generalQuery("getqlsxplan2", {
    PLAN_DATE: plan_date,
    MACHINE: machine,
    FACTORY: factory,
  })
    .then((response) => {
      //console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        let loadeddata = response.data.data.map(
          (element: QLSXPLANDATA, index: number) => {
            /* let DU1: number = element.PROD_REQUEST_QTY * (element.LOSS_SX1*element.LOSS_SX2 + element.LOSS_SX1*element.LOSS_SX3 + element.LOSS_SX1*element.LOSS_SX4 + element.LOSS_SX1*(element.LOSS_KT??0))*1.0/10000;
              let DU2: number = element.PROD_REQUEST_QTY * (element.LOSS_SX2*element.LOSS_SX3 + element.LOSS_SX2*element.LOSS_SX4 + element.LOSS_SX2*(element.LOSS_KT??0))*1.0/10000;
              let DU3: number = element.PROD_REQUEST_QTY * (element.LOSS_SX3*element.LOSS_SX4 + element.LOSS_SX3*(element.LOSS_KT??0))*1.0/10000;
              let DU4: number = element.PROD_REQUEST_QTY * (element.LOSS_SX4*(element.LOSS_KT??0))*1.0/10000; */
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
            /* if (temp_TCD1 < 0) {
                temp_TCD2 = temp_TCD2 - temp_TCD1;
              }
              if (temp_TCD2 < 0) {
                temp_TCD3 = temp_TCD3 - temp_TCD2;
              }
              if (temp_TCD3 < 0) {
                temp_TCD4 = temp_TCD4 - temp_TCD3;
              } */
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
              TON_CD1:
                element.EQ1 === "NO" || element.EQ1 === "NA" ? 0 : temp_TCD1,
              TON_CD2:
                element.EQ2 === "NO" || element.EQ2 === "NA" ? 0 : temp_TCD2,
              TON_CD3:
                element.EQ3 === "NO" || element.EQ3 === "NA" ? 0 : temp_TCD3,
              TON_CD4:
                element.EQ4 === "NO" || element.EQ4 === "NA" ? 0 : temp_TCD4,
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
        //console.log(loadeddata);
        planData = loadeddata;
        f_updatePlanOrder(plan_date);
      } else {
        planData = [];
        Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return planData;
};
export const f_loadQLSXPLANDATA2 = async (
  plan_date: string,
  machine: string,
  factory: string
) => {
  let planData: QLSXPLANDATA[] = [];
  await generalQuery("getqlsxplan2_New", {
    PLAN_DATE: plan_date,
    MACHINE: machine,
    FACTORY: factory,
  })
    .then((response) => {
      //console.log(response.data.data);
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
              ACHIVEMENT_RATE: (element.KETQUASX / element.PLAN_QTY) * 100,
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
        //console.log(loadeddata);
        planData = loadeddata;
        f_updatePlanOrder(plan_date);
        /* Swal.fire({
            title: "Thông báo",
            text: "Load plan thành công",
            icon: "success",
            showCancelButton: false,
            confirmButtonText: "OK",
          });  */
      } else {
        planData = [];
        Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return planData;
};
export const f_getPlanMaterialTable = async (PLAN_ID: string) => {
  let planMaterialTable: QLSXCHITHIDATA[] = [];
  await generalQuery("getchithidatatable", {
    PLAN_ID: PLAN_ID,
  })
    .then((response) => {
      //console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        const loaded_data: QLSXCHITHIDATA[] = response.data.data.map(
          (element: QLSXCHITHIDATA, index: number) => {
            return {
              ...element,
              id: index,
            };
          }
        );
        planMaterialTable = loaded_data;
      } else {
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return planMaterialTable;
};
export const f_getBOMSX = async (G_CODE: string) => {
  let bomsx: BOMSX_DATA[] = [];
  await generalQuery("getbomsx", {
    G_CODE: G_CODE,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        const loaded_data: BOMSX_DATA[] = response.data.data.map(
          (element: BOMSX_DATA, index: number) => {
            return {
              ...element,
              id: index,
            };
          }
        );
        bomsx = loaded_data;
      } else {
        bomsx = [];
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return bomsx;
};
export const f_calcMaterialMet = async (
  PLAN_QTY: number,
  PD: number,
  CAVITY: number,
  PROCESS_NUMBER: number,
  LOSS_SX1: number,
  LOSS_SX2: number,
  LOSS_SX3: number,
  LOSS_SX4: number,
  LOSS_SETTING1: number,
  LOSS_SETTING2: number,
  LOSS_SETTING3: number,
  LOSS_SETTING4: number,
  LOSS_KT: number,
  IS_SETTING: string
) => {
  let FINAL_LOSS_SX: number = 0,
    FINAL_LOSS_SETTING: number = 0,
    M_MET_NEEDED: number = 0;
  let calc_loss_setting: boolean = IS_SETTING === "Y" ? true : false;
  if (PROCESS_NUMBER === 1) {
    FINAL_LOSS_SX = LOSS_SX1 ?? 0;
  } else if (PROCESS_NUMBER === 2) {
    FINAL_LOSS_SX = LOSS_SX2 ?? 0;
  } else if (PROCESS_NUMBER === 3) {
    FINAL_LOSS_SX = LOSS_SX3 ?? 0;
  } else if (PROCESS_NUMBER === 4) {
    FINAL_LOSS_SX = LOSS_SX4 ?? 0;
  }
  if (PROCESS_NUMBER === 1) {
    FINAL_LOSS_SETTING = calc_loss_setting ? LOSS_SETTING1 ?? 0 : 0;
  } else if (PROCESS_NUMBER === 2) {
    FINAL_LOSS_SETTING = calc_loss_setting ? LOSS_SETTING2 ?? 0 : 0;
  } else if (PROCESS_NUMBER === 3) {
    FINAL_LOSS_SETTING = calc_loss_setting ? LOSS_SETTING3 ?? 0 : 0;
  } else if (PROCESS_NUMBER === 4) {
    FINAL_LOSS_SETTING = calc_loss_setting ? LOSS_SETTING4 ?? 0 : 0;
  }
  M_MET_NEEDED =
    ((PLAN_QTY ?? 0) * (PD ?? 0) * 1.0) / ((CAVITY ?? 0) * 1.0) / 1000;
  M_MET_NEEDED =
    M_MET_NEEDED +
    (M_MET_NEEDED * FINAL_LOSS_SX * 1.0) / 100 +
    FINAL_LOSS_SETTING;
  /* console.log('PLAN_QTY', PLAN_QTY);
    console.log('PD', PD);
    console.log('CAVITY', CAVITY);
    console.log('FINAL_LOSS_SX', FINAL_LOSS_SX)
    console.log('FINAL_LOSS_SETTING', FINAL_LOSS_SETTING) */
  return M_MET_NEEDED;
};
export const f_calcMaterialMet_New = async (
  PLAN_QTY: number,
  PD: number,
  CAVITY: number,
  LOSS_KT: number,
  IS_SETTING: string,
  LOSS_SX: number,
  UPH: number,
  LOSS_SETTING: number
) => {
  let M_MET_NEEDED: number = 0;
  let calc_loss_setting: boolean = IS_SETTING === "Y" ? true : false;
  M_MET_NEEDED =
    ((PLAN_QTY ?? 0) * (PD ?? 0) * 1.0) / ((CAVITY ?? 0) * 1.0) / 1000;
  M_MET_NEEDED =
    M_MET_NEEDED +
    (M_MET_NEEDED * LOSS_SX * 1.0) / 100 +
    (calc_loss_setting ? LOSS_SETTING : 0);
  return M_MET_NEEDED;
};
export const f_calcMaterialMet2 = async (
  PLAN_QTY: number,
  PD: number,
  CAVITY: number,
  PROCESS_NUMBER: number,
  LOSS_SX1: number,
  LOSS_SX2: number,
  LOSS_SX3: number,
  LOSS_SX4: number,
  LOSS_SETTING1: number,
  LOSS_SETTING2: number,
  LOSS_SETTING3: number,
  LOSS_SETTING4: number,
  LOSS_KT: number,
  IS_SETTING: string
) => {
  let FINAL_LOSS_SX: number = 0,
    FINAL_LOSS_SETTING: number = 0,
    M_MET_NEEDED: number = 0;
  let calc_loss_setting: boolean = IS_SETTING === "Y" ? true : false;
  if (PROCESS_NUMBER === 1) {
    FINAL_LOSS_SX =
      (LOSS_SX1 ?? 0) +
      (LOSS_SX2 ?? 0) +
      (LOSS_SX3 ?? 0) +
      (LOSS_SX4 ?? 0) +
      (LOSS_KT ?? 0);
  } else if (PROCESS_NUMBER === 2) {
    FINAL_LOSS_SX =
      (LOSS_SX2 ?? 0) + (LOSS_SX3 ?? 0) + (LOSS_SX4 ?? 0) + (LOSS_KT ?? 0);
  } else if (PROCESS_NUMBER === 3) {
    FINAL_LOSS_SX = (LOSS_SX3 ?? 0) + (LOSS_SX4 ?? 0) + (LOSS_KT ?? 0);
  } else if (PROCESS_NUMBER === 4) {
    FINAL_LOSS_SX = (LOSS_SX4 ?? 0) + (LOSS_KT ?? 0);
  }
  if (PROCESS_NUMBER === 1) {
    FINAL_LOSS_SETTING =
      (calc_loss_setting ? LOSS_SETTING1 ?? 0 : 0) +
      (LOSS_SETTING2 ?? 0) +
      (LOSS_SETTING3 ?? 0) +
      (LOSS_SETTING4 ?? 0);
  } else if (PROCESS_NUMBER === 2) {
    FINAL_LOSS_SETTING =
      (LOSS_SETTING2 ?? 0) + (LOSS_SETTING3 ?? 0) + (LOSS_SETTING4 ?? 0);
  } else if (PROCESS_NUMBER === 3) {
    FINAL_LOSS_SETTING = (LOSS_SETTING3 ?? 0) + (LOSS_SETTING4 ?? 0);
  } else if (PROCESS_NUMBER === 4) {
    FINAL_LOSS_SETTING = LOSS_SETTING4 ?? 0;
  }
  M_MET_NEEDED =
    ((PLAN_QTY ?? 0) * (PD ?? 0) * 1.0) / ((CAVITY ?? 0) * 1.0) / 1000;
  M_MET_NEEDED =
    M_MET_NEEDED +
    (M_MET_NEEDED * FINAL_LOSS_SX * 1.0) / 100 +
    FINAL_LOSS_SETTING;
  return M_MET_NEEDED;
};
export const f_handleGetChiThiTable = async (
  planData: QLSXPLANDATA,
  tempDMData?: DINHMUC_QSLX,
  tempDMYN?: boolean
) => {
  let M_MET_NEEDED: number = 0;
  let chiThiDataTable: QLSXCHITHIDATA[] = [];
  chiThiDataTable = await f_getPlanMaterialTable(planData.PLAN_ID);
  if (chiThiDataTable.length > 0) return chiThiDataTable;
  if (tempDMYN !== true) {
    M_MET_NEEDED = await f_calcMaterialMet(
      planData.PLAN_QTY,
      planData.PD ?? 0,
      planData.CAVITY ?? 0,
      planData.PROCESS_NUMBER,
      planData.LOSS_SX1,
      planData.LOSS_SX2,
      planData.LOSS_SX3,
      planData.LOSS_SX4,
      planData.LOSS_SETTING1,
      planData.LOSS_SETTING2,
      planData.LOSS_SETTING3,
      planData.LOSS_SETTING4,
      planData.LOSS_KT ?? 0,
      planData.IS_SETTING ?? "Y"
    );
  } else {
    M_MET_NEEDED = await f_calcMaterialMet(
      planData.PLAN_QTY,
      planData.PD ?? 0,
      planData.CAVITY ?? 0,
      planData.PROCESS_NUMBER,
      tempDMData?.LOSS_SX1 ?? 0,
      tempDMData?.LOSS_SX2 ?? 0,
      tempDMData?.LOSS_SX3 ?? 0,
      tempDMData?.LOSS_SX4 ?? 0,
      tempDMData?.LOSS_SETTING1 ?? 0,
      tempDMData?.LOSS_SETTING2 ?? 0,
      tempDMData?.LOSS_SETTING3 ?? 0,
      tempDMData?.LOSS_SETTING4 ?? 0,
      planData.LOSS_KT ?? 0,
      planData.IS_SETTING ?? "Y"
    );
  }
  let tempBOMSX: BOMSX_DATA[] = await f_getBOMSX(planData.G_CODE);
  chiThiDataTable = tempBOMSX.map((element: BOMSX_DATA, index: number) => {
    let temp_material_table: QLSXCHITHIDATA = {
      CHITHI_ID: "NEW" + index,
      PLAN_ID: planData.PLAN_ID,
      M_CODE: element.M_CODE,
      M_NAME: element.M_NAME,
      WIDTH_CD: element.WIDTH_CD,
      M_ROLL_QTY: 0,
      M_MET_QTY: Math.ceil(M_MET_NEEDED),
      M_QTY: element.M_QTY,
      LIEUQL_SX: element.LIEUQL_SX,
      MAIN_M: element.MAIN_M,
      OUT_KHO_SX: 0,
      OUT_CFM_QTY: 0,
      INS_EMPL: "",
      INS_DATE: "",
      UPD_EMPL: "",
      UPD_DATE: "",
      M_STOCK: element.M_STOCK,
      id: index.toString(),
    };
    return temp_material_table;
  });
  return chiThiDataTable;
};
export const f_handleGetChiThiTable_New = async (
  planData: QLSXPLANDATA,
  processData: PROD_PROCESS_DATA
) => {
  let M_MET_NEEDED: number = 0;
  let chiThiDataTable: QLSXCHITHIDATA[] = [];
  chiThiDataTable = await f_getPlanMaterialTable(planData.PLAN_ID);
  if (chiThiDataTable.length > 0) return chiThiDataTable;
  M_MET_NEEDED = await f_calcMaterialMet_New(
    planData.PLAN_QTY,
    planData.PD ?? 0,
    planData.CAVITY ?? 0,
    planData.LOSS_KT ?? 0,
    planData.IS_SETTING ?? "Y",
    processData.LOSS_SX,
    processData.UPH,
    processData.LOSS_SETTING
  );
  let tempBOMSX: BOMSX_DATA[] = await f_getBOMSX(planData.G_CODE);
  chiThiDataTable = tempBOMSX.map((element: BOMSX_DATA, index: number) => {
    let temp_material_table: QLSXCHITHIDATA = {
      CHITHI_ID: "NEW" + index,
      PLAN_ID: planData.PLAN_ID,
      M_CODE: element.M_CODE,
      M_NAME: element.M_NAME,
      WIDTH_CD: element.WIDTH_CD,
      M_ROLL_QTY: 0,
      M_MET_QTY: Math.ceil(M_MET_NEEDED),
      M_QTY: element.M_QTY,
      LIEUQL_SX: element.LIEUQL_SX,
      MAIN_M: element.MAIN_M,
      OUT_KHO_SX: 0,
      OUT_CFM_QTY: 0,
      INS_EMPL: "",
      INS_DATE: "",
      UPD_EMPL: "",
      UPD_DATE: "",
      M_STOCK: element.M_STOCK,
      id: index.toString(),
    };
    return temp_material_table;
  });
  return chiThiDataTable;
};
export const f_handleGetChiThiTable2 = async (
  planData: QLSXPLANDATA,
  processListData: PROD_PROCESS_DATA[]
) => {
  let M_MET_NEEDED: number = 0;
  let chiThiDataTable: QLSXCHITHIDATA[] = [];
  chiThiDataTable = await f_getPlanMaterialTable(planData.PLAN_ID);
  if (chiThiDataTable.length > 0) return chiThiDataTable;
  M_MET_NEEDED = await f_calcMaterialMet(
    planData.PLAN_QTY,
    planData.PD ?? 0,
    planData.CAVITY ?? 0,
    planData.PROCESS_NUMBER,
    planData.LOSS_SX1,
    planData.LOSS_SX2,
    planData.LOSS_SX3,
    planData.LOSS_SX4,
    planData.LOSS_SETTING1,
    planData.LOSS_SETTING2,
    planData.LOSS_SETTING3,
    planData.LOSS_SETTING4,
    planData.LOSS_KT ?? 0,
    planData.IS_SETTING ?? "Y"
  );
  let tempBOMSX: BOMSX_DATA[] = await f_getBOMSX(planData.G_CODE);
  chiThiDataTable = tempBOMSX.map((element: BOMSX_DATA, index: number) => {
    let temp_material_table: QLSXCHITHIDATA = {
      CHITHI_ID: "NEW" + index,
      PLAN_ID: planData.PLAN_ID,
      M_CODE: element.M_CODE,
      M_NAME: element.M_NAME,
      WIDTH_CD: element.WIDTH_CD,
      M_ROLL_QTY: 0,
      M_MET_QTY: Math.ceil(M_MET_NEEDED),
      M_QTY: element.M_QTY,
      LIEUQL_SX: element.LIEUQL_SX,
      MAIN_M: element.MAIN_M,
      OUT_KHO_SX: 0,
      OUT_CFM_QTY: 0,
      INS_EMPL: "",
      INS_DATE: "",
      UPD_EMPL: "",
      UPD_DATE: "",
      M_STOCK: element.M_STOCK,
      id: index.toString(),
    };
    return temp_material_table;
  });
  return chiThiDataTable;
};
export const f_handleResetChiThiTable = async (
  planData: QLSXPLANDATA,
  tempDMData?: DINHMUC_QSLX,
  tempDMYN?: boolean
) => {
  let M_MET_NEEDED: number = 0;
  let chiThiDataTable: QLSXCHITHIDATA[] = [];
  console.log("tempDMYN", tempDMYN);
  if (tempDMYN !== true) {
    M_MET_NEEDED = await f_calcMaterialMet(
      planData.PLAN_QTY,
      planData.PD ?? 0,
      planData.CAVITY ?? 0,
      planData.PROCESS_NUMBER,
      planData.LOSS_SX1,
      planData.LOSS_SX2,
      planData.LOSS_SX3,
      planData.LOSS_SX4,
      planData.LOSS_SETTING1,
      planData.LOSS_SETTING2,
      planData.LOSS_SETTING3,
      planData.LOSS_SETTING4,
      planData.LOSS_KT ?? 0,
      planData.IS_SETTING ?? "Y"
    );
  } else {
    M_MET_NEEDED = await f_calcMaterialMet(
      planData.PLAN_QTY,
      planData.PD ?? 0,
      planData.CAVITY ?? 0,
      planData.PROCESS_NUMBER,
      tempDMData?.LOSS_SX1 ?? 0,
      tempDMData?.LOSS_SX2 ?? 0,
      tempDMData?.LOSS_SX3 ?? 0,
      tempDMData?.LOSS_SX4 ?? 0,
      tempDMData?.LOSS_SETTING1 ?? 0,
      tempDMData?.LOSS_SETTING2 ?? 0,
      tempDMData?.LOSS_SETTING3 ?? 0,
      tempDMData?.LOSS_SETTING4 ?? 0,
      planData.LOSS_KT ?? 0,
      planData.IS_SETTING ?? "Y"
    );
  }
  let tempBOMSX: BOMSX_DATA[] = await f_getBOMSX(planData.G_CODE);
  chiThiDataTable = tempBOMSX.map((element: BOMSX_DATA, index: number) => {
    let temp_material_table: QLSXCHITHIDATA = {
      CHITHI_ID: "NEW" + index,
      PLAN_ID: planData.PLAN_ID,
      M_CODE: element.M_CODE,
      M_NAME: element.M_NAME,
      WIDTH_CD: element.WIDTH_CD,
      M_ROLL_QTY: 0,
      M_MET_QTY: Math.ceil(M_MET_NEEDED),
      M_QTY: element.M_QTY,
      LIEUQL_SX: element.LIEUQL_SX,
      MAIN_M: element.MAIN_M,
      OUT_KHO_SX: 0,
      OUT_CFM_QTY: 0,
      INS_EMPL: "",
      INS_DATE: "",
      UPD_EMPL: "",
      UPD_DATE: "",
      M_STOCK: element.M_STOCK,
      id: index.toString(),
    };
    return temp_material_table;
  });
  return chiThiDataTable;
};
export const f_handleResetChiThiTable_New = async (
  planData: QLSXPLANDATA,
  processData: PROD_PROCESS_DATA
) => {
  let M_MET_NEEDED: number = 0;
  let chiThiDataTable: QLSXCHITHIDATA[] = [];
  M_MET_NEEDED = await f_calcMaterialMet_New(
    planData.PLAN_QTY,
    planData.PD ?? 0,
    planData.CAVITY ?? 0,
    planData.LOSS_KT ?? 0,
    planData.IS_SETTING ?? "Y",
    processData.LOSS_SX,
    processData.UPH,
    processData.LOSS_SETTING
  );
  let tempBOMSX: BOMSX_DATA[] = await f_getBOMSX(planData.G_CODE);
  chiThiDataTable = tempBOMSX.map((element: BOMSX_DATA, index: number) => {
    let temp_material_table: QLSXCHITHIDATA = {
      CHITHI_ID: "NEW" + index,
      PLAN_ID: planData.PLAN_ID,
      M_CODE: element.M_CODE,
      M_NAME: element.M_NAME,
      WIDTH_CD: element.WIDTH_CD,
      M_ROLL_QTY: 0,
      M_MET_QTY: Math.ceil(M_MET_NEEDED),
      M_QTY: element.M_QTY,
      LIEUQL_SX: element.LIEUQL_SX,
      MAIN_M: element.MAIN_M,
      OUT_KHO_SX: 0,
      OUT_CFM_QTY: 0,
      INS_EMPL: "",
      INS_DATE: "",
      UPD_EMPL: "",
      UPD_DATE: "",
      M_STOCK: element.M_STOCK,
      id: index.toString(),
    };
    return temp_material_table;
  });
  return chiThiDataTable;
};
export const f_saveChiThiMaterialTable = async (
  selectedPlan: QLSXPLANDATA,
  chithidatatable: QLSXCHITHIDATA[]
) => {
  let err_code: string = "0";
  let total_lieuql_sx: number = 0;
  let check_lieuql_sx_sot: number = 0;
  let check_num_lieuql_sx: number = 1;
  let check_lieu_qlsx_khac1: number = 0;
  //console.log(chithidatatable);
  for (let i = 0; i < chithidatatable.length; i++) {
    total_lieuql_sx += chithidatatable[i].LIEUQL_SX;
    if (chithidatatable[i].LIEUQL_SX > 1) check_lieu_qlsx_khac1 += 1;
  }
  for (let i = 0; i < chithidatatable.length; i++) {
    //console.log(chithidatatable[i].LIEUQL_SX);
    if (parseInt(chithidatatable[i].LIEUQL_SX.toString()) === 1) {
      for (let j = 0; j < chithidatatable.length; j++) {
        if (
          chithidatatable[j].M_NAME === chithidatatable[i].M_NAME &&
          parseInt(chithidatatable[j].LIEUQL_SX.toString()) === 0
        ) {
          check_lieuql_sx_sot += 1;
        }
      }
    }
  }
  //console.log('bang chi thi', chithidatatable);
  for (let i = 0; i < chithidatatable.length; i++) {
    if (parseInt(chithidatatable[i].LIEUQL_SX.toString()) === 1) {
      for (let j = 0; j < chithidatatable.length; j++) {
        if (parseInt(chithidatatable[j].LIEUQL_SX.toString()) === 1) {
          //console.log('i', chithidatatable[i].M_NAME);
          //console.log('j', chithidatatable[j].M_NAME);
          if (chithidatatable[i].M_NAME !== chithidatatable[j].M_NAME) {
            check_num_lieuql_sx = 2;
          }
        }
      }
    }
  }
  //console.log('num lieu qlsx: ' + check_num_lieuql_sx);
  //console.log('tong lieu qly: '+ total_lieuql_sx);
  if (
    total_lieuql_sx > 0 &&
    check_lieuql_sx_sot === 0 &&
    check_num_lieuql_sx === 1 &&
    check_lieu_qlsx_khac1 === 0
  ) {
    await generalQuery("deleteMCODEExistIN_O302", {
      //PLAN_ID: qlsxplandatafilter.current[0].PLAN_ID,
      PLAN_ID: selectedPlan?.PLAN_ID,
    })
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
    for (let i = 0; i < chithidatatable.length; i++) {
      await generalQuery("updateLIEUQL_SX_M140", {
        //G_CODE: qlsxplandatafilter.current[0].G_CODE,
        G_CODE: selectedPlan?.G_CODE,
        M_CODE: chithidatatable[i].M_CODE,
        LIEUQL_SX: chithidatatable[i].LIEUQL_SX >= 1 ? 1 : 0,
      })
        .then((response) => {
          //console.log(response.data);
          if (response.data.tk_status !== "NG") {
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });
      if (chithidatatable[i].M_MET_QTY > 0) {
        let checktontaiM_CODE: boolean = false;
        await generalQuery("deleteM_CODE_ZTB_QLSXCHITHI", {
          PLAN_ID: selectedPlan.PLAN_ID,
          M_CODE_LIST: chithidatatable
            .map((x) => "'" + x.M_CODE + "'")
            .join(","),
        })
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
        await generalQuery("checkM_CODE_PLAN_ID_Exist", {
          //PLAN_ID: qlsxplandatafilter.current[0].PLAN_ID,
          PLAN_ID: selectedPlan?.PLAN_ID,
          M_CODE: chithidatatable[i].M_CODE,
        })
          .then((response) => {
            //console.log(response.data);
            if (response.data.tk_status !== "NG") {
              checktontaiM_CODE = true;
            } else {
            }
          })
          .catch((error) => {
            console.log(error);
          });
        //console.log('checktontai',checktontaiM_CODE);
        let m_dang_ky: number = chithidatatable[i].M_MET_QTY;
        if (
          selectedPlan.PROCESS_NUMBER !== 1 &&
          chithidatatable[i].LIEUQL_SX === 1
        ) {
          m_dang_ky = 0;
        }
        if (checktontaiM_CODE) {
          await generalQuery("updateChiThi", {
            PLAN_ID: selectedPlan?.PLAN_ID,
            M_CODE: chithidatatable[i].M_CODE,
            M_ROLL_QTY: chithidatatable[i].M_ROLL_QTY,
            M_MET_QTY: m_dang_ky,
            M_QTY: chithidatatable[i].M_QTY,
            LIEUQL_SX: chithidatatable[i].LIEUQL_SX >= 1 ? 1 : 0,
          })
            .then((response) => {
              //console.log(response.data);
              if (response.data.tk_status !== "NG") {
              } else {
                err_code += "_" + response.data.message;
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          await generalQuery("insertChiThi", {
            //PLAN_ID: qlsxplandatafilter.current[0].PLAN_ID,
            PLAN_ID: selectedPlan?.PLAN_ID,
            M_CODE: chithidatatable[i].M_CODE,
            M_ROLL_QTY: chithidatatable[i].M_ROLL_QTY,
            M_MET_QTY: m_dang_ky,
            M_QTY: chithidatatable[i].M_QTY,
            LIEUQL_SX: chithidatatable[i].LIEUQL_SX,
          })
            .then((response) => {
              //console.log(response.data);
              if (response.data.tk_status !== "NG") {
              } else {
                err_code += "_" + response.data.message;
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      } else {
        err_code += "_" + chithidatatable[i].M_CODE + ": so met = 0";
      }
    }
  } else {
    err_code = "1";
  }
  return err_code;
};
export const f_handletraYCSXQLSX = async (filterdata: any) => {
  console.log("filterdata", filterdata);
  let ycsxdata: YCSXTableData[] = [];
  await generalQuery("traYCSXDataFull_QLSX", {
    alltime: filterdata.alltime,
    start_date: filterdata.start_date,
    end_date: filterdata.end_date,
    cust_name: filterdata.cust_name,
    codeCMS: filterdata.codeCMS,
    codeKD: filterdata.codeKD,
    prod_type: filterdata.prod_type,
    empl_name: filterdata.empl_name,
    phanloai: filterdata.phanloai,
    ycsx_pending: filterdata.ycsx_pending,
    inspect_inputcheck: filterdata.inspect_inputcheck,
    prod_request_no: filterdata.prod_request_no,
    material: filterdata.material,
    material_yes: filterdata.material_yes,
  })
    .then((response) => {
      //console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        //console.log(response.data.data);
        const loadeddata: YCSXTableData[] = response.data.data.map(
          (element: YCSXTableData, index: number) => {
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
            /*  if (temp_TCD1 < 0) {
                 temp_TCD2 = temp_TCD2 - temp_TCD1;
               }
               if (temp_TCD2 < 0) {
                 temp_TCD3 = temp_TCD3 - temp_TCD2;
               }
               if (temp_TCD3 < 0) {
                 temp_TCD4 = temp_TCD4 - temp_TCD3;
               } */
            return {
              ...element,
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
              PO_TDYCSX: element.PO_TDYCSX ?? 0,
              TOTAL_TKHO_TDYCSX: element.TOTAL_TKHO_TDYCSX ?? 0,
              TKHO_TDYCSX: element.TKHO_TDYCSX ?? 0,
              BTP_TDYCSX: element.BTP_TDYCSX ?? 0,
              CK_TDYCSX: element.CK_TDYCSX ?? 0,
              BLOCK_TDYCSX: element.BLOCK_TDYCSX ?? 0,
              FCST_TDYCSX: element.FCST_TDYCSX ?? 0,
              W1: element.W1 ?? 0,
              W2: element.W2 ?? 0,
              W3: element.W3 ?? 0,
              W4: element.W4 ?? 0,
              W5: element.W5 ?? 0,
              W6: element.W6 ?? 0,
              W7: element.W7 ?? 0,
              W8: element.W8 ?? 0,
              PROD_REQUEST_QTY: element.PROD_REQUEST_QTY ?? 0,
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
              TON_CD1:
                element.EQ1 === "NO" || element.EQ1 === "NA" ? 0 : temp_TCD1,
              TON_CD2:
                element.EQ2 === "NO" || element.EQ2 === "NA" ? 0 : temp_TCD2,
              TON_CD3:
                element.EQ3 === "NO" || element.EQ3 === "NA" ? 0 : temp_TCD3,
              TON_CD4:
                element.EQ4 === "NO" || element.EQ4 === "NA" ? 0 : temp_TCD4,
              id: index,
            };
          }
        );
        ycsxdata = loadeddata;
      } else {
        ycsxdata = [];
        console.log("err", response.data.message);
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return ycsxdata;
};
export const f_handletraYCSXQLSX_New = async (filterdata: any) => {
  //console.log(filterdata);
  let ycsxdata: YCSXTableData[] = [];
  await generalQuery("traYCSXDataFull_QLSX_New", {
    alltime: filterdata.alltime,
    start_date: filterdata.start_date,
    end_date: filterdata.end_date,
    cust_name: filterdata.cust_name,
    codeCMS: filterdata.codeCMS,
    codeKD: filterdata.codeKD,
    prod_type: filterdata.prod_type,
    empl_name: filterdata.empl_name,
    phanloai: filterdata.phanloai,
    ycsx_pending: filterdata.ycsx_pending,
    inspect_inputcheck: filterdata.inspect_inputcheck,
    prod_request_no: filterdata.prod_request_no,
    material: filterdata.material,
  })
    .then((response) => {
      //console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        //console.log(response.data.data);
        const loadeddata: YCSXTableData[] = response.data.data.map(
          (element: YCSXTableData, index: number) => {
            return {
              ...element,
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
              PO_TDYCSX: element.PO_TDYCSX ?? 0,
              TOTAL_TKHO_TDYCSX: element.TOTAL_TKHO_TDYCSX ?? 0,
              TKHO_TDYCSX: element.TKHO_TDYCSX ?? 0,
              BTP_TDYCSX: element.BTP_TDYCSX ?? 0,
              CK_TDYCSX: element.CK_TDYCSX ?? 0,
              BLOCK_TDYCSX: element.BLOCK_TDYCSX ?? 0,
              FCST_TDYCSX: element.FCST_TDYCSX ?? 0,
              W1: element.W1 ?? 0,
              W2: element.W2 ?? 0,
              W3: element.W3 ?? 0,
              W4: element.W4 ?? 0,
              W5: element.W5 ?? 0,
              W6: element.W6 ?? 0,
              W7: element.W7 ?? 0,
              W8: element.W8 ?? 0,
              PROD_REQUEST_QTY: element.PROD_REQUEST_QTY ?? 0,
              id: index,
            };
          }
        );
        ycsxdata = loadeddata;
      } else {
        ycsxdata = [];
        console.log("err", response.data.message);
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return ycsxdata;
};
export const f_setPendingYCSX = async (
  ycsxdatatablefilter: YCSXTableData[],
  pending_value: number
) => {
  let err_code: string = "0";
  if (ycsxdatatablefilter.length >= 1) {
    for (let i = 0; i < ycsxdatatablefilter.length; i++) {
      await generalQuery("setpending_ycsx", {
        PROD_REQUEST_NO: ycsxdatatablefilter[i].PROD_REQUEST_NO,
        YCSX_PENDING: pending_value,
      })
        .then((response) => {
          console.log(response.data.tk_status);
          if (response.data.tk_status !== "NG") {
          } else {
            err_code = response.data.message;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  } else {
    err_code = "Chọn ít nhất 1 YCSX để SET !";
  }
  return err_code;
};
export const f_updateDKXLPLAN = async (PLAN_ID: string) => {
  await generalQuery("updateDKXLPLAN", { PLAN_ID: PLAN_ID })
    .then((response) => {
      console.log(response.data);
      if (response.data.tk_status !== "NG") {
      } else {
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
export const f_updateXUATLIEUCHINHPLAN = async (PLAN_ID: string) => {
  await generalQuery("updateXUATLIEUCHINH_PLAN", { PLAN_ID: PLAN_ID })
    .then((response) => {
      console.log(response.data);
      if (response.data.tk_status !== "NG") {
      } else {
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
export const f_updateXUAT_DAO_FILM_PLAN = async (PLAN_ID: string) => {
  await generalQuery("update_XUAT_DAO_FILM_PLAN", { PLAN_ID: PLAN_ID })
    .then((response) => {
      console.log(response.data);
      if (response.data.tk_status !== "NG") {
      } else {
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
export const f_checkPlanIdO300 = async (PLAN_ID: string) => {
  let checkPlanIdO300: boolean = true;
  let NEXT_OUT_DATE: string = moment().format("YYYYMMDD");
  await generalQuery("checkPLANID_O300", { PLAN_ID: PLAN_ID })
    .then((response) => {
      console.log(response.data);
      if (response.data.tk_status !== "NG") {
        checkPlanIdO300 = true;
        NEXT_OUT_DATE = response.data.data[0].OUT_DATE;
      } else {
        checkPlanIdO300 = false;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return { checkPlanIdO300, NEXT_OUT_DATE };
};
export const f_checkPlanIdO301 = async (PLAN_ID: string) => {
  let checkPlanIdO301: boolean = true;
  let Last_O301_OUT_SEQ: number = 0;
  await generalQuery("checkPLANID_O301", { PLAN_ID: PLAN_ID })
    .then((response) => {
      console.log(response.data);
      if (response.data.tk_status !== "NG") {
        Last_O301_OUT_SEQ = parseInt(response.data.data[0].OUT_SEQ);
      } else {
        checkPlanIdO301 = false;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return { checkPlanIdO301, Last_O301_OUT_SEQ };
};
export const f_getO300_LAST_OUT_NO = async () => {
  let LAST_OUT_NO: string = "001";
  await generalQuery("getO300_LAST_OUT_NO", {})
    .then((response) => {
      console.log(response.data);
      LAST_OUT_NO = zeroPad(parseInt(response.data.data[0].OUT_NO) + 1, 3);
    })
    .catch((error) => {
      console.log(error);
    });
  return LAST_OUT_NO;
};
export const f_getP400 = async (
  PROD_REQUEST_NO: string,
  PROD_REQUEST_DATE: string
) => {
  let P400: Array<any> = [];
  await generalQuery("getP400", {
    PROD_REQUEST_NO: PROD_REQUEST_NO,
    PROD_REQUEST_DATE: PROD_REQUEST_DATE,
  })
    .then((response) => {
      console.log(response.data);
      P400 = response.data.data;
    })
    .catch((error) => {
      console.log(error);
    });
  return P400;
};
export const f_insertO300 = async (DATA: any) => {
  await generalQuery("insertO300", {
    OUT_DATE: DATA.OUT_DATE,
    OUT_NO: DATA.OUT_NO,
    CODE_03: DATA.CODE_03,
    CODE_52: DATA.CODE_52,
    CODE_50: DATA.CODE_50,
    USE_YN: DATA.USE_YN,
    PROD_REQUEST_DATE: DATA.PROD_REQUEST_DATE,
    PROD_REQUEST_NO: DATA.PROD_REQUEST_NO,
    FACTORY: DATA.FACTORY,
    PLAN_ID: DATA.PLAN_ID,
  })
    .then((response) => {
      //console.log(response.data);
      if (response.data.tk_status !== "NG") {
      } else {
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
export const f_getO300_OUT_NO = async (PLAN_ID: string) => {
  let O300_OUT_NO: string = "001";
  await generalQuery("getO300_ROW", { PLAN_ID: PLAN_ID })
    .then((response) => {
      console.log(response.data);
      if (response.data.data.length > 0) {
        O300_OUT_NO = response.data.data[0].OUT_NO;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return O300_OUT_NO;
};
export const f_deleteM_CODE_O301 = async (
  PLAN_ID: string,
  M_CODE_LIST: string
) => {
  await generalQuery("deleteM_CODE_O301", {
    PLAN_ID: PLAN_ID,
    M_CODE_LIST: M_CODE_LIST,
  })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};
export const f_checkM_CODE_PLAN_ID_Exist_in_O301 = async (
  PLAN_ID: string,
  M_CODE: string
) => {
  let TonTaiM_CODE_O301: boolean = false;
  await generalQuery("checkM_CODE_PLAN_ID_Exist_in_O301", {
    PLAN_ID: PLAN_ID,
    M_CODE: M_CODE,
  })
    .then((response) => {
      console.log(response.data);
      if (response.data.tk_status !== "NG") {
        TonTaiM_CODE_O301 = true;
      } else {
        TonTaiM_CODE_O301 = false;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return TonTaiM_CODE_O301;
};
export const f_insertO301 = async (DATA: any) => {
  await generalQuery("insertO301", {
    OUT_DATE: DATA.OUT_DATE,
    OUT_NO: DATA.OUT_NO,
    CODE_03: DATA.CODE_03,
    OUT_SEQ: DATA.OUT_SEQ,
    USE_YN: "Y",
    M_CODE: DATA.M_CODE,
    OUT_PRE_QTY: DATA.OUT_PRE_QTY,
    PLAN_ID: DATA.PLAN_ID,
    G_CODE: DATA.G_CODE,
  })
    .then((response) => {
      //console.log(response.data);
      if (response.data.tk_status !== "NG") {
      } else {
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
export const f_updateO301 = async (DATA: any) => {
  await generalQuery("updateO301", {
    M_CODE: DATA.M_CODE,
    OUT_PRE_QTY: DATA.OUT_PRE_QTY,
    PLAN_ID: DATA.PLAN_ID,
  })
    .then((response) => {
      console.log(response.data);
      if (response.data.tk_status !== "NG") {
      } else {
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
export const f_handleDangKyXuatLieu = async (
  selectedPlan: QLSXPLANDATA,
  selectedFactory: string,
  chithidatatable: QLSXCHITHIDATA[]
) => {
  let err_code: string = "0";
  let NEXT_OUT_NO: string = "001";
  if (chithidatatable.length <= 0) {
    err_code = "Chọn ít nhất một liệu để đăng ký";
    return err_code;
  }
  let { checkPlanIdO300, NEXT_OUT_DATE } = await f_checkPlanIdO300(
    selectedPlan.PLAN_ID
  );
  if (!checkPlanIdO300) {
    NEXT_OUT_NO = await f_getO300_LAST_OUT_NO();
    // get code_50 phan loai giao hang GC, SK, KD
    let CODE_50: string = "";
    const p400Data = await f_getP400(
      selectedPlan.PROD_REQUEST_NO,
      selectedPlan.PROD_REQUEST_DATE
    );
    if (p400Data.length > 0) {
      CODE_50 = p400Data[0].CODE_50;
    }
    if (CODE_50 === "") {
      err_code = "Không tìm thấy mã phân loại giao hàng";
      return err_code;
    }
    await f_insertO300({
      OUT_DATE: NEXT_OUT_DATE,
      OUT_NO: NEXT_OUT_NO,
      CODE_03: "01",
      CODE_52: "01",
      CODE_50: CODE_50,
      USE_YN: "Y",
      PROD_REQUEST_DATE: selectedPlan.PROD_REQUEST_DATE,
      PROD_REQUEST_NO: selectedPlan.PROD_REQUEST_NO,
      FACTORY: selectedFactory,
      PLAN_ID: selectedPlan.PLAN_ID,
    });
  } else {
    NEXT_OUT_NO = await f_getO300_OUT_NO(selectedPlan.PLAN_ID);
  }
  let checkchithimettotal: number = 0;
  for (let i = 0; i < chithidatatable.length; i++) {
    checkchithimettotal += chithidatatable[i].M_MET_QTY;
  }
  if (checkchithimettotal <= 0) {
    err_code = "Tổng số liệu phải lớn hơn 0";
    return err_code;
  }
  //delete all M_CODE in O301 which not exist in chithidatatable
  let M_CODE_LIST: string = chithidatatable
    .map((x) => "'" + x.M_CODE + "'")
    .join(",");
  await f_deleteM_CODE_O301(selectedPlan.PLAN_ID, M_CODE_LIST);
  for (let i = 0; i < chithidatatable.length; i++) {
    if (chithidatatable[i].M_MET_QTY > 0) {
      //console.log("M_MET", chithidatatable[i].M_MET_QTY);
      let TonTaiM_CODE_O301: boolean =
        await f_checkM_CODE_PLAN_ID_Exist_in_O301(
          selectedPlan.PLAN_ID,
          chithidatatable[i].M_CODE
        );
      if (chithidatatable[i].LIEUQL_SX === 1) {
        await f_updateDKXLPLAN(chithidatatable[i].PLAN_ID);
      }
      let met_dang_ky: number =
        chithidatatable[i].M_MET_QTY * chithidatatable[i].M_QTY;
      if (
        selectedPlan.PROCESS_NUMBER !== 1 &&
        chithidatatable[i].LIEUQL_SX === 1
      ) {
        met_dang_ky = 0;
      }
      if (!TonTaiM_CODE_O301) {
        //console.log("Next Out NO", NEXT_OUT_NO);
        let { checkPlanIdO301, Last_O301_OUT_SEQ } = await f_checkPlanIdO301(
          selectedPlan.PLAN_ID
        );
        //console.log("outseq", Last_O301_OUT_SEQ);
        await f_insertO301({
          OUT_DATE: NEXT_OUT_DATE,
          OUT_NO: NEXT_OUT_NO,
          CODE_03: "01",
          OUT_SEQ: zeroPad(Last_O301_OUT_SEQ + i + 1, 3),
          USE_YN: "Y",
          M_CODE: chithidatatable[i].M_CODE,
          OUT_PRE_QTY: met_dang_ky,
          PLAN_ID: selectedPlan.PLAN_ID,
          G_CODE: selectedPlan.G_CODE,
        });
      } else {
        await f_updateO301({
          M_CODE: chithidatatable[i].M_CODE,
          OUT_PRE_QTY: met_dang_ky,
          PLAN_ID: selectedPlan.PLAN_ID,
        });
      }
    }
  }
  return err_code;
};
export const f_deleteQLSXPlan = async (planToDelete: QLSXPLANDATA[]) => {
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
          //console.log(response.data);
          if (response.data.tk_status !== "NG") {
            isOnO302 = true;
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });
      await generalQuery("checkPLANID_OUT_KHO_AO", {
        PLAN_ID: planToDelete[i].PLAN_ID,
      })
        .then((response) => {
          //console.log(response.data);
          if (response.data.tk_status !== "NG") {
            isOnOutKhoAo = true;
          } else {
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
            //console.log(response.data);
            if (response.data.tk_status !== "NG") {
            } else {
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        if (isChotBaoCao) {
          err_code =
            "Chỉ thị + " +
            planToDelete[i].PLAN_ID +
            ":  +đã chốt báo cáo, ko xóa được chỉ thị";
        } else if (isOnO302) {
          err_code =
            "Chỉ thị + " + planToDelete[i].PLAN_ID + ":  +đã xuất Kho NVL";
        } else if (isOnOutKhoAo) {
          err_code =
            "Chỉ thị + " + planToDelete[i].PLAN_ID + ":  +đã xuất Kho SX Main";
        }
      }
    }
  } else {
    err_code = "Chọn ít nhất một dòng để xóa";
  }
  return err_code;
};
export const f_deleteChiThiMaterialLine = async (
  qlsxchithidatafilter: QLSXCHITHIDATA[],
  org_chithi_data: QLSXCHITHIDATA[]
) => {
  let kq: QLSXCHITHIDATA[] = [];
  if (qlsxchithidatafilter.length > 0) {
    let datafilter = [...org_chithi_data];
    for (let i = 0; i < qlsxchithidatafilter.length; i++) {
      for (let j = 0; j < datafilter.length; j++) {
        if (qlsxchithidatafilter[i].CHITHI_ID === datafilter[j].CHITHI_ID) {
          datafilter.splice(j, 1);
        }
      }
    }
    kq = datafilter;
  } else {
    kq = [...org_chithi_data];
    Swal.fire("Thông báo", "Chọn ít nhất một dòng để xóa", "error");
  }
  return kq;
};
export const f_getNextPlanOrder = async (
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
      //console.log(response.data.tk_status);
      if (response.data.tk_status !== "NG") {
        //console.log(response.data.data[0].PLAN_ID);
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
export const f_getNextPLAN_ID = async (
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
      //console.log(response.data.tk_status);
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
              PLAN_ID_ARRAY[
                PLAN_ID_ARRAY.indexOf(old_plan_id.substring(3, 4)) + 1
              ] +
              old_plan_id.substring(4, 7) +
              "A";
          }
        } else {
          next_plan_id =
            old_plan_id.substring(0, 7) +
            PLAN_ID_ARRAY[
              PLAN_ID_ARRAY.indexOf(old_plan_id.substring(7, 8)) + 1
            ];
        }
      } else {
        next_plan_id = PROD_REQUEST_NO + "A";
      }
    })
    .catch((error) => {
      console.log(error);
    });
  next_plan_order = await f_getNextPlanOrder(
    selectedPlanDate,
    selectedMachine,
    selectedFactory
  );
  return { NEXT_PLAN_ID: next_plan_id, NEXT_PLAN_ORDER: next_plan_order };
};
export const f_checkProdReqExistO302 = async (PROD_REQUEST_NO: string) => {
  let check_ycsx_hethongcu: boolean = false;
  await generalQuery("checkProd_request_no_Exist_O302", {
    PROD_REQUEST_NO: PROD_REQUEST_NO,
  })
    .then((response) => {
      //console.log(response.data.tk_status);
      if (response.data.tk_status !== "NG") {
        //console.log(response.data.data[0].PLAN_ID);
        if (response.data.data.length > 0) {
          check_ycsx_hethongcu = true;
        } else {
          check_ycsx_hethongcu = false;
        }
      } else {
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return check_ycsx_hethongcu;
};
export const f_addPLANRaw = async (planData: any) => {
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
      console.log(response.data.tk_status);
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
export const f_addQLSXPLAN = async (
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
    ) /
    2 /
    60;
  if (ycsxdatatablefilter.length >= 1) {
    for (let i = 0; i < ycsxdatatablefilter.length; i++) {
      let check_ycsx_hethongcu: boolean = await f_checkProdReqExistO302(
        ycsxdatatablefilter[i].PROD_REQUEST_NO
      );
      let nextPlan = await f_getNextPLAN_ID(
        ycsxdatatablefilter[i].PROD_REQUEST_NO,
        selectedPlanDate,
        selectedMachine,
        selectedFactory
      );
      let NextPlanID = nextPlan.NEXT_PLAN_ID;
      let NextPlanOrder = nextPlan.NEXT_PLAN_ORDER;
      if (check_ycsx_hethongcu === false) {
        //console.log(selectedMachine.substring(0,2));
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
          err_code += await f_addPLANRaw({
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
    await f_updateDMSX_LOSS_KT();
  } else {
    err_code = "Chọn ít nhất 1 YCSX để Add !";
  }
  return err_code;
};
export const f_handle_xuatlieu_sample = async (selectedPlan: QLSXPLANDATA) => {
  let err_code: string = "0";
  if (selectedPlan.PLAN_ID !== "XXX") {
    let prod_request_no: string =
      selectedPlan?.PROD_REQUEST_NO === undefined
        ? "xxx"
        : selectedPlan?.PROD_REQUEST_NO;
    let check_ycsx_sample: boolean = false;
    let checkPLANID_EXIST_OUT_KHO_SX: boolean = false;
    await generalQuery("getP4002", { PROD_REQUEST_NO: prod_request_no })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);
          let loadeddata = response.data.data.map(
            (element: any, index: number) => {
              return {
                ...element,
                id: index,
              };
            }
          );
          if (loadeddata[0].CODE_55 === "04") {
            check_ycsx_sample = true;
          } else {
            check_ycsx_sample = false;
          }
        } else {
          check_ycsx_sample = false;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    //console.log('check ycsx sample', check_ycsx_sample);
    await generalQuery("check_PLAN_ID_KHO_AO", {
      PLAN_ID: selectedPlan?.PLAN_ID,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          console.log(response.data.data);
          if (response.data.data.length > 0) {
            checkPLANID_EXIST_OUT_KHO_SX = true;
          } else {
            checkPLANID_EXIST_OUT_KHO_SX = false;
          }
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
    //console.log('check ton tai out kho ao',checkPLANID_EXIST_OUT_KHO_SX );
    if (check_ycsx_sample) {
      if (checkPLANID_EXIST_OUT_KHO_SX === false) {
        //nhap kho ao
        await f_nhapkhoao({
          FACTORY: selectedPlan.PLAN_FACTORY,
          PHANLOAI: "N",
          PLAN_ID_INPUT: selectedPlan?.PLAN_ID,
          PLAN_ID_SUDUNG: selectedPlan?.PLAN_ID,
          M_CODE: "A0009680",
          M_LOT_NO: "2201010001",
          ROLL_QTY: 1,
          IN_QTY: 1,
          TOTAL_IN_QTY: 1,
          USE_YN: "O",
          FSC: "N",
          FSC_MCODE: "N",
          FSC_GCODE: "N",
        });
        //xuat kho ao
        let kq_xuatkhoao = await f_xuatkhoao({
          FACTORY: selectedPlan.PLAN_FACTORY,
          PHANLOAI: "N",
          PLAN_ID_INPUT: selectedPlan?.PLAN_ID,
          PLAN_ID_OUTPUT: selectedPlan?.PLAN_ID,
          M_CODE: "A0009680",
          M_LOT_NO: "2201010001",
          ROLL_QTY: 1,
          OUT_QTY: 1,
          TOTAL_OUT_QTY: 1,
          USE_YN: "O",
          REMARK: "WEB_OUT",
        });
        if (kq_xuatkhoao) {
          f_updateXUATLIEUCHINHPLAN(
            selectedPlan?.PLAN_ID === undefined ? "xxx" : selectedPlan?.PLAN_ID
          );
        }
        Swal.fire("Thông báo", "Đã xuất liệu ảo thành công", "info");
      } else {
        f_updateXUATLIEUCHINHPLAN(
          selectedPlan?.PLAN_ID === undefined ? "xxx" : selectedPlan?.PLAN_ID
        );
        err_code = "Đã xuất liệu chính rồi";
        Swal.fire("Thông báo", "Đã xuất liệu chính rồi", "info");
      }
    } else {
      err_code = "Đây không phải ycsx sample";
      Swal.fire("Thông báo", "Đây không phải ycsx sample", "info");
    }
  } else {
    err_code = "Hãy chọn ít nhất 1 chỉ thị";
    Swal.fire("Thông báo", "Hãy chọn ít nhất 1 chỉ thị", "error");
  }
  return err_code;
};
export const f_handle_xuatdao_sample = async (selectedPlan: QLSXPLANDATA) => {
  let err_code: string = "0";
  if (selectedPlan.PLAN_ID !== "XXX") {
    let prod_request_no: string =
      selectedPlan?.PROD_REQUEST_NO === undefined
        ? "xxx"
        : selectedPlan?.PROD_REQUEST_NO;
    let check_ycsx_sample: boolean = false;
    let checkPLANID_EXIST_OUT_KNIFE_FILM: boolean = false;
    await generalQuery("getP4002", { PROD_REQUEST_NO: prod_request_no })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);
          let loadeddata = response.data.data.map(
            (element: any, index: number) => {
              return {
                ...element,
                id: index,
              };
            }
          );
          if (loadeddata[0].CODE_55 === "04") {
            check_ycsx_sample = true;
          } else {
            check_ycsx_sample = false;
          }
        } else {
          check_ycsx_sample = false;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    console.log(check_ycsx_sample);
    await generalQuery("check_PLAN_ID_OUT_KNIFE_FILM", {
      PLAN_ID: selectedPlan?.PLAN_ID,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);
          if (response.data.data.length > 0) {
            checkPLANID_EXIST_OUT_KNIFE_FILM = true;
          } else {
            checkPLANID_EXIST_OUT_KNIFE_FILM = false;
          }
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
    if (check_ycsx_sample) {
      if (checkPLANID_EXIST_OUT_KNIFE_FILM === false) {
        await generalQuery("insert_OUT_KNIFE_FILM", {
          PLAN_ID: selectedPlan?.PLAN_ID,
          EQ_THUC_TE: selectedPlan?.PLAN_EQ,
          CA_LAM_VIEC: "Day",
          EMPL_NO: getUserData()?.EMPL_NO,
          KNIFE_FILM_NO: "1K22LH20",
          PD: selectedPlan?.PD,
          CAVITY: selectedPlan?.CAVITY,
        })
          .then((response) => {
            //console.log(response.data.data);
            if (response.data.tk_status !== "NG") {
              f_updateXUAT_DAO_FILM_PLAN(
                selectedPlan?.PLAN_ID === undefined
                  ? "xxx"
                  : selectedPlan?.PLAN_ID
              );
              //console.log(response.data.data);
            } else {
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        err_code = "Đã xuất dao rồi";
        Swal.fire("Thông báo", "Đã xuất dao rồi", "info");
      }
    } else {
      err_code = "Đây không phải ycsx sample";
      Swal.fire("Thông báo", "Đây không phải ycsx sample", "info");
    }
  } else {
    err_code = "Hãy chọn ít nhất 1 chỉ thị";
    Swal.fire("Thông báo", "Hãy chọn ít nhất 1 chỉ thị", "error");
  }
  return err_code;
};
export const f_handle_movePlan = async (
  qlsxplandatafilter: QLSXPLANDATA[],
  todate: string
) => {
  let err_code: string = "0";
  if (qlsxplandatafilter.length > 0) {
    let err_code: string = "0";
    for (let i = 0; i < qlsxplandatafilter.length; i++) {
      let checkplansetting: boolean = false;
      await generalQuery("checkplansetting", {
        PLAN_ID: qlsxplandatafilter[i].PLAN_ID,
      })
        .then((response) => {
          //console.log(response.data);
          if (response.data.tk_status !== "NG") {
            checkplansetting = true;
          } else {
            checkplansetting = false;
          }
        })
        .catch((error) => {
          console.log(error);
        });
      if (!checkplansetting) {
        generalQuery("move_plan", {
          PLAN_ID: qlsxplandatafilter[i].PLAN_ID,
          PLAN_DATE: todate,
        })
          .then((response) => {
            //console.log(response.data.data);
            if (response.data.tk_status !== "NG") {
            } else {
              err_code += "Lỗi: " + response.data.message + "\n";
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        err_code +=
          "Lỗi: PLAN_ID " +
          qlsxplandatafilter[i].PLAN_ID +
          " đã setting nên không di chuyển được sang ngày khác, phải chốt";
      }
    }
  } else {
    Swal.fire("Thông báo", "Chọn ít nhất một chỉ thị để di chuyển", "error");
  }
  return err_code;
};
export const f_load_nhapkhoao = async (filterData: any) => {
  let kq: LICHSUNHAPKHOAO[] = [];
  await generalQuery("lichsunhapkhoao", filterData)
    .then((response) => {
      //console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        let loadeddata = response.data.data.map(
          (element: LICHSUNHAPKHOAO, index: number) => {
            return {
              ...element,
              INS_DATE: moment
                .utc(element.INS_DATE)
                .format("YYYY-MM-DD HH:mm:ss"),
              id: index,
            };
          }
        );
        //console.log(loadeddata);
        kq = loadeddata;
      } else {
        kq = [];
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};
export const f_load_nhapkhosub = async (filterData: any) => {
  let kq: LICHSUNHAPKHOAO[] = [];
  await generalQuery("lichsunhapkhosub", filterData)
    .then((response) => {
      //console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        let loadeddata = response.data.data.map(
          (element: LICHSUNHAPKHOAO, index: number) => {
            return {
              ...element,
              INS_DATE: moment
                .utc(element.INS_DATE)
                .format("YYYY-MM-DD HH:mm:ss"),
              id: index,
            };
          }
        );
        //console.log(loadeddata);
        kq = loadeddata;
      } else {
        kq = [];
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};
export const f_load_xuatkhoao = async (filterData: any) => {
  let kq: LICHSUXUATKHOAO[] = [];
  await generalQuery("lichsuxuatkhoao", filterData)
    .then((response) => {
      //console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        let loadeddata = response.data.data.map(
          (element: LICHSUXUATKHOAO, index: number) => {
            return {
              ...element,
              INS_DATE: moment
                .utc(element.INS_DATE)
                .format("YYYY-MM-DD HH:mm:ss"),
              id: index,
            };
          }
        );
        //console.log(loadeddata);
        kq = loadeddata;
      } else {
        kq = [];
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};
export const f_load_tonkhoao = async (filterData: any) => {
  let kq: TONLIEUXUONG[] = [];
  await generalQuery("checktonlieutrongxuong", filterData)
    .then((response) => {
      //console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        let loadeddata = response.data.data.map(
          (element: TONLIEUXUONG, index: number) => {
            return {
              ...element,
              INS_DATE: moment
                .utc(element.INS_DATE)
                .format("YYYY-MM-DD HH:mm:ss"),
              id: index,
            };
          }
        );
        //console.log(loadeddata);
        kq = loadeddata;
      } else {
        kq = [];
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};
export const f_load_tonkhosub = async (filterData: any) => {
  let kq: TONLIEUXUONG[] = [];
  await generalQuery("checktonlieutrongxuong_sub", filterData)
    .then((response) => {
      //console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        let loadeddata = response.data.data.map(
          (element: TONLIEUXUONG, index: number) => {
            return {
              ...element,
              INS_DATE: moment
                .utc(element.INS_DATE)
                .format("YYYY-MM-DD HH:mm:ss"),
              id: index,
            };
          }
        );
        //console.log(loadeddata);
        kq = loadeddata;
      } else {
        kq = [];
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};
export const f_neededSXQtyByYCSX = async (
  PROD_REQUEST_NO: string,
  G_CODE: string
) => {
  let kq: YCSX_SLC_DATA[] = [];
  await generalQuery("neededSXQtyByYCSX", {
    PROD_REQUEST_NO: PROD_REQUEST_NO,
    G_CODE: G_CODE,
  })
    .then((response) => {
      //console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        let loadeddata = response.data.data.map(
          (element: YCSX_SLC_DATA, index: number) => {
            return {
              ...element,
              id: index,
            };
          }
        );
        //console.log(loadeddata);
        kq = loadeddata;
      } else {
        kq = [];
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};
//kho ao
export const f_checktontaiMlotPlanIdSuDung = async (
  NEXT_PLAN: string,
  M_LOT_NO: string
) => {
  let checkTonTai: boolean = false;
  await generalQuery("checkTonTaiXuatKhoAo", {
    PLAN_ID: NEXT_PLAN,
    M_LOT_NO: M_LOT_NO,
  })
    .then((response) => {
      console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        if (response.data.data.length > 0) {
          checkTonTai = false;
        }
      } else {
        checkTonTai = true;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return checkTonTai;
};
export const f_checktontaiMlotPlanIdSuDungKhoSub = async (
  NEXT_PLAN: string,
  M_LOT_NO: string
) => {
  let checkTonTai: boolean = false;
  await generalQuery("checkTonTaiXuatKhoSub", {
    PLAN_ID: NEXT_PLAN,
    M_LOT_NO: M_LOT_NO,
  })
    .then((response) => {
      console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        if (response.data.data.length > 0) {
          checkTonTai = false;
        }
      } else {
        checkTonTai = true;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return checkTonTai;
};
export const f_checkNextPlanFSC = async (NEXT_PLAN: string) => {
  let checkFSC: string = "N",
    checkFSC_CODE = "01";
  await generalQuery("checkFSC_PLAN_ID", {
    PLAN_ID: NEXT_PLAN,
  })
    .then((response) => {
      console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        checkFSC = response.data.data[0].FSC;
        checkFSC_CODE = response.data.data[0].FSC_CODE;
      } else {
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return { FSC: checkFSC, FSC_CODE: checkFSC_CODE };
};
export const f_isExistM_LOT_NO_QTY_P500 = async (
  M_LOT_NO: string,
  INPUT_QTY: number
) => {
  let checkP500: boolean = false;
  await generalQuery("checkM_LOT_NO_QTY_P500", {
    M_LOT_NO: M_LOT_NO,
    INPUT_QTY: INPUT_QTY,
  })
    .then((response) => {
      console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        if (response.data.data.length > 0) {
          checkP500 = true;
        }
      } else {
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return checkP500;
};
export const f_checkNhapKhoTPDuHayChua = async (NEXT_PLAN: string) => {
  let checkNhapKho: string = "N";
  await generalQuery("checkYcsxStatus", {
    PLAN_ID: NEXT_PLAN,
  })
    .then((response) => {
      console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        checkNhapKho = response.data.data[0].USE_YN;
      } else {
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return checkNhapKho;
};
export const f_isNextPlanClosed = async (NEXT_PLAN: string) => {
  let nextPlanClosed: boolean = false;
  await generalQuery("checkNextPlanClosed", {
    PLAN_ID: NEXT_PLAN,
  })
    .then((response) => {
      console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        nextPlanClosed = response.data.data[0].CHOTBC === "V";
      } else {
        nextPlanClosed = false;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return nextPlanClosed;
};
export const f_checkMlotTonKhoAo = async (M_LOT_NO: string) => {
  let isTon: boolean = false;
  await generalQuery("checktonKhoAoMLotNo", {
    M_LOT_NO: M_LOT_NO,
  })
    .then((response) => {
      console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        isTon = response.data.data[0].USE_YN === "Y";
      } else {
        isTon = false;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return isTon;
};
export const f_checkMlotTonKhoSub = async (M_LOT_NO: string) => {
  let isTon: boolean = false;
  await generalQuery("checktonKhoSubMLotNo", {
    M_LOT_NO: M_LOT_NO,
  })
    .then((response) => {
      console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        isTon = response.data.data[0].USE_YN === "Y";
      } else {
        isTon = false;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return isTon;
};
export const f_isM_CODE_CHITHI = async (PLAN_ID: string, M_CODE: string) => {
  let checklieuchithi: boolean = false;
  await generalQuery("checkM_CODE_CHITHI", {
    PLAN_ID_OUTPUT: PLAN_ID,
    M_CODE: M_CODE,
  })
    .then((response) => {
      console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        checklieuchithi = true;
      } else {
        checklieuchithi = false;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return checklieuchithi;
};
export const f_set_YN_KHO_AO_INPUT = async (DATA: any) => {
  let kq: boolean = false;
  await generalQuery("setUSE_YN_KHO_AO_INPUT", {
    FACTORY: DATA.FACTORY,
    PHANLOAI: DATA.PHANLOAI,
    PLAN_ID_INPUT: DATA.PLAN_ID_INPUT,
    PLAN_ID_SUDUNG: DATA.PLAN_ID_SUDUNG,
    M_CODE: DATA.M_CODE,
    M_LOT_NO: DATA.M_LOT_NO,
    TOTAL_IN_QTY: DATA.TOTAL_IN_QTY,
    USE_YN: DATA.USE_YN,
    IN_KHO_ID: DATA.IN_KHO_ID,
    PLAN_ID_SUDUNG_TEST: DATA.PLAN_ID_SUDUNG_TEST,
    USE_YN_TEST: DATA.USE_YN_TEST,
  })
    .then((response) => {
      console.log(response.data);
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
export const f_set_YN_KHO_SUB_INPUT = async (DATA: any) => {
  let kq: boolean = false;
  await generalQuery("setUSE_YN_KHO_SUB_INPUT", {
    FACTORY: DATA.FACTORY,
    PHANLOAI: DATA.PHANLOAI,
    PLAN_ID_INPUT: DATA.PLAN_ID_INPUT,
    PLAN_ID_SUDUNG: DATA.PLAN_ID_SUDUNG,
    M_CODE: DATA.M_CODE,
    M_LOT_NO: DATA.M_LOT_NO,
    TOTAL_IN_QTY: DATA.TOTAL_IN_QTY,
    USE_YN: DATA.USE_YN,
    IN_KHO_ID: DATA.IN_KHO_ID,
  })
    .then((response) => {
      console.log(response.data);
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
export const f_nhapkhosubao = async (DATA: any) => {
  let kq: boolean = false;
  await generalQuery("nhapkhosubao", {
    FACTORY: DATA.FACTORY,
    PHANLOAI: DATA.PHANLOAI,
    PLAN_ID_INPUT: DATA.PLAN_ID_INPUT,
    PLAN_ID_SUDUNG: DATA.PLAN_ID_SUDUNG,
    M_CODE: DATA.M_CODE,
    M_LOT_NO: DATA.M_LOT_NO,
    ROLL_QTY: DATA.ROLL_QTY,
    IN_QTY: DATA.IN_QTY,
    TOTAL_IN_QTY: DATA.TOTAL_IN_QTY,
    USE_YN: DATA.USE_YN,
    FSC: DATA.FSC,
    FSC_MCODE: DATA.FSC_MCODE,
    FSC_GCODE: DATA.FSC_GCODE,
  })
    .then((response) => {
      console.log(response.data);
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
export const f_nhapkhoao = async (DATA: any) => {
  let kq: boolean = false;
  await generalQuery("nhapkhoao", {
    FACTORY: DATA.FACTORY,
    PHANLOAI: DATA.PHANLOAI,
    PLAN_ID_INPUT: DATA.PLAN_ID_INPUT,
    PLAN_ID_SUDUNG: DATA.PLAN_ID_SUDUNG,
    M_CODE: DATA.M_CODE,
    M_LOT_NO: DATA.M_LOT_NO,
    ROLL_QTY: DATA.ROLL_QTY,
    IN_QTY: DATA.IN_QTY,
    TOTAL_IN_QTY: DATA.TOTAL_IN_QTY,
    USE_YN: DATA.USE_YN,
    FSC: DATA.FSC,
    FSC_MCODE: DATA.FSC_MCODE,
    FSC_GCODE: DATA.FSC_GCODE,
  })
    .then((response) => {
      console.log(response.data);
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
export const f_xuatkhoao = async (DATA: any) => {
  let kq: boolean = false;
  await generalQuery("xuatkhoao", {
    FACTORY: DATA.FACTORY,
    PHANLOAI: DATA.PHANLOAI,
    PLAN_ID_INPUT: DATA.PLAN_ID_INPUT,
    PLAN_ID_OUTPUT: DATA.PLAN_ID_OUTPUT,
    M_CODE: DATA.M_CODE,
    M_LOT_NO: DATA.M_LOT_NO,
    ROLL_QTY: DATA.ROLL_QTY,
    OUT_QTY: DATA.OUT_QTY,
    TOTAL_OUT_QTY: DATA.TOTAL_OUT_QTY,
    USE_YN: DATA.USE_YN,
    REMARK: DATA.REMARK,
  })
    .then((response) => {
      console.log(response.data.tk_status);
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
export const f_anrackhoao = async (listRac: TONLIEUXUONG[]) => {
  if (listRac.length > 0) {
    let err_code: string = "0";
    for (let i = 0; i < listRac.length; i++) {
      await generalQuery("an_lieu_kho_ao", {
        IN_KHO_ID: listRac[i].IN_KHO_ID,
      })
        .then((response) => {
          //console.log(response.data.data);
          if (response.data.tk_status !== "NG") {
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    if (err_code !== "0") {
      Swal.fire("Thông báo", "Có lỗi: " + err_code, "error");
    }
    //handle_loadKhoAo();
  } else {
    Swal.fire("Thông báo", "Chọn ít nhất 1 liệu để ẩn", "error");
  }
};
export const f_is2MCODE_IN_KHO_AO = async (PLAN_ID_INPUT: string) => {
  let check_2_m_code_in_kho_ao: boolean = false;
  await generalQuery("check_2_m_code_in_kho_ao", {
    PLAN_ID_INPUT: PLAN_ID_INPUT,
  })
    .then((response) => {
      //console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        if (response.data.data[0].COUNT_M_CODE > 1) {
          check_2_m_code_in_kho_ao = true;
        } else {
          check_2_m_code_in_kho_ao = false;
        }
      } else {
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return check_2_m_code_in_kho_ao;
};
export const f_isM_LOT_NO_in_P500 = async (
  PLAN_ID_INPUT: string,
  M_LOT_NO: string
) => {
  let check_m_lot_exist_p500: boolean = false;
  await generalQuery("check_m_lot_exist_p500", {
    PLAN_ID_INPUT: PLAN_ID_INPUT,
    M_LOT_NO: M_LOT_NO,
  })
    .then((response) => {
      //console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        if (response.data.data.length > 0) {
          check_m_lot_exist_p500 = true;
        } else {
        }
      } else {
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return check_m_lot_exist_p500;
};
export const f_delete_IN_KHO_AO = async (IN_KHO_ID: number) => {
  await generalQuery("delete_in_kho_ao", {
    IN_KHO_ID: IN_KHO_ID,
  })
    .then((response) => {
      //console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
      } else {
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
export const f_delete_OUT_KHO_AO = async (
  PLAN_ID_INPUT: string,
  M_LOT_NO: string
) => {
  await generalQuery("delete_out_kho_ao", {
    PLAN_ID_INPUT: PLAN_ID_INPUT,
    M_LOT_NO: M_LOT_NO,
  })
    .then((response) => {
      //console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
      } else {
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
//data sx
export const f_lichsuinputlieu = async (DATA: any) => {
  let kq: LICHSUINPUTLIEU_DATA[] = [];
  await generalQuery("lichsuinputlieusanxuat_full", {
    ALLTIME: DATA.ALLTIME,
    FROM_DATE: DATA.FROM_DATE,
    TO_DATE: DATA.TO_DATE,
    PROD_REQUEST_NO: DATA.PROD_REQUEST_NO,
    PLAN_ID: DATA.PLAN_ID,
    M_NAME: DATA.M_NAME,
    M_CODE: DATA.M_CODE,
    G_NAME: DATA.G_NAME,
    G_CODE: DATA.G_CODE,
  })
    .then((response) => {
      //console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        const loaded_data: LICHSUINPUTLIEU_DATA[] = response.data.data.map(
          (element: LICHSUINPUTLIEU_DATA, index: number) => {
            return {
              ...element,
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
              INS_DATE: moment(element.INS_DATE)
                .utc()
                .format("YYYY-MM-DD HH:mm:ss"),
              id: index,
            };
          }
        );
        kq = loaded_data;
      } else {
        kq = [];
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};
export const f_loadDataSXChiThi = async (DATA: any) => {
  let kq: {
    datasx: SX_DATA[];
    summary: LOSS_TABLE_DATA;
  } = {
    datasx: [],
    summary: {
      XUATKHO_MET: 0,
      XUATKHO_EA: 0,
      SCANNED_MET: 0,
      SCANNED_EA: 0,
      PROCESS1_RESULT: 0,
      PROCESS2_RESULT: 0,
      PROCESS3_RESULT: 0,
      PROCESS4_RESULT: 0,
      SX_RESULT: 0,
      INSPECTION_INPUT: 0,
      INSPECT_LOSS_QTY: 0,
      INSPECT_MATERIAL_NG: 0,
      INSPECT_OK_QTY: 0,
      INSPECT_PROCESS_NG: 0,
      INSPECT_TOTAL_NG: 0,
      INSPECT_TOTAL_QTY: 0,
      LOSS_THEM_TUI: 0,
      SX_MARKING_QTY: 0,
      INSPECTION_OUTPUT: 0,
      LOSS_INS_OUT_VS_SCANNED_EA: 0,
      LOSS_INS_OUT_VS_XUATKHO_EA: 0,
      NG1: 0,
      NG2: 0,
      NG3: 0,
      NG4: 0,
      SETTING1: 0,
      SETTING2: 0,
      SETTING3: 0,
      SETTING4: 0,
      SCANNED_EA2: 0,
      SCANNED_EA3: 0,
      SCANNED_EA4: 0,
      SCANNED_MET2: 0,
      SCANNED_MET3: 0,
      SCANNED_MET4: 0,
    },
  };
  await generalQuery("loadDataSX", {
    ALLTIME: DATA.ALLTIME,
    FROM_DATE: DATA.FROM_DATE,
    TO_DATE: DATA.TO_DATE,
    PROD_REQUEST_NO: DATA.PROD_REQUEST_NO,
    PLAN_ID: DATA.PLAN_ID,
    M_NAME: DATA.M_NAME,
    M_CODE: DATA.M_CODE,
    G_NAME: DATA.G_NAME,
    G_CODE: DATA.G_CODE,
    FACTORY: DATA.FACTORY,
    PLAN_EQ: DATA.PLAN_EQ,
    TRUSAMPLE: DATA.TRUSAMPLE,
  })
    .then((response) => {
      //console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        const loaded_data: SX_DATA[] = response.data.data.map(
          (element: SX_DATA, index: number) => {
            return {
              ...element,
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
              SETTING_START_TIME:
                element.SETTING_START_TIME === null
                  ? ""
                  : moment
                      .utc(element.SETTING_START_TIME)
                      .format("YYYY-MM-DD HH:mm:ss"),
              MASS_START_TIME:
                element.MASS_START_TIME === null
                  ? ""
                  : moment
                      .utc(element.MASS_START_TIME)
                      .format("YYYY-MM-DD HH:mm:ss"),
              MASS_END_TIME:
                element.MASS_END_TIME === null
                  ? ""
                  : moment
                      .utc(element.MASS_END_TIME)
                      .format("YYYY-MM-DD HH:mm:ss"),
              SX_DATE:
                element.SX_DATE === null
                  ? ""
                  : moment.utc(element.SX_DATE).format("YYYY-MM-DD"),
              LOSS_SX_ST:
                (element.ESTIMATED_QTY_ST ?? 0) !== 0
                  ? 1 -
                    ((element.KETQUASX ?? 0) * 1.0) /
                      (element.ESTIMATED_QTY_ST ?? 0)
                  : 0,
              LOSS_SX:
                (element.ESTIMATED_QTY ?? 0) !== 0
                  ? 1 -
                    ((element.KETQUASX ?? 0) * 1.0) /
                      (element.ESTIMATED_QTY ?? 0)
                  : 0,
              LOSS_SX_KT:
                (element.KETQUASX ?? 0) !== 0
                  ? 1 -
                    ((element.INS_INPUT ?? 0) * 1.0) / (element.KETQUASX ?? 0)
                  : 0,
              LOSS_KT:
                (element.INS_INPUT ?? 0) !== 0
                  ? 1 -
                    ((element.INS_OUTPUT ?? 0) * 1.0) / (element.INS_INPUT ?? 0)
                  : 0,
              NOT_BEEP_QTY:
                element.PROCESS_NUMBER !== 1 ? 0 : element.NOT_BEEP_QTY,
              KETQUASX_M:
                element.PD !== null
                  ? (element.KETQUASX * element.PD * 1.0) /
                    element.CAVITY /
                    1000
                  : null,
              NG_MET:
                element.PD !== null
                  ? element.USED_QTY -
                    (element.KETQUASX * element.PD * 1.0) /
                      element.CAVITY /
                      1000 -
                    element.SETTING_MET
                  : null,
              NG_EA:
                element.ESTIMATED_QTY - element.SETTING_EA - element.KETQUASX,
              PLAN_LOSS:
                element.PLAN_ORG_MET !== 0
                  ? (element.PLAN_TARGET_MET - element.PLAN_ORG_MET) /
                    element.PLAN_ORG_MET
                  : 0,
              id: index,
            };
          }
        );
        //setShowLoss(false);
        let temp_loss_info: LOSS_TABLE_DATA = {
          XUATKHO_MET: 0,
          XUATKHO_EA: 0,
          SCANNED_MET: 0,
          SCANNED_EA: 0,
          PROCESS1_RESULT: 0,
          PROCESS2_RESULT: 0,
          PROCESS3_RESULT: 0,
          PROCESS4_RESULT: 0,
          SX_RESULT: 0,
          INSPECTION_INPUT: 0,
          INSPECT_LOSS_QTY: 0,
          INSPECT_MATERIAL_NG: 0,
          INSPECT_OK_QTY: 0,
          INSPECT_PROCESS_NG: 0,
          INSPECT_TOTAL_NG: 0,
          INSPECT_TOTAL_QTY: 0,
          LOSS_THEM_TUI: 0,
          SX_MARKING_QTY: 0,
          INSPECTION_OUTPUT: 0,
          LOSS_INS_OUT_VS_SCANNED_EA: 0,
          LOSS_INS_OUT_VS_XUATKHO_EA: 0,
          NG1: 0,
          NG2: 0,
          NG3: 0,
          NG4: 0,
          SETTING1: 0,
          SETTING2: 0,
          SETTING3: 0,
          SETTING4: 0,
          SCANNED_EA2: 0,
          SCANNED_EA3: 0,
          SCANNED_EA4: 0,
          SCANNED_MET2: 0,
          SCANNED_MET3: 0,
          SCANNED_MET4: 0,
        };
        for (let i = 0; i < loaded_data.length; i++) {
          temp_loss_info.XUATKHO_MET += loaded_data[i].WAREHOUSE_OUTPUT_QTY;
          temp_loss_info.XUATKHO_EA += loaded_data[i].WAREHOUSE_ESTIMATED_QTY;
          temp_loss_info.SCANNED_MET +=
            loaded_data[i].PROCESS_NUMBER === 1 ? loaded_data[i].USED_QTY : 0;
          temp_loss_info.SCANNED_EA +=
            loaded_data[i].PROCESS_NUMBER === 1
              ? loaded_data[i].ESTIMATED_QTY
              : 0;
          temp_loss_info.SCANNED_MET2 +=
            loaded_data[i].PROCESS_NUMBER === 2 ? loaded_data[i].USED_QTY : 0;
          temp_loss_info.SCANNED_EA2 +=
            loaded_data[i].PROCESS_NUMBER === 2
              ? loaded_data[i].ESTIMATED_QTY
              : 0;
          temp_loss_info.SCANNED_MET3 +=
            loaded_data[i].PROCESS_NUMBER === 3 ? loaded_data[i].USED_QTY : 0;
          temp_loss_info.SCANNED_EA3 +=
            loaded_data[i].PROCESS_NUMBER === 3
              ? loaded_data[i].ESTIMATED_QTY
              : 0;
          temp_loss_info.SCANNED_MET4 +=
            loaded_data[i].PROCESS_NUMBER === 4 ? loaded_data[i].USED_QTY : 0;
          temp_loss_info.SCANNED_EA4 +=
            loaded_data[i].PROCESS_NUMBER === 4
              ? loaded_data[i].ESTIMATED_QTY
              : 0;
          temp_loss_info.PROCESS1_RESULT +=
            loaded_data[i].PROCESS_NUMBER === 1 && loaded_data[i].STEP === 0
              ? loaded_data[i].KETQUASX
              : 0;
          temp_loss_info.PROCESS2_RESULT +=
            loaded_data[i].PROCESS_NUMBER === 2 && loaded_data[i].STEP === 0
              ? loaded_data[i].KETQUASX
              : 0;
          temp_loss_info.PROCESS3_RESULT +=
            loaded_data[i].PROCESS_NUMBER === 3 && loaded_data[i].STEP === 0
              ? loaded_data[i].KETQUASX
              : 0;
          temp_loss_info.PROCESS4_RESULT +=
            loaded_data[i].PROCESS_NUMBER === 4 && loaded_data[i].STEP === 0
              ? loaded_data[i].KETQUASX
              : 0;
          temp_loss_info.NG1 +=
            loaded_data[i].PROCESS_NUMBER === 1 && loaded_data[i].STEP === 0
              ? loaded_data[i].NG_EA
              : 0;
          temp_loss_info.NG2 +=
            loaded_data[i].PROCESS_NUMBER === 2 && loaded_data[i].STEP === 0
              ? loaded_data[i].NG_EA
              : 0;
          temp_loss_info.NG3 +=
            loaded_data[i].PROCESS_NUMBER === 3 && loaded_data[i].STEP === 0
              ? loaded_data[i].NG_EA
              : 0;
          temp_loss_info.NG4 +=
            loaded_data[i].PROCESS_NUMBER === 4 && loaded_data[i].STEP === 0
              ? loaded_data[i].NG_EA
              : 0;
          temp_loss_info.SETTING1 +=
            loaded_data[i].PROCESS_NUMBER === 1 && loaded_data[i].STEP === 0
              ? loaded_data[i].SETTING_EA
              : 0;
          temp_loss_info.SETTING2 +=
            loaded_data[i].PROCESS_NUMBER === 2 && loaded_data[i].STEP === 0
              ? loaded_data[i].SETTING_EA
              : 0;
          temp_loss_info.SETTING3 +=
            loaded_data[i].PROCESS_NUMBER === 3 && loaded_data[i].STEP === 0
              ? loaded_data[i].SETTING_EA
              : 0;
          temp_loss_info.SETTING4 +=
            loaded_data[i].PROCESS_NUMBER === 4 && loaded_data[i].STEP === 0
              ? loaded_data[i].SETTING_EA
              : 0;
          temp_loss_info.INSPECTION_INPUT += loaded_data[i].INS_INPUT;
          temp_loss_info.INSPECT_TOTAL_QTY += loaded_data[i].INSPECT_TOTAL_QTY;
          temp_loss_info.INSPECT_OK_QTY += loaded_data[i].INSPECT_OK_QTY;
          temp_loss_info.LOSS_THEM_TUI += loaded_data[i].LOSS_THEM_TUI;
          temp_loss_info.INSPECT_LOSS_QTY += loaded_data[i].INSPECT_LOSS_QTY;
          temp_loss_info.INSPECT_TOTAL_NG += loaded_data[i].INSPECT_TOTAL_NG;
          temp_loss_info.INSPECT_MATERIAL_NG +=
            loaded_data[i].INSPECT_MATERIAL_NG;
          temp_loss_info.INSPECT_PROCESS_NG +=
            loaded_data[i].INSPECT_PROCESS_NG;
          temp_loss_info.SX_MARKING_QTY += loaded_data[i].SX_MARKING_QTY;
          temp_loss_info.INSPECTION_OUTPUT += loaded_data[i].INS_OUTPUT;
          temp_loss_info.SX_RESULT += loaded_data[i].KETQUASX_TP ?? 0;
        }
        temp_loss_info.LOSS_INS_OUT_VS_SCANNED_EA =
          1 - temp_loss_info.INSPECTION_OUTPUT / temp_loss_info.SCANNED_EA;
        temp_loss_info.LOSS_INS_OUT_VS_XUATKHO_EA =
          1 - temp_loss_info.INSPECTION_OUTPUT / temp_loss_info.XUATKHO_EA;
        kq.datasx = loaded_data;
        kq.summary = temp_loss_info;
      } else {
        Swal.fire("Thông báo", " Có lỗi : " + response.data.message, "error");
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};
export const f_loadDataSX_YCSX = async (DATA: any) => {
  let kq: {
    datasx: YCSX_SX_DATA[];
    summary: LOSS_TABLE_DATA;
  } = {
    datasx: [],
    summary: {
      XUATKHO_MET: 0,
      XUATKHO_EA: 0,
      SCANNED_MET: 0,
      SCANNED_EA: 0,
      PROCESS1_RESULT: 0,
      PROCESS2_RESULT: 0,
      PROCESS3_RESULT: 0,
      PROCESS4_RESULT: 0,
      SX_RESULT: 0,
      INSPECTION_INPUT: 0,
      INSPECT_LOSS_QTY: 0,
      INSPECT_MATERIAL_NG: 0,
      INSPECT_OK_QTY: 0,
      INSPECT_PROCESS_NG: 0,
      INSPECT_TOTAL_NG: 0,
      INSPECT_TOTAL_QTY: 0,
      LOSS_THEM_TUI: 0,
      SX_MARKING_QTY: 0,
      INSPECTION_OUTPUT: 0,
      LOSS_INS_OUT_VS_SCANNED_EA: 0,
      LOSS_INS_OUT_VS_XUATKHO_EA: 0,
      NG1: 0,
      NG2: 0,
      NG3: 0,
      NG4: 0,
      SETTING1: 0,
      SETTING2: 0,
      SETTING3: 0,
      SETTING4: 0,
      SCANNED_EA2: 0,
      SCANNED_EA3: 0,
      SCANNED_EA4: 0,
      SCANNED_MET2: 0,
      SCANNED_MET3: 0,
      SCANNED_MET4: 0,
    },
  };
  await generalQuery("loadDataSX_YCSX", {
    ALLTIME: DATA.ALLTIME,
    FROM_DATE: DATA.FROM_DATE,
    TO_DATE: DATA.TO_DATE,
    PROD_REQUEST_NO: DATA.PROD_REQUEST_NO,
    PLAN_ID: DATA.PLAN_ID,
    M_NAME: DATA.M_NAME,
    M_CODE: DATA.M_CODE,
    G_NAME: DATA.G_NAME,
    G_CODE: DATA.G_CODE,
    FACTORY: DATA.FACTORY,
    PLAN_EQ: DATA.PLAN_EQ,
    TRUSAMPLE: DATA.TRUSAMPLE,
    ONLYCLOSE: DATA.ONLYCLOSE,
  })
    .then((response) => {
      //console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        const loaded_data: YCSX_SX_DATA[] = response.data.data.map(
          (element: YCSX_SX_DATA, index: number) => {
            return {
              ...element,
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
              TOTAL_LOSS:
                1 - (element.INS_OUTPUT * 1.0) / element.ESTIMATED_QTY,
              TOTAL_LOSS2:
                1 -
                (element.INS_OUTPUT * 1.0) / element.WAREHOUSE_ESTIMATED_QTY,
              PROD_REQUEST_DATE: moment
                .utc(element.PROD_REQUEST_DATE)
                .format("YYYY-MM-DD"),
              LOSS_OVER:
                1 - (element.INS_OUTPUT * 1.0) / element.ESTIMATED_QTY >
                element.LOSS_LT
                  ? "OVER"
                  : "OK",
              id: index,
            };
          }
        );
        let temp_loss_info: LOSS_TABLE_DATA = {
          XUATKHO_MET: 0,
          XUATKHO_EA: 0,
          SCANNED_MET: 0,
          SCANNED_EA: 0,
          PROCESS1_RESULT: 0,
          PROCESS2_RESULT: 0,
          PROCESS3_RESULT: 0,
          PROCESS4_RESULT: 0,
          SX_RESULT: 0,
          INSPECTION_INPUT: 0,
          INSPECT_LOSS_QTY: 0,
          INSPECT_MATERIAL_NG: 0,
          INSPECT_OK_QTY: 0,
          INSPECT_PROCESS_NG: 0,
          INSPECT_TOTAL_NG: 0,
          INSPECT_TOTAL_QTY: 0,
          LOSS_THEM_TUI: 0,
          SX_MARKING_QTY: 0,
          INSPECTION_OUTPUT: 0,
          LOSS_INS_OUT_VS_SCANNED_EA: 0,
          LOSS_INS_OUT_VS_XUATKHO_EA: 0,
          NG1: 0,
          NG2: 0,
          NG3: 0,
          NG4: 0,
          SETTING1: 0,
          SETTING2: 0,
          SETTING3: 0,
          SETTING4: 0,
          SCANNED_EA2: 0,
          SCANNED_EA3: 0,
          SCANNED_EA4: 0,
          SCANNED_MET2: 0,
          SCANNED_MET3: 0,
          SCANNED_MET4: 0,
        };
        let maxprocess: number = 1;
        for (let i = 0; i < loaded_data.length; i++) {
          maxprocess = f_checkEQvsPROCESS(
            loaded_data[i].EQ1,
            loaded_data[i].EQ2,
            loaded_data[i].EQ3,
            loaded_data[i].EQ4
          );
          temp_loss_info.XUATKHO_MET += loaded_data[i].M_OUTPUT;
          temp_loss_info.XUATKHO_EA += loaded_data[i].WAREHOUSE_ESTIMATED_QTY;
          temp_loss_info.SCANNED_MET += loaded_data[i].USED_QTY;
          temp_loss_info.SCANNED_EA += loaded_data[i].ESTIMATED_QTY;
          temp_loss_info.PROCESS1_RESULT += loaded_data[i].CD1;
          temp_loss_info.PROCESS2_RESULT += loaded_data[i].CD2;
          temp_loss_info.PROCESS3_RESULT += loaded_data[i].CD3;
          temp_loss_info.PROCESS4_RESULT += loaded_data[i].CD4;
          temp_loss_info.NG1 += loaded_data[i].NG1;
          temp_loss_info.NG2 += loaded_data[i].NG2;
          temp_loss_info.NG3 += loaded_data[i].NG3;
          temp_loss_info.NG4 += loaded_data[i].NG4;
          temp_loss_info.SETTING1 += loaded_data[i].ST1;
          temp_loss_info.SETTING2 += loaded_data[i].ST2;
          temp_loss_info.SETTING3 += loaded_data[i].ST3;
          temp_loss_info.SETTING4 += loaded_data[i].ST4;
          (temp_loss_info.SX_RESULT +=
            maxprocess == 1
              ? loaded_data[i].CD1
              : maxprocess == 2
              ? loaded_data[i].CD2
              : maxprocess == 3
              ? loaded_data[i].CD3
              : loaded_data[i].CD4),
            (temp_loss_info.INSPECTION_INPUT += loaded_data[i].INS_INPUT);
          temp_loss_info.INSPECT_TOTAL_QTY += loaded_data[i].INSPECT_TOTAL_QTY;
          temp_loss_info.INSPECT_OK_QTY += loaded_data[i].INSPECT_OK_QTY;
          temp_loss_info.LOSS_THEM_TUI += loaded_data[i].LOSS_THEM_TUI;
          temp_loss_info.INSPECT_LOSS_QTY += loaded_data[i].INSPECT_LOSS_QTY;
          temp_loss_info.INSPECT_TOTAL_NG += loaded_data[i].INSPECT_TOTAL_NG;
          temp_loss_info.INSPECT_MATERIAL_NG +=
            loaded_data[i].INSPECT_MATERIAL_NG;
          temp_loss_info.INSPECT_PROCESS_NG +=
            loaded_data[i].INSPECT_PROCESS_NG;
          temp_loss_info.SX_MARKING_QTY += loaded_data[i].SX_MARKING_QTY;
          temp_loss_info.INSPECTION_OUTPUT += loaded_data[i].INS_OUTPUT;
          temp_loss_info.LOSS_INS_OUT_VS_SCANNED_EA =
            1 - temp_loss_info.INSPECTION_OUTPUT / temp_loss_info.SCANNED_EA;
          temp_loss_info.LOSS_INS_OUT_VS_XUATKHO_EA =
            1 - temp_loss_info.INSPECTION_OUTPUT / temp_loss_info.XUATKHO_EA;
        }
        kq.summary = temp_loss_info;
        kq.datasx = loaded_data;
      } else {
        Swal.fire("Thông báo", " Có lỗi : " + response.data.message, "error");
      }
    })
    .catch((error) => {
      console.log(error);
      Swal.fire("Thông báo", " Có lỗi : " + error, "error");
    });
  return kq;
};
export const f_YCSXDailyChiThiData = async (PROD_REQUEST_NO: string) => {
  let kq: {
    datasx: DAILY_YCSX_RESULT[];
    summary: DAILY_YCSX_RESULT;
  } = {
    datasx: [],
    summary: {
      PLAN_DATE: "",
      TARGET1: 0,
      INPUT1: 0,
      RESULT1: 0,
      LOSS1: 0,
      TARGET2: 0,
      INPUT2: 0,
      RESULT2: 0,
      LOSS2: 0,
      TARGET3: 0,
      INPUT3: 0,
      RESULT3: 0,
      LOSS3: 0,
      TARGET4: 0,
      INPUT4: 0,
      RESULT4: 0,
      LOSS4: 0,
      INSP_QTY: 0,
      INSP_LOSS: 0,
      INSP_NG: 0,
      INSP_OK: 0,
      LOSS_KT: 0,
    },
  };
  await generalQuery("tinhhinhycsxtheongay", {
    PROD_REQUEST_NO: PROD_REQUEST_NO,
  })
    .then((response) => {
      //console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        let loaded_data: DAILY_YCSX_RESULT[] = response.data.data.map(
          (element: DAILY_YCSX_RESULT, index: number) => {
            return {
              ...element,
              PLAN_DATE: moment.utc(element.PLAN_DATE).format("YYYY-MM-DD"),
              LOSS1:
                element.INPUT1 !== 0 ? 1 - element.RESULT1 / element.INPUT1 : 0,
              LOSS2:
                element.INPUT2 !== 0 ? 1 - element.RESULT2 / element.INPUT2 : 0,
              LOSS3:
                element.INPUT3 !== 0 ? 1 - element.RESULT2 / element.INPUT3 : 0,
              LOSS_KT:
                element.INSP_QTY !== 0
                  ? 1 - element.INSP_OK / element.INSP_QTY
                  : 0,
              id: index,
            };
          }
        );
        let totalRow: DAILY_YCSX_RESULT = {
          PLAN_DATE: "TOTAL",
          TARGET1: 0,
          INPUT1: 0,
          RESULT1: 0,
          LOSS1: 0,
          TARGET2: 0,
          INPUT2: 0,
          RESULT2: 0,
          LOSS2: 0,
          TARGET3: 0,
          INPUT3: 0,
          RESULT3: 0,
          LOSS3: 0,
          TARGET4: 0,
          INPUT4: 0,
          RESULT4: 0,
          LOSS4: 0,
          INSP_QTY: 0,
          INSP_LOSS: 0,
          INSP_NG: 0,
          INSP_OK: 0,
          LOSS_KT: 0,
        };
        for (let i = 0; i < loaded_data.length; i++) {
          totalRow.TARGET1 += loaded_data[i].TARGET1;
          totalRow.TARGET2 += loaded_data[i].TARGET2;
          totalRow.TARGET3 += loaded_data[i].TARGET3;
          totalRow.TARGET4 += loaded_data[i].TARGET4;
          totalRow.INPUT1 += loaded_data[i].INPUT1;
          totalRow.INPUT2 += loaded_data[i].INPUT2;
          totalRow.INPUT3 += loaded_data[i].INPUT3;
          totalRow.INPUT4 += loaded_data[i].INPUT4;
          totalRow.RESULT1 += loaded_data[i].RESULT1;
          totalRow.RESULT2 += loaded_data[i].RESULT2;
          totalRow.RESULT3 += loaded_data[i].RESULT3;
          totalRow.RESULT4 += loaded_data[i].RESULT4;
          totalRow.INSP_QTY += loaded_data[i].INSP_QTY;
          totalRow.INSP_OK += loaded_data[i].INSP_OK;
          totalRow.INSP_NG += loaded_data[i].INSP_NG;
          totalRow.INSP_LOSS += loaded_data[i].INSP_LOSS;
        }
        totalRow.LOSS1 =
          totalRow.INPUT1 !== 0 ? 1 - totalRow.RESULT1 / totalRow.INPUT1 : 0;
        totalRow.LOSS2 =
          totalRow.INPUT2 !== 0 ? 1 - totalRow.RESULT2 / totalRow.INPUT2 : 0;
        totalRow.LOSS3 =
          totalRow.INPUT3 !== 0 ? 1 - totalRow.RESULT3 / totalRow.INPUT3 : 0;
        totalRow.LOSS4 =
          totalRow.INPUT4 !== 0 ? 1 - totalRow.RESULT4 / totalRow.INPUT4 : 0;
        totalRow.LOSS_KT =
          totalRow.INSP_QTY !== 0
            ? 1 - totalRow.INSP_OK / totalRow.INSP_QTY
            : 0;
        loaded_data.push(totalRow);
        kq.datasx = loaded_data;
        kq.summary = totalRow;
      } else {
        Swal.fire("Thông báo", " Có lỗi : " + response.data.message, "error");
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};
export const f_LichSuTemLot = async (DATA: any) => {
  let kq: TEMLOTSX_DATA[] = [];
  await generalQuery("tralichsutemlotsx", DATA)
    .then((response) => {
      //console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        let loadeddata = response.data.data.map(
          (element: TEMLOTSX_DATA, index: number) => {
            return {
              ...element,
              INS_DATE: moment
                .utc(element.INS_DATE)
                .format("YYYY-MM-DD HH:mm:ss"),
              id: index,
            };
          }
        );
        //console.log(loadeddata);
        kq = loadeddata;
        Swal.fire(
          "Thông báo",
          "Đã load: " + loadeddata.length + " dòng",
          "success"
        );
      } else {
        kq = [];
        Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};
export const f_getCodeInfo = async (DATA: any) => {
  let kq: CODE_FULL_INFO[] = [];
  await generalQuery("codeinfo", {
    G_NAME: DATA.G_NAME,
    CNDB: DATA.CNDB,
    ACTIVE_ONLY: DATA.ACTIVE_ONLY,
  })
    .then((response) => {
      //console.log(response.data);
      if (response.data.tk_status !== "NG") {
        const loadeddata: CODE_FULL_INFO[] = response.data.data.map(
          (element: CODE_FULL_INFO, index: number) => {
            return {
              ...element,
              G_NAME:
                getAuditMode() == 0
                  ? element.G_NAME
                  : element.G_NAME?.search("CNDB") == -1
                  ? element.G_NAME
                  : "TEM_NOI_BO",
              G_NAME_KD:
                getAuditMode() == 0
                  ? element.G_NAME_KD
                  : element.G_NAME?.search("CNDB") == -1
                  ? element.G_NAME_KD
                  : "TEM_NOI_BO",
              id: index,
            };
          }
        );
        kq = loadeddata;
        Swal.fire(
          "Thông báo",
          "Đã load " + response.data.data.length + " dòng",
          "success"
        );
      } else {
        Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        kq = [];
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};
export const f_resetBanVe = async (
  codeList: CODE_FULL_INFO[],
  value: string
) => {
  if (codeList.length >= 1) {
    checkBP(getUserData(), ["RND", "KD"], ["ALL"], ["ALL"], async () => {
      for (let i = 0; i < codeList.length; i++) {
        await generalQuery("resetbanve", {
          G_CODE: codeList[i].G_CODE,
          VALUE: value,
        })
          .then((response) => {
            if (response.data.tk_status !== "NG") {
              //Swal.fire("Thông báo", "Delete Po thành công", "success");
            } else {
              //Swal.fire("Thông báo", "Update PO thất bại: " +response.data.message , "error");
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
      Swal.fire("Thông báo", "RESET BAN VE THÀNH CÔNG", "success");
    });
  } else {
    Swal.fire("Thông báo", "Chọn ít nhất 1 G_CODE để SET !", "error");
  }
};
export const f_setNgoaiQuan = async (
  codeList: CODE_FULL_INFO[],
  value: string
) => {
  if (codeList.length >= 1) {
    checkBP(getUserData(), ["RND", "KD"], ["ALL"], ["ALL"], async () => {
      for (let i = 0; i < codeList.length; i++) {
        await generalQuery("setngoaiquan", {
          G_CODE: codeList[i].G_CODE,
          VALUE: value,
        })
          .then((response) => {
            if (response.data.tk_status !== "NG") {
            } else {
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
      Swal.fire(
        "Thông báo",
        "SET TRẠNG KIỂM TRA NGOẠI QUAN THÀNH CÔNG",
        "success"
      );
    });
  } else {
    Swal.fire("Thông báo", "Chọn ít nhất 1 G_CODE để SET !", "error");
  }
};
export const f_updateBEP = async (codeList: CODE_FULL_INFO[]) => {
  if (codeList.length >= 1) {
    checkBP(getUserData(), ["KD"], ["ALL"], ["ALL"], async () => {
      for (let i = 0; i < codeList.length; i++) {
        await generalQuery("updateBEP", {
          G_CODE: codeList[i].G_CODE,
          BEP: codeList[i].BEP ?? 0,
        })
          .then((response) => {
            if (response.data.tk_status !== "NG") {
            } else {
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
      Swal.fire("Thông báo", "Update BEP THÀNH CÔNG", "success");
    });
  } else {
    Swal.fire("Thông báo", "Chọn ít nhất 1 G_CODE để Update !", "error");
  }
};
export const f_handleSaveQLSX = async (codeList: CODE_FULL_INFO[]) => {
  if (codeList.length >= 1) {
    checkBP(
      getUserData(),
      ["QLSX", "KD", "RND"],
      ["ALL"],
      ["ALL"],
      async () => {
        let err_code: string = "0";
        for (let i = 0; i < codeList.length; i++) {
          if (
            !(await f_saveQLSX({
              G_CODE: codeList[i].G_CODE,
              PROD_DIECUT_STEP: codeList[i].PROD_DIECUT_STEP,
              PROD_PRINT_TIMES: codeList[i].PROD_PRINT_TIMES,
              FACTORY: codeList[i].FACTORY,
              EQ1: codeList[i].EQ1,
              EQ2: codeList[i].EQ2,
              EQ3: codeList[i].EQ3,
              EQ4: codeList[i].EQ4,
              Setting1: codeList[i].Setting1,
              Setting2: codeList[i].Setting2,
              Setting3: codeList[i].Setting3,
              Setting4: codeList[i].Setting4,
              UPH1: codeList[i].UPH1,
              UPH2: codeList[i].UPH2,
              UPH3: codeList[i].UPH3,
              UPH4: codeList[i].UPH4,
              Step1: codeList[i].Step1,
              Step2: codeList[i].Step2,
              Step3: codeList[i].Step3,
              Step4: codeList[i].Step4,
              LOSS_SX1: codeList[i].LOSS_SX1,
              LOSS_SX2: codeList[i].LOSS_SX2,
              LOSS_SX3: codeList[i].LOSS_SX3,
              LOSS_SX4: codeList[i].LOSS_SX4,
              LOSS_SETTING1: codeList[i].LOSS_SETTING1,
              LOSS_SETTING2: codeList[i].LOSS_SETTING2,
              LOSS_SETTING3: codeList[i].LOSS_SETTING3,
              LOSS_SETTING4: codeList[i].LOSS_SETTING4,
              NOTE: codeList[i].NOTE,
            }))
          ) {
            err_code = "1";
          }
        }
        if (err_code === "1") {
          Swal.fire(
            "Thông báo",
            "Lưu thất bại, không được để trống đỏ ô nào",
            "error"
          );
        } else {
          Swal.fire("Thông báo", "Lưu thành công", "success");
        }
      }
    );
  } else {
    Swal.fire("Thông báo", "Chọn ít nhất 1 G_CODE để SET !", "error");
  }
};
export const f_pdBanVe = async (codeList: CODE_FULL_INFO[], value: string) => {
  if (codeList.length >= 1) {
    checkBP(
      getUserData(),
      ["QC"],
      ["Leader", "Sub Leader"],
      ["ALL"],
      async () => {
        for (let i = 0; i < codeList.length; i++) {
          await generalQuery("pdbanve", {
            G_CODE: codeList[i].G_CODE,
            VALUE: value,
          })
            .then((response) => {
              if (response.data.tk_status !== "NG") {
              } else {
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
        Swal.fire("Thông báo", "Phê duyệt Bản Vẽ THÀNH CÔNG", "success");
      }
    );
  } else {
    Swal.fire("Thông báo", "Chọn ít nhất 1 G_CODE để Phê Duyệt !", "error");
  }
};
export const f_handleSaveLossSX = async (codeList: CODE_FULL_INFO[]) => {
  if (codeList.length >= 1) {
    checkBP(getUserData(), ["SX"], ["ALL"], ["ALL"], async () => {
      let err_code: string = "0";
      for (let i = 0; i < codeList.length; i++) {
        await generalQuery("saveLOSS_SETTING_SX", {
          G_CODE: codeList[i].G_CODE,
          LOSS_ST_SX1: codeList[i].LOSS_ST_SX1,
          LOSS_ST_SX2: codeList[i].LOSS_ST_SX2,
          LOSS_ST_SX3: codeList[i].LOSS_ST_SX3,
          LOSS_ST_SX4: codeList[i].LOSS_ST_SX4,
        })
          .then((response) => {
            //console.log(response.data.tk_status);
            if (response.data.tk_status !== "NG") {
            } else {
              err_code = "1";
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
      if (err_code === "1") {
        Swal.fire(
          "Thông báo",
          "Lưu thất bại, không được để trống đỏ ô nào",
          "error"
        );
      } else {
        Swal.fire("Thông báo", "Lưu thành công", "success");
      }
    });
  } else {
    Swal.fire("Thông báo", "Chọn ít nhất 1 G_CODE để SET !", "error");
  }
};
export const f_loadLeadtimeData = async () => {
  let kq: LEADTIME_DATA[] = [];
  await generalQuery("loadLeadtimeData", {})
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        const loadeddata: LEADTIME_DATA[] = response.data.data.map(
          (element: LEADTIME_DATA, index: number) => {
            return {
              ...element,
              PROD_REQUEST_DATE: moment
                .utc(element.PROD_REQUEST_DATE)
                .format("YYYY-MM-DD"),
              DELIVERY_DT: moment.utc(element.DELIVERY_DT).format("YYYY-MM-DD"),
              id: index,
            };
          }
        );
        kq = loadeddata;
      } else {
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};
export const f_loadDMSX = async (G_CODE: string) => {
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
export const f_updateO301_OUT_CFM_QTY = async (PLAN_ID: string) => {
  await generalQuery("updateO301_OUT_CFM_QTY_FROM_O302", {
    PLAN_ID: PLAN_ID,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
export const f_updateUSE_YN_I222_RETURN_NVL = async (
  M_LOT_NO: string,
  PLAN_ID: string,
  UPD_EMPL: string
) => {
  let kq: string = "";
  await generalQuery("updateUSE_YN_I222_RETURN_NVL", {
    M_LOT_NO: M_LOT_NO,
    PLAN_ID: PLAN_ID,
    UPD_EMPL: UPD_EMPL,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {
      console.log(error);
      kq = error;
    });
  return kq;
};
export const f_insertO302 = async (DATA: any) => {
  let err_code: string = "";
  await generalQuery("insert_O302", {
    OUT_DATE: DATA.OUT_DATE,
    OUT_NO: DATA.OUT_NO,
    OUT_SEQ: DATA.OUT_SEQ,
    M_LOT_NO: DATA.M_LOT_NO,
    LOC_CD: DATA.LOC_CD,
    M_CODE: DATA.M_CODE,
    OUT_CFM_QTY: DATA.OUT_CFM_QTY,
    WAHS_CD: DATA.WAHS_CD,
    REMARK: DATA.REMARK,
    USE_YN: DATA.USE_YN,
    INS_EMPL: DATA.INS_EMPL,
    FACTORY: DATA.FACTORY,
    CUST_CD: DATA.CUST_CD,
    ROLL_QTY: DATA.ROLL_QTY,
    OUT_DATE_THUCTE: DATA.OUT_DATE_THUCTE,
    IN_DATE_O302: DATA.IN_DATE_O302,
    PLAN_ID: DATA.PLAN_ID,
    SOLANOUT: DATA.SOLANOUT,
    LIEUQL_SX: DATA.LIEUQL_SX,
    INS_RECEPTION: DATA.INS_RECEPTION,
    FSC_O302: DATA.FSC_O302,
    FSC_GCODE: DATA.FSC_GCODE,
    FSC_MCODE: DATA.FSC_MCODE,
  })
    .then(async (response) => {
      if (response.data.tk_status !== "NG") {
        let kq_update_use_yn_i222_return_nvl =
          await f_updateUSE_YN_I222_RETURN_NVL(
            DATA.M_LOT_NO,
            DATA.PLAN_ID,
            DATA.INS_EMPL
          );
        if (DATA.LIEUQL_SX === 1) {
          if (kq_update_use_yn_i222_return_nvl !== "") {
            return kq_update_use_yn_i222_return_nvl;
          }
          let kq_nhapkhoao = await f_nhapkhoao({
            FACTORY: DATA.FACTORY,
            PHANLOAI: "N",
            PLAN_ID_INPUT: DATA.PLAN_ID,
            PLAN_ID_SUDUNG: null,
            M_CODE: DATA.M_CODE,
            M_LOT_NO: DATA.M_LOT_NO,
            ROLL_QTY: DATA.ROLL_QTY,
            IN_QTY: DATA.OUT_CFM_QTY,
            TOTAL_IN_QTY: DATA.OUT_CFM_QTY,
            USE_YN: "O",
            FSC: DATA.FSC_O302,
            FSC_MCODE: DATA.FSC_MCODE,
            FSC_GCODE: DATA.FSC_GCODE,
          });
          if (!kq_nhapkhoao) {
            return "Lỗi: Nhập kho main bị lỗi";
          }
          let kq_xuatkhoao = await f_xuatkhoao({
            FACTORY: DATA.FACTORY,
            PHANLOAI: "N",
            PLAN_ID_INPUT: DATA.PLAN_ID,
            PLAN_ID_OUTPUT: DATA.PLAN_ID,
            M_CODE: DATA.M_CODE,
            M_LOT_NO: DATA.M_LOT_NO,
            ROLL_QTY: DATA.ROLL_QTY,
            OUT_QTY: DATA.OUT_CFM_QTY,
            TOTAL_OUT_QTY: DATA.OUT_CFM_QTY,
            USE_YN: "O",
            REMARK: "WEB_OUT",
          });
          if (!kq_xuatkhoao) {
            return "Lỗi: Xuất kho main bị lỗi";
          }
          await f_updateDKXLPLAN(DATA.PLAN_ID);
        } else {
          let kq_nhapkhoao = await f_nhapkhosubao({
            FACTORY: DATA.FACTORY,
            PHANLOAI: "N",
            PLAN_ID_INPUT: DATA.PLAN_ID,
            PLAN_ID_SUDUNG: DATA.PLAN_ID,
            M_CODE: DATA.M_CODE,
            M_LOT_NO: DATA.M_LOT_NO,
            ROLL_QTY: DATA.ROLL_QTY,
            IN_QTY: DATA.OUT_CFM_QTY,
            TOTAL_IN_QTY: DATA.OUT_CFM_QTY,
            USE_YN: "X",
            FSC: DATA.FSC_O302,
            FSC_MCODE: DATA.FSC_MCODE,
            FSC_GCODE: DATA.FSC_GCODE,
          });
          if (!kq_nhapkhoao) {
            return "Lỗi: Nhập kho main bị lỗi";
          }
        }
      } else {
        err_code += `Lỗi: ${response.data.message} | `;
      }
    })
    .catch((error) => {
      //console.log(error);
    });
  return err_code;
};
export const f_handle_toggleMachineActiveStatus = async (
  EQ_CODE: string,
  EQ_ACTIVE: string
) => {
  let kq: boolean = false;
  await generalQuery("toggleMachineActiveStatus", {
    EQ_CODE: EQ_CODE,
    EQ_ACTIVE: EQ_ACTIVE,
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
export const f_addMachine = async (DATA: any) => {
  let kq: boolean = false;
  await generalQuery("addMachine", {
    FACTORY: DATA.FACTORY,
    EQ_CODE: DATA.EQ_CODE,
    EQ_NAME: DATA.EQ_NAME,
    EQ_ACTIVE: DATA.EQ_ACTIVE,
    EQ_OP: DATA.EQ_OP,
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
export const f_deleteMachine = async (DATA: any) => {
  let kq: boolean = false;
  await generalQuery("deleteMachine", {
    EQ_CODE: DATA.EQ_CODE,
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
export const f_addProdProcessData = async (DATA: any) => {
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
export const f_addProdProcessDataQLSX = async (DATA: any) => {
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
export const f_updateProdProcessData = async (DATA: any) => {
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
export const f_updateProdProcessDataQLSX = async (DATA: any) => {
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
export const f_deleteProdProcessData = async (DATA: any) => {
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
export const f_checkProcessNumberContinuos = async (
  DATA: PROD_PROCESS_DATA[]
) => {
  let kq: boolean = true;
  for (let i = 0; i < DATA.length; i++) {
    if (DATA[i].PROCESS_NUMBER !== i + 1) {
      kq = false;
      break;
    }
  }
  return kq;
};
export const f_checkEQ_SERIES_Exist_In_EQ_SERIES_LIST = async (
  DATA: PROD_PROCESS_DATA[],
  machineList: MACHINE_LIST[]
) => {
  //console.log('checkEQ_SERIES_Exist_In_EQ_SERIES_LIST', DATA, machineList);
  let kq: boolean = true;
  for (let i = 0; i < DATA.length; i++) {
    //console.log('check', machineList.find(item => item.EQ_NAME === DATA[i].EQ_SERIES))
    if (
      machineList.find((item) => item.EQ_NAME === DATA[i].EQ_SERIES) ===
      undefined
    ) {
      kq = false;
      break;
    }
  }
  //console.log('checkEQ_SERIES_Exist_In_EQ_SERIES_LIST', kq);
  return kq;
};
export const f_deleteProcessNotInCurrentListFromDataBase = async (
  DATA: PROD_PROCESS_DATA[]
) => {
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
export const f_checkProcessExist = async (DATA: PROD_PROCESS_DATA) => {
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
export const f_addProcessDataTotal = async (DATA: PROD_PROCESS_DATA[]) => {
  for (let i = 0; i < DATA.length; i++) {
    if (await f_checkProcessExist(DATA[i])) {
      await f_updateProdProcessData(DATA[i]);
    } else {
      await f_addProdProcessData(DATA[i]);
    }
  }
  if (DATA.length > 0) {
    Swal.fire(
      "Thông báo",
      "Cập nhật thành công, HÃY KIỂM TRA LẠI ĐỊNH MỨC CỦA TỪNG CÔNG ĐOẠN  !!!",
      "success"
    );
  } else {
    Swal.fire("Thông báo", "Không có dữ liệu cập nhật", "error");
  }
};
export const f_addProcessDataTotalQLSX = async (DATA: PROD_PROCESS_DATA[]) => {
  for (let i = 0; i < DATA.length; i++) {
    if (await f_checkProcessExist(DATA[i])) {
      await f_updateProdProcessDataQLSX(DATA[i]);
    } else {
      await f_addProdProcessDataQLSX(DATA[i]);
    }
  }
  if (DATA.length > 0) {
    Swal.fire(
      "Thông báo",
      "Cập nhật thành công, HÃY KIỂM TRA LẠI ĐỊNH MỨC CỦA TỪNG CÔNG ĐOẠN  !!!",
      "success"
    );
  } else {
    Swal.fire("Thông báo", "Không có dữ liệu cập nhật", "error");
  }
};
export const f_loadProdProcessData = async (G_CODE: string) => {
  let kq: PROD_PROCESS_DATA[] = [];
  await generalQuery("loadProdProcessData", {
    G_CODE: G_CODE,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        kq = response.data.data.map(
          (element: PROD_PROCESS_DATA, index: number) => {
            return { ...element, id: index };
          }
        );
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};
export const f_load_SX_NV_KPI_DATA_Daily = async (DATA: any) => {
  let kq: SX_KPI_NV_DATA[] = [];
  await generalQuery("loadSX_KPI_NV_DATA_Daily", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        let loaded_data: SX_KPI_NV_DATA[] = response.data.data.map(
          (element: SX_KPI_NV_DATA, index: number) => {
            return {
              ...element,
              SX_DATE: moment.utc(element.SX_DATE).format("YYYY-MM-DD"),
              id: index,
            };
          }
        );
        kq = loaded_data;
      } else {
        kq = [];
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_load_SX_NV_KPI_DATA_Weekly = async (DATA: any) => {
  let kq: SX_KPI_NV_DATA[] = [];
  await generalQuery("loadSX_KPI_NV_DATA_Weekly", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        let loaded_data: SX_KPI_NV_DATA[] = response.data.data.map(
          (element: SX_KPI_NV_DATA, index: number) => {
            return {
              ...element,
              id: index,
            };
          }
        );
        kq = loaded_data;
      } else {
        kq = [];
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_load_SX_NV_KPI_DATA_Monthly = async (DATA: any) => {
  let kq: SX_KPI_NV_DATA[] = [];
  await generalQuery("loadSX_KPI_NV_DATA_Monthly", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        let loaded_data: SX_KPI_NV_DATA[] = response.data.data.map(
          (element: SX_KPI_NV_DATA, index: number) => {
            return {
              ...element,
              id: index,
            };
          }
        );
        kq = loaded_data;
      } else {
        kq = [];
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_load_SX_NV_KPI_DATA_Yearly = async (DATA: any) => {
  let kq: SX_KPI_NV_DATA[] = [];
  await generalQuery("loadSX_KPI_NV_DATA_Yearly", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        let loaded_data: SX_KPI_NV_DATA[] = response.data.data.map(
          (element: SX_KPI_NV_DATA, index: number) => {
            return {
              ...element,
              id: index,
            };
          }
        );
        kq = loaded_data;
      } else {
        kq = [];
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_load_TREND_NGUOI_HANG_DATA_DAILY = async (DATA: any) => {
  let kq: TREND_NGUOI_HANG_DATA[] = [];
  await generalQuery("trendNguoi_Hang_Ktra_daily", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        let loaded_data: TREND_NGUOI_HANG_DATA[] = response.data.data.map(
          (element: TREND_NGUOI_HANG_DATA, index: number) => {
            return {
              ...element,
              INSPECT_DATE: moment
                .utc(element.INSPECT_DATE)
                .format("YYYY-MM-DD"),
              id: index,
            };
          }
        );
        kq = loaded_data;
      } else {
        kq = [];
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_load_TREND_NGUOI_HANG_DATA_WEEKLY = async (DATA: any) => {
  let kq: TREND_NGUOI_HANG_DATA[] = [];
  await generalQuery("trendNguoi_Hang_Ktra_weekly", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        let loaded_data: TREND_NGUOI_HANG_DATA[] = response.data.data.map(
          (element: TREND_NGUOI_HANG_DATA, index: number) => {
            return {
              ...element,
              id: index,
            };
          }
        );
        kq = loaded_data;
      } else {
        kq = [];
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_load_TREND_NGUOI_HANG_DATA_MONTHLY = async (DATA: any) => {
  let kq: TREND_NGUOI_HANG_DATA[] = [];
  await generalQuery("trendNguoi_Hang_Ktra_monthly", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        let loaded_data: TREND_NGUOI_HANG_DATA[] = response.data.data.map(
          (element: TREND_NGUOI_HANG_DATA, index: number) => {
            return {
              ...element,
              id: index,
            };
          }
        );
        kq = loaded_data;
      } else {
        kq = [];
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_load_TREND_NGUOI_HANG_DATA_YEARLY = async (DATA: any) => {
  let kq: TREND_NGUOI_HANG_DATA[] = [];
  await generalQuery("trendNguoi_Hang_Ktra_yearly", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        let loaded_data: TREND_NGUOI_HANG_DATA[] = response.data.data.map(
          (element: TREND_NGUOI_HANG_DATA, index: number) => {
            return {
              ...element,
              id: index,
            };
          }
        );
        kq = loaded_data;
      } else {
        kq = [];
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_load_YCSX_GAP_RATE_DATA = async (DATA: any) => {
  let kq: CNT_GAP_DATA[] = [];
  await generalQuery("loadYCSX_GAP_RATE_DATA", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        let loaded_data: CNT_GAP_DATA[] = response.data.data.map(
          (element: CNT_GAP_DATA, index: number) => {
            return {
              ...element,
              id: index,
            };
          }
        );
        kq = loaded_data;
      } else {
        kq = [];
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_load_SX_GAP_RATE_DATA = async (DATA: any) => {
  let kq: CNT_GAP_DATA[] = [];
  await generalQuery("loadSX_GAP_RATE_DATA", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        let loaded_data: CNT_GAP_DATA[] = response.data.data.map(
          (element: CNT_GAP_DATA, index: number) => {
            return {
              ...element,
              id: index,
            };
          }
        );
        kq = loaded_data;
      } else {
        kq = [];
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_load_KT_GAP_RATE_DATA = async (DATA: any) => {
  let kq: CNT_GAP_DATA[] = [];
  await generalQuery("loadKT_GAP_RATE_DATA", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        let loaded_data: CNT_GAP_DATA[] = response.data.data.map(
          (element: CNT_GAP_DATA, index: number) => {
            return {
              ...element,
              id: index,
            };
          }
        );
        kq = loaded_data;
      } else {
        kq = [];
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_load_ALL_GAP_RATE_DATA = async (DATA: any) => {
  let kq: CNT_GAP_DATA[] = [];
  await generalQuery("loadALL_GAP_RATE_DATA", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        let loaded_data: CNT_GAP_DATA[] = response.data.data.map(
          (element: CNT_GAP_DATA, index: number) => {
            return {
              ...element,
              id: index,
            };
          }
        );
        kq = loaded_data;
      } else {
        kq = [];
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_load_ALL_HOAN_THANH_TRUOC_HAN_RATE_DATA = async (DATA: any) => {
  let kq: CNT_GAP_DATA[] = [];
  await generalQuery("loadALL_HOAN_THANH_TRUOC_HAN_RATE_DATA", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        let loaded_data: CNT_GAP_DATA[] = response.data.data.map(
          (element: CNT_GAP_DATA, index: number) => {
            return {
              ...element,
              id: index,
            };
          }
        );
        kq = loaded_data;
      } else {
        kq = [];
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_load_BTP_Auto = async () => {
  let kq: BTP_AUTO_DATA2[] = [];
  await generalQuery("loadBTPAuto2", {})
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        kq = response.data.data.map((element: any, index: number) => {
          return { ...element, id: index };
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};
export const f_loadRollLossData = async (
  FROM_DATE: string,
  TO_DATE: string
) => {
  let kq: SX_LOSS_ROLL_DATA[] = [];
  await generalQuery("checkRollLieuBienMat", {
    FROM_DATE: FROM_DATE,
    TO_DATE: TO_DATE,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        kq = response.data.data.map((element: any, index: number) => {
          return { ...element, id: index };
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};
export const f_loadRollLossDataDaily = async (
  FROM_DATE: string,
  TO_DATE: string
) => {
  let kq: SX_LOSS_ROLL_DATA[] = [];
  await generalQuery("checkRollLieuBienMatDaily", {
    FROM_DATE: FROM_DATE,
    TO_DATE: TO_DATE,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        kq = response.data.data.map((element: any, index: number) => {
          return {
            ...element,
            OUT_DATE:
              element.OUT_DATE !== null
                ? moment.utc(element.OUT_DATE).format("YYYY-MM-DD")
                : "",
            id: index,
          };
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};
export const f_load_BTP_Summary_Auto = async () => {
  let kq: BTP_AUTO_DATA_SUMMARY[] = [];
  await generalQuery("loadBTPSummaryAuto2", {})
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        kq = response.data.data.map((element: any, index: number) => {
          return { ...element, id: index };
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};
export const f_getProductionPlanLeadTimeCapaData = async (
  PLAN_DATE: string
) => {
  let kq: PROD_PLAN_CAPA_DATA[] = [];
  await generalQuery("getProductionPlanCapaData", { PLAN_DATE: PLAN_DATE })
    .then((response) => {
      //console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        const loaded_data: PROD_PLAN_CAPA_DATA[] = response.data.data.map(
          (element: PROD_PLAN_CAPA_DATA, index: number) => {
            return {
              ...element,
              PROD_DATE:
                element.PROD_DATE !== null
                  ? moment
                      .utc(PLAN_DATE)
                      .add(Number(element.PROD_DATE.substring(2, 4)) - 1, "day")
                      .format("YYYY-MM-DD")
                  : "",
              id: index,
            };
          }
        );
        kq = loaded_data;
      } else {
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};
export const checkPLAN_ID = async (PLAN_ID: string) => {
  let kq: any = [];
  await generalQuery("checkPLAN_ID", { PLAN_ID: PLAN_ID })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        kq = response.data.data;
      } else {
        kq = [];
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_deleteLongtermPlan = async (DATA: LONGTERM_PLAN_DATA) => {
  let kq: string = "";
  await generalQuery("deleteLongtermPlan", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_insertLongTermPlan = async (
  DATA: LONGTERM_PLAN_DATA,
  PLAN_DATE: string
) => {
  let kq: string = "";
  console.log(PLAN_DATE);
  let insertData = {
    ...DATA,
    PLAN_DATE: PLAN_DATE,
  };
  console.log("insertData", insertData);
  await generalQuery("insertKHSXDAIHAN", insertData)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        f_updateLongTermPlan(insertData);
        kq = response.data.message;
      }
    })
    .catch((error) => {
      kq = error.message;
      console.log(error);
    });
  return kq;
};
export const f_updateLongTermPlan = async (DATA: LONGTERM_PLAN_DATA) => {
  let kq: string = "";
  await generalQuery("updateKHSXDAIHAN", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {
      kq = error.message;
      console.log(error);
    });
  return kq;
};
export const f_moveLongTermPlan = async (
  FROM_DATE: string,
  TO_DATE: string
) => {
  let kq: string = "";
  await generalQuery("moveKHSXDAIHAN", {
    FROM_DATE: FROM_DATE,
    TO_DATE: TO_DATE,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
};
export const f_deleteNotExistLongTermPlan = async (PLAN_DATE: string) => {
  let kq: string = "";
  await generalQuery("deleteNotExistKHSXDAIHAN", {
    PLAN_DATE: PLAN_DATE,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
};
export const f_loadLongTermPlan = async (PLAN_DATE: string) => {
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
  if (kq.length === 0) {
    Swal.fire("Thông báo", "Không có dòng nào", "error");
  }
  return kq;
};
export const f_cancelProductionLot = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("cancelProductionLot", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};

export const f_loadDefectProcessData = async (
  G_CODE: string,
  PROCESS_NUMBER: number
) => {
  let kq: DEFECT_PROCESS_DATA[] = [];
  await generalQuery("loadDefectProcessData", {
    G_CODE: G_CODE,
    PROCESS_NUMBER: PROCESS_NUMBER,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        kq = response.data.data;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};


export const f_load_SX_Daily_Loss_Trend = async (DATA: any) => {
  let kq: SX_TREND_LOSS_DATA[] = [];
  await generalQuery('datasxdailylosstrend', DATA)
    .then((response) => {
      if (response.data.tk_status !== 'NG') {
        const loadeddata: SX_TREND_LOSS_DATA[] = response.data.data.map((element: SX_TREND_LOSS_DATA, index: number) => {
          return {
            ...element,
            LOSS_RATE: 1 - (element.PURE_OUTPUT * 1.0) / element.PURE_INPUT,
            INPUT_DATE: moment.utc(element.INPUT_DATE).format('YYYY-MM-DD'),
          };
        });
        kq = loadeddata;
      }
    })
    .catch((error) => {
      console.log(error);
    });   
  return kq;
};

export const f_load_SX_Weekly_Loss_Trend = async (DATA: any) => {
  let kq: SX_TREND_LOSS_DATA[] = [];
  await generalQuery('datasxweeklylosstrend', DATA)
    .then((response) => {
      if (response.data.tk_status !== 'NG') {
        const loadeddata: SX_TREND_LOSS_DATA[] = response.data.data.map((element: SX_TREND_LOSS_DATA, index: number) => {
          return {
            ...element,
            LOSS_RATE: 1 - (element.PURE_OUTPUT * 1.0) / element.PURE_INPUT,
            INPUT_DATE: moment.utc(element.INPUT_DATE).format('YYYY-MM-DD'),
          };
        });
        kq = loadeddata;
      }
    })
    .catch((error) => {
      console.log(error);
    });  
  return kq;
};

export const f_load_SX_Monthly_Loss_Trend = async (DATA: any) => {
  let kq: SX_TREND_LOSS_DATA[] = [];
  await generalQuery('datasxmonthlylosstrend', DATA)
    .then((response) => {
      if (response.data.tk_status !== 'NG') {
        const loadeddata: SX_TREND_LOSS_DATA[] = response.data.data.map((element: SX_TREND_LOSS_DATA, index: number) => {
          return {
            ...element,
            LOSS_RATE: 1 - (element.PURE_OUTPUT * 1.0) / element.PURE_INPUT,
            INPUT_DATE: moment.utc(element.INPUT_DATE).format('YYYY-MM-DD'),
          };
        });
        kq = loadeddata;
      }
    })
    .catch((error) => {
      console.log(error);
    });    
  return kq;
};

export const f_load_SX_Yearly_Loss_Trend = async (DATA: any) => {
  let kq: SX_TREND_LOSS_DATA[] = [];
  await generalQuery('datasxyearlylosstrend', DATA)
    .then((response) => {
      if (response.data.tk_status !== 'NG') {
        const loadeddata: SX_TREND_LOSS_DATA[] = response.data.data.map((element: SX_TREND_LOSS_DATA, index: number) => {
          return {
            ...element,
            LOSS_RATE: 1 - (element.PURE_OUTPUT * 1.0) / element.PURE_INPUT,
            INPUT_DATE: moment.utc(element.INPUT_DATE).format('YYYY-MM-DD'),
          };
        });
        kq = loadeddata;
      }
    })
    .catch((error) => {
      console.log(error);
    });   
  return kq;
};

export const f_load_dailyAchive_data = async (DATA: any) => {
  let kq: SX_ACHIVE_DATA[] = [];
  await generalQuery('sxdailyachivementtrending', DATA)
    .then((response) => {
      if (response.data.tk_status !== 'NG') {
        const loadeddata: SX_ACHIVE_DATA[] = response.data.data.map((element: SX_ACHIVE_DATA, index: number) => {
          return {
            ...element,
            ACHIVE_RATE: (element.SX_RESULT * 1.0) / element.PLAN_QTY,
            SX_DATE: moment.utc(element.SX_DATE).format('YYYY-MM-DD'),
          };
        });
        kq = loadeddata;
      }
    })
    .catch((error) => {
      console.log(error);
    });   
  return kq;
};

export const f_load_weeklyAchive_data = async (DATA: any) => {
  let kq: SX_ACHIVE_DATA[] = [];
  await generalQuery('sxweeklyachivementtrending', DATA)
    .then((response) => {
      if (response.data.tk_status !== 'NG') {
        const loadeddata: SX_ACHIVE_DATA[] = response.data.data.map((element: SX_ACHIVE_DATA, index: number) => {
          return {
            ...element,
            ACHIVE_RATE: (element.SX_RESULT * 1.0) / element.PLAN_QTY,
            SX_DATE: moment.utc(element.SX_DATE).format('YYYY-MM-DD'),
          };
        });
        kq = loadeddata;
      }
    })
    .catch((error) => {
      console.log(error);
    });   
  return kq;
};

export const f_load_monthlyAchive_data = async (DATA: any) => {
  let kq: SX_ACHIVE_DATA[] = [];
  await generalQuery('sxmonthlyachivementtrending', DATA)
    .then((response) => {
      if (response.data.tk_status !== 'NG') {
        const loadeddata: SX_ACHIVE_DATA[] = response.data.data.map((element: SX_ACHIVE_DATA, index: number) => {
          return {
            ...element,
            ACHIVE_RATE: (element.SX_RESULT * 1.0) / element.PLAN_QTY,
            SX_DATE: moment.utc(element.SX_DATE).format('YYYY-MM-DD'),
          };
        });
        kq = loadeddata;
      }
    })
    .catch((error) => {
      console.log(error);
    });   
  return kq;
};

export const f_load_yearlyAchive_data = async (DATA: any) => {
  let kq: SX_ACHIVE_DATA[] = [];
  await generalQuery('sxyearlyachivementtrending', DATA)
    .then((response) => {
      if (response.data.tk_status !== 'NG') {
        const loadeddata: SX_ACHIVE_DATA[] = response.data.data.map((element: SX_ACHIVE_DATA, index: number) => {
          return {
            ...element,
            ACHIVE_RATE: (element.SX_RESULT * 1.0) / element.PLAN_QTY,
            SX_DATE: moment.utc(element.SX_DATE).format('YYYY-MM-DD'),
          };
        });
        kq = loadeddata;
      }
    })
    .catch((error) => {
      console.log(error);
    });   
  return kq;
};

export const f_load_dailyEff_data = async (DATA: any) => {
  let kq:{efficiency: PRODUCTION_EFFICIENCY_DATA[], overview: PRODUCTION_EFFICIENCY_DATA} = {efficiency: [], overview: {
    ALVB_TIME: 0,
    HIEU_SUAT_TIME:0,
    LOSS_TIME:0,
    LOSS_TIME_RATE:0,
    OPERATION_RATE:0,
    PURE_RUN_RATE:0,
    PURE_RUN_TIME:0,
    RUN_TIME_SX:0,
    SETTING_TIME:0,
    SETTING_TIME_RATE:0,
    TOTAL_TIME:0,
  }};
  await generalQuery('dailyEQEffTrending', DATA)
    .then((response) => {
      if (response.data.tk_status !== 'NG') {
        const loadeddata: PRODUCTION_EFFICIENCY_DATA[] = response.data.data.map(
                    (element: PRODUCTION_EFFICIENCY_DATA, index: number) => {
                      return {
                        ...element,
                        PURE_RUN_RATE: element.PURE_RUN_TIME * 1.0 / element.TOTAL_TIME,
                        OPERATION_RATE: element.TOTAL_TIME*1.0/element.ALVB_TIME,
                        SX_DATE: moment.utc(element.SX_DATE).format("YYYY-MM-DD"),
                      };
                    },
                  );  
                  let temp_aff: PRODUCTION_EFFICIENCY_DATA =  {
                    ALVB_TIME: 0,
                    HIEU_SUAT_TIME:0,
                    LOSS_TIME:0,
                    LOSS_TIME_RATE:0,
                    OPERATION_RATE:0,
                    PURE_RUN_RATE:0,
                    PURE_RUN_TIME:0,
                    RUN_TIME_SX:0,
                    SETTING_TIME:0,
                    SETTING_TIME_RATE:0,
                    TOTAL_TIME:0,
                  }
                  for(let i=0;i<loadeddata.length;i++) 
                  {
                    temp_aff.ALVB_TIME += loadeddata[i].ALVB_TIME;
                    temp_aff.LOSS_TIME += loadeddata[i].LOSS_TIME;
                    temp_aff.PURE_RUN_TIME += loadeddata[i].PURE_RUN_TIME;
                    temp_aff.RUN_TIME_SX += loadeddata[i].RUN_TIME_SX;
                    temp_aff.SETTING_TIME += loadeddata[i].SETTING_TIME;
                    temp_aff.TOTAL_TIME += loadeddata[i].TOTAL_TIME;
                  }
                  temp_aff.OPERATION_RATE = temp_aff.TOTAL_TIME/temp_aff.ALVB_TIME; // ti le van hanh
                  temp_aff.HIEU_SUAT_TIME = temp_aff.RUN_TIME_SX/temp_aff.TOTAL_TIME; // hieu suat may
                  temp_aff.SETTING_TIME_RATE = temp_aff.PURE_RUN_TIME/temp_aff.TOTAL_TIME; //hieu suat san xuat
        kq.efficiency = loadeddata;
        kq.overview = temp_aff;
      }
    })
    .catch((error) => {
      console.log(error);
    });   
  return kq;
};
export const f_load_weeklyEff_data = async (DATA: any) => {
  let kq: PRODUCTION_EFFICIENCY_DATA[] = [];
  await generalQuery('weeklyEQEffTrending', DATA)
    .then((response) => {
      if (response.data.tk_status !== 'NG') {
        const loadeddata: PRODUCTION_EFFICIENCY_DATA[] = response.data.data.map((element: PRODUCTION_EFFICIENCY_DATA, index: number) => {
          return {
            ...element,
            PURE_RUN_RATE: (element.PURE_RUN_TIME * 1.0) / element.TOTAL_TIME,
            OPERATION_RATE: (element.TOTAL_TIME * 1.0) / element.ALVB_TIME,
            SX_DATE: moment.utc(element.SX_DATE).format('YYYY-MM-DD'),
          };
        });
        kq = loadeddata;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};

export const f_load_monthlyEff_data = async (DATA: any) => {
  let kq: PRODUCTION_EFFICIENCY_DATA[] = [];
  await generalQuery('monthlyEQEffTrending', DATA)
    .then((response) => {
      if (response.data.tk_status !== 'NG') {
        const loadeddata: PRODUCTION_EFFICIENCY_DATA[] = response.data.data.map((element: PRODUCTION_EFFICIENCY_DATA, index: number) => {
          return {
            ...element,
            PURE_RUN_RATE: (element.PURE_RUN_TIME * 1.0) / element.TOTAL_TIME,
            OPERATION_RATE: (element.TOTAL_TIME * 1.0) / element.ALVB_TIME,
            SX_DATE: moment.utc(element.SX_DATE).format('YYYY-MM-DD'),
          };
        });
        kq = loadeddata;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};

export const f_load_yearlyEff_data = async (DATA: any) => {
  let kq: PRODUCTION_EFFICIENCY_DATA[] = [];
  await generalQuery('yearlyEQEffTrending', DATA)
    .then((response) => {
      if (response.data.tk_status !== 'NG') {
        const loadeddata: PRODUCTION_EFFICIENCY_DATA[] = response.data.data.map((element: PRODUCTION_EFFICIENCY_DATA, index: number) => {
          return {
            ...element,
            PURE_RUN_RATE: (element.PURE_RUN_TIME * 1.0) / element.TOTAL_TIME,
            OPERATION_RATE: (element.TOTAL_TIME * 1.0) / element.ALVB_TIME,
            SX_DATE: moment.utc(element.SX_DATE).format('YYYY-MM-DD'),
          };
        });
        kq = loadeddata;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};

export const f_loadPlanLossData = async (DATA: any) => {
  let kq: PLAN_LOSS_DATA[] = [];
  await generalQuery('traDataPlanLossSX', DATA)
    .then((response) => {
      if (response.data.tk_status !== 'NG') {
        const loadeddata: PLAN_LOSS_DATA[] = response.data.data.map(
          (element: PLAN_LOSS_DATA, index: number) => {
            return {
              ...element,
              id: index
            };
          },
        );
        kq = loadeddata;
      }
    })
    .catch((error) => {
      console.log(error);
    });   
  return kq;
};

export const f_load_SXLossTimeByReason = async (DATA: any) => {
  let kq: SX_LOSSTIME_REASON_DATA[] = [];
  await generalQuery('sxLossTimeByReason', DATA)
    .then((response) => {
      if (response.data.tk_status !== 'NG') {
        const loadeddata: SX_LOSSTIME_REASON_DATA[] = response.data.data.map(
          (element: SX_LOSSTIME_REASON_DATA, index: number) => {
            return {
              ...element,
              id: index
            };
          },
        );
        kq = loadeddata;
      }
    })
    .catch((error) => {
      console.log(error);
    });   
  return kq;
};

export const f_load_SXLossTimeByEmpl =  async (DATA: any) => {
  let kq: SX_LOSSTIME_BY_EMPL[] = [];
  await generalQuery('sxLossTimeByEmpl', DATA)
    .then((response) => {
      if (response.data.tk_status !== 'NG') {
        const loadeddata: SX_LOSSTIME_BY_EMPL[] = response.data.data.map(
          (element: SX_LOSSTIME_BY_EMPL, index: number) => {
            return {
              ...element,
              id: index
            };
          },
        );
        kq = loadeddata;
      }
    })
    .catch((error) => {
      console.log(error);
    });   
  return kq;
};
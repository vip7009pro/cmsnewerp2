import { generalQuery } from "../../../../api/Api";
import {
  DEFECT_PROCESS_DATA,
  PROD_PROCESS_DATA,
  QLSXCHITHIDATA,
  QLSXPLANDATA,
  DINHMUC_QSLX,
} from "../interfaces/khsxInterface";
import { BOMSX_DATA } from "../../../rnd/interfaces/rndInterface";

const checkEQvsPROCESS = (EQ1: string, EQ2: string, EQ3: string, EQ4: string) => {
  let maxprocess: number = 0;
  if (["NA", "NO", "", null].indexOf(EQ1 as any) === -1) maxprocess++;
  if (["NA", "NO", "", null].indexOf(EQ2 as any) === -1) maxprocess++;
  if (["NA", "NO", "", null].indexOf(EQ3 as any) === -1) maxprocess++;
  if (["NA", "NO", "", null].indexOf(EQ4 as any) === -1) maxprocess++;
  return maxprocess;
};

const loadDefectProcessData = async (
  G_CODE: string,
  PROCESS_NUMBER: number
): Promise<DEFECT_PROCESS_DATA[]> => {
  let kq: DEFECT_PROCESS_DATA[] = [];
  await generalQuery("loadDefectProcessData", {
    G_CODE,
    PROCESS_NUMBER,
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

/* ── private helpers (migrated from khsxUtils) ── */

const getPlanMaterialTable = async (PLAN_ID: string): Promise<QLSXCHITHIDATA[]> => {
  let planMaterialTable: QLSXCHITHIDATA[] = [];
  await generalQuery("getchithidatatable", {
    PLAN_ID: PLAN_ID,
  })
    .then((response) => {
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

const getBOMSX = async (G_CODE: string): Promise<BOMSX_DATA[]> => {
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

const calcMaterialMet_New = async (
  PLAN_QTY: number,
  PD: number,
  CAVITY: number,
  LOSS_KT: number,
  IS_SETTING: string,
  LOSS_SX: number,
  UPH: number,
  LOSS_SETTING: number
): Promise<number> => {
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

const calcMaterialMet = async (
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
): Promise<number> => {
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

/* ── public API ── */

const getChiThiTable = async (
  planData: QLSXPLANDATA,
  tempDMData?: DINHMUC_QSLX,
  tempDMYN?: boolean
): Promise<QLSXCHITHIDATA[]> => {
  let M_MET_NEEDED: number = 0;
  let chiThiDataTable: QLSXCHITHIDATA[] = [];
  chiThiDataTable = await getPlanMaterialTable(planData.PLAN_ID);
  if (chiThiDataTable.length > 0) return chiThiDataTable;
  if (tempDMYN !== true) {
    M_MET_NEEDED = await calcMaterialMet(
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
    M_MET_NEEDED = await calcMaterialMet(
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
  let tempBOMSX: BOMSX_DATA[] = await getBOMSX(planData.G_CODE);
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

const getChiThiTable_New = async (
  planData: QLSXPLANDATA,
  processData: PROD_PROCESS_DATA
): Promise<QLSXCHITHIDATA[]> => {
  let M_MET_NEEDED: number = 0;
  let chiThiDataTable: QLSXCHITHIDATA[] = [];
  chiThiDataTable = await getPlanMaterialTable(planData.PLAN_ID);
  if (chiThiDataTable.length > 0) return chiThiDataTable;
  M_MET_NEEDED = await calcMaterialMet_New(
    planData.PLAN_QTY,
    planData.PD ?? 0,
    planData.CAVITY ?? 0,
    planData.LOSS_KT ?? 0,
    planData.IS_SETTING ?? "Y",
    processData.LOSS_SX,
    processData.UPH,
    processData.LOSS_SETTING
  );
  let tempBOMSX: BOMSX_DATA[] = await getBOMSX(planData.G_CODE);
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

const resetChiThiTable = async (
  planData: QLSXPLANDATA,
  tempDMData?: DINHMUC_QSLX,
  tempDMYN?: boolean
): Promise<QLSXCHITHIDATA[]> => {
  let M_MET_NEEDED: number = 0;
  let chiThiDataTable: QLSXCHITHIDATA[] = [];
  console.log("tempDMYN", tempDMYN);
  if (tempDMYN !== true) {
    M_MET_NEEDED = await calcMaterialMet(
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
    M_MET_NEEDED = await calcMaterialMet(
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
  let tempBOMSX: BOMSX_DATA[] = await getBOMSX(planData.G_CODE);
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

const resetChiThiTable_New = async (
  planData: QLSXPLANDATA,
  processData: PROD_PROCESS_DATA
): Promise<QLSXCHITHIDATA[]> => {
  let M_MET_NEEDED: number = 0;
  let chiThiDataTable: QLSXCHITHIDATA[] = [];
  M_MET_NEEDED = await calcMaterialMet_New(
    planData.PLAN_QTY,
    planData.PD ?? 0,
    planData.CAVITY ?? 0,
    planData.LOSS_KT ?? 0,
    planData.IS_SETTING ?? "Y",
    processData.LOSS_SX,
    processData.UPH,
    processData.LOSS_SETTING
  );
  let tempBOMSX: BOMSX_DATA[] = await getBOMSX(planData.G_CODE);
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

export const chiThiService = {
  checkEQvsPROCESS,
  loadDefectProcessData,
  getChiThiTable,
  getChiThiTable_New,
  resetChiThiTable_New,
};

import moment from "moment";
import { generalQuery, getAuditMode } from "../../../../api/Api";
import {
  DAILY_YCSX_RESULT,
  LOSS_TABLE_DATA,
  SX_DATA,
  YCSX_SX_DATA,
  SX_ACHIVE_DATE,
} from "../interfaces/khsxInterface";
import { chiThiService } from "./chiThiService";

export type DataSxFilter = {
  ALLTIME?: boolean;
  FROM_DATE?: string;
  TO_DATE?: string;
  PROD_REQUEST_NO?: string;
  PLAN_ID?: string;
  M_NAME?: string;
  M_CODE?: string;
  G_NAME?: string;
  G_CODE?: string;
  FACTORY?: string;
  PLAN_EQ?: string;
  TRUSAMPLE?: boolean;
  ONLYCLOSE?: boolean;
};

const loadDataSXChiThi = async (
  filter: DataSxFilter
): Promise<{ datasx: SX_DATA[]; summary: LOSS_TABLE_DATA }> => {
  let kq: { datasx: SX_DATA[]; summary: LOSS_TABLE_DATA } = {
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
    ALLTIME: filter.ALLTIME,
    FROM_DATE: filter.FROM_DATE,
    TO_DATE: filter.TO_DATE,
    PROD_REQUEST_NO: filter.PROD_REQUEST_NO,
    PLAN_ID: filter.PLAN_ID,
    M_NAME: filter.M_NAME,
    M_CODE: filter.M_CODE,
    G_NAME: filter.G_NAME,
    G_CODE: filter.G_CODE,
    FACTORY: filter.FACTORY,
    PLAN_EQ: filter.PLAN_EQ,
    TRUSAMPLE: filter.TRUSAMPLE,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        const auditMode = getAuditMode();
        const loaded_data: SX_DATA[] = response.data.data.map(
          (element: SX_DATA, index: number) => {
            const isCNDB = element?.G_NAME?.search("CNDB") !== -1;
            return {
              ...element,
              G_NAME:
                auditMode === 0
                  ? element?.G_NAME
                  : isCNDB
                    ? "TEM_NOI_BO"
                    : element?.G_NAME,
              G_NAME_KD:
                auditMode === 0
                  ? element?.G_NAME_KD
                  : isCNDB
                    ? "TEM_NOI_BO"
                    : element?.G_NAME_KD,
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
                  ? 1 - ((element.INS_INPUT ?? 0) * 1.0) / (element.KETQUASX ?? 0)
                  : 0,
              LOSS_KT:
                (element.INS_INPUT ?? 0) !== 0
                  ? 1 -
                    ((element.INS_OUTPUT ?? 0) * 1.0) /
                      (element.INS_INPUT ?? 0)
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
            loaded_data[i].PROCESS_NUMBER === 1 ? loaded_data[i].ESTIMATED_QTY : 0;
          temp_loss_info.SCANNED_MET2 +=
            loaded_data[i].PROCESS_NUMBER === 2 ? loaded_data[i].USED_QTY : 0;
          temp_loss_info.SCANNED_EA2 +=
            loaded_data[i].PROCESS_NUMBER === 2 ? loaded_data[i].ESTIMATED_QTY : 0;
          temp_loss_info.SCANNED_MET3 +=
            loaded_data[i].PROCESS_NUMBER === 3 ? loaded_data[i].USED_QTY : 0;
          temp_loss_info.SCANNED_EA3 +=
            loaded_data[i].PROCESS_NUMBER === 3 ? loaded_data[i].ESTIMATED_QTY : 0;
          temp_loss_info.SCANNED_MET4 +=
            loaded_data[i].PROCESS_NUMBER === 4 ? loaded_data[i].USED_QTY : 0;
          temp_loss_info.SCANNED_EA4 +=
            loaded_data[i].PROCESS_NUMBER === 4 ? loaded_data[i].ESTIMATED_QTY : 0;

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
          temp_loss_info.INSPECT_MATERIAL_NG += loaded_data[i].INSPECT_MATERIAL_NG;
          temp_loss_info.INSPECT_PROCESS_NG += loaded_data[i].INSPECT_PROCESS_NG;
          temp_loss_info.SX_MARKING_QTY += loaded_data[i].SX_MARKING_QTY;
          temp_loss_info.INSPECTION_OUTPUT += loaded_data[i].INS_OUTPUT;
          temp_loss_info.SX_RESULT += loaded_data[i].KETQUASX_TP ?? 0;
        }

        temp_loss_info.LOSS_INS_OUT_VS_SCANNED_EA =
          temp_loss_info.SCANNED_EA !== 0
            ? 1 - temp_loss_info.INSPECTION_OUTPUT / temp_loss_info.SCANNED_EA
            : 0;
        temp_loss_info.LOSS_INS_OUT_VS_XUATKHO_EA =
          temp_loss_info.XUATKHO_EA !== 0
            ? 1 - temp_loss_info.INSPECTION_OUTPUT / temp_loss_info.XUATKHO_EA
            : 0;

        kq.datasx = loaded_data;
        kq.summary = temp_loss_info;
      } else {
        kq = {
          datasx: [],
          summary: kq.summary,
        };
      }
    })
    .catch((error) => {
      console.log(error);
    });

  return kq;
};

const loadDataSX_YCSX = async (
  filter: DataSxFilter
): Promise<{ datasx: YCSX_SX_DATA[]; summary: LOSS_TABLE_DATA }> => {
  let kq: { datasx: YCSX_SX_DATA[]; summary: LOSS_TABLE_DATA } = {
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
    ALLTIME: filter.ALLTIME,
    FROM_DATE: filter.FROM_DATE,
    TO_DATE: filter.TO_DATE,
    PROD_REQUEST_NO: filter.PROD_REQUEST_NO,
    PLAN_ID: filter.PLAN_ID,
    M_NAME: filter.M_NAME,
    M_CODE: filter.M_CODE,
    G_NAME: filter.G_NAME,
    G_CODE: filter.G_CODE,
    FACTORY: filter.FACTORY,
    PLAN_EQ: filter.PLAN_EQ,
    TRUSAMPLE: filter.TRUSAMPLE,
    ONLYCLOSE: filter.ONLYCLOSE,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        const auditMode = getAuditMode();
        const loaded_data: YCSX_SX_DATA[] = response.data.data.map(
          (element: YCSX_SX_DATA, index: number) => {
            const isCNDB = element?.G_NAME?.search("CNDB") !== -1;
            return {
              ...element,
              G_NAME:
                auditMode === 0
                  ? element?.G_NAME
                  : isCNDB
                    ? "TEM_NOI_BO"
                    : element?.G_NAME,
              G_NAME_KD:
                auditMode === 0
                  ? element?.G_NAME_KD
                  : isCNDB
                    ? "TEM_NOI_BO"
                    : element?.G_NAME_KD,
              TOTAL_LOSS: 1 - (element.INS_OUTPUT * 1.0) / element.ESTIMATED_QTY,
              TOTAL_LOSS2:
                1 - (element.INS_OUTPUT * 1.0) / element.WAREHOUSE_ESTIMATED_QTY,
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
          maxprocess = chiThiService.checkEQvsPROCESS(
            (loaded_data[i] as any).EQ1,
            (loaded_data[i] as any).EQ2,
            (loaded_data[i] as any).EQ3,
            (loaded_data[i] as any).EQ4
          );
          temp_loss_info.XUATKHO_MET += (loaded_data[i] as any).M_OUTPUT;
          temp_loss_info.XUATKHO_EA += loaded_data[i].WAREHOUSE_ESTIMATED_QTY;
          temp_loss_info.SCANNED_MET += (loaded_data[i] as any).USED_QTY;
          temp_loss_info.SCANNED_EA += loaded_data[i].ESTIMATED_QTY;
          temp_loss_info.PROCESS1_RESULT += (loaded_data[i] as any).CD1;
          temp_loss_info.PROCESS2_RESULT += (loaded_data[i] as any).CD2;
          temp_loss_info.PROCESS3_RESULT += (loaded_data[i] as any).CD3;
          temp_loss_info.PROCESS4_RESULT += (loaded_data[i] as any).CD4;
          temp_loss_info.NG1 += (loaded_data[i] as any).NG1;
          temp_loss_info.NG2 += (loaded_data[i] as any).NG2;
          temp_loss_info.NG3 += (loaded_data[i] as any).NG3;
          temp_loss_info.NG4 += (loaded_data[i] as any).NG4;
          temp_loss_info.SETTING1 += (loaded_data[i] as any).ST1;
          temp_loss_info.SETTING2 += (loaded_data[i] as any).ST2;
          temp_loss_info.SETTING3 += (loaded_data[i] as any).ST3;
          temp_loss_info.SETTING4 += (loaded_data[i] as any).ST4;

          temp_loss_info.SX_RESULT +=
            maxprocess == 1
              ? (loaded_data[i] as any).CD1
              : maxprocess == 2
                ? (loaded_data[i] as any).CD2
                : maxprocess == 3
                  ? (loaded_data[i] as any).CD3
                  : (loaded_data[i] as any).CD4;

          temp_loss_info.INSPECTION_INPUT += loaded_data[i].INS_INPUT;
          temp_loss_info.INSPECT_TOTAL_QTY += (loaded_data[i] as any).INSPECT_TOTAL_QTY;
          temp_loss_info.INSPECT_OK_QTY += (loaded_data[i] as any).INSPECT_OK_QTY;
          temp_loss_info.LOSS_THEM_TUI += (loaded_data[i] as any).LOSS_THEM_TUI;
          temp_loss_info.INSPECT_LOSS_QTY += (loaded_data[i] as any).INSPECT_LOSS_QTY;
          temp_loss_info.INSPECT_TOTAL_NG += (loaded_data[i] as any).INSPECT_TOTAL_NG;
          temp_loss_info.INSPECT_MATERIAL_NG += (loaded_data[i] as any).INSPECT_MATERIAL_NG;
          temp_loss_info.INSPECT_PROCESS_NG += (loaded_data[i] as any).INSPECT_PROCESS_NG;
          temp_loss_info.SX_MARKING_QTY += (loaded_data[i] as any).SX_MARKING_QTY;
          temp_loss_info.INSPECTION_OUTPUT += loaded_data[i].INS_OUTPUT;

          temp_loss_info.LOSS_INS_OUT_VS_SCANNED_EA =
            temp_loss_info.SCANNED_EA !== 0
              ? 1 - temp_loss_info.INSPECTION_OUTPUT / temp_loss_info.SCANNED_EA
              : 0;
          temp_loss_info.LOSS_INS_OUT_VS_XUATKHO_EA =
            temp_loss_info.XUATKHO_EA !== 0
              ? 1 - temp_loss_info.INSPECTION_OUTPUT / temp_loss_info.XUATKHO_EA
              : 0;
        }

        kq.summary = temp_loss_info;
        kq.datasx = loaded_data;
      } else {
        kq = {
          datasx: [],
          summary: kq.summary,
        };
      }
    })
    .catch((error) => {
      console.log(error);
    });

  return kq;
};

const getYCSXDailyChiThiData = async (
  PROD_REQUEST_NO: string
): Promise<{ datasx: DAILY_YCSX_RESULT[]; summary: DAILY_YCSX_RESULT }> => {
  let kq: { datasx: DAILY_YCSX_RESULT[]; summary: DAILY_YCSX_RESULT } = {
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
    PROD_REQUEST_NO,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        let loaded_data: DAILY_YCSX_RESULT[] = response.data.data.map(
          (element: DAILY_YCSX_RESULT, index: number) => {
            return {
              ...element,
              PLAN_DATE: moment.utc(element.PLAN_DATE).format("YYYY-MM-DD"),
              LOSS1: element.INPUT1 !== 0 ? 1 - element.RESULT1 / element.INPUT1 : 0,
              LOSS2: element.INPUT2 !== 0 ? 1 - element.RESULT2 / element.INPUT2 : 0,
              LOSS3: element.INPUT3 !== 0 ? 1 - element.RESULT2 / element.INPUT3 : 0,
              LOSS_KT:
                element.INSP_QTY !== 0 ? 1 - element.INSP_OK / element.INSP_QTY : 0,
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

        totalRow.LOSS1 = totalRow.INPUT1 !== 0 ? 1 - totalRow.RESULT1 / totalRow.INPUT1 : 0;
        totalRow.LOSS2 = totalRow.INPUT2 !== 0 ? 1 - totalRow.RESULT2 / totalRow.INPUT2 : 0;
        totalRow.LOSS3 = totalRow.INPUT3 !== 0 ? 1 - totalRow.RESULT3 / totalRow.INPUT3 : 0;
        totalRow.LOSS4 = totalRow.INPUT4 !== 0 ? 1 - totalRow.RESULT4 / totalRow.INPUT4 : 0;
        totalRow.LOSS_KT = totalRow.INSP_QTY !== 0 ? 1 - totalRow.INSP_OK / totalRow.INSP_QTY : 0;

        loaded_data.push(totalRow);
        kq.datasx = loaded_data;
        kq.summary = totalRow;
      } else {
        kq = {
          datasx: [],
          summary: kq.summary,
        };
      }
    })
    .catch((error) => {
      console.log(error);
    });

  return kq;
};

const loadTiLeDat = async (
  plan_date: string,
  machine: string,
  factory: string
) => {
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
      if (response.data.tk_status !== "NG") {
        let loadeddata: SX_ACHIVE_DATE[] = response.data.data.map(
          (element: SX_ACHIVE_DATE, index: number) => {
            return {
              ...element,
              id: index,
            };
          }
        );
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

export const dataSxService = {
  loadDataSXChiThi,
  loadDataSX_YCSX,
  getYCSXDailyChiThiData,
  loadTiLeDat,
};

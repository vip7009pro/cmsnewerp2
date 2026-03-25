import moment from "moment";
import { generalQuery } from "../../../../api/Api";
import {
  DELIVERY_PLAN_CAPA,
  DINHMUC_QSLX,
  PROD_PLAN_CAPA_DATA,
} from "../interfaces/khsxInterface";

const getDataDinhMucGCode = async (G_CODE: string): Promise<DINHMUC_QSLX> => {
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
    G_CODE,
  })
    .then((response) => {
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
      }
    })
    .catch((error) => {
      console.log(error);
    });

  return dataDinhMuc;
};

export type SaveQLSXPayload = {
  G_CODE: string;
  FACTORY: string;
  EQ1: string;
  EQ2: string;
  EQ3: string;
  EQ4: string;
  Setting1: number;
  Setting2: number;
  Setting3: number;
  Setting4: number;
  UPH1: number;
  UPH2: number;
  UPH3: number;
  UPH4: number;
  Step1: number;
  Step2: number;
  Step3: number;
  Step4: number;
  LOSS_SX1: number;
  LOSS_SX2: number;
  LOSS_SX3: number;
  LOSS_SX4: number;
  LOSS_SETTING1: number;
  LOSS_SETTING2: number;
  LOSS_SETTING3: number;
  LOSS_SETTING4: number;
  LOSS_KT: number;
  NOTE: string;
};

const saveQLSX = async (qlsxdata: SaveQLSXPayload): Promise<boolean> => {
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

const getProductionPlanLeadTimeCapaData = async (
  PLAN_DATE: string
): Promise<PROD_PLAN_CAPA_DATA[]> => {
  let kq: PROD_PLAN_CAPA_DATA[] = [];
  await generalQuery("getProductionPlanCapaData", { PLAN_DATE })
    .then((response) => {
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
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};

export type LoadCapaByDeliveryPlanPayload = {
  PLAN_DATE: string;
  EQ: string;
  FACTORY: string;
};

const loadCapaByDeliveryPlan = async (
  payload: LoadCapaByDeliveryPlanPayload
): Promise<DELIVERY_PLAN_CAPA[]> => {
  let kq: DELIVERY_PLAN_CAPA[] = [];
  await generalQuery("capabydeliveryplan", payload)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        let loaded_data: DELIVERY_PLAN_CAPA[] = response.data.data.map(
          (element: DELIVERY_PLAN_CAPA, index: number) => {
            return {
              ...element,
              PL_DATE: moment.utc(element.PL_DATE).format("YYYY-MM-DD"),
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

export const capaService = {
  getDataDinhMucGCode,
  saveQLSX,
  getProductionPlanLeadTimeCapaData,
  loadCapaByDeliveryPlan,
};

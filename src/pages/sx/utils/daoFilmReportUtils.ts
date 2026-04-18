import moment from "moment";
import { generalQuery } from "../../../api/Api";

export interface DaoFilmReportQueryPayload {
  FROM_DATE: string;
  TO_DATE: string;
  USE_ALL_TIME: boolean;
}

export interface DaoFilmReportDetailQueryPayload extends DaoFilmReportQueryPayload {
  MA_DAO: string;
  MA_DAO_KT: string;
}

export interface DaoFilmReportBackData {
  STT: number;
  MA_DAO: string;
  MA_DAO_KT: string;
  StandardQty: number;
  TotalPress: number;
  ExportCount: number;
  NGAY_BAN_GIAO: string;
  OVER_STATUS: string;
  OVER_PERCENTAGE: number;
  id: number;
}

export interface DaoFilmReportWidgetData {
  Total_Knife: number;
  Total_OK_Knife: number;
  Total_NG_Knife: number;
}

export interface DaoFilmReportPieData {
  name: string;
  value: number;
}

export interface DaoFilmReportDetailData {
  MA_DAO: string;
  MA_DAO_KT: string;
  G_CODE: string;
  G_NAME: string;
  PD: string;
  CAVITY: string;
  QTY: number;
  PRESS_QTY: number;
  EMPL_NO: string;
  SX_EMPL: string;
  SX_DATE: string;
  PLAN_ID: string;
  id: number;
}

const toNumber = (value: unknown): number => {
  const converted = Number(value);
  return Number.isFinite(converted) ? converted : 0;
};

const extractResponseRows = <T>(response: any): T[] => {
  if (response?.data?.tk_status === "NG") {
    throw new Error(response?.data?.message ?? "Không tải được dữ liệu");
  }
  return (response?.data?.data ?? []) as T[];
};

export const f_loadDaoFilmReportBackData = async (
  payload: DaoFilmReportQueryPayload,
): Promise<DaoFilmReportBackData[]> => {
  const response = await generalQuery("loadDaoFilmReportBackData", payload);
  const data = extractResponseRows<any>(response);

  return data.map((element: any, index: number) => {
    return {
      STT: toNumber(element.STT),
      MA_DAO: element.MA_DAO ?? "",
      MA_DAO_KT: element.MA_DAO_KT ?? "",
      StandardQty: toNumber(element.StandardQty),
      TotalPress: toNumber(element.TotalPress),
      ExportCount: toNumber(element.ExportCount),
      NGAY_BAN_GIAO: element.NGAY_BAN_GIAO
        ? moment.utc(element.NGAY_BAN_GIAO).format("YYYY-MM-DD")
        : "",
      OVER_STATUS: element.OVER_STATUS ?? "",
      OVER_PERCENTAGE: toNumber(element.OVER_PERCENTAGE),
      id: index,
    };
  });
};

export const f_loadDaoFilmReportWidgetData = async (
  payload: DaoFilmReportQueryPayload,
): Promise<DaoFilmReportWidgetData> => {
  const response = await generalQuery("loadDaoFilmReportWidgetData", payload);
  const data = extractResponseRows<any>(response);
  const summary = data[0] ?? {};

  return {
    Total_Knife: toNumber(summary.Total_Knife),
    Total_OK_Knife: toNumber(summary.Total_OK_Knife),
    Total_NG_Knife: toNumber(summary.Total_NG_Knife),
  };
};

export const f_loadDaoFilmReportUsagePieData = async (
  payload: DaoFilmReportQueryPayload,
): Promise<DaoFilmReportPieData[]> => {
  const response = await generalQuery("loadDaoFilmReportUsagePieData", payload);
  const data = extractResponseRows<any>(response);

  return data.map((element: any) => ({
    name: element.NHOM_PHAN_TRAM ?? "N/A",
    value: toNumber(element.SO_LUONG_DAO),
  }));
};

export const f_loadDaoFilmReportExportPieData = async (
  payload: DaoFilmReportQueryPayload,
): Promise<DaoFilmReportPieData[]> => {
  const response = await generalQuery("loadDaoFilmReportExportPieData", payload);
  const data = extractResponseRows<any>(response);

  return data.map((element: any) => ({
    name: element.NHOM_SO_LAN_XUAT ?? "N/A",
    value: toNumber(element.SO_LUONG_DAO),
  }));
};

export const f_loadDaoFilmReportDetailData = async (
  payload: DaoFilmReportDetailQueryPayload,
): Promise<DaoFilmReportDetailData[]> => {
  const response = await generalQuery("loadDaoFilmReportDetailData", payload);
  const data = extractResponseRows<any>(response);

  return data.map((element: any, index: number) => ({
    MA_DAO: element.MA_DAO ?? "",
    MA_DAO_KT: element.MA_DAO_KT ?? "",
    G_CODE: element.G_CODE ?? "",
    G_NAME: element.G_NAME ?? "",
    PD: element.PD ?? "",
    CAVITY: element.CAVITY ?? "",
    QTY: toNumber(element.QTY),
    PRESS_QTY: toNumber(element.PRESS_QTY),
    EMPL_NO: element.EMPL_NO ?? "",
    SX_EMPL: element.SX_EMPL ?? "",
    SX_DATE: element.SX_DATE ? moment.utc(element.SX_DATE).format("YYYY-MM-DD") : "",
    PLAN_ID: element.PLAN_ID ?? "",
    id: index,
  }));
};

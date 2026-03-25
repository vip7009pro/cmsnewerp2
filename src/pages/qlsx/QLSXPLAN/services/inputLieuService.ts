import moment from "moment";
import { generalQuery, getAuditMode } from "../../../../api/Api";
import { LICHSUINPUTLIEU_DATA } from "../interfaces/khsxInterface";

export type LichSuInputLieuFilter = {
  ALLTIME?: boolean;
  FROM_DATE?: string;
  TO_DATE?: string;
  PROD_REQUEST_NO?: string;
  PLAN_ID?: string;
  M_NAME?: string;
  M_CODE?: string;
  G_NAME?: string;
  G_CODE?: string;
};

const getLichSuInputLieu = async (
  filter: LichSuInputLieuFilter
): Promise<LICHSUINPUTLIEU_DATA[]> => {
  let kq: LICHSUINPUTLIEU_DATA[] = [];
  await generalQuery("lichsuinputlieusanxuat_full", {
    ALLTIME: filter.ALLTIME,
    FROM_DATE: filter.FROM_DATE,
    TO_DATE: filter.TO_DATE,
    PROD_REQUEST_NO: filter.PROD_REQUEST_NO,
    PLAN_ID: filter.PLAN_ID,
    M_NAME: filter.M_NAME,
    M_CODE: filter.M_CODE,
    G_NAME: filter.G_NAME,
    G_CODE: filter.G_CODE,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        const loaded_data: LICHSUINPUTLIEU_DATA[] = response.data.data.map(
          (element: LICHSUINPUTLIEU_DATA, index: number) => {
            const isCNDB = element?.G_NAME?.search("CNDB") !== -1;
            const auditMode = getAuditMode();
            return {
              ...element,
              G_NAME: auditMode === 0 ? element?.G_NAME : isCNDB ? "TEM_NOI_BO" : element?.G_NAME,
              G_NAME_KD: auditMode === 0 ? element?.G_NAME_KD : isCNDB ? "TEM_NOI_BO" : element?.G_NAME_KD,
              INS_DATE: moment(element.INS_DATE).utc().format("YYYY-MM-DD HH:mm:ss"),
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

export const inputLieuService = {
  getLichSuInputLieu,
};

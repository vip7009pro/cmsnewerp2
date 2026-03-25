import { generalQuery, getAuditMode } from "../../../../api/Api";
import { YCSXTableData } from "../../../kinhdoanh/interfaces/kdInterface";

const traYCSXQLSX = async (filterdata: any): Promise<YCSXTableData[]> => {
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
      if (response.data.tk_status !== "NG") {
        const loadeddata: YCSXTableData[] = response.data.data.map(
          (element: YCSXTableData, index: number) => {
            let DU1: number = 0,
              DU2: number = 0,
              DU3: number = 0,
              DU4: number = 0;
            let temp_TCD1: number =
              element.EQ1 === "NO" || element.EQ1 === "NA"
                ? 0
                : (element.SLC_CD1 ?? 0) - element.CD1 - Math.floor(DU1 * (1 - (element.LOSS_SX1 * 1.0) / 100));
            let temp_TCD2: number =
              element.EQ2 === "NO" || element.EQ2 === "NA"
                ? 0
                : (element.SLC_CD2 ?? 0) - element.CD2 - Math.floor(DU2 * (1 - (element.LOSS_SX2 * 1.0) / 100));
            let temp_TCD3: number =
              element.EQ3 === "NO" || element.EQ3 === "NA"
                ? 0
                : (element.SLC_CD3 ?? 0) - element.CD3 - Math.floor(DU3 * (1 - (element.LOSS_SX3 * 1.0) / 100));
            let temp_TCD4: number =
              element.EQ4 === "NO" || element.EQ4 === "NA"
                ? 0
                : (element.SLC_CD4 ?? 0) - element.CD4 - Math.floor(DU4 * (1 - (element.LOSS_SX4 * 1.0) / 100));
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
                  : (element.SLC_CD1 ?? 0) - Math.floor(DU1 * (1 - (element.LOSS_SX1 * 1.0) / 100)),
              SLC_CD2:
                element.EQ2 === "NO" || element.EQ2 === "NA"
                  ? 0
                  : (element.SLC_CD2 ?? 0) - Math.floor(DU2 * (1 - (element.LOSS_SX2 * 1.0) / 100)),
              SLC_CD3:
                element.EQ3 === "NO" || element.EQ3 === "NA"
                  ? 0
                  : (element.SLC_CD3 ?? 0) - Math.floor(DU3 * (1 - (element.LOSS_SX3 * 1.0) / 100)),
              SLC_CD4:
                element.EQ4 === "NO" || element.EQ4 === "NA"
                  ? 0
                  : (element.SLC_CD4 ?? 0) - Math.floor(DU4 * (1 - (element.LOSS_SX4 * 1.0) / 100)),
              TON_CD1: element.EQ1 === "NO" || element.EQ1 === "NA" ? 0 : temp_TCD1,
              TON_CD2: element.EQ2 === "NO" || element.EQ2 === "NA" ? 0 : temp_TCD2,
              TON_CD3: element.EQ3 === "NO" || element.EQ3 === "NA" ? 0 : temp_TCD3,
              TON_CD4: element.EQ4 === "NO" || element.EQ4 === "NA" ? 0 : temp_TCD4,
              id: index,
            };
          }
        );
        ycsxdata = loadeddata;
      } else {
        ycsxdata = [];
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return ycsxdata;
};

const traYCSXQLSX_New = async (filterdata: any): Promise<YCSXTableData[]> => {
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
      if (response.data.tk_status !== "NG") {
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
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return ycsxdata;
};

const setPendingYCSX = async (
  ycsxdatatablefilter: YCSXTableData[],
  pending_value: number
): Promise<string> => {
  let err_code: string = "0";
  if (ycsxdatatablefilter.length > 0) {
    for (let i = 0; i < ycsxdatatablefilter.length; i++) {
        await generalQuery("setpending_ycsx", {
          PROD_REQUEST_NO: ycsxdatatablefilter[i].PROD_REQUEST_NO,
          YCSX_PENDING: pending_value,
        })
          .then((response) => {
            if (response.data.tk_status !== "NG") {
            } else {
              err_code = "1";
            }
          })
          .catch((error) => {
            console.log(error);
          });
    }
  } else {
    err_code = "Chọn ít nhất 1 dòng để thực hiện";
  }
  return err_code;
};

export const qlsxYcsxService = {
  traYCSXQLSX,
  traYCSXQLSX_New,
  setPendingYCSX,
};

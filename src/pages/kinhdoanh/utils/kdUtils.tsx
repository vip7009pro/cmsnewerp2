import Swal from "sweetalert2";
import { generalQuery, getAuditMode, getCompany, getSocket, getUserData } from "../../../api/Api";
import { CodeListData, CustomerListData, FCSTTDYCSX, InvoiceTableData, POBALANCETDYCSX, PONOLIST, POTableData, PRICEWITHMOQ, PROD_OVER_DATA, TONKHOTDYCSX, UploadAmazonData, YCSXTableData, YCTK_TREND_DATA, YCTKData } from "../interfaces/kdInterface";
import moment from "moment";
import { f_insert_Notification_Data, zeroPad } from "../../../api/GlobalFunction";
import * as XLSX from "xlsx";
import { NotificationElement } from "../../../components/NotificationPanel/Notification";
//PO Manager Functions
export const monthArray = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", ];
export const dayArray = [ "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", ];

export const f_autopheduyetgia = () => {
  generalQuery("autopheduyetgiaall", {})
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
export const f_loadPoDataFull = async (filterData: any) => {
  let podata: POTableData[] = [];
  await generalQuery("traPODataFull", filterData)
    .then((response) => {
      //console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        const loadeddata: POTableData[] = response.data.data.map(
          (element: POTableData, index: number) => {
            return {
              ...element,
              id: index,
              PO_DATE: element.PO_DATE.slice(0, 10),
              RD_DATE: element.RD_DATE.slice(0, 10),
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
            };
          }
        );
        podata = loadeddata;
      } else {
        Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        podata = [];
      }
    })
    .catch((error) => {
      Swal.fire("Thông báo", "Nội dung: " + error, "error");
      console.log(error);
    });
  return podata;
};
export const f_checkPOExist = async (
  G_CODE: string,
  CUST_CD: string,
  PO_NO: string
) => {
  let kq = false;
  await generalQuery("checkPOExist", {
    G_CODE: G_CODE,
    CUST_CD: CUST_CD,
    PO_NO: PO_NO,
  })
    .then((response) => {
      //console.log(response.data.tk_status);
      if (response.data.tk_status !== "NG") {
        kq = true;
      } else {
        //tempjson[i].CHECKSTATUS = "NG: Đã tồn tại PO";
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};
export const f_checkPOInfo = async (
  G_CODE: string,
  CUST_CD: string,
  PO_NO: string
) => {
  let kq: Array<any> = [];
  await generalQuery("checkPOExist", {
    G_CODE: G_CODE,
    CUST_CD: CUST_CD,
    PO_NO: PO_NO,
  })
    .then((response) => {
      //console.log(response.data.tk_status);
      if (response.data.tk_status !== "NG") {
        kq = response.data.data;
      } else {
        //tempjson[i].CHECKSTATUS = "NG: Đã tồn tại PO";
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};
export const f_compareDateToNow = (date: string): boolean => {
  let kq: boolean = false;
  let now = moment();
  let comparedate = moment(date);
  if (now < comparedate) {
    kq = true;
  } else {
  }
  return kq;
};
export const f_compareTwoDate = (date1: string, date2: string): number => {
  let kq: number = 0;
  let mdate1 = moment(date1);
  let mdate2 = moment(date2);
  if (mdate1 < mdate2) {
    kq = -1;
  } else if (mdate1 == mdate2) {
    kq = 0;
  } else {
    kq = 1;
  }
  return kq;
};
export const f_checkG_CODE_USE_YN = async (G_CODE: string) => {
  let kq: number = 0; // OK
  await generalQuery("checkGCodeVer", {
    G_CODE: G_CODE,
  })
    .then((response) => {
      //console.log(response.data.tk_status);
      if (response.data.tk_status !== "NG") {
        //console.log(response.data.data);
        if (response.data.data[0].USE_YN === "Y") {
          //tempjson[i].CHECKSTATUS = "OK";
          kq = 0;
        } else {
          //tempjson[i].CHECKSTATUS = "NG: Ver này đã bị khóa";
          kq = 1;
        }
      } else {
        //tempjson[i].CHECKSTATUS = "NG: Không có Code ERP này";
        kq = 2;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};
export const f_insertPO = async (poData: any) => {
  let kq: string = "NG";
  await generalQuery("insert_po", {
    G_CODE: poData.G_CODE,
    CUST_CD: poData.CUST_CD,
    PO_NO: poData.PO_NO,
    EMPL_NO: poData.EMPL_NO,
    PO_QTY: poData.PO_QTY,
    PO_DATE: poData.PO_DATE,
    RD_DATE: poData.RD_DATE,
    PROD_PRICE: poData.PROD_PRICE,
    BEP: poData.BEP ?? 0,
    REMARK: poData.REMARK,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        kq = "OK";
      } else {
        kq = "NG: Lỗi SQL: " + response.data.message;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};
export const f_updatePO = async (poData: any) => {
  let kq: string = "NG";
  await generalQuery("update_po", {
    G_CODE: poData.G_CODE,
    CUST_CD: poData.CUST_CD,
    PO_NO: poData.PO_NO,
    EMPL_NO: poData.EMPL_NO,
    PO_QTY: poData.PO_QTY,
    PO_DATE: poData.PO_DATE,
    RD_DATE: poData.RD_DATE,
    PROD_PRICE: poData.PROD_PRICE,
    BEP: poData.BEP ?? 0,
    REMARK: poData.REMARK,
    PO_ID: poData.PO_ID,
  })
    .then((response) => {
      console.log(response.data.tk_status);
      if (response.data.tk_status !== "NG") {
        kq = "OK";
      } else {
        kq = "NG: Lỗi SQL: " + response.data.message;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};
export const f_deletePO = async (PO_ID: number) => {
  let kq: string = "NG";
  await generalQuery("delete_po", {
    PO_ID: PO_ID,
  })
    .then((response) => {
      console.log(response.data.tk_status);
      if (response.data.tk_status !== "NG") {
        kq = "OK";
      } else {
        kq = "NG: Lỗi SQL: " + response.data.message;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};
export const f_autogeneratePO_NO = async (cust_cd: string) => {
  let po_no_to_check: string = cust_cd + "_" + moment.utc().format("YYMMDD");
  let next_po_no: string = po_no_to_check + "_001";
  await generalQuery("checkcustomerpono", {
    CHECK_PO_NO: po_no_to_check,
  })
    .then((response) => {
      console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        let arr = response.data.data[0].PO_NO.split("_");
        next_po_no = po_no_to_check + "_" + zeroPad(parseInt(arr[2]) + 1, 3);
        console.log("next_PO_NO", next_po_no);
      } else {
        //Swal.fire("Thông báo", " Có lỗi : " + response.data.message, "error");
      }
    })
    .catch((error) => {
      console.log(error);
      Swal.fire("Thông báo", " Có lỗi : " + error, "error");
    });
  return next_po_no;
};
export const f_dongboGiaPO = () => {
  generalQuery("dongbogiasptupo", {})
    .then((response) => {
      //console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
      } else {
        //Swal.fire("Thông báo", " Có lỗi : " + response.data.message, "error");
      }
    })
    .catch((error) => {
      console.log(error);
      Swal.fire("Thông báo", " Có lỗi : " + error, "error");
    });
};
export const f_getcustomerlist = async () => {
  let customerList: CustomerListData[] = [];
  await generalQuery("selectcustomerList", {})
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        customerList = response.data.data;
      } else {
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return customerList;
};
export const f_getcodelist = async (G_NAME: string) => {
  let codeList: CodeListData[] = [];
  await generalQuery("selectcodeList", { G_NAME: G_NAME })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        codeList = response.data.data;
      } else {
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return codeList;
};
export const f_loadprice = async (G_CODE?: string, CUST_NAME?: string) => {
  let newCodePriceData: PRICEWITHMOQ[] = [];
  if (G_CODE !== undefined && CUST_NAME !== undefined) {
    await generalQuery("loadbanggiamoinhat", {
      ALLTIME: true,
      FROM_DATE: "",
      TO_DATE: "",
      M_NAME: "",
      G_CODE: G_CODE,
      G_NAME: "",
      CUST_NAME_KD: CUST_NAME,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loaded_data: PRICEWITHMOQ[] = [];
          loaded_data =
            getCompany() !== "CMS"
              ? response.data.data
                  .map((element: PRICEWITHMOQ, index: number) => {
                    return {
                      ...element,
                      PRICE_DATE:
                        element.PRICE_DATE !== null
                          ? moment.utc(element.PRICE_DATE).format("YYYY-MM-DD")
                          : "",
                      id: index,
                    };
                  })
                  .filter(
                    (element: PRICEWITHMOQ, index: number) =>
                      element.FINAL === "Y"
                  )
              : response.data.data.map(
                  (element: PRICEWITHMOQ, index: number) => {
                    return {
                      ...element,
                      PRICE_DATE:
                        element.PRICE_DATE !== null
                          ? moment.utc(element.PRICE_DATE).format("YYYY-MM-DD")
                          : "",
                      id: index,
                    };
                  }
                );
          newCodePriceData = loaded_data;
        } else {
          /* Swal.fire("Thông báo", " Có lỗi : " + response.data.message, "error"); */
        }
      })
      .catch((error) => {
        console.log(error);
        Swal.fire("Thông báo", " Có lỗi : " + error, "error");
      });
  }
  return newCodePriceData;
};
export const f_insertInvoice = async (invoiceData: any) => {
  let kq: string = "NG";
  await generalQuery("insert_invoice", {
    G_CODE: invoiceData.G_CODE,
    CUST_CD: invoiceData.CUST_CD,
    PO_NO: invoiceData.PO_NO,
    EMPL_NO: invoiceData.EMPL_NO,
    DELIVERY_QTY: invoiceData.DELIVERY_QTY,
    PO_DATE: invoiceData.PO_DATE,
    RD_DATE: invoiceData.RD_DATE,
    DELIVERY_DATE: invoiceData.DELIVERY_DATE,
    REMARK: invoiceData.REMARK,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        kq = "OK";
      } else {
        kq = "NG: Lỗi SQL: " + response.data.message;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};
export const f_readUploadFile = (
  e: any,
  setRow: React.Dispatch<React.SetStateAction<Array<any>>>,
  setColumn: React.Dispatch<React.SetStateAction<Array<any>>>
) => {
  e.preventDefault();
  if (e.target.files) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json: any = XLSX.utils.sheet_to_json(worksheet);
      let keys = Object.keys(json[0]);
      keys.push("CHECKSTATUS");
      let uploadexcelcolumn = keys.map((e, index) => {
        return {
          field: e,
          headerName: e,
          width: 100,
          cellRenderer: (ele: any) => {
            //console.log(ele);
            if (e === "CHECKSTATUS") {
              if (ele.data[e] === "Waiting") {
                return (
                  <span style={{ color: "blue", fontWeight: "bold" }}>
                    {ele.data[e]}
                  </span>
                );
              } else if (ele.data[e] === "OK") {
                return (
                  <span style={{ color: "green", fontWeight: "bold" }}>
                    {ele.data[e]}
                  </span>
                );
              } else {
                return (
                  <span style={{ color: "red", fontWeight: "bold" }}>
                    {ele.data[e]}
                  </span>
                );
              }
            } else {
              return <span>{ele.data[e]}</span>;
            }
          },
        };
      });
      setRow(
        json.map((element: any, index: number) => {
          return { ...element, CHECKSTATUS: "Waiting", id: index };
        })
      );
      setColumn(uploadexcelcolumn);
    };
    reader.readAsArrayBuffer(e.target.files[0]);
  }
};
export const datediff = (date1: string, date2: string) => {
  var d1 = moment.utc(date1);
  var d2 = moment.utc(date2);
  var diff: number = d1.diff(d2, "days");
  //console.log(diff);
  return diff;
};
// Invoice manager function
export const f_loadInvoiceDataFull = async (filterData: any) => {
  let invoicedata: InvoiceTableData[] = [];
  await generalQuery("traInvoiceDataFull", filterData)
    .then((response) => {
      //console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        const loadeddata: InvoiceTableData[] = response.data.data.map(
          (element: InvoiceTableData, index: number) => {
            let date1 = moment.utc(element.RD_DATE).format("YYYY-MM-DD");
            let date2 = moment.utc(element.DELIVERY_DATE).format("YYYY-MM-DD");
            let diff: number = datediff(date1, date2);
            return {
              ...element,
              id: index,
              DELIVERY_DATE: element.DELIVERY_DATE.slice(0, 10),
              PO_DATE: element.PO_DATE.slice(0, 10),
              RD_DATE: element.RD_DATE.slice(0, 10),
              OVERDUE: diff < 0 ? "OVER" : "OK",
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
            };
          }
        );
        invoicedata = loadeddata;
      } else {
        invoicedata = [];
        Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
      }
    })
    .catch((error) => {
      Swal.fire("Thông báo", "Nội dung: " + error, "error");
      console.log(error);
    });
  return invoicedata;
};
export const f_updateInvoice = async (invoiceData: any) => {
  let kq: string = "NG";
  await generalQuery("update_invoice", {
    G_CODE: invoiceData.G_CODE,
    CUST_CD: invoiceData.CUST_CD,
    PO_NO: invoiceData.PO_NO,
    EMPL_NO: invoiceData.EMPL_NO,
    DELIVERY_DATE: invoiceData.DELIVERY_DATE,
    DELIVERY_QTY: invoiceData.DELIVERY_QTY,
    REMARK: invoiceData.REMARK,
    DELIVERY_ID: invoiceData.DELIVERY_ID,
  })
    .then((response) => {
      console.log(response.data.tk_status);
      if (response.data.tk_status !== "NG") {
        kq = "OK";
      } else {
        kq = "NG: Lỗi SQL: " + response.data.message;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};
export const f_deleteInvoice = async (DELIVERY_ID: number) => {
  let kq: string = "NG";
  await generalQuery("delete_invoice", {
    DELIVERY_ID: DELIVERY_ID,
  })
    .then((response) => {
      console.log(response.data.tk_status);
      if (response.data.tk_status !== "NG") {
        kq = "OK";
      } else {
        kq = "NG: Lỗi SQL: " + response.data.message;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};
export const f_updateInvoiceNo = async (
  DELIVERY_ID: number,
  INVOICE_NO: string
) => {
  let kq: string = "NG";
  await generalQuery("update_invoice_no", {
    DELIVERY_ID: DELIVERY_ID,
    INVOICE_NO: INVOICE_NO,
  })
    .then((response) => {
      console.log(response.data.tk_status);
      if (response.data.tk_status !== "NG") {
        kq = "OK";
      } else {
        kq = "NG: Lỗi SQL: " + response.data.message;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};

// production over data
export const f_loadProdOverData = async (only_pending: boolean) => {
  let kq: PROD_OVER_DATA[] = [];
  await generalQuery("loadProdOverData", {
    ONLY_PENDING: only_pending,
  })
    .then((response) => {
      //console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        let loadeddata = response.data.data.map(
          (element: PROD_OVER_DATA, index: number) => {
            return {
              ...element,
              KD_CF_DATETIME:
                element.KD_CF_DATETIME !== null
                  ? moment
                      .utc(element.KD_CF_DATETIME)
                      .format("YYYY-MM-DD HH:mm:ss")
                  : "",
              UPD_DATE:
                element.UPD_DATE !== null
                  ? moment.utc(element.UPD_DATE).format("YYYY-MM-DD HH:mm:ss")
                  : "",
              INS_DATE:
                element.INS_DATE !== null
                  ? moment.utc(element.INS_DATE).format("YYYY-MM-DD HH:mm:ss")
                  : "",
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
export const f_updateProdOverData = async (
  prod_over_data: PROD_OVER_DATA,
  KD_CFM_VALUE: string
) => {
  let err_code: string = "0";
  await generalQuery("updateProdOverData", {
    AUTO_ID: prod_over_data.AUTO_ID,
    KD_CFM: KD_CFM_VALUE,
    KD_REMARK: prod_over_data.KD_REMARK ?? "",
  })
    .then((response) => {
      //console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        Swal.fire("Thông báo", "Update data thành công", "success");
      } else {
        err_code = response.data.message;
        Swal.fire("Thông báo", "Update data thất bại", "error");
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return err_code;
};
///ycsx manager
export const f_loadPONOList = async (G_CODE?: string, CUST_CD?: string) => {
  let kq: PONOLIST[] = [];
  if (G_CODE !== undefined && CUST_CD !== undefined) {
    await generalQuery("loadpono", {
      G_CODE: G_CODE,
      CUST_CD: CUST_CD,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: PONOLIST[] = response.data.data.map(
            (element: PONOLIST, index: number) => {
              return element;
            }
          );
          //console.log(loaded_data);
          kq = loaded_data;
        } else {
          kq = [];
          //console.log('Không có PO nào cho code này và khách này');
          //Swal.fire("Thông báo", " Có lỗi : " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
        Swal.fire("Thông báo", " Có lỗi : " + error, "error");
      });
  }
  return kq;
};
export const f_checkDuplicateAMZ = async () => {
  let isDuplicated: boolean = false;
  Swal.fire({
    title: "Check trùng",
    text: "Đang check trùng AMZ DATA",
    icon: "info",
    showCancelButton: false,
    allowOutsideClick: false,
    confirmButtonText: "OK",
    showConfirmButton: false,
  });
  await generalQuery("checktrungAMZ_Full", {})
    .then((response) => {
      //console.log(response.data.tk_status);
      if (response.data.tk_status !== "NG") {
        isDuplicated = true;
        Swal.fire(
          "Thông báo",
          "Data trùng: " +
            response.data.data[0].VALUE +
            "______ Số lặp lại: " +
            response.data.data[0].COUNT,
          "error"
        );
      } else {
        Swal.fire("Thông báo", "Không có dòng trùng", "success");
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return isDuplicated;
};
export const f_handleAmazonData = async (
  amazon_data: { id: number; DATA: string; CHECKSTATUS: string }[],
  cavity: number,
  G_CODE: string,
  PROD_REQUEST_NO: string,
  NO_IN: string
) => {
  let handled_Amazon_Table: UploadAmazonData[] = [];
  if (amazon_data.length % cavity !== 0) {
    Swal.fire("Thông báo", "Số dòng lẻ so với cavity", "error");
  } else {
    for (let i = 1; i <= amazon_data.length / cavity; i++) {
      let temp_amazon_row: UploadAmazonData = {};
      temp_amazon_row.G_CODE = G_CODE;
      temp_amazon_row.PROD_REQUEST_NO = PROD_REQUEST_NO;
      temp_amazon_row.NO_IN = NO_IN;
      temp_amazon_row.ROW_NO = i;
      if (cavity === 1) {
        temp_amazon_row.DATA1 = amazon_data[i * cavity - 1].DATA;
        temp_amazon_row.DATA2 = amazon_data[i * cavity - 1].DATA + "_NOT_USE";
      } else if (cavity === 2) {
        temp_amazon_row.DATA1 = amazon_data[i * cavity - 2].DATA;
        temp_amazon_row.DATA2 = amazon_data[i * cavity - 1].DATA;
      } else if (cavity === 3) {
        temp_amazon_row.DATA1 = amazon_data[i * cavity - 3].DATA;
        temp_amazon_row.DATA2 = amazon_data[i * cavity - 2].DATA;
        temp_amazon_row.DATA3 = amazon_data[i * cavity - 1].DATA;
      } else if (cavity === 4) {
        temp_amazon_row.DATA1 = amazon_data[i * cavity - 4].DATA;
        temp_amazon_row.DATA2 = amazon_data[i * cavity - 3].DATA;
        temp_amazon_row.DATA3 = amazon_data[i * cavity - 2].DATA;
        temp_amazon_row.DATA4 = amazon_data[i * cavity - 1].DATA;
      }
      temp_amazon_row.INLAI_COUNT = 0;
      temp_amazon_row.REMARK = "";
      handled_Amazon_Table.push(temp_amazon_row);
    }
  }
  //console.log("handled_Amazon_Table", handled_Amazon_Table);
  return handled_Amazon_Table;
};
export const f_isIDCongViecExist = async (
  NO_IN: string,
  PROD_REQUEST_NO: string
) => {
  let checkIDcongViecTonTai: boolean = false;
  await generalQuery("checkIDCongViecAMZ", {
    NO_IN: NO_IN,
    PROD_REQUEST_NO: PROD_REQUEST_NO,
  })
    .then((response) => {
      console.log(response.data.tk_status);
      if (response.data.tk_status !== "NG") {
        checkIDcongViecTonTai = true;
      } else {
        checkIDcongViecTonTai = false;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return checkIDcongViecTonTai;
};

export const f_traYCSX = async (searchFilter: any) => {
  let kq: YCSXTableData[] = [];
  await generalQuery("traYCSXDataFull", {
    alltime: searchFilter.alltime,
    start_date: searchFilter.start_date,
    end_date: searchFilter.end_date,
    cust_name: searchFilter.cust_name,
    codeCMS: searchFilter.codeCMS,
    codeKD: searchFilter.codeKD,
    prod_type: searchFilter.prod_type,
    empl_name: searchFilter.empl_name,
    phanloai: searchFilter.phanloai,
    ycsx_pending: searchFilter.ycsx_pending,
    inspect_inputcheck: searchFilter.inspect_inputcheck,
    prod_request_no: searchFilter.prod_request_no,
    material: searchFilter.material,
    phanloaihang: searchFilter.phanloaihang,
    material_yes: searchFilter.material_yes,
  })
    .then((response) => {
      //console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        console.log(response.data);
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
              INS_DATE: moment
                .utc(element.INS_DATE)
                .format("YYYY-MM-DD HH:mm:ss"),
              UPD_DATE: moment
                .utc(element.UPD_DATE)
                .format("YYYY-MM-DD HH:mm:ss"),
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
        kq = [];
        Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};

export const f_checkG_CODE_ACTIVE = async (G_CODE: string) => {
  let err_code: number = 0;
  await generalQuery("checkGCodeVer", {
    G_CODE: G_CODE,
  })
    .then((response) => {
      //console.log(response.data.tk_status);
      if (response.data.tk_status !== "NG") {
        //console.log(response.data.data);
        if (response.data.data[0].USE_YN === "Y") {
        } else {
          err_code = 3;
        }
      } else {
        err_code = 4;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return err_code;
};

export const f_isBOMGIA_HAS_MAIN = async (G_CODE: string) => {
  let kq: boolean = false;
  await generalQuery("checkmainBOM2", {
    G_CODE: G_CODE,
  })
    .then((response) => {
      //console.log(response.data.data);
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

export const f_isBOM_M_CODE_MATCHING = async (G_CODE: string) => {
  let kq: string = "OK";
  await generalQuery("checkmainBOM2_M140_M_CODE_MATCHING", {
    G_CODE: G_CODE,
  })
    .then((response) => {
      //console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        let tempKQ = response.data.data[0];
        console.log(tempKQ);
        if (tempKQ.BOM2_M_CODE_COUNT > tempKQ.M140_M_CODE_COUNT) {
          kq =
            "NG: M_CODE trong bom Giá fai có đủ trong bom sản xuất, bom sx thiếu " +
            tempKQ.THIEU +
            " M_CODE so với bom giá";
        }
      } else {
        kq = "NG: Chưa có BOM Giá";
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};

export const f_check_G_NAME_2Ver_active = async (G_CODE: string) => {
  let kq: boolean = false;
  await generalQuery("check_G_NAME_2Ver_active", {
    G_CODE: G_CODE,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        if (response.data.data.length > 1) {
          kq = true;
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};

export const f_createYCSXHeader = async () => {
  //lay gio he thong
  let giohethong: string = "";
  await generalQuery("getSystemDateTime", {})
    .then((response) => {
      //console.log(response.data.tk_status);
      if (response.data.tk_status !== "NG") {
        //giohethong = response.data.data[0].SYSTEM_DATETIME.slice(0, 10);
        giohethong = response.data.data[0].SYSTEM_DATETIME;
        //console.log("gio he thong", moment.utc(response.data.data[0].SYSTEM_DATETIME).format('Y'))
      } else {
        Swal.fire(
          "Thông báo",
          "Không lấy được giờ hệ thống: " + response.data.message,
          "error"
        );
      }
    })
    .catch((error) => {
      console.log(error);
    });
  //let year:number = moment(giohethong).year();
  let month: number = moment.utc(giohethong).month();
  let day: number = moment.utc(giohethong).date();
  let yearstr = giohethong.substring(3, 4);
  let monthstr = monthArray[month];
  let daystr = dayArray[day - 1];
  return yearstr + monthstr + daystr;
};

export const f_generateNextProdRequestNo = async () => {
  let last_prod_request_no: string = "";
  let next_prod_request_no: string = "";
  let next_header = await f_createYCSXHeader();
  await generalQuery("checkLastYCSX", {})
    .then((response) => {
      console.log(response.data.tk_status);
      if (response.data.tk_status !== "NG") {
        last_prod_request_no = response.data.data[0].PROD_REQUEST_NO;
        next_prod_request_no =
          next_header +
          moment().format("YYYY").substring(2, 3) +
          zeroPad(Number(last_prod_request_no.substring(4, 7)) + 1, 3);
      } else {
        next_prod_request_no =
          next_header + moment().format("YYYY").substring(2, 3) + "001";
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return next_prod_request_no;
};

export const f_checkG_CODE_PO_BALANCE = async (G_CODE: string) => {
  let pobalance_tdycsx: POBALANCETDYCSX = {
    G_CODE: "",
    PO_BALANCE: 0,
  };
  await generalQuery("checkpobalance_tdycsx", {
    G_CODE: G_CODE,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        pobalance_tdycsx = response.data.data[0];
      } else {
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return pobalance_tdycsx;
};
export const f_checkStock_G_CODE = async (G_CODE: string) => {
  let tonkho_tdycsx: TONKHOTDYCSX = {
    G_CODE: "",
    CHO_KIEM: 0,
    CHO_CS_CHECK: 0,
    CHO_KIEM_RMA: 0,
    TONG_TON_KIEM: 0,
    BTP: 0,
    TON_TP: 0,
    BLOCK_QTY: 0,
    GRAND_TOTAL_STOCK: 0,
  };
  await generalQuery("checktonkho_tdycsx", {
    G_CODE: G_CODE,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        tonkho_tdycsx = response.data.data[0];
      } else {
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return tonkho_tdycsx;
};
export const f_checkFCST_G_CODE = async (G_CODE: string) => {
  let fcst_tdycsx: FCSTTDYCSX = {
    G_CODE: "",
    W1: 0,
    W2: 0,
    W3: 0,
    W4: 0,
    W5: 0,
    W6: 0,
    W7: 0,
    W8: 0,
  };
  await generalQuery("checkfcst_tdycsx", {
    G_CODE: G_CODE,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        console.log(response.data.data);
        fcst_tdycsx = response.data.data[0];
      } else {
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return fcst_tdycsx;
};

export const f_insertDMYCSX = async (ycsxDMData: any) => {
  await generalQuery("insertDBYCSX", {
    PROD_REQUEST_NO: ycsxDMData.PROD_REQUEST_NO,
    G_CODE: ycsxDMData.G_CODE,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        f_updateDMYCSX({
          PROD_REQUEST_NO: ycsxDMData.PROD_REQUEST_NO,
          LOSS_SX1: ycsxDMData.LOSS_SX1,
          LOSS_SX2: ycsxDMData.LOSS_SX2,
          LOSS_SX3: ycsxDMData.LOSS_SX3,
          LOSS_SX4: ycsxDMData.LOSS_SX4,
          LOSS_SETTING1: ycsxDMData.LOSS_SETTING1,
          LOSS_SETTING2: ycsxDMData.LOSS_SETTING2,
          LOSS_SETTING3: ycsxDMData.LOSS_SETTING3,
          LOSS_SETTING4: ycsxDMData.LOSS_SETTING4,
          LOSS_KT: ycsxDMData.LOSS_KT,
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
export const f_insertDMYCSX_New = async (ycsxDMData: any) => {
  await generalQuery("insertDBYCSX_New", {
    PROD_REQUEST_NO: ycsxDMData.PROD_REQUEST_NO,
    G_CODE: ycsxDMData.G_CODE,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        f_updateDMYCSX_New(ycsxDMData);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const f_updateDMYCSX_New = async (ycsxDMData: any) => {
  generalQuery("updateDBYCSX_New", ycsxDMData)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const f_updateDMYCSX = async (ycsxDMData: any) => {
  generalQuery("updateDBYCSX", {
    PROD_REQUEST_NO: ycsxDMData.PROD_REQUEST_NO,
    LOSS_SX1: ycsxDMData.LOSS_SX1,
    LOSS_SX2: ycsxDMData.LOSS_SX2,
    LOSS_SX3: ycsxDMData.LOSS_SX3,
    LOSS_SX4: ycsxDMData.LOSS_SX4,
    LOSS_SETTING1: ycsxDMData.LOSS_SETTING1,
    LOSS_SETTING2: ycsxDMData.LOSS_SETTING2,
    LOSS_SETTING3: ycsxDMData.LOSS_SETTING3,
    LOSS_SETTING4: ycsxDMData.LOSS_SETTING4,
    LOSS_KT: ycsxDMData.LOSS_KT,
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


export const f_insertYCSX = async (ycsxData: any) => {
  let err_code: string = "NG";
  await generalQuery("insert_ycsx", {
    PHANLOAI: ycsxData.PHANLOAI,
    G_CODE: ycsxData.G_CODE?.trim(),
    CUST_CD: ycsxData.CUST_CD,
    REMK: ycsxData.REMK,
    PROD_REQUEST_DATE: ycsxData.PROD_REQUEST_DATE,
    PROD_REQUEST_NO: ycsxData.PROD_REQUEST_NO,
    CODE_50: ycsxData.CODE_50,
    CODE_03: ycsxData.CODE_03,
    CODE_55: ycsxData.CODE_55,
    RIV_NO: ycsxData.RIV_NO,
    PROD_REQUEST_QTY: ycsxData.PROD_REQUEST_QTY,
    EMPL_NO: ycsxData.EMPL_NO,
    USE_YN: ycsxData.USE_YN,
    DELIVERY_DT: ycsxData.DELIVERY_DT,
    PO_NO: ycsxData.PO_NO,
    INS_EMPL: ycsxData.INS_EMPL,
    UPD_EMPL: ycsxData.UPD_EMPL,
    YCSX_PENDING: ycsxData.YCSX_PENDING,
    G_CODE2: ycsxData.G_CODE2,
    PO_TDYCSX: ycsxData.PO_TDYCSX,
    TKHO_TDYCSX: ycsxData.TKHO_TDYCSX,
    FCST_TDYCSX: ycsxData.FCST_TDYCSX,
    W1: ycsxData.W1,
    W2: ycsxData.W2,
    W3: ycsxData.W3,
    W4: ycsxData.W4,
    W5: ycsxData.W5,
    W6: ycsxData.W6,
    W7: ycsxData.W7,
    W8: ycsxData.W8,
    BTP_TDYCSX: ycsxData.BTP_TDYCSX,
    CK_TDYCSX: ycsxData.CK_TDYCSX,
    PDUYET: ycsxData.PDUYET,
    BLOCK_TDYCSX: ycsxData.BLOCK_TDYCSX,
    MATERIAL_YN: ycsxData.MATERIAL_YN,
    IS_TAM_THOI: ycsxData.IS_TAM_THOI,
    FL_YN: ycsxData.FL_YN,
  })
    .then((response) => {
      console.log(response.data.tk_status);
      if (response.data.tk_status !== "NG") {
        err_code = "OK";
      } else {
        err_code = response.data.message;
      }
    })
    .catch((error) => {
      err_code = error;
      console.log(error);
    });
  return err_code;
};

export const f_process_lot_no_generate = async (machinename: string) => {
  let in_date: string = moment().format("YYYYMMDD");
  let NEXT_PROCESS_LOT_NO: string = machinename + (await f_createYCSXHeader());
  await generalQuery("getLastProcessLotNo", {
    machine: machinename,
    in_date: in_date,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        console.log(response.data.data);
        NEXT_PROCESS_LOT_NO += zeroPad(
          Number(response.data.data[0].SEQ_NO) + 1,
          3
        );
      } else {
        NEXT_PROCESS_LOT_NO += "001";
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return NEXT_PROCESS_LOT_NO;
};

export const f_getNextP500_IN_NO = async () => {
  let kq: string = "001";
  await generalQuery("checkProcessInNoP500", {})
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        kq = zeroPad(Number(response.data.data[0].PROCESS_IN_NO) + 1, 3);
      } else {
        kq = "001";
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};
export const f_insertP500 = async (P500Data: any) => {
  await generalQuery("insert_p500", {
    in_date: P500Data.in_date,
    next_process_in_no: P500Data.next_process_in_no,
    PROD_REQUEST_DATE: P500Data.PROD_REQUEST_DATE,
    PROD_REQUEST_NO: P500Data.PROD_REQUEST_NO,
    G_CODE: P500Data.G_CODE,
    EMPL_NO: P500Data.EMPL_NO,
    phanloai: P500Data.phanloai,
    PLAN_ID: P500Data.PLAN_ID,
    PR_NB: P500Data.PR_NB,
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
export const f_insertP501 = async (P501Data: any) => {
  await generalQuery("insert_p501", {
    in_date: P501Data.in_date,
    next_process_in_no: P501Data.next_process_in_no,
    EMPL_NO: P501Data.EMPL_NO,
    next_process_lot_no: P501Data.next_process_lot_no,
    next_process_prt_seq: P501Data.next_process_prt_seq,
    PROD_REQUEST_DATE: P501Data.PROD_REQUEST_DATE,
    PROD_REQUEST_NO: P501Data.PROD_REQUEST_NO,
    PLAN_ID: P501Data.PLAN_ID,
    PROCESS_NUMBER: P501Data.PROCESS_NUMBER,
    TEMP_QTY: P501Data.TEMP_QTY,
    USE_YN: P501Data.USE_YN,
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

export const f_updateDMSX_LOSS_KT = async () => {
  let kq: boolean = false;
  await generalQuery("updateDMLOSSKT_ZTB_DM_HISTORY", {})
    .then((response) => {
      console.log(response.data.tk_status);
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};

export const f_checkYCSX_EXIST = async (PROD_REQUEST_NO: string) => {
  let kq: boolean = false;
  await generalQuery("checkYcsxExist", {
    PROD_REQUEST_NO: PROD_REQUEST_NO,
  })
    .then((response) => {
      console.log(response.data.tk_status);
      if (response.data.tk_status !== "NG") {
        kq = true;
      } else {
        kq = false;
        //tempjson[i].CHECKSTATUS = "NG: Không tồn tại YCSX";
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};

export const f_updateYCSX = async (YCSXDATA: any) => {
  let err_code: string = "";
  await generalQuery("update_ycsx", {
    G_CODE: YCSXDATA.G_CODE,
    CUST_CD: YCSXDATA.CUST_CD,
    PROD_REQUEST_NO: YCSXDATA.PROD_REQUEST_NO,
    REMK: YCSXDATA.REMK,
    CODE_50: YCSXDATA.CODE_50,
    CODE_55: YCSXDATA.CODE_55,
    PROD_REQUEST_QTY: YCSXDATA.PROD_REQUEST_QTY,
    EMPL_NO: YCSXDATA.EMPL_NO,
    DELIVERY_DT: YCSXDATA.DELIVERY_DT,
  })
    .then((response) => {
      console.log(response.data.tk_status);
      if (response.data.tk_status !== "NG") {
        Swal.fire("Thông báo", "Update YCSX thành công", "success");
      } else {
        Swal.fire(
          "Thông báo",
          "Update YCSX thất bại: " + response.data.message,
          "error"
        );
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return err_code;
};

export const f_checkYCSX_DKXL = async (PROD_REQUEST_NO: string) => {
  let kq: boolean = false;
  await generalQuery("checkYCSXQLSXPLAN", {
    PROD_REQUEST_NO: PROD_REQUEST_NO,
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
export const f_deleteP500_YCSX = async (
  PROD_REQUEST_NO: string,
  EMPL_NO: string
) => {
  await generalQuery("delete_P500_YCSX", {
    PROD_REQUEST_NO: PROD_REQUEST_NO,
    INS_EMPL: EMPL_NO,
  })
    .then((response) => {
      console.log(response.data.tk_status);
      if (response.data.tk_status !== "NG") {
      } else {
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
export const f_deleteP501_YCSX = async (PLAN_ID: string, EMPL_NO: string) => {
  await generalQuery("delete_P501_YCSX", {
    PLAN_ID: PLAN_ID,
    INS_EMPL: EMPL_NO,
  })
    .then((response) => {
      console.log(response.data.tk_status);
      if (response.data.tk_status !== "NG") {
      } else {
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const f_deleteDMYCSX = async (PROD_REQUEST_NO: string) => {
  await generalQuery("deleteDMYCSX", {
    PROD_REQUEST_NO: PROD_REQUEST_NO,
  })
    .then((response) => {
      console.log(response.data.tk_status);
    })
    .catch((error) => {
      console.log(error);
    });
};
export const f_deleteDMYCSX2 = async (PROD_REQUEST_NO: string) => {
  await generalQuery("deleteDMYCSX2", {
    PROD_REQUEST_NO: PROD_REQUEST_NO,
  })
    .then((response) => {
      console.log(response.data.tk_status);
    })
    .catch((error) => {
      console.log(error);
    });
};


export const f_deleteYCSX = async (PROD_REQUEST_NO: string) => {
  console.log('vao delete')
  let err_code: boolean = false;
  await generalQuery("delete_ycsx", {
    PROD_REQUEST_NO: PROD_REQUEST_NO,
  })
    .then((response) => {
      console.log(response.data.tk_status);
      if (response.data.tk_status !== "NG") {
        f_deleteDMYCSX(PROD_REQUEST_NO);
        f_deleteDMYCSX2(PROD_REQUEST_NO);
      } else {
        err_code = true;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return err_code;
};


export const f_batchDeleteYCSX = async (ycsxList: YCSXTableData[]) => {
  if (ycsxList.length >= 1) {    
    let err_code: boolean = false;
    for (let i = 0; i < ycsxList.length; i++) {      
     
      if (ycsxList[i].EMPL_NO === getUserData()?.EMPL_NO) {
        let checkO300: boolean = await f_checkYCSX_DKXL(
          ycsxList[i].PROD_REQUEST_NO
        );
        
        if (checkO300) {     
           
          err_code = true;
          Swal.fire(
            "Thông báo",
            "Xóa YCSX thất bại, ycsx đã được xuất liệu: ",
            "error"
          );
        } else {
          
          err_code = await f_deleteYCSX(ycsxList[i].PROD_REQUEST_NO);
          if (ycsxList[i].PL_HANG != "TT" && ycsxList[i].PL_HANG != "AM") {
            await f_deleteP500_YCSX(
              ycsxList[i].PROD_REQUEST_NO,
              ycsxList[i].EMPL_NO
            );
            await f_deleteP501_YCSX(
              ycsxList[i].PROD_REQUEST_NO + "A",
              ycsxList[i].EMPL_NO
            );
            if (ycsxList[i].PL_HANG === "AM" || ycsxList[i].PL_HANG === "TT") {
              if (!(await f_isHasInLaiCountAMZ(ycsxList[i].PROD_REQUEST_NO))) {
                await f_deleteDataAMZ(ycsxList[i].PROD_REQUEST_NO);
              }
            }
          }
        }
      }
    }
    if (!err_code) {
      let newNotification: NotificationElement = {
        CTR_CD: "002",
        NOTI_ID: -1,
        NOTI_TYPE: "warning",
        TITLE: "Xóa YCSX",
        CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${
          getUserData()?.FIRST_NAME
        }), nhân viên ${getUserData()?.WORK_POSITION_NAME} đã xóa YCSX: ${
          ycsxList[0].PROD_REQUEST_NO
        }, CODE: ${ycsxList[0]?.G_CODE}, CUST_CD: ${
          ycsxList[0]?.CUST_CD
        }, QTY: ${
          ycsxList[0]?.PROD_REQUEST_QTY
        }, DELIVERY DATE: ${ycsxList[0]?.DELIVERY_DT?.toString()}, và có thể nhiều ycsx khác`,
        SUBDEPTNAME: "KD,QLSX",
        MAINDEPTNAME: "KD,QLSX",
        INS_EMPL: "NHU1903",
        INS_DATE: "2024-12-30",
        UPD_EMPL: "NHU1903",
        UPD_DATE: "2024-12-30",
      };
      if (await f_insert_Notification_Data(newNotification)) {
        getSocket().emit("notification_panel", newNotification);
      }
      Swal.fire(
        "Thông báo",
        "Xóa YCSX thành công (chỉ YCSX của người đăng nhập)!",
        "success"
      );
    } else {
      Swal.fire(
        "Thông báo",
        "Có lỗi: Yêu cầu đã được chỉ thị sản xuất, không xóa được",
        "error"
      );
    }
  } else {
    Swal.fire("Thông báo", "Chọn ít nhất 1 YCSX để xóa !", "error");
  }
};


export const f_isHasInLaiCountAMZ = async (PROD_REQUEST_NO: string) => {
  let kq: boolean = true;
  await generalQuery("checkInLaiCount_AMZ", {
    PROD_REQUEST_NO: PROD_REQUEST_NO,
  })
    .then((response) => {
      console.log(response.data.tk_status);
      if (response.data.tk_status !== "NG") {
        if (response.data.data[0].IN_LAI_QTY === 0) {
          kq = false;
        }
      } else {
        kq = true;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};
export const f_deleteDataAMZ = async (PROD_REQUEST_NO: string) => {
  await generalQuery("deleteAMZ_DATA", {
    PROD_REQUEST_NO: PROD_REQUEST_NO,
  })
    .then((response) => {
      console.log(response.data.tk_status);
      if (response.data.tk_status !== "NG") {
      } else {
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const f_load_YCTK = async (DATA: any) => {
  let kq: YCTKData[] = [];
  await generalQuery("loadyctkdata", DATA)
    .then((response) => {
      //console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        const loadeddata: YCTKData[] = response.data.data.map(
          (element: YCTKData, index: number) => {            
            return {
              ...element,
              //DESIGN_REQUEST_DATE: moment(element.DESIGN_REQUEST_DATE).format("YYYY-MM-DD"),
              id: index,
            };
          }
        );
        kq = loadeddata;
      } else {
        kq = [];
        Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
      }
    })
    .catch((error) => {
      Swal.fire("Thông báo", "Nội dung: " + error, "error");
      console.log(error);
    });
  return kq;
    
}

export const f_insert_YCTK = async (DATA: any) => {
  let kq: string = "NG";
  await generalQuery("addYCTK", DATA)
    .then((response) => {
      console.log(response.data.tk_status);
      if (response.data.tk_status !== "NG") {
        kq = "OK";
      } else {
        kq = "NG: Lỗi SQL: " + response.data.message;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};

export const f_update_YCTK = async (DATA: any) => {
  let kq: string = "NG";
  await generalQuery("updateYCTK", DATA)
    .then((response) => {
      console.log(response.data.tk_status);
      if (response.data.tk_status !== "NG") {
        kq = "OK";
      } else {
        kq = "NG: Lỗi SQL: " + response.data.message;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};

export const f_load_YCTK_TREND_DAILY = async (DATA: any) => {
  let kq: YCTK_TREND_DATA[] = [];
  await generalQuery("loadyctkdatatrenddaily", {
    FROM_DATE: DATA.FROM_DATE,
    TO_DATE: DATA.TO_DATE
  })
    .then((response) => {
      //console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        const loadeddata: YCTK_TREND_DATA[] = response.data.data.map(
          (element: YCTK_TREND_DATA, index: number) => {            
            return {
              ...element,
              RATE: element.TOTAL !== 0 ? element.COMPLETED / element.TOTAL : 0,
              REQ_DATE: moment(element.REQ_DATE).format("YYYY-MM-DD"),
              id: index,
            };
          }
        );
        kq = loadeddata;
      } else {
        kq = [];
        Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
      }
    })
    .catch((error) => {
      Swal.fire("Thông báo", "Nội dung: " + error, "error");
      console.log(error);
    });
  return kq;
}

export const f_load_YCTK_TREND_WEEKLY = async (DATA: any) => {
  let kq: YCTK_TREND_DATA[] = [];
  await generalQuery("loadyctkdatatrendweekly", {
    FROM_DATE: DATA.FROM_DATE,
    TO_DATE: DATA.TO_DATE
  })
    .then((response) => {
      //console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        const loadeddata: YCTK_TREND_DATA[] = response.data.data.map(
          (element: YCTK_TREND_DATA, index: number) => {            
            return {
              ...element,
              RATE: element.TOTAL !== 0 ? element.COMPLETED / element.TOTAL : 0,
              //DESIGN_REQUEST_DATE: moment(element.DESIGN_REQUEST_DATE).format("YYYY-MM-DD"),
              id: index,
            };
          }
        );
        kq = loadeddata;
      } else {
        kq = [];
        Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
      }
    })
    .catch((error) => {
      Swal.fire("Thông báo", "Nội dung: " + error, "error");
      console.log(error);
    });
  return kq;
}

export const f_load_YCTK_TREND_MONTHLY = async (DATA: any) => {
  let kq: YCTK_TREND_DATA[] = [];
  await generalQuery("loadyctkdatatrendmonthly", {
    FROM_DATE: DATA.FROM_DATE,
    TO_DATE: DATA.TO_DATE
  })
    .then((response) => {
      //console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        const loadeddata: YCTK_TREND_DATA[] = response.data.data.map(
          (element: YCTK_TREND_DATA, index: number) => {            
            return {
              ...element,
              RATE: element.TOTAL !== 0 ? element.COMPLETED / element.TOTAL : 0,
              //DESIGN_REQUEST_DATE: moment(element.DESIGN_REQUEST_DATE).format("YYYY-MM-DD"),
              id: index,
            };
          }
        );
        kq = loadeddata;
      } else {
        kq = [];
        Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
      }
    })
    .catch((error) => {
      Swal.fire("Thông báo", "Nội dung: " + error, "error");
      console.log(error);
    });
  return kq;
}

export const f_load_YCTK_TREND_YEARLY = async (DATA: any) => {
  let kq: YCTK_TREND_DATA[] = [];
  await generalQuery("loadyctkdatatrendyearly", {
    FROM_DATE: DATA.FROM_DATE,
    TO_DATE: DATA.TO_DATE
  })
    .then((response) => {
      //console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        const loadeddata: YCTK_TREND_DATA[] = response.data.data.map(
          (element: YCTK_TREND_DATA, index: number) => {            
            return {
              ...element,
              RATE: element.TOTAL !== 0 ? element.COMPLETED / element.TOTAL : 0,
              //DESIGN_REQUEST_DATE: moment(element.DESIGN_REQUEST_DATE).format("YYYY-MM-DD"),
              id: index,
            };
          }
        );
        kq = loadeddata;
      } else {
        kq = [];
        Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
      }
    })
    .catch((error) => {
      Swal.fire("Thông báo", "Nội dung: " + error, "error");
      console.log(error);
    });
  return kq;
}
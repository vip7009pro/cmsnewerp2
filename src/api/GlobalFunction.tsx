import { useContext } from "react";
import { ResponsiveContainer } from "recharts";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import XlsxPopulate from 'xlsx-populate';
import { generalQuery, getAuditMode, getCompany } from "./Api";
import { CodeListData, CustomerListData, InvoiceTableData, POTableData, PRICEWITHMOQ, UserData } from "./GlobalInterface";
import moment from "moment";
import axios from "axios";

export const zeroPad = (num: number, places: number) => String(num).padStart(places, "0");
export const SaveExcel = (data: any, title: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, `${title}.xlsx`);
};

export function CustomResponsiveContainer(props: any) {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <ResponsiveContainer {...props} />
      </div>
    </div>
  );
}
export function nFormatter(num: number, digits: number) {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "B" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
    : "0";
}
export async function checkver() {
  let current_ver: number = 1;
  let server_ver: number = 1;
  await generalQuery("checkWebVer", {})
    .then((response) => {
      console.log(response.data.tk_status);
      if (response.data.tk_status !== "NG") {
        server_ver = response.data.data[0].VERWEB;
      } else {
      }
    })
    .catch((error) => {
      console.log(error);
    });
  if (server_ver === current_ver) {
    return 1;
  } else {
    return 0;
  }
}
export const autoGetProdPrice = async (G_CODE: string, CUST_CD: string, PO_QTY: number) => {
  console.log(G_CODE);
  console.log(CUST_CD);
  console.log(PO_QTY);
  let loaded_price = {
    prod_price: 0,
    bep: 0
  }
  await generalQuery("loadbanggiamoinhat", {
    ALLTIME: true,
    FROM_DATE: "",
    TO_DATE: "",
    M_NAME: "",
    G_CODE: G_CODE,
    G_NAME: "",
    CUST_NAME_KD: "",
    CUST_CD: CUST_CD
  })
    .then((response) => {
      //console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        let loaded_data: PRICEWITHMOQ[] = [];
        loaded_data =
          response.data.data.map(
            (element: PRICEWITHMOQ, index: number) => {
              return {
                ...element,
                PRICE_DATE:
                  element.PRICE_DATE !== null
                    ? moment
                      .utc(element.PRICE_DATE)
                      .format("YYYY-MM-DD")
                    : "",
                id: index,
              };
            }
          ).filter(
            (element: PRICEWITHMOQ, index: number) =>
              element.FINAL === "Y"
          );
        loaded_price = {
          prod_price: loaded_data.filter(
            (e: PRICEWITHMOQ, index: number) => {
              return PO_QTY >= e.MOQ;
            }
          )[0]?.PROD_PRICE ?? 0,
          bep: loaded_data.filter(
            (e: PRICEWITHMOQ, index: number) => {
              return PO_QTY >= e.MOQ;
            }
          )[0]?.BEP ?? 0
        }
        console.log('loaded_price', loaded_price);
        //setNewCodePrice(loaded_data);
      } else {
        /* Swal.fire("Thông báo", " Có lỗi : " + response.data.message, "error"); */
      }
    })
    .catch((error) => {
      console.log(error);
      //Swal.fire("Thông báo", " Có lỗi : " + error, "error");
    });
  return loaded_price;
}
export async function checkBP(
  userData: UserData | undefined,
  permitted_main_dept: string[],
  permitted_position: string[],
  permitted_empl: string[],
  func: any,
) {
  if (userData !== undefined) {
    if (
      userData.EMPL_NO !== undefined &&
      userData.EMPL_NO !== undefined &&
      userData.MAINDEPTNAME !== undefined
    ) {
      if (
        userData.EMPL_NO === "NHU1903" ||
        userData.EMPL_NO === "NVD1201" ||
        (getCompany() !== "CMS" &&
          (userData.EMPL_NO === "DSL1986" ||
            userData.EMPL_NO === "NTD1983" ||
            userData.EMPL_NO === "LTH1992"))
      ) {
        await func();
      } else if (permitted_main_dept.indexOf("ALL") > -1) {
        if (permitted_position.indexOf("ALL") > -1) {
          if (permitted_empl.indexOf("ALL") > -1) {
            await func();
          } else if (permitted_empl.indexOf(userData.EMPL_NO) > -1) {
            await func();
          } else {
            Swal.fire("Thông báo", "Không đủ quyền hạn", "warning");
          }
        } else if (
          permitted_position.indexOf(
            userData.POSITION_NAME === undefined
              ? "NA"
              : userData.POSITION_NAME,
          ) > -1
        ) {
          if (permitted_empl.indexOf("ALL") > -1) {
            await func();
          } else if (permitted_empl.indexOf(userData.EMPL_NO) > -1) {
            await func();
          } else {
            Swal.fire("Thông báo", "Không đủ quyền hạn", "warning");
          }
        } else {
          Swal.fire("Thông báo", "Chức vụ không đủ quyền hạn", "warning");
        }
      } else if (permitted_main_dept.indexOf(userData.MAINDEPTNAME) > -1) {
        if (permitted_position.indexOf("ALL") > -1) {
          if (permitted_empl.indexOf("ALL") > -1) {
            await func();
          } else if (permitted_empl.indexOf(userData.EMPL_NO) > -1) {
            await func();
          } else {
            Swal.fire("Thông báo", "Không đủ quyền hạn", "warning");
          }
        } else if (
          permitted_position.indexOf(userData.POSITION_NAME ?? "NA") > -1
        ) {
          if (permitted_empl.indexOf("ALL") > -1) {
            await func();
          } else if (permitted_empl.indexOf(userData.EMPL_NO) > -1) {
            await func();
          } else {
            Swal.fire("Thông báo", "Không đủ quyền hạn", "warning");
          }
        } else {
          Swal.fire("Thông báo", "Chức vụ không đủ quyền hạn", "warning");
        }
      } else {
        Swal.fire(
          "Thông báo",
          "Bạn không phải người bộ phận " + permitted_main_dept,
          "warning",
        );
      }
    }
  }
}
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
export const weekdayarray = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
export function removeVietnameseTones(str: string) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str.replace(/ + /g, " ");
  str = str.trim();
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    " ",
  );
  return str;
}
export function deBounce(func: any, delay: number) {
  let timer: any;
  clearTimeout(timer);
  timer = setTimeout(() => {
    func();
  }, delay);
};
export const COLORS = [
  "#cc0000",
  "#cc3300",
  "#cc6600",
  "#cc9900",
  "#cccc00",
  "#99cc00",
  "#66cc00",
  "#33cc00",
  "#00cc00",
  "#00cc33",
  "#00cc66",
  "#00cc99",
  "#00cccc",
  "#0099cc",
  "#0066cc",
  "#0033cc",
  "#0000cc",
  "#3300cc",
  "#6600cc",
  "#9900cc",
  "#cc00cc",
  "#cc0099",
  "#cc0066",
  "#cc0033",
  "#cc0000",
];
export const ERR_TABLE = [{ ERR_CODE: 'ERR1', ERR_NAME_VN: 'Loss thêm túi', ERR_NAME_KR: '포장 로스' }, { ERR_CODE: 'ERR2', ERR_NAME_VN: 'Loss bóc đầu cuối', ERR_NAME_KR: '초종 파괴 검사 로스' }, { ERR_CODE: 'ERR3', ERR_NAME_VN: 'Loss điểm nối', ERR_NAME_KR: '이음애 로스' }, { ERR_CODE: 'ERR4', ERR_NAME_VN: 'Dị vật/chấm gel', ERR_NAME_KR: '원단 이물/겔 점' }, { ERR_CODE: 'ERR5', ERR_NAME_VN: 'Nhăn VL', ERR_NAME_KR: '원단 주름' }, { ERR_CODE: 'ERR6', ERR_NAME_VN: 'Loang bẩn VL', ERR_NAME_KR: '얼룩' }, { ERR_CODE: 'ERR7', ERR_NAME_VN: 'Bóng khí VL', ERR_NAME_KR: '원단 기포' }, { ERR_CODE: 'ERR8', ERR_NAME_VN: 'Xước VL', ERR_NAME_KR: '원단 스크래치' }, { ERR_CODE: 'ERR9', ERR_NAME_VN: 'Chấm lồi lõm VL', ERR_NAME_KR: '원단 눌림' }, { ERR_CODE: 'ERR10', ERR_NAME_VN: 'Keo VL', ERR_NAME_KR: '원단 찐' }, { ERR_CODE: 'ERR11', ERR_NAME_VN: 'Lông PE VL', ERR_NAME_KR: '원단 버 (털 모양)' }, { ERR_CODE: 'ERR12', ERR_NAME_VN: 'Lỗi IN (Dây mực)', ERR_NAME_KR: '잉크 튐' }, { ERR_CODE: 'ERR13', ERR_NAME_VN: 'Lỗi IN (Mất nét)', ERR_NAME_KR: '글자 유실' }, { ERR_CODE: 'ERR14', ERR_NAME_VN: 'Lỗi IN (Lỗi màu)', ERR_NAME_KR: '색상 불량' }, { ERR_CODE: 'ERR15', ERR_NAME_VN: 'Lỗi IN (Chấm đường khử keo)', ERR_NAME_KR: '점착 제거 선 점 불량' }, { ERR_CODE: 'ERR16', ERR_NAME_VN: 'DIECUT (Lệch/Viền màu)', ERR_NAME_KR: '타발 편심' }, { ERR_CODE: 'ERR17', ERR_NAME_VN: 'DIECUT (Sâu)', ERR_NAME_KR: '과타발' }, { ERR_CODE: 'ERR18', ERR_NAME_VN: 'DIECUT (Nông)', ERR_NAME_KR: '미타발' }, { ERR_CODE: 'ERR19', ERR_NAME_VN: 'DIECUT (BAVIA)', ERR_NAME_KR: '타발 버' }, { ERR_CODE: 'ERR20', ERR_NAME_VN: 'Mất bước', ERR_NAME_KR: '차수 누락' }, { ERR_CODE: 'ERR21', ERR_NAME_VN: 'Xước', ERR_NAME_KR: '스크래치' }, { ERR_CODE: 'ERR22', ERR_NAME_VN: 'Nhăn gãy', ERR_NAME_KR: '주름꺽임' }, { ERR_CODE: 'ERR23', ERR_NAME_VN: 'Hằn', ERR_NAME_KR: '자국' }, { ERR_CODE: 'ERR24', ERR_NAME_VN: 'Sót rác', ERR_NAME_KR: '미 스크랩' }, { ERR_CODE: 'ERR25', ERR_NAME_VN: 'Bóng Khí', ERR_NAME_KR: '기포' }, { ERR_CODE: 'ERR26', ERR_NAME_VN: 'Bẩn keo bề mặt', ERR_NAME_KR: '표면 찐' }, { ERR_CODE: 'ERR27', ERR_NAME_VN: 'Chấm thủng/lồi lõm', ERR_NAME_KR: '찍힘' }, { ERR_CODE: 'ERR28', ERR_NAME_VN: 'Bụi trong', ERR_NAME_KR: '내면 이물' }, { ERR_CODE: 'ERR29', ERR_NAME_VN: 'Hụt Tape', ERR_NAME_KR: '테이프 줄여듬' }, { ERR_CODE: 'ERR30', ERR_NAME_VN: 'Bong keo', ERR_NAME_KR: '찐 벗겨짐' }, { ERR_CODE: 'ERR31', ERR_NAME_VN: 'Lấp lỗ sensor', ERR_NAME_KR: '센서 홀 막힘' }, { ERR_CODE: 'ERR32', ERR_NAME_VN: 'Marking SX', ERR_NAME_KR: '생산 마킹 구간 썩임' }, { ERR_CODE: 'ERR33', ERR_NAME_VN: 'Cong Vinyl', ERR_NAME_KR: '비닐 컬' }, { ERR_CODE: 'ERR34', ERR_NAME_VN: 'Mixing', ERR_NAME_KR: '혼입' }, { ERR_CODE: 'ERR35', ERR_NAME_VN: 'Sai thiết kế', ERR_NAME_KR: '설계 불량' }, { ERR_CODE: 'ERR36', ERR_NAME_VN: 'Sai vật liệu', ERR_NAME_KR: '원단 잘 못 사용' }, { ERR_CODE: 'ERR37', ERR_NAME_VN: 'NG kích thước', ERR_NAME_KR: '치수 불량' }
];
export function dynamicSort(property: string) {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substring(1);
  }
  return function (a: any, b: any) {
    /* next line works with strings and numbers, 
     * and you may want to customize it to your needs
     */
    var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
    return result * sortOrder;
  }
}

//PO Manager Functions
export const f_autopheduyetgia = () => {
  generalQuery("autopheduyetgiaall", {
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

export const f_loadPoDataFull = async (filterData: any) =>  {
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
            G_NAME: getAuditMode() == 0 ? element?.G_NAME : element?.G_NAME?.search('CNDB') == -1 ? element?.G_NAME : 'TEM_NOI_BO',
            G_NAME_KD: getAuditMode() == 0 ? element?.G_NAME_KD : element?.G_NAME?.search('CNDB') == -1 ? element?.G_NAME_KD : 'TEM_NOI_BO',
          };
        }
      );
      podata = loadeddata;
     
    } else {    
      podata = [];
    }
  })
  .catch((error) => {
    Swal.fire("Thông báo", "Nội dung: " + error, "error");
    console.log(error);
  });

  return podata;
}

export const f_checkPOExist = async (G_CODE: string, CUST_CD: string, PO_NO: string) => {
  let kq= false;
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
}

export const f_checkPOInfo = async (G_CODE: string, CUST_CD: string, PO_NO: string) => {
  let kq= false;
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
}

export const f_compareDateToNow = (date: string): boolean => {
  let kq: boolean = false;
  let now = moment();
  let comparedate = moment(date);
  if (now < comparedate) {
    kq = true;    
  } else {
    
  }
  return kq;
}
export const f_compareTwoDate = (date1: string, date2: string): number => {
  let kq: number = 0;
  let mdate1 = moment(date1);
  let mdate2 = moment(date2);
  if (mdate1 < mdate2) {
    kq = -1;    
  } 
  else if(mdate1 == mdate2){
    kq =0;
  }
  else 
  {
    kq = 1;
  }
  return kq;
}

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
          kq= 0;
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
}

export const f_insertPO = async (poData: any) => {
  let kq: string = 'NG';
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
        kq =  "OK";
      } else {       
        kq = "NG: Lỗi SQL: " + response.data.message;
      }
    })
    .catch((error) => {
      console.log(error);
    });
    return kq;
}

export const f_updatePO = async (poData: any) => {
  let kq: string = 'NG';
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
    PO_ID: poData.PO_ID
  })
    .then((response) => {
      console.log(response.data.tk_status);
      if (response.data.tk_status !== "NG") {
        kq =  "OK";
      } else {       
        kq = "NG: Lỗi SQL: " + response.data.message;
      }
    })
    .catch((error) => {
      console.log(error);
    });
    return kq;
}

export const f_deletePO = async (PO_ID: number) => {
  let kq: string = 'NG';
  await generalQuery("delete_po", {
    PO_ID: PO_ID
  })
    .then((response) => {
      console.log(response.data.tk_status);
      if (response.data.tk_status !== "NG") {
        kq =  "OK";
      } else {       
        kq = "NG: Lỗi SQL: " + response.data.message;
      }
    })
    .catch((error) => {
      console.log(error);
    });
    return kq;
}

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
                        ? moment
                          .utc(element.PRICE_DATE)
                          .format("YYYY-MM-DD")
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
                        ? moment
                          .utc(element.PRICE_DATE)
                          .format("YYYY-MM-DD")
                        : "",
                    id: index,
                  };
                }
              );
              newCodePriceData =loaded_data;
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

export const f_insertInvoice =  async (invoiceData: any) => {
  let kq: string = 'NG';
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
        kq =  "OK";
      } else {       
        kq = "NG: Lỗi SQL: " + response.data.message;
      }
    })
    .catch((error) => {
      console.log(error);
    });
    return kq;

}

export const f_readUploadFile = (e: any,setRow: React.Dispatch<React.SetStateAction<Array<any>>>, setColumn: React.Dispatch<React.SetStateAction<Array<any>>>) => {
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
      keys.push('CHECKSTATUS');
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
      setRow(json.map((element: any, index: number) => {
        return { ...element, CHECKSTATUS: "Waiting", id: index };
      }));
      setColumn(uploadexcelcolumn);
    };
    reader.readAsArrayBuffer(e.target.files[0]);
  }  
};

// Invoice manager function

export const f_loadInvoiceDataFull = async (filterData: any) =>  {
  let invoicedata: InvoiceTableData[] = [];
  await generalQuery("traInvoiceDataFull", filterData)
  .then((response) => {
    //console.log(response.data.data);
    if (response.data.tk_status !== "NG") {
      const loadeddata: InvoiceTableData[] = response.data.data.map(
        (element: InvoiceTableData, index: number) => {
          return {
            ...element,
            id: index,
            DELIVERY_DATE: element.DELIVERY_DATE.slice(0, 10),
            PO_DATE: element.PO_DATE.slice(0, 10),
            RD_DATE: element.RD_DATE.slice(0, 10),
            G_NAME: getAuditMode() == 0 ? element?.G_NAME : element?.G_NAME?.search('CNDB') == -1 ? element?.G_NAME : 'TEM_NOI_BO',
            G_NAME_KD: getAuditMode() == 0 ? element?.G_NAME_KD : element?.G_NAME?.search('CNDB') == -1 ? element?.G_NAME_KD : 'TEM_NOI_BO',
          };
        },
      );
      invoicedata = loadeddata;
     
    } else {    
      invoicedata = [];
    }
  })
  .catch((error) => {
    Swal.fire("Thông báo", "Nội dung: " + error, "error");
    console.log(error);
  });
  return invoicedata;
}


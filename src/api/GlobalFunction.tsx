import { useContext } from "react";
import { ResponsiveContainer } from "recharts";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import XlsxPopulate from 'xlsx-populate';
import { generalQuery, getAuditMode, getCompany } from "./Api";
import { CodeListData, CustomerListData, EQ_STATUS, EQ_STT, InvoiceTableData, MACHINE_LIST, POTableData, PRICEWITHMOQ, QLSXPLANDATA, RecentDM, UserData, YCSXTableData } from "./GlobalInterface";
import moment from "moment";
import axios from "axios";
import CHITHI_COMPONENT from "../pages/qlsx/QLSXPLAN/CHITHI/CHITHI_COMPONENT";
import CHITHI_COMPONENT2 from "../pages/qlsx/QLSXPLAN/CHITHI/CHITHI_COMPONENT2";
import YCSXComponent from "../pages/kinhdoanh/ycsxmanager/YCSXComponent/YCSXComponent";
import DrawComponent from "../pages/kinhdoanh/ycsxmanager/DrawComponent/DrawComponent";

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
  let kq: Array<any>= [];
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

export const f_updateInvoice = async (invoiceData: any) => {
  let kq: string = 'NG';
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

export const f_deleteInvoice = async (DELIVERY_ID: number) => {
  let kq: string = 'NG';
  await generalQuery("delete_invoice", {
    DELIVERY_ID: DELIVERY_ID
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

export const f_updateInvoiceNo = async (DELIVERY_ID: number, INVOICE_NO: string) => {  
  let kq: string = 'NG';
  await generalQuery("update_invoice_no", {    
    DELIVERY_ID: DELIVERY_ID,
    INVOICE_NO: INVOICE_NO
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

//Machine functions
export const f_checkEQvsPROCESS = (EQ1: string, EQ2: string, EQ3: string, EQ4: string) => {
  let maxprocess: number = 0;
  if (["NA", "NO", "", null].indexOf(EQ1) === -1) maxprocess++;
  if (["NA", "NO", "", null].indexOf(EQ2) === -1) maxprocess++;
  if (["NA", "NO", "", null].indexOf(EQ3) === -1) maxprocess++;
  if (["NA", "NO", "", null].indexOf(EQ4) === -1) maxprocess++;
  return maxprocess;
};
export const renderChiThi = (planlist: QLSXPLANDATA[], ref: any) => {
  return planlist.map((element, index) => (
    <CHITHI_COMPONENT ref={ref} key={index} DATA={element} />   
  ));
};
export const renderChiThi2 = (planlist: QLSXPLANDATA[], ref: any) => {
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
  let NEEDED_QTY: number = planData.PLAN_QTY ?? 0, FINAL_LOSS_SX: number = 0, FINAL_LOSS_KT: number = planData?.LOSS_KT ?? 0, FINAL_LOSS_SETTING: number = 0, PD: number = planData.PD ?? 0, CAVITY: number = planData.CAVITY ?? 0;
  
  if (planData.PROCESS_NUMBER === 1) {
    FINAL_LOSS_SX = (planData.LOSS_SX2 ?? 0) + (planData.LOSS_SX3 ?? 0) + (planData.LOSS_SX4 ?? 0);
  } else if (planData.PROCESS_NUMBER === 2) {
    FINAL_LOSS_SX = (planData.LOSS_SX3 ?? 0) + (planData.LOSS_SX4 ?? 0);
  } else if (planData.PROCESS_NUMBER === 3) {
    FINAL_LOSS_SX = (planData.LOSS_SX4 ?? 0);
  } else if (planData.PROCESS_NUMBER === 4) {
    FINAL_LOSS_SX = 0;
  }
  if (planData.PROCESS_NUMBER === 1) {
    FINAL_LOSS_SETTING = (planData.LOSS_SETTING2 ?? 0) + (planData.LOSS_SETTING3 ?? 0) + (planData.LOSS_SETTING4 ?? 0);
  } else if (planData.PROCESS_NUMBER === 2) {
    FINAL_LOSS_SETTING = (planData.LOSS_SETTING3 ?? 0) + (planData.LOSS_SETTING4 ?? 0);
  } else if (planData.PROCESS_NUMBER === 3) {
    FINAL_LOSS_SETTING = (planData.LOSS_SETTING4 ?? 0);
  } else if (planData.PROCESS_NUMBER === 4) {
    FINAL_LOSS_SETTING = 0;
  }

 

  NEEDED_QTY = NEEDED_QTY * (100 + FINAL_LOSS_SX + FINAL_LOSS_KT) / 100 + FINAL_LOSS_SETTING / PD * CAVITY * 1000;
 
  

  return {
    NEEDED_QTY: Math.round(NEEDED_QTY),
    FINAL_LOSS_SX: FINAL_LOSS_SX,
    FINAL_LOSS_KT: planData.LOSS_KT,
    FINAL_LOSS_SETTING: FINAL_LOSS_SETTING
  }
}
export const f_saveSinglePlan = async (planToSave: QLSXPLANDATA) => {
  let check_NEXT_PLAN_ID: boolean = true;
  let checkPlanIdP500: boolean = false;
  let err_code: string = '0';
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
  let { NEEDED_QTY, FINAL_LOSS_SX, FINAL_LOSS_KT, FINAL_LOSS_SETTING } = await f_getCurrentDMToSave(planToSave);
  if (
    parseInt(planToSave?.PROCESS_NUMBER.toString()) >=
    1 &&
    parseInt(planToSave?.PROCESS_NUMBER.toString()) <=
    4 &&
    planToSave?.PLAN_QTY !== 0 &&
    planToSave?.PLAN_QTY <=
    planToSave?.PROD_REQUEST_QTY &&
    planToSave?.PLAN_ID !==
    planToSave?.NEXT_PLAN_ID &&
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
        parseInt(planToSave?.PROCESS_NUMBER.toString()) >=
        1 &&
        parseInt(planToSave?.PROCESS_NUMBER.toString()) <=
        4
      )
    ) {
      err_code += "_: Process number chưa đúng";
    } else if (planToSave?.PLAN_QTY === 0) {
      err_code += "_: Số lượng chỉ thị =0";
    } else if (
      planToSave?.PLAN_QTY >
      planToSave?.PROD_REQUEST_QTY
    ) {
      err_code += "_: Số lượng chỉ thị lớn hơn số lượng yêu cầu sx";
    } else if (
      planToSave?.PLAN_ID ===
      planToSave?.NEXT_PLAN_ID
    ) {
      err_code += "_: NEXT_PLAN_ID không được giống PLAN_ID hiện tại";
    } else if (!check_NEXT_PLAN_ID) {
      err_code +=
        "_: NEXT_PLAN_ID không giống với PLAN_ID ở dòng tiếp theo";
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
        parseInt(planToSave?.PROCESS_NUMBER.toString()) >=
        1 &&
        parseInt(planToSave?.PROCESS_NUMBER.toString()) <=
        4
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
}
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
          },
        );
        recentDMData = loadeddata
        
      } else {
        //Swal.fire("Thông báo", "Lỗi BOM SX: " + response.data.message, "error");
        recentDMData = [];
      }
    })
    .catch((error) => {
      console.log(error);
    });
    return recentDMData;
}
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
        loadeddata.push({ EQ_NAME: "NO" }, { EQ_NAME: "NA" });
        machineListData = loadeddata;
       
      } else {
        //Swal.fire("Thông báo", "Lỗi BOM SX: " + response.data.message, "error");
        machineListData = []
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
      eq_status_data = loaded_data
      
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
    EQ_STATUS: eq_status_data
  }
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
}
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
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });

}
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
}

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
      if (
        planArray[i].NEXT_PLAN_ID === planArray[i + 1].PLAN_ID
      ) {
        check_NEXT_PLAN_ID = true;
      } else {
        check_NEXT_PLAN_ID = false;
      }
    }
    let checkPlanIdP500: boolean = false;
    await generalQuery("checkP500PlanID_mobile", {
      PLAN_ID: planArray[i].PLAN_ID,
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
    let { NEEDED_QTY, FINAL_LOSS_SX, FINAL_LOSS_KT, FINAL_LOSS_SETTING } = await f_getCurrentDMToSave(planArray[i])
    console.log(NEEDED_QTY, FINAL_LOSS_SX, FINAL_LOSS_KT, FINAL_LOSS_SETTING);
    if (
      parseInt(planArray[i].PROCESS_NUMBER.toString()) >= 1 &&
      parseInt(planArray[i].PROCESS_NUMBER.toString()) <= 4 &&
      planArray[i].PLAN_QTY !== 0 &&
      planArray[i].PLAN_QTY <=
      planArray[i].PROD_REQUEST_QTY &&
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
        NEXT_PLAN_ID: planArray[i].NEXT_PLAN_ID === null ? "X" : planArray[i].NEXT_PLAN_ID,
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
      } else if (
        planArray[i].PLAN_QTY > planArray[i].PROD_REQUEST_QTY
      ) {
        err_code += "_: Số lượng chỉ thị lớn hơn số lượng yêu cầu sx";
      } else if (
        planArray[i].PLAN_ID === planArray[i].NEXT_PLAN_ID
      ) {
        err_code += "_: NEXT_PLAN_ID không được giống PLAN_ID hiện tại";
      } else if (!check_NEXT_PLAN_ID) {
        err_code +=
          "_: NEXT_PLAN_ID không giống với PLAN_ID ở dòng tiếp theo";
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
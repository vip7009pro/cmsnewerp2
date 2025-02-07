import { ResponsiveContainer } from "recharts";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import {
  generalQuery,
  getAuditMode,
  getCompany,
  getGlobalSetting,
  getSocket,
  getUserData,
} from "./Api";
import {
  BOMSX_DATA,
  BTP_AUTO_DATA,
  BTP_AUTO_DATA2,
  BTP_AUTO_DATA_SUMMARY,
  CODE_FULL_INFO,
  CodeListData,
  COMPONENT_DATA,
  CustomerListData,
  DAILY_YCSX_RESULT,
  DEFECT_PROCESS_DATA,
  DEPARTMENT_DATA,
  DINHMUC_QSLX,
  DTC_TEST_POINT,
  EQ_STT,
  FCSTTDYCSX,
  InvoiceTableData,
  LEADTIME_DATA,
  LICHSUINPUTLIEU_DATA,
  LICHSUNHAPKHOAO,
  LICHSUXUATKHOAO,
  LONGTERM_PLAN_DATA,
  LOSS_TABLE_DATA,
  MACHINE_LIST,
  MAT_DOC_DATA,
  POBALANCETDYCSX,
  PONOLIST,
  POST_DATA,
  POTableData,
  PRICEWITHMOQ,
  PROD_OVER_DATA,
  PROD_PLAN_CAPA_DATA,
  PROD_PROCESS_DATA,
  QLSXCHITHIDATA,
  QLSXPLANDATA,
  RecentDM,
  SX_DATA,
  TEMLOTSX_DATA,
  TestListTable,
  TONKHOTDYCSX,
  TONLIEUXUONG,
  UploadAmazonData,
  UserData,
  WEB_SETTING_DATA,
  YCSX_SLC_DATA,
  YCSX_SX_DATA,
  YCSXTableData,
} from "./GlobalInterface";
import moment from "moment";
import CHITHI_COMPONENT from "../pages/qlsx/QLSXPLAN/CHITHI/CHITHI_COMPONENT";
import CHITHI_COMPONENT2 from "../pages/qlsx/QLSXPLAN/CHITHI/CHITHI_COMPONENT2";
import YCSXComponent from "../pages/kinhdoanh/ycsxmanager/YCSXComponent/YCSXComponent";
import DrawComponent from "../pages/kinhdoanh/ycsxmanager/DrawComponent/DrawComponent";
import TEXT from "../pages/rnd/design_amazon/design_components/TEXT";
import RECTANGLE from "../pages/rnd/design_amazon/design_components/RECTANGLE";
import DATAMATRIX from "../pages/rnd/design_amazon/design_components/DATAMATRIX";
import BARCODE from "../pages/rnd/design_amazon/design_components/BARCODE";
import IMAGE from "../pages/rnd/design_amazon/design_components/IMAGE";
import QRCODE from "../pages/rnd/design_amazon/design_components/QRCODE";
import { NotificationElement } from "../components/NotificationPanel/Notification";
export const zeroPad = (num: number, places: number) =>
  String(num).padStart(places, "0");
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
export const autoGetProdPrice = async (
  G_CODE: string,
  CUST_CD: string,
  PO_QTY: number
) => {
  console.log(G_CODE);
  console.log(CUST_CD);
  console.log(PO_QTY);
  let loaded_price = {
    prod_price: 0,
    bep: 0,
  };
  await generalQuery("loadbanggiamoinhat", {
    ALLTIME: true,
    FROM_DATE: "",
    TO_DATE: "",
    M_NAME: "",
    G_CODE: G_CODE,
    G_NAME: "",
    CUST_NAME_KD: "",
    CUST_CD: CUST_CD,
  })
    .then((response) => {
      //console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        let loaded_data: PRICEWITHMOQ[] = [];
        loaded_data = response.data.data
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
            (element: PRICEWITHMOQ, index: number) => element.FINAL === "Y"
          );
        loaded_price = {
          prod_price:
            loaded_data.filter((e: PRICEWITHMOQ, index: number) => {
              return PO_QTY >= e.MOQ;
            })[0]?.PROD_PRICE ?? 0,
          bep:
            loaded_data.filter((e: PRICEWITHMOQ, index: number) => {
              return PO_QTY >= e.MOQ;
            })[0]?.BEP ?? 0,
        };
        console.log("loaded_price", loaded_price);
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
};
export async function checkBP(
  userData: UserData | undefined,
  permitted_main_dept: string[],
  permitted_position: string[],
  permitted_empl: string[],
  func: any
) {
  /*  console.log(userData?.MAINDEPTNAME);
  console.log(permitted_main_dept);
  console.log(userData?.JOB_NAME);
  console.log(permitted_position);
  console.log(permitted_empl); */
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
            userData.JOB_NAME === undefined ? "NA" : userData.JOB_NAME
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
        } else if (permitted_position.indexOf(userData.JOB_NAME ?? "NA") > -1) {
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
          "warning"
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
    " "
  );
  return str;
}
export function deBounce(func: any, delay: number) {
  let timer: any;
  clearTimeout(timer);
  timer = setTimeout(() => {
    func();
  }, delay);
}
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
export const ERR_TABLE = [
  { ERR_CODE: "ERR1", ERR_NAME_VN: "Loss thêm túi", ERR_NAME_KR: "포장 로스" },
  {
    ERR_CODE: "ERR2",
    ERR_NAME_VN: "Loss bóc đầu cuối",
    ERR_NAME_KR: "초종 파괴 검사 로스",
  },
  {
    ERR_CODE: "ERR3",
    ERR_NAME_VN: "Loss điểm nối",
    ERR_NAME_KR: "이음애 로스",
  },
  {
    ERR_CODE: "ERR4",
    ERR_NAME_VN: "Dị vật/chấm gel",
    ERR_NAME_KR: "원단 이물/겔 점",
  },
  { ERR_CODE: "ERR5", ERR_NAME_VN: "Nhăn VL", ERR_NAME_KR: "원단 주름" },
  { ERR_CODE: "ERR6", ERR_NAME_VN: "Loang bẩn VL", ERR_NAME_KR: "얼룩" },
  { ERR_CODE: "ERR7", ERR_NAME_VN: "Bóng khí VL", ERR_NAME_KR: "원단 기포" },
  { ERR_CODE: "ERR8", ERR_NAME_VN: "Xước VL", ERR_NAME_KR: "원단 스크래치" },
  {
    ERR_CODE: "ERR9",
    ERR_NAME_VN: "Chấm lồi lõm VL",
    ERR_NAME_KR: "원단 눌림",
  },
  { ERR_CODE: "ERR10", ERR_NAME_VN: "Keo VL", ERR_NAME_KR: "원단 찐" },
  {
    ERR_CODE: "ERR11",
    ERR_NAME_VN: "Lông PE VL",
    ERR_NAME_KR: "원단 버 (털 모양)",
  },
  {
    ERR_CODE: "ERR12",
    ERR_NAME_VN: "Lỗi IN (Dây mực)",
    ERR_NAME_KR: "잉크 튐",
  },
  {
    ERR_CODE: "ERR13",
    ERR_NAME_VN: "Lỗi IN (Mất nét)",
    ERR_NAME_KR: "글자 유실",
  },
  {
    ERR_CODE: "ERR14",
    ERR_NAME_VN: "Lỗi IN (Lỗi màu)",
    ERR_NAME_KR: "색상 불량",
  },
  {
    ERR_CODE: "ERR15",
    ERR_NAME_VN: "Lỗi IN (Chấm đường khử keo)",
    ERR_NAME_KR: "점착 제거 선 점 불량",
  },
  {
    ERR_CODE: "ERR16",
    ERR_NAME_VN: "DIECUT (Lệch/Viền màu)",
    ERR_NAME_KR: "타발 편심",
  },
  { ERR_CODE: "ERR17", ERR_NAME_VN: "DIECUT (Sâu)", ERR_NAME_KR: "과타발" },
  { ERR_CODE: "ERR18", ERR_NAME_VN: "DIECUT (Nông)", ERR_NAME_KR: "미타발" },
  { ERR_CODE: "ERR19", ERR_NAME_VN: "DIECUT (BAVIA)", ERR_NAME_KR: "타발 버" },
  { ERR_CODE: "ERR20", ERR_NAME_VN: "Mất bước", ERR_NAME_KR: "차수 누락" },
  { ERR_CODE: "ERR21", ERR_NAME_VN: "Xước", ERR_NAME_KR: "스크래치" },
  { ERR_CODE: "ERR22", ERR_NAME_VN: "Nhăn gãy", ERR_NAME_KR: "주름꺽임" },
  { ERR_CODE: "ERR23", ERR_NAME_VN: "Hằn", ERR_NAME_KR: "자국" },
  { ERR_CODE: "ERR24", ERR_NAME_VN: "Sót rác", ERR_NAME_KR: "미 스크랩" },
  { ERR_CODE: "ERR25", ERR_NAME_VN: "Bóng Khí", ERR_NAME_KR: "기포" },
  { ERR_CODE: "ERR26", ERR_NAME_VN: "Bẩn keo bề mặt", ERR_NAME_KR: "표면 찐" },
  { ERR_CODE: "ERR27", ERR_NAME_VN: "Chấm thủng/lồi lõm", ERR_NAME_KR: "찍힘" },
  { ERR_CODE: "ERR28", ERR_NAME_VN: "Bụi trong", ERR_NAME_KR: "내면 이물" },
  { ERR_CODE: "ERR29", ERR_NAME_VN: "Hụt Tape", ERR_NAME_KR: "테이프 줄여듬" },
  { ERR_CODE: "ERR30", ERR_NAME_VN: "Bong keo", ERR_NAME_KR: "찐 벗겨짐" },
  {
    ERR_CODE: "ERR31",
    ERR_NAME_VN: "Lấp lỗ sensor",
    ERR_NAME_KR: "센서 홀 막힘",
  },
  {
    ERR_CODE: "ERR32",
    ERR_NAME_VN: "Marking SX",
    ERR_NAME_KR: "생산 마킹 구간 썩임",
  },
  { ERR_CODE: "ERR33", ERR_NAME_VN: "Cong Vinyl", ERR_NAME_KR: "비닐 컬" },
  { ERR_CODE: "ERR34", ERR_NAME_VN: "Mixing", ERR_NAME_KR: "혼입" },
  { ERR_CODE: "ERR35", ERR_NAME_VN: "Sai thiết kế", ERR_NAME_KR: "설계 불량" },
  {
    ERR_CODE: "ERR36",
    ERR_NAME_VN: "Sai vật liệu",
    ERR_NAME_KR: "원단 잘 못 사용",
  },
  { ERR_CODE: "ERR37", ERR_NAME_VN: "NG kích thước", ERR_NAME_KR: "치수 불량" },
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
    var result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
}
//PO Manager Functions
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
        machineListData = loadeddata;
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
        if (checktontaiM_CODE) {
          await generalQuery("updateChiThi", {
            PLAN_ID: selectedPlan?.PLAN_ID,
            M_CODE: chithidatatable[i].M_CODE,
            M_ROLL_QTY: chithidatatable[i].M_ROLL_QTY,
            M_MET_QTY: chithidatatable[i].M_MET_QTY,
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
            M_MET_QTY: chithidatatable[i].M_MET_QTY,
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
      O300_OUT_NO = response.data.data[0].OUT_NO;
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
    //console.log('chithidatatable[i]',chithidatatable[i]);
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
          OUT_PRE_QTY: chithidatatable[i].M_MET_QTY * chithidatatable[i].M_QTY,
          PLAN_ID: selectedPlan.PLAN_ID,
        });
      } else {
        await f_updateO301({
          M_CODE: chithidatatable[i].M_CODE,
          OUT_PRE_QTY: chithidatatable[i].M_MET_QTY * chithidatatable[i].M_QTY,
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
              TON <= 0 ? 0 : TON < UPH * qtyFactor ? TON : UPH * qtyFactor,
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
export const monthArray = [
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
];
export const dayArray = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
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
];
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
export const f_insertYCSX = async (ycsxData: any) => {
  let err_code: string = "NG";
  await generalQuery("insert_ycsx", {
    PHANLOAI: ycsxData.PHANLOAI,
    G_CODE: ycsxData.G_CODE,
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
          if (ycsxList[i].PL_HANG != "TT") {
            await f_deleteP500_YCSX(
              ycsxList[i].PROD_REQUEST_NO,
              ycsxList[i].EMPL_NO
            );
            await f_deleteP501_YCSX(
              ycsxList[i].PROD_REQUEST_NO + "A",
              ycsxList[i].EMPL_NO
            );
            if (ycsxList[i].PL_HANG === "AM") {
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
        CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${getUserData()?.FIRST_NAME
          }), nhân viên ${getUserData()?.WORK_POSITION_NAME} đã xóa YCSX: ${ycsxList[0].PROD_REQUEST_NO
          }, CODE: ${ycsxList[0]?.G_CODE}, CUST_CD: ${ycsxList[0]?.CUST_CD
          }, QTY: ${ycsxList[0]?.PROD_REQUEST_QTY
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
        "Có lỗi: Có thể ycsx này đã được đăng ký xuất liệu",
        "error"
      );
    }
  } else {
    Swal.fire("Thông báo", "Chọn ít nhất 1 YCSX để xóa !", "error");
  }
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
        checkTonTai = false;
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
        checkTonTai = false;
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
            console.log(response.data.tk_status);
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
// dtc
export const f_loadDTC_TestList = async () => {
  let kq: TestListTable[] = [];
  await generalQuery("loadDtcTestList", {})
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        const loadeddata: TestListTable[] = response.data.data.map(
          (element: TestListTable, index: number) => {
            return {
              ...element,
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
//create load test point list from test code
export const f_loadDTC_TestPointList = async (testCode: number) => {
  let kq: DTC_TEST_POINT[] = [];
  await generalQuery("loadDtcTestPointList", {
    TEST_CODE: testCode,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        const loadeddata: DTC_TEST_POINT[] = response.data.data.map(
          (element: DTC_TEST_POINT, index: number) => {
            return {
              ...element,
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
//create add test item
export const f_addTestItem = async (testCode: number, testName: string) => {
  await generalQuery("addTestItem", {
    TEST_CODE: getCompany() !== "CMS" ? testCode : -1,
    TEST_NAME: testName,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        Swal.fire("Thông báo", "Thêm thành công", "success");
      } else {
        Swal.fire("Thông báo", "Thêm thất bại", "error");
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
//create add test point
export const f_addTestPoint = async (
  testCode: number,
  pointCode: number,
  pointName: string
) => {
  await generalQuery("addTestPoint", {
    TEST_CODE: testCode,
    POINT_CODE: pointCode,
    POINT_NAME: pointName,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        Swal.fire("Thông báo", "Thêm thành công", "success");
      } else {
        Swal.fire("Thông báo", "Thêm thất bại", "error");
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
export const isValidInput = (input: string) => {
  const regex = /^[a-zA-Z0-9_]*$/; // Example: allow only alphanumeric and underscores
  return regex.test(input);
};
//update ncr id for holding material
export const f_updateNCRIDForHolding = async (
  HOLD_ID: number,
  ncrId: number
) => {
  await generalQuery("updateNCRIDForHolding", {
    HOLD_ID: HOLD_ID,
    NCR_ID: ncrId,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        //Swal.fire("Thông báo", "Cập nhật thành công", "success");
      } else {
        Swal.fire("Thông báo", "Cập nhật thất bại", "error");
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
//update ncr id for failing material
export const f_updateNCRIDForFailing = async (
  FAIL_ID: number,
  ncrId: number
) => {
  await generalQuery("updateNCRIDForFailing", {
    FAIL_ID: FAIL_ID,
    NCR_ID: ncrId,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        //Swal.fire("Thông báo", "Cập nhật thành công", "success");
      } else {
        Swal.fire("Thông báo", "Cập nhật thất bại", "error");
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
export const checkHSD2 = (
  hsdVL: number,
  hsdSP: number,
  pd_hsd: string,
  ql_hsd: string
): boolean => {
  return (
    (hsdVL === hsdSP && hsdVL !== 0) ||
    (pd_hsd === "Y" && hsdVL > 0 && hsdSP > 0) ||
    ql_hsd === "N"
  );
};
export const renderElement = (elementList: Array<COMPONENT_DATA>) => {
  return elementList.map((ele: COMPONENT_DATA, index: number) => {
    if (ele.PHANLOAI_DT === "TEXT") {
      return <TEXT key={index} DATA={ele} />;
    } else if (ele.PHANLOAI_DT === "CONTAINER") {
      return <RECTANGLE key={index} DATA={ele} />;
    } else if (ele.PHANLOAI_DT === "2D MATRIX") {
      return <DATAMATRIX key={index} DATA={ele} />;
    } else if (ele.PHANLOAI_DT === "1D BARCODE") {
      return <BARCODE key={index} DATA={ele} />;
    } else if (ele.PHANLOAI_DT === "IMAGE") {
      return <IMAGE key={index} DATA={ele} />;
    } else if (ele.PHANLOAI_DT === "QRCODE") {
      return <QRCODE key={index} DATA={ele} />;
    }
  });
};
export const f_handleGETBOMAMAZON = async (G_CODE: string) => {
  let kq: COMPONENT_DATA[] = [];
  await generalQuery("getAMAZON_DESIGN", {
    G_CODE: G_CODE,
  })
    .then((response) => {
      ////console.log(response.data);
      if (response.data.tk_status !== "NG") {
        const loadeddata: COMPONENT_DATA[] = response.data.data.map(
          (element: COMPONENT_DATA, index: number) => {
            return {
              ...element,
              id: index,
            };
          }
        );
        ////console.log(loadeddata);
        kq = loadeddata;
      } else {
        //Swal.fire("Thông báo", "Lỗi BOM SX: " + response.data.message, "error");
        kq = [];
      }
    })
    .catch((error) => {
      //console.log(error);
    });
  return kq;
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
export const f_updateStockM090 = async () => {
  let kq: boolean = false;
  await generalQuery("updateStockM090", {})
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
export const f_resetIN_KHO_SX_IQC1 = async (
  PLAN_ID: string,
  M_LOT_NO: string
) => {
  let kq: boolean = false;
  await generalQuery("resetKhoSX_IQC1", {
    PLAN_ID: PLAN_ID,
    M_LOT_NO: M_LOT_NO,
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
export const f_resetIN_KHO_SX_IQC2 = async (
  PLAN_ID: string,
  M_LOT_NO: string
) => {
  let kq: boolean = false;
  await generalQuery("resetKhoSX_IQC2", {
    PLAN_ID: PLAN_ID,
    M_LOT_NO: M_LOT_NO,
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
export const f_getMaterialDocData = async (filterData: any) => {
  let mat_doc_data: MAT_DOC_DATA[] = [];
  await generalQuery("getMaterialDocData", filterData)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        const loadeddata: MAT_DOC_DATA[] = response.data.data.map(
          (element: MAT_DOC_DATA, index: number) => {
            return {
              ...element,
              id: index,
              REG_DATE: element.REG_DATE?.slice(0, 10) ?? "",
              EXP_DATE: element.EXP_DATE?.slice(0, 10) ?? "",
              PUR_APP_DATE: element.PUR_APP_DATE?.slice(0, 10) ?? "",
              DTC_APP_DATE: element.DTC_APP_DATE?.slice(0, 10) ?? "",
              RND_APP_DATE: element.RND_APP_DATE?.slice(0, 10) ?? "",
              INS_DATE: element.INS_DATE?.slice(0, 10) ?? "",
              UPD_DATE: element.UPD_DATE?.slice(0, 10) ?? "",
            };
          }
        );
        mat_doc_data = loadeddata;
      } else {
        mat_doc_data = [];
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return mat_doc_data;
};
export const f_insertMaterialDocData = async (DATA: any) => {
  let kq: boolean = false;
  await generalQuery("insertMaterialDocData", DATA)
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
export const f_checkDocVersion = async (DATA: any) => {
  let kq: number = 0;
  await generalQuery("checkDocVersion", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        kq = response.data.data[0].VER;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq + 1;
};
export const f_updateMaterialDocData = async (DATA: any) => {
  let kq: boolean = false;
  await generalQuery("updateMaterialDocData", DATA)
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
export const f_updatePurApp = async (DATA: any) => {
  let kq: boolean = false;
  await generalQuery("updatePurApp", DATA)
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
export const f_updateDtcApp = async (DATA: any) => {
  let kq: boolean = false;
  await generalQuery("updateDtcApp", DATA)
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
export const f_updateRndApp = async (DATA: any) => {
  let kq: boolean = false;
  await generalQuery("updateRndApp", DATA)
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
export const f_updateLossKT = async (codeList: CODE_FULL_INFO[]) => {
  if (codeList.length >= 1) {
    checkBP(getUserData(), ["ALL"], ["ALL"], ["ALL"], async () => {
      for (let i = 0; i < codeList.length; i++) {
        await generalQuery("updateLossKT", {
          G_CODE: codeList[i].G_CODE,
          LOSS_KT: codeList[i].LOSS_KT ?? 0,
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
      Swal.fire("Thông báo", "Update LOSS KT THÀNH CÔNG", "success");
    });
  } else {
    Swal.fire("Thông báo", "Chọn ít nhất 1 G_CODE để Update !", "error");
  }
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
export const f_autoUpdateDocUSE_YN = async (DATA: any) => {
  let kq: boolean = false;
  await generalQuery("autoUpdateDocUSEYN_EXP", DATA)
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
export const f_isM_LOT_NO_in_IN_KHO_SX = async (
  PLAN_ID: string,
  M_LOT_NO: string
) => {
  let kq: boolean = false;
  await generalQuery("isM_LOT_NO_in_IN_KHO_SX", {
    PLAN_ID: PLAN_ID,
    M_LOT_NO: M_LOT_NO,
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
export const f_isM_CODE_in_M140_Main = async (
  M_CODE: string,
  G_CODE: string
) => {
  let kq: boolean = false;
  await generalQuery("check_m_code_m140_main", {
    M_CODE: M_CODE,
    G_CODE: G_CODE,
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
export const f_load_Notification_Data = async () => {
  let kq: NotificationElement[] = [];
  await generalQuery("load_Notification_Data", {
    MAINDEPTNAME: getUserData()?.MAINDEPTNAME,
    SUBDEPTNAME: getUserData()?.SUBDEPTNAME,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        kq = response.data.data.map((element: any, index: number) => {
          return {
            ...element,
            INS_DATE: moment
              .utc(element.INS_DATE)
              .format("YYYY-MM-DD HH:mm:ss"),
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
export const f_insert_Notification_Data = async (DATA: any) => {
  let kq: boolean = false;
  await generalQuery("insert_Notification_Data", DATA)
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
export const f_isM_LOT_NO_in_O302 = async (
  planId: string,
  m_lot_no: string
) => {
  let kq: boolean = false;
  await generalQuery("isM_LOT_NO_in_O302", {
    PLAN_ID: planId,
    M_LOT_NO: m_lot_no,
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
export const f_getI221NextIN_NO = async () => {
  let next_in_no: string = "001";
  await generalQuery("getI221Lastest_IN_NO", {})
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        //console.log(response.data.data);
        const current_in_no: string = response.data.data[0].MAX_IN_NO ?? "000";
        next_in_no = zeroPad(parseInt(current_in_no) + 1, 3);
      } else {
      }
    })
    .catch((error) => {
      //console.log(error);
    });
  //console.log(next_in_no);
  return next_in_no;
};
export const f_getI222Next_M_LOT_NO = async () => {
  let next_m_lot_no: string = "001";
  await generalQuery("getI222Lastest_M_LOT_NO", {})
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        //console.log(response.data.data);
        const current_m_lot_no: string = response.data.data[0].MAX_M_LOT_NO;
        let part1: string = current_m_lot_no.substring(0, 8);
        let part2: string = current_m_lot_no.substring(8, 12);
        next_m_lot_no = part1 + zeroPad(parseInt(part2) + 1, 4);
      } else {
      }
    })
    .catch((error) => {
      //console.log(error);
    });
  //console.log(next_m_lot_no);
  return next_m_lot_no;
};
export const f_Insert_I221 = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("insert_I221", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {
      console.log(error);
      kq = error.message;
    });
  return kq;
};
export const f_Insert_I222 = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("insert_I222", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {
      console.log(error);
      kq = error.message;
    });
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
export const f_updateBTP_M100 = async () => {
  let kq: boolean = false;
  await generalQuery("updateBTP_M1002", {})
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
export const f_setCa = async (DATA: any) => {
  let kq: boolean = false;
  await generalQuery("setca", {
    EMPL_NO: DATA.EMPL_NO,
    CALV: DATA.CALV,
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
export const f_setCaDiemDanh = async (DATA: any) => {
  let kq: boolean = false;
  await generalQuery("setcadiemdanh", {
    EMPL_NO: DATA.EMPL_NO,
    APPLY_DATE: DATA.APPLY_DATE,
    CALV: DATA.CALV,
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
export const f_updateTONKIEM_M100 = async () => {
  let kq: boolean = false;
  await generalQuery("updateTONKIEM_M100", {})
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
export const f_getDepartmentList = async () => {
  let kq: DEPARTMENT_DATA[] = [];
  await generalQuery("getDepartmentList", {})
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        kq = response.data.data;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
}
export const f_loadLongTermPlan = async (PLAN_DATE: string) => {
  let kq: LONGTERM_PLAN_DATA[] = [];
  await generalQuery("loadKHSXDAIHAN", {
    PLAN_DATE: PLAN_DATE
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        let loaded_data: LONGTERM_PLAN_DATA[] = [];
        loaded_data = response.data.data.map((element: LONGTERM_PLAN_DATA, index: number) => {
          return (
            {
              ...element,
              PLAN_DATE: element.PLAN_DATE !== null ? moment.utc(element.PLAN_DATE).format('YYYY-MM-DD') : '',
              id: index
            }
          )
        })
        kq = loaded_data;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  if (kq.length === 0) {
    Swal.fire('Thông báo', 'Không có dòng nào', 'error');
  }
  return kq;
}
export const f_insertLongTermPlan = async (DATA: LONGTERM_PLAN_DATA, PLAN_DATE: string) => {
  let kq: string = '';
  console.log(PLAN_DATE)
  let insertData = {
    ...DATA,
    PLAN_DATE: PLAN_DATE
  }
  console.log('insertData', insertData)
  await generalQuery("insertKHSXDAIHAN", insertData)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      }
      else {
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
  let kq: string = '';
  await generalQuery("updateKHSXDAIHAN", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      }
      else {
        kq = response.data.message;
      }
    })
    .catch((error) => {
      kq = error.message;
      console.log(error);
    });
  return kq;
};
export const f_moveLongTermPlan = async (FROM_DATE: string, TO_DATE: string) => {
  let kq: string = '';
  await generalQuery("moveKHSXDAIHAN", {
    FROM_DATE: FROM_DATE,
    TO_DATE: TO_DATE
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      }
      else {
        kq = response.data.message;
      }
    })
    .catch((error) => {
    })
};
export const f_deleteNotExistLongTermPlan = async (PLAN_DATE: string) => {
  let kq: string = '';
  await generalQuery("deleteNotExistKHSXDAIHAN", {
    PLAN_DATE: PLAN_DATE
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      }
      else {
        kq = response.data.message;
      }
    })
    .catch((error) => {
    })
}

export const f_getProductionPlanLeadTimeCapaData = async (PLAN_DATE: string) => {
  let kq: PROD_PLAN_CAPA_DATA[] = [];
  await generalQuery("getProductionPlanCapaData", { PLAN_DATE: PLAN_DATE })
    .then((response) => {
      //console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        const loaded_data: PROD_PLAN_CAPA_DATA[] = response.data.data.map(
          (element: PROD_PLAN_CAPA_DATA, index: number) => {
            return {
              ...element,
              PROD_DATE: element.PROD_DATE !== null ? moment.utc(PLAN_DATE).add(Number(element.PROD_DATE.substring(2, 4)) - 1, 'day').format('YYYY-MM-DD') : '',
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
}
export const f_fetchPostListAll = async () => {
  let kq: POST_DATA[] = [];
  try {
    let res = await generalQuery('loadPostAll', {});
    //console.log(res);
    if (res.data.tk_status !== 'NG') {
      //console.log(res.data.data);
      let loaded_data: POST_DATA[] = res.data.data.map((ele: POST_DATA, index: number) => {
        return {
          ...ele,
          INS_DATE: moment.utc(ele.INS_DATE).format('YYYY-MM-DD HH:mm:ss'),
          UPD_DATE: moment.utc(ele.UPD_DATE).format('YYYY-MM-DD HH:mm:ss'),
          id: index
        }
      })
      kq = loaded_data;
    } else {
      console.log('fetch error');
    }
  } catch (error) {
    console.log(error);
  }
  return kq;
};
export const f_fetchPostList = async (DEPT_CODE: number) => {
  let kq: POST_DATA[] = [];
  try {
    let res = await generalQuery('loadPost', { DEPT_CODE: DEPT_CODE });
    //console.log(res);
    if (res.data.tk_status !== 'NG') {
      //console.log(res.data.data);
      let loaded_data: POST_DATA[] = res.data.data.map((ele: POST_DATA, index: number) => {
        return {
          ...ele,
          INS_DATE: moment.utc(ele.INS_DATE).format('YYYY-MM-DD HH:mm:ss'),
          UPD_DATE: moment.utc(ele.UPD_DATE).format('YYYY-MM-DD HH:mm:ss'),
          id: index
        }
      })
      kq = loaded_data;
    } else {
      console.log('fetch error');
    }
  } catch (error) {
    console.log(error);
  }
  return kq;
};
export const f_updatePostData = async (DATA: POST_DATA) => {
  //console.log(DATA)
  let kq: string = '';
  await generalQuery("updatePost", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      }
      else {
        kq = response.data.message;
      }
    })
    .catch((error) => {
    })
}
export const f_deletePostData = async (DATA: POST_DATA) => {
  //console.log(DATA)
  let kq: string = '';
  await generalQuery("deletePost", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      }
      else {
        kq = response.data.message;
      }
    })
    .catch((error) => {
    })
    return kq;
}
export const f_downloadFile = async (fileURL: string, fileName: string) => {
  try {
    // Tải file từ server dưới dạng blob
    const response = await fetch(fileURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to download file");
    }
    // Chuyển response thành blob
    const blob = await response.blob();
    // Tạo URL tạm thời cho file
    const tempUrl = window.URL.createObjectURL(blob);
    // Tạo một thẻ <a> để tải file
    const a = document.createElement("a");
    a.href = tempUrl;
    a.download = fileName; // Tên file khi tải xuống
    document.body.appendChild(a);
    a.click();
    // Xóa URL tạm thời và thẻ <a>
    window.URL.revokeObjectURL(tempUrl);
    document.body.removeChild(a);
  } catch (error) {
    console.error("Error downloading file:", error);
    Swal.fire("Thống báo", "Download file thất bại !", "error");
  }
}
export const f_deleteLongtermPlan = async (DATA: LONGTERM_PLAN_DATA) => {
  let kq: string = '';
  await generalQuery("deleteLongtermPlan", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      }
      else {
        kq = response.data.message;
      }
    })
    .catch((error) => {
    })
    return kq;
}
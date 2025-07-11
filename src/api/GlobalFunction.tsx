import { ResponsiveContainer } from "recharts";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import {
  generalQuery,
  getCompany,
  getUserData,
} from "./Api";
import {
  AUDIT_HISTORY_DATA,
  CODE_FULL_INFO,
  COMPONENT_DATA,
  DEFECT_PROCESS_DATA,
  DEPARTMENT_DATA,
  DTC_TEST_POINT,
  EmployeeTableData,
  INSPECT_STATUS_DATA,
  KHKT_DATA,
  KPI_DATA,
  MainDeptTableData,
  MAT_DOC_DATA,
  MRPDATA,
  POST_DATA,
  SubDeptTableData,
  TEMLOTKT_DATA,
  TestListTable,
  UserData,
  userDataInterface,
  WORK_POSITION_DATA,
} from "./GlobalInterface";
import moment from "moment";
import TEXT from "../pages/rnd/design_amazon/design_components/TEXT";
import RECTANGLE from "../pages/rnd/design_amazon/design_components/RECTANGLE";
import DATAMATRIX from "../pages/rnd/design_amazon/design_components/DATAMATRIX";
import BARCODE from "../pages/rnd/design_amazon/design_components/BARCODE";
import IMAGE from "../pages/rnd/design_amazon/design_components/IMAGE";
import QRCODE from "../pages/rnd/design_amazon/design_components/QRCODE";
import { NotificationElement } from "../components/NotificationPanel/Notification";
import { Field, Form } from "../pages/nocodelowcode/types/types";
import { Component } from "react";
import { Login } from "./lazyPages";
import { PRICEWITHMOQ } from "../pages/kinhdoanh/interfaces/kdInterface";
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
};



export const f_fetchPostListAll = async () => {
  let kq: POST_DATA[] = [];
  try {
    let res = await generalQuery("loadPostAll", {});
    //console.log(res);
    if (res.data.tk_status !== "NG") {
      //console.log(res.data.data);
      let loaded_data: POST_DATA[] = res.data.data.map(
        (ele: POST_DATA, index: number) => {
          return {
            ...ele,
            INS_DATE: moment.utc(ele.INS_DATE).format("YYYY-MM-DD HH:mm:ss"),
            UPD_DATE: moment.utc(ele.UPD_DATE).format("YYYY-MM-DD HH:mm:ss"),
            id: index,
          };
        }
      );
      kq = loaded_data;
    } else {
      console.log("fetch error");
    }
  } catch (error) {
    console.log(error);
  }
  return kq;
};
export const f_fetchPostList = async (DEPT_CODE: number) => {
  let kq: POST_DATA[] = [];
  try {
    let res = await generalQuery("loadPost", { DEPT_CODE: DEPT_CODE });
    //console.log(res);
    if (res.data.tk_status !== "NG") {
      //console.log(res.data.data);
      let loaded_data: POST_DATA[] = res.data.data.map(
        (ele: POST_DATA, index: number) => {
          return {
            ...ele,
            INS_DATE: moment.utc(ele.INS_DATE).format("YYYY-MM-DD HH:mm:ss"),
            UPD_DATE: moment.utc(ele.UPD_DATE).format("YYYY-MM-DD HH:mm:ss"),
            id: index,
          };
        }
      );
      kq = loaded_data;
    } else {
      console.log("fetch error");
    }
  } catch (error) {
    console.log(error);
  }
  return kq;
};
export const f_updatePostData = async (DATA: POST_DATA) => {
  //console.log(DATA)
  let kq: string = "";
  await generalQuery("updatePost", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
};
export const f_deletePostData = async (DATA: POST_DATA) => {
  //console.log(DATA)
  let kq: string = "";
  await generalQuery("deletePost", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_downloadFile2 = async (
  fileURL: string,
  fileName: string,
  onProgress: (percentage: number) => void // Callback để cập nhật tiến trình
) => {
  try {
    const response = await fetch(fileURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/octet-stream",
        "Cache-Control": "no-cache",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to download file");
    }
    // Lấy reader từ body
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Failed to get response reader");
    }
    // Lấy kích thước file từ header
    const contentLength = Number(response.headers.get("Content-Length")) || 0;
    let receivedLength = 0;
    // Tạo mảng để chứa các chunk
    const chunks: Uint8Array[] = [];
    // Đọc dữ liệu theo từng chunk
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        chunks.push(value);
        receivedLength += value.length;
        // Tính phần trăm và gọi callback
        if (contentLength > 0) {
          const percentage = Math.round((receivedLength * 100) / contentLength);
          onProgress(percentage);
        }
      }
    }
    // Gộp các chunk thành blob
    const blob = new Blob(chunks);
    const tempUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = tempUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(tempUrl);
    document.body.removeChild(a);
    // Reset progress về 0 sau khi hoàn thành
    onProgress(0);
  } catch (error) {
    console.error("Error downloading file:", error);
    Swal.fire("Thống báo", "Download file thất bại !", "error");
    onProgress(0); // Reset progress nếu lỗi
  }
};
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
};

export const f_cancelProductionLot = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("cancelProductionLot", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_getEmployeeList = async () => {
  let kq: EmployeeTableData[] = [];
  try {
    let res = await generalQuery("getemployee_full", {});
    //console.log(res);
    if (res.data.tk_status !== "NG") {
      //console.log(res.data.data);
      let loaded_data: EmployeeTableData[] = res.data.data.map(
        (element: EmployeeTableData, index: number) => {
          return {
            ...element,
            DOB:
              element.DOB !== null
                ? moment.utc(element.DOB).format("YYYY-MM-DD")
                : "",
            WORK_START_DATE:
              element.WORK_START_DATE !== null
                ? moment.utc(element.WORK_START_DATE).format("YYYY-MM-DD")
                : "",
            RESIGN_DATE:
              element.RESIGN_DATE !== null
                ? moment.utc(element.RESIGN_DATE).format("YYYY-MM-DD")
                : "",
            ONLINE_DATETIME:
              element.ONLINE_DATETIME !== null
                ? moment
                    .utc(element.ONLINE_DATETIME)
                    .format("YYYY-MM-DD HH:mm:ss")
                : "",
            FULL_NAME: element.MIDLAST_NAME + " " + element.FIRST_NAME,
            PASS_WORD:
              getUserData()?.EMPL_NO === "NHU1903"
                ? element.PASSWORD
                : "********",
          };
        }
      );
      kq = loaded_data;
    } else {
      console.log("fetch error");
    }
  } catch (error) {
    console.log(error);
  }
  return kq;
};
export const f_loadWorkPositionList = async (SUBDEPTCODE?: number) => {
  let kq: WORK_POSITION_DATA[] = [];
  try {
    let res = await generalQuery(
      "workpositionlist",
      SUBDEPTCODE === undefined ? {} : { SUBDEPTCODE: SUBDEPTCODE }
    );
    //console.log(res);
    if (res.data.tk_status !== "NG") {
      //console.log(res.data.data);
      let loaded_data: WORK_POSITION_DATA[] = res.data.data.map(
        (element: WORK_POSITION_DATA, index: number) => {
          return {
            ...element,
            id: index,
          };
        }
      );
      kq = loaded_data;
    } else {
      console.log("fetch error");
    }
  } catch (error) {
    console.log(error);
  }
  return kq;
};
export const f_addEmployee = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("insertemployee", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_updateEmployee = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("updateemployee", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_loadMainDepList = async () => {
  let kq: MainDeptTableData[] = [];
  try {
    let res = await generalQuery("getmaindept", {});
    //console.log(res);
    if (res.data.tk_status !== "NG") {
      //console.log(res.data.data);
      let loaded_data: MainDeptTableData[] = res.data.data.map(
        (element: MainDeptTableData, index: number) => {
          return {
            ...element,
            id: index,
          };
        }
      );
      kq = loaded_data;
    } else {
      console.log("fetch error");
    }
  } catch (error) {
    console.log(error);
  }
  return kq;
};
export const f_loadSubDepList = async (MAINDEPTCODE?: number) => {
  let kq: SubDeptTableData[] = [];
  try {
    let res = await generalQuery(
      "getsubdeptall",
      MAINDEPTCODE === undefined ? {} : { MAINDEPTCODE: MAINDEPTCODE }
    );
    //console.log(res);
    if (res.data.tk_status !== "NG") {
      //console.log(res.data.data);
      let loaded_data: SubDeptTableData[] = res.data.data.map(
        (element: SubDeptTableData, index: number) => {
          return {
            ...element,
            id: index,
          };
        }
      );
      kq = loaded_data;
    } else {
      console.log("fetch error");
    }
  } catch (error) {
    console.log(error);
  }
  return kq;
};
export const f_addMainDept = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("insertmaindept", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {
      kq = error.message;
    });
  return kq;
};
export const f_addSubDept = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("insertsubdept", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_addWorkPosition = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("insertworkposition", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_updateMainDept = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("updatemaindept", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_updateSubDept = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("updatesubdept", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_updateWorkPosition = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("updateworkposition", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_deleteWorkPosition = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("deleteworkposition", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_deleteMainDept = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("deletemaindept", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_deleteSubDept = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("deletesubdept", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_update_Stock_M100_CMS = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("updateTONTP_M100_CMS", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_update_btp_p400 = async () => {
  let kq: string = "";
  await generalQuery("updateBTP_P400", {})
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_update_tonkiem_p400 = async () => {
  let kq: string = "";
  await generalQuery("updatetonkiemP400", {})
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_loadKHKT_ADUNG = async (FROM_DATE: string) => {
  let kq: KHKT_DATA[] = [];
  await generalQuery("khkt_a_dung", {
    FROM_DATE: FROM_DATE,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        Swal.fire("Thông báo", "Load data thành công", "success");
        let loaded_data: KHKT_DATA[] = response.data.data.map(
          (element: KHKT_DATA, index: number) => {
            return {
              ...element,
              PLAN_DATE: moment.utc(element.PLAN_DATE).format("YYYY-MM-DD"),
              id: index,
            };
          }
        );
        kq = loaded_data;
      } else {
        //kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_loadInspect_status_G_CODE = async (PLAN_DATE: string) => {
  let kq: INSPECT_STATUS_DATA[] = [];
  await generalQuery("tinh_hinh_kiemtra_G_CODE", {
    PLAN_DATE: PLAN_DATE,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        let loaded_data: INSPECT_STATUS_DATA[] = response.data.data.map(
          (element: INSPECT_STATUS_DATA, index: number) => {
            return {
              ...element,
              PLAN_DATE: moment.utc(element.PLAN_DATE).format("YYYY-MM-DD"),
              FIRST_INPUT_TIME:
                element.FIRST_INPUT_TIME !== null
                  ? moment
                      .utc(element.FIRST_INPUT_TIME)
                      .format("YYYY-MM-DD HH:mm:ss")
                  : "",
              INS_DATE: moment
                .utc(element.INS_DATE)
                .format("YYYY-MM-DD HH:mm:ss"),
              TOTAL_OUTPUT: element.INIT_WH_STOCK + element.OUTPUT_QTY,
              COVER_D1:
                element.INIT_WH_STOCK + element.OUTPUT_QTY >= element.D1
                  ? "OK"
                  : "NG",
              id: index,
            };
          }
        );
        kq = loaded_data;
      } else {
        //kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_loadTemLotKTHistory = async (
  FROM_DATE: string,
  TO_DATE: string
) => {
  let kq: TEMLOTKT_DATA[] = [];
  await generalQuery("temlotktraHistory", {
    FROM_DATE: FROM_DATE,
    TO_DATE: TO_DATE,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        Swal.fire("Thông báo", "Load data thành công", "success");
        let loaded_data: TEMLOTKT_DATA[] = response.data.data.map(
          (element: TEMLOTKT_DATA, index: number) => {
            return {
              ...element,
              LOT_PRINT_DATE: moment
                .utc(element.LOT_PRINT_DATE)
                .format("YYYY-MM-DD HH:mm:ss"),
              EXP_DATE: moment.utc(element.EXP_DATE).format("YYYY-MM-DD"),
              MFT_DATE: moment.utc(element.MFT_DATE).format("YYYY-MM-DD"),
              id: index,
            };
          }
        );
        kq = loaded_data;
      } else {
        //kq = response.data.message;
        Swal.fire("Thông báo", "Không có data", "error");
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_loadMRPPlan = async (PLAN_DATE: string) => {
  let kq: MRPDATA[] = [];
  await generalQuery("loadMRPPlan", {
    PLAN_DATE: PLAN_DATE,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        Swal.fire("Thông báo", "Load data thành công", "success");
        let loaded_data: MRPDATA[] = response.data.data.map(
          (element: MRPDATA, index: number) => {
            return {
              ...element,
              id: index,
            };
          }
        );
        kq = loaded_data;
      } else {
        //kq = response.data.message;
        Swal.fire("Thông báo", "Không có data", "error");
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_loadFormList = async () => {
  let kq: Form[] = [];
  await generalQuery("loadFormList", {})
    .then((response) => {
      console.log(response.data);
      if (response.data.tk_status !== "NG") {
        Swal.fire("Thông báo", "Load data thành công", "success");
        //console.log(response.data.data);
        let loaded_data: Form[] = response.data.data.map(
          (element: Form, index: number) => {
            return {
              ...element,
              id: index,
            };
          }
        );
        kq = loaded_data;
      } else {
        //kq = response.data.message;
        Swal.fire("Thông báo", "Không có data", "error");
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_updateForm = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("updateForm", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_deleteForm = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("deleteForm", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_loadFormDetail = async (DATA: any) => {
  let kq: Form[] = [];
  await generalQuery("loadFormDetail", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_insertForm = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("insertForm", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_loadFieldList = async (DATA: any) => {
  let kq: Field[] = [];
  await generalQuery("loadFieldList", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        kq = response.data.data;
      } else {
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_insertField = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("insertField", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_updateField = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("updateField", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_deleteField = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("deleteField", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_addField = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("addField", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_loadKPI = async (KPI_NAME: string) => {
  let kq: KPI_DATA[] = [];
  await generalQuery("loadKPI", { KPI_NAME: KPI_NAME })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        if (response.data.data.length > 0) {
          kq = response.data.data;
        }
      } else {
        Swal.fire("Thông báo", "Không có KPI", "error");
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_loadKPIList = async () => {
  let kq: { KPI_NAME: string }[] = [];
  await generalQuery("loadKPIList", {})
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        if (response.data.data.length > 0) {
          kq = response.data.data;
        }
      } else {
        Swal.fire("Thông báo", "Không có KPI", "error");
      }
    })
    .catch((error) => {});
  return kq;
};
export const getNumberofDatesFromMonth = (month_num: number) => {
  if ([1, 3, 5, 7, 8, 10, 12].includes(month_num)) {
    return 31;
  } else if ([4, 6, 9, 11].includes(month_num)) {
    return 30;
  } else {
    return 28;
  }
};
export const getWorkingDaysInMonth = (date: string) => {
  // Lấy ngày đầu tiên và cuối cùng của tháng
  const startOfMonth = moment(date).startOf("month");
  const endOfMonth = moment(date).endOf("month");
  let workingDays = 0;
  // Duyệt qua từng ngày trong tháng
  for (let day = startOfMonth; day <= endOfMonth; day.add(1, "days")) {
    // Kiểm tra nếu là thứ 2 đến thứ 6 (weekday từ 1 đến 5)
    if (day.isoWeekday() <= 5) {
      workingDays++;
    }
  }
  return workingDays;
};
export const f_createKPI = async (DATA: KPI_DATA[]) => {
  let kq: string = "";
  await generalQuery("insertKPI", {
    KPI_DATA: DATA,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {
      kq = error.message;
    });
  return kq;
};
export const f_updateKPI = async (DATA: KPI_DATA[]) => {
  let kq: string = "";
  await generalQuery("updateKPI", {
    KPI_DATA: DATA,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {
      kq = error.message;
    });
  return kq;
};
export const f_deleteKPI = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("deleteKPI", {
    KPI_NAME: DATA[0].KPI_NAME,
    KPI_YEAR: DATA[0].KPI_YEAR,
    KPI_PERIOD: DATA[0].KPI_PERIOD,
    KPI_MONTH: DATA[0].KPI_MONTH,
    VALUE_TYPE: DATA[0].VALUE_TYPE,
  })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {});
  return kq;
};
export async function encryptData(
  publicKey: string,
  data: object
): Promise<{ encryptedData: string; encryptedKey: string; iv: string }> {
  try {
    // Chuyển object thành chuỗi JSON
    const dataString = JSON.stringify(data);
    // Tạo khóa AES ngẫu nhiên
    const aesKey = await crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
    // Tạo initialization vector (IV)
    const iv = crypto.getRandomValues(new Uint8Array(12));
    // Mã hóa dữ liệu bằng AES-GCM
    const encodedData = new TextEncoder().encode(dataString);
    const encryptedData = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      aesKey,
      encodedData
    );
    // Export khóa AES để mã hóa bằng RSA
    const exportedKey = await crypto.subtle.exportKey("raw", aesKey);
    // Chuyển publicKey từ PEM sang ArrayBuffer
    const publicKeyBuffer = pemToArrayBuffer(publicKey);
    // Import public key
    const importedKey = await crypto.subtle.importKey(
      "spki",
      publicKeyBuffer,
      { name: "RSA-OAEP", hash: "SHA-256" },
      false,
      ["encrypt"]
    );
    // Mã hóa khóa AES bằng RSA
    const encryptedKey = await crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      importedKey,
      exportedKey
    );
    // Chuyển dữ liệu mã hóa, khóa, và IV thành base64
    return {
      encryptedData: arrayBufferToBase64(encryptedData),
      encryptedKey: arrayBufferToBase64(encryptedKey),
      iv: arrayBufferToBase64(iv),
    };
  } catch (error: unknown) {
    // Ép kiểu error thành Error và kiểm tra an toàn
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Encryption error:", error);
    throw new Error(`Failed to encrypt data: ${errorMessage}`);
  }
}
// Hàm hỗ trợ chuyển PEM sang ArrayBuffer
function pemToArrayBuffer(pem: string): ArrayBuffer {
  try {
    const b64 = pem
      .replace(/-----BEGIN PUBLIC KEY-----/, "")
      .replace(/-----END PUBLIC KEY-----/, "")
      .replace(/\s/g, "");
    const binary = atob(b64);
    const buffer = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      buffer[i] = binary.charCodeAt(i);
    }
    return buffer.buffer;
  } catch (error: unknown) {
    throw new Error("Invalid public key format");
  }
}
// Hàm hỗ trợ chuyển ArrayBuffer sang base64
function arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export const ProtectedRoute: any = ({
  user,
  maindeptname,
  jobname,
  children,
}: {
  user: userDataInterface;
  maindeptname: string;
  jobname: string;
  children: Component;
}) => {
  if (user.EMPL_NO === "none") {
    /*  return <Navigate to='/login' replace />; */
    return <Login />;
  } else {
    if (
      maindeptname === "all" ||
      user.EMPL_NO === "NHU1903" ||
      user.EMPL_NO === "NVH1011" ||
      user.JOB_NAME === "ADMIN"
    ) {
      if (
        jobname === "all" ||
        user.EMPL_NO === "NHU1903" ||
        user.EMPL_NO === "NVH1011" ||
        user.JOB_NAME === "ADMIN"
      ) {
        return children;
      } else {
        if (
          user.JOB_NAME !== "Leader" &&
          user.JOB_NAME !== "Sub Leader" &&
          user.JOB_NAME !== "Dept Staff" &&
          user.JOB_NAME !== "ADMIN"
        ) {
          Swal.fire(
            "Thông báo",
            "Nội dung: Bạn không có quyền truy cập: ",
            "error"
          );
        } else {
          return children;
        }
      }
    } else {
      if (user.MAINDEPTNAME !== maindeptname) {
        Swal.fire(
          "Thông báo",
          "Nội dung: Bạn không phải người của bộ phận: " + maindeptname,
          "error"
        );
      } else {
        if (
          jobname === "all" ||
          user.EMPL_NO === "NHU1903" ||
          user.EMPL_NO === "NVH1011" ||
          user.JOB_NAME === "ADMIN"
        ) {
          return children;
        } else {
          if (
            user.JOB_NAME !== "Leader" &&
            user.JOB_NAME !== "Sub Leader" &&
            user.JOB_NAME !== "Dept Staff" &&
            user.JOB_NAME !== "ADMIN"
          ) {
            Swal.fire(
              "Thông báo",
              "Nội dung: Bạn không có quyền truy cập: ",
              "error"
            );
          } else {
            return children;
          }
        }
      }
    }
  }
};
export const requestFullScreen = (
  elementRef: React.MutableRefObject<null>,
  full_screen: number
) => {
  if (elementRef.current && full_screen === 1) {
    const element = elementRef.current as HTMLElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if ("mozRequestFullScreen" in element) {
      // Firefox
      (element as any).mozRequestFullScreen();
    } else if ("webkitRequestFullscreen" in element) {
      // Chrome, Safari and Opera
      (element as any).webkitRequestFullscreen();
    } else if ("msRequestFullscreen" in element) {
      // IE/Edge
      (element as any).msRequestFullscreen();
    }
  }
};

export const f_load_AUDIT_HISTORY_DATA = async (DATA: any) => {
  let kq: AUDIT_HISTORY_DATA[] = [];
  await generalQuery("loadAUDIT_HISTORY_DATA", DATA)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        let loaded_data: AUDIT_HISTORY_DATA[] = response.data.data.map(
          (element: AUDIT_HISTORY_DATA, index: number) => {
            return {
              ...element,
              AUDIT_DATE: moment.utc(element.AUDIT_DATE).format("YYYY-MM-DD"),
              id: index,
            };
          }
        );
        kq = loaded_data;
      } else {
        kq = [];
      }
    })
    .catch((error) => {});
  return kq;
};
export const f_add_AUDIT_HISTORY_DATA = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("add_AUDIT_HISTORY_DATA", DATA)
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
export const f_update_AUDIT_HISTORY_DATA = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("update_AUDIT_HISTORY_DATA", DATA)
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
export const f_delete_AUDIT_HISTORY_DATA = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("delete_AUDIT_HISTORY_DATA", DATA)
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
export const f_updateFileInfo_AUDIT_HISTORY = async (DATA: any) => {
  let kq: string = "";
  await generalQuery("updateFileInfo_AUDIT_HISTORY", DATA)
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

import { ResponsiveContainer } from "recharts";
import Swal from "sweetalert2";
import { generalQuery, getCompany } from "../Api";
import { UserData } from "../GlobalInterface";
import moment from "moment";
import { PRICEWITHMOQ } from "../../pages/kinhdoanh/interfaces/kdInterface";
import TEXT from "../../pages/rnd/design_amazon/design_components/TEXT";
import RECTANGLE from "../../pages/rnd/design_amazon/design_components/RECTANGLE";
import DATAMATRIX from "../../pages/rnd/design_amazon/design_components/DATAMATRIX";
import BARCODE2 from "../../pages/rnd/design_amazon/design_components/BARCODE2";
import IMAGE from "../../pages/rnd/design_amazon/design_components/IMAGE";
import QRCODE from "../../pages/rnd/design_amazon/design_components/QRCODE";
import { COMPONENT_DATA } from "../../pages/rnd/interfaces/rndInterface";

/**
 * General utility functions - extracted from GlobalFunction.tsx
 * Contains: formatting, validation, date, color, encryption, and misc utilities
 */

export const zeroPad = (num: number, places: number) =>
  String(num).padStart(places, "0");

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
      } else {
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return loaded_price;
};

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
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, "");
  str = str.replace(/\u02C6|\u0306|\u031B/g, "");
  str = str.replace(/ + /g, " ");
  str = str.trim();
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\\<|\\>|\?|\/|,|\.|\\:|\\;|\\'|\\"|\\&|\\#|\\[|\\]|~|\\$|_|`|-|{|}|\\||\\\\/g,
    " "
  );
  return str;
}

const _debounceTimers = new Map<string, ReturnType<typeof setTimeout>>();
export function deBounce(func: any, delay: number, key: string = 'default') {
  const existing = _debounceTimers.get(key);
  if (existing) clearTimeout(existing);
  _debounceTimers.set(
    key,
    setTimeout(() => {
      func();
      _debounceTimers.delete(key);
    }, delay)
  );
}

export const COLORS = [
  "#cc0000", "#cc3300", "#cc6600", "#cc9900", "#cccc00",
  "#99cc00", "#66cc00", "#33cc00", "#00cc00", "#00cc33",
  "#00cc66", "#00cc99", "#00cccc", "#0099cc", "#0066cc",
  "#0033cc", "#0000cc", "#3300cc", "#6600cc", "#9900cc",
  "#cc00cc", "#cc0099", "#cc0066", "#cc0033", "#cc0000",
];

export const ERR_TABLE = [
  { ERR_CODE: "ERR1", ERR_NAME_VN: "Loss thêm túi", ERR_NAME_KR: "포장 로스" },
  { ERR_CODE: "ERR2", ERR_NAME_VN: "Loss bóc đầu cuối", ERR_NAME_KR: "초종 파괴 검사 로스" },
  { ERR_CODE: "ERR3", ERR_NAME_VN: "Loss điểm nối", ERR_NAME_KR: "이음애 로스" },
  { ERR_CODE: "ERR4", ERR_NAME_VN: "Dị vật/chấm gel", ERR_NAME_KR: "원단 이물/겔 점" },
  { ERR_CODE: "ERR5", ERR_NAME_VN: "Nhăn VL", ERR_NAME_KR: "원단 주름" },
  { ERR_CODE: "ERR6", ERR_NAME_VN: "Loang bẩn VL", ERR_NAME_KR: "얼룩" },
  { ERR_CODE: "ERR7", ERR_NAME_VN: "Bóng khí VL", ERR_NAME_KR: "원단 기포" },
  { ERR_CODE: "ERR8", ERR_NAME_VN: "Xước VL", ERR_NAME_KR: "원단 스크래치" },
  { ERR_CODE: "ERR9", ERR_NAME_VN: "Chấm lồi lõm VL", ERR_NAME_KR: "원단 눌림" },
  { ERR_CODE: "ERR10", ERR_NAME_VN: "Keo VL", ERR_NAME_KR: "원단 찐" },
  { ERR_CODE: "ERR11", ERR_NAME_VN: "Lông PE VL", ERR_NAME_KR: "원단 버 (털 모양)" },
  { ERR_CODE: "ERR12", ERR_NAME_VN: "Lỗi IN (Dây mực)", ERR_NAME_KR: "잉크 튐" },
  { ERR_CODE: "ERR13", ERR_NAME_VN: "Lỗi IN (Mất nét)", ERR_NAME_KR: "글자 유실" },
  { ERR_CODE: "ERR14", ERR_NAME_VN: "Lỗi IN (Lỗi màu)", ERR_NAME_KR: "색상 불량" },
  { ERR_CODE: "ERR15", ERR_NAME_VN: "Lỗi IN (Chấm đường khử keo)", ERR_NAME_KR: "점착 제거 선 점 불량" },
  { ERR_CODE: "ERR16", ERR_NAME_VN: "DIECUT (Lệch/Viền màu)", ERR_NAME_KR: "타발 편심" },
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
  { ERR_CODE: "ERR31", ERR_NAME_VN: "Lấp lỗ sensor", ERR_NAME_KR: "센서 홀 막힘" },
  { ERR_CODE: "ERR32", ERR_NAME_VN: "Marking SX", ERR_NAME_KR: "생산 마킹 구간 썩임" },
  { ERR_CODE: "ERR33", ERR_NAME_VN: "Cong Vinyl", ERR_NAME_KR: "비닐 컬" },
  { ERR_CODE: "ERR34", ERR_NAME_VN: "Mixing", ERR_NAME_KR: "혼입" },
  { ERR_CODE: "ERR35", ERR_NAME_VN: "Sai thiết kế", ERR_NAME_KR: "설계 불량" },
  { ERR_CODE: "ERR36", ERR_NAME_VN: "Sai vật liệu", ERR_NAME_KR: "원단 잘 못 사용" },
  { ERR_CODE: "ERR37", ERR_NAME_VN: "NG kích thước", ERR_NAME_KR: "치수 불량" },
];

export function dynamicSort(property: string) {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substring(1);
  }
  return function (a: any, b: any) {
    var result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
}

export const isValidInput = (input: string) => {
  const regex = /^[a-zA-Z0-9_]*$/;
  return regex.test(input);
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
      return <BARCODE2 key={index} DATA={ele} />;
    } else if (ele.PHANLOAI_DT === "IMAGE") {
      return <IMAGE key={index} DATA={ele} />;
    } else if (ele.PHANLOAI_DT === "QRCODE") {
      return <QRCODE key={index} DATA={ele} />;
    }
  });
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
  const startOfMonth = moment(date).startOf("month");
  const endOfMonth = moment(date).endOf("month");
  let workingDays = 0;
  for (let day = startOfMonth; day <= endOfMonth; day.add(1, "days")) {
    if (day.isoWeekday() <= 5) {
      workingDays++;
    }
  }
  return workingDays;
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
      (element as any).mozRequestFullScreen();
    } else if ("webkitRequestFullscreen" in element) {
      (element as any).webkitRequestFullscreen();
    } else if ("msRequestFullscreen" in element) {
      (element as any).msRequestFullscreen();
    }
  }
};

function hexToRgb(hex: string) {
  hex = hex.replace('#', '');
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

function rgbToHex(r: number, g: number, b: number) {
  return (
    '#' +
    [r, g, b]
      .map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
  );
}

export function generateMultiGradientColors(colorArr: string[], steps: number): string[] {
  if (colorArr.length < 2 || steps < 1) return [];
  const colors: string[] = [];
  const segments = colorArr.length - 1;
  if (steps <= colorArr.length) {
    return colorArr.slice(0, steps);
  }
  const stepsPerSegment = Math.max(1, Math.floor(steps / segments));
  let remainder = steps - stepsPerSegment * segments;
  for (let s = 0; s < segments; s++) {
    const start = hexToRgb(colorArr[s]);
    const end = hexToRgb(colorArr[s + 1]);
    const segSteps = stepsPerSegment + (remainder-- > 0 ? 1 : 0);
    for (let i = 0; i < segSteps; i++) {
      const ratio = segSteps > 1 ? i / (segSteps - 1) : 0;
      const r = Math.round(start.r + (end.r - start.r) * ratio);
      const g = Math.round(start.g + (end.g - start.g) * ratio);
      const b = Math.round(start.b + (end.b - start.b) * ratio);
      colors.push(rgbToHex(r, g, b));
    }
  }
  return colors.slice(0, steps);
}

export function minutesSince(upd_time: string): number {
  const now = moment().utcOffset(7 * 60);
  const upd = moment(upd_time);
  let diff = now.diff(upd, "minutes");
  return diff;
}

export async function encryptData(
  publicKey: string,
  data: object
): Promise<{ encryptedData: string; encryptedKey: string; iv: string }> {
  try {
    if (!window.isSecureContext || !window.crypto || !window.crypto.subtle) {
      Swal.fire("Thống báo", "Crypto API is not available. Please use HTTPS or localhost.", "error");
      throw new Error(
        'Crypto API is not available. Please use HTTPS or localhost.'
      );
    }
    const dataString = JSON.stringify(data);
    const aesKey = await crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedData = new TextEncoder().encode(dataString);
    const encryptedData = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      aesKey,
      encodedData
    );
    const exportedKey = await crypto.subtle.exportKey("raw", aesKey);
    const publicKeyBuffer = pemToArrayBuffer(publicKey);
    const importedKey = await crypto.subtle.importKey(
      "spki",
      publicKeyBuffer,
      { name: "RSA-OAEP", hash: "SHA-256" },
      false,
      ["encrypt"]
    );
    const encryptedKey = await crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      importedKey,
      exportedKey
    );
    return {
      encryptedData: arrayBufferToBase64(encryptedData),
      encryptedKey: arrayBufferToBase64(encryptedKey),
      iv: arrayBufferToBase64(iv),
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Encryption error:", error);
    throw new Error(`Failed to encrypt data: ${errorMessage}`);
  }
}

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

function arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

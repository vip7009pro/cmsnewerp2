import moment from "moment";
import { weekdayarray } from "../../../../api/services/utilService";
import { BANGCHAMCONG_DATA2, IN_OUT_DATA3 } from "../../interfaces/nhansuInterface";
import { calcMinutesByRate } from "../OverTimeUtils3";

/**
 * Thuật toán dự đoán giờ vào / giờ ra dựa trên lịch sử quẹt thẻ và ca làm việc
 */
export const tinhInOutTime3 = (IO_DATA: IN_OUT_DATA3) => {
  let result = {
    IN_TIME: "",
    OUT_TIME: "",
  };
  const tgv: string = "Thiếu giờ vào";
  const tgr: string = "Thiếu giờ ra";

  const check0_array: number[] = [
    IO_DATA.PREV_CHECK1 !== "" ? moment(IO_DATA.PREV_CHECK1, "HH:mm").valueOf() : 0,
    IO_DATA.PREV_CHECK2 !== "" ? moment(IO_DATA.PREV_CHECK2, "HH:mm").valueOf() : 0,
    IO_DATA.PREV_CHECK3 !== "" ? moment(IO_DATA.PREV_CHECK3, "HH:mm").valueOf() : 0,
  ];
  const check1_array: number[] = [
    IO_DATA.CHECK1 !== "" ? moment(IO_DATA.CHECK1, "HH:mm").valueOf() : 0,
    IO_DATA.CHECK2 !== "" ? moment(IO_DATA.CHECK2, "HH:mm").valueOf() : 0,
    IO_DATA.CHECK3 !== "" ? moment(IO_DATA.CHECK3, "HH:mm").valueOf() : 0,
  ];
  const check2_array: number[] = [
    IO_DATA.NEXT_CHECK1 !== "" ? moment(IO_DATA.NEXT_CHECK1, "HH:mm").valueOf() : 0,
    IO_DATA.NEXT_CHECK2 !== "" ? moment(IO_DATA.NEXT_CHECK2, "HH:mm").valueOf() : 0,
    IO_DATA.NEXT_CHECK3 !== "" ? moment(IO_DATA.NEXT_CHECK3, "HH:mm").valueOf() : 0,
  ];

  const check0_nozero: number[] = check0_array.filter((ele: number) => ele !== 0);
  const check1_nozero: number[] = check1_array.filter((ele: number) => ele !== 0);
  const check2_nozero: number[] = check2_array.filter((ele: number) => ele !== 0);

  const mincheck1: number = Math.min.apply(Math, check1_nozero);
  const maxcheck1: number = Math.max.apply(Math, check1_nozero);
  const mincheck2: number = Math.min.apply(Math, check2_nozero);
  const minAllCheck1: number = Math.min.apply(Math, check1_nozero);
  const maxAllCheck1: number = Math.max.apply(Math, check1_nozero);

  if (IO_DATA.CALV === 1 || IO_DATA.CALV === 2) {
    const in_start1: number = moment("05:30", "HH:mm").valueOf();
    const in_end1: number = moment("08:00", "HH:mm").valueOf();

    switch (IO_DATA.CALV) {
      case 1: {
        let temp1_intime = check1_nozero.length > 0 ? moment(mincheck1).format("HH:mm") : tgv;
        let temp1_outtime = check1_nozero.length > 0 ? moment(maxcheck1).format("HH:mm") : tgr;
        let checkthieu: string = "NA";
        if (mincheck1 >= in_start1 && mincheck1 <= in_end1) {
          checkthieu = tgr;
        }
        if (mincheck1 === maxcheck1) {
          result = {
            IN_TIME: checkthieu === tgr ? temp1_intime : tgv,
            OUT_TIME: checkthieu !== tgr ? temp1_outtime : tgr,
          };
        } else {
          result = {
            IN_TIME: temp1_intime,
            OUT_TIME: temp1_outtime,
          };
        }
        break;
      }
      case 2: {
        let temp1_intime2 = check1_nozero.length > 0 ? moment(maxcheck1).format("HH:mm") : tgv;
        let temp1_outtime2 = check2_nozero.length > 0 ? moment(mincheck2).format("HH:mm") : tgr;
        result = {
          IN_TIME: temp1_intime2,
          OUT_TIME: temp1_outtime2,
        };
        break;
      }
      default: {
        let temp_intime = check1_nozero.length > 0 ? moment(minAllCheck1).format("HH:mm") : tgv;
        let temp_outtime = check1_nozero.length > 0 ? moment(maxAllCheck1).format("HH:mm") : tgr;
        result = {
          IN_TIME: temp_intime === temp_outtime ? temp_intime : tgv,
          OUT_TIME: temp_intime === temp_outtime ? tgr : temp_outtime,
        };
        break;
      }
    }
  } else {
    // Ca hành chính
    const in_start: number = moment("07:00", "HH:mm").valueOf();
    const in_end: number = moment("08:00", "HH:mm").valueOf();

    let temp_intime = check1_nozero.length > 0 ? moment(mincheck1).format("HH:mm") : tgv;
    let temp_outtime = check1_nozero.length > 0 ? moment(maxcheck1).format("HH:mm") : tgr;
    let checkthieu: string = "NA";
    if (mincheck1 >= in_start && mincheck1 <= in_end) {
      checkthieu = tgr;
    }
    if (mincheck1 === maxcheck1) {
      result = {
        IN_TIME: checkthieu === tgr ? temp_intime : tgv,
        OUT_TIME: checkthieu !== tgr ? temp_outtime : tgr,
      };
    } else {
      result = {
        IN_TIME: temp_intime,
        OUT_TIME: temp_outtime,
      };
    }
  }
  return result;
};

/**
 * Format dữ liệu chấm công từ API loadC0012
 */
export const formatChamCongRawData = (rawData: BANGCHAMCONG_DATA2[]): any[] => {
  return rawData.map((element: BANGCHAMCONG_DATA2, index: number) => {
    const inoutdata = tinhInOutTime3({
      CALV: element.CALV,
      CHECK1: element.CHECK1 !== null ? moment.utc(element.CHECK1).format("HH:mm") : "",
      CHECK2: element.CHECK2 !== null ? moment.utc(element.CHECK2).format("HH:mm") : "",
      CHECK3: element.CHECK3 !== null ? moment.utc(element.CHECK3).format("HH:mm") : "",
      PREV_CHECK1: element.PREV_CHECK1 !== null ? moment.utc(element.PREV_CHECK1).format("HH:mm") : "",
      PREV_CHECK2: element.PREV_CHECK2 !== null ? moment.utc(element.PREV_CHECK2).format("HH:mm") : "",
      PREV_CHECK3: element.PREV_CHECK3 !== null ? moment.utc(element.PREV_CHECK3).format("HH:mm") : "",
      NEXT_CHECK1: element.NEXT_CHECK1 !== null ? moment.utc(element.NEXT_CHECK1).format("HH:mm") : "",
      NEXT_CHECK2: element.NEXT_CHECK2 !== null ? moment.utc(element.NEXT_CHECK2).format("HH:mm") : "",
      NEXT_CHECK3: element.NEXT_CHECK3 !== null ? moment.utc(element.NEXT_CHECK3).format("HH:mm") : "",
    });

    const ratetb = calcMinutesByRate(
      element.FIXED_IN_TIME,
      element.FIXED_OUT_TIME,
      moment(element.DATE_COLUMN).format("YYYY-MM-DD")
    );

    return {
      ...element,
      WEEKDAY: weekdayarray[new Date(element.DATE_COLUMN).getDay()],
      FULL_NAME: element.MIDLAST_NAME + " " + element.FIRST_NAME,
      DATE_COLUMN: element.DATE_COLUMN ? String(element.DATE_COLUMN).substring(0, 10) : "",
      CALV:
        element.CALV === 0
          ? "Hành Chính"
          : element.CALV === 1
          ? "Ca Ngày"
          : element.CALV === 2
          ? "Ca Đêm"
          : "Không có ca",
      L100:
        element.REASON_NAME === "Phép năm"
          ? 480
          : element.REASON_NAME === "Nửa phép"
          ? 240 + ratetb["100%"]
          : ratetb["100%"],
      L130: ratetb["130%"],
      L150: ratetb["150%"],
      L200: ratetb["200%"],
      L210: ratetb["210%"],
      L270: ratetb["270%"],
      L300: ratetb["300%"],
      L390: ratetb["390%"],
      APPLY_DATE:
        element.APPLY_DATE !== null
          ? moment.utc(element.APPLY_DATE).format("YYYY-MM-DD")
          : "",
      CHECK1:
        element.CHECK1 !== null ? moment.utc(element.CHECK1).format("HH:mm:ss") : "",
      CHECK2:
        element.CHECK2 !== null ? moment.utc(element.CHECK2).format("HH:mm:ss") : "",
      CHECK3:
        element.CHECK3 !== null ? moment.utc(element.CHECK3).format("HH:mm:ss") : "",
      PREV_CHECK1:
        element.PREV_CHECK1 !== null
          ? moment.utc(element.PREV_CHECK1).format("HH:mm:ss")
          : "",
      PREV_CHECK2:
        element.PREV_CHECK2 !== null
          ? moment.utc(element.PREV_CHECK2).format("HH:mm:ss")
          : "",
      PREV_CHECK3:
        element.PREV_CHECK3 !== null
          ? moment.utc(element.PREV_CHECK3).format("HH:mm:ss")
          : "",
      NEXT_CHECK1:
        element.NEXT_CHECK1 !== null
          ? moment.utc(element.NEXT_CHECK1).format("HH:mm:ss")
          : "",
      NEXT_CHECK2:
        element.NEXT_CHECK2 !== null
          ? moment.utc(element.NEXT_CHECK2).format("HH:mm:ss")
          : "",
      NEXT_CHECK3:
        element.NEXT_CHECK3 !== null
          ? moment.utc(element.NEXT_CHECK3).format("HH:mm:ss")
          : "",
      IN_TIME: inoutdata.IN_TIME,
      OUT_TIME: inoutdata.OUT_TIME,
      FIXED_IN_TIME: element.FIXED_IN_TIME ?? "X",
      FIXED_OUT_TIME: element.FIXED_OUT_TIME ?? "X",
      STATUS:
        inoutdata.IN_TIME === "Thiếu giờ vào" || inoutdata.OUT_TIME === "Thiếu giờ ra"
          ? "Thiếu công"
          : "Đủ công",
      id: index,
    };
  });
};

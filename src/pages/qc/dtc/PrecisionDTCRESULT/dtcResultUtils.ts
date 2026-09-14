import Swal from "sweetalert2";
import { generalQuery } from "../../../../api/Api";

export interface DTC_RESULT_INPUT {
  DTC_ID: number;
  G_CODE: string;
  G_NAME: string;
  M_CODE: string;
  M_NAME: string;
  TEST_NAME: string;
  TEST_CODE: number;
  POINT_NAME: string;
  POINT_CODE: number;
  CENTER_VALUE: number;
  SAMPLE_NO: number;
  UPPER_TOR: number;
  LOWER_TOR: number;
  RESULT: number;
  REMARK: string;
  id: number;
}

export interface InputData {
  DTC_ID: number;
  Br: string | number;
  Pb: string | number;
  Hg: string | number;
  Cd: string | number;
  AS: string | number;
  Cr: string | number;
  Sb: string | number;
  Sn: string | number;
  S: string | number;
  Cl: string | number;
  P: string | number;
  REMARK: string;
}

export interface OutputData {
  id: number;
  DTC_ID: number;
  TEST_CODE: number;
  TEST_NAME: string;
  G_CODE: string;
  G_NAME: string;
  M_CODE: string;
  M_NAME: string;
  POINT_CODE: number;
  POINT_NAME: string;
  SAMPLE_NO: number;
  CENTER_VALUE: number;
  UPPER_TOR: number;
  LOWER_TOR: number;
  RESULT: number;
  REMARK: string;
}

export const handletraDTCData_HangLoat = async (
  dtc_id: string,
  test_code: string
): Promise<DTC_RESULT_INPUT[]> => {
  let kq: DTC_RESULT_INPUT[] = [];
  try {
    const response = await generalQuery("getinputdtcspec", {
      DTC_ID: dtc_id,
      TEST_CODE: test_code,
    });
    if (response.data.tk_status !== "NG" && Array.isArray(response.data.data)) {
      kq = response.data.data.map((element: DTC_RESULT_INPUT, index: number) => ({
        ...element,
        id: index,
      }));
    }
  } catch (error) {
    console.error("Error in handletraDTCData_HangLoat:", error);
  }
  return kq;
};

export const unpivotJsonArray = async (
  uphangloat: boolean,
  DTC_ID: number,
  TEST_CODE: number,
  G_CODE: string,
  G_NAME: string,
  M_CODE: string,
  M_NAME: string,
  TEST_NAME: string,
  defaultResultArray: DTC_RESULT_INPUT[],
  inputArray: InputData[]
): Promise<DTC_RESULT_INPUT[]> => {
  const result: DTC_RESULT_INPUT[] = [];
  let sampleNo = 1;
  let preDTC_ID = 0;
  let err_code = "";

  for (let i = 0; i < inputArray.length; i++) {
    let temp_data: DTC_RESULT_INPUT[] = [];
    let pointCodeCounter = 1;

    if (uphangloat) {
      temp_data = await handletraDTCData_HangLoat(inputArray[i].DTC_ID.toString(), "3");
      if (temp_data.length <= 0) {
        err_code += `Lỗi: ID: ${inputArray[i].DTC_ID} không tìm thấy spec\n<br/>`;
        continue;
      }
    }

    if (uphangloat && preDTC_ID !== 0 && temp_data[0]?.DTC_ID === preDTC_ID) {
      sampleNo++;
    } else {
      sampleNo = 1;
    }
    if (uphangloat && temp_data.length > 0) {
      preDTC_ID = temp_data[0].DTC_ID;
    }

    const currentSource = uphangloat ? temp_data : defaultResultArray;

    Object.entries(inputArray[i]).forEach(([key, value]) => {
      if (key === "REMARK" || key === "DTC_ID") return;
      const resultValue = value === "ND" ? 0 : Number(value);

      const foundIndex = currentSource.findIndex(
        (element: DTC_RESULT_INPUT) =>
          element.POINT_NAME?.substring(0, element.POINT_NAME.length - 1) === key ||
          element.POINT_NAME === key
      );

      if (foundIndex < 0 && uphangloat) {
        err_code += `Lỗi: ID: ${inputArray[i].DTC_ID} không tìm thấy spec ${key}\n<br/>`;
        return;
      }

      const refElement = foundIndex >= 0 ? currentSource[foundIndex] : null;

      result.push({
        id: result.length,
        DTC_ID: uphangloat ? Number(inputArray[i].DTC_ID) : DTC_ID,
        TEST_CODE: uphangloat ? Number(temp_data[0]?.TEST_CODE || 3) : TEST_CODE,
        TEST_NAME: uphangloat ? temp_data[0]?.TEST_NAME || "XRF" : TEST_NAME,
        G_CODE: uphangloat ? temp_data[0]?.G_CODE || "" : G_CODE,
        G_NAME: uphangloat ? temp_data[0]?.G_NAME || "" : G_NAME,
        M_CODE: uphangloat ? temp_data[0]?.M_CODE || "" : M_CODE,
        M_NAME: uphangloat ? temp_data[0]?.M_NAME || "" : M_NAME,
        POINT_CODE: pointCodeCounter,
        POINT_NAME: key,
        SAMPLE_NO: sampleNo,
        RESULT: resultValue,
        CENTER_VALUE: refElement ? Number(refElement.CENTER_VALUE) : 0,
        UPPER_TOR: refElement ? Number(refElement.UPPER_TOR) : 0,
        LOWER_TOR: refElement ? Number(refElement.LOWER_TOR) : 0,
        REMARK: inputArray[i].REMARK || "",
      });
      pointCodeCounter++;
    });
  }

  if (err_code !== "") {
    Swal.fire("Lỗi tải dữ liệu", err_code, "error");
    return [];
  }

  return result;
};

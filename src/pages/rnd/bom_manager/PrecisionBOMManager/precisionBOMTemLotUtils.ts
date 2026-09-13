import moment from "moment";
import { zeroPad } from "../../../../api/services/utilService";
import { CODE_FULL_INFO, COMPONENT_DATA } from "../../interfaces/rndInterface";
import { CustomerListData } from "../../../kinhdoanh/interfaces/kdInterface";

// Template tem mặc định từ bản gốc
export const DEFAULT_AMAZON_TEMPLATE: COMPONENT_DATA[] = [
  {
    G_CODE_MAU: "123456",
    DOITUONG_NO: 5,
    DOITUONG_NAME: "Rectangle",
    PHANLOAI_DT: "CONTAINER",
    DOITUONG_STT: "A6",
    CAVITY_PRINT: 2,
    GIATRI: "AZ:4Z99ADOEBRABHKDMAG5UZUWF5Y",
    FONT_NAME: "Arial",
    FONT_SIZE: 6,
    FONT_STYLE: "B",
    POS_X: 0,
    POS_Y: 0,
    SIZE_W: 23,
    SIZE_H: 28.6,
    ROTATE: 0,
    REMARK: "remark",
  },
  {
    G_CODE_MAU: "123456",
    DOITUONG_NO: 0,
    DOITUONG_NAME: "Code name",
    PHANLOAI_DT: "TEXT",
    DOITUONG_STT: "A0",
    CAVITY_PRINT: 2,
    GIATRI: "GH68-54619A",
    FONT_NAME: "Arial",
    FONT_SIZE: 6,
    FONT_STYLE: "B",
    POS_X: 2.26,
    POS_Y: 20.53,
    SIZE_W: 2.08,
    SIZE_H: 2.08,
    ROTATE: 0,
    REMARK: "remark",
  },
  {
    G_CODE_MAU: "123456",
    DOITUONG_NO: 1,
    DOITUONG_NAME: "Model",
    PHANLOAI_DT: "TEXT",
    DOITUONG_STT: "A1",
    CAVITY_PRINT: 2,
    GIATRI: "SM-R910NZAAXJP",
    FONT_NAME: "Arial",
    FONT_SIZE: 6,
    FONT_STYLE: "B",
    POS_X: 2.26,
    POS_Y: 15.36,
    SIZE_W: 2.08,
    SIZE_H: 2.08,
    ROTATE: 0,
    REMARK: "remark",
  },
  {
    G_CODE_MAU: "123456",
    DOITUONG_NO: 1,
    DOITUONG_NAME: "EAN No 1",
    PHANLOAI_DT: "TEXT",
    DOITUONG_STT: "A2",
    CAVITY_PRINT: 2,
    GIATRI: "4986773220257",
    FONT_NAME: "Arial",
    FONT_SIZE: 6,
    FONT_STYLE: "B",
    POS_X: 2.26,
    POS_Y: 17.97,
    SIZE_W: 2.08,
    SIZE_H: 2.08,
    ROTATE: 0,
    REMARK: "remark",
  },
  {
    G_CODE_MAU: "123456",
    DOITUONG_NO: 4,
    DOITUONG_NAME: "Logo AMZ 1",
    PHANLOAI_DT: "IMAGE",
    DOITUONG_STT: "A3",
    CAVITY_PRINT: 2,
    GIATRI: "https://cmsvina4285.com/images/logoAMAZON.png",
    FONT_NAME: "Arial",
    FONT_SIZE: 6,
    FONT_STYLE: "B",
    POS_X: 2.28,
    POS_Y: 2.58,
    SIZE_W: 7.11,
    SIZE_H: 7,
    ROTATE: 0,
    REMARK: "remark",
  },
  {
    G_CODE_MAU: "123456",
    DOITUONG_NO: 5,
    DOITUONG_NAME: "Barcode 1",
    PHANLOAI_DT: "1D BARCODE",
    DOITUONG_STT: "A4",
    CAVITY_PRINT: 2,
    GIATRI: "GH68-55104A",
    FONT_NAME: "Arial",
    FONT_SIZE: 6,
    FONT_STYLE: "B",
    POS_X: 1.97,
    POS_Y: 23.57,
    SIZE_W: 19.05,
    SIZE_H: 3.55,
    ROTATE: 0,
    REMARK: "remark",
  },
  {
    G_CODE_MAU: "123456",
    DOITUONG_NO: 5,
    DOITUONG_NAME: "Matrix 1",
    PHANLOAI_DT: "2D MATRIX",
    DOITUONG_STT: "A5",
    CAVITY_PRINT: 2,
    GIATRI: "AZ:4Z99ADOEBRABHKDMAG5UZUWF5Y",
    FONT_NAME: "Arial",
    FONT_SIZE: 6,
    FONT_STYLE: "B",
    POS_X: 12,
    POS_Y: 2,
    SIZE_W: 9,
    SIZE_H: 9,
    ROTATE: 0,
    REMARK: "remark",
  },
];

/**
 * Ánh xạ dữ liệu sản phẩm đang chọn (codeInfo) vào template tem LOT
 * Bảo toàn 100% logic từ BOM_MANAGER.backup.tsx (dòng 1278 - 1380)
 */
export const mapComponentListWithCodeInfo = (
  rawTemplate: COMPONENT_DATA[],
  codeInfo: CODE_FULL_INFO,
  customerList?: CustomerListData[],
  emplNo?: string
): COMPONENT_DATA[] => {
  if (!rawTemplate || rawTemplate.length === 0) return [];
  if (!codeInfo || !codeInfo.G_CODE || codeInfo.G_CODE === "-------") {
    return rawTemplate;
  }

  // Tìm tên khách hàng thông minh
  let custName = codeInfo.CUST_NAME || "";
  if (!custName && customerList && customerList.length > 0 && codeInfo.CUST_CD) {
    const matchedCust = customerList.find(
      (c) => c.CUST_CD?.trim().toUpperCase() === codeInfo.CUST_CD?.trim().toUpperCase()
    );
    if (matchedCust) {
      custName = matchedCust.CUST_NAME_KD || matchedCust.CUST_CD;
    }
  }
  if (!custName) custName = codeInfo.CUST_CD || "";

  const partNo = codeInfo.G_NAME || codeInfo.G_NAME_KD || "";
  const codeKD = codeInfo.G_NAME_KD || codeInfo.G_NAME || codeInfo.G_CODE || "";
  const gCode = codeInfo.G_CODE || "";
  const model = codeInfo.PROD_MODEL || codeInfo.PROD_PROJECT || "";
  const descr = codeInfo.DESCR || "";
  const poType = codeInfo.PO_TYPE || "";
  const roleQty = codeInfo.ROLE_EA_QTY ?? 0;
  const width = codeInfo.G_WIDTH ?? 0;
  const length = codeInfo.G_LENGTH ?? 0;
  const expMonths = codeInfo.EXP_DATE && Number(codeInfo.EXP_DATE) > 0 ? Number(codeInfo.EXP_DATE) : 12;
  const expDays = expMonths * 30;
  const currentEmpl = emplNo || "ADMIN";

  return rawTemplate.map((e: COMPONENT_DATA, idx: number) => {
    let value = e.GIATRI;
    const name = (e.DOITUONG_NAME || "").toUpperCase().trim();
    const stt = (e.DOITUONG_STT || "").toUpperCase().trim();

    // 1. Ánh xạ các trường theo chuẩn Amazon Design (đối chiếu 100% bản gốc BOM_MANAGER.backup.tsx)
    if (name === "CUSTOMER") {
      value = custName;
    } else if (name === "LONGBARCODE") {
      const gNamePrefix = partNo.substring(0, 11);
      const dateStr = moment.utc().format("YYMMDD");
      const formattedQty = zeroPad(roleQty, 6);
      value = `${gNamePrefix}DTA3${poType}${dateStr}-001${formattedQty}`;
    } else if (name === "PARTNO VALUE") {
      // Chỉ gán giá trị cho PARTNO VALUE (giữ nguyên nhãn tĩnh "PARTNO" là "Part No:")
      value = partNo;
    } else if (name === "SPECIFICATION") {
      value = `Specification:${descr}`;
    } else if (name === "PO TYPE") {
      value = `PO Type:${poType}`;
    } else if (name === "LOTNO") {
      value = `Lot No:${moment.utc().format("YYMMDD")}-001|${currentEmpl}`;
    } else if (name === "QTY BIG" || name === "QTY") {
      value = roleQty.toString();
    } else if (name === "VENDOR PN") {
      value = `Vendor P/N:${gCode}`;
    } else if (name === "SIZE") {
      value = `Size:${width}*${length}`;
    } else if (name === "MFT") {
      value = `MFT:${moment.utc().format("YYYY-MM-DD")}`;
    } else if (name === "EXP") {
      value = `EXP:${moment.utc().add(expDays, "day").format("YYYY-MM-DD")}`;
    } else if (name === "REQUESTINFO") {
      value = `CMSvina/NM1/3HU0020/${roleQty}EA`;
    } else if (name === "PARTNO2") {
      value = partNo;
    } else if (name === "MFTEXP") {
      value = `MFT: ${moment.utc().format("YYYY-MM-DD")} EXP: ${moment
        .utc()
        .add(expDays, "day")
        .format("YYYY-MM-DD")}`;
    } else if (name === "LOTINFO") {
      value = `${currentEmpl}/SP3HU001/SAMPLEWEB`;
    }

    // 2. Ánh xạ cho template mini (nhãn 23x28.6mm) - Tuyệt đối không dựa vào STT để tránh xung đột với template lớn
    else if (name === "CODE NAME") {
      value = codeKD;
    } else if (name === "MODEL") {
      value = model;
    } else if (name === "BARCODE 1") {
      value = codeKD;
    } else if (name === "MATRIX 1") {
      value = codeKD;
    }

    return {
      ...e,
      id: e.id ?? idx,
      GIATRI: value,
    };
  });
};

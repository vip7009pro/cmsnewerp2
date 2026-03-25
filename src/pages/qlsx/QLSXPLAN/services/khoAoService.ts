import moment from "moment";
import { generalQuery } from "../../../../api/Api";
import {
  LICHSUNHAPKHOAO,
  LICHSUXUATKHOAO,
  TONLIEUXUONG,
} from "../interfaces/khsxInterface";

const loadNhapKhoAo = async (filterData: any) => {
  let kq: LICHSUNHAPKHOAO[] = [];
  await generalQuery("lichsunhapkhoao", filterData)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        const loadeddata = response.data.data.map(
          (element: LICHSUNHAPKHOAO, index: number) => {
            return {
              ...element,
              INS_DATE: moment.utc(element.INS_DATE).format("YYYY-MM-DD HH:mm:ss"),
              id: index,
            };
          }
        );
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

const loadXuatKhoAo = async (filterData: any) => {
  let kq: LICHSUXUATKHOAO[] = [];
  await generalQuery("lichsuxuatkhoao", filterData)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        const loadeddata = response.data.data.map(
          (element: LICHSUXUATKHOAO, index: number) => {
            return {
              ...element,
              INS_DATE: moment.utc(element.INS_DATE).format("YYYY-MM-DD HH:mm:ss"),
              id: index,
            };
          }
        );
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

const loadTonKhoAo = async (filterData: any) => {
  let kq: TONLIEUXUONG[] = [];
  await generalQuery("checktonlieutrongxuong", filterData)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        const loadeddata = response.data.data.map(
          (element: TONLIEUXUONG, index: number) => {
            return {
              ...element,
              INS_DATE: moment.utc(element.INS_DATE).format("YYYY-MM-DD HH:mm:ss"),
              id: index,
            };
          }
        );
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

const checkTonTaiMlotPlanIdSuDung = async (NEXT_PLAN: string, M_LOT_NO: string) => {
  let checkTonTai: boolean = false;
  await generalQuery("checkTonTaiXuatKhoAo", {
    PLAN_ID: NEXT_PLAN,
    M_LOT_NO: M_LOT_NO,
  })
    .then((response) => {
      console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        if (response.data.data.length > 0) {
          checkTonTai = false;
        }
      } else {
        checkTonTai = true;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return checkTonTai;
};

const checkNextPlanFSC = async (NEXT_PLAN: string) => {
  let checkFSC: string = "N";
  let checkFSC_CODE = "01";
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

const isExistMLotNoQtyP500 = async (M_LOT_NO: string, INPUT_QTY: number) => {
  let checkP500: boolean = false;
  await generalQuery("checkM_LOT_NO_QTY_P500", {
    M_LOT_NO: M_LOT_NO,
    INPUT_QTY: INPUT_QTY,
  })
    .then((response) => {
      console.log(response.data.data);
      if (response.data.tk_status !== "NG") {
        if (response.data.data.length > 0) {
          checkP500 = true;
        }
      } else {
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return checkP500;
};

const checkNhapKhoTPDuHayChua = async (NEXT_PLAN: string) => {
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

const isNextPlanClosed = async (NEXT_PLAN: string) => {
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

const checkMlotTonKhoAo = async (M_LOT_NO: string) => {
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

const isMCodeChiThi = async (PLAN_ID: string, M_CODE: string) => {
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

const setYNKhoAoInput = async (DATA: any) => {
  let kq: string = "";
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
    PLAN_ID_SUDUNG_TEST: DATA.PLAN_ID_SUDUNG_TEST,
    USE_YN_TEST: DATA.USE_YN_TEST,
  })
    .then((response) => {
      console.log(response.data);
      if (response.data.tk_status !== "NG") {
      } else {
        kq = response.data.message;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return kq;
};

const xuatKhoAo = async (DATA: any) => {
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

const hideRacKhoAo = async (listRac: TONLIEUXUONG[]) => {
  if (listRac.length === 0) {
    return "NO_SELECTION";
  }
  let err_code: string = "0";
  for (let i = 0; i < listRac.length; i++) {
    await generalQuery("an_lieu_kho_ao", {
      IN_KHO_ID: listRac[i].IN_KHO_ID,
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
  return err_code;
};

const is2MCodeInKhoAo = async (PLAN_ID_INPUT: string) => {
  let check_2_m_code_in_kho_ao: boolean = false;
  await generalQuery("check_2_m_code_in_kho_ao", {
    PLAN_ID_INPUT: PLAN_ID_INPUT,
  })
    .then((response) => {
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

const isMLotNoInP500 = async (PLAN_ID_INPUT: string, M_LOT_NO: string) => {
  let check_m_lot_exist_p500: boolean = false;
  await generalQuery("check_m_lot_exist_p500", {
    PLAN_ID_INPUT: PLAN_ID_INPUT,
    M_LOT_NO: M_LOT_NO,
  })
    .then((response) => {
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

const deleteInKhoAo = async (IN_KHO_ID: number) => {
  await generalQuery("delete_in_kho_ao", {
    IN_KHO_ID: IN_KHO_ID,
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

const deleteOutKhoAo = async (PLAN_ID_INPUT: string, M_LOT_NO: string) => {
  await generalQuery("delete_out_kho_ao", {
    PLAN_ID_INPUT: PLAN_ID_INPUT,
    M_LOT_NO: M_LOT_NO,
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

const checkPLAN_ID = async (PLAN_ID: string) => {
  let kq: any = [];
  await generalQuery("checkPLAN_ID", { PLAN_ID: PLAN_ID })
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        kq = response.data.data;
      } else {
        kq = [];
      }
    })
    .catch((error) => {});
  return kq;
};

const nhapKhoAo = async (DATA: any) => {
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

/* ── kho sub functions (migrated from khsxUtils) ── */

const loadNhapKhoSub = async (filterData: any) => {
  let kq: LICHSUNHAPKHOAO[] = [];
  await generalQuery("lichsunhapkhosub", filterData)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        const loadeddata = response.data.data.map(
          (element: LICHSUNHAPKHOAO, index: number) => {
            return {
              ...element,
              INS_DATE: moment.utc(element.INS_DATE).format("YYYY-MM-DD HH:mm:ss"),
              id: index,
            };
          }
        );
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

const loadTonKhoSub = async (filterData: any) => {
  let kq: TONLIEUXUONG[] = [];
  await generalQuery("checktonlieutrongxuong_sub", filterData)
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        const loadeddata = response.data.data.map(
          (element: TONLIEUXUONG, index: number) => {
            return {
              ...element,
              INS_DATE: moment.utc(element.INS_DATE).format("YYYY-MM-DD HH:mm:ss"),
              id: index,
            };
          }
        );
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

const checkMlotTonKhoSub = async (M_LOT_NO: string) => {
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

const setYNKhoSubInput = async (DATA: any) => {
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

export const khoAoService = {
  loadNhapKhoAo,
  loadXuatKhoAo,
  loadTonKhoAo,
  checkTonTaiMlotPlanIdSuDung,
  checkNextPlanFSC,
  isExistMLotNoQtyP500,
  checkNhapKhoTPDuHayChua,
  isNextPlanClosed,
  checkMlotTonKhoAo,
  isMCodeChiThi,
  setYNKhoAoInput,
  xuatKhoAo,
  hideRacKhoAo,
  is2MCodeInKhoAo,
  isMLotNoInP500,
  deleteInKhoAo,
  deleteOutKhoAo,
  checkPLAN_ID,
  nhapKhoAo,
  loadNhapKhoSub,
  loadTonKhoSub,
  checkMlotTonKhoSub,
  setYNKhoSubInput,
};

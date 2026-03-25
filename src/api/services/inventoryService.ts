import Swal from "sweetalert2";
import { generalQuery, getUserData } from "../Api";
import { CODE_FULL_INFO } from "../../pages/rnd/interfaces/rndInterface";
import { zeroPad } from "./utilService";


/**
 * Inventory & warehouse service - extracted from GlobalFunction.tsx
 */
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

export const f_updateLossKT = async (codeList: CODE_FULL_INFO[]) => {
  if (codeList.length >= 1) {
    checkBPLocal(getUserData(), ["ALL"], ["ALL"], ["ALL"], async () => {
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

// Local import to avoid circular dependency
async function checkBPLocal(...args: any[]) {
  const { checkBP } = await import("./permissionService");
  return checkBP(args[0], args[1], args[2], args[3], args[4]);
}

export const f_getI221NextIN_NO = async () => {
  let next_in_no: string = "001";
  await generalQuery("getI221Lastest_IN_NO", {})
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        const current_in_no: string = response.data.data[0].MAX_IN_NO ?? "000";
        next_in_no = zeroPad(parseInt(current_in_no) + 1, 3);
      } else {
      }
    })
    .catch((error) => {});
  return next_in_no;
};

export const f_getI222Next_M_LOT_NO = async () => {
  let next_m_lot_no: string = "001";
  await generalQuery("getI222Lastest_M_LOT_NO", {})
    .then((response) => {
      if (response.data.tk_status !== "NG") {
        const current_m_lot_no: string = response.data.data[0].MAX_M_LOT_NO;
        let part1: string = current_m_lot_no.substring(0, 8);
        let part2: string = current_m_lot_no.substring(8, 12);
        next_m_lot_no = part1 + zeroPad(parseInt(part2) + 1, 4);
      } else {
      }
    })
    .catch((error) => {});
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

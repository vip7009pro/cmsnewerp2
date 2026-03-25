import moment from "moment";
import Swal from "sweetalert2";
import { generalQuery, getUserData } from "../../../../api/Api";
import { QLSXCHITHIDATA, QLSXPLANDATA } from "../interfaces/khsxInterface";
import { khoAoService } from "./khoAoService";

const zeroPad = (num: number, places: number) => String(num).padStart(places, "0");

const updateDKXLPLAN = async (PLAN_ID: string): Promise<void> => {
  await generalQuery("updateDKXLPLAN", { PLAN_ID })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

const checkPlanIdO300 = async (PLAN_ID: string): Promise<{ checkPlanIdO300: boolean; NEXT_OUT_DATE: string }> => {
  let checkPlanIdO300: boolean = true;
  let NEXT_OUT_DATE: string = moment().format("YYYYMMDD");
  await generalQuery("checkPLANID_O300", { PLAN_ID })
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

const checkPlanIdO301 = async (PLAN_ID: string): Promise<{ checkPlanIdO301: boolean; Last_O301_OUT_SEQ: number }> => {
  let checkPlanIdO301: boolean = true;
  let Last_O301_OUT_SEQ: number = 0;
  await generalQuery("checkPLANID_O301", { PLAN_ID })
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

const getO300_LAST_OUT_NO = async (): Promise<string> => {
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

const getP400 = async (PROD_REQUEST_NO: string, PROD_REQUEST_DATE: string): Promise<Array<any>> => {
  let P400: Array<any> = [];
  await generalQuery("getP400", {
    PROD_REQUEST_NO,
    PROD_REQUEST_DATE,
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

const insertO300 = async (DATA: any): Promise<void> => {
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
  }).catch((error) => {
    console.log(error);
  });
};

const getO300_OUT_NO = async (PLAN_ID: string): Promise<string> => {
  let O300_OUT_NO: string = "001";
  await generalQuery("getO300_ROW", { PLAN_ID })
    .then((response) => {
      console.log(response.data);
      if (response.data.data.length > 0) {
        O300_OUT_NO = response.data.data[0].OUT_NO;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return O300_OUT_NO;
};

const deleteM_CODE_O301 = async (PLAN_ID: string, M_CODE_LIST: string): Promise<void> => {
  await generalQuery("deleteM_CODE_O301", {
    PLAN_ID,
    M_CODE_LIST,
  })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

const checkM_CODE_PLAN_ID_Exist_in_O301 = async (PLAN_ID: string, M_CODE: string): Promise<boolean> => {
  let TonTaiM_CODE_O301: boolean = false;
  await generalQuery("checkM_CODE_PLAN_ID_Exist_in_O301", {
    PLAN_ID,
    M_CODE,
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

const insertO301 = async (DATA: any): Promise<void> => {
  await generalQuery("insertO301", {
    OUT_DATE: DATA.OUT_DATE,
    OUT_NO: DATA.OUT_NO,
    CODE_03: DATA.CODE_03,
    OUT_SEQ: DATA.OUT_SEQ,
    USE_YN: "Y",
    M_CODE: DATA.M_CODE,
    OUT_PRE_QTY: DATA.OUT_PRE_QTY,
    PLAN_ID: DATA.PLAN_ID,
    G_CODE: DATA.G_CODE,
  })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

const updateO301 = async (DATA: any): Promise<void> => {
  await generalQuery("updateO301", {
    M_CODE: DATA.M_CODE,
    OUT_PRE_QTY: DATA.OUT_PRE_QTY,
    PLAN_ID: DATA.PLAN_ID,
  })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

/* ── xuất liệu chính / dao film (migrated from khsxUtils) ── */

const updateXUATLIEUCHINHPLAN = async (PLAN_ID: string): Promise<void> => {
  await generalQuery("updateXUATLIEUCHINH_PLAN", { PLAN_ID: PLAN_ID })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

const updateXUAT_DAO_FILM_PLAN = async (PLAN_ID: string): Promise<void> => {
  await generalQuery("update_XUAT_DAO_FILM_PLAN", { PLAN_ID: PLAN_ID })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

const handleXuatLieuSample = async (selectedPlan: QLSXPLANDATA): Promise<string> => {
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
        if (response.data.tk_status !== "NG") {
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
    await generalQuery("check_PLAN_ID_KHO_AO", {
      PLAN_ID: selectedPlan?.PLAN_ID,
    })
      .then((response) => {
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
    if (check_ycsx_sample) {
      if (checkPLANID_EXIST_OUT_KHO_SX === false) {
        //nhap kho ao
        await khoAoService.nhapKhoAo({
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
        let kq_xuatkhoao = await khoAoService.xuatKhoAo({
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
          updateXUATLIEUCHINHPLAN(
            selectedPlan?.PLAN_ID === undefined ? "xxx" : selectedPlan?.PLAN_ID
          );
        }
        Swal.fire("Thông báo", "Đã xuất liệu ảo thành công", "info");
      } else {
        updateXUATLIEUCHINHPLAN(
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

const handleXuatDaoSample = async (selectedPlan: QLSXPLANDATA): Promise<string> => {
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
        if (response.data.tk_status !== "NG") {
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
        if (response.data.tk_status !== "NG") {
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
          PD: selectedPlan?.PD,
          CAVITY: selectedPlan?.CAVITY,
        })
          .then((response) => {
            if (response.data.tk_status !== "NG") {
              updateXUAT_DAO_FILM_PLAN(
                selectedPlan?.PLAN_ID === undefined
                  ? "xxx"
                  : selectedPlan?.PLAN_ID
              );
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

const registerXuatLieu = async (
    selectedPlan: QLSXPLANDATA,
    selectedFactory: string,
    chithidatatable: QLSXCHITHIDATA[]
  ): Promise<string> => {
    let err_code: string = "0";
    let NEXT_OUT_NO: string = "001";

    if (chithidatatable.length <= 0) {
      err_code = "Chọn ít nhất một liệu để đăng ký";
      return err_code;
    }

    let { checkPlanIdO300: existedO300, NEXT_OUT_DATE } = await checkPlanIdO300(selectedPlan.PLAN_ID);

    if (!existedO300) {
      NEXT_OUT_NO = await getO300_LAST_OUT_NO();

      let CODE_50: string = "";
      const p400Data = await getP400(selectedPlan.PROD_REQUEST_NO, selectedPlan.PROD_REQUEST_DATE);
      if (p400Data.length > 0) {
        CODE_50 = p400Data[0].CODE_50;
      }
      if (CODE_50 === "") {
        err_code = "Không tìm thấy mã phân loại giao hàng";
        return err_code;
      }

      await insertO300({
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
      NEXT_OUT_NO = await getO300_OUT_NO(selectedPlan.PLAN_ID);
    }

    let checkchithimettotal: number = 0;
    for (let i = 0; i < chithidatatable.length; i++) {
      checkchithimettotal += chithidatatable[i].M_MET_QTY;
    }
    if (checkchithimettotal <= 0) {
      err_code = "Tổng số liệu phải lớn hơn 0";
      return err_code;
    }

    let M_CODE_LIST: string = chithidatatable.map((x) => "'" + x.M_CODE + "'").join(",");
    await deleteM_CODE_O301(selectedPlan.PLAN_ID, M_CODE_LIST);

    for (let i = 0; i < chithidatatable.length; i++) {
      if (chithidatatable[i].M_MET_QTY > 0) {
        let TonTaiM_CODE_O301: boolean = await checkM_CODE_PLAN_ID_Exist_in_O301(
          selectedPlan.PLAN_ID,
          chithidatatable[i].M_CODE
        );
        if (chithidatatable[i].LIEUQL_SX === 1) {
          await updateDKXLPLAN(chithidatatable[i].PLAN_ID);
        }
        let met_dang_ky: number = chithidatatable[i].M_MET_QTY * chithidatatable[i].M_QTY;
        if (selectedPlan.PROCESS_NUMBER !== 1 && chithidatatable[i].LIEUQL_SX === 1) {
          met_dang_ky = 0;
        }

        if (!TonTaiM_CODE_O301) {
          let { Last_O301_OUT_SEQ } = await checkPlanIdO301(selectedPlan.PLAN_ID);
          await insertO301({
            OUT_DATE: NEXT_OUT_DATE,
            OUT_NO: NEXT_OUT_NO,
            CODE_03: "01",
            OUT_SEQ: zeroPad(Last_O301_OUT_SEQ + i + 1, 3),
            USE_YN: "Y",
            M_CODE: chithidatatable[i].M_CODE,
            OUT_PRE_QTY: met_dang_ky,
            PLAN_ID: selectedPlan.PLAN_ID,
            G_CODE: selectedPlan.G_CODE,
          });
        } else {
          await updateO301({
            M_CODE: chithidatatable[i].M_CODE,
            OUT_PRE_QTY: met_dang_ky,
            PLAN_ID: selectedPlan.PLAN_ID,
          });
        }
      }
    }

    return err_code;
  };

export const xuatLieuService = {
  registerXuatLieu,
  handleXuatLieuSample,
  handleXuatDaoSample,
  updateXUATLIEUCHINHPLAN,
  updateXUAT_DAO_FILM_PLAN,
};

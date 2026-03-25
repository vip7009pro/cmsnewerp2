import { generalQuery } from "../../../../api/Api";
import { QLSXCHITHIDATA, QLSXPLANDATA } from "../interfaces/khsxInterface";

const deleteChiThiMaterialLines = (
  selected: QLSXCHITHIDATA[],
  original: QLSXCHITHIDATA[]
): { data: QLSXCHITHIDATA[]; deletedCount: number } => {
  if (selected.length === 0) {
    return {
      data: [...original],
      deletedCount: 0,
    };
  }

  const selectedIds = new Set(selected.map((x) => x.CHITHI_ID));
  const data = original.filter((x) => !selectedIds.has(x.CHITHI_ID));

  return {
    data,
    deletedCount: selected.length,
  };
};

const saveChiThiMaterialTable = async (
  selectedPlan: QLSXPLANDATA,
  chithidatatable: QLSXCHITHIDATA[]
): Promise<string> => {
  let err_code: string = "0";
  let total_lieuql_sx: number = 0;
  let check_lieuql_sx_sot: number = 0;
  let check_num_lieuql_sx: number = 1;
  let check_lieu_qlsx_khac1: number = 0;

  for (let i = 0; i < chithidatatable.length; i++) {
    total_lieuql_sx += chithidatatable[i].LIEUQL_SX;
    if (chithidatatable[i].LIEUQL_SX > 1) check_lieu_qlsx_khac1 += 1;
  }

  for (let i = 0; i < chithidatatable.length; i++) {
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

  for (let i = 0; i < chithidatatable.length; i++) {
    if (parseInt(chithidatatable[i].LIEUQL_SX.toString()) === 1) {
      for (let j = 0; j < chithidatatable.length; j++) {
        if (parseInt(chithidatatable[j].LIEUQL_SX.toString()) === 1) {
          if (chithidatatable[i].M_NAME !== chithidatatable[j].M_NAME) {
            check_num_lieuql_sx = 2;
          }
        }
      }
    }
  }

  if (
    total_lieuql_sx > 0 &&
    check_lieuql_sx_sot === 0 &&
    check_num_lieuql_sx === 1 &&
    check_lieu_qlsx_khac1 === 0
  ) {
    await generalQuery("deleteMCODEExistIN_O302", {
      PLAN_ID: selectedPlan?.PLAN_ID,
    }).catch((error) => {
      console.log(error);
    });

    for (let i = 0; i < chithidatatable.length; i++) {
      await generalQuery("updateLIEUQL_SX_M140", {
        G_CODE: selectedPlan?.G_CODE,
        M_CODE: chithidatatable[i].M_CODE,
        LIEUQL_SX: chithidatatable[i].LIEUQL_SX >= 1 ? 1 : 0,
      }).catch((error) => {
        console.log(error);
      });

      if (chithidatatable[i].M_MET_QTY > 0) {
        let checktontaiM_CODE: boolean = false;

        await generalQuery("deleteM_CODE_ZTB_QLSXCHITHI", {
          PLAN_ID: selectedPlan.PLAN_ID,
          M_CODE_LIST: chithidatatable
            .map((x) => "'" + x.M_CODE + "'")
            .join(","),
        }).catch((error) => {
          console.log(error);
        });

        await generalQuery("checkM_CODE_PLAN_ID_Exist", {
          PLAN_ID: selectedPlan?.PLAN_ID,
          M_CODE: chithidatatable[i].M_CODE,
        })
          .then((response) => {
            if (response.data.tk_status !== "NG") {
              checktontaiM_CODE = true;
            }
          })
          .catch((error) => {
            console.log(error);
          });

        let m_dang_ky: number = chithidatatable[i].M_MET_QTY;
        if (selectedPlan.PROCESS_NUMBER !== 1 && chithidatatable[i].LIEUQL_SX === 1) {
          m_dang_ky = 0;
        }

        if (checktontaiM_CODE) {
          await generalQuery("updateChiThi", {
            PLAN_ID: selectedPlan?.PLAN_ID,
            M_CODE: chithidatatable[i].M_CODE,
            M_ROLL_QTY: chithidatatable[i].M_ROLL_QTY,
            M_MET_QTY: m_dang_ky,
            M_QTY: chithidatatable[i].M_QTY,
            LIEUQL_SX: chithidatatable[i].LIEUQL_SX >= 1 ? 1 : 0,
          })
            .then((response) => {
              if (response.data.tk_status === "NG") {
                err_code += "_" + response.data.message;
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          await generalQuery("insertChiThi", {
            PLAN_ID: selectedPlan?.PLAN_ID,
            M_CODE: chithidatatable[i].M_CODE,
            M_ROLL_QTY: chithidatatable[i].M_ROLL_QTY,
            M_MET_QTY: m_dang_ky,
            M_QTY: chithidatatable[i].M_QTY,
            LIEUQL_SX: chithidatatable[i].LIEUQL_SX,
          })
            .then((response) => {
              if (response.data.tk_status === "NG") {
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

export const chiThiMaterialService = {
  deleteChiThiMaterialLines,
  saveChiThiMaterialTable,
};

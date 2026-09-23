import React from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { generalQuery, getCompany, getSocket, getUserData, uploadQuery } from "../../../../api/Api";
import { checkBP } from "../../../../api/services/permissionService";
import { f_insert_Notification_Data } from "../../../../api/services/notificationService";
import { checkHSD2, zeroPad } from "../../../../api/services/utilService";
import { DEFAULT_DM } from "../../../kinhdoanh/interfaces/kdInterface";
import { BOM_GIA, BOM_SX, CODE_FULL_INFO } from "../../interfaces/rndInterface";
import { MaterialListData } from "../../../qc/interfaces/qcInterface";
import { MACHINE_LIST, PROD_PROCESS_DATA } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";
import {
  f_addProcessDataTotal,
  f_checkEQ_SERIES_Exist_In_EQ_SERIES_LIST,
  f_checkProcessNumberContinuos,
  f_deleteProcessNotInCurrentListFromDataBase,
  f_deleteProdProcessData,
} from "../../../qlsx/QLSXPLAN/utils/khsxUtils";

interface UseBOMManagerActionsProps {
  codefullinfo: CODE_FULL_INFO;
  setCodeFullInfo: React.Dispatch<React.SetStateAction<CODE_FULL_INFO>>;
  bomsxtable: BOM_SX[];
  setBOMSXTable: React.Dispatch<React.SetStateAction<BOM_SX[]>>;
  bomgiatable: BOM_GIA[];
  setBOMGIATable: React.Dispatch<React.SetStateAction<BOM_GIA[]>>;
  defaultDM: DEFAULT_DM;
  handleCODEINFO: () => void;
  handleSelectCode: (g_code: string) => void;
  bomsxSelectedRows: React.MutableRefObject<any[]>;
  bomgiaSelectedRows: React.MutableRefObject<any[]>;
  selectedMaterial: MaterialListData | null;
  selectedMasterMaterial: any;
  currentProcessList: PROD_PROCESS_DATA[];
  setCurrentProcessList: React.Dispatch<React.SetStateAction<PROD_PROCESS_DATA[]>>;
  tempSelectedMachine: string;
  tempSelectedProcess: React.MutableRefObject<any>;
  machineList: MACHINE_LIST[];
  loadProcessList: (G_CODE: string) => void;
}

export const useBOMManagerActions = ({
  codefullinfo,
  setCodeFullInfo,
  bomsxtable,
  setBOMSXTable,
  bomgiatable,
  setBOMGIATable,
  defaultDM,
  handleCODEINFO,
  handleSelectCode,
  bomsxSelectedRows,
  bomgiaSelectedRows,
  selectedMaterial,
  selectedMasterMaterial,
  currentProcessList,
  setCurrentProcessList,
  tempSelectedMachine,
  tempSelectedProcess,
  machineList,
  loadProcessList,
}: UseBOMManagerActionsProps) => {
  const userData = getUserData();

  const checkG_NAME_KD_Exist = async (g_name_kd: string) => {
    try {
      const response = await generalQuery("checkGNAMEKDExist", { G_NAME_KD: g_name_kd });
      return response.data?.tk_status !== "NG";
    } catch {
      return false;
    }
  };

  const checkHSD = (): boolean => {
    if (codefullinfo.PD_HSD === "Y") return true;

    const hsdVL = Number(selectedMasterMaterial?.EXP_DATE ?? 0);
    const hsdSP = Number(codefullinfo.EXP_DATE ?? 0);
    const valid = (hsdVL === hsdSP && hsdVL !== 0) || (codefullinfo.QL_HSD === "N");
    if (!valid) {
      Swal.fire(
        "Thông báo",
        `Hạn sử dụng sản phẩm không khớp vs HSD NVL, hãy check lại với mua hàng: HSD VL ${hsdVL}, HSD SP ${hsdSP}`,
        "error"
      );
    }
    return valid;
  };

  const handleCheckCodeInfo2 = async () => {
    if (getCompany() !== "CMS" && userData?.MAINDEPTNAME === "KD") return true;

    const abc: any = codefullinfo;
    for (const [k, v] of Object.entries(abc)) {
      if (
        (v === null || v === "") &&
        ![
          "REMK",
          "CUST_NAME",
          "FACTORY",
          "Setting1",
          "Setting2",
          "Setting3",
          "Setting4",
          "UPH1",
          "UPH2",
          "UPH3",
          "UPH4",
          "Step1",
          "Step2",
          "Step3",
          "Step4",
          "LOSS_SX1",
          "LOSS_SX2",
          "LOSS_SX3",
          "LOSS_SX4",
          "LOSS_SETTING1",
          "LOSS_SETTING2",
          "LOSS_SETTING3",
          "LOSS_SETTING4",
          "NOTE",
          "PD_HSD",
          "UPDATE_REASON",
          "UPD_DATE",
          "UPD_EMPL",
          "PDBV",
        ].includes(k)
      ) {
        Swal.fire("Thông báo", `Không được để trống: ${k}`, "error");
        return false;
      }
    }
    return true;
  };

  const handleCheckCodeInfo = async () => {
    const valid = await handleCheckCodeInfo2();
    return valid && checkHSD();
  };

  // Lấy CODE_27 từ PROD_TYPE (khớp logic backend/backup: TSP/OLED/UV=C, LABEL=A, TAPE=B, RIBBON=E)
  const getCode27 = (prodTypeRaw: string): string => {
    const pType = (prodTypeRaw || "").trim().toUpperCase();
    if (pType === "LABEL") return "A";
    if (pType === "TAPE") return "B";
    if (pType === "RIBBON") return "E";
    return "C";
  };

  // Lấy G_CODE kế tiếp dựa trên SEQ_NO hiện có trong DB
  const getNextG_CODE = async (CODE_12: string, CODE_27: string) => {
    let nextseq = "";
    let nextseqno = "";
    try {
      const response = await generalQuery("getNextSEQ_G_CODE", { CODE_12, CODE_27 });
      const currentseq = response.data?.data?.[0]?.LAST_SEQ_NO;
      if (response.data?.tk_status !== "NG" && currentseq !== null && currentseq !== undefined) {
        if (CODE_12 === "9") {
          nextseq = zeroPad(Number(currentseq) + 1, 6);
          nextseqno = nextseq;
        } else {
          nextseq = zeroPad(Number(currentseq) + 1, 5) + "A";
          nextseqno = zeroPad(Number(currentseq) + 1, 5);
        }
      } else if (CODE_12 === "9") {
        nextseq = "000001";
        nextseqno = nextseq;
      } else {
        nextseq = "00001A";
        nextseqno = "00001";
      }
    } catch {
      if (CODE_12 === "9") {
        nextseq = "000001";
        nextseqno = nextseq;
      } else {
        nextseq = "00001A";
        nextseqno = "00001";
      }
    }
    return { NEXT_G_CODE: CODE_12 + CODE_27 + nextseq, NEXT_SEQ_NO: nextseqno };
  };

  const handleinsertCodeTBG = async (NEWG_CODE: string) => {
    try {
      const response = await generalQuery("insertM100BangTinhGia", {
        G_CODE: NEWG_CODE,
        DEFAULT_DM: defaultDM,
        CODE_FULL_INFO: codefullinfo,
      });
      if (response.data.tk_status === "NG") {
        Swal.fire("Thông báo", `Lỗi: ${response.data.message}`, "error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleupdateCodeTBG = async () => {
    try {
      const response = await generalQuery("updateM100BangTinhGia", codefullinfo);
      if (response.data.tk_status !== "NG") {
        Swal.fire("Thông báo", `Update thành công: ${codefullinfo.G_CODE}`, "success");
      } else {
        Swal.fire("Thông báo", `Lỗi: ${response.data.message}`, "error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const confirmUpdateM100TBG = () => {
    Swal.fire({
      title: "Bạn có muốn update luôn thông tin sản phẩm trong báo giá ?",
      text: "Update thông tin báo giá",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn Update!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành Update Thông tin", "Đang Update Thông tin", "success");
        generalQuery("checkTBGExist", { G_CODE: codefullinfo.G_CODE })
          .then((response) => {
            if (response.data.tk_status !== "NG") {
              handleupdateCodeTBG();
            } else {
              handleinsertCodeTBG(codefullinfo.G_CODE);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    });
  };

  // Thêm mã mới
  const handleAddNewCode = async () => {
    try {
      const isCMS = getCompany() === "CMS";
      const checkg_name_kd = await checkG_NAME_KD_Exist(
        codefullinfo.G_NAME_KD === undefined ? "zzzzzzzzz" : codefullinfo.G_NAME_KD
      );

      // handleCheckCodeInfo sẽ báo ra chính xác trường thông tin còn thiếu (đối với CMS)
      if ((isCMS && (await handleCheckCodeInfo())) || (!isCMS && checkg_name_kd === false)) {
        const CODE_27 = getCode27(codefullinfo.PROD_TYPE);
        const nextcodeinfo = await getNextG_CODE(codefullinfo.CODE_12, CODE_27);
        const nextcode = nextcodeinfo.NEXT_G_CODE;
        const nextgseqno = nextcodeinfo.NEXT_SEQ_NO;

        const insertRes = await generalQuery("insertM100", {
          G_CODE: nextcode,
          CODE_27,
          NEXT_SEQ_NO: nextgseqno,
          CODE_FULL_INFO: codefullinfo,
        });

        if (insertRes.data.tk_status !== "NG") {
          Swal.fire("Thông báo", `Code mới: ${nextcode}`, "success");
          handleCODEINFO();
          handleSelectCode(nextcode);
          await handleinsertCodeTBG(nextcode);
        } else {
          Swal.fire("Thông báo", `Lỗi: ${insertRes.data.message}`, "error");
        }
      } else if (!isCMS) {
        Swal.fire(
          "Cảnh báo",
          `Code ${codefullinfo.G_NAME_KD ?? "zzzzzzzzz"} đã tồn tại`,
          "error"
        );
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Lỗi", "Không thể tạo mã mới", "error");
    }
  };

  const confirmAddNewCode = () => {
    Swal.fire({
      title: "Chắc chắn muốn thêm code mới?",
      text: "Vui lòng kiểm tra kỹ các thông số trước khi tạo",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Thêm Mới",
      cancelButtonText: "Hủy",
    }).then((res) => {
      if (res.isConfirmed) {
        checkBP(userData, ["RND", "QLSX", "KD"], ["ALL"], ["ALL"], handleAddNewCode);
      }
    });
  };

  // Thêm phiên bản mới (Rev)
  const handleAddNewVer = async () => {
    if (!codefullinfo.G_CODE) {
      Swal.fire("Cảnh báo", "Vui lòng chọn một mã để thêm phiên bản mới", "warning");
      return;
    }
    try {
      const isCMS = getCompany() === "CMS";
      // handleCheckCodeInfo sẽ báo ra chính xác trường thông tin còn thiếu (đối với CMS)
      if ((isCMS && (await handleCheckCodeInfo())) || !isCMS) {
        const CODE_27 = getCode27(codefullinfo.PROD_TYPE);

        let newGCODE = "";
        let nextseqno = "";
        let CURRENT_REV_NO = "";
        let NEXT_REV_NO = "";

        if (codefullinfo.CODE_12 === "9") {
          nextseqno = zeroPad(Number(codefullinfo.G_CODE.substring(2, 8)) + 1, 6);
          newGCODE = codefullinfo.CODE_12 + CODE_27 + nextseqno;
        } else {
          nextseqno = codefullinfo.G_CODE.substring(2, 7);
          CURRENT_REV_NO = codefullinfo.G_CODE.substring(7, 8);
          NEXT_REV_NO = String.fromCharCode(CURRENT_REV_NO.charCodeAt(0) + 1);
          newGCODE = codefullinfo.CODE_12 + CODE_27 + nextseqno + NEXT_REV_NO;
        }

        const res = await generalQuery("insertM100_AddVer", {
          G_CODE: newGCODE,
          CODE_27,
          NEXT_SEQ_NO: nextseqno,
          REV_NO: NEXT_REV_NO,
          CODE_FULL_INFO: codefullinfo,
        });

        if (res.data.tk_status !== "NG") {
          Swal.fire("Thông báo", `Code ver mới: ${newGCODE}`, "success");
          handleCODEINFO();
          await handleinsertCodeTBG(newGCODE);
        } else {
          Swal.fire("Thông báo", `Lỗi: ${res.data.message}`, "error");
        }
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Lỗi", "Không thể tạo phiên bản mới", "error");
    }
  };

  const confirmAddNewVer = () => {
    Swal.fire({
      title: `Thêm phiên bản mới cho mã ${codefullinfo.G_CODE}?`,
      text: "Hệ thống sẽ tự động nâng Rev tiếp theo",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Tạo Rev Mới",
      cancelButtonText: "Hủy",
    }).then((res) => {
      if (res.isConfirmed) {
        checkBP(userData, ["RND", "QLSX", "KD"], ["ALL"], ["ALL"], handleAddNewVer);
      }
    });
  };

  // Cập nhật thông tin mã
  const handleUpdateCode = async () => {
    if (!codefullinfo.G_CODE) {
      Swal.fire("Cảnh báo", "Chưa chọn mã để cập nhật", "warning");
      return;
    }

    let tempUpdateReason = codefullinfo?.UPDATE_REASON ?? "-";
    let currentReason = "-";

    if ((codefullinfo.PDBV ?? "N") === "Y") {
      const { value: pass1 } = await Swal.fire({
        title: "Xác nhận",
        input: "text",
        inputLabel: "Lý do update thông tin code",
        inputValue: "",
        inputPlaceholder: "Bạn update cái gì ?",
        showCancelButton: true,
      });
      currentReason = pass1 ?? "";
      tempUpdateReason =
        pass1 !== undefined && pass1 !== ""
          ? moment().format("YYYY-MM-DD HH:mm:ss") + "_" + getUserData()?.EMPL_NO + ":" + pass1
          : "";
    }

    if (currentReason !== "") {
      if (checkMAINVLMatching()) {
        if ((getCompany() === "CMS") && (await handleCheckCodeInfo2()) || getCompany() !== "CMS") {
          let tempInfo = codefullinfo;
          if (!(await checkHSD2(Number(selectedMasterMaterial?.EXP_DATE ?? 0), Number(codefullinfo.EXP_DATE ?? 0), codefullinfo.PD_HSD ?? "N", codefullinfo.QL_HSD ?? "Y")) && getCompany() === "CMS") {
            tempInfo = {
              ...codefullinfo,
              PD_HSD: "P",
              UPD_COUNT: (codefullinfo?.UPD_COUNT ?? 0) + 1,
              UPDATE_REASON: tempUpdateReason,
            } as CODE_FULL_INFO;
          } else {
            tempInfo = {
              ...codefullinfo,
              PD_HSD: "N",
              UPD_COUNT: (codefullinfo?.UPD_COUNT ?? 0) + 1,
              UPDATE_REASON: tempUpdateReason,
            } as CODE_FULL_INFO;
          }

          try {
            const res = await generalQuery("updateM100", tempInfo);
            if (res.data.tk_status !== "NG") {
              const newNotification = {
                CTR_CD: "002",
                NOTI_ID: -1,
                NOTI_TYPE: "info",
                TITLE: "Update thông tin sản phẩm",
                CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${getUserData()?.FIRST_NAME}), nhân viên ${getUserData()?.WORK_POSITION_NAME} đã update thông tin sản phẩm: ${codefullinfo.G_CODE}`,
                SUBDEPTNAME: "KD,RND",
                MAINDEPTNAME: "KD,RND",
                INS_EMPL: "NHU1903",
                INS_DATE: "2024-12-30",
                UPD_EMPL: "NHU1903",
                UPD_DATE: "2024-12-30",
              };
              if (await f_insert_Notification_Data(newNotification)) {
                getSocket().emit("notification_panel", newNotification);
              }
              Swal.fire("Thông báo", `Update thành công: ${codefullinfo.G_CODE}`, "success");
            } else {
              Swal.fire("Thông báo", `Lỗi: ${res.data.message}`, "error");
            }
          } catch (error) {
            console.error(error);
            Swal.fire("Lỗi", "Không thể cập nhật thông tin mã", "error");
          }

          Swal.fire({
            title: "Bạn có muốn update luôn thông tin sản phẩm trong báo giá ?",
            text: "Update thông tin báo giá",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Vẫn Update!",
          }).then((result) => {
            if (result.isConfirmed) {
              generalQuery("checkTBGExist", { G_CODE: codefullinfo.G_CODE })
                .then((response) => {
                  if (response.data.tk_status !== "NG") {
                    handleupdateCodeTBG();
                  } else {
                    handleinsertCodeTBG(codefullinfo.G_CODE);
                  }
                })
                .catch((error) => {
                  console.error(error);
                });
            }
          });
        }
      }
    } else {
      Swal.fire("Thông báo", "Phải nhập lý do update", "error");
    }
  };

  const confirmUpdateCode = () => {
    Swal.fire({
      title: `Cập nhật thông tin mã ${codefullinfo.G_CODE}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Cập Nhật",
      cancelButtonText: "Hủy",
    }).then((res) => {
      if (res.isConfirmed) {
        checkBP(userData, ["RND", "QLSX", "KD"], ["ALL"], ["ALL"], handleUpdateCode);
      }
    });
  };

  const checkMAINVLMatching = (): boolean => {
    let checkM = false;
    if (bomsxtable.length > 0) {
      const mainM = bomsxtable.find((ele) => ele.LIEUQL_SX === 1)?.M_NAME ?? "NG";
      if (mainM === "NG") {
        checkM = false;
        Swal.fire("Thông báo", "Bom VL chưa set liệu chính", "error");
      } else if (selectedMasterMaterial?.M_NAME) {
        if (mainM === selectedMasterMaterial.M_NAME) {
          checkM = true;
        } else {
          checkM = false;
          Swal.fire("Thông báo", "Liệu chính được chọn không khớp liệu chính trong BOM VL", "error");
        }
      } else {
        checkM = true;
      }
    } else {
      checkM = true;
    }
    return checkM;
  };

  const handleInsertBOMSX = async () => {
    try {
      const currentBOMGIARes = await generalQuery("getbomgia", { G_CODE: codefullinfo.G_CODE });
      const currentBOMGIA: BOM_GIA[] =
        currentBOMGIARes.data?.tk_status !== "NG" && Array.isArray(currentBOMGIARes.data?.data)
          ? currentBOMGIARes.data.data.map((element: BOM_GIA, index: number) => ({
              ...element,
              INS_DATE: element.INS_DATE ? moment.utc(element.INS_DATE).format("YYYY-MM-DD HH:mm:ss") : "",
              UPD_DATE: element.UPD_DATE ? moment.utc(element.UPD_DATE).format("YYYY-MM-DD HH:mm:ss") : "",
              id: String(index),
            }))
          : [];

      const mainM_BOMSX = bomsxtable.find((ele) => ele.LIEUQL_SX === 1)?.M_NAME ?? "NG";
      const mainM_BOMGIA = currentBOMGIA.find((ele) => ele.MAIN_M === 1)?.M_NAME ?? "NG";

      if (currentBOMGIA.length === 0) {
        Swal.fire("Thông báo", "Code chưa có BOM giá, phải thêm BOM giá trước", "warning");
        return;
      }

      if (!checkMAINVLMatching() || mainM_BOMGIA !== mainM_BOMSX) {
        Swal.fire(
          "Thông báo",
          "Liệu chính trong BOM SX phải giống với liệu chính trong BOM giá",
          "warning"
        );
        return;
      }

      if (bomsxtable.length === 0) {
        Swal.fire("Thông báo", "Thêm ít nhất 1 liệu để lưu BOM", "warning");
        return;
      }

      let err_code = "0";
      let total_lieuql_sx = 0;
      let check_lieuql_sx_sot = 0;
      let check_num_lieuql_sx = 1;
      let check_lieu_qlsx_khac1 = 0;
      let m_list = "";

      for (let i = 0; i < bomsxtable.length; i++) {
        total_lieuql_sx += Number(bomsxtable[i].LIEUQL_SX ?? 0);
        if ((bomsxtable[i].LIEUQL_SX ?? 0) > 1) check_lieu_qlsx_khac1 += 1;
      }

      for (let i = 0; i < bomsxtable.length; i++) {
        if (bomsxtable[i].LIEUQL_SX === 1) {
          for (let j = 0; j < bomsxtable.length; j++) {
            if (bomsxtable[j].M_NAME === bomsxtable[i].M_NAME && (bomsxtable[j].LIEUQL_SX ?? 0) === 0) {
              check_lieuql_sx_sot += 1;
            }
          }
        }
      }

      for (let i = 0; i < bomsxtable.length; i++) {
        if (bomsxtable[i].LIEUQL_SX === 1) {
          for (let j = 0; j < bomsxtable.length; j++) {
            if ((bomsxtable[j].LIEUQL_SX ?? 0) === 1 && bomsxtable[i].M_NAME !== bomsxtable[j].M_NAME) {
              check_num_lieuql_sx = 2;
            }
          }
        }
      }

      for (let i = 0; i < bomsxtable.length - 1; i++) {
        m_list += `'${bomsxtable[i].M_CODE}',`;
      }
      m_list += `'${bomsxtable[bomsxtable.length - 1].M_CODE}'`;

      if (
        total_lieuql_sx <= 0 ||
        check_lieuql_sx_sot !== 0 ||
        check_num_lieuql_sx !== 1 ||
        check_lieu_qlsx_khac1 !== 0
      ) {
        err_code += " | Check lại liệu quản lý (liệu chính)";
      }

      if (err_code === "0") {
        await generalQuery("deleteM140_2", {
          G_CODE: codefullinfo.G_CODE,
          M_LIST: m_list,
        });

        let max_g_seq = "001";
        const seqRes = await generalQuery("checkGSEQ_M140", { G_CODE: codefullinfo.G_CODE });
        if (seqRes.data?.tk_status !== "NG" && seqRes.data?.data?.[0]?.MAX_G_SEQ) {
          max_g_seq = seqRes.data.data[0].MAX_G_SEQ;
        }

        for (let i = 0; i < bomsxtable.length; i++) {
          const row = bomsxtable[i];
          const checkMCodeRes = await generalQuery("check_m_code_m140", {
            G_CODE: codefullinfo.G_CODE,
            M_CODE: row.M_CODE,
          });
          const exists = checkMCodeRes.data?.tk_status !== "NG";

          if (exists) {
            await generalQuery("update_M140", {
              G_CODE: codefullinfo.G_CODE,
              M_CODE: row.M_CODE,
              M_QTY: row.M_QTY,
              MAIN_M: row.MAIN_M ?? "0",
              LIEUQL_SX: row.LIEUQL_SX ?? 0,
            });
          } else {
            await generalQuery("insertM140", {
              G_CODE: codefullinfo.G_CODE,
              G_SEQ: zeroPad(parseInt(max_g_seq, 10) + i + 1, 3),
              M_CODE: row.M_CODE,
              M_QTY: row.M_QTY,
              MAIN_M: row.MAIN_M ?? "0",
              LIEUQL_SX: row.LIEUQL_SX ?? 0,
            });
          }
        }
        Swal.fire("Thành công", "Đã lưu BOM Sản Xuất thành công!", "success");
      } else {
        Swal.fire("Thông báo", String(err_code), "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Lỗi", "Không thể lưu BOM Sản Xuất", "error");
    }
  };

  const handleInsertBOMSX_WITH_GIA = async () => {
    if (bomsxtable.length > 0) {
      Swal.fire(
        "Thông báo",
        "Code đã có BOM SX, chỉ lưu lại BOM giá mà không lưu thêm BOM SX nữa",
        "warning"
      );
      return;
    }

    if (bomgiatable.length === 0) {
      Swal.fire("Thông báo", "Thêm ít nhất 1 liệu để lưu BOM", "warning");
      return;
    }

    await generalQuery("deleteM140", { G_CODE: codefullinfo.G_CODE });

    for (let i = 0; i < bomgiatable.length; i++) {
      await generalQuery("insertM140", {
        G_CODE: codefullinfo.G_CODE,
        G_SEQ: zeroPad(i + 1, 3),
        M_CODE: bomgiatable[i].M_CODE,
        M_QTY: bomgiatable[i].M_QTY,
        MAIN_M: bomgiatable[i].MAIN_M,
        LIEUQL_SX: bomgiatable[i].MAIN_M ?? 0,
      });
    }
  };

  const handleInsertBOMGIA = async () => {
    if (bomgiatable.length === 0) {
      Swal.fire("Thông báo", "Thêm ít nhất 1 liệu để lưu BOM", "warning");
      return;
    }

    let err_code = "0";
    let checkMAIN_M = 0;
    let isCodeMassProd = false;
    let isNewCode = true;
    let total_lieuql_sx = 0;
    let check_lieuql_sx_sot = 0;
    let check_num_lieuql_sx = 1;
    let check_lieu_qlsx_khac1 = 0;
    let checkusageMain = 0;
    let m_list = "";

    for (let i = 0; i < bomgiatable.length - 1; i++) {
      m_list += `'${bomgiatable[i].M_CODE}',`;
    }
    m_list += `'${bomgiatable[bomgiatable.length - 1].M_CODE}'`;

    for (let i = 0; i < bomgiatable.length; i++) {
      checkusageMain += bomgiatable[i].USAGE?.toUpperCase() === "MAIN" ? 1 : 0;
    }

    for (let i = 0; i < bomgiatable.length; i++) {
      total_lieuql_sx += Number(bomgiatable[i].MAIN_M ?? 0);
      if ((bomgiatable[i].MAIN_M ?? 0) > 1) check_lieu_qlsx_khac1 += 1;
    }

    for (let i = 0; i < bomgiatable.length; i++) {
      if (bomgiatable[i].MAIN_M === 1) {
        for (let j = 0; j < bomgiatable.length; j++) {
          if (bomgiatable[j].M_NAME === bomgiatable[i].M_NAME && (bomgiatable[j].MAIN_M ?? 0) === 0) {
            check_lieuql_sx_sot += 1;
          }
        }
      }
    }

    for (let i = 0; i < bomgiatable.length; i++) {
      if ((bomgiatable[i].MAIN_M ?? 0) === 1) {
        for (let j = 0; j < bomgiatable.length; j++) {
          if ((bomgiatable[j].MAIN_M ?? 0) === 1 && bomgiatable[i].M_NAME !== bomgiatable[j].M_NAME) {
            check_num_lieuql_sx = 2;
          }
        }
      }
    }

    const massCheckRes = await generalQuery("checkMassG_CODE", { G_CODE: codefullinfo.G_CODE });
    if (massCheckRes.data?.tk_status !== "NG") {
      isCodeMassProd = true;
      isNewCode = Number(massCheckRes.data.data[0].PROD_REQUEST_DATE ?? 0) <= 20250112 || userData?.EMPL_NO === "NHU1903";
    }

    for (let i = 0; i < bomgiatable.length; i++) {
      checkMAIN_M += Number(bomgiatable[i].MAIN_M ?? 0);
      if (
        bomgiatable[i].CUST_CD === "" ||
        bomgiatable[i].USAGE === "" ||
        bomgiatable[i].MAT_MASTER_WIDTH === 0 ||
        bomgiatable[i].MAT_ROLL_LENGTH === 0
      ) {
        err_code = "Không được để ô nào NG màu đỏ";
      }
    }

    if (total_lieuql_sx <= 0 || check_lieuql_sx_sot !== 0 || check_num_lieuql_sx !== 1 || check_lieu_qlsx_khac1 !== 0) {
      err_code += " | Check lại liệu quản lý (liệu chính)";
    }

    if (checkusageMain === 0) {
      err_code += "_Cột USAGE chưa chỉ định liệu MAIN, hãy viết MAIN vào ô tương ứng";
    }

    if (getCompany() === "CMS" && !isNewCode) {
      err_code += "_ Code đã YCSX mass sau 24/08/2024, không thể sửa BOM";
    }

    if (checkMAIN_M === 0) {
      err_code += "_ Phải chỉ định liệu quản lý";
    }

    if (err_code === "0") {
      await generalQuery("deleteBOM2", { G_CODE: codefullinfo.G_CODE });

      for (let i = 0; i < bomgiatable.length; i++) {
        await generalQuery("insertBOM2", {
          G_CODE: codefullinfo.G_CODE,
          G_SEQ: zeroPad(i + 1, 3),
          M_CODE: bomgiatable[i].M_CODE,
          M_NAME: bomgiatable[i].M_NAME,
          CUST_CD: bomgiatable[i].CUST_CD,
          USAGE: bomgiatable[i].USAGE,
          MAIN_M: bomgiatable[i].MAIN_M,
          M_CMS_PRICE: bomgiatable[i].M_CMS_PRICE,
          M_SS_PRICE: bomgiatable[i].M_SS_PRICE,
          M_SLITTING_PRICE: bomgiatable[i].M_SLITTING_PRICE,
          MAT_MASTER_WIDTH: bomgiatable[i].MAT_MASTER_WIDTH,
          MAT_CUTWIDTH: bomgiatable[i].MAT_CUTWIDTH,
          MAT_ROLL_LENGTH: bomgiatable[i].MAT_ROLL_LENGTH,
          MAT_THICKNESS: bomgiatable[i].MAT_THICKNESS,
          M_QTY: bomgiatable[i].M_QTY,
          PROCESS_ORDER: bomgiatable[i].PROCESS_ORDER,
          REMARK: bomgiatable[i].REMARK,
        });
      }

      await handleInsertBOMSX_WITH_GIA();
      confirmUpdateBOMTBG();
      Swal.fire("Thành công", "Đã lưu BOM Giá Thành thành công!", "success");
    } else {
      Swal.fire("Thông báo", err_code, "error");
    }
  };

  const confirmUpdateBOMTBG = () => {
    Swal.fire({
      title: "Bạn có muốn update bom sản phẩm trong tính báo giá ?",
      text: "Update thông tin báo giá",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn Update!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành Update Thông tin", "Đang Update bom tính báo giá", "success");
      }
    });
  };

  // Lưu BOM Sản Xuất
  const confirmSaveBOMSX = () => {
    if (bomsxtable.length === 0) {
      Swal.fire("Cảnh báo", "BOM SX phải có ít nhất 1 vật liệu", "warning");
      return;
    }
    Swal.fire({
      title: "Chắc chắn muốn lưu BOM Sản Xuất?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Lưu BOM SX",
      cancelButtonText: "Hủy",
    }).then((res) => {
      if (res.isConfirmed) {
        checkBP(userData, ["RND", "QLSX", "KD"], ["ALL"], ["ALL"], handleInsertBOMSX);
      }
    });
  };

  // Lưu BOM Giá Thành
  const confirmSaveBOMGIA = () => {
    if (bomgiatable.length === 0) {
      Swal.fire("Cảnh báo", "BOM Giá phải có ít least 1 vật liệu", "warning");
      return;
    }
    Swal.fire({
      title: "Chắc chắn muốn lưu BOM Giá Thành?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Lưu BOM Giá",
      cancelButtonText: "Hủy",
    }).then((res) => {
      if (res.isConfirmed) {
        checkBP(userData, ["RND", "QLSX", "KD"], ["ALL"], ["ALL"], handleInsertBOMGIA);
      }
    });
  };

  // Clone BOMSX sang BOM Giá
  const handleCloneBOMSX = () => {
    if (bomsxtable.length === 0) {
      Swal.fire("Thông báo", "Không có BOM SX để Clone", "warning");
      return;
    }
    const cloned: BOM_GIA[] = bomsxtable.map((item, idx) => ({
      id: moment().format("YYYY-MM-DD HH:mm:ss.SSS") + item.M_CODE + idx,
      BOM_ID: moment().format("YYYY-MM-DD HH:mm:ss.SSS") + item.M_CODE + idx,
      G_CODE: codefullinfo.G_CODE,
      RIV_NO: "A",
      G_SEQ: zeroPad(idx + 1, 3),
      CATEGORY: 1,
      M_CODE: item.M_CODE,
      M_NAME: item.M_NAME,
      CUST_CD: "",
      IMPORT_CAT: "",
      M_CMS_PRICE: 0,
      M_SS_PRICE: 0,
      M_SLITTING_PRICE: 0,
      USAGE: idx === 0 ? "main" : "sub",
      MAIN_M: idx === 0 ? 1 : 0,
      MAT_MASTER_WIDTH: 0,
      MAT_CUTWIDTH: item.WIDTH_CD,
      MAT_ROLL_LENGTH: 0,
      MAT_THICKNESS: 0,
      M_QTY: 1,
      REMARK: "",
      PROCESS_ORDER: idx + 1,
      INS_EMPL: userData?.EMPL_NO,
      INS_DATE: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      UPD_EMPL: userData?.EMPL_NO,
      UPD_DATE: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
    }));
    setBOMGIATable(cloned);
    Swal.fire("Thành công", `Đã Clone ${cloned.length} NVL sang BOM Giá!`, "success");
  };

  // Thêm/Xóa dòng BOMSX
  const handleAddRowBOMSX = () => {
    const newRow: BOM_SX = {
      id: String(bomsxtable.length + 1),
      G_CODE: codefullinfo.G_CODE,
      M_CODE: selectedMaterial?.M_CODE ?? "",
      M_NAME: selectedMaterial?.M_NAME ?? "",
      WIDTH_CD: selectedMaterial?.WIDTH_CD ?? 0,
      M_QTY: 1,
      MAIN_M: "N",
      LIEUQL_SX: 0,
      INS_EMPL: userData?.EMPL_NO,
      INS_DATE: moment().format("YYYY-MM-DD HH:mm:ss"),
      UPD_EMPL: userData?.EMPL_NO,
      UPD_DATE: moment().format("YYYY-MM-DD HH:mm:ss"),
    };
    setBOMSXTable([...bomsxtable, newRow]);
  };

  const handleDeleteRowBOMSX = () => {
    const selected = bomsxSelectedRows.current;
    if (!selected || selected.length === 0) {
      Swal.fire("Thông báo", "Vui lòng chọn dòng cần xóa", "info");
      return;
    }
    const filtered = bomsxtable.filter((row) => !selected.includes(row));
    setBOMSXTable(filtered);
  };

  // Thêm/Xóa dòng BOM Giá
  const handleAddRowBOMGIA = () => {
    const newRow: BOM_GIA = {
      id: String(bomgiatable.length + 1),
      BOM_ID: moment().format("YYYYMMDDHHmmss"),
      G_CODE: codefullinfo.G_CODE,
      RIV_NO: "A",
      G_SEQ: zeroPad(bomgiatable.length + 1, 3),
      CATEGORY: 1,
      M_CODE: selectedMaterial?.M_CODE ?? "",
      M_NAME: selectedMaterial?.M_NAME ?? "",
      CUST_CD: "",
      IMPORT_CAT: "",
      M_CMS_PRICE: 0,
      M_SS_PRICE: 0,
      M_SLITTING_PRICE: 0,
      USAGE: "",
      MAIN_M: 0,
      MAT_MASTER_WIDTH: 0,
      MAT_CUTWIDTH: selectedMaterial?.WIDTH_CD ?? 0,
      MAT_ROLL_LENGTH: 0,
      MAT_THICKNESS: 0,
      M_QTY: 1,
      REMARK: "",
      PROCESS_ORDER: bomgiatable.length + 1,
      INS_EMPL: userData?.EMPL_NO,
      INS_DATE: moment().format("YYYY-MM-DD HH:mm:ss"),
      UPD_EMPL: userData?.EMPL_NO,
      UPD_DATE: moment().format("YYYY-MM-DD HH:mm:ss"),
    };
    setBOMGIATable([...bomgiatable, newRow]);
  };

  const handleDeleteRowBOMGIA = () => {
    const selected = bomgiaSelectedRows.current;
    if (!selected || selected.length === 0) {
      Swal.fire("Thông báo", "Vui lòng chọn dòng cần xóa", "info");
      return;
    }
    const filtered = bomgiatable.filter((row) => !selected.includes(row));
    setBOMGIATable(filtered);
  };

  // Thêm công đoạn máy
  const handleAddProcess = () => {
    if (!codefullinfo.G_CODE || codefullinfo.G_CODE === "-------") {
      Swal.fire("Thông báo", "Vui lòng chọn sản phẩm", "error");
      return;
    }
    let nextProcessNo = 1;
    if (currentProcessList.length > 0) {
      nextProcessNo = Math.max(...currentProcessList.map((item) => item.PROCESS_NUMBER)) + 1;
    }
    const tempProcess: PROD_PROCESS_DATA = {
      G_CODE: codefullinfo.G_CODE,
      PROCESS_NUMBER: nextProcessNo,
      EQ_SERIES: tempSelectedMachine,
      SETTING_TIME: 0,
      UPH: 0,
      STEP: 0,
      LOSS_SX: 0,
      LOSS_SETTING: 0,
      INS_DATE: "",
      INS_EMPL: "",
      UPD_DATE: "",
      UPD_EMPL: "",
      FACTORY: "NM1",
    };
    setCurrentProcessList([...currentProcessList, tempProcess]);
  };

  // Xóa công đoạn máy
  const handleDeleteProcess = () => {
    if (!tempSelectedProcess.current) {
      Swal.fire("Thông báo", "Vui lòng chọn công đoạn cần xóa", "info");
      return;
    }
    setCurrentProcessList(
      currentProcessList.filter(
        (item) => item.PROCESS_NUMBER !== tempSelectedProcess.current.PROCESS_NUMBER
      )
    );
  };

  // Lưu công đoạn máy
  const handleSaveProcess = async () => {
    if (!(await f_checkEQ_SERIES_Exist_In_EQ_SERIES_LIST(currentProcessList, machineList))) {
      Swal.fire("Thông báo", "Máy không tồn tại, vui lòng sửa lại", "error");
      return;
    }
    if (!(await f_checkProcessNumberContinuos(currentProcessList))) {
      Swal.fire("Thông báo", "Số thứ tự các công đoạn sản xuất không liên tục, vui lòng sửa lại", "error");
      return;
    }
    Swal.fire({
      title: "Cập nhật công đoạn",
      text: "Đang cập nhật, hãy chờ chút",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      showConfirmButton: false,
    });
    try {
      if (currentProcessList.length > 0) {
        await f_deleteProcessNotInCurrentListFromDataBase(currentProcessList);
      } else {
        await f_deleteProdProcessData({ G_CODE: codefullinfo.G_CODE });
      }
      await f_addProcessDataTotal(currentProcessList);
      loadProcessList(codefullinfo.G_CODE);
      Swal.fire("Thành công", "Đã lưu công đoạn sản xuất thành công!", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Lỗi", "Không thể lưu công đoạn", "error");
    }
  };

  // Reset Bản vẽ CAD
  const confirmResetBanVe = () => {
    Swal.fire({
      title: "Chắc chắn muốn Reset Bản vẽ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Reset",
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await generalQuery("resetBanVe", { G_CODE: codefullinfo.G_CODE, BANVE_Y_N: "N" });
          Swal.fire("Thành công", "Đã Reset bản vẽ thành công", "success");
        } catch (err) {
          console.error(err);
        }
      }
    });
  };

  // Upload CAD PDF & AppSheet
  const handleUploadCAD = (e: any) => {
    const file = e.target.files?.[0];
    if (file && codefullinfo.G_CODE) {
      checkBP(userData, ["RND", "KD"], ["ALL"], ["ALL"], async () => {
        const res = await uploadQuery(file, `${codefullinfo.G_CODE}.pdf`, "banve");
        if (res.data.tk_status !== "NG") {
          Swal.fire("Thành công", "Đã upload bản vẽ CAD PDF!", "success");
        } else {
          Swal.fire("Lỗi", "Upload bản vẽ thất bại", "error");
        }
      });
    }
  };

  const handleUploadAppsheet = (e: any) => {
    const file = e.target.files?.[0];
    if (file && codefullinfo.G_CODE) {
      checkBP(userData, ["RND", "KD"], ["ALL"], ["ALL"], async () => {
        const res = await uploadQuery(file, `Appsheet_${codefullinfo.G_CODE}.docx`, "appsheet");
        if (res.data.tk_status !== "NG") {
          Swal.fire("Thành công", "Đã upload Appsheet docx!", "success");
        } else {
          Swal.fire("Lỗi", "Upload Appsheet thất bại", "error");
        }
      });
    }
  };

  return {
    confirmAddNewCode,
    confirmAddNewVer,
    confirmUpdateCode,
    confirmSaveBOMSX,
    confirmSaveBOMGIA,
    handleCloneBOMSX,
    handleAddRowBOMSX,
    handleDeleteRowBOMSX,
    handleAddRowBOMGIA,
    handleDeleteRowBOMGIA,
    handleAddProcess,
    handleDeleteProcess,
    handleSaveProcess,
    confirmResetBanVe,
    handleUploadCAD,
    handleUploadAppsheet,
  };
};

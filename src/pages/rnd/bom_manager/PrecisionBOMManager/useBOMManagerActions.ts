import React from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { generalQuery, getCompany, getUserData, uploadQuery } from "../../../../api/Api";
import { checkBP } from "../../../../api/services/permissionService";
import { zeroPad } from "../../../../api/services/utilService";
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
  currentProcessList,
  setCurrentProcessList,
  tempSelectedMachine,
  tempSelectedProcess,
  machineList,
  loadProcessList,
}: UseBOMManagerActionsProps) => {
  const userData = getUserData();

  // Kiểm tra tính hợp lệ của mã
  const checkCodeValid = (code: CODE_FULL_INFO) => {
    if (getCompany() !== "CMS" && userData?.MAINDEPTNAME === "KD") {
      return true;
    }
    const abc: any = code;
    for (const [k, v] of Object.entries(abc)) {
      if (
        (v === null || v === "") &&
        !["REMK", "FACTORY", "Setting1", "Setting2", "Setting3", "Setting4", "UPH1", "UPH2", "UPH3", "UPH4", "Step1", "Step2", "Step3", "Step4", "LOSS_SX1", "LOSS_SX2", "LOSS_SX3", "LOSS_SX4", "LOSS_SETTING1", "LOSS_SETTING2", "LOSS_SETTING3", "LOSS_SETTING4", "LOSS_ST_SX1", "LOSS_ST_SX2", "LOSS_ST_SX3", "LOSS_ST_SX4", "NOTE", "EQ3", "EQ4"].includes(k)
      ) {
        return false;
      }
    }
    return true;
  };

  // Thêm mã mới
  const handleAddNewCode = async () => {
    if (!checkCodeValid(codefullinfo)) {
      Swal.fire("Lỗi", "Vui lòng điền đầy đủ các thông tin cần thiết", "error");
      return;
    }

    try {
      let CODE_27 = "C";
      if (
        codefullinfo.PROD_TYPE.trim() === "TSP" ||
        codefullinfo.PROD_TYPE.trim() === "OLED" ||
        codefullinfo.PROD_TYPE.trim() === "UV"
      ) {
        CODE_27 = "C";
      } else if (codefullinfo.PROD_TYPE.trim() === "TAPE") {
        CODE_27 = "T";
      } else if (codefullinfo.PROD_TYPE.trim() === "LABEL") {
        CODE_27 = "L";
      } else if (codefullinfo.PROD_TYPE.trim() === "RIBBON") {
        CODE_27 = "R";
      } else if (codefullinfo.PROD_TYPE.trim() === "SPT") {
        CODE_27 = "S";
      }

      const maxRes = await generalQuery("checkmaxG_CODE", {
        PROD_PROJECT: codefullinfo.PROD_PROJECT,
        PROD_MODEL: codefullinfo.PROD_MODEL,
        CODE_12: codefullinfo.CODE_12,
      });

      if (maxRes.data.tk_status !== "NG") {
        const max_seq: number = maxRes.data.data[0].MAX_SEQ;
        const current_seq: number = max_seq + 1;
        const max_g_code = `${codefullinfo.CODE_12}${CODE_27}${zeroPad(current_seq, 5)}A`;

        const insertRes = await generalQuery("insertCodeInfo", {
          ...codefullinfo,
          G_CODE: max_g_code,
          CODE_27,
          SEQ_NO: current_seq,
          REV_NO: "A",
          DEFAULT_DM: defaultDM,
        });

        if (insertRes.data.tk_status === "OK") {
          Swal.fire("Thành công", `Đã thêm mã mới: ${max_g_code}`, "success");
          handleCODEINFO();
          handleSelectCode(max_g_code);
        } else {
          Swal.fire("Thất bại", insertRes.data.message || "Lỗi khi thêm mã", "error");
        }
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
      const currentRev =
        codefullinfo.G_CODE && codefullinfo.G_CODE.length >= 8
          ? codefullinfo.G_CODE.substring(7, 8)
          : "A";
      const nextRev = String.fromCharCode(currentRev.charCodeAt(0) + 1);
      const res = await generalQuery("insertCodeInfo", {
        ...codefullinfo,
        REV_NO: nextRev,
        DEFAULT_DM: defaultDM,
      });

      if (res.data.tk_status === "OK") {
        Swal.fire("Thành công", `Đã thêm phiên bản mới: Rev.${nextRev}`, "success");
        handleCODEINFO();
      } else {
        Swal.fire("Thất bại", res.data.message || "Lỗi tạo phiên bản mới", "error");
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
    try {
      const res = await generalQuery("updateCodeInfo", codefullinfo);
      if (res.data.tk_status === "OK") {
        Swal.fire("Thành công", "Đã cập nhật thông tin mã!", "success");
        handleCODEINFO();
      } else {
        Swal.fire("Thất bại", res.data.message || "Lỗi cập nhật mã", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Lỗi", "Không thể cập nhật thông tin mã", "error");
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
        checkBP(userData, ["RND", "QLSX", "KD"], ["ALL"], ["ALL"], async () => {
          try {
            await generalQuery("deleteM140", { G_CODE: codefullinfo.G_CODE });
            for (let i = 0; i < bomsxtable.length; i++) {
              await generalQuery("insertBOMSX", {
                ...bomsxtable[i],
                G_CODE: codefullinfo.G_CODE,
                G_SEQ: zeroPad(i + 1, 3),
              });
            }
            Swal.fire("Thành công", "Đã lưu BOM Sản Xuất thành công!", "success");
          } catch (err) {
            console.error(err);
            Swal.fire("Lỗi", "Không thể lưu BOM Sản Xuất", "error");
          }
        });
      }
    });
  };

  // Lưu BOM Giá Thành
  const confirmSaveBOMGIA = () => {
    if (bomgiatable.length === 0) {
      Swal.fire("Cảnh báo", "BOM Giá phải có ít nhất 1 vật liệu", "warning");
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
        checkBP(userData, ["RND", "QLSX", "KD"], ["ALL"], ["ALL"], async () => {
          try {
            await generalQuery("deleteM140Gia", { G_CODE: codefullinfo.G_CODE });
            for (let i = 0; i < bomgiatable.length; i++) {
              await generalQuery("insertBOMGIA", {
                ...bomgiatable[i],
                G_CODE: codefullinfo.G_CODE,
                G_SEQ: zeroPad(i + 1, 3),
              });
            }
            Swal.fire("Thành công", "Đã lưu BOM Giá Thành thành công!", "success");
          } catch (err) {
            console.error(err);
            Swal.fire("Lỗi", "Không thể lưu BOM Giá Thành", "error");
          }
        });
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

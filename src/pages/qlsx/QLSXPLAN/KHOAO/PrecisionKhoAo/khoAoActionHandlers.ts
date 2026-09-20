import moment from "moment";
import Swal from "sweetalert2";
import { UserData } from "../../../../../api/GlobalInterface";
import { checkBP } from "../../../../../api/services/permissionService";
import { datediff } from "../../../../kinhdoanh/utils/kdUtils";
import { TONLIEUXUONG } from "../../interfaces/khsxInterface";
import {
  checkPLAN_ID,
  f_anrackhoao,
  f_checkMlotTonKhoAo,
  f_checkNextPlanFSC,
  f_checkNhapKhoTPDuHayChua,
  f_checktontaiMlotPlanIdSuDung,
  f_delete_IN_KHO_AO,
  f_delete_OUT_KHO_AO,
  f_is2MCODE_IN_KHO_AO,
  f_isExistM_LOT_NO_QTY_P500,
  f_isM_CODE_CHITHI,
  f_isM_LOT_NO_in_P500,
  f_isNextPlanClosed,
  f_set_YN_KHO_AO_INPUT,
  f_xuatkhoao,
} from "../../utils/khsxUtils";

interface XuatKhoAoParams {
  nextPlan: string;
  selectedRows: TONLIEUXUONG[];
  userData: UserData | undefined;
  activeTab: string;
  onSuccess: () => void;
  onReload: () => void;
}

export const handleXuatKhoAoAction = ({
  nextPlan,
  selectedRows,
  userData,
  activeTab,
  onSuccess,
  onReload,
}: XuatKhoAoParams) => {
  if (activeTab !== "TON") {
    Swal.fire("Thông báo", "Đang không ở tab Tồn Kho SX Main", "error");
    return;
  }

  const execute = async () => {
    if (!nextPlan) {
      Swal.fire("Thông báo", "Chưa nhập NEXT PLAN", "error");
      return;
    }
    const checkPlanID = await checkPLAN_ID(nextPlan);
    if (checkPlanID.length === 0) {
      Swal.fire("Thông báo", "Không tìm thấy plan ID", "error");
      return;
    }
    if (selectedRows.length === 0) {
      Swal.fire("Thông báo", "Chọn ít nhất 1 cuộn liệu để xuất kho", "error");
      return;
    }

    let err_code = "0";

    for (let i = 0; i < selectedRows.length; i++) {
      const row = selectedRows[i];
      const isFactoryMatched = checkPlanID[0].PLAN_FACTORY === row.FACTORY;
      const checkYCSX_USE_YN = await f_checkNhapKhoTPDuHayChua(nextPlan);
      const checktontaixuatkhoao = await f_checktontaiMlotPlanIdSuDung(nextPlan, row.M_LOT_NO);
      const checklieuchithi = await f_isM_CODE_CHITHI(nextPlan, row.M_CODE);
      const isTonKhoAoMLOTNO = await f_checkMlotTonKhoAo(row.M_LOT_NO);
      const checkNextPlanClosed = await f_isNextPlanClosed(nextPlan);
      const isMLOTNO_INPUT_QTY_P500 = await f_isExistM_LOT_NO_QTY_P500(row.M_LOT_NO, row.TOTAL_IN_QTY);
      const checkFSC = (await f_checkNextPlanFSC(nextPlan)).FSC;

      const date1 = moment.utc().format("YYYY-MM-DD");
      const date2 = row.INS_DATE;
      let diff = datediff(date1, date2);
      const ins_weekday = moment.utc(date2).weekday();
      if (ins_weekday >= 5) diff -= 2;
      const isExpired = diff > 1;

      if (
        checklieuchithi === true &&
        nextPlan !== row.PLAN_ID_INPUT &&
        checkFSC === row.FSC &&
        checktontaixuatkhoao &&
        checkYCSX_USE_YN === "Y" &&
        !checkNextPlanClosed &&
        isTonKhoAoMLOTNO &&
        !isExpired &&
        !isMLOTNO_INPUT_QTY_P500 &&
        isFactoryMatched
      ) {
        const outSuccess = await f_xuatkhoao({
          FACTORY: row.FACTORY,
          PHANLOAI: "N",
          PLAN_ID_INPUT: row.PLAN_ID_INPUT,
          PLAN_ID_OUTPUT: nextPlan.toUpperCase(),
          M_CODE: row.M_CODE,
          M_LOT_NO: row.M_LOT_NO,
          ROLL_QTY: row.ROLL_QTY,
          OUT_QTY: row.IN_QTY,
          TOTAL_OUT_QTY: row.TOTAL_IN_QTY,
          USE_YN: "O",
          REMARK: "WEB_OUT",
        });

        if (outSuccess) {
          const kq = await f_set_YN_KHO_AO_INPUT({
            FACTORY: row.FACTORY,
            PHANLOAI: row.PHANLOAI,
            PLAN_ID_INPUT: row.PLAN_ID_INPUT.toUpperCase(),
            PLAN_ID_SUDUNG: nextPlan.toUpperCase(),
            PLAN_ID_SUDUNG_TEST: row.PLAN_ID_SUDUNG === null ? null : row.PLAN_ID_SUDUNG.toUpperCase(),
            M_CODE: row.M_CODE.toUpperCase(),
            M_LOT_NO: row.M_LOT_NO,
            TOTAL_IN_QTY: row.TOTAL_IN_QTY,
            USE_YN: "O",
            USE_YN_TEST: row.USE_YN,
            IN_KHO_ID: row.IN_KHO_ID,
          });
          if (kq !== "") {
            err_code += "| " + kq;
          }
        }
      } else {
        if (!checklieuchithi) {
          err_code += `| Liệu: ${row.M_NAME} chưa được đăng ký xuất liệu`;
        } else if (nextPlan === row.PLAN_ID_INPUT) {
          err_code += `| Liệu: ${row.M_NAME} không thể xuất lại vào chỉ thị đã từng dùng nó`;
        } else if (checkFSC !== row.FSC) {
          err_code += `| Liệu: ${row.M_NAME} không cùng trạng thái liệu FSC với code được chỉ thị vào`;
        } else if (!checktontaixuatkhoao) {
          err_code += `| Liệu: ${row.M_NAME} đã được xuất vào chỉ thị ${nextPlan} rồi`;
        } else if (checkYCSX_USE_YN !== "Y") {
          err_code += `| YCSX đã nhập kho đủ, không thể input liệu để chạy nữa!`;
        } else if (checkNextPlanClosed === true) {
          err_code += `| Chỉ thị next đã chốt báo cáo, không thể input liệu!`;
        } else if (!isTonKhoAoMLOTNO) {
          err_code += `| Cuộn liệu đã được sử dụng!`;
        } else if (isExpired) {
          err_code += `| Cuộn liệu tồn quá lâu, hãy trả Kho NVL rồi sử dụng!`;
        } else if (isMLOTNO_INPUT_QTY_P500) {
          err_code += `| Cuộn liệu đã được sử dụng rồi, không thể next, báo admin!`;
        } else if (!isFactoryMatched) {
          err_code += `| Liệu: ${row.M_NAME} không cùng factory với code được chỉ thị vào`;
        }
      }
    }

    if (err_code !== "0") {
      Swal.fire("Thông báo", "Có lỗi: " + err_code, "error");
      onReload();
    } else {
      Swal.fire("Thông báo", "Xuất Next Kho SX Main thành công!", "success");
      onSuccess();
    }
  };

  checkBP(userData, ["QLSX"], ["ALL"], ["ALL"], execute);
};

interface AdminActionParams {
  selectedRows: TONLIEUXUONG[];
  userData: UserData | undefined;
  activeTab: string;
  onSuccess: () => void;
  onReload: () => void;
}

export const handleXoaRacAction = async ({
  selectedRows,
  userData,
  activeTab,
  onReload,
}: AdminActionParams) => {
  // Chỉ cho phép xóa rác khi đang ở tab Tồn Kho SX Main, tránh xóa nhầm
  // dữ liệu đang chọn ở tab Lịch Sử Nhập / Lịch Sử Xuất.
  if (activeTab !== "TON") {
    Swal.fire("Thông báo", "Chỉ có thể Xóa Rác khi đang ở tab Tồn Kho SX Main", "error");
    return;
  }

  const { value: pass1 } = await Swal.fire({
    title: "Xác nhận xóa rác",
    input: "password",
    inputLabel: "Nhập mật mã quản trị",
    inputPlaceholder: "Mật mã",
    showCancelButton: true,
    confirmButtonText: "Xác nhận",
    cancelButtonText: "Hủy",
  });

  if (
    pass1 === "quantrisanxuat2023" &&
    (userData?.EMPL_NO === "DTL1906" ||
      userData?.EMPL_NO === "THU1402" ||
      userData?.EMPL_NO === "NHU1903")
  ) {
    Swal.fire({
      title: "Chắc chắn muốn Xóa liệu đã chọn?",
      text: "Sẽ bắt đầu Xóa vĩnh viễn liệu khỏi kho ảo sàn máy",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Vẫn Xóa!",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        checkBP(userData, ["SX"], ["ALL"], ["ALL"], async () => {
          if (selectedRows.length === 0) {
            Swal.fire("Thông báo", "Chọn ít nhất 1 liệu để xóa", "error");
            return;
          }
          let err_code = "0";
          for (let i = 0; i < selectedRows.length; i++) {
            const row = selectedRows[i];
            const check_2_m_code = await f_is2MCODE_IN_KHO_AO(row.PLAN_ID_INPUT);
            const check_m_lot_p500 = await f_isM_LOT_NO_in_P500(row.PLAN_ID_INPUT, row.M_LOT_NO);

            if (check_2_m_code && !check_m_lot_p500) {
              await f_delete_IN_KHO_AO(row.IN_KHO_ID);
              await f_delete_OUT_KHO_AO(row.PLAN_ID_INPUT, row.M_LOT_NO);
              Swal.fire("Thông báo", "Xóa Kho SX Main thành công", "success");
            } else {
              if (!check_2_m_code) {
                err_code += ` | ${row.M_LOT_NO}: Liệu chỉ có 1 liệu chính không xóa được`;
              } else if (check_m_lot_p500) {
                err_code += ` | ${row.M_LOT_NO}: Liệu đã input sx không xóa được`;
              }
            }
          }
          if (err_code !== "0") {
            Swal.fire("Thông báo", "Có lỗi: " + err_code, "error");
          }
          onReload();
        });
      }
    });
  } else {
    Swal.fire("Thông báo", "Đã nhập sai mật mã hoặc tài khoản không đủ quyền hạn!", "error");
  }
};

export const handleAnRacAction = async ({
  selectedRows,
  userData,
  activeTab,
  onSuccess,
}: AdminActionParams) => {
  // Chỉ cho phép ẩn rác khi đang ở tab Tồn Kho SX Main.
  if (activeTab !== "TON") {
    Swal.fire("Thông báo", "Chỉ có thể Ẩn Rác khi đang ở tab Tồn Kho SX Main", "error");
    return;
  }

  const { value: pass1 } = await Swal.fire({
    title: "Xác nhận ẩn rác",
    input: "password",
    inputLabel: "Nhập mật mã quản trị",
    inputPlaceholder: "Mật mã",
    showCancelButton: true,
    confirmButtonText: "Xác nhận",
    cancelButtonText: "Hủy",
  });

  if (
    pass1 === "quantrisanxuat2023" &&
    (userData?.EMPL_NO === "DTL1906" ||
      userData?.EMPL_NO === "THU1402" ||
      userData?.EMPL_NO === "NHU1903")
  ) {
    Swal.fire({
      title: "Chắc chắn muốn Ẩn liệu đã chọn?",
      text: "Sẽ bắt đầu Ẩn liệu đã chọn khỏi danh sách",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0284c7",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Vẫn Ẩn!",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        checkBP(userData, ["SX"], ["ALL"], ["ALL"], async () => {
          await f_anrackhoao(selectedRows);
          Swal.fire("Thông báo", "Đã ẩn liệu thành công", "success");
          onSuccess();
        });
      }
    });
  } else {
    Swal.fire("Thông báo", "Đã nhập sai mật mã hoặc tài khoản không đủ quyền hạn!", "error");
  }
};

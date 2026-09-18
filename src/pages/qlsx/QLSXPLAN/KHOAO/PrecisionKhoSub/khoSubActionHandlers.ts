import moment from "moment";
import Swal from "sweetalert2";
import { UserData } from "../../../../../api/GlobalInterface";
import { checkBP } from "../../../../../api/services/permissionService";
import { datediff } from "../../../../kinhdoanh/utils/kdUtils";
import { TONLIEUXUONG } from "../../interfaces/khsxInterface";
import {
  f_checkMlotTonKhoSub,
  f_checkNextPlanFSC,
  f_checkNhapKhoTPDuHayChua,
  f_checktontaiMlotPlanIdSuDung,
  f_isM_CODE_CHITHI,
  f_isNextPlanClosed,
  f_set_YN_KHO_SUB_INPUT,
} from "../../utils/khsxUtils";

interface XuatKhoSubParams {
  nextPlan: string;
  selectedRows: TONLIEUXUONG[];
  userData: UserData | undefined;
  activeTab: string;
  onSuccess: () => void;
  onReload: () => void;
}

export const handleXuatKhoSubAction = ({
  nextPlan,
  selectedRows,
  userData,
  activeTab,
  onSuccess,
  onReload,
}: XuatKhoSubParams) => {
  if (activeTab !== "TON") {
    Swal.fire("Thông báo", "Đang không ở tab Tồn Kho SX SUB", "error");
    return;
  }

  const execute = async () => {
    if (!nextPlan || nextPlan.trim() === "") {
      Swal.fire("Thông báo", "Chưa nhập NEXT PLAN", "error");
      return;
    }

    if (!selectedRows || selectedRows.length === 0) {
      Swal.fire("Thông báo", "Chọn ít nhất 1 liệu để xuất kho", "error");
      return;
    }

    let err_code = "0";

    for (let i = 0; i < selectedRows.length; i++) {
      const row = selectedRows[i];
      const checkYCSX_USE_YN: string = await f_checkNhapKhoTPDuHayChua(nextPlan);
      const checktontaikhoao: boolean = await f_checktontaiMlotPlanIdSuDung(nextPlan, row.M_LOT_NO);
      const checklieuchithi: boolean = await f_isM_CODE_CHITHI(nextPlan, row.M_CODE);
      const isTonKhoAoMLOTNO: boolean = await f_checkMlotTonKhoSub(row.M_LOT_NO);
      const checkNextPlanClosed: boolean = await f_isNextPlanClosed(nextPlan);
      const checkFSC: string = (await f_checkNextPlanFSC(nextPlan)).FSC;

      const date1 = moment.utc().format("YYYY-MM-DD");
      const date2 = row.INS_DATE;
      let diff: number = datediff(date1, date2);
      const ins_weekday = moment.utc(date2).weekday();
      if (ins_weekday >= 5) diff = diff - 2;
      const isExpired: boolean = diff > 1;

      if (
        checklieuchithi === true &&
        nextPlan !== row.PLAN_ID_INPUT &&
        checkFSC === row.FSC &&
        checktontaikhoao &&
        checkYCSX_USE_YN === "Y" &&
        !checkNextPlanClosed &&
        isTonKhoAoMLOTNO &&
        !isExpired
      ) {
        const success = await f_set_YN_KHO_SUB_INPUT({
          FACTORY: row.FACTORY,
          PHANLOAI: row.PHANLOAI,
          PLAN_ID_INPUT: row.PLAN_ID_INPUT,
          PLAN_ID_SUDUNG: nextPlan,
          M_CODE: row.M_CODE,
          M_LOT_NO: row.M_LOT_NO,
          TOTAL_IN_QTY: row.TOTAL_IN_QTY,
          USE_YN: "X",
          IN_KHO_ID: row.IN_KHO_ID,
        });

        if (!success) {
          err_code += "| Có lỗi trong quá trình set YN IN KHO SUB";
        }
      } else {
        if (!checklieuchithi) {
          err_code += `| Liệu: ${row.M_NAME} chưa được đăng ký xuất liệu`;
        } else if (nextPlan === row.PLAN_ID_INPUT) {
          err_code += `| Liệu: ${row.M_NAME} không thể xuất lại vào chỉ thị đã từng dùng nó`;
        } else if (checkFSC !== row.FSC) {
          err_code += `| Liệu: ${row.M_NAME} không cùng trạng thái liệu FSC với code được chỉ thị vào`;
        } else if (!checktontaikhoao) {
          err_code += `| Liệu: ${row.M_NAME} liệu này đã được xuất vào chỉ thị ${nextPlan} rồi, không xuất lại được nữa`;
        } else if (checkYCSX_USE_YN !== "Y") {
          err_code += `| YCSX đã nhập kho đủ, không thể input liệu để chạy nữa, chạy nữa là dư !`;
        } else if (checkNextPlanClosed === true) {
          err_code += `| Chỉ thị next đã chốt báo cáo, không thể input liệu!`;
        } else if (!isTonKhoAoMLOTNO) {
          err_code += `| Cuộn liệu đã được sử dụng!`;
        } else if (isExpired) {
          err_code += `| Cuộn liệu tồn quá lâu, hãy trả Kho NVL rồi sử dụng!`;
        }
      }
    }

    if (err_code !== "0") {
      Swal.fire("Thông báo", "Có lỗi: " + err_code, "error");
      onReload();
    } else {
      Swal.fire("Thành công", "Xuất next liệu kho Sub thành công", "success");
      onSuccess();
    }
  };

  checkBP(userData, ["QLSX"], ["ALL"], ["ALL"], execute);
};

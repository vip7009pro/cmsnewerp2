import Swal from "sweetalert2";
import { generalQuery } from "../../../../api/Api";
import { QLSXPLANDATA } from "../interfaces/khsxInterface";

const movePlans = async (
  plans: QLSXPLANDATA[],
  todate: string
): Promise<string> => {
  let err_code: string = "0";

  if (plans.length > 0) {
    for (let i = 0; i < plans.length; i++) {
      let checkplansetting: boolean = false;
      await generalQuery("checkplansetting", {
        PLAN_ID: plans[i].PLAN_ID,
      })
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            checkplansetting = true;
          } else {
            checkplansetting = false;
          }
        })
        .catch((error) => {
          console.log(error);
        });

      if (!checkplansetting) {
        await generalQuery("move_plan", {
          PLAN_ID: plans[i].PLAN_ID,
          PLAN_DATE: todate,
        })
          .then((response) => {
            if (response.data.tk_status === "NG") {
              err_code += "Lỗi: " + response.data.message + "\n";
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        err_code +=
          "Lỗi: PLAN_ID " +
          plans[i].PLAN_ID +
          " đã setting nên không di chuyển được sang ngày khác, phải chốt";
      }
    }
  } else {
    Swal.fire("Thông báo", "Chọn ít nhất một chỉ thị để di chuyển", "error");
  }

  return err_code;
};

export const planMovementService = {
  movePlans,
};

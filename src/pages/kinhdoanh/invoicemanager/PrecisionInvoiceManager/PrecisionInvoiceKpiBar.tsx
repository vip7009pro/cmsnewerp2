import React, { memo } from "react";
import { InvoiceSummaryData } from "../../interfaces/kdInterface";
import { getGlobalSetting } from "../../../../api/Api";
import { WEB_SETTING_DATA } from "../../../../api/GlobalInterface";

interface Props {
  invoiceSummary: InvoiceSummaryData;
}

/**
 * Thanh KPI giao hàng dạng compact — CHỈ render trên mobile.
 * 2 widget (số lượng đã giao + tổng tiền đã giao) nằm gọn trong 1 hàng,
 * mỗi widget 2 dòng (nhãn + giá trị) để tiết kiệm chiều cao màn hình.
 * Desktop vẫn dùng khối `stitch-inv__kpi-summary` ở đáy sidebar bộ lọc.
 */
const PrecisionInvoiceKpiBar: React.FC<Props> = ({ invoiceSummary }) => {
  const globalSetting: WEB_SETTING_DATA[] | undefined = getGlobalSetting();
  const currency =
    globalSetting?.filter((ele: WEB_SETTING_DATA) => ele.ITEM_NAME === "CURRENCY")[0]
      ?.CURRENT_VALUE ?? "USD";

  const fullAmount = invoiceSummary.total_delivered_amount.toLocaleString("en-US", {
    style: "currency",
    currency,
  });

  return (
    <div className="stitch-inv__kpi-bar">
      <div
        className="stitch-inv__kpi-chip stitch-inv__kpi-chip--emerald"
        title="Delivered QTY (Số lượng đã giao)"
      >
        <span className="stitch-inv__kpi-chip-label">Đã giao</span>
        <span className="stitch-inv__kpi-chip-value">
          {invoiceSummary.total_delivered_qty.toLocaleString("en-US")}
          <span className="stitch-inv__kpi-chip-unit">EA</span>
        </span>
      </div>

      <div
        className="stitch-inv__kpi-chip stitch-inv__kpi-chip--blue"
        title={`Delivered Amount (Tổng tiền đã giao): ${fullAmount} ${currency}`}
      >
        <span className="stitch-inv__kpi-chip-label">Tổng tiền</span>
        <span className="stitch-inv__kpi-chip-value">
          {invoiceSummary.total_delivered_amount.toLocaleString("en-US", {
            style: "currency",
            currency,
            maximumFractionDigits: 0,
          })}
          <span className="stitch-inv__kpi-chip-unit">{currency}</span>
        </span>
      </div>
    </div>
  );
};

export default memo(PrecisionInvoiceKpiBar);

import React from "react";
import { getGlobalSetting } from "../../../../api/Api";
import { WEB_SETTING_DATA } from "../../../../api/GlobalInterface";

// Tạo map cột tự động cho AG-Grid các bảng Daily/Weekly/Monthly Closing
export const buildKDClosingColumns = (rows: any[], isWeek: boolean = false) => {
  if (!rows || rows.length === 0) return [];
  const keys = Object.getOwnPropertyNames(rows[0]);
  const currency = getGlobalSetting()?.filter((ele: WEB_SETTING_DATA) => ele.ITEM_NAME === "CURRENCY")[0]?.CURRENT_VALUE ?? "USD";

  return keys.map((key) => ({
    field: key,
    headerName: key,
    width: 110,
    resizable: true,
    cellRenderer: (ele: any) => {
      const val = ele.data?.[key];
      if (["CUST_NAME_KD", "id"].includes(key)) {
        return <span>{val}</span>;
      }
      if (key === "TOTAL_AMOUNT" || key === "DELIVERED_AMOUNT") {
        return (
          <span style={{ color: ele.data?.CUST_NAME_KD === "TOTAL" ? "#16a34a" : "#0f172a", fontWeight: "bold" }}>
            {typeof val === "number" ? val.toLocaleString("en-US", { style: "currency", currency }) : val}
          </span>
        );
      }
      if (key.includes("QTY") || key === "TOTAL_QTY") {
        return (
          <span style={{ color: "#2563eb", fontWeight: isWeek ? "bold" : "normal" }}>
            {typeof val === "number" ? val.toLocaleString("en-US", { style: "decimal" }) : val}
          </span>
        );
      }
      return (
        <span style={{ color: ele.data?.CUST_NAME_KD === "TOTAL" ? "#16a34a" : "#334155", fontWeight: ele.data?.CUST_NAME_KD === "TOTAL" ? "bold" : "normal" }}>
          {typeof val === "number" ? val.toLocaleString("en-US", { style: "currency", currency }) : val}
        </span>
      );
    },
  }));
};

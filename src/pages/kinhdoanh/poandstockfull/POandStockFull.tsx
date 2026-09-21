import React from "react";
import { getCompany } from "../../../api/Api";
import MyTabs from "../../../components/MyTab/MyTab";
import { lazyComponent } from "../../../components/PivotChart/lazyOpenable";
import PrecisionPOandStockFullTab from "./PrecisionPOandStockFull/PrecisionPOandStockFullTab";
import "./POandStockFull.scss";

// ⚠️ Các tab anh em trước đây import TĨNH ⇒ vừa mở page "PO tích hợp tồn kho" đã phải tải toàn bộ
// code của 4 module nặng (AG Grid, xlsx, DevExtreme ~3,1 MB — đo bằng performance resource).
// `MyTabs` chỉ render tab đã được click (MyTab.tsx: renderedTabs[index] || activeTab === index)
// nên chuyển sang lazy: chunk chỉ tải khi user thực sự mở tab đó.
const INSPECTION = lazyComponent(() =>
  import("../../qc/inspection/INSPECTION").then((m) => m.default),
);
const KHOTP = lazyComponent(() => import("../../kho/khotp/KHOTP").then((m) => m.default));
const KHOTPNEW = lazyComponent(() =>
  import("../../kho/khotp_new/KHOTPNEW").then((m) => m.default),
);
const KHOLIEU = lazyComponent(() => import("../../kho/kholieu/KHOLIEU").then((m) => m.default));

/**
 * POandStockFull - Quản lý PO Tích Hợp Tồn Kho Toàn Diện
 * Kiến trúc Google Stitch High-Density Enterprise
 */
const POandStockFull: React.FC = () => {
  const isCMS = getCompany() === "CMS";

  return (
    <div
      className="poandstockfull"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        minHeight: 0,
        flex: "1 1 0px",
        overflow: "hidden",
      }}
    >
      <MyTabs defaultActiveTab={0}>
        {/* Tab 1: PO+TK FULL (Đã bóc tách thành module chuyên biệt Google Stitch) */}
        <MyTabs.Tab title="PO+TK FULL">
          <PrecisionPOandStockFullTab />
        </MyTabs.Tab>

        {/* Tab 2: Phòng Kiểm Tra */}
        <MyTabs.Tab title="Phòng Kiểm Tra">
          <div className="inspection" style={{ width: "100%", height: "100%", overflow: "auto" }}>
            <INSPECTION />
          </div>
        </MyTabs.Tab>

        {/* Tab 3: Kho Thành Phẩm */}
        <MyTabs.Tab title="Kho Thành Phẩm">
          <div className="inspection" style={{ width: "100%", height: "100%", overflow: "auto" }}>
            {isCMS ? <KHOTP /> : <KHOTPNEW />}
          </div>
        </MyTabs.Tab>

        {/* Tab 4: Kho Liệu */}
        <MyTabs.Tab title="Kho Liệu">
          <div className="inspection" style={{ width: "100%", height: "100%", overflow: "auto" }}>
            <KHOLIEU />
          </div>
        </MyTabs.Tab>
      </MyTabs>
    </div>
  );
};

export default React.memo(POandStockFull);

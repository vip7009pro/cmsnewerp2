import React from "react";
import { getCompany } from "../../../api/Api";
import MyTabs from "../../../components/MyTab/MyTab";
import INSPECTION from "../../qc/inspection/INSPECTION";
import KHOTP from "../../kho/khotp/KHOTP";
import KHOTPNEW from "../../kho/khotp_new/KHOTPNEW";
import KHOLIEU from "../../kho/kholieu/KHOLIEU";
import PrecisionPOandStockFullTab from "./PrecisionPOandStockFull/PrecisionPOandStockFullTab";
import "./POandStockFull.scss";

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

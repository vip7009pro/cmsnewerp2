// PrecisionTestTableMobileTabs.tsx
// Segmented switcher chọn bảng đang thao tác trên mobile (Hạng Mục ↔ Điểm Đo)

import React from "react";
import { IoFlaskOutline, IoLocateOutline } from "react-icons/io5";

export type TestTableMobilePane = "items" | "points";

interface PrecisionTestTableMobileTabsProps {
  activePane: TestTableMobilePane;
  onPaneChange: (pane: TestTableMobilePane) => void;
  itemsCount: number;
  pointsCount: number;
}

const PrecisionTestTableMobileTabs: React.FC<
  PrecisionTestTableMobileTabsProps
> = ({ activePane, onPaneChange, itemsCount, pointsCount }) => {
  return (
    <div
      className="precision-testtable__mobileTabs"
      role="tablist"
      data-purpose="mobile-pane-switcher"
    >
      <button
        type="button"
        role="tab"
        aria-selected={activePane === "items"}
        className={`mobile-tab ${
          activePane === "items" ? "mobile-tab--active" : ""
        }`}
        onClick={() => onPaneChange("items")}
        title="Xem danh mục hạng mục test"
      >
        <IoFlaskOutline size={15} />
        <span>Hạng mục</span>
        <span className="mobile-tab__badge">{itemsCount.toLocaleString("vi-VN")}</span>
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={activePane === "points"}
        className={`mobile-tab mobile-tab--indigo ${
          activePane === "points" ? "mobile-tab--active" : ""
        }`}
        onClick={() => onPaneChange("points")}
        title="Xem danh sách điểm đo của hạng mục đang chọn"
      >
        <IoLocateOutline size={15} />
        <span>Điểm đo</span>
        <span className="mobile-tab__badge">{pointsCount.toLocaleString("vi-VN")}</span>
      </button>
    </div>
  );
};

export default React.memo(PrecisionTestTableMobileTabs);

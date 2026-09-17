import React from "react";
import { ViewMode } from "./useBtpAutoData";

interface Props {
  dataLength: number;
  lastUpdated: string;
  viewMode: ViewMode;
  isLoading: boolean;
}

/**
 * Header bar công nghiệp chuẩn Google Stitch Enterprise.
 * Badge phân hệ, breadcrumb, telemetry realtime.
 */
const PrecisionBtpAutoHeader: React.FC<Props> = React.memo(
  ({ dataLength, lastUpdated, viewMode, isLoading }) => {
    return (
      <div className="precision-btpauto__header">
        <div className="precision-btpauto__headerLeft">
          <span className="precision-btpauto__headerBadge">SX PRECISION</span>
          <span className="precision-btpauto__headerTitle">
            Tra Cứu BTP (Bán Thành Phẩm)
          </span>
          <span className="precision-btpauto__headerSep" />
          <span className="precision-btpauto__headerBreadcrumb">
            Sản Xuất › <span>BTP Auto</span>
          </span>
        </div>
        <div className="precision-btpauto__headerRight">
          <span className="precision-btpauto__headerChip">
            Chế độ: <strong>{viewMode === "detail" ? "Chi Tiết" : "Tổng Hợp"}</strong>
          </span>
          <span className="precision-btpauto__headerChip">
            Dòng: <strong>{dataLength.toLocaleString("en-US")}</strong>
          </span>
          {lastUpdated && (
            <span className="precision-btpauto__headerChip">
              Cập nhật: <strong>{lastUpdated}</strong>
            </span>
          )}
          {isLoading && (
            <span className="precision-btpauto__headerChip">
              ⏳ <strong>Đang tải...</strong>
            </span>
          )}
        </div>
      </div>
    );
  }
);

PrecisionBtpAutoHeader.displayName = "PrecisionBtpAutoHeader";
export default PrecisionBtpAutoHeader;

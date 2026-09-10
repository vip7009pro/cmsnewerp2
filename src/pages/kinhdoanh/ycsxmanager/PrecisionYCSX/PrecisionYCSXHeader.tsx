import React, { memo } from "react";
import { FiPlus, FiClipboard, FiDatabase } from "react-icons/fi";
import { AiFillAmazonCircle } from "react-icons/ai";

interface Props {
  activeTab: number;
  onSelectTab: (tabIndex: number) => void;
  ycsxCount: number;
  amzCount: number;
  onOpenAddYcsxModal: () => void;
  onOpenAddAmzModal: () => void;
  isCMS: boolean;
}

const PrecisionYCSXHeader: React.FC<Props> = ({
  activeTab,
  onSelectTab,
  ycsxCount,
  amzCount,
  onOpenAddYcsxModal,
  onOpenAddAmzModal,
  isCMS,
}) => {
  return (
    <div className="precision-ycsx__header">
      {/* Sub-Tabs */}
      <div className="precision-ycsx__tabs">
        <button
          type="button"
          className={`precision-ycsx__tab ${activeTab === 0 ? "precision-ycsx__tab--active" : ""}`}
          onClick={() => onSelectTab(0)}
        >
          <FiClipboard />
          <span>1. Quản lý YCSX (YCSX Master)</span>
          <span className="precision-ycsx__tabBadge">{ycsxCount.toLocaleString("en-US")}</span>
        </button>

        {isCMS && (
          <button
            type="button"
            className={`precision-ycsx__tab ${activeTab === 1 ? "precision-ycsx__tab--active" : ""}`}
            onClick={() => onSelectTab(1)}
          >
            <FiDatabase />
            <span>2. Dữ liệu Amazon (Tra & Quản lý AMZ Data)</span>
            {amzCount > 0 && (
              <span className="precision-ycsx__tabBadge">{amzCount.toLocaleString("en-US")}</span>
            )}
          </button>
        )}
      </div>

      {/* Right Side: Telemetry + Action Buttons */}
      <div className="precision-ycsx__headerRight">
        <div className="precision-ycsx__socketStatus">
          <span className="dot" />
          <span>Sync Socket: 3007 Active</span>
        </div>

        {/* Nút Thêm YCSX */}
        <button
          type="button"
          className="precision-ycsx__toolBtn precision-ycsx__toolBtn--primary"
          onClick={onOpenAddYcsxModal}
          title="Thêm yêu cầu sản xuất mới"
        >
          <FiPlus size={14} />
          <span>+ THÊM YCSX MỚI</span>
        </button>

        {/* Nút Thêm AMZ (Hiển thị cho CMS) */}
        {isCMS && (
          <button
            type="button"
            className="precision-ycsx__toolBtn precision-ycsx__toolBtn--emerald"
            onClick={onOpenAddAmzModal}
            title="Nhập dữ liệu Amazon mới hàng loạt"
          >
            <AiFillAmazonCircle size={15} />
            <span>+ THÊM DỮ LIỆU AMZ</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default memo(PrecisionYCSXHeader);

import React, { memo } from "react";
import { FiFolder, FiZap, FiPlus } from "react-icons/fi";

interface Props {
  activeTab: number;
  onTabChange: (tab: number) => void;
  showStatusTab: boolean;
  onOpenAddModal: () => void;
  okCount: number;
  ngCount: number;
}

const PrecisionPlanHeader: React.FC<Props> = ({
  activeTab,
  onTabChange,
  showStatusTab,
  onOpenAddModal,
  okCount,
  ngCount,
}) => {
  return (
    <div className="precision-plan__header">
      {/* Sub-Tabs */}
      <div className="precision-plan__tabs">
        <button
          type="button"
          className={`precision-plan__tab ${activeTab === 0 ? "precision-plan__tab--active" : ""}`}
          onClick={() => onTabChange(0)}
        >
          <FiFolder />
          <span>Quản lý Plan</span>
        </button>

        {showStatusTab && (
          <button
            type="button"
            className={`precision-plan__tab ${activeTab === 1 ? "precision-plan__tab--active" : ""}`}
            onClick={() => onTabChange(1)}
          >
            <FiZap />
            <span>Trạng thái kiểm tra Plan (Plan Status)</span>
          </button>
        )}
      </div>

      {/* Right Side: KPI Badges + Add Button */}
      <div className="precision-plan__headerRight">
        {okCount > 0 && (
          <span className="precision-plan__kpiBadge precision-plan__kpiBadge--ok">
            Dòng OK: <strong>{okCount}</strong>
          </span>
        )}
        {ngCount > 0 && (
          <span className="precision-plan__kpiBadge precision-plan__kpiBadge--ng">
            Dòng NG: <strong>{ngCount}</strong>
          </span>
        )}

        <button
          type="button"
          className="precision-plan__addBtn"
          onClick={onOpenAddModal}
          title="Thêm kế hoạch giao hàng mới"
        >
          <FiPlus />
          <span>Thêm Plan</span>
        </button>
      </div>
    </div>
  );
};

export default memo(PrecisionPlanHeader);

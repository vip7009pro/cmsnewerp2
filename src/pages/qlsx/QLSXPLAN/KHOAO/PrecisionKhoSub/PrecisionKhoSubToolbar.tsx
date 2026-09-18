import React from "react";
import { AiOutlineSwapRight, AiOutlineReload } from "react-icons/ai";
import { BiLayer, BiImport } from "react-icons/bi";

interface PrecisionKhoSubToolbarProps {
  activeTab: "TON" | "LS_IN";
  onTabChange: (tab: "TON" | "LS_IN") => void;
  fromdate: string;
  setFromDate: (val: string) => void;
  todate: string;
  setToDate: (val: string) => void;
  factory: string;
  setFactory: (val: string) => void;
  nextPlan: string;
  setNextPlan: (val: string) => void;
  onXuatNext: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const PrecisionKhoSubToolbar: React.FC<PrecisionKhoSubToolbarProps> = ({
  activeTab,
  onTabChange,
  fromdate,
  setFromDate,
  todate,
  setToDate,
  factory,
  setFactory,
  nextPlan,
  setNextPlan,
  onXuatNext,
  onRefresh,
  isLoading,
}) => {
  return (
    <div className="precision-khosub__toolbar">
      {/* Hàng 1: Segmented Switcher & Bộ lọc cơ bản */}
      <div className="toolbar-row">
        <div className="segmented-tabs">
          <button
            type="button"
            className={`tab-btn tab-ton ${activeTab === "TON" ? "active" : ""}`}
            onClick={() => onTabChange("TON")}
            title="Xem danh sách cuộn vật tư đang tồn tại kho Sub"
          >
            <BiLayer />
            <span>TỒN KHO SUB</span>
          </button>

          <button
            type="button"
            className={`tab-btn tab-in ${activeTab === "LS_IN" ? "active" : ""}`}
            onClick={() => onTabChange("LS_IN")}
            title="Xem lịch sử nhập vật tư vào kho Sub"
          >
            <BiImport />
            <span>LỊCH SỬ NHẬP (IN)</span>
          </button>
        </div>

        <div className="filter-controls">
          <div className="filter-item">
            <label>TỪ NGÀY:</label>
            <input
              type="date"
              value={fromdate.slice(0, 10)}
              onChange={(e) => setFromDate(e.target.value)}
              disabled={activeTab === "TON"}
              title={activeTab === "TON" ? "Tồn kho chỉ xem thời điểm hiện tại" : "Chọn ngày bắt đầu"}
            />
          </div>

          <div className="filter-item">
            <label>ĐẾN NGÀY:</label>
            <input
              type="date"
              value={todate.slice(0, 10)}
              onChange={(e) => setToDate(e.target.value)}
              disabled={activeTab === "TON"}
              title={activeTab === "TON" ? "Tồn kho chỉ xem thời điểm hiện tại" : "Chọn ngày kết thúc"}
            />
          </div>

          <div className="filter-item">
            <label>FACTORY:</label>
            <select
              value={factory}
              onChange={(e) => setFactory(e.target.value)}
            >
              <option value="ALL">ALL (Tất cả)</option>
              <option value="NM1">NM1 (Nhà máy 1)</option>
              <option value="NM2">NM2 (Nhà máy 2)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Hàng 2: Thao tác xuất next & Refresh */}
      <div className="toolbar-row">
        <div className="action-group-left">
          <div className="next-plan-control">
            <label>NEXT PLAN:</label>
            <input
              type="text"
              placeholder="VD: 1234567"
              value={nextPlan}
              onChange={(e) => setNextPlan(e.target.value.toUpperCase())}
              title="Nhập mã chỉ thị sẽ tiếp nhận cuộn vật tư được chọn"
            />
          </div>

          <button
            type="button"
            className="btn-xuat-next"
            onClick={onXuatNext}
            disabled={activeTab !== "TON" || isLoading}
            title={
              activeTab !== "TON"
                ? "Chỉ có thể xuất next khi đang ở tab Tồn Kho Sub"
                : "Xuất các cuộn liệu đã tick chọn sang chỉ thị NEXT PLAN"
            }
          >
            <AiOutlineSwapRight style={{ fontSize: 14 }} />
            <span>XUẤT NEXT</span>
          </button>
        </div>

        <div className="action-group-right">
          <button
            type="button"
            className="btn-refresh"
            onClick={onRefresh}
            disabled={isLoading}
            title="Tải lại dữ liệu"
          >
            <AiOutlineReload style={{ fontSize: 12, transform: isLoading ? "rotate(180deg)" : "none", transition: "transform 0.3s" }} />
            <span>{isLoading ? "Đang tải..." : "Tải Lại"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

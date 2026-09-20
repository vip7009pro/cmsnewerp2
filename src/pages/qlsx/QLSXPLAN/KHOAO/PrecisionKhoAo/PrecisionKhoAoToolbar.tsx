import React from "react";
import { AiOutlineSwapRight, AiOutlineDelete, AiOutlineEyeInvisible, AiOutlineReload, AiOutlineLock } from "react-icons/ai";
import { BiLayer, BiImport, BiExport } from "react-icons/bi";

interface PrecisionKhoAoToolbarProps {
  activeTab: "TON" | "LS_IN" | "LS_OUT";
  onTabChange: (tab: "TON" | "LS_IN" | "LS_OUT") => void;
  fromdate: string;
  setFromDate: (val: string) => void;
  todate: string;
  setToDate: (val: string) => void;
  factory: string;
  setFactory: (val: string) => void;
  nextPlan: string;
  setNextPlan: (val: string) => void;
  onXuatNext: () => void;
  onXoaRac: () => void;
  onAnRac: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const PrecisionKhoAoToolbar: React.FC<PrecisionKhoAoToolbarProps> = ({
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
  onXoaRac,
  onAnRac,
  onRefresh,
  isLoading,
}) => {
  return (
    <div className="precision-khoao__toolbar">
      {/* Hàng 1: Segmented Switcher & Bộ lọc cơ bản */}
      <div className="toolbar-row">
        <div className="segmented-tabs">
          <button
            type="button"
            className={`tab-btn tab-ton ${activeTab === "TON" ? "active" : ""}`}
            onClick={() => onTabChange("TON")}
            title="Xem danh sách cuộn vật tư đang tồn tại sàn máy"
          >
            <BiLayer />
            <span>TỒN KHO MAIN</span>
          </button>

          <button
            type="button"
            className={`tab-btn tab-in ${activeTab === "LS_IN" ? "active" : ""}`}
            onClick={() => onTabChange("LS_IN")}
            title="Xem lịch sử nhập vật tư vào sàn máy"
          >
            <BiImport />
            <span>LỊCH SỬ NHẬP (IN)</span>
          </button>

          <button
            type="button"
            className={`tab-btn tab-out ${activeTab === "LS_OUT" ? "active" : ""}`}
            onClick={() => onTabChange("LS_OUT")}
            title="Xem lịch sử xuất vật tư tái sử dụng vào các chỉ thị"
          >
            <BiExport />
            <span>LỊCH SỬ XUẤT (OUT)</span>
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

      {/* Hàng 2: Thao tác xuất next, Quản trị rác & Refresh */}
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
                ? "Chỉ có thể xuất next khi đang ở tab Tồn Kho Main"
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
            className="btn-danger-action"
            onClick={onXoaRac}
            disabled={activeTab !== "TON" || isLoading}
            title={
              activeTab !== "TON"
                ? "Chỉ có thể Xóa Rác khi đang ở tab Tồn Kho SX Main"
                : "Xóa vĩnh viễn cuộn liệu rác đã chọn (Yêu cầu mật khẩu quản trị)"
            }
          >
            <AiOutlineLock style={{ fontSize: 12 }} />
            <AiOutlineDelete style={{ fontSize: 13 }} />
            <span>Xóa Rác</span>
          </button>

          <button
            type="button"
            className="btn-danger-action btn-danger-action--hide"
            onClick={onAnRac}
            disabled={activeTab !== "TON" || isLoading}
            title={
              activeTab !== "TON"
                ? "Chỉ có thể Ẩn Rác khi đang ở tab Tồn Kho SX Main"
                : "Ẩn cuộn liệu rác đã chọn khỏi danh sách hiển thị"
            }
          >
            <AiOutlineEyeInvisible style={{ fontSize: 13 }} />
            <span>Ẩn Rác</span>
          </button>

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

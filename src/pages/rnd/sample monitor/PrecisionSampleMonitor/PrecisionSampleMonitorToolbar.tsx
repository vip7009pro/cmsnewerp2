import React from "react";
import {
  MdAdd,
  MdSave,
  MdLock,
  MdLockOpen,
  MdRefresh,
  MdOutlineSearch,
} from "react-icons/md";
import { AiFillFileExcel } from "react-icons/ai";
import { Tooltip } from "@mui/material";
import { FullBOM } from "../../../kinhdoanh/interfaces/kdInterface";
import { StatusFilterType } from "./sampleMonitorTypes";

interface PrecisionSampleMonitorToolbarProps {
  prodRequestNo: string;
  setProdRequestNo: (val: string) => void;
  ycsxInfo: FullBOM[];
  onAddSample: () => void;
  onSaveData: () => void;
  onLockSample: (val: "Y" | "N") => void;
  onExportExcel: (type: "current" | "all") => void;
  onReload: () => void;
  userDept: string;
  statusFilter: StatusFilterType;
  setStatusFilter: (filter: StatusFilterType) => void;
  searchKeyword: string;
  setSearchKeyword: (val: string) => void;
  isLoading: boolean;
}

export const PrecisionSampleMonitorToolbar: React.FC<PrecisionSampleMonitorToolbarProps> = ({
  prodRequestNo,
  setProdRequestNo,
  ycsxInfo,
  onAddSample,
  onSaveData,
  onLockSample,
  onExportExcel,
  onReload,
  userDept,
  statusFilter,
  setStatusFilter,
  searchKeyword,
  setSearchKeyword,
  isLoading,
}) => {
  const hasYcsxInfo = ycsxInfo.length > 0;
  const firstYcsx = hasYcsxInfo ? ycsxInfo[0] : null;

  return (
    <div className="precision-sample-monitor__toolbar">
      {/* Row 1: Thêm nhanh YCSX & Cụm nút Thao Tác */}
      <div className="precision-sample-monitor__toolbarRow">
        <div className="precision-sample-monitor__quickAddArea">
          <div className="precision-sample-monitor__ycsxInputGroup">
            <label htmlFor="prodRequestInput">SỐ YCSX:</label>
            <input
              id="prodRequestInput"
              type="text"
              placeholder="VD: 1F80008"
              maxLength={7}
              value={prodRequestNo}
              onChange={(e) => setProdRequestNo(e.target.value.toUpperCase())}
            />
          </div>

          {hasYcsxInfo && firstYcsx && (
            <div className="precision-sample-monitor__ycsxPreview" title={`${firstYcsx.G_NAME_KD} | ${firstYcsx.G_NAME}`}>
              <span className="precision-sample-monitor__ycsxPreviewNameKd">{firstYcsx.G_NAME_KD}</span>
              <span>|</span>
              <span className="precision-sample-monitor__ycsxPreviewName">{firstYcsx.G_NAME}</span>
            </div>
          )}

          <Tooltip title={hasYcsxInfo ? "Bấm để thêm YCSX này vào danh sách theo dõi" : "Nhập đúng 7 ký tự YCSX trước khi thêm"}>
            <span>
              <button
                type="button"
                className="precision-sample-monitor__quickAddBtn"
                onClick={onAddSample}
                disabled={!hasYcsxInfo || isLoading}
              >
                <MdAdd size={16} />
                <span>Thêm Mẫu</span>
              </button>
            </span>
          </Tooltip>
        </div>

        <div className="precision-sample-monitor__actionButtonGroup">
          <Tooltip title={`Lưu các thay đổi tiến độ theo quyền phòng ban [${userDept || "CHUNG"}]`}>
            <button
              type="button"
              className="precision-sample-monitor__actionBtn precision-sample-monitor__actionBtn--save"
              onClick={onSaveData}
              disabled={isLoading}
            >
              <MdSave size={16} />
              <span>LƯU TIẾN ĐỘ</span>
              {userDept && <span className="precision-sample-monitor__deptTagInBtn">{userDept.toUpperCase()}</span>}
            </button>
          </Tooltip>

          <Tooltip title="Khóa các dòng mẫu đã chọn (Yêu cầu quyền Kinh Doanh)">
            <button
              type="button"
              className="precision-sample-monitor__actionBtn precision-sample-monitor__actionBtn--lock"
              onClick={() => onLockSample("N")}
              disabled={isLoading}
            >
              <MdLock size={15} />
              <span>Khóa Mẫu</span>
            </button>
          </Tooltip>

          <Tooltip title="Mở khóa các dòng mẫu đã chọn (Yêu cầu quyền Kinh Doanh)">
            <button
              type="button"
              className="precision-sample-monitor__actionBtn precision-sample-monitor__actionBtn--unlock"
              onClick={() => onLockSample("Y")}
              disabled={isLoading}
            >
              <MdLockOpen size={15} />
              <span>Mở Mẫu</span>
            </button>
          </Tooltip>

          <Tooltip title="Xuất danh sách mẫu đang lọc ra file Excel">
            <button
              type="button"
              className="precision-sample-monitor__actionBtn precision-sample-monitor__actionBtn--excel"
              onClick={() => onExportExcel("current")}
            >
              <AiFillFileExcel size={15} color="#059669" />
              <span>Xuất Đang Lọc</span>
            </button>
          </Tooltip>

          <Tooltip title="Xuất toàn bộ danh sách mẫu ra file Excel">
            <button
              type="button"
              className="precision-sample-monitor__actionBtn precision-sample-monitor__actionBtn--excel"
              onClick={() => onExportExcel("all")}
            >
              <AiFillFileExcel size={15} color="#1d4ed8" />
              <span>Xuất Tất Cả</span>
            </button>
          </Tooltip>

          <Tooltip title="Tải lại bảng dữ liệu từ máy chủ">
            <button
              type="button"
              className="precision-sample-monitor__actionBtn precision-sample-monitor__actionBtn--reload"
              onClick={onReload}
              disabled={isLoading}
            >
              <MdRefresh size={16} />
              <span>Tải Lại</span>
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Row 2: Bộ lọc nhanh Segment & Tìm kiếm */}
      <div className="precision-sample-monitor__filterRow">
        <div className="precision-sample-monitor__statusSegments">
          <button
            type="button"
            className={`precision-sample-monitor__segmentBtn ${statusFilter === "ALL" ? "is-active" : ""}`}
            onClick={() => setStatusFilter("ALL")}
          >
            Tất Cả
          </button>
          <button
            type="button"
            className={`precision-sample-monitor__segmentBtn ${statusFilter === "PENDING" ? "is-active" : ""}`}
            onClick={() => setStatusFilter("PENDING")}
          >
            Đang Xử Lý
          </button>
          <button
            type="button"
            className={`precision-sample-monitor__segmentBtn ${statusFilter === "COMPLETED" ? "is-active" : ""}`}
            onClick={() => setStatusFilter("COMPLETED")}
          >
            Đã Hoàn Thành
          </button>
          <button
            type="button"
            className={`precision-sample-monitor__segmentBtn ${statusFilter === "APPROVED" ? "is-active" : ""}`}
            onClick={() => setStatusFilter("APPROVED")}
          >
            Đã Duyệt (KH)
          </button>
          <button
            type="button"
            className={`precision-sample-monitor__segmentBtn ${statusFilter === "REJECTED" ? "is-active" : ""}`}
            onClick={() => setStatusFilter("REJECTED")}
          >
            Bị Từ Chối
          </button>
          <button
            type="button"
            className={`precision-sample-monitor__segmentBtn ${statusFilter === "LOCKED" ? "is-active" : ""}`}
            onClick={() => setStatusFilter("LOCKED")}
          >
            Bị Khóa
          </button>
        </div>

        <div className="precision-sample-monitor__searchBox">
          <MdOutlineSearch size={16} className="precision-sample-monitor__searchIcon" />
          <input
            type="text"
            placeholder="Tìm nhanh YCSX, mã hàng, khách hàng..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

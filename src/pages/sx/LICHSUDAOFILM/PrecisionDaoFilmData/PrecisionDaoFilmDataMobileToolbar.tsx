import React from "react";
import {
  FiSearch,
  FiX,
  FiFilter,
  FiDownload,
  FiPlusCircle,
  FiTag,
  FiSend,
  FiFileText,
  FiTool,
} from "react-icons/fi";
import { DaoFilmMode } from "./useDaoFilmData";

interface PrecisionDaoFilmDataMobileToolbarProps {
  mode: DaoFilmMode;
  loading: boolean;
  totalRecords: number;
  filteredRecords: number;
  searchKeyword: string;
  onSearchChange: (val: string) => void;
  onOpenFilter: () => void;
  activeFilterCount: number;
  onFetchGiaoNhan: () => void;
  onFetchQuanLy: () => void;
  onFetchLichSuXuat: () => void;
  onExportEX1: () => void;
  onExportEX2: () => void;
  onOpenGiaoNhan: () => void;
  onGanCode?: () => void;
  onXuatDaoFilm?: () => void;
}

export const PrecisionDaoFilmDataMobileToolbar: React.FC<PrecisionDaoFilmDataMobileToolbarProps> = ({
  mode,
  loading,
  totalRecords,
  filteredRecords,
  searchKeyword,
  onSearchChange,
  onOpenFilter,
  activeFilterCount,
  onFetchGiaoNhan,
  onFetchQuanLy,
  onFetchLichSuXuat,
  onExportEX1,
  onExportEX2,
  onOpenGiaoNhan,
  onGanCode,
  onXuatDaoFilm,
}) => {
  return (
    <div className="precision-df-mobile-toolbar">
      {/* Hàng 1: 3 Chế Độ Tra Cứu Chuyển Tab Cuộn Ngang */}
      <div className="toolbar-modes-row">
        <button
          type="button"
          className={`btn-mode-tab ${mode === "GIAO_NHAN" ? "btn-mode-tab--active-gn" : ""}`}
          onClick={onFetchGiaoNhan}
          disabled={loading}
          title="Tra cứu lịch sử bàn giao dao film"
        >
          <FiFileText size={12} />
          <span>GIAO NHẬN</span>
          {mode === "GIAO_NHAN" && <span className="badge-count">{totalRecords}</span>}
        </button>

        <button
          type="button"
          className={`btn-mode-tab ${mode === "QUAN_LY" ? "btn-mode-tab--active-ql" : ""}`}
          onClick={onFetchQuanLy}
          disabled={loading}
          title="Quản lý thông số & tuổi thọ khuôn dao film"
        >
          <FiTool size={12} />
          <span>QL DAO FILM</span>
          {mode === "QUAN_LY" && <span className="badge-count">{totalRecords}</span>}
        </button>

        <button
          type="button"
          className={`btn-mode-tab ${mode === "XUAT_DAO_FILM" ? "btn-mode-tab--active-xuat" : ""}`}
          onClick={onFetchLichSuXuat}
          disabled={loading}
          title="Lịch sử xuất cấp dao film vào sản xuất"
        >
          <FiSend size={12} />
          <span>XUẤT DF</span>
          {mode === "XUAT_DAO_FILM" && <span className="badge-count">{totalRecords}</span>}
        </button>
      </div>

      {/* Hàng 2: Ô Tìm Kiếm Thông Minh 14px chống zoom Safari iOS + Nút Mở Bộ Lọc */}
      <div className="toolbar-search-row">
        <div className="mobile-search-box">
          <FiSearch className="search-icon" size={14} />
          <input
            type="text"
            className="mobile-search-input"
            placeholder="Lọc mã dao, film, code KD, ERP, NV..."
            value={searchKeyword}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchKeyword && (
            <button
              type="button"
              className="btn-clear-search"
              onClick={() => onSearchChange("")}
              title="Xóa tìm kiếm"
            >
              <FiX size={12} />
            </button>
          )}
        </div>

        <button
          type="button"
          className={`btn-mobile-filter-trigger ${
            activeFilterCount > 0 ? "btn-mobile-filter-trigger--active" : ""
          }`}
          onClick={onOpenFilter}
          title="Mở bảng lọc điều kiện nâng cao"
        >
          <FiFilter size={13} />
          <span>Bộ Lọc</span>
          {activeFilterCount > 0 && (
            <span className="filter-count-badge">{activeFilterCount}</span>
          )}
        </button>
      </div>

      {/* Hàng 3: Dải Nút Thao Tác Cuộn Ngang Công Thái Học */}
      <div className="toolbar-actions-scroll">
        {/* Nút Xuất Excel EX1 */}
        <button
          type="button"
          className="btn-mobile-action btn-mobile-action--excel"
          onClick={onExportEX1}
          title="Xuất Excel danh sách đang lọc"
        >
          <FiDownload size={11} />
          <span>EX1 (Lọc)</span>
        </button>

        {/* Nút Xuất Excel EX2 */}
        <button
          type="button"
          className="btn-mobile-action btn-mobile-action--excel-all"
          onClick={onExportEX2}
          title="Xuất Excel toàn bộ dữ liệu"
        >
          <FiDownload size={11} />
          <span>EX2 (Tất cả)</span>
        </button>

        {/* Nghiệp vụ Thêm Giao Nhận / Gán Code hoặc Xuất Dao Film */}
        {mode !== "XUAT_DAO_FILM" ? (
          <>
            <button
              type="button"
              className="btn-mobile-action btn-mobile-action--gn"
              onClick={onOpenGiaoNhan}
              title="Mở thêm giao nhận dao film"
            >
              <FiPlusCircle size={11} />
              <span>Thêm GN</span>
            </button>
            <button
              type="button"
              className="btn-mobile-action btn-mobile-action--code"
              onClick={onGanCode}
              title="Gán code dao film"
            >
              <FiTag size={11} />
              <span>Gán Code</span>
            </button>
          </>
        ) : (
          <button
            type="button"
            className="btn-mobile-action btn-mobile-action--xuat"
            onClick={onXuatDaoFilm}
            title="Xuất dao film vào lệnh sản xuất"
          >
            <FiSend size={11} />
            <span>Xuất Dao Film</span>
          </button>
        )}

        {/* Badge Số Dòng */}
        <span className="mobile-rows-count">
          <strong>{filteredRecords.toLocaleString("en-US")}</strong> / {totalRecords.toLocaleString("en-US")} dòng
        </span>
      </div>
    </div>
  );
};

export default React.memo(PrecisionDaoFilmDataMobileToolbar);

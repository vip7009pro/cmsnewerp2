import React from "react";
import {
  FiSearch,
  FiDownload,
  FiPlusCircle,
  FiTag,
  FiSend,
} from "react-icons/fi";
import AGTable from "../../../../components/DataTable/AGTable";
import { DaoFilmMode } from "./useDaoFilmData";

interface PrecisionDaoFilmDataGridProps {
  mode: DaoFilmMode;
  columns: any[];
  filteredData: any[];
  totalCount: number;
  searchKeyword: string;
  onSearchChange: (val: string) => void;
  onExportEX1: () => void;
  onExportEX2: () => void;
  onOpenGiaoNhan: () => void;
  onGanCode?: () => void;
  onXuatDaoFilm?: () => void;
}

export const PrecisionDaoFilmDataGrid: React.FC<PrecisionDaoFilmDataGridProps> = React.memo(
  ({
    mode,
    columns,
    filteredData,
    totalCount,
    searchKeyword,
    onSearchChange,
    onExportEX1,
    onExportEX2,
    onOpenGiaoNhan,
    onGanCode,
    onXuatDaoFilm,
  }) => {
    return (
      <div className="precision-df-grid">
        {/* Top Quick Search & Actions Toolbar */}
        <div className="precision-df-grid__toolbar">
          <div className="precision-df-grid__toolbar-left">
            {/* Search Box */}
            <div className="precision-df-grid__search-box">
              <FiSearch size={13} color="#64748b" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Lọc nhanh mã dao, phim, mã hàng, nhân viên..."
              />
            </div>

            {/* Cụm Nút Xuất Excel */}
            <div className="precision-df-grid__actions">
              <button
                type="button"
                className="precision-df-grid__btn precision-df-grid__btn--excel"
                onClick={onExportEX1}
                title="Xuất dữ liệu đang lọc ra file Excel"
              >
                <FiDownload size={11} />
                <span>EX1</span>
                <span className="badge">Đang lọc</span>
              </button>

              <button
                type="button"
                className="precision-df-grid__btn precision-df-grid__btn--excel"
                onClick={onExportEX2}
                title="Xuất toàn bộ dữ liệu ra file Excel"
              >
                <FiDownload size={11} />
                <span>EX2</span>
                <span className="badge">Tất cả</span>
              </button>

              {/* Các Nút Hành Động Nghiệp Vụ */}
              {mode !== "XUAT_DAO_FILM" ? (
                <>
                  <button
                    type="button"
                    className="precision-df-grid__btn precision-df-grid__btn--gn"
                    onClick={onOpenGiaoNhan}
                    title="Mở giao diện thêm & quản lý bàn giao dao film"
                  >
                    <FiPlusCircle size={12} />
                    <span>Thêm Giao Nhận</span>
                  </button>

                  <button
                    type="button"
                    className="precision-df-grid__btn precision-df-grid__btn--code"
                    onClick={onGanCode}
                    title="Gán mã dao film"
                  >
                    <FiTag size={12} />
                    <span>Gán Code</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="precision-df-grid__btn precision-df-grid__btn--xuat"
                  onClick={onXuatDaoFilm}
                  title="Xuất dao film vào lệnh sản xuất"
                >
                  <FiSend size={12} />
                  <span>Xuất Dao Film</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Meta Counter */}
          <div className="precision-df-grid__toolbar-right">
            <span className="precision-df-grid__meta">
              Đang hiển thị: <strong>{(filteredData?.length ?? 0).toLocaleString("en-US")}</strong> /{" "}
              <strong>{(totalCount ?? 0).toLocaleString("en-US")}</strong> dòng
            </span>
          </div>
        </div>

        {/* AGTable Grid Body */}
        <div className="precision-df-grid__body">
          <AGTable
            columns={columns}
            data={filteredData ?? []}
            // Không truyền prop toolbar để ẩn toolbar xanh lá mặc định
          />
        </div>
      </div>
    );
  }
);

export default PrecisionDaoFilmDataGrid;

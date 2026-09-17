import React, { useMemo } from "react";
import AGTable from "../../../../components/DataTable/AGTable";
import { ExtendedTinhHinhChot } from "./useTinhHinhChotData";

interface PrecisionTinhHinhChotGridProps {
  factory: "NM1" | "NM2";
  title: string;
  data: ExtendedTinhHinhChot[];
  allData: ExtendedTinhHinhChot[];
  columns: any[];
  searchValue: string;
  onSearchChange: (val: string) => void;
  onRefresh: () => void;
  onExportExcel: (factory: "NM1" | "NM2", mode: "EX1" | "EX2") => void;
  isLoading: boolean;
}

const PrecisionTinhHinhChotGrid: React.FC<PrecisionTinhHinhChotGridProps> = ({
  factory,
  title,
  data,
  allData,
  columns,
  searchValue,
  onSearchChange,
  onRefresh,
  onExportExcel,
  isLoading,
}) => {
  // Tính toán dòng tổng cộng ghim chân bảng
  const pinnedBottomRowData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const totalCmd = data.reduce((acc, cur) => acc + (Number(cur.TOTAL) || 0), 0);
    const totalDaChot = data.reduce((acc, cur) => acc + (Number(cur.DA_CHOT) || 0), 0);
    const totalChuaChot = data.reduce((acc, cur) => acc + (Number(cur.CHUA_CHOT) || 0), 0);
    const totalDaHS = data.reduce((acc, cur) => acc + (Number(cur.DA_NHAP_HIEUSUAT) || 0), 0);
    const totalChuaHS = data.reduce((acc, cur) => acc + (Number(cur.CHUA_NHAP_HIEUSUAT) || 0), 0);

    const tlChot = totalCmd > 0 ? Math.round((totalDaChot / totalCmd) * 1000) / 10 : 0;
    const tlHS = totalCmd > 0 ? Math.round((totalDaHS / totalCmd) * 1000) / 10 : 0;

    return [
      {
        SX_DATE: "TỔNG CỘNG",
        TOTAL: totalCmd,
        DA_CHOT: totalDaChot,
        CHUA_CHOT: totalChuaChot,
        TL_CHOT: tlChot,
        DA_NHAP_HIEUSUAT: totalDaHS,
        CHUA_NHAP_HIEUSUAT: totalChuaHS,
        TL_HIEUSUAT: tlHS,
      },
    ];
  }, [data]);

  return (
    <div className="precision-thc-grid-card">
      {/* Thanh công cụ High-Density của Bảng */}
      <div className="precision-thc-grid-card__toolbar">
        <div className="toolbar-left">
          <div className="factory-title-badge">
            <span className={`dot dot--${factory.toLowerCase()}`} />
            <span className="title-text">{title}</span>
            <span className="count-badge">
              {data.length} ngày / {allData.length}
            </span>
          </div>

          {/* Ô Tìm Kiếm Nhanh */}
          <div className="search-box">
            <span className="material-symbols-outlined search-icon">search</span>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Lọc nhanh ngày, số lượng..."
            />
            {searchValue && (
              <button
                type="button"
                className="btn-clear-search"
                onClick={() => onSearchChange("")}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            )}
          </div>
        </div>

        <div className="toolbar-right">
          {/* Cụm nút xuất Excel */}
          <button
            type="button"
            className="btn-grid-action btn-grid-action--excel"
            onClick={() => onExportExcel(factory, "EX1")}
            title="Xuất file Excel danh sách đang lọc trên bảng"
          >
            <span className="material-symbols-outlined icon">description</span>
            <span>EX1</span>
            <span className="tag-filter">Lọc ({data.length})</span>
          </button>

          <button
            type="button"
            className="btn-grid-action btn-grid-action--excel-all"
            onClick={() => onExportExcel(factory, "EX2")}
            title="Xuất toàn bộ dữ liệu ra Excel"
          >
            <span className="material-symbols-outlined icon">file_download</span>
            <span>EX2</span>
            <span className="tag-all">Tất cả ({allData.length})</span>
          </button>

          {/* Nút Reload riêng cho nhà máy */}
          <button
            type="button"
            className="btn-grid-action btn-grid-action--reload"
            onClick={onRefresh}
            disabled={isLoading}
            title={`Tải lại dữ liệu ${title}`}
          >
            <span className={`material-symbols-outlined icon ${isLoading ? "spinning" : ""}`}>
              sync
            </span>
            <span>Reload</span>
          </button>
        </div>
      </div>

      {/* Thân bảng AGTable */}
      <div className="precision-thc-grid-card__body">
        <AGTable
          rowHeight={30}
          columns={columns}
          data={data}
          pinnedBottomRowData={pinnedBottomRowData}
          // BỎ hoàn toàn prop toolbar theo chuẩn Stitch High-Density
        />
      </div>
    </div>
  );
};

export default React.memo(PrecisionTinhHinhChotGrid);

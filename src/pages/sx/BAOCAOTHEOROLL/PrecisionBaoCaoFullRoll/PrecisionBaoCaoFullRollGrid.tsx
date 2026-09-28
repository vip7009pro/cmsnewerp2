import React, { useMemo } from "react";
import { FiSearch, FiFileText, FiDownload } from "react-icons/fi";
import AGTable from "../../../../components/DataTable/AGTable";
import { useAgGridApiBridge } from "../../../../components/DataTable/useAgGridApiBridge";
import { FULL_ROLL_DATA } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";
import { getBaoCaoFullRollColumns } from "./PrecisionBaoCaoFullRollColumns";

interface PrecisionBaoCaoFullRollGridProps {
  data: FULL_ROLL_DATA[];
  totalCount: number;
  searchKeyword: string;
  onSearchKeywordChange: (kw: string) => void;
  onExportEX1: (gridApi?: any) => void;
  onExportEX2: () => void;
  isMobile?: boolean;
  /** Callback nhận GridApi để EX1 xuất đúng dòng đang hiển thị. */
  onGridApiReady?: (gridApi: any) => void;
}

const PrecisionBaoCaoFullRollGrid: React.FC<PrecisionBaoCaoFullRollGridProps> = ({
  data,
  totalCount,
  searchKeyword,
  onSearchKeywordChange,
  onExportEX1,
  onExportEX2,
  isMobile = false,
  onGridApiReady,
}) => {
  const gridRef = useAgGridApiBridge(onGridApiReady);
  const columns = useMemo(() => getBaoCaoFullRollColumns(), []);

  return (
    <div className={`precision-bcfr-grid ${isMobile ? "is-mobile" : ""}`}>
      {/* Thanh công cụ bảng: Lọc nhanh + Xuất Excel (chỉ hiện trên desktop để tránh trùng toolbar mobile) */}
      {!isMobile && (
        <div className="precision-bcfr-grid__toolbar">
        <div className="precision-bcfr-grid__toolbar-left">
          <div className="precision-bcfr-grid__search-box">
            <FiSearch size={12} color="#94a3b8" />
            <input
              type="text"
              placeholder="Lọc nhanh trên dữ liệu (mã hàng, NVL, lot, chỉ thị)..."
              value={searchKeyword}
              onChange={(e) => onSearchKeywordChange(e.target.value)}
            />
          </div>

          <div className="precision-bcfr-grid__actions">
            <button
              type="button"
              className="precision-bcfr-grid__btn-action precision-bcfr-grid__btn-action--excel"
              onClick={() => onExportEX1(gridRef.current?.api)}
              title="Xuất Excel danh sách đang hiển thị theo bộ lọc tìm kiếm"
            >
              <FiFileText size={11} />
              <span>EX1</span>
              <span className="badge">Đang Lọc</span>
            </button>

            <button
              type="button"
              className="precision-bcfr-grid__btn-action precision-bcfr-grid__btn-action--excel"
              onClick={onExportEX2}
              title="Xuất Excel toàn bộ dữ liệu đã tra cứu"
            >
              <FiDownload size={11} />
              <span>EX2</span>
              <span className="badge">Tất Cả</span>
            </button>
          </div>
        </div>

        <div className="precision-bcfr-grid__meta">
          <span>
            Đang hiển thị: <strong>{data.length.toLocaleString("en-US")}</strong> / {totalCount.toLocaleString("en-US")} dòng
          </span>
        </div>
      </div>
      )}

      {/* Bảng dữ liệu AGTable */}
      <div className="precision-bcfr-grid__body">
        <AGTable
          ref={gridRef}
          showFilter={true}
          columns={columns}
          data={data}
        />
      </div>
    </div>
  );
};

export default React.memo(PrecisionBaoCaoFullRollGrid);
export { PrecisionBaoCaoFullRollGrid };

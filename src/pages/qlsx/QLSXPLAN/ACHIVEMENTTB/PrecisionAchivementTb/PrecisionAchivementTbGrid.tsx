import React, { useMemo, useState } from "react";
import { AiOutlineDownload, AiOutlineSearch } from "react-icons/ai";
import AGTable from "../../../../../components/DataTable/AGTable";
import { SX_ACHIVE_DATE } from "../../interfaces/khsxInterface";
import { getColumnAchivementTb } from "./PrecisionAchivementTbColumns";

interface PrecisionAchivementTbGridProps {
  data: SX_ACHIVE_DATE[];
  onExportEX1: (rows: SX_ACHIVE_DATE[]) => void;
  onExportEX2: (rows: SX_ACHIVE_DATE[]) => void;
}

export const PrecisionAchivementTbGrid: React.FC<
  PrecisionAchivementTbGridProps
> = ({ data, onExportEX1, onExportEX2 }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const columns = useMemo(() => getColumnAchivementTb(), []);

  // Lọc nhanh dữ liệu (không lọc dòng TOTAL nếu người dùng gõ từ khóa)
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase();
    return data.filter(
      (row) =>
        row.EQ_NAME === "TOTAL" ||
        row.EQ_NAME?.toLowerCase().includes(term) ||
        row.PROD_REQUEST_NO?.toLowerCase().includes(term) ||
        row.G_NAME_KD?.toLowerCase().includes(term) ||
        row.PLAN_TOTAL?.toString().includes(term) ||
        row.RESULT_TOTAL?.toString().includes(term)
    );
  }, [data, searchTerm]);

  return (
    <div className="precision-achivementtb__gridContainer">
      <div className="precision-achivementtb__gridToolbar">
        <div className="gridToolbar-left">
          <span className="table-title">
            BẢNG TIẾN ĐỘ SẢN LƯỢNG THEO THIẾT BỊ &amp; CA LÀM VIỆC
          </span>

          <div className="search-box">
            <AiOutlineSearch className="search-icon" />
            <input
              type="text"
              placeholder="Tìm nhanh máy, YCSX, Code KD..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid-actions">
            <button
              type="button"
              className="grid-btn grid-btn--excel"
              onClick={() => onExportEX1(filteredData)}
              title="Xuất dữ liệu đang lọc ra file Excel"
            >
              <AiOutlineDownload size={13} />
              <span>EX1</span>
              <span className="badge">Đang lọc</span>
            </button>

            <button
              type="button"
              className="grid-btn grid-btn--excel"
              onClick={() => onExportEX2(data)}
              title="Xuất toàn bộ dữ liệu ra file Excel"
            >
              <AiOutlineDownload size={13} />
              <span>EX2</span>
              <span className="badge">Tất cả</span>
            </button>
          </div>
        </div>

        <div className="gridToolbar-right">
          <span>
            Tổng số lệnh: <strong>{data.length > 0 ? data.length - 1 : 0}</strong>
          </span>
          <span>•</span>
          <span>
            Hiển thị: <strong>{filteredData.length}</strong> dòng
          </span>
        </div>
      </div>

      <div className="precision-achivementtb__gridBody">
        <AGTable
          columns={columns}
          data={filteredData}
          toolbar={<div></div>}
          rowHeight={26}
          headerHeight={28}
          showFilter={true}
        />
      </div>
    </div>
  );
};

import React, { useMemo, useState } from "react";
import { DIEMDANHFULLSUMMARY } from "../../interfaces/nhansuInterface";
import AGTable from "../../../../components/DataTable/AGTable";
import { getColumnsShiftMatrix } from "./PrecisionBaoCaoColumns";
import { BsGrid3X3Gap } from "react-icons/bs";

interface PrecisionBaoCaoShiftMatrixProps {
  data: Array<DIEMDANHFULLSUMMARY>;
  isLoading?: boolean;
}

export const PrecisionBaoCaoShiftMatrix: React.FC<PrecisionBaoCaoShiftMatrixProps> = ({
  data,
  isLoading,
}) => {
  const [keyword, setKeyword] = useState("");

  const columns = useMemo(() => getColumnsShiftMatrix(), []);

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!keyword.trim()) return data;
    const lower = keyword.toLowerCase();
    return data.filter((item) =>
      item.MAINDEPTNAME?.toLowerCase().includes(lower)
    );
  }, [data, keyword]);

  return (
    <section className="precision-baocao__card">
      <div className="precision-baocao__cardHeader">
        <div className="precision-baocao__cardTitle">
          <BsGrid3X3Gap color="#2563eb" size={16} />
          <span>Ma trận điểm danh theo Ca Kíp & Chi Tiết Nghỉ</span>
        </div>
        <span className="precision-baocao__cardMeta">
          TEAM 1 (Ngày) • TEAM 2 (Đêm) • HÀNH CHÍNH (HC)
        </span>
      </div>

      <div className="precision-baocao__gridContainer">
        <div className="precision-baocao__gridToolbar">
          <div className="precision-baocao__searchBox">
            <input
              type="text"
              placeholder="Lọc phòng ban..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <div className="precision-baocao__gridMeta">
            Hiển thị: <strong>{filteredData.length}</strong> dòng
          </div>
        </div>

        <div className="precision-baocao__gridBody" style={{ height: "350px" }}>
          <AGTable
            columns={columns}
            data={filteredData}
            rowHeight={30}
            headerHeight={28}
          />
        </div>
      </div>
    </section>
  );
};

export default PrecisionBaoCaoShiftMatrix;

import React, { useMemo, useState } from "react";
import { DiemDanhFullData } from "../../interfaces/nhansuInterface";
import AGTable from "../../../../components/DataTable/AGTable";
import { getColumnsFullInfo } from "./PrecisionBaoCaoColumns";
import { AiOutlineDatabase, AiOutlineSearch } from "react-icons/ai";
import { RiFileExcel2Line } from "react-icons/ri";
import { MdOutlinePivotTableChart } from "react-icons/md";

interface PrecisionBaoCaoFullTableProps {
  data: Array<DiemDanhFullData>;
  onExportEX1: (filteredData: Array<DiemDanhFullData>) => void;
  onExportEX2: (allData: Array<DiemDanhFullData>) => void;
  onOpenPivot: () => void;
  isLoading?: boolean;
}

export const PrecisionBaoCaoFullTable: React.FC<PrecisionBaoCaoFullTableProps> = ({
  data,
  onExportEX1,
  onExportEX2,
  onOpenPivot,
  isLoading,
}) => {
  const [keyword, setKeyword] = useState("");

  const columns = useMemo(() => getColumnsFullInfo(), []);

  // Lọc nhanh theo nhiều trường: EMPL_NO, CMS_ID, FIRST_NAME, MIDLAST_NAME, MAINDEPTNAME, SUBDEPTNAME, DATE_COLUMN
  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!keyword.trim()) return data;
    const lower = keyword.toLowerCase();
    return data.filter(
      (item) =>
        item.EMPL_NO?.toLowerCase().includes(lower) ||
        item.CMS_ID?.toLowerCase().includes(lower) ||
        item.FIRST_NAME?.toLowerCase().includes(lower) ||
        item.MIDLAST_NAME?.toLowerCase().includes(lower) ||
        item.MAINDEPTNAME?.toLowerCase().includes(lower) ||
        item.SUBDEPTNAME?.toLowerCase().includes(lower) ||
        item.DATE_COLUMN?.includes(lower)
    );
  }, [data, keyword]);

  return (
    <section className="precision-baocao__card">
      <div className="precision-baocao__cardHeader">
        <div className="precision-baocao__cardTitle">
          <AiOutlineDatabase color="#2563eb" size={17} />
          <span>Lịch sử đi làm full info (Chi tiết quẹt thẻ & điểm danh)</span>
        </div>
        <span className="precision-baocao__cardMeta">
          Toàn bộ bản ghi chấm công chi tiết
        </span>
      </div>

      <div className="precision-baocao__gridContainer">
        <div className="precision-baocao__gridToolbar">
          <div className="precision-baocao__gridToolbarLeft">
            <div className="precision-baocao__searchBox">
              <AiOutlineSearch size={14} color="#64748b" />
              <input
                type="text"
                placeholder="Tìm mã thẻ, họ tên, phòng ban..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>

            <div className="precision-baocao__gridActions">
              <button
                type="button"
                className="precision-baocao__gridBtn precision-baocao__gridBtn--excel"
                onClick={() => onExportEX1(filteredData)}
                title="Xuất các dòng đang lọc ra file Excel"
              >
                <RiFileExcel2Line size={13} />
                <span>EX1</span>
                <span className="badge">Đang lọc</span>
              </button>

              <button
                type="button"
                className="precision-baocao__gridBtn precision-baocao__gridBtn--excel"
                onClick={() => onExportEX2(data)}
                title="Xuất toàn bộ dữ liệu bảng ra file Excel"
              >
                <RiFileExcel2Line size={13} />
                <span>EX2</span>
                <span className="badge">Tất cả</span>
              </button>

              <button
                type="button"
                className="precision-baocao__gridBtn precision-baocao__gridBtn--pivot"
                onClick={onOpenPivot}
                title="Mở ma trận phân tích dữ liệu Pivot"
              >
                <MdOutlinePivotTableChart size={14} />
                <span>PIVOT</span>
              </button>
            </div>
          </div>

          <div className="precision-baocao__gridMeta">
            Đang hiển thị: <strong>{filteredData.length.toLocaleString("vi-VN")}</strong> /{" "}
            {data.length.toLocaleString("vi-VN")} bản ghi
          </div>
        </div>

        <div className="precision-baocao__gridBody" style={{ height: "450px" }}>
          <AGTable
            columns={columns}
            data={filteredData}
            rowHeight={32}
            headerHeight={28}
          />
        </div>
      </div>
    </section>
  );
};

export default PrecisionBaoCaoFullTable;

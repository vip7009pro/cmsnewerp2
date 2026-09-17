import React, { useMemo, useState } from "react";
import { AiOutlineDownload, AiOutlineSearch } from "react-icons/ai";
import AGTable from "../../../../components/DataTable/AGTable";
import { OPERATION_TIME_DATA } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";
import { getColumnTimeEfficiencyTable } from "./PrecisionPlanResultColumns";

interface PrecisionPlanResultTimeTableProps {
  data: OPERATION_TIME_DATA[];
  onExportExcel: (rows: OPERATION_TIME_DATA[]) => void;
}

export const PrecisionPlanResultTimeTable: React.FC<
  PrecisionPlanResultTimeTableProps
> = ({ data, onExportExcel }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const columns = useMemo(() => getColumnTimeEfficiencyTable(), []);

  // Lọc nhanh dữ liệu
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase();
    return data.filter(
      (row) =>
        row.MACHINE?.toLowerCase().includes(term) ||
        row.PLAN_FACTORY?.toLowerCase().includes(term) ||
        row.TOTAL_TIME?.toString().includes(term)
    );
  }, [data, searchTerm]);

  return (
    <div className="precision-planresult__gridContainer">
      <div className="precision-planresult__gridToolbar">
        <div className="gridToolbar-left">
          <span className="table-title">
            2. CHI TIẾT THỜI GIAN VẬN HÀNH &amp; HIỆU SUẤT MÁY
          </span>
          <div className="search-box">
            <AiOutlineSearch className="search-icon" />
            <input
              type="text"
              placeholder="Tìm nhanh xưởng, máy, thời gian..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="grid-actions">
            <button
              className="grid-btn grid-btn--excel"
              onClick={() => onExportExcel(filteredData)}
              title="Xuất bảng ra Excel"
            >
              <AiOutlineDownload size={13} />
              <span>XUẤT EXCEL</span>
              <span className="badge">{filteredData.length}</span>
            </button>
          </div>
        </div>

        <div className="gridToolbar-right">
          <span>
            Tổng số thiết bị: <strong>{data.length > 0 ? data.length - 1 : 0}</strong>
          </span>
          <span>•</span>
          <span>
            Hiển thị: <strong>{filteredData.length}</strong> dòng
          </span>
        </div>
      </div>

      <div className="precision-planresult__gridBody">
        <AGTable
          columns={columns}
          data={filteredData}
          toolbar={<div></div>}
          rowHeight={26}
          headerHeight={28}
        />
      </div>
    </div>
  );
};

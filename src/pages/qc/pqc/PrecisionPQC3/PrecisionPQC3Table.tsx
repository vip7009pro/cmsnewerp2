import React, { useMemo } from "react";
import AGTable from "../../../../components/DataTable/AGTable";
import { PQC1_DATA, PQC3_DATA } from "../../interfaces/qcInterface";
import { PQC3ViewMode } from "./usePQC3Data";

interface PrecisionPQC3TableProps {
  activeView: PQC3ViewMode;
  pqc3Data: Array<PQC3_DATA>;
  pqc1Data: Array<PQC1_DATA>;
  pqc3Columns: Array<any>;
  pqc1Columns: Array<any>;
  quickFilterText: string;
  onPqc3RowClick: (row: PQC3_DATA) => void;
  onPqc1RowClick: (row: PQC1_DATA) => void;
}

export const PrecisionPQC3Table: React.FC<PrecisionPQC3TableProps> = ({
  activeView,
  pqc3Data,
  pqc1Data,
  pqc3Columns,
  pqc1Columns,
  quickFilterText,
  onPqc3RowClick,
  onPqc1RowClick,
}) => {
  // Lọc dữ liệu PQC3 theo quick filter
  const filteredPqc3Data = useMemo(() => {
    if (!quickFilterText || quickFilterText.trim() === "") return pqc3Data;
    const q = quickFilterText.toLowerCase().trim();
    return pqc3Data.filter((row) =>
      Object.values(row).some(
        (val) => val !== null && val !== undefined && String(val).toLowerCase().includes(q)
      )
    );
  }, [pqc3Data, quickFilterText]);

  // Lọc dữ liệu PQC1 theo quick filter
  const filteredPqc1Data = useMemo(() => {
    if (!quickFilterText || quickFilterText.trim() === "") return pqc1Data;
    const q = quickFilterText.toLowerCase().trim();
    return pqc1Data.filter((row) =>
      Object.values(row).some(
        (val) => val !== null && val !== undefined && String(val).toLowerCase().includes(q)
      )
    );
  }, [pqc1Data, quickFilterText]);

  return (
    <div
      className={`precision-pqc3-grid-container ${
        activeView === "DUAL" ? "dual-view" : ""
      }`}
    >
      {/* 1. Bảng dữ liệu sự cố lỗi PQC3 */}
      {(activeView === "DEFECT" || activeView === "DUAL") && (
        <div className="table-panel">
          {activeView === "DUAL" && (
            <div className="table-panel__header">
              <span>⚠️ BẢNG SỰ CỐ LỖI PQC3</span>
              <span className="badge-count">{filteredPqc3Data.length} dòng</span>
            </div>
          )}
          <div className="table-panel__body">
            <AGTable
              toolbar={null}
              suppressRowClickSelection={false}
              showFilter={true}
              columns={pqc3Columns}
              data={filteredPqc3Data}
              onRowClick={(params: any) => onPqc3RowClick(params.data)}
            />
          </div>
        </div>
      )}

      {/* 2. Bảng dữ liệu lô cài đặt PQC1 */}
      {(activeView === "SETTING" || activeView === "DUAL") && (
        <div className="table-panel">
          {activeView === "DUAL" && (
            <div className="table-panel__header">
              <span>⚙️ LÔ CÀI ĐẶT CÔNG ĐOẠN PQC1</span>
              <span className="badge-count">{filteredPqc1Data.length} dòng</span>
            </div>
          )}
          <div className="table-panel__body">
            <AGTable
              toolbar={null}
              suppressRowClickSelection={false}
              showFilter={true}
              columns={pqc1Columns}
              data={filteredPqc1Data}
              onRowClick={(params: any) => onPqc1RowClick(params.data)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(PrecisionPQC3Table);

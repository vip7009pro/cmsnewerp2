import React from "react";
import AGTable from "../../../../../components/DataTable/AGTable";

interface PrecisionAUDITBatchTableProps {
  columns: any[];
  data: any[];
  onCellClick: (params: any) => void;
  selectedCount: number;
}

const PrecisionAUDITBatchTable: React.FC<PrecisionAUDITBatchTableProps> = ({
  columns,
  data,
  onCellClick,
  selectedCount,
}) => {
  return (
    <div className="precision-audit__batchPanel">
      <div className="precision-audit__batchHeader">
        <div className="batch-title">
          <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#2563eb" }}>
            history
          </span>
          <span>DANH SÁCH ĐỢT AUDIT</span>
        </div>
        <span className="batch-count">{data.length} đợt</span>
      </div>

      <div className="precision-audit__batchBody">
        <AGTable
          showFilter={true}
          columns={columns}
          data={data}
          onCellClick={onCellClick}
          rowHeight={32}
        />
      </div>
    </div>
  );
};

export default React.memo(PrecisionAUDITBatchTable);

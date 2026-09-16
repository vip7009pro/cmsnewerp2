import React, { useRef } from "react";
import { ColDef, ColGroupDef } from "ag-grid-community";
import AGTable from "../../../../components/DataTable/AGTable";
import { ExtendedSampleData } from "./sampleMonitorTypes";

interface PrecisionSampleMonitorTableProps {
  data: ExtendedSampleData[];
  columns: (ColDef | ColGroupDef)[];
  onSelectionChange: (selected: ExtendedSampleData[]) => void;
  onCellClick: (row: ExtendedSampleData) => void;
  totalCount: number;
  filteredCount: number;
}

export const PrecisionSampleMonitorTable: React.FC<PrecisionSampleMonitorTableProps> = ({
  data,
  columns,
  onSelectionChange,
  onCellClick,
  totalCount,
  filteredCount,
}) => {
  const agTableRef = useRef<any>(null);

  return (
    <div className="precision-sample-monitor__gridContainer">
      <div className="precision-sample-monitor__gridToolbar">
        <span className="precision-sample-monitor__gridCount">
          Hiển thị: <strong>{filteredCount}</strong> / {totalCount} Mẫu
        </span>
        <span className="precision-sample-monitor__gridHint">
          * Tích chọn một hoặc nhiều dòng để Lưu tiến độ hoặc Khóa/Mở mẫu
        </span>
      </div>

      <div className="precision-sample-monitor__gridBody">
        <AGTable
          ref={agTableRef}
          showFilter={true}
          columns={columns}
          data={data}
          onSelectionChange={(params: any) => {
            const api = params?.api;
            if (api) {
              const selected = api.getSelectedRows() as ExtendedSampleData[];
              onSelectionChange(selected);
            }
          }}
          onCellClick={(params: any) => {
            if (params?.data) {
              onCellClick(params.data as ExtendedSampleData);
            }
          }}
        />
      </div>
    </div>
  );
};

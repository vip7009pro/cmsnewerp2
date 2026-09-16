import React from "react";
import AGTable from "../../../../../components/DataTable/AGTable";
import { AUDIT_HISTORY_DATA } from "../../../interfaces/qcInterface";

interface TableProps {
  data: AUDIT_HISTORY_DATA[];
  columns: any[];
  onCellClick?: (params: any) => void;
  onSelectionChange?: (params: any) => void;
  onCellEditingStopped?: (params: any) => void;
}

export const PrecisionAUDITHistoryTable: React.FC<TableProps> = ({
  data,
  columns,
  onCellClick,
  onSelectionChange,
  onCellEditingStopped,
}) => {
  return (
    <div className="pah-table-container">
      <div className="table-wrapper">
        <AGTable
          showFilter={true}
          toolbar={<div />}
          columns={columns}
          data={data}
          onCellEditingStopped={onCellEditingStopped || (() => {})}
          onCellClick={onCellClick || (() => {})}
          onSelectionChange={onSelectionChange || (() => {})}
        />
      </div>
    </div>
  );
};

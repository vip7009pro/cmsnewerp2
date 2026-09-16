import React from "react";
import AGTable from "../../../../../components/DataTable/AGTable";
import { DOCUMENT_DATA } from "./allDocTypes";

interface TableProps {
  data: DOCUMENT_DATA[];
  columns: any[];
  onSelectionChange: (selectedRows: DOCUMENT_DATA[]) => void;
}

export const PrecisionAllDocTable: React.FC<TableProps> = ({
  data,
  columns,
  onSelectionChange,
}) => {
  return (
    <div className="pad-table-container">
      <div className="table-wrapper">
        <AGTable
          showFilter={true}
          toolbar={<div />}
          columns={columns}
          data={data}
          rowHeight={34}
          onSelectionChange={(params: any) => {
            if (params?.api) {
              onSelectionChange(params.api.getSelectedRows());
            }
          }}
        />
      </div>
    </div>
  );
};

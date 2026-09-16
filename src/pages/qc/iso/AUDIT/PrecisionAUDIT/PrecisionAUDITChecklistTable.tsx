import React from "react";
import AGTable from "../../../../../components/DataTable/AGTable";

interface PrecisionAUDITChecklistTableProps {
  columns: any[];
  data: any[];
  onSelectionChange: (params: any) => void;
  onCellEditingStopped: (params: any) => void;
}

const PrecisionAUDITChecklistTable: React.FC<PrecisionAUDITChecklistTableProps> = ({
  columns,
  data,
  onSelectionChange,
  onCellEditingStopped,
}) => {
  return (
    <div className="precision-audit__checklistPanel">
      <div className="precision-audit__checklistBody">
        <AGTable
          suppressRowClickSelection={false}
          showFilter={true}
          columns={columns}
          data={data}
          rowHeight={46}
          onSelectionChange={onSelectionChange}
          onCellEditingStopped={onCellEditingStopped}
        />
      </div>
    </div>
  );
};

export default React.memo(PrecisionAUDITChecklistTable);

import React, { useMemo } from "react";
import AGTable from "../../../../components/DataTable/AGTable";
import { OQC_DATA } from "../../interfaces/qcInterface";

interface PrecisionOQCDataTableProps {
  columns: any[];
  data: OQC_DATA[];
  onCellClick?: (params: any) => void;
}

export const PrecisionOQCDataTable: React.FC<PrecisionOQCDataTableProps> = ({
  columns,
  data,
  onCellClick,
}) => {
  const tableContent = useMemo(() => {
    return (
      <AGTable
        suppressRowClickSelection={false}
        showFilter={true}
        toolbar={<div />}
        columns={columns}
        data={data}
        onCellClick={onCellClick}
      />
    );
  }, [columns, data, onCellClick]);

  return (
    <div className="precision-oqc-body">
      <div className="precision-oqc-table-container">
        {tableContent}
      </div>
    </div>
  );
};

export default React.memo(PrecisionOQCDataTable);

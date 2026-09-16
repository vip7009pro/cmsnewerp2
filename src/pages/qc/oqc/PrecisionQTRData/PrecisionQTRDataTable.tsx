import React, { useMemo } from "react";
import AGTable from "../../../../components/DataTable/AGTable";
import { QTR_DATA } from "../QTR_DATA";

interface PrecisionQTRDataTableProps {
  columns: any[];
  data: QTR_DATA[];
  onCellClick?: (params: any) => void;
}

export const PrecisionQTRDataTable: React.FC<PrecisionQTRDataTableProps> = ({
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
    <div className="precision-qtr-body">
      <div className="precision-qtr-table-container">
        {tableContent}
      </div>
    </div>
  );
};

export default React.memo(PrecisionQTRDataTable);

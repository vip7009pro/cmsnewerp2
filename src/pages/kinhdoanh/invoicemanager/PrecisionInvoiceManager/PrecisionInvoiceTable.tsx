import React, { useMemo, memo } from "react";
import AGTable from "../../../../components/DataTable/AGTable";

interface Props {
  columns: any[];
  data: any[];
  onRowClick: (params: any) => void;
  onSelectionChange: (params: any) => void;
}

const PrecisionInvoiceTable: React.FC<Props> = ({
  columns,
  data,
  onRowClick,
  onSelectionChange,
}) => {
  const table = useMemo(
    () => (
      <AGTable
        suppressRowClickSelection={false}
        showFilter={true}
        toolbar={<div />}
        columns={columns}
        data={data}
        onCellEditingStopped={() => {}}
        onRowClick={onRowClick}
        onSelectionChange={onSelectionChange}
      />
    ),
    [data, columns]
  );

  return <div className="stitch-inv__table-area">{table}</div>;
};

export default memo(PrecisionInvoiceTable);

import React, { useMemo } from "react";
import AGTable from "../../../../components/DataTable/AGTable";
import { HANDOVER_DATA } from "../../interfaces/rndInterface";
import { getPrecisionQLGNColumns } from "./PrecisionQLGNColumns";

interface PrecisionQLGNTableProps {
  data: HANDOVER_DATA[];
  onRowClick?: (row: HANDOVER_DATA) => void;
  gridRef: any;
}

export const PrecisionQLGNTable: React.FC<PrecisionQLGNTableProps> = ({
  data,
  onRowClick,
  gridRef,
}) => {
  const columns = useMemo(() => getPrecisionQLGNColumns(), []);

  const tableComponent = useMemo(
    () => (
      <AGTable
        ref={gridRef}
        showFilter={true}
        columns={columns}
        data={data}
        onRowClick={(params: any) => {
          if (onRowClick && params?.data) {
            onRowClick(params.data);
          }
        }}
        onSelectionChange={() => {}}
      />
    ),
    [data, columns, gridRef, onRowClick]
  );

  return <div className="precision-qlgn-table-container">{tableComponent}</div>;
};

export default React.memo(PrecisionQLGNTable);

import React, { useCallback } from "react";
import AGTable from "../../../../components/DataTable/AGTable";
import { BARCODE_DATA } from "../../interfaces/rndInterface";

interface TableProps {
  columns: any[];
  data: BARCODE_DATA[];
  onSelectRow: (row: BARCODE_DATA) => void;
}

// Callback/noop hoist ra module scope để giữ nguyên reference qua các lần render
const NOOP_SELECTION_CHANGE = () => { };
const EMPTY_TOOLBAR = <></>;

export const PrecisionProductBarcodeTable: React.FC<TableProps> = React.memo(
  ({ columns, data, onSelectRow }) => {
    const handleRowClick = useCallback(
      (params: any) => {
        if (params?.data) {
          onSelectRow(params.data);
        }
      },
      [onSelectRow]
    );

    return (
      <div className="precision-barcode__gridContainer">
        <AGTable
          suppressRowClickSelection={false}
          showFilter={true}
          rowHeight={42}
          toolbar={EMPTY_TOOLBAR}
          columns={columns}
          data={data}
          onSelectionChange={NOOP_SELECTION_CHANGE}
          onRowClick={handleRowClick}
        />
      </div>
    );
  }
);

PrecisionProductBarcodeTable.displayName = "PrecisionProductBarcodeTable";

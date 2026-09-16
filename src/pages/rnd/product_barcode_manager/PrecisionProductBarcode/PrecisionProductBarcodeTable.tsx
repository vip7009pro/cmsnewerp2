import React from "react";
import AGTable from "../../../../components/DataTable/AGTable";
import { BARCODE_DATA } from "../interfaces/rndInterface";

interface TableProps {
  columns: any[];
  data: BARCODE_DATA[];
  onSelectRow: (row: BARCODE_DATA) => void;
}

export const PrecisionProductBarcodeTable: React.FC<TableProps> = React.memo(
  ({ columns, data, onSelectRow }) => {
    return (
      <div className="precision-barcode__gridContainer">
        <AGTable
          suppressRowClickSelection={false}
          showFilter={true}
          rowHeight={42}
          toolbar={<></>}
          columns={columns}
          data={data}
          onSelectionChange={() => {}}
          onRowClick={(params: any) => {
            if (params?.data) {
              onSelectRow(params.data);
            }
          }}
        />
      </div>
    );
  }
);

PrecisionProductBarcodeTable.displayName = "PrecisionProductBarcodeTable";

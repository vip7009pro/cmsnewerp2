import React, { useMemo } from "react";
import AGTable from "../../../../components/DataTable/AGTable";
import { OQC_SHIPPING_ROW } from "./OQCShippingTypes";

interface OQCShippingTableProps {
  columns: any[];
  data: OQC_SHIPPING_ROW[];
  onCellClick?: (params: any) => void;
}

export const OQCShippingTable: React.FC<OQCShippingTableProps> = ({
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
    <div className="precision-oqc-shipping-body">
      <div className="precision-oqc-shipping-table-container">
        {tableContent}
      </div>
    </div>
  );
};

export default React.memo(OQCShippingTable);

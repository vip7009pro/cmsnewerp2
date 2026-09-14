import React, { useMemo } from "react";
import AGTable from "../../../../components/DataTable/AGTable";
import { BLOCK_DATA } from "../../interfaces/qcInterface";
import { getBlockingColumns } from "./PrecisionBLOCKColumns";

interface PrecisionBLOCKTableProps {
  data: BLOCK_DATA[];
  quickFilterText: string;
  onSelectionChange: (e: any) => void;
}

export const PrecisionBLOCKTable: React.FC<PrecisionBLOCKTableProps> = ({
  data,
  quickFilterText,
  onSelectionChange,
}) => {
  const columns = useMemo(() => getBlockingColumns(), []);

  // Filter Data by Quick Filter Text
  const filteredData = useMemo(() => {
    if (!quickFilterText.trim()) return data;
    const query = quickFilterText.toLowerCase().trim();
    return data.filter((row) => {
      return (
        row.M_LOT_NO?.toLowerCase().includes(query) ||
        row.M_NAME?.toLowerCase().includes(query) ||
        row.LOT_VENDOR?.toLowerCase().includes(query) ||
        row.DEFECT?.toLowerCase().includes(query) ||
        row.M_CODE?.toLowerCase().includes(query) ||
        row.PLAN_ID?.toLowerCase().includes(query) ||
        row.SUPPLIER?.toLowerCase().includes(query) ||
        row.MAKER?.toLowerCase().includes(query) ||
        String(row.BLOCK_ID).includes(query) ||
        String(row.NCR_ID).includes(query)
      );
    });
  }, [data, quickFilterText]);

  return (
    <div className="precision-block-grid-container">
      {/* AG-Grid Table Wrapper */}
      <div className="precision-block-table-wrapper">
        <AGTable
          columns={columns}
          data={filteredData}
          onSelectionChange={onSelectionChange}
        />
      </div>
    </div>
  );
};

import React, { useMemo } from "react";
import AGTable from "../../../../components/DataTable/AGTable";
import { HOLDING_DATA } from "../../interfaces/qcInterface";
import { getHoldingColumns } from "./PrecisionHoldingColumns";

interface PrecisionHoldingTableProps {
  data: HOLDING_DATA[];
  quickFilterText: string;
  onSelectionChange: (e: any) => void;
}

export const PrecisionHoldingTable: React.FC<PrecisionHoldingTableProps> = ({
  data,
  quickFilterText,
  onSelectionChange,
}) => {
  const columns = useMemo(() => getHoldingColumns(), []);

  // Filter Data by Quick Filter Text
  const filteredData = useMemo(() => {
    if (!quickFilterText.trim()) return data;
    const query = quickFilterText.toLowerCase().trim();
    return data.filter((row) => {
      return (
        row.M_LOT_NO?.toLowerCase().includes(query) ||
        row.M_NAME?.toLowerCase().includes(query) ||
        row.M_CODE?.toLowerCase().includes(query) ||
        row.VENDOR_LOT?.toLowerCase().includes(query) ||
        row.REASON?.toLowerCase().includes(query) ||
        row.QC_PASS?.toLowerCase().includes(query) ||
        row.FACTORY?.toLowerCase().includes(query) ||
        row.LOC_CD?.toLowerCase().includes(query) ||
        String(row.HOLD_ID ?? "").includes(query) ||
        String(row.NCR_ID ?? "").includes(query) ||
        String(row.ID ?? "").includes(query)
      );
    });
  }, [data, quickFilterText]);

  return (
    <div className="precision-holding-table-container">
      {/* AG-Grid Table Wrapper without redundant footer */}
      <div className="precision-holding-table-wrapper">
        <AGTable
          columns={columns}
          data={filteredData}
          onSelectionChange={onSelectionChange}
        />
      </div>
    </div>
  );
};

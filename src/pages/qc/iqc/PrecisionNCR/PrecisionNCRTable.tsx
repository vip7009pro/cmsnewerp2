import React, { useMemo } from "react";
import AGTable from "../../../../components/DataTable/AGTable";
import { NCR_DATA } from "../../interfaces/qcInterface";

interface PrecisionNCRTableProps {
  data: NCR_DATA[];
  columns: any[];
  quickFilterText: string;
  pendingOnly: boolean;
  onRowClick: (row: NCR_DATA) => void;
  onSelectionChange: (selected: NCR_DATA[]) => void;
}

export const PrecisionNCRTable: React.FC<PrecisionNCRTableProps> = ({
  data,
  columns,
  quickFilterText,
  pendingOnly,
  onRowClick,
  onSelectionChange,
}) => {
  // Lọc dữ liệu theo quickFilterText và pendingOnly
  const filteredData = useMemo(() => {
    let result = data;
    if (pendingOnly) {
      result = result.filter((row) => row.PROCESS_STATUS !== "Y");
    }
    if (!quickFilterText.trim()) return result;
    const q = quickFilterText.toLowerCase().trim();
    return result.filter((row) => {
      return (
        row.M_NAME?.toLowerCase().includes(q) ||
        row.M_CODE?.toLowerCase().includes(q) ||
        row.VENDOR?.toLowerCase().includes(q) ||
        row.CMS_LOT?.toLowerCase().includes(q) ||
        row.VENDOR_LOT?.toLowerCase().includes(q) ||
        row.DEFECT_TITLE?.toLowerCase().includes(q) ||
        row.DEFECT_DETAIL?.toLowerCase().includes(q) ||
        row.NCR_NO?.toLowerCase().includes(q) ||
        row.FACTORY?.toLowerCase().includes(q) ||
        row.CUST_CD?.toLowerCase().includes(q) ||
        String(row.NCR_ID ?? "").includes(q)
      );
    });
  }, [data, quickFilterText, pendingOnly]);

  return (
    <div className="precision-ncr-grid-container">
      <div className="precision-ncr-grid-wrapper">
        <AGTable
          columns={columns}
          data={filteredData}
          onRowClick={(e: any) => {
            if (e?.data) {
              onRowClick(e.data);
            }
          }}
          onSelectionChange={(e: any) => {
            const rows = e?.api?.getSelectedRows() || [];
            onSelectionChange(rows);
          }}
        />
      </div>
    </div>
  );
};

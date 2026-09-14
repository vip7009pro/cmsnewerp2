import React, { useMemo } from "react";
import AGTable from "../../../../components/DataTable/AGTable";
import { QC_FAIL_DATA } from "../../interfaces/qcInterface";
import { getFailingColumns } from "./PrecisionFailingColumns";

interface PrecisionFailingTableProps {
  data: QC_FAIL_DATA[];
  quickFilterText: string;
  onSelectionChange: (e: any) => void;
}

export const PrecisionFailingTable: React.FC<PrecisionFailingTableProps> = ({
  data,
  quickFilterText,
  onSelectionChange,
}) => {
  const columns = useMemo(() => getFailingColumns(), []);

  // Filter Data by Quick Filter Text
  const filteredData = useMemo(() => {
    if (!quickFilterText.trim()) return data;
    const query = quickFilterText.toLowerCase().trim();
    return data.filter((row) => {
      return (
        row.M_LOT_NO?.toLowerCase().includes(query) ||
        row.VENDOR_LOT?.toLowerCase().includes(query) ||
        row.PROCESS_LOT_NO?.toLowerCase().includes(query) ||
        row.M_NAME?.toLowerCase().includes(query) ||
        row.M_CODE?.toLowerCase().includes(query) ||
        row.PLAN_ID_SUDUNG?.toLowerCase().includes(query) ||
        row.G_NAME?.toLowerCase().includes(query) ||
        row.G_CODE?.toLowerCase().includes(query) ||
        row.PHANLOAI?.toLowerCase().includes(query) ||
        row.SX_DEFECT?.toLowerCase().includes(query) ||
        row.DEFECT_PHENOMENON?.toLowerCase().includes(query) ||
        row.QC_PASS?.toLowerCase().includes(query) ||
        row.IN_CUST_NAME?.toLowerCase().includes(query) ||
        row.REMARK?.toLowerCase().includes(query) ||
        String(row.FAIL_ID ?? "").includes(query) ||
        String(row.NCR_ID ?? "").includes(query)
      );
    });
  }, [data, quickFilterText]);

  return (
    <div className="precision-failing-table-container">
      {/* AGTable Wrapper without redundant footer */}
      <div className="precision-failing-table-wrapper">
        <AGTable
          columns={columns}
          data={filteredData}
          onSelectionChange={onSelectionChange}
        />
      </div>
    </div>
  );
};

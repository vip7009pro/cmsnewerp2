import React, { useMemo } from "react";
import AGTable from "../../../../components/DataTable/AGTable";

interface PrecisionPQC1TableProps {
  data: Array<any>;
  columns: Array<any>;
  quickFilterText?: string;
  onSelectionChange?: (e: any) => void;
  onCellEditingStopped?: (e: any) => void;
}

export const PrecisionPQC1Table: React.FC<PrecisionPQC1TableProps> = ({
  data,
  columns,
  quickFilterText,
  onSelectionChange,
  onCellEditingStopped,
}) => {
  const filteredData = useMemo(() => {
    if (!quickFilterText || quickFilterText.trim() === "") return data;
    const query = quickFilterText.toLowerCase().trim();
    return data.filter((row) =>
      Object.values(row).some((val) => {
        if (val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(query);
      })
    );
  }, [data, quickFilterText]);

  return (
    <div className="precision-pqc1-table">
      <AGTable
        toolbar={null}
        suppressRowClickSelection={false}
        showFilter={true}
        columns={columns}
        data={filteredData}
        onSelectionChange={onSelectionChange}
        onCellEditingStopped={onCellEditingStopped}
      />
    </div>
  );
};

export default React.memo(PrecisionPQC1Table);

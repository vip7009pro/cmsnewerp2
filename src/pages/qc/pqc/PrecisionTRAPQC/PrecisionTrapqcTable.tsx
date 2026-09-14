import React, { useMemo } from 'react';
import AGTable from '../../../../components/DataTable/AGTable';

interface PrecisionTrapqcTableProps {
  data: Array<any>;
  columns: Array<any>;
  quickFilterText?: string;
  onRowClick?: (e: any) => void;
  onSelectionChange?: (e: any) => void;
}

const PrecisionTrapqcTable: React.FC<PrecisionTrapqcTableProps> = ({
  data,
  columns,
  quickFilterText,
  onRowClick,
  onSelectionChange,
}) => {
  // Lọc nhanh client-side nếu người dùng nhập quickFilterText
  const filteredData = useMemo(() => {
    if (!quickFilterText || quickFilterText.trim() === '') return data;
    const query = quickFilterText.toLowerCase().trim();
    return data.filter((row) => {
      return Object.values(row).some((val) => {
        if (val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(query);
      });
    });
  }, [data, quickFilterText]);

  return (
    <div className="precision-trapqc-table-wrap">
      <AGTable
        toolbar={null}
        columns={columns}
        data={filteredData}
        onRowClick={onRowClick}
        onSelectionChange={onSelectionChange}
      />
    </div>
  );
};

export default React.memo(PrecisionTrapqcTable);

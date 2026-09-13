import React, { useState, useRef, useCallback, useMemo } from 'react';
import AGTable from './AGTable';
import PrecisionKDTableToolbar from '../../pages/kinhdoanh/kinhdoanhreport/PrecisionKinhDoanhReport/PrecisionKDTableToolbar';
import { SaveExcel } from '../../api/services/excelService';

interface CustomerWeeklyClosingProps {
  data: Array<any>;
  columns: Array<any>;
}

const CustomerWeeklyClosing: React.FC<CustomerWeeklyClosingProps> = ({ data, columns }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const gridRef = useRef<any>(null);

  const cleanColumns = useMemo(() => {
    return (columns || []).filter((e) => e.field !== 'id');
  }, [columns]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    if (gridRef.current?.api) {
      gridRef.current.api.setQuickFilter(value);
    }
  }, []);

  const handleExportFiltered = useCallback(() => {
    if (gridRef.current?.api) {
      const filteredRows: any[] = [];
      gridRef.current.api.forEachNodeAfterFilterAndSort((node: any) => {
        if (node.data) filteredRows.push(node.data);
      });
      SaveExcel(filteredRows.length > 0 ? filteredRows : data, 'CustomerWeeklyClosing_Filtered');
    } else {
      SaveExcel(data, 'CustomerWeeklyClosing');
    }
  }, [data]);

  const handleExportAll = useCallback(() => {
    SaveExcel(data, 'CustomerWeeklyClosing_All');
  }, [data]);

  return (
    <div className="customerdailyclosing">
      <PrecisionKDTableToolbar
        title="Customer Weekly Closing"
        totalRows={data?.length || 0}
        searchValue={searchTerm}
        onSearchChange={handleSearchChange}
        onExportFiltered={handleExportFiltered}
        onExportAll={handleExportAll}
      />
      <AGTable
        ref={gridRef}
        suppressRowClickSelection={false}
        showFilter={true}
        columns={cleanColumns}
        data={data}
        onSelectionChange={() => {}}
      />
    </div>
  );
};

export default React.memo(CustomerWeeklyClosing);
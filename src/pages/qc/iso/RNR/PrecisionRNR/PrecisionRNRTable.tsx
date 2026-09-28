import React from "react";
import AGTable from "../../../../../components/DataTable/AGTable";
import { useAgGridApiBridge } from "../../../../../components/DataTable/useAgGridApiBridge";

interface PrecisionRNRTableProps {
  columns: any[];
  data: any[];
  /** Callback nhận GridApi để EX1 xuất đúng dòng đang hiển thị. */
  onGridApiReady?: (gridApi: any) => void;
}

const PrecisionRNRTable: React.FC<PrecisionRNRTableProps> = ({
  columns,
  data,
  onGridApiReady,
}) => {
  const gridRef = useAgGridApiBridge(onGridApiReady);

  return (
    <div className="precision-rnr__gridContainer">
      <div className="precision-rnr__gridBody">
        <AGTable
          ref={gridRef}
          showFilter={true}
          columns={columns}
          data={data}
          // KHÔNG truyền prop toolbar để triệt tiêu toolbar xanh lá cũ
        />
      </div>
    </div>
  );
};

export default React.memo(PrecisionRNRTable);

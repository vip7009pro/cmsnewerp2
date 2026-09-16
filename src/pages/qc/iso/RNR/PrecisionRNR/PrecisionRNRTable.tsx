import React from "react";
import AGTable from "../../../../../components/DataTable/AGTable";

interface PrecisionRNRTableProps {
  columns: any[];
  data: any[];
}

const PrecisionRNRTable: React.FC<PrecisionRNRTableProps> = ({
  columns,
  data,
}) => {
  return (
    <div className="precision-rnr__gridContainer">
      <div className="precision-rnr__gridBody">
        <AGTable
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

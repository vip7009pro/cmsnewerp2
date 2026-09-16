import React from "react";
import AGTable from "../../../../components/DataTable/AGTable";
import { MATERIAL_STATUS } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";
import { ColDef } from "ag-grid-community";

interface PrecisionCuonLieuTableProps {
  columns: ColDef[];
  data: MATERIAL_STATUS[];
}

export const PrecisionCuonLieuTable: React.FC<PrecisionCuonLieuTableProps> = ({
  columns,
  data,
}) => {
  return (
    <div className="precision-cuonlieu__gridContainer">
      <AGTable
        suppressRowClickSelection={true}
        showFilter={true}
        columns={columns}
        data={data}
        toolbar={<></>} // Bỏ toolbar mặc định, được xử lý bởi SCSS
      />
    </div>
  );
};

export default React.memo(PrecisionCuonLieuTable);

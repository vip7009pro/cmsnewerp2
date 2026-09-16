import React from "react";
import AGTable from "../../../../components/DataTable/AGTable";
import { ColDef } from "ag-grid-community";
import { CSOptionType } from "./useCSData";

interface PrecisionCSDataTableProps {
  columns: ColDef[];
  data: any[];
  option: CSOptionType;
}

export const PrecisionCSDataTable: React.FC<PrecisionCSDataTableProps> = ({
  columns,
  data,
  option,
}) => {
  return (
    <div className="precision-cs__gridContainer">
      <AGTable
        rowHeight={option === "dataconfirm" ? 56 : 28}
        suppressRowClickSelection={false}
        showFilter={true}
        columns={columns}
        data={data}
        toolbar={<></>} // Bỏ toolbar xanh lá mặc định, SCSS ẩn .toolbar
      />
    </div>
  );
};

export default React.memo(PrecisionCSDataTable);

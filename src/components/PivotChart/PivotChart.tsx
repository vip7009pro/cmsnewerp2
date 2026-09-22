import React from "react";
import type PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";

// Theme DevExtreme đi kèm module này (thay vì import ở App.tsx) để không chặn render toàn app.
import "../../theme/devextremeTheme";

import PivotGrid, { Export, FieldChooser } from "devextreme-react/pivot-grid";
const PivotTable = ({
  datasource,
  tableID,
}: {
  datasource: PivotGridDataSource;
  tableID: string;
}) => {
  return (
    <div className="pivotdatatable">
      <PivotGrid
        id={tableID}
        dataSource={datasource}
        allowSortingBySummary={true}
        allowFiltering={true}
        showBorders={true}
        showColumnTotals={true}
        showColumnGrandTotals={true}
        showRowTotals={true}
        showRowGrandTotals={true}
        rowHeaderLayout="tree"
      >
        <FieldChooser
          enabled={true}
          height={600}
          width={600}
          allowSearch={true}
          title={"PIVOT TABLE"}
        />
        <Export enabled={true} />
      </PivotGrid>
    </div>
  );
};

export default PivotTable;

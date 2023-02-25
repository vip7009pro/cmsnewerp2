import React, { useState } from "react";
import "./CAPASX.scss";
import Paper from "@mui/material/Paper";
import {
  Grid,
  Table,
  TableHeaderRow,
  TableColumnResizing,
  Toolbar,
  TableEditRow,
  TableEditColumn,
  TableInlineCellEditing,
  DragDropProvider,
  TableColumnReordering,
} from "@devexpress/dx-react-grid-material-ui";
import { Button } from "@mui/material";
import Swal from "sweetalert2";
import {
  EditingState,
  IntegratedSorting,
  SortingState,
} from "@devexpress/dx-react-grid";
const CAPASX = () => {
  interface ChangesData {
    added?: ReadonlyArray<any>;
    changed?: {
      [key: string]: any;
    };
    deleted?: ReadonlyArray<number | string>;
  }
  const columns = [
    { name: "id", title: "ID" },
    { name: "product", title: "Product" },
    { name: "owner", title: "Owner" },
    { name: "owner2", title: "Owner2" },
    {
      name: "newid",
      title: "NEWID",
      getCellValue: (row: any) => {
        return <p style={{ color: "red" }}> ID : {row.id + 1}</p>;
      },
    },
  ];
  const column_name_array = columns.map((element: any)=> {
    return element.name;
  });

  const getRowId = (row: any) => row.id;
  const [rows, setRows] = useState([
    { id: 0, product: "XDevExtreme", owner: "ZDevExpress", owner2: "TDev2" },
    {
      id: 1,
      product: "ADevExtreme Reactive1",
      owner: "DDevExpress1",
      owner2: "Dev2",
    },
    {
      id: 2,
      product: "BDevExtreme Reactive2",
      owner: "CDevExpress2",
      owner2: "Dev2",
    },
    {
      id: 3,
      product: "CDevExtreme Reactive3",
      owner: "BDevExpress3",
      owner2: "Dev2",
    },
  ]);
  const [columnWidths, setColumnWidths] = useState([
    { columnName: "id", width: 80 },
    { columnName: "product", width: 180 },
    { columnName: "owner", width: 150 },
    { columnName: "owner2", width: 100 },
    { columnName: "newid", width: 120 },
  ]);
  const commitChanges = ({ added, changed, deleted }: ChangesData) => {
    let changedRows: any;
    if (added) {
      console.log(added);
      const startingAddedId =
        rows.length > 0 ? rows[rows.length - 1].id + 1 : 0;
      changedRows = [
        ...rows,
        ...added.map((row: any, index: number) => ({
          id: startingAddedId + index,
          ...row,
        })),
      ];
    }
    if (changed) {
      console.log(changed);
      changedRows = rows.map((row) =>
        changed[row.id] ? { ...row, ...changed[row.id] } : row
      );
    }
    if (deleted) {
      console.log(deleted);
      const deletedSet = new Set(deleted);
      console.log(deletedSet);
      changedRows = rows.filter((row) => !deletedSet.has(row.id));
    }
    setRows(changedRows);
  };
  const [startEditAction, setStartEditAction] = useState("doubleClick");
  const [selectTextOnEditStart, setSelectTextOnEditStart] = useState(true);
  const ToolbarTable1 = () => {
    return (
      <div style={{ backgroundColor: "#002233" }}>
        <Button
          onClick={() => {
            Swal.fire("Thông báo", "Đã click", "success");
          }}
          color='warning'
        >
          Clickvao day
        </Button>
        <Button
          onClick={() => {
            Swal.fire("Thông báo", "Đã click", "success");
          }}
          color='warning'
        >
          Clickvao day
        </Button>
        <Button
          onClick={() => {
            Swal.fire("Thông báo", "Đã click", "success");
          }}
          color='warning'
        >
          Clickvao day
        </Button>
        <Button
          onClick={() => {
            Swal.fire("Thông báo", "Đã click", "success");
          }}
          color='warning'
        >
          Clickvao day
        </Button>
      </div>
    );
  };
  return (
    <div>
      <Paper sx={{margin: '20px'}}>
        <Grid rows={rows} columns={columns} getRowId={getRowId}>
          <SortingState
            defaultSorting={[{ columnName: "id", direction: "asc" }]}
          />
          <IntegratedSorting />
          <Table />
          <DragDropProvider />
          <TableColumnReordering
            defaultOrder={column_name_array}
          />
          <TableColumnResizing
            defaultColumnWidths={columnWidths}
            resizingMode={"widget"}
          />
          <EditingState onCommitChanges={commitChanges} />
          <TableHeaderRow showSortingControls={true} />
          <TableEditRow />
          <TableEditColumn
            showAddCommand={false}
            showEditCommand={false}
            showDeleteCommand={true}
          />
          <TableInlineCellEditing
            startEditAction='doubleClick'
            selectTextOnEditStart={selectTextOnEditStart}
          />
          <Toolbar rootComponent={ToolbarTable1} />
        </Grid>
      </Paper>
    </div>
  );
};
export default CAPASX;

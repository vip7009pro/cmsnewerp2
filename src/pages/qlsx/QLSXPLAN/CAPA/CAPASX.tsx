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
  PagingPanel,
  SearchPanel,
  VirtualTable,
  TableFilterRow,
  TableSelection,
  TableKeyboardNavigation,
} from "@devexpress/dx-react-grid-material-ui";
import { Button } from "@mui/material";
import Swal from "sweetalert2";
import {
  EditingState,
  FilteringState,
  IntegratedFiltering,
  IntegratedPaging,
  IntegratedSelection,
  IntegratedSorting,
  PagingState,
  SearchState,
  SelectionState,
  SortingState,
  TableRowDetail,
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
  const column_name_array = columns.map((element: any) => {
    return element.name;
  });
  const getRowId = (row: any) => row.id;
  const [selection, setSelection] = useState<Array<string | number>>([]);
  const [searchValue, setSearchState] = useState("");
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
    {
      id: 4,
      product: "CDevExtreme Reactive3",
      owner: "BDevExpress3",
      owner2: "Dev2",
    },
    {
      id: 5,
      product: "CDevExtreme Reactive3",
      owner: "BDevExpress3",
      owner2: "Dev2",
    },
    {
      id: 6,
      product: "CDevExtreme Reactive3",
      owner: "BDevExpress3",
      owner2: "Dev2",
    },
    {
      id: 7,
      product: "CDevExtreme Reactive3",
      owner: "BDevExpress3",
      owner2: "Dev2",
    },
    {
      id: 8,
      product: "CDevExtreme Reactive3",
      owner: "BDevExpress3",
      owner2: "Dev2",
    },
    {
      id: 9,
      product: "CDevExtreme Reactive3",
      owner: "BDevExpress3",
      owner2: "Dev2",
    },
    {
      id: 10,
      product: "CDevExtreme Reactive3",
      owner: "BDevExpress3",
      owner2: "Dev2",
    },
    {
      id: 11,
      product: "CDevExtreme Reactive3",
      owner: "BDevExpress3",
      owner2: "Dev2",
    },
    {
      id: 12,
      product: "CDevExtreme Reactive3",
      owner: "BDevExpress3",
      owner2: "Dev2",
    },
    {
      id: 13,
      product: "CDevExtreme Reactive3",
      owner: "BDevExpress3",
      owner2: "Dev2",
    },
    {
      id: 14,
      product: "CDevExtreme Reactive3",
      owner: "BDevExpress3",
      owner2: "Dev2",
    },
    {
      id: 15,
      product: "CDevExtreme Reactive3",
      owner: "BDevExpress3",
      owner2: "Dev2",
    },
    {
      id: 16,
      product: "CDevExtreme Reactive3",
      owner: "BDevExpress3",
      owner2: "Dev2",
    },
    {
      id: 17,
      product: "CDevExtreme Reactive3",
      owner: "BDevExpress3",
      owner2: "Dev2",
    },
    {
      id: 18,
      product: "CDevExtreme Reactive3",
      owner: "BDevExpress3",
      owner2: "Dev2",
    },
    {
      id: 19,
      product: "CDevExtreme Reactive3",
      owner: "BDevExpress3",
      owner2: "Dev2",
    },
    {
      id: 20,
      product: "CDevExtreme Reactive3",
      owner: "BDevExpress3",
      owner2: "Dev2",
    },
    {
      id: 21,
      product: "CDevExtreme Reactive3",
      owner: "BDevExpress3",
      owner2: "Dev2",
    },
    {
      id: 22,
      product: "CDevExtreme Reactive3",
      owner: "BDevExpress3",
      owner2: "Dev2",
    },
    {
      id: 23,
      product: "CDevExtreme Reactive3",
      owner: "BDevExpress3",
      owner2: "Dev2",
    },
    {
      id: 24,
      product: "CDevExtreme Reactive3",
      owner: "BDevExpress3",
      owner2: "Dev2",
    },
    {
      id: 25,
      product: "CDevExtreme Reactive3",
      owner: "BDevExpress3",
      owner2: "Dev2",
    },
  ]);
  const [datafilter, setDataFilter] = useState<Array<any>>([]);
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
  const [selectTextOnEditStart, setSelectTextOnEditStart] = useState(true);
  const ToolbarTable1 = () => {
    return (
      <div className='tabletoolbar' style={{ backgroundColor: "#002233" }}>
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
      <Paper
        sx={{
          margin: "20px",
          height: "500px",
          overflow: "scroll",
          backgroundColor: "#e8f5c6",
        }}
      >
        <div className='searchbar'>
          Search:{" "}
          <input
            /* autoFocus={true} */ key='searchbarkey'
            type='text'
            value={searchValue}
            onChange={(e) => {
              setSearchState(e.target.value);
            }}
          ></input>
        </div>
        <Grid rows={rows} columns={columns} getRowId={getRowId}>
          <VirtualTable />
          <SelectionState
            selection={selection}
            onSelectionChange={(e: any) => {
              setSelection(e);
              setDataFilter(
                rows.filter((element: any) => {
                  return e.includes(element.id);
                })
              );
            }}
          />
          <PagingState
            defaultCurrentPage={0}
            pageSize={100}
            defaultPageSize={100}
          />
          <IntegratedPaging />
          <SortingState
            defaultSorting={[{ columnName: "id", direction: "asc" }]}
          />
          <IntegratedSorting />
          <FilteringState defaultFilters={[]} />
          <SearchState value={searchValue} />
          <IntegratedFiltering />
          <Table />
          <DragDropProvider />
          <TableColumnReordering defaultOrder={column_name_array} />
          <TableColumnResizing
            defaultColumnWidths={columnWidths}
            resizingMode={"widget"}
          />
          <EditingState onCommitChanges={commitChanges} />
          <TableHeaderRow showSortingControls={true} />
          <PagingPanel pageSizes={[100, 1000, 10000, 100000, 1000000]} />
          <TableEditRow rowHeight={5} />
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
          <SearchPanel />
          <TableFilterRow />
          <IntegratedSelection />
          <TableSelection
            highlightRow={true}
            showSelectAll
            selectionColumnWidth={15}
          />
          <TableKeyboardNavigation
            defaultFocusedCell={{
              rowKey: `${Table.ROW_TYPE.toString()}_0`,
              columnKey: `${Table.COLUMN_TYPE.toString()}_id`,
            }}
            onFocusedCellChange={(e) => {
              console.log(e);
            }}
            /* focusedCell ={{rowKey:'Symbol(data)_2', columnKey:'Symbol(data)_owner'}} */
          />
        </Grid>
      </Paper>
    </div>
  );
};
export default CAPASX;
import * as React from 'react';
import { DataGrid, GridColumns, GridRowsProp } from '@mui/x-data-grid';

export default function DataTable() {
  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        experimentalFeatures={{ newEditingApi: true }}
      />
    </div>
  );
}

const columns: GridColumns = [
  { field: 'name', headerName: 'Name', width: 180, editable: true },
  { field: 'age', headerName: 'Age', type: 'number', editable: true },
  {
    field: 'dateCreated',
    headerName: 'Date Created',
    type: 'date',
    width: 180,
    editable: true,
  },
  {
    field: 'lastLogin',
    headerName: 'Last Login',
    type: 'dateTime',
    width: 220,
    editable: true,
  },
];

const rows: GridRowsProp = [
  {
    id: 1,
    name: 'van hung',
    age: 25,
    dateCreated: '2022-09-12',
    lastLogin: '2022-09-12',
  },
  {
    id: 2,
    name: 'van hung',
    age: 36,
    dateCreated: '2022-09-12',
    lastLogin: '2022-09-12',
  },
  {
    id: 3,
    name: 'van hung',
    age: 19,
    dateCreated: '2022-09-12',
    lastLogin: '2022-09-12',
  },
  {
    id: 4,
    name: 'van hung',
    age: 28,
    dateCreated: '2022-09-12',
    lastLogin: '2022-09-12',
  },
  {
    id: 5,
    name: 'van hung',
    age: 23,
    dateCreated: '2022-09-12',
    lastLogin: '2022-09-12',
  },
];

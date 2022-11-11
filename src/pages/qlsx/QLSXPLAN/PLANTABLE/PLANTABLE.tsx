import React from 'react'
import 'react-data-grid/lib/styles.css';
import DataGrid from 'react-data-grid';


const columns = [
  { key: 'id', name: 'ID' },
  { key: 'title', name: 'Title' }
];

const rows = [
  { id: 0, title: 'Example' },
  { id: 1, title: 'Demo' },
  { id: 2, title: 'Demo' },
  { id: 3, title: 'Demo' },
  { id: 4, title: 'Demo' },
  { id: 5, title: 'Demo' },
  { id: 6, title: 'Demo' },
];

const PLANTABLE = () => {
  return (
    <DataGrid columns={columns} rows={rows} />
  )
}

export default PLANTABLE
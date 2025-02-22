import { useEffect, useMemo } from 'react';
import AGTable from './AGTable';
const CustomerMonthlyClosing = ({ data, columns }: { data: Array<any>, columns: Array<any> }) => {
  //remove element from columns array which named id
  columns = columns.filter((e) => e.field !== 'id');
  const poDataAGTable = useMemo(() =>
    <AGTable
      suppressRowClickSelection={false}
      showFilter={true}
      toolbar={
        <></>
      }
      columns={columns}
      data={data}
      onCellEditingStopped={(params: any) => {
        //console.log(e.data)
      }} onRowClick={(params: any) => {
        //console.log(params.data)
      }} onSelectionChange={(params: any) => {
        //console.log(params)
        //setSelectedRows(params!.api.getSelectedRows()[0]);
        //console.log(e!.api.getSelectedRows())            
      }}
    />
    , [data, columns]);
  useEffect(() => {
    return () => {
    }
  }, [])
  return (
    <div className='customerdailyclosing' style={{ height: '100%', width: '100%' }}>
      {poDataAGTable}
    </div>
  )
}
export default CustomerMonthlyClosing
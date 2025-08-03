import { useEffect, useMemo, useState } from 'react';
import AGTable from '../../../../../../components/DataTable/AGTable';
import { IconButton } from '@mui/material';
import { MdRefresh } from 'react-icons/md';
import { f_getViewNameFromFormID, f_loadViewData } from '../../../../utils/nocodelowcodeUtils';

export default function TableComponent({formID}: {formID: string | number}) {
 
  const [records, setRecords] = useState<any[]>([]);
  const loadRecords = async () => {
    let viewName = await f_getViewNameFromFormID({ FormID: Number(formID) });
    const result = await f_loadViewData({ ViewName: viewName });
    setRecords(result);
  } 

  const formAG_Table = useMemo(() => {
    return (
      <AGTable
        suppressRowClickSelection={false}
        data={records}      
        toolbar={<>
        <IconButton
        className='buttonIcon'
        onClick={() => {
          loadRecords();
        }}
      >
        <MdRefresh  color='#f02bc5' size={15} />
        Refresh
      </IconButton>   

        </>}
        onRowClick={(params: any) => {         
         
        }}
        onSelectionChange={(params: any) => {
          
        }}
      />
    );
  }, [records]);

  useEffect(() => {
    loadRecords();
  }, [formID]);
  return (
    <div style={{ height: '100%', width: '100%' }}>
      {formAG_Table}
    </div>
  )
}

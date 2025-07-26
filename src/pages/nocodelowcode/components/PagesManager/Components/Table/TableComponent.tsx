import React, { useEffect, useMemo } from 'react'
import { use_f_load_pivotedData } from '../../../../utils/nocodelowcodeHooks';
import AGTable from '../../../../../../components/DataTable/AGTable';
import { IconButton } from '@mui/material';
import { MdRefresh } from 'react-icons/md';

export default function TableComponent({formID}: {formID: string | number}) {
  const {
    data: records,
    loading: loadingRecords,
    error: errorRecords,
    triggerFetch: fetchRecords, 
  } = use_f_load_pivotedData({ FormID: formID });

  const formAG_Table = useMemo(() => {
    return (
      <AGTable
        suppressRowClickSelection={false}
        data={records}      
        toolbar={<>
        <IconButton
        className='buttonIcon'
        onClick={() => {
          fetchRecords();
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
    fetchRecords();
  }, [formID]);
  return (
    <div style={{ height: '100%', width: '100%' }}>
      {formAG_Table}
    </div>
  )
}

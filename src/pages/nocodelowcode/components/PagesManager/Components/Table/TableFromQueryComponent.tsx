import { useEffect, useMemo, useState } from 'react';
import AGTable from '../../../../../../components/DataTable/AGTable';
import { IconButton } from '@mui/material';
import { MdRefresh } from 'react-icons/md';
import { f_getQueryFilterByQueryName, f_getQueryFilterList, f_getQueryIDFromQueryName, f_getViewNameFromFormID, f_loadViewData, f_runQuery } from '../../../../utils/nocodelowcodeUtils';
import { QueryFilter } from '../../../../QueryManager/QueryManager';
import { useForm } from 'react-hook-form';


export default function TableFromQueryComponent({queryName}: {queryName: string | number}) {
  const {
      register,
      control,
      handleSubmit,
      watch,
      formState: { errors },
    } = useForm({});
 
  const [records, setRecords] = useState<any[]>([]);
  const [queryFilter, setQueryFilter] = useState<QueryFilter[]>([]);
  const loadQueryFilter = async () => {
    const queryID = await f_getQueryIDFromQueryName({ QueryName: queryName });
    const result = await f_getQueryFilterList({ QueryID: queryID });
    console.log(result);
    setQueryFilter(result);
  }
  const loadRecords = async (data?: any) => {   
    console.log(data);
    const queryID = await f_getQueryIDFromQueryName({ QueryName: queryName });
    const resultQueryFilter = await f_getQueryFilterList({ QueryID: queryID });  
    let params: Record<string, any> = {};
    for(let i = 0; i < resultQueryFilter.length; i++) {
      params[resultQueryFilter[i].ParamName] = data[resultQueryFilter[i].ParamName];
    }
    const result = await f_runQuery({ QueryName: queryName, PARAMS: params });
    setRecords(result);
  } 

  function QueryForm({queryFilterList}: {queryFilterList: QueryFilter[]}) {
    return (
      <div
        style={{
          padding: '2px',
          minWidth: 280,
          maxWidth: 340,
          width: '100%',
          margin: 'auto',
          display: 'flex',
          flexDirection: 'column',    
          fontSize:' 0.7rem'     
        }}
      >
        <form
          onSubmit={handleSubmit((data) => loadRecords(data))}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          {queryFilterList.map((item: QueryFilter, index: number) => (
            <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label
                style={{
                  fontWeight: 600,
                  color: '#222',
                  fontSize: '0.7rem',
                  letterSpacing: 0.2,
                }}
              >
                {item.ParamName}
              </label>
              <input
                type="text"
                {...register(item.ParamName)}
                style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: 8,
                  padding: '6px 6px',
                  fontSize: '0.7rem',
                  background: '#fafbfc',
                  outline: 'none',
                  transition: 'border 0.2s',                 
                }}
                onFocus={e => (e.currentTarget.style.border = '1.5px solid #a7c7f7')}
                onBlur={e => (e.currentTarget.style.border = '1px solid #e0e0e0')}
              />
            </div>
          ))}
          <button
            type="submit"
            style={{
              background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: '0.7rem',
              height: 38,
              marginTop: 8,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(39, 94, 254, 0.08)',
              transition: 'background 0.2s',              
            }}
            onMouseOver={e => (e.currentTarget.style.background = 'linear-gradient(90deg, #2575fc 0%, #6a11cb 100%)')}
            onMouseOut={e => (e.currentTarget.style.background = 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)')}
          >
            Tra cứu
          </button>
        </form>
      </div>
    );
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
  }, [records, queryName]);

  useEffect(() => {
    handleSubmit((data)=>  loadRecords(data));
    loadQueryFilter();
  }, [queryName]);
  return (
    <div
      className="tablefromquery"
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        width: '100%',       
        padding: '5px',
        boxSizing: 'border-box',
        gap: '5px',
        alignItems: 'flex-start',
      }}
    >
      <div style={{minWidth: 280, maxWidth: 360, height: 'auto', display: 'flex', alignItems: 'flex-start' }}>
        <QueryForm queryFilterList={queryFilter} />
      </div>
      <div
        style={{
          flex: 1,
          minWidth: 0,
          boxShadow: '0 4px 24px rgba(0,0,0,0.09)',        
          height: '80vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {formAG_Table}
      </div>
    </div>
  );
}


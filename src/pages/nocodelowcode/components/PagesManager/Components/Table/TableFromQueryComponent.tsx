import { useEffect, useMemo, useState } from 'react';
import AGTable from '../../../../../../components/DataTable/AGTable';
import { IconButton } from '@mui/material';
import { MdRefresh } from 'react-icons/md';
import { f_getQueryFilterList, f_getQueryIDFromQueryName, f_runQuery } from '../../../../utils/nocodelowcodeUtils';
import { QueryFilter } from '../../../../QueryManager/QueryManager';
import { useForm } from 'react-hook-form';


export default function TableFromQueryComponent({queryName}: {queryName: string | number}) {
  const {
      register,
      control,
      handleSubmit,
      watch,
      setValue,
      getValues,
      formState: { errors },
    } = useForm({});
 
  const [records, setRecords] = useState<any[]>([]);
  const [queryFilter, setQueryFilter] = useState<QueryFilter[]>([]);
  // State for selection options per field, moved to parent
  const [selectionOptions, setSelectionOptions] = useState<{ [paramName: string]: any[] }>({});
  const loadQueryFilter = async () => {
    const queryID = await f_getQueryIDFromQueryName({ QueryName: queryName });
    const result = await f_getQueryFilterList({ QueryID: queryID });
    setQueryFilter(result);
  }
  const loadRecords = async (data?: any) => {   
    //console.log(data);
    const queryID = await f_getQueryIDFromQueryName({ QueryName: queryName });
    const resultQueryFilter = await f_getQueryFilterList({ QueryID: queryID });  
    let params: Record<string, any> = {};
    for(let i = 0; i < resultQueryFilter.length; i++) {
      params[resultQueryFilter[i].ParamName] = data[resultQueryFilter[i].ParamName];
    }
    const result = await f_runQuery({ QueryName: queryName, PARAMS: params });
    setRecords(result);
  } 

  // Effect to load options for all select fields when queryFilter changes
  useEffect(() => {
    if (queryFilter.length > 0) {
      queryFilter.forEach((item) => {
        if (item.INPUT_TYPE === 'select' && !selectionOptions[item.ParamName]) {
          f_runQuery({ QueryName: item.QueryName, PARAMS: {} }).then(result => {
            setSelectionOptions(prev => ({ ...prev, [item.ParamName]: result }));
          });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryFilter]);

  function QueryForm({queryFilterList, selectionOptions, register, setValue, getValues}: {
    queryFilterList: QueryFilter[],
    selectionOptions: { [paramName: string]: any[] },
    register: any,
    setValue: (name: string, value: any) => void,
    getValues: (name: string) => any
  }) {
    // Set default value for select fields to first option
    useEffect(() => {
      queryFilterList.forEach((item) => {
        if (item.INPUT_TYPE === 'select') {
          const options = selectionOptions[item.ParamName];
          if (options && options.length > 0) {
            const current = getValues(item.ParamName);
            if (!current) {
              setValue(item.ParamName, options[0].value);
            }
          }
        }
        if (item.INPUT_TYPE === 'date') {
          const current = getValues(item.ParamName);
          if (!current) {
            // Format today as yyyy-mm-dd
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            setValue(item.ParamName, `${yyyy}-${mm}-${dd}`);
          }
        }
      });
    }, [selectionOptions, queryFilterList, setValue, getValues]);
    // console.log('render')
    return (
      <div
        className='query-form'
        style={{
          padding: '2px',         
          width: '100%',
          margin: 'auto',
          display: 'flex',
          flexDirection: 'column',    
          fontSize:' 0.7rem',
          height:'100%',          
        }}
      >
        <form
          //onSubmit={handleSubmit((data) => loadRecords(data))}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            height:'100%'
          }}
        >
          {queryFilterList.map((item: QueryFilter, index: number) => {
            if (item.INPUT_TYPE === 'text') {
              return (
                <div key={index} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <label
                    style={{
                      fontWeight: 600,
                      color: '#222',
                      fontSize: '0.7rem',
                      letterSpacing: 0.2,
                      minWidth: 90,
                      marginRight: 6,
                    }}
                  >
                    {item.ParamName}
                  </label>
                  <input
                    type='text'
                    {...register(item.ParamName)}
                    style={{
                      border: '1px solid #e0e0e0',
                      borderRadius: 8,
                      padding: '6px 6px',
                      fontSize: '0.7rem',
                      background: '#fafbfc',
                      outline: 'none',
                      transition: 'border 0.2s',
                      flex: 1,
                    }}
                    onFocus={(e) => (e.currentTarget.style.border = '1.5px solid #a7c7f7')}
                    onBlur={(e) => (e.currentTarget.style.border = '1px solid #e0e0e0')}
                  />
                </div>
              );
            }
            else if(item.INPUT_TYPE === 'checkbox') {
              return (
                <div key={index} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <label
                    style={{
                      fontWeight: 600,
                      color: '#222',
                      fontSize: '0.7rem',
                      letterSpacing: 0.2,
                      minWidth: 90,
                      marginRight: 6,
                    }}
                  >
                    {item.ParamName}
                  </label>
                  <input
                    type='checkbox'
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
                    onFocus={(e) => (e.currentTarget.style.border = '1.5px solid #a7c7f7')}
                    onBlur={(e) => (e.currentTarget.style.border = '1px solid #e0e0e0')}
                  />
                </div>
              );
            }
            else if(item.INPUT_TYPE === 'select') {
              const options = selectionOptions[item.ParamName] || [];
              return (
                <div key={index} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <label
                    style={{
                      fontWeight: 600,
                      color: '#222',
                      fontSize: '0.7rem',
                      letterSpacing: 0.2,
                      minWidth: 90,
                      marginRight: 6,
                    }}
                  >
                    {item.ParamName}
                  </label>
                  <select
                    {...register(item.ParamName)}
                    style={{
                      border: '1px solid #e0e0e0',
                      borderRadius: 8,
                      padding: '6px 6px',
                      fontSize: '0.7rem',
                      background: '#fafbfc',
                      outline: 'none',
                      transition: 'border 0.2s',
                      flex: 1,
                    }}
                    onFocus={(e) => (e.currentTarget.style.border = '1.5px solid #a7c7f7')}
                    onBlur={(e) => (e.currentTarget.style.border = '1px solid #e0e0e0')}
                  >
                    {options.map((op: any, idx: number) => (
                      <option key={idx} value={op.value}>
                        {op.text}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }
            else if(item.INPUT_TYPE === 'date') {
              return (
                <div key={index} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <label
                    style={{
                      fontWeight: 600,
                      color: '#222',
                      fontSize: '0.7rem',
                      letterSpacing: 0.2,
                      minWidth: 90,
                      marginRight: 6,
                    }}
                  >
                    {item.ParamName}
                  </label>
                  <input
                    type='date'
                    {...register(item.ParamName)}
                    style={{
                      border: '1px solid #e0e0e0',
                      borderRadius: 8,
                      padding: '6px 6px',
                      fontSize: '0.7rem',
                      background: '#fafbfc',
                      outline: 'none',
                      transition: 'border 0.2s',
                      flex: 1,
                    }}
                    onFocus={(e) => (e.currentTarget.style.border = '1.5px solid #a7c7f7')}
                    onBlur={(e) => (e.currentTarget.style.border = '1px solid #e0e0e0')}
                  />
                </div>
              );
            }
            

          })}
          <button           
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
            onClick={handleSubmit((data)=>  loadRecords(data))}
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

  const handleSubmitData = (data: any) => {
    loadRecords(data);
  };
  useEffect(() => {
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
      <div className='query-form' style={{ height: '100%', display: 'flex', alignItems: 'flex-start' }}>
        <QueryForm queryFilterList={queryFilter} selectionOptions={selectionOptions} register={register} setValue={setValue} getValues={getValues} />
      </div>
      <div
        style={{
          flex: 1,
          minWidth: 0,
          boxShadow: '0 4px 24px rgba(0,0,0,0.09)',        
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {formAG_Table}
      </div>
    </div>
  );
}


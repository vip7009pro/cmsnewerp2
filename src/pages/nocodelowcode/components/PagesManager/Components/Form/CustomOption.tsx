import React, { useEffect, useState } from 'react'
import { f_load_pivotedData, f_loadFieldList } from '../../../../utils/nocodelowcodeUtils';

export default function CustomOption({FormID, FieldIDs, FieldName}: {FormID: number, FieldIDs: string, FieldName: string}) {
    const [data, setData] = useState<any[]>([]);
    const [fields, setFields] = useState<any[]>([]);
    const [fieldNameList, setFieldNameList] = useState<string[]>([]);

    const loadData = async () => {
        const result = await f_load_pivotedData({FormID: FormID});
        console.log('FieldIDs',FieldIDs)
        console.log('result',result);
        setData(result);
    }
    const loadField = async () => {
        const result = await f_loadFieldList({FormID: FormID});
        console.log('FieldIDs',FieldIDs)
        console.log('result',result);
        if(result.length > 0){
            console.log('split',FieldIDs.split(','))
            const fieldNameList = result.filter((item: any) => FieldIDs.split(',').map((item: any) => Number(item)).includes(Number(item.FieldID))).map((item: any) => item.FieldName);
            console.log('fieldNameList',fieldNameList)
            setFieldNameList(fieldNameList);
            
        }
        setFields(result);
    }
    useEffect(() => {
        loadData();
        loadField();
    }, []);

   
   
     
  return (
    <>
    {data.map((item: any, index: number) => (
        <option key={index} value={item[FieldName]}>
          {
            fieldNameList.map((fieldName: string, idx: number) => {
                console.log('fieldName',fieldName)
                return(
              <span key={idx}>{item[fieldName]}.</span>
            )})
          }
        </option>
      ))}
    </>
  )
}

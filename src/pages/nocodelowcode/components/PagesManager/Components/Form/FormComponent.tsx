import React, { useEffect, useState } from 'react';
import { use_f_loadFieldList } from '../../../../utils/nocodelowcodeHooks';
import { Autocomplete, Button, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { Field, FormData, Record } from '../../../../types/types';
import { f_insertFormData, f_insertRecord, f_load_pivotedData, f_loadFieldList, load_pivotedDataSpecificFields } from '../../../../utils/nocodelowcodeUtils';
import Swal from 'sweetalert2';
import CustomOption from './CustomOption';
interface FormComponentProps {
  formId: string | number;
}

/**
 * Hiển thị danh sách trường (fields) của một form theo formId.
 * Tự động fetch lại khi formId thay đổi.
 */





const FormComponent: React.FC<FormComponentProps> = ({ formId }) => {
  const {
    data: fields,
    loading: loadingFields,
    error: errorFields,
    triggerFetch: fetchFields,
  } = use_f_loadFieldList({ FormID: formId });
   const {register,control,handleSubmit,watch, formState:{errors}} = useForm( {
      
    })  

    const handleSaveData = async (fields: Field[],formID: number, data: any) => {
       
        const record: Record = {
          RecordID: Date.now() + Math.floor(Math.random() * 10000),
          FormID: formID,
          CreatedAt: new Date(),
        };
        const newRecordID = await f_insertRecord(record);
        if(newRecordID.RecordID === 0) return;
        const formDataList: FormData[] = [];
        fields.forEach((field: Field) => {
          const formData: FormData = {
            DataID: Date.now() + Math.floor(Math.random() * 10000),
            FormID: formID,
            RecordID: newRecordID.RecordID,
            FieldID: field.FieldID,
            Value: field.DataType === 'BIT' ? (data[field.FieldName] ? '1' : '0') : ["FLOAT","DECIMAL","NUMERIC","INT","BIGINT"].includes(field.DataType) ? Number(data[field.FieldName]) : data[field.FieldName],
            CreatedAt: new Date(),
          };
          formDataList.push(formData);
        });
        console.log(record);
        console.log(formDataList);
      
        for(let i=0;i<formDataList.length;i++){
          await f_insertFormData(formDataList[i]);
        }
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Lưu dữ liệu thành công!',
        });
      };

    const [optionsMap, setOptionsMap] = useState<any>({});

    const loadOptions = async (fields: Field[]) => {
      let refFields = fields.filter((field: Field) => field.ReferenceFieldIDs !== null || field.ReferenceFieldIDs !== '');
      for(let i=0;i<refFields.length;i++){
        let refField = refFields[i];
        let refFieldData = await f_load_pivotedData({FormID: Number(refField.ReferenceFormID)});
        const orgFieldList = await f_loadFieldList({FormID: Number(refField.ReferenceFormID)});
        let showFieldList = orgFieldList.filter((field: any) => refField.ReferenceFieldIDs?.split(',').includes(String(field.FieldID)));
        console.log('showFieldList',showFieldList)
        // get refFieldData with fieldID in refField.ReferenceFieldIDs
        //create new refFieldData with FieldName in showFieldList
        let newRefFieldData = refFieldData.map((item: any) => {
          let newItem = item;
          showFieldList.forEach((field: any) => {
            newItem[field.FieldName] = item[field.FieldName];
          });
          return newItem;
        });
        console.log('newRefFieldData',newRefFieldData)
        
        setOptionsMap((prevOptionsMap: any) => ({
          ...prevOptionsMap,
          [refField.FieldName]: newRefFieldData,
        }));
      }
    }


   
      
  useEffect(() => {
    fetchFields();
    loadOptions(fields);
  }, [formId]);

 /*  if (loadingFields) return <div>Đang tải dữ liệu...</div>;
  if (errorFields) return <div style={{ color: 'red' }}>Lỗi: {String(errorFields)}</div>; */

  return (
    <div className="form-component-root" style={{ width: '100%' }}>
      {fields && fields.length > 0 ? (
        <div className="form-component-fields" style={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
          {fields.map((field: Field, idx: number) => (
            <div key={idx} className="form-component-field" style={{display:'flex',flexDirection:'row',alignItems:'center',gap:0, marginBottom: 2 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, width: '300px' }}>
                <span className="form-component-field-name" style={{ minWidth: 100, fontWeight: 500, fontSize: '0.7rem' }}>
                  {field.FieldName}
                </span>
                {field.ReferenceFieldIDs  && field.ReferenceFieldIDs.split(',').length > 0 &&  <Controller
        name="selectedOption"
        control={control}
        rules={{ required: 'Vui lòng chọn một tùy chọn' }}
        render={({ field: { onChange, value } }) => (
          <Autocomplete
          sx={{width:'100%'}}
            options={optionsMap[field.FieldName]}
            getOptionLabel={(option) => { 
           return option[field.FieldName]
            }}
            isOptionEqualToValue={(option, val) => option.value === val?.value}
            disabled={optionsMap[field.FieldName] === undefined || optionsMap[field.FieldName].length === 0}
            value={value}
            onChange={(_, newValue) => onChange(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Chọn một tùy chọn"
                error={!!errors.selectedOption}               
              />
            )}
          />
        )}
      />  }             
                {/* {field.ReferenceFieldIDs  && field.ReferenceFieldIDs.split(',').length > 0 &&  <select
                {...register(field.FieldName)}
                  className="form-component-field-input"
                  style={{ flex: 1, padding: 6, border: '1px solid #ccc', borderRadius: 4, width: '100%' }}
                >
                  <CustomOption FormID={Number(field.ReferenceFormID)} FieldIDs={field.ReferenceFieldIDs} FieldName={field.FieldName}/>
                </select>   }  */}            
                {!(field.ReferenceFieldIDs  && field.ReferenceFieldIDs.split(',').length > 0) &&  <input
                {...register(field.FieldName)}
                  type={field.DataType === 'BIT' ? 'checkbox' : 'text'}
                  className="form-component-field-input"
                  style={{ flex: 1, padding: 6, border: '1px solid #ccc', borderRadius: 4, width: '100%' }}
                />   }             
              </label>
            </div>
          ))}
          <Button style={{width:'20%'}} variant="contained" color="primary" onClick={handleSubmit((data)=>handleSaveData(fields,Number(formId),data))}>Lưu</Button>
        </div>
      ) : (
        <div style={{ color: '#888' }}>Không có trường dữ liệu nào cho form này.</div>
      )}
    </div>
  );
};

export default FormComponent;


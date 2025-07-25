import React, { useEffect } from 'react';
import { use_f_loadFieldList } from '../../../../utils/nocodelowcodeHooks';
import { Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { Field, FormData, Record } from '../../../../types/types';
import { f_insertFormData, f_insertRecord } from '../../../../utils/nocodelowcodeUtils';
import Swal from 'sweetalert2';
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
   const {register,handleSubmit,watch, formState:{errors}} = useForm( {
      
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

      
  useEffect(() => {
    fetchFields();
  }, [formId]);

 /*  if (loadingFields) return <div>Đang tải dữ liệu...</div>;
  if (errorFields) return <div style={{ color: 'red' }}>Lỗi: {String(errorFields)}</div>; */

  return (
    <div className="form-component-root" style={{ width: '100%' }}>
      {fields && fields.length > 0 ? (
        <div className="form-component-fields" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {fields.map((field: Field, idx: number) => (
            <div key={idx} className="form-component-field" style={{ marginBottom: 8 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="form-component-field-name" style={{ minWidth: 120, fontWeight: 500 }}>
                  {field.FieldName}
                </span>
                <input
                {...register(field.FieldName)}
                  type={field.DataType === 'BIT' ? 'checkbox' : 'text'}
                  className="form-component-field-input"
                  style={{ flex: 1, padding: 6, border: '1px solid #ccc', borderRadius: 4 }}
                />
              </label>
            </div>
          ))}
          <Button variant="contained" color="primary" onClick={handleSubmit((data)=>handleSaveData(fields,Number(formId),data))}>Lưu</Button>
        </div>
      ) : (
        <div style={{ color: '#888' }}>Không có trường dữ liệu nào cho form này.</div>
      )}
    </div>
  );
};

export default FormComponent;


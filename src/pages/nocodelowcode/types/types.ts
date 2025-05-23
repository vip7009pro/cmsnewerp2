export interface Form {
    FormID: number;
    FormName: string;
    Description: string;
    CreatedAt: Date;
  }
  
  export interface Field {
    FieldID: number;
    FormID: number;
    FieldName: string;
    DataType: string;
    Length?: number;
    ReferenceFormID?: number;
    IsRequired: boolean;
    CreatedAt: Date;
  }
  
  export interface Record {
    RecordID: number;
    FormID: number;
    CreatedAt: Date;
  }
  
  export interface FormData {
    DataID: number;
    FormID: number;
    RecordID: number;
    FieldID: number;
    Value: string;
    CreatedAt: Date;
  }
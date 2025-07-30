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
    ReferenceFieldIDs?: string;
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
  
  export interface Relationship {
    RelationshipID: number;
    ParentTableID: number;
    ChildTableID: number;
    ParentFieldID: number;
    ChildFieldID: number;
    RelationshipType: string;
    CreatedAt: Date;
    UpdatedAt: Date;
  }

   
  export interface Page {
    PageID: number;
    PageName: string;
    Description?: string;
    Layout?: string;
    CreatedAt: Date;
    LastModifiedAt: Date;
  }
  
  export interface PageComponent {
    ComponentID: number;
    PageID: number;
    ComponentType: string;
    ComponentName: string;
    ReferenceID?: number;
    PositionX: number;
    PositionY: number;
    Width?: number;
    Height?: number;
    GridWidth: string;
    ComponentOrder: number;
    CreatedAt: Date;
    LastModifiedAt: Date;
  }
  
  export interface ComponentAttribute {
    AttributeID: number;
    ComponentID: number;
    AttributeName: string;
    AttributeValue?: string;
    CreatedAt: Date;
    LastModifiedAt: Date;
  }
  
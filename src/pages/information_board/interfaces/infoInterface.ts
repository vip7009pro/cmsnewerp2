export interface POST_DATA {
    CTR_CD: string;
    POST_ID: number;
    DEPT_CODE: string;
    MAINDEPT: string;
    SUBDEPT: string;
    FILE_NAME: string;
    TITLE: string;
    CONTENT: string;
    IS_PINNED: string;
    INS_DATE: string;
    INS_EMPL: string;
    UPD_DATE: string;
    UPD_EMPL: string;
  }
  export interface DEPARTMENT_DATA {
    CTR_CD: string;
    DEPT_CODE: number;
    MAINDEPT: string;
    SUBDEPT: string;
    INFORMATION: string;
    PIN_QTY: number;
    INS_DATE: string;
    INS_EMPL: string;
    UPD_DATE: string;
    UPD_EMPL: string;
  }
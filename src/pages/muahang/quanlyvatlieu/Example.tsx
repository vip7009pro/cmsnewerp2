import { useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_ColumnDef,
} from 'material-react-table';


//example data type
type MATERIAL_TABLE_DATA = {
  M_ID: number;
  M_NAME: string;
  DESCR: string;
  CUST_CD: string;
  CUST_NAME_KD: string;
  SSPRICE: number;
  CMSPRICE: number;
  SLITTING_PRICE: number;
  MASTER_WIDTH: number;
  ROLL_LENGTH: number;
  USE_YN: string;
  INS_DATE: string;
  INS_EMPL: string;
  UPD_DATE: string;
  UPD_EMPL: string;
  EXP_DATE: string;
}


const Example = () => {
  const [data,setdata] = useState<MATERIAL_TABLE_DATA[]>([
    {
      M_ID: 0,
      M_NAME: 'a',
      DESCR: '',
      CUST_CD: '',
      CUST_NAME_KD: '',
      SSPRICE: 0,
      CMSPRICE: 0,
      SLITTING_PRICE: 0,
      MASTER_WIDTH: 0,
      ROLL_LENGTH: 0,
      USE_YN: '',
      INS_DATE: '',
      INS_EMPL: '',
      UPD_DATE: '',
      UPD_EMPL: '',
      EXP_DATE: ''
    },
    {
      M_ID: 1,
      M_NAME: 'b',
      DESCR: '',
      CUST_CD: '',
      CUST_NAME_KD: '',
      SSPRICE: 0,
      CMSPRICE: 0,
      SLITTING_PRICE: 0,
      MASTER_WIDTH: 0,
      ROLL_LENGTH: 0,
      USE_YN: '',
      INS_DATE: '',
      INS_EMPL: '',
      UPD_DATE: '',
      UPD_EMPL: '',
      EXP_DATE: ''
    },
    {
      M_ID: 2,
      M_NAME: 'c',
      DESCR: '',
      CUST_CD: '',
      CUST_NAME_KD: '',
      SSPRICE: 0,
      CMSPRICE: 0,
      SLITTING_PRICE: 0,
      MASTER_WIDTH: 0,
      ROLL_LENGTH: 0,
      USE_YN: '',
      INS_DATE: '',
      INS_EMPL: '',
      UPD_DATE: '',
      UPD_EMPL: '',
      EXP_DATE: ''
    },
  ])
  const columns = useMemo<MRT_ColumnDef<MATERIAL_TABLE_DATA>[]>(
    () => [
      {
        accessorKey: 'M_ID', //access nested data with dot notation
        header: 'M_ID',
        size: 150,
      },
      {
        accessorKey: 'M_NAME',
        header: 'M_NAME',
        size: 150,
      },     
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
  });

  return <MaterialReactTable table={table} />;
};

export default Example;

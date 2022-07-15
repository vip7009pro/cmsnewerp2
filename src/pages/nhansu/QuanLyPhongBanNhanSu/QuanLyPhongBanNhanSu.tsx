import React, { useEffect, useState } from 'react'
import { generalQuery } from '../../../api/Api';
import DataTable from '../../../components/DataTable/DataTable';
import "./QuanLyPhongBanNhanSu.scss"

interface MainDeptTable {

}
const QuanLyPhongBanNhanSu = () => {
    const [maindeptTable, setMainDeptTable] = useState<any>();
    const [subdeptTable, setSubDeptTable] = useState<any>();
    const [workposotion, setWorkPosition] = useState<any>();
    const [attendace_group, setAttendance_Group] = useState<any>();
    
    type paramss = {
        row: {
          id: number;
          firstName: string;
          lastName: string;
        };
      };
    type params_maindept = {
        row: {
          CTR_CD: string;
          MAINDEPTCODE: string;
          MAINDEPTNAME: string;
          MAINDEPTNAME_KR: string;
        };
      };

    const columns_maindept = [
        { field: "CTR_CD", headerName: "CTR_CD", width: 70 },
        { field: "MAINDEPTCODE", headerName: "MAINDEPTCODE", width: 70 },
        { field: "MAINDEPTNAME", headerName: "MAINDEPTNAME", width: 130 },
        { field: "MAINDEPTNAME_KR", headerName: "MAINDEPTNAME_KR", width: 130 },
        { field: "age", headerName: "Age", type: "number", width: 90 },       
    ];
   
    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "firstName", headerName: "First name", width: 130 },
        { field: "lastName", headerName: "Last name", width: 130 },
        { field: "age", headerName: "Age", type: "number", width: 90 },
        { field: "fullName", headerName: "Full name", description: "This column has a value getter and is not sortable.", sortable: false, width: 160,
          valueGetter: (params: paramss) =>
            `${params.row.firstName || ""} ${params.row.lastName || ""}`,
        },
      ];
      const rows = [
        { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
        { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
        { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
        { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
        { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
        { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
        { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
        { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
        { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
      ];
    

    useEffect(()=> {
        
    },[]);

  return (
    <div className='quanlyphongbannhansu'>
        <div className="quanlyphongban">
            <div className="maindept">
                <div className="maindept_table">
                    <DataTable columns={columns} rows={rows}/>
                </div>
                <div className="maindeptbutton">

                </div>
            </div>
            <div className="subdept">
                <div className="subdept_table">

                </div>
                <div className="subdeptbutton">

                </div>
            </div>
            <div className="postion">

            </div>
            <div className="attendance_group">

            </div>

        </div>
        <div className="quanlynhansu">

        </div>
    </div>
  )
}

export default QuanLyPhongBanNhanSu
import React, { useEffect, useState } from 'react'
import "./QuanLyPhongBanNhanSu.scss"

interface MainDeptTable {

}
const QuanLyPhongBanNhanSu = () => {
    const [maindeptTable, setMainDeptTable] = useState<any>();
    const [subdeptTable, setSubDeptTable] = useState<any>();
    const [workposotion, setWorkPosition] = useState<any>();
    const [attendace_group, setAttendance_Group] = useState<any>();


    useEffect(()=> {
        

    },[]);

  return (
    <div className='quanlyphongbannhansu'>
        <div className="quanlyphongban">
            <div className="maindept">
                Main dept
            </div>
            <div className="subdept">

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
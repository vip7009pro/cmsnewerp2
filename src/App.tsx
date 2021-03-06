import React, { Component, FC, useEffect, useState } from "react";
import Home from "./pages/home/Home";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login/Login";
import "./App.scss";
import KinhDoanh from "./pages/kinhdoanh/KinhDoanh";
import PoManager from "./pages/kinhdoanh/pomanager/PoManager";
import KinhDoanhReport from "./pages/kinhdoanh/kinhdoanhreport/KinhDoanhReport";
import InvoiceManager from "./pages/kinhdoanh/invoicemanager/InvoiceManager";
import PlanManager from "./pages/kinhdoanh/planmanager/PlanManager";
import FCSTManager from "./pages/kinhdoanh/fcstmanager/FCSTManager";
import YCSXManager from "./pages/kinhdoanh/ycsxmanager/YCSXManager";
import POandStockFull from "./pages/kinhdoanh/poandstockfull/POandStockFull";
import { LangConText, UserContext } from "../src/api/Context";
import { checkLogin } from "./api/Api";
import AccountInfo from "./components/Navbar/AccountInfo/AccountInfo";
import NhanSu from "./pages/nhansu/NhanSu";
import QuanLyPhongBanNhanSu from "./pages/nhansu/QuanLyPhongBanNhanSu/QuanLyPhongBanNhanSu";
import DiemDanhNhom from "./pages/nhansu/DiemDanhNhom/DiemDanhNhom";
import DieuChuyenTeam from "./pages/nhansu/DieuChuyenTeam/DieuChuyenTeam";
import TabDangKy from "./pages/nhansu/DangKy/TabDangKy";
import PheDuyetNghi from "./pages/nhansu/PheDuyetNghi/PheDuyetNghi";
import LichSu from "./pages/nhansu/LichSu/LichSu";
import BaoCaoNhanSu from "./pages/nhansu/BaoCaoNhanSu/BaoCaoNhanSu";
import Swal from "sweetalert2";

//https://www.robinwieruch.de/react-router-private-routes/
interface userDataInterface {
  ADD_COMMUNE: string;
  ADD_DISTRICT: string;
  ADD_PROVINCE: string;
  ADD_VILLAGE: string;
  ATT_GROUP_CODE: number;
  CMS_ID: string;
  CTR_CD: string;
  DOB: string;
  EMAIL: string;
  EMPL_NO: string;
  FACTORY_CODE: number;
  FACTORY_NAME: string;
  FACTORY_NAME_KR: string;
  FIRST_NAME: string;
  HOMETOWN: string;
  JOB_CODE: number;
  JOB_NAME: string;
  JOB_NAME_KR: string;
  MAINDEPTCODE: number;
  MAINDEPTNAME: string;
  MAINDEPTNAME_KR: string;
  MIDLAST_NAME: string;
  ONLINE_DATETIME: string;
  PASSWORD: string;
  PHONE_NUMBER: string;
  POSITION_CODE: number;
  POSITION_NAME: string;
  POSITION_NAME_KR: string;
  REMARK: string;
  SEX_CODE: number;
  SEX_NAME: string;
  SEX_NAME_KR: string;
  SUBDEPTCODE: number;
  SUBDEPTNAME: string;
  SUBDEPTNAME_KR: string;
  WORK_POSITION_CODE: number;
  WORK_POSITION_NAME: string;
  WORK_POSITION_NAME_KR: string;
  WORK_SHIFT_CODE: number;
  WORK_SHIF_NAME: string;
  WORK_SHIF_NAME_KR: string;
  WORK_START_DATE: string;
  WORK_STATUS_CODE: number;
  WORK_STATUS_NAME: string;
  WORK_STATUS_NAME_KR: string;
}

const ProtectedRoute: any = ({
  user,
  maindeptname,
  jobname,
  children,
}: {
  user: userDataInterface;
  maindeptname: string,
  jobname:string,
  children: Component;
}) => {
  if (user.EMPL_NO === "none") {
    return <Navigate to='/login' replace />;
  } 
  else
  {
   /*  console.log("ten bo phan: " +maindeptname);
    console.log("ten chuc vu can thiet: " +jobname);
    console.log("ten chuc vu cua ban: " +user.JOB_NAME); */

    if(maindeptname === 'all' || user.EMPL_NO==='NHU1903')
    {    
      if(jobname === 'all' || user.EMPL_NO==='NHU1903')
      {
        return children;
      }
      else
      {
        if(user.JOB_NAME !== 'Leader' && user.JOB_NAME !== 'Sub Leader' && user.JOB_NAME !== 'Dept Staff')
        {
          Swal.fire("Th??ng b??o", "N???i dung: B???n kh??ng c?? quy???n truy c???p: ", "error");
        }
        else
        {
          return children;
        }
       
      }      
    } 
    else 
    {
      if(user.MAINDEPTNAME !== maindeptname)
      {
        Swal.fire("Th??ng b??o", "N???i dung: B???n kh??ng ph???i ng?????i c???a b??? ph???n: " + maindeptname, "error");  
      }
      else
      {
        if(jobname === 'all'|| user.EMPL_NO==='NHU1903')
        {
          return children;
        }
        else
        {
          if(user.JOB_NAME !== 'Leader' && user.JOB_NAME !== 'Sub Leader' && user.JOB_NAME !== 'Dept Staff')
          {
            Swal.fire("Th??ng b??o", "N???i dung: B???n kh??ng c?? quy???n truy c???p: ", "error");
          }
          else
          {
            return children;
          }         
        }
        
      }      
    }

  } 
 
  
};
function App() {
  const [lang, setLang] = useState('vi');
  const [userData, setUserData] = useState<userDataInterface | any>({
    ADD_COMMUNE: "????ng Xu??n",
    ADD_DISTRICT: "S??c S??n",
    ADD_PROVINCE: "H?? N???i",
    ADD_VILLAGE: "Th??n Ph?? Th???",
    ATT_GROUP_CODE: 1,
    CMS_ID: "CMS1179",
    CTR_CD: "002",
    DOB: "1993-10-18T00:00:00.000Z",
    EMAIL: "nvh1903@cmsbando.com",
    EMPL_NO: "none",
    FACTORY_CODE: 1,
    FACTORY_NAME: "Nh?? m??y 1",
    FACTORY_NAME_KR: "1??????",
    FIRST_NAME: "H??NG3",
    HOMETOWN: "Ph??? Th??? - ????ng Xu??n - S??c S??n - H?? N???i",
    JOB_CODE: 1,
    JOB_NAME: "Dept Staff",
    JOB_NAME_KR: "???????????????",
    MAINDEPTCODE: 1,
    MAINDEPTNAME: "QC",
    MAINDEPTNAME_KR: "??????",
    MIDLAST_NAME: "NGUY???N V??N",
    ONLINE_DATETIME: "2022-07-12T20:49:52.600Z",
    PASSWORD: "dauxanhrauma",
    PHONE_NUMBER: "0971092454",
    POSITION_CODE: 3,
    POSITION_NAME: "Staff",
    POSITION_NAME_KR: "??????",
    REMARK: null,
    SEX_CODE: 1,
    SEX_NAME: "Nam",
    SEX_NAME_KR: "??????",
    SUBDEPTCODE: 2,
    SUBDEPTNAME: "PD",
    SUBDEPTNAME_KR: "??????",
    WORK_POSITION_CODE: 2,
    WORK_POSITION_NAME: "PD",
    WORK_POSITION_NAME_KR: "PD",
    WORK_SHIFT_CODE: 0,
    WORK_SHIF_NAME: "H??nh Ch??nh",
    WORK_SHIF_NAME_KR: "??????",
    WORK_START_DATE: "2019-03-11T00:00:00.000Z",
    WORK_STATUS_CODE: 1,
    WORK_STATUS_NAME: "??ang l??m",
    WORK_STATUS_NAME_KR: "?????????",
  });
  useEffect(() => {
    checkLogin().then(data => {
      //console.log(data);
      if (data.data.tk_status == 'ng') {
        console.log('khong co token');            
        setUserData(
          {
            ADD_COMMUNE: "????ng Xu??n",
            ADD_DISTRICT: "S??c S??n",
            ADD_PROVINCE: "H?? N???i",
            ADD_VILLAGE: "Th??n Ph?? Th???",
            ATT_GROUP_CODE: 1,
            CMS_ID: "CMS1179",
            CTR_CD: "002",
            DOB: "1993-10-18T00:00:00.000Z",
            EMAIL: "nvh1903@cmsbando.com",
            EMPL_NO: "none",
            FACTORY_CODE: 1,
            FACTORY_NAME: "Nh?? m??y 1",
            FACTORY_NAME_KR: "1??????",
            FIRST_NAME: "H??NG3",
            HOMETOWN: "Ph??? Th??? - ????ng Xu??n - S??c S??n - H?? N???i",
            JOB_CODE: 1,
            JOB_NAME: "Dept Staff",
            JOB_NAME_KR: "???????????????",
            MAINDEPTCODE: 1,
            MAINDEPTNAME: "QC",
            MAINDEPTNAME_KR: "??????",
            MIDLAST_NAME: "NGUY???N V??N",
            ONLINE_DATETIME: "2022-07-12T20:49:52.600Z",
            PASSWORD: "",
            PHONE_NUMBER: "0971092454",
            POSITION_CODE: 3,
            POSITION_NAME: "Staff",
            POSITION_NAME_KR: "??????",
            REMARK: null,
            SEX_CODE: 1,
            SEX_NAME: "Nam",
            SEX_NAME_KR: "??????",
            SUBDEPTCODE: 2,
            SUBDEPTNAME: "PD",
            SUBDEPTNAME_KR: "??????",
            WORK_POSITION_CODE: 2,
            WORK_POSITION_NAME: "PD",
            WORK_POSITION_NAME_KR: "PD",
            WORK_SHIFT_CODE: 0,
            WORK_SHIF_NAME: "H??nh Ch??nh",
            WORK_SHIF_NAME_KR: "??????",
            WORK_START_DATE: "2019-03-11T00:00:00.000Z",
            WORK_STATUS_CODE: 1,
            WORK_STATUS_NAME: "??ang l??m",
            WORK_STATUS_NAME_KR: "?????????",
          }
        );
      }
      else {       
        //console.log(data.data.data);       
        setUserData(data.data.data);
      }
    })
      .catch(err => {
        console.log(err + ' ');
      })
    return () => {      
    }
  }, []); 

  return (
    <div className='App'>
      <LangConText.Provider value={[lang,setLang]}>
      <UserContext.Provider value={[userData,setUserData]}>
        <BrowserRouter>
          <Routes>
            <Route
              path='/'
              element={
                <ProtectedRoute user={userData} maindeptname='all' jobname='all'>
                  <Home />
                </ProtectedRoute>
              }
            >              
              <Route path='accountinfo' element={<AccountInfo />}></Route>
              <Route path='kinhdoanh' element={
                <ProtectedRoute user={userData} maindeptname='KD' jobname='all'>
                <KinhDoanh />
              </ProtectedRoute>              
              }>
                <Route path='pomanager' element={<PoManager />} />
                <Route path='invoicemanager' element={<InvoiceManager />} />
                <Route path='planmanager' element={<PlanManager />} />
                <Route path='fcstmanager' element={<FCSTManager />} />
                <Route path='ycsxmanager' element={<YCSXManager />} />
                <Route path='poandstockfull' element={<POandStockFull />} />
                <Route path='kinhdoanhreport' element={<KinhDoanhReport />} />
              </Route>
              <Route path='nhansu' element={
                  <ProtectedRoute user={userData} maindeptname='all' jobname='all'>
                   <NhanSu />
                </ProtectedRoute>               
              }>
                <Route path='quanlyphongbannhanvien' element={
                  <ProtectedRoute user={userData} maindeptname='all' jobname='leader'>
                    <QuanLyPhongBanNhanSu />
                  </ProtectedRoute>                
                } />
                <Route path='diemdanhnhom' element={
                  <ProtectedRoute user={userData} maindeptname='all' jobname='leader'>
                    <DiemDanhNhom />
                </ProtectedRoute>   
               
                } />
                <Route path='dieuchuyenteam' element={
                   <ProtectedRoute user={userData} maindeptname='all' jobname='leader'>
                   <DieuChuyenTeam />
               </ProtectedRoute>   
                
                } />
                <Route path='dangky' element={<TabDangKy />} />
                <Route path='pheduyetnghi' element={
                   <ProtectedRoute user={userData} maindeptname='all' jobname='leader'>
                   <PheDuyetNghi />
               </ProtectedRoute>
                } />
                <Route path='lichsu' element={<LichSu />} />
                <Route path='baocaonhansu' element={               
                <ProtectedRoute user={userData} maindeptname='all' jobname='leader'>
                 <BaoCaoNhanSu />
            </ProtectedRoute>
                } />                
              </Route>
            </Route>
            <Route path='/login' element={<Login />} />
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
      </LangConText.Provider>
    </div>
  );
}

export default App;

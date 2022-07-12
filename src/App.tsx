import React, {Component, FC, useEffect, useState} from "react";
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
import {UserContext} from "../src/api/Context"

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
};

const ProtectedRoute: any = ({user, children}: {user: string, children: Component}) => { 
  if (!user) {
    return <Navigate to='/login' replace />;
  }
  return children;
};
function App() {
  const [userData, setUserData] = useState<userDataInterface | any>(undefined);

  useEffect(() => {
    console.log("1");
    //setUserData();     
  }, []);
  
  
  return (
    <div className='App'>
      <UserContext.Provider value={userData}>
        <BrowserRouter>
          <Routes>
            <Route
              path='/'
              element={ <Home/>
                
              }
            >
              <Route path='kinhdoanh' element={<KinhDoanh />}>
                <Route path='pomanager' element={<PoManager />} />
                <Route path='invoicemanager' element={<InvoiceManager />} />
                <Route path='planmanager' element={<PlanManager />} />
                <Route path='fcstmanager' element={<FCSTManager />} />
                <Route path='ycsxmanager' element={<YCSXManager />} />
                <Route path='poandstockfull' element={<POandStockFull />} />
                <Route path='kinhdoanhreport' element={<KinhDoanhReport />} />
              </Route>
            </Route>
            <Route path='/login' element={<Login />} />
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}

export default App;

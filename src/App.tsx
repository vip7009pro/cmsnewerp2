import React, { Component, FC, useEffect, useState, lazy } from "react";
import Home from "./pages/home/Home";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LangConText, UserContext } from "../src/api/Context";
import { checkLogin, generalQuery } from "./api/Api";
import Login from "./pages/login/Login";
import KinhDoanh from "./pages/kinhdoanh/KinhDoanh";
import PoManager from "./pages/kinhdoanh/pomanager/PoManager";
import KinhDoanhReport from "./pages/kinhdoanh/kinhdoanhreport/KinhDoanhReport";
import InvoiceManager from "./pages/kinhdoanh/invoicemanager/InvoiceManager";
import PlanManager from "./pages/kinhdoanh/planmanager/PlanManager";
import FCSTManager from "./pages/kinhdoanh/fcstmanager/FCSTManager";
import YCSXManager from "./pages/kinhdoanh/ycsxmanager/YCSXManager";
import POandStockFull from "./pages/kinhdoanh/poandstockfull/POandStockFull";
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
import QuotationManager from "./pages/kinhdoanh/quotationmanager/QuotationManager";
import CODE_MANAGER from "./pages/rnd/code_manager/CODE_MANAGER";
import CUST_MANAGER from "./pages/kinhdoanh/custManager/CUST_MANAGER";
import BulletinBoard from "./components/BulletinBoard/BulletinBoard";
import QC from "./pages/qc/QC";
import KIEMTRA from "./pages/qc/inspection/KIEMTRA";
import PQC from "./pages/qc/pqc/PQC";
import IQC from "./pages/qc/iqc/IQC";
import CS from "./pages/qc/cs/CS";
import DTC from "./pages/qc/dtc/DTC";
import ISO from "./pages/qc/iso/ISO";
import OQC from "./pages/qc/oqc/OQC";
import QLSX from "./pages/qlsx/QLSX";
import BOM_MANAGER from "./pages/rnd/bom_manager/BOM_MANAGER";
import BOM_AMAZON from "./pages/rnd/bom_amazon/BOM_AMAZON";
import "./App.scss";
import QLSXPLAN from "./pages/qlsx/QLSXPLAN/QLSXPLAN";
import { RootState } from "./redux/store";
import { useSelector, useDispatch } from "react-redux";
import QuanLyCapCao from "./pages/nhansu/QuanLyCapCao/QuanLyCapCao";
import DESIGN_AMAZON from "./pages/rnd/design_amazon/DESIGN_AMAZON";
import {
  changeDiemDanhState,
  changeUserData,
  UserData,
  update_socket,
} from "./redux/slices/globalSlice";
import { useSpring, animated } from '@react-spring/web'
import DATASX from "./pages/qlsx/QLSXPLAN/DATASX/DATASX";
import PLAN_STATUS from "./pages/qlsx/QLSXPLAN/PLAN_STATUS/PLAN_STATUS";
import EQ_STATUS from "./pages/qlsx/QLSXPLAN/EQ_STATUS/EQ_STATUS";
import LICHSUINPUTLIEU from "./pages/qlsx/QLSXPLAN/LICHSUINPUTLIEU/LICHSUINPUTLIEU";

interface userDataInterface {
  EMPL_IMAGE?: string;
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
  maindeptname: string;
  jobname: string;
  children: Component;
}) => {
  if (user.EMPL_NO === "none") {
    /*  return <Navigate to='/login' replace />; */
    return <Login />;
  } else {
    if (
      maindeptname === "all" ||
      user.EMPL_NO === "NHU1903" ||
      user.EMPL_NO === "NVH1011" ||
      user.JOB_NAME === "ADMIN"
    ) {
      if (
        jobname === "all" ||
        user.EMPL_NO === "NHU1903" ||
        user.EMPL_NO === "NVH1011" ||
        user.JOB_NAME === "ADMIN"
      ) {
        return children;
      } else {
        if (
          user.JOB_NAME !== "Leader" &&
          user.JOB_NAME !== "Sub Leader" &&
          user.JOB_NAME !== "Dept Staff" &&
          user.JOB_NAME !== "ADMIN"
        ) {
          Swal.fire(
            "Thông báo",
            "Nội dung: Bạn không có quyền truy cập: ",
            "error"
          );
        } else {
          return children;
        }
      }
    } else {
      if (user.MAINDEPTNAME !== maindeptname) {
        Swal.fire(
          "Thông báo",
          "Nội dung: Bạn không phải người của bộ phận: " + maindeptname,
          "error"
        );
      } else {
        if (
          jobname === "all" ||
          user.EMPL_NO === "NHU1903" ||
          user.EMPL_NO === "NVH1011" ||
          user.JOB_NAME === "ADMIN"
        ) {
          return children;
        } else {
          if (
            user.JOB_NAME !== "Leader" &&
            user.JOB_NAME !== "Sub Leader" &&
            user.JOB_NAME !== "Dept Staff" &&
            user.JOB_NAME !== "ADMIN"
          ) {
            Swal.fire(
              "Thông báo",
              "Nội dung: Bạn không có quyền truy cập: ",
              "error"
            );
          } else {
            return children;
          }
        }
      }
    }
  }
};
function App() {
  const springs = useSpring({
    from: { x: 1000, y: 100 },
    to: { x: 0, y :0 },
  })
  const [lang, setLang] = useState("vi");
  const [userData, setUserData] = useState<userDataInterface | any>({
    ADD_COMMUNE: "Đông Xuân",
    ADD_DISTRICT: "Sóc Sơn",
    ADD_PROVINCE: "Hà Nội",
    ADD_VILLAGE: "Thôn Phú Thọ",
    ATT_GROUP_CODE: 1,
    CMS_ID: "CMS1179",
    CTR_CD: "002",
    DOB: "1993-10-18T00:00:00.000Z",
    EMAIL: "nvh1903@cmsbando.com",
    EMPL_NO: "none",
    FACTORY_CODE: 1,
    FACTORY_NAME: "Nhà máy 1",
    FACTORY_NAME_KR: "1공장",
    FIRST_NAME: "HÙNG3",
    HOMETOWN: "Phụ Thọ - Đông Xuân - Sóc Sơn - Hà Nội",
    JOB_CODE: 1,
    JOB_NAME: "Dept Staff",
    JOB_NAME_KR: "부서담당자",
    MAINDEPTCODE: 1,
    MAINDEPTNAME: "QC",
    MAINDEPTNAME_KR: "품질",
    MIDLAST_NAME: "NGUYỄN VĂN",
    ONLINE_DATETIME: "2022-07-12T20:49:52.600Z",
    PASSWORD: "xxx",
    PHONE_NUMBER: "0971092454",
    POSITION_CODE: 3,
    POSITION_NAME: "Staff",
    POSITION_NAME_KR: "사원",
    REMARK: null,
    SEX_CODE: 1,
    SEX_NAME: "Nam",
    SEX_NAME_KR: "남자",
    SUBDEPTCODE: 2,
    SUBDEPTNAME: "PD",
    SUBDEPTNAME_KR: "통역",
    WORK_POSITION_CODE: 2,
    WORK_POSITION_NAME: "PD",
    WORK_POSITION_NAME_KR: "PD",
    WORK_SHIFT_CODE: 0,
    WORK_SHIF_NAME: "Hành Chính",
    WORK_SHIF_NAME_KR: "정규",
    WORK_START_DATE: "2019-03-11T00:00:00.000Z",
    WORK_STATUS_CODE: 1,
    WORK_STATUS_NAME: "Đang làm",
    WORK_STATUS_NAME_KR: "근무중",
  });
  const [loginState, setLoginState] = useState(false);
  const trangthaidiemdanh: boolean | undefined = useSelector(
    (state: RootState) => state.totalSlice.diemdanhstate
  );
  const globalUserData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );

  const dispatch = useDispatch();
  //console.log(userData.JOB_NAME);
  useEffect(() => {    
    console.log("check login");   

    checkLogin()
      .then((data) => {
        //console.log(data);
        if (data.data.tk_status === "ng") {
          console.log("khong co token");
          setLoginState(false);
          dispatch(
            changeUserData({
              ADD_COMMUNE: "Đông Xuân",
              ADD_DISTRICT: "Sóc Sơn",
              ADD_PROVINCE: "Hà Nội",
              ADD_VILLAGE: "Thôn Phú Thọ",
              ATT_GROUP_CODE: 1,
              CMS_ID: "CMS1179",
              CTR_CD: "002",
              DOB: "1993-10-18T00:00:00.000Z",
              EMAIL: "nvh1903@cmsbando.com",
              EMPL_NO: "none",
              FACTORY_CODE: 1,
              FACTORY_NAME: "Nhà máy 1",
              FACTORY_NAME_KR: "1공장",
              FIRST_NAME: "HÙNG3",
              HOMETOWN: "Phụ Thọ - Đông Xuân - Sóc Sơn - Hà Nội",
              JOB_CODE: 1,
              JOB_NAME: "Dept Staff",
              JOB_NAME_KR: "부서담당자",
              MAINDEPTCODE: 1,
              MAINDEPTNAME: "QC",
              MAINDEPTNAME_KR: "품질",
              MIDLAST_NAME: "NGUYỄN VĂN",
              ONLINE_DATETIME: "2022-07-12T20:49:52.600Z",
              PASSWORD: "",
              PHONE_NUMBER: "0971092454",
              POSITION_CODE: 3,
              POSITION_NAME: "Staff",
              POSITION_NAME_KR: "사원",
              REMARK: "",
              SEX_CODE: 1,
              SEX_NAME: "Nam",
              SEX_NAME_KR: "남자",
              SUBDEPTCODE: 2,
              SUBDEPTNAME: "PD",
              SUBDEPTNAME_KR: "통역",
              WORK_POSITION_CODE: 2,
              WORK_POSITION_NAME: "PD",
              WORK_POSITION_NAME_KR: "PD",
              WORK_SHIFT_CODE: 0,
              WORK_SHIF_NAME: "Hành Chính",
              WORK_SHIF_NAME_KR: "정규",
              WORK_START_DATE: "2019-03-11T00:00:00.000Z",
              WORK_STATUS_CODE: 1,
              WORK_STATUS_NAME: "Đang làm",
              WORK_STATUS_NAME_KR: "근무중",
              EMPL_IMAGE: "N",
            })
          );
          setUserData({
            ADD_COMMUNE: "Đông Xuân",
            ADD_DISTRICT: "Sóc Sơn",
            ADD_PROVINCE: "Hà Nội",
            ADD_VILLAGE: "Thôn Phú Thọ",
            ATT_GROUP_CODE: 1,
            CMS_ID: "CMS1179",
            CTR_CD: "002",
            DOB: "1993-10-18T00:00:00.000Z",
            EMAIL: "nvh1903@cmsbando.com",
            EMPL_NO: "none",
            FACTORY_CODE: 1,
            FACTORY_NAME: "Nhà máy 1",
            FACTORY_NAME_KR: "1공장",
            FIRST_NAME: "HÙNG3",
            HOMETOWN: "Phụ Thọ - Đông Xuân - Sóc Sơn - Hà Nội",
            JOB_CODE: 1,
            JOB_NAME: "Dept Staff",
            JOB_NAME_KR: "부서담당자",
            MAINDEPTCODE: 1,
            MAINDEPTNAME: "QC",
            MAINDEPTNAME_KR: "품질",
            MIDLAST_NAME: "NGUYỄN VĂN",
            ONLINE_DATETIME: "2022-07-12T20:49:52.600Z",
            PASSWORD: "",
            PHONE_NUMBER: "0971092454",
            POSITION_CODE: 3,
            POSITION_NAME: "Staff",
            POSITION_NAME_KR: "사원",
            REMARK: null,
            SEX_CODE: 1,
            SEX_NAME: "Nam",
            SEX_NAME_KR: "남자",
            SUBDEPTCODE: 2,
            SUBDEPTNAME: "PD",
            SUBDEPTNAME_KR: "통역",
            WORK_POSITION_CODE: 2,
            WORK_POSITION_NAME: "PD",
            WORK_POSITION_NAME_KR: "PD",
            WORK_SHIFT_CODE: 0,
            WORK_SHIF_NAME: "Hành Chính",
            WORK_SHIF_NAME_KR: "정규",
            WORK_START_DATE: "2019-03-11T00:00:00.000Z",
            WORK_STATUS_CODE: 1,
            WORK_STATUS_NAME: "Đang làm",
            WORK_STATUS_NAME_KR: "근무중",
            EMPL_IMAGE: "N",
          });
        } else {
          //console.log(data.data.data);
          setUserData(data.data.data);
          dispatch(changeUserData(data.data.data));
          dispatch(update_socket(data.data.data.EMPL_NO + " da dangnhap"));
          setLoginState(true);
        }
      })
      .catch((err) => {
        console.log(err + " ");
      });

    generalQuery("checkdiemdanh", {})
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
          //console.log('diem danh ok');
          dispatch(changeDiemDanhState(true));
          //setDiemDanhState(true);
        } else {
          //console.log('diem danh NG');
          dispatch(changeDiemDanhState(false));
          //setDiemDanhState(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    return () => {};
  }, []);

  //console.log(userData);
  if (loginState === true) {
    return (
      <div className='App'>
        <LangConText.Provider value={[lang, setLang]}>
          <UserContext.Provider value={[userData, setUserData]}>
            <BrowserRouter>
              <Routes>
                <Route
                  path='/'
                  element={
                    <ProtectedRoute
                      user={globalUserData}
                      maindeptname='all'
                      jobname='all'
                    >
                      <animated.div
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: 8,
                          ...springs,
                        }}
                      >
                        <Home />
                      </animated.div>
                    </ProtectedRoute>
                  }
                >
                  <Route
                    index
                    element={
                      !(
                        trangthaidiemdanh === true ||
                        globalUserData?.JOB_NAME === "Worker"
                      ) ? (
                        <DiemDanhNhom />
                      ) : (
                        <BulletinBoard />
                      )
                    }
                  />
                  <Route path='accountinfo' element={<AccountInfo />}></Route>
                  <Route
                    path='kinhdoanh'
                    element={
                      <ProtectedRoute
                        user={userData}
                        maindeptname='KD'
                        jobname='all'
                      >
                        <KinhDoanh />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<KinhDoanhReport />} />
                    <Route path='pomanager' element={<PoManager />} />
                    <Route path='invoicemanager' element={<InvoiceManager />} />
                    <Route path='planmanager' element={<PlanManager />} />
                    <Route path='fcstmanager' element={<FCSTManager />} />
                    <Route path='ycsxmanager' element={<YCSXManager />} />
                    <Route path='quanlycodebom' element={<BOM_MANAGER />} />
                    <Route path='poandstockfull' element={<POandStockFull />} />
                    <Route
                      path='kinhdoanhreport'
                      element={<KinhDoanhReport />}
                    />
                    <Route path='codeinfo' element={<CODE_MANAGER />} />
                    <Route path='customermanager' element={<CUST_MANAGER />} />
                    <Route
                      path='quotationmanager'
                      element={<QuotationManager />}
                    />
                    <Route
                      path='eqstatus'
                      element={<EQ_STATUS />}
                    />                    
                  </Route>
                  <Route
                    path='rnd'
                    element={
                      <ProtectedRoute
                        user={userData}
                        maindeptname='RND'
                        jobname='all'
                      >
                        <KinhDoanh />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<KinhDoanhReport />} />
                    <Route path='quanlycodebom' element={<BOM_MANAGER />} />
                    <Route path='ycsxmanager' element={<YCSXManager />} />
                    <Route path='thembomamazon' element={<BOM_AMAZON />} />
                    <Route path='designamazon' element={<DESIGN_AMAZON />} />
                  </Route>
                  <Route
                    path='qlsx'
                    element={
                      <ProtectedRoute
                        user={globalUserData}
                        maindeptname='QLSX'
                        jobname='all'
                      >
                        <QLSX />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<QLSX />} />
                    <Route path='ycsxmanager' element={<YCSXManager />} />
                    <Route path='codeinfo' element={<CODE_MANAGER />} />
                    <Route path='qlsxplan' element={<QLSXPLAN />} />
                    <Route path='quanlycodebom' element={<BOM_MANAGER />} />
                  </Route>
                  <Route
                    path='qc'
                    element={
                      <ProtectedRoute
                        user={userData}
                        maindeptname='QC'
                        jobname='all'
                      >
                        <QC />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<AccountInfo />} />
                    <Route
                      path='tracuuchung'
                      element={
                        <ProtectedRoute
                          user={userData}
                          maindeptname='QC'
                          jobname='Leader'
                        >
                          <IQC />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path='codeinfo'
                      element={
                        <ProtectedRoute
                          user={userData}
                          maindeptname='QC'
                          jobname='Leader'
                        >
                          <CODE_MANAGER />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path='iqc'
                      element={
                        <ProtectedRoute
                          user={userData}
                          maindeptname='QC'
                          jobname='Leader'
                        >
                          <IQC />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path='pqc'
                      element={
                        <ProtectedRoute
                          user={userData}
                          maindeptname='QC'
                          jobname='Leader'
                        >
                          <PQC />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path='oqc'
                      element={
                        <ProtectedRoute
                          user={userData}
                          maindeptname='QC'
                          jobname='Leader'
                        >
                          <OQC />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path='inspection'
                      element={
                        <ProtectedRoute
                          user={userData}
                          maindeptname='QC'
                          jobname='Leader'
                        >
                          <KIEMTRA />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path='cs'
                      element={
                        <ProtectedRoute
                          user={userData}
                          maindeptname='QC'
                          jobname='Leader'
                        >
                          <CS />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path='dtc'
                      element={
                        <ProtectedRoute
                          user={userData}
                          maindeptname='QC'
                          jobname='Leader'
                        >
                          <DTC />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path='iso'
                      element={
                        <ProtectedRoute
                          user={userData}
                          maindeptname='QC'
                          jobname='Leader'
                        >
                          <ISO />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path='qcreport'
                      element={
                        <ProtectedRoute
                          user={userData}
                          maindeptname='QC'
                          jobname='Leader'
                        >
                          <QC />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path='ycsxmanager'
                      element={
                        <ProtectedRoute
                          user={userData}
                          maindeptname='QC'
                          jobname='Leader'
                        >
                          <YCSXManager />
                        </ProtectedRoute>
                      }
                    />
                  </Route>
                  <Route
                    path='sx'
                    element={
                      <ProtectedRoute
                        user={userData}
                        maindeptname='SX'
                        jobname='all'
                      >
                        <QC />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<AccountInfo />} />
                    <Route
                      path='tracuuchung'
                      element={
                        <ProtectedRoute
                          user={userData}
                          maindeptname='QC'
                          jobname='Leader'
                        >
                          <IQC />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path='codeinfo'
                      element={
                        <ProtectedRoute
                          user={userData}
                          maindeptname='SX'
                          jobname='Leader'
                        >
                          <CODE_MANAGER />
                        </ProtectedRoute>
                      }
                    />               
                    <Route
                      path='ycsxmanager'
                      element={
                        <ProtectedRoute
                          user={userData}
                          maindeptname='SX'
                          jobname='Leader'
                        >
                          <YCSXManager />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path='datasx'
                      element={
                        <ProtectedRoute
                          user={userData}
                          maindeptname='SX'
                          jobname='Leader'
                        >
                          <DATASX />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path='planstatus'
                      element={
                        <ProtectedRoute
                          user={userData}
                          maindeptname='SX'
                          jobname='Leader'
                        >
                          <PLAN_STATUS />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path='eqstatus'
                      element={
                        <ProtectedRoute
                          user={userData}
                          maindeptname='SX'
                          jobname='Leader'
                        >
                          <EQ_STATUS />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path='lichsuxuatlieu'
                      element={
                        <ProtectedRoute
                          user={userData}
                          maindeptname='SX'
                          jobname='Leader'
                        >
                          <LICHSUINPUTLIEU />
                        </ProtectedRoute>
                      }
                    />
                    
                  </Route>
                  <Route
                    path='nhansu'
                    element={
                      <ProtectedRoute
                        user={globalUserData}
                        maindeptname='all'
                        jobname='all'
                      >
                        <NhanSu />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<AccountInfo />} />
                    <Route
                      path='quanlyphongbannhanvien'
                      element={
                        <ProtectedRoute
                          user={globalUserData}
                          maindeptname='all'
                          jobname='leader'
                        >
                          <QuanLyPhongBanNhanSu />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path='diemdanhnhom'
                      element={
                        <ProtectedRoute
                          user={globalUserData}
                          maindeptname='all'
                          jobname='leader'
                        >
                          <DiemDanhNhom />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path='dieuchuyenteam'
                      element={
                        <ProtectedRoute
                          user={globalUserData}
                          maindeptname='all'
                          jobname='leader'
                        >
                          <DieuChuyenTeam />
                        </ProtectedRoute>
                      }
                    />
                    <Route path='dangky' element={<TabDangKy />} />
                    <Route
                      path='pheduyetnghi'
                      element={
                        <ProtectedRoute
                          user={globalUserData}
                          maindeptname='all'
                          jobname='leader'
                        >
                          <PheDuyetNghi />
                        </ProtectedRoute>
                      }
                    />
                    <Route path='lichsu' element={<LichSu />} />
                    <Route
                      path='baocaonhansu'
                      element={
                        <ProtectedRoute
                          user={globalUserData}
                          maindeptname='all'
                          jobname='leader'
                        >
                          <BaoCaoNhanSu />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path='quanlycapcao'
                      element={
                        <ProtectedRoute
                          user={globalUserData}
                          maindeptname='all'
                          jobname='leader'
                        >
                          <QuanLyCapCao />
                        </ProtectedRoute>
                      }
                    />
                  </Route>
                </Route>
              </Routes>
            </BrowserRouter>
          </UserContext.Provider>
        </LangConText.Provider>
      </div>
    );
  } else {
    return (
      <div>
        <LangConText.Provider value={[lang, setLang]}>
          <UserContext.Provider value={[userData, setUserData]}>
            <Login />
          </UserContext.Provider>
        </LangConText.Provider>
      </div>
    );
  }
}
export default App;

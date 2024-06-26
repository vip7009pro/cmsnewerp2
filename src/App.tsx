import "devextreme/dist/css/dx.light.css";
import React, {
  Component,
  FC,
  useEffect,
  useState,
  lazy,
  Suspense,
  useMemo,
} from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LangConText, UserContext } from "../src/api/Context";
import { checkLogin, generalQuery, getCompany, getSocket, getUserData, logout as LGOUTF } from "./api/Api";
import Swal from "sweetalert2";
import { RootState } from "./redux/store";
import { useSelector, useDispatch } from "react-redux";
import {
  changeDiemDanhState,
  changeUserData,
  update_socket,
  logout,
  login,
  setTabModeSwap,
  changeGLBSetting,
  changeServer,
} from "./redux/slices/globalSlice";
import { useSpring, animated } from "@react-spring/web";
import "./App.scss";
import FallBackComponent from "./components/Fallback/FallBackComponent";
import { Button } from "@mui/material";
import { UserData, WEB_SETTING_DATA } from "./api/GlobalInterface";
import Home, { current_ver } from "./pages/home/Home";
import { Notifications } from 'react-push-notification';
import KHOTABS from "./pages/kho/KHOTABS";
import KHOTP from "./pages/kho/khotp/KHOTP";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import BulletinBoard from "./components/BulletinBoard/BulletinBoard";
import DiemDanhNhom from "./pages/nhansu/DiemDanhNhom/DiemDanhNhom";
import AccountInfo from "./components/Navbar/AccountInfo/AccountInfo";
import KinhDoanh from "./pages/kinhdoanh/KinhDoanh";
import KinhDoanhReport from "./pages/kinhdoanh/kinhdoanhreport/KinhDoanhReport";
import PoManager from "./pages/kinhdoanh/pomanager/PoManager";
import InvoiceManager from "./pages/kinhdoanh/invoicemanager/InvoiceManager";
import PlanManager from "./pages/kinhdoanh/planmanager/PlanManager";
import FCSTManager from "./pages/kinhdoanh/fcstmanager/FCSTManager";
import YCSXManager from "./pages/kinhdoanh/ycsxmanager/YCSXManager";
import Login from "./pages/login/Login";
import BOM_MANAGER from "./pages/rnd/bom_manager/BOM_MANAGER";
import POandStockFull from "./pages/kinhdoanh/poandstockfull/POandStockFull";
import CODE_MANAGER from "./pages/rnd/code_manager/CODE_MANAGER";
import CUST_MANAGER from "./pages/kinhdoanh/custManager/CUST_MANAGER";
import QuotationTotal from "./pages/kinhdoanh/quotationmanager/QuotationTotal";
import EQ_STATUS from "./pages/qlsx/QLSXPLAN/EQ_STATUS/EQ_STATUS";
import INSPECT_STATUS from "./pages/qc/inspection/INSPECT_STATUS/INSPECT_STATUS";
import ShortageKD from "./pages/kinhdoanh/shortageKD/ShortageKD";
import BOM_AMAZON from "./pages/rnd/bom_amazon/BOM_AMAZON";
import DESIGN_AMAZON from "./pages/rnd/design_amazon/DESIGN_AMAZON";
import PRODUCT_BARCODE_MANAGER from "./pages/rnd/product_barcode_manager/PRODUCT_BARCODE_MANAGER";
import QLGN from "./pages/rnd/quanlygiaonhandaofilm/QLGN";
import QLSX from "./pages/qlsx/QLSX";
import QLSXPLAN from "./pages/qlsx/QLSXPLAN/QLSXPLAN";
import CAPASX from "./pages/qlsx/QLSXPLAN/CAPA/CAPASX";
import TINHLIEU from "./pages/muahang/tinhlieu/TINHLIEU";
import MUAHANG from "./pages/muahang/MUAHANG";
import QLVL from "./pages/muahang/quanlyvatlieu/QLVL";
import KHOTOTAL from "./pages/kho/KHOTOTAL";
import KHOTPNEW from "./pages/kho/khotp_new/KHOTPNEW";
import KHOLIEU from "./pages/kho/kholieu/KHOLIEU";
import SettingPage from "./pages/setting/SettingPage";
import DTC from "./pages/qc/dtc/DTC";
import QC from "./pages/qc/QC";
import IQC from "./pages/qc/iqc/IQC";
import PQC from "./pages/qc/pqc/PQC";
import OQC from "./pages/qc/oqc/OQC";
import KIEMTRA from "./pages/qc/inspection/KIEMTRA";
import CSTOTAL from "./pages/qc/cs/CSTOTAL";
import ISO from "./pages/qc/iso/ISO";
import QCReport from "./pages/qc/qcreport/QCReport";
import BAOCAOSXALL from "./pages/sx/BAOCAOSXALL";
import TRANGTHAICHITHI from "./pages/sx/TRANGTHAICHITHI/TRANGTHAICHITHI";
import LICHSUINPUTLIEU from "./pages/qlsx/QLSXPLAN/LICHSUINPUTLIEU/LICHSUINPUTLIEU";
import LICHSUTEMLOTSX from "./pages/sx/LICHSUTEMLOTSX/LICHSUTEMLOTSX";
import TINHHINHCUONLIEU from "./pages/sx/TINH_HINH_CUON_LIEU/TINHINHCUONLIEU";
import BAOCAOTHEOROLL from "./pages/sx/BAOCAOTHEOROLL/BAOCAOTHEOROLL";
import KHOAO from "./pages/qlsx/QLSXPLAN/KHOAO/KHOAO";
import CAPA_MANAGER from "./pages/qlsx/QLSXPLAN/CAPA/CAPA_MANAGER";
import PLANRESULT from "./pages/sx/PLANRESULT/PLANRESULT";
import NhanSu from "./pages/nhansu/NhanSu";
import QuanLyPhongBanNhanSu from "./pages/nhansu/QuanLyPhongBanNhanSu/QuanLyPhongBanNhanSu";
import DieuChuyenTeam from "./pages/nhansu/DieuChuyenTeam/DieuChuyenTeam";
import TabDangKy from "./pages/nhansu/DangKy/TabDangKy";
import PheDuyetNghi from "./pages/nhansu/PheDuyetNghi/PheDuyetNghi";
import LichSu from "./pages/nhansu/LichSu/LichSu";
import BaoCaoNhanSu from "./pages/nhansu/BaoCaoNhanSu/BaoCaoNhanSu";
import QuanLyCapCao from "./pages/nhansu/QuanLyCapCao/QuanLyCapCao";
import BANGCHAMCONG from "./pages/nhansu/BangChamCong/BangChamCong";
import RND_REPORT from "./pages/rnd/rnd_report/RND_REPORT";
import Blank from "./components/Blank/Blank";
import SAMPLE_MONITOR from "./pages/rnd/sample monitor/SAMPLE_MONITOR";

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
  const loadWebSetting = () => {
    generalQuery("loadWebSetting", {
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          let crST_string: any = localStorage.getItem("setting") ?? '';
          let loadeddata: WEB_SETTING_DATA[] = [];
          if (crST_string !== '') {
            let crST: WEB_SETTING_DATA[] = JSON.parse(crST_string);
            loadeddata = response.data.data.map(
              (element: WEB_SETTING_DATA, index: number) => {
                return {
                  ...element,
                  CURRENT_VALUE: crST.filter((ele: WEB_SETTING_DATA, id: number) => ele.ID === element.ID)[0]?.CURRENT_VALUE ?? element.DEFAULT_VALUE
                };
              }
            );
          }
          else {
            loadeddata = response.data.data.map(
              (element: WEB_SETTING_DATA, index: number) => {
                return {
                  ...element,
                  CURRENT_VALUE: element.DEFAULT_VALUE
                };
              }
            );
          }
          dispatch(changeGLBSetting(loadeddata));
        } else {
          dispatch(changeGLBSetting([]));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const springs = useSpring({
    from: { x: 1000, y: 100 },
    to: { x: 0, y: 0 },
  });
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
  /*   const [loginState, setLoginState] = useState(false); */
  const trangthaidiemdanh: boolean | undefined = useSelector(
    (state: RootState) => state.totalSlice.diemdanhstate
  );
  const globalLoginState: boolean | undefined = useSelector(
    (state: RootState) => state.totalSlice.loginState
  );
  const globalUserData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );
  const loginState: boolean | undefined = useSelector(
    (state: RootState) => state.totalSlice.loginState
  );
  const dispatch = useDispatch();
  //console.log(userData.JOB_NAME);
  useEffect(() => {
    console.log("check login");
    checkLogin()
      .then((data) => {
        //console.log(data);
        if (data.data.tk_status === "ng") {
          /* console.log("khong co token");
          setLoginState(false); */
          loadWebSetting();
          dispatch(logout(false));
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
          /* checkERPLicense(); */
          setUserData(data.data.data);
          dispatch(changeUserData(data.data.data));
          console.log('data.data.data.POSITION_CODE', data.data.data.POSITION_CODE)
          if (data.data.data.POSITION_CODE === 4) {
            dispatch(setTabModeSwap(false));
          }
          //dispatch(update_socket(data.data.data.EMPL_NO + " da dangnhap"));
          dispatch(
            update_socket({
              event: "login",
              data: data.data.data.EMPL_NO,
            })
          );
          /* setLoginState(true); */
          dispatch(login(true));
        }
      })
      .catch((err) => {
        console.log(err + " ");
      });
    console.log("check diem danh");
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
    if (!getSocket().hasListeners('setWebVer')) {
      console.log('vao set sever')
      getSocket().on("setWebVer", (data: any) => {
        console.log(data);
        if (current_ver >= data) {
        } else {
          Swal.fire({
            title: "ERP has updates?",
            text: "Update Web",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Update",
            cancelButtonText: "Update later",
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire("Notification", "Update Web", "success");
              window.location.reload();
            } else {
              Swal.fire(
                "Notification",
                "Press Ctrl + F5 to update the Web",
                "info"
              );
            }
          });
        }
      });
    }
    if (!getSocket().hasListeners('request_check_online2')) {
      //console.log('kich hoat nhan thogn tin check online');
      getSocket().on("request_check_online2", (data: any) => {
        //console.log('co request check online', data);
        //Swal.fire('Thông báo','Có yêu cầu check online từ server','info');
        getSocket().emit("respond_check_online", getUserData());
      });
    }
    if (!getSocket().hasListeners('changeServer')) {
      getSocket().on("changeServer", (data: any) => {
        console.log("Change server commnand received !");
        console.log(data.server);
        if (getCompany() === 'CMS' && (data.empl_no.toUpperCase() === getUserData()?.EMPL_NO?.toUpperCase() || data.empl_no.toUpperCase() === 'ALL')) {
          dispatch(changeServer(data.server));
          localStorage.setItem("server_ip", data.server);
        }
      });
    }
    return () => {
      getSocket().off("setWebVer", (data: any) => {
        //console.log(data);
      });
      getSocket().off("request_check_online", (data: any) => {
        //console.log(data);
      });
    };
  }, []);
  return (
    <>
      {globalLoginState && (
        <div className='App'>
          <Suspense fallback={<FallBackComponent />}>
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
                              /*...springs,*/
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
                      <Route
                        path='accountinfo'
                        element={<AccountInfo />}
                      ></Route>
                      <Route
                        path='kinhdoanh'
                        element={
                          <ProtectedRoute
                            user={globalUserData}
                            maindeptname='all'
                            jobname='Leader'
                          >
                            <KinhDoanh />
                          </ProtectedRoute>
                        }
                      >
                        <Route index element={<KinhDoanhReport />} />
                        <Route path='pomanager' element={<PoManager />} />
                        <Route
                          path='invoicemanager'
                          element={<InvoiceManager />}
                        />
                        <Route path='planmanager' element={<PlanManager />} />
                        <Route path='fcstmanager' element={<FCSTManager />} />
                        <Route path='ycsxmanager' element={<YCSXManager />} />
                        <Route path='quanlycodebom' element={<BOM_MANAGER />} />
                        <Route
                          path='poandstockfull'
                          element={<POandStockFull />}
                        />
                        <Route
                          path='kinhdoanhreport'
                          element={<KinhDoanhReport />}
                        />
                        <Route path='codeinfo' element={<CODE_MANAGER />} />
                        <Route
                          path='customermanager'
                          element={<CUST_MANAGER />}
                        />
                        <Route
                          path='quotationmanager'
                          element={<QuotationTotal />}
                        />
                        <Route path='eqstatus' element={<EQ_STATUS />} />
                        <Route path='ins_status' element={<INSPECT_STATUS />} />
                        <Route path='shortage' element={<ShortageKD />} />
                      </Route>
                      <Route
                        path='rnd'
                        element={
                          <ProtectedRoute
                            user={globalUserData}
                            maindeptname='all'
                            jobname='Leader'
                          >
                            <KinhDoanh />
                          </ProtectedRoute>
                        }
                      >
                        <Route index element={<KinhDoanhReport />} />
                        <Route path='quanlycodebom' element={<BOM_MANAGER />} />
                        <Route path='ycsxmanager' element={<YCSXManager />} />
                        <Route path='dtc' element={<DTC />} />
                        <Route path='thembomamazon' element={<BOM_AMAZON />} />
                        <Route path='designamazon' element={<DESIGN_AMAZON />}/>
                        <Route path='productbarcodemanager' element={<PRODUCT_BARCODE_MANAGER />}/>
                        <Route path='quanlygiaonhan' element={<QLGN />} />
                        <Route path='samplemonitor' element={<SAMPLE_MONITOR />} />
                        <Route path='baocaornd' element={getCompany() ==='CMS' ?  <RND_REPORT /> : <Blank/>} />
                        
                      </Route>
                      <Route
                        path='qlsx'
                        element={
                          <ProtectedRoute
                            user={globalUserData}
                            maindeptname='all'
                            jobname='Leader'
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
                        <Route path='capamanager' element={<CAPASX />} />
                        <Route path='qlsxmrp' element={<TINHLIEU />} />
                      </Route>
                      <Route
                        path='phongmuahang'
                        element={
                          <ProtectedRoute
                            user={globalUserData}
                            maindeptname='all'
                            jobname='Leader'
                          >
                            <MUAHANG />
                          </ProtectedRoute>
                        }
                      >
                        <Route index element={<MUAHANG />} />
                        <Route path='quanlyvatlieu' element={<QLVL />} />
                        <Route path='mrp' element={<TINHLIEU />} />
                      </Route>
                      <Route
                        path='bophankho'
                        element={
                          <ProtectedRoute
                            user={globalUserData}
                            maindeptname='all'
                            jobname='Leader'
                          >
                            <KHOTOTAL />
                          </ProtectedRoute>
                        }
                      >
                        <Route index element={<KHOTABS />} />
                        <Route path='khotabs' element={<KHOTABS />} />
                        <Route path='nhapxuattontp' element={getCompany() !== 'CMS' ? <KHOTPNEW /> : <KHOTP />} />
                        <Route path='nhapxuattonlieu' element={<KHOLIEU />} />
                      </Route>
                      <Route
                        path='setting'
                        element={
                          <ProtectedRoute
                            user={globalUserData}
                            maindeptname='all'
                            jobname='Leader'
                          >
                            <SettingPage />
                          </ProtectedRoute>
                        }
                      >
                        <Route index element={<SettingPage />} />
                      </Route>
                      <Route
                        path='qc'
                        element={
                          <ProtectedRoute
                            user={globalUserData}
                            maindeptname='all'
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
                              user={globalUserData}
                              maindeptname='all'
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
                              user={globalUserData}
                              maindeptname='all'
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
                              user={globalUserData}
                              maindeptname='all'
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
                              user={globalUserData}
                              maindeptname='all'
                              jobname='all'
                            >
                              <PQC />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='oqc'
                          element={
                            <ProtectedRoute
                              user={globalUserData}
                              maindeptname='all'
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
                              user={globalUserData}
                              maindeptname='all'
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
                              user={globalUserData}
                              maindeptname='all'
                              jobname='Leader'
                            >
                              <CSTOTAL />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='dtc'
                          element={
                            <ProtectedRoute
                              user={globalUserData}
                              maindeptname='all'
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
                              user={globalUserData}
                              maindeptname='all'
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
                              user={globalUserData}
                              maindeptname='all'
                              jobname='Leader'
                            >
                              {getCompany() ==='CMS' ?  <QCReport /> : <Blank/>}
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='ycsxmanager'
                          element={
                            <ProtectedRoute
                              user={globalUserData}
                              maindeptname='all'
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
                            user={globalUserData}
                            maindeptname='all'
                            jobname='Leader'
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
                              user={globalUserData}
                              maindeptname='all'
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
                              user={globalUserData}
                              maindeptname='all'
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
                              user={globalUserData}
                              maindeptname='all'
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
                              user={globalUserData}
                              maindeptname='all'
                              jobname='Leader'
                            >
                              <BAOCAOSXALL />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='planstatus'
                          element={
                            <ProtectedRoute
                              user={globalUserData}
                              maindeptname='all'
                              jobname='Leader'
                            >
                              <TRANGTHAICHITHI />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='eqstatus'
                          element={
                            <ProtectedRoute
                              user={globalUserData}
                              maindeptname='all'
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
                              user={globalUserData}
                              maindeptname='all'
                              jobname='Leader'
                            >
                              <LICHSUINPUTLIEU />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='lichsutemlotsx'
                          element={
                            <ProtectedRoute
                              user={globalUserData}
                              maindeptname='all'
                              jobname='Leader'
                            >
                              <LICHSUTEMLOTSX />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='materiallotstatus'
                          element={
                            <ProtectedRoute
                              user={globalUserData}
                              maindeptname='all'
                              jobname='Leader'
                            >
                              <TINHHINHCUONLIEU />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='rolldata'
                          element={
                            <ProtectedRoute
                              user={globalUserData}
                              maindeptname='all'
                              jobname='Leader'
                            >
                              <BAOCAOTHEOROLL />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='khoao'
                          element={
                            <ProtectedRoute
                              user={globalUserData}
                              maindeptname='all'
                              jobname='Leader'
                            >
                              <KHOAO />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='khothat'
                          element={
                            <ProtectedRoute
                              user={globalUserData}
                              maindeptname='all'
                              jobname='Leader'
                            >
                              <KHOLIEU />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='inspection'
                          element={
                            <ProtectedRoute
                              user={globalUserData}
                              maindeptname='all'
                              jobname='Leader'
                            >
                              <KIEMTRA />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='capamanager'
                          element={
                            <ProtectedRoute
                              user={globalUserData}
                              maindeptname='all'
                              jobname='Leader'
                            >
                              <CAPA_MANAGER />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='planresult'
                          element={
                            <ProtectedRoute
                              user={globalUserData}
                              maindeptname='all'
                              jobname='Leader'
                            >
                              <PLANRESULT />
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
                        <Route
                          path='listchamcong'
                          element={
                            <ProtectedRoute
                              user={globalUserData}
                              maindeptname='NS'
                              jobname='leader'
                            >
                              <BANGCHAMCONG />
                            </ProtectedRoute>
                          }
                        />
                      </Route>
                    </Route>
                  </Routes>
                </BrowserRouter>
              </UserContext.Provider>
            </LangConText.Provider>
          </Suspense>
        </div>
      )}
      {!globalLoginState && (
        <div>
          <LangConText.Provider value={[lang, setLang]}>
            <UserContext.Provider value={[userData, setUserData]}>
              <Login />
            </UserContext.Provider>
          </LangConText.Provider>
        </div>
      )}
      <Notifications />
    </>
  );
}
export default App;

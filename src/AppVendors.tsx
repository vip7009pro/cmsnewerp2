import "devextreme/dist/css/dx.light.css";
import { Component, useEffect, Suspense, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { checkLogin, generalQuery, getCompany, getGlobalSetting, getNotiCount, getSocket, getUserData } from "./api/ApiVendors";
import Swal from "sweetalert2";
import { RootState } from "./redux/store";
import { useSelector, useDispatch } from "react-redux";
import {
  changeUserData,
  update_socket,
  setTabModeSwap,
  changeGLBSetting,
  changeServer,
  updateNotiCount,
  vendorLogout,
  vendorLogin,
} from "./redux/slices/globalSlice";
import { animated } from "@react-spring/web";
import "./App.scss";
import FallBackComponent from "./components/Fallback/FallBackComponent";
import { UserData, userDataInterface, WEB_SETTING_DATA } from "./api/GlobalInterface";
import { current_ver } from "./pages/home/Home";
import { Notifications } from 'react-push-notification';

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { NotificationElement } from "./components/NotificationPanel/Notification";
import { enqueueSnackbar } from "notistack";
import LoginVendors from "./pages/login/LoginVendors";
import HomeVendors from "./pages/home/HomeVendors";

import { AccountInfo, AddInfo, BANGCHAMCONG, BaoCaoNhanSu, BAOCAOSXALL, BAOCAOTHEOROLL, BCSX, Blank, BOM_AMAZON, BOM_MANAGER, BulletinBoard, CAPA_MANAGER, CAPASX2, CODE_MANAGER, CSTOTAL, CUST_MANAGER, DESIGN_AMAZON, DiemDanhNhomCMS, DieuChuyenTeam, DTC, EQ_STATUS, FCSTManager, FileTransfer, Info, Information, INSPECT_STATUS, InvoiceManager, IQC, ISO, KHOAO, KHOLIEU, KHOSUB, KHOSX, KHOTABS, KHOTOTAL, KHOTP, KHOTPNEW, KIEMTRA, KinhDoanh, KinhDoanhReport, LichSu, LICHSUINPUTLIEU, LICHSUTEMLOTSX, Login, MUAHANG, NhanSu, NOLOWHOME, OQC, OVER_MONITOR, PheDuyetNghiCMS, PlanManager, PLANRESULT, POandStockFull, PoManager, PostManager, PQC, PRODUCT_BARCODE_MANAGER, QC, QCReport, QLGN, QLSX, QLSXPLAN, QLVL, QuanLyCapCao, QuanLyCapCao_NS, QuanLyPhongBanNhanSu, QuotationTotal, RND_REPORT, SAMPLE_MONITOR, SettingPage, ShortageKD, TabDangKy, TINHHINHCUONLIEU, TINHLIEU, TINHLUONGP3, TRANGTHAICHITHI, YCSXManager } from "./api/lazyPages";
import { ProtectedRoute } from "./api/GlobalFunction";

function AppVendors() {
  const full_screen: number = parseInt(getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'FULL_SCREEN')[0]?.CURRENT_VALUE ?? '0');
  const elementRef = useRef(null);
  const requestFullScreen = () => {
    if (elementRef.current && full_screen === 1) {
      const element = elementRef.current as HTMLElement;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if ('mozRequestFullScreen' in element) { // Firefox
        (element as any).mozRequestFullScreen();
      } else if ('webkitRequestFullscreen' in element) { // Chrome, Safari and Opera
        (element as any).webkitRequestFullscreen();
      } else if ('msRequestFullscreen' in element) { // IE/Edge
        (element as any).msRequestFullscreen();
      }
    }
  };

  const swalContainer = document.querySelector('.swal2-container');
  if (swalContainer instanceof HTMLElement) {
    swalContainer.style.zIndex = '9999';
  }
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
  const trangthaidiemdanh: boolean | undefined = useSelector(
    (state: RootState) => state.totalSlice.diemdanhstate
  );
  const globalLoginState: boolean | undefined = useSelector(
    (state: RootState) => state.totalSlice.loginState
  );
  const globalVendorLoginState: boolean | undefined = useSelector(
    (state: RootState) => state.totalSlice.vendorLoginState
  );
  const globalUserData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );
  const dispatch = useDispatch();
  //console.log(userData.JOB_NAME);
  useEffect(() => {     
    checkLogin()
      .then((data) => {
        //console.log(data);
        if (data.data.tk_status === "ng") {
          /* console.log("khong co token");
          setLoginState(false); */
          loadWebSetting();
          dispatch(vendorLogout(false));
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
        } else {
          //console.log(data.data.data);
          /* checkERPLicense(); */         
          dispatch(changeUserData(data.data.data));   
          //console.log('data.data.data.JOB_NAME',data.data.data.JOB_NAME)
          
          if(data.data.data.JOB_NAME ==='Worker') 
          {
            console.log('set tab mode')
            dispatch(setTabModeSwap(false));
          }
                
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
          dispatch(vendorLogin(true));
        }
      })
      .catch((err) => {
        console.log(err + " ");
      });
   
   
    if (!getSocket().hasListeners('setWebVer')) {
      //console.log('vao set sever')
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
    const showNoti =  (data: NotificationElement) => {
      dispatch(updateNotiCount((getNotiCount()??0)+1));
      localStorage.setItem("notification_count",((getNotiCount()??0)+1).toString());
      switch(data.NOTI_TYPE) {
        case 'success':
          enqueueSnackbar(data.CONTENT, {
            variant: 'success',
          });
          break;
        case 'error':
          enqueueSnackbar(data.CONTENT, {
            variant: 'error',
          });
          break;
        case 'warning':
          enqueueSnackbar(data.CONTENT, {
            variant: 'warning',
          });
          break;
        case 'info':
          enqueueSnackbar(data.CONTENT, {
            variant: 'info',
          });
          break;
        default:
          enqueueSnackbar(data.CONTENT, {
            variant: 'success',
          });
          break;
      }  

    }
    if (!getSocket().hasListeners('notification_panel')) {     
      getSocket().on("notification_panel", (data: NotificationElement) => {    
        //console.log(data);
        let mainDeptArray = data.MAINDEPTNAME?.split(',');
        //console.log('mainDeptArray',mainDeptArray);
        //console.log('user',getUserData()?.MAINDEPTNAME);
       /*  if(!mainDeptArray || !mainDeptArray.includes((getUserData()?.MAINDEPTNAME??'ALL')) || (getUserData()?.JOB_NAME !== 'Leader' && getUserData()?.JOB_NAME !== 'Sub Leader' && getUserData()?.JOB_NAME !== 'Dept Staff' )){
          return;
        } */
        //console.log('notiCount---',getNotiCount())
        if(getCompany() !=='CMS') return;
        if(getUserData()?.EMPL_NO==='NHU1903') 
        {
          showNoti(data);
        }
        else {
          if(!mainDeptArray || !mainDeptArray.includes((getUserData()?.MAINDEPTNAME??'ALL')) || (getUserData()?.JOB_NAME !== 'Leader' && getUserData()?.JOB_NAME !== 'Sub Leader' && getUserData()?.JOB_NAME !== 'Dept Staff' )){
            return;
          }
          showNoti(data);
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
      getSocket().off("notification_panel", (data: any) => {
        //console.log(data);)
      });
    };
  }, []);
  return (
    <>
      {globalVendorLoginState && (
        <div className='App' ref={elementRef} onClick={requestFullScreen}>          
          <Suspense fallback={<FallBackComponent />}>
          <BrowserRouter>
                  <Routes>
                    <Route
                      path='/partners'
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
                            <HomeVendors />
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
                            <DiemDanhNhomCMS option="diemdanhnhomNS" />
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
                        <Route path='overmonitor' element={<OVER_MONITOR />} />
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
                        <Route path='capamanager' element={<CAPASX2 />} />
                        <Route path='qlsxmrp' element={<TINHLIEU />} />
                        <Route
                          path='tinhluongP3'
                          element={
                            <ProtectedRoute
                              user={globalUserData}
                              maindeptname='all'
                              jobname='Leader'
                            >
                              <TINHLUONGP3 />
                            </ProtectedRoute>
                          }
                        />
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
                              jobname='all'
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
                        path='tool'
                        element={
                          <ProtectedRoute
                            user={globalUserData}
                            maindeptname='all'
                            jobname='Leader'
                          >
                            <FileTransfer />
                          </ProtectedRoute>
                        }
                      >
                        <Route index element={<FileTransfer />} />
                        <Route
                          path='filetransfer'
                          element={<FileTransfer />}
                        />  
                        <Route
                          path='nocodelowcode'
                          element={<NOLOWHOME />}
                        />  
                      </Route>
                      <Route
                        path='information_board'
                        element={
                          <ProtectedRoute
                            user={globalUserData}
                            maindeptname='all'
                            jobname='Leader'
                          >
                            <Info />
                          </ProtectedRoute>
                        }
                      >
                        <Route index element={<Information />} />
                        <Route
                          path='news'
                          element={<Information />}
                        />  
                        <Route
                          path='register'
                          element={<AddInfo />}
                        />  
                        <Route
                          path='postmanager'
                          element={<PostManager />}
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
                          path='khosx'
                          element={
                            <ProtectedRoute
                              user={globalUserData}
                              maindeptname='all'
                              jobname='Leader'
                            >
                              <KHOSX />
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
                          path='khosub'
                          element={
                            <ProtectedRoute
                              user={globalUserData}
                              maindeptname='all'
                              jobname='Leader'
                            >
                              <KHOSUB />
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
                        <Route
                          path='baocaosx'
                          element={
                            <ProtectedRoute
                              user={globalUserData}
                              maindeptname='all'
                              jobname='Leader'
                            >
                              <BCSX />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='tinhluongP3'
                          element={
                            <ProtectedRoute
                              user={globalUserData}
                              maindeptname='all'
                              jobname='Leader'
                            >
                              <TINHLUONGP3 />
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
                              <DiemDanhNhomCMS option="diemdanhnhomNS" />
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
                              <DieuChuyenTeam option1="diemdanhnhomNS" option2="workpositionlist_NS" />
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
                              <PheDuyetNghiCMS option="pheduyetnghi" />
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
                          path='quanlycapcaons'
                          element={
                            <ProtectedRoute
                              user={globalUserData}
                              maindeptname='all'
                              jobname='leader'
                            >
                              <QuanLyCapCao_NS />
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
          </Suspense>
        </div>
      )}
      {!globalVendorLoginState && <LoginVendors />}
      <Notifications />
    </>
  );
}
export default AppVendors;

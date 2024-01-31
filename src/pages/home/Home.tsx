import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import "../home/home.scss";
import { useSpring, animated } from "@react-spring/web";
import { ReactElement, Suspense, useEffect, useRef, useState, lazy, useContext } from "react";
import { generalQuery, logout } from "../../api/Api";
import Swal from "sweetalert2";
import {
  Box,
  Button,
  IconButton,
  Tab,
  TabProps,
  Tabs,
  Typography,
} from "@mui/material";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { RootState } from "../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { addTab, closeTab, settabIndex } from "../../redux/slices/globalSlice";
import styled from "@emotion/styled";
import Cookies from "universal-cookie";
import FallBackComponent from "../../components/Fallback/FallBackComponent";
import { getlang } from "../../components/String/String";
import { LangConText } from "../../api/Context";
import { MENU_LIST_DATA } from "../../api/GlobalInterface";
const SettingPage = lazy(() => import("../setting/SettingPage"));
const PoManager = lazy(() => import("../../pages/kinhdoanh/pomanager/PoManager"));
const MACHINE = lazy(() => import("../../pages/qlsx/QLSXPLAN/Machine/MACHINE"));
const QUICKPLAN = lazy(() => import("../../pages/qlsx/QLSXPLAN/QUICKPLAN/QUICKPLAN"));
const PLAN_STATUS = lazy(() => import("../../pages/qlsx/QLSXPLAN/PLAN_STATUS/PLAN_STATUS"));
const QuanLyPhongBanNhanSu = lazy(() => import("../../pages/nhansu/QuanLyPhongBanNhanSu/QuanLyPhongBanNhanSu"));
const DiemDanhNhom = lazy(() => import("../../pages/nhansu/DiemDanhNhom/DiemDanhNhom"));
const DieuChuyenTeam = lazy(() => import("../../pages/nhansu/DieuChuyenTeam/DieuChuyenTeam"));
const TabDangKy = lazy(() => import("../../pages/nhansu/DangKy/TabDangKy"));
const PheDuyetNghi = lazy(() => import("../../pages/nhansu/PheDuyetNghi/PheDuyetNghi"));
const LichSu = lazy(() => import("../../pages/nhansu/LichSu/LichSu"));
const QuanLyCapCao = lazy(() => import("../../pages/nhansu/QuanLyCapCao/QuanLyCapCao"));
const BaoCaoNhanSu = lazy(() => import("../../pages/nhansu/BaoCaoNhanSu/BaoCaoNhanSu"));
const InvoiceManager = lazy(() => import("../../pages/kinhdoanh/invoicemanager/InvoiceManager"));
const PlanManager = lazy(() => import("../../pages/kinhdoanh/planmanager/PlanManager"));
const ShortageKD = lazy(() => import("../../pages/kinhdoanh/shortageKD/ShortageKD"));
const FCSTManager = lazy(() => import("../../pages/kinhdoanh/fcstmanager/FCSTManager"));
const YCSXManager = lazy(() => import("../../pages/kinhdoanh/ycsxmanager/YCSXManager"));
const POandStockFull = lazy(() => import("../../pages/kinhdoanh/poandstockfull/POandStockFull"));
const CODE_MANAGER = lazy(() => import("../../pages/rnd/code_manager/CODE_MANAGER"));
const BOM_MANAGER = lazy(() => import("../../pages/rnd/bom_manager/BOM_MANAGER"));
const CUST_MANAGER = lazy(() => import("../../pages/kinhdoanh/custManager/CUST_MANAGER"));
const EQ_STATUS = lazy(() => import("../../pages/qlsx/QLSXPLAN/EQ_STATUS/EQ_STATUS"));
const INSPECT_STATUS = lazy(() => import("../../pages/qc/inspection/INSPECT_STATUS/INSPECT_STATUS"));
const KinhDoanhReport = lazy(() => import("../../pages/kinhdoanh/kinhdoanhreport/KinhDoanhReport"));
const KIEMTRA = lazy(() => import("../../pages/qc/inspection/KIEMTRA"));
const DTC = lazy(() => import("../../pages/qc/dtc/DTC"));
const ISO = lazy(() => import("../../pages/qc/iso/ISO"));
const QC = lazy(() => import("../../pages/qc/QC"));
const IQC = lazy(() => import("../../pages/qc/iqc/IQC"));
const PQC = lazy(() => import("../../pages/qc/pqc/PQC"));
const OQC = lazy(() => import("../../pages/qc/oqc/OQC"));
const BOM_AMAZON = lazy(() => import("../../pages/rnd/bom_amazon/BOM_AMAZON"));
const DESIGN_AMAZON = lazy(() => import("../../pages/rnd/design_amazon/DESIGN_AMAZON"));
const QLSXPLAN = lazy(() => import("../../pages/qlsx/QLSXPLAN/QLSXPLAN"));
const TRANGTHAICHITHI = lazy(() => import("../../pages/sx/TRANGTHAICHITHI/TRANGTHAICHITHI"));
const KHOLIEU = lazy(() => import("../../pages/kho/kholieu/KHOLIEU"));
const KHOAO = lazy(() => import("../../pages/qlsx/QLSXPLAN/KHOAO/KHOAO"));
const LICHSUINPUTLIEU = lazy(() => import("../../pages/qlsx/QLSXPLAN/LICHSUINPUTLIEU/LICHSUINPUTLIEU"));
const TINHHINHCUONLIEU = lazy(() => import("../../pages/sx/TINH_HINH_CUON_LIEU/TINHINHCUONLIEU"));
const CSTOTAL = lazy(() => import("../../pages/qc/cs/CSTOTAL"));
const AccountInfo = lazy(() => import("../../components/Navbar/AccountInfo/AccountInfo"));
const PLAN_DATATB = lazy(() => import("../../pages/qlsx/QLSXPLAN/LICHSUCHITHITABLE/PLAN_DATATB"));
const CAPA_MANAGER = lazy(() => import("../../pages/qlsx/QLSXPLAN/CAPA/CAPA_MANAGER"));
const PLANRESULT = lazy(() => import("../../pages/sx/PLANRESULT/PLANRESULT"));
const BANGCHAMCONG = lazy(() => import("../../pages/nhansu/BangChamCong/BangChamCong"));
const QuotationTotal = lazy(() => import("../../pages/kinhdoanh/quotationmanager/QuotationTotal"));
const QLVL = lazy(() => import("../../pages/muahang/quanlyvatlieu/QLVL"));
const PRODUCT_BARCODE_MANAGER = lazy(() => import("../../pages/rnd/product_barcode_manager/PRODUCT_BARCODE_MANAGER"));
const KHOTPNEW = lazy(() => import("../../pages/kho/khotp_new/KHOTPNEW"));
const KHOTP = lazy(() => import("../../pages/kho/khotp/KHOTP"));
const EQ_STATUS2 = lazy(() => import("../../pages/qlsx/QLSXPLAN/EQ_STATUS/EQ_STATUS2"));
const TINHLIEU = lazy(() => import("../../pages/muahang/tinhlieu/TINHLIEU"));
const BAOCAOTHEOROLL = lazy(() => import("../../pages/sx/BAOCAOTHEOROLL/BAOCAOTHEOROLL"));
const LICHSUTEMLOTSX = lazy(() => import("../../pages/sx/LICHSUTEMLOTSX/LICHSUTEMLOTSX"));
const BAOCAOSXALL = lazy(() => import("../../pages/sx/BAOCAOSXALL"));
export const current_ver: number = 317;
interface ELE_ARRAY {
  REACT_ELE: any;
  ELE_NAME: string;
  ELE_CODE: string;
}
function Home() {
  const [lang, setLang] = useContext(LangConText);
  const [componentArrayy, setComponentArrayy] = useState<Array<any>>([]);
  const AddComponentToArray = (Component: React.LazyExoticComponent<() => JSX.Element>) => {
    // Dynamically add lazy-loaded component to the array
    setComponentArrayy((prevArray) => [
      ...prevArray,
      <Suspense key={prevArray.length} fallback={<div>Loading...</div>}>
        <Component />
      </Suspense>
    ]);
  };
  const cookies = new Cookies();
  const company: string = useSelector(
    (state: RootState) => state.totalSlice.company
  );
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const tabs: ELE_ARRAY[] = useSelector(
    (state: RootState) => state.totalSlice.tabs
  );
  const componentArray: Array<any> = useSelector(
    (state: RootState) => state.totalSlice.componentArray
  );
  const tabIndex: number = useSelector(
    (state: RootState) => state.totalSlice.tabIndex
  );
  const tabModeSwap: boolean = useSelector(
    (state: RootState) => state.totalSlice.tabModeSwap
  );
  const sidebarStatus: boolean | undefined = useSelector(
    (state: RootState) => state.totalSlice.sidebarmenu
  );
  const menulist: MENU_LIST_DATA[] = [
    {
      MENU_CODE: "NS0",
      MENU_NAME: "Account Info",
      MENU_ITEM: <AccountInfo />,
    },
    {
      MENU_CODE: "NS1",
      MENU_NAME: getlang("quanlyphongban", lang),
      MENU_ITEM: <QuanLyPhongBanNhanSu />,
    },
    {
      MENU_CODE: "NS2",
      MENU_NAME: getlang("diemdanhnhom", lang),
      MENU_ITEM: <DiemDanhNhom />,
    },
    {
      MENU_CODE: "NS3",
      MENU_NAME: getlang("dieuchuyenteam", lang),
      MENU_ITEM: <DieuChuyenTeam />,
    },
    {
      MENU_CODE: "NS4",
      MENU_NAME: getlang("dangky", lang),
      MENU_ITEM: <TabDangKy />,
    },
    {
      MENU_CODE: "NS5",
      MENU_NAME: getlang("pheduyet", lang),
      MENU_ITEM: <PheDuyetNghi />,
    },
    {
      MENU_CODE: "NS6",
      MENU_NAME: getlang("lichsudilam", lang),
      MENU_ITEM: <LichSu />,
    },
    {
      MENU_CODE: "NS7",
      MENU_NAME: getlang("quanlycapcao", lang),
      MENU_ITEM: <QuanLyCapCao />,
    },
    {
      MENU_CODE: "NS8",
      MENU_NAME: getlang("baocaonhansu", lang),
      MENU_ITEM: <BaoCaoNhanSu />,
    },
    {
      MENU_CODE: "NS9",
      MENU_NAME: getlang("listchamcong", lang),
      MENU_ITEM: <BANGCHAMCONG />,
    },
    {
      MENU_CODE: "KD1",
      MENU_NAME: getlang("quanlypo", lang),
      MENU_ITEM: <PoManager />,
    },
    {
      MENU_CODE: "KD2",
      MENU_NAME: getlang("quanlyinvoices", lang),
      MENU_ITEM: <InvoiceManager />,
    },
    {
      MENU_CODE: "KD3",
      MENU_NAME: getlang("quanlyplan", lang),
      MENU_ITEM: <PlanManager />,
    },
    {
      MENU_CODE: "KD4",
      MENU_NAME: getlang("shortage", lang),
      MENU_ITEM: <ShortageKD />,
    },
    {
      MENU_CODE: "KD5",
      MENU_NAME: getlang("quanlyFCST", lang),
      MENU_ITEM: <FCSTManager />,
    },
    {
      MENU_CODE: "KD6",
      MENU_NAME: getlang("quanlyYCSX", lang),
      MENU_ITEM: <YCSXManager />,
    },
    {
      MENU_CODE: "KD7",
      MENU_NAME: getlang("quanlyPOFull", lang),
      MENU_ITEM: <POandStockFull />,
    },
    {
      MENU_CODE: "KD8",
      MENU_NAME: getlang("thongtinsanpham", lang),
      MENU_ITEM: <CODE_MANAGER />,
    },
    {
      MENU_CODE: "KD9",
      MENU_NAME: getlang("quanlycodebom", lang),
      MENU_ITEM: <BOM_MANAGER />,
    },
    {
      MENU_CODE: "KD10",
      MENU_NAME: getlang("quanlykhachhang", lang),
      MENU_ITEM: <CUST_MANAGER />,
    },
    {
      MENU_CODE: "KD11",
      MENU_NAME: getlang("eqstatus", lang),
      MENU_ITEM: <EQ_STATUS2 />,
    },
    {
      MENU_CODE: "KD12",
      MENU_NAME: getlang("ins_status", lang),
      MENU_ITEM: <INSPECT_STATUS />,
    },
    {
      MENU_CODE: "KD13",
      MENU_NAME: getlang("baocao", lang),
      MENU_ITEM: <KinhDoanhReport />,
    },
    {
      MENU_CODE: "KD14",
      MENU_NAME: getlang("quanlygia", lang),
      MENU_ITEM: <QuotationTotal />,
    },
    {
      MENU_CODE: "PU1",
      MENU_NAME: getlang("quanlyvatlieu", lang),
      MENU_ITEM: <QLVL />,
    },
    {
      MENU_CODE: "PU2",
      MENU_NAME: getlang("quanlymrp", lang),
      MENU_ITEM: <TINHLIEU />,
    },
    {
      MENU_CODE: "QC1",
      MENU_NAME: getlang("quanlyYCSX", lang),
      MENU_ITEM: <YCSXManager />,
    },
    {
      MENU_CODE: "QC2",
      MENU_NAME: getlang("thongtinsanpham", lang),
      MENU_ITEM: <CODE_MANAGER />,
    },
    {
      MENU_CODE: "QC3",
      MENU_NAME: "IQC",
      MENU_ITEM: <IQC />,
    },
    {
      MENU_CODE: "QC4",
      MENU_NAME: "PQC",
      MENU_ITEM: <PQC />,
    },
    {
      MENU_CODE: "QC5",
      MENU_NAME: "OQC",
      MENU_ITEM: <OQC />,
    },
    {
      MENU_CODE: "QC6",
      MENU_NAME: getlang("inspection", lang),
      MENU_ITEM: <KIEMTRA />,
    },
    {
      MENU_CODE: "QC7",
      MENU_NAME: "CS",
      MENU_ITEM: <CSTOTAL />,
    },
    {
      MENU_CODE: "QC8",
      MENU_NAME: getlang("dtc", lang),
      MENU_ITEM: <DTC />,
    },
    {
      MENU_CODE: "QC9",
      MENU_NAME: "ISO",
      MENU_ITEM: <ISO />,
    },
    {
      MENU_CODE: "QC10",
      MENU_NAME: getlang("baocaoqc", lang),
      MENU_ITEM: <QC />,
    },
    {
      MENU_CODE: "RD1",
      MENU_NAME: getlang("quanlycodebom", lang),
      MENU_ITEM: <BOM_MANAGER />,
    },
    {
      MENU_CODE: "RD2",
      MENU_NAME: getlang("thembomamazon", lang),
      MENU_ITEM: <BOM_AMAZON />,
    },
    {
      MENU_CODE: "RD3",
      MENU_NAME: getlang("dtc", lang),
      MENU_ITEM: <DTC />,
    },
    {
      MENU_CODE: "RD4",
      MENU_NAME: getlang("quanlyYCSX", lang),
      MENU_ITEM: <YCSXManager />,
    },
    {
      MENU_CODE: "RD5",
      MENU_NAME: getlang("thietkedesignamazon", lang),
      MENU_ITEM: <DESIGN_AMAZON />,
    },
    {
      MENU_CODE: "RD6",
      MENU_NAME: getlang("productbarcodemanager", lang),
      MENU_ITEM: <PRODUCT_BARCODE_MANAGER />,
    },
    {
      MENU_CODE: "QL1",
      MENU_NAME: getlang("quanlyYCSX", lang),
      MENU_ITEM: <YCSXManager />,
    },
    {
      MENU_CODE: "QL2",
      MENU_NAME: getlang("quanlycodebom", lang),
      MENU_ITEM: <BOM_MANAGER />,
    },
    {
      MENU_CODE: "QL3",
      MENU_NAME: getlang("thongtinsanpham", lang),
      MENU_ITEM: <CODE_MANAGER />,
    },
    {
      MENU_CODE: "QL4",
      MENU_NAME: getlang("quanlyplansx", lang),
      MENU_ITEM: <QLSXPLAN />,
    },
    {
      MENU_CODE: "QL5",
      MENU_NAME: getlang("quanlycapa", lang),
      MENU_ITEM: <CAPA_MANAGER />,
    },
    {
      MENU_CODE: "QL6",
      MENU_NAME: getlang("quanlymrp", lang),
      MENU_ITEM: <CAPA_MANAGER />,
    },
    {
      MENU_CODE: "QL7",
      MENU_NAME: "PLAN VISUAL",
      MENU_ITEM: <MACHINE />,
    },
    {
      MENU_CODE: "QL8",
      MENU_NAME: "QUICK PLAN",
      MENU_ITEM: <QUICKPLAN />,
    },
    {
      MENU_CODE: "QL9",
      MENU_NAME: "TRA PLAN",
      MENU_ITEM: <PLAN_DATATB />,
    },
    {
      MENU_CODE: "QL10",
      MENU_NAME: "INPUT LIEU",
      MENU_ITEM: <LICHSUINPUTLIEU />,
    },
    {
      MENU_CODE: "QL11",
      MENU_NAME: "PLAN STATUS",
      MENU_ITEM: <PLAN_STATUS />,
    },
    {
      MENU_CODE: "QL12",
      MENU_NAME: "EQ STATUS",
      MENU_ITEM: <EQ_STATUS />,
    },
    {
      MENU_CODE: "SX1",
      MENU_NAME: getlang("quanlyYCSX", lang),
      MENU_ITEM: <YCSXManager />,
    },
    {
      MENU_CODE: "SX2",
      MENU_NAME: getlang("thongtinsanpham", lang),
      MENU_ITEM: <CODE_MANAGER />,
    },
    {
      MENU_CODE: "SX3",
      MENU_NAME: getlang("datasanxuat", lang),
      MENU_ITEM: <BAOCAOSXALL />,
    },
    {
      MENU_CODE: "SX4",
      MENU_NAME: getlang("inspection", lang),
      MENU_ITEM: <KIEMTRA />,
    },
    {
      MENU_CODE: "SX5",
      MENU_NAME: getlang("planstatus", lang),
      MENU_ITEM: <TRANGTHAICHITHI />,
    },
    {
      MENU_CODE: "SX6",
      MENU_NAME: getlang("eqstatus", lang),
      MENU_ITEM: <EQ_STATUS />,
    },
    {
      MENU_CODE: "SX7",
      MENU_NAME: getlang("khothat", lang),
      MENU_ITEM: <KHOLIEU />,
    },
    {
      MENU_CODE: "SX8",
      MENU_NAME: getlang("khoao", lang),
      MENU_ITEM: <KHOAO />,
    },
    {
      MENU_CODE: "SX9",
      MENU_NAME: getlang("lichsuxuatlieuthat", lang),
      MENU_ITEM: <LICHSUINPUTLIEU />,
    },
    {
      MENU_CODE: "SX10",
      MENU_NAME: getlang("materiallotstatus", lang),
      MENU_ITEM: <TINHHINHCUONLIEU />,
    },
    {
      MENU_CODE: "SX13",
      MENU_NAME: getlang("sxrolldata", lang),
      MENU_ITEM: <BAOCAOTHEOROLL />,
    },
    {
      MENU_CODE: "SX14",
      MENU_NAME: getlang("lichsutemlotsx", lang),
      MENU_ITEM: <LICHSUTEMLOTSX />,
    },
    {
      MENU_CODE: "SX11",
      MENU_NAME: getlang("quanlycapa", lang),
      MENU_ITEM: <CAPA_MANAGER />,
    },
    {
      MENU_CODE: "SX12",
      MENU_NAME: getlang("hieusuatsx", lang),
      MENU_ITEM: <PLANRESULT />,
    },
    {
      MENU_CODE: "KO1",
      MENU_NAME: getlang("nhapxuattontp", lang),
      MENU_ITEM: company === "CMS" ? <KHOTP /> : <KHOTPNEW />,
    },
    {
      MENU_CODE: "KO2",
      MENU_NAME: getlang("nhapxuattonlieu", lang),
      MENU_ITEM: <KHOLIEU />,
    },
    {
      MENU_CODE: "ST01",
      MENU_NAME: "Setting",
      MENU_ITEM: <SettingPage />,
    },
    {
      MENU_CODE: "",
      MENU_NAME: "",
      MENU_ITEM: <AccountInfo />,
    },
    {
      MENU_CODE: "-1",
      MENU_NAME: "",
      MENU_ITEM: <AccountInfo />,
    },
  ];
  const dispatch = useDispatch();
  const springs = useSpring({
    from: { x: 1000, y: 100 },
    to: { x: 0, y: 0 },
  });
  const failCount = useRef(0);
  const [checkVerWeb, setCheckVerWeb] = useState(1);
  const updatechamcongdiemdanh = () => {
    generalQuery("updatechamcongdiemdanhauto", {})
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const CustomTab = styled((props: TabProps) => <Tab {...props} />)({
    // Tùy chỉnh kiểu cho tab tại đây
    color: "gray", // Ví dụ: đặt màu chữ là màu xanh
    fontWeight: 200, // Ví dụ: đặt độ đậm cho chữ
    // Thêm các kiểu tùy chỉnh khác tại đây...
  });
  const CustomTabLabel = styled(Typography)({
    fontWeight: 200, // Ví dụ: đặt độ đậm cho chữ
    // Thêm các kiểu tùy chỉnh khác tại đây...
  });
  const getchamcong = () => {
    generalQuery("checkMYCHAMCONG", {})
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
          //console.log('data',response.data.data)
          //console.log('data',response.data.REFRESH_TOKEN);
          let rfr_token: string = response.data.REFRESH_TOKEN;
          cookies.set("token", rfr_token, { path: "/" });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const checkERPLicense = async () => {
    generalQuery("checkLicense", {
      COMPANY: company
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          console.log(response.data.message);
          failCount.current = 0;
        } else {
          console.log(response.data.message);
          console.log('licenseFailCount', failCount.current);
          failCount.current++;
          if (failCount.current > 1) {
            Swal.fire('Thông báo', 'Please check your network', 'error');
            failCount.current = 0;
            logout();
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  useEffect(() => {
    console.log("local ver", current_ver);
    generalQuery("checkWebVer", {})
      .then((response) => {
        console.log(response.data.tk_status);
        if (response.data.tk_status !== "NG") {
          console.log("webver", response.data.data[0].VERWEB);
          setCheckVerWeb(response.data.data[0].VERWEB);
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
    let intervalID = window.setInterval(() => {
      generalQuery("checkWebVer", {})
        .then((response) => {
          if (response?.data?.tk_status !== "NG") {
            //console.log('webver',response.data.data[0].VERWEB);
            if (current_ver >= response.data.data[0].VERWEB) {
            } else {
              window.clearInterval(intervalID);
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
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });
      getchamcong();
    }, 30000);
    let intervalID2 = window.setInterval(() => {
      checkERPLicense();
    }, 30000);
    return () => {
      window.clearInterval(intervalID);
      window.clearInterval(intervalID2);
    };
  }, []);
  return (
    <div className='home'>
      <div className='navdiv'>
        <Navbar />
        {/* <PrimarySearchAppBar /> */}
      </div>
      <div className='homeContainer'>
        {/* <div className='sidebardiv'>
          <Sidebar />
        </div> */}
        <div className='outletdiv'>
          <animated.div
            className='animated_div'
            style={{
              width: "100%",
              height: "100vh",
              borderRadius: 8,
              ...springs,
            }}
          >
            {tabModeSwap &&
              tabs.filter(
                (ele: ELE_ARRAY, index: number) =>
                  ele.ELE_CODE !== "-1" && ele.ELE_CODE !== "NS0"
              ).length > 0 && (
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    value={tabIndex}
                    onChange={(
                      event: React.SyntheticEvent,
                      newValue: number
                    ) => {
                      //console.log(newValue);
                      dispatch(settabIndex(newValue));
                    }}
                    variant='scrollable'
                    aria-label='ERP TABS'
                    scrollButtons
                    allowScrollButtonsMobile
                    style={{
                      backgroundImage: `${company === "CMS"
                        ? theme.CMS.backgroundImage
                        : theme.PVN.backgroundImage
                        }`,
                      border: "none",
                      minHeight: "2px",
                      boxSizing: "border-box",
                      borderRadius: "2px",
                    }}
                  >
                    {tabs.map((ele: ELE_ARRAY, index: number) => {
                      if (ele.ELE_CODE !== "-1") {
                        return (
                          <CustomTab
                            key={index}
                            label={
                              <div className="tabdiv" style={{ display: 'flex', fontSize: "0.8rem", justifyContent: 'center', alignContent: 'center' }}>
                                <CustomTabLabel style={{ fontSize: "0.8rem" }}>
                                  {index + 1}.{ele.ELE_NAME}
                                  <IconButton onClick={() => {
                                    dispatch(closeTab(index));
                                  }}>
                                    <AiOutlineCloseCircle color={tabIndex === index ? `blue` : `gray`} size={20} />
                                  </IconButton>
                                </CustomTabLabel>
                              </div>
                            }
                            value={index}
                            style={{
                              minHeight: "2px",
                              height: "5px",
                              boxSizing: "border-box",
                              borderRadius: "5px",
                            }}
                          ></CustomTab>
                        );
                      }
                    })}
                  </Tabs>
                </Box>
              )}
            {tabModeSwap &&
              tabs.map((ele: ELE_ARRAY, index: number) => {
                if (ele.ELE_CODE !== "-1")
                  return (
                    <div
                      key={index}
                      className='component_element'
                      style={{
                        visibility: index === tabIndex ? "visible" : "hidden",
                        width: sidebarStatus ? "100%" : "100%",
                      }}
                    >
                      {menulist.filter((menu: MENU_LIST_DATA, index: number) => menu.MENU_CODE === ele.ELE_CODE)[0].MENU_ITEM}
                    </div>
                  );
              })}
            {current_ver >= checkVerWeb ? (
              !tabModeSwap && <Outlet />
            ) : (
              <p
                style={{
                  fontSize: 35,
                  backgroundColor: "red",
                  width: "800px",
                  height: "500px",
                  zIndex: 1000,
                }}
              >
                ERP has updates, Press Ctrl +F5 to update web
              </p>
            )}
            {tabModeSwap && tabs.length === 0 && <AccountInfo />}
          </animated.div>
        </div>
        {/*   <div className="chatroom">
          <CHAT />
        </div> */}
      </div>
    </div>
  );
}
export default Home;

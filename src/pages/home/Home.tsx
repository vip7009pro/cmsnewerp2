import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import "../home/home.scss";
import { useSpring, animated } from "@react-spring/web";
import { useEffect, useRef, useState, useContext } from "react";
import { generalQuery, getUserData, logout } from "../../api/Api";
import Swal from "sweetalert2";
import { Box, IconButton, Tab, TabProps, Tabs, Typography } from "@mui/material";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { RootState } from "../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { closeTab, settabIndex } from "../../redux/slices/globalSlice";
import styled from "@emotion/styled";
import Cookies from "universal-cookie";
import { getlang } from "../../components/String/String";
import { LangConText } from "../../api/Context";
import { MENU_LIST_DATA, UserData } from "../../api/GlobalInterface";
import AccountInfo from "../../components/Navbar/AccountInfo/AccountInfo";
import QuanLyPhongBanNhanSu from "../nhansu/QuanLyPhongBanNhanSu/QuanLyPhongBanNhanSu";
import DiemDanhNhom from "../nhansu/DiemDanhNhom/DiemDanhNhom";
import DieuChuyenTeam from "../nhansu/DieuChuyenTeam/DieuChuyenTeam";
import TabDangKy from "../nhansu/DangKy/TabDangKy";
import PheDuyetNghi from "../nhansu/PheDuyetNghi/PheDuyetNghi";
import LichSu from "../nhansu/LichSu/LichSu";
import QuanLyCapCao from "../nhansu/QuanLyCapCao/QuanLyCapCao";
import BaoCaoNhanSu from "../nhansu/BaoCaoNhanSu/BaoCaoNhanSu";
import BANGCHAMCONG from "../nhansu/BangChamCong/BangChamCong";
import PoManager from "../kinhdoanh/pomanager/PoManager";
import InvoiceManager from "../kinhdoanh/invoicemanager/InvoiceManager";
import PlanManager from "../kinhdoanh/planmanager/PlanManager";
import ShortageKD from "../kinhdoanh/shortageKD/ShortageKD";
import FCSTManager from "../kinhdoanh/fcstmanager/FCSTManager";
import YCSXManager from "../kinhdoanh/ycsxmanager/YCSXManager";
import POandStockFull from "../kinhdoanh/poandstockfull/POandStockFull";
import CODE_MANAGER from "../rnd/code_manager/CODE_MANAGER";
import BOM_MANAGER from "../rnd/bom_manager/BOM_MANAGER";
import CUST_MANAGER from "../kinhdoanh/custManager/CUST_MANAGER";
import EQ_STATUS2 from "../qlsx/QLSXPLAN/EQ_STATUS/EQ_STATUS2";
import INSPECT_STATUS from "../qc/inspection/INSPECT_STATUS/INSPECT_STATUS";
import KinhDoanhReport from "../kinhdoanh/kinhdoanhreport/KinhDoanhReport";
import QuotationTotal from "../kinhdoanh/quotationmanager/QuotationTotal";
import QLVL from "../muahang/quanlyvatlieu/QLVL";
import TINHLIEU from "../muahang/tinhlieu/TINHLIEU";
import IQC from "../qc/iqc/IQC";
import PQC from "../qc/pqc/PQC";
import OQC from "../qc/oqc/OQC";
import KIEMTRA from "../qc/inspection/KIEMTRA";
import CSTOTAL from "../qc/cs/CSTOTAL";
import DTC from "../qc/dtc/DTC";
import ISO from "../qc/iso/ISO";
import QCReport from "../qc/qcreport/QCReport";
import BOM_AMAZON from "../rnd/bom_amazon/BOM_AMAZON";
import DESIGN_AMAZON from "../rnd/design_amazon/DESIGN_AMAZON";
import PRODUCT_BARCODE_MANAGER from "../rnd/product_barcode_manager/PRODUCT_BARCODE_MANAGER";
import QLSXPLAN from "../qlsx/QLSXPLAN/QLSXPLAN";
import CAPA_MANAGER from "../qlsx/QLSXPLAN/CAPA/CAPA_MANAGER";
import MACHINE from "../qlsx/QLSXPLAN/Machine/MACHINE";
import QUICKPLAN from "../qlsx/QLSXPLAN/QUICKPLAN/QUICKPLAN";
import PLAN_DATATB from "../qlsx/QLSXPLAN/LICHSUCHITHITABLE/PLAN_DATATB";
import LICHSUINPUTLIEU from "../qlsx/QLSXPLAN/LICHSUINPUTLIEU/LICHSUINPUTLIEU";
import PLAN_STATUS from "../qlsx/QLSXPLAN/PLAN_STATUS/PLAN_STATUS";
import EQ_STATUS from "../qlsx/QLSXPLAN/EQ_STATUS/EQ_STATUS";
import BAOCAOSXALL from "../sx/BAOCAOSXALL";
import TRANGTHAICHITHI from "../sx/TRANGTHAICHITHI/TRANGTHAICHITHI";
import KHOLIEU from "../kho/kholieu/KHOLIEU";
import KHOAO from "../qlsx/QLSXPLAN/KHOAO/KHOAO";
import TINHHINHCUONLIEU from "../sx/TINH_HINH_CUON_LIEU/TINHINHCUONLIEU";
import BAOCAOTHEOROLL from "../sx/BAOCAOTHEOROLL/BAOCAOTHEOROLL";
import LICHSUTEMLOTSX from "../sx/LICHSUTEMLOTSX/LICHSUTEMLOTSX";
import PLANRESULT from "../sx/PLANRESULT/PLANRESULT";
import KHOTP from "../kho/khotp/KHOTP";
import KHOTPNEW from "../kho/khotp_new/KHOTPNEW";
import SettingPage from "../setting/SettingPage";
import RND_REPORT from "../rnd/rnd_report/RND_REPORT";
import Blank from "../../components/Blank/Blank";
import SAMPLE_MONITOR from "../rnd/sample monitor/SAMPLE_MONITOR";
export const current_ver: number = 410;
interface ELE_ARRAY {
  REACT_ELE: any;
  ELE_NAME: string;
  ELE_CODE: string;
}
function Home() {
  const [lang, setLang] = useContext(LangConText);
  const cookies = new Cookies();
  const company: string = useSelector(
    (state: RootState) => state.totalSlice.company
  );
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const tabs: ELE_ARRAY[] = useSelector(
    (state: RootState) => state.totalSlice.tabs
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
      MENU_CODE: "BL1",
      MENU_NAME: "XXX",
      MENU_ITEM: <Blank />,
    },
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
      MENU_ITEM: <QCReport />,
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
      MENU_CODE: "RD7",
      MENU_NAME: getlang("baocaornd", lang),
      MENU_ITEM: <RND_REPORT />,
    },
    {
      MENU_CODE: "RD8",
      MENU_NAME: getlang("samplemonitor", lang),
      MENU_ITEM: <SAMPLE_MONITOR />,
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
    //console.log(getSever());
    //if (getSever() !== 'http://192.168.1.192:5013') {
    if (true) {
      generalQuery("checkLicense", {
        COMPANY: company
      })
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            console.log(response.data.message);
          } else {
            console.log(response.data.message);
            if (getUserData()?.EMPL_NO !== 'NHU1903') {
              Swal.fire('Thông báo', 'Please check your network', 'error');
              logout();
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
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
    checkERPLicense();
    /* let intervalID2 = window.setInterval(() => {
      checkERPLicense();
    }, 30000); */
    return () => {
      window.clearInterval(intervalID);
      /* window.clearInterval(intervalID2); */
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
              /*...springs,*/
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
                              <div className="tabdiv" style={{ display: 'flex', fontSize: "0.8rem", justifyContent: 'center', alignContent: 'center', padding: 0 }}>
                                <CustomTabLabel style={{ fontSize: "0.7rem", }}>
                                  {index + 1}.{ele.ELE_NAME}
                                  <IconButton onClick={() => {
                                    dispatch(closeTab(index));
                                  }}>
                                    <AiOutlineCloseCircle color={tabIndex === index ? `blue` : `gray`} size={15} />
                                  </IconButton>
                                </CustomTabLabel>
                              </div>
                            }
                            value={index}
                            style={{
                              minHeight: "2px",
                              height: "5px",
                              boxSizing: "border-box",
                              borderRadius: "3px",
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
        {/* {userData?.EMPL_NO === 'NHU1903' && <div className="chatroom">
          <CHAT />
        </div>} */}
      </div>
    </div>
  );
}
export default Home;
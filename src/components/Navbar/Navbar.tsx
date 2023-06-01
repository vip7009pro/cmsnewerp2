import React, {
  ChangeEvent,
  Component,
  ReactElement,
  lazy,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import SearchIcon from "@mui/icons-material/Search";
import LanguageIcon from "@mui/icons-material/Language";
import { Link } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SwitchRightIcon from '@mui/icons-material/SwitchRight';
import LogoutIcon from "@mui/icons-material/Logout";
import { logout } from "../../api/Api";
import { LangConText } from "../../api/Context";
import Swal from "sweetalert2";
import { UserContext } from "../../api/Context";
import { FcList } from "react-icons/fc";
import {
  toggleSidebar,
  setTabModeSwap,
  ELE_ARRAY,
} from "../../redux/slices/globalSlice";
import { RootState } from "../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { addTab, settabIndex, resetTab } from "../../redux/slices/globalSlice";
import { current_ver } from "../../pages/home/Home";
import {
  Autocomplete,
  Checkbox,
  FormControlLabel,
  TextField,
  createFilterOptions,
} from "@mui/material";
import { getlang } from "../String/String";
import "./navbar.scss";
import MACHINE from "../../pages/qlsx/QLSXPLAN/Machine/MACHINE";
import QUICKPLAN from "../../pages/qlsx/QLSXPLAN/QUICKPLAN/QUICKPLAN";
import PLAN_STATUS from "../../pages/qlsx/QLSXPLAN/PLAN_STATUS/PLAN_STATUS";
import QuanLyPhongBanNhanSu from "../../pages/nhansu/QuanLyPhongBanNhanSu/QuanLyPhongBanNhanSu";
import DiemDanhNhom from "../../pages/nhansu/DiemDanhNhom/DiemDanhNhom";
import DieuChuyenTeam from "../../pages/nhansu/DieuChuyenTeam/DieuChuyenTeam";
import TabDangKy from "../../pages/nhansu/DangKy/TabDangKy";
import PheDuyetNghi from "../../pages/nhansu/PheDuyetNghi/PheDuyetNghi";
import LichSu from "../../pages/nhansu/LichSu/LichSu";
import QuanLyCapCao from "../../pages/nhansu/QuanLyCapCao/QuanLyCapCao";
import BaoCaoNhanSu from "../../pages/nhansu/BaoCaoNhanSu/BaoCaoNhanSu";
import PoManager from "../../pages/kinhdoanh/pomanager/PoManager";
import InvoiceManager from "../../pages/kinhdoanh/invoicemanager/InvoiceManager";
import PlanManager from "../../pages/kinhdoanh/planmanager/PlanManager";
import ShortageKD from "../../pages/kinhdoanh/shortageKD/ShortageKD";
import FCSTManager from "../../pages/kinhdoanh/fcstmanager/FCSTManager";
import YCSXManager from "../../pages/kinhdoanh/ycsxmanager/YCSXManager";
import POandStockFull from "../../pages/kinhdoanh/poandstockfull/POandStockFull";
import CODE_MANAGER from "../../pages/rnd/code_manager/CODE_MANAGER";
import BOM_MANAGER from "../../pages/rnd/bom_manager/BOM_MANAGER";
import CUST_MANAGER from "../../pages/kinhdoanh/custManager/CUST_MANAGER";
import EQ_STATUS from "../../pages/qlsx/QLSXPLAN/EQ_STATUS/EQ_STATUS";
import INSPECT_STATUS from "../../pages/qc/inspection/INSPECT_STATUS/INSPECT_STATUS";
import KinhDoanhReport from "../../pages/kinhdoanh/kinhdoanhreport/KinhDoanhReport";
import KIEMTRA from "../../pages/qc/inspection/KIEMTRA";
import DTC from "../../pages/qc/dtc/DTC";
import ISO from "../../pages/qc/iso/ISO";
import QC from "../../pages/qc/QC";
import IQC from "../../pages/qc/iqc/IQC";
import PQC from "../../pages/qc/pqc/PQC";
import OQC from "../../pages/qc/oqc/OQC";
import BOM_AMAZON from "../../pages/rnd/bom_amazon/BOM_AMAZON";
import DESIGN_AMAZON from "../../pages/rnd/design_amazon/DESIGN_AMAZON";
import QLSXPLAN from "../../pages/qlsx/QLSXPLAN/QLSXPLAN";
import CAPASX from "../../pages/qlsx/QLSXPLAN/CAPA/CAPASX";
import DATASX2 from "../../pages/qlsx/QLSXPLAN/DATASX/DATASX2";
import TRANGTHAICHITHI from "../../pages/sx/TRANGTHAICHITHI/TRANGTHAICHITHI";
import KHOLIEU from "../../pages/kho/kholieu/KHOLIEU";
import KHOAO from "../../pages/qlsx/QLSXPLAN/KHOAO/KHOAO";
import LICHSUINPUTLIEU from "../../pages/qlsx/QLSXPLAN/LICHSUINPUTLIEU/LICHSUINPUTLIEU";
import TINHHINHCUONLIEU from "../../pages/sx/TINH_HINH_CUON_LIEU/TINHINHCUONLIEU";
import CSTOTAL from "../../pages/qc/cs/CSTOTAL";
import AccountInfo from "../../components/Navbar/AccountInfo/AccountInfo";
import PLAN_DATATB from "../../pages/qlsx/QLSXPLAN/LICHSUCHITHITABLE/PLAN_DATATB";
/* 
const KIEMTRA= lazy(()=> import('../../pages/qc/inspection/KIEMTRA'));
const PQC= lazy(()=> import('../../pages/qc/pqc/PQC'));
const IQC= lazy(()=> import('../../pages/qc/iqc/IQC'));
const DTC= lazy(()=> import('../../pages/qc/dtc/DTC'));
const ISO= lazy(()=> import('../../pages/qc/iso/ISO'));
const OQC= lazy(()=> import('../../pages/qc/oqc/OQC'));
const CSTOTAL= lazy(()=> import('../../pages/qc/cs/CSTOTAL'));
const QuotationManager= lazy(()=> import('../../pages/kinhdoanh/quotationmanager/QuotationManager'));
const BulletinBoard= lazy(()=> import('../../components/BulletinBoard/BulletinBoard'));
const QLSX= lazy(()=> import('../../pages/qlsx/QLSX'));
const QC= lazy(()=> import('../../pages/qc/QC'));
const NhanSu= lazy(()=> import('../../pages/nhansu/NhanSu'));
const KinhDoanh= lazy(()=> import('../../pages/kinhdoanh/KinhDoanh'));
const AccountInfo= lazy(()=> import('../../components/Navbar/AccountInfo/AccountInfo'));
const QuanLyCapCao= lazy(()=> import('../../pages/nhansu/QuanLyCapCao/QuanLyCapCao'));
const DESIGN_AMAZON= lazy(()=> import('../../pages/rnd/design_amazon/DESIGN_AMAZON'));
const KHOLIEU= lazy(()=> import('../../pages/kho/kholieu/KHOLIEU'));
const DATASX= lazy(()=> import('../../pages/qlsx/QLSXPLAN/DATASX/DATASX'));
const EQ_STATUS= lazy(()=> import('../../pages/qlsx/QLSXPLAN/EQ_STATUS/EQ_STATUS'));
const LICHSUINPUTLIEU= lazy(()=> import('../../pages/qlsx/QLSXPLAN/LICHSUINPUTLIEU/LICHSUINPUTLIEU'));
const INSPECT_STATUS= lazy(()=> import('../../pages/qc/inspection/INSPECT_STATUS/INSPECT_STATUS'));
const ShortageKD= lazy(()=> import('../../pages/kinhdoanh/shortageKD/ShortageKD'));
const TRANGTHAICHITHI= lazy(()=> import('../../pages/sx/TRANGTHAICHITHI/TRANGTHAICHITHI'));
const CAPASX= lazy(()=> import('../../pages/qlsx/QLSXPLAN/CAPA/CAPASX'));
const KHOAO= lazy(()=> import('../../pages/qlsx/QLSXPLAN/KHOAO/KHOAO'));
const QLSXPLAN= lazy(()=> import('../../pages/qlsx/QLSXPLAN/QLSXPLAN'));
const BOM_MANAGER= lazy(()=> import('../../pages/rnd/bom_manager/BOM_MANAGER'));
const BOM_AMAZON= lazy(()=> import('../../pages/rnd/bom_amazon/BOM_AMAZON'));
const CODE_MANAGER= lazy(()=> import('../../pages/rnd/code_manager/CODE_MANAGER'));
const CUST_MANAGER= lazy(()=> import('../../pages/kinhdoanh/custManager/CUST_MANAGER'));
const QuanLyPhongBanNhanSu= lazy(()=> import('../../pages/nhansu/QuanLyPhongBanNhanSu/QuanLyPhongBanNhanSu'));
const DiemDanhNhom= lazy(()=> import('../../pages/nhansu/DiemDanhNhom/DiemDanhNhom'));
const DieuChuyenTeam= lazy(()=> import('../../pages/nhansu/DieuChuyenTeam/DieuChuyenTeam'));
const TabDangKy= lazy(()=> import('../../pages/nhansu/DangKy/TabDangKy'));
const PheDuyetNghi= lazy(()=> import('../../pages/nhansu/PheDuyetNghi/PheDuyetNghi'));
const LichSu= lazy(()=> import('../../pages/nhansu/LichSu/LichSu'));
const BaoCaoNhanSu= lazy(()=> import('../../pages/nhansu/BaoCaoNhanSu/BaoCaoNhanSu'));
const PoManager= lazy(()=> import('../../pages/kinhdoanh/pomanager/PoManager'));
const KinhDoanhReport= lazy(()=> import('../../pages/kinhdoanh/kinhdoanhreport/KinhDoanhReport'));
const InvoiceManager= lazy(()=> import('../../pages/kinhdoanh/invoicemanager/InvoiceManager'));
const PlanManager= lazy(()=> import('../../pages/kinhdoanh/planmanager/PlanManager'));
const FCSTManager= lazy(()=> import('../../pages/kinhdoanh/fcstmanager/FCSTManager'));
const YCSXManager= lazy(()=> import('../../pages/kinhdoanh/ycsxmanager/YCSXManager'));
const POandStockFull= lazy(()=> import('../../pages/kinhdoanh/poandstockfull/POandStockFull'));
const CS= lazy(()=> import('../../pages/qc/cs/CS'));
const DATASX2= lazy(()=> import('../../pages/qlsx/QLSXPLAN/DATASX/DATASX2'));
const TINHHINHCUONLIEU= lazy(()=> import('../../pages/sx/TINH_HINH_CUON_LIEU/TINHINHCUONLIEU')); */
interface MENU_LIST_DATA {
  MENU_CODE: string;
  MENU_NAME: string;
  MENU_ITEM: ReactElement;
}
interface SEARCH_LIST_DATA {
  MENU_CODE: string;
  MENU_NAME: string;
}
export default function Navbar() {
  const [avatarmenu, setAvatarMenu] = useState(false);
  const [langmenu, setLangMenu] = useState(false);
  const [lang, setLang] = useContext(LangConText);
  const [userData, setUserData] = useContext(UserContext);
  const [server_string, setServer_String] = useState(
    "http://14.160.33.94:5011/api"
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
      MENU_ITEM: <EQ_STATUS />,
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
      MENU_ITEM: <CAPASX />,
    },
    {
      MENU_CODE: "QL6",
      MENU_NAME: getlang("quanlymrp", lang),
      MENU_ITEM: <CAPASX />,
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
      MENU_ITEM: <DATASX2 />,
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
  const [selectedTab, setSelectedTab] = useState<SEARCH_LIST_DATA>({
    MENU_CODE: "NS2",
    MENU_NAME: getlang("diemdanhnhom", lang),
  });
  const tabModeSwap: boolean = useSelector(
    (state: RootState) => state.totalSlice.tabModeSwap
  );
  const tabIndex: number = useSelector(
    (state: RootState) => state.totalSlice.tabIndex
  );
  const tabs: ELE_ARRAY[] = useSelector(
    (state: RootState) => state.totalSlice.tabs
  );
  const dispatch = useDispatch();
  useEffect(() => {
    let saveLang: any = localStorage.getItem("lang")?.toString();
    if (saveLang !== undefined) {
      setLang(saveLang.toString());
    } else {
      setLang("en");
    }
    let server_ip_local: any = localStorage.getItem("server_ip")?.toString();
    if (server_ip_local !== undefined) {
      setServer_String(server_ip_local);
    } else {
      localStorage.setItem("server_ip", "http://14.160.33.94:5011/api");
    }
    let saveTab: any = localStorage.getItem("tabs")?.toString();
    //console.log('savetab',saveTab);
    if (saveTab !== undefined) {
      let tempTab: SEARCH_LIST_DATA[] = JSON.parse(saveTab);
      for (let i = 0; i < tempTab.length; i++) {
        if (tempTab[i].MENU_CODE !== "-1")
          dispatch(
            addTab({
              ELE_CODE: tempTab[i].MENU_CODE,
              ELE_NAME: tempTab[i].MENU_NAME,
              REACT_ELE: menulist.filter(
                (ele: MENU_LIST_DATA, index: number) =>
                  ele.MENU_CODE === tempTab[i].MENU_CODE
              )[0].MENU_ITEM,
            })
          );
      }
      dispatch(
        settabIndex(
          tempTab.filter(
            (ele: SEARCH_LIST_DATA, index: number) => ele.MENU_CODE !== "-1"
          ).length
        )
      );
      localStorage.setItem(
        "tabs",
        JSON.stringify(
          tempTab.filter(
            (ele: SEARCH_LIST_DATA, index: number) => ele.MENU_CODE !== "-1"
          )
        )
      );
      setSelectedTab({
        MENU_CODE: "",
        MENU_NAME: "",
      });
    } else {
    }
  }, []);
  const filterOptions1 = createFilterOptions({
    matchFrom: "any",
    limit: 100,
  });
  const logout_bt = () => {
    logout();
  };
  const showhideAvatarMenu = () => {
    setAvatarMenu(!avatarmenu);
    setLangMenu(false);
  };
  const showhideLangMenu = () => {
    setLangMenu(!langmenu);
    setAvatarMenu(false);
  };
  const changeLanguage = (selectLang: string) => {
    //console.log(selectLang);
    setLangMenu(false);
    setLang(selectLang);
    localStorage.setItem("lang", selectLang);
  };
  return (
    <div className='navbar'>
      <div
        className='wrapper'
        style={
          {
            /* backgroundColor:
            server_string === "http://14.160.33.94:5011/api" ? "" : "#f37cf7", */
          }
        }
      >
        <div className="navleft">
        <FcList
          onClick={() => {
            dispatch(toggleSidebar("2"));
          }}
          size={30}
        />

        </div>
        <div className="navcenter">
        <div className='cmslogo' style={{ cursor: "pointer" }}>
          <Link to='/' className='menulink'>
            <img
              alt='cmsvina logo'
              src='/logocmsvina.png'
              width={171.6}
              height={40.7}
            />
          </Link>
         
        </div>
        <div className="webver">
          <b> Web Ver: {current_ver} </b>
        </div>
        

        </div>
        <div className="navright">
        <div className='search'>
          {tabModeSwap && (
            <Autocomplete
              autoComplete={false}
              autoFocus={true}
              sx={{
                height: 10,
                margin: "1px",
                position: "initial",
                width: "280px",
                marginBottom: "35px",
              }}
              size='small'
              disablePortal
              options={menulist.map((ele: MENU_LIST_DATA, index: number) => {
                return {
                  MENU_CODE: ele.MENU_CODE,
                  MENU_NAME: ele.MENU_NAME,
                };
              })}
              className='autocomplete'
              filterOptions={filterOptions1}
              isOptionEqualToValue={(option: any, value: any) =>
                option.MENU_CODE === value.MENU_CODE
              }
              getOptionLabel={(option: SEARCH_LIST_DATA | any) =>
                `${option.MENU_CODE}${option.MENU_NAME}`
              }
              autoHighlight={true}
              renderInput={(params) => {
                return (
                  <div className='listitem'>
                    <TextField {...params} label='Quick Search' />
                  </div>
                );
              }}
              defaultValue={{
                MENU_CODE: "NS2",
                MENU_NAME: getlang("diemdanhnhom", lang),
              }}
              value={selectedTab}
              onChange={(event: any, newValue: SEARCH_LIST_DATA | any) => {
                //console.log(newValue);
                if (newValue !== null) {
                  setSelectedTab(newValue);
                  if (
                    userData.JOB_NAME === "ADMIN" ||
                    userData.JOB_NAME === "Leader" ||
                    userData.JOB_NAME === "Sub Leader" ||
                    userData.JOB_NAME === "Dept Staff"
                  ) {
                    if (tabModeSwap) {
                      dispatch(
                        addTab({
                          ELE_NAME: newValue.MENU_NAME,
                          ELE_CODE: newValue.MENU_CODE,
                          REACT_ELE: menulist.filter(
                            (ele: MENU_LIST_DATA, index: number) =>
                              ele.MENU_CODE === newValue.MENU_CODE
                          )[0].MENU_ITEM,
                        })
                      );
                      dispatch(settabIndex(tabs.length));
                      setSelectedTab({
                        MENU_CODE: "",
                        MENU_NAME: "",
                      });
                    }
                  } else {
                    Swal.fire("Cảnh báo", "Không đủ quyền hạn", "error");
                  }
                }
              }}
            />
          )}     
         
        </div>
        
       
        <div className='items'>
          <div className='item' onClick={showhideLangMenu}>
            <LanguageIcon className='icon' />
            {lang === "vi"
              ? "Tiếng Việt"
              : lang === "kr"
              ? "한국어"
              : "English"}
          </div>
          {langmenu && (
            <div className='langmenu'>
              <div className='menu'>
                <div className='menu_item'>
                  <AccountCircleIcon className='menu_icon' />
                  <span
                    className='menulink'
                    onClick={() => {
                      changeLanguage("vi");
                    }}
                  >
                    Tiếng Việt
                  </span>
                </div>
                <div className='menu_item'>
                  <LogoutIcon className='menu_icon' />
                  <span
                    className='menulink'
                    onClick={() => {
                      changeLanguage("kr");
                    }}
                  >
                    한국어
                  </span>
                </div>
                <div className='menu_item'>
                  <LogoutIcon className='menu_icon' />
                  <span
                    className='menulink'
                    onClick={() => {
                      changeLanguage("en");
                    }}
                  >
                    English
                  </span>
                </div>
              </div>
            </div>
          )}
          <div className='item'>
            <div className={"avatar"} onClick={showhideAvatarMenu}>
              {userData.EMPL_IMAGE !== "Y" && userData.FIRST_NAME.slice(0, 1)}
              {userData.EMPL_IMAGE === "Y" && (
                <img
                  width={50}
                  height={50}
                  src={"/Picture_NS/NS_" + userData.EMPL_NO + ".jpg"}
                  alt={userData.EMPL_NO}
                ></img>
              )}
            </div>
          </div>
          {avatarmenu && (
            <div className='avatarmenu'>
              <div className='menu'>
                <div className='menu_item'>
                  <AccountCircleIcon className='menu_icon' />
                  <Link
                    to='/accountinfo'
                    className='menulink'
                    onClick={() => setAvatarMenu(false)}
                  >
                    Account Information
                  </Link>
                </div>
                <div className='menu_item'>
                  <SwitchRightIcon className='menu_icon' />
                  <FormControlLabel
                    label={tabModeSwap ? "Multiple Tabs" : "Single Tab"}
                    control={
                      <Checkbox
                        checked={tabModeSwap}
                        onChange={(e) => {
                          if (!tabModeSwap) {
                            dispatch(resetTab(0));
                            dispatch(
                              addTab({
                                ELE_CODE: "NS0",
                                ELE_NAME: "ACCOUNT_INFO",
                                REACT_ELE: <AccountInfo />,
                              })
                            );
                          }
                          dispatch(setTabModeSwap(!tabModeSwap));
                        }}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    }
                  />
                  
                </div>
                <div className='menu_item'>
                  <LogoutIcon className='menu_icon' />
                  <span
                    className='menulink'
                    onClick={() => {
                      logout_bt();
                    }}
                  >
                    Logout
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        </div>
       
        
      </div>
    </div>
  );
}

import React, { ReactElement, useContext, useState } from "react";
import { Link } from "react-router-dom";
import "./Submenu.scss";
import { RootState } from "../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import {
  changeDiemDanhState,
  changeUserData,
  UserData,
  toggleSidebar,
  setTabModeSwap,
  ELE_ARRAY
} from "../../redux/slices/globalSlice";
import { addTab, settabIndex, resetTab } from "../../redux/slices/globalSlice";

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
import Swal from "sweetalert2";
import { LangConText, UserContext } from "../../api/Context";
import { getlang } from "../String/String";

interface MENU_LIST_DATA {
  MENU_CODE: string;
  MENU_NAME: string;
  MENU_ITEM: ReactElement;
}


const SubMenu = ({ item }: { item: any }) => {
  const [userData, setUserData] = useContext(UserContext);
  const [subnav, setSubnav] = useState(false);
  const [lang, setLang] = useContext(LangConText);
  const showSubnav = () => setSubnav(!subnav);
  const menulist: MENU_LIST_DATA[]=([   
    {
      MENU_CODE: "NS0",
      MENU_NAME: 'Account Info',
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
      MENU_NAME: getlang('quanlypo',lang),
      MENU_ITEM: <PoManager />,
    },
    {
      MENU_CODE: "KD2",
      MENU_NAME: getlang('quanlyinvoices',lang),
      MENU_ITEM: <InvoiceManager />,
    },
    {
      MENU_CODE: "KD3",
      MENU_NAME: getlang('quanlyplan',lang),
      MENU_ITEM: <PlanManager />,
    },
    {
      MENU_CODE: "KD4",
      MENU_NAME: getlang('shortage',lang),
      MENU_ITEM: <ShortageKD />,
    },
    {
      MENU_CODE: "KD5",
      MENU_NAME: getlang('quanlyFCST',lang),
      MENU_ITEM: <FCSTManager />,
    },
    {
      MENU_CODE: "KD6",
      MENU_NAME: getlang('quanlyYCSX',lang),
      MENU_ITEM: <YCSXManager />,
    },
    {
      MENU_CODE: "KD7",
      MENU_NAME: getlang('quanlyPOFull',lang),
      MENU_ITEM: <POandStockFull />,
    },
    {
      MENU_CODE: "KD8",
      MENU_NAME: getlang('thongtinsanpham',lang),
      MENU_ITEM: <CODE_MANAGER />,
    },
    {
      MENU_CODE: "KD9",
      MENU_NAME: getlang('quanlycodebom',lang),
      MENU_ITEM: <BOM_MANAGER />,
    },
    {
      MENU_CODE: "KD10",
      MENU_NAME: getlang('quanlykhachhang',lang),
      MENU_ITEM: <CUST_MANAGER />,
    },
    {
      MENU_CODE: "KD11",
      MENU_NAME: getlang('eqstatus',lang),
      MENU_ITEM: <EQ_STATUS />,
    },
    {
      MENU_CODE: "KD12",
      MENU_NAME: getlang('ins_status',lang),
      MENU_ITEM: <INSPECT_STATUS />,
    },
    {
      MENU_CODE: "KD13",
      MENU_NAME: getlang('baocao',lang),
      MENU_ITEM: <KinhDoanhReport />,
    },
    {
      MENU_CODE: "QC1",
      MENU_NAME: getlang('quanlyYCSX',lang),
      MENU_ITEM: <YCSXManager />,
    },
    {
      MENU_CODE: "QC2",
      MENU_NAME: getlang('thongtinsanpham',lang),
      MENU_ITEM: <CODE_MANAGER />,
    },
    {
      MENU_CODE: "QC3",
      MENU_NAME: 'IQC',
      MENU_ITEM: <IQC />,
    },
    {
      MENU_CODE: "QC4",
      MENU_NAME: 'PQC',
      MENU_ITEM: <PQC />,
    },
    {
      MENU_CODE: "QC5",
      MENU_NAME: 'OQC',
      MENU_ITEM: <OQC />,
    },
    {
      MENU_CODE: "QC6",
      MENU_NAME: getlang('inspection',lang),
      MENU_ITEM: <KIEMTRA />,
    },
    {
      MENU_CODE: "QC7",
      MENU_NAME: 'CS',
      MENU_ITEM: <CSTOTAL />,
    },
    {
      MENU_CODE: "QC8",
      MENU_NAME: getlang('dtc',lang),
      MENU_ITEM: <DTC />,
    },
    {
      MENU_CODE: "QC9",
      MENU_NAME: 'ISO',
      MENU_ITEM: <ISO />,
    },
    {
      MENU_CODE: "QC10",
      MENU_NAME: getlang('baocaoqc',lang),
      MENU_ITEM: <QC/>,
    },
    {
      MENU_CODE: "RD1",
      MENU_NAME: getlang('quanlycodebom',lang),
      MENU_ITEM: <BOM_MANAGER />,
    },
    {
      MENU_CODE: "RD2",
      MENU_NAME: getlang('thembomamazon',lang),
      MENU_ITEM: <BOM_AMAZON />,
    },
    {
      MENU_CODE: "RD3",
      MENU_NAME: getlang('dtc',lang),
      MENU_ITEM: <DTC />,
    },
    {
      MENU_CODE: "RD4",
      MENU_NAME: getlang('quanlyYCSX',lang),
      MENU_ITEM: <YCSXManager />,
    },
    {
      MENU_CODE: "RD5",
      MENU_NAME: getlang('thietkedesignamazon',lang),
      MENU_ITEM: <DESIGN_AMAZON />,
    },
    {
      MENU_CODE: "QL1",
      MENU_NAME: getlang('quanlyYCSX',lang),
      MENU_ITEM: <YCSXManager />,
    },
    {
      MENU_CODE: "QL2",
      MENU_NAME: getlang('quanlycodebom',lang),
      MENU_ITEM: <BOM_MANAGER />,
    },
    {
      MENU_CODE: "QL3",
      MENU_NAME: getlang('thongtinsanpham',lang),
      MENU_ITEM: <CODE_MANAGER />,
    },
    {
      MENU_CODE: "QL4",
      MENU_NAME: getlang('quanlyplansx',lang),
      MENU_ITEM: <QLSXPLAN />,
    },
    {
      MENU_CODE: "QL5",
      MENU_NAME: getlang('quanlycapa',lang),
      MENU_ITEM: <CAPASX />,
    },
    {
      MENU_CODE: "QL6",
      MENU_NAME: getlang('quanlymrp',lang),
      MENU_ITEM: <CAPASX />,
    },
    {
      MENU_CODE: "QL7",
      MENU_NAME: 'PLAN VISUAL',
      MENU_ITEM: <MACHINE />,
    },
    {
      MENU_CODE: "QL8",
      MENU_NAME: 'QUICK PLAN',
      MENU_ITEM: <QUICKPLAN />,
    }, 
    {
      MENU_CODE: "QL9",
      MENU_NAME: 'TRA PLAN',
      MENU_ITEM: <PLAN_DATATB />,
    },
    {
      MENU_CODE: "QL10",
      MENU_NAME: 'INPUT LIEU',
      MENU_ITEM: <LICHSUINPUTLIEU />,
    },
    {
      MENU_CODE: "QL11",
      MENU_NAME: 'PLAN STATUS',
      MENU_ITEM: <PLAN_STATUS />,
    },
    {
      MENU_CODE: "QL12",
      MENU_NAME: 'EQ STATUS',
      MENU_ITEM: <EQ_STATUS />,
    },
    {
      MENU_CODE: "SX1",
      MENU_NAME: getlang('quanlyYCSX',lang),
      MENU_ITEM: <YCSXManager />,
    },
    {
      MENU_CODE: "SX2",
      MENU_NAME: getlang('thongtinsanpham',lang),
      MENU_ITEM: <CODE_MANAGER />,
    },
    {
      MENU_CODE: "SX3",
      MENU_NAME: getlang('datasanxuat',lang),
      MENU_ITEM: <DATASX2 />,
    },
    {
      MENU_CODE: "SX4",
      MENU_NAME: getlang('inspection',lang),
      MENU_ITEM: <KIEMTRA />,
    },
    {
      MENU_CODE: "SX5",
      MENU_NAME: getlang('planstatus',lang),
      MENU_ITEM: <TRANGTHAICHITHI />,
    },
    {
      MENU_CODE: "SX6",
      MENU_NAME: getlang('eqstatus',lang),
      MENU_ITEM: <EQ_STATUS />,
    },
    {
      MENU_CODE: "SX7",
      MENU_NAME: getlang('khothat',lang),
      MENU_ITEM: <KHOLIEU />,
    },
    {
      MENU_CODE: "SX8",
      MENU_NAME: getlang('khoao',lang),
      MENU_ITEM: <KHOAO />,
    },
    {
      MENU_CODE: "SX9",
      MENU_NAME: getlang('lichsuxuatlieuthat',lang),
      MENU_ITEM: <LICHSUINPUTLIEU />,
    },
    {
      MENU_CODE: "SX10",
      MENU_NAME: getlang('materiallotstatus',lang),
      MENU_ITEM: <TINHHINHCUONLIEU />,
    },
    {
      MENU_CODE: "",
      MENU_NAME: '',
      MENU_ITEM: <AccountInfo />,
    },
    {
      MENU_CODE: "-1",
      MENU_NAME: '',
      MENU_ITEM: <AccountInfo />,
    },
  ]);


  const globalUserData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );
  const tabModeSwap: boolean = useSelector(
    (state: RootState) => state.totalSlice.tabModeSwap
  );
  const tabs: ELE_ARRAY[] = useSelector(
    (state: RootState) => state.totalSlice.tabs
  );
  const dispatch = useDispatch();
  return (
    <>
      <Link
        className='SidebarLink'
        to={item.path}
        onClick={()=> {
          if(item.subNav)
          showSubnav()
        }}
      >
        <div className="flex">
          {item.icon}
          <span className='SidebarLabel'>{item.title}</span>
        </div>
        <div>
          {item.subNav && subnav
            ? item.iconOpened
            : item.subNav
            ? item.iconClosed
            : null}
        </div>
      </Link>
      {subnav &&
        item.subNav.map((item: any, index: any) => {
          return (
            <Link className='DropdownLink' to={item.path} key={index}  onClick={()=> {
             if(tabModeSwap)
             {
              if(userData.JOB_NAME === 'ADMIN' || userData.JOB_NAME === 'Leader' || userData.JOB_NAME === 'Sub Leader' || userData.JOB_NAME === 'Dept Staff' || item.MENU_CODE==='NS4' || item.MENU_CODE==='NS6')
              {
                if(tabModeSwap)
                {
                  dispatch(
                    addTab({
                      ELE_NAME: item.title,
                      ELE_CODE: item.MENU_CODE,
                      REACT_ELE: menulist.filter(
                        (ele: MENU_LIST_DATA, index: number) =>
                          ele.MENU_CODE === item.MENU_CODE
                      )[0].MENU_ITEM,
                    })
                  );
                  dispatch(settabIndex(tabs.length));             
                }
              }
              else
              {
                Swal.fire('Cảnh báo','Không đủ quyền hạn','error');
              } 
             }
            }}>
              {item.icon}
              <span className='SidebarLabel'>{item.title}</span>
            </Link>
          );
        })}
    </>
  );
};

export default SubMenu;

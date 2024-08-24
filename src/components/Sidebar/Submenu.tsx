import React, { ReactElement, useContext, useState, lazy } from "react";
import { Link } from "react-router-dom";
import "./Submenu.scss";
import { RootState } from "../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { addTab, settabIndex, resetTab } from "../../redux/slices/globalSlice";
import { ELE_ARRAY, UserData } from "../../api/GlobalInterface";
import Swal from "sweetalert2";
import { LangConText, UserContext } from "../../api/Context";
import { getlang } from "../String/String";
const QUICKPLAN2 = React.lazy(() => import("../../pages/qlsx/QLSXPLAN/QUICKPLAN/QUICKPLAN2"));
const QCReport = React.lazy(() => import("../../pages/qc/qcreport/QCReport"));
const MACHINE = lazy(() => import("../../pages/qlsx/QLSXPLAN/Machine/MACHINE"));
const PLAN_STATUS = lazy(() => import("../../pages/qlsx/QLSXPLAN/PLAN_STATUS/PLAN_STATUS"));
const QuanLyPhongBanNhanSu = lazy(() => import("../../pages/nhansu/QuanLyPhongBanNhanSu/QuanLyPhongBanNhanSu"));
const DiemDanhNhom = lazy(() => import("../../pages/nhansu/DiemDanhNhom/DiemDanhNhom"));
const DieuChuyenTeam = lazy(() => import("../../pages/nhansu/DieuChuyenTeam/DieuChuyenTeam"));
const TabDangKy = lazy(() => import("../../pages/nhansu/DangKy/TabDangKy"));
const PheDuyetNghi = lazy(() => import("../../pages/nhansu/PheDuyetNghi/PheDuyetNghi"));
const LichSu = lazy(() => import("../../pages/nhansu/LichSu/LichSu"));
const QuanLyCapCao = lazy(() => import("../../pages/nhansu/QuanLyCapCao/QuanLyCapCao"));
const BaoCaoNhanSu = lazy(() => import("../../pages/nhansu/BaoCaoNhanSu/BaoCaoNhanSu"));
const PoManager = lazy(() => import("../../pages/kinhdoanh/pomanager/PoManager"));
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
const DATASX = lazy(() => import("../../pages/qlsx/QLSXPLAN/DATASX/DATASX"));
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

interface MENU_LIST_DATA {
  MENU_CODE: string;
  MENU_NAME: string;
  MENU_ITEM: ReactElement;
}

const SubMenu = ({ item }: { item: any }) => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData,
  );
  const company: string = useSelector(
    (state: RootState) => state.totalSlice.company,
  );
  const [subnav, setSubnav] = useState(false);
  const [lang, setLang] = useContext(LangConText);
  const showSubnav = () => setSubnav(!subnav);
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
      MENU_ITEM: <QUICKPLAN2 />,
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
      MENU_ITEM: <DATASX />,
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

  const globalUserData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData,
  );
  const tabModeSwap: boolean = useSelector(
    (state: RootState) => state.totalSlice.tabModeSwap,
  );
  const tabs: ELE_ARRAY[] = useSelector(
    (state: RootState) => state.totalSlice.tabs,
  );
  const dispatch = useDispatch();
  return (
    <>
      <Link
        className="SidebarLink"
        to={item.path}
        onClick={() => {
          if (item.subNav) showSubnav();
        }}
      >
        <div className="flex">
          {item.icon}
          <span className="SidebarLabel">{item.title}</span>
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
            <Link
              className="DropdownLink"
              to={item.path}
              key={index}
              onClick={() => {
                if (tabModeSwap) {
                  if (
                    userData?.JOB_NAME === "ADMIN" ||
                    userData?.JOB_NAME === "Leader" ||
                    userData?.JOB_NAME === "Sub Leader" ||
                    userData?.JOB_NAME === "Dept Staff" ||
                    item.MENU_CODE === "NS4" ||
                    item.MENU_CODE === "NS6"
                  ) {
                    if (tabModeSwap) {
                      let ele_code_array: string[] = tabs.map(
                        (ele: ELE_ARRAY, index: number) => {
                          return ele.ELE_CODE;
                        },
                      );
                      let tab_index: number = ele_code_array.indexOf(
                        item.MENU_CODE,
                      );
                      //console.log(tab_index);
                      if (tab_index !== -1) {
                        //console.log('co tab roi');
                        dispatch(settabIndex(tab_index));
                      } else {
                        //console.log('chua co tab');
                        dispatch(
                          addTab({
                            ELE_NAME: item.title,
                            ELE_CODE: item.MENU_CODE,
                            REACT_ELE: menulist.filter(
                              (ele: MENU_LIST_DATA, index: number) =>
                                ele.MENU_CODE === item.MENU_CODE,
                            )[0].MENU_ITEM,
                          }),
                        );
                        dispatch(settabIndex(tabs.length));
                      }
                    }
                  } else {
                    Swal.fire("Cảnh báo", "Không đủ quyền hạn", "error");
                  }
                }
              }}
            >
              {item.icon}
              <span className="SidebarLabel">{item.title}</span>
            </Link>
          );
        })}
    </>
  );
};

export default SubMenu;

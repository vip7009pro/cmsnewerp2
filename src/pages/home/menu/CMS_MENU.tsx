import { getUserData } from "../../../api/Api";
import { AccountInfo, AddInfo, BANGCHAMCONG, BaoCaoNhanSu, BAOCAOSXALL, BCSX, Blank, BOM_AMAZON, BOM_MANAGER, CAPA_MANAGER, CODE_MANAGER, CSTOTAL, CUST_MANAGER, DESIGN_AMAZON, DiemDanhNhomCMS, DieuChuyenTeamCMS, DTC, EQ_STATUS, EQ_STATUS2, FCSTManager, FileTransfer, Information, INSPECT_STATUS, InvoiceManager, IQC, ISO, KHOAO, KHOLIEU, KHOSUB, KHOSX, KHOTP, KIEMTRA, KinhDoanhReport, LichSu_New, LICHSUINPUTLIEU, MACHINE, NOCODELOWCODE, OQC, OVER_MONITOR, PermissionNotify, PheDuyetNghiCMS, PLAN_DATATB, PLAN_STATUS, PlanManager, PLANRESULT, POandStockFull, PoManager, PostManager, PQC, PRODUCT_BARCODE_MANAGER, QCReport, QLSXPLAN, QLVL, QuanLyCapCao, QuanLyCapCao_NS, QuanLyPhongBanNhanSu, QUICKPLAN2, QuotationTotal, RND_REPORT, SAMPLE_MONITOR, SettingPage, ShortageKD, TabDangKy, TINHLIEU, TINHLUONGP3, TRANGTHAICHITHI, WH_REPORT, YCSXManager, } from "../../../api/lazyPages";
import { getLangSafe } from "../menuConfig";

export const CMS_MENU= (lang?: string) => { 
    return [
      {
        MENU_CODE: 'BL1',
        MENU_NAME: 'XXX',
        MENU_ITEM: <Blank />,
      },
      {
        MENU_CODE: 'NS0',
        MENU_NAME: 'Account Info',
        MENU_ITEM: <AccountInfo />,
      },
      {
        MENU_CODE: 'NS1',
        MENU_NAME: getLangSafe('quanlyphongban', lang),
        MENU_ITEM: <QuanLyPhongBanNhanSu />,
      },
      {
        MENU_CODE: 'NS2',
        MENU_NAME: getLangSafe('diemdanhnhom', lang),
        MENU_ITEM: <DiemDanhNhomCMS option='diemdanhnhom' />,
      },
      {
        MENU_CODE: 'NS3',
        MENU_NAME: getLangSafe('dieuchuyenteam', lang),
        MENU_ITEM: <DieuChuyenTeamCMS option1='diemdanhnhom' option2='workpositionlist_BP' />,
      },
      {
        MENU_CODE: 'NS4',
        MENU_NAME: getLangSafe('dangky', lang),
        MENU_ITEM: <TabDangKy />,
      },
      {
        MENU_CODE: 'NS5',
        MENU_NAME: getLangSafe('pheduyet', lang),
        MENU_ITEM: <PheDuyetNghiCMS option='pheduyetnhom' />,
      },
      {
        MENU_CODE: 'NS6',
        MENU_NAME: getLangSafe('lichsudilam', lang),
        MENU_ITEM: <LichSu_New />,
      },
      {
        MENU_CODE: 'NS7',
        MENU_NAME: getLangSafe('quanlycapcao', lang),
        MENU_ITEM: <QuanLyCapCao />,
      },
      {
        MENU_CODE: 'NS8',
        MENU_NAME: getLangSafe('baocaonhansu', lang),
        MENU_ITEM: <BaoCaoNhanSu />,
      },
      {
        MENU_CODE: 'NS9',
        MENU_NAME: getLangSafe('listchamcong', lang),
        MENU_ITEM: <BANGCHAMCONG />,
      },
      {
        MENU_CODE: 'NS10',
        MENU_NAME: getLangSafe('quanlycapcao', lang),
        MENU_ITEM: <QuanLyCapCao_NS />,
      },
      {
        MENU_CODE: 'KD1',
        MENU_NAME: getLangSafe('quanlypo', lang),
        MENU_ITEM: <PoManager />,
      },
      {
        MENU_CODE: 'KD2',
        MENU_NAME: getLangSafe('quanlyinvoices', lang),
        MENU_ITEM: <InvoiceManager />,
      },
      {
        MENU_CODE: 'KD3',
        MENU_NAME: getLangSafe('quanlyplan', lang),
        MENU_ITEM: <PlanManager />,
      },
      {
        MENU_CODE: 'KD4',
        MENU_NAME: getLangSafe('shortage', lang),
        MENU_ITEM: <ShortageKD />,
      },
      {
        MENU_CODE: 'KD5',
        MENU_NAME: getLangSafe('quanlyFCST', lang),
        MENU_ITEM: <FCSTManager />,
      },
      {
        MENU_CODE: 'KD6',
        MENU_NAME: getLangSafe('quanlyYCSX', lang),
        MENU_ITEM: <YCSXManager />,
      },
      {
        MENU_CODE: 'KD7',
        MENU_NAME: getLangSafe('quanlyPOFull', lang),
        MENU_ITEM: <POandStockFull />,
      },
      {
        MENU_CODE: 'KD8',
        MENU_NAME: getLangSafe('thongtinsanpham', lang),
        MENU_ITEM: <CODE_MANAGER />,
      },
      {
        MENU_CODE: 'KD9',
        MENU_NAME: getLangSafe('quanlycodebom', lang),
        MENU_ITEM: <BOM_MANAGER />,
      },
      {
        MENU_CODE: 'KD10',
        MENU_NAME: getLangSafe('quanlykhachhang', lang),
        MENU_ITEM: <CUST_MANAGER />,
      },
      {
        MENU_CODE: 'KD11',
        MENU_NAME: getLangSafe('eqstatus', lang),
        MENU_ITEM: <EQ_STATUS2 />,
      },
      {
        MENU_CODE: 'KD12',
        MENU_NAME: getLangSafe('ins_status', lang),
        MENU_ITEM: <INSPECT_STATUS />,
      },
      {
        MENU_CODE: 'KD13',
        MENU_NAME: getLangSafe('baocao', lang),
        MENU_ITEM: <KinhDoanhReport />,
      },
      {
        MENU_CODE: 'KD14',
        MENU_NAME: getLangSafe('quanlygia', lang),
        MENU_ITEM: <QuotationTotal />,
      },
      {
        MENU_CODE: 'KD15',
        MENU_NAME: getLangSafe('ins_status', lang),
        MENU_ITEM: <OVER_MONITOR />,
      },
      {
        MENU_CODE: 'PU1',
        MENU_NAME: getLangSafe('quanlyvatlieu', lang),
        MENU_ITEM: <QLVL />,
      },
      {
        MENU_CODE: 'PU2',
        MENU_NAME: getLangSafe('quanlymrp', lang),
        MENU_ITEM: <TINHLIEU />,
      },
      {
        MENU_CODE: 'QC1',
        MENU_NAME: getLangSafe('quanlyYCSX', lang),
        MENU_ITEM: <YCSXManager />,
      },
      {
        MENU_CODE: 'QC2',
        MENU_NAME: getLangSafe('thongtinsanpham', lang),
        MENU_ITEM: <CODE_MANAGER />,
      },
      {
        MENU_CODE: 'QC3',
        MENU_NAME: 'IQC',
        MENU_ITEM: <IQC />,
      },
      {
        MENU_CODE: 'QC4',
        MENU_NAME: 'PQC',
        MENU_ITEM: <PQC />,
      },
      {
        MENU_CODE: 'QC5',
        MENU_NAME: 'OQC',
        MENU_ITEM: <OQC />,
      },
      {
        MENU_CODE: 'QC6',
        MENU_NAME: getLangSafe('inspection', lang),
        MENU_ITEM: <KIEMTRA />,
      },
      {
        MENU_CODE: 'QC7',
        MENU_NAME: 'CS',
        MENU_ITEM: <CSTOTAL />,
      },
      {
        MENU_CODE: 'QC8',
        MENU_NAME: getLangSafe('dtc', lang),
        MENU_ITEM: <DTC />,
      },
      {
        MENU_CODE: 'QC9',
        MENU_NAME: 'ISO',
        MENU_ITEM: <ISO />,
      },
      {
        MENU_CODE: 'QC10',
        MENU_NAME: getLangSafe('baocaoqc', lang),
        MENU_ITEM: <QCReport />,
      },
      {
        MENU_CODE: 'RD1',
        MENU_NAME: getLangSafe('quanlycodebom', lang),
        MENU_ITEM: <BOM_MANAGER />,
      },
      {
        MENU_CODE: 'RD2',
        MENU_NAME: getLangSafe('thembomamazon', lang),
        MENU_ITEM: <BOM_AMAZON />,
      },
      {
        MENU_CODE: 'RD3',
        MENU_NAME: getLangSafe('dtc', lang),
        MENU_ITEM: <DTC />,
      },
      {
        MENU_CODE: 'RD4',
        MENU_NAME: getLangSafe('quanlyYCSX', lang),
        MENU_ITEM: <YCSXManager />,
      },
      {
        MENU_CODE: 'RD5',
        MENU_NAME: getLangSafe('thietkedesignamazon', lang),
        MENU_ITEM: <DESIGN_AMAZON />,
      },
      {
        MENU_CODE: 'RD6',
        MENU_NAME: getLangSafe('productbarcodemanager', lang),
        MENU_ITEM: <PRODUCT_BARCODE_MANAGER />,
      },
      {
        MENU_CODE: 'RD7',
        MENU_NAME: getLangSafe('baocaornd', lang),
        MENU_ITEM: <RND_REPORT />,
      },
      {
        MENU_CODE: 'RD8',
        MENU_NAME: getLangSafe('samplemonitor', lang),
        MENU_ITEM: <SAMPLE_MONITOR />,
      },
      {
        MENU_CODE: 'QL1',
        MENU_NAME: getLangSafe('quanlyYCSX', lang),
        MENU_ITEM: <YCSXManager />,
      },
      {
        MENU_CODE: 'QL2',
        MENU_NAME: getLangSafe('quanlycodebom', lang),
        MENU_ITEM: <BOM_MANAGER />,
      },
      {
        MENU_CODE: 'QL3',
        MENU_NAME: getLangSafe('thongtinsanpham', lang),
        MENU_ITEM: <CODE_MANAGER />,
      },
      {
        MENU_CODE: 'QL4',
        MENU_NAME: getLangSafe('quanlyplansx', lang),
        MENU_ITEM: <QLSXPLAN />,
      },
      {
        MENU_CODE: 'QL5',
        MENU_NAME: getLangSafe('quanlycapa', lang),
        MENU_ITEM: <CAPA_MANAGER />,
      },
      {
        MENU_CODE: 'QL6',
        MENU_NAME: getLangSafe('quanlymrp', lang),
        MENU_ITEM: <CAPA_MANAGER />,
      },
      {
        MENU_CODE: 'QL7',
        MENU_NAME: 'PLAN VISUAL',
        MENU_ITEM: <MACHINE />,
      },
      {
        MENU_CODE: 'QL8',
        MENU_NAME: 'QUICK PLAN',
        MENU_ITEM: <QUICKPLAN2 />,
      },
      {
        MENU_CODE: 'QL9',
        MENU_NAME: 'TRA PLAN',
        MENU_ITEM: <PLAN_DATATB />,
      },
      {
        MENU_CODE: 'QL10',
        MENU_NAME: 'INPUT LIEU',
        MENU_ITEM: <LICHSUINPUTLIEU />,
      },
      {
        MENU_CODE: 'QL11',
        MENU_NAME: 'PLAN STATUS',
        MENU_ITEM: <PLAN_STATUS />,
      },
      {
        MENU_CODE: 'QL12',
        MENU_NAME: 'EQ STATUS',
        MENU_ITEM: <EQ_STATUS />,
      },
      {
        MENU_CODE: 'SX1',
        MENU_NAME: getLangSafe('quanlyYCSX', lang),
        MENU_ITEM: <YCSXManager />,
      },
      {
        MENU_CODE: 'SX2',
        MENU_NAME: getLangSafe('thongtinsanpham', lang),
        MENU_ITEM: <CODE_MANAGER />,
      },
      {
        MENU_CODE: 'SX3',
        MENU_NAME: getLangSafe('datasanxuat', lang),
        MENU_ITEM: <BAOCAOSXALL />,
      },
      {
        MENU_CODE: 'SX4',
        MENU_NAME: getLangSafe('inspection', lang),
        MENU_ITEM: <KIEMTRA />,
      },
      {
        MENU_CODE: 'SX5',
        MENU_NAME: getLangSafe('planstatus', lang),
        MENU_ITEM: <TRANGTHAICHITHI />,
      },
      {
        MENU_CODE: 'SX6',
        MENU_NAME: getLangSafe('eqstatus', lang),
        MENU_ITEM: <EQ_STATUS />,
      },
      {
        MENU_CODE: 'SX7',
        MENU_NAME: getLangSafe('khothat', lang),
        MENU_ITEM: <KHOLIEU />,
      },
      {
        MENU_CODE: 'SX8',
        MENU_NAME: getLangSafe('khoao', lang),
        MENU_ITEM: <KHOAO />,
      },
      {
        MENU_CODE: 'SX15',
        MENU_NAME: getLangSafe('khosub', lang),
        MENU_ITEM: <KHOSUB />,
      },
      {
        MENU_CODE: 'SX16',
        MENU_NAME: getLangSafe('eqstatus', lang),
        MENU_ITEM: <EQ_STATUS2 />,
      },
      {
        MENU_CODE: 'SX17',
        MENU_NAME: getLangSafe('khosx', lang),
        MENU_ITEM: <KHOSX />,
      },
      {
        MENU_CODE: 'SX18',
        MENU_NAME: getLangSafe('tinhluongP3', lang),
        MENU_ITEM: <TINHLUONGP3 />,
      },
      {
        MENU_CODE: 'SX11',
        MENU_NAME: getLangSafe('quanlycapa', lang),
        MENU_ITEM: <CAPA_MANAGER />,
      },
      {
        MENU_CODE: 'SX12',
        MENU_NAME: getLangSafe('hieusuatsx', lang),
        MENU_ITEM: <PLANRESULT />,
      },
      {
        MENU_CODE: 'SX13',
        MENU_NAME: getLangSafe('baocaosx', lang),
        MENU_ITEM: <BCSX />,
      },
      {
        MENU_CODE: 'KO1',
        MENU_NAME: getLangSafe('nhapxuattontp', lang),
        MENU_ITEM: <KHOTP />,
      },
      {
        MENU_CODE: 'KO2',
        MENU_NAME: getLangSafe('nhapxuattonlieu', lang),
        MENU_ITEM: <KHOLIEU />,
      },
      {
        MENU_CODE: 'KO3',
        MENU_NAME: getLangSafe('baocaokho', lang),
        MENU_ITEM: <WH_REPORT />,
      },
      {
        MENU_CODE: 'IF1',
        MENU_NAME: getLangSafe('information_board', lang),
        MENU_ITEM: <Information />,
      },
      {
        MENU_CODE: 'IF2',
        MENU_NAME: getLangSafe('information_register', lang),
        MENU_ITEM: <AddInfo />,
      },
      {
        MENU_CODE: 'IF3',
        MENU_NAME: getLangSafe('post_manager', lang),
        MENU_ITEM: <PostManager />,
      },
      {
        MENU_CODE: 'TL1',
        MENU_NAME: getLangSafe('filetransfer', lang),
        MENU_ITEM: <FileTransfer />,
      },
      {
        MENU_CODE: 'TL2',
        MENU_NAME: getLangSafe('nocodelowcode', lang),
        MENU_ITEM: getUserData()?.EMPL_NO === 'NHU1903' ? <NOCODELOWCODE /> : <PermissionNotify />,
      },
      {
        MENU_CODE: 'ST01',
        MENU_NAME: 'Setting',
        MENU_ITEM: <SettingPage />,
      },
      {
        MENU_CODE: '',
        MENU_NAME: '',
        MENU_ITEM: <AccountInfo />,
      },
      {
        MENU_CODE: '-1',
        MENU_NAME: '',
        MENU_ITEM: <AccountInfo />,
      },
    ];
    };
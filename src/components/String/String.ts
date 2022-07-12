type sentences = {
  sentenceID: number;
  vi: string;
  en: string;
  kr: string;
};
const globaltext: Array<sentences> = [
  {
    sentenceID: 0,
    vi: "Đăng Nhập",
    en: "Sign In",
    kr: "로그인",
  },
  {
    sentenceID: 1,
    vi: "Nhớ thông tin đăng nhập",
    en: "Remember me",
    kr: "나를 기억",
  },
  {
    sentenceID: 2,
    vi: "Quên mật khẩu",
    en: "Forget Password",
    kr: "비민번호 찾기",
  },
  {
    sentenceID: 3,
    vi: "Phòng Kinh Doanh",
    en: "Business Team",
    kr: "영업 팀",
  },
  {
    sentenceID: 4,
    vi: "Phòng Kinh Doanh",
    en: "Business Team",
    kr: "영업팀",
  },
  {
    sentenceID: 5,
    vi: "Quản Lý PO",
    en: "PO Management",
    kr: "PO 관리",
  },
  {
    sentenceID: 6,
    vi: "Quản Lý Invoices",
    en: "Invoice Management",
    kr: "인보이스 관리",
  },
  {
    sentenceID: 7,
    vi: "Quản Lý Plan",
    en: "Plan Management",
    kr: "납품계획 관리",
  },
  {
    sentenceID: 8,
    vi: "Quản Lý FCST",
    en: "FCST Management",
    kr: "FCST 관리",
  },
  {
    sentenceID: 9,
    vi: "Quản Lý YCSX",
    en: "Production Request Management",
    kr: "생산요청 관리",
  },
  {
    sentenceID: 10,
    vi: "PO Tích Hợp Tồn Kho",
    en: "Product Inventory Integrated PO",
    kr: "재고집적된 PO관리",
  },
  {
    sentenceID: 11,
    vi: "Báo cáo",
    en: "Report",
    kr: "리포트",
  },
];

const getsentence = (sentence: number, lang: string): any => {
  let output: string = "";      
    switch (lang) {
      case "kr":
        output = globaltext[sentence].kr;
        break;
      case "en":
        output = globaltext[sentence].en;
        break;
      case "vi":
        output = globaltext[sentence].vi;
        break;
      default:
        output = globaltext[sentence].vi;
        break;
    }      
  return output;    
};

export default getsentence;

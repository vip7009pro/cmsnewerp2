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
  {
    sentenceID: 12,
    vi: "Nhân sự",
    en: "HR",
    kr: "인사",
  }, {
    sentenceID: 13,
    vi: "Quản lý phòng ban- nhân sự",
    en: "Deparment - Employee Management",
    kr: "부서-인사 관리",
  }, {
    sentenceID: 14,
    vi: "Điểm danh nhóm",
    en: "My Group Attendant",
    kr: "내 그룹 출석 체크",
  }, {
    sentenceID: 15,
    vi: "Đăng ký",
    en: "Register",
    kr: "신청",
  }, {
    sentenceID: 16,
    vi: "Báo cáo nhân sự",
    en: "HR Report",
    kr: "인사 보고",
  }, {
    sentenceID: 17,
    vi: "Thông tin của bạn",
    en: "Your information",
    kr: "당신의 정보",
  }, {
    sentenceID: 18,
    vi: "Thông tin nhân viên",
    en: "Employee Information",
    kr: "직원 정보",
  }, {
    sentenceID: 19,
    vi: "Họ và tên",
    en: "Full Name",
    kr: "이름",
  }, {
    sentenceID: 20,
    vi: "Mã nhân sự",
    en: "HR Code",
    kr: "사원 코드",
  }, {
    sentenceID: 21,
    vi: "Mã ERP",
    en: "ERP Code",
    kr: "ERP코드",
  }, {
    sentenceID: 22,
    vi: "Ngày tháng năm sinh",
    en: "Date of Birth",
    kr: "생년월일",
  }, {
    sentenceID: 23,
    vi: "Quê quán",
    en: "HomeTown",
    kr: "고향",
  }, {
    sentenceID: 24,
    vi: "Địa chỉ",
    en: "Living Address",
    kr: "거주 주소",
  }, {
    sentenceID: 25,
    vi: "Bộ phận chính",
    en: "Main Department",
    kr: "대 부서",
  }, {
    sentenceID: 26,
    vi: "Bộ phận phụ",
    en: "Sub Department",
    kr: "소 부서",
  }, {
    sentenceID: 27,
    vi: "Vị trí làm việc",
    en: "Work Position",
    kr: "업무 위치",
  }, {
    sentenceID: 28,
    vi: "Nhóm điểm danh",
    en: "Attendant Group",
    kr: "출석 체크 그룹",
  }, {
    sentenceID: 29,
    vi: "Chức vụ",
    en: "Position",
    kr: "직무",
  }, {
    sentenceID: 30,
    vi: "Từ đầu năm đến giờ có",
    en: "This year work days",
    kr: "올해 초부터 지금까지 근무일",
  }, {
    sentenceID: 31,
    vi: "ngày",
    en: "days",
    kr: "일",
  }, {
    sentenceID: 32,
    vi: "Số ngày bạn đi làm",
    en: "Your work days",
    kr: "당신이 근무일",
  }, {
    sentenceID: 33,
    vi: "Số ngày bạn tăng ca",
    en: "Your overtime days",
    kr: "당신이 잔업일",
  }, {
    sentenceID: 34,
    vi: "Số ngày quên chấm công",
    en: "Number of days missing fingerprint check",
    kr: "지문 체크 누락 일수",
  }, {
    sentenceID: 35,
    vi: "Số ngày đăng ký nghỉ ( không tính chủ nhật và nửa phép)",
    en: "Number of registered days off (excluding Sunday and half leave)",
    kr: " 결근 신청 일수 (반차 및 일요일 미 포함)",
  }, {
    sentenceID: 36,
    vi: "Thưởng phạt",
    en: "Payoff",
    kr: "장려 - 형벌",
  }, {
    sentenceID: 37,
    vi: "Khen thưởng",
    en: "Reward",
    kr: "장려",
  }, {
    sentenceID: 38,
    vi: "Kỷ luật",
    en: "Penalty",
    kr: "형벌",
  }
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

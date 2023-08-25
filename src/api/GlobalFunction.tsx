import { useContext } from 'react';
import { ResponsiveContainer } from 'recharts';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { generalQuery, getCompany } from './Api';
import AccountInfo from '../components/Navbar/AccountInfo/AccountInfo';
import QuanLyPhongBanNhanSu from '../pages/nhansu/QuanLyPhongBanNhanSu/QuanLyPhongBanNhanSu';
import { getlang } from '../components/String/String';
import DiemDanhNhom from '../pages/nhansu/DiemDanhNhom/DiemDanhNhom';
import DieuChuyenTeam from '../pages/nhansu/DieuChuyenTeam/DieuChuyenTeam';
import TabDangKy from '../pages/nhansu/DangKy/TabDangKy';
import PheDuyetNghi from '../pages/nhansu/PheDuyetNghi/PheDuyetNghi';
import LichSu from '../pages/nhansu/LichSu/LichSu';
import QuanLyCapCao from '../pages/nhansu/QuanLyCapCao/QuanLyCapCao';
import BaoCaoNhanSu from '../pages/nhansu/BaoCaoNhanSu/BaoCaoNhanSu';
import PoManager from '../pages/kinhdoanh/pomanager/PoManager';
import InvoiceManager from '../pages/kinhdoanh/invoicemanager/InvoiceManager';
import PlanManager from '../pages/kinhdoanh/planmanager/PlanManager';
import ShortageKD from '../pages/kinhdoanh/shortageKD/ShortageKD';
import FCSTManager from '../pages/kinhdoanh/fcstmanager/FCSTManager';
import YCSXManager from '../pages/kinhdoanh/ycsxmanager/YCSXManager';
import POandStockFull from '../pages/kinhdoanh/poandstockfull/POandStockFull';
import CODE_MANAGER from '../pages/rnd/code_manager/CODE_MANAGER';
import { UserData } from '../redux/slices/globalSlice';

export  const zeroPad = (num: number, places: number) =>
String(num).padStart(places, "0");

export const SaveExcel = (data: any, title: string) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${title}.xlsx`);
}

export const readUploadFile = (e:any) => {
    e.preventDefault();
    if (e.target.files) {
        const reader = new FileReader();
        reader.onload = (e:any) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet);           
            return json;
        };
        reader.readAsArrayBuffer(e.target.files[0]);
    }
}

export function CustomResponsiveContainer(props:any) {
    return (
      <div style={{ width: '100%', height: '100%', position: 'relative', }}>
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        >
          <ResponsiveContainer {...props} />
        </div>
      </div>
    );
  }

  export function nFormatter(num: number, digits:number) {
    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "K" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "G" },
      { value: 1e12, symbol: "T" },
      { value: 1e15, symbol: "P" },
      { value: 1e18, symbol: "E" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup.slice().reverse().find(function(item) {
      return num >= item.value;
    });
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
  }

 export async function checkver() {
  let current_ver: number = 1;
  let server_ver: number = 1;
  await generalQuery("checkWebVer", {    
  })
    .then((response) => {
      console.log(response.data.tk_status);
      if (response.data.tk_status !== "NG") {
        server_ver = response.data.data[0].VERWEB;
      } else {
       
      }
    })
    .catch((error) => {
      console.log(error);
    });

    if(server_ver === current_ver)
    {
      return 1;
    }
    else
    {
      return 0;
    }

 }

 export async function checkBP(userData: UserData| undefined, permitted_main_dept: string[], permitted_position: string[], permitted_empl: string[], func:any) {
  if(userData !== undefined)
  {
    if(userData.EMPL_NO !== undefined && userData.EMPL_NO !== undefined && userData.MAINDEPTNAME !== undefined)
  {
    if(userData.EMPL_NO==='NHU1903' || userData.EMPL_NO==='NVD1201' || (getCompany()==='PVN' && (userData.EMPL_NO==='DSL1986' || userData.EMPL_NO==='NTD1983' || userData.EMPL_NO==='LTH1992'))){
      await func();
    }
    else if(permitted_main_dept.indexOf('ALL')> -1)
    {
      if(permitted_position.indexOf('ALL')>-1)
      {
        if(permitted_empl.indexOf('ALL')>-1)
        {
          await func();
        }
        else if(permitted_empl.indexOf(userData.EMPL_NO)>-1)
        {
          await func();
        }
        else
        {
          Swal.fire('Thông báo', 'Không đủ quyền hạn','warning');
        }
      }
      else if(permitted_position.indexOf(userData.POSITION_NAME===undefined? 'NA': userData.POSITION_NAME)>-1)
      {
        if(permitted_empl.indexOf('ALL')>-1)
        {
          await func();
        }
        else if(permitted_empl.indexOf(userData.EMPL_NO)>-1)
        {
          await func();
        }
        else
        {
          Swal.fire('Thông báo', 'Không đủ quyền hạn','warning');
        }        
      }
      else
      {
        Swal.fire('Thông báo', 'Chức vụ không đủ quyền hạn','warning');
      }
      
    }
    else if(permitted_main_dept.indexOf(userData.MAINDEPTNAME)> -1)
    {
      if(permitted_position.indexOf('ALL')>-1)
      {
        if(permitted_empl.indexOf('ALL')>-1)
        {
          await func();
        }
        else if(permitted_empl.indexOf(userData.EMPL_NO)>-1)
        {
          await func();
        }
        else
        {
          Swal.fire('Thông báo', 'Không đủ quyền hạn','warning');
        }
      }
      else if(permitted_position.indexOf(userData.POSITION_NAME===undefined? 'NA': userData.POSITION_NAME)>-1)
      {
        if(permitted_empl.indexOf('ALL')>-1)
        {
          await func();
        }
        else if(permitted_empl.indexOf(userData.EMPL_NO)>-1)
        {
          await func();
        }
        else
        {
          Swal.fire('Thông báo', 'Không đủ quyền hạn','warning');
        }        
      }
      else
      {
        Swal.fire('Thông báo', 'Chức vụ không đủ quyền hạn','warning');
      }
    }        
    else
    {    
      Swal.fire('Thông báo', 'Bạn không phải người bộ phận '+ permitted_main_dept,'warning');    
    }
  }

  }
  
  
 }

 export const PLAN_ID_ARRAY =['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

 export const weekdayarray =["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

/*  export function removeVietnameseTones(str: string) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
  str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
  str = str.replace(/đ/g,"d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str.replace(/ + /g," ");
  str = str.trim();
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
  return str;
} */
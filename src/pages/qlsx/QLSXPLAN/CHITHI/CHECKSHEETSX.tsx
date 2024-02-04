import moment from "moment";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { generalQuery } from "../../../../api/Api";
import { UserContext } from "../../../../api/Context";
import { RootState } from "../../../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import {
  changeDiemDanhState,
  changeUserData,
} from "../../../../redux/slices/globalSlice";
import "./CHECKSHEETSX.scss";
import Barcode from "react-barcode";
import {
  FullBOM,
  QLSXCHITHIDATA,
  QLSXPLANDATA,
  UserData,
} from "../../../../api/GlobalInterface";
const CHECKSHEETSX = ({ DATA }: { DATA: QLSXPLANDATA }) => {
  const company: string = useSelector(
    (state: RootState) => state.totalSlice.company,
  );
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData,
  );
  const [phanloai, setPhanLoai] = useState("TSP")
  const [congdoan, setCongDoan] = useState("IN")

  const checkSheetData = [    
    {
      id: 1,
      noidungquanly: 'Kiểm tra die-cut nông sâu (sản phẩm, liner)',
      phuongphapkiemtra:'Mắt, tô bút dạ lên liner', 
      producttype: ['PTT','PAPER','TSP','OLED','TAPE','LABEL','UV'],
      process: ['DIECUT']
    },
    {
      id: 2,
      noidungquanly: 'Kiểm tra die-cut bavia',
      phuongphapkiemtra:'Mắt', 
      producttype: ['PTT','PAPER','TSP','OLED','TAPE','LABEL','UV'],
      process: ['DIECUT']
    },
    {
      id: 3,
      noidungquanly: 'Kiểm tra đường die-cut',
      phuongphapkiemtra:'OHP Film, bản vẽ', 
      producttype: ['PTT','PAPER','TSP','OLED','TAPE','LABEL','UV'],
      process: ['DIECUT']
    },
    {
      id: 4,
      noidungquanly: 'Xước',
      phuongphapkiemtra:'Mắt', 
      producttype: ['PTT','PAPER','TSP','OLED','TAPE','LABEL','UV'],
      process: ['IN+DIECUT']
    },
    {
      id: 5,
      noidungquanly: 'Loang',
      phuongphapkiemtra:'Mắt', 
      producttype: ['PTT','PAPER','TSP','OLED','TAPE','UV'],
      process: ['IN+DIECUT']
    },
    {
      id: 6,
      noidungquanly: 'Hằn',
      phuongphapkiemtra:'Mắt', 
      producttype: ['PTT','PAPER','TSP','OLED','TAPE','UV'],
      process: ['IN+DIECUT']
    },
    {
      id: 7,
      noidungquanly: 'Chấm lồi lõm',
      phuongphapkiemtra:'Mắt', 
      producttype: ['PTT','PAPER','TSP','OLED','TAPE','LABEL','UV'],
      process: ['IN+DIECUT']
    },
    {
      id: 8,
      noidungquanly: 'Màu sắc sản phẩm',
      phuongphapkiemtra:'So sánh với mẫu chuẩn, máy kiểm tra màu sắc', 
      producttype: ['PTT','PAPER','TSP','OLED','TAPE','LABEL'],
      process: ['IN']
    },
    {
      id: 9,
      noidungquanly: 'Nội dung in',
      phuongphapkiemtra:'So sánh với bản vẽ', 
      producttype: ['PTT','PAPER','TSP','OLED','TAPE','LABEL'],
      process: ['IN']
    },
    {
      id: 10,
      noidungquanly: 'Kiểm tra nội dung khử keo',
      phuongphapkiemtra:'Test bằng ribbon', 
      producttype: ['PTT','PAPER','OLED'],
      process: ['IN']
    },
    {
      id: 11,
      noidungquanly: 'Kiểm tra độ bóng theo tiêu chuẩn trong bản vẽ',
      phuongphapkiemtra:'Máy test độ bóng', 
      producttype: ['PAPER'],
      process: ['IN']
    },
    {
      id: 12,
      noidungquanly: 'Kiểm tra độ cong',
      phuongphapkiemtra:'Mắt, thước (<15mm)', 
      producttype: ['PAPER'],
      process: ['IN+DIECUT']
    },
    {
      id: 13,
      noidungquanly: 'Bong mực',
      phuongphapkiemtra:'Sử dụng băng dính test bong mực', 
      producttype: ['TSP','OLED','TAPE','LABEL','UV'],
      process: ['IN']
    },
    {
      id: 14,
      noidungquanly: 'Kiểm tra phủ đúng mặt vật liệu',
      phuongphapkiemtra:'Kiểm tra bằng bút dạ (mặt không bám mực tiếp xúc liner)', 
      producttype: ['TSP'],
      process: ['DIECUT']
    },
    {
      id: 15,
      noidungquanly: 'Bụi bẩn',
      phuongphapkiemtra:'Mắt', 
      producttype: ['OLED'],
      process: ['DIECUT']
    },
    {
      id: 16,
      noidungquanly: 'Keo bề mặt',
      phuongphapkiemtra:'Mắt', 
      producttype: ['OLED'],
      process: ['DIECUT']
    },
    {
      id: 17,
      noidungquanly: 'Kiểm tra độ dày đường khử keo',
      phuongphapkiemtra:'Máy test độ dày', 
      producttype: ['OLED'],
      process: ['IN']
    },

  ]
  useEffect(() => {

  }, [DATA.PLAN_ID]);
  return (
    <div className="checksheetcomponent">
      <div className="checksheettitle">
        <span>SELF INSPECTION SHEET</span>
      </div>
      <div className="headertable">
      <table>
        <thead>
          <tr>
            <th>Ngày Sản Xuất</th>
            <th>Chỉ Thị</th>
            <th>Phân Loại</th>
            <th>Code</th>
            <th>Công Đoạn</th>
            <th>Công Nhân</th>
            <th>Leader</th>                   
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ height: "20px" }}>{DATA.PLAN_DATE}</td>
            <td>{DATA.PLAN_ID}</td>
            <td><select
                style={{width: '100%'}}
                name="phanloai"
                value={phanloai}
                onChange={(e) => {
                  setPhanLoai(e.target.value);
                }}
              >
                <option value="TSP">TSP</option>
                <option value="OLED">OLED</option>
                <option value="UV">UV</option>
                <option value="TAPE">TAPE</option>
                <option value="LABEL">LABEL</option>
                <option value="PTT">PTT</option>
                <option value="PAPER">PAPER</option>                
              </select></td>
            <td>{DATA.G_NAME_KD}</td>
            <td><select
                style={{width: '100%'}}
                name="congdoan"
                value={congdoan}
                onChange={(e) => {
                  setCongDoan(e.target.value);
                }}
              >
                <option value="IN+DIECUT">IN+DIECUT</option>
                <option value="IN">IN</option>
                <option value="DIECUT">DIECUT</option>                            
              </select></td>
            <td></td>
            <td></td>                    
          </tr>
        </tbody>
      </table>
      </div>
      <div className="contenttable">
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Nội dung quản lý</th>
            <th>Phương pháp</th>
            <th>Đầu</th>
            <th>Giữa</th>
            <th>Cuối</th>                            
          </tr>
        </thead>
        <tbody>
        {
          checkSheetData.filter((element: any, index: number)=> {
            let typearray = element.producttype.filter((type: string, index: number)=> type ===phanloai);
            let congdoanarray = element.process.filter((process: string, index: number)=> process ===congdoan);
            console.log(typearray);
            console.log(congdoanarray);
            let checkType:boolean = element.producttype.filter((type: string, index: number)=> type ===phanloai).length >0;
            let checkCongDoan: boolean = element.process.filter((process: string, index: number)=> process ===congdoan).length>0;
            return checkType && checkCongDoan;
          })
          .map((element: any, index: number)=> {
            return (
              <tr>
              <td style={{ height: "20px" }}>{index+1}</td>
              <td>{element.noidungquanly}</td>
              <td>{element.phuongphapkiemtra}</td>
              <td></td>
              <td></td>
              <td></td>                          
              </tr>
            );
          }
          )
        }          
        </tbody>
      </table>

      </div>
     
    </div>
  );
};
export default CHECKSHEETSX;

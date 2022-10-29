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
  UserData,
} from "../../../../redux/slices/globalSlice";
import "./CHITHI_COMPONENT.scss";
var Barcode = require("react-barcode");
interface YCSXTableData {
  DESCR?: string;
  PDBV_EMPL?: string;
  PDBV_DATE?: string;
  PDBV?: string;
  PROD_MAIN_MATERIAL?: string;
  PROD_TYPE?: string;
  EMPL_NO?: string;
  CUST_CD?: string;
  EMPL_NAME?: string;
  CUST_NAME_KD?: string;
  LOT_TOTAL_INPUT_QTY_EA?: number;
  LOT_TOTAL_OUTPUT_QTY_EA?: number;
  INSPECT_BALANCE?: number;
  SHORTAGE_YCSX?: number;
  YCSX_PENDING?: number;
  PHAN_LOAI?: string;
  REMARK?: string;
  PO_TDYCSX?: number;
  TOTAL_TKHO_TDYCSX?: number;
  TKHO_TDYCSX?: number;
  BTP_TDYCSX?: number;
  CK_TDYCSX?: number;
  BLOCK_TDYCSX?: number;
  FCST_TDYCSX?: number;
  W1?: number;
  W2?: number;
  W3?: number;
  W4?: number;
  W5?: number;
  W6?: number;
  W7?: number;
  W8?: number;
  PDUYET?: number;
  LOAIXH?: string;
  PLAN_ID?: string;
  PLAN_DATE?: string;
  PROD_REQUEST_NO?: string;
  PLAN_QTY: number;
  PLAN_EQ?: string;
  PLAN_FACTORY?: string;
  PLAN_LEADTIME?: number;
  INS_EMPL?: string;
  INS_DATE?: string;
  UPD_EMPL?: string;
  UPD_DATE?: string;
  G_CODE?: string;
  G_NAME?: string;
  G_NAME_KD?: string;
  PROD_REQUEST_DATE?: string;
  PROD_REQUEST_QTY?: number;
  STEP?: string;
  PLAN_ORDER?: string;
}
interface FullBOM {
  PDBV?: string;
  NO_INSPECTION?: string;
  PDUYET?: number;
  REMK: string;
  PROD_REQUEST_QTY: number;
  PROD_REQUEST_NO: string;
  PROD_REQUEST_DATE: string;
  G_CODE: string;
  DELIVERY_DT: string;
  CODE_55: string;
  CODE_50: string;
  RIV_NO: string;
  M_QTY: number;
  M_CODE: string;
  CUST_NAME: string;
  ROLE_EA_QTY: number;
  PACK_DRT: string;
  PROD_PRINT_TIMES: number;
  G_WIDTH: number;
  G_SG_R: number;
  G_SG_L: number;
  G_R: number;
  G_NAME: string;
  G_LG: number;
  G_LENGTH: number;
  G_CODE_C: string;
  G_CG: number;
  G_C: number;
  G_C_R: number;
  PD: number;
  CODE_33: string;
  M_NAME: string;
  WIDTH_CD: number;
  EMPL_NO: string;
  EMPL_NAME: string;
  CODE_03: string;
  REMARK: string;
  TONLIEU: number;
  HOLDING: number;
  TONG_TON_LIEU: number;
  PROD_DIECUT_STEP: number,  
  FACTORY: string,
  EQ1: string,
  EQ2: string, 
  Setting1: number,
  Setting2: number,
  UPH1: number,
  UPH2: number,
  Step1: number,
  Step2: number,
  LOSS_SX1: number,
  LOSS_SX2: number,
  LOSS_SETTING1 : number,
  LOSS_SETTING2 : number,
  NOTE:string
}
interface QLSXCHITHIDATA {
  id: string;
  CHITHI_ID: number;
  PLAN_ID: string;
  M_CODE: string;
  M_NAME: string;
  WIDTH_CD: number;
  M_ROLL_QTY: number;
  M_MET_QTY: number;
  M_QTY: number;
  INS_EMPL: string;
  INS_DATE: string;
  UPD_EMPL: string;
  UPD_DATE: string;
}
const CHITHI_COMPONENT = ({
  PROD_REQUEST_NO,
  PDBV,
  PLAN_ID,
  PLAN_QTY,
  PLAN_DATE,
  PLAN_EQ,
  PLAN_FACTORY,
  PLAN_LEADTIME,
  G_CODE,
  G_NAME,
  G_NAME_KD,
  STEP,
  PLAN_ORDER,
}: YCSXTableData) => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );
  const [request_codeinfo, setRequest_CodeInfo] = useState<Array<FullBOM>>([
    {
      REMK: "20220617",
      PROD_REQUEST_QTY: 18000,
      PROD_REQUEST_NO: "2FH0078",
      PROD_REQUEST_DATE: "20220617",
      G_CODE: "7A07975A",
      DELIVERY_DT: "20220620",
      CODE_55: "03",
      CODE_50: "02",
      RIV_NO: "A",
      M_QTY: 1,
      M_CODE: "A0009027",
      CUST_NAME: "",
      ROLE_EA_QTY: 2000,
      PACK_DRT: "",
      PROD_PRINT_TIMES: 1,
      G_WIDTH: 28.6,
      G_SG_R: 2,
      G_SG_L: 2,
      G_R: 0,
      G_NAME: "",
      G_LG: 3,
      G_LENGTH: 23,
      G_CODE_C: "",
      G_CG: 4,
      G_C: 1,
      G_C_R: 4,
      PD: 31.6,
      CODE_33: "02",
      M_NAME: "",
      WIDTH_CD: 110,
      EMPL_NO: "",
      EMPL_NAME: "",
      CODE_03: "01",
      REMARK: "",
      TONLIEU: 0,
      HOLDING: 0,
      TONG_TON_LIEU: 0,
      PROD_DIECUT_STEP: 0,  
      FACTORY: '',
      EQ1: '',
      EQ2: '', 
      Setting1: 0,
      Setting2: 0,
      UPH1: 0,
      UPH2: 0,
      Step1: 0,
      Step2: 0,
      LOSS_SX1: 0,
      LOSS_SX2: 0,
      LOSS_SETTING1 : 0,
      LOSS_SETTING2 : 0,
      NOTE:''
    },
  ]);
  const [chithidatatable, setChiThiDataTable] = useState<QLSXCHITHIDATA[]>([]);
  const handleGetChiThiTable = async () => {
    generalQuery("getchithidatatable", {
      PLAN_ID: PLAN_ID,
    })
      .then((response) => {
        //console.log(response.data.tk_status);
        if (response.data.tk_status !== "NG") {
          setChiThiDataTable(response.data.data);
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const max_lieu:number =  17;
  const initCTSX = async () => {
    generalQuery("ycsx_fullinfo", {
      PROD_REQUEST_NO: PROD_REQUEST_NO,
    })
      .then((response) => {
        //console.log('Data request full ycsx :');
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          setRequest_CodeInfo(response.data.data);
        } else {
          setRequest_CodeInfo([
            {
              REMK: "",
              PROD_REQUEST_QTY: 0,
              PROD_REQUEST_NO: "",
              PROD_REQUEST_DATE: "",
              G_CODE: "",
              DELIVERY_DT: "",
              CODE_55: "03",
              CODE_50: "02",
              RIV_NO: "",
              M_QTY: 1,
              M_CODE: "",
              CUST_NAME: "",
              ROLE_EA_QTY: 0,
              PACK_DRT: "",
              PROD_PRINT_TIMES: 0,
              G_WIDTH: 0,
              G_SG_R: 0,
              G_SG_L: 0,
              G_R: 0,
              G_NAME: "",
              G_LG: 0,
              G_LENGTH: 0,
              G_CODE_C: "",
              G_CG: 0,
              G_C: 0,
              G_C_R: 0,
              PD: 0,
              CODE_33: "02",
              M_NAME: "",
              WIDTH_CD: 0,
              EMPL_NO: "",
              EMPL_NAME: "",
              CODE_03: "01",
              REMARK: "",
              TONLIEU: 0,
              HOLDING: 0,
              TONG_TON_LIEU: 0,
              NO_INSPECTION: "N",
              PROD_DIECUT_STEP: 0,  
              FACTORY: '',
              EQ1: '',
              EQ2: '', 
              Setting1: 0,
              Setting2: 0,
              UPH1: 0,
              UPH2: 0,
              Step1: 0,
              Step2: 0,
              LOSS_SX1: 0,
              LOSS_SX2: 0,
              LOSS_SETTING1 : 0,
              LOSS_SETTING2 : 0,
              NOTE:''
            },
          ]);
          //Swal.fire("Thông báo","Số yêu cầu " + PROD_REQUEST_NO + "không tồn tại","error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    initCTSX();
    handleGetChiThiTable();
  }, [PLAN_ID]);
  return (
    <div className='chithicomponent'>
      {PDBV === "Y" && (
        <div className='qcpass'>
          <img
            alt='qcpass'
            src='/QC PASS20.png'
            width={440 - 100 - 10}
            height={400 - 100}
          />
        </div>
      )}
      {
        <div className='tieudeycsx'>
          <div className='leftlogobarcode'>
            <img alt='logo' src='/logocmsvina.png' width={160} height={40} />
            <Barcode
              value={PLAN_ID}
              format='CODE128'
              width={1}
              height={50}
              displayValue={false}
              background='#fff'
              lineColor='black'
              margin={0}
            />
            {PLAN_ID}
          </div>
          <div className='headertitle'>
            생산 지시서 - Chỉ thị Sản Xuất({PLAN_EQ}- B{STEP})<br></br>
            <span style={{ fontSize: 12 }}>
              Thời điểm in CTSX: {moment().format("YYYY-MM-DD HH:mm:ss")}
            </span>
            <br></br>{" "}
            {request_codeinfo[0].NO_INSPECTION === "Y" && (
              <span style={{ fontSize: 18 }}>
                (Sản phẩm không kiểm tra ngoại quan)
              </span>
            )}
          </div>
          <div className='soycsx'>
            <div className='ycsxbarcode'>
              <Barcode
                value={request_codeinfo[0]?.PROD_REQUEST_NO}
                format='CODE128'
                width={1}
                height={50}
                displayValue={false}
                background='#fff'
                lineColor='black'
                margin={0}
              />
              <div className='ycsxno'>
                {request_codeinfo[0].PROD_REQUEST_DATE}-
                {request_codeinfo[0].PROD_REQUEST_NO}{" "}
              </div>
            </div>
          </div>
        </div>
      }
      <div className='thongtinycsx'>
        <div className='text1'>
          1. 지시 정보 Thông tin chỉ thị ({request_codeinfo[0].G_NAME} )
        </div>
        <div className='thongtinyeucau'>
          <table className='ttyc1'>
            <thead>
              <tr>
                <th>Hạng mục/항목</th>
                <th>Thông tin/정보</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Người yêu cầu/요청자</td>
                <td>{request_codeinfo[0]?.EMPL_NAME}</td>
              </tr>
              <tr>
                <td>Khách hàng/고객사</td>
                <td>{request_codeinfo[0]?.CUST_NAME}</td>
              </tr>
              <tr>
                <td>Mã sản phẩm/제품코드</td>
                <td>{request_codeinfo[0]?.G_CODE}</td>
              </tr>
              <tr>
                <td>Tên sản phẩm/제품명</td>
                <td>{request_codeinfo[0]?.G_NAME}</td>
              </tr>
            </tbody>
          </table>
          <table className='ttyc2'>
            <thead>
              <tr>
                <th>Hạng mục/항목</th>
                <th>Thông tin/정보</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Số lượng yêu cầu/요청 수량</td>
                <td>
                  {request_codeinfo[0]?.PROD_REQUEST_QTY.toLocaleString(
                    "en-US"
                  )}{" "}
                  EA
                </td>
              </tr>
              <tr>
                <td>Số lượng chỉ thị/지시 수량</td>
                <td>{PLAN_QTY?.toLocaleString("en-US")} EA</td>
              </tr>
              <tr>
                <td>P/D</td>
                <td>{request_codeinfo[0]?.PD.toLocaleString("en-US")}</td>
              </tr>
              <tr>
                <td>Cavity (Hàng * Cột)</td>
                <td>
                  {request_codeinfo[0]?.G_C_R} * {request_codeinfo[0]?.G_C} ={" "}
                  {request_codeinfo[0]?.G_C_R * request_codeinfo[0]?.G_C}
                </td>
              </tr>
            </tbody>
          </table>
          <table className='ttyc2'>
            <thead>
              <tr>
                <th>Hạng mục/항목</th>
                <th>Thông tin/정보</th>
              </tr>
            </thead>
            <tbody>
            <tr>
                <td>Nhà máy/공장</td>
                <td>{PLAN_FACTORY}</td>
              </tr>
              <tr>
                <td>Máy/호기</td>
                <td>{PLAN_EQ}</td>
              </tr>
             
              <tr>
                <td>Note (KD)</td>
                <td>{request_codeinfo[0].REMK}</td>
              </tr>
              <tr>
                <td>Chú ý (QLSX)</td>
                <td>     
                  {request_codeinfo[0]?.NOTE}            
                </td>
              </tr>
            </tbody>
          </table>
        </div>       
        <div className='text1'>
          2. 생산 정보 Thông tin Sản xuất
          {' '}
          <Barcode
              value={PLAN_ID}
              format='CODE128'
              width={1.5}
              height={20}
              displayValue={false}
              background='#fff'
              lineColor='black'
              margin={0}
            />
             ({PLAN_ID})
        </div>
        <div className='thongtinyeucau'>
          <table className='ttyc1'>
            <thead>
              <tr>
                <th>Hạng mục/항목</th>
                <th>Thông tin/정보</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>UPH1 (EA/h) - {request_codeinfo[0]?.EQ1}</td>
                <td>{(request_codeinfo[0]?.UPH1 !== null )? request_codeinfo[0]?.UPH1.toLocaleString("en-US"):''}</td>
              </tr>
              <tr>
                <td>UPH2 (EA/h) - {request_codeinfo[0]?.EQ2}</td>
                <td>{(request_codeinfo[0]?.UPH2 !== null )? request_codeinfo[0]?.UPH2.toLocaleString("en-US"):''}</td>
              </tr>
              <tr>
                <td>Thời gian setting 1 - {request_codeinfo[0]?.EQ1}</td>
                <td>{(request_codeinfo[0]?.Setting1 !== null )? request_codeinfo[0]?.Setting1:''}</td>
              </tr>
              <tr>
                <td>Thời gian setting 2 - {request_codeinfo[0]?.EQ2}</td>
                <td>{request_codeinfo[0]?.Setting2}</td>
              </tr>
            </tbody>
          </table>
          <table className='ttyc2'>
            <thead>
              <tr>
                <th>Hạng mục/항목</th>
                <th>Thông tin/정보</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>LOSS SX ĐỊNH MỨC 1- {request_codeinfo[0]?.EQ1}</td>
                <td>
                  {request_codeinfo[0]?.LOSS_SX1}{" "}
                  %
                </td>
              </tr>
              <tr>
                <td>LOSS SX ĐỊNH MỨC 2- {request_codeinfo[0]?.EQ2}</td>
                <td>{request_codeinfo[0]?.LOSS_SX2}%</td>
              </tr>
              <tr>
                <td>LOSS SETTING ĐỊNH MỨC 1- {request_codeinfo[0]?.EQ1}</td>
                <td>{(request_codeinfo[0]?.LOSS_SETTING1 !== null )? request_codeinfo[0]?.LOSS_SETTING1.toLocaleString("en-US"):''} met</td>
              </tr>
              <tr>               
                <td>LOSS SETTING ĐỊNH MỨC 2- {request_codeinfo[0]?.EQ2}</td>
                <td>{(request_codeinfo[0]?.LOSS_SETTING2 !== null )? request_codeinfo[0]?.LOSS_SETTING2.toLocaleString("en-US"): ''} met</td>                
              </tr>
            </tbody>
          </table>         
        </div>       
        <div className='text1'>3. 제품 정보 Thông tin vật liệu</div>
        <div className='thongtinvatlieu'>
          {chithidatatable.length <= max_lieu && (
            <div className='vatlieugiua'>
              <table>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Mã Liệu/원단코드</th>
                    <th>Tên Liệu/원단명</th>
                    <th>Size Liệu/원단폭</th>
                    <th>SL chỉ thị/지시 수량</th>
                    <th>Thực xuất M/실제 출고 M</th>
                    <th>Thực xuất Roll/실제 출고 Roll</th>                    
                    <th>Ghi chú/비고</th>
                  </tr>
                </thead>
                <tbody>
                  {chithidatatable.map((element, index) => (
                    <tr key={index}>
                      <td>{index}</td>
                      <td>{element.M_CODE}</td>
                      <td>{element.M_NAME}</td>
                      <td>{element.WIDTH_CD}</td>
                      <td>{(element.M_MET_QTY * element.M_QTY).toLocaleString("en-US")} M</td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {chithidatatable.length > max_lieu && (
            <div className='vatlieutrai'>
              <table>
                <thead>
                  <tr>
                  <th>No</th>
                    <th>Mã Liệu/원단코드</th>
                    <th>Tên Liệu/원단명</th>
                    <th>Size Liệu/원단폭</th>
                    <th>SL chỉ thị/지시 수량</th>
                    <th>Thực xuất M/실제 출고 M</th>
                    <th>Thực xuất Roll/실제 출고 Roll</th>                    
                    <th>Ghi chú/비고</th>
                  </tr>
                </thead>
                <tbody>
                  {chithidatatable.map(
                    (element, index) =>
                      index <= max_lieu && (
                        <tr key={index}>
                         <td>{index}</td>
                        <td>{element.M_CODE}</td>
                        <td>{element.M_NAME}</td>
                        <td>{element.WIDTH_CD}</td>
                        <td>{(element.M_MET_QTY * element.M_QTY).toLocaleString("en-US")} M</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        </tr>
                      )
                  )}
                </tbody>
              </table>
            </div>
          )}
          {chithidatatable.length > max_lieu && (
            <div className='vatlieuphai'>
              <table>
                <thead>
                  <tr>
                  <th>No</th>
                    <th>Mã Liệu/원단코드</th>
                    <th>Tên Liệu/원단명</th>
                    <th>Size Liệu/원단폭</th>
                    <th>SL chỉ thị/지시 수량</th>
                    <th>Thực xuất M/실제 출고 M</th>
                    <th>Thực xuất Roll/실제 출고 Roll</th>                    
                    <th>Ghi chú/비고</th>
                  </tr>
                </thead>
                <tbody>
                  {chithidatatable.map(
                    (element, index) =>
                      index > max_lieu && (
                        <tr key={index}>
                         <td>{index}</td>
                        <td>{element.M_CODE}</td>
                        <td>{element.M_NAME}</td>
                        <td>{element.WIDTH_CD}</td>
                        <td>{(element.M_MET_QTY * element.M_QTY).toLocaleString("en-US")} M</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        </tr>
                      )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default CHITHI_COMPONENT;

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
import "./YCKT.scss";
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
  STEP?: number;
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
  INS_EMPL: string;
  INS_DATE: string;
  UPD_EMPL: string;
  UPD_DATE: string;
}
const YCKT = ({
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
  const max_lieu:number =  23;
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
            검사 요청서 - Yêu cầu kiểm tra({PLAN_EQ}- B{STEP})<br></br>
            <span style={{ fontSize: 12 }}>
              Thời điểm in YCKT: {moment().format("YYYY-MM-DD HH:mm:ss")}
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
          1. 지시 정보 Thông tin yêu cầu({request_codeinfo[0].G_NAME} )
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
                </td>
              </tr>
            </tbody>
          </table>
        </div>       
        <div className='text1'>2. 입고 정보 Thông tin nhập hàng</div>
        <div className='thongtinvatlieu'>         
            <div className='vatlieugiua'>
              <table>
                <thead>
                  <tr>
                    <th>Ngày giờ nhập/입고일시</th>
                    <th>Người giao/인수자명</th>
                    <th>Dán label/라벨 부착</th>
                    <th>Chiều cuốn/ 권취방향 확인</th>
                    <th>Số lượng cân /무게</th>
                    <th>Số lượng/수량 EA</th>
                    <th>Người xác nhận/확인자</th>
                  </tr>
                </thead>
                <tbody>     
                  {[1,2,3,4,5,6,7,8,9,10].map((element, index) => (
                    <tr key={index}>
                      <td style={{height:30}}></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>                 
        </div>
      </div>
    </div>
  );
};
export default YCKT;

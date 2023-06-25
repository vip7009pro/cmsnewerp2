import moment from "moment";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { generalQuery } from "../../../../api/Api";
import { UserContext } from "../../../../api/Context";

import "./YCSXComponent.scss";
import { UserData } from "../../../../redux/slices/globalSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";

/* import Barcode from 'react-barcode'; */
import Barcode from 'react-barcode'
interface POBALANCETDYCSX{ G_CODE: string; PO_BALANCE: number }
interface TONKHOTDYCSX {
  G_CODE: string;
  CHO_KIEM: number;
  CHO_CS_CHECK: number;
  CHO_KIEM_RMA: number;
  TONG_TON_KIEM: number;
  BTP: number;
  TON_TP: number;
  BLOCK_QTY: number;
  GRAND_TOTAL_STOCK: number;
}

interface YCSXTableData {
    DESCR?: string,
    PDBV_EMPL?: string,
    PDBV_DATE?: string,
    PDBV?: string,
    PROD_MAIN_MATERIAL?: string,
    PROD_TYPE?: string,
    EMPL_NO?: string,
    CUST_CD?: string,
    G_CODE?: string,
    G_NAME?: string,
    EMPL_NAME?: string,
    CUST_NAME_KD?: string,
    PROD_REQUEST_NO?: string,
    PROD_REQUEST_DATE?: string,
    PROD_REQUEST_QTY?: number,
    LOT_TOTAL_INPUT_QTY_EA?: number,
    LOT_TOTAL_OUTPUT_QTY_EA?: number,
    INSPECT_BALANCE?: number,
    SHORTAGE_YCSX?: number,
    YCSX_PENDING?: number,
    PHAN_LOAI?: string,
    REMARK?: string,
    PO_TDYCSX?: number,
    TOTAL_TKHO_TDYCSX?: number,
    TKHO_TDYCSX?: number,
    BTP_TDYCSX?: number,
    CK_TDYCSX?: number,
    BLOCK_TDYCSX?: number,
    FCST_TDYCSX?: number,
    W1?: number,
    W2?: number,
    W3?: number,
    W4?: number,
    W5?: number,
    W6?: number,
    W7?: number,
    W8?: number,
    PDUYET?: number,  
    LOAIXH?: string
  }

interface YCSX {
    PROD_REQUEST_NO: string,
    G_CODE: string
}
interface TONVL {
    M_CODE: string,
    M_NAME: string,
    WIDTH_CD: number,
    TON_DAU: number,
    INPUT: number,
    OUTPUT: number,
    RETURN_IN: number,
    HOLDING: number,
    GRAND_TOTAL: number,
}

interface FullBOM {
    PDBV?: string,
    NO_INSPECTION?: string,
    PDUYET?: number,
    REMK: string,
    PROD_REQUEST_QTY: number,
    PROD_REQUEST_NO: string,
    PROD_REQUEST_DATE: string,
    G_CODE: string,
    DELIVERY_DT: string,
    CODE_55: string,
    CODE_50: string,
    RIV_NO: string,
    M_QTY: number,
    M_CODE: string,
    CUST_NAME: string,
    ROLE_EA_QTY: number,
    PACK_DRT: string,
    PROD_PRINT_TIMES: number,
    G_WIDTH: number,
    G_SG_R: number,
    G_SG_L: number,
    G_R: number,
    G_NAME: string,
    G_LG: number,
    G_LENGTH: number,
    G_CODE_C: string,
    G_CG: number,
    G_C: number,
    G_C_R: number,
    PD: number,
    CODE_33: string,
    M_NAME: string,
    WIDTH_CD: number,
    EMPL_NO: string,
    EMPL_NAME: string,
    CODE_03: string,
    REMARK: string,
    TONLIEU: number,
    HOLDING: number,
    TONG_TON_LIEU: number,
    PO_TYPE?: string,
    FSC: string,
    PROD_MAIN_MATERIAL?: string,
    LIEUQL_SX?: number,
}
const YCSXComponent = ({G_CODE,PROD_TYPE,PROD_MAIN_MATERIAL,G_NAME,EMPL_NAME,EMPL_NO,CUST_NAME_KD,CUST_CD,PROD_REQUEST_NO,PROD_REQUEST_DATE,PROD_REQUEST_QTY,LOT_TOTAL_INPUT_QTY_EA,LOT_TOTAL_OUTPUT_QTY_EA,INSPECT_BALANCE,SHORTAGE_YCSX,YCSX_PENDING,PHAN_LOAI,REMARK,PO_TDYCSX,TOTAL_TKHO_TDYCSX,TKHO_TDYCSX,BTP_TDYCSX,CK_TDYCSX,BLOCK_TDYCSX,FCST_TDYCSX,W1,W2,W3,W4,W5,W6,W7,W8,PDUYET,LOAIXH, PDBV, PDBV_EMPL, PDBV_DATE, DESCR}:YCSXTableData) => {
    const userData: UserData | undefined = useSelector(
      (state: RootState) => state.totalSlice.userData
    );
    const [tvl_tdycsx,setTVL_TDYCSX] = useState<Array<TONVL>>([{
        M_CODE: 'string',
        M_NAME: 'string',
        WIDTH_CD: 0,
        TON_DAU: 0,
        INPUT: 0,
        OUTPUT: 0,
        RETURN_IN: 0,
        HOLDING: 0,
        GRAND_TOTAL: 0,
    }])
    const [tk_tdycsx,setTK_TDYCSX] = useState<TONKHOTDYCSX>({
        G_CODE: "",
        CHO_KIEM: 0,
        CHO_CS_CHECK: 0,
        CHO_KIEM_RMA: 0,
        TONG_TON_KIEM: 0,
        BTP: 0,
        TON_TP: 0,
        BLOCK_QTY: 0,
        GRAND_TOTAL_STOCK: 0,
    });
    const [pobalance_tdycsx,setPOBalanceTdycsx] = useState<POBALANCETDYCSX>({
        G_CODE: "",
        PO_BALANCE: 0,
    })
    const [request_codeinfo,setRequest_CodeInfo] = useState<Array<FullBOM>>([{
        REMK: '20220617',
        PROD_REQUEST_QTY: 18000,
        PROD_REQUEST_NO: '2FH0078',
        PROD_REQUEST_DATE: '20220617',
        G_CODE: '7A07975A',
        DELIVERY_DT: '20220620',
        CODE_55: '03',
        CODE_50: '02',
        RIV_NO: 'A',
        M_QTY: 1,
        M_CODE: 'A0009027',
        CUST_NAME: '',
        ROLE_EA_QTY: 2000,
        PACK_DRT: '',
        PROD_PRINT_TIMES: 1,
        G_WIDTH: 28.6,
        G_SG_R: 2,
        G_SG_L: 2,
        G_R: 0,
        G_NAME: '',
        G_LG: 3,
        G_LENGTH: 23,
        G_CODE_C: '',
        G_CG: 4,
        G_C: 1,
        G_C_R: 4,
        PD: 31.6,
        CODE_33: '02',
        M_NAME: '',
        WIDTH_CD: 110,
        EMPL_NO: '',
        EMPL_NAME: '',
        CODE_03: '01',
        REMARK: '',
        TONLIEU:0,
        HOLDING: 0,
        TONG_TON_LIEU:0,
        PO_TYPE:'E1',
        PROD_MAIN_MATERIAL:'',
        LIEUQL_SX: 0,        
        FSC: 'N'
    }]);   

    const [checklieuchinh,setCheckLieuChinh] = useState(false);

    const initYCSX = async() => {
        let inventorydate:string= '202207';
        await generalQuery("check_inventorydate", { 
            G_CODE: G_CODE
          })
        .then((response) => {
          if (response.data.tk_status !== "NG") {                   
            inventorydate = (response.data.data[0].INVENTORY_DATE);
          } else { 
          }        
        })
        .catch((error) => {
          console.log(error);
        });

          generalQuery("ycsx_fullinfo", {
        PROD_REQUEST_NO: PROD_REQUEST_NO,  
        TRADATE: moment(inventorydate).format("YYYY-MM-DD 08:00:00"),
        INVENTORY: inventorydate
        })
        .then((response) => {
          //console.log('Data request full ycsx :');
            //console.log(response.data.data);
            if (response.data.tk_status !== "NG") {
              for(let i=0;i<response.data.data.length ;i++)
              {
                if(response.data.data[i].PROD_MAIN_MATERIAL === response.data.data[i].M_NAME && response.data.data[i].LIEUQL_SX===1)
                {
                  setCheckLieuChinh(true);
                }
              }
            setRequest_CodeInfo(response.data.data);  


            } else {   
              setRequest_CodeInfo([{
                REMK: '',
                PROD_REQUEST_QTY: 0,
                PROD_REQUEST_NO: '',
                PROD_REQUEST_DATE: '',
                G_CODE: '',
                DELIVERY_DT: '',
                CODE_55: '03',
                CODE_50: '02',
                RIV_NO: '',
                M_QTY: 1,
                M_CODE: '',
                CUST_NAME: '',
                ROLE_EA_QTY: 0,
                PACK_DRT: '',
                PROD_PRINT_TIMES: 0,
                G_WIDTH: 0,
                G_SG_R: 0,
                G_SG_L: 0,
                G_R: 0,
                G_NAME: '',
                G_LG: 0,
                G_LENGTH: 0,
                G_CODE_C: '',
                G_CG: 0,
                G_C: 0,
                G_C_R: 0,
                PD: 0,
                CODE_33: '02',
                M_NAME: '',
                WIDTH_CD: 0,
                EMPL_NO: '',
                EMPL_NAME: '',
                CODE_03: '01',
                REMARK: '',
                TONLIEU:0,
                HOLDING:0,
                TONG_TON_LIEU: 0,
                NO_INSPECTION:'N',
                PROD_MAIN_MATERIAL:'',
                LIEUQL_SX: 0,
                FSC:'N'
            }])  
            //Swal.fire("Thông báo","Số yêu cầu " + PROD_REQUEST_NO + "không tồn tại","error");                
            }
        })
        .catch((error) => {
            console.log(error);
        });

             generalQuery("checkpobalance_tdycsx", { 
            G_CODE: G_CODE
          })
            .then((response) => {
              if (response.data.tk_status !== "NG") {                   
                setPOBalanceTdycsx(response.data.data[0]);
              } else { 
              }        
            })
            .catch((error) => {
              console.log(error);
            });
        generalQuery("checktonkho_tdycsx", { 
          G_CODE:G_CODE
        })
          .then((response) => {                  
            if (response.data.tk_status !== "NG") {                   
              setTK_TDYCSX(response.data.data[0]);
            } else { 
            }        
          })
          .catch((error) => {
            console.log(error);
          });

    }
    useEffect(()=> {
            initYCSX();  
    },[PROD_REQUEST_NO]);

    console.log(PDBV_EMPL);
    console.log(PDBV);

  return (
    <div className='ycsxcomponent'>
      {(PDBV==='Y' && checklieuchinh ===true) &&  <div className="qcpass">
        <img alt="qcpass" src="/QC PASS20.png" width={440-100-10} height={400-100}/>
      </div>  }  
      {(request_codeinfo[0]?.FSC ==='Y') && <div className="fsc">
        <img alt="qcpass" src="/fsc logo2.png" width={440-100-10} height={400-100}/>
      </div>}  
     { request_codeinfo[0].PDUYET &&  <div className='tieudeycsx'>
     <img alt="logo" src="/logocmsvina.png" width={160} height={40}/>
        <div className='title'> 생산요청서 - Yêu cầu sản xuất<br></br><span style={{fontSize:12}}>Thời điểm in YCSX: {moment().format("YYYY-MM-DD HH:mm:ss")}</span><br></br> {(request_codeinfo[0].NO_INSPECTION ==='Y') && <span style={{fontSize:12}}>(Sản phẩm không kiểm tra ngoại quan)</span>}</div>
        <div className='soycsx'>
          <div className='ycsxno'>{request_codeinfo[0].PROD_REQUEST_DATE}-{request_codeinfo[0].PROD_REQUEST_NO} </div>
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
          </div>
          
        </div>
      </div>}
      {request_codeinfo[0].PDUYET && <div className='thongtinycsx'>
        <div className='text1'>1. 정보 Thông tin({request_codeinfo[0].G_NAME} ) _ PO_TYPE: ({request_codeinfo[0]?.PO_TYPE} ) </div>
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
                <td>Số lượng yêu cầu/요청수량</td>
                <td>{request_codeinfo[0]?.PROD_REQUEST_QTY.toLocaleString("en-US")} EA</td>
              </tr>
              <tr>
                <td>Số lượng tồn/재고수량</td>
                <td>{(tk_tdycsx?.CHO_KIEM+tk_tdycsx?.CHO_KIEM_RMA+tk_tdycsx?.CHO_KIEM_RMA + tk_tdycsx?.TON_TP + tk_tdycsx?.BTP - tk_tdycsx?.BLOCK_QTY).toLocaleString("en-US")} EA</td>
              </tr>
              <tr>
                <td>Số lượng giao/납품수량</td>
                <td>{request_codeinfo[0]?.PROD_REQUEST_QTY.toLocaleString("en-US")}</td>
              </tr>
              <tr>
                <td>Ngày giao/납품예정일</td>
                <td>{moment(request_codeinfo[0]?.DELIVERY_DT).format("YYYY-MM-DD")}</td>
              </tr>
            </tbody>
          </table>
          <table className='ttyc3'>
            <thead>
            <tr>
              <th>Hạng mục/항목</th>
              <th>Thông tin/정보</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Phân loại sản xuất/생산구분</td>
                <td>{request_codeinfo[0]?.CODE_55 ==='01'? 'Thông thường': request_codeinfo[0]?.CODE_55 ==='02' ? 'SDI' :request_codeinfo[0]?.CODE_55 ==='03' ? 'ETC' : request_codeinfo[0]?.CODE_55 ==='04' ? 'SAMPLE': ''}</td>
              </tr>
              <tr>
                <td>Phân loại giao hàng/납품구분</td>
                <td>{request_codeinfo[0]?.CODE_50 ==='01'? 'GC': request_codeinfo[0]?.CODE_50 ==='02' ? 'SK' :request_codeinfo[0]?.CODE_50 ==='03' ? 'KD' : request_codeinfo[0]?.CODE_50 ==='04' ? 'VN': request_codeinfo[0]?.CODE_50 ==='05' ? 'SAMPLE' : request_codeinfo[0]?.CODE_50 ==='06' ? 'Vai bac 4' : 'ETC'}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className='text1'>2. 제품 정보 Thông tin sản phẩm  _{request_codeinfo[0]?.FSC ==='Y' ? '(FSC Mix Credit)':''} <span className="approval_info">(Specification: {DESCR}) </span></div>
        <div className='thongtinsanpham'>
          <div className='ttsp'>
            <table>
              <thead>
              <tr>
              <th>Hạng mục/항목</th>
              <th>Thông tin/정보</th>
              </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Dài SP</td>
                  <td>{request_codeinfo[0]?.G_LENGTH} mm</td>
                </tr>
                <tr>
                  <td>Rộng SP</td>
                  <td>{request_codeinfo[0]?.G_WIDTH} mm</td>
                </tr>
                <tr>
                  <td>P/D</td>
                  <td>{request_codeinfo[0]?.PD} mm</td>
                </tr>
                <tr>
                  <td>Số hàng SP</td>
                  <td>{request_codeinfo[0]?.G_C_R} EA</td>
                </tr>
              </tbody>
            </table>
            <table>
              <thead>
              <tr>
              <th>Hạng mục/항목</th>
              <th>Thông tin/정보</th>
              </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Type</td>
                  <td>{request_codeinfo[0]?.CODE_33 === '01'? 'EA' : request_codeinfo[0]?.CODE_33 === '02' ? 'ROLL' : request_codeinfo[0]?.CODE_33 === '03' ? 'SHEET' :request_codeinfo[0]?.CODE_33 === '04'? 'MET' : request_codeinfo[0]?.CODE_33 === '06' ? 'PACK (BAG)' : request_codeinfo[0]?.CODE_33 === '99' ? 'X' : ''}</td>
                </tr>
                <tr>
                  <td>SL Packing</td>
                  <td>{request_codeinfo[0]?.ROLE_EA_QTY.toLocaleString("en-US")} EA</td>
                </tr>
                <tr>
                  <td>Số lần in</td>
                  <td>{request_codeinfo[0]?.PROD_PRINT_TIMES}</td>
                </tr>
                <tr>
                  <td>Số cột SP</td>
                  <td>{request_codeinfo[0]?.G_C}EA</td>
                </tr>
              </tbody>
            </table>
            <table>
              <thead>
              <tr>
              <th>Hạng mục/항목</th>
              <th>Thông tin/정보</th>
              </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Khoảng cách hàng</td>
                  <td>{request_codeinfo[0]?.G_LG} mm</td>
                </tr>
                <tr>
                  <td>Khoảng cách cột</td>
                  <td>{request_codeinfo[0]?.G_CG} mm</td>
                </tr>
                <tr>
                  <td>K/C liner trái</td>
                  <td>{request_codeinfo[0]?.G_SG_L} mm</td>
                </tr>
                <tr>
                  <td>K/C liner phải</td>
                  <td>{request_codeinfo[0]?.G_SG_R} mm</td>
                </tr>
              </tbody>
            </table>
            <table>
              <thead>
              <tr>
              <th>Hạng mục/항목</th>
              <th>Thông tin/정보</th>
              </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Ghi chú</td>
                  <td>{request_codeinfo[0]?.REMK}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className='title'>Tồn các loại tại thời điểm IN YCSX<span className="approval_info"> &nbsp;&nbsp;&nbsp; TK IN: {userData?.EMPL_NO}</span>  {(PDBV==='Y') && <span className="approval_info"> | (TTPD_YCSX_BV: {PDBV_EMPL} | {moment.utc( PDBV_DATE).format("YYYY-MM-DD HH:mm:ss")})</span>}</div>
          <div className='toncacloai'>
            <table>
              <thead>
                <tr>
                <th>Thành phẩm/완제품</th>
                <th>Bán thành phẩm/반제품</th>
                <th>Chờ kiểm/검사대기</th>
                <th>Chờ CS check/CS확인대기</th>
                <th>Chờ Sorting RMA/RMA선별대기</th>
                <th>Tổng chờ kiểm/총 검사대기</th>
                <th>Block/블록</th>
                <th>Grand Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{tk_tdycsx?.TON_TP.toLocaleString("en-US")}</td>
                  <td>{tk_tdycsx?.BTP.toLocaleString("en-US")}</td>
                  <td>{tk_tdycsx?.CHO_KIEM.toLocaleString("en-US")}</td>
                  <td>{tk_tdycsx?.CHO_CS_CHECK.toLocaleString("en-US")}</td>
                  <td>{tk_tdycsx?.CHO_KIEM_RMA.toLocaleString("en-US")}</td>
                  <td>{(tk_tdycsx?.CHO_KIEM+tk_tdycsx?.CHO_KIEM_RMA+tk_tdycsx?.CHO_KIEM_RMA).toLocaleString("en-US")}</td>
                  <td>{tk_tdycsx?.BLOCK_QTY.toLocaleString("en-US")}</td>
                  <td>
                    <b>{(tk_tdycsx?.CHO_KIEM+tk_tdycsx?.CHO_KIEM_RMA+tk_tdycsx?.CHO_KIEM_RMA + tk_tdycsx?.TON_TP + tk_tdycsx?.BTP - tk_tdycsx?.BLOCK_QTY).toLocaleString("en-US")}</b>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className='text1'>3.금형 필름 정보 Thông tin dao film</div>
        <div className='thongtindaofilm'>
          <table>
            <thead>
                <tr>
              <th className='hangmuc'>Hạng mục/항목</th>
              <th>Thông tin/정보</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className='hangmuc'>Mã Dao</td>
                <td></td>
              </tr>
              <tr>
                <td className='hangmuc'>Mã Film</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className='text1'>4. 제품 정보 Thông tin vật liệu | Liệu chính {request_codeinfo[0].PROD_MAIN_MATERIAL} | {checklieuchinh ===true? 'Đã SET':'Chưa SET'} </div>
        <div className='thongtinvatlieu'>
          {(request_codeinfo.length <= 12) && <div className='vatlieugiua'>
            <table>
              <thead>
                <tr>
                <th>No</th>
                <th>Mã Liệu/원단코드</th>
                <th>Tên Liệu/원단명</th>
                <th>Size Liệu/원단폭</th>
                <th>Tồn liệu/원단재고</th>
                <th>Tồn block/블록재고</th>
                <th>Tổng tồn liệu/총 재고</th>
                <th>Ghi chú/비고</th>
                </tr>
                
              </thead>
              <tbody>
                {
                    request_codeinfo.map((element, index)=>  
                    <tr key={index}>
                        <td>{index}</td>
                        <td>{element.M_CODE}</td>
                        <td>{element.M_NAME}</td>
                        <td>{element.WIDTH_CD}</td>
                        <td>{element.TONLIEU.toLocaleString("en-US")} M</td>
                        <td>{element.HOLDING.toLocaleString("en-US")} M</td>
                        <td>{element.TONG_TON_LIEU.toLocaleString("en-US")} M</td>
                        <td>{element.REMARK}</td>
                    </tr>)
                }          
              </tbody>
            </table>
          </div>}
          {(request_codeinfo.length > 12) && (
            <div className='vatlieutrai'>
              <table>
                <thead>
                <tr>
                <th>No</th>
                <th>Mã Liệu/원단코드</th>
                <th>Tên Liệu/원단명</th>
                <th>Size Liệu/원단폭</th>
                <th>Tồn liệu/원단재고</th>
                <th>Tồn block/블록재고</th>
                <th>Tổng tồn liệu/총 재고</th>
                <th>Ghi chú/비고</th>
                </tr>
                </thead>
                <tbody>   
                {
                    request_codeinfo.map((element, index)=>  
                    (index<=12) && <tr key={index}>
                        <td>{index}</td>
                        <td>{element.M_CODE}</td>
                        <td>{element.M_NAME}</td>
                        <td>{element.WIDTH_CD}</td>
                        <td>{element.TONLIEU.toLocaleString("en-US")} M</td>
                        <td>{element.HOLDING.toLocaleString("en-US")} M</td>
                        <td>{element.TONG_TON_LIEU.toLocaleString("en-US")} M</td>
                        <td>{element.REMARK}</td>
                    </tr>)
                } 
                </tbody>
              </table>
            </div>
          )}
          {(request_codeinfo.length > 12) && (
            <div className='vatlieuphai'>
              <table>
                <thead>
                <tr>
                <th>No</th>
                <th>Mã Liệu/원단코드</th>
                <th>Tên Liệu/원단명</th>
                <th>Size Liệu/원단폭</th>
                <th>Tồn liệu/원단재고</th>
                <th>Tồn block/블록재고</th>
                <th>Tổng tồn liệu/총 재고</th>
                <th>Ghi chú/비고</th>
                </tr>
                </thead>
                <tbody>  
                {
                    request_codeinfo.map((element, index)=>  
                    (index>12) && <tr key={index}>
                        <td>{index}</td>
                        <td>{element.M_CODE}</td>
                        <td>{element.M_NAME}</td>
                        <td>{element.WIDTH_CD}</td>
                        <td>{element.TONLIEU.toLocaleString("en-US")} M</td>
                        <td>{element.HOLDING.toLocaleString("en-US")} M</td>
                        <td>{element.TONG_TON_LIEU.toLocaleString("en-US")} M</td>
                        <td>{element.REMARK}</td>
                    </tr>)
                } 
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>}
    </div>
  );
};
export default YCSXComponent;

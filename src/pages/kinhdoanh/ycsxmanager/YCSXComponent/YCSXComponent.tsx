import moment from "moment";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { generalQuery } from "../../../../api/Api";
import "./YCSXComponent.scss";
var Barcode = require("react-barcode");

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
}
const YCSXComponent = ({PROD_REQUEST_NO, G_CODE}:YCSX) => {
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
        CUST_NAME: 'Samsung Electronics Viet nam',
        ROLE_EA_QTY: 2000,
        PACK_DRT: '',
        PROD_PRINT_TIMES: 1,
        G_WIDTH: 28.6,
        G_SG_R: 2,
        G_SG_L: 2,
        G_R: 0,
        G_NAME: 'GH68-54791A_A_SM-R920NZTAXAA',
        G_LG: 3,
        G_LENGTH: 23,
        G_CODE_C: 'GH68-54791A_A_SM-R920NZTAXAA',
        G_CG: 4,
        G_C: 1,
        G_C_R: 4,
        PD: 31.6,
        CODE_33: '02',
        M_NAME: 'CK-ART80',
        WIDTH_CD: 110,
        EMPL_NO: 'NTT2003',
        EMPL_NAME: 'NGUYEN THI THAO',
        CODE_03: '01',
        REMARK: '',
    }]);
    console.log(request_codeinfo[0]);
    useEffect(()=> {
            generalQuery("ycsx_fullinfo", {
            PROD_REQUEST_NO: PROD_REQUEST_NO
            })
            .then((response) => {
                console.log(response.data.tk_status);
                if (response.data.tk_status !== "NG") {
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


    },[PROD_REQUEST_NO]);


  return (
    <div className='ycsxcomponent'>         
      <div className='tieudeycsx'>
        <div className='title'>CMSV 생산요청서 - Yêu cầu sản xuất</div>
        <div className='soycsx'>
          <div className='ycsxno'>{request_codeinfo[0].PROD_REQUEST_DATE}-{request_codeinfo[0].PROD_REQUEST_NO}</div>
          <div className='ycsxbarcode'>
            <Barcode
              value={request_codeinfo[0]?.PROD_REQUEST_NO}
              format='CODE128'
              width={2}
              height={50}
              displayValue={false}
              background='#fff'
              lineColor='black'
              margin={0}
            />
          </div>
        </div>
      </div>
      <div className='thongtinycsx'>
        <div className='text1'>1. 요청 정보 Thông tin yêu cầu</div>
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
                <td>20,000 EA</td>
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
        <div className='text1'>2. 제품 정보 Thông tin sản phẩm</div>
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
          <div className='title'>Tồn các loại tại thời điểm IN YCSX </div>
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
                <td>123456789</td>
              </tr>
              <tr>
                <td className='hangmuc'>Mã Film</td>
                <td>abcdefgh</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className='text1'>4. 제품 정보 Thông tin vật liệu</div>
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
                    {
                        let total_tonlieu: number =10000;
                        let block: number =10000;
                       
                        (async () => {  
                            await generalQuery("tonlieugcode", {
                                M_CODE: element.M_CODE,
                                inventory: moment().format("YYYYMM"),
                                tradate: moment().format("YYYY-MM-01 08:00:00")                               
                              })
                            .then((response) => {
                                console.log(response.data.tk_status);
                                if (response.data.tk_status !== "NG") {
                                    total_tonlieu = response.data.data[0].GRAND_TOTAL;
                                    block = response.data.data[0].HOLDING;                                    
                                //Swal.fire("Thông báo", "Update Po thành công", "success");  
                                } else {     
                                // Swal.fire("Thông báo", "Update PO thất bại: " +response.data.message , "error"); 
                                }
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                        })()
                        return (
                            <tr key={index}>
                            <td>{index}</td>
                            <td>{element.M_CODE}</td>
                            <td>{element.M_NAME}</td>
                            <td>{element.WIDTH_CD}</td>
                            <td>{(total_tonlieu - block).toLocaleString("en-US")} M</td>
                            <td>{block.toLocaleString("en-US")} M</td>
                            <td>{total_tonlieu.toLocaleString("en-US")} M</td>
                            <td>{element.REMARK}</td>
                            </tr>
                        )  
                    }
                    )
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
                        request_codeinfo.map((element, index)=> (index<=12) && 
                        <tr key={index}>
                            <td>{index}</td>
                            <td>{element.M_CODE}</td>
                            <td>{element.M_NAME}</td>
                            <td>{element.WIDTH_CD}</td>
                            <td>1,500M</td>
                            <td>500M</td>
                            <td>1,000M</td>
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
                        request_codeinfo.map((element, index)=> (index>12) && 
                        <tr key={index}>
                            <td>{index}</td>
                            <td>{element.M_CODE}</td>
                            <td>{element.M_NAME}</td>
                            <td>{element.WIDTH_CD}</td>
                            <td>1,500M</td>
                            <td>500M</td>
                            <td>1,000M</td>
                            <td>{element.REMARK}</td>
                        </tr>)
                    }       
                   
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default YCSXComponent;
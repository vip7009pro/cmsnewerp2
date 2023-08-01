import React from 'react'
import "./QuotationForm.scss"
import { RootState } from "../../../../redux/store";
import { useSelector, useDispatch } from "react-redux";

interface BANGGIA_DATA2 {
    id: number,
    CUST_NAME_KD?: string,
    CUST_CD?: string,
    G_CODE?: string,
    G_NAME?: string,
    G_NAME_KD?: string,
    PROD_MAIN_MATERIAL?: string,
    PRICE_DATE: string,
    MOQ: number,
    PROD_PRICE: number,
    INS_DATE: string,
    INS_EMPL: string,
    UPD_DATE: string,
    UPD_EMPL: string,
    REMARK: string,
    FINAL: string,
    G_WIDTH: number,
    G_LENGTH: number,
    G_NAME_KT: string,
    EQ1: string,
    EQ2: string,
    EQ3: string,
    EQ4: string,
  }

const QuotationForm = ({QUOTATION_DATA}: {QUOTATION_DATA?: BANGGIA_DATA2[]}) => {
    const company: string = useSelector(
        (state: RootState) => state.totalSlice.company
      );
    
  return (
    <div className='pvnquotationform'>
      <div className='header'>
        <div className='companyinfo'>
          <div className='companyname'>CÔNG TY CỔ PHẦN CMS</div>
          <div className='diachi'>
            Địa chỉ: Lô 44D, KCN Quang Minh, TT Chi Đông, Huyện Mê Linh, TP Hà
            Nội
          </div>
          <div className='mstsdt'>
            <div className='mst'>MST:1001007955</div>
            <div className='sdt'>Tel : 0973898913/0985657186</div>
          </div>
          <div className='email'>Email: print.vietnam.ld@gmail.com</div>
          <div className='quotationno'>
            <div className='qno'>Số : 01/ABC-PVN</div>
            <div className='qdate'>Ngày : 04/04/2022</div>
          </div>
        </div>
        <div className='companylogo'>
        {company === 'PVN' && <img
                alt='cmsvina logo'
                src='/logopvn_big.png'
                width={200}
                height={100}
              />}
        {company === 'CMS' && <img
                alt='cmsvina logo'
                src='/logocmsvina.png'
                width={230}
                height={90}
              />}
        </div>
      </div>
      <div className='title'>
        <div className='vn'>BẢNG BÁO GIÁ</div>
        <div className='en'>(PRICE QUOTATION)</div>
      </div>
      <div className='customer_info'>
        <div className='tabletitle'>
          <div className='customername'>Khách hàng:</div>
          <div className='address'>Địa chỉ:</div>
          <div className='mst'>MST:</div>
          <div className='phonenumber'>Tel:</div>
          <div className='email'>Email:</div>
        </div>
        <div className='content'>
          <div className='customername'>Công ty TNHH CMSVINA</div>
          <div className='address'>
            Địa chỉ: Lô 44D, KCN Quang Minh, TT Chi Đông, Huyện Mê Linh, TP Hà
            Nội
          </div>
          <div className='mst'>1001007955</div>
          <div className='phonenumber'>0973898913/0985657186</div>
          <div className='email'>print.vietnam.ld@gmail.com</div>
        </div>
      </div>
      <div className='quotation_info'>
        <div className='quotationtitle'>
          Công ty CP CMS kính gửi quý khách hàng báo giá mặt hàng như sau:
        </div>
        <div className='qtable'>
          <table>
            <thead>
              <tr>
                <td>STT (NO)</td>
                <td>MÔ TẢ SẢN PHẨM</td>
                <td>KÍCH THƯỚC</td>
                <td>VẬT LIỆU</td>
                <td>CÔNG ĐOẠN</td>
                <td>LOẠI HÀNG</td>
                <td>ĐVT (UNIT)</td>
                <td>MOQ (QTY)</td>
                <td>ĐƠN GIÁ (PRICE)(VNĐ/ĐVT)</td>
                <td>THÀNH TIỀN (TOTAL)</td>
              </tr>
            </thead>
            <tbody>
                {QUOTATION_DATA?.map((ele: BANGGIA_DATA2, index: number)=> {
                    return (
                        <tr key={index}>
                            <td>{index+1}</td>
                            <td>{ele.G_NAME}</td>
                            <td>{ele.G_LENGTH}*{ele.G_WIDTH}</td>
                            <td>{ele.PROD_MAIN_MATERIAL}</td>
                            <td>{ele.EQ1}-{ele.EQ2}-{ele.EQ3}-{ele.EQ4}</td>
                            <td>Cuộn</td>                            
                            <td>Bộ</td>
                            <td>{ele.MOQ}</td>
                            <td>{ele.PROD_PRICE}</td>
                            <td>{ele.MOQ * ele.PROD_PRICE}</td>
                        </tr>

                    )
                })}
              

              {/*
              <tr>
                <td rowSpan={3}>1</td>
                <td rowSpan={3}>
                  TEM TINH BỘT NGHỆ Kích thước : Tem chính : 65x298mm, Tem nắp :
                  F92mm Nvl : Decal PP Quy cách : In màu, cán màng mờ, bế thành
                  phẩm, dạng cuộn.
                </td>
                <td rowSpan={3}>Bộ</td>
                <td>5,000</td>
                <td>1,100</td>
                <td>5,500,000</td>
              </tr>


               <tr>
                <td>5,000</td>
                <td>1,100</td>
                <td>5,500,000</td>
              </tr>
              <tr>
                <td>5,000</td>
                <td>1,100</td>
                <td>5,500,000</td>
              </tr>
              <tr>
                <td rowSpan={3}>1</td>
                <td rowSpan={3}>
                  TEM TINH BỘT NGHỆ Kích thước : Tem chính : 65x298mm, Tem nắp :
                  F92mm Nvl : Decal PP Quy cách : In màu, cán màng mờ, bế thành
                  phẩm, dạng cuộn.
                </td>
                <td rowSpan={3}>Bộ</td>
                <td>5,000</td>
                <td>1,100</td>
                <td>5,500,000</td>
              </tr>
              <tr>
                <td>5,000</td>
                <td>1,100</td>
                <td>5,500,000</td>
              </tr>
              <tr>
                <td>5,000</td>
                <td>1,100</td>
                <td>5,500,000</td>
              </tr>
              <tr>
                <td rowSpan={3}>1</td>
                <td rowSpan={3}>
                  TEM TINH BỘT NGHỆ Kích thước : Tem chính : 65x298mm, Tem nắp :
                  F92mm Nvl : Decal PP Quy cách : In màu, cán màng mờ, bế thành
                  phẩm, dạng cuộn.
                </td>
                <td rowSpan={3}>Bộ</td>
                <td>5,000</td>
                <td>1,100</td>
                <td>5,500,000</td>
              </tr>
              <tr>
                <td>5,000</td>
                <td>1,100</td>
                <td>5,500,000</td>
              </tr>
              <tr>
                <td>5,000</td>
                <td>1,100</td>
                <td>5,500,000</td>
              </tr>
              <tr>
                <td rowSpan={3}>1</td>
                <td rowSpan={3}>
                  TEM TINH BỘT NGHỆ Kích thước : Tem chính : 65x298mm, Tem nắp :
                  F92mm Nvl : Decal PP Quy cách : In màu, cán màng mờ, bế thành
                  phẩm, dạng cuộn.
                </td>
                <td rowSpan={3}>Bộ</td>
                <td>5,000</td>
                <td>1,100</td>
                <td>5,500,000</td>
              </tr>
              <tr>
                <td>5,000</td>
                <td>1,100</td>
                <td>5,500,000</td>
              </tr>
              <tr>
                <td>5,000</td>
                <td>1,100</td>
                <td>5,500,000</td>
              </tr>
              <tr>
                <td rowSpan={3}>1</td>
                <td rowSpan={3}>
                  TEM TINH BỘT NGHỆ Kích thước : Tem chính : 65x298mm, Tem nắp :
                  F92mm Nvl : Decal PP Quy cách : In màu, cán màng mờ, bế thành
                  phẩm, dạng cuộn.
                </td>
                <td rowSpan={3}>Bộ</td>
                <td>5,000</td>
                <td>1,100</td>
                <td>5,500,000</td>
              </tr>
              <tr>
                <td>5,000</td>
                <td>1,100</td>
                <td>5,500,000</td>
              </tr>
              <tr>
                <td>5,000</td>
                <td>1,100</td>
                <td>5,500,000</td>
              </tr>
              <tr>
                <td rowSpan={3}>1</td>
                <td rowSpan={3}>
                  TEM TINH BỘT NGHỆ Kích thước : Tem chính : 65x298mm, Tem nắp :
                  F92mm Nvl : Decal PP Quy cách : In màu, cán màng mờ, bế thành
                  phẩm, dạng cuộn.
                </td>
                <td rowSpan={3}>Bộ</td>
                <td>5,000</td>
                <td>1,100</td>
                <td>5,500,000</td>
              </tr>
              <tr>
                <td>5,000</td>
                <td>1,100</td>
                <td>5,500,000</td>
              </tr>
              <tr>
                <td>5,000</td>
                <td>1,100</td>
                <td>5,500,000</td>
              </tr> */}
            </tbody>
          </table>
        </div>
      </div>
      <div className='remark'>
        <div className="ghichutitle">
            GHI CHÚ:
        </div>
        <div className="ghichucontent">Báo giá trên chưa bao gồm VAT 10%</div>
        <div className="ghichucontent">Địa điểm giao hàng : Tại kho Khách Hàng</div>
        <div className="ghichucontent">Thời hạn giao hàng : 03 - 07 ngày từ ngày nhận được PO (Đơn đặt hàng), Thiết kế.</div>
        <div className="ghichucontent">Thời hạn thanh toán: Sau khi nhận hàng và hoá đơn.</div>
        <div className="ghichucontent">Phương thức thanh toán: Chuyển khoản/ tiền mặt</div>
        <div className="ghichucontent">Thời hạn báo giá : đến khi có báo giá mới</div>
      </div>
      <div className='loichuc'>
        CMS , Kính Chúc Quý Khách Sức Khỏe Và Thành Công !
      </div>
      <div className='approval'>
        <div className='kyduyet'>KÝ DUYỆT</div>
        <div className='phutrach'>
            <span className='nvpt'>NHÂN VIÊN PHỤ TRÁCH</span>
            <span className='nvname'>Ms Phương 0344173388</span>
        </div>
      </div>
    </div>
  );
}

export default QuotationForm
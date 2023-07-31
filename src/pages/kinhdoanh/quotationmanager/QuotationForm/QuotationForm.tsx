import React from 'react'
import "./QuotationForm.scss"

const QuotationForm = () => {
  return (
    <div className='pvnquotationform'>
        <div className="header">
            <div className="companyinfo">
                <div className="companyname">
                    CÔNG TY CỔ PHẦN CMS
                </div>
                <div className="diachi">
                    Địa chỉ: Lô 44D, KCN Quang Minh, TT Chi Đông, Huyện Mê Linh, TP Hà Nội
                </div>
                <div className="mstsdt">
                    <div className="mst">
                        MST:1001007955
                    </div>
                    <div className="sdt">
                    Tel  : 0973898913/0985657186
                    </div>

                </div>
                <div className="email">
                Email: print.vietnam.ld@gmail.com
                </div>
                <div className="quotationno">
                    <div className="qno">
                        Số : 01/ABC-PVN
                    </div>
                    <div className="qdate">
                        Ngày : 04/04/2022
                    </div>

                </div>

            </div>
            <div className="companylogo">

            </div>

        </div>
        <div className="title">
            BẢNG BÁO GIÁ (PRICE QUOTATION)

        </div>
        <div className="customer_info">

        </div>
        <div className="quotation_info">

        </div>
        <div className="remark">

        </div>
        <div className="loichuc">

        </div>
        <div className="approval">
            <div className="kyduyet">

            </div>
            <div className="phutrach">

            </div>

        </div>
    </div>
  )
}

export default QuotationForm
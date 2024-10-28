import React, { useEffect, useState } from "react";
import "./QuotationForm.scss";
import { RootState } from "../../../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { generalQuery } from "../../../../api/Api";
import moment from "moment";
import Swal from "sweetalert2";

interface BANGGIA_DATA2 {
  id: number;
  CUST_NAME_KD?: string;
  CUST_CD?: string;
  G_CODE?: string;
  G_NAME?: string;
  G_NAME_KD?: string;
  DESCR?: string;
  PROD_DVT?: string;
  PROD_MAIN_MATERIAL?: string;
  PRICE_DATE: string;
  MOQ: number;
  PROD_PRICE: number;
  INS_DATE: string;
  INS_EMPL: string;
  UPD_DATE: string;
  UPD_EMPL: string;
  REMARK: string;
  FINAL: string;
  G_WIDTH: number;
  G_LENGTH: number;
  G_NAME_KT: string;
  EQ1: string;
  EQ2: string;
  EQ3: string;
  EQ4: string;
}

interface CUST_INFO {
  id: string;
  CUST_CD: string;
  CUST_NAME_KD: string;
  CUST_NAME: string;
  CUST_ADDR1: string;
  TAX_NO: string;
  CUST_NUMBER: string;
  BOSS_NAME: string;
  TEL_NO1: string;
  FAX_NO: string;
  CUST_POSTAL: string;
  EMAIL: string;
  REMK: string;
  INS_DATE: string;
  INS_EMPL: string;
  UPD_DATE: string;
  UPD_EMPL: string;
}

const QuotationForm = ({
  QUOTATION_DATA,
}: {
  QUOTATION_DATA?: BANGGIA_DATA2[];
}) => {
  const company: string = useSelector(
    (state: RootState) => state.totalSlice.company,
  );

  const [custinfodatatable, setCUSTINFODataTable] = useState<Array<CUST_INFO>>(
    [],
  );
  const handleCUSTINFO = () => {
    generalQuery("get_listcustomer", {})
      .then((response) => {
        /// console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: CUST_INFO[] = response.data.data.map(
            (element: CUST_INFO, index: number) => {
              return {
                ...element,
                CUST_NAME: element.CUST_NAME !== null ? element.CUST_NAME : "",
                CUST_NAME_KD:
                  element.CUST_NAME_KD !== null ? element.CUST_NAME_KD : "",
                CUST_ADDR1:
                  element.CUST_ADDR1 !== null ? element.CUST_ADDR1 : "",
                TAX_NO: element.TAX_NO !== null ? element.TAX_NO : "",
                CUST_NUMBER:
                  element.CUST_NUMBER !== null ? element.CUST_NUMBER : "",
                BOSS_NAME: element.BOSS_NAME !== null ? element.BOSS_NAME : "",
                TEL_NO1: element.TEL_NO1 !== null ? element.TEL_NO1 : "",
                FAX_NO: element.FAX_NO !== null ? element.FAX_NO : "",
                CUST_POSTAL:
                  element.CUST_POSTAL !== null ? element.CUST_POSTAL : "",
                EMAIL: element.EMAIL !== null ? element.EMAIL : "",
                REMK: element.REMK !== null ? element.REMK : "",
                INS_DATE:
                  element.INS_DATE !== null
                    ? moment.utc(element.INS_DATE).format("YYYY-MM-DD")
                    : "",
                UPD_DATE:
                  element.UPD_DATE !== null
                    ? moment.utc(element.UPD_DATE).format("YYYY-MM-DD")
                    : "",
                id: index,
              };
            },
          );
          setCUSTINFODataTable(
            loadeddata.filter((e: CUST_INFO, index: number) => {
              return (
                QUOTATION_DATA !== undefined &&
                e.CUST_CD === QUOTATION_DATA[0]?.CUST_CD
              );
            }),
          );
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    handleCUSTINFO();
  }, []);

  return (
    <div className="pvnquotationform">
      <div className="header">
        <div className="companyinfo">
          <div className="companyname">
            {company !== "CMS" ? "CÔNG TY CỔ PHẦN PVN" : "CÔNG TY TNHH CMS"}{" "}
          </div>
          <div className="diachi">
            {company !== "CMS"
              ? "Địa chỉ: Lô 44D, KCN Quang Minh, TT Chi Đông, Huyện Mê Linh, TP Hà Nội"
              : "Lô 10A, KCN Quang Minh, TT Quang Minh, Mê Linh, Hà Nội"}
          </div>
          <div className="mstsdt">
            <div className="mst">
              MST:{company !== "CMS" ? "1001007955" : "1900100 có"}
            </div>
            <div className="sdt">
              Tel : {company !== "CMS" ? "0973898913/0985657186" : "1900100 có"}
            </div>
          </div>
          <div className="email">
            Email:{" "}
            {company !== "CMS"
              ? "print.vietnam.ld@gmail.com"
              : "cms4285@gmail.com"}{" "}
          </div>
          <div className="quotationno">
            <div className="qno">
              Số:______/{custinfodatatable[0]?.CUST_NAME_KD}-{company}
            </div>
            <div className="qdate">
              Ngày : {moment.utc().format("DD/MM/YYYY")}
            </div>
          </div>
        </div>
        <div className="companylogo">
          {company !== "CMS" && (
            <img
              alt="cmsvina logo"
              src="/companylogo.png"
              width={200}
              height={100}
            />
          )}
          {company === "CMS" && (
            <img
              alt="cmsvina logo"
              src="/companylogo.png"
              width={230}
              height={90}
            />
          )}
        </div>
      </div>
      <div className="title">
        <div className="vn">BẢNG BÁO GIÁ</div>
        <div className="en">(PRICE QUOTATION)</div>
      </div>
      <div className="customer_info">
        <div className="tabletitle">
          <div className="customername">Khách hàng:</div>
          <div className="address">Địa chỉ:</div>
          <div className="mst">MST:</div>
          <div className="phonenumber">Tel:</div>
          <div className="email">Email:</div>
        </div>
        <div className="content">
          <div className="customername">{custinfodatatable[0]?.CUST_NAME}</div>
          <div className="address">{custinfodatatable[0]?.CUST_ADDR1}</div>
          <div className="mst">{custinfodatatable[0]?.TAX_NO}</div>
          <div className="phonenumber">{custinfodatatable[0]?.TEL_NO1}</div>
          <div className="email">{custinfodatatable[0]?.EMAIL}</div>
        </div>
      </div>
      <div className="quotation_info">
        <div className="quotationtitle">
          Công ty CP CMS kính gửi quý khách hàng báo giá mặt hàng như sau:
        </div>
        <div className="qtable">
          <table>
            <thead>
              <tr style={{ backgroundColor: "#1E73F5", color: "white" }}>
                <td style={{ width: "5%" }}>STT (NO)</td>
                <td style={{ width: "10%" }}>
                  {company === "CMS" ? "CODE KH" : "MÃ PVN (PVN CODE)"}
                </td>
                <td style={{ width: "5%" }}>
                  MÃ KH<br></br>(CUSTOMER CODE)
                </td>
                <td style={{ width: "20%" }}>
                  MÔ TẢ SẢN PHẨM<br></br>(PRODUCT DESCRIPTION)
                </td>
                <td style={{ width: "10%" }}>VẬT LIỆU</td>
                <td style={{ width: "10%" }}>
                  KÍCH THƯỚC<br></br>(SIZE)(mm)
                </td>
                <td style={{ width: "10%" }}>CÔNG ĐOẠN</td>
                <td style={{ width: "5%" }}>ĐVT (UNIT)</td>
                <td style={{ width: "5%" }}>SỐ LƯỢNG (QTY)</td>
                <td style={{ width: "10%" }}>
                  ĐƠN GIÁ<br></br>(PRICE)<br></br>(VNĐ/ĐVT)
                </td>
                <td style={{ width: "10%" }}>THÀNH TIỀN (TOTAL)</td>
              </tr>
            </thead>
            <tbody>
              {QUOTATION_DATA?.map((ele: BANGGIA_DATA2, index: number) => {
                return (
                  <tr key={index} style={{ height: "9mm" }}>
                    <td>{index + 1}</td>
                    <td>{ele.G_NAME_KD}</td>
                    <td>{ele.CUST_CD}</td>
                    <td>{ele.DESCR}</td>
                    <td>{ele.PROD_MAIN_MATERIAL}</td>
                    <td>
                      {ele.G_LENGTH}*{ele.G_WIDTH}
                    </td>
                    <td>
                      {ele.EQ1 !== "NA" &&
                      ele.EQ1 !== "NO" &&
                      ele.EQ1 !== "" &&
                      ele.EQ1 !== null
                        ? ele.EQ1
                        : ""}
                      {ele.EQ2 !== "NA" &&
                      ele.EQ2 !== "NO" &&
                      ele.EQ2 !== "" &&
                      ele.EQ2 !== null
                        ? "-" + ele.EQ2
                        : ""}
                      {ele.EQ3 !== "NA" &&
                      ele.EQ3 !== "NO" &&
                      ele.EQ3 !== "" &&
                      ele.EQ3 !== null
                        ? "-" + ele.EQ3
                        : ""}
                      {ele.EQ4 !== "NA" &&
                      ele.EQ4 !== "NO" &&
                      ele.EQ4 !== "" &&
                      ele.EQ4 !== null
                        ? "-" + ele.EQ4
                        : ""}
                    </td>
                    <td>{ele.PROD_DVT}</td>
                    <td>{ele.MOQ}</td>
                    <td>
                      {(ele.PROD_PRICE * 23100).toLocaleString("en-US", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td>
                      {(ele.MOQ * ele.PROD_PRICE * 23100).toLocaleString(
                        "en-US",
                        { minimumFractionDigits: 0, maximumFractionDigits: 0 },
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="remark">
        <div className="ghichutitle">GHI CHÚ:</div>
        <div className="ghichucontent">Báo giá trên chưa bao gồm VAT 10%</div>
        <div className="ghichucontent">
          Địa điểm giao hàng : Tại kho Khách Hàng
        </div>
        <div className="ghichucontent">
          Thời hạn giao hàng : 03 - 07 ngày từ ngày nhận được PO (Đơn đặt hàng),
          Thiết kế.
        </div>
        <div className="ghichucontent">
          Thời hạn thanh toán: Sau khi nhận hàng và hoá đơn.
        </div>
        <div className="ghichucontent">
          Phương thức thanh toán: Chuyển khoản/ tiền mặt
        </div>
        <div className="ghichucontent">
          Thời hạn báo giá : đến khi có báo giá mới
        </div>
      </div>
      <div className="loichuc">
        CMS , Kính Chúc Quý Khách Sức Khỏe Và Thành Công !
      </div>
      <div className="approval">
        <div className="kyduyet">
          KÝ DUYỆT
          {company !== "CMS" && (
            <img
              alt="cmsvina logo"
              src="/chukystamp.png"
              width={220}
              height={220}
            />
          )}
        </div>
        <div className="phutrach">
          <span className="nvpt" style={{ fontWeight: "bold" }}>
            NHÂN VIÊN PHỤ TRÁCH
          </span>
          <span className="nvname">Ms Phương 0344173388</span>
        </div>
      </div>
    </div>
  );
};

export default QuotationForm;

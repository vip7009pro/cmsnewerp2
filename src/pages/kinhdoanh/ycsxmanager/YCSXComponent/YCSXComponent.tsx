import moment from "moment";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { generalQuery } from "../../../../api/Api";
import { UserContext } from "../../../../api/Context";

import "./YCSXComponent.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";

/* import Barcode from 'react-barcode'; */
import Barcode from "react-barcode";
import {
  FullBOM,
  TONKHOTDYCSX,
  TONVL,
  UserData,
  YCSXTableData,
} from "../../../../api/GlobalInterface";
import { checkHSD2 } from "../../../../api/GlobalFunction";
interface POBALANCETDYCSX {
  G_CODE: string;
  PO_BALANCE: number;
}
const YCSXComponent = ({ DATA }: { DATA: YCSXTableData }) => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData,
  );
  const company: string = useSelector(
    (state: RootState) => state.totalSlice.company,
  );
  const [tvl_tdycsx, setTVL_TDYCSX] = useState<Array<TONVL>>([
    {
      M_CODE: "string",
      M_NAME: "string",
      WIDTH_CD: 0,
      TON_DAU: 0,
      INPUT: 0,
      OUTPUT: 0,
      RETURN_IN: 0,
      HOLDING: 0,
      GRAND_TOTAL: 0,
    },
  ]);
  const [tk_tdycsx, setTK_TDYCSX] = useState<TONKHOTDYCSX>({
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
  const [pobalance_tdycsx, setPOBalanceTdycsx] = useState<POBALANCETDYCSX>({
    G_CODE: "",
    PO_BALANCE: 0,
  });
  const [request_codeinfo, setRequest_CodeInfo] = useState<Array<FullBOM>>([
    {
      REMK: "20220617",
      PROD_REQUEST_QTY: 18000,
      PROD_REQUEST_NO: "2FH0078",
      PROD_REQUEST_DATE: "20220617",
      G_CODE: "7A07975A",
      G_NAME_KD: "",
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
      FACTORY: "",
      EQ1: "",
      EQ2: "",
      EQ3: "",
      EQ4: "",
      Setting1: 0,
      Setting2: 0,
      Setting3: 0,
      Setting4: 0,
      UPH1: 0,
      UPH2: 0,
      UPH3: 0,
      UPH4: 0,
      Step1: 0,
      Step2: 0,
      Step3: 0,
      Step4: 0,
      LOSS_SX1: 0,
      LOSS_SX2: 0,
      LOSS_SX3: 0,
      LOSS_SX4: 0,
      LOSS_SETTING1: 0,
      LOSS_SETTING2: 0,
      LOSS_SETTING3: 0,
      LOSS_SETTING4: 0,
      NOTE: "",
      PO_TYPE: "E1",
      PROD_MAIN_MATERIAL: "",
      LIEUQL_SX: 0,
      FSC: "N",
      NO_INSPECTION: "N",
      PDBV: "N",
      PDUYET:0,
      PL_HANG:"TT",
      PROD_TYPE:"",
      EXP_DATE:0
    },
  ]);
  const [checklieuchinh, setCheckLieuChinh] = useState(false);
  const [isMainMaterialFSC, setIsMainMaterialFSC] = useState(false);
  const [mainMaterialFSC_CODE, setMainMaterialFSC_CODE] = useState('01');
  const [mainMaterialFSC_NAME,setMainMaterialFSC_NAME] = useState('NO_FSC');
  const [mainMaterialEXP_DATE,setMainMaterialEXP_DATE] = useState(0);
  const [pd_hsd,setPd_HSD] = useState('N');

  const initYCSX = async () => {
    let inventorydate: string = "202207";
    await generalQuery("check_inventorydate", {
      G_CODE: DATA.G_CODE,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          inventorydate = response.data.data[0].INVENTORY_DATE;
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
      await generalQuery("checkMainMaterialFSC", {
        M_NAME: DATA.PROD_MAIN_MATERIAL,
      })
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            if(response.data.data[0].FSC==='Y')
            {
              
              setIsMainMaterialFSC(true);
              setMainMaterialFSC_CODE(response.data.data[0].FSC_CODE);      
              setMainMaterialFSC_NAME(response.data.data[0].FSC_NAME)        
            }
            setMainMaterialEXP_DATE(response.data.data[0].EXP_DATE ?? 0);

          } else {
            setMainMaterialEXP_DATE(0);
            setIsMainMaterialFSC(false);
            setMainMaterialFSC_CODE('01');
            setMainMaterialFSC_NAME('NO_FSC');
          }
        })
        .catch((error) => {
          console.log(error);
        });


    await generalQuery("ycsx_fullinfo", {
      PROD_REQUEST_NO: DATA.PROD_REQUEST_NO,
      TRADATE: moment(inventorydate).format("YYYY-MM-DD 08:00:00"),
      INVENTORY: inventorydate,
    })
      .then((response) => {
        //console.log('Data request full ycsx :');
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          for (let i = 0; i < response.data.data.length; i++) {
            if (
              response.data.data[i].PROD_MAIN_MATERIAL ===
                response.data.data[i].M_NAME &&
              response.data.data[i].LIEUQL_SX === 1
            ) {
              setCheckLieuChinh(true);
            }
          }
          setRequest_CodeInfo(response.data.data);
        } else {
          setRequest_CodeInfo([
            {
              REMK: "20220617",
              PROD_REQUEST_QTY: 18000,
              PROD_REQUEST_NO: "2FH0078",
              PROD_REQUEST_DATE: "20220617",
              G_CODE: "7A07975A",
              G_NAME_KD: "",
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
              FACTORY: "",
              EQ1: "",
              EQ2: "",
              EQ3: "",
              EQ4: "",
              Setting1: 0,
              Setting2: 0,
              Setting3: 0,
              Setting4: 0,
              UPH1: 0,
              UPH2: 0,
              UPH3: 0,
              UPH4: 0,
              Step1: 0,
              Step2: 0,
              Step3: 0,
              Step4: 0,
              LOSS_SX1: 0,
              LOSS_SX2: 0,
              LOSS_SX3: 0,
              LOSS_SX4: 0,
              LOSS_SETTING1: 0,
              LOSS_SETTING2: 0,
              LOSS_SETTING3: 0,
              LOSS_SETTING4: 0,
              NOTE: "",
              PO_TYPE: "E1",
              PROD_MAIN_MATERIAL: "",
              LIEUQL_SX: 0,
              FSC: "N",
            },
          ]);
          //Swal.fire("Thông báo","Số yêu cầu " + PROD_REQUEST_NO + "không tồn tại","error");
        }
      })
      .catch((error) => {
        console.log(error);
      });

    await generalQuery("checkpobalance_tdycsx", {
      G_CODE: DATA.G_CODE,
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
    await generalQuery("checktonkho_tdycsx", {
      G_CODE: DATA.G_CODE,
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
  }; 
  useEffect(() => {
    initYCSX();
  }, [DATA.PROD_REQUEST_NO]);

  return (
    <div className="ycsxcomponent">
      {DATA.PDBV === "Y" && checklieuchinh === true && (
        <div className="qcpass">
          <img
            alt="qcpass"
            src="/QC PASS20.png"
            width={440 - 100 - 10}
            height={400 - 100}
          />
        </div>
      )}
      {request_codeinfo[0]?.CODE_55==='04' && (
        <div className="qcpass">
          <img
            alt="qcpass"
            src="/SAMPLE.png"
            width={440 - 100 - 10}
            height={400 - 100}
          />
        </div>
      )}
      {request_codeinfo[0]?.FSC === "Y" && (
        <div className="fsc">
          <img
            alt="qcpass"
            src="/fsc logo2.png"
            width={440 - 100 - 10}
            height={400 - 100}
          />
        </div>
      )}
      {request_codeinfo[0].PDUYET===1 && (
        <div className="tieudeycsx">
          {company === "CMS" && (
            <img alt="logo" src="/companylogo.png" width={160} height={40} />
          )}
          {company !== "CMS" && (
            <img alt="logo" src="/companylogo.png" width={160} height={80} />
          )}
          <div className="title">
            {" "}
            생산요청서 - Yêu cầu sản xuất<br></br>
            <span style={{ fontSize: 12 }}>
              Thời điểm in YCSX: {moment().format("YYYY-MM-DD HH:mm:ss")}
            </span>
            <br></br>{" "}
            {request_codeinfo[0].NO_INSPECTION === "Y" && (
              <span style={{ fontSize: 12 }}>
                (Sản phẩm không kiểm tra ngoại quan)
              </span>
            )}
          </div>
          <div className="soycsx">
            <div className="ycsxno">
              {request_codeinfo[0].PROD_REQUEST_DATE}-
              {request_codeinfo[0].PROD_REQUEST_NO}{" "}
            </div>
            <div className="ycsxbarcode">
              <Barcode
                value={request_codeinfo[0]?.PROD_REQUEST_NO}
                format="CODE128"
                width={1}
                height={50}
                displayValue={false}
                background="#fff"
                lineColor="black"
                margin={0}
              />
            </div>
          </div>
        </div>
      )}
      {request_codeinfo[0].PDUYET===1 && (request_codeinfo[0].FSC !=='Y' || (isMainMaterialFSC && request_codeinfo[0].FSC ==='Y' && mainMaterialFSC_CODE===request_codeinfo[0].FSC_CODE)) && checkHSD2(Number(mainMaterialEXP_DATE),Number(request_codeinfo[0]?.EXP_DATE ?? 0),request_codeinfo[0]?.PD_HSD ?? 'N', request_codeinfo[0]?.QL_HSD ?? 'Y') && (
        <div className="thongtinycsx">
          <div className="text1">
            1. 정보 Thông tin({request_codeinfo[0].G_NAME} ) _ PO_TYPE: (
            {request_codeinfo[0]?.PO_TYPE} ){" "}
          </div>
          <div className="thongtinyeucau">
            <table className="ttyc1">
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
            <table className="ttyc2">
              <thead>
                <tr>
                  <th>Hạng mục/항목</th>
                  <th>Thông tin/정보</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Số lượng yêu cầu/요청수량</td>
                  <td>
                    {request_codeinfo[0]?.PROD_REQUEST_QTY.toLocaleString(
                      "en-US",
                    )}{" "}
                    EA
                  </td>
                </tr>
                <tr>
                  <td>Số lượng tồn/재고수량</td>
                  <td>
                    {(
                      tk_tdycsx?.CHO_KIEM +
                      tk_tdycsx?.CHO_KIEM_RMA +
                      tk_tdycsx?.CHO_KIEM_RMA +
                      tk_tdycsx?.TON_TP +
                      tk_tdycsx?.BTP -
                      tk_tdycsx?.BLOCK_QTY
                    ).toLocaleString("en-US")}{" "}
                    EA
                  </td>
                </tr>
                <tr>
                  <td>Số lượng giao/납품수량</td>
                  <td>
                    {request_codeinfo[0]?.PROD_REQUEST_QTY.toLocaleString(
                      "en-US",
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Ngày giao/납품예정일</td>
                  <td>
                    {moment(request_codeinfo[0]?.DELIVERY_DT).format(
                      "YYYY-MM-DD",
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
            <table className="ttyc3">
              <thead>
                <tr>
                  <th>Hạng mục/항목</th>
                  <th>Thông tin/정보</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Phân loại sản xuất/생산구분</td>
                  <td>
                    {request_codeinfo[0]?.CODE_55 === "01"
                      ? "Thông thường"
                      : request_codeinfo[0]?.CODE_55 === "02"
                      ? "SDI"
                      : request_codeinfo[0]?.CODE_55 === "03"
                      ? "ETC"
                      : request_codeinfo[0]?.CODE_55 === "04"
                      ? "SAMPLE"
                      : ""}
                  </td>
                </tr>
                <tr>
                  <td>Phân loại giao hàng/납품구분</td>
                  <td>
                    {request_codeinfo[0]?.CODE_50 === "01"
                      ? "GC"
                      : request_codeinfo[0]?.CODE_50 === "02"
                      ? "SK"
                      : request_codeinfo[0]?.CODE_50 === "03"
                      ? "KD"
                      : request_codeinfo[0]?.CODE_50 === "04"
                      ? "VN"
                      : request_codeinfo[0]?.CODE_50 === "05"
                      ? "SAMPLE"
                      : request_codeinfo[0]?.CODE_50 === "06"
                      ? "Vai bac 4"
                      : "ETC"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text1">
            2. 제품 정보 Thông tin sản phẩm _
            {request_codeinfo[0]?.FSC === "Y" ? `(${mainMaterialFSC_NAME})` : ""}
            <span className="approval_info">
              (Specification: {DATA.DESCR}){" "}
            </span>
          </div>
          <div className="thongtinsanpham">
            <div className="ttsp">
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
                    <td>
                      {request_codeinfo[0]?.CODE_33 === "01"
                        ? "EA"
                        : request_codeinfo[0]?.CODE_33 === "02"
                        ? "ROLL"
                        : request_codeinfo[0]?.CODE_33 === "03"
                        ? "SHEET"
                        : request_codeinfo[0]?.CODE_33 === "04"
                        ? "MET"
                        : request_codeinfo[0]?.CODE_33 === "06"
                        ? "PACK (BAG)"
                        : request_codeinfo[0]?.CODE_33 === "99"
                        ? "X"
                        : ""}
                    </td>
                  </tr>
                  <tr>
                    <td>SL Packing</td>
                    <td>
                      {request_codeinfo[0]?.ROLE_EA_QTY.toLocaleString("en-US")}{" "}
                      EA
                    </td>
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
            <div className="title">
              Tồn các loại tại thời điểm IN YCSX
              <span className="approval_info">
                {" "}
                &nbsp;&nbsp;&nbsp; TK IN: {userData?.EMPL_NO}
              </span>{" "}
              {DATA.PDBV === "Y" && (
                <span className="approval_info">
                  {" "}
                  | (TTPD_YCSX_BV: {DATA.PDBV_EMPL} |{" "}
                  {moment.utc(DATA.PDBV_DATE).format("YYYY-MM-DD HH:mm:ss")})
                </span>
              )}
            </div>
            <div className="toncacloai">
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
                    <td>
                      {(
                        tk_tdycsx?.CHO_KIEM +
                        tk_tdycsx?.CHO_KIEM_RMA +
                        tk_tdycsx?.CHO_KIEM_RMA
                      ).toLocaleString("en-US")}
                    </td>
                    <td>{tk_tdycsx?.BLOCK_QTY.toLocaleString("en-US")}</td>
                    <td>
                      <b>
                        {(
                          tk_tdycsx?.CHO_KIEM +
                          tk_tdycsx?.CHO_KIEM_RMA +
                          tk_tdycsx?.CHO_KIEM_RMA +
                          tk_tdycsx?.TON_TP +
                          tk_tdycsx?.BTP -
                          tk_tdycsx?.BLOCK_QTY
                        ).toLocaleString("en-US")}
                      </b>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="text1">3.금형 필름 정보 Thông tin dao film</div>
          <div className="thongtindaofilm">
            <table>
              <thead>
                <tr>
                  <th className="hangmuc">Hạng mục/항목</th>
                  <th>Thông tin/정보</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="hangmuc">Mã Dao</td>
                  <td></td>
                </tr>
                <tr>
                  <td className="hangmuc">Mã Film</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text1">
            4. 제품 정보 Thông tin vật liệu | Liệu chính{" "}
            {request_codeinfo[0].PROD_MAIN_MATERIAL} |{" "}
            {checklieuchinh === true ? "Đã SET" : "Chưa SET"}{" "}
          </div>
          <div className="thongtinvatlieu">
            {request_codeinfo.length <= 12 && (
              <div className="vatlieugiua">
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
                    {request_codeinfo.map((element, index) => (
                      <tr key={index}>
                        <td>{index}</td>
                        <td>{element.M_CODE}</td>
                        <td>{element.M_NAME}</td>
                        <td>{element.WIDTH_CD}</td>
                        <td>{element.TONLIEU?.toLocaleString("en-US")} M</td>
                        <td>{element.HOLDING?.toLocaleString("en-US")} M</td>
                        <td>
                          {element.TONG_TON_LIEU?.toLocaleString("en-US")} M
                        </td>
                        <td>{element.REMARK}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {request_codeinfo.length > 12 && (
              <div className="vatlieutrai">
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
                    {request_codeinfo.map(
                      (element, index) =>
                        index <= 12 && (
                          <tr key={index}>
                            <td>{index}</td>
                            <td>{element.M_CODE}</td>
                            <td>{element.M_NAME}</td>
                            <td>{element.WIDTH_CD}</td>
                            <td>
                              {element.TONLIEU?.toLocaleString("en-US")} M
                            </td>
                            <td>
                              {element.HOLDING?.toLocaleString("en-US")} M
                            </td>
                            <td>
                              {element.TONG_TON_LIEU?.toLocaleString("en-US")} M
                            </td>
                            <td>{element.REMARK}</td>
                          </tr>
                        ),
                    )}
                  </tbody>
                </table>
              </div>
            )}
            {request_codeinfo.length > 12 && (
              <div className="vatlieuphai">
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
                    {request_codeinfo.map(
                      (element, index) =>
                        index > 12 && (
                          <tr key={index}>
                            <td>{index}</td>
                            <td>{element.M_CODE}</td>
                            <td>{element.M_NAME}</td>
                            <td>{element.WIDTH_CD}</td>
                            <td>
                              {element.TONLIEU?.toLocaleString("en-US")} M
                            </td>
                            <td>
                              {element.HOLDING?.toLocaleString("en-US")} M
                            </td>
                            <td>
                              {element.TONG_TON_LIEU?.toLocaleString("en-US")} M
                            </td>
                            <td>{element.REMARK}</td>
                          </tr>
                        ),
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
      {request_codeinfo[0].PDUYET!==1 && <div>YCSX chưa đươc phê duyệt, liên hệ Leader KD</div>}
      {!checkHSD2(Number(mainMaterialEXP_DATE),Number(request_codeinfo[0]?.EXP_DATE ?? 0),request_codeinfo[0]?.PD_HSD ?? 'N', request_codeinfo[0]?.QL_HSD ?? 'Y') && <div>Hạn sử dụng của sản phẩm và của vật liệu không trùng khớp, vui lòng cập nhật lại thông tin sản phẩm.</div>} 
      {((!isMainMaterialFSC && request_codeinfo[0].FSC ==='Y') || ((isMainMaterialFSC && request_codeinfo[0].FSC ==='Y') && mainMaterialFSC_CODE!==request_codeinfo[0].FSC_CODE)) && <div>Hàng FSC liệu cũng phải là FSC, và phải cùng 1 loại FSC, hãy cập nhật lại thông tin sản phẩm.</div>}
    </div>
  );
};
export default YCSXComponent;
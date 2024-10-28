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
import "./YCKT.scss";
import Barcode from "react-barcode";
import {
  FullBOM,
  QLSXCHITHIDATA,
  QLSXPLANDATA,
  UserData,
} from "../../../../api/GlobalInterface";

const YCKT = ({ DATA }: { DATA: QLSXPLANDATA }) => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData,
  );
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
    },
  ]);
  const [chithidatatable, setChiThiDataTable] = useState<QLSXCHITHIDATA[]>([]);
  const handleGetChiThiTable = async () => {
    generalQuery("getchithidatatable", {
      PLAN_ID: DATA.PLAN_ID,
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
  const max_lieu: number = 23;
  const initCTSX = async () => {
    generalQuery("ycsx_fullinfo", {
      PROD_REQUEST_NO: DATA.PROD_REQUEST_NO,
    })
      .then((response) => {
        //console.log('Data request full ycsx :');
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
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
  };
  useEffect(() => {
    initCTSX();
    handleGetChiThiTable();
  }, [DATA.PLAN_ID]);
  return (
    <div className="ycktcomponent">
      {DATA.PDBV === "Y" && (
        <div className="qcpass">
          <img
            alt="qcpass"
            src="/QC PASS20.png"
            width={440 - 100 - 10}
            height={400 - 100}
          />
        </div>
      )}
      {
        <div className="tieudeycsx">
          <div className="leftlogobarcode">
            <img alt="logo" src="/companylogo.png" width={160} height={40} />
            <Barcode
              value={`${DATA.PLAN_ID}`}
              format="CODE128"
              width={1}
              height={50}
              displayValue={false}
              background="#fff"
              lineColor="black"
              margin={0}
            />
            {DATA.PLAN_ID}
          </div>
          <div className="headertitle">
            검사 요청서 - Yêu cầu kiểm tra({DATA.PLAN_EQ}- B{DATA.STEP})
            <br></br>
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
          <div className="soycsx">
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
              <div className="ycsxno">
                {request_codeinfo[0].PROD_REQUEST_DATE}-
                {request_codeinfo[0].PROD_REQUEST_NO}{" "}
              </div>
            </div>
          </div>
        </div>
      }
      <div className="thongtinycsx">
        <div className="text1">
          1. 지시 정보 Thông tin yêu cầu({request_codeinfo[0].G_NAME} )
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
                <td>Số lượng yêu cầu/요청 수량</td>
                <td>
                  {request_codeinfo[0]?.PROD_REQUEST_QTY.toLocaleString(
                    "en-US",
                  )}{" "}
                  EA
                </td>
              </tr>
              <tr>
                <td>Số lượng chỉ thị/지시 수량</td>
                <td>{DATA.PLAN_QTY?.toLocaleString("en-US")} EA</td>
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
          <table className="ttyc2">
            <thead>
              <tr>
                <th>Hạng mục/항목</th>
                <th>Thông tin/정보</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Nhà máy/공장</td>
                <td>{DATA.PLAN_FACTORY}</td>
              </tr>
              <tr>
                <td>Máy/호기</td>
                <td>{DATA.PLAN_EQ}</td>
              </tr>

              <tr>
                <td>Note (KD)</td>
                <td>{request_codeinfo[0].REMK}</td>
              </tr>
              <tr>
                <td>Chú ý (QLSX)</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="text1">2. 입고 정보 Thông tin nhập hàng</div>
        <div className="thongtinvatlieu">
          <div className="vatlieugiua">
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
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((element, index) => (
                  <tr key={index}>
                    <td style={{ height: 30 }}></td>
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

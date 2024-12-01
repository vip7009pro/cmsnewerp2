import moment from "moment";
import { forwardRef, useContext, useEffect, useImperativeHandle, useState } from "react";
import Swal from "sweetalert2";
import { generalQuery } from "../../../../api/Api";
import { UserContext } from "../../../../api/Context";
import { RootState } from "../../../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import {
  changeDiemDanhState,
  changeUserData,
} from "../../../../redux/slices/globalSlice";
import "./CHITHI_COMPONENT2.scss";
import Barcode from "react-barcode";
import {
  FullBOM,
  QLSXCHITHIDATA,
  QLSXPLANDATA,
  UserData,
} from "../../../../api/GlobalInterface";
interface PLAN_COMBO {
  PLAN_LIST: QLSXPLANDATA[];
}
const CHITHI_COMPONENT2_A = forwardRef(({ PLAN_LIST }: PLAN_COMBO, ref) => {
  const company: string = useSelector(
    (state: RootState) => state.totalSlice.company,
  );
  const [checklieuchinh, setCheckLieuChinh] = useState(false);
  //console.log(PLAN_LIST);
  let main_plan: QLSXPLANDATA = PLAN_LIST.filter(
    (element, index) => element.STEP === 0,
  )[0];
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData,
  );
  const [m_code_ycsx, setM_CODE_YCSX] = useState('XXX');
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
  const [maxLieu, setMaxLieu] = useState(12);
  const [po_balance, setPoBalance] = useState(0);
  const handle_getMcodeOfYcsx=()=> {
    generalQuery("checkP500M_CODE", {
      PROD_REQUEST_NO: PLAN_LIST[0].PROD_REQUEST_NO,
    })
      .then((response) => {
        //console.log('Data request full ycsx :');
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          setM_CODE_YCSX(response.data.data[0].M_NAME);
        } else {
          setM_CODE_YCSX('XXX');        
        }
      })
      .catch((error) => {
        console.log(error);
      });

  }  
  const handleGetChiThiTable = async () => {
    generalQuery("getchithidatatable", {
      PLAN_ID: main_plan.PLAN_ID,
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
  const max_lieu: number = 12;
  const initCTSX = async () => {
    generalQuery("ycsx_fullinfo", {
      PROD_REQUEST_NO: main_plan.PROD_REQUEST_NO,
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
  };
  const checkMaxLieu = () => {
    let temp_maxLieu: any = localStorage.getItem("maxLieu")?.toString();
    if (temp_maxLieu !== undefined) {
      console.log("temp max lieu: ", temp_maxLieu);
      setMaxLieu(temp_maxLieu);
    } else {
      localStorage.setItem("maxLieu", "12");
    }
  };
  const checkPOBalance = () => {
    generalQuery("checkpobalance_tdycsx", {
      G_CODE: main_plan.G_CODE,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);
          setPoBalance(response.data.data[0].PO_BALANCE);
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const lossSXByProcessNumber = (DATA?: QLSXPLANDATA) => {
    let FINAL_LOSS_SX: number = 0, FINAL_LOSS_SETTING: number = 0;
    if (DATA?.PROCESS_NUMBER === 1) {
      FINAL_LOSS_SX = (request_codeinfo[0]?.LOSS_SX2 ?? 0) + (request_codeinfo[0]?.LOSS_SX3 ?? 0) + (request_codeinfo[0]?.LOSS_SX4 ?? 0) + (DATA.LOSS_KT ?? 0);
    } else if (DATA?.PROCESS_NUMBER === 2) {
      FINAL_LOSS_SX = (request_codeinfo[0]?.LOSS_SX3 ?? 0) + (request_codeinfo[0]?.LOSS_SX4 ?? 0) + (DATA.LOSS_KT ?? 0);
    } else if (DATA?.PROCESS_NUMBER === 3) {
      FINAL_LOSS_SX = (request_codeinfo[0]?.LOSS_SX4 ?? 0) + (DATA.LOSS_KT ?? 0);
    } else if (DATA?.PROCESS_NUMBER === 4) {
      FINAL_LOSS_SX = (DATA.LOSS_KT ?? 0);
    }
    if (DATA?.PROCESS_NUMBER === 1) {
      FINAL_LOSS_SETTING = (request_codeinfo[0]?.LOSS_SETTING2 ?? 0) + (request_codeinfo[0]?.LOSS_SETTING3 ?? 0) + (request_codeinfo[0]?.LOSS_SETTING4 ?? 0);
    } else if (DATA?.PROCESS_NUMBER === 2) {
      FINAL_LOSS_SETTING = (request_codeinfo[0]?.LOSS_SETTING3 ?? 0) + (request_codeinfo[0]?.LOSS_SETTING4 ?? 0);
    } else if (DATA?.PROCESS_NUMBER === 3) {
      FINAL_LOSS_SETTING = (request_codeinfo[0]?.LOSS_SETTING4 ?? 0);
    } else if (DATA?.PROCESS_NUMBER === 4) {
      FINAL_LOSS_SETTING = 0;
    }
    FINAL_LOSS_SETTING = FINAL_LOSS_SETTING / (request_codeinfo[0]?.PD ?? 0) * ((request_codeinfo[0]?.G_C ?? 0) * (request_codeinfo[0]?.G_C_R ?? 0)) * 1000;
    return {
      FN_LOSS_SX: FINAL_LOSS_SX,
      FN_LOSS_ST: FINAL_LOSS_SETTING
    }
  }
  useImperativeHandle(ref, () => ({
    handleInternalClick,
  }));
  const handleInternalClick = () => {
    console.log("so chi thi:"+ PLAN_LIST[0].PLAN_ID)
  };
  const M_CODEtrongBOM = chithidatatable.find((ele: QLSXCHITHIDATA, index: number)=> ele.LIEUQL_SX === 1)?.M_NAME
  useEffect(() => {
    handle_getMcodeOfYcsx();
    checkMaxLieu();
    initCTSX();
    handleGetChiThiTable();
    checkPOBalance();
  }, []);
  return (
    <div className="chithicomponent2">
      <div className="qcpass">
        {request_codeinfo[0].PDBV === "Y" && checklieuchinh === true && (
          <img
            alt="qcpass"
            src="/QC PASS20.png"
            width={440 - 100 - 10}
            height={400 - 100}
          />
        )}
        {(request_codeinfo[0].CODE_55 === '04') && (
          <img
            alt="qcpass"
            src="/SAMPLE.png"
            width={440 - 100 - 10}
            height={400 - 100}
          />
        )}
      </div>
      <div className="tieudeycsx">
        <div className="leftlogobarcode">
          {/* {(request_codeinfo[0].PDBV==='Y' && checklieuchinh ===true) && <img alt='logo' src='/logocmsvina.png' width={160} height={40} />} */}
          {company === "CMS" && (
            <img alt="logo" src="/logocmsvina.png" width={160} height={40} />
          )}
          {company !== "CMS" && (
            <img alt="logo" src="/logopvn_big.png" width={160} height={40} />
          )}
          <Barcode
            value={main_plan.PLAN_ID}
            format="CODE128"
            width={1}
            height={50}
            displayValue={false}
            background="#fff"
            lineColor="black"
            margin={0}
          />
          {main_plan.PLAN_ID}
        </div>
        <div className="headertitle">
          생산 지시서 - Chỉ thị Sản Xuất({main_plan.PLAN_EQ}- B
          {main_plan.STEP})<br></br>
          <span style={{ fontSize: 12 }}>
            Thời điểm in CTSX: {moment().format("YYYY-MM-DD HH:mm:ss")}
          </span>
          <br></br>
          <span style={{ fontSize: 12 }}>
            Ngày giao hàng: {request_codeinfo[0]?.DELIVERY_DT}
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
      {request_codeinfo[0].PL_HANG === 'TT' &&
      (M_CODEtrongBOM === m_code_ycsx || m_code_ycsx ==='XXX') &&
        <div className="thongtinycsx">
          <div className="text1">
            1. 지시 정보 Thông tin chỉ thị ({request_codeinfo[0].G_NAME} ) __
            PO_TYPE: {request_codeinfo[0].PO_TYPE}
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
                  <td>
                    {request_codeinfo[0]?.G_CODE}
                    {company !== "CMS"
                      ? "/" + request_codeinfo[0]?.G_NAME_KD
                      : ""}{" "}
                  </td>
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
                  <td>{main_plan.PLAN_QTY?.toLocaleString("en-US")} EA</td>
                </tr>
                <tr>
                  <td>Số lượng cần sản xuất</td>
                  <td>{((PLAN_LIST.find((ele: QLSXPLANDATA, index: number) => ele.STEP === 0)?.PLAN_QTY ?? 0) * (1 + lossSXByProcessNumber(PLAN_LIST.find((ele: QLSXPLANDATA, index: number) => ele.STEP === 0)).FN_LOSS_SX / 100) + lossSXByProcessNumber().FN_LOSS_ST).toLocaleString('en-US', { maximumFractionDigits: 0, minimumFractionDigits: 0 })}EA</td>
                </tr>
                <tr>
                  <td>PD/Cavity (Hàng * Cột)</td>
                  <td>{request_codeinfo[0]?.PD.toLocaleString("en-US")}/
                    ({request_codeinfo[0]?.G_C_R} * {request_codeinfo[0]?.G_C})=
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
                  <td>{main_plan.PLAN_FACTORY}</td>
                </tr>
                <tr>
                  <td>MIN QTY</td>
                  <td>
                    Min CD1:
                    {(request_codeinfo[0]?.UPH1 / 6).toLocaleString("en-US", {
                      maximumFractionDigits: 0,
                    })}{" "}
                    | Min CD2:{" "}
                    {(request_codeinfo[0]?.UPH2 / 6).toLocaleString("en-US", {
                      maximumFractionDigits: 0,
                    })}
                  </td>
                </tr>
                <tr>
                  <td>Chú ý (Kdoanh)</td>
                  <td>{request_codeinfo[0].REMK}</td>
                </tr>
                <tr>
                  <td>Chú ý (QLSX)</td>
                  <td>({((PLAN_LIST.find((ele: QLSXPLANDATA, index: number) => ele.STEP === 0)?.PLAN_QTY ?? 0) * (1 + lossSXByProcessNumber(PLAN_LIST.find((ele: QLSXPLANDATA, index: number) => ele.STEP === 0)).FN_LOSS_SX / 100) + lossSXByProcessNumber().FN_LOSS_ST).toLocaleString('en-US', { maximumFractionDigits: 0, minimumFractionDigits: 0 })})EA</td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* <div className='text1'>
          2. 생산 정보 Thông tin Sản xuất{" "}
          <Barcode
            value={main_plan.PLAN_ID}
            format='CODE128'
            width={1.5}
            height={20}
            displayValue={false}
            background='#fff'
            lineColor='black'
            margin={0}
          />
          ({main_plan.PLAN_ID})
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
                <td>
                  {request_codeinfo[0]?.UPH1 !== null
                    ? request_codeinfo[0]?.UPH1.toLocaleString("en-US")
                    : ""}
                </td>
              </tr>
              <tr>
                <td>UPH2 (EA/h) - {request_codeinfo[0]?.EQ2}</td>
                <td>
                  {request_codeinfo[0]?.UPH2 !== null
                    ? request_codeinfo[0]?.UPH2.toLocaleString("en-US")
                    : ""}
                </td>
              </tr>
              <tr>
                <td>Thời gian setting 1 - {request_codeinfo[0]?.EQ1}</td>
                <td>
                  {request_codeinfo[0]?.Setting1 !== null
                    ? request_codeinfo[0]?.Setting1
                    : ""}
                </td>
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
                <td>{request_codeinfo[0]?.LOSS_SX1} %</td>
              </tr>
              <tr>
                <td>LOSS SX ĐỊNH MỨC 2- {request_codeinfo[0]?.EQ2}</td>
                <td>{request_codeinfo[0]?.LOSS_SX2}%</td>
              </tr>
              <tr>
                <td>LOSS SETTING ĐỊNH MỨC 1- {request_codeinfo[0]?.EQ1}</td>
                <td>
                  {request_codeinfo[0]?.LOSS_SETTING1 !== null
                    ? request_codeinfo[0]?.LOSS_SETTING1.toLocaleString("en-US")
                    : ""}{" "}
                  met
                </td>
              </tr>
              <tr>
                <td>LOSS SETTING ĐỊNH MỨC 2- {request_codeinfo[0]?.EQ2}</td>
                <td>
                  {request_codeinfo[0]?.LOSS_SETTING2 !== null
                    ? request_codeinfo[0]?.LOSS_SETTING2.toLocaleString("en-US")
                    : ""}{" "}
                  met
                </td>
              </tr>
            </tbody>
          </table>
        </div> */}
          <div className="text1">
            2. Thông tin combo chỉ thị_ POBALANCE:{" "}
            {po_balance?.toLocaleString("en-US")}{" "} / ({request_codeinfo[0]?.PROD_TYPE})
          </div>
          <div className="combochithi">
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>PLAN_ID</th>
                  <th>Barcode</th>
                  <th>Machine</th>
                  <th>Step</th>
                  <th>Plan QTY</th>
                  <th>Setting</th>
                </tr>
              </thead>
              <tbody>
                {PLAN_LIST.map((element: QLSXPLANDATA, index: number) => (
                  <tr key={index}>
                    <td>{index}</td>
                    {element.STEP === 0 ? (
                      <td
                        style={{
                          color: "red",
                          fontWeight: "bold",
                          backgroundColor: "lightgreen",
                        }}
                      >
                        {element.PLAN_ID}
                      </td>
                    ) : (
                      <td>{element.PLAN_ID}</td>
                    )}
                    <td>
                      <Barcode
                        value={element.PLAN_ID}
                        format="CODE128"
                        width={1.5}
                        height={25}
                        displayValue={false}
                        background="#fff"
                        lineColor="black"
                        margin={0}
                      />
                    </td>
                    <td>{element.PLAN_EQ}</td>
                    <td>{element.STEP}</td>
                    <td>{element.PLAN_QTY.toLocaleString("en-US")}</td>
                    <td>{element.IS_SETTING === 'Y' ? element.STEP===0? `${
                      element.PROCESS_NUMBER === 1
                        ? request_codeinfo[0]?.LOSS_SETTING1
                        : element.PROCESS_NUMBER === 2
                          ? request_codeinfo[0]?.LOSS_SETTING2
                          : element.PROCESS_NUMBER === 3
                            ? request_codeinfo[0]?.LOSS_SETTING3
                            : element.PROCESS_NUMBER === 4
                              ? request_codeinfo[0]?.LOSS_SETTING4
                              : ""}`: 0 : "Không setting"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text1">
            3. LOSS INFO (Phân loại:{" "}
            {request_codeinfo[0].CODE_50 === "01"
              ? "GC"
              : request_codeinfo[0].CODE_50 === "02"
                ? "SK"
                : request_codeinfo[0].CODE_50 === "03"
                  ? "KD"
                  : request_codeinfo[0].CODE_50 === "04"
                    ? "VN"
                    : request_codeinfo[0].CODE_50 === "05"
                      ? "SAMPLE"
                      : request_codeinfo[0].CODE_50 === "06"
                        ? "Vai bac 4"
                        : "ETC"}
            ) _{request_codeinfo[0]?.FSC === "Y" ? "(FSC Mix Credit)" : ""}{" "}
          </div>
          <div className="thongtinyeucau">
            <table className="ttyc1">
              <thead>
                <tr>
                  <th>PLAN_ID</th>
                  <th>STEP</th>
                  <th>Bóc kiểm (EA)/파괴검사</th>
                  <th>Lấy đồ/도구 준비</th>
                  <th>Máy hỏng/설비 고장</th>
                  <th>Dao NG/칼 불량</th>
                  <th>Chờ liệu/원단 대기</th>
                  <th>Chờ BTP/BTP 대기</th>
                  <th>Hết liệu/원단 떨어짐</th>
                  <th>Liệu NG/원단 불량</th>
                </tr>
              </thead>
              <tbody>
                {PLAN_LIST.map((element: QLSXPLANDATA, index: number) => {
                  return (
                    <tr key={index}>
                      <td style={{ height: "20px" }}>{element.PLAN_ID}</td>
                      <td style={{ height: "20px" }}>{element.STEP}</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="text1">
            5. 제품 정보 Thông tin vật liệu | Liệu chính{" "}
            {request_codeinfo[0].PROD_MAIN_MATERIAL} |{" "}
            {checklieuchinh === true ? "Đã SET" : "Chưa SET"}
          </div>
          <div className="thongtinvatlieu">
            {chithidatatable.length <= maxLieu && (
              <div className="vatlieugiua">
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
                        {element.LIEUQL_SX === 1 ? (
                          <td
                            style={{
                              color: "red",
                              fontWeight: "bold",
                              backgroundColor: "lightgreen",
                            }}
                          >
                            {element.M_NAME}
                          </td>
                        ) : (
                          <td>{element.M_NAME}</td>
                        )}
                        <td>{element.WIDTH_CD}</td>
                        <td>
                          {(element.M_MET_QTY * element.M_QTY).toLocaleString(
                            "en-US",
                          )}{" "}
                          M
                        </td>
                        <td></td>
                        <td></td>
                        <td>{element.LIEUQL_SX}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {chithidatatable.length > maxLieu && (
              <div className="vatlieutrai">
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
                        index <= maxLieu && (
                          <tr key={index}>
                            <td>{index}</td>
                            <td>{element.M_CODE}</td>
                            {element.LIEUQL_SX === 1 ? (
                              <td
                                style={{
                                  color: "red",
                                  fontWeight: "bold",
                                  backgroundColor: "lightgreen",
                                }}
                              >
                                {element.M_NAME}
                              </td>
                            ) : (
                              <td>{element.M_NAME}</td>
                            )}
                            <td>{element.WIDTH_CD}</td>
                            <td>
                              {(element.M_MET_QTY * element.M_QTY).toLocaleString(
                                "en-US",
                              )}{" "}
                              M
                            </td>
                            <td></td>
                            <td></td>
                            <td>{element.LIEUQL_SX}</td>
                          </tr>
                        ),
                    )}
                  </tbody>
                </table>
              </div>
            )}
            {chithidatatable.length > maxLieu && (
              <div className="vatlieuphai">
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
                        index > maxLieu && (
                          <tr key={index}>
                            <td>{index}</td>
                            <td>{element.M_CODE}</td>
                            {element.LIEUQL_SX === 1 ? (
                              <td
                                style={{
                                  color: "red",
                                  fontWeight: "bold",
                                  backgroundColor: "lightgreen",
                                }}
                              >
                                {element.M_NAME}
                              </td>
                            ) : (
                              <td>{element.M_NAME}</td>
                            )}
                            <td>{element.WIDTH_CD}</td>
                            <td>
                              {(element.M_MET_QTY * element.M_QTY).toLocaleString(
                                "en-US",
                              )}{" "}
                              M
                            </td>
                            <td></td>
                            <td></td>
                            <td>{element.LIEUQL_SX}</td>
                          </tr>
                        ),
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>}
      {request_codeinfo[0].PL_HANG !== 'TT' &&
        <div>Không chỉ thị hàng nguyên chiếc, báo lại kinh doanh</div>}
      {(M_CODEtrongBOM !== m_code_ycsx &&  m_code_ycsx !=='XXX') && <div>Liệu chính của cùng 1 ycsx không được thay đổi so với lần sản xuất trước</div>}
    </div>
  );
});
export default CHITHI_COMPONENT2_A;

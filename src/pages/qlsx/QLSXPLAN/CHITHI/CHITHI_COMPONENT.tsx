import moment from "moment";
import { forwardRef, useContext, useEffect, useImperativeHandle, useState } from "react";
import Swal from "sweetalert2";
import { generalQuery, getCompany } from "../../../../api/Api";
import { UserContext } from "../../../../api/Context";
import { RootState } from "../../../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import {
  changeDiemDanhState,
  changeUserData,
} from "../../../../redux/slices/globalSlice";
import "./CHITHI_COMPONENT.scss";
import Barcode from "react-barcode";
import {
  DEFECT_PROCESS_DATA,
  FullBOM,
  QLSXCHITHIDATA,
  QLSXPLANDATA,
  UserData,
} from "../../../../api/GlobalInterface";
import { f_checkEQvsPROCESS, f_loadDefectProcessData } from "../../../../api/GlobalFunction";
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
const CHITHI_COMPONENT = forwardRef(({ DATA}: { DATA: QLSXPLANDATA}, ref) => {
  const cpnInfo: any = useSelector((state: RootState) => state.totalSlice.cpnInfo);
  const company: string = useSelector(
    (state: RootState) => state.totalSlice.company,
  );
  const [checklieuchinh, setCheckLieuChinh] = useState(false);
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
      IQC_STOCK:0,
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
  const [checklieuqlsx, setChecklieuqlsx] = useState(false);
  const [po_balance, setPoBalance] = useState(0);
  const [maxLieu, setMaxLieu] = useState(12);
  const [eq_process_check, setEQ_Process_check] = useState(false);
  const [m_code_ycsx, setM_CODE_YCSX] = useState('XXX');
  const [defectProcessData, setDefectProcessData] = useState<DEFECT_PROCESS_DATA[]>([]);  
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
  const max_lieu: number = 17;
  const handle_getMcodeOfYcsx=()=> {
    generalQuery("checkP500M_CODE", {
      PROD_REQUEST_NO: DATA.PROD_REQUEST_NO,
    })
      .then((response) => {
        //console.log('Data request full ycsx :');
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          setM_CODE_YCSX(response.data.data[0].M_NAME);
          console.log('M_CODE_YCSX',response.data.data[0].M_NAME)
        } else {
          setM_CODE_YCSX('XXX');        
        }
      })
      .catch((error) => {
        console.log(error);
      });

  }  
  const initCTSX = async () => {
    generalQuery("ycsx_fullinfo", {
      PROD_REQUEST_NO: DATA.PROD_REQUEST_NO,
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
          let checkpr: number = f_checkEQvsPROCESS(
            response.data.data[0].EQ1,
            response.data.data[0].EQ2,
            response.data.data[0].EQ3,
            response.data.data[0].EQ4,
          );
          //console.log("max", checkpr);
          setEQ_Process_check(DATA.PROCESS_NUMBER > checkpr ? false : true);
        } else {
          setRequest_CodeInfo([
            {
              REMK: "",
              PROD_REQUEST_QTY: 0,
              PROD_REQUEST_NO: "",
              PROD_REQUEST_DATE: "",
              G_CODE: "",
              G_NAME_KD: "",
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
  const check_dinh_muc = () => {
    if (
      request_codeinfo[0].FACTORY === null ||
      request_codeinfo[0].EQ1 === null ||
      request_codeinfo[0].EQ2 === null ||
      request_codeinfo[0].Setting1 === null ||
      request_codeinfo[0].Setting2 === null ||
      request_codeinfo[0].UPH1 === null ||
      request_codeinfo[0].UPH2 === null ||
      request_codeinfo[0].Step1 === null ||
      request_codeinfo[0].Step1 === null ||
      request_codeinfo[0].LOSS_SX1 === null ||
      request_codeinfo[0].LOSS_SX2 === null ||
      request_codeinfo[0].LOSS_SETTING1 === null ||
      request_codeinfo[0].LOSS_SETTING2 === null
    ) {
      //console.log(false)
      return false;
    } else {
      //console.log(true)
      return true;
    }
  };
  const check_lieuql_sx_m140 = () => {
    generalQuery("check_lieuql_sx_m140", {
      G_CODE: DATA.G_CODE,
    })
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
          setChecklieuqlsx(true);
        } else {
          setChecklieuqlsx(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const checkMaxLieu = () => {
    let temp_maxLieu: any = localStorage.getItem("maxLieu")?.toString();
    if (temp_maxLieu !== undefined) {
      //console.log("temp max lieu : ", temp_maxLieu);
      setMaxLieu(temp_maxLieu);
    } else {
      localStorage.setItem("maxLieu", "12");
    }
  };
  const checkPOBalance = () => {
    generalQuery("checkpobalance_tdycsx", {
      G_CODE: DATA.G_CODE,
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
  const checkApprove = () => {
    if (getCompany() === 'CMS') {
      return (request_codeinfo[0].PDBV === "Y" || request_codeinfo[0].CODE_55 === '04') && checklieuchinh === true
    }
    else {
      return true;
    }
  }
  const lossSXByProcessNumber = () => {
    let FINAL_LOSS_SX: number = 0, FINAL_LOSS_SETTING: number = 0;
    if (DATA.PROCESS_NUMBER === 1) {
      FINAL_LOSS_SX = (request_codeinfo[0]?.LOSS_SX2 ?? 0) + (request_codeinfo[0]?.LOSS_SX3 ?? 0) + (request_codeinfo[0]?.LOSS_SX4 ?? 0) + (DATA?.LOSS_KT ?? 0);
    } else if (DATA.PROCESS_NUMBER === 2) {
      FINAL_LOSS_SX = (request_codeinfo[0]?.LOSS_SX3 ?? 0) + (request_codeinfo[0]?.LOSS_SX4 ?? 0) + (DATA.LOSS_KT ?? 0);
    } else if (DATA.PROCESS_NUMBER === 3) {
      FINAL_LOSS_SX = (request_codeinfo[0]?.LOSS_SX4 ?? 0) + (DATA.LOSS_KT ?? 0);
    } else if (DATA.PROCESS_NUMBER === 4) {
      FINAL_LOSS_SX = (DATA.LOSS_KT ?? 0);
    }
    if (DATA.PROCESS_NUMBER === 1) {
      FINAL_LOSS_SETTING = (request_codeinfo[0]?.LOSS_SETTING2 ?? 0) + (request_codeinfo[0]?.LOSS_SETTING3 ?? 0) + (request_codeinfo[0]?.LOSS_SETTING4 ?? 0);
    } else if (DATA.PROCESS_NUMBER === 2) {
      FINAL_LOSS_SETTING = (request_codeinfo[0]?.LOSS_SETTING3 ?? 0) + (request_codeinfo[0]?.LOSS_SETTING4 ?? 0);
    } else if (DATA.PROCESS_NUMBER === 3) {
      FINAL_LOSS_SETTING = (request_codeinfo[0]?.LOSS_SETTING4 ?? 0);
    } else if (DATA.PROCESS_NUMBER === 4) {
      FINAL_LOSS_SETTING = 0;
    }
    FINAL_LOSS_SETTING = FINAL_LOSS_SETTING / (request_codeinfo[0]?.PD ?? 0) * ((request_codeinfo[0]?.G_C ?? 0) * (request_codeinfo[0]?.G_C_R ?? 0)) * 1000;

    /* console.log('FINAL_LOSS_SX',FINAL_LOSS_SX)
    console.log('FINAL_LOSS_SETTING',FINAL_LOSS_SETTING) */
    return {
      FN_LOSS_SX: FINAL_LOSS_SX,
      FN_LOSS_ST: FINAL_LOSS_SETTING
    }
  }  
  useImperativeHandle(ref, () => ({
    handleInternalClick,
  }));

  const handleLoadDefectProcessData = async () => {
    setDefectProcessData(await f_loadDefectProcessData(DATA.G_CODE, DATA.PROCESS_NUMBER));
  } 
  const handleInternalClick = () => {
    console.log("so chi thi:"+ DATA.PLAN_ID)
  };
  const M_CODEtrongBOM = chithidatatable.find((ele: QLSXCHITHIDATA, index: number)=> ele.LIEUQL_SX === 1)?.M_NAME
  useEffect(() => {
    checkMaxLieu();
    check_lieuql_sx_m140();
    initCTSX();
    handle_getMcodeOfYcsx()
    handleGetChiThiTable();
    handleLoadDefectProcessData();  
    checkPOBalance();
  }, [DATA.PLAN_ID]);
  return (
    <div className="chithicomponent">
      <div className="qcpass">
        {(checkApprove() && request_codeinfo[0].CODE_55 !== '04') && (
          <img
            alt="qcpass"
            src="/QC PASS20.png"
            width={440 - 100 - 10}
            height={400 - 100}
          />
        )}
        {(checkApprove() && request_codeinfo[0].CODE_55 === '04') && (
          <img
            alt="qcpass"
            src="/SAMPLE.png"
            width={440 - 100 - 10}
            height={400 - 100}
          />
        )}
      </div>
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
      {
        <div className="tieudeycsx">
          <div className="leftlogobarcode">
          {company === "CMS" && (
              <img alt="logo" src={cpnInfo[getCompany()].logo} width={cpnInfo[getCompany()].logoWidth} height={cpnInfo[getCompany()].logoHeight} />
            )}
            {company !== "CMS" && (
              <img alt="logo" src={cpnInfo[getCompany()].logo} width={cpnInfo[getCompany()].logoWidth} height={cpnInfo[getCompany()].logoHeight} />
            )}
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
            <span style={{ fontSize: 16 }}>
              생산 지시서 - Chỉ thị Sản Xuất({DATA.PLAN_EQ}- CĐ
              {DATA.PROCESS_NUMBER}- B{DATA.STEP})
            </span>
            <br></br>
            <span style={{ fontSize: 12 }}>
              Thời điểm in CTSX: {moment().format("YYYY-MM-DD HH:mm:ss")}
            </span>
            <br></br>{" "}
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
      }
      {check_dinh_muc() &&
        checklieuqlsx &&
        DATA.PLAN_QTY !== 0 &&
        DATA.PROCESS_NUMBER !== 0 &&
        eq_process_check &&
        DATA.CHOTBC !== 'V' &&
        checkApprove() && 
        request_codeinfo[0].PL_HANG==='TT' && 
        (M_CODEtrongBOM === m_code_ycsx || m_code_ycsx ==='XXX') &&
        request_codeinfo[0].USE_YN==='Y'
        &&
        (
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
                    <td>Tổng cần SX cho CĐ{DATA.PROCESS_NUMBER}</td>
                    <td>{(DATA.PROCESS_NUMBER===1? DATA.SLC_CD1: DATA.PROCESS_NUMBER===2? DATA.SLC_CD2: DATA.PROCESS_NUMBER===3? DATA.SLC_CD3: DATA.SLC_CD4)?.toLocaleString('en-US')} EA</td>
                  </tr>
                  <tr>
                    <td>Tồn chưa chạy:</td>
                    <td> {(DATA.PROCESS_NUMBER===1? DATA.TON_CD1: DATA.PROCESS_NUMBER===2? DATA.TON_CD2: DATA.PROCESS_NUMBER===3? DATA.TON_CD3: DATA.TON_CD4)?.toLocaleString('en-US')} EA</td>
                  </tr>
                  <tr style={{fontWeight:'bold', backgroundColor:'greenyellow'}}>
                    <td>Số lượng chỉ thị/지시 수량</td>
                    <td>{DATA.PLAN_QTY?.toLocaleString("en-US")} EA</td>
                  </tr>                  
                  <tr>
                    <td>P/D - Cavity</td>
                    <td>{request_codeinfo[0]?.PD.toLocaleString("en-US")} / {`${request_codeinfo[0]?.G_C_R * request_codeinfo[0]?.G_C}`}
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
                    <td>{request_codeinfo[0]?.NOTE}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="text1">
              2. 생산 정보 Thông tin Sản xuất{" "}
              <Barcode
                value={`${DATA.PLAN_ID}`}
                format="CODE128"
                width={1.5}
                height={20}
                displayValue={false}
                background="#fff"
                lineColor="black"
                margin={0}
              />
              ({DATA.PLAN_ID}) - {DATA.IS_SETTING === 'Y' ? 'CÓ SETTING' : 'KHÔNG SETTING'}/ ({request_codeinfo[0]?.PROD_TYPE})
            </div>
            <div className="thongtinyeucau">
              <table className="ttyc1">
                <thead>
                  <tr>                    
                    <th>Hạng mục/항목</th>
                    <th>Thông tin/정보</th>
                    <th>Hạng mục/항목</th>
                    <th>Thông tin/정보</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      Thời gian setting{" "}
                      {DATA.PROCESS_NUMBER === 1
                        ? request_codeinfo[0]?.EQ1
                        : DATA.PROCESS_NUMBER === 2
                          ? request_codeinfo[0]?.EQ2
                          : DATA.PROCESS_NUMBER === 3
                            ? request_codeinfo[0]?.EQ3
                            : DATA.PROCESS_NUMBER === 4
                              ? request_codeinfo[0]?.EQ4
                              : ""}
                    </td>
                    <td>
                      {DATA.PROCESS_NUMBER === 1
                        ? request_codeinfo[0]?.Setting1
                        : DATA.PROCESS_NUMBER === 2
                          ? request_codeinfo[0]?.Setting2
                          : DATA.PROCESS_NUMBER === 3
                            ? request_codeinfo[0]?.Setting3
                            : DATA.PROCESS_NUMBER === 4
                              ? request_codeinfo[0]?.Setting4
                              : ""}{" "}
                      minutes
                    </td>
                    <td>
                     Loss SX
                    </td>                   
                    <td>
                      {(DATA.PROCESS_NUMBER === 1
                        ? request_codeinfo[0]?.LOSS_SX1
                        : DATA.PROCESS_NUMBER === 2
                          ? request_codeinfo[0]?.LOSS_SX2
                          : DATA.PROCESS_NUMBER === 3
                            ? request_codeinfo[0]?.LOSS_SX3
                            : DATA.PROCESS_NUMBER === 4
                              ? request_codeinfo[0]?.LOSS_SX4
                              : 0).toLocaleString("en-US")}%/{((DATA.PROCESS_NUMBER === 1
                                ? request_codeinfo[0]?.LOSS_SX1
                                : DATA.PROCESS_NUMBER === 2
                                  ? request_codeinfo[0]?.LOSS_SX2
                                  : DATA.PROCESS_NUMBER === 3
                                    ? request_codeinfo[0]?.LOSS_SX3
                                    : DATA.PROCESS_NUMBER === 4
                                      ? request_codeinfo[0]?.LOSS_SX4
                                      : 0)*DATA.PLAN_QTY*(DATA.PD??0)/(DATA.CAVITY??0)/1000/100).toLocaleString('en-US',{maximumFractionDigits:1,minimumFractionDigits:1})}met
                     
                    </td>
                  </tr>
                  <tr>
                    <td>
                      UPH (EA/h) -{" "}
                      {DATA.PROCESS_NUMBER === 1
                        ? request_codeinfo[0]?.EQ1
                        : DATA.PROCESS_NUMBER === 2
                          ? request_codeinfo[0]?.EQ2
                          : DATA.PROCESS_NUMBER === 3
                            ? request_codeinfo[0]?.EQ3
                            : DATA.PROCESS_NUMBER === 4
                              ? request_codeinfo[0]?.EQ4
                              : ""}
                    </td>
                    <td>
                      {(DATA.PROCESS_NUMBER === 1
                        ? request_codeinfo[0]?.UPH1
                        : DATA.PROCESS_NUMBER === 2
                          ? request_codeinfo[0]?.UPH2
                          : DATA.PROCESS_NUMBER === 3
                            ? request_codeinfo[0]?.UPH3
                            : DATA.PROCESS_NUMBER === 4
                              ? request_codeinfo[0]?.UPH4
                              : 0).toLocaleString('en-US')}
                      EA/h -{" "}
                      {((DATA.PLAN_QTY /
                        (DATA.PROCESS_NUMBER === 1
                          ? request_codeinfo[0]?.UPH1
                          : DATA.PROCESS_NUMBER === 2
                            ? request_codeinfo[0]?.UPH2
                            : DATA.PROCESS_NUMBER === 3
                              ? request_codeinfo[0]?.UPH3
                              : DATA.PROCESS_NUMBER === 4
                                ? request_codeinfo[0]?.UPH4
                                : 0)) *
                        60).toLocaleString('en-US')}{" "}
                      minutes
                    </td>
                    <td>
                     Loss Setting
                    </td>                   
                    <td>
                      {DATA.PROCESS_NUMBER === 1
                        ? request_codeinfo[0]?.LOSS_SETTING1
                        : DATA.PROCESS_NUMBER === 2
                          ? request_codeinfo[0]?.LOSS_SETTING2
                          : DATA.PROCESS_NUMBER === 3
                            ? request_codeinfo[0]?.LOSS_SETTING3
                            : DATA.PROCESS_NUMBER === 4
                              ? request_codeinfo[0]?.LOSS_SETTING4
                              : ""} {" "}
                      met
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/*<div className='thongtinyeucau'>
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
        </div> */}
            { getCompany() === 'CMS' && <div className="text1">
              3. 중점 불량 Thông tin lỗi (Phân loại:{" "}
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
              )
              <Barcode
                value={`${DATA.PLAN_ID}`}
                format="CODE128"
                width={1.5}
                height={20}
                displayValue={false}
                background="#fff"
                lineColor="black"
                margin={0}
              />
              _{request_codeinfo[0]?.FSC === "Y" ? "(FSC Mix Credit)" : ""}{" "}
              POBALANCE: {po_balance?.toLocaleString("en-US")}{" "}
            </div>}
            {getCompany() === 'CMS' && <div className="thongtinyeucau">
              <table className="ttyc1">
                <thead>
                  <tr>
                    <th style={{width:'2%'}}>Worst</th>
                    <th style={{width:'10%'}}>Tên lỗi/불량명</th>
                    <th style={{width:'10%'}}>Hạng mục test/테스트 항목</th>
                    <th style={{position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                      <span>Phương pháp test/테스트 방법</span>
                      {defectProcessData.length > 0 && <FaStar color="red" size={25}/>}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {defectProcessData.map((element, index) => (
                    <tr key={index}>
                      <td style={{fontSize:'12px'}}>{element.STT}</td>
                      <td style={{fontSize:'12px'}}>{element.DEFECT}</td>
                      <td style={{fontSize:'12px'}}>{element.TEST_ITEM}</td>
                      <td style={{fontSize:'12px'}}>{element.TEST_METHOD}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>}

          {getCompany() !== 'CMS' && <div className="text1">
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
          </div>}
          {getCompany() !== 'CMS' && <div className="thongtinyeucau">
            <table className="ttyc1">
              <thead>
                <tr>                  
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
                  <tr>
                    <td style={{ height: "20px" }}></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
            </table>
          </div>}


            <div className="text1">
              4. 제품 정보 Thông tin vật liệu | Liệu chính{" "}
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
                        <th>WH Stock M/재고고 M</th>
                        <th>IQC Stock M/IQC 재고</th>
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
                          <td>{element.M_STOCK?.toLocaleString("en-US")}</td>
                          <td>{element.IQC_STOCK?.toLocaleString("en-US")}</td>                          
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
                        <th>WH Stock M/재고고 M</th>
                        <th>IQC Stock M/IQC 재고</th>
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
                                {(
                                  element.M_MET_QTY * element.M_QTY
                                ).toLocaleString("en-US")}{" "}
                                M
                              </td>
                              <td>{element.M_STOCK?.toLocaleString("en-US")}</td>
                              <td>{element.IQC_STOCK?.toLocaleString("en-US")}</td>   
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
                        <th>WH Stock M/재고고 M</th>
                        <th>IQC Stock M/IQC 재고</th>
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
                                {(
                                  element.M_MET_QTY * element.M_QTY
                                ).toLocaleString("en-US")}{" "}
                                M
                              </td>
                              <td>{element.M_STOCK?.toLocaleString("en-US")}</td>
                              <td>{element.IQC_STOCK?.toLocaleString("en-US")}</td>   
                              <td>{element.LIEUQL_SX}</td>
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
        {request_codeinfo[0].USE_YN!=='Y' && <div>Code đã khóa, liên hệ RND</div>}
      {!checkApprove() && <div>Yêu cầu chưa được QC Pass <br></br>
        Cụ thể: <br></br>
        Phê duyệt bản vẽ : {request_codeinfo[0].PDBV === 'Y' ? "Đã phê duyệt" : "Chưa phê duyệt, báo PQC"} <br></br>
        Sample hay không : {request_codeinfo[0].CODE_50 === '05' ? "Là Sample, chưa cần phê duyệt bản vẽ, nhưng cần khớp liệu chính trong BOM" : "Không phải sample"} <br></br>
        Liệu chính trong thông tin sp có khớp với liệu chính trong BOM : {checklieuchinh === true ? "Khớp" : "Không khớp, báo RnD (hoặc hỗ trợ sửa)"} <br></br>
      </div>}
      {DATA.CHOTBC === 'V' && <div>Chị thị chốt nhật ký rồi ko in lại nữa</div>}
      {!check_dinh_muc() && <div>Chưa đủ thông tin định mức</div>}
      {!checklieuqlsx && (
        <div>
          Chưa chỉ định liệu chính, hãy lưu liệu chỉ thị để đồng bộ liệu chính
          lên BOM
        </div>
      )}
      {DATA.PLAN_QTY === 0 && <div>Số lượng chỉ thị không thể = 0</div>}
      {DATA.PROCESS_NUMBER === 0 && (
        <div>PROCESS_NUMBER phải đặt 1,2,3 hoặc 4</div>
      )}
      {eq_process_check === false && <div>PROCESS_NUMBER sai</div>}
      {request_codeinfo[0].PL_HANG !== 'TT' && <div>Không chỉ thị sản xuất cho  hàng nguyên chiếc, báo lại kinh doanh</div>}
      {(M_CODEtrongBOM !== m_code_ycsx &&  m_code_ycsx !=='XXX') && <div>Liệu chính của cùng 1 ycsx không được thay đổi so với lần sản xuất trước</div>}
    </div>
  );
});
export default CHITHI_COMPONENT;

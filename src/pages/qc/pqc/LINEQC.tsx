import {
  Button, IconButton,
} from "@mui/material";
import moment from "moment";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { AiFillFileExcel, AiOutlineCloudUpload, AiOutlineSearch } from "react-icons/ai";
import Swal from "sweetalert2";
import { generalQuery, upload55Query, uploadQuery } from "../../../api/Api";
import { UserContext } from "../../../api/Context";
import {
  CustomResponsiveContainer,
  SaveExcel,
} from "../../../api/GlobalFunction";
import "./LINEQC.scss";
import { BiShow } from "react-icons/bi";
import { GrStatusGood } from "react-icons/gr";
import { FcCancel } from "react-icons/fc";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  CustomerListData,
  PQC1_DATA,
  SX_DATA,
  UserData,
} from "../../../api/GlobalInterface";

import html2canvas from 'html2canvas';
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { Html5QrcodeScanner } from 'html5-qrcode'

const LINEQC = () => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );
  const [file, setFile] = useState<any>(null);
  const [inputno, setInputNo] = useState("");
  const [lineqc_empl, setLineqc_empl] = useState(userData?.EMPL_NO ?? "");
  const [prod_leader_empl, setprod_leader_empl] = useState("");
  const [remark, setReMark] = useState("");
  const [empl_name, setEmplName] = useState("");
  const [empl_name2, setEmplName2] = useState("");
  const [g_name, setGName] = useState("");
  const [g_code, setGCode] = useState("");
  const [m_name, setM_Name] = useState("");
  const [width_cd, setWidthCD] = useState(0);
  const [in_cfm_qty, setInCFMQTY] = useState(0);
  const [roll_qty, setRollQty] = useState(0);
  const [m_code, setM_Code] = useState("");
  const [prodrequestno, setProdRequestNo] = useState("");
  const [planId, setPlanId] = useState("");
  const [prodreqdate, setProdReqDate] = useState("");
  const [process_lot_no, setProcessLotNo] = useState("");
  const [lieql_sx, setLieuQL_SX] = useState(0);
  const [out_date, setOut_Date] = useState("");
  const [factory, setFactory] = useState(
    userData?.FACTORY_CODE === 1 ? "NM1" : "NM2"
  );
  const [pqc1datatable, setPqc1DataTable] = useState<Array<PQC1_DATA>>([]);
  const [sx_data, setSXData] = useState<SX_DATA[]>([]);
  const [ktdtc, setKTDTC] = useState("CKT");
  const refArray = [useRef<any>(null), useRef<any>(null), useRef<any>(null), useRef<any>(null), useRef<any>(null)];
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextIndex = (index + 1) % refArray.length;
      refArray[nextIndex].current.focus();
    }
  };
  const checkKTDTC = (PROCESS_LOT_NO: string) => {
    generalQuery("checkktdtc", { PROCESS_LOT_NO: PROCESS_LOT_NO })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);
          if (response.data.data[0].TRANGTHAI !== null) {
            setKTDTC("DKT");
          } else {
            setKTDTC("CKT");
          }
        } else {
          setKTDTC("CKT");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const checkDataSX = (PLAN_ID: string) => {
    generalQuery("loadDataSX", {
      ALLTIME: true,
      FROM_DATE: "",
      TO_DATE: "",
      PROD_REQUEST_NO: "",
      PLAN_ID: PLAN_ID,
      M_NAME: "",
      M_CODE: "",
      G_NAME: "",
      G_CODE: "",
      FACTORY: "ALL",
      PLAN_EQ: "ALL",
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: SX_DATA[] = response.data.data.map(
            (element: SX_DATA, index: number) => {
              return {
                ...element,
                PLAN_DATE: moment.utc(element.PLAN_DATE).format("YYYY-MM-DD"),
                SETTING_START_TIME:
                  element.SETTING_START_TIME === null
                    ? ""
                    : moment
                      .utc(element.SETTING_START_TIME)
                      .format("YYYY-MM-DD HH:mm:ss"),
                MASS_START_TIME:
                  element.MASS_START_TIME === null
                    ? ""
                    : moment
                      .utc(element.MASS_START_TIME)
                      .format("YYYY-MM-DD HH:mm:ss"),
                MASS_END_TIME:
                  element.MASS_END_TIME === null
                    ? ""
                    : moment
                      .utc(element.MASS_END_TIME)
                      .format("YYYY-MM-DD HH:mm:ss"),
                SX_DATE:
                  element.SX_DATE === null
                    ? ""
                    : moment.utc(element.SX_DATE).format("YYYY-MM-DD"),
                id: index,
              };
            }
          );
          //console.log(loaded_data);
          setSXData(loaded_data);
          checkPlanIDP501(loaded_data);
        } else {
          setSXData([]);
          Swal.fire("Thông báo", " Có lỗi : " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const checkPLAN_ID_Checksheet = async (plan_id: string) => {
    let STT: number = 1;
    await generalQuery("checkPlanIdChecksheet", { PLAN_ID: plan_id })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);
          let img_stt = response.data.data[0];
          if (img_stt.IMG_3 === 'Y') {
            STT = 4;
          } else if (img_stt.IMG_2 === 'Y') {
            STT = 3;
          } else if (img_stt.IMG_1 === 'Y') {
            STT = 2;
          } else {
            STT = 1;
          }
        } else {
          STT = 1;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return STT;
  }
  const uploadFile2 = async (PLAN_ID: string, STT: number) => {
    console.log(file);
    uploadQuery(file, PLAN_ID + "_" + STT + ".jpg", "lineqc")
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          Swal.fire(
            "Thông báo",
            "Upload file thành công",
            "success"
          );
        } else {
          Swal.fire(
            "Thông báo",
            "Upload file thất bại:" + response.data.message,
            "error"
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const checkEMPL_NAME = (selection: number, EMPL_NO: string) => {
    generalQuery("checkEMPL_NO_mobile", { EMPL_NO: EMPL_NO })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);\
          if (selection === 1) {
            setEmplName(
              response.data.data[0].MIDLAST_NAME +
              " " +
              response.data.data[0].FIRST_NAME
            );
          } else {
            setEmplName2(
              response.data.data[0].MIDLAST_NAME +
              " " +
              response.data.data[0].FIRST_NAME
            );
          }
        } else {
          setEmplName("");
          setEmplName2("");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const checkPlanID = (PLAN_ID: string) => {
    generalQuery("checkPLAN_ID", { PLAN_ID: PLAN_ID })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);
          setPlanId(PLAN_ID);
          setGName(response.data.data[0].G_NAME);
          setProdRequestNo(response.data.data[0].PROD_REQUEST_NO);
          setProdReqDate(response.data.data[0].PROD_REQUEST_DATE);
          setGCode(response.data.data[0].G_CODE);
        } else {
          setProdRequestNo("");
          setGName("");
          setProdReqDate("");
          setGCode("");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const checkPlanIDP501 = (SXDATA: SX_DATA[]) => {
    generalQuery("checkPlanIdP501", { PLAN_ID: SXDATA[0].PLAN_ID })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);
          setInputNo(response.data.data[0].M_LOT_NO);
          checkLotNVL(response.data.data[0].M_LOT_NO);
          setProcessLotNo(response.data.data[0].PROCESS_LOT_NO);
        } else {
          if (SXDATA[0].PROCESS_NUMBER === 0) {
            setInputNo("");
            setProcessLotNo("");
          } else {
            generalQuery("checkProcessLotNo_Prod_Req_No", {
              PROD_REQUEST_NO: SXDATA[0].PROD_REQUEST_NO,
            })
              .then((response) => {
                if (response.data.tk_status !== "NG") {
                  setInputNo(response.data.data[0].M_LOT_NO);
                  checkLotNVL(response.data.data[0].M_LOT_NO);
                  setProcessLotNo(response.data.data[0].PROCESS_LOT_NO);
                } else {
                  setInputNo("");
                  setProcessLotNo("");
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const checkLotNVL = (M_LOT_NO: string) => {
    generalQuery("checkMNAMEfromLot", { M_LOT_NO: M_LOT_NO })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);
          setM_Name(
            response.data.data[0].M_NAME +
            " | " +
            response.data.data[0].WIDTH_CD
          );
          setM_Code(response.data.data[0].M_CODE);
          setWidthCD(response.data.data[0].WIDTH_CD);
          setInCFMQTY(response.data.data[0].OUT_CFM_QTY);
          setRollQty(response.data.data[0].ROLL_QTY);
          setLieuQL_SX(
            response.data.data[0].LIEUQL_SX === null
              ? "0"
              : response.data.data[0].LIEUQL_SX
          );
          setOut_Date(response.data.data[0].OUT_DATE);
        } else {
          setM_Name("");
          setM_Code("");
          setWidthCD(0);
          setRollQty(0);
          setInCFMQTY(0);
          setLieuQL_SX(0);
          setOut_Date("");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const inputDataPqc1 = async () => {
    let checkplid: number = await checkPLAN_ID_Checksheet(planId)
    if (sx_data[0].EQ_NAME_TT !== null) {
      if (checkplid === 1) {
        await generalQuery("insert_pqc1", {
          PROCESS_LOT_NO: process_lot_no?.toUpperCase(),
          LINEQC_PIC: lineqc_empl?.toUpperCase(),
          PROD_PIC: sx_data[0].INS_EMPL?.toUpperCase(),
          PROD_LEADER: prod_leader_empl?.toUpperCase(),
          STEPS: sx_data[0].STEP,
          CAVITY: sx_data[0].CAVITY,
          SETTING_OK_TIME: sx_data[0].MASS_START_TIME,
          FACTORY: sx_data[0].PLAN_FACTORY,
          REMARK: ktdtc,
          PROD_REQUEST_NO: sx_data[0].PROD_REQUEST_NO?.toUpperCase(),
          G_CODE: sx_data[0].G_CODE,
          PLAN_ID: sx_data[0].PLAN_ID?.toUpperCase(),
          PROCESS_NUMBER: sx_data[0].PROCESS_NUMBER,
          LINE_NO: sx_data[0].EQ_NAME_TT,
          REMARK2: remark,
        })
          .then((response) => {
            if (response.data.tk_status !== "NG") {
              setPlanId('');
              setReMark('');
              setSXData([]);
              updateIMGPQC1(planId);
            } else {
              updateIMGPQC1(planId);
              console.log("Có lỗi: " + response.data.message);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
      else {
        updateIMGPQC1(planId);
      }
    }
    else {
      Swal.fire('Thông báo', "Chỉ thị đã được bắn setting hay chưa ?", "warning");
    }
  };
  const updateIMGPQC1 = async (PLAN_ID: string) => {
    let stt: number = await checkPLAN_ID_Checksheet(PLAN_ID);
    if (stt < 4) {
      await generalQuery("update_checksheet_image_status", {
        PLAN_ID: planId.toUpperCase(),
        STT: stt,
      })
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            //console.log(response.data.data);
            Swal.fire("Thông báo", "Input data thành công", "success");
            setPlanId('');
            setReMark('');
            setSXData([]);
            uploadFile2(planId.toUpperCase(), stt);
          } else {
            Swal.fire("Cảnh báo", "Có lỗi: " + response.data.message, "error");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    else {
      Swal.fire("Cảnh báo", "Đã up đủ đầu giữa cuối rồi", "error");
    }
  }
  const checkInput = (): boolean => {
    if (
      planId !== "" &&
      lineqc_empl !== "" &&
      sx_data.length !== 0 &&
      sx_data[0].MASS_START_TIME !== ""
    ) {
      return true;
    } else {
      return false;
    }
  };

  const [dataUri, setDataUri] = useState<string | null>(null);
  const [cameraDevices, setCameraDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedCameraIndex, setSelectedCameraIndex] = useState<number>(0);
  const [key, setKey] = useState<number>(0);

  const handleTakePhotoAnimationDone = (dataUri: string) => {
    setDataUri(dataUri);
  };

  const handleDownload = () => {
    if (dataUri) {
      const link = document.createElement('a');
      link.href = dataUri;
      link.download = 'captured_image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleCameraSwitch = () => {
    setSelectedCameraIndex((prevIndex) => (prevIndex + 1) % cameraDevices.length);
    setKey((prevKey) => prevKey + 1); // Update the key to force re-render
  };

  const getCameraDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      console.log(devices);
      const cameras = devices.filter(device => device.kind === 'videoinput');      
      let kk  = cameras[0]?.getCapabilities();
      console.log('kk',kk)
      setCameraDevices(cameras);
    } catch (error) {
      console.error('Error getting camera devices:', error);
    }
  };

  const [scanResult, setScanResult] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const scanner = useRef<any>(null);
  function success(result: string) {
    scanner.current.clear();     
    if (result.length >= 8) {
      checkPlanID(result);
      checkDataSX(result);
    } else {
      setSXData([]);
      setInputNo("");
      setProcessLotNo("");
    }
    setPlanId(result); 
    setShowScanner(false);
  }
  function error(err: string) {
    //console.log(err)
  }
  const startRender = () => {
    scanner.current.render(success, error);
  }

  const startScanner = () => {
    scanner.current = new Html5QrcodeScanner('reader', {      
      qrbox: {
        width: 300,
        height: 300
      },
      fps: 1,
      rememberLastUsedCamera: true,
      showTorchButtonIfSupported: true,
    }, false);
  }

  useEffect(() => {
    getCameraDevices();   
    startScanner();
    return ()=> {
      scanner.current.clear();       
    }    
  }, []);

  return (
    <div className="lineqc">
      <div className="tracuuDataInspection">  
        {/* <div>
          <h2>Camera Capture</h2>
          {cameraDevices.length > 1 && (
            <button onClick={handleCameraSwitch}>Switch Camera {selectedCameraIndex}</button>
          )}
          <Camera
            key={key}
            onTakePhotoAnimationDone={handleTakePhotoAnimationDone}       
            isImageMirror={false}
            imageType={IMAGE_TYPES.JPG}
            isFullscreen= {false}
            isMaxResolution ={true}
            idealFacingMode={ cameraDevices[selectedCameraIndex]?.facingMode ||FACING_MODES.ENVIRONMENT}
            
          />
          {dataUri && (
            <div>
              <img src={dataUri} alt="Captured" width={`400px`} height={'300px'} />
              <button onClick={handleDownload}>Download Image</button>
            </div>
          )}
        </div> */}

        <div className="inputform">
          <div className="tracuuDataInspectionform">
            <b style={{ color: "blue" }}> NHẬP THÔNG TIN</b>
            <div className="forminput">
              <div className="forminputcolumn">
                <label>
                  <b>FACTORY</b>
                  <select
                    disabled={userData?.EMPL_NO !== "NHU1903"}
                    name="factory"
                    value={factory}
                    onChange={(e) => {
                      setFactory(e.target.value);
                    }}
                  >
                    <option value="NM1">NM1</option>
                    <option value="NM2">NM2</option>
                  </select>
                </label>
                <label>
                  <b>Số CTSX</b>
                  <button onClick={() => {
                      setShowScanner(true);
                      setScanResult('');
                      startRender();
                    }}>Scan</button>
                  <button onClick={() => {
                      scanner.current.clear();
                      setShowScanner(false);
                    }}>Tắt Scan</button>
                  <div className="scanQR" style={{display:`${showScanner? 'block':'none'}`}}> 
                    <div id="reader"></div>
                  </div>
                  <input
                    ref={refArray[0]}
                    type="text"
                    placeholder=""
                    value={planId}
                    onKeyDown={(e) => {
                      handleKeyDown(e, 0);
                    }}
                    onChange={(e) => {
                      if (e.target.value.length >= 8) {
                        checkPlanID(e.target.value);
                        checkDataSX(e.target.value);
                      } else {
                        setSXData([]);
                        setInputNo("");
                        setProcessLotNo("");
                      }
                      setPlanId(e.target.value);
                    }}
                  ></input>
                </label>
                {g_name && (
                  <span
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: "bold",
                      color: "red",
                    }}
                  >
                    {g_name} | {process_lot_no}
                  </span>
                )}
                <label>
                  <b>Mã LINEQC</b>
                  <input
                    disabled={userData?.EMPL_NO !== 'NHU1903'}
                    ref={refArray[1]}
                    onKeyDown={(e) => {
                      handleKeyDown(e, 1);
                    }}
                    type="text"
                    placeholder={""}
                    value={lineqc_empl}
                    onChange={(e) => {
                      if (e.target.value.length >= 7) {
                        checkEMPL_NAME(1, e.target.value);
                      }
                      setLineqc_empl(e.target.value);
                    }}
                  ></input>
                </label>
                {lineqc_empl && (
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: "bold",
                      color: "red",
                    }}
                  >
                    {empl_name}
                  </span>
                )}
                {/* <label>
                  <b>Mã Leader SX</b>
                  <input
                    ref={refArray[2]}
                    onKeyDown={(e) => {
                      handleKeyDown(e, 2);
                    }}
                    type="text"
                    placeholder={""}
                    value={prod_leader_empl}
                    onChange={(e) => {
                      if (e.target.value.length >= 7) {
                        checkEMPL_NAME(2, e.target.value);
                      }
                      setprod_leader_empl(e.target.value);
                    }}
                  ></input>
                </label> */}
                {prod_leader_empl && (
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: "bold",
                      color: "red",
                    }}
                  >
                    {empl_name2}
                  </span>
                )}
                {false && <label>
                  <b>Remark</b>
                  <input
                    ref={refArray[3]}
                    onKeyDown={(e) => {
                      handleKeyDown(e, 3);
                    }}
                    type="text"
                    placeholder={"Ghi chú"}
                    value={remark}
                    onChange={(e) => {
                      setReMark(e.target.value);
                    }}
                  ></input>
                </label>}
                <label>
                  <b>Chọn ảnh checksheet</b>
                  <input
                    accept='.jpg'
                    type='file'
                    onChange={(e: any) => {
                      setFile(e.target.files[0]);
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="inputbutton">
            <div className="forminputcolumn">
              <Button
                disabled={sx_data.length === 0}
                ref={refArray[4]}
                onKeyDown={(e) => {
                }}
                color={"primary"}
                variant="contained"
                size="large"
                sx={{
                  fontSize: "0.7rem",
                  padding: "3px",
                  backgroundColor: "#756DFA",
                }}
                onClick={() => {
                  console.log(inputno)
                  console.log(planId)
                  console.log(lineqc_empl)
                  console.log(sx_data)
                  if (checkInput()) {
                    refArray[0].current.focus();
                    inputDataPqc1();
                  } else {
                    refArray[0].current.focus();
                    Swal.fire(
                      "Thông báo",
                      "Hãy nhập đủ thông tin trước khi input",
                      "error"
                    );
                    refArray[0].current.focus();
                  }
                }}
              >
                Input Data
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LINEQC;

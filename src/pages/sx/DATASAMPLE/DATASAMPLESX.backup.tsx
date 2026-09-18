import { Button } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { generalQuery, uploadQuery } from "../../../api/Api";
import "./DATASAMPLESX.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { UserData } from "../../../api/GlobalInterface";
import 'react-html5-camera-photo/build/css/index.css';
import { Html5QrcodeScanner } from 'html5-qrcode'

const DATASAMPLESX = () => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );
  const [file, setFile] = useState<any>(null);
  const [file2, setFile2] = useState<any>(null);
  const [lineqc_empl, setLineqc_empl] = useState(userData?.EMPL_NO ?? "");
  const [empl_name, setEmplName] = useState("");
  const [g_name, setGName] = useState("");
  const [g_code, setGCode] = useState("");
  const [planId, setPlanId] = useState("");

  const refArray = [useRef<any>(null), useRef<any>(null), useRef<any>(null), useRef<any>(null), useRef<any>(null)];
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextIndex = (index + 1) % refArray.length;
      refArray[nextIndex].current.focus();
    }
  };

  const updateBanVeSampleData = async (SX_SP_ID: number) => {
    await generalQuery("updatebanvesampledata", {
      SX_SP_ID: SX_SP_ID,
      BANVE: 'Y',
      BANVE_EXT: 'jpg',
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          Swal.fire("Thông báo", "Update ban ve thành công", "success");
        } else {
          Swal.fire("Cảnh báo", "Có lỗi d: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const updateAnhDKSXSampleData = async (SX_SP_ID: number) => {
    await generalQuery("updateAnhDKSXSampleData", {
      SX_SP_ID: SX_SP_ID,
      DKSX:'Y',
      DKSX_EXT:'jpg',
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          Swal.fire("Thông báo", "Update anh bao cao thành công", "success");
        } else {
          Swal.fire("Cảnh báo", "Có lỗi d: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const uploadFile = async (SX_SP_ID: number, PLAN_ID: string) => {
    console.log(file);
    uploadQuery(file, SX_SP_ID + "_" + PLAN_ID + "PIC1" + ".jpg", "SX_QL_SAMPLE")
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          updateBanVeSampleData(SX_SP_ID);          
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
  const uploadFile2 = async (SX_SP_ID: number, PLAN_ID: string) => {
    console.log(file2);
    uploadQuery(file2, SX_SP_ID + "_" + PLAN_ID + "PIC2" + ".jpg", "SX_QL_SAMPLE")
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          updateAnhDKSXSampleData(SX_SP_ID);          
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
  const checkEMPL_NAME = (EMPL_NO: string) => {
    generalQuery("checkEMPL_NO_mobile", { EMPL_NO: EMPL_NO })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);
        
            setEmplName(
              response.data.data[0].MIDLAST_NAME +
              " " +
              response.data.data[0].FIRST_NAME
            );
          
        } else {
          setEmplName("");         
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
          setGCode(response.data.data[0].G_CODE);
        } else {
          setGName("");
          setGCode("");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };


  const inputDataSampleSX = async () => {
    await generalQuery("insert_sampledatasx", {
      G_CODE: g_code,
      PLAN_ID: planId,
      G_NAME_HT: g_name, 
      BANVE: 'N',
      DKSX: 'N',
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          setPlanId('');        
          uploadFile(response.data.data[0].SX_SP_ID, planId.toUpperCase());
          uploadFile2(response.data.data[0].SX_SP_ID, planId.toUpperCase());        
        } else {
         
          console.log("Có lỗi r: " + response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    
  }

  const checkInput = (): boolean => {
    if (
      planId !== "" &&
      lineqc_empl !== ""
    ) {
      return true;
    } else {
      return false;
    }
  };


  const getCameraDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      console.log(devices);
      const cameras = devices.filter(device => device.kind === 'videoinput'); 
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
    } else {     
    
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
    <div className="datasamplesx">
      <div className="tracuuDataInspection">
        <div className="inputform">
          <div className="tracuuDataInspectionform">
            <b style={{ color: "blue" }}> NHẬP THÔNG TIN</b>
            <div className="forminput">
              <div className="forminputcolumn">                
                <label>
                  <b>Số chỉ thị: </b>
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
                      } else {                                     
                     
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
                    {g_name} | {g_code}
                  </span>
                )}
                <label>
                  <b>Mã nhân viên</b>
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
                        checkEMPL_NAME(e.target.value);
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
               
             
                <label>
                  <b>Chọn ảnh bản vẽ sản xuất sample</b>
                  <input
                    accept='.jpg'
                    type='file'
                    onChange={(e: any) => {
                      setFile(e.target.files[0]);
                    }}
                  />
                </label>
                <label>
                  <b>Chọn ảnh checksheet điều kiện sản xuất</b>
                  <input
                    accept='.jpg'
                    type='file'
                    onChange={(e: any) => {
                      setFile2(e.target.files[0]);
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="inputbutton">
            <div className="forminputcolumn">
              <Button
                disabled={g_name === ""}
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
                  if (checkInput()) {
                    refArray[0].current.focus();                    
                    inputDataSampleSX();
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
export default DATASAMPLESX;

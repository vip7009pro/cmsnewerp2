import { Button, IconButton } from "@mui/material";
import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import Swal from "sweetalert2";
import { generalQuery } from "../../../api/Api";
import "./PQC1.scss";
import { BiShow } from "react-icons/bi";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { PQC1_DATA, SX_DATA, UserData } from "../../../api/GlobalInterface";
import AGTable from "../../../components/DataTable/AGTable";
const PQC1 = () => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [inputno, setInputNo] = useState("");
  const [lineqc_empl, setLineqc_empl] = useState("");
  const [prod_leader_empl, setprod_leader_empl] = useState("");
  const [remark, setReMark] = useState("");
  const [inspectiondatatable, setInspectionDataTable] = useState<Array<any>>(
    []
  );
  const selectedRowsDataA = useRef<Array<PQC1_DATA>>([]);
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
  const [showhideinput, setShowHideInput] = useState(true);
  const [cust_cd, setCust_Cd] = useState("6969");
  const [factory, setFactory] = useState(
    userData?.FACTORY_CODE === 1 ? "NM1" : "NM2"
  );
  const [pqc1datatable, setPqc1DataTable] = useState<Array<PQC1_DATA>>([]);
  const [sx_data, setSXData] = useState<SX_DATA[]>([]);
  const [ktdtc, setKTDTC] = useState("CKT");
  const refArray = [useRef<any>(null), useRef<any>(null), useRef<any>(null), useRef<any>(null), useRef<any>(null)];
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Enter") {
      // console.log('press enter')
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
          Swal.fire("Thông báo", " Có lỗi : " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const column_TRA_PQC1_DATA = [
    { field: "PQC1_ID", headerName: "PQC1_ID", width: 80 },
    { field: "YEAR_WEEK", headerName: "YEAR_WEEK", width: 80 },
    { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 120 },
    { field: "PROD_REQUEST_NO", headerName: "PROD_REQUEST_NO", width: 80 },
    { field: "PROD_REQUEST_QTY", headerName: "PROD_REQUEST_QTY", width: 80 },
    { field: "PROD_REQUEST_DATE", headerName: "PROD_REQUEST_DATE", width: 80 },
    { field: "PLAN_ID", headerName: "PLAN_ID", width: 80 },
    { field: "PROCESS_LOT_NO", headerName: "PROCESS_LOT_NO", width: 80 },
    { field: "G_NAME", headerName: "G_NAME", width: 250 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 120 },
    { field: "LINEQC_PIC", headerName: "LINEQC_PIC", width: 80 },
    { field: "PROD_PIC", headerName: "PROD_PIC", width: 80 },
    { field: "PROD_LEADER", headerName: "PROD_LEADER", width: 80 },
    { field: "LINE_NO", headerName: "LINE_NO", width: 80 },
    { field: "STEPS", headerName: "STEPS", width: 80 },
    { field: "CAVITY", headerName: "CAVITY", width: 80 },
    {
      field: "SETTING_OK_TIME",
      cellDataType: "text",
      headerName: "SETTING_OK_TIME",
      width: 180,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {moment
              .utc(params.data.SETTING_OK_TIME)
              .format("YYYY-MM-DD HH:mm:ss")}
          </span>
        );
      },
    },
    { field: "FACTORY", headerName: "FACTORY", width: 80 },
    { field: "INSPECT_SAMPLE_QTY", headerName: "SAMPLE_QTY", width: 100 },
    { field: "PROD_LAST_PRICE", headerName: "PRICE", width: 80 },
    {
      field: "SAMPLE_AMOUNT",
      headerName: "SAMPLE_AMOUNT",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "gray" }}>
            <b>
              {params.data.SAMPLE_AMOUNT?.toLocaleString("en-US", {
                style: "decimal",
                maximumFractionDigits: 8,
              })}
            </b>
          </span>
        );
      },
    },
    { field: "REMARK", headerName: "REMARK", width: 80 },
    { field: "PQC3_ID", headerName: "PQC3_ID", width: 80 },
    { field: "OCCURR_TIME", headerName: "OCCURR_TIME", width: 150 },
    { field: "INSPECT_QTY", headerName: "INSPECT_QTY", width: 120 },
    { field: "DEFECT_QTY", headerName: "DEFECT_QTY", width: 120 },
    {
      field: "DEFECT_RATE",
      headerName: "DEFECT_RATE",
      width: 120,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            {params.data.DEFECT_RATE?.toLocaleString("en-US", {
              maximumFractionDigits: 0,
            })}
            %
          </span>
        );
      },
    },
    { field: "DEFECT_PHENOMENON", headerName: "DEFECT_PHENOMENON", width: 150 },
    {
      field: "INS_DATE",
      cellDataType: "text",
      headerName: "INS_DATE",
      width: 180,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {moment.utc(params.data.INS_DATE).format("YYYY-MM-DD HH:mm:ss")}
          </span>
        );
      },
    },
    {
      field: "UPD_DATE",
      cellDataType: "text",
      headerName: "UPD_DATE",
      width: 180,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {moment.utc(params.data.UPD_DATE).format("YYYY-MM-DD HH:mm:ss")}
          </span>
        );
      },
    },
    {
      field: "IMG_1",
      headerName: "IMG_1",
      width: 100,
      cellRenderer: (params: any) => {
        let href_link = `/lineqc/${params.data.PLAN_ID}_1.jpg`
        if (params.data.IMG_1 ?? false) {
          return (
            <span style={{ color: "blue" }}>
              <a target="_blank" rel="noopener noreferrer" href={href_link}>
                LINK
              </a>
            </span>
          );
        }
        else {
          return (
            <span style={{ color: "blue" }}>
              NO
            </span>
          );
        }
      },
    },
    {
      field: "IMG_2",
      headerName: "IMG_2",
      width: 100,
      cellRenderer: (params: any) => {
        let href_link = `/lineqc/${params.data.PLAN_ID}_2.jpg`
        if (params.data.IMG_2 ?? false) {
          return (
            <span style={{ color: "blue" }}>
              <a target="_blank" rel="noopener noreferrer" href={href_link}>
                LINK
              </a>
            </span>
          );
        }
        else {
          return (
            <span style={{ color: "blue" }}>
              NO
            </span>
          );
        }
      },
    },
    {
      field: "IMG_3",
      headerName: "IMG_3",
      width: 100,
      cellRenderer: (params: any) => {
        let href_link = `/lineqc/${params.data.PLAN_ID}_3.jpg`
        if (params.data.IMG_3 ?? false) {
          return (
            <span style={{ color: "blue" }}>
              <a target="_blank" rel="noopener noreferrer" href={href_link}>
                LINK
              </a>
            </span>
          );
        }
        else {
          return (
            <span style={{ color: "blue" }}>
              NO
            </span>
          );
        }
      },
    },
  ];
  const pqc1DataTable2 = useMemo(() =>
    <AGTable
      suppressRowClickSelection={false}
      showFilter={true}
      toolbar={
        <>
        <IconButton
            className="buttonIcon"
            onClick={() => {
              setShowHideInput((pre) => !pre);
              setInspectionDataTable([]);
            }}
          >
            <BiShow color="blue" size={15} />
            Show/Hide Input
          </IconButton>
          <IconButton
            className="buttonIcon"
            onClick={() => {
              traPQC1Data();
              //setShowHideInput(false);
            }}
          >
            <AiOutlineSearch color="red" size={15} />
            Tra Data
          </IconButton>
        </>
      }
      columns={column_TRA_PQC1_DATA}
      data={pqc1datatable}
      onCellEditingStopped={(params: any) => {
        //console.log(e.data)
      }} onRowClick={(params: any) => {
        //clickedRow.current = params.data;
        //console.log(e.data) 
      }} onSelectionChange={(params: any) => {
        //console.log(params)
        //setSelectedRows(params!.api.getSelectedRows()[0]);
        //console.log(e!.api.getSelectedRows())
        selectedRowsDataA.current = params!.api.getSelectedRows();
      }}
    />
    , [pqc1datatable]);

  const traPQC1Data = () => {
    generalQuery("trapqc1data", {
      ALLTIME: false,
      FROM_DATE: moment().add(-2, "day").format("YYYY-MM-DD"),
      TO_DATE: moment().format("YYYY-MM-DD"),
      CUST_NAME: "",
      PROCESS_LOT_NO: "",
      G_CODE: "",
      G_NAME: "",
      PROD_TYPE: "",
      EMPL_NAME: "",
      PROD_REQUEST_NO: "",
      ID: "",
      FACTORY: userData?.FACTORY_CODE === 1 ? "NM1" : "NM2",
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: PQC1_DATA[] = response.data.data.map(
            (element: PQC1_DATA, index: number) => {
              //summaryInput += element.INPUT_QTY_EA;
              return {
                ...element,
                INS_DATE: moment
                  .utc(element.INS_DATE)
                  .format("YYYY-MM-DD HH:mm:ss"),
                UPD_DATE: moment
                  .utc(element.UPD_DATE)
                  .format("YYYY-MM-DD HH:mm:ss"),
                SETTING_OK_TIME: moment
                  .utc(element.SETTING_OK_TIME)
                  .format("YYYY-MM-DD HH:mm:ss"),
                id: index,
              };
            }
          );
          //setSummaryInspect('Tổng Nhập: ' +  summaryInput.toLocaleString('en-US') + 'EA');
          setPqc1DataTable(loadeddata);
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
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
  const checkProcessLotNo = (PROCESS_LOT_NO: string) => {
    generalQuery("checkPROCESS_LOT_NO", { PROCESS_LOT_NO: PROCESS_LOT_NO })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);
          setPlanId(response.data.data[0].PLAN_ID);
          checkPlanID(response.data.data[0].PLAN_ID);
        } else {
          setPlanId("");
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
          checkKTDTC(response.data.data[0].PROCESS_LOT_NO);
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
                  //console.log(response.data.data);
                  setInputNo(response.data.data[0].M_LOT_NO);
                  checkLotNVL(response.data.data[0].M_LOT_NO);
                  setProcessLotNo(response.data.data[0].PROCESS_LOT_NO);
                  checkKTDTC(response.data.data[0].PROCESS_LOT_NO);
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
  const inputDataPqc1 = () => {
    generalQuery("insert_pqc1", {
      PROCESS_LOT_NO: process_lot_no.toUpperCase(),
      LINEQC_PIC: lineqc_empl.toUpperCase(),
      PROD_PIC: sx_data[0].INS_EMPL.toUpperCase(),
      PROD_LEADER: prod_leader_empl.toUpperCase(),
      STEPS: sx_data[0].STEP,
      CAVITY: sx_data[0].CAVITY,
      SETTING_OK_TIME: sx_data[0].MASS_START_TIME,
      FACTORY: sx_data[0].PLAN_FACTORY,
      REMARK: ktdtc,
      PROD_REQUEST_NO: sx_data[0].PROD_REQUEST_NO,
      G_CODE: sx_data[0].G_CODE,
      PLAN_ID: sx_data[0].PLAN_ID.toUpperCase(),
      PROCESS_NUMBER: sx_data[0].PROCESS_NUMBER,
      LINE_NO: sx_data[0].EQ_NAME_TT,
      REMARK2: remark,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);
          Swal.fire("Thông báo", "Input data thành công", "success");
          traPQC1Data();
          setPlanId('');
          setLineqc_empl('');
          setReMark('');
        } else {
          Swal.fire("Cảnh báo", "Có lỗi: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const checkInput = (): boolean => {
    if (
      inputno !== "" &&
      planId !== "" &&
      lineqc_empl !== "" &&
      sx_data.length !== 0 &&
      process_lot_no !== ""
    ) {
      return true;
    } else {
      return false;
    }
  };
  const updateSampleQty = async () => {
    if (selectedRowsDataA.current.length > 0) {
      let err_code: string = '';
      for (let i = 0; i < selectedRowsDataA.current.length; i++) {
        await generalQuery("updatepqc1sampleqty", {
          PQC1_ID: selectedRowsDataA.current[i].PQC1_ID,
          INSPECT_SAMPLE_QTY: selectedRowsDataA.current[i].INSPECT_SAMPLE_QTY
        })
          .then((response) => {
            if (response.data.tk_status !== "NG") {
            } else {
              err_code += '|   ' + response.data.message + ', ';
              //Swal.fire("Cảnh báo", "Có lỗi: " + response.data.message, "error");
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
      if (err_code === '') {
        Swal.fire("Thông báo", "Update sample qty thành công", "success");
      }
      else {
        Swal.fire("Cảnh báo", "Có lỗi: " + err_code, "error");
      }
    }
    else {
      Swal.fire("Cảnh báo", "Có lỗi: Chọn ít nhất 1 dòng để update", "error");
    }
  }
  useEffect(() => {
    traPQC1Data();
    ///handletraFailingData();
  }, []);
  return (
    <div className="pqc1">
      <div className="tracuuDataInspection">
        <div className="inputform">         
            <div className="tracuuDataInspectionform" style={{ backgroundImage: theme.CMS.backgroundImage }}>
              <b style={{ color: "blue" }}> {lineqc_empl && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: "bold",
                    color: "red",
                  }}
                >
                  {empl_name}
                </span>
              )}|NHẬP THÔNG TIN SETTING|  {prod_leader_empl && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: "bold",
                    color: "red",
                  }}
                >
                  {empl_name2}
                </span>
              )}</b>
              <div className="forminput">
                <div className="forminputcolumn">
                  <label>
                    <b>FACTORY</b>
                    <select
                      disabled={userData?.EMPL_NO === "NHU1903"}
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
                    <b>Số chỉ thị sản xuất</b>
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
                </div>
                <div className="forminputcolumn">
                  <label>
                    <b>Mã LINEQC</b>
                    <input
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
                  <label>
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
                  </label>
                </div>
                <div className="forminputcolumn">
                  <label>
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
                  </label>
                  <Button
                    ref={refArray[4]}
                    onKeyDown={(e) => {
                      //handleKeyDown(e,4);
                    }}
                    color={"primary"}
                    variant="contained"
                    size="small"
                    sx={{
                      fontSize: "0.7rem",
                      padding: "3px",
                      backgroundColor: "#756DFA",
                    }}
                    onClick={() => {
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
                  <Button
                    color={"primary"}
                    variant="contained"
                    size="small"
                    sx={{
                      fontSize: "0.7rem",
                      padding: "3px",
                      backgroundColor: "#02ac2c",
                    }}
                    onClick={() => {
                      updateSampleQty();
                      refArray[0].current.focus();
                    }}
                  >
                    Update QTY
                  </Button>
                </div>
              </div>
            </div>         
        </div>
        <div className="maintable">
          {showhideinput && (
            <div className="tracuuDataInspectionform2" style={{ backgroundImage: theme.CMS.backgroundImage }} >
              <b style={{ color: "blue" }}>THÔNG TIN CHỈ THỊ</b>
              <div className="forminput">
                <div className="forminputcolumn">
                  <label>
                    <b style={{ color: "gray" }}>LOT SX</b>
                    <input
                      disabled={true}
                      type="text"
                      value={process_lot_no}
                      onChange={(e) => {
                        if (e.target.value.length >= 7) {
                          checkProcessLotNo(e.target.value);
                        }
                        setProcessLotNo(e.target.value);
                      }}
                    ></input>
                  </label>
                  {g_name && (
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: "bold",
                        color: "blue",
                      }}
                    >
                      {g_name}
                    </span>
                  )}
                  <label>
                    <b style={{ color: "gray" }}>LOT NVL</b>
                    <input
                      disabled={true}
                      type="text"
                      value={inputno}
                      onChange={(e) => {
                        //console.log(e.target.value.length);
                        if (e.target.value.length >= 7) {
                          //console.log(e.target.value);
                          checkLotNVL(e.target.value);
                        }
                        setInputNo(e.target.value);
                      }}
                    ></input>
                  </label>
                  {m_name && (
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: "bold",
                        color: "blue",
                      }}
                    >
                      {m_name}
                    </span>
                  )}
                </div>
                <div className="forminputcolumn">
                  <label>
                    <b style={{ color: "gray" }}>LINE NO</b>
                    <input
                      disabled={true}
                      type="text"
                      value={
                        sx_data[0] !== undefined ? sx_data[0]?.EQ_NAME_TT : ""
                      }
                      onChange={(e) => { }}
                    ></input>
                  </label>
                  <label>
                    <b style={{ color: "gray" }}>Công Đoạn</b>
                    <input
                      disabled={true}
                      type="text"
                      value={
                        sx_data[0] !== undefined
                          ? sx_data[0]?.PROCESS_NUMBER
                          : ""
                      }
                      onChange={(e) => { }}
                    ></input>
                  </label>
                </div>
                <div className="forminputcolumn">
                  <label>
                    <b style={{ color: "gray" }}>STEP</b>
                    <input
                      disabled={true}
                      type="text"
                      value={sx_data[0] !== undefined ? sx_data[0]?.STEP : ""}
                      onChange={(e) => { }}
                    ></input>
                  </label>
                  <label>
                    <b style={{ color: "gray" }}>PD</b>
                    <input
                      disabled={true}
                      type="text"
                      value={sx_data[0] !== undefined ? sx_data[0]?.PD : ""}
                      onChange={(e) => { }}
                    ></input>
                  </label>
                </div>
                <div className="forminputcolumn">
                  <label>
                    <b style={{ color: "gray" }}>CAVITY</b>
                    <input
                      disabled={true}
                      type="text"
                      value={sx_data[0] !== undefined ? sx_data[0]?.CAVITY : ""}
                      onChange={(e) => { }}
                    ></input>
                  </label>
                  <label>
                    <b style={{ color: "gray" }}>ST.OK</b>
                    <input
                      disabled={true}
                      type="text"
                      value={
                        sx_data[0] !== undefined
                          ? sx_data[0]?.MASS_START_TIME
                          : ""
                      }
                      onChange={(e) => { }}
                    ></input>
                  </label>
                </div>
                <div className="forminputcolumn">
                  <label>
                    <b style={{ color: "gray" }}>Mã CNSX</b>
                    <input
                      disabled={true}
                      type="text"
                      value={
                        sx_data[0] !== undefined ? sx_data[0]?.INS_EMPL : ""
                      }
                      onChange={(e) => { }}
                    ></input>
                  </label>
                </div>
              </div>
            </div>
          )}
          <div className="tracuuYCSXTable">{pqc1DataTable2}</div>
        </div>
      </div>
    </div>
  );
};
export default PQC1;

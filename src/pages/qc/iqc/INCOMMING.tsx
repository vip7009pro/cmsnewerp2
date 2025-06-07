import { Button, IconButton } from "@mui/material";
import moment from "moment";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AiFillFileAdd,
  AiOutlineCloudUpload,
  AiOutlineSearch,
} from "react-icons/ai";
import Swal from "sweetalert2";
import {
  generalQuery,
  getAuditMode,
  getUserData,
  uploadQuery,
} from "../../../api/Api";
import "./INCOMMING.scss";
import { GrClose, GrStatusGood } from "react-icons/gr";
import { FcCancel } from "react-icons/fc";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  DTC_DATA,
  IQC_INCOMMING_DATA,
  UserData,
} from "../../../api/GlobalInterface";
import AGTable from "../../../components/DataTable/AGTable";
import {
  MdDocumentScanner,
  MdShowChart,
  MdShower,
  MdUpdate,
} from "react-icons/md";
import { checkBP, f_updateStockM090 } from "../../../api/GlobalFunction";
import { CustomCellRendererProps } from "ag-grid-react";
import BNK_COMPONENT from "./BNK_COMPONENT";
import { useReactToPrint } from "react-to-print";
import { FaClosedCaptioning } from "react-icons/fa";
const INCOMMING = () => {
  const incomingChecksheetPrintRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => incomingChecksheetPrintRef.current,
  });
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [showBNK, setShowBNK] = useState(false);
  const [isNewRegister, setNewRegister] = useState(false);
  const [clickedRow, setClickedRow] = useState<IQC_INCOMMING_DATA | null>(null);
  const column_dtc_data = [
    { field: "TEST_NAME", headerName: "TEST_NAME", width: 60 },
    { field: "POINT_NAME", headerName: "NO", width: 40 },
    {
      field: "CENTER_VALUE",
      headerName: "CENTER",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span>
            <b>{params.data.CENTER_VALUE}</b>
          </span>
        );
      },
    },
    {
      field: "UPPER_TOR",
      headerName: "UPPER",
      width: 40,
      cellRenderer: (params: any) => {
        return (
          <span>
            <b>{params.data.UPPER_TOR}</b>
          </span>
        );
      },
    },
    {
      field: "LOWER_TOR",
      headerName: "LOWER",
      width: 40,
      cellRenderer: (params: any) => {
        return (
          <span>
            <b>{params.data.LOWER_TOR}</b>
          </span>
        );
      },
    },
    { field: "RESULT", headerName: "RESULT", width: 40 },
    {
      field: "DANHGIA",
      headerName: "KQ",
      width: 40,
      cellRenderer: (params: any) => {
        if (
          params.data.RESULT >=
            params.data.CENTER_VALUE - params.data.LOWER_TOR &&
          params.data.RESULT <= params.data.CENTER_VALUE + params.data.UPPER_TOR
        )
          return (
            <span style={{ color: "green" }}>
              <b>OK</b>
            </span>
          );
        return (
          <span style={{ color: "red" }}>
            <b>NG</b>
          </span>
        );
      },
    },

    { field: "DTC_ID", headerName: "DTC_ID", width: 80 },
    { field: "PROD_REQUEST_NO", headerName: "YCSX", width: 80 },
    { field: "G_CODE", headerName: "G_CODE", width: 80 },
    {
      field: "G_NAME",
      headerName: "G_NAME",
      width: 200,
      cellRenderer: (params: any) => {
        if (params.data.M_CODE !== "B0000035") return <span></span>;
        return (
          <span>
            <b>{params.data.G_NAME}</b>
          </span>
        );
      },
    },
    {
      field: "M_CODE",
      headerName: "M_CODE",
      width: 80,
      cellRenderer: (params: any) => {
        if (params.data.M_CODE === "B0000035") return <span></span>;
        return (
          <span>
            <b>{params.data.M_CODE}</b>
          </span>
        );
      },
    },
    {
      field: "M_NAME",
      headerName: "TEN LIEU",
      width: 150,
      cellRenderer: (params: any) => {
        if (params.data.M_CODE === "B0000035") return <span></span>;
        return (
          <span>
            <b>{params.data.M_NAME}</b>
          </span>
        );
      },
    },
    { field: "FACTORY", headerName: "FACTORY", width: 80 },
    { field: "TEST_FINISH_TIME", headerName: "TEST_FINISH_TIME", width: 145 },
    { field: "TEST_EMPL_NO", headerName: "NV TEST", width: 100 },
    { field: "TEST_TYPE_NAME", headerName: "TEST_TYPE_NAME", width: 140 },
    { field: "WORK_POSITION_NAME", headerName: "BO PHAN", width: 80 },
    { field: "SAMPLE_NO", headerName: "SAMPLE_NO", width: 80 },
    { field: "REQUEST_DATETIME", headerName: "NGAY YC", width: 145 },
    { field: "REQUEST_EMPL_NO", headerName: "NV YC", width: 80 },
    { field: "SIZE", headerName: "SIZE", width: 80 },
    { field: "LOTCMS", headerName: "LOTCMS", width: 80 },
    { field: "TEST_CODE", headerName: "TEST_CODE", width: 80 },
    { field: "TDS", headerName: "TDS", width: 80 },
    { field: "TDS_EMPL", headerName: "TDS_EMPL", width: 80 },
    { field: "TDS_UPD_DATE", headerName: "TDS_UPD_DATE", width: 80 },
  ];

  const handletraDTCData = (dtc_id: number) => {
    generalQuery("dtcdata", {
      ALLTIME: true,
      FROM_DATE: "",
      TO_DATE: "",
      G_CODE: "",
      G_NAME: "",
      M_NAME: "",
      M_CODE: "",
      TEST_NAME: "0",
      PROD_REQUEST_NO: "",
      TEST_TYPE: "0",
      ID: dtc_id,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: DTC_DATA[] = response.data.data.map(
            (element: DTC_DATA, index: number) => {
              return {
                ...element,
                G_NAME:
                  getAuditMode() == 0
                    ? element?.G_NAME
                    : element?.G_NAME?.search("CNDB") == -1
                    ? element?.G_NAME
                    : "TEM_NOI_BO",
                TEST_FINISH_TIME: moment
                  .utc(element.TEST_FINISH_TIME)
                  .format("YYYY-MM-DD HH:mm:ss"),
                REQUEST_DATETIME: moment
                  .utc(element.REQUEST_DATETIME)
                  .format("YYYY-MM-DD HH:mm:ss"),
                id: index,
              };
            }
          );
          setDtcDataTable(loadeddata);
        } else {
          setDtcDataTable([]);
          /* Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error"); */
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );
  const [inputno, setInputNo] = useState("");
  const [request_empl, setrequest_empl] = useState(getUserData()?.EMPL_NO);
  const [remark, setReMark] = useState("");
  const [iqc1datatable, setIQC1DataTable] = useState<Array<IQC_INCOMMING_DATA>>(
    [
      {
        id: 0,
        M_CODE: "",
        M_NAME: "",
        WIDTH_CD: 0,
        M_LOT_NO: "",
        LOT_CMS: "",
        LOT_VENDOR: "",
        CUST_CD: "",
        CUST_NAME_KD: "",
        IQC1_ID: 0,
        EXP_DATE: "",
        INPUT_LENGTH: 0,
        TOTAL_ROLL: 0,
        NQ_AQL: 0,
        NQ_CHECK_ROLL: 0,
        DTC_ID: 0,
        TEST_EMPL: "",
        TOTAL_RESULT: "",
        AUTO_JUDGEMENT: "",
        NGOAIQUAN: "",
        KICHTHUOC: "",
        THICKNESS: "",
        DIENTRO: "",
        CANNANG: "",
        KEOKEO: "",
        KEOKEO2: "",
        FTIR: "",
        MAIMON: "",
        XRF: "",
        SCANBARCODE: "",
        PHTHALATE: "",
        MAUSAC: "",
        SHOCKNHIET: "",
        TINHDIEN: "",
        NHIETAM: "",
        TVOC: "",
        DOBONG: "",
        INS_DATE: "",
        INS_EMPL: "",
        UPD_DATE: "",
        UPD_EMPL: "",
        REMARK: "",
        IQC_TEST_RESULT: "PD",
        DTC_RESULT: "PD",
        LOT_VENDOR_IQC: "",
        M_THICKNESS: 0,
        M_THICKNESS_UPPER: 0,
        M_THICKNESS_LOWER: 0,
      },
    ]
  );
  const [dtcDataTable, setDtcDataTable] = useState<Array<DTC_DATA>>([]);
  const selectedRowsData = useRef<Array<IQC_INCOMMING_DATA>>([]);
  const [empl_name, setEmplName] = useState("");
  const [reqDeptCode, setReqDeptCode] = useState("");
  const [m_name, setM_Name] = useState("");
  const [width_cd, setWidthCD] = useState(0);
  const [in_cfm_qty, setInCFMQTY] = useState(0);
  const [roll_qty, setRollQty] = useState(0);
  const [m_code, setM_Code] = useState("");
  const [dtc_id, setDtc_ID] = useState(0);
  const [cust_cd, setCust_Cd] = useState("");
  const [cust_name_kd, setCust_Name_KD] = useState("");
  const [vendorLot, setVendorLot] = useState("");
  const [exp_date, setEXP_DATE] = useState(moment().format("YYYY-MM-DD"));
  const [total_qty, setTotal_QTY] = useState(0);
  const [total_roll, setTotal_ROLL] = useState(0);
  const [nq_qty, setNQ_QTY] = useState(0);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [vendor, setVendor] = useState("");

  const insertHoldingData = async (
    REASON: string,
    M_CODE: string,
    M_LOT_NO: string
  ) => {
    let nextID: number = 0;
    await generalQuery("getMaxHoldingID", {})
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          if (response.data.data.length > 0) {
            nextID = response.data.data[0].MAX_ID + 1;
          }
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });

    await generalQuery("insertHoldingFromI222", {
      ID: nextID,
      REASON: REASON,
      M_CODE: M_CODE,
      M_LOT_NO: M_LOT_NO,
    })
      // eslint-disable-next-line no-loop-func
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
    f_updateStockM090();
  };
  const updateIncomingData = async () => {
    if (selectedRowsData.current.length > 0) {
      Swal.fire({
        title: "Update Data",
        text: "Đang update, hãy chờ chút",
        icon: "info",
        showCancelButton: false,
        allowOutsideClick: false,
        confirmButtonText: "OK",
        showConfirmButton: false,
      });
      let err_code: string = "";
      for (let i = 0; i < selectedRowsData.current.length; i++) {
        await generalQuery("updateIncomingData_web", {
          IQC1_ID: selectedRowsData.current[i].IQC1_ID,
          TOTAL_RESULT: (
            selectedRowsData.current[i].TOTAL_RESULT ?? "PD"
          ).toUpperCase(),
          NQ_CHECK_ROLL: selectedRowsData.current[i].NQ_CHECK_ROLL,
          IQC_TEST_RESULT: (
            selectedRowsData.current[i].IQC_TEST_RESULT ?? "PD"
          ).toUpperCase(),
          DTC_RESULT: (
            selectedRowsData.current[i].DTC_RESULT ?? "PD"
          ).toUpperCase(),
          REMARK: selectedRowsData.current[i].REMARK,
        })
          // eslint-disable-next-line no-loop-func
          .then((response) => {
            //console.log(response.data.data);
            if (response.data.tk_status !== "NG") {
              generalQuery("updateQCPASSI222", {
                M_CODE: selectedRowsData.current[i].M_CODE,
                LOT_CMS: selectedRowsData.current[i].LOT_CMS,
                VALUE:
                  selectedRowsData.current[i].TOTAL_RESULT === "OK" ? "Y" : "N",
              })
                // eslint-disable-next-line no-loop-func
                .then((response) => {
                  //console.log(response.data.data);
                  if (response.data.tk_status !== "NG") {
                    if (selectedRowsData.current[i].TOTAL_RESULT === "NG") {
                      insertHoldingData(
                        selectedRowsData.current[i].REMARK,
                        selectedRowsData.current[i].M_CODE,
                        selectedRowsData.current[i].LOT_CMS
                      );
                    }
                  } else {
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
            } else {
              err_code += ` Lỗi: ${response.data.message}`;
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
      if (err_code === "") {
        Swal.fire("Thông báo", "Update thành công", "success");
        handletraIQC1Data();
      } else {
        Swal.fire("Thông báo", "Lỗi: " + err_code, "error");
      }
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 dòng để thực hiện", "error");
    }
  };
  const setQCPASS = async (value: string) => {
    console.log(selectedRowsData.current);
    if (selectedRowsData.current.length > 0) {
      Swal.fire({
        title: "Set QC Pass",
        text: "Đang set pass, hãy chờ chút",
        icon: "info",
        showCancelButton: false,
        allowOutsideClick: false,
        confirmButtonText: "OK",
        showConfirmButton: false,
      });
      let err_code: string = "";
      for (let i = 0; i < selectedRowsData.current.length; i++) {
        await generalQuery("updateQCPASSI222", {
          M_CODE: selectedRowsData.current[i].M_CODE,
          LOT_CMS: selectedRowsData.current[i].LOT_CMS,
          VALUE: value,
        })
          // eslint-disable-next-line no-loop-func
          .then((response) => {
            //console.log(response.data.data);
            if (response.data.tk_status !== "NG") {
              if (value === "N") {
                insertHoldingData(
                  selectedRowsData.current[i].REMARK,
                  selectedRowsData.current[i].M_CODE,
                  selectedRowsData.current[i].LOT_CMS
                );
              }
            } else {
              err_code += ` Lỗi: ${response.data.message}`;
            }
          })
          .catch((error) => {
            console.log(error);
          });
        await generalQuery("updateIQC1Table", {
          M_CODE: selectedRowsData.current[i].M_CODE,
          LOT_CMS: selectedRowsData.current[i].LOT_CMS,
          VALUE: value === "Y" ? "OK" : "NG",
          IQC1_ID: selectedRowsData.current[i].IQC1_ID,
          REMARK: selectedRowsData.current[i].REMARK,
        })
          // eslint-disable-next-line no-loop-func
          .then((response) => {
            //console.log(response.data.data);
            if (response.data.tk_status !== "NG") {
            } else {
              err_code += ` Lỗi: ${response.data.message}`;
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }

      if (err_code === "") {
        Swal.fire("Thông báo", "SET thành công", "success");
        handletraIQC1Data();
      } else {
        Swal.fire("Thông báo", "Lỗi: " + err_code, "error");
      }
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 dòng để thực hiện", "error");
    }
  };
  const renderOKNGCell = (data: any, key: string) => {
    if (data[key] === 1) {
      return <span style={{ color: "green", fontWeight: "bold" }}>OK</span>;
    } else if (data[key] === 0) {
      return <span style={{ color: "red", fontWeight: "bold" }}>NG</span>;
    } else if (data[key] === 2) {
      return (
        <span style={{ color: "#1848FC", fontWeight: "bold" }}>PENDING</span>
      );
    } else {
      return <span style={{ color: "#C1C7C3", fontWeight: "bold" }}>N/A</span>;
    }
  };

  const updateIQC_INLINE = (datarow: IQC_INCOMMING_DATA) => {
    generalQuery("updateIncomingData_web", {
      IQC1_ID: datarow.IQC1_ID,
      TOTAL_RESULT: (datarow.TOTAL_RESULT ?? "PD").toUpperCase(),
      NQ_CHECK_ROLL: datarow.NQ_CHECK_ROLL,
      IQC_TEST_RESULT: (datarow.IQC_TEST_RESULT ?? "PD").toUpperCase(),
      DTC_RESULT: (datarow.DTC_RESULT ?? "PD").toUpperCase(),
      REMARK: datarow.REMARK,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          Swal.fire("Thông báo", "Update data thành công", "success");
        } else {
          Swal.fire("Thông báo", "Update data thất bại", "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateDataTable = (
    data_row: IQC_INCOMMING_DATA,
    key: string,
    value: any
  ) => {
    Swal.fire({
      title: "Chắc chắn muốn update Data ?",
      text: "Suy nghĩ kỹ trước khi hành động",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn update!",
    }).then((result) => {
      if (result.isConfirmed) {
        let dataToUpdate: IQC_INCOMMING_DATA = iqc1datatable.filter(
          (ele: IQC_INCOMMING_DATA, index: number) =>
            ele.IQC1_ID === data_row.IQC1_ID
        )[0];
        updateIQC_INLINE({ ...dataToUpdate, [key]: value });

        setIQC1DataTable((prev) => {
          const newData = prev.map((p) =>
            p.IQC1_ID === data_row.IQC1_ID ? { ...p, [key]: value } : p
          );
          return newData;
        });
        if (key === "TOTAL_RESULT") {
          generalQuery("updateQCPASSI222", {
            M_CODE: dataToUpdate.M_CODE,
            LOT_CMS: dataToUpdate.LOT_CMS,
            VALUE: value === "OK" ? "Y" : "N",
          })
            // eslint-disable-next-line no-loop-func
            .then((response) => {
              //console.log(response.data.data);
              if (response.data.tk_status !== "NG") {
              } else {
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
    });
  };

  const handleUpdateData = (
    e: React.ChangeEvent<HTMLInputElement>,
    rowdata: IQC_INCOMMING_DATA,
    key: string
  ) => {
    if (userData?.SUBDEPTNAME?.includes("IQC")) {
      if (e.target.checked) {
        updateDataTable(rowdata, key, "OK");
      } else {
        updateDataTable(rowdata, key, "NG");
      }
    } else {
      Swal.fire("Thông báo", "Bạn không có quyền thực hiện", "error");
    }
  };

  let column_iqcdatatable = [
    {
      field: "IQC1_ID",
      headerName: "IQC1_ID",
      headerCheckboxSelection: true,
      checkboxSelection: true,
      resizable: true,
      width: 80,
    },
    { field: "INS_DATE", headerName: "REG_DATE", resizable: true, width: 60 },
    { field: "M_CODE", headerName: "M_CODE", resizable: true, width: 80 },
    {
      field: "M_NAME",
      headerName: "M_NAME",
      resizable: true,
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <div
            style={{
              textAlign: "left",
              fontWeight: "normal",
              color: "blue",
              borderRadius: "5px",
            }}
          >
            {params.data.M_NAME}
          </div>
        );
      },
    },
    {
      field: "WIDTH_CD",
      headerName: "SIZE",
      resizable: true,
      width: 60,
      cellRenderer: (params: any) => {
        return (
          <div
            style={{
              textAlign: "left",
              fontWeight: "normal",
              color: "blue",
              borderRadius: "5px",
            }}
          >
            {params.data.WIDTH_CD}
          </div>
        );
      },
    },
    {
      field: "M_LOT_NO",
      headerName: "M_LOT_NO",
      resizable: true,
      width: 60,
      cellRenderer: (params: any) => {
        if (params.data.TOTAL_RESULT === "OK") {
          return (
            <div
              style={{
                textAlign: "center",
                fontWeight: "bold",
                color: "blue",
                backgroundColor: "#96f53d",
                borderRadius: "5px",
              }}
            >
              {params.data.M_LOT_NO}
            </div>
          );
        } else if (params.data.TOTAL_RESULT === "NG") {
          return (
            <div
              style={{
                textAlign: "center",
                fontWeight: "bold",
                color: "white",
                backgroundColor: "#f73d3d",
                borderRadius: "5px",
              }}
            >
              {params.data.M_LOT_NO}
            </div>
          );
        } else {
          return (
            <div
              style={{
                textAlign: "center",
                fontWeight: "bold",
                color: "black",
                backgroundColor: "#e1f061",
                borderRadius: "5px",
              }}
            >
              {params.data.M_LOT_NO}
            </div>
          );
        }
      },
    },
    { field: "LOT_CMS", headerName: "LOT_CMS", resizable: true, width: 80 },
    { field: "LOTNCC", headerName: "LOT_VENDOR", resizable: true, width: 80 },
    {
      field: "LOT_VENDOR_IQC",
      headerName: "LOT_VENDOR_IQC",
      resizable: true,
      width: 80,
    },
    { field: "CUST_CD", headerName: "CUST_CD", resizable: true, width: 80 },
    {
      field: "CUST_NAME_KD",
      headerName: "CUST_NAME_KD",
      resizable: true,
      width: 80,
    },
    { field: "EXP_DATE", headerName: "EXP_DATE", resizable: true, width: 80 },
    {
      field: "INPUT_LENGTH",
      headerName: "INPUT_LENGTH",
      resizable: true,
      width: 80,
    },
    {
      field: "TOTAL_ROLL",
      headerName: "TOTAL_ROLL",
      resizable: true,
      width: 40,
    },
    {
      field: "NQ_AQL",
      headerName: "NQ_AQL",
      resizable: true,
      width: 45,
    },
    {
      field: "NQ_CHECK_ROLL",
      headerName: "NQ_ROLL",
      resizable: true,
      width: 40,
    },
    {
      field: "UDPATE",
      headerName: "UDPATE",
      resizable: true,
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <div
            className="checkboxcell"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <IconButton
              className="buttonIcon"
              onClick={async (e) => {
                if (getUserData()?.SUBDEPTNAME?.includes("IQC")) {
                  Swal.fire({
                    title: "Chắc chắn muốn update Data ?",
                    text: "Suy nghĩ kỹ trước khi hành động",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Vẫn update!",
                  }).then(async (result) => {
                    if (result.isConfirmed) {
                      await generalQuery("updateIncomingData_web", {
                        IQC1_ID: params.data.IQC1_ID,
                        TOTAL_RESULT: (
                          params.data.TOTAL_RESULT ?? "PD"
                        ).toUpperCase(),
                        NQ_CHECK_ROLL: params.data.NQ_CHECK_ROLL,
                        IQC_TEST_RESULT: (
                          params.data.IQC_TEST_RESULT ?? "PD"
                        ).toUpperCase(),
                        DTC_RESULT: (
                          params.data.DTC_RESULT ?? "PD"
                        ).toUpperCase(),
                        REMARK: params.data.REMARK,
                      })
                        // eslint-disable-next-line no-loop-func
                        .then((response) => {
                          console.log("ketqua", response.data);
                          if (response.data.tk_status !== "NG") {
                            generalQuery("updateQCPASSI222", {
                              M_CODE: params.data.M_CODE,
                              LOT_CMS: params.data.LOT_CMS,
                              VALUE:
                                params.data.TOTAL_RESULT === "OK" ? "Y" : "N",
                            })
                              // eslint-disable-next-line no-loop-func
                              .then((response) => {
                                //console.log(response.data.data);
                                if (response.data.tk_status !== "NG") {
                                  if (params.data.TOTAL_RESULT === "NG") {
                                    insertHoldingData(
                                      params.data.REMARK,
                                      params.data.M_CODE,
                                      params.data.LOT_CMS
                                    );
                                  }
                                } else {
                                }
                              })
                              .catch((error) => {
                                console.log(error);
                              });

                            Swal.fire(
                              "Thông báo",
                              "Update thành công",
                              "success"
                            );
                          } else {
                            Swal.fire(
                              "Thông báo",
                              "Update thất bại:" + response.data.message,
                              "error"
                            );
                          }
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                    }
                  });
                } else {
                  Swal.fire(
                    "Thông báo",
                    "Bạn không có quyền cập nhật",
                    "error"
                  );
                }
              }}
            >
              <MdUpdate color="#6d08ccb2" size={15} />
              Update
            </IconButton>
          </div>
        );
      },
    },
    /* { field: 'CHECKSHEET',headerName: 'CHECKSHEET', resizable: true,width: 80, cellRenderer: (params: any) => {
      if(params.data.CHECKSHEET !== "Y"){
        return (
          <span style={{ color: "#ff0000", fontWeight: "bold" }}>
            Not uploaded
          </span>
        );
      } 
      return (
        <a href={`/iqcincoming/${params.data.IQC1_ID}.jpg`} target="_blank" rel="noopener noreferrer">
          LINK
        </a>
      );
    } }, */

    {
      field: "CHECKSHEET",
      headerName: "CHECKSHEET",
      width: 100,
      cellRenderer: (params: any) => {
        let file: any = null;
        const uploadFile2: any = async (e: any) => {
          //console.log(file);
          checkBP(userData, ["QC"], ["ALL"], ["ALL"], async () => {
            uploadQuery(file, params.data.IQC1_ID + ".jpg", "iqcincoming")
              .then((response) => {
                if (response.data.tk_status !== "NG") {
                  generalQuery("updateIncomingChecksheet", {
                    IQC1_ID: params.data.IQC1_ID,
                    CHECKSHEET: "Y",
                  })
                    .then((response) => {
                      if (response.data.tk_status !== "NG") {
                        Swal.fire(
                          "Thông báo",
                          "Upload checksheet thành công",
                          "success"
                        );
                      } else {
                        Swal.fire(
                          "Thông báo",
                          "Upload checksheet thất bại",
                          "error"
                        );
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                    });
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
          });
        };
        let hreftlink = "/iqcincoming/" + params.data.IQC1_ID + ".jpg";
        if (params.data.CHECKSHEET === "Y") {
          return (
            <span style={{ color: "gray" }}>
              <a target="_blank" rel="noopener noreferrer" href={hreftlink}>
                LINK
              </a>
            </span>
          );
        } else {
          return (
            <div className="uploadfile">
              <IconButton
                className="buttonIcon"
                onClick={(e) => {
                  uploadFile2(e);
                }}
              >
                <AiOutlineCloudUpload color="yellow" size={15} />
                Upload
              </IconButton>
              <input
                accept=".jpg"
                type="file"
                onChange={(e: any) => {
                  file = e.target.files[0];
                  console.log(file);
                }}
              />
            </div>
          );
        }
      },
    },
    { field: "DTC_ID", headerName: "DTC_ID", resizable: true, width: 80 },
    { field: "TEST_EMPL", headerName: "TEST_EMPL", resizable: true, width: 80 },
    {
      field: "TOTAL_RESULT",
      headerName: "TT_RESULT",
      resizable: true,
      width: 60,
      cellRenderer: (params: CustomCellRendererProps) => {
        return (
          <div className="checkboxcell">
            <input
              type="checkbox"
              checked={params.data.TOTAL_RESULT === "OK"}
              onChange={(e) => {
                setIQC1DataTable((prev) => {
                  const newData = prev.map((p) =>
                    p.IQC1_ID === params.data.IQC1_ID
                      ? { ...p, TOTAL_RESULT: e.target.checked ? "OK" : "NG" }
                      : p
                  );
                  return newData;
                });

                checkBP(getUserData(), ["QC"], ["ALL"], ["ALL"], () => {
                  //handleUpdateData(e, params.data, "TOTAL_RESULT");
                });
              }}
            ></input>
            <span>{params.data.TOTAL_RESULT}</span>
          </div>
        );
      },
      cellStyle: (params: any) => {
        if (params.data.TOTAL_RESULT === "OK") {
          return { backgroundColor: "#77da41", color: "white" };
        } else if (params.data.TOTAL_RESULT === "PD") {
          return { backgroundColor: "yellow", color: "black" };
        } else {
          return { backgroundColor: "red", color: "white" };
        }
      },
    },

    {
      field: "IQC_TEST_RESULT",
      headerName: "IQC_CHECK",
      resizable: true,
      width: 80,
      cellRenderer: (params: CustomCellRendererProps) => {
        return (
          <div className="checkboxcell">
            <input
              type="checkbox"
              checked={params.data.IQC_TEST_RESULT === "OK"}
              onChange={(e) => {
                setIQC1DataTable((prev) => {
                  const newData = prev.map((p) =>
                    p.IQC1_ID === params.data.IQC1_ID
                      ? {
                          ...p,
                          IQC_TEST_RESULT: e.target.checked ? "OK" : "NG",
                        }
                      : p
                  );
                  return newData;
                });

                checkBP(getUserData(), ["QC"], ["ALL"], ["ALL"], () => {
                  //handleUpdateData(e, params.data, "IQC_TEST_RESULT");
                  //console.log(e.target.checked);
                });
              }}
            ></input>
            <span>{params.data.IQC_TEST_RESULT}</span>
          </div>
        );
      },
      cellStyle: (params: any) => {
        if (params.data.IQC_TEST_RESULT === "OK") {
          return { backgroundColor: "#77da41", color: "white" };
        } else if (params.data.IQC_TEST_RESULT === "PD") {
          return { backgroundColor: "yellow", color: "black" };
        } else {
          return { backgroundColor: "red", color: "white" };
        }
      },
    },
    {
      field: "DTC_RESULT",
      headerName: "DTC_RESULT",
      resizable: true,
      width: 80,
      cellRenderer: (params: CustomCellRendererProps) => {
        return (
          <div className="checkboxcell">
            <input
              type="checkbox"
              checked={params.data.DTC_RESULT === "OK"}
              onChange={(e) => {
                setIQC1DataTable((prev) => {
                  const newData = prev.map((p) =>
                    p.IQC1_ID === params.data.IQC1_ID
                      ? {
                          ...p,
                          DTC_RESULT: e.target.checked ? "OK" : "NG",
                        }
                      : p
                  );
                  return newData;
                });

                checkBP(getUserData(), ["QC"], ["ALL"], ["ALL"], () => {
                  //handleUpdateData(e, params.data, "IQC_TEST_RESULT");
                  //console.log(e.target.checked);
                });
              }}
            ></input>
            <span>{params.data.DTC_RESULT}</span>
          </div>
        );
      },
      cellStyle: (params: any) => {
        if (params.data.DTC_RESULT === "OK") {
          return { backgroundColor: "#77da41", color: "white" };
        } else if (params.data.DTC_RESULT === "PD") {
          return { backgroundColor: "yellow", color: "black" };
        } else {
          return { backgroundColor: "red", color: "white" };
        }
      },
    },
    { field: "REMARK", headerName: "REMARK", resizable: true, width: 80 },
    {
      field: "AUTO_JUDGEMENT",
      headerName: "AUTO_JUDGEMENT",
      resizable: true,
      width: 100,
      cellRenderer: (params: CustomCellRendererProps) => {
        return (
          <div className="checkboxcell">
            <input
              type="checkbox"
              checked={params.data.AUTO_JUDGEMENT === "OK"}
              onChange={(e) => {
                setIQC1DataTable((prev) => {
                  const newData = prev.map((p) =>
                    p.IQC1_ID === params.data.IQC1_ID
                      ? {
                          ...p,
                          AUTO_JUDGEMENT: e.target.checked ? "OK" : "NG",
                        }
                      : p
                  );
                  return newData;
                });

                checkBP(getUserData(), ["QC"], ["ALL"], ["ALL"], () => {
                  //handleUpdateData(e, params.data, "IQC_TEST_RESULT");
                  //console.log(e.target.checked);
                });
              }}
            ></input>
            <span>{params.data.AUTO_JUDGEMENT}</span>
          </div>
        );
      },
      cellStyle: (params: any) => {
        if (params.data.AUTO_JUDGEMENT === "OK") {
          return { backgroundColor: "#77da41", color: "white" };
        } else if (params.data.AUTO_JUDGEMENT === "PD") {
          return { backgroundColor: "yellow", color: "black" };
        } else {
          return { backgroundColor: "red", color: "white" };
        }
      },
    },
    {
      field: "DTC_AUTO",
      headerName: "DTC_AUTO",
      resizable: true,
      width: 80,
      cellRenderer: (params: CustomCellRendererProps) => {
        return (
          <div className="checkboxcell">
            <input
              type="checkbox"
              checked={params.data.DTC_AUTO === "OK"}
              onChange={(e) => {
                setIQC1DataTable((prev) => {
                  const newData = prev.map((p) =>
                    p.IQC1_ID === params.data.IQC1_ID
                      ? {
                          ...p,
                          DTC_AUTO: e.target.checked ? "OK" : "NG",
                        }
                      : p
                  );
                  return newData;
                });

                checkBP(getUserData(), ["QC"], ["ALL"], ["ALL"], () => {
                  //handleUpdateData(e, params.data, "IQC_TEST_RESULT");
                  //console.log(e.target.checked);
                });
              }}
            ></input>
            <span>{params.data.DTC_AUTO}</span>
          </div>
        );
      },
      cellStyle: (params: any) => {
        if (params.data.DTC_AUTO === "OK") {
          return { backgroundColor: "#77da41", color: "white" };
        } else if (params.data.DTC_AUTO === "PD") {
          return { backgroundColor: "yellow", color: "black" };
        } else {
          return { backgroundColor: "red", color: "white" };
        }
      },
    },
  ];
  let column_iqcdatatable_worker = [
    {
      field: "IQC1_ID",
      headerName: "ID",
      headerCheckboxSelection: true,
      checkboxSelection: true,
      resizable: true,
      width: 50,
    },
    { field: "M_NAME", headerName: "M_NAME", resizable: true, width: 80 },
    { field: "WIDTH_CD", headerName: "SIZE", resizable: true, width: 30 },
    { field: "M_LOT_NO", headerName: "M_LOT_NO", resizable: true, width: 60 },
    {
      field: "UDPATE",
      headerName: "UDPATE",
      resizable: true,
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <div
            className="checkboxcell"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <IconButton
              className="buttonIcon"
              onClick={async (e) => {
                if (getUserData()?.SUBDEPTNAME?.includes("IQC")) {
                  Swal.fire({
                    title: "Chắc chắn muốn update Data ?",
                    text: "Suy nghĩ kỹ trước khi hành động",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Vẫn update!",
                  }).then(async (result) => {
                    if (result.isConfirmed) {
                      await generalQuery("updateIncomingData_web", {
                        IQC1_ID: params.data.IQC1_ID,
                        TOTAL_RESULT: (
                          params.data.TOTAL_RESULT ?? "PD"
                        ).toUpperCase(),
                        NQ_CHECK_ROLL: params.data.NQ_CHECK_ROLL,
                        IQC_TEST_RESULT: (
                          params.data.IQC_TEST_RESULT ?? "PD"
                        ).toUpperCase(),
                        DTC_RESULT: (
                          params.data.DTC_RESULT ?? "PD"
                        ).toUpperCase(),
                        REMARK: params.data.REMARK,
                      })
                        // eslint-disable-next-line no-loop-func
                        .then((response) => {
                          //console.log(response.data.data);
                          if (response.data.tk_status !== "NG") {
                            if (params.data.TOTAL_RESULT === "OK") {
                              generalQuery("updateQCPASSI222", {
                                M_CODE: params.data.M_CODE,
                                LOT_CMS: params.data.LOT_CMS,
                                VALUE:
                                  params.data.TOTAL_RESULT === "OK" ? "Y" : "N",
                              })
                                // eslint-disable-next-line no-loop-func
                                .then((response) => {
                                  //console.log(response.data.data);
                                  if (response.data.tk_status !== "NG") {
                                  } else {
                                  }
                                })
                                .catch((error) => {
                                  console.log(error);
                                });
                            }

                            Swal.fire(
                              "Thông báo",
                              "Update thành công",
                              "success"
                            );
                          } else {
                            Swal.fire(
                              "Thông báo",
                              "Update thất bại:" + response.data.message,
                              "error"
                            );
                          }
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                    }
                  });
                } else {
                  Swal.fire(
                    "Thông báo",
                    "Bạn không có quyền cập nhật",
                    "error"
                  );
                }
              }}
            >
              <MdUpdate color="#6d08ccb2" size={15} />
              Update
            </IconButton>
          </div>
        );
      },
    },
    { field: "NQ_CHECK_ROLL", headerName: "NQ", resizable: true, width: 30 },

    {
      field: "TOTAL_RESULT",
      headerName: "TT_RESULT",
      resizable: true,
      width: 60,
      cellRenderer: (params: CustomCellRendererProps) => {
        return (
          <div className="checkboxcell">
            <input
              type="checkbox"
              checked={params.data.TOTAL_RESULT === "OK"}
              onChange={(e) => {
                setIQC1DataTable((prev) => {
                  const newData = prev.map((p) =>
                    p.IQC1_ID === params.data.IQC1_ID
                      ? { ...p, TOTAL_RESULT: e.target.checked ? "OK" : "NG" }
                      : p
                  );
                  return newData;
                });

                checkBP(getUserData(), ["QC"], ["ALL"], ["ALL"], () => {
                  //handleUpdateData(e, params.data, "TOTAL_RESULT");
                });
              }}
            ></input>
            <span>{params.data.TOTAL_RESULT}</span>
          </div>
        );
      },
      cellStyle: (params: any) => {
        if (params.data.TOTAL_RESULT === "OK") {
          return { backgroundColor: "#77da41", color: "white" };
        } else if (params.data.TOTAL_RESULT === "PD") {
          return { backgroundColor: "yellow", color: "black" };
        } else {
          return { backgroundColor: "red", color: "white" };
        }
      },
    },
    {
      field: "IQC_TEST_RESULT",
      headerName: "IQC_CHECK",
      resizable: true,
      width: 80,
      cellRenderer: (params: CustomCellRendererProps) => {
        return (
          <div className="checkboxcell">
            <input
              type="checkbox"
              checked={params.data.IQC_TEST_RESULT === "OK"}
              onChange={(e) => {
                setIQC1DataTable((prev) => {
                  const newData = prev.map((p) =>
                    p.IQC1_ID === params.data.IQC1_ID
                      ? {
                          ...p,
                          IQC_TEST_RESULT: e.target.checked ? "OK" : "NG",
                        }
                      : p
                  );
                  return newData;
                });

                checkBP(getUserData(), ["QC"], ["ALL"], ["ALL"], () => {
                  //handleUpdateData(e, params.data, "IQC_TEST_RESULT");
                  //console.log(e.target.checked);
                });
              }}
            ></input>
            <span>{params.data.IQC_TEST_RESULT}</span>
          </div>
        );
      },
      cellStyle: (params: any) => {
        if (params.data.IQC_TEST_RESULT === "OK") {
          return { backgroundColor: "#77da41", color: "white" };
        } else if (params.data.IQC_TEST_RESULT === "PD") {
          return { backgroundColor: "yellow", color: "black" };
        } else {
          return { backgroundColor: "red", color: "white" };
        }
      },
    },
    {
      field: "DTC_RESULT",
      headerName: "DTC_RESULT",
      resizable: true,
      width: 80,
      cellRenderer: (params: CustomCellRendererProps) => {
        return (
          <div className="checkboxcell">
            <input
              type="checkbox"
              checked={params.data.DTC_RESULT === "OK"}
              onChange={(e) => {
                setIQC1DataTable((prev) => {
                  const newData = prev.map((p) =>
                    p.IQC1_ID === params.data.IQC1_ID
                      ? {
                          ...p,
                          DTC_RESULT: e.target.checked ? "OK" : "NG",
                        }
                      : p
                  );
                  return newData;
                });

                checkBP(getUserData(), ["QC"], ["ALL"], ["ALL"], () => {
                  //handleUpdateData(e, params.data, "IQC_TEST_RESULT");
                  //console.log(e.target.checked);
                });
              }}
            ></input>
            <span>{params.data.DTC_RESULT}</span>
          </div>
        );
      },
      cellStyle: (params: any) => {
        if (params.data.DTC_RESULT === "OK") {
          return { backgroundColor: "#77da41", color: "white" };
        } else if (params.data.DTC_RESULT === "PD") {
          return { backgroundColor: "yellow", color: "black" };
        } else {
          return { backgroundColor: "red", color: "white" };
        }
      },
    },
    { field: "REMARK", headerName: "REMARK", resizable: true, width: 80 },
    {
      field: "CHECKSHEET",
      headerName: "CHECKSHEET",
      width: 200,
      cellRenderer: (params: any) => {
        let file: any = null;
        const uploadFile2: any = async (e: any) => {
          //console.log(file);
          checkBP(userData, ["QC"], ["ALL"], ["ALL"], async () => {
            uploadQuery(file, params.data.IQC1_ID + ".jpg", "iqcincoming")
              .then((response) => {
                if (response.data.tk_status !== "NG") {
                  generalQuery("updateIncomingChecksheet", {
                    IQC1_ID: params.data.IQC1_ID,
                    CHECKSHEET: "Y",
                  })
                    .then((response) => {
                      if (response.data.tk_status !== "NG") {
                        Swal.fire(
                          "Thông báo",
                          "Upload checksheet thành công",
                          "success"
                        );
                      } else {
                        Swal.fire(
                          "Thông báo",
                          "Upload checksheet thất bại",
                          "error"
                        );
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                    });
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
          });
        };
        let hreftlink = "/iqcincoming/" + params.data.IQC1_ID + ".jpg";
        if (params.data.CHECKSHEET === "Y") {
          return (
            <span style={{ color: "gray" }}>
              <a target="_blank" rel="noopener noreferrer" href={hreftlink}>
                LINK
              </a>
            </span>
          );
        } else {
          return (
            <div className="uploadfile">
              <IconButton
                className="buttonIcon"
                onClick={(e) => {
                  uploadFile2(e);
                }}
              >
                <AiOutlineCloudUpload color="yellow" size={15} />
                Upload
              </IconButton>
              <input
                accept=".jpg"
                type="file"
                onChange={(e: any) => {
                  file = e.target.files[0];
                  console.log(file);
                }}
              />
            </div>
          );
        }
      },
    },
  ];
  const tail_column_iqcdatatable = [
    { field: "INS_DATE", headerName: "INS_DATE", resizable: true, width: 80 },
    { field: "INS_EMPL", headerName: "INS_EMPL", resizable: true, width: 80 },
    { field: "UPD_DATE", headerName: "UPD_DATE", resizable: true, width: 80 },
    { field: "UPD_EMPL", headerName: "UPD_EMPL", resizable: true, width: 80 },
  ];
  let keyArray =
    iqc1datatable.length > 0
      ? Object?.keys(iqc1datatable[0])?.filter((key: string) =>
          key.startsWith("KQ")
        )
      : [];
  let test_item_fields: any[] = keyArray?.map((key: string) => {
    return {
      field: key,
      headerName: key,
      resizable: true,
      width: 80,
      cellRenderer: (params: any) => renderOKNGCell(params.data, key),
    };
  });
  column_iqcdatatable.push(...test_item_fields);
  column_iqcdatatable.push(...tail_column_iqcdatatable);
  const iqcDataTable = useMemo(() => {
    return (
      <AGTable
        suppressRowClickSelection={false}
        toolbar={
          <div>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                setIQC1DataTable([]);
                setNewRegister(true);
                setVendor("");
                setVendorLot("");
                setM_Code("");
                setM_Name("");
              }}
            >
              <AiFillFileAdd color="green" size={15} />
              New INPUT
            </IconButton>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                //handletraIQC1Data();
                setNewRegister(false);
              }}
            >
              <AiOutlineSearch color="red" size={15} />
              Tra Data
            </IconButton>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                if (userData?.SUBDEPTNAME?.includes("IQC")) {
                  setQCPASS("Y");
                } else {
                  Swal.fire(
                    "Thông báo",
                    "Bạn không phải người bộ phận IQC",
                    "error"
                  );
                }
              }}
            >
              <GrStatusGood color="green" size={15} />
              SET PASS
            </IconButton>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                if (userData?.SUBDEPTNAME?.includes("IQC")) {
                  setQCPASS("N");
                } else {
                  Swal.fire(
                    "Thông báo",
                    "Bạn không phải người bộ phận IQC",
                    "error"
                  );
                }
              }}
            >
              <FcCancel color="red" size={15} />
              SET FAIL
            </IconButton>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                if (userData?.SUBDEPTNAME?.includes("IQC")) {
                  updateIncomingData();
                } else {
                  Swal.fire(
                    "Thông báo",
                    "Bạn không phải người bộ phận IQC",
                    "error"
                  );
                }
              }}
            >
              <MdUpdate color="#6d08ccb2" size={15} />
              Update
            </IconButton>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                checkBP(getUserData(), ["QC"], ["ALL"], ["ALL"], () => {
                  setShowBNK((prev) => !prev);
                });
              }}
            >
              <MdDocumentScanner color="#07b46cce" size={15} />
              Show BNK
            </IconButton>
          </div>
        }
        columns={
          getUserData()?.JOB_NAME === "Worker"
            ? column_iqcdatatable_worker
            : column_iqcdatatable
        }
        data={iqc1datatable}
        onCellEditingStopped={(e) => {
          //console.log(e.data)
        }}
        onRowClick={(e) => {
          //console.log(e.data)
          handletraDTCData(e.data.DTC_ID);
          setClickedRow(e.data);
        }}
        onSelectionChange={(e) => {
          //console.log(e!.api.getSelectedRows())
          selectedRowsData.current = e!.api.getSelectedRows();
        }}
      />
    );
  }, [iqc1datatable, clickedRow]);
  const dtc_data_table = useMemo(() => {
    return (
      <AGTable
        toolbar={<div></div>}
        columns={column_dtc_data}
        data={dtcDataTable}
        onCellEditingStopped={(e) => {
          //console.log(e.data)
        }}
        onRowClick={(e) => {
          //console.log(e.data)
        }}
        onSelectionChange={(e) => {
          //console.log(e!.api.getSelectedRows())
        }}
      />
    );
  }, [dtcDataTable, clickedRow]);

  const handletraIQC1Data = () => {
    generalQuery("loadIQC1table", {
      M_CODE: m_code.trim(),
      M_NAME: m_name.trim(),
      LOTNCC: vendorLot.trim(),
      FROM_DATE: fromdate,
      TO_DATE: todate,
      VENDOR_NAME: vendor.trim(),
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: IQC_INCOMMING_DATA[] = response.data.data.map(
            (element: IQC_INCOMMING_DATA, index: number) => {
              let keyArray = Object.keys(element).filter((key: string) =>
                key.startsWith("KQ")
              );
              let auto_judgement = keyArray.some(
                (key: string) => element[key as keyof IQC_INCOMMING_DATA] === 0
              )
                ? "NG"
                : keyArray.some(
                    (key: string) =>
                      element[key as keyof IQC_INCOMMING_DATA] === 2
                  )
                ? "PD"
                : "OK";
              return {
                ...element,
                NQ_AQL: getTestQty(element.TOTAL_ROLL) ?? 0,
                AUTO_JUDGEMENT:
                  element.IQC_TEST_RESULT === "OK"
                    ? auto_judgement
                    : element.IQC_TEST_RESULT === "PD" &&
                      auto_judgement === "NG"
                    ? "NG"
                    : element.IQC_TEST_RESULT === "PD" &&
                      auto_judgement === "PD"
                    ? "PD"
                    : element.IQC_TEST_RESULT === "PD" &&
                      auto_judgement === "OK"
                    ? "PD"
                    : element.IQC_TEST_RESULT === "NG" &&
                      auto_judgement === "NG"
                    ? "NG"
                    : "OK",
                DTC_AUTO: auto_judgement,
                INS_DATE:
                  element.INS_DATE === null
                    ? ""
                    : moment(element.INS_DATE)
                        .utc()
                        .format("YYYY-MM-DD HH:mm:ss"),
                UPD_DATE:
                  element.UPD_DATE === null
                    ? ""
                    : moment(element.UPD_DATE)
                        .utc()
                        .format("YYYY-MM-DD HH:mm:ss"),
                EXP_DATE:
                  element.EXP_DATE === null
                    ? ""
                    : moment(element.EXP_DATE).utc().format("YYYY-MM-DD"),
                id: index,
              };
            }
          );
          setIQC1DataTable(loadeddata);
          setNewRegister(false);
          Swal.fire(
            "Thông báo",
            "Đã load :" + loadeddata.length + " dòng",
            "success"
          );
        } else {
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
          setReqDeptCode(response.data.data[0].WORK_POSITION_CODE);
        } else {
          setEmplName("");
          setReqDeptCode("");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const checkLotNVL = (M_LOT_NO: string) => {
    generalQuery("checkMNAMEfromLotI222", { M_LOT_NO: M_LOT_NO })
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
          setCust_Cd(response.data.data[0].CUST_CD);
          setCust_Name_KD(response.data.data[0].CUST_NAME_KD);
          setVendorLot(response.data.data[0].LOTNCC);
          setEXP_DATE(
            moment(response.data.data[0].EXP_DATE).format("YYYY-MM-DD")
          );
          generalQuery("checkMNAMEfromLotI222Total", {
            M_CODE: response.data.data[0].M_CODE,
            LOTCMS: M_LOT_NO.substring(0, 6),
          })
            .then((response) => {
              if (response.data.tk_status !== "NG") {
                //console.log(response.data.data);
                setTotal_QTY(response.data.data[0].TOTAL_CFM_QTY);
                setTotal_ROLL(response.data.data[0].TOTAL_ROLL);
              } else {
                setTotal_QTY(0);
                setTotal_ROLL(0);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          setM_Name("");
          setM_Code("");
          setWidthCD(0);
          setRollQty(0);
          setInCFMQTY(0);
          setCust_Cd("");
          setCust_Name_KD("");
          setVendorLot("");
          setEXP_DATE(moment().format("YYYY-MM-DD"));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const checkInput = (): boolean => {
    if (inputno !== "" && request_empl !== "" && nq_qty !== 0 && dtc_id !== 0) {
      return true;
    } else {
      return false;
    }
  };

  const aqlTable = [
    { MIN_ROLL_QTY: 1, MAX_ROLL_QTY: 1, TEST_QTY: 1 },
    { MIN_ROLL_QTY: 2, MAX_ROLL_QTY: 15, TEST_QTY: 2 },
    { MIN_ROLL_QTY: 16, MAX_ROLL_QTY: 25, TEST_QTY: 3 },
    { MIN_ROLL_QTY: 26, MAX_ROLL_QTY: 90, TEST_QTY: 5 },
    { MIN_ROLL_QTY: 91, MAX_ROLL_QTY: 150, TEST_QTY: 8 },
    { MIN_ROLL_QTY: 151, MAX_ROLL_QTY: 280, TEST_QTY: 13 },
    { MIN_ROLL_QTY: 281, MAX_ROLL_QTY: 500, TEST_QTY: 20 },
  ];

  const getTestQty = (total_roll: number) => {
    const testQty = aqlTable.find(
      (element) =>
        element.MIN_ROLL_QTY <= total_roll && element.MAX_ROLL_QTY >= total_roll
    );
    return testQty?.TEST_QTY;
  };

  const addRow = async () => {
    let temp_row: IQC_INCOMMING_DATA = {
      id: iqc1datatable.length,
      IQC1_ID: iqc1datatable.length,
      M_CODE: m_code,
      M_NAME: m_name,
      WIDTH_CD: width_cd,
      M_LOT_NO: inputno,
      LOT_CMS: inputno.substring(0, 6),
      LOT_VENDOR: vendorLot,
      CUST_CD: cust_cd,
      CUST_NAME_KD: cust_name_kd,
      EXP_DATE: exp_date,
      INPUT_LENGTH: total_qty,
      TOTAL_ROLL: total_roll,
      NQ_AQL: getTestQty(total_roll) ?? 0,
      NQ_CHECK_ROLL: nq_qty,
      DTC_ID: dtc_id,
      TEST_EMPL: request_empl ?? "",
      TOTAL_RESULT: "",
      AUTO_JUDGEMENT: "",
      NGOAIQUAN: "",
      KICHTHUOC: "",
      THICKNESS: "",
      DIENTRO: "",
      CANNANG: "",
      KEOKEO: "",
      KEOKEO2: "",
      FTIR: "",
      MAIMON: "",
      XRF: "",
      SCANBARCODE: "",
      PHTHALATE: "",
      MAUSAC: "",
      SHOCKNHIET: "",
      TINHDIEN: "",
      NHIETAM: "",
      TVOC: "",
      DOBONG: "",
      INS_DATE: "",
      INS_EMPL: "",
      UPD_DATE: "",
      UPD_EMPL: "",
      REMARK: "",
      IQC_TEST_RESULT: "PD",
      DTC_RESULT: "PD",
      LOT_VENDOR_IQC: "",
      M_THICKNESS: 0,
      M_THICKNESS_UPPER: 0,
      M_THICKNESS_LOWER: 0,
    };
    setIQC1DataTable((prev) => {
      return [...prev, temp_row];
    });
  };
  const insertIQC1Table = async () => {
    if (iqc1datatable.length > 0) {
      let err_code: string = "";
      for (let i = 0; i < iqc1datatable.length; i++) {
        await generalQuery("insertIQC1table", iqc1datatable[i])
          // eslint-disable-next-line no-loop-func
          .then((response) => {
            if (response.data.tk_status !== "NG") {
              //console.log(response.data.data);
            } else {
              err_code += "Lỗi : " + response.data.message + " | ";
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
      if (err_code === "") {
        Swal.fire("Thông báo", "Thêm data thành công", "success");
      } else {
        Swal.fire("Thông báo", "Lỗi: " + err_code, "error");
      }
    } else {
      Swal.fire("Thông báo", "Thêm ít nhất 1 dòng để lưu", "error");
    }
  };
  useEffect(() => {
    handletraIQC1Data();
  }, []);
  return (
    <div className="incomming">
      <div className="tracuuDataInspection">
        <div className="maintable">
          {isNewRegister && (
            <div
              className="tracuuDataInspectionform"
              style={{ backgroundImage: theme.CMS.backgroundImage }}
            >
              <b style={{ color: "blue" }}>INPUT DATA KIỂM TRA INCOMMING</b>
              <div className="forminput">
                <div className="forminputcolumn">
                  <b>LOT NVL ERP</b>
                  <label>
                    <input
                      type="text"
                      placeholder="202304190123"
                      value={inputno}
                      onChange={(e) => {
                        if (e.target.value.length >= 7) {
                          checkLotNVL(e.target.value);
                        }
                        setInputNo(e.target.value);
                      }}
                    ></input>
                  </label>
                  {m_name && (
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: "bold",
                        color: "blue",
                      }}
                    >
                      {m_name}
                    </span>
                  )}
                  {/* <b>VENDOR LOT</b>
                <label>
                  <input
                    type="text"
                    placeholder={"abcdxyz"}
                    value={vendorLot}
                    onChange={(e) => {
                      setVendorLot(e.target.value);
                    }}
                  ></input>
                </label> */}
                </div>
                <div className="forminputcolumn">
                  {/*  <b>Hạn sử dụng</b>
                <label>
                  <input
                    type="date"
                    value={exp_date}
                    onChange={(e) => {
                      setEXP_DATE(e.target.value);
                    }}
                  ></input>
                </label> */}
                  <b>RL NgQuan</b>
                  <label>
                    <input
                      type="text"
                      value={nq_qty}
                      onChange={(e) => {
                        setNQ_QTY(Number(e.target.value));
                      }}
                    ></input>
                  </label>
                </div>
                <div className="forminputcolumn">
                  <b>ID TestĐTC</b>
                  <label>
                    <input
                      type="text"
                      value={dtc_id}
                      onChange={(e) => {
                        setDtc_ID(Number(e.target.value));
                      }}
                    ></input>
                  </label>
                  <b>Mã IQC</b>
                  <label>
                    <input
                      type="text"
                      placeholder={"NHU1903"}
                      value={request_empl}
                      onChange={(e) => {
                        if (e.target.value.length >= 7) {
                          checkEMPL_NAME(e.target.value);
                        }
                        setrequest_empl(e.target.value);
                      }}
                    ></input>
                  </label>
                  {request_empl && (
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: "bold",
                        color: "blue",
                      }}
                    >
                      {empl_name}
                    </span>
                  )}
                </div>
                <div className="forminputcolumn">
                  <b>Remark</b>
                  <label>
                    <input
                      type="text"
                      placeholder={"Ghi chú"}
                      value={remark}
                      onChange={(e) => {
                        setReMark(e.target.value);
                      }}
                    ></input>
                  </label>
                </div>
              </div>
              <div className="formbutton">
                <Button
                  fullWidth={true}
                  color={"success"}
                  variant="contained"
                  size="small"
                  sx={{
                    fontSize: "0.7rem",
                    padding: "3px",
                    backgroundColor: "#f3f735",
                    color: "black",
                  }}
                  onClick={() => {
                    if (checkInput()) {
                      if (isNewRegister) {
                        addRow();
                      } else {
                        Swal.fire(
                          "Thông báo",
                          "Bấm New và Add đăng ký mới rồi hãy save",
                          "warning"
                        );
                      }
                    } else {
                      Swal.fire(
                        "Thông báo",
                        "Hãy nhập đủ thông tin trước khi đăng ký",
                        "error"
                      );
                    }
                  }}
                >
                  Add
                </Button>
                <Button
                  fullWidth={true}
                  color={"success"}
                  variant="contained"
                  size="small"
                  sx={{
                    fontSize: "0.7rem",
                    padding: "3px",
                    backgroundColor: "#0ca32d",
                  }}
                  onClick={() => {
                    if (isNewRegister) {
                      insertIQC1Table();
                    } else {
                      Swal.fire(
                        "Thông báo",
                        "Bấm New và Add đăng ký mới rồi hãy save",
                        "warning"
                      );
                    }
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          )}
          {!isNewRegister && (
            <div
              className="tracuuDataInspectionform"
              style={{ backgroundImage: theme.CMS.backgroundImage }}
            >
              <b style={{ color: "blue" }}>TRA DATA INCOMMING</b>
              <div className="forminput">
                <div className="forminputcolumn">
                  <label>
                    <b>Từ ngày:</b>
                    <input
                      type="date"
                      value={fromdate.slice(0, 10)}
                      onChange={(e) => setFromDate(e.target.value)}
                    ></input>
                  </label>
                  <label>
                    <b>Tới ngày:</b>{" "}
                    <input
                      type="date"
                      value={todate.slice(0, 10)}
                      onChange={(e) => setToDate(e.target.value)}
                    ></input>
                  </label>
                </div>
                <div className="forminputcolumn">
                  <label>
                    <b>Tên Liệu:</b>{" "}
                    <input
                      type="text"
                      placeholder="SJ-203020HC"
                      value={m_name}
                      onChange={(e) => setM_Name(e.target.value)}
                    ></input>
                  </label>
                  <label>
                    <b>Mã Liệu CMS:</b>{" "}
                    <input
                      type="text"
                      placeholder="A123456"
                      value={m_code}
                      onChange={(e) => setM_Code(e.target.value)}
                    ></input>
                  </label>
                </div>
                <div className="forminputcolumn">
                  <label>
                    <b>Vendor Name:</b>{" "}
                    <input
                      type="text"
                      placeholder="SSJ"
                      value={vendor}
                      onChange={(e) => setVendor(e.target.value)}
                    ></input>
                  </label>
                  <label>
                    <b>Vendor LOT:</b>{" "}
                    <input
                      type="text"
                      placeholder="abcxyz123"
                      value={vendorLot}
                      onChange={(e) => setVendorLot(e.target.value)}
                    ></input>
                  </label>
                </div>
              </div>
              {isNewRegister && (
                <div className="formbutton">
                  <Button
                    fullWidth={true}
                    color={"success"}
                    variant="contained"
                    size="small"
                    sx={{
                      fontSize: "0.7rem",
                      padding: "3px",
                      backgroundColor: "#4959e7",
                      color: "white",
                    }}
                    onClick={() => {
                      setIQC1DataTable([]);
                      setNewRegister(true);
                    }}
                  >
                    NEW
                  </Button>
                  <Button
                    fullWidth={true}
                    color={"success"}
                    variant="contained"
                    size="small"
                    sx={{
                      fontSize: "0.7rem",
                      padding: "3px",
                      backgroundColor: "#f3f735",
                      color: "black",
                    }}
                    onClick={() => {
                      if (checkInput()) {
                        if (isNewRegister) {
                          addRow();
                        } else {
                          Swal.fire(
                            "Thông báo",
                            "Bấm New và Add đăng ký mới rồi hãy save",
                            "warning"
                          );
                        }
                      } else {
                        Swal.fire(
                          "Thông báo",
                          "Hãy nhập đủ thông tin trước khi đăng ký",
                          "error"
                        );
                      }
                    }}
                  >
                    Add
                  </Button>
                  <Button
                    fullWidth={true}
                    color={"success"}
                    variant="contained"
                    size="small"
                    sx={{
                      fontSize: "0.7rem",
                      padding: "3px",
                      backgroundColor: "#0ca32d",
                    }}
                    onClick={() => {
                      if (isNewRegister) {
                        insertIQC1Table();
                      } else {
                        Swal.fire(
                          "Thông báo",
                          "Bấm New và Add đăng ký mới rồi hãy save",
                          "warning"
                        );
                      }
                    }}
                  >
                    Save
                  </Button>
                </div>
              )}
              {!isNewRegister && (
                <div className="formbutton">
                  <Button
                    fullWidth={true}
                    color={"success"}
                    variant="contained"
                    size="small"
                    sx={{
                      fontSize: "0.7rem",
                      padding: "3px",
                      backgroundColor: "#4959e7",
                      color: "white",
                    }}
                    onClick={() => {
                      handletraIQC1Data();
                    }}
                  >
                    Tra Data
                  </Button>
                </div>
              )}
            </div>
          )}
          <div className="tracuuYCSXTable">{iqcDataTable}</div>
          <div className="tracuuDataInspectionform2">
            <b style={{ color: "blue" }}>Kết quả ĐTC</b>
            {dtc_data_table}
          </div>
        </div>
      </div>
      {showBNK && (
        <div className="incomingChecksheet">
          <div
            className="formbutton"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <b style={{ color: "blue" }}>CheckSheet Kiểm Tra Incoming</b>
            <Button
              fullWidth={false}
              color={"success"}
              variant="contained"
              size="small"
              sx={{
                fontSize: "0.7rem",
                padding: "3px",
                backgroundColor: "#4959e7",
                color: "white",
              }}
              onClick={() => {
                handlePrint();
              }}
            >
              Print
            </Button>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                setShowBNK((prev) => !prev);
              }}
            >
              <GrClose color="#c20df0ce" size={15} />
              Close
            </IconButton>
          </div>
          <div className="checksheetcpn" ref={incomingChecksheetPrintRef}>
            <BNK_COMPONENT data={clickedRow} dtc_data={dtcDataTable} />
          </div>
        </div>
      )}
    </div>
  );
};
export default INCOMMING;

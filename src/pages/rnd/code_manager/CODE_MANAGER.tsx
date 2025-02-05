import { IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { FcCancel, } from "react-icons/fc";
import {
  AiFillCheckCircle,
  AiFillEdit,
  AiFillFileExcel,
  AiOutlineCloudUpload,
} from "react-icons/ai";
import Swal from "sweetalert2";
import { generalQuery, uploadQuery } from "../../../api/Api";
import {
  SaveExcel,
  checkBP,
  f_downloadFile,
  f_getCodeInfo,
  f_handleSaveLossSX,
  f_handleSaveQLSX,
  f_pdBanVe,
  f_resetBanVe,
  f_setNgoaiQuan,
  f_updateBEP,
  f_updateLossKT,
} from "../../../api/GlobalFunction";
import "./CODE_MANAGER.scss";
import { BiDownload, BiReset } from "react-icons/bi";
import { MdOutlineDraw, MdPriceChange, MdUpdate } from "react-icons/md";
import { UserData } from "../../../api/GlobalInterface";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { CODE_FULL_INFO } from "../../../api/GlobalInterface";
import AGTable from "../../../components/DataTable/AGTable";
const CODE_MANAGER = () => {
  const [activeOnly, setActiveOnly] = useState(true)
  const [cndb, setCNDB] = useState(false)
  const [codedatatablefilter, setCodeDataTableFilter] = useState<Array<CODE_FULL_INFO>>([]);
  const userData: UserData | undefined = useSelector((state: RootState) => state.totalSlice.userData,);
  const [isLoading, setisLoading] = useState(false);
  const [codeCMS, setCodeCMS] = useState("");
  const [enableEdit, setEnableEdit] = useState(true);
  let column_codeinfo = [
    { field: "id", headerName: "ID", width: 70, editable: enableEdit },
    { field: "G_CODE", headerName: "G_CODE", width: 80, editable: enableEdit },
    {
      field: "G_NAME",
      headerName: "G_NAME",
      flex: 1,
      minWidth: 250,
      editable: enableEdit,
    },
    {
      field: "G_NAME_KD",
      headerName: "G_NAME_KD",
      width: 120,
      editable: enableEdit,
    },
    {
      field: "PROD_TYPE",
      headerName: "PROD_TYPE",
      width: 80,
      editable: enableEdit,
    },
    {
      field: "PACKING_TYPE",
      headerName: "PACKING_TYPE",
      width: 80,
      editable: enableEdit,
    },
    {
      field: "BEP",
      headerName: "BEP",
      width: 80,
      editable: enableEdit,
    },
    {
      field: "PROD_LAST_PRICE",
      headerName: "PRICE",
      width: 80,
      editable: enableEdit,
    },
    { field: "PD", headerName: "PD", width: 80, editable: enableEdit },
    { field: "CAVITY", headerName: "CAVITY", width: 80, editable: enableEdit },
    {
      field: "PACKING_QTY",
      headerName: "PACKING_QTY",
      width: 80,
      editable: enableEdit,
    },
    {
      field: "G_WIDTH",
      headerName: "G_WIDTH",
      width: 80,
      editable: enableEdit,
    },
    {
      field: "G_LENGTH",
      headerName: "G_LENGTH",
      width: 80,
      editable: enableEdit,
    },
    {
      field: "PROD_PROJECT",
      headerName: "PROD_PROJECT",
      width: 120,
      editable: enableEdit,
    },
    {
      field: "PROD_MODEL",
      headerName: "PROD_MODEL",
      width: 120,
      editable: enableEdit,
    },
    {
      field: "M_NAME_FULLBOM",
      headerName: "FULLBOM",
      flex: 1,
      minWidth: 150,
      editable: enableEdit,
    },
    {
      field: "BANVE",
      headerName: "BANVE",
      width: 260,
      renderCell: (params: any) => {
        let file: any = null;
        const uploadFile2: any = async (e: any) => {
          //console.log(file);
          checkBP(userData, ["RND", "KD"], ["ALL"], ["ALL"], async () => {
            uploadQuery(file, params.row.G_CODE + ".pdf", "banve")
              .then((response) => {
                if (response.data.tk_status !== "NG") {
                  generalQuery("update_banve_value", {
                    G_CODE: params.row.G_CODE,
                    banvevalue: "Y",
                  })
                    .then((response) => {
                      if (response.data.tk_status !== "NG") {
                        Swal.fire(
                          "Thông báo",
                          "Upload bản vẽ thành công",
                          "success",
                        );
                        let tempcodeinfodatatable = rows.map(
                          (element: CODE_FULL_INFO, index: number) => {
                            return element.G_CODE === params.row.G_CODE
                              ? { ...element, BANVE: "Y" }
                              : element;
                          },
                        );
                        setRows(tempcodeinfodatatable);
                      } else {
                        Swal.fire(
                          "Thông báo",
                          "Upload bản vẽ thất bại",
                          "error",
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
                    "error",
                  );
                }
              })
              .catch((error) => {
                console.log(error);
              });
          });
        };
        let hreftlink = "/banve/" + params.row.G_CODE + ".pdf";
        if (params.row.BANVE !== "N" && params.row.BANVE !== null) {
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
                accept=".pdf"
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
      editable: enableEdit,
    },
    {
      field: "APPSHEET",
      headerName: "APPSHEET",
      width: 260,
      renderCell: (params: any) => {
        let file: any = null;
        const uploadFile2: any = async (e: any) => {
          //console.log(file);
          checkBP(userData, ["RND", "KD"], ["ALL"], ["ALL"], async () => {
            uploadQuery(file, "Appsheet_" + params.row.G_CODE + ".docx", "appsheet")
              .then((response) => {
                if (response.data.tk_status !== "NG") {
                  generalQuery("update_appsheet_value", {
                    G_CODE: params.row.G_CODE,
                    appsheetvalue: "Y",
                  })
                    .then((response) => {
                      if (response.data.tk_status !== "NG") {
                        let tempcodeinfodatatable = rows.map(
                          (element: CODE_FULL_INFO, index: number) => {
                            return element.G_CODE === params.row.G_CODE
                              ? { ...element, APPSHEET: "Y" }
                              : element;
                          },
                        );
                        setRows(tempcodeinfodatatable);
                        Swal.fire(
                          "Thông báo",
                          "Upload Appsheet thành công",
                          "success",
                        );
                      } else {
                        Swal.fire(
                          "Thông báo",
                          "Upload appsheet thất bại",
                          "error",
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
                    "error",
                  );
                }
              })
              .catch((error) => {
                console.log(error);
              });
          });
        };
        let hreftlink = "/appsheet/Appsheet_" + params.row.G_CODE + ".docx";
        if (params.row.APPSHEET !== "N" && params.row.APPSHEET !== null) {
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
                accept=".docx"
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
      editable: enableEdit,
    },
    {
      field: "NO_INSPECTION",
      headerName: "KT NGOAI QUAN",
      width: 120,
      renderCell: (params: any) => {
        if (params.row.NO_INSPECTION !== "Y")
          return <span style={{ color: "green" }}>Kiểm tra</span>;
        return <span style={{ color: "red" }}>Không kiểm tra</span>;
      },
      editable: enableEdit,
    },
    {
      field: "USE_YN",
      headerName: "SỬ DỤNG",
      width: 80,
      renderCell: (params: any) => {
        if (params.row.USE_YN !== "Y")
          return <span style={{ color: "red" }}>KHÓA</span>;
        return <span style={{ color: "green" }}>MỞ</span>;
      },
      editable: true,
    },
    {
      field: "PDBV",
      headerName: "PD BANVE",
      width: 80,
      renderCell: (params: any) => {
        if (
          params.row.PDBV === "P" ||
          params.row.PDBV === "R" ||
          params.row.PDBV === null
        )
          return (
            <span style={{ color: "red" }}>
              <b>PENDING</b>
            </span>
          );
        return (
          <span style={{ color: "green" }}>
            <b>APPROVED</b>
          </span>
        );
      },
    },
    { field: "QL_HSD", headerName: "QL_HSD", width: 80, },
    { field: "EXP_DATE", headerName: "EXP_DATE", width: 80, },
    {
      field: "TENCODE",
      headerName: "TENCODE",
      flex: 1,
      minWidth: 250,
      editable: enableEdit,
      renderCell: (params: any) => {
        return <span style={{ color: "black" }}>{params.row.G_NAME}</span>;
      },
    },
    {
      field: "PROD_DIECUT_STEP",
      headerName: "BC DIECUT",
      width: 120,
      renderCell: (params: any) => {
        if (params.row.PROD_DIECUT_STEP === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return (
            <span style={{ fontWeight: "bold" }}>
              {params.row.PROD_DIECUT_STEP}
            </span>
          );
        }
      },
    },
    {
      field: "PROD_PRINT_TIMES",
      headerName: "SO LAN IN",
      width: 120,
      renderCell: (params: any) => {
        if (params.row.PROD_PRINT_TIMES === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return (
            <span style={{ fontWeight: "bold" }}>
              {params.row.PROD_PRINT_TIMES}
            </span>
          );
        }
      },
    },
    {
      field: "FACTORY",
      headerName: "FACTORY",
      width: 100,
      renderCell: (params: any) => {
        if (params.row.FACTORY === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return (
            <span style={{ fontWeight: "bold" }}>{params.row.FACTORY}</span>
          );
        }
      },
    },
    {
      field: "EQ1",
      headerName: "EQ1",
      width: 80,
      renderCell: (params: any) => {
        if (params.row.EQ1 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return <span style={{ fontWeight: "bold" }}>{params.row.EQ1}</span>;
        }
      },
    },
    {
      field: "EQ2",
      headerName: "EQ2",
      width: 80,
      renderCell: (params: any) => {
        if (params.row.EQ2 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return <span style={{ fontWeight: "bold" }}>{params.row.EQ2}</span>;
        }
      },
    },
    {
      field: "EQ3",
      headerName: "EQ3",
      width: 80,
      renderCell: (params: any) => {
        if (params.row.EQ3 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return <span style={{ fontWeight: "bold" }}>{params.row.EQ3}</span>;
        }
      },
    },
    {
      field: "EQ4",
      headerName: "EQ4",
      width: 80,
      renderCell: (params: any) => {
        if (params.row.EQ4 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return <span style={{ fontWeight: "bold" }}>{params.row.EQ4}</span>;
        }
      },
    },
    {
      field: "Setting1",
      headerName: "Setting1",
      width: 100,
      renderCell: (params: any) => {
        if (params.row.Setting1 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return (
            <span style={{ fontWeight: "bold" }}>{params.row.Setting1}</span>
          );
        }
      },
    },
    {
      field: "Setting2",
      headerName: "Setting2",
      width: 100,
      renderCell: (params: any) => {
        if (params.row.Setting2 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return (
            <span style={{ fontWeight: "bold" }}>{params.row.Setting2}</span>
          );
        }
      },
    },
    {
      field: "Setting3",
      headerName: "Setting3",
      width: 100,
      renderCell: (params: any) => {
        if (params.row.Setting3 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return (
            <span style={{ fontWeight: "bold" }}>{params.row.Setting3}</span>
          );
        }
      },
    },
    {
      field: "Setting4",
      headerName: "Setting4",
      width: 100,
      renderCell: (params: any) => {
        if (params.row.Setting4 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return (
            <span style={{ fontWeight: "bold" }}>{params.row.Setting4}</span>
          );
        }
      },
    },
    {
      field: "UPH1",
      headerName: "UPH1",
      width: 80,
      renderCell: (params: any) => {
        if (params.row.UPH1 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return <span style={{ fontWeight: "bold" }}>{params.row.UPH1}</span>;
        }
      },
    },
    {
      field: "UPH2",
      headerName: "UPH2",
      width: 80,
      renderCell: (params: any) => {
        if (params.row.UPH2 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return <span style={{ fontWeight: "bold" }}>{params.row.UPH2}</span>;
        }
      },
    },
    {
      field: "UPH3",
      headerName: "UPH3",
      width: 80,
      renderCell: (params: any) => {
        if (params.row.UPH3 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return <span style={{ fontWeight: "bold" }}>{params.row.UPH3}</span>;
        }
      },
    },
    {
      field: "UPH4",
      headerName: "UPH4",
      width: 80,
      renderCell: (params: any) => {
        if (params.row.UPH4 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return <span style={{ fontWeight: "bold" }}>{params.row.UPH4}</span>;
        }
      },
    },
    {
      field: "Step1",
      headerName: "Step1",
      width: 80,
      renderCell: (params: any) => {
        if (params.row.Step1 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return <span style={{ fontWeight: "bold" }}>{params.row.Step1}</span>;
        }
      },
    },
    {
      field: "Step2",
      headerName: "Step2",
      width: 80,
      renderCell: (params: any) => {
        if (params.row.Step2 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return <span style={{ fontWeight: "bold" }}>{params.row.Step2}</span>;
        }
      },
    },
    {
      field: "Step3",
      headerName: "Step3",
      width: 80,
      renderCell: (params: any) => {
        if (params.row.Step3 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return <span style={{ fontWeight: "bold" }}>{params.row.Step3}</span>;
        }
      },
    },
    {
      field: "Step4",
      headerName: "Step4",
      width: 80,
      renderCell: (params: any) => {
        if (params.row.Step4 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return <span style={{ fontWeight: "bold" }}>{params.row.Step4}</span>;
        }
      },
    },
    {
      field: "LOSS_SX1",
      headerName: "LOSS_SX1(%)",
      width: 100,
      renderCell: (params: any) => {
        if (params.row.LOSS_SX1 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return (
            <span style={{ fontWeight: "bold" }}>{params.row.LOSS_SX1}</span>
          );
        }
      },
    },
    {
      field: "LOSS_SX2",
      headerName: "LOSS_SX2(%)",
      width: 100,
      renderCell: (params: any) => {
        if (params.row.LOSS_SX2 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return (
            <span style={{ fontWeight: "bold" }}>{params.row.LOSS_SX2}</span>
          );
        }
      },
    },
    {
      field: "LOSS_SX3",
      headerName: "LOSS_SX3(%)",
      width: 100,
      renderCell: (params: any) => {
        if (params.row.LOSS_SX3 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return (
            <span style={{ fontWeight: "bold" }}>{params.row.LOSS_SX3}</span>
          );
        }
      },
    },
    {
      field: "LOSS_SX4",
      headerName: "LOSS_SX4(%)",
      width: 100,
      renderCell: (params: any) => {
        if (params.row.LOSS_SX4 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return (
            <span style={{ fontWeight: "bold" }}>{params.row.LOSS_SX4}</span>
          );
        }
      },
    },
    {
      field: "LOSS_SETTING1",
      headerName: "LOSS_SETTING1(m)",
      width: 130,
      renderCell: (params: any) => {
        if (params.row.LOSS_SETTING1 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return (
            <span style={{ fontWeight: "bold" }}>
              {params.row.LOSS_SETTING1}
            </span>
          );
        }
      },
    },
    {
      field: "LOSS_SETTING2",
      headerName: "LOSS_SETTING2(m)",
      width: 130,
      renderCell: (params: any) => {
        if (params.row.LOSS_SETTING2 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return (
            <span style={{ fontWeight: "bold" }}>
              {params.row.LOSS_SETTING2}
            </span>
          );
        }
      },
    },
    {
      field: "LOSS_SETTING3",
      headerName: "LOSS_SETTING3(m)",
      width: 130,
      renderCell: (params: any) => {
        if (params.row.LOSS_SETTING3 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return (
            <span style={{ fontWeight: "bold" }}>
              {params.row.LOSS_SETTING3}
            </span>
          );
        }
      },
    },
    {
      field: "LOSS_SETTING4",
      headerName: "LOSS_SETTING4(m)",
      width: 130,
      renderCell: (params: any) => {
        if (params.row.LOSS_SETTING4 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return (
            <span style={{ fontWeight: "bold" }}>
              {params.row.LOSS_SETTING4}
            </span>
          );
        }
      },
    },
    {
      field: "LOSS_ST_SX1",
      headerName: "LOSS_SETTING_SX1(m)",
      width: 130,
      renderCell: (params: any) => {
        if (params.row.LOSS_ST_SX1 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return (
            <span style={{ fontWeight: "bold" }}>{params.row.LOSS_ST_SX1}</span>
          );
        }
      },
    },
    {
      field: "LOSS_ST_SX2",
      headerName: "LOSS_SETTING_SX2(m)",
      width: 130,
      renderCell: (params: any) => {
        if (params.row.LOSS_ST_SX2 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return (
            <span style={{ fontWeight: "bold" }}>{params.row.LOSS_ST_SX2}</span>
          );
        }
      },
    },
    {
      field: "LOSS_ST_SX3",
      headerName: "LOSS_SETTING_SX3(m)",
      width: 130,
      renderCell: (params: any) => {
        if (params.row.LOSS_ST_SX3 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return (
            <span style={{ fontWeight: "bold" }}>{params.row.LOSS_ST_SX3}</span>
          );
        }
      },
    },
    {
      field: "LOSS_ST_SX4",
      headerName: "LOSS_SETTING_SX4(m)",
      width: 130,
      renderCell: (params: any) => {
        if (params.row.LOSS_ST_SX4 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return (
            <span style={{ fontWeight: "bold" }}>{params.row.LOSS_ST_SX4}</span>
          );
        }
      },
    },
    { field: "NOTE", headerName: "NOTE", width: 150 },
  ];
  let column_codeinfo2 = [
    {
      field: "id", headerName: "ID", width: 70, editable: enableEdit, headerCheckboxSelection: true,
      checkboxSelection: true,
    },
    { field: "G_CODE", headerName: "G_CODE", width: 80, editable: enableEdit },
    {
      field: "G_NAME",
      headerName: "G_NAME",
      flex: 1,
      minWidth: 120,
      editable: enableEdit,
    },
    {
      field: "G_NAME_KD",
      headerName: "G_NAME_KD",
      width: 100,
      editable: enableEdit,
    },
    {
      field: "DESCR",
      headerName: "DESCR",
      width: 120,
      editable: enableEdit,
    },
    {
      field: "PROD_TYPE",
      headerName: "PROD_TYPE",
      width: 60,
      editable: enableEdit,
    },
    {
      field: "PACKING_TYPE",
      headerName: "PACKING_TYPE",
      width: 80,
      editable: enableEdit,
    },
    {
      field: "BEP",
      headerName: "BEP",
      width: 50,
      editable: enableEdit,
    },
    {
      field: "LOSS_KT",
      headerName: "LOSS_KT",
      width: 80,
      editable: enableEdit,
    },
    {
      field: "PROD_LAST_PRICE",
      headerName: "MIN_PRICE",
      width: 80,
      editable: enableEdit,
    },
    { field: "PD", headerName: "PD", width: 50, editable: enableEdit },
    { field: "CAVITY", headerName: "CAVITY", width: 50, editable: enableEdit },
    {
      field: "PACKING_QTY",
      headerName: "PACKING_QTY",
      width: 70,
      editable: enableEdit,
    },
    {
      field: "G_WIDTH",
      headerName: "G_WIDTH",
      width: 60,
      editable: enableEdit,
    },
    {
      field: "G_LENGTH",
      headerName: "G_LENGTH",
      width: 60,
      editable: enableEdit,
    },
    {
      field: "PROD_PROJECT",
      headerName: "PROD_PROJECT",
      width: 100,
      editable: enableEdit,
    },
    {
      field: "PROD_MODEL",
      headerName: "PROD_MODEL",
      width: 100,
      editable: enableEdit,
    },
    {
      field: "M_NAME_FULLBOM",
      headerName: "FULLBOM",
      flex: 1,
      minWidth: 150,
      editable: enableEdit,
    },
    {
      field: "BANVE",
      headerName: "BANVE",
      width: 260,
      cellRenderer: (params: any) => {
        let file: any = null;
        useEffect(() => {
        }, [rows]);
        const uploadFile2: any = async (e: any) => {
          //console.log(file);
          checkBP(userData, ["RND", "KD"], ["ALL"], ["ALL"], async () => {
            uploadQuery(file, params.data.G_CODE + ".pdf", "banve")
              .then((response) => {
                if (response.data.tk_status !== "NG") {
                  generalQuery("update_banve_value", {
                    G_CODE: params.data.G_CODE,
                    banvevalue: "Y",
                  })
                    .then((response) => {
                      if (response.data.tk_status !== "NG") {
                        Swal.fire(
                          "Thông báo",
                          "Upload bản vẽ thành công",
                          "success",
                        );
                        console.log("G_CODE AAAA", params.data.G_CODE);
                        console.log("rows", rows);
                        let tempcodeinfodatatable = rows.map(
                          (element: CODE_FULL_INFO, index: number) => {
                            console.log("element G_CODE", element.G_CODE);
                            return element.G_CODE === params.data.G_CODE
                              ? { ...element, BANVE: "Y" }
                              : element;
                          },
                        );
                        console.log(tempcodeinfodatatable);
                        setRows(tempcodeinfodatatable);
                      } else {
                        Swal.fire(
                          "Thông báo",
                          "Upload bản vẽ thất bại",
                          "error",
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
                    "error",
                  );
                }
              })
              .catch((error) => {
                console.log(error);
              });
          });
        };
        let hreftlink = "/banve/" + params.data.G_CODE + ".pdf";
        if (params.data.BANVE !== "N" && params.data.BANVE !== null) {
          return (
            <div>
              <IconButton
                className="buttonIcon"
                onClick={(e) => {
                  f_downloadFile(hreftlink, params.data.G_CODE + "_" + params.data.G_NAME + ".pdf");
                }}>
                Download{` `}<BiDownload color="green" size={20} />
              </IconButton>
            </div>
          );
          /* return (
            <span style={{ color: "gray" }}>
              <a target="_blank" rel="noopener noreferrer" href={hreftlink}>
                LINK
              </a>
            </span>
          ); */
        } else {
          return (
            <div className="uploadfile">
              <IconButton className="buttonIcon" onClick={(e) => {
                uploadFile2(e);
              }}
              >
                <AiOutlineCloudUpload color="yellow" size={15} />
                Upload
              </IconButton>
              <input
                accept=".pdf"
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
      editable: enableEdit,
    },
    {
      field: "APPSHEET",
      headerName: "APPSHEET",
      width: 260,
      cellRenderer: (params: any) => {
        let file: any = null;
        const uploadFile2: any = async (e: any) => {
          //console.log(file);
          checkBP(userData, ["RND", "KD"], ["ALL"], ["ALL"], async () => {
            uploadQuery(file, "Appsheet_" + params.data.G_CODE + ".docx", "appsheet")
              .then((response) => {
                if (response.data.tk_status !== "NG") {
                  generalQuery("update_appsheet_value", {
                    G_CODE: params.data.G_CODE,
                    appsheetvalue: "Y",
                  })
                    .then((response) => {
                      if (response.data.tk_status !== "NG") {
                        Swal.fire(
                          "Thông báo",
                          "Upload Appsheet thành công",
                          "success",
                        );
                        /* let tempcodeinfodatatable = rows.map(
                          (element: CODE_FULL_INFO, index: number) => {
                            console.log("element G_CODE", element.G_CODE);
                            return element.G_CODE === params.data.G_CODE
                              ? { ...element, APPSHEET: "Y" }
                              : element;
                          },
                        );                        
                        setRows(tempcodeinfodatatable); */
                      } else {
                        Swal.fire(
                          "Thông báo",
                          "Upload appsheet thất bại",
                          "error",
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
                    "error",
                  );
                }
              })
              .catch((error) => {
                console.log(error);
              });
          });
        };
        let hreftlink = "/appsheet/Appsheet_" + params.data.G_CODE + ".docx";
        if (params.data.APPSHEET !== "N" && params.data.APPSHEET !== null) {
          return (
            <div>
              <IconButton
                className="buttonIcon"
                onClick={(e) => {
                  f_downloadFile(hreftlink, params.data.G_CODE + "_" + params.data.G_NAME + ".docx");
                }}>
                Download{` `}<BiDownload color="green" size={20} />
              </IconButton>
            </div>
            /*  <span style={{ color: "gray" }}>
               <a target="_blank" rel="noopener noreferrer" href={hreftlink}>
                 LINK
               </a>
             </span> */
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
                accept=".docx"
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
      editable: enableEdit,
    },
    {
      field: "NO_INSPECTION",
      headerName: "KT NGOAI QUAN",
      width: 120,
      cellRenderer: (params: any) => {
        if (params.data.NO_INSPECTION !== "Y")
          return <span style={{ color: "green" }}>Kiểm tra</span>;
        return <span style={{ color: "red" }}>Không kiểm tra</span>;
      },
      editable: enableEdit,
    },
    {
      field: "USE_YN",
      headerName: "SỬ DỤNG",
      width: 80,
      cellRenderer: (params: any) => {
        if (params.data.USE_YN !== "Y")
          return <span style={{ color: "red" }}>KHÓA</span>;
        return <span style={{ color: "green" }}>MỞ</span>;
      },
      editable: true,
    },
    {
      field: "PDBV",
      headerName: "PD BANVE",
      width: 80,
      cellRenderer: (params: any) => {
        if (
          params.data.PDBV === "P" ||
          params.data.PDBV === "R" ||
          params.data.PDBV === null
        )
          return (
            <span style={{ color: "red" }}>
              <b>PENDING</b>
            </span>
          );
        return (
          <span style={{ color: "green" }}>
            <b>APPROVED</b>
          </span>
        );
      },
    },
    { field: "QL_HSD", headerName: "QL_HSD", width: 80, },
    { field: "EXP_DATE", headerName: "EXP_DATE", width: 80, },
    {
      field: "TENCODE",
      headerName: "TENCODE",
      flex: 1,
      minWidth: 250,
      editable: enableEdit,
      cellRenderer: (params: any) => {
        return <span style={{ color: "black" }}>{params.data.G_NAME}</span>;
      },
    },
    {
      field: "PROD_DIECUT_STEP",
      headerName: "BC DIECUT",
      width: 120,
      cellRenderer: (params: any) => {
        if (params.data.PROD_DIECUT_STEP === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return (
            <span style={{ fontWeight: "bold" }}>
              {params.data.PROD_DIECUT_STEP}
            </span>
          );
        }
      },
    },
    {
      field: "PROD_PRINT_TIMES",
      headerName: "SO LAN IN",
      width: 120,
      cellRenderer: (params: any) => {
        if (params.data.PROD_PRINT_TIMES === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return (
            <span style={{ fontWeight: "bold" }}>
              {params.data.PROD_PRINT_TIMES}
            </span>
          );
        }
      },
    },
    {
      field: "FACTORY",
      headerName: "FACTORY",
      width: 100,
      cellRenderer: (params: any) => {
        if (params.data.FACTORY === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return (
            <span style={{ fontWeight: "bold" }}>{params.data.FACTORY}</span>
          );
        }
      },
    },
    {
      field: "EQ1",
      headerName: "EQ1",
      width: 80,
      cellRenderer: (params: any) => {
        if (params.data.EQ1 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return <span style={{ fontWeight: "bold" }}>{params.data.EQ1}</span>;
        }
      },
    },
    {
      field: "EQ2",
      headerName: "EQ2",
      width: 80,
      cellRenderer: (params: any) => {
        if (params.data.EQ2 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return <span style={{ fontWeight: "bold" }}>{params.data.EQ2}</span>;
        }
      },
    },
    {
      field: "EQ3",
      headerName: "EQ3",
      width: 80,
      cellRenderer: (params: any) => {
        if (params.data.EQ3 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return <span style={{ fontWeight: "bold" }}>{params.data.EQ3}</span>;
        }
      },
    },
    {
      field: "EQ4",
      headerName: "EQ4",
      width: 80,
      cellRenderer: (params: any) => {
        if (params.data.EQ4 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return <span style={{ fontWeight: "bold" }}>{params.data.EQ4}</span>;
        }
      },
    },
    {
      field: "Setting1",
      headerName: "Setting1",
      width: 100,
      cellRenderer: (params: any) => {
        if (params.data.Setting1 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return (
            <span style={{ fontWeight: "bold" }}>{params.data.Setting1}</span>
          );
        }
      },
    },
    {
      field: "Setting2",
      headerName: "Setting2",
      width: 100,
      cellRenderer: (params: any) => {
        if (params.data.Setting2 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return (
            <span style={{ fontWeight: "bold" }}>{params.data.Setting2}</span>
          );
        }
      },
    },
    {
      field: "Setting3",
      headerName: "Setting3",
      width: 100,
      cellRenderer: (params: any) => {
        if (params.data.Setting3 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return (
            <span style={{ fontWeight: "bold" }}>{params.data.Setting3}</span>
          );
        }
      },
    },
    {
      field: "Setting4",
      headerName: "Setting4",
      width: 100,
      cellRenderer: (params: any) => {
        if (params.data.Setting4 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return (
            <span style={{ fontWeight: "bold" }}>{params.data.Setting4}</span>
          );
        }
      },
    },
    {
      field: "UPH1",
      headerName: "UPH1",
      width: 80,
      cellRenderer: (params: any) => {
        if (params.data.UPH1 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return <span style={{ fontWeight: "bold" }}>{params.data.UPH1}</span>;
        }
      },
    },
    {
      field: "UPH2",
      headerName: "UPH2",
      width: 80,
      cellRenderer: (params: any) => {
        if (params.data.UPH2 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return <span style={{ fontWeight: "bold" }}>{params.data.UPH2}</span>;
        }
      },
    },
    {
      field: "UPH3",
      headerName: "UPH3",
      width: 80,
      cellRenderer: (params: any) => {
        if (params.data.UPH3 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return <span style={{ fontWeight: "bold" }}>{params.data.UPH3}</span>;
        }
      },
    },
    {
      field: "UPH4",
      headerName: "UPH4",
      width: 80,
      cellRenderer: (params: any) => {
        if (params.data.UPH4 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return <span style={{ fontWeight: "bold" }}>{params.data.UPH4}</span>;
        }
      },
    },
    {
      field: "Step1",
      headerName: "Step1",
      width: 80,
      cellRenderer: (params: any) => {
        if (params.data.Step1 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return <span style={{ fontWeight: "bold" }}>{params.data.Step1}</span>;
        }
      },
    },
    {
      field: "Step2",
      headerName: "Step2",
      width: 80,
      cellRenderer: (params: any) => {
        if (params.data.Step2 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return <span style={{ fontWeight: "bold" }}>{params.data.Step2}</span>;
        }
      },
    },
    {
      field: "Step3",
      headerName: "Step3",
      width: 80,
      cellRenderer: (params: any) => {
        if (params.data.Step3 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return <span style={{ fontWeight: "bold" }}>{params.data.Step3}</span>;
        }
      },
    },
    {
      field: "Step4",
      headerName: "Step4",
      width: 80,
      cellRenderer: (params: any) => {
        if (params.data.Step4 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return <span style={{ fontWeight: "bold" }}>{params.data.Step4}</span>;
        }
      },
    },
    {
      field: "LOSS_SX1",
      headerName: "LOSS_SX1(%)",
      width: 100,
      cellRenderer: (params: any) => {
        if (params.data.LOSS_SX1 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return (
            <span style={{ fontWeight: "bold" }}>{params.data.LOSS_SX1}</span>
          );
        }
      },
    },
    {
      field: "LOSS_SX2",
      headerName: "LOSS_SX2(%)",
      width: 100,
      cellRenderer: (params: any) => {
        if (params.data.LOSS_SX2 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return (
            <span style={{ fontWeight: "bold" }}>{params.data.LOSS_SX2}</span>
          );
        }
      },
    },
    {
      field: "LOSS_SX3",
      headerName: "LOSS_SX3(%)",
      width: 100,
      cellRenderer: (params: any) => {
        if (params.data.LOSS_SX3 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return (
            <span style={{ fontWeight: "bold" }}>{params.data.LOSS_SX3}</span>
          );
        }
      },
    },
    {
      field: "LOSS_SX4",
      headerName: "LOSS_SX4(%)",
      width: 100,
      cellRenderer: (params: any) => {
        if (params.data.LOSS_SX4 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return (
            <span style={{ fontWeight: "bold" }}>{params.data.LOSS_SX4}</span>
          );
        }
      },
    },
    {
      field: "LOSS_SETTING1",
      headerName: "LOSS_SETTING1(m)",
      width: 130,
      cellRenderer: (params: any) => {
        if (params.data.LOSS_SETTING1 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return (
            <span style={{ fontWeight: "bold" }}>
              {params.data.LOSS_SETTING1}
            </span>
          );
        }
      },
    },
    {
      field: "LOSS_SETTING2",
      headerName: "LOSS_SETTING2(m)",
      width: 130,
      cellRenderer: (params: any) => {
        if (params.data.LOSS_SETTING2 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return (
            <span style={{ fontWeight: "bold" }}>
              {params.data.LOSS_SETTING2}
            </span>
          );
        }
      },
    },
    {
      field: "LOSS_SETTING3",
      headerName: "LOSS_SETTING3(m)",
      width: 130,
      cellRenderer: (params: any) => {
        if (params.data.LOSS_SETTING3 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return (
            <span style={{ fontWeight: "bold" }}>
              {params.data.LOSS_SETTING3}
            </span>
          );
        }
      },
    },
    {
      field: "LOSS_SETTING4",
      headerName: "LOSS_SETTING4(m)",
      width: 130,
      cellRenderer: (params: any) => {
        if (params.data.LOSS_SETTING4 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return (
            <span style={{ fontWeight: "bold" }}>
              {params.data.LOSS_SETTING4}
            </span>
          );
        }
      },
    },
    {
      field: "LOSS_ST_SX1",
      headerName: "LOSS_SETTING_SX1(m)",
      width: 130,
      cellRenderer: (params: any) => {
        if (params.data.LOSS_ST_SX1 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return (
            <span style={{ fontWeight: "bold" }}>{params.data.LOSS_ST_SX1}</span>
          );
        }
      },
    },
    {
      field: "LOSS_ST_SX2",
      headerName: "LOSS_SETTING_SX2(m)",
      width: 130,
      cellRenderer: (params: any) => {
        if (params.data.LOSS_ST_SX2 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return (
            <span style={{ fontWeight: "bold" }}>{params.data.LOSS_ST_SX2}</span>
          );
        }
      },
    },
    {
      field: "LOSS_ST_SX3",
      headerName: "LOSS_SETTING_SX3(m)",
      width: 130,
      cellRenderer: (params: any) => {
        if (params.data.LOSS_ST_SX3 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return (
            <span style={{ fontWeight: "bold" }}>{params.data.LOSS_ST_SX3}</span>
          );
        }
      },
    },
    {
      field: "LOSS_ST_SX4",
      headerName: "LOSS_SETTING_SX4(m)",
      width: 130,
      cellRenderer: (params: any) => {
        if (params.data.LOSS_ST_SX4 === null) {
          return (
            <span style={{ backgroundColor: "red", fontWeight: "bold", color: 'white' }}>
              NG
            </span>
          );
        } else {
          return (
            <span style={{ fontWeight: "bold" }}>{params.data.LOSS_ST_SX4}</span>
          );
        }
      },
    },
    { field: "INSPECT_SPEED", headerName: "INSPECT_SPEED", width: 80, cellRenderer: (params: any) => (<span style={{ fontWeight: "bold" }}>{params.data.INSPECT_SPEED?.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>) },
    { field: "NOTE", headerName: "NOTE", width: 150 },
  ];
  const [rows, setRows] = useState<CODE_FULL_INFO[]>([]);
  const [columns, setColumns] = useState<Array<any>>(column_codeinfo2);
  const [columnDefinition, setColumnDefinition] = useState<Array<any>>(column_codeinfo2);
  const handleCODEINFO = async () => {
    Swal.fire({
      title: "Tra data",
      text: "Đang tra data",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });
    setisLoading(true);
    setColumnDefinition(column_codeinfo);
    setRows(await f_getCodeInfo({
      G_NAME: codeCMS,
      CNDB: cndb,
      ACTIVE_ONLY: activeOnly
    }));
    setisLoading(false);
  };
  const handleSearchCodeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      handleCODEINFO();
    }
  };
  useEffect(() => { }, []);
  return (
    <div className="codemanager">
      <div className="tracuuFcst">
        <div className="tracuuFcstTable">
          <div className="toolbar">
            <div className="searchdiv">
              <input
                className="checkbox1"
                type="checkbox"
                placeholder="Active"
                checked={cndb}
                onChange={(e) => setCNDB(e.target.checked)}
              ></input>
              <label>
                <b>Code:</b>{" "}
                <input
                  type="text"
                  placeholder="Nhập code vào đây"
                  value={codeCMS}
                  onChange={(e) => setCodeCMS(e.target.value)}
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                ></input>
              </label>
              Active
              <input
                className="checkbox1"
                type="checkbox"
                placeholder="Active"
                checked={activeOnly}
                onChange={(e) => setActiveOnly(e.target.checked)}
              ></input>
              <button
                className="traxuatkiembutton"
                onClick={() => {
                  handleCODEINFO();
                }}
              >
                Tìm code
              </button>
            </div>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                SaveExcel(rows, "Code Info Table");
              }}
            >
              <AiFillFileExcel color="green" size={15} />
              SAVE
            </IconButton>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                f_setNgoaiQuan(codedatatablefilter, "N");
              }}
            >
              <AiFillCheckCircle color="blue" size={15} />
              SET NGOAI QUAN
            </IconButton>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                f_setNgoaiQuan(codedatatablefilter, "Y");
              }}
            >
              <FcCancel color="green" size={15} />
              SET K NGOAI QUAN
            </IconButton>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                f_resetBanVe(codedatatablefilter, "N");
              }}
            >
              <BiReset color="green" size={15} />
              RESET BẢN VẼ
            </IconButton>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                f_pdBanVe(codedatatablefilter, "Y");
              }}
            >
              <MdOutlineDraw color="red" size={15} />
              PDUYET BẢN VẼ
            </IconButton>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                f_handleSaveQLSX(codedatatablefilter);
              }}
            >
              <MdUpdate color="blue" size={15} />
              Update TT QLSX
            </IconButton>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                setColumns(
                  columns.map((element, index: number) => {
                    return { ...element, editable: !element.editable };
                  }),
                );
                Swal.fire("Thông báo", "Bật/Tắt chế độ sửa", "success");
              }}
            >
              <AiFillEdit color="yellow" size={15} />
              Bật tắt sửa
            </IconButton>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                f_handleSaveLossSX(codedatatablefilter);
              }}
            >
              <MdUpdate color="blue" size={15} />
              Update LOSS SX
            </IconButton>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                f_updateBEP(codedatatablefilter);
              }}
            >
              <MdPriceChange color="red" size={15} />
              Update BEP
            </IconButton>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                f_updateLossKT(codedatatablefilter);
              }}
            >
              <MdUpdate color="red" size={15} />
              Update LOSS KT
            </IconButton>
          </div>
          <AGTable
            showFilter={true}
            columns={column_codeinfo2}
            data={rows}
            onCellEditingStopped={(params: any) => {
            }} onRowClick={(params: any) => {
              //console.log(e.data)
            }} onSelectionChange={(params: any) => {
              setCodeDataTableFilter(params!.api.getSelectedRows());
              //console.log(e!.api.getSelectedRows())
            }} />
        </div>
      </div>
    </div>
  );
};
export default CODE_MANAGER;
import { IconButton } from "@mui/material";
import {

  GridSelectionModel,  
  GridToolbarContainer,  
  GridToolbarQuickFilter,  
  GridCellEditCommitParams,  
} from "@mui/x-data-grid";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { FcCancel, } from "react-icons/fc";
import {
  AiFillCheckCircle,
  AiFillEdit,
  AiFillFileExcel,  
  AiOutlineCloudUpload,
} from "react-icons/ai";
import Swal from "sweetalert2";
import { generalQuery, getCompany, uploadQuery } from "../../../api/Api";
import { UserContext } from "../../../api/Context";
import { SaveExcel, checkBP } from "../../../api/GlobalFunction";
import "./CODE_MANAGER.scss";
import { BiReset } from "react-icons/bi";
import { MdOutlineDraw, MdPriceChange, MdUpdate } from "react-icons/md";
import { UserData } from "../../../api/GlobalInterface";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { CODE_FULL_INFO } from "../../../api/GlobalInterface";
import AGTable from "../../../components/DataTable/AGTable";
const CODE_MANAGER = () => {  
  const [uploadfile, setUploadFile] = useState<any>(null);
  const [codedatatablefilter, setCodeDataTableFilter] = useState<
    Array<CODE_FULL_INFO>
  >([]);
  const [selection, setSelection] = useState<any>({
    trapo: true,
    thempohangloat: false,
    them1po: false,
    them1invoice: false,
    testinvoicetable: false,
  });
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData,
  );
  const [isLoading, setisLoading] = useState(false);
  const [codeCMS, setCodeCMS] = useState("");
  const [enableEdit, setEnableEdit] = useState(true);
  const [isPending, startTransition] = useTransition();
  const handleUploadFile = (ulf: any, newfilename: string) => {
    console.log(ulf);
    uploadQuery(uploadfile, newfilename, "banve")
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          Swal.fire("Thông báo", "Upload file thành công", "success");
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
  };
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
    {field: "QL_HSD",headerName: "QL_HSD",width: 80,},
    {field: "EXP_DATE",headerName: "EXP_DATE",width: 80,},
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
    { field: "id", headerName: "ID", width: 70, editable: enableEdit, headerCheckboxSelection: true, 
    checkboxSelection: true,  },
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
      cellRenderer: (params: any) => {
        let file: any = null;
        useEffect(()=> {         
        },[rows]);

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
            <span style={{ color: "gray" }}>
              <a target="_blank" rel="noopener noreferrer" href={hreftlink}>
                LINK
              </a>
            </span>
          );
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
    {field: "QL_HSD",headerName: "QL_HSD",width: 80,},
    {field: "EXP_DATE",headerName: "EXP_DATE",width: 80,},
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
            <span style={{ backgroundColor: "red", fontWeight: "bold", color:'white' }}>
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
    { field: "NOTE", headerName: "NOTE", width: 150 },
  ];
  const [rows, setRows] = useState<CODE_FULL_INFO[]>([]);
  const [columns, setColumns] = useState<Array<any>>(column_codeinfo2);
  const [editedRows, setEditedRows] = useState<Array<GridCellEditCommitParams>>(
    [],
  );
  const [columnDefinition, setColumnDefinition] =
    useState<Array<any>>(column_codeinfo2);
  function CustomToolbarPOTable() {
    return (
      <GridToolbarContainer>
        <IconButton
          className="buttonIcon"
          onClick={() => {
            SaveExcel(rows, "Code Info Table");
          }}
        >
          <AiFillFileExcel color="green" size={15} />                  
        </IconButton>
        <IconButton
          className="buttonIcon"          
          onClick={() => {
            setNgoaiQuan("N");
          }}
        >
          <AiFillCheckCircle color="blue" size={15}/>
          SET NGOAI QUAN
        </IconButton>
        <IconButton
          className="buttonIcon"
          onClick={() => {
            setNgoaiQuan("Y");
          }}
        >
          <FcCancel color="green" size={15} />
          SET K NGOAI QUAN
        </IconButton>
        <IconButton
          className="buttonIcon"
          onClick={() => {
            resetBanVe("N");
          }}
        >
          <BiReset color="green" size={15} />
          RESET BẢN VẼ
        </IconButton>
        <IconButton
          className="buttonIcon"
          onClick={() => {
            pdBanVe("Y");
          }}
        >
          <MdOutlineDraw color="red" size={15} />
          PDUYET BẢN VẼ
        </IconButton>
        <IconButton
          className="buttonIcon"
          onClick={() => {
            handleSaveQLSX();
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
        <GridToolbarQuickFilter />
        <IconButton
          className="buttonIcon"
          onClick={() => {
            handleSaveLossSX();
          }}
        >
          <MdUpdate color="blue" size={15} />
          Update LOSS SX
        </IconButton>
        <IconButton
          className="buttonIcon"
          onClick={() => {
            updateBEP();
          }}
        >
          <MdPriceChange  color="red" size={15} />
          Update BEP
        </IconButton>
      </GridToolbarContainer>
    );
  }
  const rowStyle = { backgroundColor: 'transparent', height: '20px' };
  const getRowStyle = (params: any) => {
    return { backgroundColor: 'white', fontSize: '0.6rem' };
    /* if (params.data.M_ID % 2 === 0) {
        return { backgroundColor: 'white', fontSize:'0.6rem'};
    }
    else {
      return { backgroundColor: '#fbfbfb',fontSize:'0.6rem' };
    } */
  };
  const onSelectionChanged = useCallback(() => {
    const selectedrow = gridRef.current!.api.getSelectedRows();
    setCodeDataTableFilter(selectedrow);    
  }, []);
  function setIdText(id: string, value: string | number | undefined) {
    document.getElementById(id)!.textContent =
      value == undefined ? "undefined" : value + "";
  }
  const setHeaderHeight = useCallback((value?: number) => {
    gridRef.current!.api.setGridOption("headerHeight", value);
    setIdText("headerHeight", value);
  }, []);
  const gridRef = useRef<AgGridReact<CODE_FULL_INFO>>(null);
  const defaultColDef = useMemo(() => {
    return {
      initialWidth: 100,
      wrapHeaderText: true,
      autoHeaderHeight: false,
      editable: true,
      floatingFilter: true,
      filter: true,
    };
  }, []);
  const resetBanVe = async (value: string) => {
    if (codedatatablefilter.length >= 1) {
      checkBP(userData, ["RND", "KD"], ["ALL"], ["ALL"], async () => {
        for (let i = 0; i < codedatatablefilter.length; i++) {
          await generalQuery("resetbanve", {
            G_CODE: codedatatablefilter[i].G_CODE,
            VALUE: value,
          })
            .then((response) => {
              console.log(response.data.tk_status);
              if (response.data.tk_status !== "NG") {
                //Swal.fire("Thông báo", "Delete Po thành công", "success");
              } else {
                //Swal.fire("Thông báo", "Update PO thất bại: " +response.data.message , "error");
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
        Swal.fire("Thông báo", "RESET BAN VE THÀNH CÔNG", "success");
      });
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 G_CODE để SET !", "error");
    }
  };
  const updateBEP = async () => {
    if (codedatatablefilter.length >= 1) {
      checkBP(userData, ["KD"], ["ALL"], ["ALL"], async () => {
        for (let i = 0; i < codedatatablefilter.length; i++) {
          await generalQuery("updateBEP", {
            G_CODE: codedatatablefilter[i].G_CODE,
            BEP: codedatatablefilter[i].BEP ?? 0,
          })
            .then((response) => {
              console.log(response.data.tk_status);
              if (response.data.tk_status !== "NG") {
                //Swal.fire("Thông báo", "Delete Po thành công", "success");
              } else {
                //Swal.fire("Thông báo", "Update PO thất bại: " +response.data.message , "error");
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
        Swal.fire("Thông báo", "Update BEP THÀNH CÔNG", "success");
      });
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 G_CODE để Update !", "error");
    }
  };
  const pdBanVe = async (value: string) => {
    if (codedatatablefilter.length >= 1) {
      checkBP(userData, ["QC"], ["Leader", "Sub Leader"], ["ALL"], async () => {
        for (let i = 0; i < codedatatablefilter.length; i++) {
          await generalQuery("pdbanve", {
            G_CODE: codedatatablefilter[i].G_CODE,
            VALUE: value,
          })
            .then((response) => {
              console.log(response.data.tk_status);
              if (response.data.tk_status !== "NG") {
                //Swal.fire("Thông báo", "Delete Po thành công", "success");
              } else {
                //Swal.fire("Thông báo", "Update PO thất bại: " +response.data.message , "error");
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
        Swal.fire("Thông báo", "Phê duyệt Bản Vẽ THÀNH CÔNG", "success");
      });
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 G_CODE để Phê Duyệt !", "error");
    }
  };
  const handleCODEINFO = () => {
    setisLoading(true);
    setColumnDefinition(column_codeinfo);
    generalQuery("codeinfo", {
      G_NAME: codeCMS,
    })
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: CODE_FULL_INFO[] = response.data.data.map(
            (element: CODE_FULL_INFO, index: number) => {
              return {
                ...element,
                id: index,
              };
            },
          );
          setRows(loadeddata);
          //setCODEINFODataTable(loadeddata);
          setisLoading(false);
          Swal.fire(
            "Thông báo",
            "Đã load " + response.data.data.length + " dòng",
            "success",
          );
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
          setisLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const setNav = (choose: number) => {
    if (choose === 1) {
      setSelection({
        ...selection,
        trapo: true,
        thempohangloat: false,
        them1po: false,
        them1invoice: false,
        testinvoicetable: false,
      });
    } else if (choose === 2) {
      setSelection({
        ...selection,
        trapo: false,
        thempohangloat: true,
        them1po: false,
        them1invoice: false,
        testinvoicetable: false,
      });
    } else if (choose === 3) {
      setSelection({
        ...selection,
        trapo: false,
        thempohangloat: false,
        them1po: false,
        them1invoice: false,
        testinvoicetable: true,
      });
    }
  };
  const handleCODESelectionforUpdate = (ids: GridSelectionModel) => {
    const selectedID = new Set(ids);
    let datafilter = rows.filter((element: CODE_FULL_INFO) =>
      selectedID.has(element.id === undefined ? 0 : element.id),
    );
    //console.log(datafilter);
    if (datafilter.length > 0) {
      setCodeDataTableFilter(datafilter);
    } else {
      setCodeDataTableFilter([]);
    }
  };
  const setNgoaiQuan = async (value: string) => {
    if (codedatatablefilter.length >= 1) {
      checkBP(userData, ["RND", "KD"], ["ALL"], ["ALL"], async () => {
        for (let i = 0; i < codedatatablefilter.length; i++) {
          await generalQuery("setngoaiquan", {
            G_CODE: codedatatablefilter[i].G_CODE,
            VALUE: value,
          })
            .then((response) => {
              console.log(response.data.tk_status);
              if (response.data.tk_status !== "NG") {
                //Swal.fire("Thông báo", "Delete Po thành công", "success");
              } else {
                //Swal.fire("Thông báo", "Update PO thất bại: " +response.data.message , "error");
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
        Swal.fire(
          "Thông báo",
          "SET TRẠNG KIỂM TRA NGOẠI QUAN THÀNH CÔNG",
          "success",
        );
      });
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 G_CODE để SET !", "error");
    }
  };
  const handleSaveQLSX = async () => {
    if (codedatatablefilter.length >= 1) {
      checkBP(userData, ["QLSX", "KD", "RND"], ["ALL"], ["ALL"], async () => {
        let err_code: string = "0";
        for (let i = 0; i < codedatatablefilter.length; i++) {
          await generalQuery("saveQLSX", {
            G_CODE: codedatatablefilter[i].G_CODE,
            PROD_DIECUT_STEP: codedatatablefilter[i].PROD_DIECUT_STEP,
            PROD_PRINT_TIMES: codedatatablefilter[i].PROD_PRINT_TIMES,
            FACTORY: codedatatablefilter[i].FACTORY,
            EQ1: codedatatablefilter[i].EQ1,
            EQ2: codedatatablefilter[i].EQ2,
            EQ3: codedatatablefilter[i].EQ3,
            EQ4: codedatatablefilter[i].EQ4,
            Setting1: codedatatablefilter[i].Setting1,
            Setting2: codedatatablefilter[i].Setting2,
            Setting3: codedatatablefilter[i].Setting3,
            Setting4: codedatatablefilter[i].Setting4,
            UPH1: codedatatablefilter[i].UPH1,
            UPH2: codedatatablefilter[i].UPH2,
            UPH3: codedatatablefilter[i].UPH3,
            UPH4: codedatatablefilter[i].UPH4,
            Step1: codedatatablefilter[i].Step1,
            Step2: codedatatablefilter[i].Step2,
            Step3: codedatatablefilter[i].Step3,
            Step4: codedatatablefilter[i].Step4,
            LOSS_SX1: codedatatablefilter[i].LOSS_SX1,
            LOSS_SX2: codedatatablefilter[i].LOSS_SX2,
            LOSS_SX3: codedatatablefilter[i].LOSS_SX3,
            LOSS_SX4: codedatatablefilter[i].LOSS_SX4,
            LOSS_SETTING1: codedatatablefilter[i].LOSS_SETTING1,
            LOSS_SETTING2: codedatatablefilter[i].LOSS_SETTING2,
            LOSS_SETTING3: codedatatablefilter[i].LOSS_SETTING3,
            LOSS_SETTING4: codedatatablefilter[i].LOSS_SETTING4,
            NOTE: codedatatablefilter[i].NOTE,
          })
            .then((response) => {
              console.log(response.data.tk_status);
              if (response.data.tk_status !== "NG") {
              } else {
                err_code = "1";
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
        if (err_code === "1") {
          Swal.fire(
            "Thông báo",
            "Lưu thất bại, không được để trống đỏ ô nào",
            "error",
          );
        } else {
          Swal.fire("Thông báo", "Lưu thành công", "success");
          setCodeDataTableFilter([]);
        }
      });
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 G_CODE để SET !", "error");
    }
  };
  const handleSaveLossSX = async () => {
    if (codedatatablefilter.length >= 1) {
      checkBP(userData, ["SX"], ["ALL"], ["ALL"], async () => {
        let err_code: string = "0";
        for (let i = 0; i < codedatatablefilter.length; i++) {
          await generalQuery("saveLOSS_SETTING_SX", {
            G_CODE: codedatatablefilter[i].G_CODE,
            LOSS_ST_SX1: codedatatablefilter[i].LOSS_ST_SX1,
            LOSS_ST_SX2: codedatatablefilter[i].LOSS_ST_SX2,
            LOSS_ST_SX3: codedatatablefilter[i].LOSS_ST_SX3,
            LOSS_ST_SX4: codedatatablefilter[i].LOSS_ST_SX4,
          })
            // eslint-disable-next-line no-loop-func
            .then((response) => {
              console.log(response.data.tk_status);
              if (response.data.tk_status !== "NG") {
              } else {
                err_code = "1";
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
        if (err_code === "1") {
          Swal.fire(
            "Thông báo",
            "Lưu thất bại, không được để trống đỏ ô nào",
            "error",
          );
        } else {
          Swal.fire("Thông báo", "Lưu thành công", "success");
          setCodeDataTableFilter([]);
        }
      });
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 G_CODE để SET !", "error");
    }
  };
  const handleSearchCodeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      handleCODEINFO();
    }
  };
  useEffect(() => {}, []);
  return (
    <div className="codemanager"> 
        <div className="tracuuFcst">          
          <div className="tracuuFcstTable">
            {/* <DataGrid
              components={{
                Toolbar: CustomToolbarPOTable,
                LoadingOverlay: LinearProgress,
              }}
              sx={{ fontSize: "0.7rem" }}
              loading={isLoading}
              rowHeight={30}
              rows={rows}
              columns={columns}
              checkboxSelection
              onSelectionModelChange={(ids) => {
                handleCODESelectionforUpdate(ids);
              }}
              disableSelectionOnClick={true}             
              rowsPerPageOptions={[
                5, 10, 50, 100, 500, 1000, 5000, 10000, 100000,
              ]}
              editMode="cell"              
              onCellEditCommit={(
                params: GridCellEditCommitParams,
                event: MuiEvent<MuiBaseEvent>,
                details: GridCallbackDetails,
              ) => {                
                let tempeditrows = editedRows;
                tempeditrows.push(params);
                setEditedRows(tempeditrows);               
                const keyvar = params.field;
                const newdata = rows.map((p) =>
                  p.id === params.id ? { ...p, [keyvar]: params.value } : p,
                );
                startTransition(() => {
                  setRows(newdata);
                });
              }}
            /> */}
            <div className="toolbar">
              <div className="searchdiv">
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
                  setNgoaiQuan("N");
                }}
              >
                <AiFillCheckCircle color="blue" size={15} />
                SET NGOAI QUAN
              </IconButton>
              <IconButton
                className="buttonIcon"
                onClick={() => {
                  setNgoaiQuan("Y");
                }}
              >
                <FcCancel color="green" size={15} />
                SET K NGOAI QUAN
              </IconButton>
              <IconButton
                className="buttonIcon"
                onClick={() => {
                  resetBanVe("N");
                }}
              >
                <BiReset color="green" size={15} />
                RESET BẢN VẼ
              </IconButton>
              <IconButton
                className="buttonIcon"
                onClick={() => {
                  pdBanVe("Y");
                }}
              >
                <MdOutlineDraw color="red" size={15} />
                PDUYET BẢN VẼ
              </IconButton>
              <IconButton
                className="buttonIcon"
                onClick={() => {
                  handleSaveQLSX();
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
                  handleSaveLossSX();
                }}
              >
                <MdUpdate color="blue" size={15} />
                Update LOSS SX
              </IconButton>
              <IconButton
                className="buttonIcon"
                onClick={() => {
                  updateBEP();
                }}
              >
                <MdPriceChange color="red" size={15} />
                Update BEP
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

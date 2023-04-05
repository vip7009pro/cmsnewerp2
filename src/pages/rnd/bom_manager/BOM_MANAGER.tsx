import {
  Autocomplete,
  Checkbox,
  FormControlLabel,
  IconButton,
  keyframes,
  LinearProgress,
  TextField,
} from "@mui/material";
import {
  DataGrid,
  GridSelectionModel,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
  GridColumns,
  GridRowsProp,
  GridCellEditStopParams,
  MuiEvent,
  GridCellEditStopReasons,
  GridCellEditCommitParams,
  MuiBaseEvent,
  GridCallbackDetails,
} from "@mui/x-data-grid";
import moment from "moment";
import {
  useContext,
  useEffect,
  useReducer,
  useState,
  useTransition,
} from "react";
import { FcCancel, FcDeleteRow, FcSearch } from "react-icons/fc";
import {
  AiFillCheckCircle,
  AiFillDelete,
  AiFillEdit,
  AiFillFileAdd,
  AiFillFileExcel,
  AiFillSave,
  AiOutlineCheck,
  AiOutlineCloudUpload,
  AiOutlinePushpin,
} from "react-icons/ai";
import Swal from "sweetalert2";
import { generalQuery } from "../../../api/Api";
import { UserContext } from "../../../api/Context";
import { checkBP, SaveExcel } from "../../../api/GlobalFunction";
import "./BOM_MANAGER.scss";
import { BiAddToQueue, BiReset } from "react-icons/bi";
import { MdOutlineDraw, MdOutlineUpdate, MdUpgrade } from "react-icons/md";
import { FaRegClone } from "react-icons/fa";
import MATERIAL_MANAGER from "../material_manager/MATERIAL_MANAGER";
const axios = require("axios").default;
interface CODE_INFO {
  id: number;
  G_CODE: string;
  G_NAME: string;
  G_NAME_KD: string;
  PROD_TYPE: string;
  PROD_LAST_PRICE: number;
  PD: number;
  CAVITY: number;
  PACKING_QTY: number;
  G_WIDTH: number;
  G_LENGTH: number;
  PROD_PROJECT: string;
  PROD_MODEL: string;
  M_NAME_FULLBOM: string;
  BANVE: string;
  NO_INSPECTION: string;
  USE_YN: string;
}
interface CODE_FULL_INFO {
  CUST_CD?: string;
  PROD_PROJECT?: string;
  PROD_MODEL?: string;
  CODE_12: string;
  PROD_TYPE: string;
  G_NAME_KD?: string;
  DESCR?: string;
  PROD_MAIN_MATERIAL?: string;
  G_NAME?: string;
  G_LENGTH?: number;
  G_WIDTH?: number;
  PD?: number;
  G_C?: number;
  G_C_R?: number;
  G_CG?: number;
  G_LG?: number;
  G_SG_L?: number;
  G_SG_R?: number;
  PACK_DRT?: string;
  KNIFE_TYPE?: number;
  KNIFE_LIFECYCLE?: number;
  KNIFE_PRICE?: number;
  CODE_33?: string;
  ROLE_EA_QTY?: number;
  RPM?: number;
  PIN_DISTANCE?: number;
  PROCESS_TYPE?: string;
  EQ1?: string;
  EQ2?: string;
  PROD_DIECUT_STEP?: number;
  PROD_PRINT_TIMES?: number;
  REMK?: string;
  USE_YN?: string;
  PO_TYPE?: string;
  G_CODE: string;
}
interface CustomerListData {
  CUST_CD: string;
  CUST_NAME_KD: string;
  CUST_NAME: string;
}
interface BOM_SX {
  id: string;
  G_CODE?: string;
  G_NAME?: string;
  G_NAME_KD?: string;
  RIV_NO?: string;
  M_CODE?: string;
  M_NAME?: string;
  WIDTH_CD?: number;
  M_QTY?: number;
  MAIN_M: string;
  LIEUQL_SX: number;
  INS_EMPL?: string;
  INS_DATE?: string;
  UPD_EMPL?: string;
  UPD_DATE?: string;
}
interface BOM_GIA {
  id: string;
  BOM_ID?: string;
  G_CODE?: string;
  RIV_NO?: string;
  G_SEQ?: string;
  CATEGORY?: number;
  M_CODE?: string;
  M_NAME?: string;
  CUST_CD?: string;
  IMPORT_CAT?: string;
  M_CMS_PRICE?: number;
  M_SS_PRICE?: number;
  M_SLITTING_PRICE?: number;
  USAGE?: string;
  MAIN_M: string;
  MAT_MASTER_WIDTH?: number;
  MAT_CUTWIDTH?: number;
  MAT_ROLL_LENGTH?: number;
  MAT_THICKNESS?: number;
  M_QTY?: number;
  REMARK?: string;
  PROCESS_ORDER?: number;
  INS_EMPL?: string;
  UPD_EMPL?: string;
  INS_DATE?: string;
  UPD_DATE?: string;
}
interface MaterialListData {
  M_CODE: string;
  M_NAME: string;
  WIDTH_CD: number;
}
interface MATERIAL_INFO {
  M_ID: number,
  M_NAME: string, 
  CUST_CD: string,
  SSPRICE: number,
  CMSPRICE: number,
  SLITTING_PRICE: number,
  MASTER_WIDTH: number,
  ROLL_LENGTH: number
}
const BOM_MANAGER = () => {
  const [codedatatablefilter, setCodeDataTableFilter] = useState<
    Array<CODE_INFO>
  >([]);
  const [bomsxdatatablefilter, setBomSXDataTableFilter] = useState<
    Array<BOM_SX>
  >([]);
  const [bomgiadatatablefilter, setBomGiaDataTableFilter] = useState<
    Array<BOM_GIA>
  >([]);
  const [codefullinfo, setCodeFullInfo] = useState<CODE_FULL_INFO>({
    CUST_CD: "0000",
    PROD_PROJECT: "",
    PROD_MODEL: "",
    CODE_12: "7",
    PROD_TYPE: "TSP",
    G_NAME_KD: "",
    DESCR: "",
    PROD_MAIN_MATERIAL: "",
    G_NAME: "",
    G_LENGTH: 0,
    G_WIDTH: 0,
    PD: 0,
    G_C: 0,
    G_C_R: 0,
    G_CG: 0,
    G_LG: 0,
    G_SG_L: 0,
    G_SG_R: 0,
    PACK_DRT: "1",
    KNIFE_TYPE: 0,
    KNIFE_LIFECYCLE: 0,
    KNIFE_PRICE: 0,
    CODE_33: "02",
    ROLE_EA_QTY: 0,
    RPM: 0,
    PIN_DISTANCE: 0,
    PROCESS_TYPE: "",
    EQ1: "NA",
    EQ2: "NA",
    PROD_DIECUT_STEP: 0,
    PROD_PRINT_TIMES: 0,
    REMK: "",
    USE_YN: "N",
    G_CODE: "-------",
    PO_TYPE:'E1'
  });
  const [bomsxtable, setBOMSXTable] = useState<BOM_SX[]>([]);
  const [bomgiatable, setBOMGIATable] = useState<BOM_GIA[]>([]);
  const [customerList, setCustomerList] = useState<CustomerListData[]>([]);
  const [selectedCust_CD, setSelectedCust_CD] =
    useState<CustomerListData | null>();
  const [materialList, setMaterialList] = useState<MaterialListData[]>([
    {
      M_CODE: "A0000001",
      M_NAME: "#200",
      WIDTH_CD: 1200,
    },
  ]);
  const [selectedMaterial, setSelectedMaterial] =
    useState<MaterialListData | null>({
      M_CODE: "A0000001",
      M_NAME: "#200",
      WIDTH_CD: 1200,
    });
  const [selection, setSelection] = useState<any>({
    trapo: true,
    thempohangloat: false,
    them1po: false,
    them1invoice: false,
    testinvoicetable: false,
  });
  const [userData, setUserData] = useContext(UserContext);
  const [isLoading, setisLoading] = useState(false);
  const [codeCMS, setCodeCMS] = useState("");
  const [enableEdit, setEnableEdit] = useState(false);
  const [enableform, setEnableForm] = useState(true);
  const [rows, setRows] = useState<CODE_INFO[]>([]);
  const [editedRows, setEditedRows] = useState<Array<GridCellEditCommitParams>>(
    []
  );
  const [editedBOMSXRows, setEditedBOMSXRows] = useState<
    Array<GridCellEditCommitParams>
  >([]);
  const [editedBOMGIARows, setEditedBOMGIARows] = useState<
    Array<GridCellEditCommitParams>
  >([]);
  const handleSetCodeInfo = (keyname: string, value: any) => {
    let tempcodefullinfo = { ...codefullinfo, [keyname]: value };
    //console.log(tempcodefullinfo);
    setCodeFullInfo(tempcodefullinfo);
  };
  const [pinBOM, setPINBOM] = useState(false);
  const [column_codeinfo, setcolumn_codeinfo] = useState<Array<any>>([
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
        let upload_url = "http://14.160.33.94:5011/upload";
        const uploadFile = async (e: any) => {
          console.log(file);
          const formData = new FormData();
          formData.append("banve", file);
          formData.append("filename", params.row.G_CODE);
          if (
            userData.MAINDEPTNAME === "KD" ||
            userData.MAINDEPTNAME === "RND"
          ) {
            try {
              const response = await axios.post(upload_url, formData);
              //console.log("ket qua");
              //console.log(response);
              if (response.data.tk_status === "OK") {
                //Swal.fire('Thông báo','Upload bản vẽ thành công','success');
                generalQuery("update_banve_value", {
                  G_CODE: params.row.G_CODE,
                  banvevalue: "Y",
                })
                  .then((response) => {
                    if (response.data.tk_status !== "NG") {
                      Swal.fire(
                        "Thông báo",
                        "Upload bản vẽ thành công",
                        "success"
                      );
                      let tempcodeinfodatatable = rows.map((element, index) => {
                        return element.G_CODE === params.row.G_CODE
                          ? { ...element, BANVE: "Y" }
                          : element;
                      });
                      setRows(tempcodeinfodatatable);
                    } else {
                      Swal.fire("Thông báo", "Upload bản vẽ thất bại", "error");
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              } else {
                Swal.fire("Thông báo", response.data.message, "error");
              }
              //console.log(response.data);
            } catch (ex) {
              console.log(ex);
            }
          } else {
            Swal.fire(
              "Thông báo",
              "Chỉ bộ phận kinh doanh upload được bản vẽ",
              "error"
            );
          }
        };
        let hreftlink = "/banve/" + params.row.G_CODE + ".pdf";
        if (params.row.BANVE !== "N" && params.row.BANVE !== null) {
          return (
            <span style={{ color: "gray" }}>
              <a target='_blank' rel='noopener noreferrer' href={hreftlink}>
                LINK
              </a>
            </span>
          );
        } else {
          return (
            <div className='uploadfile'>
              <IconButton className='buttonIcon' onClick={uploadFile}>
                <AiOutlineCloudUpload color='yellow' size={25} />
                Upload
              </IconButton>
              <input
                accept='.pdf'
                type='file'
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
  ]);
  const [column_bomsx, setcolumn_bomsx] = useState<Array<any>>([
    {
      field: "M_CODE",
      headerName: "M_CODE",
      width: 80,
      renderCell: (params: any) => {
        return <span style={{ color: "blue" }}>{params.row.M_CODE} </span>;
      },
      editable: enableEdit,
    },
    {
      field: "M_NAME",
      headerName: "M_NAME",
      width: 110,
      renderCell: (params: any) => {
        return <span style={{ color: "red" }}>{params.row.M_NAME} </span>;
      },
      editable: enableEdit,
    },
    { field: "WIDTH_CD", headerName: "SIZE", width: 80, editable: enableEdit },
    { field: "M_QTY", headerName: "M_QTY", width: 80, editable: enableEdit },
    {
      field: "LIEUQL_SX",
      headerName: "LIEUQL_SX",
      width: 80,
      editable: enableEdit,
    },
    { field: "MAIN_M", headerName: "MAIN_M", width: 80, editable: enableEdit },
    {
      field: "INS_EMPL",
      headerName: "INS_EMPL",
      width: 80,
      editable: enableEdit,
    },
    {
      field: "INS_DATE",
      headerName: "INS_DATE",
      width: 150,
      editable: enableEdit,
    },
    {
      field: "UPD_EMPL",
      headerName: "UPD_EMPL",
      width: 80,
      editable: enableEdit,
    },
    {
      field: "UPD_DATE",
      headerName: "UPD_DATE",
      width: 150,
      editable: enableEdit,
    },
  ]);
  const [column_bomgia, setcolumn_bomgia] = useState<Array<any>>([
    { field: "M_CODE", headerName: "M_CODE", width: 80, editable: enableEdit },
    { field: "M_NAME", headerName: "M_NAME", width: 150, editable: enableEdit },
    {
      field: "CUST_CD",
      headerName: "Vendor",
      width: 80,
      editable: enableEdit,
      renderCell: (params: any) => {
        if (params.row.CUST_CD === "") {
          return <span style={{ backgroundColor: "red" }}>NG</span>;
        } else {
          return <span>{params.row.CUST_CD}</span>;
        }
      },
    },
    {
      field: "USAGE",
      headerName: "USAGE",
      width: 80,
      editable: enableEdit,
      renderCell: (params: any) => {
        if (params.row.USAGE === "") {
          return <span style={{ backgroundColor: "red" }}>NG</span>;
        } else {
          return <span>{params.row.USAGE}</span>;
        }
      },
    },
    { field: "MAIN_M", headerName: "MAIN_M", width: 80, editable: enableEdit },
    {
      field: "MAT_MASTER_WIDTH",
      headerName: "Khổ liệu",
      width: 80,
      editable: enableEdit,
      renderCell: (params: any) => {
        if (params.row.MAT_MASTER_WIDTH === 0) {
          return <span style={{ backgroundColor: "red" }}>NG</span>;
        } else {
          return <span>{params.row.MAT_MASTER_WIDTH}</span>;
        }
      },
    },
    {
      field: "MAT_CUTWIDTH",
      headerName: "Khổ SD",
      width: 80,
      editable: enableEdit,
    },
    {
      field: "MAT_ROLL_LENGTH",
      headerName: "Dài liệu",
      width: 110,
      editable: enableEdit,
      renderCell: (params: any) => {
        if (params.row.MAT_ROLL_LENGTH === 0) {
          return <span style={{ backgroundColor: "red" }}>NG</span>;
        } else {
          return <span>{params.row.MAT_ROLL_LENGTH}</span>;
        }
      },
    },    
    { field: "M_QTY", headerName: "M_QTY", width: 80, editable: enableEdit },
    { field: "REMARK", headerName: "REMARK", width: 80, editable: enableEdit },
    {
      field: "PROCESS_ORDER",
      headerName: "Thứ tự",
      width: 80,
      editable: enableEdit,
    },
  ]);
  function CustomToolbarPOTable() {
    return (
      <GridToolbarContainer>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            SaveExcel(rows, "Code Info Table");
          }}
        >
          <AiFillFileExcel color='green' size={25} />
          SAVE
        </IconButton>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            confirmResetBanVe();
          }}
        >
          <BiReset color='green' size={25} />
          RESET BẢN VẼ
        </IconButton>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            setEnableForm(!enableform);
            Swal.fire("Thông báo", "Bật/Tắt chế độ sửa", "success");
          }}
        >
          <AiFillEdit color='yellow' size={25} />
          Bật tắt sửa
        </IconButton>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            setPINBOM(!pinBOM);
            Swal.fire("Thông báo", "Ghim/ bỏ ghim BOM thành công", "success");
          }}
        >
          <AiOutlinePushpin color='red' size={25} />
          Ghim BOM
        </IconButton>
        <GridToolbarQuickFilter />
      </GridToolbarContainer>
    );
  }
  function CustomToolbarBOMSXTable() {
    return (
      <GridToolbarContainer>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            SaveExcel(rows, "Code Info Table");
          }}
        >
          <AiFillFileExcel color='green' size={20} />
          EXCEL
        </IconButton>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            confirmSaveBOMSX();
          }}
        >
          <AiFillSave color='blue' size={20} />
          Lưu BOM
        </IconButton>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            handleAddNewLineBOMSX();
          }}
        >
          <BiAddToQueue color='yellow' size={20} />
          Thêm dòng
        </IconButton>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            handle_DeleteLineBOMSX();
          }}
        >
          <FcDeleteRow color='yellow' size={20} />
          Xóa dòng
        </IconButton>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            setcolumn_bomsx(
              column_bomsx.map((element, index: number) => {
                return { ...element, editable: !element.editable };
              })
            );
            Swal.fire("Thông báo", "Bật/Tắt chế độ sửa", "success");
          }}
        >
          <AiFillEdit color='yellow' size={20} />
          Bật tắt sửa
        </IconButton>
        <GridToolbarQuickFilter />
      </GridToolbarContainer>
    );
  }
  function CustomToolbarBOMGIATable() {
    return (
      <GridToolbarContainer>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            SaveExcel(rows, "Code Info Table");
          }}
        >
          <AiFillFileExcel color='green' size={20} />
          EXCEL
        </IconButton>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            confirmSaveBOMGIA();
          }}
        >
          <AiFillSave color='blue' size={20} />
          Lưu BOM
        </IconButton>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            handleAddNewLineBOMGIA();
          }}
        >
          <BiAddToQueue color='yellow' size={20} />
          Thêm dòng
        </IconButton>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            handle_DeleteLineBOMGIA();
          }}
        >
          <FcDeleteRow color='yellow' size={20} />
          Xóa dòng
        </IconButton>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            setcolumn_bomgia(
              column_bomgia.map((element, index: number) => {
                return { ...element, editable: !element.editable };
              })
            );
            Swal.fire("Thông báo", "Bật/Tắt chế độ sửa", "success");
          }}
        >
          <AiFillEdit color='yellow' size={25} />
          Bật tắt sửa
        </IconButton>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            confirmCloneBOMSX();
          }}
        >
          <FaRegClone color='red' size={20} />
          Clone BOMSX
        </IconButton>
        <GridToolbarQuickFilter />
      </GridToolbarContainer>
    );
  }
  const resetBanVe = async (value: string) => {
    if (codedatatablefilter.length >= 1) {
      if (
        userData.EMPL_NO.toUpperCase() === "NVH1011" ||
        userData.EMPL_NO.toUpperCase() === "NHU1903" ||
        userData.EMPL_NO.toUpperCase() === "LVT1906"
      ) {
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
      } else {
        Swal.fire("Thông báo", "Không đủ quyền hạn!", "error");
      }
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 G_CODE để SET !", "error");
    }
  };
  const handleGETBOMSX = (G_CODE: string) => {
    setisLoading(true);
    generalQuery("getbomsx", {
      G_CODE: G_CODE,
    })
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: BOM_SX[] = response.data.data.map(
            (element: BOM_SX, index: number) => {
              return {
                ...element,
                INS_DATE: moment
                  .utc(element.INS_DATE)
                  .format("YYYY-MM-DD HH:mm:ss"),
                UPD_DATE: moment
                  .utc(element.UPD_DATE)
                  .format("YYYY-MM-DD HH:mm:ss"),
                id: index,
              };
            }
          );
          setBOMSXTable(loadeddata);
          setisLoading(false);
        } else {
          //Swal.fire("Thông báo", "Lỗi BOM SX: " + response.data.message, "error");
          setBOMSXTable([]);
          setisLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleGETBOMGIA = (G_CODE: string) => {
    setisLoading(true);
    generalQuery("getbomgia", {
      G_CODE: G_CODE,
    })
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: BOM_GIA[] = response.data.data.map(
            (element: BOM_GIA, index: number) => {
              return {
                ...element,
                INS_DATE: moment
                  .utc(element.INS_DATE)
                  .format("YYYY-MM-DD HH:mm:ss"),
                UPD_DATE: moment
                  .utc(element.UPD_DATE)
                  .format("YYYY-MM-DD HH:mm:ss"),
                id: index,
              };
            }
          );
          setBOMGIATable(loadeddata);
          setisLoading(false);
        } else {
          //Swal.fire("Thông báo", "Lỗi BOM SX: " + response.data.message, "error");
          setBOMGIATable([]);
          setisLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleCODEINFO = () => {
    setisLoading(true);
    generalQuery("codeinfo", {
      G_NAME: codeCMS,
    })
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: CODE_INFO[] = response.data.data.map(
            (element: CODE_INFO, index: number) => {
              return {
                ...element,
                id: index,
              };
            }
          );
          setRows(loadeddata);
          //setCODEINFODataTable(loadeddata);
          setisLoading(false);
          Swal.fire(
            "Thông báo",
            "Đã load " + response.data.data.length + " dòng",
            "success"
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
  const getcustomerlist = () => {
    generalQuery("selectcustomerList", {})
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          setCustomerList(response.data.data);
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getmateriallist = () => {
    generalQuery("getMaterialList", {})
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);
          setMaterialList(response.data.data);
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handlecodefullinfo = (G_CODE: string) => {
    generalQuery("getcodefullinfo", {
      G_CODE: G_CODE,
    })
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data[0]);
          let loaded_data: CODE_FULL_INFO[] = response.data.data.map(
            (element: CODE_FULL_INFO, index: number) => {
              return {
                ...element,
                PROD_TYPE: element.PROD_TYPE.trim(),
                id: index,
              };
            }
          );
          //console.log(loaded_data[0]);
          setCodeFullInfo(loaded_data[0]);
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
          setisLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleCODESelectionforUpdate = (ids: GridSelectionModel) => {
    const selectedID = new Set(ids);
    let datafilter = rows.filter((element: CODE_INFO) =>
      selectedID.has(element.id)
    );
    if (datafilter.length > 0) {
      //console.log(datafilter);
      setCodeDataTableFilter(datafilter);
      if (!pinBOM) {
        handleGETBOMSX(datafilter[0].G_CODE);
        handleGETBOMGIA(datafilter[0].G_CODE);
      }
      //console.log(datafilter[0]);
      handlecodefullinfo(datafilter[0].G_CODE);
    } else {
      setCodeDataTableFilter([]);
    }
  };
  const handleBOMSXSelectionforUpdate = (ids: GridSelectionModel) => {
    const selectedID = new Set(ids);
    let datafilter = bomsxtable.filter((element: BOM_SX) =>
      selectedID.has(element.id)
    );
    if (datafilter.length > 0) {
      //console.log(datafilter);
      setBomSXDataTableFilter(datafilter);
    } else {
      setBomSXDataTableFilter([]);
    }
  };
  const handleBOMGIASelectionforUpdate = (ids: GridSelectionModel) => {
    const selectedID = new Set(ids);
    let datafilter = bomgiatable.filter((element: BOM_GIA) =>
      selectedID.has(element.id)
    );
    if (datafilter.length > 0) {
      //console.log(datafilter);
      setBomGiaDataTableFilter(datafilter);
    } else {
      setBomGiaDataTableFilter([]);
    }
  };
  const handleClearInfo = () => {
    setCodeFullInfo({
      CUST_CD: "0000",
      PROD_PROJECT: "",
      PROD_MODEL: "",
      CODE_12: "7",
      PROD_TYPE: "TSP",
      G_NAME_KD: "",
      DESCR: "",
      PROD_MAIN_MATERIAL: "",
      G_NAME: "",
      G_LENGTH: 0,
      G_WIDTH: 0,
      PD: 0,
      G_C: 0,
      G_C_R: 0,
      G_CG: 0,
      G_LG: 0,
      G_SG_L: 0,
      G_SG_R: 0,
      PACK_DRT: "",
      KNIFE_TYPE: 0,
      KNIFE_LIFECYCLE: 0,
      KNIFE_PRICE: 0,
      CODE_33: "02",
      ROLE_EA_QTY: 0,
      RPM: 0,
      PIN_DISTANCE: 0,
      PROCESS_TYPE: "",
      EQ1: "NO",
      EQ2: "NO",
      PROD_DIECUT_STEP: 0,
      PROD_PRINT_TIMES: 0,
      REMK: "",
      USE_YN: "Y",
      G_CODE: "",
    });
  };
  const handleCheckCodeInfo = () => {
    let abc: CODE_FULL_INFO = codefullinfo;
    let result: boolean = true;
    for (const [k, v] of Object.entries(abc)) {
      if (
        (v === null || v === "") &&
        k !== "REMK" &&
        k !== "FACTORY" &&
        k !== "Setting1" &&
        k !== "Setting2" &&
        k !== "UPH1" &&
        k !== "UPH2" &&
        k !== "Step1" &&
        k !== "Step2" &&
        k !== "LOSS_SX1" &&
        k !== "LOSS_SX2" &&
        k !== "LOSS_SETTING1" &&
        k !== "LOSS_SETTING2" &&
        k !== "NOTE"
      ) {
        Swal.fire("Thông báo", "Không được để trống: " + k, "error");
        result = false;
        break;
      }
    }
    return result;
  };
  const confirmAddNewCode = () => {
    Swal.fire({
      title: "Chắc chắn muốn thêm code mới ?",
      text: "Thêm rồi mà sai, sửa là hơi vất đấy",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn thêm!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành thêm", "Đang thêm Code mới", "success");
        checkBP(
          userData.EMPL_NO,
          userData.MAINDEPTNAME,
          ["RND"],
          handleAddNewCode
        );
        //handleAddNewCode();
      }
    });
  };
  const confirmAddNewVer = () => {
    Swal.fire({
      title: "Chắc chắn muốn thêm ver mới ?",
      text: "Thêm rồi mà sai, sửa là hơi vất đấy",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn thêm!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành thêm", "Đang thêm Ver mới", "success");
        checkBP(
          userData.EMPL_NO,
          userData.MAINDEPTNAME,
          ["RND"],
          handleAddNewVer
        );
        //handleAddNewVer();
      }
    });
  };
  const confirmUpdateCode = () => {
    Swal.fire({
      title: "Chắc chắn muốn update thông tin code ?",
      text: "Update thông tin code sẽ hủy phê duyệt bản vẽ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn update!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành Update", "Đang update code", "success");
        checkBP(
          userData.EMPL_NO,
          userData.MAINDEPTNAME,
          ["RND", "QLSX"],
          handleUpdateCode
        );
        //handleUpdateCode();
      }
    });
  };
  const zeroPad = (num: number, places: number) =>
    String(num).padStart(places, "0");
  const getNextG_CODE = async (CODE_12: string, CODE_27: string) => {
    let nextseq: string = "";
    let nextseqno: string = "";
    await generalQuery("getNextSEQ_G_CODE", {
      CODE_12: CODE_12,
      CODE_27: CODE_27,
    })
      .then((response) => {
        //console.log(response.data);
        let currentseq = response.data.data[0].LAST_SEQ_NO;
        if (response.data.tk_status !== "NG") {
          if (CODE_12 === "9") {
            nextseq = zeroPad(Number(currentseq) + 1, 6);
            nextseqno = nextseq;
          } else {
            nextseq = zeroPad(Number(currentseq) + 1, 5) + "A";
            nextseqno = zeroPad(Number(currentseq) + 1, 5);
          }
        } else {
          //Swal.fire("Thông báo", "Lỗi BOM SX: " + response.data.message, "error");
          if (CODE_12 === "9") {
            nextseq = "000001";
            nextseqno = nextseq;
          } else {
            nextseq = "00001A";
            nextseqno = "00001";
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return { NEXT_G_CODE: CODE_12 + CODE_27 + nextseq, NEXT_SEQ_NO: nextseqno };
  };
  const handleAddNewCode = async () => {
    console.log(handleCheckCodeInfo());
    if (handleCheckCodeInfo()) {
      let CODE_27 = "C";
      if (
        codefullinfo.PROD_TYPE.trim() === "TSP" ||
        codefullinfo.PROD_TYPE.trim() === "OLED" ||
        codefullinfo.PROD_TYPE.trim() === "UV"
      ) {
        CODE_27 = "C";
      } else if (codefullinfo.PROD_TYPE.trim() === "LABEL") {
        CODE_27 = "A";
      } else if (codefullinfo.PROD_TYPE.trim() === "TAPE") {
        CODE_27 = "B";
      } else if (codefullinfo.PROD_TYPE.trim() === "RIBBON") {
        CODE_27 = "E";
      }
      let nextcodeinfo = await await getNextG_CODE(
        codefullinfo.CODE_12,
        CODE_27
      );
      let nextcode = nextcodeinfo.NEXT_G_CODE;
      let nextgseqno = nextcodeinfo.NEXT_SEQ_NO;
      //Swal.fire("Thông báo","Next code: " + nextcode,"success");
      await generalQuery("insertM100", {
        G_CODE: nextcode,
        CODE_27: CODE_27,
        NEXT_SEQ_NO: nextgseqno,
        CODE_FULL_INFO: codefullinfo,
      })
        .then((response) => {
          //console.log(response.data);
          if (response.data.tk_status !== "NG") {
            Swal.fire("Thông báo", "Code mới: " + nextcode, "success");
          } else {
            Swal.fire("Thông báo", "Lỗi: " + response.data.message, "error");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const handleAddNewVer = async () => {
    if (handleCheckCodeInfo()) {
      let CODE_27 = "C";
      if (
        codefullinfo.PROD_TYPE.trim() === "TSP" ||
        codefullinfo.PROD_TYPE.trim() === "OLED" ||
        codefullinfo.PROD_TYPE.trim() === "UV"
      ) {
        CODE_27 = "C";
      } else if (codefullinfo.PROD_TYPE.trim() === "LABEL") {
        CODE_27 = "A";
      } else if (codefullinfo.PROD_TYPE.trim() === "TAPE") {
        CODE_27 = "B";
      } else if (codefullinfo.PROD_TYPE.trim() === "RIBBON") {
        CODE_27 = "E";
      }
      let newGCODE = "";
      let nextseqno = "";
      let CURRENT_REV_NO = "";
      let NEXT_REV_NO = "";
      if (codefullinfo.CODE_12 === "9") {
        nextseqno = zeroPad(Number(codefullinfo.G_CODE.substring(2, 8)) + 1, 6);
        newGCODE = codefullinfo.CODE_12 + CODE_27 + nextseqno;
      } else {
        nextseqno = codefullinfo.G_CODE.substring(2, 7);
        CURRENT_REV_NO = codefullinfo.G_CODE.substring(7, 8);
        NEXT_REV_NO = String.fromCharCode(CURRENT_REV_NO.charCodeAt(0) + 1);
        newGCODE = codefullinfo.CODE_12 + CODE_27 + nextseqno + NEXT_REV_NO;
      }
      console.log(newGCODE);
      console.log(nextseqno);
      console.log("NEXT REV", NEXT_REV_NO);
      await generalQuery("insertM100_AddVer", {
        G_CODE: newGCODE,
        CODE_27: CODE_27,
        NEXT_SEQ_NO: nextseqno,
        REV_NO: NEXT_REV_NO,
        CODE_FULL_INFO: codefullinfo,
      })
        .then((response) => {
          //console.log(response.data);
          if (response.data.tk_status !== "NG") {
            Swal.fire("Thông báo", "Code ver mới: " + newGCODE, "success");
          } else {
            Swal.fire("Thông báo", "Lỗi: " + response.data.message, "error");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const handleUpdateCode = async () => {
    if (handleCheckCodeInfo()) {
      await generalQuery("updateM100", codefullinfo)
        .then((response) => {
          //console.log(response.data);
          if (response.data.tk_status !== "NG") {
            Swal.fire(
              "Thông báo",
              "Update thành công: " + codefullinfo.G_CODE,
              "success"
            );
          } else {
            Swal.fire("Thông báo", "Lỗi: " + response.data.message, "error");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const handleSearchCodeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      handleCODEINFO();
    }
  };
  const handleAddNewLineBOMSX = async () => {
    if (codedatatablefilter.length > 0) {
      let tempeditrows: BOM_SX = {
        id: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
        G_CODE: codefullinfo.G_CODE,
        G_NAME: codefullinfo?.G_NAME,
        G_NAME_KD: codefullinfo?.G_NAME_KD,
        RIV_NO: "A",
        M_CODE: selectedMaterial?.M_CODE,
        M_NAME: selectedMaterial?.M_NAME,
        WIDTH_CD: selectedMaterial?.WIDTH_CD,
        M_QTY: 1,
        MAIN_M: "0",
        LIEUQL_SX: 0,
        INS_EMPL: userData.EMPL_NO,
        INS_DATE: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
        UPD_EMPL: userData.EMPL_NO,
        UPD_DATE: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      };
      //console.log(tempeditrows);
      setBOMSXTable([...bomsxtable, tempeditrows]);
    } else {
      Swal.fire("Thông báo", "Chọn 1 code trong list để thêm liệu", "warning");
    }
  };
  const handle_DeleteLineBOMSX = () => {
    if (bomsxdatatablefilter.length > 0) {
      let datafilter = [...bomsxtable];
      for (let i = 0; i < bomsxdatatablefilter.length; i++) {
        for (let j = 0; j < datafilter.length; j++) {
          if (bomsxdatatablefilter[i].id === datafilter[j].id) {
            datafilter.splice(j, 1);
          }
        }
      }
      setBOMSXTable(datafilter);
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất một dòng để xóa", "error");
    }
  };
  const handleInsertBOMSX = async () => {
    if (bomgiatable.length > 0) {
      if (bomsxtable.length > 0) {
        //delete old bom from M140
        let err_code: string = "0";
        let total_lieuql_sx: number = 0;
        let check_lieuql_sx_sot: number = 0;
        let check_num_lieuql_sx: number = 1;
        let check_lieu_qlsx_khac1: number = 0;
        let m_list: string = "";
        //console.log(chithidatatable);
        for (let i = 0; i < bomsxtable.length; i++) {
          total_lieuql_sx += bomsxtable[i].LIEUQL_SX;
          if (bomsxtable[i].LIEUQL_SX > 1) check_lieu_qlsx_khac1 += 1;
        }
        for (let i = 0; i < bomsxtable.length; i++) {
          //console.log(bomsxtable[i].LIEUQL_SX);
          if (parseInt(bomsxtable[i].LIEUQL_SX.toString()) === 1) {
            for (let j = 0; j < bomsxtable.length; j++) {
              if (
                bomsxtable[j].M_NAME === bomsxtable[i].M_NAME &&
                parseInt(bomsxtable[j].LIEUQL_SX.toString()) === 0
              ) {
                check_lieuql_sx_sot += 1;
              }
            }
          }
        }
        //console.log('bang chi thi', bomsxtable);
        for (let i = 0; i < bomsxtable.length; i++) {
          if (parseInt(bomsxtable[i].LIEUQL_SX.toString()) === 1) {
            for (let j = 0; j < bomsxtable.length; j++) {
              if (parseInt(bomsxtable[j].LIEUQL_SX.toString()) === 1) {
                //console.log('i', bomsxtable[i].M_NAME);
                //console.log('j', bomsxtable[j].M_NAME);
                if (bomsxtable[i].M_NAME !== bomsxtable[j].M_NAME) {
                  check_num_lieuql_sx = 2;
                }
              }
            }
          }
        }
        //console.log('num lieu qlsx: ' + check_num_lieuql_sx);
        //console.log('tong lieu qly: '+ total_lieuql_sx);
        for (let i = 0; i < bomsxtable.length - 1; i++) {
          m_list += `'${bomsxtable[i].M_CODE}',`;
        }
        m_list += `'${bomsxtable[bomsxtable.length - 1].M_CODE}'`;
        console.log("m_list", m_list);
        if (
          total_lieuql_sx > 0 &&
          check_lieuql_sx_sot === 0 &&
          check_num_lieuql_sx === 1 &&
          check_lieu_qlsx_khac1 === 0
        ) {
        } else {
          err_code += " | Check lại liệu quản lý (liệu chính)";
        }
        if (err_code === "0") {
          await generalQuery("deleteM140_2", {
            G_CODE: codefullinfo.G_CODE,
            M_LIST: m_list,
          })
            .then((response) => {
              if (response.data.tk_status !== "NG") {
                //console.log(response.data.data);
              } else {
              }
            })
            .catch((error) => {
              console.log(error);
            });
          let max_g_seq: string = "001";
          await generalQuery("checkGSEQ_M140", {
            G_CODE: codefullinfo.G_CODE,
          })
            .then((response) => {
              if (response.data.tk_status !== "NG") {
                //console.log(response.data.data);
                max_g_seq = response.data.data[0].MAX_G_SEQ;
              } else {
                max_g_seq = "001";
              }
            })
            .catch((error) => {
              console.log(error);
            });
          for (let i = 0; i < bomsxtable.length; i++) {
            let check_M_CODE: boolean = false;
            await generalQuery("check_m_code_m140", {
              G_CODE: codefullinfo.G_CODE,
              M_CODE: bomsxtable[i].M_CODE,
            })
              .then((response) => {
                if (response.data.tk_status !== "NG") {
                  //console.log(response.data.data);
                  check_M_CODE = true;
                } else {
                  check_M_CODE = false;
                }
              })
              .catch((error) => {
                console.log(error);
              });
            if (check_M_CODE) {
              await generalQuery("update_M140", {
                G_CODE: codefullinfo.G_CODE,
                M_CODE: bomsxtable[i].M_CODE,
                M_QTY: bomsxtable[i].M_QTY,
                MAIN_M:
                  bomsxtable[i].MAIN_M === null ? "0" : bomsxtable[i].MAIN_M,
                LIEUQL_SX:
                  bomsxtable[i].LIEUQL_SX === null
                    ? "0"
                    : bomsxtable[i].LIEUQL_SX,
              })
                .then((response) => {
                  if (response.data.tk_status !== "NG") {
                    //console.log(response.data.data);
                  } else {
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
            } else {
              await generalQuery("insertM140", {
                G_CODE: codefullinfo.G_CODE,
                G_SEQ: zeroPad(parseInt(max_g_seq) + i + 1, 3),
                M_CODE: bomsxtable[i].M_CODE,
                M_QTY: bomsxtable[i].M_QTY,
                MAIN_M:
                  bomsxtable[i].MAIN_M === null ? "0" : bomsxtable[i].MAIN_M,
                LIEUQL_SX:
                  bomsxtable[i].LIEUQL_SX === null
                    ? "0"
                    : bomsxtable[i].LIEUQL_SX,
              })
                .then((response) => {
                  if (response.data.tk_status !== "NG") {
                    //console.log(response.data.data);
                  } else {
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          }
        } else {
          Swal.fire("Thông báo", "" + err_code, "error");
        }
      } else {
        Swal.fire("Thông báo", "Thêm ít nhất 1 liệu để lưu BOM", "warning");
      }
    } else {
      Swal.fire(
        "Thông báo",
        "Code chưa có BOM giá, phải thêm BOM giá trước",
        "warning"
      );
    }
  };
  const handleInsertBOMSX_WITH_GIA = async () => {
    if (bomsxtable.length <= 0) {
      if (bomgiatable.length > 0) {
        //delete old bom from M140
        await generalQuery("deleteM140", {
          G_CODE: codefullinfo.G_CODE,
        })
          .then((response) => {
            if (response.data.tk_status !== "NG") {
              //console.log(response.data.data);
            } else {
            }
          })
          .catch((error) => {
            console.log(error);
          });
        for (let i = 0; i < bomgiatable.length; i++) {
          await generalQuery("insertM140", {
            G_CODE: codefullinfo.G_CODE,
            G_SEQ: zeroPad(i + 1, 3),
            M_CODE: bomgiatable[i].M_CODE,
            M_QTY: bomgiatable[i].M_QTY,
            MAIN_M: bomgiatable[i].MAIN_M,
          })
            .then((response) => {
              if (response.data.tk_status !== "NG") {
                //console.log(response.data.data);
              } else {
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      } else {
        Swal.fire("Thông báo", "Thêm ít nhất 1 liệu để lưu BOM", "warning");
      }
    } else {
      Swal.fire(
        "Thông báo",
        "Code đã có BOM SX, Sẽ chỉ lưu lại bom giá mà ko lưu thêm BOM SX nữa",
        "warning"
      );
    }
  };
  const handleAddNewLineBOMGIA = async () => {
    if (codedatatablefilter.length > 0) {

      let selected_Material_Info: MATERIAL_INFO = {
        M_ID: 564,
        M_NAME: 'OS75-006WP', 
        CUST_CD: 'C-TECH',
        SSPRICE: 1.3,
        CMSPRICE: 1.234545455,
        SLITTING_PRICE: 0.054545455,
        MASTER_WIDTH: 1080,
        ROLL_LENGTH: 1000
      }
      await generalQuery("checkMaterialInfo", {
        M_NAME: selectedMaterial?.M_NAME,
      })
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            //console.log(response.data.data);
            selected_Material_Info = response.data.data[0];
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });


      let tempeditrows: BOM_GIA = {
        id: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
        BOM_ID: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
        G_CODE: codefullinfo.G_CODE,
        RIV_NO: "A",
        G_SEQ: zeroPad(bomgiatable.length + 1, 3),
        CATEGORY: 1,
        M_CODE: selectedMaterial?.M_CODE,
        M_NAME: selectedMaterial?.M_NAME,
        CUST_CD: selected_Material_Info.CUST_CD,
        IMPORT_CAT: "",
        M_CMS_PRICE: selected_Material_Info.CMSPRICE,
        M_SS_PRICE: selected_Material_Info.SSPRICE,
        M_SLITTING_PRICE: selected_Material_Info.SLITTING_PRICE,
        USAGE: "",
        MAIN_M: "0",
        MAT_MASTER_WIDTH: selected_Material_Info.MASTER_WIDTH,
        MAT_CUTWIDTH: selectedMaterial?.WIDTH_CD,
        MAT_ROLL_LENGTH: selected_Material_Info.ROLL_LENGTH,
        MAT_THICKNESS: 0,
        M_QTY: 1,
        REMARK: "",
        PROCESS_ORDER: bomgiatable.length + 1,
        INS_EMPL: userData.EMPL_NO,
        INS_DATE: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
        UPD_EMPL: userData.EMPL_NO,
        UPD_DATE: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      };
      //console.log(tempeditrows);
      setBOMGIATable([...bomgiatable, tempeditrows]);
    } else {
      Swal.fire("Thông báo", "Chọn 1 code trong list để thêm liệu", "warning");
    }
  };
  const handle_DeleteLineBOMGIA = () => {
    if (bomgiadatatablefilter.length > 0) {
      let datafilter = [...bomgiatable];
      for (let i = 0; i < bomgiadatatablefilter.length; i++) {
        for (let j = 0; j < datafilter.length; j++) {
          if (bomgiadatatablefilter[i].id === datafilter[j].id) {
            datafilter.splice(j, 1);
          }
        }
      }
      setBOMGIATable(datafilter);
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất một dòng để xóa", "error");
    }
  };
  const handleInsertBOMGIA = async () => {
    if (bomgiatable.length > 0) {
      //delete old bom from M140
      let err_code: string = "0";
      let checkMAIN_M: number = 0;
      for (let i = 0; i < bomgiatable.length; i++) {
        checkMAIN_M += parseInt(bomgiatable[i].MAIN_M);
        if (
          bomgiatable[i].CUST_CD === "" ||
          bomgiatable[i].USAGE === "" ||
          bomgiatable[i].MAT_MASTER_WIDTH === 0 ||
          bomgiatable[i].MAT_ROLL_LENGTH === 0        
        ) {
          err_code = "Không được để ô nào NG màu đỏ";
        }
      }
      console.log(checkMAIN_M);
      if (checkMAIN_M === 0) {
        err_code += "| Phải chỉ định liệu quản lý";
      }
      //console.log(err_code);
      if (err_code === "0") {
        console.log("vao bom gia insert");
        await generalQuery("deleteBOM2", {
          G_CODE: codefullinfo.G_CODE,
        })
          .then((response) => {
            if (response.data.tk_status !== "NG") {
              //console.log(response.data.data);
            } else {
            }
          })
          .catch((error) => {
            console.log(error);
          });
        for (let i = 0; i < bomgiatable.length; i++) {
          await generalQuery("insertBOM2", {
            G_CODE: codefullinfo.G_CODE,
            G_SEQ: zeroPad(i + 1, 3),
            M_CODE: bomgiatable[i].M_CODE,
            M_NAME: bomgiatable[i].M_NAME,
            CUST_CD: bomgiatable[i].CUST_CD,
            USAGE: bomgiatable[i].USAGE,
            MAIN_M: bomgiatable[i].MAIN_M,
            MAT_MASTER_WIDTH: bomgiatable[i].MAT_MASTER_WIDTH,
            MAT_CUTWIDTH: bomgiatable[i].MAT_CUTWIDTH,
            MAT_ROLL_LENGTH: bomgiatable[i].MAT_ROLL_LENGTH,
            MAT_THICKNESS: bomgiatable[i].MAT_THICKNESS,
            M_QTY: bomgiatable[i].M_QTY,
            PROCESS_ORDER: bomgiatable[i].PROCESS_ORDER,
            REMARK: bomgiatable[i].REMARK,
          })
            .then((response) => {
              if (response.data.tk_status !== "NG") {
                //console.log(response.data.data);
              } else {
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
        handleInsertBOMSX_WITH_GIA();
      } else {
        Swal.fire("Thông báo", err_code, "error");
      }
    } else {
      Swal.fire("Thông báo", "Thêm ít nhất 1 liệu để lưu BOM", "warning");
    }
  };
  const handleCloneBOMSXsangBOMGIA = async () => {
    if (bomsxtable.length > 0) {
      let tempBOMGIA: BOM_GIA[] = [];
      for (let i = 0; i < bomsxtable.length; i++) {
        let tempeditrows: BOM_GIA = {
          id:
            moment().format("YYYY-MM-DD HH:mm:ss.SSS") + bomsxtable[i]?.M_CODE,
          BOM_ID:
            moment().format("YYYY-MM-DD HH:mm:ss.SSS") + bomsxtable[i]?.M_CODE,
          G_CODE: codefullinfo.G_CODE,
          RIV_NO: "A",
          G_SEQ: zeroPad(bomgiatable.length + 1, 3),
          CATEGORY: 1,
          M_CODE: bomsxtable[i]?.M_CODE,
          M_NAME: bomsxtable[i]?.M_NAME,
          CUST_CD: "",
          IMPORT_CAT: "",
          M_CMS_PRICE: 0,
          M_SS_PRICE: 0,
          M_SLITTING_PRICE: 0,
          USAGE: "",
          MAIN_M: "0",
          MAT_MASTER_WIDTH: 0,
          MAT_CUTWIDTH: bomsxtable[i]?.WIDTH_CD,
          MAT_ROLL_LENGTH: 0,
          MAT_THICKNESS: 0,
          M_QTY: 1,
          REMARK: "",
          PROCESS_ORDER: i + 1,
          INS_EMPL: userData.EMPL_NO,
          INS_DATE: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
          UPD_EMPL: userData.EMPL_NO,
          UPD_DATE: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
        };
        tempBOMGIA = [...tempBOMGIA, tempeditrows];
      }
      setBOMGIATable(tempBOMGIA);
    } else {
      Swal.fire("Thông báo", "Không có BOM SX để Clone sang", "error");
    }
  };
  const confirmCloneBOMSX = () => {
    Swal.fire({
      title: "Chắc chắn muốn Clone BOM SX ?",
      text: "Clone BOM Sản xuất",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn Clone!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành Clone BOM SX", "Đang Clone BOM", "success");
        handleCloneBOMSXsangBOMGIA();
      }
    });
  };
  const confirmSaveBOMSX = () => {
    Swal.fire({
      title: "Chắc chắn muốn lưu BOM SX ?",
      text: "Lưu BOM Sản xuất",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn lưu!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành Lưu BOM SX", "Đang lưu BOM", "success");
        checkBP(
          userData.EMPL_NO,
          userData.MAINDEPTNAME,
          ["RND", "QLSX"],
          handleInsertBOMSX
        );
        //handleInsertBOMSX();
      }
    });
  };
  const confirmSaveBOMGIA = () => {
    Swal.fire({
      title: "Chắc chắn muốn lưu BOM GIÁ ?",
      text: "Lưu BOM GIÁ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn lưu!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành Lưu BOM GIÁ", "Đang lưu BOM", "success");
        checkBP(
          userData.EMPL_NO,
          userData.MAINDEPTNAME,
          ["RND", "QLSX"],
          handleInsertBOMGIA
        );
        //handleInsertBOMGIA();
        //handleInsertBOMSX_WITH_GIA();
      }
    });
  };
  const confirmResetBanVe = () => {
    Swal.fire({
      title: "Chắc chắn muốn RESET các bản vẽ đã chọn ?",
      text: "RESET bản vẽ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn reset!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến RESET Bản vẽ", "Đang Reset bản vẽ", "success");
        resetBanVe("N");
      }
    });
  };
  useEffect(() => {
    getmateriallist();
    getcustomerlist();
  }, []);
  return (
    <div className='bom_manager'>
      <div className='mininavbar'>
        <div
          className='mininavitem'
          onClick={() => setNav(1)}
          style={{
            backgroundColor: selection.trapo === true ? "#9933ff" : "#d9b3ff",
            color: selection.trapo === true ? "yellow" : "yellow",
          }}
        >
          <span className='mininavtext'>Thông tin code</span>
        </div>
        <div
          className='mininavitem'
          onClick={() =>
            checkBP(
              userData.EMPL_NO,
              userData.MAINDEPTNAME,
              ["KD", "RND"],
              () => {
                setNav(2);
              }
            )
          }
          style={{
            backgroundColor:
              selection.thempohangloat === true ? "#9933ff" : "#d9b3ff",
            color: selection.thempohangloat === true ? "yellow" : "yellow",
          }}
        >
          <span className='mininavtext'>Quản lý Liệu</span>
        </div>
      </div>
      {selection.trapo && (
        <div className='bom_manager_wrapper'>
          <div className='left'>
            <div className='bom_manager_button'>
              <div className='buttonrow1'>
                <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    confirmAddNewCode();
                  }}
                >
                  <AiFillFileAdd color='#3366ff' size={25} />
                  ADD
                </IconButton>
                <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    confirmUpdateCode();
                  }}
                >
                  <MdOutlineUpdate color='#ffff00' size={25} />
                  UPDATE
                </IconButton>
              </div>
              <div className='buttonrow2'>
                <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    confirmAddNewVer();
                  }}
                >
                  <MdUpgrade color='#cc33ff' size={25} />
                  ADD VER
                </IconButton>
                <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    handleClearInfo();
                  }}
                >
                  <AiFillDelete color='red' size={25} />
                  Clear
                </IconButton>
              </div>
            </div>
            <div className='codemanager'>
              <div className='tracuuFcst'>
                <div className='tracuuFcstform'>
                  <div className='forminput'>
                    <div className='forminputcolumn'>
                      <label>
                        <b>Code:</b>{" "}
                        <input
                          type='text'
                          placeholder='Nhập code vào đây'
                          value={codeCMS}
                          onChange={(e) => setCodeCMS(e.target.value)}
                          onKeyDown={(e) => {
                            handleSearchCodeKeyDown(e);
                          }}
                        ></input>
                      </label>
                      <button
                        className='traxuatkiembutton'
                        onClick={() => {
                          handleCODEINFO();
                        }}
                      >
                        Tìm code
                      </button>
                    </div>
                  </div>
                </div>
                <div className='codeinfotable'>
                  <DataGrid
                    components={{
                      Toolbar: CustomToolbarPOTable,
                      LoadingOverlay: LinearProgress,
                    }}
                    sx={{ fontSize: 12 }}
                    loading={isLoading}
                    rowHeight={30}
                    rows={rows}
                    columns={column_codeinfo}
                    onSelectionModelChange={(ids) => {
                      handleCODESelectionforUpdate(ids);
                    }}
                    /*  rows={codeinfodatatable}
              columns={columnDefinition} */
                    rowsPerPageOptions={[
                      5, 10, 50, 100, 500, 1000, 5000, 10000, 100000,
                    ]}
                    editMode='cell'
                    /* experimentalFeatures={{ newEditingApi: true }}  */
                    onCellEditCommit={(
                      params: GridCellEditCommitParams,
                      event: MuiEvent<MuiBaseEvent>,
                      details: GridCallbackDetails
                    ) => {
                      //console.log(params);
                      let tempeditrows = editedRows;
                      tempeditrows.push(params);
                      setEditedRows(tempeditrows);
                      //console.log(editedRows);
                      const keyvar = params.field;
                      const newdata = rows.map((p) =>
                        p.id === params.id
                          ? { ...p, [keyvar]: params.value }
                          : p
                      );
                      setRows(newdata);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='right'>
            <div className='codeinfobig'>
              <div className='biginfocms'>
                {" "}
                {codedatatablefilter[0]?.G_CODE}:{" "}
              </div>
              <div className='biginfokd'> {codedatatablefilter[0]?.G_NAME}</div>
            </div>
            <div className='down'>
              <div className='codeinfo'>
                <div className='info12'>
                  <div className='info1'>
                    <label>
                      Khách hàng:
                      <select
                        disabled={enableform}
                        name='khachhang'
                        value={
                          codefullinfo?.CUST_CD === null
                            ? ""
                            : codefullinfo?.CUST_CD
                        }
                        onChange={(e) => {
                          handleSetCodeInfo("CUST_CD", e.target.value);
                        }}
                      >
                        {customerList.map((element, index) => (
                          <option key={index} value={element.CUST_CD}>
                            {element.CUST_NAME_KD}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Dự án/Project:{" "}
                      <input
                        disabled={enableform}
                        type='text'
                        value={
                          codefullinfo?.PROD_PROJECT === null
                            ? ""
                            : codefullinfo?.PROD_PROJECT
                        }
                        onChange={(e) => {
                          handleSetCodeInfo("PROD_PROJECT", e.target.value);
                        }}
                      ></input>
                    </label>
                    <label>
                      Model:{" "}
                      <input
                        disabled={enableform}
                        type='text'
                        value={
                          codefullinfo?.PROD_MODEL === null
                            ? ""
                            : codefullinfo?.PROD_MODEL
                        }
                        onChange={(e) => {
                          handleSetCodeInfo("PROD_MODEL", e.target.value);
                        }}
                      ></input>
                    </label>
                    <label>
                      Đặc tính sản phẩm:
                      <select
                        disabled={enableform}
                        name='dactinhsanpham'
                        value={
                          codefullinfo?.CODE_12 === null
                            ? ""
                            : codefullinfo?.CODE_12
                        }
                        onChange={(e) => {
                          handleSetCodeInfo("CODE_12", e.target.value);
                        }}
                      >
                        <option value={6}>Bán Thành Phẩm</option>
                        <option value={7}>Thành Phẩm</option>
                        <option value={8}>Nguyên Chiếc Không Ribbon</option>
                        <option value={9}>Nguyên Chiếc Ribbon</option>
                      </select>
                    </label>
                    <label>
                      Phân loại sản phẩm:
                      <select
                        disabled={enableform}
                        name='phanloaisanpham'
                        value={
                          codefullinfo?.PROD_TYPE === null
                            ? "C"
                            : codefullinfo?.PROD_TYPE
                        }
                        onChange={(e) => {
                          handleSetCodeInfo("PROD_TYPE", e.target.value);
                        }}
                      >
                        <option value='TSP'>TSP</option>
                        <option value='OLED'>OLED</option>
                        <option value='UV'>UV</option>
                        <option value='TAPE'>TAPE</option>
                        <option value='LABEL'>LABEL</option>
                        <option value='RIBBON'>RIBBON</option>
                        <option value='SPT'>SPT</option>
                      </select>
                    </label>
                    <label>
                      Code KD:{" "}
                      <input
                        disabled={enableform}
                        type='text'
                        value={
                          codefullinfo?.G_NAME_KD === null
                            ? ""
                            : codefullinfo?.G_NAME_KD
                        }
                        onChange={(e) => {
                          handleSetCodeInfo("G_NAME_KD", e.target.value);
                        }}
                      ></input>
                    </label>
                    <label>
                      Mô tả/Spec:{" "}
                      <input
                        disabled={enableform}
                        type='text'
                        value={
                          codefullinfo?.DESCR === null
                            ? ""
                            : codefullinfo?.DESCR
                        }
                        onChange={(e) => {
                          handleSetCodeInfo("DESCR", e.target.value);
                        }}
                      ></input>
                    </label>
                    <label>
                      VL Chính:{" "}
                      <input
                        disabled={enableform}
                        type='text'
                        value={
                          codefullinfo?.PROD_MAIN_MATERIAL === null
                            ? ""
                            : codefullinfo?.PROD_MAIN_MATERIAL
                        }
                        onChange={(e) => {
                          handleSetCodeInfo(
                            "PROD_MAIN_MATERIAL",
                            e.target.value
                          );
                        }}
                      ></input>
                    </label>
                    <label>
                      Code RnD:{" "}
                      <input
                        disabled={enableform}
                        type='text'
                        value={
                          codefullinfo?.G_NAME === null
                            ? ""
                            : codefullinfo?.G_NAME
                        }
                        onChange={(e) => {
                          handleSetCodeInfo("G_NAME", e.target.value);
                        }}
                      ></input>
                    </label>
                  </div>
                  <div className='info2'>
                    <label>
                      Chiều dài sp(Length):{" "}
                      <input
                        disabled={enableform}
                        type='text'
                        value={
                          codefullinfo?.G_LENGTH === null
                            ? ""
                            : codefullinfo?.G_LENGTH
                        }
                        onChange={(e) => {
                          handleSetCodeInfo("G_LENGTH", e.target.value);
                        }}
                      ></input>
                    </label>
                    <label>
                      Chiều rộng sp(Width):{" "}
                      <input
                        disabled={enableform}
                        type='text'
                        value={
                          codefullinfo?.G_WIDTH === null
                            ? ""
                            : codefullinfo?.G_WIDTH
                        }
                        onChange={(e) => {
                          handleSetCodeInfo("G_WIDTH", e.target.value);
                        }}
                      ></input>
                    </label>
                    <label>
                      P/D:{" "}
                      <input
                        disabled={enableform}
                        type='text'
                        value={
                          codefullinfo?.PD === null ? "" : codefullinfo?.PD
                        }
                        onChange={(e) => {
                          handleSetCodeInfo("PD", e.target.value);
                        }}
                      ></input>
                    </label>
                    <label>
                      Cavity hàng:{" "}
                      <input
                        disabled={enableform}
                        type='text'
                        value={
                          codefullinfo?.G_C_R === null
                            ? ""
                            : codefullinfo?.G_C_R
                        }
                        onChange={(e) => {
                          handleSetCodeInfo("G_C_R", e.target.value);
                        }}
                      ></input>
                    </label>
                    <label>
                      Cavity cột:{" "}
                      <input
                        disabled={enableform}
                        type='text'
                        value={
                          codefullinfo?.G_C === null ? "" : codefullinfo?.G_C
                        }
                        onChange={(e) => {
                          handleSetCodeInfo("G_C", e.target.value);
                        }}
                      ></input>
                    </label>
                    <label>
                      K/c hàng:{" "}
                      <input
                        disabled={enableform}
                        type='text'
                        value={
                          codefullinfo?.G_LG === null ? "" : codefullinfo?.G_LG
                        }
                        onChange={(e) => {
                          handleSetCodeInfo("G_LG", e.target.value);
                        }}
                      ></input>
                    </label>
                    <label>
                      K/c cột:{" "}
                      <input
                        disabled={enableform}
                        type='text'
                        value={
                          codefullinfo?.G_CG === null ? "" : codefullinfo?.G_CG
                        }
                        onChange={(e) => {
                          handleSetCodeInfo("G_CG", e.target.value);
                        }}
                      ></input>
                    </label>
                    <label>
                      K/c tới liner trái:{" "}
                      <input
                        disabled={enableform}
                        type='text'
                        value={
                          codefullinfo?.G_SG_L === null
                            ? ""
                            : codefullinfo?.G_SG_L
                        }
                        onChange={(e) => {
                          handleSetCodeInfo("G_SG_L", e.target.value);
                        }}
                      ></input>
                    </label>
                    <label>
                      K/c tới liner phải:{" "}
                      <input
                        disabled={enableform}
                        type='text'
                        value={
                          codefullinfo?.G_SG_R === null
                            ? ""
                            : codefullinfo?.G_SG_R
                        }
                        onChange={(e) => {
                          handleSetCodeInfo("G_SG_R", e.target.value);
                        }}
                      ></input>
                    </label>
                  </div>
                  <div className='info11'>
                    <label>
                      Hướng mở roll:
                      <select
                        disabled={enableform}
                        name='huongmoroll'
                        value={
                          codefullinfo?.PACK_DRT === null
                            ? ""
                            : codefullinfo?.PACK_DRT
                        }
                        onChange={(e) => {
                          handleSetCodeInfo("PACK_DRT", e.target.value);
                        }}
                      >
                        <option value='1'>FORWARD</option>
                        <option value='0'>REVERSE</option>
                      </select>
                    </label>
                    <label>
                      Loại dao:
                      <select
                        disabled={enableform}
                        name='loaidao'
                        value={
                          codefullinfo?.KNIFE_TYPE === null
                            ? ""
                            : codefullinfo?.KNIFE_TYPE
                        }
                        onChange={(e) => {
                          handleSetCodeInfo("KNIFE_TYPE", e.target.value);
                        }}
                      >
                        <option value={0}>PVC</option>
                        <option value={1}>PINACLE</option>
                        <option value={2}>NO</option>
                      </select>
                    </label>
                    <label>
                      Tuổi dao (Số dập):{" "}
                      <input
                        disabled={enableform}
                        type='text'
                        value={
                          codefullinfo?.KNIFE_LIFECYCLE === null
                            ? ""
                            : codefullinfo?.KNIFE_LIFECYCLE
                        }
                        onChange={(e) => {
                          handleSetCodeInfo("KNIFE_LIFECYCLE", e.target.value);
                        }}
                      ></input>
                    </label>
                    <label>
                      Đơn giá dao:{" "}
                      <input
                        disabled={enableform}
                        type='text'
                        value={
                          codefullinfo?.KNIFE_PRICE === null
                            ? ""
                            : codefullinfo?.KNIFE_PRICE
                        }
                        onChange={(e) => {
                          handleSetCodeInfo("KNIFE_PRICE", e.target.value);
                        }}
                      ></input>
                    </label>
                    <label>
                      Packing Type:
                      <select
                        disabled={enableform}
                        name='packingtype'
                        value={
                          codefullinfo?.CODE_33 === null
                            ? ""
                            : codefullinfo?.CODE_33
                        }
                        onChange={(e) => {
                          handleSetCodeInfo("CODE_33", e.target.value);
                        }}
                      >
                        <option value='02'>ROLL</option>
                        <option value='03'>SHEET</option>
                      </select>
                    </label>
                    <label>
                      Packing QTY:{" "}
                      <input
                        disabled={enableform}
                        type='text'
                        value={
                          codefullinfo?.ROLE_EA_QTY === null
                            ? ""
                            : codefullinfo?.ROLE_EA_QTY
                        }
                        onChange={(e) => {
                          handleSetCodeInfo("ROLE_EA_QTY", e.target.value);
                        }}
                      ></input>
                    </label>
                    <label>
                      RPM:{" "}
                      <input
                        disabled={enableform}
                        type='text'
                        value={
                          codefullinfo?.RPM === null ? "" : codefullinfo?.RPM
                        }
                        onChange={(e) => {
                          handleSetCodeInfo("RPM", e.target.value);
                        }}
                      ></input>
                    </label>
                    <label>
                      PIN DISTANCE:{" "}
                      <input
                        disabled={enableform}
                        type='text'
                        value={
                          codefullinfo?.PIN_DISTANCE === null
                            ? ""
                            : codefullinfo?.PIN_DISTANCE
                        }
                        onChange={(e) => {
                          handleSetCodeInfo("PIN_DISTANCE", e.target.value);
                        }}
                      ></input>
                    </label>
                    <label>
                      PROCESS TYPE:{" "}
                      <input
                        disabled={enableform}
                        type='text'
                        value={
                          codefullinfo?.PROCESS_TYPE === null
                            ? ""
                            : codefullinfo?.PROCESS_TYPE
                        }
                        onChange={(e) => {
                          handleSetCodeInfo("PROCESS_TYPE", e.target.value);
                        }}
                      ></input>
                    </label>
                  </div>
                  <div className='info22'>
                    <label>
                      Máy 1:
                      <select
                        disabled={enableform}
                        name='may1'
                        value={
                          codefullinfo?.EQ1 === null || codefullinfo?.EQ1 === ""
                            ? "NA"
                            : codefullinfo?.EQ1
                        }
                        onChange={(e) => {
                          handleSetCodeInfo("EQ1", e.target.value);
                        }}
                      >
                        <option value='FR'>FR</option>
                        <option value='SR'>SR</option>
                        <option value='DC'>DC</option>
                        <option value='ED'>ED</option>
                        <option value='NO'>NO</option>
                        <option value='NA'>NA</option>
                      </select>
                    </label>
                    <label>
                      Máy 2:
                      <select
                        disabled={enableform}
                        name='may2'
                        value={
                          codefullinfo?.EQ2 === null || codefullinfo?.EQ2 === ""
                            ? "NA"
                            : codefullinfo?.EQ2
                        }
                        onChange={(e) => {
                          handleSetCodeInfo("EQ2", e.target.value);
                        }}
                      >
                        <option value='FR'>FR</option>
                        <option value='SR'>SR</option>
                        <option value='DC'>DC</option>
                        <option value='ED'>ED</option>
                        <option value='NO'>NO</option>
                        <option value='NA'>NA</option>
                      </select>
                    </label>
                    <label>
                      Số bước (dao):{" "}
                      <input
                        disabled={enableform}
                        type='text'
                        value={
                          codefullinfo?.PROD_DIECUT_STEP === null
                            ? ""
                            : codefullinfo?.PROD_DIECUT_STEP
                        }
                        onChange={(e) => {
                          handleSetCodeInfo("PROD_DIECUT_STEP", e.target.value);
                        }}
                      ></input>
                    </label>
                    <label>
                      Số lần in:{" "}
                      <input
                        disabled={enableform}
                        type='text'
                        value={
                          codefullinfo?.PROD_PRINT_TIMES === null
                            ? ""
                            : codefullinfo?.PROD_PRINT_TIMES
                        }
                        onChange={(e) => {
                          handleSetCodeInfo("PROD_PRINT_TIMES", e.target.value);
                        }}
                      ></input>
                    </label>
                    <label>
                      PO TYPE:
                      <select
                        disabled={enableform}
                        name='may1'
                        value={
                          codefullinfo?.PO_TYPE === null || codefullinfo?.PO_TYPE === ""
                            ? "NA"
                            : codefullinfo?.PO_TYPE
                        }
                        onChange={(e) => {
                          handleSetCodeInfo("PO_TYPE", e.target.value);
                        }}
                      >
                        <option value='E1'>E1</option>
                        <option value='E2'>E2</option>                 
                      </select>
                    </label>
                    <label>
                      Remark:{" "}
                      <input
                        disabled={enableform}
                        type='text'
                        value={
                          codefullinfo?.REMK === null ? "" : codefullinfo?.REMK
                        }
                        onChange={(e) => {
                          handleSetCodeInfo("REMK", e.target.value);
                        }}
                      ></input>
                    </label>
                   
                    <FormControlLabel
                      disabled={enableform}
                      label='Mở/Khóa'
                      control={
                        <Checkbox
                          checked={codefullinfo?.USE_YN === "Y"}
                          onChange={(e) => {
                            handleSetCodeInfo(
                              "USE_YN",
                              e.target.checked === true ? "Y" : "N"
                            );
                          }}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      }
                    />
                    {/*  <input
                      type='checkbox'
                      name='alltimecheckbox'                      
                      defaultChecked={(codefullinfo?.USE_YN ==='Y')}
                      onChange={(e)=> {handleSetCodeInfo('USE_YN',(Boolean(e.target.value)===true?'Y':'N'))}}
                    ></input> */}
                  </div>
                </div>
                <div className='info34'>
                  <div className='info3'></div>
                  <div className='info4'></div>
                </div>
              </div>
            </div>
            <div className='materiallist'>
              <Autocomplete
                disabled={column_bomsx[0].editable || column_bomgia[0].editable}
                size='small'
                disablePortal
                options={materialList}
                className='autocomplete'
                isOptionEqualToValue={(option, value) =>
                  option.M_CODE === value.M_CODE
                }
                getOptionLabel={(option: MaterialListData) =>
                  `${option.M_NAME}|${option.WIDTH_CD}|${option.M_CODE}`
                }
                renderInput={(params) => (
                  <TextField {...params} label='Select material' />
                )}
                defaultValue={{
                  M_CODE: "A0007770",
                  M_NAME: "SJ-203020HC",
                  WIDTH_CD: 208,
                }}
                value={selectedMaterial}
                onChange={(event: any, newValue: MaterialListData | null) => {
                  console.log(newValue);
                  setSelectedMaterial(newValue);
                }}
              />
            </div>
            <div className='up'>
              <div className='bomsx'>
                <div className='bomsxtable'>
                  <span
                    style={{ fontSize: 16, fontWeight: "bold", marginLeft: 10 }}
                  >
                    BOM SẢN XUẤT (
                    {column_bomsx[0].editable ? "Bật Sửa" : "Tắt Sửa"}){" "}
                    {pinBOM ? "(Đang ghim BOM)" : ""}
                  </span>
                  <DataGrid
                    components={{
                      Toolbar: CustomToolbarBOMSXTable,
                      LoadingOverlay: LinearProgress,
                    }}
                    sx={{ fontSize: 12 }}
                    loading={isLoading}
                    rowHeight={30}
                    rows={bomsxtable}
                    columns={column_bomsx}
                    checkboxSelection
                    onSelectionModelChange={(ids) => {
                      handleBOMSXSelectionforUpdate(ids);
                    }}
                    /*  rows={codeinfodatatable}
              columns={columnDefinition} */
                    rowsPerPageOptions={[
                      5, 10, 50, 100, 500, 1000, 5000, 10000, 100000,
                    ]}
                    editMode='cell'
                    /* experimentalFeatures={{ newEditingApi: true }}  */
                    onCellEditCommit={(
                      params: GridCellEditCommitParams,
                      event: MuiEvent<MuiBaseEvent>,
                      details: GridCallbackDetails
                    ) => {
                      //console.log(params);
                      let tempeditrows = editedRows;
                      tempeditrows.push(params);
                      setEditedBOMSXRows(tempeditrows);
                      //console.log(editedRows);
                      const keyvar = params.field;
                      const newdata = bomsxtable.map((p) =>
                        p.id === params.id
                          ? { ...p, [keyvar]: params.value }
                          : p
                      );
                      setBOMSXTable(newdata);
                    }}
                  />
                </div>
              </div>
              <div className='bomgia'>
                <div className='bomgiatable'>
                  <span
                    style={{ fontSize: 16, fontWeight: "bold", marginLeft: 10 }}
                  >
                    BOM GIÁ({column_bomgia[0].editable ? "Bật Sửa" : "Tắt Sửa"})
                    {pinBOM ? "(Đang ghim BOM)" : ""}
                  </span>
                  <DataGrid
                    components={{
                      Toolbar: CustomToolbarBOMGIATable,
                      LoadingOverlay: LinearProgress,
                    }}
                    sx={{ fontSize: 12 }}
                    loading={isLoading}
                    rowHeight={30}
                    rows={bomgiatable}
                    columns={column_bomgia}
                    checkboxSelection
                    onSelectionModelChange={(ids) => {
                      handleBOMGIASelectionforUpdate(ids);
                    }}
                    /*  rows={codeinfodatatable}
              columns={columnDefinition} */
                    rowsPerPageOptions={[
                      5, 10, 50, 100, 500, 1000, 5000, 10000, 100000,
                    ]}
                    editMode='cell'
                    /* experimentalFeatures={{ newEditingApi: true }}  */
                    onCellEditCommit={(
                      params: GridCellEditCommitParams,
                      event: MuiEvent<MuiBaseEvent>,
                      details: GridCallbackDetails
                    ) => {
                      //console.log(params);
                      let tempeditrows = editedRows;
                      tempeditrows.push(params);
                      setEditedBOMGIARows(tempeditrows);
                      //console.log(editedRows);
                      const keyvar = params.field;
                      const newdata = bomgiatable.map((p) =>
                        p.id === params.id
                          ? { ...p, [keyvar]: params.value }
                          : p
                      );
                      setBOMGIATable(newdata);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className='bottom'></div>
          </div>
        </div>
      )}
      {selection.thempohangloat && (
        <div className='quanlylieu'>
          <MATERIAL_MANAGER />
        </div>
      )}
    </div>
  );
};
export default BOM_MANAGER;

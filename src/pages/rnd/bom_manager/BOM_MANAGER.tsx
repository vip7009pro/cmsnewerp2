import { IconButton, LinearProgress } from "@mui/material";
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
import { FcCancel, FcSearch } from "react-icons/fc";
import {
  AiFillCheckCircle,
  AiFillDelete,
  AiFillEdit,
  AiFillFileAdd,
  AiFillFileExcel,
  AiOutlineCheck,
  AiOutlineCloudUpload,
} from "react-icons/ai";
import Swal from "sweetalert2";
import { generalQuery } from "../../../api/Api";
import { UserContext } from "../../../api/Context";
import { SaveExcel } from "../../../api/GlobalFunction";
import "./BOM_MANAGER.scss";
import { BiReset } from "react-icons/bi";
import { MdOutlineDraw, MdOutlineUpdate, MdUpgrade } from "react-icons/md";
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
  CUST_CD: string;
  PROD_PROJECT: string;
  PROD_MODEL: string;
  CODE_12: string;
  PROD_TYPE: string;
  G_NAME_KD: string;
  DESCR: string;
  PROD_MAIN_MATERIAL: string;
  G_NAME: string;
  G_LENGTH: number;
  G_WIDTH: number;
  PD: number;
  G_C: number;
  G_C_R: number;
  G_CG:  number,
  G_LG: number,
  G_SG_L: number;
  G_SG_R: number;
  PACK_DRT: string;
  KNIFE_TYPE: string;
  KNIFE_LIFECYCLE: number;
  KNIFE_PRICE: number;
  CODE_33: string;
  ROLE_EA_QTY: number;
  RPM: number;
  PIN_DISTANCE: string;
  PROCESS_TYPE: string;
  EQ1: string;
  EQ2: string;
  PROD_DIECUT_STEP: number;
  PROD_PRINT_TIMES: number;
  REMK: string;
  USE_YN: string;
  G_CODE: string;
}
interface CustomerListData {
  CUST_CD: string;
  CUST_NAME_KD: string;
  CUST_NAME?: string;
}
interface BOM_SX {
    G_CODE: string,
    G_NAME: string,
    G_NAME_KD: string,
    RIV_NO: string,
    M_CODE: string,
    M_NAME: string,
    WIDTH_CD: number,
    M_QTY: number,
    INS_EMPL: string,
    INS_DATE: string,
    UPD_EMPL: string,
    UPD_DATE: string,
}
interface BOM_GIA {
    BOM_ID: number,
    G_CODE: string,
    RIV_NO: string,
    G_SEQ: string,
    CATEGORY: number,
    M_CODE: string,
    M_NAME: string,
    CUST_CD: string,
    IMPORT_CAT: string,
    M_CMS_PRICE: number,
    M_SS_PRICE: number,
    M_SLITTING_PRICE: number,
    USAGE: string,
    MAT_MASTER_WIDTH: number,
    MAT_CUTWIDTH: number,
    MAT_ROLL_LENGTH: number,
    MAT_THICKNESS: number,
    M_QTY: number,
    REMARK: string,
    PROCESS_ORDER: string,
    INS_EMPL: string,
    UPD_EMPL: string,
    INS_DATE: string,
    UPD_DATE: string,
}

const BOM_MANAGER = () => {
  const [codedatatablefilter, setCodeDataTableFilter] = useState<Array<CODE_INFO>>([]);
  const [codefullinfo,setCodeFullInfo] = useState<CODE_FULL_INFO| null>();
  const [bomsxtable, setBOMSXTable] = useState<BOM_SX[]>([]);
  const [bomgiatable, setBOMGIATable] = useState<BOM_GIA[]>([]);
  const [customerList, setCustomerList] = useState<CustomerListData[]>([]);
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
          if (userData.MAINDEPTNAME === "KD") {
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
        if (params.row.BANVE !== "N") {
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
        if (params.row.PDBV === "P")
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
  ];

  const [rows, setRows] = useState<GridRowsProp>([]);
  const [columns, setColumns] = useState<GridColumns>(column_codeinfo);
  const [editedRows, setEditedRows] = useState<Array<GridCellEditCommitParams>>(
    []
  );
  const [columnDefinition, setColumnDefinition] =
    useState<Array<any>>(column_codeinfo);
  
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
            resetBanVe("N");
          }}
        >
          <BiReset color='green' size={25} />
          RESET BẢN VẼ
        </IconButton>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            setColumns(
              columns.map((element, index: number) => {
                return { ...element, editable: !element.editable };
              })
            );
            Swal.fire("Thông báo", "Bật/Tắt chế độ sửa", "success");
          }}
        >
          <AiFillEdit color='yellow' size={25} />
          Bật tắt sửa
        </IconButton>
        <GridToolbarQuickFilter />
      </GridToolbarContainer>
    );
  }
  const resetBanVe = async (value: string) => {
    if (codedatatablefilter.length >= 1) {
      if (
        userData.EMPL_NO === "VTT1901" ||
        userData.EMPL_NO === "NHU1903" ||
        userData.EMPL_NO === "LVT1906"
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

  const handleGETBOMSX =(G_CODE: string) => {
    setisLoading(true);
    setColumnDefinition(column_codeinfo);
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
  }
  const handleCODEINFO = () => {
    setisLoading(true);
    setColumnDefinition(column_codeinfo);
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

  const getcustomerlist =()=> {
    generalQuery("selectcustomerList", { })
     .then((response) => {        
       if (response.data.tk_status !== "NG") {
         setCustomerList(response.data.data);          
       } else {          
       }
     })
     .catch((error) => {
       console.log(error);
     });
 }

  const handlecodefullinfo =(G_CODE: string) => {

    generalQuery("getcodefullinfo", {
        G_CODE: G_CODE,
      })
        .then((response) => {
          //console.log(response.data);
          if (response.data.tk_status !== "NG") {
            setCodeFullInfo(response.data.data[0]);           
          } else {
            Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
            setisLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });

  }
  const handleCODESelectionforUpdate = (ids: GridSelectionModel) => {
    const selectedID = new Set(ids);
    let datafilter = rows.filter((element: CODE_INFO) =>
      selectedID.has(element.id)
    );
    
    if (datafilter.length > 0) {
      console.log(datafilter);
      setCodeDataTableFilter(datafilter);
      handlecodefullinfo(datafilter[0].G_CODE);
    } else {
      setCodeDataTableFilter([]);
    }
  };

  useEffect(() => {
    getcustomerlist();
  }, []);
  return (
    <div className='bom_manager'>
      <div className='mininavbar'>
        <div className='mininavitem' onClick={() => setNav(1)}>
          <span className='mininavtext'>Thông tin sản phẩm</span>
        </div>
      </div>
      <div className='bom_manager_wrapper'>
        <div className='left'>
          <div className='bom_manager_button'>
            <div className='buttonrow1'>
              <IconButton className='buttonIcon' onClick={() => {}}>
                <AiFillFileAdd color='#3366ff' size={25} />
                Thêm code mới
              </IconButton>
              <IconButton className='buttonIcon' onClick={() => {}}>
                <MdOutlineUpdate color='#ffff00' size={25} />
                Update thông tin code
              </IconButton>
            </div>
            <div className='buttonrow2'>
              <IconButton
                className='buttonIcon'
                onClick={() => {
                  resetBanVe("N");
                }}
              >
                <MdUpgrade color='#cc33ff' size={25} />
                Nâng Ver mới
              </IconButton>
              <IconButton
                className='buttonIcon'
                onClick={() => {
                  resetBanVe("N");
                }}
              >
                <AiFillDelete color='red' size={25} />
                Clear thông tin
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
                  columns={columns}
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
                      p.id === params.id ? { ...p, [keyvar]: params.value } : p
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
            <div className='biginfo'>Mã CMS: {codedatatablefilter[0]?.G_CODE}</div>
            <div className='biginfo'>Tên sản phẩm: {codedatatablefilter[0]?.G_NAME}</div>
          </div>
          <div className='down'>
            <div className='codeinfo'>
              <div className='ttc'> Thông tin code</div>

              <div className='info12'>
                <div className='info1'>
                  <label>
                    Khách hàng:
                    <select name='trangthailamviec' value={codefullinfo?.CUST_CD} >
                      {customerList.map((element, index) => (
                        <option key={index} value={element.CUST_CD}>
                          {element.CUST_NAME_KD}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Dự án/Project: <input type='text' value={codefullinfo?.PROD_PROJECT}></input>
                  </label>
                  <label>
                    Model: <input type='text' value={codefullinfo?.PROD_MODEL}></input>
                  </label>
                  <label>
                    Đặc tính sản phẩm:
                    <select name='dactinhsanpham' value={codefullinfo?.CODE_12}>
                      <option value={6}>Bán Thành Phẩm</option>
                      <option value={7}>Thành Phẩm</option>
                      <option value={8}>Nguyên Chiếc Không Ribbon</option>
                      <option value={9}>Nguyên Chiếc Ribbon</option>
                    </select>
                  </label>
                  <label>
                    Phân loại sản phẩm:
                    <select name='phanloaisanpham' value={codefullinfo?.PROD_TYPE}>
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
                    Code KD: <input type='text' value={codefullinfo?.G_NAME_KD}></input>
                  </label>
                  <label>
                    Mô tả/Spec: <input type='text' value={codefullinfo?.DESCR}></input>
                  </label>
                  <label>
                    VL Chính: <input type='text' value={codefullinfo?.PROD_MAIN_MATERIAL}></input>
                  </label>
                  <label>
                    Code RnD: <input type='text' value={codefullinfo?.G_NAME}></input>
                  </label>
                </div>
                <div className='info2'>
                  <label>
                    Chiều dài sp(Length): <input type='text' value={codefullinfo?.G_LENGTH}></input>
                  </label>
                  <label>
                    Chiều rộng sp(Width): <input type='text' value={codefullinfo?.G_WIDTH}></input>
                  </label>
                  <label>
                    P/D: <input type='text' value={codefullinfo?.PD}></input>
                  </label>
                  <label>
                    Cavity hàng: <input type='text' value={codefullinfo?.G_C_R}></input>
                  </label>
                  <label>
                    Cavity cột: <input type='text' value={codefullinfo?.G_C}></input>
                  </label>
                  <label>
                    K/c hàng: <input type='text' value={codefullinfo?.G_LG}></input>
                  </label>
                  <label>
                    K/c cột: <input type='text' value={codefullinfo?.G_CG}></input>
                  </label>
                  <label>
                    K/c tới liner trái: <input type='text' value={codefullinfo?.G_SG_L}></input>
                  </label>
                  <label>
                    K/c tới liner phải: <input type='text' value={codefullinfo?.G_SG_R}></input>
                  </label>
                </div>
                <div className='info11'>
                  <label>
                    Hướng mở roll:
                    <select name='huongmoroll' value={codefullinfo?.PACK_DRT}>
                      <option value='1'>FORWARD</option>
                      <option value='0'>REVERSE</option>
                    </select>
                  </label>
                  <label>
                    Loại dao:
                    <select name='loaidao' value={codefullinfo?.KNIFE_TYPE}>
                      <option value={0}>PVC</option>
                      <option value={1}>PINACLE</option>
                      <option value={2}>NO</option>
                    </select>
                  </label>
                  <label>
                    Tuổi dao (Số dập): <input type='text' value={codefullinfo?.KNIFE_LIFECYCLE}></input>
                  </label>
                  <label>
                    Đơn giá dao: <input type='text' value={codefullinfo?.KNIFE_PRICE}></input>
                  </label>
                  <label>
                    Packing Type:
                    <select name='packingtype' value={codefullinfo?.CODE_33}>
                      <option value='02'>ROLL</option>
                      <option value='03'>SHEET</option>
                    </select>
                  </label>
                  <label>
                    Packing QTY: <input type='text' value={codefullinfo?.ROLE_EA_QTY}></input>
                  </label>
                  <label>
                    RPM: <input type='text' value={codefullinfo?.RPM}></input>
                  </label>
                  <label>
                    PIN DISTANCE: <input type='text' value={codefullinfo?.PIN_DISTANCE}></input>
                  </label>
                  <label>
                    PROCESS TYPE: <input type='text' value={codefullinfo?.PROCESS_TYPE}></input>
                  </label>
                </div>
                <div className='info22'>
                  <label>
                    Máy 1:
                    <select name='may1' value={codefullinfo?.EQ1}>
                      <option value='FR'>FR</option>
                      <option value='SR'>SR</option>
                      <option value='DC'>DC</option>
                      <option value='ED'>DC</option>
                    </select>
                  </label>
                  <label>
                    Máy 2:
                    <select name='may2' value={codefullinfo?.EQ2}>
                      <option value='FR'>FR</option>
                      <option value='SR'>SR</option>
                      <option value='DC'>DC</option>
                      <option value='ED'>DC</option>
                    </select>
                  </label>
                  <label>
                    Số bước (dao): <input type='text' value={codefullinfo?.PROD_DIECUT_STEP}></input>
                  </label>
                  <label>
                    Số lần in: <input type='text' value={codefullinfo?.PROD_PRINT_TIMES}></input>
                  </label>
                  <label>
                    Remark: <input type='text' value={codefullinfo?.REMK}></input>
                  </label>
                  <label>
                    Mở/Khóa:
                    <input
                      type='checkbox'
                      name='alltimecheckbox'                      
                      defaultChecked={(codefullinfo?.USE_YN ==='Y')}
                    ></input>
                  </label>
                </div>
              </div>
              <div className='info34'>
                <div className='info3'></div>
                <div className='info4'></div>
              </div>
            </div>
          </div>
          <div className='up'>
            <div className='bomsx'>
              <div className='bomsxtable'>
                <span
                  style={{ fontSize: 16, fontWeight: "bold", marginLeft: 10 }}
                >
                  BOM SẢN XUẤT
                </span>
                <DataGrid
                  components={{
                    Toolbar: CustomToolbarPOTable,
                    LoadingOverlay: LinearProgress,
                  }}
                  sx={{ fontSize: 12 }}
                  loading={isLoading}
                  rowHeight={30}
                  rows={rows}
                  columns={columns}
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
                      p.id === params.id ? { ...p, [keyvar]: params.value } : p
                    );
                    setRows(newdata);
                  }}
                />
              </div>
            </div>
            <div className='bomgia'>
              <div className='bomgiatable'>
                <span
                  style={{ fontSize: 16, fontWeight: "bold", marginLeft: 10 }}
                >
                  BOM GIÁ
                </span>
                <DataGrid
                  components={{
                    Toolbar: CustomToolbarPOTable,
                    LoadingOverlay: LinearProgress,
                  }}
                  sx={{ fontSize: 12 }}
                  loading={isLoading}
                  rowHeight={30}
                  rows={rows}
                  columns={columns}
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
                      p.id === params.id ? { ...p, [keyvar]: params.value } : p
                    );
                    setRows(newdata);
                  }}
                />
              </div>
            </div>
          </div>          
          <div className='bottom'></div>
        </div>
      </div>
    </div>
  );
};
export default BOM_MANAGER;

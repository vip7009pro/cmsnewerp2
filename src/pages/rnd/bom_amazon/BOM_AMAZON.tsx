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
  import { SaveExcel } from "../../../api/GlobalFunction";
  import "./BOM_AMAZON.scss";
  import { BiAddToQueue, BiReset } from "react-icons/bi";
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
    G_CODE: string;
  }
  interface LIST_BOM_AMAZON {
    id: string,
    G_CODE: string;
    G_NAME?: string;
    G_NAME_KD?: string;   
  }
  interface BOM_AMAZON {
    id: string,
    G_CODE?: string,
    G_NAME?: string,
    G_CODE_MAU?: string,
    TEN_MAU?: string,
    DOITUONG_NO?: string,
    DOITUONG_NAME?: string,
    GIATRI?: string,
    REMARK?: string   
  }
  interface CODEPHOI {
    G_CODE_MAU: string, 
    G_NAME: string
  }
  const BOM_AMAZON = () => {
    const [codedatatablefilter, setCodeDataTableFilter] = useState<
      Array<CODE_INFO>
    >([]);
    const [bomsxdatatablefilter, setBomSXDataTableFilter] = useState<
      Array<LIST_BOM_AMAZON>
    >([]);
    const [bomgiadatatablefilter, setBomGiaDataTableFilter] = useState<
      Array<BOM_AMAZON>
    >([]);
    const [codephoilist, setCodePhoiList] = useState<
      Array<CODEPHOI>
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
    });
    const [listamazontable, setListBomAmazonTable] = useState<LIST_BOM_AMAZON[]>([]);
    const [bomamazontable, setBOMAMAZONTable] = useState<BOM_AMAZON[]>([]);
    const [G_CODE_MAU, setG_CODE_MAU] = useState('7A07994A');
    const [userData, setUserData] = useContext(UserContext);
    const [isLoading, setisLoading] = useState(false);
    const [codeCMS, setCodeCMS] = useState("");
    const [enableEdit, setEnableEdit] = useState(false);
    const [rows, setRows] = useState<CODE_INFO[]>([]); 
    const [editedRows, setEditedRows] = useState<Array<GridCellEditCommitParams>>(
      []
    );
    const [editedBOMSXRows, setEditedBOMSXRows] = useState<Array<GridCellEditCommitParams>>(
      []
    );
    const [editedBOMGIARows, setEditedBOMGIARows] = useState<Array<GridCellEditCommitParams>>(
      []
    );
    const handleSetCodeInfo = (keyname: string, value: any) => {
      let tempcodefullinfo = { ...codefullinfo, [keyname]: value };
      //console.log(tempcodefullinfo);
      setCodeFullInfo(tempcodefullinfo);
    };  
    const [codeinfoCMS, setcodeinfoCMS] = useState<any>('');
    const [codeinfoKD, setcodeinfoKD] = useState<any>('');
    const [column_codeinfo, setcolumn_codeinfo] = useState<Array<any>>([
      { field: "id", headerName: "ID", width: 70, editable: enableEdit },
      {
        field: "G_CODE",
        headerName: "G_CODE",
        width: 80,
        editable: enableEdit,
      },
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
    ]);
    const [column_listbomamazon, setcolumn_listbomamazon] =
      useState<Array<any>>([   
        { field: "id", headerName: "ID", width: 60 , editable: enableEdit},
        { field: "G_NAME", headerName: "G_NAME", width: 230 , editable: enableEdit},
        { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 120 , editable: enableEdit},
        { field: "G_CODE", headerName: "G_CODE", width: 110 , editable: enableEdit},
      ]);
    const [column_bomgia, setcolumn_bomgia] =
      useState<Array<any>>([ 
        { field: "id", headerName: "ID", width: 60, editable: enableEdit },
        { field: "G_CODE", headerName: "G_CODE", width: 110 , editable: enableEdit},       
        { field: "G_NAME", headerName: "G_NAME", width: 230 , editable: enableEdit},       
        { field: "G_CODE_MAU", headerName: "G_CODE_MAU", width: 120 , editable: enableEdit},
        { field: "TEN_MAU", headerName: "TEN_MAU", width: 150 , editable: enableEdit},
        { field: "DOITUONG_NO", headerName: "DOITUONG_NO", width: 120 , editable: enableEdit},
        { field: "DOITUONG_NAME", headerName: "DOITUONG_NAME", width: 120 , editable: enableEdit},
        { field: "GIATRI", headerName: "GIATRI", width: 120 , editable: enableEdit},
        { field: "REMARK", headerName: "REMARK", width: 120 , editable: enableEdit},
      ]);  
    function CustomToolbarCODETable() {
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
          <GridToolbarQuickFilter />
        </GridToolbarContainer>
      );
    }
    function CustomToolbarLISTBOMAMAZONTable() {
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
          <GridToolbarQuickFilter />
        </GridToolbarContainer>
      );
    }
    function CustomToolbarBOMAMAZONTable() {
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
              confirmSaveBOMAMAZON();
            }}
          >
            <AiFillSave color='blue' size={20} />
            Lưu BOM
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
          <GridToolbarQuickFilter />
        </GridToolbarContainer>
      );
    } 
    const handleGETLISTBOMAMAZON = (G_NAME: string) => {
      setisLoading(true);    
      generalQuery("listAmazon", {
        G_NAME: G_NAME,
      })
        .then((response) => {
          //console.log(response.data);
          if (response.data.tk_status !== "NG") {
            const loadeddata: LIST_BOM_AMAZON[] = response.data.data.map(
              (element: LIST_BOM_AMAZON, index: number) => {
                return {
                  ...element,                  
                  id: index,
                };
              }
            );
            setListBomAmazonTable(loadeddata);
            setisLoading(false);
          } else {
            //Swal.fire("Thông báo", "Lỗi BOM SX: " + response.data.message, "error");
            setListBomAmazonTable([]);
            setisLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    const handleGETBOMAMAZON = (G_CODE: string) => {
      setisLoading(true);    
      generalQuery("getBOMAMAZON", {
        G_CODE: G_CODE,
      })
        .then((response) => {
          //console.log(response.data);
          if (response.data.tk_status !== "NG") {          
            const loadeddata: BOM_AMAZON[] = response.data.data.map(
              (element: BOM_AMAZON, index: number) => {
                return {
                  ...element,              
                  id: index,
                };
              }
            );
            setBOMAMAZONTable(loadeddata);
            setisLoading(false);
          } else {
            //Swal.fire("Thông báo", "Lỗi BOM SX: " + response.data.message, "error");
            setBOMAMAZONTable([]);
            setisLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    const handleGETBOMAMAZONEMPTY = (G_CODE: string, G_NAME: string, G_CODE_MAU: string) => {
      setisLoading(true);    
      //console.log(G_CODE_MAU);
      generalQuery("getBOMAMAZON_EMPTY", {
        G_CODE_MAU: G_CODE_MAU,
      })
        .then((response) => {
          //console.log(response.data);
          if (response.data.tk_status !== "NG") {          
            const loadeddata: BOM_AMAZON[] = response.data.data.map(
              (element: any, index: number) => {
                return { 
                  G_CODE: G_CODE,                 
                  G_NAME: G_NAME,                 
                  ...element,      
                  GIATRI:'',
                  REMARK:'',        
                  id: index,
                };
              }
            );
            setBOMAMAZONTable(loadeddata);
            setisLoading(false);
          } else {
            //Swal.fire("Thông báo", "Lỗi BOM SX: " + response.data.message, "error");
            setBOMAMAZONTable([]);
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
    const handleCODESelectionforUpdate = (ids: GridSelectionModel) => {
      const selectedID = new Set(ids);
      let datafilter = rows.filter((element: CODE_INFO) =>
        selectedID.has(element.id)
      );
      if (datafilter.length > 0) {        
        setCodeDataTableFilter(datafilter);
        setcodeinfoCMS(datafilter[0].G_CODE);
        setcodeinfoKD(datafilter[0].G_NAME);
        handleGETBOMAMAZONEMPTY(datafilter[0].G_CODE, datafilter[0].G_NAME, G_CODE_MAU);
        //handlecodefullinfo(datafilter[0].G_CODE);
      } else {
        setCodeDataTableFilter([]);
      }
    };
    const handleLISTBOMAMAZONSelectionforUpdate = (ids: GridSelectionModel) => {
      const selectedID = new Set(ids);
      let datafilter = listamazontable.filter((element: LIST_BOM_AMAZON) =>
        selectedID.has(element.id)
      );
      if (datafilter.length > 0) {
        //console.log(datafilter);
        setcodeinfoCMS(datafilter[0]?.G_CODE);
        setcodeinfoKD(datafilter[0]?.G_NAME);
        handleGETBOMAMAZON(datafilter[0].G_CODE);
        setBomSXDataTableFilter(datafilter);     
      } else {
        setBomSXDataTableFilter([]);
      }
    };
    const handleBOMAMAZONSelectionforUpdate = (ids: GridSelectionModel) => {
      const selectedID = new Set(ids);
      let datafilter = bomamazontable.filter((element: BOM_AMAZON) =>
        selectedID.has(element.id)
      );
      if (datafilter.length > 0) {
        //console.log(datafilter);
        setBomGiaDataTableFilter(datafilter);     
      } else {
        setBomGiaDataTableFilter([]);
      }
    }; 
    const zeroPad = (num: number, places: number) =>
      String(num).padStart(places, "0");
   
    const handleSearchCodeKeyDown = (
      e: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (e.key === "Enter") {
        handleCODEINFO();
      }
    };     
    const confirmSaveBOMAMAZON= () => {
      Swal.fire({
        title: "Chắc chắn muốn lưu BOM AMAZON ?",
        text: "Lưu BOM AMAZON",
        icon: "warning",
        showCancelButton: true, 
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Vẫn lưu!",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire("Tiến hành Lưu BOM AMAZON", "Đang lưu BOM", "success");
          //console.log(checkExistBOMAMAZON(codeinfoCMS));
          addBOMAMAZON();
        }
      });
    };
    const loadCodePhoi =()=> {
      generalQuery("loadcodephoi", {      
      })
        .then((response) => {
          //console.log(response.data.data);
          if (response.data.tk_status !== "NG") {
            const loadeddata: CODEPHOI[] = response.data.data.map(
              (element: CODEPHOI, index: number) => {
                return {
                  ...element,
                  id: index,
                };
              }
            );
            setCodePhoiList(loadeddata);           
          } else {
            Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
            setisLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    const checkExistBOMAMAZON = async (G_CODE: string) => {

      let existcode: boolean = true;

      await generalQuery("checkExistBOMAMAZON", {   
        G_CODE: G_CODE   
      })
        .then((response) => {
          console.log(response.data);
          if (response.data.tk_status !== "NG") {
            if (response.data.data.length > 0) {
              existcode = true;
            } 
            else {
              existcode = false;
            }
          } else {
            existcode = false;
          }
        })
        .catch((error) => {
          console.log(error);
        });
        return existcode;
    }

    const addBOMAMAZON = async ()=> {      
      let bomAmazonExist:boolean = await checkExistBOMAMAZON(codeinfoCMS);
      if(!bomAmazonExist) // neu chua ton tai bom amazon, thi them moi bom
      {
        for(let i=0; i<bomamazontable.length;i++)
        {
          Swal.fire("Thông báo", "Thêm BOM AMAZON mới", "warning");
          await generalQuery("insertAmazonBOM", {    
            G_CODE: codeinfoCMS,
            G_CODE_MAU: G_CODE_MAU,
            DOITUONG_NO: bomamazontable[i].DOITUONG_NO,
            GIATRI:  bomamazontable[i].GIATRI,
            REMARK:  bomamazontable[i].REMARK,
          })
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
      else // neu da ton tai, update bom
      {
        Swal.fire("Thông báo", "Update BOM AMAZON", "warning");
        for(let i=0; i<bomamazontable.length;i++)
        {
          await generalQuery("updateAmazonBOM", {     
            G_CODE: codeinfoCMS,
            G_CODE_MAU: bomamazontable[i].G_CODE_MAU,
            DOITUONG_NO: bomamazontable[i].DOITUONG_NO,
            GIATRI:  bomamazontable[i].GIATRI,
            REMARK:  bomamazontable[i].REMARK, 
          })
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
      handleGETLISTBOMAMAZON('');  
     
    }
    
    useEffect(() => { 
      handleGETLISTBOMAMAZON('');  
      loadCodePhoi();
    }, []);
    return (
      <div className='bom_amazon'>
        <div className='bom_manager_wrapper'>
          <div className='left'>
            <div className='bom_manager_button'>
              <div className='selectcodephoi'>
                <label>
                  Code phôi:
                  <select
                  className="codephoiselection"
                    name='codephoi'
                    value={G_CODE_MAU}
                    onChange={(e) => {
                      setG_CODE_MAU(e.target.value);
                    }}
                  >
                    {codephoilist.map((element, index) => (
                      <option key={index} value={element.G_CODE_MAU}>
                        {element.G_NAME}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
            <div className='codemanager'>
              <div className='tracuuFcst'>
                <div className='tracuuFcstform'>
                  <div className='forminput'>
                    <div className='forminputcolumn'>
                      <label>
                        <b> All Code:</b>{" "}
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
                      Toolbar: CustomToolbarCODETable,
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
              <div className='biginfocms'> {codeinfoCMS}: </div>
              <div className='biginfokd'> {codeinfoKD}</div>
            </div>
            <div className='up'>
              <div className='bomsx'>
                <div className='listamazontable'>
                  <span
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      marginLeft: 10,
                      color: "white",
                      padding: 10,
                    }}
                  >
                    LIST CODE ĐÃ CÓ BOM AMAZON
                  </span>
                  <DataGrid
                    components={{
                      Toolbar: CustomToolbarLISTBOMAMAZONTable,
                      LoadingOverlay: LinearProgress,
                    }}
                    sx={{ fontSize: 12 }}
                    loading={isLoading}
                    rowHeight={30}
                    rows={listamazontable}
                    columns={column_listbomamazon}
                    onSelectionModelChange={(ids) => {
                      handleLISTBOMAMAZONSelectionforUpdate(ids);
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
                      const newdata = listamazontable.map((p) =>
                        p.id === params.id
                          ? { ...p, [keyvar]: params.value }
                          : p
                      );
                      setListBomAmazonTable(newdata);
                    }}
                  />
                </div>
              </div>
              <div className='bomgia'>
                <div className='bomamazontable'>
                  <span
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      marginLeft: 10,
                      color: "white",
                      padding: 10,
                    }}
                  >
                    BOM AMAZON(
                    {column_bomgia[0].editable ? "Bật Sửa" : "Tắt Sửa"})
                  </span>
                  <DataGrid
                    components={{
                      Toolbar: CustomToolbarBOMAMAZONTable,
                      LoadingOverlay: LinearProgress,
                    }}
                    sx={{ fontSize: 12 }}
                    loading={isLoading}
                    rowHeight={30}
                    rows={bomamazontable}
                    columns={column_bomgia}
                    onSelectionModelChange={(ids) => {
                      handleBOMAMAZONSelectionforUpdate(ids);
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
                      const newdata = bomamazontable.map((p) =>
                        p.id === params.id
                          ? { ...p, [keyvar]: params.value }
                          : p
                      );
                      setBOMAMAZONTable(newdata);
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
  export default BOM_AMAZON;

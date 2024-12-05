import {
  Autocomplete,
  Button,
  Checkbox,
  createFilterOptions,
  FormControlLabel,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import moment from "moment";
import { useEffect, useMemo, useRef, useState } from "react";
import { FcAdvertising, FcDeleteRow } from "react-icons/fc";
import {
  AiFillDelete,
  AiFillEdit,
  AiFillFileAdd,
  AiFillSave,
  AiOutlineClose,
  AiOutlineCloudUpload,
  AiOutlinePushpin,
} from "react-icons/ai";
import Swal from "sweetalert2";
import { generalQuery, getAuditMode, getCompany, getUserData, uploadQuery } from "../../../api/Api";
import { checkBP, f_getMachineListData, renderElement } from "../../../api/GlobalFunction";
import "./BOM_MANAGER.scss";
import { BiAddToQueue, BiReset } from "react-icons/bi";
import { MdOutlineUpdate, MdUpgrade } from "react-icons/md";
import { FaRegClone } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import CodeVisualLize from "../../kinhdoanh/quotationmanager/CodeVisualize/CodeVisualLize";
import { useReactToPrint } from "react-to-print";
import {
  BOM_GIA,
  BOM_SX,
  CODE_FULL_INFO,
  CODE_INFO,
  COMPONENT_DATA,
  CustomerListData,
  DEFAULT_DM,
  FSC_LIST_DATA,
  MACHINE_LIST,
  MASTER_MATERIAL_HSD,
  MATERIAL_INFO,
  MaterialListData,
  UserData,
} from "../../../api/GlobalInterface";
import UpHangLoat from "./UpHangLoat";
import BOM_DESIGN from "./BOM_DESIGN";
import AGTable from "../../../components/DataTable/AGTable";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
const BOM_MANAGER = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [activeOnly, setActiveOnly] = useState(true)
  const [cndb, setCNDB] = useState(false)
  const labelprintref = useRef(null);
  const [showHideDesignBom, setShowHideDesignBOM] = useState(false);
  const handlePrint = useReactToPrint({
    content: () => labelprintref.current,
  });
  const company: string = useSelector(
    (state: RootState) => state.totalSlice.company,
  );
  const codedatatablefilter = useRef<Array<CODE_INFO>>([]);
  const bomsxdatatablefilter = useRef<Array<BOM_SX>>([]);
  const bomgiadatatablefilter = useRef<Array<BOM_GIA>>([]);
  const [defaultDM, setDefaultDM] = useState<DEFAULT_DM>({
    id: 0,
    WIDTH_OFFSET: 0,
    LENGTH_OFFSET: 0,
    KNIFE_UNIT: 0,
    FILM_UNIT: 0,
    INK_UNIT: 0,
    LABOR_UNIT: 0,
    DELIVERY_UNIT: 0,
    DEPRECATION_UNIT: 0,
    GMANAGEMENT_UNIT: 0,
    M_LOSS_UNIT: 0,
  });
  const [showhidetemlot, setShowHideTemLot] = useState(false);
  const checkG_NAME_KD_Exist = async (g_name_kd: string) => {
    let gnamekdExist: boolean = false;
    await generalQuery("checkGNAMEKDExist", {
      G_NAME_KD: g_name_kd
    })
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
          gnamekdExist = true;
        } else {
          gnamekdExist = false;
        }
      })
      .catch((error) => {
        //console.log(error);
      });
    return gnamekdExist;
  }
  const loadDefaultDM = () => {
    generalQuery("loadDefaultDM", {})
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: DEFAULT_DM[] = response.data.data.map(
            (element: DEFAULT_DM, index: number) => {
              return {
                ...element,
                id: index,
              };
            },
          );
          setDefaultDM(loadeddata[0]);
        } else {
          setDefaultDM({
            id: 0,
            WIDTH_OFFSET: 0,
            LENGTH_OFFSET: 0,
            KNIFE_UNIT: 0,
            FILM_UNIT: 0,
            INK_UNIT: 0,
            LABOR_UNIT: 0,
            DELIVERY_UNIT: 0,
            DEPRECATION_UNIT: 0,
            GMANAGEMENT_UNIT: 0,
            M_LOSS_UNIT: 0,
          });
        }
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  const [codefullinfo, setCodeFullInfo] = useState<CODE_FULL_INFO>({
    CUST_CD: company === "CMS" ? "0000" : "KH000",
    PROD_PROJECT: "",
    PROD_MODEL: "",
    CODE_12: "7",
    PROD_TYPE: getCompany() === 'CMS' ? "TSP" : "LABEL",
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
    EQ1: "NO",
    EQ2: "NO",
    EQ3: "NO",
    EQ4: "NO",
    PROD_DIECUT_STEP: 0,
    PROD_PRINT_TIMES: 0,
    REMK: "",
    USE_YN: "N",
    G_CODE: "-------",
    PO_TYPE: "E1",
    FSC: "N",
    PROD_DVT: "01",
    QL_HSD: "Y",
    EXP_DATE: '0',
    FSC_CODE: '01'
  });
  const [file, setFile] = useState<any>(null);
  const [file2, setFile2] = useState<any>(null);
  const [bomsxtable, setBOMSXTable] = useState<BOM_SX[]>([]);
  const [bomgiatable, setBOMGIATable] = useState<BOM_GIA[]>([]);
  const [customerList, setCustomerList] = useState<CustomerListData[]>([]);
  const [materialList, setMaterialList] = useState<MaterialListData[]>([
    {
      M_CODE: "A0000001",
      M_NAME: "#200",
      WIDTH_CD: 1200,
    },
  ]);
  const [masterMaterialList, setMasterMaterialList] = useState<MASTER_MATERIAL_HSD[]>([
    {
      M_NAME: "SJ-203020HC",
      EXP_DATE: 6
    }
  ]);
  const [selectedMasterMaterial, setSelectedMasterMaterial] =
    useState<MASTER_MATERIAL_HSD>({
      M_NAME: "SJ-203020HC",
      EXP_DATE: 6
    });
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
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData,
  );
  const [machine_list, setMachine_List] = useState<MACHINE_LIST[]>([]);
  const [isLoading, setisLoading] = useState(false);
  const [codeCMS, setCodeCMS] = useState("");
  const [enableEdit, setEnableEdit] = useState(false);
  const [enableform, setEnableForm] = useState(true);
  const [rows, setRows] = useState<CODE_INFO[]>([]);
  const [fscList, setFSCList] = useState<FSC_LIST_DATA[]>([]);
  const handleSetCodeInfo = (keyname: string, value: any) => {
    let tempcodefullinfo = { ...codefullinfo, [keyname]: value };
    ////console.log(tempcodefullinfo);
    setCodeFullInfo(tempcodefullinfo);
  };
  const [pinBOM, setPINBOM] = useState(false);
  const [column_bomsx, setcolumn_bomsx] = useState<Array<any>>([
    {
      field: "M_CODE",
      headerName: "M_CODE",
      width: 80,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      cellRenderer: (params: any) => {
        return <span style={{ color: "blue" }}>{params.data.M_CODE} </span>;
      },
      editable: enableEdit,
    },
    {
      field: "M_NAME",
      headerName: "M_NAME",
      width: 110,
      cellRenderer: (params: any) => {
        return <span style={{ color: "red" }}>{params.data.M_NAME} </span>;
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
    {
      field: "M_CODE", headerName: "M_CODE", width: 80, editable: enableEdit, headerCheckboxSelection: true,
      checkboxSelection: true, cellRenderer: (params: any) => {
        if (params.data.M_CODE_SX === null) {
          return (
            <span style={{ color: "red" }}>
              {params.data.M_CODE?.toLocaleString('en-US')}
            </span>
          );
        }
        else {
          return (
            <span style={{ color: "blue" }}>
              {params.data.M_CODE?.toLocaleString('en-US')}
            </span>
          );
        }
      },
    },
    { field: "M_NAME", headerName: "M_NAME", width: 150, editable: enableEdit },
    {
      field: "CUST_CD",
      headerName: "Vendor",
      width: 80,
      editable: enableEdit,
      cellRenderer: (params: any) => {
        if (params.data.CUST_CD === "") {
          return <span style={{ backgroundColor: "red" }}>NG</span>;
        } else {
          return <span>{params.data.CUST_CD}</span>;
        }
      },
    },
    {
      field: "USAGE",
      headerName: "USAGE",
      width: 80,
      editable: enableEdit,
      cellRenderer: (params: any) => {
        if (params.data.USAGE === "") {
          return <span style={{ backgroundColor: "red" }}>NG</span>;
        } else {
          return <span>{params.data.USAGE}</span>;
        }
      },
    },
    { field: "MAIN_M", headerName: "MAIN_M", width: 80, editable: enableEdit },
    {
      field: "MAT_MASTER_WIDTH",
      headerName: "Khổ liệu",
      width: 80,
      editable: enableEdit,
      cellRenderer: (params: any) => {
        if (params.data.MAT_MASTER_WIDTH === 0) {
          return <span style={{ backgroundColor: "red" }}>NG</span>;
        } else {
          return <span>{params.data.MAT_MASTER_WIDTH}</span>;
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
      cellRenderer: (params: any) => {
        if (params.data.MAT_ROLL_LENGTH === 0) {
          return <span style={{ backgroundColor: "red" }}>NG</span>;
        } else {
          return <span>{params.data.MAT_ROLL_LENGTH}</span>;
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
  let column_codeinfo2 = [
    {
      field: "id", headerName: "ID", width: 30, editable: enableEdit,
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
                          (element: CODE_INFO, index: number) => {
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
  ];
  const codeInfoAGTable = useMemo(() => {
    return (
      <AGTable
        toolbar={
          <div>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                confirmResetBanVe();
              }}
            >
              <BiReset color="green" size={15} />
              RESET BẢN VẼ
            </IconButton>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                setEnableForm(prev => !prev);
                Swal.fire("Thông báo", "Bật/Tắt chế độ sửa", "success");
              }}
            >
              <AiFillEdit color="yellow" size={15} />
              Bật tắt sửa
            </IconButton>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                setPINBOM(prev => !prev);
                Swal.fire("Thông báo", "Ghim/ bỏ ghim BOM thành công", "success");
              }}
            >
              <AiOutlinePushpin color="red" size={15} />
              Ghim BOM
            </IconButton>
          </div>
        }
        showFilter={true}
        columns={column_codeinfo2}
        data={rows}
        onCellEditingStopped={(params: any) => {
        }} onRowClick={(params: any) => {
          //console.log(e.data)        
          if (!pinBOM) {
            handleGETBOMSX(params.data.G_CODE);
            handleGETBOMGIA(params.data.G_CODE);
          }
          ////console.log(datafilter[0]);
          handlecodefullinfo(params.data.G_CODE);
          //console.log([params.data]);
          codedatatablefilter.current = [params.data];
        }} onSelectionChange={(params: any) => {
          //setCodeDataTableFilter(params!.api.getSelectedRows());
          //console.log(e!.api.getSelectedRows())
          //setCodeDataTableFilter(params!.api.getSelectedRows());
        }} />
    )
  }, [rows, pinBOM, enableform, codefullinfo])
  const bomsx_AGTable = useMemo(() =>
    <AGTable
      showFilter={false}
      toolbar={
        <div>
          <IconButton
            className="buttonIcon"
            onClick={() => {
              confirmSaveBOMSX();
            }}
          >
            <AiFillSave color="blue" size={20} />
            Lưu BOM
          </IconButton>
          <IconButton
            className="buttonIcon"
            onClick={() => {
              handleAddNewLineBOMSX();
            }}
          >
            <BiAddToQueue color="yellow" size={20} />
            Thêm dòng
          </IconButton>
          <IconButton
            className="buttonIcon"
            onClick={() => {
              handle_DeleteLineBOMSX();
            }}
          >
            <FcDeleteRow color="yellow" size={20} />
            Xóa dòng
          </IconButton>
          <IconButton
            className="buttonIcon"
            onClick={() => {
              setcolumn_bomsx(prev =>
                prev.map((element, index: number) => {
                  return { ...element, editable: !element.editable };
                }),
              );
              Swal.fire("Thông báo", "Bật/Tắt chế độ sửa", "success");
            }}
          >
            <AiFillEdit color="yellow" size={20} />
            Bật tắt sửa
          </IconButton>
        </div>
      }
      columns={column_bomsx}
      data={bomsxtable}
      onCellEditingStopped={(params: any) => {
        //console.log(e.data)
      }} onRowClick={(params: any) => {
        //clickedRow.current = params.data;
        //console.log(e.data) 
      }} onSelectionChange={(params: any) => {
        //console.log(params)
        //setSelectedRows(params!.api.getSelectedRows()[0]);
        //console.log(e!.api.getSelectedRows())
        bomsxdatatablefilter.current = params!.api.getSelectedRows();
      }}
    />
    , [bomsxtable, column_bomsx, selectedMaterial, selectedMasterMaterial, enableEdit]);
  const bomgia_AGTable = useMemo(() =>
    <AGTable
      showFilter={false}
      toolbar={
        <div>
          <IconButton
            className="buttonIcon"
            onClick={() => {
              confirmSaveBOMGIA();
            }}
          >
            <AiFillSave color="blue" size={20} />
            Lưu BOM
          </IconButton>
          <IconButton
            className="buttonIcon"
            onClick={() => {
              handleAddNewLineBOMGIA();
            }}
          >
            <BiAddToQueue color="yellow" size={20} />
            Thêm dòng
          </IconButton>
          <IconButton
            className="buttonIcon"
            onClick={() => {
              handle_DeleteLineBOMGIA();
            }}
          >
            <FcDeleteRow color="yellow" size={20} />
            Xóa dòng
          </IconButton>
          <IconButton
            className="buttonIcon"
            onClick={() => {
              setcolumn_bomgia(prev =>
                prev.map((element, index: number) => {
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
              confirmCloneBOMSX();
            }}
          >
            <FaRegClone color="red" size={20} />
            Clone BOMSX
          </IconButton>
          {/* <IconButton
          className="buttonIcon"
          onClick={() => {
            setShowHideDesignBOM(prev=> !prev)
          }}
        >
          <FcAdvertising color="red" size={20} />
          DESIGN BOM
        </IconButton> */}
        </div>
      }
      columns={column_bomgia}
      data={bomgiatable}
      onCellEditingStopped={(params: any) => {
        //console.log(e.data)
      }} onRowClick={(params: any) => {
        //clickedRow.current = params.data;
        //console.log(e.data) 
      }} onSelectionChange={(params: any) => {
        //console.log(params)
        //setSelectedRows(params!.api.getSelectedRows()[0]);
        //console.log(e!.api.getSelectedRows())
        bomgiadatatablefilter.current = params!.api.getSelectedRows();
      }}
    />
    , [bomgiatable, column_bomgia, selectedMaterial, selectedMasterMaterial, enableEdit]);
  const loadMasterMaterialList = () => {
    generalQuery("getMasterMaterialList", {})
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          ////console.log(response.data.data);
          setMasterMaterialList(response.data.data);
        } else {
        }
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  const resetBanVe = async (value: string) => {
    if (codedatatablefilter.current.length >= 1) {
      if (
        userData?.EMPL_NO?.toUpperCase() === "NVH1011" ||
        userData?.EMPL_NO?.toUpperCase() === "NHU1903" ||
        userData?.EMPL_NO?.toUpperCase() === "LVT1906" ||
        userData?.EMPL_NO?.toUpperCase() === "DSL1986" ||
        userData?.EMPL_NO?.toUpperCase() === "LTH1992" ||
        userData?.EMPL_NO?.toUpperCase() === "LTD1984"
      ) {
        for (let i = 0; i < codedatatablefilter.current.length; i++) {
          await generalQuery("resetbanve", {
            G_CODE: codedatatablefilter.current[i].G_CODE,
            VALUE: value,
          })
            .then((response) => {
              //console.log(response.data.tk_status);
              if (response.data.tk_status !== "NG") {
                //Swal.fire("Thông báo", "Delete Po thành công", "success");
              } else {
                //Swal.fire("Thông báo", "Update PO thất bại: " +response.data.message , "error");
              }
            })
            .catch((error) => {
              //console.log(error);
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
  const uploadFilebanVe = async (e: any) => {
    checkBP(userData, ["RND", "KD"], ["ALL"], ["ALL"], async () => {
      if (file !== null && file !== undefined) {
        if (codefullinfo.G_CODE !== "-------") {
          uploadQuery(file, codefullinfo.G_CODE + ".pdf", "banve")
            .then((response) => {
              if (response.data.tk_status !== "NG") {
                generalQuery("update_banve_value", {
                  G_CODE: codefullinfo.G_CODE,
                  banvevalue: "Y",
                })
                  .then((response) => {
                    if (response.data.tk_status !== "NG") {
                      generalQuery("pdbanve", {
                        G_CODE: codefullinfo.G_CODE,
                        VALUE: "N",
                      })
                        .then((response) => {
                          //console.log(response.data.tk_status);
                          if (response.data.tk_status !== "NG") {
                            //Swal.fire("Thông báo", "Delete Po thành công", "success");
                          } else {
                            //Swal.fire("Thông báo", "Update PO thất bại: " +response.data.message , "error");
                          }
                        })
                        .catch((error) => {
                          //console.log(error);
                        });
                      Swal.fire(
                        "Thông báo",
                        "Upload bản vẽ thành công",
                        "success",
                      );
                      let tempcodeinfodatatable = rows.map((element, index) => {
                        return element.G_CODE === codefullinfo.G_CODE
                          ? { ...element, BANVE: "Y" }
                          : element;
                      });
                      //setRows(tempcodeinfodatatable);
                    } else {
                      Swal.fire("Thông báo", "Upload bản vẽ thất bại", "error");
                    }
                  })
                  .catch((error) => {
                    //console.log(error);
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
              //console.log(error);
            });
        } else {
          Swal.fire("Thông báo", "Chọn code trước khi up bản vẽ", "error");
        }
      } else {
        Swal.fire("Thông báo", "Hãy chọn file", "error");
      }
    });
  };
  const uploadFileAppsheet = async (e: any) => {
    checkBP(userData, ["RND", "KD"], ["ALL"], ["ALL"], async () => {
      if (file2 !== null && file2 !== undefined) {
        if (codefullinfo.G_CODE !== "-------") {
          uploadQuery(file2, "Appsheet_" + codefullinfo.G_CODE + ".docx", "appsheet")
            .then((response) => {
              if (response.data.tk_status !== "NG") {
                generalQuery("update_appsheet_value", {
                  G_CODE: codefullinfo.G_CODE,
                  appsheetvalue: "Y",
                })
                  .then((response) => {
                    if (response.data.tk_status !== "NG") {
                      /* generalQuery("pdbanve", {
                        G_CODE: codefullinfo.G_CODE,
                        VALUE: "N",
                      })
                        .then((response) => {
                          //console.log(response.data.tk_status);
                          if (response.data.tk_status !== "NG") {
                            //Swal.fire("Thông báo", "Delete Po thành công", "success");
                          } else {
                            //Swal.fire("Thông báo", "Update PO thất bại: " +response.data.message , "error");
                          }
                        })
                        .catch((error) => {
                          //console.log(error);
                        }); */
                      Swal.fire(
                        "Thông báo",
                        "Upload appsheet thành công",
                        "success",
                      );
                    } else {
                      Swal.fire("Thông báo", "Upload bản vẽ thất bại", "error");
                    }
                  })
                  .catch((error) => {
                    //console.log(error);
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
              //console.log(error);
            });
        } else {
          Swal.fire("Thông báo", "Chọn code trước khi up bản vẽ", "error");
        }
      } else {
        Swal.fire("Thông báo", "Hãy chọn file", "error");
      }
    });
  };
  const handleGETBOMSX = (G_CODE: string) => {
    setisLoading(true);
    generalQuery("getbomsx", {
      G_CODE: G_CODE,
    })
      .then((response) => {
        ////console.log(response.data);
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
            },
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
        //console.log(error);
      });
  };
  const handleGETBOMGIA = (G_CODE: string) => {
    setisLoading(true);
    generalQuery("getbomgia", {
      G_CODE: G_CODE,
    })
      .then((response) => {
        ////console.log(response.data);
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
            },
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
        //console.log(error);
      });
  };
  const handleCODEINFO = () => {
    setisLoading(true);
    generalQuery("codeinforRnD", {
      G_NAME: codeCMS,
      CNDB: cndb,
      ACTIVE_ONLY: activeOnly
    })
      .then((response) => {
        ////console.log(response.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: CODE_INFO[] = response.data.data.map(
            (element: CODE_INFO, index: number) => {
              return {
                ...element,
                G_NAME: getAuditMode() == 0 ? element?.G_NAME : element?.G_NAME?.search('CNDB') == -1 ? element?.G_NAME : 'TEM_NOI_BO',
                G_NAME_KD: getAuditMode() == 0 ? element?.G_NAME_KD : element?.G_NAME?.search('CNDB') == -1 ? element?.G_NAME_KD : 'TEM_NOI_BO',
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
        //console.log(error);
      });
  };
   const getFSCList = () => {
    generalQuery("getFSCList", {})
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data)
          setFSCList(response.data.data);
        } else {
          setFSCList([])
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const getcustomerlist = () => {
    generalQuery("selectcustomerList", {})
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          setCustomerList(response.data.data);
        } else {
        }
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  const getmateriallist = () => {
    generalQuery("getMaterialList", {})
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          ////console.log(response.data.data);
          setMaterialList(response.data.data);
        } else {
        }
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  const handlecodefullinfo = (G_CODE: string) => {
    generalQuery("getcodefullinfo", {
      G_CODE: G_CODE,
    })
      .then((response) => {
        ////console.log(response.data);
        if (response.data.tk_status !== "NG") {
          ////console.log(response.data.data[0]);
          let loaded_data: CODE_FULL_INFO[] = response.data.data.map(
            (element: CODE_FULL_INFO, index: number) => {
              return {
                ...element,
                CUST_CD: element.CUST_CD ?? "0000",
                PROD_PROJECT: element.PROD_PROJECT ?? "",
                PROD_MODEL: element.PROD_MODEL ?? "",
                CODE_12: element.CODE_12 === null || element.CODE_12 === "" ? "7" : element.CODE_12,
                PROD_TYPE: element.PROD_TYPE === null || element.PROD_TYPE === "" ? getCompany() === 'CMS' ? "TSP" : "LABEL" : element.PROD_TYPE.trim(),
                G_NAME_KD: element.G_NAME_KD === null || element.G_NAME_KD === "" ? "7" : element.G_NAME_KD,
                DESCR: element.DESCR === null || element.DESCR === "" ? "" : element.DESCR,
                PROD_MAIN_MATERIAL: element.PROD_MAIN_MATERIAL === null || element.PROD_MAIN_MATERIAL === "" ? "" : element.PROD_MAIN_MATERIAL,
                G_NAME: element.G_NAME === null || element.G_NAME === "" ? "" : element.G_NAME,
                G_LENGTH: element.G_LENGTH === null ? 0 : element.G_LENGTH,
                G_WIDTH: element.G_WIDTH === null ? 0 : element.G_WIDTH,
                PD: element.PD === null ? 0 : element.PD,
                G_C_R: element.G_C_R === null ? 0 : element.G_C_R,
                G_C: element.G_C === null ? 0 : element.G_C,
                G_LG: element.G_LG === null ? 0 : element.G_LG,
                G_CG: element.G_CG === null ? 0 : element.G_CG,
                G_SG_L: element.G_SG_L === null ? 0 : element.G_SG_L,
                G_SG_R: element.G_SG_R === null ? 0 : element.G_SG_R,
                PACK_DRT: element.PACK_DRT === null || element.PACK_DRT === "" ? "1" : element.PACK_DRT,
                KNIFE_TYPE: element.KNIFE_TYPE === null ? 0 : element.KNIFE_TYPE,
                KNIFE_LIFECYCLE: element.KNIFE_LIFECYCLE === null ? 0 : element.KNIFE_LIFECYCLE,
                KNIFE_PRICE: element.KNIFE_PRICE === null ? 0 : element.KNIFE_PRICE,
                CODE_33: element.CODE_33 === null ? "03" : element.CODE_33,
                PROD_DVT: element.PROD_DVT === null ? "01" : element.PROD_DVT,
                ROLE_EA_QTY: element.ROLE_EA_QTY === null ? 0 : element.ROLE_EA_QTY,
                RPM: element.RPM === null ? 0 : element.RPM,
                PIN_DISTANCE: element.PIN_DISTANCE === null ? 0 : element.PIN_DISTANCE,
                PROCESS_TYPE: element.PROCESS_TYPE === null ? "" : element.PROCESS_TYPE,
                EQ1: element.EQ1 === null || element.EQ1 === "" ? "NA" : element.EQ1,
                EQ2: element.EQ2 === null || element.EQ2 === "" ? "NA" : element.EQ2,
                EQ3: element.EQ3 === null || element.EQ3 === "" ? "NA" : element.EQ3,
                EQ4: element.EQ4 === null || element.EQ4 === "" ? "NA" : element.EQ4,
                PROD_DIECUT_STEP: element.PROD_DIECUT_STEP ?? '',
                PROD_PRINT_TIMES: element.PROD_PRINT_TIMES ?? 0,
                PO_TYPE: element.PO_TYPE ?? 'E1',
                FSC: element.FSC ?? 'N',
                QL_HSD: element.QL_HSD ?? 'N',
                EXP_DATE: element.EXP_DATE ?? 0,
                FSC_CODE: element.FSC_CODE ?? '01',
                id: index,
              };
            },
          );
          ////console.log(loaded_data[0]);
          setCodeFullInfo(loaded_data[0]);
          //console.log(loaded_data[0])
          setSelectedMasterMaterial({
            M_NAME: loaded_data[0]?.PROD_MAIN_MATERIAL ?? "",
            EXP_DATE: masterMaterialList.filter((ele: MASTER_MATERIAL_HSD, index: number) => ele.M_NAME === loaded_data[0]?.PROD_MAIN_MATERIAL)[0].EXP_DATE ?? 0
          })
          setComponentList(
            componentList.map((e: COMPONENT_DATA, index: number) => {
              let value: string = e.GIATRI;
              if (e.DOITUONG_NAME === "CUSTOMER") {
                value =
                  loaded_data[0]?.CUST_NAME === undefined
                    ? ""
                    : loaded_data[0]?.CUST_NAME;
              } else if (e.DOITUONG_NAME === "LONGBARCODE") {
                value =
                  (loaded_data[0]?.G_NAME === undefined
                    ? ""
                    : loaded_data[0]?.G_NAME.substring(0, 11)) +
                  "DTA3" +
                  (loaded_data[0]?.PO_TYPE === undefined
                    ? ""
                    : loaded_data[0]?.PO_TYPE) +
                  moment.utc().format("YYMMDD") +
                  "-001" +
                  zeroPad(
                    loaded_data[0]?.ROLE_EA_QTY === undefined
                      ? 0
                      : loaded_data[0]?.ROLE_EA_QTY,
                    6,
                  );
              } else if (e.DOITUONG_NAME === "PARTNO VALUE") {
                value =
                  loaded_data[0]?.G_NAME === undefined
                    ? ""
                    : loaded_data[0]?.G_NAME;
              } else if (e.DOITUONG_NAME === "SPECIFICATION") {
                value =
                  "Specification:" +
                  (loaded_data[0]?.DESCR === undefined
                    ? ""
                    : loaded_data[0]?.DESCR);
              } else if (e.DOITUONG_NAME === "PO TYPE") {
                value =
                  "PO Type:" +
                  (loaded_data[0]?.PO_TYPE === undefined
                    ? ""
                    : loaded_data[0]?.PO_TYPE);
              } else if (e.DOITUONG_NAME === "LOTNO") {
                value =
                  "Lot No:" +
                  moment.utc().format("YYMMDD") +
                  "-001|" +
                  userData?.EMPL_NO;
              } else if (e.DOITUONG_NAME === "QTY BIG") {
                value = (
                  loaded_data[0]?.ROLE_EA_QTY === undefined
                    ? ""
                    : loaded_data[0]?.ROLE_EA_QTY
                ).toString();
              } else if (e.DOITUONG_NAME === "VENDOR PN") {
                value =
                  "Vendor P/N:" +
                  (loaded_data[0]?.G_CODE === undefined
                    ? ""
                    : loaded_data[0]?.G_CODE);
              } else if (e.DOITUONG_NAME === "SIZE") {
                value =
                  "Size:" +
                  (loaded_data[0]?.G_WIDTH === undefined
                    ? ""
                    : loaded_data[0]?.G_WIDTH
                  ).toString() +
                  "*" +
                  (loaded_data[0]?.G_LENGTH === undefined
                    ? ""
                    : loaded_data[0]?.G_LENGTH
                  ).toString();
              } else if (e.DOITUONG_NAME === "MFT") {
                value = "MFT:" + moment.utc().format("YYYY-MM-DD");
              } else if (e.DOITUONG_NAME === "EXP") {
                value =
                  "MFT:" + moment.utc().add(360, "day").format("YYYY-MM-DD");
              } else if (e.DOITUONG_NAME === "REQUESTINFO") {
                value =
                  "CMSvina/NM1/3HU0020/" +
                  (loaded_data[0]?.ROLE_EA_QTY === undefined
                    ? ""
                    : loaded_data[0]?.ROLE_EA_QTY
                  ).toString() +
                  "EA";
              } else if (e.DOITUONG_NAME === "PARTNO2") {
                value = (
                  loaded_data[0]?.G_NAME === undefined
                    ? ""
                    : loaded_data[0]?.G_NAME
                ).toString();
              } else if (e.DOITUONG_NAME === "MFTEXP") {
                value = `MFT: ${moment.utc().format("YYYY-MM-DD")} EXP: ${moment
                  .utc()
                  .add(360, "day")
                  .format("YYYY-MM-DD")}`;
              } else if (e.DOITUONG_NAME === "LOTINFO") {
                value = `${userData?.EMPL_NO}/SP3HU001/SAMPLEWEB`;
              }
              return {
                ...e,
                GIATRI: value,
              };
            }),
          );
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
          setisLoading(false);
        }
      })
      .catch((error) => {
        //console.log(error);
      });
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
      FSC: "N",
      FSC_CODE: '01',
      PROD_DVT: "01",
      APPSHEET: 'N',
      BANVE: 'N',
      NO_INSPECTION: 'N',
      PDBV: 'N',
      PD_HSD: 'N',
      QL_HSD: 'Y',
    });
  };
  const checkHSD = (): boolean => {
    /*  console.log('codefullinfo.QL_HSD',codefullinfo.QL_HSD)
     console.log('selectedMasterMaterial.EXP_DATE',selectedMasterMaterial.EXP_DATE)
     console.log('codefullinfo.EXP_DATE',codefullinfo.EXP_DATE) */
    let checkhd: boolean = false;
    if (codefullinfo.PD_HSD === 'Y') {
      checkhd = true;
    }
    else {
      let hsdVL: number = Number(selectedMasterMaterial.EXP_DATE ?? 0);
      let hsdSP: number = Number(codefullinfo.EXP_DATE ?? 0);
      if ((hsdVL === hsdSP) && hsdVL !== 0) {
        checkhd = true;
      }
      if (!checkhd) {
        Swal.fire('Thông báo', 'Hạn sử dụng sản phẩm không khớp vs HSD NVL, hãy check lại với mua hàng: HSD VL ' + hsdVL + ', HSD SP ' + hsdSP, 'error');
      }
    }
    return checkhd;
  }
  const checkHSD2 = (): boolean => {
    let checkhd: boolean = false;
    let hsdVL: number = Number(selectedMasterMaterial.EXP_DATE ?? 0);
    let hsdSP: number = Number(codefullinfo.EXP_DATE ?? 0);
    if ((hsdVL === hsdSP) && hsdVL !== 0) {
      checkhd = true;
    }
    if (!checkhd) {
      Swal.fire('Thông báo', 'Hạn sử dụng sản phẩm không khớp vs HSD NVL, hãy check lại với mua hàng: HSD VL ' + hsdVL + ', HSD SP ' + hsdSP, 'error');
    }
    return checkhd;
  }
  const handleCheckCodeInfo2 = async () => {
    let abc: CODE_FULL_INFO = codefullinfo;
    let result: boolean = true;
    if (company !== "CMS" && userData?.MAINDEPTNAME === "KD") {
      result = true;
    } else {
      for (const [k, v] of Object.entries(abc)) {
        if (
          (v === null || v === "") &&
          k !== "REMK" &&
          k !== "FACTORY" &&
          k !== "Setting1" &&
          k !== "Setting2" &&
          k !== "Setting3" &&
          k !== "Setting4" &&
          k !== "UPH1" &&
          k !== "UPH2" &&
          k !== "UPH3" &&
          k !== "UPH4" &&
          k !== "Step1" &&
          k !== "Step2" &&
          k !== "Step3" &&
          k !== "Step4" &&
          k !== "LOSS_SX1" &&
          k !== "LOSS_SX2" &&
          k !== "LOSS_SX3" &&
          k !== "LOSS_SX4" &&
          k !== "LOSS_SETTING1" &&
          k !== "LOSS_SETTING2" &&
          k !== "LOSS_SETTING3" &&
          k !== "LOSS_SETTING4" &&
          k !== "NOTE" &&
          k !== "PD_HSD" &&
          k !== "UPDATE_REASON" &&
          k !== "UPD_DATE" &&
          k !== "UPD_EMPL" &&
          k !== "PDBV"
        ) {
          Swal.fire("Thông báo", "Không được để trống: " + k, "error");
          result = false;
          break;
        }
      }
    }
    //let checkhsd = checkHSD();   
    return result;
  };
  const handleCheckCodeInfo = async () => {
    let abc: CODE_FULL_INFO = codefullinfo;
    let result: boolean = true;
    if (company !== "CMS" && userData?.MAINDEPTNAME === "KD") {
      result = true;
    } else {
      for (const [k, v] of Object.entries(abc)) {
        if (
          (v === null || v === "") &&
          k !== "REMK" &&
          k !== "FACTORY" &&
          k !== "Setting1" &&
          k !== "Setting2" &&
          k !== "Setting3" &&
          k !== "Setting4" &&
          k !== "UPH1" &&
          k !== "UPH2" &&
          k !== "UPH3" &&
          k !== "UPH4" &&
          k !== "Step1" &&
          k !== "Step2" &&
          k !== "Step3" &&
          k !== "Step4" &&
          k !== "LOSS_SX1" &&
          k !== "LOSS_SX2" &&
          k !== "LOSS_SX3" &&
          k !== "LOSS_SX4" &&
          k !== "LOSS_SETTING1" &&
          k !== "LOSS_SETTING2" &&
          k !== "LOSS_SETTING3" &&
          k !== "LOSS_SETTING4" &&
          k !== "NOTE" &&
          k !== "PD_HSD" &&
          k !== "UPDATE_REASON" &&
          k !== "PDBV"
        ) {
          Swal.fire("Thông báo", "Không được để trống: " + k, "error");
          result = false;
          break;
        }
      }
    }
    let checkhsd = checkHSD();
    return result && checkhsd;
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
        /* checkBP(
          userData?.EMPL_NO,
          userData?.MAINDEPTNAME,
          ["RND"],
          handleAddNewCode
        ); */
        checkBP(
          userData,
          ["RND", "QLSX", "KD"],
          ["ALL"],
          ["ALL"],
          handleAddNewCode,
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
        /*   checkBP(
          userData?.EMPL_NO,
          userData?.MAINDEPTNAME,
          ["RND"],
          handleAddNewVer
        ); */
        checkBP(
          userData,
          ["RND", "QLSX", "KD"],
          ["ALL"],
          ["ALL"],
          handleAddNewVer,
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
        /* checkBP(
          userData?.EMPL_NO,
          userData?.MAINDEPTNAME,
          ["RND", "QLSX","KD"],
          handleUpdateCode
        ); */
        checkBP(
          userData,
          ["RND", "QLSX", "KD"],
          ["ALL"],
          ["ALL"],
          handleUpdateCode,
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
        ////console.log(response.data);
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
        //console.log(error);
      });
    return { NEXT_G_CODE: CODE_12 + CODE_27 + nextseq, NEXT_SEQ_NO: nextseqno };
  };
  const handleinsertCodeTBG = (NEWG_CODE: string) => {
    generalQuery("insertM100BangTinhGia", {
      G_CODE: NEWG_CODE,
      DEFAULT_DM: defaultDM,
      CODE_FULL_INFO: codefullinfo,
    })
      .then((response) => {
        ////console.log(response.data);
        if (response.data.tk_status !== "NG") {
          //Swal.fire("Thông báo", "Code mới: " + nextcode, "success");
        } else {
          Swal.fire("Thông báo", "Lỗi: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  const handleupdateCodeTBG = () => {
    generalQuery("updateM100BangTinhGia", codefullinfo)
      .then((response) => {
        ////console.log(response.data);
        if (response.data.tk_status !== "NG") {
          Swal.fire(
            "Thông báo",
            "Update thành công: " + codefullinfo.G_CODE,
            "success",
          );
        } else {
          Swal.fire("Thông báo", "Lỗi: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  const handleAddNewCode = async () => {
    ////console.log(handleCheckCodeInfo());
    let checkg_name_kd: boolean = await checkG_NAME_KD_Exist(codefullinfo.G_NAME_KD === undefined ? 'zzzzzzzzz' : codefullinfo.G_NAME_KD);
    //console.log('checkg_name_kd',checkg_name_kd);
    if ((getCompany() === 'CMS') && (await handleCheckCodeInfo()) || (getCompany() !== 'CMS' && checkg_name_kd === false)) {
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
      let nextcodeinfo = await getNextG_CODE(
        codefullinfo.CODE_12,
        CODE_27,
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
          ////console.log(response.data);
          if (response.data.tk_status !== "NG") {
            Swal.fire("Thông báo", "Code mới: " + nextcode, "success");
          } else {
            Swal.fire("Thông báo", "Lỗi: " + response.data.message, "error");
          }
        })
        .catch((error) => {
          //console.log(error);
        });
      handleinsertCodeTBG(nextcode);
    }
    else {
      if (getCompany() === 'CMS') {
      }
      else {
        Swal.fire('Cảnh báo', 'Code ' + (codefullinfo.G_NAME_KD === undefined ? 'zzzzzzzzz' : codefullinfo.G_NAME_KD) + ' đã tồn tại', 'error');
      }
    }
  };
  const handleAddNewVer = async () => {
    if ((getCompany() === 'CMS') && (await handleCheckCodeInfo()) || getCompany() !== 'CMS') {
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
      //console.log(newGCODE);
      //console.log(nextseqno);
      //console.log("NEXT REV", NEXT_REV_NO);
      await generalQuery("insertM100_AddVer", {
        G_CODE: newGCODE,
        CODE_27: CODE_27,
        NEXT_SEQ_NO: nextseqno,
        REV_NO: NEXT_REV_NO,
        CODE_FULL_INFO: codefullinfo,
      })
        .then((response) => {
          ////console.log(response.data);
          if (response.data.tk_status !== "NG") {
            Swal.fire("Thông báo", "Code ver mới: " + newGCODE, "success");
          } else {
            Swal.fire("Thông báo", "Lỗi: " + response.data.message, "error");
          }
        })
        .catch((error) => {
          //console.log(error);
        });
      handleinsertCodeTBG(newGCODE);
    }
  };
  const checkMAINVLMatching = (): boolean => {
    let checkM: boolean = false;
    if (bomsxtable.length > 0) {
      const mainM: string = bomsxtable.find((ele: BOM_SX, index: number) => ele.LIEUQL_SX == 1)?.M_NAME ?? "NG";
      console.log('mainM', mainM);
      console.log('selectedMasterMaterial.M_NAME', selectedMasterMaterial.M_NAME);
      if (mainM === 'NG') {
        checkM = false;
        Swal.fire('Thông báo', 'Bom VL chưa set liệu chính', 'error')
      }
      else {
        if (mainM === selectedMasterMaterial.M_NAME) {
          checkM = true;
        }
        else {
          checkM = false;
          Swal.fire('Thông báo', 'Liệu chính được chọn không khớp liệu chính trong BOM VL', 'error')
        }
      }
    }
    else {
      checkM = true;
    }
    return checkM;
  }
  const handleUpdateCode = async () => {
    let tempUpdateReason: string = codefullinfo?.UPDATE_REASON ?? '-';
    let currentReason: string = '-';
    if ((codefullinfo.PDBV ?? 'N') === 'Y') {
      const { value: pass1 } = await Swal.fire({
        title: "Xác nhận",
        input: "text",
        inputLabel: "Lý do update thông tin code",
        inputValue: "",
        inputPlaceholder: "Bạn update cái gì ?",
        showCancelButton: true,
      });
      currentReason = pass1 ?? '';
      tempUpdateReason = (pass1 !== undefined && pass1 !== '') ? moment().format("YYYY-MM-DD HH:mm:ss") + "_" + getUserData()?.EMPL_NO + ':' + pass1 : '';
    }
    console.log(currentReason)
    if (currentReason !== '') {
      if (checkMAINVLMatching()) {
        if ((getCompany() === 'CMS') && (await handleCheckCodeInfo2()) || getCompany() !== 'CMS') {
          let tempInfo = codefullinfo;
          if ((!(await checkHSD2())) && (getCompany() === 'CMS')) {
            tempInfo = { ...codefullinfo, PD_HSD: 'P', UPD_COUNT: (codefullinfo?.UPD_COUNT ?? 0) + 1, UPDATE_REASON: tempUpdateReason }
          }
          else {
            tempInfo = { ...codefullinfo, PD_HSD: 'N', UPD_COUNT: (codefullinfo?.UPD_COUNT ?? 0) + 1, UPDATE_REASON: tempUpdateReason }
          }
          await generalQuery("updateM100", tempInfo)
            .then((response) => {
              console.log(response.data);
              if (response.data.tk_status !== "NG") {
                Swal.fire(
                  "Thông báo",
                  "Update thành công: " + codefullinfo.G_CODE,
                  "success",
                );
              } else {
                Swal.fire("Thông báo", "Lỗi: " + response.data.message, "error");
              }
            })
            .catch((error) => {
              //console.log(error);
            });
          confirmUpdateM100TBG();
        }
      }
    }
    else {
      Swal.fire("Thông báo", "Phải nhập lý do update", "error");
    }
  };
  const handleSearchCodeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      handleCODEINFO();
    }
  };
  const handleAddNewLineBOMSX = async () => {
    if (codedatatablefilter.current.length > 0) {
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
        INS_EMPL: userData?.EMPL_NO,
        INS_DATE: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
        UPD_EMPL: userData?.EMPL_NO,
        UPD_DATE: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      };
      ////console.log(tempeditrows);
      setBOMSXTable([...bomsxtable, tempeditrows]);
    } else {
      Swal.fire("Thông báo", "Chọn 1 code trong list để thêm liệu", "warning");
    }
  };
  const handle_DeleteLineBOMSX = () => {
    if (bomsxdatatablefilter.current.length > 0) {
      let datafilter = [...bomsxtable];
      for (let i = 0; i < bomsxdatatablefilter.current.length; i++) {
        for (let j = 0; j < datafilter.length; j++) {
          if (bomsxdatatablefilter.current[i].id === datafilter[j].id) {
            if (bomgiatable.find((ele: BOM_GIA, index: number) => ele.M_CODE === bomsxdatatablefilter.current[i].M_CODE) === undefined) {
              datafilter.splice(j, 1);
            }
            else {
              Swal.fire("Thông báo", "Liệu đã có trong BOM giá, không thể xóa", "error");
            }
          }
        }
      }
      setBOMSXTable(datafilter);
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất một dòng để xóa", "error");
    }
  };
  const handleInsertBOMSX = async () => {
    let currentBOMGIA: BOM_GIA[] = [];
    await generalQuery("getbomgia", {
      G_CODE: codefullinfo.G_CODE,
    })
      .then((response) => {
        ////console.log(response.data);
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
            },
          );
          currentBOMGIA = loadeddata;
        } else {
          //Swal.fire("Thông báo", "Lỗi BOM SX: " + response.data.message, "error");          
        }
      })
      .catch((error) => {
        //console.log(error);
      });
    console.log('currentBOMGIA', currentBOMGIA);
    const mainM_BOMSX: string = bomsxtable.find((ele: BOM_SX, index: number) => ele.LIEUQL_SX == 1)?.M_NAME ?? "NG";
    const mainM_BOMGIA: string = currentBOMGIA.find((ele: BOM_GIA, index: number) => ele.MAIN_M == 1)?.M_NAME ?? "NG";
    console.log('mainM_BOMSX', mainM_BOMSX)
    console.log('mainM_BOMGIA', mainM_BOMGIA)
    if (currentBOMGIA.length > 0) {
      if (checkMAINVLMatching() && mainM_BOMGIA === mainM_BOMSX) {
        if (bomsxtable.length > 0) {
          //delete old bom from M140
          let err_code: string = "0";
          let total_lieuql_sx: number = 0;
          let check_lieuql_sx_sot: number = 0;
          let check_num_lieuql_sx: number = 1;
          let check_lieu_qlsx_khac1: number = 0;
          let m_list: string = "";
          ////console.log(chithidatatable);
          for (let i = 0; i < bomsxtable.length; i++) {
            total_lieuql_sx += bomsxtable[i].LIEUQL_SX;
            if (bomsxtable[i].LIEUQL_SX > 1) check_lieu_qlsx_khac1 += 1;
          }
          for (let i = 0; i < bomsxtable.length; i++) {
            ////console.log(bomsxtable[i].LIEUQL_SX);
            if (bomsxtable[i].LIEUQL_SX === 1) {
              for (let j = 0; j < bomsxtable.length; j++) {
                if (
                  bomsxtable[j].M_NAME === bomsxtable[i].M_NAME &&
                  bomsxtable[j].LIEUQL_SX === 0
                ) {
                  check_lieuql_sx_sot += 1;
                }
              }
            }
          }
          ////console.log('bang chi thi', bomsxtable);
          for (let i = 0; i < bomsxtable.length; i++) {
            if (bomsxtable[i].LIEUQL_SX === 1) {
              for (let j = 0; j < bomsxtable.length; j++) {
                if (bomsxtable[j].LIEUQL_SX === 1) {
                  ////console.log('i', bomsxtable[i].M_NAME);
                  ////console.log('j', bomsxtable[j].M_NAME);
                  if (bomsxtable[i].M_NAME !== bomsxtable[j].M_NAME) {
                    check_num_lieuql_sx = 2;
                  }
                }
              }
            }
          }
          ////console.log('num lieu qlsx: ' + check_num_lieuql_sx);
          ////console.log('tong lieu qly: '+ total_lieuql_sx);
          for (let i = 0; i < bomsxtable.length - 1; i++) {
            m_list += `'${bomsxtable[i].M_CODE}',`;
          }
          m_list += `'${bomsxtable[bomsxtable.length - 1].M_CODE}'`;
          //console.log("m_list", m_list);
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
                  ////console.log(response.data.data);
                } else {
                }
              })
              .catch((error) => {
                //console.log(error);
              });
            let max_g_seq: string = "001";
            await generalQuery("checkGSEQ_M140", {
              G_CODE: codefullinfo.G_CODE,
            })
              .then((response) => {
                if (response.data.tk_status !== "NG") {
                  ////console.log(response.data.data);
                  max_g_seq = response.data.data[0].MAX_G_SEQ;
                } else {
                  max_g_seq = "001";
                }
              })
              .catch((error) => {
                //console.log(error);
              });
            for (let i = 0; i < bomsxtable.length; i++) {
              let check_M_CODE: boolean = false;
              await generalQuery("check_m_code_m140", {
                G_CODE: codefullinfo.G_CODE,
                M_CODE: bomsxtable[i].M_CODE,
              })
                .then((response) => {
                  if (response.data.tk_status !== "NG") {
                    ////console.log(response.data.data);
                    check_M_CODE = true;
                  } else {
                    check_M_CODE = false;
                  }
                })
                .catch((error) => {
                  //console.log(error);
                });
              if (check_M_CODE) {
                await generalQuery("update_M140", {
                  G_CODE: codefullinfo.G_CODE,
                  M_CODE: bomsxtable[i].M_CODE,
                  M_QTY: bomsxtable[i].M_QTY,
                  MAIN_M: bomsxtable[i].MAIN_M ?? "0",
                  LIEUQL_SX: bomsxtable[i].LIEUQL_SX ?? "0",
                })
                  .then((response) => {
                    if (response.data.tk_status !== "NG") {
                      ////console.log(response.data.data);
                    } else {
                    }
                  })
                  .catch((error) => {
                    //console.log(error);
                  });
              } else {
                await generalQuery("insertM140", {
                  G_CODE: codefullinfo.G_CODE,
                  G_SEQ: zeroPad(parseInt(max_g_seq) + i + 1, 3),
                  M_CODE: bomsxtable[i].M_CODE,
                  M_QTY: bomsxtable[i].M_QTY,
                  MAIN_M: bomsxtable[i].MAIN_M ?? "0",
                  LIEUQL_SX: bomsxtable[i].LIEUQL_SX ?? "0",
                })
                  .then((response) => {
                    if (response.data.tk_status !== "NG") {
                      ////console.log(response.data.data);
                    } else {
                    }
                  })
                  .catch((error) => {
                    //console.log(error);
                  });
              }
            }
          } else {
            Swal.fire("Thông báo", "" + err_code, "error");
          }
        } else {
          Swal.fire("Thông báo", "Thêm ít nhất 1 liệu để lưu BOM", "warning");
        }
      }
      else {
        if (mainM_BOMGIA !== mainM_BOMSX) {
          Swal.fire("Thông báo", "Liệu chính trong BOM SX fai giống với liệu chính trong BOM giá", "warning",);
        }
      }
    } else {
      Swal.fire("Thông báo", "Code chưa có BOM giá, phải thêm BOM giá trước", "warning",);
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
              ////console.log(response.data.data);
            } else {
            }
          })
          .catch((error) => {
            //console.log(error);
          });
        for (let i = 0; i < bomgiatable.length; i++) {
          await generalQuery("insertM140", {
            G_CODE: codefullinfo.G_CODE,
            G_SEQ: zeroPad(i + 1, 3),
            M_CODE: bomgiatable[i].M_CODE,
            M_QTY: bomgiatable[i].M_QTY,
            MAIN_M: bomgiatable[i].MAIN_M,
            LIEUQL_SX: bomgiatable[i].MAIN_M ?? 0,
          })
            .then((response) => {
              if (response.data.tk_status !== "NG") {
                ////console.log(response.data.data);
              } else {
              }
            })
            .catch((error) => {
              //console.log(error);
            });
        }
      } else {
        Swal.fire("Thông báo", "Thêm ít nhất 1 liệu để lưu BOM", "warning");
      }
    } else {
      Swal.fire(
        "Thông báo",
        "Code đã có BOM SX, Sẽ chỉ lưu lại bom giá mà ko lưu thêm BOM SX nữa",
        "warning",
      );
    }
  };
  const handleAddNewLineBOMGIA = async () => {
    if (codedatatablefilter.current.length > 0) {
      let selected_Material_Info: MATERIAL_INFO = {
        M_ID: 564,
        M_NAME: "OS75-006WP",
        CUST_CD: "C-TECH",
        SSPRICE: 1.3,
        CMSPRICE: 1.234545455,
        SLITTING_PRICE: 0.054545455,
        MASTER_WIDTH: 1080,
        ROLL_LENGTH: 1000,
      };
      await generalQuery("checkMaterialInfo", {
        M_NAME: selectedMaterial?.M_NAME,
      })
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            ////console.log(response.data.data);
            selected_Material_Info = response.data.data[0];
          } else {
          }
        })
        .catch((error) => {
          //console.log(error);
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
        M_CMS_PRICE:
          selected_Material_Info.CMSPRICE === null
            ? 0
            : selected_Material_Info.CMSPRICE,
        M_SS_PRICE:
          selected_Material_Info.SSPRICE === null
            ? 0
            : selected_Material_Info.SSPRICE,
        M_SLITTING_PRICE:
          selected_Material_Info.SLITTING_PRICE === null
            ? 0
            : selected_Material_Info.SLITTING_PRICE,
        USAGE: "",
        MAIN_M: 0,
        MAT_MASTER_WIDTH: selected_Material_Info.MASTER_WIDTH,
        MAT_CUTWIDTH: selectedMaterial?.WIDTH_CD,
        MAT_ROLL_LENGTH: selected_Material_Info.ROLL_LENGTH,
        MAT_THICKNESS: 0,
        M_QTY: 1,
        REMARK: "",
        PROCESS_ORDER: bomgiatable.length + 1,
        INS_EMPL: userData?.EMPL_NO,
        INS_DATE: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
        UPD_EMPL: userData?.EMPL_NO,
        UPD_DATE: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      };
      ////console.log(tempeditrows);
      setBOMGIATable([...bomgiatable, tempeditrows]);
    } else {
      Swal.fire("Thông báo", "Chọn 1 code trong list để thêm liệu", "warning");
    }
  };
  const handle_DeleteLineBOMGIA = () => {
    if (bomgiadatatablefilter.current.length > 0) {
      let datafilter = [...bomgiatable];
      for (let i = 0; i < bomgiadatatablefilter.current.length; i++) {
        for (let j = 0; j < datafilter.length; j++) {
          if (bomgiadatatablefilter.current[i].id === datafilter[j].id) {
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
      console.log(bomgiatable)
      //delete old bom from M140
      let err_code: string = "0";
      let checkMAIN_M: number = 0;
      let isCodeMassProd: boolean = false;
      let isNewCode: boolean = true;
      let total_lieuql_sx: number = 0;
      let check_lieuql_sx_sot: number = 0;
      let check_num_lieuql_sx: number = 1;
      let check_lieu_qlsx_khac1: number = 0;
      let checkusageMain: number = 0;
      let m_list: string = "";
      for (let i = 0; i < bomgiatable.length - 1; i++) {
        m_list += `'${bomgiatable[i].M_CODE}',`;
      }
      m_list += `'${bomgiatable[bomgiatable.length - 1].M_CODE}'`;
      for (let i = 0; i < bomgiatable.length; i++) {
        checkusageMain += bomgiatable[i].USAGE?.toUpperCase() === 'MAIN' ? 1 : 0;
      }
      for (let i = 0; i < bomgiatable.length; i++) {
        total_lieuql_sx += bomgiatable[i].MAIN_M;
        if (bomgiatable[i].MAIN_M > 1) check_lieu_qlsx_khac1 += 1;
      }
      for (let i = 0; i < bomgiatable.length; i++) {
        ////console.log(bomgiatable[i].MAIN_M);
        if (bomgiatable[i].MAIN_M === 1) {
          for (let j = 0; j < bomgiatable.length; j++) {
            if (
              bomgiatable[j].M_NAME === bomgiatable[i].M_NAME &&
              bomgiatable[j].MAIN_M === 0
            ) {
              check_lieuql_sx_sot += 1;
            }
          }
        }
      }
      ////console.log('bang chi thi', bomgiatable);
      for (let i = 0; i < bomgiatable.length; i++) {
        if (bomgiatable[i].MAIN_M === 1) {
          for (let j = 0; j < bomgiatable.length; j++) {
            if (bomgiatable[j].MAIN_M === 1) {
              ////console.log('i', bomgiatable[i].M_NAME);
              ////console.log('j', bomgiatable[j].M_NAME);
              if (bomgiatable[i].M_NAME !== bomgiatable[j].M_NAME) {
                check_num_lieuql_sx = 2;
              }
            }
          }
        }
      }
      await generalQuery("checkMassG_CODE", {
        G_CODE: codefullinfo.G_CODE,
      })
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            isCodeMassProd = true;
            console.log(parseInt(response.data.data[0].PROD_REQUEST_DATE))
            isNewCode = parseInt(response.data.data[0].PROD_REQUEST_DATE) <= 20240824;
          } else {
            isNewCode = true;
            console.log(parseInt(response.data.message))
          }
        })
        .catch((error) => {
          //console.log(error);
        });
      console.log(isNewCode)
      for (let i = 0; i < bomgiatable.length; i++) {
        checkMAIN_M += bomgiatable[i].MAIN_M;
        if (
          bomgiatable[i].CUST_CD === "" ||
          bomgiatable[i].USAGE === "" ||
          bomgiatable[i].MAT_MASTER_WIDTH === 0 ||
          bomgiatable[i].MAT_ROLL_LENGTH === 0
        ) {
          err_code = "Không được để ô nào NG màu đỏ";
        }
      }
      if (
        total_lieuql_sx > 0 &&
        check_lieuql_sx_sot === 0 &&
        check_num_lieuql_sx === 1 &&
        check_lieu_qlsx_khac1 === 0
      ) {
      } else {
        err_code += " | Check lại liệu quản lý (liệu chính)";
      }
      if (checkusageMain === 0) {
        err_code += "_Cột USAGE chưa chỉ định liệu MAIN, hãy viết MAIN vào ô tương ứng";
      }
      if (getCompany() === 'CMS' && !isNewCode) {
        err_code += "_ Code đã YCSX mass sau 24/08/2024, không thể sửa BOM";
      }
      //console.log(checkMAIN_M);
      if (checkMAIN_M === 0) {
        err_code += "_ Phải chỉ định liệu quản lý";
      }
      ////console.log(err_code);
      if (err_code === "0") {
        //console.log("vao bom gia insert");
        await generalQuery("deleteBOM2", {
          G_CODE: codefullinfo.G_CODE,
        })
          .then((response) => {
            if (response.data.tk_status !== "NG") {
              ////console.log(response.data.data);
            } else {
            }
          })
          .catch((error) => {
            //console.log(error);
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
            M_CMS_PRICE: bomgiatable[i].M_CMS_PRICE,
            M_SS_PRICE: bomgiatable[i].M_SS_PRICE,
            M_SLITTING_PRICE: bomgiatable[i].M_SLITTING_PRICE,
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
                ////console.log(response.data.data);
              } else {
              }
            })
            .catch((error) => {
              //console.log(error);
            });
        }
        handleInsertBOMSX_WITH_GIA();
        confirmUpdateBOMTBG();
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
          MAIN_M: 0,
          MAT_MASTER_WIDTH: 0,
          MAT_CUTWIDTH: bomsxtable[i]?.WIDTH_CD,
          MAT_ROLL_LENGTH: 0,
          MAT_THICKNESS: 0,
          M_QTY: 1,
          REMARK: "",
          PROCESS_ORDER: i + 1,
          INS_EMPL: userData?.EMPL_NO,
          INS_DATE: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
          UPD_EMPL: userData?.EMPL_NO,
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
        /*  checkBP(
          userData?.EMPL_NO,
          userData?.MAINDEPTNAME,
          ["RND", "QLSX","KD"],
          handleInsertBOMSX
        ); */
        checkBP(
          userData,
          ["RND", "QLSX", "KD"],
          ["ALL"],
          ["ALL"],
          handleInsertBOMSX,
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
          userData,
          ["RND", "QLSX", "KD"],
          ["ALL"],
          ["ALL"],
          handleInsertBOMGIA,
        );
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
  const confirmUpdateM100TBG = () => {
    Swal.fire({
      title: "Bạn có muốn update luôn thông tin sản phẩm trong báo giá ?",
      text: "Update thông tin báo giá",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn Update!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          "Tiến hành Update Thông tin",
          "Đang Update Thông tin",
          "success",
        );
        let checkTBGExist: number = 0;
        generalQuery("checkTBGExist", {
          G_CODE: codefullinfo.G_CODE,
        })
          .then((response) => {
            ////console.log(response.data);
            if (response.data.tk_status !== "NG") {
              checkTBGExist = 1;
              handleupdateCodeTBG();
            } else {
              checkTBGExist = 0;
              handleinsertCodeTBG(codefullinfo.G_CODE);
            }
          })
          .catch((error) => {
            //console.log(error);
          });
      }
    });
  };
  const confirmUpdateBOMTBG = () => {
    Swal.fire({
      title: "Bạn có muốn update bom sản phẩm trong tính báo giá ?",
      text: "Update thông tin báo giá",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn Update!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          "Tiến hành Update Thông tin",
          "Đang Update bom tính báo giá",
          "success",
        );
      }
    });
  };
  const filterOptions1 = createFilterOptions({
    matchFrom: "any",
    limit: 100,
  });
  const getMachineList = async () => {
    setMachine_List(await f_getMachineListData());
  };
  const autogenerateCodeKH = (cust_cd: string) => {
    let nextCodeKH: string = cust_cd + "-001";
    generalQuery("getlastestCODKH", {
      CUST_CD: cust_cd,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let arr = response.data.data[0].G_NAME_KD.split("-");
          nextCodeKH = cust_cd + "-" + zeroPad(parseInt(arr[1]) + 1, 4);
          //console.log("nex codeKH", nextCodeKH);
          handleSetCodeInfo("CUST_CD", cust_cd);
        } else {
          //Swal.fire("Thông báo", " Có lỗi : " + response.data.message, "error");
        }
        let tempcodefullinfo = {
          ...codefullinfo,
          ["CUST_CD"]: cust_cd,
          ["G_NAME_KD"]: nextCodeKH,
        };
        setCodeFullInfo(tempcodefullinfo);
      })
      .catch((error) => {
        //console.log(error);
        Swal.fire("Thông báo", " Có lỗi : " + error, "error");
      });
    return nextCodeKH;
  };
  const [componentList, setComponentList] = useState<COMPONENT_DATA[]>([
    {
      G_CODE_MAU: "123456",
      DOITUONG_NO: 5,
      DOITUONG_NAME: "Rectangle",
      PHANLOAI_DT: "CONTAINER",
      DOITUONG_STT: "A6",
      CAVITY_PRINT: 2,
      GIATRI: "AZ:4Z99ADOEBRABHKDMAG5UZUWF5Y",
      FONT_NAME: "Arial",
      FONT_SIZE: 6,
      FONT_STYLE: "B",
      POS_X: 0,
      POS_Y: 0,
      SIZE_W: 23,
      SIZE_H: 28.6,
      ROTATE: 0,
      REMARK: "remark",
    },
    {
      G_CODE_MAU: "123456",
      DOITUONG_NO: 0,
      DOITUONG_NAME: "Code name",
      PHANLOAI_DT: "TEXT",
      DOITUONG_STT: "A0",
      CAVITY_PRINT: 2,
      GIATRI: "GH68-54619A",
      FONT_NAME: "Arial",
      FONT_SIZE: 6,
      FONT_STYLE: "B",
      POS_X: 2.26,
      POS_Y: 20.53,
      SIZE_W: 2.08,
      SIZE_H: 2.08,
      ROTATE: 0,
      REMARK: "remark",
    },
    {
      G_CODE_MAU: "123456",
      DOITUONG_NO: 1,
      DOITUONG_NAME: "Model",
      PHANLOAI_DT: "TEXT",
      DOITUONG_STT: "A1",
      CAVITY_PRINT: 2,
      GIATRI: "SM-R910NZAAXJP",
      FONT_NAME: "Arial",
      FONT_SIZE: 6,
      FONT_STYLE: "B",
      POS_X: 2.26,
      POS_Y: 15.36,
      SIZE_W: 2.08,
      SIZE_H: 2.08,
      ROTATE: 0,
      REMARK: "remark",
    },
    {
      G_CODE_MAU: "123456",
      DOITUONG_NO: 1,
      DOITUONG_NAME: "EAN No 1",
      PHANLOAI_DT: "TEXT",
      DOITUONG_STT: "A2",
      CAVITY_PRINT: 2,
      GIATRI: "4986773220257",
      FONT_NAME: "Arial",
      FONT_SIZE: 6,
      FONT_STYLE: "B",
      POS_X: 2.26,
      POS_Y: 17.97,
      SIZE_W: 2.08,
      SIZE_H: 2.08,
      ROTATE: 0,
      REMARK: "remark",
    },
    {
      G_CODE_MAU: "123456",
      DOITUONG_NO: 4,
      DOITUONG_NAME: "Logo AMZ 1",
      PHANLOAI_DT: "IMAGE",
      DOITUONG_STT: "A3",
      CAVITY_PRINT: 2,
      GIATRI: "http://14.160.33.94/images/logoAMAZON.png",
      FONT_NAME: "Arial",
      FONT_SIZE: 6,
      FONT_STYLE: "B",
      POS_X: 2.28,
      POS_Y: 2.58,
      SIZE_W: 7.11,
      SIZE_H: 7,
      ROTATE: 0,
      REMARK: "remark",
    },
    {
      G_CODE_MAU: "123456",
      DOITUONG_NO: 5,
      DOITUONG_NAME: "Barcode 1",
      PHANLOAI_DT: "1D BARCODE",
      DOITUONG_STT: "A4",
      CAVITY_PRINT: 2,
      GIATRI: "GH68-55104A",
      FONT_NAME: "Arial",
      FONT_SIZE: 6,
      FONT_STYLE: "B",
      POS_X: 1.97,
      POS_Y: 23.57,
      SIZE_W: 19.05,
      SIZE_H: 3.55,
      ROTATE: 0,
      REMARK: "remark",
    },
    {
      G_CODE_MAU: "123456",
      DOITUONG_NO: 5,
      DOITUONG_NAME: "Matrix 1",
      PHANLOAI_DT: "2D MATRIX",
      DOITUONG_STT: "A5",
      CAVITY_PRINT: 2,
      GIATRI: "AZ:4Z99ADOEBRABHKDMAG5UZUWF5Y",
      FONT_NAME: "Arial",
      FONT_SIZE: 6,
      FONT_STYLE: "B",
      POS_X: 12,
      POS_Y: 2,
      SIZE_W: 9,
      SIZE_H: 9,
      ROTATE: 0,
      REMARK: "remark",
    },
  ]);
  const handleGETBOMAMAZON = (G_CODE: string) => {
    generalQuery("getAMAZON_DESIGN", {
      G_CODE: G_CODE,
    })
      .then((response) => {
        ////console.log(response.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: COMPONENT_DATA[] = response.data.data.map(
            (element: COMPONENT_DATA, index: number) => {
              return {
                ...element,
                id: index,
              };
            },
          );
          ////console.log(loadeddata);
          setComponentList(loadeddata);
        } else {
          //Swal.fire("Thông báo", "Lỗi BOM SX: " + response.data.message, "error");
          setComponentList([]);
        }
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  useEffect(() => {
    getFSCList();
    getmateriallist();
    getcustomerlist();
    getMachineList();
    loadDefaultDM();
    loadMasterMaterialList();
    handleGETBOMAMAZON("6E00004A");
  }, []);
  return (
    <div className="bom_manager">      
      <Tabs className="tabs">
        <TabList className="tablist" style={{backgroundImage: theme.CMS.backgroundImage, color: 'gray'}}>
          <Tab>
            <span className="mininavtext">Thông tin code</span>
          </Tab>
          <Tab>
            <span className="mininavtext">Up hàng loạt</span>
          </Tab>
        </TabList>
        <TabPanel>
        <div className="bom_manager_wrapper">
          <div className="left">
            <div className="bom_manager_button">
              <div className="buttonrow1">
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    confirmAddNewCode();
                  }}
                >
                  <AiFillFileAdd color="#3366ff" size={15} />
                  ADD
                </IconButton>
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    confirmUpdateCode();
                  }}
                >
                  <MdOutlineUpdate color="#ffff00" size={15} />
                  UPDATE
                </IconButton>
              </div>
              <div className="buttonrow2">
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    confirmAddNewVer();
                  }}
                >
                  <MdUpgrade color="#cc33ff" size={15} />
                  ADD VER
                </IconButton>
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    handleClearInfo();
                  }}
                >
                  <AiFillDelete color="red" size={15} />
                  Clear
                </IconButton>
              </div>
            </div>
            <div className="codemanager">
              <div className="tracuuFcst">
                <div className="tracuuFcstform">
                  <div className="forminput">
                    <div className="forminputcolumn">
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
                  </div>
                </div>
                <div className="codeinfotable">
                  {codeInfoAGTable}
                </div>
              </div>
            </div>
            <div className="product_visualize">
              <CodeVisualLize
                DATA={{
                  id: 0,
                  Q_ID: "",
                  G_CODE: "",
                  WIDTH_OFFSET: 0,
                  LENGTH_OFFSET: 0,
                  KNIFE_UNIT: 0,
                  FILM_UNIT: 0,
                  INK_UNIT: 0,
                  LABOR_UNIT: 0,
                  DELIVERY_UNIT: 0,
                  DEPRECATION_UNIT: 0,
                  GMANAGEMENT_UNIT: 0,
                  M_LOSS_UNIT: 0,
                  G_WIDTH: codefullinfo?.G_WIDTH ?? 0,
                  G_LENGTH: codefullinfo?.G_LENGTH ?? 0,
                  G_C: codefullinfo?.G_C ?? 0,
                  G_C_R: codefullinfo?.G_C_R ?? 0,
                  G_LG: codefullinfo?.G_LG ?? 0,
                  G_CG: codefullinfo?.G_CG ?? 0,
                  G_SG_L: codefullinfo?.G_SG_L ?? 0,
                  G_SG_R: codefullinfo?.G_SG_R ?? 0,
                  PROD_PRINT_TIMES: 0,
                  KNIFE_COST: 0,
                  FILM_COST: 0,
                  INK_COST: 0,
                  LABOR_COST: 0,
                  DELIVERY_COST: 0,
                  DEPRECATION_COST: 0,
                  GMANAGEMENT_COST: 0,
                  MATERIAL_COST: 0,
                  TOTAL_COST: 0,
                  SALE_PRICE: 0,
                  PROFIT: 0,
                  G_NAME: "",
                  G_NAME_KD: "",
                  CUST_NAME_KD: "",
                  CUST_CD: "",
                }}
              />
              <div className="banve">
                <span style={{ color: "green" }}>
                  <b>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`/banve/${codefullinfo.G_CODE}.pdf`}
                    >
                      LINK
                    </a>
                  </b>
                </span>
              </div>
            </div>
          </div>
          <div className="right">
            <div className="codeinfobig">
              <div className="biginfocms">
                {" "}
                {codedatatablefilter.current[0]?.G_CODE}:{" "}
              </div>
              <div className="biginfokd">
                {codedatatablefilter.current[0]?.G_NAME}
              </div>
            </div>
            <div
              className="down"
              style={{
                backgroundImage:
                  codefullinfo.USE_YN === "Y"
                    ? `linear-gradient(0deg, #afd3d1,#72cf34)`
                    : `linear-gradient(0deg, #6C6B6B,#EFE5E5)`,
              }}
            >
              <div className="codeinfo">
                <div className="info12">
                  <div className="info1">
                    <label>
                      Khách hàng:
                      <Autocomplete
                        sx={{
                          height: 10,
                          width: "150px",
                          margin: "1px",
                          fontSize: "0.7rem",
                          marginBottom: "20px",
                          backgroundColor: "white",
                        }}
                        disabled={enableform}
                        size="small"
                        disablePortal
                        options={customerList}
                        className="autocomplete"
                        filterOptions={filterOptions1}
                        isOptionEqualToValue={(option: any, value: any) =>
                          option.CUST_CD === value.CUST_CD
                        }
                        getOptionLabel={(option: any) =>
                          `${option.CUST_NAME_KD}${option.CUST_CD}`
                        }
                        renderInput={(params) => (
                          <TextField {...params} style={{ height: "10px" }} />
                        )}
                        renderOption={(props, option: any) => <Typography style={{ fontSize: '0.7rem' }} {...props}>
                          {`${option.CUST_NAME_KD}${option.CUST_CD}`}
                        </Typography>}
                        defaultValue={{
                          CUST_CD: company === "CMS" ? "0000" : "KH000",
                          CUST_NAME: company === "CMS" ? "SEOJIN" : "PVN",
                          CUST_NAME_KD: company === "CMS" ? "SEOJIN" : "PVN",
                        }}
                        value={{
                          CUST_CD: codefullinfo.CUST_CD,
                          CUST_NAME: customerList.filter(
                            (e: CustomerListData, index: number) =>
                              e.CUST_CD === codefullinfo.CUST_CD,
                          )[0]?.CUST_NAME,
                          CUST_NAME_KD:
                            customerList.filter(
                              (e: CustomerListData, index: number) =>
                                e.CUST_CD === codefullinfo.CUST_CD,
                            )[0]?.CUST_NAME_KD === undefined
                              ? ""
                              : customerList.filter(
                                (e: CustomerListData, index: number) =>
                                  e.CUST_CD === codefullinfo.CUST_CD,
                              )[0]?.CUST_NAME_KD,
                        }}
                        onChange={(event: any, newValue: any) => {
                          //console.log(newValue);
                          handleSetCodeInfo(
                            "CUST_CD",
                            newValue === null ? "" : newValue.CUST_CD,
                          );
                        }}
                      />
                    </label>
                    {/* <label>
                      Khách hàng:
                      <select
                        disabled={enableform}
                        name='khachhang'
                        value={
                          codefullinfo?.CUST_CD === null
                            ? "0000"
                            : codefullinfo?.CUST_CD
                        }
                        onChange={(e) => {
                          //handleSetCodeInfo("CUST_CD", e.target.value);
                          if (company !== "CMS") {
                            autogenerateCodeKH(e.target.value);
                          } else {
                            handleSetCodeInfo("CUST_CD", e.target.value);
                          }
                        }}
                      >
                        {customerList.map((element, index) => (
                          <option key={index} value={element.CUST_CD}>
                            {element.CUST_NAME_KD}
                          </option>
                        ))}
                      </select>
                    </label> */}
                    <label>
                      Dự án/Project:{" "}
                      <input
                        disabled={enableform}
                        type="text"
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
                        type="text"
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
                        name="dactinhsanpham"
                        value={
                          codefullinfo?.CODE_12 === null
                            ? "7"
                            : codefullinfo?.CODE_12
                        }
                        onChange={(e) => {
                          handleSetCodeInfo("CODE_12", e.target.value);
                        }}
                      >
                        <option value={"6"}>Bán Thành Phẩm</option>
                        <option value={"7"}>Thành Phẩm</option>
                        <option value={"8"}>Nguyên Chiếc Không Ribbon</option>
                        <option value={"9"}>Nguyên Chiếc Ribbon</option>
                      </select>
                    </label>
                    <label>
                      Phân loại sản phẩm:
                      <select
                        disabled={enableform}
                        name="phanloaisanpham"
                        value={
                          codefullinfo?.PROD_TYPE === null
                            ? getCompany() === 'CMS' ? "TSP" : "LABEL"
                            : codefullinfo?.PROD_TYPE
                        }
                        onChange={(e) => {
                          handleSetCodeInfo("PROD_TYPE", e.target.value);
                        }}
                      >
                        <option value="TSP">TSP</option>
                        <option value="OLED">OLED</option>
                        <option value="UV">UV</option>
                        <option value="TAPE">TAPE</option>
                        <option value="LABEL">LABEL</option>
                        <option value="RIBBON">RIBBON</option>
                        <option value="SPT">SPT</option>
                      </select>
                    </label>
                    <label>
                      {company === "CMS" ? "Code KD" : "Code KT"}
                      <input
                        disabled={enableform}
                        placeholder={
                          company === "CMS" ? "GH63-18084A" : "KH001-xxxx"
                        }
                        type="text"
                        value={
                          codefullinfo?.G_NAME_KD === null
                            ? ""
                            : codefullinfo?.G_NAME_KD
                        }
                        onChange={(e) => {
                          if (getCompany() === 'CMS') {
                            let temp_G_NAME_KD: string = e.target.value;
                            let final_G_NAME_KD: string = e.target.value;
                            if (temp_G_NAME_KD.length >= 2) {
                              if (temp_G_NAME_KD.substring(0, 2) === 'GH' && ["0014", "0025", "0456", "0052", "0053", "2611", "0054"].includes(codefullinfo.CUST_CD ?? "")) {
                                if (temp_G_NAME_KD.length <= 11) {
                                  final_G_NAME_KD = temp_G_NAME_KD;
                                }
                                else {
                                  final_G_NAME_KD = temp_G_NAME_KD.substring(0, 11)
                                }
                              }
                            }
                            handleSetCodeInfo("G_NAME_KD", final_G_NAME_KD);
                          }
                          else {
                            handleSetCodeInfo("G_NAME_KD", e.target.value);
                          }
                        }}
                      ></input>
                    </label>
                    <label>
                      Mô tả/Spec:{" "}
                      <input
                        disabled={enableform}
                        type="text"
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
                      <Autocomplete
                        sx={{
                          height: 10,
                          width: "150px",
                          margin: "1px",
                          fontSize: "0.7rem",
                          marginBottom: "20px",
                          backgroundColor: "white",
                        }}
                        disabled={enableform}
                        size="small"
                        disablePortal
                        options={masterMaterialList}
                        className="autocomplete"
                        filterOptions={filterOptions1}
                        isOptionEqualToValue={(option: any, value: any) =>
                          option.M_NAME === value.M_NAME
                        }
                        getOptionLabel={(option: any) => `${option.M_NAME}`}
                        renderInput={(params) => (
                          <TextField {...params} style={{ height: "10px" }} />
                        )}
                        renderOption={(props, option: any) => <Typography style={{ fontSize: '0.7rem' }} {...props}>
                          {`${option.M_NAME}| ${option.EXP_DATE}`}
                        </Typography>}
                        defaultValue={{
                          M_NAME: "SJ-203020HC",
                          EXP_DATE: 6
                        }}
                        value={{
                          M_NAME: codefullinfo.PROD_MAIN_MATERIAL,
                          EXP_DATE: codefullinfo.EXP_DATE
                        }}
                        onChange={(event: any, newValue: any) => {
                          console.log(newValue);
                          setSelectedMasterMaterial(newValue);
                          handleSetCodeInfo(
                            "PROD_MAIN_MATERIAL",
                            newValue === null ? "" : newValue.M_NAME,
                          );
                        }}
                      />
                    </label>
                    {/*  <label>
                      VL Chính:{" "}
                      <input
                        disabled={true}
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
                    </label> */}
                    <label>
                      {company === "CMS" ? "Code RnD:" : "Code Khách Hàng:"}
                      <input
                        disabled={enableform}
                        type="text"
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
                  <div className="info2">
                    <label>
                      Chiều dài sp(Length):{" "}
                      <input
                        disabled={enableform}
                        type="text"
                        value={
                          codefullinfo?.G_LENGTH === null
                            ? 0
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
                        type="text"
                        value={
                          codefullinfo?.G_WIDTH === null
                            ? 0
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
                        type="text"
                        value={codefullinfo?.PD === null ? 0 : codefullinfo?.PD}
                        onChange={(e) => {
                          handleSetCodeInfo("PD", e.target.value);
                        }}
                      ></input>
                    </label>
                    <label>
                      Cavity hàng:{" "}
                      <input
                        disabled={enableform}
                        type="text"
                        value={
                          codefullinfo?.G_C_R === null ? 0 : codefullinfo?.G_C_R
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
                        type="text"
                        value={
                          codefullinfo?.G_C === null ? 0 : codefullinfo?.G_C
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
                        type="text"
                        value={
                          codefullinfo?.G_LG === null ? 0 : codefullinfo?.G_LG
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
                        type="text"
                        value={
                          codefullinfo?.G_CG === null ? 0 : codefullinfo?.G_CG
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
                        type="text"
                        value={
                          codefullinfo?.G_SG_L === null
                            ? 0
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
                        type="text"
                        value={
                          codefullinfo?.G_SG_R === null
                            ? 0
                            : codefullinfo?.G_SG_R
                        }
                        onChange={(e) => {
                          handleSetCodeInfo("G_SG_R", e.target.value);
                        }}
                      ></input>
                    </label>
                  </div>
                  <div className="info11">
                    <label>
                      Hướng cuộn:
                      <select
                        disabled={enableform}
                        name="huongmoroll"
                        value={
                          codefullinfo?.PACK_DRT === null
                            ? "1"
                            : codefullinfo?.PACK_DRT
                        }
                        onChange={(e) => {
                          handleSetCodeInfo("PACK_DRT", e.target.value);
                        }}
                      >
                        <option value="1">Hàng ở mặt ngoài</option>
                        <option value="0">Hàng ở mặt trong</option>
                      </select>
                    </label>
                    <label>
                      Loại dao:
                      <select
                        disabled={enableform}
                        name="loaidao"
                        value={
                          codefullinfo?.KNIFE_TYPE === null
                            ? 0
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
                        type="text"
                        value={
                          codefullinfo?.KNIFE_LIFECYCLE === null
                            ? 0
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
                        type="text"
                        value={
                          codefullinfo?.KNIFE_PRICE === null
                            ? 0
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
                        name="packingtype"
                        value={
                          codefullinfo?.CODE_33 === null
                            ? "03"
                            : codefullinfo?.CODE_33
                        }
                        onChange={(e) => {
                          handleSetCodeInfo("CODE_33", e.target.value);
                        }}
                      >
                        <option value="02">ROLL</option>
                        <option value="03">SHEET</option>
                      </select>
                    </label>
                    <label>
                      Đơn vị:
                      <select
                        disabled={enableform}
                        name="dvt"
                        value={
                          codefullinfo?.PROD_DVT === null
                            ? "01"
                            : codefullinfo?.PROD_DVT
                        }
                        onChange={(e) => {
                          handleSetCodeInfo("PROD_DVT", e.target.value);
                        }}
                      >
                        <option value="01">EA</option>
                        <option value="02">Met</option>
                        <option value="03">Cuộn</option>
                        <option value="04">Bộ</option>
                        <option value="05">Gói</option>
                        <option value="06">Kg</option>
                        <option value="99">X</option>
                      </select>
                    </label>
                    <label>
                      Packing QTY:{" "}
                      <input
                        disabled={enableform}
                        type="text"
                        value={
                          codefullinfo?.ROLE_EA_QTY === null
                            ? 0
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
                        type="text"
                        value={
                          codefullinfo?.RPM === null ? 0 : codefullinfo?.RPM
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
                        type="text"
                        value={
                          codefullinfo?.PIN_DISTANCE === null
                            ? 0
                            : codefullinfo?.PIN_DISTANCE
                        }
                        onChange={(e) => {
                          handleSetCodeInfo("PIN_DISTANCE", e.target.value);
                        }}
                      ></input>
                    </label>
                  </div>
                  <div className="info22">
                    <label>
                      PROCESS TYPE:{" "}
                      <input
                        disabled={enableform}
                        type="text"
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
                    <label>
                      Máy 1:
                      <select
                        disabled={enableform}
                        name="may1"
                        value={
                          codefullinfo?.EQ1 === null || codefullinfo?.EQ1 === ""
                            ? "NA"
                            : codefullinfo?.EQ1
                        }
                        onChange={(e) => {
                          handleSetCodeInfo("EQ1", e.target.value);
                        }}
                      >
                        {machine_list.map(
                          (ele: MACHINE_LIST, index: number) => {
                            return (
                              <option key={index} value={ele.EQ_NAME}>
                                {ele.EQ_NAME}
                              </option>
                            );
                          },
                        )}
                      </select>
                    </label>
                    <label>
                      Máy 2:
                      <select
                        disabled={enableform}
                        name="may2"
                        value={
                          codefullinfo?.EQ2 === null || codefullinfo?.EQ2 === ""
                            ? "NA"
                            : codefullinfo?.EQ2
                        }
                        onChange={(e) => {
                          handleSetCodeInfo("EQ2", e.target.value);
                        }}
                      >
                        {machine_list.map(
                          (ele: MACHINE_LIST, index: number) => {
                            return (
                              <option key={index} value={ele.EQ_NAME}>
                                {ele.EQ_NAME}
                              </option>
                            );
                          },
                        )}
                      </select>
                    </label>
                    <label>
                      Máy 3:
                      <select
                        disabled={enableform}
                        name="may3"
                        value={
                          codefullinfo?.EQ3 === null || codefullinfo?.EQ3 === ""
                            ? "NA"
                            : codefullinfo?.EQ3
                        }
                        onChange={(e) => {
                          handleSetCodeInfo("EQ3", e.target.value);
                        }}
                      >
                        {machine_list.map(
                          (ele: MACHINE_LIST, index: number) => {
                            return (
                              <option key={index} value={ele.EQ_NAME}>
                                {ele.EQ_NAME}
                              </option>
                            );
                          },
                        )}
                      </select>
                    </label>
                    <label>
                      Máy 4:
                      <select
                        disabled={enableform}
                        name="may4"
                        value={
                          codefullinfo?.EQ4 === null || codefullinfo?.EQ4 === ""
                            ? "NA"
                            : codefullinfo?.EQ4
                        }
                        onChange={(e) => {
                          handleSetCodeInfo("EQ4", e.target.value);
                        }}
                      >
                        {machine_list.map(
                          (ele: MACHINE_LIST, index: number) => {
                            return (
                              <option key={index} value={ele.EQ_NAME}>
                                {ele.EQ_NAME}
                              </option>
                            );
                          },
                        )}
                      </select>
                    </label>
                    <label>
                      Số bước (dao):{" "}
                      <input
                        disabled={enableform}
                        type="text"
                        value={
                          codefullinfo?.PROD_DIECUT_STEP === null
                            ? 0
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
                        type="text"
                        value={
                          codefullinfo?.PROD_PRINT_TIMES === null
                            ? 0
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
                        name="may1"
                        value={
                          codefullinfo?.PO_TYPE === null ||
                            codefullinfo?.PO_TYPE === ""
                            ? "E1"
                            : codefullinfo?.PO_TYPE
                        }
                        onChange={(e) => {
                          handleSetCodeInfo("PO_TYPE", e.target.value);
                        }}
                      >
                        <option value="E1">E1</option>
                        <option value="E2">E2</option>
                      </select>
                    </label>
                    <label>
                      FSC:
                      <select
                        disabled={enableform}
                        name="may1"
                        value={
                          codefullinfo?.FSC === null || codefullinfo?.FSC === ""
                            ? "N"
                            : codefullinfo?.FSC
                        }
                        onChange={(e) => {
                          let tempcodefullinfo = {
                            ...codefullinfo,
                            FSC: e.target.value,
                            FSC_CODE: e.target.value === 'N' ? '01' : codefullinfo.FSC_CODE
                          };
                          ////console.log(tempcodefullinfo);
                          setCodeFullInfo(tempcodefullinfo);
                        }}
                      >
                        <option value="Y">YES</option>
                        <option value="N">NO</option>
                      </select>
                    </label>
                    <label>
                      Loại FSC:
                      <select
                        disabled={codefullinfo?.FSC === 'N'}
                        name='fsc'
                        value={codefullinfo?.FSC_CODE}
                        onChange={(e) => {
                          handleSetCodeInfo(
                            "FSC_CODE", e.target.value,
                          );
                        }}
                      >
                        {
                          fscList.map((ele: FSC_LIST_DATA, index: number) => {
                            return (
                              <option key={index} value={ele.FSC_CODE}> {ele.FSC_NAME} </option>
                            )
                          })
                        }
                      </select>
                    </label>
                  </div>
                  <div className="info33">
                    <label>
                      Remark:{" "}
                      <input
                        disabled={enableform}
                        type="text"
                        value={
                          codefullinfo?.REMK === null ? "" : codefullinfo?.REMK
                        }
                        onChange={(e) => {
                          handleSetCodeInfo("REMK", e.target.value);
                        }}
                      ></input>
                    </label>
                    {getCompany() === 'CMS' && <label>
                      QL_HSD:
                      <select
                        disabled={enableform}
                        name="may1"
                        value={
                          codefullinfo?.QL_HSD === null || codefullinfo?.QL_HSD === ""
                            ? "N"
                            : codefullinfo?.QL_HSD
                        }
                        onChange={(e) => {
                          handleSetCodeInfo("QL_HSD", e.target.value);
                        }}
                      >
                        <option value="Y">YES</option>
                        <option value="N">NO</option>
                      </select>
                    </label>}
                    {getCompany() === 'CMS' && <label>
                      HSD
                      <select
                        disabled={enableform}
                        name="may1"
                        value={codefullinfo?.EXP_DATE ?? 0}
                        onChange={(e) => {
                          handleSetCodeInfo("EXP_DATE", e.target.value);
                        }}
                      >
                        <option value={0}>Chưa nhập HSD</option>
                        <option value={6}>6 tháng</option>
                        <option value={12}>12 tháng</option>
                        <option value={18}>18 tháng</option>
                        <option value={24}>24 tháng</option>
                      </select>
                    </label>}
                    {/*  <label>
                      <span style={{fontSize:'1.2rem', color: codefullinfo.USE_YN ==='Y'? 'blue':'red', backgroundColor:codefullinfo.USE_YN ==='Y'? 'white': 'white'}}   >{codefullinfo.USE_YN ==='Y'? 'MỞ':'KHÓA'}</span>
                    </label> */}
                    <label>
                      <span style={{ color: "gray" }}>
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={`/banve/${codefullinfo.G_CODE}.pdf`}
                        >
                          LINK BẢN VẼ
                        </a>
                      </span>
                      __
                      {getCompany() === 'CMS' && <span style={{ color: "gray" }}>
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={`/appsheet/Appsheet_${codefullinfo.G_CODE}.docx`}
                        >
                          LINK APPSHEET
                        </a>
                      </span>}
                    </label>
                    <label>
                      <div className="updiv">
                        Up bản vẽ
                        <div className="uploadfile">
                          <IconButton
                            disabled={enableform}
                            className="buttonIcon"
                            onClick={uploadFilebanVe}
                          >
                            <AiOutlineCloudUpload color="yellow" size={15} />
                            Upload
                          </IconButton>
                          <input
                            disabled={enableform}
                            accept=".pdf"
                            type="file"
                            onChange={(e: any) => {
                              setFile(e.target.files[0]);
                              //console.log(e.target.files[0]);
                            }}
                          />
                        </div>
                      </div>
                    </label>
                    <label>
                      {getCompany() === 'CMS' && <div className="updiv">
                        Up appsheet
                        <div className="uploadfile">
                          <IconButton
                            disabled={enableform}
                            className="buttonIcon"
                            onClick={uploadFileAppsheet}
                          >
                            <AiOutlineCloudUpload color="yellow" size={15} />
                            Upload
                          </IconButton>
                          <input
                            disabled={enableform}
                            accept=".docx"
                            type="file"
                            onChange={(e: any) => {
                              setFile2(e.target.files[0]);
                              //console.log(e.target.files[0]);
                            }}
                          />
                        </div>
                      </div>}
                    </label>
                    <FormControlLabel
                      disabled={enableform}
                      label="Mở/Khóa"
                      className="useynbt"
                      control={
                        <Checkbox
                          checked={codefullinfo?.USE_YN === "Y"}
                          onChange={(e) => {
                            handleSetCodeInfo(
                              "USE_YN",
                              e.target.checked === true ? "Y" : "N",
                            );
                          }}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      }
                    />
                    {company === "CMS" && (
                      <Button
                        onClick={() => {
                          setShowHideTemLot(!showhidetemlot);
                        }}
                      >
                        Show/Hide Tem LOT
                      </Button>
                    )}
                    {company === "CMS" && showhidetemlot && (
                      <div className="lotlabelbackground">
                        <Button
                          color="success"
                          onClick={() => {
                            handlePrint();
                          }}
                        >
                          Print LOT
                        </Button>
                      </div>
                    )}
                    {company === "CMS" && showhidetemlot && (
                      <div className="lotlabel">
                        <div className="lotelement" ref={labelprintref}>
                          {renderElement(componentList)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="info34">
                  <div className="info3"></div>
                  <div className="info4"></div>
                </div>
              </div>
            </div>
            <div className="updatehistory">
              Update {codefullinfo.UPD_COUNT ?? 0} lần / Người update cuối {codefullinfo.UPD_EMPL ?? ''} / Thời điểm update cuối {moment.utc(codefullinfo.UPD_DATE ?? '').format("YYYY-MM-DD HH:mm:ss")}
            </div>
            <div className="materiallist">
              <Autocomplete
                disabled={column_bomsx[0].editable || column_bomgia[0].editable}
                size="small"
                disablePortal
                options={materialList}
                className="autocomplete"
                filterOptions={filterOptions1}
                isOptionEqualToValue={(option: any, value: any) =>
                  option.M_CODE === value.M_CODE
                }
                getOptionLabel={(option: MaterialListData | any) =>
                  `${option.M_NAME}|${option.WIDTH_CD}|${option.M_CODE}`
                }
                renderInput={(params) => (
                  <TextField {...params} label="Select material" />
                )}
                renderOption={(props, option: any) => <Typography style={{ fontSize: '0.7rem' }} {...props}>
                  {`${option.M_NAME}|${option.WIDTH_CD}|${option.M_CODE}`}
                </Typography>}
                defaultValue={{
                  M_CODE: "A0007770",
                  M_NAME: "SJ-203020HC",
                  WIDTH_CD: 208,
                }}
                value={selectedMaterial}
                onChange={(event: any, newValue: MaterialListData | any) => {
                  //console.log(newValue);
                  setSelectedMaterial(newValue);
                }}
              />
            </div>
            <div className="up">
              <div className="bomsx" style={{ backgroundColor: `${pinBOM ? 'blue' : ''}` }}>
                <div className="bomsxtable">
                  <span
                    style={{ fontSize: 16, fontWeight: "bold", marginLeft: 10, color: `${pinBOM ? 'white' : ''}`, backgroundColor: `${pinBOM ? 'blue' : ''}` }}
                  >
                    BOM SẢN XUẤT (
                    {column_bomsx[0].editable ? "Bật Sửa" : "Tắt Sửa"}){" "}
                    {pinBOM ? "(Đang ghim BOM)" : ""}
                  </span>
                  {bomsx_AGTable}
                </div>
              </div>
              <div className="bomgia">
                <div className="bomgiatable">
                  <span
                    style={{ fontSize: 16, fontWeight: "bold", marginLeft: 10, color: `${pinBOM ? 'white' : ''}`, backgroundColor: `${pinBOM ? 'blue' : ''}` }}
                  >
                    BOM GIÁ({column_bomgia[0].editable ? "Bật Sửa" : "Tắt Sửa"})
                    {pinBOM ? "(Đang ghim BOM)" : ""}
                  </span>
                  {bomgia_AGTable}
                </div>
              </div>
            </div>
            <div className="bottom"></div>
          </div>
        </div>          
        </TabPanel>
        <TabPanel>
        <div className="uphangloat">
          <UpHangLoat />
        </div>

        </TabPanel>
      </Tabs>      
      {showHideDesignBom &&
        <div className="design_panel">
          <div className="closediv">
            <IconButton
              className="buttonIcon"
              onClick={() => {
                setShowHideDesignBOM(prev => !prev)
              }}
            >
              <AiOutlineClose color="red" size={20} />
              Close
            </IconButton>
          </div>
          <BOM_DESIGN />
        </div>
      }      
    </div>
  );
};
export default BOM_MANAGER;

import React, { useContext, useEffect, useRef, useState } from "react";
import BARCODE from "./design_components/BARCODE";
import RECTANGLE from "./design_components/RECTANGLE";
import TEXT from "./design_components/TEXT";
import QRCODE from "./design_components/QRCODE";
import QRCode from "qrcode.react";
import DATAMATRIX from "./design_components/DATAMATRIX";
import IMAGE from "./design_components/IMAGE";
import Draggable from "devextreme-react/draggable";
import "./DESIGN_AMAZON.scss";
import {
  Avatar,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { FcAddImage, FcAddRow, FcDeleteRow } from "react-icons/fc";
import { TbComponents } from "react-icons/tb";
import Swal from "sweetalert2";
import { GrAdd } from "react-icons/gr";
import { generalQuery, getAuditMode } from "../../../api/Api";
import {
  DataGrid,
  GridCallbackDetails,
  GridCellEditStopParams,
  GridRowSelectionModel,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  MuiBaseEvent,
  MuiEvent,
} from "@mui/x-data-grid";
import { SaveExcel, checkBP, renderElement } from "../../../api/GlobalFunction";
import { AiFillFileExcel } from "react-icons/ai";
import { BiPrinter, BiSave, BiShow } from "react-icons/bi";
import { useReactToPrint } from "react-to-print";
import { UserContext } from "../../../api/Context";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  BOM_AMAZON,
  CODE_INFO,
  COMPONENT_DATA,
  POINT_DATA,
  UserData,
} from "../../../api/GlobalInterface";

const DESIGN_AMAZON = () => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData,
  );
  const labelprintref = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => labelprintref.current,
  });
  const [showhidecodelist, setShowHideCodeList] = useState(true);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [startPoint, setStartPoint] = useState<POINT_DATA>({ x: 0, y: 0 });
  const [endPoint, setEndPoint] = useState<POINT_DATA>({ x: 0, y: 0 });
  const [rows, setRows] = useState<CODE_INFO[]>([]);
  const [isLoading, setisLoading] = useState(false);
  const [codeCMS, setCodeCMS] = useState("");
  const [bomamazontable, setBOMAMAZONTable] = useState<BOM_AMAZON[]>([]);
  const [G_CODE_MAU, setG_CODE_MAU] = useState("7A07994A");
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
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);
  const [enableEdit, setEnableEdit] = useState(false);
  const [newComponent, setNewComponent] = useState("TEXT");
  const [currentComponent, setCurrentComponent] = useState(0);
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
  const [codedatatablefilter, setCodeDataTableFilter] = useState<
    Array<CODE_INFO>
  >([]);
  const [codeinfoCMS, setcodeinfoCMS] = useState<any>("");
  function CustomToolbarCODETable() {
    return (
      <GridToolbarContainer>
        <IconButton
          className="buttonIcon"
          onClick={() => {
            SaveExcel(rows, "Code Info Table");
          }}
        >
          <AiFillFileExcel color="green" size={15} />
          SAVE
        </IconButton>
        <GridToolbarQuickFilter />
      </GridToolbarContainer>
    );
  }
  const handleGETBOMAMAZON = (G_CODE: string) => {
    setisLoading(true);
    generalQuery("getAMAZON_DESIGN", {
      G_CODE: G_CODE,
    })
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: COMPONENT_DATA[] = response.data.data.map(
            (element: COMPONENT_DATA, index: number) => {
              return {
                ...element,
                id: index,
              };
            },
          );
          //console.log(loadeddata);
          setComponentList(loadeddata);
          setisLoading(false);
        } else {
          //Swal.fire("Thông báo", "Lỗi BOM SX: " + response.data.message, "error");
          setComponentList([]);
          setisLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const [trigger, setTrigger] = useState(false);
  const [editedRows, setEditedRows] = useState<Array<GridCellEditStopParams>>(
    [],
  );
  const [codeinfoKD, setcodeinfoKD] = useState<any>("");
  const handleCODESelectionforUpdate = (ids: GridRowSelectionModel) => {
    const selectedID = new Set(ids);
    let datafilter = rows.filter((element: CODE_INFO) =>
      selectedID.has(element.id),
    );
    if (datafilter.length > 0) {
      setCodeDataTableFilter(datafilter);
      setcodeinfoCMS(datafilter[0].G_CODE);
      setcodeinfoKD(datafilter[0].G_NAME);
      handleGETBOMAMAZON(datafilter[0].G_CODE);
    } else {
      setCodeDataTableFilter([]);
    }
  };
  const addComponent = () => {
    if (codedatatablefilter.length > 0) {
      let max_dt_no: number = 0;
      for (let i = 0; i < componentList.length; i++) {
        if (max_dt_no < componentList[i].DOITUONG_NO)
          max_dt_no = componentList[i].DOITUONG_NO;
      }
      let temp_compList: COMPONENT_DATA = {
        G_CODE_MAU: codedatatablefilter[0].G_CODE,
        DOITUONG_NO: max_dt_no + 1,
        DOITUONG_NAME: newComponent,
        PHANLOAI_DT: newComponent,
        DOITUONG_STT: "A" + (max_dt_no + 1),
        CAVITY_PRINT: 2,
        GIATRI: "1234",
        FONT_NAME: "Arial",
        FONT_SIZE: 6,
        FONT_STYLE: "B",
        POS_X: 0,
        POS_Y: 0,
        SIZE_W: 9,
        SIZE_H: 9,
        ROTATE: 0,
        REMARK: "",
      };
      setComponentList([...componentList, temp_compList]);
    } else {
      Swal.fire("Thông báo", "Chọn code phôi trước", "error");
    }
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
                G_NAME: getAuditMode() == 0? element?.G_NAME : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME : 'TEM_NOI_BO',
G_NAME_KD: getAuditMode() == 0? element?.G_NAME_KD : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME_KD : 'TEM_NOI_BO',
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
  const handleSearchCodeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      handleCODEINFO();
    }
  };
  const checkDesignExist = async (G_CODE_MAU: string) => {
    let isDesignExist: boolean = false;
    await generalQuery("checkDesignExistAMZ", {
      G_CODE: G_CODE_MAU,
    })
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
          isDesignExist = true;
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return isDesignExist;
  };
  const deleteAMZDesign = async (G_CODE_MAU: string) => {
    await generalQuery("deleteAMZDesign", {
      G_CODE: G_CODE_MAU,
    })
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const saveDesignAmazon = async () => {
    if (codedatatablefilter.length > 0) {
      let checkExist: boolean = await checkDesignExist(
        codedatatablefilter[0].G_CODE,
      );
      console.log(checkExist);
      if (checkExist) {
        //neu ton tai design, delete xong insert
        console.log(codedatatablefilter[0].G_CODE);
        await deleteAMZDesign(codedatatablefilter[0].G_CODE);
        if (componentList.length > 0) {
          let err_code: string = "";
          for (let i = 0; i < componentList.length; i++) {
            await generalQuery("insertAMZDesign", componentList[i])
              // eslint-disable-next-line no-loop-func
              .then((response) => {
                //console.log(response.data);
                if (response.data.tk_status !== "NG") {
                } else {
                  err_code += "Lỗi: " + response.data.message + "| ";
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
          if (err_code === "") {
            Swal.fire("Thông báo", "Lưu DESIGN thành công", "success");
          } else {
            Swal.fire("Thông báo", "Thất bại: " + err_code, "error");
          }
        } else {
          Swal.fire("Thông báo", "Tạo ít nhất 1 component", "error");
        }
      } else {
        //neu khong ton tai design, insert
        if (componentList.length > 0) {
          let err_code: string = "";
          for (let i = 0; i < componentList.length; i++) {
            await generalQuery("insertAMZDesign", componentList[i])
              // eslint-disable-next-line no-loop-func
              .then((response) => {
                //console.log(response.data);
                if (response.data.tk_status !== "NG") {
                } else {
                  err_code += "Lỗi: " + response.data.message + "| ";
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
          if (err_code === "") {
            Swal.fire("Thông báo", "Lưu DESIGN thành công", "success");
          } else {
            Swal.fire("Thông báo", "Thất bại: " + err_code, "error");
          }
        } else {
          Swal.fire("Thông báo", "Tạo ít nhất 1 component", "error");
        }
      }
    } else {
      Swal.fire("Thông báo", "Chọn code phôi để lưu", "error");
    }
  };
  const confirmSaveDESIGN_AMAZON = () => {
    Swal.fire({
      title: "Chắc chắn muốn lưu DESIGN AMAZON ?",
      text: "Sẽ ghi đè tất cả design cũ bằng design bạn vừa tạo !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn lưu!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành Lưu DESIGN", "Đang lưu DESIGN", "success");
        /*  checkBP(
          userData?.EMPL_NO,
          userData?.MAINDEPTNAME,
          ["RND"],
          saveDesignAmazon
        ); */
        checkBP(userData, ["RND"], ["ALL"], ["ALL"], saveDesignAmazon);
        //handleInsertBOMSX();
      }
    });
  };
  useEffect(() => { }, [trigger]);
  return (
    (<div className="design_window">
      <div className="design_control" id="dsg_ctrl">
        {showhidecodelist && (
          <div className="codelist">
            <span style={{ color: "blue", fontWeight: "bold", fontSize: 20 }}>
              List Code
            </span>
            <div className="tracuuFcst">
              <div className="tracuuFcstform">
                <div className="forminput">
                  <div className="forminputcolumn">
                    <label>
                      <b> All Code:</b>{" "}
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
                </div>
              </div>
              <div className="codeinfotable">
                <DataGrid
                  slots={{
                    toolbar: CustomToolbarCODETable,                    
                  }}
                  sx={{ fontSize: 12 }}
                  loading={isLoading}
                  rowHeight={30}
                  rows={rows}
                  columns={column_codeinfo}
                  onRowSelectionModelChange={(ids) => {
                    handleCODESelectionforUpdate(ids);
                  }}
                  /*  rows={codeinfodatatable}
                columns={columnDefinition} */
                  pageSizeOptions={[
                    5, 10, 50, 100, 500, 1000, 5000, 10000, 100000,
                  ]}
                  editMode="cell"
                  /* experimentalFeatures={{ newEditingApi: true }}  */
                  onCellEditStop={(
                    params: GridCellEditStopParams,
                    event: MuiEvent<MuiBaseEvent>,
                    details: GridCallbackDetails,
                  ) => {
                    //console.log(params);
                    let tempeditrows = editedRows;
                    tempeditrows.push(params);
                    setEditedRows(tempeditrows);
                    //console.log(editedRows);
                    const keyvar = params.field;
                    const newdata = rows.map((p) =>
                      p.id === params.id ? { ...p, [keyvar]: params.value } : p,
                    );
                    setRows(newdata);
                  }}
                />
              </div>
            </div>
          </div>
        )}
        <div className="componentList">
          <div className="title">
            <div style={{ color: "blue", fontWeight: "bold", fontSize: 20 }}>
              List Component
            </div>
          </div>
          <div className="componentdiv">
            <div className="addnewcomponent">
              <label>
                New Component:
                <select
                  name="newcomponent"
                  value={newComponent}
                  onChange={(e) => {
                    setNewComponent(e.target.value);
                  }}
                >
                  <option value="TEXT">TEXT</option>
                  <option value="IMAGE">IMAGE</option>
                  <option value="1D BARCODE">1D BARCODE</option>
                  <option value="2D MATRIX">2D MATRIX</option>
                  <option value="QRCODE">QRCODE</option>
                  <option value="CONTAINER">CONTAINER</option>
                </select>
              </label>
              <IconButton
                className="buttonIcon"
                onClick={() => {
                  addComponent();
                }}
              >
                <GrAdd color="white" size={15} />
                Add
              </IconButton>
            </div>
            <List dense={true}>
              {componentList.map((ele: COMPONENT_DATA, index: number) => {
                return (
                  <ListItem
                    onDragEnter={(e) => {
                      setEndIndex(index);
                    }}
                    onDragEnd={(e) => {
                      console.log(startIndex + "|" + endIndex);
                      let temp_component_list: COMPONENT_DATA[] = componentList;
                      let temp_ele: COMPONENT_DATA =
                        temp_component_list[startIndex];
                      temp_component_list[startIndex] =
                        temp_component_list[endIndex];
                      temp_component_list[endIndex] = temp_ele;
                      setComponentList(temp_component_list);
                      setTrigger(!trigger);
                    }}
                    /* onDragExit={(e)=> {console.log(e)}} */
                    /* onDragOver={(e)=> {console.log(e)}} */
                    onDragStart={(e) => {
                      setStartIndex(index);
                    }}
                    draggable={true}
                    key={index}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        style={{ backgroundColor: "transparent" }}
                        size="small"
                        onClick={() => {
                          let old: COMPONENT_DATA[] = componentList.filter(
                            (ele: COMPONENT_DATA, index1: number) => {
                              return index1 !== index;
                            },
                          );
                          setComponentList(old);
                        }}
                      >
                        <FcDeleteRow />
                      </IconButton>
                    }
                  >
                    <ListItemButton
                      role={undefined}
                      onClick={() => {
                        setCurrentComponent(index);
                      }}
                      dense
                    >
                      <ListItemAvatar>
                        <Avatar
                          style={{ backgroundColor: "transparent" }}
                          sizes="small"
                        >
                          <TbComponents />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${ele.DOITUONG_NO}.${ele.DOITUONG_NAME}`}
                        secondary={ele.PHANLOAI_DT}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </div>
        </div>
        <div className="componentProps">
          <span style={{ color: "blue", fontWeight: "bold", fontSize: 20 }}>
            Component Properties{" "}
          </span>
          {componentList.length > 0 && (
            <div className="propsform">
              <div className="forminput">
                <div className="forminputcolumn">
                  <b>COMPONENT TYPE:</b>
                  <label>
                    <select
                      name="newcomponent"
                      value={
                        componentList.filter(
                          (ele: COMPONENT_DATA, index: number) =>
                            currentComponent === index,
                        )[0]?.PHANLOAI_DT
                      }
                      onChange={(e) => {
                        const newComponentList = componentList.map(
                          (p: COMPONENT_DATA, index: number) =>
                            index === currentComponent
                              ? { ...p, PHANLOAI_DT: e.target.value }
                              : p,
                        );
                        setComponentList(newComponentList);
                      }}
                    >
                      <option value="TEXT">TEXT</option>
                      <option value="IMAGE">IMAGE</option>
                      <option value="1D BARCODE">1D BARCODE</option>
                      <option value="2D MATRIX">2D MATRIX</option>
                      <option value="QRCODE">QRCODE</option>
                      <option value="CONTAINER">CONTAINER</option>
                    </select>
                  </label>
                  <b>COMPONENT NAME</b>
                  <label>
                    <input
                      type="text"
                      placeholder="Code hàng"
                      value={
                        componentList.filter(
                          (ele: COMPONENT_DATA, index: number) =>
                            currentComponent === index,
                        )[0]?.DOITUONG_NAME
                      }
                      onChange={(e) => {
                        const newComponentList = componentList.map(
                          (p: COMPONENT_DATA, index: number) =>
                            index === currentComponent
                              ? { ...p, DOITUONG_NAME: e.target.value }
                              : p,
                        );
                        setComponentList(newComponentList);
                      }}
                    ></input>
                  </label>
                  <b>COMPONENT STT</b>
                  <label>
                    <input
                      type="text"
                      placeholder="Code hàng"
                      value={
                        componentList.filter(
                          (ele: COMPONENT_DATA, index: number) =>
                            currentComponent === index,
                        )[0]?.DOITUONG_STT
                      }
                      onChange={(e) => {
                        const newComponentList = componentList.map(
                          (p: COMPONENT_DATA, index: number) =>
                            index === currentComponent
                              ? { ...p, DOITUONG_STT: e.target.value }
                              : p,
                        );
                        setComponentList(newComponentList);
                      }}
                    ></input>
                  </label>
                  <b>CAVITY PRINT</b>
                  <label>
                    <input
                      type="text"
                      placeholder="Code hàng"
                      value={
                        componentList.filter(
                          (ele: COMPONENT_DATA, index: number) =>
                            currentComponent === index,
                        )[0]?.CAVITY_PRINT
                      }
                      onChange={(e) => {
                        const newComponentList = componentList.map(
                          (p: COMPONENT_DATA, index: number) =>
                            index === currentComponent
                              ? { ...p, CAVITY_PRINT: Number(e.target.value) }
                              : p,
                        );
                        setComponentList(newComponentList);
                      }}
                    ></input>
                  </label>
                  <b>VALUE</b>
                  <label>
                    <input
                      type="text"
                      placeholder="Giá trị"
                      value={
                        componentList.filter(
                          (ele: COMPONENT_DATA, index: number) =>
                            currentComponent === index,
                        )[0]?.GIATRI
                      }
                      onChange={(e) => {
                        const newComponentList = componentList.map(
                          (p: COMPONENT_DATA, index: number) =>
                            index === currentComponent
                              ? { ...p, GIATRI: e.target.value }
                              : p,
                        );
                        setComponentList(newComponentList);
                      }}
                    ></input>
                  </label>
                  <b>FONT NAME</b>
                  <label>
                    <input
                      type="text"
                      placeholder="Nhập tên font"
                      value={
                        componentList.filter(
                          (ele: COMPONENT_DATA, index: number) =>
                            currentComponent === index,
                        )[0]?.FONT_NAME
                      }
                      onChange={(e) => {
                        const newComponentList = componentList.map(
                          (p: COMPONENT_DATA, index: number) =>
                            index === currentComponent
                              ? { ...p, FONT_NAME: e.target.value }
                              : p,
                        );
                        setComponentList(newComponentList);
                      }}
                    ></input>
                  </label>
                  <b>COMPONENT NO</b>
                  <label>
                    <input
                      type="text"
                      placeholder="Nhập COMPONENT NO"
                      value={
                        componentList.filter(
                          (ele: COMPONENT_DATA, index: number) =>
                            currentComponent === index,
                        )[0]?.DOITUONG_NO
                      }
                      onChange={(e) => {
                        const newComponentList = componentList.map(
                          (p: COMPONENT_DATA, index: number) =>
                            index === currentComponent
                              ? { ...p, DOITUONG_NO: Number(e.target.value) }
                              : p,
                        );
                        setComponentList(newComponentList);
                      }}
                    ></input>
                  </label>
                </div>
              </div>
              <div className="forminput">
                <div className="forminputcolumn">
                  <b>FONT SIZE (pt)</b>
                  <label>
                    <input
                      type="number"
                      step={0.1}
                      placeholder="Code hàng"
                      value={
                        componentList.filter(
                          (ele: COMPONENT_DATA, index: number) =>
                            currentComponent === index,
                        )[0]?.FONT_SIZE
                      }
                      onChange={(e) => {
                        const newComponentList = componentList.map(
                          (p: COMPONENT_DATA, index: number) =>
                            index === currentComponent
                              ? { ...p, FONT_SIZE: Number(e.target.value) }
                              : p,
                        );
                        setComponentList(newComponentList);
                      }}
                    ></input>
                  </label>
                  <b>FONT STYLE:</b>
                  <label>
                    <select
                      name="fontstyle"
                      value={
                        componentList.filter(
                          (ele: COMPONENT_DATA, index: number) =>
                            currentComponent === index,
                        )[0]?.FONT_STYLE
                      }
                      onChange={(e) => {
                        const newComponentList = componentList.map(
                          (p: COMPONENT_DATA, index: number) =>
                            index === currentComponent
                              ? { ...p, FONT_STYLE: e.target.value }
                              : p,
                        );
                        setComponentList(newComponentList);
                      }}
                    >
                      <option value="B">Bold</option>
                      <option value="I">Italic</option>
                      <option value="U">Underline</option>
                      <option value="R">Regular</option>
                    </select>
                  </label>
                  <b>POS X (mm)</b>
                  <label>
                    <input
                      type="number"
                      step={0.01}
                      lang="en-US"
                      placeholder="10"
                      value={
                        componentList.filter(
                          (ele: COMPONENT_DATA, index: number) =>
                            currentComponent === index,
                        )[0]?.POS_X
                      }
                      onChange={(e) => {
                        const newComponentList = componentList.map(
                          (p: COMPONENT_DATA, index: number) =>
                            index === currentComponent
                              ? { ...p, POS_X: Number(e.target.value) }
                              : p,
                        );
                        setComponentList(newComponentList);
                      }}
                    ></input>
                  </label>
                  <b>POS Y (mm)</b>
                  <label>
                    <input
                      type="number"
                      step={0.01}
                      lang="en-US"
                      placeholder="10"
                      value={
                        componentList.filter(
                          (ele: COMPONENT_DATA, index: number) =>
                            currentComponent === index,
                        )[0]?.POS_Y
                      }
                      onChange={(e) => {
                        const newComponentList = componentList.map(
                          (p: COMPONENT_DATA, index: number) =>
                            index === currentComponent
                              ? { ...p, POS_Y: Number(e.target.value) }
                              : p,
                        );
                        setComponentList(newComponentList);
                      }}
                    ></input>
                  </label>
                  <b>SIZE WIDTH (mm)</b>
                  <label lang="en-US">
                    <input
                      type="number"
                      step={0.01}
                      lang="en-US"
                      placeholder="10"
                      value={
                        componentList.filter(
                          (ele: COMPONENT_DATA, index: number) =>
                            currentComponent === index,
                        )[0]?.SIZE_W
                      }
                      onChange={(e) => {
                        const vl = e.target.value;
                        const newComponentList = componentList.map(
                          (p: COMPONENT_DATA, index: number) =>
                            index === currentComponent
                              ? { ...p, SIZE_W: Number(vl) }
                              : p,
                        );
                        setComponentList(newComponentList);
                      }}
                    ></input>
                  </label>
                  <b>SIZE HEIGHT (mm)</b>
                  <label lang="en-US">
                    <input
                      type="number"
                      step={0.01}
                      lang="en-US"
                      placeholder="10"
                      value={
                        componentList.filter(
                          (ele: COMPONENT_DATA, index: number) =>
                            currentComponent === index,
                        )[0]?.SIZE_H
                      }
                      onChange={(e) => {
                        const newComponentList = componentList.map(
                          (p: COMPONENT_DATA, index: number) =>
                            index === currentComponent
                              ? { ...p, SIZE_H: Number(e.target.value) }
                              : p,
                        );
                        setComponentList(newComponentList);
                      }}
                    ></input>
                  </label>
                  <b>ROTATE (degree)</b>
                  <label lang="en-US">
                    <input
                      type="number"
                      step={0.01}
                      lang="en-US"
                      placeholder="10"
                      value={
                        componentList.filter(
                          (ele: COMPONENT_DATA, index: number) =>
                            currentComponent === index,
                        )[0]?.ROTATE
                      }
                      onChange={(e) => {
                        const newComponentList = componentList.map(
                          (p: COMPONENT_DATA, index: number) =>
                            index === currentComponent
                              ? { ...p, ROTATE: Number(e.target.value) }
                              : p,
                        );
                        setComponentList(newComponentList);
                      }}
                    ></input>
                  </label>
                  <b>REMARK</b>
                  <label lang="en-US">
                    <input
                      type="text"
                      lang="en-US"
                      placeholder="remark"
                      value={
                        componentList.filter(
                          (ele: COMPONENT_DATA, index: number) =>
                            currentComponent === index,
                        )[0]?.REMARK
                      }
                      onChange={(e) => {
                        const newComponentList = componentList.map(
                          (p: COMPONENT_DATA, index: number) =>
                            index === currentComponent
                              ? { ...p, REMARK: e.target.value }
                              : p,
                        );
                        setComponentList(newComponentList);
                      }}
                    ></input>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="design_panel">
        <div className="design_toolbar">
          <IconButton
            className="buttonIcon"
            onClick={() => {
              setShowHideCodeList(!showhidecodelist);
            }}
          >
            <BiShow color="black" size={15} />
            List
          </IconButton>
          <IconButton
            className="buttonIcon"
            onClick={() => {
              confirmSaveDESIGN_AMAZON();
            }}
          >
            <BiSave color="black" size={15} />
            Save
          </IconButton>
          <IconButton
            className="buttonIcon"
            onClick={() => {
              handlePrint();
            }}
          >
            <BiPrinter color="black" size={15} />
            Print
          </IconButton>
          X:
          <input
            type="number"
            step={0.01}
            value={x * 0.26458333333719}
            onChange={(e) => {
              console.log(Number(e.target.value) / 0.26458333333719);
              setX(Number(e.target.value) / 0.26458333333719);
            }}
            style={{ width: "80px" }}
          ></input>{" "}
          (mm) Y:
          <input
            type="number"
            step={0.01}
            value={y * 0.26458333333719}
            onChange={(e) => {
              console.log(Number(e.target.value) / 0.26458333333719);
              setY(Number(e.target.value) / 0.26458333333719);
            }}
            style={{ width: "80px" }}
          ></input>{" "}
          (mm)
        </div>
        <div id="10a" className="designAmazon" style={{ position: "relative" }}>
          <Draggable           
            className="print-content" 
            boundary={"#design_panel"}
            id="11a"
            data="dropArea"
            onDragStart={(e: any) => {
              //console.log(e);
            }}
            onDragMove={(e: any) => {
              var offsets1 = document
                .getElementById("10a")
                ?.getBoundingClientRect();
              var offsets2 = document
                .getElementById("11a")
                ?.getBoundingClientRect();
              var top1 = offsets1?.top;
              var left1 = offsets1?.left;
              var top2 = offsets2?.top;
              var left2 = offsets2?.left;
              if (
                top1 !== undefined &&
                top2 !== undefined &&
                left1 !== undefined &&
                left2 !== undefined
              ) {
                setY(top2 - top1);
                setX(left2 - left1);
              }
            }}
            onDragEnd={(e: any) => {
              console.log(e.event.offset);
            }}
            clone={false}           
          >
            <div className="labelprint" ref={labelprintref}> {renderElement(componentList)}</div>
           
          </Draggable>
        </div>
      </div>
    </div>)
  );
};
export default DESIGN_AMAZON;

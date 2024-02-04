/* eslint-disable no-loop-func */
import {
  Autocomplete,
  IconButton,
  LinearProgress,
  TextField,
} from "@mui/material";
import {
  DataGrid,
  GridCallbackDetails,
  GridCellEditCommitParams,
  GridSelectionModel,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
  MuiBaseEvent,
  MuiEvent,
} from "@mui/x-data-grid";
import moment from "moment";
import React, { useContext, useEffect, useState, useTransition } from "react";
import {
  AiFillFileExcel,
  AiOutlineCloudUpload,
  AiOutlinePrinter,
} from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import Swal from "sweetalert2";
import { generalQuery } from "../../../api/Api";
import { UserContext } from "../../../api/Context";
import { checkBP, SaveExcel } from "../../../api/GlobalFunction";
import "./MATERIAL_MANAGER.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { UserData } from "../../../api/GlobalInterface";
interface MATERIAL_TABLE_DATA {
  M_ID: number;
  M_NAME: string;
  CUST_CD: string;
  SSPRICE: number;
  CMSPRICE: number;
  SLITTING_PRICE: number;
  MASTER_WIDTH: number;
  ROLL_LENGTH: number;
}
const MATERIAL_MANAGER = () => {
  const [alltime, setAllTime] = useState(false);
  const [editedRows, setEditedRows] = useState<Array<GridCellEditCommitParams>>(
    [],
  );
  const [editable, setEditTable] = useState(false);
  const [readyRender, setReadyRender] = useState(false);
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData,
  );
  const [isLoading, setisLoading] = useState(false);
  const [datatable, setDataTable] = useState<any[]>([]);
  const [current_Column, setCurrent_Column] = useState<any[]>([]);
  const [material_table_data_filter, set_material_table_data_filter] = useState<
    Array<MATERIAL_TABLE_DATA>
  >([]);
  const [nextPlan, setNextPlan] = useState("");
  const [tableTitle, setTableTitle] = useState("BẢNG VẬT LIỆU");
  const column_material_table = [
    { field: "M_ID", headerName: "M_ID", width: 80, editable: editable },
    { field: "M_NAME", headerName: "M_NAME", width: 150, editable: editable },
    { field: "CUST_CD", headerName: "VENDOR", width: 120, editable: editable },
    { field: "SSPRICE", headerName: "SSPRICE", width: 120, editable: editable },
    {
      field: "CMSPRICE",
      headerName: "CMSPRICE",
      width: 120,
      editable: editable,
    },
    {
      field: "SLITTING_PRICE",
      headerName: "SLITTING_PRICE",
      width: 120,
      editable: editable,
    },
    {
      field: "MASTER_WIDTH",
      headerName: "MASTER_WIDTH",
      width: 150,
      editable: editable,
    },
    {
      field: "ROLL_LENGTH",
      headerName: "ROLL_LENGTH",
      width: 150,
      editable: editable,
    },
  ];
  function CustomToolbarLICHSUINPUTSX() {
    return (
      <GridToolbarContainer>
        <IconButton
          className="buttonIcon"
          onClick={() => {
            SaveExcel(datatable, "Material Table");
          }}
        >
          <AiFillFileExcel color="green" size={15} />
          SAVE
        </IconButton>
        <GridToolbarQuickFilter />
        <div className="div" style={{ fontSize: 20, fontWeight: "bold" }}>
          {tableTitle}
        </div>
        <IconButton
          className="buttonIcon"
          onClick={() => {
            setEditTable(!editable);
            Swal.fire("Thông báo", "Bật/Tắt Sửa thành công", "success");
          }}
        >
          <BiEdit color="yellow" size={15} />
          Bật/Tắt sửa
        </IconButton>
        {editable === true ? "Bật Sửa" : "Tắt Sửa"}
      </GridToolbarContainer>
    );
  }
  const load_material_table = () => {
    generalQuery("get_material_table", {
      M_NAME: nextPlan,
      NGMATERIAL: alltime,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: MATERIAL_TABLE_DATA, index: number) => {
              return {
                ...element,
                id: index,
              };
            },
          );
          //console.log(loadeddata);
          setDataTable(loadeddata);
          setCurrent_Column(column_material_table);
          setReadyRender(true);
          setisLoading(false);
          Swal.fire(
            "Thông báo",
            "Đã load: " + response.data.data.length + " dòng",
            "success",
          );
        } else {
          setDataTable([]);
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const save_material_table = async () => {
    if (material_table_data_filter.length > 0) {
      console.log(material_table_data_filter);
      let err_code: string = "";
      for (let i = 0; i < material_table_data_filter.length; i++) {
        if (
          material_table_data_filter[i].CUST_CD === null ||
          material_table_data_filter[i].CUST_CD === ""
        ) {
          err_code += " | Tên vendor không được để trống";
        } else if (material_table_data_filter[i].SSPRICE === null) {
          err_code += " | Giá SS không được để trống";
        } else if (material_table_data_filter[i].CMSPRICE === null) {
          err_code += " | Giá CMS không được để trống";
        } else if (material_table_data_filter[i].MASTER_WIDTH === null) {
          err_code += " | Khổ cây không được để trống";
        } else if (material_table_data_filter[i].ROLL_LENGTH === null) {
          err_code += " | Độ dài liệu không được để trống";
        } else {
          await generalQuery("update_material_info", {
            M_ID: material_table_data_filter[i].M_ID,
            CUST_CD: material_table_data_filter[i].CUST_CD,
            SSPRICE: material_table_data_filter[i].SSPRICE,
            CMSPRICE: material_table_data_filter[i].CMSPRICE,
            SLITTING_PRICE: material_table_data_filter[i].SLITTING_PRICE,
            MASTER_WIDTH: material_table_data_filter[i].MASTER_WIDTH,
            ROLL_LENGTH: material_table_data_filter[i].ROLL_LENGTH,
          })
            .then((response) => {
              //console.log(response.data.data);
              if (response.data.tk_status !== "NG") {
              } else {
                setDataTable([]);
                Swal.fire(
                  "Thông báo",
                  "Nội dung: " + response.data.message,
                  "error",
                );
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
        if (err_code !== "") {
          console.log(material_table_data_filter[i].M_NAME + ": " + err_code);
        } else {
          Swal.fire("Thông báo", "Đã lưu thông tin vật liệu thành công");
        }
      }
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 liệu để lưu data", "error");
    }
  };
  const handleMaterialDataSelectionforUpdate = (ids: GridSelectionModel) => {
    const selectedID = new Set(ids);
    let datafilter = datatable.filter((element: any) =>
      selectedID.has(element.M_ID),
    );
    //console.log(datafilter);
    if (datafilter.length > 0) {
      set_material_table_data_filter(datafilter);
    } else {
      set_material_table_data_filter([]);
    }
  };
  const handleSearchCodeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      setisLoading(true);
      setReadyRender(false);
      setCurrent_Column(column_material_table);
      load_material_table();
    }
  };
  useEffect(() => {
    setisLoading(false);
    setReadyRender(true);
  }, []);
  return (
    <div className="material_manager">
      <div className="tracuuDataInspection">
        <div className="tracuuDataInspectionform">
          <div className="forminput">
            <div className="forminputcolumn">
              <label>
                <b>Tên Liệu</b>
                <input
                  type="text"
                  value={nextPlan}
                  onChange={(e) => setNextPlan(e.target.value)}
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Chỉ liệu thiếu thông tin:</b>
                <input
                  type="checkbox"
                  name="alltimecheckbox"
                  defaultChecked={alltime}
                  onChange={() => setAllTime(!alltime)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <button
                className="tranhatky"
                onClick={() => {
                  setisLoading(true);
                  setReadyRender(false);
                  setCurrent_Column(column_material_table);
                  load_material_table();
                }}
              >
                TRA LIỆU
              </button>
            </div>
            <div className="forminputcolumn">
              <button
                className="xuatnext"
                onClick={() => {
                  /*  checkBP(
                    userData?.EMPL_NO,
                    userData?.MAINDEPTNAME,
                    ["KD", "RND"],
                    save_material_table
                  ); */
                  checkBP(
                    userData,
                    ["KD", "RND"],
                    ["ALL"],
                    ["ALL"],
                    save_material_table,
                  );

                  //save_material_table();
                }}
              >
                SAVE
              </button>
            </div>
          </div>
          <div className="formbutton"></div>
        </div>
        <div className="tracuuYCSXTable">
          {readyRender && (
            <DataGrid
              sx={{ fontSize: 12, flex: 1 }}
              components={{
                Toolbar: CustomToolbarLICHSUINPUTSX,
                LoadingOverlay: LinearProgress,
              }}
              loading={isLoading}
              rowHeight={30}
              rows={datatable}
              columns={column_material_table}
              rowsPerPageOptions={[
                5, 10, 50, 100, 500, 1000, 5000, 10000, 500000,
              ]}
              checkboxSelection
              disableSelectionOnClick
              editMode="cell"
              getRowId={(row) => row.M_ID}
              onSelectionModelChange={(ids) => {
                handleMaterialDataSelectionforUpdate(ids);
              }}
              onCellEditCommit={(
                params: GridCellEditCommitParams,
                event: MuiEvent<MuiBaseEvent>,
                details: GridCallbackDetails,
              ) => {
                //console.log(params);
                let tempeditrows = editedRows;
                tempeditrows.push(params);
                setEditedRows(tempeditrows);
                //console.log(editedRows);
                const keyvar = params.field;
                const newdata = datatable.map((p) =>
                  p.M_ID === params.id ? { ...p, [keyvar]: params.value } : p,
                );
                setDataTable(newdata);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default MATERIAL_MANAGER;

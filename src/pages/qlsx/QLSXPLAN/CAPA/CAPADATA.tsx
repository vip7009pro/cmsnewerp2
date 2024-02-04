import { IconButton } from "@mui/material";
import {
  Column,
  Editing,
  FilterRow,
  Pager,
  Scrolling,
  SearchPanel,
  Selection,
  DataGrid,
  Paging,
  Toolbar,
  Item,
  Export,
  ColumnChooser,
  Summary,
  TotalItem,
} from "devextreme-react/data-grid";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { AiFillCloseCircle, AiFillFileExcel } from "react-icons/ai";
import Swal from "sweetalert2";
import "./CAPADATA.scss";
import { MdOutlinePivotTableChart } from "react-icons/md";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import { generalQuery } from "../../../../api/Api";
import { SaveExcel, checkBP } from "../../../../api/GlobalFunction";
import { UserContext } from "../../../../api/Context";
import PivotTable from "../../../../components/PivotChart/PivotChart";
import { BiSearch } from "react-icons/bi";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import {
  CAPA_LEADTIME_DATA,
  DINHMUC_QSLX,
  MACHINE_LIST,
  UserData,
} from "../../../../api/GlobalInterface";
const CAPADATA = () => {
  const [machine_list, setMachine_List] = useState<MACHINE_LIST[]>([]);
  const getMachineList = () => {
    generalQuery("getmachinelist", {})
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: MACHINE_LIST[] = response.data.data.map(
            (element: MACHINE_LIST, index: number) => {
              return {
                ...element,
              };
            },
          );
          loadeddata.push(
            { EQ_NAME: "ALL" },
            { EQ_NAME: "NO" },
            { EQ_NAME: "NA" },
          );
          console.log(loadeddata);
          setMachine_List(loadeddata);
        } else {
          //Swal.fire("Thông báo", "Lỗi BOM SX: " + response.data.message, "error");
          setMachine_List([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData,
  );
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [codeKD, setCodeKD] = useState("");
  const [codeCMS, setCodeCMS] = useState("");
  const [machine, setMachine] = useState("ALL");
  const [factory, setFactory] = useState("ALL");
  const [prodrequestno, setProdRequestNo] = useState("");
  const [plan_id, setPlanID] = useState("");
  const [alltime, setAllTime] = useState(true);
  const [datasxtable, setDataSXTable] = useState<Array<any>>([]);
  const [dataleadtimecapa, setDataLeadTimeCapa] = useState<
    Array<CAPA_LEADTIME_DATA>
  >([]);
  const [m_name, setM_Name] = useState("");
  const [m_code, setM_Code] = useState("");
  const [selectedRows, setSelectedRows] = useState<number>(0);
  const [selectedG_Code, setSelectedG_Code] = useState("");
  const [selectedG_NAME, setSelectedG_NAME] = useState("");
  const [datadinhmuc, setDataDinhMuc] = useState<DINHMUC_QSLX>({
    FACTORY: "NM1",
    EQ1: "",
    EQ2: "",
    EQ3: "",
    EQ4: "",
    Setting1: 0,
    Setting2: 0,
    Setting3: 0,
    Setting4: 0,
    UPH1: 0,
    UPH2: 0,
    UPH3: 0,
    UPH4: 0,
    Step1: 0,
    Step2: 0,
    Step3: 0,
    Step4: 0,
    LOSS_SX1: 0,
    LOSS_SX2: 0,
    LOSS_SX3: 0,
    LOSS_SX4: 0,
    LOSS_SETTING1: 0,
    LOSS_SETTING2: 0,
    LOSS_SETTING3: 0,
    LOSS_SETTING4: 0,
    NOTE: "",
  });
  const getDataDinhMucGCode = (G_CODE: string) => {
    generalQuery("getdatadinhmuc_G_CODE", {
      G_CODE: G_CODE,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let rowData = response.data.data[0];
          setDataDinhMuc({
            ...datadinhmuc,
            FACTORY: rowData.FACTORY === null ? "NA" : rowData.FACTORY,
            EQ1:
              rowData.EQ1 === "" || rowData.EQ1 === null ? "NA" : rowData.EQ1,
            EQ2:
              rowData.EQ2 === "" || rowData.EQ2 === null ? "NA" : rowData.EQ2,
            Setting1: rowData.Setting1 === null ? 0 : rowData.Setting1,
            Setting2: rowData.Setting2 === null ? 0 : rowData.Setting2,
            UPH1: rowData.UPH1 === null ? 0 : rowData.UPH1,
            UPH2: rowData.UPH2 === null ? 0 : rowData.UPH2,
            Step1: rowData.Step1 === null ? 0 : rowData.Step1,
            Step2: rowData.Step2 === null ? 0 : rowData.Step2,
            LOSS_SX1: rowData.LOSS_SX1 === null ? 0 : rowData.LOSS_SX1,
            LOSS_SX2: rowData.LOSS_SX2 === null ? 0 : rowData.LOSS_SX2,
            LOSS_SETTING1:
              rowData.LOSS_SETTING1 === null ? 0 : rowData.LOSS_SETTING1,
            LOSS_SETTING2:
              rowData.LOSS_SETTING2 === null ? 0 : rowData.LOSS_SETTING2,
            NOTE: rowData.NOTE === null ? "" : rowData.NOTE,
          });
        } else {
          Swal.fire("Thông báo", " Có lỗi : " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_loaddatasx = () => {
    Swal.fire({
      title: "Tra cứu data leadtime ycsx balance",
      text: "Đang tải dữ liệu, hãy chờ chút",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });
    generalQuery("ycsxbalanceleadtimedata", {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      PROD_REQUEST_NO: prodrequestno,
      PLAN_ID: plan_id,
      M_NAME: m_name,
      M_CODE: m_code,
      G_NAME: codeKD,
      G_CODE: codeCMS,
      FACTORY: factory,
      PLAN_EQ: machine,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: CAPA_LEADTIME_DATA[] = response.data.data.map(
            (element: CAPA_LEADTIME_DATA, index: number) => {
              return {
                ...element,
                id: index,
              };
            },
          );
          //setShowLoss(false);
          Swal.fire(
            "Thông báo",
            "Đã load : " + loaded_data.length + " dòng",
            "success",
          );
          setDataLeadTimeCapa(loaded_data);
        } else {
          Swal.fire("Thông báo", " Có lỗi : " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const materialDataTable = React.useMemo(
    () => (
      <div className="datatb">
        <DataGrid
          autoNavigateToFocusedRow={true}
          allowColumnReordering={true}
          allowColumnResizing={true}
          columnAutoWidth={false}
          cellHintEnabled={true}
          columnResizingMode={"widget"}
          showColumnLines={true}
          dataSource={dataleadtimecapa}
          columnWidth="auto"
          keyExpr="id"
          height={"70vh"}
          width={`100%`}
          showBorders={true}
          onSelectionChanged={(e) => {
            setSelectedRows(e.selectedRowsData.length);
          }}
          onRowClick={(e) => {
            //console.log(e.data);
            setSelectedG_Code(e.data.G_CODE);
            setSelectedG_NAME(e.data.G_NAME);
            getDataDinhMucGCode(e.data.G_CODE);
          }}
        >
          <Scrolling
            useNative={true}
            scrollByContent={true}
            scrollByThumb={true}
            showScrollbar="onHover"
            mode="virtual"
          />
          <Selection mode="single" />
          <Editing
            allowUpdating={false}
            allowAdding={true}
            allowDeleting={false}
            mode="batch"
            confirmDelete={true}
            onChangesChange={(e) => { }}
          />
          <Export enabled={true} />
          <Toolbar disabled={false}>
            <Item location="before">
              <IconButton
                className="buttonIcon"
                onClick={() => {
                  SaveExcel(dataleadtimecapa, "MaterialStatus");
                }}
              >
                <AiFillFileExcel color="green" size={15} />
                SAVE
              </IconButton>
              <IconButton
                className="buttonIcon"
                onClick={() => {
                  setShowHidePivotTable(!showhidePivotTable);
                }}
              >
                <MdOutlinePivotTableChart color="#ff33bb" size={15} />
                Pivot
              </IconButton>
              <IconButton
                className="buttonIcon"
                onClick={() => {
                  handle_loaddatasx();
                }}
              >
                <BiSearch color="blue" size={15} />
                Search
              </IconButton>
            </Item>
            <Item name="searchPanel" />
            <Item name="exportButton" />
            <Item name="columnChooser" />
          </Toolbar>
          <FilterRow visible={true} />
          <SearchPanel visible={true} />
          <ColumnChooser enabled={true} />
        </DataGrid>
      </div>
    ),
    [dataleadtimecapa],
  );
  const dataSource = new PivotGridDataSource({
    fields: [
      {
        caption: "PROD_REQUEST_NO",
        width: 80,
        dataField: "PROD_REQUEST_NO",
        allowSorting: true,
        allowFiltering: true,
        dataType: "string",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "PROD_REQUEST_QTY",
        width: 80,
        dataField: "PROD_REQUEST_QTY",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "G_CODE",
        width: 80,
        dataField: "G_CODE",
        allowSorting: true,
        allowFiltering: true,
        dataType: "string",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "G_NAME",
        width: 80,
        dataField: "G_NAME",
        allowSorting: true,
        allowFiltering: true,
        dataType: "string",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "Setting1",
        width: 80,
        dataField: "Setting1",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "Setting2",
        width: 80,
        dataField: "Setting2",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "UPH1",
        width: 80,
        dataField: "UPH1",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "UPH2",
        width: 80,
        dataField: "UPH2",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "TON_CD1",
        width: 80,
        dataField: "TON_CD1",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "TON_CD2",
        width: 80,
        dataField: "TON_CD2",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "EQ1",
        width: 80,
        dataField: "EQ1",
        allowSorting: true,
        allowFiltering: true,
        dataType: "string",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "EQ2",
        width: 80,
        dataField: "EQ2",
        allowSorting: true,
        allowFiltering: true,
        dataType: "string",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "LEATIME1",
        width: 80,
        dataField: "LEATIME1",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
      {
        caption: "LEATIME2",
        width: 80,
        dataField: "LEATIME2",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 300,
        },
      },
    ],
    store: dataleadtimecapa,
  });
  const handleSaveQLSX = async () => {
    if (selectedG_Code !== "") {

      checkBP(userData, ['QLSX'], ['ALL'], ['ALL'], async () => {
        let err_code: string = "0";
        console.log(datadinhmuc);
        if (
          datadinhmuc.FACTORY === "NA" ||
          datadinhmuc.EQ1 === "NA" ||
          datadinhmuc.EQ1 === "NO" ||
          datadinhmuc.EQ2 === "" ||
          datadinhmuc.Setting1 === 0 ||
          datadinhmuc.UPH1 === 0 ||
          datadinhmuc.Step1 === 0 ||
          datadinhmuc.LOSS_SX1 === 0
        ) {
          Swal.fire(
            "Thông báo",
            "Lưu thất bại, hãy nhập đủ thông tin",
            "error",
          );
        } else {
          generalQuery("saveQLSX", {
            G_CODE: selectedG_Code,
            FACTORY: datadinhmuc.FACTORY,
            EQ1: datadinhmuc.EQ1,
            EQ2: datadinhmuc.EQ2,
            Setting1: datadinhmuc.Setting1,
            Setting2: datadinhmuc.Setting2,
            UPH1: datadinhmuc.UPH1,
            UPH2: datadinhmuc.UPH2,
            Step1: datadinhmuc.Step1,
            Step2: datadinhmuc.Step2,
            LOSS_SX1: datadinhmuc.LOSS_SX1,
            LOSS_SX2: datadinhmuc.LOSS_SX2,
            LOSS_SETTING1: datadinhmuc.LOSS_SETTING1,
            LOSS_SETTING2: datadinhmuc.LOSS_SETTING2,
            NOTE: datadinhmuc.NOTE,
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
          if (err_code === "1") {
            Swal.fire(
              "Thông báo",
              "Lưu thất bại, không được để trống ô cần thiết",
              "error",
            );
          } else {
            Swal.fire("Thông báo", "Lưu thành công", "success");
          }
        }
      })
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 Code để SET !", "error");
    }
  };
  useEffect(() => {
    //setColumnDefinition(column_inspect_output);
    getMachineList();
    handle_loaddatasx();
  }, []);
  return (
    <div className="capadata">
      <div className="tracuuDataInspection">
        <div className="tracuuDataInspectionform">
          <div className="forminput">
            <div className="forminputcolumn">
              <label>
                <b>EQ1:</b>
                <select
                  name="machine"
                  value={datadinhmuc.EQ1}
                  onChange={(e) => {
                    setDataDinhMuc({ ...datadinhmuc, EQ1: e.target.value });
                  }}
                  style={{ width: 150, height: 30 }}
                >
                  {machine_list.map((ele: MACHINE_LIST, index: number) => {
                    return (
                      <option key={index} value={ele.EQ_NAME}>
                        {ele.EQ_NAME}
                      </option>
                    );
                  })}
                </select>
              </label>
              <label>
                <b>EQ2:</b>
                <select
                  name="machine"
                  value={datadinhmuc.EQ2}
                  onChange={(e) => {
                    setDataDinhMuc({ ...datadinhmuc, EQ2: e.target.value });
                  }}
                  style={{ width: 150, height: 30 }}
                >
                  {machine_list.map((ele: MACHINE_LIST, index: number) => {
                    return (
                      <option key={index} value={ele.EQ_NAME}>
                        {ele.EQ_NAME}
                      </option>
                    );
                  })}
                </select>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Setting1(min):</b>{" "}
                <input
                  type="text"
                  placeholder="Thời gian setting 1"
                  value={datadinhmuc.Setting1}
                  onChange={(e) =>
                    setDataDinhMuc({
                      ...datadinhmuc,
                      Setting1: Number(e.target.value),
                    })
                  }
                ></input>
              </label>
              <label>
                <b>Setting2(min):</b>{" "}
                <input
                  type="text"
                  placeholder="Thời gian setting 2"
                  value={datadinhmuc.Setting2}
                  onChange={(e) =>
                    setDataDinhMuc({
                      ...datadinhmuc,
                      Setting2: Number(e.target.value),
                    })
                  }
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>UPH1(EA/h):</b>{" "}
                <input
                  type="text"
                  placeholder="Tốc độ sx 1"
                  value={datadinhmuc.UPH1}
                  onChange={(e) =>
                    setDataDinhMuc({
                      ...datadinhmuc,
                      UPH1: Number(e.target.value),
                    })
                  }
                ></input>
              </label>
              <label>
                <b>UPH2(EA/h):</b>{" "}
                <input
                  type="text"
                  placeholder="Tốc độ sx 2"
                  value={datadinhmuc.UPH2}
                  onChange={(e) =>
                    setDataDinhMuc({
                      ...datadinhmuc,
                      UPH2: Number(e.target.value),
                    })
                  }
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Step1:</b>{" "}
                <input
                  type="text"
                  placeholder="Số bước 1"
                  value={datadinhmuc.Step1}
                  onChange={(e) =>
                    setDataDinhMuc({
                      ...datadinhmuc,
                      Step1: Number(e.target.value),
                    })
                  }
                ></input>
              </label>
              <label>
                <b>Step2:</b>{" "}
                <input
                  type="text"
                  placeholder="Số bước 2"
                  value={datadinhmuc.Step2}
                  onChange={(e) =>
                    setDataDinhMuc({
                      ...datadinhmuc,
                      Step2: Number(e.target.value),
                    })
                  }
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>LOSS_SX1(%):</b>{" "}
                <input
                  type="text"
                  placeholder="% loss sx 1"
                  value={datadinhmuc.LOSS_SX1}
                  onChange={(e) =>
                    setDataDinhMuc({
                      ...datadinhmuc,
                      LOSS_SX1: Number(e.target.value),
                    })
                  }
                ></input>
              </label>
              <label>
                <b>LOSS_SX2(%):</b>{" "}
                <input
                  type="text"
                  placeholder="% loss sx 2"
                  value={datadinhmuc.LOSS_SX2}
                  onChange={(e) =>
                    setDataDinhMuc({
                      ...datadinhmuc,
                      LOSS_SX2: Number(e.target.value),
                    })
                  }
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>LOSS SETTING1 (m):</b>{" "}
                <input
                  type="text"
                  placeholder="met setting 1"
                  value={datadinhmuc.LOSS_SETTING1}
                  onChange={(e) =>
                    setDataDinhMuc({
                      ...datadinhmuc,
                      LOSS_SETTING1: Number(e.target.value),
                    })
                  }
                ></input>
              </label>
              <label>
                <b>LOSS SETTING2 (m):</b>{" "}
                <input
                  type="text"
                  placeholder="met setting 2"
                  value={datadinhmuc.LOSS_SETTING2}
                  onChange={(e) =>
                    setDataDinhMuc({
                      ...datadinhmuc,
                      LOSS_SETTING2: Number(e.target.value),
                    })
                  }
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>FACTORY:</b>
                <select
                  name="phanloai"
                  value={
                    datadinhmuc.FACTORY === null ? "NA" : datadinhmuc.FACTORY
                  }
                  onChange={(e) => {
                    setDataDinhMuc({
                      ...datadinhmuc,
                      FACTORY: e.target.value,
                    });
                  }}
                  style={{ width: 162, height: 22 }}
                >
                  <option value="NA">NA</option>
                  <option value="NM1">NM1</option>
                  <option value="NM2">NM2</option>
                </select>
              </label>
              <label>
                <b>NOTE (QLSX):</b>{" "}
                <input
                  type="text"
                  placeholder="Chú ý"
                  value={datadinhmuc.NOTE}
                  onChange={(e) =>
                    setDataDinhMuc({ ...datadinhmuc, NOTE: e.target.value })
                  }
                ></input>
              </label>
            </div>
          </div>
          <div className="formbutton">
            <button
              className="tranhatky"
              onClick={() => {
                /* checkBP(
                        userData?.EMPL_NO,
                        userData?.MAINDEPTNAME,
                        ["QLSX"],
                        handleSaveQLSX
                      ); */
                checkBP(userData, ["QLSX"], ["ALL"], ["ALL"], handleSaveQLSX);
              }}
            >
              Update Data
            </button>
          </div>
        </div>
        <div className="tracuuYCSXTable">
          <span
            style={{
              fontSize: 20,
              display: "flex",
              alignSelf: "center",
              fontWeight: "bold",
              color: "blue",
            }}
          >
            {" "}
            {selectedG_NAME}
          </span>
          {materialDataTable}
        </div>
        {showhidePivotTable && (
          <div className="pivottable1">
            <IconButton
              className="buttonIcon"
              onClick={() => {
                setShowHidePivotTable(false);
              }}
            >
              <AiFillCloseCircle color="blue" size={15} />
              Close
            </IconButton>
            <PivotTable datasource={dataSource} tableID="invoicetablepivot" />
          </div>
        )}
      </div>
    </div>
  );
};
export default CAPADATA;

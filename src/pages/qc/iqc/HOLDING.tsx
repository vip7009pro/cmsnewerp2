import { IconButton, Button } from "@mui/material";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { AiFillFileExcel } from "react-icons/ai";
import Swal from "sweetalert2";
import { generalQuery } from "../../../api/Api";
import { UserContext } from "../../../api/Context";
import { SaveExcel, checkBP } from "../../../api/GlobalFunction";
import "./HOLDING.scss";
import DataGrid, {
  Column,
  ColumnChooser,
  Editing,
  Export,
  FilterRow,
  Item,
  Pager,
  Paging,
  Scrolling,
  SearchPanel,
  Selection,
  Summary,
  Toolbar,
  TotalItem,
} from "devextreme-react/data-grid";
import { GrStatusGood } from "react-icons/gr";
import { FcCancel } from "react-icons/fc";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { HOLDING_DATA, UserData } from "../../../api/GlobalInterface";

const HOLDING = () => {
  const [selectedRowsData, setSelectedRowsData] = useState<Array<HOLDING_DATA>>(
    [],
  );
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData,
  );
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [codeKD, setCodeKD] = useState("");
  const [alltime, setAllTime] = useState(true);
  const [id, setID] = useState("");
  const [holdingdatatable, setHoldingDataTable] = useState<Array<any>>([]);
  const [m_name, setM_Name] = useState("");
  const [m_code, setM_Code] = useState("");
  const [mLotNo, setMLotNo] = useState("");
  const [mStatus, setMStatus] = useState("ALL");

  const setQCPASS = async (value: string) => {
    //console.log(selectedRowsData);
    if (selectedRowsData.length > 0) {
      Swal.fire({
        title: "SET/REST PASS",
        text: "Đang SET/RESET PASS liệu",
        icon: "info",
        showCancelButton: false,
        allowOutsideClick: false,
        confirmButtonText: "OK",
        showConfirmButton: false,
      });
      let err_code: string = "";
      for (let i = 0; i < selectedRowsData.length; i++) {
        await generalQuery("updateQCPASS_HOLDING", {
          M_LOT_NO: selectedRowsData[i].M_LOT_NO,
          ID: selectedRowsData[i].ID,
          VALUE: value,
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
      } else {
        Swal.fire("Thông báo", "Lỗi: " + err_code, "error");
      }
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 dòng để thực hiện", "error");
    }
  };
  const updateReason = async () => {
    console.log(selectedRowsData);
    if (selectedRowsData.length > 0) {
      Swal.fire({
        title: "Update hiện tượng lỗi",
        text: "Đang update thông tin lỗi",
        icon: "info",
        showCancelButton: false,
        allowOutsideClick: false,
        confirmButtonText: "OK",
        showConfirmButton: false,
      });
      let err_code: string = "";
      for (let i = 0; i < selectedRowsData.length; i++) {
        await generalQuery("updateMaterialHoldingReason", {
          HOLD_ID: selectedRowsData[i].HOLD_ID,
          REASON: selectedRowsData[i].REASON,
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
        Swal.fire("Thông báo", "Update thành công", "success");
      } else {
        Swal.fire("Thông báo", "Lỗi: " + err_code, "error");
      }
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 dòng để thực hiện", "error");
    }
  };
  const materialDataTable = React.useMemo(
    () => (
      <div className="datatb">
        <DataGrid
          style={{ fontSize: "0.7rem" }}
          autoNavigateToFocusedRow={true}
          allowColumnReordering={true}
          allowColumnResizing={true}
          columnAutoWidth={false}
          cellHintEnabled={true}
          columnResizingMode={"widget"}
          showColumnLines={true}
          dataSource={holdingdatatable}
          columnWidth="auto"
          keyExpr="id"
          height={"76vh"}
          showBorders={true}
          onSelectionChanged={(e) => {
            //setSelectedRows(e.selectedRowsData.length);
            console.log(e.selectedRowsData);
            setSelectedRowsData(e.selectedRowsData);
          }}
          onRowClick={(e) => {
            //console.log(e.data);
          }}
        >
          <Scrolling
            useNative={true}
            scrollByContent={true}
            scrollByThumb={true}
            showScrollbar="onHover"
            mode="virtual"
          />
          <Selection mode="multiple" selectAllMode="allPages" />
          <Editing
            allowUpdating={true}
            allowAdding={false}
            allowDeleting={false}
            mode="cell"
            confirmDelete={true}
            onChangesChange={(e) => { }}
          />
          <Export enabled={true} />
          <Toolbar disabled={false}>
            <Item location="before">
              <IconButton
                className="buttonIcon"
                onClick={() => {
                  SaveExcel(holdingdatatable, "SPEC DTC");
                }}
              >
                <AiFillFileExcel color="green" size={15} />
                SAVE
              </IconButton>
            </Item>
            <Item name="searchPanel" />
            <Item name="exportButton" />
            <Item name="columnChooser" />
          </Toolbar>
          <FilterRow visible={true} />
          <SearchPanel visible={true} />
          <ColumnChooser enabled={true} />
          <Paging defaultPageSize={15} />
          <Pager
            showPageSizeSelector={true}
            allowedPageSizes={[5, 10, 15, 20, 100, 1000, 10000, "all"]}
            showNavigationButtons={true}
            showInfo={true}
            infoText="Page #{0}. Total: {1} ({2} items)"
            displayMode="compact"
          />
          <Column
            dataField="HOLD_ID"
            caption="HOLD_ID"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="ID"
            caption="ID"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="HOLDING_MONTH"
            caption="HOLDING_MONTH"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="FACTORY"
            caption="FACTORY"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="WAHS_CD"
            caption="WAHS_CD"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="LOC_CD"
            caption="LOC_CD"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="M_LOT_NO"
            caption="M_LOT_NO"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="M_CODE"
            caption="M_CODE"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="M_NAME"
            caption="M_NAME"
            width={150}
            allowEditing={false}
          ></Column>
          <Column
            dataField="WIDTH_CD"
            caption="WIDTH_CD"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="HOLDING_ROLL_QTY"
            caption="HOLDING_ROLL_QTY"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="HOLDING_QTY"
            caption="HOLDING_QTY"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="HOLDING_TOTAL_QTY"
            caption="HOLDING_TOTAL_QTY"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="REASON"
            caption="REASON"
            width={150}
            allowEditing={true}
          ></Column>
          <Column
            dataField="HOLDING_IN_DATE"
            caption="HOLDING_IN_DATE"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="HOLDING_OUT_DATE"
            caption="HOLDING_OUT_DATE"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="VENDOR_LOT"
            caption="VENDOR_LOT"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="USE_YN"
            caption="USE_YN"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="INS_DATE"
            caption="INS_DATE"
            width={150}
            allowEditing={false}
          ></Column>
          <Column
            dataField="INS_EMPL"
            caption="INS_EMPL"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="UPD_DATE"
            caption="UPD_DATE"
            width={150}
            allowEditing={false}
          ></Column>
          <Column
            dataField="UPD_EMPL"
            caption="UPD_EMPL"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="QC_PASS"
            caption="QC_PASS"
            width={100}
            allowEditing={false}
          ></Column>
          <Column
            dataField="QC_PASS_DATE"
            caption="QC_PASS_DATE"
            width={150}
            allowEditing={false}
          ></Column>
          <Column
            dataField="QC_PASS_EMPL"
            caption="QC_PASS_EMPL"
            width={100}
            allowEditing={false}
          ></Column>

          <Summary>
            <TotalItem
              alignment="right"
              column="M_CODE"
              summaryType="count"
              valueFormat={"decimal"}
            />
            <TotalItem
              alignment="right"
              column="HOLDING_ROLL_QTY"
              summaryType="sum"
              valueFormat={"decimal"}
            />
            <TotalItem
              alignment="right"
              column="HOLDING_QTY"
              summaryType="sum"
              valueFormat={"decimal"}
            />
            <TotalItem
              alignment="right"
              column="HOLDING_TOTAL_QTY"
              summaryType="sum"
              valueFormat={"decimal"}
            />
          </Summary>
        </DataGrid>
      </div>
    ),
    [holdingdatatable],
  );
  const handleSearchCodeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      handletraHoldingData();
    }
  };
  const handletraHoldingData = () => {
    Swal.fire({
      title: "Tra cứu vật liệu Holding",
      text: "Đang tải dữ liệu, hãy chờ chút",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });
    generalQuery("traholdingmaterial", {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      M_NAME: m_name,
      M_CODE: m_code,
      M_LOT_NO: mLotNo,
      M_STATUS: mStatus,
      ID: id,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: HOLDING_DATA[] = response.data.data.map(
            (element: HOLDING_DATA, index: number) => {
              return {
                ...element,
                INS_DATE:
                  element.INS_DATE !== null
                    ? moment.utc(element.INS_DATE).format("YYYY-MM-DD HH:mm:ss")
                    : "",
                UPD_DATE:
                  element.UPD_DATE !== null
                    ? moment.utc(element.UPD_DATE).format("YYYY-MM-DD HH:mm:ss")
                    : "",
                QC_PASS_DATE:
                  element.QC_PASS_DATE !== null
                    ? moment
                      .utc(element.QC_PASS_DATE)
                      .format("YYYY-MM-DD HH:mm:ss")
                    : "",
                id: index,
              };
            },
          );
          setHoldingDataTable(loadeddata);
          Swal.fire(
            "Thông báo",
            "Đã load " + response.data.data.length + " dòng",
            "success",
          );
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    //setColumnDefinition(column_inspect_output);
  }, []);
  return (
    <div className="holding">
      <div className="tracuuDataInspection">
        <div className="tracuuDataInspectionform">
          <div className="forminput">
            <div className="forminputcolumn">
              <label>
                <b>Từ ngày:</b>
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                  type="date"
                  value={fromdate.slice(0, 10)}
                  onChange={(e) => setFromDate(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Tới ngày:</b>{" "}
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
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
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                  type="text"
                  placeholder="SJ-203020HC"
                  value={m_name}
                  onChange={(e) => setM_Name(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Mã Liệu CMS:</b>{" "}
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                  type="text"
                  placeholder="A123456"
                  value={m_code}
                  onChange={(e) => setM_Code(e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>LOT CMS:</b>{" "}
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                  type="text"
                  placeholder="2204280689"
                  value={mLotNo}
                  onChange={(e) => setMLotNo(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Trạng Thái</b>
                <select
                  name="hangmuctest"
                  value={mStatus}
                  onChange={(e) => {
                    setMStatus(e.target.value);
                  }}
                >
                  <option value="ALL">ALL</option>
                  <option value="Y">ĐÃ PASS</option>
                  <option value="N">CHƯA PASS</option>
                </select>
              </label>
            </div>
            <div className="forminputcolumn">
              <Button color={'success'} variant="contained" size="small" fullWidth={true} sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#fa1717' }} onClick={() => {
                handletraHoldingData();
              }}>Tra Holding</Button>
              <Button color={'success'} variant="contained" size="small" fullWidth={true} sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#fffc5b', color: 'black' }} onClick={() => {
                updateReason();
              }}>Update Reason</Button>

            </div>
            <div className="forminputcolumn">
              <Button color={'success'} variant="contained" size="small" fullWidth={true} sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#07cc00' }} onClick={() => {
                if (userData?.SUBDEPTNAME === "IQC") {
                  setQCPASS("Y");
                } else {
                  Swal.fire(
                    "Thông báo",
                    "Bạn không phải người bộ phận IQC",
                    "error",
                  );
                }
              }}>SET PASS</Button>
              <Button color={'success'} variant="contained" size="small" fullWidth={true} sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: 'gray' }} onClick={() => {
                if (userData?.SUBDEPTNAME === "IQC") {
                  setQCPASS("N");
                } else {
                  Swal.fire(
                    "Thông báo",
                    "Bạn không phải người bộ phận IQC",
                    "error",
                  );
                }
              }}>RESET PASS</Button>


            </div>
            <div className="forminputcolumn">
              <label>
                <b>All Time:</b>
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                  type="checkbox"
                  name="alltimecheckbox"
                  defaultChecked={alltime}
                  onChange={() => setAllTime(!alltime)}
                ></input>
              </label>

            </div>
          </div>
        </div>
        <div className="tracuuYCSXTable">{materialDataTable}</div>
      </div>
    </div>
  );
};
export default HOLDING;

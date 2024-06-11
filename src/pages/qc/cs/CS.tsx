import {
  Autocomplete,
  Button,
  IconButton,
  LinearProgress,
  TextField,
} from "@mui/material";
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
} from "devextreme-react/data-grid";
import moment from "moment";
import React, { useContext, useEffect, useState, useTransition } from "react";
import {
  AiFillFileExcel,
  AiOutlineCloudUpload,
  AiOutlinePrinter,
} from "react-icons/ai";
import Swal from "sweetalert2";
import { generalQuery, getAuditMode } from "../../../api/Api";
import { UserContext } from "../../../api/Context";
import { SaveExcel } from "../../../api/GlobalFunction";
import "./CS.scss";
import { CSCONFIRM_DATA } from "../../../api/GlobalInterface";

const CS = () => {
  const [searchSelection, setSearchSelection] = useState(1);
  const [selectedRows, setSelectedRows] = useState<number>(0);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [codeKD, setCodeKD] = useState("");
  const [codeCMS, setCodeCMS] = useState("");
  const [empl_name, setEmpl_Name] = useState("");
  const [cust_name, setCustName] = useState("");
  const [process_lot_no, setProcess_Lot_No] = useState("");
  const [prod_type, setProdType] = useState("");
  const [prodrequestno, setProdRequestNo] = useState("");
  const [alltime, setAllTime] = useState(false);
  const [id, setID] = useState("");
  const [factory, setFactory] = useState("All");
  const [csdatatable, setCsDataTable] = useState<Array<any>>([]);

  const handletraCSXACNHAN = () => {
    generalQuery("tracsconfirm", {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      G_CODE: codeCMS,
      G_NAME: codeKD,
      FACTORY: factory,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: CSCONFIRM_DATA[] = response.data.data.map(
            (element: CSCONFIRM_DATA, index: number) => {
              return {
                ...element,
                G_NAME: getAuditMode() == 0? element?.G_NAME : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME : 'TEM_NOI_BO',
G_NAME_KD: getAuditMode() == 0? element?.G_NAME_KD : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME_KD : 'TEM_NOI_BO',
                id: index,
                CONFIRM_DATE: moment
                  .utc(element.CONFIRM_DATE)
                  .format("YYYY-MM-DD"),
                INS_DATETIME: moment
                  .utc(element.INS_DATETIME)
                  .format("YYYY-MM-DD HH:mm:ss"),
              };
            },
          );
          setCsDataTable(loadeddata);

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

  const csDataTable = React.useMemo(
    () => (
      <div className="datatb">
        {searchSelection === 1 && (
          <DataGrid
            autoNavigateToFocusedRow={true}
            allowColumnReordering={true}
            allowColumnResizing={true}
            columnAutoWidth={false}
            cellHintEnabled={true}
            columnResizingMode={"widget"}
            showColumnLines={true}
            dataSource={csdatatable}
            columnWidth="auto"
            keyExpr="CONFIRM_ID"
            height={"70vh"}
            onSelectionChanged={(e) => {
              setSelectedRows(e.selectedRowsData.length);
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
              allowUpdating={false}
              allowAdding={true}
              allowDeleting={false}
              mode="batch"
              confirmDelete={true}
              onChangesChange={(e) => {}}
            />
            <Export enabled={true} />
            <Toolbar disabled={false}>
              <Item location="before">
                <div className="title">DATA CS</div>
                {/* <Button>OK MA</Button>
     <Button>OK MA1</Button>
     <Button>OK MA2</Button> */}
              </Item>
              <Item name="searchPanel" />
              <Item name="exportButton" />
            </Toolbar>
            <FilterRow visible={true} />
            <SearchPanel visible={true} />
            <Column
              dataField="YEAR_WEEK"
              caption="YEAR_WEEK"
              width={100}
              cellRender={(e: any) => {
                return (
                  <span style={{ color: "blue", fontWeight: "bold" }}>
                    {e.data.YEAR_WEEK}
                  </span>
                );
              }}
            />
            <Column dataField="CONFIRM_ID" caption="CONFIRM_ID" width={100} />
            <Column
              dataField="CONFIRM_DATE"
              caption="CONFIRM_DATE"
              width={100}
            />
            <Column dataField="CONTACT_ID" caption="CONTACT_ID" width={100} />
            <Column dataField="CS_EMPL_NO" caption="CS_EMPL_NO" width={100} />
            <Column dataField="EMPL_NAME" caption="EMPL_NAME" width={100} />
            <Column dataField="G_CODE" caption="G_CODE" width={100} />
            <Column dataField="G_NAME" caption="G_NAME" width={100} />
            <Column dataField="G_NAME_KD" caption="G_NAME_KD" width={100} />
            <Column
              dataField="PROD_REQUEST_NO"
              caption="PROD_REQUEST_NO"
              width={100}
            />
            <Column dataField="CUST_CD" caption="CUST_CD" width={100} />
            <Column
              dataField="CUST_NAME_KD"
              caption="CUST_NAME_KD"
              width={100}
            />
            <Column dataField="CONTENT" caption="CONTENT" width={100} />
            <Column dataField="INSPECT_QTY" caption="INSPECT_QTY" width={100} />
            <Column dataField="NG_QTY" caption="NG_QTY" width={100} />
            <Column
              dataField="REPLACE_RATE"
              caption="REPLACE_RATE"
              width={100}
            />
            <Column dataField="REDUCE_QTY" caption="REDUCE_QTY" width={100} />
            <Column dataField="FACTOR" caption="FACTOR" width={100} />
            <Column dataField="RESULT" caption="RESULT" width={100} />
            <Column
              dataField="CONFIRM_STATUS"
              caption="CONFIRM_STATUS"
              width={100}
            />
            <Column dataField="REMARK" caption="REMARK" width={100} />
            <Column
              dataField="INS_DATETIME"
              caption="INS_DATETIME"
              width={100}
            />
            <Column dataField="PHANLOAI" caption="PHANLOAI" width={100} />
            <Column dataField="LINK" caption="LINK" width={100} />
            <Column dataField="PROD_TYPE" caption="PROD_TYPE" width={100} />
            <Column dataField="PROD_MODEL" caption="PROD_MODEL" width={100} />
            <Column
              dataField="PROD_PROJECT"
              caption="PROD_PROJECT"
              width={100}
            />
            <Column
              dataField="PROD_LAST_PRICE"
              caption="PROD_LAST_PRICE"
              width={100}
            />
            <Paging defaultPageSize={15} />
            <Pager
              showPageSizeSelector={true}
              allowedPageSizes={[5, 10, 15, 20, 100, 1000, 10000, "all"]}
              showNavigationButtons={true}
              showInfo={true}
              infoText="Page #{0}. Total: {1} ({2} items)"
              displayMode="compact"
            />
          </DataGrid>
        )}
        {searchSelection === 2 && (
          <DataGrid
            autoNavigateToFocusedRow={true}
            allowColumnReordering={true}
            allowColumnResizing={true}
            columnAutoWidth={false}
            cellHintEnabled={true}
            columnResizingMode={"widget"}
            showColumnLines={true}
            dataSource={csdatatable}
            columnWidth="auto"
            keyExpr="CONFIRM_ID"
            height={"70vh"}
            onSelectionChanged={(e) => {}}
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
              allowUpdating={false}
              allowAdding={true}
              allowDeleting={false}
              mode="batch"
              confirmDelete={true}
              onChangesChange={(e) => {}}
            />
            <Export enabled={true} />
            <Toolbar disabled={false}>
              <Item location="before">
                <div className="title">DATA CS</div>
                {/* <Button>OK MA</Button>
     <Button>OK MA1</Button>
     <Button>OK MA2</Button> */}
              </Item>
              <Item name="searchPanel" />
              <Item name="exportButton" />
            </Toolbar>
            <FilterRow visible={true} />
            <SearchPanel visible={true} />
            <Column
              dataField="YEAR_WEEK"
              caption="YEAR_WEEK"
              width={100}
              cellRender={(e: any) => {
                return (
                  <span style={{ color: "blue", fontWeight: "bold" }}>
                    {e.data.YEAR_WEEK}
                  </span>
                );
              }}
            />
            <Column dataField="CONFIRM_ID" caption="CONFIRM_ID" width={100} />
            <Column
              dataField="CONFIRM_DATE"
              caption="CONFIRM_DATE"
              width={100}
            />
            <Column dataField="CONTACT_ID" caption="CONTACT_ID" width={100} />
            <Column dataField="CS_EMPL_NO" caption="CS_EMPL_NO" width={100} />
            <Column dataField="EMPL_NAME" caption="EMPL_NAME" width={100} />
            <Column dataField="G_CODE" caption="G_CODE" width={100} />
            <Column dataField="G_NAME" caption="G_NAME" width={100} />
            <Column dataField="G_NAME_KD" caption="G_NAME_KD" width={100} />
            <Column
              dataField="PROD_REQUEST_NO"
              caption="PROD_REQUEST_NO"
              width={100}
            />
            <Column dataField="CUST_CD" caption="CUST_CD" width={100} />
            <Column
              dataField="CUST_NAME_KD"
              caption="CUST_NAME_KD"
              width={100}
            />
            <Column dataField="CONTENT" caption="CONTENT" width={100} />
            <Column dataField="INSPECT_QTY" caption="INSPECT_QTY" width={100} />
            <Column dataField="NG_QTY" caption="NG_QTY" width={100} />
            <Column
              dataField="REPLACE_RATE"
              caption="REPLACE_RATE"
              width={100}
            />
            <Column dataField="REDUCE_QTY" caption="REDUCE_QTY" width={100} />
            <Column dataField="FACTOR" caption="FACTOR" width={100} />
            <Column dataField="RESULT" caption="RESULT" width={100} />
            <Column
              dataField="CONFIRM_STATUS"
              caption="CONFIRM_STATUS"
              width={100}
            />
            <Column dataField="REMARK" caption="REMARK" width={100} />
            <Column
              dataField="INS_DATETIME"
              caption="INS_DATETIME"
              width={100}
            />
            <Column dataField="PHANLOAI" caption="PHANLOAI" width={100} />
            <Column dataField="LINK" caption="LINK" width={100} />
            <Column dataField="PROD_TYPE" caption="PROD_TYPE" width={100} />
            <Column dataField="PROD_MODEL" caption="PROD_MODEL" width={100} />
            <Column
              dataField="PROD_PROJECT"
              caption="PROD_PROJECT"
              width={100}
            />
            <Column
              dataField="PROD_LAST_PRICE"
              caption="PROD_LAST_PRICE"
              width={100}
            />
            <Paging defaultPageSize={15} />
            <Pager
              showPageSizeSelector={true}
              allowedPageSizes={[5, 10, 15, 20, 100, 1000, 10000, "all"]}
              showNavigationButtons={true}
              showInfo={true}
              infoText="Page #{0}. Total: {1} ({2} items)"
              displayMode="compact"
            />
          </DataGrid>
        )}
      </div>
    ),
    [csdatatable, searchSelection],
  );
  useEffect(() => {
    //setColumnDefinition(column_pqc3_data);
  }, []);
  return (
    <div className="tracs">
      <div className="tracuuDataCS">
        <div className="tracuuDataCSform">
          <div className="forminput">
            <div className="forminputcolumn">
              <label>
                <b>Từ ngày:</b>
                <input
                  type="date"
                  value={fromdate.slice(0, 10)}
                  onChange={(e) => setFromDate(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Tới ngày:</b>{" "}
                <input
                  type="date"
                  value={todate.slice(0, 10)}
                  onChange={(e) => setToDate(e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Code KD:</b>{" "}
                <input
                  type="text"
                  placeholder="GH63-xxxxxx"
                  value={codeKD}
                  onChange={(e) => setCodeKD(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Code ERP:</b>{" "}
                <input
                  type="text"
                  placeholder="7C123xxx"
                  value={codeCMS}
                  onChange={(e) => setCodeCMS(e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Tên nhân viên:</b>{" "}
                <input
                  type="text"
                  placeholder="Ten Line QC"
                  value={empl_name}
                  onChange={(e) => setEmpl_Name(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Nhà máy:</b>
                <select
                  name="phanloai"
                  value={factory}
                  onChange={(e) => {
                    setFactory(e.target.value);
                  }}
                >
                  <option value="All">All</option>
                  <option value="NM1">NM1</option>
                  <option value="NM2">NM2</option>
                </select>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Loại sản phẩm:</b>{" "}
                <input
                  type="text"
                  placeholder="TSP"
                  value={prod_type}
                  onChange={(e) => setProdType(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Số YCSX:</b>{" "}
                <input
                  type="text"
                  placeholder="1H23456"
                  value={prodrequestno}
                  onChange={(e) => setProdRequestNo(e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>LOT SX:</b>{" "}
                <input
                  type="text"
                  placeholder="ED2H3076"
                  value={process_lot_no}
                  onChange={(e) => setProcess_Lot_No(e.target.value)}
                ></input>
              </label>
              <label>
                <b>ID:</b>{" "}
                <input
                  type="text"
                  placeholder="12345"
                  value={id}
                  onChange={(e) => setID(e.target.value)}
                ></input>
              </label>
            </div>
          </div>
          <div className="formbutton">
            <label>
              <b>All Time:</b>
              <input
                type="checkbox"
                name="alltimecheckbox"
                defaultChecked={alltime}
                onChange={() => setAllTime(!alltime)}
              ></input>
            </label>
            <button className="pqc1button" onClick={() => {}}>
              PQC1-Setting
            </button>
            <button className="pqc3button" onClick={() => {}}>
              PQC3-Defect
            </button>
            <button className="daofilmbutton" onClick={() => {}}>
              Dao-film-TL
            </button>
            <button
              className="lichsucndbbutton"
              onClick={() => {
                handletraCSXACNHAN();
              }}
            >
              DATA XÁC NHẬN
            </button>
          </div>
        </div>
        <div className="tracuuCSTable">
          Số dòng đã chọn: {selectedRows} / {csdatatable.length}
          {csDataTable}
        </div>
      </div>
    </div>
  );
};
export default CS;

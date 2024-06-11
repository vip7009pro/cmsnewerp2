import { Button, IconButton, LinearProgress } from "@mui/material";
import { DataGrid, GridToolbarContainer, GridToolbarQuickFilter } from "@mui/x-data-grid";
import moment from "moment";
import { useEffect, useState } from "react";
import { AiFillFileExcel } from "react-icons/ai";
import Swal from "sweetalert2";
import { generalQuery, getAuditMode } from "../../../../api/Api";
import { SaveExcel } from "../../../../api/GlobalFunction";

import "./TraAMZ.scss";
import { TbLogout } from "react-icons/tb";
import { AMAZON_DATA } from "../../../../api/GlobalInterface";

const TraAMZ = () => {
  const [showhidesearchdiv, setShowHideSearchDiv] = useState(true);
  const [selectionModel_INPUTSX, setSelectionModel_INPUTSX] = useState<any>([]);
  const [readyRender, setReadyRender] = useState(true);
  const [selection, setSelection] = useState<any>({
    trapo: true,
    thempohangloat: false,
    them1po: false,
    them1invoice: false,
    themycsx: false,
    suaycsx: false,
    inserttableycsx: false,
    renderycsx: false,
    renderbanve: false,
    amazontab: false,
  });
  const [isLoading, setisLoading] = useState(false);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [codeKD, setCodeKD] = useState("");
  const [codeCMS, setCodeCMS] = useState("");

  const [prodrequestno, setProdRequestNo] = useState("");
  const [plan_id, setPlanID] = useState("");
  const [dataAMZ, setDataAMZ] = useState("");
  const [alltime, setAllTime] = useState(false);
  const [id, setID] = useState("");
  const [inspectiondatatable, setInspectionDataTable] = useState<Array<any>>(
    [],
  );
  const [sumaryINSPECT, setSummaryInspect] = useState("");
  const [m_name, setM_Name] = useState("");
  const [m_code, setM_Code] = useState("");

  const column_lichsuinputlieusanxuat = [
    { field: "G_NAME", headerName: "G_NAME", minWidth: 80, flex: 2 },
    { field: "G_CODE", headerName: "G_CODE", minWidth: 80, flex: 1 },
    {
      field: "PROD_REQUEST_NO",
      headerName: "YCSX_NO",
      minWidth: 80,
      flex: 0.8,
    },
    { field: "NO_IN", headerName: "NO_IN", minWidth: 80, flex: 2 },
    { field: "ROW_NO", headerName: "ROW_NO", minWidth: 80, flex: 1 },
    { field: "DATA_1", headerName: "DATA_1", minWidth: 80, flex: 3 },
    { field: "DATA_2", headerName: "DATA_2", minWidth: 80, flex: 3 },
    {
      field: "PRINT_STATUS",
      headerName: "PRINT_STATUS",
      minWidth: 80,
      flex: 1,
    },
    { field: "INLAI_COUNT", headerName: "INLAI_COUNT", minWidth: 80, flex: 1 },
    { field: "REMARK", headerName: "REMARK", minWidth: 80, flex: 1 },
    { field: "INS_DATE", headerName: "INS_DATE", minWidth: 80, flex: 1.2 },
    { field: "INS_EMPL", headerName: "INS_EMPL", minWidth: 80, flex: 1 },
  ];
  const [columnDefinition, setColumnDefinition] = useState<Array<any>>(
    column_lichsuinputlieusanxuat,
  );

  function CustomToolbarLICHSUINPUTSX() {
    return (
      <GridToolbarContainer>
        <IconButton
          className="buttonIcon"
          onClick={() => {
            setShowHideSearchDiv(!showhidesearchdiv);
          }}
        >
          <TbLogout color="green" size={15} />
          Show/Hide
        </IconButton>
        <IconButton
          className="buttonIcon"
          onClick={() => {
            SaveExcel(inspectiondatatable, "LICHSU DATA AMZ");
          }}
        >
          <AiFillFileExcel color="green" size={15} />
          SAVE
        </IconButton>
        <GridToolbarQuickFilter />
        <div className="div" style={{ fontSize: 20, fontWeight: "bold" }}>
          Bảng quản lý Data AMZ
        </div>
      </GridToolbarContainer>
    );
  }
  const handle_traAMZ = () => {
    generalQuery("traDataAMZ", {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      PROD_REQUEST_NO: prodrequestno,
      NO_IN: plan_id,
      G_NAME: codeKD,
      G_CODE: codeCMS,
      DATA_AMZ: dataAMZ
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: AMAZON_DATA[] = response.data.data.map(
            (element: AMAZON_DATA, index: number) => {
              return {
                ...element,
                G_NAME: getAuditMode() == 0? element?.G_NAME : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME : 'TEM_NOI_BO',
                INS_DATE: moment(element.INS_DATE)
                  .utc()
                  .format("YYYY-MM-DD HH:mm:ss"),
                id: index,
              };
            },
          );
          setInspectionDataTable(loaded_data);
          setReadyRender(true);
          Swal.fire(
            "Thông báo",
            "Đã load: " + loaded_data.length + " dòng",
            "success",
          );
        } else {
          Swal.fire("Thông báo", "Không có data", "error");
        }
        setisLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    //setColumnDefinition(column_inspect_output);
  }, []);
  return (
    <div className="traAMZ">
      <div className="tracuuDataInspection">
        {showhidesearchdiv && (
          <div className="tracuuDataInspectionform">
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
                  <b>Số YCSX:</b>{" "}
                  <input
                    type="text"
                    placeholder="1F80008"
                    value={prodrequestno}
                    onChange={(e) => setProdRequestNo(e.target.value)}
                  ></input>
                </label>
                <label>
                  <b>ID công việc:</b>{" "}
                  <input
                    type="text"
                    placeholder="CG123456789123456"
                    value={plan_id}
                    onChange={(e) => setPlanID(e.target.value)}
                  ></input>
                </label>
                <label>
                  <b>DATA:</b>{" "}
                  <input
                    type="text"
                    placeholder="AZ:H3BS9IZEHFHJDHR1UDQOB9WTWU"
                    value={dataAMZ}
                    onChange={(e) => setDataAMZ(e.target.value)}
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
              <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#00DF0E' }} onClick={() => {
                setisLoading(true);
                setReadyRender(true);
                setColumnDefinition(column_lichsuinputlieusanxuat);
                handle_traAMZ();
              }}>Tra AMZ</Button>

            </div>
          </div>
        )}
        <div className="tracuuYCSXTable">
          {readyRender && (
            <DataGrid
              sx={{ fontSize: "0.7rem", flex: 1 }}
              components={{
                Toolbar: CustomToolbarLICHSUINPUTSX,
                LoadingOverlay: LinearProgress,
              }}
              getRowId={(row) => row.id}
              loading={isLoading}
              rowHeight={30}
              rows={inspectiondatatable}
              columns={column_lichsuinputlieusanxuat}
              rowsPerPageOptions={[
                5, 10, 50, 100, 500, 1000, 5000, 10000, 500000,
              ]}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default TraAMZ;

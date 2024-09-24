import { Button, Checkbox, FormControlLabel } from "@mui/material";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import "./TINHLIEU.scss";
import { generalQuery, getAuditMode, getCompany } from "../../../api/Api";
import { MaterialPOData, MaterialPOSumData } from "../../../api/GlobalInterface";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import AGTable from "../../../components/DataTable/AGTable";
const TINHLIEU = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [currentTable, setCurrentTable] = useState<Array<any>>([]);
  const [columns, setColumns] = useState<Array<any>>([]);
  const [formdata, setFormData] = useState<any>({
    CUST_NAME_KD: '',
    M_NAME: '',
    SHORTAGE_ONLY: false,
    NEWPO: false,
    FROM_DATE: moment().format("YYYY-MM-DD"),
    TO_DATE: moment().format("YYYY-MM-DD"),
    ALLTIME: false
  });
  const setFormInfo = (keyname: string, value: any) => {
    let tempCustInfo: MaterialPOData = {
      ...formdata,
      [keyname]: value,
    };
    setFormData(tempCustInfo);
  };
  const load_material_table = (option: string) => {
    if (option === 'PO') {
      generalQuery(getCompany() == 'CMS' ? "loadMaterialByPO" : "loadMaterialByYCSX", formdata)
        .then((response) => {
          //console.log(response.data.data);
          if (response.data.tk_status !== "NG") {
            let loadeddata = response.data.data.map(
              (element: MaterialPOData, index: number) => {
                return {
                  ...element,
                  G_NAME_KD: getAuditMode() == 0 ? element.G_NAME_KD : element.G_NAME_KD.search('CNDB') == -1 ? element.G_NAME_KD : 'TEM_NOI_BO',
                  NEED_M_QTY: Number(element.NEED_M_QTY),
                  id: index,
                };
              },
            );
            //console.log(loadeddata);
            //set_material_table_data(loadeddata);
            setCurrentTable(loadeddata);
            setColumns(getCompany() !== 'CMS' ? column_mrp_table2 : column_mrp_tableCMS);
            Swal.fire(
              "Thông báo", "Đã load: " + response.data.data.length + " dòng", "success",);
          } else {
            //set_material_table_data([]);
            setCurrentTable([]);
            Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    else if (option === 'ALL') {
      generalQuery(getCompany() == 'CMS' ? "loadMaterialMRPALL" : "loadMaterialByYCSX_ALL", formdata)
        .then((response) => {
          //console.log(response.data.data);
          if (response.data.tk_status !== "NG") {
            let loadeddata = response.data.data.map(
              (element: MaterialPOSumData, index: number) => {
                return {
                  ...element,
                  NEED_M_QTY: Number(element.NEED_M_QTY),
                  M_SHORTAGE: Number(element.M_SHORTAGE),
                  id: index,
                };
              },
            );
            //console.log(loadeddata);
            //set_material_table_data(loadeddata);
            setCurrentTable(loadeddata);
            setColumns(column_mrp_all);
            Swal.fire("Thông báo", "Đã load: " + response.data.data.length + " dòng", "success",);
          } else {
            //set_material_table_data([]);
            setCurrentTable([]);
            Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const column_mrp_tableCMS = [
    { field: "CUST_CD", headerName: "CUST_CD", width: 90 },
    { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 90 },
    { field: "G_CODE", headerName: "G_CODE", width: 90 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 90 },
    { field: "M_CODE", headerName: "M_CODE", width: 90 },
    { field: "M_NAME", headerName: "M_NAME", width: 90 },
    { field: "WIDTH_CD", headerName: "WIDTH_CD", width: 90 },
    { field: "PO_NO", headerName: "PO_NO", width: 90 },
    {
      field: "PO_QTY", headerName: "PO_QTY", width: 90, cellRenderer: (params: any) => {
        return <span style={{ color: params.data.PO_QTY < 0 ? "#ff0000" : "#000000", fontWeight: "bold" }}>
          {params.data.PO_QTY?.toLocaleString("en-US",)}
        </span>
      }
    },
    {
      field: "DELIVERY_QTY", headerName: "DELIVERY_QTY", width: 90, cellRenderer: (params: any) => {
        return <span style={{ color: params.data.DELIVERY_QTY < 0 ? "#ff0000" : "#000000", fontWeight: "bold" }}>
          {params.data.DELIVERY_QTY?.toLocaleString("en-US",)}
        </span>
      }
    },
    {
      field: "PO_BALANCE", headerName: "PO_BALANCE", width: 90, cellRenderer: (params: any) => {
        return <span style={{ color: params.data.PO_BALANCE < 0 ? "#ff0000" : "#000000", fontWeight: "bold" }}>
          {params.data.PO_BALANCE?.toLocaleString("en-US",)}
        </span>
      }
    },
    { field: "PD", headerName: "PD", width: 90 },
    { field: "CAVITY_COT", headerName: "CAVITY_COT", width: 90 },
    { field: "CAVITY_HANG", headerName: "CAVITY_HANG", width: 90 },
    { field: "CAVITY", headerName: "CAVITY", width: 90 },
    {
      field: "NEED_M_QTY", headerName: "NEED_M_QTY", width: 90, cellRenderer: (params: any) => {
        return <span style={{ color: params.data.NEED_M_QTY < 0 ? "#ff0000" : "#000000", fontWeight: "bold" }}>
          {params.data.NEED_M_QTY?.toLocaleString("en-US",)}
        </span>
      }
    },
  ]
  const column_mrp_table2 = [
    { field: "PROD_REQUEST_NO", headerName: "PROD_REQUEST_NO", width: 150 },
    { field: "PROD_REQUEST_DATE", headerName: "PROD_REQUEST_DATE", width: 150 },
    { field: "CUST_CD", headerName: "CUST_CD", width: 100 },
    { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 150 },
    { field: "G_CODE", headerName: "G_CODE", width: 100 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 150 },
    { field: "M_CODE", headerName: "M_CODE", width: 100 },
    { field: "M_NAME", headerName: "M_NAME", width: 150 },
    { field: "WIDTH_CD", headerName: "WIDTH_CD", width: 100 },
    {
      field: "PROD_REQUEST_QTY", headerName: "PROD_REQUEST_QTY", width: 150, cellRenderer: (params: any) => {
        return <span style={{ color: params.data.PROD_REQUEST_QTY < 0 ? "#ff0000" : "#000000", fontWeight: "bold" }}>
          {params.data.PROD_REQUEST_QTY?.toLocaleString("en-US",)}
        </span>
      }
    },
    { field: "PD", headerName: "PD", width: 80 },
    { field: "CAVITY_COT", headerName: "CAVITY_COT", width: 120 },
    { field: "CAVITY_HANG", headerName: "CAVITY_HANG", width: 120 },
    { field: "CAVITY", headerName: "CAVITY", width: 100 },
    {
      field: "NEED_M_QTY", headerName: "NEED_M_QTY", width: 120, cellRenderer: (params: any) => {
        return <span style={{ color: params.data.NEED_M_QTY < 0 ? "#ff0000" : "#000000", fontWeight: "bold" }}>
          {params.data.NEED_M_QTY?.toLocaleString("en-US",)}
        </span>
      }
    },
  ]
  const column_mrp_all = [
    { field: "M_CODE", headerName: "M_CODE", width: 90 },
    { field: "M_NAME", headerName: "M_NAME", width: 90 },
    { field: "WIDTH_CD", headerName: "WIDTH_CD", width: 90 },
    { field: "NEED_M_QTY", headerName: "NEED_M_QTY", width: 90 },
    {
      field: "STOCK_M", headerName: "STOCK_M", width: 90, cellRenderer: (params: any) => {
        return <span style={{ color: params.data.STOCK_M < 0 ? "#ff0000" : "#000000", fontWeight: "bold" }}>
          {params.data.STOCK_M?.toLocaleString("en-US",)}
        </span>
      }
    },
    {
      field: "HOLDING_M", headerName: "HOLDING_M", width: 90, cellRenderer: (params: any) => {
        return <span style={{ color: params.data.HOLDING_M < 0 ? "#ff0000" : "#000000", fontWeight: "bold" }}>
          {params.data.HOLDING_M?.toLocaleString("en-US",)}
        </span>
      }
    },
    {
      field: "M_SHORTAGE", headerName: "M_SHORTAGE", width: 90, cellRenderer: (params: any) => {
        return <span style={{ color: params.data.M_SHORTAGE < 0 ? "#ff0000" : "#000000", fontWeight: "bold" }}>
          {params.data.M_SHORTAGE?.toLocaleString("en-US",)}
        </span>
      }
    },
  ]
  const materialDataTable2 = useMemo(() =>
    <AGTable
      suppressRowClickSelection={false}
      showFilter={true}
      toolbar={
        <></>
      }
      columns={columns}
      data={currentTable}
      onCellEditingStopped={(params: any) => {
        //console.log(e.data)
      }} onRowClick={(params: any) => {
        //clickedRow.current = params.data;
        //console.log(e.data) 
      }} onSelectionChange={(params: any) => {
        //console.log(params)
        //setSelectedRows(params!.api.getSelectedRows()[0]);
        //console.log(e!.api.getSelectedRows())
      }}
    />
    , [currentTable, columns]);
  useEffect(() => {
    load_material_table('PO');
    //setColumnDefinition(column_inspect_output);
  }, []);
  return (
    <div className="tinhlieu">
      <div className="tracuuDataInspection">
        <div className="tracuuDataInspectionform" style={{ backgroundImage: theme.CMS.backgroundImage }}>
          <div className="forminput">
            <div className="forminputcolumn">
              <label>
                <b>Từ ngày:</b>
                <input
                  onKeyDown={(e) => {
                  }}
                  type="date"
                  value={formdata.FROM_DATE.slice(0, 10)}
                  onChange={(e) => setFormInfo("FROM_DATE", e.target.value)}
                ></input>
              </label>
              <label>
                <b>Tới ngày:</b>{" "}
                <input
                  onKeyDown={(e) => {
                  }}
                  type="date"
                  value={formdata.TO_DATE.slice(0, 10)}
                  onChange={(e) => setFormInfo("TO_DATE", e.target.value)}
                ></input>
              </label>
              <label>
                <b>All Time:</b>
                <input
                  onKeyDown={(e) => {
                  }}
                  type="checkbox"
                  name="alltimecheckbox"
                  defaultChecked={formdata.ALLTIME}
                  onChange={() => setFormInfo("ALLTIME", !formdata.ALLTIME)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn" style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
              <label>
                <FormControlLabel
                  label="Chỉ liệu thiếu"
                  control={
                    <Checkbox
                      checked={formdata?.SHORTAGE_ONLY === true}
                      size="small"
                      style={{ padding: 0, margin: 0 }}
                      onChange={(e) => {
                        setFormInfo("SHORTAGE_ONLY", e.target.checked);
                      }}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  }
                />
              </label>
              <label>
                <FormControlLabel
                  label="Chỉ PO mới"
                  control={
                    <Checkbox
                      checked={formdata?.NEWPO === true}
                      size="small"
                      style={{ padding: 0, margin: 0 }}
                      onChange={(e) => {
                        setFormInfo("NEWPO", e.target.checked);
                      }}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  }
                />
              </label>
            </div>
          </div>
          <div className="formbutton">
            <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#129232' }} onClick={() => {
              load_material_table('PO');
            }}>MRP DETAIL</Button>
            <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#f05bd7' }} onClick={() => {
              load_material_table('ALL');
            }}>MRP SUMMARY</Button>
          </div>
        </div>
        <div className="tracuuYCSXTable">{materialDataTable2}</div>
      </div>
    </div>
  );
};
export default TINHLIEU;

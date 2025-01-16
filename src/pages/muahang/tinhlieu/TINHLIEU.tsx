import { Button, Checkbox, FormControlLabel } from "@mui/material";
import moment from "moment";
import { useEffect, useMemo, useRef, useState } from "react";
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
  const ycsxdatatablefilter = useRef<Array<any>>([]);
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

  const setLockMaterial = async (material_value: string) => {
    if (ycsxdatatablefilter.current.length >= 1) {
      let err_code: boolean = false;
      for (let i = 0; i < ycsxdatatablefilter.current.length; i++) {
        await generalQuery("setMaterial_YN", {
          PROD_REQUEST_NO: ycsxdatatablefilter.current[i].PROD_REQUEST_NO,
          MATERIAL_YN: material_value,
        })
          .then((response) => {
            console.log(response.data.tk_status);
            if (response.data.tk_status !== "NG") {
            } else {
              err_code = true;
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
      if (!err_code) {
        Swal.fire(
          "Thông báo",
          "SET YCSX thành công",
          "success"
        );
      } else {
        Swal.fire("Thông báo", "Có lỗi SQL: ", "error");
      }
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 YCSX để SET !", "error");
    }
  };


  const handleConfirmLockMaterial = () => {
      Swal.fire({
        title: "Chắc chắn muốn khóa Liệu cho YCSX được chọn?",
        text: "Sẽ bắt đầu khóa liệu cho YCSX đã chọn",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Khóa!",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            "Tiến hành Khóa Liệu",
            "Đang Khóa liệu YCSX hàng loạt",
            "success"
          );
          setLockMaterial('N');
        }
      });
    };
    const handleConfirmUnLockMaterial = () => {
      Swal.fire({
        title: "Chắc chắn muốn mở Liệu cho YCSX được chọn?",
        text: "Sẽ bắt đầu mở liệu cho YCSX đã chọn",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Mở!",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            "Tiến hành mở Liệu",
            "Đang mở liệu YCSX hàng loạt",
            "success"
          );
          setLockMaterial('Y');
        }
      });
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
    { field: "PROD_REQUEST_NO", headerName: "YCSX_NO", width: 50, cellRenderer: (params: any) => {
      if(params.data.MATERIAL_YN ==='Y')
      {
        return <span style={{ color: 'blue', fontWeight: "bold" }}>
          {params.data.PROD_REQUEST_NO}
        </span>
      }
      else
      {
        return <span style={{ color: 'red', fontWeight: "bold" }}>
        {params.data.PROD_REQUEST_NO}
      </span>
      }
      
     
    } },
    { field: "PROD_REQUEST_DATE", headerName: "YCS_DATE", width: 50 },
    { field: "CUST_CD", headerName: "CUST_CD", width: 100 },
    { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 100 },
    { field: "G_CODE", headerName: "G_CODE", width: 50 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 120 },
    { field: "M_CODE", headerName: "M_CODE", width: 50 },
    { field: "M_NAME", headerName: "M_NAME", width: 120 },
    { field: "WIDTH_CD", headerName: "SIZE", width: 50 },
    {
      field: "PROD_REQUEST_QTY", headerName: "YCSX_QTY", width: 60, cellRenderer: (params: any) => {
        return <span style={{ color: params.data.PROD_REQUEST_QTY < 0 ? "#ff0000" : "#000000", fontWeight: "bold" }}>
          {params.data.PROD_REQUEST_QTY?.toLocaleString("en-US",)}
        </span>
      }
    },
    { field: "PD", headerName: "PD", width: 30 },
    { field: "CAVITY_COT", headerName: "CAVITY_COT", width: 70 },
    { field: "CAVITY_HANG", headerName: "CAVITY_HANG", width: 70 },
    { field: "CAVITY", headerName: "CAVITY", width: 50 },
    {
      field: "NEED_M_QTY", headerName: "NEED_M_QTY", width: 120, cellRenderer: (params: any) => {
        return <span style={{ color: params.data.NEED_M_QTY < 0 ? "#ff0000" : "#033fe6", fontWeight: "bold" }}>
          {params.data.NEED_M_QTY?.toLocaleString("en-US",)}
        </span>
      }
    },
    {
      field: "MATERIAL_YN",
      headerName: "VL_STT",
      width: 80,
      cellRenderer: (params: any) => {
        if (params.data.MATERIAL_YN === "N") {
          return (
            <span style={{ color: "red" }}>
              <b>NO</b>
            </span>
          );
        }
        else if (params.data.MATERIAL_YN === "Y") {
          return (
            <span style={{ color: "green" }}>
              <b>YES</b>
            </span>
          );
        }
        else {
          return (
            <span style={{ color: "orange" }}>
              <b>PENDING</b>
            </span>
          );
        }
      },
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
        ycsxdatatablefilter.current = params!.api.getSelectedRows();
      }}
    />
    , [currentTable, columns, column_mrp_table2]);
  useEffect(() => {
    //load_material_table('PO');
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
          <br></br>
          <div className="formbutton">
            <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#19fc51', color:'black' }} onClick={() => {
              handleConfirmUnLockMaterial();
              
            }}>MỞ LIỆU</Button>
            <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#f80404' }} onClick={() => {
              handleConfirmLockMaterial();
              
            }}>KHÓA LIỆU</Button>
          </div>
        </div>
        <div className="tracuuYCSXTable">{materialDataTable2}</div>
      </div>
    </div>
  );
};
export default TINHLIEU;

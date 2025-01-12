import { Button, Autocomplete, TextField, createFilterOptions, Typography, IconButton } from "@mui/material";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import { CustomerListData, MaterialListData, WH_M_INPUT_DATA } from "../../../../api/GlobalInterface";
import { generalQuery, getCompany, getUserData } from "../../../../api/Api";
import { checkBP, f_getI221NextIN_NO, f_getI222Next_M_LOT_NO, f_Insert_I221, f_Insert_I222, f_updateStockM090, zeroPad } from "../../../../api/GlobalFunction";
import './NHAPLIEU.scss';
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import AGTable from "../../../../components/DataTable/AGTable";
import { MdDelete } from "react-icons/md";
const NHAPLIEU = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [material_table_data, set_material_table_data] = useState<Array<WH_M_INPUT_DATA>>([]);
  const selectedData = useRef<Array<WH_M_INPUT_DATA>>([]);
  const [invoice_no, setInvoiceNo] = useState("");
  const [loaink, setloaiNK] = useState("03");
  const [selectedFactory, setSelectedFactory] = useState("NM1");
  const [materialList, setMaterialList] = useState<MaterialListData[]>([
    {
      M_CODE: "A0000001",
      M_NAME: "#200",
      WIDTH_CD: 1200,
    },
  ]);
  const [selectedMaterial, setSelectedMaterial] =
    useState<MaterialListData | null>({
      M_CODE: "A0000001",
      M_NAME: "#200",
      WIDTH_CD: 1200,
    });
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerListData | null>({
      CUST_CD: getCompany() === "CMS" ? "0049" : "KH000",
      CUST_NAME: getCompany() === "CMS" ? "SSJ CO., LTD" : "PVN",
      CUST_NAME_KD: getCompany() === "CMS" ? "SSJ" : "PVN", 
    });
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));

  const addMaterial = async () => {
    let temp_m_invoie: WH_M_INPUT_DATA = {
      id: moment().format("YYYYMMDD_HHmmsss") + material_table_data.length.toString(),
      CUST_CD: selectedCustomer?.CUST_CD ?? "",
      CUST_NAME_KD: selectedCustomer?.CUST_NAME_KD ?? "",
      M_NAME: selectedMaterial?.M_NAME ?? "",
      M_CODE: selectedMaterial?.M_CODE ?? "",
      WIDTH_CD: selectedMaterial?.WIDTH_CD!,
      INVOICE_NO: invoice_no,
      EXP_DATE: todate,
      PROD_REQUEST_NO: "",
      REMARK: "",
      MET_PER_ROLL: 0,
      LOT_QTY: 0,
      ROLL_PER_LOT: 1,
    }
    if (temp_m_invoie.CUST_CD === '' || temp_m_invoie.M_CODE === '' || temp_m_invoie.INVOICE_NO === '' || temp_m_invoie.EXP_DATE === '') {
      Swal.fire("Thông báo", "Không được để trống thông tin cần thiết", "error");
    }
    else {
      set_material_table_data([...material_table_data, temp_m_invoie]);
    }
  };
  
const nhapkho = async () => {
  if (material_table_data.length === 0) {
    Swal.fire("Thông báo", "Không có dữ liệu nhập kho", "error");
    return;
  }
  let checkmet: boolean = true;
  for (let i = 0; i < material_table_data.length; i++) {
    let ttmet = material_table_data[i].LOT_QTY * material_table_data[i].ROLL_PER_LOT * material_table_data[i].MET_PER_ROLL;
    if (ttmet === 0) checkmet = false;
  }

  if (!checkmet) {    
    Swal.fire("Thông báo", "Lỗi: Có dòng tổng met = 0 , check lại", "error");
    return;
  }

  let next_in_no: string = await f_getI221NextIN_NO();
//  console.log(next_in_no);
  let err_code: string = '';

 


  for (let i = 0; i < material_table_data.length; i++) {   
      let next_in_seq: string = zeroPad(i + 1, 3);
      let kq: string = await f_Insert_I221({
        IN_NO: next_in_no,
        IN_SEQ: next_in_seq,
        M_CODE: material_table_data[i].M_CODE,
        IN_CFM_QTY: material_table_data[i].LOT_QTY * material_table_data[i].ROLL_PER_LOT * material_table_data[i].MET_PER_ROLL,
        REMARK: material_table_data[i].REMARK,
        FACTORY: selectedFactory,
        CODE_50: loaink,
        INVOICE_NO: invoice_no,
        CUST_CD: selectedCustomer?.CUST_CD,
        ROLL_QTY: material_table_data[i].LOT_QTY * material_table_data[i].ROLL_PER_LOT,
        EXP_DATE: material_table_data[i].EXP_DATE
      });
      
      if (kq !== '') {
        err_code += `Lỗi: ${kq} | `;
      }
      else 
      {
       
        for(let j=0;j<material_table_data[i].LOT_QTY;j++) {
          let next_m_lot_no: string = await f_getI222Next_M_LOT_NO();
          let kq: string = '';
          kq = await f_Insert_I222({
            IN_NO: next_in_no,
            IN_SEQ: next_in_seq,
            M_LOT_NO: next_m_lot_no,
            LOC_CD: selectedFactory==='NM1' ? 'BE010': 'HD001',
            WAHS_CD: selectedFactory==='NM1' ? 'B': 'H',
            M_CODE: material_table_data[i].M_CODE,
            IN_CFM_QTY:  material_table_data[i].ROLL_PER_LOT * material_table_data[i].MET_PER_ROLL,                    
            FACTORY: selectedFactory, 
            CUST_CD: selectedCustomer?.CUST_CD,
            ROLL_QTY: material_table_data[i].ROLL_PER_LOT,        
            PROD_REQUEST_NO: material_table_data[i].PROD_REQUEST_NO,                   
          });
          if (kq !== '') {
            err_code += `Lỗi: ${kq} | `;
          }
        }
      }
    

  }


  if (err_code !== '') {
    set_material_table_data([]);
    Swal.fire('Thông báo', 'Nhập kho vật liệu thất bại: ' + err_code, 'error');
  }
  else {
    Swal.fire('Thông báo', 'Nhập kho vật liệu thành công', 'success');
  }
  f_updateStockM090();

}
  const handleConfirmNhapKho= () => {
    Swal.fire({
      title: "Nhập liệu vào kho",
      text: "Chắc chắn muốn nhập kho các liệu đã nhập ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn Nhập!",
    }).then((result) => {
      if (result.isConfirmed) {        
        checkBP(getUserData(), ["KHO"], ["ALL"], ["ALL"], async () => {
          nhapkho();
        });
      }
    });
  };


  const columns_inputMaterial = [
    { field: "CUST_NAME_KD", headerName: "VENDOR", width: 100, headerCheckboxSelection: true, checkboxSelection: true },    
    { field: "M_CODE", headerName: "M_CODE", width: 100 },
    { field: "M_NAME", headerName: "M_NAME", width: 100 },
    { field: "WIDTH_CD", headerName: "WIDTH_CD", width: 100 },
    { field: "LOT_QTY", headerName: "LOT_QTY", width: 100 },
    { field: "ROLL_PER_LOT", headerName: "ROLL_PER_LOT", width: 100 },
    { field: "MET_PER_ROLL", headerName: "MET_PER_ROLL", width: 100 },
    { field: "INVOICE_NO", headerName: "INVOICE_NO", width: 100 },
    { field: "REMARK", headerName: "REMARK", width: 100 },
    { field: "EXP_DATE", headerName: "EXP_DATE", width: 100 },
    { field: "PROD_REQUEST_NO", headerName: "PROD_REQUEST_NO", width: 100 },
  ];
  const materialInputTable = React.useMemo(()=> {
    return (
      <AGTable
        toolbar={
          <div>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                //delete selected rows from table
                if (selectedData.current.length > 0) {
                  set_material_table_data(
                    material_table_data.filter(
                      (x: any) =>
                        !selectedData.current.includes(x)
                    )
                  );
                }
                
              }}
            >
              <MdDelete color="red" size={15} />
              Delete Seleceted
            </IconButton>     

          </div>}
        columns={columns_inputMaterial}
        data={material_table_data}
        onCellEditingStopped={(params: any) => {
          //console.log(e.data)
        }} onRowClick={(params: any) => {
          //console.log(e.data)
        }} onSelectionChange={(params: any) => {
          //console.log(e!.api.getSelectedRows())
          selectedData.current = params!.api.getSelectedRows();
        }}
      />
    )
  },[material_table_data,columns_inputMaterial])

  const [customerList, setCustomerList] = useState<CustomerListData[]>([]);
  const filterOptions1 = createFilterOptions({
    matchFrom: "any",
    limit: 100,
  });
  const getcustomerlist = () => {
    generalQuery("selectVendorList", {})
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          setCustomerList(response.data.data);
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
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

  useEffect(() => {
    getcustomerlist();
    getmateriallist();
  }, []);
  return (
    <div className="nhaplieu">
      <div className="tracuuDataInspection">
        <div className="tracuuDataInspectionform" style={{ backgroundImage: theme.CMS.backgroundImage }}>
          <div className="forminput">
            <div className="forminputcolumn">
              <div className="chonvatlieu" style={{ display: 'flex', alignItems: 'center' }}>
                <b>Vật liệu:</b>
                <label>
                  <Autocomplete
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
                    renderOption={(props, option: any)=> <Typography style={{ fontSize: '0.7rem' }} {...props}>
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
                </label>
              </div>
              <label style={{ display: "flex", alignItems: "center" }}>
                <b>Vendor:</b>
                <Autocomplete
                  sx={{
                    height: 10,
                    width: "160px",
                    margin: "1px",
                    fontSize: "0.7rem",
                    marginBottom: "20px",
                    backgroundColor: "white",
                  }}
                  size="small"
                  disablePortal
                  options={customerList}
                  className="autocomplete"
                  filterOptions={filterOptions1}
                  isOptionEqualToValue={(option: any, value: any) =>
                    option.CUST_CD === value.CUST_CD
                  }
                  getOptionLabel={(option: any) =>
                    `${option.CUST_CD !== null ? option.CUST_NAME_KD : ""}${option.CUST_CD !== null ? option.CUST_CD : ""
                    }`
                  }
                  renderInput={(params) => (
                    <TextField {...params} style={{ height: "10px" }} />
                  )}
                  renderOption={(props, option: any)=> <Typography style={{ fontSize: '0.7rem' }} {...props}>
                  {`${option.CUST_CD !== null ? option.CUST_NAME_KD : ""}${option.CUST_CD !== null ? option.CUST_CD : ""}`}
                 </Typography>}
                  defaultValue={{
                    CUST_CD: getCompany() === "CMS" ? "0000" : "KH000",
                    CUST_NAME: getCompany() === "CMS" ? "SEOJIN" : "PVN",
                    CUST_NAME_KD: getCompany() === "CMS" ? "SEOJIN" : "PVN",
                  }}
                  value={{
                    CUST_CD: selectedCustomer?.CUST_CD,
                    CUST_NAME: selectedCustomer?.CUST_NAME,
                    CUST_NAME_KD: selectedCustomer?.CUST_NAME_KD
                  }}
                  onChange={(event: any, newValue: any) => {
                    console.log(newValue);
                    setSelectedCustomer(newValue);
                  }}
                />
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Factory:</b>
                <select
                  name='factory'
                  value={selectedFactory}
                  onChange={(e) => {
                    setSelectedFactory(e.target.value);
                  }}
                >
                  <option value='NM1'>NM1</option>
                  <option value='NM2'>NM2</option>
                </select>
              </label>
              <label>
                <b>PL Nhập Khẩu</b>
                <select
                  name="loaixh"
                  value={loaink}
                  onChange={(e) => {
                    setloaiNK(e.target.value);
                  }}
                >
                  <option value="01">GC</option>
                  <option value="02">SK</option>
                  <option value="03">KD</option>
                  <option value="04">VN</option>
                  <option value="05">SAMPLE</option>
                  <option value="06">Vai bac 4</option>
                  <option value="07">ETC</option>
                </select>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Ngày nhập kho:</b>
                <input
                  type="date"
                  value={fromdate.slice(0, 10)}
                  onChange={(e) => setFromDate(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Hạn Sử Dụng:</b>{" "}
                <input
                  type="date"
                  value={todate.slice(0, 10)}
                  onChange={(e) => setToDate(e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Invoice No:</b>{" "}
                <input
                  type="text"
                  placeholder="Invoice No"
                  value={invoice_no}
                  onChange={(e) => setInvoiceNo(e.target.value)}
                ></input>
              </label>
            </div>
          </div>
          <div className="formbutton">
            <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#f05bd7' }} onClick={() => {
              addMaterial();
            }}>Add</Button>
            <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#ec9d52' }} onClick={() => {
              handleConfirmNhapKho();
            }}>Nhập kho</Button>
          </div>
        </div>
        <div className="tracuuYCSXTable">{materialInputTable}</div>       
      </div>
    </div>
  );
};
export default NHAPLIEU;

import {
  Button,
  Autocomplete,
  IconButton,
  TextField,
  createFilterOptions,
  Typography,
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
  ColumnChooser,
  Summary,
  TotalItem,
} from "devextreme-react/data-grid";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { AiFillCloseCircle, AiFillFileExcel } from "react-icons/ai";
import Swal from "sweetalert2";
import { MdDelete, MdOutlinePivotTableChart } from "react-icons/md";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import { CustomerListData, DKXL_DATA, MATERIAL_TABLE_DATA, MaterialListData, WH_M_INPUT_DATA, WH_M_OUTPUT_DATA } from "../../../../api/GlobalInterface";
import { generalQuery, getCompany, getUserData } from "../../../../api/Api";
import { checkBP, CustomResponsiveContainer, f_insertO302, f_updateO301_OUT_CFM_QTY, f_updateStockM090, f_updateUSE_YN_I222_RETURN_NVL, SaveExcel } from "../../../../api/GlobalFunction";
import PivotTable from "../../../../components/PivotChart/PivotChart";
import './XUATLIEU.scss';
import AGTable from "../../../../components/DataTable/AGTable";
const XUATLIEU = () => {
  const [giao_empl, setGiao_Empl] = useState("");
  const [nhan_empl, setNhan_Empl] = useState("");
  const [giao_empl_name, setGiao_Empl_Name] = useState("");
  const [nhan_empl_name, setNhan_Empl_Name] = useState("");
  const [planId, setPlanId] = useState("");
  const [fsc_GCODE, setFSC_GCODE] = useState("01");
  const [g_name, setGName] = useState("");
  const [FSC_M100, setFSC_M100] = useState("N"); 
  const [prepareOutData, setPrepareOutData] = useState<WH_M_OUTPUT_DATA[]>([]);
  const [selectedFactory, setSelectedFactory] = useState("NM1");
  const selectedData = useRef<Array<WH_M_OUTPUT_DATA>>([]);
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerListData | null>({
      CUST_CD: getCompany() === "CMS" ? "6969" : "KH000",
      CUST_NAME: getCompany() === "CMS" ? "CMSVINA" : "PVN",
      CUST_NAME_KD: getCompany() === "CMS" ? "CMSVINA" : "PVN",
    });
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [m_lot_no, setM_LOT_NO] = useState("");
  const [m_name, setM_Name] = useState("");
  const [solanout, setSoLanOut] = useState(1);
  const checkEMPL_NAME = (selection: number, EMPL_NO: string) => {
    generalQuery("checkEMPL_NO_mobile", { EMPL_NO: EMPL_NO })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);\
          if (selection === 1) {
            setGiao_Empl_Name(
              response.data.data[0].MIDLAST_NAME +
              " " +
              response.data.data[0].FIRST_NAME,
            );
          } else {
            setNhan_Empl_Name(
              response.data.data[0].MIDLAST_NAME +
              " " +
              response.data.data[0].FIRST_NAME,
            );
          }
        } else {
          setGiao_Empl_Name("");
          setGiao_Empl_Name("");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const checkPlanID = (PLAN_ID: string) => {
    generalQuery("checkPLAN_ID", { PLAN_ID: PLAN_ID })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);
          setPlanId(PLAN_ID);
          setGName(response.data.data[0].G_NAME);
          setFSC_GCODE(response.data.data[0].FSC_CODE ?? '01');
          setFSC_M100(response.data.data[0].FSC ?? 'N');
        } else {
          setGName("");
          setFSC_GCODE("01");
          setFSC_M100('N');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const xuatkho = async () => {
    if (prepareOutData.length > 0) {
      Swal.fire({
        title: 'Đang xuất kho...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      let err_code: string = '';
      for (let i = 0; i < prepareOutData.length; i++) {
        let temp_err_code: string = '';
        if ((prepareOutData[i].FSC_O302 === 'N' && FSC_M100 === 'N') || (prepareOutData[i].FSC_O302 === 'Y' && FSC_M100 === 'Y') || (prepareOutData[i].FSC_O302 === 'Y' && FSC_M100 === 'N')) {
          err_code += temp_err_code = await f_insertO302({
            OUT_DATE: prepareOutData[i].OUT_DATE,
            OUT_NO: prepareOutData[i].OUT_NO,
            OUT_SEQ: prepareOutData[i].OUT_SEQ,
            M_LOT_NO: prepareOutData[i].M_LOT_NO,
            LOC_CD: prepareOutData[i].LOC_CD,
            M_CODE: prepareOutData[i].M_CODE,
            OUT_CFM_QTY: prepareOutData[i].TOTAL_QTY,
            WAHS_CD: prepareOutData[i].WAHS_CD,
            REMARK: '',
            USE_YN: 'Y',
            INS_EMPL: giao_empl,
            FACTORY: selectedFactory,
            CUST_CD: selectedCustomer?.CUST_CD,
            ROLL_QTY: prepareOutData[i].ROLL_QTY,
            OUT_DATE_THUCTE: moment.utc().format("YYYYMMDD"),
            IN_DATE_O302: prepareOutData[i].IN_DATE,
            PLAN_ID: planId,
            SOLANOUT: solanout,
            LIEUQL_SX: prepareOutData[i].LIEUQL_SX,
            INS_RECEPTION: nhan_empl,
            FSC_O302: prepareOutData[i].FSC_O302,
            FSC_GCODE: fsc_GCODE,
            FSC_MCODE: prepareOutData[i].FSC_MCODE,
          })
        }
        else {
          err_code += 'Lỗi: Code FSC thì chỉ dùng liệu FSC';
        }
      }
      if (err_code !== '') {
        Swal.fire('Thông báo', 'Xuất kho vật liệu thất bại: ' + err_code, 'error');
      }
      else {
        setPrepareOutData([]);
        setPlanId("");
        setGName("");
        setFSC_GCODE("N");
        f_updateO301_OUT_CFM_QTY(planId);
        Swal.fire('Thông báo', 'Xuất kho vật liệu thành công', 'success');
      }
      f_updateStockM090();
    }
    else {
      Swal.fire("Thông báo", "Chưa có dòng nào", 'error');
    }
  }
  const checkLotNVL = async (M_LOT_NO: string, PLAN_ID: string) => {
    await generalQuery("checkMNAMEfromLotI222XuatKho", { M_LOT_NO: M_LOT_NO, PLAN_ID: PLAN_ID })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);
          setM_Name(
            response.data.data[0].M_NAME +
            " | " +
            response.data.data[0].WIDTH_CD,
          );
          let IN_DATE: string = response.data.data[0].IN_DATE;
          let USE_YN: string = response.data.data[0].USE_YN;
          let M_CODE: string = response.data.data[0].M_CODE;
          let M_NAME: string = response.data.data[0].M_NAME;
          let WIDTH_CD: number = response.data.data[0].WIDTH_CD;
          let IN_CFM_QTY: number = USE_YN !== 'R' ? response.data.data[0].IN_CFM_QTY : response.data.data[0].RETURN_QTY;
          let ROLL_QTY: number = response.data.data[0].ROLL_QTY;
          let LIEUQL_SX: number = response.data.data[0].LIEUQL_SX;
          let WAHS_CD: string = response.data.data[0].WAHS_CD;
          let LOC_CD: string = response.data.data[0].LOC_CD;
          let FSC_O302: string = response.data.data[0].FSC ?? "N";
          let lot_info: DKXL_DATA = dangkyxuatlieutable.filter((ele: DKXL_DATA, index: number) => {
            return ele.M_CODE === M_CODE;
          })[0] ?? "NG";
          console.log(lot_info);
          let OUT_DATE: string = lot_info.OUT_DATE ?? 'NG';
          let OUT_NO: string = lot_info.OUT_NO ?? "NG";
          let OUT_SEQ: string = lot_info.OUT_SEQ ?? "NG";
          let FSC_MCODE: string = response.data.data[0].FSC_CODE ?? "01";
          let temp_row: WH_M_OUTPUT_DATA = {
            id: moment().format("YYYYMMDD_HHmmsss" + prepareOutData.length),
            M_CODE: M_CODE,
            M_NAME: M_NAME,
            WIDTH_CD: WIDTH_CD,
            M_LOT_NO: M_LOT_NO,
            ROLL_QTY: ROLL_QTY,
            UNIT_QTY: IN_CFM_QTY,
            TOTAL_QTY: ROLL_QTY * IN_CFM_QTY,
            WAHS_CD: WAHS_CD,
            LOC_CD: LOC_CD,
            LIEUQL_SX: LIEUQL_SX,
            OUT_DATE: OUT_DATE,
            OUT_NO: OUT_NO,
            OUT_SEQ: OUT_SEQ,
            IN_DATE: IN_DATE,
            USE_YN: USE_YN,
            FSC_O302: FSC_O302,
            FSC_MCODE: FSC_MCODE,
            FSC_GCODE: fsc_GCODE,
          }
          let checkExist_lot: boolean = prepareOutData.filter((ele: WH_M_OUTPUT_DATA, index: number) => {
            return ele.M_LOT_NO === M_LOT_NO;
          }).length > 0;
          if (!checkExist_lot && OUT_DATE !== 'NG' && USE_YN !== 'X') {
            setPrepareOutData([...prepareOutData, temp_row]);
          }
          else if (OUT_DATE === 'NG') {
            Swal.fire("Thông báo", "Lot này là Liệu chưa đăng ký xuất kho", "warning");
          }
          else if (USE_YN === 'X') {
            Swal.fire("Thông báo", "Lot này đã sử dụng rồi", "warning");
          }
          else {
            Swal.fire("Thông báo", "Lot này bắn rồi", "warning");
          }
          setM_LOT_NO("");
        } else {
          setM_Name("");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleConfirmXuatKho = () => {
    Swal.fire({
      title: "Xuất liệu",
      text: "Chắc chắn muốn xuất kho các liệu đã beep ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn Xuất!",
    }).then((result) => {
      if (result.isConfirmed) {
        checkBP(getUserData(), ["KHO"], ["ALL"], ["ALL"], async () => {
          xuatkho();
        });
      }
    });
  };
  const [dangkyxuatlieutable, setDangKyXuatLieuTable] = useState<DKXL_DATA[]>([]);
  const loadDKXLTB = async (PLAN_ID: string) => {
    await generalQuery("checkPLANID_O301", { PLAN_ID: PLAN_ID })
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
          setDangKyXuatLieuTable(response.data.data);
        } else {
          setDangKyXuatLieuTable([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const checkSoLanOutO302 = async (PLAN_ID: string) => {
    await generalQuery("checksolanout_O302", { PLAN_ID: PLAN_ID })
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
          let current_solanout: number = ((response.data.data[0].SOLANOUT !== '' && response.data.data[0].SOLANOUT !== null) ? parseInt(response.data.data[0].SOLANOUT) : 0);
          let temp_solanout: number = current_solanout + 1;
          setSoLanOut(temp_solanout);
        } else {
          setSoLanOut(1);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const columns_dkxl = [
    { field: "M_CODE", headerName: "M_CODE", width: 80,headerCheckboxSelection: true, checkboxSelection: true  },
    { field: "M_NAME", headerName: "M_NAME", width: 70 },
    { field: "WIDTH_CD", headerName: "SIZE", width: 30 },
    { field: "OUT_PRE_QTY", headerName: "DKY", width: 40 },
    { field: "OUT_CFM_QTY", headerName: "OUT", width: 40 },
  ];
  const materialRegisterTable = React.useMemo(()=> {
    return (
      <AGTable
        toolbar={
          <div>           
          </div>}
        columns={columns_dkxl}
        data={dangkyxuatlieutable}
        onCellEditingStopped={(params: any) => {
          //console.log(e.data)
        }} onRowClick={(params: any) => {
          //console.log(e.data)
        }} onSelectionChange={(params: any) => {
          //console.log(e!.api.getSelectedRows())
          
        }}
      />
    )
  },[dangkyxuatlieutable,columns_dkxl])

  const columns_outputMaterial = [
    { field: "M_CODE", headerName: "M_CODE", width: 90,headerCheckboxSelection: true, checkboxSelection: true  },
    { field: "M_NAME", headerName: "M_NAME", width: 90 },
    { field: "WIDTH_CD", headerName: "WIDTH_CD", width: 90 },
    { field: "ROLL_QTY", headerName: "ROLL_QTY", width: 90 },
    { field: "UNIT_QTY", headerName: "UNIT_QTY", width: 90 },
    { field: "TOTAL_QTY", headerName: "TOTAL_QTY", width: 90 },
    { field: "LIEUQL_SX", headerName: "LIEUQL_SX", width: 90 },
    { field: "WAHS_CD", headerName: "WAHS_CD", width: 90 },
    { field: "LOC_CD", headerName: "LOC_CD", width: 90 },
    { field: "OUT_DATE", headerName: "OUT_DATE", width: 90 },
    { field: "OUT_NO", headerName: "OUT_NO", width: 90 },
    { field: "OUT_SEQ", headerName: "OUT_SEQ", width: 90 },
    { field: "IN_DATE", headerName: "IN_DATE", width: 90 },
    { field: "USE_YN", headerName: "USE_YN", width: 90 },
  ]
  const materialOutputTable = React.useMemo(()=> {
    return (
      <AGTable
        toolbar={
          <div>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                //delete selected rows from table
                if (selectedData.current.length > 0) {
                  setPrepareOutData(
                    prepareOutData.filter(
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
        columns={columns_outputMaterial}
        data={prepareOutData}
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
  },[columns_outputMaterial,prepareOutData])

  const [customerList, setCustomerList] = useState<CustomerListData[]>([]);
  const filterOptions1 = createFilterOptions({
    matchFrom: "any",
    limit: 100,
  });
  const getcustomerlist = () => {
    generalQuery("selectCustomerAndVendorList", {})
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
  useEffect(() => {
    getcustomerlist();
   
  }, []);
  return (
    <div className="xuatlieu">
      <div className="tracuuDataInspection">
        <div className="tracuuDataInspectionform">
          <div className="forminput">
            <div className="forminputcolumn">
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
                  renderOption={(props, option: any) => <Typography style={{ fontSize: '0.7rem' }} {...props}>
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
                <b>Ngày xuất kho:</b>
                <input
                  type="date"
                  value={fromdate.slice(0, 10)}
                  onChange={(e) => setFromDate(e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Ng.Giao:</b>
                <input
                  type="text"
                  placeholder={"NHU1903"}
                  value={giao_empl}
                  onChange={(e) => {
                    if (e.target.value.length >= 7) {
                      checkEMPL_NAME(1, e.target.value);
                    }
                    else {
                      setGiao_Empl_Name('')
                    }
                    setGiao_Empl(e.target.value);
                  }}
                ></input>
              </label>
              {giao_empl_name && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: "bold",
                    color: "blue",
                  }}
                >
                  {giao_empl_name}
                </span>
              )}
              <label>
                <b>Ng.Nhận:</b>
                <input
                  type="text"
                  placeholder={"NHU1903"}
                  value={nhan_empl}
                  onChange={(e) => {
                    if (e.target.value.length >= 7) {
                      checkEMPL_NAME(2, e.target.value);
                    }
                    else {
                      setNhan_Empl_Name('')
                    }
                    setNhan_Empl(e.target.value);
                  }}
                ></input>
              </label>
              {nhan_empl && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: "bold",
                    color: "blue",
                  }}
                >
                  {nhan_empl_name}
                </span>
              )}
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Số chỉ thị:</b>{" "}
                <input
                  type="text"
                  placeholder="Số chỉ thị"
                  value={planId}
                  onChange={(e) => {
                    setPlanId(e.target.value)
                    if (e.target.value.length >= 7) {
                      checkPlanID(e.target.value);
                      checkSoLanOutO302(e.target.value);
                      loadDKXLTB(e.target.value);
                    }
                    else {
                      setGName('');
                      setM_Name('');
                    }
                  }}
                ></input>
              </label>
              {g_name && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: "bold",
                    color: "blue",
                  }}
                >
                  {g_name}
                </span>
              )}
              <label>
                <b>LOT Vật liệu:</b>{" "}
                <input
                  type="text"
                  placeholder="Lot vật liệu"
                  value={m_lot_no}
                  onChange={(e) => {
                    setM_LOT_NO(e.target.value)
                    if (e.target.value.length >= 10) {
                      if (planId.length >= 7 && g_name !== '' && giao_empl_name !== '' && nhan_empl_name !== '') {
                        checkLotNVL(e.target.value, planId);
                      }
                      else {
                        setM_LOT_NO('')
                        Swal.fire('Lỗi', 'Vui lòng nhập đầy đủ thông tin', 'error');
                      }
                    }
                  }}
                ></input>
              </label>
              {m_name && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: "bold",
                    color: "blue",
                  }}
                >
                  {m_name}
                </span>
              )}
            </div>
          </div>
          <div className="formbutton">
            <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#6952ec' }} onClick={() => {
              handleConfirmXuatKho();
            }}>Xuất kho</Button>
          </div>          
        </div>
        <div className="dkxlTable">{materialRegisterTable}</div>
        <div className="tracuuYCSXTable">{materialOutputTable}</div>        
      </div>
    </div>
  );
};
export default XUATLIEU;
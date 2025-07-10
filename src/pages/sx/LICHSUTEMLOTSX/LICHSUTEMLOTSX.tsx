import { Button, IconButton } from "@mui/material";
import moment from "moment";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { f_cancelProductionLot, f_handleGETBOMAMAZON, f_LichSuTemLot, renderElement } from "../../../api/GlobalFunction";
import { MdPrint } from "react-icons/md";
import { COMPONENT_DATA, TEMLOTSX_DATA } from "../../../api/GlobalInterface";
import {
  DataDiv,
  DataTBDiv,
  FormButtonColumn,
  FromInputColumn,
  FromInputDiv,
  QueryFormDiv,
} from "../../../components/StyledComponents/ComponentLib";
import { useReactToPrint } from "react-to-print";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import AGTable from "../../../components/DataTable/AGTable";
import { FcCancel } from "react-icons/fc";
import { getUserData } from "../../../api/Api";
import Swal from "sweetalert2";
const LICHSUTEMLOTSX = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [lichsutemlotdata, setlichsutemlotdata] = useState<Array<TEMLOTSX_DATA>>([]);
  const [filterData, setFilterData] = useState({
    FROM_DATE: moment().format("YYYY-MM-DD"),
    TO_DATE: moment().format("YYYY-MM-DD"),
    PROCESS_LOT_NO: '',
    CUST_NAME_KD: '',
    G_CODE: '',
    G_NAME: '',
    PROD_REQUEST_NO: '',
  });
  const labelprintref = useRef<HTMLDivElement>(null);
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
  const [showhideTemLot, setShowHideTemLot] = useState(false);
  const load_lichsutemlot_data = async () => {
    let kq = await f_LichSuTemLot(filterData);    
    setlichsutemlotdata(kq);
  };
  const selectedRow = useRef<TEMLOTSX_DATA | null>(null) as React.MutableRefObject<TEMLOTSX_DATA | null>;
  const handlePrint = useReactToPrint({
    content: () => labelprintref.current,
  });
  const setFilterFormInfo = (keyname: string, value: any) => {
    let tempCSInfo = {
      ...filterData,
      [keyname]: value,
    };
    setFilterData(tempCSInfo);
  };
  const handleSearchCodeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      load_lichsutemlot_data();
    }
  };
  const columns_lichsutemlot = useMemo(() => [
    { field: 'INS_DATE', headerName: 'INS_DATE', width: 100 },
    { field: 'G_CODE', headerName: 'G_CODE', width: 60 },
    { field: 'G_NAME', headerName: 'G_NAME', width: 120 },
    { field: 'DESCR', headerName: 'DESCR', width: 120 },
    { field: 'M_LOT_NO', headerName: 'M_LOT_NO', width: 60 },
    { field: 'LOTNCC', headerName: 'LOTNCC', width: 100 },
    { field: 'PROD_REQUEST_NO', headerName: 'YCSX', width: 60 },
    { field: 'PROD_REQUEST_QTY', headerName: 'YCSX_QTY', width: 60, cellRenderer:(ele: any) => {
      return (
        <span style={{ color: '#067cca', fontWeight: 'normal' }}>{ele.data.PROD_REQUEST_QTY?.toLocaleString('en-US')}</span>
      )
    } },
    { field: 'PROCESS_LOT_NO', headerName: 'PROCESS_LOT_NO', width: 100, cellRenderer:(ele: any) => {
      return (
        <span style={{ color: 'green', fontWeight: 'bold' }}>{ele.data.PROCESS_LOT_NO}</span>
      )
    }},
    { field: 'M_NAME', headerName: 'M_NAME', width: 100 },
    { field: 'WIDTH_CD', headerName: 'WIDTH_CD', width: 60 },
    { field: 'EMPL_NAME', headerName: 'EMPL_NAME', width: 100 },
    { field: 'PLAN_ID', headerName: 'PLAN_ID', width: 100 },
    { field: 'TEMP_QTY', headerName: 'TEMP_QTY', width: 70, cellRenderer:(ele: any) => {
      return (
        <span style={{ color: 'blue', fontWeight: 'bold' }}>{ele.data.TEMP_QTY?.toLocaleString('en-US')}</span>
      )
    }},
    { field: 'PROCESS_NUMBER', headerName: 'PROCESS_NUMBER', width: 100 },
    { field: 'LOT_STATUS', headerName: 'LOT_STATUS', width: 100 },
    { field: 'REMARK', headerName: 'REMARK', width: 100 },
  ],[]);

  const audit_list_data_ag_table = useMemo(() => {
    return (
      <AGTable        
        suppressRowClickSelection={false}
        showFilter={true}
        toolbar={
          <div>     
            <IconButton
                className="buttonIcon"
                onClick={() => {
                  if  (getUserData()?.EMPL_NO==='NHU1903') {
                    setShowHideTemLot(prev => !prev);
                  }
                  else {
                    Swal.fire("Thông báo", "Bạn không có quyền xem lot", "error");
                  }
                }}
              >
                <MdPrint color="#611ad3" size={15} />
                Show LOT
              </IconButton>      
            <IconButton
                className="buttonIcon"
                onClick={async () => {
                  if(selectedRow !== null && selectedRow !== undefined)
                  {
                    if (selectedRow.current?.PROCESS_LOT_NO) {
                      console.log(selectedRow.current.LOT_STATUS);
                      if(selectedRow.current.LOT_STATUS === null)
                      {
                        handleCancelLot(selectedRow.current.PROCESS_LOT_NO);
                      }
                      else {
                        Swal.fire('Thông báo','Lot đã chuyển công đoạn, không hủy được','error')
                      }
                    }
                  }
                }}
              >
                <FcCancel color="#e60611" size={15} />
                Cancel LOT
              </IconButton>      
          </div>}
        columns={columns_lichsutemlot}
        data={lichsutemlotdata}
        onCellEditingStopped={(params: any) => {
        }}
        onCellClick={async (params: any) => {
          selectedRow.current = params.data
          setComponentList(
            componentList.map((e: COMPONENT_DATA, index: number) => {
              let value: string = e.GIATRI;
              if (e.DOITUONG_NAME === "G_NAME") {
                value = params.data.G_NAME?.substring(0, 34) ?? "";
              } else if (e.DOITUONG_NAME === "LOTSX_BARCODE") {
                value = params.data.PROCESS_LOT_NO ?? "";                
              } else if (e.DOITUONG_NAME === "LOTSX_TEXT") {
                value = params.data.PROCESS_LOT_NO ?? "";
              } else if (e.DOITUONG_NAME === "LOT_QTY") {
                value = (params.data.TEMP_QTY?.toLocaleString('en-US') ?? "") + "(" + params.data.TEMP_MET?.toLocaleString('en-US',{maximumFractionDigits: 2}) + "m)";
              } else if (e.DOITUONG_NAME === "LOT_NVL") {
                value = "Lot NVL: " + (params.data.M_LOT_NO ?? "");
              } else if (e.DOITUONG_NAME === "SETTING") {
                value = "SET " + (params.data.SETTING_MET?.toString() ?? "") +  "m | NG CĐ " +( params.data.PR_NG?.toString() ?? "") + "m";
              } else if (e.DOITUONG_NAME === "NM_CD_CT") {
                value = (params.data.FACTORY ?? "" )+ "/" + (params.data.EQUIPMENT_CD ?? "") + "/CĐ:" + (params.data.PR_NB ?? "") + "/" + (params.data.PLAN_ID ?? "");
              } else if (e.DOITUONG_NAME === "PLAN_QTY") {
                  value = "SL Chỉ thị: " + (params.data.PLAN_QTY?.toLocaleString('en-US') ?? "") + "EA";
              } else if (e.DOITUONG_NAME === "NVL") {
                value = "NVL: " + (params.data.M_NAME ?? "") + "| " + (params.data.WIDTH_CD ?? "") + " mm";
              } else if (e.DOITUONG_NAME === "NHANVIEN") {
                value = "NV: " + (params.data.INS_EMPL ?? "") + "_Time: " + (params.data.INS_DATE ?? "");
              } else if (e.DOITUONG_NAME === "LOTSX_BARCODE2") {
                value = params.data.PROCESS_LOT_NO ?? "";
              } 
              return {
                ...e,
                GIATRI: value,
              };
            }),
          );
        }}
        onSelectionChange={(params: any) => {
          //console.log(e!.api.getSelectedRows())
        
        }}     />   
    )
  }, [lichsutemlotdata, columns_lichsutemlot]);

  const handleCancelLot = useCallback(async (PROCESS_LOT_NO: string) => {
      if(getUserData()?.EMPL_NO==='NHU1903') {
        Swal.fire({
          title: "Hủy LOT",
          text: "Chắc chắn muốn Hủy LOT ?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Vẫn hủy!",
        }).then(async (result) => {
          if (result.isConfirmed) {
            await f_cancelProductionLot({
              PROCESS_LOT_NO: PROCESS_LOT_NO,
            }); 
            Swal.fire('Thông báo','Hủy thành công','success');
          }
        });      
      }
      else {
        Swal.fire("Thông báo", "Bạn không có quyền hủy lot", "error");
      };   
  },[]);

  const loadLabelDesign = useCallback(async() => {
    setComponentList(await f_handleGETBOMAMAZON("6E00002A"));
  },[]);
  useEffect(() => {
    loadLabelDesign();
    }, []);
  return (
    <DataDiv>
      <QueryFormDiv style={{ backgroundImage: theme.CMS.backgroundImage }}>
        <FromInputDiv>
          <FromInputColumn>
            <label>
              <b>Từ ngày:</b>
              <input
                onKeyDown={(e) => {
                  handleSearchCodeKeyDown(e);
                }}
                type='date'
                value={filterData?.FROM_DATE.slice(0, 10)}
                onChange={(e) => setFilterFormInfo("FROM_DATE", e.target.value)}
              ></input>
            </label>
            <label>
              <b>Tới ngày:</b>{" "}
              <input
                onKeyDown={(e) => {
                  handleSearchCodeKeyDown(e);
                }}
                type='date'
                value={filterData?.TO_DATE.slice(0, 10)}
                onChange={(e) => setFilterFormInfo("TO_DATE", e.target.value)}
              ></input>
            </label>
          </FromInputColumn>
          <FromInputColumn>
            <label>
              <b>Code KD:</b>{" "}
              <input
                type="text"
                placeholder="Code hàng"
                value={filterData?.G_NAME}
                onKeyDown={(e) => {
                  handleSearchCodeKeyDown(e);
                }}
                onChange={(e) => setFilterFormInfo("G_NAME", e.target.value)}
              ></input>
            </label>
            <label style={{ display: "flex", alignItems: "center" }}>
              <b>Code ERP:</b>{" "}
              <input
                type="text"
                placeholder="Code hàng"
                value={filterData?.G_CODE}
                onKeyDown={(e) => {
                  handleSearchCodeKeyDown(e);
                }}
                onChange={(e) => setFilterFormInfo("G_CODE", e.target.value)}
              ></input>
            </label>
          </FromInputColumn>
          <FromInputColumn>
            <label>
              <b>YCSX:</b>{" "}
              <input
                type="text"
                placeholder="YCSX"
                value={filterData?.PROD_REQUEST_NO}
                onKeyDown={(e) => {
                  handleSearchCodeKeyDown(e);
                }}
                onChange={(e) => setFilterFormInfo("PROD_REQUEST_NO", e.target.value)}
              ></input>
            </label>
            <label>
              <b>Khách hàng:</b>{" "}
              <input
                type="text"
                placeholder="Khách hàng"
                value={filterData?.CUST_NAME_KD}
                onKeyDown={(e) => {
                  handleSearchCodeKeyDown(e);
                }}
                onChange={(e) => setFilterFormInfo("CUST_NAME_KD", e.target.value)}
              ></input>
            </label>
          </FromInputColumn>
          <FromInputColumn>
            <label>
              <b>LOT SX:</b>{" "}
              <input
                type="text"
                placeholder="LOT SX"
                value={filterData?.PROCESS_LOT_NO}
                onKeyDown={(e) => {
                  handleSearchCodeKeyDown(e);
                }}
                onChange={(e) => setFilterFormInfo("PROCESS_LOT_NO", e.target.value)}
              ></input>
            </label>
          </FromInputColumn>
        </FromInputDiv>
        <FormButtonColumn>
          <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#129232' }} onClick={() => {
            load_lichsutemlot_data();
          }}>Load Data</Button>
        </FormButtonColumn>
      </QueryFormDiv>
      <DataTBDiv>
        {audit_list_data_ag_table}
      </DataTBDiv>      
      {showhideTemLot && 
       <div className="labelprint" style={{position: 'absolute', top: '50%', left: '45%',  width: 'fit-content', height: 'fit-content'}}>        
       <div style={{display: 'flex',flexDirection: 'column',  alignItems: 'center', justifyContent: 'center', marginBottom: '10px'}}>
       
        <div className="labeldiv" ref={labelprintref} >
        {renderElement(componentList)}
        </div>
        <div className="buttondiv" style={{position: 'absolute', top: '-50px', left: '0%', backgroundColor: '#c3e7e4', border: '1px solid #000', width: '80px', height: 'fit-content'}}>
        <IconButton
        className="buttonIcon"
        onClick={() => {
          handlePrint();          
        }}
      >
        <MdPrint color="#066eaa" size={15} />
        Print lot
      </IconButton> 
        </div>
       </div>
        
         </div>
      }
    </DataDiv>
  );
};
export default LICHSUTEMLOTSX;

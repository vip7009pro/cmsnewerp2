import {
    Autocomplete,
    Button,
    Checkbox,
    FormControlLabel,
    IconButton,
    TextField,
    Typography,
  } from "@mui/material";
  import { DataGrid as Datagrid2, GridSelectionModel,GridToolbarContainer, GridToolbarDensitySelector, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';
  import moment from "moment";
  import React, { useContext, useEffect, useState, useTransition } from "react";
  import { AiFillFileExcel, AiOutlineSearch } from "react-icons/ai";
  import Swal from "sweetalert2";
  import { generalQuery } from "../../../api/Api";
  import { UserContext } from "../../../api/Context";
  import { SaveExcel } from "../../../api/GlobalFunction";
  import "./INCOMMING.scss";

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
  import { BiShow } from "react-icons/bi";
  import { GrStatusGood } from "react-icons/gr";
  import { FcCancel } from "react-icons/fc";
import { UserData } from "../../../redux/slices/globalSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

  interface IQC_INCOMMING_DATA {
    id?: number,
    IQC1_ID: number,
    M_CODE: string,
    M_LOT_NO: string,
    LOT_CMS: string,
    LOT_VENDOR: string,
    CUST_CD: string,
    CUST_NAME_KD: string
    EXP_DATE: string,
    INPUT_LENGTH: number,
    TOTAL_ROLL: number,
    NQ_CHECK_ROLL: number,
    DTC_ID: number,
    TEST_EMPL: string,
    TOTAL_RESULT: string,
    AUTO_JUDGEMENT: string,
    NGOAIQUAN: string,
    KICHTHUOC: string,
    THICKNESS: string,
    DIENTRO: string,
    CANNANG: string,
    KEOKEO: string,
    KEOKEO2: string,
    FTIR: string,
    MAIMON: string,
    XRF: string,
    SCANBARCODE: string,
    PHTHALATE: string,
    MAUSAC: string,
    SHOCKNHIET: string,
    TINHDIEN: string,
    NHIETAM: string,
    TVOC: string,
    DOBONG: string,
    INS_DATE: string,
    INS_EMPL: string,
    UPD_DATE: string,
    UPD_EMPL: string,
    REMARK: string,
  }
  interface DTC_DATA {
    DTC_ID: number,
    FACTORY: string,
    TEST_FINISH_TIME: string,
    TEST_EMPL_NO: string,
    G_CODE: string,
    PROD_REQUEST_NO: string,
    G_NAME: string,
    TEST_NAME: string,
    POINT_CODE: number,
    CENTER_VALUE: number,
    UPPER_TOR: number,
    LOWER_TOR: number,
    RESULT: number,
    TEST_TYPE_NAME: string,
    WORK_POSITION_NAME: string,
    SAMPLE_NO: number,
    REQUEST_DATETIME: string,
    REQUEST_EMPL_NO: string,
    M_CODE: string,
    M_NAME: string,
    SIZE: string,
    LOTCMS: string,
    TEST_CODE: number,
    TDS: string,
    TDS_EMPL: string,
    TDS_UPD_DATE: string, 
  }
  const INCOMMING = () => {    
    function CustomToolbarPOTable() {
      return (
        <GridToolbarContainer>      
          <IconButton className='buttonIcon'onClick={()=>{SaveExcel(inspectiondatatable,"Inspection Data Table")}}
          ><AiFillFileExcel color='green' size={25}/>SAVE</IconButton>          
          <GridToolbarQuickFilter/>  
         </GridToolbarContainer>
      );
    }

    const column_dtc_data = [
      { field: "TEST_NAME", headerName: "TEST_NAME", width: 80 },
      { field: "POINT_CODE", headerName: "POINT_CODE", width: 90 },
      { field: "DANHGIA", headerName: "DANH_GIA", width: 80 , renderCell: (params:any) => { 
        if(params.row.RESULT >= (params.row.CENTER_VALUE - params.row.LOWER_TOR) && params.row.RESULT <= (params.row.CENTER_VALUE + params.row.UPPER_TOR))    
        return <span style={{color: 'green'}}><b>OK</b></span>
        return <span style={{color: 'red'}}><b>NG</b></span>
      }}, 
      { field: "CENTER_VALUE", headerName: "CENTER_VALUE", width: 120 , renderCell: (params:any) => {     
        return <span><b>{params.row.CENTER_VALUE}</b></span>
      }},
      { field: "UPPER_TOR", headerName: "UPPER_TOR", width: 80 , renderCell: (params:any) => {     
        return <span><b>{params.row.UPPER_TOR}</b></span>
      }},
      { field: "LOWER_TOR", headerName: "LOWER_TOR", width: 80 , renderCell: (params:any) => {     
        return <span><b>{params.row.LOWER_TOR}</b></span>
      }},
      { field: "RESULT", headerName: "RESULT", width: 80 },   
     
      { field: "DTC_ID", headerName: "DTC_ID", width: 80 },
      { field: "PROD_REQUEST_NO", headerName: "YCSX", width: 80 },
      { field: "G_CODE", headerName: "G_CODE", width: 80 },
      { field: "G_NAME", headerName: "G_NAME", width: 200 , renderCell: (params:any) => {
        if(params.row.M_CODE !=='B0000035') return <span></span>
        return <span><b>{params.row.G_NAME}</b></span>
      }},
      { field: "M_CODE", headerName: "M_CODE", width: 80 , renderCell: (params:any) => {
        if(params.row.M_CODE ==='B0000035') return <span></span>
        return <span><b>{params.row.M_CODE}</b></span>
      }},
      { field: "M_NAME", headerName: "TEN LIEU", width: 150 , renderCell: (params:any) => {
        if(params.row.M_CODE ==='B0000035') return <span></span>
        return <span><b>{params.row.M_NAME}</b></span>
      }},        
      { field: "FACTORY", headerName: "FACTORY", width: 80 },
      { field: "TEST_FINISH_TIME", headerName: "TEST_FINISH_TIME", width: 145 },
      { field: "TEST_EMPL_NO", headerName: "NV TEST", width: 100 },
      { field: "TEST_TYPE_NAME", headerName: "TEST_TYPE_NAME", width: 140 },
      { field: "WORK_POSITION_NAME", headerName: "BO PHAN", width: 80 },
      { field: "SAMPLE_NO", headerName: "SAMPLE_NO", width: 80 },
      { field: "REQUEST_DATETIME", headerName: "NGAY YC", width: 145 },
      { field: "REQUEST_EMPL_NO", headerName: "NV YC", width: 80 },
      { field: "SIZE", headerName: "SIZE", width: 80 },
      { field: "LOTCMS", headerName: "LOTCMS", width: 80 },
      { field: "TEST_CODE", headerName: "TEST_CODE", width: 80 },
      { field: "TDS", headerName: "TDS", width: 80 },
      { field: "TDS_EMPL", headerName: "TDS_EMPL", width: 80 },
      { field: "TDS_UPD_DATE", headerName: "TDS_UPD_DATE", width: 80 },    
    ]
    const handletraDTCData = (dtc_id: number)=> { 
      generalQuery('dtcdata',{     
        ALLTIME: true,
        FROM_DATE: '',
        TO_DATE: '',
        G_CODE: '',
        G_NAME: '',
        M_NAME: '',
        M_CODE: '',      
        TEST_NAME: '0',
        PROD_REQUEST_NO: '',
        TEST_TYPE: '0',     
        ID: dtc_id
      })
      .then(response => {
          //console.log(response.data.data);
          if(response.data.tk_status !=='NG')
          {
            const loadeddata: DTC_DATA[] =  response.data.data.map((element:DTC_DATA,index: number)=> {
              return {
                ...element, 
                TEST_FINISH_TIME: moment.utc(element.TEST_FINISH_TIME).format('YYYY-MM-DD HH:mm:ss'),
                REQUEST_DATETIME: moment.utc(element.REQUEST_DATETIME).format('YYYY-MM-DD HH:mm:ss'),
                id: index
              }
            })         
            setDtcDataTable(loadeddata);           
          }
          else
          {
            Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
          }        
      })
      .catch(error => {
          console.log(error);
      });
    }

    const userData: UserData | undefined = useSelector(
      (state: RootState) => state.totalSlice.userData
    );
    const [testtype, setTestType] = useState("NVL");
    const [inputno, setInputNo] = useState("");
    const [checkNVL, setCheckNVL] = useState(
      userData?.SUBDEPTNAME === "IQC" ? true : false
    );
    const [request_empl, setrequest_empl] = useState("");
    const [remark, setReMark] = useState("");

    const [inspectiondatatable, setInspectionDataTable] = useState<Array<IQC_INCOMMING_DATA>>(
      []
    );
    const [dtcDataTable, setDtcDataTable] = useState<Array<DTC_DATA>>(
      []
    );
    const [selectedRowsData, setSelectedRowsData] = useState<Array<IQC_INCOMMING_DATA>>(
      []
    );
    const [empl_name, setEmplName] = useState("");
    const [reqDeptCode, setReqDeptCode] = useState("");
    const [m_name, setM_Name] = useState("");
    const [width_cd, setWidthCD] = useState(0);
    const [in_cfm_qty, setInCFMQTY] = useState(0);
    const [roll_qty, setRollQty] = useState(0);
    const [m_code, setM_Code] = useState("");
    const [dtc_id, setDtc_ID] = useState(0);
    const [cust_cd, setCust_Cd] = useState("");
    const [cust_name_kd, setCust_Name_KD] = useState("");
    const [vendorLot, setVendorLot] = useState("");
    const [exp_date, setEXP_DATE] = useState(moment().format('YYYY-MM-DD'));
    const [total_qty, setTotal_QTY] = useState(0);
    const [total_roll, setTotal_ROLL] = useState(0);
    const [nq_qty, setNQ_QTY] = useState(0);
    const [showhideinput, setShowHideInput] = useState(true);
    const setQCPASS = async (value: string) => {
      console.log(selectedRowsData);
      if (selectedRowsData.length > 0) {
        Swal.fire({
          title: "Tra cứu vật liệu Holding",
          text: "Đang tải dữ liệu, hãy chờ chút",
          icon: "info",
          showCancelButton: false,
          allowOutsideClick: false,
          confirmButtonText: "OK",
          showConfirmButton: false,
        });
        let err_code: string = "";
        for (let i = 0; i < selectedRowsData.length; i++) {
          await generalQuery("updateQCPASSI222", {
            M_CODE: selectedRowsData[i].M_CODE,
            LOT_CMS:  selectedRowsData[i].LOT_CMS,            
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
          await generalQuery("updateIQC1Table", {
            M_CODE: selectedRowsData[i].M_CODE,
            LOT_CMS:  selectedRowsData[i].LOT_CMS,            
            VALUE: value==='Y'? 'OK':'NG',
            IQC1_ID: selectedRowsData[i].IQC1_ID,
            REMARK: selectedRowsData[i].REMARK,
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
          handletraIQC1Data();
        } else {
          Swal.fire("Thông báo", "Lỗi: " + err_code, "error");
        }
      } else {
        Swal.fire("Thông báo", "Chọn ít nhất 1 dòng để thực hiện", "error");
      }
    };
    const materialDataTable = React.useMemo(
      () => (
        <div className='datatb'>
          <div className="menubar">
          <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    setShowHideInput((pre) => !pre);
                    setInspectionDataTable([]);
                    setDtcDataTable([]);
                  }}
                >
                  <BiShow color='blue' size={25} />
                  Show/Hide Input
                </IconButton>
                <span style={{ fontSize: 20, fontWeight: "bold" }}>
                  BẢNG NHẬP THÔNG TIN LIỆU INCOMMING
                </span>
                <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    handletraIQC1Data();
                    setShowHideInput(false);
                  }}
                >
                  <AiOutlineSearch color='red' size={25} />
                  Tra Data
                </IconButton>
                <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    if (userData?.SUBDEPTNAME === "IQC") {
                      setQCPASS("Y");
                    } else {
                      Swal.fire(
                        "Thông báo",
                        "Bạn không phải người bộ phận IQC",
                        "error"
                      );
                    }
                    //checkBP(userData?.EMPL_NO,userData?.MAINDEPTNAME,['QC'], ()=>{setQCPASS('Y');});
                    //checkBP(userData?.EMPL_NO,userData?.MAINDEPTNAME,['QLSX'], setQCPASS('Y'));
                    //setQCPASS('Y');
                  }}
                >
                  <GrStatusGood color='green' size={25} />
                  SET PASS
                </IconButton>
                <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    if (userData?.SUBDEPTNAME === "IQC") {
                      setQCPASS("N");
                    } else {
                      Swal.fire(
                        "Thông báo",
                        "Bạn không phải người bộ phận IQC",
                        "error"
                      );
                    }
                    //checkBP(userData?.EMPL_NO,userData?.MAINDEPTNAME,['QC'], ()=>{setQCPASS('Y');});
                    //checkBP(userData?.EMPL_NO,userData?.MAINDEPTNAME,['QLSX'], setQCPASS('N'));
                    //setQCPASS('N');
                  }}
                >
                  <FcCancel color='red' size={25} />
                  RESET PASS
                </IconButton>

          </div>
          <DataGrid
            style={{fontSize:'0.7rem'}}
            autoNavigateToFocusedRow={true}
            allowColumnReordering={true}
            allowColumnResizing={true}
            columnAutoWidth={false}
            cellHintEnabled={true}
            columnResizingMode={"widget"}
            showColumnLines={true}
            dataSource={inspectiondatatable}
            columnWidth='auto'
            keyExpr='id'
            height={"70vh"}
            showBorders={false}            
            onSelectionChanged={(e) => {
              ///console.log(e.selectedRowsData);
              //setSelectedRowsData(e.selectedRowsData);
              setSelectedRowsData(e.selectedRowsData);
            }}
            onRowClick={(e:any) => {
              //console.log(e.data);
              handletraDTCData(e.data.DTC_ID);
            }}
          >
            <Scrolling
              useNative={true}
              scrollByContent={true}
              scrollByThumb={true}
              showScrollbar='onHover'
              mode='virtual'
            />
            <Selection mode='multiple' selectAllMode='allPages' />
            <Editing
              allowUpdating={true}
              allowAdding={false}
              allowDeleting={false}
              mode='cell'
              confirmDelete={true}
              onChangesChange={(e) => {}}
            />
            <Export enabled={true} />
            <Toolbar disabled={false}>
              <Item location='before'>
                <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    SaveExcel(inspectiondatatable, "SPEC DTC");
                  }}
                >
                  <AiFillFileExcel color='green' size={25} />
                  SAVE
                </IconButton>
               
              </Item>
              <Item name='searchPanel' />
              <Item name='exportButton' />
              <Item name='columnChooserButton' />
              <Item name='addRowButton' />
              <Item name='saveButton' />
              <Item name='revertButton' />
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
              infoText='Page #{0}. Total: {1} ({2} items)'
              displayMode='compact'
            />
            <Column dataField='IQC1_ID' caption='IQC1_ID' width={100} allowEditing={false}></Column>
            <Column dataField='M_CODE' caption='M_CODE' width={100} allowEditing={false}></Column>
            <Column dataField='M_LOT_NO' caption='M_LOT_NO' width={100} allowEditing={false}></Column>
            <Column dataField='LOT_CMS' caption='LOT_CMS' width={100} allowEditing={false}></Column>
            <Column dataField='LOT_VENDOR' caption='LOT_VENDOR' width={100}></Column>
            <Column dataField='CUST_CD' caption='CUST_CD' width={100} allowEditing={false}></Column>
            <Column dataField='CUST_NAME_KD' caption='VENDOR NAME' width={120} allowEditing={false}></Column>
            <Column dataField='EXP_DATE' caption='EXP_DATE' width={150}></Column>
            <Column dataField='INPUT_LENGTH' caption='INPUT_LENGTH' width={100} allowEditing={false}></Column>
            <Column dataField='TOTAL_ROLL' caption='TOTAL_ROLL' width={100} allowEditing={false}></Column>
            <Column dataField='NQ_CHECK_ROLL' caption='NQ_CHECK_ROLL' width={100} allowEditing={false}></Column>
            <Column dataField='DTC_ID' caption='DTC_ID' width={100} allowEditing={false}></Column>
            <Column dataField='TEST_EMPL' caption='TEST_EMPL' width={100} allowEditing={false}></Column>
            <Column dataField='TOTAL_RESULT' caption='TOTAL_RESULT' width={100} cellRender={(e: any) =>{
                if(e.data.TOTAL_RESULT ==='OK')
                {
                    return (
                        <div style={{color:'white', fontWeight:'bold', backgroundColor:'green', textAlign:'center'}}>OK</div>
                    )
                }
                else if(e.data.TOTAL_RESULT === 'NG')
                {
                    return (
                        <div style={{color:'white', fontWeight:'bold', backgroundColor:'red', textAlign:'center'}}>NG</div>
                    )
                }
                else
                {
                    return (
                        <div style={{color:'white', fontWeight:'bold', backgroundColor:'gray', textAlign:'center'}}>N/A</div>
                    )
                }

            }} allowEditing={false}></Column>
            <Column dataField='AUTO_JUDGEMENT' caption='AUTO_JUDGEMENT' width={100} cellRender={(e: any) =>{
                if(e.data.AUTO_JUDGEMENT ==='OK')
                {
                    return (
                        <div style={{color:'white', fontWeight:'bold', backgroundColor:'green', textAlign:'center'}}>OK</div>
                    )
                }
                else if(e.data.AUTO_JUDGEMENT === 'NG')
                {
                    return (
                        <div style={{color:'white', fontWeight:'bold', backgroundColor:'red', textAlign:'center'}}>NG</div>
                    )
                }

            }} allowEditing={false}></Column>
            <Column dataField='NGOAIQUAN' caption='NGOAIQUAN' width={100}  cellRender={(e: any) =>{
                if(e.data.NGOAIQUAN ===1)
                {
                    return (
                        <span style={{color:'green', fontWeight:'bold'}}>OK</span>
                    )
                }
                else if(e.data.NGOAIQUAN === 0)
                {
                    return (
                        <span style={{color:'red', fontWeight:'bold'}}>NG</span>
                    )
                }
                else
                {
                    return (
                        <span style={{color:'gray', fontWeight:'bold'}}>N/A</span>
                    )
                }

            }} allowEditing={false}></Column>
            <Column dataField='KICHTHUOC' caption='KICHTHUOC' width={100} cellRender={(e: any) =>{
                if(e.data.KICHTHUOC ===1)
                {
                    return (
                        <span style={{color:'green', fontWeight:'bold'}}>OK</span>
                    )
                }
                else if(e.data.KICHTHUOC === 0)
                {
                    return (
                        <span style={{color:'red', fontWeight:'bold'}}>NG</span>
                    )
                }
                else
                {
                    return (
                        <span style={{color:'gray', fontWeight:'bold'}}>N/A</span>
                    )
                }

            }} allowEditing={false}></Column>
            <Column dataField='THICKNESS' caption='THICKNESS' width={100} cellRender={(e: any) =>{
                if(e.data.THICKNESS ===1)
                {
                    return (
                        <span style={{color:'green', fontWeight:'bold'}}>OK</span>
                    )
                }
                else if(e.data.THICKNESS === 0)
                {
                    return (
                        <span style={{color:'red', fontWeight:'bold'}}>NG</span>
                    )
                }
                else
                {
                    return (
                        <span style={{color:'gray', fontWeight:'bold'}}>N/A</span>
                    )
                }

            }} allowEditing={false}></Column>
            <Column dataField='DIENTRO' caption='DIENTRO' width={100} cellRender={(e: any) =>{
                if(e.data.DIENTRO ===1)
                {
                    return (
                        <span style={{color:'green', fontWeight:'bold'}}>OK</span>
                    )
                }
                else if(e.data.DIENTRO === 0)
                {
                    return (
                        <span style={{color:'red', fontWeight:'bold'}}>NG</span>
                    )
                }
                else
                {
                    return (
                        <span style={{color:'gray', fontWeight:'bold'}}>N/A</span>
                    )
                }

            }} allowEditing={false}></Column>
            <Column dataField='CANNANG' caption='CANNANG' width={100} cellRender={(e: any) =>{
                if(e.data.CANNANG ===1)
                {
                    return (
                        <span style={{color:'green', fontWeight:'bold'}}>OK</span>
                    )
                }
                else if(e.data.CANNANG === 0)
                {
                    return (
                        <span style={{color:'red', fontWeight:'bold'}}>NG</span>
                    )
                }
                else
                {
                    return (
                        <span style={{color:'gray', fontWeight:'bold'}}>N/A</span>
                    )
                }

            }} allowEditing={false}></Column>
            <Column dataField='KEOKEO' caption='KEOKEO' width={100} cellRender={(e: any) =>{
                if(e.data.KEOKEO ===1)
                {
                    return (
                        <span style={{color:'green', fontWeight:'bold'}}>OK</span>
                    )
                }
                else if(e.data.KEOKEO === 0)
                {
                    return (
                        <span style={{color:'red', fontWeight:'bold'}}>NG</span>
                    )
                }
                else
                {
                    return (
                        <span style={{color:'gray', fontWeight:'bold'}}>N/A</span>
                    )
                }

            }} allowEditing={false}></Column>
            <Column dataField='KEOKEO2' caption='KEOKEO2' width={100} cellRender={(e: any) =>{
                if(e.data.KEOKEO2 ===1)
                {
                    return (
                        <span style={{color:'green', fontWeight:'bold'}}>OK</span>
                    )
                }
                else if(e.data.KEOKEO2 === 0)
                {
                    return (
                        <span style={{color:'red', fontWeight:'bold'}}>NG</span>
                    )
                }
                else
                {
                    return (
                        <span style={{color:'gray', fontWeight:'bold'}}>N/A</span>
                    )
                }

            }} allowEditing={false}></Column>
            <Column dataField='FTIR' caption='FTIR' width={100} cellRender={(e: any) =>{
                if(e.data.FTIR ===1)
                {
                    return (
                        <span style={{color:'green', fontWeight:'bold'}}>OK</span>
                    )
                }
                else if(e.data.FTIR === 0)
                {
                    return (
                        <span style={{color:'red', fontWeight:'bold'}}>NG</span>
                    )
                }
                else
                {
                    return (
                        <span style={{color:'gray', fontWeight:'bold'}}>N/A</span>
                    )
                }

            }} allowEditing={false}></Column>
            <Column dataField='MAIMON' caption='MAIMON' width={100} cellRender={(e: any) =>{
                if(e.data.MAIMON ===1)
                {
                    return (
                        <span style={{color:'green', fontWeight:'bold'}}>OK</span>
                    )
                }
                else if(e.data.MAIMON === 0)
                {
                    return (
                        <span style={{color:'red', fontWeight:'bold'}}>NG</span>
                    )
                }
                else
                {
                    return (
                        <span style={{color:'gray', fontWeight:'bold'}}>N/A</span>
                    )
                }

            }} allowEditing={false}></Column>
            <Column dataField='XRF' caption='XRF' width={100} cellRender={(e: any) =>{
                if(e.data.XRF ===1)
                {
                    return (
                        <span style={{color:'green', fontWeight:'bold'}}>OK</span>
                    )
                }
                else if(e.data.XRF === 0)
                {
                    return (
                        <span style={{color:'red', fontWeight:'bold'}}>NG</span>
                    )
                }
                else
                {
                    return (
                        <span style={{color:'gray', fontWeight:'bold'}}>N/A</span>
                    )
                }

            }} allowEditing={false}></Column>
            <Column dataField='SCANBARCODE' caption='SCANBARCODE' width={100} cellRender={(e: any) =>{
                if(e.data.SCANBARCODE ===1)
                {
                    return (
                        <span style={{color:'green', fontWeight:'bold'}}>OK</span>
                    )
                }
                else if(e.data.SCANBARCODE === 0)
                {
                    return (
                        <span style={{color:'red', fontWeight:'bold'}}>NG</span>
                    )
                }
                else
                {
                    return (
                        <span style={{color:'gray', fontWeight:'bold'}}>N/A</span>
                    )
                }

            }} allowEditing={false}></Column>
            <Column dataField='PHTHALATE' caption='PHTHALATE' width={100} cellRender={(e: any) =>{
                if(e.data.PHTHALATE ===1)
                {
                    return (
                        <span style={{color:'green', fontWeight:'bold'}}>OK</span>
                    )
                }
                else if(e.data.PHTHALATE === 0)
                {
                    return (
                        <span style={{color:'red', fontWeight:'bold'}}>NG</span>
                    )
                }
                else
                {
                    return (
                        <span style={{color:'gray', fontWeight:'bold'}}>N/A</span>
                    )
                }

            }} allowEditing={false}></Column>
            <Column dataField='MAUSAC' caption='MAUSAC' width={100} cellRender={(e: any) =>{
                if(e.data.MAUSAC ===1)
                {
                    return (
                        <span style={{color:'green', fontWeight:'bold'}}>OK</span>
                    )
                }
                else if(e.data.MAUSAC === 0)
                {
                    return (
                        <span style={{color:'red', fontWeight:'bold'}}>NG</span>
                    )
                }
                else
                {
                    return (
                        <span style={{color:'gray', fontWeight:'bold'}}>N/A</span>
                    )
                }

            }} allowEditing={false}></Column>
            <Column dataField='SHOCKNHIET' caption='SHOCKNHIET' width={100} cellRender={(e: any) =>{
                if(e.data.SHOCKNHIET ===1)
                {
                    return (
                        <span style={{color:'green', fontWeight:'bold'}}>OK</span>
                    )
                }
                else if(e.data.SHOCKNHIET === 0)
                {
                    return (
                        <span style={{color:'red', fontWeight:'bold'}}>NG</span>
                    )
                }
                else
                {
                    return (
                        <span style={{color:'gray', fontWeight:'bold'}}>N/A</span>
                    )
                }

            }} allowEditing={false}></Column>
            <Column dataField='TINHDIEN' caption='TINHDIEN' width={100} cellRender={(e: any) =>{
                if(e.data.TINHDIEN ===1)
                {
                    return (
                        <span style={{color:'green', fontWeight:'bold'}}>OK</span>
                    )
                }
                else if(e.data.TINHDIEN === 0)
                {
                    return (
                        <span style={{color:'red', fontWeight:'bold'}}>NG</span>
                    )
                }
                else
                {
                    return (
                        <span style={{color:'gray', fontWeight:'bold'}}>N/A</span>
                    )
                }

            }} allowEditing={false}></Column>
            <Column dataField='NHIETAM' caption='NHIETAM' width={100} cellRender={(e: any) =>{
                if(e.data.NHIETAM ===1)
                {
                    return (
                        <span style={{color:'green', fontWeight:'bold'}}>OK</span>
                    )
                }
                else if(e.data.NHIETAM === 0)
                {
                    return (
                        <span style={{color:'red', fontWeight:'bold'}}>NG</span>
                    )
                }
                else
                {
                    return (
                        <span style={{color:'gray', fontWeight:'bold'}}>N/A</span>
                    )
                }

            }} allowEditing={false}></Column>
            <Column dataField='TVOC' caption='TVOC' width={100} cellRender={(e: any) =>{
                if(e.data.TVOC ===1)
                {
                    return (
                        <span style={{color:'green', fontWeight:'bold'}}>OK</span>
                    )
                }
                else if(e.data.TVOC === 0)
                {
                    return (
                        <span style={{color:'red', fontWeight:'bold'}}>NG</span>
                    )
                }
                else
                {
                    return (
                        <span style={{color:'gray', fontWeight:'bold'}}>N/A</span>
                    )
                }

            }} allowEditing={false}></Column>
            <Column dataField='DOBONG' caption='DOBONG' width={100}  cellRender={(e: any) =>{
                if(e.data.DOBONG ===1)
                {
                    return (
                        <span style={{color:'green', fontWeight:'bold'}}>OK</span>
                    )
                }
                else if(e.data.DOBONG === 0)
                {
                    return (
                        <span style={{color:'red', fontWeight:'bold'}}>NG</span>
                    )
                }
                else
                {
                    return (
                        <span style={{color:'gray', fontWeight:'bold'}}>N/A</span>
                    )
                }

            }} allowEditing={false}></Column>
            <Column dataField='INS_DATE' caption='INS_DATE' width={100}  allowEditing={false}></Column>
            <Column dataField='INS_EMPL' caption='INS_EMPL' width={100}  allowEditing={false}></Column>
            <Column dataField='UPD_DATE' caption='UPD_DATE' width={100}  allowEditing={false}></Column>
            <Column dataField='UPD_EMPL' caption='UPD_EMPL' width={100}  allowEditing={false}></Column>
            <Column dataField='REMARK' caption='REMARK' width={150} allowEditing={true}></Column>

          </DataGrid>
        </div>
      ),
      [inspectiondatatable]
    );
    const handletraIQC1Data = () => {
      generalQuery("loadIQC1table", {})
        .then((response) => {
          //console.log(response.data.data);
          if (response.data.tk_status !== "NG") {
            const loadeddata: IQC_INCOMMING_DATA[] = response.data.data.map(
              (element: IQC_INCOMMING_DATA, index: number) => {
                return {
                  ...element,
                  INS_DATE:
                    element.INS_DATE === null
                      ? ""
                      : moment(element.INS_DATE)
                          .utc()
                          .format("YYYY-MM-DD HH:mm:ss"),
                  UPD_DATE:
                    element.UPD_DATE === null
                      ? ""
                      : moment(element.UPD_DATE)
                          .utc()
                          .format("YYYY-MM-DD HH:mm:ss"),                  
                  EXP_DATE:
                    element.EXP_DATE === null
                      ? ""
                      : moment(element.EXP_DATE)
                          .utc()
                          .format("YYYY-MM-DD HH:mm:ss"),                  
                  id: index,
                };
              }
            );
            setInspectionDataTable(loadeddata);
            Swal.fire(
              "Thông báo",
              "Đã load :" + loadeddata.length + " dòng",
              "success"
            );
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    const checkEMPL_NAME = (EMPL_NO: string) => {
      generalQuery("checkEMPL_NO_mobile", { EMPL_NO: EMPL_NO })
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            //console.log(response.data.data);
            setEmplName(
              response.data.data[0].MIDLAST_NAME +
                " " +
                response.data.data[0].FIRST_NAME
            );
            setReqDeptCode(response.data.data[0].WORK_POSITION_CODE);
          } else {
            setEmplName("");
            setReqDeptCode("");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    const checkLotNVL = (M_LOT_NO: string) => {
      generalQuery("checkMNAMEfromLotI222", { M_LOT_NO: M_LOT_NO })
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            //console.log(response.data.data);
            setM_Name(
              response.data.data[0].M_NAME +
                " | " +
                response.data.data[0].WIDTH_CD
            );
            setM_Code(response.data.data[0].M_CODE);
            setWidthCD(response.data.data[0].WIDTH_CD);
            setInCFMQTY(response.data.data[0].OUT_CFM_QTY);
            setRollQty(response.data.data[0].ROLL_QTY);
            setCust_Cd(response.data.data[0].CUST_CD);
            setCust_Name_KD(response.data.data[0].CUST_NAME_KD);

                generalQuery("checkMNAMEfromLotI222Total", { M_CODE: response.data.data[0].M_CODE, LOTCMS: M_LOT_NO.substring(0,6)})
                .then((response) => {
                if (response.data.tk_status !== "NG") {
                    //console.log(response.data.data);
                    setTotal_QTY(response.data.data[0].TOTAL_CFM_QTY);
                    setTotal_ROLL(response.data.data[0].TOTAL_ROLL);
                } else {
                    setTotal_QTY(0);
                    setTotal_ROLL(0);
                }
                })
                .catch((error) => {
                console.log(error);
                });
           
          } else {
            setM_Name("");
            setM_Code("");
            setWidthCD(0);
            setRollQty(0);
            setInCFMQTY(0);   
            setCust_Cd('');    
            setCust_Name_KD("");    
          }
        })
        .catch((error) => {
          console.log(error);
        });

     
    
    };
    const checkInput = (): boolean => {
      if (
        inputno !== "" &&       
        vendorLot !== "" &&
        request_empl !== "" &&
        exp_date !== "" &&
        nq_qty !== 0 &&
        dtc_id !== 0         
      ) {
        return true;
      } else {
        return false;
      }
    };
    const addRow = async () => {
      let temp_row: IQC_INCOMMING_DATA = {
        id: inspectiondatatable.length,       
        IQC1_ID: inspectiondatatable.length,
        M_CODE: m_code,
        M_LOT_NO: inputno,
        LOT_CMS: inputno.substring(0,6),
        LOT_VENDOR: vendorLot,
        CUST_CD: cust_cd,
        CUST_NAME_KD: cust_name_kd,
        EXP_DATE: exp_date,
        INPUT_LENGTH: total_qty,
        TOTAL_ROLL: total_roll,
        NQ_CHECK_ROLL: nq_qty,
        DTC_ID: dtc_id,
        TEST_EMPL: request_empl,
        TOTAL_RESULT: '',
        AUTO_JUDGEMENT:'',
        NGOAIQUAN: '',
        KICHTHUOC: '',
        THICKNESS: '',
        DIENTRO: '',
        CANNANG: '',
        KEOKEO: '',
        KEOKEO2: '',
        FTIR: '',
        MAIMON: '',
        XRF: '',
        SCANBARCODE: '',
        PHTHALATE: '',
        MAUSAC: '',
        SHOCKNHIET: '',
        TINHDIEN: '',
        NHIETAM: '',
        TVOC: '',
        DOBONG: '',
        INS_DATE: '',
        INS_EMPL: '',
        UPD_DATE: '',
        UPD_EMPL: '',
        REMARK: '',
      };      
      setInspectionDataTable((prev) => {
        return [...prev, temp_row];
      });
    };
    const insertIQC1Table = async ()=> {
        if(inspectiondatatable.length >0)
        {
            let err_code: string = '';
            for(let i=0;i<inspectiondatatable.length;i++)
            {
                await generalQuery("insertIQC1table", inspectiondatatable[i])
                // eslint-disable-next-line no-loop-func
                .then((response) => {
                if (response.data.tk_status !== "NG") {
                    //console.log(response.data.data);
                
                }
                else
                {
                    err_code += 'Lỗi : ' + response.data.message + ' | ';
                }
                })
                .catch((error) => {
                console.log(error);
                });

            }
            if(err_code ==='')
            {
                Swal.fire('Thông báo','Thêm data thành công','success');
            }
            else
            {
                Swal.fire('Thông báo','Lỗi: ' +  err_code,'error');
            }
            

        }
        else
        {
            Swal.fire('Thông báo','Thêm ít nhất 1 dòng để lưu','error');

        }



      
    }
    useEffect(() => {
      //handletraIQC1Data();
    }, []);
    return (
      <div className='incomming'>
        <div className='tracuuDataInspection'>
          <div className='maintable'>
            {showhideinput && (
              <div className='tracuuDataInspectionform'>
                <b style={{ color: "blue" }}>INPUT DATA KIỂM TRA INCOMMING</b>
                <div className='forminput'>
                  <div className='forminputcolumn'>                    
                    <b>LOT NVL CMS</b>
                    <label>
                      <input
                        type='text'
                        placeholder='202304190123'
                        value={inputno}
                        onChange={(e) => {
                          if (e.target.value.length >= 7) {
                            checkLotNVL(e.target.value);
                          }
                          setInputNo(e.target.value);
                        }}
                      ></input>
                    </label>
                    {m_name && (
                      <span
                        style={{
                          fontSize: 15,
                          fontWeight: "bold",
                          color: "blue",
                        }}
                      >
                        {m_name}
                      </span>
                    )}
                    <b>VENDOR LOT</b>
                    <label>
                      <input
                        type='text'
                        placeholder={"NVD1201"}
                        value={vendorLot}
                        onChange={(e) => {
                          setVendorLot(e.target.value);
                        }}
                      ></input>
                    </label>
                    <b>Hạn sử dụng</b>
                    <label>
                      <input
                        type='date'                       
                        value={exp_date}
                        onChange={(e) => {                          
                          setEXP_DATE(e.target.value);
                        }}
                      ></input>
                    </label>
                    
                    <b>Số Roll check ngoại quan</b>
                    <label>
                      <input
                        type='text'                       
                        value={nq_qty}
                        onChange={(e) => {                          
                          setNQ_QTY(Number(e.target.value));
                        }}
                      ></input>
                    </label>
                    <b>ID Test ngoại quan- độ tin cậy</b>
                    <label>
                      <input
                        type='text'                       
                        value={dtc_id}
                        onChange={(e) => {                          
                          setDtc_ID(Number(e.target.value));
                        }}
                      ></input>
                    </label>
                    <b>Mã nhân viên test IQC</b>
                    <label>
                      <input
                        type='text'
                        placeholder={"NVD1201"}
                        value={request_empl}
                        onChange={(e) => {
                          if (e.target.value.length >= 7) {
                            checkEMPL_NAME(e.target.value);
                          }
                          setrequest_empl(e.target.value);
                        }}
                      ></input>
                    </label>
                    {request_empl && (
                      <span
                        style={{
                          fontSize: 15,
                          fontWeight: "bold",
                          color: "blue",
                        }}
                      >
                        {empl_name}
                      </span>
                    )}
                  </div>
                  <b>Remark</b>
                  <div className='forminputcolumn'>
                    <label>
                      <input
                        type='text'
                        placeholder={"Ghi chú"}
                        value={remark}
                        onChange={(e) => {
                          setReMark(e.target.value);
                        }}
                      ></input>
                    </label>
                  </div>
                </div>
                <div className='formbutton'>
                  <button
                    className='tranhatky'
                    onClick={() => {
                      if (checkInput()) {
                       addRow();
                      } else {
                        Swal.fire(
                          "Thông báo",
                          "Hãy nhập đủ thông tin trước khi đăng ký",
                          "error"
                        );
                      }
                    }}
                  >
                    Add
                  </button>
                  <button
                    className='tranhatky'
                    onClick={() => {
                        insertIQC1Table();
                    }}
                  >
                    Save
                  </button>
                </div>
                <div
                  className='formbutton'
                  style={{ marginTop: "20px", display: "flex", flexWrap: "wrap" }}
                ></div>
              </div>
            )}
            <div className='tracuuYCSXTable'>{materialDataTable}</div>
            {!showhideinput && (
              <div className='tracuuDataInspectionform2'>
                <b style={{ color: "blue" }}>Kết quả ĐTC</b>
                <Datagrid2
                sx={{ fontSize: '0.7rem', flex: 1 }}
                components={{
                  Toolbar: CustomToolbarPOTable,                  
                }}               
                rowHeight={30}
                rows={dtcDataTable}
                columns={column_dtc_data}
                rowsPerPageOptions={[
                  5, 10, 50, 100, 500, 1000, 5000, 10000, 500000,
                ]}
                editMode='row'
              />
                
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  export default INCOMMING;
  
import { Autocomplete, IconButton, TextField,} from '@mui/material';
import moment from 'moment';
import React, { useContext, useEffect, useState, useTransition, } from 'react'
import {AiFillFileExcel,} from "react-icons/ai";
import Swal from 'sweetalert2';
import { generalQuery } from '../../../api/Api';
import { UserContext } from '../../../api/Context';
import { SaveExcel } from '../../../api/GlobalFunction';
import "./ADDSPECTDTC.scss"
import DataGrid, { Column, ColumnChooser, Editing, Export, FilterRow, Item, Pager, Paging, Scrolling, SearchPanel, Selection, Summary, Toolbar, TotalItem } from 'devextreme-react/data-grid';
interface DTC_SPEC_DATA {
  CUST_NAME_KD: string,
  G_CODE: string,
  G_NAME: string,
  TEST_NAME: string,
  POINT_NAME: string,
  PRI: number,
  CENTER_VALUE: number,
  UPPER_TOR: number,
  LOWER_TOR: number,
  MIN_SPEC: number,
  MAX_SPEC: number,
  BARCODE_CONTENT: string,
  REMARK: string,
  M_NAME: string,
  WIDTH_CD: number,
  M_CODE: string,  
  TDS: string,
  BANVE: string
}
interface  CodeListData {
    G_CODE: string, 
    G_NAME: string, 
    PROD_LAST_PRICE: number,
    USE_YN: string, 
  }

interface MaterialListData {
M_CODE: string;
M_NAME: string;
WIDTH_CD: number;
}

const ADDSPECTDTC = () => { 

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
    
  const [isPending, startTransition] = useTransition();
  const [codeList, setCodeList] = useState<CodeListData[]>([]);
  const [selectedCode, setSelectedCode] = useState<CodeListData|null>({
    G_CODE: '7C03925A', 
    G_NAME: 'GH63-18084A_A_SM-A515F', 
    PROD_LAST_PRICE: 0.318346,
    USE_YN: 'Y', 
  });
  const [userData, setUserData] = useContext(UserContext);
  const [fromdate, setFromDate] = useState(moment().format('YYYY-MM-DD'));
  const [todate, setToDate] = useState(moment().format('YYYY-MM-DD'));
  const [codeKD,setCodeKD] =useState('');
  const [codeCMS,setCodeCMS] =useState('');
  const [testname,setTestName] =useState('0');
  const [testtype,setTestType] =useState('0');
  const [prodrequestno,setProdRequestNo] =useState('');
  const [checkNVL, setCheckNVL] = useState(false); 
  const [id,setID] =useState('');
  const [inspectiondatatable, setInspectionDataTable] = useState<Array<any>>([]);
  const [m_name,setM_Name] =useState('');
  const [m_code,setM_Code] =useState('');
  const [selectedRows, setSelectedRows] = useState<number>(0);

  const getcodelist = (G_NAME: string) => {   
    generalQuery("selectcodeList", { G_NAME: G_NAME})
    .then((response) => {        
      if (response.data.tk_status !== "NG") {
        if(!isPending)
        {
          startTransition(() => {
          setCodeList(response.data.data); 
          });
        }              
      } 
      else {
      }
    })
    .catch((error) => {
      console.log(error);
    }); 
}

const getmateriallist = () => {
    generalQuery("getMaterialList", {})
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);
          setMaterialList(response.data.data);
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const materialDataTable = React.useMemo(
    () => (
      <div className='datatb'>       
        <DataGrid
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
          showBorders={true}
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
            showScrollbar='onHover'
            mode='virtual'
          />
          <Selection mode='multiple' selectAllMode='allPages' />
          <Editing
            allowUpdating={false}
            allowAdding={true}
            allowDeleting={false}
            mode='batch'
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
            <Item name='columnChooser' />
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
          <Column dataField='CUST_NAME_KD' caption='CUST_NAME_KD' width={100}></Column>
          <Column dataField='G_CODE' caption='G_CODE' width={100}></Column>
          <Column dataField='G_NAME' caption='G_NAME' width={150}></Column>
          <Column dataField='TEST_NAME' caption='TEST_NAME' width={100}></Column>
          <Column dataField='POINT_NAME' caption='POINT_NAME' width={100}></Column>
          <Column dataField='PRI' caption='PRI' width={100}></Column>
          <Column dataField='CENTER_VALUE' caption='CENTER_VALUE' width={120}></Column>
          <Column dataField='UPPER_TOR' caption='UPPER_TOR' width={120}></Column>
          <Column dataField='LOWER_TOR' caption='LOWER_TOR' width={120}></Column>
          <Column dataField='MIN_SPEC' caption='MIN_SPEC' width={120}></Column>
          <Column dataField='MAX_SPEC' caption='MAX_SPEC' width={120}></Column>
          <Column dataField='BARCODE_CONTENT' caption='BARCODE_CONTENT' width={100}></Column>
          <Column dataField='REMARK' caption='REMARK' width={100}></Column>
          <Column dataField='M_NAME' caption='M_NAME' width={120}></Column>
          <Column dataField='WIDTH_CD' caption='WIDTH_CD' width={100}></Column>
          <Column dataField='M_CODE' caption='M_CODE' width={100}></Column>
          <Column  caption='BANVE' width={150}  cellRender={(e: any) => {
              if (e.data.M_CODE === "B0000035") {
                let  link: string = `/banve/${e.data.G_CODE}.pdf`
                if(e.data.BANVE ==='Y')
                {
                  return (
                    <div
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        height: "20px",
                        width: "80px",
                        backgroundColor: "#54e00d",
                        textAlign: "center",
                      }}
                    >
                      <a href={link} target='_blank' rel="noopener noreferrer">Bản Vẽ</a>
                    </div>
                  );

                }
                else
                {
                  return (
                    <div
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        height: "20px",
                        width: "80px",
                        backgroundColor: "gray",
                        textAlign: "center",
                      }}
                    >
                      Chưa có bản vẽ
                    </div>
                  );
                }
                
              } else {
                let  link: string = `/tds/${e.data.M_CODE}.pdf`;
                if(e.data.TDS ==='Y')
                {
                  return (
                    <div
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        height: "20px",
                        width: "80px",
                        backgroundColor: "red",
                        textAlign: "center",
                      }}
                    >
                      <a href={link} target='_blank' rel="noopener noreferrer">TDS</a>
                    </div>
                  );

                }
                else
                {
                  return (
                    <div
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        height: "20px",
                        width: "80px",
                        backgroundColor: "gray",
                        textAlign: "center",
                      }}
                    >
                      Chưa có TDS
                    </div>
                  );

                }

                
              }
            }}></Column>
             <Summary>
              <TotalItem
                alignment='right'
                column='G_CODE'
                summaryType='count'
                valueFormat={"decimal"}
              />
            </Summary>
            
        </DataGrid>
      </div>
    ),
    [inspectiondatatable]
  );

  const handleSearchCodeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {                      
      handletraDTCData();
    }
  };



  const handletraDTCData = ()=> {     
    Swal.fire({
      title: "Tra cứu SPEC Vật liệu - Sản phẩm",
      text: "Đang tải dữ liệu, hãy chờ chút",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });
    generalQuery('dtcspec',{      
      checkNVL: checkNVL,      
      FROM_DATE: fromdate,
      TO_DATE: todate,
      G_CODE: codeCMS,
      G_NAME: codeKD,
      M_NAME: m_name,
      M_CODE: m_code,      
      TEST_NAME: testname,
      PROD_REQUEST_NO: prodrequestno,
      TEST_TYPE: testtype,     
      ID: id
    })
    .then(response => {
        //console.log(response.data.data);
        if(response.data.tk_status !=='NG')
        {
          const loadeddata: DTC_SPEC_DATA[] =  response.data.data.map((element:DTC_SPEC_DATA,index: number)=> {
            return {
              ...element, 
              id: index
            }
          })         
          setInspectionDataTable(loadeddata);
          Swal.fire("Thông báo", "Đã load " + response.data.data.length + " dòng", "success");  
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
  useEffect(()=>{      
    getcodelist('');
    getmateriallist();
  },[]);
  return (
    <div className='addspecdtc'>
      <div className='tracuuDataInspection'>
        <div className='tracuuDataInspectionform'>
          <div className='forminput'>            
            <div className='forminputcolumn'>              
              <label>                
                  <Autocomplete
                   hidden= {checkNVL}
                    disabled= {checkNVL}
                    size="small"
                    disablePortal                    
                    options={codeList}
                    className='autocomplete'   
                    isOptionEqualToValue={(option, value) => option.G_CODE === value.G_CODE}
                    getOptionLabel={(option:CodeListData) => `${option.G_CODE}: ${option.G_NAME}`}                     
                    renderInput={(params) => (
                     <TextField {...params} label='Chọn sản phẩm'/>
                    )}    
                    onChange={(event:any, newValue: CodeListData| null)=>{
                      console.log(newValue);
                      setSelectedCode(newValue);
                    }}  
                    value={selectedCode}   
                  />
                  </label>
              <label>                
                    <Autocomplete
                    hidden= {!checkNVL}
                    disabled={!checkNVL}
                    size='small'
                    disablePortal
                    options={materialList}
                    className='autocomplete'
                    isOptionEqualToValue={(option, value) =>
                    option.M_CODE === value.M_CODE
                    }
                    getOptionLabel={(option: MaterialListData) =>
                    `${option.M_NAME}|${option.WIDTH_CD}|${option.M_CODE}`
                    }
                    renderInput={(params) => (
                    <TextField {...params} label='Chọn NVL'/>
                    )}
                    defaultValue={{
                    M_CODE: "A0007770",
                    M_NAME: "SJ-203020HC",
                    WIDTH_CD: 208,
                    }}
                    value={selectedMaterial}
                    onChange={(event: any, newValue: MaterialListData | null) => {
                    console.log(newValue);
                    setSelectedMaterial(newValue);
                    }}
                />
                  </label>
                  <label>
                <b>Hạng mục test</b><br></br>
                <select
                  name='hangmuctest'
                  value={testname}
                  onChange={(e) => {
                    setTestName(e.target.value);
                  }}
                >
                  <option value='0'>ALL</option>
                  <option value='1'>Kích thước</option>
                  <option value='2'>Kéo keo</option>
                  <option value='3'>XRF</option>
                  <option value='4'>Điện trở</option>
                  <option value='5'>Tĩnh điện</option>
                  <option value='6'>Độ bóng</option>
                  <option value='7'>Phtalate</option>
                  <option value='8'>FTIR</option>
                  <option value='9'>Mài mòn</option>
                  <option value='10'>Màu sắc</option>
                  <option value='11'>TVOC</option>
                  <option value='12'>Cân nặng</option>
                  <option value='13'>Scanbarcode</option>
                  <option value='14'>Nhiệt cao Ẩm cao</option>
                  <option value='15'>Shock nhiệt</option>
                  <option value='1002'>Kéo keo 2 mặt</option>
                </select>
              </label>

             
            </div>           
            <div className='forminputcolumn'>              
              <label>
                <b>Số YCSX:</b>{" "}
                <input onKeyDown={(e)=> {handleSearchCodeKeyDown(e);} }
                  type='text'
                  placeholder='1H23456'
                  value={prodrequestno}
                  onChange={(e) => setProdRequestNo(e.target.value)}
                ></input>
              </label>
            </div>
            <div className='forminputcolumn'> 
            </div>
          </div>
          <div className='formbutton'>
            <label>
              <b>{checkNVL === true? 'Nguyên vật liệu (bỏ tick để chọn Sản phẩm)': 'Sản phẩm (tick để chọn NVL)'}:</b>
              <input onKeyDown={(e)=> {handleSearchCodeKeyDown(e);} }
                type='checkbox'
                name='alltimecheckbox'
                defaultChecked={checkNVL}
                onChange={() => setCheckNVL(!checkNVL)}
              ></input>
            </label>
            <button
              className='tranhatky'
              onClick={() => {
                handletraDTCData();
              }}
            >
              Add Spec DTC
            </button>
          </div>
        </div>
        <div className='tracuuYCSXTable'>
          {materialDataTable}
        </div>
      </div>
    </div>
  );
}
export default ADDSPECTDTC
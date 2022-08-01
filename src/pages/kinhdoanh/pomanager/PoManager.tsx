import { Button,  LinearProgress } from '@mui/material';
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { generalQuery } from '../../../api/Api';
import { SaveExcel } from '../../../api/GlobalFunction';
import "./PoManager.scss"



interface POTableData {
  PO_ID: number;
  CUST_NAME_KD: string;
  PO_NO: string;
  G_NAME: string;
  G_NAME_KD: string;
  G_CODE: string;
  PO_DATE: string;
  RD_DATE: string;
  PROD_PRICE: string;
  PO_QTY: number;
  TOTAL_DELIVERED: number;
  PO_BALANCE: number;
  PO_AMOUNT: number;
  DELIVERED_AMOUNT: number;
  BALANCE_AMOUNT: number;
  TON_KIEM: number;
  BTP: number;
  TP: number;
  BLOCK_QTY: number;
  GRAND_TOTAL_STOCK: number;
  EMPL_NAME: string;
  PROD_TYPE: string;
  M_NAME_FULLBOM: string;
  PROD_MAIN_MATERIAL: string;
  CUST_CD: string;
  EMPL_NO: string;
  POMONTH: string;
  POWEEKNUM: string;
  OVERDUE: string;
  REMARK: string;
}

interface POSummaryData {
  total_po_qty :number,
  total_delivered_qty: number,
  total_pobalance_qty: number,
  total_po_amount :number,
  total_delivered_amount: number,
  total_pobalance_amount: number,
}

const PoManager = () => {
  const [uploadExcelJson, setUploadExcelJSon] = useState<Array<any>>([]);
  const [isLoading, setisLoading] = useState(false);   
  const [column_excel, setColumn_Excel]= useState<Array<any>>([]);
  const [fromdate, setFromDate] = useState(moment().format('YYYY-MM-DD'));
  const [todate, setToDate] = useState(moment().format('YYYY-MM-DD'));
  const [codeKD,setCodeKD] =useState('');
  const [codeCMS,setCodeCMS] =useState('');
  const [empl_name,setEmpl_Name] =useState('');
  const [cust_name,setCust_Name] =useState('');
  const [prod_type,setProdType] =useState('');
  const [id,setID] =useState('');
  const [alltime, setAllTime] = useState(true); 
  const [justpobalance, setJustPOBalance] = useState(true); 
  const [poSummary, setPoSummary] = useState<POSummaryData>({
    total_po_qty :0,
    total_delivered_qty: 0,
    total_pobalance_qty: 1000000,
    total_po_amount :0,
    total_delivered_amount: 0,
    total_pobalance_amount: 0,
  });


  const [po_no,setPo_No] =useState('');
  const [material,setMaterial] =useState('');
  const [over,setOver] =useState('');
  const [invoice_no,setInvoice_No] =useState('');

  const [podatatable, setPoDataTable] = useState<Array<POTableData>>([]);
  const column_potable = [
    { field: "PO_ID", headerName: "PO_ID", width: 100 },
    { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 200 },
    { field: "PO_NO", headerName: "PO_NO", width: 110 },
    { field: "G_NAME", headerName: "G_NAME", width: 310,},
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 230 },
    { field: "G_CODE", headerName: "G_CODE", width: 110 },
    { field: "PO_DATE", headerName: "PO_DATE", width: 110 },
    { field: "RD_DATE", headerName: "RD_DATE", width: 110 },
    { field: "PROD_PRICE", headerName: "PROD_PRICE", width: 110 , renderCell: (params:any) => {return <span style={{color:'gray'}}><b>{params.row.PROD_PRICE.toLocaleString('en-US' ,{style:'decimal',maximumFractionDigits:8})}</b></span>}},
    { field: "PO_QTY", headerName: "PO_QTY", width: 110 , renderCell: (params:any) => {return <span style={{color:'blue'}}><b>{params.row.PO_QTY.toLocaleString('en-US')}</b></span>} },
    { field: "TOTAL_DELIVERED", headerName: "TOTAL_DELIVERED", width: 110 , renderCell: (params:any) => {return <span style={{color:'blue'}}><b>{params.row.TOTAL_DELIVERED.toLocaleString('en-US')}</b></span>} },
    { field: "PO_BALANCE", headerName: "PO_BALANCE", width: 110 , renderCell: (params:any) => {return <span style={{color:'blue'}}><b>{params.row.PO_BALANCE.toLocaleString('en-US')}</b></span>} },
    { field: "PO_AMOUNT", headerName: "PO_AMOUNT", width: 110, renderCell: (params:any) => {return <span style={{color:'green'}}><b>{params.row.PO_AMOUNT.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</b></span>}  },
    { field: "DELIVERED_AMOUNT", headerName: "DELIVERED_AMOUNT", width: 110, renderCell: (params:any) => {return <span style={{color:'green'}}><b>{params.row.DELIVERED_AMOUNT.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</b></span>}  },
    { field: "BALANCE_AMOUNT", headerName: "BALANCE_AMOUNT", width: 110, renderCell: (params:any) => {return <span style={{color:'green'}}><b>{params.row.BALANCE_AMOUNT.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</b></span>}  },
    { field: "TON_KIEM", headerName: "TON_KIEM", width: 110, renderCell: (params:any) => {return <span>{params.row.TON_KIEM.toLocaleString('en-US')}</span>}  },
    { field: "BTP", headerName: "BTP", width: 110, renderCell: (params:any) => {return <span>{params.row.BTP.toLocaleString('en-US')}</span>}   },
    { field: "TP", headerName: "TP", width: 110, renderCell: (params:any) => {return <span>{params.row.TP.toLocaleString('en-US')}</span>}   },
    { field: "BLOCK_QTY", headerName: "BLOCK_QTY", width: 110, renderCell: (params:any) => {return <span>{params.row.BLOCK_QTY.toLocaleString('en-US')}</span>}   },
    { field: "GRAND_TOTAL_STOCK", headerName: "GRAND_TOTAL_STOCK", width: 110 , renderCell: (params:any) => {return <span><b>{params.row.GRAND_TOTAL_STOCK.toLocaleString('en-US')}</b></span>}  },
    { field: "EMPL_NAME", headerName: "EMPL_NAME", width: 210 },
    { field: "PROD_TYPE", headerName: "PROD_TYPE", width: 110 },
    { field: "M_NAME_FULLBOM", headerName: "M_NAME_FULLBOM", width: 510 },
    { field: "PROD_MAIN_MATERIAL", headerName: "PROD_MAIN_MATERIAL", width: 110},
    { field: "POMONTH", headerName: "POMONTH", width: 80 },
    { field: "POWEEKNUM", headerName: "POWEEKNUM", width: 80 },
    { field: "OVERDUE", headerName: "OVERDUE", width: 80 },
    { field: "REMARK", headerName: "REMARK", width: 110 },
  ];


  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />           
        <button className='saveexcelbutton' onClick={()=>{SaveExcel(uploadExcelJson,"Uploaded PO")}}>Save Excel</button>
        <GridToolbarQuickFilter/>
      </GridToolbarContainer>
    );
  }
  function CustomToolbarPOTable() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />           
        <button className='saveexcelbutton' onClick={()=>{SaveExcel(podatatable,"PO Table")}}>Save Excel</button>
        <GridToolbarQuickFilter/>
      </GridToolbarContainer>
    );
  }


  const readUploadFile = (e:any) => {
    e.preventDefault();    
    if (e.target.files) {
        const reader = new FileReader();
        reader.onload = (e:any) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json:any = XLSX.utils.sheet_to_json(worksheet); 
            const keys = Object.keys(json[0]);
            let uploadexcelcolumn = keys.map((element, index) => {
              return {
                 field: element, headerName: element, width: 150
              }
            });
            uploadexcelcolumn.push ({field: 'CHECKSTATUS', headerName: 'CHECKSTATUS', width: 350});

            setColumn_Excel(uploadexcelcolumn);
            setUploadExcelJSon(json.map((element:any, index:number) => {
              return {...element, id: index, CHECKSTATUS:'Waiting'}
            }
            ));
        };
        reader.readAsArrayBuffer(e.target.files[0]);        
    }
}

  const handletraPO = ()=> {
    setisLoading(true);
    generalQuery('traPODataFull',{
      alltime: alltime,
      justPoBalance: justpobalance,
      start_date: fromdate,
      end_date: todate,
      cust_name: cust_name,
      codeCMS: codeCMS,
      codeKD: codeKD,
      prod_type: prod_type,
      empl_name: empl_name,
      po_no: po_no,
      over:over,
      id: id,
      material: material,
    })
    .then(response => {
        //console.log(response.data.data);
        if(response.data.tk_status !=='NG')
        {
          const loadeddata: POTableData[] =  response.data.data.map((element:POTableData,index: number)=> {
            return {
              ...element,
              PO_DATE : element.PO_DATE.slice(0,10),
              RD_DATE : element.RD_DATE.slice(0,10),
            }
          })
          
          let po_summary_temp: POSummaryData = {
            total_po_qty :0,
            total_delivered_qty: 0,
            total_pobalance_qty: 0,
            total_po_amount :0,
            total_delivered_amount: 0,
            total_pobalance_amount: 0,
          }
          for(let i=0;i<loadeddata.length;i++)
          {
            po_summary_temp.total_po_qty += loadeddata[i].PO_QTY;
            po_summary_temp.total_delivered_qty += loadeddata[i].TOTAL_DELIVERED;
            po_summary_temp.total_pobalance_qty += loadeddata[i].PO_BALANCE;
            po_summary_temp.total_po_amount += loadeddata[i].PO_AMOUNT;
            po_summary_temp.total_delivered_amount += loadeddata[i].DELIVERED_AMOUNT;
            po_summary_temp.total_pobalance_amount += loadeddata[i].BALANCE_AMOUNT;            
          }
          setPoSummary(po_summary_temp);         
          setPoDataTable(loadeddata);
          setisLoading(false);
          Swal.fire("Thông báo", "Đã load " + response.data.data.length + " dòng", "success");  
        }
        else
        {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");  
          setisLoading(false);
        }        
    })
    .catch(error => {
        console.log(error);
    });

  }


  const handle_checkPOHangLoat = async () => {
    let tempjson = uploadExcelJson;
    for (let i = 0; i < uploadExcelJson.length; i++) {
      let err_code:number = 0;

      await generalQuery("checkPOExist", {
        G_CODE: uploadExcelJson[i].G_CODE,
        CUST_CD: uploadExcelJson[i].CUST_CD,
        PO_NO: uploadExcelJson[i].PO_NO,
      })
        .then((response) => {
          console.log(response.data.tk_status);
          if (response.data.tk_status !== "NG") {
            
          } else {
            //tempjson[i].CHECKSTATUS = "NG: Đã tồn tại PO";
            err_code = 1;
          }
        })
        .catch((error) => {
          console.log(error);
        });

        let now = moment();
        let po_date = moment(uploadExcelJson[i].PO_DATE);

        if(now < po_date) {
          err_code =2;
          //tempjson[i].CHECKSTATUS = "NG: Ngày PO không được trước ngày hôm nay";
        }
        else
        {
          //tempjson[i].CHECKSTATUS = "OK";
        }


        await generalQuery("checkGCodeVer", {
          G_CODE: uploadExcelJson[i].G_CODE         
        })
          .then((response) => {
            console.log(response.data.tk_status);
            if (response.data.tk_status !== "NG") {
              console.log(response.data.data);
              if(response.data.data[0].USE_YN ==='Y')
              {
                //tempjson[i].CHECKSTATUS = "OK";
              }
              else
              {
                //tempjson[i].CHECKSTATUS = "NG: Ver này đã bị khóa";
                err_code =3;
              }
              
            } else {
              //tempjson[i].CHECKSTATUS = "NG: Không có code CMS này";
              err_code = 4;
            }
          })
          .catch((error) => {
            console.log(error);
          });
        
          if(err_code === 0)
          {
            tempjson[i].CHECKSTATUS = "OK";
          }
          else if(err_code ===1)
          {
            tempjson[i].CHECKSTATUS = "NG: Đã tồn tại PO";
          }
          else if(err_code ===2)
          {
            tempjson[i].CHECKSTATUS = "NG: Ngày PO không được trước ngày hôm nay";
          }
          else if(err_code ===3)
          {
            tempjson[i].CHECKSTATUS = "NG: Ver này đã bị khóa";
          }
          else if(err_code ===4)
          {
            tempjson[i].CHECKSTATUS = "NG: Không có code CMS này";
          }      
    }
    setUploadExcelJSon(tempjson);
  };
  const handle_upPOHangLoat = async () => {
    let tempjson = uploadExcelJson;
    for (let i = 0; i < uploadExcelJson.length; i++) {
      let err_code:number = 0;

      await generalQuery("checkPOExist", {
        G_CODE: uploadExcelJson[i].G_CODE,
        CUST_CD: uploadExcelJson[i].CUST_CD,
        PO_NO: uploadExcelJson[i].PO_NO,
      })
        .then((response) => {
          console.log(response.data.tk_status);
          if (response.data.tk_status !== "NG") {
            
          } else {
            //tempjson[i].CHECKSTATUS = "NG: Đã tồn tại PO";
            err_code = 1;
          }
        })
        .catch((error) => {
          console.log(error);
        });

        let now = moment();
        let po_date = moment(uploadExcelJson[i].PO_DATE);

        if(now < po_date) {
          err_code =2;
          //tempjson[i].CHECKSTATUS = "NG: Ngày PO không được trước ngày hôm nay";
        }
        else
        {
          //tempjson[i].CHECKSTATUS = "OK";
        }


        await generalQuery("checkGCodeVer", {
          G_CODE: uploadExcelJson[i].G_CODE         
        })
          .then((response) => {
            console.log(response.data.tk_status);
            if (response.data.tk_status !== "NG") {
              console.log(response.data.data);
              if(response.data.data[0].USE_YN ==='Y')
              {
                //tempjson[i].CHECKSTATUS = "OK";
              }
              else
              {
                //tempjson[i].CHECKSTATUS = "NG: Ver này đã bị khóa";
                err_code =3;
              }
              
            } else {
              //tempjson[i].CHECKSTATUS = "NG: Không có code CMS này";
              err_code = 4;
            }
          })
          .catch((error) => {
            console.log(error);
          });
        
          if(err_code === 0)
          {
            tempjson[i].CHECKSTATUS = "OK";
          }
          else if(err_code ===1)
          {
            tempjson[i].CHECKSTATUS = "NG: Đã tồn tại PO";
          }
          else if(err_code ===2)
          {
            tempjson[i].CHECKSTATUS = "NG: Ngày PO không được trước ngày hôm nay";
          }
          else if(err_code ===3)
          {
            tempjson[i].CHECKSTATUS = "NG: Ver này đã bị khóa";
          }
          else if(err_code ===4)
          {
            tempjson[i].CHECKSTATUS = "NG: Không có code CMS này";
          }      
    }
    setUploadExcelJSon(tempjson);
  };



  useEffect(()=>{
        

  },[]);

  return (
    <div className='pomanager'>
      <div className='mininavbar'>
        <div className='mininavitem'>
          <span className='mininavtext'>Tra cứu PO</span>
        </div>
        <div className='mininavitem'>
          <span className='mininavtext'>Thêm 1 PO</span>
        </div>
        <div className='mininavitem'>
          <span className='mininavtext'>Thêm PO hàng loạt</span>
        </div>
        <div className='mininavitem'>
          <span className='mininavtext'>Sửa PO</span>
        </div>
      </div>
      {true && (
        <div className='newpo'>
          <h3>Thêm PO Hàng Loạt</h3><br></br>
          <div className='batchnewpo'>
            <form className='formupload'>              
              <label htmlFor='upload'>Chọn file Excel: </label>
              <button onClick={(e)=> {e.preventDefault(); handle_checkPOHangLoat();}}>Test</button>
              <input
                type='file'
                name='upload'
                id='upload'
                onChange={(e: any) => {
                  readUploadFile(e);
                }}
              />
            </form>
            <div className='insertPOTable'>
              {true && (
                <DataGrid
                  components={{
                    Toolbar: CustomToolbar,
                    LoadingOverlay: LinearProgress,
                  }}
                  loading={isLoading}
                  rowHeight={35}
                  rows={uploadExcelJson}
                  columns={column_excel}
                  rowsPerPageOptions={[
                    5, 10, 50, 100, 500, 1000, 5000, 10000, 100000,
                  ]}
                  editMode='row'
                  getRowHeight={() => "auto"}
                />
              )}
            </div>
          </div>
          <div className='singlenewpo'></div>
        </div>
      )}
      { false && <div className='tracuuPO'>
        <div className='tracuuPOform'>         
          <div className='forminput'>
            <div className='forminputcolumn'>
              <label>
                <b>Từ ngày:</b>
                <input
                  type='date'
                  value={fromdate.slice(0, 10)}
                  onChange={(e) => setFromDate(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Tới ngày:</b>{" "}
                <input
                  type='date'
                  value={todate.slice(0, 10)}
                  onChange={(e) => setToDate(e.target.value)}
                ></input>
              </label>
            </div>
            <div className='forminputcolumn'>
              <label>
                <b>Code KD:</b>{" "}
                <input
                  type='text'
                  placeholder='GH63-xxxxxx'
                  value={codeKD}
                  onChange={(e) => setCodeKD(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Code CMS:</b>{" "}
                <input
                  type='text'
                  placeholder='7C123xxx'
                  value={codeCMS}
                  onChange={(e) => setCodeCMS(e.target.value)}
                ></input>
              </label>
            </div>
            <div className='forminputcolumn'>
              <label>
                <b>Tên nhân viên:</b>{" "}
                <input
                  type='text'
                  placeholder='Trang'
                  value={empl_name}
                  onChange={(e) => setEmpl_Name(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Khách:</b>{" "}
                <input
                  type='text'
                  placeholder='SEVT'
                  value={cust_name}
                  onChange={(e) => setCust_Name(e.target.value)}
                ></input>
              </label>
            </div>
            <div className='forminputcolumn'>
              <label>
                <b>Loại sản phẩm:</b>{" "}
                <input
                  type='text'
                  placeholder='TSP'
                  value={prod_type}
                  onChange={(e) => setProdType(e.target.value)}
                ></input>
              </label>
              <label>
                <b>ID:</b>{" "}
                <input
                  type='text'
                  placeholder='12345'
                  value={id}
                  onChange={(e) => setID(e.target.value)}
                ></input>
              </label>
            </div>
            <div className='forminputcolumn'>
              <label>
                <b>PO NO:</b>{" "}
                <input
                  type='text'
                  placeholder='123abc'
                  value={po_no}
                  onChange={(e) => setPo_No(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Vật liệu:</b>{" "}
                <input
                  type='text'
                  placeholder='SJ-203020HC'
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                ></input>
              </label>
            </div>
            <div className='forminputcolumn'>
              <label>
                <b>Over/OK:</b>{" "}
                <input
                  type='text'
                  placeholder='OVER'
                  value={over}
                  onChange={(e) => setOver(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Invoice No:</b>{" "}
                <input
                  type='text'
                  placeholder='số invoice'
                  value={invoice_no}
                  onChange={(e) => setInvoice_No(e.target.value)}
                ></input>
              </label>
            </div>
          </div>
          <div className='formbutton'>
            <label>
              <b>All Time:</b>
              <input
                type='checkbox'
                name='alltimecheckbox'
                defaultChecked={alltime}
                onChange={() => setAllTime(!alltime)}
              ></input>
            </label>
            <label>
              <b>Chỉ PO Tồn:</b>
              <input
                type='checkbox'
                name='pobalancecheckbox'
                defaultChecked={justpobalance}
                onChange={() => setJustPOBalance(!justpobalance)}
              ></input>
            </label>
            <Button
              variant='contained'
              color='success'
              onClick={() => {
                handletraPO();
              }}
            >
              Search
            </Button>
          </div>
          <div className='formsummary'>
            <div className='summarygroup'>
              <div className="summaryvalue"><b>PO QTY: {poSummary.total_po_qty.toLocaleString('en-US')} EA</b></div>
              <div className="summaryvalue"><b>PO AMOUNT: {poSummary.total_po_amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</b></div>             
            </div>
            <div className='summarygroup'>
            <div className="summaryvalue"><b>DELIVERED QTY: {poSummary.total_delivered_qty.toLocaleString('en-US')} EA</b></div>             
              <div className="summaryvalue"><b>DELIVERED AMOUNT: {poSummary.total_delivered_amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</b></div>              
            </div>
            <div className='summarygroup'>
            <div className="summaryvalue"><b>PO BALANCE QTY: {poSummary.total_pobalance_qty.toLocaleString('en-US')} EA</b></div>
            <div className="summaryvalue"><b>PO BALANCE AMOUNT: {poSummary.total_pobalance_amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</b></div>             
            </div>
          </div>
        </div>
        <div className='tracuuPOTable'>         
            <DataGrid
              components={{
                Toolbar: CustomToolbarPOTable,
                LoadingOverlay: LinearProgress,
              }}
              loading={isLoading}
              rowHeight={30}
              rows={podatatable}
              columns={column_potable}
              rowsPerPageOptions={[
                5, 10, 50, 100, 500, 1000, 5000, 10000, 100000,
              ]}
              editMode='row'
              getRowId={(row) => row.PO_ID}
              checkboxSelection
              disableSelectionOnClick
              onSelectionModelChange={(ids) => {}}
            />          
        </div>
      </div>}
    </div>
  );
}


export default PoManager
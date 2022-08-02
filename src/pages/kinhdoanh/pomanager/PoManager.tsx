import { Autocomplete, Button,  LinearProgress, TextField } from '@mui/material';
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { generalQuery } from '../../../api/Api';
import { UserContext } from '../../../api/Context';
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
  const [selection, setSelection] = useState<any>({
    trapo: true,
    thempohangloat:false,
    them1po: false,
  });
  const [userData, setUserData] = useContext(UserContext);
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


  const column_excel2 = [
    { field: "CUST_CD", headerName: "CUST_CD", width: 120 },    
    { field: "G_CODE", headerName: "G_CODE", width: 120 },
    { field: "PO_NO", headerName: "PO_NO", width: 120 },
    { field: "PO_QTY", headerName: "PO_QTY", width: 120, renderCell: (params:any) => {return <span style={{color:'blue'}}><b>{params.row.PO_QTY.toLocaleString('en-US')}</b></span>}  },
    { field: "PO_DATE", headerName: "PO_DATE", width: 200 },
    { field: "RD_DATE", headerName: "RD_DATE", width: 200 },
    { field: "PROD_PRICE", headerName: "PROD_PRICE", width: 200, renderCell: (params:any) => {return <span style={{color:'gray'}}><b>{params.row.PROD_PRICE.toLocaleString('en-US' ,{style:'decimal',maximumFractionDigits:8})}</b></span>} },
    { field: "CHECKSTATUS", headerName: "CHECKSTATUS", width: 200 , renderCell: (params:any) => {
      if(params.row.CHECKSTATUS.slice(0,2) === 'OK')
      return <span style={{color:'green'}}><b>{params.row.CHECKSTATUS}</b></span>
      return <span style={{color:'red'}}><b>{params.row.CHECKSTATUS}</b></span>
    }
  },
  ]
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

    setisLoading(true);
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
    setisLoading(false);
    Swal.fire("Thông báo", "Đã hoàn thành check PO hàng loạt", "success");  
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
            await generalQuery("insert_po", {
              G_CODE: uploadExcelJson[i].G_CODE,
              CUST_CD: uploadExcelJson[i].CUST_CD,
              PO_NO: uploadExcelJson[i].PO_NO,
              EMPL_NO: userData.EMPL_NO,
              PO_QTY: uploadExcelJson[i].PO_QTY,
              PO_DATE: uploadExcelJson[i].PO_DATE,
              RD_DATE: uploadExcelJson[i].RD_DATE,
              PROD_PRICE: uploadExcelJson[i].PROD_PRICE, 
            })
              .then((response) => {
                console.log(response.data.tk_status);
                if (response.data.tk_status !== "NG") {
                  tempjson[i].CHECKSTATUS = "OK";
                } else {                  
                  err_code = 5;
                  tempjson[i].CHECKSTATUS = "NG: Lỗi SQL: " + response.data.message;
                }
              })
              .catch((error) => {
                console.log(error);
              });
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
    Swal.fire("Thông báo", "Đã hoàn thành thêm PO hàng loạt", "success");  
    setUploadExcelJSon(tempjson);
  };

  const confirmUpPoHangLoat = () => {
    Swal.fire({
      title: 'Chắc chắn muốn thêm PO hàng loạt ?',
      text: "Thêm rồi mà sai, sửa là hơi vất đấy",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Vẫn thêm!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Tiến hành thêm',
          'Đang thêm PO hàng loạt',
          'success'
        );
        handle_upPOHangLoat();
      }
    })

  }
  const confirmCheckPoHangLoat = () => {
    Swal.fire({
      title: 'Chắc chắn muốn check PO hàng loạt ?',
      text: "Sẽ bắt đầu check po hàng loạt",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Vẫn check!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Tiến hành check',
          'Đang check PO hàng loạt',
          'success'
        );
        handle_checkPOHangLoat();
      }
    })
  }

  const setNav = (choose: number) => {
    if(choose ===1 )
    {
      setSelection({...selection, trapo: true, thempohangloat:false, them1po:false});
    }
    else if(choose ===2 )
    {
      setSelection({...selection, trapo: false, thempohangloat:true, them1po:false});
    }
    else if(choose ===3 )
    {
      setSelection({...selection, trapo: false, thempohangloat:false, them1po:true});
    }
  }

  const top100Films = [
    { label: 'The Shawshank Redemption', year: 1994 },
    { label: 'The Godfather', year: 1972 },
    { label: 'The Godfather: Part II', year: 1974 },
    { label: 'The Dark Knight', year: 2008 },
    { label: '12 Angry Men', year: 1957 },
    { label: "Schindler's List", year: 1993 },
    { label: 'Pulp Fiction', year: 1994 },
    {
      label: 'The Lord of the Rings: The Return of the King',
      year: 2003,
    },
    { label: 'The Good, the Bad and the Ugly', year: 1966 },
    { label: 'Fight Club', year: 1999 },
    {
      label: 'The Lord of the Rings: The Fellowship of the Ring',
      year: 2001,
    },
    {
      label: 'Star Wars: Episode V - The Empire Strikes Back',
      year: 1980,
    },
    { label: 'Forrest Gump', year: 1994 },
    { label: 'Inception', year: 2010 },
    {
      label: 'The Lord of the Rings: The Two Towers',
      year: 2002,
    },
    { label: "One Flew Over the Cuckoo's Nest", year: 1975 },
    { label: 'Goodfellas', year: 1990 },
    { label: 'The Matrix', year: 1999 },
    { label: 'Seven Samurai', year: 1954 },
    {
      label: 'Star Wars: Episode IV - A New Hope',
      year: 1977,
    },
    { label: 'City of God', year: 2002 },
    { label: 'Se7en', year: 1995 },
    { label: 'The Silence of the Lambs', year: 1991 },
    { label: "It's a Wonderful Life", year: 1946 },
    { label: 'Life Is Beautiful', year: 1997 },
    { label: 'The Usual Suspects', year: 1995 },
    { label: 'Léon: The Professional', year: 1994 },
    { label: 'Spirited Away', year: 2001 },
    { label: 'Saving Private Ryan', year: 1998 },
    { label: 'Once Upon a Time in the West', year: 1968 },
    { label: 'American History X', year: 1998 },
    { label: 'Interstellar', year: 2014 },
    { label: 'Casablanca', year: 1942 },
    { label: 'City Lights', year: 1931 },
    { label: 'Psycho', year: 1960 },
    { label: 'The Green Mile', year: 1999 },
    { label: 'The Intouchables', year: 2011 },
    { label: 'Modern Times', year: 1936 },
    { label: 'Raiders of the Lost Ark', year: 1981 },
    { label: 'Rear Window', year: 1954 },
    { label: 'The Pianist', year: 2002 },
    { label: 'The Departed', year: 2006 },
    { label: 'Terminator 2: Judgment Day', year: 1991 },
    { label: 'Back to the Future', year: 1985 },
    { label: 'Whiplash', year: 2014 },
    { label: 'Gladiator', year: 2000 },
    { label: 'Memento', year: 2000 },
    { label: 'The Prestige', year: 2006 },
    { label: 'The Lion King', year: 1994 },
    { label: 'Apocalypse Now', year: 1979 },
    { label: 'Alien', year: 1979 },
    { label: 'Sunset Boulevard', year: 1950 },
    {
      label: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
      year: 1964,
    },
    { label: 'The Great Dictator', year: 1940 },
    { label: 'Cinema Paradiso', year: 1988 },
    { label: 'The Lives of Others', year: 2006 },
    { label: 'Grave of the Fireflies', year: 1988 },
    { label: 'Paths of Glory', year: 1957 },
    { label: 'Django Unchained', year: 2012 },
    { label: 'The Shining', year: 1980 },
    { label: 'WALL·E', year: 2008 },
    { label: 'American Beauty', year: 1999 },
    { label: 'The Dark Knight Rises', year: 2012 },
    { label: 'Princess Mononoke', year: 1997 },
    { label: 'Aliens', year: 1986 },
    { label: 'Oldboy', year: 2003 },
    { label: 'Once Upon a Time in America', year: 1984 },
    { label: 'Witness for the Prosecution', year: 1957 },
    { label: 'Das Boot', year: 1981 },
    { label: 'Citizen Kane', year: 1941 },
    { label: 'North by Northwest', year: 1959 },
    { label: 'Vertigo', year: 1958 },
    {
      label: 'Star Wars: Episode VI - Return of the Jedi',
      year: 1983,
    },
    { label: 'Reservoir Dogs', year: 1992 },
    { label: 'Braveheart', year: 1995 },
    { label: 'M', year: 1931 },
    { label: 'Requiem for a Dream', year: 2000 },
    { label: 'Amélie', year: 2001 },
    { label: 'A Clockwork Orange', year: 1971 },
    { label: 'Like Stars on Earth', year: 2007 },
    { label: 'Taxi Driver', year: 1976 },
    { label: 'Lawrence of Arabia', year: 1962 },
    { label: 'Double Indemnity', year: 1944 },
    {
      label: 'Eternal Sunshine of the Spotless Mind',
      year: 2004,
    },
    { label: 'Amadeus', year: 1984 },
    { label: 'To Kill a Mockingbird', year: 1962 },
    { label: 'Toy Story 3', year: 2010 },
    { label: 'Logan', year: 2017 },
    { label: 'Full Metal Jacket', year: 1987 },
    { label: 'Dangal', year: 2016 },
    { label: 'The Sting', year: 1973 },
    { label: '2001: A Space Odyssey', year: 1968 },
    { label: "Singin' in the Rain", year: 1952 },
    { label: 'Toy Story', year: 1995 },
    { label: 'Bicycle Thieves', year: 1948 },
    { label: 'The Kid', year: 1921 },
    { label: 'Inglourious Basterds', year: 2009 },
    { label: 'Snatch', year: 2000 },
    { label: '3 Idiots', year: 2009 },
    { label: 'Monty Python and the Holy Grail', year: 1975 },
  ];

  useEffect(()=>{
        

  },[]);

  return (
    <div className='pomanager'>
      <div className='mininavbar'>
        <div className='mininavitem'>
          <span className='mininavtext' onClick={() => setNav(1)}>
            Tra cứu PO
          </span>
        </div>
        <div className='mininavitem'>
          <span className='mininavtext' onClick={() => setNav(3)}>
            Thêm 1 PO
          </span>
        </div>
        <div className='mininavitem'>
          <span className='mininavtext' onClick={() => setNav(2)}>
            Thêm PO hàng loạt
          </span>
        </div>
        <div className='mininavitem'>
          <span className='mininavtext'>Sửa PO</span>
        </div>
      </div>
      {selection.thempohangloat && (
        <div className='newpo'>
          <h3>Thêm PO Hàng Loạt</h3>
          <br></br>
          <div className='batchnewpo'>
            <form className='formupload'>
              <label htmlFor='upload'>
                <b>Chọn file Excel: </b>
                <input
                  className='selectfilebutton'
                  type='file'
                  name='upload'
                  id='upload'
                  onChange={(e: any) => {
                    readUploadFile(e);
                  }}
                />
              </label>
              <div
                className='checkpobutton'
                onClick={(e) => {
                  e.preventDefault();
                  confirmCheckPoHangLoat();
                }}
              >
                Check PO
              </div>
              <div
                className='uppobutton'
                onClick={(e) => {
                  e.preventDefault();
                  confirmUpPoHangLoat();
                }}
              >
                Up PO
              </div>
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
                  columns={column_excel2}
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
      {selection.trapo && (
        <div className='tracuuPO'>
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
                <div className='summaryvalue'>
                  <b>
                    PO QTY: {poSummary.total_po_qty.toLocaleString("en-US")} EA
                  </b>
                </div>
                <div className='summaryvalue'>
                  <b>
                    PO AMOUNT:{" "}
                    {poSummary.total_po_amount.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </b>
                </div>
              </div>
              <div className='summarygroup'>
                <div className='summaryvalue'>
                  <b>
                    DELIVERED QTY:{" "}
                    {poSummary.total_delivered_qty.toLocaleString("en-US")} EA
                  </b>
                </div>
                <div className='summaryvalue'>
                  <b>
                    DELIVERED AMOUNT:{" "}
                    {poSummary.total_delivered_amount.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </b>
                </div>
              </div>
              <div className='summarygroup'>
                <div className='summaryvalue'>
                  <b>
                    PO BALANCE QTY:{" "}
                    {poSummary.total_pobalance_qty.toLocaleString("en-US")} EA
                  </b>
                </div>
                <div className='summaryvalue'>
                  <b>
                    PO BALANCE AMOUNT:{" "}
                    {poSummary.total_pobalance_amount.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </b>
                </div>
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
        </div>
      )}

      {selection.them1po && (
        <div className='them1po'>
          <div className='formnho'>
           
            <div className='dangkyform'>
            <h3>Thêm PO mới</h3>
              <div className='dangkyinput'>
                <div className='dangkyinputbox'>
                <label>
                    <b>Khách hàng:</b>{" "}
                  <Autocomplete
                   size="small"
                    disablePortal                    
                    options={top100Films}
                    className='autocomplete'                    
                    renderInput={(params) => (
                     <TextField {...params} label='Movie'/>
                    )}
                  />
                  </label>
                  <label>
                    <b>Code hàng:</b>{" "}
                  <Autocomplete
                    size="small"
                    disablePortal                    
                    options={top100Films}
                    className='autocomplete'                    
                    renderInput={(params) => (
                     <TextField {...params} label='Movie'/>
                    )}
                  />
                  </label>
                  <label>
                    <b>PO Date:</b>
                    <input
                      className='inputdata' 
                      type='date'
                      value={fromdate.slice(0, 10)}
                      onChange={(e) => setFromDate(e.target.value)}
                    ></input>
                  </label>
                  <label>
                    <b>RD Date:</b>{" "}
                    <input
                      className='inputdata' 
                      type='date'
                      value={todate.slice(0, 10)}
                      onChange={(e) => setToDate(e.target.value)}
                    ></input>
                  </label>

                  <label>
                    <b>PO NO:</b>{" "}
                  <TextField  size="small" color="success" className='autocomplete' id="outlined-basic" label="Số PO" variant="outlined" />
                  </label>
                  <label>
                    <b>PO QTY:</b>{" "}
                  <TextField  size="small" color="success" className='autocomplete' id="outlined-basic" label="PO QTY" variant="outlined" />
                  </label>
                  <label>
                    <b>Price:</b>{" "}
                  <TextField  size="small"  color="success" className='autocomplete' id="outlined-basic" label="Price" variant="outlined" />
                  </label>                 
                  <label>
                    <b>Remark:</b>{" "}
                  <TextField  size="small"  color="success" className='autocomplete' id="outlined-basic" label="Remark" variant="outlined" />
                  </label>                 
                 
                </div>
              </div>
              <div className='dangkybutton'>
                <button className='thembutton'>Đăng ký</button>
                <button className='xoabutton'>Clear</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export default PoManager
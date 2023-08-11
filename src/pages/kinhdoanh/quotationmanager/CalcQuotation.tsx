import React, { useEffect, useState } from 'react'
import { generalQuery } from '../../../api/Api';
import Swal from 'sweetalert2';
import { ResponsiveContainer } from 'recharts';
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
import { IconButton } from '@mui/material';
import { SaveExcel } from '../../../api/GlobalFunction';
import { AiFillFileExcel } from 'react-icons/ai';
import './CalcQuotation.scss'

interface CODEDATA {
  id: number,
  Q_ID: string,
  G_CODE: string,
  WIDTH_OFFSET: number,
  LENGTH_OFFSET: number,
  KNIFE_UNIT: number,
  FILM_UNIT: number,
  INK_UNIT: number,
  LABOR_UNIT: number,
  DELIVERY_UNIT: number,
  DEPRECATION_UNIT: number,
  GMANAGEMENT_UNIT: number,
  M_LOSS_UNIT: number,
  G_WIDTH: number,
	G_LENGTH: number,
	G_C: number,
	G_C_R : number,
	G_LG : number,
	G_CG : number,
	G_SG_L : number,
	G_SG_R : number,
	PROD_PRINT_TIMES: number,
  KNIFE_COST: number,
  FILM_COST: number,
  INK_COST: number,
  LABOR_COST: number,
  DELIVERY_COST: number,
  DEPRECATION_COST: number,
  GMANAGEMENT_COST: number,
  MATERIAL_COST: number,
  TOTAL_COST: number,
  SALE_PRICE: number,
  PROFIT: number,
  G_NAME: string,
  G_NAME_KD: string,
  CUST_NAME_KD: string,  
}
interface BOMVLDATA {
  id: number,
  Q_ID: string,
  G_CODE: string,
  M_CODE: string,
  M_NAME: string,
  OPEN_PRICE: number,
  ORIGINAL_PRICE: number,
}

interface DEFAULT_DM {
  id: number,
  WIDTH_OFFSET :number,
	LENGTH_OFFSET :number,
	KNIFE_UNIT :number,
	FILM_UNIT :number,
	INK_UNIT :number,
	LABOR_UNIT :number,
	DELIVERY_UNIT :number,
	DEPRECATION_UNIT :number,
	GMANAGEMENT_UNIT :number,
	M_LOSS_UNIT :number,
}
const CalcQuotation = () => {
  const [listcode, setListCode] = useState<Array<CODEDATA>>([]);
  const [listVL, setListVL] = useState<Array<BOMVLDATA>>([]);
  const [defaultDM, setDefaultDM]= useState<DEFAULT_DM>({
    id:0,
    WIDTH_OFFSET :0,
    LENGTH_OFFSET :0,
    KNIFE_UNIT :0,
    FILM_UNIT :0,
    INK_UNIT :0,
    LABOR_UNIT :0,
    DELIVERY_UNIT :0,
    DEPRECATION_UNIT :0,
    GMANAGEMENT_UNIT :0,
    M_LOSS_UNIT :0,
  })
  

  const loadListCode = ()=> {
    generalQuery('loadlistcodequotation',{     
       
    })
    .then(response => {
        //console.log(response.data);
        if(response.data.tk_status !=='NG')
        {
          const loadeddata: CODEDATA[] =  response.data.data.map((element:CODEDATA,index: number)=> {
            return {
              ...element,   id:  index
            }
          })
          setListCode(loadeddata);
         
          
          Swal.fire("Thông báo", "Đã load " + response.data.data.length + " dòng", "success");  
        }
        else
        {
          setListCode([]);
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }        
    })
    .catch(error => {
        console.log(error);
    });
  }
  const loadbomNVLQuotation = ()=> {
    generalQuery('loadquotationBOMNVL',{     
       
    })
    .then(response => {
        //console.log(response.data);
        if(response.data.tk_status !=='NG')
        {
          const loadeddata: BOMVLDATA[] =  response.data.data.map((element:BOMVLDATA,index: number)=> {
            return {
              ...element,   id:  index
            }
          })
          setListVL(loadeddata);
         
          
          Swal.fire("Thông báo", "Đã load " + response.data.data.length + " dòng", "success");  
        }
        else
        {
          setListVL([]);
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }        
    })
    .catch(error => {
        console.log(error);
    });
  }
  const loadDefaultDM = ()=> {
    generalQuery('loadDefaultDM',{     
       
    })
    .then(response => {
        //console.log(response.data);
        if(response.data.tk_status !=='NG')
        {
          const loadeddata: DEFAULT_DM[] =  response.data.data.map((element:DEFAULT_DM,index: number)=> {
            return {
              ...element,   id:  index
            }
          })
          setDefaultDM(loadeddata[0]);
        }
        else
        {
          setDefaultDM({
            id:0,
            WIDTH_OFFSET :0,
            LENGTH_OFFSET :0,
            KNIFE_UNIT :0,
            FILM_UNIT :0,
            INK_UNIT :0,
            LABOR_UNIT :0,
            DELIVERY_UNIT :0,
            DEPRECATION_UNIT :0,
            GMANAGEMENT_UNIT :0,
            M_LOSS_UNIT :0,
          });         
        }        
    })
    .catch(error => {
        console.log(error);
    });
  }

  const [selectedRows, setSelectedRows] = useState<CODEDATA>({
    id: 0,
    Q_ID: '',
    G_CODE: '',
    WIDTH_OFFSET: 0,
    LENGTH_OFFSET: 0,
    KNIFE_UNIT: 0,
    FILM_UNIT: 0,
    INK_UNIT: 0,
    LABOR_UNIT: 0,
    DELIVERY_UNIT: 0,
    DEPRECATION_UNIT:0 ,
    GMANAGEMENT_UNIT:0 ,
    M_LOSS_UNIT: 0,
    G_WIDTH: 0,
    G_LENGTH: 0,
    G_C: 0,
    G_C_R : 0,
    G_LG : 0,
    G_CG : 0,
    G_SG_L : 0,
    G_SG_R : 0,
    PROD_PRINT_TIMES: 0,    
    KNIFE_COST: 0,
    FILM_COST: 0,
    INK_COST: 0,
    LABOR_COST: 0,
    DELIVERY_COST: 0,
    DEPRECATION_COST: 0,
    GMANAGEMENT_COST: 0,
    MATERIAL_COST: 0,
    TOTAL_COST: 0,
    SALE_PRICE: 0,
    PROFIT: 0,
    G_NAME: '',    
    G_NAME_KD: '',
    CUST_NAME_KD: '',     
});

  const listcodeTable = React.useMemo(
    () => ( 
         <div className='datatb'>            
        <ResponsiveContainer>
        <DataGrid
          autoNavigateToFocusedRow={true}
          allowColumnReordering={true}
          allowColumnResizing={true}
          columnAutoWidth={false}
          cellHintEnabled={true}
          columnResizingMode={"widget"}
          showColumnLines={true}
          dataSource={listcode}
          columnWidth='auto'
          keyExpr='id'
          height={"75vh"}
          showBorders={true}
          onSelectionChanged={(e) => {
            setSelectedRows(e.selectedRowsData[0]);
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
          <Selection mode='single' selectAllMode='allPages' />
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
                  SaveExcel(listcode, "ListCode");
                }}
              >
                <AiFillFileExcel color='green' size={15} />
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
          <Summary>
            <TotalItem
              alignment='right'
              column='id'
              summaryType='count'
              valueFormat={"decimal"}
            />              
          </Summary>
        </DataGrid>
        </ResponsiveContainer>   
      </div>
    ),
    [listcode]
  );
  const listBOMVLTable = React.useMemo(
    () => ( 
         <div className='datatb'>            
        <ResponsiveContainer>
        <DataGrid
          autoNavigateToFocusedRow={true}
          allowColumnReordering={true}
          allowColumnResizing={true}
          columnAutoWidth={false}
          cellHintEnabled={true}
          columnResizingMode={"widget"}
          showColumnLines={true}
          dataSource={listVL}
          columnWidth='auto'
          keyExpr='id'
          height={"30vh"}
          showBorders={true}
          onSelectionChanged={(e) => {
            
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
          <Selection mode='single' selectAllMode='allPages' />
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
                  SaveExcel(listVL, "ListVL");
                }}
              >
                <AiFillFileExcel color='green' size={15} />
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
          <Summary>
            <TotalItem
              alignment='right'
              column='id'
              summaryType='count'
              valueFormat={"decimal"}
            />              
          </Summary>
        </DataGrid>
        </ResponsiveContainer>   
      </div>
    ),
    [listVL]
  );


  useEffect(()=> {
    //loadListCode();
    //loadDefaultDM();
  },[])

  
  return (
    <div className='calc_quotation'>
      <div className="calc_title">
        BẢNG TÍNH GIÁ
      </div>
      <div className="calc_wrap">
        <div className="left">
          <div className="listcode">
          {listcodeTable}
          </div>
         
          <div className="moqlist">

          </div>
          <div className="insert_button">

          </div>

        </div>
        <div className="right">
          <div className="up">
          <div className="bomnvl">
            {listBOMVLTable}
          </div>
          <div className="product_visualize">

          </div>
          <div className="openlink">

          </div>

          </div>
          <div className="middle">
            <div className="defaultunit">

            </div>
            <div className="currentunit">

            </div>

          </div>
          <div className="down">
          <div className="chiphinvl">

            </div>
            <div className="chiphidaofilm">

            </div>
            <div className="chiphikhac">

            </div>
            <div className="tongchiphi">

            </div>
            <div className="savebutton">

            </div>


          </div>         
         
         

        </div>
      </div>
      
    </div>
  )
}

export default CalcQuotation
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
import CodeVisualLize from './CodeVisualize/CodeVisualLize';

export interface CODEDATA {
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

interface BOM_GIA {
  id: string;
  BOM_ID?: string;
  G_CODE?: string;
  RIV_NO?: string;
  G_SEQ?: string;
  CATEGORY?: number;
  M_CODE?: string;
  M_NAME?: string;
  CUST_CD?: string;
  IMPORT_CAT?: string;
  M_CMS_PRICE?: number;
  M_SS_PRICE?: number;
  M_SLITTING_PRICE?: number;
  USAGE?: string;
  MAIN_M: string;
  MAT_MASTER_WIDTH?: number;
  MAT_CUTWIDTH?: number;
  MAT_ROLL_LENGTH?: number;
  MAT_THICKNESS?: number;
  M_QTY?: number;
  REMARK?: string;
  PROCESS_ORDER?: number;
  INS_EMPL?: string;
  UPD_EMPL?: string;
  INS_DATE?: string;
  UPD_DATE?: string;
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
  const [listVL, setListVL] = useState<Array<BOM_GIA>>([]);
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
  });

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
  const loadbomNVLQuotation = (g_code: string)=> {
    generalQuery('getbomgia',{ 
      G_CODE: g_code       
    })
    .then(response => {
        //console.log(response.data);
        if(response.data.tk_status !=='NG')
        {
          const loadeddata: BOM_GIA[] =  response.data.data.map((element:BOM_GIA,index: number)=> {
            return {
              ...element,   id:  index
            }
          })
          setListVL(loadeddata);         
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
            //setSelectedRows(e.selectedRowsData[0]);
          }}          
          onRowClick={(e) => {
            //console.log(e.data);    
            setSelectedRows(e.data);        
            loadbomNVLQuotation(e.data.G_CODE);
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
          <Column dataField='G_CODE' caption='G_CODE' width={70}></Column>         
          <Column dataField='G_SEQ' caption='G_SEQ' width={50}></Column>         
          <Column dataField='M_CODE' caption='M_CODE' width={70}></Column>
          <Column dataField='M_NAME' caption='M_NAME' width={70}></Column>
          <Column dataField='MAT_CUTWIDTH' caption='SIZE' width={70}></Column>
          <Column dataField='M_CMS_PRICE' caption='OPEN PR' width={70}></Column>
          <Column dataField='M_SS_PRICE' caption='ORG PR' width={70}></Column>          
          <Column dataField='USAGE' caption='USAGE' width={70}></Column>
          <Column dataField='MAT_MASTER_WIDTH' caption='MST_WIDTH' width={70}></Column>          
          <Column dataField='M_QTY' caption='M_QTY' width={70}></Column>          
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
  const handlesetDefaultDM = (keyname: string, value: any) => {
    let tempDM = { ...defaultDM, [keyname]: value };
    //console.log(tempcodefullinfo);
    setDefaultDM(tempDM);
  };
  const handlesetCodeInfo = (keyname: string, value: any) => {
    let tempCodeInfo = { ...selectedRows, [keyname]: value };
    //console.log(tempcodefullinfo);
    setSelectedRows(tempCodeInfo);
  };

  useEffect(()=> {
    loadListCode();
    loadDefaultDM();
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
            <CodeVisualLize DATA={selectedRows}/>

          </div>
          <div className="openlink">        

          </div>

          </div>
          <div className="middle">
          <div className="openlink">
          <div className="defaultunit">            
            <label>
            W_OFFSET:<br></br>
            <input              
              type='text'
              value={
                defaultDM.WIDTH_OFFSET === null
                  ? 0
                  : defaultDM.WIDTH_OFFSET
              }
              onChange={(e) => {
                handlesetDefaultDM("WIDTH_OFFSET", e.target.value);
              }}
            ></input>
          </label>
          <label>
            L_OFFSET:<br></br>
            <input              
              type='text'
              value={
                defaultDM.LENGTH_OFFSET === null
                  ? 0
                  : defaultDM.LENGTH_OFFSET
              }
              onChange={(e) => {
                handlesetDefaultDM("LENGTH_OFFSET", e.target.value);
              }}
            ></input>
          </label>
          <label>
            KNIFE_UNIT:<br></br>
            <input              
              type='text'
              value={
                defaultDM.KNIFE_UNIT === null
                  ? 0
                  : defaultDM.KNIFE_UNIT
              }
              onChange={(e) => {
                handlesetDefaultDM("KNIFE_UNIT", e.target.value);
              }}
            ></input>
          </label>
          <label>
            FILM_UNIT:<br></br>
            <input              
              type='text'
              value={
                defaultDM.FILM_UNIT === null
                  ? 0
                  : defaultDM.FILM_UNIT
              }
              onChange={(e) => {
                handlesetDefaultDM("FILM_UNIT", e.target.value);
              }}
            ></input>
          </label>
          <label>
            INK_UNIT:<br></br>
            <input              
              type='text'
              value={
                defaultDM.INK_UNIT === null
                  ? 0
                  : defaultDM.INK_UNIT
              }
              onChange={(e) => {
                handlesetDefaultDM("INK_UNIT", e.target.value);
              }}
            ></input>
          </label>
          <label>
            LABOR_UNIT:<br></br>
            <input              
              type='text'
              value={
                defaultDM.LABOR_UNIT === null
                  ? 0
                  : defaultDM.LABOR_UNIT
              }
              onChange={(e) => {
                handlesetDefaultDM("LABOR_UNIT", e.target.value);
              }}
            ></input>
          </label>
          

            
            
            
            <label>
            DELIVERY_UNIT:<br></br>
            <input              
              type='text'
              value={
                defaultDM.DELIVERY_UNIT === null
                  ? 0
                  : defaultDM.DELIVERY_UNIT
              }
              onChange={(e) => {
                handlesetDefaultDM("DELIVERY_UNIT", e.target.value);
              }}
            ></input>
          </label>
          <label>
            DELIVERY_UNIT:<br></br>
            <input              
              type='text'
              value={
                defaultDM.DELIVERY_UNIT === null
                  ? 0
                  : defaultDM.DELIVERY_UNIT
              }
              onChange={(e) => {
                handlesetDefaultDM("DELIVERY_UNIT", e.target.value);
              }}
            ></input>
          </label>
          <label>
            DEPRECATION_UNIT:<br></br>
            <input              
              type='text'
              value={
                defaultDM.DEPRECATION_UNIT === null
                  ? 0
                  : defaultDM.DEPRECATION_UNIT
              }
              onChange={(e) => {
                handlesetDefaultDM("DEPRECATION_UNIT", e.target.value);
              }}
            ></input>
          </label>
          <label>
            GMANAGEMENT_UNIT:<br></br>
            <input              
              type='text'
              value={
                defaultDM.GMANAGEMENT_UNIT === null
                  ? 0
                  : defaultDM.GMANAGEMENT_UNIT
              }
              onChange={(e) => {
                handlesetDefaultDM("GMANAGEMENT_UNIT", e.target.value);
              }}
            ></input>
          </label>
          <label>
            M_LOSS_UNIT:<br></br>
            <input              
              type='text'
              value={
                defaultDM.M_LOSS_UNIT === null
                  ? 0
                  : defaultDM.M_LOSS_UNIT
              }
              onChange={(e) => {
                handlesetDefaultDM("M_LOSS_UNIT", e.target.value);
              }}
            ></input>
          </label>

          </div>
          <div className="currentunit">            
            <label>
            W_OFFSET:<br></br>
            <input              
              type='text'
              value={
                selectedRows.WIDTH_OFFSET === null
                  ? 0
                  : selectedRows.WIDTH_OFFSET
              }
              onChange={(e) => {
                handlesetCodeInfo("WIDTH_OFFSET", e.target.value);
              }}
            ></input>
          </label>
          <label>
            L_OFFSET:<br></br>
            <input              
              type='text'
              value={
                selectedRows.LENGTH_OFFSET === null
                  ? 0
                  : selectedRows.LENGTH_OFFSET
              }
              onChange={(e) => {
                handlesetCodeInfo("LENGTH_OFFSET", e.target.value);
              }}
            ></input>
          </label>
          <label>
            KNIFE_UNIT:<br></br>
            <input              
              type='text'
              value={
                selectedRows.KNIFE_UNIT === null
                  ? 0
                  : selectedRows.KNIFE_UNIT
              }
              onChange={(e) => {
                handlesetCodeInfo("KNIFE_UNIT", e.target.value);
              }}
            ></input>
          </label>
          <label>
            FILM_UNIT:<br></br>
            <input              
              type='text'
              value={
                selectedRows.FILM_UNIT === null
                  ? 0
                  : selectedRows.FILM_UNIT
              }
              onChange={(e) => {
                handlesetCodeInfo("FILM_UNIT", e.target.value);
              }}
            ></input>
          </label>
          <label>
            INK_UNIT:<br></br>
            <input              
              type='text'
              value={
                selectedRows.INK_UNIT === null
                  ? 0
                  : selectedRows.INK_UNIT
              }
              onChange={(e) => {
                handlesetCodeInfo("INK_UNIT", e.target.value);
              }}
            ></input>
          </label>
          <label>
            LABOR_UNIT:<br></br>
            <input              
              type='text'
              value={
                selectedRows.LABOR_UNIT === null
                  ? 0
                  : selectedRows.LABOR_UNIT
              }
              onChange={(e) => {
                handlesetCodeInfo("LABOR_UNIT", e.target.value);
              }}
            ></input>
          </label>
          

            
            
            
            <label>
            DELIVERY_UNIT:<br></br>
            <input              
              type='text'
              value={
                selectedRows.DELIVERY_UNIT === null
                  ? 0
                  : selectedRows.DELIVERY_UNIT
              }
              onChange={(e) => {
                handlesetCodeInfo("DELIVERY_UNIT", e.target.value);
              }}
            ></input>
          </label>
          <label>
            DELIVERY_UNIT:<br></br>
            <input              
              type='text'
              value={
                selectedRows.DELIVERY_UNIT === null
                  ? 0
                  : selectedRows.DELIVERY_UNIT
              }
              onChange={(e) => {
                handlesetCodeInfo("DELIVERY_UNIT", e.target.value);
              }}
            ></input>
          </label>
          <label>
            DEPRECATION_UNIT:<br></br>
            <input              
              type='text'
              value={
                selectedRows.DEPRECATION_UNIT === null
                  ? 0
                  : selectedRows.DEPRECATION_UNIT
              }
              onChange={(e) => {
                handlesetCodeInfo("DEPRECATION_UNIT", e.target.value);
              }}
            ></input>
          </label>
          <label>
            GMANAGEMENT_UNIT:<br></br>
            <input              
              type='text'
              value={
                selectedRows.GMANAGEMENT_UNIT === null
                  ? 0
                  : selectedRows.GMANAGEMENT_UNIT
              }
              onChange={(e) => {
                handlesetCodeInfo("GMANAGEMENT_UNIT", e.target.value);
              }}
            ></input>
          </label>
          <label>
            M_LOSS_UNIT:<br></br>
            <input              
              type='text'
              value={
                selectedRows.M_LOSS_UNIT === null
                  ? 0
                  : selectedRows.M_LOSS_UNIT
              }
              onChange={(e) => {
                handlesetCodeInfo("M_LOSS_UNIT", e.target.value);
              }}
            ></input>
          </label>

          </div>
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
import React, { useEffect, useMemo, useState } from 'react';
import { TestListTable, DTC_ADD_SPEC_DATA, DTC_TEST_POINT } from '../../../api/GlobalInterface';
import { f_addTestItem, f_addTestPoint, f_loadDTC_TestList, f_loadDTC_TestPointList } from '../../../api/GlobalFunction';
import AGTable from '../../../components/DataTable/AGTable';
import './TESTTABLE.scss';
import { Button, Dialog, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';
import { AiOutlinePlus, AiOutlineReload } from 'react-icons/ai';
import Swal from 'sweetalert2';
const TEST_TABLE: React.FC = () => {
  const [testList, setTestList] = useState<TestListTable[]>([]);
  const [testPointList, setTestPointList] = useState<DTC_TEST_POINT[]>([]);
  const [open, setOpen] = useState(false);
  const [openAddPoint, setOpenAddPoint] = useState(false);
  const [pointCode, setPointCode] = useState(0);
  const [pointName, setPointName] = useState('');
  //create testCode and testName
  const [testCode, setTestCode] = useState(0);
  const [testName, setTestName] = useState('');
  const loadTestList = async () => {
    const data = await f_loadDTC_TestList();
    setTestList(data);
  };
  useEffect(() => {   
    loadTestList();
  }, []);
  //load test point list from test code
  const loadTestPointList = async (testCode: number) => {
    const data = await f_loadDTC_TestPointList(testCode);
    setTestPointList(data);
  };
  const testListColumns = useMemo(() => [
    { field: 'TEST_CODE', headerName: 'Test Code', width: 120 },
    { field: 'TEST_NAME', headerName: 'Test Name', width: 200 },
  ], []);
  const handleTestListRowClick = (params: any) => {
    setTestCode(params.data.TEST_CODE);
    loadTestPointList(params.data.TEST_CODE);
  };
//create selectedTestPointsColumns using DTC_TEST_POINT interface
const selectedTestPointsColumns = useMemo(() => [
  { field: 'POINT_CODE', headerName: 'Point Code', width: 120 },
  { field: 'POINT_NAME', headerName: 'Point Name', width: 200 },
  { field: 'TEST_CODE', headerName: 'Test Code', width: 120 },
  { field: 'TEST_NAME', headerName: 'Test Name', width: 200 },
], []);
  return (
    <div className='testtable'>      
      <div className='testtable-left'>
        <AGTable
        toolbar={<>        
        <IconButton          
          onClick={() => {
            //open add item dialog
            setOpen(true);
          }}
          size='small'
        >          
          <AiOutlinePlus color="green" size={15}/> <span style={{fontSize:'0.8rem'}}>Add Test Item</span>
        </IconButton>         
        <IconButton          
          onClick={() => {
            loadTestList();
          }}
          size='small'
        >          
          <AiOutlineReload color="green" size={15}/> <span style={{fontSize:'0.8rem'}}>Refresh</span>
        </IconButton>  
        </>}
          data={testList}
          columns={testListColumns}
        onRowClick={handleTestListRowClick}
        onSelectionChange={()=>{}}
       
      />
      <Dialog
        fullWidth={true}
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle align='center' id="alert-dialog-title">{"Add Test Item"}</DialogTitle>
        <DialogContent> 
        <TextField
          autoFocus
          margin="dense"
          id="testCode"
          label="Test Code"
          type="number"
          fullWidth
          variant="standard"
          onChange={(e)=>{setTestCode(Number(e.target.value))}}
        />  
        <TextField
          margin="dense"
          id="name"
          label="Test Name"
          type="text"
          fullWidth
          variant="standard"
          onChange={(e)=>{setTestName(e.target.value)}}
        />   
        <div style={{display:'flex', justifyContent:'center'}}>
        <Button        
          variant="contained"
          color="primary"
          onClick={async () => {
           await f_addTestItem(testCode, testName);
           loadTestList();
            // Close the dialog
            setOpen(false);
          }}
        >
          Add Test Item
        </Button>
        </div>       
        </DialogContent>
      </Dialog> 
      </div>
      <div className='testtable-right'>        
      <AGTable
        toolbar={<>
        <IconButton          
          onClick={() => {
            //open add item dialog
            setOpenAddPoint(true);
          }}
          size='small'
        >          
          <AiOutlinePlus color="green" size={15}/> <span style={{fontSize:'0.8rem'}}>Add Test Point</span>
        </IconButton>    
        <IconButton          
          onClick={() => {
            loadTestPointList(testCode);
          }}
          size='small'
        >          
          <AiOutlineReload color="green" size={15}/> <span style={{fontSize:'0.8rem'}}>Refresh</span>
        </IconButton>         
        </>}
        data={testPointList}
        columns={selectedTestPointsColumns}
        onSelectionChange={()=>{}}        
      />
      <Dialog
        fullWidth={true}
        open={openAddPoint}
        onClose={() => {
          setOpenAddPoint(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      > 
      <DialogTitle align='center' id="alert-dialog-title">{"Add Test Point"}</DialogTitle>
        <DialogContent>         
        <TextField
          margin="dense"
          id="pointCode"
          label="Point Code" 
          type="number"
          fullWidth
          variant="standard"
          onChange={(e)=>{setPointCode(Number(e.target.value))}}
        />   
        <TextField
          margin="dense"
          id="name"
          label="Point Name" 
          type="text"
          fullWidth
          variant="standard"
          onChange={(e)=>{setPointName(e.target.value)}}
        />   
        <div style={{display:'flex', justifyContent:'center'}}>
        <Button        
          variant="contained"
          color="primary"
          onClick={async () => {
            if(testCode === 0 || pointCode === 0 || pointName === ''){      
              alert('Please enter all fields');
            }
            else {
              await f_addTestPoint(testCode, pointCode, pointName);
              loadTestPointList(testCode);
               // Close the dialog
               setOpenAddPoint(false);
            }
          
          }}
        > 
          Add Test Point
        </Button>        
        </div>       
        </DialogContent>
      </Dialog> 
      </div>
    </div>
  );
};
export default TEST_TABLE;

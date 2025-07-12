import { IconButton, Button } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import "./DeptManager.scss";
import { getCompany, getUserData } from "../../../api/Api";
import { EmployeeTableData, MainDeptTableData, SubDeptTableData, WORK_POSITION_DATA } from "../interfaces/nhansuInterface";
import AGTable from "../../../components/DataTable/AGTable";
import { 
  f_addEmployee,
  f_addMainDept,
  f_addSubDept,
  f_addWorkPosition,
  f_deleteMainDept,
  f_deleteSubDept,
  f_deleteWorkPosition,
  f_getEmployeeList,
  f_loadMainDepList,
  f_loadSubDepList,
  f_loadWorkPositionList,
  f_updateEmployee,
  f_updateMainDept,
  f_updateSubDept,
  f_updateWorkPosition,
} from "../utils/nhansuUtils";
import { BiLoaderCircle } from "react-icons/bi";
import { MdAdd } from "react-icons/md";
import CustomDialog from "../../../components/Dialog/CustomDialog";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { getlang } from "../../../components/String/String";
import DropdownSearch from "../../../components/MyDropDownSearch/DropdownSearch";
import { checkBP } from "../../../api/GlobalFunction";
const DeptManager = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [tableSelection, setTableSelection] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const [resigned_check, setResignedCheck] = useState(true);
  const [empl_info, setEmplInfo] = useState<Array<EmployeeTableData>>([]);
  const [workpositionload, setWorkPositionLoad] = useState<Array<WORK_POSITION_DATA>>([]);
  const [subdeptTable, setSubDeptTable] = useState<Array<SubDeptTableData>>([]);
  const [maindeptTable, setMainDeptTable] = useState<Array<MainDeptTableData>>([]);
  const handleLoadMainDept = async () => {
    let kq: MainDeptTableData[] = [];
    kq = await f_loadMainDepList();
    setMainDeptTable(kq);
  }
  const handleLoadsubDept = async (MAINDEPTCODE?: number) => {    
    let kq: SubDeptTableData[] = [];
    kq = await f_loadSubDepList(MAINDEPTCODE);
    //console.log('subdept',kq)
    setSubDeptTable(kq);
  }
  const loadWorkPosition = async (SUBDEPTCODE?: number) => {
    let kq: any[] = [];
    kq = await f_loadWorkPositionList(SUBDEPTCODE);
    //console.log(kq);
    setWorkPositionLoad(kq);
  }
  const [selectedRows, setSelectedRows] = useState<EmployeeTableData>({
    id: "",
    EMPL_NO: "",
    CMS_ID: "",
    FIRST_NAME: "",
    MIDLAST_NAME: "",
    FULL_NAME: "",
    DOB: "",
    HOMETOWN: "",
    ADD_PROVINCE: "",
    ADD_DISTRICT: "",
    ADD_COMMUNE: "",
    ADD_VILLAGE: "",
    PHONE_NUMBER: "",
    WORK_START_DATE: "",
    PASSWORD: "",
    EMAIL: "",
    REMARK: "",
    ONLINE_DATETIME: "",
    CTR_CD: "",
    SEX_CODE: 0,
    SEX_NAME: "",
    SEX_NAME_KR: "",
    WORK_STATUS_CODE: 0,
    WORK_STATUS_NAME: "",
    WORK_STATUS_NAME_KR: "",
    FACTORY_CODE: 0,
    FACTORY_NAME: "",
    FACTORY_NAME_KR: "",
    JOB_CODE: 0,
    JOB_NAME: "",
    JOB_NAME_KR: "",
    POSITION_CODE: 0,
    POSITION_NAME: "",
    POSITION_NAME_KR: "",
    WORK_SHIFT_CODE: 0,
    WORK_SHIF_NAME: "",
    WORK_SHIF_NAME_KR: "",
    WORK_POSITION_CODE: 0,
    WORK_POSITION_NAME: "",
    WORK_POSITION_NAME_KR: "",
    ATT_GROUP_CODE: 0,
    SUBDEPTCODE: 0,
    SUBDEPTNAME: "",
    SUBDEPTNAME_KR: "",
    MAINDEPTCODE: 0,
    MAINDEPTNAME: "",
    MAINDEPTNAME_KR: "",
    NV_CCID: 0,
    EMPL_IMAGE: "",
    RESIGN_DATE: "",
  });
  const [selectedMainDept, setselectedMainDept] = useState<MainDeptTableData>({
    id: 0,
    CTR_CD: '002',
    MAINDEPTCODE: 0,
    MAINDEPTNAME: "",
    MAINDEPTNAME_KR: "",
  });
  const [selectedSubDept, setselectedSubDept] = useState<SubDeptTableData>({
    id: 0,
    CTR_CD: '002',
    MAINDEPTCODE: 0,
    SUBDEPTCODE: 0,
    SUBDEPTNAME: "",
    SUBDEPTNAME_KR: "",
  })
  const [selectedWorkPosition, setSelectedWorkPosition] = useState<WORK_POSITION_DATA>({
    SUBDEPTCODE: 0,
    ATT_GROUP_CODE: 0,
    CTR_CD: '002',
    WORK_POSITION_CODE: 0,
    WORK_POSITION_NAME: "",
    WORK_POSITION_NAME_KR: "",
  })
  const columns = [
    {
      field: 'EMPL_NO', headerName: 'ERP_ID', resizable: true, editable: false, width: 90, headerCheckboxSelection: true, checkboxSelection: true, cellRenderer: (params: any) => {
        return <span style={{ color: 'blue', fontWeight: 'bold' }}>{params.value}</span>
      }
    },
    { field: 'NV_CCID', headerName: 'NV_CCID', resizable: true, editable: false, width: 50 },
    { field: 'CMS_ID', headerName: 'NS_ID', resizable: true, editable: false, width: 60 },
    {
      field: 'IMAGE', headerName: 'IMAGE', resizable: true, editable: false, width: 50, cellRenderer: (params: any) => {
        if (params.data.EMPL_IMAGE === "Y")
          return (
            <img
              width={50}
              height={50}
              src={"/Picture_NS/NS_" + params.data.EMPL_NO + ".jpg"}
              alt={selectedRows.EMPL_NO}
            ></img>
          )
        else {
          return (
            <img
              width={50}
              height={50}
              src={"/noimage.webp"}
              alt={selectedRows.EMPL_NO}
            ></img>
          )
        }
      }
    },
    { field: 'FIRST_NAME', headerName: 'FIRST_NAME', resizable: true, editable: false, width: 70 },
    { field: 'MIDLAST_NAME', headerName: 'MIDLAST_NAME', resizable: true, editable: false, width: 90 },
    {
      field: 'FULL_NAME', headerName: 'FULL_NAME', resizable: true, editable: false, width: 100, cellRenderer: (params: any) => {
        return <span style={{ color: 'green', fontWeight: 'bold' }}>{params.value}</span>
      }
    },
    { field: 'SUBDEPTNAME', headerName: 'SUBDEPT', resizable: true, editable: false, width: 60 },
    { field: 'MAINDEPTNAME', headerName: 'MAINDEPT', resizable: true, editable: false, width: 60 },
    { field: 'WORK_POSITION_NAME', headerName: 'WORK_POSITION', resizable: true, editable: false, width: 80 },
    { field: 'POSITION_NAME', headerName: 'POSITION', resizable: true, editable: false, width: 80 },
    { field: 'JOB_NAME', headerName: 'JOB_NAME', resizable: true, editable: false, width: 60 },
    { field: 'WORK_SHIF_NAME', headerName: 'WORK_SHIFT', resizable: true, editable: false, width: 80 },
    { field: 'DOB', headerName: 'DOB', resizable: true, editable: false, width: 70 },
    { field: 'HOMETOWN', headerName: 'HOMETOWN', resizable: true, editable: false, width: 150 },
    { field: 'ADD_PROVINCE', headerName: 'ADD_PROVINCE', resizable: true, editable: false, width: 80 },
    { field: 'ADD_DISTRICT', headerName: 'ADD_DISTRICT', resizable: true, editable: false, width: 80 },
    { field: 'ADD_COMMUNE', headerName: 'ADD_COMMUNE', resizable: true, editable: false, width: 80 },
    { field: 'ADD_VILLAGE', headerName: 'ADD_VILLAGE', resizable: true, editable: false, width: 80 },
    { field: 'PHONE_NUMBER', headerName: 'PHONE_NUMBER', resizable: true, editable: false, width: 80 },
    { field: 'WORK_START_DATE', headerName: 'NGAY_VAO', resizable: true, editable: false, width: 60 },
    { field: 'PASSWORD', headerName: 'PASSWORD', resizable: true, editable: false, width: 70 },
    { field: 'EMAIL', headerName: 'EMAIL', resizable: true, editable: false, width: 100 },
    { field: 'REMARK', headerName: 'REMARK', resizable: true, editable: false, width: 100 },
    { field: 'ONLINE_DATETIME', headerName: 'ONLINE_DATETIME', resizable: true, editable: false, width: 100 },
    { field: 'SEX_NAME', headerName: 'SEX', resizable: true, editable: false, width: 50 },
    { field: 'WORK_STATUS_NAME', headerName: 'WORK_STATUS', resizable: true, editable: false, width: 80 },
    { field: 'FACTORY_NAME', headerName: 'FACTORY_NAME', resizable: true, editable: false, width: 80 },
    { field: 'ATT_GROUP_CODE', headerName: 'ATT_GROUP', resizable: true, editable: false, width: 60 },
    { field: 'RESIGN_DATE', headerName: 'RESIGN_DATE', resizable: true, editable: false, width: 100 },
  ];
  const columns_maindept = [
    { field: 'MAINDEPTCODE', headerName: 'DEPTCODE', resizable: true, editable: false, width: 100 },
    { field: 'MAINDEPTNAME', headerName: 'MAINDEPTNAME', resizable: true, editable: true, width: 100 },
    { field: 'MAINDEPTNAME_KR', headerName: 'MAINDEPTNAME_KR', resizable: true, editable: true, width: 100 },
  ];
  const columns_subdept = [
    { field: 'MAINDEPTCODE', headerName: 'MAINDEPTCODE', resizable: true, editable: false, width: 100 },
    { field: 'SUBDEPTCODE', headerName: 'SUBDEPTCODE', resizable: true, editable: false, width: 100 },
    { field: 'SUBDEPTNAME', headerName: 'SUBDEPTNAME', resizable: true, editable: true, width: 100 },
    { field: 'SUBDEPTNAME_KR', headerName: 'SUBDEPTNAME_KR', resizable: true, editable: true, width: 100 },
  ]
  const columns_workposition = [
    { field: 'SUBDEPTCODE', headerName: 'SUBDEPTCODE', resizable: true, editable: false, width: 80 },
    { field: 'WORK_POSITION_CODE', headerName: 'WORK_POSITION_CODE', resizable: true, editable: false, width: 110 },
    { field: 'WORK_POSITION_NAME', headerName: 'WORK_POSITION_NAME', resizable: true, editable: true, width: 120 },
    { field: 'WORK_POSITION_NAME_KR', headerName: 'WORK_POSITION_NAME_KR', resizable: true, editable: true, width: 130 },
    { field: 'ATT_GROUP_CODE', headerName: 'ATT_GROUP_CODE', resizable: true, editable: true, width: 100 },
  ]
  const setCustInfo = (keyname: string, value: any) => {
    let tempCustInfo: EmployeeTableData = { ...selectedRows, [keyname]: value };
    //console.log(tempcodefullinfo);
    setSelectedRows(tempCustInfo);
  };
  const setMainDeptInfo = (keyname: string, value: any) => {
    let tempMainDept: MainDeptTableData = { ...selectedMainDept, [keyname]: value };
    //console.log(tempcodefullinfo);
    setselectedMainDept(tempMainDept);
  };
  const setSubDeptInfo = (keyname: string, value: any) => {
    let tempSubDept: SubDeptTableData = { ...selectedSubDept, [keyname]: value };
    //console.log(tempcodefullinfo);
    setselectedSubDept(tempSubDept);
  };
  const setWorkPositionInfo = (keyname: string, value: any) => {
    let tempWorkPosition: WORK_POSITION_DATA = { ...selectedWorkPosition, [keyname]: value };
    //console.log(tempcodefullinfo);
    setSelectedWorkPosition(tempWorkPosition);
  };
  const createNewUser = async () => {
    setSelectedRows({
      id: "",
      EMPL_NO: "",
      CMS_ID: "",
      FIRST_NAME: "",
      MIDLAST_NAME: "",
      FULL_NAME: "",
      DOB: "",
      HOMETOWN: "",
      ADD_PROVINCE: "",
      ADD_DISTRICT: "",
      ADD_COMMUNE: "",
      ADD_VILLAGE: "",
      PHONE_NUMBER: "",
      WORK_START_DATE: "",
      PASSWORD: "",
      EMAIL: "",
      REMARK: "",
      ONLINE_DATETIME: "",
      CTR_CD: "",
      SEX_CODE: 0,
      SEX_NAME: "",
      SEX_NAME_KR: "",
      WORK_STATUS_CODE: 0,
      WORK_STATUS_NAME: "",
      WORK_STATUS_NAME_KR: "",
      FACTORY_CODE: 0,
      FACTORY_NAME: "",
      FACTORY_NAME_KR: "",
      JOB_CODE: 0,
      JOB_NAME: "",
      JOB_NAME_KR: "",
      POSITION_CODE: 0,
      POSITION_NAME: "",
      POSITION_NAME_KR: "",
      WORK_SHIFT_CODE: 0,
      WORK_SHIF_NAME: "",
      WORK_SHIF_NAME_KR: "",
      WORK_POSITION_CODE: 0,
      WORK_POSITION_NAME: "",
      WORK_POSITION_NAME_KR: "",
      ATT_GROUP_CODE: 0,
      SUBDEPTCODE: 0,
      SUBDEPTNAME: "",
      SUBDEPTNAME_KR: "",
      MAINDEPTCODE: 0,
      MAINDEPTNAME: "",
      MAINDEPTNAME_KR: "",
      NV_CCID: 0,
      EMPL_IMAGE: "",
      RESIGN_DATE: "",
    });
  };
  const glbLang: string | undefined = useSelector(
    (state: RootState) => state.totalSlice.lang
  );
  const mainDeptAGTable = useMemo(() => {
    return (
      <AGTable
        suppressRowClickSelection={false}
        toolbar={
          <div style={{ fontSize: '0.7rem', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                handleLoadMainDept();
              }}
            >
              <BiLoaderCircle color="#06cc70" size={15} />
              Load Data
            </IconButton>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                handleOpenDialog();
                setTableSelection(1);
              }}
            >
              <MdAdd color="#1c44f5" size={15} />
              Add/Update/Delete
            </IconButton>
          </div>}
        columns={columns_maindept}
        data={maindeptTable}
        onCellEditingStopped={(params: any) => {
          //console.log(e.data)
        }} onRowClick={(params: any) => {
          setselectedMainDept(params.data);
          handleLoadsubDept(params.data.MAINDEPTCODE);
          //console.log(e.data) 
        }} onSelectionChange={(params: any) => {
          //setSelectedRows(params!.api.getSelectedRows()[0]);
          //console.log(e!.api.getSelectedRows())
        }} onRowDoubleClick={(params: any) => {
        }}
      />
    )
  }, [maindeptTable, tableSelection])
  const subDeptAGTable = useMemo(() => {
    return (
      <AGTable
        suppressRowClickSelection={false}
        toolbar={
          <div style={{ fontSize: '0.7rem', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                handleLoadsubDept();
              }}
            >
              <BiLoaderCircle color="#06cc70" size={15} />
              Load Data
            </IconButton>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                handleOpenDialog();
                setTableSelection(2);
              }}
            >
              <MdAdd color="#1c44f5" size={15} />
              Add/Update/Delete
            </IconButton>
          </div>}
        columns={columns_subdept}
        data={subdeptTable}
        onCellEditingStopped={(params: any) => {
          //console.log(e.data)
        }} onRowClick={(params: any) => {
          setselectedSubDept(params.data);
          loadWorkPosition(params.data.SUBDEPTCODE);
          //console.log(e.data) 
        }} onSelectionChange={(params: any) => {
          //setSelectedRows(params!.api.getSelectedRows()[0]);
          //console.log(e!.api.getSelectedRows())
        }} onRowDoubleClick={(params: any) => {
        }}
      />
    )
  }, [subdeptTable,tableSelection])
  const workPositionAGTable = useMemo(() => {
    return (
      <AGTable
        suppressRowClickSelection={false}
        toolbar={
          <div style={{ fontSize: '0.7rem', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                loadWorkPosition();
              }}
            >
              <BiLoaderCircle color="#06cc70" size={15} />
              Load Data
            </IconButton>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                handleOpenDialog();
                setTableSelection(3);
              }}
            >
              <MdAdd color="#1c44f5" size={15} />
              Add/Update/Delete
            </IconButton>
          </div>}
        columns={columns_workposition}
        data={workpositionload}
        onCellEditingStopped={(params: any) => {
          //console.log(e.data)
        }} onRowClick={(params: any) => {
          setSelectedWorkPosition(params.data);
          //console.log(e.data) 
        }} onSelectionChange={(params: any) => {
          //setSelectedRows(params!.api.getSelectedRows()[0]);
          //console.log(e!.api.getSelectedRows())
        }} onRowDoubleClick={(params: any) => {
        }}
      />
    )
  }, [workpositionload,tableSelection])

  const init = ()=> {
    handleLoadMainDept();
    loadWorkPosition();
    handleLoadsubDept();
  }
  const handleAddInfo = async () => {
    if (tableSelection === 1) {
      let kq: string = await f_addMainDept(selectedMainDept);
      if (kq === '') {
        Swal.fire("Thông báo", "Chúc mừng bạn, thêm thành công !", "success");
      }
      else {
        Swal.fire("Thông báo", "Lỗi, " + kq, "error");
      }      
    } else if (tableSelection === 2) {
      let kq: string = await f_addSubDept(selectedSubDept);
      if (kq === '') {
        Swal.fire("Thông báo", "Chúc mừng bạn, thêm thành công !", "success");
      }
      else {
        Swal.fire("Thông báo", "Lỗi, " + kq, "error");
      }
    } else if (tableSelection === 3) {
      let kq: string = await f_addWorkPosition(selectedWorkPosition);
      if (kq === '') {
        Swal.fire("Thông báo", "Chúc mừng bạn, thêm thành công !", "success");
      }
      else {
        Swal.fire("Thông báo", "Lỗi, " + kq, "error");
      }
    }
    init();
  };
  const handleUpdateInfo = async () => {
    if (tableSelection === 1) {
      let kq: string = await f_updateMainDept(selectedMainDept);
      if (kq === '') {
        Swal.fire("Thông báo", "Chúc mừng bạn, thêm thành công !", "success");
      }
      else {
        Swal.fire("Thông báo", "Lỗi, " + kq, "error");
      }      
    } else if (tableSelection === 2) {
      let kq: string = await f_updateSubDept(selectedSubDept);
      if (kq === '') {
        Swal.fire("Thông báo", "Chúc mừng bạn, thêm thành công !", "success");
      }
      else {
        Swal.fire("Thông báo", "Lỗi, " + kq, "error");
      }
    } else if (tableSelection === 3) {
      let kq: string = await f_updateWorkPosition(selectedWorkPosition);
      if (kq === '') {
        Swal.fire("Thông báo", "Chúc mừng bạn, thêm thành công !", "success");
      }
      else {
        Swal.fire("Thông báo", "Lỗi, " + kq, "error");
      }
    }
    init();
  };
  const handleDeleteInfo = async () => {
    if (tableSelection === 1) {
      let kq: string = await f_deleteMainDept(selectedMainDept);
      if (kq === '') {
        Swal.fire("Thông báo", "Chúc mừng bạn, thêm thành công !", "success");
      }
      else {
        Swal.fire("Thông báo", "Lỗi, " + kq, "error");
      }      
    } else if (tableSelection === 2) {
      let kq: string = await f_deleteSubDept(selectedSubDept);
      if (kq === '') {
        Swal.fire("Thông báo", "Chúc mừng bạn, thêm thành công !", "success");
      }
      else {
        Swal.fire("Thông báo", "Lỗi, " + kq, "error");
      }
    } else if (tableSelection === 3) {
      let kq: string = await f_deleteWorkPosition(selectedWorkPosition);
      if (kq === '') {
        Swal.fire("Thông báo", "Chúc mừng bạn, thêm thành công !", "success");
      }
      else {
        Swal.fire("Thông báo", "Lỗi, " + kq, "error");
      }
    }
    init();
  };

  useEffect(() => {
    handleLoadMainDept();
    loadWorkPosition();
    handleLoadsubDept();
  }, []);
  return (
    <div className="dept_manager">
      <div className="tracuuDataInspection">
        <CustomDialog
          isOpen={openDialog}
          onClose={handleCloseDialog}
          title={`Add/Update info (${tableSelection === 1 ? selectedMainDept.MAINDEPTNAME : tableSelection === 2 ? selectedSubDept.SUBDEPTNAME : selectedWorkPosition.WORK_POSITION_NAME})`}
          content={<div className="forminput" style={{ backgroundImage: theme.CMS.backgroundImage }}>
            {
              tableSelection === 1 &&  <div className="maindeptinputbox">              
              <label>
                MAINDEPTCODE:{" "}
                <input
                  type="text"
                  value={selectedMainDept.MAINDEPTCODE}
                  onChange={(e) => setMainDeptInfo("MAINDEPTCODE", Number(e.target.value))}
                ></input>
              </label>
              <label>
                MAINDEPTNAME{" "}
                <input
                  type="text"
                  value={selectedMainDept.MAINDEPTNAME}
                  onChange={(e) => setMainDeptInfo("MAINDEPTNAME", e.target.value)}
                ></input>
              </label>
              <label>
                MAINDEPTNAME_KR
                <input
                  type="text"
                  value={selectedMainDept.MAINDEPTNAME_KR}
                  onChange={(e) => setMainDeptInfo("MAINDEPTNAME_KR", e.target.value)}
                ></input>
              </label>
             
            </div> 
            }
            {
              tableSelection === 2 &&  <div className="maindeptinputbox">
              <label>
                SUBDEPTCODE:{" "}
                <input
                  type="text"
                  value={selectedSubDept.SUBDEPTCODE}
                  onChange={(e) => setSubDeptInfo("SUBDEPTCODE", Number(e.target.value))}
                ></input>
              </label>
              <label>
                SUBDEPTNAME{" "}
                <input
                  type="text"
                  value={selectedSubDept.SUBDEPTNAME}
                  onChange={(e) => setSubDeptInfo("SUBDEPTNAME", e.target.value)}
                ></input>
              </label>
              <label>
                SUBDEPTNAME_KR
                <input
                  type="text"
                  value={selectedSubDept.SUBDEPTNAME_KR}
                  onChange={(e) => setSubDeptInfo("SUBDEPTNAME_KR", e.target.value)}
                ></input>
              </label>
             
            </div> 
            }
            {
              tableSelection === 3 &&  <div className="maindeptinputbox">
              <label>
                SUBDEPTCODE:{" "}
                <input
                  type="text"
                  value={selectedWorkPosition.SUBDEPTCODE}
                  onChange={(e) => setWorkPositionInfo("SUBDEPTCODE", Number(e.target.value))}
                ></input>
              </label>
              <label>
                WORK_POSITION_CODE:{" "}
                <input
                  type="text"
                  value={selectedWorkPosition.WORK_POSITION_CODE}
                  onChange={(e) => setWorkPositionInfo("WORK_POSITION_CODE", Number(e.target.value))}
                ></input>
              </label>
              <label>
                ATT_GROUP_CODE:{" "}
                <input
                  type="text"
                  value={selectedWorkPosition.ATT_GROUP_CODE}
                  onChange={(e) => setWorkPositionInfo("ATT_GROUP_CODE", Number(e.target.value))}
                ></input>
              </label>
              <label>
              WORK_POSITION_NAME{" "}
                <input
                  type="text"
                  value={selectedWorkPosition.WORK_POSITION_NAME}
                  onChange={(e) => setWorkPositionInfo("WORK_POSITION_NAME", e.target.value)}
                ></input>
              </label>
              <label>
              WORK_POSITION_NAME_KR
                <input
                  type="text"
                  value={selectedWorkPosition.WORK_POSITION_NAME_KR}
                  onChange={(e) => setWorkPositionInfo("WORK_POSITION_NAME_KR", e.target.value)}
                ></input>
              </label>
             
            </div> 
            }
                     
          </div>}
          actions={<div className="formbutton">
            <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#0bb937' }} onClick={() => {
              createNewUser();
            }}>Clear</Button>
            <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#f626da' }} onClick={async () => {
              if (getCompany() !== "CMS") {
                checkBP(
                  getUserData(),
                  ["NHANSU"],
                  ["ALL"],
                  ["ALL"],
                  async () => {
                    await handleAddInfo();
                  }
                );
              } else {
                await handleAddInfo();
              }         
            }}>Add</Button>
            <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#d19342' }} onClick={async () => {
              if (getCompany() !== "CMS") {
                checkBP(
                  getUserData(),
                  ["NHANSU"],
                  ["ALL"],
                  ["ALL"],
                  async () => {
                    await handleUpdateInfo();
                  }
                );
              } else {
                await handleUpdateInfo();
              }           
            }}>Update</Button>
            <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#ff0000' }} onClick={async () => {
              if (getCompany() !== "CMS") {
                checkBP(
                  getUserData(),
                  ["NHANSU"],
                  ["ALL"],
                  ["ALL"],
                  async () => {
                    await handleDeleteInfo();
                  }
                );
              } else {
                await handleDeleteInfo();
              }           
            }}>Delete</Button>
          </div>}
        />
        <div className="tracuuYCSXTable">{mainDeptAGTable}</div>
        <div className="tracuuYCSXTable">{subDeptAGTable}</div>
        <div className="tracuuYCSXTable">{workPositionAGTable}</div>
      </div>
    </div>
  );
};
export default DeptManager;

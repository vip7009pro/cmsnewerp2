import { IconButton, Button } from "@mui/material";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import "./UserManager.scss";
import { generalQuery, getSocket, getUserData, uploadQuery } from "../../../api/Api";
import { CUST_INFO, EmployeeTableData } from "../../../api/GlobalInterface";
import AGTable from "../../../components/DataTable/AGTable";
import { checkBP, f_getEmployeeList, f_insert_Notification_Data, f_loadWorkPositionList, zeroPad } from "../../../api/GlobalFunction";
import { BiLoaderCircle } from "react-icons/bi";
import { MdAdd } from "react-icons/md";
import CustomDialog from "../../../components/Dialog/CustomDialog";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { NotificationElement } from "../../../components/NotificationPanel/Notification";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { changeUserData } from "../../../redux/slices/globalSlice";
import { getlang } from "../../../components/String/String";
const UserManager = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [openDialog, setOpenDialog] = useState(false);
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const [resigned_check, setResignedCheck] = useState(true);
  const [custinfodatatable, setCUSTINFODataTable] = useState<Array<any>>([]);
  const [empl_info, setEmplInfo] = useState<Array<EmployeeTableData>>([]);
  const [workpositionload, setWorkPositionLoad] = useState<Array<any>>([]);
  const loadWorkPosition = async () => {
    let kq: any[] = [];
    kq = await f_loadWorkPositionList();
    console.log(kq);
    setWorkPositionLoad(kq);
  }
  const loadEmplInfo = async () => {
    let kq: EmployeeTableData[] = [];
    kq = await f_getEmployeeList();
    setEmplInfo(kq);
    if (kq.length > 0) {
      Swal.fire('Thông báo', 'Có ' + kq.length + ' nhân viên', 'success');
    }
    else {
      Swal.fire('Thông báo', 'Không có nhân viên nào', 'error');
    }
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
  const columns = [
    {
      field: 'EMPL_NO', headerName: 'ERP_ID', resizable: true, editable: false, width: 90, headerCheckboxSelection: true, checkboxSelection: true, cellRenderer: (params: any) => {
        return <span style={{ color: 'blue', fontWeight: 'bold' }}>{params.value}</span>
      }
    },
    { field: 'NV_CCID', headerName: 'NV_CCID', resizable: true, width: 50 },
    { field: 'CMS_ID', headerName: 'NS_ID', resizable: true, width: 60 },
    { field: 'FIRST_NAME', headerName: 'FIRST_NAME', resizable: true, width: 70 },
    { field: 'MIDLAST_NAME', headerName: 'MIDLAST_NAME', resizable: true, width: 90 },
    {
      field: 'FULL_NAME', headerName: 'FULL_NAME', resizable: true, width: 100, cellRenderer: (params: any) => {
        return <span style={{ color: 'green', fontWeight: 'bold' }}>{params.value}</span>
      }
    },
    { field: 'SUBDEPTNAME', headerName: 'SUBDEPT', resizable: true, width: 60 },
    { field: 'MAINDEPTNAME', headerName: 'MAINDEPT', resizable: true, width: 60 },
    { field: 'WORK_POSITION_NAME', headerName: 'WORK_POSITION', resizable: true, width: 80 },
    { field: 'POSITION_NAME', headerName: 'POSITION', resizable: true, width: 80 },
    { field: 'JOB_NAME', headerName: 'JOB_NAME', resizable: true, width: 60 },
    { field: 'WORK_SHIF_NAME', headerName: 'WORK_SHIFT', resizable: true, width: 80 },
    { field: 'DOB', headerName: 'DOB', resizable: true, width: 70 },
    { field: 'HOMETOWN', headerName: 'HOMETOWN', resizable: true, width: 150 },
    { field: 'ADD_PROVINCE', headerName: 'ADD_PROVINCE', resizable: true, width: 80 },
    { field: 'ADD_DISTRICT', headerName: 'ADD_DISTRICT', resizable: true, width: 80 },
    { field: 'ADD_COMMUNE', headerName: 'ADD_COMMUNE', resizable: true, width: 80 },
    { field: 'ADD_VILLAGE', headerName: 'ADD_VILLAGE', resizable: true, width: 80 },
    { field: 'PHONE_NUMBER', headerName: 'PHONE_NUMBER', resizable: true, width: 80 },
    { field: 'WORK_START_DATE', headerName: 'NGAY_VAO', resizable: true, width: 60 },
    { field: 'PASSWORD', headerName: 'PASSWORD', resizable: true, width: 70 },
    { field: 'EMAIL', headerName: 'EMAIL', resizable: true, width: 100 },
    { field: 'REMARK', headerName: 'REMARK', resizable: true, width: 100 },
    { field: 'ONLINE_DATETIME', headerName: 'ONLINE_DATETIME', resizable: true, width: 100 },
    { field: 'SEX_NAME', headerName: 'SEX', resizable: true, width: 50 },
    { field: 'WORK_STATUS_NAME', headerName: 'WORK_STATUS', resizable: true, width: 80 },
    { field: 'FACTORY_NAME', headerName: 'FACTORY_NAME', resizable: true, width: 80 },
    { field: 'ATT_GROUP_CODE', headerName: 'ATT_GROUP', resizable: true, width: 60 },
    { field: 'RESIGN_DATE', headerName: 'RESIGN_DATE', resizable: true, width: 100 },
  ];
  const setCustInfo = (keyname: string, value: any) => {
    let tempCustInfo: EmployeeTableData = { ...selectedRows, [keyname]: value };
    //console.log(tempcodefullinfo);
    setSelectedRows(tempCustInfo);
  };
  const autogenerateCUST_CD = async (company_type: string) => {
    let next_cust_cd: string = company_type + "001";
    await generalQuery("checkcustcd", {
      COMPANY_TYPE: company_type,
    })
      .then((response) => {
        console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let stt =
            company_type === "KH"
              ? response.data.data[0].CUST_CD.substring(2, 5)
              : response.data.data[0].CUST_CD.substring(3, 6);
          next_cust_cd = company_type + zeroPad(parseInt(stt) + 1, 3);
          console.log("nex cust_cd", next_cust_cd);
        } else {
          //Swal.fire("Thông báo", " Có lỗi : " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
        Swal.fire("Thông báo", " Có lỗi : " + error, "error");
      });
    return next_cust_cd;
  };
  const createNewCustomer = async () => {
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
  const handleCUSTINFO = () => {
    Swal.fire({
      title: "Tra data",
      text: "Đang tra data",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });
    generalQuery("get_listcustomer", {})
      .then((response) => {
        /// console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: CUST_INFO[] = response.data.data.map(
            (element: CUST_INFO, index: number) => {
              return {
                ...element,
                CUST_NAME: element.CUST_NAME ?? "",
                CUST_NAME_KD: element.CUST_NAME_KD ?? "",
                CUST_ADDR1: element.CUST_ADDR1 !== 'undefined' ? element.CUST_ADDR1 ?? "" : "",
                CUST_ADDR2: element.CUST_ADDR2 !== 'undefined' ? element.CUST_ADDR2 ?? "" : "",
                CUST_ADDR3: element.CUST_ADDR3 !== 'undefined' ? element.CUST_ADDR3 ?? "" : "",
                EMAIL: element.EMAIL ?? "",
                TAX_NO: element.TAX_NO ?? "",
                CUST_NUMBER: element.CUST_NUMBER ?? "",
                BOSS_NAME: element.BOSS_NAME ?? "",
                TEL_NO1: element.TEL_NO1 ?? "",
                FAX_NO: element.FAX_NO ?? "",
                CUST_POSTAL: element.CUST_POSTAL ?? "",
                REMK: element.REMK ?? "",
                INS_DATE: element.INS_DATE !== null ? moment.utc(element.INS_DATE).format("YYYY-MM-DD") : "",
                UPD_DATE: element.UPD_DATE !== null ? moment.utc(element.UPD_DATE).format("YYYY-MM-DD") : "",
                id: index,
              };
            },
          );
          setCUSTINFODataTable(loadeddata);
          Swal.fire(
            "Thông báo",
            "Đã load " + response.data.data.length + " dòng",
            "success",
          );
        } else {
          setCUSTINFODataTable([]);
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_addCustomer = () => {
    generalQuery("add_customer", selectedRows)
      .then(async (response) => {
        /// console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let newNotification: NotificationElement = {
            CTR_CD: '002',
            NOTI_ID: -1,
            NOTI_TYPE: "success",
            TITLE: 'Thêm nhân viên mới',
            CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${getUserData()?.FIRST_NAME}), nhân viên ${getUserData()?.WORK_POSITION_NAME} đã thêm một nhân viên mới:${selectedRows.EMPL_NO}  - ${selectedRows.MIDLAST_NAME}  -  ${selectedRows.FIRST_NAME} `,
            SUBDEPTNAME: "ALL",
            MAINDEPTNAME: "ALL",
            INS_EMPL: 'NHU1903',
            INS_DATE: '2024-12-30',
            UPD_EMPL: 'NHU1903',
            UPD_DATE: '2024-12-30',
          }
          if (await f_insert_Notification_Data(newNotification)) {
            getSocket().emit("notification_panel", newNotification);
          }
          Swal.fire("Thông báo", "Thêm khách thành công", "success");
          handleCUSTINFO();
        } else {
          Swal.fire(
            "Thông báo",
            "Thêm khách thất bại: " + response.data.message,
            "error",
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_editCustomer = () => {
    generalQuery("edit_customer", selectedRows)
      .then(async (response) => {
        /// console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let newNotification: NotificationElement = {
            CTR_CD: '002',
            NOTI_ID: -1,
            NOTI_TYPE: "info",
            TITLE: 'Update thông tin nhân viên',
            CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${getUserData()?.FIRST_NAME}), nhân viên ${getUserData()?.WORK_POSITION_NAME} đã sửa một nhân viên:${selectedRows.EMPL_NO}  - ${selectedRows.MIDLAST_NAME}  -  ${selectedRows.FIRST_NAME} `,
            SUBDEPTNAME: "ALL",
            MAINDEPTNAME: "ALL",
            INS_EMPL: 'NHU1903',
            INS_DATE: '2024-12-30',
            UPD_EMPL: 'NHU1903',
            UPD_DATE: '2024-12-30',
          }
          if (await f_insert_Notification_Data(newNotification)) {
            getSocket().emit("notification_panel", newNotification);
          }
          Swal.fire("Thông báo", "Sửa khách thành công", "success");
          handleCUSTINFO();
        } else {
          Swal.fire(
            "Thông báo",
            "Sửa khách thất bại: " + response.data.message,
            "error",
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const glbLang: string | undefined = useSelector(
    (state: RootState) => state.totalSlice.lang
  );
  const dispatch = useDispatch();
  const [file, setFile] = useState<any>(null);
  const uploadFile2 = async (empl_no: string) => {
    if (file !== null && file !== undefined) {
      if (selectedRows.EMPL_NO !== "") {
        uploadQuery(file, "NS_" + empl_no + ".jpg", "Picture_NS")
          .then((response) => {
            console.log("resopone upload:", response.data);
            if (response.data.tk_status !== "NG") {
              generalQuery("update_empl_image", {
                EMPL_NO: empl_no,
                EMPL_IMAGE: "Y",
              })
                .then((response) => {
                  if (response.data.tk_status !== "NG") {
                    dispatch(changeUserData({ ...getUserData(), EMPL_IMAGE: "Y" }));
                    Swal.fire("Thông báo", "Upload avatar thành công", "success");
                  } else {
                    Swal.fire("Thông báo", "Upload avatar thất bại", "error");
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
            } else {
              Swal.fire(
                "Thông báo",
                "Upload file thất bại:" + response.data.message,
                "error"
              );
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        Swal.fire("Thông báo", "Chọn nhân viên trước", "error");
      }
    } else {
      Swal.fire("Thông báo", "Chọn file trước", "error");
    }
  };
  const emplAGTable = useMemo(() => {
    return (
      <AGTable
        suppressRowClickSelection={false}
        toolbar={
          <div style={{ fontSize: '0.7rem', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                loadEmplInfo();
              }}
            >
              <BiLoaderCircle color="#06cc70" size={15} />
              Load Data
            </IconButton>
            <label>
              <span>Trừ người đã nghỉ_</span>
              <input
                type="checkbox"
                name="alltimecheckbox"
                checked={resigned_check}
                onChange={() => setResignedCheck(!resigned_check)}
              ></input>
            </label>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                handleOpenDialog();
              }}
            >
              <MdAdd color="#1c44f5" size={15} />
              Add/Update
            </IconButton>
          </div>}
        columns={columns}
        data={resigned_check ? empl_info.filter((e) => e.WORK_STATUS_CODE === 1) : empl_info}
        onCellEditingStopped={(params: any) => {
          //console.log(e.data)
        }} onRowClick={(params: any) => {
          setSelectedRows(params.data);
          //console.log(e.data) 
        }} onSelectionChange={(params: any) => {
          //console.log(params)
          //setSelectedRows(params!.api.getSelectedRows()[0]);
          //console.log(e!.api.getSelectedRows())
        }}
      />
    )
  }, [empl_info, resigned_check])
  useEffect(() => {
    loadEmplInfo();
    loadWorkPosition();
  }, []);
  return (
    <div className="user_manager">
      <div className="tracuuDataInspection">
        <CustomDialog
          isOpen={openDialog}
          onClose={handleCloseDialog}
          title={`Add/Update Employee (EMPL_NO: ${selectedRows?.EMPL_NO})`}
          content={<div className="forminput" style={{ backgroundImage: theme.CMS.backgroundImage }}>
            <div className="maindeptinputbox">
              <label>
                {getlang("maerp", glbLang!)}{" "}
                <input
                  type="text"
                  value={selectedRows.EMPL_NO}
                  onChange={(e) => setCustInfo("EMPL_NO", e.target.value)}
                ></input>
              </label>
              <label>
                {getlang("manhansu", glbLang!)}{" "}
                <input
                  type="text"
                  value={selectedRows.CMS_ID}
                  onChange={(e) => setCustInfo("CMS_ID", e.target.value)}
                ></input>
              </label>
              <label>
                {getlang("machamcong", glbLang!)}
                <input
                  name="gioitinh"
                  value={selectedRows.NV_CCID}
                  onChange={(e) => setCustInfo("NV_CCID", Number(e.target.value))}
                ></input>
              </label>
              <label>
                {getlang("ten", glbLang!)}{" "}
                <input
                  type="text"
                  value={selectedRows.FIRST_NAME}
                  onChange={(e) => setCustInfo("FIRST_NAME", e.target.value)}
                ></input>
              </label>
              <label>
                {getlang("hovadem", glbLang!)}
                <input
                  type="text"
                  value={selectedRows.MIDLAST_NAME}
                  onChange={(e) => setCustInfo("MIDLAST_NAME", e.target.value)}
                ></input>
              </label>
              <label>
                {getlang("ngaythangnamsinh", glbLang!)}
                <input
                  type="date"
                  value={selectedRows.DOB.slice(0, 10)}
                  onChange={(e) => setCustInfo("DOC", e.target.value)}
                ></input>
              </label>
              <label>
                {getlang("quequan", glbLang!)}
                <input
                  type="text"
                  value={selectedRows.HOMETOWN}
                  onChange={(e) => setCustInfo("HOMETOWN", e.target.value)}
                ></input>
              </label>
              <label>
                {getlang("gioitinh", glbLang!)}
                <select
                  name="gioitinh"
                  value={selectedRows.SEX_CODE}
                  onChange={(e) => setCustInfo("SEX_CODE", Number(e.target.value))}
                >
                  <option value={0}>Nữ</option>
                  <option value={1}>Nam</option>
                </select>
              </label>
            </div>
            <div className="maindeptinputbox">
              <label>
                {getlang("tinhthanhpho", glbLang!)}
                <input
                  type="text"
                  value={selectedRows.ADD_PROVINCE}
                  onChange={(e) => setCustInfo("ADD_PROVINCE", e.target.value)}
                ></input>
              </label>
              <label>
                {getlang("quanhuyen", glbLang!)}
                <input
                  type="text"
                  value={selectedRows.ADD_DISTRICT}
                  onChange={(e) => setCustInfo("ADD_DISTRICT", e.target.value)}
                ></input>
              </label>
              <label>
                {getlang("xathitran", glbLang!)}
                <input
                  type="text"
                  value={selectedRows.ADD_COMMUNE}
                  onChange={(e) => setCustInfo("ADD_COMMUNE", e.target.value)}
                ></input>
              </label>
              <label>
                {getlang("thonxom", glbLang!)}
                <input
                  type="text"
                  value={selectedRows.ADD_VILLAGE}
                  onChange={(e) => setCustInfo("ADD_VILLAGE", e.target.value)}
                ></input>
              </label>
              <label>
                {getlang("sodienthoai", glbLang!)}
                <input
                  type="text"
                  value={selectedRows.PHONE_NUMBER}
                  onChange={(e) => setCustInfo("PHONE_NUMBER", e.target.value)}
                ></input>
              </label>
              <label>
                {getlang("ngaybatdaulamviec", glbLang!)}
                <input
                  type="date"
                  value={selectedRows.WORK_START_DATE.slice(0, 10)}
                  onChange={(e) => setCustInfo("WORK_START_DATE", e.target.value)}
                ></input>
              </label>
              <label>
                {getlang("ngaynghiviec", glbLang!)}
                <input
                  disabled={selectedRows.WORK_STATUS_CODE !== 0}
                  type="date"
                  value={selectedRows.RESIGN_DATE.slice(0, 10)}
                  onChange={(e) => setCustInfo("RESIGN_DATE", e.target.value)}
                ></input>
              </label>
              <label>
                {getlang("password", glbLang!)}
                <input
                  type="password"
                  value={selectedRows.PASSWORD}
                  onChange={(e) => setCustInfo("PASSWORD", e.target.value)}
                ></input>
              </label>
            </div>
            <div className="maindeptinputbox">
              <label>
                {getlang("email", glbLang!)}
                <input
                  type="text"
                  value={selectedRows.EMAIL}
                  onChange={(e) => setCustInfo("EMAIL", e.target.value)}
                ></input>
              </label>
              <label>
                {getlang("vitrilamviec", glbLang!)}
                <select
                  name="vitrilamviec"
                  value={selectedRows.WORK_POSITION_CODE}
                  onChange={(e) => setCustInfo("WORK_POSITION_CODE", Number(e.target.value))}
                >
                  {workpositionload.map((element, index) => (
                    <option
                      key={index}
                      value={element.WORK_POSITION_CODE}
                    >
                      {element.WORK_POSITION_NAME}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {getlang("teamlamviec", glbLang!)}
                <select
                  name="calamviec"
                  value={selectedRows.WORK_SHIFT_CODE}
                  onChange={(e) => setCustInfo("WORK_SHIFT_CODE", Number(e.target.value))}
                >
                  <option value={0}>Hành chính</option>
                  <option value={1}>TEAM 1</option>
                  <option value={2}>TEAM 2</option>
                </select>
              </label>
              <label>
                {getlang("capbac", glbLang!)}
                <select
                  name="chucdanh"
                  value={selectedRows.POSITION_CODE}
                  onChange={(e) => setCustInfo("POSITION_CODE", Number(e.target.value))}
                >
                  <option value={0}>Manager</option>
                  <option value={1}>AM</option>
                  <option value={2}>Senior</option>
                  <option value={3}>Staff</option>
                  <option value={4}>No Pos</option>
                </select>
              </label>
              <label>
                {getlang("chucvu", glbLang!)}
                <select
                  name="chucvu"
                  value={selectedRows.JOB_CODE}
                  onChange={(e) => setCustInfo("JOB_CODE", Number(e.target.value))}
                >
                  <option value={1}>Dept Staff</option>
                  <option value={2}>Leader</option>
                  <option value={3}>Sub Leader</option>
                  <option value={4}>Worker</option>
                </select>
              </label>
              <label>
                {getlang("nhamay", glbLang!)}
                <select
                  name="nhamay"
                  value={selectedRows.FACTORY_CODE}
                  onChange={(e) => setCustInfo("FACTORY_CODE", Number(e.target.value))}
                >
                  <option value={1}>Nhà máy 1</option>
                  <option value={2}>Nhà máy 2</option>
                </select>
              </label>
              <label>
                {getlang("trangthailamviec", glbLang!)}
                <select
                  name="trangthailamviec"
                  value={selectedRows.WORK_STATUS_CODE}
                  onChange={(e) => setCustInfo("WORK_STATUS_CODE", Number(e.target.value))}
                >
                  <option value={0}>Đã nghỉ</option>
                  <option value={1}>Đang làm</option>
                  <option value={2}>Nghỉ sinh</option>
                </select>
              </label>
            </div>
          </div>}
          actions={<div className="formbutton">
            <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#0bb937' }} onClick={() => {
              createNewCustomer();
            }}>Clear</Button>
            <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#f626da' }} onClick={() => {
              handle_addCustomer();
            }}>Add</Button>
            <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#d19342' }} onClick={() => {
              handle_editCustomer();
            }}>Update</Button>
          </div>}
        />
        <div className="tracuuYCSXTable">{emplAGTable}</div>
      </div>
      <div className="updateform" style={{ backgroundImage: theme.CMS.backgroundImage }}>
        <div className="emplpicture">
          {selectedRows.EMPL_IMAGE === "Y" && (
            <img
              width={220}
              height={300}
              src={"/Picture_NS/NS_" + selectedRows.EMPL_NO + ".jpg"}
              alt={selectedRows.EMPL_NO}
            ></img>
          )}
          {selectedRows.EMPL_IMAGE !== "Y" && (
            <img
              width={220}
              height={300}
              src={"/noimage.webp"}
              alt={selectedRows.EMPL_NO}
            ></img>
          )}
          <div className="uploadavatardiv">
            Change Avatar:
            <input
              accept=".jpg"
              type="file"
              onChange={(e: any) => {
                setFile(e.target.files[0]);
                console.log(e.target.files[0]);
              }}
            />
            <IconButton
              className="buttonIcon"
              onClick={() => {
                checkBP(
                  getUserData(),
                  ["NHANSU"],
                  ["ALL"],
                  ["ALL"],
                  async () => {
                    uploadFile2(selectedRows.EMPL_NO);
                  }
                );
              }}
            >
              <AiOutlineCloudUpload color="yellow" size={15} />
              Upload
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserManager;

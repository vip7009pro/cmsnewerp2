import { IconButton, Button } from "@mui/material";
import moment from "moment";
import React, { useContext, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import "./CUST_MANAGER.scss";
import { generalQuery, getSocket, getUserData } from "../../../api/Api";
import { CUST_INFO } from "../../../api/GlobalInterface";
import AGTable from "../../../components/DataTable/AGTable";
import { f_insert_Notification_Data, zeroPad } from "../../../api/GlobalFunction";
import { BiLoaderCircle } from "react-icons/bi";
import { MdAdd } from "react-icons/md";
import CustomDialog from "../../../components/Dialog/CustomDialog";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { NotificationElement } from "../../../components/NotificationPanel/Notification";
const CUST_MANAGER = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [openDialog, setOpenDialog] = useState(false);
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const [custinfodatatable, setCUSTINFODataTable] = useState<Array<any>>([]);
  const [selectedRows, setSelectedRows] = useState<CUST_INFO>({
    id: "1",
    CUST_TYPE: "KH",
    CUST_CD: "",
    CUST_NAME_KD: "",
    CUST_NAME: "",
    CUST_ADDR1: "",
    CUST_ADDR2: "",
    CUST_ADDR3: "",
    EMAIL: "",
    TAX_NO: "",
    CUST_NUMBER: "",
    BOSS_NAME: "",
    TEL_NO1: "",
    FAX_NO: "",
    CUST_POSTAL: "",
    REMK: "",
    USE_YN: "Y",
    INS_DATE: "",
    INS_EMPL: "",
    UPD_DATE: "",
    UPD_EMPL: "",
  });
  const columns = [
    { field: 'CUST_TYPE', headerName: 'CUST_TYPE', resizable: true, width: 100, headerCheckboxSelection: true, checkboxSelection: true },
    { field: 'CUST_CD', headerName: 'CUST_CD', resizable: true, width: 100 },
    { field: 'CUST_NAME_KD', headerName: 'CUST_NAME_KD', resizable: true, width: 100 },
    { field: 'CUST_NAME', headerName: 'CUST_NAME', resizable: true, width: 100 },
    { field: 'CUST_ADDR1', headerName: 'CUST_ADDR1', resizable: true, width: 100 },
    { field: 'CUST_ADDR2', headerName: 'CUST_ADDR2', resizable: true, width: 100 },
    { field: 'CUST_ADDR3', headerName: 'CUST_ADDR3', resizable: true, width: 100 },
    { field: 'TAX_NO', headerName: 'TAX_NO', resizable: true, width: 100 },
    { field: 'CUST_NUMBER', headerName: 'CUST_NUMBER', resizable: true, width: 100 },
    { field: 'BOSS_NAME', headerName: 'BOSS_NAME', resizable: true, width: 100 },
    { field: 'TEL_NO1', headerName: 'TEL_NO1', resizable: true, width: 100 },
    { field: 'FAX_NO', headerName: 'FAX_NO', resizable: true, width: 100 },
    { field: 'CUST_POSTAL', headerName: 'CUST_POSTAL', resizable: true, width: 100 },
    { field: 'EMAIL', headerName: 'EMAIL', resizable: true, width: 100 },
    { field: 'REMK', headerName: 'REMK', resizable: true, width: 100 },
    { field: 'USE_YN', headerName: 'USE_YN', resizable: true, width: 50, cellRenderer: (params: any) => {
      return (
        <div style={{
          backgroundColor: params.data.USE_YN === 'Y' ? '#4caf50' : '#f44336',
          color: 'white',            
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          {params.value === 'Y' ? 'USE' : 'NOT USE'}
        </div>
      )
    } },
    { field: 'INS_DATE', headerName: 'INS_DATE', resizable: true, width: 100 },
    { field: 'INS_EMPL', headerName: 'INS_EMPL', resizable: true, width: 100 },
    { field: 'UPD_DATE', headerName: 'UPD_DATE', resizable: true, width: 100 },
    { field: 'UPD_EMPL', headerName: 'UPD_EMPL', resizable: true, width: 100 },
  ];

  const setCustInfo = (keyname: string, value: any) => {
    let tempCustInfo: CUST_INFO = { ...selectedRows, [keyname]: value };
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
  const createNewCustomer = async (company_type: string) => {
    let next_cust_cd = await autogenerateCUST_CD(company_type);
    setSelectedRows({
      id: "0",
      CUST_TYPE: company_type,
      BOSS_NAME: "",
      CUST_ADDR1: "",
      CUST_ADDR2: "",
      CUST_ADDR3: "",
      EMAIL: "",
      CUST_CD: next_cust_cd,
      CUST_NAME: "",
      CUST_NAME_KD: "",
      CUST_NUMBER: "",
      CUST_POSTAL: "",
      FAX_NO: "",
      INS_DATE: "",
      INS_EMPL: "",
      REMK: "",
      USE_YN: "Y",
      TAX_NO: "",
      TEL_NO1: "",
      UPD_DATE: "",
      UPD_EMPL: "",
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
            TITLE: 'Thêm khách hàng mới',
            CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${getUserData()?.FIRST_NAME}), nhân viên ${getUserData()?.WORK_POSITION_NAME} đã thêm một khách hàng mới:${selectedRows.CUST_CD}  - ${selectedRows.CUST_NAME_KD}  -  ${selectedRows.CUST_NAME} `,
            SUBDEPTNAME: "ALL",
            MAINDEPTNAME: "ALL",
            INS_EMPL: 'NHU1903',
            INS_DATE: '2024-12-30',
            UPD_EMPL: 'NHU1903',
            UPD_DATE: '2024-12-30',
          }  
          if(await f_insert_Notification_Data(newNotification))
          {
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
            TITLE: 'Update thông tin khách hàng',
            CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${getUserData()?.FIRST_NAME}), nhân viên ${getUserData()?.WORK_POSITION_NAME} đã sửa một khách hàng:${selectedRows.CUST_CD}  - ${selectedRows.CUST_NAME_KD}  -  ${selectedRows.CUST_NAME} `,
            SUBDEPTNAME: "ALL",
            MAINDEPTNAME: "ALL",
            INS_EMPL: 'NHU1903',
            INS_DATE: '2024-12-30',
            UPD_EMPL: 'NHU1903',
            UPD_DATE: '2024-12-30',
          }  
          if(await f_insert_Notification_Data(newNotification))
          {
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
  const customerDataTableAG = useMemo(() => {
    return (
      <AGTable
        suppressRowClickSelection={false}
        toolbar={
          <div>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                handleCUSTINFO();
              }}
            >
              <BiLoaderCircle color="#06cc70" size={15} />
              Load Data
            </IconButton>
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
        data={custinfodatatable}
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
  }, [custinfodatatable])
  useEffect(() => {
    handleCUSTINFO();
  }, []);
  return (
    <div className="cust_manager">
      <div className="tracuuDataInspection">
        <div className="tracuuDataInspectionform">
          <CustomDialog
            isOpen={openDialog}
            onClose={handleCloseDialog}
            title={`Add/Update Customer (CUST_CD: ${selectedRows?.CUST_CD})`}
            content={<div className="forminput" style={{ backgroundImage: theme.CMS.backgroundImage }}>
              <div className="forminputcolumn">
                <label>
                  <b>Mã KH:</b>{" "}
                  <input
                    type="text"
                    placeholder="Mã khách hàng"
                    value={selectedRows?.CUST_CD}
                    onChange={(e) => setCustInfo("CUST_CD", e.target.value)}
                  ></input>
                </label>
                <label>
                  <b>Tên KH(KD):</b>{" "}
                  <input
                    type="text"
                    placeholder="Tên khách hàng"
                    value={selectedRows?.CUST_NAME_KD}
                    onChange={(e) => setCustInfo("CUST_NAME_KD", e.target.value)}
                  ></input>
                </label>
                <label>
                  <b>Tên KH(FULL):</b>{" "}
                  <input
                    type="text"
                    placeholder="Tên khách hàng"
                    value={selectedRows?.CUST_NAME}
                    onChange={(e) => setCustInfo("CUST_NAME", e.target.value)}
                  ></input>
                </label>
                <label>
                  <b>Địa chỉ chính:</b>{" "}
                  <input
                    type="text"
                    placeholder="Địa chỉ"
                    value={selectedRows?.CUST_ADDR1}
                    onChange={(e) => setCustInfo("CUST_ADDR1", e.target.value)}
                  ></input>
                </label>
                <label>
                  <b>Địa chỉ 2:</b>{" "}
                  <input
                    type="text"
                    placeholder="Địa chỉ"
                    value={selectedRows?.CUST_ADDR2}
                    onChange={(e) => setCustInfo("CUST_ADDR2", e.target.value)}
                  ></input>
                </label>
                <label>
                  <b>Địa chỉ 3:</b>{" "}
                  <input
                    type="text"
                    placeholder="Địa chỉ"
                    value={selectedRows?.CUST_ADDR3}
                    onChange={(e) => setCustInfo("CUST_ADDR3", e.target.value)}
                  ></input>
                </label>
                <label>
                  <b>MST</b>{" "}
                  <input
                    type="text"
                    placeholder="Mã số thuế"
                    value={selectedRows?.TAX_NO}
                    onChange={(e) => setCustInfo("TAX_NO", e.target.value)}
                  ></input>
                </label>
                <label>
                  <b>Số ĐT:</b>{" "}
                  <input
                    type="text"
                    placeholder="Số điện thoại"
                    value={selectedRows?.CUST_NUMBER}
                    onChange={(e) => setCustInfo("CUST_NUMBER", e.target.value)}
                  ></input>
                </label>
              </div>

              <div className="forminputcolumn">

                <label>
                  <b>Tên chủ:</b>{" "}
                  <input
                    type="text"
                    placeholder="Tên chủ"
                    value={selectedRows?.BOSS_NAME}
                    onChange={(e) => setCustInfo("BOSS_NAME", e.target.value)}
                  ></input>
                </label>
                <label>
                  <b>Số phone:</b>{" "}
                  <input
                    type="text"
                    placeholder="Số phone"
                    value={selectedRows?.TEL_NO1}
                    onChange={(e) => setCustInfo("TEL_NO1", e.target.value)}
                  ></input>
                </label>
                <label>
                  <b>Fax:</b>{" "}
                  <input
                    type="text"
                    placeholder="FAX"
                    value={selectedRows?.FAX_NO}
                    onChange={(e) => setCustInfo("FAX_NO", e.target.value)}
                  ></input>
                </label>
                <label>
                  <b>Mã bưu điện:</b>{" "}
                  <input
                    type="text"
                    placeholder="Mã bưu điện"
                    value={selectedRows?.CUST_POSTAL}
                    onChange={(e) => setCustInfo("CUST_POSTAL", e.target.value)}
                  ></input>
                </label>
                <label>
                  <b>Remark:</b>{" "}
                  <input
                    type="text"
                    placeholder="Ghi chú"
                    value={selectedRows?.REMK}
                    onChange={(e) => setCustInfo("REMK", e.target.value)}
                  ></input>
                </label>
                <label>
                  <b>Email:</b>{" "}
                  <input
                    type="text"
                    placeholder="Email"
                    value={selectedRows?.EMAIL}
                    onChange={(e) => setCustInfo("EMAIL", e.target.value)}
                  ></input>
                </label>
                <label>
                  <b>Phân loại:</b>{" "}
                  <select
                    name="plvendor"
                    value={selectedRows?.CUST_TYPE}
                    onChange={(e) => {
                      setCustInfo("CUST_TYPE", e.target.value);
                    }}
                  >
                    <option value="KH">Khách Hàng</option>
                    <option value="NCC">Nhà Cung Cấp</option>
                  </select>
                </label>
                <label>
                  <b>Mở/Khóa:</b>{" "}
                  <select
                    name="plvendor"
                    value={selectedRows?.USE_YN}
                    onChange={(e) => {
                      setCustInfo("USE_YN", e.target.value);
                    }}
                  >
                    <option value="Y">Mở</option>
                    <option value="N">Khóa</option>
                  </select>
                </label>
              </div>
            </div>}
            actions={<div className="formbutton">
              <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#0bb937' }} onClick={() => {
                createNewCustomer(selectedRows.CUST_TYPE);
              }}>Clear</Button>
              <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#f626da' }} onClick={() => {
                handle_addCustomer();
              }}>Add</Button>
              <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#d19342' }} onClick={() => {
                handle_editCustomer();
              }}>Update</Button>
            </div>}
          />

        </div>
        <div className="tracuuYCSXTable">{customerDataTableAG}</div>
      </div>
    </div>
  );
};
export default CUST_MANAGER;

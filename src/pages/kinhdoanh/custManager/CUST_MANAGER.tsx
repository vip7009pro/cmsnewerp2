import { IconButton, Button } from "@mui/material";
import moment from "moment";
import React, { useContext, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import "./CUST_MANAGER2.scss";
import { generalQuery } from "../../../api/Api";
import { CUST_INFO } from "../../../api/GlobalInterface";
import AGTable from "../../../components/DataTable/AGTable";
import { zeroPad } from "../../../api/GlobalFunction";
const CUST_MANAGER = () => {
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
    INS_DATE: "",
    INS_EMPL: "",
    UPD_DATE: "",
    UPD_EMPL: "",
  });
  const columns = [
    { field: 'CUST_TYPE', headerName: 'CUST_TYPE', resizable: true, width: 100, headerCheckboxSelection: true, checkboxSelection: true},
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
      TAX_NO: "",
      TEL_NO1: "",
      UPD_DATE: "",
      UPD_EMPL: "",
    });
  };
  const handleCUSTINFO = () => {
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
      .then((response) => {
        /// console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
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
      .then((response) => {
        /// console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
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
        toolbar={
          <div>
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
    <div className="cust_manager2">
      <div className="tracuuDataInspection">
        <div className="tracuuDataInspectionform">
          <div className="forminput">
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
            </div>
            <div className="forminputcolumn">
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
            </div>
            <div className="forminputcolumn">
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
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Số ĐT:</b>{" "}
                <input
                  type="text"
                  placeholder="Số điện thoại"
                  value={selectedRows?.CUST_NUMBER}
                  onChange={(e) => setCustInfo("CUST_NUMBER", e.target.value)}
                ></input>
              </label>
              <label>
                <b>Tên chủ:</b>{" "}
                <input
                  type="text"
                  placeholder="Tên chủ"
                  value={selectedRows?.BOSS_NAME}
                  onChange={(e) => setCustInfo("BOSS_NAME", e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
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
            </div>
            <div className="forminputcolumn">
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
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Email:</b>{" "}
                <input
                  type="text"
                  placeholder="Email"
                  value={selectedRows?.EMAIL}
                  onChange={(e) => setCustInfo("REMK", e.target.value)}
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
            </div>
          </div>
          <div className="formbutton">
            <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#afc016' }} onClick={() => {
              handleCUSTINFO();
            }}>Load</Button>
            <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#0bb937' }} onClick={() => {
              createNewCustomer(selectedRows.CUST_TYPE);
            }}>New</Button>
          </div>
          <div className="formbutton">
            <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#f626da' }} onClick={() => {
              handle_addCustomer();
            }}>Add</Button>
            <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#d19342' }} onClick={() => {
              handle_editCustomer();
            }}>Update</Button>
          </div>
        </div>
        <div className="tracuuYCSXTable">{customerDataTableAG}</div>
      </div>
    </div>
  );
};
export default CUST_MANAGER;

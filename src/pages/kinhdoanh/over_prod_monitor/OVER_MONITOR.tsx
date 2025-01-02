import { IconButton } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import "./OVER_MONITOR.scss";
import { getSocket, getUserData } from "../../../api/Api";
import { MdCancel, MdInput, MdRefresh } from "react-icons/md";
import { PROD_OVER_DATA } from "../../../api/GlobalInterface";
/* import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; */ // Optional Theme applied to the grid
import AGTable from "../../../components/DataTable/AGTable";
import { CustomCellRendererProps } from "ag-grid-react";
import { checkBP, f_insert_Notification_Data, f_loadProdOverData, f_updateProdOverData } from "../../../api/GlobalFunction";
import { AiFillCloseCircle } from "react-icons/ai";
import { NotificationElement } from "../../../components/NotificationPanel/Notification";
const OVER_MONITOR = () => {
  const [only_pending, setOnly_Pending] = useState(true)
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);
  const sltRows = useRef<PROD_OVER_DATA[]>([]);
  const [data, setData] = useState<Array<PROD_OVER_DATA>>([]);
  const loadProdOverData = async () => {
    Swal.fire({
      title: "Tra data",
      text: "Đang tra data",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });
    setData(await f_loadProdOverData(only_pending));
  }
  const updateData = async (prod_over_data: PROD_OVER_DATA, updateValue: string) => {
    Swal.fire({
      title: "Chắc chắn muốn update Data ?",
      text: "Suy nghĩ kỹ trước khi hành động",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn update!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        switch (getUserData()?.MAINDEPTNAME) {
          case 'KD':
            await f_updateProdOverData(prod_over_data, updateValue)
            let newNotification: NotificationElement = {
              CTR_CD: '002',
              NOTI_ID: -1,
              NOTI_TYPE: "success",
              TITLE: 'Xác nhận hàng sản xuất dư',
              CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${getUserData()?.FIRST_NAME}), nhân viên ${getUserData()?.WORK_POSITION_NAME} đã xác nhận ${updateValue==='Y'? 'NHẬP': 'HỦY'} hàng sản xuất dư code ${prod_over_data.G_NAME_KD}, số YCSX: (${prod_over_data.PROD_REQUEST_NO}, số lượng dư là: ${prod_over_data.OVER_QTY} EA).` , 
              SUBDEPTNAME: "KD,INSPECTION",
              MAINDEPTNAME: "KD,INSPECTION",
              INS_EMPL: 'NHU1903',
              INS_DATE: '2024-12-30',
              UPD_EMPL: 'NHU1903',
              UPD_DATE: '2024-12-30',
            }  
            if(await f_insert_Notification_Data(newNotification))
            {
              getSocket().emit("notification_panel", newNotification);
            }
            await loadProdOverData();
            break;
          default:
            Swal.fire('Thông báo', 'Bạn không thuộc bộ phận kinh doanh', 'success');
        }
      }
    });
  }
  const handleNhapHuyHangLoat = (selectedRows: PROD_OVER_DATA[], updatevalue: string) => {
    Swal.fire({
      title: "Chắc chắn muốn update Data ?",
      text: "Suy nghĩ kỹ trước khi hành động",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn update!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        switch (getUserData()?.MAINDEPTNAME) {
          case 'KD':
            for (let i = 0; i < selectedRows.length; i++) {
              if(selectedRows[i].HANDLE_STATUS !=='C') await f_updateProdOverData(selectedRows[i], updatevalue)
            }
            let newNotification: NotificationElement = {
              CTR_CD: '002',
              NOTI_ID: -1,
              NOTI_TYPE: "success",
              TITLE: 'Xác nhận hàng sản xuất dư',
              CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${getUserData()?.FIRST_NAME}), nhân viên ${getUserData()?.WORK_POSITION_NAME} đã xác nhận hàng sản xuất dư hàng loạt`, 
              SUBDEPTNAME: "KD,INSPECTION",
              MAINDEPTNAME: "KD,INSPECTION",
              INS_EMPL: 'NHU1903',
              INS_DATE: '2024-12-30',
              UPD_EMPL: 'NHU1903',
              UPD_DATE: '2024-12-30',
            }  
            if(await f_insert_Notification_Data(newNotification))
            {
              getSocket().emit("notification_panel",newNotification);
            }
            break;
          default:
            Swal.fire('Thông báo', 'Bạn không thuộc bộ phận kinh doanh', 'success');
        }
        await loadProdOverData();
        sltRows.current = []
      }
    });
  }
  const colDefs2 = [
    {
      field: 'AUTO_ID', headerName: 'ID', headerCheckboxSelection: true, checkboxSelection: true, width: 50, resizable: true, pinned: 'left', floatingFilter: true, /* cellStyle: (params:any) => {     
       if (params.data.M_ID%2==0 ) {
        return { backgroundColor: '#d4edda', color: '#155724' };
      } else {
        return { backgroundColor: '#f8d7da', color: '#721c24' };
      } 
    } */},
    { field: 'EMPL_NO', headerName: 'KD_EMPL_NO', width: 90, resizable: true, floatingFilter: true, filter: true, editable: false },
    { field: 'CUST_NAME_KD', headerName: 'CUSTOMER', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false },
    { field: 'G_CODE', headerName: 'G_CODE', width: 70, resizable: true, floatingFilter: true, filter: true, editable: false },
    { field: 'G_NAME', headerName: 'G_NAME', width: 150, resizable: true, floatingFilter: true, filter: true, editable: false },
    { field: 'G_NAME_KD', headerName: 'G_NAME_KD', width: 150, resizable: true, floatingFilter: true, filter: true, editable: false },
    { field: 'PROD_REQUEST_NO', headerName: 'PROD_REQUEST_NO', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false },
    { field: 'PLAN_ID', headerName: 'PLAN_ID', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false },
    {
      field: 'PROD_REQUEST_QTY', headerName: 'YCSX_QTY', width: 70, resizable: true, floatingFilter: true, filter: true, editable: false, cellRenderer: (params: CustomCellRendererProps) => {
        return (
          <span style={{ color: 'blue', fontWeight: 'bold' }}>{params.data.PROD_REQUEST_QTY?.toLocaleString('en-US')}</span>
        )
      }
    },
    {
      field: 'OVER_QTY', headerName: 'OVER_QTY', width: 70, resizable: true, floatingFilter: true, filter: true, editable: false, cellRenderer: (params: CustomCellRendererProps) => {
        return (
          <span style={{ color: 'red', fontWeight: 'bold' }}>{params.data.OVER_QTY?.toLocaleString('en-US')}</span>
        )
      }
    },
    {
      field: 'PROD_LAST_PRICE', headerName: 'PRICE', width: 70, resizable: true, floatingFilter: true, filter: true, editable: false, cellRenderer: (params: CustomCellRendererProps) => {
        return (
          <span style={{ color: 'gray', fontWeight: 'bold' }}>{params.data.PROD_LAST_PRICE?.toLocaleString('en-US')}</span>
        )
      }
    },
    {
      field: 'AMOUNT', headerName: 'AMOUNT', width: 70, resizable: true, floatingFilter: true, filter: true, editable: false, cellRenderer: (params: CustomCellRendererProps) => {
        return (
          <span style={{ color: '#7516c2', fontWeight: 'bold' }}>{params.data.AMOUNT?.toLocaleString('en-US', { style: "currency", currency: 'USD' })}</span>
        )
      }
    },
    {
      field: 'KD_CFM', headerName: 'KD_CFM', width: 110, resizable: true, floatingFilter: true, filter: true, editable: false, cellRenderer: (params: CustomCellRendererProps) => {
        const [showhidecell, setshowHideCell] = useState(params.data.KD_CFM === 'P')
        return (
          <div className="checkboxcell">
            {!showhidecell && <>
              <label>
                <input
                  type="radio"
                  name={params.data.AUTO_ID + 'A'}
                  value="Y"
                  checked={params.data.KD_CFM === 'Y'}
                  onChange={(e) => {
                    checkBP(getUserData(), ["KD"], ["ALL"], ["ALL"], async () => {
                      if (params.data.HANDLE_STATUS === 'P') {
                        await updateData(params.data, 'Y');
                      }
                      else {
                        Swal.fire('Thông báo', 'Đã xử lý xong, không update lại trạng thái được nữa', 'error');
                      }
                    })
                  }}
                />
                <span>NHẬP</span>
              </label>
              <label>
                <input
                  type="radio"
                  name={params.data.AUTO_ID + 'A'}
                  value="N"
                  checked={params.data.KD_CFM === 'N'}
                  onChange={(e) => {
                    checkBP(getUserData(), ["KD"], ["ALL"], ["ALL"], async () => {
                      if (params.data.HANDLE_STATUS === 'P') {
                        await updateData(params.data, 'N');
                      }
                      else {
                        Swal.fire('Thông báo', 'Đã xử lý xong, không update lại trạng thái được nữa', 'error');
                      }
                    })
                  }}
                />
                <span>HỦY</span>
              </label>
            </>}
            {showhidecell && <span style={{ color: 'black' }} onClick={() => { setshowHideCell(prev => !prev) }}>{params.data.KD_CFM === 'Y' ? 'NHẬP' : params.data.KD_CFM === 'N' ? 'HỦY' : 'PENDING'}</span>}
          </div>
        )
      },
      cellStyle: (params: any) => {
        if (params.data.KD_CFM === 'Y') {
          return { backgroundColor: '#77da41', color: 'white' };
        }
        else if (params.data.KD_CFM === 'N') {
          return { backgroundColor: '#ff0000', color: 'white' };
        }
        else {
          return { backgroundColor: '#e7a44b', color: 'white' };
        }
      }
    },
    { field: 'KD_EMPL_NO', headerName: 'KD_CFM_EMPL', width: 90, resizable: true, floatingFilter: true, filter: true, editable: false },
    { field: 'KD_CF_DATETIME', headerName: 'KD_CF_DATETIME', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false },
    { field: 'KD_REMARK', headerName: 'KD_REMARK', width: 100, resizable: true, floatingFilter: true, filter: true, editable: true },
    {
      field: 'HANDLE_STATUS', headerName: 'HANDLE_STATUS', width: 110, resizable: true, floatingFilter: true, filter: true, editable: false, cellRenderer: (params: CustomCellRendererProps) => {
        if (params.data.HANDLE_STATUS === 'P')
          return (
            <span style={{ color: 'black' }}>PENDING</span>
          )
        else
          return (
            <span style={{ color: 'black' }}>CLOSED</span>
          )
      },
      cellStyle: (params: any) => {
        if (params.data.HANDLE_STATUS === 'C') {
          return { backgroundColor: '#77da41', color: 'white' };
        }
        else if (params.data.HANDLE_STATUS === 'Y') {
          return { backgroundColor: '#ff0000', color: 'white' };
        }
        else {
          return { backgroundColor: '#e7a44b', color: 'white' };
        }
      }
    },
    { field: 'INS_DATE', headerName: 'INS_DATE', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false },
    { field: 'INS_EMPL', headerName: 'INS_EMPL', width: 70, resizable: true, floatingFilter: true, filter: true, editable: false },
    { field: 'UPD_DATE', headerName: 'UPD_DATE', width: 100, resizable: true, floatingFilter: true, filter: true, editable: false },
    { field: 'UPD_EMPL', headerName: 'UPD_EMPL', width: 70, resizable: true, floatingFilter: true, filter: true, editable: false },
  ];
  const material_data_ag_table = useMemo(() => {
    return (
      <AGTable
        showFilter={true}
        toolbar={
          <div className="headerform">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>PRODUCTION OVER MONITOR</span>
              <label>
                <span style={{ fontSize: '0.6rem', fontWeight: 'bold' }}>Only Pending</span>
                <input
                  className="checkbox1"
                  type="checkbox"
                  placeholder="Active"
                  checked={only_pending}
                  onChange={(e) => setOnly_Pending(e.target.checked)}
                ></input>
              </label>
            </div>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                loadProdOverData();
              }}
            >
              <MdRefresh color="#fb6812" size={20} />
              Reload
            </IconButton>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                handleNhapHuyHangLoat(sltRows.current, 'Y');
              }}
            >
              <MdInput color="#00bba2" size={20} />
              Nhập hàng loạt
            </IconButton>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                handleNhapHuyHangLoat(sltRows.current,'N');
              }}
            >
              <MdCancel color="#d42d57" size={20} />
              Hủy hàng loạt
            </IconButton>
          </div>}
        columns={colDefs2}
        data={data}
        onCellEditingStopped={(params: any) => {
          console.log(params)
        }}
        onCellClick={(params: any) => {
          //setClickedRows(params.data)
        }}
        onSelectionChange={(params: any) => {
          //console.log(e!.api.getSelectedRows())
          sltRows.current = params!.api.getSelectedRows()
        }} />
    )
  }, [data, colDefs2])
  useEffect(() => {
    loadProdOverData();
  }, []);
  return (
    <div className="sample_monitor">
      <div className="tracuuDataInspection">
        <div className="tracuuYCSXTable">
          {material_data_ag_table}
        </div>
        {showhidePivotTable && (
          <div className="pivottable1">
            <IconButton
              className="buttonIcon"
              onClick={() => {
                setShowHidePivotTable(false);
              }}
            >
              <AiFillCloseCircle color="blue" size={15} />
              Close
            </IconButton>
          </div>
        )}
      </div>
    </div>
  );
};
export default OVER_MONITOR;

import { useState, useEffect, useMemo } from 'react';
import { generalQuery, getGlobalSetting } from '../../api/Api';
import './CustomerPoBalanceByTypeNew.scss'
import { WEB_SETTING_DATA } from '../../api/GlobalInterface';
import AGTable from './AGTable';
const CustomerPobalancebyTypeNew = () => {
  const [pobalancecustomerbytypedata, setPoBalanceCustomerData] = useState<any>([]);
  const loadpobalance = () => {
    generalQuery("customerpobalancebyprodtype_new", {
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          let loadeddata =
            response.data.data.map(
              (element: any, index: number) => {
                return {
                  ...element,
                  id: index,
                };
              },
            );
          setPoBalanceCustomerData(loadeddata);
        } else {
          //Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const columnsAG = [
    {
      field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 95, cellRenderer: (params: any) => {
        if (params.data.CUST_NAME_KD === 'TOTAL') {
          return <span style={{ fontWeight: 'bold' }}>{params.value}</span>
        }
        else {
          return <span style={{ fontWeight: 'normal' }}>{params.value}</span>
        }
      }, cellStyle: (params: any) => {
        if (params.data.CUST_NAME_KD === "TOTAL") {
          return (
            { backgroundColor: "#22e622", color: "#0905ec", textAlign: "left" }
          );
        } else {
          return;
        }
      }
    },
    {
      field: "TOTAL_QTY", headerName: "TOTAL_QTY", width: 95, cellRenderer: (params: any) => {
        if (params.data.CUST_NAME_KD === 'TOTAL') {
          return <span style={{ fontWeight: 'bold' }}>{params.value?.toLocaleString('en-US')}</span>
        }
        else {
          return <span style={{ fontWeight: 'normal' }}>{params.value?.toLocaleString('en-US')}</span>
        }
      }, cellStyle: (params: any) => {
        if (params.data.CUST_NAME_KD === "TOTAL") {
          return (
            { backgroundColor: "#22e622", color: "#0905ec", textAlign: "right" }
          );
        } else {
          return (
            { textAlign: "right" }
          );
        }
      }
    },
    {
      field: "TOTAL_AMOUNT", headerName: "TOTAL_AMOUNT", width: 95, cellRenderer: (params: any) => {
        if (params.data.CUST_NAME_KD === 'TOTAL') {
          return <span style={{ fontWeight: 'bold' }}>{params.value?.toLocaleString('en-US', { style: "currency", currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD", })}</span>
        }
        else {
          return <span style={{ fontWeight: 'normal', color: '#099b2d' }}>{params.value?.toLocaleString('en-US', { style: "currency", currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD", })}</span>
        }
      }, cellStyle: (params: any) => {
        if (params.data.CUST_NAME_KD === "TOTAL") {
          return (
            { backgroundColor: "#22e622", color: "#0905ec", textAlign: "right" }
          );
        } else {
          return (
            { textAlign: "right" }
          );
        }
      }
    },
    {
      field: "TSP_QTY", headerName: "TSP_QTY", width: 95, cellRenderer: (params: any) => {
        if (params.data.CUST_NAME_KD === 'TOTAL') {
          return <span style={{ fontWeight: 'bold' }}>{params.value?.toLocaleString('en-US')}</span>
        }
        else {
          return <span style={{ fontWeight: 'normal' }}>{params.value?.toLocaleString('en-US')}</span>
        }
      }, cellStyle: (params: any) => {
        if (params.data.CUST_NAME_KD === "TOTAL") {
          return (
            { backgroundColor: "#22e622", color: "#0905ec", textAlign: "right" }
          );
        } else {
          return (
            { textAlign: "right" }
          );
        }
      }
    },
    {
      field: "LABEL_QTY", headerName: "LABEL_QTY", width: 95, cellRenderer: (params: any) => {
        if (params.data.CUST_NAME_KD === 'TOTAL') {
          return <span style={{ fontWeight: 'bold' }}>{params.value?.toLocaleString('en-US')}</span>
        }
        else {
          return <span style={{ fontWeight: 'normal' }}>{params.value?.toLocaleString('en-US')}</span>
        }
      }, cellStyle: (params: any) => {
        if (params.data.CUST_NAME_KD === "TOTAL") {
          return (
            { backgroundColor: "#22e622", color: "#0905ec", textAlign: "right" }
          );
        } else {
          return (
            { textAlign: "right" }
          );
        }
      }
    },
    {
      field: "UV_QTY", headerName: "UV_QTY", width: 95, cellRenderer: (params: any) => {
        if (params.data.CUST_NAME_KD === 'TOTAL') {
          return <span style={{ fontWeight: 'bold' }}>{params.value?.toLocaleString('en-US')}</span>
        }
        else {
          return <span style={{ fontWeight: 'normal' }}>{params.value?.toLocaleString('en-US')}</span>
        }
      }, cellStyle: (params: any) => {
        if (params.data.CUST_NAME_KD === "TOTAL") {
          return (
            { backgroundColor: "#22e622", color: "#0905ec", textAlign: "right" }
          );
        } else {
          return (
            { textAlign: "right" }
          );
        }
      }
    },
    {
      field: "OLED_QTY", headerName: "OLED_QTY", width: 95, cellRenderer: (params: any) => {
        if (params.data.CUST_NAME_KD === 'TOTAL') {
          return <span style={{ fontWeight: 'bold' }}>{params.value?.toLocaleString('en-US')}</span>
        }
        else {
          return <span style={{ fontWeight: 'normal' }}>{params.value?.toLocaleString('en-US')}</span>
        }
      }, cellStyle: (params: any) => {
        if (params.data.CUST_NAME_KD === "TOTAL") {
          return (
            { backgroundColor: "#22e622", color: "#0905ec", textAlign: "right" }
          );
        } else {
          return (
            { textAlign: "right" }
          );
        }
      }
    },
    {
      field: "TAPE_QTY", headerName: "TAPE_QTY", width: 95, cellRenderer: (params: any) => {
        if (params.data.CUST_NAME_KD === 'TOTAL') {
          return <span style={{ fontWeight: 'bold' }}>{params.value?.toLocaleString('en-US')}</span>
        }
        else {
          return <span style={{ fontWeight: 'normal' }}>{params.value?.toLocaleString('en-US')}</span>
        }
      }, cellStyle: (params: any) => {
        if (params.data.CUST_NAME_KD === "TOTAL") {
          return (
            { backgroundColor: "#22e622", color: "#0905ec", textAlign: "right" }
          );
        } else {
          return (
            { textAlign: "right" }
          );
        }
      }
    },
    {
      field: "RIBBON_QTY", headerName: "RIBBON_QTY", width: 95, cellRenderer: (params: any) => {
        if (params.data.CUST_NAME_KD === 'TOTAL') {
          return <span style={{ fontWeight: 'bold' }}>{params.value?.toLocaleString('en-US')}</span>
        }
        else {
          return <span style={{ fontWeight: 'normal' }}>{params.value?.toLocaleString('en-US')}</span>
        }
      }, cellStyle: (params: any) => {
        if (params.data.CUST_NAME_KD === "TOTAL") {
          return (
            { backgroundColor: "#22e622", color: "#0905ec", textAlign: "right" }
          );
        } else {
          return (
            { textAlign: "right" }
          );
        }
      }
    },
    {
      field: "SPT_QTY", headerName: "SPT_QTY", width: 95, cellRenderer: (params: any) => {
        if (params.data.CUST_NAME_KD === 'TOTAL') {
          return <span style={{ fontWeight: 'bold' }}>{params.value?.toLocaleString('en-US')}</span>
        }
        else {
          return <span style={{ fontWeight: 'normal' }}>{params.value?.toLocaleString('en-US')}</span>
        }
      }, cellStyle: (params: any) => {
        if (params.data.CUST_NAME_KD === "TOTAL") {
          return (
            { backgroundColor: "#22e622", color: "#0905ec", textAlign: "right" }
          );
        } else {
          return (
            { textAlign: "right" }
          );
        }
      }
    },
    {
      field: "TSP_AMOUNT", headerName: "TSP_AMOUNT", width: 95, cellRenderer: (params: any) => {
        if (params.data.CUST_NAME_KD === 'TOTAL') {
          return <span style={{ fontWeight: 'bold' }}>{params.value?.toLocaleString('en-US', { style: "currency", currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD", })}</span>
        }
        else {
          return <span style={{ fontWeight: 'normal', color: '#099b2d' }}>{params.value?.toLocaleString('en-US', { style: "currency", currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD", })}</span>
        }
      }, cellStyle: (params: any) => {
        if (params.data.CUST_NAME_KD === "TOTAL") {
          return (
            { backgroundColor: "#22e622", color: "#0905ec", textAlign: "right" }
          );
        } else {
          return (
            { textAlign: "right" }
          );
        }
      }
    },
    {
      field: "LABEL_AMOUNT", headerName: "LABEL_AMOUNT", width: 95, cellRenderer: (params: any) => {
        if (params.data.CUST_NAME_KD === 'TOTAL') {
          return <span style={{ fontWeight: 'bold' }}>{params.value?.toLocaleString('en-US', { style: "currency", currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD", })}</span>
        }
        else {
          return <span style={{ fontWeight: 'normal', color: '#099b2d' }}>{params.value?.toLocaleString('en-US', { style: "currency", currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD", })}</span>
        }
      }, cellStyle: (params: any) => {
        if (params.data.CUST_NAME_KD === "TOTAL") {
          return (
            { backgroundColor: "#22e622", color: "#0905ec", textAlign: "right" }
          );
        } else {
          return (
            { textAlign: "right" }
          );
        }
      }
    },
    {
      field: "UV_AMOUNT", headerName: "UV_AMOUNT", width: 95, cellRenderer: (params: any) => {
        if (params.data.CUST_NAME_KD === 'TOTAL') {
          return <span style={{ fontWeight: 'bold' }}>{params.value?.toLocaleString('en-US', { style: "currency", currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD", })}</span>
        }
        else {
          return <span style={{ fontWeight: 'normal', color: '#099b2d' }}>{params.value?.toLocaleString('en-US', { style: "currency", currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD", })}</span>
        }
      }, cellStyle: (params: any) => {
        if (params.data.CUST_NAME_KD === "TOTAL") {
          return (
            { backgroundColor: "#22e622", color: "#0905ec", textAlign: "right" }
          );
        } else {
          return (
            { textAlign: "right" }
          );
        }
      }
    },
    {
      field: "OLED_AMOUNT", headerName: "OLED_AMOUNT", width: 95, cellRenderer: (params: any) => {
        if (params.data.CUST_NAME_KD === 'TOTAL') {
          return <span style={{ fontWeight: 'bold' }}>{params.value?.toLocaleString('en-US', { style: "currency", currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD", })}</span>
        }
        else {
          return <span style={{ fontWeight: 'normal', color: '#099b2d' }}>{params.value?.toLocaleString('en-US', { style: "currency", currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD", })}</span>
        }
      }, cellStyle: (params: any) => {
        if (params.data.CUST_NAME_KD === "TOTAL") {
          return (
            { backgroundColor: "#22e622", color: "#0905ec", textAlign: "right" }
          );
        } else {
          return (
            { textAlign: "right" }
          );
        }
      }
    },
    {
      field: "TAPE_AMOUNT", headerName: "TAPE_AMOUNT", width: 95, cellRenderer: (params: any) => {
        if (params.data.CUST_NAME_KD === 'TOTAL') {
          return <span style={{ fontWeight: 'bold' }}>{params.value?.toLocaleString('en-US', { style: "currency", currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD", })}</span>
        }
        else {
          return <span style={{ fontWeight: 'normal', color: '#099b2d' }}>{params.value?.toLocaleString('en-US', { style: "currency", currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD", })}</span>
        }
      }, cellStyle: (params: any) => {
        if (params.data.CUST_NAME_KD === "TOTAL") {
          return (
            { backgroundColor: "#22e622", color: "#0905ec", textAlign: "right" }
          );
        } else {
          return (
            { textAlign: "right" }
          );
        }
      }
    },
    {
      field: "RIBBON_AMOUNT", headerName: "RIBBON_AMOUNT", width: 95, cellRenderer: (params: any) => {
        if (params.data.CUST_NAME_KD === 'TOTAL') {
          return <span style={{ fontWeight: 'bold' }}>{params.value?.toLocaleString('en-US', { style: "currency", currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD", })}</span>
        }
        else {
          return <span style={{ fontWeight: 'normal', color: '#099b2d' }}>{params.value?.toLocaleString('en-US', { style: "currency", currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD", })}</span>
        }
      }, cellStyle: (params: any) => {
        if (params.data.CUST_NAME_KD === "TOTAL") {
          return (
            { backgroundColor: "#22e622", color: "#0905ec", textAlign: "right" }
          );
        } else {
          return (
            { textAlign: "right" }
          );
        }
      }
    },
    {
      field: "SPT_AMOUNT", headerName: "SPT_AMOUNT", width: 95, cellRenderer: (params: any) => {
        if (params.data.CUST_NAME_KD === 'TOTAL') {
          return <span style={{ fontWeight: 'bold' }}>{params.value?.toLocaleString('en-US', { style: "currency", currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD", })}</span>
        }
        else {
          return <span style={{ fontWeight: 'normal', color: '#099b2d' }}>{params.value?.toLocaleString('en-US', { style: "currency", currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD", })}</span>
        }
      }, cellStyle: (params: any) => {
        if (params.data.CUST_NAME_KD === "TOTAL") {
          return (
            { backgroundColor: "#22e622", color: "#0905ec", textAlign: "right" }
          );
        } else {
          return (
            { textAlign: "right" }
          );
        }
      }
    }
  ]
  const poDataAGTable = useMemo(() =>
    <AGTable
      suppressRowClickSelection={false}
      showFilter={true}
      toolbar={
        <></>
      }
      columns={columnsAG}
      data={pobalancecustomerbytypedata}
      onCellEditingStopped={(params: any) => {
        //console.log(e.data)
      }} onRowClick={(params: any) => {
        //console.log(params.data)
      }} onSelectionChange={(params: any) => {
        //console.log(params)
        //setSelectedRows(params!.api.getSelectedRows()[0]);
        //console.log(e!.api.getSelectedRows())            
      }}
    />
    , [pobalancecustomerbytypedata, columnsAG]);
  useEffect(() => {
    loadpobalance();
    return () => {
    }
  }, [])
  return (
    <div className='customerpobalance'>
      {
        poDataAGTable
      }
    </div>
  )
}
export default CustomerPobalancebyTypeNew
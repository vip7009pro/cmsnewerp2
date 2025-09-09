import { useState, useEffect, useMemo } from 'react';
import { WEB_SETTING_DATA} from '../../api/GlobalInterface';
import ChartWorstCodeByErrCode from '../Chart/INSPECTION/ChartWorstCodeByErrCode';
import { generalQuery, getGlobalSetting } from '../../api/Api';
import Swal from 'sweetalert2';
import './InspectionWorstTable.scss'
import AGTable from './AGTable';
import { WorstCodeData, WorstData } from '../../pages/qc/interfaces/qcInterface';
const InspectionWorstTable = ({ dailyClosingData, worstby, from_date, to_date, ng_type, listCode, cust_name }: { dailyClosingData: Array<WorstData>, worstby: string, from_date: string, to_date: string, ng_type: string, listCode: string[], cust_name: string }) => {
  //console.log(dailyClosingData)

  const [worstByCodeData, setWorstByCodeData] = useState<Array<WorstCodeData>>([]); 
  const columns = [
    {
      field: "ERR_CODE",
      headerName: "ERR_CODE",
      width: 60,
      cellRenderer: (ele: any) => {
        return (<span style={{ color: "black", fontWeight: "normal" }}>
          {ele.data.ERR_CODE}
        </span>)
      },
    },
    {
      field: "ERR_NAME_VN",
      headerName: "ERR_NAME_VN",
      width: 90,
      cellRenderer: (ele: any) => {
        return (<span style={{ color: "black", fontWeight: "normal" }}>
          {ele.data.ERR_NAME_VN}
        </span>)
      },
    },
    {
      field: "ERR_NAME_KR",
      headerName: "ERR_NAME_KR",
      width: 90,
      cellRenderer: (ele: any) => {
        return (<span style={{ color: "black", fontWeight: "normal" }}>
          {ele.data.ERR_NAME_KR}
        </span>)
      },
    },
    {
      field: "NG_QTY",
      headerName: "NG_QTY",
      width: 90,
      cellRenderer: (ele: any) => {
        return (<span style={{ color: "#050505", fontWeight: "bold" }}>
          {ele.data.NG_QTY.toLocaleString("en-US")}
        </span>)
      },
    },
    {
      field: "NG_AMOUNT",
      headerName: "NG_AMOUNT",
      width: 90,
      cellRenderer: (ele: any) => {
        return (<span style={{ color: "#050505", fontWeight: "bold" }}>
          {ele.data.NG_AMOUNT.toLocaleString("en-US", {
            style: "currency",
            currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
          })}
        </span>)
      },
    },   
  ]

  const worstDataAGTable = useMemo(() =>
    <AGTable
      suppressRowClickSelection={false}
      showFilter={true}
      toolbar={
        <></>
      }
      columns={columns}
      data={dailyClosingData}
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
    , [dailyClosingData, columns]);




  const getWorstByErrCode = (err_code: string) => {
    generalQuery("getInspectionWorstByCode", { FROM_DATE: from_date, TO_DATE: to_date, WORSTBY: worstby, NG_TYPE: ng_type, ERR_CODE: err_code, codeArray: listCode, CUST_NAME_KD: cust_name })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);
          let loadeddata = response.data.data.map(
            (element: WorstCodeData, index: number) => {
              return {
                ...element,
                NG_QTY: Number(element.NG_QTY),
                NG_AMOUNT: Number(element.NG_AMOUNT),
                INSPECT_TOTAL_QTY: Number(element.INSPECT_TOTAL_QTY),
                id: index
              };
            }
          );
          //console.log(loadeddata);
          setWorstByCodeData(loadeddata);
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  useEffect(() => {
    let keysArray = Object.getOwnPropertyNames(dailyClosingData[0]);
    let column_map = keysArray.map((e, index) => {
      if (e !== 'id')
        return {
          field: e,
          headerName: e,
          width: 90,
          cellRenderer: (ele: any) => {
            if (e === 'NG_AMOUNT') {
              return <span style={{ color: "#050505", fontWeight: "bold" }}>
                {ele.data[e]?.toLocaleString("en-US", {
                  style: "currency",
                  currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                })}
              </span>
            }
            else if (e === 'NG_QTY') {
              return <span style={{ color: "#050505", fontWeight: "bold" }}>
                {ele.data[e]?.toLocaleString("en-US",)}
              </span>
            }
            else {
              return (<span style={{ color: "black", fontWeight: "normal" }}>
                {ele.data[e]}
              </span>)
            }
          },
        };
    });     
    getWorstByErrCode(dailyClosingData[0].ERR_CODE);
    return () => {
    }
  }, [dailyClosingData])
  return (
    <div className='worstable' style={{ height: '100%', width: '100%' }}>
      <div className="table">
        {
          worstDataAGTable
        }
      </div>
      <div className="chartworstcode">
        {worstByCodeData.length > 0 && <ChartWorstCodeByErrCode dailyClosingData={worstByCodeData} worstby={worstby} />}
      </div>
    </div>
  )
}
export default InspectionWorstTable
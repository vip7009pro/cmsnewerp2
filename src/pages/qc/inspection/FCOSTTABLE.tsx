import React from 'react'
import './FCOSTTABLE.scss'
import { InspectSummary, PATROL_HEADER_DATA, WEB_SETTING_DATA } from '../../../api/GlobalInterface'
import { getGlobalSetting } from '../../../api/Api'
import { nFormatter } from '../../../api/GlobalFunction'
const FCOSTTABLE = ({ data }: { data: InspectSummary[] }) => {
  return (
    <div className='fcosttable'>
      <table>
        <thead>
          <tr>
            <td>CATEGORY</td>
            <td>INSPECT TOTAL</td>
            <td>INSPECT OK</td>
            <td>PROCESS NG</td>
            <td>MATERIAL NG</td>
            <td>P.NG RATE</td>
            <td>M.NG RATE</td>
            <td>TOTAL NG RATE</td>            
          </tr>
        </thead>
        <tbody>         
            
              <tr>
                <td>QTY</td>
                <td style={{color:'blue', fontWeight:'bold'}}>{`${nFormatter(data[0]?.ISP_TT_QTY, 2)}`}</td>
                <td style={{color:'green', fontWeight:'bold'}}>{`${nFormatter(data[0]?.INSP_OK_QTY, 2)}`}</td>
                <td style={{color:'red', fontWeight:'bold'}}>{`${nFormatter(data[0]?.P_NG_QTY, 2)}`}</td>
                <td style={{color:'red', fontWeight:'bold'}}>{`${nFormatter(data[0]?.M_NG_QTY, 2)}`}</td>
                <td style={{color:'#E8279F', fontWeight:'bold'}}>{`${nFormatter(data[0]?.P_RATE * 1000000, 2)} ppm`}</td>
                <td style={{color:'#E8279F', fontWeight:'bold'}}>{`${nFormatter(data[0]?.M_RATE * 1000000, 2)} ppm`}</td>
                <td style={{color:'#E8279F', fontWeight:'bold'}}>{`${nFormatter(data[0]?.T_RATE * 1000000, 2)} ppm`}</td>                
              </tr>
              <tr>
                <td>AMOUNT</td>
                <td style={{color:'blue', fontWeight:'bold'}}>{nFormatter(data[0]?.ISP_TT_AMOUNT, 2) + (getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE === 'USD' ? ' $' : ' đ') ?? "$"}</td>
                <td style={{color:'green', fontWeight:'bold'}}>{nFormatter(data[0]?.INSP_OK_AMOUNT, 2) + (getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE === 'USD' ? ' $' : ' đ') ?? "$"}</td>
                <td style={{color:'red', fontWeight:'bold'}}>{nFormatter(data[0]?.P_NG_AMOUNT, 2) + (getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE === 'USD' ? ' $' : ' đ') ?? "$"}</td>
                <td style={{color:'red', fontWeight:'bold'}}>{nFormatter(data[0]?.M_NG_AMOUNT, 2) + (getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE === 'USD' ? ' $' : ' đ') ?? "$"}</td>
                <td style={{color:'#E8279F', fontWeight:'bold'}}>{`${(data[0]?.P_A_RATE * 100).toLocaleString('en-US',)}%`}</td>
                <td style={{color:'#E8279F', fontWeight:'bold'}}>{`${(data[0]?.M_A_RATE * 100).toLocaleString('en-US',)}%`}</td>
                <td style={{color:'#E8279F', fontWeight:'bold'}}>{`${(data[0]?.T_A_RATE * 100).toLocaleString('en-US',)}%`}</td>                
              </tr>
        </tbody>
      </table>
    </div>
  )
}
export default FCOSTTABLE